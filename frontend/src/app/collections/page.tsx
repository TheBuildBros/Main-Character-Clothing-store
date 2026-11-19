"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Layers, Tag, Eye } from "lucide-react";

const CATEGORIES = [
  "All Collections",
  "Heavyweight Hoodies",
  "Oversized Boxy Tees",
  "Technical Outerwear",
  "Wide-Leg Denim",
  "Accessories & Headwear",
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
  },
  {
    id: "col-02",
    slug: "runway-archives",
    title: "Runway Archives & Outerwear",
    subtitle: "Tactical nylon blousons, structured wool coats, and metallic accents.",
    season: "Limited Edition",
    pieceCount: 8,
    badge: "Runway",
  },
  {
    id: "col-03",
    slug: "monochrome-series",
    title: "Monochrome Editorial Capsule",
    subtitle: "Sculptural boxy tees, washed denim, and refined Japanese kanji embroidery.",
    season: "Spring / Summer 2026",
    pieceCount: 12,
    badge: "Capsule Drop",
  },
  {
    id: "col-04",
    slug: "raw-denim-collection",
    title: "Selvedge & Wide-Leg Denim",
    subtitle: "Custom woven 14oz Japanese selvedge denim tailored with exaggerated drape.",
    season: "Permanent Collection",
    pieceCount: 6,
    badge: "Denim Lab",
  },
];

export default function CollectionsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Collections");

  return (
    <main className="min-h-screen bg-[#F5F2EA] text-[#091426] pb-24">
      {/* Editorial Header Banner */}
      <section className="bg-[#091426] text-[#F5F2EA] py-16 sm:py-24 px-4 sm:px-8 border-b border-[#C6A15B]/20">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#101D35] border border-[#C6A15B]/40 text-[#C6A15B] text-xs uppercase tracking-[0.25em] font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Seasonal Archive Releases</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <span
                className="text-xs uppercase tracking-[0.25em] font-bold text-[#C6A15B] block"
                style={{
                  fontFamily:
                    "'Zen Kaku Gothic New', 'Noto Sans JP', sans-serif",
                }}
              >
                主人公 &bull; コレクション
              </span>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-[0.16em] text-[#F5F2EA] mt-1">
                Curated <span className="text-[#C6A15B]">Collections</span>
              </h1>
            </div>

            <p className="max-w-md text-xs sm:text-sm text-[#F5F2EA]/70 tracking-wider font-light leading-relaxed">
              Explore the architectural narrative of MainCharacter. High-density
              streetwear silhouettes constructed with Japanese textile craftsmanship.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Category Pills */}
      <section className="border-b border-[#091426]/10 bg-white sticky top-16 sm:top-20 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-3.5 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 sm:gap-3 min-w-max">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`py-2 px-4 rounded-full text-xs uppercase tracking-wider font-semibold transition-all ${
                  selectedCategory === cat
                    ? "bg-[#091426] text-[#C6A15B] shadow-sm"
                    : "bg-[#F5F2EA] text-[#091426]/75 hover:bg-[#091426]/5 hover:text-[#091426]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Collections Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-12 sm:pt-16 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {MOCK_COLLECTIONS.map((col) => (
            <div
              key={col.id}
              className="group bg-white rounded-xl border border-[#091426]/10 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              {/* Collection Image Banner Placeholder */}
              <div className="relative aspect-[16/10] bg-[#091426] text-[#F5F2EA] overflow-hidden flex items-center justify-center p-8 text-center border-b border-[#091426]/10">
                <div className="absolute inset-0 bg-gradient-to-t from-[#091426] via-[#101D35] to-[#091426] opacity-90 group-hover:scale-105 transition-transform duration-700" />
                <div className="relative z-10 space-y-2">
                  <span
                    className="text-4xl sm:text-5xl font-black text-[#C6A15B]/40 tracking-widest block select-none"
                    style={{
                      fontFamily:
                        "'Zen Kaku Gothic New', 'Noto Sans JP', sans-serif",
                    }}
                  >
                    主人公
                  </span>
                  <span className="text-[11px] font-mono text-[#F5F2EA]/60 uppercase tracking-widest block">
                    [Collection Campaign Visual Placeholder]
                  </span>
                </div>

                <div className="absolute top-4 left-4 z-10">
                  <span className="px-2.5 py-1 rounded bg-[#101D35]/80 backdrop-blur-sm border border-[#C6A15B]/30 text-[10px] font-bold text-[#C6A15B] uppercase tracking-wider">
                    {col.badge}
                  </span>
                </div>

                <div className="absolute bottom-4 right-4 z-10 text-[11px] font-mono text-[#F5F2EA]/60 bg-black/40 px-2 py-0.5 rounded backdrop-blur-xs">
                  {col.pieceCount} Silhouettes
                </div>
              </div>

              {/* Collection Metadata & Description */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-2">
                  <div className="text-[11px] uppercase tracking-widest font-bold text-[#C6A15B]">
                    {col.season}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-[#091426] group-hover:text-[#101D35] transition-colors">
                    {col.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#091426]/70 leading-relaxed font-light">
                    {col.subtitle}
                  </p>
                </div>

                <div className="pt-4 border-t border-black/[0.06] flex items-center justify-between">
                  <span className="text-xs text-[#091426]/50 uppercase tracking-wider font-mono">
                    Catalog Ready
                  </span>
                  <Link
                    href={`/collections/${col.slug}`}
                    className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-[#091426] group-hover:text-[#C6A15B] transition-colors"
                  >
                    <span>View Collection</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lookbook / Future Drop Newsletter Callout */}
        <div className="rounded-xl bg-[#091426] text-[#F5F2EA] p-8 sm:p-12 border border-[#C6A15B]/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs uppercase tracking-widest font-bold text-[#C6A15B]">
              Private Member Priority
            </span>
            <h3 className="text-2xl font-black uppercase tracking-wider">
              Notify Me on Future Drops
            </h3>
            <p className="text-xs text-[#F5F2EA]/70 max-w-md font-light">
              Receive confidential alerts when limited edition protagonist runway garments are added to the vault.
            </p>
          </div>

          <Link
            href="/signup"
            className="shrink-0 py-3.5 px-8 rounded-md bg-[#C6A15B] text-[#091426] text-xs uppercase tracking-widest font-bold hover:bg-[#e0c487] transition-all shadow-sm"
          >
            Create VIP Account
          </Link>
        </div>
      </div>
    </main>
  );
}
