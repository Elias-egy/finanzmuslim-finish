// Schreibt die Zahlen und die Nummer 1, die der XXL-Guide druckt, als JSON nach ~/rebrand/freebies.
// guides_v2.py setzt sie in xxl.html ein, damit im PDF keine abgetippte Zahl steht (MC7d7, 30.10.2026).
// Wechselt die Nummer 1 oder ändert sich eine Zahl: Schnappschuss neu erzeugen, guides_v2.py, PDF neu bauen.
//
// Aufruf: npx tsx scripts/xxl-schnappschuss.ts ~/rebrand/freebies/xxl-daten.json
import { writeFileSync } from "node:fs";
import {
  depotAnzeige,
  edelmetallAnzeige,
  girokontoAnzeige,
  screenerAnzeige,
  steuerAnzeige,
} from "../src/data/vergleichAnzeige";
import { DEPOT_FINANZ_MAX } from "../src/data/brokerVergleich";
import { siegerDerSeite } from "../src/lib/vergleichAssistent";
import { ANZAHL_KAUFBAR } from "../src/data/halalAnlagenZahl";
import nisab from "../src/data/nisab.json";

const [ziel] = process.argv.slice(2);
if (!ziel) {
  console.error("Aufruf: npx tsx scripts/xxl-schnappschuss.ts <ziel.json>");
  process.exit(1);
}

const sieger = siegerDerSeite(depotAnzeige, "depot", DEPOT_FINANZ_MAX);
if (!sieger) {
  console.error("Keine Nummer 1 im Depot-Vergleich, der Guide kann sie nicht nennen.");
  process.exit(1);
}
const werte = sieger.werte as Record<string, unknown>;
const quellen = (sieger.quellen ?? {}) as Record<string, { url?: string; stand?: string; hinweis?: string }>;
// „1€ bis 7.500€“ → „1 €“: nur die kleinste Rate, so wie sie der Vergleich zeigt.
const sparrateAb = String(werte.sparrate ?? "").match(/^([\d.,]+)\s*€/)?.[1];

const daten = {
  erzeugt: new Date().toISOString(),
  depot: {
    anzahl: depotAnzeige.length,
    nummer1: {
      id: sieger.id,
      name: sieger.name,
      domain: sieger.domain,
      zinsfreiAbStart: werte.zinsfreiAbStart === "gut",
      zinsQuelle: quellen.zinsfreiAbStart ?? null,
      halalEtfsFonds: werte.halalEtfsFonds ?? null,
      etfQuelle: quellen.halalEtfsFonds ?? null,
      sparrateAb: sparrateAb ? `${sparrateAb} €` : null,
    },
  },
  girokonto: {
    anzahl: girokontoAnzeige.length,
    // „schlecht“ heißt laut Spalte zinsfreiAbStart: Zinsen laufen und lassen sich nicht abschalten.
    zinsenNichtAbschaltbar: girokontoAnzeige.filter((a) => a.werte.zinsfreiAbStart === "schlecht").length,
  },
  edelmetall: { anzahl: edelmetallAnzeige.length },
  screener: { anzahl: screenerAnzeige.length },
  steuer: { anzahl: steuerAnzeige.length },
  anlagenKaufbar: ANZAHL_KAUFBAR,
  nisab: { euro: nisab.nisabGoldEuro, stand: nisab.stand, gramm: nisab.nisabGoldGramm },
};

writeFileSync(ziel, JSON.stringify(daten, null, 2) + "\n");
console.log(`xxl → ${ziel}`);
