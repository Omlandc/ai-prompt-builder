// Helper: pick the right localized string from a { zh, en } object.
// Accept either string or { zh, en } so tool field labels/options can stay simple.
import type { Locale } from "@/types/tool";

export type Localized<T = string> = T | { zh: string; en: string };

export function loc(value: Localized, locale: Locale): string {
  if (typeof value === "string") return value;
  return value[locale];
}

export function locOptionLabel(opt: { value: string; label: Localized }, locale: Locale) {
  return loc(opt.label, locale);
}

export function locFieldLabel(field: { label: Localized }, locale: Locale) {
  return loc(field.label, locale);
}

export function locFieldPlaceholder(field: { placeholder?: Localized; hint?: Localized; columns?: { label: Localized }[] } | undefined, locale: Locale) {
  if (!field) return "";
  if (field.placeholder) return loc(field.placeholder, locale);
  return "";
}

export function locFieldHint(field: { hint?: Localized } | undefined, locale: Locale) {
  if (!field?.hint) return "";
  return loc(field.hint, locale);
}

export function locColumnLabel(col: { label: Localized }, locale: Locale) {
  return loc(col.label, locale);
}
