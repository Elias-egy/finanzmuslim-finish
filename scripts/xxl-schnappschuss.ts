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
  kryptoAnzeige,
  screenerAnzeige,
  steuerAnzeige,
} from "../src/data/vergleichAnzeige";
import { DEPOT_FINANZ_MAX } from "../src/data/brokerVergleich";
import { KRYPTO_FINANZ_MAX } from "../src/data/kryptoVergleich";
import { siegerDerSeite, werteAus } from "../src/lib/vergleichAssistent";
import { ANZAHL_KAUFBAR } from "../src/data/halalAnlagenZahl";
import { halalAnlagen, anbieterByName } from "../src/data/halalAnlagen";
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

// MC7d9e (Elias 31.10.2026, wie Finanzfluss): die drei besten Depots ohne automatischen Kredit, in der Reihenfolge
// des Vergleichs. Die Nummer 1 ist dieselbe wie oben (siegerDerSeite nimmt den ersten Treffer ohne Kredit).
const top3 = werteAus(depotAnzeige, "depot", DEPOT_FINANZ_MAX, { wuensche: [], gewichte: [] })
  .passt.filter((t) => !t.kredit)
  .slice(0, 3)
  .map((t) => {
    const w = t.anbieter.werte as Record<string, unknown>;
    return {
      id: t.anbieter.id,
      name: t.anbieter.name,
      domain: t.anbieter.domain,
      zinsfreiAbStart: w.zinsfreiAbStart === "gut",
      halalEtfsFonds: w.halalEtfsFonds ?? null,
      sparrateAb: String(w.sparrate ?? "").match(/^([\d.,]+)\s*€/)?.[1] ? `${String(w.sparrate).match(/^([\d.,]+)/)![1]} €` : null,
      depotgebuehr: w.depotgebuehr ?? null,
    };
  });
if (top3[0]?.id !== sieger.id) {
  console.error(`Platz 1 der drei (${top3[0]?.id}) ist nicht die Nummer 1 (${sieger.id}).`);
  process.exit(1);
}

// MC7d9g3b (31.10.2026, PLAN.md neue Seite 5): die Aktien-ETFs und Fonds des Halal-Anlagen-Vergleichs, je mit Region
// (aus dem Namen, genau ein Treffer, sonst Abbruch), ETF oder Fonds (Feld replikation „kein ETF“) und Prüfstelle
// (Feld zertifizierer bis zum ersten Komma). Nichts davon steht von Hand im Guide.
const REGIONEN: [RegExp, string][] = [
  [/Emerging Markets/, "Schwellenländer"],
  [/\bUSA\b/, "USA"],
  [/Europe/, "Europa"],
  [/Technology/, "Technologie"],
  [/World|Global|ACWI/, "Welt"],
];
const islamicAktien = halalAnlagen
  .filter((a) => a.kategorie === "aktien")
  .map((a) => {
    const treffer = REGIONEN.filter(([re]) => re.test(a.name));
    if (treffer.length !== 1) {
      console.error(`Region unklar für ${a.name}: ${treffer.map(([, r]) => r).join(", ") || "kein Treffer"}`);
      process.exit(1);
    }
    const domain = anbieterByName(a.anbieter)?.domain ?? null;
    if (!domain) {
      console.error(`Anbieter ohne Domain: ${a.anbieter}`);
      process.exit(1);
    }
    return {
      name: a.name,
      anbieter: a.anbieter,
      domain,
      isin: a.isin ?? null,
      region: treffer[0][1],
      typ: /kein ETF/.test(a.replikation ?? "") ? "Fonds" : "ETF",
      pruefstelle: a.zertifizierer.split(",")[0].trim(),
    };
  });

// MC7d9g6 (31.10.2026, PLAN-REIHENFOLGE.md): Krypto-Seite und Sukuk-Seite. Die drei besten Börsen in der Reihenfolge
// des Krypto-Vergleichs, die geprüften Münzen und die Sukuk-Produkte des Halal-Anlagen-Vergleichs, je mit Prüfstelle.
const kryptoTop3 = werteAus(kryptoAnzeige, "krypto", KRYPTO_FINANZ_MAX, { wuensche: [], gewichte: [] })
  .passt.slice(0, 3)
  .map((t) => {
    const w = t.anbieter.werte as Record<string, unknown>;
    // Die vier Halal-Kriterien aus VergleichKrypto.tsx; guides_v2.py druckt sie nur, wenn alle drei Börsen sie grün haben.
    return {
      id: t.anbieter.id,
      name: t.anbieter.name,
      domain: t.anbieter.domain,
      zinsfreiAbStart: w.zinsfreiAbStart ?? null,
      echteCoins: w.echteCoins ?? null,
      eigeneWallet: w.eigeneWallet ?? null,
      zinsfreiesModell: w.zinsfreiesModell ?? null,
    };
  });
if (kryptoTop3.length !== 3) {
  console.error(`Krypto-Vergleich: ${kryptoTop3.length} statt drei Börsen`);
  process.exit(1);
}
const muenzen = halalAnlagen
  .filter((a) => a.kategorie === "krypto")
  .map((a) => ({ name: a.name, kuerzel: a.kuerzel ?? null, zeichen: a.zeichen ?? null, pruefstelle: a.zertifizierer, link: a.zertifikatLink ?? null, hinweis: a.hinweis ?? null }));
const sukuk = halalAnlagen
  .filter((a) => a.kategorie === "sukuk")
  .map((a) => ({ name: a.name, anbieter: a.anbieter, domain: anbieterByName(a.anbieter)?.domain ?? null, kosten: a.kostenLabel, bauart: a.bauart ?? null, pruefstelle: a.zertifizierer.split(",")[0].trim() }));

const daten = {
  erzeugt: new Date().toISOString(),
  islamicAktien,
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
    top3,
  },
  girokonto: {
    anzahl: girokontoAnzeige.length,
    // „schlecht“ heißt laut Spalte zinsfreiAbStart: Zinsen laufen und lassen sich nicht abschalten.
    zinsenNichtAbschaltbar: girokontoAnzeige.filter((a) => a.werte.zinsfreiAbStart === "schlecht").length,
  },
  edelmetall: { anzahl: edelmetallAnzeige.length },
  krypto: { anzahl: kryptoAnzeige.length, top3: kryptoTop3, muenzen },
  sukuk,
  screener: { anzahl: screenerAnzeige.length },
  steuer: { anzahl: steuerAnzeige.length },
  anlagenKaufbar: ANZAHL_KAUFBAR,
  nisab: { euro: nisab.nisabGoldEuro, stand: nisab.stand, gramm: nisab.nisabGoldGramm },
};

writeFileSync(ziel, JSON.stringify(daten, null, 2) + "\n");
console.log(`xxl → ${ziel}`);
