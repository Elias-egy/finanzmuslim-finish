import { zeigbar } from "@/lib/vollstaendig";
import { edelmetallVergleich, EDELMETALL_ZEILEN } from "../edelmetallVergleich";

/** Was der Edelmetall-Vergleich zeigt. Regeln für alle sechs: `src/data/vergleichAnzeige.ts`. */
export const edelmetallAnzeige = zeigbar(edelmetallVergleich, "edelmetall", EDELMETALL_ZEILEN);
