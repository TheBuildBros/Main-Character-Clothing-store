"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CreditCard,
  MapPin,
  ArrowLeft,
  Lock,
  Truck,
} from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { useCartStore } from "@/store/cart";

export default function CheckoutPage() {
  const [isMounted, setIsMounted] = useState(false);
  const user = useAuthStore((s) => s.user);
  const savedAddress = useAuthStore((s) => s.savedAddress);
  const items = useCartStore((s) => s.items);
  const totalItemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0) || 195;

  const [useDifferentAddress, setUseDifferentAddress] = useState(false);
  const [checkoutAddress, setCheckoutAddress] = useState({
    fullName: "",
    phoneNumber: "",
    houseNumber: "",
    streetName: "",
    areaLocality: "",
    city: "",
    state: "",
    pinCode: "",
  });

  const [selectedPayment, setSelectedPayment] = useState("card");

  useEffect(() => {
    setIsMounted(true);
    if (savedAddress) {
      setCheckoutAddress(savedAddress);
    } else if (user) {
      setCheckoutAddress((prev) => ({
        ...prev,
        fullName: user.username,
        phoneNumber: user.phone,
      }));
    }
  }, [savedAddress, user]);

  if (!isMounted) return null;

  const shipping = subtotal >= 200 ? 0 : 15;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <main className="min-h-screen bg-[#F8F6F1] text-[#20242B] pb-24">
      {/* Header */}
      <section className="bg-[#0B1F3A] text-[#F8F6F1] py-8 sm:py-10 px-5 sm:px-8 border-b border-[#C6A76A]/15">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link
            href="/carts"
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] font-semibold text-[#C6A76A] hover:text-[#e0c487] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
            <span>Return to Bag</span>
          </Link>
          <div className="flex items-center gap-2 text-[10px] text-[#F8F6F1]/60 uppercase tracking-widest font-mono">
            <Lock className="h-3.5 w-3.5 text-[#C6A76A]" strokeWidth={1.5} />
            <span>Encrypted Checkout Protocol</span>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-10 space-y-8">
        <div>
          <span className="text-[9px] uppercase tracking-[0.35em] font-medium text-[#C6A76A] block mb-1">
            Express Order
          </span>
          <h1
            className="text-3xl sm:text-4xl text-[#0B1F3A]"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 600,
              fontStyle: "italic",
            }}
          >
            Order Finalization
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Delivery & Payment Details (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Delivery Address */}
            <div className="bg-white border border-[#20242B]/[0.08] p-6 sm:p-8 shadow-[0_2px_16px_rgba(11,31,58,0.04)] space-y-5">
              <div className="flex items-center justify-between border-b border-[#20242B]/[0.08] pb-3">
                <h2
                  className="text-lg text-[#0B1F3A] flex items-center gap-2"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600 }}
                >
                  <MapPin className="h-4 w-4 text-[#C6A76A]" strokeWidth={1.5} />
                  <span>1. Delivery Destination</span>
                </h2>
                {savedAddress && (
                  <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#C6A76A] bg-[#0B1F3A]/5 px-2.5 py-0.5">
                    Saved Profile Address
                  </span>
                )}
              </div>

              {savedAddress && !useDifferentAddress ? (
                <div className="p-5 bg-[#F8F6F1] border border-[#20242B]/[0.08] space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-sm text-[#0B1F3A]">
                      {savedAddress.fullName}
                    </span>
                    <span className="text-xs text-[#20242B]/60 font-light">
                      {savedAddress.phoneNumber}
                    </span>
                  </div>
                  <p className="text-xs text-[#20242B]/80 leading-relaxed font-light">
                    {savedAddress.houseNumber}, {savedAddress.streetName}, {savedAddress.areaLocality}
                    <br />
                    {savedAddress.city}, {savedAddress.state} — {savedAddress.pinCode}
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setUseDifferentAddress(true)}
                      className="text-[10px] uppercase tracking-wider font-semibold text-[#C6A76A] hover:underline"
                    >
                      Ship to alternative address for this order →
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {savedAddress && (
                    <button
                      type="button"
                      onClick={() => setUseDifferentAddress(false)}
                      className="text-[10px] uppercase tracking-wider font-semibold text-[#C6A76A] hover:underline block"
                    >
                      ← Revert to saved default address
                    </button>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <input
                      type="text"
                      placeholder="Recipient Full Name"
                      value={checkoutAddress.fullName}
                      onChange={(e) =>
                        setCheckoutAddress({
                          ...checkoutAddress,
                          fullName: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2.5 border border-[#20242B]/15 bg-[#F8F6F1]/50 text-xs text-[#20242B] focus:outline-none focus:border-[#C6A76A]"
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={checkoutAddress.phoneNumber}
                      onChange={(e) =>
                        setCheckoutAddress({
                          ...checkoutAddress,
                          phoneNumber: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2.5 border border-[#20242B]/15 bg-[#F8F6F1]/50 text-xs text-[#20242B] focus:outline-none focus:border-[#C6A76A]"
                    />
                    <input
                      type="text"
                      placeholder="Building / Suite"
                      value={checkoutAddress.houseNumber}
                      onChange={(e) =>
                        setCheckoutAddress({
                          ...checkoutAddress,
                          houseNumber: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2.5 border border-[#20242B]/15 bg-[#F8F6F1]/50 text-xs text-[#20242B] focus:outline-none focus:border-[#C6A76A]"
                    />
                    <input
                      type="text"
                      placeholder="Street Name"
                      value={checkoutAddress.streetName}
                      onChange={(e) =>
                        setCheckoutAddress({
                          ...checkoutAddress,
                          streetName: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2.5 border border-[#20242B]/15 bg-[#F8F6F1]/50 text-xs text-[#20242B] focus:outline-none focus:border-[#C6A76A]"
                    />
                    <input
                      type="text"
                      placeholder="City"
                      value={checkoutAddress.city}
                      onChange={(e) =>
                        setCheckoutAddress({
                          ...checkoutAddress,
                          city: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2.5 border border-[#20242B]/15 bg-[#F8F6F1]/50 text-xs text-[#20242B] focus:outline-none focus:border-[#C6A76A]"
                    />
                    <input
                      type="text"
                      placeholder="State / Prefecture"
                      value={checkoutAddress.state}
                      onChange={(e) =>
                        setCheckoutAddress({
                          ...checkoutAddress,
                          state: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2.5 border border-[#20242B]/15 bg-[#F8F6F1]/50 text-xs text-[#20242B] focus:outline-none focus:border-[#C6A76A]"
                    />
                    <input
                      type="text"
                      placeholder="Postal / PIN Code"
                      value={checkoutAddress.pinCode}
                      onChange={(e) =>
                        setCheckoutAddress({
                          ...checkoutAddress,
                          pinCode: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2.5 border border-[#20242B]/15 bg-[#F8F6F1]/50 text-xs text-[#20242B] focus:outline-none focus:border-[#C6A76A] sm:col-span-2"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Step 2: Payment Method */}
            <div className="bg-white border border-[#20242B]/[0.08] p-6 sm:p-8 shadow-[0_2px_16px_rgba(11,31,58,0.04)] space-y-4">
              <div className="border-b border-[#20242B]/[0.08] pb-3">
                <h2
                  className="text-lg text-[#0B1F3A] flex items-center gap-2"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600 }}
                >
                  <CreditCard className="h-4 w-4 text-[#C6A76A]" strokeWidth={1.5} />
                  <span>2. Payment Method</span>
                </h2>
              </div>

              <div className="space-y-2.5">
                {[
                  { id: "card", label: "Credit / Debit Card (Stripe Global)", sub: "Visa, Mastercard, Amex" },
                  { id: "upi", label: "Instant Net Banking / UPI", sub: "Razorpay Secure Protocol" },
                  { id: "cod", label: "Concierge Cash on Delivery", sub: "Protagonist Vault Inspection" },
                ].map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex items-center justify-between p-4 border cursor-pointer transition-all duration-200 ${
                      selectedPayment === opt.id
                        ? "border-[#C6A76A] bg-[#C6A76A]/5"
                        : "border-[#20242B]/15 hover:border-[#20242B]/30"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        value={opt.id}
                        checked={selectedPayment === opt.id}
                        onChange={() => setSelectedPayment(opt.id)}
                        className="accent-[#C6A76A]"
                      />
                      <div>
                        <span className="text-xs font-semibold text-[#0B1F3A] block">
                          {opt.label}
                        </span>
                        <span className="text-[10px] text-[#20242B]/50 font-light">
                          {opt.sub}
                        </span>
                      </div>
                    </div>
                    <span className="text-[9px] uppercase font-mono tracking-wider text-[#C6A76A]">
                      Encrypted
                    </span>
                  </label>
                ))}
              </div>

              <div className="p-3.5 border border-[#C6A76A]/25 bg-[#C6A76A]/5 flex items-start gap-2.5">
                <ShieldCheck className="h-4 w-4 text-[#C6A76A] shrink-0 mt-0.5" strokeWidth={1.5} />
                <p className="text-[11px] text-[#20242B]/75 leading-relaxed font-light">
                  Demo order environment. No live financial transaction will be charged during this preview session.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Order Review (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-[#20242B]/[0.08] p-6 sm:p-8 shadow-[0_2px_16px_rgba(11,31,58,0.04)] space-y-6">
              <div className="border-b border-[#20242B]/[0.08] pb-3">
                <span className="text-[9px] uppercase tracking-[0.35em] font-medium text-[#C6A76A] block mb-1">
                  Payable Summary
                </span>
                <h3
                  className="text-xl text-[#0B1F3A]"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600 }}
                >
                  Order Total
                </h3>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-[#20242B]/70 font-light">
                  <span>Cart Items ({totalItemCount || 1})</span>
                  <span className="font-medium text-[#20242B]">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-[#20242B]/70 font-light">
                  <span>Express Courier Shipping</span>
                  <span className="font-medium text-[#20242B]">
                    {shipping === 0 ? "Complimentary" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-[#20242B]/70 font-light">
                  <span>Estimated Sales Tax (8%)</span>
                  <span className="font-medium text-[#20242B]">
                    ${tax.toFixed(2)}
                  </span>
                </div>
                <div className="pt-4 border-t border-[#20242B]/[0.08] flex justify-between items-baseline">
                  <span className="text-xs uppercase tracking-widest font-semibold text-[#0B1F3A]">
                    Payable Total
                  </span>
                  <span
                    className="text-[#0B1F3A]"
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontSize: "26px",
                      fontWeight: 600,
                    }}
                  >
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  alert(
                    "Order placed successfully in prototype mode. Order confirmation details have been staged."
                  )
                }
                className="w-full py-4 bg-[#0B1F3A] text-[#C6A76A] text-[10px] uppercase tracking-[0.3em] font-semibold hover:bg-[#C6A76A] hover:text-[#0B1F3A] transition-all duration-300 border border-[#0B1F3A]"
              >
                Confirm & Place Order
              </button>

              <div className="pt-2 border-t border-[#20242B]/[0.08] flex items-center justify-around text-[9px] text-[#20242B]/50 uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Truck className="h-3.5 w-3.5 text-[#C6A76A]" strokeWidth={1.5} />
                  <span>Insured Transit</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#C6A76A]" strokeWidth={1.5} />
                  <span>Bespoke Packing</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
