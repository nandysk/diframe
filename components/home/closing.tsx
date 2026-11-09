import { ClockIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { GlassStage, RevealText } from "@/components/site/motion";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Dictionary } from "@/content";
import { pagePath, type Locale } from "@/lib/i18n/routes";

export function Closing({
  lang,
  dict,
  title = dict.closing.title,
  text = dict.closing.text,
  topic,
}: {
  lang: Locale;
  dict: Dictionary;
  title?: string;
  text?: string;
  topic?: string;
}) {
  return (
    <section data-surface="dark" className="relative isolate overflow-hidden py-[clamp(72px,10vw,152px)]">
      <GlassStage />
      <div className="wrap">
        <Card
          variant="glass"
          data-reveal="card"
          className="flex-row flex-wrap items-end justify-between gap-x-16 gap-y-8 rounded-[32px] p-7 text-base md:rounded-[40px] md:p-12 lg:p-16"
        >
          <div>
            <RevealText text={title} className="type-display max-w-[14ch]" />
            <p className="type-lead mt-6 max-w-[46ch] text-muted-foreground">{text}</p>
            <p className="mt-3 flex items-center gap-2 font-medium">
              <ClockIcon aria-hidden="true" size={20} className="shrink-0" />
              {dict.closing.reply}
            </p>
          </div>
          <Link href={`${pagePath(lang, "contact")}${topic ? `?topic=${topic}` : ""}`} className={buttonVariants({ size: "pill", className: "relative z-[1]" })}>
            {dict.closing.action}
          </Link>
        </Card>
      </div>
    </section>
  );
}
