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
 *
 * Kriterien beschlossen am 14.09.2026, Herleitung in
 * `~/rebrand/KRITERIEN_VERGLEICHE.md`. Gefragt wird nur, ob man das Konto ab
 * Start ohne Zins, Dispo und Kreditrahmen nutzen kann, ohne etwas abwählen zu
 * müssen. Auslandsgebühren kommen später.
 *
 * Anbieter: alle 56 Produkte aus dem Finanzfluss-Girokontovergleich, Stand
 * 14.09.2026, alphabetisch.
 */

export const GIRO_ZEILEN: VergleichsZeile[] = [
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
      "Kein Guthabenzins und kein verzinstes Unterkonto nach der Eröffnung, ohne dass du etwas abwählen musst?",
  },
  {
    key: "keinDispoAbStart",
    label: "Kein Dispo ab Start",
    art: "ampel",
    gruppe: "halal",
    imRaster: true,
    hinweis: "Wird nach der Eröffnung kein Dispokredit eingeräumt?",
  },
  {
    key: "karteOhneKredit",
    label: "Karte ohne Kredit",
    art: "ampel",
    gruppe: "halal",
    hinweis: "Ist die Standardkarte ohne Kreditrahmen und ohne Teilzahlung?",
  },

  { key: "kontofuehrung", label: "Kontoführung im Monat", art: "text", gruppe: "kosten", imRaster: true },
  { key: "girocard", label: "Girocard im Monat", art: "text", gruppe: "kosten", imRaster: true },
  { key: "debitkarte", label: "Debitkarte im Monat", art: "text", gruppe: "kosten" },
  { key: "mindestgeldeingang", label: "Mindestgeldeingang", art: "text", gruppe: "kosten" },
  { key: "applePay", label: "Apple Pay und Google Pay", art: "janein", gruppe: "kosten" },
  { key: "abhebungen", label: "Kostenlose Abhebungen im Monat", art: "text", gruppe: "kosten" },
  { key: "bargeldEinzahlen", label: "Bargeld einzahlen", art: "text", gruppe: "kosten" },
  { key: "geldautomaten", label: "Geldautomaten", art: "text", gruppe: "kosten" },
  { key: "sepaKostenlos", label: "Überweisung kostenlos", art: "janein", gruppe: "kosten" },
  { key: "kundenservice", label: "Telefon- und Chat-Support", art: "text", gruppe: "kosten" },
  { key: "filialen", label: "Filialen", art: "text", gruppe: "kosten" },
  { key: "appIos", label: "App-Bewertung iOS", art: "text", gruppe: "kosten" },
  { key: "appAndroid", label: "App-Bewertung Android", art: "text", gruppe: "kosten" },
  { key: "ident", label: "Ident-Verfahren", art: "text", gruppe: "kosten" },
  { key: "kontowechsel", label: "Kontowechsel-Service", art: "janein", gruppe: "kosten" },
  { key: "einlagensicherung", label: "Einlagensicherung", art: "text", gruppe: "kosten" },
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

const anbieter: RohAnbieter[] = [
  platzhalter("1822direkt", "GiroDirekt", "1822direkt.de"),
  platzhalter("BBBank", "BetterSmart", "bbbank.de"),
  platzhalter("BBBank", "Girokonto", "bbbank.de"),
  platzhalter("BBVA", "Girokonto", "bbva.de"),
  platzhalter("Berliner Volksbank", "Girokonto", "berliner-volksbank.de"),
  platzhalter("Bforbank", "BforBASIC Konto", "bforbank.de"),
  platzhalter("bunq", "Core", "bunq.com"),
  platzhalter("bunq", "Elite", "bunq.com"),
  platzhalter("bunq", "Free", "bunq.com"),
  platzhalter("bunq", "Pro", "bunq.com"),
  platzhalter("C24", "Max", "c24.de"),
  platzhalter("C24", "Plus", "c24.de"),
  platzhalter("C24", "Smart", "c24.de"),
  platzhalter("comdirect", "Girokonto Aktiv", "comdirect.de"),
  platzhalter("Commerzbank", "GiroKonto", "commerzbank.de"),
  platzhalter("Commerzbank", "KlassikKonto", "commerzbank.de"),
  platzhalter("Consorsbank", "Girokonto", "consorsbank.de"),
  platzhalter("Deutsche Bank", "AktivKonto", "deutsche-bank.de"),
  platzhalter("DKB", "Girokonto", "dkb.de"),
  platzhalter("EthikBank", "Girokonto", "ethikbank.de"),
  platzhalter("GLS Bank", "GLS Konto", "gls.de"),
  platzhalter("Hamburger Sparkasse", "HaspaJoker", "haspa.de"),
  platzhalter("HypoVereinsbank", "AktivKonto", "hypovereinsbank.de"),
  platzhalter("HypoVereinsbank", "HVB PlusKonto", "hypovereinsbank.de"),
  platzhalter("ING", "Girokonto", "ing.de"),
  platzhalter("ING", "Girokonto Future", "ing.de"),
  platzhalter("Klarna", "Guthaben", "klarna.com"),
  platzhalter("KT Bank", "KT GiroKonto", "kt-bank.de"),
  platzhalter("meine Bank", "MEIN Girokonto"),
  platzhalter("Monese", "Pay as you go", "monese.com"),
  platzhalter("N26", "Flex", "n26.com"),
  platzhalter("N26", "Girokonto Go", "n26.com"),
  platzhalter("N26", "Girokonto Metal", "n26.com"),
  platzhalter("N26", "Girokonto Smart", "n26.com"),
  platzhalter("N26", "Girokonto Standard", "n26.com"),
  platzhalter("Norisbank", "Girokonto Plus", "norisbank.de"),
  platzhalter("Norisbank", "Top-Girokonto", "norisbank.de"),
  platzhalter("Pax-Bank", "Pax-BCK Individuell", "pax-bank.de"),
  platzhalter("Postbank", "Giro pur", "postbank.de"),
  platzhalter("PSD Bank Nürnberg", "GiroDirekt", "psd-nuernberg.de"),
  platzhalter("Revolut", "Metal", "revolut.com"),
  platzhalter("Revolut", "Plus", "revolut.com"),
  platzhalter("Revolut", "Premium", "revolut.com"),
  platzhalter("Revolut", "Standard", "revolut.com"),
  platzhalter("Revolut", "Ultra", "revolut.com"),
  platzhalter("Santander", "BestGiro", "santander.de"),
  platzhalter("Targobank", "Online-Konto", "targobank.de"),
  platzhalter("Tomorrow", "Change", "tomorrow.one"),
  platzhalter("Tomorrow", "Now", "tomorrow.one"),
  platzhalter("Tomorrow", "Plus", "tomorrow.one"),
  platzhalter("Trade Republic", "Girokonto", "traderepublic.com"),
  platzhalter("UmweltBank", "UmweltGiro", "umweltbank.de"),
  platzhalter("Vivid", "Plus", "vivid.money"),
  platzhalter("Vivid", "Prime", "vivid.money"),
  platzhalter("Vivid", "Standard", "vivid.money"),
  platzhalter("Wise", "Konto", "wise.com"),
];

const alphabetisch = (a: RohAnbieter, b: RohAnbieter) =>
  `${a.name} ${a.produkt}`.localeCompare(`${b.name} ${b.produkt}`, "de", { sensitivity: "base" });

export const girokontoVergleich: RohAnbieter[] = [...anbieter].sort(alphabetisch);

export const GIRO_FILTER = [
  { key: "zinsfreiAbStart", label: "Zinsfrei ab Start" },
  { key: "keinDispoAbStart", label: "Kein Dispo ab Start" },
  { key: "karteOhneKredit", label: "Karte ohne Kredit" },
];
