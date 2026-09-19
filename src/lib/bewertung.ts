import type { RohAnbieter } from "@/data/vergleichHelfer";

/**
 * Punktesystem der Vergleiche, beschlossen am 14.09.2026.
 * Herleitung: `~/rebrand/KRITERIEN_VERGLEICHE.md`, Abschnitt Punktesystem.
 *
 * 1. Türsteher: "Ohne Zinsen nutzbar". Grün (zinsfrei ab Start) und gelb (Konto
 *    startet mit Zinsen, man muss sie selbst abschalten) kommen durch. Gelb
 *    halbiert den Halal-Teil (Elias, 14.09.2026). Müssen Zinsen erst aktiviert
 *    werden, ist das grün. Rot (nicht abschaltbar) heißt keine Note. Nicht
 *    geprüft heißt auch keine Note.
 * 2. Note = 0,5 × Halal-Rest + 0,5 × Finanz-Note, beide von 0 bis 5.
 *    - Halal-Rest: die übrigen Halal-Merkmale mit festen Gewichten.
 *    - Finanz-Note: Finanzpunkte (Punktetabelle von Finanzfluss, nur die
 *      Kriterien, die wir behalten) geteilt durch deren Höchstpunktzahl.
 * 3. Eine Note gibt es erst, wenn alle Halal-Merkmale geprüft sind.
 * 4. Krypto (Elias, 16.09.2026): Gezählt wird nicht mehr, wie viele von vier
 *    Münzen ein Anbieter führt. Fast jeder führt sie, das trennt nichts. Gezählt
 *    wird, ob es echte Coins sind statt eines Zertifikats, ob du sie auf deine
 *    eigene Wallet holen kannst und ob das Bezahlmodell ohne Zinsbindung
 *    auskommt.
 * 5. Ausgabeaufschlag (Elias, 15.09.2026): Ein kaufbarer Fonds zählt 1 ohne
 *    Aufschlag, 0,75 mit Rabatt, 0,5 mit vollem Aufschlag. Die Datendatei liefert
 *    das fertig gewichtet in `halalAnlagenPunkte`; null heißt Aufschlag unklar,
 *    dann bleibt die Note offen.
 *
 * Die Seiten zeigen die Note noch nicht. Sie bleiben alphabetisch, bis Elias
 * die Bewertung freischaltet.
 */

export type Kategorie = "depot" | "girokonto" | "krypto";

type HalalTeil =
  /** Ampel: "gut" zählt voll, "schlecht" null. */
  | { key: string; gewicht: number; art: "ampel" }
  /** Anteil: Text "x von N", zählt x / N. */
  | { key: string; gewicht: number; art: "anteil" }
  /** Anteile über mehrere Zeilen: Summe aller x durch Summe aller N. */
  | { keys: string[]; gewicht: number; art: "anteilSumme" };

type HalalRegel = { tuersteher: string; teile: HalalTeil[] };

export const HALAL_REGELN: Record<Kategorie, HalalRegel> = {
  depot: {
    tuersteher: "zinsfreiAbStart",
    teile: [
      // "Kein Kredit ab Start" (40 %) ist am 20.09.2026 raus, Elias' Entscheidung. Ein
      // Wertpapierkredit wird überall erst auf Antrag ausgezahlt, das Merkmal trennte nichts.
      { keys: ["halalEtfsFonds", "halalSukuk", "halalEdelmetalle"], gewicht: 1, art: "anteilSumme" },
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
      { key: "echteCoins", gewicht: 0.4, art: "ampel" },
      { key: "eigeneWallet", gewicht: 0.3, art: "ampel" },
      { key: "zinsfreiesModell", gewicht: 0.3, art: "ampel" },
    ],
  },
};

/** Höchstpunktzahl der Finanzkriterien je Vergleich. Muss zu `*_FINANZ_MAX` passen (Test). */
export const FINANZ_MAX_SUMME: Record<Kategorie, number> = { depot: 62.5, girokonto: 72, krypto: 500 };

export const GEWICHT_HALAL = 0.5;
export const GEWICHT_FINANZ = 0.5;
/** Faktor auf den Halal-Teil, wenn die Zinsen ab Start laufen und erst abgeschaltet werden müssen. */
export const FAKTOR_ABSCHALTBAR = 0.5;

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

/** "7 von 12" -> [7, 12]. */
const zaehler = (wert: unknown): [number, number] | null => {
  const a = anteil(wert);
  if (a === null || typeof wert !== "string") return null;
  const m = wert.match(/(\d+)\s+von\s+(\d+)/)!;
  return [Number(m[1]), Number(m[2])];
};

/** Alle Merkmals-Schlüssel einer Regel, für Tests und Anzeige. */
export const teilKeys = (teil: HalalTeil) => ("keys" in teil ? teil.keys : [teil.key]);

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
    return { status: "gesperrt", grund: "Zinsen nicht abschaltbar" };
  }

  const fehlt: string[] = [];
  if (tuer !== "gut" && tuer !== "teils") fehlt.push(regel.tuersteher);

  let halal = 0;
  for (const teil of regel.teile) {
    if (teil.art === "anteilSumme") {
      const z = teil.keys.map((k) => zaehler(anbieter.werte[k]));
      const offen = teil.keys.filter((_, i) => z[i] === null);
      if (offen.length > 0) {
        fehlt.push(...offen);
        continue;
      }
      const gewichtet = teil.keys.map((k) => anbieter.halalAnlagenPunkte?.[k]);
      const aufschlagOffen = teil.keys.filter((_, i) => gewichtet[i] === null);
      if (aufschlagOffen.length > 0) {
        fehlt.push(...aufschlagOffen.map((k) => `${k} (Ausgabeaufschlag)`));
        continue;
      }
      const x = z.reduce((s, v, i) => s + (gewichtet[i] ?? v![0]), 0);
      const n = z.reduce((s, v) => s + v![1], 0);
      halal += teil.gewicht * (x / n);
      continue;
    }
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
  const halalNote = 5 * halal * (tuer === "teils" ? FAKTOR_ABSCHALTBAR : 1);

  return {
    status: "bewertet",
    note: runde(GEWICHT_HALAL * halalNote + GEWICHT_FINANZ * finanz),
    halal: runde(halalNote),
    finanz: runde(finanz),
  };
};
