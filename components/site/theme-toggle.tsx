"use client";

import { MoonIcon, SunIcon } from "@phosphor-icons/react";
import { useEffect, useSyncExternalStore } from "react";

type Theme = "light" | "dark";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

const readTheme = (): Theme =>
  document.documentElement.dataset.theme === "dark" ? "dark" : "light";

function savedTheme(): string | null {
  try {
    return localStorage.getItem("df-theme");
  } catch {
    return null;
  }
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
    root.classList.add("theme-changing");
    window.setTimeout(() => root.classList.remove("theme-changing"), 300);
  }
  root.dataset.theme = theme;
}

export function ThemeToggle({
  toDark,
  toLight,
}: {
  toDark: string;
  toLight: string;
}) {
  const theme = useSyncExternalStore(subscribe, readTheme, () => "light" as Theme);

  // Until a visitor chooses, keep following the system setting.
  useEffect(() => {
    const query = matchMedia("(prefers-color-scheme: dark)");
    const onSystemChange = (event: MediaQueryListEvent) => {
      if (!savedTheme()) applyTheme(event.matches ? "dark" : "light");
    };
    query.addEventListener("change", onSystemChange);
    return () => query.removeEventListener("change", onSystemChange);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    applyTheme(next);
    try {
      localStorage.setItem("df-theme", next);
    } catch {
      // The choice still applies to this page view.
    }
  };

  return (
    <button
      type="button"
      className="icon-button"
      onClick={toggle}
      aria-label={theme === "dark" ? toLight : toDark}
    >
      {theme === "dark" ? <SunIcon size={20} weight="light" /> : <MoonIcon size={20} weight="light" />}
    </button>
  );
}
