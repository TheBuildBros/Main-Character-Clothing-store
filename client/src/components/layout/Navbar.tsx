import { useState, useRef } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  Menu,
  Search,
  ShoppingBag,
  UserRound,
  Sun,
  Moon,
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

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSearchDrawerOpen, setIsSearchDrawerOpen] = useState(false);
  const searchTriggerRef = useRef<HTMLButtonElement>(null);
  const navContainerRef = useRef<HTMLElement>(null);

  return (
    <>
      <header
        ref={navContainerRef}
        className={`relative z-40 w-full h-16 sm:h-[72px] bg-white dark:bg-[#051029] border-b-2 border-[#0057ff]/25 dark:border-[#2979ff]/30 shadow-[0_4px_24px_rgba(0,40,140,0.09)] ${className}`}
      >
        <div className="max-w-7xl mx-auto w-full h-full px-4 sm:px-6 lg:px-10 grid grid-cols-3 items-center">
          {/* Left: Menu Trigger */}
          <div className="flex items-center justify-start gap-3">
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className="w-10 h-10 -ml-1.5 rounded-full inline-flex items-center justify-center bg-white/80 dark:bg-white/10 border border-[#0057ff]/18 dark:border-[#6cb8ff]/25 text-foreground hover:text-[#0057ff] dark:hover:text-[#6cb8ff] hover:border-[#0057ff]/45 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0057ff]"
              aria-label="Open navigation menu"
              aria-expanded={isDrawerOpen}
              aria-controls="mobile-navigation-drawer"
            >
              <Menu size={20} />
            </motion.button>
          </div>

          {/* Center: Brand Wordmark */}
          <div className="flex items-center justify-center">
            <Link
              href="/"
              className="brand-logo-link group flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0057ff] rounded-full px-2 py-1"
              aria-label="主人公 ホーム"
            >
              <span
                className="brand-wordmark font-extrabold text-base md:text-lg tracking-widest uppercase transition-transform group-hover:scale-[1.03]"
                lang="ja"
              >
                {brandWordmark}
              </span>
            </Link>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center justify-end gap-1 sm:gap-2">
            <motion.button
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.93 }}
              ref={searchTriggerRef}
              type="button"
              onClick={() => setIsSearchDrawerOpen(true)}
              className="w-9 h-9 rounded-full inline-flex items-center justify-center text-foreground/85 hover:text-[#0057ff] dark:hover:text-[#6cb8ff] hover:bg-[#0057ff]/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0057ff]"
              aria-label="Search products"
            >
              <Search size={18} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.93 }}
              type="button"
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full inline-flex items-center justify-center text-foreground/85 hover:text-[#0057ff] dark:hover:text-[#6cb8ff] hover:bg-[#0057ff]/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0057ff]"
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </motion.button>

            <Link
              href="/account"
              className="w-9 h-9 rounded-full inline-flex items-center justify-center text-foreground/85 hover:text-[#0057ff] dark:hover:text-[#6cb8ff] hover:bg-[#0057ff]/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0057ff]"
              aria-label="Account"
            >
              <UserRound size={18} />
            </Link>

            <Link
              href="/bag"
              className="bag-link flex items-center gap-1.5 px-2.5 sm:px-3.5 h-9 rounded-full bg-white/80 dark:bg-white/10 border border-[#0057ff]/20 dark:border-[#6cb8ff]/25 text-foreground hover:border-[#0057ff] hover:text-[#0057ff] dark:hover:text-[#6cb8ff] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0057ff] group"
              aria-label={`Shopping bag, ${count} items`}
            >
              <div className="relative flex items-center gap-1.5">
                <ShoppingBag size={16} />
                <span className="bag-count">{count}</span>
              </div>
              <span className="hidden lg:inline text-[11px] font-bold tracking-wider uppercase ml-0.5">
                Bag
              </span>
            </Link>
          </div>
        </div>
      </header>

      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        brandWordmark={brandWordmark}
      />

      <SearchDrawer
        isOpen={isSearchDrawerOpen}
        onClose={() => setIsSearchDrawerOpen(false)}
        triggerRef={searchTriggerRef}
      />
    </>
  );
}

export default Navbar;
