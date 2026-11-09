"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

// not-found files don't receive params, and this one renders inside the root
// layout, so it reads the language from the address.
const TEXT = {
  en: {
    title: "This page doesn’t exist.",
    text: "Check the address, or go back to the homepage.",
    action: "Go to the homepage",
  },
  fr: {
    title: "Cette page n’existe pas.",
    text: "Vérifiez l’adresse ou revenez à l’accueil.",
    action: "Aller à l’accueil",
  },
};

export default function NotFound() {
  const { lang } = useParams<{ lang: string }>();
  const locale = lang === "fr" ? "fr" : "en";
  const copy = TEXT[locale];

  return (
    <div className="wrap flex min-h-[70svh] flex-col justify-end pb-20 pt-40">
      <h1 className="type-display max-w-[16ch]">{copy.title}</h1>
      <p className="type-lead mt-6 text-muted-foreground">{copy.text}</p>
      <div className="mt-4">
        <Link href={`/${locale}`} className="text-link">
          {copy.action}
        </Link>
      </div>
    </div>
  );
}
