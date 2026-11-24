import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import {
  Menu,
  Search,
  ShoppingBag,
  UserRound,
  Sun,
  Moon,
  ArrowUpRight,
} from "lucide-react";
import { MobileDrawer } from "./MobileDrawer";
import { SearchDrawer } from "./SearchDrawer";
import { useStore } from "@/store/Storefront";

interface NavbarProps {
  className?: string;
  brandWordmark?: string;
}

export function Navbar({ className = "", brandWordmark = "主人公" }: NavbarProps) {
  const { count, theme, toggleTheme } = useStore();

  // Sticky scroll detection (~40px threshold)
  const [isScrolled, setIsScrolled] = useState(false);

  // Mobile / Navigation drawer open state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Search drawer open state
  const [isSearchDrawerOpen, setIsSearchDrawerOpen] = useState(false);
  const searchTriggerRef = useRef<HTMLButtonElement>(null);
  const navContainerRef = useRef<HTMLElement>(null);

  // Scroll listener for sticky header shrinking (> 40px)
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setIsScrolled(scrollY > 40);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="announcement">
        <span>Free shipping on orders over ₹5,000</span>
        <span className="announcement-right">
          A little more you. <ArrowUpRight size={12} />
        </span>
      </div>

      {/* Sticky, Dynamic Height Header - blurgvillage layout: Hamburger Left, Logo Center, Actions Right */}
      <header
        ref={navContainerRef}
        className={`sticky top-0 z-40 w-full transition-all duration-300 border-b ${
          isScrolled
            ? "h-14 bg-white/95 dark:bg-[#0b0f1a]/95 backdrop-blur-md border-black/10 dark:border-white/10 shadow-sm"
            : "h-[68px] bg-white/90 dark:bg-[#0b0f1a]/90 backdrop-blur-md border-black/5 dark:border-white/5"
        } ${className}`}
      >
        <div className="w-full h-full px-4 sm:px-6 lg:px-10 grid grid-cols-3 items-center">
          {/* Left: Hamburger Button on all screen sizes */}
          <div className="flex items-center justify-start">
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className="p-1.5 -ml-1.5 text-foreground hover:text-[#1e6bff] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1e6bff]"
              aria-label="Open navigation menu"
              aria-expanded={isDrawerOpen}
              aria-controls="mobile-navigation-drawer"
            >
              <Menu size={22} />
            </button>
          </div>

          {/* Center: Brand Logo centered */}
          <div className="flex items-center justify-center">
            <Link
              href="/"
              className="brand-logo-link group flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1e6bff] rounded-sm"
              aria-label="主人公 ホーム"
            >
              <span
                className="brand-wordmark font-bold text-base md:text-lg tracking-widest uppercase transition-opacity group-hover:opacity-80"
                lang="ja"
              >
                {brandWordmark}
              </span>
              <span className="hidden sm:inline-block text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground">
                STUDIO
              </span>
            </Link>
          </div>

          {/* Right: Existing Store Actions & Features */}
          <div className="flex items-center justify-end gap-1 sm:gap-2">
            {/* Search Drawer Trigger */}
            <button
              ref={searchTriggerRef}
              type="button"
              onClick={() => setIsSearchDrawerOpen(true)}
              className="icon-button search-trigger p-2 text-foreground/80 hover:text-foreground transition-colors rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1e6bff]"
              aria-label="Search products"
            >
              <Search size={18} />
            </button>

            {/* Light/Dark Mode Toggle Switch */}
            <button
              type="button"
              onClick={toggleTheme}
              className="icon-button theme-toggle p-2 text-foreground/80 hover:text-foreground transition-colors rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1e6bff]"
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {/* My Account Link */}
            <Link
              href="/account"
              className="icon-button account-link p-2 text-foreground/80 hover:text-foreground transition-colors rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1e6bff]"
              aria-label="Account"
            >
              <UserRound size={18} />
            </Link>

            {/* Shopping Bag Icon with Count */}
            <Link
              href="/bag"
              className="bag-link flex items-center gap-1.5 p-2 text-foreground hover:text-[#1e6bff] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1e6bff] rounded-full group"
              aria-label={`Shopping bag, ${count} items`}
            >
              <div className="relative flex items-center">
                <ShoppingBag size={18} />
                <span className="bag-count">{count}</span>
              </div>
              <span className="bag-label hidden lg:inline text-xs font-medium tracking-wider uppercase ml-0.5">
                Bag
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Navigation Slide-in Drawer (pinned to left, for all screen sizes) */}
      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        brandWordmark={brandWordmark}
      />

      {/* Search Slide-in Drawer (pinned to right, blurgvillage.com style) */}
      <SearchDrawer
        isOpen={isSearchDrawerOpen}
        onClose={() => setIsSearchDrawerOpen(false)}
        triggerRef={searchTriggerRef}
      />
    </>
  );
}

export default Navbar;
