"use client";

import { useEffect, useRef, useState } from "react";
import { MAX_UPLOAD_BYTES } from "@/lib/media";
import { uploadMediaFile } from "@/lib/upload-client";

export type ProductPhoto = {
  url: string;
  alt: string;
};

function isRealPhoto(url?: string) {
  return Boolean(url && !url.includes("placeholder-linen"));
}

function altFor(productName: string, index: number) {
  const name = productName.trim() || "Product";
  return index === 0 ? `${name} — main product photo` : `${name} — related photo ${index + 1}`;
}

export function ProductImagePicker({
  productName,
  initial,
  onBusyChange,
}: {
  productName: string;
  initial: ProductPhoto[];
  onBusyChange?: (busy: boolean) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<ProductPhoto[]>(initial.filter((item) => isRealPhoto(item.url)));
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    setPhotos((prev) => prev.map((photo, index) => ({ ...photo, alt: altFor(productName, index) })));
  }, [productName]);

  function setUploading(next: boolean) {
    setBusy(next);
    onBusyChange?.(next);
  }

  function withAlts(list: ProductPhoto[]) {
    return list.map((photo, index) => ({ ...photo, alt: altFor(productName, index) }));
  }

  async function addFiles(fileList: FileList | File[]) {
    const files = Array.from(fileList).filter((file) => file.type.startsWith("image/"));
    if (!files.length) {
      setError("Choose image files from your computer.");
      return;
    }
    const tooBig = files.find((file) => file.size >= MAX_UPLOAD_BYTES);
    if (tooBig) {
      setError(`${tooBig.name} is over 10MB. Pick a smaller file and try again.`);
      return;
    }
    setError(null);
    setUploading(true);
    try {
      for (let i = 0; i < files.length; i += 1) {
        setProgress(`Uploading ${i + 1} of ${files.length}: ${files[i].name}`);
        const asset = await uploadMediaFile(files[i], "products", "image");
        setPhotos((prev) => withAlts([...prev, { url: asset.url, alt: "" }]));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      setProgress("");
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function makeMain(index: number) {
    setPhotos((prev) => {
      if (index <= 0) return prev;
      const next = [...prev];
      const [chosen] = next.splice(index, 1);
      next.unshift(chosen);
      return withAlts(next);
    });
  }

  function move(index: number, direction: -1 | 1) {
    setPhotos((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      const [item] = next.splice(index, 1);
      next.splice(target, 0, item);
      return withAlts(next);
    });
  }

  function removeAt(index: number) {
    setPhotos((prev) => withAlts(prev.filter((_, i) => i !== index)));
  }

  return (
    <div className="grid gap-4 border border-ink/10 p-4">
      {photos.map((photo) => (
        <span key={photo.url}>
          <input type="hidden" name="image_urls" value={photo.url} />
          <input type="hidden" name="image_alts" value={photo.alt} />
        </span>
      ))}

      <div>
        <p className="text-[11px] uppercase tracking-[0.18em] text-mute">Product photos</p>
        <p className="mt-2 text-sm text-ink">
          Pick several pictures from your computer. The first file you select is the main photo. After they upload, tap
          <span className="font-medium"> Make this the main photo</span> on any later picture to swap it to first.
        </p>
      </div>

      <div
        className={`grid gap-3 border border-dashed px-4 py-6 ${
          dragOver ? "border-ink bg-sand/60" : "border-ink/20 bg-sand/30"
        }`}
        onDragOver={(event) => {
          event.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragOver(false);
          if (event.dataTransfer.files?.length) addFiles(event.dataTransfer.files);
        }}
      >
        <label className="field">
          Choose photos
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            disabled={busy}
            onChange={(event) => {
              if (event.target.files?.length) addFiles(event.target.files);
            }}
          />
        </label>
        <p className="text-sm text-mute">
          Hold Ctrl (Windows) or Command (Mac) and click several files, or drop them here. Each file stays under 10MB.
          No URLs. Files upload and compress automatically.
        </p>
      </div>

      {progress ? <p className="text-xs text-mute">{progress}</p> : null}
      {error ? <p className="text-sm text-wine">{error}</p> : null}

      {photos.length ? (
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {photos.map((photo, index) => (
            <figure key={photo.url} className="border border-ink/10 bg-ivory">
              <div className="relative aspect-[4/5] bg-sand">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.url} alt={photo.alt} className="h-full w-full object-cover" loading="eager" />
                <span className="absolute left-2 top-2 bg-ink px-2 py-1 text-[10px] tracking-[0.16em] text-ivory uppercase">
                  {index === 0 ? "Main photo" : `Photo ${index + 1}`}
                </span>
              </div>
              <figcaption className="grid gap-2 p-3">
                {index !== 0 ? (
                  <button type="button" className="btn-outline py-2 text-xs" onClick={() => makeMain(index)}>
                    Make this the main photo
                  </button>
                ) : (
                  <p className="text-xs text-mute">This is the photo shoppers see first.</p>
                )}
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="text-xs uppercase tracking-[0.16em] text-mute disabled:opacity-30"
                    disabled={index === 0}
                    onClick={() => move(index, -1)}
                  >
                    Move left
                  </button>
                  <button
                    type="button"
                    className="text-xs uppercase tracking-[0.16em] text-mute disabled:opacity-30"
                    disabled={index === photos.length - 1}
                    onClick={() => move(index, 1)}
                  >
                    Move right
                  </button>
                  <button
                    type="button"
                    className="ml-auto text-xs uppercase tracking-[0.16em] text-wine"
                    onClick={() => removeAt(index)}
                  >
                    Remove
                  </button>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      ) : (
        <p className="text-sm text-mute">No photos yet. Choose pictures from your computer — you do not paste a URL.</p>
      )}
    </div>
  );
}
