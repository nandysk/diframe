// Isometric scenes for "For organizations of every size", one per kind of organization,
// drawn with the same grid and materials as the division scenes. The places grow with
// the organization: one desk, one office, a group of towers, a public building, a network
// of sites around the world. Each card keeps its own color (--hue).

import type { ReactNode } from "react";
import {
  Block,
  Cylinder,
  Floor,
  Lines,
  Rack,
  Segment,
  Signal,
  at,
  front,
  frontRect,
  n,
  onFront,
  pts,
  side,
  top,
  type Box,
  type Point,
} from "@/components/solutions/iso-scenes";

// Windows on both visible walls of a building, lit in the card's color where `lit` says so.
function Windows({ box, rows, cols, sideCols, lit }: { box: Box; rows: number[]; cols: number; sideCols: number; lit: (row: number, col: number) => boolean }) {
  const z = box.z ?? 0;
  const fw = box.w / cols;
  const sw = box.d / sideCols;
  return (
    <>
      {rows.map((b, r) =>
        Array.from({ length: cols }, (_, c) => (
          <polygon key={`f${r}-${c}`} fill={lit(r, c) ? "var(--hue)" : "var(--iso-slot)"} opacity={lit(r, c) ? 0.9 : 1} points={frontRect(box, c * fw + fw * 0.22, b, fw * 0.56, 0.42)} />
        )),
      )}
      {rows.map((b, r) =>
        Array.from({ length: sideCols }, (_, c) => (
          <polygon
            key={`s${r}-${c}`}
            fill={lit(r + 1, c + cols) ? "var(--hue)" : "var(--iso-slot)"}
            opacity={lit(r + 1, c + cols) ? 0.75 : 0.85}
            points={side(box.x + box.w, box.y + c * sw + sw * 0.22, box.y + c * sw + sw * 0.78, z + b, z + b + 0.42)}
          />
        )),
      )}
    </>
  );
}

// A gable roof whose ridge runs from back to front: the gable faces the viewer's left, the slope the right.
function Gable({ x, y, z, w, d, rise, material = "metal" }: { x: number; y: number; z: number; w: number; d: number; rise: number; material?: "metal" | "accent" | "panel" }) {
  const ridge = x + w / 2;
  return (
    <g stroke="var(--iso-edge)" strokeLinejoin="round">
      <polygon fill="var(--iso-panel-front)" points={pts([at(x, y + d, z), at(x + w, y + d, z), at(ridge, y + d, z + rise)])} />
      <polygon fill={`var(--iso-${material}-top)`} points={pts([at(ridge, y, z + rise), at(ridge, y + d, z + rise), at(x + w, y + d, z), at(x + w, y, z)])} />
    </g>
  );
}

/* ---------- Startups and entrepreneurs: a first desk, and the steps of growth ---------- */

function startups(): ReactNode {
  const app: Box = { x: 0.6, y: 0.6, z: 2.7, w: 2.4, d: 0.1, h: 1.6, material: "panel" };
  const desk: Box = { x: 1.6, y: 3.3, w: 3.6, d: 1.9, h: 1.2, material: "panel" };
  const screen: Box = { x: 2.3, y: 3.5, z: 1.2, w: 2.0, d: 0.12, h: 1.3, material: "metal" };
  const base: Box = { x: 2.3, y: 3.62, z: 1.2, w: 2.0, d: 1.2, h: 0.1, material: "metal" };
  const steps = [0.7, 1.4, 2.1, 2.8, 3.5];
  const stepTop = (i: number): Point => at(4.6 + i * 0.85 + 0.35, 1.35, steps[i]);

  return (
    <>
      <Floor />
      <Block {...app}>
        <polygon fill="var(--hue)" points={frontRect(app, 0, app.h - 0.28, app.w, 0.28)} />
        <polygon fill="var(--iso-ink)" points={frontRect(app, 0.2, 0.2, 0.8, 0.8)} />
        <Lines box={app} a={1.2} b={1.0} widths={[0.9, 0.7, 0.9, 0.5]} />
      </Block>
      {steps.map((h, i) => (
        <Block key={h} x={4.6 + i * 0.85} y={0.9} w={0.7} d={0.9} h={h} material={i === steps.length - 1 ? "accent" : "metal"} />
      ))}
      <Signal paths={[steps.map((_, i) => stepTop(i)).map(([x, y]) => [x, y - 10] as Point)]} width={2} />
      <polyline
        points={pts([[stepTop(4)[0] - 9, stepTop(4)[1] - 15], [stepTop(4)[0], stepTop(4)[1] - 10], [stepTop(4)[0] - 2, stepTop(4)[1] - 21]])}
        fill="none"
        stroke="var(--hue)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Block {...desk} />
      <Block {...screen}>
        <polygon fill="var(--iso-slot)" points={frontRect(screen, 0.1, 0.1, screen.w - 0.2, screen.h - 0.2)} />
        {[
          [0.2, 1.0, "hue"],
          [0.45, 0.8, "ink"],
          [0.45, 1.1, "ink"],
          [0.2, 0.6, "hue"],
        ].map(([indent, w, tone], i) => (
          <g key={i} stroke={tone === "hue" ? "var(--hue)" : "var(--iso-code)"} strokeWidth="2" strokeLinecap="round">
            <Segment from={onFront(screen, 0.15 + Number(indent), 1.0 - i * 0.22)} to={onFront(screen, 0.15 + Number(indent) + Number(w), 1.0 - i * 0.22)} />
          </g>
        ))}
      </Block>
      <Block {...base}>
        {[3.9, 4.2, 4.5].map((y) =>
          Array.from({ length: 5 }, (_, i) => 2.55 + i * 0.32).map((x) => <polygon key={`${x}-${y}`} fill="var(--iso-ink)" points={top(x, x + 0.24, y, y + 0.22, 1.3)} />),
        )}
      </Block>
      <Cylinder x={4.8} y={4.6} z={1.2} r={0.2} h={0.4} material="accent" />
      <Signal paths={[[at(2.6, 3.5, 2.5), at(1.8, 0.7, 2.7)]]} />
    </>
  );
}

/* ---------- Small and medium-sized businesses: one office, its server, its workflow ---------- */

function smb(): ReactNode {
  const office: Box = { x: 0.8, y: 0.8, w: 3.4, d: 2.4, h: 2.9, material: "panel" };
  const rack: Box = { x: 5.4, y: 0.9, w: 1.1, d: 1.1, h: 2.4, material: "metal" };
  const desk: Box = { x: 1.0, y: 4.4, w: 2.8, d: 1.3, h: 1.0, material: "panel" };
  const belt: Box = { x: 4.8, y: 4.6, w: 3.8, d: 1.0, h: 0.45, material: "metal" };
  const monitors = [1.25, 2.55].map((x): Box => ({ x, y: 4.6, z: 1.0, w: 1.0, d: 0.1, h: 0.75, material: "metal" }));

  return (
    <>
      <Floor />
      <Signal
        paths={[
          [at(4.2, 2.6), at(5.95, 2.6), at(5.95, 2.0)],
          [at(6.5, 1.5), at(7.6, 1.5), at(7.6, 4.6)],
          [at(2.4, 3.2), at(2.4, 4.4)],
        ]}
      />
      <Block {...office}>
        <Windows box={office} rows={[1.7, 0.95]} cols={4} sideCols={3} lit={(r, c) => (r * 3 + c) % 4 === 1} />
        <polygon fill="var(--iso-slot)" points={frontRect(office, 2.5, 0, 0.6, 0.75)} />
      </Block>
      <Block x={0.7} y={0.7} z={2.9} w={3.6} d={2.6} h={0.18} material="metal" />
      <Block x={1.2} y={1.1} z={3.08} w={0.9} d={0.7} h={0.45} material="accent" />
      <Rack box={rack} seed={1} />
      <Block {...desk} />
      {monitors.map((box) => (
        <Block key={box.x} {...box}>
          <polygon fill="var(--hue)" opacity="0.85" points={frontRect(box, 0.07, 0.07, box.w - 0.14, box.h - 0.14)} />
          <Lines box={box} a={0.18} b={0.5} widths={[0.5, 0.35]} gap={0.16} stroke="var(--iso-screen-text)" width={1.2} />
        </Block>
      ))}
      <Block {...belt}>
        {Array.from({ length: 7 }, (_, i) => (
          <polygon key={i} fill="var(--iso-slot)" points={top(belt.x + 0.25 + i * 0.52, belt.x + 0.31 + i * 0.52, belt.y + 0.1, belt.y + belt.d - 0.1, belt.h)} />
        ))}
      </Block>
      {[5.1, 6.4, 7.7].map((x, i) => (
        <Block key={x} x={x} y={4.75} z={0.45} w={0.7} d={0.7} h={0.6} material={i === 2 ? "accent" : "panel"}>
          {i < 2 && <polygon fill="var(--iso-ink)" points={top(x + 0.28, x + 0.42, 4.75, 5.45, 1.05)} />}
        </Block>
      ))}
    </>
  );
}

/* ---------- Large companies and multinationals: several towers on one connected system ---------- */

function enterprise(): ReactNode {
  const towers: Box[] = [
    { x: 0.7, y: 0.7, w: 1.6, d: 1.6, h: 4.6, material: "metal" },
    { x: 3.0, y: 0.5, w: 1.8, d: 1.8, h: 3.6, material: "metal" },
    { x: 5.6, y: 0.9, w: 1.5, d: 1.5, h: 2.7, material: "metal" },
  ];
  const center: Box = { x: 1.8, y: 4.3, w: 4.2, d: 1.5, h: 1.0, material: "metal" };
  const annex: Box = { x: 7.2, y: 3.3, w: 1.3, d: 1.3, h: 1.8, material: "metal" };
  const roof = (box: Box): Point => at(box.x + box.w / 2, box.y + box.d / 2, box.h);
  const floors = (box: Box) => Array.from({ length: Math.floor((box.h - 0.3) / 0.45) }, (_, i) => 0.3 + i * 0.45);

  return (
    <>
      <Floor />
      <Signal
        paths={[
          [at(1.5, 2.3), at(1.5, 3.3), at(3.9, 3.3), at(3.9, 4.3)],
          [at(3.9, 2.3), at(3.9, 3.3)],
          [at(6.35, 2.4), at(6.35, 3.3), at(3.9, 3.3)],
          [at(6.0, 5.0), at(7.85, 5.0), at(7.85, 4.6)],
        ]}
      />
      {towers.map((box, i) => (
        <Block key={box.x} {...box}>
          {floors(box).map((b, r) => (
            <g key={b}>
              <polygon fill={(r + i) % 4 === 2 ? "var(--hue)" : "var(--iso-slot)"} opacity="0.9" points={frontRect(box, 0.15, b, box.w - 0.3, 0.22)} />
              <polygon fill="var(--iso-slot)" opacity="0.8" points={side(box.x + box.w, box.y + 0.15, box.y + box.d - 0.15, b, b + 0.22)} />
            </g>
          ))}
        </Block>
      ))}
      <Block x={1.3} y={1.3} z={4.6} w={0.4} d={0.4} h={0.5} material="accent" />
      <Signal
        paths={[
          [roof(towers[0]), [(roof(towers[0])[0] + roof(towers[1])[0]) / 2, roof(towers[0])[1] - 28], roof(towers[1])],
          [roof(towers[1]), [(roof(towers[1])[0] + roof(towers[2])[0]) / 2, roof(towers[1])[1] - 30], roof(towers[2])],
        ]}
        width={1.4}
      />
      {towers.map((box) => {
        const [x, y] = roof(box);
        return <circle key={box.x} cx={n(x)} cy={n(y)} r="3" fill="var(--hue)" />;
      })}
      <Block {...center}>
        {Array.from({ length: 6 }, (_, i) => (
          <g key={i}>
            <polygon fill="var(--iso-slot)" points={frontRect(center, 0.2 + i * 0.66, 0.15, 0.5, 0.7)} />
            {[0.3, 0.5, 0.7].map((b, k) => {
              const [cx, cy] = onFront(center, 0.6 + i * 0.66, b);
              return <circle key={b} cx={n(cx)} cy={n(cy)} r="1.4" fill={(i + k) % 3 === 0 ? "var(--iso-led-off)" : "var(--hue)"} className={(i + k) % 4 === 1 ? "iso-blink" : undefined} />;
            })}
          </g>
        ))}
      </Block>
      <Block {...annex}>
        <Windows box={annex} rows={[1.0, 0.4]} cols={2} sideCols={2} lit={(r, c) => (r + c) % 3 === 0} />
      </Block>
    </>
  );
}

/* ---------- Government institutions: a public building, its secured systems and its archive ---------- */

function government(): ReactNode {
  const columns = [1.75, 2.65, 3.55, 4.45, 5.35];
  const rack: Box = { x: 7.0, y: 0.9, w: 1.2, d: 1.2, h: 2.6, material: "metal" };
  const [sx, sy] = at(7.6, 1.5, 4.25);
  const crest = at(3.5, 3.95, 3.3);

  return (
    <>
      <Floor />
      <Signal
        paths={[
          [at(5.8, 2.2, 0.6), at(7.0, 2.2, 0.6)],
          [at(7.6, 2.1), at(7.6, 4.3)],
        ]}
      />
      <Block x={0.9} y={0.9} w={5.2} d={3.5} h={0.3} material="panel" />
      <Block x={1.15} y={1.15} z={0.3} w={4.7} d={3.0} h={0.3} material="panel" />
      <Block x={1.5} y={1.3} z={0.6} w={4.0} d={2.0} h={2.0} material="panel">
        <polygon fill="var(--iso-slot)" points={front(3.15, 3.85, 3.3, 0.6, 1.9)} />
      </Block>
      {columns.map((x) => (
        <Cylinder key={x} x={x} y={3.65} z={0.6} r={0.22} h={2.0} material="panel" />
      ))}
      <Block x={1.25} y={1.2} z={2.6} w={4.5} d={2.75} h={0.32} material="panel" />
      <Gable x={1.25} y={1.2} z={2.92} w={4.5} d={2.75} rise={1.0} />
      <circle cx={n(crest[0])} cy={n(crest[1])} r="7" fill="var(--hue)" stroke="var(--iso-edge)" />
      <Rack box={rack} seed={2} />
      <path
        fill="var(--hue)"
        fillOpacity="0.9"
        stroke="var(--iso-edge)"
        d={`M${n(sx)},${n(sy - 20)}L${n(sx + 15)},${n(sy - 14)}V${n(sy - 2)}C${n(sx + 15)},${n(sy + 8)} ${n(sx + 7)},${n(sy + 14)} ${n(sx)},${n(sy + 18)}C${n(sx - 7)},${n(sy + 14)} ${n(sx - 15)},${n(sy + 8)} ${n(sx - 15)},${n(sy - 2)}V${n(sy - 14)}Z`}
      />
      <polyline points={pts([[sx - 6, sy], [sx - 1, sy + 5], [sx + 7, sy - 5]])} fill="none" stroke="var(--iso-screen-text)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <Signal paths={[[at(7.6, 1.5, 2.6), [sx, sy + 20]]]} width={1.2} />
      {[0, 0.62, 1.24].map((z, i) => {
        const box: Box = { x: 6.9, y: 4.3, z, w: 1.4, d: 1.0, h: 0.58, material: "panel" };
        return (
          <Block key={z} {...box}>
            <polygon fill={i === 2 ? "var(--hue)" : "var(--iso-ink)"} points={frontRect(box, 0.45, 0.2, 0.5, 0.18)} />
          </Block>
        );
      })}
    </>
  );
}

/* ---------- NGOs and international organizations: sites around the world, one shared dashboard ---------- */

function ngo(): ReactNode {
  const [gx, gy] = at(3.4, 2.4, 3.2);
  const gr = 46;
  const sites = [
    { x: 6.6, y: 0.8 },
    { x: 0.5, y: 4.4 },
    { x: 7.0, y: 4.5 },
  ];
  const board: Box = { x: 3.0, y: 5.2, w: 2.8, d: 0.12, h: 1.6, material: "panel" };
  const pins: Point[] = [
    [gx - 18, gy - 16],
    [gx + 20, gy - 4],
    [gx - 4, gy + 22],
  ];

  const site = ({ x, y }: { x: number; y: number }, i: number) => (
    <g key={x}>
      <Block x={x} y={y} w={1.3} d={1.1} h={0.9} material="panel">
        <polygon fill={i === 0 ? "var(--hue)" : "var(--iso-slot)"} points={front(x + 0.45, x + 0.85, y + 1.1, 0, 0.6)} />
      </Block>
      <Gable x={x} y={y} z={0.9} w={1.3} d={1.1} rise={0.55} material={i === 0 ? "accent" : "metal"} />
    </g>
  );

  return (
    <>
      <Floor />
      <Signal
        paths={[
          [pins[1], at(7.25, 1.35, 1.45)],
          [pins[0], at(1.15, 4.95, 1.45)],
          [pins[2], at(7.65, 5.05, 1.45)],
          [at(3.4, 2.4, 0.25), at(4.4, 5.2)],
        ]}
        width={1.3}
      />
      {site(sites[0], 0)}
      <Cylinder x={3.4} y={2.4} r={0.6} h={0.25} />
      <Block x={3.3} y={2.3} z={0.25} w={0.2} d={0.2} h={1.1} material="metal" />
      <circle cx={n(gx)} cy={n(gy)} r={gr} fill="var(--iso-floor-top)" stroke="var(--hue)" strokeWidth="1.6" />
      <circle cx={n(gx)} cy={n(gy)} r={gr} fill="var(--hue)" fillOpacity="0.12" />
      <g fill="none" stroke="var(--hue)" strokeOpacity="0.55" strokeWidth="1.1">
        <ellipse cx={n(gx)} cy={n(gy)} rx={gr} ry={gr * 0.28} />
        <ellipse cx={n(gx)} cy={n(gy - gr * 0.5)} rx={gr * 0.86} ry={gr * 0.22} />
        <ellipse cx={n(gx)} cy={n(gy + gr * 0.5)} rx={gr * 0.86} ry={gr * 0.22} />
        <ellipse cx={n(gx)} cy={n(gy)} rx={gr * 0.42} ry={gr} />
        <line x1={n(gx)} y1={n(gy - gr)} x2={n(gx)} y2={n(gy + gr)} />
      </g>
      <path fill="none" stroke="var(--iso-metal-top)" strokeWidth="3" strokeLinecap="round" d={`M${n(gx - gr * 0.5)},${n(gy + gr * 1.02)}A${gr + 6},${gr + 6} 0 0 0 ${n(gx + gr * 0.62)},${n(gy - gr * 0.92)}`} />
      {pins.map(([x, y]) => (
        <circle key={x} cx={n(x)} cy={n(y)} r="3.4" fill="var(--hue)" stroke="var(--iso-screen-text)" strokeWidth="1" />
      ))}
      {site(sites[1], 1)}
      <Block {...board}>
        <polygon fill="var(--hue)" points={frontRect(board, 0, board.h - 0.24, board.w, 0.24)} />
        {[0.45, 0.75, 0.6, 1.0].map((h, i) => (
          <polygon key={i} fill={i === 3 ? "var(--hue)" : "var(--iso-ink)"} points={frontRect(board, 0.25 + i * 0.32, 0.2, 0.2, h)} />
        ))}
        <Lines box={board} a={1.75} b={1.05} widths={[0.8, 0.6, 0.75]} gap={0.24} />
      </Block>
      {site(sites[2], 2)}
    </>
  );
}

const SCENES: Record<string, () => ReactNode> = { startups, smb, enterprise, government, ngo };

export function AudienceScene({ kind, index }: { kind: string; index: number }) {
  const scene = SCENES[kind];
  if (!scene) return null;
  return (
    <svg viewBox="60 22 370 324" aria-hidden="true" className="diagram iso mx-auto max-w-[26rem]" style={{ "--hue": `var(--d${index + 1})` } as React.CSSProperties}>
      {scene()}
    </svg>
  );
}
