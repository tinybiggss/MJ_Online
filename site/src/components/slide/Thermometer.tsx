import { useEffect, useRef, useState } from "react";
import { COMMUNITY_GOAL, communityFraction, formatUSDShort } from "./config";
import Fireworks from "./Fireworks";

interface Props {
  /** Real, committed total raised (drives the mercury height). */
  raised: number;
  /** The donor's currently-selected amount — a translucent preview stacked on top. */
  yourAmount: number;
  /** Bump to fire a celebratory finale (e.g. a committed chip-in). */
  celebrate: number;
}

// Geometry of the glass tube within the SVG viewBox (100 x 320 user units).
// The firework canvas maps fractions to these same coordinates so the rocket
// launches from the bulb and bursts at the live fill line.
const VB_W = 100;
const VB_H = 320;
const TUBE_X = 50; // horizontal centre of the tube/bulb
const TUBE_W = 34; // tube outer width
const TUBE_TOP = 18; // y of the very top of the tube (the goal line)
const BULB_CY = 286; // y of the bulb centre (the launch point / zero level)
const BULB_R = 30; // bulb radius
// The fill rect spans from the bulb bottom up to the goal line and is scaled
// vertically by its fraction. FILL_BOTTOM is the rect's bottom edge (bulb
// bottom); FILL_TOP is the goal line. fillY() must match the *visible* surface
// of that scaled rect so the firework anchors exactly to the mercury top.
const FILL_TOP = TUBE_TOP + 6;
const FILL_BOTTOM = BULB_CY + BULB_R; // bulb bottom = scale origin (frac 0)

/** y (in viewBox units) for a 0..1 fill fraction. 0 = bulb bottom, 1 = goal line. */
function fillY(frac: number): number {
  return FILL_BOTTOM - frac * (FILL_BOTTOM - FILL_TOP);
}

export default function Thermometer({ raised, yourAmount, celebrate }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [reduce, setReduce] = useState(false);
  // Pixel size of the rendered SVG, so the canvas overlay can convert the
  // tube's viewBox coordinates into real device pixels for the firework.
  const [box, setBox] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => setBox({ width: el.offsetWidth, height: el.offsetHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const totalFrac = communityFraction(raised);
  const stackedFrac = communityFraction(raised + Math.max(0, yourAmount));
  const reached = raised >= COMMUNITY_GOAL;
  const gradId = "thermo-mercury";
  const glassId = "thermo-glass";

  // Convert viewBox units → CSS pixels for the firework overlay. The SVG uses
  // preserveAspectRatio="xMidYMid meet", so it scales uniformly and may letterbox.
  const scale = Math.min(box.width / VB_W, box.height / VB_H) || 0;
  const offsetX = (box.width - VB_W * scale) / 2;
  const offsetY = (box.height - VB_H * scale) / 2;
  const toPx = (xUnits: number, yUnits: number) => ({
    x: offsetX + xUnits * scale,
    y: offsetY + yUnits * scale,
  });

  // Pixel anchors the firework needs: bulb (launch), goal line (top), and the
  // live total / stacked fill lines. Tube width in px for burst sizing.
  const bulbPx = toPx(TUBE_X, BULB_CY);
  const topPx = toPx(TUBE_X, FILL_TOP);
  const totalPx = toPx(TUBE_X, fillY(totalFrac));
  const stackedPx = toPx(TUBE_X, fillY(stackedFrac));
  const tubePxWidth = TUBE_W * scale;

  // Tick marks at 1/4, 1/2, 3/4, and the goal.
  const ticks = [0.25, 0.5, 0.75, 1];

  return (
    <div className="flex w-full flex-col items-center">
      <div className="mb-2 text-center">
        <div className="font-display text-base font-black tabular-nums text-slate-900 sm:text-lg">
          {formatUSDShort(raised)}
        </div>
        <div className="text-[0.62rem] font-semibold uppercase tracking-wide text-slate-500 sm:text-[0.7rem]">
          of {formatUSDShort(COMMUNITY_GOAL)}
        </div>
      </div>

      <div ref={wrapRef} className="relative h-64 w-full sm:h-80">
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          preserveAspectRatio="xMidYMid meet"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          <defs>
            {/* Festive amber → red mercury. */}
            <linearGradient id={gradId} x1="0" y1={FILL_BOTTOM} x2="0" y2={FILL_TOP} gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#dc2626" />
              <stop offset="0.55" stopColor="#f97316" />
              <stop offset="1" stopColor="#fbbf24" />
            </linearGradient>
            <linearGradient id={glassId} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#ffffff" stopOpacity="0.35" />
              <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.05" />
              <stop offset="1" stopColor="#ffffff" stopOpacity="0.25" />
            </linearGradient>
            {/* Clip so mercury + preview stay inside the glass silhouette. */}
            <clipPath id="thermo-clip">
              <path
                d={`M${TUBE_X - TUBE_W / 2} ${TUBE_TOP + TUBE_W / 2}
                    a ${TUBE_W / 2} ${TUBE_W / 2} 0 0 1 ${TUBE_W} 0
                    L${TUBE_X + TUBE_W / 2} ${BULB_CY - BULB_R + 6}
                    a ${BULB_R} ${BULB_R} 0 1 1 ${-TUBE_W} 0
                    Z`}
              />
            </clipPath>
          </defs>

          {/* Glass tube + bulb background */}
          <g>
            <path
              d={`M${TUBE_X - TUBE_W / 2} ${TUBE_TOP + TUBE_W / 2}
                  a ${TUBE_W / 2} ${TUBE_W / 2} 0 0 1 ${TUBE_W} 0
                  L${TUBE_X + TUBE_W / 2} ${BULB_CY - BULB_R + 6}
                  a ${BULB_R} ${BULB_R} 0 1 1 ${-TUBE_W} 0
                  Z`}
              fill="#e2e8f0"
            />
          </g>

          {/* Fill layers, clipped to the glass. Each is a full-span rect (bulb →
              goal line) scaled vertically by its fraction from a bulb-anchored
              origin. Using transform: scaleY (GPU-composited, cross-browser)
              instead of animating y/height (SVG geometry transitions don't work
              in Safari and would thrash layout elsewhere). */}
          <g clipPath="url(#thermo-clip)">
            {/* Preview (your amount) — translucent, stacked above the mercury. */}
            {yourAmount > 0 && stackedFrac > totalFrac && (
              <rect
                className={reduce ? "thermo-fill" : "thermo-fill thermo-fill-anim thermo-preview-pulse"}
                x={TUBE_X - BULB_R}
                y={FILL_TOP}
                width={BULB_R * 2}
                height={FILL_BOTTOM - FILL_TOP}
                fill="#fbbf24"
                opacity="0.4"
                style={{ transform: `scaleY(${stackedFrac})` }}
              />
            )}
            {/* Real mercury. */}
            <rect
              className={reduce ? "thermo-fill" : "thermo-fill thermo-fill-anim"}
              x={TUBE_X - BULB_R}
              y={FILL_TOP}
              width={BULB_R * 2}
              height={FILL_BOTTOM - FILL_TOP}
              fill={`url(#${gradId})`}
              style={{ transform: `scaleY(${totalFrac})` }}
            />
          </g>

          {/* Glass sheen + outline on top of the fill. */}
          <path
            d={`M${TUBE_X - TUBE_W / 2} ${TUBE_TOP + TUBE_W / 2}
                a ${TUBE_W / 2} ${TUBE_W / 2} 0 0 1 ${TUBE_W} 0
                L${TUBE_X + TUBE_W / 2} ${BULB_CY - BULB_R + 6}
                a ${BULB_R} ${BULB_R} 0 1 1 ${-TUBE_W} 0
                Z`}
            fill={`url(#${glassId})`}
            stroke="#94a3b8"
            strokeWidth="2"
          />

          {/* Tick marks + goal label anchor */}
          {ticks.map((t) => {
            const y = fillY(t);
            return (
              <g key={t}>
                <line
                  x1={TUBE_X + TUBE_W / 2 + 2}
                  y1={y}
                  x2={TUBE_X + TUBE_W / 2 + 9}
                  y2={y}
                  stroke="#64748b"
                  strokeWidth="1.6"
                />
              </g>
            );
          })}

          {/* Goal marker at the top */}
          <circle cx={TUBE_X} cy={FILL_TOP - 2} r="3" fill={reached ? "#16a34a" : "#64748b"} />
        </svg>

        {/* Firework overlay — anchored to the tube's pixel coordinates. */}
        <Fireworks
          bulb={bulbPx}
          top={topPx}
          totalLine={totalPx}
          stackedLine={stackedPx}
          totalFrac={totalFrac}
          stackedFrac={stackedFrac}
          tubeWidth={tubePxWidth}
          celebrate={celebrate}
        />
      </div>

      {/* Goal caption */}
      <p className="mt-2 w-full text-center text-[0.7rem] font-medium leading-tight text-slate-600 sm:text-xs">
        {reached ? (
          <span className="font-semibold text-green-700">Goal! 🎉</span>
        ) : (
          <>{formatUSDShort(COMMUNITY_GOAL - raised)} to go</>
        )}
      </p>

      <style>{`
        /* Fill rects scale up from the bulb. transform-box: fill-box makes the
           SVG transform-origin resolve within the rect's own bounding box. */
        .thermo-fill {
          transform-box: fill-box;
          transform-origin: 50% 100%;
        }
        .thermo-fill-anim { transition: transform 0.7s cubic-bezier(0.25, 1, 0.5, 1); }
        @keyframes thermoPreviewPulse { 0%, 100% { opacity: 0.28; } 50% { opacity: 0.5; } }
        .thermo-preview-pulse { animation: thermoPreviewPulse 2.4s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .thermo-fill-anim { transition: none; }
          .thermo-preview-pulse { animation: none; }
        }
      `}</style>
    </div>
  );
}
