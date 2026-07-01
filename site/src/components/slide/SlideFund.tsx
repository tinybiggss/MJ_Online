import { useEffect, useState } from "react";
import { VENMO_URL, formatUSD } from "./config";
import { fetchView, submitDonation, type PublicView } from "./api";
import Thermometer from "./Thermometer";
import DolphinSlider from "./DolphinSlider";

const POLL_MS = 10_000;

export default function SlideFund() {
  const [view, setView] = useState<PublicView | null>(null);
  const [amount, setAmount] = useState<number>(20);
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");
  // Honeypot: stays empty for humans; bots that autofill it get silently dropped server-side.
  const [honey, setHoney] = useState("");

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

  async function handleSelfReport() {
    setStatus("sending");
    setError("");
    try {
      const updated = await submitDonation({
        amount,
        name: name.trim(),
        note: note.trim(),
        _honey: honey,
      });
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
      <Thermometer raised={raised} preview={amount} />

      {/* Dolphin slider — the dolphin IS the thumb */}
      <div className="mb-6 rounded-3xl bg-sky-50 p-3 ring-1 ring-inset ring-sky-100">
        <DolphinSlider amount={amount} onChange={setAmount} />
      </div>

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
        {/* Honeypot: visually hidden, off the tab order, ignored by AT. Bots that fill it get dropped. */}
        <input
          type="text"
          name="_honey"
          value={honey}
          onChange={(e) => setHoney(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
