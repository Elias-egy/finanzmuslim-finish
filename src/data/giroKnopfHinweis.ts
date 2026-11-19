/**
 * RN21 (Elias, 19.11.2026, Vault raw/2026-11-19-elias-rn21-01-tagesgeld-ignorieren-girokonto-zinsfrei.md): eine grüne,
 * positive Meldung direkt am Knopf zum Girokonto, damit der Leser beim Anbieter ohne Zweifel das Girokonto eröffnet
 * („Girokonto komplett zinsfrei, Angebot für Tagesgeld. Kann ignoriert werden.“; „dieser grüne Knopf … Girokonto eröffnen“).
 *
 * Belege (Vault raw/2026-11-19-anbieter-norisbank-bbbank-knopf-tagesgeld-beleg.md, Abruf 19.11.2026):
 * - norisbank, Landeseite des Partnerlinks, oben „Unser Flex:“ „200 € Prämie und 2,5% p.a. aufs Tagesgeld“, Knopf
 *   „Girokonto eröffnen“. Girokonto ohne Guthabenzins: Preis- und Leistungsverzeichnis, Stand 05.11.2026, und kein Dispo
 *   ab Start (beides im Girokonto-Vergleich, vergleichKorrekturenDaten.ts).
 * - BBBank, erste Karte „Tagesgeld inklusive“, Knopf „Jetzt Konto eröffnen“. BetterSmart im Vergleich ohne Zinsen,
 *   ohne Dispo ab Start, Karte ohne Kredit.
 * Keine Prämie im Satz: deals.ts führt bei der norisbank keine (200 € nur mit Tagesgeld).
 */
export type GiroKnopfHinweis = { bank: "norisbank" | "bbbank"; titel: string; satz: string };

const NORISBANK: GiroKnopfHinweis = {
  bank: "norisbank",
  titel: "Girokonto komplett zinsfrei",
  satz: "Das Tagesgeld-Angebot oben auf der Seite kannst du ignorieren. Klick einfach auf den grünen Knopf „Girokonto eröffnen“.",
};

const BBBANK: GiroKnopfHinweis = {
  bank: "bbbank",
  titel: "Girokonto komplett zinsfrei",
  satz: "Das Tagesgeld, das dabei ist, kannst du ignorieren. Klick einfach auf „Jetzt Konto eröffnen“.",
};

/** Je Schlüssel, wie ihn die Stellen kennen: Kürzel im Check, out-Kurzname, Kennung im Girokonto-Vergleich. */
const JE_SCHLUESSEL: Record<string, GiroKnopfHinweis> = {
  no: NORISBANK,
  norisbank: NORISBANK,
  "norisbank-top-girokonto": NORISBANK,
  bb: BBBANK,
  "bbbank-bettersmart": BBBANK,
};

export const giroKnopfHinweis = (schluessel: string | undefined): GiroKnopfHinweis | undefined =>
  schluessel ? JE_SCHLUESSEL[schluessel] : undefined;

export const ALLE_GIRO_KNOPF_HINWEISE: GiroKnopfHinweis[] = [NORISBANK, BBBANK];
