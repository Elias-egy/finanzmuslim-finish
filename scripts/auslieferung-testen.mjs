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
import { routenLaden } from "./routen-laden.mjs";

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
    // Wie GitHub Pages: /wissen/sukuk kommt aus wissen/sukuk.html, ein Ordner
    // aus seiner index.html. Kein 301 auf die Schraegstrich-Variante.
    let info = await stat(datei).catch(() => null);
    if (!extname(pfad) && !pfad.endsWith("/")) {
      // Datei vor Ordner: /wissen kommt aus wissen.html, auch wenn es den
      // Ordner wissen/ fuer die Unterseiten gibt.
      const alsDatei = join(DIST, `${pfad}.html`);
      const dateiInfo = await stat(alsDatei).catch(() => null);
      if (dateiInfo?.isFile()) {
        datei = alsDatei;
        info = dateiInfo;
      }
    }
    if (info?.isDirectory()) {
      datei = join(datei, "index.html");
      info = await stat(datei).catch(() => null);
    }
    if (!info?.isFile()) throw new Error("fehlt");
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

/**
 * Geprueft wird JEDE indexierbare Adresse, nicht eine Handvoll Beispiele.
 * Die Liste kommt aus src/data/routen.ts, derselben Quelle wie Sitemap und
 * Prerendering. Eine neue Anlage ist damit automatisch mit im Test.
 *
 * Dazu Adressen, die es nicht gibt, in allen drei Tiefen. Sie sind der
 * eigentliche Punkt: liefert der Hoster dort 200 mit der Startseite, hat er
 * eine SPA-Umleitung, und dann bekommt Google fuer jeden Tippfehler eine
 * indexierbare Seite.
 */
const { alleRouten, nichtIndexiert, weiterleitungen } = await routenLaden();
const pruefen = [
  ...alleRouten().map((r) => [r.pfad, 200]),
  // Muessen ausgeliefert werden, obwohl sie nicht in die Sitemap gehoeren.
  ...nichtIndexiert.map((pfad) => [pfad, 200]),
  ...weiterleitungen.map((w) => [w.von, 200]),
  ["/sitemap.xml", 200],
  ["/robots.txt", 200],
  // Schraegstrich-Varianten duerfen nicht die Seite sein: Canonical und
  // Sitemap fuehren ohne Schraegstrich, und genau so liefert Pages jetzt aus.
  ["/wissen/sukuk/", 404],
  ["/gibt-es-nicht", 404],
  ["/wissen/gibt-es-nicht", 404],
  ["/halal-anlagen/gibt-es-nicht", 404],
  ["/vergleich/gibt-es-nicht", 404],
  ["/dein-guide/falscher-schluessel", 404],
];

server.listen(0, "127.0.0.1", async () => {
  const port = server.address().port;
  let alleOk = true;
  const zaehler = {};
  for (const [pfad, erwartet] of pruefen) {
    const antwort = await fetch(`http://127.0.0.1:${port}${pfad}`);
    const text = antwort.headers.get("content-type")?.includes("html")
      ? await antwort.text()
      : "";
    const titel = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(text)?.[1]?.trim() ?? "";
    const ok = antwort.status === erwartet;
    if (!ok) {
      alleOk = false;
      console.log(
        `FEHL ${String(antwort.status).padEnd(4)} erwartet ${erwartet}  ${pfad}`,
      );
    } else if (erwartet === 404 || pfad === "/") {
      console.log(
        `ok   ${String(antwort.status).padEnd(4)} ${pfad.padEnd(34)} ${titel.slice(0, 55)}`,
      );
    }
    zaehler[erwartet] = (zaehler[erwartet] ?? 0) + (ok ? 1 : 0);
  }
  server.close();
  console.log(
    `\n${zaehler[200] ?? 0} Adressen mit 200, ${zaehler[404] ?? 0} mit 404, ` +
      `${pruefen.length} geprueft`,
  );
  console.log(alleOk ? "ALLE STATUS RICHTIG" : "STATUS FALSCH");
  if (!alleOk) process.exit(1);
});
