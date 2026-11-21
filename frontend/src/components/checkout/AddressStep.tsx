"use client";

import { useState } from "react";
import {
  validateAddressField,
  validateAddressForm,
  type AddressFormErrors,
  type AddressTag,
  type SavedCheckoutAddress,
} from "@/components/checkout/types";

interface AddressStepProps {
  addresses: SavedCheckoutAddress[];
  selectedAddressId: string | null;
  onSelectAddress: (id: string) => void;
  onSaveAddress: (address: SavedCheckoutAddress, isEdit: boolean) => void;
  onConfirmAddress: (address: SavedCheckoutAddress) => void;
  defaultFullName?: string;
  defaultPhone?: string;
}

const EMPTY_DRAFT = (
  fullName = "",
  phoneNumber = ""
): Omit<SavedCheckoutAddress, "id"> => ({
  fullName,
  phoneNumber: phoneNumber.replace(/\D/g, "").slice(-10),
  houseNumber: "",
  streetName: "",
  areaLocality: "",
  city: "",
  state: "",
  pinCode: "",
  addressType: "Home",
});

export function AddressStep({
  addresses,
  selectedAddressId,
  onSelectAddress,
  onSaveAddress,
  onConfirmAddress,
  defaultFullName = "",
  defaultPhone = "",
}: AddressStepProps) {
  const [showForm, setShowForm] = useState(addresses.length === 0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Omit<SavedCheckoutAddress, "id">>(() =>
    EMPTY_DRAFT(defaultFullName, defaultPhone)
  );
  const [errors, setErrors] = useState<AddressFormErrors>({});

  const openAddForm = () => {
    setEditingId(null);
    setDraft(EMPTY_DRAFT(defaultFullName, defaultPhone));
    setErrors({});
    setShowForm(true);
  };

  const openEditForm = (addr: SavedCheckoutAddress) => {
    setEditingId(addr.id);
    setDraft({
      fullName: addr.fullName,
      phoneNumber: addr.phoneNumber,
      houseNumber: addr.houseNumber,
      streetName: addr.streetName,
      areaLocality: addr.areaLocality,
      city: addr.city,
      state: addr.state,
      pinCode: addr.pinCode,
      addressType: addr.addressType,
      isDefault: addr.isDefault,
    });
    setErrors({});
    setShowForm(true);
  };

  const handleFieldChange = (
    field: keyof Omit<SavedCheckoutAddress, "id" | "isDefault" | "addressType">,
    value: string
  ) => {
    let cleaned = value;
    if (field === "phoneNumber") {
      cleaned = value.replace(/\D/g, "").slice(0, 10);
    } else if (field === "pinCode") {
      cleaned = value.replace(/\D/g, "").slice(0, 6);
    }
    setDraft((prev) => ({ ...prev, [field]: cleaned }));
    if (field in errors) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFieldBlur = (field: keyof AddressFormErrors) => {
    const err = validateAddressField(field, draft[field] ?? "");
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = validateAddressForm(draft);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const saved: SavedCheckoutAddress = {
      ...draft,
      id: editingId ?? `addr-${Date.now()}`,
    };
    onSaveAddress(saved, Boolean(editingId));
    setShowForm(false);
    setEditingId(null);
    onConfirmAddress(saved);
  };

  const inputBaseClass =
    "w-full min-h-[46px] px-3.5 py-2.5 text-base bg-[#F8F6F1]/60 border rounded-sm text-[#20242B] placeholder:text-[#6B6B6B]/70 focus:outline-none focus:border-[#C6A76A] focus:ring-2 focus:ring-[#C6A76A]/45 transition-colors";

  return (
    <div className="space-y-4">
      {/* Saved Address Radio Cards */}
      {addresses.length > 0 && (
        <div role="radiogroup" aria-label="Saved delivery addresses" className="space-y-3">
          {addresses.map((addr) => {
            const isSelected = addr.id === selectedAddressId && !showForm;
            return (
              <div
                key={addr.id}
                className={`border rounded-sm p-4 sm:p-5 transition-all duration-250 motion-reduce:transition-none ${
                  isSelected
                    ? "border-[#C6A76A] bg-[#F8F6F1]/70"
                    : "border-[#0B1F3A]/12 bg-white hover:border-[#0B1F3A]/30"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <label className="flex items-start gap-3 cursor-pointer flex-1 min-w-0">
                    <input
                      type="radio"
                      name="checkout-delivery-address"
                      checked={isSelected}
                      onChange={() => {
                        setShowForm(false);
                        onSelectAddress(addr.id);
                      }}
                      className="mt-1 h-4 w-4 accent-[#0B1F3A] shrink-0 focus-visible:ring-2 focus-visible:ring-[#C6A76A]"
                    />

                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm sm:text-base font-semibold text-[#0B1F3A]">
                          {addr.fullName}
                        </span>
                        <span className="px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] font-semibold bg-[#0B1F3A]/5 text-[#0B1F3A] border border-[#0B1F3A]/10 rounded-sm">
                          {addr.addressType}
                        </span>
                        <span className="text-sm text-[#6B6B6B] tabular-nums">
                          {addr.phoneNumber}
                        </span>
                      </div>

                      <p className="text-sm text-[#20242B]/80 leading-relaxed">
                        {[addr.houseNumber, addr.streetName, addr.areaLocality]
                          .filter(Boolean)
                          .join(", ")}
                        <br />
                        {addr.city}, {addr.state} —{" "}
                        <span className="font-medium text-[#0B1F3A] tabular-nums">
                          {addr.pinCode}
                        </span>
                      </p>
                    </div>
                  </label>

                  <button
                    type="button"
                    onClick={() => openEditForm(addr)}
                    className="min-h-[36px] px-2.5 text-xs uppercase tracking-[0.18em] font-semibold text-[#C6A76A] hover:text-[#0B1F3A] transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A76A]"
                  >
                    Edit
                  </button>
                </div>

                {/* Selected expands with DELIVER HERE */}
                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-250 ease-out motion-reduce:transition-none ${
                    isSelected
                      ? "grid-rows-[1fr] opacity-100 mt-4"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden pl-7">
                    <button
                      type="button"
                      onClick={() => onConfirmAddress(addr)}
                      className="min-h-[46px] px-7 py-2.5 bg-[#0B1F3A] text-[#C6A76A] text-xs uppercase tracking-[0.26em] font-semibold border border-[#0B1F3A] hover:bg-[#C6A76A] hover:text-[#0B1F3A] hover:border-[#C6A76A] transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A76A] focus-visible:ring-offset-2"
                    >
                      DELIVER HERE
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* + Add a new address toggle */}
      {!showForm ? (
        <button
          type="button"
          onClick={openAddForm}
          className="w-full min-h-[48px] px-4 py-3 border border-dashed border-[#0B1F3A]/25 bg-[#F8F6F1]/50 hover:border-[#C6A76A] hover:bg-[#F8F6F1] text-left flex items-center gap-2.5 text-xs uppercase tracking-[0.22em] font-semibold text-[#0B1F3A] rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A76A]"
        >
          <span className="text-[#C6A76A] text-base leading-none">+</span>
          <span>Add a new address</span>
        </button>
      ) : (
        <form
          onSubmit={handleSubmitForm}
          noValidate
          className="border border-[#C6A76A]/45 bg-[#F8F6F1]/40 rounded-sm p-4 sm:p-6 space-y-4"
        >
          <div className="flex items-center justify-between gap-3 pb-2 border-b border-[#0B1F3A]/10">
            <h3 className="text-xs uppercase tracking-[0.25em] font-semibold text-[#0B1F3A]">
              {editingId ? "Edit Delivery Address" : "Add a New Address"}
            </h3>
            {addresses.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setErrors({});
                }}
                className="min-h-[36px] px-2 text-xs uppercase tracking-[0.18em] font-medium text-[#6B6B6B] hover:text-[#0B1F3A]"
              >
                Cancel
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-1">
              <label
                htmlFor="addr-fullName"
                className="block text-xs font-medium text-[#0B1F3A]"
              >
                Full Name *
              </label>
              <input
                id="addr-fullName"
                type="text"
                autoComplete="name"
                value={draft.fullName}
                onChange={(e) => handleFieldChange("fullName", e.target.value)}
                onBlur={() => handleFieldBlur("fullName")}
                aria-invalid={Boolean(errors.fullName)}
                placeholder="Recipient full name"
                className={`${inputBaseClass} ${
                  errors.fullName ? "border-destructive" : "border-[#0B1F3A]/15"
                }`}
              />
              {errors.fullName && (
                <p role="alert" className="text-xs text-destructive">
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label
                htmlFor="addr-phone"
                className="block text-xs font-medium text-[#0B1F3A]"
              >
                Phone Number (10 digits) *
              </label>
              <input
                id="addr-phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                maxLength={10}
                value={draft.phoneNumber}
                onChange={(e) =>
                  handleFieldChange("phoneNumber", e.target.value)
                }
                onBlur={() => handleFieldBlur("phoneNumber")}
                aria-invalid={Boolean(errors.phoneNumber)}
                placeholder="10-digit mobile number"
                className={`${inputBaseClass} tabular-nums ${
                  errors.phoneNumber
                    ? "border-destructive"
                    : "border-[#0B1F3A]/15"
                }`}
              />
              {errors.phoneNumber && (
                <p role="alert" className="text-xs text-destructive">
                  {errors.phoneNumber}
                </p>
              )}
            </div>

            {/* Building / Suite */}
            <div className="space-y-1">
              <label
                htmlFor="addr-house"
                className="block text-xs font-medium text-[#0B1F3A]"
              >
                Building / Suite *
              </label>
              <input
                id="addr-house"
                type="text"
                autoComplete="address-line1"
                value={draft.houseNumber}
                onChange={(e) =>
                  handleFieldChange("houseNumber", e.target.value)
                }
                onBlur={() => handleFieldBlur("houseNumber")}
                aria-invalid={Boolean(errors.houseNumber)}
                placeholder="Apt, Suite, Building No."
                className={`${inputBaseClass} ${
                  errors.houseNumber
                    ? "border-destructive"
                    : "border-[#0B1F3A]/15"
                }`}
              />
              {errors.houseNumber && (
                <p role="alert" className="text-xs text-destructive">
                  {errors.houseNumber}
                </p>
              )}
            </div>

            {/* Street */}
            <div className="space-y-1">
              <label
                htmlFor="addr-street"
                className="block text-xs font-medium text-[#0B1F3A]"
              >
                Street *
              </label>
              <input
                id="addr-street"
                type="text"
                autoComplete="address-line2"
                value={draft.streetName}
                onChange={(e) =>
                  handleFieldChange("streetName", e.target.value)
                }
                onBlur={() => handleFieldBlur("streetName")}
                aria-invalid={Boolean(errors.streetName)}
                placeholder="Street name / Landmark"
                className={`${inputBaseClass} ${
                  errors.streetName
                    ? "border-destructive"
                    : "border-[#0B1F3A]/15"
                }`}
              />
              {errors.streetName && (
                <p role="alert" className="text-xs text-destructive">
                  {errors.streetName}
                </p>
              )}
            </div>

            {/* Area / Locality (optional) */}
            <div className="space-y-1 sm:col-span-2">
              <label
                htmlFor="addr-area"
                className="block text-xs font-medium text-[#0B1F3A]"
              >
                Area / Locality{" "}
                <span className="text-[#6B6B6B] font-normal">(Optional)</span>
              </label>
              <input
                id="addr-area"
                type="text"
                value={draft.areaLocality}
                onChange={(e) =>
                  handleFieldChange("areaLocality", e.target.value)
                }
                placeholder="Neighborhood or district"
                className={`${inputBaseClass} border-[#0B1F3A]/15`}
              />
            </div>

            {/* City */}
            <div className="space-y-1">
              <label
                htmlFor="addr-city"
                className="block text-xs font-medium text-[#0B1F3A]"
              >
                City *
              </label>
              <input
                id="addr-city"
                type="text"
                autoComplete="address-level2"
                value={draft.city}
                onChange={(e) => handleFieldChange("city", e.target.value)}
                onBlur={() => handleFieldBlur("city")}
                aria-invalid={Boolean(errors.city)}
                placeholder="City"
                className={`${inputBaseClass} ${
                  errors.city ? "border-destructive" : "border-[#0B1F3A]/15"
                }`}
              />
              {errors.city && (
                <p role="alert" className="text-xs text-destructive">
                  {errors.city}
                </p>
              )}
            </div>

            {/* State */}
            <div className="space-y-1">
              <label
                htmlFor="addr-state"
                className="block text-xs font-medium text-[#0B1F3A]"
              >
                State *
              </label>
              <input
                id="addr-state"
                type="text"
                autoComplete="address-level1"
                value={draft.state}
                onChange={(e) => handleFieldChange("state", e.target.value)}
                onBlur={() => handleFieldBlur("state")}
                aria-invalid={Boolean(errors.state)}
                placeholder="State / Prefecture"
                className={`${inputBaseClass} ${
                  errors.state ? "border-destructive" : "border-[#0B1F3A]/15"
                }`}
              />
              {errors.state && (
                <p role="alert" className="text-xs text-destructive">
                  {errors.state}
                </p>
              )}
            </div>

            {/* PIN Code */}
            <div className="space-y-1">
              <label
                htmlFor="addr-pin"
                className="block text-xs font-medium text-[#0B1F3A]"
              >
                PIN Code (6 digits) *
              </label>
              <input
                id="addr-pin"
                type="text"
                inputMode="numeric"
                autoComplete="postal-code"
                maxLength={6}
                value={draft.pinCode}
                onChange={(e) => handleFieldChange("pinCode", e.target.value)}
                onBlur={() => handleFieldBlur("pinCode")}
                aria-invalid={Boolean(errors.pinCode)}
                placeholder="6-digit PIN code"
                className={`${inputBaseClass} tabular-nums ${
                  errors.pinCode ? "border-destructive" : "border-[#0B1F3A]/15"
                }`}
              />
              {errors.pinCode && (
                <p role="alert" className="text-xs text-destructive">
                  {errors.pinCode}
                </p>
              )}
            </div>

            {/* Address Type Chips */}
            <div className="space-y-1.5">
              <span className="block text-xs font-medium text-[#0B1F3A]">
                Address Type
              </span>
              <div className="flex items-center gap-2.5">
                {(["Home", "Work"] as AddressTag[]).map((tag) => {
                  const active = draft.addressType === tag;
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() =>
                        setDraft((prev) => ({ ...prev, addressType: tag }))
                      }
                      aria-pressed={active}
                      className={`min-h-[44px] px-5 text-xs uppercase tracking-[0.2em] font-semibold border rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A76A] ${
                        active
                          ? "bg-[#0B1F3A] text-[#C6A76A] border-[#0B1F3A]"
                          : "bg-white text-[#20242B] border-[#0B1F3A]/15 hover:border-[#C6A76A]"
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="min-h-[48px] px-8 py-3 bg-[#0B1F3A] text-[#C6A76A] text-xs uppercase tracking-[0.26em] font-semibold border border-[#0B1F3A] hover:bg-[#C6A76A] hover:text-[#0B1F3A] hover:border-[#C6A76A] transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A76A] focus-visible:ring-offset-2"
            >
              SAVE AND DELIVER HERE
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
