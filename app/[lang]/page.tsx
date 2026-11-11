import { notFound } from "next/navigation";
import { About } from "@/components/home/about";
import { Audiences } from "@/components/home/audiences";
import { Closing } from "@/components/home/closing";
import { Divisions } from "@/components/home/divisions";
import { Expertise } from "@/components/home/expertise";
import { Hero } from "@/components/home/hero";
import { Process } from "@/components/home/process";
import { Proof } from "@/components/home/proof";
import { ShowcaseStrip } from "@/components/home/showcase-strip";
import { OrganizationData } from "@/components/site/organization-data";
import { getDictionary } from "@/content";
import { isLocale } from "@/lib/i18n/routes";

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <>
      <OrganizationData lang={lang} dict={dict} />
      <Hero lang={lang} dict={dict} />
      <About lang={lang} dict={dict} />
      <Proof dict={dict} />
      <Divisions lang={lang} dict={dict} />
      <Audiences lang={lang} dict={dict} />
      <ShowcaseStrip lang={lang} dict={dict} />
      <Expertise dict={dict} />
      <Process dict={dict} />
      <Closing lang={lang} dict={dict} />
    </>
  );
}
