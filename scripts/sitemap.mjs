/**
 * Erzeugt public/sitemap.xml beim Build.
 *
 * Grundlage sind dieselben Daten, aus denen die Seite selbst entsteht:
 * src/data/routen.ts für die festen Adressen, src/data/halalAnlagen.ts für die
 * Anlagenseiten. Es gibt keine zweite Liste mehr, die jemand nachpflegen muss.
 *
 * Zum lastmod: Es steht das Datum der letzten Änderung an den Dateien, aus
 * denen die Seite ihren Inhalt zieht, ermittelt über git. Nicht das Datum des
 * Builds. Zwei Builds hintereinander erzeugen deshalb dieselbe Datei, und eine
 * Seite gilt nur dann als geändert, wenn sich wirklich Inhalt geändert hat.
 * Liegt kein git vor, bleibt lastmod weg. Ein geratenes Datum wäre schlechter
 * als keins: Google vergleicht es mit dem, was es beim Abruf sieht, und
 * ignoriert das Feld dauerhaft, wenn es nicht stimmt.
 *
 * Aufruf: node scripts/sitemap.mjs
 */
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { routenLaden } from "./routen-laden.mjs";

const ausfuehren = promisify(execFile);
const WURZEL = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://finanzmuslim.com";

/** Letzte Änderung einer Datei nach git, als Datum ohne Uhrzeit. */
const letzteAenderung = async (datei) => {
  if (!existsSync(join(WURZEL, datei))) return null;
  try {
    const { stdout } = await ausfuehren(
      "git",
      ["log", "-1", "--format=%cs", "--", datei],
      { cwd: WURZEL },
    );
    return stdout.trim() || null;
  } catch {
    return null;
  }
};

/** Jüngstes Datum aus mehreren Dateien. Fehlt für alle eins, gibt es keins. */
const lastmodFuer = async (quellen) => {
  const daten = (await Promise.all(quellen.map(letzteAenderung))).filter(Boolean);
  return daten.length ? daten.sort().at(-1) : null;
};

const xmlEscape = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Warnt, wenn im Router eine Adresse steht, die weder aufgenommen noch
 *  ausdrücklich ausgeschlossen ist. So faellt eine neue Seite auf, statt
 *  jahrelang unbemerkt aus der Sitemap zu fehlen. */
const abgleichMitRouter = async (pfade, draussen) => {
  const app = await readFile(join(WURZEL, "src/App.tsx"), "utf8");
  const imRouter = [...app.matchAll(/<Route\s+path="([^"]+)"/g)].map((m) => m[1]);
  const bekannt = new Set([...pfade, ...draussen.map((d) => d.pfad)]);

  const unbekannt = imRouter.filter((p) => {
    if (bekannt.has(p)) return false;
    // Dynamische Segmente: /halal-anlagen/:slug deckt alle Anlagenseiten ab.
    if (p.includes(":")) {
      const anfang = p.slice(0, p.indexOf(":"));
      return !pfade.some((x) => x.startsWith(anfang));
    }
    return true;
  });

  const verwaist = pfade.filter((p) => {
    if (imRouter.includes(p)) return true;
    return imRouter.some(
      (r) => r.includes(":") && p.startsWith(r.slice(0, r.indexOf(":"))),
    );
  });

  return { unbekannt, fehlendImRouter: pfade.filter((p) => !verwaist.includes(p)) };
};

const main = async () => {
  const { alleRouten, bewusstDraussen } = await routenLaden();
  const routen = alleRouten();

  // Doppelte Adressen wären ein stiller Fehler, deshalb hart abbrechen.
  const doppelt = routen
    .map((r) => r.pfad)
    .filter((p, i, alle) => alle.indexOf(p) !== i);
  if (doppelt.length) {
    throw new Error(`Doppelte Adressen in routen.ts: ${[...new Set(doppelt)].join(", ")}`);
  }

  const eintraege = [];
  for (const r of routen) {
    const lastmod = await lastmodFuer(r.quelle);
    const url = `${SITE}${r.pfad === "/" ? "/" : r.pfad}`;
    eintraege.push(
      [
        "  <url>",
        `    <loc>${xmlEscape(url)}</loc>`,
        ...(lastmod ? [`    <lastmod>${lastmod}</lastmod>`] : []),
        `    <changefreq>${r.changefreq}</changefreq>`,
        `    <priority>${r.prioritaet}</priority>`,
        "  </url>",
      ].join("\n"),
    );
  }

  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    eintraege.join("\n") +
    "\n</urlset>\n";

  await writeFile(join(WURZEL, "public/sitemap.xml"), xml, "utf8");

  const { unbekannt, fehlendImRouter } = await abgleichMitRouter(
    routen.map((r) => r.pfad),
    bewusstDraussen,
  );

  const ohneDatum = routen.length - eintraege.filter((e) => e.includes("<lastmod>")).length;
  console.log(`sitemap.xml geschrieben: ${routen.length} Adressen, ${ohneDatum} davon ohne lastmod`);

  if (unbekannt.length) {
    console.log("\nWARNUNG, im Router aber nicht in der Sitemap und nicht ausgeschlossen:");
    unbekannt.forEach((p) => console.log(`  ${p}`));
    console.log("  Entweder in routen.ts aufnehmen oder in bewusstDraussen eintragen.");
    process.exitCode = 1;
  }
  if (fehlendImRouter.length) {
    console.log("\nWARNUNG, in der Sitemap aber ohne Route in App.tsx:");
    fehlendImRouter.forEach((p) => console.log(`  ${p}`));
    process.exitCode = 1;
  }
  if (!unbekannt.length && !fehlendImRouter.length) {
    console.log("Abgleich mit App.tsx: keine Abweichung");
  }
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
