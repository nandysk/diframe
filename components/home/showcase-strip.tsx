import Image from "next/image";
import Link from "next/link";
import { RevealText, order } from "@/components/site/motion";
import type { Dictionary } from "@/content";
import { pagePath, type Locale } from "@/lib/i18n/routes";

// Uneven frames sized for the piece each one is meant to hold.
const FRAMES = [
  "col-span-2 aspect-[16/10] lg:col-span-7 lg:row-span-2 lg:aspect-auto",
  "aspect-[9/14] lg:col-span-3 lg:row-span-2 lg:aspect-auto",
  "aspect-[9/14] lg:col-span-2 lg:aspect-auto",
  "col-span-2 aspect-[16/9] lg:col-span-2 lg:aspect-auto",
];

export function ShowcaseStrip({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const { showcase } = dict;

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

        <ul className="mt-12 grid grid-cols-2 gap-3 md:mt-16 lg:h-[clamp(420px,42vw,600px)] lg:grid-cols-12 lg:grid-rows-2 lg:gap-4">
          {showcase.items.slice(0, FRAMES.length).map((item, index) => (
            <li
              key={item.placeholder}
              data-reveal="card"
              style={order(index)}
              className={`relative overflow-hidden rounded-[20px] ${FRAMES[index]}`}
            >
              {item.image ? (
                <Image src={item.image} alt={item.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
              ) : (
                <div className="frame-empty flex h-full items-end rounded-[20px] p-4 text-sm text-muted-foreground">
                  {item.placeholder}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
