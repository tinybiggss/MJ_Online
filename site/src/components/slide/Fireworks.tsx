import { useEffect, useRef } from "react";
import { MIN, MAX } from "./config";

interface Props {
  /** 0..1 intensity, typically the selected amount mapped across MIN..MAX. */
  intensity: number;
  /** Bump this number to trigger a celebratory finale burst (e.g. on a committed chip-in). */
  celebrate: number;
}

/** A rising rocket that bursts when it reaches its apex. */
interface Rocket {
  x: number;
  y: number;
  vy: number;
  targetY: number;
  color: string;
  power: number;
}

/** A spark thrown off by a burst. */
interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  color: string;
  size: number;
  /** Recent positions for a short comet trail. */
  trail: { x: number; y: number }[];
}

// Festive July-4th palette: reds, whites, blues, plus gold + cyan sparkle.
const COLORS = ["#ef4444", "#ffffff", "#3b82f6", "#fbbf24", "#22d3ee", "#f472b6"];

function pick(): string {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

export default function Fireworks({ intensity, celebrate }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intensityRef = useRef(intensity);
  intensityRef.current = intensity;
  // A short-lived burst of extra energy triggered by commits; decays over time.
  const finaleRef = useRef(0);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return; // No canvas animation at all when reduce is set.

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let lastSpawn = 0;
    let dpr = 1;
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

    /** Launch a rocket from the bottom that will burst near a random height. */
    function launch(power: number) {
      const w = cssWidth();
      const h = cssHeight();
      const x = w * (0.12 + Math.random() * 0.76);
      // Bigger power → bursts higher up in the sky.
      const targetY = h * (0.5 - power * 0.35 - Math.random() * 0.1);
      const distance = h - targetY;
      rockets.push({
        x,
        y: h + 4,
        vy: -Math.sqrt(distance) * 0.9, // just enough to reach the apex
        targetY,
        color: pick(),
        power,
      });
    }

    /** Explode a rocket into a radial shell of sparks. */
    function explode(x: number, y: number, power: number, tint: string) {
      const count = Math.round(30 + power * 70);
      const speed = 2.2 + power * 4.5;
      // Occasionally give the whole shell a single color for a cleaner pop.
      const monochrome = Math.random() < 0.5;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.2;
        const s = speed * (0.55 + Math.random() * 0.7);
        sparks.push({
          x,
          y,
          vx: Math.cos(angle) * s,
          vy: Math.sin(angle) * s,
          life: 0,
          max: 55 + Math.random() * 35,
          color: monochrome ? tint : pick(),
          size: 1.6 + power * 1.6,
          trail: [],
        });
      }
    }

    function frame(t: number) {
      const w = cssWidth();
      const h = cssHeight();
      // Fade the previous frame instead of clearing — leaves gentle light trails.
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(0,0,0,0.18)";
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter"; // additive glow for the sparks

      // Effective power blends the selected-amount intensity with any active finale.
      const base = intensityRef.current; // 0..1
      const finale = finaleRef.current; // 0..1, decays
      const power = Math.min(1, base * 0.9 + finale);

      // Spawn cadence: higher power → more frequent launches. Finale floods the sky.
      const interval = finale > 0.05 ? 130 : 950 - base * 720;
      if (power > 0.02 && t - lastSpawn > interval) {
        lastSpawn = t;
        launch(power);
        // Near the top of the range (or during a finale), send up a small volley.
        if (power > 0.75 && Math.random() < 0.6) launch(power);
      }

      // Rockets rise, trailing a spark, then burst at apex.
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.y += r.vy;
        r.vy += 0.06; // gravity slows the ascent
        // Ascent trail
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = r.color;
        ctx.beginPath();
        ctx.arc(r.x, r.y, 1.8, 0, Math.PI * 2);
        ctx.fill();
        if (r.y <= r.targetY || r.vy >= 0) {
          explode(r.x, r.y, r.power, r.color);
          rockets.splice(i, 1);
        }
      }

      // Sparks drift, fall under gravity, fade, and drag their comet trail.
      for (let i = sparks.length - 1; i >= 0; i--) {
        const p = sparks[i];
        p.life++;
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > 5) p.trail.shift();
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05; // gravity
        p.vx *= 0.985;
        p.vy *= 0.985;
        const alpha = 1 - p.life / p.max;
        if (alpha <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        // Trail
        for (let j = 0; j < p.trail.length; j++) {
          const pt = p.trail[j];
          ctx.globalAlpha = alpha * (j / p.trail.length) * 0.5;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, p.size * 0.6, 0, Math.PI * 2);
          ctx.fill();
        }
        // Head
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Decay the finale energy back toward zero.
      if (finaleRef.current > 0) {
        finaleRef.current = Math.max(0, finaleRef.current - 0.012);
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
  }, []);

  // Celebratory finale on commit: pump the finale energy so the sky lights up.
  useEffect(() => {
    if (celebrate === 0) return;
    finaleRef.current = 1;
  }, [celebrate]);

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
