import kurseJson from "@/data/kurse.json";

export type Zeitraum = "r1m" | "r6m" | "r1j" | "r5j";

export type Kurs = {
  name?: string;
  waehrung?: string;
  kurs?: number | null;
  /** Monatsschlusskurse, [Monat, Kurs]. Für Tabelle und Mini-Grafiken. */
  reihe?: [string, number][];
  /** Wochenschlusskurse, [Datum, Kurs]. Für die langen Zeiträume. */
  reihe_w?: [string, number][];
  /** Tagesschlusskurse der letzten zwölf Monate. Für 1M, 3M und 1J. */
  reihe_t?: [string, number][];
  status?: string;
  r1m: number | null;
  r6m: number | null;
  r1j: number | null;
  r5j: number | null;
  verlauf: number[];
};

type KurseDatei = {
  stand: string;
  quelle: string;
  anlagen: Record<string, Kurs>;
  krypto?: Record<string, Kurs>;
};

const daten = kurseJson as unknown as KurseDatei;

export const kursStand = daten.stand;
export const kursQuelle = daten.quelle;

export const kursFuerIsin = (isin: string): Kurs | undefined => daten.anlagen[isin];
export const kursFuerKrypto = (key: string): Kurs | undefined => daten.krypto?.[key];

/** Eine Zugriffsstelle für beides. Krypto liegt unter dem Namen, Wertpapiere
 *  unter der ISIN. Die Oberfläche soll den Unterschied nicht kennen müssen. */
export const kursFuerAnlage = (a: { isin?: string; kursKey?: string }): Kurs | undefined =>
  a.kursKey ? kursFuerKrypto(a.kursKey) : a.isin ? kursFuerIsin(a.isin) : undefined;

/** Kurs mit Währung, für die Zeile rechts. */
export const kursText = (k: Kurs | undefined): string | null => {
  if (!k || k.kurs == null) return null;
  const zahl = k.kurs.toLocaleString("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const w = k.waehrung === "EUR" ? "€" : k.waehrung === "USD" ? "$" : k.waehrung === "GBP" ? "£" : "";
  return w ? `${zahl} ${w}` : zahl;
};

export const zeitraeume: { key: Zeitraum; label: string; kurz: string; monate: number }[] = [
  { key: "r1m", label: "1 Monat", kurz: "1M", monate: 1 },
  { key: "r6m", label: "6 Monate", kurz: "6M", monate: 6 },
  { key: "r1j", label: "1 Jahr", kurz: "1J", monate: 12 },
  { key: "r5j", label: "5 Jahre", kurz: "5J", monate: 60 },
];

export const monateFuer = (z: Zeitraum) => zeitraeume.find((x) => x.key === z)?.monate ?? 12;

/** Hinterer Teil des Verlaufs, passend zum gewählten Zeitraum. */
export const verlaufAusschnitt = (verlauf: number[] | undefined, z: Zeitraum) => {
  if (!verlauf || verlauf.length === 0) return [];
  const punkte = monateFuer(z) + 1;
  return verlauf.slice(Math.max(0, verlauf.length - punkte));
};

/** Hinterer Teil der echten Kursreihe, passend zum gewählten Zeitraum. */
export const reiheAusschnitt = (
  reihe: [string, number][] | undefined,
  z: Zeitraum,
): [string, number][] => {
  if (!reihe || reihe.length === 0) return [];
  const punkte = monateFuer(z) + 1;
  return reihe.slice(Math.max(0, reihe.length - punkte));
};

/* ---------------------------------------------------------------------------
   Wochenreihe. Die Monatsreihe ergibt bei fünf Jahren sechzig Punkte, das ist
   eine Treppe und kein Kursverlauf. Die Wochenreihe hat rund 260 Punkte und
   sieht aus wie bei den großen Portalen.
--------------------------------------------------------------------------- */

export type ChartZeitraum = "1m" | "3m" | "1j" | "3j" | "5j";

export const chartZeitraeume: { key: ChartZeitraum; kurz: string; lang: string; wochen: number }[] = [
  { key: "1m", kurz: "1M", lang: "einem Monat", wochen: 5 },
  { key: "3m", kurz: "3M", lang: "drei Monaten", wochen: 14 },
  { key: "1j", kurz: "1J", lang: "einem Jahr", wochen: 53 },
  { key: "3j", kurz: "3J", lang: "drei Jahren", wochen: 157 },
  { key: "5j", kurz: "5J", lang: "fünf Jahren", wochen: 10_000 },
];

/* Drei Takte, je nach Zeitraum der feinste, der die Spanne abdeckt.
   1M und 3M aus Wochenkursen sahen aus wie ein Streckenzug mit vier Ecken.
   Die Tagesreihe reicht zwölf Monate zurück, darüber bleibt es bei Wochen. */
const TAGE = 254;
const tagePro: Record<ChartZeitraum, number> = {
  "1m": 23,
  "3m": 66,
  "1j": TAGE,
  "3j": 0,
  "5j": 0,
};

/** Hinterer Teil der Kursreihe im feinsten verfügbaren Takt. Fehlt alles,
 *  wird die Monatsreihe genommen, damit auch junge Anlagen eine Grafik
 *  bekommen statt eines leeren Kastens. */
export const wochenAusschnitt = (kurs: Kurs | undefined, z: ChartZeitraum): [string, number][] => {
  const t = kurs?.reihe_t;
  const n = tagePro[z];
  if (n > 0 && t && t.length >= 3) return t.slice(Math.max(0, t.length - n));

  const w = kurs?.reihe_w;
  if (w && w.length >= 3) {
    const wochen = chartZeitraeume.find((x) => x.key === z)?.wochen ?? 53;
    return w.slice(Math.max(0, w.length - wochen));
  }
  const monate: Record<ChartZeitraum, number> = { "1m": 2, "3m": 4, "1j": 13, "3j": 37, "5j": 10_000 };
  const m = kurs?.reihe ?? [];
  return m.slice(Math.max(0, m.length - monate[z]));
};

/** Takt der gezeigten Reihe, für die Fußzeile unter der Grafik. */
export const taktFuer = (kurs: Kurs | undefined, z: ChartZeitraum): string => {
  if (tagePro[z] > 0 && (kurs?.reihe_t?.length ?? 0) >= 3) return "Tagesschlusskurse";
  if ((kurs?.reihe_w?.length ?? 0) >= 3) return "Wochenschlusskurse";
  return "Monatsschlusskurse";
};

/** Veränderung zwischen erstem und letztem sichtbaren Schlusskurs. */
export const spanneVeraenderung = (reihe: [string, number][]): number | null => {
  if (reihe.length < 2) return null;
  const start = reihe[0][1];
  const ende = reihe[reihe.length - 1][1];
  if (!start) return null;
  return Math.round(((ende - start) / start) * 1000) / 10;
};

export const renditeText = (wert: number | null | undefined) =>
  wert === null || wert === undefined
    ? null
    : `${wert > 0 ? "+" : wert < 0 ? "−" : ""}${Math.abs(wert).toFixed(1).replace(".", ",")} %`;
