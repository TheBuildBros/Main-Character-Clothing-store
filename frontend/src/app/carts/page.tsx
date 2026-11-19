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
  RotateCcw,
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
              主人公 &bull; ショッピングバッグ
            </span>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-wider text-[#F5F2EA]">
              Shopping <span className="text-[#C6A15B]">Cart</span>
            </h1>
          </div>
          <span className="text-xs text-[#F5F2EA]/60 uppercase tracking-widest font-mono">
            {totalItemCount} {totalItemCount === 1 ? "Item" : "Items"} in Bag
          </span>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12">
        {items.length === 0 ? (
          /* EMPTY CART STATE */
          <div className="max-w-lg mx-auto bg-white rounded-xl border border-[#091426]/10 p-8 sm:p-12 text-center shadow-sm space-y-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#101D35] text-[#C6A15B] flex items-center justify-center mx-auto shadow-md">
              <ShoppingBag className="h-8 w-8 sm:h-10 sm:w-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-[#091426]">
                Your Shopping Bag is Empty
              </h2>
              <p className="text-xs sm:text-sm text-[#091426]/60 leading-relaxed max-w-sm mx-auto">
                No items have been added to your shopping bag. Explore our
                curated collections to discover new protagonist releases.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/collections"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3.5 px-8 rounded-md bg-[#091426] text-[#C6A15B] text-xs uppercase tracking-widest font-bold hover:bg-[#101D35] hover:text-[#e0c487] transition-all shadow-sm border border-[#C6A15B]/30"
              >
                <span>Explore Collections</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              {/* Demo button to preview filled cart state */}
              <button
                type="button"
                onClick={handleAddSampleItem}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-md bg-[#F5F2EA] text-[#091426] text-xs uppercase tracking-widest font-bold hover:bg-[#091426] hover:text-[#C6A15B] transition-all border border-[#091426]/15"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Preview Cart Item</span>
              </button>
            </div>
          </div>
        ) : (
          /* FILLED CART & ORDER SUMMARY GRID */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Cart Items List (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-black/[0.08]">
                <span className="text-xs uppercase tracking-widest font-bold text-[#091426]">
                  Bag Items ({totalItemCount})
                </span>
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs text-[#091426]/50 hover:text-red-600 transition-colors"
                >
                  Clear Bag
                </button>
              </div>

              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-[#091426]/10 p-5 shadow-sm flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-24 rounded-lg bg-[#091426]/5 border border-black/5 flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-mono text-[#091426]/40 text-center px-1">
                        [Photo]
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-[#C6A15B]">
                        Protagonist Drop
                      </span>
                      <h3 className="text-sm font-bold text-[#091426]">
                        {item.name}
                      </h3>
                      <div className="text-xs text-[#091426]/60 flex items-center gap-3">
                        <span>Size: {item.size}</span>
                        <span>&bull;</span>
                        <span>Color: {item.color}</span>
                      </div>
                      <p className="text-sm font-bold text-[#091426] pt-1">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Quantity & Delete */}
                  <div className="flex items-center justify-between w-full sm:w-auto gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-black/5">
                    <div className="flex items-center border border-[#091426]/20 rounded-md">
                      <button
                        type="button"
                        onClick={() => {
                          if (item.quantity > 1) {
                            addItem({ ...item, quantity: -1 });
                          } else {
                            removeItem(item.id);
                          }
                        }}
                        className="p-1.5 hover:bg-[#091426]/5"
                      >
                        <Minus className="h-3 w-3 text-[#091426]" />
                      </button>
                      <span className="px-3 text-xs font-bold text-[#091426]">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => addItem({ ...item, quantity: 1 })}
                        className="p-1.5 hover:bg-[#091426]/5"
                      >
                        <Plus className="h-3 w-3 text-[#091426]" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      aria-label="Remove item"
                      className="p-2 text-[#091426]/40 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}

              <div className="pt-2">
                <Link
                  href="/collections"
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-[#C6A15B] hover:underline"
                >
                  &larr; Continue Exploring Collections
                </Link>
              </div>
            </div>

            {/* Order Summary Card (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-xl border border-[#091426]/10 p-6 sm:p-8 shadow-sm space-y-6">
                <div className="border-b border-black/[0.06] pb-4">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-[#C6A15B]">
                    Payment & Shipping
                  </span>
                  <h2 className="text-xl font-black uppercase tracking-wider text-[#091426]">
                    Order Summary
                  </h2>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between text-[#091426]/80">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#091426]">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between text-[#091426]/80">
                    <span>Estimated Shipping</span>
                    <span className="font-semibold text-[#091426]">
                      {shipping === 0 ? "Complimentary" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>

                  <div className="flex justify-between text-[#091426]/80">
                    <span>Estimated Sales Tax (8%)</span>
                    <span className="font-semibold text-[#091426]">
                      ${estimatedTax.toFixed(2)}
                    </span>
                  </div>

                  <div className="pt-4 border-t border-black/[0.06] flex justify-between items-baseline">
                    <span className="text-sm font-bold uppercase tracking-wider text-[#091426]">
                      Estimated Total
                    </span>
                    <span className="text-xl font-black text-[#091426]">
                      ${estimatedTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Integration Notice */}
                <div className="p-3 rounded-md bg-[#101D35]/5 border border-[#C6A15B]/30 flex items-start gap-2.5">
                  <CreditCard className="h-4 w-4 text-[#C6A15B] shrink-0 mt-0.5" />
                  <p className="text-[11px] text-[#091426]/80 leading-relaxed">
                    <strong>Payment Gateway Placeholder:</strong> Payment processing (Stripe / Razorpay) will be connected in future backend milestones.
                  </p>
                </div>

                {/* Checkout Button */}
                <Link
                  href="/checkout"
                  className="w-full py-4 rounded-md bg-[#091426] text-[#C6A15B] text-xs uppercase tracking-widest font-bold hover:bg-[#101D35] hover:text-[#e0c487] transition-all flex items-center justify-center gap-2 shadow-sm border border-[#C6A15B]/30"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                {/* Trust Badges */}
                <div className="pt-2 border-t border-black/[0.06] flex items-center justify-around text-[11px] text-[#091426]/60">
                  <span className="flex items-center gap-1">
                    <Truck className="h-3.5 w-3.5 text-[#C6A15B]" />
                    <span>Express Global Dispatch</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#C6A15B]" />
                    <span>Authenticated Release</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
