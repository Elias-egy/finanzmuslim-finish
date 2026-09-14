import type { RohAnbieter } from "@/data/vergleichHelfer";

/**
 * Punktesystem der Vergleiche, beschlossen am 14.09.2026.
 * Herleitung: `~/rebrand/KRITERIEN_VERGLEICHE.md`, Abschnitt Punktesystem.
 *
 * 1. Türsteher: "Zinsfrei ab Start". Nein heißt keine Note. Nicht geprüft heißt
 *    auch keine Note.
 * 2. Note = 0,5 × Halal-Rest + 0,5 × Finanz-Note, beide von 0 bis 5.
 *    - Halal-Rest: die übrigen Halal-Merkmale mit festen Gewichten.
 *    - Finanz-Note: Finanzpunkte (Punktetabelle von Finanzfluss, nur die
 *      Kriterien, die wir behalten) geteilt durch deren Höchstpunktzahl.
 * 3. Eine Note gibt es erst, wenn alle Halal-Merkmale geprüft sind.
 *
 * Die Seiten zeigen die Note noch nicht. Sie bleiben alphabetisch, bis Elias
 * die Bewertung freischaltet.
 */

export type Kategorie = "depot" | "girokonto" | "krypto";

type HalalTeil =
  /** Ampel: "gut" zählt voll, "schlecht" null. */
  | { key: string; gewicht: number; art: "ampel" }
  /** Anteil: Text "x von N", zählt x / N. */
  | { key: string; gewicht: number; art: "anteil" };

type HalalRegel = { tuersteher: string; teile: HalalTeil[] };

export const HALAL_REGELN: Record<Kategorie, HalalRegel> = {
  depot: {
    tuersteher: "zinsfreiAbStart",
    teile: [
      { key: "halalAnlagen", gewicht: 0.6, art: "anteil" },
      { key: "keinKreditAbStart", gewicht: 0.4, art: "ampel" },
    ],
  },
  girokonto: {
    tuersteher: "zinsfreiAbStart",
    teile: [
      { key: "keinDispoAbStart", gewicht: 0.5, art: "ampel" },
      { key: "karteOhneKredit", gewicht: 0.5, art: "ampel" },
    ],
  },
  krypto: {
    tuersteher: "zinsfreiAbStart",
    teile: [
      { key: "halalCoins", gewicht: 0.5, art: "anteil" },
      { key: "eigeneWallet", gewicht: 0.5, art: "ampel" },
    ],
  },
};

/** Höchstpunktzahl der Finanzkriterien je Vergleich. Muss zu `*_FINANZ_MAX` passen (Test). */
export const FINANZ_MAX_SUMME: Record<Kategorie, number> = { depot: 68, girokonto: 72, krypto: 500 };

export const GEWICHT_HALAL = 0.5;
export const GEWICHT_FINANZ = 0.5;

export type Bewertung =
  | { status: "offen"; fehlt: string[] }
  | { status: "gesperrt"; grund: string }
  | { status: "bewertet"; note: number; halal: number; finanz: number };

/** "7 von 23" -> 7/23. Alles andere -> null. */
export const anteil = (wert: unknown): number | null => {
  if (typeof wert !== "string") return null;
  const m = wert.match(/^\s*(\d+)\s+von\s+(\d+)\s*$/);
  if (!m) return null;
  const x = Number(m[1]);
  const n = Number(m[2]);
  if (n === 0 || x > n) return null;
  return x / n;
};

const ampelWert = (wert: unknown): number | null =>
  wert === "gut" ? 1 : wert === "schlecht" ? 0 : null;

const runde = (x: number) => Math.round(x * 100) / 100;

export const bewerte = (
  anbieter: RohAnbieter,
  kategorie: Kategorie,
  finanzMax: Record<string, number>,
): Bewertung => {
  const regel = HALAL_REGELN[kategorie];
  const tuer = anbieter.werte[regel.tuersteher];

  if (tuer === "schlecht") {
    return { status: "gesperrt", grund: "nicht zinsfrei ab Start" };
  }

  const fehlt: string[] = [];
  if (tuer !== "gut") fehlt.push(regel.tuersteher);

  let halal = 0;
  for (const teil of regel.teile) {
    const w = anbieter.werte[teil.key];
    const wert = teil.art === "ampel" ? ampelWert(w) : anteil(w);
    if (wert === null) {
      fehlt.push(teil.key);
      continue;
    }
    halal += teil.gewicht * wert;
  }

  const punkte = anbieter.finanzPunkte;
  if (!punkte) fehlt.push("finanzPunkte");

  if (fehlt.length > 0) return { status: "offen", fehlt };

  const max = Object.values(finanzMax).reduce((a, b) => a + b, 0);
  const summe = Object.values(punkte!).reduce((a, b) => a + b, 0);
  const finanz = 5 * Math.min(1, Math.max(0, summe / max));
  const halalNote = 5 * halal;

  return {
    status: "bewertet",
    note: runde(GEWICHT_HALAL * halalNote + GEWICHT_FINANZ * finanz),
    halal: runde(halalNote),
    finanz: runde(finanz),
  };
};
