"use client";

import Link from "next/link";
import type { CartItem } from "@/types";
import type {
  PaymentMethodId,
  SavedCheckoutAddress,
} from "@/components/checkout/types";
import {
  formatPrice,
  getEstimatedDeliveryDate,
  type OrderPricing,
} from "@/components/commerce/formatters";

interface OrderSuccessViewProps {
  orderId: string;
  address: SavedCheckoutAddress;
  paymentMethod: PaymentMethodId;
  items: CartItem[];
  pricing: OrderPricing;
}

const PAYMENT_LABELS: Record<PaymentMethodId, string> = {
  card: "Credit / Debit Card",
  upi: "Net Banking / UPI",
  cod: "Cash on Delivery",
};

export function OrderSuccessView({
  orderId,
  address,
  paymentMethod,
  items,
  pricing,
}: OrderSuccessViewProps) {
  const estimatedDelivery = getEstimatedDeliveryDate(4);

  return (
    <div className="mx-auto max-w-2xl bg-white border border-[#0B1F3A]/10 rounded-sm p-6 sm:p-10 shadow-[0_6px_28px_rgba(11,31,58,0.06)] space-y-8 animate-fade-in">
      <div className="text-center space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#0B1F3A] text-[#C6A76A] ring-4 ring-[#C6A76A]/25">
          <svg
            className="h-8 w-8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <span className="text-[10px] uppercase tracking-[0.35em] font-semibold text-[#C6A76A] block">
          ORDER CONFIRMED
        </span>

        <h1
          className="text-3xl sm:text-4xl text-[#0B1F3A]"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontWeight: 600,
            fontStyle: "italic",
          }}
        >
          Thank you for your order
        </h1>

        <p className="text-sm text-[#6B6B6B]">
          Order ID:{" "}
          <strong className="font-semibold text-[#0B1F3A] tabular-nums">
            {orderId}
          </strong>{" "}
          · Estimated delivery by{" "}
          <strong className="font-semibold text-[#0B1F3A]">
            {estimatedDelivery}
          </strong>
        </p>
      </div>

      {/* Delivery & Payment Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 sm:p-5 bg-[#F8F6F1] border border-[#0B1F3A]/10 rounded-sm text-sm">
        <div className="space-y-1">
          <span className="text-[10px] uppercase tracking-[0.28em] font-semibold text-[#C6A76A] block">
            Delivering To
          </span>
          <p className="font-semibold text-[#0B1F3A]">{address.fullName}</p>
          <p className="text-[#20242B]/80 leading-relaxed">
            {[address.houseNumber, address.streetName, address.areaLocality]
              .filter(Boolean)
              .join(", ")}
            <br />
            {address.city}, {address.state} — {address.pinCode}
          </p>
          <p className="text-xs text-[#6B6B6B] tabular-nums">
            Phone: {address.phoneNumber}
          </p>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] uppercase tracking-[0.28em] font-semibold text-[#C6A76A] block">
            Payment Method
          </span>
          <p className="font-semibold text-[#0B1F3A]">
            {PAYMENT_LABELS[paymentMethod]}
          </p>
          <p className="text-xs text-[#6B6B6B] pt-1">
            Total Paid:{" "}
            <strong className="text-[#0B1F3A] text-sm tabular-nums">
              {formatPrice(pricing.total)}
            </strong>
          </p>
        </div>
      </div>

      {/* Items Summary */}
      <div className="space-y-3">
        <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-[#C6A76A] block">
          Items ({pricing.totalItemCount})
        </span>
        <ul className="divide-y divide-[#0B1F3A]/8 border-t border-b border-[#0B1F3A]/8">
          {items.map((item) => (
            <li
              key={item.id}
              className="py-3 flex items-center justify-between gap-4 text-sm"
            >
              <div className="min-w-0">
                <p className="font-medium text-[#0B1F3A] truncate">
                  {item.name}
                </p>
                <p className="text-xs text-[#6B6B6B]">
                  Size {item.size} · {item.color} · Qty {item.quantity}
                </p>
              </div>
              <span className="font-semibold text-[#0B1F3A] tabular-nums shrink-0">
                {formatPrice(item.price * item.quantity)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link
          href="/collections"
          className="inline-flex min-h-[48px] w-full sm:w-auto items-center justify-center px-8 py-3 bg-[#0B1F3A] text-[#C6A76A] text-xs uppercase tracking-[0.26em] font-semibold border border-[#0B1F3A] hover:bg-[#C6A76A] hover:text-[#0B1F3A] hover:border-[#C6A76A] transition-colors rounded-sm"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
