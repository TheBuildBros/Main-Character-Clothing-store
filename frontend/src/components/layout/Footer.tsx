import Link from "next/link";
import { MapPin, Mail, Globe, Share2 } from "lucide-react";

export default function Footer() {
  const year = 2026;

  return (
    <footer className="bg-[#091426] text-[#F5F2EA] border-t border-[#C6A76A]/15">

      {/* ── Luxury Marquee Ticker ── */}
      <div className="border-b border-[#C6A76A]/12 py-3 overflow-hidden">
        <div className="marquee-track select-none" aria-hidden="true">
          {[...Array(2)].map((_, pass) => (
            <div key={pass} className="flex items-center gap-0">
              {[
                "New Season Arrivals",
                "主人公",
                "Free Shipping on ¥20,000+",
                "主人公",
                "Flagship Tokyo",
                "主人公",
                "Limited Edition Drops",
                "主人公",
                "Protagonist Collection",
                "主人公",
                "Sustainable Tailoring",
                "主人公",
              ].map((text, i) => (
                <span
                  key={i}
                  className={`px-6 text-[10px] uppercase tracking-[0.3em] font-medium whitespace-nowrap ${
                    text === "主人公"
                      ? "text-[#C6A76A]"
                      : "text-[#F5F2EA]/45"
                  }`}
                  style={
                    text === "主人公"
                      ? { fontFamily: "'Zen Kaku Gothic New', 'Noto Sans JP', sans-serif" }
                      : {}
                  }
                >
                  {text}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── Main Footer Grid ── */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16">

          {/* Brand Column */}
          <div className="md:col-span-5 space-y-6">
            <div>
              <span
                className="text-[#C6A76A] font-black tracking-[0.3em] text-3xl block leading-none mb-1"
                style={{
                  fontFamily: "'Zen Kaku Gothic New', 'Noto Sans JP', sans-serif",
                }}
              >
                主人公
              </span>
              <span className="text-[9px] text-[#F5F2EA]/30 tracking-[0.45em] uppercase block">
                MainCharacter — Est. 2026
              </span>
            </div>

            <p
              className="text-[13px] text-[#F5F2EA]/55 leading-[1.9] max-w-[320px] font-light"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic" }}
            >
              Protagonist luxury streetwear — engineered with bespoke Japanese
              tailoring, minimalist editorial aesthetics, and uncompromising
              material integrity.
            </p>

            {/* Social / Channel Icons */}
            <div className="flex items-center gap-3 pt-1">
              <button
                aria-label="Global Presence"
                className="flex h-9 w-9 items-center justify-center rounded-sm border border-[#C6A76A]/20 text-[#F5F2EA]/40 hover:text-[#C6A76A] hover:border-[#C6A76A]/50 transition-all duration-250"
              >
                <Globe className="h-3.5 w-3.5" strokeWidth={1.5} />
              </button>
              <button
                aria-label="Share Collection"
                className="flex h-9 w-9 items-center justify-center rounded-sm border border-[#C6A76A]/20 text-[#F5F2EA]/40 hover:text-[#C6A76A] hover:border-[#C6A76A]/50 transition-all duration-250"
              >
                <Share2 className="h-3.5 w-3.5" strokeWidth={1.5} />
              </button>
              <button
                aria-label="Contact Concierge"
                className="flex h-9 w-9 items-center justify-center rounded-sm border border-[#C6A76A]/20 text-[#F5F2EA]/40 hover:text-[#C6A76A] hover:border-[#C6A76A]/50 transition-all duration-250"
              >
                <Mail className="h-3.5 w-3.5" strokeWidth={1.5} />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-5">
            <h4 className="text-[9px] uppercase tracking-[0.35em] font-semibold text-[#C6A76A]">
              Navigate
            </h4>
            <ul className="space-y-3">
              {[
                { href: "/collections", label: "Collections" },
                { href: "/location", label: "Flagship Store" },
                { href: "/wishlist", label: "Wishlist" },
                { href: "/carts", label: "Shopping Bag" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-[11px] text-[#F5F2EA]/50 hover:text-[#C6A76A] uppercase tracking-[0.2em] transition-colors duration-200 font-medium"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Client Care */}
          <div className="md:col-span-4 space-y-5">
            <h4 className="text-[9px] uppercase tracking-[0.35em] font-semibold text-[#C6A76A]">
              Client Care
            </h4>
            <ul className="space-y-3">
              {[
                { href: "/account", label: "My Account" },
                { href: "/login", label: "Member Login" },
                { href: "/signup", label: "VIP Registration" },
                { href: "/checkout", label: "Checkout" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-[11px] text-[#F5F2EA]/50 hover:text-[#C6A76A] uppercase tracking-[0.2em] transition-colors duration-200 font-medium"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Store Locator Callout */}
            <div className="mt-6 p-4 border border-[#C6A76A]/15 rounded-sm space-y-2">
              <div className="flex items-center gap-2 text-[#C6A76A]">
                <MapPin className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
                <span className="text-[9px] uppercase tracking-[0.25em] font-semibold">
                  Flagship Store
                </span>
              </div>
              <p className="text-[11px] text-[#F5F2EA]/45 leading-relaxed">
                Shibuya-ku, Tokyo 150-0001<br />
                Mon–Sat: 11:00–21:00
              </p>
            </div>
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div className="mt-14 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-[#F5F2EA]/30 tracking-widest">
            © {year} MainCharacter (主人公). All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-[10px] text-[#F5F2EA]/25 tracking-[0.3em] uppercase">
              Deep Navy + Champagne Gold
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
