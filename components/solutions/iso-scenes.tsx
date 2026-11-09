// Isometric scenes for the division pages, drawn on a 30° grid. Materials come from
// the --iso-* tokens, so the same drawing works in the light and dark themes.
// The division's color (--hue) marks what is live: lights, screens, links, results.

import type { ReactNode } from "react";

const UNIT = 25;
const COS = Math.cos(Math.PI / 6);
const ORIGIN = { x: 222, y: 132 };
// A circle of radius 1 on the ground projects to an ellipse with these half-axes.
const RX = Math.SQRT2 * COS * UNIT;
const RY = Math.SQRT1_2 * UNIT;

type Point = readonly [number, number];

// Grid position (x to the lower right, y to the lower left, z up) to screen position.
const at = (x: number, y: number, z = 0): Point => [
  ORIGIN.x + (x - y) * COS * UNIT,
  ORIGIN.y + (x + y) * 0.5 * UNIT - z * UNIT,
];

const n = (value: number) => value.toFixed(1);
const pts = (points: Point[]) => points.map(([x, y]) => `${n(x)},${n(y)}`).join(" ");

// Flat rectangles on the three planes a viewer can see.
const front = (x0: number, x1: number, y: number, z0: number, z1: number) =>
  pts([at(x0, y, z0), at(x1, y, z0), at(x1, y, z1), at(x0, y, z1)]);
const side = (x: number, y0: number, y1: number, z0: number, z1: number) =>
  pts([at(x, y0, z0), at(x, y1, z0), at(x, y1, z1), at(x, y0, z1)]);
const top = (x0: number, x1: number, y0: number, y1: number, z: number) =>
  pts([at(x0, y0, z), at(x1, y0, z), at(x1, y1, z), at(x0, y1, z)]);

type Material = "floor" | "metal" | "panel" | "accent";

type Box = { x: number; y: number; z?: number; w: number; d: number; h: number; material: Material };

// The three visible faces: top, front (facing lower left) and side (facing lower right).
function Block({ x, y, z = 0, w, d, h, material, children }: Box & { children?: ReactNode }) {
  const m = `var(--iso-${material}`;
  return (
    <g strokeLinejoin="round" strokeWidth="1" stroke="var(--iso-edge)">
      <polygon fill={`${m}-top)`} points={top(x, x + w, y, y + d, z + h)} />
      <polygon fill={`${m}-front)`} points={front(x, x + w, y + d, z, z + h)} />
      <polygon fill={`${m}-side)`} points={side(x + w, y, y + d, z, z + h)} />
      {children && <g stroke="none">{children}</g>}
    </g>
  );
}

// A point on a box's front face, measured from its lower-left corner.
const onFront = (box: Box, a: number, b: number) => at(box.x + a, box.y + box.d, (box.z ?? 0) + b);
const frontRect = (box: Box, a: number, b: number, w: number, h: number) =>
  front(box.x + a, box.x + a + w, box.y + box.d, (box.z ?? 0) + b, (box.z ?? 0) + b + h);

function Floor() {
  return (
    <>
      <Block x={0} y={0} z={-0.5} w={9} d={7} h={0.5} material="floor" />
      <g stroke="var(--iso-grid)" strokeWidth="1">
        {Array.from({ length: 8 }, (_, i) => (
          <Segment key={`x${i}`} from={at(i + 1, 0)} to={at(i + 1, 7)} />
        ))}
        {Array.from({ length: 6 }, (_, i) => (
          <Segment key={`y${i}`} from={at(0, i + 1)} to={at(9, i + 1)} />
        ))}
      </g>
    </>
  );
}

function Segment({ from, to, draw }: { from: Point; to: Point; draw?: boolean }) {
  return <line pathLength={draw ? 1 : undefined} x1={n(from[0])} y1={n(from[1])} x2={n(to[0])} y2={n(to[1])} />;
}

// Lines that draw themselves in, in the division's color, when the scene comes into view.
function Signal({ paths, width = 1.5 }: { paths: Point[][]; width?: number }) {
  return (
    <g className="sig" fill="none" stroke="var(--hue)" strokeWidth={width} strokeLinecap="round" strokeLinejoin="round">
      {paths.map((path) => (
        <polyline key={pts(path)} pathLength={1} points={pts(path)} />
      ))}
    </g>
  );
}

function Cylinder({ x, y, z = 0, r, h, material = "metal", ring }: { x: number; y: number; z?: number; r: number; h: number; material?: Material; ring?: boolean }) {
  const [cx, bottom] = at(x, y, z);
  const upper = bottom - h * UNIT;
  const [rx, ry] = [RX * r, RY * r];
  const m = `var(--iso-${material}`;
  return (
    <g stroke="var(--iso-edge)" strokeWidth="1">
      <path fill={`${m}-front)`} d={`M${n(cx - rx)},${n(upper)}V${n(bottom)}A${n(rx)},${n(ry)} 0 0 0 ${n(cx + rx)},${n(bottom)}V${n(upper)}Z`} />
      <path
        fill={`${m}-side)`}
        stroke="none"
        d={`M${n(cx)},${n(upper + ry)}V${n(bottom + ry)}A${n(rx)},${n(ry)} 0 0 0 ${n(cx + rx)},${n(bottom)}V${n(upper)}A${n(rx)},${n(ry)} 0 0 1 ${n(cx)},${n(upper + ry)}Z`}
      />
      <ellipse fill={`${m}-top)`} cx={n(cx)} cy={n(upper)} rx={n(rx)} ry={n(ry)} />
      {ring && (
        <path
          fill="none"
          stroke="var(--hue)"
          strokeWidth="2"
          d={`M${n(cx - rx)},${n((upper + bottom) / 2)}A${n(rx)},${n(ry)} 0 0 0 ${n(cx + rx)},${n((upper + bottom) / 2)}`}
        />
      )}
    </g>
  );
}

function Rack({ box, seed }: { box: Box; seed: number }) {
  const units = Math.floor((box.h - 0.5) / 0.46);
  return (
    <Block {...box}>
      <polygon fill="var(--iso-slot)" points={top(box.x + 0.3, box.x + box.w - 0.3, box.y + 0.3, box.y + box.d - 0.3, (box.z ?? 0) + box.h)} />
      {Array.from({ length: units }, (_, unit) => {
        const b = 0.32 + unit * 0.46;
        const lit = (unit * 7 + seed * 3) % 5 !== 0;
        const [lx, ly] = onFront(box, box.w - 0.28, b + 0.17);
        return (
          <g key={unit}>
            <polygon fill="var(--iso-slot)" points={frontRect(box, 0.14, b, box.w - 0.28, 0.34)} />
            <circle cx={n(lx)} cy={n(ly)} r="1.7" fill={lit ? "var(--hue)" : "var(--iso-led-off)"} className={lit && unit % 3 === seed % 3 ? "iso-blink" : undefined} />
          </g>
        );
      })}
    </Block>
  );
}

// Short text lines on a front face, as on a screen or a page.
function Lines({ box, a, b, widths, gap = 0.2, stroke = "var(--iso-ink)", width = 1.6 }: { box: Box; a: number; b: number; widths: number[]; gap?: number; stroke?: string; width?: number }) {
  return (
    <g stroke={stroke} strokeWidth={width} strokeLinecap="round">
      {widths.map((w, i) => (
        <Segment key={i} from={onFront(box, a, b - i * gap)} to={onFront(box, a + w, b - i * gap)} />
      ))}
    </g>
  );
}

/* ---------- 01 Digital Solutions & Software Engineering ---------- */

function software(): ReactNode {
  const windowA: Box = { x: 0.5, y: 0.4, z: 3.2, w: 2.7, d: 0.1, h: 1.7, material: "panel" };
  const windowB: Box = { x: 4.5, y: 0.5, z: 3.6, w: 2.3, d: 0.1, h: 1.5, material: "panel" };
  const screen: Box = { x: 1.8, y: 2.45, z: 0.22, w: 3.4, d: 0.15, h: 2.3, material: "metal" };
  const base: Box = { x: 1.8, y: 2.6, w: 3.4, d: 2.3, h: 0.22, material: "panel" };
  const phone: Box = { x: 6.3, y: 4.0, w: 1.15, d: 0.16, h: 2.1, material: "metal" };
  const keyRows = [3.0, 3.38, 3.76];
  const keyCols = Array.from({ length: 8 }, (_, i) => 2.1 + i * 0.36);
  const code = [
    [0.25, 1.6, "hue"],
    [0.55, 1.3, "ink"],
    [0.55, 0.9, "ink"],
    [0.85, 1.1, "hue"],
    [0.55, 1.5, "ink"],
    [0.25, 0.7, "hue"],
  ] as const;

  return (
    <>
      <Floor />
      <Block {...windowA}>
        <polygon fill="var(--hue)" points={frontRect(windowA, 0, windowA.h - 0.3, windowA.w, 0.3)} />
        <polygon fill="var(--iso-ink)" points={frontRect(windowA, 0.2, 0.2, 0.9, 0.9)} />
        <Lines box={windowA} a={1.3} b={1.05} widths={[1.1, 0.8, 1.0, 0.6]} />
      </Block>
      <Block {...windowB}>
        <polygon fill="var(--hue)" points={frontRect(windowB, 0, windowB.h - 0.28, windowB.w, 0.28)} />
        <g fill="none" stroke="var(--hue)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <polyline points={pts([onFront(windowB, 0.75, 0.85), onFront(windowB, 0.45, 0.6), onFront(windowB, 0.75, 0.35)])} />
          <polyline points={pts([onFront(windowB, 1.55, 0.85), onFront(windowB, 1.85, 0.6), onFront(windowB, 1.55, 0.35)])} />
          <Segment from={onFront(windowB, 1.3, 0.9)} to={onFront(windowB, 1.0, 0.3)} />
        </g>
      </Block>
      <Block {...screen}>
        <polygon fill="var(--iso-slot)" points={frontRect(screen, 0.12, 0.12, screen.w - 0.24, screen.h - 0.24)} />
        {code.map(([indent, w, tone], i) => (
          <g key={i} stroke={tone === "hue" ? "var(--hue)" : "var(--iso-code)"} strokeWidth="2" strokeLinecap="round">
            <Segment from={onFront(screen, 0.2 + indent, 1.85 - i * 0.28)} to={onFront(screen, 0.2 + indent + w, 1.85 - i * 0.28)} />
          </g>
        ))}
      </Block>
      <Block {...base}>
        {keyRows.map((y) =>
          keyCols.map((x) => <polygon key={`${x}-${y}`} fill="var(--iso-ink)" points={top(x, x + 0.28, y, y + 0.28, 0.22)} />),
        )}
        <polygon fill="var(--iso-ink)" points={top(2.9, 4.1, 4.2, 4.7, 0.22)} />
      </Block>
      <Block {...phone}>
        <polygon fill="var(--hue)" opacity="0.9" points={frontRect(phone, 0.1, 0.12, phone.w - 0.2, phone.h - 0.24)} />
        {[1.45, 0.95].map((b) =>
          [0.22, 0.62].map((a) => <polygon key={`${a}-${b}`} fill="var(--iso-screen-text)" opacity="0.8" points={frontRect(phone, a, b, 0.3, 0.3)} />),
        )}
        <polygon fill="var(--iso-screen-text)" opacity="0.6" points={frontRect(phone, 0.22, 0.35, 0.7, 0.3)} />
      </Block>
      <Signal
        paths={[
          [at(3.0, 2.6, 2.52), at(1.85, 0.5, 3.2)],
          [at(4.4, 2.6, 2.52), at(5.6, 0.6, 3.6)],
          [at(6.9, 4.16, 2.1), at(6.3, 0.6, 3.6)],
        ]}
      />
    </>
  );
}

/* ---------- 02 AI & Intelligent Automation ---------- */

function automation(): ReactNode {
  const chip: Box = { x: 1.0, y: 1.0, w: 2.8, d: 2.8, h: 0.35, material: "metal" };
  const core: Box = { x: 1.6, y: 1.6, z: 0.35, w: 1.6, d: 1.6, h: 0.28, material: "accent" };
  const belt: Box = { x: 0.3, y: 5.0, w: 8.4, d: 1.1, h: 0.6, material: "metal" };
  const docs = [0.8, 2.3, 5.4, 7.0];
  const gate = { x: 3.8, w: 0.32 };
  const coreTop = 0.63;
  const neural: Point[] = [at(2.0, 2.0, coreTop), at(2.8, 2.0, coreTop), at(2.4, 2.4, coreTop), at(2.0, 2.8, coreTop), at(2.8, 2.8, coreTop)];
  const layers = [1.5, 2.6, 3.7];
  const nodes: [number, number][] = [[1.8, 1.8], [3.0, 1.8], [2.4, 2.4], [1.8, 3.0], [3.0, 3.0]];
  const arm: Point[] = [at(7.0, 2.4, 0.45), at(7.0, 2.4, 2.6), at(6.2, 4.0, 3.0), at(6.2, 5.55, 1.55)];

  return (
    <>
      <Floor />
      <Signal
        paths={[
          [at(2.4, 3.8), at(2.4, 5.0)],
          [at(3.8, 2.4), at(7.0, 2.4)],
          [at(3.8, 1.6), at(5.2, 1.6), at(5.2, 0.6), at(8.4, 0.6)],
        ]}
        width={1.8}
      />
      <Block {...chip}>
        {Array.from({ length: 6 }, (_, i) => (
          <g key={i} fill="var(--iso-slot)">
            <polygon points={frontRect(chip, 0.3 + i * 0.4, 0.08, 0.2, 0.19)} />
            <polygon points={side(chip.x + chip.w, chip.y + 0.3 + i * 0.4, chip.y + 0.5 + i * 0.4, 0.08, 0.27)} />
          </g>
        ))}
      </Block>
      <Block {...core} />
      <g stroke="var(--iso-screen-text)" strokeWidth="1.3">
        {[[0, 2], [1, 2], [2, 3], [2, 4], [0, 3], [1, 4]].map(([a, b]) => (
          <Segment key={`${a}${b}`} from={neural[a]} to={neural[b]} />
        ))}
      </g>
      {neural.map(([x, y], i) => (
        <circle key={i} cx={n(x)} cy={n(y)} r="2.6" fill="var(--iso-screen-text)" />
      ))}
      {layers.map((z, i) => (
        <g key={z}>
          <polygon fill="var(--hue)" fillOpacity={0.1 + i * 0.05} stroke="var(--hue)" strokeOpacity="0.7" points={top(1.3, 3.5, 1.3, 3.5, z)} />
          {nodes.map(([x, y]) => {
            const [px, py] = at(x, y, z);
            return <circle key={`${x}-${y}`} cx={n(px)} cy={n(py)} r="2.4" fill="var(--hue)" />;
          })}
        </g>
      ))}
      <Signal
        paths={layers.slice(0, -1).flatMap((z, i) =>
          nodes.filter((_, k) => (k + i) % 2 === 0).map(([x, y], k) => [at(x, y, z), at(nodes[(k * 2 + 1) % nodes.length][0], nodes[(k * 2 + 1) % nodes.length][1], layers[i + 1])]),
        )}
        width={1}
      />
      <Cylinder x={7.0} y={2.4} r={0.55} h={0.45} />
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <polyline points={pts(arm)} stroke="var(--iso-metal-front)" strokeWidth="10" />
        <polyline points={pts(arm)} stroke="var(--iso-metal-top)" strokeWidth="4" />
      </g>
      {arm.slice(1, 3).map(([x, y]) => (
        <g key={x}>
          <circle cx={n(x)} cy={n(y)} r="7" fill="var(--iso-metal-top)" stroke="var(--iso-edge)" />
          <circle cx={n(x)} cy={n(y)} r="2.6" fill="var(--hue)" />
        </g>
      ))}
      <Block x={gate.x} y={4.75} w={gate.w} d={0.3} h={2.0} material="metal" />
      <Block {...belt}>
        {Array.from({ length: 16 }, (_, i) => (
          <polygon key={i} fill="var(--iso-slot)" points={top(belt.x + 0.2 + i * 0.52, belt.x + 0.26 + i * 0.52, belt.y + 0.1, belt.y + belt.d - 0.1, belt.h)} />
        ))}
      </Block>
      {docs.map((x, i) => {
        const done = i >= 2;
        const sheet: Box = { x, y: 5.2, z: 0.6, w: 0.95, d: 0.7, h: 0.14, material: "panel" };
        return (
          <Block key={x} {...sheet}>
            {done ? (
              <polyline
                fill="none"
                stroke="var(--hue)"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={pts([at(x + 0.25, 5.55, 0.74), at(x + 0.45, 5.75, 0.74), at(x + 0.75, 5.3, 0.74)])}
              />
            ) : (
              <g stroke="var(--iso-ink)" strokeWidth="1.4">
                {[0.25, 0.42, 0.59].map((dy) => (
                  <Segment key={dy} from={at(x + 0.15, 5.2 + dy, 0.74)} to={at(x + 0.8, 5.2 + dy, 0.74)} />
                ))}
              </g>
            )}
          </Block>
        );
      })}
      <Block x={gate.x} y={6.1} w={gate.w} d={0.3} h={2.0} material="metal" />
      <Block x={gate.x} y={4.75} z={1.75} w={gate.w} d={1.65} h={0.3} material="metal">
        <polygon fill="var(--hue)" points={front(gate.x, gate.x + gate.w, 6.4, 1.8, 2.0)} />
      </Block>
      <polygon fill="var(--hue)" opacity="0.18" points={side(gate.x + gate.w / 2, 5.05, 6.1, 0.6, 1.75)} />
    </>
  );
}

/* ---------- 03 Data & Business Intelligence ---------- */

function data(): ReactNode {
  const board: Box = { x: 0.5, y: 0.5, w: 5.4, d: 0.18, h: 3.5, material: "panel" };
  const bars = [
    { x: 1.0, h: 0.9 },
    { x: 1.9, h: 1.5 },
    { x: 2.8, h: 1.2 },
    { x: 3.7, h: 2.0 },
    { x: 4.6, h: 2.7 },
  ];
  const trend: Point[] = [
    [0.4, 0.7],
    [1.2, 1.2],
    [2.0, 1.0],
    [2.8, 1.7],
    [3.6, 1.5],
    [4.4, 2.2],
    [5.0, 2.5],
  ].map(([a, b]) => onFront(board, a, b));
  const pie = { x: 7.1, y: 5.0, r: 0.95, z: 0.25 };
  const [pcx, pcy] = at(pie.x, pie.y, pie.z);
  const wedgeEnd: Point = [pcx + RX * pie.r * Math.cos(-0.4), pcy + RY * pie.r * Math.sin(-0.4)];

  return (
    <>
      <Floor />
      <Block {...board}>
        {[0.4, 2.0, 3.6].map((a, i) => (
          <polygon key={a} fill={i === 0 ? "var(--hue)" : "var(--iso-ink)"} points={frontRect(board, a, 2.75, 1.4, 0.5)} />
        ))}
        <g stroke="var(--iso-ink)" strokeWidth="1">
          <Segment from={onFront(board, 0.4, 0.45)} to={onFront(board, 5.0, 0.45)} />
        </g>
      </Block>
      <Signal paths={[trend]} width={2.4} />
      {trend.map(([x, y]) => (
        <circle key={x} cx={n(x)} cy={n(y)} r="2.6" fill="var(--hue)" />
      ))}
      <Signal
        paths={[
          [at(6.9, 3.2), at(6.9, 4.1), at(5.4, 4.1)],
          [at(6.4, 2.2), at(6.4, 1.2), at(5.9, 1.2)],
        ]}
      />
      {[0, 0.85, 1.7].map((z, i) => (
        <Cylinder key={z} x={7.2} y={2.2} z={z} r={0.85} h={0.7} ring={i === 2} />
      ))}
      {bars.map(({ x, h }, i) => (
        <Block key={x} x={x} y={3.5} w={0.7} d={0.7} h={h} material={i >= 3 ? "accent" : "metal"} />
      ))}
      <Cylinder x={pie.x} y={pie.y} r={pie.r} h={pie.z} material="panel" />
      <path
        fill="var(--hue)"
        stroke="var(--iso-edge)"
        d={`M${n(pcx)},${n(pcy)}L${n(pcx + RX * pie.r)},${n(pcy)}A${n(RX * pie.r)},${n(RY * pie.r)} 0 0 1 ${n(pcx - RX * pie.r * 0.2)},${n(pcy + RY * pie.r * 0.98)}Z`}
      />
      <path fill="var(--iso-ink)" d={`M${n(pcx)},${n(pcy)}L${n(pcx + RX * pie.r)},${n(pcy)}A${n(RX * pie.r)},${n(RY * pie.r)} 0 0 0 ${n(wedgeEnd[0])},${n(wedgeEnd[1])}Z`} />
    </>
  );
}

/* ---------- 04 IT Infrastructure & Cloud ---------- */

function infrastructure(): ReactNode {
  const back = [0.7, 2.1, 3.5, 4.9].map((x): Box => ({ x, y: 0.7, w: 1.3, d: 1.3, h: 3.7, material: "metal" }));
  const row = [0.7, 2.1, 3.5].map((x): Box => ({ x, y: 3.7, w: 1.3, d: 1.3, h: 2.9, material: "metal" }));
  const desk: Box = { x: 5.9, y: 4.7, w: 2.4, d: 1.3, h: 1.2, material: "panel" };
  const screen: Box = { x: 6.5, y: 4.85, z: 1.2, w: 1.2, d: 0.12, h: 0.85, material: "metal" };
  const sw: Box = { x: 6.9, y: 0.9, w: 1.5, d: 1.1, h: 1.6, material: "metal" };
  const cloud = at(6.6, -1.6, 6.2);
  const links: Point[] = [at(1.35, 1.35, 3.7), at(4.2, 1.35, 3.7), at(5.55, 1.35, 3.7)];

  return (
    <>
      <Floor />
      <g fill="none" stroke="var(--hue)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity="0.9">
        <polyline points={pts([at(6.2, 2.9), at(7.65, 2.9), at(7.65, 2.0)])} />
        <polyline points={pts([at(4.8, 2.9), at(6.2, 2.9), at(6.2, 4.7)])} />
        <polyline points={pts([at(8.05, 2.0), at(8.05, 4.7)])} />
      </g>
      {back.map((box, i) => (
        <Rack key={`b${i}`} box={box} seed={i} />
      ))}
      <Block {...sw}>
        {[0.3, 0.75, 1.2].map((b) => (
          <g key={b}>
            <polygon fill="var(--iso-slot)" points={frontRect(sw, 0.16, b - 0.12, sw.w - 0.32, 0.26)} />
            {[0.35, 0.6, 0.85, 1.1].map((a) => {
              const [cx, cy] = onFront(sw, a, b);
              return <circle key={a} cx={n(cx)} cy={n(cy)} r="1.5" fill="var(--hue)" />;
            })}
          </g>
        ))}
      </Block>
      {row.map((box, i) => (
        <Rack key={`f${i}`} box={box} seed={i + 4} />
      ))}
      <Block {...desk} />
      <Block {...screen}>
        <polygon fill="var(--hue)" opacity="0.85" points={frontRect(screen, 0.08, 0.08, screen.w - 0.16, screen.h - 0.16)} />
        <Lines box={screen} a={0.2} b={0.58} widths={[0.6, 0.8, 0.45]} gap={0.15} stroke="var(--iso-screen-text)" width={1.2} />
      </Block>
      <Signal paths={links.map((link) => [[cloud[0], cloud[1] + 14], link])} width={1.4} />
      <path
        fill="var(--iso-cloud)"
        stroke="var(--iso-edge)"
        d={`M${n(cloud[0] - 46)},${n(cloud[1] + 16)} a18,18 0 0 1 8,-30 a26,26 0 0 1 48,-8 a20,20 0 0 1 30,26 a12,12 0 0 1 -6,12 z`}
      />
      {links.map(([x, y]) => (
        <circle key={x} cx={n(x)} cy={n(y)} r="3" fill="var(--hue)" />
      ))}
    </>
  );
}

/* ---------- 05 Cybersecurity & Digital Trust ---------- */

function security(): ReactNode {
  const center = { x: 4.3, y: 3.1, r: 3.15 };
  const [cx, cy] = at(center.x, center.y);
  const [rx, ry] = [RX * center.r, RY * center.r];
  const servers = [
    { x: 3.0, y: 2.4, h: 2.3 },
    { x: 4.4, y: 2.4, h: 1.8 },
  ];
  const lock: Box = { x: 6.9, y: 5.3, w: 1.3, d: 0.6, h: 1.1, material: "accent" };
  const shackle: Point[] = [
    at(7.05, 5.6, 1.1),
    ...Array.from({ length: 13 }, (_, i) => {
      const t = Math.PI - (i / 12) * Math.PI;
      return at(7.55 + Math.cos(t) * 0.5, 5.6, 1.6 + Math.sin(t) * 0.5);
    }),
    at(8.05, 5.6, 1.1),
  ];
  // Attempts from outside stop at the dome's surface.
  const threats: Point[] = [[44, 96], [452, 118], [36, 236], [440, 300]];
  const blocked = threats.map(([px, py]): [Point, Point] => {
    const [dx, dy] = [px - cx, py - cy];
    const scale = dy < 0 ? rx / Math.hypot(dx, dy) : 1 / Math.hypot(dx / rx, dy / ry);
    return [[px, py], [cx + dx * scale, cy + dy * scale]];
  });

  return (
    <>
      <Floor />
      <path fill="none" stroke="var(--hue)" strokeOpacity="0.5" strokeDasharray="4 5" d={`M${n(cx - rx)},${n(cy)}A${n(rx)},${n(ry)} 0 0 1 ${n(cx + rx)},${n(cy)}`} />
      {servers.map(({ x, y, h }, i) => (
        <Rack key={x} box={{ x, y, w: 1.2, d: 1.2, h, material: "metal" }} seed={i} />
      ))}
      <path
        fill="var(--hue)"
        fillOpacity="0.12"
        stroke="var(--hue)"
        strokeWidth="1.6"
        d={`M${n(cx - rx)},${n(cy)}A${n(rx)},${n(rx)} 0 0 1 ${n(cx + rx)},${n(cy)}A${n(rx)},${n(ry)} 0 0 1 ${n(cx - rx)},${n(cy)}Z`}
      />
      <path fill="none" stroke="var(--iso-screen-text)" strokeOpacity="0.22" strokeWidth="2" strokeLinecap="round" d={`M${n(cx - rx * 0.72)},${n(cy - rx * 0.42)}A${n(rx * 0.84)},${n(rx * 0.84)} 0 0 1 ${n(cx - rx * 0.2)},${n(cy - rx * 0.82)}`} />
      <g stroke="var(--iso-ink)" strokeWidth="1.4" strokeDasharray="3 5">
        {blocked.map(([from, to]) => (
          <Segment key={from[0]} from={from} to={to} />
        ))}
      </g>
      {blocked.map(([from, to]) => (
        <g key={from[0]}>
          <circle cx={n(from[0])} cy={n(from[1])} r="3.5" fill="var(--iso-led-off)" />
          <circle cx={n(to[0])} cy={n(to[1])} r="4" fill="var(--hue)" />
        </g>
      ))}
      <polyline points={pts(shackle)} fill="none" stroke="var(--iso-cloud)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      <Block {...lock}>
        <circle cx={n(onFront(lock, 0.65, 0.62)[0])} cy={n(onFront(lock, 0.65, 0.62)[1])} r="3.4" fill="var(--iso-slot)" />
        <polygon fill="var(--iso-slot)" points={frontRect(lock, 0.6, 0.28, 0.1, 0.34)} />
      </Block>
    </>
  );
}

/* ---------- 06 Digital Design & Document Management ---------- */

function documents(): ReactNode {
  const screen: Box = { x: 0.7, y: 1.5, z: 0.9, w: 3.8, d: 0.14, h: 2.4, material: "metal" };
  const tablet: Box = { x: 1.3, y: 4.3, w: 2.6, d: 1.7, h: 0.12, material: "metal" };
  const cabinet: Box = { x: 5.7, y: 0.8, w: 1.8, d: 1.5, h: 3.0, material: "panel" };
  const drawer: Box = { x: 5.85, y: 2.3, z: 2.05, w: 1.5, d: 1.0, h: 0.8, material: "panel" };
  const swatches = ["var(--d1)", "var(--d3)", "var(--d5)", "var(--d6)"];
  const circle: Point[] = Array.from({ length: 24 }, (_, i) => {
    const t = (i / 24) * Math.PI * 2;
    return onFront(screen, 2.1 + Math.cos(t) * 0.5, 1.25 + Math.sin(t) * 0.5);
  });

  return (
    <>
      <Floor />
      <Block x={1.9} y={1.3} w={1.4} d={0.9} h={0.1} material="metal" />
      <Block x={2.4} y={1.45} w={0.4} d={0.2} h={0.9} material="metal" />
      <Block {...screen}>
        <polygon fill="var(--iso-panel-top)" points={frontRect(screen, 0.12, 0.12, screen.w - 0.24, screen.h - 0.24)} />
        <polygon fill="var(--iso-ink)" points={frontRect(screen, 0.12, 0.12, 0.4, screen.h - 0.24)} />
        <polygon fill="var(--hue)" opacity="0.9" points={pts(circle)} />
        <polygon fill="none" stroke="var(--iso-ink)" strokeWidth="1.6" points={frontRect(screen, 2.4, 0.45, 0.95, 0.8)} />
        {swatches.map((color, i) => (
          <polygon key={color} fill={color} points={frontRect(screen, 0.7 + i * 0.32, 1.9, 0.24, 0.22)} />
        ))}
      </Block>
      <Block {...cabinet}>
        {[0.15, 1.1].map((b) => (
          <g key={b}>
            <polygon fill="var(--iso-ink)" opacity="0.5" points={frontRect(cabinet, 0.15, b, cabinet.w - 0.3, 0.8)} />
            <polygon fill="var(--iso-metal-front)" points={frontRect(cabinet, 0.65, b + 0.5, 0.5, 0.1)} />
          </g>
        ))}
      </Block>
      <Block {...drawer}>
        <polygon fill="var(--iso-metal-front)" points={frontRect(drawer, 0.5, 0.45, 0.5, 0.1)} />
      </Block>
      {[2.55, 2.8, 3.05].map((y, i) => (
        <g key={y}>
          <polygon fill={i === 1 ? "var(--hue)" : "var(--iso-panel-front)"} stroke="var(--iso-edge)" points={front(6.0, 7.2, y, 2.85, 3.25)} />
          <polygon fill={i === 1 ? "var(--hue)" : "var(--iso-panel-side)"} stroke="var(--iso-edge)" points={front(6.2 + i * 0.3, 6.6 + i * 0.3, y, 3.25, 3.42)} />
        </g>
      ))}
      <Block {...tablet}>
        <polygon fill="var(--iso-slot)" points={top(tablet.x + 0.25, tablet.x + tablet.w - 0.25, tablet.y + 0.25, tablet.y + tablet.d - 0.25, tablet.h)} />
        <g fill="none" stroke="var(--hue)" strokeWidth="2" strokeLinecap="round">
          <polyline points={pts([at(1.8, 5.4, 0.12), at(2.3, 4.8, 0.12), at(2.7, 5.2, 0.12), at(3.2, 4.7, 0.12)])} />
        </g>
      </Block>
      <g strokeLinecap="round">
        <line x1={n(at(3.2, 4.7, 0.12)[0])} y1={n(at(3.2, 4.7, 0.12)[1])} x2={n(at(3.9, 4.2, 1.2)[0])} y2={n(at(3.9, 4.2, 1.2)[1])} stroke="var(--iso-metal-front)" strokeWidth="5" />
        <line x1={n(at(3.2, 4.7, 0.12)[0])} y1={n(at(3.2, 4.7, 0.12)[1])} x2={n(at(3.3, 4.63, 0.27)[0])} y2={n(at(3.3, 4.63, 0.27)[1])} stroke="var(--hue)" strokeWidth="5" />
      </g>
      {[0, 1, 2, 3].map((i) => {
        const sheet: Box = { x: 5.4 + i * 0.06, y: 4.5 - i * 0.06, z: i * 0.13, w: 1.8, d: 1.3, h: 0.1, material: "panel" };
        return (
          <Block key={i} {...sheet}>
            {i === 3 && (
              <>
                <g stroke="var(--iso-ink)" strokeWidth="1.4">
                  {[0.35, 0.6, 0.85].map((dy) => (
                    <Segment key={dy} from={at(sheet.x + 0.25, sheet.y + dy, 0.49)} to={at(sheet.x + 1.4, sheet.y + dy, 0.49)} />
                  ))}
                </g>
                <polygon fill="var(--hue)" points={top(sheet.x + 1.25, sheet.x + 1.65, sheet.y + 0.1, sheet.y + 0.25, 0.49)} />
              </>
            )}
          </Block>
        );
      })}
      <Signal paths={[[at(6.3, 4.4, 0.5), at(6.6, 3.3, 2.0)]]} />
    </>
  );
}

const SCENES = [software, automation, data, infrastructure, security, documents];

export function IsoScene({ index, className }: { index: number; className?: string }) {
  const scene = SCENES[index];
  if (!scene) return null;
  return (
    <svg
      viewBox="0 0 480 360"
      aria-hidden="true"
      className={className ? `diagram iso ${className}` : "diagram iso"}
      style={{ "--hue": `var(--d${index + 1})` } as React.CSSProperties}
    >
      {scene()}
    </svg>
  );
}
