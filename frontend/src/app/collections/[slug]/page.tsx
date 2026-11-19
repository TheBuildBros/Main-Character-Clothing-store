import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function generateStaticParams() {
  return [
    { slug: "season-01-core" },
    { slug: "runway-archives" },
    { slug: "monochrome-series" },
    { slug: "raw-denim-collection" },
  ];
}

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

  return (
    <main className="min-h-screen bg-[#F5F2EA] text-[#091426] pb-24">
      {/* Header */}
      <section className="bg-[#091426] text-[#F5F2EA] py-14 px-4 sm:px-8 border-b border-[#C6A15B]/20">
        <div className="max-w-6xl mx-auto space-y-4">
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#C6A15B] hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to All Collections</span>
          </Link>

          <div className="space-y-1">
            <span
              className="text-xs uppercase tracking-[0.25em] font-bold text-[#C6A15B] block"
              style={{
                fontFamily:
                  "'Zen Kaku Gothic New', 'Noto Sans JP', sans-serif",
              }}
            >
              主人公 &bull; カプセル
            </span>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-wider text-[#F5F2EA]">
              {formattedTitle}
            </h1>
          </div>
        </div>
      </section>

      {/* Grid of Product Placeholders */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12 space-y-8">
        <div className="flex items-center justify-between pb-4 border-b border-[#091426]/10">
          <span className="text-xs uppercase tracking-widest font-bold text-[#091426]">
            Catalog Silhouettes (Future Product Database Integration)
          </span>
          <span className="text-xs font-mono text-[#091426]/50">Slug: {slug}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <div
              key={num}
              className="bg-white rounded-xl border border-[#091426]/10 overflow-hidden shadow-sm flex flex-col"
            >
              <div className="aspect-[3/4] bg-[#091426]/5 relative flex items-center justify-center">
                <span className="text-xs font-mono text-[#091426]/40 uppercase tracking-widest">
                  [Product Image Placeholder #{num}]
                </span>
              </div>
              <div className="p-5 space-y-2">
                <span className="text-[10px] uppercase tracking-widest font-bold text-[#C6A15B]">
                  主人公 &bull; Drop Specimen
                </span>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#091426]">
                  Silhouette #{num} — {formattedTitle}
                </h3>
                <p className="text-sm font-bold text-[#091426]">$220.00</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
