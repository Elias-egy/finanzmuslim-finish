/**
 * Technischer SEO-Durchgang über den fertigen dist-Ordner (RN19).
 *
 * Ergänzt scripts/prerender-pruefen.mjs um das, was dort fehlt:
 *  - jede interne Verlinkung zeigt auf eine echte, indexierbare Seite (keine 404, keine Weiterleitung,
 *    kein noindex, keine /wissen/-Adresse)
 *  - Title unter 60 Zeichen, Meta-Beschreibung 120 bis 160, genau eine H1
 *  - canonical selbstbezogen auf https://finanzmuslim.com
 *  - noindex nur auf den Seiten, die routen.ts dafür vorsieht
 *  - Sitemap enthält jede indexierbare Seite und keine noindex- oder Weiterleitungsseite
 *  - robots.txt und llms.txt: Adressen existieren und sind indexierbar
 *  - JSON-LD: gültig, FAQPage mit Fragen, Article-Headline gleich H1
 *  - Blog-Ketten: Beitrag oben auf den Vergleich, unten auf verwandte Beiträge, Übersicht und Datenbank
 *
 * Aufruf: node scripts/seo-durchgang.mjs [--ketten] [--nur=<Pfadteil>]
 * Läuft ohne neue Pakete (esbuild liegt über routen-laden.mjs schon im Projekt).
 */
import { readFile, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { routenLaden } from "./routen-laden.mjs";

const WURZEL = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(WURZEL, "dist");
const SITE = "https://finanzmuslim.com";
const argv = process.argv.slice(2);
const NUR = argv.find((a) => a.startsWith("--nur="))?.slice(6);

const norm = (p) => (p === "/" ? "/" : p.replace(/\/+$/, ""));
const attr = (tag, name) => new RegExp(`${name}="([^"]*)"`, "i").exec(tag)?.[1] ?? null;
const text = (h) => h.replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
const entities = (s) => s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");

const alleHtml = async (ordner, basis = "") => {
  const aus = [];
  for (const e of await readdir(ordner, { withFileTypes: true })) {
    if (e.isDirectory()) {
      if (["assets", "og", "investment-os", "bilder", "downloads", "guides", "logos", "fonts"].includes(e.name) && !basis) continue;
      aus.push(...(await alleHtml(join(ordner, e.name), `${basis}/${e.name}`)));
    } else if (e.name.endsWith(".html")) aus.push(`${basis}/${e.name}`);
  }
  return aus;
};

const dateiZuPfad = (rel) => {
  let p = rel.replace(/\.html$/, "");
  if (p.endsWith("/index")) p = p.slice(0, -6) || "/";
  return p === "" ? "/" : p;
};

const main = async () => {
  const { alleRouten, nichtIndexiert, weiterleitungen } = await routenLaden();
  const indexierbar = new Set(alleRouten().map((r) => r.pfad));
  const weiterl = new Map(weiterleitungen.map((w) => [w.von, w.nach]));
  const draussen = new Set(nichtIndexiert);
  const fehler = [];
  const hinweis = [];
  const f = (pfad, msg) => fehler.push(`${pfad}: ${msg}`);

  // Sitemap
  const xml = await readFile(join(DIST, "sitemap.xml"), "utf8");
  const sitemap = new Set([...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => norm(new URL(m[1]).pathname)));
  for (const p of indexierbar) if (!sitemap.has(p) && !draussen.has(p)) hinweis.push(`Sitemap: ${p} fehlt (indexierbar laut routen.ts; der Prerender kann sie bei Selbst-noindex entfernt haben)`);
  for (const p of sitemap) {
    if (weiterl.has(p)) f("sitemap.xml", `${p} ist eine Weiterleitung`);
    if (draussen.has(p)) f("sitemap.xml", `${p} ist nichtIndexiert`);
    if (!indexierbar.has(p)) f("sitemap.xml", `${p} steht nicht in routen.ts`);
  }

  // Seiten laden
  const dateien = await alleHtml(DIST);
  const seiten = new Map(); // pfad -> {html, rel}
  for (const rel of dateien) {
    const pfad = dateiZuPfad(rel);
    const html = await readFile(join(DIST, rel), "utf8");
    seiten.set(pfad, { html, rel });
  }
  const istStub = (html) => /<title>Weiterleitung<\/title>/.test(html);
  const stubs = new Set([...seiten].filter(([, s]) => istStub(s.html)).map(([p]) => p));

  // Ist ein Ziel eine ausgelieferte, indexierbare Seite?
  const robotsVon = (html) => {
    const m = /<meta[^>]*name="robots"[^>]*>/i.exec(html);
    return m ? attr(m[0], "content") : null;
  };
  const zielStatus = (pfad) => {
    if (weiterl.has(pfad)) return "weiterleitung";
    if (stubs.has(pfad)) return "weiterleitung";
    if (pfad.startsWith("/wissen")) return "wissen";
    const s = seiten.get(pfad);
    if (s) return /noindex/.test(robotsVon(s.html) ?? "") ? "noindex" : "ok";
    if (existsSync(join(DIST, pfad))) return "datei";
    if (/\.(pdf|png|jpe?g|webp|svg|xml|txt|ico)$/.test(pfad) && existsSync(join(DIST, pfad))) return "datei";
    // dynamische Routen ohne eigene Datei
    return "404";
  };

  const linkMap = new Map(); // quelle -> Set(ziele)
  const inhaltMap = new Map(); // quelle -> Set(ziele im <main>)
  const titelSet = new Map();
  let geprueft = 0;

  for (const [pfad, { html }] of seiten) {
    if (NUR && !pfad.includes(NUR)) continue;
    if (stubs.has(pfad) || pfad === "/404") continue;
    const robots = robotsVon(html) ?? "";
    const istNoindex = /noindex/.test(robots);
    const soll = indexierbar.has(pfad);
    const sollDraussen = draussen.has(pfad) || pfad.startsWith("/dein-investmentstart") || pfad.startsWith("/gratis/") || pfad.startsWith("/danke/");
    if (soll && istNoindex) f(pfad, `noindex, obwohl indexierbar laut routen.ts (${robots})`);
    if (!soll && !istNoindex && !sollDraussen) f(pfad, `ausgeliefert ohne noindex, steht aber nicht in routen.ts`);
    if (!soll) continue; // Rest nur für indexierbare Seiten
    geprueft++;

    const title = entities(/<title[^>]*>([\s\S]*?)<\/title>/i.exec(html)?.[1].trim() ?? "");
    const descTag = /<meta[^>]*name="description"[^>]*>/i.exec(html)?.[0];
    const desc = entities(descTag ? attr(descTag, "content") ?? "" : "");
    if (!title) f(pfad, "kein Title");
    else {
      if (title.length >= 60) f(pfad, `Title ${title.length} Zeichen (soll unter 60): "${title}"`);
      titelSet.set(title, [...(titelSet.get(title) ?? []), pfad]);
    }
    if (!desc) f(pfad, "keine Meta-Beschreibung");
    else if (desc.length < 120 || desc.length > 160) f(pfad, `Meta ${desc.length} Zeichen (soll 120 bis 160): "${desc}"`);

    const h1s = [...html.matchAll(/<h1[\s>][\s\S]*?<\/h1>/gi)];
    if (h1s.length !== 1) f(pfad, `${h1s.length} H1 (soll genau 1)`);

    const canTag = /<link[^>]*rel="canonical"[^>]*>/i.exec(html)?.[0];
    const can = canTag ? attr(canTag, "href") : null;
    const erwartet = `${SITE}${pfad === "/" ? "/" : pfad}`;
    if (!can) f(pfad, "kein canonical");
    else if (can !== erwartet) f(pfad, `canonical ${can}, erwartet ${erwartet}`);

    // JSON-LD
    const ld = [...html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)];
    if (!ld.length) f(pfad, "kein JSON-LD");
    const h1Text = h1s[0] ? text(h1s[0][0]) : "";
    for (const b of ld) {
      let d;
      try { d = JSON.parse(b[1]); } catch (e) { f(pfad, `JSON-LD nicht lesbar: ${e.message}`); continue; }
      for (const o of Array.isArray(d) ? d : [d]) {
        const knoten = Array.isArray(o["@graph"]) ? o["@graph"] : [o];
        for (const k of knoten) {
          const t = [].concat(k["@type"] ?? []);
          if (!t.length) f(pfad, "JSON-LD-Knoten ohne @type");
          if (t.includes("FAQPage")) {
            const q = k.mainEntity;
            if (!Array.isArray(q) || !q.length) f(pfad, "FAQPage ohne mainEntity");
            else for (const fr of q) if (!fr.name || !fr.acceptedAnswer?.text) f(pfad, "FAQPage: Frage ohne Antwort");
          }
          if (t.includes("Article") || t.includes("BlogPosting")) {
            if (k.headline && h1Text && k.headline !== h1Text) hinweis.push(`${pfad}: Article-headline "${k.headline}" weicht von H1 "${h1Text}" ab`);
          }
          for (const key of ["url", "@id", "mainEntityOfPage"]) {
            const v = typeof k[key] === "string" ? k[key] : k[key]?.["@id"];
            if (typeof v === "string" && v.startsWith("http://")) f(pfad, `JSON-LD ${key} mit http:// ${v}`);
          }
        }
      }
    }

    // Halal-Datenbank: jede Detailseite trägt die Frage „Ist <Name> halal?“ in Title, H1 und Meta und hat ein FAQPage
    if (pfad.startsWith("/halal-anlagen/")) {
      // Bitcoin: eigener Beitrag trägt die Frage. BNP Islamic Fund: Nachweis nur von 2020, Frage bewusst nicht gestellt (RN19). Siehe anlageSeo.ts.
      const bitcoin = pfad === "/halal-anlagen/bitcoin" || pfad === "/halal-anlagen/bnp-paribas-islamic-fund-hilal-income-classic-c";
      if (!bitcoin) {
        if (!/^Ist .+ halal\?$/.test(h1Text)) f(pfad, `H1 ist nicht „Ist <Name> halal?“: "${h1Text}"`);
        if (!title.startsWith(h1Text.replace(/ halal\?$/, "").slice(0, 20))) f(pfad, `Title beginnt nicht wie die H1: "${title}"`);
        if (!/halal\?/.test(title)) f(pfad, `Title ohne „halal?“: "${title}"`);
        if (!/^Ist .+ halal\?/.test(desc)) f(pfad, `Meta beginnt nicht mit der Frage: "${desc}"`);
      }
      if (!/"FAQPage"/.test(html)) f(pfad, "kein FAQPage-Schema");
    }

    // Interne Links (nur im Hauptinhalt und Kopf/Fuß zusammen)
    const ziele = new Set();
    const imInhalt = new Set();
    const mainHtml = /<main[\s\S]*?<\/main>/i.exec(html)?.[0] ?? "";
    const normLink = (hrefRoh) => {
      let href = entities(hrefRoh);
      if (/^(mailto:|tel:|#|javascript:)/.test(href)) return null;
      if (/^https?:\/\//.test(href)) {
        if (!href.startsWith(SITE)) return null;
        href = href.slice(SITE.length) || "/";
      }
      if (!href.startsWith("/")) return null;
      return norm(href.split("#")[0].split("?")[0]);
    };
    for (const m of mainHtml.matchAll(/<a\s[^>]*href="([^"]+)"[^>]*>/gi)) {
      const r = normLink(m[1]);
      if (r) imInhalt.add(r);
    }
    inhaltMap.set(pfad, imInhalt);
    for (const m of html.matchAll(/<a\s[^>]*href="([^"]+)"[^>]*>/gi)) {
      let href = entities(m[1]);
      if (/^(mailto:|tel:|#|javascript:)/.test(href)) continue;
      if (/^https?:\/\//.test(href)) {
        if (!href.startsWith(SITE)) continue;
        href = href.slice(SITE.length) || "/";
      }
      if (!href.startsWith("/")) continue;
      const rein = norm(href.split("#")[0].split("?")[0]);
      if (rein.startsWith("/out/") || rein.startsWith("/weiter/")) {
        // Partnerlinks sind bewusst Weiterleitungen, müssen aber als echte Datei ausgeliefert werden (RN20, Prüfbericht RN19
        // Punkt 2). Ein direkter Aufruf ohne Datei gäbe 404. /out/<name> leitet auf eine interne Startseite, auch die muss da sein.
        const datei = join(DIST, `${rein}.html`);
        if (!existsSync(datei)) f(pfad, `Partnerweg ${rein} ohne ausgelieferte Datei`);
        else if (rein.startsWith("/out/")) {
          const nach = /http-equiv="refresh" content="0; url=([^"]+)"/.exec(await readFile(datei, "utf8"))?.[1];
          const intern = nach && nach.startsWith("/") ? norm(nach.split("?")[0]) : null;
          if (intern && !existsSync(join(DIST, `${intern}.html`)) && !existsSync(join(DIST, intern, "index.html")))
            f(pfad, `Partnerweg ${rein} leitet auf ${intern}, dort liegt keine Datei`);
        }
        continue;
      }
      ziele.add(rein);
    }
    linkMap.set(pfad, ziele);
    for (const z of ziele) {
      if (z === pfad) continue;
      const st = zielStatus(z);
      if (st === "weiterleitung") f(pfad, `Link auf Weiterleitung ${z} -> ${weiterl.get(z) ?? "?"}`);
      else if (st === "wissen") f(pfad, `Link auf alte Adresse ${z}`);
      else if (st === "noindex" && z !== "/check" && z !== "/vorlagen/halal-anlagen") hinweis.push(`${pfad}: Link auf noindex-Seite ${z}`);
      else if (st === "404") f(pfad, `Link auf nicht ausgelieferte Seite ${z}`);
    }
  }

  for (const [t, ps] of titelSet) if (ps.length > 1) f(ps.join(", "), `gleicher Title "${t}"`);

  // robots.txt
  const robots = await readFile(join(DIST, "robots.txt"), "utf8");
  if (!/Sitemap:\s*https:\/\/finanzmuslim\.com\/sitemap\.xml/.test(robots)) f("robots.txt", "Sitemap-Zeile fehlt");
  for (const m of robots.matchAll(/^Disallow:\s*(\S+)/gim)) {
    const d = m[1];
    for (const p of sitemap) if (p.startsWith(d) && d !== "/") f("robots.txt", `Disallow ${d} sperrt Sitemap-Seite ${p}`);
  }
  if (/^Disallow:\s*\/\s*$/im.test(robots)) f("robots.txt", "Disallow: / sperrt alles");

  // llms.txt
  const llms = await readFile(join(DIST, "llms.txt"), "utf8");
  for (const m of llms.matchAll(/\]\((\/[^)\s]*)\)/g)) {
    const z = norm(m[1].split("#")[0].split("?")[0]);
    const st = z.startsWith("/investment-os") ? (existsSync(join(DIST, z)) ? "ok" : "404") : zielStatus(z);
    if (st !== "ok" && st !== "datei") f("llms.txt", `Link ${m[1]}: ${st}`);
  }
  const zaehlt = llms.match(/Datenbank: (\d+) Anlagen/);
  const anlagenSeiten = [...sitemap].filter((p) => p.startsWith("/halal-anlagen/")).length;
  if (zaehlt && Number(zaehlt[1]) !== anlagenSeiten) f("llms.txt", `nennt ${zaehlt[1]} Anlagen, die Datenbank hat ${anlagenSeiten}`);
  for (const p of sitemap) {
    if (p.startsWith("/halal-anlagen/") || p.startsWith("/blog/") || p.startsWith("/vorlagen/")) continue;
    if (!llms.includes(`(${p})`) && !llms.includes(`(${p}/)`)) hinweis.push(`llms.txt: ${p} nicht aufgeführt`);
  }
  for (const p of sitemap) if (p.startsWith("/blog/") && !llms.includes(`(${p})`)) hinweis.push(`llms.txt: Beitrag ${p} nicht aufgeführt`);

  // Ketten
  if (argv.includes("--ketten")) {
    const blogs = [...sitemap].filter((p) => p.startsWith("/blog/"));
    const uebersicht = inhaltMap.get("/blog") ?? new Set();
    for (const b of blogs) {
      if (!uebersicht.has(b)) f("/blog", `Übersicht verlinkt ${b} nicht`);
      const ziele = inhaltMap.get(b) ?? new Set();
      const andere = [...ziele].filter((z) => z.startsWith("/blog/") && z !== b);
      if (andere.length < 2) f(b, `verlinkt nur ${andere.length} andere Beiträge (verwandte Beiträge unten)`);
      if (![...ziele].some((z) => z.startsWith("/vergleich/"))) f(b, "kein Link auf einen Vergleich");
    }
    // Vergleiche zurück auf die tragenden Beiträge, Datenbank aus den Beiträgen
    for (const v of [...sitemap].filter((p) => p.startsWith("/vergleich/") && !p.includes("steuersoftware"))) {
      if (![...(inhaltMap.get(v) ?? [])].some((z) => z.startsWith("/blog/"))) f(v, "verlinkt keinen Blogbeitrag zurück");
    }
    for (const s of ["sind-aktien-haram", "halal-etf", "sukuk", "halal-gold-kaufen", "zakat-auf-aktien-etf-krypto"]) {
      if (!(inhaltMap.get(`/blog/${s}`) ?? new Set()).has("/halal-anlagen")) f(`/blog/${s}`, "verlinkt die Halal-Datenbank /halal-anlagen nicht");
    }
    for (const a of [...sitemap].filter((p) => p.startsWith("/halal-anlagen/"))) {
      const ziele = inhaltMap.get(a) ?? new Set();
      if (![...ziele].some((z) => z.startsWith("/vergleich/"))) f(a, "kein Link auf einen Vergleich");
      if (![...ziele].some((z) => z.startsWith("/blog/"))) f(a, "kein Link auf einen Blogbeitrag");
      if ([...ziele].filter((z) => z.startsWith("/halal-anlagen/")).length < 3) f(a, "weniger als drei Links auf verwandte Anlagen");
      if (!ziele.has("/") && !ziele.has("/halal-anlagen")) f(a, "kein Link auf Start oder Übersicht");
    }
    const eingehend = new Map();
    for (const [q, zs] of linkMap) for (const z of zs) if (z !== q) eingehend.set(z, (eingehend.get(z) ?? 0) + 1);
    for (const p of sitemap) if (!eingehend.get(p)) f(p, "keine einzige interne Verlinkung auf diese Seite (verwaist)");
    else if (eingehend.get(p) < 3 && p.startsWith("/halal-anlagen/")) hinweis.push(`${p}: nur ${eingehend.get(p)} interne Links hinein`);
  }

  console.log(`Geprüft: ${geprueft} indexierbare Seiten, ${seiten.size} Dateien, ${sitemap.size} Sitemap-Adressen`);
  if (hinweis.length) { console.log(`\nHINWEISE (${hinweis.length}):`); hinweis.forEach((h) => console.log("  " + h)); }
  if (fehler.length) { console.log(`\nFEHLER (${fehler.length}):`); fehler.forEach((x) => console.log("  " + x)); }
  console.log(fehler.length ? "\nDURCHGANG: NACHARBEIT" : "\nDURCHGANG: SAUBER");
  process.exit(fehler.length ? 1 : 0);
};
main().catch((e) => { console.error(e); process.exit(1); });
