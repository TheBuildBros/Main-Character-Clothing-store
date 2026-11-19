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
  CheckCircle2,
} from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { useCartStore } from "@/store/cart";

export default function CheckoutPage() {
  const [isMounted, setIsMounted] = useState(false);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const savedAddress = useAuthStore((s) => s.savedAddress);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const totalItemCount = useCartStore((s) => s.getTotalItems());

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

  const subtotal = getSubtotal() || 195;
  const shipping = subtotal >= 200 ? 0 : 15;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <main className="min-h-screen bg-[#F5F2EA] text-[#091426] pb-24">
      {/* Header */}
      <section className="bg-[#091426] text-[#F5F2EA] py-10 px-4 sm:px-8 border-b border-[#C6A15B]/20">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link
            href="/carts"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#C6A15B] hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Cart</span>
          </Link>
          <div className="flex items-center gap-2 text-xs text-[#F5F2EA]/70">
            <Lock className="h-3.5 w-3.5 text-[#C6A15B]" />
            <span>Encrypted Checkout (Demo State)</span>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Delivery & Payment Details (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Delivery Address */}
            <div className="bg-white rounded-xl border border-[#091426]/10 p-6 sm:p-8 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
                <h2 className="text-base font-black uppercase tracking-wider text-[#091426] flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#C6A15B]" />
                  <span>1. Delivery Destination</span>
                </h2>
                {savedAddress && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#C6A15B] bg-[#101D35]/5 px-2 py-0.5 rounded">
                    Default Profile Address
                  </span>
                )}
              </div>

              {savedAddress && !useDifferentAddress ? (
                <div className="p-4 rounded-lg bg-[#F5F2EA]/50 border border-[#091426]/10 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm text-[#091426]">
                      {savedAddress.fullName}
                    </span>
                    <span className="text-xs text-[#091426]/70">
                      {savedAddress.phoneNumber}
                    </span>
                  </div>
                  <p className="text-xs text-[#091426]/80 leading-relaxed">
                    {savedAddress.houseNumber}, {savedAddress.streetName}, {savedAddress.areaLocality}
                    <br />
                    {savedAddress.city}, {savedAddress.state} — {savedAddress.pinCode}
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setUseDifferentAddress(true)}
                      className="text-xs font-bold text-[#C6A15B] hover:underline"
                    >
                      Ship to a different address for this order &rarr;
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {savedAddress && (
                    <button
                      type="button"
                      onClick={() => setUseDifferentAddress(false)}
                      className="text-xs font-bold text-[#C6A15B] hover:underline block"
                    >
                      &larr; Revert to saved default address
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
                      className="w-full px-3 py-2 rounded border border-[#091426]/20"
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
                      className="w-full px-3 py-2 rounded border border-[#091426]/20"
                    />
                    <input
                      type="text"
                      placeholder="House / Flat Number"
                      value={checkoutAddress.houseNumber}
                      onChange={(e) =>
                        setCheckoutAddress({
                          ...checkoutAddress,
                          houseNumber: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 rounded border border-[#091426]/20"
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
                      className="w-full px-3 py-2 rounded border border-[#091426]/20"
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
                      className="w-full px-3 py-2 rounded border border-[#091426]/20"
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={checkoutAddress.state}
                      onChange={(e) =>
                        setCheckoutAddress({
                          ...checkoutAddress,
                          state: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 rounded border border-[#091426]/20"
                    />
                    <input
                      type="text"
                      placeholder="PIN Code"
                      value={checkoutAddress.pinCode}
                      onChange={(e) =>
                        setCheckoutAddress({
                          ...checkoutAddress,
                          pinCode: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 rounded border border-[#091426]/20 sm:col-span-2"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Step 2: Payment Method Selection Placeholder */}
            <div className="bg-white rounded-xl border border-[#091426]/10 p-6 sm:p-8 shadow-sm space-y-4">
              <div className="border-b border-black/[0.06] pb-3">
                <h2 className="text-base font-black uppercase tracking-wider text-[#091426] flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-[#C6A15B]" />
                  <span>2. Payment Method</span>
                </h2>
              </div>

              <div className="space-y-2.5">
                {[
                  { id: "card", label: "Credit / Debit Card (Stripe)" },
                  { id: "upi", label: "UPI / Net Banking (Razorpay)" },
                  { id: "cod", label: "Cash on Delivery (Protagonist Vault)" },
                ].map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex items-center justify-between p-3.5 rounded-lg border cursor-pointer transition-colors ${
                      selectedPayment === opt.id
                        ? "border-[#C6A15B] bg-[#101D35]/5"
                        : "border-[#091426]/15 hover:bg-black/5"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        value={opt.id}
                        checked={selectedPayment === opt.id}
                        onChange={() => setSelectedPayment(opt.id)}
                        className="accent-[#C6A15B]"
                      />
                      <span className="text-xs font-semibold text-[#091426]">
                        {opt.label}
                      </span>
                    </div>
                    <span className="text-[10px] uppercase font-mono text-[#091426]/40">
                      Placeholder
                    </span>
                  </label>
                ))}
              </div>

              <div className="p-3 rounded-md bg-[#101D35]/5 border border-[#C6A15B]/30 flex items-start gap-2.5">
                <ShieldCheck className="h-4 w-4 text-[#C6A15B] shrink-0 mt-0.5" />
                <p className="text-[11px] text-[#091426]/80 leading-relaxed">
                  Payment gateway integration is currently simulated. No real transaction will be processed.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Order Review & Place Order Button (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-xl border border-[#091426]/10 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="border-b border-black/[0.06] pb-3">
                <h3 className="text-base font-black uppercase tracking-wider text-[#091426]">
                  Order Total
                </h3>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-[#091426]/80">
                  <span>Cart Items ({totalItemCount || 1})</span>
                  <span className="font-semibold text-[#091426]">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-[#091426]/80">
                  <span>Shipping</span>
                  <span className="font-semibold text-[#091426]">
                    {shipping === 0 ? "Complimentary" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-[#091426]/80">
                  <span>Estimated Tax (8%)</span>
                  <span className="font-semibold text-[#091426]">
                    ${tax.toFixed(2)}
                  </span>
                </div>
                <div className="pt-3 border-t border-black/[0.06] flex justify-between items-baseline">
                  <span className="text-sm font-bold uppercase tracking-wider text-[#091426]">
                    Payable Amount
                  </span>
                  <span className="text-xl font-black text-[#091426]">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  alert(
                    "Order placed in mock demo mode! Real payment gateway integration will be attached in the backend milestone."
                  )
                }
                className="w-full py-4 rounded-md bg-[#091426] text-[#C6A15B] text-xs uppercase tracking-widest font-bold hover:bg-[#101D35] hover:text-[#e0c487] transition-all border border-[#C6A15B]/30 shadow-sm"
              >
                Place Order (Demo)
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
