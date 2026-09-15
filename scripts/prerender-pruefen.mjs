/**
 * Prüft den dist-Ordner ohne JavaScript auszuführen.
 *
 * Gefragt wird genau das, was ein Crawler beim ersten Abruf sieht: eigener
 * Title, eigene Description, richtiges Canonical, sichtbarer Hauptinhalt mit
 * einer H1, gültiges JSON-LD. Zusätzlich wird geprüft, dass Title und
 * Canonical sich zwischen den Seiten unterscheiden, denn 64 gleiche Titel
 * wären schlimmer als gar keine.
 *
 * Aufruf: node scripts/prerender-pruefen.mjs
 */
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const WURZEL = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(WURZEL, "dist");
const SITE = "https://finanzmuslim.com";

const eins = (html, re) => {
  const m = re.exec(html);
  return m ? m[1].trim() : null;
};

const attr = (html, tagRe, attrName) => {
  const m = tagRe.exec(html);
  if (!m) return null;
  const a = new RegExp(`${attrName}="([^"]*)"`).exec(m[0]);
  return a ? a[1] : null;
};

/** Sichtbarer Text: Skripte, Stile und Auszeichnung raus. */
const sichtbarerText = (html) => {
  const koerper = /<body[^>]*>([\s\S]*)<\/body>/i.exec(html)?.[1] ?? "";
  return koerper
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const pruefeSeite = (pfad, html) => {
  const maengel = [];
  const erwartetesCanonical = `${SITE}${pfad === "/" ? "/" : pfad}`;

  const title = eins(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
  if (!title) maengel.push("kein Title");
  else if (title.length < 15) maengel.push(`Title zu kurz: "${title}"`);

  const desc = attr(html, /<meta[^>]*name="description"[^>]*>/i, "content");
  if (!desc) maengel.push("keine Description");
  else if (desc.length < 50) maengel.push(`Description zu kurz (${desc.length})`);

  const canonical = attr(html, /<link[^>]*rel="canonical"[^>]*>/i, "href");
  if (!canonical) maengel.push("kein Canonical");
  else if (canonical !== erwartetesCanonical)
    maengel.push(`Canonical falsch: ${canonical} statt ${erwartetesCanonical}`);

  const robots = attr(html, /<meta[^>]*name="robots"[^>]*>/i, "content");
  if (robots && /noindex/.test(robots)) maengel.push(`noindex gesetzt: ${robots}`);

  const h1 = eins(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const h1Text = h1 ? h1.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() : null;
  if (!h1Text) maengel.push("keine H1");

  const text = sichtbarerText(html);
  if (text.length < 600) maengel.push(`zu wenig sichtbarer Text (${text.length} Zeichen)`);

  const ldBloecke = [...html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)];
  let ldTypen = [];
  if (ldBloecke.length === 0) {
    maengel.push("kein JSON-LD");
  } else {
    for (const b of ldBloecke) {
      try {
        const daten = JSON.parse(b[1]);
        const liste = Array.isArray(daten) ? daten : [daten];
        for (const d of liste) {
          if (!d["@context"]) maengel.push("JSON-LD ohne @context");
          if (!d["@type"]) maengel.push("JSON-LD ohne @type");
          ldTypen.push(d["@type"]);
        }
      } catch (e) {
        maengel.push(`JSON-LD nicht lesbar: ${e.message}`);
      }
    }
  }

  const ogTitle = attr(html, /<meta[^>]*property="og:title"[^>]*>/i, "content");
  if (!ogTitle) maengel.push("kein og:title");

  return { pfad, title, desc, canonical, h1: h1Text, zeichen: text.length, ldTypen, maengel };
};

const main = async () => {
  const xml = await readFile(join(WURZEL, "public/sitemap.xml"), "utf8");
  const pfade = [...new Set(
    [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map(
      (m) => new URL(m[1]).pathname.replace(/\/+$/, "") || "/",
    ),
  )].sort();

  const ergebnisse = [];
  const fehlend = [];

  for (const pfad of pfade) {
    const datei = pfad === "/" ? join(DIST, "index.html") : join(DIST, `${pfad}.html`);
    if (!existsSync(datei)) {
      fehlend.push(pfad);
      continue;
    }
    ergebnisse.push(pruefeSeite(pfad, await readFile(datei, "utf8")));
  }

  // Eindeutigkeit
  const zaehle = (feld) => {
    const karte = new Map();
    ergebnisse.forEach((e) => karte.set(e[feld], (karte.get(e[feld]) ?? 0) + 1));
    return [...karte.entries()].filter(([, n]) => n > 1);
  };
  const doppelteTitel = zaehle("title");
  const doppelteCanonicals = zaehle("canonical");

  const kaputt = ergebnisse.filter((e) => e.maengel.length > 0);

  console.log(`Geprüft: ${ergebnisse.length} Seiten aus der Sitemap`);
  if (fehlend.length) {
    console.log(`\nFEHLENDE DATEIEN (${fehlend.length}):`);
    fehlend.forEach((p) => console.log(`  ${p}`));
  }
  if (kaputt.length) {
    console.log(`\nMÄNGEL (${kaputt.length} Seiten):`);
    kaputt.forEach((e) => console.log(`  ${e.pfad}\n    - ${e.maengel.join("\n    - ")}`));
  }
  if (doppelteTitel.length) {
    console.log(`\nDOPPELTE TITEL (${doppelteTitel.length}):`);
    doppelteTitel.forEach(([t, n]) => console.log(`  ${n}x "${t}"`));
  }
  if (doppelteCanonicals.length) {
    console.log(`\nDOPPELTE CANONICALS (${doppelteCanonicals.length}):`);
    doppelteCanonicals.forEach(([c, n]) => console.log(`  ${n}x ${c}`));
  }

  // 404
  console.log("\n404-Seite:");
  const p404 = join(DIST, "404.html");
  if (!existsSync(p404)) {
    console.log("  FEHLT");
  } else {
    const html = await readFile(p404, "utf8");
    const robots = attr(html, /<meta[^>]*name="robots"[^>]*>/i, "content");
    const canonical = attr(html, /<link[^>]*rel="canonical"[^>]*>/i, "href");
    const text = sichtbarerText(html);
    console.log(`  robots: ${robots ?? "fehlt"}`);
    console.log(`  canonical: ${canonical ?? "keins, richtig so"}`);
    console.log(`  Text enthält Fehlerhinweis: ${/gibt es nicht|404/i.test(text) ? "ja" : "NEIN"}`);
  }

  const alleOk = !fehlend.length && !kaputt.length && !doppelteTitel.length && !doppelteCanonicals.length;
  console.log(`\n${alleOk ? "ALLES SAUBER" : "NACHARBEIT NÖTIG"}`);
  if (!alleOk) process.exit(1);
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
