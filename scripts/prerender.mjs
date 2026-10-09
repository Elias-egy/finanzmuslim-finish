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
  const { alleRouten, nichtIndexiert, weiterleitungen } = await routenLaden();
  return {
    indexierbar: alleRouten().map((r) => r.pfad),
    nichtIndexiert,
    weiterleitungen,
  };
};

/**
 * Winzige Weiterleitungsseite. Ein statischer Hoster kann kein 301, deshalb
 * schickt eine Meta-Angabe weiter und ein Skript dahinter uebernimmt die
 * Abfrageparameter. Ohne das ginge bei /out/name das ?src= verloren, und dann
 * weiss niemand mehr, aus welchem Guide der Klick kam.
 */
const weiterleitungsSeite = (nach) => `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="robots" content="noindex, nofollow">
<link rel="canonical" href="https://finanzmuslim.com${nach}">
<meta http-equiv="refresh" content="0; url=${nach}">
<title>Weiterleitung</title>
<script>
  (function () {
    var ziel = ${JSON.stringify(nach)};
    var such = window.location.search;
    if (such) ziel += (ziel.indexOf("?") === -1 ? "?" : "&") + such.slice(1);
    window.location.replace(ziel);
  })();
</script>
</head>
<body>
<p>Weiter zu <a href="${nach}">${nach}</a></p>
</body>
</html>
`;

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

/** Setzt robots auf noindex, egal was die Seite selbst gesetzt hat. */
const aufNoindex = (html) =>
  /<meta name="robots"/.test(html)
    ? html.replace(/<meta name="robots" content="[^"]*">/, '<meta name="robots" content="noindex, nofollow">')
    : html.replace(/<head>/i, '<head><meta name="robots" content="noindex, nofollow">');

/**
 * Dateiname je Adresse. Seit 16.09.2026 <pfad>.html statt <pfad>/index.html.
 *
 * Warum: GitHub Pages liefert /wissen/sukuk aus wissen/sukuk.html direkt mit
 * 200 aus. Lag die Seite unter wissen/sukuk/index.html, antwortete Pages auf
 * /wissen/sukuk mit 301 auf /wissen/sukuk/, waehrend Canonical und Sitemap
 * ohne Schraegstrich zeigten. Live geprueft am 16.09.2026: alle 80
 * Sitemap-Adressen gaben 301. Google sah damit fuer jede Seite einen Umweg
 * und einen Canonical, der zurueck auf die Weiterleitung zeigte.
 */
export const dateiFuer = (pfad) =>
  pfad === "/" ? join(DIST, "index.html") : join(DIST, `${pfad}.html`);

/**
 * Knotenseiten wie /wissen haben Unterseiten (/wissen/sukuk) und damit auf der
 * Platte einen Ordner wissen/. Damit /wissen sicher ausgeliefert wird, egal ob
 * der Hoster zuerst die Datei wissen.html oder den Ordner ansieht, liegt die
 * Seite dort zusaetzlich als wissen/index.html. Beide Fassungen sind gleich
 * und tragen denselben Canonical ohne Schraegstrich.
 */
let knoten = new Set();

const schreiben = async (pfad, html) => {
  const ziel = dateiFuer(pfad);
  await mkdir(dirname(ziel), { recursive: true });
  await writeFile(ziel, html, "utf8");
  if (knoten.has(pfad)) {
    const zweit = join(DIST, pfad, "index.html");
    await mkdir(dirname(zweit), { recursive: true });
    await writeFile(zweit, html, "utf8");
  }
  return ziel;
};

const chromeFinden = () => CHROME_PFADE.find((p) => existsSync(p));

const main = async () => {
  if (!existsSync(join(DIST, "index.html"))) {
    throw new Error("dist/index.html fehlt. Erst vite build laufen lassen.");
  }

  /* Ohne Chrome bricht der Build ab. Frueher wurde hier nur gewarnt und
     uebersprungen, damit der Build in Lovable durchlaeuft. Das war der
     teuerste Kompromiss im Projekt: er hat aus jedem Lovable-Deploy still
     eine Auslieferung ohne Title, Description und Inhalt gemacht, und
     gemerkt haette man es erst an der Indexierung.
     Wer bewusst ohne Prerendering bauen will, etwa fuer eine reine
     Vorschau, setzt PRERENDER_OPTIONAL=1. Dann wird gewarnt statt
     abgebrochen. Der Auslieferungs-Build setzt das nie. */
  if (!chromeFinden()) {
    const text =
      "Kein Chrome gefunden, Prerendering nicht moeglich.\n" +
      "Ohne Prerendering geht jede Adresse als leere Huelle raus:\n" +
      "kein Title, keine Description, kein Inhalt im Quelltext.\n" +
      "Pfad ueber die Umgebungsvariable CHROME_PFAD setzen.\n";
    if (process.env.PRERENDER_OPTIONAL === "1") {
      process.stdout.write(`\nACHTUNG, uebersprungen: ${text}\n`);
      return;
    }
    throw new Error(text + "Zum bewussten Ueberspringen: PRERENDER_OPTIONAL=1");
  }

  const { indexierbar, nichtIndexiert, weiterleitungen } = await adressenLesen();
  const adressen = [...indexierbar, ...nichtIndexiert];
  const alle = [...adressen, ...weiterleitungen.map((w) => w.von)];
  knoten = new Set(adressen.filter((p) => p !== "/" && alle.some((a) => a.startsWith(`${p}/`))));
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
      await schreiben(pfad, nichtIndexiert.includes(pfad) ? aufNoindex(html) : html);
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

  /* Weiterleitungen. Ohne eigene Datei laeuft jede davon auf einem
     statischen Hoster in den 404, und /out/name ist der Weg, ueber den die
     Provision hereinkommt. */
  for (const { von, nach } of weiterleitungen) {
    const ziel = dateiFuer(von);
    await mkdir(dirname(ziel), { recursive: true });
    await writeFile(ziel, weiterleitungsSeite(nach), "utf8");
    process.stdout.write(`ok   ${von}  leitet auf ${nach}\n`);
  }

  await browser.close();
  server.close();

  process.stdout.write(
    `\n${fertig} von ${adressen.length} Seiten erzeugt ` +
      `(${indexierbar.length} indexierbar, ${nichtIndexiert.length} auf noindex), ` +
      `dazu ${weiterleitungen.length} Weiterleitungen.\n`,
  );
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
