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
