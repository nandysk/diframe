// Isometric scenes for the three projects, drawn with the same grid and materials as
// the division and audience scenes. Each one shows what changed for the client.
// The project's color (--hue) marks what is live: screens, links, results.

import type { ReactNode } from "react";
import { Gable, Windows } from "@/components/home/audience-scenes";
import {
  Block,
  Cylinder,
  Floor,
  Lines,
  RX,
  RY,
  Segment,
  Signal,
  at,
  frontRect,
  n,
  onFront,
  pts,
  top,
  type Box,
  type Point,
} from "@/components/solutions/iso-scenes";

const COLORS: Record<string, string> = { visa: "var(--d1)", hr: "var(--d3)", expat: "var(--d6)" };

// A check mark centered on a point, in screen units.
function Check({ at: [x, y], size = 5, color = "var(--iso-screen-text)" }: { at: Point; size?: number; color?: string }) {
  return (
    <polyline
      points={pts([[x - size, y], [x - size * 0.3, y + size * 0.7], [x + size, y - size * 0.7]])}
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

// A small person: a round body with a head, used for teams and employees.
function Person({ x, y, lead = false }: { x: number; y: number; lead?: boolean }) {
  const [hx, hy] = at(x, y, 1.18);
  return (
    <g>
      <Cylinder x={x} y={y} r={0.32} h={0.82} material={lead ? "accent" : "metal"} />
      <circle cx={n(hx)} cy={n(hy)} r="7.5" fill={lead ? "var(--iso-accent-top)" : "var(--iso-metal-top)"} stroke="var(--iso-edge)" />
    </g>
  );
}

// A map pin standing on a point, in screen units.
function Pin({ at: [x, y] }: { at: Point }) {
  return (
    <g>
      <path
        fill="var(--hue)"
        stroke="var(--iso-edge)"
        d={`M${n(x)},${n(y)}C${n(x - 3)},${n(y - 8)} ${n(x - 9)},${n(y - 12)} ${n(x - 9)},${n(y - 19)}A9,9 0 1 1 ${n(x + 9)},${n(y - 19)}C${n(x + 9)},${n(y - 12)} ${n(x + 3)},${n(y - 8)} ${n(x)},${n(y)}Z`}
      />
      <circle cx={n(x)} cy={n(y - 19)} r="3.4" fill="var(--iso-screen-text)" />
    </g>
  );
}

/* ---------- Online visa portal: paper files replaced by one portal, ending in an approval ---------- */

function visa(): ReactNode {
  const screen: Box = { x: 2.4, y: 1.9, z: 0.9, w: 3.8, d: 0.14, h: 2.6, material: "metal" };
  const passport: Box = { x: 5.5, y: 4.3, w: 1.4, d: 1.9, h: 0.16, material: "accent" };
  const steps = [0.6, 1.4, 2.2, 3.0];
  const [ex, ey] = at(passport.x + 0.7, passport.y + 0.75, passport.h);
  const stampMark = at(7.6, 4.9);

  return (
    <>
      <Floor />
      <Signal
        paths={[
          [at(1.3, 3.9, 0.45), at(1.3, 2.9), at(3.0, 2.9), at(3.0, 2.04, 0.9)],
          [at(5.6, 2.04, 0.9), at(5.6, 3.4), at(6.2, 3.4), at(6.2, 4.3)],
        ]}
      />
      <Block x={3.7} y={1.2} w={1.2} d={0.8} h={0.1} material="metal" />
      <Block x={4.15} y={1.6} w={0.3} d={0.15} h={0.9} material="metal" />
      <Block {...screen}>
        <polygon fill="var(--iso-slot)" points={frontRect(screen, 0.1, 0.1, screen.w - 0.2, screen.h - 0.2)} />
        <polygon fill="var(--hue)" points={frontRect(screen, 0.1, screen.h - 0.4, screen.w - 0.2, 0.3)} />
        <g stroke="var(--hue)" strokeWidth="2">
          <Segment from={onFront(screen, steps[0], 1.75)} to={onFront(screen, steps[2], 1.75)} />
        </g>
        <g stroke="var(--iso-code)" strokeWidth="2">
          <Segment from={onFront(screen, steps[2], 1.75)} to={onFront(screen, steps[3], 1.75)} />
        </g>
        {steps.map((a, i) => {
          const point = onFront(screen, a, 1.75);
          return (
            <g key={a}>
              <circle cx={n(point[0])} cy={n(point[1])} r="7" fill={i < 3 ? "var(--hue)" : "var(--iso-slot)"} stroke={i < 3 ? "none" : "var(--iso-code)"} strokeWidth="1.6" />
              {i < 3 && <Check at={point} size={3.2} />}
            </g>
          );
        })}
        <Lines box={screen} a={0.4} b={1.1} widths={[1.5, 1.1, 1.3, 0.8]} gap={0.22} stroke="var(--iso-code)" width={2} />
        <polygon fill="var(--iso-ink)" points={frontRect(screen, 2.5, 0.35, 0.9, 0.95)} />
        <circle cx={n(onFront(screen, 2.95, 0.95)[0])} cy={n(onFront(screen, 2.95, 0.95)[1])} r="6" fill="var(--iso-code)" />
      </Block>
      {[0, 1, 2, 3, 4].map((i) => {
        const sheet: Box = { x: 0.5 + i * 0.05, y: 3.9 - i * 0.04, z: i * 0.09, w: 1.6, d: 1.15, h: 0.07, material: "panel" };
        return (
          <Block key={i} {...sheet}>
            {i === 4 && (
              <g stroke="var(--iso-ink)" strokeWidth="1.4">
                {[0.3, 0.55, 0.8].map((dy) => (
                  <Segment key={dy} from={at(sheet.x + 0.2, sheet.y + dy, 0.43)} to={at(sheet.x + 1.3, sheet.y + dy, 0.43)} />
                ))}
              </g>
            )}
          </Block>
        );
      })}
      <Block {...passport}>
        <ellipse cx={n(ex)} cy={n(ey)} rx={n(RX * 0.38)} ry={n(RY * 0.38)} fill="none" stroke="var(--iso-screen-text)" strokeWidth="1.5" />
        <g stroke="var(--iso-screen-text)" strokeWidth="1.5" strokeLinecap="round" opacity="0.8">
          <Segment from={at(passport.x + 0.35, passport.y + 1.35, passport.h)} to={at(passport.x + 1.05, passport.y + 1.35, passport.h)} />
          <Segment from={at(passport.x + 0.45, passport.y + 1.6, passport.h)} to={at(passport.x + 0.95, passport.y + 1.6, passport.h)} />
        </g>
      </Block>
      <ellipse cx={n(stampMark[0])} cy={n(stampMark[1])} rx={n(RX * 0.5)} ry={n(RY * 0.5)} fill="none" stroke="var(--hue)" strokeWidth="2" />
      <Check at={stampMark} size={5} color="var(--hue)" />
      <Cylinder x={7.7} y={3.0} r={0.5} h={0.3} material="accent" />
      <Cylinder x={7.7} y={3.0} z={0.3} r={0.16} h={0.7} />
      <Cylinder x={7.7} y={3.0} z={1.0} r={0.32} h={0.22} />
    </>
  );
}

/* ---------- HR management software: the team, its records and its calendar in one system ---------- */

function hr(): ReactNode {
  const screen: Box = { x: 0.5, y: 1.45, z: 0.8, w: 3.4, d: 0.14, h: 2.4, material: "metal" };
  const calendar: Box = { x: 5.0, y: 0.8, w: 2.4, d: 0.3, h: 2.6, material: "panel" };
  const lead = { x: 4.4, y: 3.9 };
  const team = [
    { x: 2.6, y: 5.6 },
    { x: 4.6, y: 5.9 },
    { x: 6.6, y: 5.4 },
  ];
  const off = new Set([6, 7, 13]);

  return (
    <>
      <Floor />
      <Signal
        paths={[
          ...team.map(({ x, y }) => [at(lead.x, lead.y), at(lead.x, 4.9), at(x, 4.9), at(x, y)]),
          [at(2.2, 1.59, 0.8), at(2.2, 2.6), at(4.4, 2.6), at(lead.x, lead.y)],
          [at(6.2, 1.1), at(6.2, 2.6), at(4.4, 2.6)],
        ]}
      />
      <Block x={1.6} y={1.0} w={1.2} d={0.7} h={0.1} material="metal" />
      <Block x={2.05} y={1.3} w={0.3} d={0.15} h={0.8} material="metal" />
      <Block {...screen}>
        <polygon fill="var(--iso-slot)" points={frontRect(screen, 0.1, 0.1, screen.w - 0.2, screen.h - 0.2)} />
        <polygon fill="var(--hue)" points={frontRect(screen, 0.1, screen.h - 0.38, screen.w - 0.2, 0.28)} />
        <polygon fill="var(--hue)" opacity="0.3" points={frontRect(screen, 0.2, 1.08, screen.w - 0.4, 0.38)} />
        {[1.55, 1.27, 0.99, 0.71, 0.43].map((b, i) => {
          const [cx, cy] = onFront(screen, 0.45, b - 0.02);
          return (
            <g key={b}>
              <circle cx={n(cx)} cy={n(cy)} r="4.5" fill={i === 1 ? "var(--hue)" : "var(--iso-code)"} />
              <g stroke={i === 1 ? "var(--iso-screen-text)" : "var(--iso-code)"} strokeWidth="1.8" strokeLinecap="round">
                <Segment from={onFront(screen, 0.75, b)} to={onFront(screen, 1.85 - (i % 2) * 0.35, b)} />
                <Segment from={onFront(screen, 2.3, b)} to={onFront(screen, 2.95, b)} />
              </g>
            </g>
          );
        })}
      </Block>
      <Block {...calendar}>
        <polygon fill="var(--hue)" points={frontRect(calendar, 0, calendar.h - 0.45, calendar.w, 0.45)} />
        {Array.from({ length: 20 }, (_, i) => {
          const col = i % 5;
          const row = Math.floor(i / 5);
          return (
            <polygon
              key={i}
              fill={off.has(i) ? "var(--hue)" : "var(--iso-ink)"}
              points={frontRect(calendar, 0.2 + col * 0.42, 1.65 - row * 0.42, 0.3, 0.3)}
            />
          );
        })}
      </Block>
      <Person x={team[0].x} y={team[0].y} />
      <Person x={lead.x} y={lead.y} lead />
      <Person x={team[1].x} y={team[1].y} />
      <Person x={team[2].x} y={team[2].y} />
    </>
  );
}

/* ---------- Expatriation management system: one move, followed from origin to destination ---------- */

function expat(): ReactNode {
  const origin: Box = { x: 0.6, y: 0.7, w: 1.8, d: 1.6, h: 2.6, material: "panel" };
  const destination: Box = { x: 6.5, y: 3.7, w: 1.8, d: 1.6, h: 2.0, material: "panel" };
  const list: Box = { x: 3.4, y: 1.4, w: 2.4, d: 0.12, h: 1.9, material: "panel" };
  const suitcase: Box = { x: 2.5, y: 4.4, w: 1.5, d: 0.7, h: 1.1, material: "accent" };
  const from = at(origin.x + 0.9, origin.y + 0.8, origin.h + 0.75);
  const to = at(destination.x + 0.9, destination.y + 0.8, destination.h + 0.55);
  const lift = 120;
  const arc: Point[] = Array.from({ length: 25 }, (_, i) => {
    const t = i / 24;
    return [from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t - Math.sin(Math.PI * t) * lift];
  });
  const plane = arc[14];
  const handle: Point[] = [
    at(suitcase.x + 0.45, suitcase.y + 0.35, suitcase.h),
    at(suitcase.x + 0.45, suitcase.y + 0.35, suitcase.h + 0.35),
    at(suitcase.x + 1.05, suitcase.y + 0.35, suitcase.h + 0.35),
    at(suitcase.x + 1.05, suitcase.y + 0.35, suitcase.h),
  ];

  return (
    <>
      <Floor />
      <Block {...origin}>
        <Windows box={origin} rows={[1.8, 1.1, 0.4]} cols={2} sideCols={2} lit={(r, c) => (r + c) % 3 === 1} />
      </Block>
      <Block {...list}>
        <polygon fill="var(--hue)" points={frontRect(list, 0, list.h - 0.3, list.w, 0.3)} />
        {[1.2, 0.8, 0.4].map((b, i) => {
          const done = i < 2;
          const box = frontRect(list, 0.25, b - 0.12, 0.26, 0.26);
          const [cx, cy] = onFront(list, 0.38, b + 0.01);
          return (
            <g key={b}>
              <polygon fill={done ? "var(--hue)" : "none"} stroke={done ? "none" : "var(--iso-ink)"} strokeWidth="1.5" points={box} />
              {done && <Check at={[cx, cy]} size={3} />}
              <g stroke="var(--iso-ink)" strokeWidth="1.8" strokeLinecap="round">
                <Segment from={onFront(list, 0.7, b)} to={onFront(list, 1.9 - i * 0.3, b)} />
              </g>
            </g>
          );
        })}
      </Block>
      <Block {...suitcase}>
        {[0.35, 1.05].map((a) => (
          <polygon key={a} fill="var(--iso-accent-top)" opacity="0.7" points={frontRect(suitcase, a, 0.05, 0.12, suitcase.h - 0.1)} />
        ))}
      </Block>
      <polyline points={pts(handle)} fill="none" stroke="var(--iso-metal-front)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <Block x={4.5} y={5.3} w={0.9} d={1.2} h={0.1} material="metal">
        <polygon fill="var(--hue)" points={top(4.65, 5.25, 5.5, 5.7, 0.1)} />
      </Block>
      <Block {...destination}>
        <Windows box={destination} rows={[1.2, 0.5]} cols={2} sideCols={2} lit={(r, c) => (r + c) % 2 === 0} />
      </Block>
      <Gable x={destination.x} y={destination.y} z={destination.h} w={destination.w} d={destination.d} rise={0.55} />
      <Signal paths={[arc]} width={1.8} />
      <Pin at={at(origin.x + 0.9, origin.y + 0.8, origin.h)} />
      <Pin at={at(destination.x + 0.9, destination.y + 0.8, destination.h + 0.28)} />
      <circle cx={n(plane[0])} cy={n(plane[1])} r="5" fill="var(--hue)" stroke="var(--iso-screen-text)" strokeWidth="1.5" />
    </>
  );
}

const SCENES: Record<string, () => ReactNode> = { visa, hr, expat };

export function ProjectScene({ kind }: { kind: string }) {
  const scene = SCENES[kind];
  if (!scene) return null;
  return (
    <svg viewBox="50 10 390 336" aria-hidden="true" className="diagram iso mx-auto max-w-[30rem]" style={{ "--hue": COLORS[kind] } as React.CSSProperties}>
      {scene()}
    </svg>
  );
}
