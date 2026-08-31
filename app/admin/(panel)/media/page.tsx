import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { MediaUploader } from "@/components/admin/ImageUploader";

export const dynamic = "force-dynamic";

export default async function MediaPage() {
  const admin = createSupabaseAdminClient();
  const { data: media } = await admin.from("media_library").select("*").order("created_at", { ascending: false }).limit(60);

  return (
    <div>
      <h1 className="font-display text-4xl">Media</h1>
      <p className="mt-2 text-sm text-mute">
        Upload photography and film to Cloudinary. Files must be under 10MB; they are compressed while staying sharp. Copy a URL into products or add films in Gallery.
      </p>
      <div className="mt-6 max-w-md bg-ivory p-5">
        <MediaUploader folder="media" accept="auto" />
      </div>
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {(media || []).map((m) => (
          <figure key={m.id} className="bg-ivory p-2">
            {String(m.url || "").includes("/video/") ? (
              <video src={m.url} className="aspect-[4/5] w-full object-cover" muted playsInline preload="metadata" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={m.url} alt={m.alt_text || ""} className="aspect-[4/5] w-full object-cover" />
            )}
            <figcaption className="mt-2 break-all text-[10px] text-mute">{m.url}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
