import { describe, expect, it } from "vitest";
import { girokontoVergleich } from "./girokontoVergleich";
import { auslandPunkte } from "./girokontoAusland";

const konto = (id: string) => girokontoVergleich.find((a) => a.id === id)!;

describe("Kriterium Ausland (PH2-01)", () => {
  it("gibt den vollen Drittelpunkt nur bei genau 0 € oder 0 %", () => {
    expect(auslandPunkte(["0 €", "0 %", "0 €"])).toBe(12);
    expect(auslandPunkte(["0 €", "0,50 %", "0,50 %"])).toBe(4);
    expect(auslandPunkte(["1 % (min. 4 €)", "1 % (min. 5 €) + 1,5 %", "1,5 % (min. 1 €, max. 5 €)"])).toBe(0);
    expect(auslandPunkte(["nicht möglich", "nicht möglich", "0 €"])).toBe(4);
  });

  it("trägt Werte, Beleg und Punkte an jedem Konto mit Finanzfluss-Eintrag ein", () => {
    for (const a of girokontoVergleich) {
      expect(a.werte.auslandAbheben, a.id).toBeTypeOf("string");
      expect(a.quellen?.auslandAbheben?.stand, a.id).toBe("19.09.2026");
      expect(a.finanzPunkte?.ausland, a.id).toBeTypeOf("number");
    }
    expect(konto("norisbank-top-girokonto").finanzPunkte?.ausland).toBe(12);
    expect(konto("meine-bank-mein-girokonto").finanzPunkte?.ausland).toBe(0);
    expect(konto("meine-bank-mein-girokonto").werte.auslandAbheben).toBe("1 % (min. 4 €)");
  });
});
