import { GlassStage, RevealText, order } from "@/components/site/motion";
import { ParticleField } from "@/components/site/particle-field";
import { Card } from "@/components/ui/card";
import type { Dictionary } from "@/content";

// The working rules a client can count on, on a dark band like the site's other promises.
export function Commitments({ dict }: { dict: Dictionary }) {
  const { commitments } = dict;

  return (
    <section data-surface="dark" className="section relative isolate overflow-hidden">
      <GlassStage variant="wide" />
      <ParticleField />
      <div className="wrap">
        <div className="grid gap-5 lg:grid-cols-2 lg:items-end lg:gap-16">
          <RevealText text={commitments.title} className="type-section max-w-[16ch]" />
          <p data-reveal="" className="type-lead max-w-[46ch] text-[#c7c8ce]">
            {commitments.text}
          </p>
        </div>
        <ul className="mt-12 grid gap-4 md:mt-16 md:grid-cols-2 lg:gap-5">
          {commitments.items.map((item, index) => (
            <li key={item.name} className="flex">
              <Card
                variant="glass"
                data-reveal="card"
                style={order(index)}
                className="w-full gap-3 rounded-[28px] p-6 text-base md:p-8"
              >
                <h3 className="text-[clamp(1.375rem,2vw,1.75rem)] leading-[1.18] tracking-[-0.022em]">{item.name}</h3>
                <p className="max-w-[46ch] text-muted-foreground">{item.text}</p>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
