/**
 * Testet den dist-Ordner so, wie ein statischer Hoster ihn ausliefert:
 * jede Datei unter ihrer eigenen Adresse, KEINE Umleitung aller Adressen auf
 * index.html. Genau daran entscheidet sich, ob unbekannte Adressen einen
 * echten 404 bekommen oder stillschweigend die Startseite mit Status 200.
 *
 * Aufruf: node scripts/auslieferung-testen.mjs
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const DIST = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");

const TYPEN = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
};

const server = createServer(async (anfrage, antwort) => {
  const pfad = decodeURIComponent(new URL(anfrage.url, "http://x").pathname);
  let datei = join(DIST, pfad);
  try {
    if ((await stat(datei)).isDirectory()) datei = join(datei, "index.html");
    const inhalt = await readFile(datei);
    antwort.writeHead(200, { "Content-Type": TYPEN[extname(datei)] ?? "application/octet-stream" });
    antwort.end(inhalt);
  } catch {
    // Kein Rückfall auf index.html. Genau so verhält sich ein Hoster ohne
    // SPA-Umleitung, und genau so muss die Seite später ausgeliefert werden.
    try {
      const vierNullVier = await readFile(join(DIST, "404.html"));
      antwort.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      antwort.end(vierNullVier);
    } catch {
      antwort.writeHead(404).end("404");
    }
  }
});

const pruefen = [
  ["/", 200],
  ["/wissen/nisab", 200],
  ["/zakat-rechner", 200],
  ["/vergleich/depot", 200],
  ["/halal-anlagen/xrp", 200],
  ["/sitemap.xml", 200],
  ["/robots.txt", 200],
  ["/gibt-es-nicht", 404],
  ["/wissen/gibt-es-nicht", 404],
  ["/halal-anlagen/gibt-es-nicht", 404],
];

server.listen(0, "127.0.0.1", async () => {
  const port = server.address().port;
  let alleOk = true;
  for (const [pfad, erwartet] of pruefen) {
    const antwort = await fetch(`http://127.0.0.1:${port}${pfad}`);
    const text = antwort.headers.get("content-type")?.includes("html")
      ? await antwort.text()
      : "";
    const titel = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(text)?.[1]?.trim() ?? "";
    const ok = antwort.status === erwartet;
    if (!ok) alleOk = false;
    console.log(
      `${ok ? "ok  " : "FEHL"} ${String(antwort.status).padEnd(4)} ${pfad.padEnd(32)} ${titel.slice(0, 60)}`,
    );
  }
  server.close();
  console.log(`\n${alleOk ? "ALLE STATUS RICHTIG" : "STATUS FALSCH"}`);
  if (!alleOk) process.exit(1);
});
