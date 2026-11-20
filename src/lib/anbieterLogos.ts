import { LOGO_SCHNAPPSCHUSS } from "@/data/logoSchnappschuss";

export type LogoAnbieter = { name: string; domain?: string };
export type LogoKategorie = "Depot" | "Girokonto" | "Krypto";

export const hatLogos = (kategorie: string): kategorie is LogoKategorie => kategorie in LOGO_SCHNAPPSCHUSS;

/**
 * Logos für Aufrufe zu einem Vergleich: die Angebote, die der Vergleich zeigt, nur die bewerbbaren, Partner vorn, je Haus
 * eines. Nacht-Tempo (RN25L, 20.11.2026): Die Liste kommt aus einem beim Bau erzeugten Schnappschuss
 * (`src/data/logoSchnappschuss.ts`, Rechnung in `anbieterLogosLive.ts`), damit Blogbeiträge und Aufrufe die drei
 * Vergleichsdateien samt Korrekturen (rund 100 KB gzip) nicht mitladen.
 */
export const logosFuer = (kategorie: LogoKategorie): { logos: LogoAnbieter[]; gesamt: number } => LOGO_SCHNAPPSCHUSS[kategorie];
