import Image from "next/image";
import { GlassStage, RevealText, order } from "@/components/site/motion";
import { Card } from "@/components/ui/card";
import type { Dictionary } from "@/content";
import { clientLogos } from "@/lib/brand-assets";
import { cn } from "@/lib/utils";

export function Proof({ dict }: { dict: Dictionary }) {
  const { proof } = dict;

  return (
    <section className="section relative isolate overflow-clip pt-0">
      <div className="wrap">
        <RevealText text={proof.title} className="type-section max-w-[22ch]" />

        <div className="relative isolate mt-12 md:mt-16">
          <GlassStage open />
          <Card variant="glass" data-reveal="card" className="my-6 rounded-[32px] py-0 md:my-12 md:rounded-[40px]">
            <dl className="grid divide-y divide-line md:grid-cols-[1fr_1fr_1.35fr] md:divide-x md:divide-y-0">
              {proof.stats.map((stat, index) => (
                <div
                  key={stat.label}
                  data-reveal=""
                  style={order(index + 2)}
                  className="flex flex-col p-7 md:p-10 lg:p-12"
                >
                  <dt className="order-3 mt-3 max-w-[20ch] text-base text-muted-foreground">{stat.label}</dt>
                  {stat.lead && <dd className="order-1 mb-1 text-base text-muted-foreground">{stat.lead}</dd>}
                  <dd className="order-2 whitespace-nowrap text-[clamp(3.25rem,6.6vw,6rem)] font-medium leading-[0.95] tracking-[-0.05em] tabular-nums">
                    <span data-reveal="" data-count={stat.value}>
                      {stat.value}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </Card>
        </div>

        <div className="relative z-10 mt-10 md:mt-14">
          <h3 className="text-base font-normal tracking-normal text-muted-foreground">{proof.clientsLabel}</h3>
          {/* Logos keep their own colors, so they sit on white in both themes.
              A client without a logo file shows its name until the file arrives. */}
          <ul className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            {proof.clients.map((client, index) => {
              const logo = clientLogos[client];
              return (
                <li key={client} data-reveal="" style={order(index)} className="flex">
                  <div className="plaque flex min-h-24 w-full items-center justify-center p-4 text-center md:min-h-28">
                    {logo ? (
                      <Image
                        src={logo.src}
                        alt={client}
                        width={logo.width}
                        height={logo.height}
                        sizes="180px"
                        className={cn(
                          "h-auto w-auto max-w-[78%] object-contain",
                          // Emblems are nearly square, so they get more height to stay as legible as wordmarks.
                          logo.width / logo.height < 2 ? "max-h-[4.5rem]" : "max-h-14",
                        )}
                      />
                    ) : (
                      <span className="text-[1.0625rem] font-medium leading-snug tracking-[-0.01em]">{client}</span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
