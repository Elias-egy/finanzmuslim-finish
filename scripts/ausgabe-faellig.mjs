/**
 * Ist eine Ausgabe der Halal-News fällig und noch nicht live?
 *
 * Elias, 14.10.2026 (H8): jede Ausgabe geht zur Versandzeit von selbst auf die Seite, ohne eigene Sitzung.
 * Jede Ausgabe trägt `sichtbarAb` (Versandzeit in UTC, src/data/newsletter/*.json, geschrieben von
 * ~/rebrand/mails/archiv.py). Fällig ist sie ab 35 Minuten vorher, damit der Bau (rund sechs Minuten) zur
 * Versandzeit steht, und bis 24 Stunden danach, falls ein Lauf ausfällt. Live heißt: die Adresse antwortet 200.
 *
 * Ausgabe: die Bauzeit für die Auslieferung (die spätere von jetzt und der Versandzeit), sonst leer.
 * In GitHub Actions landet sie als `bauzeit` in GITHUB_OUTPUT. JETZT (ISO) ersetzt die Uhr für Proben.
 *
 *   node scripts/ausgabe-faellig.mjs
 */
import { readdir, readFile, appendFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ORDNER = join(dirname(fileURLToPath(import.meta.url)), "../src/data/newsletter");
const BASIS = process.env.BASIS || "https://finanzmuslim.com";
const VORLAUF = 35 * 60_000;
const NACHLAUF = 24 * 3_600_000;

const jetzt = process.env.JETZT ? Date.parse(process.env.JETZT) : Date.now();

const live = async (pfad) => {
  try {
    const r = await fetch(BASIS + pfad, { redirect: "manual", signal: AbortSignal.timeout(15_000) });
    return r.status === 200;
  } catch {
    return false;
  }
};

const faellige = [];
for (const datei of (await readdir(ORDNER)).filter((d) => d.endsWith(".json"))) {
  const a = JSON.parse(await readFile(join(ORDNER, datei), "utf8"));
  if (!a.sichtbarAb) continue;
  const ab = Date.parse(a.sichtbarAb);
  if (ab - VORLAUF > jetzt || ab + NACHLAUF < jetzt) continue;
  const pfad = `/newsletter/${a.datum}-${a.thema}`;
  const steht = await live(pfad);
  console.log(`${pfad}: sichtbar ab ${a.sichtbarAb}, ${steht ? "schon live" : "noch nicht live"}`);
  if (!steht) faellige.push(ab);
}

const bauzeit = faellige.length ? new Date(Math.max(jetzt, ...faellige)).toISOString().replace(/\.\d{3}Z$/, "Z") : "";
console.log(bauzeit ? `fällig, Bauzeit ${bauzeit}` : "nichts fällig");
if (process.env.GITHUB_OUTPUT) await appendFile(process.env.GITHUB_OUTPUT, `bauzeit=${bauzeit}\n`);
