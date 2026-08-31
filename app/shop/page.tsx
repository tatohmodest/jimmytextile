import { Suspense } from "react";
import type { Metadata } from "next";
import { StoreShell } from "@/components/store/StoreShell";
import { ProductCard } from "@/components/store/ProductCard";
import { ShopFilters } from "@/components/store/ShopFilters";
import { DiscoverLinks } from "@/components/store/DiscoverLinks";
import { getActiveCategories, getShopProducts, getSiteContent } from "@/lib/queries";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const params = await searchParams;
  const filtered = Boolean(params.q || params.category || params.page);
  return pageMetadata({
    title: "Shop home textiles in Cameroon",
    description:
      "Browse cotton bedsheets, curtains, towels, bed covers, blankets and pillowcases. Shop online in XAF with delivery from Douala across Cameroon.",
    path: "/shop",
    index: !filtered,
  });
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : "";
  const category = typeof params.category === "string" ? params.category : "";
  const sort = (typeof params.sort === "string" ? params.sort : "newest") as
    | "newest"
    | "price_asc"
    | "price_desc"
    | "popularity"
    | "name";
  const availability = params.availability === "in_stock" ? "in_stock" : "all";
  const min = typeof params.min === "string" ? Number(params.min) : undefined;
  const max = typeof params.max === "string" ? Number(params.max) : undefined;
  const page = typeof params.page === "string" ? Number(params.page) : 1;

  const [content, categories, shop] = await Promise.all([
    getSiteContent(),
    getActiveCategories(),
    getShopProducts({ q, category, sort, availability, min, max, page }),
  ]);

  const pages = Math.max(1, Math.ceil(shop.total / shop.pageSize));

  return (
    <StoreShell brand={content.brand} contact={content.contact} categories={categories}>
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-32 md:px-8">
        <p className="text-[11px] tracking-[0.32em] uppercase text-mute">The shop</p>
        <h1 className="font-display mt-2 text-5xl md:text-6xl">All products</h1>
        <p className="mt-3 max-w-xl text-mute">
          Bedsheets, curtains, towels and more — packed in Douala and delivered across Cameroon. Search, filter and sort the collection.
        </p>
        <Suspense>
          <ShopFilters categories={categories} />
        </Suspense>
        <p className="mb-8 text-sm text-mute">{shop.total} pieces</p>
        {shop.products.length === 0 ? (
          <p className="py-20 text-center text-mute">No products match those filters yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 md:gap-x-6">
            {shop.products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
        {pages > 1 ? (
          <div className="mt-12 flex justify-center gap-2">
            {Array.from({ length: pages }).map((_, i) => (
              <a
                key={i}
                href={`?${new URLSearchParams({
                  ...(q ? { q } : {}),
                  ...(category ? { category } : {}),
                  sort,
                  availability,
                  page: String(i + 1),
                }).toString()}`}
                className={`grid h-10 w-10 place-items-center border ${shop.page === i + 1 ? "bg-ink text-ivory" : "border-ink/15"}`}
              >
                {i + 1}
              </a>
            ))}
          </div>
        ) : null}
      </div>
      <DiscoverLinks />
    </StoreShell>
  );
}
