"use client";

import Link from "next/link";

interface EmptyStateProps {
  variant: "bag" | "wishlist";
  title: string;
  description: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
}

export function EmptyState({
  variant,
  title,
  description,
  primaryCtaLabel,
  primaryCtaHref,
  secondaryCtaLabel,
  secondaryCtaHref,
}: EmptyStateProps) {
  return (
    <div className="mx-auto max-w-lg bg-white border border-[#0B1F3A]/10 rounded-sm px-8 py-14 sm:px-12 sm:py-16 text-center shadow-[0_2px_16px_rgba(11,31,58,0.04)]">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#F8F6F1] border border-[#C6A76A]/35">
        {variant === "bag" ? (
          <svg
            className="h-9 w-9 text-[#C6A76A]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.3}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 8h12l1.2 12.2a1.5 1.5 0 0 1-1.5 1.8H6.3a1.5 1.5 0 0 1-1.5-1.8L6 8Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 8V6a3 3 0 0 1 6 0v2"
            />
          </svg>
        ) : (
          <svg
            className="h-9 w-9 text-[#C6A76A]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.3}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 20.5s-7.5-4.7-9.5-9.2C1.1 8 3 4.5 6.6 4.5c2.1 0 3.7 1.1 5.4 3 1.7-1.9 3.3-3 5.4-3 3.6 0 5.5 3.5 4.1 6.8-2 4.5-9.5 9.2-9.5 9.2Z"
            />
          </svg>
        )}
      </div>

      <h2
        className="text-3xl text-[#0B1F3A] mb-3"
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontWeight: 600,
          fontStyle: "italic",
        }}
      >
        {title}
      </h2>

      <p className="text-sm text-[#6B6B6B] leading-relaxed max-w-sm mx-auto mb-8">
        {description}
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href={primaryCtaHref}
          className="inline-flex min-h-[46px] w-full sm:w-auto items-center justify-center gap-2.5 px-8 py-3 bg-[#0B1F3A] text-[#C6A76A] text-xs uppercase tracking-[0.25em] font-semibold border border-[#0B1F3A] hover:bg-[#C6A76A] hover:text-[#0B1F3A] hover:border-[#C6A76A] transition-colors duration-250 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A76A] focus-visible:ring-offset-2 motion-reduce:transition-none"
        >
          <span>{primaryCtaLabel}</span>
          <svg
            className="h-3.5 w-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 12h14m-6-6 6 6-6 6"
            />
          </svg>
        </Link>

        {secondaryCtaLabel && secondaryCtaHref && (
          <Link
            href={secondaryCtaHref}
            className="inline-flex min-h-[46px] w-full sm:w-auto items-center justify-center px-6 py-3 text-xs uppercase tracking-[0.22em] font-semibold text-[#0B1F3A] border border-[#0B1F3A]/20 hover:border-[#C6A76A] hover:text-[#C6A76A] transition-colors duration-250 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A76A] focus-visible:ring-offset-2 motion-reduce:transition-none"
          >
            {secondaryCtaLabel}
          </Link>
        )}
      </div>
    </div>
  );
}
