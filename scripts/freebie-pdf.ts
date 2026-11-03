// Druckt jedes Freebie aus der Seite selbst als PDF im Handy-Maß (MC7d15, 01.11.2026). Die Liste der Seiten und
// Dateien steht in src/data/freebiePdfs.ts; die Druckregeln (alles aufgeklappt, Aufrufe auf eigener Seite) in
// src/index.css unter html[data-druck].
//
// Aufruf, während `npm run dev` auf Port 8080 läuft:
//   npx tsx scripts/freebie-pdf.ts            alle
//   npx tsx scripts/freebie-pdf.ts aktie liste
// Optional BASIS=http://localhost:4173 für `npm run preview`.
import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import puppeteer from "puppeteer-core";
import { FREEBIE_PDFS, type FreebiePdfWort } from "../src/data/freebiePdfs";

const BASIS = process.env.BASIS ?? "http://localhost:8080";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
// Eine Seite wie ein Handy-Bildschirm: am Handy füllt eine Seite den Schirm, die Schrift bleibt so groß wie auf der Website.
const BREITE = 430;
const HOEHE = 932;

const woerter = (process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(FREEBIE_PDFS)) as FreebiePdfWort[];
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
try {
  for (const wort of woerter) {
    const pdf = FREEBIE_PDFS[wort];
    if (!pdf) throw new Error(`Unbekanntes Freebie: ${wort}`);
    const page = await browser.newPage();
    await page.setViewport({ width: BREITE, height: HOEHE, deviceScaleFactor: 2 });
    await page.goto(BASIS + pdf.seite, { waitUntil: "networkidle0" });
    await page.evaluate(async (basis) => {
      document.documentElement.setAttribute("data-druck", "");
      document.querySelectorAll("details").forEach((d) => (d.open = true));
      document.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible"));
      document.querySelectorAll("img").forEach((img) => (img.loading = "eager"));
      // Fest stehende Leisten (Cookie-Hinweis, Kopf) gehören nicht ins PDF.
      document.querySelectorAll<HTMLElement>("body *").forEach((el) => {
        const pos = getComputedStyle(el).position;
        if (pos === "fixed") el.style.display = "none";
        if (pos === "sticky") el.style.position = "static";
      });
      // Links zeigen auf die Website, nicht auf den Rechner, auf dem gedruckt wird; Sprünge in der Seite bleiben.
      document.querySelectorAll<HTMLAnchorElement>("a[href]").forEach((a) => {
        const url = new URL(a.href, location.href);
        if (url.origin !== location.origin) return;
        if (url.pathname === location.pathname && url.hash) return;
        a.href = basis + url.pathname + url.search + url.hash;
      });
      await document.fonts.ready;
      await Promise.all(
        [...document.images].filter((i) => !i.complete).map((i) => new Promise((r) => ((i.onload = r), (i.onerror = r)))),
      );
    }, "https://finanzmuslim.com");
    await new Promise((r) => setTimeout(r, 500));
    const ziel = join("public", pdf.datei);
    mkdirSync(dirname(ziel), { recursive: true });
    await page.pdf({ path: ziel, width: `${BREITE}px`, height: `${HOEHE}px`, printBackground: true, margin: { top: "20px", right: 0, bottom: "20px", left: 0 } });
    for (const weitere of "auch" in pdf ? pdf.auch : []) copyFileSync(ziel, join("public", weitere));
    console.log(`${wort}: ${ziel}`);
    await page.close();
  }
} finally {
  await browser.close();
}
