import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { ImageUploader } from "@/components/admin/ImageUploader";

export const dynamic = "force-dynamic";

export default async function MediaPage() {
  const admin = createSupabaseAdminClient();
  const { data: media } = await admin.from("media_library").select("*").order("created_at", { ascending: false }).limit(60);

  return (
    <div>
      <h1 className="font-display text-4xl">Media</h1>
      <p className="mt-2 text-sm text-mute">Upload photography to Cloudinary. Copy the URL into products, categories or homepage fields.</p>
      <div className="mt-6 max-w-md bg-ivory p-5">
        <ImageUploader name="latest" folder="media" />
      </div>
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {(media || []).map((m) => (
          <figure key={m.id} className="bg-ivory p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={m.url} alt={m.alt_text || ""} className="aspect-[4/5] w-full object-cover" />
            <figcaption className="mt-2 break-all text-[10px] text-mute">{m.url}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
