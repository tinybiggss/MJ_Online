import { useEffect, useState } from "react";
import { VENMO_URL, formatUSD } from "./config";
import { fetchView, submitDonation, type PublicView } from "./api";
import Thermometer from "./Thermometer";
import DolphinSlider from "./DolphinSlider";
import Fireworks, { amountToIntensity } from "./Fireworks";
import RecentChipIns from "./RecentChipIns";

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
  // Bumped on a committed chip-in to trigger a fireworks finale.
  const [celebrate, setCelebrate] = useState(0);

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
      setCelebrate((c) => c + 1);
      setName("");
      setNote("");
      setHoney("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      {/* Night-sky stage: fireworks glow behind the thermometer + dolphin slider.
          Bursts get bigger/more frequent as the amount climbs; a finale fires on commit. */}
      <div className="relative mb-6 overflow-hidden rounded-3xl bg-gradient-to-b from-[#0a1440] via-[#122a6b] to-[#1e3a8a] p-5 shadow-xl ring-1 ring-inset ring-white/10">
        <Fireworks intensity={amountToIntensity(amount)} celebrate={celebrate} />
        <div className="relative z-10 space-y-4">
          {/* Light cards keep the (dark-text) thermometer + slider readable over the night sky. */}
          <div className="rounded-2xl bg-white/92 p-4 shadow-lg ring-1 ring-inset ring-white/60 backdrop-blur-sm">
            <Thermometer raised={raised} preview={amount} />
          </div>

          {/* Dolphin slider — the dolphin IS the thumb */}
          <div className="rounded-3xl bg-sky-50 p-3 shadow-lg ring-1 ring-inset ring-sky-100">
            <DolphinSlider amount={amount} onChange={setAmount} />
          </div>
        </div>
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
        <p className="mt-1 text-xs text-field-faint">
          Opens Venmo (@tinybiggs). Enter the amount there, then tell the thermometer below.
        </p>
      </div>

      {/* Self-report */}
      <div className="mt-6 rounded-xl border border-field-line bg-field-panel p-4">
        <p className="font-display font-semibold text-field-ink">After you pay, add it to the total:</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <input
            placeholder="Name (optional)"
            value={name}
            maxLength={40}
            onChange={(e) => setName(e.target.value)}
            className="rounded-lg border border-field-line bg-field-panel-2 px-3 py-2 text-field-ink placeholder:text-field-faint"
          />
          <input
            placeholder="Note (optional)"
            value={note}
            maxLength={140}
            onChange={(e) => setNote(e.target.value)}
            className="grow rounded-lg border border-field-line bg-field-panel-2 px-3 py-2 text-field-ink placeholder:text-field-faint"
          />
        </div>
        <button
          onClick={handleSelfReport}
          disabled={status === "sending"}
          className="mt-3 rounded-full bg-signal px-5 py-2 font-bold text-field-bg transition-colors hover:bg-signal-deep disabled:opacity-50"
        >
          {status === "sending" ? "Adding…" : `I chipped in ${formatUSD(amount)}`}
        </button>
        {status === "done" && <p className="mt-2 text-sm text-signal">Added — thank you! 🐬</p>}
        {status === "error" && <p className="mt-2 text-sm text-danger">{error}</p>}
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

      {view && <RecentChipIns recent={view.recent} />}
    </div>
  );
}
