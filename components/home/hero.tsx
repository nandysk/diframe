import Link from "next/link";
import { HeroNetwork } from "@/components/home/hero-network";
import { RevealText } from "@/components/site/motion";
import { buttonVariants } from "@/components/ui/button";
import type { Dictionary } from "@/content";
import { divisionPath, pagePath, type Locale } from "@/lib/i18n/routes";

// The hero with the live globe and division islands. The homepage uses it as is; other pages pass their own
// title, text and buttons.
export function Hero({
  lang,
  dict,
  title = dict.hero.title,
  text = dict.hero.text,
  actions,
}: {
  lang: Locale;
  dict: Dictionary;
  title?: string;
  text?: string;
  actions?: React.ReactNode;
}) {
  const chips = dict.divisions.items.map((division, index) => ({
    label: division.short,
    href: divisionPath(lang, index),
  }));

  return (
    <section
      data-surface="dark"
      className="relative isolate flex min-h-svh flex-col overflow-hidden lg:max-h-[1040px]"
    >
      {/* Softens the particles behind the text; they already fade themselves there. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(8,9,11,0)_0%,rgba(8,9,11,0.4)_40%,rgba(8,9,11,0.4)_62%,rgba(8,9,11,0)_80%)] lg:bg-[linear-gradient(90deg,rgba(8,9,11,0.55)_0%,rgba(8,9,11,0.4)_36%,rgba(8,9,11,0)_60%)]"
      />
      {/* Equal rows above and below keep the text at the true middle of the hero.
          Very short screens stack from the top instead, so the hero never outgrows the screen by much. */}
      <div className="wrap grid flex-1 grid-rows-[88px_auto_1fr] [@media(min-height:760px)]:grid-rows-[1fr_auto_1fr]">
        <div />
        <div className="max-w-[44rem]">
          <RevealText as="h1" hero text={title} className="hero-title type-display" />
          <p
            className="hero-fade type-lead mt-6 max-w-[34rem] text-[#c7c8ce]"
            style={{ "--delay": "620ms" } as React.CSSProperties}
          >
            {text}
          </p>
          <div
            className="hero-fade mt-8 flex flex-wrap gap-3"
            style={{ "--delay": "780ms" } as React.CSSProperties}
          >
            {actions ?? (
              <>
                <Link href={pagePath(lang, "solutions")} className={buttonVariants({ size: "pill" })}>
                  {dict.hero.primary}
                </Link>
                <Link
                  href={pagePath(lang, "contact")}
                  className={buttonVariants({ variant: "glass", size: "pill" })}
                >
                  {dict.hero.secondary}
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="flex items-end pb-6 pt-8 md:pb-8">
          <HeroNetwork chips={chips} label={dict.a11y.divisionLinks} />
        </div>
      </div>
    </section>
  );
}
