/**
 * Vorschaubild je Seite, erzeugt nach dem Prerendering.
 *
 * Warum: Bis 16.09.2026 trug jede Seite dasselbe og-default.jpg. In WhatsApp,
 * Instagram-DMs und bei Google Discover sah damit jeder geteilte Link gleich
 * aus, egal ob Zakat-Rechner oder Depot-Vergleich. Hier bekommt jede
 * indexierbare Adresse ein eigenes Bild aus Title und Description der fertig
 * gerenderten Seite, im Stil der Freebie-Cover (Blau, Wortmarke, Titel gross).
 *
 * Ablauf: liest dist/<pfad>.html, zeichnet die Karte in Chrome, schreibt
 * dist/og/<slug>.png und tauscht og:image und twitter:image in der HTML-Datei.
 * Seiten mit eigenem Bild (image-Prop in Seo.tsx, also nicht og-default.jpg)
 * bleiben unangetastet.
 *
 * Aufruf: node scripts/og-bilder.mjs   (laeuft in npm run build nach prerender)
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";
import { routenLaden } from "./routen-laden.mjs";

const WURZEL = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(WURZEL, "dist");
const SITE = "https://finanzmuslim.com";
const STANDARD = `${SITE}/og-default.jpg`;

const CHROME_PFADE = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  process.env.CHROME_PFAD,
].filter(Boolean);

const attr = (html, tagRe, name) => {
  const m = tagRe.exec(html);
  if (!m) return null;
  const a = new RegExp(`${name}="([^"]*)"`).exec(m[0]);
  return a ? a[1] : null;
};
const entity = (s) =>
  s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Etikett oben rechts aus dem Pfad, damit die Karte die Seitenart zeigt. */
const etikett = (pfad) => {
  if (pfad === "/") return "Halal investieren lernen";
  if (pfad.startsWith("/wissen/")) return "Wissen";
  if (pfad.startsWith("/vergleich")) return "Vergleich";
  if (pfad.startsWith("/vorlagen/")) return "Kostenlose Vorlage";
  if (pfad.startsWith("/halal-anlagen/")) return "Halal-Anlage";
  if (pfad.endsWith("rechner")) return "Rechner";
  return "finanzmuslim";
};

/** Title ohne den Markenzusatz, der steht ohnehin als Wortmarke im Bild. */
const kurzTitel = (t) => t.replace(/\s*[|–-]\s*finanzmuslim\s*$/i, "").trim();

const slug = (pfad) => (pfad === "/" ? "start" : pfad.slice(1).replace(/\//g, "--"));

const karte = (titel, text, label, schrift) => `<!DOCTYPE html>
<html lang="de"><head><meta charset="utf-8">
<style>
@font-face{font-family:Figtree;src:url(data:font/woff2;base64,${schrift}) format("woff2");font-weight:300 900;}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;font-family:Figtree,system-ui,sans-serif;background:#0057FA;color:#fff;position:relative;overflow:hidden}
.glow{position:absolute;inset:0;background:
  radial-gradient(55% 60% at 88% 0%, rgba(187,211,255,.55) 0%, rgba(187,211,255,0) 70%),
  radial-gradient(50% 55% at 0% 100%, rgba(125,110,242,.55) 0%, rgba(125,110,242,0) 70%)}
.top{position:absolute;left:72px;right:72px;top:56px;display:flex;justify-content:space-between;align-items:center}
.wm{font-weight:800;font-size:34px;letter-spacing:-.03em}
.pill{background:#fff;color:#0057FA;font-weight:800;font-size:17px;letter-spacing:.12em;text-transform:uppercase;padding:10px 20px;border-radius:99px}
.body{position:absolute;left:72px;right:72px;top:170px}
h1{font-weight:800;font-size:${titel.length > 60 ? 58 : titel.length > 40 ? 68 : 80}px;line-height:1.02;letter-spacing:-.035em;max-width:1000px}
p{margin-top:28px;font-size:28px;line-height:1.4;color:rgba(255,255,255,.86);max-width:960px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.foot{position:absolute;left:72px;bottom:44px;font-size:22px;font-weight:600;color:#BBD3FF}
</style></head><body>
<div class="glow"></div>
<div class="top"><span class="wm">finanzmuslim</span><span class="pill">${esc(label)}</span></div>
<div class="body"><h1>${esc(titel)}</h1><p>${esc(text)}</p></div>
<div class="foot">finanzmuslim.com</div>
</body></html>`;

const main = async () => {
  const chrome = CHROME_PFADE.find((p) => existsSync(p));
  if (!chrome) {
    if (process.env.PRERENDER_OPTIONAL === "1") return console.log("og-bilder uebersprungen, kein Chrome");
    throw new Error("Kein Chrome gefunden, keine Vorschaubilder.");
  }
  const { alleRouten } = await routenLaden();
  const pfade = alleRouten().map((r) => r.pfad);
  const schrift = (await readFile(join(WURZEL, "public/fonts/figtree-latin.woff2"))).toString("base64");
  await mkdir(join(DIST, "og"), { recursive: true });

  const browser = await puppeteer.launch({ executablePath: chrome, headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
  const seite = await browser.newPage();
  await seite.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });

  let n = 0, uebersprungen = 0;
  for (const pfad of pfade) {
    const dateien = pfad === "/" ? [join(DIST, "index.html")] : [join(DIST, `${pfad}.html`), join(DIST, pfad, "index.html")];
    const haupt = dateien.find((d) => existsSync(d));
    if (!haupt) continue;
    const html = await readFile(haupt, "utf8");
    const bild = attr(html, /<meta[^>]*property="og:image"[^>]*>/i, "content");
    if (bild && bild !== STANDARD) { uebersprungen += 1; continue; }
    const titel = kurzTitel(entity((/<title[^>]*>([\s\S]*?)<\/title>/i.exec(html)?.[1] ?? "finanzmuslim")));
    const text = entity(attr(html, /<meta[^>]*name="description"[^>]*>/i, "content") ?? "");
    await seite.setContent(karte(titel, text, etikett(pfad), schrift), { waitUntil: "load" });
    await seite.evaluate(() => document.fonts.ready);
    const datei = join(DIST, "og", `${slug(pfad)}.jpg`);
    await seite.screenshot({ path: datei, type: "jpeg", quality: 88 });
    const url = `${SITE}/og/${slug(pfad)}.png`;
    const neu = html
      .replace(/(<meta[^>]*property="og:image"[^>]*content=")[^"]*(")/i, `$1${url}$2`)
      .replace(/(<meta[^>]*name="twitter:image"[^>]*content=")[^"]*(")/i, `$1${url}$2`);
    for (const d of dateien) if (existsSync(d)) await writeFile(d, neu, "utf8");
    n += 1;
  }
  await browser.close();
  console.log(`${n} Vorschaubilder nach dist/og, ${uebersprungen} Seiten mit eigenem Bild unveraendert.`);
};

main().catch((e) => { console.error(e); process.exit(1); });
