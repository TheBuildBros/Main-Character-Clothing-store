import { useState, useEffect, type FormEvent } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, ArrowRight, Search, Sun, Moon, Heart, ShoppingBag, UserRound, SlidersHorizontal } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { NAV_CONFIG, isNavItemActive } from "./navConfig";
import { useStore } from "@/store/Storefront";
import { FilterPanel, PRICE_MAX, buildFilterUrl } from "@/components/FilterPanel";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  brandWordmark?: string;
}

export function MobileDrawer({ isOpen, onClose, brandWordmark = "主人公" }: MobileDrawerProps) {
  const [location, navigate] = useLocation();
  const shouldReduceMotion = useReducedMotion();
  const { count, favorites, theme, toggleTheme } = useStore();
  const [searchQuery, setSearchQuery] = useState("");

  // Drawer filter states synchronized with URL
  const [drawerCategory, setDrawerCategory] = useState("");
  const [drawerSize, setDrawerSize] = useState("");
  const [drawerColor, setDrawerColor] = useState("");
  const [drawerMaxPrice, setDrawerMaxPrice] = useState(PRICE_MAX);
  const [drawerSort, setDrawerSort] = useState("featured");

  // Sync filters from URL parameters when drawer opens or location changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search);
      setDrawerCategory(p.get("category") || "");
      setDrawerSize(p.get("size") || "");
      setDrawerColor(
        p.get("color") === "electric"
          ? "Electric blue"
          : p.get("color") || ""
      );
      setDrawerMaxPrice(p.get("price") ? Number(p.get("price")) : PRICE_MAX);
      setDrawerSort(p.get("sort") || "featured");
    }
  }, [isOpen, location]);

  // Lock body scroll while drawer is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Close drawer on route change
  useEffect(() => {
    if (isOpen) {
      onClose();
    }
  }, [location]);

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleSearchSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      const target = `/collections?q=${encodeURIComponent(searchQuery.trim())}`;
      onClose();
      navigate(target);
      setSearchQuery("");
    }
  };

  // Helper to apply filters, navigate to /collections, and close drawer
  const applyFiltersAndNavigate = (newFilters: {
    category?: string;
    size?: string;
    color?: string;
    maxPrice?: number;
    sort?: string;
  }) => {
    const updated = {
      category: newFilters.category !== undefined ? newFilters.category : drawerCategory,
      size: newFilters.size !== undefined ? newFilters.size : drawerSize,
      color: newFilters.color !== undefined ? newFilters.color : drawerColor,
      maxPrice: newFilters.maxPrice !== undefined ? newFilters.maxPrice : drawerMaxPrice,
      sort: newFilters.sort !== undefined ? newFilters.sort : drawerSort,
    };

    if (newFilters.category !== undefined) setDrawerCategory(newFilters.category);
    if (newFilters.size !== undefined) setDrawerSize(newFilters.size);
    if (newFilters.color !== undefined) setDrawerColor(newFilters.color);
    if (newFilters.maxPrice !== undefined) setDrawerMaxPrice(newFilters.maxPrice);
    if (newFilters.sort !== undefined) setDrawerSort(newFilters.sort);

    const target = buildFilterUrl(updated);
    onClose();
    navigate(target);
  };

  const handleClearFilters = () => {
    setDrawerCategory("");
    setDrawerSize("");
    setDrawerColor("");
    setDrawerMaxPrice(PRICE_MAX);
    setDrawerSort("featured");
    onClose();
    navigate("/collections");
  };

  const activeFilterCount =
    Number(Boolean(drawerCategory)) +
    Number(Boolean(drawerSize)) +
    Number(Boolean(drawerColor)) +
    Number(drawerMaxPrice < PRICE_MAX) +
    Number(drawerSort !== "featured");

  const homeConfig = NAV_CONFIG.find((item) => item.id === "home");
  const essentialsConfig = NAV_CONFIG.find((item) => item.id === "essentials");
  const limitedConfig = NAV_CONFIG.find((item) => item.id === "limited");
  const contactConfig = NAV_CONFIG.find((item) => item.id === "contact");

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="mobile-navigation-drawer" className="fixed inset-0 z-50">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.05 : 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Slide-in Drawer from Left, pinned to Left Edge */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Navigation Menu"
            initial={shouldReduceMotion ? { opacity: 0 } : { x: "-100%" }}
            animate={shouldReduceMotion ? { opacity: 1 } : { x: "0%" }}
            exit={shouldReduceMotion ? { opacity: 0 } : { x: "-100%" }}
            transition={{ duration: shouldReduceMotion ? 0.05 : 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 left-0 bottom-0 w-[86%] max-w-sm bg-white/90 dark:bg-[#051029]/92 backdrop-blur-2xl text-foreground border-r border-[#0057ff]/18 shadow-[0_24px_60px_rgba(0,87,255,0.18)] flex flex-col justify-between overflow-y-auto"
          >
            {/* Top Section */}
            <div>
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-black/10 dark:border-white/10">
                <Link
                  href="/"
                  onClick={onClose}
                  className="brand-wordmark font-bold text-lg tracking-wider"
                  lang="ja"
                >
                  {brandWordmark}
                </Link>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 -mr-2 text-muted-foreground hover:text-foreground transition-colors rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1e6bff]"
                  aria-label="Close navigation menu"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Search in Drawer */}
              <div className="px-5 pt-4">
                <form
                  onSubmit={handleSearchSubmit}
                  className="flex items-center gap-2 px-3 py-2 rounded-sm border border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.03]"
                >
                  <Search size={16} className="text-muted-foreground shrink-0" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search collection..."
                    className="w-full bg-transparent border-0 outline-none text-xs text-foreground placeholder:text-muted-foreground"
                    aria-label="Search collection"
                  />
                </form>
              </div>

              {/* Navigation links & Sections */}
              <nav className="p-5 space-y-1" aria-label="Navigation Menu Links">
                {/* 1. Home Link */}
                {homeConfig && (
                  <div className="border-b border-black/5 dark:border-white/5 pb-2">
                    <Link
                      href={homeConfig.href || "/"}
                      onClick={onClose}
                      className={`block py-2 text-sm font-medium uppercase tracking-wider transition-colors ${
                        isNavItemActive(homeConfig, location)
                          ? "text-[#1e6bff] dark:text-[#4fa3ff]"
                          : "text-foreground hover:text-[#1e6bff]"
                      }`}
                    >
                      {homeConfig.label}
                    </Link>
                  </div>
                )}

                {/* 2 & 3. Essentials and Limited Accordions */}
                <Accordion type="multiple" className="w-full">
                  {/* Essentials Accordion */}
                  {essentialsConfig && essentialsConfig.columns && (
                    <AccordionItem value="essentials" className="border-b border-black/5 dark:border-white/5">
                      <AccordionTrigger className="py-3 text-sm font-medium uppercase tracking-wider hover:no-underline hover:text-[#1e6bff]">
                        <span
                          className={
                            isNavItemActive(essentialsConfig, location)
                              ? "text-[#1e6bff] dark:text-[#4fa3ff]"
                              : ""
                          }
                        >
                          {essentialsConfig.label}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 pb-4 space-y-5 pl-2">
                        {essentialsConfig.columns.map((column) => (
                          <div key={column.heading} className="space-y-2">
                            <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground block">
                              {column.heading}
                            </span>
                            <ul className="space-y-2 pl-2">
                              {column.links.map((link) => (
                                <li key={link.href}>
                                  <Link
                                    href={link.href}
                                    onClick={onClose}
                                    className={`text-sm font-normal block py-1 transition-colors ${
                                      location === link.href
                                        ? "text-[#1e6bff] dark:text-[#4fa3ff]"
                                        : "text-muted-foreground hover:text-foreground"
                                    }`}
                                  >
                                    {link.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {/* Limited Accordion */}
                  {limitedConfig && limitedConfig.items && (
                    <AccordionItem value="limited" className="border-b border-black/5 dark:border-white/5">
                      <AccordionTrigger className="py-3 text-sm font-medium uppercase tracking-wider hover:no-underline hover:text-[#1e6bff]">
                        <span
                          className={
                            isNavItemActive(limitedConfig, location)
                              ? "text-[#1e6bff] dark:text-[#4fa3ff]"
                              : ""
                          }
                        >
                          {limitedConfig.label}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 pb-4 space-y-2 pl-2">
                        <ul className="space-y-2">
                          {limitedConfig.items.map((item) => (
                            <li key={item.href}>
                              <Link
                                href={item.href}
                                onClick={onClose}
                                className={`flex items-center justify-between py-1.5 text-sm transition-colors ${
                                  item.highlight
                                    ? "font-bold text-foreground border-t border-black/10 dark:border-white/10 pt-3 mt-2"
                                    : location === item.href
                                      ? "text-[#1e6bff] font-normal dark:text-[#4fa3ff]"
                                      : "text-muted-foreground font-normal hover:text-foreground"
                                }`}
                              >
                                <span className="flex items-center gap-2">
                                  {item.isPulsing && (
                                    <span className="relative flex h-2 w-2">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600" />
                                    </span>
                                  )}
                                  <span>{item.label}</span>
                                </span>

                                {item.badge && (
                                  <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                                    {item.badge}
                                  </span>
                                )}

                                {item.highlight && (
                                  <ArrowRight size={13} className="text-[#1e6bff] dark:text-[#4fa3ff]" />
                                )}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                </Accordion>

                {/* 4. Contact Link (after Limited) */}
                {contactConfig && (
                  <div className="border-b border-black/5 dark:border-white/5 py-1">
                    <Link
                      href={contactConfig.href || "/contact"}
                      onClick={onClose}
                      className={`block py-2 text-sm font-medium uppercase tracking-wider transition-colors ${
                        isNavItemActive(contactConfig, location)
                          ? "text-[#1e6bff] dark:text-[#4fa3ff]"
                          : "text-foreground hover:text-[#1e6bff]"
                      }`}
                    >
                      {contactConfig.label}
                    </Link>
                  </div>
                )}

                {/* 5. Filters Section (at the bottom, after Contact) */}
                <Accordion type="multiple" className="w-full">
                  <AccordionItem value="filters" className="border-b border-black/5 dark:border-white/5">
                    <AccordionTrigger className="py-3 text-sm font-medium uppercase tracking-wider hover:no-underline hover:text-[#1e6bff]">
                      <span className="flex items-center gap-2">
                        <SlidersHorizontal size={14} />
                        <span>Filters</span>
                        {activeFilterCount > 0 && (
                          <span className="h-4 min-w-4 px-1 rounded-full bg-[#1e6bff] text-white text-[9px] font-medium flex items-center justify-center leading-none">
                            {activeFilterCount}
                          </span>
                        )}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4">
                      <FilterPanel
                        isDrawer
                        category={drawerCategory}
                        size={drawerSize}
                        color={drawerColor}
                        maxPrice={drawerMaxPrice}
                        sort={drawerSort}
                        onCategoryChange={(val) => applyFiltersAndNavigate({ category: val })}
                        onSizeChange={(val) => applyFiltersAndNavigate({ size: val })}
                        onColorChange={(val) => applyFiltersAndNavigate({ color: val })}
                        onPriceChange={(val) => setDrawerMaxPrice(val)}
                        onSortChange={(val) => applyFiltersAndNavigate({ sort: val })}
                        onClear={handleClearFilters}
                        onApply={() => applyFiltersAndNavigate({})}
                      />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </nav>
            </div>

            {/* Bottom Actions & Utilities in Drawer */}
            <div className="p-5 border-t border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] text-xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <Link
                  href="/account"
                  onClick={onClose}
                  className="flex items-center gap-2 text-foreground hover:text-[#1e6bff] transition-colors font-medium text-xs tracking-wider uppercase"
                >
                  <UserRound size={16} />
                  <span>Your Account</span>
                </Link>

                <Link
                  href="/wishlist"
                  onClick={onClose}
                  className="flex items-center gap-1.5 text-foreground hover:text-[#1e6bff] transition-colors font-medium text-xs tracking-wider uppercase"
                >
                  <Heart size={16} />
                  <span>Wishlist ({favorites.length})</span>
                </Link>

                <Link
                  href="/bag"
                  onClick={onClose}
                  className="flex items-center gap-1.5 text-foreground hover:text-[#1e6bff] transition-colors font-medium text-xs tracking-wider uppercase"
                >
                  <ShoppingBag size={16} />
                  <span>Bag ({count})</span>
                </Link>
              </div>

              <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center gap-2.5 w-full pt-3 pb-1 border-t border-black/5 dark:border-white/5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer text-left text-xs tracking-wider uppercase font-medium"
              >
                {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
                <span>Switch to {theme === "light" ? "dark" : "light"} mode</span>
              </button>

              <p className="text-[10px] text-muted-foreground/70 pt-1">
                © 2026 主人公 Studio. Main Character Clothing.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
