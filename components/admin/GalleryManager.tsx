"use client";

import { useState } from "react";
import { MediaUploader } from "@/components/admin/ImageUploader";
import type { CloudinaryUploadResult } from "@/lib/media";
import type { GalleryContent } from "@/types";

export function GalleryManager({ gallery }: { gallery: GalleryContent }) {
  const [asset, setAsset] = useState<CloudinaryUploadResult | null>(null);

  return (
    <div className="max-w-3xl">
      <form action="/api/admin/manage" method="post" className="grid gap-4 bg-ivory p-5">
        <input type="hidden" name="action" value="gallery-meta" />
        <label className="field">
          Gallery heading
          <input name="heading" defaultValue={gallery.heading} />
        </label>
        <label className="field">
          Introduction
          <textarea name="intro" rows={3} defaultValue={gallery.intro} />
        </label>
        <button className="btn-primary w-fit">Save copy</button>
      </form>

      <h2 className="font-display mt-12 text-3xl">Add a film</h2>
      <p className="mt-2 text-sm text-mute">Upload a video under 10MB. Cloudinary compresses it and keeps the look sharp.</p>
      <form action="/api/admin/manage" method="post" className="mt-6 grid gap-4 bg-ivory p-5">
        <input type="hidden" name="action" value="gallery-item" />
        <input type="hidden" name="video_url" value={asset?.url || ""} />
        <input type="hidden" name="poster_url" value={asset?.posterUrl || ""} />
        <input type="hidden" name="public_id" value={asset?.publicId || ""} />
        <MediaUploader folder="gallery" accept="video" onUploaded={setAsset} />
        <label className="field">
          Title
          <input name="title" placeholder="Bedroom linens, morning light" required />
        </label>
        <label className="field">
          Description
          <textarea name="description" rows={3} placeholder="A short note for the gallery." />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="published" defaultChecked className="w-auto" />
          Publish on the gallery
        </label>
        <button className="btn-primary w-fit" disabled={!asset?.url}>
          Add to gallery
        </button>
      </form>

      <h2 className="font-display mt-12 text-3xl">Published films</h2>
      <div className="mt-6 grid gap-6">
        {gallery.items.length === 0 ? (
          <p className="text-sm text-mute">No films yet. Upload the first one above.</p>
        ) : (
          gallery.items.map((item) => (
            <article key={item.id} className="grid gap-4 bg-ivory p-4 md:grid-cols-[220px_1fr]">
              <video
                src={item.video_url}
                poster={item.poster_url || undefined}
                className="aspect-video w-full bg-ink object-cover"
                muted
                playsInline
                controls
              />
              <div>
                <p className="font-display text-2xl">{item.title}</p>
                <p className="mt-1 text-sm text-mute">{item.description}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.18em] text-bronze">
                  {item.published ? "Published" : "Hidden"}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <form action="/api/admin/manage" method="post">
                    <input type="hidden" name="action" value="gallery-toggle" />
                    <input type="hidden" name="id" value={item.id} />
                    <button className="btn-outline px-3 py-2 text-xs">{item.published ? "Hide" : "Publish"}</button>
                  </form>
                  <form action="/api/admin/manage" method="post">
                    <input type="hidden" name="action" value="gallery-delete" />
                    <input type="hidden" name="id" value={item.id} />
                    <button className="px-3 py-2 text-xs uppercase tracking-[0.18em] text-wine">Remove</button>
                  </form>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
