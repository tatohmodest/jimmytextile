import { getSiteContent } from "@/lib/queries";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { requireAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const adminUser = await requireAdmin();
  if (!adminUser) redirect("/admin");
  const content = await getSiteContent();

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-4xl">Settings</h1>
      <form action="/api/admin/manage" method="post" className="mt-8 grid gap-4">
        <input type="hidden" name="action" value="settings" />
        <h2 className="font-display text-2xl">Brand</h2>
        <label className="field">Name<input name="brand_name" defaultValue={content.brand.name} /></label>
        <label className="field">Tagline<input name="brand_tagline" defaultValue={content.brand.tagline} /></label>
        <p className="text-[11px] uppercase tracking-[0.18em] text-mute">Logo</p>
        <ImageUploader name="logo_url" defaultUrl={content.brand.logo_url} folder="brand" />
        <h2 className="font-display mt-6 text-2xl">Contact</h2>
        <label className="field">Phone<input name="phone" defaultValue={content.contact.phone} /></label>
        <label className="field">Second phone<input name="phone_secondary" defaultValue={content.contact.phone_secondary || ""} /></label>
        <label className="field">Email<input name="email" defaultValue={content.contact.email} /></label>
        <label className="field">Address<input name="address" defaultValue={content.contact.address} /></label>
        <label className="field">City<input name="city" defaultValue={content.contact.city} /></label>
        <label className="field">Region<input name="region" defaultValue={content.contact.region} /></label>
        <label className="field">WhatsApp (country code + number)<input name="whatsapp" defaultValue={content.contact.whatsapp} /></label>
        <label className="field">Facebook<input name="facebook" defaultValue={content.contact.facebook} /></label>
        <label className="field">Instagram<input name="instagram" defaultValue={content.contact.instagram} /></label>
        <label className="field">Hours<input name="hours" defaultValue={content.contact.hours} /></label>
        <h2 className="font-display mt-6 text-2xl">About</h2>
        <ImageUploader name="about_image_url" defaultUrl={content.about.image_url} folder="cms" />
        <label className="field">Heading<input name="about_heading" defaultValue={content.about.heading} /></label>
        <label className="field">Body<textarea name="about_body" rows={4} defaultValue={content.about.body} /></label>
        <label className="field">Story<textarea name="about_story" rows={4} defaultValue={content.about.story} /></label>
        <label className="field">Mission<textarea name="about_mission" rows={4} defaultValue={content.about.mission} /></label>
        <label className="field">Extra image URLs<textarea name="about_extra_images" rows={3} defaultValue={content.about.extra_images.join("\n")} /></label>
        <h2 className="font-display mt-6 text-2xl">Delivery</h2>
        <label className="field">Delivery fee<input name="delivery_fee" type="number" defaultValue={content.delivery.fee} /></label>
        <label className="field">Free over<input name="free_over" type="number" defaultValue={content.delivery.free_over} /></label>
        <label className="field">Info<textarea name="delivery_info" defaultValue={content.delivery.info} /></label>
        <h2 className="font-display mt-6 text-2xl">SEO</h2>
        <label className="field">Title<input name="seo_title" defaultValue={content.seo.title} /></label>
        <label className="field">Description<textarea name="seo_description" defaultValue={content.seo.description} /></label>
        <label className="field">Open Graph image<input name="og_image" defaultValue={content.seo.og_image} /></label>
        <button className="btn-primary w-fit">Save settings</button>
      </form>
    </div>
  );
}
