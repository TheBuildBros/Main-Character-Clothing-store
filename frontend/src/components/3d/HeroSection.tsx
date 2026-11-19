"use client";

import dynamic from "next/dynamic";

const CoinScene = dynamic(() => import("@/components/3d/CoinScene"), {
  ssr: false,
});

export default function HeroSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-neutral-950">
      {/* Centered Image Frame */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/male-model.jpg"
          alt="Model wearing new collection"
          className="max-h-[85vh] w-auto max-w-[90vw] object-contain"
        />
      </div>

      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Soft fade at the edges */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/60 via-transparent to-neutral-950/80 pointer-events-none" />

      {/* Layer 3: 3D Coin Scene */}
      <div className="absolute inset-0">
        <CoinScene />
      </div>

      {/* Layer 4: Text Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-end pb-24 text-white pointer-events-none">
        <h1 className="text-4xl font-bold tracking-wider mb-2 md:text-6xl">
          NEW COLLECTION
        </h1>
        <p className="text-sm text-zinc-300 tracking-wide md:text-base">
          Drag the coin to rotate
        </p>
      </div>
    </section>
  );
}
