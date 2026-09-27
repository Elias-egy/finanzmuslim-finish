// Schreibt die Daten eines gesperrten Freebies als JSON, damit der PDF-Generator in ~/rebrand/freebies
// dieselben Texte druckt wie die Website (Muster Halal-Anlagen, 27.09.2026). Ändern sich die Daten,
// Schnappschuss neu erzeugen, dann bauen.
//
// Aufruf: npx tsx scripts/freebie-schnappschuss.ts gold-check ~/rebrand/freebies/gold-check-<datum>.json
import { writeFileSync } from "node:fs";
import { faelle, fragen, gutZuWissen } from "../src/data/goldCheck";
import nisab from "../src/data/nisab.json";
import { anbieter, firmen, fragen as aboFragen, nichtBuchbar, rechnung } from "../src/data/autoAboCheck";

const [welches, ziel] = process.argv.slice(2);
const daten: Record<string, () => unknown> = {
  "gold-check": () => ({ erzeugt: new Date().toISOString(), goldpreis: { euroJeGramm: nisab.goldPreisJeGramm, stand: nisab.stand }, faelle, fragen, gutZuWissen }),
  "auto-abo-check": () => ({ erzeugt: new Date().toISOString(), anbieter, fragen: aboFragen, nichtBuchbar, firmen, rechnung }),
};

if (!welches || !ziel || !daten[welches]) {
  console.error(`Aufruf: npx tsx scripts/freebie-schnappschuss.ts <${Object.keys(daten).join("|")}> <ziel.json>`);
  process.exit(1);
}
writeFileSync(ziel, JSON.stringify(daten[welches](), null, 2) + "\n");
console.log(`${welches} → ${ziel}`);
