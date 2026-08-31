"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { Category } from "@/types";

export function ShopFilters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const params = useSearchParams();

  function update(next: Record<string, string>) {
    const sp = new URLSearchParams(params.toString());
    Object.entries(next).forEach(([k, v]) => {
      if (!v || v === "all") sp.delete(k);
      else sp.set(k, v);
    });
    sp.delete("page");
    router.push(`/shop?${sp.toString()}`);
  }

  return (
    <form
      className="my-10 grid gap-3 md:grid-cols-5"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        update({
          q: String(fd.get("q") || ""),
          category: String(fd.get("category") || ""),
          sort: String(fd.get("sort") || "newest"),
          availability: String(fd.get("availability") || "all"),
          min: String(fd.get("min") || ""),
          max: String(fd.get("max") || ""),
        });
      }}
    >
      <input name="q" defaultValue={params.get("q") || ""} placeholder="Search linens, SKU, colour..." />
      <select name="category" defaultValue={params.get("category") || ""}>
        <option value="">All categories</option>
        {categories.map((c) => (
          <option key={c.id} value={c.slug}>
            {c.name}
          </option>
        ))}
      </select>
      <select name="sort" defaultValue={params.get("sort") || "newest"}>
        <option value="newest">Newest</option>
        <option value="price_asc">Price: low to high</option>
        <option value="price_desc">Price: high to low</option>
        <option value="popularity">Popularity</option>
        <option value="name">Name</option>
      </select>
      <select name="availability" defaultValue={params.get("availability") || "all"}>
        <option value="all">All availability</option>
        <option value="in_stock">In stock</option>
      </select>
      <button className="btn-primary">Apply</button>
      <input name="min" type="number" min={0} defaultValue={params.get("min") || ""} placeholder="Min price" />
      <input name="max" type="number" min={0} defaultValue={params.get("max") || ""} placeholder="Max price" />
    </form>
  );
}
