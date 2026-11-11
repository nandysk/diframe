"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";

// Cloudflare Turnstile, a spam check that most visitors never see: it only shows a box
// when it needs the visitor to confirm. It does nothing until the site key is set, so the
// form keeps working without it. `resetKey` changes after each answer from the server,
// because a check can only be used once.

type TurnstileApi = {
  render: (element: HTMLElement, options: Record<string, unknown>) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export function Turnstile({ lang, resetKey }: { lang: string; resetKey: unknown }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<string | null>(null);

  const render = () => {
    if (!SITE_KEY || !boxRef.current || !window.turnstile || widgetRef.current) return;
    widgetRef.current = window.turnstile.render(boxRef.current, {
      sitekey: SITE_KEY,
      appearance: "interaction-only",
      theme: "auto",
      language: lang,
      "response-field-name": "cf-turnstile-response",
    });
  };

  useEffect(() => {
    render();
    return () => {
      if (widgetRef.current) window.turnstile?.remove(widgetRef.current);
      widgetRef.current = null;
    };
    // The widget is created once per page; `render` reads only refs and constants.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (widgetRef.current) window.turnstile?.reset(widgetRef.current);
  }, [resetKey]);

  if (!SITE_KEY) return null;

  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="afterInteractive" onReady={render} />
      <div ref={boxRef} />
    </>
  );
}
