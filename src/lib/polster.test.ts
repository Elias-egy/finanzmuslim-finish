import { describe, expect, it } from "vitest";
import { zahlAus } from "./polster";

describe("zahlAus", () => {
  it("liest Komma und Punkt mit Cent als Dezimalzeichen", () => {
    expect(zahlAus("12,90")).toBe(12.9);
    expect(zahlAus("12.90")).toBe(12.9);
    expect(zahlAus("40,5")).toBe(40.5);
  });
  it("liest ganze Beträge und Tausenderpunkte", () => {
    expect(zahlAus("40")).toBe(40);
    expect(zahlAus("1.200")).toBe(1200);
    expect(zahlAus("1.200,50")).toBe(1200.5);
  });
  it("begrenzt auf 0 bis 100.000", () => {
    expect(zahlAus("")).toBe(0);
    expect(zahlAus("999999")).toBe(100_000);
  });
});
