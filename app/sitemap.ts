import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/i18n/metadata";
import { divisionPath, divisionSlugs, locales, pagePath, type Locale, type PageKey } from "@/lib/i18n/routes";

const PAGES: PageKey[] = ["home", "solutions", "projects", "showcase", "company", "contact", "privacy"];

// Every page in both languages, each listing its other-language version.
export default function sitemap(): MetadataRoute.Sitemap {
  const pathFors: ((locale: Locale) => string)[] = [
    ...PAGES.map((page) => (locale: Locale) => pagePath(locale, page)),
    ...divisionSlugs.map((_, index) => (locale: Locale) => divisionPath(locale, index)),
  ];

  return pathFors.flatMap((pathFor) => {
    const languages = {
      ...Object.fromEntries(locales.map((locale) => [locale, `${siteUrl}${pathFor(locale)}`])),
      "x-default": `${siteUrl}${pathFor("en")}`,
    };
    return locales.map((locale) => ({ url: `${siteUrl}${pathFor(locale)}`, alternates: { languages } }));
  });
}
