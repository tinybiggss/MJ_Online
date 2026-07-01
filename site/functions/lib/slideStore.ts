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
