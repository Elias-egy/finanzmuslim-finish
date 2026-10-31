// Schreibt Erklärbilder der Wissensbeiträge als SVG-Dateien für den XXL-Guide (MC7d9g3c, 31.10.2026,
// Plan fundament/upgrade/MC7D9G3C_2026-10-31/PLAN.md Abschnitt 3 im Vault). Die Komponenten werden nur gelesen;
// ändert sich ein Bild im Beitrag, diesen Lauf wiederholen, dann guides_v2.py und das PDF neu bauen.
//
// Aufruf: npx tsx --tsconfig tsconfig.app.json scripts/illu-export.ts ~/rebrand/freebies/assets/illu
// (die App-Konfiguration trägt "jsx": "react-jsx", ohne sie fehlt React beim Rendern)
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { IlluDepot, IlluDispo, IlluGold, IlluQabd, IlluZins } from "../src/components/illu";

const [ziel] = process.argv.slice(2);
if (!ziel) {
  console.error("Aufruf: npx tsx scripts/illu-export.ts <zielordner>");
  process.exit(1);
}

const bilder = { IlluGold, IlluQabd, IlluDispo, IlluZins, IlluDepot };

mkdirSync(ziel, { recursive: true });
for (const [name, Bild] of Object.entries(bilder)) {
  // Die Klassen h-auto und w-full gelten nur auf der Website; im Guide setzt styles-xxl.css die Breite.
  const svg = renderToStaticMarkup(createElement(Bild)).replace(/ class="[^"]*"/, "");
  writeFileSync(join(ziel, `${name}.svg`), `<?xml version="1.0" encoding="UTF-8"?>\n${svg.replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" ')}\n`);
  console.log(`${name}.svg`);
}
