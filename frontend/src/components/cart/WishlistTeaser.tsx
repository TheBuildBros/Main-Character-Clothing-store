"use client";

import Link from "next/link";
import { PRODUCTS_CATALOG, type Product } from "@/data/products";
import {
  formatPrice,
  getProductHref,
  isProductOutOfStock,
} from "@/components/commerce/formatters";
import { ProductImage } from "@/components/commerce/ProductImage";

interface WishlistTeaserProps {
  wishlistIds: string[];
  onMoveToBag: (product: Product) => void;
}

export function WishlistTeaser({
  wishlistIds,
  onMoveToBag,
}: WishlistTeaserProps) {
  const teaserProducts = wishlistIds
    .map((id) => PRODUCTS_CATALOG.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p))
    .slice(0, 4);

  if (teaserProducts.length === 0) return null;

  return (
    <section
      aria-labelledby="saved-for-later-heading"
      className="pt-4 space-y-4"
    >
      <div className="flex items-end justify-between gap-4 border-b border-[#0B1F3A]/10 pb-3">
        <div>
          <span className="text-[10px] uppercase tracking-[0.35em] font-semibold text-[#C6A76A] block mb-1">
            SAVED FOR LATER
          </span>
          <h2
            id="saved-for-later-heading"
            className="text-2xl text-[#0B1F3A]"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 600,
            }}
          >
            Your Wishlist ({wishlistIds.length})
          </h2>
        </div>

        <Link
          href="/wishlist"
          className="text-xs uppercase tracking-[0.2em] font-semibold text-[#C6A76A] hover:text-[#0B1F3A] transition-colors"
        >
          View All →
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {teaserProducts.map((product) => {
          const outOfStock = isProductOutOfStock(product.availability);
          return (
            <article
              key={product.id}
              className="bg-white border border-[#0B1F3A]/10 rounded-sm overflow-hidden flex flex-col justify-between transition-shadow duration-250 hover:shadow-[0_6px_20px_rgba(11,31,58,0.08)] motion-reduce:transition-none"
            >
              <Link
                href={getProductHref(product)}
                className="relative aspect-[3/4] bg-[#F0EDE6] overflow-hidden block"
              >
                <ProductImage
                  src={product.primaryImage}
                  alt={product.name}
                  sizes="(max-width: 640px) 50vw, 180px"
                  className={`object-cover object-center ${
                    outOfStock ? "grayscale opacity-60" : ""
                  }`}
                />
              </Link>

              <div className="p-3 flex flex-col gap-2 flex-1 justify-between">
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-[#0B1F3A] line-clamp-2 leading-snug">
                    {product.name}
                  </h3>
                  <p className="text-sm font-semibold text-[#0B1F3A] tabular-nums mt-1">
                    {formatPrice(product.price)}
                  </p>
                </div>

                <button
                  type="button"
                  disabled={outOfStock}
                  onClick={() => onMoveToBag(product)}
                  className="w-full min-h-[40px] py-2 px-2.5 text-[11px] uppercase tracking-[0.18em] font-semibold border border-[#0B1F3A] bg-[#0B1F3A] text-[#C6A76A] hover:bg-[#C6A76A] hover:text-[#0B1F3A] hover:border-[#C6A76A] transition-colors disabled:opacity-45 disabled:cursor-not-allowed rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A76A]"
                >
                  {outOfStock ? "Out of Stock" : "Move to Bag"}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
