import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { Link, useLocation, useParams, useSearch } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { ProductCard, products, type Product } from "@/store/Storefront";
import {
  categories as defaultCategories,
  colors as defaultColors,
  FilterPanel,
  PRICE_MAX,
  sizes as defaultSizes,
  sortOptions,
} from "@/components/FilterPanel";
import { ScrollReveal, StaggerGrid, StaggerItem } from "@/components/MotionPrimitives";

const CATEGORY_BAR_LINKS = [
  { label: "All", href: "/collections", slug: "" },
  { label: "Shirts", href: "/shop/shirts", slug: "shirts" },
  { label: "T-Shirts", href: "/shop/t-shirts", slug: "t-shirts" },
  { label: "Jerseys", href: "/shop/jerseys", slug: "jerseys" },
  { label: "Jeans", href: "/shop/jeans", slug: "jeans" },
  { label: "Bottoms", href: "/shop/other-bottoms", slug: "other-bottoms" },
  { label: "Outerwear", href: "/shop/outerwear", slug: "outerwear" },
  { label: "Knitwear", href: "/shop/knitwear", slug: "knitwear" },
  { label: "Accessories", href: "/shop/accessories", slug: "accessories" },
];

function matchCategorySlug(slug: string, product: Product): boolean {
  const s = slug.toLowerCase();
  switch (s) {
    case "jeans":
      return product.category.toLowerCase() === "bottoms" && /denim|jean/i.test(product.name);
    case "other-bottoms":
      return product.category.toLowerCase() === "bottoms" && !/denim|jean/i.test(product.name);
    case "bottoms":
      return product.category.toLowerCase() === "bottoms";
    case "shirts":
      return product.category.toLowerCase() === "shirts";
    case "t-shirts":
    case "tshirts":
    case "tees":
      return product.category.toLowerCase() === "t-shirts";
    case "jerseys":
      return /jersey/i.test(product.name) || /jersey/i.test(product.category);
    case "jackets":
    case "outerwear":
      return product.category.toLowerCase() === "outerwear";
    case "accessories":
      return product.category.toLowerCase() === "accessories";
    case "knitwear":
      return product.category.toLowerCase() === "knitwear";
    default:
      return product.category.toLowerCase() === s;
  }
}

function matchTagSlug(tagSlug: string, product: Product): boolean {
  const s = tagSlug.toLowerCase();
  switch (s) {
    case "all":
      return true;
    case "new-drops":
      return product.tag?.toLowerCase() === "new arrival";
    case "editions":
      return product.tag?.toLowerCase() === "limited";
    case "flash-sale":
      return (
        product.tag?.toLowerCase() === "flash sale" ||
        Boolean(product.compareAtPrice && product.compareAtPrice > product.price)
      );
    default:
      return product.tag?.toLowerCase() === s;
  }
}

function normalizeColorParam(raw: string | null): string {
  if (!raw) return "";
  return raw.toLowerCase() === "electric" ? "Electric blue" : raw;
}

export default function Collections() {
  const [location, navigate] = useLocation();
  const searchString = useSearch();
  const routeParams = useParams<{ category?: string; tag?: string }>();
  const routeCategorySlug = routeParams?.category;
  const routeTagSlug = routeParams?.tag;

  const initialParams = new URLSearchParams(searchString || "");
  const [category, setCategory] = useState(initialParams.get("category") || "");
  const [size, setSize] = useState(initialParams.get("size") || "");
  const [color, setColor] = useState(normalizeColorParam(initialParams.get("color")));
  const [maxPrice, setMaxPrice] = useState(
    initialParams.get("price") ? Number(initialParams.get("price")) : PRICE_MAX
  );
  const [query, setQuery] = useState(initialParams.get("q") || "");
  const [sort, setSort] = useState(initialParams.get("sort") || "featured");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const pendingTimer = useRef<number | null>(null);

  // Sync filter state whenever route path or query string changes (clearing stale values)
  useEffect(() => {
    const currentParams = new URLSearchParams(searchString || "");
    setCategory(routeCategorySlug ? "" : currentParams.get("category") || "");
    setSize(currentParams.get("size") || "");
    setColor(normalizeColorParam(currentParams.get("color")));
    setMaxPrice(
      currentParams.get("price") ? Number(currentParams.get("price")) : PRICE_MAX
    );
    setQuery(currentParams.get("q") || "");
    setSort(currentParams.get("sort") || "featured");
  }, [location, searchString, routeCategorySlug, routeTagSlug]);

  const showLoadingBriefly = () => {
    if (pendingTimer.current !== null) window.clearTimeout(pendingTimer.current);
    setPending(true);
    pendingTimer.current = window.setTimeout(() => {
      setPending(false);
      pendingTimer.current = null;
    }, 150);
  };

  const changed = (setter: (value: string) => void, value: string) => {
    setter(value);
    showLoadingBriefly();
  };

  // Scope products by route slug + category first so filters adapt dynamically
  const categoryScopedProducts = useMemo(() => {
    return products.filter((product) => {
      if (routeCategorySlug && !matchCategorySlug(routeCategorySlug, product)) {
        return false;
      }
      if (routeTagSlug && !matchTagSlug(routeTagSlug, product)) {
        return false;
      }
      if (!routeCategorySlug && category && product.category.toLowerCase() !== category.toLowerCase()) {
        return false;
      }
      return true;
    });
  }, [routeCategorySlug, routeTagSlug, category]);

  // Dynamic context-aware options derived from active category/collection
  const availableCategories = useMemo(() => {
    const scope = products.filter((p) => {
      if (routeTagSlug && !matchTagSlug(routeTagSlug, p)) return false;
      return true;
    });
    const present = new Set(scope.map((p) => p.category));
    const ordered = defaultCategories.filter((c) => present.has(c));
    return ordered.length ? ordered : defaultCategories;
  }, [routeTagSlug]);

  const availableSizes = useMemo(() => {
    const present = new Set<string>();
    categoryScopedProducts.forEach((p) => p.sizes.forEach((s) => present.add(s)));
    const ordered = defaultSizes.filter((s) => present.has(s));
    return ordered.length ? ordered : defaultSizes;
  }, [categoryScopedProducts]);

  const availableColors = useMemo(() => {
    const map = new Map<string, string>();
    categoryScopedProducts.forEach((p) => {
      if (!map.has(p.color)) map.set(p.color, p.colorHex);
    });
    if (!map.size) return defaultColors;
    const fromDefaults = defaultColors.filter((c) => map.has(c.name));
    const extras = Array.from(map.entries())
      .filter(([name]) => !defaultColors.some((d) => d.name === name))
      .map(([name, hex]) => ({ name, hex }));
    return [...fromDefaults, ...extras];
  }, [categoryScopedProducts]);

  // Reset incompatible size/color when category scope changes
  useEffect(() => {
    if (size && !availableSizes.includes(size)) {
      setSize("");
    }
    if (
      color &&
      !availableColors.some((c) => c.name.toLowerCase() === color.toLowerCase())
    ) {
      setColor("");
    }
  }, [availableSizes, availableColors, size, color]);

  const filtered = useMemo(() => {
    let list = categoryScopedProducts.filter((product) => {
      if (size && !product.sizes.includes(size)) {
        return false;
      }
      if (color && product.color.toLowerCase() !== color.toLowerCase()) {
        return false;
      }
      if (product.price > maxPrice) {
        return false;
      }
      if (
        query &&
        !`${product.name} ${product.category} ${product.color}`
          .toLowerCase()
          .includes(query.toLowerCase())
      ) {
        return false;
      }
      return true;
    });

    if (sort === "price-low") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-high") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "new")
      list = [...list].sort((a, b) => Number(Boolean(b.tag)) - Number(Boolean(a.tag)));
    return list;
  }, [categoryScopedProducts, size, color, maxPrice, query, sort]);

  const clear = () => {
    if (pendingTimer.current !== null) window.clearTimeout(pendingTimer.current);
    setPending(false);
    setCategory("");
    setSize("");
    setColor("");
    setMaxPrice(PRICE_MAX);
    setQuery("");
    setSort("featured");
    if (routeCategorySlug || routeTagSlug) {
      navigate(location.split("?")[0] || "/collections");
    } else {
      navigate("/collections");
    }
  };

  const activeCount =
    Number(Boolean(category)) +
    Number(Boolean(size)) +
    Number(Boolean(color)) +
    Number(maxPrice < PRICE_MAX) +
    Number(sort !== "featured");

  const getIntroDetails = () => {
    if (routeCategorySlug) {
      const title = routeCategorySlug.replace(/-/g, " ");
      return {
        breadcrumbs: `HOME / SHOP / ${title.toUpperCase()}`,
        eyebrow: "主人公 ESSENTIALS",
        heading: title.charAt(0).toUpperCase() + title.slice(1),
        sub: `Pieces from the ${title} collection.`,
      };
    }
    if (routeTagSlug) {
      const title = routeTagSlug.replace(/-/g, " ");
      return {
        breadcrumbs: `HOME / LIMITED / ${title.toUpperCase()}`,
        eyebrow: "主人公 LIMITED",
        heading: title.charAt(0).toUpperCase() + title.slice(1),
        sub: `Pieces from the limited ${title} drop.`,
      };
    }
    return {
      breadcrumbs: "HOME / SHOP ALL",
      eyebrow: "主人公のワードローブ",
      heading: "Pieces with a point of view.",
      sub: "Considered fits, good fabric, room to be yourself.",
    };
  };

  const intro = getIntroDetails();

  return (
    <div className="catalog-page max-w-7xl mx-auto">
      <ScrollReveal>
        <div className="catalog-intro">
          <div className="breadcrumbs">
            <Link href="/" className="hover:text-[var(--blue)] transition-colors">
              HOME
            </Link>{" "}
            <span>/</span>{" "}
            {intro.breadcrumbs.replace(/^HOME\s*\/\s*/, "")}
          </div>
          <span className="glass-pill px-4 py-1.5 rounded-full eyebrow">
            {intro.eyebrow}
          </span>
          <h1>{intro.heading}</h1>
          <p>{intro.sub}</p>
        </div>
      </ScrollReveal>

      {/* Quick Category Switcher */}
      <nav
        aria-label="Collection categories"
        className="flex items-center gap-2 overflow-x-auto pb-3 mb-3 no-scrollbar"
      >
        {CATEGORY_BAR_LINKS.map((item) => {
          const isAll = !item.slug && !routeCategorySlug && !routeTagSlug && !category;
          const isActive =
            isAll ||
            (Boolean(item.slug) && routeCategorySlug?.toLowerCase() === item.slug) ||
            (Boolean(item.slug) && !routeCategorySlug && category.toLowerCase() === item.label.toLowerCase());

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`shrink-0 px-4 py-2 rounded-full font-display text-[11px] font-bold uppercase tracking-wider transition-all border ${
                isActive
                  ? "bg-gradient-to-r from-[#0047ff] to-[#0095ff] border-transparent text-white shadow-[0_6px_18px_rgba(0,87,255,0.3)]"
                  : "bg-[var(--glass-bg)] border-[var(--glass-border)] text-[var(--text)] hover:border-[var(--blue)] hover:text-[var(--blue)]"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="catalog-toolbar">
        <button
          type="button"
          className={`filter-trigger ${filtersOpen ? "active" : ""}`}
          onClick={() => setFiltersOpen((value) => !value)}
          aria-expanded={filtersOpen}
        >
          <SlidersHorizontal size={16} /> Filters{" "}
          {activeCount > 0 && <span className="filter-count">{activeCount}</span>}
          <ChevronDown
            size={14}
            className={`transition-transform duration-200 ${filtersOpen ? "rotate-180" : ""}`}
          />
        </button>
        <span className="catalog-count ml-auto">{filtered.length} PIECES</span>
      </div>

      <AnimatePresence>
        {filtersOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <FilterPanel
              category={category}
              size={size}
              color={color}
              maxPrice={maxPrice}
              sort={sort}
              availableCategories={availableCategories}
              availableSizes={availableSizes}
              availableColors={availableColors}
              hideCategoryFilter={Boolean(routeCategorySlug)}
              onCategoryChange={(val) => changed(setCategory, val)}
              onSizeChange={(val) => changed(setSize, val)}
              onColorChange={(val) => changed(setColor, val)}
              onPriceChange={(val) => {
                setMaxPrice(val);
                showLoadingBriefly();
              }}
              onSortChange={(val) => changed(setSort, val)}
              onClear={clear}
              onClose={() => setFiltersOpen(false)}
              totalPieces={filtered.length}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="active-filters">
        {sort && sort !== "featured" && (
          <button type="button" onClick={() => changed(setSort, "featured")}>
            Sort: {sortOptions.find((s) => s.value === sort)?.label || sort}
            <X size={13} />
          </button>
        )}
        {category && (
          <button type="button" onClick={() => setCategory("")}>
            {category}
            <X size={13} />
          </button>
        )}
        {size && (
          <button type="button" onClick={() => setSize("")}>
            Size {size}
            <X size={13} />
          </button>
        )}
        {color && (
          <button type="button" onClick={() => setColor("")}>
            {color}
            <X size={13} />
          </button>
        )}
        {maxPrice < PRICE_MAX && (
          <button type="button" onClick={() => setMaxPrice(PRICE_MAX)}>
            Up to ₹{maxPrice.toLocaleString("en-IN")}
            <X size={13} />
          </button>
        )}
        {query && (
          <button type="button" onClick={() => setQuery("")}>
            Search: "{query}"
            <X size={13} />
          </button>
        )}
        {(activeCount > 0 || query) && (
          <button type="button" className="clear-filters" onClick={clear}>
            Clear all
          </button>
        )}
      </div>

      {pending ? (
        <div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 pt-4"
          aria-live="polite"
        >
          {Array.from({ length: 4 }).map((_, index) => (
            <div className="skeleton-card" key={index}>
              <div className="skeleton-image" />
              <div className="skeleton-line" />
              <div className="skeleton-line short" />
            </div>
          ))}
        </div>
      ) : filtered.length ? (
        <StaggerGrid className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 pt-4">
          {filtered.map((product) => (
            <StaggerItem key={product.id}>
              <ProductCard product={product} />
            </StaggerItem>
          ))}
        </StaggerGrid>
      ) : (
        <div className="empty-results mt-4">
          <span className="empty-symbol">∅</span>
          <h2>
            {routeCategorySlug || routeTagSlug
              ? "No pieces here yet. Check back soon."
              : "No pieces in this edit."}
          </h2>
          <p>
            {routeCategorySlug || routeTagSlug
              ? "Check back soon for upcoming drops and additions to this edit."
              : "Try a different size, color or price range."}
          </p>
          {routeCategorySlug || routeTagSlug ? (
            <Link href="/collections" className="button-primary inline-flex items-center gap-2">
              View all pieces
            </Link>
          ) : (
            <button type="button" className="button-primary" onClick={clear}>
              Reset filters
            </button>
          )}
        </div>
      )}

      <div className="catalog-note">
        <span>MADE TO BE WORN, NOT KEPT.</span>
        <span>Thoughtful choices. Everyday ease.</span>
      </div>
    </div>
  );
}
