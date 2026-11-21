"use client";

import { useState } from "react";
import type { DeliveryAddress } from "@/types";
import { getEstimatedDeliveryDate } from "@/components/commerce/formatters";

const PIN_STORAGE_KEY = "maincharacter-delivery-pin";

interface DeliveryStripProps {
  savedAddress: DeliveryAddress | null;
}

export function DeliveryStrip({ savedAddress }: DeliveryStripProps) {
  const [storedPin, setStoredPin] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    return window.localStorage.getItem(PIN_STORAGE_KEY) ?? "";
  });
  const [isEditing, setIsEditing] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState<string | null>(null);

  const activePin = storedPin || savedAddress?.pinCode || "";
  const hasSavedDestination = Boolean(savedAddress?.pinCode || storedPin);
  const estimatedDate = getEstimatedDeliveryDate(4);

  const handleOpenEdit = () => {
    setPinInput(activePin);
    setPinError(null);
    setIsEditing(true);
  };

  const handleCheckPin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = pinInput.replace(/\D/g, "");
    if (cleaned.length !== 6) {
      setPinError("Please enter a valid 6-digit PIN code.");
      return;
    }
    setStoredPin(cleaned);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(PIN_STORAGE_KEY, cleaned);
    }
    setPinError(null);
    setIsEditing(false);
  };

  return (
    <section
      aria-label="Delivery estimate"
      className="bg-white border border-[#0B1F3A]/10 rounded-sm px-5 py-4 shadow-[0_2px_12px_rgba(11,31,58,0.03)]"
    >
      {hasSavedDestination && !isEditing ? (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 text-sm text-[#20242B]">
              <svg
                className="h-4 w-4 text-[#C6A76A] shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.6}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21s-6.5-5.2-6.5-10.5a6.5 6.5 0 1 1 13 0C18.5 15.8 12 21 12 21Z"
                />
                <circle cx="12" cy="10.5" r="2.2" />
              </svg>
              <span className="truncate">
                Deliver to:{" "}
                <strong className="font-semibold text-[#0B1F3A]">
                  {savedAddress?.fullName
                    ? `${savedAddress.fullName}, ${activePin}`
                    : `PIN ${activePin}`}
                </strong>
              </span>
            </div>

            <p className="text-xs text-[#6B6B6B] pl-6">
              Delivery by{" "}
              <span className="font-semibold text-[#0B1F3A]">
                {estimatedDate}
              </span>{" "}
              · Insured express courier
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenEdit}
            className="self-start sm:self-center min-h-[40px] px-4 py-2 text-xs uppercase tracking-[0.2em] font-semibold text-[#0B1F3A] border border-[#0B1F3A]/20 rounded-sm hover:border-[#C6A76A] hover:text-[#C6A76A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A76A]"
          >
            Change
          </button>
        </div>
      ) : (
        <form onSubmit={handleCheckPin} className="space-y-2.5" noValidate>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-[#20242B]">
              <svg
                className="h-4 w-4 text-[#C6A76A] shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.6}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21s-6.5-5.2-6.5-10.5a6.5 6.5 0 1 1 13 0C18.5 15.8 12 21 12 21Z"
                />
                <circle cx="12" cy="10.5" r="2.2" />
              </svg>
              <label
                htmlFor="delivery-pin-input"
                className="font-medium text-[#0B1F3A]"
              >
                Check delivery availability
              </label>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                id="delivery-pin-input"
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value.replace(/\D/g, "").slice(0, 6));
                  if (pinError) setPinError(null);
                }}
                placeholder="Enter 6-digit PIN"
                autoComplete="postal-code"
                className="flex-1 sm:w-44 min-h-[44px] px-3 py-2 text-base bg-[#F8F6F1]/70 border border-[#0B1F3A]/15 rounded-sm text-[#20242B] placeholder:text-[#6B6B6B]/70 focus:outline-none focus:border-[#C6A76A] focus:ring-2 focus:ring-[#C6A76A]/40 tabular-nums"
              />
              <button
                type="submit"
                className="min-h-[44px] px-5 bg-[#0B1F3A] text-[#C6A76A] text-xs uppercase tracking-[0.2em] font-semibold rounded-sm hover:bg-[#C6A76A] hover:text-[#0B1F3A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A76A]"
              >
                Check
              </button>
              {isEditing && hasSavedDestination && (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setPinError(null);
                  }}
                  className="min-h-[44px] px-3 text-xs uppercase tracking-[0.16em] font-medium text-[#6B6B6B] hover:text-[#0B1F3A]"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          {pinError ? (
            <p role="alert" className="text-xs text-destructive pl-6">
              {pinError}
            </p>
          ) : (
            <p className="text-xs text-[#6B6B6B] pl-6">
              Estimated delivery by{" "}
              <span className="font-semibold text-[#0B1F3A]">
                {estimatedDate}
              </span>
            </p>
          )}
        </form>
      )}
    </section>
  );
}
