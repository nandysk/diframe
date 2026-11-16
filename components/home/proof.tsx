import Image from "next/image";
import { GlassStage, RevealText, order } from "@/components/site/motion";
import { Card } from "@/components/ui/card";
import type { Dictionary } from "@/content";
import { clientLogos } from "@/lib/brand-assets";
import { cn } from "@/lib/utils";

function ClientRow({ clients, copy = false }: { clients: string[]; copy?: boolean }) {
  return (
    <ul className="logo-track" aria-hidden={copy || undefined}>
      {clients.map((client) => {
        const logo = clientLogos[client];
        return (
          <li key={client} className="flex flex-none items-center">
            {logo ? (
              <Image
                src={logo.src}
                alt={copy ? "" : client}
                width={logo.width}
                height={logo.height}
                sizes="180px"
                className={cn(
                  "h-auto w-auto max-w-[9.5rem] object-contain max-md:max-w-[7.5rem]",
                  // Emblems are nearly square, so they get more height to stay as legible as wordmarks.
                  logo.width / logo.height < 2.6 ? "max-h-[3.25rem] max-md:max-h-11" : "max-h-10 max-md:max-h-8",
                )}
              />
            ) : (
              <span className="text-[1.0625rem] font-medium whitespace-nowrap">{client}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

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
          {/* One white band, since logos keep their own colors in both themes. Two rows slide
              slowly in opposite directions and pause on hover; each row's second copy only
              closes the loop, so screen readers skip it. With reduced motion the rows stop.
              A client without a logo file shows its name until the file arrives. */}
          <div data-reveal="" className="plaque mt-6 overflow-hidden">
            {[
              proof.clients.slice(0, Math.ceil(proof.clients.length / 2)),
              proof.clients.slice(Math.ceil(proof.clients.length / 2)),
            ].map((row, index) => (
              <div key={index} className={cn("logo-band", index === 1 && "logo-band-reverse")}>
                <ClientRow clients={row} />
                <ClientRow clients={row} copy />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
