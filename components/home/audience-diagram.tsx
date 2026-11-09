// The hero's nodes and lines again, one network per kind of organization:
// the structures grow from one small team to several connected groups.
// Gray at rest, and the colored paths draw themselves when the card arrives.

type Point = readonly [number, number];
type Link = readonly [Point, Point];

function ring([x, y]: Point, radiusX: number, radiusY: number, count: number, turn = -Math.PI / 2): Point[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = turn + (i / count) * Math.PI * 2;
    return [Math.round(x + Math.cos(angle) * radiusX), Math.round(y + Math.sin(angle) * radiusY)] as const;
  });
}

const spokes = (hub: Point, points: readonly Point[]): Link[] => points.map((point) => [hub, point]);

type Network = { hubs: Point[]; nodes: Point[]; links: Link[]; color: string };

function build(kind: string): Network | null {
  switch (kind) {
    case "startups": {
      // One small team.
      const hub: Point = [240, 90];
      const nodes = ring(hub, 96, 50, 3, -Math.PI / 6);
      return { hubs: [hub], nodes, links: spokes(hub, nodes), color: "var(--d1)" };
    }
    case "smb": {
      // A wider team around one center.
      const hub: Point = [240, 90];
      const nodes = ring(hub, 150, 66, 7);
      return { hubs: [hub], nodes, links: spokes(hub, nodes), color: "var(--d2)" };
    }
    case "enterprise": {
      // Several departments, all connected.
      const hubs: Point[] = [[110, 110], [240, 52], [370, 112]];
      const groups = hubs.map((hub) => ring(hub, 62, 34, 5));
      return {
        hubs,
        nodes: groups.flat(),
        links: [
          [hubs[0], hubs[1]],
          [hubs[1], hubs[2]],
          [hubs[0], hubs[2]],
          ...hubs.flatMap((hub, i) => spokes(hub, groups[i])),
        ],
        color: "var(--d3)",
      };
    }
    case "government": {
      // A clear hierarchy, from one institution down to its offices.
      const top: Point = [240, 26];
      const middle: Point[] = [[100, 88], [240, 88], [380, 88]];
      const offices = middle.map(([x]) => [[x - 44, 154], [x, 154], [x + 44, 154]] as Point[]);
      return {
        hubs: [top],
        nodes: [...middle, ...offices.flat()],
        links: [...spokes(top, middle), ...middle.flatMap((hub, i) => spokes(hub, offices[i]))],
        color: "var(--d5)",
      };
    }
    case "ngo": {
      // Separate teams, far apart, linked together.
      const hubs: Point[] = [[60, 58], [196, 128], [316, 44], [426, 124]];
      const groups = hubs.map((hub) => ring(hub, 34, 24, 4, 0.5));
      return {
        hubs,
        nodes: groups.flat(),
        links: [
          [hubs[0], hubs[1]],
          [hubs[1], hubs[2]],
          [hubs[2], hubs[3]],
          [hubs[0], hubs[2]],
          [hubs[1], hubs[3]],
          ...hubs.flatMap((hub, i) => spokes(hub, groups[i])),
        ],
        color: "var(--d6)",
      };
    }
    default:
      return null;
  }
}

function Lines({ links, color }: { links: readonly Link[]; color?: string }) {
  return links.map(([from, to]) => (
    <line
      key={`${from}-${to}`}
      pathLength={color ? 1 : undefined}
      x1={from[0]}
      y1={from[1]}
      x2={to[0]}
      y2={to[1]}
      stroke={color ?? "currentColor"}
      strokeOpacity={color ? 1 : 0.28}
      strokeWidth={color ? 1.5 : 1}
    />
  ));
}

export function AudienceDiagram({ kind }: { kind: string }) {
  const network = build(kind);
  if (!network) return null;
  return (
    <svg viewBox="0 0 480 180" aria-hidden="true" className="diagram">
      <Lines links={network.links} />
      <g className="sig">
        <Lines links={network.links} color={network.color} />
      </g>
      {network.nodes.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="3.5" fill="currentColor" opacity="0.7" />
      ))}
      {network.hubs.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="9" fill="currentColor" />
      ))}
    </svg>
  );
}
