"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import type { RackGarment } from "./rackContent";

export function GarmentPlaceholderSvg({
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
      {/* Wide garment front/back silhouette */}
      <path
        d="M104 72 C116 84, 152 84, 164 72 L212 90 L246 198 L206 212 L194 152 L198 378 C198 384, 193 388, 187 388 L81 388 C75 388, 70 384, 70 378 L74 152 L62 212 L22 198 L56 90 Z"
        fill="#d3cfc6"
      />
    </svg>
  );
}

interface ProductPopupProps {
  item: RackGarment;
  index: number;
  total: number;
  sizes: readonly string[];
  originRect: DOMRect | null;
  getOriginRect: () => DOMRect | null;
  prefersReducedMotion: boolean;
  onCloseComplete: () => void;
}

export default function ProductPopup({
  item,
  index,
  total,
  sizes,
  originRect,
  getOriginRect,
  prefersReducedMotion,
  onCloseComplete,
}: ProductPopupProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const stageFlightRef = useRef<HTMLDivElement | null>(null);
  const isClosingRef = useRef(false);

  const [isClosing, setIsClosing] = useState(false);
  const [activeSide, setActiveSide] = useState<"front" | "back">("front");
  const [cardYaw, setCardYaw] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [transitionDurationMs, setTransitionDurationMs] = useState(800);
  const [selectedSize, setSelectedSize] = useState<string>(sizes[0] ?? "S");
  const [addedToCart, setAddedToCart] = useState(false);
  const [frontFailed, setFrontFailed] = useState(false);
  const [backFailed, setBackFailed] = useState(false);

  // Drag state stored in refs for zero-lag pointer tracking
  const dragStateRef = useRef<{
    active: boolean;
    pointerId: number;
    startX: number;
    startYaw: number;
  }>({
    active: false,
    pointerId: -1,
    startX: 0,
    startYaw: 0,
  });

  // Lock body scroll while popup is open, restore on unmount
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  // Move focus into dialog on open
  useEffect(() => {
    closeBtnRef.current?.focus();
  }, []);

  // Helper to compute flight arc keyframes between rack rect and stage rect
  const computeArcGeometry = useCallback((rect: DOMRect | null) => {
    const stageEl = stageFlightRef.current;
    if (!rect || !stageEl) return null;

    const stageRect = stageEl.getBoundingClientRect();
    if (stageRect.width === 0 || stageRect.height === 0) return null;

    const dx =
      rect.left + rect.width / 2 - (stageRect.left + stageRect.width / 2);
    const dy =
      rect.top + rect.height / 2 - (stageRect.top + stageRect.height / 2);

    const startScale = Math.max(
      0.22,
      Math.min(1.05, rect.height / stageRect.height)
    );
    const dist = Math.hypot(dx, dy);
    const lift = Math.max(30, Math.min(100, dist * 0.16 + 44));

    // Midpoint at 55% of the travel from start (dx, dy) toward final (0, 0)
    const midX = dx * 0.45;
    const midY = dy * 0.45 - lift;
    const midScale = Math.max(startScale, 1) * 1.04;

    return { dx, dy, startScale, midX, midY, midScale };
  }, []);

  // Flight-in animation via Web Animations API
  useEffect(() => {
    if (prefersReducedMotion) return;
    const stageEl = stageFlightRef.current;
    if (!stageEl || typeof stageEl.animate !== "function") return;

    const geom = computeArcGeometry(originRect);
    if (!geom) return;

    const anim = stageEl.animate(
      [
        {
          transform: `translate3d(${geom.dx}px, ${geom.dy}px, 0) scale(${geom.startScale}) rotate(0deg) perspective(1200px) rotateY(-80deg)`,
          offset: 0,
        },
        {
          transform: `translate3d(${geom.midX}px, ${geom.midY}px, 0) scale(${geom.midScale}) rotate(3deg) perspective(1200px) rotateY(-28deg)`,
          offset: 0.55,
        },
        {
          transform:
            "translate3d(0px, 0px, 0) scale(1) rotate(0deg) perspective(1200px) rotateY(0deg)",
          offset: 1,
        },
      ],
      {
        duration: 720,
        easing: "cubic-bezier(.2,.8,.25,1)",
        fill: "none",
      }
    );

    return () => {
      anim.cancel();
    };
  }, [originRect, prefersReducedMotion, computeArcGeometry]);

  // Trigger close with reverse flight arc back to the rack
  const triggerClose = useCallback(() => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;
    setIsClosing(true);

    const stageEl = stageFlightRef.current;
    if (
      prefersReducedMotion ||
      !stageEl ||
      typeof stageEl.animate !== "function"
    ) {
      onCloseComplete();
      return;
    }

    const latestRect = getOriginRect() ?? originRect;
    const geom = computeArcGeometry(latestRect);
    if (!geom) {
      onCloseComplete();
      return;
    }

    // Smoothly orient inner card back to front while flying back onto the rod
    const nearestFront = Math.round(cardYaw / 360) * 360;
    if (cardYaw !== nearestFront) {
      setIsDragging(false);
      setTransitionDurationMs(420);
      setCardYaw(nearestFront);
    }

    const anim = stageEl.animate(
      [
        {
          transform:
            "translate3d(0px, 0px, 0) scale(1) rotate(0deg) perspective(1200px) rotateY(0deg)",
          offset: 0,
        },
        {
          transform: `translate3d(${geom.midX}px, ${geom.midY}px, 0) scale(${geom.midScale}) rotate(3deg) perspective(1200px) rotateY(-36deg)`,
          offset: 0.45,
        },
        {
          transform: `translate3d(${geom.dx}px, ${geom.dy}px, 0) scale(${geom.startScale}) rotate(0deg) perspective(1200px) rotateY(-80deg)`,
          offset: 1,
        },
      ],
      {
        duration: 600,
        easing: "ease-in-out",
        fill: "forwards",
      }
    );

    anim.onfinish = () => {
      onCloseComplete();
    };
    anim.oncancel = () => {
      onCloseComplete();
    };
  }, [
    prefersReducedMotion,
    getOriginRect,
    originRect,
    computeArcGeometry,
    cardYaw,
    onCloseComplete,
  ]);

  // Page-level Escape key listener and focus trap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        triggerClose();
        return;
      }

      if (e.key === "Tab" && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const activeEl = document.activeElement as HTMLElement | null;

        if (e.shiftKey) {
          if (!activeEl || activeEl === first || !dialogRef.current.contains(activeEl)) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (!activeEl || activeEl === last || !dialogRef.current.contains(activeEl)) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [triggerClose]);

  // Front / Back tab switching (flips 180° in 0.8s ease-out)
  const handleSelectSide = (side: "front" | "back") => {
    setActiveSide(side);
    setTransitionDurationMs(prefersReducedMotion ? 0 : 800);
    setCardYaw((currentYaw) => {
      const k = Math.round(currentYaw / 360);
      if (side === "front") {
        return k * 360;
      }
      // Choose nearest odd multiple of 180
      const optA = k * 360 + 180;
      const optB = k * 360 - 180;
      return Math.abs(optA - currentYaw) <= Math.abs(optB - currentYaw)
        ? optA
        : optB;
    });
  };

  // Drag left / right to spin the 3D garment card
  const handleStagePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isClosingRef.current) return;
    dragStateRef.current = {
      active: true,
      pointerId: e.pointerId,
      startX: e.clientX,
      startYaw: cardYaw,
    };
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleStagePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const ds = dragStateRef.current;
    if (!ds.active || ds.pointerId !== e.pointerId) return;
    const deltaX = e.clientX - ds.startX;
    setCardYaw(ds.startYaw + deltaX * 0.68);
  };

  const finishDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const ds = dragStateRef.current;
    if (!ds.active || ds.pointerId !== e.pointerId) return;
    ds.active = false;
    setIsDragging(false);

    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    // Snap to nearest front or back (multiple of 180°)
    const snapped = Math.round(cardYaw / 180) * 180;
    const isBack = Math.abs(Math.round(snapped / 180)) % 2 === 1;
    setTransitionDurationMs(prefersReducedMotion ? 0 : 520);
    setCardYaw(snapped);
    setActiveSide(isBack ? "back" : "front");
  };

  const handleAddToCart = () => {
    // TODO: connect real cart here (for example, call the Express /api/cart endpoint or the Zustand cart store in src/store/cart.ts).
    setAddedToCart(true);
  };

  const formattedIndex = String(index + 1).padStart(2, "0");
  const formattedTotal = String(total).padStart(2, "0");

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="rack-popup-title"
      className={`rack-popup-backdrop fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto p-5 sm:p-8 lg:p-12 ${
        isClosing ? "rack-popup-backdrop-closing" : ""
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          triggerClose();
        }
      }}
    >
      {/* Top-right Close button */}
      <button
        ref={closeBtnRef}
        type="button"
        onClick={triggerClose}
        aria-label="Close product preview"
        className="fixed top-5 right-5 sm:top-8 sm:right-8 z-20 inline-flex items-center gap-2 border border-[#0B1F3A]/20 bg-[#F8F6F1]/90 backdrop-blur-md px-5 py-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#0B1F3A] shadow-sm transition-all duration-300 hover:bg-[#0B1F3A] hover:text-[#C6A76A] hover:border-[#0B1F3A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C6A76A]"
      >
        <span>Close</span>
        <span aria-hidden="true" className="text-xs leading-none">
          ✕
        </span>
      </button>

      {/* Main 2-column content area */}
      <div className="mx-auto grid w-full max-w-5xl grid-cols-1 items-center gap-8 md:grid-cols-12 md:gap-12 lg:gap-16 my-auto py-10 md:py-0">
        {/* Left Side: Large 3D Garment Stage */}
        <div className="md:col-span-7 flex flex-col items-center justify-center">
          <div
            ref={stageFlightRef}
            className="rack-3d-perspective relative w-full max-w-[340px] sm:max-w-[400px] md:max-w-[440px] select-none"
            style={{
              height: "min(62vh, 560px)",
              cursor: isDragging ? "grabbing" : "grab",
              touchAction: "pan-y",
            }}
            onPointerDown={handleStagePointerDown}
            onPointerMove={handleStagePointerMove}
            onPointerUp={finishDrag}
            onPointerCancel={finishDrag}
          >
            <div
              className="rack-3d-card"
              style={{
                transform: `rotateY(${cardYaw}deg)`,
                transition: isDragging
                  ? "none"
                  : `transform ${transitionDurationMs}ms cubic-bezier(0.22, 1, 0.36, 1)`,
              }}
            >
              {/* Front Face */}
              <div className="rack-3d-face">
                {item.front && !frontFailed ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={item.front}
                    alt={`${item.name} — front view`}
                    draggable={false}
                    onError={() => setFrontFailed(true)}
                    className="h-full w-full object-contain pointer-events-none select-none drop-shadow-md"
                  />
                ) : (
                  <GarmentPlaceholderSvg
                    variant="front"
                    className="h-full w-auto max-w-full"
                  />
                )}
              </div>

              {/* Back Face (pre-rotated 180deg) */}
              <div className="rack-3d-face rack-3d-face-back">
                {item.back && !backFailed ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={item.back}
                    alt={`${item.name} — back view`}
                    draggable={false}
                    onError={() => setBackFailed(true)}
                    className="h-full w-full object-contain pointer-events-none select-none drop-shadow-md"
                  />
                ) : (
                  <GarmentPlaceholderSvg
                    variant="front"
                    className="h-full w-auto max-w-full opacity-90"
                  />
                )}
              </div>
            </div>
          </div>

          <p className="mt-3 text-[10px] font-medium uppercase tracking-[0.28em] text-[#20242B]/40 select-none">
            Drag to inspect silhouette
          </p>
        </div>

        {/* Right Side: Product Information & Controls */}
        <div
          className={`rack-popup-panel md:col-span-5 flex flex-col justify-center space-y-6 ${
            isClosing ? "rack-popup-panel-closing" : ""
          }`}
        >
          {/* Eyebrow & Counter */}
          <div className="flex items-center justify-between border-b border-[#20242B]/10 pb-3">
            <span className="text-[9px] font-semibold uppercase tracking-[0.35em] text-[#C6A76A]">
              Protagonist Capsule
            </span>
            <span className="text-[10px] font-mono tracking-widest text-[#20242B]/40">
              {formattedIndex} / {formattedTotal}
            </span>
          </div>

          {/* Product Name & Price */}
          <div className="space-y-2">
            <h2
              id="rack-popup-title"
              className="text-3xl sm:text-4xl text-[#0B1F3A] leading-tight"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 600,
                fontStyle: "italic",
              }}
            >
              {item.name}
            </h2>
            <p className="text-xl font-semibold text-[#0B1F3A] tracking-wide">
              {item.price}
            </p>
          </div>

          {/* Front | Back Tabs */}
          <div
            role="tablist"
            aria-label="Garment angle"
            className="flex items-center gap-6 border-b border-[#20242B]/10"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeSide === "front"}
              onClick={() => handleSelectSide("front")}
              className={`relative pb-2.5 text-[10px] font-semibold uppercase tracking-[0.25em] transition-colors duration-200 ${
                activeSide === "front"
                  ? "text-[#0B1F3A]"
                  : "text-[#20242B]/40 hover:text-[#0B1F3A]"
              }`}
            >
              Front Angle
              {activeSide === "front" && (
                <span className="absolute right-0 bottom-0 left-0 h-[2px] bg-[#C6A76A]" />
              )}
            </button>

            <span aria-hidden="true" className="mb-2.5 h-3 w-px bg-[#20242B]/15" />

            <button
              type="button"
              role="tab"
              aria-selected={activeSide === "back"}
              onClick={() => handleSelectSide("back")}
              className={`relative pb-2.5 text-[10px] font-semibold uppercase tracking-[0.25em] transition-colors duration-200 ${
                activeSide === "back"
                  ? "text-[#0B1F3A]"
                  : "text-[#20242B]/40 hover:text-[#0B1F3A]"
              }`}
            >
              Back Angle
              {activeSide === "back" && (
                <span className="absolute right-0 bottom-0 left-0 h-[2px] bg-[#C6A76A]" />
              )}
            </button>
          </div>

          {/* Size Pills */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-[#20242B]/60">
                Select Size
              </span>
              <span className="text-[9px] uppercase tracking-wider text-[#C6A76A]">
                Tailored Fit
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {sizes.map((size) => {
                const isSelected = selectedSize === size;
                return (
                  <button
                    key={size}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => {
                      setSelectedSize(size);
                      setAddedToCart(false);
                    }}
                    className={`min-w-[48px] border px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                      isSelected
                        ? "border-[#0B1F3A] bg-[#0B1F3A] text-[#C6A76A]"
                        : "border-[#20242B]/15 bg-white text-[#20242B]/80 hover:border-[#0B1F3A]"
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Full-width Luxury Add to Cart Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full bg-[#0B1F3A] py-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C6A76A] border border-[#0B1F3A] hover:bg-[#C6A76A] hover:text-[#0B1F3A] transition-all duration-300 shadow-sm"
          >
            {addedToCart ? "Added to Shopping Bag ✓" : "Add to Shopping Bag"}
          </button>

          {/* Footer Row */}
          <div className="flex items-center justify-between border-t border-[#20242B]/10 pt-4 text-xs">
            <span className="text-[10px] uppercase tracking-widest text-[#20242B]/50 font-medium">
              Bespoke Edition
            </span>
            <Link
              href={item.url}
              className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#0B1F3A] hover:text-[#C6A76A] underline underline-offset-4 transition-colors"
            >
              Full Editorial Specimen →
            </Link>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
