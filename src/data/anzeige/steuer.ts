import { zeigbar } from "@/lib/vollstaendig";
import { steuersoftwareVergleich, STEUER_ZEILEN } from "../steuersoftwareVergleich";
import type { RohAnbieter } from "../vergleichHelfer";

/** Ein Programm, das nichts kostet, hat keinen Kauf, je Kauf entfällt wie die Zahlung. */
const ohneKauf = (a: RohAnbieter): RohAnbieter =>
  a.preisEinzel === 0 && a.werte.zahlung === "entfällt" && !a.werte.abgaben
    ? { ...a, werte: { ...a.werte, abgaben: "entfällt" } }
    : a;

/** Was der Steuer-Apps-Vergleich zeigt. Regeln für alle sechs: `src/data/vergleichAnzeige.ts`. */
export const steuerAnzeige = zeigbar(steuersoftwareVergleich.map(ohneKauf), "steuer", STEUER_ZEILEN);
