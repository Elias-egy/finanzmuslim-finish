import type { VergleichsZeile } from "@/components/vergleich/vergleichTypen";
import type { RohAnbieter, RohWert } from "./vergleichHelfer";

/**
 * Anbieterdaten fuer den Girokonto-Vergleich.
 *
 * Aufbau und Regeln wie in `brokerVergleich.ts`: Anbieter und Logos stehen
 * fest, jede inhaltliche Angabe ist `null` und erscheint wörtlich als
 * "noch nicht geprüft". Zum Ausfüllen nur die Felder in `werte` ersetzen.
 *
 * Keine Schätzungen. Eine Zahl kommt erst rein, wenn sie bei der Bank selbst
 * nachgelesen wurde.
 */

export const GIRO_ZEILEN: VergleichsZeile[] = [
  { key: "__angebot", label: "Angebot", art: "text", gruppe: "angebot" },
  {
    key: "__note",
    label: "Halal-Note",
    art: "text",
    gruppe: "angebot",
    hinweis: "Note aus den sechs Halal-Merkmalen. Wird erst vergeben, wenn alle geprüft sind.",
  },

  {
    key: "keinGuthabenzins",
    label: "Kein Guthabenzins",
    art: "ampel",
    gruppe: "halal",
    hinweis: "Zahlt die Bank Zinsen auf das Guthaben, und lässt sich das abschalten?",
  },
  {
    key: "zinsAbschaltbar",
    label: "Zins abschaltbar",
    art: "janein",
    gruppe: "halal",
    hinweis: "Kann der Guthabenzins selbst deaktiviert werden?",
  },
  {
    key: "keinDispo",
    label: "Kein Dispo",
    art: "ampel",
    gruppe: "halal",
    hinweis: "Wird ein Dispokredit automatisch eingeräumt, oder nur auf Antrag?",
  },
  {
    key: "dispoAufNull",
    label: "Dispo auf null setzbar",
    art: "janein",
    gruppe: "halal",
    hinweis: "Lässt sich der Dispo auf null stellen, damit gar kein Zinsvertrag besteht?",
  },
  {
    key: "karteOhneKreditrahmen",
    label: "Karte ohne Kreditrahmen",
    art: "ampel",
    gruppe: "halal",
    hinweis: "Ist die Karte eine echte Debitkarte, oder hängt ein Kreditrahmen daran?",
  },
  {
    key: "keineZinsbindung",
    label: "Kein Zinsprodukt im Konto",
    art: "ampel",
    gruppe: "halal",
    hinweis: "Ist ein Tagesgeld oder Sparbereich mit Zins fest mit dem Konto verbunden?",
  },

  {
    key: "kontofuehrung",
    label: "Kontoführung im Monat",
    art: "text",
    gruppe: "kosten",
    imRaster: true,
  },
  {
    key: "girocard",
    label: "Girocard im Monat",
    art: "text",
    gruppe: "kosten",
    imRaster: true,
  },
  {
    key: "debitkarte",
    label: "Debitkarte im Monat",
    art: "text",
    gruppe: "kosten",
    imRaster: true,
  },
  {
    key: "geldautomaten",
    label: "Geldautomaten",
    art: "text",
    gruppe: "kosten",
    imRaster: true,
  },
  { key: "bargeld", label: "Bargeld abheben", art: "text", gruppe: "kosten" },
  { key: "mindestgeldeingang", label: "Mindestgeldeingang", art: "text", gruppe: "kosten" },
  { key: "dispozins", label: "Dispozins", art: "text", gruppe: "kosten" },
  { key: "guthabenzins", label: "Guthabenzins", art: "text", gruppe: "kosten" },
  { key: "auslandsabhebung", label: "Abheben im Ausland", art: "text", gruppe: "kosten" },
  { key: "applePay", label: "Apple Pay und Google Pay", art: "janein", gruppe: "kosten" },
  { key: "unterkonten", label: "Unterkonten möglich", art: "janein", gruppe: "kosten" },
  { key: "gemeinschaftskonto", label: "Gemeinschaftskonto möglich", art: "janein", gruppe: "kosten" },
  { key: "einlagensicherung", label: "Einlagensicherung", art: "text", gruppe: "kosten" },
  { key: "appIos", label: "App-Bewertung iOS", art: "text", gruppe: "kosten" },
  { key: "appAndroid", label: "App-Bewertung Android", art: "text", gruppe: "kosten" },
  { key: "kundenservice", label: "Kundenservice", art: "text", gruppe: "kosten" },
];

const leer = (): Record<string, RohWert> =>
  Object.fromEntries(
    GIRO_ZEILEN.filter((z) => !z.key.startsWith("__")).map((z) => [z.key, null]),
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
 * Ausgewaehlt sind die Banken, die in Deutschland ein kostenloses oder
 * guenstiges Girokonto ohne Filialpflicht fuehren. Ob eines davon ohne
 * Zinsgeschaeft auskommt, steht hier ausdruecklich noch nicht.
 */
export const girokontoVergleich: RohAnbieter[] = [
  platzhalter("Trade Republic", "Girokonto", "traderepublic.com"),
  platzhalter("C24", "Smart", "c24bank.de"),
  platzhalter("DKB", "Girokonto", "dkb.de"),
  platzhalter("ING", "Girokonto", "ing.de"),
  platzhalter("Consorsbank", "Girokonto", "consorsbank.de"),
  platzhalter("comdirect", "Girokonto Aktiv", "comdirect.de"),
  platzhalter("Norisbank", "Top-Girokonto", "norisbank.de"),
  platzhalter("Santander", "BestGiro", "santander.de"),
  platzhalter("BBBank", "BetterSmart", "bbbank.de"),
  platzhalter("N26", "Standard", "n26.com"),
  platzhalter("Revolut", "Standard", "revolut.com"),
  platzhalter("Vivid", "Standard", "vivid.money"),
  platzhalter("Bunq", "Easy Bank", "bunq.com"),
  platzhalter("Commerzbank", "Girokonto Basic", "commerzbank.de"),
  platzhalter("Postbank", "Giro Direkt", "postbank.de"),
  platzhalter("Sparkasse", "Giro digital", "sparkasse.de"),
  platzhalter("Volksbank", "VR-GiroDirekt", "vr.de"),
  platzhalter("GLS Bank", "GLS Girokonto", "gls.de"),
  platzhalter("Tomorrow", "Now", "tomorrow.one"),
  platzhalter("1822direkt", "Girokonto Klassik", "1822direkt.de"),
];

export const GIRO_FILTER = [
  { key: "keinGuthabenzins", label: "Nur Banken ohne Guthabenzins" },
  { key: "keinDispo", label: "Nur Banken ohne Dispo" },
  { key: "karteOhneKreditrahmen", label: "Karte ohne Kreditrahmen" },
];
