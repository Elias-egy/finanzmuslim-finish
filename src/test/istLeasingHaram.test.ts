import { describe, expect, it } from "vitest";
import { rechnung } from "@/data/autoAboCheck";
import { IONIQ_JAHR, polster } from "@/pages/wissen/IstLeasingHaram";

// Die Summen im Leasing-Beitrag stehen von Hand, damit die Klauseln des Auto-Abo-Checks nicht im JavaScript der offenen Seite landen.
describe("Ist Leasing haram", () => {
  it("IONIQ-Jahr entspricht der Rechnung im Auto-Abo-Check", () => {
    const summe = (name: string) => rechnung.wege.find((w) => w.name === name)!.posten.reduce((s, p) => s + p.betrag, 0);
    expect(IONIQ_JAHR).toEqual({ abo: summe("Auto-Abo"), leasing: summe("Leasing"), bar: summe("Bar kaufen") });
  });
  it("Rechner zahlt dieselbe Summe ein wie das Leasing", () => {
    const erg = polster(300, 36, 1000);
    expect(erg?.eingezahlt).toBe(1000 + 300 * 36);
    expect(erg?.kurve).toHaveLength(36);
  });
});
