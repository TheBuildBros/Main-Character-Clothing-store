import { useMemo, useRef, useState } from "react";
import { ArrowDownUp, Check, ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { useLocation } from "wouter";
import { ProductCard, products } from "@/store/Storefront";

const categories = ["T-shirts", "Shirts", "Outerwear", "Bottoms", "Knitwear", "Accessories"];
const sizes = ["XS", "S", "M", "L", "XL", "One size"];
const colors = [
  { name: "Electric blue", hex: "#1e6bff" }, { name: "Ice white", hex: "#e6e9ee" },
  { name: "Ink black", hex: "#0b0f1a" }, { name: "Steel", hex: "#8a93a0" },
  { name: "Washed blue", hex: "#7896c9" }, { name: "Sky glow", hex: "#4fa3ff" },
  { name: "Platinum", hex: "#c9ced6" }, { name: "Deep blue", hex: "#0a3fcc" },
];
const PRICE_MIN = 1500;
const PRICE_MAX = 12000;

export default function Collections() {
  const [location, navigate] = useLocation();
  const params = new URLSearchParams(typeof window === "undefined" ? "" : window.location.search);
  const [category, setCategory] = useState(params.get("category") || "");
  const [size, setSize] = useState("");
  const [color, setColor] = useState(params.get("color") === "electric" ? "Electric blue" : "");
  const [maxPrice, setMaxPrice] = useState(PRICE_MAX);
  const [query, setQuery] = useState(params.get("q") || "");
  const [sort, setSort] = useState(params.get("sort") === "new" ? "new" : "featured");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const pendingTimer = useRef<number | null>(null);

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
    let list = products.filter(product =>
      (!category || product.category === category) &&
      (!size || product.sizes.includes(size)) &&
      (!color || product.color.toLowerCase() === color.toLowerCase()) &&
      product.price <= maxPrice &&
      (!query || `${product.name} ${product.category} ${product.color}`.toLowerCase().includes(query.toLowerCase()))
    );
    if (sort === "price-low") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-high") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "new") list = [...list].sort((a, b) => Number(Boolean(b.tag)) - Number(Boolean(a.tag)));
    return list;
  }, [category, size, color, maxPrice, query, sort]);
  const clear = () => {
    if (pendingTimer.current !== null) window.clearTimeout(pendingTimer.current);
    setPending(false);
    setCategory(""); setSize(""); setColor(""); setMaxPrice(PRICE_MAX); setQuery("");
    navigate("/collections");
  };
  const activeCount = Number(Boolean(category)) + Number(Boolean(size)) + Number(Boolean(color)) + Number(maxPrice < PRICE_MAX);

  return <div className="catalog-page">
    <div className="catalog-intro"><div className="breadcrumbs">HOME <span>/</span> SHOP ALL</div><span className="eyebrow">THE MAIN CHARACTER WARDROBE</span><h1>Pieces with<br className="mobile-only" /> a point of view.</h1><p>Considered fits, good fabric, room to be yourself.</p></div>
    <div className="catalog-toolbar"><button className={`filter-trigger ${filtersOpen ? "active" : ""}`} onClick={() => setFiltersOpen(value => !value)}><SlidersHorizontal size={16} /> Filters {activeCount > 0 && <span className="filter-count">{activeCount}</span>}<ChevronDown size={14} /></button><label className="catalog-search"><input placeholder="Find your piece" value={query} onChange={event => changed(setQuery, event.target.value)} aria-label="Search products" /><span>⌕</span></label><span className="catalog-count">{filtered.length} PIECES</span><label className="sort-select"><ArrowDownUp size={14} /><select value={sort} onChange={event => setSort(event.target.value)} aria-label="Sort products"><option value="featured">Featured</option><option value="new">New in</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select></label></div>
    {filtersOpen && <div className="filter-panel"><div className="filter-panel-heading"><div><span className="eyebrow">MAKE IT YOURS</span><h2>Filter pieces</h2></div><button className="icon-button" onClick={() => setFiltersOpen(false)} aria-label="Close filters"><X size={20} /></button></div>
      <div className="filter-groups">
        <div className="filter-group"><h3>Category</h3><div className="filter-options">{categories.map(item => <button key={item} className={`filter-chip ${category === item ? "selected" : ""}`} onClick={() => changed(setCategory, category === item ? "" : item)}>{item}{category === item && <Check size={13} />}</button>)}</div></div>
        <div className="filter-group"><h3>Size</h3><div className="filter-options size-options">{sizes.map(item => <button key={item} className={`size-chip ${size === item ? "selected" : ""}`} onClick={() => changed(setSize, size === item ? "" : item)}>{item}</button>)}</div></div>
        <div className="filter-group"><h3>Color</h3><div className="filter-options color-options">{colors.map(item => <button key={item.name} className={`color-filter ${color === item.name ? "selected" : ""}`} onClick={() => changed(setColor, color === item.name ? "" : item.name)} aria-label={item.name} title={item.name}><i style={{ backgroundColor: item.hex }} />{color === item.name && <Check size={13} />}</button>)}</div></div>
        <div className="filter-group price-filter"><div className="price-label"><h3>Price</h3><span>Up to ₹{maxPrice.toLocaleString("en-IN")}</span></div><input type="range" min={PRICE_MIN} max={PRICE_MAX} step="100" value={maxPrice} onChange={event => { setMaxPrice(Number(event.target.value)); showLoadingBriefly(); }} aria-label="Maximum price" /><div className="price-range-labels"><span>₹1,500</span><span>₹12,000+</span></div></div>
      </div>
      <div className="filter-panel-footer"><button className="text-link" onClick={clear}>Clear all</button><button className="button-primary" onClick={() => setFiltersOpen(false)}>Show {filtered.length} pieces <ArrowDownUp size={15} /></button></div>
    </div>}
    <div className="active-filters">{category && <button onClick={() => setCategory("")}>{category}<X size={13} /></button>}{size && <button onClick={() => setSize("")}>Size {size}<X size={13} /></button>}{color && <button onClick={() => setColor("")}>{color}<X size={13} /></button>}{maxPrice < PRICE_MAX && <button onClick={() => setMaxPrice(PRICE_MAX)}>Up to ₹{maxPrice.toLocaleString("en-IN")}<X size={13} /></button>}{(activeCount > 0 || query) && <button className="clear-filters" onClick={clear}>Clear all</button>}</div>
    {pending ? <div className="product-grid catalog-grid" aria-live="polite">{Array.from({ length: 4 }).map((_, index) => <div className="skeleton-card" key={index}><div className="skeleton-image" /><div className="skeleton-line" /><div className="skeleton-line short" /></div>)}</div> : filtered.length ? <div className="product-grid catalog-grid" aria-live="polite">{filtered.map(product => <ProductCard key={product.id} product={product} />)}</div> : <div className="empty-results"><span className="empty-symbol">∅</span><h2>No pieces in this edit.</h2><p>Try a different size, color or price range.</p><button className="button-primary" onClick={clear}>Reset filters</button></div>}
    <div className="catalog-note"><span>MADE TO BE WORN, NOT KEPT.</span><span>Thoughtful choices. Everyday ease.</span></div>
  </div>;
}
