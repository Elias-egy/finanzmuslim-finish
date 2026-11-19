import { zeigbar } from "@/lib/vollstaendig";
import { kryptoVergleich, KRYPTO_ZEILEN } from "../kryptoVergleich";
import type { RohAnbieter } from "../vergleichHelfer";

/** Wo die Auszahlung auf die eigene Wallet belegt nicht geht, gibt es keine Kosten dafür. */
const ohneAuszahlung = (a: RohAnbieter): RohAnbieter =>
  a.werte.eigeneWallet === "schlecht" && !a.werte.auszahlungBitcoin
    ? {
        ...a,
        werte: { ...a.werte, auszahlungBitcoin: "nicht möglich" },
        quellen: { ...a.quellen, ...(a.quellen?.eigeneWallet ? { auszahlungBitcoin: a.quellen.eigeneWallet } : {}) },
      }
    : a;

/** Was der Krypto-Vergleich zeigt. Regeln für alle sechs: `src/data/vergleichAnzeige.ts`. */
export const kryptoAnzeige = zeigbar(kryptoVergleich.map(ohneAuszahlung), "krypto", KRYPTO_ZEILEN);
