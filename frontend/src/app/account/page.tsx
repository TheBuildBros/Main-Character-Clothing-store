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
    return null;
  }

  /* LOGGED-OUT STATE */
  if (!isAuthenticated || !user) {
    return (
      <main className="min-h-screen bg-[#F8F6F1] flex items-center justify-center py-20 px-4 sm:px-8">
        <div className="max-w-md w-full bg-white border border-[#20242B]/[0.08] shadow-[0_4px_24px_rgba(11,31,58,0.06)] p-8 sm:p-10 text-center space-y-6">
          <div className="w-16 h-16 bg-[#0B1F3A] text-[#C6A76A] flex items-center justify-center mx-auto">
            <User className="h-7 w-7" strokeWidth={1.5} />
          </div>

          <div className="space-y-2">
            <span
              className="text-2xl font-black text-[#C6A76A] tracking-[0.25em] block"
              style={{
                fontFamily: "'Zen Kaku Gothic New', 'Noto Sans JP', sans-serif",
              }}
            >
              主人公
            </span>
            <h1
              className="text-2xl text-[#0B1F3A]"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 600,
                fontStyle: "italic",
              }}
            >
              VIP Account Access
            </h1>
            <p className="text-xs text-[#20242B]/60 leading-relaxed max-w-xs mx-auto font-light">
              Sign in to manage your saved delivery addresses, review orders, and access exclusive runway drops.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <Link
              href="/login"
              className="w-full py-3.5 px-4 bg-[#0B1F3A] text-[#C6A76A] text-[10px] uppercase tracking-[0.28em] font-semibold hover:bg-[#C6A76A] hover:text-[#0B1F3A] transition-all duration-300 flex items-center justify-center gap-2 border border-[#0B1F3A]"
            >
              <span>Login with Email OTP</span>
            </Link>

            <Link
              href="/signup"
              className="w-full py-3.5 px-4 bg-transparent text-[#20242B] text-[10px] uppercase tracking-[0.28em] font-medium hover:border-[#0B1F3A] transition-colors flex items-center justify-center gap-2 border border-[#20242B]/15"
            >
              <span>Register VIP Account</span>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  /* AUTHENTICATED STATE */
  return (
    <main className="min-h-screen bg-[#F8F6F1] text-[#20242B] pb-24">
      {/* Editorial Header Banner */}
      <section className="bg-[#0B1F3A] text-[#F8F6F1] pt-16 pb-12 sm:pt-20 sm:pb-16 px-5 sm:px-8 border-b border-[#C6A76A]/15">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-0.5 border border-[#C6A76A]/40 text-[#C6A76A] text-[10px] uppercase tracking-[0.25em] font-medium bg-[#C6A76A]/10">
              <span>{user.tier || "VIP Protagonist Member"}</span>
            </div>
            <h1
              className="text-3xl sm:text-4xl text-[#F8F6F1]"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 600,
                fontStyle: "italic",
              }}
            >
              Welcome, <span className="text-[#C6A76A] font-normal not-italic">{user.username}</span>
            </h1>
            <p className="text-xs text-[#F8F6F1]/50 tracking-wider font-light">
              Registered Profile &bull; Authenticated Member
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="self-start sm:self-auto flex items-center gap-2 py-2.5 px-5 bg-transparent text-[#F8F6F1]/70 hover:text-white hover:bg-white/5 border border-white/15 transition-colors text-[10px] uppercase tracking-[0.25em] font-medium"
          >
            <LogOut className="h-3.5 w-3.5" strokeWidth={1.5} />
            <span>Sign Out</span>
          </button>
        </div>
      </section>

      {/* Main Account Dashboard */}
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-10 space-y-8">
        {addressSuccess && (
          <div className="p-4 bg-emerald-900/10 border border-emerald-600/30 text-emerald-800 text-xs font-medium flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-600" />
            <span>Delivery address updated successfully in your account profile.</span>
          </div>
        )}

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Column: Profile Card (5 cols) */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-white border border-[#20242B]/[0.08] p-6 sm:p-7 shadow-[0_2px_16px_rgba(11,31,58,0.04)] space-y-6">
              <div className="border-b border-[#20242B]/[0.08] pb-4 flex items-center justify-between">
                <div>
                  <span className="text-[9px] uppercase tracking-[0.35em] font-medium text-[#C6A76A] block">
                    Customer Profile
                  </span>
                  <h2
                    className="text-lg text-[#0B1F3A]"
                    style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600 }}
                  >
                    Personal Details
                  </h2>
                </div>
                <div className="p-2.5 bg-[#0B1F3A] text-[#C6A76A]">
                  <User className="h-4 w-4" strokeWidth={1.5} />
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-[10px] text-[#20242B]/50 uppercase tracking-[0.2em] block">
                    Name / Alias
                  </span>
                  <p className="text-sm font-medium text-[#0B1F3A] mt-0.5">
                    {user.username}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] text-[#20242B]/50 uppercase tracking-[0.2em] block">
                    Registered Email
                  </span>
                  <p className="text-sm font-medium text-[#0B1F3A] flex items-center gap-2 mt-0.5">
                    <Mail className="h-3.5 w-3.5 text-[#C6A76A]" strokeWidth={1.5} />
                    <span>{user.email}</span>
                  </p>
                </div>

                <div>
                  <span className="text-[10px] text-[#20242B]/50 uppercase tracking-[0.2em] block">
                    Contact Phone
                  </span>
                  <p className="text-sm font-medium text-[#0B1F3A] flex items-center gap-2 mt-0.5">
                    <Phone className="h-3.5 w-3.5 text-[#C6A76A]" strokeWidth={1.5} />
                    <span>{user.phone}</span>
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#20242B]/[0.08]">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0B1F3A]/5 text-[10px] text-[#0B1F3A] uppercase tracking-wider font-medium">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#C6A76A]" strokeWidth={1.5} />
                  <span>Authenticated Client Profile</span>
                </span>
              </div>
            </div>

            {/* Orders Placeholder */}
            <div className="bg-white border border-[#20242B]/[0.08] p-6 shadow-[0_2px_16px_rgba(11,31,58,0.04)] space-y-4">
              <div className="flex items-center justify-between border-b border-[#20242B]/[0.08] pb-3">
                <h3
                  className="text-base text-[#0B1F3A] flex items-center gap-2"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600 }}
                >
                  <Package className="h-4 w-4 text-[#C6A76A]" strokeWidth={1.5} />
                  <span>Recent Orders</span>
                </h3>
                <span className="text-[10px] font-mono text-[#20242B]/40">0 Orders</span>
              </div>
              <p className="text-xs text-[#20242B]/60 font-light leading-relaxed">
                You have not placed any orders yet. Discover our latest protagonist drops in the seasonal archive.
              </p>
              <Link
                href="/collections"
                className="inline-block text-[10px] uppercase tracking-[0.25em] font-semibold text-[#C6A76A] hover:underline"
              >
                Browse Collections →
              </Link>
            </div>
          </div>

          {/* Right Column: Delivery Address Section (7 cols) */}
          <div className="md:col-span-7 space-y-6">
            <div className="bg-white border border-[#20242B]/[0.08] p-6 sm:p-8 shadow-[0_2px_16px_rgba(11,31,58,0.04)] space-y-6">
              <div className="flex items-center justify-between border-b border-[#20242B]/[0.08] pb-4">
                <div>
                  <span className="text-[9px] uppercase tracking-[0.35em] font-medium text-[#C6A76A] block">
                    Shipping & Logistics
                  </span>
                  <h2
                    className="text-lg text-[#0B1F3A]"
                    style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600 }}
                  >
                    Saved Delivery Address
                  </h2>
                </div>

                {!isEditingAddress && savedAddress && (
                  <button
                    type="button"
                    onClick={() => setIsEditingAddress(true)}
                    className="flex items-center gap-1.5 py-1 px-3 border border-[#0B1F3A]/20 text-[#0B1F3A] text-[10px] uppercase tracking-wider font-semibold hover:bg-[#0B1F3A] hover:text-[#C6A76A] transition-colors"
                  >
                    <Edit2 className="h-3 w-3" strokeWidth={1.5} />
                    <span>Edit</span>
                  </button>
                )}
              </div>

              {/* View Mode (If Address Exists and Not Editing) */}
              {!isEditingAddress && savedAddress ? (
                <div className="space-y-4">
                  <div className="p-5 bg-[#F8F6F1] border border-[#20242B]/[0.08] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-[#0B1F3A]">
                        {savedAddress.fullName}
                      </span>
                      <span className="px-2 py-0.5 bg-[#C6A76A]/20 text-[#0B1F3A] text-[9px] font-semibold uppercase tracking-wider">
                        Default Destination
                      </span>
                    </div>

                    <p className="text-xs text-[#20242B]/80 leading-relaxed font-light">
                      {savedAddress.houseNumber}, {savedAddress.streetName}
                      <br />
                      {savedAddress.areaLocality}
                      <br />
                      {savedAddress.city}, {savedAddress.state} —{" "}
                      <strong>{savedAddress.pinCode}</strong>
                    </p>

                    <p className="text-xs text-[#20242B]/70 pt-1 font-light">
                      Phone: {savedAddress.phoneNumber}
                    </p>
                  </div>

                  <div className="p-3.5 bg-[#0B1F3A]/5 border border-[#C6A76A]/30 text-[11px] text-[#20242B]/75 leading-relaxed flex items-start gap-2.5">
                    <AlertCircle className="h-4 w-4 text-[#C6A76A] shrink-0 mt-0.5" strokeWidth={1.5} />
                    <span className="font-light">
                      This address is automatically pre-filled at checkout. You can modify it during checkout for individual deliveries.
                    </span>
                  </div>
                </div>
              ) : !isEditingAddress && !savedAddress ? (
                /* No Address Saved State */
                <div className="text-center py-10 space-y-4">
                  <div className="w-12 h-12 bg-[#0B1F3A]/5 text-[#C6A76A] flex items-center justify-center mx-auto">
                    <MapPin className="h-6 w-6" strokeWidth={1.5} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-[#0B1F3A]">
                      No default delivery address recorded
                    </h3>
                    <p className="text-xs text-[#20242B]/60 max-w-sm mx-auto font-light">
                      Save your default shipping destination for seamless checkout on future drops.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsEditingAddress(true)}
                    className="inline-flex items-center gap-2 py-3 px-6 bg-[#0B1F3A] text-[#C6A76A] text-[10px] uppercase tracking-[0.25em] font-semibold hover:bg-[#C6A76A] hover:text-[#0B1F3A] transition-all duration-300"
                  >
                    <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
                    <span>Add Delivery Destination</span>
                  </button>
                </div>
              ) : (
                /* ADDRESS EDIT / ADD FORM */
                <form onSubmit={handleSaveAddress} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#0B1F3A]">
                        Recipient Name *
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
                        className="w-full px-3 py-2.5 border border-[#20242B]/15 bg-[#F8F6F1]/50 text-xs text-[#20242B] focus:outline-none focus:border-[#C6A76A]"
                      />
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#0B1F3A]">
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
                        className="w-full px-3 py-2.5 border border-[#20242B]/15 bg-[#F8F6F1]/50 text-xs text-[#20242B] focus:outline-none focus:border-[#C6A76A]"
                      />
                    </div>

                    {/* House / Flat Number */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#0B1F3A]">
                        Building / Suite *
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
                        placeholder="Suite 402, Building A"
                        className="w-full px-3 py-2.5 border border-[#20242B]/15 bg-[#F8F6F1]/50 text-xs text-[#20242B] focus:outline-none focus:border-[#C6A76A]"
                      />
                    </div>

                    {/* Street Name */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#0B1F3A]">
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
                        className="w-full px-3 py-2.5 border border-[#20242B]/15 bg-[#F8F6F1]/50 text-xs text-[#20242B] focus:outline-none focus:border-[#C6A76A]"
                      />
                    </div>

                    {/* Area / Locality */}
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#0B1F3A]">
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
                        className="w-full px-3 py-2.5 border border-[#20242B]/15 bg-[#F8F6F1]/50 text-xs text-[#20242B] focus:outline-none focus:border-[#C6A76A]"
                      />
                    </div>

                    {/* City */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#0B1F3A]">
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
                        className="w-full px-3 py-2.5 border border-[#20242B]/15 bg-[#F8F6F1]/50 text-xs text-[#20242B] focus:outline-none focus:border-[#C6A76A]"
                      />
                    </div>

                    {/* State */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#0B1F3A]">
                        Prefecture / State *
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
                        className="w-full px-3 py-2.5 border border-[#20242B]/15 bg-[#F8F6F1]/50 text-xs text-[#20242B] focus:outline-none focus:border-[#C6A76A]"
                      />
                    </div>

                    {/* PIN Code */}
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#0B1F3A]">
                        Postal / PIN Code *
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
                        className="w-full px-3 py-2.5 border border-[#20242B]/15 bg-[#F8F6F1]/50 text-xs text-[#20242B] focus:outline-none focus:border-[#C6A76A]"
                      />
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#20242B]/[0.08]">
                    <button
                      type="button"
                      onClick={() => setIsEditingAddress(false)}
                      className="py-2.5 px-4 text-xs font-medium text-[#20242B]/70 hover:text-[#20242B] transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="py-3 px-6 bg-[#0B1F3A] text-[#C6A76A] text-[10px] uppercase tracking-[0.25em] font-semibold hover:bg-[#C6A76A] hover:text-[#0B1F3A] transition-all duration-300"
                    >
                      Save Destination
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
