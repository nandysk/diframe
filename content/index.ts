import "server-only";
import type { Locale } from "@/lib/i18n/routes";
import en from "./en.json";
import fr from "./fr.json";

export type Dictionary = typeof en;

// English sets the required shape. If a text is missing from fr.json,
// this assignment fails and the site won't build.
const dictionaries: Record<Locale, Dictionary> = { en, fr };

export function getDictionary(lang: Locale): Dictionary {
  return dictionaries[lang];
}
