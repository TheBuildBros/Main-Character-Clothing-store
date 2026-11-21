"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/components/commerce/formatters";

type AccessoryId =
  | "watch"
  | "cooling-glasses"
  | "belt"
  | "handkerchief"
  | "wallet";

interface AccessoryItem {
  id: AccessoryId;
  name: string;
  tagline: string;
  price: string;
  image: string;
  href: string;
}

const ACCESSORIES: readonly AccessoryItem[] = [
  {
    id: "watch",
    name: "Watch",
    tagline: "Timeless on every wrist",
    price: formatPrice(420),
    image: "/images/accessories/watch.png",
    href: "/accessories/watch",
  },
  {
    id: "cooling-glasses",
    name: "Cooling Glasses",
    tagline: "Sculpted shade, effortless gaze",
    price: formatPrice(260),
    image: "/images/accessories/cooling-glasses.png",
    href: "/accessories/cooling-glasses",
  },
  {
    id: "belt",
    name: "Belt",
    tagline: "Full-grain structure at the waist",
    price: formatPrice(185),
    image: "/images/accessories/belt.png",
    href: "/accessories/belt",
  },
  {
    id: "handkerchief",
    name: "Handkerchief",
    tagline: "Silk-finished pocket precision",
    price: formatPrice(95),
    image: "/images/accessories/handkerchief.png",
    href: "/accessories/handkerchief",
  },
  {
    id: "wallet",
    name: "Wallet",
    tagline: "Slim architecture for the daily carry",
    price: formatPrice(210),
    image: "/images/accessories/wallet.png",
    href: "/accessories/wallet",
  },
] as const;

// Desktop arch/wave vertical stagger: center item highest, outer items lower
const DESKTOP_ARCH_CLASSES: readonly string[] = [
  "lg:translate-y-8",
  "lg:translate-y-1",
  "lg:-translate-y-6",
  "lg:translate-y-1",
  "lg:translate-y-8",
];

// Subtle alternating hover tilt angles on desktop (disabled under reduced motion)
const DESKTOP_HOVER_ROTATE: readonly string[] = [
  "lg:group-hover/item:-rotate-[2.5deg]",
  "lg:group-hover/item:rotate-[2.5deg]",
  "lg:group-hover/item:-rotate-[2deg]",
  "lg:group-hover/item:rotate-[2.5deg]",
  "lg:group-hover/item:-rotate-[2.5deg]",
];

// Slow, offset ambient float durations & delays per item (6s–8s range)
const FLOAT_TIMINGS: readonly { duration: string; delay: string }[] = [
  { duration: "6.4s", delay: "0s" },
  { duration: "7.2s", delay: "-1.4s" },
  { duration: "6.8s", delay: "-2.8s" },
  { duration: "7.6s", delay: "-0.9s" },
  { duration: "6.2s", delay: "-2.1s" },
];

/**
 * Gold-outlined editorial SVG silhouettes rendered gracefully on the pedestal
 * whenever an accessory image is not yet present or fails to load.
 */
function AccessoryFallbackSvg({ id }: { id: AccessoryId }) {
  const commonProps = {
    viewBox: "0 0 120 120",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    className:
      "h-28 w-28 sm:h-32 sm:w-32 text-[#C6A76A]/80 transition-colors duration-500 group-hover/item:text-[#C6A76A]",
    "aria-hidden": true as const,
  };

  switch (id) {
    case "watch":
      return (
        <svg {...commonProps}>
          {/* Top & bottom leather straps */}
          <path
            d="M47 14H73L70 34H50L47 14Z"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinejoin="round"
          />
          <path
            d="M50 86H70L73 106H47L50 86Z"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinejoin="round"
          />
          {/* Case & bezel */}
          <circle cx="60" cy="60" r="25" stroke="currentColor" strokeWidth="1.4" />
          <circle
            cx="60"
            cy="60"
            r="20.5"
            stroke="currentColor"
            strokeWidth="0.8"
            strokeOpacity="0.55"
          />
          {/* Crown */}
          <rect
            x="85"
            y="56.5"
            width="4.5"
            height="7"
            rx="1.2"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          {/* Minimal indices & hands */}
          <path
            d="M60 43V46M60 74V77M43 60H46M74 60H77"
            stroke="currentColor"
            strokeWidth="1.1"
            strokeLinecap="round"
          />
          <path
            d="M60 60V48M60 60L69 65"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <circle cx="60" cy="60" r="2" fill="currentColor" />
        </svg>
      );

    case "cooling-glasses":
      return (
        <svg {...commonProps}>
          {/* Left & right sculpted lenses */}
          <path
            d="M16 48C16 44 20 42 27 42H46C51 42 54 45 54 50C54 63 46 72 35 72C23 72 16 63 16 48Z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          <path
            d="M104 48C104 44 100 42 93 42H74C69 42 66 45 66 50C66 63 74 72 85 72C97 72 104 63 104 48Z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          {/* Double bridge */}
          <path
            d="M52 46H68M54 52C57 49.5 63 49.5 66 52"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
          />
          {/* Temples */}
          <path
            d="M16 47H10M104 47H110"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          {/* Subtle lens sheen lines */}
          <path
            d="M25 51L32 46M75 51L82 46"
            stroke="currentColor"
            strokeWidth="0.9"
            strokeOpacity="0.55"
            strokeLinecap="round"
          />
        </svg>
      );

    case "belt":
      return (
        <svg {...commonProps}>
          {/* Coiled belt loop */}
          <ellipse
            cx="60"
            cy="64"
            rx="38"
            ry="20"
            stroke="currentColor"
            strokeWidth="1.4"
          />
          <ellipse
            cx="60"
            cy="60"
            rx="31"
            ry="13.5"
            stroke="currentColor"
            strokeWidth="0.9"
            strokeOpacity="0.55"
          />
          {/* Rectangular luxury buckle */}
          <rect
            x="45"
            y="74"
            width="28"
            height="17"
            rx="2.5"
            fill="#0B1F3A"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M57 82.5H73"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
          {/* Keeper loop & punch holes */}
          <rect
            x="78"
            y="75"
            width="5"
            height="14"
            rx="1"
            stroke="currentColor"
            strokeWidth="1.1"
          />
          <circle cx="33" cy="64" r="1.2" fill="currentColor" />
          <circle cx="38" cy="68" r="1.2" fill="currentColor" />
        </svg>
      );

    case "handkerchief":
      return (
        <svg {...commonProps}>
          {/* Back silk peak */}
          <path
            d="M60 22L88 52L60 94L32 52L60 22Z"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinejoin="round"
          />
          {/* Layered editorial fold */}
          <path
            d="M42 42L60 28L78 42"
            stroke="currentColor"
            strokeWidth="0.9"
            strokeOpacity="0.55"
            strokeLinejoin="round"
          />
          <path
            d="M27 57L60 39L93 57L60 98L27 57Z"
            fill="#0B1F3A"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          {/* Inner rolled-hem stitch accent */}
          <path
            d="M34 58L60 45L86 58L60 91L34 58Z"
            stroke="currentColor"
            strokeWidth="0.8"
            strokeDasharray="2.5 2.5"
            strokeOpacity="0.6"
          />
        </svg>
      );

    case "wallet":
      return (
        <svg {...commonProps}>
          {/* Outer slim bifold body */}
          <rect
            x="22"
            y="34"
            width="76"
            height="54"
            rx="5"
            stroke="currentColor"
            strokeWidth="1.4"
          />
          {/* Inner stitched border */}
          <rect
            x="27"
            y="39"
            width="66"
            height="44"
            rx="3"
            stroke="currentColor"
            strokeWidth="0.8"
            strokeDasharray="2.5 2.5"
            strokeOpacity="0.55"
          />
          {/* Card slot tiers */}
          <path
            d="M22 50H98M22 61H98"
            stroke="currentColor"
            strokeWidth="1.15"
            strokeOpacity="0.75"
          />
          {/* Subtle gold clasp/monogram tab */}
          <path
            d="M78 69H92V78H78C75.5 78 73.5 76 73.5 73.5C73.5 71 75.5 69 78 69Z"
            fill="#0B1F3A"
            stroke="currentColor"
            strokeWidth="1.25"
          />
          <circle cx="80" cy="73.5" r="1.4" fill="currentColor" />
        </svg>
      );
  }
}

export default function AccessoriesSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [isVisible, setIsVisible] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  // Trigger entrance reveal once when the section enters the viewport
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || typeof IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // Track active slide on mobile snap carousel for dot indicators & 01 / 05 counter
  const handleCarouselScroll = () => {
    const track = carouselRef.current;
    if (!track) return;

    const trackCenter = track.scrollLeft + track.clientWidth / 2;
    let closestIndex = 0;
    let minDistance = Number.POSITIVE_INFINITY;

    itemRefs.current.forEach((node, idx) => {
      if (!node) return;
      const nodeCenter = node.offsetLeft + node.offsetWidth / 2;
      const distance = Math.abs(trackCenter - nodeCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = idx;
      }
    });

    setActiveSlide(closestIndex);
  };

  const scrollToSlide = (index: number) => {
    const node = itemRefs.current[index];
    if (!node) return;
    node.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
    setActiveSlide(index);
  };

  const formattedSlide = String(activeSlide + 1).padStart(2, "0");
  const formattedTotal = String(ACCESSORIES.length).padStart(2, "0");

  return (
    <section
      ref={sectionRef}
      aria-labelledby="accessories-heading"
      className="relative w-full overflow-x-clip bg-[#0B1F3A] bg-gradient-to-b from-[#0B1F3A] via-[#0B1F3A] via-70% to-[#091426] text-[#F5EFE0] py-20 sm:py-24 lg:py-32 scroll-mt-16 sm:scroll-mt-20"
    >
      {/* Component-scoped float animation keyframes with reduced-motion guard */}
      <style>{`
        @keyframes accessoryFloat {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(0, -6px, 0);
          }
        }
        .accessory-float {
          animation-name: accessoryFloat;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          will-change: transform;
        }
        @media (prefers-reduced-motion: reduce) {
          .accessory-float {
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>

      {/* Subtle ambient gallery lighting from existing navy/gold palette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={{
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%)",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%)",
        }}
      >
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[420px] w-[900px]"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(36, 75, 117, 0.1) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[360px] w-[780px]"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(198, 167, 106, 0.06) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[1360px] px-[20px] md:px-10 lg:px-14">
        {/* ── SECTION HEADER ── */}
        <header className="mx-auto max-w-2xl text-center mb-14 sm:mb-16 lg:mb-24">
          {/* Gold eyebrow with short gold hairline */}
          <div className="mb-4 flex items-center justify-center gap-3.5">
            <span className="h-px w-8 bg-[#C6A76A]" aria-hidden="true" />
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.35em] text-[#C6A76A]">
              THE DETAILS
            </span>
            <span className="h-px w-8 bg-[#C6A76A]" aria-hidden="true" />
          </div>

          {/* Serif italic editorial heading */}
          <h2
            id="accessories-heading"
            className="text-4xl sm:text-5xl lg:text-6xl font-light text-[#F5EFE0] leading-[1.06] tracking-tight"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontStyle: "italic",
            }}
          >
            Finishing Touches
          </h2>

          {/* Short supporting line */}
          <p className="mt-4 text-sm sm:text-[15px] text-[#F5EFE0]/60 leading-relaxed font-light max-w-lg mx-auto">
            Curated objects of permanence, poised in quiet precision to complete
            the protagonist silhouette.
          </p>
        </header>

        {/* ── THE DISPLAY CASE GALLERY ── */}
        <div className="relative">
          {/* Desktop shared horizontal glass shelf line behind the pedestals */}
          <div
            aria-hidden="true"
            className="pointer-events-none hidden lg:block absolute left-0 right-0 top-[268px] z-0"
          >
            <div className="h-px w-full bg-gradient-to-r from-transparent via-[#C6A76A]/50 to-transparent" />
            <div className="h-8 w-full bg-gradient-to-b from-[#C6A76A]/[0.06] via-[#244B75]/[0.08] to-transparent" />
          </div>

          {/* Mobile left & right edge fades for the horizontal snap carousel */}
          <div
            aria-hidden="true"
            className="pointer-events-none md:hidden absolute inset-y-0 -left-[20px] z-20 w-10 bg-gradient-to-r from-[#0B1F3A] to-transparent"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none md:hidden absolute inset-y-0 -right-[20px] z-20 w-10 bg-gradient-to-l from-[#0B1F3A] to-transparent"
          />

          {/* Responsive gallery track:
              - Mobile (<md): horizontal snap carousel (~72% width items)
              - Tablet (md..lg): centered 3 + 2 arrangement
              - Desktop (lg+): single row of 5 with arch stagger & sibling dimming */}
          <div
            ref={carouselRef}
            onScroll={handleCarouselScroll}
            className="relative z-10 -mx-[20px] flex overflow-x-auto snap-x snap-mandatory no-scrollbar px-[14vw] gap-5 pb-4 md:mx-0 md:overflow-visible md:snap-none md:flex-wrap md:justify-center md:px-0 md:gap-x-8 md:gap-y-14 lg:flex-nowrap lg:items-start lg:justify-between lg:gap-5 lg:pb-12 lg:has-[.accessory-card:hover]:[&_.accessory-card:not(:hover)]:opacity-60"
          >
            {ACCESSORIES.map((item, index) => {
              const numeral = String(index + 1).padStart(2, "0");
              const imageFailed = Boolean(failedImages[item.id]);
              const archClass = DESKTOP_ARCH_CLASSES[index] ?? "";
              const hoverRotateClass = DESKTOP_HOVER_ROTATE[index] ?? "";
              const floatTiming = FLOAT_TIMINGS[index] ?? {
                duration: "6.8s",
                delay: "0s",
              };

              return (
                <div
                  key={item.id}
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                  className={`accessory-card shrink-0 snap-center w-[72vw] max-w-[290px] md:w-[calc(33.333%-1.4rem)] md:max-w-[280px] lg:w-1/5 lg:max-w-none transition-opacity duration-500 ease-out ${archClass}`}
                >
                  {/* Entrance reveal wrapper (runs once on viewport entry) */}
                  <div
                    className={`transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0 ${
                      isVisible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-6"
                    }`}
                    style={{
                      transitionDelay: isVisible ? `${index * 100}ms` : "0ms",
                    }}
                  >
                    <Link
                      href={item.href}
                      aria-label={`${item.name} — ${item.tagline}, ${item.price}`}
                      className="group/item relative flex flex-col items-center text-center rounded-xl px-2 pt-3 pb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A76A] focus-visible:ring-offset-4 focus-visible:ring-offset-[#0B1F3A] active:-translate-y-1.5 transition-transform duration-300"
                    >
                      {/* Overhead spotlight cone / radial glow */}
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 h-52 w-48 rounded-full bg-[radial-gradient(ellipse_at_top,rgba(198,167,106,0.13)_0%,rgba(245,239,224,0.05)_42%,transparent_75%)] opacity-75 transition-all duration-500 ease-out group-hover/item:opacity-100 group-hover/item:scale-110"
                      />

                      {/* Index Numeral ("01"–"05") */}
                      <span className="relative z-10 mb-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#C6A76A]/85 tabular-nums transition-colors duration-500 group-hover/item:text-[#C6A76A]">
                        {numeral}
                      </span>

                      {/* Product Stage + Pedestal */}
                      <div className="relative z-10 flex w-full flex-col items-center">
                        {/* Floating & Hover-Lifting Product Container */}
                        <div
                          className="accessory-float relative z-10 flex h-44 w-44 sm:h-48 sm:w-48 items-center justify-center"
                          style={{
                            animationDuration: floatTiming.duration,
                            animationDelay: floatTiming.delay,
                          }}
                        >
                          <div
                            className={`relative flex h-full w-full items-center justify-center transition-transform duration-500 ease-out lg:group-hover/item:-translate-y-3 ${hoverRotateClass} motion-reduce:transition-none motion-reduce:group-hover/item:translate-y-0 motion-reduce:group-hover/item:rotate-0`}
                          >
                            {!imageFailed ? (
                              <Image
                                src={item.image}
                                alt={`${item.name} — ${item.tagline}`}
                                fill
                                sizes="(max-width: 767px) 72vw, (max-width: 1023px) 28vw, 18vw"
                                className="object-contain p-3 drop-shadow-[0_14px_24px_rgba(9,20,38,0.65)] select-none"
                                onError={() =>
                                  setFailedImages((prev) => ({
                                    ...prev,
                                    [item.id]: true,
                                  }))
                                }
                              />
                            ) : (
                              <div className="flex h-36 w-36 items-center justify-center rounded-full border border-[#C6A76A]/15 bg-[#132B4F]/45 shadow-[inset_0_0_24px_rgba(198,167,106,0.06)] transition-all duration-500 group-hover/item:border-[#C6A76A]/40 group-hover/item:bg-[#132B4F]/70">
                                <AccessoryFallbackSvg id={item.id} />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Slim Elliptical Gold-Ring Pedestal */}
                        <div
                          aria-hidden="true"
                          className="relative -mt-3 flex w-36 sm:w-40 flex-col items-center"
                        >
                          {/* Soft navy & gold glow cast onto the shelf */}
                          <div className="h-5 w-full rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(198,167,106,0.22)_0%,rgba(19,43,79,0.55)_58%,transparent_80%)] blur-[4px] transition-all duration-500 ease-out group-hover/item:bg-[radial-gradient(ellipse_at_center,rgba(198,167,106,0.42)_0%,rgba(19,43,79,0.65)_60%,transparent_80%)]" />
                          {/* Hairline gold elliptical platform ring */}
                          <div className="absolute inset-x-1 top-1/2 -translate-y-1/2 h-4 rounded-[100%] border border-[#C6A76A]/45 bg-[#132B4F]/55 shadow-[0_6px_18px_rgba(9,20,38,0.7)] transition-all duration-500 ease-out group-hover/item:border-[#C6A76A] group-hover/item:shadow-[0_0_18px_rgba(198,167,106,0.28)]" />
                        </div>

                        {/* Tablet & Mobile individual subtle shelf line accent */}
                        <div
                          aria-hidden="true"
                          className="mt-2 h-px w-24 bg-gradient-to-r from-transparent via-[#C6A76A]/30 to-transparent lg:hidden"
                        />
                      </div>

                      {/* Item Label, Sliding Gold Underline, Tagline & Price */}
                      <div className="relative z-10 mt-5 flex flex-col items-center space-y-1.5 px-1">
                        <div className="relative inline-block pb-1">
                          <h3 className="text-sm sm:text-[15px] font-semibold uppercase tracking-[0.2em] text-[#F5EFE0] transition-colors duration-500 group-hover/item:text-[#F8F6F1]">
                            {item.name}
                          </h3>
                          {/* Slim gold underline sliding in on hover */}
                          <span
                            aria-hidden="true"
                            className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-[#C6A76A] transition-transform duration-500 ease-out group-hover/item:scale-x-100 motion-reduce:transition-none"
                          />
                        </div>

                        <p className="text-xs text-[#F5EFE0]/60 leading-relaxed max-w-[20ch]">
                          {item.tagline}
                        </p>

                        <span className="pt-1 text-xs sm:text-[13px] font-semibold tracking-[0.16em] text-[#C6A76A] tabular-nums">
                          {item.price}
                        </span>
                      </div>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile-only Carousel Indicators & "01 / 05" Counter */}
          <div className="mt-4 flex flex-col items-center gap-3 md:hidden">
            <div
              role="tablist"
              aria-label="Accessories carousel slides"
              className="flex items-center gap-2.5"
            >
              {ACCESSORIES.map((item, idx) => {
                const isActive = idx === activeSlide;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-label={`View ${item.name}`}
                    onClick={() => scrollToSlide(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C6A76A] ${
                      isActive
                        ? "w-6 bg-[#C6A76A]"
                        : "w-1.5 bg-[#C6A76A]/30 hover:bg-[#C6A76A]/60"
                    }`}
                  />
                );
              })}
            </div>

            <div
              aria-live="polite"
              className="flex items-baseline gap-1.5 text-[11px] font-semibold tracking-[0.25em] tabular-nums"
            >
              <span className="text-[#C6A76A]">{formattedSlide}</span>
              <span className="text-[#F5EFE0]/50">/ {formattedTotal}</span>
            </div>
          </div>
        </div>

        {/* ── CENTERED CTA BUTTON ── */}
        <div className="mt-12 sm:mt-16 lg:mt-20 flex justify-center">
          <Link
            href="/collections?category=accessories"
            className="group inline-flex items-center justify-center gap-3 rounded-full border border-[#C6A76A] px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#F5EFE0] transition-all duration-300 hover:bg-[#C6A76A] hover:text-[#0B1F3A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A76A] focus-visible:ring-offset-4 focus-visible:ring-offset-[#0B1F3A]"
          >
            <span>VIEW ALL ACCESSORIES</span>
            <svg
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="h-3.5 w-3.5 transition-transform duration-300 ease-out group-hover:translate-x-1.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
            >
              <path
                d="M3 8H13M13 8L8.5 3.5M13 8L8.5 12.5"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
