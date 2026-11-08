/**
 * App-Bilder je Broker im Blogteil des Depot-Vergleichs, wie Finanzfluss zwei Bilder unter jedem Broker zeigt. Nur Bilder
 * aus Elias' eigenen Konten (Elias SEO76: „nach den videos habe ich flatex scalable smartbroker und tradersplace“, Vault
 * raw/2026-11-08-elias-seo76-app-bilder-vier-konten.md), Beträge geschwärzt. Dateien in public/vergleich/depot-app/.
 * Fehlt ein Eintrag, steht live nichts, in der Vorschau ein markierter Platz.
 */
export type AppBild = { src: string; alt: string; text: string };

export const DEPOT_APP_BILDER: Record<string, AppBild[]> = {};

/** Für diese Häuser kommen Bilder von Elias; nur dort zeigt die Vorschau einen Platz. */
export const APP_BILDER_ERWARTET = new Set(["traders-place", "smartbroker", "scalable", "flatex"]);
