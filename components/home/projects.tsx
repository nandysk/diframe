import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { ProjectScene } from "@/components/projects/project-scenes";
import { GlassStage, RevealText, order } from "@/components/site/motion";
import { ParticleField } from "@/components/site/particle-field";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Dictionary } from "@/content";
import { cn } from "@/lib/utils";
import { pagePath, type Locale } from "@/lib/i18n/routes";

export function Projects({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const { projects } = dict;
  const href = pagePath(lang, "projects");

  return (
    <section data-surface="dark" className="section relative isolate overflow-hidden">
      <GlassStage variant="wide" />
      <ParticleField />
      <div className="wrap">
        <div className="grid gap-5 lg:grid-cols-2 lg:items-end lg:gap-16">
          <RevealText text={projects.title} className="type-section" />
          <p data-reveal="" className="type-lead max-w-[38ch] text-[#c7c8ce]">
            {projects.text}
          </p>
        </div>

        {/* A large lead card beside two smaller ones. */}
        <ul className="mt-12 grid gap-4 md:mt-16 lg:grid-cols-12 lg:grid-rows-2 lg:gap-5">
          {projects.items.map((project, index) => {
            const lead = index === 0;
            return (
              <li key={project.kind} className={cn("flex", lead ? "lg:col-span-7 lg:row-span-2" : "lg:col-span-5")}>
                <Card
                  variant="glass"
                  data-reveal="card"
                  style={order(index)}
                  className={cn(
                    "w-full gap-6 rounded-[28px] p-6 text-base md:p-8",
                    lead ? "justify-between" : "sm:flex-row sm:items-center lg:p-7",
                  )}
                >
                  <div className={lead ? "" : "shrink-0 sm:w-[38%]"}>
                    <ProjectScene kind={project.kind} />
                  </div>
                  <div className="flex-1">
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
                    <h3
                      className={cn(
                        "mt-4",
                        lead
                          ? "text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.1] tracking-[-0.03em]"
                          : "text-[clamp(1.375rem,2vw,1.625rem)] leading-[1.18] tracking-[-0.022em]",
                      )}
                    >
                      <Link href={href} className="card-link inline-flex items-start gap-2">
                        {project.name}
                        <ArrowUpRightIcon aria-hidden="true" size={lead ? 26 : 20} className="card-arrow mt-[0.15em] shrink-0" />
                      </Link>
                    </h3>
                    <p className="mt-3 max-w-[46ch] text-muted-foreground">{project.text}</p>
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>

        <div data-reveal="" className="mt-10 md:mt-12">
          <Link href={href} className={buttonVariants({ variant: "glass", size: "pill" })}>
            {projects.link}
          </Link>
        </div>
      </div>
    </section>
  );
}
