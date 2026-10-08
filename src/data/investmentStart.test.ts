import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { startPartner } from "./investmentStart";
import { partnerLinks } from "./partnerLinks";

describe("Startseiten der Partner", () => {
  it("hat für jede Startseite ein QR-Bild in public/", () => {
    // Der QR-Block (InvestmentStart.tsx) lädt /qr<pfad>.png. Am 27.09.2026 fehlte es bei 14 Startseiten.
    for (const p of startPartner) {
      const datei = `public/qr${p.pfad.replace(/\//g, "-")}.png`;
      expect(existsSync(datei), datei).toBe(true);
    }
  });

  it("führt jeden aktiven Partnerlink auf eine vorhandene Startseite", () => {
    const pfade = new Set(startPartner.map((p) => p.pfad));
    for (const l of partnerLinks.filter((x) => x.aktiv)) expect(pfade.has(l.ziel), l.kurzname).toBe(true);
  });
});
