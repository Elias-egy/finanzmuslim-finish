import kurseJson from "@/data/kurse.json";

export type Zeitraum = "r1m" | "r6m" | "r1j" | "r5j";

export type Kurs = {
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

export const renditeText = (wert: number | null | undefined) =>
  wert === null || wert === undefined
    ? null
    : `${wert > 0 ? "+" : wert < 0 ? "−" : ""}${Math.abs(wert).toFixed(1).replace(".", ",")} %`;
