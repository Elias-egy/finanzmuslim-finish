import { zeigbar } from "@/lib/vollstaendig";
import { brokerVergleich, DEPOT_ZEILEN } from "../brokerVergleich";

/** Was der Depot-Vergleich zeigt. Regeln für alle sechs: `src/data/vergleichAnzeige.ts`. */
export const depotAnzeige = zeigbar(brokerVergleich, "depot", DEPOT_ZEILEN);
