import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// A link to another page, drawn as a pill with a round arrow badge. The badge takes the
// section's color (`--hue`) when there is one, and the site's link color otherwise.
export function ActionLink({
  href,
  children,
  className,
  "aria-label": ariaLabel,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  "aria-label"?: string;
}) {
  return (
    <Link href={href} aria-label={ariaLabel} className={cn("action-link", className)}>
      <span>{children}</span>
      <span aria-hidden="true" className="action-link-icon">
        <ArrowRightIcon size={16} weight="bold" />
      </span>
    </Link>
  );
}
