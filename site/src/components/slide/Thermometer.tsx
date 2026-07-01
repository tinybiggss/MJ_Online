import { GOAL, formatUSD, formatUSDShort } from "./config";

interface Props {
  raised: number;
  /** The donor's currently-selected amount, shown as a translucent preview on top. */
  preview: number;
}

export default function Thermometer({ raised, preview }: Props) {
  const pct = Math.min(100, (raised / GOAL) * 100);
  const previewPct = Math.min(100, ((raised + preview) / GOAL) * 100);
  const reached = raised >= GOAL;

  return (
    <div className="mb-6" aria-live="polite">
      <div className="mb-1 flex justify-between text-sm font-semibold text-slate-700">
        <span>{formatUSDShort(raised)} raised</span>
        <span>Goal {formatUSD(GOAL)}</span>
      </div>
      <div className="relative h-8 w-full overflow-hidden rounded-full bg-sky-100 ring-1 ring-inset ring-sky-200">
        {/* Preview: what your selected amount would add */}
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-sky-300/70 to-amber-300/70 transition-[width] duration-200"
          style={{ width: `${previewPct}%` }}
        />
        {/* Real, committed total */}
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-600 to-sky-500 transition-[width] duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
        {preview > 0 && previewPct > pct && (
          <div
            className="absolute inset-y-0 flex items-center whitespace-nowrap px-2 text-xs font-semibold text-amber-900"
            style={{ left: `min(${pct}%, 70%)` }}
          >
            + your {formatUSD(preview)}
          </div>
        )}
      </div>
      <p className="mt-1 text-sm text-slate-600">
        {reached ? "Goal reached — thank you! 🎉" : `${formatUSD(GOAL - raised)} to go`}
      </p>
    </div>
  );
}
