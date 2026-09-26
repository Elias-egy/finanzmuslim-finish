import { describe, expect, it } from "vitest";
import {
  budgetAufteilung,
  monatlichFuerZiel,
  sparMonate,
  sparVerlauf,
} from "./rechner";

describe("sparMonate", () => {
  it("counts plain months without return", () => {
    expect(sparMonate(12_000, 0, 1000, 0)).toBe(12);
  });
  it("counts the start capital", () => {
    expect(sparMonate(12_000, 2_000, 1000, 0)).toBe(10);
  });
  it("is already there when the start covers the goal", () => {
    expect(sparMonate(1_000, 1_000, 100, 0)).toBe(0);
  });
  it("needs fewer months with a positive return", () => {
    expect(sparMonate(50_000, 0, 500, 5)).toBeLessThan(100);
    expect(sparMonate(50_000, 0, 500, 5)).toBeGreaterThan(80);
  });
  it("never runs forever", () => {
    expect(sparMonate(1_000_000, 0, 0, 0)).toBeNull();
  });
});

describe("monatlichFuerZiel", () => {
  it("inverts sparMonate without return", () => {
    expect(monatlichFuerZiel(12_000, 0, 12, 0)).toBe(1000);
    expect(monatlichFuerZiel(12_000, 2_000, 10, 0)).toBe(1000);
  });
  it("needs less per month with a return", () => {
    const ohne = monatlichFuerZiel(50_000, 0, 96, 0);
    const mit = monatlichFuerZiel(50_000, 0, 96, 5);
    expect(mit).toBeLessThan(ohne);
    // round trip: saving that amount for 96 months reaches the goal
    expect(sparMonate(50_000, 0, mit, 5)).toBeLessThanOrEqual(96);
  });
  it("is zero when the start already covers the goal", () => {
    expect(monatlichFuerZiel(1_000, 1_000, 12, 0)).toBe(0);
  });
});

describe("sparVerlauf", () => {
  it("grows linearly without return", () => {
    const v = sparVerlauf(0, 100, 0, 24);
    expect(v[0].stand).toBe(0);
    expect(v[12].stand).toBe(1200);
    expect(v[24].stand).toBe(2400);
  });
});

describe("budgetAufteilung", () => {
  it("splits the net income into the three blocks and the rest", () => {
    const b = budgetAufteilung(3_000, 1_000, 400, 800);
    expect(b.frei).toBe(800);
    expect(b.freiProzent).toBeCloseTo(26.7, 1);
    expect(b.noetig).toBe(1_400);
    expect(b.wuensche).toBe(800);
  });
  it("gives the 50/30/20 targets for the same income", () => {
    const b = budgetAufteilung(3_000, 1_000, 400, 800);
    expect(b.ziel.noetig).toBe(1_500);
    expect(b.ziel.wuensche).toBe(900);
    expect(b.ziel.sparen).toBe(600);
  });
  it("never reports a negative rest, but flags the overspend", () => {
    const b = budgetAufteilung(2_000, 1_500, 400, 500);
    expect(b.frei).toBe(0);
    expect(b.minus).toBe(400);
  });
});
