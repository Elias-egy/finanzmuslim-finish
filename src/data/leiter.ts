/**
 * Die Freebies mit Kasten am Ende („Dein Match in unter 60 Sekunden“, `NaechsterTeil.tsx`). Das Wort steht in der
 * Klickzählung (k plus Wort, `src/lib/attribution.ts`) und in der Messung `freebie_ende`.
 *
 * AG4 (23.11.2026): Der Kasten mit dem alten Blueprint („Dein nächster Schritt“, Mail mit FERTIG, drei Guide-Seiten je
 * Wort) ist samt Guide-Stufen gestrichen; übrig ist die Liste der Wörter.
 */
export const LEITER_WOERTER = ["liste", "aktie", "vertrag", "amin", "boykott", "plan", "etf", "gold", "sukuk"] as const;

export type LeiterWort = (typeof LEITER_WOERTER)[number];
