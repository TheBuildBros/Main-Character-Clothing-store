"use client";

import Link from "next/link";
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
    <main className="min-h-screen bg-[#F5F2EA] text-[#091426]">
      {/* Editorial Header Banner */}
      <section className="relative bg-[#091426] text-[#F5F2EA] py-16 sm:py-24 px-4 sm:px-8 border-b border-[#C6A15B]/30">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#101D35] border border-[#C6A15B]/40 text-[#C6A15B] text-xs uppercase tracking-[0.25em] font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Flagship Experience</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-[0.18em]">
            主人公 <span className="text-[#C6A15B]">Flagship</span> Store
          </h1>

          <p className="max-w-xl mx-auto text-sm sm:text-base text-[#F5F2EA]/75 tracking-wider font-light">
            Immerse yourself in our architectural flagship space. Discover
            limited runway archives, protagonist capsule collections, and bespoke
            styling appointments.
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Store Details & Timings (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            {/* Store Information Card */}
            <div className="rounded-xl bg-white border border-[#091426]/10 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="border-b border-black/[0.06] pb-4">
                <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#C6A15B]">
                  Flagship Store No. 01
                </span>
                <h2 className="text-2xl font-black uppercase tracking-wider text-[#091426] mt-1">
                  Tokyo Shibuya Concept
                </h2>
                <div className="inline-block mt-2 px-2.5 py-0.5 rounded bg-[#091426]/5 text-[11px] font-mono text-[#091426]/60">
                  [Placeholder Store Specimen]
                </div>
              </div>

              {/* Address Placeholder */}
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-lg bg-[#091426] text-[#C6A15B] shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xs uppercase tracking-widest font-bold text-[#091426]">
                    Address
                  </h3>
                  <p className="text-sm text-[#091426]/80 mt-1 leading-relaxed">
                    District 01, Protagonist Boulevard, Shibuya-ku, Tokyo
                    150-0001
                  </p>
                  <p className="text-xs text-[#091426]/50 italic mt-0.5">
                    (Location placeholder — actual address will be integrated upon store launch)
                  </p>
                </div>
              </div>

              {/* Opening Hours Placeholder */}
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-lg bg-[#091426] text-[#C6A15B] shrink-0">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xs uppercase tracking-widest font-bold text-[#091426]">
                    Opening Hours
                  </h3>
                  <div className="text-sm text-[#091426]/80 mt-1 space-y-1">
                    <p className="flex justify-between gap-6">
                      <span className="font-medium">Monday — Saturday:</span>
                      <span>11:00 AM — 9:00 PM</span>
                    </p>
                    <p className="flex justify-between gap-6">
                      <span className="font-medium">Sunday & Holidays:</span>
                      <span>11:00 AM — 8:00 PM</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Information Placeholder */}
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-lg bg-[#091426] text-[#C6A15B] shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xs uppercase tracking-widest font-bold text-[#091426]">
                    Contact Concierge
                  </h3>
                  <p className="text-sm text-[#091426]/80 mt-1">
                    Phone: +81 3 5555 0192 [Placeholder]
                  </p>
                  <p className="text-sm text-[#091426]/80 flex items-center gap-1.5 mt-0.5">
                    <Mail className="h-3.5 w-3.5 text-[#C6A15B]" />
                    <span>concierge@maincharacter.jp [Placeholder]</span>
                  </p>
                </div>
              </div>

              {/* Store Services */}
              <div className="pt-4 border-t border-black/[0.06] space-y-2">
                <span className="text-xs uppercase tracking-widest font-bold text-[#091426]">
                  In-Store Services
                </span>
                <ul className="text-xs text-[#091426]/75 space-y-1.5">
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-[#C6A15B]" />
                    <span>Private Styling & Archive Consultation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-[#C6A15B]" />
                    <span>Online Order Pickup & Express Alterations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-[#C6A15B]" />
                    <span>VIP Member Exclusive Drop Access</span>
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() =>
                    alert("Appointment booking placeholder — backend scheduling integration coming soon.")
                  }
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-md bg-[#091426] text-[#C6A15B] text-xs uppercase tracking-widest font-bold hover:bg-[#101D35] hover:text-[#e0c487] transition-colors border border-[#C6A15B]/30"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Book Private Appointment</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Architecture & Map Placeholder (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Store Image Placeholder */}
            <div className="relative rounded-xl overflow-hidden bg-[#091426] text-[#F5F2EA] aspect-video border border-[#C6A15B]/20 shadow-lg flex flex-col items-center justify-center p-8 text-center">
              {/* Subtle background graphic */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#091426] via-[#101D35] to-[#091426] opacity-95" />
              <div className="relative z-10 space-y-3">
                <div className="flex justify-center">
                  <span
                    className="text-5xl font-black text-[#C6A15B] tracking-widest select-none"
                    style={{
                      fontFamily:
                        "'Zen Kaku Gothic New', 'Noto Sans JP', sans-serif",
                    }}
                  >
                    主人公
                  </span>
                </div>
                <h3 className="text-xl font-bold uppercase tracking-[0.2em]">
                  Architectural Gallery Showcase
                </h3>
                <p className="text-xs text-[#F5F2EA]/60 tracking-wider max-w-md mx-auto">
                  [Store Interior Photography Placeholder — Concrete Brutalism & Gold Hardware]
                </p>
              </div>
            </div>

            {/* Google Maps Embed / Location Mockup Placeholder */}
            <div className="rounded-xl overflow-hidden bg-white border border-[#091426]/10 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Navigation className="h-4 w-4 text-[#C6A15B]" />
                  <h3 className="text-xs uppercase tracking-widest font-bold text-[#091426]">
                    Interactive Map Integration
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-[#091426]/50">
                  35.6580° N, 139.7016° E
                </span>
              </div>

              {/* Styled Mock Google Map Container */}
              <div className="relative w-full h-72 rounded-lg bg-[#e5e3df] overflow-hidden border border-black/10 flex items-center justify-center">
                {/* Visual grid lines mimicking map roads */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#091426_1px,transparent_1px)] [background-size:16px_16px]" />
                <svg
                  className="absolute inset-0 h-full w-full stroke-[#c2c0bc]"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <line x1="0" y1="35%" x2="100%" y2="35%" strokeWidth="8" />
                  <line x1="0" y1="65%" x2="100%" y2="65%" strokeWidth="12" />
                  <line x1="40%" y1="0" x2="40%" y2="100%" strokeWidth="10" />
                  <line x1="75%" y1="0" x2="75%" y2="100%" strokeWidth="6" />
                </svg>

                {/* Pin in center */}
                <div className="relative z-10 flex flex-col items-center animate-bounce">
                  <div className="p-3 rounded-full bg-[#091426] text-[#C6A15B] shadow-2xl border-2 border-[#C6A15B]">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <span className="mt-1 px-3 py-1 rounded bg-[#091426] text-white text-[10px] font-bold tracking-wider shadow-md uppercase">
                    主人公 Flagship
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded text-[11px] font-medium text-[#091426] shadow-sm">
                  Google Maps SDK Placeholder
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-[#091426]/70 pt-2">
                <span>Directions & Public Transit Guide</span>
                <button
                  type="button"
                  onClick={() =>
                    alert("External navigation map link will open the official location coordinates.")
                  }
                  className="text-[#C6A15B] font-bold hover:underline uppercase tracking-wider"
                >
                  Open in Google Maps &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
