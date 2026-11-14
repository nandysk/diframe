import Link from "next/link";
import { BrowserFrame, DeviceStage, PhoneFrame } from "@/components/showcase/device-frames";
import { RevealText, order } from "@/components/site/motion";
import type { Dictionary } from "@/content";
import { pagePath, type Locale } from "@/lib/i18n/routes";
import { groupShowcase } from "@/lib/showcase";

// Two websites side by side, each on its own stage: the homepage in a browser, and the
// phone view in front when there is one. The rest is on the Showcase page.
const SHOWN = 2;

export function ShowcaseStrip({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const { showcase } = dict;
  const groups = groupShowcase(showcase.items)
    .filter((group) => group.cover)
    .slice(0, SHOWN);

  return (
    <section className="section">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-4">
          <div>
            <RevealText text={showcase.title} className="type-section" />
            <p data-reveal="" className="type-lead mt-4 text-muted-foreground">
              {showcase.text}
            </p>
          </div>
          <Link href={pagePath(lang, "showcase")} className="text-link">
            {showcase.link}
          </Link>
        </div>

        <ul className="mt-12 grid gap-6 md:mt-16 lg:grid-cols-2">
          {groups.map(({ project, cover, phone }, index) => {
            const details = showcase.projects[project as keyof typeof showcase.projects];
            if (!cover) return null;
            return (
              <li key={project} data-reveal="card" style={order(index)} className="flex flex-col">
                <DeviceStage
                  tint={details?.tint ?? "transparent"}
                  className="flex flex-1 flex-col justify-center"
                  browser={
                    <BrowserFrame
                      site={details?.site ?? ""}
                      src={cover.image}
                      alt={cover.alt}
                      sizes="(min-width: 1024px) 560px, 90vw"
                    />
                  }
                  phone={phone && <PhoneFrame src={phone.image} alt={phone.alt} sizes="(min-width: 1024px) 140px, 22vw" />}
                />
                <p className="mt-4 text-[1.0625rem] font-medium">{details?.name}</p>
                <p className="mt-1 text-[0.9375rem] text-muted-foreground">{details?.text}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
