"use client";

import Link from "next/link";
import type { CartItem } from "@/types";
import {
  findCatalogProduct,
  formatPrice,
  isProductOutOfStock,
} from "@/components/commerce/formatters";
import { ProductImage } from "@/components/commerce/ProductImage";

interface OrderSummaryStepProps {
  items: CartItem[];
  hasOutOfStockItem: boolean;
  onContinue: () => void;
}

export function OrderSummaryStep({
  items,
  hasOutOfStockItem,
  onContinue,
}: OrderSummaryStepProps) {
  return (
    <div className="space-y-5">
      {hasOutOfStockItem && (
        <div
          role="alert"
          className="p-3.5 border border-destructive/35 bg-destructive/5 rounded-sm text-sm text-destructive"
        >
          An item in your bag is out of stock. Please edit your bag before
          continuing.
        </div>
      )}

      <ul className="divide-y divide-[#0B1F3A]/8">
        {items.map((item) => {
          const catalogProduct = findCatalogProduct(item);
          const outOfStock = isProductOutOfStock(catalogProduct?.availability);

          return (
            <li key={item.id} className="py-3.5 first:pt-0 flex items-center gap-4">
              <div className="relative w-16 aspect-[3/4] rounded-sm overflow-hidden bg-[#F0EDE6] border border-[#0B1F3A]/10 shrink-0">
                <ProductImage
                  src={item.image}
                  alt={item.name}
                  sizes="64px"
                  className={`object-cover object-center ${
                    outOfStock ? "grayscale opacity-60" : ""
                  }`}
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#0B1F3A] line-clamp-2 leading-snug">
                  {item.name}
                </p>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-[#6B6B6B] mt-1">
                  <span>Size: {item.size}</span>
                  <span aria-hidden="true" className="text-[#C6A76A]">
                    ·
                  </span>
                  <span>{item.color}</span>
                  <span aria-hidden="true" className="text-[#C6A76A]">
                    ·
                  </span>
                  <span className="tabular-nums">Qty: {item.quantity}</span>
                </div>
                {outOfStock && (
                  <span className="inline-block mt-1 text-xs font-semibold text-destructive">
                    Out of stock
                  </span>
                )}
              </div>

              <div className="text-right shrink-0">
                <span className="text-sm font-semibold text-[#0B1F3A] tabular-nums">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="pt-3 border-t border-[#0B1F3A]/10 flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/carts"
          className="min-h-[44px] inline-flex items-center text-xs uppercase tracking-[0.22em] font-semibold text-[#C6A76A] hover:text-[#0B1F3A] transition-colors"
        >
          Edit Bag
        </Link>

        <button
          type="button"
          disabled={hasOutOfStockItem || items.length === 0}
          onClick={onContinue}
          className="min-h-[46px] px-8 py-2.5 bg-[#0B1F3A] text-[#C6A76A] text-xs uppercase tracking-[0.26em] font-semibold border border-[#0B1F3A] hover:bg-[#C6A76A] hover:text-[#0B1F3A] hover:border-[#C6A76A] transition-colors rounded-sm disabled:opacity-45 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A76A] focus-visible:ring-offset-2"
        >
          CONTINUE
        </button>
      </div>
    </div>
  );
}
