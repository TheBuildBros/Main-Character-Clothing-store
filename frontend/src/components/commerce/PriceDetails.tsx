"use client";

import { useState } from "react";
import Link from "next/link";
import {
  formatPrice,
  formatPriceParts,
  type OrderPricing,
} from "@/components/commerce/formatters";

interface PriceDetailsProps {
  pricing: OrderPricing;
  ctaLabel?: string;
  ctaHref?: string;
  onCtaClick?: () => void;
  ctaDisabled?: boolean;
  ctaDisabledReason?: string;
  showContinueShopping?: boolean;
  showCouponInput?: boolean;
}

export function PriceDetails({
  pricing,
  ctaLabel = "PLACE ORDER",
  ctaHref,
  onCtaClick,
  ctaDisabled = false,
  ctaDisabledReason,
  showContinueShopping = false,
  showCouponInput = true,
}: PriceDetailsProps) {
  // NOTE: Coupon/promo input is UI-only — no coupon/promo backend or store exists yet.
  const [couponCode, setCouponCode] = useState("");
  const [couponMessage, setCouponMessage] = useState<string | null>(null);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = couponCode.trim();
    if (!trimmed) {
      setCouponMessage("Enter a promo code to check eligibility.");
      return;
    }
    setCouponMessage(
      `Promo code "${trimmed.toUpperCase()}" is not active in this preview.`
    );
  };

  const buttonClasses =
    "w-full min-h-[48px] py-3.5 px-6 bg-[#0B1F3A] text-[#C6A76A] text-xs uppercase tracking-[0.28em] font-semibold border border-[#0B1F3A] transition-all duration-250 ease-out flex items-center justify-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A76A] focus-visible:ring-offset-2 motion-reduce:transition-none";

  const activeButtonClasses = ctaDisabled
    ? `${buttonClasses} opacity-45 cursor-not-allowed`
    : `${buttonClasses} hover:bg-[#C6A76A] hover:text-[#0B1F3A] hover:border-[#C6A76A]`;

  return (
    <aside
      aria-label="Price details"
      className="bg-white border border-[#0B1F3A]/10 rounded-sm shadow-[0_2px_16px_rgba(11,31,58,0.04)] overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#0B1F3A]/10 bg-[#F8F6F1]/50">
        <span className="text-[10px] uppercase tracking-[0.35em] font-semibold text-[#C6A76A] block">
          PRICE DETAILS
        </span>
      </div>

      <div className="p-6 space-y-5">
        {/* Line items */}
        <dl className="space-y-3.5 text-sm">
          <div className="flex items-center justify-between gap-4">
            <dt className="text-[#20242B]/75">
              Price ({pricing.totalItemCount}{" "}
              {pricing.totalItemCount === 1 ? "item" : "items"})
            </dt>
            <dd className="font-medium text-[#20242B] tabular-nums">
              {formatPrice(pricing.mrpTotal)}
            </dd>
          </div>

          {pricing.discountTotal > 0 && (
            <div className="flex items-center justify-between gap-4">
              <dt className="text-[#20242B]/75">Discount</dt>
              <dd className="font-semibold text-[#C6A76A] tabular-nums">
                − {formatPrice(pricing.discountTotal)}
              </dd>
            </div>
          )}

          <div className="flex items-center justify-between gap-4">
            <dt className="text-[#20242B]/75">Delivery Charges</dt>
            <dd className="font-medium tabular-nums">
              {pricing.shipping === 0 ? (
                <span className="font-semibold text-[#C6A76A] uppercase tracking-wider text-xs">
                  FREE
                </span>
              ) : (
                <span className="text-[#20242B]">
                  {formatPrice(pricing.shipping)}
                </span>
              )}
            </dd>
          </div>

          {pricing.amountToFreeShipping > 0 && (
            <p className="text-xs text-[#6B6B6B] bg-[#F8F6F1] border border-[#C6A76A]/25 px-3 py-2 rounded-sm">
              Add{" "}
              <span className="font-semibold text-[#0B1F3A] tabular-nums">
                {formatPrice(pricing.amountToFreeShipping)}
              </span>{" "}
              more for <span className="font-semibold text-[#C6A76A]">FREE</span>{" "}
              delivery.
            </p>
          )}

          <div className="flex items-center justify-between gap-4">
            <dt className="text-[#20242B]/75">Estimated GST</dt>
            <dd className="font-medium text-[#20242B] tabular-nums">
              {formatPrice(pricing.estimatedTax)}
            </dd>
          </div>

          <div className="pt-4 border-t border-dashed border-[#0B1F3A]/15 flex items-baseline justify-between gap-4">
            <dt className="text-sm font-semibold uppercase tracking-[0.16em] text-[#0B1F3A]">
              Total Amount
            </dt>
            <dd
              aria-live="polite"
              className="text-2xl sm:text-[28px] font-semibold text-[#0B1F3A] tabular-nums leading-none"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              {(() => {
                const { prefix, symbol, value } = formatPriceParts(
                  pricing.total
                );
                return (
                  <>
                    {prefix}
                    <span
                      style={{
                        fontFamily:
                          "var(--font-inter, 'Inter', system-ui, sans-serif)",
                      }}
                    >
                      {symbol}
                    </span>
                    {value}
                  </>
                );
              })()}
            </dd>
          </div>
        </dl>

        {/* Savings highlight */}
        {pricing.totalSavings > 0 && (
          <div className="px-3.5 py-2.5 bg-[#F8F6F1] border border-[#C6A76A]/35 rounded-sm">
            <p className="text-xs sm:text-sm font-medium text-[#0B1F3A]">
              You will save{" "}
              <span className="font-semibold text-[#C6A76A] tabular-nums">
                {formatPrice(pricing.totalSavings)}
              </span>{" "}
              on this order
            </p>
          </div>
        )}

        {/* Coupon / Promo code input (UI-only — not wired to a backend promo system) */}
        {showCouponInput && (
          <form onSubmit={handleApplyCoupon} className="space-y-2 pt-1">
            <label
              htmlFor="promo-code-input"
              className="block text-[10px] uppercase tracking-[0.25em] font-semibold text-[#6B6B6B]"
            >
              Promo Code
            </label>
            <div className="flex gap-2">
              <input
                id="promo-code-input"
                type="text"
                value={couponCode}
                onChange={(e) => {
                  setCouponCode(e.target.value);
                  if (couponMessage) setCouponMessage(null);
                }}
                placeholder="Enter code"
                className="flex-1 min-w-0 min-h-[44px] px-3 py-2 text-base bg-[#F8F6F1]/70 border border-[#0B1F3A]/15 rounded-sm text-[#20242B] placeholder:text-[#6B6B6B]/70 focus:outline-none focus:border-[#C6A76A] focus:ring-2 focus:ring-[#C6A76A]/40 transition-colors"
              />
              <button
                type="submit"
                className="min-h-[44px] px-4 text-xs uppercase tracking-[0.2em] font-semibold text-[#0B1F3A] border border-[#0B1F3A]/20 hover:border-[#C6A76A] hover:text-[#C6A76A] rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A76A]"
              >
                Apply
              </button>
            </div>
            {couponMessage && (
              <p
                role="status"
                aria-live="polite"
                className="text-xs text-[#6B6B6B]"
              >
                {couponMessage}
              </p>
            )}
          </form>
        )}

        {/* Primary CTA */}
        <div className="space-y-3 pt-1">
          {ctaHref && !ctaDisabled ? (
            <Link href={ctaHref} className={activeButtonClasses}>
              <span>{ctaLabel}</span>
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
          ) : (
            <button
              type="button"
              disabled={ctaDisabled}
              onClick={onCtaClick}
              className={activeButtonClasses}
            >
              <span>{ctaLabel}</span>
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
            </button>
          )}

          {ctaDisabled && ctaDisabledReason && (
            <p className="text-xs text-destructive text-center">
              {ctaDisabledReason}
            </p>
          )}

          {showContinueShopping && (
            <Link
              href="/collections"
              className="block text-center py-1 text-xs uppercase tracking-[0.22em] font-medium text-[#6B6B6B] hover:text-[#0B1F3A] transition-colors"
            >
              Continue Shopping
            </Link>
          )}
        </div>

        {/* Trust row */}
        <div className="pt-4 border-t border-[#0B1F3A]/10 grid grid-cols-3 gap-2 text-center">
          <div className="flex flex-col items-center gap-1.5">
            <svg
              className="h-4 w-4 text-[#C6A76A]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3l7 3v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V6l7-3Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4"
              />
            </svg>
            <span className="text-[11px] leading-tight text-[#6B6B6B]">
              Secure payments
            </span>
          </div>

          <div className="flex flex-col items-center gap-1.5">
            <svg
              className="h-4 w-4 text-[#C6A76A]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 12a8 8 0 0 1 13.7-5.6L20 8.5M20 4v4.5h-4.5M20 12a8 8 0 0 1-13.7 5.6L4 15.5M4 20v-4.5h4.5"
              />
            </svg>
            <span className="text-[11px] leading-tight text-[#6B6B6B]">
              Easy returns
            </span>
          </div>

          <div className="flex flex-col items-center gap-1.5">
            <svg
              className="h-4 w-4 text-[#C6A76A]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 7h11v10H3V7Zm11 3h4l3 3v4h-7v-7Z"
              />
              <circle cx="7.5" cy="17.5" r="1.5" />
              <circle cx="17.5" cy="17.5" r="1.5" />
            </svg>
            <span className="text-[11px] leading-tight text-[#6B6B6B]">
              Insured transit
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
