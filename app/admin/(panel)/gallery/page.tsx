import { getSiteContent } from "@/lib/queries";
import { GalleryManager } from "@/components/admin/GalleryManager";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const content = await getSiteContent();
  return (
    <div>
      <h1 className="font-display text-4xl">Gallery</h1>
      <p className="mt-2 max-w-xl text-sm text-mute">
        Post short films of the house. They appear on /gallery and can show on the homepage.
      </p>
      <div className="mt-8">
        <GalleryManager gallery={content.gallery} />
      </div>
    </div>
  );
}
