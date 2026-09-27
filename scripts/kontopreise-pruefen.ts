/**
 * Prüft jedes Zitat in src/data/kontopreise.ts gegen die abgelegten Belege.
 *
 *   npx tsx scripts/kontopreise-pruefen.ts
 *
 * Belege liegen außerhalb des Repos unter ~/rebrand/data/vergleiche/belege/<haus>/*.txt, deshalb ist das ein
 * Skript und kein Test. Ein Zitat gilt als gefunden, wenn es nach Normalisierung (Leerraum, weiche Trennstriche,
 * Steuerzeichen aus pdftotext, Silbentrennung am Zeilenende, Ligaturen) wörtlich in einer .txt des Hauses steht.
 * Exit 1, sobald eines fehlt.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { girokontoVergleich } from "../src/data/girokontoVergleich";
import { KONTOPREISE } from "../src/data/kontopreise";

const BELEGE = join(homedir(), "rebrand/data/vergleiche/belege");

const LIGATUREN: Record<string, string> = { "ﬀ": "ff", "ﬁ": "fi", "ﬂ": "fl", "ﬃ": "ffi", "ﬄ": "ffl" };

export const normalisiert = (text: string): string =>
  text
    // eslint-disable-next-line no-control-regex -- pdftotext schreibt Steuerzeichen in Preiszeilen, die fallen hier bewusst weg
    .replace(/[\u00AD\u0000-\u0008\u000B\u000C\u000E-\u001F\u200B-\u200D\uFEFF]/g, "")
    .replace(/[ﬀﬁﬂﬃﬄ]/g, (l) => LIGATUREN[l])
    .replace(/(\p{L})-\s*\n\s*(\p{Ll})/gu, "$1$2")
    .replace(/\s+/g, " ")
    .trim();

const haus = new Map(girokontoVergleich.map((a) => [a.id, a.haus ?? ""]));
let fehler = 0;
let geprueft = 0;

for (const [id, k] of Object.entries(KONTOPREISE)) {
  const h = haus.get(id);
  if (!h) {
    console.log(`FEHLT  ${id}: kein Konto mit dieser ID im Vergleich`);
    fehler += 1;
    continue;
  }
  const ordner = join(BELEGE, h);
  const texte = existsSync(ordner)
    ? readdirSync(ordner).filter((d) => d.endsWith(".txt")).map((d) => normalisiert(readFileSync(join(ordner, d), "utf8")))
    : [];
  for (const zitat of k.zitate) {
    geprueft += 1;
    if (!texte.some((t) => t.includes(normalisiert(zitat)))) {
      console.log(`FEHLT  ${id} (${h}): „${zitat}“`);
      fehler += 1;
    }
  }
}

console.log(`${geprueft} Zitate aus ${Object.keys(KONTOPREISE).length} Konten geprüft, ${fehler} nicht gefunden.`);
process.exit(fehler > 0 ? 1 : 0);
