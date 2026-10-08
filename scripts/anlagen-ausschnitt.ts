/**
 * Schreibt in src/data/halalAnlagenAusschnitt.ts den Block `offen` neu: die drei offenen Anlagen
 * mit ihren belegten Häusern, wortgleich aus der Kauf-Tabelle.
 *
 *   npx tsx --tsconfig tsconfig.app.json scripts/anlagen-ausschnitt.ts
 *
 * Nach jeder Änderung an src/data/anlagenKaufbar.ts laufen lassen. Der Test in
 * src/data/optin.test.ts meldet, wenn der Ausschnitt hinter den Belegen zurückliegt.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { kaufZeilen } from "../src/data/halalAnlagenKauf";
import { offen } from "../src/data/halalAnlagenAusschnitt";

const datei = join(fileURLToPath(new URL(".", import.meta.url)), "../src/data/halalAnlagenAusschnitt.ts");

const eintrag = (slug: string): string => {
  const zeile = kaufZeilen.find((z) => z.anlage.slug === slug);
  if (!zeile) throw new Error(`Ohne Kaufbeleg: ${slug}`);
  const haeuser = zeile.kaufbar.kaufbar
    .map((k) => `{ anbieter: ${JSON.stringify(k.anbieter)}${k.hinweis ? `, hinweis: ${JSON.stringify(k.hinweis)}` : ""} }`)
    .join(", ");
  const nicht = zeile.kaufbar.nichtImAngebot;
  return [
    "  {",
    `    slug: ${JSON.stringify(slug)},`,
    "    kaufbar: {",
    `      kaufbar: [${haeuser}],`,
    ...(nicht ? [`      nichtImAngebot: ${JSON.stringify(nicht).replace(/","/g, '", "')},`] : []),
    `      stand: ${JSON.stringify(zeile.kaufbar.stand)},`,
    "    },",
    "  },",
  ].join("\n");
};

const kopf = "export const offen: { slug: string; kaufbar: KaufbarAnzeige }[] = [\n";
const text = readFileSync(datei, "utf8");
const von = text.indexOf(kopf);
const bis = text.indexOf("\n];", von);
if (von < 0 || bis < 0) throw new Error("Block `offen` nicht gefunden");

writeFileSync(datei, `${text.slice(0, von)}${kopf}${offen.map((o) => eintrag(o.slug)).join("\n")}${text.slice(bis)}`);
console.log(`${offen.length} offene Anlagen neu geschrieben: ${datei}`);
