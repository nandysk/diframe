"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { IsoScene } from "@/components/solutions/iso-scenes";
import { isLowPower } from "@/lib/low-power";

// A network globe with the six division illustrations circling it, and faint data
// points drifting in from the open space. At rest everything is white and gray.
// Color appears where a signal is active: once on load, when each division lights
// up in turn, and when a division is chosen, which brings its island to the front
// and turns the globe to its region.
//
// On a division page (`focus`), that division stays chosen: the globe faces its region
// and only its own island shows, large at the front. The
// page marks where the drawing goes with a `data-globe-anchor` element.

type RGB = readonly [number, number, number];
type Vec = [number, number, number];
type Frame = { x: number; y: number; r: number };

const COLORS: ReadonlyArray<RGB> = [
  [25, 193, 239],
  [43, 146, 242],
  [110, 123, 255],
  [154, 64, 248],
  [192, 75, 247],
  [249, 91, 246],
];
const HEX = ["#19C1EF", "#2B92F2", "#6E7BFF", "#9A40F8", "#C04BF7", "#F95BF6"];
const WHITE: RGB = [255, 255, 255];
const RESTING_GLOW: RGB = [120, 110, 255];
const ISLAND_GRAY = "#8b8e98";
const BOOT_STEP = 0.42;
// How large a division page's own island is, relative to the globe frame.
const FOCUS_SCALE = 1.35;
const TAU = Math.PI * 2;
// Each division's region on the globe, as [longitude, latitude] in degrees.
const REGIONS = [[0, 22], [62, -18], [124, 30], [186, -24], [246, 16], [306, -30]] as const;
// The middle of an island's floor, as a share of the illustration's width and height.
const ISLAND_ANCHOR = [0.507, 0.645] as const;

const rgba = (c: RGB, a: number) => `rgba(${c[0]},${c[1]},${c[2]},${Math.max(0, Math.min(1, a)).toFixed(3)})`;
const rotY = ([x, y, z]: Vec, a: number): Vec => [x * Math.cos(a) + z * Math.sin(a), y, -x * Math.sin(a) + z * Math.cos(a)];
const rotX = ([x, y, z]: Vec, a: number): Vec => [x, y * Math.cos(a) - z * Math.sin(a), y * Math.sin(a) + z * Math.cos(a)];
const project = ([x, y, z]: Vec, f: Frame): Vec => {
  const s = 3.4 / (3.4 - z);
  return [f.x + x * f.r * s, f.y + y * f.r * s, (z + 1) / 2];
};
// The shortest turn from one angle to another, between -π and π.
const turn = (from: number, to: number) => ((((to - from) % TAU) + TAU * 1.5) % TAU) - Math.PI;

// Points spread evenly over a sphere, each linked to its nearest neighbours.
function buildGlobe(count: number) {
  const points: Vec[] = Array.from({ length: count }, (_, i) => {
    const y = 1 - (2 * (i + 0.5)) / count;
    const r = Math.sqrt(1 - y * y);
    const t = i * 2.399963;
    return [Math.cos(t) * r, y, Math.sin(t) * r];
  });
  const hubs: Vec[] = REGIONS.map(([lon, lat]) => {
    const l = (lon * Math.PI) / 180, b = (lat * Math.PI) / 180;
    return [Math.cos(b) * Math.sin(l), -Math.sin(b), Math.cos(b) * Math.cos(l)];
  });
  const region = points.map((p) => {
    let best = -1, closest = 0.82;
    hubs.forEach((h, k) => {
      const dot = p[0] * h[0] + p[1] * h[1] + p[2] * h[2];
      if (dot > closest) { closest = dot; best = k; }
    });
    return best;
  });
  const edges: Array<[number, number]> = [];
  const seen = new Set<string>();
  points.forEach((p, i) => {
    points
      .map((q, j) => [Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]), j] as const)
      .filter(([, j]) => j !== i)
      .sort((a, b) => a[0] - b[0])
      .slice(0, 3)
      .forEach(([distance, j]) => {
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (distance < 0.3 && !seen.has(key)) { seen.add(key); edges.push([i, j]); }
      });
  });
  return { points, hubs, region, edges };
}

// A point on the great circle between two hubs, lifted above the surface mid-way.
function arcPoint(a: Vec, b: Vec, u: number): Vec {
  const dot = Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
  const angle = Math.acos(dot), s = Math.sin(angle) || 1;
  const ka = Math.sin((1 - u) * angle) / s, kb = Math.sin(u * angle) / s;
  const lift = 1 + Math.sin(Math.PI * u) * 0.28;
  return [(a[0] * ka + b[0] * kb) * lift, (a[1] * ka + b[1] * kb) * lift, (a[2] * ka + b[2] * kb) * lift];
}

// The illustration as a standalone SVG, with the page's color tokens written in, so
// it can be drawn on the canvas. `hue` replaces the division color.
function standalone(svg: SVGSVGElement, hue: string) {
  svg.style.setProperty("--hue", hue);
  const clone = svg.cloneNode(true) as SVGSVGElement;
  const source = [svg, ...svg.querySelectorAll("*")];
  const target = [clone, ...clone.querySelectorAll("*")];
  source.forEach((el, i) => {
    const style = getComputedStyle(el);
    const copy = target[i];
    for (const attr of ["fill", "stroke"]) {
      if (copy.getAttribute(attr)?.includes("var(")) copy.setAttribute(attr, style.getPropertyValue(attr));
    }
    copy.removeAttribute("class");
    copy.removeAttribute("style");
  });
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clone.setAttribute("width", "480");
  clone.setAttribute("height", "360");
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(clone.outerHTML)}`;
}

export function HeroNetwork({
  chips,
  label,
  focus,
}: {
  chips?: ReadonlyArray<{ label: string; href: string }>;
  label?: string;
  focus?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scenesRef = useRef<HTMLDivElement>(null);
  const setActiveRef = useRef<(index: number) => void>(() => {});

  useEffect(() => {
    const canvas = canvasRef.current;
    const scenes = scenesRef.current;
    const host = canvas?.closest("section");
    const ctx = canvas?.getContext("2d");
    if (!canvas || !scenes || !host || !ctx) return;

    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    const lowPower = isLowPower();
    const still = () => reduce.matches || lowPower;

    let W = 0, H = 0, dpr = 1, wide = true, raf = 0, last = 0, clock = 0, visible = true;
    let active = focus ?? -1;
    const focused = focus !== undefined;
    let center: Frame = { x: 0, y: 0, r: 0 };
    let mouse: { x: number; y: number } | null = null;
    let text: { l: number; r: number; t: number; b: number } | null = null;

    const globe = buildGlobe(380);
    let spin = 0.3, orbit = 0;
    let levels = COLORS.map(() => 0);
    let pulses: Array<{ a: number; b: number; t: number; v: number }> = [];

    /* Islands: each illustration is drawn once to its own small canvas, in gray and in
       color, at the largest size it appears. Drawing those is much cheaper than an SVG. */
    const sources = [...scenes.querySelectorAll<SVGSVGElement>("svg")].map((svg, k) => ({
      gray: standalone(svg, ISLAND_GRAY),
      color: standalone(svg, `var(--d${k + 1})`),
    }));
    const islands: Array<{ gray: HTMLCanvasElement; color: HTMLCanvasElement } | null> = sources.map(() => null);
    let islandWidth = 0;
    let rasterRun = 0;
    const rasterize = (width: number) => {
      const run = ++rasterRun;
      islandWidth = width;
      const px = Math.ceil(width * dpr);
      sources.forEach((source, k) => {
        const pair = { gray: document.createElement("canvas"), color: document.createElement("canvas") };
        let pending = 2;
        (["gray", "color"] as const).forEach((variant) => {
          const img = new Image();
          img.onload = () => {
            if (run !== rasterRun) return;
            const target = pair[variant];
            target.width = px;
            target.height = Math.ceil(px * 0.75);
            target.getContext("2d")?.drawImage(img, 0, 0, target.width, target.height);
            if (--pending === 0) {
              islands[k] = pair;
              if (still()) start();
            }
          };
          img.src = source[variant];
        });
      });
    };

    const drawIsland = (k: number, x: number, y: number, width: number, on: number, alpha: number) => {
      const pair = islands[k];
      if (!pair) return;
      const height = width * 0.75;
      const left = x - width * ISLAND_ANCHOR[0], top = y - height * ISLAND_ANCHOR[1];
      ctx.globalAlpha = alpha * (1 - on);
      if (on < 0.995) ctx.drawImage(pair.gray, left, top, width, height);
      if (on > 0.005) {
        ctx.globalAlpha = alpha * on;
        ctx.drawImage(pair.color, left, top, width, height);
      }
      ctx.globalAlpha = 1;
    };

    /* Background particles drift in from the open space toward the globe. They stay
       quieter behind the text, so the headline keeps its contrast. */
    type Particle = { x: number; y: number; depth: number; phase: number; speed: number; pick: number; size: number };
    let particles: Particle[] = [];
    const particle = (anywhere: boolean): Particle => {
      const depth = 0.3 + Math.random() * 0.7;
      return {
        x: anywhere ? Math.random() * W : -10 - Math.random() * 40,
        y: Math.random() * H,
        depth,
        phase: Math.random() * TAU,
        speed: (wide ? 10 : 7) + depth * (wide ? 18 : 12),
        pick: Math.random(),
        size: 0.5 + depth * 1.3,
      };
    };

    const mouseGlow = (x: number, y: number, radius = 170) => {
      if (!mouse) return 0;
      const d = Math.hypot(x - mouse.x, y - mouse.y);
      return d < radius ? 1 - d / radius : 0;
    };

    const sizeIslands = () => {
      const largest = Math.ceil(center.r * (focused ? FOCUS_SCALE : 1.05));
      if (Math.abs(largest - islandWidth) > 8) rasterize(largest);
    };

    const measureText = () => {
      const rect = host.getBoundingClientRect();
      const block = host.querySelector("h1")?.parentElement?.getBoundingClientRect();
      text = block
        ? { l: block.left - rect.left - 24, r: block.right - rect.left + 24, t: block.top - rect.top - 24, b: block.bottom - rect.top + 24 }
        : null;
    };

    // Desktop: to the right of the text. Phones: in the open space above the headline,
    // or behind the division links when that space is too small.
    const place = () => {
      const anchor = host.querySelector("[data-globe-anchor]")?.getBoundingClientRect();
      if (anchor && anchor.width) {
        const rect = host.getBoundingClientRect();
        center = {
          x: anchor.left - rect.left + anchor.width / 2,
          y: anchor.top - rect.top + anchor.height * 0.36,
          r: Math.min(anchor.width / 2.2, anchor.height / 1.95),
        };
        return;
      }
      if (wide) {
        center = { x: W * 0.73, y: H * 0.48, r: Math.min(W * 0.165, H * 0.29) };
        return;
      }
      const top = 76, room = (text?.t ?? 0) + 24 - top;
      const r = Math.min(W * 0.27, room / 2.1);
      center = r >= 60
        ? { x: W * 0.5, y: top + room * 0.52, r }
        : { x: W * 0.5, y: H * 0.8, r: Math.min(W * 0.27, H * 0.12) };
    };

    const measure = () => {
      const rect = host.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = rect.width;
      H = rect.height;
      if (!W || !H) return;
      wide = W >= 1024;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      measureText();
      place();
      const count = Math.round(Math.min(170, (W * H) / (wide ? 6200 : 5600)));
      particles = Array.from({ length: count }, () => particle(true));
      sizeIslands();
    };

    const paint = (dt: number, lit: number, moving: boolean) => {
      ctx.clearRect(0, 0, W, H);
      const ease = moving ? Math.min(1, dt * 6) : 1;
      levels = levels.map((v, k) => v + ((k === lit ? 1 : 0) - v) * ease);

      // Background particles.
      const boost = lit >= 0 ? 1.8 : 1;
      const drawn = particles.map((p) => {
        if (moving) {
          const pull = (center.y - p.y) * 0.08 * Math.min(1, Math.max(0, (p.x - W * 0.35) / (W * 0.3)));
          p.x += p.speed * boost * dt;
          p.y += (Math.sin(clock * 0.6 + p.phase + p.x * 0.004) * 6 * p.depth + pull) * dt;
          if (p.x > W + 10 || Math.hypot(p.x - center.x, p.y - center.y) < center.r * 0.85) Object.assign(p, particle(false));
        }
        let { x, y } = p;
        const glow = mouseGlow(x, y, 130);
        if (glow > 0 && mouse) {
          const d = Math.hypot(x - mouse.x, y - mouse.y) || 1;
          x += ((x - mouse.x) / d) * glow * 14;
          y += ((y - mouse.y) / d) * glow * 14;
        }
        const behindText = text !== null && x > text.l && x < text.r && y > text.t && y < text.b;
        const fadeIn = Math.min(1, p.x / 80);
        const nearGlobe = Math.min(1, Math.hypot(x - center.x, y - center.y) / (center.r * 1.3));
        const alpha = (0.12 + 0.42 * p.depth) * fadeIn * (0.35 + 0.65 * nearGlobe) * (behindText ? 0.3 : 1);
        return { x, y, alpha, glow, colored: lit >= 0 && p.pick < 0.4, size: p.size };
      });
      ctx.lineWidth = 1;
      for (let i = 0; i < drawn.length; i++) {
        for (let j = i + 1; j < drawn.length; j++) {
          const a = drawn[i], b = drawn[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d >= 74) continue;
          const both = a.colored && b.colored;
          ctx.strokeStyle = rgba(both ? COLORS[lit] : WHITE, (1 - d / 74) * Math.min(a.alpha, b.alpha) * (both ? 0.7 : 0.35));
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
      for (const q of drawn) {
        ctx.fillStyle = rgba(q.colored ? COLORS[lit] : WHITE, q.alpha + q.glow * 0.4 + (q.colored ? 0.15 : 0));
        ctx.beginPath();
        ctx.arc(q.x, q.y, q.size + (q.colored ? 0.4 : 0), 0, TAU);
        ctx.fill();
      }

      // Light behind the globe, in the active division's color.
      const halo = ctx.createRadialGradient(center.x, center.y, center.r * 0.2, center.x, center.y, center.r * 1.6);
      const haloColor = lit >= 0 ? COLORS[lit] : RESTING_GLOW;
      halo.addColorStop(0, rgba(haloColor, 0.1));
      halo.addColorStop(0.5, rgba(haloColor, 0.04));
      halo.addColorStop(1, rgba(haloColor, 0));
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, W, H);

      // The islands' orbit: a chosen division swings to the front.
      if (focused) {
        // The globe sways gently around the division's region.
        spin = (-REGIONS[active][0] * Math.PI) / 180 + Math.sin(clock * 0.25) * 0.35;
      } else if (active >= 0) {
        const target = Math.PI / 2 - (active * Math.PI) / 3;
        orbit = moving ? orbit + turn(orbit, target) * Math.min(1, dt * 3) : target;
        const facing = (-REGIONS[active][0] * Math.PI) / 180;
        spin = moving ? spin + turn(spin, facing) * Math.min(1, dt * 3) : facing;
      } else if (moving) {
        orbit += dt * 0.1;
        spin += dt * 0.12;
      }
      const [rx, ry] = [center.r * 1.18, center.r * 0.58];
      const ringY = center.y + center.r * 0.12;
      // A division page shows only its own island, so the orbit stays empty there.
      const ring = focused ? [] : COLORS.map((_, k) => k);
      const slots = ring.map((k, n) => {
        const angle = orbit + (n * TAU) / ring.length;
        const depth = (Math.sin(angle) + 1) / 2;
        return { k, x: center.x + Math.cos(angle) * rx, y: ringY + Math.sin(angle) * ry, depth, scale: 0.6 + 0.45 * depth };
      });
      // An island fades where it passes behind the text.
      const behindText = (x: number, y: number, width: number) => {
        if (!text) return 0;
        const left = x - width * ISLAND_ANCHOR[0], top = y - width * 0.75 * ISLAND_ANCHOR[1];
        const across = Math.max(0, Math.min(left + width, text.r) - Math.max(left, text.l));
        const down = Math.max(0, Math.min(top + width * 0.75, text.b) - Math.max(top, text.t));
        return (across * down) / (width * width * 0.75);
      };
      const islandAt = (s: (typeof slots)[number]) => {
        const width = center.r * s.scale;
        const alpha = (0.35 + 0.65 * s.depth) * (lit >= 0 && lit !== s.k ? 0.6 : 1) * (1 - 0.85 * Math.min(1, behindText(s.x, s.y, width) * 2));
        drawIsland(s.k, s.x, s.y, width, levels[s.k], alpha);
      };

      if (!focused) {
        ctx.strokeStyle = rgba(WHITE, 0.12);
        ctx.setLineDash([2, 6]);
        ctx.beginPath();
        ctx.ellipse(center.x, ringY, rx, ry, 0, 0, TAU);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      const byDepth = slots.slice().sort((a, b) => a.depth - b.depth);
      byDepth.filter((s) => s.depth < 0.5).forEach(islandAt);

      // The globe.
      const [tiltX, tiltY] = mouse ? [(mouse.y / H - 0.5) * 0.35, (mouse.x / W - 0.5) * 0.35] : [0, 0];
      const view = (p: Vec) => rotX(rotY(p, spin + tiltY), -0.32 + tiltX);
      const frame: Frame = { x: center.x, y: center.y, r: center.r * 0.55 };
      const points = globe.points.map((p) => project(view(p), frame));
      for (const [i, j] of globe.edges) {
        const a = points[i], b = points[j], d = (a[2] + b[2]) / 2;
        const region = globe.region[i];
        const on = lit >= 0 && region === lit && globe.region[j] === lit;
        const glow = Math.max(mouseGlow(a[0], a[1]), mouseGlow(b[0], b[1]));
        const color = on ? COLORS[lit] : glow > 0.05 && region >= 0 ? COLORS[region] : WHITE;
        ctx.strokeStyle = rgba(color, on ? 0.12 + 0.6 * d * d : 0.02 + 0.16 * d * d + glow * 0.3);
        ctx.beginPath();
        ctx.moveTo(a[0], a[1]);
        ctx.lineTo(b[0], b[1]);
        ctx.stroke();
      }
      points.forEach(([x, y, d], i) => {
        const region = globe.region[i];
        const on = lit >= 0 && region === lit;
        const glow = mouseGlow(x, y);
        const color = on ? COLORS[lit] : glow > 0.05 && region >= 0 ? COLORS[region] : WHITE;
        ctx.fillStyle = rgba(color, on ? 0.25 + 0.75 * d : 0.08 + 0.6 * d * d + glow * 0.4);
        ctx.beginPath();
        ctx.arc(x, y, 0.5 + 1.5 * d + (on ? 0.6 : 0), 0, TAU);
        ctx.fill();
      });

      // Signals arcing between regions, like data moving between sites.
      if (moving && pulses.length < (lit >= 0 ? 4 : 3) && Math.random() < dt * 1.6) {
        const a = lit >= 0 ? lit : Math.floor(Math.random() * 6);
        let b = Math.floor(Math.random() * 5);
        if (b >= a) b++;
        pulses.push({ a, b, t: 0, v: 0.35 + Math.random() * 0.25 });
      }
      if (moving) pulses = pulses.filter((p) => (p.t += dt * p.v) < 1.25);
      for (const p of pulses) {
        const from = globe.hubs[p.a], to = globe.hubs[p.b];
        const head = Math.min(1, p.t), tail = Math.max(0, p.t - 0.3);
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        for (let k = 0; k <= 20; k++) {
          const [x, y] = project(view(arcPoint(from, to, tail + (head - tail) * (k / 20))), frame);
          if (k) ctx.lineTo(x, y);
          else ctx.moveTo(x, y);
        }
        const [hx, hy, d] = project(view(arcPoint(from, to, head)), frame);
        ctx.strokeStyle = rgba(COLORS[p.a], 0.25 + 0.7 * d);
        ctx.stroke();
        if (p.t < 1) {
          ctx.fillStyle = rgba(COLORS[p.a], 0.5 + 0.5 * d);
          ctx.beginPath();
          ctx.arc(hx, hy, 2.4, 0, TAU);
          ctx.fill();
        }
      }
      ctx.lineWidth = 1;
      const hubs = globe.hubs.map((hub, k) => {
        const [x, y, d] = project(view(hub), frame);
        const on = lit === k;
        ctx.fillStyle = rgba(on ? COLORS[k] : WHITE, (on ? 0.4 : 0.15) + 0.6 * d);
        ctx.beginPath();
        ctx.arc(x, y, 2.4 + 1.6 * d + (on ? 1.2 : 0), 0, TAU);
        ctx.fill();
        if (on) {
          ctx.strokeStyle = rgba(COLORS[k], 0.5 * d);
          ctx.beginPath();
          ctx.arc(x, y, 9 + 3 * d, 0, TAU);
          ctx.stroke();
        }
        return [x, y] as const;
      });

      // A division page's own island, large at the front.
      const lead = focused
        ? { k: active, x: center.x, y: ringY + ry * 1.3 + Math.sin(clock * 0.9) * 4, depth: 1, scale: FOCUS_SCALE }
        : null;

      // A beam from the chosen region to its island.
      const target = lead ?? slots.find((s) => s.k === lit);
      if (lit >= 0 && target) {
        const s = target;
        ctx.strokeStyle = rgba(COLORS[lit], 0.7);
        ctx.lineWidth = 1.4;
        ctx.setLineDash([3, 4]);
        ctx.lineDashOffset = -clock * 30;
        ctx.beginPath();
        ctx.moveTo(hubs[lit][0], hubs[lit][1]);
        ctx.lineTo(s.x, s.y - center.r * s.scale * 0.12);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.lineWidth = 1;
      }

      byDepth.filter((s) => s.depth >= 0.5).forEach(islandAt);
      if (lead) drawIsland(lead.k, lead.x, lead.y, center.r * lead.scale, levels[lead.k], 1);
    };

    const draw = (now: number) => {
      raf = 0;
      if (!W || !H) return;
      if (still() || !visible) {
        last = 0;
        paint(0, active, false);
        return;
      }
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;
      clock += dt;
      const boot = Math.floor(clock / BOOT_STEP);
      paint(dt, active >= 0 ? active : boot < COLORS.length ? boot : -1, true);
      raf = requestAnimationFrame(draw);
    };

    const start = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      last = 0;
    };

    setActiveRef.current = (index) => {
      active = index;
      start();
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const rect = host.getBoundingClientRect();
      mouse = { x: event.clientX - rect.left, y: event.clientY - rect.top };
      if (still()) start();
    };
    const onLeave = () => {
      mouse = null;
      if (still()) start();
    };
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);

    let inView = true;
    const onVisibility = () => {
      visible = !document.hidden && inView;
      if (visible) start();
      else stop();
    };
    const seen = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      onVisibility();
    });
    seen.observe(host);
    document.addEventListener("visibilitychange", onVisibility);

    const onMotionChange = () => {
      stop();
      start();
    };
    reduce.addEventListener("change", onMotionChange);

    // Height changes alone come from a phone's address bar, so ignore small ones.
    let lastW = 0, lastH = 0, resizeTimer = 0;
    const resized = new ResizeObserver(() => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        const rect = host.getBoundingClientRect();
        if (Math.abs(rect.width - lastW) < 1 && Math.abs(rect.height - lastH) < 120) return;
        lastW = rect.width;
        lastH = rect.height;
        stop();
        measure();
        start();
      }, 150);
    });
    resized.observe(host);

    // The headline settles once its font has loaded, so measure the text again then.
    document.fonts?.ready.then(() => {
      measureText();
      place();
      sizeIslands();
      if (still()) start();
    });

    const rect = host.getBoundingClientRect();
    lastW = rect.width;
    lastH = rect.height;
    measure();
    start();

    return () => {
      stop();
      rasterRun++;
      window.clearTimeout(resizeTimer);
      resized.disconnect();
      seen.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      reduce.removeEventListener("change", onMotionChange);
    };
  }, [focus]);

  return (
    <>
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 -z-20 block h-full w-full" />
      {/* The division illustrations the canvas draws as islands. */}
      <div ref={scenesRef} hidden aria-hidden="true">
        {COLORS.map((_, index) => (
          <IsoScene key={index} index={index} />
        ))}
      </div>
      {chips && (
      <nav aria-label={label}>
        <ul className="flex flex-wrap gap-2">
          {chips.map((chip, index) => (
            <li
              key={chip.href}
              className="hero-fade"
              style={{ "--delay": `${900 + index * 60}ms` } as React.CSSProperties}
            >
              <Link
                href={chip.href}
                style={{ "--hue": HEX[index] } as React.CSSProperties}
                className="glass inline-flex min-h-11 items-center rounded-full px-4 text-[0.84375rem] font-medium text-[#e3e4e8] duration-150 hover:text-white hover:[box-shadow:inset_0_0_0_1px_var(--hue),inset_0_1px_0_var(--glass-hi),var(--glass-shadow)] focus-visible:text-white"
                onPointerEnter={() => setActiveRef.current(index)}
                onPointerLeave={() => setActiveRef.current(-1)}
                onFocus={() => setActiveRef.current(index)}
                onBlur={() => setActiveRef.current(-1)}
              >
                {chip.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      )}
    </>
  );
}
