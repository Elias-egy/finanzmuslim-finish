// FOTO1: jede Stelle mit einem Foto von Elias als Handy-Schirm, dazu Bildkasten in px.
// Aufruf: node scripts/foto1-bestand.mjs <basis-url> <ordner>
import puppeteer from "puppeteer-core";
import fs from "node:fs";

const basis = process.argv[2] ?? "http://localhost:5296";
const ordner = process.argv[3] ?? "foto1-schirme";
fs.mkdirSync(ordner, { recursive: true });

const seiten = [
  ["start", "/"],
  ["ueber-mich", "/ueber-mich"],
  ["investmentstart", "/dein-investmentstart"],
  ["halal-guide", "/halal-guide"],
  ["beitrag", "/wissen/ist-leasing-haram"],
  ["gratis", "/gratis/halal-anlagen"],
  ["danke", "/danke/halal-anlagen"],
];
const muster = /elias|story-elias|founder|portrait/i;

const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
  args: ["--no-sandbox"],
});
const ergebnis = [];
for (const breite of [390, 360]) {
  for (const [name, pfad] of seiten) {
    const page = await browser.newPage();
    await page.setViewport({ width: breite, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    await page.goto(basis + pfad, { waitUntil: "load", timeout: 60000 });
    await new Promise((r) => setTimeout(r, 2000));
    if (name === "start") {
      await page.screenshot({ path: `${ordner}/${name}-erster-schirm-${breite}.png` });
    }
    const bilder = await page.$$eval("img", (els) =>
      els.map((e, i) => ({ i, src: e.currentSrc || e.src })),
    );
    let n = 0;
    for (const b of bilder.filter((b) => muster.test(b.src))) {
      const box = await page.evaluate((i) => {
        const e = document.querySelectorAll("img")[i];
        e.scrollIntoView({ block: "center" });
        const r = e.getBoundingClientRect();
        const s = getComputedStyle(e);
        const p = e.parentElement.getBoundingClientRect();
        return { w: Math.round(r.width), h: Math.round(r.height), top: Math.round(r.top + scrollY), sichtW: Math.round(Math.min(r.width, p.width)), sichtH: Math.round(Math.min(r.height, p.height)), display: s.display, nw: e.naturalWidth, nh: e.naturalHeight };
      }, b.i);
      if (box.display === "none" || box.w === 0) continue;
      await new Promise((r) => setTimeout(r, 300));
      n += 1;
      const datei = `${ordner}/${name}-${n}-${breite}.png`;
      await page.screenshot({ path: datei });
      ergebnis.push({ breite, seite: pfad, bild: b.src.split("/").pop().split("?")[0], ...box, datei });
    }
    await page.close();
  }
}
fs.writeFileSync(`${ordner}/bestand.json`, JSON.stringify(ergebnis, null, 2));
console.table(ergebnis.map(({ datei, ...r }) => r));
await browser.close();
process.exit(0);
