import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Closing } from "@/components/home/closing";
import { Hero } from "@/components/home/hero";
import { RevealText } from "@/components/site/motion";
import { DivisionDiagram } from "@/components/solutions/division-diagram";
import { buttonVariants } from "@/components/ui/button";
import { getDictionary } from "@/content";
import { alternatesFor, pageMetadata } from "@/lib/i18n/metadata";
import { divisionPath, isLocale, pagePath } from "@/lib/i18n/routes";

export async function generateMetadata({ params }: PageProps<"/[lang]/solutions">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = getDictionary(lang);
  return pageMetadata(lang, {
    title: dict.pages.solutions,
    description: dict.solutions.overview.description,
    alternates: alternatesFor(lang, "solutions"),
    imageAlt: dict.meta.shareAlt,
  });
}

export default async function SolutionsPage({ params }: PageProps<"/[lang]/solutions">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const { overview, items } = dict.solutions;

  return (
    <>
      <Hero
        lang={lang}
        dict={dict}
        title={overview.title}
        text={overview.text}
        actions={
          <>
            <a href="#divisions" className={buttonVariants({ size: "pill" })}>
              {overview.primary}
            </a>
            <Link href={pagePath(lang, "contact")} className={buttonVariants({ variant: "glass", size: "pill" })}>
              {dict.hero.secondary}
            </Link>
          </>
        }
      />

      <section id="divisions" className="section">
        <div className="wrap">
          <RevealText text={overview.listTitle} className="type-section max-w-[20ch]" />
          <ol className="mt-12 border-b border-line md:mt-20">
            {items.map((item, index) => {
              const { name } = dict.divisions.items[index];
              return (
                <li
                  key={name}
                  data-reveal=""
                  className="division-row grid gap-x-12 gap-y-6 py-[clamp(28px,4vw,56px)] lg:grid-cols-[200px_minmax(0,6fr)_minmax(0,5fr)]"
                  style={{ "--hue": `var(--d${index + 1})` } as React.CSSProperties}
                >
                  <DivisionDiagram index={index} className="max-w-[150px] lg:max-w-none" />
                  <div>
                    <p className="font-mono text-[0.8125rem] text-muted-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3 className="division-name mt-2">{name}</h3>
                    <p className="mt-4 max-w-[46ch] text-muted-foreground">{item.lead}</p>
                    <Link
                      href={divisionPath(lang, index)}
                      aria-label={`${dict.divisions.explore}: ${name}`}
                      className="mt-3 inline-flex min-h-11 items-center gap-1.5 text-[0.9375rem] font-semibold text-link underline underline-offset-4"
                    >
                      {dict.divisions.explore}
                      <ArrowUpRightIcon aria-hidden="true" size={16} />
                    </Link>
                  </div>
                  <ul className="self-start border-b border-line lg:mt-7">
                    {item.services.map((service) => (
                      <li key={service.name} className="border-t border-line py-2.5 text-[0.9375rem]">
                        {service.name}
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <Closing lang={lang} dict={dict} title={overview.closingTitle} text={overview.closingText} />
    </>
  );
}
