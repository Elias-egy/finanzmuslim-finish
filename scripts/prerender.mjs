/**
 * Prerendering beim Build.
 *
 * Warum überhaupt: Die Seite ist eine reine Vite-SPA. Ausgeliefert wurde bisher
 * für JEDE Adresse dieselbe leere index.html. Title, Description, Canonical,
 * Überschrift und JSON-LD entstehen erst, wenn JavaScript gelaufen ist. Google
 * rendert zwar JavaScript, aber verzögert und nicht garantiert, und jeder
 * andere Leser (Bing, KI-Crawler, Vorschaukarten in WhatsApp, Screenreader ohne
 * JS) sieht gar nichts. Nach diesem Schritt liegt für jede indexierbare Adresse
 * eine eigene, vollständige HTML-Datei im dist-Ordner.
 *
 * Warum mit einem echten Browser statt renderToString: Die SEO-Komponente setzt
 * ihre Tags in einem useEffect, und useEffect läuft bei serverseitigem Rendern
 * nicht. Ein Umbau auf serverseitiges Rendern würde außerdem jede Seite anfassen
 * müssen, die auf window zugreift. Der Browser rendert exakt das, was der Nutzer
 * auch sieht, ohne eine einzige Zeile Anwendungscode zu ändern.
 *
 * Quelle der Adressliste ist src/data/routen.ts, dieselbe Datei, aus der auch
 * die Sitemap entsteht. Was dort nicht steht, ist nicht zur Indexierung
 * gedacht, etwa /dein-investmentstart mit noindex oder die Weiterleitungen
 * unter /out.
 *
 * Aufruf: node scripts/prerender.mjs   (läuft in npm run build nach vite build)
 */
import { createServer } from "node:http";
import { readFile, writeFile, mkdir, readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";
import { routenLaden } from "./routen-laden.mjs";

const WURZEL = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(WURZEL, "dist");

/** Systeminstallierter Chrome. Kein Download von 150 MB Chromium nötig. */
const CHROME_PFADE = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  process.env.CHROME_PFAD,
].filter(Boolean);

const TYPEN = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".ico": "image/x-icon",
  ".pdf": "application/pdf",
  ".mp4": "video/mp4",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
};

/**
 * Adressen aus src/data/routen.ts, derselben Liste, aus der auch die Sitemap
 * entsteht. Vorher wurde hier die sitemap.xml gelesen. Das ging, solange die
 * Sitemap von Hand gepflegt wurde, waere jetzt aber ein Umweg ueber eine
 * Datei, die selbst erst erzeugt werden muss. Eine Quelle, zwei Verbraucher.
 */
const adressenLesen = async () => {
  const { alleRouten } = await routenLaden();
  return alleRouten().map((r) => r.pfad);
};

/**
 * Statischer Server über dist. Für echte Dateien liefert er die Datei, für
 * alles andere die unveränderte Hülle aus dem vite-Build.
 *
 * Die Hülle wird EINMAL vor dem Lauf in den Speicher gelesen. Ohne das
 * entsteht ein Fehler, der schwer zu sehen ist: Der Lauf überschreibt
 * dist/index.html mit der fertigen Startseite, und jede danach gerenderte
 * Seite startet dann von einer Hülle, in deren Kopf schon das JSON-LD der
 * Startseite steht. Das Ergebnis waren zwei Schemata je Unterseite, eines
 * davon falsch.
 */
const serverStarten = async () => {
  const huelle = await readFile(join(DIST, "index.html"));
  return new Promise((fertig) => {
    const server = createServer(async (anfrage, antwort) => {
      const pfad = decodeURIComponent(new URL(anfrage.url, "http://x").pathname);
      const datei = join(DIST, pfad);
      let inhalt = huelle;
      let typ = "text/html; charset=utf-8";
      try {
        if (pfad !== "/" && (await stat(datei)).isFile()) {
          inhalt = await readFile(datei);
          typ = TYPEN[extname(datei)] ?? "application/octet-stream";
        }
      } catch {
        // bleibt bei der Hülle
      }
      antwort.writeHead(200, { "Content-Type": typ });
      antwort.end(inhalt);
    });
    server.listen(0, "127.0.0.1", () => fertig({ server, port: server.address().port }));
  });
};

/** Wartet, bis die SEO-Komponente ihre Arbeit getan hat. */
const seoFertig = async (seite) => {
  await seite.waitForFunction(
    () =>
      document.querySelector("#root")?.children.length > 0 &&
      document.querySelector('link[rel="canonical"]') !== null &&
      document.querySelector('meta[name="description"]')?.content?.length > 0,
    { timeout: 20000 },
  );
  // Ein Frame Ruhe, damit auch das JSON-LD im zweiten Effekt drin ist.
  await new Promise((r) => setTimeout(r, 150));
};

/** Räumt auf, was nur zur Laufzeit gehört. */
const aufraeumen = (html) =>
  html
    // Vite-Preload-Fehlerbehandlung und HMR-Reste kommen nicht vor, aber
    // leere Portale von Radix schon. Sie sind unsichtbar und harmlos.
    .replace(/<script type="module" src="\/@vite\/client"><\/script>/g, "");

const schreiben = async (pfad, html) => {
  const ziel = pfad === "/" ? join(DIST, "index.html") : join(DIST, pfad, "index.html");
  await mkdir(dirname(ziel), { recursive: true });
  await writeFile(ziel, html, "utf8");
  return ziel;
};

const chromeFinden = () => CHROME_PFADE.find((p) => existsSync(p));

const main = async () => {
  if (!existsSync(join(DIST, "index.html"))) {
    throw new Error("dist/index.html fehlt. Erst vite build laufen lassen.");
  }

  /* Ohne Chrome wird nicht abgebrochen, sondern uebersprungen. Der Build in
     Lovable laeuft in einer Umgebung ohne Browser, und ein harter Fehler
     wuerde dort jede Veroeffentlichung blockieren. Die Warnung ist bewusst
     laut: ohne Prerendering geht jede Adresse wieder als leere Huelle raus. */
  if (!chromeFinden()) {
    process.stdout.write(
      "\nACHTUNG: Kein Chrome gefunden, Prerendering uebersprungen.\n" +
        "Die Seiten gehen ohne Title, Description und Inhalt im Quelltext raus.\n" +
        "Pfad ueber die Umgebungsvariable CHROME_PFAD setzen.\n\n",
    );
    return;
  }

  const adressen = await adressenLesen();
  const { server, port } = await serverStarten();
  const browser = await puppeteer.launch({
    executablePath: chromeFinden(),
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });

  const seite = await browser.newPage();
  await seite.setViewport({ width: 1280, height: 900 });
  // Keine Bilder und Videos laden, das spart beim Prerendern die meiste Zeit.
  // Auf das erzeugte HTML hat es keinen Einfluss.
  await seite.setRequestInterception(true);
  seite.on("request", (r) => {
    const typ = r.resourceType();
    if (typ === "image" || typ === "media" || typ === "font") r.abort();
    else r.continue();
  });

  const fehler = [];
  let fertig = 0;

  for (const pfad of adressen) {
    try {
      await seite.goto(`http://127.0.0.1:${port}${pfad}`, {
        waitUntil: "networkidle0",
        timeout: 30000,
      });
      await seoFertig(seite);
      const html = aufraeumen(
        await seite.evaluate(() => "<!DOCTYPE html>\n" + document.documentElement.outerHTML),
      );
      await schreiben(pfad, html);
      fertig += 1;
      process.stdout.write(`ok   ${pfad}\n`);
    } catch (e) {
      fehler.push({ pfad, grund: e.message.split("\n")[0] });
      process.stdout.write(`FEHL ${pfad}  ${e.message.split("\n")[0]}\n`);
    }
  }

  /* Eigene 404-Seite. Sie wird über eine Adresse gerendert, die es sicher
     nicht gibt, damit die Fehlerseite der Anwendung erscheint. Statische
     Hoster liefern diese Datei mit dem Status 404 aus, sobald keine
     SPA-Umleitung mehr eingerichtet ist. */
  try {
    await seite.goto(`http://127.0.0.1:${port}/__nicht-vorhanden__`, {
      waitUntil: "networkidle0",
      timeout: 30000,
    });
    await seite.waitForFunction(() => document.querySelector("#root")?.children.length > 0, {
      timeout: 20000,
    });
    let html = await seite.evaluate(() => "<!DOCTYPE html>\n" + document.documentElement.outerHTML);
    // Kein Canonical auf eine Adresse, die es nicht gibt, und niemals indexieren.
    html = html
      .replace(/<link rel="canonical"[^>]*>/g, "")
      .replace(
        /<meta name="robots" content="[^"]*">/,
        '<meta name="robots" content="noindex, nofollow">',
      );
    await writeFile(join(DIST, "404.html"), html, "utf8");
    process.stdout.write("ok   404.html\n");
  } catch (e) {
    fehler.push({ pfad: "404.html", grund: e.message.split("\n")[0] });
  }

  await browser.close();
  server.close();

  process.stdout.write(`\n${fertig} von ${adressen.length} Seiten erzeugt.\n`);
  if (fehler.length) {
    process.stdout.write(`${fehler.length} Fehler:\n`);
    fehler.forEach((f) => process.stdout.write(`  ${f.pfad}: ${f.grund}\n`));
    process.exit(1);
  }
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
