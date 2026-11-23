import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Link } from "wouter";
import { ArrowRight, Check, Heart } from "lucide-react";
import TiltedCard from "@/components/TiltedCard";
import AnimatedContent from "@/components/AnimatedContent";
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

export type BagLine = { productId: string; size: string; quantity: number };

export const baseProducts: Product[] = [
  { id: "blue-hour-shirt", name: "Blue Hour Shirt", category: "Shirts", price: 3490, color: "Electric blue", colorHex: "#1e6bff", sizes: ["XS", "S", "M", "L", "XL"], image: "/images/main-character-2.webp", tone: "#e8f0ff", tag: "New arrival", description: "A crisp, oversized cotton shirt with a relaxed line and a little more point of view." },
  { id: "after-hours-tee", name: "After Hours Tee", category: "T-shirts", price: 2190, color: "Ice white", colorHex: "#e6e9ee", sizes: ["XS", "S", "M", "L", "XL"], image: "/images/main-character-3.webp", tone: "#f2f3f4", tag: "Bestseller", description: "Heavyweight organic cotton, cut boxy and finished with a clean, considered silhouette." },
  { id: "still-frame-bomber", name: "Still Frame Bomber", category: "Outerwear", price: 8990, color: "Ink black", colorHex: "#0b0f1a", sizes: ["S", "M", "L", "XL"], image: "/images/main-character-4.webp", tone: "#e7e9ed", tag: "Limited", description: "A softly structured bomber with silver hardware and enough room for a second layer." },
  { id: "off-script-denim", name: "Off Script Denim", category: "Bottoms", price: 6290, color: "Washed blue", colorHex: "#7896c9", sizes: ["XS", "S", "M", "L", "XL"], image: "/images/denim.jpg", tone: "#eaf0f8", description: "Easy straight-leg denim with a lived-in wash and a clean, modern finish." },
  { id: "soft-focus-knit", name: "Soft Focus Knit", category: "Knitwear", price: 5490, color: "Platinum", colorHex: "#c9ced6", sizes: ["XS", "S", "M", "L"], image: "/images/knit.jpg", tone: "#eceff3", tag: "New arrival", description: "A relaxed knit with a soft hand-feel, made for the days that run into evenings." },
  { id: "main-character-cap", name: "主人公 キャップ", category: "Accessories", price: 1890, color: "Deep blue", colorHex: "#0a3fcc", sizes: ["One size"], image: "/images/cap.jpg", tone: "#e8efff", description: "A low-profile cotton cap with an easy curve and an adjustable back." },
  { id: "daylight-layer", name: "Daylight Layer", category: "T-shirts", price: 2590, color: "Sky glow", colorHex: "#4fa3ff", sizes: ["XS", "S", "M", "L", "XL"], image: "/images/tee.jpg", tone: "#e8f4ff", description: "A lighter-weight everyday layer in a quietly vivid shade of blue." },
  { id: "city-lights-jacket", name: "City Lights Jacket", category: "Outerwear", price: 10990, color: "Steel", colorHex: "#8a93a0", sizes: ["S", "M", "L", "XL"], image: "/images/jacket.jpg", tone: "#e8eaed", tag: "New arrival", description: "A clean, city-ready layer with a generous cut and thoughtful utility details." },
];

export const products: Product[] = import.meta.env.DEV
  ? [...baseProducts, ...devProducts]
  : baseProducts;

const CART_KEY = "mc-bag-v1";
const THEME_KEY = "mc-theme-v2";
const WISH_KEY = "mc-wish-v1";

type StoreContextValue = {
  bag: BagLine[];
  addToBag: (id: string, size: string, quantity?: number) => void;
  setQuantity: (id: string, size: string, quantity: number) => void;
  removeFromBag: (id: string, size: string) => void;
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

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [bag, setBag] = useState<BagLine[]>(() =>
    typeof window === "undefined" ? [] : readJson(CART_KEY, [])
  );
  const [theme, setTheme] = useState<"light" | "dark">(() =>
    typeof window === "undefined" ? "dark" : readJson(THEME_KEY, "dark")
  );
  const [favorites, setFavorites] = useState<string[]>(() =>
    typeof window === "undefined" ? [] : readJson(WISH_KEY, [])
  );
  const [notice, setNotice] = useState<{
    message: string;
    kind: "success" | "info";
    id: number;
  } | null>(null);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(bag));
  }, [bag]);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, JSON.stringify(theme));
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(WISH_KEY, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 2800);
    return () => clearTimeout(timer);
  }, [notice]);

  const toast = (message: string, kind: "success" | "info" = "success") =>
    setNotice({ message, kind, id: Date.now() });

  const addToBag = (productId: string, size: string, quantity = 1) => {
    setBag((current) => {
      const found = current.find(
        (line) => line.productId === productId && line.size === size
      );
      return found
        ? current.map((line) =>
            line === found ? { ...line, quantity: line.quantity + quantity } : line
          )
        : [...current, { productId, size, quantity }];
    });
    toast("Added to your bag");
  };

  const setQuantity = (productId: string, size: string, quantity: number) =>
    setBag((current) =>
      current.map((line) =>
        line.productId === productId && line.size === size
          ? { ...line, quantity: Math.max(1, quantity) }
          : line
      )
    );

  const removeFromBag = (productId: string, size: string) =>
    setBag((current) =>
      current.filter((line) => !(line.productId === productId && line.size === size))
    );

  const count = bag.reduce((total, line) => total + line.quantity, 0);

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
      {notice && (
        <div key={notice.id} className={`toast toast-${notice.kind}`} role="status">
          <Check size={15} />
          {notice.message}
        </div>
      )}
    </StoreContext.Provider>
  );
}

export function formatPrice(price: number) {
  return `₹${price.toLocaleString("en-IN")}`;
}

export function ProductCard({ product }: { product: Product }) {
  const { addToBag, favorites, toggleFavorite, toast } = useStore();
  const isSaved = favorites.includes(product.id);
  const quickSize = product.sizes.includes("M") ? "M" : product.sizes[0];

  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <Link
          href={`/product/${product.id}`}
          className="product-image-link"
          aria-label={`View ${product.name}`}
        >
          <TiltedCard
            imageSrc={product.image}
            altText={product.name}
            containerWidth="100%"
            containerHeight="100%"
            imageWidth="100%"
            imageHeight="100%"
            radius={0}
            rotateAmplitude={5}
            glare={0.18}
            scaleOnHover={1.025}
            showTooltip={false}
            intro={false}
            gyroscope={false}
          />
        </Link>
        {product.tag && <span className="product-tag">{product.tag}</span>}
        <button
          className={`favorite-button ${isSaved ? "is-favorite" : ""}`}
          type="button"
          aria-label={isSaved ? "Remove from saved pieces" : "Save piece"}
          onClick={(event) => {
            event.preventDefault();
            toggleFavorite(product.id);
            toast(
              isSaved ? "Removed from saved pieces" : "Saved for later",
              "info"
            );
          }}
        >
          <Heart size={17} fill={isSaved ? "currentColor" : "none"} />
        </button>
        <button
          className="quick-add"
          type="button"
          onClick={(event) => {
            event.preventDefault();
            addToBag(product.id, quickSize);
          }}
        >
          <span>Quick add · {quickSize}</span>
          <span className="quick-add-plus">+</span>
        </button>
      </div>
      <div className="product-info">
        <div>
          <Link href={`/product/${product.id}`} className="product-name">
            {product.name}
          </Link>
          <span className="product-category">{product.category}</span>
        </div>
        <strong>{formatPrice(product.price)}</strong>
      </div>
      <div className="swatch-line">
        <span className="color-swatch" style={{ backgroundColor: product.colorHex }} />
        <span>{product.color}</span>
        <span className="product-sizes">
          {product.sizes.length === 1 ? "One size" : product.sizes.join(" · ")}
        </span>
      </div>
    </article>
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
      <div className="section-heading">
        <div>
          <span className="eyebrow">{eyebrow}</span>
          <h2>{title}</h2>
        </div>
        <Link href={href} className="text-link">
          Shop all <ArrowRight size={16} />
        </Link>
      </div>
      <AnimatedContent
        className="product-grid-reveal"
        distance={26}
        duration={0.65}
        stagger={0.09}
        threshold={0.12}
      >
        <div className="product-grid">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </AnimatedContent>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div>
          <Link href="/" className="brand-logo-link footer-brand-logo" aria-label="主人公 ホーム">
            <span className="brand-wordmark" lang="ja">主人公</span>
          </Link>
          <p>Wear the point of view.</p>
        </div>
        <div className="footer-links">
          <Link href="/collections">Shop all</Link>
          <Link href="/account">Your account</Link>
          <a href="/#flagship">Find us</a>
          <a href="mailto:hello@maincharacter.example">Get in touch</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 主人公 Studio</span>
        <span>Made for your own plot.</span>
      </div>
    </footer>
  );
}

export function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="page-enter">{children}</main>
      <Footer />
    </>
  );
}