/**
 * Prueft, ob wirklich jede Anlage aus halalAnlagen ihre Kursdaten hat.
 *
 * Warum eigens dafuer ein Skript: kurse.json wird von einem Skript erzeugt,
 * das ueber eine eigene ISIN-Liste laeuft. Die Website liest aber halalAnlagen.
 * Laufen die beiden Listen auseinander, faellt das niemandem auf: die
 * Anlagenseite zeigt dann einfach keinen Kurs mehr, ohne Fehler, ohne Warnung.
 * Genau so ist am 17.08. der iShares MSCI USA Islamic still verschwunden.
 *
 * Geprueft wird von der Seite der Website aus, also so, wie ein Besucher es
 * sieht: fuer jede der 27 Anlagen wird gefragt, ob ein Kurs und eine
 * Jahresrendite ankommt.
 *
 * Exitcode 1, sobald eine Anlage gar keinen Eintrag hat oder mehr als
 * ERLAUBT_OHNE_KURS Anlagen ohne Kurs dastehen.
 *
 * Aufruf: node scripts/kurse-abdeckung.mjs
 */
import { readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";
import { mkdtemp, unlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import { pathToFileURL } from "node:url";

const WURZEL = join(dirname(fileURLToPath(import.meta.url)), "..");

/* Yahoo drosselt gelegentlich. Ein einzelner Ausfall darf den Nachtlauf nicht
   scheitern lassen, sonst bleibt die ganze Datei alt. Mehr als zwei heisst,
   dass etwas grundsaetzlich kaputt ist. */
const ERLAUBT_OHNE_KURS = 2;

/**
 * Eine Anlage ohne Jahresrendite ist nur dann in Ordnung, wenn es sie noch
 * keine zwoelf Monate gibt. Das wird aus dem Auflagedatum in halalAnlagen
 * gerechnet, nicht aus einer gepflegten Liste. Eine Liste haette denselben
 * Fehler wie die alte Sitemap: sie ist ab dem Tag falsch, an dem einer der
 * Fonds alt genug wird, und niemand merkt es.
 *
 * Laesst sich das Datum nicht lesen, gilt die Anlage als alt genug. Lieber
 * einmal zu viel gemeldet als eine stille Luecke.
 */
const jungerAlsEinJahr = (auflage) => {
  const m = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(auflage ?? "");
  if (!m) return false;
  const [, tag, monat, jahr] = m;
  const start = new Date(Number(jahr), Number(monat) - 1, Number(tag));
  const einJahrHer = new Date();
  einJahrHer.setFullYear(einJahrHer.getFullYear() - 1);
  return start > einJahrHer;
};

const anlagenLaden = async () => {
  const ordner = await mkdtemp(join(tmpdir(), "finanzmuslim-anlagen-"));
  const ziel = join(ordner, "anlagen.mjs");
  await build({
    entryPoints: [join(WURZEL, "src/data/halalAnlagen.ts")],
    bundle: true,
    format: "esm",
    platform: "node",
    outfile: ziel,
    logLevel: "silent",
    alias: { "@": join(WURZEL, "src") },
    loader: { ".json": "json" },
  });
  const modul = await import(pathToFileURL(ziel).href);
  await unlink(ziel).catch(() => {});
  return modul.halalAnlagen;
};

const main = async () => {
  const anlagen = await anlagenLaden();
  const kurse = JSON.parse(await readFile(join(WURZEL, "src/data/kurse.json"), "utf8"));

  const zeilen = [];
  const ohneEintrag = [];
  const ohneKurs = [];
  const ohneJahr = [];
  const zuJung = [];

  for (const a of anlagen) {
    const k = a.kursKey ? kurse.krypto?.[a.kursKey] : a.isin ? kurse.anlagen?.[a.isin] : undefined;
    const schluessel = a.kursKey ?? a.isin ?? "-";

    if (!k) {
      ohneEintrag.push(`${a.name} (${schluessel})`);
      zeilen.push([a.name, schluessel, "KEIN EINTRAG", "-", "-"]);
      continue;
    }
    const hatKurs = k.kurs != null && !k.status;
    const tage = Array.isArray(k.reihe_t) ? k.reihe_t.length : 0;
    if (!hatKurs) ohneKurs.push(`${a.name} (${schluessel})`);
    const jung = jungerAlsEinJahr(a.auflage);
    if (jung) zuJung.push(`${a.name}, aufgelegt ${a.auflage}`);
    if (hatKurs && k.r1j == null && !jung) {
      ohneJahr.push(`${a.name} (${schluessel}), aufgelegt ${a.auflage ?? "Datum unbekannt"}`);
    }
    zeilen.push([
      a.name,
      schluessel,
      hatKurs ? String(k.kurs) : (k.status ?? "kein Kurs"),
      k.r1j == null ? "-" : `${k.r1j} %`,
      String(tage),
    ]);
  }

  const breite = [46, 15, 12, 10, 6];
  const zeile = (z) => z.map((w, i) => String(w).slice(0, breite[i]).padEnd(breite[i])).join(" ");
  console.log(`Kursdaten vom ${kurse.stand}, Quelle: ${kurse.quelle}\n`);
  console.log(zeile(["Anlage", "Schluessel", "Kurs", "1 Jahr", "Tage"]));
  console.log("-".repeat(breite.reduce((a, b) => a + b + 1, 0)));
  zeilen.forEach((z) => console.log(zeile(z)));

  const mitKurs = anlagen.length - ohneEintrag.length - ohneKurs.length;
  console.log(`\n${mitKurs} von ${anlagen.length} Anlagen mit Kurs.`);

  if (ohneJahr.length) {
    console.log(`\nOhne Jahresrendite, obwohl alt genug: ${ohneJahr.join(", ")}`);
  }
  if (zuJung.length) {
    console.log(`\nJuenger als ein Jahr, deshalb ohne Jahresrendite richtig:`);
    zuJung.forEach((n) => console.log(`  ${n}`));
  }

  let fehler = false;
  if (ohneEintrag.length) {
    console.log(`\nFEHLER: ${ohneEintrag.length} Anlagen ohne jeden Eintrag in kurse.json:`);
    ohneEintrag.forEach((n) => console.log(`  ${n}`));
    console.log("  Meist fehlt die ISIN in der Liste ANLAGEN in scripts/kurse_holen.py.");
    fehler = true;
  }
  if (ohneKurs.length > ERLAUBT_OHNE_KURS) {
    console.log(`\nFEHLER: ${ohneKurs.length} Anlagen ohne Kurs, erlaubt sind ${ERLAUBT_OHNE_KURS}:`);
    ohneKurs.forEach((n) => console.log(`  ${n}`));
    fehler = true;
  } else if (ohneKurs.length) {
    console.log(`\nHinweis: ohne Kurs, noch im Rahmen: ${ohneKurs.join(", ")}`);
  }
  if (ohneJahr.length) fehler = true;

  console.log(fehler ? "\nABDECKUNG UNVOLLSTAENDIG" : "\nABDECKUNG VOLLSTAENDIG");
  if (fehler) process.exit(1);
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
