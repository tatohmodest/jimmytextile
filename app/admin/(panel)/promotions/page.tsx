import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { ImageUploader } from "@/components/admin/ImageUploader";

export const dynamic = "force-dynamic";

export default async function PromotionsPage() {
  const admin = createSupabaseAdminClient();
  const { data: promotions } = await admin.from("promotions").select("*").order("position");

  return (
    <div>
      <h1 className="font-display text-4xl">Promotions</h1>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {(promotions || []).map((p) => (
          <form key={p.id} action="/api/admin/manage" method="post" className="grid gap-3 bg-ivory p-5">
            <input type="hidden" name="action" value="promotion" />
            <input type="hidden" name="id" value={p.id} />
            <ImageUploader name="image_url" defaultUrl={p.image_url || ""} folder="cms" />
            <label className="field">Heading<input name="heading" defaultValue={p.heading} /></label>
            <label className="field">Description<textarea name="description" defaultValue={p.description || ""} /></label>
            <label className="field">Button text<input name="button_text" defaultValue={p.button_text || ""} /></label>
            <label className="field">Button link<input name="button_link" defaultValue={p.button_link || ""} /></label>
            <label className="field">Position<input name="position" type="number" defaultValue={p.position} /></label>
            <label className="flex gap-2 text-sm"><input type="checkbox" name="is_active" defaultChecked={p.is_active} className="w-auto" /> Active</label>
            <button className="btn-primary w-fit">Save</button>
          </form>
        ))}
        <form action="/api/admin/manage" method="post" className="grid gap-3 border border-dashed p-5">
          <h2 className="font-display text-2xl">New banner</h2>
          <input type="hidden" name="action" value="promotion" />
          <ImageUploader name="image_url" folder="cms" />
          <label className="field">Heading<input name="heading" required /></label>
          <label className="field">Description<textarea name="description" /></label>
          <label className="field">Button text<input name="button_text" /></label>
          <label className="field">Button link<input name="button_link" /></label>
          <label className="flex gap-2 text-sm"><input type="checkbox" name="is_active" defaultChecked className="w-auto" /> Active</label>
          <button className="btn-outline w-fit">Create</button>
        </form>
      </div>
    </div>
  );
}
