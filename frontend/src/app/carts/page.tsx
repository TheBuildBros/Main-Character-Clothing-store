"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { useAuthStore } from "@/store/auth";
import { useIsMounted } from "@/lib/useIsMounted";
import type { CartItem } from "@/types";
import type { Product } from "@/data/products";
import {
  calculatePricing,
  findCatalogProduct,
  formatPriceParts,
  isProductOutOfStock,
} from "@/components/commerce/formatters";
import { StepIndicator } from "@/components/commerce/StepIndicator";
import { PriceDetails } from "@/components/commerce/PriceDetails";
import { EmptyState } from "@/components/commerce/EmptyState";
import { Toast, type ToastData } from "@/components/commerce/Toast";
import { BagPageSkeleton } from "@/components/commerce/Skeletons";
import { DeliveryStrip } from "@/components/cart/DeliveryStrip";
import { CartItemCard } from "@/components/cart/CartItemCard";
import { WishlistTeaser } from "@/components/cart/WishlistTeaser";

export default function CartPage() {
  const isMounted = useIsMounted();
  const items = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const removeItem = useCartStore((s) => s.removeItem);

  const wishlistIds = useWishlistStore((s) => s.itemIds);
  const addToWishlist = useWishlistStore((s) => s.addItem);
  const removeFromWishlist = useWishlistStore((s) => s.removeItem);

  const savedAddress = useAuthStore((s) => s.savedAddress);

  const [toast, setToast] = useState<ToastData | null>(null);

  const pricing = useMemo(() => calculatePricing(items), [items]);

  const hasOutOfStockItem = useMemo(
    () =>
      items.some((item) =>
        isProductOutOfStock(findCatalogProduct(item)?.availability)
      ),
    [items]
  );

  const showToast = useCallback((next: Omit<ToastData, "id">) => {
    setToast({ ...next, id: Date.now() });
  }, []);

  const handleQuantityChange = useCallback(
    (item: CartItem, nextQty: number) => {
      const delta = nextQty - item.quantity;
      if (delta === 0) return;
      if (nextQty <= 0) {
        removeItem(item.id);
        return;
      }
      addItem({ ...item, quantity: delta });
    },
    [addItem, removeItem]
  );

  const handleSizeChange = useCallback(
    (item: CartItem, nextSize: string) => {
      if (nextSize === item.size) return;
      const catalogProduct = findCatalogProduct(item);
      const nextId = catalogProduct
        ? `${catalogProduct.id}-${nextSize}-${item.color}`
        : `${item.id}-${nextSize}`;

      removeItem(item.id);
      addItem({
        ...item,
        id: nextId,
        size: nextSize,
      });
      showToast({
        message: `Updated size to ${nextSize}`,
        durationMs: 3000,
      });
    },
    [addItem, removeItem, showToast]
  );

  const handleRemoveItem = useCallback(
    (item: CartItem) => {
      removeItem(item.id);
      showToast({
        message: `Removed "${item.name}" from bag`,
        actionLabel: "UNDO",
        durationMs: 5000,
        onAction: () => {
          addItem(item);
        },
      });
    },
    [addItem, removeItem, showToast]
  );

  const handleSaveForLater = useCallback(
    (item: CartItem, catalogProductId: string) => {
      addToWishlist(catalogProductId);
      removeItem(item.id);
      showToast({
        message: `Saved "${item.name}" to your wishlist`,
        actionLabel: "UNDO",
        durationMs: 5000,
        onAction: () => {
          removeFromWishlist(catalogProductId);
          addItem(item);
        },
      });
    },
    [addItem, addToWishlist, removeFromWishlist, removeItem, showToast]
  );

  const handleMoveWishlistToBag = useCallback(
    (product: Product) => {
      const chosenSize = product.sizes[0] ?? "M";
      const chosenColor = product.colors[0]?.name ?? "Obsidian Navy";
      addItem({
        id: `${product.id}-${chosenSize}-${chosenColor}`,
        name: product.name,
        price: product.price,
        quantity: 1,
        size: chosenSize,
        color: chosenColor,
        image: product.primaryImage,
      });
      removeFromWishlist(product.id);
      showToast({
        message: `Moved "${product.name}" to your bag`,
        durationMs: 3500,
      });
    },
    [addItem, removeFromWishlist, showToast]
  );

  if (!isMounted) {
    return <BagPageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#F8F6F1] text-[#20242B] pb-28 lg:pb-16">
      {/* Page Header */}
      <header className="border-b border-[#0B1F3A]/10 bg-white/70 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div>
            <span className="text-[10px] uppercase tracking-[0.35em] font-semibold text-[#C6A76A] block mb-1.5">
              YOUR BAG
            </span>
            <h1
              className="text-3xl sm:text-4xl text-[#0B1F3A] leading-tight"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 600,
                fontStyle: "italic",
              }}
            >
              Shopping Bag{" "}
              <span className="not-italic font-normal text-[#6B6B6B] text-2xl sm:text-3xl tabular-nums">
                ({pricing.totalItemCount}{" "}
                {pricing.totalItemCount === 1 ? "item" : "items"})
              </span>
            </h1>
          </div>

          <div className="shrink-0">
            <StepIndicator currentStep="bag" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-8">
        {items.length === 0 ? (
          <div className="space-y-12 py-4">
            <EmptyState
              variant="bag"
              title="Your bag is empty"
              description="Explore our curated tailoring and archival pieces to add your next protagonist silhouette."
              primaryCtaLabel="Continue Shopping"
              primaryCtaHref="/collections"
              secondaryCtaLabel="View Wishlist"
              secondaryCtaHref="/wishlist"
            />
            <WishlistTeaser
              wishlistIds={wishlistIds}
              onMoveToBag={handleMoveWishlistToBag}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Left Column (approx 67%) */}
            <div className="lg:col-span-8 space-y-4">
              <DeliveryStrip savedAddress={savedAddress} />

              {hasOutOfStockItem && (
                <div
                  role="alert"
                  className="bg-white border border-destructive/35 rounded-sm px-4 py-3 text-sm text-destructive"
                >
                  One or more items in your bag are out of stock. Remove them or
                  save them for later before placing your order.
                </div>
              )}

              <section aria-label="Shopping bag items" className="space-y-4">
                {items.map((item) => (
                  <CartItemCard
                    key={item.id}
                    item={item}
                    onQuantityChange={handleQuantityChange}
                    onSizeChange={handleSizeChange}
                    onSaveForLater={handleSaveForLater}
                    onRemove={handleRemoveItem}
                  />
                ))}
              </section>

              <WishlistTeaser
                wishlistIds={wishlistIds}
                onMoveToBag={handleMoveWishlistToBag}
              />
            </div>

            {/* Right Column: Sticky Price Details (approx 33%) */}
            <div className="lg:col-span-4 lg:sticky lg:top-24">
              <PriceDetails
                pricing={pricing}
                ctaLabel="PLACE ORDER"
                ctaHref="/checkout"
                ctaDisabled={hasOutOfStockItem}
                ctaDisabledReason={
                  hasOutOfStockItem
                    ? "Resolve out-of-stock items to proceed."
                    : undefined
                }
                showContinueShopping
                showCouponInput
              />
            </div>
          </div>
        )}
      </div>

      {/* Mobile Fixed Bottom Action Bar */}
      {items.length > 0 && (
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

            {hasOutOfStockItem ? (
              <button
                type="button"
                disabled
                className="min-h-[46px] px-7 bg-[#0B1F3A] text-[#C6A76A] text-xs uppercase tracking-[0.24em] font-semibold opacity-45 cursor-not-allowed rounded-sm"
              >
                PLACE ORDER
              </button>
            ) : (
              <Link
                href="/checkout"
                className="inline-flex min-h-[46px] items-center justify-center px-7 bg-[#0B1F3A] text-[#C6A76A] text-xs uppercase tracking-[0.24em] font-semibold hover:bg-[#C6A76A] hover:text-[#0B1F3A] transition-colors rounded-sm"
              >
                PLACE ORDER
              </Link>
            )}
          </div>
        </div>
      )}

      <Toast
        toast={toast}
        onDismiss={() => setToast(null)}
        hasMobileBottomBar={items.length > 0}
      />
    </div>
  );
}
