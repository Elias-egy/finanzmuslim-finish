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
  /** Für welchen Check die Stimme gilt (RN8): Bankkonto-Check, Depot-Check oder beide. Ohne Angabe gilt sie für beide. */
  art?: "konto" | "depot" | "alle";
  zitat: string;
  name: string;
  /** Eine kurze Zeile hinter dem Namen, etwa „Erstes Depot 2025“. */
  zeile?: string;
  foto?: string;
  sterne?: 1 | 2 | 3 | 4 | 5;
};

export const STIMMEN: Stimme[] = [];

/**
 * Die Stimmen, die zur Art des Checks passen: mit art zuerst die der Art, dann die für „alle“; ohne art (die allgemeine Verkaufsseite)
 * alle Stimmen. Nie eine Stimme der falschen Art (eine Konto-Stimme steht nicht im Depot-Check).
 */
export const stimmenFuer = (art?: "konto" | "depot", stimmen: readonly Stimme[] = STIMMEN): Stimme[] => {
  if (!art) return [...stimmen];
  const eigene = stimmen.filter((s) => s.art === art);
  const alle = stimmen.filter((s) => !s.art || s.art === "alle");
  return [...eigene, ...alle];
};

export type StimmeAnzeige = "echt" | "platzhalter" | "keine";

/** Was an Stelle 0 oder 1 steht: die echte Stimme, im Entwicklungsmodus der Platzhalter, sonst nichts. */
export const stimmeAnzeige = (index: number, dev: boolean, stimmen: readonly Stimme[] = STIMMEN): StimmeAnzeige =>
  stimmen[index] ? "echt" : dev ? "platzhalter" : "keine";

/** Die Stimme im Freebie-Kasten (CheckEinstieg): die erste der passenden Art, ohne echte Stimme nichts (nie ein Platzhalter live). */
export const stimmeFuerEinstieg = (art: "konto" | "depot", stimmen: readonly Stimme[] = STIMMEN): Stimme | undefined =>
  stimmenFuer(art, stimmen)[0];
