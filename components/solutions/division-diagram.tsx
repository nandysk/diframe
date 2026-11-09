// One drawing per division, in the hero's language of nodes and lines. Gray at
// rest; the division's color draws itself in when the drawing comes into view.

type Point = readonly [number, number];
type Link = readonly [Point, Point];
type Drawing = { links: Link[]; nodes: Point[]; hubs: Point[]; extra?: React.ReactNode; signal?: React.ReactNode };

const spread = (y: number, from: number, to: number, count: number): Point[] =>
  Array.from({ length: count }, (_, i) => [Math.round(from + ((to - from) * i) / (count - 1)), y] as const);

const ring = ([x, y]: Point, rx: number, ry: number, count: number, turn = -Math.PI / 2): Point[] =>
  Array.from({ length: count }, (_, i) => {
    const angle = turn + (i / count) * Math.PI * 2;
    return [Math.round(x + Math.cos(angle) * rx), Math.round(y + Math.sin(angle) * ry)] as const;
  });

const fan = (hub: Point, points: readonly Point[]): Link[] => points.map((point) => [hub, point]);

function software(): Drawing {
  // Applications at the top, services in the middle, one shared record below.
  const apps = spread(54, 70, 410, 5);
  const services = spread(170, 130, 350, 3);
  const data: Point = [240, 290];
  return {
    links: [
      ...services.flatMap((service) => fan(service, apps.filter(([x]) => Math.abs(x - service[0]) < 130))),
      ...fan(data, services),
    ],
    nodes: apps,
    hubs: [...services, data],
  };
}

function automation(): Drawing {
  // An agent at the center, working around a loop of steps.
  const center: Point = [240, 180];
  const steps = ring(center, 170, 130, 8);
  const loop: Link[] = steps.map((step, i) => [step, steps[(i + 1) % steps.length]]);
  return { links: [...loop, ...fan(center, steps.filter((_, i) => i % 2 === 0))], nodes: steps, hubs: [center] };
}

function data(): Drawing {
  // Scattered sources gathered into a rising line of figures.
  const baseline = 310;
  const tops: Point[] = [[60, 250], [130, 210], [200, 226], [270, 150], [340, 112], [420, 52]];
  return {
    links: [
      ...tops.map(([x, y]): Link => [[x, baseline], [x, y]]),
      [[40, baseline], [440, baseline]],
    ],
    nodes: tops.map(([x]) => [x, baseline] as const),
    hubs: [],
    signal: <polyline pathLength={1} points={tops.join(" ")} fill="none" stroke="var(--hue)" strokeWidth="2" />,
    extra: tops.map(([x, y]) => <circle key={x} cx={x} cy={y} r="7" fill="currentColor" />),
  };
}

function infrastructure(): Drawing {
  // A core, distribution points and the sites they connect.
  const core: Point[] = [[170, 50], [310, 50]];
  const middle = spread(170, 60, 420, 4);
  const edge = spread(300, 30, 450, 8);
  return {
    links: [
      [core[0], core[1]],
      ...core.flatMap((hub) => fan(hub, middle)),
      ...middle.flatMap((hub) => fan(hub, edge.filter(([x]) => Math.abs(x - hub[0]) < 90))),
    ],
    nodes: edge,
    hubs: [...core, ...middle],
  };
}

function security(): Drawing {
  // Protected systems at the center, inside layers of defense.
  const center: Point = [240, 180];
  const inner = ring(center, 66, 50, 5);
  const outside = ring(center, 222, 168, 10, -Math.PI / 3);
  return {
    links: fan(center, inner),
    nodes: [...inner, ...outside],
    hubs: [center],
    extra: (
      <>
        <ellipse cx="240" cy="180" rx="118" ry="88" fill="none" stroke="currentColor" strokeOpacity="0.28" />
        <ellipse cx="240" cy="180" rx="176" ry="132" fill="none" stroke="currentColor" strokeOpacity="0.28" strokeDasharray="3 6" />
      </>
    ),
    signal: <ellipse pathLength={1} cx="240" cy="180" rx="118" ry="88" fill="none" stroke="var(--hue)" strokeWidth="2" />,
  };
}

function documents(): Drawing {
  // A stack of pages, each one filed into a single organized index.
  const index: Point = [400, 180];
  const pages = [
    { x: 54, y: 34 },
    { x: 92, y: 74 },
    { x: 130, y: 114 },
  ];
  const tabs: Point[] = pages.map(({ x, y }) => [x + 150, y + 56] as const);
  return {
    links: fan(index, tabs),
    nodes: tabs,
    hubs: [index],
    extra: pages.map(({ x, y }) => (
      <g key={x}>
        <rect x={x} y={y} width="150" height="198" rx="16" fill="var(--doc-fill, transparent)" stroke="currentColor" strokeOpacity="0.4" />
        <line x1={x + 24} y1={y + 40} x2={x + 110} y2={y + 40} stroke="currentColor" strokeOpacity="0.4" />
        <line x1={x + 24} y1={y + 68} x2={x + 126} y2={y + 68} stroke="currentColor" strokeOpacity="0.28" />
        <line x1={x + 24} y1={y + 96} x2={x + 90} y2={y + 96} stroke="currentColor" strokeOpacity="0.28" />
      </g>
    )),
  };
}

const DRAWINGS = [software, automation, data, infrastructure, security, documents];

export function DivisionDiagram({ index, className }: { index: number; className?: string }) {
  const drawing = DRAWINGS[index]?.();
  if (!drawing) return null;
  return (
    <svg
      viewBox="0 0 480 360"
      aria-hidden="true"
      className={className ? `diagram ${className}` : "diagram"}
      style={{ "--hue": `var(--d${index + 1})` } as React.CSSProperties}
    >
      {drawing.extra}
      {drawing.links.map(([from, to]) => (
        <line
          key={`${from}-${to}`}
          x1={from[0]}
          y1={from[1]}
          x2={to[0]}
          y2={to[1]}
          stroke="currentColor"
          strokeOpacity="0.28"
        />
      ))}
      <g className="sig">
        {drawing.links.map(([from, to]) => (
          <line
            key={`${from}-${to}`}
            pathLength={1}
            x1={from[0]}
            y1={from[1]}
            x2={to[0]}
            y2={to[1]}
            stroke="var(--hue)"
            strokeWidth="1.5"
          />
        ))}
        {drawing.signal}
      </g>
      {drawing.nodes.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="4" fill="currentColor" opacity="0.7" />
      ))}
      {drawing.hubs.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="10" fill="currentColor" />
      ))}
    </svg>
  );
}
