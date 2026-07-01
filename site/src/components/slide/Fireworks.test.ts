import { describe, it, expect } from "vitest";
import { amountToIntensity } from "./Fireworks";
import { MIN, MAX } from "./config";

describe("amountToIntensity", () => {
  it("maps the slider range onto 0..1", () => {
    expect(amountToIntensity(MIN)).toBe(0);
    expect(amountToIntensity(MAX)).toBe(1);
    // Midpoint of the dollar range lands near the middle.
    expect(amountToIntensity((MIN + MAX) / 2)).toBeCloseTo(0.5, 5);
  });

  it("clamps out-of-range amounts", () => {
    expect(amountToIntensity(0)).toBe(0);
    expect(amountToIntensity(-100)).toBe(0);
    expect(amountToIntensity(MAX + 500)).toBe(1);
  });
});
