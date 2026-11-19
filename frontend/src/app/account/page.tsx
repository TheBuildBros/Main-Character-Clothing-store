"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit2,
  Plus,
  LogOut,
  ShieldCheck,
  Package,
  Sparkles,
  Check,
  AlertCircle,
} from "lucide-react";
import { useAuthStore } from "@/store/auth";
import type { DeliveryAddress } from "@/types";

export default function AccountPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const savedAddress = useAuthStore((s) => s.savedAddress);
  const logout = useAuthStore((s) => s.logout);
  const updateAddress = useAuthStore((s) => s.updateAddress);

  // Address editing state
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressSuccess, setAddressSuccess] = useState(false);

  const [addressForm, setAddressForm] = useState<DeliveryAddress>({
    fullName: "",
    phoneNumber: "",
    houseNumber: "",
    streetName: "",
    areaLocality: "",
    city: "",
    state: "",
    pinCode: "",
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Sync savedAddress to form when editing
  useEffect(() => {
    if (savedAddress) {
      setAddressForm(savedAddress);
    } else if (user) {
      setAddressForm((prev) => ({
        ...prev,
        fullName: user.username,
        phoneNumber: user.phone,
      }));
    }
  }, [savedAddress, user]);

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    updateAddress(addressForm);
    setIsEditingAddress(false);
    setAddressSuccess(true);
    setTimeout(() => setAddressSuccess(false), 3000);
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!isMounted) {
    return null; // Prevent hydration flash
  }

  /* LOGGED-OUT STATE */
  if (!isAuthenticated || !user) {
    return (
      <main className="min-h-screen bg-[#F5F2EA] flex items-center justify-center py-16 px-4 sm:px-8">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-[#091426]/10 p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#101D35] text-[#C6A15B] flex items-center justify-center mx-auto shadow-md">
            <User className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <span
              className="text-2xl font-black text-[#C6A15B] tracking-widest block"
              style={{
                fontFamily:
                  "'Zen Kaku Gothic New', 'Noto Sans JP', sans-serif",
              }}
            >
              主人公
            </span>
            <h1 className="text-xl font-black uppercase tracking-wider text-[#091426]">
              Customer Account Access
            </h1>
            <p className="text-xs text-[#091426]/60 leading-relaxed max-w-xs mx-auto">
              Please sign in to manage your saved delivery addresses, review orders, and access exclusive drops.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <Link
              href="/login"
              className="w-full py-3.5 px-4 rounded-md bg-[#091426] text-[#C6A15B] text-xs uppercase tracking-widest font-bold hover:bg-[#101D35] hover:text-[#e0c487] transition-colors flex items-center justify-center gap-2 border border-[#C6A15B]/30"
            >
              <span>Login with Email OTP</span>
            </Link>

            <Link
              href="/signup"
              className="w-full py-3.5 px-4 rounded-md bg-[#F5F2EA] text-[#091426] text-xs uppercase tracking-widest font-bold hover:bg-[#091426] hover:text-[#C6A15B] transition-colors flex items-center justify-center gap-2 border border-[#091426]/15"
            >
              <span>Create New Account</span>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  /* AUTHENTICATED STATE */
  return (
    <main className="min-h-screen bg-[#F5F2EA] text-[#091426] pb-20">
      {/* Editorial Header Banner */}
      <section className="bg-[#091426] text-[#F5F2EA] py-12 sm:py-16 px-4 sm:px-8 border-b border-[#C6A15B]/20">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#101D35] border border-[#C6A15B]/40 text-[#C6A15B] text-[11px] uppercase tracking-[0.2em] font-semibold">
              <Sparkles className="h-3 w-3" />
              <span>{user.tier || "Protagonist Member"}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-wider text-[#F5F2EA]">
              Welcome, <span className="text-[#C6A15B]">{user.username}</span>
            </h1>
            <p className="text-xs text-[#F5F2EA]/60 tracking-wider">
              Member since {user.joinedDate || "Nov 2026"} &bull; Verified via Email OTP
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="self-start sm:self-auto flex items-center gap-2 py-2.5 px-5 rounded-md bg-[#101D35] text-[#F5F2EA]/80 hover:text-white hover:bg-red-950/60 border border-white/10 transition-colors text-xs uppercase tracking-widest font-medium"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </section>

      {/* Main Account Dashboard */}
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10 space-y-10">
        {addressSuccess && (
          <div className="p-4 rounded-lg bg-emerald-900/10 border border-emerald-600/30 text-emerald-800 text-xs font-medium flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-600" />
            <span>Delivery address saved successfully to your account profile!</span>
          </div>
        )}

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Column: Profile Card (4 cols) */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-white rounded-xl border border-[#091426]/10 p-6 shadow-sm space-y-6">
              <div className="border-b border-black/[0.06] pb-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-[#C6A15B]">
                    Customer Identity
                  </span>
                  <h2 className="text-lg font-black uppercase tracking-wider text-[#091426]">
                    Profile Details
                  </h2>
                </div>
                <div className="p-2 rounded-full bg-[#101D35] text-[#C6A15B]">
                  <User className="h-4 w-4" />
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-[11px] text-[#091426]/50 uppercase tracking-wider block">
                    Username / Name
                  </span>
                  <p className="text-sm font-semibold text-[#091426] mt-0.5">
                    {user.username}
                  </p>
                </div>

                <div>
                  <span className="text-[11px] text-[#091426]/50 uppercase tracking-wider block">
                    Registered Email
                  </span>
                  <p className="text-sm font-semibold text-[#091426] flex items-center gap-2 mt-0.5">
                    <Mail className="h-3.5 w-3.5 text-[#C6A15B]" />
                    <span>{user.email}</span>
                  </p>
                </div>

                <div>
                  <span className="text-[11px] text-[#091426]/50 uppercase tracking-wider block">
                    Contact Phone Number
                  </span>
                  <p className="text-sm font-semibold text-[#091426] flex items-center gap-2 mt-0.5">
                    <Phone className="h-3.5 w-3.5 text-[#C6A15B]" />
                    <span>{user.phone}</span>
                  </p>
                  <span className="text-[10px] text-[#091426]/40 italic block mt-0.5">
                    (Contact only &bull; Auth secured via Email OTP)
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-black/[0.06] text-center">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#091426]/5 text-[11px] text-[#091426]/60 font-medium">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#C6A15B]" />
                  <span>Frontend Mock Session Active</span>
                </span>
              </div>
            </div>

            {/* Orders Placeholder */}
            <div className="bg-white rounded-xl border border-[#091426]/10 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#091426] flex items-center gap-2">
                  <Package className="h-4 w-4 text-[#C6A15B]" />
                  <span>Recent Orders</span>
                </h3>
                <span className="text-[10px] font-mono text-[#091426]/50">0 Orders</span>
              </div>
              <p className="text-xs text-[#091426]/60">
                You have not placed any orders yet. Discover our latest protagonist drops.
              </p>
              <Link
                href="/collections"
                className="inline-block text-xs uppercase tracking-wider font-bold text-[#C6A15B] hover:underline"
              >
                Browse Collections &rarr;
              </Link>
            </div>
          </div>

          {/* Right Column: Delivery Address Section (7 cols) */}
          <div className="md:col-span-7 space-y-6">
            <div className="bg-white rounded-xl border border-[#091426]/10 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-black/[0.06] pb-4">
                <div>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-[#C6A15B]">
                    Shipping & Logistics
                  </span>
                  <h2 className="text-lg font-black uppercase tracking-wider text-[#091426]">
                    Saved Delivery Address
                  </h2>
                </div>

                {!isEditingAddress && savedAddress && (
                  <button
                    type="button"
                    onClick={() => setIsEditingAddress(true)}
                    className="flex items-center gap-1.5 py-1.5 px-3 rounded-md bg-[#101D35]/5 text-[#C6A15B] text-xs font-semibold hover:bg-[#101D35]/15 transition-colors"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    <span>Edit</span>
                  </button>
                )}
              </div>

              {/* View Mode (If Address Exists and Not Editing) */}
              {!isEditingAddress && savedAddress ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-[#F5F2EA]/50 border border-[#091426]/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-[#091426]">
                        {savedAddress.fullName}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#C6A15B]/20 text-[#C6A15B] text-[10px] font-bold uppercase tracking-wider">
                        Default Address
                      </span>
                    </div>

                    <p className="text-xs text-[#091426]/80 leading-relaxed">
                      {savedAddress.houseNumber}, {savedAddress.streetName}
                      <br />
                      {savedAddress.areaLocality}
                      <br />
                      {savedAddress.city}, {savedAddress.state} —{" "}
                      <strong>{savedAddress.pinCode}</strong>
                    </p>

                    <p className="text-xs text-[#091426]/70 pt-1">
                      Phone: {savedAddress.phoneNumber}
                    </p>
                  </div>

                  <div className="p-3 rounded-md bg-[#101D35]/5 border border-black/5 text-[11px] text-[#091426]/70 leading-relaxed flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-[#C6A15B] shrink-0 mt-0.5" />
                    <span>
                      This saved address will pre-fill at checkout. You can also enter a different shipping address during checkout without altering this default address.
                    </span>
                  </div>
                </div>
              ) : !isEditingAddress && !savedAddress ? (
                /* No Address Saved State */
                <div className="text-center py-8 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-[#101D35]/5 text-[#C6A15B] flex items-center justify-center mx-auto">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-[#091426]">
                      No delivery address saved yet
                    </h3>
                    <p className="text-xs text-[#091426]/60 max-w-sm mx-auto">
                      Add your default shipping address now for express protagonist checkout on future drops.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsEditingAddress(true)}
                    className="inline-flex items-center gap-2 py-2.5 px-5 rounded-md bg-[#091426] text-[#C6A15B] text-xs uppercase tracking-widest font-bold hover:bg-[#101D35] transition-colors border border-[#C6A15B]/30"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Delivery Address</span>
                  </button>
                </div>
              ) : (
                /* ADDRESS EDIT / ADD FORM */
                <form onSubmit={handleSaveAddress} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="space-y-1">
                      <label className="text-[11px] uppercase tracking-wider font-bold text-[#091426]">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={addressForm.fullName}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            fullName: e.target.value,
                          })
                        }
                        placeholder="Recipient Name"
                        className="w-full px-3 py-2 rounded border border-[#091426]/20 text-xs text-[#091426] focus:outline-none focus:border-[#C6A15B]"
                      />
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-1">
                      <label className="text-[11px] uppercase tracking-wider font-bold text-[#091426]">
                        Delivery Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        value={addressForm.phoneNumber}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            phoneNumber: e.target.value,
                          })
                        }
                        placeholder="+81 90 1234 5678"
                        className="w-full px-3 py-2 rounded border border-[#091426]/20 text-xs text-[#091426] focus:outline-none focus:border-[#C6A15B]"
                      />
                    </div>

                    {/* House / Flat Number */}
                    <div className="space-y-1">
                      <label className="text-[11px] uppercase tracking-wider font-bold text-[#091426]">
                        House / Flat No. *
                      </label>
                      <input
                        type="text"
                        required
                        value={addressForm.houseNumber}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            houseNumber: e.target.value,
                          })
                        }
                        placeholder="Flat 402, Building A"
                        className="w-full px-3 py-2 rounded border border-[#091426]/20 text-xs text-[#091426] focus:outline-none focus:border-[#C6A15B]"
                      />
                    </div>

                    {/* Street Name */}
                    <div className="space-y-1">
                      <label className="text-[11px] uppercase tracking-wider font-bold text-[#091426]">
                        Street Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={addressForm.streetName}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            streetName: e.target.value,
                          })
                        }
                        placeholder="Protagonist Boulevard"
                        className="w-full px-3 py-2 rounded border border-[#091426]/20 text-xs text-[#091426] focus:outline-none focus:border-[#C6A15B]"
                      />
                    </div>

                    {/* Area / Locality */}
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-[11px] uppercase tracking-wider font-bold text-[#091426]">
                        Area / Locality *
                      </label>
                      <input
                        type="text"
                        required
                        value={addressForm.areaLocality}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            areaLocality: e.target.value,
                          })
                        }
                        placeholder="Shibuya-ku, Central District"
                        className="w-full px-3 py-2 rounded border border-[#091426]/20 text-xs text-[#091426] focus:outline-none focus:border-[#C6A15B]"
                      />
                    </div>

                    {/* City */}
                    <div className="space-y-1">
                      <label className="text-[11px] uppercase tracking-wider font-bold text-[#091426]">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        value={addressForm.city}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            city: e.target.value,
                          })
                        }
                        placeholder="Tokyo"
                        className="w-full px-3 py-2 rounded border border-[#091426]/20 text-xs text-[#091426] focus:outline-none focus:border-[#C6A15B]"
                      />
                    </div>

                    {/* State */}
                    <div className="space-y-1">
                      <label className="text-[11px] uppercase tracking-wider font-bold text-[#091426]">
                        State / Province *
                      </label>
                      <input
                        type="text"
                        required
                        value={addressForm.state}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            state: e.target.value,
                          })
                        }
                        placeholder="Tokyo Prefecture"
                        className="w-full px-3 py-2 rounded border border-[#091426]/20 text-xs text-[#091426] focus:outline-none focus:border-[#C6A15B]"
                      />
                    </div>

                    {/* PIN Code */}
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-[11px] uppercase tracking-wider font-bold text-[#091426]">
                        PIN / Postal Code *
                      </label>
                      <input
                        type="text"
                        required
                        value={addressForm.pinCode}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            pinCode: e.target.value,
                          })
                        }
                        placeholder="150-0001"
                        className="w-full px-3 py-2 rounded border border-[#091426]/20 text-xs text-[#091426] focus:outline-none focus:border-[#C6A15B]"
                      />
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-black/[0.06]">
                    <button
                      type="button"
                      onClick={() => setIsEditingAddress(false)}
                      className="py-2.5 px-4 rounded text-xs font-semibold text-[#091426]/70 hover:bg-[#091426]/5 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="py-2.5 px-5 rounded bg-[#091426] text-[#C6A15B] text-xs uppercase tracking-widest font-bold hover:bg-[#101D35] hover:text-[#e0c487] transition-colors border border-[#C6A15B]/30"
                    >
                      Save Delivery Address
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
