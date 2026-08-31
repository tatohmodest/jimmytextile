import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { ImageUploader } from "@/components/admin/ImageUploader";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const admin = createSupabaseAdminClient();
  const { data: categories } = await admin.from("categories").select("*").order("position");

  return (
    <div>
      <h1 className="font-display text-4xl">Categories</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {(categories || []).map((c) => (
          <form key={c.id} action="/api/admin/manage" method="post" className="grid gap-3 bg-ivory p-5">
            <input type="hidden" name="action" value="category" />
            <input type="hidden" name="id" value={c.id} />
            <label className="field">Name<input name="name" defaultValue={c.name} required /></label>
            <label className="field">Slug<input name="slug" defaultValue={c.slug} /></label>
            <label className="field">Description<textarea name="description" defaultValue={c.description || ""} /></label>
            <label className="field">Position<input name="position" type="number" defaultValue={c.position} /></label>
            <ImageUploader name="image_url" defaultUrl={c.image_url || ""} folder="categories" />
            <label className="flex gap-2 text-sm"><input type="checkbox" name="is_featured" defaultChecked={c.is_featured} className="w-auto" /> Featured</label>
            <label className="flex gap-2 text-sm"><input type="checkbox" name="is_active" defaultChecked={c.is_active} className="w-auto" /> Active</label>
            <button className="btn-primary w-fit">Save</button>
          </form>
        ))}
        <form action="/api/admin/manage" method="post" className="grid gap-3 border border-dashed border-ink/20 p-5">
          <h2 className="font-display text-2xl">New category</h2>
          <input type="hidden" name="action" value="category" />
          <label className="field">Name<input name="name" required /></label>
          <label className="field">Slug<input name="slug" /></label>
          <label className="field">Description<textarea name="description" /></label>
          <label className="field">Position<input name="position" type="number" defaultValue={0} /></label>
          <ImageUploader name="image_url" folder="categories" />
          <label className="flex gap-2 text-sm"><input type="checkbox" name="is_featured" defaultChecked className="w-auto" /> Featured</label>
          <label className="flex gap-2 text-sm"><input type="checkbox" name="is_active" defaultChecked className="w-auto" /> Active</label>
          <button className="btn-outline w-fit">Create</button>
        </form>
      </div>
    </div>
  );
}
