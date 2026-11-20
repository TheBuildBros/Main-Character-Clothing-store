"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowDown } from "lucide-react";

const CoinScene = dynamic(() => import("@/components/3d/CoinScene"), {
  ssr: false,
});

export default function HeroSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#091426]">
      {/* Responsive Background Photograph */}
      <picture className="absolute inset-0 block h-full w-full pointer-events-none">
        <source
          media="(min-width: 768px)"
          srcSet="/images/male-model-desktop.jpg"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/male-model-mobile.jpg"
          alt="MainCharacter Autumn/Winter Luxury Editorial Collection"
          className="h-full w-full object-cover object-center filter brightness-[0.92] contrast-[1.05]"
        />
      </picture>

      {/* Subtle luxury vignette & gradient overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-[5]"
        style={{
          background: "radial-gradient(circle at 50% 50%, transparent 40%, rgba(9, 20, 38, 0.45) 100%), linear-gradient(180deg, rgba(9, 20, 38, 0.5) 0%, transparent 25%, transparent 70%, rgba(9, 20, 38, 0.75) 100%)"
        }}
      />

      {/* 3D Rotatable Coin Logo centered over the model's chest */}
      <div className="absolute inset-x-0 -top-[18vh] h-[118vh] z-10">
        <CoinScene />
      </div>

      {/* Editorial Luxury Overlays (Floating subtly over photo) */}
      <div className="absolute inset-x-0 bottom-8 sm:bottom-12 z-20 pointer-events-none px-6 sm:px-12 max-w-7xl mx-auto flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 text-[#F8F6F1]">
        
        {/* Left Editorial Stamp */}
        <div className="space-y-1.5 text-center sm:text-left pointer-events-auto">
          <div className="flex items-center justify-center sm:justify-start gap-3">
            <span className="h-px w-8 bg-[#C6A76A]" />
            <span className="text-[9px] uppercase tracking-[0.4em] font-medium text-[#C6A76A]">
              Autumn / Winter 2026
            </span>
          </div>
          <h2
            className="text-2xl sm:text-3xl text-[#F8F6F1] font-light leading-none"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic" }}
          >
            The Protagonist Silhouette
          </h2>
          <p className="text-[10px] text-[#F8F6F1]/50 tracking-[0.25em] uppercase">
            Tokyo Flagship · Bespoke Tailoring
          </p>
        </div>

        {/* Center / Right Scroll Indicator & Quick Link */}
        <div className="flex flex-col items-center sm:items-end gap-3 pointer-events-auto">
          <Link
            href="/collections"
            className="px-6 py-2.5 bg-[#0B1F3A]/80 backdrop-blur-md border border-[#C6A76A]/40 text-[#C6A76A] hover:bg-[#C6A76A] hover:text-[#0B1F3A] transition-all duration-300 text-[10px] uppercase tracking-[0.3em] font-semibold"
          >
            Explore Runway
          </Link>
          <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.3em] text-[#F8F6F1]/40">
            <span>Scroll Down</span>
            <ArrowDown className="h-3 w-3 animate-bounce text-[#C6A76A]" strokeWidth={1.5} />
          </div>
        </div>

      </div>
    </section>
  );
}
