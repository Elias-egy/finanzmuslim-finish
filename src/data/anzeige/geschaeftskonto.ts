import { zeigbar } from "@/lib/vollstaendig";
import { geschaeftskontoVergleich, GESCHAEFT_ZEILEN } from "../geschaeftskontoVergleich";

/** Was der Geschäftskonto-Vergleich zeigt. Regeln für alle Vergleiche: `src/data/vergleichAnzeige.ts`. */
export const geschaeftskontoAnzeige = zeigbar(geschaeftskontoVergleich, "geschaeftskonto", GESCHAEFT_ZEILEN);
