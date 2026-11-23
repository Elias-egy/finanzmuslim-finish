import { describe, expect, it } from "vitest";
import { startPartner } from "./investmentStart";
import { partnerLinks } from "./partnerLinks";

describe("Startseiten der Partner", () => {
  it("führt jeden aktiven Partnerlink auf eine vorhandene Startseite", () => {
    const pfade = new Set(startPartner.map((p) => p.pfad));
    for (const l of partnerLinks.filter((x) => x.aktiv)) expect(pfade.has(l.ziel), l.kurzname).toBe(true);
  });
});

describe("Startseiten Österreich (DACH1, Prüfung M-1 und M-2)", () => {
  it("Scalable Österreich sagt nie riba-frei, zinsfrei oder Halal-Depot, solange der AT-Beleg zum Verrechnungskonto fehlt", () => {
    const p = startPartner.find((x) => x.kurzname === "scalable-at")!;
    expect(p.zinsBelegFehlt).toBe(true);
    const text = JSON.stringify([p.titel, p.chips, p.fakten, p.checklisteTitel, p.checkliste, p.faqs]);
    expect(text).not.toMatch(/riba-frei|zinsfrei|Halal-Depot|ohne Zinsen nutzbar/i);
  });

  it("Österreich-Startseiten nennen keine deutschen Zählungen (12 ETFs, 3 Sukuk, 7 Gold- und Silber-ETCs)", () => {
    for (const p of startPartner.filter((x) => x.kurzname.endsWith("-at"))) {
      const text = JSON.stringify([p.fakten, p.faqs, p.chips]);
      expect(text, p.kurzname).not.toMatch(/von 12|von 22|von 3\b|alle 3 Sukuk|alle 7|von 7/);
    }
  });
});
