import { zeigbar } from "@/lib/vollstaendig";
import { brokerVergleich, DEPOT_ZEILEN } from "./brokerVergleich";
import { edelmetallVergleich, EDELMETALL_ZEILEN } from "./edelmetallVergleich";
import { girokontoVergleich, GIRO_ZEILEN } from "./girokontoVergleich";
import { kryptoVergleich, KRYPTO_ZEILEN } from "./kryptoVergleich";
import { screenerVergleich, SCREENER_ZEILEN } from "./screenerVergleich";
import { steuersoftwareVergleich, STEUER_ZEILEN } from "./steuersoftwareVergleich";
import type { RohAnbieter } from "./vergleichHelfer";

/**
 * Was die sechs Vergleiche zeigen. Seiten, geführter Vergleich, Logos und Zählungen lesen nur
 * diese Listen, nie die Datendateien direkt. Der Schalter steht in `src/lib/vollstaendig.ts`.
 *
 * Zwei Zellen folgen aus einem belegten Wert derselben Zeile und stehen deshalb nicht leer:
 * - Krypto: Wo die Auszahlung auf die eigene Wallet belegt nicht geht, gibt es keine Kosten dafür.
 * - Steuer: Ein Programm, das nichts kostet, hat keinen Kauf, je Kauf entfällt wie die Zahlung.
 */
const ohneAuszahlung = (a: RohAnbieter): RohAnbieter =>
  a.werte.eigeneWallet === "schlecht" && !a.werte.auszahlungBitcoin
    ? {
        ...a,
        werte: { ...a.werte, auszahlungBitcoin: "nicht möglich" },
        quellen: { ...a.quellen, ...(a.quellen?.eigeneWallet ? { auszahlungBitcoin: a.quellen.eigeneWallet } : {}) },
      }
    : a;

const ohneKauf = (a: RohAnbieter): RohAnbieter =>
  a.preisEinzel === 0 && a.werte.zahlung === "entfällt" && !a.werte.abgaben
    ? { ...a, werte: { ...a.werte, abgaben: "entfällt" } }
    : a;

export const depotAnzeige = zeigbar(brokerVergleich, "depot", DEPOT_ZEILEN);
export const edelmetallAnzeige = zeigbar(edelmetallVergleich, "edelmetall", EDELMETALL_ZEILEN);
export const girokontoAnzeige = zeigbar(girokontoVergleich, "girokonto", GIRO_ZEILEN);
export const kryptoAnzeige = zeigbar(kryptoVergleich.map(ohneAuszahlung), "krypto", KRYPTO_ZEILEN);
export const screenerAnzeige = zeigbar(screenerVergleich, "screener", SCREENER_ZEILEN);
export const steuerAnzeige = zeigbar(steuersoftwareVergleich.map(ohneKauf), "steuer", STEUER_ZEILEN);
