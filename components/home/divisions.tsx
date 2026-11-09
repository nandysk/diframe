import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { RevealText, order } from "@/components/site/motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { Dictionary } from "@/content";
import { divisionPath, type Locale } from "@/lib/i18n/routes";

export function Divisions({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  return (
    <section className="section pt-0">
      <div className="wrap">
        <RevealText text={dict.divisions.title} className="type-section max-w-[20ch]" />
        <Accordion defaultValue={["division-0"]} className="mt-12 border-b border-line md:mt-20">
          {dict.divisions.items.map((division, index) => (
            <AccordionItem
              key={division.short}
              value={`division-${index}`}
              data-reveal=""
              className="division-row not-last:border-b-0"
              style={{ ...order(index), "--hue": `var(--d${index + 1})` } as React.CSSProperties}
            >
              <AccordionTrigger className="items-baseline gap-4 rounded-none border-0 py-[clamp(20px,2.4vw,30px)] hover:no-underline md:gap-6">
                <span className="w-7 shrink-0 font-mono text-[0.8125rem] font-normal text-muted-foreground md:w-10">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="division-name">{division.name}</span>
              </AccordionTrigger>
              <AccordionContent keepMounted className="pb-[clamp(22px,2.6vw,32px)] pl-11 pr-2 md:pl-16">
                <p className="max-w-[56ch] text-[1.0625rem] text-muted-foreground">{division.text}</p>
                <Link
                  href={divisionPath(lang, index)}
                  className="mt-3 inline-flex min-h-11 items-center gap-1.5 text-[0.9375rem] font-semibold text-link"
                >
                  {dict.divisions.explore}
                  <ArrowUpRightIcon aria-hidden="true" size={16} />
                </Link>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
