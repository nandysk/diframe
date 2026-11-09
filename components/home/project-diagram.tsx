// Each project drawn with the hero's own vocabulary of nodes and lines.
// Gray at rest. The colored paths draw themselves when the card comes into view.

type Point = readonly [number, number];

function Dots({ points, size = 3.5 }: { points: readonly Point[]; size?: number }) {
  return points.map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r={size} fill="currentColor" opacity="0.7" />);
}

function Lines({ from, to, dashed = false, color }: { from: Point; to: readonly Point[]; dashed?: boolean; color?: string }) {
  return to.map(([x, y]) => (
    <line
      key={`${x}-${y}`}
      // Drawn from the hub outward; pathLength lets one dash cover any line.
      pathLength={color ? 1 : undefined}
      x1={from[0]}
      y1={from[1]}
      x2={x}
      y2={y}
      stroke={color ?? "currentColor"}
      strokeOpacity={color ? 1 : 0.28}
      strokeWidth={color ? 1.5 : 1}
      strokeDasharray={dashed ? "3 6" : undefined}
    />
  ));
}

function VisaDiagram() {
  // Scattered manual steps all arrive at one portal, shaped like the logo's pill.
  const steps: Point[] = [[44, 42], [104, 96], [36, 150], [118, 196], [52, 262], [146, 34], [168, 268]];
  const hub: Point = [352, 150];
  return (
    <>
      <Lines from={hub} to={steps} dashed />
      <g className="sig"><Lines from={hub} to={steps} color="var(--d1)" /></g>
      <Dots points={steps} />
      <rect x="326" y="74" width="52" height="152" rx="26" transform="rotate(30 352 150)" fill="currentColor" />
    </>
  );
}

function HrDiagram() {
  // One record at the center, with every HR process connected to it.
  const center: Point = [240, 150];
  const ring: Point[] = Array.from({ length: 10 }, (_, i) => {
    const angle = (i / 10) * Math.PI * 2 - Math.PI / 2;
    return [Math.round(240 + Math.cos(angle) * 170), Math.round(150 + Math.sin(angle) * 112)] as const;
  });
  return (
    <>
      <Lines from={center} to={ring} />
      <g className="sig"><Lines from={center} to={ring} color="var(--d3)" /></g>
      <Dots points={ring} size={4} />
      <circle cx={center[0]} cy={center[1]} r="26" fill="currentColor" />
    </>
  );
}

function ExpatDiagram() {
  // An employee's move between two sites, tracked along one path.
  const origin: Point = [84, 208];
  const destination: Point = [396, 92];
  const nearOrigin: Point[] = [[34, 160], [52, 262], [132, 262], [146, 176]];
  const nearDestination: Point[] = [[338, 44], [336, 138], [446, 46], [450, 136]];
  const path = `M${origin[0]} ${origin[1]} C 170 40, 300 40, ${destination[0]} ${destination[1]}`;
  return (
    <>
      <Lines from={origin} to={nearOrigin} />
      <Lines from={destination} to={nearDestination} />
      <path d={path} fill="none" stroke="currentColor" strokeOpacity="0.4" strokeDasharray="3 6" />
      <g className="sig"><path pathLength={1} d={path} fill="none" stroke="var(--d6)" strokeWidth="1.5" /></g>
      <Dots points={[...nearOrigin, ...nearDestination]} />
      <circle cx={origin[0]} cy={origin[1]} r="14" fill="currentColor" />
      <circle cx={destination[0]} cy={destination[1]} r="14" fill="currentColor" />
    </>
  );
}

const DIAGRAMS: Record<string, () => React.ReactElement> = {
  visa: VisaDiagram,
  hr: HrDiagram,
  expat: ExpatDiagram,
};

export function ProjectDiagram({ kind }: { kind: string }) {
  const Diagram = DIAGRAMS[kind];
  if (!Diagram) return null;
  return (
    <svg viewBox="0 0 480 300" aria-hidden="true" className="diagram">
      <Diagram />
    </svg>
  );
}
