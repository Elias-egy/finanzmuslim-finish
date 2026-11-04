import puppeteer from "/Users/eliasel-gendy/Documents/dev/fm-seo23/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js";
import fs from "fs";
// Text der gebauten Seite bei 390 px mit allen Klappzeilen offen, dazu Titel und Meta (wie pruefer-seo46/text.mjs).
const [,, pfad, ziel] = process.argv;
const browser = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: true, args: ["--no-sandbox"] });
const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
await page.goto("http://localhost:4179" + pfad, { waitUntil: "networkidle0", timeout: 60000 });
await new Promise((r) => setTimeout(r, 1200));
await page.evaluate(() => {
  document.querySelectorAll("details").forEach((d) => (d.open = true));
  document.querySelectorAll("button[aria-expanded=false]").forEach((b) => b.click());
});
await new Promise((r) => setTimeout(r, 600));
const t = await page.evaluate(() => {
  // Fragen und Antworten aus dem FAQPage-JSON-LD, weil ein Akkordeon nur eine Antwort zugleich zeigt.
  const faq = [...document.querySelectorAll('script[type="application/ld+json"]')]
    .flatMap((s) => { try { const j = JSON.parse(s.textContent); return [j, ...(j["@graph"] ?? [])]; } catch { return []; } })
    .filter((j) => j["@type"] === "FAQPage")
    .flatMap((j) => j.mainEntity.map((q) => `${q.name}\n${q.acceptedAnswer.text}`));
  return [document.title, document.querySelector('meta[name="description"]')?.content ?? "", document.querySelector("main").innerText, "", "FAQ (JSON-LD)", ...faq].join("\n");
});
fs.writeFileSync(ziel, t + "\n");
console.log(pfad, "Zeilen:", t.split("\n").length);
await browser.close();
process.exit(0);
