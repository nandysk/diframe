import type { Metadata } from "next";
import { divisionPath, locales, pagePath, type Locale, type PageKey } from "./routes";

// The live address. Previews and local copies point their canonical links here too,
// so search engines only ever index the real site.
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://diframe.studio";
export const SITE_NAME = "Diframe";

/** The image shown when any page is shared, with its description in the page's language. */
export function shareImage(alt: string) {
  return [{ url: "/brand/share.png", width: 1200, height: 630, alt }];
}

function build(lang: Locale, pathFor: (locale: Locale) => string) {
  return {
    canonical: pathFor(lang),
    languages: {
      ...Object.fromEntries(locales.map((locale) => [locale, pathFor(locale)])),
      "x-default": pathFor("en"),
    },
  };
}

export function alternatesFor(lang: Locale, page: PageKey) {
  return build(lang, (locale) => pagePath(locale, page));
}

export function divisionAlternates(lang: Locale, index: number) {
  return build(lang, (locale) => divisionPath(locale, index));
}

/** Title, description and link-sharing details for one page, so a shared link shows that page. */
export function pageMetadata(
  lang: Locale,
  { title, description, alternates, imageAlt }: { title: string; description: string; alternates: ReturnType<typeof build>; imageAlt: string },
): Metadata {
  const fullTitle = `${title} | ${SITE_NAME}`;
  return {
    title,
    description,
    alternates,
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: lang === "fr" ? "fr_FR" : "en_US",
      alternateLocale: lang === "fr" ? "en_US" : "fr_FR",
      url: alternates.canonical,
      title: fullTitle,
      description,
      images: shareImage(imageAlt),
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: shareImage(imageAlt) },
  };
}
