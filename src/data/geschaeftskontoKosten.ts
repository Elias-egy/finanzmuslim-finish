/**
 * Kostenpunkte der Geschäftskonten (VG2, 23.11.2026). Eine kleine, reine Rechnung: Aus den Preisen und Leistungen eines Tarifs
 * (Quelle Finanzfluss-Vergleich Geschäftskonto, Stand 11.11.2026) werden die Punkte je Kriterium. Die Höchstpunkte stehen in
 * `GESCHAEFT_FINANZ_MAX` (`finanzMax.ts`), die Gewichte sind die von Finanzfluss ohne Tagesgeld. Zinsprodukte zählen bei uns
 * nie (Elias: „über Zinsprodukte reden wir gar nicht“).
 *
 * Eine Zeile pro Kriterium, damit jede Zahl nachzurechnen ist:
 *  - Kontoführung 40: linear, 0 € gibt alles, ab 30 € im Monat nichts.
 *  - Kosten je Buchung 20: linear, 0 € gibt alles, ab 0,40 € nichts.
 *  - Freie Buchungen 16: linear bis 100 im Monat, unbegrenzt gibt alles.
 *  - Abheben 10 und Einzahlen 8: 0 € gibt alles, „nicht möglich“ nichts, eine Gebühr in Euro läuft linear bis 5 €, in Prozent
 *    linear bis 3 %. Gebühr der Fremdbank (nur an Automaten anderer Banken) gibt die Hälfte.
 *  - Debitkarte 20: ohne Debitkarte nichts, sonst linear nach den Kosten im Monat, ab 5 € nichts.
 *  - Unterkonten 11: linear bis 5, unbegrenzt gibt alles.
 *  - Buchhaltung 7: eine Anbindung zählt 1, ab 4 Anbindungen (DATEV, Lexware Office, SevDesk, Papierkram, HBCI, Sonstige, eigenes
 *    Tool) gibt es alles.
 *  - Einlagensicherung 18: Ja alles, Teilweise die Hälfte, Nein nichts.
 */

/** `"keine Angabe"`: Finanzfluss nennt keinen Wert (Wise Business), das zählt 0 Punkte, nichts wird geschätzt. */
export type Gebuehr = { euro: number } | { prozent: number } | "nicht möglich" | "Fremdbank" | "keine Angabe";

export type KostenEingabe = {
  /** Kontoführung im Monat in Euro. */
  kontofuehrung: number;
  /** Freie Buchungen im Monat, `"unbegrenzt"` oder eine Zahl. Jahreszahlen vorher durch 12 teilen. null: keine Angabe, 0 Punkte. */
  freieBuchungen: number | "unbegrenzt" | null;
  /** Preis je Buchung über die freien hinaus, in Euro. null: keine Angabe, 0 Punkte. */
  kostenBuchung: number | null;
  /** Debitkarte: Kosten im Monat in Euro, null heißt keine Debitkarte. */
  debitkarte: number | null;
  abheben: Gebuehr;
  einzahlen: Gebuehr;
  /** null: keine Angabe, 0 Punkte (VG3 KT Bank: Die Produktseite nennt keine Unterkonten). */
  unterkonten: number | "unbegrenzt" | null;
  /** Eine Anbindung je Eintrag. */
  buchhaltung: string[];
  einlagensicherung: "ja" | "teilweise" | "nein";
};

const runde = (x: number) => Math.round(x * 100) / 100;
const zwischen = (x: number) => Math.min(1, Math.max(0, x));
/** 1 bei 0, 0 ab `bis`. */
const linearFallend = (wert: number, bis: number) => zwischen(1 - wert / bis);

const gebuehrAnteil = (g: Gebuehr): number => {
  if (g === "nicht möglich" || g === "keine Angabe") return 0;
  if (g === "Fremdbank") return 0.5;
  return "euro" in g ? linearFallend(g.euro, 5) : linearFallend(g.prozent, 3);
};

/** Die Punkte je Kriterium, Schlüssel wie in `GESCHAEFT_FINANZ_MAX`. Höchstens so viel wie dort. */
export const geschaeftFinanzPunkte = (k: KostenEingabe, max: Record<string, number>): Record<string, number> => {
  const frei = k.freieBuchungen === "unbegrenzt" ? 1 : k.freieBuchungen === null ? 0 : zwischen(k.freieBuchungen / 100);
  const unter = k.unterkonten === "unbegrenzt" ? 1 : k.unterkonten === null ? 0 : zwischen(k.unterkonten / 5);
  const anbindungen = new Set(k.buchhaltung.map((b) => b.trim().toLowerCase()).filter(Boolean)).size;
  const sicherung = k.einlagensicherung === "ja" ? 1 : k.einlagensicherung === "teilweise" ? 0.5 : 0;
  const anteile: Record<string, number> = {
    kontofuehrung: linearFallend(k.kontofuehrung, 30),
    kostenBuchung: k.kostenBuchung === null ? 0 : linearFallend(k.kostenBuchung, 0.4),
    freieBuchungen: frei,
    abheben: gebuehrAnteil(k.abheben),
    einzahlen: gebuehrAnteil(k.einzahlen),
    debitkarte: k.debitkarte === null ? 0 : linearFallend(k.debitkarte, 5),
    unterkonten: unter,
    buchhaltung: zwischen(anbindungen / 4),
    einlagensicherung: sicherung,
  };
  return Object.fromEntries(Object.entries(max).map(([key, hoechst]) => [key, runde(hoechst * (anteile[key] ?? 0))]));
};
