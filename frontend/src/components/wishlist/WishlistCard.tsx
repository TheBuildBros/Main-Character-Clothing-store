"use client";

import { useState } from "react";
import Link from "next/link";
import type { Product, ProductSize } from "@/data/products";
import {
  formatPrice,
  getDiscountPercent,
  getProductHref,
  isProductOutOfStock,
} from "@/components/commerce/formatters";
import { ProductImage } from "@/components/commerce/ProductImage";

interface WishlistCardProps {
  id: string;
  product?: Product;
  isInBag: boolean;
  onMoveToBag: (id: string, product: Product | undefined, size: string) => void;
  onRemove: (id: string, title: string) => void;
}

export function WishlistCard({
  id,
  product,
  isInBag,
  onMoveToBag,
  onRemove,
}: WishlistCardProps) {
  const [selectedSize, setSelectedSize] = useState<string>(
    product?.sizes[0] ?? "M"
  );
  const [isRemoving, setIsRemoving] = useState(false);

  const title = product?.name ?? `Archival Piece #${id}`;
  const brand = product?.brand ?? "MainCharacter Atelier";
  const price = product?.price ?? 180;
  const originalPrice = product?.originalPrice;
  const discountPercent = getDiscountPercent(price, originalPrice);
  const outOfStock = isProductOutOfStock(product?.availability);
  const href = getProductHref(product);

  const handleRemoveClick = () => {
    setIsRemoving(true);
    window.setTimeout(() => {
      onRemove(id, title);
    }, 240);
  };

  return (
    <article
      className={`bg-white border border-[#0B1F3A]/10 rounded-sm overflow-hidden flex flex-col justify-between shadow-[0_2px_14px_rgba(11,31,58,0.04)] hover:shadow-[0_8px_28px_rgba(11,31,58,0.09)] transition-all duration-250 ease-out group motion-reduce:transition-none ${
        isRemoving ? "opacity-0 scale-95" : "opacity-100 scale-100"
      }`}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] bg-[#F0EDE6] overflow-hidden border-b border-[#0B1F3A]/8">
        <Link href={href} className="block h-full w-full">
          <ProductImage
            src={product?.primaryImage}
            alt={title}
            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className={`object-cover object-center transition-transform duration-300 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100 ${
              outOfStock ? "grayscale opacity-60" : ""
            }`}
          />
        </Link>

        {/* Out of stock badge */}
        {outOfStock && (
          <span className="absolute top-2.5 left-2.5 px-2.5 py-1 bg-[#0B1F3A] text-[#F8F6F1] text-[10px] uppercase tracking-[0.2em] font-semibold">
            OUT OF STOCK
          </span>
        )}

        {/* Filled Gold Heart / Remove Button */}
        <button
          type="button"
          onClick={handleRemoveClick}
          aria-label={`Remove ${title} from wishlist`}
          className="absolute top-2 right-2 flex h-11 w-11 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white/95 border border-[#0B1F3A]/10 text-[#C6A76A] shadow-sm hover:bg-[#0B1F3A] hover:border-[#0B1F3A] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A76A] motion-reduce:transition-none"
        >
          <svg
            className="h-4 w-4 fill-[#C6A76A]"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.6}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 20.5s-7.5-4.7-9.5-9.2C1.1 8 3 4.5 6.6 4.5c2.1 0 3.7 1.1 5.4 3 1.7-1.9 3.3-3 5.4-3 3.6 0 5.5 3.5 4.1 6.8-2 4.5-9.5 9.2-9.5 9.2Z"
            />
          </svg>
        </button>
      </div>

      {/* Card Body */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between gap-3">
        <div className="space-y-1.5">
          <span className="text-[10px] uppercase tracking-[0.28em] font-semibold text-[#C6A76A] block truncate">
            {brand}
          </span>

          <Link
            href={href}
            className="block text-sm sm:text-[15px] font-medium text-[#0B1F3A] hover:text-[#C6A76A] transition-colors line-clamp-2 leading-snug min-h-[2.5rem]"
          >
            {title}
          </Link>

          <div className="flex flex-wrap items-baseline gap-2 pt-0.5">
            <span className="text-sm sm:text-base font-bold text-[#0B1F3A] tabular-nums">
              {formatPrice(price)}
            </span>
            {originalPrice && originalPrice > price && (
              <>
                <span className="text-xs text-[#6B6B6B] line-through tabular-nums">
                  {formatPrice(originalPrice)}
                </span>
                {discountPercent > 0 && (
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#C6A76A]">
                    {discountPercent}% off
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        <div className="space-y-2.5 pt-2 border-t border-[#0B1F3A]/8">
          {/* Size selector */}
          {product && product.sizes.length > 0 && !outOfStock && !isInBag && (
            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor={`wishlist-size-${id}`}
                className="text-xs text-[#6B6B6B]"
              >
                Size
              </label>
              <select
                id={`wishlist-size-${id}`}
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value as ProductSize)}
                className="min-h-[36px] px-2.5 py-1 text-base sm:text-xs font-semibold text-[#0B1F3A] bg-[#F8F6F1] border border-[#0B1F3A]/15 rounded-sm focus:outline-none focus:border-[#C6A76A] focus:ring-2 focus:ring-[#C6A76A]/40"
              >
                {product.sizes.map((sz) => (
                  <option key={sz} value={sz}>
                    {sz}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Primary Action */}
          {outOfStock ? (
            <button
              type="button"
              disabled
              className="w-full min-h-[44px] py-2.5 px-3 bg-[#F0EDE6] text-[#6B6B6B] border border-[#0B1F3A]/10 text-xs uppercase tracking-[0.2em] font-semibold cursor-not-allowed rounded-sm"
            >
              OUT OF STOCK
            </button>
          ) : isInBag ? (
            <div className="space-y-1.5">
              <button
                type="button"
                disabled
                className="w-full min-h-[44px] py-2.5 px-3 bg-white text-[#C6A76A] border border-[#C6A76A] text-xs uppercase tracking-[0.22em] font-semibold cursor-default rounded-sm"
              >
                IN BAG
              </button>
              <Link
                href="/carts"
                className="block text-center text-xs uppercase tracking-[0.2em] font-semibold text-[#0B1F3A] hover:text-[#C6A76A] transition-colors py-1"
              >
                View Bag →
              </Link>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onMoveToBag(id, product, selectedSize)}
              className="w-full min-h-[44px] py-2.5 px-3 bg-[#0B1F3A] text-[#C6A76A] border border-[#0B1F3A] text-xs uppercase tracking-[0.22em] font-semibold hover:bg-[#C6A76A] hover:text-[#0B1F3A] hover:border-[#C6A76A] transition-colors duration-250 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A76A] focus-visible:ring-offset-1 motion-reduce:transition-none"
            >
              MOVE TO BAG
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
