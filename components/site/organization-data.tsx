import type { Dictionary } from "@/content";
import { siteUrl } from "@/lib/i18n/metadata";
import { pagePath, type Locale } from "@/lib/i18n/routes";

// Company details in the format search engines read (schema.org), on the homepage.
// No address, to match the site's global positioning. Everything comes from the
// content files, so it stays in step with what visitors see.
export function OrganizationData({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: dict.meta.siteName,
        url: siteUrl,
        logo: `${siteUrl}/apple-icon.png`,
        description: dict.meta.description,
        foundingDate: dict.company.sinceValue,
        email: dict.contact.email || undefined,
        knowsAbout: dict.divisions.items.map((division) => division.name),
        contactPoint: dict.contact.email
          ? { "@type": "ContactPoint", contactType: "sales", email: dict.contact.email, availableLanguage: ["English", "French"] }
          : undefined,
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        name: dict.meta.siteName,
        url: `${siteUrl}${pagePath(lang, "home")}`,
        inLanguage: lang,
        publisher: { "@id": `${siteUrl}/#organization` },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // Escaping "<" keeps any text in the content files from closing the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
