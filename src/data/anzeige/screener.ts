import { zeigbar } from "@/lib/vollstaendig";
import { screenerVergleich, SCREENER_ZEILEN } from "../screenerVergleich";

/** Was der Screener-Vergleich zeigt. Regeln für alle sechs: `src/data/vergleichAnzeige.ts`. */
export const screenerAnzeige = zeigbar(screenerVergleich, "screener", SCREENER_ZEILEN);
