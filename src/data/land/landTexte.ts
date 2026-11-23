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
  at: { kapest: "Steuereinfach (KESt wird abgeführt)", appIos: "App-Bewertung" },
  ch: { appIos: "App-Bewertung" },
};

/**
 * Zeilen, die es im Land nicht gibt. Schweiz: keine Kapitalertragsteuer, also auch kein Abführen. Beide Länder: eine
 * App-Bewertung statt zwei, weil Finanzfluss Österreich und Schweiz nur eine Zahl je Anbieter nennen (`appIos` trägt
 * sie, beim Girokonto aus deutschen Belegen beide Zahlen in einem Wert). Finanzfluss Österreich und Schweiz zeigen keine
 * Kosten für Aktien-Sparpläne und keine depotführende Bank. Girocard, die Zahl der Geldautomaten in Deutschland, der
 * deutsche Kontowechsel-Service und das Ident-Verfahren haben dort keine Entsprechung oder keinen Beleg; ohne Zeile
 * zählen sie auch nicht in die Höchstpunkte (`finanzMaxFuerLand`).
 */
const ZEILEN_WEG: Record<Land, string[]> = {
  de: [],
  at: ["appAndroid", "aktienSparplanKosten", "bank", "girocard", "geldautomaten", "kontowechsel", "ident", "gold", "silber"],
  ch: ["kapest", "appAndroid", "aktienSparplanKosten", "bank", "girocard", "geldautomaten", "kontowechsel", "ident", "halalEdelmetalle", "gold", "silber"],
};

/**
 * Erklärung einer Zeile, die in Deutschland ein deutsches Steuerrecht nennt. Royal Mint: „nach einem Jahr steuerfrei“ gilt
 * in Österreich und der Schweiz nicht belegt (recherche-at.md Abschnitt 5) und steht dort nie.
 */
const ZEILEN_HINWEIS: Record<Land, Record<string, string>> = {
  de: {},
  at: {
    royalMint: "Unsere Nummer 1 bei Gold: Barren und Münzen lassen sich ausliefern, und ein jährliches Shariah-Zertifikat liegt vor.",
    halalEtfsFonds: "Gezählt werden nur Halal-ETFs aus unserem Vergleich, die in Österreich zum Vertrieb zugelassen sind.",
    halalSukuk: "Gezählt wird nur der iShares USD Sukuk, der in Österreich zum Vertrieb zugelassen ist.",
    halalEdelmetalle: "Gezählt wird nur der Royal Mint Gold-ETC, der in Österreich registriert ist. Andere Gold- und Silber-ETCs zählen erst mit Beleg.",
  },
  ch: {
    royalMint: "Unsere Nummer 1 bei Gold: Barren und Münzen lassen sich ausliefern, und ein jährliches Shariah-Zertifikat liegt vor.",
    halalEtfsFonds: "Gezählt werden nur Halal-ETFs aus unserem Vergleich, die in der Schweiz zum Vertrieb zugelassen sind.",
    halalSukuk: "Gezählt wird nur der iShares USD Sukuk, der in der Schweiz zum Vertrieb zugelassen ist.",
  },
};

/** Die Zeilen eines Vergleichs für ein Land: gleiche Reihenfolge, andere Wörter, fehlende Zeilen raus. */
export const zeilenFuerLand = (zeilen: VergleichsZeile[], land: Land): VergleichsZeile[] =>
  zeilen
    .filter((z) => !ZEILEN_WEG[land].includes(z.key))
    .map((z) => (ZEILEN_WORT[land][z.key] ? { ...z, label: ZEILEN_WORT[land][z.key] } : z))
    .map((z) => (ZEILEN_HINWEIS[land][z.key] ? { ...z, hinweis: ZEILEN_HINWEIS[land][z.key] } : z));

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
    rangHinweis:
      "Unsere Rangfolge für Österreich: Zuerst zählt, was ohne Zinsen nutzbar und beim Anbieter belegt ist, dann die Kosten. Sind Anbieter fast gleich gut, steht vorn, wer uns für eine Eröffnung mehr zahlt.",
  },
  ch: {
    seoZusatz: "Schweiz",
    einleitung: "Hier steht die Auswahl für die Schweiz: Anbieter, die du dort nutzen kannst, mit eigener Rangfolge, eigenen Links und Preisen in CHF.",
    rangHinweis:
      "Unsere Rangfolge für die Schweiz: Zuerst zählt, was ohne Zinsen nutzbar und beim Anbieter belegt ist, dann die Kosten. Sind Anbieter fast gleich gut, steht vorn, wer uns für eine Eröffnung mehr zahlt.",
  },
};
