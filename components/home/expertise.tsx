import { Certifications } from "@/components/site/certifications";
import { RevealText } from "@/components/site/motion";
import type { Dictionary } from "@/content";

export function Expertise({ dict }: { dict: Dictionary }) {
  const { expertise } = dict;

  return (
    <section className="section pt-0">
      <div className="wrap grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <RevealText text={expertise.title} className="type-section max-w-[14ch]" />
        <div className="lg:pt-2">
          <Certifications items={expertise.items} />
          <p data-reveal="" className="mt-6 text-muted-foreground">
            {expertise.more}
          </p>
        </div>
      </div>
    </section>
  );
}
