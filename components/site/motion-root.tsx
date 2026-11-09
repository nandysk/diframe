"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

type MotionWindow = Window & { __dfMotionTimer?: number; __dfMotionExpired?: boolean };

const clamp = (value: number) => Math.min(1, Math.max(0, value));

// Counts a stat up from zero, keeping its own formatting: "1,000+", "1 000", "20+".
function countUp(el: HTMLElement) {
  const final = el.dataset.count ?? el.textContent ?? "";
  const match = final.match(/^(\D*)(\d[\d.,\s  ]*\d|\d)(\D*)$/);
  if (!match) return;
  const [, before, digits, after] = match;
  const separator = digits.match(/[.,\s  ]/)?.[0] ?? "";
  const target = Number(digits.replace(/\D/g, ""));
  const started = performance.now();

  const step = (now: number) => {
    const t = clamp((now - started) / 1500);
    const value = Math.round((1 - (1 - t) ** 4) * target);
    const text = separator ? String(value).replace(/\B(?=(\d{3})+$)/g, separator) : String(value);
    el.textContent = t < 1 ? `${before}${text}${after}` : final;
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// One observer and one scroll loop drive every animation on the page. Sections
// only declare what they want through data attributes, so they stay server-rendered.
export function MotionRoot() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const win = window as MotionWindow;
    window.clearTimeout(win.__dfMotionTimer);

    // The highlight on glass panels answers the pointer, so it stays on in any case.
    const onPointer = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      if (!(event.target instanceof Element)) return;
      const panel = event.target.closest<HTMLElement>(".liquid");
      if (!panel) return;
      const rect = panel.getBoundingClientRect();
      panel.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      panel.style.setProperty("--my", `${event.clientY - rect.top}px`);
    };
    document.addEventListener("pointermove", onPointer, { passive: true });
    const cleanPointer = () => document.removeEventListener("pointermove", onPointer);

    if (matchMedia("(prefers-reduced-motion: reduce)").matches || win.__dfMotionExpired) {
      delete root.dataset.motion;
      return cleanPointer;
    }
    root.dataset.motion = "on";

    const timers: number[] = [];
    const reveal = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting && entry.boundingClientRect.top > 0) continue;
          const el = entry.target as HTMLElement;
          reveal.unobserve(el);
          el.classList.add("in");
          if (el.dataset.count !== undefined) countUp(el);
          // Hands the element back to its normal styles, so hover states aren't delayed.
          if (el.dataset.reveal !== "text") {
            timers.push(window.setTimeout(() => el.removeAttribute("data-reveal"), 1800));
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => {
      if (!el.classList.contains("in")) reveal.observe(el);
    });

    const stages = new IntersectionObserver((entries) => {
      for (const entry of entries) (entry.target as HTMLElement).toggleAttribute("data-run", entry.isIntersecting);
    });
    document.querySelectorAll(".stage").forEach((el) => stages.observe(el));

    // Scroll-linked pieces: words that light up one by one, and the process line.
    const wordBlocks = [...document.querySelectorAll<HTMLElement>("[data-words]")].map((el) => ({
      el,
      words: [...el.querySelectorAll<HTMLElement>("[data-word]")],
    }));
    const bars = [...document.querySelectorAll<HTMLElement>("[data-progress]")].map((el) => ({
      el,
      steps: [...el.querySelectorAll<HTMLElement>("[data-step]")],
    }));

    let frame = 0;
    const tick = () => {
      frame = 0;
      const vh = window.innerHeight;
      for (const { el, words } of wordBlocks) {
        const rect = el.getBoundingClientRect();
        // Fully lit by the time the block's end reaches the middle of the screen.
        const progress = clamp((vh * 0.86 - rect.top) / (rect.height + vh * 0.36));
        const lit = progress * (words.length + 3);
        words.forEach((word, index) => {
          // Unlit words stay at 45% so they keep at least 3:1 contrast in both themes.
          word.style.opacity = String(0.45 + 0.55 * clamp(lit - index));
        });
      }
      for (const { el, steps } of bars) {
        const rect = el.getBoundingClientRect();
        const progress = clamp((vh * 0.82 - rect.top) / (rect.height + vh * 0.22));
        el.style.setProperty("--p", progress.toFixed(3));
        steps.forEach((step, index) => {
          step.toggleAttribute("data-on", progress > (index + 0.1) / steps.length - 0.02);
        });
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };
    if (wordBlocks.length || bars.length) {
      tick();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
    }

    return () => {
      cleanPointer();
      reveal.disconnect();
      stages.disconnect();
      timers.forEach((timer) => window.clearTimeout(timer));
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  return null;
}
