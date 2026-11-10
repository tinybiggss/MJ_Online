#!/usr/bin/env node
/**
 * atlas-build.mjs — derive the public system atlas from the live scheduler.
 *
 * Two halves, deliberately:
 *   DERIVED  (this script)  — how many loops exist, their real schedules, their
 *                             delivery channels, whether each one last ran clean.
 *   CURATED  (atlas.curated.json) — what each loop is FOR, which pattern it is
 *                             built from, and every word a reader sees.
 *
 * Output site/src/data/atlas.json is a COMMITTED artifact. It is generated here
 * on the machine that owns the scheduler and shipped in the repo, because CI has
 * no ~/.hermes and must never be handed a token that reads it. Same contract as
 * kb-to-agents.mjs: committed outputs are what ships, the commit is Mike's gate.
 *
 * Drift is a first-class output. A job that appears in the scheduler with no
 * annotation is published as an unannotated loop (visibly incomplete, never
 * invisible); a curated job that has left the scheduler is marked retired. The
 * nightly drift cron compares the two and tells Mike.
 *
 * Run: node scripts/atlas-build.mjs [--check]
 *   --check  exit 1 if the committed atlas.json disagrees with the live store
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";

const here = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(here, "..");
const outFile = resolve(siteRoot, "src/data/atlas.json");
const curatedFile = resolve(siteRoot, "src/data/atlas.curated.json");

const JOBS = resolve(homedir(), ".hermes/cron/jobs.json");
const check = process.argv.includes("--check");

const curated = JSON.parse(readFileSync(curatedFile, "utf8"));

/** Strip a specific chat id off a delivery target: telegram:-100123 -> Telegram. */
function publicChannel(raw, map) {
  return String(raw || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .map((t) => {
      const head = t.split(":")[0];
      return map[head] || (map[t] || null) || (map[head] === undefined ? "Other" : map[t]);
    })
    .filter((v, i, a) => a.indexOf(v) === i);
}

function hoursSince(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return Math.round(((Date.now() - d.getTime()) / 36e5) * 10) / 10;
}

const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** "1-5" -> [1,2,3,4,5]; "6,0" -> [6,0]; "1,4" -> [1,4]; "*" -> null */
function expandField(field) {
  if (field === "*" || field === "?") return null;
  const out = [];
  for (const part of field.split(",")) {
    const range = part.match(/^(\d+)-(\d+)$/);
    if (range) for (let i = Number(range[1]); i <= Number(range[2]); i++) out.push(i);
    else out.push(Number(part));
  }
  return out;
}

/** A five-field cron expression, said out loud. Falls back to the raw expression. */
function humanCadence(job) {
  const disp = String(job.schedule_display || job.schedule?.display || job.schedule?.expr || "").trim();

  const everyN = disp.match(/^every (\d+)m$/i);
  if (everyN) {
    const mins = Number(everyN[1]);
    if (mins % 60 === 0) return mins === 60 ? "Every hour" : `Every ${mins / 60} hours`;
    return `Every ${mins} minutes`;
  }

  // Natural-language displays the scheduler already renders ("every day at 9am",
  // "every sunday 4am", "every monday 18:15") — say them the same way we say cron.
  const nl = disp.match(
    /^every\s+(day|monday|tuesday|wednesday|thursday|friday|saturday|sunday)?\s*(?:at\s*)?(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/i,
  );
  if (nl) {
    let h = Number(nl[2]);
    const mins = nl[3] || "00";
    if (nl[4]?.toLowerCase() === "pm" && h < 12) h += 12;
    if (nl[4]?.toLowerCase() === "am" && h === 12) h = 0;
    const clock = `${String(h).padStart(2, "0")}:${mins}`;
    const day = nl[1]?.toLowerCase();
    if (!day || day === "day") return `Daily, ${clock}`;
    return `${DOW.find((d) => d.toLowerCase() === day.slice(0, 3))}, ${clock}`;
  }

  const parts = disp.split(/\s+/);
  if (parts.length !== 5) return disp;
  const [minF, hourF, domF, monF, dowF] = parts;
  if (domF === "*" && monF === "*" && dowF === "*" && /^\*\/\d+$/.test(hourF)) {
    // minute-granularity loop expressed in the hour field
    return null;
  }

  const minutes = expandField(minF);
  const hours = expandField(hourF);
  const doms = expandField(domF);
  const dows = expandField(dowF);
  const mon = expandField(monF);

  const clock = (h, m = minutes || [0]) =>
    `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;

  // Times part
  let times;
  if (!hours) {
    // sub-daily frequency: the date fields cannot add anything a reader wants
    if (/^\*\/\d+$/.test(minF)) return `Every ${Number(minF.slice(2))} minutes`;
    if (minF === "*") return "Every minute";
    return `Hourly, at :${String(Number(minF)).padStart(2, "0")}`;
  } else if (hours.length === 1) {
    times = (minutes || [0]).map((m) => clock(hours[0], m)).join(" & ");
  } else {
    times = hours.map((h) => clock(h)).join(" & ");
  }

  // Date part
  if (dows) {
    const label = dows.length === 5 && dows.join() === "1,2,3,4,5" ? "Weekdays"
      : dows.length === 2 && dows.join() === "6,0" ? "Weekends"
      : dows.map((d) => DOW[d]).join(" & ");
    return `${label}, ${times}`;
  }
  if (doms) {
    const ord = (n) => (n === 1 ? "1st" : n === 2 ? "2nd" : n === 3 ? "3rd" : `${n}th`);
    const label = doms.length === 1 ? `${ord(doms[0])} of the month` : `${doms.map(ord).join(" & ")} of the month`;
    return `${label}, ${times}`;
  }
  if (mon) return `${times}, monthly`; // rare: month pinned without a day
  return `Daily, ${times}`;
}

let live = [];
if (existsSync(JOBS)) {
  const raw = JSON.parse(readFileSync(JOBS, "utf8"));
  live = typeof raw.jobs === "string" ? JSON.parse(raw.jobs) : raw.jobs;
} else if (check) {
  console.error("atlas-build: no scheduler store on this machine; cannot check drift.");
  process.exit(2);
}

if (!live.length) {
  if (existsSync(outFile)) {
    console.log("atlas-build: scheduler store unavailable — keeping committed atlas.json.");
    process.exit(0);
  }
  console.error("atlas-build: no scheduler store and no committed atlas. Nothing to build from.");
  process.exit(2);
}

const channelMap = curated.redactions.channel_map;
const loops = [];
const seen = new Set();
const unannotated = [];

for (const job of live) {
  const ann = curated.loops[job.name];
  seen.add(job.name);
  const active = job.enabled !== false && job.state !== "completed";
  const entry = {
    name: job.name,
    public_name: ann?.public_name || job.name,
    slug: (ann?.public_name || job.name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, ""),
    band: ann?.band || "tend",
    pattern: ann?.pattern || null,
    cadence: humanCadence(job),
    schedule: job.schedule_display || job.schedule?.display || job.schedule?.expr || "",
    channels: publicChannel(job.deliver, channelMap),
    state: active ? "running" : "completed",
    last_status: job.last_status || null,
    last_run_hours: hoursSince(job.last_run_at),
    failure_streak: job.failure_streak || 0,
    annotated: Boolean(ann),
    does: ann?.does || null,
    why: ann?.why || null,
  };
  if (!ann && active) unannotated.push(job.name);
  loops.push(entry);
}

// Curated loops that no longer exist in the scheduler.
const retired = Object.keys(curated.loops).filter((n) => !seen.has(n));

loops.sort((a, b) => {
  const bandOrder = curated.bands.map((b) => b.id);
  const d = bandOrder.indexOf(a.band) - bandOrder.indexOf(b.band);
  if (d !== 0) return d;
  return a.public_name.localeCompare(b.public_name);
});

const running = loops.filter((l) => l.state === "running");
const byPattern = {};
for (const l of running) byPattern[l.pattern || "unclassified"] = (byPattern[l.pattern || "unclassified"] || 0) + 1;

const stats = {
  loops_running: running.length,
  loops_total: loops.length,
  completed_oneshots: loops.filter((l) => l.state === "completed").length,
  patterns_in_use: Object.keys(byPattern).length,
  annotations_missing: unannotated.length,
  retired_annotations: retired.length,
  by_pattern: byPattern,
  generated_at: new Date().toISOString(),
};

const atlas = {
  meta: {
    version: curated.version,
    generated_at: stats.generated_at,
    source: "hermes scheduler store on the owning machine",
    contract: "committed artifact; CI ships it, never regenerates it",
  },
  hero: curated.hero,
  patterns: curated.patterns,
  bands: curated.bands,
  stats,
  loops,
  clusters: curated.clusters,
  ground: curated.ground,
  redactions: { note: curated.redactions.note },
  drift: { unannotated, retired },
};

if (check) {
  let prev = null;
  try {
    prev = JSON.parse(readFileSync(outFile, "utf8"));
  } catch {}
  const diff = [];
  if (!prev) diff.push("atlas.json missing");
  else {
    if (prev.stats?.loops_running !== stats.loops_running)
      diff.push(`loops_running ${prev.stats?.loops_running} -> ${stats.loops_running}`);
    if (prev.stats?.annotations_missing !== stats.annotations_missing)
      diff.push(`annotations_missing ${prev.stats?.annotations_missing} -> ${stats.annotations_missing}`);
    if ((prev.drift?.unannotated || []).join() !== unannotated.join())
      diff.push(`unannotated [${unannotated.join(", ")}]`);
    if ((prev.drift?.retired || []).join() !== retired.join())
      diff.push(`retired [${retired.join(", ")}]`);
    const prevNames = new Set((prev.loops || []).map((l) => `${l.name}:${l.cadence}`));
    for (const l of loops) if (!prevNames.has(`${l.name}:${l.cadence}`)) diff.push(`new/changed: ${l.name} (${l.cadence})`);
    const liveNames = new Set(loops.map((l) => `${l.name}:${l.cadence}`));
    for (const l of prev.loops || [])
      if (!liveNames.has(`${l.name}:${l.cadence}`)) diff.push(`committed but not live: ${l.name}`);
  }
  if (diff.length) {
    console.log("atlas drift:");
    for (const d of diff) console.log("  -", d);
    process.exit(1);
  }
  console.log("atlas in sync: nothing to report.");
  process.exit(0);
}

writeFileSync(outFile, JSON.stringify(atlas, null, 2) + "\n");
console.log(`atlas-build: ${running.length} running loops, ${Object.keys(byPattern).length} patterns, ${unannotated.length} unannotated, ${retired.length} retired.`);
if (unannotated.length) console.log(`  unannotated: ${unannotated.join(" | ")}`);
if (retired.length) console.log(`  retired curated entries: ${retired.join(" | ")}`);
