"use client";

import { useState } from "react";
import {
  formatCardNumber,
  formatExpiry,
  validateCardField,
  validateUpiId,
  type CardFormErrors,
  type CardFormState,
  type PaymentMethodId,
} from "@/components/checkout/types";

interface PaymentStepProps {
  selectedMethod: PaymentMethodId;
  onSelectMethod: (method: PaymentMethodId) => void;
  cardDetails: CardFormState;
  onCardDetailsChange: (next: CardFormState) => void;
  upiId: string;
  onUpiIdChange: (next: string) => void;
  canPlaceOrder: boolean;
  onPlaceOrder: () => void;
}

const PAYMENT_OPTIONS: {
  id: PaymentMethodId;
  title: string;
  subtitle: string;
}[] = [
  {
    id: "card",
    title: "Credit / Debit Card",
    subtitle: "Visa, Mastercard, American Express",
  },
  {
    id: "upi",
    title: "Net Banking / UPI",
    subtitle: "Instant verification via UPI ID",
  },
  {
    id: "cod",
    title: "Cash on Delivery",
    subtitle: "Pay upon insured courier delivery · No extra fee",
  },
];

export function PaymentStep({
  selectedMethod,
  onSelectMethod,
  cardDetails,
  onCardDetailsChange,
  upiId,
  onUpiIdChange,
  canPlaceOrder,
  onPlaceOrder,
}: PaymentStepProps) {
  const [cardErrors, setCardErrors] = useState<CardFormErrors>({});
  const [upiError, setUpiError] = useState<string | undefined>(undefined);

  const handleCardFieldChange = (field: keyof CardFormState, raw: string) => {
    let formatted = raw;
    if (field === "cardNumber") formatted = formatCardNumber(raw);
    if (field === "expiry") formatted = formatExpiry(raw);
    if (field === "cvv") formatted = raw.replace(/\D/g, "").slice(0, 4);

    onCardDetailsChange({ ...cardDetails, [field]: formatted });
    if (cardErrors[field]) {
      setCardErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleCardBlur = (field: keyof CardFormState) => {
    setCardErrors((prev) => ({
      ...prev,
      [field]: validateCardField(field, cardDetails[field]),
    }));
  };

  const inputBaseClass =
    "w-full min-h-[46px] px-3.5 py-2.5 text-base bg-white border rounded-sm text-[#20242B] placeholder:text-[#6B6B6B]/70 focus:outline-none focus:border-[#C6A76A] focus:ring-2 focus:ring-[#C6A76A]/45 transition-colors";

  return (
    <div className="space-y-5">
      {/* NOTE: Payment details below are UI-only preview inputs — not wired to a live payment gateway. */}
      <div role="radiogroup" aria-label="Payment method" className="space-y-3">
        {PAYMENT_OPTIONS.map((option) => {
          const isSelected = selectedMethod === option.id;
          return (
            <div
              key={option.id}
              className={`border rounded-sm transition-colors duration-250 motion-reduce:transition-none ${
                isSelected
                  ? "border-[#C6A76A] bg-[#F8F6F1]/70"
                  : "border-[#0B1F3A]/12 bg-white hover:border-[#0B1F3A]/30"
              }`}
            >
              <label className="flex items-start gap-3 p-4 cursor-pointer">
                <input
                  type="radio"
                  name="checkout-payment-method"
                  value={option.id}
                  checked={isSelected}
                  onChange={() => onSelectMethod(option.id)}
                  className="mt-1 h-4 w-4 accent-[#0B1F3A] shrink-0 focus-visible:ring-2 focus-visible:ring-[#C6A76A]"
                />
                <div className="flex-1 min-w-0">
                  <span className="block text-sm font-semibold text-[#0B1F3A]">
                    {option.title}
                  </span>
                  <span className="block text-xs text-[#6B6B6B] mt-0.5">
                    {option.subtitle}
                  </span>
                </div>
              </label>

              {/* Smooth height expansion for selected method details */}
              <div
                className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none ${
                  isSelected
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0 pointer-events-none"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-4 pb-5 pt-1 pl-11 space-y-4">
                    {option.id === "card" && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div className="sm:col-span-2 space-y-1">
                          <label
                            htmlFor="pay-card-number"
                            className="block text-xs font-medium text-[#0B1F3A]"
                          >
                            Card Number *
                          </label>
                          <input
                            id="pay-card-number"
                            type="text"
                            inputMode="numeric"
                            autoComplete="cc-number"
                            maxLength={19}
                            value={cardDetails.cardNumber}
                            onChange={(e) =>
                              handleCardFieldChange(
                                "cardNumber",
                                e.target.value
                              )
                            }
                            onBlur={() => handleCardBlur("cardNumber")}
                            aria-invalid={Boolean(cardErrors.cardNumber)}
                            placeholder="1234 5678 9012 3456"
                            className={`${inputBaseClass} tabular-nums ${
                              cardErrors.cardNumber
                                ? "border-destructive"
                                : "border-[#0B1F3A]/15"
                            }`}
                          />
                          {cardErrors.cardNumber && (
                            <p role="alert" className="text-xs text-destructive">
                              {cardErrors.cardNumber}
                            </p>
                          )}
                        </div>

                        <div className="space-y-1">
                          <label
                            htmlFor="pay-card-expiry"
                            className="block text-xs font-medium text-[#0B1F3A]"
                          >
                            Expiry (MM/YY) *
                          </label>
                          <input
                            id="pay-card-expiry"
                            type="text"
                            inputMode="numeric"
                            autoComplete="cc-exp"
                            maxLength={5}
                            value={cardDetails.expiry}
                            onChange={(e) =>
                              handleCardFieldChange("expiry", e.target.value)
                            }
                            onBlur={() => handleCardBlur("expiry")}
                            aria-invalid={Boolean(cardErrors.expiry)}
                            placeholder="MM/YY"
                            className={`${inputBaseClass} tabular-nums ${
                              cardErrors.expiry
                                ? "border-destructive"
                                : "border-[#0B1F3A]/15"
                            }`}
                          />
                          {cardErrors.expiry && (
                            <p role="alert" className="text-xs text-destructive">
                              {cardErrors.expiry}
                            </p>
                          )}
                        </div>

                        <div className="space-y-1">
                          <label
                            htmlFor="pay-card-cvv"
                            className="block text-xs font-medium text-[#0B1F3A]"
                          >
                            CVV *
                          </label>
                          <input
                            id="pay-card-cvv"
                            type="password"
                            inputMode="numeric"
                            autoComplete="cc-csc"
                            maxLength={4}
                            value={cardDetails.cvv}
                            onChange={(e) =>
                              handleCardFieldChange("cvv", e.target.value)
                            }
                            onBlur={() => handleCardBlur("cvv")}
                            aria-invalid={Boolean(cardErrors.cvv)}
                            placeholder="•••"
                            className={`${inputBaseClass} tabular-nums ${
                              cardErrors.cvv
                                ? "border-destructive"
                                : "border-[#0B1F3A]/15"
                            }`}
                          />
                          {cardErrors.cvv && (
                            <p role="alert" className="text-xs text-destructive">
                              {cardErrors.cvv}
                            </p>
                          )}
                        </div>

                        <div className="sm:col-span-2 space-y-1">
                          <label
                            htmlFor="pay-card-name"
                            className="block text-xs font-medium text-[#0B1F3A]"
                          >
                            Name on Card *
                          </label>
                          <input
                            id="pay-card-name"
                            type="text"
                            autoComplete="cc-name"
                            value={cardDetails.nameOnCard}
                            onChange={(e) =>
                              handleCardFieldChange(
                                "nameOnCard",
                                e.target.value
                              )
                            }
                            onBlur={() => handleCardBlur("nameOnCard")}
                            aria-invalid={Boolean(cardErrors.nameOnCard)}
                            placeholder="As printed on card"
                            className={`${inputBaseClass} ${
                              cardErrors.nameOnCard
                                ? "border-destructive"
                                : "border-[#0B1F3A]/15"
                            }`}
                          />
                          {cardErrors.nameOnCard && (
                            <p role="alert" className="text-xs text-destructive">
                              {cardErrors.nameOnCard}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {option.id === "upi" && (
                      <div className="space-y-1 max-w-md">
                        <label
                          htmlFor="pay-upi-id"
                          className="block text-xs font-medium text-[#0B1F3A]"
                        >
                          UPI ID *
                        </label>
                        <input
                          id="pay-upi-id"
                          type="text"
                          value={upiId}
                          onChange={(e) => {
                            onUpiIdChange(e.target.value);
                            if (upiError) setUpiError(undefined);
                          }}
                          onBlur={() => setUpiError(validateUpiId(upiId))}
                          aria-invalid={Boolean(upiError)}
                          placeholder="yourname@bank"
                          className={`${inputBaseClass} ${
                            upiError
                              ? "border-destructive"
                              : "border-[#0B1F3A]/15"
                          }`}
                        />
                        {upiError ? (
                          <p role="alert" className="text-xs text-destructive">
                            {upiError}
                          </p>
                        ) : (
                          <p className="text-xs text-[#6B6B6B]">
                            Format: handle@bank (e.g., protagonist@okaxis)
                          </p>
                        )}
                      </div>
                    )}

                    {option.id === "cod" && (
                      <div className="p-3.5 bg-white border border-[#0B1F3A]/10 rounded-sm text-sm text-[#20242B]/80 leading-relaxed">
                        Pay in cash or via courier terminal when your order
                        arrives. No additional Cash on Delivery fee applies.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Demo mode notice */}
      <div className="p-3.5 border border-[#C6A76A]/35 bg-[#F8F6F1] rounded-sm flex items-start gap-2.5">
        <svg
          className="h-4 w-4 text-[#C6A76A] shrink-0 mt-0.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.6}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3l7 3v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V6l7-3Z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4"
          />
        </svg>
        <p className="text-xs text-[#6B6B6B] leading-relaxed">
          Preview checkout environment. Payment details are validated locally
          and no live charge will be made.
        </p>
      </div>

      {/* Step-level Place Order button */}
      <div className="pt-1">
        <button
          type="button"
          disabled={!canPlaceOrder}
          onClick={onPlaceOrder}
          className="w-full sm:w-auto min-h-[48px] px-10 py-3.5 bg-[#0B1F3A] text-[#C6A76A] text-xs uppercase tracking-[0.28em] font-semibold border border-[#0B1F3A] hover:bg-[#C6A76A] hover:text-[#0B1F3A] hover:border-[#C6A76A] transition-colors rounded-sm disabled:opacity-45 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A76A] focus-visible:ring-offset-2"
        >
          PLACE ORDER
        </button>
      </div>
    </div>
  );
}
