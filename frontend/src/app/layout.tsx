import { Suspense } from "react";
import type { Metadata } from "next";
import Providers from "@/components/layout/Providers";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "主人公 | MainCharacter — Luxury Fashion",
  description:
    "MainCharacter (主人公) — Protagonist luxury streetwear. High-density editorial fashion crafted with Japanese tailoring and minimalist sophistication.",
  keywords: "luxury fashion, streetwear, editorial clothing, Japanese design, protagonist",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Japanese Display Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@700;900&family=Noto+Sans+JP:wght@700;900&display=swap"
          rel="stylesheet"
        />
        {/* Luxury Editorial Serif */}
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600&display=swap"
          rel="stylesheet"
        />
        {/* Refined Sans-serif */}
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#F8F6F1] text-[#20242B]">
        <Providers>
          <Suspense
            fallback={
              <div className="h-16 sm:h-20 w-full bg-[#091426] border-b border-[#C6A76A]/20" />
            }
          >
            <Header />
          </Suspense>
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
