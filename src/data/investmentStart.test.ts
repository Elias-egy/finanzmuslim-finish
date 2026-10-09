import { describe, expect, it } from "vitest";
import { startPartner } from "./investmentStart";
import { partnerLinks } from "./partnerLinks";

describe("Startseiten der Partner", () => {
  it("führt jeden aktiven Partnerlink auf eine vorhandene Startseite", () => {
    const pfade = new Set(startPartner.map((p) => p.pfad));
    for (const l of partnerLinks.filter((x) => x.aktiv)) expect(pfade.has(l.ziel), l.kurzname).toBe(true);
  });
});
