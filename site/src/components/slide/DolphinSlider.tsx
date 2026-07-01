import { useRef, useState, useCallback, useEffect, useId } from "react";
import {
  STOPS,
  MIN,
  MAX,
  amountForFraction,
  fractionForAmount,
  snapToStop,
  formatUSDShort,
} from "./config";

interface Props {
  amount: number;
  onChange: (amount: number) => void;
}

/**
 * Dolphin-as-thumb slider. Dragging the dolphin along an ocean track snaps to
 * STOPS; a number box allows any custom amount (incl. > $300, which parks the
 * dolphin at the far right). The dolphin "porpoises" — leaping in an arc and
 * diving back toward the water — livelier while dragging, a gentle bob at idle.
 * Fully keyboard-, touch-, and mouse-driven with a proper ARIA slider role.
 * Respects prefers-reduced-motion: no leaping, just a calm slider.
 */
export default function DolphinSlider({ amount, onChange }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [reduce, setReduce] = useState(false);
  const inputId = useId();

  // Detect (and live-track) the reduced-motion preference on the client only.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const fraction = fractionForAmount(amount);
  const snapped = snapToStop(amount);
  // A custom amount that isn't a stop (e.g. typed $75 or $450) — worth flagging.
  const custom = amount !== snapped;

  const setFromClientX = useCallback(
    (clientX: number) => {
      const track = trackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      // Inset by the same 0.75rem the thumb track uses so ends are reachable.
      const inset = 12;
      const usable = rect.width - inset * 2;
      const frac = (clientX - rect.left - inset) / usable;
      onChange(amountForFraction(frac));
    },
    [onChange],
  );

  const onPointerDown = (event: React.PointerEvent) => {
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    setDragging(true);
    setFromClientX(event.clientX);
  };
  const onPointerMove = (event: React.PointerEvent) => {
    if (dragging) setFromClientX(event.clientX);
  };
  const endDrag = () => setDragging(false);

  const onKeyDown = (event: React.KeyboardEvent) => {
    const idx = STOPS.indexOf(snapToStop(amount));
    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      onChange(STOPS[Math.min(STOPS.length - 1, idx + 1)]);
      event.preventDefault();
    } else if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      onChange(STOPS[Math.max(0, idx - 1)]);
      event.preventDefault();
    } else if (event.key === "Home") {
      onChange(MIN);
      event.preventDefault();
    } else if (event.key === "End") {
      onChange(MAX);
      event.preventDefault();
    }
  };

  // While dragging, the dolphin leaps higher the faster you push it toward the
  // top of the range; otherwise it just bobs. Class picks the animation.
  const motionClass = reduce ? "" : dragging ? "dolphin-porpoise" : "dolphin-bob";

  return (
    <div className="select-none">
      <div className="mb-1 flex items-baseline justify-between">
        <span className="text-sm font-semibold text-sky-900">Slide the dolphin to pick an amount</span>
        <span
          className="rounded-full bg-white/70 px-2.5 py-0.5 text-sm font-black tabular-nums text-sky-700 ring-1 ring-inset ring-sky-200"
          aria-hidden="true"
        >
          {formatUSDShort(amount)}
        </span>
      </div>

      <div
        ref={trackRef}
        role="slider"
        aria-label="Donation amount"
        aria-valuemin={MIN}
        aria-valuemax={MAX}
        aria-valuenow={snapped}
        aria-valuetext={formatUSDShort(snapped)}
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={onKeyDown}
        className="group relative h-28 w-full cursor-grab touch-none overflow-hidden rounded-3xl bg-gradient-to-b from-sky-300 via-sky-400 to-blue-600 shadow-inner outline-none ring-sky-500 focus-visible:ring-4 active:cursor-grabbing"
      >
        {/* Sky glow up top */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-amber-100/40 to-transparent" />

        {/* Sun sparkle on the water */}
        <div className="pointer-events-none absolute right-6 top-3 h-8 w-8 rounded-full bg-amber-200/50 blur-md" />

        {/* Layered ocean waves near the surface line (the dolphin swims here) */}
        <svg
          className="pointer-events-none absolute inset-x-0 bottom-0 h-16 w-full"
          viewBox="0 0 400 64"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            className={reduce ? "" : "wave-back"}
            d="M0 26 Q 25 16 50 26 T 100 26 T 150 26 T 200 26 T 250 26 T 300 26 T 350 26 T 400 26 V64 H0 Z"
            fill="rgba(255,255,255,0.18)"
          />
          <path
            className={reduce ? "" : "wave-mid"}
            d="M0 34 Q 25 24 50 34 T 100 34 T 150 34 T 200 34 T 250 34 T 300 34 T 350 34 T 400 34 V64 H0 Z"
            fill="rgba(255,255,255,0.28)"
          />
          <path
            className={reduce ? "" : "wave-front"}
            d="M0 44 Q 20 36 40 44 T 80 44 T 120 44 T 160 44 T 200 44 T 240 44 T 280 44 T 320 44 T 360 44 T 400 44 V64 H0 Z"
            fill="rgba(255,255,255,0.42)"
          />
        </svg>

        {/* Stop ticks along the waterline */}
        {STOPS.map((stop, i) => (
          <div
            key={stop}
            className="pointer-events-none absolute bottom-6 h-2.5 w-px -translate-x-1/2 rounded bg-white/45"
            style={{ left: `calc(0.75rem + ${(i / (STOPS.length - 1)) * 100}% * (1 - 1.5rem / 100%))` }}
          />
        ))}

        {/* The dolphin thumb — rides the surface line and porpoises on drag */}
        <div
          className="pointer-events-none absolute bottom-8"
          style={{
            left: `calc(0.75rem + ${fraction} * (100% - 1.5rem))`,
            transform: "translateX(-50%)",
            transition: dragging ? "none" : "left 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          {/* Splash ring under the dolphin */}
          <div className="absolute -bottom-1 left-1/2 h-2 w-12 -translate-x-1/2 rounded-[100%] bg-white/50 blur-[2px]" />
          <div className={motionClass}>
            <Dolphin />
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <label htmlFor={inputId} className="text-sm font-semibold text-slate-700">
          Or enter any amount:
        </label>
        <div className="flex items-center rounded-xl border border-slate-300 bg-white px-3 py-1.5 focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-200">
          <span className="text-slate-500">$</span>
          <input
            id={inputId}
            type="number"
            inputMode="decimal"
            min={1}
            step={1}
            value={Number.isFinite(amount) ? amount : ""}
            onChange={(event) => onChange(Math.max(0, Number(event.target.value)))}
            className="w-24 border-0 bg-transparent px-1 text-lg font-semibold tabular-nums outline-none"
          />
        </div>
        {custom && amount > MAX && (
          <span className="text-xs font-medium text-sky-700">Wow — the dolphin's maxed out! 🐬</span>
        )}
      </div>

      <style>{`
        /* Porpoising: a leaping arc up-and-over, nose leading, splashing back down. */
        @keyframes dolphinPorpoise {
          0%   { transform: translateY(2px)   rotate(-14deg) scaleY(1); }
          20%  { transform: translateY(-14px) rotate(-24deg); }
          50%  { transform: translateY(-24px) rotate(4deg); }
          80%  { transform: translateY(-12px) rotate(22deg); }
          100% { transform: translateY(2px)   rotate(-14deg) scaleY(0.96); }
        }
        /* Idle: gentle bob riding the swell. */
        @keyframes dolphinBob {
          0%, 100% { transform: translateY(0)    rotate(-4deg); }
          50%      { transform: translateY(-5px) rotate(3deg); }
        }
        @keyframes waveDriftA { from { transform: translateX(0); } to { transform: translateX(-50px); } }
        @keyframes waveDriftB { from { transform: translateX(0); } to { transform: translateX(-40px); } }
        @keyframes waveDriftC { from { transform: translateX(0); } to { transform: translateX(-30px); } }

        .dolphin-porpoise { animation: dolphinPorpoise 0.75s ease-in-out infinite; transform-origin: 50% 80%; }
        .dolphin-bob      { animation: dolphinBob 2.6s ease-in-out infinite; transform-origin: 50% 80%; }
        .wave-back  { animation: waveDriftA 6s linear infinite; }
        .wave-mid   { animation: waveDriftB 4.5s linear infinite; }
        .wave-front { animation: waveDriftC 3.5s linear infinite; }

        @media (prefers-reduced-motion: reduce) {
          .dolphin-porpoise, .dolphin-bob,
          .wave-back, .wave-mid, .wave-front { animation: none; }
        }
      `}</style>
    </div>
  );
}

/**
 * A cute cartoon dolphin, facing right, mid-leap. Soft blue body, lighter belly,
 * curved dorsal + pectoral fins, a friendly eye and a little smile.
 */
function Dolphin() {
  return (
    <svg
      width="60"
      height="60"
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className="drop-shadow-[0_3px_4px_rgba(2,32,71,0.35)]"
    >
      <defs>
        <linearGradient id="dolphinBody" x1="12" y1="10" x2="52" y2="54" gradientUnits="userSpaceOnUse">
          <stop stopColor="#5eb3f6" />
          <stop offset="1" stopColor="#2563eb" />
        </linearGradient>
      </defs>

      {/* Tail fluke */}
      <path
        d="M11 46c-4-1-8 1-9 5 4 1 6-1 8-2 1 3 0 6-2 8 5 0 8-4 8-8 0-2-2-3-5-3z"
        fill="url(#dolphinBody)"
      />

      {/* Main body: an arched leaping curve, nose up-right */}
      <path
        d="M13 44c3-16 15-30 34-31 6 0 10 3 12 8-6-2-11-1-15 2 5 1 8 4 9 9-5-3-10-3-14-1-4 8-13 14-24 14-2 0-4-4-2-4z"
        fill="url(#dolphinBody)"
      />

      {/* Belly highlight */}
      <path
        d="M17 42c3-12 12-23 27-25-8 5-14 14-16 24-4 3-9 3-11 1z"
        fill="#bfe0ff"
        opacity="0.85"
      />

      {/* Dorsal fin */}
      <path d="M30 15c2-6 7-9 12-9-3 3-4 7-3 11-3-2-6-2-9-2z" fill="#2f7fe0" />

      {/* Pectoral fin */}
      <path d="M31 39c-3 4-8 6-13 5 4-4 8-6 13-5z" fill="#2f7fe0" />

      {/* Eye + smile */}
      <circle cx="50" cy="20" r="2.4" fill="#0b2545" />
      <circle cx="50.9" cy="19.1" r="0.8" fill="#ffffff" />
      <path d="M52 25c2 1 4 1 5-1" stroke="#0b2545" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
