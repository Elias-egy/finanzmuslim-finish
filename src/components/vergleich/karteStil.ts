import { auszeichnungVon } from "./VergleichsBausteine";
import { bonusReiter } from "./GiroKarten";
import type { VergleichsSpalte } from "./vergleichTypen";

/**
 * Farben der Vergleichskarten und Spaltenköpfe, einmal definiert (Elias 15.11.2026: „Gib den Plätzen ein bisschen
 * weniger Farbe. Finanzfluss ist ganz hell, pastellig, unseres sehr stark und laut“, Girokonto und Depot, Handy
 * und Laptop). Platz 1 ist blau, eine Karte oder Spalte mit Bonus (oder zweiter Auszeichnung) orange. Beide
 * Töne sind nur ein Hauch Farbe: Fläche etwa 4 bis 6 Prozent, Reiter etwa 10 Prozent, feiner Rand, Schrift dunkel
 * (hell) oder aufgehellt (dunkel). Im dunklen Modus tragen sie dieselbe Tönung auf dunklem Grund, kein leuchtender
 * Balken. Blau folgt den Tokens `primary` (Schrift: `--primary-text`), Orange der Tailwind-Palette.
 *
 * Kontrast: Blau `text-primary` (#0057FA) auf 10 % Blau über Weiß ergibt 4,55:1 (gerechnet); Orange `orange-900` (#7C2D12) auf
 * `orange-100` (#FFEDD5) ergibt 8,2:1; dunkel Blau `--primary-text` auf 20 % Blau 7:1, `orange-200` (#FED7AA) auf 15 % Orange über #141821 9:1.
 */
export type KartenStil = {
  /** Fläche und Rand der ganzen Karte oder des Kastens. */
  karte: string;
  /** Der Reiter oben (Streifen mit Platzzahl und Text). */
  reiter: string;
  /** Trennlinie zwischen Platzzahl und Text im Reiter. */
  trenner: string;
  /** Leichte Tönung der ganzen Tabellenspalte am Laptop. */
  spalte: string;
};

export const STIL_BLAU: KartenStil = {
  karte: "border-primary/30 bg-primary/[0.04] dark:border-primary/40 dark:bg-primary/[0.08]",
  reiter: "border-primary/30 bg-primary/10 text-primary dark:border-primary/40 dark:bg-primary/20",
  trenner: "border-primary/30 dark:border-primary/40",
  spalte: "bg-primary/[0.04] dark:bg-primary/[0.08]",
};

export const STIL_ORANGE: KartenStil = {
  karte: "border-orange-300 bg-orange-50 dark:border-orange-400/30 dark:bg-orange-400/[0.06]",
  reiter: "border-orange-300 bg-orange-100 text-orange-900 dark:border-orange-400/30 dark:bg-orange-400/15 dark:text-orange-200",
  trenner: "border-orange-300 dark:border-orange-400/30",
  spalte: "bg-orange-50/70 dark:bg-orange-400/[0.05]",
};

/**
 * Welchen Ton und welchen Text der Reiter einer Spalte trägt: Platz 1 blau mit seiner Auszeichnung, sonst orange
 * mit der zweiten Auszeichnung („Meiste Halal-Anlagen“) oder dem belegten Bonus („200 € Bonus“). Sonst keinen.
 */
export const stilVon = (s: VergleichsSpalte): { stil: KartenStil; text: string } | null => {
  if (s.abgeraten || s.grau) return null;
  const a = auszeichnungVon(s);
  if (a?.ton === "empfehlung") return { stil: STIL_BLAU, text: a.text };
  const text = a?.ton === "bonus" ? a.text : bonusReiter(s.id);
  return text ? { stil: STIL_ORANGE, text } : null;
};
