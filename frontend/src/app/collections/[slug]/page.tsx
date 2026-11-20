import Link from "next/link";
import { ArrowLeft, ArrowRight, Eye, ShoppingBag } from "lucide-react";

export function generateStaticParams() {
  return [
    { slug: "season-01-core" },
    { slug: "runway-archives" },
    { slug: "monochrome-series" },
    { slug: "raw-denim-collection" },
    { slug: "jeans" },
    { slug: "t-shirts" },
    { slug: "shirts" },
    { slug: "pants" },
    { slug: "jerseys" },
    { slug: "jackets" },
  ];
}

interface ProductItem {
  id: number;
  name: string;
  category: string;
  price: number;
  material: string;
  badge?: string;
}

const PRODUCTS_BY_COLLECTION: Record<string, ProductItem[]> = {
  "season-01-core": [
    { id: 1, name: "Heavyweight Boxy Hoodie", category: "Knitwear", price: 240, material: "500 GSM Japanese Loopwheel Cotton", badge: "Core Iconic" },
    { id: 2, name: "Drop-Shoulder Oversized Tee", category: "Jersey", price: 120, material: "300 GSM Combed Organic Cotton", badge: "Essential" },
    { id: 3, name: "Wide-Leg Selvedge Pant", category: "Denim", price: 290, material: "14oz Okayama Selvedge Denim" },
    { id: 4, name: "Minimalist Utility Blouson", category: "Outerwear", price: 420, material: "Tactical Technical Gabardine", badge: "Signature" },
    { id: 5, name: "Tailored Relaxed Trouser", category: "Tailoring", price: 260, material: "Tropical Virgin Wool" },
    { id: 6, name: "Heavyweight Overshirt", category: "Shirting", price: 210, material: "Dense Cotton Twill" },
  ],
  "runway-archives": [
    { id: 1, name: "Architectural Wool Overcoat", category: "Runway", price: 780, material: "Double-Faced Cashmere Wool", badge: "Archive #01" },
    { id: 2, name: "Structured Cropped Bomber", category: "Runway", price: 460, material: "Bonded Technical Twill", badge: "Runway Piece" },
    { id: 3, name: "Asymmetrical Cargo Trouser", category: "Runway", price: 340, material: "Water-Repellent Ripstop" },
    { id: 4, name: "Bespoke Mockneck Knit", category: "Knitwear", price: 280, material: "Ultra-Fine Merino Blend" },
    { id: 5, name: "Sculptural Kimono Trench", category: "Outerwear", price: 820, material: "Japanese Silk-Cotton Twill", badge: "Limited 30" },
    { id: 6, name: "Metallic Accent Flight Vest", category: "Outerwear", price: 320, material: "Brushed Nylon & Brass Hardware" },
  ],
  "monochrome-series": [
    { id: 1, name: "Obsidian Boxy Tee", category: "Tops", price: 110, material: "Deep Black Carbon Wash Cotton" },
    { id: 2, name: "Bone Ivory Relaxed Shirt", category: "Shirting", price: 190, material: "Sand-Washed Cupro", badge: "Bespoke" },
    { id: 3, name: "Pleated Wide Trouser", category: "Trousers", price: 260, material: "Micro-Twill Japanese Suiting" },
    { id: 4, name: "Monochrome Minimalist Parka", category: "Outerwear", price: 480, material: "Coated Compact Poplin" },
    { id: 5, name: "Graphic Kanji Rib Knit", category: "Knitwear", price: 250, material: "Spun Cotton Bouclé", badge: "Embroidery" },
    { id: 6, name: "Relaxed Drawstring Pant", category: "Trousers", price: 220, material: "Medium-Weight Cotton Twill" },
  ],
  "raw-denim-collection": [
    { id: 1, name: "14oz Indigo Selvedge Jean", category: "Denim", price: 310, material: "Raw Unwashed Okayama Denim", badge: "Permanent" },
    { id: 2, name: "Selvedge Denim Trucker Jacket", category: "Denim", price: 380, material: "14oz White-Line Selvedge", badge: "Permanent" },
    { id: 3, name: "Wide-Leg Washed Indigo Jean", category: "Denim", price: 290, material: "Vintage Stone-Washed Selvedge" },
    { id: 4, name: "Black Selvedge Straight Cut", category: "Denim", price: 310, material: "Sulfur-Dyed Black Selvedge" },
    { id: 5, name: "Selvedge Denim Chore Coat", category: "Denim", price: 360, material: "Nep Selvedge Denim" },
    { id: 6, name: "Denim Bucket & Tote Capsule", category: "Accessories", price: 140, material: "Selvedge Off-Cuts Upcycled" },
  ],
};

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const formattedTitle = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const products = PRODUCTS_BY_COLLECTION[slug] || PRODUCTS_BY_COLLECTION["season-01-core"];

  return (
    <main className="min-h-screen bg-[#F8F6F1] text-[#20242B] pb-24">
      {/* Header Banner */}
      <section className="bg-[#0B1F3A] text-[#F8F6F1] pt-16 pb-14 sm:pt-20 sm:pb-18 px-5 sm:px-8 border-b border-[#C6A76A]/15">
        <div className="max-w-6xl mx-auto space-y-6">
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] font-semibold text-[#C6A76A] hover:text-[#e0c487] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
            <span>Return to All Collections</span>
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-2">
              <span
                className="text-[9px] uppercase tracking-[0.4em] font-medium text-[#C6A76A]/70 block"
                style={{
                  fontFamily: "'Zen Kaku Gothic New', 'Noto Sans JP', sans-serif",
                }}
              >
                主人公 · カプセルコレクション
              </span>
              <h1
                className="text-4xl sm:text-6xl text-[#F8F6F1]"
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontWeight: 600,
                  fontStyle: "italic",
                }}
              >
                {formattedTitle}
              </h1>
            </div>

            <p
              className="max-w-md text-sm text-[#F8F6F1]/55 leading-relaxed font-light"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              Exemplary silhouettes crafted with meticulous Japanese precision,
              heavyweight custom textiles, and tailored protagonist ergonomics.
            </p>
          </div>
        </div>
      </section>

      {/* Catalog Grid */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-12 space-y-8">
        {/* Meta Filter Row */}
        <div className="flex items-center justify-between pb-4 border-b border-[#20242B]/[0.08]">
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#0B1F3A]">
              Silhouettes ({products.length})
            </span>
            <span className="text-[#C6A76A]">·</span>
            <span className="text-[10px] text-[#20242B]/50 uppercase tracking-widest font-mono">
              Edition: {slug}
            </span>
          </div>

          <span className="text-[10px] text-[#20242B]/50 uppercase tracking-widest font-light">
            Tokyo Atelier Dispatch
          </span>
        </div>

        {/* Minimal Luxury Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {products.map((item) => (
            <article
              key={item.id}
              className="group bg-white border border-[#20242B]/[0.07] overflow-hidden flex flex-col justify-between transition-all duration-400 hover:shadow-[0_8px_36px_rgba(11,31,58,0.1)] hover:-translate-y-1"
            >
              {/* Product Visual Frame */}
              <div className="relative aspect-[3/4] bg-[#F8F6F1] overflow-hidden flex items-center justify-center p-8 border-b border-[#20242B]/[0.06]">
                {/* Subtle background glow */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Placeholder silhouette visual */}
                <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-2 select-none">
                  <span
                    className="text-4xl text-[#0B1F3A]/20 font-black group-hover:text-[#0B1F3A]/30 transition-colors duration-400"
                    style={{ fontFamily: "'Zen Kaku Gothic New', sans-serif" }}
                  >
                    主人公
                  </span>
                  <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#20242B]/40">
                    Piece #{item.id}
                  </span>
                </div>

                {/* Badge if present */}
                {item.badge && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.25em] text-[#0B1F3A] bg-[#C6A76A]/20 border border-[#C6A76A]/30">
                      {item.badge}
                    </span>
                  </div>
                )}

                {/* Quick View Hover Overlay Button */}
                <div className="absolute inset-x-4 bottom-4 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <Link
                    href={`/carts`}
                    className="w-full py-2.5 bg-[#0B1F3A]/90 backdrop-blur-md text-[#C6A76A] hover:bg-[#C6A76A] hover:text-[#0B1F3A] text-[9px] uppercase tracking-[0.25em] font-semibold flex items-center justify-center gap-2 border border-[#C6A76A]/40 transition-colors"
                  >
                    <ShoppingBag className="h-3 w-3" strokeWidth={1.5} />
                    <span>Quick Select</span>
                  </Link>
                </div>
              </div>

              {/* Product Details & Minimal Pricing */}
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.25em] text-[#C6A76A] font-medium">
                  <span>{item.category}</span>
                  <span className="text-[#20242B]/40">Tokyo Cut</span>
                </div>

                <div className="space-y-1">
                  <h2
                    className="text-xl text-[#0B1F3A] leading-tight group-hover:text-[#244B75] transition-colors"
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontWeight: 600,
                    }}
                  >
                    {item.name}
                  </h2>
                  <p className="text-[11px] text-[#20242B]/50 font-light line-clamp-1">
                    {item.material}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#20242B]/[0.07] flex items-center justify-between">
                  <span
                    className="text-lg font-semibold text-[#0B1F3A]"
                    style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                  >
                    ${item.price.toFixed(2)}
                  </span>

                  <span className="text-[9px] uppercase tracking-widest text-[#20242B]/40 group-hover:text-[#0B1F3A] transition-colors font-semibold">
                    In Stock →
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Back Link */}
        <div className="pt-8 text-center">
          <Link
            href="/collections"
            className="inline-flex items-center gap-3 py-3 px-8 border border-[#0B1F3A]/20 bg-transparent text-[10px] uppercase tracking-[0.3em] font-semibold text-[#0B1F3A] hover:bg-[#0B1F3A] hover:text-[#C6A76A] transition-all duration-300"
          >
            <span>Explore Other Collections</span>
            <ArrowRight className="h-3 w-3" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </main>
  );
}
