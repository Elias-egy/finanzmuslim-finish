/** Der Text der Datei src/data/logoSchnappschuss.ts; Skript und Test benutzen dieselbe Form. */
export const schnappschussText = (daten: Record<string, unknown>): string =>
  `// ERZEUGT von scripts/logo-schnappschuss.ts beim Bau (npm run build). Nicht von Hand ändern.\n` +
  `// Quelle der Rechnung: src/lib/anbieterLogosLive.ts. Der Test src/lib/anbieterLogos.test.ts schlägt an, wenn sie abweicht.\n` +
  `import type { LogoAnbieter, LogoKategorie } from "@/lib/anbieterLogos";\n\n` +
  `export const LOGO_SCHNAPPSCHUSS: Record<LogoKategorie, { logos: LogoAnbieter[]; gesamt: number }> = ${JSON.stringify(daten, null, 2)};\n`;
