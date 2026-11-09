import { PageHero } from "@/components/site/page-hero";
import type { Dictionary } from "@/content";

export function PrivacyPage({ dict }: { dict: Dictionary }) {
  const { privacy } = dict;

  return (
    <>
      <PageHero title={privacy.title} text={privacy.text} />
      <div className="section">
        <div className="wrap max-w-[46rem]">
          <p className="text-[0.9375rem] text-muted-foreground">{privacy.updated}</p>
          {privacy.sections.map((section) => (
            <section key={section.title} className="mt-10 border-t border-line pt-8">
              <h2 className="text-[clamp(1.375rem,2.2vw,1.75rem)] font-medium leading-[1.18] tracking-[-0.022em]">{section.title}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="mt-4 text-[1.0625rem] leading-[1.6] text-muted-foreground">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
