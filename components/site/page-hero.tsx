import { GlassStage, RevealText } from "@/components/site/motion";
import { ParticleField } from "@/components/site/particle-field";

// The dark opening band for inner pages. A second column is optional.
export function PageHero({
  title,
  text,
  aside,
}: {
  title: string;
  text: string;
  aside?: React.ReactNode;
}) {
  return (
    <section data-surface="dark" className="relative isolate overflow-hidden pb-[clamp(56px,7vw,104px)] pt-32 md:pt-44">
      <GlassStage />
      <ParticleField />
      <div className={aside ? "wrap grid items-center gap-10 lg:grid-cols-[minmax(0,8fr)_minmax(0,4fr)] lg:gap-16" : "wrap"}>
        <div>
          <RevealText as="h1" hero text={title} className="hero-title type-display max-w-[18ch]" />
          <p
            className="hero-fade type-lead mt-6 max-w-[40rem] text-[#c7c8ce]"
            style={{ "--delay": "620ms" } as React.CSSProperties}
          >
            {text}
          </p>
        </div>
        {aside}
      </div>
    </section>
  );
}
