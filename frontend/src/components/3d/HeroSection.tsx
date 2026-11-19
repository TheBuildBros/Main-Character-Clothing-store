"use client";

import dynamic from "next/dynamic";

const CoinScene = dynamic(() => import("@/components/3d/CoinScene"), {
  ssr: false,
});

export default function HeroSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-neutral-950">
      {/* Responsive Background Photograph */}
      <picture className="absolute inset-0 block h-full w-full pointer-events-none">
        <source
          media="(min-width: 768px)"
          srcSet="/images/male-model-desktop.jpg"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/male-model-mobile.jpg"
          alt="Model wearing collection"
          className="h-full w-full object-cover object-center"
        />
      </picture>

      {/* 3D Rotatable Coin Logo centered over the model's chest */}
      <div className="absolute inset-x-0 -top-[18vh] h-[118vh] z-10">
        <CoinScene />
      </div>
    </section>
  );
}
