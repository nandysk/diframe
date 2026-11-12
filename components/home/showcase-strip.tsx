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
// Which part of each screenshot a frame keeps. The large frame keeps the page's headline whole,
// and the last frame leans right, where a desktop page usually puts its image.
const FOCUS = ["object-[40%_top]", "object-left-top", "object-left-top", "object-[75%_top]"];

export function ShowcaseStrip({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const { showcase } = dict;
  // Show the first project's lead pieces, and close the strip with the cover of each other
  // project, so every website appears. The last frame is wide, which suits a desktop page.
  const covers = showcase.items.filter(
    (item, index) => item.image && showcase.items.findIndex((other) => other.project === item.project) === index,
  );
  const others = covers.slice(1, FRAMES.length);
  const rest = showcase.items.filter((item) => item.image && !covers.includes(item));
  // Before any images exist, the empty frames show the planned pieces instead.
  const pieces = covers.length
    ? [covers[0], ...rest.slice(0, FRAMES.length - 1 - others.length), ...others]
    : showcase.items.slice(0, FRAMES.length);

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
          {pieces.map((item, index) => (
            <li
              key={item.placeholder}
              data-reveal="card"
              style={order(index)}
              className={`relative overflow-hidden rounded-[20px] ring-1 ring-foreground/10 ${FRAMES[index]}`}
            >
              {item.image ? (
                <Image src={item.image} alt={item.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className={`object-cover ${FOCUS[index]}`} />
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
