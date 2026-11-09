import Image from "next/image";

// Both versions are always in the page. CSS shows the one that suits the
// surface behind it, so the logo can't flash the wrong color.
export function Logo({ alt, preload = false }: { alt: string; preload?: boolean }) {
  return (
    <span className="block h-6 w-[127px]">
      <Image
        src="/brand/diframe-logo-white.svg"
        alt={alt}
        width={127}
        height={24}
        unoptimized
        preload={preload}
        style={{ display: "var(--logo-on-dark)" }}
      />
      <Image
        src="/brand/diframe-logo-black.svg"
        alt={alt}
        width={127}
        height={24}
        unoptimized
        preload={preload}
        style={{ display: "var(--logo-on-light)" }}
      />
    </span>
  );
}
