export const LOCALE_COOKIE = "jht_locale";
export const LOCALES = ["en", "fr"] as const;
export type Locale = (typeof LOCALES)[number];

export function isLocale(value?: string | null): value is Locale {
  return value === "en" || value === "fr";
}

export function detectLocale(acceptLanguage?: string | null, cookie?: string | null): Locale {
  if (isLocale(cookie)) return cookie;
  const header = (acceptLanguage || "").toLowerCase();
  if (!header) return "en";

  const parts = header.split(",").map((part) => {
    const [tag, ...params] = part.trim().split(";");
    const q = params.find((p) => p.trim().startsWith("q="));
    const quality = q ? Number(q.split("=")[1]) : 1;
    const lang = tag.trim().split("-")[0];
    return { lang, quality: Number.isFinite(quality) ? quality : 1 };
  });

  const french = Math.max(0, ...parts.filter((p) => p.lang === "fr").map((p) => p.quality));
  const english = Math.max(0, ...parts.filter((p) => p.lang === "en").map((p) => p.quality));
  if (french === 0 && english === 0) return "en";
  if (french > english) return "fr";
  if (english > french) return "en";
  const first = parts.find((p) => p.lang === "fr" || p.lang === "en");
  return first?.lang === "fr" ? "fr" : "en";
}
