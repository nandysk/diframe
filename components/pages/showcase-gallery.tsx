"use client";

import { CaretLeftIcon, CaretRightIcon, XIcon } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useRef, useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { badgeVariants } from "@/components/ui/badge";
import type { Dictionary } from "@/content";
import { cn } from "@/lib/utils";

type Showcase = Dictionary["showcase"];
type Item = Showcase["items"][number];

// Large pieces first, smaller ones filling in around them.
const FRAMES = [
  "col-span-2 aspect-[16/10] lg:col-span-4 lg:row-span-2 lg:aspect-auto",
  "aspect-[9/14] lg:col-span-2 lg:row-span-2 lg:aspect-auto",
  "aspect-[9/14] lg:col-span-2 lg:aspect-auto",
  "col-span-2 aspect-[16/9] lg:col-span-2 lg:aspect-auto",
  "col-span-2 aspect-[16/9] lg:col-span-2 lg:aspect-auto",
  "col-span-2 aspect-[16/7] lg:col-span-6 lg:aspect-auto",
];

function Gallery({ showcase, type }: { showcase: Showcase; type: string | null }) {
  const pathname = usePathname();
  const { page, items } = showcase;
  const filters = Object.entries(page.types);
  const active = filters.some(([key]) => key === type) ? type : null;
  const visible = items.filter((item) => !active || item.type === active);
  const viewable = visible.filter((item) => item.image);

  const [open, setOpen] = useState<number | null>(null);
  const touchStart = useRef<number | null>(null);
  const current: Item | undefined = open === null ? undefined : viewable[open];

  const step = (by: number) => {
    setOpen((index) => (index === null ? index : (index + by + viewable.length) % viewable.length));
  };

  const filterLink = (href: string, label: string, isActive: boolean) => (
    <Link
      key={label}
      href={href}
      scroll={false}
      aria-current={isActive ? "true" : undefined}
      className={cn(
        badgeVariants({ variant: isActive ? "default" : "outline" }),
        "h-auto min-h-11 whitespace-normal px-5 py-2 text-[0.9375rem] font-medium",
      )}
    >
      {label}
    </Link>
  );

  return (
    <>
      <nav aria-label={page.filterLabel} className="flex flex-wrap gap-2">
        {filterLink(pathname, page.all, !active)}
        {filters.map(([key, label]) => filterLink(`${pathname}?type=${key}`, label, active === key))}
      </nav>

      <ul className="mt-8 grid grid-cols-2 gap-3 lg:auto-rows-[clamp(180px,17vw,250px)] lg:grid-cols-6 lg:gap-4">
        {visible.map((item) => {
          const frame = FRAMES[items.indexOf(item) % FRAMES.length];
          return (
            <li
              key={item.placeholder}
              className={cn("relative overflow-hidden rounded-[20px] duration-500 animate-in fade-in-0", frame)}
            >
              {item.image ? (
                <button
                  type="button"
                  aria-label={`${page.open}: ${item.caption || item.alt}`}
                  onClick={() => setOpen(viewable.indexOf(item))}
                  className="group absolute inset-0 cursor-zoom-in"
                >
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="(min-width: 1024px) 66vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                </button>
              ) : (
                <div className="frame-empty flex h-full items-end rounded-[20px] p-4 text-sm text-muted-foreground">
                  {item.placeholder}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <Dialog open={open !== null} onOpenChange={(isOpen) => !isOpen && setOpen(null)}>
        <DialogContent
          className="flex flex-col p-4 text-white md:p-6"
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") step(1);
            if (event.key === "ArrowLeft") step(-1);
          }}
          onTouchStart={(event) => {
            touchStart.current = event.touches[0].clientX;
          }}
          onTouchEnd={(event) => {
            if (touchStart.current === null) return;
            const moved = event.changedTouches[0].clientX - touchStart.current;
            touchStart.current = null;
            if (Math.abs(moved) > 48) step(moved < 0 ? 1 : -1);
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <DialogTitle className="min-h-11 pt-2 text-[1.0625rem]">{current?.caption || current?.alt}</DialogTitle>
            <DialogClose aria-label={page.close} className="icon-button shrink-0 text-white hover:bg-white/15">
              <XIcon size={22} weight="light" />
            </DialogClose>
          </div>
          <div className="relative mt-3 min-h-0 flex-1">
            {current && (
              <Image src={current.image} alt={current.alt} fill sizes="100vw" className="object-contain" />
            )}
          </div>
          {viewable.length > 1 && (
            <div className="mt-3 flex justify-center gap-2">
              <button
                type="button"
                aria-label={page.previous}
                onClick={() => step(-1)}
                className="icon-button text-white hover:bg-white/15"
              >
                <CaretLeftIcon size={22} weight="light" />
              </button>
              <button
                type="button"
                aria-label={page.next}
                onClick={() => step(1)}
                className="icon-button text-white hover:bg-white/15"
              >
                <CaretRightIcon size={22} weight="light" />
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function GalleryFromAddress({ showcase }: { showcase: Showcase }) {
  return <Gallery showcase={showcase} type={useSearchParams().get("type")} />;
}

// Each filter has its own shareable address, such as /en/showcase?type=graphics.
export function ShowcaseGallery({ showcase }: { showcase: Showcase }) {
  return (
    <Suspense fallback={<Gallery showcase={showcase} type={null} />}>
      <GalleryFromAddress showcase={showcase} />
    </Suspense>
  );
}
