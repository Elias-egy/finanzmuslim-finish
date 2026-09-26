/**
 * Online-Reife der Vergleiche: wie viele Kästchen sind blau, wie viele gerankt.
 *
 *   npx tsx scripts/online-reife.ts
 *
 * Elias' Schwelle für den Livegang (26.09.2026): mindestens 80 % blau, alle Anbieter
 * belegt und gerankt. Gezählt wird je Angebot; abgeratene zählen nicht mit, weil sie
 * nie einen Link bekommen. Blau = `link` gesetzt, gerankt = `rangfolge().gerankt`.
 */
import { rangfolge, type RangKategorie } from "../src/lib/rangfolge";
import type { RohAnbieter } from "../src/data/vergleichHelfer";
import { brokerVergleich } from "../src/data/brokerVergleich";
import { girokontoVergleich } from "../src/data/girokontoVergleich";
import { kryptoVergleich } from "../src/data/kryptoVergleich";
import { steuersoftwareVergleich } from "../src/data/steuersoftwareVergleich";
import { screenerVergleich } from "../src/data/screenerVergleich";
import { edelmetallVergleich } from "../src/data/edelmetallVergleich";
import { OFFENE_ANFRAGEN } from "../src/data/anfragenOffen";

const sets: [RangKategorie, RohAnbieter[]][] = [
  ["depot", brokerVergleich], ["girokonto", girokontoVergleich], ["krypto", kryptoVergleich],
  ["steuer", steuersoftwareVergleich], ["screener", screenerVergleich], ["edelmetall", edelmetallVergleich],
];
const summe = { n: 0, ab: 0, blau: 0, gerankt: 0, offen: 0, ffPartner: 0 };
const zeilen: string[] = [];
for (const [kat, liste] of sets) {
  const r = rangfolge(liste, kat, { offeneAnfragen: OFFENE_ANFRAGEN });
  const ab = new Set(r.abgeraten.map((x: any) => (x.anbieter ?? x).id));
  const moeglich = liste.filter((a) => !ab.has(a.id));
  const blau = moeglich.filter((a) => a.link);
  const ffP = moeglich.filter((a) => !a.link && a.finanzfluss?.partnerlink);
  const offenIds = new Set(r.nichtBewertet.map((x: any) => (x.anbieter ?? x).id));
  summe.n += liste.length; summe.ab += ab.size; summe.blau += blau.length; summe.gerankt += r.gerankt.length; summe.offen += r.nichtBewertet.length; summe.ffPartner += ffP.length;
  console.log(`\n## ${kat}: ${liste.length} Angebote, ${ab.size} abgeraten, ${moeglich.length} verlinkbar, blau ${blau.length}, gerankt ${r.gerankt.length}, offen ${r.nichtBewertet.length}`);
  console.log("  blau:", blau.map((a) => `${a.name} ${a.produkt}`).join(" | "));
  console.log("  ohne Link, Finanzfluss hat Partnerlink:", ffP.map((a) => `${a.name} ${a.produkt}`).join(" | "));
  console.log("  ohne Link, ohne Finanzfluss-Partner:", moeglich.filter((a) => !a.link && !a.finanzfluss?.partnerlink).map((a) => `${a.name} ${a.produkt}${offenIds.has(a.id) ? " [offen]" : ""}`).join(" | "));
  console.log("  offen (nicht bewertet):", r.nichtBewertet.map((x: any) => { const a = x.anbieter ?? x; return `${a.name} ${a.produkt}`; }).join(" | "));
}
console.log("\nSUMME", JSON.stringify(summe), "Blauquote verlinkbar:", (summe.blau / (summe.n - summe.ab) * 100).toFixed(0) + "%", "Bewertet-Quote:", (summe.gerankt / (summe.n - summe.ab) * 100).toFixed(0) + "%");
