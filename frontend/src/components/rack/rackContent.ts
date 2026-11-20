export interface RackCategoryItem {
  name: string;
  url: string;
  side: string;
  front: string;
  flipX?: boolean;
}

export interface RackContent {
  eyebrow: {
    title: string;
    subtitle: string;
  };
  headline: string;
  restingCaption: string;
  cta: {
    label: string;
    href: string;
  };
  rack: readonly RackCategoryItem[];
}

// Image paths match the exact folders and filenames present in frontend/public/images/rack/
// (including the space in the "t -shirt" folder).
export const CONTENT: RackContent = {
  eyebrow: { title: "MAINCHARACTER", subtitle: "BROWSE BY CATEGORY" },
  headline: "SHOP BY CATEGORY", // last word is shown at 35% opacity
  restingCaption: "Select a category to explore",
  cta: { label: "View All Collections", href: "/collections" },
  rack: [
    {
      name: "Jeans",
      url: "/collections/jeans",
      side: "/images/rack/jean/jean-side.webp",
      front: "/images/rack/jean/jean-front.webp",
    },
    {
      name: "T-Shirts",
      url: "/collections/t-shirts",
      side: "/images/rack/t%20-shirt/t-shirt-side.webp",
      front: "/images/rack/t%20-shirt/t-shirt-front.webp",
    },
    {
      name: "Shirts",
      url: "/collections/shirts",
      side: "/images/rack/shirt/shirt-side.webp",
      front: "/images/rack/shirt/shirt-front.webp",
    },
    {
      name: "Pants",
      url: "/collections/pants",
      side: "/images/rack/pant/pant-side.webp",
      front: "/images/rack/pant/pant-front.webp",
    },
    {
      name: "Jerseys",
      url: "/collections/jerseys",
      side: "/images/rack/jersey/jersey-side.webp",
      front: "/images/rack/jersey/jersey-front.webp",
      flipX: true,
    },
    {
      name: "Jackets",
      url: "/collections/jackets",
      side: "/images/rack/jacket/jacket-side.webp",
      front: "/images/rack/jacket/jacket-front.webp",
    },
  ],
};
