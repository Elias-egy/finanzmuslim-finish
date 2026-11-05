// Misst am Laptop, ob der Aufruf-Kasten der Seitenleiste ganz sichtbar ist (oben auf der Seite und nach dem Scrollen).
// Aufruf: node scripts/blog-leiste.mjs <port> <pfad> [<pfad> ...]; Vorschau vorher mit npm run dev -- --port <port>.
// Elias SEO31 und SEO60 („der sitzt wieder so ganz unten“): Ausgang 1, sobald der Kasten an einer Laptop-Größe nicht ganz im Bild ist.
import puppeteer from "puppeteer-core";
const [port, ...pfade] = process.argv.slice(2);
const GROESSEN = [[1280, 680], [1366, 650], [1440, 760], [1470, 830], [1536, 740], [1920, 940]];
const browser = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: true, args: ["--no-sandbox"] });
let fehler = 0;
for (const pfad of pfade) {
  for (const [w, h] of GROESSEN) {
    const page = await browser.newPage();
    await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
    await page.evaluateOnNewDocument(() => { try { localStorage.setItem("cookie-consent", "denied"); } catch {} });
    await page.goto(`http://localhost:${port}${pfad}`, { waitUntil: "networkidle0", timeout: 60000 });
    await new Promise((r) => setTimeout(r, 800));
    const mess = async () => page.evaluate(() => {
      const aside = document.querySelector('aside[aria-label="Inhaltsverzeichnis"]');
      if (!aside || !aside.offsetParent) return null;
      const knopf = [...aside.querySelectorAll("a")].filter((a) => a.getAttribute("href")?.startsWith("/")).pop();
      const kasten = knopf?.closest("div.border") ?? knopf;
      const b = kasten.getBoundingClientRect();
      return { oben: Math.round(b.top), unten: Math.round(b.bottom), knopfUnten: Math.round(knopf.getBoundingClientRect().bottom), vh: innerHeight };
    });
    const start = await mess();
    await page.evaluate(() => scrollTo(0, 2500));
    await new Promise((r) => setTimeout(r, 300));
    const scroll = await mess();
    const ok = (m) => m && m.unten <= m.vh - 8;
    const urteil = !start ? "keine Leiste" : ok(start) && ok(scroll) ? "ok" : "FEHLT";
    if (urteil === "FEHLT") fehler++;
    console.log(`${pfad} ${w}x${h}: ${urteil}  oben ${JSON.stringify(start)} gescrollt ${JSON.stringify(scroll)}`);
    await page.close();
  }
}
await browser.close();
process.exit(fehler ? 1 : 0);
