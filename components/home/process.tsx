import { GlassStage, RevealText, order } from "@/components/site/motion";
import { Card } from "@/components/ui/card";
import type { Dictionary } from "@/content";

export function Process({ dict }: { dict: Dictionary }) {
  const { process } = dict;

  return (
    <section className="section relative isolate overflow-hidden pt-0">
      <GlassStage variant="wide" />
      <div className="wrap">
        <RevealText text={process.title} className="type-section" />

        {/* A line runs through the steps as the visitor scrolls:
            down the side on phones, across the top on desktop. */}
        <div className="mt-12 md:mt-16">
          <ol
            data-progress=""
            className="relative grid gap-4 py-6 pl-8 lg:grid-cols-4 lg:gap-5 lg:py-12 lg:pl-0 lg:pt-20"
          >
            <span
              aria-hidden="true"
              className="absolute bottom-6 left-[5px] top-6 w-0.5 overflow-hidden rounded-full bg-line lg:inset-x-0 lg:bottom-auto lg:top-12 lg:h-0.5 lg:w-auto"
            >
              <span className="progress-fill block size-full" />
            </span>
            {process.steps.map((step, index) => (
              <li
                key={step.name}
                data-step=""
                className="relative flex"
                style={{ "--hue": `var(--d${index * 2 + 1})` } as React.CSSProperties}
              >
                <span
                  aria-hidden="true"
                  className="step-dot absolute -left-8 top-9 size-3 rounded-full lg:-top-[38px] lg:left-0"
                />
                <Card
                  variant="glass"
                  data-reveal="card"
                  style={order(index)}
                  className="w-full gap-0 rounded-[28px] p-7 text-base lg:min-h-[320px] lg:p-8"
                >
                  <span
                    aria-hidden="true"
                    className="text-[clamp(3rem,5vw,4.5rem)] font-medium leading-none tracking-[-0.05em] text-muted-foreground tabular-nums"
                  >
                    {index + 1}
                  </span>
                  <h3 className="mt-6 text-[clamp(1.375rem,2vw,1.75rem)] leading-tight tracking-[-0.022em] lg:mt-14">
                    {step.name}
                  </h3>
                  <p className="mt-3 text-muted-foreground">{step.text}</p>
                </Card>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
