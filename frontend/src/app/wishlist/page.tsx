"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bookmark, ShoppingBag, ArrowRight, Heart, Sparkles, Trash2 } from "lucide-react";
import { useWishlistStore } from "@/store/wishlist";
import { useCartStore } from "@/store/cart";

export default function WishlistPage() {
  const [isMounted, setIsMounted] = useState(false);
  const itemIds = useWishlistStore((s) => s.itemIds);
  const removeItem = useWishlistStore((s) => s.removeItem);
  const addItemToCart = useCartStore((s) => s.addItem);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <main className="min-h-screen bg-[#F5F2EA] text-[#091426] pb-20">
      {/* Editorial Header Banner */}
      <section className="bg-[#091426] text-[#F5F2EA] py-12 sm:py-16 px-4 sm:px-8 border-b border-[#C6A15B]/20">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span
              className="text-xs uppercase tracking-[0.25em] font-bold text-[#C6A15B] block"
              style={{
                fontFamily:
                  "'Zen Kaku Gothic New', 'Noto Sans JP', sans-serif",
              }}
            >
              主人公 &bull; アーカイブ
            </span>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-wider text-[#F5F2EA]">
              Your <span className="text-[#C6A15B]">Wishlist</span>
            </h1>
          </div>
          <span className="text-xs text-[#F5F2EA]/60 uppercase tracking-widest font-mono">
            {itemIds.length} {itemIds.length === 1 ? "Item" : "Items"} Saved
          </span>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12">
        {itemIds.length === 0 ? (
          /* EMPTY STATE */
          <div className="max-w-lg mx-auto bg-white rounded-xl border border-[#091426]/10 p-8 sm:p-12 text-center shadow-sm space-y-6">
            {/* Elegant Bookmark / Heart Icon */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#101D35] text-[#C6A15B] flex items-center justify-center mx-auto shadow-md">
              <Bookmark className="h-8 w-8 sm:h-10 sm:w-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-[#091426]">
                Your Wishlist is Empty
              </h2>
              <p className="text-xs sm:text-sm text-[#091426]/60 leading-relaxed max-w-sm mx-auto">
                Your wishlist is currently empty. Explore our latest protagonist
                drops and save your favorite outerwear, tees, and runway silhouettes.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/collections"
                className="inline-flex items-center justify-center gap-2 py-3.5 px-8 rounded-md bg-[#091426] text-[#C6A15B] text-xs uppercase tracking-widest font-bold hover:bg-[#101D35] hover:text-[#e0c487] transition-all shadow-sm border border-[#C6A15B]/30"
              >
                <span>Continue Shopping</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ) : (
          /* SAVED ITEMS GRID (Prepared for Product Catalog) */
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {itemIds.map((id) => (
                <div
                  key={id}
                  className="bg-white rounded-xl border border-[#091426]/10 overflow-hidden shadow-sm flex flex-col"
                >
                  <div className="aspect-[3/4] bg-[#091426]/5 relative flex items-center justify-center">
                    <span className="text-xs font-mono text-[#091426]/40 uppercase tracking-widest">
                      [Product Preview Placeholder]
                    </span>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest font-bold text-[#C6A15B]">
                        Protagonist Drop
                      </span>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-[#091426] mt-0.5">
                        Product Item #{id}
                      </h3>
                      <p className="text-sm font-semibold text-[#091426] mt-1">
                        $180.00
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-black/[0.06]">
                      <button
                        type="button"
                        onClick={() => {
                          addItemToCart({
                            id: `wish-${id}`,
                            name: `Protagonist Piece #${id}`,
                            price: 180,
                            quantity: 1,
                            size: "L",
                            color: "Obsidian",
                            image: "/placeholder",
                          });
                          alert("Item moved to shopping bag!");
                        }}
                        className="flex-1 py-2 px-3 rounded bg-[#091426] text-[#C6A15B] text-xs font-bold uppercase tracking-wider hover:bg-[#101D35] flex items-center justify-center gap-1.5"
                      >
                        <ShoppingBag className="h-3.5 w-3.5" />
                        <span>Add to Cart</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => removeItem(id)}
                        aria-label="Remove item"
                        className="p-2 rounded text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
