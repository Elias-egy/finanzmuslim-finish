/**
 * Die vier Schlüssel der alten Guide-Seiten /dein-guide/<schluessel> (Einsteiger, Fortgeschritten, Profi, XXL).
 * Seit AG4 (23.11.2026) gibt es einen Guide, den Halal Starter Guide: Alle vier Adressen führen auf /guide
 * (`weiterleitungen` in routen.ts). Eigene kleine Datei, damit App.tsx nicht die ganze Routenliste lädt.
 */
export const ALTE_GUIDE_SCHLUESSEL = ["start-2026", "aufbau-2026", "tiefe-2026", "xxl-3j1ion"] as const;
