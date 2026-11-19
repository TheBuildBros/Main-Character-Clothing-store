export interface RackGarment {
  name: string;
  price: string;
  url: string;
  side: string;
  front: string;
  back: string;
}

export interface RackContent {
  eyebrow: {
    title: string;
    subtitle: string;
  };
  headline: string;
  cta: {
    label: string;
    href: string;
  };
  garmentSizes: readonly string[];
  rack: readonly RackGarment[];
}

// Note: All garment prices below are placeholders and can be swapped here later.
// Image paths match the exact folders and filenames present in frontend/public/images/rack/
// (including the space in "t -shirt" and "jersey-black.webp" for the jersey back view).
export const CONTENT: RackContent = {
  eyebrow: { title: "BLURGVILLAGE", subtitle: "NEW SEASON" },
  headline: "WEAR THE NEW DROP", // last word is shown at 35% opacity
  cta: { label: "Shop the Collection", href: "/collections" },
  garmentSizes: ["S", "M", "L", "XL"],
  rack: [
    {
      name: "Jean",
      price: "$199.00", // placeholder price
      url: "/collections/jean",
      side: "/images/rack/jean/jean-side.webp",
      front: "/images/rack/jean/jean-front.webp",
      back: "/images/rack/jean/jean-back.webp",
    },
    {
      name: "T-Shirt",
      price: "$79.00", // placeholder price
      url: "/collections/t-shirt",
      side: "/images/rack/t%20-shirt/t-shirt-side.webp",
      front: "/images/rack/t%20-shirt/t-shirt-front.webp",
      back: "/images/rack/t%20-shirt/t-shirt-back.webp",
    },
    {
      name: "Shirt",
      price: "$129.00", // placeholder price
      url: "/collections/shirt",
      side: "/images/rack/shirt/shirt-side.webp",
      front: "/images/rack/shirt/shirt-front.webp",
      back: "/images/rack/shirt/shirt-back.webp",
    },
    {
      name: "Pant",
      price: "$149.00", // placeholder price
      url: "/collections/pant",
      side: "/images/rack/pant/pant-side.webp",
      front: "/images/rack/pant/pant-front.webp",
      back: "/images/rack/pant/pant-back.webp",
    },
    {
      name: "Jersey",
      price: "$99.00", // placeholder price
      url: "/collections/jersey",
      side: "/images/rack/jersey/jersey-side.webp",
      front: "/images/rack/jersey/jersey-front.webp",
      back: "/images/rack/jersey/jersey-black.webp",
    },
    {
      name: "Jacket",
      price: "$249.00", // placeholder price
      url: "/collections/jacket",
      side: "/images/rack/jacket/jacket-side.webp",
      front: "/images/rack/jacket/jacket-front.webp",
      back: "/images/rack/jacket/jacket-back.webp",
    },
  ],
};
