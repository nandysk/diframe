"use client";

import { ListIcon, XIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/site/logo";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import type { Dictionary } from "@/content";
import { LOCALE_COOKIE, locales, pagePath, switchLocalePath, type Locale, type PageKey } from "@/lib/i18n/routes";

const LINKS = ["solutions", "projects", "showcase", "company"] as const satisfies readonly PageKey[];

function rememberLanguage(lang: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${lang}; path=/; max-age=31536000; samesite=lax`;
}

function LanguageSwitch({ lang, pathname, label }: { lang: Locale; pathname: string; label: string }) {
  return (
    <div role="group" aria-label={label} className="flex items-center">
      {locales.map((locale) => (
        <Link
          key={locale}
          href={switchLocalePath(pathname, locale)}
          hrefLang={locale}
          lang={locale}
          onClick={() => rememberLanguage(locale)}
          aria-current={locale === lang ? "true" : undefined}
          className={`inline-grid h-11 w-9 place-items-center font-mono text-[0.8125rem] transition-colors ${
            locale === lang ? "text-fg" : "text-muted-foreground hover:text-fg"
          }`}
        >
          {locale.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}

export function SiteNav({
  lang,
  nav,
  a11y,
}: {
  lang: Locale;
  nav: Dictionary["nav"];
  a11y: Dictionary["a11y"];
}) {
  const pathname = usePathname();
  // These pages open on a dark hero, so the bar starts dark on them.
  const startsDark =
    pathname === `/${lang}` ||
    (["solutions", "projects", "showcase", "company", "contact", "privacy"] as const).some((page) => pathname.startsWith(pagePath(lang, page)));
  const [overDark, setOverDark] = useState(startsDark);
  const [open, setOpen] = useState(false);
  const barRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // The bar takes its colors from whichever band is passing behind it.
  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const bands = document.querySelectorAll('main [data-surface="dark"], footer[data-surface="dark"]');
    let observer: IntersectionObserver | undefined;
    const visible = new Set<Element>();

    const watch = () => {
      observer?.disconnect();
      visible.clear();
      const rect = bar.getBoundingClientRect();
      const line = Math.round(rect.top + 32);
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) visible.add(entry.target);
            else visible.delete(entry.target);
          });
          setOverDark(visible.size > 0);
        },
        { rootMargin: `-${line}px 0px -${Math.max(0, window.innerHeight - line - 1)}px 0px` },
      );
      bands.forEach((band) => observer?.observe(band));
    };

    watch();
    window.addEventListener("resize", watch);
    return () => {
      window.removeEventListener("resize", watch);
      observer?.disconnect();
    };
  }, [pathname]);

  // Close the menu when the address changes, adjusting state during render.
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const current = (page: PageKey) => {
    const path = pagePath(lang, page);
    return pathname === path || pathname.startsWith(`${path}/`) ? "page" : undefined;
  };

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 pt-3 md:pt-4">
      <div className="wrap">
        <nav
          ref={barRef}
          aria-label={a11y.mainNav}
          data-surface={overDark ? "dark" : undefined}
          className={`glass pointer-events-auto rounded-[28px] text-fg ${open ? "glass-open" : ""}`}
        >
          <div className="flex min-h-14 items-center justify-between gap-3 py-1.5 pl-5 pr-1.5">
            <Link href={pagePath(lang, "home")} aria-label={a11y.home} className="shrink-0 rounded-md">
              <Logo alt="" preload />
            </Link>

            <ul className="hidden items-center gap-7 lg:flex">
              {LINKS.map((page) => (
                <li key={page}>
                  <Link href={pagePath(lang, page)} className="nav-link" aria-current={current(page)}>
                    {nav[page]}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-1">
              <div className="hidden items-center gap-1 sm:flex">
                <LanguageSwitch lang={lang} pathname={pathname} label={a11y.language} />
                <ThemeToggle toDark={a11y.switchToDark} toLight={a11y.switchToLight} />
              </div>
              <Link
                href={pagePath(lang, "contact")}
                className={buttonVariants({ size: "pillSm", className: "ml-1 max-[379px]:hidden" })}
                aria-current={current("contact")}
              >
                {nav.contact}
              </Link>
              <button
                ref={menuButtonRef}
                type="button"
                className="icon-button lg:hidden"
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? a11y.closeMenu : a11y.openMenu}
                onClick={() => setOpen((value) => !value)}
              >
                {open ? <XIcon size={22} weight="light" /> : <ListIcon size={22} weight="light" />}
              </button>
            </div>
          </div>

          {open && (
            <div id="mobile-menu" className="border-t border-line px-5 pb-3 pt-2 lg:hidden">
              <ul>
                {LINKS.map((page) => (
                  <li key={page}>
                    <Link
                      href={pagePath(lang, page)}
                      className="nav-link w-full !text-[1.0625rem]"
                      aria-current={current(page)}
                      onClick={() => setOpen(false)}
                    >
                      {nav[page]}
                    </Link>
                  </li>
                ))}
                <li className="min-[380px]:hidden">
                  <Link
                    href={pagePath(lang, "contact")}
                    className="nav-link w-full !text-[1.0625rem]"
                    aria-current={current("contact")}
                    onClick={() => setOpen(false)}
                  >
                    {nav.contact}
                  </Link>
                </li>
              </ul>
              <div className="mt-1 flex items-center justify-between border-t border-line pt-1 sm:hidden">
                <LanguageSwitch lang={lang} pathname={pathname} label={a11y.language} />
                <ThemeToggle toDark={a11y.switchToDark} toLight={a11y.switchToLight} />
              </div>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
