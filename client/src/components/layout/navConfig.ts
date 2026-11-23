export interface NavSubItem {
  label: string;
  href: string;
  slug?: string;
  badge?: string;
  isPulsing?: boolean;
  highlight?: boolean;
}

export interface MegaMenuColumn {
  heading: string;
  links: NavSubItem[];
}

export interface NavItemConfig {
  id: string;
  label: string;
  href?: string;
  type: "link" | "mega-menu" | "dropdown";
  columns?: MegaMenuColumn[];
  items?: NavSubItem[];
}

export const NAV_CONFIG: NavItemConfig[] = [
  {
    id: "home",
    label: "Home",
    href: "/",
    type: "link",
  },
  {
    id: "essentials",
    label: "Main Character Essentials",
    type: "mega-menu",
    columns: [
      {
        heading: "Bottoms",
        links: [
          { label: "Jeans", href: "/shop/jeans", slug: "jeans" },
          { label: "Other Bottoms", href: "/shop/other-bottoms", slug: "other-bottoms" },
        ],
      },
      {
        heading: "Tops",
        links: [
          { label: "Shirts", href: "/shop/shirts", slug: "shirts" },
          { label: "T-Shirts", href: "/shop/t-shirts", slug: "t-shirts" },
          { label: "Jerseys", href: "/shop/jerseys", slug: "jerseys" },
        ],
      },
      {
        heading: "Outerwear",
        links: [
          { label: "Jackets", href: "/shop/jackets", slug: "jackets" },
        ],
      },
    ],
  },
  {
    id: "limited",
    label: "Main Character Limited",
    type: "dropdown",
    items: [
      { label: "New Drops", href: "/limited/new-drops" },
      {
        label: "Flash Sale",
        href: "/limited/flash-sale",
        badge: "LIVE",
        isPulsing: true,
      },
      { label: "Limited Editions", href: "/limited/editions" },
      {
        label: "Shop All",
        href: "/limited/all",
        highlight: true,
      },
    ],
  },
  {
    id: "contact",
    label: "Contact",
    href: "/contact",
    type: "link",
  },
];

/**
 * Checks if a given nav item is considered active based on the current pathname.
 */
export function isNavItemActive(item: NavItemConfig, pathname: string): boolean {
  if (item.type === "link" && item.href) {
    if (item.href === "/") {
      return pathname === "/";
    }
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  }

  if (item.type === "mega-menu") {
    // Active if in /shop/ or any matching column link
    if (pathname.startsWith("/shop")) return true;
    return Boolean(
      item.columns?.some((col) =>
        col.links.some(
          (link) => pathname === link.href || pathname.startsWith(`${link.href}/`)
        )
      )
    );
  }

  if (item.type === "dropdown") {
    // Active if in /limited or any matching dropdown item
    if (pathname.startsWith("/limited")) return true;
    return Boolean(
      item.items?.some(
        (sub) => pathname === sub.href || pathname.startsWith(`${sub.href}/`)
      )
    );
  }

  return false;
}
