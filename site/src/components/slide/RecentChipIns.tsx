import { formatUSDShort } from "./config";
import type { PublicView } from "./api";

export default function RecentChipIns({ recent }: { recent: PublicView["recent"] }) {
  if (!recent.length) {
    return <p className="mt-6 text-center text-sm text-field-faint">Be the first to chip in! 🐬</p>;
  }
  return (
    <div className="mt-8">
      <h2 className="mb-2 font-display text-sm font-bold uppercase tracking-wide text-field-faint">Recent chip-ins</h2>
      <ul className="divide-y divide-field-line">
        {recent.map((r, i) => (
          <li key={i} className="flex items-baseline justify-between py-2">
            <span className="text-field-ink">
              <strong>{r.name}</strong>
              {r.note && <span className="text-field-muted"> — "{r.note}"</span>}
            </span>
            <span className="font-semibold text-signal">{formatUSDShort(r.amount)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
