/**
 * Anbieterdaten fuer den Depot-Vergleich.
 *
 * WICHTIG: Hier stehen ausschließlich gepruefte Angaben. Alles, was noch nicht
 * recherchiert ist, bleibt auf `null` bzw. Status "unbekannt" und wird auf der
 * Seite als "noch nicht geprueft" in Grau ausgegeben. Bitte keine Schaetzungen
 * eintragen.
 */

/** Ampel-Status eines Halal-Merkmals. "unbekannt" = noch nicht geprueft. */
export type CheckStatus = "unbekannt" | "gut" | "teils" | "schlecht";

export type HalalCheck = {
  status: CheckStatus;
  /** Kurzer Zusatz, z. B. "geprueft". Leer lassen, wenn unbekannt. */
  note?: string;
};

export type Broker = {
  id: string;
  name: string;
  /** Pfad/URL des Logos, sobald vorhanden. */
  logo?: string;
  /** Domain für das Logo bei Logo.dev. Ohne sie steht dort das Kürzel. */
  domain?: string;
  /** Nur setzen, wenn eine Partnerschaft besteht. Sonst Knopf ausgegraut. */
  link?: string;
  halal: {
    keinGuthabenzins: HalalCheck;
    keinWertpapierkredit: HalalCheck;
    keineHebelprodukte: HalalCheck;
    islamicEtfs: HalalCheck;
  };
  konditionen: {
    depotgebuehr: string | null;
    orderkosten: string | null;
    sparplanKosten: string | null;
    zinsenGuthaben: string | null;
    wertpapierkredit: string | null;
    hebelprodukte: string | null;
    islamicEtfsBesparbar: string | null;
  };
  /** true, wenn Sparplan bestaetigt moeglich ist. null = noch nicht geprueft. */
  sparplanMoeglich: boolean | null;
};

const offen: HalalCheck = { status: "unbekannt" };

const leereKonditionen: Broker["konditionen"] = {
  depotgebuehr: null,
  orderkosten: null,
  sparplanKosten: null,
  zinsenGuthaben: null,
  wertpapierkredit: null,
  hebelprodukte: null,
  islamicEtfsBesparbar: null,
};

const slug = (name: string) =>
  name
    .toLowerCase()
    .replace(/\+/g, "-plus")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const platzhalter = (name: string, domain?: string): Broker => ({
  id: slug(name),
  name,
  domain,
  halal: {
    keinGuthabenzins: offen,
    keinWertpapierkredit: offen,
    keineHebelprodukte: offen,
    islamicEtfs: offen,
  },
  konditionen: { ...leereKonditionen },
  sparplanMoeglich: null,
});

const weitereAnbieter: Array<[string, string | undefined]> = [
  ["Trade Republic", "traderepublic.com"],
  ["Traders Place", "tradersplace.de"],
  ["Smartbroker+", "smartbroker.de"],
  ["finanzen.net zero", "finanzen.net"],
  ["Trading 212", "trading212.com"],
  ["comdirect", "comdirect.de"],
  ["ING", "ing.de"],
  ["Consorsbank", "consorsbank.de"],
  ["DKB", "dkb.de"],
  ["S-Broker", "sbroker.de"],
  ["flatex", "flatex.de"],
  ["Bitpanda", "bitpanda.com"],
  ["N26", "n26.com"],
  ["justTRADE", "justtrade.com"],
  ["1822direkt", "1822direkt.de"],
  ["Targobank", "targobank.de"],
  ["maxblue", "maxblue.de"],
  ["Commerzbank", "commerzbank.de"],
  ["Postbank", "postbank.de"],
  ["Tradegate Direct", "tradegate.de"],
  ["finvesto", "finvesto.de"],
  ["Fidelity Fondsdepot", "fidelity.de"],
  ["JOE Broker", "joebroker.de"],
  ["Revolut", "revolut.com"],
  ["Vivid", "vivid.money"],
  ["XTB", "xtb.com"],
  ["eToro", "etoro.com"],
  ["CapTrader", "captrader.com"],
  ["LYNX", "lynxbroker.de"],
  ["Bison", "bisonapp.com"],
];

const scalable: Broker = {
  ...platzhalter("Scalable Capital", "scalable.capital"),
    link: "/out/scalable",
  halal: {
    // Geprueft: das Verrechnungskonto zahlt keine Zinsen.
    keinGuthabenzins: { status: "gut", note: "geprüft" },
    keinWertpapierkredit: offen,
    keineHebelprodukte: offen,
    islamicEtfs: offen,
  },
};

export const brokerVergleich: Broker[] = [
  scalable,
  ...weitereAnbieter.map(([name, domain]) => platzhalter(name, domain)),
];

export const HALAL_KRITERIEN = [
  {
    key: "keinGuthabenzins" as const,
    label: "Kein Guthabenzins",
    frage: "Zahlt das Verrechnungskonto Zinsen, und lässt sich das abschalten?",
  },
  {
    key: "keinWertpapierkredit" as const,
    label: "Kein Wertpapierkredit",
    frage: "Wird ein Wertpapierkredit oder Dispo automatisch eingeräumt?",
  },
  {
    key: "keineHebelprodukte" as const,
    label: "Keine Hebelprodukte",
    frage: "Bietet der Broker Hebelprodukte und CFDs an?",
  },
  {
    key: "islamicEtfs" as const,
    label: "Islamic ETFs",
    frage: "Sind sharia-konforme ETFs handelbar und besparbar?",
  },
];
