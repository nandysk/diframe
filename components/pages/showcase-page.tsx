import { Closing } from "@/components/home/closing";
import { ShowcaseGallery } from "@/components/pages/showcase-gallery";
import { PageHero } from "@/components/site/page-hero";
import type { Dictionary } from "@/content";
import type { Locale } from "@/lib/i18n/routes";

export function ShowcasePage({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const { showcase } = dict;
  const hasImages = showcase.items.some((item) => item.image);

  return (
    <>
      <PageHero title={showcase.page.title} text={showcase.page.text} />
      <section className="section">
        <div className="wrap">
          {!hasImages && <p className="type-lead mb-8 max-w-[52ch] text-muted-foreground">{showcase.page.pending}</p>}
          <ShowcaseGallery showcase={showcase} />
        </div>
      </section>
      <Closing lang={lang} dict={dict} />
    </>
  );
}
