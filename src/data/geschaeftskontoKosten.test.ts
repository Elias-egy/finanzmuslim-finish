import { describe, expect, it } from "vitest";
import { geschaeftFinanzPunkte, type KostenEingabe } from "./geschaeftskontoKosten";
import { GESCHAEFT_FINANZ_MAX } from "./finanzMax";

const summe = (p: Record<string, number>) => Math.round(Object.values(p).reduce((s, x) => s + x, 0) * 100) / 100;

const voll: KostenEingabe = {
  kontofuehrung: 0,
  freieBuchungen: "unbegrenzt",
  kostenBuchung: 0,
  debitkarte: 0,
  abheben: { euro: 0 },
  einzahlen: { euro: 0 },
  unterkonten: "unbegrenzt",
  buchhaltung: ["DATEV", "Lexware Office", "SevDesk", "Papierkram"],
  einlagensicherung: "ja",
};

describe("Kostenpunkte Geschäftskonto", () => {
  it("hat die Gewichte aus dem Auftrag und 150 Punkte zusammen", () => {
    expect(GESCHAEFT_FINANZ_MAX).toEqual({
      kontofuehrung: 40,
      kostenBuchung: 20,
      freieBuchungen: 16,
      abheben: 10,
      einzahlen: 8,
      debitkarte: 20,
      unterkonten: 11,
      buchhaltung: 7,
      einlagensicherung: 18,
    });
    expect(summe(GESCHAEFT_FINANZ_MAX)).toBe(150);
  });

  it("gibt dem besten denkbaren Konto alle Punkte, nie mehr", () => {
    expect(geschaeftFinanzPunkte(voll, GESCHAEFT_FINANZ_MAX)).toEqual(GESCHAEFT_FINANZ_MAX);
  });

  it("rechnet Tide Lite von Hand nach: 98,3 von 150", () => {
    // Kontoführung 0 € = 40, Buchung 0,20 € = 20 * (1 - 0,2/0,4) = 10, 5 freie = 16 * 5/100 = 0,8,
    // Abheben 2 € = 10 * (1 - 2/5) = 6, Einzahlen nicht möglich = 0, Debitkarte 0 € = 20, Unterkonten 0 = 0,
    // Buchhaltung 2 von 4 = 3,5, Einlagensicherung Ja = 18.
    const p = geschaeftFinanzPunkte(
      { ...voll, freieBuchungen: 5, kostenBuchung: 0.2, abheben: { euro: 2 }, einzahlen: "nicht möglich", unterkonten: 0, buchhaltung: ["DATEV", "eigenes Tool"] },
      GESCHAEFT_FINANZ_MAX,
    );
    expect(p).toEqual({ kontofuehrung: 40, kostenBuchung: 10, freieBuchungen: 0.8, abheben: 6, einzahlen: 0, debitkarte: 20, unterkonten: 0, buchhaltung: 3.5, einlagensicherung: 18 });
    expect(summe(p)).toBe(98.3);
  });

  it("rechnet N26 Business Standard von Hand nach: 133,25 von 150", () => {
    // Einzahlen 1,5 % = 8 * (1 - 1,5/3) = 4, drei Anbindungen = 7 * 3/4 = 5,25, keine Unterkonten = 0.
    const p = geschaeftFinanzPunkte({ ...voll, einzahlen: { prozent: 1.5 }, unterkonten: 0, buchhaltung: ["Lexware Office", "SevDesk", "Papierkram"] }, GESCHAEFT_FINANZ_MAX);
    expect(summe(p)).toBe(133.25);
  });

  it("fällt linear bis zur Grenze und nie unter 0", () => {
    expect(geschaeftFinanzPunkte({ ...voll, kontofuehrung: 15 }, GESCHAEFT_FINANZ_MAX).kontofuehrung).toBe(20);
    expect(geschaeftFinanzPunkte({ ...voll, kontofuehrung: 30 }, GESCHAEFT_FINANZ_MAX).kontofuehrung).toBe(0);
    expect(geschaeftFinanzPunkte({ ...voll, kontofuehrung: 296.31 }, GESCHAEFT_FINANZ_MAX).kontofuehrung).toBe(0);
    expect(geschaeftFinanzPunkte({ ...voll, freieBuchungen: 0, kostenBuchung: 0.4 }, GESCHAEFT_FINANZ_MAX).kostenBuchung).toBe(0);
    expect(geschaeftFinanzPunkte({ ...voll, freieBuchungen: 200 }, GESCHAEFT_FINANZ_MAX).freieBuchungen).toBe(16);
  });

  it("zählt ohne Debitkarte 0, mit Gebühr anteilig", () => {
    expect(geschaeftFinanzPunkte({ ...voll, debitkarte: null }, GESCHAEFT_FINANZ_MAX).debitkarte).toBe(0);
    expect(geschaeftFinanzPunkte({ ...voll, debitkarte: 1.25 }, GESCHAEFT_FINANZ_MAX).debitkarte).toBe(15);
  });

  it("zählt Gebühr der Fremdbank halb, nicht möglich nichts", () => {
    expect(geschaeftFinanzPunkte({ ...voll, abheben: "Fremdbank" }, GESCHAEFT_FINANZ_MAX).abheben).toBe(5);
    expect(geschaeftFinanzPunkte({ ...voll, abheben: "nicht möglich" }, GESCHAEFT_FINANZ_MAX).abheben).toBe(0);
  });

  it("zählt die Einlagensicherung: Ja 18, Teilweise 9, Nein 0", () => {
    const e = (x: KostenEingabe["einlagensicherung"]) => geschaeftFinanzPunkte({ ...voll, einlagensicherung: x }, GESCHAEFT_FINANZ_MAX).einlagensicherung;
    expect([e("ja"), e("teilweise"), e("nein")]).toEqual([18, 9, 0]);
  });

  it("zählt Unterkonten bis 5 linear und eine Anbindung nur einmal", () => {
    expect(geschaeftFinanzPunkte({ ...voll, unterkonten: 2 }, GESCHAEFT_FINANZ_MAX).unterkonten).toBe(4.4);
    expect(geschaeftFinanzPunkte({ ...voll, buchhaltung: ["DATEV", "datev", "DATEV "] }, GESCHAEFT_FINANZ_MAX).buchhaltung).toBe(1.75);
  });

  it("zählt kein Tagesgeld und keinen Zins mit", () => {
    expect(Object.keys(GESCHAEFT_FINANZ_MAX).join(" ")).not.toMatch(/zins|tagesgeld|rendite/i);
  });
});
