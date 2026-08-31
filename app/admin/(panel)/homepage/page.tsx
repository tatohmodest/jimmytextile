import { getSiteContent } from "@/lib/queries";
import { ImageUploader } from "@/components/admin/ImageUploader";

export const dynamic = "force-dynamic";

export default async function HomepageCmsPage() {
  const content = await getSiteContent();
  const order = [...content.homepage_sections].sort((a, b) => a.position - b.position);

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-4xl">Homepage</h1>
      <p className="mt-2 text-sm text-mute">Change hero, promotions, why-choose copy, and section order without a developer.</p>
      <form action="/api/admin/manage" method="post" className="mt-8 grid gap-6">
        <input type="hidden" name="action" value="homepage" />
        <h2 className="font-display text-2xl">Hero</h2>
        <ImageUploader name="hero_image_url" defaultUrl={content.hero.image_url} folder="cms" />
        <label className="field">Heading<input name="hero_heading" defaultValue={content.hero.heading} /></label>
        <label className="field">Description<textarea name="hero_description" defaultValue={content.hero.description} /></label>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="field">Primary button text<input name="hero_primary_button_text" defaultValue={content.hero.primary_button_text} /></label>
          <label className="field">Primary button link<input name="hero_primary_button_link" defaultValue={content.hero.primary_button_link} /></label>
          <label className="field">Secondary button text<input name="hero_secondary_button_text" defaultValue={content.hero.secondary_button_text} /></label>
          <label className="field">Secondary button link<input name="hero_secondary_button_link" defaultValue={content.hero.secondary_button_link} /></label>
        </div>
        <h2 className="font-display text-2xl">Promotional banner</h2>
        <ImageUploader name="promo_image_url" defaultUrl={content.promo.image_url} folder="cms" />
        <label className="field">Heading<input name="promo_heading" defaultValue={content.promo.heading} /></label>
        <label className="field">Description<textarea name="promo_description" defaultValue={content.promo.description} /></label>
        <label className="field">Button text<input name="promo_button_text" defaultValue={content.promo.button_text} /></label>
        <label className="field">Button link<input name="promo_button_link" defaultValue={content.promo.button_link} /></label>
        <label className="flex gap-2 text-sm"><input type="checkbox" name="promo_enabled" defaultChecked={content.promo.enabled} className="w-auto" /> Show promotional section</label>
        <h2 className="font-display text-2xl">Why choose us</h2>
        {content.features.map((f, i) => (
          <div key={i} className="grid gap-2 border-t border-ink/10 pt-4">
            <label className="field">Title<input name={`feature_title_${i}`} defaultValue={f.title} /></label>
            <label className="field">Description<textarea name={`feature_description_${i}`} defaultValue={f.description} /></label>
            <label className="field">Icon key<input name={`feature_icon_${i}`} defaultValue={f.icon} /></label>
          </div>
        ))}
        <h2 className="font-display text-2xl">Section order</h2>
        <p className="text-xs text-mute">Comma-separated ids. Toggle visibility with the checkboxes. Include gallery to show atelier films on the homepage.</p>
        <input name="section_order" defaultValue={order.map((s) => s.id).join(",")} />
        {order.map((s) => (
          <label key={s.id} className="flex gap-2 text-sm">
            <input type="checkbox" name={`section_${s.id}`} defaultChecked={s.enabled} className="w-auto" />
            {s.id}
          </label>
        ))}
        <button className="btn-primary w-fit">Save homepage</button>
      </form>
    </div>
  );
}
