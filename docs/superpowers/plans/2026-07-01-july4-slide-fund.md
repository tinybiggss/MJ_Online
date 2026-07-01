# July 4th Slide Fund Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an unlisted, festive `mikejones.online/july4` page where friends donate to a rented dolphin slide via Venmo and a self-reported running total fills an animated thermometer, driven by an interactive dolphin slider with scaling fireworks.

**Architecture:** Static Astro page + one React island for the interactive widget, backed by Cloudflare Pages Functions and a KV namespace (`SLIDE_KV`) — same serverless pattern as the existing `functions/api/contact.ts`. Money moves in Venmo; the page only tracks self-reported chip-ins, with a token-gated admin page for reconciliation.

**Tech Stack:** Astro 7, React 19 (`@astrojs/react`, already installed), Tailwind v4, Cloudflare Pages Functions + KV, Vitest (new dev dep) for unit tests, `qrcode` (new dev dep) for the printable QR. Canvas 2D for fireworks; CSS transforms for the dolphin.

**Spec:** `docs/superpowers/specs/2026-07-01-july4-slide-fund-design.md`

**Working-early sequencing:** Tasks 1–5 produce a *functional* donate-and-track page (plain input, Venmo button, live thermometer). Tasks 6–8 layer on the dolphin, animation, and fireworks. Tasks 9–12 finish recent-list, admin, QR, and deploy docs. If time runs short, stop after Task 5 and you still have a shippable page.

---

## File Structure

**Backend (Cloudflare Pages Functions — `site/functions/`)**
- `functions/lib/slideStore.ts` — pure store logic (validate, add, totals, admin actions) over an injected KV interface. All business logic lives here so it's unit-testable.
- `functions/lib/slideStore.test.ts` — Vitest tests using an in-memory fake KV.
- `functions/api/slide.ts` — `GET /api/slide` → public totals + recent.
- `functions/api/slide/donate.ts` — `POST /api/slide/donate` → record a chip-in.
- `functions/api/slide/admin.ts` — `GET`/`POST /api/slide/admin` → list + confirm/delete/add (token-gated).

**Frontend (`site/src/`)**
- `src/components/slide/config.ts` — shared constants + pure math (stops, snapping, formatting).
- `src/components/slide/config.test.ts` — Vitest tests for the math.
- `src/components/slide/api.ts` — typed client fetch helpers.
- `src/components/slide/SlideFund.tsx` — the island orchestrator (state, polling, layout).
- `src/components/slide/Thermometer.tsx` — animated fill + preview segment.
- `src/components/slide/DolphinSlider.tsx` — the draggable dolphin thumb + custom-amount box.
- `src/components/slide/Fireworks.tsx` — canvas burst layer, intensity scales with amount.
- `src/components/slide/DonateForm.tsx` — Venmo button + "I chipped in" self-report form.
- `src/components/slide/RecentChipIns.tsx` — recent donors list.
- `src/pages/july4.astro` — public page shell mounting `<SlideFund client:load />`.
- `src/pages/july4/admin.astro` — unlisted admin console.

**Assets / tooling**
- `scripts/make-qr.mjs` — generates the printable QR into `site/public/`.
- `public/july4-qr.svg`, `public/july4-qr.png`, `public/july4-qr-print.html` — generated QR assets.

**Config**
- `site/package.json` — add `vitest` + `qrcode` dev deps and `test` script.

All work happens under `site/`. Run commands from `site/` unless noted.

---

### Task 1: Test tooling

**Files:**
- Modify: `site/package.json`

- [ ] **Step 1: Add dev deps and test script**

From `site/`, run:
```bash
npm install -D vitest qrcode
```
Expected: `vitest` and `qrcode` appear under `devDependencies`.

- [ ] **Step 2: Add the test script**

In `site/package.json`, add to the `"scripts"` object (keep existing scripts):
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 3: Verify vitest runs (no tests yet)**

Run: `npm test`
Expected: Vitest starts and reports "No test files found" (exit is fine) — confirms the runner is wired.

- [ ] **Step 4: Commit**

```bash
git add site/package.json site/package-lock.json
git commit -m "chore(july4): add vitest + qrcode dev tooling"
```

---

### Task 2: Backend store logic (pure, unit-tested)

All KV business logic lives in one testable module. Handlers (Task 3) stay thin.

**Files:**
- Create: `site/functions/lib/slideStore.ts`
- Test: `site/functions/lib/slideStore.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `site/functions/lib/slideStore.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import {
  GOAL,
  validateDonationInput,
  addDonation,
  getPublicView,
  adminList,
  adminAction,
  type KVLike,
} from "./slideStore";

/** In-memory fake of the Cloudflare KV interface we use. */
function fakeKV(initial?: string): KVLike {
  let store = initial ?? null;
  return {
    async get(_key: string) {
      return store;
    },
    async put(_key: string, value: string) {
      store = value;
    },
  };
}

describe("validateDonationInput", () => {
  it("accepts a valid amount and trims text", () => {
    const r = validateDonationInput({ amount: "20", name: "  Sarah ", note: " hi " });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.amount).toBe(20);
      expect(r.value.name).toBe("Sarah");
      expect(r.value.note).toBe("hi");
    }
  });

  it("rounds to cents", () => {
    const r = validateDonationInput({ amount: "20.005" });
    expect(r.ok && r.value.amount).toBe(20.01);
  });

  it("rejects zero, negative, non-numeric, and over-ceiling", () => {
    expect(validateDonationInput({ amount: "0" }).ok).toBe(false);
    expect(validateDonationInput({ amount: "-5" }).ok).toBe(false);
    expect(validateDonationInput({ amount: "abc" }).ok).toBe(false);
    expect(validateDonationInput({ amount: "999999" }).ok).toBe(false);
  });

  it("caps name and note length", () => {
    const r = validateDonationInput({ amount: "10", name: "x".repeat(100), note: "y".repeat(300) });
    expect(r.ok && r.value.name!.length).toBe(40);
    expect(r.ok && r.value.note!.length).toBe(140);
  });
});

describe("addDonation + getPublicView", () => {
  it("appends an entry and reports totals", async () => {
    const kv = fakeKV();
    await addDonation(kv, { amount: "20", name: "Sarah", note: "for the kids" }, 1000, () => "id1");
    await addDonation(kv, { amount: "30" }, 2000, () => "id2");
    const view = await getPublicView(kv);
    expect(view.goal).toBe(GOAL);
    expect(view.raisedSelfReported).toBe(50);
    expect(view.raisedConfirmed).toBe(0);
    expect(view.count).toBe(2);
    // newest first, no ids exposed
    expect(view.recent[0]).toEqual({ amount: 30, name: "Anonymous", note: "", ts: 2000 });
    expect(view.recent[1].name).toBe("Sarah");
    expect((view.recent[0] as any).id).toBeUndefined();
  });

  it("throws on invalid input", async () => {
    const kv = fakeKV();
    await expect(addDonation(kv, { amount: "-1" }, 1, () => "x")).rejects.toThrow();
  });
});

describe("admin actions", () => {
  it("confirms, adds manual, and deletes; totals reflect confirmed", async () => {
    const kv = fakeKV();
    await addDonation(kv, { amount: "40" }, 1000, () => "a");
    await adminAction(kv, { action: "confirm", id: "a" }, 2000, () => "z");
    await adminAction(kv, { action: "add", amount: "100", name: "Cash", confirmed: true }, 3000, () => "b");

    let list = await adminList(kv);
    expect(list.length).toBe(2);
    let view = await getPublicView(kv);
    expect(view.raisedSelfReported).toBe(140);
    expect(view.raisedConfirmed).toBe(140);

    await adminAction(kv, { action: "delete", id: "a" }, 4000, () => "z");
    view = await getPublicView(kv);
    expect(view.raisedSelfReported).toBe(100);
    expect(view.raisedConfirmed).toBe(100);
  });

  it("rejects unknown actions", async () => {
    const kv = fakeKV();
    await expect(adminAction(kv, { action: "nuke" } as any, 1, () => "z")).rejects.toThrow();
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- slideStore`
Expected: FAIL — cannot resolve `./slideStore` (module not created yet).

- [ ] **Step 3: Implement the store**

Create `site/functions/lib/slideStore.ts`:
```ts
/**
 * Pure store logic for the July 4th slide fund. All KV reads/writes go through
 * an injected KVLike so the logic is unit-testable with an in-memory fake.
 * Cloudflare's real KVNamespace satisfies KVLike (get/put with string values).
 */

export const GOAL = 708.49;
export const MAX_DONATION = 5000;
export const NAME_MAX = 40;
export const NOTE_MAX = 140;
const KEY = "donations";
const RECENT_LIMIT = 15;

export interface Donation {
  id: string;
  amount: number;
  name?: string;
  note?: string;
  ts: number;
  confirmed: boolean;
}

export interface KVLike {
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
}

export interface DonationInput {
  amount: string | number;
  name?: string;
  note?: string;
}

export type ValidationResult =
  | { ok: true; value: { amount: number; name?: string; note?: string } }
  | { ok: false; error: string };

export function validateDonationInput(input: DonationInput): ValidationResult {
  const raw = typeof input.amount === "number" ? input.amount : parseFloat(String(input.amount).trim());
  if (!Number.isFinite(raw) || raw <= 0) {
    return { ok: false, error: "Please enter a donation amount greater than $0." };
  }
  const amount = Math.round(raw * 100) / 100;
  if (amount > MAX_DONATION) {
    return { ok: false, error: `That amount looks too large (max $${MAX_DONATION}).` };
  }
  const name = (input.name ?? "").trim().slice(0, NAME_MAX);
  const note = (input.note ?? "").trim().slice(0, NOTE_MAX);
  return { ok: true, value: { amount, name: name || undefined, note: note || undefined } };
}

async function readAll(kv: KVLike): Promise<Donation[]> {
  const raw = await kv.get(KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Donation[]) : [];
  } catch {
    return [];
  }
}

async function writeAll(kv: KVLike, list: Donation[]): Promise<void> {
  await kv.put(KEY, JSON.stringify(list));
}

export interface PublicView {
  goal: number;
  raisedSelfReported: number;
  raisedConfirmed: number;
  count: number;
  recent: { amount: number; name: string; note: string; ts: number }[];
}

function toPublicView(list: Donation[]): PublicView {
  const raisedSelfReported = round2(list.reduce((sum, d) => sum + d.amount, 0));
  const raisedConfirmed = round2(list.filter((d) => d.confirmed).reduce((sum, d) => sum + d.amount, 0));
  const recent = [...list]
    .sort((a, b) => b.ts - a.ts)
    .slice(0, RECENT_LIMIT)
    .map((d) => ({ amount: d.amount, name: d.name || "Anonymous", note: d.note || "", ts: d.ts }));
  return { goal: GOAL, raisedSelfReported, raisedConfirmed, count: list.length, recent };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export async function getPublicView(kv: KVLike): Promise<PublicView> {
  return toPublicView(await readAll(kv));
}

export async function addDonation(
  kv: KVLike,
  input: DonationInput,
  now: number,
  makeId: () => string,
): Promise<PublicView> {
  const validated = validateDonationInput(input);
  if (!validated.ok) throw new Error(validated.error);
  const list = await readAll(kv);
  list.push({
    id: makeId(),
    amount: validated.value.amount,
    name: validated.value.name,
    note: validated.value.note,
    ts: now,
    confirmed: false,
  });
  await writeAll(kv, list);
  return toPublicView(list);
}

export type AdminActionInput =
  | { action: "confirm"; id: string }
  | { action: "unconfirm"; id: string }
  | { action: "delete"; id: string }
  | { action: "add"; amount: string | number; name?: string; note?: string; confirmed?: boolean };

export async function adminList(kv: KVLike): Promise<Donation[]> {
  const list = await readAll(kv);
  return [...list].sort((a, b) => b.ts - a.ts);
}

export async function adminAction(
  kv: KVLike,
  input: AdminActionInput,
  now: number,
  makeId: () => string,
): Promise<Donation[]> {
  const list = await readAll(kv);
  switch (input.action) {
    case "confirm":
    case "unconfirm": {
      const entry = list.find((d) => d.id === input.id);
      if (entry) entry.confirmed = input.action === "confirm";
      break;
    }
    case "delete": {
      const idx = list.findIndex((d) => d.id === input.id);
      if (idx >= 0) list.splice(idx, 1);
      break;
    }
    case "add": {
      const validated = validateDonationInput({ amount: input.amount, name: input.name, note: input.note });
      if (!validated.ok) throw new Error(validated.error);
      list.push({
        id: makeId(),
        amount: validated.value.amount,
        name: validated.value.name,
        note: validated.value.note,
        ts: now,
        confirmed: input.confirmed ?? true,
      });
      break;
    }
    default:
      throw new Error("Unknown admin action.");
  }
  await writeAll(kv, list);
  return [...list].sort((a, b) => b.ts - a.ts);
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test -- slideStore`
Expected: PASS (all cases green).

- [ ] **Step 5: Commit**

```bash
git add site/functions/lib/slideStore.ts site/functions/lib/slideStore.test.ts
git commit -m "feat(july4): KV store logic for donations with unit tests"
```

---

### Task 3: Pages Functions (thin handlers)

Wire HTTP → `slideStore`. Mirrors the JSON/validation style of `functions/api/contact.ts`.

**Files:**
- Create: `site/functions/api/slide.ts`
- Create: `site/functions/api/slide/donate.ts`
- Create: `site/functions/api/slide/admin.ts`

- [ ] **Step 1: GET /api/slide**

Create `site/functions/api/slide.ts`:
```ts
/** GET /api/slide — public totals + recent chip-ins for the thermometer. */
import { getPublicView, type KVLike } from "../lib/slideStore";

interface Env {
  SLIDE_KV?: KVLike;
}

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  if (!env.SLIDE_KV) {
    // KV not bound yet — return an empty-but-valid shape so the page still renders.
    return json(200, { goal: 708.49, raisedSelfReported: 0, raisedConfirmed: 0, count: 0, recent: [] });
  }
  const view = await getPublicView(env.SLIDE_KV);
  return json(200, view);
};

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}
```

- [ ] **Step 2: POST /api/slide/donate**

Create `site/functions/api/slide/donate.ts`:
```ts
/** POST /api/slide/donate — record a self-reported chip-in. */
import { addDonation, type KVLike } from "../../lib/slideStore";

interface Env {
  SLIDE_KV?: KVLike;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let data: Record<string, unknown> = {};
  try {
    data = await request.json();
  } catch {
    return json(400, { ok: false, error: "Could not read your submission." });
  }

  // Honeypot: silently succeed, store nothing.
  if (typeof data._honey === "string" && data._honey.trim() !== "") {
    return json(200, { ok: true });
  }

  if (!env.SLIDE_KV) {
    return json(503, { ok: false, error: "Tracking isn't set up yet — your Venmo payment still counts!" });
  }

  try {
    const view = await addDonation(
      env.SLIDE_KV,
      {
        amount: (data.amount as string | number) ?? "",
        name: typeof data.name === "string" ? data.name : "",
        note: typeof data.note === "string" ? data.note : "",
      },
      Date.now(),
      () => `d_${Date.now()}_${crypto.randomUUID().slice(0, 8)}`,
    );
    return json(200, { ok: true, view });
  } catch (err) {
    return json(422, { ok: false, error: err instanceof Error ? err.message : "Invalid donation." });
  }
};

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}
```

- [ ] **Step 3: GET/POST /api/slide/admin**

Create `site/functions/api/slide/admin.ts`:
```ts
/** GET/POST /api/slide/admin — token-gated reconciliation. */
import { adminList, adminAction, type KVLike, type AdminActionInput } from "../../lib/slideStore";

interface Env {
  SLIDE_KV?: KVLike;
  SLIDE_ADMIN_KEY?: string;
}

function authorized(request: Request, env: Env): boolean {
  if (!env.SLIDE_ADMIN_KEY) return false;
  const url = new URL(request.url);
  const key = url.searchParams.get("key") || request.headers.get("x-admin-key") || "";
  return key === env.SLIDE_ADMIN_KEY;
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  if (!authorized(request, env)) return json(401, { ok: false, error: "Unauthorized" });
  if (!env.SLIDE_KV) return json(200, { ok: true, entries: [] });
  return json(200, { ok: true, entries: await adminList(env.SLIDE_KV) });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!authorized(request, env)) return json(401, { ok: false, error: "Unauthorized" });
  if (!env.SLIDE_KV) return json(503, { ok: false, error: "KV not bound." });
  let body: AdminActionInput;
  try {
    body = (await request.json()) as AdminActionInput;
  } catch {
    return json(400, { ok: false, error: "Bad request body." });
  }
  try {
    const entries = await adminAction(
      env.SLIDE_KV,
      body,
      Date.now(),
      () => `d_${Date.now()}_${crypto.randomUUID().slice(0, 8)}`,
    );
    return json(200, { ok: true, entries });
  } catch (err) {
    return json(422, { ok: false, error: err instanceof Error ? err.message : "Action failed." });
  }
};

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}
```

- [ ] **Step 4: Verify locally against real KV (integration)**

Build and run Pages locally with an ephemeral KV binding:
```bash
npm run build
npx wrangler pages dev dist --kv SLIDE_KV --binding SLIDE_ADMIN_KEY=testkey --port 8788
```
In a second terminal, exercise the endpoints:
```bash
# Empty state
curl -s localhost:8788/api/slide | grep -q '"count":0' && echo "GET ok"
# Donate
curl -s -X POST localhost:8788/api/slide/donate -H 'content-type: application/json' \
  -d '{"amount":"25","name":"Test","note":"woo"}' | grep -q '"ok":true' && echo "donate ok"
# Total reflects it
curl -s localhost:8788/api/slide | grep -q '"raisedSelfReported":25' && echo "total ok"
# Admin requires key
curl -s -o /dev/null -w '%{http_code}\n' localhost:8788/api/slide/admin  # expect 401
curl -s 'localhost:8788/api/slide/admin?key=testkey' | grep -q '"ok":true' && echo "admin ok"
# Honeypot stores nothing
curl -s -X POST localhost:8788/api/slide/donate -H 'content-type: application/json' \
  -d '{"amount":"999","_honey":"bot"}' >/dev/null
curl -s localhost:8788/api/slide | grep -q '"raisedSelfReported":25' && echo "honeypot ok"
```
Expected: every `echo` line prints, and the admin-without-key call prints `401`. Stop the dev server (Ctrl-C).

- [ ] **Step 5: Commit**

```bash
git add site/functions/api/slide.ts site/functions/api/slide/donate.ts site/functions/api/slide/admin.ts
git commit -m "feat(july4): pages functions for slide totals, donate, admin"
```

---

### Task 4: Frontend config + math (pure, unit-tested)

Shared constants and slider math live in one testable module.

**Files:**
- Create: `site/src/components/slide/config.ts`
- Test: `site/src/components/slide/config.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `site/src/components/slide/config.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { GOAL, STOPS, snapToStop, amountForFraction, fractionForAmount, formatUSD, VENMO_URL } from "./config";

describe("stops", () => {
  it("has the agreed 18 stops from 10 to 300", () => {
    expect(STOPS[0]).toBe(10);
    expect(STOPS[STOPS.length - 1]).toBe(300);
    expect(STOPS).toContain(60);
    expect(STOPS).toContain(80); // first $20 jump
    expect(STOPS).not.toContain(70); // proves the jump skips 70
    expect(STOPS.length).toBe(18);
  });
});

describe("snapToStop", () => {
  it("snaps to nearest stop", () => {
    expect(snapToStop(23)).toBe(20);
    expect(snapToStop(26)).toBe(30);
    expect(snapToStop(5)).toBe(10); // clamps to min
    expect(snapToStop(500)).toBe(300); // clamps to max
  });
});

describe("fraction <-> amount along an evenly spaced track", () => {
  it("maps stops to even fractions", () => {
    expect(fractionForAmount(10)).toBe(0);
    expect(fractionForAmount(300)).toBe(1);
    expect(amountForFraction(0)).toBe(10);
    expect(amountForFraction(1)).toBe(300);
  });
  it("amounts above 300 park at the far right", () => {
    expect(fractionForAmount(1000)).toBe(1);
  });
});

describe("formatUSD", () => {
  it("formats dollars", () => {
    expect(formatUSD(708.49)).toBe("$708.49");
    expect(formatUSD(20)).toBe("$20.00");
  });
});

describe("VENMO_URL", () => {
  it("points at the tinybiggs profile", () => {
    expect(VENMO_URL).toContain("venmo.com/u/tinybiggs");
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- config`
Expected: FAIL — cannot resolve `./config`.

- [ ] **Step 3: Implement config**

Create `site/src/components/slide/config.ts`:
```ts
/** Shared constants + pure math for the dolphin donation widget. */

export const GOAL = 708.49;
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

export function formatUSD(n: number): string {
  return `$${n.toFixed(2)}`;
}

/** Whole-dollar formatting for compact labels ($20, $1,000). */
export function formatUSDShort(n: number): string {
  return `$${Math.round(n).toLocaleString("en-US")}`;
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test -- config`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add site/src/components/slide/config.ts site/src/components/slide/config.test.ts
git commit -m "feat(july4): slider config + math with unit tests"
```

---

### Task 5: Minimal working page (SHIPPABLE MILESTONE)

A functional page: plain amount input, Venmo button, live thermometer (plain bar), self-report. No dolphin/fireworks yet — those layer on next.

**Files:**
- Create: `site/src/components/slide/api.ts`
- Create: `site/src/components/slide/SlideFund.tsx`
- Create: `site/src/pages/july4.astro`

- [ ] **Step 1: Client API helpers**

Create `site/src/components/slide/api.ts`:
```ts
/** Typed client helpers for the slide-fund endpoints. */
export interface PublicView {
  goal: number;
  raisedSelfReported: number;
  raisedConfirmed: number;
  count: number;
  recent: { amount: number; name: string; note: string; ts: number }[];
}

export async function fetchView(): Promise<PublicView> {
  const res = await fetch("/api/slide", { headers: { accept: "application/json" } });
  if (!res.ok) throw new Error("Could not load the total.");
  return res.json();
}

export async function submitDonation(input: {
  amount: number;
  name?: string;
  note?: string;
}): Promise<PublicView> {
  const res = await fetch("/api/slide/donate", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = await res.json();
  if (!res.ok || !data.ok) throw new Error(data.error || "Could not record your chip-in.");
  return data.view as PublicView;
}
```

- [ ] **Step 2: Minimal SlideFund island**

Create `site/src/components/slide/SlideFund.tsx`:
```tsx
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
```

> Note: the honeypot is sent by including `_honey` in the POST body. Update `submitDonation` callers in a later task if you wire the field; for now the field is inert and the server treats a missing `_honey` as legitimate. (The server-side honeypot check in Task 3 handles it when present.)

- [ ] **Step 3: The page shell**

Create `site/src/pages/july4.astro`:
```astro
---
import Base from "../layouts/Base.astro";
import SlideFund from "../components/slide/SlideFund.tsx";
---

<Base
  title="Help Cover the Slide 🐬🎆 | 4th of July"
  description="We rented a giant dolphin slide for the 4th of July — chip in to help cover the cost."
  noindex={true}
>
  <main class="mx-auto max-w-2xl px-4 py-12">
    <header class="mb-8 text-center">
      <h1 class="text-4xl font-black tracking-tight">The Great Dolphin Slide 🐬</h1>
      <p class="mt-3 text-lg text-slate-600">
        We rented a giant inflatable dolphin slide for the kids this 4th of July.
        It ran us <strong>$708.49</strong> — if you and the kids had fun, chip in a few bucks!
        Every bit helps. 🎆
      </p>
    </header>

    <SlideFund client:load />

    <p class="mt-10 text-center text-xs text-slate-400">
      Donations go straight to Venmo. The total here is self-reported for fun — thanks for being honest!
    </p>
  </main>
</Base>
```

- [ ] **Step 4: Confirm `Base.astro` supports `noindex`; add it if missing**

Run: `grep -n "noindex" site/src/layouts/Base.astro`
- If it prints a match: nothing to do.
- If it prints nothing: open `site/src/layouts/Base.astro`, find the frontmatter `Props` interface and add `noindex?: boolean;`, destructure `noindex = false`, and in `<head>` add:
  ```astro
  {noindex && <meta name="robots" content="noindex, nofollow" />}
  ```
  Match the file's existing prop style exactly.

- [ ] **Step 5: Build and verify the page renders + works end-to-end**

```bash
npm run build
npx wrangler pages dev dist --kv SLIDE_KV --binding SLIDE_ADMIN_KEY=testkey --port 8788
```
In a browser, open `http://localhost:8788/july4`:
- The thermometer, amount input, Venmo button, and self-report form render.
- Type an amount, click "I chipped in $X" → the thermometer bar grows and "raised" updates.
- Reload → the new total persists (served from KV).

Stop the dev server.

- [ ] **Step 6: Commit**

```bash
git add site/src/components/slide/api.ts site/src/components/slide/SlideFund.tsx site/src/pages/july4.astro site/src/layouts/Base.astro
git commit -m "feat(july4): minimal working donate + track page"
```

---

### Task 6: Animated thermometer component

Extract the bar into a component with a smooth animated fill + a distinct preview segment.

**Files:**
- Create: `site/src/components/slide/Thermometer.tsx`
- Modify: `site/src/components/slide/SlideFund.tsx`

- [ ] **Step 1: Build the Thermometer**

Create `site/src/components/slide/Thermometer.tsx`:
```tsx
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
```

- [ ] **Step 2: Use it in SlideFund**

In `site/src/components/slide/SlideFund.tsx`:
- Add the import at the top: `import Thermometer from "./Thermometer";`
- Delete the inline "Thermometer (plain bar for now)" `<div className="mb-6">…</div>` block and the now-unused `pct`/`previewPct` locals.
- In its place render: `<Thermometer raised={raised} preview={amount} />`

- [ ] **Step 3: Build and verify**

```bash
npm run build && npx wrangler pages dev dist --kv SLIDE_KV --port 8788
```
Open `/july4`: changing the amount input shows the amber preview segment; committing a chip-in animates the blue fill smoothly. Stop the server.

- [ ] **Step 4: Commit**

```bash
git add site/src/components/slide/Thermometer.tsx site/src/components/slide/SlideFund.tsx
git commit -m "feat(july4): animated thermometer with live preview segment"
```

---

### Task 7: Dolphin slider

The dolphin SVG becomes the draggable thumb, snapping to stops, porpoising as it moves, two-way synced with a custom-amount box. Respects `prefers-reduced-motion`.

**Files:**
- Create: `site/src/components/slide/DolphinSlider.tsx`
- Modify: `site/src/components/slide/SlideFund.tsx`

- [ ] **Step 1: Build the DolphinSlider**

Create `site/src/components/slide/DolphinSlider.tsx`:
```tsx
import { useRef, useState, useCallback } from "react";
import { STOPS, MIN, MAX, amountForFraction, fractionForAmount, snapToStop, formatUSDShort } from "./config";

interface Props {
  amount: number;
  onChange: (amount: number) => void;
}

/**
 * Dolphin-as-thumb slider. Dragging moves the dolphin along a wave track and
 * snaps to STOPS; a number box allows any custom amount (incl. > $300, which
 * parks the dolphin at the far right). The dolphin "porpoises" while dragging.
 */
export default function DolphinSlider({ amount, onChange }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const reduce =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const fraction = fractionForAmount(amount);

  const setFromClientX = useCallback(
    (clientX: number) => {
      const track = trackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const frac = (clientX - rect.left) / rect.width;
      onChange(amountForFraction(frac));
    },
    [onChange],
  );

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setDragging(true);
    setFromClientX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (dragging) setFromClientX(e.clientX);
  };
  const onPointerUp = () => setDragging(false);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const idx = STOPS.indexOf(snapToStop(amount));
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      onChange(STOPS[Math.min(STOPS.length - 1, idx + 1)]);
      e.preventDefault();
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      onChange(STOPS[Math.max(0, idx - 1)]);
      e.preventDefault();
    }
  };

  return (
    <div className="select-none">
      <div
        ref={trackRef}
        role="slider"
        aria-label="Donation amount"
        aria-valuemin={MIN}
        aria-valuemax={MAX}
        aria-valuenow={snapToStop(amount)}
        aria-valuetext={formatUSDShort(snapToStop(amount))}
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onKeyDown={onKeyDown}
        className="relative h-20 w-full cursor-pointer rounded-2xl bg-gradient-to-b from-sky-200 to-sky-400 outline-none ring-sky-500 focus-visible:ring-2"
      >
        {/* Wave line */}
        <div className="absolute inset-x-3 top-1/2 h-1 -translate-y-1/2 rounded-full bg-white/60" />
        {/* Stop ticks */}
        {STOPS.map((stop, i) => (
          <div
            key={stop}
            className="absolute top-1/2 h-2 w-0.5 -translate-y-1/2 rounded bg-white/70"
            style={{ left: `calc(0.75rem + ${(i / (STOPS.length - 1)) * 100}% - ${(i / (STOPS.length - 1)) * 1.5}rem)` }}
          />
        ))}
        {/* The dolphin thumb */}
        <div
          className="pointer-events-none absolute top-1/2"
          style={{
            left: `calc(0.75rem + ${fraction} * (100% - 1.5rem))`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className={reduce ? "" : dragging ? "dolphin-jump" : "dolphin-idle"}>
            <Dolphin />
          </div>
        </div>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <label htmlFor="custom-amount" className="text-sm font-semibold text-slate-700">
          Or enter any amount:
        </label>
        <span className="text-slate-500">$</span>
        <input
          id="custom-amount"
          type="number"
          min={1}
          step={1}
          value={Number.isFinite(amount) ? amount : ""}
          onChange={(e) => onChange(Math.max(0, Number(e.target.value)))}
          className="w-28 rounded-lg border border-slate-300 px-3 py-2 text-lg"
        />
      </div>

      <style>{`
        @keyframes dolphinJump {
          0%, 100% { transform: translateY(0) rotate(-6deg); }
          50% { transform: translateY(-18px) rotate(10deg); }
        }
        @keyframes dolphinIdle {
          0%, 100% { transform: translateY(0) rotate(-3deg); }
          50% { transform: translateY(-4px) rotate(3deg); }
        }
        .dolphin-jump { animation: dolphinJump 0.5s ease-in-out infinite; }
        .dolphin-idle { animation: dolphinIdle 2.4s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .dolphin-jump, .dolphin-idle { animation: none; }
        }
      `}</style>
    </div>
  );
}

function Dolphin() {
  return (
    <svg width="52" height="52" viewBox="0 0 64 64" fill="none" aria-hidden="true" className="drop-shadow">
      <path
        d="M8 40c14 4 24-2 30-12 3-5 10-8 18-6-4 2-6 6-6 10 6 0 10 4 10 4-8 3-14 2-18-1-6 8-16 12-28 10-4-1-6-3-6-3l6-2z"
        fill="#3b82f6"
      />
      <path d="M30 28c4-3 9-4 14-2-3 2-4 5-4 8-4-2-8-4-10-6z" fill="#60a5fa" />
      <circle cx="50" cy="30" r="2" fill="#0f172a" />
    </svg>
  );
}
```

- [ ] **Step 2: Wire it into SlideFund, remove the plain amount input**

In `site/src/components/slide/SlideFund.tsx`:
- Add import: `import DolphinSlider from "./DolphinSlider";`
- Remove the `<label>Amount</label>` + `<input type="number" …/>` block from Task 5.
- In its place render:
  ```tsx
  <div className="mb-6">
    <DolphinSlider amount={amount} onChange={setAmount} />
  </div>
  ```

- [ ] **Step 3: Build and verify**

```bash
npm run build && npx wrangler pages dev dist --kv SLIDE_KV --port 8788
```
On `/july4`: drag the dolphin — it snaps to stops, jumps while dragging, and the amount box + thermometer preview follow. Typing `250` in the box moves the dolphin; typing `450` parks it at the far right. Tab to the track and use arrow keys. Stop the server.

- [ ] **Step 4: Commit**

```bash
git add site/src/components/slide/DolphinSlider.tsx site/src/components/slide/SlideFund.tsx
git commit -m "feat(july4): draggable porpoising dolphin slider with custom amount"
```

---

### Task 8: Fireworks canvas

A full-width canvas behind the widget bursts fireworks that scale with the selected amount.

**Files:**
- Create: `site/src/components/slide/Fireworks.tsx`
- Modify: `site/src/components/slide/SlideFund.tsx`

- [ ] **Step 1: Build the Fireworks layer**

Create `site/src/components/slide/Fireworks.tsx`:
```tsx
import { useEffect, useRef } from "react";
import { MIN, MAX } from "./config";

interface Props {
  /** 0..1 intensity, typically the selected amount mapped across MIN..MAX. */
  intensity: number;
  /** Bump this number to trigger a celebratory burst (e.g. on a committed chip-in). */
  celebrate: number;
}

interface Particle {
  x: number; y: number; vx: number; vy: number; life: number; max: number; color: string;
}

const COLORS = ["#ef4444", "#ffffff", "#3b82f6", "#fbbf24", "#22d3ee"];

export default function Fireworks({ intensity, celebrate }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intensityRef = useRef(intensity);
  intensityRef.current = intensity;

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canvas = canvasRef.current;
    if (!canvas || reduce) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let lastSpawn = 0;
    const particles: Particle[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    function burst(cx: number, cy: number, power: number) {
      const count = Math.round(24 + power * 60);
      const speed = 2 + power * 4;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count;
        const s = speed * (0.6 + Math.random() * 0.6);
        particles.push({
          x: cx, y: cy,
          vx: Math.cos(angle) * s,
          vy: Math.sin(angle) * s,
          life: 0, max: 50 + Math.random() * 30,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
        });
      }
    }

    function frame(t: number) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const power = intensityRef.current; // 0..1
      // Spawn rate + size scale with the selected amount.
      const interval = 900 - power * 700; // higher amount → more frequent
      if (power > 0 && t - lastSpawn > interval) {
        lastSpawn = t;
        burst(
          canvas.width * (0.2 + Math.random() * 0.6),
          canvas.height * (0.15 + Math.random() * 0.35),
          power,
        );
      }
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04; // gravity
        p.vx *= 0.99;
        const alpha = 1 - p.life / p.max;
        if (alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2 + power * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // Celebratory burst on commit: briefly force max spawns by nudging intensity.
  useEffect(() => {
    if (celebrate === 0) return;
    const prev = intensityRef.current;
    intensityRef.current = 1;
    const id = setTimeout(() => (intensityRef.current = prev), 1200);
    return () => clearTimeout(id);
  }, [celebrate]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}

/** Map a dollar amount to a 0..1 fireworks intensity across the slider range. */
export function amountToIntensity(amount: number): number {
  return Math.max(0, Math.min(1, (amount - MIN) / (MAX - MIN)));
}
```

- [ ] **Step 2: Mount fireworks behind the widget**

In `site/src/components/slide/SlideFund.tsx`:
- Add imports: `import Fireworks, { amountToIntensity } from "./Fireworks";`
- Add state near the other `useState`s: `const [celebrate, setCelebrate] = useState(0);`
- In `handleSelfReport`, inside the `try` after `setStatus("done")`, add: `setCelebrate((c) => c + 1);`
- Wrap the whole returned tree so the canvas sits behind content. Change the outer element from `<div className="mx-auto max-w-xl">` to:
  ```tsx
  <div className="relative mx-auto max-w-xl">
    <Fireworks intensity={amountToIntensity(amount)} celebrate={celebrate} />
    <div className="relative z-10">
      {/* ...all existing children... */}
    </div>
  </div>
  ```

- [ ] **Step 3: Build and verify**

```bash
npm run build && npx wrangler pages dev dist --kv SLIDE_KV --port 8788
```
On `/july4`: sliding the dolphin up increases firework size/frequency; committing a chip-in triggers a finale burst. Toggle OS "reduce motion" and confirm fireworks + dolphin jumping stop. Stop the server.

- [ ] **Step 4: Commit**

```bash
git add site/src/components/slide/Fireworks.tsx site/src/components/slide/SlideFund.tsx
git commit -m "feat(july4): amount-scaled fireworks canvas with finale on commit"
```

---

### Task 9: Recent chip-ins list

**Files:**
- Create: `site/src/components/slide/RecentChipIns.tsx`
- Modify: `site/src/components/slide/SlideFund.tsx`

- [ ] **Step 1: Build the list**

Create `site/src/components/slide/RecentChipIns.tsx`:
```tsx
import { formatUSDShort } from "./config";
import type { PublicView } from "./api";

export default function RecentChipIns({ recent }: { recent: PublicView["recent"] }) {
  if (!recent.length) {
    return <p className="mt-6 text-center text-sm text-slate-400">Be the first to chip in! 🐬</p>;
  }
  return (
    <div className="mt-8">
      <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-500">Recent chip-ins</h2>
      <ul className="divide-y divide-slate-100">
        {recent.map((r, i) => (
          <li key={i} className="flex items-baseline justify-between py-2">
            <span className="text-slate-700">
              <strong>{r.name}</strong>
              {r.note && <span className="text-slate-500"> — “{r.note}”</span>}
            </span>
            <span className="font-semibold text-emerald-700">{formatUSDShort(r.amount)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 2: Render it in SlideFund**

In `site/src/components/slide/SlideFund.tsx`:
- Add import: `import RecentChipIns from "./RecentChipIns";`
- Just before the closing `</div>` of the `z-10` inner wrapper, add: `{view && <RecentChipIns recent={view.recent} />}`

- [ ] **Step 3: Build and verify**

```bash
npm run build && npx wrangler pages dev dist --kv SLIDE_KV --port 8788
```
Submit a couple of chip-ins with names/notes → they appear newest-first. Stop the server.

- [ ] **Step 4: Commit**

```bash
git add site/src/components/slide/RecentChipIns.tsx site/src/components/slide/SlideFund.tsx
git commit -m "feat(july4): recent chip-ins list for social proof"
```

---

### Task 10: Admin console

Unlisted page to reconcile self-reported entries against real Venmo activity.

**Files:**
- Create: `site/src/pages/july4/admin.astro`

- [ ] **Step 1: Build the admin page**

Create `site/src/pages/july4/admin.astro`:
```astro
---
import Base from "../../layouts/Base.astro";
---

<Base title="Slide Fund — Admin" description="Private admin" noindex={true}>
  <main class="mx-auto max-w-2xl px-4 py-12">
    <h1 class="text-2xl font-black">Slide Fund — Admin</h1>
    <p class="mt-1 text-sm text-slate-500">
      Add <code>?key=YOUR_KEY</code> to the URL. Confirm entries as they land in Venmo.
    </p>
    <div id="totals" class="my-4 font-semibold"></div>
    <form id="add-form" class="mb-6 flex flex-wrap gap-2">
      <input id="add-amount" type="number" step="0.01" placeholder="Amount" class="w-28 rounded border px-2 py-1" required />
      <input id="add-name" placeholder="Name" class="rounded border px-2 py-1" />
      <input id="add-note" placeholder="Note" class="grow rounded border px-2 py-1" />
      <button class="rounded bg-blue-600 px-3 py-1 font-bold text-white">Add manual entry</button>
    </form>
    <div id="list"></div>
  </main>
</Base>

<script>
  const params = new URLSearchParams(location.search);
  const key = params.get("key") || "";
  const listEl = document.getElementById("list")!;
  const totalsEl = document.getElementById("totals")!;

  async function api(method: string, body?: unknown) {
    const res = await fetch(`/api/slide/admin?key=${encodeURIComponent(key)}`, {
      method,
      headers: body ? { "content-type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    return res.json();
  }

  function money(n: number) {
    return `$${n.toFixed(2)}`;
  }

  async function refresh() {
    const data = await api("GET");
    if (!data.ok) {
      listEl.innerHTML = `<p class="text-red-600">Unauthorized. Add ?key=… to the URL.</p>`;
      return;
    }
    const entries = data.entries as any[];
    const total = entries.reduce((s, e) => s + e.amount, 0);
    const confirmed = entries.filter((e) => e.confirmed).reduce((s, e) => s + e.amount, 0);
    totalsEl.textContent = `Total ${money(total)} · Confirmed ${money(confirmed)} · ${entries.length} entries`;
    listEl.innerHTML = entries
      .map(
        (e) => `
      <div class="flex items-center justify-between border-b py-2 gap-2">
        <span>${e.confirmed ? "✅" : "⬜"} <strong>${money(e.amount)}</strong>
          — ${escapeHtml(e.name || "Anonymous")}
          ${e.note ? `<em class="text-slate-500">“${escapeHtml(e.note)}”</em>` : ""}</span>
        <span class="flex gap-1">
          <button data-act="${e.confirmed ? "unconfirm" : "confirm"}" data-id="${e.id}"
            class="rounded bg-emerald-600 px-2 py-1 text-xs text-white">${e.confirmed ? "Unconfirm" : "Confirm"}</button>
          <button data-act="delete" data-id="${e.id}"
            class="rounded bg-red-600 px-2 py-1 text-xs text-white">Delete</button>
        </span>
      </div>`,
      )
      .join("");
  }

  function escapeHtml(s: string) {
    return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));
  }

  listEl.addEventListener("click", async (ev) => {
    const btn = (ev.target as HTMLElement).closest("button");
    if (!btn) return;
    const action = btn.dataset.act!;
    const id = btn.dataset.id!;
    if (action === "delete" && !confirm("Delete this entry?")) return;
    await api("POST", { action, id });
    refresh();
  });

  document.getElementById("add-form")!.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const amount = (document.getElementById("add-amount") as HTMLInputElement).value;
    const name = (document.getElementById("add-name") as HTMLInputElement).value;
    const note = (document.getElementById("add-note") as HTMLInputElement).value;
    await api("POST", { action: "add", amount, name, note, confirmed: true });
    (ev.target as HTMLFormElement).reset();
    refresh();
  });

  refresh();
</script>
```

> Note: `confirm()` is used here intentionally (admin-only page, not the public page).

- [ ] **Step 2: Build and verify**

```bash
npm run build && npx wrangler pages dev dist --kv SLIDE_KV --binding SLIDE_ADMIN_KEY=testkey --port 8788
```
- Open `/july4/admin` (no key) → "Unauthorized".
- Open `/july4/admin?key=testkey` → entries list. Confirm/unconfirm/delete a self-reported entry; add a manual entry. Check `/july4` reflects confirmed vs total.

Stop the server.

- [ ] **Step 3: Commit**

```bash
git add site/src/pages/july4/admin.astro
git commit -m "feat(july4): token-gated admin console for reconciliation"
```

---

### Task 11: Printable QR code

**Files:**
- Create: `site/scripts/make-qr.mjs`
- Modify: `site/package.json` (add a `qr` script)
- Generates: `site/public/july4-qr.svg`, `site/public/july4-qr.png`, `site/public/july4-qr-print.html`

- [ ] **Step 1: Write the generator**

Create `site/scripts/make-qr.mjs`:
```js
// Generates printable QR assets that point at the tracker page (NOT Venmo).
import QRCode from "qrcode";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const URL = "https://mikejones.online/july4";
const outDir = join(dirname(fileURLToPath(import.meta.url)), "..", "public");

const opts = { errorCorrectionLevel: "M", margin: 2, width: 900 };

const svg = await QRCode.toString(URL, { ...opts, type: "svg" });
writeFileSync(join(outDir, "july4-qr.svg"), svg);
await QRCode.toFile(join(outDir, "july4-qr.png"), URL, opts);

const printHtml = `<!doctype html><html><head><meta charset="utf-8">
<title>Dolphin Slide — Scan to Chip In</title>
<style>
  body { font-family: system-ui, sans-serif; text-align: center; padding: 6vh 5vw; color: #0f172a; }
  h1 { font-size: 2.5rem; margin: 0 0 .25em; }
  p { font-size: 1.4rem; color: #334155; margin: .25em 0; }
  img { width: min(70vw, 480px); height: auto; margin: 2vh auto; }
  .url { font-weight: 700; font-size: 1.6rem; color: #2563eb; }
  @media print { .noprint { display: none; } }
</style></head>
<body>
  <h1>🐬 The Great Dolphin Slide 🎆</h1>
  <p>Scan to chip in for the 4th of July slide!</p>
  <img src="./july4-qr.png" alt="QR code to mikejones.online/july4">
  <p class="url">mikejones.online/july4</p>
  <button class="noprint" onclick="window.print()" style="margin-top:2vh;padding:.6em 1.4em;font-size:1.1rem;">Print this</button>
</body></html>`;
writeFileSync(join(outDir, "july4-qr-print.html"), printHtml);

console.log("QR assets written to site/public/: july4-qr.svg, july4-qr.png, july4-qr-print.html");
```

- [ ] **Step 2: Add a script and generate**

Add to `site/package.json` `"scripts"`: `"qr": "node scripts/make-qr.mjs"`, then run:
```bash
npm run qr
```
Expected: the three files appear in `site/public/` and the console confirms.

- [ ] **Step 3: Verify the QR scans**

```bash
npx wrangler pages dev dist --port 8788   # after a build, or just open the file
```
Open `site/public/july4-qr-print.html` in a browser and scan the QR with a phone → it resolves to `mikejones.online/july4`. (Locally it will show the print sheet; the encoded URL is the production one.)

- [ ] **Step 4: Commit**

```bash
git add site/scripts/make-qr.mjs site/package.json site/public/july4-qr.svg site/public/july4-qr.png site/public/july4-qr-print.html
git commit -m "feat(july4): printable QR code pointing at the tracker page"
```

---

### Task 12: Exclude from sitemap/nav + final verification + deploy docs

**Files:**
- Modify: `site/astro.config.mjs` (sitemap filter)
- Modify: `site/DEPLOY.md` (setup steps)

- [ ] **Step 1: Keep `/july4` out of the sitemap**

In `site/astro.config.mjs`, change the `sitemap()` integration call to filter the July 4th pages:
```js
sitemap({
  filter: (page) => !page.includes("/july4"),
}),
```
(Leave the rest of the config unchanged.)

- [ ] **Step 2: Confirm it's not linked from nav**

Run: `grep -rn "july4" site/src/layouts site/src/components/*.astro`
Expected: no matches in nav/header/footer (the page is reached only via the QR/direct link). If a nav file lists pages explicitly, do not add `/july4`.

- [ ] **Step 3: Document deploy + one-time setup**

Append to `site/DEPLOY.md`:
```markdown
## July 4th Slide Fund (`/july4`)

Unlisted donation page backed by Cloudflare KV. One-time setup in the Cloudflare dashboard:

1. **Workers & Pages → KV → Create namespace** → name it `slide-fund`.
2. In the **Pages project → Settings → Functions → KV namespace bindings**, add a
   binding: variable name `SLIDE_KV` → the `slide-fund` namespace (for Production and Preview).
3. In **Settings → Environment variables**, add `SLIDE_ADMIN_KEY` = a long random secret.
4. Redeploy.

- Public page: `https://mikejones.online/july4`
- Admin: `https://mikejones.online/july4/admin?key=YOUR_SLIDE_ADMIN_KEY`
- Venmo target: `https://venmo.com/u/tinybiggs` (money moves here; the total is self-reported)
- Printable QR: `site/public/july4-qr-print.html` (regenerate with `npm run qr`)

Local testing mirrors production bindings:
```bash
npm run build
npx wrangler pages dev dist --kv SLIDE_KV --binding SLIDE_ADMIN_KEY=testkey
```
```

- [ ] **Step 4: Full run — tests + build + smoke**

```bash
cd site
npm test
npm run build
npx wrangler pages dev dist --kv SLIDE_KV --binding SLIDE_ADMIN_KEY=testkey --port 8788
```
Verify on `/july4`: dolphin drag + snap, box sync, thermometer preview, fireworks scaling, chip-in commit + finale, recent list, reduced-motion fallback. Verify `/july4/admin?key=testkey` confirm/delete/add. Stop the server.

- [ ] **Step 5: Commit**

```bash
git add site/astro.config.mjs site/DEPLOY.md
git commit -m "chore(july4): exclude from sitemap + document KV setup and deploy"
```

---

## Self-Review Notes (spec coverage)

- Venmo constraint / money-vs-tracking split → Tasks 3, 5 (Venmo button + self-report).
- Hybrid admin confirm/delete/add → Tasks 3, 10.
- KV storage + totals (self-reported vs confirmed) → Tasks 2, 3.
- Dolphin slider (drag, 18 stops, jump animation, two-way box, >$300 parks right, keyboard, reduced-motion) → Tasks 4, 7.
- Live thermometer with preview segment → Task 6.
- Amount-scaled fireworks + finale + reduced-motion → Task 8.
- Recent chip-ins list → Task 9.
- Printable QR to the tracker (not Venmo) → Task 11.
- Unlisted (noindex + sitemap + nav) → Tasks 5, 12.
- Integration-first testing, real KV, minimal mocks → Tasks 2–12 verification steps.
- One-time setup steps (KV binding, admin key) → Task 12.

## Notes for the implementer

- Run all commands from `site/`.
- The dolphin SVG in Task 7 is a simple placeholder path — during implementation, feel free to use the frontend-design skill to make the dolphin and overall page more polished and delightful; keep the same component interface (`amount`, `onChange`).
- KV is eventually consistent, but at friends-and-family volume the single-key read-modify-write is fine. Do not add Durable Objects (YAGNI).
