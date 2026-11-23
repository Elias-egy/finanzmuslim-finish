/**
 * Was in Österreich und der Schweiz anders geschrieben oder gerechnet wird (DACH1, 23.11.2026, Elias: „Abgeltungssteuer
 * wird in Österreich zu KESt, steuereinfach“, Schweiz in CHF). Nur Wörter und Zeilen, keine Zahlen.
 *
 * Quellen: Finanzfluss Depot-Vergleich Österreich und Broker-Vergleich Schweiz, gelesen am 23.11.2026
 * (finanzfluss.de/vergleich/depot-oesterreich/, /vergleich/broker-schweiz/): Österreich „Steuereinfach in Österreich“, die
 * Bank führt die Kapitalertragsteuer (KESt) ab; Schweiz: Beträge in CHF, keine Kapitalertragsteuer auf Kursgewinne im
 * Privatvermögen. Die Rechtslage prüft Elias vor dem Livegang einer Länderversion.
 */
import type { VergleichsZeile } from "@/components/vergleich/vergleichTypen";
import type { Land } from "@/lib/land";

/** Andere Beschriftung einer Zeile je Land (Schlüssel der Zeile zu neuem Wort). */
const ZEILEN_WORT: Record<Land, Record<string, string>> = {
  de: {},
  at: { kapest: "KESt wird abgeführt" },
  ch: {},
};

/** Zeilen, die es im Land nicht gibt. Schweiz: keine Kapitalertragsteuer, also auch kein Abführen. */
const ZEILEN_WEG: Record<Land, string[]> = {
  de: [],
  at: [],
  ch: ["kapest"],
};

/** Die Zeilen eines Vergleichs für ein Land: gleiche Reihenfolge, andere Wörter, fehlende Zeilen raus. */
export const zeilenFuerLand = (zeilen: VergleichsZeile[], land: Land): VergleichsZeile[] =>
  zeilen
    .filter((z) => !ZEILEN_WEG[land].includes(z.key))
    .map((z) => (ZEILEN_WORT[land][z.key] ? { ...z, label: ZEILEN_WORT[land][z.key] } : z));

/** Höchstpunkte ohne die Zeilen, die es im Land nicht gibt, damit kein Anbieter dort Punkte „verliert“. */
export const finanzMaxFuerLand = (finanzMax: Record<string, number>, land: Land): Record<string, number> =>
  Object.fromEntries(Object.entries(finanzMax).filter(([k]) => !ZEILEN_WEG[land].includes(k)));

export type LandSprache = {
  /** Zusatz im Seitentitel und in der Beschreibung für Suchmaschinen. */
  seoZusatz: string;
  /** Satz oben auf der Länderseite. */
  einleitung: string;
  /** Satz unter dem Vergleich zur Rangfolge im Land. */
  rangHinweis: string;
};

export const LAND_SPRACHE: Record<Exclude<Land, "de">, LandSprache> = {
  at: {
    seoZusatz: "Österreich",
    einleitung: "Hier steht die Auswahl für Österreich: Anbieter, die du dort nutzen kannst, mit eigener Rangfolge und eigenen Links.",
    rangHinweis: "Die Rangfolge gilt für Österreich und rechnet mit denselben Kriterien wie in Deutschland.",
  },
  ch: {
    seoZusatz: "Schweiz",
    einleitung: "Hier steht die Auswahl für die Schweiz: Anbieter, die du dort nutzen kannst, mit eigener Rangfolge, eigenen Links und Preisen in CHF.",
    rangHinweis: "Die Rangfolge gilt für die Schweiz und rechnet mit denselben Kriterien wie in Deutschland.",
  },
};
