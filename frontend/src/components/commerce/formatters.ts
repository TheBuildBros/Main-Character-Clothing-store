import type { CartItem } from "@/types";
import { PRODUCTS_CATALOG, type Product } from "@/data/products";

export const FREE_SHIPPING_THRESHOLD = 200;
export const FLAT_SHIPPING_RATE = 15;
export const TAX_RATE = 0.08;
export const MAX_ITEM_QUANTITY = 10;
export const LIMITED_STOCK_COUNT = 3;

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

/**
 * Formats a numeric amount using the project's INR (₹) currency convention
 * with Indian digit grouping.
 */
export function formatPrice(amount: number): string {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  return currencyFormatter.format(safeAmount);
}

/**
 * Splits a formatted INR price into prefix, currency symbol ("₹"), and numeric
 * value so serif display prices can render the ₹ glyph in the sans font.
 */
export function formatPriceParts(amount: number): {
  prefix: string;
  symbol: string;
  value: string;
} {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  const parts = currencyFormatter.formatToParts(safeAmount);
  let prefix = "";
  let symbol = "₹";
  let value = "";
  let seenCurrency = false;

  for (const part of parts) {
    if (part.type === "currency") {
      symbol = part.value;
      seenCurrency = true;
    } else if (!seenCurrency) {
      prefix += part.value;
    } else {
      value += part.value;
    }
  }

  return { prefix, symbol, value };
}

/**
 * Computes discount percentage when originalPrice exceeds current price.
 */
export function getDiscountPercent(
  price: number,
  originalPrice?: number
): number {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

/**
 * Matches a CartItem back to its catalog Product so we can display
 * brand, available sizes, originalPrice/discount, and stock status
 * without modifying the CartItem type or cart store.
 */
export function findCatalogProduct(item: CartItem): Product | undefined {
  return (
    PRODUCTS_CATALOG.find((p) => p.id === item.id) ??
    PRODUCTS_CATALOG.find(
      (p) => item.id.startsWith(`${p.id}-`) || item.id === `wish-${p.id}`
    ) ??
    PRODUCTS_CATALOG.find(
      (p) => p.name.toLowerCase() === item.name.toLowerCase()
    )
  );
}

/**
 * Returns a valid collection route for a catalog product or fallback.
 */
export function getProductHref(product?: Product): string {
  if (!product) return "/collections";
  const categorySlug = product.category.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return `/collections?category=${encodeURIComponent(categorySlug)}`;
}

/**
 * Checks whether a product availability value represents an out-of-stock state.
 */
export function isProductOutOfStock(availability?: string): boolean {
  if (!availability) return false;
  return availability.toLowerCase().includes("out of stock");
}

/**
 * Returns an optional low-stock cap/warning for limited archive pieces.
 */
export function getStockLimit(product?: Product): {
  maxQty: number;
  lowStockNote?: string;
} {
  if (!product) {
    return { maxQty: MAX_ITEM_QUANTITY };
  }
  if (isProductOutOfStock(product.availability)) {
    return { maxQty: 0, lowStockNote: "Currently out of stock" };
  }
  if (product.availability === "Limited Archive") {
    return {
      maxQty: LIMITED_STOCK_COUNT,
      lowStockNote: `Only ${LIMITED_STOCK_COUNT} left`,
    };
  }
  return { maxQty: MAX_ITEM_QUANTITY };
}

/**
 * Computes a human-readable estimated delivery date (e.g., "Tue, 25 Nov").
 * Call only on the client after mount to avoid hydration mismatches.
 */
export function getEstimatedDeliveryDate(daysFromNow = 4): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
  const day = date.getDate();
  const month = date.toLocaleDateString("en-US", { month: "short" });
  return `${weekday}, ${day} ${month}`;
}

export interface OrderPricing {
  totalItemCount: number;
  mrpTotal: number;
  subtotal: number;
  discountTotal: number;
  shipping: number;
  shippingSavings: number;
  estimatedTax: number;
  total: number;
  totalSavings: number;
  amountToFreeShipping: number;
}

/**
 * Calculates full pricing breakdown using the project's existing
 * shipping threshold (FREE_SHIPPING_THRESHOLD free, else FLAT_SHIPPING_RATE)
 * and tax rate (TAX_RATE).
 */
export function calculatePricing(items: CartItem[]): OrderPricing {
  let totalItemCount = 0;
  let mrpTotal = 0;
  let subtotal = 0;

  for (const item of items) {
    const qty = Math.max(0, item.quantity);
    const catalogProduct = findCatalogProduct(item);
    const unitMrp =
      catalogProduct?.originalPrice && catalogProduct.originalPrice > item.price
        ? catalogProduct.originalPrice
        : item.price;

    totalItemCount += qty;
    mrpTotal += unitMrp * qty;
    subtotal += item.price * qty;
  }

  const discountTotal = Math.max(0, mrpTotal - subtotal);
  const qualifiesFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shipping =
    subtotal > 0 ? (qualifiesFreeShipping ? 0 : FLAT_SHIPPING_RATE) : 0;
  const shippingSavings =
    subtotal > 0 && qualifiesFreeShipping ? FLAT_SHIPPING_RATE : 0;
  const estimatedTax = subtotal * TAX_RATE;
  const total = subtotal + shipping + estimatedTax;
  const totalSavings = discountTotal + shippingSavings;
  const amountToFreeShipping =
    subtotal > 0 && !qualifiesFreeShipping
      ? Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)
      : 0;

  return {
    totalItemCount,
    mrpTotal,
    subtotal,
    discountTotal,
    shipping,
    shippingSavings,
    estimatedTax,
    total,
    totalSavings,
    amountToFreeShipping,
  };
}
