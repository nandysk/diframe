import { CaretRightIcon } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Closing } from "@/components/home/closing";
import { Process } from "@/components/home/process";
import { Certifications } from "@/components/site/certifications";
import { divisionTopic } from "@/lib/contact/validate";
import { GlassStage, RevealText, order } from "@/components/site/motion";
import { DivisionDiagram } from "@/components/solutions/division-diagram";
import { ServiceIcon } from "@/components/solutions/service-icon";
import { badgeVariants } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getDictionary } from "@/content";
import { cn } from "@/lib/utils";
import { divisionAlternates, pageMetadata } from "@/lib/i18n/metadata";
import { divisionPath, divisionSlugs, isLocale, locales, pagePath } from "@/lib/i18n/routes";

export function generateStaticParams() {
  return locales.flatMap((lang) => divisionSlugs.map((slugs) => ({ lang, division: slugs[lang] })));
}

function indexOf(lang: string, slug: string) {
  return isLocale(lang) ? divisionSlugs.findIndex((slugs) => slugs[lang] === slug) : -1;
}

export async function generateMetadata({ params }: PageProps<"/[lang]/solutions/[division]">): Promise<Metadata> {
  const { lang, division } = await params;
  const index = indexOf(lang, division);
  if (index < 0 || !isLocale(lang)) return {};
  const dict = getDictionary(lang);
  return pageMetadata(lang, {
    title: dict.divisions.items[index].name,
    description: dict.solutions.items[index].lead,
    alternates: divisionAlternates(lang, index),
    imageAlt: dict.meta.shareAlt,
  });
}

export default async function DivisionPage({ params }: PageProps<"/[lang]/solutions/[division]">) {
  const { lang, division } = await params;
  const index = indexOf(lang, division);
  if (index < 0 || !isLocale(lang)) notFound();

  const dict = getDictionary(lang);
  const { labels, items } = dict.solutions;
  const item = items[index];
  const { name } = dict.divisions.items[index];
  const hue = { "--hue": `var(--d${index + 1})` } as React.CSSProperties;
  const related = dict.projects.items.filter((project) => (project.divisions as readonly number[]).includes(index));
  const hasProof = Boolean(item.stat.value) || item.certifications.length > 0;

  return (
    <>
      <section data-surface="dark" className="relative isolate overflow-hidden pb-[clamp(56px,7vw,104px)] pt-28 md:pt-36">
        <GlassStage />
        <div className="wrap grid items-center gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
          <div>
            <nav aria-label={labels.breadcrumb} className="hero-fade" style={{ "--delay": "0ms" } as React.CSSProperties}>
              <ol className="flex items-center gap-2 text-[0.9375rem] text-[#c7c8ce]">
                <li>
                  <Link href={pagePath(lang, "solutions")} className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-white">
                    {dict.pages.solutions}
                  </Link>
                </li>
                <li aria-hidden="true">
                  <CaretRightIcon size={14} />
                </li>
                <li aria-current="page" className="font-mono text-[0.8125rem]">
                  {String(index + 1).padStart(2, "0")}
                </li>
              </ol>
            </nav>
            <RevealText
              as="h1"
              hero
              text={name}
              className="hero-title mt-4 text-[clamp(2.375rem,5.2vw,4.5rem)] font-medium leading-[1.04] tracking-[-0.036em]"
            />
            <p
              className="hero-fade type-lead mt-6 max-w-[38rem] text-[#c7c8ce]"
              style={{ "--delay": "620ms" } as React.CSSProperties}
            >
              {item.lead}
            </p>
            <div className="hero-fade mt-8 flex flex-wrap gap-3" style={{ "--delay": "780ms" } as React.CSSProperties}>
              <Link href={`${pagePath(lang, "contact")}?topic=${divisionTopic(index)}`} className={buttonVariants({ size: "pill" })}>
                {dict.closing.action}
              </Link>
              <a href="#services" className={buttonVariants({ variant: "glass", size: "pill" })}>
                {labels.seeServices}
              </a>
            </div>
          </div>
          <Card variant="glass" data-reveal="card" className="rounded-[32px] p-6 md:p-10 md:rounded-[40px]">
            <DivisionDiagram index={index} />
          </Card>
        </div>
      </section>

      <section id="services" className="section">
        <div className="wrap grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <RevealText text={labels.services} className="type-section max-w-[14ch]" />
          </div>
          <ul className="border-b border-line" style={hue}>
            {item.services.map((service, serviceIndex) => (
              <li key={service.name} data-reveal="" style={order(serviceIndex)} className="flex items-start gap-4 border-t border-line py-[clamp(22px,2.6vw,32px)] md:gap-6">
                <ServiceIcon name={service.icon} />
                <div>
                  <h3 className="text-[clamp(1.375rem,2.2vw,1.875rem)] leading-[1.16] tracking-[-0.024em]">{service.name}</h3>
                  <p className="mt-2 max-w-[54ch] text-muted-foreground">{service.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section pt-0">
        <div className="wrap">
          <RevealText text={labels.needs} className="type-section" />
          <ul className="mt-10 grid gap-8 md:mt-14 lg:grid-cols-3 lg:gap-12" style={hue}>
            {item.needs.map((need, needIndex) => (
              <li key={need} data-reveal="" style={order(needIndex)} className="flex gap-4">
                <span aria-hidden="true" className="slant mt-[0.45em] !bg-[var(--hue)] text-[1.5rem]" />
                <p className="text-[clamp(1.25rem,1.9vw,1.5rem)] font-medium leading-[1.28] tracking-[-0.015em]">{need}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {hasProof && (
        <section className="section pt-0">
          <div className="wrap">
            <div className="grid gap-10 border-t border-line pt-10 md:pt-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
            {item.stat.value && (
              <div data-reveal="">
                {item.stat.lead && <p className="mb-1 text-muted-foreground">{item.stat.lead}</p>}
                <p className="whitespace-nowrap text-[clamp(3.25rem,6.6vw,6rem)] font-medium leading-[0.95] tracking-[-0.05em] tabular-nums">
                  <span data-reveal="" data-count={item.stat.value}>
                    {item.stat.value}
                  </span>
                </p>
                <p className="mt-3 max-w-[24ch] text-muted-foreground">{item.stat.label}</p>
              </div>
            )}
            {item.certifications.length > 0 && (
              <div className={item.stat.value ? "" : "lg:col-span-2"}>
                <h2 className="text-base font-medium tracking-normal text-muted-foreground">{labels.certifications}</h2>
                <div className="mt-5">
                  <Certifications items={item.certifications} />
                </div>
              </div>
            )}
            </div>
          </div>
        </section>
      )}

      <Process dict={dict} />

      <section className="pb-[clamp(72px,10vw,152px)]">
        <div className="wrap">
          {related.length > 0 && (
            <div className="mb-10">
              <h2 className="text-base font-medium tracking-normal text-muted-foreground">{labels.relatedProjects}</h2>
              <ul className="mt-5 flex flex-wrap gap-3">
                {related.map((project) => (
                  <li key={project.kind}>
                    <Link
                      href={`${pagePath(lang, "projects")}#${project.kind}`}
                      className={cn(
                        badgeVariants({ variant: "outline" }),
                        "h-auto min-h-11 whitespace-normal px-5 py-2 text-[0.9375rem] font-medium",
                      )}
                    >
                      {project.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <h2 className="text-base font-medium tracking-normal text-muted-foreground">{labels.others}</h2>
          <ul className="mt-5 flex flex-wrap gap-3">
            {dict.divisions.items.map((other, otherIndex) =>
              otherIndex === index ? null : (
                <li key={other.short}>
                  <Link
                    href={divisionPath(lang, otherIndex)}
                    className={cn(
                      badgeVariants({ variant: "outline" }),
                      "h-auto min-h-11 whitespace-normal px-5 py-2 text-[0.9375rem] font-medium",
                    )}
                  >
                    {other.short}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </div>
      </section>

      <Closing lang={lang} dict={dict} topic={divisionTopic(index)} />
    </>
  );
}
