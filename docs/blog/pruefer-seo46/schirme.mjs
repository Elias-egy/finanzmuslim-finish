import puppeteer from "/Users/eliasel-gendy/Documents/dev/fm-seo23/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js";
import fs from "fs";
const [,, pfad, breite, ordner, name, max = "60"] = process.argv;
fs.mkdirSync(ordner, { recursive: true });
const b = Number(breite), h = b < 800 ? (b === 360 ? 640 : 844) : 900;
const browser = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: true, args: ["--no-sandbox"] });
const page = await browser.newPage();
await page.setViewport({ width: b, height: h, deviceScaleFactor: b < 800 ? 2 : 1, isMobile: b < 800, hasTouch: b < 800 });
await page.goto("http://localhost:4179" + pfad, { waitUntil: "networkidle0", timeout: 60000 });
await new Promise(r => setTimeout(r, 1200));
const gesamt = await page.evaluate(() => document.documentElement.scrollHeight);
const quer = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
let i = 0;
for (let y = 0; y < gesamt && i < Number(max); y += h - 80) {
  await page.evaluate(y => scrollTo(0, y), y);
  await new Promise(r => setTimeout(r, 450));
  i++;
  await page.screenshot({ path: `${ordner}/${name}-${b}-${String(i).padStart(2, "0")}.png` });
}
console.log(name, b, "Schirme:", i, "Höhe:", gesamt, "Querlauf px:", quer);
await browser.close(); process.exit(0);
