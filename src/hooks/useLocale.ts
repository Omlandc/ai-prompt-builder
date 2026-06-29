import { useEffect, useState } from "react";
import type { Locale } from "@/types/tool";
import { LOCALE_STORAGE_KEY, detectLocale } from "@/config/site";

export function useLocale(): [Locale, (loc: Locale) => void] {
  const [locale, setLocaleState] = useState<Locale>(detectLocale());

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
      document.documentElement.lang = locale === "en" ? "en" : "zh-CN";
    }
  }, [locale]);

  return [locale, setLocaleState];
}
