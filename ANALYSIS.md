# Codebase Analysis — MAIN CHARACTER Menswear Store

## Stack & Tooling
- **Framework**: Next.js `16.4.6` (App Router, `frontend/src/app`) with React `19.3.0` and TypeScript `^5`
- **Styling**: Tailwind CSS v4 (`@tailwindcss/turbopack` `4.3.3`) configured in `frontend/src/app/globals.css`, `tw-animate-css`, `lucide-react`
- **Animation Libraries**: `gsap` (`^3.15.1`), `@gsap/react` (`^2.1.2`), `lenis` (`^1.3.27`), native `requestAnimationFrame` + `IntersectionObserver`, and CSS transitions/keyframes
- **3D Stack**: `three` (`^0.187.0`), `@react-three/fiber` (`^9.8.2`), `@react-three/drei` (`^10.7.9`)

## Key Files
- Landing page (`/`): `frontend/src/app/page.tsx`
- Hero section: `frontend/src/components/3d/HeroSection.tsx`
- 3D Coin scene & materials: `frontend/src/components/3d/CoinScene.tsx`, `frontend/src/components/3d/coinMaterials.ts`
- Hero scroll hook: `frontend/src/components/3d/useHeroScroll.ts`
- Below-hero scroll reveal wrapper: `frontend/src/components/layout/ScrollRevealSection.tsx`
- Header & Mobile Drawer: `frontend/src/components/layout/Header.tsx`

## Existing Design Language
- **Colors**: Deep navy/teal surfaces (`#091426`, `#0B1F3A`, `#132B4F`), champagne gold accents (`#C6A76A`, `#e0c487`, `#C9A46A`), warm ivory/off-white editorial tones (`#F8F6F1`, `#F5F2EA`, `#F5EFE0`)
- **Typography**: `'Zen Kaku Gothic New', 'Noto Sans JP'` for `主人公`, `'Cormorant Garamond', Georgia, serif` (italic editorial display), `'Inter', system-ui, sans-serif` (tracked uppercase labels/CTAs)
- **Motion Curve**: `cubic-bezier(0.22, 1, 0.36, 1)`

## Root Cause of 3D Coin Visibility Issue
- `frontend/public/models/coin.glb` has a single mesh (`geometry_0`) with embossed 3D relief on both front and back faces (`doubleSided: false`) and a single `ChromeSilver` material (`metallicFactor: 1.0`, `roughnessFactor: 0.16`).
- Pure metalness (`1.0`) eliminates diffuse shading, so `ambientLight` contributed zero illumination, while the flat faces (`normal = (0, 0, ±1)`) only reflected a single narrow direction. Additionally, the engraved continents and gridlines had near-black RGB (`~18/255`), which yields near-zero Fresnel reflectance ($F_0 \approx 0$) on a metal, causing the coin to appear almost completely black from nearly every angle except one narrow reflection angle.
