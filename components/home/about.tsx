import Link from "next/link";
import { ScrollWords } from "@/components/site/motion";
import type { Dictionary } from "@/content";
import { pagePath, type Locale } from "@/lib/i18n/routes";

export function About({
  lang,
  dict,
  showLink = true,
}: {
  lang: Locale;
  dict: Dictionary;
  showLink?: boolean;
}) {
  const { about } = dict;

  return (
    <section className="section">
      <div className="wrap grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,9fr)] lg:gap-10">
        <h2 className="pt-2 text-base font-medium tracking-normal text-muted-foreground">{about.label}</h2>
        <div>
          <ScrollWords
            text={about.statement}
            className="text-[clamp(1.75rem,3.7vw,3.25rem)] font-medium leading-[1.16] tracking-[-0.028em]"
          />
          <div className="mt-10 grid gap-5 md:mt-14 md:grid-cols-[minmax(0,6fr)_minmax(0,3fr)] md:items-end md:gap-10">
            <p data-reveal="" className="type-lead max-w-[56ch] text-muted-foreground">
              {about.text}
            </p>
            {showLink && (
              <div data-reveal="" className="md:justify-self-end">
                <Link href={pagePath(lang, "company")} className="text-link">
                  {about.link}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
