import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { Link, useLocation } from "wouter";
import { ArrowRight, Check, Heart } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import TiltedCard from "@/components/TiltedCard";
import { ScrollProgressBar, ScrollReveal, StaggerGrid, StaggerItem } from "@/components/MotionPrimitives";
import { Navbar } from "@/components/layout/Navbar";
import { devProducts } from "./devProducts";

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  color: string;
  colorHex: string;
  sizes: string[];
  image: string;
  tone: string;
  tag?: string;
  description: string;
};

export type BagLine = {
  productId: string;
  size: string;
  color: string;
  quantity: number;
};

export const baseProducts: Product[] = [
  { id: "blue-hour-shirt", name: "Blue Hour Shirt", category: "Shirts", price: 3490, color: "Electric blue", colorHex: "#0057ff", sizes: ["XS", "S", "M", "L", "XL"], image: "/images/main-character-2.webp", tone: "#e8f0ff", tag: "New arrival", description: "A crisp, oversized cotton shirt with a relaxed line and a little more point of view." },
  { id: "after-hours-tee", name: "After Hours Tee", category: "T-shirts", price: 2190, color: "Ice white", colorHex: "#e6e9ee", sizes: ["XS", "S", "M", "L", "XL"], image: "/images/main-character-3.webp", tone: "#f2f3f4", tag: "Bestseller", description: "Heavyweight organic cotton, cut boxy and finished with a clean, considered silhouette." },
  { id: "still-frame-bomber", name: "Still Frame Bomber", category: "Outerwear", price: 8990, color: "Ink black", colorHex: "#0b0f1a", sizes: ["S", "M", "L", "XL"], image: "/images/main-character-4.webp", tone: "#e7e9ed", tag: "Limited", description: "A softly structured bomber with silver hardware and enough room for a second layer." },
  { id: "off-script-denim", name: "Off Script Denim", category: "Bottoms", price: 6290, color: "Washed blue", colorHex: "#7896c9", sizes: ["XS", "S", "M", "L", "XL"], image: "/images/denim.jpg", tone: "#eaf0f8", description: "Easy straight-leg denim with a lived-in wash and a clean, modern finish." },
  { id: "soft-focus-knit", name: "Soft Focus Knit", category: "Knitwear", price: 5490, compareAtPrice: 6490, color: "Platinum", colorHex: "#c9ced6", sizes: ["XS", "S", "M", "L"], image: "/images/knit.jpg", tone: "#eceff3", tag: "Flash sale", description: "A relaxed knit with a soft hand-feel, made for the days that run into evenings." },
  { id: "main-character-cap", name: "主人公 キャップ", category: "Accessories", price: 1890, color: "Deep blue", colorHex: "#0033b3", sizes: ["One size"], image: "/images/cap.jpg", tone: "#e8efff", description: "A low-profile cotton cap with an easy curve and an adjustable back." },
  { id: "daylight-layer", name: "Daylight Layer", category: "T-shirts", price: 2590, compareAtPrice: 3290, color: "Sky glow", colorHex: "#00aeff", sizes: ["XS", "S", "M", "L", "XL"], image: "/images/tee.jpg", tone: "#e8f4ff", tag: "Flash sale", description: "A lighter-weight everyday layer in a quietly vivid shade of blue." },
  { id: "city-lights-jacket", name: "City Lights Jacket", category: "Outerwear", price: 10990, color: "Steel", colorHex: "#8a93a0", sizes: ["S", "M", "L", "XL"], image: "/images/jacket.jpg", tone: "#e8eaed", tag: "New arrival", description: "A clean, city-ready layer with a generous cut and thoughtful utility details." },
];

export const products: Product[] = import.meta.env.DEV
  ? [...baseProducts, ...devProducts]
  : baseProducts;

const CART_KEY = "mc-bag-v1";
const THEME_KEY = "mc-theme-v3";
const WISH_KEY = "mc-wish-v1";
export const MIN_BAG_QUANTITY = 1;
export const MAX_BAG_QUANTITY = 10;

function clampQuantity(quantity: number): number {
  if (!Number.isFinite(quantity)) return MIN_BAG_QUANTITY;
  return Math.min(MAX_BAG_QUANTITY, Math.max(MIN_BAG_QUANTITY, Math.round(quantity)));
}

function resolveProductColor(productId: string, color?: string): string {
  const trimmed = color?.trim();
  if (trimmed) return trimmed;
  return products.find((p) => p.id === productId)?.color ?? "";
}

function normalizeBag(raw: unknown): BagLine[] {
  if (!Array.isArray(raw)) return [];
  const merged = new Map<string, BagLine>();
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const entry = item as Partial<BagLine>;
    if (typeof entry.productId !== "string" || typeof entry.size !== "string") continue;
    const product = products.find((p) => p.id === entry.productId);
    if (!product || !entry.size.trim()) continue;
    const size = entry.size.trim();
    const color = resolveProductColor(entry.productId, typeof entry.color === "string" ? entry.color : undefined);
    const qty = clampQuantity(typeof entry.quantity === "number" ? entry.quantity : 1);
    const key = `${entry.productId}::${size}::${color}`;
    const existing = merged.get(key);
    if (existing) {
      existing.quantity = clampQuantity(existing.quantity + qty);
    } else {
      merged.set(key, { productId: entry.productId, size, color, quantity: qty });
    }
  }
  return Array.from(merged.values());
}

function normalizeFavorites(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const validIds = new Set(products.map((p) => p.id));
  const seen = new Set<string>();
  const result: string[] = [];
  for (const item of raw) {
    if (typeof item === "string" && validIds.has(item) && !seen.has(item)) {
      seen.add(item);
      result.push(item);
    }
  }
  return result;
}

function normalizeTheme(raw: unknown): "light" | "dark" {
  return raw === "dark" ? "dark" : "light";
}

function usePersistedState<T>(
  key: string,
  fallback: T,
  normalize?: (raw: unknown) => T
): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    if (typeof window === "undefined") return fallback;
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) return fallback;
      const parsed: unknown = JSON.parse(raw);
      return normalize ? normalize(parsed) : (parsed as T);
    } catch {
      return fallback;
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // Ignore storage quota or private browsing errors
    }
  }, [key, state]);

  return [state, setState];
}

type StoreContextValue = {
  bag: BagLine[];
  addToBag: (id: string, size: string, quantity?: number, color?: string) => void;
  setQuantity: (id: string, size: string, quantity: number, color?: string) => void;
  removeFromBag: (id: string, size: string, color?: string) => void;
  count: number;
  theme: "light" | "dark";
  toggleTheme: () => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  toast: (message: string, kind?: "success" | "info") => void;
};

const StoreContext = createContext<StoreContextValue | null>(null);

export function useStore() {
  const value = useContext(StoreContext);
  if (!value) throw new Error("StoreProvider is missing");
  return value;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [bag, setBag] = usePersistedState<BagLine[]>(CART_KEY, [], normalizeBag);
  const [theme, setTheme] = usePersistedState<"light" | "dark">(THEME_KEY, "light", normalizeTheme);
  const [favorites, setFavorites] = usePersistedState<string[]>(WISH_KEY, [], normalizeFavorites);
  const [notice, setNotice] = useState<{
    message: string;
    kind: "success" | "info";
    id: number;
  } | null>(null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 2800);
    return () => clearTimeout(timer);
  }, [notice]);

  const toast = (message: string, kind: "success" | "info" = "success") =>
    setNotice({ message, kind, id: Date.now() });

  const addToBag = (productId: string, size: string, quantity = 1, color?: string) => {
    const trimmedSize = size.trim();
    if (!trimmedSize) return;
    const resolvedColor = resolveProductColor(productId, color);
    const safeDelta = clampQuantity(quantity);
    const existing = bag.find(
      (line) =>
        line.productId === productId &&
        line.size === trimmedSize &&
        line.color === resolvedColor
    );
    const hitLimit = Boolean(existing && existing.quantity >= MAX_BAG_QUANTITY);

    setBag((current) => {
      const found = current.find(
        (line) =>
          line.productId === productId &&
          line.size === trimmedSize &&
          line.color === resolvedColor
      );
      return found
        ? current.map((line) =>
            line === found
              ? { ...line, quantity: clampQuantity(line.quantity + safeDelta) }
              : line
          )
        : [
            ...current,
            {
              productId,
              size: trimmedSize,
              color: resolvedColor,
              quantity: safeDelta,
            },
          ];
    });
    toast(
      hitLimit
        ? `Maximum quantity (${MAX_BAG_QUANTITY}) reached for this item`
        : "Added to your bag",
      hitLimit ? "info" : "success"
    );
  };

  const setQuantity = (
    productId: string,
    size: string,
    quantity: number,
    color?: string
  ) => {
    const resolvedColor = resolveProductColor(productId, color);
    setBag((current) =>
      current.map((line) =>
        line.productId === productId &&
        line.size === size &&
        line.color === resolvedColor
          ? { ...line, quantity: clampQuantity(quantity) }
          : line
      )
    );
  };

  const removeFromBag = (productId: string, size: string, color?: string) => {
    const resolvedColor = resolveProductColor(productId, color);
    setBag((current) =>
      current.filter(
        (line) =>
          !(
            line.productId === productId &&
            line.size === size &&
            line.color === resolvedColor
          )
      )
    );
  };

  const count = useMemo(
    () =>
      bag.reduce(
        (total, line) =>
          products.some((p) => p.id === line.productId)
            ? total + line.quantity
            : total,
        0
      ),
    [bag]
  );

  const value = useMemo(
    () => ({
      bag,
      addToBag,
      setQuantity,
      removeFromBag,
      count,
      theme,
      toggleTheme: () => setTheme((current) => (current === "light" ? "dark" : "light")),
      favorites,
      toggleFavorite: (id: string) =>
        setFavorites((current) =>
          current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
        ),
      toast,
    }),
    [bag, count, theme, favorites]
  );

  return (
    <StoreContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {notice && (
          <motion.div
            key={notice.id}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className={`toast toast-${notice.kind}`}
            role="status"
          >
            <Check size={15} />
            <span>{notice.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </StoreContext.Provider>
  );
}

export function formatPrice(price: number) {
  return `₹${price.toLocaleString("en-IN")}`;
}

export function ProductCard({ product }: { product: Product }) {
  const { bag, addToBag, favorites, toggleFavorite, toast } = useStore();
  const isSaved = favorites.includes(product.id);
  const quickSize = product.sizes.includes("M")
    ? "M"
    : product.sizes[0] ?? "";
  const [justAdded, setJustAdded] = useState(false);
  const [cardNotice, setCardNotice] = useState("");
  const addedTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (addedTimerRef.current !== null) {
        window.clearTimeout(addedTimerRef.current);
      }
    };
  }, []);

  const inBagCount = bag
    .filter((line) => line.productId === product.id)
    .reduce((sum, line) => sum + line.quantity, 0);

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="product-card group"
    >
      <div className="product-image-wrap">
        <Link
          href={`/product/${product.id}`}
          className="product-image-link z-0 isolate"
          aria-label={`View ${product.name}`}
        >
          <TiltedCard
            imageSrc={product.image}
            altText={product.name}
            containerWidth="100%"
            containerHeight="100%"
            imageWidth="100%"
            imageHeight="100%"
            radius={12}
            rotateAmplitude={5}
            glare={0.2}
            scaleOnHover={1.03}
            showTooltip={false}
            intro={false}
            gyroscope={false}
          />
        </Link>
        {product.tag && <span className="product-tag">{product.tag}</span>}
        <motion.button
          whileTap={{ scale: 0.82 }}
          className={`favorite-button z-20 ${isSaved ? "is-favorite" : ""}`}
          type="button"
          aria-pressed={isSaved}
          aria-label={isSaved ? "Remove from saved pieces" : "Save piece"}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            toggleFavorite(product.id);
            toast(
              isSaved ? "Removed from saved pieces" : "Saved for later",
              "info"
            );
          }}
        >
          <Heart size={16} fill={isSaved ? "currentColor" : "none"} aria-hidden="true" />
        </motion.button>
        <button
          type="button"
          className="quick-add z-20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--blue)]"
          aria-label={`Add ${product.name} to bag`}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            if (!quickSize) {
              setCardNotice("Choose a size");
              return;
            }
            if (!product.color?.trim()) {
              setCardNotice("Choose a color");
              return;
            }
            setCardNotice("");
            addToBag(product.id, quickSize, 1, product.color);
            setJustAdded(true);
            if (addedTimerRef.current !== null) {
              window.clearTimeout(addedTimerRef.current);
            }
            addedTimerRef.current = window.setTimeout(() => {
              setJustAdded(false);
              addedTimerRef.current = null;
            }, 1200);
          }}
        >
          <span>
            {justAdded
              ? "Added to bag"
              : inBagCount > 0
              ? `Add to bag · ${quickSize} (${inBagCount})`
              : quickSize
              ? `Add to bag · ${quickSize}`
              : "Add to bag"}
          </span>
          {justAdded ? (
            <Check size={14} aria-hidden="true" />
          ) : (
            <span className="quick-add-plus" aria-hidden="true">+</span>
          )}
        </button>
      </div>
      {cardNotice && (
        <p
          role="status"
          className="mt-1.5 px-1 text-[11px] font-medium text-[var(--blue)]"
        >
          {cardNotice}
        </p>
      )}
      <div className="product-info">
        <div className="min-w-0">
          <Link href={`/product/${product.id}`} className="product-name truncate group-hover:text-[#0057ff] dark:group-hover:text-[#6cb8ff] transition-colors">
            {product.name}
          </Link>
          <span className="product-category">{product.category}</span>
        </div>
        <div className="text-right shrink-0">
          <strong>{formatPrice(product.price)}</strong>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="block text-[10px] line-through text-[var(--muted)]">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
      <div className="swatch-line">
        <span className="color-swatch" style={{ backgroundColor: product.colorHex }} />
        <span className="truncate">{product.color}</span>
        <span className="product-sizes">
          {product.sizes.length === 1 ? "One size" : product.sizes.join(" · ")}
        </span>
      </div>
    </motion.article>
  );
}

export function ProductRail({
  items = products.slice(0, 4),
  title = "New arrivals",
  eyebrow = "JUST LANDED",
  href = "/collections",
}: {
  items?: Product[];
  title?: string;
  eyebrow?: string;
  href?: string;
}) {
  return (
    <section className="section-shell arrivals-section" id="new-arrivals">
      <ScrollReveal>
        <div className="section-heading">
          <div>
            <span className="eyebrow">{eyebrow}</span>
            <h2>{title}</h2>
          </div>
          <Link href={href} className="text-link group">
            <span>Shop all</span>
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </ScrollReveal>
      <StaggerGrid className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
        {items.map((product) => (
          <StaggerItem key={product.id}>
            <ProductCard product={product} />
          </StaggerItem>
        ))}
      </StaggerGrid>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-[#002b99] via-[#0057ff] to-[#0094ff] text-white px-4 sm:px-8 lg:px-16 pt-12 pb-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/15 blur-3xl"
      />
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-8 pb-10">
          <div>
            <Link
              href="/"
              className="brand-logo-link footer-brand-logo inline-flex items-center gap-2.5"
              aria-label="主人公 ホーム"
            >
              <span className="brand-wordmark" lang="ja">主人公</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase bg-white/15 backdrop-blur-md border border-white/25 text-white">
                STUDIO
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-white/80 mt-3 font-medium">
              Wear the point of view.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-10 gap-y-3 text-xs sm:text-sm font-semibold text-white/90">
            <Link href="/collections" className="hover:text-white transition-colors">
              Shop all
            </Link>
            <Link href="/account" className="hover:text-white transition-colors">
              Your account
            </Link>
            <a href="/#flagship" className="hover:text-white transition-colors">
              Find us
            </a>
            <a href="mailto:hello@maincharacter.example" className="hover:text-white transition-colors">
              Get in touch
            </a>
          </div>
        </div>
        <div className="border-t border-white/20 pt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-white/75 tracking-wide">
          <span>© 2026 主人公 Studio</span>
          <span>Made for your own plot.</span>
        </div>
      </div>
    </footer>
  );
}

export function StoreLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  useEffect(() => {
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    if (hash) {
      const target = document.getElementById(hash.slice(1));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollProgressBar />
      <Navbar />
      <main className="relative page-enter flex-1">{children}</main>
      <Footer />
    </div>
  );
}
