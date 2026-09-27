// Prüft nach dem Build, dass die offenen Seiten der gesperrten Vorlagen den gesperrten Teil nicht
// enthalten: weder im vorgerenderten HTML noch in einer JavaScript-Datei, die die Seite lädt
// (auch nicht über Importe dieser Dateien). Die Merkmale kommen direkt aus den Datendateien, damit
// neue Einträge automatisch mitgeprüft werden. Plan Opt-in-Strecke, Entscheidung 6; ergänzt nach
// der Gegenlese vom 27.09.2026, weil die Tests nur direkte Importe sahen.
//
// Aufruf nach `npm run build`: node scripts/schranke-pruefen.mjs
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const DIST = resolve("dist");
const lies = (p) => readFileSync(p, "utf8");
const werte = (datei, feld) => [...lies(datei).matchAll(new RegExp(`${feld}:\\s*"((?:[^"\\\\]|\\\\.)*)"`, "g"))].map((m) => m[1]);

// Gesperrt ist, was in der vollen Datei steht und nicht im Ausschnitt.
const ohne = (alle, offen) => alle.filter((w) => w.length > 12 && !offen.includes(w));
const merkmale = {
  "vorlagen/rizq": [
    ...ohne(werte("src/data/duas.ts", "ar"), werte("src/data/duasAusschnitt.ts", "ar")),
    ...ohne(werte("src/data/duas.ts", "de"), werte("src/data/duasAusschnitt.ts", "de")),
  ],
  "vorlagen/vertrags-ampel": ohne(werte("src/data/vertragsAmpel.ts", "woran"), werte("src/data/vertragsAmpelAusschnitt.ts", "woran")),
  // Beleg-Adressen mit Pfad; eine nackte Startseite wie https://de.scalable.capital steckt auch in anderen Links.
  "vorlagen/halal-anlagen": [...new Set([...lies("src/data/anlagenKaufbar.ts").matchAll(/"url": "([^"]+)"/g)].map((m) => m[1]))].filter(
    (u) => new URL(u).pathname.length > 1,
  ),
  // Grund und festes Beispiel je Fall; Beispiele mit Goldpreis sind Vorlagen-Strings und stehen nicht drin.
  "vorlagen/gold-check": [
    ...ohne(werte("src/data/goldCheck.ts", "grund"), werte("src/data/goldCheckAusschnitt.ts", "grund")),
    ...ohne(werte("src/data/goldCheck.ts", "beispiel"), werte("src/data/goldCheckAusschnitt.ts", "beispiel")),
  ],
  // Namen sind zu kurz und zu allgemein („Canon“ steckt in „canonical“), deshalb die Zeile darunter.
  "vorlagen/top-100-halal-aktien": werte("src/data/top100Aktien.ts", "bekanntFuer").filter(
    (w) => w.length > 8 && !werte("src/data/top100Ausschnitt.ts", "bekanntFuer").includes(w),
  ),
};

const html = (seite) => [join(DIST, `${seite}.html`), join(DIST, seite, "index.html")].find(existsSync);

/** Alle JS-Dateien, die die Seite lädt, samt deren statischen Importen. */
const geladen = (h) => {
  const offen = [...lies(h).matchAll(/(?:modulepreload[^>]*href|<script[^>]*src)="\/(assets\/[^"]+\.js)"/g)].map((m) => join(DIST, m[1]));
  const gesehen = new Set();
  while (offen.length) {
    const d = offen.pop();
    if (gesehen.has(d) || !existsSync(d)) continue;
    gesehen.add(d);
    for (const m of lies(d).matchAll(/(?:from|import)\s*["'](\.\/[^"']+\.js)["']/g)) offen.push(resolve(dirname(d), m[1]));
  }
  return [...gesehen];
};

let fehler = 0;
for (const [seite, liste] of Object.entries(merkmale)) {
  const h = html(seite);
  if (!h) {
    console.log(`FEHL ${seite}: keine vorgerenderte Datei`);
    fehler++;
    continue;
  }
  if (!liste.length) {
    console.log(`FEHL ${seite}: keine Merkmale gefunden, Prüfung wäre leer`);
    fehler++;
    continue;
  }
  const dateien = [h, ...geladen(h)];
  const funde = [];
  for (const d of dateien) {
    const text = lies(d);
    for (const m of liste) if (text.includes(m) || text.includes(JSON.stringify(m).slice(1, -1))) funde.push(`${d.replace(DIST + "/", "")}: ${m.slice(0, 50)}`);
  }
  if (funde.length) {
    fehler++;
    console.log(`FEHL ${seite}: ${funde.length} gesperrte Stellen\n  ${funde.slice(0, 5).join("\n  ")}`);
  } else console.log(`ok   ${seite}: ${liste.length} Merkmale, ${dateien.length} Dateien sauber`);
}
if (fehler) {
  console.log(`\n${fehler} Seite(n) mit Problem`);
  process.exit(1);
}
console.log("\nSCHRANKE HÄLT");
