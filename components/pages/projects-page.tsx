import Link from "next/link";
import { Closing } from "@/components/home/closing";
import { ProjectDiagram } from "@/components/home/project-diagram";
import { GlassStage, order } from "@/components/site/motion";
import { PageHero } from "@/components/site/page-hero";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Dictionary } from "@/content";
import { cn } from "@/lib/utils";
import { divisionPath, type Locale } from "@/lib/i18n/routes";

export function ProjectsPage({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const { projects, divisions } = dict;
  const { page } = projects;

  return (
    <>
      <PageHero title={page.title} text={page.text} />

      <section data-surface="dark" className="relative isolate overflow-hidden pb-[clamp(72px,10vw,152px)]">
        <GlassStage variant="wide" />
        <div className="wrap grid gap-5">
          {projects.items.map((project, index) => {
            const steps = [
              { label: page.need, text: project.need },
              { label: page.built, text: project.built },
              { label: page.result, text: project.result },
            ].filter((step) => step.text);

            return (
              <Card
                key={project.kind}
                id={project.kind}
                variant="glass"
                data-reveal="card"
                style={order(0)}
                className="scroll-mt-28 gap-8 rounded-[32px] p-6 text-base md:rounded-[40px] md:p-10 lg:grid lg:grid-cols-2 lg:items-center lg:gap-16 lg:p-14"
              >
                <div className={index % 2 ? "lg:order-last" : ""}>
                  <ProjectDiagram kind={project.kind} />
                </div>
                <div>
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant="outline"
                      className="h-auto whitespace-normal border-white/25 px-3 py-1 text-[0.8125rem] font-medium"
                    >
                      {project.category}
                    </Badge>
                    {project.client && (
                      <Badge className="h-auto whitespace-normal bg-white/12 px-3 py-1 text-[0.8125rem] font-medium text-foreground">
                        {project.client}
                      </Badge>
                    )}
                  </div>
                  <h2 className="mt-5 text-[clamp(1.75rem,3.2vw,2.75rem)] leading-[1.1] tracking-[-0.03em]">
                    {project.name}
                  </h2>
                  <dl className="mt-6 grid gap-4">
                    {steps.map((step) => (
                      <div key={step.label}>
                        <dt className="text-[0.9375rem] font-semibold">{step.label}</dt>
                        <dd className="mt-1 max-w-[50ch] text-muted-foreground">{step.text}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="mt-6">
                    <p className="text-[0.9375rem] font-semibold">{page.related}</p>
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {project.divisions.map((division) => (
                        <li key={division}>
                          <Link
                            href={divisionPath(lang, division)}
                            className={cn(
                              badgeVariants({ variant: "outline" }),
                              "h-auto min-h-11 whitespace-normal border-white/25 px-4 py-2 text-[0.875rem] font-medium hover:bg-white/10",
                            )}
                          >
                            {divisions.items[division].short}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      <Closing lang={lang} dict={dict} />
    </>
  );
}
