import { describe, it, expect } from "vitest";
import {
  GOAL,
  COMMUNITY_GOAL,
  STOPS,
  snapToStop,
  amountForFraction,
  fractionForAmount,
  clamp,
  communityFraction,
  formatUSD,
  VENMO_URL,
} from "./config";

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

describe("community thermometer math", () => {
  it("keeps the slide cost and community goal distinct", () => {
    expect(GOAL).toBe(708.49);
    expect(COMMUNITY_GOAL).toBe(600);
  });
  it("clamp bounds a value to [lo, hi]", () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-3, 0, 10)).toBe(0);
    expect(clamp(42, 0, 10)).toBe(10);
  });
  it("communityFraction fills toward $600, clamped 0..1", () => {
    expect(communityFraction(0)).toBe(0);
    expect(communityFraction(300)).toBe(0.5);
    expect(communityFraction(600)).toBe(1);
    expect(communityFraction(900)).toBe(1); // past goal clamps at full
    expect(communityFraction(-50)).toBe(0);
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
