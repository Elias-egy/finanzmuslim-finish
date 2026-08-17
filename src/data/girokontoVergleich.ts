/**
 * Anbieterdaten fuer den Girokonto-Vergleich.
 *
 * Aufbau bewusst wie `brokerVergleich.ts`: Anbieter und Logos stehen fest,
 * jede inhaltliche Angabe ist `null` und wird auf der Seite woertlich als
 * "noch nicht geprueft" ausgegeben. Zum Fuellen nur die Felder ersetzen, an
 * der Seite ist dafuer nichts zu aendern.
 *
 * WICHTIG: keine Schaetzungen eintragen. Eine Zahl kommt hier erst rein,
 * wenn sie beim Anbieter selbst nachgelesen wurde, zusammen mit dem Datum
 * in `stand`.
 */

/** Ampel-Status eines Halal-Merkmals. "unbekannt" = noch nicht geprueft. */
export type CheckStatus = "unbekannt" | "gut" | "teils" | "schlecht";

export type HalalCheck = {
  status: CheckStatus;
  /** Kurzer Zusatz, z. B. "geprueft". Leer lassen, wenn unbekannt. */
  note?: string;
};

export type Girokonto = {
  id: string;
  /** Name der Bank, steht in der Kopfzeile der Karte. */
  name: string;
  /** Name des Kontomodells, steht klein darunter. */
  produkt: string;
  /** Domain fuer das Logo. Ohne sie steht dort das Kuerzel. */
  domain?: string;
  /** Nur setzen, wenn eine Partnerschaft besteht. Sonst Knopf ausgegraut. */
  link?: string;
  /** Datum der letzten Pruefung. Bleibt leer, solange nichts geprueft ist. */
  stand?: string;
  halal: {
    keinGuthabenzins: HalalCheck;
    keinDispo: HalalCheck;
    karteOhneKreditrahmen: HalalCheck;
    keineZinsbindung: HalalCheck;
  };
  konditionen: {
    kontofuehrung: string | null;
    girocard: string | null;
    debitkarte: string | null;
    bargeld: string | null;
    mindestgeldeingang: string | null;
    dispozins: string | null;
    guthabenzins: string | null;
  };
};

const offen: HalalCheck = { status: "unbekannt" };

const leereKonditionen: Girokonto["konditionen"] = {
  kontofuehrung: null,
  girocard: null,
  debitkarte: null,
  bargeld: null,
  mindestgeldeingang: null,
  dispozins: null,
  guthabenzins: null,
};

const slug = (name: string) =>
  name
    .toLowerCase()
    .replace(/\+/g, "-plus")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const platzhalter = (name: string, produkt: string, domain?: string): Girokonto => ({
  id: slug(`${name} ${produkt}`),
  name,
  produkt,
  domain,
  halal: {
    keinGuthabenzins: offen,
    keinDispo: offen,
    karteOhneKreditrahmen: offen,
    keineZinsbindung: offen,
  },
  konditionen: { ...leereKonditionen },
});

/**
 * Die Anbieter selbst sind belegt, alles andere nicht. Ausgewaehlt sind die
 * Banken, die in Deutschland ein kostenloses oder guenstiges Girokonto ohne
 * Filialpflicht fuehren. Ob eines davon ohne Zinsgeschaeft auskommt, steht
 * hier ausdruecklich noch nicht.
 */
export const girokontoVergleich: Girokonto[] = [
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

/**
 * Die vier Fragen, die ein Girokonto fuer einen Muslim entscheiden. Sie
 * stehen bewusst vor den Gebuehren: ein guenstiges Konto mit Dispo nutzt
 * niemandem, der keinen Dispo will.
 */
export const GIRO_KRITERIEN = [
  {
    key: "keinGuthabenzins" as const,
    label: "Kein Guthabenzins",
    frage: "Zahlt die Bank Zinsen auf das Guthaben, und lässt sich das abschalten?",
  },
  {
    key: "keinDispo" as const,
    label: "Kein Dispo",
    frage: "Wird ein Dispokredit automatisch eingeräumt, oder nur auf Antrag?",
  },
  {
    key: "karteOhneKreditrahmen" as const,
    label: "Karte ohne Kreditrahmen",
    frage: "Ist die Karte eine echte Debitkarte, oder hängt ein Kreditrahmen daran?",
  },
  {
    key: "keineZinsbindung" as const,
    label: "Kein Zinsprodukt im Konto",
    frage: "Ist ein Tagesgeld oder Sparbereich mit Zins fest mit dem Konto verbunden?",
  },
];

/** Die Zeilen der Konditionstabelle, in dieser Reihenfolge. */
export const GIRO_KONDITIONEN = [
  { key: "kontofuehrung" as const, label: "Kontoführung im Monat" },
  { key: "girocard" as const, label: "Girocard im Monat" },
  { key: "debitkarte" as const, label: "Debitkarte im Monat" },
  { key: "bargeld" as const, label: "Bargeld abheben" },
  { key: "mindestgeldeingang" as const, label: "Mindestgeldeingang" },
  { key: "dispozins" as const, label: "Dispozins" },
  { key: "guthabenzins" as const, label: "Guthabenzins" },
];

export const girokontoById = (id: string) => girokontoVergleich.find((g) => g.id === id);
