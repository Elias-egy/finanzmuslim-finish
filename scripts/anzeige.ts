/**
 * Was die sechs Vergleiche zeigen und wer wegen welcher Lücke fehlt.
 *
 *   npx tsx --tsconfig tsconfig.app.json scripts/anzeige.ts
 *
 * Der Schalter steht in `src/lib/vollstaendig.ts`. Die Liste ist das Arbeitsblatt für das
 * Belegen: Wer hier mit einem Feld steht, erscheint wieder, sobald das Feld belegt ist.
 */
import { luecken } from "../src/lib/vollstaendig";
import { rangfolge, type RangKategorie } from "../src/lib/rangfolge";
import type { RohAnbieter } from "../src/data/vergleichHelfer";
import type { VergleichsZeile } from "../src/components/vergleich/vergleichTypen";
import { brokerVergleich, DEPOT_ZEILEN } from "../src/data/brokerVergleich";
import { girokontoVergleich, GIRO_ZEILEN } from "../src/data/girokontoVergleich";
import { kryptoVergleich, KRYPTO_ZEILEN } from "../src/data/kryptoVergleich";
import { steuersoftwareVergleich, STEUER_ZEILEN } from "../src/data/steuersoftwareVergleich";
import { screenerVergleich, SCREENER_ZEILEN } from "../src/data/screenerVergleich";
import { edelmetallVergleich, EDELMETALL_ZEILEN } from "../src/data/edelmetallVergleich";
import {
  depotAnzeige, edelmetallAnzeige, girokontoAnzeige, kryptoAnzeige, screenerAnzeige, steuerAnzeige,
} from "../src/data/vergleichAnzeige";

const sets: [string, RangKategorie, RohAnbieter[], RohAnbieter[], VergleichsZeile[]][] = [
  ["Depot", "depot", brokerVergleich, depotAnzeige, DEPOT_ZEILEN],
  ["Edelmetalle", "edelmetall", edelmetallVergleich, edelmetallAnzeige, EDELMETALL_ZEILEN],
  ["Krypto", "krypto", kryptoVergleich, kryptoAnzeige, KRYPTO_ZEILEN],
  ["Girokonto", "girokonto", girokontoVergleich, girokontoAnzeige, GIRO_ZEILEN],
  ["Halal-Aktien-Apps", "screener", screenerVergleich, screenerAnzeige, SCREENER_ZEILEN],
  ["Steuersoftware", "steuer", steuersoftwareVergleich, steuerAnzeige, STEUER_ZEILEN],
];
const name = (a: RohAnbieter) => `${a.name} ${a.produkt}`;
const label = (zeilen: VergleichsZeile[], key: string) => zeilen.find((z) => z.key === key)?.label ?? key;

for (const [titel, kat, alle, gezeigt, zeilen] of sets) {
  const da = new Set(gezeigt.map((a) => a.id));
  const blau = (l: RohAnbieter[]) => l.filter((a) => a.link).length;
  const r = rangfolge(gezeigt, kat);
  console.log(`\n## ${titel}: vorher ${alle.length} (blau ${blau(alle)}), jetzt ${gezeigt.length} (blau ${blau(gezeigt)}), davon gerankt ${r.gerankt.length}, rot ${r.abgeraten.length}`);
  console.log("  Plätze: " + r.gerankt.map((b) => `${b.platz}. ${name(b.anbieter)}${b.anbieter.link ? "*" : ""}`).join(" | "));
  if (r.abgeraten.length) console.log("  rot: " + r.abgeraten.map((b) => name(b.anbieter)).join(" | "));
  for (const a of alle.filter((x) => !da.has(x.id))) {
    const fehlt = [...new Set(luecken(a, kat, zeilen).map((k) => label(zeilen, k)))];
    console.log(`  fehlt: ${a.link ? "BLAU " : ""}${name(a)}: ${fehlt.join(", ")}`);
  }
}
