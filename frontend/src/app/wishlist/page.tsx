"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bookmark, ShoppingBag, ArrowRight, Trash2, Heart } from "lucide-react";
import { useWishlistStore } from "@/store/wishlist";
import { useCartStore } from "@/store/cart";
import { PRODUCTS_CATALOG } from "@/data/products";

export default function WishlistPage() {
  const [isMounted, setIsMounted] = useState(false);
  const itemIds = useWishlistStore((s) => s.itemIds);
  const removeItem = useWishlistStore((s) => s.removeItem);
  const addItemToCart = useCartStore((s) => s.addItem);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <main className="min-h-screen bg-[#F8F6F1] text-[#20242B] pb-24">
      {/* Editorial Header Banner */}
      <section className="bg-[#0B1F3A] text-[#F8F6F1] pt-16 pb-12 sm:pt-20 sm:pb-16 px-5 sm:px-8 border-b border-[#C6A76A]/15">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="space-y-1">
            <span
              className="text-[9px] uppercase tracking-[0.4em] font-medium text-[#C6A76A]/70 block mb-2"
              style={{
                fontFamily: "'Zen Kaku Gothic New', 'Noto Sans JP', sans-serif",
              }}
            >
              主人公 · アーカイブ
            </span>
            <h1
              className="text-3xl sm:text-5xl text-[#F8F6F1]"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 600,
                fontStyle: "italic",
              }}
            >
              Curated <span className="text-[#C6A76A] font-normal not-italic">Wishlist</span>
            </h1>
          </div>
          <span className="text-[10px] text-[#F8F6F1]/50 uppercase tracking-[0.3em] font-mono">
            {itemIds.length} {itemIds.length === 1 ? "Silhouette" : "Silhouettes"} Saved
          </span>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12">
        {notification && (
          <div className="mb-6 p-4 bg-[#0B1F3A] text-[#C6A76A] border border-[#C6A76A]/40 text-xs font-medium flex items-center justify-between">
            <span>{notification}</span>
            <Link href="/carts" className="uppercase tracking-widest text-white hover:underline text-[10px]">
              View Shopping Bag →
            </Link>
          </div>
        )}

        {itemIds.length === 0 ? (
          /* EMPTY STATE */
          <div className="max-w-md mx-auto bg-white border border-[#20242B]/[0.08] p-10 sm:p-14 text-center shadow-[0_4px_24px_rgba(11,31,58,0.06)] space-y-6">
            <div className="w-16 h-16 bg-[#0B1F3A] text-[#C6A76A] flex items-center justify-center mx-auto">
              <Bookmark className="h-7 w-7" strokeWidth={1.5} />
            </div>

            <div className="space-y-2">
              <h2
                className="text-2xl text-[#0B1F3A]"
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontWeight: 600,
                  fontStyle: "italic",
                }}
              >
                No Saved Silhouettes
              </h2>
              <p className="text-xs text-[#20242B]/60 leading-relaxed max-w-xs mx-auto font-light">
                Your private archive is currently empty. Explore our latest protagonist
                creations and save your preferred runway pieces.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/collections"
                className="inline-flex items-center justify-center gap-3 py-3.5 px-8 bg-[#0B1F3A] text-[#C6A76A] text-[10px] uppercase tracking-[0.28em] font-semibold hover:bg-[#C6A76A] hover:text-[#0B1F3A] transition-all duration-300 border border-[#0B1F3A]"
              >
                <span>Explore Catalog</span>
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        ) : (
          /* SAVED ITEMS GRID */
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {itemIds.map((id) => {
                const catalogProduct = PRODUCTS_CATALOG.find((p) => p.id === id);
                const title = catalogProduct ? catalogProduct.name : `Archival Specimen #${id}`;
                const price = catalogProduct ? catalogProduct.price : 180;
                const image = catalogProduct ? catalogProduct.primaryImage : null;
                const brand = catalogProduct ? catalogProduct.brand : "MainCharacter Atelier";

                return (
                  <div
                    key={id}
                    className="bg-white border border-[#20242B]/[0.08] overflow-hidden shadow-[0_2px_16px_rgba(11,31,58,0.04)] hover:shadow-[0_8px_32px_rgba(11,31,58,0.1)] transition-all duration-300 flex flex-col group"
                  >
                    <div className="aspect-[3/4] bg-[#0B1F3A]/5 relative overflow-hidden flex items-center justify-center border-b border-[#20242B]/[0.06]">
                      {image ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={image}
                          alt={title}
                          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <span className="text-[10px] font-mono text-[#0B1F3A]/40 uppercase tracking-widest">
                          Silhouette #{id}
                        </span>
                      )}
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <span className="text-[9px] uppercase tracking-[0.35em] font-semibold text-[#C6A76A]">
                          {brand}
                        </span>
                        <h3
                          className="text-lg text-[#0B1F3A] mt-1 line-clamp-2"
                          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600 }}
                        >
                          {title}
                        </h3>
                        <p className="text-sm font-semibold text-[#0B1F3A] mt-1">
                          ${price.toFixed(2)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 pt-3 border-t border-[#20242B]/[0.08]">
                        <button
                          type="button"
                          onClick={() => {
                            addItemToCart({
                              id: `wish-${id}`,
                              name: title,
                              price,
                              quantity: 1,
                              size: catalogProduct?.sizes[0] ?? "M",
                              color: catalogProduct?.colors[0]?.name ?? "Obsidian Navy",
                              image: image ?? "/placeholder",
                            });
                            setNotification(`"${title}" moved to your Shopping Bag.`);
                            setTimeout(() => setNotification(null), 3000);
                          }}
                          className="flex-1 py-3 px-3 bg-[#0B1F3A] text-[#C6A76A] text-[9px] font-semibold uppercase tracking-[0.25em] hover:bg-[#C6A76A] hover:text-[#0B1F3A] transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          <ShoppingBag className="h-3.5 w-3.5" strokeWidth={1.5} />
                          <span>Move to Bag</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => removeItem(id)}
                          aria-label="Remove item"
                          className="p-2.5 text-[#20242B]/40 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
