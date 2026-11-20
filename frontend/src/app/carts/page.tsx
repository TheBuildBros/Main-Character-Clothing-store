"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  ArrowRight,
  Trash2,
  Plus,
  Minus,
  ShieldCheck,
  CreditCard,
  Truck,
} from "lucide-react";
import { useCartStore } from "@/store/cart";

export default function CartPage() {
  const [isMounted, setIsMounted] = useState(false);
  const items = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const totalItemCount = useCartStore((s) => s.getTotalItems());

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const subtotal = getSubtotal();
  const shipping = subtotal > 0 ? (subtotal >= 200 ? 0 : 15) : 0;
  const estimatedTax = subtotal * 0.08;
  const estimatedTotal = subtotal + shipping + estimatedTax;

  const handleAddSampleItem = () => {
    addItem({
      id: "sample-heavyweight-hoodie",
      name: "主人公 Heavyweight Boxy Hoodie",
      price: 195,
      quantity: 1,
      size: "XL",
      color: "Deep Obsidian Navy",
      image: "/placeholder",
    });
  };

  return (
    <div className="min-h-screen bg-[#F8F6F1] text-[#20242B] pb-24">

      {/* ── Page Header ── */}
      <section className="bg-[#0B1F3A] text-[#F8F6F1] pt-16 pb-12 sm:pt-20 sm:pb-14 px-5 sm:px-8 border-b border-[#C6A76A]/15">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <span
              className="text-[9px] uppercase tracking-[0.4em] font-medium text-[#C6A76A]/70 block mb-3"
              style={{ fontFamily: "'Zen Kaku Gothic New', 'Noto Sans JP', sans-serif" }}
            >
              主人公 · ショッピングバッグ
            </span>
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(36px, 5vw, 60px)",
                fontWeight: 500,
                letterSpacing: "-0.02em",
                lineHeight: 1,
                fontStyle: "italic",
              }}
            >
              Shopping{" "}
              <span style={{ color: "#C6A76A", fontStyle: "normal", fontWeight: 300 }}>
                Bag
              </span>
            </h1>
          </div>
          <span className="text-[10px] text-[#F8F6F1]/45 uppercase tracking-[0.3em] font-medium">
            {totalItemCount} {totalItemCount === 1 ? "Item" : "Items"}
          </span>
        </div>
      </section>

      {/* ── Main Content ── */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-12">
        {items.length === 0 ? (

          /* EMPTY CART */
          <div className="max-w-md mx-auto bg-white border border-[#20242B]/[0.07] p-12 sm:p-16 text-center space-y-8 mt-4">
            <div className="w-16 h-16 rounded-sm bg-[#0B1F3A] text-[#C6A76A] flex items-center justify-center mx-auto">
              <ShoppingBag className="h-7 w-7" strokeWidth={1.5} />
            </div>

            <div className="space-y-3">
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "26px",
                  fontWeight: 500,
                  fontStyle: "italic",
                  color: "#0B1F3A",
                }}
              >
                Your Bag is Empty
              </h2>
              <p className="text-xs text-[#20242B]/50 leading-relaxed max-w-xs mx-auto font-light">
                No items have been added to your shopping bag. Explore our
                curated collections to discover new protagonist releases.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/collections"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 py-3.5 px-8 bg-[#0B1F3A] text-[#C6A76A] text-[10px] uppercase tracking-[0.3em] font-semibold hover:bg-[#C6A76A] hover:text-[#0B1F3A] transition-all duration-300"
              >
                <span>Explore Collections</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.5} />
              </Link>

              <button
                type="button"
                onClick={handleAddSampleItem}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3.5 px-6 bg-transparent text-[#20242B] text-[10px] uppercase tracking-[0.3em] font-medium border border-[#20242B]/15 hover:border-[#20242B]/30 transition-colors duration-250"
              >
                <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
                <span>Preview Item</span>
              </button>
            </div>
          </div>

        ) : (

          /* FILLED CART */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

            {/* Cart Items (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#20242B]/[0.08]">
                <span className="text-[9px] uppercase tracking-[0.35em] font-semibold text-[#20242B]">
                  Bag Items ({totalItemCount})
                </span>
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-[9px] uppercase tracking-widest text-[#20242B]/40 hover:text-red-600 transition-colors duration-200"
                >
                  Clear Bag
                </button>
              </div>

              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-[#20242B]/[0.07] p-5 sm:p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between group transition-shadow duration-300 hover:shadow-[0_4px_24px_rgba(11,31,58,0.08)]"
                >
                  <div className="flex items-center gap-5">
                    {/* Product image placeholder */}
                    <div className="w-18 h-22 sm:w-20 sm:h-24 bg-[#F0EDE6] border border-[#20242B]/[0.06] flex items-center justify-center shrink-0 aspect-[3/4]"
                      style={{ width: "72px", height: "88px" }}
                    >
                      <span className="text-[8px] font-mono text-[#20242B]/30 uppercase tracking-widest text-center px-1">
                        Photo
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[9px] uppercase tracking-[0.3em] font-medium text-[#C6A76A] block">
                        Protagonist Drop
                      </span>
                      <h3 className="text-sm font-medium text-[#0B1F3A] leading-snug">
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-3 text-[10px] text-[#20242B]/50 uppercase tracking-wider">
                        <span>Size: {item.size}</span>
                        <span className="text-[#C6A76A]">·</span>
                        <span>{item.color}</span>
                      </div>
                      <p className="text-sm font-semibold text-[#0B1F3A]">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Quantity & Remove */}
                  <div className="flex items-center justify-between w-full sm:w-auto gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#20242B]/[0.06]">
                    <div className="flex items-center border border-[#20242B]/15">
                      <button
                        type="button"
                        onClick={() => {
                          if (item.quantity > 1) {
                            addItem({ ...item, quantity: -1 });
                          } else {
                            removeItem(item.id);
                          }
                        }}
                        className="p-2 hover:bg-[#0B1F3A]/5 transition-colors"
                      >
                        <Minus className="h-3 w-3 text-[#20242B]" strokeWidth={1.5} />
                      </button>
                      <span className="px-4 text-xs font-semibold text-[#20242B] min-w-[2.5rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => addItem({ ...item, quantity: 1 })}
                        className="p-2 hover:bg-[#0B1F3A]/5 transition-colors"
                      >
                        <Plus className="h-3 w-3 text-[#20242B]" strokeWidth={1.5} />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      aria-label="Remove item"
                      className="p-2 text-[#20242B]/30 hover:text-red-500 transition-colors duration-200"
                    >
                      <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              ))}

              <div className="pt-2">
                <Link
                  href="/collections"
                  className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] font-medium text-[#C6A76A] hover:text-[#0B1F3A] transition-colors duration-200"
                >
                  <ArrowRight className="h-3 w-3 rotate-180" strokeWidth={1.5} />
                  <span>Continue Exploring</span>
                </Link>
              </div>
            </div>

            {/* Order Summary (5 cols) */}
            <div className="lg:col-span-5 space-y-5">
              <div className="bg-white border border-[#20242B]/[0.07] p-7 sm:p-8 space-y-7">
                <div className="border-b border-[#20242B]/[0.07] pb-5">
                  <span className="text-[9px] uppercase tracking-[0.35em] font-medium text-[#C6A76A] block mb-2">
                    Payment & Shipping
                  </span>
                  <h2
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontSize: "24px",
                      fontWeight: 500,
                      color: "#0B1F3A",
                    }}
                  >
                    Order Summary
                  </h2>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between text-[#20242B]/65">
                    <span>Subtotal</span>
                    <span className="font-medium text-[#20242B]">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[#20242B]/65">
                    <span>Estimated Shipping</span>
                    <span className="font-medium text-[#20242B]">
                      {shipping === 0 ? "Complimentary" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#20242B]/65">
                    <span>Estimated Tax (8%)</span>
                    <span className="font-medium text-[#20242B]">${estimatedTax.toFixed(2)}</span>
                  </div>
                  <div className="pt-4 border-t border-[#20242B]/[0.07] flex justify-between items-baseline">
                    <span className="text-sm font-semibold text-[#20242B] uppercase tracking-wider">
                      Estimated Total
                    </span>
                    <span
                      className="text-[#0B1F3A]"
                      style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontSize: "26px",
                        fontWeight: 600,
                      }}
                    >
                      ${estimatedTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Payment notice */}
                <div className="p-3.5 border border-[#C6A76A]/20 bg-[#C6A76A]/5 flex items-start gap-3">
                  <CreditCard className="h-4 w-4 text-[#C6A76A] shrink-0 mt-0.5" strokeWidth={1.5} />
                  <p className="text-[10px] text-[#20242B]/65 leading-relaxed">
                    <strong className="text-[#20242B]/80">Payment Gateway:</strong>{" "}
                    Stripe / Razorpay integration coming in backend milestone.
                  </p>
                </div>

                {/* Checkout Button */}
                <Link
                  href="/checkout"
                  className="group w-full py-4 bg-[#0B1F3A] text-[#C6A76A] text-[10px] uppercase tracking-[0.3em] font-semibold hover:bg-[#C6A76A] hover:text-[#0B1F3A] transition-all duration-350 flex items-center justify-center gap-3"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-350 group-hover:translate-x-1" strokeWidth={1.5} />
                </Link>

                {/* Trust badges */}
                <div className="pt-1 border-t border-[#20242B]/[0.07] flex items-center justify-around text-[9px] text-[#20242B]/45 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <Truck className="h-3.5 w-3.5 text-[#C6A76A]" strokeWidth={1.5} />
                    <span>Global Express</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#C6A76A]" strokeWidth={1.5} />
                    <span>Authenticated</span>
                  </span>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
