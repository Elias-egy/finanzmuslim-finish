import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: process.env.PORT ? Number(process.env.PORT) : 8080,
    hmr: {
      overlay: false,
    },
    // Nur Entwicklung (VS4, 11.11.2026): Verkaufsseite und OS-Entwurf der OS-Linie liegen im Vault
    // und laufen auf 127.0.0.1:5331. So sind sie auch unter diesem einen Localhost erreichbar
    // (/os-entwurf/verkauf.html, /os-entwurf/app/). Beim Einbau ersetzt eine echte Seite den Umweg.
    proxy: {
      "/os-entwurf": {
        target: "http://127.0.0.1:5331",
        rewrite: (pfad: string) => pfad.replace(/^\/os-entwurf/, ""),
      },
    },
  },
  // Bauzeit für die Ausgaben der Halal-News (src/data/newsletterAusgaben.ts, sichtbarAb).
  define: { __BAUZEIT__: JSON.stringify(process.env.BAUZEIT || new Date().toISOString()) },
  plugins: [
    // RN1 (12.11.2026): Die Verkaufsseite des Halal-Investment-OS liegt fest in public/investment-os/.
    // Im Entwicklungsserver liefert /investment-os sonst die React-Startseite; live liefert der Host index.html selbst.
    {
      name: "investment-os-seite",
      // Ohne Schrägstrich am Ende zeigen Bilder und Schriften (relative Pfade) ins Leere: erst umleiten wie der Host live.
      configureServer(server: { middlewares: { use: (fn: (req: { url?: string }, res: { statusCode: number; setHeader: (k: string, v: string) => void; end: () => void }, next: () => void) => void) => void } }) {
        server.middlewares.use((req, res, next) => {
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
}));
