import { kursFuerIsin } from "@/lib/kurse";
import { etfListe } from "@/data/halalEtfListe";

/** Platz 1 der Halal-ETF-Liste, auf den die Polster-Rechner der Blogbeiträge sparen (Leasing, Versicherung). */
export const PLATZ1 = etfListe[0];

/**
 * Eingabe der Rechner als Euro-Betrag: Komma oder Punkt mit ein, zwei Stellen am Ende ist das Dezimalzeichen („12,90“, „12.90“),
 * jeder andere Punkt trennt Tausender („1.200“). Begrenzt auf 0 bis 100.000.
 */
export const zahlAus = (s: string) => {
  const t = s.trim();
  const m = t.match(/^(.*)[.,](\d{1,2})$/);
  const zahl = m ? Number(`${m[1].replace(/\D/g, "")}.${m[2]}`) : Number(t.replace(/\D/g, ""));
  return Math.min(Math.max(zahl || 0, 0), 100_000);
};

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
  // Rendite im Jahr des Fonds über genau diesen Zeitraum (Station SEO61: jeder Rechner nennt die Rendite, mit der er rechnet).
  const renditeJahr = teil.length > 1 ? Math.pow(teil[teil.length - 1][1] / teil[0][1], 12 / (teil.length - 1)) - 1 : 0;
  return { eingezahlt: ende.eingezahlt, wert: ende.wert, kurve, renditeJahr };
};
