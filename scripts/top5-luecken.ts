/** Welche Zellen der ersten Plätze ohne Wert oder ohne Quelle sind. `npx tsx --tsconfig tsconfig.app.json scripts/top5-luecken.ts` */
import { rangfolge, type RangKategorie } from "../src/lib/rangfolge";
import { DEPOT_FINANZ_MAX } from "../src/data/brokerVergleich";
import { GIRO_FINANZ_MAX } from "../src/data/girokontoVergleich";
import { KRYPTO_FINANZ_MAX } from "../src/data/kryptoVergleich";
import { depotAnzeige, girokontoAnzeige, kryptoAnzeige } from "../src/data/vergleichAnzeige";

const sets = [
  ["depot", depotAnzeige, DEPOT_FINANZ_MAX],
  ["girokonto", girokontoAnzeige, GIRO_FINANZ_MAX],
  ["krypto", kryptoAnzeige, KRYPTO_FINANZ_MAX],
] as const;
for (const [kat, liste, max] of sets) {
  const r = rangfolge(liste, kat as RangKategorie, { finanzMax: max });
  console.log(`\n## ${kat}`);
  for (const b of r.gerankt.slice(0, 6)) {
    const a = b.anbieter;
    const leer = Object.entries(a.werte).filter(([, w]) => w === null || w === "unbekannt").map(([k]) => k);
    const ohneQuelle = Object.keys(a.werte).filter((k) => a.werte[k] !== null && !(a.quellen && a.quellen[k]));
    console.log(`${b.platz}. ${a.name} ${a.produkt} (${b.note}) link=${Boolean(a.link)}\n   leer: ${leer.join(", ") || "-"}\n   ohne eigene Quelle: ${ohneQuelle.join(", ") || "-"}`);
  }
}
