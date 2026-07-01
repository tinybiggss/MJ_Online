import { useEffect, useRef, useState } from "react";
import { MIN, MAX } from "./config";

interface Pt {
  x: number;
  y: number;
}

interface Props {
  /** Pixel anchor of the bulb centre — the rocket/fuse launch point. */
  bulb: Pt;
  /** Pixel anchor of the goal line (top of the tube). */
  top: Pt;
  /** Pixel anchor of the live committed-total fill line. */
  totalLine: Pt;
  /** Pixel anchor of the stacked (total + your amount) fill line. */
  stackedLine: Pt;
  /** 0..1 committed-total fraction. */
  totalFrac: number;
  /** 0..1 stacked fraction (total + your amount). */
  stackedFrac: number;
  /** Tube width in px — scales burst radius sensibly across screen sizes. */
  tubeWidth: number;
  /** Bump to fire a celebratory finale (committed chip-in). */
  celebrate: number;
}

interface Rocket {
  x: number;
  y: number;
  vy: number;
  targetY: number;
  color: string;
  /** 0..1 — how high this rocket climbs; scales the burst. */
  power: number;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  color: string;
  size: number;
  trail: Pt[];
  /** Sparks near the mercury surface get less gravity so pops read cleanly. */
  gravity: number;
}

// Festive July-4th palette: reds, whites, blues, plus gold + cyan sparkle.
const COLORS = ["#ef4444", "#ffffff", "#3b82f6", "#fbbf24", "#22d3ee", "#f472b6"];
const FUSE_COLORS = ["#fbbf24", "#fb923c", "#fde68a"];

function pick(list: string[] = COLORS): string {
  return list[Math.floor(Math.random() * list.length)];
}

export default function Fireworks(props: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [reduce, setReduce] = useState(false);

  // Live props for the animation loop (avoids re-subscribing the RAF each frame).
  const propsRef = useRef(props);
  propsRef.current = props;

  // A short-lived finale energy triggered by commits / reaching the top; decays.
  const finaleRef = useRef(0);
  // Track stacked movement so a rising stack launches a rocket immediately.
  const lastStackedRef = useRef(props.stackedFrac);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reduce) return; // Static thermometer handles the reduced-motion case.

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let dpr = 1;
    let lastTotalSpawn = 0;
    let lastRocketSpawn = 0;
    let fuseSpawn = 0;
    const rockets: Rocket[] = [];
    const sparks: Spark[] = [];

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(canvas.offsetWidth * dpr));
      canvas.height = Math.max(1, Math.floor(canvas.offsetHeight * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const cssWidth = () => canvas.width / dpr;
    const cssHeight = () => canvas.height / dpr;

    /** Launch a rocket from the bulb up to a target y (the stacked fill line). */
    function launchRocket(from: Pt, targetY: number, power: number) {
      const distance = Math.max(8, from.y - targetY);
      rockets.push({
        x: from.x + (Math.random() - 0.5) * 4,
        y: from.y,
        vy: -Math.sqrt(distance) * 0.85, // just enough to reach the apex
        targetY,
        color: pick(),
        power,
      });
    }

    /** Explode into a radial shell of sparks. `radius` scales with burst power. */
    function explode(x: number, y: number, power: number, tint: string, radius: number) {
      const count = Math.round(18 + power * 60);
      const speed = 1.2 + power * 3.6 + radius * 0.02;
      const monochrome = Math.random() < 0.5;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.3;
        const s = speed * (0.5 + Math.random() * 0.7);
        sparks.push({
          x,
          y,
          vx: Math.cos(angle) * s,
          vy: Math.sin(angle) * s,
          life: 0,
          max: 42 + Math.random() * 32,
          color: monochrome ? tint : pick(),
          size: 1.2 + power * 1.5,
          trail: [],
          gravity: 0.045,
        });
      }
    }

    /** A small pop right at the mercury surface (always-on for the real total). */
    function surfacePop(at: Pt, power: number) {
      const count = Math.round(5 + power * 10);
      for (let i = 0; i < count; i++) {
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.1;
        const s = 0.8 + Math.random() * (1.4 + power * 1.6);
        sparks.push({
          x: at.x + (Math.random() - 0.5) * 10,
          y: at.y,
          vx: Math.cos(angle) * s,
          vy: Math.sin(angle) * s,
          life: 0,
          max: 26 + Math.random() * 20,
          color: pick(),
          size: 1.1 + power * 0.9,
          trail: [],
          gravity: 0.03,
        });
      }
    }

    /** A short sparking fuse at the bulb — most visible at low levels. */
    function fuseSpark(bulb: Pt) {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.6;
      const s = 0.6 + Math.random() * 1.4;
      sparks.push({
        x: bulb.x + (Math.random() - 0.5) * 6,
        y: bulb.y - 2,
        vx: Math.cos(angle) * s,
        vy: Math.sin(angle) * s,
        life: 0,
        max: 16 + Math.random() * 12,
        color: pick(FUSE_COLORS),
        size: 1.2,
        trail: [],
        gravity: 0.06,
      });
    }

    function frame(t: number) {
      const p = propsRef.current;
      const w = cssWidth();
      const h = cssHeight();

      // Fade the previous frame — leaves gentle light trails.
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(0,0,0,0.20)";
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter"; // additive glow

      const finale = finaleRef.current;

      // --- Detect a rising stack (dragging up) → launch a rocket to its apex ---
      const rose = p.stackedFrac > lastStackedRef.current + 0.001;
      const stackAbove = p.stackedFrac > p.totalFrac + 0.01;
      // Cadence-limited continuous rockets whenever there's a live "your amount"
      // segment above the real total; plus an instant one when it rises.
      if (stackAbove) {
        const power = p.stackedFrac; // higher stack → bigger burst
        if (rose || t - lastRocketSpawn > 620 - power * 260) {
          lastRocketSpawn = t;
          launchRocket(p.bulb, p.stackedLine.y, power);
        }
      }
      lastStackedRef.current = p.stackedFrac;

      // --- Always-on fuse at the bulb (denser when the total is low) ---
      const fuseRate = 90 + p.totalFrac * 220; // ms between sparks
      if (t - fuseSpawn > fuseRate) {
        fuseSpawn = t;
        fuseSpark(p.bulb);
      }

      // --- Always-on little pops along the real mercury top ---
      if (p.totalFrac > 0.001) {
        const interval = 700 - p.totalFrac * 500; // higher total → more frequent
        if (t - lastTotalSpawn > interval) {
          lastTotalSpawn = t;
          surfacePop(p.totalLine, p.totalFrac);
        }
      }

      // --- Finale: flurry of bursts around the top ---
      if (finale > 0.05) {
        if (Math.random() < finale * 0.5) {
          const fx = p.top.x + (Math.random() - 0.5) * p.tubeWidth * 3;
          const fy = p.top.y + Math.random() * (p.bulb.y - p.top.y) * 0.4;
          explode(fx, fy, 0.5 + Math.random() * 0.5, pick(), p.tubeWidth * 2);
        }
      }

      // --- Rockets rise, trailing sparks, then burst at their target apex ---
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.y += r.vy;
        r.vy += 0.05; // gravity slows the ascent
        // Ascent trail
        ctx.globalAlpha = 0.95;
        ctx.fillStyle = r.color;
        ctx.beginPath();
        ctx.arc(r.x, r.y, 1.7, 0, Math.PI * 2);
        ctx.fill();
        // Little sparks off the tail
        if (Math.random() < 0.6) {
          sparks.push({
            x: r.x,
            y: r.y + 2,
            vx: (Math.random() - 0.5) * 0.6,
            vy: 0.4 + Math.random() * 0.6,
            life: 0,
            max: 12 + Math.random() * 8,
            color: pick(FUSE_COLORS),
            size: 1,
            trail: [],
            gravity: 0.02,
          });
        }
        if (r.y <= r.targetY || r.vy >= 0) {
          explode(r.x, r.y, r.power, r.color, p.tubeWidth * 2.4);
          rockets.splice(i, 1);
        }
      }

      // --- Sparks drift, fall, fade, drag their comet trail ---
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.life++;
        s.trail.push({ x: s.x, y: s.y });
        if (s.trail.length > 4) s.trail.shift();
        s.x += s.vx;
        s.y += s.vy;
        s.vy += s.gravity;
        s.vx *= 0.985;
        s.vy *= 0.985;
        const alpha = 1 - s.life / s.max;
        if (alpha <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        for (let j = 0; j < s.trail.length; j++) {
          const pt = s.trail[j];
          ctx.globalAlpha = alpha * (j / s.trail.length) * 0.5;
          ctx.fillStyle = s.color;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, s.size * 0.6, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = alpha;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      }

      if (finaleRef.current > 0) {
        finaleRef.current = Math.max(0, finaleRef.current - 0.01);
      }

      // Auto-finale when the stack reaches the very top (kept subtle / one-shot-ish).
      if (p.stackedFrac >= 0.999 && finaleRef.current < 0.4) {
        finaleRef.current = 0.9;
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [reduce]);

  // Celebratory finale on a committed chip-in.
  useEffect(() => {
    if (props.celebrate === 0) return;
    finaleRef.current = 1;
    // Fire one big central burst immediately for punch.
    // (Handled by the finale flurry inside the loop; this just pumps energy.)
  }, [props.celebrate]);

  if (reduce) {
    // Static "🎆 goal" marker; no canvas animation.
    return (
      <div
        className="pointer-events-none absolute select-none text-lg"
        style={{
          left: props.top.x,
          top: props.top.y,
          transform: "translate(-50%, -140%)",
        }}
        aria-hidden="true"
      >
        🎆
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}

/** Map a dollar amount to a 0..1 fireworks intensity across the slider range. */
export function amountToIntensity(amount: number): number {
  return Math.max(0, Math.min(1, (amount - MIN) / (MAX - MIN)));
}
