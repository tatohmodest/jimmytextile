"use client";

import { ImageUploader } from "./ImageUploader";
import { useState } from "react";

type Category = { id: string; name: string };
type Product = {
  id?: string;
  name?: string;
  slug?: string;
  description?: string;
  category_id?: string | null;
  price?: number;
  discount_price?: number | null;
  sku?: string | null;
  stock?: number;
  sizes?: string[];
  colors?: { name: string; hex: string }[];
  designs?: string[];
  material?: string | null;
  dimensions?: string | null;
  care_instructions?: string | null;
  whats_included?: string | null;
  delivery_information?: string | null;
  featured?: boolean;
  status?: string;
  seo_title?: string | null;
  seo_description?: string | null;
  product_images?: { image_url: string; position: number }[];
};

export function ProductForm({ categories, product }: { categories: Category[]; product?: Product }) {
  const images = [...(product?.product_images || [])].sort((a, b) => a.position - b.position).map((i) => i.image_url);
  const [imageList, setImageList] = useState(images.join("\n"));

  return (
    <>
    <form action="/api/admin/products" method="post" className="mt-8 grid max-w-3xl gap-4">
      <input type="hidden" name="action" value={product?.id ? "update" : "create"} />
      {product?.id ? <input type="hidden" name="id" value={product.id} /> : null}
      <label className="field">Product name<input name="name" defaultValue={product?.name} required /></label>
      <label className="field">Slug<input name="slug" defaultValue={product?.slug} placeholder="auto from name" /></label>
      <label className="field">Description<textarea name="description" rows={5} defaultValue={product?.description || ""} /></label>
      <label className="field">
        Category
        <select name="category_id" defaultValue={product?.category_id || ""}>
          <option value="">Uncategorised</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </label>
      <div className="grid gap-4 md:grid-cols-3">
        <label className="field">Price<input name="price" type="number" min={0} defaultValue={product?.price || 0} required /></label>
        <label className="field">Discount price<input name="discount_price" type="number" min={0} defaultValue={product?.discount_price || ""} /></label>
        <label className="field">Stock<input name="stock" type="number" min={0} defaultValue={product?.stock || 0} /></label>
      </div>
      <label className="field">SKU<input name="sku" defaultValue={product?.sku || ""} /></label>
      <label className="field">Sizes (comma separated)<input name="sizes" defaultValue={(product?.sizes || []).join(", ")} /></label>
      <label className="field">
        Colours (one per line: Name|#hex)
        <textarea name="colors" rows={4} defaultValue={(product?.colors || []).map((c) => `${c.name}|${c.hex}`).join("\n")} />
      </label>
      <label className="field">Designs (comma separated)<input name="designs" defaultValue={(product?.designs || []).join(", ")} /></label>
      <label className="field">Material<input name="material" defaultValue={product?.material || ""} /></label>
      <label className="field">Dimensions<input name="dimensions" defaultValue={product?.dimensions || ""} /></label>
      <label className="field">Care instructions<textarea name="care_instructions" defaultValue={product?.care_instructions || ""} /></label>
      <label className="field">What's included<textarea name="whats_included" defaultValue={product?.whats_included || ""} /></label>
      <label className="field">Delivery information<textarea name="delivery_information" defaultValue={product?.delivery_information || ""} /></label>
      <label className="field">
        Status
        <select name="status" defaultValue={product?.status || "published"}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="featured" defaultChecked={product?.featured} className="w-auto" /> Featured product
      </label>
      <label className="field">SEO title<input name="seo_title" defaultValue={product?.seo_title || ""} /></label>
      <label className="field">SEO description<textarea name="seo_description" defaultValue={product?.seo_description || ""} /></label>
      <div>
        <p className="mb-2 text-[11px] uppercase tracking-[0.18em] text-mute">Images · upload then they append below. Reorder by editing the list.</p>
        <ImageUploader
          name="unused"
          folder="products"
          defaultUrl=""
          onUploaded={(url) => setImageList((prev) => [prev, url].filter(Boolean).join("\n"))}
        />
        <p className="mt-2 text-xs text-mute">After upload, copy the image URL into the list if it does not auto-append. First image is the main photo.</p>
        <textarea
          name="image_urls"
          rows={6}
          className="mt-3"
          value={imageList}
          onChange={(e) => setImageList(e.target.value)}
          placeholder="One Cloudinary URL per line"
        />
      </div>
      <button className="btn-primary w-fit">{product?.id ? "Save product" : "Create product"}</button>
    </form>
    {product?.id ? (
      <form action="/api/admin/products" method="post" className="mt-6">
        <input type="hidden" name="action" value="delete" />
        <input type="hidden" name="id" value={product.id} />
        <button className="text-xs uppercase tracking-[0.18em] text-wine">Archive / delete product</button>
      </form>
    ) : null}
    </>
  );
}
