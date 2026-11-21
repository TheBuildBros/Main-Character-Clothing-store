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
  ArrowRight,
} from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const cartItemCount = useCartStore((s) => s.items.reduce((total, item) => total + item.quantity, 0));
  const wishlistItemCount = useWishlistStore((s) => s.itemIds.length);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when drawer open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { href: "/collections", label: "Collections" },
    { href: "/location", label: "Flagship" },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-500 ${
          scrolled
            ? "bg-[#091426]/98 backdrop-blur-xl shadow-[0_4px_32px_rgba(0,0,0,0.22)] border-b border-[#C6A76A]/15"
            : "bg-[#091426]/95 backdrop-blur-md border-b border-[#C6A76A]/18"
        }`}
      >
        <div className="flex h-16 sm:h-20 w-full items-center justify-between px-4 sm:px-8 lg:px-14 max-w-screen-2xl mx-auto">

          {/* ── Left Zone: Desktop Nav / Mobile Hamburger ── */}
          <div className="flex w-1/4 items-center justify-start gap-4 lg:gap-10">

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className="flex h-11 w-11 items-center justify-center rounded-sm text-[#C6A76A] transition-all duration-200 hover:text-[#e0c487] hover:bg-white/5 md:hidden"
            >
              <Menu className="h-5 w-5" strokeWidth={1.5} />
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-8 lg:gap-10 md:flex">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`relative py-1 text-[10px] uppercase tracking-[0.26em] font-medium transition-all duration-300 group ${
                    isActive(href)
                      ? "text-[#C6A76A]"
                      : "text-[#F5F2EA]/80 hover:text-[#C6A76A]"
                  }`}
                >
                  {label}
                  <span
                    className={`absolute -bottom-0.5 left-0 h-px transition-all duration-500 ease-out ${
                      isActive(href)
                        ? "w-full bg-[#C6A76A]"
                        : "w-0 bg-[#C6A76A] group-hover:w-full"
                    }`}
                  />
                </Link>
              ))}
            </nav>
          </div>

          {/* ── Center Zone: Brand Wordmark ── */}
          <div className="flex flex-1 items-center justify-center text-center">
            <Link
              href="/"
              aria-label="MainCharacter Home — 主人公"
              className="group inline-flex flex-col items-center justify-center gap-0.5 transition-all duration-300 hover:opacity-85"
            >
              <span
                className="text-[#C6A76A] font-black tracking-[0.3em] text-xl sm:text-2xl lg:text-[1.6rem] select-none leading-none pl-[0.3em] transition-all duration-300"
                style={{
                  fontFamily:
                    "'Zen Kaku Gothic New', 'Noto Sans JP', -apple-system, BlinkMacSystemFont, 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', 'Yu Gothic', Meiryo, sans-serif",
                }}
              >
                主人公
              </span>
              <span className="hidden sm:block text-[8px] text-[#F5F2EA]/35 tracking-[0.4em] uppercase font-light select-none">
                MainCharacter
              </span>
            </Link>
          </div>

          {/* ── Right Zone: Action Icons ── */}
          <div className="flex w-1/4 items-center justify-end gap-0.5 sm:gap-1 text-[#C6A76A]">

            {/* Store Location (desktop only) */}
            <Link
              href="/location"
              aria-label="Flagship Store Location"
              className={`hidden sm:flex h-10 w-10 items-center justify-center rounded-sm transition-all duration-200 hover:text-[#e0c487] hover:bg-white/5 ${
                isActive("/location") ? "text-[#e0c487] bg-white/5" : ""
              }`}
            >
              <MapPin className="h-4 w-4" strokeWidth={1.5} />
            </Link>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              aria-label={`Wishlist${isMounted && wishlistItemCount > 0 ? ` (${wishlistItemCount})` : ''}`}
              className={`relative flex h-11 w-11 sm:h-10 sm:w-10 items-center justify-center rounded-sm transition-all duration-200 hover:text-[#e0c487] hover:bg-white/5 ${
                isActive("/wishlist") ? "text-[#e0c487] bg-white/5" : ""
              }`}
            >
              <Bookmark className="h-4 w-4" strokeWidth={1.5} />
              {isMounted && wishlistItemCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#C6A76A] text-[9px] font-bold text-[#091426] leading-none">
                  {wishlistItemCount > 9 ? "9+" : wishlistItemCount}
                </span>
              )}
            </Link>

            {/* Account */}
            <Link
              href="/account"
              aria-label={
                isMounted && isAuthenticated
                  ? `Account — ${user?.username || "Member"}`
                  : "Account & Login"
              }
              className={`relative flex h-11 w-11 sm:h-10 sm:w-10 items-center justify-center rounded-sm transition-all duration-200 hover:text-[#e0c487] hover:bg-white/5 ${
                isActive("/account") || isActive("/login") || isActive("/signup")
                  ? "text-[#e0c487] bg-white/5"
                  : ""
              }`}
            >
              <User className="h-4 w-4" strokeWidth={1.5} />
              {isMounted && isAuthenticated && (
                <span className="absolute bottom-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-[#C6A76A] ring-[1.5px] ring-[#091426]" />
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/carts"
              aria-label={`Shopping Bag${isMounted && cartItemCount > 0 ? ` (${cartItemCount})` : ''}`}
              className={`relative flex h-11 w-11 sm:h-10 sm:w-10 items-center justify-center rounded-sm transition-all duration-200 hover:text-[#e0c487] hover:bg-white/5 ${
                isActive("/carts") || isActive("/cart")
                  ? "text-[#e0c487] bg-white/5"
                  : ""
              }`}
            >
              <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
              {isMounted && cartItemCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#C6A76A] text-[9px] font-bold text-[#091426] leading-none">
                  {cartItemCount > 9 ? "9+" : cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* ── Mobile Navigation Drawer ── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] flex md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div className="relative flex w-[82%] max-w-xs flex-col bg-[#091426] text-[#F5F2EA] shadow-2xl border-r border-[#C6A76A]/15 z-10 overflow-y-auto">

            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 pt-7 pb-6 border-b border-[#C6A76A]/15">
              <div className="flex flex-col gap-0.5">
                <span
                  className="text-[#C6A76A] font-black tracking-[0.25em] text-xl leading-none"
                  style={{
                    fontFamily: "'Zen Kaku Gothic New', 'Noto Sans JP', sans-serif",
                  }}
                >
                  主人公
                </span>
                <span className="text-[8px] text-[#F5F2EA]/30 tracking-[0.4em] uppercase">
                  MainCharacter
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
                className="flex h-10 w-10 items-center justify-center rounded-sm text-[#C6A76A] hover:bg-white/5 transition-colors"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>

            {/* Drawer Nav Links */}
            <div className="flex flex-col px-6 py-7 gap-1">
              {[
                { href: "/collections", label: "Collections" },
                { href: "/location", label: "Flagship Store" },
                { href: "/wishlist", label: "Wishlist", count: isMounted ? wishlistItemCount : 0 },
                { href: "/carts", label: "Shopping Bag", count: isMounted ? cartItemCount : 0 },
                { href: "/account", label: isMounted && isAuthenticated ? (user?.username || "My Account") : "Account / Login" },
              ].map(({ href, label, count }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-4 text-sm uppercase tracking-[0.22em] font-medium text-[#F5F2EA]/80 hover:text-[#C6A76A] border-b border-white/[0.05] transition-colors duration-200 group"
                >
                  <span>{label}</span>
                  <div className="flex items-center gap-2">
                    {count !== undefined && count > 0 && (
                      <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[#C6A76A] text-[9px] font-bold text-[#091426] px-1.5">
                        {count}
                      </span>
                    )}
                    <ArrowRight className="h-3.5 w-3.5 text-[#C6A76A]/50 group-hover:text-[#C6A76A] transition-colors" strokeWidth={1.5} />
                  </div>
                </Link>
              ))}
            </div>

            {/* Drawer Footer CTA */}
            <div className="mt-auto px-6 pb-8 pt-6 border-t border-[#C6A76A]/15">
              {isMounted && isAuthenticated ? (
                <div className="space-y-3">
                  <div className="text-[9px] uppercase tracking-[0.3em] text-[#F5F2EA]/40">
                    Signed in as
                  </div>
                  <div className="text-sm font-medium text-[#F5F2EA] truncate">
                    {user?.email}
                  </div>
                  <Link
                    href="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="mt-2 block w-full text-center py-3 rounded-sm bg-[#C6A76A]/10 text-[#C6A76A] text-[10px] uppercase tracking-[0.25em] font-semibold border border-[#C6A76A]/30 hover:bg-[#C6A76A] hover:text-[#091426] transition-all duration-250"
                  >
                    View Account
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-center py-3 rounded-sm bg-transparent text-[#C6A76A] text-[10px] uppercase tracking-[0.2em] font-semibold border border-[#C6A76A]/35 hover:bg-[#C6A76A]/10 transition-colors duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-center py-3 rounded-sm bg-[#C6A76A] text-[#091426] text-[10px] uppercase tracking-[0.2em] font-semibold hover:bg-[#e0c487] transition-colors duration-200"
                  >
                    Join
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
