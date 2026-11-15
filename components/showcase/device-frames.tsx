import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

// A drawn macOS browser window for the Showcase. It holds each screenshot without cropping
// the sides, so the page reads as it does on screen. No hooks, so it works on server and
// client pages alike.

type Shot = { src: string; alt: string; sizes: string; priority?: boolean };

function Screenshot({ src, alt, sizes, priority }: Shot) {
  if (!src) return <div className="frame-empty absolute inset-0" />;
  return <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover object-top" />;
}

/** A macOS window: red, yellow and green buttons, and a Safari-style address field. */
export function BrowserFrame({ site, className, ...shot }: Shot & { site: string; className?: string }) {
  return (
    <div
      className={cn(
        "device-tilt overflow-hidden rounded-[10px] bg-surface shadow-[18px_30px_60px_-24px_rgba(10,11,13,0.5)] ring-1 ring-foreground/15 md:rounded-[12px]",
        className,
      )}
    >
      {/* The window bar is decoration: the screenshot's description already names the site. */}
      <div aria-hidden="true" className="mac-bar flex h-7 items-center gap-3 border-b border-line px-3 md:h-9 md:px-4">
        <div className="flex gap-[5px] md:gap-[7px]">
          <span className="size-[8px] rounded-full bg-[#ff5f57] ring-1 ring-black/10 ring-inset md:size-[11px]" />
          <span className="size-[8px] rounded-full bg-[#febc2e] ring-1 ring-black/10 ring-inset md:size-[11px]" />
          <span className="size-[8px] rounded-full bg-[#28c840] ring-1 ring-black/10 ring-inset md:size-[11px]" />
        </div>
        <div className="mac-field mx-auto flex h-[1.125rem] w-[min(66%,20rem)] md:w-[min(50%,20rem)] items-center justify-center gap-1 rounded-[5px] px-2 text-[0.625rem] text-muted-foreground md:h-[1.375rem] md:rounded-[6px] md:text-[0.6875rem]">
          <svg viewBox="0 0 10 12" className="size-[0.55rem] shrink-0 fill-current opacity-70">
            <path d="M2 5V3.5a3 3 0 0 1 6 0V5h.5A1.5 1.5 0 0 1 10 6.5v4A1.5 1.5 0 0 1 8.5 12h-7A1.5 1.5 0 0 1 0 10.5v-4A1.5 1.5 0 0 1 1.5 5H2Zm1.5 0h3V3.5a1.5 1.5 0 0 0-3 0V5Z" />
          </svg>
          {/* Drawn with CSS so it stays out of the text that buttons and screen readers use. */}
          <span data-site={site} className="truncate before:content-[attr(data-site)]" />
        </div>
        <div className="w-[34px] md:w-[47px]" />
      </div>
      {/* Desktop captures are about 2:1 or 16:10. A 2:1 window shows the first fully and
          the top of the second, like a page before scrolling. */}
      <div className="relative aspect-[2/1]">
        <Screenshot {...shot} />
      </div>
    </div>
  );
}

/** A tinted stage for one website's page. The tint is the client's own brand color, kept faint. */
export function DeviceStage({
  tint,
  browser,
  className,
  style,
}: {
  tint: string;
  browser: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{ "--tint": tint, ...style } as CSSProperties}
      className={cn(
        "relative overflow-hidden rounded-[24px] border border-line bg-surface px-[6%] py-[6%] md:rounded-[28px]",
        "bg-[radial-gradient(120%_90%_at_0%_100%,color-mix(in_oklab,var(--tint)_22%,transparent),transparent_60%),radial-gradient(80%_70%_at_100%_0%,color-mix(in_oklab,var(--tint)_10%,transparent),transparent_70%)]",
        className,
      )}
    >
      {browser}
    </div>
  );
}
