import type { VergleichsZeile } from "@/components/vergleich/vergleichTypen";
import type { RohAnbieter } from "./vergleichHelfer";
import { AUSLAND_JE_PRODUKT } from "./girokontoAuslandDaten";

/**
 * Kriterium „Ausland“ im Kostenteil des Girokonto-Vergleichs (Elias, PH2-01, 15.11.2026: „warum steht meine Bank
 * vor ING, DKB, Trade Republic, Consorsbank?“). meine Bank kostet im Ausland 1 % (min. 4 €) und mehr, norisbank,
 * BBBank, Consorsbank, DKB und Trade Republic nichts. Wichtig für Umrah, Urlaub und Heimatbesuch.
 *
 * Drei Teile, je ein Drittel der Punkte (`AUSLAND_PUNKTE`): Abhebung im Euro-Ausland, Abhebung in Fremdwährung,
 * Zahlung in Fremdwährung. Den vollen Drittelpunkt gibt es nur bei genau 0 € oder 0 %. Jede Gebühr, auch eine
 * kleine, und „nicht möglich“ geben 0. Die Zahlung im Euro-Ausland steht in keinem Teil, sie ist bei fast allen frei.
 * Werte und Beleg: Finanzfluss-Vergleich, Stand 19.09.2026 (`girokontoAuslandDaten.ts`).
 *
 * Fehlt ein Konto in dieser Liste, steht der Wert als „noch nicht geprüft“ in der Zeile und es zählt 0 Punkte
 * (wie jedes fehlende Finanzkriterium, `finanzNote`).
 */
export const AUSLAND_PUNKTE = 12;

export const AUSLAND_KEYS = ["auslandAbheben", "auslandFremdAbheben", "auslandFremdZahlen"] as const;

export const AUSLAND_QUELLE = {
  url: "https://www.finanzfluss.de/vergleich/girokonto/",
  stand: "19.09.2026",
  hinweis: "Finanzfluss-Vergleich, Stand 19.09.2026",
};

export const GIRO_AUSLAND_ZEILEN: VergleichsZeile[] = [
  { key: "auslandAbheben", label: "Bargeld abheben im Euro-Ausland", art: "text", gruppe: "kosten", hinweis: "Gebühr pro Abhebung an fremden Geldautomaten im Euro-Raum. Wichtig für Umrah, Urlaub und Heimatbesuch: Einen vollen Punkt gibt es nur bei 0 €." },
  { key: "auslandFremdAbheben", label: "Bargeld abheben in Fremdwährung", art: "text", gruppe: "kosten", hinweis: "Gebühr pro Abhebung außerhalb des Euro-Raums, etwa in der Türkei. Einen vollen Punkt gibt es nur bei 0 € oder 0 %." },
  { key: "auslandFremdZahlen", label: "Kartenzahlung in Fremdwährung", art: "text", gruppe: "kosten", hinweis: "Gebühr für das Bezahlen mit der Karte außerhalb des Euro-Raums. Einen vollen Punkt gibt es nur bei 0 € oder 0 %." },
];

const gratis = (w: string) => /^0(?:,0+)?\s*[€%]$/.test(w.trim());

/** Die drei Werte eines Kontos, Reihenfolge wie `AUSLAND_KEYS`. */
export const auslandWerte = (a: RohAnbieter): [string, string, string] | null =>
  (a.finanzfluss ? AUSLAND_JE_PRODUKT[a.finanzfluss.produkt] : undefined) ?? null;

/** Punkte 0 bis 12, je ein Drittel pro Teil mit genau 0 €/0 %. */
export const auslandPunkte = (w: readonly string[]): number =>
  (AUSLAND_PUNKTE / 3) * w.filter(gratis).length;

export const mitAusland = (liste: RohAnbieter[]): RohAnbieter[] =>
  liste.map((a) => {
    const w = auslandWerte(a);
    if (!w) return a;
    const hatPunkte = a.finanzPunkte && Object.keys(a.finanzPunkte).length > 0;
    return {
      ...a,
      werte: { ...a.werte, auslandAbheben: w[0], auslandFremdAbheben: w[1], auslandFremdZahlen: w[2] },
      quellen: {
        ...a.quellen,
        auslandAbheben: AUSLAND_QUELLE,
        auslandFremdAbheben: AUSLAND_QUELLE,
        auslandFremdZahlen: AUSLAND_QUELLE,
      },
      finanzPunkte: hatPunkte ? { ...a.finanzPunkte, ausland: auslandPunkte(w) } : a.finanzPunkte,
    };
  });
