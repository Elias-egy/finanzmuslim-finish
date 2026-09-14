import type { VergleichsZeile } from "@/components/vergleich/vergleichTypen";
import { halalAnlagen } from "./halalAnlagen";
import type { RohAnbieter, RohWert } from "./vergleichHelfer";

/**
 * Anbieterdaten fuer den Depot-Vergleich.
 *
 * WICHTIG: Hier stehen ausschliesslich geprüfte Angaben. Alles, was noch nicht
 * recherchiert ist, bleibt `null` und wird auf der Seite wörtlich als
 * "noch nicht geprüft" ausgegeben. Bitte keine Schätzungen eintragen.
 *
 * Zum Ausfüllen nur die Felder in `werte` ersetzen, an den Seiten ist nichts
 * zu ändern. Welcher Typ erwartet wird, steht in `DEPOT_ZEILEN`:
 * "ampel" nimmt "gut" (ja) oder "schlecht" (nein), "janein" nimmt true oder
 * false, alles andere nimmt Text.
 *
 * Kriterien beschlossen am 14.09.2026, Herleitung in
 * `~/rebrand/KRITERIEN_VERGLEICHE.md`. Ein Haram-Angebot beim Anbieter ist kein
 * Minuspunkt. Gefragt wird nur, ob man ab Start halal nutzen kann, ohne etwas
 * abwählen zu müssen, und wie viele unserer Halal-Anlagen es dort gibt.
 *
 * Anbieter: alle 56 Produkte aus dem Finanzfluss-Depotvergleich, Stand
 * 14.09.2026, alphabetisch. Keine Rangfolge, solange nicht alles geprüft ist.
 */

/** Halal-Anlagen ohne Krypto. Krypto zählt nur im Krypto-Vergleich. */
const ANLAGEN_OHNE_KRYPTO = halalAnlagen.filter((a) => a.kategorie !== "krypto").length;

export const DEPOT_ZEILEN: VergleichsZeile[] = [
  { key: "__angebot", label: "Angebot", art: "text", gruppe: "angebot" },
  {
    key: "__note",
    label: "Halal-Note",
    art: "text",
    gruppe: "angebot",
    hinweis: "Wird erst vergeben, wenn alle Merkmale geprüft sind.",
  },

  {
    key: "zinsfreiAbStart",
    label: "Zinsfrei ab Start",
    art: "ampel",
    gruppe: "halal",
    imRaster: true,
    hinweis:
      "Liegt das Guthaben nach der Eröffnung ohne Zins, ohne dass du etwas abwählen musst?",
  },
  {
    key: "halalAnlagen",
    label: "Halal-Anlagen",
    art: "text",
    gruppe: "halal",
    imRaster: true,
    hinweis: `Wie viele der ${ANLAGEN_OHNE_KRYPTO} Anlagen aus unserem Halal-Anlagen-Vergleich dort kaufbar sind. Krypto zählt im Krypto-Vergleich.`,
  },
  {
    key: "keinKreditAbStart",
    label: "Kein Kredit ab Start",
    art: "ampel",
    gruppe: "halal",
    hinweis: "Wird nach der Eröffnung kein Wertpapierkredit eingeräumt?",
  },

  { key: "depotgebuehr", label: "Depotgebühr im Jahr", art: "text", gruppe: "kosten", imRaster: true },
  { key: "orderkosten", label: "Kosten pro Order", art: "text", gruppe: "kosten", imRaster: true },
  { key: "etfSparplanKosten", label: "Kosten ETF-Sparplan", art: "text", gruppe: "kosten" },
  { key: "aktienSparplanKosten", label: "Kosten Aktien-Sparplan", art: "text", gruppe: "kosten" },
  { key: "sparrate", label: "Sparrate", art: "text", gruppe: "kosten" },
  { key: "intervalle", label: "Ausführungsintervalle", art: "text", gruppe: "kosten" },
  { key: "wertpapiere", label: "Verfügbare Wertpapiere", art: "text", gruppe: "kosten" },
  { key: "handelsplaetze", label: "Handelsplätze", art: "text", gruppe: "kosten" },
  { key: "kapest", label: "Steuer wird abgeführt", art: "janein", gruppe: "kosten" },
  { key: "appIos", label: "App-Bewertung iOS", art: "text", gruppe: "kosten" },
  { key: "appAndroid", label: "App-Bewertung Android", art: "text", gruppe: "kosten" },
  { key: "kundenservice", label: "Kundenservice", art: "text", gruppe: "kosten" },
  { key: "ident", label: "Ident-Verfahren", art: "text", gruppe: "kosten" },
  { key: "bank", label: "Depotführende Bank", art: "text", gruppe: "kosten" },
];

/** Alle Felder auf null. Genau so bleibt es, bis jemand nachgesehen hat. */
const leer = (): Record<string, RohWert> =>
  Object.fromEntries(
    DEPOT_ZEILEN.filter((z) => !z.key.startsWith("__")).map((z) => [z.key, null]),
  );

const slug = (name: string) =>
  name
    .toLowerCase()
    .replace(/\+/g, "-plus")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const platzhalter = (name: string, produkt: string, domain?: string): RohAnbieter => ({
  id: slug(`${name} ${produkt}`),
  name,
  produkt,
  domain,
  note: null,
  werte: leer(),
});

/**
 * Scalable Free Broker: das Verrechnungskonto zahlt keine Zinsen, nachgesehen
 * am 11.07.2026. Das Tagesgeld ist ein eigenes Produkt, das man selbst
 * eröffnen müsste.
 */
const scalableFree: RohAnbieter = {
  ...platzhalter("Scalable Capital", "Free Broker", "scalable.capital"),
  link: "/out/scalable",
  werte: { ...leer(), zinsfreiAbStart: "gut" },
};

const anbieter: RohAnbieter[] = [
  scalableFree,
  platzhalter("Scalable Capital", "Prime+ Broker", "scalable.capital"),
  platzhalter("1822direkt", "Aktiv-Depot", "1822direkt.de"),
  platzhalter("BBBank", "Depot", "bbbank.de"),
  platzhalter("Bison", "Broker", "bisonapp.com"),
  platzhalter("Bitpanda", "Depot", "bitpanda.com"),
  platzhalter("Bux", "Basic", "getbux.com"),
  platzhalter("Bux", "Plus", "getbux.com"),
  platzhalter("Bux", "Prime", "getbux.com"),
  platzhalter("CapTrader", "Depot", "captrader.com"),
  platzhalter("comdirect", "Depot", "comdirect.de"),
  platzhalter("comdirect", "Pure Depot", "comdirect.de"),
  platzhalter("Commerzbank", "DirektDepot", "commerzbank.de"),
  platzhalter("Commerzbank", "KlassikDepot", "commerzbank.de"),
  platzhalter("Commerzbank", "PremiumDepot", "commerzbank.de"),
  platzhalter("Consorsbank", "Depot", "consorsbank.de"),
  platzhalter("DEGIRO", "Depot", "degiro.de"),
  platzhalter("DKB", "Depot", "dkb.de"),
  platzhalter("eToro", "Depot", "etoro.com"),
  platzhalter("Fidelity", "Fondsdepot", "fidelity.de"),
  platzhalter("finanzen.net zero", "Depot", "finanzen.net"),
  platzhalter("finvesto", "Depot", "finvesto.de"),
  platzhalter("finvesto", "Depot Basis", "finvesto.de"),
  platzhalter("finvesto", "Wertpapierdepot", "finvesto.de"),
  platzhalter("flatex", "Depot", "flatex.de"),
  platzhalter("Freedom24", "All inclusive", "freedom24.com"),
  platzhalter("Freedom24", "Smart", "freedom24.com"),
  platzhalter("GENO Broker", "GENObasis Depot", "genobroker.de"),
  platzhalter("GENO Broker", "GENOprofi", "genobroker.de"),
  platzhalter("GLS Bank", "Depot", "gls.de"),
  platzhalter("HypoVereinsbank", "HVB Depot", "hypovereinsbank.de"),
  platzhalter("HypoVereinsbank", "HVB SmartDepot", "hypovereinsbank.de"),
  platzhalter("ING", "Direkt-Depot", "ing.de"),
  platzhalter("Interactive Brokers", "Depot", "interactivebrokers.com"),
  platzhalter("JOE Broker", "Depot", "joebroker.de"),
  platzhalter("justTRADE", "Depot", "justtrade.com"),
  platzhalter("Libertex", "Depot", "libertex.com"),
  platzhalter("LYNX", "Depot", "lynxbroker.de"),
  platzhalter("maxblue", "Depot", "maxblue.de"),
  platzhalter("maxblue", "Wertpapier-Sparplan", "maxblue.de"),
  platzhalter("N26", "Standard Depot", "n26.com"),
  platzhalter("Pax-Bank", "Klassisches Depot", "pax-bank.de"),
  platzhalter("Pax-Bank", "Online-Brokerage", "pax-bank.de"),
  platzhalter("Plus500", "Depot", "plus500.com"),
  platzhalter("Revolut", "Standard", "revolut.com"),
  platzhalter("S Broker", "Direkt-Depot", "sbroker.de"),
  platzhalter("Santander", "Wertpapierdepot", "santander.de"),
  platzhalter("Smartbroker+", "Depot", "smartbrokerplus.de"),
  platzhalter("Targobank", "Direkt-Depot", "targobank.de"),
  platzhalter("tradegate.direct", "Depot", "tradegate.direct"),
  platzhalter("Trade Republic", "Depot", "traderepublic.com"),
  platzhalter("Traders Place", "Depot", "tradersplace.de"),
  platzhalter("Trading 212", "Depot", "trading212.com"),
  platzhalter("Vivid", "Standard", "vivid.money"),
  platzhalter("WillBe", "Depot"),
  platzhalter("XTB", "Depot", "xtb.com"),
];

const alphabetisch = (a: RohAnbieter, b: RohAnbieter) =>
  `${a.name} ${a.produkt}`.localeCompare(`${b.name} ${b.produkt}`, "de", { sensitivity: "base" });

export const brokerVergleich: RohAnbieter[] = [...anbieter].sort(alphabetisch);

/** Die Merkmale, nach denen gefiltert wird. Reihenfolge wie in der Tabelle. */
export const DEPOT_FILTER = [
  { key: "zinsfreiAbStart", label: "Zinsfrei ab Start" },
  { key: "keinKreditAbStart", label: "Kein Kredit ab Start" },
];
