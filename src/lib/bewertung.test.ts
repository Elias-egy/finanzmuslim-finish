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
    expect(anteil("mind. 7 von 12")).toBeNull();
    expect(anteil("5 von 4")).toBeNull();
    expect(anteil("1 von 0")).toBeNull();
  });
});

describe("bewerte", () => {
  it("gibt ohne Prüfung keine Note", () => {
    const b = bewerte(depot({ zinsfreiAbStart: null, halalEtfsFonds: null, halalSukuk: null, halalEdelmetalle: null }), "depot", MAX);
    expect(b.status).toBe("offen");
    if (b.status === "offen") {
      expect(b.fehlt).toEqual(["zinsfreiAbStart", "halalEtfsFonds", "halalSukuk", "halalEdelmetalle", "finanzPunkte"]);
    }
  });

  it("sperrt, wessen Zinsen nicht abschaltbar sind, auch mit vollen Punkten", () => {
    const b = bewerte(
      depot({ zinsfreiAbStart: "schlecht", halalEtfsFonds: "12 von 12", halalSukuk: "3 von 3", halalEdelmetalle: "8 von 8" }, { a: 60, b: 40 }),
      "depot",
      MAX,
    );
    expect(b).toEqual({ status: "gesperrt", grund: "Zinsen nicht abschaltbar" });
  });

  it("gibt die Höchstnote nur bei vollem Halal und vollen Finanzpunkten", () => {
    const b = bewerte(
      depot({ zinsfreiAbStart: "gut", halalEtfsFonds: "12 von 12", halalSukuk: "3 von 3", halalEdelmetalle: "8 von 8" }, { a: 60, b: 40 }),
      "depot",
      MAX,
    );
    expect(b).toEqual({ status: "bewertet", note: 5, halal: 5, finanz: 5 });
  });

  it("zählt beim Depot nur die Halal-Anlagen, seit das Kredit-Merkmal raus ist", () => {
    const b = bewerte(
      depot({ zinsfreiAbStart: "gut", halalEtfsFonds: "0 von 12", halalSukuk: "0 von 3", halalEdelmetalle: "0 von 8" }, { a: 60, b: 40 }),
      "depot",
      MAX,
    );
    // Halal 0 von 23 = 0, Finanz 5, Note 0,5 × 0 + 0,5 × 5 = 2,5
    expect(b).toEqual({ status: "bewertet", note: 2.5, halal: 0, finanz: 5 });
  });

  it("zählt Halal-Anlagen über alle drei Zeilen", () => {
    const b = bewerte(
      depot(
        { zinsfreiAbStart: "gut", halalEtfsFonds: "6 von 12", halalSukuk: "0 von 3", halalEdelmetalle: "8 von 8" },
        { a: 60, b: 40 },
      ),
      "depot",
      MAX,
    );
    // Anlagen 14/23, Halal 14/23 × 5 = 3,04, Note (3,04 + 5) / 2 = 4,02
    expect(b).toEqual({ status: "bewertet", note: 4.02, halal: 3.04, finanz: 5 });
  });

  it("zieht den Ausgabeaufschlag über die gewichteten Punkte ab", () => {
    const a = depot(
      { zinsfreiAbStart: "gut", halalEtfsFonds: "6 von 12", halalSukuk: "0 von 3", halalEdelmetalle: "8 von 8" },
      { a: 60, b: 40 },
    );
    // zwei Fonds mit Rabatt: 6 - 2 × 0,25 = 5,5, Anlagen 13,5/23
    const b = bewerte({ ...a, halalAnlagenPunkte: { halalEtfsFonds: 5.5 } }, "depot", MAX);
    // Halal 13,5/23 × 5 = 2,93, Note (2,93 + 5) / 2 = 3,97
    expect(b).toEqual({ status: "bewertet", note: 3.97, halal: 2.93, finanz: 5 });
  });

  it("gibt keine Note, solange der Ausgabeaufschlag eines kaufbaren Fonds unklar ist", () => {
    const a = depot(
      { zinsfreiAbStart: "gut", halalEtfsFonds: "6 von 12", halalSukuk: "0 von 3", halalEdelmetalle: "8 von 8" },
      { a: 60, b: 40 },
    );
    const b = bewerte({ ...a, halalAnlagenPunkte: { halalEtfsFonds: null, halalSukuk: 0 } }, "depot", MAX);
    expect(b).toEqual({ status: "offen", fehlt: ["halalEtfsFonds (Ausgabeaufschlag)"] });
  });

  it("lässt abschaltbare Zinsen durch, halbiert aber den Halal-Teil", () => {
    const b = bewerte(
      depot(
        { zinsfreiAbStart: "teils", halalEtfsFonds: "6 von 12", halalSukuk: "0 von 3", halalEdelmetalle: "8 von 8" },
        { a: 60, b: 40 },
      ),
      "depot",
      MAX,
    );
    // Halal 3,043 × 0,5 = 1,52, Note (1,522 + 5) / 2 = 3,26
    expect(b).toEqual({ status: "bewertet", note: 3.26, halal: 1.52, finanz: 5 });
  });

  it("zieht Abzüge ab und hält die Finanz-Note zwischen 0 und 5", () => {
    const b = bewerte(
      depot({ zinsfreiAbStart: "gut", halalEtfsFonds: "12 von 12", halalSukuk: "3 von 3", halalEdelmetalle: "8 von 8" }, { a: 2, abzug: -8 }),
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
      depot(
        { zinsfreiAbStart: "gut", echteCoins: "gut", eigeneWallet: "schlecht", zinsfreiesModell: "gut" },
        { a: 60, b: 40 },
      ),
      "krypto",
      MAX,
    );
    // Halal (0,4 + 0 + 0,3) × 5 = 3,5, Finanz 5
    expect(krypto).toEqual({ status: "bewertet", note: 4.25, halal: 3.5, finanz: 5 });
  });
});
