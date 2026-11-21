"use client";

import { useState, useMemo, useCallback } from "react";
import { useWishlistStore } from "@/store/wishlist";
import { useCartStore } from "@/store/cart";
import { useIsMounted } from "@/lib/useIsMounted";
import { PRODUCTS_CATALOG, type Product } from "@/data/products";
import {
  findCatalogProduct,
  isProductOutOfStock,
} from "@/components/commerce/formatters";
import { EmptyState } from "@/components/commerce/EmptyState";
import { Toast, type ToastData } from "@/components/commerce/Toast";
import { WishlistPageSkeleton } from "@/components/commerce/Skeletons";
import { WishlistCard } from "@/components/wishlist/WishlistCard";

type WishlistSort = "recent" | "price-asc" | "price-desc";

export default function WishlistPage() {
  const isMounted = useIsMounted();
  const itemIds = useWishlistStore((s) => s.itemIds);
  const addWishlistItem = useWishlistStore((s) => s.addItem);
  const removeWishlistItem = useWishlistStore((s) => s.removeItem);

  const cartItems = useCartStore((s) => s.items);
  const addItemToCart = useCartStore((s) => s.addItem);

  const [sortBy, setSortBy] = useState<WishlistSort>("recent");
  const [toast, setToast] = useState<ToastData | null>(null);

  const showToast = useCallback((next: Omit<ToastData, "id">) => {
    setToast({ ...next, id: Date.now() });
  }, []);

  const cartProductIdSet = useMemo(() => {
    const ids = new Set<string>();
    for (const item of cartItems) {
      ids.add(item.id);
      const catalogProduct = findCatalogProduct(item);
      if (catalogProduct) {
        ids.add(catalogProduct.id);
      }
    }
    return ids;
  }, [cartItems]);

  const resolvedItems = useMemo(() => {
    const list = itemIds.map((id, index) => {
      const product = PRODUCTS_CATALOG.find((p) => p.id === id);
      return {
        id,
        product,
        price: product?.price ?? 180,
        orderIndex: index,
      };
    });

    if (sortBy === "price-asc") {
      return [...list].sort((a, b) => a.price - b.price);
    }
    if (sortBy === "price-desc") {
      return [...list].sort((a, b) => b.price - a.price);
    }
    // Recently added (newest last in store -> reverse so newest shows first)
    return [...list].reverse();
  }, [itemIds, sortBy]);

  const availableToMoveCount = useMemo(
    () =>
      resolvedItems.filter(
        ({ id, product }) =>
          !isProductOutOfStock(product?.availability) &&
          !cartProductIdSet.has(id)
      ).length,
    [resolvedItems, cartProductIdSet]
  );

  const handleMoveToBag = useCallback(
    (id: string, product: Product | undefined, size: string) => {
      const title = product?.name ?? `Archival Piece #${id}`;
      const price = product?.price ?? 180;
      const color = product?.colors[0]?.name ?? "Obsidian Navy";
      const image = product?.primaryImage ?? "/placeholder";

      addItemToCart({
        id: product ? `${product.id}-${size}-${color}` : `wish-${id}`,
        name: title,
        price,
        quantity: 1,
        size,
        color,
        image,
      });

      showToast({
        message: "Moved to bag",
        actionLabel: "View Bag",
        actionHref: "/carts",
        durationMs: 4000,
      });
    },
    [addItemToCart, showToast]
  );

  const handleMoveAllToBag = useCallback(() => {
    let movedCount = 0;
    for (const { id, product } of resolvedItems) {
      if (
        isProductOutOfStock(product?.availability) ||
        cartProductIdSet.has(id)
      ) {
        continue;
      }
      const size = product?.sizes[0] ?? "M";
      const color = product?.colors[0]?.name ?? "Obsidian Navy";
      addItemToCart({
        id: product ? `${product.id}-${size}-${color}` : `wish-${id}`,
        name: product?.name ?? `Archival Piece #${id}`,
        price: product?.price ?? 180,
        quantity: 1,
        size,
        color,
        image: product?.primaryImage ?? "/placeholder",
      });
      movedCount += 1;
    }

    if (movedCount > 0) {
      showToast({
        message: `Moved ${movedCount} ${movedCount === 1 ? "piece" : "pieces"} to bag`,
        actionLabel: "View Bag",
        actionHref: "/carts",
        durationMs: 4000,
      });
    }
  }, [resolvedItems, cartProductIdSet, addItemToCart, showToast]);

  const handleRemove = useCallback(
    (id: string, title: string) => {
      removeWishlistItem(id);
      showToast({
        message: `Removed "${title}" from wishlist`,
        actionLabel: "UNDO",
        durationMs: 5000,
        onAction: () => {
          addWishlistItem(id);
        },
      });
    },
    [addWishlistItem, removeWishlistItem, showToast]
  );

  if (!isMounted) {
    return <WishlistPageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#F8F6F1] text-[#20242B] pb-20">
      {/* Page Header */}
      <header className="border-b border-[#0B1F3A]/10 bg-white/70 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <span className="text-[10px] uppercase tracking-[0.35em] font-semibold text-[#C6A76A] block mb-1.5">
            SAVED PIECES
          </span>
          <h1
            className="text-3xl sm:text-4xl text-[#0B1F3A] leading-tight"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 600,
              fontStyle: "italic",
            }}
          >
            My Wishlist{" "}
            <span className="not-italic font-normal text-[#6B6B6B] text-2xl sm:text-3xl tabular-nums">
              ({itemIds.length})
            </span>
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-8">
        {itemIds.length === 0 ? (
          <div className="py-6">
            <EmptyState
              variant="wishlist"
              title="Your wishlist is empty"
              description="Save pieces you love while exploring our collections to revisit or move them to your bag anytime."
              primaryCtaLabel="Explore Collections"
              primaryCtaHref="/collections"
            />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Toolbar */}
            <div className="bg-white border border-[#0B1F3A]/10 rounded-sm px-4 sm:px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-[#6B6B6B] tabular-nums">
                Showing{" "}
                <strong className="font-semibold text-[#0B1F3A]">
                  {itemIds.length}
                </strong>{" "}
                saved {itemIds.length === 1 ? "piece" : "pieces"}
              </p>

              <div className="flex flex-wrap items-center gap-3 sm:gap-5">
                {availableToMoveCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMoveAllToBag}
                    className="min-h-[40px] px-1 text-xs uppercase tracking-[0.2em] font-semibold text-[#C6A76A] hover:text-[#0B1F3A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A76A]"
                  >
                    Move all available to bag
                  </button>
                )}

                <div className="flex items-center gap-2">
                  <label
                    htmlFor="wishlist-sort"
                    className="text-xs uppercase tracking-[0.18em] font-medium text-[#6B6B6B]"
                  >
                    Sort
                  </label>
                  <select
                    id="wishlist-sort"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as WishlistSort)}
                    className="min-h-[40px] px-3 py-1.5 text-base sm:text-sm bg-[#F8F6F1] border border-[#0B1F3A]/15 rounded-sm text-[#0B1F3A] font-medium focus:outline-none focus:border-[#C6A76A] focus:ring-2 focus:ring-[#C6A76A]/40"
                  >
                    <option value="recent">Recently added</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Responsive Product Grid */}
            <section
              aria-label="Saved wishlist pieces"
              className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
            >
              {resolvedItems.map(({ id, product }) => (
                <WishlistCard
                  key={id}
                  id={id}
                  product={product}
                  isInBag={cartProductIdSet.has(id)}
                  onMoveToBag={handleMoveToBag}
                  onRemove={handleRemove}
                />
              ))}
            </section>
          </div>
        )}
      </div>

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
