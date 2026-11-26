import { useRef } from "react";
import { ArrowRight, ArrowUpRight, MapPin, MoveUpRight } from "lucide-react";
import { Link } from "wouter";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ProductRail } from "@/store/Storefront";
import { ScrollReveal, StaggerGrid, StaggerItem } from "@/components/MotionPrimitives";
import "@google/model-viewer";

const ModelViewer = "model-viewer" as any;

const EASE_CURVE = [0.22, 1, 0.36, 1] as const;

const edits = [
  {
    title: "The blue edit",
    text: "High-voltage staples for the daily rotation.",
    label: "01 / COLOR STORY",
    image: "/images/main-character-2.webp",
    filter: "color=electric",
  },
  {
    title: "Off-duty, on point",
    text: "Sharp outerwear. Better instincts.",
    label: "02 / AFTER HOURS",
    image: "/images/main-character-4.webp",
    filter: "category=Outerwear",
  },
  {
    title: "Everyday characters",
    text: "Boxy tees built to stay in heavy rotation.",
    label: "03 / THE ESSENTIALS",
    image: "/images/main-character-3.webp",
    filter: "category=T-shirts",
  },
];

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.02, 1.1]);

  return (
    <>
      {/* Full-Bleed Responsive Hero with Properly Fitted Background Image & Parallax */}
      <section
        ref={heroRef}
        className="relative w-full min-h-[calc(100svh-64px)] sm:min-h-[calc(100svh-72px)] overflow-hidden flex items-start bg-[#00298f] text-white"
        aria-label="主人公"
      >
        <motion.div
          style={shouldReduceMotion ? undefined : { y: imageY, scale: imageScale }}
          className="absolute inset-0 w-full h-full will-change-transform"
        >
          <img
            src="/images/main-character-1.webp"
            alt="主人公 — Wear the point of view"
            className="w-full h-full object-cover object-[56%_22%] sm:object-[50%_28%]"
          />
        </motion.div>

        {/* Subtle Electric Blue Directional Scrim */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#06183d]/45 via-[#0057ff]/12 to-transparent sm:bg-gradient-to-r sm:from-[#06183d]/40 sm:via-[#0057ff]/10 sm:to-transparent"
        />

        {/* Hero Foreground Content */}
        <div className="relative z-10 w-full px-5 sm:px-8 md:px-10 lg:px-12 xl:px-14 pt-6 sm:pt-8 md:pt-10 lg:pt-10 pb-10">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: EASE_CURVE }}
            className="flex sm:inline-flex flex-col items-center text-center mt-8 sm:mt-16 md:mt-[120px]"
          >
            <div className="w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 mb-6 sm:mb-8 md:mb-10 lg:mb-10 cursor-grab active:cursor-grabbing drop-shadow-[0_20px_36px_rgba(0,40,140,0.45)]">
              <ModelViewer
                className="w-full h-full bg-transparent"
                src="/models/maincharacter_coin_final.glb"
                alt="Interactive 3D 主人公 Coin"
                camera-controls
                disable-zoom
                disable-pan
                touch-action="pan-y"
                auto-rotate
                auto-rotate-delay="1200"
                rotation-per-second="12deg"
                interaction-prompt="none"
                camera-orbit="0deg 90deg 105%"
                min-camera-orbit="auto 90deg auto"
                max-camera-orbit="auto 90deg auto"
                shadow-intensity="0.65"
                exposure="1.05"
              />
            </div>

            <div className="flex flex-col items-center gap-3 sm:gap-4">
              <h1 lang="ja" className="hero-wordmark m-0 leading-[0.92]">
                主人公<span>。</span>
              </h1>
              <p className="m-0 pl-[0.26em] sm:pl-[0.3em] font-display text-lg sm:text-2xl md:text-3xl lg:text-[34px] font-extrabold leading-[1.6] tracking-[0.26em] sm:tracking-[0.3em] uppercase text-[#0033b3] drop-shadow-[0_2px_14px_rgba(0,28,110,0.3)]">
                Main Character
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* New Arrivals Grid */}
      <ProductRail items={undefined} />

      {/* Flagship Studio Feature Card */}
      <section className="px-4 sm:px-8 lg:px-16 py-6" id="flagship">
        <ScrollReveal>
          <div className="max-w-7xl mx-auto rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 bg-gradient-to-br from-[#002b99] via-[#0057ff] to-[#0094ff] text-white shadow-[0_24px_64px_rgba(0,87,255,0.24)] border border-white/20 group">
            <div className="relative min-h-[300px] sm:min-h-[380px] lg:min-h-[520px] overflow-hidden">
              <img
                src="/images/flagship.jpg"
                alt="Sunlit minimal fashion studio interior"
                loading="lazy"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <span className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/25 font-display text-[10px] font-bold tracking-[0.18em] uppercase text-white">
                MC / 001
              </span>
            </div>

            <div className="p-7 sm:p-10 lg:p-14 flex flex-col justify-center items-start">
              <span className="inline-block px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/25 font-display text-[10px] font-bold tracking-[0.18em] uppercase text-white mb-5">
                COME THROUGH · BENGALURU
              </span>
              <p className="text-xs sm:text-sm font-semibold text-white/80 mb-2">
                A place to meet your next favourite.
              </p>
              <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight leading-[1.02] text-white mb-5">
                More than a<br />changing room.
              </h2>
              <p className="text-sm text-white/85 leading-relaxed max-w-md mb-6">
                A bright space for sharp fits, real fabric, and trying something on just because.
              </p>
              <div className="space-y-2.5 text-xs font-medium text-white/90 mb-8">
                <span className="flex items-center gap-2.5">
                  <MapPin size={15} className="text-[#7fd4ff]" /> Bengaluru, India
                </span>
                <span className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#38c2ff] shadow-[0_0_0_4px_rgba(56,194,255,0.28)]" />
                  Opening soon · By appointment
                </span>
              </div>
              <a
                href="https://maps.google.com/?q=Bengaluru"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-white text-[#0047ff] hover:bg-[#eef5ff] font-display text-xs font-bold uppercase tracking-wider shadow-lg transition-all hover:-translate-y-0.5"
              >
                <span>Find our flagship</span>
                <ArrowUpRight size={15} />
              </a>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Find Your Edit — Editorial Grid */}
      <section className="section-shell">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="section-heading">
              <div>
                <span className="eyebrow">A WORLD OF YOUR OWN</span>
                <h2>Find your edit.</h2>
              </div>
              <Link href="/collections" className="text-link group">
                <span>All collections</span>
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </ScrollReveal>

          <StaggerGrid className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5">
            {edits.map((edit, index) => (
              <StaggerItem
                key={edit.title}
                className={index === 0 ? "md:col-span-6" : "md:col-span-3"}
              >
                <Link
                  href={`/collections?${edit.filter}`}
                  className="group relative block min-h-[340px] sm:min-h-[400px] rounded-2xl overflow-hidden border border-[#0057ff]/20 shadow-[0_14px_36px_rgba(0,87,255,0.12)]"
                >
                  <img
                    src={edit.image}
                    alt={edit.title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-[#002480]/90 via-[#0047ff]/30 to-transparent"
                  />
                  <div className="absolute inset-x-4 bottom-4 p-4 rounded-xl bg-white/15 backdrop-blur-md border border-white/25 text-white flex items-end justify-between gap-3 transition-colors group-hover:bg-white/20">
                    <div>
                      <span className="block font-display text-[9px] font-bold tracking-[0.18em] uppercase text-[#bfe4ff]">
                        {edit.label}
                      </span>
                      <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight mt-1 mb-0.5">
                        {edit.title}
                      </h3>
                      <p className="text-[11px] text-white/85 m-0">{edit.text}</p>
                    </div>
                    <span className="w-9 h-9 shrink-0 rounded-full bg-gradient-to-br from-[#0047ff] to-[#00aeff] flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-110">
                      <MoveUpRight size={16} />
                    </span>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* Closing Note Glass Callout */}
      <section className="px-4 sm:px-8 lg:px-16 pb-16 pt-4">
        <ScrollReveal>
          <div className="max-w-5xl mx-auto glass-card px-6 sm:px-12 py-12 sm:py-16 text-center relative overflow-hidden">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-40 rounded-full bg-[#0057ff]/12 blur-3xl"
            />
            <span className="eyebrow relative z-10">A NOTE TO SELF</span>
            <p className="relative z-10 font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.06] mt-4 mb-7">
              Not dressed for the part.
              <br />
              <span className="bg-gradient-to-r from-[#0033b3] via-[#0057ff] to-[#00aeff] dark:from-[#60b5ff] dark:via-[#38c2ff] dark:to-[#9be4ff] bg-clip-text text-transparent">
                Dressed as the point.
              </span>
            </p>
            <Link
              href="/collections"
              className="btn-electric relative z-10 inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full font-display text-xs sm:text-sm font-bold uppercase tracking-wider"
            >
              <span>Meet the collection</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}
