import { RevealText, order } from "@/components/site/motion";
import type { Dictionary } from "@/content";

// What Diframe values, as answers to what buyers look for. A list, not cards: each value
// is a short statement with the slanted pill from the logo as its marker, in the
// division colors so the page keeps the site's "color is signal" rule.
export function Values({ dict }: { dict: Dictionary }) {
  const { values } = dict;

  return (
    <section className="section">
      <div className="wrap grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <h2 className="text-base font-medium tracking-normal text-muted-foreground">{values.label}</h2>
          <RevealText as="p" text={values.title} className="type-section mt-4 max-w-[18ch]" />
        </div>
        <ul className="grid">
          {values.items.map((value, index) => (
            <li
              key={value.name}
              data-reveal=""
              style={{ ...order(index), "--hue": `var(--d${index + 1})` } as React.CSSProperties}
              className="grid grid-cols-[28px_minmax(0,1fr)] gap-x-4 border-t border-line py-7 md:py-8"
            >
              <span aria-hidden="true" className="mt-1.5 block h-6 w-2 translate-x-2 rotate-[30deg] rounded-full bg-[var(--hue)]" />
              <div>
                <h3 className="text-[clamp(1.25rem,1.8vw,1.5rem)] leading-[1.2] tracking-[-0.02em]">{value.name}</h3>
                <p className="mt-2 max-w-[52ch] text-muted-foreground">{value.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
