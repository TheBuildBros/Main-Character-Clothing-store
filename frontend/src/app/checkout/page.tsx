"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/auth";
import { useCartStore } from "@/store/cart";
import { useIsMounted } from "@/lib/useIsMounted";
import type { CartItem } from "@/types";
import {
  calculatePricing,
  findCatalogProduct,
  formatPrice,
  formatPriceParts,
  isProductOutOfStock,
  type OrderPricing,
} from "@/components/commerce/formatters";
import { StepIndicator } from "@/components/commerce/StepIndicator";
import { PriceDetails } from "@/components/commerce/PriceDetails";
import { EmptyState } from "@/components/commerce/EmptyState";
import { Toast, type ToastData } from "@/components/commerce/Toast";
import { CheckoutPageSkeleton } from "@/components/commerce/Skeletons";
import { AccordionStep } from "@/components/checkout/AccordionStep";
import { AddressStep } from "@/components/checkout/AddressStep";
import { OrderSummaryStep } from "@/components/checkout/OrderSummaryStep";
import { PaymentStep } from "@/components/checkout/PaymentStep";
import { OrderSuccessView } from "@/components/checkout/OrderSuccessView";
import {
  validateCardForm,
  validateUpiId,
  type CardFormState,
  type PaymentMethodId,
  type SavedCheckoutAddress,
} from "@/components/checkout/types";

const ADDRESSES_STORAGE_KEY = "maincharacter-checkout-addresses";

interface CompletedOrderSnapshot {
  orderId: string;
  address: SavedCheckoutAddress;
  paymentMethod: PaymentMethodId;
  items: CartItem[];
  pricing: OrderPricing;
}

export default function CheckoutPage() {
  const isMounted = useIsMounted();

  const user = useAuthStore((s) => s.user);
  const savedAddress = useAuthStore((s) => s.savedAddress);
  const updateAuthAddress = useAuthStore((s) => s.updateAddress);

  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);

  // Accordion state: 1 = Delivery Address, 2 = Order Summary, 3 = Payment Options
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);
  const [addressConfirmed, setAddressConfirmed] = useState(false);
  const [summaryConfirmed, setSummaryConfirmed] = useState(false);

  // Saved addresses list (lazy-loaded from localStorage, merged with useAuthStore.savedAddress)
  const [storedAddresses, setStoredAddresses] = useState<
    SavedCheckoutAddress[]
  >(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(ADDRESSES_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as unknown;
        if (Array.isArray(parsed)) {
          return parsed as SavedCheckoutAddress[];
        }
      }
    } catch {
      return [];
    }
    return [];
  });
  const [manualSelectedAddressId, setManualSelectedAddressId] = useState<
    string | null
  >(null);

  // Payment state (UI-only — not wired to a live payment gateway)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>("card");
  const [cardDetails, setCardDetails] = useState<CardFormState>({
    cardNumber: "",
    expiry: "",
    cvv: "",
    nameOnCard: "",
  });
  const [upiId, setUpiId] = useState("");

  const [completedOrder, setCompletedOrder] =
    useState<CompletedOrderSnapshot | null>(null);
  const [toast, setToast] = useState<ToastData | null>(null);

  const addresses = useMemo(() => {
    if (savedAddress && savedAddress.fullName && savedAddress.pinCode) {
      const exists = storedAddresses.some(
        (a) =>
          a.fullName === savedAddress.fullName &&
          a.pinCode === savedAddress.pinCode &&
          a.houseNumber === savedAddress.houseNumber
      );
      if (!exists) {
        return [
          {
            ...savedAddress,
            id: "auth-saved-address",
            addressType: "Home" as const,
          },
          ...storedAddresses,
        ];
      }
    }
    return storedAddresses;
  }, [savedAddress, storedAddresses]);

  const selectedAddressId = useMemo(() => {
    if (
      manualSelectedAddressId &&
      addresses.some((a) => a.id === manualSelectedAddressId)
    ) {
      return manualSelectedAddressId;
    }
    return addresses[0]?.id ?? null;
  }, [addresses, manualSelectedAddressId]);

  const pricing = useMemo(() => calculatePricing(items), [items]);

  const hasOutOfStockItem = useMemo(
    () =>
      items.some((item) =>
        isProductOutOfStock(findCatalogProduct(item)?.availability)
      ),
    [items]
  );

  const selectedAddress = useMemo(
    () => addresses.find((a) => a.id === selectedAddressId) ?? null,
    [addresses, selectedAddressId]
  );

  const isPaymentValid = useMemo(() => {
    if (paymentMethod === "cod") return true;
    if (paymentMethod === "upi") return !validateUpiId(upiId);
    return Object.keys(validateCardForm(cardDetails)).length === 0;
  }, [paymentMethod, upiId, cardDetails]);

  const canPlaceOrder =
    items.length > 0 &&
    !hasOutOfStockItem &&
    addressConfirmed &&
    Boolean(selectedAddress) &&
    summaryConfirmed &&
    isPaymentValid;

  const persistAddresses = useCallback((next: SavedCheckoutAddress[]) => {
    setStoredAddresses(next);
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(
          ADDRESSES_STORAGE_KEY,
          JSON.stringify(next)
        );
      } catch {
        // Ignore storage quota errors
      }
    }
  }, []);

  const handleSaveAddress = useCallback(
    (address: SavedCheckoutAddress, isEdit: boolean) => {
      const next = isEdit
        ? addresses.map((a) => (a.id === address.id ? address : a))
        : [address, ...addresses];
      persistAddresses(next);
      setManualSelectedAddressId(address.id);
      updateAuthAddress({
        fullName: address.fullName,
        phoneNumber: address.phoneNumber,
        houseNumber: address.houseNumber,
        streetName: address.streetName,
        areaLocality: address.areaLocality,
        city: address.city,
        state: address.state,
        pinCode: address.pinCode,
        isDefault: true,
      });
      setToast({
        id: Date.now(),
        message: isEdit ? "Delivery address updated" : "Delivery address saved",
        durationMs: 3000,
      });
    },
    [addresses, persistAddresses, updateAuthAddress]
  );

  const handleConfirmAddress = useCallback(
    (address: SavedCheckoutAddress) => {
      setManualSelectedAddressId(address.id);
      setAddressConfirmed(true);
      updateAuthAddress({
        fullName: address.fullName,
        phoneNumber: address.phoneNumber,
        houseNumber: address.houseNumber,
        streetName: address.streetName,
        areaLocality: address.areaLocality,
        city: address.city,
        state: address.state,
        pinCode: address.pinCode,
        isDefault: true,
      });
      setActiveStep(2);
    },
    [updateAuthAddress]
  );

  const handleConfirmSummary = useCallback(() => {
    if (hasOutOfStockItem || items.length === 0) return;
    setSummaryConfirmed(true);
    setActiveStep(3);
  }, [hasOutOfStockItem, items.length]);

  const handlePlaceOrder = useCallback(() => {
    if (!canPlaceOrder || !selectedAddress) return;
    const orderId = `MC-${new Date().getFullYear()}-${Math.floor(
      100000 + Math.random() * 900000
    )}`;
    setCompletedOrder({
      orderId,
      address: selectedAddress,
      paymentMethod,
      items: [...items],
      pricing,
    });
    clearCart();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [canPlaceOrder, clearCart, items, paymentMethod, pricing, selectedAddress]);

  const disabledReason = useMemo(() => {
    if (hasOutOfStockItem) return "Resolve out-of-stock items in your bag.";
    if (!addressConfirmed) return "Select and confirm a delivery address.";
    if (!summaryConfirmed) return "Review and confirm your order summary.";
    if (!isPaymentValid) return "Complete valid payment details to continue.";
    return undefined;
  }, [addressConfirmed, hasOutOfStockItem, isPaymentValid, summaryConfirmed]);

  if (!isMounted) {
    return <CheckoutPageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#F8F6F1] text-[#20242B] pb-28 lg:pb-16">
      {/* Header */}
      <header className="border-b border-[#0B1F3A]/10 bg-white/70 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-5">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/carts"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] font-semibold text-[#C6A76A] hover:text-[#0B1F3A] transition-colors"
            >
              <svg
                className="h-3.5 w-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.75}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 12H5m6 6-6-6 6-6"
                />
              </svg>
              <span>Return to Bag</span>
            </Link>

            <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.22em] text-[#6B6B6B]">
              <svg
                className="h-3.5 w-3.5 text-[#C6A76A]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.6}
                aria-hidden="true"
              >
                <rect x="5" y="11" width="14" height="10" rx="1.5" />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" />
              </svg>
              <span>Encrypted Checkout</span>
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase tracking-[0.35em] font-semibold text-[#C6A76A] block mb-1">
                EXPRESS ORDER
              </span>
              <h1
                className="text-3xl sm:text-4xl text-[#0B1F3A] leading-tight"
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontWeight: 600,
                  fontStyle: "italic",
                }}
              >
                Order Finalization
              </h1>
            </div>

            {!completedOrder && (
              <div className="shrink-0">
                <StepIndicator
                  currentStep={activeStep === 3 ? "payment" : "delivery"}
                />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-8">
        {completedOrder ? (
          <OrderSuccessView
            orderId={completedOrder.orderId}
            address={completedOrder.address}
            paymentMethod={completedOrder.paymentMethod}
            items={completedOrder.items}
            pricing={completedOrder.pricing}
          />
        ) : items.length === 0 ? (
          <div className="py-6">
            <EmptyState
              variant="bag"
              title="Your bag is empty"
              description="Add pieces to your shopping bag before proceeding to order finalization."
              primaryCtaLabel="Explore Collections"
              primaryCtaHref="/collections"
              secondaryCtaLabel="View Wishlist"
              secondaryCtaHref="/wishlist"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Left Column: 3-step Flipkart-style Numbered Accordion */}
            <div className="lg:col-span-8 space-y-4">
              {/* Step 1: Delivery Address */}
              <AccordionStep
                stepNumber={1}
                title="DELIVERY ADDRESS"
                isOpen={activeStep === 1}
                isCompleted={addressConfirmed && Boolean(selectedAddress)}
                canOpen
                onChangeClick={() => setActiveStep(1)}
                summary={
                  selectedAddress ? (
                    <span>
                      <strong className="font-semibold text-[#0B1F3A]">
                        {selectedAddress.fullName}
                      </strong>{" "}
                      — {selectedAddress.houseNumber},{" "}
                      {selectedAddress.streetName}, {selectedAddress.city},{" "}
                      {selectedAddress.state} {selectedAddress.pinCode}
                    </span>
                  ) : null
                }
              >
                <AddressStep
                  addresses={addresses}
                  selectedAddressId={selectedAddressId}
                  onSelectAddress={setManualSelectedAddressId}
                  onSaveAddress={handleSaveAddress}
                  onConfirmAddress={handleConfirmAddress}
                  defaultFullName={user?.username}
                  defaultPhone={user?.phone}
                />
              </AccordionStep>

              {/* Step 2: Order Summary */}
              <AccordionStep
                stepNumber={2}
                title="ORDER SUMMARY"
                isOpen={activeStep === 2}
                isCompleted={summaryConfirmed}
                canOpen={addressConfirmed}
                onChangeClick={() => addressConfirmed && setActiveStep(2)}
                summary={
                  <span className="tabular-nums">
                    <strong className="font-semibold text-[#0B1F3A]">
                      {pricing.totalItemCount}{" "}
                      {pricing.totalItemCount === 1 ? "item" : "items"}
                    </strong>{" "}
                    · Subtotal {formatPrice(pricing.subtotal)}
                  </span>
                }
              >
                <OrderSummaryStep
                  items={items}
                  hasOutOfStockItem={hasOutOfStockItem}
                  onContinue={handleConfirmSummary}
                />
              </AccordionStep>

              {/* Step 3: Payment Options */}
              <AccordionStep
                stepNumber={3}
                title="PAYMENT OPTIONS"
                isOpen={activeStep === 3}
                isCompleted={false}
                canOpen={addressConfirmed && summaryConfirmed}
                onChangeClick={() =>
                  addressConfirmed && summaryConfirmed && setActiveStep(3)
                }
              >
                <PaymentStep
                  selectedMethod={paymentMethod}
                  onSelectMethod={setPaymentMethod}
                  cardDetails={cardDetails}
                  onCardDetailsChange={setCardDetails}
                  upiId={upiId}
                  onUpiIdChange={setUpiId}
                  canPlaceOrder={canPlaceOrder}
                  onPlaceOrder={handlePlaceOrder}
                />
              </AccordionStep>
            </div>

            {/* Right Column: Sticky Price Details */}
            <div className="lg:col-span-4 lg:sticky lg:top-24">
              <PriceDetails
                pricing={pricing}
                ctaLabel="PLACE ORDER"
                onCtaClick={handlePlaceOrder}
                ctaDisabled={!canPlaceOrder}
                ctaDisabledReason={disabledReason}
                showCouponInput
              />
            </div>
          </div>
        )}
      </div>

      {/* Mobile Fixed Bottom Action Bar */}
      {!completedOrder && items.length > 0 && (
        <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-[#0B1F3A]/15 shadow-[0_-4px_20px_rgba(11,31,58,0.08)] px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="mx-auto max-w-xl flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase tracking-[0.22em] font-semibold text-[#6B6B6B] block">
                Total Amount
              </span>
              <span
                aria-live="polite"
                className="text-xl font-semibold text-[#0B1F3A] tabular-nums leading-tight"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                {(() => {
                  const { prefix, symbol, value } = formatPriceParts(
                    pricing.total
                  );
                  return (
                    <>
                      {prefix}
                      <span
                        style={{
                          fontFamily:
                            "var(--font-inter, 'Inter', system-ui, sans-serif)",
                        }}
                      >
                        {symbol}
                      </span>
                      {value}
                    </>
                  );
                })()}
              </span>
            </div>

            <button
              type="button"
              disabled={!canPlaceOrder}
              onClick={handlePlaceOrder}
              className="min-h-[46px] px-7 bg-[#0B1F3A] text-[#C6A76A] text-xs uppercase tracking-[0.24em] font-semibold hover:bg-[#C6A76A] hover:text-[#0B1F3A] transition-colors rounded-sm disabled:opacity-45 disabled:cursor-not-allowed"
            >
              PLACE ORDER
            </button>
          </div>
        </div>
      )}

      <Toast
        toast={toast}
        onDismiss={() => setToast(null)}
        hasMobileBottomBar={!completedOrder && items.length > 0}
      />
    </div>
  );
}
