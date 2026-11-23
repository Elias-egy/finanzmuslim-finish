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
export type GiroKnopfHinweis = { bank: "norisbank" | "bbbank" | "n26"; titel: string; satz: string };

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

/**
 * N26 Österreich (DACH1, 23.11.2026): Die Landeseite des Partnerlinks (n26.com/de-at/kostenloses-girokonto, Abruf
 * 23.11.2026) nennt unten die Zinssätze des Tagesgeldkontos („Die Zinssätze für das N26 Tagesgeldkonto hängen von deinem
 * N26 Hauptkonto ab“). Das Hauptkonto wird nicht verzinst (n26.com/de-at/sparkonto: „Die Zinsen werden nur auf dein Guthaben
 * auf diesem separaten Tagesgeldkonto gezahlt.“), ein Überziehungsrahmen muss eigens aktiviert werden.
 */
const N26_AT: GiroKnopfHinweis = {
  bank: "n26",
  titel: "Girokonto komplett zinsfrei",
  satz: "Das Tagesgeld, das N26 auf der Seite nennt, kannst du ignorieren. Eröffne einfach das kostenlose Standard-Konto.",
};

/** Je Schlüssel, wie ihn die Stellen kennen: Kürzel im Check, out-Kurzname, Kennung im Girokonto-Vergleich. */
const JE_SCHLUESSEL: Record<string, GiroKnopfHinweis> = {
  no: NORISBANK,
  norisbank: NORISBANK,
  "norisbank-top-girokonto": NORISBANK,
  bb: BBBANK,
  "bbbank-bettersmart": BBBANK,
  "n26-at": N26_AT,
  "n26-standard-at": N26_AT,
};

export const giroKnopfHinweis = (schluessel: string | undefined): GiroKnopfHinweis | undefined =>
  schluessel ? JE_SCHLUESSEL[schluessel] : undefined;

export const ALLE_GIRO_KNOPF_HINWEISE: GiroKnopfHinweis[] = [NORISBANK, BBBANK, N26_AT];
