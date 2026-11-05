import { kursFuerIsin } from "@/lib/kurse";
import { etfListe } from "@/data/halalEtfListe";

/** Platz 1 der Halal-ETF-Liste, auf den die Polster-Rechner der Blogbeiträge sparen (Leasing, Versicherung). */
export const PLATZ1 = etfListe[0];

export type PolsterPunkt = { x: string; eingezahlt: number; wert: number };

/**
 * Dieselbe Rate jeden Monat als Sparplan auf Platz 1 der Halal-ETF-Liste, die Sonderzahlung einmal am Anfang. Monatskurse wie im
 * Rechner von /blog/halal-etf (letzter Eintrag ist der Kurs vom Stand der Kursdatei), ohne Depotkosten.
 */
export const polster = (rate: number, monate: number, sonder = 0) => {
  const reihe = kursFuerIsin(PLATZ1.isin)?.reihe ?? [];
  if (reihe.length < monate || (!rate && !sonder)) return null;
  const teil = reihe.slice(-monate);
  let anteile = sonder / teil[0][1];
  const kurve: PolsterPunkt[] = teil.map(([monat, kurs], i) => {
    anteile += rate / kurs;
    return { x: monat, eingezahlt: sonder + (i + 1) * rate, wert: anteile * kurs };
  });
  const ende = kurve[kurve.length - 1];
  return { eingezahlt: ende.eingezahlt, wert: ende.wert, kurve };
};
