"use client";

import {
  MapPin,
  Clock,
  Phone,
  Mail,
  Navigation,
  Sparkles,
  ShieldCheck,
  Calendar,
} from "lucide-react";

export default function LocationPage() {
  return (
    <main className="min-h-screen bg-[#F8F6F1] text-[#20242B]">
      {/* Editorial Header Banner */}
      <section className="relative bg-[#0B1F3A] text-[#F8F6F1] py-20 sm:py-28 px-5 sm:px-8 border-b border-[#C6A76A]/15">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#C6A76A]/40 text-[#C6A76A] text-[9px] uppercase tracking-[0.35em] font-medium bg-[#C6A76A]/10">
            <Sparkles className="h-3 w-3" />
            <span>Flagship Maison</span>
          </div>

          <h1
            className="text-4xl sm:text-6xl text-[#F8F6F1]"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 600,
              fontStyle: "italic",
            }}
          >
            主人公 <span className="text-[#C6A76A] font-normal not-italic">Tokyo Flagship</span>
          </h1>

          <p
            className="max-w-xl mx-auto text-sm sm:text-base text-[#F8F6F1]/60 leading-relaxed font-light"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Immerse yourself in our architectural flagship space. Discover
            limited runway archives, protagonist capsule collections, and bespoke
            styling appointments.
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Store Details & Timings (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Store Information Card */}
            <div className="bg-white border border-[#20242B]/[0.08] p-7 sm:p-8 shadow-[0_2px_16px_rgba(11,31,58,0.04)] space-y-6">
              <div className="border-b border-[#20242B]/[0.08] pb-4">
                <span className="text-[9px] uppercase tracking-[0.35em] font-medium text-[#C6A76A] block">
                  Maison No. 01
                </span>
                <h2
                  className="text-2xl text-[#0B1F3A] mt-1"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600 }}
                >
                  Tokyo Shibuya Concept
                </h2>
                <div className="inline-block mt-2 px-2.5 py-0.5 bg-[#0B1F3A]/5 text-[10px] font-mono text-[#0B1F3A]/60">
                  Architectural Concept Store
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-[#0B1F3A] text-[#C6A76A] shrink-0">
                  <MapPin className="h-4 w-4" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#0B1F3A]">
                    Address
                  </h3>
                  <p className="text-xs text-[#20242B]/80 mt-1 leading-relaxed font-light">
                    District 01, Protagonist Boulevard, Shibuya-ku, Tokyo
                    150-0001
                  </p>
                  <p className="text-[10px] text-[#20242B]/45 font-light italic mt-0.5">
                    (Central Tokyo Flagship Location)
                  </p>
                </div>
              </div>

              {/* Opening Hours */}
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-[#0B1F3A] text-[#C6A76A] shrink-0">
                  <Clock className="h-4 w-4" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#0B1F3A]">
                    Boutique Hours
                  </h3>
                  <div className="text-xs text-[#20242B]/80 mt-1 space-y-1 font-light">
                    <p className="flex justify-between gap-6">
                      <span className="font-medium text-[#0B1F3A]">Monday — Saturday:</span>
                      <span>11:00 AM — 9:00 PM</span>
                    </p>
                    <p className="flex justify-between gap-6">
                      <span className="font-medium text-[#0B1F3A]">Sunday & Holidays:</span>
                      <span>11:00 AM — 8:00 PM</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-[#0B1F3A] text-[#C6A76A] shrink-0">
                  <Phone className="h-4 w-4" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#0B1F3A]">
                    Private Concierge
                  </h3>
                  <p className="text-xs text-[#20242B]/80 mt-1 font-light">
                    Phone: +81 3 5555 0192
                  </p>
                  <p className="text-xs text-[#20242B]/80 flex items-center gap-1.5 mt-0.5 font-light">
                    <Mail className="h-3 w-3 text-[#C6A76A]" strokeWidth={1.5} />
                    <span>concierge@maincharacter.jp</span>
                  </p>
                </div>
              </div>

              {/* Store Services */}
              <div className="pt-4 border-t border-[#20242B]/[0.08] space-y-2.5">
                <span className="text-[9px] uppercase tracking-[0.3em] font-semibold text-[#0B1F3A] block">
                  Atelier Services
                </span>
                <ul className="text-xs text-[#20242B]/75 space-y-2 font-light">
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#C6A76A]" strokeWidth={1.5} />
                    <span>Private Styling & Archive Consultation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#C6A76A]" strokeWidth={1.5} />
                    <span>Online Order Pickup & Express Alterations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#C6A76A]" strokeWidth={1.5} />
                    <span>VIP Member Exclusive Drop Vault Access</span>
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() =>
                    alert("Appointment booking concierge — private appointment request registered.")
                  }
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 bg-[#0B1F3A] text-[#C6A76A] text-[10px] uppercase tracking-[0.28em] font-semibold hover:bg-[#C6A76A] hover:text-[#0B1F3A] transition-all duration-300 border border-[#0B1F3A]"
                >
                  <Calendar className="h-3.5 w-3.5" strokeWidth={1.5} />
                  <span>Book Private Consultation</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Architecture & Map Placeholder (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Store Architectural Banner */}
            <div className="relative overflow-hidden bg-[#0B1F3A] text-[#F8F6F1] aspect-video border border-[#C6A76A]/20 shadow-[0_4px_32px_rgba(11,31,58,0.1)] flex flex-col items-center justify-center p-8 text-center">
              <div
                className="absolute inset-0 opacity-[0.05]"
                style={{
                  backgroundImage: "radial-gradient(circle, #C6A76A 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />
              <div className="relative z-10 space-y-3">
                <span
                  className="text-5xl font-black text-[#C6A76A]/30 tracking-[0.25em] select-none block"
                  style={{
                    fontFamily: "'Zen Kaku Gothic New', 'Noto Sans JP', sans-serif",
                  }}
                >
                  主人公
                </span>
                <h3
                  className="text-2xl text-[#F8F6F1]"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic" }}
                >
                  Architectural Gallery Showcase
                </h3>
                <p className="text-xs text-[#F8F6F1]/55 tracking-wider max-w-sm mx-auto font-light">
                  Concrete minimalism, raw brass hardware, and quiet luxury tailoring in the heart of Shibuya.
                </p>
              </div>
            </div>

            {/* Google Maps Embed / Location Mockup */}
            <div className="bg-white border border-[#20242B]/[0.08] shadow-[0_2px_16px_rgba(11,31,58,0.04)] p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Navigation className="h-4 w-4 text-[#C6A76A]" strokeWidth={1.5} />
                  <h3
                    className="text-base text-[#0B1F3A]"
                    style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600 }}
                  >
                    Interactive Navigation
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-[#20242B]/40">
                  35.6580° N, 139.7016° E
                </span>
              </div>

              {/* Styled Mock Google Map Container */}
              <div className="relative w-full h-72 bg-[#EFEAE0] overflow-hidden border border-[#20242B]/[0.08] flex items-center justify-center">
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#0B1F3A_1px,transparent_1px)] [background-size:16px_16px]" />
                <svg
                  className="absolute inset-0 h-full w-full stroke-[#d3cdc3]"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <line x1="0" y1="35%" x2="100%" y2="35%" strokeWidth="8" />
                  <line x1="0" y1="65%" x2="100%" y2="65%" strokeWidth="12" />
                  <line x1="40%" y1="0" x2="40%" y2="100%" strokeWidth="10" />
                  <line x1="75%" y1="0" x2="75%" y2="100%" strokeWidth="6" />
                </svg>

                {/* Pin in center */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="p-3 bg-[#0B1F3A] text-[#C6A76A] shadow-xl border border-[#C6A76A]">
                    <MapPin className="h-5 w-5" strokeWidth={1.5} />
                  </div>
                  <span className="mt-1 px-3 py-1 bg-[#0B1F3A] text-[#C6A76A] text-[9px] font-semibold tracking-[0.2em] shadow-md uppercase">
                    主人公 Flagship
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 bg-[#F8F6F1]/90 backdrop-blur-sm px-3 py-1 text-[10px] font-mono text-[#0B1F3A]">
                  Tokyo Shibuya District
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-[#20242B]/70 pt-2">
                <span className="font-light">Directions & Public Transit Guide</span>
                <button
                  type="button"
                  onClick={() =>
                    alert("External maps navigation opening Shibuya location coordinates.")
                  }
                  className="text-[10px] uppercase tracking-wider font-semibold text-[#C6A76A] hover:underline"
                >
                  Open in Maps →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
