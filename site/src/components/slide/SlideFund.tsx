import { useEffect, useState } from "react";
import { GOAL, VENMO_URL, formatUSD, formatUSDShort } from "./config";
import { fetchView, submitDonation, type PublicView } from "./api";

const POLL_MS = 10_000;

export default function SlideFund() {
  const [view, setView] = useState<PublicView | null>(null);
  const [amount, setAmount] = useState<number>(20);
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    const load = () => fetchView().then((v) => alive && setView(v)).catch(() => {});
    load();
    const id = setInterval(load, POLL_MS);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  const raised = view?.raisedSelfReported ?? 0;
  const pct = Math.min(100, (raised / GOAL) * 100);
  const previewPct = Math.min(100, ((raised + amount) / GOAL) * 100);

  async function handleSelfReport() {
    setStatus("sending");
    setError("");
    try {
      const updated = await submitDonation({ amount, name: name.trim(), note: note.trim() });
      setView(updated);
      setStatus("done");
      setName("");
      setNote("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      {/* Thermometer (plain bar for now) */}
      <div className="mb-6">
        <div className="mb-1 flex justify-between text-sm font-semibold">
          <span>{formatUSDShort(raised)} raised</span>
          <span>Goal {formatUSD(GOAL)}</span>
        </div>
        <div className="relative h-6 w-full overflow-hidden rounded-full bg-blue-100">
          <div className="absolute inset-y-0 left-0 bg-blue-300/60" style={{ width: `${previewPct}%` }} />
          <div className="absolute inset-y-0 left-0 bg-blue-600 transition-[width] duration-700" style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-1 text-sm text-slate-600">
          {raised >= GOAL ? "Goal reached — thank you! 🎉" : `${formatUSD(GOAL - raised)} to go`}
        </p>
      </div>

      {/* Amount picker (plain input for now) */}
      <label className="block text-sm font-semibold">Amount</label>
      <input
        type="number"
        min={1}
        step={1}
        value={amount}
        onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
        className="mt-1 w-32 rounded-lg border border-slate-300 px-3 py-2 text-lg"
      />

      {/* Donate via Venmo */}
      <div className="mt-4">
        <a
          href={VENMO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-full bg-[#008CFF] px-6 py-3 font-bold text-white"
        >
          Donate {formatUSD(amount)} via Venmo
        </a>
        <p className="mt-1 text-xs text-slate-500">
          Opens Venmo (@tinybiggs). Enter the amount there, then tell the thermometer below.
        </p>
      </div>

      {/* Self-report */}
      <div className="mt-6 rounded-xl border border-slate-200 p-4">
        <p className="font-semibold">After you pay, add it to the total:</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <input
            placeholder="Name (optional)"
            value={name}
            maxLength={40}
            onChange={(e) => setName(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2"
          />
          <input
            placeholder="Note (optional)"
            value={note}
            maxLength={140}
            onChange={(e) => setNote(e.target.value)}
            className="grow rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>
        <button
          onClick={handleSelfReport}
          disabled={status === "sending"}
          className="mt-3 rounded-full bg-emerald-600 px-5 py-2 font-bold text-white disabled:opacity-50"
        >
          {status === "sending" ? "Adding…" : `I chipped in ${formatUSD(amount)}`}
        </button>
        {status === "done" && <p className="mt-2 text-sm text-emerald-700">Added — thank you! 🐬</p>}
        {status === "error" && <p className="mt-2 text-sm text-red-600">{error}</p>}
        {/* Honeypot */}
        <input type="text" name="_honey" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      </div>
    </div>
  );
}
