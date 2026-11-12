// Vor dem Livegang laufen lassen: findet jeden Verweis auf /os-entwurf (RN1 Fund F3, 12.11.2026).
//
// Hintergrund: /os-entwurf/ ist der Entwicklungs-Umweg (Proxy in vite.config.ts), den es auf dem Hoster nicht
// gibt. Solange das Investment-OS nicht selbst eingebaut ist, zeigt die Verkaufsseite und der OS-Block der
// Startseite dorthin, und live landen beide Iframes und die Kursabrufe auf der 404-Seite.
//
// Dieses Skript ist bewusst NICHT in `build`, `pruefen` oder `test` eingehängt. Es wird erst scharf, wenn das OS
// eingebaut ist: dann in `scripts` von package.json als "os-entwurf:pruefen" und in "pruefen" aufnehmen.
//
// Aufruf: node scripts/os-entwurf-pruefen.mjs [Ordner ...]
// Ohne Ordner prüft es src/, public/ und dist/ (dist nur, wenn gebaut wurde). Ausgang 1 bei jedem Treffer,
// 0 sonst. vite.config.ts steht nicht auf der Liste: der Proxy dort ist der Umweg selbst und läuft nur im
// Entwicklungsserver.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative, resolve } from "node:path";

const WURZEL = resolve(".");
const STANDARD = ["src", "public", "dist"];
const MUSTER = /os-entwurf/i;
// Nur Textdateien lesen; PDFs, Bilder, Videos und Schriften übergehen.
const TEXT = new Set([".html", ".htm", ".js", ".mjs", ".cjs", ".ts", ".tsx", ".css", ".json", ".txt", ".xml", ".svg", ".webmanifest", ".md"]);
const UEBERSPRINGEN = new Set(["node_modules", ".git"]);
const SELBST = resolve("scripts/os-entwurf-pruefen.mjs");

const ordner = process.argv.slice(2).length ? process.argv.slice(2) : STANDARD;
const treffer = [];
let dateien = 0;

const gehe = (pfad) => {
  const st = statSync(pfad);
  if (st.isDirectory()) {
    for (const name of readdirSync(pfad)) if (!UEBERSPRINGEN.has(name)) gehe(join(pfad, name));
    return;
  }
  if (resolve(pfad) === SELBST || !TEXT.has(extname(pfad).toLowerCase()) || st.size > 20 * 1024 * 1024) return;
  dateien += 1;
  readFileSync(pfad, "utf8")
    .split("\n")
    .forEach((zeile, i) => {
      // Kommentarzeilen in Quelltext zählen nicht: sie nennen den Umweg nur, sie laden ihn nicht.
      if (MUSTER.test(zeile) && !/^\s*(\/\/|\/\*|\*)/.test(zeile)) treffer.push(`${relative(WURZEL, pfad)}:${i + 1}: ${zeile.trim().slice(0, 140)}`);
    });
};

const geprueft = [];
for (const o of ordner) {
  if (!existsSync(o)) {
    if (o !== "dist") console.log(`Ordner ${o} fehlt, übersprungen.`);
    else console.log("dist/ fehlt (noch nicht gebaut): nur Quelltext geprüft. Nach `npm run build` erneut laufen lassen.");
    continue;
  }
  geprueft.push(o);
  gehe(resolve(o));
}

if (treffer.length) {
  console.error(`ROT: ${treffer.length} Verweis(e) auf /os-entwurf in ${dateien} Dateien (${geprueft.join(", ")}):`);
  for (const t of treffer) console.error(`  ${t}`);
  console.error("Vor dem Livegang das OS selbst einbauen und die Verweise ersetzen (RN1 F3).");
  process.exit(1);
}
console.log(`GRÜN: kein Verweis auf /os-entwurf in ${dateien} Dateien (${geprueft.join(", ")}).`);
