"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { NEW_ARRIVALS } from "./newArrivalsContent";

export default function StickyScrollReveal() {
  const items = NEW_ARRIVALS.items;

  // Split headline so the last word renders at 35% opacity
  const headlineWords = NEW_ARRIVALS.headline.trim().split(/\s+/);
  const headlineLastWord =
    headlineWords.length > 1 ? headlineWords[headlineWords.length - 1] : "";
  const headlineLeading =
    headlineWords.length > 1
      ? headlineWords.slice(0, -1).join(" ")
      : NEW_ARRIVALS.headline;

  const [activeIndex, setActiveIndex] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Respect prefers-reduced-motion after mount (avoids SSR hydration mismatch)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    mq.addEventListener("change", handleChange);
    return () => {
      mq.removeEventListener("change", handleChange);
    };
  }, []);

  // Single IntersectionObserver watching desktop/mobile item panels as they cross viewport center
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const rawIdx = entry.target.getAttribute("data-index");
            if (rawIdx !== null) {
              const idx = Number(rawIdx);
              if (!Number.isNaN(idx)) {
                setActiveIndex(idx);
              }
            }
          }
        }
      },
      {
        rootMargin: "-45% 0px -45% 0px",
        threshold: 0,
      }
    );

    const panels = panelRefs.current;
    for (const panel of panels) {
      if (panel) observer.observe(panel);
    }

    return () => {
      observer.disconnect();
    };
  }, [items.length]);

  const activeItem = items[activeIndex] ?? items[0];
  const formattedCurrent = String(activeIndex + 1).padStart(2, "0");
  const formattedTotal = String(items.length).padStart(2, "0");

  return (
    <section
      aria-label="New Arrivals Showcase"
      className="relative w-full bg-[#0B1F3A] text-[#F5EFE0] border-t border-[#C9A46A]/20 scroll-mt-16 sm:scroll-mt-20"
    >
      <div className="mx-auto max-w-[1360px] px-[20px] py-14 md:px-10 md:py-0 lg:px-14">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] md:gap-x-10 lg:gap-x-16 items-start">
          {/* LEFT COLUMN: Sticky on desktop (>= 768px), static header on mobile */}
          <div className="mb-10 md:mb-0 md:sticky md:top-0 md:h-screen flex flex-col justify-center md:pt-20 md:pb-10">
            <div className="space-y-5 md:space-y-6">
              {/* Eyebrow */}
              <p className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#C9A46A]">
                {NEW_ARRIVALS.eyebrow}
              </p>

              {/* Headline */}
              <h2
                className="font-extrabold uppercase text-[#F5EFE0] leading-[0.96] tracking-[-0.03em]"
                style={{ fontSize: "clamp(36px, 5vw, 72px)" }}
              >
                {headlineLeading}{" "}
                {headlineLastWord && (
                  <span className="opacity-35">{headlineLastWord}</span>
                )}
              </h2>

              {/* Thin Gold Divider (1px high, 64px wide) */}
              <div className="h-[1px] w-[64px] bg-[#C9A46A]" aria-hidden="true" />

              {/* Desktop-only Index Counter */}
              <div
                aria-hidden="true"
                className="hidden md:flex items-baseline gap-2 text-sm font-semibold tracking-[0.2em] tabular-nums"
              >
                <span className="text-[#C9A46A]">{formattedCurrent}</span>
                <span className="text-[#F5EFE0]/65">/ {formattedTotal}</span>
              </div>

              {/* Desktop-only Active Product Block with 300ms fade + slide-up on change */}
              <div
                key={prefersReducedMotion ? "static-arrival" : activeIndex}
                className={`hidden md:block space-y-2.5 min-h-[144px] ${
                  prefersReducedMotion
                    ? ""
                    : "animate-in fade-in slide-in-from-bottom-3 duration-300"
                }`}
              >
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[#C9A46A]">
                  {activeItem.category}
                </div>

                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-2xl lg:text-3xl font-bold tracking-tight text-[#F5EFE0]">
                    {activeItem.name}
                  </h3>
                  <span className="shrink-0 text-base lg:text-lg font-semibold text-[#F5EFE0] tabular-nums">
                    {activeItem.price}
                  </span>
                </div>

                <p className="text-sm text-[#F5EFE0]/65 leading-relaxed line-clamp-2">
                  {activeItem.description}
                </p>
              </div>

              {/* Desktop CTA */}
              <div className="hidden md:block pt-2">
                <Link
                  href={NEW_ARRIVALS.cta.href}
                  className="inline-flex items-center justify-center rounded-full border border-[#C9A46A] px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#F5EFE0] transition-colors duration-200 hover:bg-[#C9A46A] hover:text-[#0B1F3A] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C9A46A]"
                >
                  {NEW_ARRIVALS.cta.label}
                </Link>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Scrolling product panels on desktop, stacked cards (gap-12) on mobile */}
          <div className="flex flex-col gap-12 md:gap-0">
            {items.map((item, index) => {
              const hasFailed = Boolean(failedImages[index]);

              return (
                <div
                  key={`${item.category}-${item.name}`}
                  ref={(el) => {
                    panelRefs.current[index] = el;
                  }}
                  data-index={index}
                  className="md:min-h-screen flex flex-col md:items-center md:justify-center"
                >
                  <Link
                    href={item.url}
                    aria-label={`Shop ${item.category}`}
                    className="group block w-full rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C9A46A]"
                  >
                    {/* Product Image Card */}
                    <div className="w-full rounded-2xl bg-[#132B4F] aspect-[4/5] md:aspect-auto md:h-[70vh] md:max-h-[70vh] p-6 md:p-[48px] flex items-center justify-center overflow-hidden border border-[#C9A46A]/10 transition-transform duration-300 md:group-hover:scale-[1.01]">
                      {!hasFailed ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={item.image}
                          alt={`${item.name} — ${item.category}`}
                          loading={index === 0 ? "eager" : "lazy"}
                          onError={() =>
                            setFailedImages((prev) => ({
                              ...prev,
                              [index]: true,
                            }))
                          }
                          className="max-h-full w-auto max-w-full object-contain rounded-xl select-none"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center rounded-xl bg-[#0B1F3A] border border-[#C9A46A]/30 p-6 text-center">
                          <span className="text-lg font-bold uppercase tracking-[0.16em] text-[#C9A46A]">
                            {item.name}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Mobile-only Card Metadata below image */}
                    <div className="mt-4 space-y-1.5 md:hidden">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C9A46A]">
                        {item.category}
                      </div>

                      <div className="flex items-baseline justify-between gap-3">
                        <h3 className="text-xl font-bold tracking-tight text-[#F5EFE0]">
                          {item.name}
                        </h3>
                        <span className="shrink-0 text-sm font-semibold text-[#F5EFE0] tabular-nums">
                          {item.price}
                        </span>
                      </div>

                      <p className="text-sm text-[#F5EFE0]/65 leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  </Link>
                </div>
              );
            })}

            {/* Mobile-only CTA at bottom of stacked cards */}
            <div className="pt-2 md:hidden">
              <Link
                href={NEW_ARRIVALS.cta.href}
                className="flex w-full items-center justify-center rounded-full border border-[#C9A46A] px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#F5EFE0] transition-colors duration-200 hover:bg-[#C9A46A] hover:text-[#0B1F3A] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C9A46A]"
              >
                {NEW_ARRIVALS.cta.label}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
