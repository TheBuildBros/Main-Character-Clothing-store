"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MapPin,
  ShoppingBag,
  User,
  Bookmark,
  Menu,
  X,
  Compass,
  ArrowRight,
} from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const cartItemCount = useCartStore((s) => s.getTotalItems());
  const wishlistItemCount = useWishlistStore((s) => s.getTotalItems());

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-[#091426]/95 backdrop-blur-md border-b border-[#C6A15B]/20 transition-colors">
        <div className="flex h-16 sm:h-20 w-full items-center justify-between px-4 sm:px-8 lg:px-12">
          {/* Left Zone (Desktop: Navigation Links, Mobile: Hamburger Menu) */}
          <div className="flex w-1/4 items-center justify-start gap-4 lg:gap-8">
            {/* Mobile Menu Button with 44px min touch target */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open mobile navigation menu"
              className="flex h-11 w-11 items-center justify-center rounded-md text-[#C6A15B] transition-colors hover:text-[#e0c487] hover:bg-[#101D35]/50 md:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden items-center gap-6 lg:gap-8 text-[11px] lg:text-xs uppercase tracking-[0.22em] font-medium md:flex">
              <Link
                href="/collections"
                className={`transition-colors py-1 relative ${
                  isActive("/collections")
                    ? "text-[#C6A15B] font-semibold"
                    : "text-[#F5F2EA]/85 hover:text-[#C6A15B]"
                }`}
              >
                Collections
                {isActive("/collections") && (
                  <span className="absolute bottom-0 left-0 h-[2px] w-full bg-[#C6A15B]" />
                )}
              </Link>

              <Link
                href="/location"
                className={`inline-flex items-center gap-1.5 transition-colors py-1 relative ${
                  isActive("/location")
                    ? "text-[#C6A15B] font-semibold"
                    : "text-[#F5F2EA]/85 hover:text-[#C6A15B]"
                }`}
              >
                <MapPin className="h-3.5 w-3.5 text-[#C6A15B]" />
                <span>Store</span>
                {isActive("/location") && (
                  <span className="absolute bottom-0 left-0 h-[2px] w-full bg-[#C6A15B]" />
                )}
              </Link>
            </nav>
          </div>

          {/* Center Zone: Japanese Brand Wordmark Logo */}
          <div className="flex w-2/4 items-center justify-center text-center">
            <Link
              href="/"
              aria-label="MainCharacter Home - 主人公"
              className="group inline-flex items-center justify-center transition-transform hover:scale-[1.02]"
            >
              <span
                className="text-[#C6A15B] font-black tracking-[0.24em] text-xl sm:text-2xl md:text-2xl lg:text-3xl select-none leading-none pl-[0.24em] transition-colors group-hover:text-[#e0c487]"
                style={{
                  fontFamily:
                    "'Zen Kaku Gothic New', 'Noto Sans JP', -apple-system, BlinkMacSystemFont, 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', 'Yu Gothic', Meiryo, sans-serif",
                }}
              >
                主人公
              </span>
            </Link>
          </div>

          {/* Right Zone: Action Icons */}
          <div className="flex w-1/4 items-center justify-end gap-1.5 sm:gap-4 lg:gap-6 text-[#C6A15B]">
            {/* Desktop Store Location Icon */}
            <Link
              href="/location"
              aria-label="Store Location"
              className={`hidden sm:flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:text-[#e0c487] hover:bg-[#101D35]/50 ${
                isActive("/location") ? "bg-[#101D35] text-[#e0c487]" : ""
              }`}
            >
              <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
            </Link>

            {/* Wishlist Icon with count */}
            <Link
              href="/wishlist"
              aria-label="Saved products"
              className={`relative flex h-11 w-11 sm:h-10 sm:w-10 items-center justify-center rounded-full transition-colors hover:text-[#e0c487] hover:bg-[#101D35]/50 ${
                isActive("/wishlist") ? "bg-[#101D35] text-[#e0c487]" : ""
              }`}
            >
              <Bookmark className="h-4 w-4 sm:h-5 sm:w-5" />
              {isMounted && wishlistItemCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#C6A15B] text-[10px] font-bold text-[#091426]">
                  {wishlistItemCount}
                </span>
              )}
            </Link>

            {/* Account Icon */}
            <Link
              href="/account"
              aria-label={
                isMounted && isAuthenticated
                  ? `Account (${user?.username || "Logged In"})`
                  : "Customer Account"
              }
              className={`relative flex h-11 w-11 sm:h-10 sm:w-10 items-center justify-center rounded-full transition-colors hover:text-[#e0c487] hover:bg-[#101D35]/50 ${
                isActive("/account") || isActive("/login") || isActive("/signup")
                  ? "bg-[#101D35] text-[#e0c487]"
                  : ""
              }`}
            >
              <User className="h-4 w-4 sm:h-5 sm:w-5" />
              {isMounted && isAuthenticated && (
                <span className="absolute bottom-1.5 right-1.5 h-2 w-2 rounded-full bg-[#C6A15B] ring-2 ring-[#091426]" />
              )}
            </Link>

            {/* Cart Icon with count (links to /carts) */}
            <Link
              href="/carts"
              aria-label="Shopping Cart"
              className={`relative flex h-11 w-11 sm:h-10 sm:w-10 items-center justify-center rounded-full transition-colors hover:text-[#e0c487] hover:bg-[#101D35]/50 ${
                isActive("/carts") || isActive("/cart")
                  ? "bg-[#101D35] text-[#e0c487]"
                  : ""
              }`}
            >
              <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
              {isMounted && cartItemCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#C6A15B] text-[10px] font-bold text-[#091426]">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Content */}
          <div className="relative flex w-[85%] max-w-sm flex-col bg-[#091426] text-[#F5F2EA] shadow-2xl border-r border-[#C6A15B]/20 p-6 z-10 overflow-y-auto">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-6 border-b border-[#C6A15B]/20">
              <span
                className="text-[#C6A15B] font-black tracking-[0.2em] text-xl"
                style={{
                  fontFamily:
                    "'Zen Kaku Gothic New', 'Noto Sans JP', sans-serif",
                }}
              >
                主人公
              </span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close navigation menu"
                className="flex h-11 w-11 items-center justify-center rounded-md text-[#C6A15B] hover:bg-[#101D35]"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Drawer Navigation Links */}
            <div className="flex flex-col py-6 space-y-4">
              <Link
                href="/collections"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-3 text-base uppercase tracking-[0.2em] font-medium text-[#F5F2EA] hover:text-[#C6A15B] border-b border-white/5"
              >
                <span>Collections</span>
                <ArrowRight className="h-4 w-4 text-[#C6A15B]" />
              </Link>

              <Link
                href="/location"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-3 text-base uppercase tracking-[0.2em] font-medium text-[#F5F2EA] hover:text-[#C6A15B] border-b border-white/5"
              >
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-[#C6A15B]" />
                  <span>Store Location</span>
                </div>
                <ArrowRight className="h-4 w-4 text-[#C6A15B]" />
              </Link>

              <Link
                href="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-3 text-base uppercase tracking-[0.2em] font-medium text-[#F5F2EA] hover:text-[#C6A15B] border-b border-white/5"
              >
                <div className="flex items-center gap-3">
                  <Bookmark className="h-4 w-4 text-[#C6A15B]" />
                  <span>Wishlist</span>
                </div>
                {isMounted && wishlistItemCount > 0 && (
                  <span className="rounded-full bg-[#C6A15B] px-2 py-0.5 text-xs font-bold text-[#091426]">
                    {wishlistItemCount}
                  </span>
                )}
              </Link>

              <Link
                href="/carts"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-3 text-base uppercase tracking-[0.2em] font-medium text-[#F5F2EA] hover:text-[#C6A15B] border-b border-white/5"
              >
                <div className="flex items-center gap-3">
                  <ShoppingBag className="h-4 w-4 text-[#C6A15B]" />
                  <span>Cart</span>
                </div>
                {isMounted && cartItemCount > 0 && (
                  <span className="rounded-full bg-[#C6A15B] px-2 py-0.5 text-xs font-bold text-[#091426]">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              <Link
                href="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-3 text-base uppercase tracking-[0.2em] font-medium text-[#F5F2EA] hover:text-[#C6A15B] border-b border-white/5"
              >
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-[#C6A15B]" />
                  <span>
                    {isMounted && isAuthenticated
                      ? user?.username || "Account Details"
                      : "Account / Login"}
                  </span>
                </div>
                <ArrowRight className="h-4 w-4 text-[#C6A15B]" />
              </Link>
            </div>

            {/* Drawer Footer Account CTA */}
            <div className="mt-auto pt-6 border-t border-[#C6A15B]/20">
              {isMounted && isAuthenticated ? (
                <div className="space-y-3">
                  <div className="text-xs text-[#F5F2EA]/60 uppercase tracking-widest">
                    Signed in as
                  </div>
                  <div className="font-semibold text-[#F5F2EA] truncate">
                    {user?.email}
                  </div>
                  <Link
                    href="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center py-3 rounded-md bg-[#101D35] text-[#C6A15B] text-xs uppercase tracking-widest font-semibold border border-[#C6A15B]/40 hover:bg-[#C6A15B] hover:text-[#091426] transition-colors"
                  >
                    View Account & Saved Addresses
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-center py-2.5 rounded-md bg-[#101D35] text-[#C6A15B] text-xs uppercase tracking-widest font-semibold border border-[#C6A15B]/40"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-center py-2.5 rounded-md bg-[#C6A15B] text-[#091426] text-xs uppercase tracking-widest font-semibold hover:bg-[#e0c487]"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
