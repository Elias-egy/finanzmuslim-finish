/** Die ersten Plätze je Vergleich als JSON, für die Szenario-Tafel. `npx tsx --tsconfig tsconfig.app.json scripts/top5.ts` */
import { rangfolge, type RangKategorie } from "../src/lib/rangfolge";
import { DEPOT_FINANZ_MAX } from "../src/data/brokerVergleich";
import { GIRO_FINANZ_MAX } from "../src/data/girokontoVergleich";
import { KRYPTO_FINANZ_MAX } from "../src/data/kryptoVergleich";
import { depotAnzeige, girokontoAnzeige, kryptoAnzeige } from "../src/data/vergleichAnzeige";

const sets = [
  ["depot", "Depot", depotAnzeige, DEPOT_FINANZ_MAX],
  ["girokonto", "Girokonto", girokontoAnzeige, GIRO_FINANZ_MAX],
  ["krypto", "Krypto", kryptoAnzeige, KRYPTO_FINANZ_MAX],
] as const;
const out = sets.map(([kat, titel, liste, max]) => {
  const r = rangfolge(liste, kat as RangKategorie, { finanzMax: max });
  return {
    vergleich: titel,
    gezeigt: r.gerankt.length,
    plaetze: r.gerankt.slice(0, 8).map((b) => ({ id: b.anbieter.id, name: `${b.anbieter.name} ${b.anbieter.produkt}`, platz: b.platz, note: b.note, link: Boolean(b.anbieter.link), nieEins: !b.uneingeschraenkt })),
  };
});
console.log(JSON.stringify(out, null, 1));
