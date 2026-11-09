import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CompanyPage } from "@/components/pages/company-page";
import { ContactPage } from "@/components/pages/contact-page";
import { PrivacyPage } from "@/components/pages/privacy-page";
import { ProjectsPage } from "@/components/pages/projects-page";
import { ShowcasePage } from "@/components/pages/showcase-page";
import { getDictionary } from "@/content";
import { alternatesFor, pageMetadata } from "@/lib/i18n/metadata";
import { isLocale, locales, pageKeyFromSlug, pageSlugs, type Locale, type PageKey } from "@/lib/i18n/routes";

// One route serves these pages so each language has its own real address,
// such as /en/projects and /fr/projets. /solutions has its own folder.
const PAGES = ["projects", "showcase", "company", "contact", "privacy"] as const satisfies readonly PageKey[];
type RoutedPage = (typeof PAGES)[number];

export function generateStaticParams() {
  return locales.flatMap((lang) => PAGES.map((page) => ({ lang, page: pageSlugs[page][lang] })));
}

function resolve(lang: string, slug: string): { lang: Locale; key: RoutedPage } | null {
  if (!isLocale(lang)) return null;
  const key = pageKeyFromSlug(lang, slug);
  return key && (PAGES as readonly string[]).includes(key) ? { lang, key: key as RoutedPage } : null;
}

export async function generateMetadata({ params }: PageProps<"/[lang]/[page]">): Promise<Metadata> {
  const { lang, page } = await params;
  const match = resolve(lang, page);
  if (!match) return {};
  const dict = getDictionary(match.lang);
  const descriptions: Record<RoutedPage, string> = {
    projects: dict.projects.page.description,
    showcase: dict.showcase.page.description,
    company: dict.company.description,
    contact: dict.contact.description,
    privacy: dict.privacy.description,
  };
  return pageMetadata(match.lang, {
    title: dict.pages[match.key],
    description: descriptions[match.key],
    alternates: alternatesFor(match.lang, match.key),
    imageAlt: dict.meta.shareAlt,
  });
}

export default async function Page({ params }: PageProps<"/[lang]/[page]">) {
  const { lang, page } = await params;
  const match = resolve(lang, page);
  if (!match) notFound();
  const dict = getDictionary(match.lang);
  if (match.key === "projects") return <ProjectsPage lang={match.lang} dict={dict} />;
  if (match.key === "showcase") return <ShowcasePage lang={match.lang} dict={dict} />;
  if (match.key === "company") return <CompanyPage lang={match.lang} dict={dict} />;
  if (match.key === "contact") return <ContactPage lang={match.lang} dict={dict} />;
  return <PrivacyPage dict={dict} />;
}
