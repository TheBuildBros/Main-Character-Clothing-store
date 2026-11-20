"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { CONTENT } from "./rackContent";
import "./rack.css";

interface GarmentSimState {
  // Pendulum state (degrees, deg/s)
  a: number;
  v: number;
  // Hover/focus turn progress (0 = side, 1 = front)
  k: number;
  targetK: number;
  // Drop-in entrance state
  dropStarted: boolean;
  dropElapsed: number;
  dropDone: boolean;
  landNudged: boolean;
  dropY: number;
  dropOpacity: number;
  // Measured photo aspect ratios (naturalWidth / naturalHeight)
  sideAspect: number;
  frontAspect: number;
}

const DEFAULT_SIDE_ASPECT = 0.31;
const DEFAULT_FRONT_ASPECT = 0.67;
const GAP_PX = 10;
const HOVER_GAP_PX = 18;
const DROP_DURATION = 0.82; // seconds
const DROP_STAGGER = 0.07; // seconds
const TURN_TAU = 0.26; // seconds
const MOBILE_BREAKPOINT = 800;
const MOBILE_GARMENT_HEIGHT = 230;

function smoothstep(x: number): number {
  const t = Math.max(0, Math.min(1, x));
  return t * t * (3 - 2 * t);
}

function getSideWhitenClass(src?: string): string {
  if (!src) return "";
  // Compensate for slightly off-white backgrounds on opaque side assets
  if (src.includes("pant-side")) return "rack-img-soft-whiten-med";
  if (src.includes("t-shirt-side")) return "rack-img-soft-whiten-light";
  if (src.includes("jersey-side")) return "rack-img-soft-whiten-subtle";
  return "";
}

function GarmentPlaceholderSvg({
  variant,
  className = "",
}: {
  variant: "side" | "front";
  className?: string;
}) {
  if (variant === "side") {
    return (
      <svg
        viewBox="0 0 120 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
      >
        {/* Hanger hook */}
        <path
          d="M54 20 C54 10, 68 10, 68 20 C68 27, 60 30, 60 37 L60 50"
          stroke="#8a867e"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        {/* Hanger wood */}
        <path
          d="M52 54 C52 49, 68 49, 68 54 L72 74 L48 74 Z"
          fill="#a8a39a"
        />
        {/* Narrow garment side silhouette */}
        <path
          d="M44 74 C52 68, 72 68, 78 78 L90 120 L86 376 C86 382, 80 386, 74 386 L40 382 C34 382, 30 377, 30 370 L32 126 Z"
          fill="#d3cfc6"
        />
        <path
          d="M58 92 L66 368"
          stroke="#beb9ae"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 268 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Hanger hook */}
      <path
        d="M127 20 C127 10, 143 10, 143 20 C143 27, 134 30, 134 37 L134 50"
        stroke="#8a867e"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Hanger shoulders */}
      <path
        d="M134 50 L82 76 L186 76 Z"
        fill="#a8a39a"
        stroke="#a8a39a"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/* Wide garment front silhouette */}
      <path
        d="M104 72 C116 84, 152 84, 164 72 L212 90 L246 198 L206 212 L194 152 L198 378 C198 384, 193 388, 187 388 L81 388 C75 388, 70 384, 70 378 L74 152 L62 212 L22 198 L56 90 Z"
        fill="#d3cfc6"
      />
    </svg>
  );
}

export default function ClothingRackHero() {
  const items = CONTENT.rack;

  // Split headline so the last word renders at 35% opacity
  const headlineWords = CONTENT.headline.trim().split(/\s+/);
  const headlineLastWord =
    headlineWords.length > 1 ? headlineWords[headlineWords.length - 1] : "";
  const headlineLeading =
    headlineWords.length > 1
      ? headlineWords.slice(0, -1).join(" ")
      : CONTENT.headline;

  // DOM refs
  const sectionRef = useRef<HTMLElement | null>(null);
  const rackAreaRef = useRef<HTMLDivElement | null>(null);
  const slotRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const mediaLayerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sideWrapRefs = useRef<(HTMLDivElement | null)[]>([]);
  const frontWrapRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sideImgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const frontImgRefs = useRef<(HTMLImageElement | null)[]>([]);

  // React UI state (updated only on discrete user actions, never per RAF frame)
  const [garmentHeight, setGarmentHeight] = useState<number>(320);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  // Mutable simulation & environment state accessed by the single RAF loop
  const simRef = useRef<{
    rafId: number | null;
    lastTime: number;
    height: number;
    isMobile: boolean;
    canHover: boolean;
    reducedMotion: boolean;
    inView: boolean;
    garments: GarmentSimState[];
  }>({
    rafId: null,
    lastTime: 0,
    height: 320,
    isMobile: false,
    canHover: false,
    reducedMotion: false,
    inView: false,
    garments: items.map((_, i) => ({
      a: 0,
      v: 0,
      k: 0,
      targetK: 0,
      dropStarted: false,
      dropElapsed: -i * DROP_STAGGER,
      dropDone: false,
      landNudged: false,
      dropY: -150,
      dropOpacity: 0,
      sideAspect: DEFAULT_SIDE_ASPECT,
      frontAspect: DEFAULT_FRONT_ASPECT,
    })),
  });

  // Apply computed visual transforms and sizes for one garment directly to DOM
  const applyGarmentDom = useCallback((i: number) => {
    const sim = simRef.current;
    const g = sim.garments[i];
    if (!g) return;

    const h = sim.height;
    const e = smoothstep(g.k);

    const sideW = h * g.sideAspect;
    const frontW = h * g.frontAspect;
    const currentW = sideW + (frontW - sideW) * e;
    const extraMargin = sim.isMobile ? 0 : HOVER_GAP_PX * e;

    const slotEl = slotRefs.current[i];
    if (slotEl) {
      slotEl.style.width = `${currentW.toFixed(2)}px`;
      slotEl.style.height = `${h.toFixed(2)}px`;
      slotEl.style.marginLeft = `${extraMargin.toFixed(2)}px`;
      slotEl.style.marginRight = `${extraMargin.toFixed(2)}px`;
    }

    const liftY = -6 * e;
    const totalY = g.dropY + liftY;
    const wholeRotY = -12 * (1 - e);
    const visible = g.dropOpacity > 0.001;
    const opacityStr = g.dropOpacity.toFixed(3);
    const visibilityStr = visible ? "visible" : "hidden";

    const mediaEl = mediaLayerRefs.current[i];
    if (mediaEl) {
      mediaEl.style.transform = `translate3d(0, ${totalY.toFixed(2)}px, 0) rotate(${g.a.toFixed(2)}deg) perspective(900px) rotateY(${wholeRotY.toFixed(2)}deg)`;
      mediaEl.style.opacity = opacityStr;
      mediaEl.style.visibility = visibilityStr;
      mediaEl.style.zIndex = e > 0.02 ? "10" : "1";
    }

    // Side photo: rotates perspective(900px) rotateY(0 -> -88deg) in first half, disappears edge-on
    const sideEl = sideWrapRefs.current[i];
    if (sideEl) {
      if (e < 0.5) {
        const p1 = e / 0.5;
        const sideRotY = -88 * p1;
        const sideOpacity = e > 0.44 ? Math.max(0, (0.5 - e) / 0.06) : 1;
        sideEl.style.transform = `perspective(900px) rotateY(${sideRotY.toFixed(2)}deg)`;
        sideEl.style.opacity = sideOpacity.toFixed(3);
        sideEl.style.visibility = "visible";
      } else {
        sideEl.style.opacity = "0";
        sideEl.style.visibility = "hidden";
      }
    }

    // Front photo: fades in over second half while scaling 0.9 -> 1
    const frontEl = frontWrapRefs.current[i];
    if (frontEl) {
      if (e > 0.5) {
        const p2 = (e - 0.5) / 0.5;
        const frontScale = 0.9 + 0.1 * p2;
        frontEl.style.transform = `scale(${frontScale.toFixed(4)})`;
        frontEl.style.opacity = p2.toFixed(3);
        frontEl.style.visibility = "visible";
      } else {
        frontEl.style.opacity = "0";
        frontEl.style.visibility = "hidden";
        frontEl.style.transform = "scale(0.9)";
      }
    }
  }, []);

  const applyAllGarmentsDom = useCallback(() => {
    const count = simRef.current.garments.length;
    for (let i = 0; i < count; i++) {
      applyGarmentDom(i);
    }
  }, [applyGarmentDom]);

  // Single requestAnimationFrame loop — sleeps when everything has settled
  const stepSimulation = useCallback(
    (now: number) => {
      const sim = simRef.current;
      const dt = Math.min(Math.max((now - sim.lastTime) / 1000, 0), 1);
      sim.lastTime = now;

      let moving = false;

      for (let i = 0; i < sim.garments.length; i++) {
        const g = sim.garments[i];

        // 1. Drop-in entrance
        if (g.dropStarted && !g.dropDone) {
          g.dropElapsed += dt;
          if (g.dropElapsed <= 0) {
            g.dropY = -150;
            g.dropOpacity = 0;
            moving = true;
          } else {
            const t = Math.min(g.dropElapsed / DROP_DURATION, 1);
            // Fall from -150px to +5px overshoot at t=0.68, then settle cleanly to 0px
            const LAND_T = 0.68;
            if (t <= LAND_T) {
              const u = t / LAND_T;
              g.dropY = -150 + 155 * (1 - Math.pow(1 - u, 2.4));
            } else {
              const u = (t - LAND_T) / (1 - LAND_T);
              g.dropY = 5 * (1 - smoothstep(u));
            }

            g.dropOpacity = smoothstep(t / 0.45);

            // Sideways landing nudge alternating direction, 16-30 deg/s
            if (t >= LAND_T && !g.landNudged) {
              g.landNudged = true;
              const dir = i % 2 === 0 ? 1 : -1;
              const speed = 16 + ((i * 7 + 3) % 15); // 16..30 deg/s
              g.v += dir * speed;
            }

            if (t >= 1) {
              g.dropDone = true;
              g.dropY = 0;
              g.dropOpacity = 1;
            } else {
              moving = true;
            }
          }
        }

        // 2. Damped pendulum physics in sub-steps of <= 16ms
        if (g.a !== 0 || g.v !== 0) {
          const MAX_STEP = 0.016;
          let rem = dt;
          while (rem > 0) {
            const hStep = Math.min(rem, MAX_STEP);
            g.v += (-30 * g.a - 2.4 * g.v) * hStep;
            g.a += g.v * hStep;
            if (g.a > 12) {
              g.a = 12;
              if (g.v > 0) g.v = -g.v * 0.3;
            } else if (g.a < -12) {
              g.a = -12;
              if (g.v < 0) g.v = -g.v * 0.3;
            }
            rem -= hStep;
          }

          if (Math.abs(g.a) < 0.01 && Math.abs(g.v) < 0.02) {
            g.a = 0;
            g.v = 0;
          } else {
            moving = true;
          }
        }

        // 3. Hover / focus turn exponential smoothing (tau ~260ms)
        if (g.k !== g.targetK) {
          if (sim.reducedMotion) {
            g.k = g.targetK;
          } else {
            const alpha = 1 - Math.exp(-dt / TURN_TAU);
            g.k += (g.targetK - g.k) * alpha;
            if (Math.abs(g.targetK - g.k) < 0.001) {
              g.k = g.targetK;
            } else {
              moving = true;
            }
          }
        }

        applyGarmentDom(i);
      }

      if (moving) {
        sim.rafId = window.requestAnimationFrame(stepSimulation);
      } else {
        sim.rafId = null;
      }
    },
    [applyGarmentDom]
  );

  const wakeSimulation = useCallback(() => {
    const sim = simRef.current;
    if (sim.rafId !== null) return;
    sim.lastTime = performance.now();
    sim.rafId = window.requestAnimationFrame(stepSimulation);
  }, [stepSimulation]);

  // Recalculate garment height based on viewport & loaded image aspect ratios
  const recalculateSizing = useCallback(() => {
    const sim = simRef.current;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const mobile = vw < MOBILE_BREAKPOINT;

    let nextH = MOBILE_GARMENT_HEIGHT;

    if (!mobile) {
      const containerW = rackAreaRef.current
        ? rackAreaRef.current.clientWidth
        : Math.min(vw - 48, 1280);
      const count = sim.garments.length;
      const totalGaps = Math.max(0, count - 1) * GAP_PX;

      let sumSide = 0;
      let maxDelta = 0;
      for (const g of sim.garments) {
        sumSide += g.sideAspect;
        const delta = g.frontAspect - g.sideAspect;
        if (delta > maxDelta) maxDelta = delta;
      }

      const denom = Math.max(sumSide + maxDelta, 0.5);
      const rawH = (containerW - totalGaps - 2 * HOVER_GAP_PX) / denom;
      const maxH = Math.min(420, vh * 0.4);
      nextH = Math.max(120, Math.min(maxH, rawH));
    }

    sim.height = nextH;
    sim.isMobile = mobile;
    setGarmentHeight(nextH);
    setIsMobile(mobile);
    applyAllGarmentsDom();
  }, [applyAllGarmentsDom]);

  // Knock neighboring garments away when hover/focus starts on garment `index`
  const knockNeighbors = useCallback((index: number) => {
    const sim = simRef.current;
    if (sim.reducedMotion) return;
    const gs = sim.garments;

    if (index - 1 >= 0) gs[index - 1].v += 30;
    if (index + 1 < gs.length) gs[index + 1].v -= 30;
    if (index - 2 >= 0) gs[index - 2].v += 11;
    if (index + 2 < gs.length) gs[index + 2].v -= 11;
  }, []);

  const activateGarmentHover = useCallback(
    (index: number) => {
      const sim = simRef.current;
      const g = sim.garments[index];
      if (!g) return;

      const wasResting = g.targetK === 0;
      // Ensure only this garment is turned open
      for (let i = 0; i < sim.garments.length; i++) {
        sim.garments[i].targetK = i === index ? 1 : 0;
      }

      if (wasResting) {
        knockNeighbors(index);
      }

      setHoveredIndex(index);

      if (sim.reducedMotion) {
        for (let i = 0; i < sim.garments.length; i++) {
          sim.garments[i].k = sim.garments[i].targetK;
        }
        applyAllGarmentsDom();
      } else {
        wakeSimulation();
      }
    },
    [knockNeighbors, applyAllGarmentsDom, wakeSimulation]
  );

  const deactivateGarmentHover = useCallback(
    (index: number) => {
      const sim = simRef.current;
      const g = sim.garments[index];
      if (!g) return;

      g.targetK = 0;
      setHoveredIndex((prev) => (prev === index ? null : prev));

      if (sim.reducedMotion) {
        g.k = 0;
        applyGarmentDom(index);
      } else {
        wakeSimulation();
      }
    },
    [applyGarmentDom, wakeSimulation]
  );

  // Setup media queries, cached image aspect checks, ResizeObserver, IntersectionObserver, and Scroll Breeze
  useEffect(() => {
    const sim = simRef.current;

    const hoverMq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const syncMedia = () => {
      sim.canHover = hoverMq.matches;
      sim.reducedMotion = motionMq.matches;

      if (motionMq.matches) {
        for (const g of sim.garments) {
          g.a = 0;
          g.v = 0;
          g.dropStarted = true;
          g.dropDone = true;
          g.dropY = 0;
          g.dropOpacity = 1;
          g.k = g.targetK;
        }
        applyAllGarmentsDom();
      }
    };

    syncMedia();
    hoverMq.addEventListener("change", syncMedia);
    motionMq.addEventListener("change", syncMedia);

    // Read already-cached image dimensions if complete before hydration
    for (let i = 0; i < sim.garments.length; i++) {
      const sImg = sideImgRefs.current[i];
      if (
        sImg &&
        sImg.complete &&
        sImg.naturalWidth > 0 &&
        sImg.naturalHeight > 0
      ) {
        sim.garments[i].sideAspect = sImg.naturalWidth / sImg.naturalHeight;
      }
      const fImg = frontImgRefs.current[i];
      if (
        fImg &&
        fImg.complete &&
        fImg.naturalWidth > 0 &&
        fImg.naturalHeight > 0
      ) {
        sim.garments[i].frontAspect = fImg.naturalWidth / fImg.naturalHeight;
      }
    }

    recalculateSizing();

    // Window & container resize handling
    window.addEventListener("resize", recalculateSizing);
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && rackAreaRef.current) {
      resizeObserver = new ResizeObserver(() => {
        recalculateSizing();
      });
      resizeObserver.observe(rackAreaRef.current);
    }

    // IntersectionObserver for drop-in entrance & scroll-breeze visibility tracking
    let io: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== "undefined" && sectionRef.current) {
      io = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (!entry) return;
          sim.inView = entry.isIntersecting;

          if (entry.isIntersecting) {
            let needsWake = false;
            for (const g of sim.garments) {
              if (!g.dropStarted) {
                g.dropStarted = true;
                if (sim.reducedMotion) {
                  g.dropDone = true;
                  g.dropY = 0;
                  g.dropOpacity = 1;
                } else {
                  needsWake = true;
                }
              }
            }
            if (sim.reducedMotion) {
              applyAllGarmentsDom();
            } else if (needsWake) {
              wakeSimulation();
            }
          }
        },
        { threshold: 0.12 }
      );
      io.observe(sectionRef.current);
    } else {
      // Fallback if IntersectionObserver unavailable
      sim.inView = true;
      for (const g of sim.garments) {
        g.dropStarted = true;
        if (sim.reducedMotion) {
          g.dropDone = true;
          g.dropY = 0;
          g.dropOpacity = 1;
        }
      }
      if (sim.reducedMotion) applyAllGarmentsDom();
      else wakeSimulation();
    }

    // Scroll breeze (throttled every 100ms, max ±12 deg/s, varied via sin(i*2.1 + 1))
    let lastScrollTime = performance.now();
    let lastScrollY = window.scrollY;
    let lastThrottleRun = 0;

    const handleScroll = () => {
      const now = performance.now();
      if (now - lastThrottleRun < 100) return;
      lastThrottleRun = now;

      const currentY = window.scrollY;
      const dtScroll = Math.max((now - lastScrollTime) / 1000, 0.05);
      const dy = currentY - lastScrollY;
      lastScrollY = currentY;
      lastScrollTime = now;

      if (!sim.inView || sim.reducedMotion) return;
      if (Math.abs(dy) < 1) return;

      const scrollSpeed = dy / dtScroll; // px/s
      const breezeBase = Math.max(-12, Math.min(12, scrollSpeed * 0.009));

      let nudged = false;
      for (let i = 0; i < sim.garments.length; i++) {
        const g = sim.garments[i];
        if (!g.dropDone) continue;
        const impulse = breezeBase * Math.sin(i * 2.1 + 1);
        g.v += Math.max(-12, Math.min(12, impulse));
        nudged = true;
      }

      if (nudged) {
        wakeSimulation();
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      if (sim.rafId !== null) {
        window.cancelAnimationFrame(sim.rafId);
        sim.rafId = null;
      }
      hoverMq.removeEventListener("change", syncMedia);
      motionMq.removeEventListener("change", syncMedia);
      window.removeEventListener("resize", recalculateSizing);
      window.removeEventListener("scroll", handleScroll);
      resizeObserver?.disconnect();
      io?.disconnect();
    };
  }, [recalculateSizing, applyAllGarmentsDom, wakeSimulation]);

  // Image aspect load callbacks
  const handleImageLoad = (
    index: number,
    kind: "side" | "front",
    e: React.SyntheticEvent<HTMLImageElement>
  ) => {
    const img = e.currentTarget;
    if (img.naturalWidth > 0 && img.naturalHeight > 0) {
      const ratio = img.naturalWidth / img.naturalHeight;
      const g = simRef.current.garments[index];
      if (!g) return;
      if (kind === "side") {
        g.sideAspect = ratio;
      } else {
        g.frontAspect = ratio;
      }
      recalculateSizing();
    }
  };

  const handleImageError = (index: number, kind: "side" | "front") => {
    setFailedImages((prev) => ({ ...prev, [`${index}-${kind}`]: true }));
  };

  // Pull garment hooks slightly up onto the 8px rod so hook tops touch the rod cleanly
  const hookLiftOffset = Math.round(garmentHeight * 0.058) + 3;

  return (
    <section
      ref={sectionRef}
      aria-label="Shop by Category Clothing Rack"
      className="rack-hero-bg relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-x-clip px-4 pt-24 pb-10 sm:px-8 sm:pt-24 sm:pb-12 lg:px-12 text-neutral-950"
    >
      {/* Top Eyebrow */}
      <div className="rack-fade-up rack-fade-delay-0 mb-3.5 flex items-center justify-center gap-3 text-[12px] font-semibold uppercase tracking-[2px] text-neutral-950 select-none">
        <span>{CONTENT.eyebrow.title}</span>
        <span aria-hidden="true" className="h-3 w-px bg-neutral-950/25" />
        <span className="opacity-45">{CONTENT.eyebrow.subtitle}</span>
      </div>

      {/* Headline */}
      <h1
        className="rack-fade-up rack-fade-delay-1 mb-7 sm:mb-8 text-center font-extrabold uppercase text-neutral-950 select-none"
        style={{
          fontSize: "clamp(40px, 6.5vw, 92px)",
          lineHeight: 0.95,
          letterSpacing: "-0.045em",
          maxWidth: "14ch",
        }}
      >
        {headlineLeading}{" "}
        {headlineLastWord && (
          <span className="opacity-35">{headlineLastWord}</span>
        )}
      </h1>

      {/* Clothes Rod & Hanging Garments */}
      <div
        ref={rackAreaRef}
        className={`relative w-full max-w-[1280px] ${
          isMobile ? "rack-scroll-track overflow-x-auto pb-4" : ""
        }`}
      >
        <div
          className={`relative flex flex-col ${
            isMobile ? "min-w-max px-6" : "w-full"
          }`}
        >
          {/* Full-width Chrome Clothes Rod with end caps */}
          <div className="relative z-20 flex w-full items-center">
            <div className="rack-rod-cap shrink-0" aria-hidden="true" />
            <div className="rack-rod flex-1" aria-hidden="true" />
            <div className="rack-rod-cap shrink-0" aria-hidden="true" />
          </div>

          {/* Hanging Garment Row */}
          <div
            className={`relative flex items-start gap-[10px] ${
              isMobile ? "justify-start px-3" : "justify-center"
            }`}
            style={{
              marginTop: `-${hookLiftOffset}px`,
              minHeight: `${garmentHeight}px`,
            }}
          >
            {items.map((item, i) => {
              const sideFailed = !item.side || Boolean(failedImages[`${i}-side`]);
              const frontFailed =
                !item.front || Boolean(failedImages[`${i}-front`]);
              const sideWhiten = getSideWhitenClass(item.side);
              const flipStyle = item.flipX
                ? ({ transform: "scaleX(-1)" } as const)
                : undefined;

              return (
                <Link
                  key={item.name}
                  href={item.url}
                  ref={(el) => {
                    slotRefs.current[i] = el;
                  }}
                  aria-label={`Shop ${item.name}`}
                  onMouseEnter={() => {
                    if (simRef.current.canHover) {
                      activateGarmentHover(i);
                    }
                  }}
                  onMouseLeave={() => {
                    if (simRef.current.canHover) {
                      deactivateGarmentHover(i);
                    }
                  }}
                  onFocus={(e) => {
                    if (e.currentTarget.matches(":focus-visible")) {
                      activateGarmentHover(i);
                    }
                  }}
                  onBlur={() => {
                    deactivateGarmentHover(i);
                  }}
                  className="rack-garment-link relative block shrink-0 cursor-pointer no-underline focus:outline-none"
                  style={{
                    width: `${(garmentHeight * DEFAULT_SIDE_ASPECT).toFixed(2)}px`,
                    height: `${garmentHeight}px`,
                  }}
                >
                  {/* Garment Photos (mix-blend-mode: multiply blends seamlessly onto warm backdrop) */}
                  <div
                    ref={(el) => {
                      mediaLayerRefs.current[i] = el;
                    }}
                    className="rack-garment-media pointer-events-none absolute inset-0"
                    style={{
                      transformOrigin: "top center",
                      opacity: 0,
                      visibility: "hidden",
                      willChange: "transform, opacity",
                    }}
                  >
                    {/* Narrow Side View */}
                    <div
                      ref={(el) => {
                        sideWrapRefs.current[i] = el;
                      }}
                      className="absolute inset-0 flex items-start justify-center"
                      style={{ transformOrigin: "center center" }}
                    >
                      {/* Inner wrapper isolates optional flipX from 3D turn/swing transforms */}
                      <div
                        className="flex h-full items-start justify-center"
                        style={flipStyle}
                      >
                        {!sideFailed ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            ref={(el) => {
                              sideImgRefs.current[i] = el;
                            }}
                            src={item.side}
                            alt={`${item.name} side view`}
                            draggable={false}
                            onLoad={(e) => handleImageLoad(i, "side", e)}
                            onError={() => handleImageError(i, "side")}
                            className={`h-full w-auto max-w-none select-none object-contain ${sideWhiten}`}
                          />
                        ) : (
                          <GarmentPlaceholderSvg
                            variant="side"
                            className="h-full w-auto"
                          />
                        )}
                      </div>
                    </div>

                    {/* Wide Front View (revealed on second half of hover turn) */}
                    <div
                      ref={(el) => {
                        frontWrapRefs.current[i] = el;
                      }}
                      className="absolute inset-0 flex items-start justify-center"
                      style={{
                        transformOrigin: "center center",
                        opacity: 0,
                        visibility: "hidden",
                        transform: "scale(0.9)",
                      }}
                    >
                      {/* Inner wrapper isolates optional flipX from 3D turn/swing transforms */}
                      <div
                        className="flex h-full items-start justify-center"
                        style={flipStyle}
                      >
                        {!frontFailed ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            ref={(el) => {
                              frontImgRefs.current[i] = el;
                            }}
                            src={item.front}
                            alt={`${item.name} front view`}
                            draggable={false}
                            onLoad={(e) => handleImageLoad(i, "front", e)}
                            onError={() => handleImageError(i, "front")}
                            className="h-full w-auto max-w-none select-none object-contain"
                          />
                        ) : (
                          <GarmentPlaceholderSvg
                            variant="front"
                            className="h-full w-auto"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Below the Rack: Crossfading Category Caption + Pill CTA Button */}
      <div className="rack-fade-up rack-fade-delay-2 mt-6 sm:mt-7 flex flex-col items-center gap-3.5">
        {/* 15px font-weight 600 line that crossfades to hovered category name */}
        <div
          aria-live="polite"
          className="relative h-[22px] min-w-[240px] text-center text-[15px] font-semibold leading-[22px] text-neutral-900"
        >
          <span
            className="absolute inset-0 flex items-center justify-center transition-all duration-200 whitespace-nowrap"
            style={{
              opacity: hoveredIndex === null ? 1 : 0,
              transform:
                hoveredIndex === null
                  ? "translateY(0px)"
                  : "translateY(-4px)",
            }}
          >
            {CONTENT.restingCaption}
          </span>
          <span
            className="absolute inset-0 flex items-center justify-center transition-all duration-200 whitespace-nowrap"
            style={{
              opacity: hoveredIndex !== null ? 1 : 0,
              transform:
                hoveredIndex !== null
                  ? "translateY(0px)"
                  : "translateY(4px)",
            }}
          >
            {hoveredIndex !== null ? items[hoveredIndex]?.name : ""}
          </span>
        </div>

        {/* Cream Pill Button — turns black and lifts 1px on hover */}
        <Link
          href={CONTENT.cta.href}
          className="inline-flex items-center justify-center rounded-full border border-neutral-950/15 bg-[#faf6ec] px-7 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-950 shadow-[0_2px_8px_rgba(24,20,14,0.06)] transition-all duration-200 hover:-translate-y-[1px] hover:border-black hover:bg-black hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950"
        >
          {CONTENT.cta.label}
        </Link>
      </div>
    </section>
  );
}
