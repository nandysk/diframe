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

const ORBS = {
  panel: [
    { c: "--d1", x: "-6%", y: "-18%", s: "clamp(320px, 42vw, 640px)", t: "21s" },
    { c: "--d4", x: "38%", y: "6%", s: "clamp(300px, 36vw, 560px)", t: "26s" },
    { c: "--d6", x: "72%", y: "22%", s: "clamp(280px, 34vw, 540px)", t: "18s" },
  ],
  wide: [
    { c: "--d2", x: "-10%", y: "2%", s: "clamp(360px, 50vw, 780px)", t: "24s" },
    { c: "--d1", x: "30%", y: "46%", s: "clamp(300px, 34vw, 540px)", t: "19s" },
    { c: "--d4", x: "54%", y: "-12%", s: "clamp(340px, 44vw, 700px)", t: "27s" },
    { c: "--d6", x: "78%", y: "44%", s: "clamp(300px, 36vw, 580px)", t: "22s" },
  ],
} as const;

// Colored light behind glass panels. Without something behind it, glass can't be seen.
export function GlassStage({ variant = "panel", open = false }: { variant?: keyof typeof ORBS; open?: boolean }) {
  return (
    <div aria-hidden="true" className={open ? "stage stage-open" : "stage"}>
      {ORBS[variant].map((orb) => (
        <span
          key={orb.c}
          className="orb"
          style={
            {
              "--c": `var(${orb.c})`,
              "--x": orb.x,
              "--y": orb.y,
              "--s": orb.s,
              "--t": orb.t,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
