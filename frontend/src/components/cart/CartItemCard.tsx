"use client";

import { useState } from "react";
import Link from "next/link";
import type { CartItem } from "@/types";
import {
  findCatalogProduct,
  formatPrice,
  getDiscountPercent,
  getProductHref,
  getStockLimit,
  isProductOutOfStock,
} from "@/components/commerce/formatters";
import { ProductImage } from "@/components/commerce/ProductImage";
import { QuantityStepper } from "@/components/commerce/QuantityStepper";

interface CartItemCardProps {
  item: CartItem;
  onQuantityChange: (item: CartItem, nextQty: number) => void;
  onSizeChange: (item: CartItem, nextSize: string) => void;
  onSaveForLater: (item: CartItem, catalogProductId: string) => void;
  onRemove: (item: CartItem) => void;
}

export function CartItemCard({
  item,
  onQuantityChange,
  onSizeChange,
  onSaveForLater,
  onRemove,
}: CartItemCardProps) {
  const [isCollapsing, setIsCollapsing] = useState(false);

  const catalogProduct = findCatalogProduct(item);
  const productHref = getProductHref(catalogProduct);
  const originalPrice = catalogProduct?.originalPrice;
  const discountPercent = getDiscountPercent(item.price, originalPrice);
  const availableSizes = catalogProduct?.sizes ?? [];
  const outOfStock = isProductOutOfStock(catalogProduct?.availability);
  const { maxQty, lowStockNote } = getStockLimit(catalogProduct);
  const itemSubtotal = item.price * item.quantity;

  const triggerWithCollapse = (callback: () => void) => {
    setIsCollapsing(true);
    window.setTimeout(callback, 260);
  };

  return (
    <div
      className={`grid transition-all duration-300 ease-out motion-reduce:transition-none ${
        isCollapsing
          ? "grid-rows-[0fr] opacity-0 -my-2"
          : "grid-rows-[1fr] opacity-100"
      }`}
    >
      <div className="overflow-hidden">
        <article
          className={`bg-white border rounded-sm p-4 sm:p-6 transition-shadow duration-300 ease-out hover:shadow-[0_6px_24px_rgba(11,31,58,0.08)] motion-reduce:transition-none ${
            outOfStock ? "border-destructive/40" : "border-[#0B1F3A]/10"
          }`}
        >
          <div className="flex gap-4 sm:gap-5">
            {/* Fixed aspect ratio product image */}
            <Link
              href={productHref}
              className="relative w-24 sm:w-28 aspect-[3/4] rounded-sm overflow-hidden border border-[#0B1F3A]/10 bg-[#F0EDE6] shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A76A]"
            >
              <ProductImage
                src={item.image}
                alt={item.name}
                sizes="(max-width: 640px) 96px, 112px"
                className={`object-cover object-center transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100 ${
                  outOfStock ? "grayscale opacity-60" : ""
                }`}
              />
            </Link>

            {/* Details + subtotal */}
            <div className="flex-1 min-w-0 flex flex-col justify-between gap-3">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4">
                <div className="min-w-0 space-y-1">
                  <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-[#C6A76A] block truncate">
                    {catalogProduct?.brand ?? "MainCharacter Atelier"}
                    {catalogProduct?.category
                      ? ` · ${catalogProduct.category}`
                      : ""}
                  </span>

                  <Link
                    href={productHref}
                    className="block text-base font-medium text-[#0B1F3A] hover:text-[#C6A76A] transition-colors line-clamp-2 leading-snug"
                  >
                    {item.name}
                  </Link>

                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-[#6B6B6B] pt-0.5">
                    <span>
                      Color:{" "}
                      <strong className="font-medium text-[#20242B]">
                        {item.color}
                      </strong>
                    </span>
                    <span aria-hidden="true" className="text-[#C6A76A]">
                      ·
                    </span>
                    {availableSizes.length > 0 ? (
                      <label className="inline-flex items-center gap-1.5">
                        <span>Size:</span>
                        <select
                          aria-label={`Select size for ${item.name}`}
                          value={
                            availableSizes.includes(
                              item.size as (typeof availableSizes)[number]
                            )
                              ? item.size
                              : availableSizes[0]
                          }
                          disabled={outOfStock}
                          onChange={(e) => onSizeChange(item, e.target.value)}
                          className="min-h-[32px] px-2 py-0.5 text-sm sm:text-xs font-semibold text-[#0B1F3A] bg-[#F8F6F1] border border-[#0B1F3A]/15 rounded-sm focus:outline-none focus:border-[#C6A76A] focus:ring-2 focus:ring-[#C6A76A]/40 disabled:opacity-50"
                        >
                          {availableSizes.map((sz) => (
                            <option key={sz} value={sz}>
                              {sz}
                            </option>
                          ))}
                        </select>
                      </label>
                    ) : (
                      <span>
                        Size:{" "}
                        <strong className="font-medium text-[#20242B]">
                          {item.size}
                        </strong>
                      </span>
                    )}
                  </div>
                </div>

                {/* Item subtotal on right (desktop) */}
                <div className="hidden sm:block text-right shrink-0">
                  <span className="text-[10px] uppercase tracking-[0.22em] text-[#6B6B6B] block">
                    Subtotal
                  </span>
                  <span className="text-base font-semibold text-[#0B1F3A] tabular-nums">
                    {formatPrice(itemSubtotal)}
                  </span>
                </div>
              </div>

              {/* Price block */}
              <div className="flex flex-wrap items-baseline gap-2.5">
                <span className="text-base font-bold text-[#0B1F3A] tabular-nums">
                  {formatPrice(item.price)}
                </span>
                {originalPrice && originalPrice > item.price && (
                  <>
                    <span className="text-sm text-[#6B6B6B] line-through tabular-nums">
                      {formatPrice(originalPrice)}
                    </span>
                    {discountPercent > 0 && (
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#C6A76A]">
                        {discountPercent}% off
                      </span>
                    )}
                  </>
                )}
              </div>

              {/* Out-of-stock or low-stock notice */}
              {outOfStock ? (
                <p
                  role="alert"
                  className="text-xs font-medium text-destructive bg-destructive/5 border border-destructive/20 px-3 py-1.5 rounded-sm"
                >
                  This piece is currently out of stock. Remove it or save it for
                  later to continue.
                </p>
              ) : (
                lowStockNote && (
                  <p className="text-xs font-medium text-[#C6A76A]">
                    {lowStockNote}
                  </p>
                )
              )}

              {/* Quantity stepper + Mobile subtotal + Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#0B1F3A]/8">
                <div className="flex items-center gap-3">
                  <QuantityStepper
                    value={item.quantity}
                    min={1}
                    max={Math.max(1, maxQty)}
                    disabled={outOfStock}
                    itemName={item.name}
                    onChange={(nextQty) => onQuantityChange(item, nextQty)}
                  />
                  <span className="sm:hidden text-sm font-semibold text-[#0B1F3A] tabular-nums">
                    {formatPrice(itemSubtotal)}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() =>
                      triggerWithCollapse(() =>
                        onSaveForLater(item, catalogProduct?.id ?? item.id)
                      )
                    }
                    className="min-h-[44px] sm:min-h-[36px] px-1 text-xs uppercase tracking-[0.18em] font-semibold text-[#0B1F3A] hover:text-[#C6A76A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A76A]"
                  >
                    SAVE FOR LATER
                  </button>

                  <span
                    aria-hidden="true"
                    className="h-3.5 w-px bg-[#0B1F3A]/15"
                  />

                  <button
                    type="button"
                    onClick={() => triggerWithCollapse(() => onRemove(item))}
                    className="min-h-[44px] sm:min-h-[36px] px-1 text-xs uppercase tracking-[0.18em] font-semibold text-[#6B6B6B] hover:text-destructive transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A76A]"
                  >
                    REMOVE
                  </button>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
