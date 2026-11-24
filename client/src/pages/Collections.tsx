import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { Link, useLocation, useParams } from "wouter";
import { ProductCard, products, type Product } from "@/store/Storefront";
import { FilterPanel, PRICE_MAX, sortOptions } from "@/components/FilterPanel";

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
      return product.tag?.toLowerCase() === "flash sale";
    default:
      return product.tag?.toLowerCase() === s;
  }
}

export default function Collections() {
  const [location, navigate] = useLocation();
  const routeParams = useParams<{ category?: string; tag?: string }>();
  const routeCategorySlug = routeParams?.category;
  const routeTagSlug = routeParams?.tag;

  const params = new URLSearchParams(typeof window === "undefined" ? "" : window.location.search);
  const [category, setCategory] = useState(params.get("category") || "");
  const [size, setSize] = useState(params.get("size") || "");
  const [color, setColor] = useState(params.get("color") === "electric" ? "Electric blue" : (params.get("color") || ""));
  const [maxPrice, setMaxPrice] = useState(params.get("price") ? Number(params.get("price")) : PRICE_MAX);
  const [query, setQuery] = useState(params.get("q") || "");
  const [sort, setSort] = useState(params.get("sort") === "new" ? "new" : "featured");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const pendingTimer = useRef<number | null>(null);

  useEffect(() => {
    const currentParams = new URLSearchParams(window.location.search);
    if (currentParams.has("category")) setCategory(currentParams.get("category") || "");
    if (currentParams.has("size")) setSize(currentParams.get("size") || "");
    if (currentParams.has("color")) setColor(currentParams.get("color") === "electric" ? "Electric blue" : (currentParams.get("color") || ""));
    if (currentParams.has("price")) setMaxPrice(Number(currentParams.get("price")) || PRICE_MAX);
    if (currentParams.has("q")) setQuery(currentParams.get("q") || "");
    if (currentParams.has("sort")) setSort(currentParams.get("sort") || "featured");
  }, [location]);

  const showLoadingBriefly = () => {
    if (pendingTimer.current !== null) window.clearTimeout(pendingTimer.current);
    setPending(true);
    pendingTimer.current = window.setTimeout(() => {
      setPending(false);
      pendingTimer.current = null;
    }, 180);
  };

  const changed = (setter: (value: string) => void, value: string) => {
    setter(value);
    showLoadingBriefly();
  };

  const filtered = useMemo(() => {
    let list = products.filter((product) => {
      // 1. Route category slug (from /shop/:category)
      if (routeCategorySlug && !matchCategorySlug(routeCategorySlug, product)) {
        return false;
      }
      // 2. Route tag slug (from /limited/:tag)
      if (routeTagSlug && !matchTagSlug(routeTagSlug, product)) {
        return false;
      }
      // 3. Optional UI / Query parameter filters
      if (category && product.category !== category) {
        return false;
      }
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
    if (sort === "new") list = [...list].sort((a, b) => Number(Boolean(b.tag)) - Number(Boolean(a.tag)));
    return list;
  }, [routeCategorySlug, routeTagSlug, category, size, color, maxPrice, query, sort]);

  const clear = () => {
    if (pendingTimer.current !== null) window.clearTimeout(pendingTimer.current);
    setPending(false);
    setCategory("");
    setSize("");
    setColor("");
    setMaxPrice(PRICE_MAX);
    setQuery("");
    setSort("featured");
    navigate("/collections");
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
    <div className="catalog-page">
      <div className="catalog-intro">
        <div className="breadcrumbs">{intro.breadcrumbs}</div>
        <span className="eyebrow">{intro.eyebrow}</span>
        <h1>{intro.heading}</h1>
        <p>{intro.sub}</p>
      </div>

      <div className="catalog-toolbar">
        <button
          className={`filter-trigger ${filtersOpen ? "active" : ""}`}
          onClick={() => setFiltersOpen((value) => !value)}
        >
          <SlidersHorizontal size={16} /> Filters{" "}
          {activeCount > 0 && <span className="filter-count">{activeCount}</span>}
          <ChevronDown size={14} />
        </button>
        <span className="catalog-count ml-auto">{filtered.length} PIECES</span>
      </div>

      {filtersOpen && (
        <FilterPanel
          category={category}
          size={size}
          color={color}
          maxPrice={maxPrice}
          sort={sort}
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
      )}

      <div className="active-filters">
        {sort && sort !== "featured" && (
          <button onClick={() => changed(setSort, "featured")}>
            Sort: {sortOptions.find((s) => s.value === sort)?.label || sort}
            <X size={13} />
          </button>
        )}
        {category && <button onClick={() => setCategory("")}>{category}<X size={13} /></button>}
        {size && <button onClick={() => setSize("")}>Size {size}<X size={13} /></button>}
        {color && <button onClick={() => setColor("")}>{color}<X size={13} /></button>}
        {maxPrice < PRICE_MAX && (
          <button onClick={() => setMaxPrice(PRICE_MAX)}>
            Up to ₹{maxPrice.toLocaleString("en-IN")}<X size={13} />
          </button>
        )}
        {query && (
          <button onClick={() => setQuery("")}>
            Search: "{query}"<X size={13} />
          </button>
        )}
        {(activeCount > 0 || query) && (
          <button className="clear-filters" onClick={clear}>Clear all</button>
        )}
      </div>

      {pending ? (
        <div className="product-grid catalog-grid" aria-live="polite">
          {Array.from({ length: 4 }).map((_, index) => (
            <div className="skeleton-card" key={index}>
              <div className="skeleton-image" />
              <div className="skeleton-line" />
              <div className="skeleton-line short" />
            </div>
          ))}
        </div>
      ) : filtered.length ? (
        <div className="product-grid catalog-grid" aria-live="polite">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="empty-results">
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
            <button className="button-primary" onClick={clear}>
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
