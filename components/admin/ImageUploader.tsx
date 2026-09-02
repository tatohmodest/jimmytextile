"use client";

import { useState } from "react";
import { MAX_UPLOAD_BYTES } from "@/lib/media";
import { uploadMediaFile } from "@/lib/upload-client";
import type { CloudinaryUploadResult } from "@/lib/media";

type Kind = "image" | "video" | "auto";

export function MediaUploader({
  name,
  defaultUrl,
  defaultPoster,
  folder = "cms",
  accept = "auto",
  onUploaded,
}: {
  name?: string;
  defaultUrl?: string;
  defaultPoster?: string;
  folder?: string;
  accept?: Kind;
  onUploaded?: (asset: CloudinaryUploadResult) => void;
}) {
  const [url, setUrl] = useState(defaultUrl || "");
  const [poster, setPoster] = useState(defaultPoster || "");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [kind, setKind] = useState<"image" | "video">(defaultUrl?.includes("/video/") ? "video" : "image");

  const acceptAttr = accept === "video" ? "video/*" : accept === "image" ? "image/*" : "image/*,video/*";

  return (
    <div className="grid gap-2">
      {name ? <input type="hidden" name={name} value={url} /> : null}
      {url && kind === "video" ? (
        <video
          src={url}
          poster={poster || undefined}
          className="h-48 w-full bg-ink object-cover"
          muted
          playsInline
          controls
        />
      ) : url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="" className="h-40 w-full object-cover" />
      ) : (
        <div className="grid h-40 place-items-center bg-sand text-sm text-mute">
          {accept === "video" ? "No video" : "No file"}
        </div>
      )}
      <input
        type="file"
        accept={acceptAttr}
        onChange={async (event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (!file) return;
          setError(null);
          if (file.size >= MAX_UPLOAD_BYTES) {
            setError("File must be under 10MB.");
            return;
          }
          const resourceType = file.type.startsWith("video/") ? "video" : "image";
          if (accept === "image" && resourceType !== "image") {
            setError("Please choose an image.");
            return;
          }
          if (accept === "video" && resourceType !== "video") {
            setError("Please choose a video.");
            return;
          }
          setBusy(true);
          try {
            const asset = await uploadMediaFile(file, folder, resourceType);
            setKind(asset.resourceType);
            setUrl(asset.url);
            setPoster(asset.posterUrl || "");
            onUploaded?.(asset);
          } catch (err) {
            setError(err instanceof Error ? err.message : "Upload failed");
          } finally {
            setBusy(false);
          }
        }}
      />
      {busy ? (
        <p className="text-xs text-mute">
          Uploading to Cloudinary and compressing for the web. Quality stays high.
        </p>
      ) : (
        <p className="text-xs text-mute">
          {accept === "video"
            ? "Videos under 10MB. Cloudinary compresses them and keeps the look sharp."
            : accept === "image"
              ? "Images under 10MB. They are compressed on Cloudinary without a visible quality drop."
              : "Images and videos under 10MB. Files are compressed on Cloudinary."}
        </p>
      )}
      {error ? <p className="text-sm text-wine">{error}</p> : null}
    </div>
  );
}

export function ImageUploader({
  name,
  defaultUrl,
  folder = "cms",
  onUploaded,
}: {
  name: string;
  defaultUrl?: string;
  folder?: string;
  onUploaded?: (url: string) => void;
}) {
  return (
    <MediaUploader
      name={name}
      defaultUrl={defaultUrl}
      folder={folder}
      accept="image"
      onUploaded={(asset) => onUploaded?.(asset.url)}
    />
  );
}
