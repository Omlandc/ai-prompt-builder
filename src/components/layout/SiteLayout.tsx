import { Outlet } from "react-router";
import { useState } from "react";
import type { Locale } from "@/types/tool";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { detectLocale } from "@/config/site";

export function SiteLayout() {
  const [locale, setLocale] = useState<Locale>(detectLocale());
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <SiteHeader locale={locale} onLocaleChange={setLocale} />
      <main className="flex-1">
        <Outlet context={{ locale, setLocale }} />
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}

export type SiteOutletContext = { locale: Locale; setLocale: (l: Locale) => void };
