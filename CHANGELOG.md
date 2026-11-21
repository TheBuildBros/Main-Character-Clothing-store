# Changelog

## 3D Coin Lighting, Material & Performance (`CoinScene.tsx`, `coinMaterials.ts`)
- Built an omnidirectional procedural studio environment map (`createStudioEnvMap`) via `THREE.PMREMGenerator` with an architectural gradient dome and 360° softbox panels so glossy obsidian and silver surfaces reflect light from every angle (`0°–360°` and edge-on).
- Created calibrated PBR texture maps (`buildCoinPhysicalMaterial`) driving `MeshPhysicalMaterial` (`clearcoat: 1.0`, `side: THREE.DoubleSide`, ACES Filmic tone mapping, sRGB output):
  - Bright polished silver rim & bevel with champagne-gunmetal inner grooves
  - Glossy black obsidian coin face with clearcoat studio reflections
  - Contrasted satin pewter continents/gridlines with subtle gold-tinted contour edges and controlled emissive lift
  - Crisp platinum-ivory `主人公 / MAIN CHARACTER` emblem and silhouette
- Capped `dpr={[1, 2]}`, paused rendering via `IntersectionObserver` + `visibilitychange` when off-screen or hidden, disposed GPU materials/textures/PMREM targets on unmount, lazy-loaded `CoinScene`, scaled responsively across mobile/tablet/desktop, and added a static PNG fallback (`/images/coin-fallback.png`) when WebGL is unavailable.

## Hero & Landing Scroll Animations (`useHeroScroll.ts`, `HeroSection.tsx`, `ScrollRevealSection.tsx`, `page.tsx`, `globals.css`)
- Added staggered editorial load reveals for the eyebrow, line-masked headline/subtitle, and `EXPLORE RUNWAY` CTA.
- Added GPU-composited (`transform`/`opacity`) multi-plane depth parallax across the background, flanking models, center protagonist, hero overlays, and 3D coin scroll scale/tilt/speed response.
- Wrapped below-hero sections (`ClothingRackHero`, `StickyScrollReveal`) in one-shot `IntersectionObserver` fade/translate reveals (`ScrollRevealSection`) that clear `transform` to `none` after reveal to preserve sticky layout behavior.
- Respected `prefers-reduced-motion` across all load, parallax, and scroll-reveal animations.

## Header & Mobile Slide Drawer (`Header.tsx`)
- Added an inline stroke SVG Home icon (`aria-label="Home"`, 20×20px) immediately to the left of the Store Location (`MapPin`) link on the left side of the header, with gold hover/focus states and visible focus rings.
- Removed the `Flagship` item from both desktop and mobile header navigation and rebalanced the header layout across breakpoints.
- Replaced conditional mounting in the mobile navigation drawer with a persistent mounted left-to-right off-canvas slide (`translateX(-100%)` → `translateX(0)`, 360ms `cubic-bezier(0.22, 1, 0.36, 1)`), fading backdrop, staggered link entries, body scroll lock, Escape/backdrop/route-change dismissal, `Tab` focus trapping, focus restoration on close, and complete ARIA attributes (`role="dialog"`, `aria-modal="true"`, `aria-expanded`, `aria-controls`).
