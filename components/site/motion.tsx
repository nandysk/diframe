import { Fragment, type CSSProperties, type ElementType } from "react";

export const order = (index: number) => ({ "--i": index }) as CSSProperties;

// A heading whose words rise into place when it scrolls into view.
export function RevealText({
  as: Tag = "h2",
  text,
  className,
  hero = false,
}: {
  as?: ElementType;
  text: string;
  className?: string;
  hero?: boolean;
}) {
  return (
    <Tag className={className} {...(hero ? {} : { "data-reveal": "text" })}>
      {text.split(" ").map((word, index) => (
        <Fragment key={index}>
          <span className="word-mask">
            <span style={order(index)}>{word}</span>
          </span>{" "}
        </Fragment>
      ))}
    </Tag>
  );
}

// A statement whose words light up one by one as the visitor scrolls through it.
export function ScrollWords({ text, className }: { text: string; className?: string }) {
  return (
    <p className={className} data-words="">
      {text.split(" ").map((word, index) => (
        <Fragment key={index}>
          <span data-word="">{word}</span>{" "}
        </Fragment>
      ))}
    </p>
  );
}

// Three or four large, overlapping clouds of the brand colors. They overlap and are blurred
// together, so they read as one continuous light instead of separate spots.
const CLOUDS = {
  panel: [
    { c: "--d1", x: "-14%", y: "-4%", s: "clamp(420px, 58vw, 900px)", t: "21s" },
    { c: "--d4", x: "22%", y: "4%", s: "clamp(440px, 60vw, 940px)", t: "26s" },
    { c: "--d6", x: "54%", y: "10%", s: "clamp(420px, 58vw, 900px)", t: "18s" },
  ],
  wide: [
    { c: "--d1", x: "-16%", y: "4%", s: "clamp(420px, 56vw, 880px)", t: "24s" },
    { c: "--d2", x: "12%", y: "22%", s: "clamp(400px, 52vw, 820px)", t: "19s" },
    { c: "--d4", x: "36%", y: "0%", s: "clamp(440px, 58vw, 900px)", t: "27s" },
    { c: "--d6", x: "60%", y: "18%", s: "clamp(420px, 56vw, 880px)", t: "22s" },
  ],
} as const;

// Colored light behind glass panels. Without something behind it, glass can't be seen.
export function GlassStage({ variant = "panel", open = false }: { variant?: keyof typeof CLOUDS; open?: boolean }) {
  return (
    <div aria-hidden="true" className={open ? "stage stage-open" : "stage"}>
      <div className="clouds">
        {CLOUDS[variant].map((cloud) => (
          <span
            key={cloud.c}
            className="cloud"
            style={
              {
                "--c": `var(${cloud.c})`,
                "--x": cloud.x,
                "--y": cloud.y,
                "--s": cloud.s,
                "--t": cloud.t,
              } as CSSProperties
            }
          />
        ))}
      </div>
    </div>
  );
}
