import { describe, expect, it } from "vitest";
import { brokerVergleich, DEPOT_FINANZ_MAX, DEPOT_ZEILEN } from "./brokerVergleich";
import { girokontoVergleich, GIRO_FINANZ_MAX, GIRO_ZEILEN } from "./girokontoVergleich";
import { kryptoVergleich, KRYPTO_FINANZ_MAX, KRYPTO_ZEILEN } from "./kryptoVergleich";
import { bewerte, FINANZ_MAX_SUMME, HALAL_REGELN, teilKeys, type Kategorie } from "@/lib/bewertung";
import type { RohAnbieter } from "./vergleichHelfer";
import type { VergleichsZeile } from "@/components/vergleich/vergleichTypen";

const faelle: Array<[Kategorie, RohAnbieter[], VergleichsZeile[], Record<string, number>, number]> = [
  ["depot", brokerVergleich, DEPOT_ZEILEN, DEPOT_FINANZ_MAX, 56],
  ["girokonto", girokontoVergleich, GIRO_ZEILEN, GIRO_FINANZ_MAX, 56],
  ["krypto", kryptoVergleich, KRYPTO_ZEILEN, KRYPTO_FINANZ_MAX, 27],
];

describe.each(faelle)("Vergleichsdaten %s", (kategorie, anbieter, zeilen, max, anzahl) => {
  it("enthält alle Produkte aus dem Finanzfluss-Vergleich, jede ID einmal", () => {
    expect(anbieter).toHaveLength(anzahl);
    expect(new Set(anbieter.map((a) => a.id)).size).toBe(anzahl);
  });

  it("steht alphabetisch, damit keine Rangfolge entsteht", () => {
    const namen = anbieter.map((a) => `${a.name} ${a.produkt}`.toLowerCase());
    const sortiert = [...namen].sort((a, b) => a.localeCompare(b, "de"));
    expect(namen).toEqual(sortiert);
  });

  it("hat für jedes Halal-Merkmal der Bewertung eine Zeile", () => {
    const regel = HALAL_REGELN[kategorie];
    const keys = zeilen.map((z) => z.key);
    for (const key of [regel.tuersteher, ...regel.teile.flatMap(teilKeys)]) {
      expect(keys).toContain(key);
    }
  });

  it("bleibt mit den Finanzpunkten unter der Höchstpunktzahl", () => {
    const summeMax = Object.values(max).reduce((a, b) => a + b, 0);
    expect(summeMax).toBe(FINANZ_MAX_SUMME[kategorie]);
    for (const a of anbieter) {
      for (const [k, v] of Object.entries(a.finanzPunkte ?? {})) {
        if (k === "abzug") continue;
        expect(v, `${a.id} ${k}`).toBeLessThanOrEqual(max[k] + 1e-9);
      }
      const summe = Object.values(a.finanzPunkte ?? {}).reduce((x, y) => x + y, 0);
      expect(summe, a.id).toBeLessThanOrEqual(summeMax);
    }
  });

  it("belegt jeden Halal-Wert mit einer Quelle", () => {
    const halal = zeilen.filter((z) => z.gruppe === "halal").map((z) => z.key);
    for (const a of anbieter) {
      for (const key of halal) {
        if (a.werte[key] !== null && a.werte[key] !== undefined) {
          expect(a.quellen?.[key], `${a.id} ${key}`).toBeDefined();
        }
      }
    }
  });

  it("schreibt Halal-Anlagen als 'x von N' oder 'mind. x von N'", () => {
    const gesamt: Record<string, number> = { halalEtfsFonds: 12, halalSukuk: 3, halalEdelmetalle: 8, halalCoins: 4 };
    for (const a of anbieter) {
      for (const [key, n] of Object.entries(gesamt)) {
        const w = a.werte[key];
        if (w === null || w === undefined) continue;
        const m = String(w).match(/^(mind\. )?(\d+) von (\d+)$/);
        expect(m, `${a.id} ${key}: ${w}`).not.toBeNull();
        expect(Number(m![3]), `${a.id} ${key}`).toBe(n);
        expect(Number(m![2]), `${a.id} ${key}`).toBeLessThanOrEqual(n);
      }
    }
  });

  it("vergibt keine Note, wenn Zinsen nicht abschaltbar oder nicht geprüft sind", () => {
    for (const a of anbieter) {
      const b = bewerte(a, kategorie, max);
      const tuer = a.werte[HALAL_REGELN[kategorie].tuersteher];
      if (tuer !== "gut" && tuer !== "teils") {
        expect(b.status, a.id).not.toBe("bewertet");
      }
    }
  });
});
