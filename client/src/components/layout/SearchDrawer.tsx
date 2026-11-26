import { useEffect, useRef, useState, useMemo, type RefObject } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, Search } from "lucide-react";
import { products, formatPrice, type Product } from "@/store/Storefront";

interface SearchDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef?: RefObject<HTMLButtonElement | null>;
}

function getScopedProducts(pathname: string, allProducts: Product[]): Product[] {
  // 1. /shop/:category
  const shopMatch = pathname.match(/^\/shop\/([^/?#]+)/);
  if (shopMatch) {
    const slug = shopMatch[1].toLowerCase();
    switch (slug) {
      case "jeans":
        return allProducts.filter(
          (p) => p.category.toLowerCase() === "bottoms" && /denim|jean/i.test(p.name)
        );
      case "other-bottoms":
        return allProducts.filter(
          (p) => p.category.toLowerCase() === "bottoms" && !/denim|jean/i.test(p.name)
        );
      case "bottoms":
        return allProducts.filter((p) => p.category.toLowerCase() === "bottoms");
      case "shirts":
        return allProducts.filter((p) => p.category.toLowerCase() === "shirts");
      case "t-shirts":
      case "tshirts":
      case "tees":
        return allProducts.filter((p) => p.category.toLowerCase() === "t-shirts");
      case "jerseys":
        return allProducts.filter(
          (p) => /jersey/i.test(p.name) || /jersey/i.test(p.category)
        );
      case "jackets":
      case "outerwear":
        return allProducts.filter((p) => p.category.toLowerCase() === "outerwear");
      case "accessories":
        return allProducts.filter((p) => p.category.toLowerCase() === "accessories");
      case "knitwear":
        return allProducts.filter((p) => p.category.toLowerCase() === "knitwear");
      default:
        return allProducts.filter((p) => p.category.toLowerCase() === slug);
    }
  }

  // 2. /limited/:tag
  const limitedMatch = pathname.match(/^\/limited\/([^/?#]+)/);
  if (limitedMatch) {
    const tagSlug = limitedMatch[1].toLowerCase();
    switch (tagSlug) {
      case "all":
        return allProducts;
      case "new-drops":
        return allProducts.filter((p) => p.tag?.toLowerCase() === "new arrival");
      case "editions":
        return allProducts.filter((p) => p.tag?.toLowerCase() === "limited");
      case "flash-sale":
        return allProducts.filter(
          (p) =>
            p.tag?.toLowerCase() === "flash sale" ||
            Boolean(p.compareAtPrice && p.compareAtPrice > p.price)
        );
      default:
        return allProducts.filter((p) => p.tag?.toLowerCase() === tagSlug);
    }
  }

  // 3. /collections or any other page
  return allProducts;
}

export function SearchDrawer({ isOpen, onClose, triggerRef }: SearchDrawerProps) {
  const [location, navigate] = useLocation();
  const shouldReduceMotion = useReducedMotion();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on route change
  useEffect(() => {
    if (isOpen) {
      onClose();
    }
  }, [location]);

  // Lock body scroll while open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Autofocus input on open and restore focus to triggerRef on close
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 60);
      return () => clearTimeout(timer);
    } else {
      triggerRef?.current?.focus();
    }
  }, [isOpen, triggerRef]);

  // Handle Escape key and focus trap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === "Tab" && panelRef.current) {
        const focusableElements = panelRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Determine scoped products based on current URL
  const scopedProducts = useMemo(() => {
    return getScopedProducts(location, products);
  }, [location]);

  // Filter matching products live as user types (matching name and category, case-insensitive)
  const matchingProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return scopedProducts;
    return scopedProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [scopedProducts, query]);

  // "View all Products (N)" handler
  const handleViewAll = () => {
    const trimmed = query.trim();
    const target = trimmed
      ? `/collections?q=${encodeURIComponent(trimmed)}`
      : "/collections";

    onClose();
    navigate(target);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="search-drawer-overlay" className="fixed inset-0 z-50">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.05 : 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Panel pinned to right edge */}
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Search products"
            initial={shouldReduceMotion ? { opacity: 0 } : { x: "100%" }}
            animate={shouldReduceMotion ? { opacity: 1 } : { x: "0%" }}
            exit={shouldReduceMotion ? { opacity: 0 } : { x: "100%" }}
            transition={{
              duration: shouldReduceMotion ? 0.05 : 0.25,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[400px] bg-white/90 dark:bg-[#051029]/92 backdrop-blur-2xl text-foreground border-l border-[#0057ff]/18 shadow-[0_24px_60px_rgba(0,87,255,0.18)] flex flex-col z-50"
          >
            {/* Header row */}
            <div className="flex items-center justify-between p-6 border-b border-black/10 dark:border-white/10">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Search</h2>
              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-full flex items-center justify-center border border-black/10 dark:border-white/10 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1e6bff]"
                aria-label="Close search"
              >
                <X size={18} />
              </button>
            </div>

            {/* Input row */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleViewAll();
              }}
              className="p-6 pb-4 border-b border-black/5 dark:border-white/5"
            >
              <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-sm border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] focus-within:border-[#0057ff] focus-within:ring-1 focus-within:ring-[#0057ff] transition-all">
                <Search size={17} className="text-muted-foreground shrink-0" />
                <input
                  ref={inputRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search pieces..."
                  className="w-full bg-transparent border-0 outline-none text-xs sm:text-sm text-foreground placeholder:text-muted-foreground"
                  aria-label="Search pieces"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="text-muted-foreground hover:text-foreground"
                    aria-label="Clear query"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </form>

            {/* Results list */}
            <div className="flex-1 overflow-y-auto p-6 divide-y divide-black/5 dark:divide-white/5">
              {matchingProducts.length > 0 ? (
                matchingProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    onClick={onClose}
                    className="group flex items-center gap-4 py-4 first:pt-0 last:pb-0 transition-opacity hover:opacity-85"
                  >
                    {/* Thumbnail */}
                    <div className="w-20 h-24 shrink-0 overflow-hidden bg-black/5 dark:bg-white/5 rounded-sm">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <h3 className="font-bold uppercase text-xs sm:text-sm tracking-wider truncate text-foreground group-hover:text-[#1e6bff] transition-colors">
                        {product.name}
                      </h3>
                      <div className="text-xs sm:text-sm">
                        {product.compareAtPrice && product.compareAtPrice > product.price ? (
                          <div className="flex items-center gap-2">
                            <span className="text-red-600 dark:text-red-400 font-semibold">
                              {formatPrice(product.price)}
                            </span>
                            <span className="line-through text-muted-foreground text-xs">
                              {formatPrice(product.compareAtPrice)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground font-medium">
                            {formatPrice(product.price)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="py-12 text-center text-muted-foreground space-y-2">
                  <p className="text-sm font-medium">No pieces found.</p>
                  <p className="text-xs text-muted-foreground/80">
                    Try another search term or browse the full collection.
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-[#0057ff]/15 bg-white/70 dark:bg-[#051029]/70 backdrop-blur-md">
              <button
                type="button"
                onClick={handleViewAll}
                className="w-full py-3.5 px-4 rounded-full bg-gradient-to-r from-[#0047ff] via-[#0077ff] to-[#00aeff] text-white font-bold text-xs sm:text-sm uppercase tracking-wider shadow-[0_10px_24px_rgba(0,87,255,0.35)] transition-all hover:brightness-110 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0057ff]"
              >
                View all Products ({matchingProducts.length})
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default SearchDrawer;
