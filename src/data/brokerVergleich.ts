import type { VergleichsZeile } from "@/components/vergleich/vergleichTypen";
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
 * "ampel" nimmt "gut", "teils" oder "schlecht", "janein" nimmt true oder
 * false, alles andere nimmt Text.
 *
 * Die `note` bleibt so lange `null`, bis alle sieben Halal-Merkmale geprüft
 * sind. Eine Note auf halber Datenlage bewertet Nichtwissen.
 */

/**
 * Reihenfolge der Zeilen. Halal steht vor Kosten, weil ein günstiges Depot
 * niemandem nutzt, der die Anlagen dort nicht kaufen kann.
 */
export const DEPOT_ZEILEN: VergleichsZeile[] = [
  { key: "__angebot", label: "Angebot", art: "text", gruppe: "angebot" },
  {
    key: "__note",
    label: "Halal-Note",
    art: "text",
    gruppe: "angebot",
    hinweis: "Note aus den sieben Halal-Merkmalen. Wird erst vergeben, wenn alle geprüft sind.",
  },

  {
    key: "anlagenHandelbar",
    label: "Geprüfte Anlagen handelbar",
    art: "text",
    gruppe: "halal",
    imRaster: true,
    hinweis: "Wie viele der 27 Anlagen aus unserer Liste dort gekauft werden können.",
  },
  {
    key: "anlagenBesparbar",
    label: "Davon per Sparplan",
    art: "text",
    gruppe: "halal",
    imRaster: true,
    hinweis: "Wie viele davon sich als Sparplan einrichten lassen.",
  },
  {
    key: "keinGuthabenzins",
    label: "Kein Guthabenzins",
    art: "ampel",
    gruppe: "halal",
    hinweis: "Zahlt das Verrechnungskonto Zinsen, und lässt sich das abschalten?",
  },
  {
    key: "zinsAbschaltbar",
    label: "Zins abschaltbar",
    art: "janein",
    gruppe: "halal",
    hinweis: "Kann der Zins auf dem Verrechnungskonto selbst deaktiviert werden?",
  },
  {
    key: "keinWertpapierkredit",
    label: "Kein Wertpapierkredit",
    art: "ampel",
    gruppe: "halal",
    hinweis: "Wird ein Wertpapierkredit oder Dispo automatisch eingeräumt?",
  },
  {
    key: "keineHebelprodukte",
    label: "Keine Hebelprodukte",
    art: "ampel",
    gruppe: "halal",
    hinweis: "Bietet der Broker Hebelprodukte und CFDs an, und wie sichtbar?",
  },
  {
    key: "islamicEtfs",
    label: "Islamic ETFs handelbar",
    art: "ampel",
    gruppe: "halal",
    hinweis: "Sind sharia-konforme ETFs kaufbar und besparbar?",
  },
  {
    key: "ertraegeGetrennt",
    label: "Zinserträge getrennt ausgewiesen",
    art: "janein",
    gruppe: "halal",
    hinweis: "Zeigt die Abrechnung Zinsen getrennt, damit sie sich reinigen lassen?",
  },

  {
    key: "depotgebuehr",
    label: "Depotgebühr im Jahr",
    art: "text",
    gruppe: "kosten",
    imRaster: true,
  },
  {
    key: "orderkosten",
    label: "Kosten pro Order",
    art: "text",
    gruppe: "kosten",
    imRaster: true,
  },
  { key: "sparplanKosten", label: "Kosten pro Sparplan", art: "text", gruppe: "kosten" },
  { key: "mindestsparrate", label: "Mindestsparrate", art: "text", gruppe: "kosten" },
  { key: "intervalle", label: "Ausführungsintervalle", art: "text", gruppe: "kosten" },
  { key: "handelsplaetze", label: "Handelsplätze", art: "text", gruppe: "kosten" },
  { key: "xetra", label: "Xetra-Order möglich", art: "janein", gruppe: "kosten" },
  { key: "zinsenGuthaben", label: "Zinsen auf Guthaben", art: "text", gruppe: "kosten" },
  { key: "wertpapierkredit", label: "Wertpapierkredit", art: "text", gruppe: "kosten" },
  { key: "hebelprodukte", label: "Hebelprodukte", art: "text", gruppe: "kosten" },
  { key: "kapest", label: "Steuer wird abgeführt", art: "janein", gruppe: "kosten" },
  { key: "appIos", label: "App-Bewertung iOS", art: "text", gruppe: "kosten" },
  { key: "appAndroid", label: "App-Bewertung Android", art: "text", gruppe: "kosten" },
  { key: "kundenservice", label: "Kundenservice", art: "text", gruppe: "kosten" },
  { key: "bank", label: "Depotführende Bank", art: "text", gruppe: "kosten" },
  { key: "einlagensicherung", label: "Einlagensicherung", art: "text", gruppe: "kosten" },
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
 * Scalable ist der einzige Anbieter mit einer geprüften Angabe: das
 * Verrechnungskonto zahlt keine Zinsen, nachgesehen am 11.07.2026. Die Note
 * bleibt trotzdem offen, ein Merkmal von sieben ergibt keine Note.
 */
const scalable: RohAnbieter = {
  ...platzhalter("Scalable Capital", "Free Broker", "scalable.capital"),
  link: "/out/scalable",
  werte: { ...leer(), keinGuthabenzins: "gut" },
};

export const brokerVergleich: RohAnbieter[] = [
  scalable,
  platzhalter("Trade Republic", "Depot", "traderepublic.com"),
  platzhalter("Traders Place", "Depot", "tradersplace.de"),
  platzhalter("Smartbroker+", "Depot", "smartbroker.de"),
  platzhalter("finanzen.net zero", "Depot", "finanzen.net"),
  platzhalter("Trading 212", "Depot", "trading212.com"),
  platzhalter("comdirect", "Pure Depot", "comdirect.de"),
  platzhalter("ING", "Direkt-Depot", "ing.de"),
  platzhalter("Consorsbank", "Depot", "consorsbank.de"),
  platzhalter("DKB", "Depot", "dkb.de"),
  platzhalter("S-Broker", "Direkt-Depot", "sbroker.de"),
  platzhalter("flatex", "Depot", "flatex.de"),
  platzhalter("Bitpanda", "Depot", "bitpanda.com"),
  platzhalter("N26", "Standard Depot", "n26.com"),
  platzhalter("justTRADE", "Depot", "justtrade.com"),
  platzhalter("1822direkt", "Aktiv-Depot", "1822direkt.de"),
  platzhalter("Targobank", "Direkt-Depot", "targobank.de"),
  platzhalter("maxblue", "Depot", "maxblue.de"),
  platzhalter("Commerzbank", "DirektDepot", "commerzbank.de"),
  platzhalter("Postbank", "Depot", "postbank.de"),
  platzhalter("Tradegate Direct", "Depot", "tradegate.de"),
  platzhalter("finvesto", "Wertpapierdepot", "finvesto.de"),
  platzhalter("Fidelity", "Fondsdepot", "fidelity.de"),
  platzhalter("JOE Broker", "Depot", "joebroker.de"),
  platzhalter("Revolut", "Standard", "revolut.com"),
  platzhalter("Vivid", "Standard", "vivid.money"),
  platzhalter("XTB", "Depot", "xtb.com"),
  platzhalter("eToro", "Depot", "etoro.com"),
  platzhalter("CapTrader", "Depot", "captrader.com"),
  platzhalter("LYNX", "Depot", "lynxbroker.de"),
  platzhalter("Bison", "Broker", "bisonapp.com"),
];

/** Die Merkmale, nach denen gefiltert wird. Reihenfolge wie in der Tabelle. */
export const DEPOT_FILTER = [
  { key: "keinGuthabenzins", label: "Nur Anbieter ohne Guthabenzins" },
  { key: "keineHebelprodukte", label: "Nur Anbieter ohne Hebelprodukte" },
  { key: "islamicEtfs", label: "Islamic ETFs handelbar" },
];
