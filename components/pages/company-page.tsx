import { About } from "@/components/home/about";
import { Audiences } from "@/components/home/audiences";
import { Closing } from "@/components/home/closing";
import { Expertise } from "@/components/home/expertise";
import { Process } from "@/components/home/process";
import { Proof } from "@/components/home/proof";
import { PageHero } from "@/components/site/page-hero";
import { Card } from "@/components/ui/card";
import type { Dictionary } from "@/content";
import type { Locale } from "@/lib/i18n/routes";

export function CompanyPage({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const { company } = dict;

  return (
    <>
      <PageHero
        title={company.title}
        text={company.text}
        aside={
          <Card variant="glass" data-reveal="card" className="gap-2 rounded-[32px] p-7 text-base md:p-10">
            <p className="text-muted-foreground">{company.sinceLabel}</p>
            <p className="text-[clamp(3.5rem,7vw,6rem)] font-medium leading-none tracking-[-0.05em] tabular-nums">
              {company.sinceValue}
            </p>
          </Card>
        }
      />
      <About lang={lang} dict={dict} showLink={false} />
      <Proof dict={dict} />
      <Audiences lang={lang} dict={dict} />
      <div className="pt-[clamp(72px,10vw,152px)]">
        <Expertise dict={dict} />
      </div>
      <Process dict={dict} />
      <Closing lang={lang} dict={dict} />
    </>
  );
}
