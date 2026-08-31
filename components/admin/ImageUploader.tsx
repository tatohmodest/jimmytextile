"use client";

import { useState } from "react";

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
  const [url, setUrl] = useState(defaultUrl || "");
  const [busy, setBusy] = useState(false);

  return (
    <div className="grid gap-2">
      <input type="hidden" name={name} value={url} />
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="" className="h-40 w-full object-cover" />
      ) : (
        <div className="grid h-40 place-items-center bg-sand text-sm text-mute">No image</div>
      )}
      <input
        type="file"
        accept="image/*"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          setBusy(true);
          const fd = new FormData();
          fd.set("file", file);
          fd.set("folder", folder);
          const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
          const json = await res.json();
          setBusy(false);
          if (json.url) {
            setUrl(json.url);
            onUploaded?.(json.url);
          }
        }}
      />
      {busy ? <p className="text-xs text-mute">Uploading to Cloudinary...</p> : null}
    </div>
  );
}
