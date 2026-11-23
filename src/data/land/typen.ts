/**
 * Datenform der Länderversionen (DACH1, 23.11.2026). Jede Länderliste hat dieselbe Form wie die deutschen Datendateien
 * (`RohAnbieter` aus `src/data/vergleichHelfer.ts`), damit die Vergleichsseite ohne Umbau damit rechnet: gleiche
 * Zeilen, gleiche Rangfolge (`src/lib/rangfolge.ts`), gleiche Karten und Tabelle.
 *
 * Regeln, die hier wie überall gelten (CLAUDE.md, Regelbuch vergleiche-und-rangfolge.md):
 * - Nichts erfinden. Was nicht belegt ist, bleibt `null` („noch nicht geprüft“).
 * - Nichts auf Platz 1 ohne eigenen Partnerlink.
 * - Der Partnerlink steht nie im Text: `link` ist `/out/<kurzname>`, der Kurzname steht in `src/data/partnerLinks.ts`
 *   mit `land: "at"` oder `land: "ch"` und trägt am Ende `-at` oder `-ch`.
 */
import type { RohAnbieter } from "../vergleichHelfer";
import type { Land } from "@/lib/land";

/** Welche Vergleiche es als Länderversion gibt. Schlüssel der Listen. */
export type LandSchluessel = "depot" | "girokonto" | "krypto" | "edelmetalle" | "etf-sparplan";

/**
 * Deutsche Grundadresse eines Vergleichs zum Schlüssel seiner Länderliste. Nur diese Vergleiche haben eine
 * Österreich- und eine Schweiz-Version. Steuersoftware (deutsches Steuerrecht) und Halal-Aktien-Apps (in jedem Land
 * dieselben Apps) bleiben bei Deutschland, die Länderwahl erscheint dort nicht.
 */
export const LAND_VERGLEICHE: Record<string, LandSchluessel> = {
  "/vergleich/depot": "depot",
  "/vergleich/girokonto": "girokonto",
  "/vergleich/krypto": "krypto",
  "/vergleich/edelmetalle": "edelmetalle",
  "/vergleich/etf-sparplan": "etf-sparplan",
};

export type LandVergleich = {
  /**
   * true: Die Liste ist nicht fertig. Die Seite zeigt „in Vorbereitung“, setzt noindex, steht nicht in der Sitemap, und die
   * automatische Umstellung schickt keinen Besucher dorthin. Erst `false` macht die Version öffentlich.
   */
  entwurf: boolean;
  /** Datum der Prüfung der Angaben, „TT.MM.JJJJ“. */
  stand: string | null;
  /** Woher Kosten und Konditionen stammen, steht unter der Tabelle. */
  quellenHinweis: string | null;
  anbieter: RohAnbieter[];
  /**
   * Feste Rangfolge (Anbieter-IDs, Platz 1 zuerst), wie sie der deutsche Code bis 15.11.2026 mit `LESER_REIHENFOLGE`
   * setzte (Commit 55cb5c8, Regel 7 alt). Quelle der Reihenfolge: die Rangfolge-Entscheidung des Landes (DACH1). Regel 6
   * gilt weiter: Hat Platz 1 keinen eigenen Link oder keine Note ohne Einschränkung, rückt der erste mit beidem nach vorn.
   * Die Note steht nur, wenn sie in dieser Reihenfolge absteigt (Elias A11: „Zahl und Sterne immer absteigend“).
   */
  reihenfolge?: string[];
  /** Sätze oben auf der Länderseite statt des allgemeinen Satzes aus `landTexte.ts`. */
  einleitung?: string[];
  /**
   * Wie viele Halal-Anlagen je Zeile im Land zählen (nur dort zum Vertrieb zugelassene Papiere), für Note und „x von y“.
   * Ohne Angabe die deutschen 12, 3 und 7.
   */
  anteilN?: Record<string, number>;
  /** Kasten „Worauf wir achten“, wenn der deutsche Text im Land nicht stimmt. */
  kriterien?: Array<{ titel: string; text: string }>;
};

export type LandDaten = Record<LandSchluessel, LandVergleich>;

export const leereListe = (): LandVergleich => ({ entwurf: true, stand: null, quellenHinweis: null, anbieter: [] });

export const leereLandDaten = (): LandDaten => ({
  depot: leereListe(),
  girokonto: leereListe(),
  krypto: leereListe(),
  edelmetalle: leereListe(),
  "etf-sparplan": leereListe(),
});

/** Ein Anbieter-Eintrag ist erst öffentlich, wenn sein Land stimmt: Kurzname mit `-at` oder `-ch` am Ende. */
export const landVonKurzname = (kurzname: string): Land | null => (/-at$/.test(kurzname) ? "at" : /-ch$/.test(kurzname) ? "ch" : null);
