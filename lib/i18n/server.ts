import { cookies, headers } from "next/headers";
import { detectLocale, LOCALE_COOKIE, type Locale } from "./locale";
import { pickLocalized, translate, type MessageKey } from "./messages";

export async function getLocale(): Promise<Locale> {
  const jar = await cookies();
  const hdrs = await headers();
  return detectLocale(hdrs.get("accept-language"), jar.get(LOCALE_COOKIE)?.value);
}

export async function getTranslator() {
  const locale = await getLocale();
  return {
    locale,
    t: (key: MessageKey, vars?: Record<string, string | number>) => translate(locale, key, vars),
    pick: (en?: string | null, fr?: string | null) => pickLocalized(locale, en, fr),
  };
}
