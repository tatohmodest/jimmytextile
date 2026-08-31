import Link from "next/link";
import type { Metadata } from "next";
import { StoreShell } from "@/components/store/StoreShell";
import { Breadcrumbs } from "@/components/store/Breadcrumbs";
import { JsonLd } from "@/components/store/JsonLd";
import { getActiveCategories, getSiteContent } from "@/lib/queries";
import { FAQS } from "@/lib/seo-data";
import { faqSchema, pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = pageMetadata({
  title: "FAQ | Bedsheets, delivery, PayUnit and sizes in Cameroon",
  description:
    "Answers about Jimmy Home Textile: cotton bedsheets, curtains, towels, Douala and Yaoundé delivery, XAF prices, PayUnit, wholesale and care.",
  path: "/faq",
});

export default async function FaqPage() {
  const [content, categories] = await Promise.all([getSiteContent(), getActiveCategories()]);
  return (
    <StoreShell brand={content.brand} contact={content.contact} categories={categories}>
      <JsonLd data={faqSchema(FAQS)} />
      <section className="bg-forest px-4 pb-16 pt-32 text-ivory md:px-8">
        <div className="mx-auto max-w-7xl">
          <Breadcrumbs
            tone="light"
            items={[
              { name: "Home", path: "/" },
              { name: "FAQ", path: "/faq" },
            ]}
          />
          <p className="mt-8 text-[11px] tracking-[0.32em] uppercase text-sand">The house answers</p>
          <h1 className="font-display mt-3 max-w-3xl text-5xl md:text-7xl">Frequently asked questions</h1>
          <p className="mt-6 max-w-xl text-ivory/75 leading-7">
            Delivery across Cameroon, bed sizes, cotton care, PayUnit, wholesale towels and how to reach us on WhatsApp.
          </p>
        </div>
      </section>
      <div className="mx-auto max-w-3xl px-4 py-16 md:px-8">
        <dl className="grid gap-10">
          {FAQS.map((faq) => (
            <div key={faq.question} className="border-t border-ink/10 pt-6">
              <dt>
                <h2 className="font-display text-2xl">{faq.question}</h2>
              </dt>
              <dd className="mt-3 leading-7 text-mute">{faq.answer}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-14 text-sm text-mute">
          Still looking?{" "}
          <Link href="/contact" className="underline-offset-4 hover:underline">
            Write to the house
          </Link>{" "}
          or read the{" "}
          <Link href="/guides" className="underline-offset-4 hover:underline">
            atelier guides
          </Link>
          .
        </p>
      </div>
    </StoreShell>
  );
}
