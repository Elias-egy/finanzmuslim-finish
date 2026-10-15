/**
 * Die Ausgaben der Halal-News als Webseiten.
 *
 * Jede verschickte Ausgabe bekommt eine Seite unter `/newsletter/<datum>-<thema>`,
 * dazu die Liste unter `/newsletter/archiv`. Beide stehen auf noindex und nicht in der
 * Sitemap (`src/data/routen.ts`), damit viele kurze, ähnliche Seiten den Beiträgen
 * unter /wissen nicht schaden (~/rebrand/NEWSLETTER_SYSTEM.md, Abschnitt 4).
 *
 * Was in der Mail steht, steht auch auf der Seite, Werbeplätze eingeschlossen
 * (`anzeige: true`). Eine Ausgabe wird beim Einplanen eingetragen und trägt `sichtbarAb`, die Versandzeit:
 * Erst ein Bau ab diesem Zeitpunkt zeigt sie (Liste, Seite, Startseite, Prerender). Den Bau zur Versandzeit
 * startet `.github/workflows/ausgabe-live.yml`.
 * Solange die Liste leer ist, verlinkt die Seite weder Archiv noch „aktuelle Ausgabe“.
 */

/**
 * Ein Absatz trägt dieselbe Auszeichnung wie in der Mail (`~/rebrand/mails/archiv.py` setzt sie um):
 * `<strong>`, `<small>`, Links als `[[Text|/pfad]]`, `## ` Zwischentitel, Zeilen mit `- ` als Liste,
 * `![Alt](https://…)` als Bild, `# ` als große Zeile in der Einleitung.
 */
export type Rubrik = {
  titel: string;
  absaetze: string[];
  /** Interner Pfad, Partnerlinks nur über /out/<name>. */
  link?: { text: string; to: string };
  /** Werbeplatz, wird als „Anzeige“ gekennzeichnet. */
  anzeige?: boolean;
  /** Kleine Zeile über dem Titel, z. B. „Krankenkasse“. */
  kicker?: string;
  emoji?: string;
  /** Sprungziel der Inhaltsliste, wie in der Mail. */
  anker?: string;
  /** Eigener Werbehinweis, wenn die Rubrik auf Partnerlinks führt. */
  werbung?: string;
  abstimmung?: { frage: string; woerter: string[] };
};

export type InhaltZeile = { emoji: string; wort: string; text: string; to?: string; anker?: string };

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
  titelbild?: string;
  titelbildAlt?: string;
  einleitung?: string[];
  inhalt?: InhaltZeile[];
  rubriken: Rubrik[];
  /** Versandzeit in UTC, z. B. `2026-10-16T05:00:00Z`. Vorher baut die Seite die Ausgabe nicht. Fehlt sie: sofort. */
  sichtbarAb?: string;
};

declare const __BAUZEIT__: string | undefined;

/**
 * Zeitpunkt des Baus. Vite (`vite.config.ts`) und das Laden der Routen (`scripts/routen-laden.mjs`) setzen ihn
 * aus der Umgebungsvariablen BAUZEIT, sonst gilt die Uhrzeit beim Bauen. Zur Laufzeit im Browser ändert er sich nicht,
 * damit Seite, Prerender und Sitemap dieselben Ausgaben zeigen.
 */
export const BAUZEIT = typeof __BAUZEIT__ === "string" ? Date.parse(__BAUZEIT__) : Date.now();

export const sichtbar = (a: Ausgabe, zeit: number = BAUZEIT) => !a.sichtbarAb || Date.parse(a.sichtbarAb) <= zeit;

/**
 * Je verschickte Ausgabe eine Datei in `src/data/newsletter/`, erzeugt aus der Mail mit `~/rebrand/mails/archiv.py`.
 * Das Skript trägt Import und Zeile zwischen den Markern selbst nach. Feste Importe statt import.meta.glob,
 * weil die Sitemap diese Datei über esbuild liest (scripts/routen-laden.mjs).
 */
// archiv:importe:start
import nr1 from "./newsletter/2026-10-09-launch.json";
import nr2 from "./newsletter/2026-10-16-islamic.json";
// archiv:importe:end

export const eingetragen: Ausgabe[] = [
  // archiv:liste:start
  nr1,
  nr2,
  // archiv:liste:end
];

/** Was die Seite zeigt: nur Ausgaben, deren Versandzeit beim Bau erreicht ist. */
export const ausgaben = eingetragen.filter((a) => sichtbar(a));

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
