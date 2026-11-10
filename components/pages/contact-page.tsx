import { ClockIcon, EnvelopeSimpleIcon } from "@phosphor-icons/react/dist/ssr";
import { Process } from "@/components/home/process";
import { ContactForm } from "@/components/pages/contact-form";
import { GlassStage, RevealText } from "@/components/site/motion";
import { ParticleField } from "@/components/site/particle-field";
import { Card } from "@/components/ui/card";
import type { Dictionary } from "@/content";
import type { Locale } from "@/lib/i18n/routes";

export function ContactPage({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const { contact, closing } = dict;
  const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as React.CSSProperties;

  return (
    <>
      <section data-surface="dark" className="relative isolate overflow-hidden pb-[clamp(56px,7vw,104px)] pt-32 md:pt-44">
        <GlassStage />
        <ParticleField />
        <div className="wrap grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div>
            <RevealText as="h1" hero text={contact.title} className="hero-title type-display max-w-[12ch]" />
            <p className="hero-fade type-lead mt-6 max-w-[34rem] text-[#c7c8ce]" style={delay(620)}>
              {contact.text}
            </p>
            <p className="hero-fade mt-6 flex items-center gap-2 font-medium" style={delay(760)}>
              <ClockIcon aria-hidden="true" size={20} className="shrink-0" />
              {closing.reply}
            </p>
            {contact.email && (
              <p className="hero-fade mt-3" style={delay(820)}>
                <a href={`mailto:${contact.email}`} className="inline-flex min-h-11 items-center gap-2 underline underline-offset-4">
                  <EnvelopeSimpleIcon aria-hidden="true" size={20} className="shrink-0" />
                  {contact.email}
                </a>
              </p>
            )}
          </div>
          <Card variant="glass" className="hero-fade rounded-[32px] p-6 text-base md:rounded-[40px] md:p-10" style={delay(300)}>
            <ContactForm lang={lang} dict={dict} />
          </Card>
        </div>
      </section>
      <Process dict={dict} />
    </>
  );
}
