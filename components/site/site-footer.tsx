import Link from "next/link";
import { Logo } from "@/components/site/logo";
import type { Dictionary } from "@/content";
import { divisionPath, pagePath, type Locale, type PageKey } from "@/lib/i18n/routes";

const EXPLORE = ["solutions", "projects", "showcase", "company", "contact"] as const satisfies readonly PageKey[];

export function SiteFooter({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const year = new Date().getFullYear();
  const linkClass = "inline-flex min-h-11 items-center text-[0.9375rem] text-muted-foreground transition-colors hover:text-fg sm:min-h-9";

  return (
    <footer data-surface="dark" className="border-t border-line pb-8 pt-16 md:pt-24">
      <div className="wrap">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.6fr)_minmax(0,1fr)] lg:gap-16">
          <div className="max-w-sm">
            <Logo alt={dict.meta.siteName} />
            <p className="mt-6 text-muted-foreground">{dict.footer.tagline}</p>
          </div>

          <div>
            <h2 className="mb-3 text-[0.9375rem] font-semibold tracking-normal">{dict.footer.explore}</h2>
            <ul>
              {EXPLORE.map((page) => (
                <li key={page}>
                  <Link href={pagePath(lang, page)} className={linkClass}>
                    {dict.pages[page]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-3 text-[0.9375rem] font-semibold tracking-normal">{dict.footer.solutions}</h2>
            <ul>
              {dict.divisions.items.map((division, index) => (
                <li key={division.short}>
                  <Link href={divisionPath(lang, index)} className={linkClass}>
                    {division.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-x-8 gap-y-2 border-t border-line pt-5 text-sm text-muted-foreground">
          <p>© {year} Diframe</p>
          <Link href={pagePath(lang, "privacy")} className="inline-flex min-h-11 items-center transition-colors hover:text-fg">
            {dict.footer.privacy}
          </Link>
        </div>
      </div>
    </footer>
  );
}
