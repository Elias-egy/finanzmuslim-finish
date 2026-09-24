import { describe, expect, it } from "vitest";
import {
  ausgaben,
  ausgabeAusSlug,
  ausgabePfad,
  datumLang,
  nachbarn,
  neuesteZuerst,
  type Ausgabe,
} from "./newsletterAusgaben";

const beispiel = (nr: number, datum: string, thema: string): Ausgabe => ({
  nr,
  datum,
  thema,
  titel: `Titel ${nr}`,
  kurz: `Worum es in Nr. ${nr} ging.`,
  lesezeitMin: 5,
  rubriken: [{ titel: "Diese Woche wichtig", absaetze: ["Text."] }],
});

const liste = [
  beispiel(1, "2026-10-09", "boykott"),
  beispiel(3, "2026-10-23", "miete"),
  beispiel(2, "2026-10-16", "doener-index"),
];

describe("ausgabePfad", () => {
  it("setzt Datum und Thema zusammen", () => {
    expect(ausgabePfad(liste[0])).toBe("/newsletter/2026-10-09-boykott");
  });
});

describe("ausgabeAusSlug", () => {
  it("findet die Ausgabe zum Adressteil", () => {
    expect(ausgabeAusSlug("2026-10-16-doener-index", liste)?.nr).toBe(2);
  });

  it("gibt nichts zurück, wenn es die Ausgabe nicht gibt", () => {
    expect(ausgabeAusSlug("2026-10-16-gibt-es-nicht", liste)).toBeUndefined();
    expect(ausgabeAusSlug(undefined, liste)).toBeUndefined();
  });
});

describe("neuesteZuerst", () => {
  it("sortiert nach Datum, neueste oben", () => {
    expect(neuesteZuerst(liste).map((a) => a.nr)).toEqual([3, 2, 1]);
  });
});

describe("nachbarn", () => {
  it("nennt die vorige und die nächste Ausgabe", () => {
    const { vorige, naechste } = nachbarn(liste[2], liste);
    expect(vorige?.nr).toBe(1);
    expect(naechste?.nr).toBe(3);
  });

  it("lässt an den Rändern leer", () => {
    expect(nachbarn(liste[0], liste).vorige).toBeUndefined();
    expect(nachbarn(liste[1], liste).naechste).toBeUndefined();
  });
});

describe("datumLang", () => {
  it("schreibt das Datum aus, ohne Zeitzonenfehler", () => {
    expect(datumLang("2026-10-09")).toBe("9. Oktober 2026");
  });
});

describe("die echten Ausgaben", () => {
  it("haben gültige, eindeutige Adressen und Nummern", () => {
    const pfade = ausgaben.map(ausgabePfad);
    expect(new Set(pfade).size).toBe(pfade.length);
    expect(new Set(ausgaben.map((a) => a.nr)).size).toBe(ausgaben.length);
    for (const a of ausgaben) {
      expect(a.datum).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(a.thema).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(a.rubriken.length).toBeGreaterThan(0);
    }
  });
});
