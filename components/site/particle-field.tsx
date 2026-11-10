"use client";

import { useEffect, useRef } from "react";
import { isLowPower } from "@/lib/low-power";

// The hero's drifting data points, for the other dark bands, so every black surface
// shares the same texture. Quieter than in the hero, because text and cards sit on top:
// mostly white, a few in the division colors, linked when they pass close to each other.
// They fade out at the band's edges, so two bands that touch don't show a seam.
// Still frame with reduced motion or on low-power devices; paused when out of view.

type RGB = readonly [number, number, number];

const COLORS: ReadonlyArray<RGB> = [
  [25, 193, 239],
  [43, 146, 242],
  [110, 123, 255],
  [154, 64, 248],
  [192, 75, 247],
  [249, 91, 246],
];
const WHITE: RGB = [255, 255, 255];
const LINK = 78;
const EDGE = 64;
const TAU = Math.PI * 2;

const rgba = (c: RGB, a: number) => `rgba(${c[0]},${c[1]},${c[2]},${Math.max(0, Math.min(1, a)).toFixed(3)})`;

type Particle = { x: number; y: number; depth: number; phase: number; speed: number; color: RGB; size: number };

export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !host || !ctx) return;

    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    const lowPower = isLowPower();
    const still = () => reduce.matches || lowPower;

    let W = 0, H = 0, raf = 0, last = 0, clock = 0, running = false;
    let particles: Particle[] = [];
    let mouse: { x: number; y: number } | null = null;

    const particle = (anywhere: boolean): Particle => {
      const depth = 0.3 + Math.random() * 0.7;
      return {
        x: anywhere ? Math.random() * W : -10 - Math.random() * 40,
        y: Math.random() * H,
        depth,
        phase: Math.random() * TAU,
        speed: 6 + depth * 12,
        color: Math.random() < 0.22 ? COLORS[Math.floor(Math.random() * COLORS.length)] : WHITE,
        size: 0.5 + depth * 1.2,
      };
    };

    const measure = () => {
      const rect = host.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = rect.width;
      H = rect.height;
      if (!W || !H) return;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(140, (W * H) / (W >= 1024 ? 9000 : 8000)));
      particles = Array.from({ length: count }, () => particle(true));
    };

    const paint = (dt: number) => {
      ctx.clearRect(0, 0, W, H);
      const drawn = particles.map((p) => {
        if (dt) {
          p.x += p.speed * dt;
          p.y += Math.sin(clock * 0.6 + p.phase + p.x * 0.004) * 5 * p.depth * dt;
          if (p.x > W + 10) Object.assign(p, particle(false));
        }
        let { x, y } = p;
        if (mouse) {
          const d = Math.hypot(x - mouse.x, y - mouse.y) || 1;
          if (d < 130) {
            x += ((x - mouse.x) / d) * (1 - d / 130) * 14;
            y += ((y - mouse.y) / d) * (1 - d / 130) * 14;
          }
        }
        const edges = Math.min(1, Math.max(0, x) / 80, y / EDGE, (H - y) / EDGE);
        const alpha = (0.08 + 0.3 * p.depth) * Math.max(0, edges);
        return { x, y, alpha, color: p.color, size: p.size };
      });

      ctx.lineWidth = 1;
      for (let i = 0; i < drawn.length; i++) {
        for (let j = i + 1; j < drawn.length; j++) {
          const a = drawn[i], b = drawn[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d >= LINK) continue;
          const tint = a.color !== WHITE && a.color === b.color;
          ctx.strokeStyle = rgba(tint ? a.color : WHITE, (1 - d / LINK) * Math.min(a.alpha, b.alpha) * (tint ? 0.7 : 0.4));
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
      for (const p of drawn) {
        ctx.fillStyle = rgba(p.color, p.alpha * (p.color === WHITE ? 1 : 1.5));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, TAU);
        ctx.fill();
      }
    };

    const frame = (now: number) => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      clock += dt;
      paint(dt);
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (still()) {
        cancelAnimationFrame(raf);
        running = false;
        paint(0);
        return;
      }
      if (running) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      running = false;
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const rect = host.getBoundingClientRect();
      mouse = { x: event.clientX - rect.left, y: event.clientY - rect.top };
      if (still()) paint(0);
    };
    const onLeave = () => {
      mouse = null;
      if (still()) paint(0);
    };
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);

    let inView = false;
    const update = () => (!document.hidden && inView ? start() : stop());
    const seen = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      update();
    }, { rootMargin: "120px 0px" });
    seen.observe(host);
    document.addEventListener("visibilitychange", update);
    const onMotionChange = () => {
      stop();
      update();
    };
    reduce.addEventListener("change", onMotionChange);

    // Height changes alone come from a phone's address bar or content settling, so ignore small ones.
    let lastW = 0, lastH = 0, timer = 0;
    const resized = new ResizeObserver(() => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        const rect = host.getBoundingClientRect();
        if (Math.abs(rect.width - lastW) < 1 && Math.abs(rect.height - lastH) < 60) return;
        lastW = rect.width;
        lastH = rect.height;
        measure();
        if (still()) paint(0);
      }, 150);
    });
    resized.observe(host);

    const rect = host.getBoundingClientRect();
    lastW = rect.width;
    lastH = rect.height;
    measure();
    if (still()) paint(0);

    return () => {
      stop();
      window.clearTimeout(timer);
      resized.disconnect();
      seen.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", update);
      reduce.removeEventListener("change", onMotionChange);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 -z-[1] block h-full w-full" />;
}
