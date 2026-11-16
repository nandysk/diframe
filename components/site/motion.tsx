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

// Where the ribbon sits: a band through the middle of a panel, or a taller one for wide sections.
const RIBBONS = {
  panel: { top: "28%", height: "62%" },
  wide: { top: "16%", height: "72%" },
} as const;

// Colored light behind glass panels. Without something behind it, glass can't be seen.
export function GlassStage({ variant = "panel", open = false }: { variant?: keyof typeof RIBBONS; open?: boolean }) {
  const { top, height } = RIBBONS[variant];
  return (
    <div aria-hidden="true" className={open ? "stage stage-open" : "stage"}>
      <span className="ribbon" style={{ "--top": top, "--height": height } as CSSProperties} />
    </div>
  );
}
