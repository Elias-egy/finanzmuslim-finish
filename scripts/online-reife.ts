/**
 * Online-Reife der Vergleiche: Richtwert für den Livegang.
 *
 *   npx tsx scripts/online-reife.ts
 *
 * Elias, 26.09.2026: 80 % blau von dem, woran auch Finanzfluss verdient, Haram-Angebote
 * ausgeschlossen, und alles gerankt. Gezählt wird je Angebot.
 * - Blau in Depot, Girokonto und Krypto: unter den Angeboten, die nicht abgeraten sind und
 *   bei Finanzfluss einen Partnerlink haben, der Anteil mit eigenem `link`.
 * - Blau in Steuer, Screener und Edelmetall (Elias, 06.10.2026, dort verdient Finanzfluss
 *   nicht): unter den Angeboten, die nicht abgeraten sind und ein eigenes Partnerprogramm
 *   haben (Zusage oder Link), der Anteil mit eigenem `link`. Gibt es dort kein Programm,
 *   steht "0 von 0": Programm besorgen oder die Kategorie von der Seite nehmen.
 * - Gerankt: unter allen nicht abgeratenen Angeboten der Anteil in `rangfolge().gerankt`.
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

/** Kategorien, in denen Finanzfluss nicht verdient. Blau zählt dort an eigenen Programmen. */
const EIGENE_PROGRAMME: RangKategorie[] = ["steuer", "screener", "edelmetall"];
/**
 * Marken mit Zusage, aber noch ohne Link auf der Seite. Dieselbe Liste wie ZUSAGE in
 * ~/rebrand/partner-cockpit/bauen.py (Insert Affiliate: Zoya; smartsteuer und WISO haben seit 06.10.2026 einen Link).
 */
const ZUSAGEN_OHNE_LINK = ["zoya"];
const hatZusage = (a: RohAnbieter) => ZUSAGEN_OHNE_LINK.some((k) => a.name.toLowerCase().includes(k));

const sets: [RangKategorie, RohAnbieter[]][] = [
  ["depot", brokerVergleich], ["girokonto", girokontoVergleich], ["krypto", kryptoVergleich],
  ["steuer", steuersoftwareVergleich], ["screener", screenerVergleich], ["edelmetall", edelmetallVergleich],
];
const name = (a: RohAnbieter) => `${a.name} ${a.produkt}`;
const prozent = (x: number, n: number) => `${x} von ${n} (${n ? Math.round((x / n) * 100) : 0} %)`;
let ffN = 0, ffBlau = 0, alle = 0, gerankt = 0;
for (const [kat, liste] of sets) {
  const r = rangfolge(liste, kat, { offeneAnfragen: OFFENE_ANFRAGEN });
  const ab = new Set(r.abgeraten.map((x) => x.anbieter.id));
  const halal = liste.filter((a) => !ab.has(a.id));
  const eigene = EIGENE_PROGRAMME.includes(kat);
  const ff = halal.filter((a) => (eigene ? a.link || hatZusage(a) : a.finanzfluss?.partnerlink));
  const grau = ff.filter((a) => !a.link);
  ffN += ff.length; ffBlau += ff.length - grau.length; alle += halal.length; gerankt += r.gerankt.length;
  console.log(`\n## ${kat}: blau ${prozent(ff.length - grau.length, ff.length)}${eigene ? " an eigenen Programmen" : ""}, gerankt ${prozent(r.gerankt.length, halal.length)}, abgeraten ${ab.size}`);
  if (eigene && ff.length === 0) console.log("  kein eigenes Partnerprogramm: besorgen oder Kategorie von der Seite nehmen");
  if (grau.length) console.log(`  grau, ${eigene ? "Zusage ohne Link" : "Finanzfluss verdient"}: ${grau.map(name).join(" | ")}`);
  if (r.nichtBewertet.length) console.log(`  nicht gerankt: ${r.nichtBewertet.map((x) => `${name(x.anbieter)} [${x.grund}]`).join(" | ")}`);
}
console.log(`\nRICHTWERT blau ${prozent(ffBlau, ffN)}, Ziel 80 %. Gerankt ${prozent(gerankt, alle)}, Ziel 100 %.`);
