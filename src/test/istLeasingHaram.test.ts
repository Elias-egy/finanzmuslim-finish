import { describe, expect, it } from "vitest";
import { rechnung } from "@/data/autoAboCheck";
import { IONIQ, polster } from "@/pages/wissen/IstLeasingHaram";

describe("Ist Leasing haram", () => {
  // Die Raten im Beitrag stehen von Hand, damit die Klauseln des Auto-Abo-Checks nicht im JavaScript der offenen Seite landen.
  it("IONIQ-Raten entsprechen der Rechnung im Auto-Abo-Check", () => {
    const erster = (name: string) => rechnung.wege.find((w) => w.name === name)!.posten[0].betrag;
    expect(erster("Auto-Abo")).toBe(12 * IONIQ.abo);
    expect(erster("Leasing")).toBe(12 * IONIQ.leasing);
  });
  it("Rechner zahlt dieselbe Summe ein wie das Leasing", () => {
    const erg = polster(300, 36, 1000);
    expect(erg?.eingezahlt).toBe(1000 + 300 * 36);
    expect(erg?.kurve).toHaveLength(36);
  });
});
