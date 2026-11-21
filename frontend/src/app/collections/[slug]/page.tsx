import { redirect } from "next/navigation";

export function generateStaticParams() {
  return [
    { slug: "season-01-core" },
    { slug: "runway-archives" },
    { slug: "monochrome-series" },
    { slug: "raw-denim-collection" },
    { slug: "jeans" },
    { slug: "t-shirts" },
    { slug: "shirts" },
    { slug: "pants" },
    { slug: "trousers" },
    { slug: "jerseys" },
    { slug: "dresses" },
    { slug: "jackets" },
    { slug: "accessories" },
  ];
}

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let targetCategory = slug;
  if (slug === "pants") targetCategory = "trousers";
  if (slug === "jerseys") targetCategory = "dresses";
  if (slug === "raw-denim-collection") targetCategory = "jeans";

  redirect(`/collections?category=${encodeURIComponent(targetCategory)}`);
}
