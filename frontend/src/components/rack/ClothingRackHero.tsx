"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { CONTENT } from "./rackContent";
import ProductPopup, { GarmentPlaceholderSvg } from "./ProductPopup";

interface GarmentSimState {
  // Pendulum state (degrees, deg/s)
  a: number;
  v: number;
  // Trailing price tag angle (degrees)
  tagAngle: number;
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

function formatTagPrice(price: string): string {
  return price.replace(/\.00$/, "");
}

function getSideWhitenClass(src?: string): string {
  if (!src) return "";
  // Compensate for slightly off-white backgrounds on opaque side assets
  if (src.includes("pant-side")) return "rack-img-soft-whiten-med";
  if (src.includes("t-shirt-side")) return "rack-img-soft-whiten-light";
  if (src.includes("jersey-side")) return "rack-img-soft-whiten-subtle";
  return "";
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
  const slotRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const mediaLayerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tagLayerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tagPivotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sideWrapRefs = useRef<(HTMLDivElement | null)[]>([]);
  const frontWrapRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sideImgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const frontImgRefs = useRef<(HTMLImageElement | null)[]>([]);

  // React UI state (updated only on discrete user actions, never per RAF frame)
  const [garmentHeight, setGarmentHeight] = useState<number>(320);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [popupOriginRect, setPopupOriginRect] = useState<DOMRect | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] =
    useState<boolean>(false);
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
    hiddenIndex: number | null;
    garments: GarmentSimState[];
  }>({
    rafId: null,
    lastTime: 0,
    height: 320,
    isMobile: false,
    canHover: false,
    reducedMotion: false,
    inView: false,
    hiddenIndex: null,
    garments: items.map((_, i) => ({
      a: 0,
      v: 0,
      tagAngle: 0,
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
    const isHiddenForPopup = sim.hiddenIndex === i;

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
    const visible = !isHiddenForPopup && g.dropOpacity > 0.001;
    const opacityStr = isHiddenForPopup ? "0" : g.dropOpacity.toFixed(3);
    const visibilityStr = visible ? "visible" : "hidden";

    const mediaEl = mediaLayerRefs.current[i];
    if (mediaEl) {
      mediaEl.style.transform = `translate3d(0, ${totalY.toFixed(2)}px, 0) rotate(${g.a.toFixed(2)}deg) perspective(900px) rotateY(${wholeRotY.toFixed(2)}deg)`;
      mediaEl.style.opacity = opacityStr;
      mediaEl.style.visibility = visibilityStr;
      mediaEl.style.zIndex = e > 0.02 ? "10" : "1";
    }

    const tagLayerEl = tagLayerRefs.current[i];
    if (tagLayerEl) {
      tagLayerEl.style.transform = `translate3d(0, ${totalY.toFixed(2)}px, 0) rotate(${g.a.toFixed(2)}deg)`;
      tagLayerEl.style.opacity = opacityStr;
      tagLayerEl.style.visibility = visibilityStr;
      tagLayerEl.style.zIndex = e > 0.02 ? "11" : "2";
    }

    const tagPivotEl = tagPivotRefs.current[i];
    if (tagPivotEl) {
      const tagDiff = g.a - g.tagAngle;
      tagPivotEl.style.transform = `rotate(${(-24 + tagDiff).toFixed(2)}deg)`;
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

        // 3. Tag lag: tagAngle += (a - tagAngle) * (1 - e^(-7 * dt))
        if (g.a !== 0 || g.tagAngle !== 0) {
          g.tagAngle += (g.a - g.tagAngle) * (1 - Math.exp(-7 * dt));
          if (g.a === 0 && Math.abs(g.tagAngle) < 0.01) {
            g.tagAngle = 0;
          } else {
            moving = true;
          }
        }

        // 4. Hover / focus turn exponential smoothing (tau ~260ms)
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
      if (sim.hiddenIndex !== null) return;
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
      setPrefersReducedMotion(motionMq.matches);

      if (motionMq.matches) {
        for (const g of sim.garments) {
          g.a = 0;
          g.v = 0;
          g.tagAngle = 0;
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
      if (sImg && sImg.complete && sImg.naturalWidth > 0 && sImg.naturalHeight > 0) {
        sim.garments[i].sideAspect = sImg.naturalWidth / sImg.naturalHeight;
      }
      const fImg = frontImgRefs.current[i];
      if (fImg && fImg.complete && fImg.naturalWidth > 0 && fImg.naturalHeight > 0) {
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

      if (!sim.inView || sim.reducedMotion || sim.hiddenIndex !== null) return;
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

  // Open product popup on garment click
  const handleGarmentClick = (index: number) => {
    const slotEl = slotRefs.current[index];
    const rect = slotEl ? slotEl.getBoundingClientRect() : null;

    simRef.current.hiddenIndex = index;
    applyGarmentDom(index);

    setPopupOriginRect(rect);
    setOpenIndex(index);
  };

  // Restore garment on rack when popup finishes closing
  const handlePopupCloseComplete = useCallback(() => {
    const closedIdx = simRef.current.hiddenIndex;
    simRef.current.hiddenIndex = null;

    if (closedIdx !== null) {
      const g = simRef.current.garments[closedIdx];
      if (g) {
        g.targetK = 0;
        if (simRef.current.reducedMotion) {
          g.k = 0;
        } else {
          // Hang-back swing nudge
          const dir = closedIdx % 2 === 0 ? 1 : -1;
          g.v += dir * 26;
        }
      }
      applyGarmentDom(closedIdx);
      if (!simRef.current.reducedMotion) {
        wakeSimulation();
      }
    }

    setOpenIndex(null);
    setHoveredIndex(null);
    setPopupOriginRect(null);

    // Return keyboard focus to the garment button that opened the popup
    if (closedIdx !== null) {
      window.requestAnimationFrame(() => {
        slotRefs.current[closedIdx]?.focus();
      });
    }
  }, [applyGarmentDom, wakeSimulation]);

  // Pull garment hooks slightly up onto the 8px rod so hook tops touch the rod cleanly
  const hookLiftOffset = Math.round(garmentHeight * 0.058) + 3;

  return (
    <section
      ref={sectionRef}
      aria-label="New Season Clothing Rack"
      className="rack-hero-bg relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-x-clip px-4 py-6 sm:px-8 sm:py-8 lg:px-12 text-[#20242B]"
    >
      {/* Top Eyebrow — Luxury Editorial Label */}
      <div
        className="rack-fade-up rack-fade-delay-0 mb-5 flex items-center justify-center gap-4 select-none"
      >
        <span className="h-px w-8 bg-[#20242B]/20" aria-hidden="true" />
        <span className="text-[9px] font-semibold uppercase tracking-[0.38em] text-[#20242B]/60">
          {CONTENT.eyebrow.title}
        </span>
        <span
          aria-hidden="true"
          className="h-[3px] w-[3px] rounded-full bg-[#C6A76A]"
        />
        <span className="text-[9px] font-semibold uppercase tracking-[0.38em] text-[#20242B]/38">
          {CONTENT.eyebrow.subtitle}
        </span>
        <span className="h-px w-8 bg-[#20242B]/20" aria-hidden="true" />
      </div>

      {/* Headline — Luxury Serif Editorial */}
      <h1
        className="rack-fade-up rack-fade-delay-1 mb-8 sm:mb-10 text-center select-none"
        style={{
          fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
          fontSize: "clamp(48px, 7.5vw, 108px)",
          lineHeight: 0.9,
          letterSpacing: "-0.02em",
          maxWidth: "16ch",
          fontWeight: 600,
          color: "#0B1F3A",
          fontStyle: "italic",
        }}
      >
        {headlineLeading}{" "}
        {headlineLastWord && (
          <span style={{ opacity: 0.3, fontStyle: "normal", fontWeight: 300 }}>
            {headlineLastWord}
          </span>
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
              const frontFailed = !item.front || Boolean(failedImages[`${i}-front`]);
              const tagPrice = formatTagPrice(item.price);
              const sideWhiten = getSideWhitenClass(item.side);

              return (
                <button
                  key={item.name}
                  ref={(el) => {
                    slotRefs.current[i] = el;
                  }}
                  type="button"
                  aria-label={`Inspect ${item.name}, ${item.price}`}
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
                  onClick={() => handleGarmentClick(i)}
                  className="rack-garment-btn relative shrink-0 cursor-pointer border-0 bg-transparent p-0 text-left focus:outline-none"
                  style={{
                    width: `${(garmentHeight * DEFAULT_SIDE_ASPECT).toFixed(2)}px`,
                    height: `${garmentHeight}px`,
                  }}
                >
                  {/* Layer 1: Garment Photos (mix-blend-mode: multiply blends seamlessly onto warm backdrop) */}
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

                  {/* Layer 2: Opaque Cream Price Tag & String (sibling so multiply does not darken the cream card) */}
                  <div
                    ref={(el) => {
                      tagLayerRefs.current[i] = el;
                    }}
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0"
                    style={{
                      transformOrigin: "top center",
                      opacity: 0,
                      visibility: "hidden",
                      willChange: "transform, opacity",
                    }}
                  >
                    {/* Anchor near garment shoulder on right side */}
                    <div
                      className="absolute"
                      style={{
                        top: "20%",
                        right: "16%",
                      }}
                    >
                      {/* String + tag pendulum trailing garment swing */}
                      <div
                        ref={(el) => {
                          tagPivotRefs.current[i] = el;
                        }}
                        className="flex flex-col items-center"
                        style={{
                          transformOrigin: "top center",
                          transform: "rotate(-24deg)",
                        }}
                      >
                        {/* Thin twine string */}
                        <div className="h-[18px] w-px bg-neutral-700/45" />

                        {/* Cream price tag card counter-rotated ~16deg so it hangs nearly upright */}
                        <div
                          className="relative -mt-[2px] flex flex-col items-center rounded-t-[2px] rounded-b-[6px] border border-[#3c3020]/15 bg-[#faf6ec] px-2 pt-1.5 pb-1.5 shadow-[0_4px_10px_rgba(30,24,15,0.14)]"
                          style={{
                            transformOrigin: "top center",
                            transform: "rotate(16deg)",
                          }}
                        >
                          {/* Punched hole at top */}
                          <span className="mb-1 h-[4px] w-[4px] rounded-full border border-[#3c3020]/30 bg-[#efeae0]" />
                          <span className="text-[10px] font-bold leading-none tracking-tight text-neutral-900 tabular-nums whitespace-nowrap">
                            {tagPrice}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Below the Rack: Crossfading Text Line + Luxury CTA Button */}
      <div className="rack-fade-up rack-fade-delay-2 mt-8 sm:mt-10 flex flex-col items-center gap-5">
        {/* Crossfading product name label */}
        <div
          aria-live="polite"
          className="relative h-6 min-w-[240px] text-center"
        >
          <span
            className="absolute inset-0 flex items-center justify-center text-[11px] font-medium uppercase tracking-[0.28em] text-[#20242B]/55 transition-all duration-300"
            style={{
              opacity: hoveredIndex === null ? 1 : 0,
              transform:
                hoveredIndex === null
                  ? "translateY(0px)"
                  : "translateY(-6px)",
            }}
          >
            {CONTENT.cta.label}
          </span>
          <span
            className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold uppercase tracking-[0.28em] text-[#0B1F3A] transition-all duration-300"
            style={{
              opacity: hoveredIndex !== null ? 1 : 0,
              transform:
                hoveredIndex !== null
                  ? "translateY(0px)"
                  : "translateY(6px)",
            }}
          >
            {hoveredIndex !== null ? items[hoveredIndex]?.name : ""}
          </span>
        </div>

        {/* Luxury CTA Button */}
        <Link
          href={CONTENT.cta.href}
          className="group inline-flex items-center justify-center gap-3 border border-[#0B1F3A]/20 bg-transparent px-10 py-3.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#0B1F3A] transition-all duration-350 hover:bg-[#0B1F3A] hover:text-[#C6A76A] hover:border-[#0B1F3A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C6A76A]"
        >
          <span>Discover Collection</span>
          <span className="transition-transform duration-350 group-hover:translate-x-1">→</span>
        </Link>
      </div>

      {/* Full-screen Product Popup */}
      {openIndex !== null && items[openIndex] && (
        <ProductPopup
          item={items[openIndex]}
          index={openIndex}
          total={items.length}
          sizes={CONTENT.garmentSizes}
          originRect={popupOriginRect}
          getOriginRect={() =>
            slotRefs.current[openIndex]?.getBoundingClientRect() ?? null
          }
          prefersReducedMotion={prefersReducedMotion}
          onCloseComplete={handlePopupCloseComplete}
        />
      )}
    </section>
  );
}
