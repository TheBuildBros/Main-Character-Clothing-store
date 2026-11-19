import Link from "next/link";
import { MapPin, Mail, Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto bg-[#091426] text-[#F5F2EA] border-t border-[#C6A15B]/20 pt-16 pb-12 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-2">
            <span
              className="text-3xl font-black text-[#C6A15B] tracking-widest block"
              style={{
                fontFamily:
                  "'Zen Kaku Gothic New', 'Noto Sans JP', sans-serif",
              }}
            >
              主人公
            </span>
            <p className="text-xs text-[#F5F2EA]/60 max-w-sm tracking-wide leading-relaxed">
              MainCharacter &bull; High-density protagonist streetwear engineered
              with bespoke Japanese tailoring and minimalist aesthetics.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-[#C6A15B]">
              Navigation
            </h4>
            <ul className="text-xs text-[#F5F2EA]/75 space-y-2 uppercase tracking-wider">
              <li>
                <Link href="/collections" className="hover:text-[#C6A15B] transition-colors">
                  Collections
                </Link>
              </li>
              <li>
                <Link href="/location" className="hover:text-[#C6A15B] transition-colors">
                  Flagship Store
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-[#C6A15B] transition-colors">
                  Wishlist
                </Link>
              </li>
              <li>
                <Link href="/carts" className="hover:text-[#C6A15B] transition-colors">
                  Shopping Bag
                </Link>
              </li>
            </ul>
          </div>

          {/* Client Concierge */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-[#C6A15B]">
              Customer Care
            </h4>
            <ul className="text-xs text-[#F5F2EA]/75 space-y-2 uppercase tracking-wider">
              <li>
                <Link href="/account" className="hover:text-[#C6A15B] transition-colors">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-[#C6A15B] transition-colors">
                  OTP Login
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-[#C6A15B] transition-colors">
                  VIP Registration
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#F5F2EA]/40 gap-4">
          <p>&copy; 2026 MainCharacter (主人公). All rights reserved.</p>
          <p className="tracking-widest uppercase">Deep Navy + Warm Gold Edition</p>
        </div>
      </div>
    </footer>
  );
}
