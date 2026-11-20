"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const CATEGORIES = [
  "All",
  "Outerwear",
  "Tops",
  "Denim",
  "Accessories",
];

const MOCK_COLLECTIONS = [
  {
    id: "col-01",
    slug: "season-01-core",
    title: "Season 01 — Core Protagonist",
    subtitle: "Heavyweight drop-shoulder silhouettes in deep obsidian & gold hardware.",
    season: "Fall / Winter 2026",
    pieceCount: 14,
    badge: "Core Capsule",
    accent: "#244B75",
  },
  {
    id: "col-02",
    slug: "runway-archives",
    title: "Runway Archives & Outerwear",
    subtitle: "Tactical nylon blousons, structured wool coats, and metallic accents.",
    season: "Limited Edition",
    pieceCount: 8,
    badge: "Runway",
    accent: "#0B1F3A",
  },
  {
    id: "col-03",
    slug: "monochrome-series",
    title: "Monochrome Editorial Capsule",
    subtitle: "Sculptural boxy tees, washed denim, and refined Japanese kanji embroidery.",
    season: "Spring / Summer 2026",
    pieceCount: 12,
    badge: "Capsule Drop",
    accent: "#1a3a5c",
  },
  {
    id: "col-04",
    slug: "raw-denim-collection",
    title: "Selvedge & Wide-Leg Denim",
    subtitle: "Custom woven 14oz Japanese selvedge denim tailored with exaggerated drape.",
    season: "Permanent Collection",
    pieceCount: 6,
    badge: "Denim Lab",
    accent: "#0B1F3A",
  },
];

export default function CollectionsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  return (
    <div className="min-h-screen bg-[#F8F6F1] text-[#20242B]">

      {/* ── Editorial Header Banner ── */}
      <section className="bg-[#0B1F3A] text-[#F8F6F1] pt-20 pb-16 sm:pt-28 sm:pb-20 px-5 sm:px-8 border-b border-[#C6A76A]/15">
        <div className="max-w-6xl mx-auto">
          {/* Eyebrow */}
          <div className="flex items-center gap-4 mb-8">
            <span className="h-px w-10 bg-[#C6A76A]/50" aria-hidden="true" />
            <span className="text-[9px] uppercase tracking-[0.4em] text-[#C6A76A] font-medium">
              Seasonal Archive Releases
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div>
              <span
                className="text-[11px] uppercase tracking-[0.3em] font-medium text-[#C6A76A]/70 block mb-3"
                style={{
                  fontFamily: "'Zen Kaku Gothic New', 'Noto Sans JP', sans-serif",
                }}
              >
                主人公 · コレクション
              </span>
              <h1
                className="leading-none"
                style={{
                  fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                  fontSize: "clamp(42px, 6vw, 80px)",
                  fontWeight: 500,
                  letterSpacing: "-0.02em",
                  color: "#F8F6F1",
                  fontStyle: "italic",
                }}
              >
                Curated{" "}
                <span style={{ color: "#C6A76A", fontStyle: "normal", fontWeight: 300 }}>
                  Collections
                </span>
              </h1>
            </div>

            <p className="max-w-sm text-sm text-[#F8F6F1]/55 leading-relaxed font-light lg:text-right"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              Explore the architectural narrative of MainCharacter. High-density
              streetwear constructed with Japanese textile craftsmanship.
            </p>
          </div>
        </div>
      </section>

      {/* ── Filter Tabs ── */}
      <section className="border-b border-[#20242B]/8 bg-[#F8F6F1] sticky top-16 sm:top-20 z-30 shadow-[0_1px_0_rgba(11,31,58,0.06)]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1 min-w-max">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`py-2 px-5 text-[9px] uppercase tracking-[0.3em] font-medium transition-all duration-250 ${
                  selectedCategory === cat
                    ? "bg-[#0B1F3A] text-[#C6A76A]"
                    : "bg-transparent text-[#20242B]/50 hover:text-[#20242B] hover:bg-[#20242B]/5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Collections Grid ── */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-14 sm:pt-18 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {MOCK_COLLECTIONS.map((col, idx) => (
            <Link
              key={col.id}
              href={`/collections/${col.slug}`}
              className="group block"
            >
              <article className="bg-white overflow-hidden transition-all duration-500 hover:shadow-[0_8px_40px_rgba(11,31,58,0.12)] hover:-translate-y-1 border border-[#20242B]/[0.07]">
                {/* Collection Visual Plate */}
                <div
                  className="relative overflow-hidden flex items-center justify-center"
                  style={{
                    aspectRatio: idx === 0 ? "16/8" : "16/9",
                    background: `linear-gradient(135deg, ${col.accent} 0%, #0B1F3A 100%)`,
                  }}
                >
                  {/* Subtle pattern overlay */}
                  <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                      backgroundImage: "radial-gradient(circle, #C6A76A 1px, transparent 1px)",
                      backgroundSize: "24px 24px",
                    }}
                  />

                  {/* Brand watermark */}
                  <span
                    className="relative z-10 text-[#C6A76A]/20 font-black select-none transition-all duration-700 group-hover:text-[#C6A76A]/30 group-hover:scale-105"
                    style={{
                      fontFamily: "'Zen Kaku Gothic New', 'Noto Sans JP', sans-serif",
                      fontSize: "clamp(48px, 8vw, 96px)",
                      letterSpacing: "0.1em",
                    }}
                  >
                    主人公
                  </span>

                  {/* Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="inline-flex px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.3em] text-[#C6A76A] border border-[#C6A76A]/30 bg-[#0B1F3A]/70 backdrop-blur-sm">
                      {col.badge}
                    </span>
                  </div>

                  {/* Piece count */}
                  <div className="absolute bottom-4 right-4 z-10">
                    <span className="text-[10px] font-mono text-[#F8F6F1]/50">
                      {col.pieceCount} Silhouettes
                    </span>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-[#C6A76A]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Collection Info */}
                <div className="p-6 sm:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <span className="text-[9px] uppercase tracking-[0.35em] font-medium text-[#C6A76A] block">
                        {col.season}
                      </span>
                      <h2
                        className="text-[#0B1F3A] leading-tight transition-colors duration-250 group-hover:text-[#244B75]"
                        style={{
                          fontFamily: "'Cormorant Garamond', Georgia, serif",
                          fontSize: "clamp(18px, 2.2vw, 24px)",
                          fontWeight: 600,
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {col.title}
                      </h2>
                      <p className="text-xs text-[#20242B]/55 leading-relaxed font-light max-w-xs">
                        {col.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* View Link */}
                  <div className="mt-6 pt-5 border-t border-[#20242B]/[0.07] flex items-center justify-between">
                    <span className="text-[9px] text-[#20242B]/35 uppercase tracking-widest">
                      Ready to Ship
                    </span>
                    <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] font-semibold text-[#0B1F3A] group-hover:text-[#C6A76A] transition-colors duration-250">
                      <span>View Collection</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-350 group-hover:translate-x-1" strokeWidth={1.5} />
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* ── Newsletter / VIP Callout ── */}
        <div className="mt-16 relative overflow-hidden bg-[#0B1F3A] p-10 sm:p-14">
          {/* Decorative pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "radial-gradient(circle, #C6A76A 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
            aria-hidden="true"
          />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left space-y-3">
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <span className="h-px w-6 bg-[#C6A76A]/50" aria-hidden="true" />
                <span className="text-[9px] uppercase tracking-[0.4em] font-medium text-[#C6A76A]">
                  Private Member Priority
                </span>
              </div>
              <h3
                className="text-[#F8F6F1] leading-tight"
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "clamp(24px, 3vw, 36px)",
                  fontWeight: 500,
                  fontStyle: "italic",
                }}
              >
                Receive Exclusive Drop Alerts
              </h3>
              <p className="text-xs text-[#F8F6F1]/50 max-w-sm font-light leading-relaxed">
                Confidential access when limited edition protagonist runway garments are added to the vault.
              </p>
            </div>

            <Link
              href="/signup"
              className="shrink-0 group inline-flex items-center gap-3 py-4 px-10 bg-[#C6A76A] text-[#0B1F3A] text-[10px] uppercase tracking-[0.3em] font-semibold hover:bg-[#e0c487] transition-all duration-300"
            >
              <span>Create VIP Account</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-350 group-hover:translate-x-1" strokeWidth={2} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
