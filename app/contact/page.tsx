import { StoreShell } from "@/components/store/StoreShell";
import { ContactForm } from "@/components/store/ContactForm";
import { getActiveCategories, getSiteContent } from "@/lib/queries";
import { Facebook, Mail, MapPin, Phone } from "lucide-react";
import { whatsappLink } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Contact" };

export default async function ContactPage() {
  const [content, categories] = await Promise.all([getSiteContent(), getActiveCategories()]);
  const c = content.contact;
  return (
    <StoreShell brand={content.brand} contact={c} categories={categories}>
      <div className="mx-auto grid max-w-7xl gap-12 px-4 pb-20 pt-32 md:grid-cols-2 md:px-8">
        <div>
          <p className="text-[11px] tracking-[0.32em] uppercase text-mute">Visit & talk</p>
          <h1 className="font-display mt-2 text-5xl">Contact</h1>
          <p className="mt-4 max-w-md text-mute">
            Questions about sizes, fabrics or a bulk order? Write to the house — we reply with care.
          </p>
          <ul className="mt-10 grid gap-4 text-sm">
            <li className="flex gap-3"><MapPin size={18} /> {c.address}, {c.city}</li>
            <li className="flex gap-3"><Phone size={18} /> {c.phone}</li>
            <li className="flex gap-3"><Mail size={18} /> {c.email}</li>
            <li>{c.hours}</li>
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={whatsappLink(c.whatsapp)} className="btn-primary" target="_blank" rel="noreferrer">
              Chat with us on WhatsApp
            </a>
            <a href={c.facebook} className="btn-outline" target="_blank" rel="noreferrer">
              <Facebook size={16} /> Facebook
            </a>
          </div>
        </div>
        <ContactForm />
      </div>
    </StoreShell>
  );
}
