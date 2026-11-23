import { Check, X, ArrowDownUp } from "lucide-react";

export const categories = [
  "T-shirts",
  "Shirts",
  "Outerwear",
  "Bottoms",
  "Knitwear",
  "Accessories",
];

export const sizes = ["XS", "S", "M", "L", "XL", "One size"];

export const colors = [
  { name: "Electric blue", hex: "#1e6bff" },
  { name: "Ice white", hex: "#e6e9ee" },
  { name: "Ink black", hex: "#0b0f1a" },
  { name: "Steel", hex: "#8a93a0" },
  { name: "Washed blue", hex: "#7896c9" },
  { name: "Sky glow", hex: "#4fa3ff" },
  { name: "Platinum", hex: "#c9ced6" },
  { name: "Deep blue", hex: "#0a3fcc" },
];

export const PRICE_MIN = 1500;
export const PRICE_MAX = 12000;

export interface FilterPanelProps {
  category: string;
  size: string;
  color: string;
  maxPrice: number;
  onCategoryChange: (category: string) => void;
  onSizeChange: (size: string) => void;
  onColorChange: (color: string) => void;
  onPriceChange: (maxPrice: number) => void;
  onClear: () => void;
  onClose?: () => void;
  onApply?: () => void;
  totalPieces?: number;
  isDrawer?: boolean;
}

export function buildFilterUrl(filters: {
  category?: string;
  size?: string;
  color?: string;
  maxPrice?: number;
  price?: number;
  q?: string;
  sort?: string;
}): string {
  const params = new URLSearchParams();
  const effectivePrice = filters.price ?? filters.maxPrice;

  if (filters.category) params.set("category", filters.category);
  if (filters.size) params.set("size", filters.size);
  if (filters.color) params.set("color", filters.color);
  if (effectivePrice && effectivePrice < PRICE_MAX) {
    params.set("price", String(effectivePrice));
  }
  if (filters.q) params.set("q", filters.q);
  if (filters.sort && filters.sort !== "featured") {
    params.set("sort", filters.sort);
  }

  const qs = params.toString();
  return qs ? `/collections?${qs}` : "/collections";
}

export function FilterPanel({
  category,
  size,
  color,
  maxPrice,
  onCategoryChange,
  onSizeChange,
  onColorChange,
  onPriceChange,
  onClear,
  onClose,
  onApply,
  totalPieces,
  isDrawer = false,
}: FilterPanelProps) {
  if (isDrawer) {
    return (
      <div className="space-y-4 text-xs">
        {/* Category */}
        <div className="filter-group space-y-2">
          <h3 className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground">
            Category
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                className={`filter-chip text-[10px] px-2.5 py-1 rounded-sm border transition-colors ${
                  category === item
                    ? "bg-[#1e6bff] border-[#1e6bff] text-white"
                    : "border-black/10 dark:border-white/10 text-foreground hover:border-[#1e6bff]"
                }`}
                onClick={() => onCategoryChange(category === item ? "" : item)}
              >
                <span>{item}</span>
                {category === item && <Check size={11} className="ml-1" />}
              </button>
            ))}
          </div>
        </div>

        {/* Size */}
        <div className="filter-group space-y-2">
          <h3 className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground">
            Size
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {sizes.map((item) => (
              <button
                key={item}
                type="button"
                className={`size-chip min-w-8 h-7 text-[10px] px-2 flex items-center justify-center rounded-sm border transition-colors ${
                  size === item
                    ? "bg-[#1e6bff] border-[#1e6bff] text-white"
                    : "border-black/10 dark:border-white/10 text-foreground hover:border-[#1e6bff]"
                }`}
                onClick={() => onSizeChange(size === item ? "" : item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Color */}
        <div className="filter-group space-y-2">
          <h3 className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground">
            Color
          </h3>
          <div className="flex flex-wrap gap-2">
            {colors.map((item) => (
              <button
                key={item.name}
                type="button"
                className={`color-filter w-6 h-6 rounded-full border flex items-center justify-center relative transition-all ${
                  color === item.name
                    ? "outline outline-2 outline-offset-1 outline-[#1e6bff] border-[#1e6bff]"
                    : "border-black/10 dark:border-white/10"
                }`}
                onClick={() => onColorChange(color === item.name ? "" : item.name)}
                aria-label={item.name}
                title={item.name}
              >
                <i
                  className="w-3.5 h-3.5 rounded-full block border border-black/10"
                  style={{ backgroundColor: item.hex }}
                />
                {color === item.name && (
                  <Check
                    size={11}
                    className="absolute inset-0 m-auto text-black dark:text-white drop-shadow"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Price */}
        <div className="filter-group price-filter space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <h3 className="font-bold tracking-widest uppercase text-muted-foreground">
              Price
            </h3>
            <span className="font-medium text-foreground">
              Up to ₹{maxPrice.toLocaleString("en-IN")}
            </span>
          </div>
          <input
            type="range"
            min={PRICE_MIN}
            max={PRICE_MAX}
            step="100"
            value={maxPrice}
            onChange={(event) => onPriceChange(Number(event.target.value))}
            aria-label="Maximum price"
            className="w-full accent-[#1e6bff]"
          />
          <div className="flex justify-between text-[9px] text-muted-foreground">
            <span>₹1,500</span>
            <span>₹12,000+</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-black/10 dark:border-white/10">
          <button
            type="button"
            className="text-[11px] text-muted-foreground hover:text-[#1e6bff] transition-colors"
            onClick={onClear}
          >
            Clear all
          </button>
          <button
            type="button"
            className="button-primary px-3 py-1.5 text-[11px] font-semibold bg-[#1e6bff] hover:bg-[#0a3fcc] text-white rounded-sm flex items-center gap-1.5 transition-colors"
            onClick={onApply}
          >
            <span>Apply Filters</span>
            <ArrowDownUp size={12} />
          </button>
        </div>
      </div>
    );
  }

  // Desktop / Collections Page Panel
  return (
    <div className="filter-panel">
      <div className="filter-panel-heading">
        <div>
          <span className="eyebrow">MAKE IT YOURS</span>
          <h2>Filter pieces</h2>
        </div>
        {onClose && (
          <button
            className="icon-button"
            onClick={onClose}
            aria-label="Close filters"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <div className="filter-groups">
        {/* Category */}
        <div className="filter-group">
          <h3>Category</h3>
          <div className="filter-options">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                className={`filter-chip ${category === item ? "selected" : ""}`}
                onClick={() => onCategoryChange(category === item ? "" : item)}
              >
                {item}
                {category === item && <Check size={13} />}
              </button>
            ))}
          </div>
        </div>

        {/* Size */}
        <div className="filter-group">
          <h3>Size</h3>
          <div className="filter-options size-options">
            {sizes.map((item) => (
              <button
                key={item}
                type="button"
                className={`size-chip ${size === item ? "selected" : ""}`}
                onClick={() => onSizeChange(size === item ? "" : item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Color */}
        <div className="filter-group">
          <h3>Color</h3>
          <div className="filter-options color-options">
            {colors.map((item) => (
              <button
                key={item.name}
                type="button"
                className={`color-filter ${color === item.name ? "selected" : ""}`}
                onClick={() => onColorChange(color === item.name ? "" : item.name)}
                aria-label={item.name}
                title={item.name}
              >
                <i style={{ backgroundColor: item.hex }} />
                {color === item.name && <Check size={13} />}
              </button>
            ))}
          </div>
        </div>

        {/* Price */}
        <div className="filter-group price-filter">
          <div className="price-label">
            <h3>Price</h3>
            <span>Up to ₹{maxPrice.toLocaleString("en-IN")}</span>
          </div>
          <input
            type="range"
            min={PRICE_MIN}
            max={PRICE_MAX}
            step="100"
            value={maxPrice}
            onChange={(event) => onPriceChange(Number(event.target.value))}
            aria-label="Maximum price"
          />
          <div className="price-range-labels">
            <span>₹1,500</span>
            <span>₹12,000+</span>
          </div>
        </div>
      </div>

      <div className="filter-panel-footer">
        <button type="button" className="text-link" onClick={onClear}>
          Clear all
        </button>
        {onClose && (
          <button type="button" className="button-primary" onClick={onClose}>
            {totalPieces !== undefined
              ? `Show ${totalPieces} pieces `
              : "Apply "}
            <ArrowDownUp size={15} />
          </button>
        )}
      </div>
    </div>
  );
}
