"use client";

import { useI18n } from "./LocaleProvider";

export function LanguageSwitch({ light = false }: { light?: boolean }) {
  const { locale, setLocale, t } = useI18n();
  const base = light ? "text-ivory/80" : "text-mute";
  const active = light ? "text-ivory" : "text-ink";

  return (
    <div className={`flex items-center gap-1 text-[11px] tracking-[0.18em] uppercase ${base}`} aria-label={t("lang.switch")}>
      <button
        type="button"
        className={locale === "en" ? active : "opacity-60 hover:opacity-100"}
        onClick={() => setLocale("en")}
      >
        EN
      </button>
      <span aria-hidden="true">/</span>
      <button
        type="button"
        className={locale === "fr" ? active : "opacity-60 hover:opacity-100"}
        onClick={() => setLocale("fr")}
      >
        FR
      </button>
    </div>
  );
}
