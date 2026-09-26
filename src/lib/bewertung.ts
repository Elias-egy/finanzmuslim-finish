/**
 * Auslaufend (P3, 26.09.2026). Gerechnet wird nur noch in `src/lib/rangfolge.ts`.
 * Hier stehen bis zur neuen Methodik-Seite (P4) nur die Zahlen, die
 * `src/pages/VergleichMethodik.tsx` anzeigt. Herleitung des Punktesystems vom
 * 14.09.2026: `~/rebrand/KRITERIEN_VERGLEICHE.md`, Abschnitt Punktesystem.
 */

export type Kategorie = "depot" | "girokonto" | "krypto";

/** Höchstpunktzahl der Finanzkriterien je Vergleich. Muss zu `*_FINANZ_MAX` passen (Test in vergleiche.test.ts). */
export const FINANZ_MAX_SUMME: Record<Kategorie, number> = { depot: 62.5, girokonto: 72, krypto: 500 };

export const GEWICHT_HALAL = 0.5;
export const GEWICHT_FINANZ = 0.5;
