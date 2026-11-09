// Page addresses for both languages. Keep this file free of server-only code:
// the proxy, server components and the language switcher all read it.

export const locales = ["en", "fr"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
export const LOCALE_COOKIE = "df-lang";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export const pageSlugs = {
  home: { en: "", fr: "" },
  solutions: { en: "solutions", fr: "solutions" },
  projects: { en: "projects", fr: "projets" },
  showcase: { en: "showcase", fr: "realisations" },
  company: { en: "company", fr: "entreprise" },
  contact: { en: "contact", fr: "contact" },
  privacy: { en: "privacy", fr: "confidentialite" },
} as const satisfies Record<string, Record<Locale, string>>;

export type PageKey = keyof typeof pageSlugs;

// Order matches the division numbering, 01 to 06.
export const divisionSlugs = [
  { en: "software-engineering", fr: "ingenierie-logicielle" },
  { en: "ai-automation", fr: "ia-automatisation" },
  { en: "data-intelligence", fr: "donnees-intelligence" },
  { en: "infrastructure-cloud", fr: "infrastructure-cloud" },
  { en: "cybersecurity", fr: "cybersecurite" },
  { en: "design-documents", fr: "design-documents" },
] as const satisfies readonly Record<Locale, string>[];

export function pagePath(lang: Locale, page: PageKey): string {
  const slug = pageSlugs[page][lang];
  return slug ? `/${lang}/${slug}` : `/${lang}`;
}

export function divisionPath(lang: Locale, index: number): string {
  return `/${lang}/${pageSlugs.solutions[lang]}/${divisionSlugs[index][lang]}`;
}

/** The page key for a top-level slug, or null when the slug isn't a page in that language. */
export function pageKeyFromSlug(lang: Locale, slug: string): PageKey | null {
  const keys = Object.keys(pageSlugs) as PageKey[];
  return keys.find((key) => key !== "home" && pageSlugs[key][lang] === slug) ?? null;
}

/** The same page in the other language, used by the language switcher. */
export function switchLocalePath(pathname: string, target: Locale): string {
  const [, current, first, second] = pathname.split("/");
  if (!current || !isLocale(current) || !first) return `/${target}`;

  const key = pageKeyFromSlug(current, first);
  if (!key) return `/${target}`;
  if (key === "solutions" && second) {
    const index = divisionSlugs.findIndex((slugs) => slugs[current] === second);
    return index >= 0 ? divisionPath(target, index) : pagePath(target, "solutions");
  }
  return pagePath(target, key);
}
