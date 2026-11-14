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
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";

const here = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(here, "..");
const outFile = resolve(siteRoot, "src/data/atlas.json");
const curatedFile = resolve(siteRoot, "src/data/atlas.curated.json");

const JOBS = resolve(homedir(), ".hermes/cron/jobs.json");
const VAULT = resolve(homedir(), "Dev/Obsidian/Mike_Thinking_Space/.obsidian");
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
  // Four outcomes, not two: a paused loop is not a retired one. Mapping paused
  // to "completed" once reported a job I had merely paused as a finished
  // one-shot — and flipped the loop count every time I toggled it.
  const done = job.state === "completed";
  const paused = !done && (Boolean(job.paused_at) || job.state === "paused" || job.enabled === false);
  const active = !done && !paused;
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
    state: done ? "completed" : paused ? "paused" : "running",
    // live status is deliberately NOT shipped: it is never rendered, and it
    // changes every time any job fires, which made the publish job commit an
    // identical page on the hour. Failure state is the ping job's business.
    annotated: Boolean(ann),
    does: ann?.does || null,
    why: ann?.why || null,
  };
  if (!ann && !done) unannotated.push(job.name);
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
  loops_paused: loops.filter((l) => l.state === "paused").length,
  // an unannotated loop is not a seventh shape; it is a hole in the annotation file.
  patterns_in_use: Object.keys(byPattern).filter((k) => k !== "unclassified").length,
  annotations_missing: unannotated.length,
  retired_annotations: retired.length,
  by_pattern: byPattern,
  generated_at: new Date().toISOString(),
};

/* ------------------------------------------------------------------ vault */
/**
 * The Obsidian half of the system. Derived from the vault's own plugin store so
 * an install Mike forgets to write up still appears — published incomplete
 * (manifest description, marked `annotated: false`) rather than invisible, and
 * reported by --check like a loop with no annotation.
 *
 * Only ENABLED plugins are listed. Installed-but-off is a count, not a claim:
 * a plugin that is switched off is not part of how the system works today.
 */
function readVault() {
  const pluginsDir = resolve(VAULT, "plugins");
  if (!existsSync(pluginsDir)) return null;

  const enabledPath = resolve(VAULT, "community-plugins.json");
  const enabledIds = existsSync(enabledPath) ? JSON.parse(readFileSync(enabledPath, "utf8")) : [];
  let theme = null;
  const appearance = resolve(VAULT, "appearance.json");
  if (existsSync(appearance)) theme = JSON.parse(readFileSync(appearance, "utf8")).cssTheme || null;

  const installed = readdirSync(pluginsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
  const enabledSet = new Set(enabledIds);

  const plugins = [];
  const unannotatedPlugins = [];
  for (const id of enabledIds) {
    let manifest = {};
    try {
      manifest = JSON.parse(readFileSync(resolve(pluginsDir, id, "manifest.json"), "utf8"));
    } catch {
      // installed record but unreadable plugin: still list it, visibly empty
    }
    const ann = curated.plugins?.[id];
    if (!ann) unannotatedPlugins.push(id);
    plugins.push({
      id,
      name: manifest.name || ann?.public_name || id,
      version: manifest.version || null,
      role: ann?.role || "unclassified",
      what: ann?.what || manifest.description || "No manifest, no description.",
      in_use: ann?.in_use ?? null,
      annotated: Boolean(ann),
    });
  }
  plugins.sort((a, b) => {
    const order = (p) => (curated.plugins?.[p.id]?.order ?? 999);
    const d = order(a) - order(b);
    return d !== 0 ? d : a.name.localeCompare(b.name);
  });

  return {
    enabled: plugins.length,
    installed: installed.length,
    off: installed.filter((id) => !enabledSet.has(id)),
    theme,
    plugins,
    unannotated: unannotatedPlugins,
  };
}

/* ------------------------------------------------------------------ floor */
/**
 * The board. STRUCTURE ONLY — lanes and states, read from kanban.db so a new
 * lane shows up without an edit. Counts are deliberately NOT derived: card
 * counts move hourly, and a page that rewrites itself hourly churns a commit
 * every hour (the reason live status came out, see d2837e5). The numbers are a
 * dated measurement living in the curated file, like the vault's prose.
 *
 * Nothing here may carry a card id, a title or a body: some of them hold family
 * and financial work. Aggregates and mechanisms only.
 */
const KANBAN = resolve(homedir(), ".hermes/kanban.db");
const PROFILES = resolve(homedir(), ".hermes/profiles");

function sqlRows(sql) {
  if (!existsSync(KANBAN)) return null;
  try {
    return execFileSync("sqlite3", [KANBAN, sql], { encoding: "utf8" })
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
  } catch {
    return null;
  }
}

function readBoard() {
  // Archived cards are not work in flight: they are probes and abandoned tickets
  // kept for the record, and their assignee is nobody's lane.
  const lanes = sqlRows(
    "select distinct assignee from tasks where assignee is not null and assignee <> '' and status <> 'archived' order by 1",
  );
  const states = sqlRows("select distinct status from tasks order by 1");
  if (!lanes || !states) return null;
  return { lanes, states };
}

/**
 * The crew. Derived from the profiles on disk, so a seat Mike adds appears and
 * a seat he removes disappears — and an undescribed one is published with its
 * own manifest line rather than left out. Same contract as the plugins.
 * The default profile has no profile.yaml; it is the seat you talk to.
 */
function readCrew() {
  if (!existsSync(PROFILES)) return null;
  // Seats. The default profile (the one Mike talks to — Corvus) carries a second
  // routing alias: cards authored from the agent itself are stamped assignee
  // "hermes" by the tooling, so that lane resolves to THIS seat, not to nobody.
  const seats = [
    { alias: "default", aliases: ["hermes"], name: "Corvus", purpose: null },
  ];
  // A seat is a profile with a MANIFEST. A directory carrying no profile.yaml is
  // a scratch profile (a probe, an abandoned experiment) and counting it publishes
  // a seat nobody can address — it is reported in drift instead, so its appearance
  // is visible without inflating the roster.
  const anonymous = [];
  for (const dir of readdirSync(PROFILES, { withFileTypes: true })) {
    if (!dir.isDirectory()) continue;
    let y;
    try {
      y = readFileSync(resolve(PROFILES, dir.name, "profile.yaml"), "utf8");
    } catch {
      anonymous.push(dir.name);
      continue;
    }
    const pick = (k) => {
      const m = new RegExp(`^${k}:\\s*(.+)$`, "m").exec(y);
      return m ? m[1].trim().replace(/^["']|["']$/g, "") : null;
    };
    const name = pick("display_name");
    const purpose = pick("description");
    // The board stamps cards with the display name as often as with the alias, so
    // the display name is a lane alias of the same seat, not a lane of its own.
    seats.push({ alias: dir.name, aliases: name ? [name.toLowerCase()] : [], name: name || dir.name, purpose });
  }
  const orderOf = (s) => curated.crew_page?.seats?.[s.alias]?.order ?? 999;
  seats.sort((a, b) => orderOf(a) - orderOf(b) || a.alias.localeCompare(b.alias));
  return { count: seats.length, seats, anonymous };
}

let vault = readVault();
let committedVault = null;
if (!vault) {
  // No vault on this machine (CI, a fresh clone). The committed atlas already
  // carries the plugin list; regenerating here would silently delete a section
  // the site is serving. Keep it and say so.
  try {
    committedVault = JSON.parse(readFileSync(outFile, "utf8"));
  } catch {}
  if (!committedVault?.vault) {
    console.error("atlas-build: no vault and no committed plugin list — refusing to build a half atlas.");
    process.exit(2);
  }
  vault = committedVault.vault;
  console.log("atlas-build: vault not present — keeping the committed plugin list.");
}

const clusters = curated.clusters.map((c) => ({ ...c }));
if (vault) {
  clusters.push({
    id: "vault",
    order: curated.vault_page?.order ?? 55,
    title: curated.vault_page?.title ?? "The vault",
    line: curated.vault_page?.line ?? "The Obsidian plugins that are switched on, and what each one is here to do.",
    thesis: curated.vault_page?.thesis ?? "",
    derived_from: "obsidian",
    items: vault.plugins.map((p) => ({
      title: p.name,
      meta: `${p.version ? `v${p.version} · ` : ""}${p.role}${p.in_use === false ? " · idle" : ""}`,
      body: p.what,
    })),
  });
}

const board = readBoard();
const crew = readCrew();
const undescribedSeats = crew
  ? crew.seats.filter((s) => !curated.crew_page?.seats?.[s.alias]).map((s) => s.alias)
  : [];

if (crew && curated.crew_page) {
  clusters.push({
    id: "crew",
    order: curated.crew_page.order ?? 45,
    title: curated.crew_page.title ?? "The crew",
    line: curated.crew_page.line ?? "",
    thesis: curated.crew_page.thesis ?? "",
    derived_from: "hermes profiles",
    frame_label: `${crew.count} seats`,
    items: crew.seats.map((s) => {
      const c = curated.crew_page.seats?.[s.alias] || {};
      return {
        title: c.public_name || s.name,
        meta: c.meta || s.alias,
        body: c.why || s.purpose || "Undescribed seat: profile.yaml describes it, but nothing here does yet.",
      };
    }),
  });
}

// Only lanes that are seats are published. A lane whose name is not a profile
// receives work nothing can pick up — a defect in the board, not a division of
// labour — so it is counted out of the roster.
const seatAliases = new Set(
  (crew?.seats || []).flatMap((s) => [
    s.alias,
    ...(s.aliases || []),
    // The curated file may name a seat differently from its manifest; both are
    // that seat's lane names.
    ...(curated.crew_page?.seats?.[s.alias]?.public_name
      ? [curated.crew_page.seats[s.alias].public_name.toLowerCase()]
      : []),
  ]),
);
const lanesShown = (board?.lanes || []).filter((l) => seatAliases.has(l));

if (board && curated.board_page) {
  clusters.push({
    id: "floor",
    order: curated.board_page.order ?? 65,
    title: curated.board_page.title ?? "The floor",
    line: curated.board_page.line ?? "",
    thesis: curated.board_page.thesis ?? "",
    derived_from: "kanban.db",
    frame_label: `${lanesShown.length} lanes`,
    items: [
      ...(curated.board_page.items || []),
      {
        title: "The lanes, as they stand",
        meta: "read from the board",
        body: `${lanesShown.join(", ")}.${
          board.lanes.length - lanesShown.length === 1
            ? ` One further lane on the board is not a seat — work assigned there is work no profile picks up.`
            : board.lanes.length - lanesShown.length > 1
              ? ` ${board.lanes.length - lanesShown.length} further lanes on the board are not seats — work assigned there is work no profile picks up.`
              : ""
        } Lane names come from the board itself, not from this file: a lane exists because work was assigned to it. Structure is derived on every build; every number on this page is dated in the curated file instead.`,
      },
    ],
  });
}

const atlas = {
  meta: {
    version: curated.version,
    generated_at: stats.generated_at,
    source: "hermes scheduler store on the owning machine",
    contract: "committed artifact; CI ships it, never regenerates it",
  },
  hero: curated.hero,
  patterns: curated.patterns,
  shapes_page: curated.shapes_page,
  bands: curated.bands,
  stats,
  loops,
  clusters,
  vault: vault ? { ...vault, unannotated: vault.unannotated } : null,
  ground: curated.ground,
  redactions: { note: curated.redactions.note },
  board: board ? { lanes: board.lanes, states: board.states } : null,
  crew: crew
    ? { count: crew.count, seats: crew.seats.map((s) => ({ alias: s.alias, name: s.name })) }
    : null,
  drift: {
    unannotated,
    retired,
    plugins_unannotated: vault?.unannotated || [],
    seats_undescribed: undescribedSeats,
    profiles_without_manifest: crew?.anonymous || [],
    board_lanes: board?.lanes || [],
  },
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

    // Plugins drift the same way loops do: a new install is published, then named.
    const prevPlugins = new Map((prev.vault?.plugins || []).map((p) => [p.id, p.version]));
    for (const p of vault?.plugins || []) {
      if (!prevPlugins.has(p.id)) diff.push(`plugin installed: ${p.id} (v${p.version})`);
      else if (prevPlugins.get(p.id) !== p.version) diff.push(`plugin updated: ${p.id} ${prevPlugins.get(p.id)} -> v${p.version}`);
    }
    for (const id of prevPlugins.keys())
      if (!(vault?.plugins || []).some((p) => p.id === id)) diff.push(`plugin gone: ${id}`);

    // The crew and the board drift the same way: a new seat or a new lane is
    // published first, then written up.
    if ((prev.drift?.seats_undescribed || []).join() !== undescribedSeats.join())
      diff.push(`seats undescribed [${undescribedSeats.join(", ")}]`);
    const prevLanes = prev.drift?.board_lanes || [];
    if (prevLanes.join() !== (board?.lanes || []).join())
      diff.push(`board lanes [${(board?.lanes || []).join(", ")}] (was ${prevLanes.join(", ")})`);
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
