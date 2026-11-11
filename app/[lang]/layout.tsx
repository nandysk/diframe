import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { notFound } from "next/navigation";
import { MotionRoot } from "@/components/site/motion-root";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteNav } from "@/components/site/site-nav";
import { buttonVariants } from "@/components/ui/button";
import { getDictionary } from "@/content";
import { isLocale, locales, pagePath } from "@/lib/i18n/routes";
import { alternatesFor, shareImage, siteUrl } from "@/lib/i18n/metadata";
import "../globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400"],
});

// Runs before the first paint so the saved theme never flashes. It also turns on
// scroll animations, and turns them off again if the page's scripts never arrive,
// so a failed download can't leave content hidden.
const themeScript = `(function(){var r=document.documentElement;try{var t=localStorage.getItem("df-theme");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}r.dataset.theme=t}catch(e){}if(!matchMedia("(prefers-reduced-motion: reduce)").matches){r.dataset.motion="on";window.__dfMotionTimer=setTimeout(function(){window.__dfMotionExpired=true;delete r.dataset.motion},5000)}})()`;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const { meta } = getDictionary(lang);

  return {
    metadataBase: new URL(siteUrl),
    title: { default: meta.homeTitle, template: `%s | ${meta.siteName}` },
    description: meta.description,
    alternates: alternatesFor(lang, "home"),
    openGraph: {
      type: "website",
      siteName: meta.siteName,
      locale: lang === "fr" ? "fr_FR" : "en_US",
      alternateLocale: lang === "fr" ? "en_US" : "fr_FR",
      url: pagePath(lang, "home"),
      title: meta.homeTitle,
      description: meta.description,
      images: shareImage(meta.shareAlt),
    },
    twitter: { card: "summary_large_image", title: meta.homeTitle, description: meta.description, images: shareImage(meta.shareAlt) },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <html lang={lang} className={`${jakarta.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a
          href="#main"
          className={buttonVariants({
            size: "pill",
            className: "fixed left-4 top-4 z-50 -translate-y-24 focus:translate-y-0",
          })}
        >
          {dict.a11y.skip}
        </a>
        <MotionRoot />
        <SiteNav lang={lang} nav={dict.nav} a11y={dict.a11y} />
        <main id="main">{children}</main>
        <SiteFooter lang={lang} dict={dict} />
        {/* Visit counts without cookies. It only sends data once Web Analytics is turned on in Vercel. */}
        <Analytics />
      </body>
    </html>
  );
}
