/**
 * App-Bilder je Broker im Blogteil des Depot-Vergleichs, wie Finanzfluss zwei Bilder unter jedem Broker zeigt.
 * Seit SEO78 (08.11.2026): offizielle App-Bilder der Anbieter aus dem App Store (Apple-Schnittstelle
 * itunes.apple.com/lookup, screenshotUrls), weil Elias bei Smartbroker+ und flatex kein Konto hat (CV23S, Vault
 * raw/2026-11-08-elias-cv23s-*.md). Keine Bilder zu Krypto, Zinsen oder Kredit. Kommen Elias' eigene Bilder (Beträge
 * geschwärzt), ersetzen sie diese hier. Dateien in public/vergleich/depot-app/, Herkunft in docs/LOGOS.md.
 * Fehlt ein Eintrag, steht live nichts, in der Vorschau ein markierter Platz.
 */
export type AppBild = { src: string; alt: string; text: string };

/** Quelle unter den Bildern (Zitat braucht die Quelle). */
export const APP_BILD_QUELLE = "App Store";

export const DEPOT_APP_BILDER: Record<string, AppBild[]> = {
  smartbroker: [
    { src: "/vergleich/depot-app/smartbroker-1.webp", alt: "Smartbroker+ App: Depot-Übersicht", text: "Depot-Übersicht in der App" },
    { src: "/vergleich/depot-app/smartbroker-2.webp", alt: "Smartbroker+ App: ETF-Seite mit Sparplan und Kaufen", text: "ETF-Seite mit Sparplan und Kaufen" },
  ],
  flatex: [
    { src: "/vergleich/depot-app/flatex-1.webp", alt: "flatex App: Wertpapier mit Kaufen und Sparplan anlegen", text: "Wertpapier mit Kaufen und Sparplan" },
    { src: "/vergleich/depot-app/flatex-2.webp", alt: "flatex App: Depot-Übersicht", text: "Depot-Übersicht in der App" },
  ],
  "traders-place": [
    { src: "/vergleich/depot-app/traders-place-1.webp", alt: "Traders Place App: Portfolio-Übersicht", text: "Portfolio-Übersicht in der App" },
    { src: "/vergleich/depot-app/traders-place-2.webp", alt: "Traders Place App: Auswahl des Handelsplatzes", text: "Auswahl des Handelsplatzes" },
  ],
  scalable: [
    { src: "/vergleich/depot-app/scalable-1.webp", alt: "Scalable Capital App: Broker-Übersicht", text: "Broker-Übersicht in der App" },
    { src: "/vergleich/depot-app/scalable-2.webp", alt: "Scalable Capital App: ETF-Seite mit Kaufen", text: "ETF-Seite mit Kaufen und Verkaufen" },
  ],
};

/** Für diese Häuser kommen Bilder von Elias; nur dort zeigt die Vorschau einen Platz. */
export const APP_BILDER_ERWARTET = new Set(["traders-place", "smartbroker", "scalable", "flatex"]);
