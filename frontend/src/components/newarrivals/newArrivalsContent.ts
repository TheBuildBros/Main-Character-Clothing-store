export type NewArrival = {
  name: string;
  category: string; // for example "Jeans"
  description: string; // one or two sentences, placeholder text is fine
  price: string; // placeholder, for example "$199.00"
  image: string; // exact path under /images/rack/
  url: string; // category page, for example "/collections/jeans"
};

// Prices and descriptions are placeholders.
// Image paths match the exact folders and filenames present in frontend/public/images/rack/
// (including the space in the "t -shirt" folder).
export const NEW_ARRIVALS: {
  eyebrow: string;
  headline: string;
  items: NewArrival[];
  cta: { label: string; href: string };
} = {
  eyebrow: "NEW ARRIVALS",
  headline: "THE LATEST DROP", // last word shown at 35% opacity
  items: [
    {
      name: "Selvedge Straight Jean",
      category: "Jeans",
      description:
        "Mid-weight Japanese indigo denim cut in a relaxed straight silhouette with subtle vintage fading.",
      price: "$199.00",
      image: "/images/rack/jean/jean-front.webp",
      url: "/collections/jeans",
    },
    {
      name: "Heavyweight Boxy Tee",
      category: "T-Shirts",
      description:
        "Combed 280gsm cotton jersey finished with a structured ribbed collar and clean dropped shoulders.",
      price: "$79.00",
      image: "/images/rack/t%20-shirt/t-shirt-front.webp",
      url: "/collections/t-shirts",
    },
    {
      name: "Camp Collar Linen Shirt",
      category: "Shirts",
      description:
        "Breathable off-white woven blend tailored for an effortless drape from day through evening.",
      price: "$129.00",
      image: "/images/rack/shirt/shirt-front.webp",
      url: "/collections/shirts",
    },
    {
      name: "Pleated Tailored Trouser",
      category: "Pants",
      description:
        "Warm sand-toned wool-blend trouser featuring crisp front pleats and a gently tapered leg.",
      price: "$149.00",
      image: "/images/rack/pant/pant-front.webp",
      url: "/collections/pants",
    },
    {
      name: "Gradient Tech Long-Sleeve Jersey",
      category: "Jerseys",
      description:
        "Lightweight performance knit with an ombré charcoal-to-chalk fade and reflective shoulder detailing.",
      price: "$99.00",
      image: "/images/rack/jersey/jersey-front.webp",
      url: "/collections/jerseys",
    },
    {
      name: "Motorsport Mesh Panel Jacket",
      category: "Jackets",
      description:
        "Structured moto-inspired outerwear combining ballistic contrast panels, crimson accents, and zip pockets.",
      price: "$249.00",
      image: "/images/rack/jacket/jacket-front.webp",
      url: "/collections/jackets",
    },
  ],
  cta: { label: "Shop All New Arrivals", href: "/collections" },
};
