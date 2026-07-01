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
 * STOPS; a number box allows ANY custom amount (incl. > $300, which parks the
 * dolphin at the far right; empty/invalid means "no amount").
 *
 * Motion: as the amount changes the dolphin GLIDES to its new spot, arcing up
 * and diving back with a little splash — porpoising across the water. A gentle
 * bob plays at idle. Fully keyboard-, touch-, and mouse-driven with a proper
 * ARIA slider role. Respects prefers-reduced-motion (plain slide, no arc/splash).
 */
export default function DolphinSlider({ amount, onChange }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [reduce, setReduce] = useState(false);
  // The custom-amount field owns its own text so it can be fully cleared and
  // typed into freely; it re-syncs to `amount` when the amount changes elsewhere.
  const [inputText, setInputText] = useState<string>(amount > 0 ? String(amount) : "");
  // Guards the sync effect so our own typing doesn't get clobbered mid-keystroke.
  const typingRef = useRef(false);
  // Bumped whenever the dolphin's target position changes, to (re)trigger the arc.
  const [hop, setHop] = useState(0);
  const prevFractionRef = useRef(fractionForAmount(amount));
  const inputId = useId();
  // Unique id for the dolphin's SVG gradient so multiple instances never collide.
  const gradientId = `${inputId}-dolphinBody`;

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
  const custom = amount > 0 && amount !== snapped;

  // Keep the field text in sync when the amount changes from the slider/keys,
  // but never fight the user while they're actively typing in the field.
  useEffect(() => {
    if (typingRef.current) return;
    setInputText(amount > 0 ? String(amount) : "");
  }, [amount]);

  // When the target position changes, trigger a porpoise arc (glide + splash).
  useEffect(() => {
    if (prevFractionRef.current !== fraction) {
      prevFractionRef.current = fraction;
      if (!reduce && !dragging) setHop((h) => h + 1);
    }
  }, [fraction, reduce, dragging]);

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

  // Typing OVERRIDES the slider: an empty/invalid value means "no amount" (0),
  // a valid number sets the amount directly and moves the dolphin to it.
  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value;
    typingRef.current = true;
    setInputText(raw);
    if (raw.trim() === "") {
      onChange(0);
    } else {
      const parsed = Number(raw);
      // Ignore non-numeric junk; keep the last valid amount but let the text stand.
      if (Number.isFinite(parsed) && parsed >= 0) onChange(parsed);
    }
    // Release the typing guard after this tick so external syncs resume.
    queueMicrotask(() => {
      typingRef.current = false;
    });
  };

  // Idle bob vs. the transient porpoise arc. The arc is keyed by `hop` so each
  // move restarts it; between hops we fall back to the gentle bob.
  const dolphinMotion = reduce ? "" : dragging ? "dolphin-drag" : "dolphin-bob";

  return (
    <div className="select-none">
      <div className="mb-1 flex items-baseline justify-between">
        <span className="text-sm font-semibold text-slate-800">Slide the dolphin to pick an amount</span>
        <span
          className="rounded-full bg-white/80 px-2.5 py-0.5 text-sm font-black tabular-nums text-sky-700 ring-1 ring-inset ring-sky-200"
          aria-hidden="true"
        >
          {amount > 0 ? formatUSDShort(amount) : "—"}
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

        {/* The dolphin thumb — glides smoothly between spots, arcing on each move. */}
        <div
          className="pointer-events-none absolute bottom-8"
          style={{
            left: `calc(0.75rem + ${fraction} * (100% - 1.5rem))`,
            transform: "translateX(-50%)",
            // Smooth eased horizontal glide (ease-out-quart) unless dragging.
            transition: dragging ? "none" : "left 0.32s cubic-bezier(0.25, 1, 0.5, 1)",
          }}
        >
          {/* Splash ring — a fresh one plays each hop (keyed) unless reduced. */}
          {!reduce && (
            <div key={`splash-${hop}`} className="dolphin-splash absolute -bottom-1 left-1/2 h-2 w-14 -translate-x-1/2 rounded-[100%] bg-white/70 blur-[1px]" />
          )}
          {reduce && (
            <div className="absolute -bottom-1 left-1/2 h-2 w-12 -translate-x-1/2 rounded-[100%] bg-white/50 blur-[2px]" />
          )}
          {/* Arc wrapper: keyed by `hop` so the leap restarts on every move. */}
          <div key={`arc-${hop}`} className={reduce ? "" : dragging ? "" : "dolphin-arc"}>
            <div className={dolphinMotion}>
              <Dolphin gradientId={gradientId} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <label htmlFor={inputId} className="text-sm font-semibold text-slate-800">
          Or enter any amount:
        </label>
        <div className="flex items-center rounded-xl border border-slate-300 bg-white px-3 py-1.5 focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-200">
          <span className="text-slate-500">$</span>
          <input
            id={inputId}
            type="text"
            inputMode="decimal"
            placeholder="0"
            value={inputText}
            onChange={onInputChange}
            className="w-24 border-0 bg-transparent px-1 text-lg font-semibold tabular-nums text-slate-900 outline-none placeholder:font-normal placeholder:text-slate-400"
          />
        </div>
        {custom && amount > MAX && (
          <span className="text-xs font-medium text-sky-700">Wow — the dolphin's maxed out! 🐬</span>
        )}
      </div>

      <style>{`
        /* Idle: gentle bob riding the swell. */
        @keyframes dolphinBob {
          0%, 100% { transform: translateY(0)    rotate(-4deg); }
          50%      { transform: translateY(-5px) rotate(3deg); }
        }
        /* While dragging: livelier continuous porpoise. */
        @keyframes dolphinDrag {
          0%   { transform: translateY(2px)   rotate(-16deg); }
          50%  { transform: translateY(-16px) rotate(6deg); }
          100% { transform: translateY(2px)   rotate(-16deg); }
        }
        /* Per-move leap: rise up, arc over, dive back down. Plays once per hop. */
        @keyframes dolphinArc {
          0%   { transform: translateY(0)    rotate(-10deg); }
          35%  { transform: translateY(-22px) rotate(-2deg); }
          70%  { transform: translateY(-8px)  rotate(14deg); }
          100% { transform: translateY(0)    rotate(0deg); }
        }
        /* Landing splash: a quick expand-and-fade of the surface ring. */
        @keyframes dolphinSplash {
          0%   { transform: translateX(-50%) scaleX(0.4); opacity: 0; }
          55%  { transform: translateX(-50%) scaleX(0.5); opacity: 0; }
          70%  { transform: translateX(-50%) scaleX(1);   opacity: 0.85; }
          100% { transform: translateX(-50%) scaleX(1.7); opacity: 0; }
        }
        @keyframes waveDriftA { from { transform: translateX(0); } to { transform: translateX(-50px); } }
        @keyframes waveDriftB { from { transform: translateX(0); } to { transform: translateX(-40px); } }
        @keyframes waveDriftC { from { transform: translateX(0); } to { transform: translateX(-30px); } }

        .dolphin-bob   { animation: dolphinBob 2.6s ease-in-out infinite; transform-origin: 50% 80%; }
        .dolphin-drag  { animation: dolphinDrag 0.7s ease-in-out infinite; transform-origin: 50% 80%; }
        .dolphin-arc   { animation: dolphinArc 0.34s cubic-bezier(0.25, 1, 0.5, 1) 1; transform-origin: 50% 80%; }
        .dolphin-splash{ animation: dolphinSplash 0.5s ease-out 1; }
        .wave-back  { animation: waveDriftA 6s linear infinite; }
        .wave-mid   { animation: waveDriftB 4.5s linear infinite; }
        .wave-front { animation: waveDriftC 3.5s linear infinite; }

        @media (prefers-reduced-motion: reduce) {
          .dolphin-bob, .dolphin-drag, .dolphin-arc, .dolphin-splash,
          .wave-back, .wave-mid, .wave-front { animation: none; }
        }
      `}</style>
    </div>
  );
}

/**
 * A friendly cartoon dolphin, facing right, mid-leap: curved body, a clear
 * dorsal fin, a swept tail fluke, a pointed beak/rostrum, a pectoral fin, and
 * a smiling eye. Soft blue gradient body with a lighter belly.
 */
function Dolphin({ gradientId }: { gradientId: string }) {
  return (
    <svg
      width="66"
      height="66"
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className="drop-shadow-[0_3px_4px_rgba(2,32,71,0.35)]"
    >
      <defs>
        <linearGradient id={gradientId} x1="10" y1="8" x2="50" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6cbcf7" />
          <stop offset="1" stopColor="#2563eb" />
        </linearGradient>
      </defs>

      {/* Tail fluke — two lobes sweeping off the lower-left */}
      <path
        d="M7 50c-3.5-.5-6.5 1.2-7.5 4.4 3.2.6 5-.8 6.7-1.9.4 2.6-.4 4.9-2.1 6.6 4-.2 6.9-3 7.4-6.4l.1-1.3c-1.2-.6-2.8-1.2-4.6-1.4z"
        fill={`url(#${gradientId})`}
      />

      {/* Main body: a smooth arched leap from the tail (lower-left) up to the
          beak (upper-right). One continuous curved silhouette. */}
      <path
        d="M9 52
           C 12 40, 18 26, 30 18
           C 38 12, 47 9, 56 9
           C 53 12, 49 14, 45 15
           C 51 16, 55 20, 56 26
           C 51 22, 45 22, 40 25
           C 33 40, 22 51, 12 54
           C 9.5 54.7, 8.4 53.4, 9 52 Z"
        fill={`url(#${gradientId})`}
      />

      {/* Belly highlight following the body's underside */}
      <path
        d="M13 51
           C 16 40, 22 27, 33 20
           C 28 28, 24 37, 23 45
           C 20 49, 16 51, 13 51 Z"
        fill="#c7e6ff"
        opacity="0.85"
      />

      {/* Dorsal fin rising off the mid-back */}
      <path d="M31 17c1.6-6.5 6.4-10.2 12.4-10.4-3.2 3.2-4.6 7.4-3.6 11.8-2.9-2.4-6-2.6-8.8-1.4z" fill="#2f7fe0" />

      {/* Pectoral fin sweeping down from the belly */}
      <path d="M31 40c-3 4.6-8 7.2-13.6 6.4 4.2-4.4 8.6-6.8 13.6-6.4z" fill="#2f7fe0" />

      {/* Beak/rostrum tip highlight */}
      <path d="M52 12c1.6-.8 3.2-1.4 4-2.6-1.8.2-3.4.6-5 1.2z" fill="#c7e6ff" opacity="0.8" />

      {/* Eye + smile near the beak */}
      <circle cx="49" cy="19" r="2.4" fill="#0b2545" />
      <circle cx="49.9" cy="18.1" r="0.8" fill="#ffffff" />
      <path d="M51.5 24c2 1.2 4 1 5.4-1" stroke="#0b2545" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
