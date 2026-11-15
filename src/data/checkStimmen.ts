/**
 * Die zwei Stimmen der Verkaufsseite vor dem Halal-Finanz-Check (/check): eine unter dem Hero-Foto, eine unter dem
 * Gründer-Satz (Perspective-Funnel, Seite „Start“). Elias liefert echte Testimonials, bis dahin stehen hier keine:
 * Vault raw/2026-11-15-elias-rn6-02-erst-sales-page-perspective-eins-zu-eins.md („Keine erfundenen Stimmen, nur echte“).
 *
 * Solange ein Eintrag fehlt, zeigt der Entwicklungsmodus einen gelb gestrichelten Platzhalter an der Stelle, im
 * Produktionsbuild entfällt die Karte (stimmeAnzeige). Sterne stehen nur da, wo der Eintrag selbst eine Zahl
 * mitbringt, nie von uns gesetzt. Foto nur ein echtes, Pfad unter /public.
 */
export type Stimme = {
  zitat: string;
  name: string;
  /** Eine kurze Zeile hinter dem Namen, etwa „Erstes Depot 2025“. */
  zeile?: string;
  foto?: string;
  sterne?: 1 | 2 | 3 | 4 | 5;
};

export const STIMMEN: Stimme[] = [];

export type StimmeAnzeige = "echt" | "platzhalter" | "keine";

/** Was an Stelle 0 oder 1 steht: die echte Stimme, im Entwicklungsmodus der Platzhalter, sonst nichts. */
export const stimmeAnzeige = (index: number, dev: boolean, stimmen: readonly Stimme[] = STIMMEN): StimmeAnzeige =>
  stimmen[index] ? "echt" : dev ? "platzhalter" : "keine";
