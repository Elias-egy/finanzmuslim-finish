import { describe, expect, it } from "vitest";
import { ANBIETER_LOGOS, logoMass } from "@/data/anbieterLogos";
import { LOGO_MASSE } from "@/data/anbieterLogoMasse";

describe("PH4: Logos optisch gleich groß wie bei Finanzfluss", () => {
  it("hat für jede Logo-Datei gemessene Maße (neue Datei: neu messen, docs/LOGOS.md)", () => {
    for (const [domain, e] of Object.entries(ANBIETER_LOGOS)) expect(LOGO_MASSE[e.datei], domain).toBeDefined();
  });

  it("setzt jedes Logo in die Fläche 134 × 36, nie verzerrt", () => {
    for (const [domain, e] of Object.entries(ANBIETER_LOGOS)) {
      const m = logoMass(e, LOGO_MASSE[e.datei]);
      expect(m, domain).toBeDefined();
      if (!m) continue;
      expect(m.breite, domain).toBeLessThanOrEqual(134);
      expect(m.hoehe, domain).toBeLessThanOrEqual(34);
      const masse = LOGO_MASSE[e.datei];
      const [x0, y0, x1, y1] = m.ausschnitt;
      const aspekt = ((x1 - x0) * masse.bild[0]) / ((y1 - y0) * masse.bild[1]);
      expect(Math.abs(m.breite / m.hoehe - aspekt) / aspekt, domain).toBeLessThan(0.02);
    }
  });

  it("übernimmt die Schrifthöhe von Finanzfluss, wo es sie gibt", () => {
    const bbva = logoMass(ANBIETER_LOGOS["bbva.de"], LOGO_MASSE[ANBIETER_LOGOS["bbva.de"].datei]);
    expect(bbva?.hoehe).toBe(21.7);
  });
});
