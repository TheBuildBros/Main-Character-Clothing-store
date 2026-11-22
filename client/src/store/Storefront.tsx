import { createContext, useContext, useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { ArrowRight, ArrowUpRight, Check, Heart, Menu, Moon, Search, ShoppingBag, Sun, UserRound, X } from "lucide-react";
import TiltedCard from "@/components/TiltedCard";
import AnimatedContent from "@/components/AnimatedContent";

export type Product = { id: string; name: string; category: string; price: number; color: string; colorHex: string; sizes: string[]; image: string; tone: string; tag?: string; description: string };
export type BagLine = { productId: string; size: string; quantity: number };
export const products: Product[] = [
  { id: "blue-hour-shirt", name: "Blue Hour Shirt", category: "Shirts", price: 3490, color: "Electric blue", colorHex: "#1e6bff", sizes: ["XS", "S", "M", "L", "XL"], image: "/images/main-character-2.webp", tone: "#e8f0ff", tag: "New arrival", description: "A crisp, oversized cotton shirt with a relaxed line and a little more point of view." },
  { id: "after-hours-tee", name: "After Hours Tee", category: "T-shirts", price: 2190, color: "Ice white", colorHex: "#e6e9ee", sizes: ["XS", "S", "M", "L", "XL"], image: "/images/main-character-3.webp", tone: "#f2f3f4", tag: "Bestseller", description: "Heavyweight organic cotton, cut boxy and finished with a clean, considered silhouette." },
  { id: "still-frame-bomber", name: "Still Frame Bomber", category: "Outerwear", price: 8990, color: "Ink black", colorHex: "#0b0f1a", sizes: ["S", "M", "L", "XL"], image: "/images/main-character-4.webp", tone: "#e7e9ed", tag: "Limited", description: "A softly structured bomber with silver hardware and enough room for a second layer." },
  { id: "off-script-denim", name: "Off Script Denim", category: "Bottoms", price: 6290, color: "Washed blue", colorHex: "#7896c9", sizes: ["XS", "S", "M", "L", "XL"], image: "/images/denim.jpg", tone: "#eaf0f8", description: "Easy straight-leg denim with a lived-in wash and a clean, modern finish." },
  { id: "soft-focus-knit", name: "Soft Focus Knit", category: "Knitwear", price: 5490, color: "Platinum", colorHex: "#c9ced6", sizes: ["XS", "S", "M", "L"], image: "/images/knit.jpg", tone: "#eceff3", tag: "New arrival", description: "A relaxed knit with a soft hand-feel, made for the days that run into evenings." },
  { id: "main-character-cap", name: "主人公 キャップ", category: "Accessories", price: 1890, color: "Deep blue", colorHex: "#0a3fcc", sizes: ["One size"], image: "/images/cap.jpg", tone: "#e8efff", description: "A low-profile cotton cap with an easy curve and an adjustable back." },
  { id: "daylight-layer", name: "Daylight Layer", category: "T-shirts", price: 2590, color: "Sky glow", colorHex: "#4fa3ff", sizes: ["XS", "S", "M", "L", "XL"], image: "/images/tee.jpg", tone: "#e8f4ff", description: "A lighter-weight everyday layer in a quietly vivid shade of blue." },
  { id: "city-lights-jacket", name: "City Lights Jacket", category: "Outerwear", price: 10990, color: "Steel", colorHex: "#8a93a0", sizes: ["S", "M", "L", "XL"], image: "/images/jacket.jpg", tone: "#e8eaed", tag: "New arrival", description: "A clean, city-ready layer with a generous cut and thoughtful utility details." },
];
const CART_KEY = "mc-bag-v1";
const THEME_KEY = "mc-theme-v2";
const WISH_KEY = "mc-wish-v1";
type StoreContextValue = { bag: BagLine[]; addToBag: (id: string, size: string, quantity?: number) => void; setQuantity: (id: string, size: string, quantity: number) => void; removeFromBag: (id: string, size: string) => void; count: number; theme: "light" | "dark"; toggleTheme: () => void; favorites: string[]; toggleFavorite: (id: string) => void; toast: (message: string, kind?: "success" | "info") => void };
const StoreContext = createContext<StoreContextValue | null>(null);
export function useStore() { const value = useContext(StoreContext); if (!value) throw new Error("StoreProvider is missing"); return value; }
function readJson<T>(key: string, fallback: T): T { try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) as T : fallback; } catch { return fallback; } }
export function StoreProvider({ children }: { children: ReactNode }) {
  const [bag, setBag] = useState<BagLine[]>(() => typeof window === "undefined" ? [] : readJson(CART_KEY, []));
  const [theme, setTheme] = useState<"light" | "dark">(() => typeof window === "undefined" ? "dark" : readJson(THEME_KEY, "dark"));
  const [favorites, setFavorites] = useState<string[]>(() => typeof window === "undefined" ? [] : readJson(WISH_KEY, []));
  const [notice, setNotice] = useState<{ message: string; kind: "success" | "info"; id: number } | null>(null);
  useEffect(() => { localStorage.setItem(CART_KEY, JSON.stringify(bag)); }, [bag]);
  useEffect(() => { localStorage.setItem(THEME_KEY, JSON.stringify(theme)); document.documentElement.dataset.theme = theme; }, [theme]);
  useEffect(() => { localStorage.setItem(WISH_KEY, JSON.stringify(favorites)); }, [favorites]);
  useEffect(() => { if (!notice) return; const timer = window.setTimeout(() => setNotice(null), 2800); return () => clearTimeout(timer); }, [notice]);
  const toast = (message: string, kind: "success" | "info" = "success") => setNotice({ message, kind, id: Date.now() });
  const addToBag = (productId: string, size: string, quantity = 1) => { setBag(current => { const found = current.find(line => line.productId === productId && line.size === size); return found ? current.map(line => line === found ? { ...line, quantity: line.quantity + quantity } : line) : [...current, { productId, size, quantity }]; }); toast("Added to your bag"); };
  const setQuantity = (productId: string, size: string, quantity: number) => setBag(current => current.map(line => line.productId === productId && line.size === size ? { ...line, quantity: Math.max(1, quantity) } : line));
  const removeFromBag = (productId: string, size: string) => setBag(current => current.filter(line => !(line.productId === productId && line.size === size)));
  const count = bag.reduce((total, line) => total + line.quantity, 0);
  const value = useMemo(() => ({ bag, addToBag, setQuantity, removeFromBag, count, theme, toggleTheme: () => setTheme(current => current === "light" ? "dark" : "light"), favorites, toggleFavorite: (id: string) => setFavorites(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]), toast }), [bag, count, theme, favorites]);
  return <StoreContext.Provider value={value}>{children}{notice && <div key={notice.id} className={`toast toast-${notice.kind}`} role="status"><Check size={15} />{notice.message}</div>}</StoreContext.Provider>;
}

export function formatPrice(price: number) { return `₹${price.toLocaleString("en-IN")}`; }
export function ProductCard({ product }: { product: Product }) {
  const { addToBag, favorites, toggleFavorite, toast } = useStore();
  return <article className="product-card">
    <div className="product-image-wrap">
      <Link href={`/product/${product.id}`} className="product-image-link" aria-label={`View ${product.name}`}>
        <TiltedCard imageSrc={product.image} altText={product.name} containerWidth="100%" containerHeight="100%" imageWidth="100%" imageHeight="100%" radius={0} rotateAmplitude={5} glare={0.18} scaleOnHover={1.025} showTooltip={false} intro={false} gyroscope={false} />
      </Link>
      {product.tag && <span className="product-tag">{product.tag}</span>}
      <button className={`favorite-button ${favorites.includes(product.id) ? "is-favorite" : ""}`} type="button" aria-label={favorites.includes(product.id) ? "Remove from saved pieces" : "Save piece"} onClick={(event) => { event.preventDefault(); toggleFavorite(product.id); toast(favorites.includes(product.id) ? "Removed from saved pieces" : "Saved for later", "info"); }}><Heart size={17} fill={favorites.includes(product.id) ? "currentColor" : "none"} /></button>
      <button className="quick-add" type="button" onClick={(event) => { event.preventDefault(); addToBag(product.id, product.sizes.includes("M") ? "M" : product.sizes[0]); }}><span>Quick add · {product.sizes.includes("M") ? "M" : product.sizes[0]}</span><span className="quick-add-plus">+</span></button>
    </div>
    <div className="product-info"><div><Link href={`/product/${product.id}`} className="product-name">{product.name}</Link><span className="product-category">{product.category}</span></div><strong>{formatPrice(product.price)}</strong></div>
    <div className="swatch-line"><span className="color-swatch" style={{ backgroundColor: product.colorHex }} /><span>{product.color}</span><span className="product-sizes">{product.sizes.length === 1 ? "One size" : product.sizes.join(" · ")}</span></div>
  </article>;
}
export function ProductRail({ items = products.slice(0, 4), title = "New arrivals", eyebrow = "JUST LANDED", href = "/collections" }: { items?: Product[]; title?: string; eyebrow?: string; href?: string }) {
  return <section className="section-shell arrivals-section" id="new-arrivals"><div className="section-heading"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2></div><Link href={href} className="text-link">Shop all <ArrowRight size={16} /></Link></div><AnimatedContent className="product-grid-reveal" distance={26} duration={0.65} stagger={0.09} threshold={0.12}><div className="product-grid">{items.map(product => <ProductCard key={product.id} product={product} />)}</div></AnimatedContent></section>;
}
export function Header() {
  const { count, theme, toggleTheme } = useStore();
  const [location, navigate] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const submitSearch = (event: FormEvent) => { event.preventDefault(); const target = `/collections?q=${encodeURIComponent(query.trim())}`; if (location === "/collections") window.location.assign(target); else navigate(target); setSearchOpen(false); setMenuOpen(false); };
  useEffect(() => { setMenuOpen(false); }, [location]);
  return <>
    <div className="announcement"><span>Free shipping on orders over ₹5,000</span><span className="announcement-right">A little more you. <ArrowUpRight size={12} /></span></div>
    <header className="site-header"><button className="icon-button mobile-menu-button" onClick={() => setMenuOpen(v => !v)} aria-label={menuOpen ? "Close menu" : "Open menu"}>{menuOpen ? <X /> : <Menu />}</button>
      <Link href="/" className="brand-logo-link" aria-label="主人公 ホーム"><span className="brand-wordmark" lang="ja">主人公</span></Link>
      <nav className="desktop-nav" aria-label="Main navigation"><Link href="/collections?sort=new">New in</Link><Link href="/collections">Shop all</Link><a href="/#flagship">Flagship</a></nav>
      <div className="header-actions"><form className={`header-search ${searchOpen ? "search-open" : ""}`} onSubmit={submitSearch}><button type="button" className="icon-button search-trigger" aria-label="Search products" onClick={() => setSearchOpen(v => !v)}><Search size={18} /></button><input aria-label="Search pieces" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search pieces" onKeyDown={event => { if (event.key === "Escape") setSearchOpen(false); }} /></form><button className="icon-button theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}>{theme === "light" ? <Moon size={18} /> : <Sun size={18} />}</button><Link className="icon-button account-link" href="/account" aria-label="Account"><UserRound size={18} /></Link><Link className="bag-link" href="/bag" aria-label={`Shopping bag, ${count} items`}><ShoppingBag size={18} /><span className="bag-label">Bag</span><span className="bag-count">{count}</span></Link></div>
    </header>
    {menuOpen && <div className="mobile-menu"><form onSubmit={submitSearch} className="mobile-search"><Search size={16} /><input placeholder="Search the collection" value={query} onChange={event => setQuery(event.target.value)} /></form><Link href="/collections?sort=new">New in <ArrowUpRight size={16} /></Link><Link href="/collections">Shop all <ArrowUpRight size={16} /></Link><a href="/#flagship" onClick={() => setMenuOpen(false)}>Flagship <ArrowUpRight size={16} /></a><Link href="/account">Your account <ArrowUpRight size={16} /></Link><button className="mobile-theme-switch" onClick={toggleTheme}>{theme === "light" ? <Moon size={16} /> : <Sun size={16} />} Switch to {theme === "light" ? "dark" : "light"} mode</button></div>}
  </>;
}
export function Footer() { return <footer className="site-footer"><div className="footer-top"><div><Link href="/" className="brand-logo-link footer-brand-logo" aria-label="主人公 ホーム"><span className="brand-wordmark" lang="ja">主人公</span></Link><p>Wear the point of view.</p></div><div className="footer-links"><Link href="/collections">Shop all</Link><Link href="/account">Your account</Link><a href="/#flagship">Find us</a><a href="mailto:hello@maincharacter.example">Get in touch</a></div></div><div className="footer-bottom"><span>© 2026 主人公 Studio</span><span>Made for your own plot.</span></div></footer>; }
export function StoreLayout({ children }: { children: ReactNode }) { return <><Header /><main className="page-enter">{children}</main><Footer /></>; }
