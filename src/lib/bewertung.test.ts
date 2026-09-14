import { describe, expect, it } from "vitest";
import type { RohAnbieter } from "@/data/vergleichHelfer";
import { anteil, bewerte } from "./bewertung";

const MAX = { a: 60, b: 40 };

const depot = (werte: RohAnbieter["werte"], finanzPunkte?: Record<string, number>): RohAnbieter => ({
  id: "test",
  name: "Test",
  produkt: "Depot",
  werte,
  finanzPunkte,
});

describe("anteil", () => {
  it("liest x von N", () => {
    expect(anteil("7 von 23")).toBeCloseTo(7 / 23);
    expect(anteil("0 von 4")).toBe(0);
    expect(anteil("4 von 4")).toBe(1);
  });

  it("verwirft alles andere", () => {
    expect(anteil(null)).toBeNull();
    expect(anteil("sieben")).toBeNull();
    expect(anteil("5 von 4")).toBeNull();
    expect(anteil("1 von 0")).toBeNull();
  });
});

describe("bewerte", () => {
  it("gibt ohne Prüfung keine Note", () => {
    const b = bewerte(depot({ zinsfreiAbStart: null, halalAnlagen: null, keinKreditAbStart: null }), "depot", MAX);
    expect(b.status).toBe("offen");
    if (b.status === "offen") {
      expect(b.fehlt).toEqual(["zinsfreiAbStart", "halalAnlagen", "keinKreditAbStart", "finanzPunkte"]);
    }
  });

  it("sperrt, wer nicht zinsfrei ab Start ist, auch mit vollen Punkten", () => {
    const b = bewerte(
      depot({ zinsfreiAbStart: "schlecht", halalAnlagen: "23 von 23", keinKreditAbStart: "gut" }, { a: 60, b: 40 }),
      "depot",
      MAX,
    );
    expect(b).toEqual({ status: "gesperrt", grund: "nicht zinsfrei ab Start" });
  });

  it("gibt die Höchstnote nur bei vollem Halal und vollen Finanzpunkten", () => {
    const b = bewerte(
      depot({ zinsfreiAbStart: "gut", halalAnlagen: "23 von 23", keinKreditAbStart: "gut" }, { a: 60, b: 40 }),
      "depot",
      MAX,
    );
    expect(b).toEqual({ status: "bewertet", note: 5, halal: 5, finanz: 5 });
  });

  it("gewichtet Halal-Anlagen 60 und Kredit 40 Prozent", () => {
    const b = bewerte(
      depot({ zinsfreiAbStart: "gut", halalAnlagen: "0 von 23", keinKreditAbStart: "gut" }, { a: 60, b: 40 }),
      "depot",
      MAX,
    );
    // Halal 0,4 × 5 = 2, Finanz 5, Note 0,5 × 2 + 0,5 × 5 = 3,5
    expect(b).toEqual({ status: "bewertet", note: 3.5, halal: 2, finanz: 5 });
  });

  it("zieht Abzüge ab und hält die Finanz-Note zwischen 0 und 5", () => {
    const b = bewerte(
      depot({ zinsfreiAbStart: "gut", halalAnlagen: "23 von 23", keinKreditAbStart: "gut" }, { a: 2, abzug: -8 }),
      "depot",
      MAX,
    );
    expect(b.status === "bewertet" && b.finanz).toBe(0);
  });

  it("rechnet Girokonto und Krypto nach ihren eigenen Merkmalen", () => {
    const giro = bewerte(
      depot({ zinsfreiAbStart: "gut", keinDispoAbStart: "schlecht", karteOhneKredit: "gut" }, { a: 30, b: 20 }),
      "girokonto",
      MAX,
    );
    // Halal 0,5 × 5 = 2,5, Finanz 50/100 × 5 = 2,5
    expect(giro).toEqual({ status: "bewertet", note: 2.5, halal: 2.5, finanz: 2.5 });

    const krypto = bewerte(
      depot({ zinsfreiAbStart: "gut", halalCoins: "2 von 4", eigeneWallet: "gut" }, { a: 60, b: 40 }),
      "krypto",
      MAX,
    );
    // Halal (0,5 × 0,5 + 0,5) × 5 = 3,75, Finanz 5
    expect(krypto).toEqual({ status: "bewertet", note: 4.38, halal: 3.75, finanz: 5 });
  });
});
