/**
 * Die Liste, das Freebie zum Wort „Liste“ (MC7d13, 31.10.2026): neu im Stil von Fassung 5 des
 * Portfolio-Plans (Elias, 28.10.2026: „in dem stil alle anderen auch“). Die Frage des Lesers ist „Was kann
 * ich überhaupt halal kaufen?“ (Plan MC7D11, Karte LISTE); die echten Fragen dazu stehen im Vault unter
 * `raw/2026-10-31-mc7d13-echte-fragen-liste.md` („quite hard to find halal investments“, „difficult to find
 * brokers“).
 *
 * Alles hier ist aus `halalAnlagen.ts` und `anlagenKaufbar.ts` gezählt, nichts von Hand. Jede Halal- und
 * Zinsaussage hat ihren Beleg in `docs/freebies/anlagen-liste.txt.belege.md`.
 */
import { kaufGruppen, kaufZeilen, krypto, ohneBeleg, type KaufZeile } from "@/data/halalAnlagenKauf";
import type { Anlage } from "@/data/halalAnlagen";
import { DEPOTS_GEPRUEFT, DEPOTS_MIT_ALLEN, ETF_ZAHL } from "@/data/etfPlan";

/** Jeder Link trägt seine Stelle, damit MC6 die Klicks je Stelle zählen kann. */
export const listeLink = (ziel: string, stelle: string) => `${ziel}?src=gliste-${stelle}`;

/** Die Kacheln oben: was es gibt, je Art mit Zahl. Krypto zählt mit, kaufbar an Börsen. */
export const UEBERBLICK = [
  ...kaufGruppen.map((g) => ({ id: g.kategorie, zahl: g.zeilen.length, wort: g.titel.split(",")[0] })),
  { id: "krypto" as const, zahl: krypto.length, wort: "Krypto" },
];
export const ANZAHL_DEPOT = kaufZeilen.length;

/** Prüfstelle kurz: der Teil vor dem ersten Komma, wie in der Anlagen-Datenbank geschrieben. */
export const pruefstelle = (a: Anlage) => a.zertifizierer.split(",")[0];

/**
 * Kleine Logos je Karte, nicht anklickbar (Elias, 28.10.2026, MC3b). Nur bekannte, empfehlbare Depots, die
 * ich ganz geprüft habe (der Test prüft beides); gezeigt werden die ersten drei, die die Anlage führen.
 */
export const KARTEN_DEPOTS = [
  { id: "scalable-capital-free-broker", name: "Scalable Capital", domain: "scalable.capital" },
  { id: "trade-republic-depot", name: "Trade Republic", domain: "traderepublic.com" },
  { id: "trading-212-depot", name: "Trading 212", domain: "trading212.com" },
  { id: "traders-place-depot", name: "Traders Place", domain: "tradersplace.de" },
  { id: "comdirect-depot", name: "comdirect", domain: "comdirect.de" },
  { id: "consorsbank-depot", name: "Consorsbank", domain: "consorsbank.de" },
  { id: "flatex-depot", name: "flatex", domain: "flatex.de" },
  { id: "finanzen-net-zero-depot", name: "finanzen.net zero", domain: "finanzen.net" },
] as const;

export const kartenLogos = (z: KaufZeile) =>
  KARTEN_DEPOTS.filter((d) => z.kaufbar.kaufbar.some((k) => k.anbieter === d.name)).slice(0, 3);

/**
 * Der eine rote Schmerz (Elias, 28.10.2026: „ein roter Schmerz reicht“), aus den echten Fragen: Nicht jedes
 * Depot führt sie. Gezählt wie im ETF-Plan, nur zinsfreie, ganz geprüfte Depots ohne Abraten.
 */
export const SCHMERZ_SATZ = `Nicht jedes Depot hat sie. Von ${DEPOTS_GEPRUEFT.length} zinsfreien Depots, die ich ganz geprüft habe, ${
  DEPOTS_MIT_ALLEN.length === 1 ? "hat nur eins" : `haben nur ${DEPOTS_MIT_ALLEN.length}`
} alle ${ETF_ZAHL} Aktien-ETFs und Fonds.`;

export { kaufGruppen, krypto, ohneBeleg };
