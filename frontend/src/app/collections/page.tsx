"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Heart,
  Eye,
  SlidersHorizontal,
  X,
  ChevronDown,
  Check,
  Search,
  Grid3X3,
  LayoutGrid,
} from "lucide-react";
import {
  Product,
  ProductSize,
  PRODUCTS_CATALOG,
  CATEGORIES_LIST,
  SIZES_LIST,
  COLOR_SWATCHES,
  BRANDS_LIST,
  MATERIALS_LIST,
  SORT_OPTIONS,
  SortOptionId,
  CATEGORY_EDITORIAL_MAP,
} from "@/data/products";
import QuickViewModal from "@/components/collections/QuickViewModal";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { useIsMounted } from "@/lib/useIsMounted";

function normalizeCategoryKey(rawKey: string | null): string {
  if (!rawKey) return "all";
  const cleaned = rawKey.toLowerCase().trim();
  if (cleaned === "pants") return "trousers";
  if (cleaned === "jerseys") return "dresses";
  if (cleaned === "raw-denim-collection") return "jeans";
  const match = CATEGORIES_LIST.find((c) => c.id === cleaned);
  return match ? match.id : "all";
}

function CollectionsClientContent() {
  const isMounted = useIsMounted();
  const searchParams = useSearchParams();
  const router = useRouter();

  // ── Category State ──
  const initialCat = normalizeCategoryKey(searchParams.get("category"));
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCat);

  useEffect(() => {
    const fromUrl = normalizeCategoryKey(searchParams.get("category"));
    setSelectedCategory((prev) => (prev !== fromUrl ? fromUrl : prev));
  }, [searchParams]);

  // ── Universal Filter States ──
  const [selectedSizes, setSelectedSizes] = useState<ProductSize[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceMin, setPriceMin] = useState<number>(100);
  const [priceMax, setPriceMax] = useState<number>(1000);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([]);
  const [minDiscount, setMinDiscount] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // ── Context-Aware Category-Specific Filters ──
  const [selectedFit, setSelectedFit] = useState<string[]>([]);
  const [selectedSleeveLength, setSelectedSleeveLength] = useState<string[]>([]);
  const [selectedCollarStyle, setSelectedCollarStyle] = useState<string[]>([]);
  const [selectedNeckline, setSelectedNeckline] = useState<string[]>([]);
  const [selectedSleeveType, setSelectedSleeveType] = useState<string[]>([]);
  const [selectedWaistType, setSelectedWaistType] = useState<string[]>([]);
  const [selectedLength, setSelectedLength] = useState<string[]>([]);
  const [selectedWash, setSelectedWash] = useState<string[]>([]);
  const [selectedWaist, setSelectedWaist] = useState<string[]>([]);
  const [selectedRise, setSelectedRise] = useState<string[]>([]);
  const [selectedDressLength, setSelectedDressLength] = useState<string[]>([]);
  const [selectedSilhouette, setSelectedSilhouette] = useState<string[]>([]);
  const [selectedOccasion, setSelectedOccasion] = useState<string[]>([]);
  const [selectedJacketType, setSelectedJacketType] = useState<string[]>([]);

  // ── UI / Layout States ──
  const [gridCols, setGridCols] = useState<3 | 4>(3);
  const [sortBy, setSortBy] = useState<SortOptionId>("featured");
  const [visibleCount, setVisibleCount] = useState<number>(12);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState<boolean>(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState<boolean>(false);

  // ── Quick View & Toast ──
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [toastNotification, setToastNotification] = useState<string | null>(null);

  // ── Zustand Stores ──
  const addItemToCart = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const wishlistItemIds = useWishlistStore((s) => s.itemIds);

  // Body scroll lock when filter drawer is open
  useEffect(() => {
    if (filterDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [filterDrawerOpen]);

  const resetContextAwareFilters = () => {
    setSelectedFit([]);
    setSelectedSleeveLength([]);
    setSelectedCollarStyle([]);
    setSelectedNeckline([]);
    setSelectedSleeveType([]);
    setSelectedWaistType([]);
    setSelectedLength([]);
    setSelectedWash([]);
    setSelectedWaist([]);
    setSelectedRise([]);
    setSelectedDressLength([]);
    setSelectedSilhouette([]);
    setSelectedOccasion([]);
    setSelectedJacketType([]);
  };

  const handleCategoryChange = (newCat: string) => {
    setSelectedCategory(newCat);
    resetContextAwareFilters();
    setVisibleCount(12);
    const url = newCat === "all" ? "/collections" : `/collections?category=${newCat}`;
    router.replace(url, { scroll: false });
  };

  const handleToggleOption = (
    value: string,
    state: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter(state.includes(value) ? state.filter((item) => item !== value) : [...state, value]);
  };

  const clearAllFilters = () => {
    setSelectedSizes([]);
    setSelectedColors([]);
    setPriceMin(100);
    setPriceMax(1000);
    setSelectedBrands([]);
    setSelectedMaterials([]);
    setSelectedAvailability([]);
    setMinDiscount(0);
    setSearchQuery("");
    resetContextAwareFilters();
    setVisibleCount(12);
  };

  // Active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedSizes.length > 0) count += selectedSizes.length;
    if (selectedColors.length > 0) count += selectedColors.length;
    if (priceMin > 100 || priceMax < 1000) count++;
    if (selectedBrands.length > 0) count += selectedBrands.length;
    if (selectedMaterials.length > 0) count += selectedMaterials.length;
    if (selectedAvailability.length > 0) count += selectedAvailability.length;
    if (minDiscount > 0) count++;
    if (searchQuery.trim() !== "") count++;

    count +=
      selectedFit.length +
      selectedSleeveLength.length +
      selectedCollarStyle.length +
      selectedNeckline.length +
      selectedSleeveType.length +
      selectedWaistType.length +
      selectedLength.length +
      selectedWash.length +
      selectedWaist.length +
      selectedRise.length +
      selectedDressLength.length +
      selectedSilhouette.length +
      selectedOccasion.length +
      selectedJacketType.length;

    return count;
  }, [
    selectedSizes,
    selectedColors,
    priceMin,
    priceMax,
    selectedBrands,
    selectedMaterials,
    selectedAvailability,
    minDiscount,
    searchQuery,
    selectedFit,
    selectedSleeveLength,
    selectedCollarStyle,
    selectedNeckline,
    selectedSleeveType,
    selectedWaistType,
    selectedLength,
    selectedWash,
    selectedWaist,
    selectedRise,
    selectedDressLength,
    selectedSilhouette,
    selectedOccasion,
    selectedJacketType,
  ]);

  const currentEditorial = useMemo(() => {
    return CATEGORY_EDITORIAL_MAP[selectedCategory] || CATEGORY_EDITORIAL_MAP.all;
  }, [selectedCategory]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return PRODUCTS_CATALOG.filter((item) => {
      if (selectedCategory !== "all") {
        const catObj = CATEGORIES_LIST.find((c) => c.id === selectedCategory);
        if (catObj?.category) {
          if (catObj.category === "Men's Wear") {
            if (item.gender !== "Men" && item.gender !== "Unisex") return false;
          } else if (catObj.category === "Women's Wear") {
            if (item.gender !== "Women" && item.gender !== "Unisex") return false;
          } else if (item.category !== catObj.category) {
            return false;
          }
        }
      }

      if (selectedSizes.length > 0 && !selectedSizes.some((s) => item.sizes.includes(s))) return false;
      if (
        selectedColors.length > 0 &&
        !selectedColors.some((c) => item.colors.some((ic) => ic.name.toLowerCase() === c.toLowerCase()))
      )
        return false;
      if (item.price < priceMin || item.price > priceMax) return false;
      if (selectedBrands.length > 0 && !selectedBrands.includes(item.brand)) return false;
      if (selectedMaterials.length > 0 && !selectedMaterials.includes(item.material)) return false;
      if (selectedAvailability.length > 0 && !selectedAvailability.includes(item.availability)) return false;
      if (minDiscount > 0 && (!item.discount || item.discount < minDiscount)) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          item.name.toLowerCase().includes(q) ||
          item.subtitle.toLowerCase().includes(q) ||
          item.material.toLowerCase().includes(q) ||
          item.clothingType.toLowerCase().includes(q) ||
          item.brand.toLowerCase().includes(q);
        if (!matches) return false;
      }

      if (selectedFit.length > 0 && item.fit && !selectedFit.includes(item.fit)) return false;
      if (selectedSleeveLength.length > 0 && item.sleeveLength && !selectedSleeveLength.includes(item.sleeveLength))
        return false;
      if (selectedCollarStyle.length > 0 && item.collarStyle && !selectedCollarStyle.includes(item.collarStyle))
        return false;
      if (selectedNeckline.length > 0 && item.neckline && !selectedNeckline.includes(item.neckline)) return false;
      if (selectedSleeveType.length > 0 && item.sleeveType && !selectedSleeveType.includes(item.sleeveType))
        return false;
      if (selectedWaistType.length > 0 && item.waistType && !selectedWaistType.includes(item.waistType))
        return false;
      if (selectedLength.length > 0 && item.length && !selectedLength.includes(item.length)) return false;
      if (selectedWash.length > 0 && item.wash && !selectedWash.includes(item.wash)) return false;
      if (selectedWaist.length > 0 && item.waist && !selectedWaist.includes(item.waist)) return false;
      if (selectedRise.length > 0 && item.rise && !selectedRise.includes(item.rise)) return false;
      if (selectedDressLength.length > 0 && item.dressLength && !selectedDressLength.includes(item.dressLength))
        return false;
      if (selectedSilhouette.length > 0 && item.silhouette && !selectedSilhouette.includes(item.silhouette))
        return false;
      if (selectedOccasion.length > 0 && item.occasion && !selectedOccasion.includes(item.occasion)) return false;
      if (selectedJacketType.length > 0 && item.jacketType && !selectedJacketType.includes(item.jacketType))
        return false;

      return true;
    }).sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "bestsellers":
          return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
        case "featured":
        default:
          return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      }
    });
  }, [
    selectedCategory,
    selectedSizes,
    selectedColors,
    priceMin,
    priceMax,
    selectedBrands,
    selectedMaterials,
    selectedAvailability,
    minDiscount,
    searchQuery,
    selectedFit,
    selectedSleeveLength,
    selectedCollarStyle,
    selectedNeckline,
    selectedSleeveType,
    selectedWaistType,
    selectedLength,
    selectedWash,
    selectedWaist,
    selectedRise,
    selectedDressLength,
    selectedSilhouette,
    selectedOccasion,
    selectedJacketType,
    sortBy,
  ]);

  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

  const handleQuickAdd = (product: Product, sizeToUse?: ProductSize) => {
    const chosenSize = sizeToUse ?? product.sizes[0] ?? "M";
    const defaultColor = product.colors[0]?.name ?? "Default";
    addItemToCart({
      id: `${product.id}-${chosenSize}-${defaultColor}`,
      name: product.name,
      price: product.price,
      quantity: 1,
      size: chosenSize,
      color: defaultColor,
      image: product.primaryImage,
    });
    setToastNotification(`Added "${product.name}" (${chosenSize}) to Bag.`);
    setTimeout(() => setToastNotification(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#20242B] antialiased selection:bg-[#0B1F3A] selection:text-[#FAF8F5]">

      {/* ── Minimal Bag Toast Notification ── */}
      {toastNotification && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#0B1F3A] text-[#FAF8F5] px-5 py-3.5 shadow-lg text-xs font-light tracking-wide transition-all duration-300"
        >
          <Check className="h-3.5 w-3.5 text-[#C6A76A]" />
          <span>{toastNotification}</span>
          <Link
            href="/carts"
            className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#C6A76A] hover:underline pl-3 border-l border-white/20"
          >
            View Bag
          </Link>
        </aside>
      )}

      {/* ══════════════════════════════════════════════════════════════
          1. ELEVATED ATMOSPHERIC HERO SECTION (DEEP BLUE & CHAMPAGNE)
          ══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#06101E] via-[#091A2E] to-[#0E243D] text-[#F8F6F1] pt-28 sm:pt-36 pb-12 sm:pb-16 border-b border-[#C6A76A]/20">
        
        {/* Atmospheric Soft Lighting, Radial Glows & Tactile Grain */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Ethereal royal blue spotlight */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[520px] bg-[radial-gradient(ellipse_at_top,rgba(36,75,117,0.45),transparent_75%)]" />
          {/* Warm champagne ambient illumination */}
          <div className="absolute top-1/4 right-[8%] w-[650px] h-[420px] bg-[radial-gradient(ellipse_at_center,rgba(198,167,106,0.1),transparent_65%)]" />
          {/* Muted navy bottom vignette */}
          <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-[#06101E]/70 to-transparent" />
          {/* Subtle tactile noise grain texture */}
          <div
            className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />
          {/* Subtle Japanese Monogram Watermark */}
          <div className="absolute top-14 right-10 lg:right-24 font-serif text-[180px] lg:text-[240px] leading-none text-[#C6A76A] opacity-[0.035] select-none">
            {currentEditorial.japaneseKanji || "主角"}
          </div>
        </div>

        {/* Header Content */}
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-12">
          
          {/* Path & Collection Status */}
          <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.25em] text-[#C6A76A]/85 font-sans mb-5">
            <div className="flex items-center gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#C6A76A] animate-pulse" />
              <span>{currentEditorial.eyebrow || "MainCharacter Salon · Autumn / Winter 2026"}</span>
            </div>
            <span className="font-mono text-[#F8F6F1]/50">{filteredProducts.length} Silhouettes</span>
          </div>

          {/* Prominent Editorial Title */}
          <div className="max-w-3xl space-y-4">
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-[#F8F6F1] tracking-tight leading-[1.08]">
              {selectedCategory === "all" ? (
                <>
                  The Full Collection
                  <span className="block italic text-[#C6A76A] font-light text-3xl sm:text-4xl lg:text-5xl mt-1.5">
                    Curated Silhouettes.
                  </span>
                </>
              ) : (
                <>
                  {currentEditorial.categoryName}
                  <span className="block italic text-[#C6A76A] font-light text-3xl sm:text-4xl lg:text-5xl mt-1.5">
                    {currentEditorial.italicHeadline}
                  </span>
                </>
              )}
            </h1>
            <p className="text-sm sm:text-base text-[#F8F6F1]/75 font-light leading-relaxed max-w-2xl">
              {currentEditorial.description}
            </p>
          </div>

          {/* Clean Horizontal Category Navigation with Gold Underline */}
          <nav
            aria-label="Clothing Categories"
            className="mt-12 pt-5 border-t border-white/[0.12] flex items-center gap-6 sm:gap-8 overflow-x-auto scrollbar-none"
          >
            {CATEGORIES_LIST.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`relative pb-3 text-xs uppercase tracking-[0.2em] whitespace-nowrap transition-colors ${
                    isActive
                      ? "text-[#C6A76A] font-semibold"
                      : "text-[#F8F6F1]/55 hover:text-[#F8F6F1]"
                  }`}
                >
                  <span>{cat.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 inset-x-0 h-[1.5px] bg-[#C6A76A] shadow-[0_0_8px_rgba(198,167,106,0.6)]" />
                  )}
                </button>
              );
            })}
          </nav>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          2. GALLERY CANVAS WITH MULTI-LAYERED WARM IVORY DEPTH & NOISE
          ══════════════════════════════════════════════════════════════ */}
      <div className="relative bg-[#FAF8F5]">
        
        {/* Soft Ambient Illumination & Tactile Texture */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Top subtle tone-melt from the deep blue hero into warm ivory */}
          <div className="absolute top-0 inset-x-0 h-44 bg-gradient-to-b from-[#F2EFE9]/80 via-[#FAF8F5]/90 to-[#FAF8F5]" />

          {/* Delicate champagne and muted royal light pools */}
          <div className="absolute top-[8%] left-[4%] w-[850px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(198,167,106,0.038),transparent_65%)]" />
          <div className="absolute top-[35%] right-[5%] w-[950px] h-[750px] bg-[radial-gradient(ellipse_at_center,rgba(36,75,117,0.026),transparent_70%)]" />
          <div className="absolute top-[68%] left-[10%] w-[800px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(198,167,106,0.032),transparent_65%)]" />
          
          {/* Tactile organic paper grain overlay */}
          <div
            className="absolute inset-0 opacity-[0.022] mix-blend-multiply"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* ── 3. SLIM, ELEGANT FILTER & SORTING TOOLBAR ── */}
        <div className="sticky top-20 z-20 bg-[#FAF8F5]/90 backdrop-blur-md border-y border-[#20242B]/10 px-6 sm:px-12 py-3.5">
          <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4">
          
          {/* Left: Filter Trigger & Active Indicators */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setFilterDrawerOpen(true)}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] font-medium text-[#0B1F3A] hover:text-[#244B75] transition-colors"
            >
              <SlidersHorizontal className="h-3.5 w-3.5 stroke-[1.75]" />
              <span>
                Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ""}
              </span>
            </button>

            {/* Active filter badges in subtle typography */}
            {activeFilterCount > 0 && (
              <div className="hidden md:flex items-center gap-2 pl-4 border-l border-[#20242B]/15 text-[11px] text-[#20242B]/60 font-light">
                <span>{activeFilterCount} active filter{activeFilterCount > 1 ? "s" : ""}</span>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="underline hover:text-[#0B1F3A] transition-colors"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Center: Search Field */}
          <div className="relative hidden sm:block w-48 lg:w-64">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#20242B]/40" />
            <input
              type="text"
              placeholder="Search collection..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-b border-[#20242B]/15 focus:border-[#0B1F3A] text-xs pl-6 pr-2 py-1 outline-none text-[#0B1F3A] placeholder-[#20242B]/40 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-[#20242B]/40 hover:text-[#0B1F3A]"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Right: Sort Trigger & Grid Density Switcher */}
          <div className="flex items-center gap-6">
            
            {/* Minimal Sort Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.16em] text-[#0B1F3A] hover:text-[#244B75] transition-colors"
              >
                <span>Sort</span>
                <ChevronDown className="h-3 w-3 stroke-[1.75]" />
              </button>

              {sortDropdownOpen && (
                <div
                  onMouseLeave={() => setSortDropdownOpen(false)}
                  className="absolute right-0 top-full mt-2 w-48 bg-[#FAF8F5] border border-[#20242B]/10 shadow-xl py-2 z-30 animate-fade-down"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setSortBy(opt.id);
                        setSortDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs tracking-wider transition-colors flex items-center justify-between ${
                        sortBy === opt.id
                          ? "font-semibold text-[#0B1F3A] bg-[#20242B]/[0.03]"
                          : "text-[#20242B]/70 hover:text-[#0B1F3A] hover:bg-[#20242B]/[0.02]"
                      }`}
                    >
                      <span>{opt.label}</span>
                      {sortBy === opt.id && <Check className="h-3 w-3 text-[#0B1F3A]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Subtle Grid Switcher (3 cols vs 4 cols) */}
            <div className="hidden lg:flex items-center gap-2 text-[#20242B]/40">
              <button
                type="button"
                title="3-Column Editorial Grid"
                onClick={() => setGridCols(3)}
                className={`p-1 transition-colors ${
                  gridCols === 3 ? "text-[#0B1F3A]" : "hover:text-[#0B1F3A]"
                }`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                type="button"
                title="4-Column Condensed Grid"
                onClick={() => setGridCols(4)}
                className={`p-1 transition-colors ${
                  gridCols === 4 ? "text-[#0B1F3A]" : "hover:text-[#0B1F3A]"
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          3. SEAMLESS PRODUCT GALLERY (NO BOXES, NO CARDS, PURE ELEGANCE)
          ══════════════════════════════════════════════════════════════ */}
      <main className="max-w-[1400px] mx-auto px-6 sm:px-12 py-12 sm:py-16">
        
        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="py-24 text-center space-y-4 max-w-md mx-auto">
            <h2 className="font-serif text-3xl font-normal text-[#0B1F3A]">
              No Silhouettes Found
            </h2>
            <p className="text-xs text-[#20242B]/60 font-light leading-relaxed">
              No creations currently match the selected criteria in {currentEditorial.categoryName}. 
              Please reset your filters to explore the rest of the collection.
            </p>
            <div className="pt-4">
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-xs uppercase tracking-[0.2em] font-medium text-[#0B1F3A] underline underline-offset-4 hover:text-[#244B75]"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        )}

        {/* ── UNBOXED GALLERY GRID ── */}
        <div
          className={`grid grid-cols-2 ${
            gridCols === 4
              ? "lg:grid-cols-4 gap-x-6 gap-y-12 sm:gap-x-8 sm:gap-y-16"
              : "lg:grid-cols-3 gap-x-8 gap-y-14 sm:gap-x-12 sm:gap-y-20"
          }`}
        >
          {displayedProducts.map((product, index) => {
            const isWishlisted = isMounted && wishlistItemIds.includes(product.id);

            // Selective Editorial Inset Break (after 6th item, seamlessly woven into the flow)
            const showEditorialBreak = gridCols === 3 && index === 5;

            return (
              <div key={product.id} className="contents">
                
                {/* Product Entry: Open, borderless, seamless */}
                <article className="group flex flex-col cursor-pointer">
                  
                  {/* Portrait Photography Frame */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#ECE8DF] select-none">
                    
                    {/* Primary Image */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.primaryImage}
                      alt={product.name}
                      loading="lazy"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (!target.src.includes("male-model-desktop")) {
                          target.src = "/images/male-model-desktop.jpg";
                        }
                      }}
                      className="h-full w-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-[1.03] group-hover:opacity-0"
                    />

                    {/* Alternate Image on Hover */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.alternateImage}
                      alt={`${product.name} alternate angle`}
                      loading="lazy"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (!target.src.includes("male-model-desktop")) {
                          target.src = "/images/male-model-desktop.jpg";
                        }
                      }}
                      className="absolute inset-0 h-full w-full object-cover object-center opacity-0 transition-all duration-700 ease-out group-hover:opacity-100 group-hover:scale-[1.03]"
                    />

                    {/* Minimalist Badge (Understated top-left label) */}
                    {(product.badge || product.isNew) && (
                      <span className="absolute top-3 left-3 text-[9px] uppercase tracking-[0.2em] font-medium text-[#0B1F3A] bg-[#FAF8F5]/90 backdrop-blur-sm px-2 py-0.5">
                        {product.badge || "New Arrival"}
                      </span>
                    )}

                    {/* Quiet Wishlist Icon (Top Right) */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product.id);
                      }}
                      aria-label={isWishlisted ? "Remove from wishlist" : "Save to wishlist"}
                      className="absolute top-3 right-3 p-2 text-[#0B1F3A]/70 hover:text-[#0B1F3A] transition-all hover:scale-110"
                    >
                      <Heart
                        className={`h-4 w-4 transition-colors ${
                          isWishlisted
                            ? "fill-[#C6A76A] text-[#C6A76A]"
                            : "stroke-[1.5]"
                        }`}
                      />
                    </button>

                    {/* Subtle Quick View Trigger (Slide-up on hover) */}
                    <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => setQuickViewProduct(product)}
                        className="w-full py-2.5 bg-[#FAF8F5]/95 text-[#0B1F3A] text-[10px] uppercase tracking-[0.2em] font-medium hover:bg-[#0B1F3A] hover:text-[#FAF8F5] transition-colors shadow-sm"
                      >
                        Quick View
                      </button>
                    </div>

                  </div>

                  {/* Product Typography Beneath Image (Pure, unboxed, breathable) */}
                  <div className="pt-4 space-y-1 text-left">
                    
                    {/* Subtle Color Dot Indicators */}
                    {product.colors.length > 1 && (
                      <div className="flex items-center gap-1.5 pb-0.5">
                        {product.colors.slice(0, 4).map((col) => (
                          <span
                            key={col.name}
                            title={col.name}
                            className="h-2 w-2 rounded-full border border-black/15"
                            style={{ backgroundColor: col.hex }}
                          />
                        ))}
                      </div>
                    )}

                    {/* Name */}
                    <h2
                      onClick={() => setQuickViewProduct(product)}
                      className="font-serif text-base sm:text-lg text-[#0B1F3A] font-normal leading-snug line-clamp-1 group-hover:text-[#244B75] transition-colors"
                    >
                      {product.name}
                    </h2>

                    {/* Material or Subtitle */}
                    <p className="text-xs text-[#20242B]/55 font-light truncate">
                      {product.material}
                    </p>

                    {/* Clean Price */}
                    <div className="pt-0.5 flex items-baseline gap-2 text-sm font-sans text-[#0B1F3A]">
                      <span>${product.price}</span>
                      {product.originalPrice && (
                        <span className="text-xs text-[#20242B]/40 line-through">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>

                  </div>

                </article>

                {/* Optional Organic Editorial Break (Asymmetric Loewe / Toteme style) */}
                {showEditorialBreak && (
                  <div className="hidden lg:flex col-span-3 my-12 py-16 px-8 items-center justify-center text-center bg-gradient-to-r from-transparent via-[#F0ECE4]/60 to-transparent border-y border-[#20242B]/[0.08]">
                    <div className="max-w-2xl space-y-4">
                      <span className="text-[10px] uppercase tracking-[0.28em] text-[#C6A76A] font-mono block">
                        Atelier Philosophy
                      </span>
                      <blockquote className="font-serif text-2xl sm:text-3xl text-[#0B1F3A] font-light italic leading-relaxed">
                        &ldquo;{currentEditorial.quote}&rdquo;
                      </blockquote>
                      <span className="text-xs text-[#20242B]/50 font-light block tracking-wider">
                        — {currentEditorial.quoteAuthor}
                      </span>
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>

        {/* ── Load More / Pagination ── */}
        {visibleCount < filteredProducts.length && (
          <div className="pt-16 text-center space-y-3">
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => prev + 8)}
              className="px-8 py-3.5 border border-[#0B1F3A] text-xs uppercase tracking-[0.22em] font-medium text-[#0B1F3A] hover:bg-[#0B1F3A] hover:text-[#FAF8F5] transition-all"
            >
              Load More Silhouettes
            </button>
            <div className="text-[11px] text-[#20242B]/45 font-mono">
              Showing {displayedProducts.length} of {filteredProducts.length} pieces
            </div>
          </div>
        )}

      </main>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          4. SOPHISTICATED SLIDE-OVER FILTER DRAWER (THE ROW / TOTEME)
          ══════════════════════════════════════════════════════════════ */}
      {filterDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop overlay */}
          <div
            onClick={() => setFilterDrawerOpen(false)}
            className="absolute inset-0 bg-black/25 backdrop-blur-[2px] transition-opacity"
          />

          {/* Drawer Panel */}
          <aside
            role="dialog"
            aria-label="Filter Collection"
            className="absolute inset-y-0 right-0 w-full max-w-md bg-[#FAF8F5] shadow-2xl flex flex-col justify-between animate-fade-left overflow-hidden relative"
          >
            {/* Subtle atmospheric ambient glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[radial-gradient(circle,rgba(198,167,106,0.05),transparent_70%)] pointer-events-none" />
            {/* Drawer Header */}
            <div className="p-6 sm:p-8 border-b border-[#20242B]/10 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-2xl text-[#0B1F3A] font-normal">
                  Refine Collection
                </h3>
                <span className="text-[11px] uppercase tracking-[0.2em] text-[#20242B]/50">
                  {currentEditorial.categoryName}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setFilterDrawerOpen(false)}
                className="p-2 text-[#20242B]/60 hover:text-[#0B1F3A] transition-colors"
              >
                <X className="h-5 w-5 stroke-[1.5]" />
              </button>
            </div>

            {/* Drawer Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 scrollbar-thin">
              
              {/* Context-Aware Facets (Only displayed for selected category) */}
              {selectedCategory === "shirts" && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <span className="text-[10px] uppercase tracking-[0.22em] text-[#0B1F3A] font-semibold block">
                      Shirt Fit
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {["Relaxed Oversized", "Tailored Fit", "Classic Drape"].map((f) => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => handleToggleOption(f, selectedFit, setSelectedFit)}
                          className={`text-xs px-3.5 py-1.5 border transition-all ${
                            selectedFit.includes(f)
                              ? "bg-[#0B1F3A] text-[#FAF8F5] border-[#0B1F3A]"
                              : "border-[#20242B]/15 text-[#20242B]/70 hover:border-[#0B1F3A]"
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <span className="text-[10px] uppercase tracking-[0.22em] text-[#0B1F3A] font-semibold block">
                      Collar Style
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {["Band Collar", "Cuban Spread", "Pointed Atelier Collar", "Mandarin Collar"].map((cs) => (
                        <button
                          key={cs}
                          type="button"
                          onClick={() => handleToggleOption(cs, selectedCollarStyle, setSelectedCollarStyle)}
                          className={`text-xs px-3.5 py-1.5 border transition-all ${
                            selectedCollarStyle.includes(cs)
                              ? "bg-[#0B1F3A] text-[#FAF8F5] border-[#0B1F3A]"
                              : "border-[#20242B]/15 text-[#20242B]/70 hover:border-[#0B1F3A]"
                          }`}
                        >
                          {cs}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {selectedCategory === "jeans" && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <span className="text-[10px] uppercase tracking-[0.22em] text-[#0B1F3A] font-semibold block">
                      Selvedge Wash
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {["Raw Indigo", "Vintage Stone Wash", "Black Sulfur", "White Ecru"].map((w) => (
                        <button
                          key={w}
                          type="button"
                          onClick={() => handleToggleOption(w, selectedWash, setSelectedWash)}
                          className={`text-xs px-3.5 py-1.5 border transition-all ${
                            selectedWash.includes(w)
                              ? "bg-[#0B1F3A] text-[#FAF8F5] border-[#0B1F3A]"
                              : "border-[#20242B]/15 text-[#20242B]/70 hover:border-[#0B1F3A]"
                          }`}
                        >
                          {w}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <span className="text-[10px] uppercase tracking-[0.22em] text-[#0B1F3A] font-semibold block">
                      Denim Cut
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {["Wide Leg", "Straight Cut", "Relaxed Taper"].map((f) => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => handleToggleOption(f, selectedFit, setSelectedFit)}
                          className={`text-xs px-3.5 py-1.5 border transition-all ${
                            selectedFit.includes(f)
                              ? "bg-[#0B1F3A] text-[#FAF8F5] border-[#0B1F3A]"
                              : "border-[#20242B]/15 text-[#20242B]/70 hover:border-[#0B1F3A]"
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {selectedCategory === "jackets" && (
                <div className="space-y-3">
                  <span className="text-[10px] uppercase tracking-[0.22em] text-[#0B1F3A] font-semibold block">
                    Jacket &amp; Coat Type
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {["Overcoat", "Trench", "Bomber Blouson", "Atelier Jacket"].map((jt) => (
                      <button
                        key={jt}
                        type="button"
                        onClick={() => handleToggleOption(jt, selectedJacketType, setSelectedJacketType)}
                        className={`text-xs px-3.5 py-1.5 border transition-all ${
                          selectedJacketType.includes(jt)
                            ? "bg-[#0B1F3A] text-[#FAF8F5] border-[#0B1F3A]"
                            : "border-[#20242B]/15 text-[#20242B]/70 hover:border-[#0B1F3A]"
                        }`}
                      >
                        {jt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedCategory === "dresses" && (
                <div className="space-y-3">
                  <span className="text-[10px] uppercase tracking-[0.22em] text-[#0B1F3A] font-semibold block">
                    Couture Silhouette
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {["Bias-Cut Slip", "Architectural Wrap", "Blazer Dress", "Column Gown"].map((sil) => (
                      <button
                        key={sil}
                        type="button"
                        onClick={() => handleToggleOption(sil, selectedSilhouette, setSelectedSilhouette)}
                        className={`text-xs px-3.5 py-1.5 border transition-all ${
                          selectedSilhouette.includes(sil)
                            ? "bg-[#0B1F3A] text-[#FAF8F5] border-[#0B1F3A]"
                            : "border-[#20242B]/15 text-[#20242B]/70 hover:border-[#0B1F3A]"
                        }`}
                      >
                        {sil}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 1. Size Selection */}
              <div className="space-y-3 pt-4 border-t border-[#20242B]/10">
                <span className="text-[10px] uppercase tracking-[0.22em] text-[#0B1F3A] font-semibold block">
                  Size
                </span>
                <div className="grid grid-cols-6 gap-2">
                  {SIZES_LIST.map((sz) => {
                    const isSelected = selectedSizes.includes(sz);
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() =>
                          setSelectedSizes((prev) =>
                            prev.includes(sz) ? prev.filter((s) => s !== sz) : [...prev, sz]
                          )
                        }
                        className={`py-2 text-xs uppercase tracking-wider text-center border transition-all ${
                          isSelected
                            ? "bg-[#0B1F3A] text-[#FAF8F5] border-[#0B1F3A]"
                            : "border-[#20242B]/15 text-[#20242B] hover:border-[#0B1F3A]"
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Color Swatches */}
              <div className="space-y-3 pt-4 border-t border-[#20242B]/10">
                <span className="text-[10px] uppercase tracking-[0.22em] text-[#0B1F3A] font-semibold block">
                  Color
                </span>
                <div className="grid grid-cols-4 gap-3">
                  {COLOR_SWATCHES.map((swatch) => {
                    const isSelected = selectedColors.includes(swatch.name);
                    return (
                      <button
                        key={swatch.name}
                        type="button"
                        onClick={() =>
                          setSelectedColors((prev) =>
                            prev.includes(swatch.name)
                              ? prev.filter((c) => c !== swatch.name)
                              : [...prev, swatch.name]
                          )
                        }
                        className="flex flex-col items-center gap-1.5"
                      >
                        <span
                          className={`h-6 w-6 rounded-full border transition-all ${
                            isSelected
                              ? "ring-2 ring-[#0B1F3A] ring-offset-2 scale-110"
                              : "border-black/15 hover:scale-105"
                          }`}
                          style={{ backgroundColor: swatch.hex }}
                        />
                        <span className="text-[9px] text-[#20242B]/60 truncate max-w-full">
                          {swatch.name.split(" ")[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Price Slider */}
              <div className="space-y-3 pt-4 border-t border-[#20242B]/10">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-[#0B1F3A] font-semibold">
                  <span>Price Range</span>
                  <span className="font-mono text-xs">${priceMin} — ${priceMax}</span>
                </div>
                <input
                  type="range"
                  min={100}
                  max={1000}
                  step={25}
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="w-full accent-[#0B1F3A] cursor-pointer"
                />
              </div>

              {/* 4. Fabric / Material */}
              <div className="space-y-3 pt-4 border-t border-[#20242B]/10">
                <span className="text-[10px] uppercase tracking-[0.22em] text-[#0B1F3A] font-semibold block">
                  Material
                </span>
                <div className="flex flex-wrap gap-2">
                  {MATERIALS_LIST.slice(0, 6).map((mat) => {
                    const isSelected = selectedMaterials.includes(mat);
                    return (
                      <button
                        key={mat}
                        type="button"
                        onClick={() =>
                          setSelectedMaterials((prev) =>
                            prev.includes(mat) ? prev.filter((m) => m !== mat) : [...prev, mat]
                          )
                        }
                        className={`text-xs px-3 py-1.5 border transition-all ${
                          isSelected
                            ? "bg-[#0B1F3A] text-[#FAF8F5] border-[#0B1F3A]"
                            : "border-[#20242B]/15 text-[#20242B]/70 hover:border-[#0B1F3A]"
                        }`}
                      >
                        {mat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 5. Brand Atelier */}
              <div className="space-y-3 pt-4 border-t border-[#20242B]/10">
                <span className="text-[10px] uppercase tracking-[0.22em] text-[#0B1F3A] font-semibold block">
                  Atelier
                </span>
                <div className="space-y-2">
                  {BRANDS_LIST.map((brand) => (
                    <label
                      key={brand}
                      className="flex items-center gap-2.5 text-xs text-[#20242B]/80 hover:text-[#0B1F3A] cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() =>
                          setSelectedBrands((prev) =>
                            prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
                          )
                        }
                        className="accent-[#0B1F3A]"
                      />
                      <span>{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

            </div>

            {/* Drawer Bottom Actions */}
            <div className="p-6 border-t border-[#20242B]/10 flex items-center justify-between gap-4 bg-[#FAF8F5]">
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-xs uppercase tracking-[0.18em] text-[#20242B]/60 hover:text-[#0B1F3A] transition-colors"
              >
                Clear all
              </button>
              <button
                type="button"
                onClick={() => setFilterDrawerOpen(false)}
                className="flex-1 py-3.5 bg-[#0B1F3A] text-[#FAF8F5] text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#244B75] transition-colors text-center"
              >
                View {filteredProducts.length} Silhouettes
              </button>
            </div>

          </aside>
        </div>
      )}

      {/* ── 5. Quick View Modal ── */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onNotifyAddedToCart={(name, size) => {
          setToastNotification(`Added "${name}" (${size}) to Bag.`);
          setTimeout(() => setToastNotification(null), 3000);
        }}
      />

    </div>
  );
}

export default function CollectionsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center text-[#0B1F3A]">
          <div className="text-center space-y-3">
            <span className="font-serif text-2xl tracking-widest block font-light">
              MAINCHARACTER
            </span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#20242B]/40 font-mono">
              Loading Collection...
            </span>
          </div>
        </div>
      }
    >
      <CollectionsClientContent />
    </Suspense>
  );
}
