/** Shared constants + pure math for the dolphin donation widget. */

/** The full cost of the slide — the thermometer's goal/top. */
export const GOAL = 708.49;
/** Mike's kickoff donation, always included in the displayed total (a display
 *  baseline — NOT sent to the backend / self-report). */
export const HOST_SEED = 100;
export const VENMO_HANDLE = "tinybiggs";
export const VENMO_URL = `https://venmo.com/u/${VENMO_HANDLE}`;

// $10–$60 by 10, then $80–$300 by 20. 18 evenly-spaced stops along the track.
export const STOPS: number[] = [
  10, 20, 30, 40, 50, 60,
  80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300,
];
export const MIN = STOPS[0];
export const MAX = STOPS[STOPS.length - 1];

/** Nearest stop to an arbitrary amount, clamped to [MIN, MAX]. */
export function snapToStop(amount: number): number {
  if (amount <= MIN) return MIN;
  if (amount >= MAX) return MAX;
  let best = STOPS[0];
  let bestDist = Infinity;
  for (const stop of STOPS) {
    const dist = Math.abs(stop - amount);
    if (dist < bestDist) {
      bestDist = dist;
      best = stop;
    }
  }
  return best;
}

/** Track fraction (0..1) for a stop index. Stops are evenly spaced. */
export function fractionForAmount(amount: number): number {
  const snapped = snapToStop(amount);
  const idx = STOPS.indexOf(snapped);
  return idx / (STOPS.length - 1);
}

/** Amount (a stop value) for a track fraction (0..1). */
export function amountForFraction(fraction: number): number {
  const clamped = Math.max(0, Math.min(1, fraction));
  const idx = Math.round(clamped * (STOPS.length - 1));
  return STOPS[idx];
}

/** Clamp a number to the inclusive [lo, hi] range. */
export function clamp(value: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, value));
}

/**
 * Fraction (0..1) of the full goal that a raised total represents.
 * Drives the thermometer's mercury height from the bulb.
 */
export function goalFraction(raised: number): number {
  return clamp(raised / GOAL, 0, 1);
}

export function formatUSD(n: number): string {
  return `$${n.toFixed(2)}`;
}

/** Whole-dollar formatting for compact labels ($20, $1,000). */
export function formatUSDShort(n: number): string {
  return `$${Math.round(n).toLocaleString("en-US")}`;
}
