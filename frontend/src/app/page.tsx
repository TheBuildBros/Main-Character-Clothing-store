import HeroSection from "@/components/3d/HeroSection";
import ClothingRackHero from "@/components/rack/ClothingRackHero";
import StickyScrollReveal from "@/components/newarrivals/StickyScrollReveal";
import AccessoriesSection from "@/components/accessories/AccessoriesSection";

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <ClothingRackHero />
      <StickyScrollReveal />
      <AccessoriesSection />
    </>
  );
}
