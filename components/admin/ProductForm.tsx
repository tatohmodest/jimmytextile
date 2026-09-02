"use client";

import { ImageUploader } from "./ImageUploader";
import { useState } from "react";

type Category = { id: string; name: string };
type ImageRow = { url: string; alt: string };
type Product = {
  id?: string;
  name?: string;
  name_fr?: string | null;
  slug?: string;
  description?: string;
  description_fr?: string | null;
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
  whats_included_fr?: string | null;
  delivery_information?: string | null;
  featured?: boolean;
  status?: string;
  seo_title?: string | null;
  seo_description?: string | null;
  price_tiers?: { min_qty: number; max_qty: number | null; unit_price: number }[];
  image_alts?: string[];
  product_images?: { image_url: string; alt_text?: string | null; position: number }[];
};

function tiersToText(tiers?: Product["price_tiers"]) {
  if (!tiers?.length) return "";
  return tiers
    .map((tier) =>
      tier.max_qty == null ? `${tier.min_qty}+:${tier.unit_price}` : `${tier.min_qty}-${tier.max_qty}:${tier.unit_price}`
    )
    .join("\n");
}

export function ProductForm({ categories, product }: { categories: Category[]; product?: Product }) {
  const sorted = [...(product?.product_images || [])].sort((a, b) => a.position - b.position);
  const initialImages: ImageRow[] = sorted.length
    ? sorted.map((img, i) => ({
        url: img.image_url,
        alt: img.alt_text || product?.image_alts?.[i] || "",
      }))
    : (product?.image_alts || []).map((alt) => ({ url: "", alt }));
  const [images, setImages] = useState<ImageRow[]>(initialImages.length ? initialImages : [{ url: "", alt: "" }]);

  function addImage(url = "", alt = "") {
    setImages((prev) => [...prev, { url, alt: alt || (prev.length ? `Related product photo ${prev.length + 1}` : "Main product photo") }]);
  }

  return (
    <>
    <form action="/api/admin/products" method="post" className="mt-8 grid max-w-3xl gap-4">
      <input type="hidden" name="action" value={product?.id ? "update" : "create"} />
      {product?.id ? <input type="hidden" name="id" value={product.id} /> : null}
      <label className="field">Product name (English)<input name="name" defaultValue={product?.name} required /></label>
      <label className="field">Nom du produit (français)<input name="name_fr" defaultValue={product?.name_fr || ""} /></label>
      <label className="field">Slug<input name="slug" defaultValue={product?.slug} placeholder="auto from name" /></label>
      <label className="field">Description (English)<textarea name="description" rows={4} defaultValue={product?.description || ""} /></label>
      <label className="field">Description (français)<textarea name="description_fr" rows={4} defaultValue={product?.description_fr || ""} /></label>
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
        <label className="field">Price (qty 1)<input name="price" type="number" min={0} defaultValue={product?.price || 0} required /></label>
        <label className="field">Discount price<input name="discount_price" type="number" min={0} defaultValue={product?.discount_price || ""} /></label>
        <label className="field">Stock<input name="stock" type="number" min={0} defaultValue={product?.stock || 0} /></label>
      </div>
      <label className="field">
        Quantity prices (one per line: 1-9:4500 or 501+:4000)
        <textarea name="price_tiers" rows={6} defaultValue={tiersToText(product?.price_tiers)} placeholder="1-9:4500&#10;10-20:4400&#10;501+:4000" />
      </label>
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
      <label className="field">What's included (English)<textarea name="whats_included" defaultValue={product?.whats_included || ""} /></label>
      <label className="field">Contenu du set (français)<textarea name="whats_included_fr" defaultValue={product?.whats_included_fr || ""} /></label>
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
      <div className="grid gap-3 border border-ink/10 p-4">
        <p className="text-[11px] uppercase tracking-[0.18em] text-mute">
          Images · first is the main photo, the rest are related photos. Uploads are compressed, quality kept.
        </p>
        <ImageUploader
          name="unused"
          folder="products"
          defaultUrl=""
          onUploaded={(url) => addImage(url, images[0]?.url ? `${product?.name || "Product"} — related photo` : `${product?.name || "Product"} — main product photo`)}
        />
        {images.map((img, index) => (
          <div key={index} className="grid gap-2 border border-ink/10 p-3 md:grid-cols-[1fr_1fr_auto]">
            <label className="field">
              {index === 0 ? "Main image URL" : `Related image ${index} URL`}
              <input
                name="image_urls"
                value={img.url}
                onChange={(e) =>
                  setImages((prev) => prev.map((row, i) => (i === index ? { ...row, url: e.target.value } : row)))
                }
                placeholder="Cloudinary URL"
              />
            </label>
            <label className="field">
              Alt text (English)
              <input
                name="image_alts"
                value={img.alt}
                onChange={(e) =>
                  setImages((prev) => prev.map((row, i) => (i === index ? { ...row, alt: e.target.value } : row)))
                }
                placeholder="Describe the photo in English"
              />
            </label>
            <button
              type="button"
              className="self-end text-xs uppercase tracking-[0.16em] text-wine"
              onClick={() => setImages((prev) => prev.filter((_, i) => i !== index))}
            >
              Remove
            </button>
          </div>
        ))}
        <button type="button" className="btn-outline w-fit" onClick={() => addImage()}>
          Add another image
        </button>
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
