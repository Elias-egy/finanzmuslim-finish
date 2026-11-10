import { zeigbar } from "@/lib/vollstaendig";
import { girokontoVergleich, GIRO_ZEILEN } from "../girokontoVergleich";

/** Was der Girokonto-Vergleich zeigt. Regeln für alle sechs: `src/data/vergleichAnzeige.ts`. */
export const girokontoAnzeige = zeigbar(girokontoVergleich, "girokonto", GIRO_ZEILEN);
