import { Check, X, ArrowDownUp } from "lucide-react";

export const categories = [
  "T-shirts",
  "Shirts",
  "Jerseys",
  "Outerwear",
  "Bottoms",
  "Knitwear",
  "Accessories",
];

export const sizes = ["XS", "S", "M", "L", "XL", "One size"];

export const colors = [
  { name: "Electric blue", hex: "#0057ff" },
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

export const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "new", label: "New in" },
  { value: "price-low", label: "Price: low to high" },
  { value: "price-high", label: "Price: high to low" },
];

export interface FilterPanelProps {
  category: string;
  size: string;
  color: string;
  maxPrice: number;
  sort?: string;
  availableCategories?: string[];
  availableSizes?: string[];
  availableColors?: { name: string; hex: string }[];
  hideCategoryFilter?: boolean;
  onCategoryChange: (category: string) => void;
  onSizeChange: (size: string) => void;
  onColorChange: (color: string) => void;
  onPriceChange: (maxPrice: number) => void;
  onSortChange?: (sort: string) => void;
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
  sort = "featured",
  availableCategories = categories,
  availableSizes = sizes,
  availableColors = colors,
  hideCategoryFilter = false,
  onCategoryChange,
  onSizeChange,
  onColorChange,
  onPriceChange,
  onSortChange,
  onClear,
  onClose,
  onApply,
  totalPieces,
  isDrawer = false,
}: FilterPanelProps) {
  if (isDrawer) {
    return (
      <div className="space-y-4 text-xs">
        {/* Sort */}
        <div className="filter-group space-y-2">
          <h3 className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground">
            Sort by
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {sortOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`filter-chip text-[10px] px-2.5 py-1 rounded-full border transition-colors ${
                  sort === opt.value
                    ? "bg-gradient-to-r from-[#0047ff] to-[#0095ff] border-transparent text-white shadow-sm"
                    : "border-[#0057ff]/15 text-foreground hover:border-[#0057ff] dark:hover:border-[#6cb8ff]"
                }`}
                onClick={() =>
                  onSortChange?.(
                    sort === opt.value && opt.value !== "featured"
                      ? "featured"
                      : opt.value
                  )
                }
              >
                <span>{opt.label}</span>
                {sort === opt.value && <Check size={11} className="ml-1" />}
              </button>
            ))}
          </div>
        </div>

        {/* Category */}
        {!hideCategoryFilter && (
          <div className="filter-group space-y-2">
            <h3 className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground">
              Category
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {availableCategories.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`filter-chip text-[10px] px-2.5 py-1 rounded-full border transition-colors ${
                    category === item
                      ? "bg-gradient-to-r from-[#0047ff] to-[#0095ff] border-transparent text-white shadow-sm"
                      : "border-[#0057ff]/15 text-foreground hover:border-[#0057ff] dark:hover:border-[#6cb8ff]"
                  }`}
                  onClick={() => onCategoryChange(category === item ? "" : item)}
                >
                  <span>{item}</span>
                  {category === item && <Check size={11} className="ml-1" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Size */}
        <div className="filter-group space-y-2">
          <h3 className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground">
            Size
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {availableSizes.map((item) => (
              <button
                key={item}
                type="button"
                className={`size-chip min-w-8 h-7 text-[10px] px-2 flex items-center justify-center rounded-full border transition-colors ${
                  size === item
                    ? "bg-gradient-to-r from-[#0047ff] to-[#0095ff] border-transparent text-white shadow-sm"
                    : "border-[#0057ff]/15 text-foreground hover:border-[#0057ff] dark:hover:border-[#6cb8ff]"
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
            {availableColors.map((item) => (
              <button
                key={item.name}
                type="button"
                className={`color-filter w-7 h-7 rounded-full border flex items-center justify-center relative transition-all ${
                  color === item.name
                    ? "outline outline-2 outline-offset-1 outline-[#0057ff] border-[#0057ff]"
                    : "border-[#0057ff]/20 dark:border-white/20"
                }`}
                onClick={() => onColorChange(color === item.name ? "" : item.name)}
                aria-label={item.name}
                title={item.name}
              >
                <i
                  className="w-4 h-4 rounded-full block border border-black/15"
                  style={{ backgroundColor: item.hex }}
                />
                {color === item.name && (
                  <Check
                    size={11}
                    className="absolute inset-0 m-auto text-[#071430] bg-white/85 rounded-full p-0.5"
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
            className="w-full accent-[#0057ff]"
          />
          <div className="flex justify-between text-[9px] text-muted-foreground">
            <span>₹1,500</span>
            <span>₹12,000+</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-[var(--line)]">
          <button
            type="button"
            className="text-[11px] font-semibold text-muted-foreground hover:text-[#0057ff] dark:hover:text-[#6cb8ff] transition-colors"
            onClick={onClear}
          >
            Clear all
          </button>
          <button
            type="button"
            className="btn-electric px-4 py-2 text-[11px] font-bold rounded-full flex items-center gap-1.5"
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
            type="button"
            className="icon-button"
            onClick={onClose}
            aria-label="Close filters"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <div className="filter-groups">
        {/* Sort */}
        <div className="filter-group">
          <h3>Sort by</h3>
          <div className="filter-options">
            {sortOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`filter-chip ${sort === opt.value ? "selected" : ""}`}
                onClick={() =>
                  onSortChange?.(
                    sort === opt.value && opt.value !== "featured"
                      ? "featured"
                      : opt.value
                  )
                }
              >
                {opt.label}
                {sort === opt.value && <Check size={13} />}
              </button>
            ))}
          </div>
        </div>

        {/* Category */}
        {!hideCategoryFilter && (
          <div className="filter-group">
            <h3>Category</h3>
            <div className="filter-options">
              {availableCategories.map((item) => (
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
        )}

        {/* Size */}
        <div className="filter-group">
          <h3>Size</h3>
          <div className="filter-options size-options">
            {availableSizes.map((item) => (
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
            {availableColors.map((item) => (
              <button
                key={item.name}
                type="button"
                className={`color-filter ${color === item.name ? "selected" : ""}`}
                onClick={() => onColorChange(color === item.name ? "" : item.name)}
                aria-label={item.name}
                title={item.name}
              >
                <i style={{ backgroundColor: item.hex }} />
                {color === item.name && <Check size={13} className="text-[#071430]" />}
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
              ? `Show ${totalPieces} pieces`
              : "Apply"}
            <ArrowDownUp size={15} />
          </button>
        )}
      </div>
    </div>
  );
}
