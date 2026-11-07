import { dealsFinanzfluss } from "./dealsFinanzfluss";

/**
 * Hier werden alle aktiven Deals gepflegt.
 * Neue Angebote nur hier eintragen; die Seite rendert sie automatisch.
 */

export interface Deal {
  /** Kurzname des Anbieters, lesbar */
  anbieter: string;
  /** Titel der Aktion */
  titel: string;
  /** Kurze Beschreibung des Vorteils */
  vorteil: string;
  /** Gutscheincode, falls vorhanden */
  gutscheincode?: string;
  /** Bedingungen in Kurzform */
  bedingungen: string;
  /** Verweis auf src/data/partnerLinks.ts */
  partnerKurzname?: string;
  /** ISO-Datum, bis wann der Deal läuft */
  gueltigBis?: string;
  /**
   * Bonus in Euro, den ein Neukunde bekommt. Nur eintragen, wenn der Betrag auf
   * der Seite des Anbieters steht. Der geführte Vergleich zeigt daraus oben
   * "Bonus für dich bis zu ...".
   */
  betrag?: number;
  /** "Bis 200 €": der volle Betrag hängt an Bedingungen. */
  bisZu?: boolean;
  /** Eigener Text fürs Schild, wenn der Bonus kein Euro-Guthaben ist, z. B. "20 € in BTC". */
  schild?: string;
  /** `id` der Anbieter aus den Vergleichsdateien, für die der Deal gilt, z. B. "dkb-girokonto". */
  anbieterIds?: string[];
  /** Wo der Betrag steht, mit Abrufdatum TT.MM.JJJJ. Pflicht, sobald `betrag` gesetzt ist. */
  quelle?: { url: string; stand: string };
  /** Bereich für den Filter auf /deals. Fest eingetragen, weil Anbieter-IDs über Vergleiche hinweg doppelt vorkommen. */
  bereich?: DealBereich;
}

export type DealBereich = "depot" | "girokonto" | "krypto";

/**
 * Nur Boni, die beim Anbieter selbst nachgeprüft sind (Quelle ist dessen Seite).
 * Elias, 20.09.2026: "Laut Finanzfluss ist keine Quelle." `dealsFinanzfluss.ts` ist
 * deshalb nur noch die Prüfliste: welche Aktionen es laut Finanzfluss gibt. Ein Bonus
 * wandert erst hierher, wenn er beim Anbieter bestätigt ist.
 */
export const deals: Deal[] = [
  // CV16F H1, 07.11.2026: nur Boni, die über unseren eigenen Partnerlink gelten (Zielseite des Links
  // gelesen), nie an ein Zinsprodukt gebunden. Weggelassen: norisbank (200 € nur mit Tagesgeld-Abschluss),
  // Traders Place (Elias: „nur mit Zinsen“), Smartbroker+ (80 € nur über die Finanzfluss-Seite),
  // Postbank (keine Prämie beim Anbieter), ING und Commerzbank (kein Partnerlink), 1822direkt (Konto nicht
  // zinsfrei ab Start). Quelle: Vault hermes/funnel-pruefung/BENCHMARK-FINANZFLUSS.md H1, Belege im Laufzettel cv17.
  {
    anbieter: "comdirect Girokonto Aktiv",
    titel: "250 € Prämie",
    vorteil: "Eröffne das Girokonto Aktiv bei comdirect: Du bekommst 250 € Prämie.",
    bedingungen:
      "Laut comdirect: Einwilligung in Werbung per E-Mail und in den ersten 3 Monaten mindestens 5 Zahlungen über je 25 €. Aktion bis 23.11.2026.",
    betrag: 250,
    gueltigBis: "2026-11-23",
    partnerKurzname: "comdirect-girokonto",
    anbieterIds: ["comdirect-girokonto-aktiv"],
    bereich: "girokonto",
    quelle: { url: "https://www.comdirect.de/cms/lp/giro_praemie_media_wm250-aff.html", stand: "07.11.2026" },
  },
  {
    anbieter: "Consorsbank Girokonto",
    titel: "200 € Prämie",
    vorteil: "Eröffne das Girokonto bei der Consorsbank: Du bekommst 200 € Prämie.",
    bedingungen:
      "Laut Consorsbank: drei Monate je mindestens 1.500 € Geldeingang von einer anderen Bank und Einwilligung in E-Mail-Werbung. Antrag bis 31.01.2027.",
    betrag: 200,
    gueltigBis: "2027-01-31",
    partnerKurzname: "consorsbank-girokonto",
    anbieterIds: ["consorsbank-girokonto"],
    bereich: "girokonto",
    quelle: { url: "https://aktionen.consorsbank.de/girokonto", stand: "07.11.2026" },
  },
  {
    anbieter: "comdirect Depot",
    titel: "Bis zu 150 € Prämie",
    vorteil: "Eröffne ein Depot bei comdirect: 100 € Prämie, dazu 50 €, wenn dein erster Sparplan läuft.",
    bedingungen:
      "Laut comdirect: 100 € mit Einwilligung in Werbung per E-Mail, 50 € für einen Sparplan in den ersten 3 Monaten. Aktion bis 28.02.2027.",
    betrag: 150,
    bisZu: true,
    gueltigBis: "2027-02-28",
    partnerKurzname: "comdirect-depot",
    anbieterIds: ["comdirect-depot"],
    bereich: "depot",
    quelle: { url: "https://www.comdirect.de/cms/lp/depot_affiliate_lang.html", stand: "07.11.2026" },
  },
  {
    anbieter: "UmweltBank UmweltGiro",
    titel: "100 € Startguthaben",
    vorteil: "Eröffne das Girokonto der UmweltBank: Du bekommst 100 €, dazu gehen 50 € an den NABU.",
    bedingungen:
      "Laut UmweltBank: in den ersten drei Monaten mindestens ein Gehalts- oder Renteneingang (auch BAföG, Kindergeld).",
    betrag: 100,
    partnerKurzname: "umweltbank",
    anbieterIds: ["umweltbank-umweltgiro"],
    bereich: "girokonto",
    quelle: { url: "https://www.umweltbank.de/konto-karte/praemie/", stand: "07.11.2026" },
  },
  {
    anbieter: "BBBank BetterSmart",
    titel: "50 € Startprämie",
    vorteil: "Eröffne das Konto BetterSmart: Als Neukunde bekommst du 50 € Startprämie.",
    bedingungen:
      "Laut BBBank: Neukunde, in den letzten 24 Monaten kein Girokonto bei der BBBank.",
    betrag: 50,
    partnerKurzname: "bbbank-bettersmart",
    anbieterIds: ["bbbank-bettersmart"],
    bereich: "girokonto",
    quelle: { url: "https://www.bbbank.de/privatkunden/girokonto.html", stand: "07.11.2026" },
  },
];

/** Prüfliste, wird nicht angezeigt. */
export const dealsZuPruefen = dealsFinanzfluss;

/** Ein Abruf gilt 21 Tage. Danach verschwindet der Bonus, bis neu abgerufen wurde. */
export const FRISCH_TAGE = 21;

const heute = () => new Date().toISOString().slice(0, 10);

const tageSeit = (stand: string, heute: string) => {
  const [t, m, j] = stand.split(".").map(Number);
  return (Date.parse(heute) - Date.UTC(j, m - 1, t)) / 86_400_000;
};

const laeuft = (d: Deal, tag: string) =>
  !!d.betrag && !!d.quelle && (!d.gueltigBis || d.gueltigBis >= tag) && tageSeit(d.quelle.stand, tag) <= FRISCH_TAGE;

/** Was /deals zeigt: laufend, beim Anbieter belegt, höchster Betrag zuerst. */
export const laufendeDeals = (tag: string = heute(), liste: Deal[] = deals): Deal[] =>
  liste.filter((d) => laeuft(d, tag)).sort((a, b) => b.betrag! - a.betrag!);

/** Text fürs Schild: "bis zu 200 € Bonus", "20 € in BTC", "120 € Bonus". */
export const schildText = (d: Deal) =>
  d.schild ?? `${d.bisZu ? "bis zu " : ""}${d.betrag!.toLocaleString("de-DE")} € Bonus`;

/** Höchster belegter Bonus unter den genannten Anbietern. Abgelaufene Deals zählen nicht. */
export const hoechsterBonus = (anbieterIds: Set<string>, heute: string, liste: Deal[] = deals): number =>
  liste
    .filter((d) => laeuft(d, heute))
    .filter((d) => d.anbieterIds?.some((id) => anbieterIds.has(id)))
    .reduce((max, d) => Math.max(max, d.betrag!), 0);


/** Der laufende, belegte Deal eines Anbieters, sonst null. Gibt es mehrere, gewinnt der höchste Betrag. */
export const dealFuer = (anbieterId: string, liste: Deal[] = deals, tag: string = heute()): Deal | null =>
  liste
    .filter((d) => laeuft(d, tag) && d.anbieterIds?.includes(anbieterId))
    .sort((a, b) => b.betrag! - a.betrag!)[0] ?? null;
