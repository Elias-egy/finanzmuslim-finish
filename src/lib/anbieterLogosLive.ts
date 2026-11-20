import { depotAnzeige } from "@/data/anzeige/depot";
import { girokontoAnzeige } from "@/data/anzeige/girokonto";
import { kryptoAnzeige } from "@/data/anzeige/krypto";
import { empfehlbar } from "@/data/vergleichAssistent";

export type LogoAnbieter = { name: string; domain?: string };

/** Die Angebote, die der Vergleich zeigt: Ein Logo führt dorthin und muss dort zu finden sein. */
const LISTEN = { Depot: depotAnzeige, Girokonto: girokontoAnzeige, Krypto: kryptoAnzeige } as const;
export type LogoKategorie = keyof typeof LISTEN;
export const LOGO_KATEGORIEN = Object.keys(LISTEN) as LogoKategorie[];

/**
 * Die Rechnung hinter `logosFuer` (Nacht-Tempo, RN25L, 20.11.2026). Sie liest alle drei Vergleiche samt Korrekturen
 * (rund 100 KB gzip) und läuft darum nicht mehr im Browser, sondern beim Bau: `scripts/logo-schnappschuss.ts` schreibt
 * das Ergebnis nach `src/data/logoSchnappschuss.ts`, `anbieterLogos.test.ts` schlägt an, wenn die Datei abweicht.
 * Nur Anbieter, die wir aktiv bewerben dürfen (`empfehlbar`: ab Start ohne Zinsen, keine Halal-Grundlage verletzt, nicht
 * abgeraten). Partner stehen vorn, weil der Klick dort Geld verdient. Je Haus nur ein Logo.
 */
export const logosLive = (kategorie: LogoKategorie): { logos: LogoAnbieter[]; gesamt: number } => {
  const liste = LISTEN[kategorie];
  const gruen = liste.filter((a) => a.domain && empfehlbar(a.id));
  const sortiert = [...gruen.filter((a) => a.link), ...gruen.filter((a) => !a.link)];
  const gesehen = new Set<string>();
  const logos = sortiert
    .filter((a) => (gesehen.has(a.domain!) ? false : (gesehen.add(a.domain!), true)))
    .map((a) => ({ name: a.name, domain: a.domain }));
  return { logos, gesamt: liste.length };
};
