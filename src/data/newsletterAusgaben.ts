/**
 * Die Ausgaben des Freitagsbriefs als Webseiten.
 *
 * Jede verschickte Ausgabe bekommt eine Seite unter `/newsletter/<datum>-<thema>`,
 * dazu die Liste unter `/newsletter/archiv`. Beide stehen auf noindex und nicht in der
 * Sitemap (`src/data/routen.ts`), damit viele kurze, ähnliche Seiten den Beiträgen
 * unter /wissen nicht schaden (~/rebrand/NEWSLETTER_SYSTEM.md, Abschnitt 4).
 *
 * Was in der Mail steht, steht auch auf der Seite, Werbeplätze eingeschlossen
 * (`anzeige: true`). Eine Ausgabe kommt erst hierher, wenn sie verschickt ist.
 * Solange die Liste leer ist, verlinkt die Seite weder Archiv noch „aktuelle Ausgabe“.
 */

export type Rubrik = {
  titel: string;
  absaetze: string[];
  /** Interner Pfad, Partnerlinks nur über /out/<name>. */
  link?: { text: string; to: string };
  /** Werbeplatz, wird als „Anzeige“ gekennzeichnet. */
  anzeige?: boolean;
};

export type Ausgabe = {
  nr: number;
  /** Versanddatum, yyyy-mm-dd. */
  datum: string;
  /** Kurzes Thema für die Adresse, klein und mit Bindestrichen, z. B. `boykott`. */
  thema: string;
  titel: string;
  /** Ein Satz, worum es ging. Steht im Archiv. */
  kurz: string;
  lesezeitMin: number;
  rubriken: Rubrik[];
};

export const ausgaben: Ausgabe[] = [];

export const ausgabePfad = (a: Ausgabe) => `/newsletter/${a.datum}-${a.thema}`;

export const ausgabeAusSlug = (slug: string | undefined, liste: Ausgabe[] = ausgaben) =>
  slug ? liste.find((a) => `${a.datum}-${a.thema}` === slug) : undefined;

export const neuesteZuerst = (liste: Ausgabe[] = ausgaben) =>
  [...liste].sort((a, b) => b.datum.localeCompare(a.datum));

export const nachbarn = (ausgabe: Ausgabe, liste: Ausgabe[] = ausgaben) => {
  const aelteste = [...neuesteZuerst(liste)].reverse();
  const i = aelteste.findIndex((a) => a === ausgabe);
  return {
    vorige: i > 0 ? aelteste[i - 1] : undefined,
    naechste: i >= 0 && i < aelteste.length - 1 ? aelteste[i + 1] : undefined,
  };
};

const MONATE = [
  "Januar", "Februar", "März", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Dezember",
];

/** „2026-10-09“ wird „9. Oktober 2026“. Ohne Date-Objekt, damit keine Zeitzone das Datum verschiebt. */
export const datumLang = (iso: string) => {
  const [jahr, monat, tag] = iso.split("-").map(Number);
  return `${tag}. ${MONATE[monat - 1]} ${jahr}`;
};
