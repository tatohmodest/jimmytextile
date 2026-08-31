"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import type { GalleryItem } from "@/types";

export function VideoCard({ item, featured = false }: { item: GalleryItem; featured?: boolean }) {
  const [playing, setPlaying] = useState(false);

  return (
    <figure className={`group relative overflow-hidden bg-ink ${featured ? "min-h-[420px] md:min-h-[560px]" : "min-h-[240px] md:min-h-[320px]"}`}>
      {playing ? (
        <video
          src={item.video_url}
          poster={item.poster_url || undefined}
          className="absolute inset-0 h-full w-full object-cover"
          controls
          autoPlay
          playsInline
        />
      ) : (
        <button type="button" className="absolute inset-0 text-left" onClick={() => setPlaying(true)} aria-label={`Play ${item.title}`}>
          {item.poster_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.poster_url} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
          ) : (
            <video src={item.video_url} className="h-full w-full object-cover" muted playsInline preload="metadata" />
          )}
          <span className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/15 to-transparent" />
          <span className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-ivory/50 text-ivory">
            <Play size={22} fill="currentColor" />
          </span>
          <span className="absolute bottom-5 left-5 right-5 text-ivory">
            <span className="font-display block text-2xl md:text-3xl">{item.title}</span>
            {item.description ? <span className="mt-1 block max-w-lg text-sm text-ivory/75">{item.description}</span> : null}
          </span>
        </button>
      )}
    </figure>
  );
}
