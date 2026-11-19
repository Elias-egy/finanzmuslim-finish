import { defineConfig, loadEnv } from "vite";
import { existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from "fs";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // RN5 (15.11.2026): Schalter Phase 1 / 2, Standard 1 ohne OS (src/config/phase.ts). In Phase 1 gibt es weder die
  // Verkaufsseite /investment-os/ noch den Entwicklungs-Umweg /os-entwurf.
  let ausgabe = path.resolve(__dirname, "dist");
  const mitOs = (process.env.VITE_PHASE ?? loadEnv(mode, process.cwd(), "VITE_").VITE_PHASE) === "2";
  return {
  server: {
    host: "::",
    port: process.env.PORT ? Number(process.env.PORT) : 8080,
    hmr: {
      overlay: false,
    },
    // Nur Entwicklung (VS4, 11.11.2026): Verkaufsseite und OS-Entwurf der OS-Linie liegen im Vault
    // und laufen auf 127.0.0.1:5331. So sind sie auch unter diesem einen Localhost erreichbar
    // (/os-entwurf/verkauf.html, /os-entwurf/app/). Beim Einbau ersetzt eine echte Seite den Umweg.
    proxy: mitOs ? {
      "/os-entwurf": {
        target: "http://127.0.0.1:5331",
        rewrite: (pfad: string) => pfad.replace(/^\/os-entwurf/, ""),
      },
    } : undefined,
  },
  // Bauzeit für die Ausgaben der Halal-News (src/data/newsletterAusgaben.ts, sichtbarAb).
  define: { __BAUZEIT__: JSON.stringify(process.env.BAUZEIT || new Date().toISOString()) },
  plugins: [
    // RN1 (12.11.2026): Die Verkaufsseite des Halal-Investment-OS liegt fest in public/investment-os/.
    // Im Entwicklungsserver liefert /investment-os sonst die React-Startseite; live liefert der Host index.html selbst.
    {
      name: "investment-os-seite",
      // Ohne Schrägstrich am Ende zeigen Bilder und Schriften (relative Pfade) ins Leere: erst umleiten wie der Host live.
      configureServer(server: { middlewares: { use: (fn: (req: { url?: string }, res: { statusCode: number; setHeader: (k: string, v: string) => void; end: (text?: string) => void }, next: () => void) => void) => void } }) {
        server.middlewares.use((req, res, next) => {
          if (!mitOs && req.url && /^\/(investment-os|os-entwurf)(\/|\?|$)/.test(req.url)) {
            res.statusCode = 404;
            res.setHeader("Content-Type", "text/plain; charset=utf-8");
            res.end("Phase 1: ohne Halal-Investment-OS");
            return;
          }
          if (req.url && /^\/investment-os(\?.*)?$/.test(req.url)) {
            res.statusCode = 301;
            res.setHeader("Location", "/investment-os/" + (req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : ""));
            res.end();
            return;
          }
          if (req.url && /^\/investment-os\/(\?.*)?$/.test(req.url)) {
            req.url = "/investment-os/index.html" + (req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : "");
          }
          next();
        });
      },
      // Beim Build in Phase 1 die Verkaufsseite aus dist nehmen, sonst läge sie live unter /investment-os/.
      configResolved(c: { root: string; build: { outDir: string } }) {
        ausgabe = path.resolve(c.root, c.build.outDir);
      },
      closeBundle() {
        // RN20 (Prüfbericht RN19 Punkt 13): interne Messseiten (public/__rn9-mess.html und ähnlich) gehören nicht live.
        // Sie liegen nur lokal, sind in .gitignore und kommen hier auch aus dem Build, falls eine im Ordner liegt.
        for (const datei of readdirSync(ausgabe)) {
          if (datei.startsWith("__")) rmSync(path.join(ausgabe, datei), { recursive: true, force: true });
        }
        if (!mitOs) {
          rmSync(path.join(ausgabe, "investment-os"), { recursive: true, force: true });
          // RN19: llms.txt nennt das OS nur in Phase 2. In Phase 1 wäre der Link eine 404.
          const llms = path.join(ausgabe, "llms.txt");
          if (existsSync(llms)) {
            writeFileSync(llms, readFileSync(llms, "utf8").replace(/## Halal-Investment-OS\n[\s\S]*?(?=\n## )\n/, ""));
          }
        }
      },
    },
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
};
});
