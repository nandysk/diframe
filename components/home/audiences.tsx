import Link from "next/link";
import { AudienceDiagram } from "@/components/home/audience-diagram";
import { GlassStage, RevealText, order } from "@/components/site/motion";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Dictionary } from "@/content";
import { cn } from "@/lib/utils";
import { pagePath, type Locale } from "@/lib/i18n/routes";

export function Audiences({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const { audiences } = dict;

  return (
    <section id="who-we-serve" data-surface="dark" className="section relative isolate overflow-hidden">
      <GlassStage variant="wide" />
      <div className="wrap">
        <div className="grid gap-5 lg:grid-cols-2 lg:items-end lg:gap-16">
          <RevealText text={audiences.title} className="type-section max-w-[16ch]" />
          <p data-reveal="" className="type-lead max-w-[46ch] text-[#c7c8ce]">
            {audiences.text}
          </p>
        </div>

        {/* Three cards above two wider ones, so the networks grow as the page goes down. */}
        <ul className="mt-12 grid gap-4 md:mt-16 lg:grid-cols-6 lg:gap-5">
          {audiences.items.map((audience, index) => {
            const wide = index > 2;
            return (
              <li key={audience.kind} className={cn("flex", wide ? "lg:col-span-3" : "lg:col-span-2")}>
                <Card
                  variant="glass"
                  data-reveal="card"
                  style={order(index)}
                  className="w-full gap-6 rounded-[28px] p-6 text-base md:p-8"
                >
                  <AudienceDiagram kind={audience.kind} />
                  <div>
                    <h3 className="text-[clamp(1.375rem,2vw,1.625rem)] leading-[1.18] tracking-[-0.022em]">
                      {audience.name}
                    </h3>
                    <p className="mt-3 max-w-[46ch] text-muted-foreground">{audience.text}</p>
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>

        <div data-reveal="" className="mt-10 md:mt-12">
          <Link href={pagePath(lang, "contact")} className={buttonVariants({ variant: "glass", size: "pill" })}>
            {audiences.action}
          </Link>
        </div>
      </div>
    </section>
  );
}
