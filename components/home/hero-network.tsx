"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

// Six clusters, one per division. At rest the system is white on black. Color
// appears where a signal is active: pointing at a cluster, choosing a division,
// and once on load, when each division lights up in turn.

const COLORS: ReadonlyArray<readonly [number, number, number]> = [
  [25, 193, 239],
  [43, 146, 242],
  [110, 123, 255],
  [154, 64, 248],
  [192, 75, 247],
  [249, 91, 246],
];
const HEX = ["#19C1EF", "#2B92F2", "#6E7BFF", "#9A40F8", "#C04BF7", "#F95BF6"];
const HUB_LINKS = [[0, 1], [1, 2], [0, 3], [1, 4], [2, 4], [3, 4], [4, 5], [2, 5]];
const BOOT_STEP = 0.42;

type Node = {
  x: number; y: number; px: number; py: number;
  cluster: number; hub: boolean; phase: number; speed: number;
};
type Edge = { a: number; b: number; cluster: number };
type Pulse = { edge: Edge; t: number; v: number; color: number };

function isLowPower() {
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };
  return (
    nav.connection?.saveData === true ||
    (nav.hardwareConcurrency !== undefined && nav.hardwareConcurrency <= 2) ||
    (nav.deviceMemory !== undefined && nav.deviceMemory <= 2)
  );
}

export function HeroNetwork({
  chips,
  label,
}: {
  chips: ReadonlyArray<{ label: string; href: string }>;
  label: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const setActiveRef = useRef<(index: number) => void>(() => {});

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.closest("section");
    const ctx = canvas?.getContext("2d");
    if (!canvas || !host || !ctx) return;

    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    const lowPower = isLowPower();
    const still = () => reduce.matches || lowPower;

    let W = 0, H = 0, seed = 7, raf = 0, clock = 0, active = -1, visible = true;
    let nodes: Node[] = [], edges: Edge[] = [], pulses: Pulse[] = [];
    let mouse: { x: number; y: number } | null = null;

    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    const addEdge = (a: number, b: number, cluster: number) => {
      if (!edges.some((e) => (e.a === a && e.b === b) || (e.a === b && e.b === a))) {
        edges.push({ a, b, cluster });
      }
    };

    const place = (time: number) => {
      for (const n of nodes) {
        n.px = n.x + Math.cos(time * n.speed + n.phase) * 5;
        n.py = n.y + Math.sin(time * n.speed * 0.8 + n.phase) * 5;
        if (mouse) {
          const dx = n.px - mouse.x, dy = n.py - mouse.y;
          const d = Math.hypot(dx, dy);
          if (d < 150 && d > 0.1) {
            const force = (1 - d / 150) * 14;
            n.px += (dx / d) * force;
            n.py += (dy / d) * force;
          }
        }
      }
    };

    const glow = (n: Node) => {
      if (!mouse) return 0;
      const d = Math.hypot(n.px - mouse.x, n.py - mouse.y);
      return d < 190 ? 1 - d / 190 : 0;
    };

    const build = () => {
      const rect = host.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = rect.width;
      H = rect.height;
      if (!W || !H) return;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed = 7;
      nodes = [];
      edges = [];
      pulses = [];

      const wide = W >= 1024;
      const perCluster = wide ? 16 : 7; // 96 nodes on desktop, 42 on mobile
      const centers = wide
        ? [[0.58, 0.28], [0.75, 0.22], [0.91, 0.36], [0.62, 0.62], [0.79, 0.58], [0.93, 0.76]]
        : [[0.14, 0.76], [0.42, 0.72], [0.76, 0.75], [0.2, 0.88], [0.55, 0.85], [0.86, 0.89]];
      const spreadX = wide ? W * 0.085 : W * 0.13;
      const spreadY = wide ? H * 0.13 : H * 0.055;

      centers.forEach(([cx, cy], cluster) => {
        const start = nodes.length;
        for (let k = 0; k < perCluster; k++) {
          const angle = random() * Math.PI * 2;
          const distance = k === 0 ? 0 : 0.25 + random() * 0.85;
          const x = cx * W + Math.cos(angle) * distance * spreadX;
          const y = cy * H + Math.sin(angle) * distance * spreadY;
          nodes.push({
            x, y, px: x, py: y, cluster, hub: k === 0,
            phase: random() * Math.PI * 2, speed: 0.25 + random() * 0.45,
          });
        }
        for (let i = start; i < nodes.length; i++) {
          const near: Array<[number, number]> = [];
          for (let j = start; j < nodes.length; j++) {
            if (j !== i) near.push([Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y), j]);
          }
          near.sort((p, q) => p[0] - q[0]);
          near.slice(0, 2).forEach(([, j]) => addEdge(i, j, cluster));
        }
      });

      const hubs = nodes.flatMap((n, i) => (n.hub ? [i] : []));
      HUB_LINKS.forEach(([p, q]) => addEdge(hubs[p], hubs[q], -1));
    };

    const spawn = (lit: number) => {
      const pool = lit < 0 ? edges : edges.filter((e) => e.cluster === lit);
      if (!pool.length) return;
      const edge = pool[Math.floor(Math.random() * pool.length)];
      pulses.push({
        edge, t: 0, v: 0.006 + Math.random() * 0.008,
        color: lit >= 0 ? lit : nodes[edge.a].cluster,
      });
    };

    const paint = (lit: number) => {
      ctx.clearRect(0, 0, W, H);
      for (const e of edges) {
        const a = nodes[e.a], b = nodes[e.b];
        const g = Math.max(glow(a), glow(b));
        const on = lit >= 0 && a.cluster === lit && b.cluster === lit;
        const [r, gr, bl] = g > 0.05 || on ? COLORS[a.cluster] : [255, 255, 255];
        const alpha = on ? 0.75 : g > 0.05 ? 0.16 + g * 0.6 : lit >= 0 ? 0.07 : 0.17;
        ctx.strokeStyle = `rgba(${r},${gr},${bl},${alpha})`;
        ctx.lineWidth = on ? 1.2 : 1;
        ctx.beginPath();
        ctx.moveTo(a.px, a.py);
        ctx.lineTo(b.px, b.py);
        ctx.stroke();
      }
      for (const n of nodes) {
        const g = glow(n);
        const on = lit >= 0 && n.cluster === lit;
        const [r, gr, bl] = g > 0.05 || on ? COLORS[n.cluster] : [255, 255, 255];
        const alpha = on ? 1 : g > 0.05 ? 0.45 + g * 0.55 : lit >= 0 ? 0.26 : 0.58;
        const size = (n.hub ? 3.4 : 1.8) + (on ? 1 : 0) + g * 1.2;
        ctx.fillStyle = `rgba(${r},${gr},${bl},${alpha})`;
        ctx.beginPath();
        ctx.arc(n.px, n.py, size, 0, Math.PI * 2);
        ctx.fill();
      }
      for (const p of pulses) {
        const a = nodes[p.edge.a], b = nodes[p.edge.b];
        const [r, gr, bl] = COLORS[p.color];
        ctx.fillStyle = `rgb(${r},${gr},${bl})`;
        ctx.beginPath();
        ctx.arc(a.px + (b.px - a.px) * p.t, a.py + (b.py - a.py) * p.t, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const draw = () => {
      raf = 0;
      if (still() || !visible) {
        place(0);
        paint(active);
        return;
      }
      clock += 1 / 60;
      place(clock);
      const boot = Math.floor(clock / BOOT_STEP);
      const lit = active >= 0 ? active : boot < COLORS.length ? boot : -1;
      if (pulses.length < (lit >= 0 ? 12 : 7) && Math.random() < 0.08) spawn(lit);
      pulses = pulses.filter((p) => (p.t += p.v) < 1);
      paint(lit);
      raf = requestAnimationFrame(draw);
    };

    const start = () => {
      if (!raf) draw();
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
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

    const onVisibility = () => {
      visible = !document.hidden && inView;
      if (visible) start();
      else stop();
    };
    let inView = true;
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
        build();
        start();
      }, 150);
    });
    resized.observe(host);

    const rect = host.getBoundingClientRect();
    lastW = rect.width;
    lastH = rect.height;
    build();
    start();

    return () => {
      stop();
      window.clearTimeout(resizeTimer);
      resized.disconnect();
      seen.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      reduce.removeEventListener("change", onMotionChange);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 -z-20 block h-full w-full" />
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
    </>
  );
}
