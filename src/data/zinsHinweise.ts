import type { CheckStatus } from "@/components/vergleich/vergleichTypen";

/**
 * Was der Besucher tun oder lassen muss, damit kein Zins anfällt. HANDGEPFLEGT.
 *
 * Steht in Depot, Girokonto und Krypto beim aufgeklappten Angebot, nicht im Hauptvergleich
 * (Elias, 07.10.2026), und gehört zur Ampel „Ohne Zinsen nutzbar“. Jeder Satz folgt dem
 * Beleg des Angebots (`quellen.zinsfreiAbStart`) und gilt nur für die Ampelfarbe, für die er
 * geschrieben ist: Wechselt die Ampel nach einem neuen Datenlauf, verschwindet der Satz, statt
 * etwas Falsches zu sagen. Ein Angebot ohne Beleg bekommt keinen Satz.
 *
 * Ein Satz je Haus, bei Bedarf je Vergleich getrennt. Weicht ein einzelnes Angebot ab, steht es
 * unter `ANGEBOT` und geht dem Haus vor.
 */
export type ZinsKategorie = "depot" | "girokonto" | "krypto" | "geschaeftskonto";

type Hinweis = { bei: CheckStatus; satz: string };
type Eintrag = Hinweis | Partial<Record<ZinsKategorie, Hinweis>>;

const gut = (satz: string): Hinweis => ({ bei: "gut", satz });
const abschaltbar = (satz: string): Hinweis => ({ bei: "teils", satz });

/** Derselbe Satz für Depot, Girokonto und Krypto: für Häuser, die dort schon standen und im Geschäftskonto einen eigenen Satz brauchen. */
const dreiKategorien = (h: Hinweis): Partial<Record<ZinsKategorie, Hinweis>> => ({ depot: h, girokonto: h, krypto: h });

const NICHTS = "Du musst nichts einstellen.";

/**
 * Geschäftskonto, offene Häuser (VG2-04, Elias 23.11.2026): Der Anbieter schreibt zum Zins auf dem Hauptkonto nichts Ausdrückliches.
 * Das ist kein Urteil. Der Satz sagt, was der Anbieter bisher schreibt (Wortlaut und Quelle stehen in `quellen.zinsfreiAbStart` des
 * Tarifs), und dass wir nachfragen. Gilt nur, solange die Ampel auf "unbekannt" steht.
 */
const offen = (haus: string, was: string): Hinweis => ({
  bei: "unbekannt",
  satz: `Noch offen: Wir fragen bei ${haus} nach, ob das Konto ohne Zinsen läuft. ${was}`,
});
const ohneZins = (konto: string) => gut(`Dein Guthaben auf dem ${konto} wird nicht verzinst. ${NICHTS}`);
const nullProzent = (konto?: string) =>
  gut(`Dein Guthaben${konto ? ` auf dem ${konto}` : ""} hat 0 % Zinsen. ${NICHTS}`);

const HAUS: Record<string, Eintrag> = {
  /* Guthaben ohne Zins, nichts zu tun */
  "tradegate-direct": ohneZins("Verrechnungskonto"),
  "joe-broker": ohneZins("Verrechnungskonto"),
  flatex: nullProzent("Cash-Konto"),
  "finanzen-net-zero": {
    depot: nullProzent("Verrechnungskonto"),
    krypto: gut(`finanzen.net zero zahlt keine Zinsen aus. ${NICHTS}`),
  },
  maxblue: gut(`Das Depotkonto hat keine Verzinsung. ${NICHTS}`),
  degiro: gut(`Degiro zahlt keine Zinsen auf Guthaben, das du nicht angelegt hast. ${NICHTS}`),
  fidelity: nullProzent(),
  gls: {
    ...dreiKategorien(nullProzent()),
    geschaeftskonto: offen(
      "der GLS Bank",
      "Das Preisverzeichnis nennt für das GLS Konto Geschäft nur ein Einlagenentgelt von 0,00 %, einen Zinssatz für Guthaben nennt es nicht.",
    ),
  },
  plus500: gut(`Plus500 zahlt keine Zinsen auf dein Guthaben. ${NICHTS}`),
  libertex: gut(`Libertex zahlt keine Zinsen auf dein Guthaben. ${NICHTS}`),
  commerzbank: {
    depot: ohneZins("Girokonto oder Verrechnungskonto Plus"),
    girokonto: nullProzent("Girokonto"),
    geschaeftskonto: offen(
      "der Commerzbank",
      "Auf den Seiten der Commerzbank steht „3,75% p.a. Guthabenszins“. Gemeint ist ein eigenes Tagesgeldkonto, das du nach der Eröffnung selbst eröffnen müsstest: Eröffne es nicht. Zum Guthaben auf dem Geschäftskonto steht dort nichts.",
    ),
  },
  "pax-bank": {
    depot: ohneZins("Konto zum Depot"),
    girokonto: ohneZins("Girokonto"),
  },
  dkb: {
    depot: gut("Das Depot rechnet über dein DKB-Girokonto ab. Das Guthaben dort hat 0 % Zinsen."),
    girokonto: nullProzent("Girokonto"),
    geschaeftskonto: nullProzent("Geschäftskonto"),
  },
  bbbank: {
    depot: gut("Das Depot rechnet über dein BBBank-Girokonto ab. Das Guthaben dort wird nicht verzinst."),
    girokonto: ohneZins("Girokonto"),
  },
  targobank: {
    depot: gut("Das Depot rechnet über dein Girokonto ab. Wähle das Online-Konto: Dort gibt es keine Guthabenzinsen."),
    girokonto: gut(`Das Online-Konto hat keine Guthabenzinsen. ${NICHTS}`),
    geschaeftskonto: offen(
      "der Targobank",
      "Das Preisverzeichnis nennt für das Business-Konto nur Sollzinsen und keinen Guthabenzins. Zinsen gibt es auf dem eigenen Business-Tagesgeld-Konto: Eröffne es nicht.",
    ),
  },
  "geno-broker": gut(
    "GENO Broker verzinst dein Guthaben nicht. Das Verrechnungskonto führt deine Volksbank oder Raiffeisenbank: Frag dort, ob sie Guthaben verzinst.",
  ),
  "meine-bank": ohneZins("Girokonto"),
  postbank: {
    ...dreiKategorien(nullProzent("Girokonto")),
    geschaeftskonto: offen(
      "der Postbank",
      "In den AGB steht nur: „zur Verzinsung der Guthaben ist die Bank nicht verpflichtet“. Zinsen gibt es auf dem eigenen Business Tagesgeld: Eröffne es nicht.",
    ),
  },
  bforbank: ohneZins("Girokonto"),
  "berliner-volksbank": gut(
    "Über 30 Jahre wird dein Guthaben nicht verzinst. Von 18 bis 30 Jahren gibt es Zinsen nur für Mitglieder der Bank: Werde kein Mitglied.",
  ),
  sumup: gut(`SumUp verzinst dein Guthaben nicht. ${NICHTS}`),
  "deutsche-bank": {
    ...dreiKategorien(nullProzent("Girokonto")),
    geschaeftskonto: offen(
      "der Deutschen Bank",
      "Preisverzeichnis, Kontomodelle und AGB nennen keinen Guthabenzins für das Geschäftskonto. Zinsen gibt es auf dem eigenen Business Tagesgeld: Eröffne es nicht.",
    ),
  },
  hvb: {
    girokonto: gut(`Auf dem Girokonto gibt es keine Guthabenzinsen. ${NICHTS}`),
    geschaeftskonto: offen("der HypoVereinsbank", "Das Preisverzeichnis nennt für das BusinessKonto 4You keinen Zinssatz für Guthaben."),
  },
  monese: gut(`Monese zahlt keine Zinsen auf dein Guthaben. ${NICHTS}`),
  "kt-bank": gut(`Bei der KT Bank gibt es keine Zinsen. ${NICHTS}`),
  "psd-nuernberg": ohneZins("Girokonto"),
  umweltbank: ohneZins("Girokonto"),
  haspa: ohneZins("Girokonto"),
  ethikbank: {
    ...dreiKategorien(nullProzent("Girokonto")),
    geschaeftskonto: gut(
      "Dein Guthaben auf dem Geschäftskonto hat 0 % Zinsen. Das ZinskontoBusiness ist ein eigenes Konto: Eröffne es nicht.",
    ),
  },
  relai: gut(`In der Relai App gibt es keine Zinsen und kein Staking. ${NICHTS}`),
  "21bitcoin": gut(`21bitcoin verleiht deine Bitcoin nicht, Zinsen gibt es keine. ${NICHTS}`),

  /* Zinsen nur auf einem eigenen Konto: nicht eröffnen, nichts einzahlen */
  smartbroker: gut("Zinsen gibt es nur auf dem Zinskonto, das du eigens eröffnen müsstest. Eröffne es nicht."),
  scalable: {
    depot: gut("Dein Guthaben auf dem Verrechnungskonto hat 0 % Zinsen. Aktiviere das Tagesgeld nicht."),
    krypto: gut(
      "Dein Guthaben auf dem Verrechnungskonto hat 0 % Zinsen. Tagesgeld und Staking sind freiwillig: Nutze beides nicht.",
    ),
  },
  "scalable-prime": gut(
    "Auch mit Prime+ hat dein Guthaben auf dem Verrechnungskonto 0 % Zinsen. Aktiviere das Tagesgeld nicht.",
  ),
  consorsbank: {
    depot: gut(
      "Dein Guthaben auf dem Verrechnungskonto wird nicht verzinst. Das Tagesgeldkonto wird mit eröffnet: Lass es leer, dann fallen keine Zinsen an.",
    ),
    girokonto: ohneZins("Girokonto"),
  },
  comdirect: {
    depot: gut(
      "Dein Guthaben auf dem Verrechnungskonto wird nicht verzinst. Zinsen gibt es nur im Tagesgeld: Lege dort kein Geld an.",
    ),
    girokonto: gut("Zinsen gibt es nur im Tagesgeld, nicht auf dem Girokonto. Lege kein Geld ins Tagesgeld."),
  },
  "traders-place": gut(
    "Dein Guthaben auf dem Verrechnungskonto hat 0 % Zinsen. Zinsen gibt es nur auf dem Zinskonto: Eröffne es nicht.",
  ),
  sbroker: gut(
    "Dein Guthaben auf dem Verrechnungskonto hat 0 % Zinsen. Das KontoPlus ist ein eigenes Konto: Beantrage es nicht.",
  ),
  finvesto: gut(
    "Dein Guthaben auf dem Konto flex wird nicht verzinst. Tagesgeld und Festgeld sind eigene Konten: Eröffne sie nicht.",
  ),
  n26: {
    ...dreiKategorien(
      gut("Zinsen gibt es nur auf dem Tagesgeldkonto, das du in der App eigens eröffnen müsstest. Eröffne es nicht."),
    ),
    /* Geschäftskonto: AGB 2.5 „Für das Guthaben auf dem Konto erhältst du keine Zinsen.“ Ein Tagesgeldkonto ist dort nicht belegt, also nicht genannt. */
    geschaeftskonto: gut(`Dein Guthaben auf dem Konto wird nicht verzinst. ${NICHTS}`),
  },
  revolut: {
    /* Geschäftskonto: Business Terms Revolut Bank UAB ab 22.09.2026 „We do not pay interest on the deposits in your current account.“ */
    geschaeftskonto: gut("Auf dein Guthaben im Geschäftskonto zahlt Revolut keine Zinsen. Zinsen gibt es nur in einem Sparprodukt: Lege dort nichts an."),
    depot: gut(
      "Auf dein Guthaben im Hauptkonto zahlt Revolut keine Zinsen. Zinsen gibt es nur im Tagesgeldkonto: Zahle dort nichts ein.",
    ),
    girokonto: gut(
      "Auf dein Guthaben im Hauptkonto zahlt Revolut keine Zinsen. Zinsen gibt es nur im Tagesgeldkonto: Zahle dort nichts ein.",
    ),
    /* Läuft ab Start, abschaltbar */
    krypto: abschaltbar(
      "Staking läuft nach dem Kauf automatisch. Schalte in der App den Schalter „Auto-earn“ aus.",
    ),
  },
  vivid: {
    ...dreiKategorien(gut("Zinsen gibt es nur im Interest Rate Pocket, das du selbst anlegen müsstest. Lege es nicht an.")),
    geschaeftskonto: gut("Zinsen gibt es nur auf dem Zinskonto, das du selbst eröffnen müsstest. Eröffne es nicht."),
  },
  freedom24: gut("Zinsen laufen nur auf einem eigenen D-Konto. Eröffne es nicht."),
  "1822direkt": {
    girokonto: gut(
      "Das Tagesgeldkonto wird automatisch mit eröffnet. Zahle dort nichts ein, dann fallen keine Zinsen an.",
    ),
  },
  ing: {
    girokonto: gut("Zinsen gibt es nur auf dem Extra-Konto, einem eigenen Konto. Zahle dort nichts ein."),
    geschaeftskonto: gut("Zinsen gibt es nur auf dem Business Extra-Konto, einem eigenen Konto. Eröffne es nicht."),
  },
  klarna: gut("Zinsen gibt es nur mit einem Sparkonto, also Flexkonto oder Festgeld. Eröffne keines."),
  norisbank: gut("Zinsen gibt es nur auf dem Top-Zinskonto, einem eigenen Konto. Zahle dort nichts ein."),
  bunq: {
    ...dreiKategorien(gut("Zinsen gibt es nur auf Sparkonten, die du in der App selbst eröffnen müsstest. Eröffne keines.")),
    geschaeftskonto: offen(
      "bunq",
      "Die Geschäfts-AGB nennen Zinsen nur für Sparkonten, die du in der App selbst eröffnen müsstest: Eröffne keines. Zum Hauptkonto steht dort nichts.",
    ),
  },
  fyrst: {
    geschaeftskonto: offen(
      "FYRST",
      "In den AGB steht nur: „zur Verzinsung der Guthaben ist die Bank nicht verpflichtet“. Zinsen gibt es auf dem eigenen Tagesgeldkonto: Eröffne es nicht.",
    ),
  },
  holvi: {
    geschaeftskonto: offen(
      "Holvi",
      "Holvi nennt Zinsen nur für einen Geldmarktfonds, den du als GmbH oder UG selbst aktivieren müsstest: Aktiviere ihn nicht. Zum Guthaben auf dem Konto steht dort nichts.",
    ),
  },
  qonto: {
    geschaeftskonto: offen(
      "Qonto",
      "Der Rahmenvertrag sagt: „Ein positiver Saldo auf einem Girokonto des Kunden kann, wenn eine bestimmte Höhe überschritten wird, dazu führen, dass Qonto zusätzliche Kosten für die Kontoführung entstehen.“ Zinsen gibt es nur, wenn du selbst in einen Geldmarktfonds anlegst: Lege dort nichts an.",
    ),
  },
  kontist: {
    geschaeftskonto: offen(
      "Kontist",
      "Kontist und die Partnerbank Solaris nennen keinen Guthabenzins. Die Solaris schreibt ein Entgelt: „ein Verwahrentgelt i.H.v 0,5% p.a. auf die den Allgemeinen Freibetrag übersteigenden Einlagen“, bei Geschäftskunden ab 100.000 €.",
    ),
  },
  finom: {
    geschaeftskonto: offen(
      "Finom",
      "Für Solo, Basic und Smart steht kein Satz zu Zinsen auf dem Hauptkonto. Das Zinskonto ist ein eigenes Wallet, das du selbst eröffnen müsstest: Eröffne es nicht.",
    ),
  },
  tomorrow: gut(
    "Dein Guthaben auf dem Girokonto wird nicht verzinst. Zinsen gibt es nur auf dem Tagesgeldkonto: Eröffne es nicht.",
  ),

  /* Geschäftskonto-Vergleich (VG2, 23.11.2026): nur diese Häuser, jeder Satz aus dem Beleg in `geschaeftskontoVergleich.ts`. */
  tide: {
    geschaeftskonto: gut("Das Tagesgeldkonto wird automatisch mit eröffnet. Zahle dort nichts ein, dann fallen keine Zinsen an."),
  },
  lexware: { geschaeftskonto: gut(`Lexware zahlt keine Zinsen auf dein Guthaben. ${NICHTS}`) },
  accountable: { geschaeftskonto: gut(`Das Konto ist unverzinslich. ${NICHTS}`) },
  grenke: { geschaeftskonto: nullProzent("Geschäftskonto") },

  /* Zinsen, Staking oder Earn erst nach eigenem Einschalten: aus lassen */
  trading212: gut("Zinsen laufen erst, wenn du sie selbst aktivierst. Lass sie aus."),
  "trade-republic": gut("Zinsen laufen erst, wenn du sie in der App aktivierst. Lass sie aus."),
  justtrade: {
    depot: nullProzent(),
    krypto: gut("Dein Guthaben wird nicht verzinst. Staking läuft erst, wenn du es aktivierst: Lass es aus."),
  },
  bison: {
    depot: nullProzent(),
    krypto: gut("Staking läuft erst, wenn du Coins selbst dazu anmeldest. Tippe nicht auf „Jetzt staken“."),
  },
  etoro: {
    depot: gut(
      "Zinsen laufen erst, wenn du im Club-Dashboard den Schalter „Guthabenzinsen“ aktivierst. Lass ihn aus.",
    ),
    krypto: gut("Staking-Erträge gibt es erst, wenn du zustimmst. Stimme nicht zu."),
  },
  bitpanda: {
    depot: gut("Ertrag auf dein Euro-Guthaben gibt es nur mit Cash Plus. Lass die Schalter dafür aus."),
    /* Läuft ab Start, abschaltbar */
    krypto: abschaltbar(
      "Passive Earn läuft ab dem Start automatisch. Schalte es ab: Bitte den Kundensupport, es zu deaktivieren.",
    ),
  },
  finst: gut("Staking läuft erst, wenn du es in deinem Konto aktivierst. Lass es aus."),
  kraken: gut("Auto Earn läuft erst, wenn du es über die Schalter in den Kontoeinstellungen aktivierst. Lass sie aus."),
  bitvavo: gut("Erträge laufen erst, wenn du im Earn Hub „Staking aktivieren“ wählst. Lass es aus."),
  bsdex: gut("Staking läuft nur mit deiner Freigabe. Tippe im Pop-up in der App auf „Ablehnen“."),
  okx: gut("Auto Earn ist zum Start ausgeschaltet. Lass es aus."),
  binance: gut("Simple Earn läuft erst, wenn du es selbst einschaltest. Lass „Auto-Subscribe“ aus."),
  coinbase: gut("Zinsen und Prämien gibt es nur, wenn du sie selbst aktivierst. Lass sie aus."),
  bitget: gut("Erträge gibt es nur, wenn du ein Earn-Produkt abonnierst. Abonniere keines."),
  "crypto-com": gut("Erträge laufen erst, wenn du Coins selbst in „Crypto Earn“ anlegst. Lass es aus."),
  robinhood: gut("Staking und Zinsen auf Guthaben gibt es nur nach eigener Anmeldung. Melde dich für beides nicht an."),

  /* Läuft ab Start, abschaltbar */
  wise: {
    ...dreiKategorien(abschaltbar("Wise zahlt ab dem Start jeden Monat Cashback auf dein Guthaben. Melde dich davon ab: Das geht jederzeit.")),
    // Belegt mit Zins (Hilfe-Artikel, Wortlaut in `quellen.zinsfreiAbStart`). Ob es sich abschalten lässt, ist offen.
    geschaeftskonto: {
      bei: "schlecht",
      satz: "Wise zahlt laut Hilfe-Artikel jeden Monat Cashback auf dein Guthaben in EUR, GBP und USD. Ob du es abschalten kannst, ist offen.",
    },
  },
};

/** Ausnahme je Angebot, geht dem Haus vor. */
const ANGEBOT: Record<string, Eintrag> = {
  "bux-basic": gut(
    "BUX Basic hat 0 % Zinsen auf dein Guthaben. Bleib bei Basic: In BUX Plus und BUX Prime laufen Zinsen ab dem Start.",
  ),
};

/**
 * Achtung-Meldung für Depots, die Neukunden automatisch einen Kredit einräumen (`kreditAbStart` "teils").
 * Elias, 12.10.2026: "eine extra Meldung, die es normalerweise nicht gibt". Seit 07.11.2026 kostet der Kredit
 * keine Punkte mehr (`FAKTOR_KREDIT` 1), seit 15.11.2026 hält er das Depot auch nicht mehr von Platz 1 fern (Regel 6 in
 * `src/lib/rangfolge.ts`, Elias RN3-07).
 * Beleg: `quellen.kreditAbStart` des Angebots.
 */
/** Der belegte Teil: was das Haus tut und was der Besucher tun kann. */
const KREDIT_SACHE: Record<string, string> = {
  flatex:
    "flatex räumt dir mit dem Depot automatisch einen Kredit ein, Zinsen fallen nur an, wenn du ihn nutzt. Lehne ihn in Textform ab.",
};

/** Im Depot-Vergleich dazu der Grund für den Platz. */
// Bis 15.11.2026 stand hier der Grund, warum flatex nicht ganz vorn steht. Seit RN3-07 ist flatex unsere Nummer 1, der Satz nennt nur die Sache.
const ACHTUNG_KREDIT: Record<string, string> = {
  flatex: KREDIT_SACHE.flatex,
};

/**
 * Die Achtung-Meldung zum Angebot, oder nichts: nur mit Beleg. Im Depot-Vergleich mit dem Grund für den
 * Platz. Im Edelmetall-Vergleich gilt dieselbe Regel 6, dort steht nur die Sache: Die 22 Anlagen sind nicht
 * das Thema der Seite.
 */
export const kreditAchtung = (
  kategorie: string | undefined,
  angebot: { haus?: string; werte: Record<string, unknown>; quellen?: Record<string, { url?: string } | undefined> },
): string | undefined => {
  if (!angebot.haus || angebot.werte.kreditAbStart !== "teils" || !angebot.quellen?.kreditAbStart?.url) return undefined;
  if (kategorie === "depot") return ACHTUNG_KREDIT[angebot.haus];
  if (kategorie === "edelmetall") return KREDIT_SACHE[angebot.haus];
  return undefined;
};

/**
 * Die Kurzfassung sichtbar an Karte und Tabellenspalte, nicht erst in den Produktdetails (Elias SEO74: „Wir müssen
 * uns Flatex nochmal deutlicher angucken“). Ein Satz mit Handlung, Wortlaut aus demselben Beleg: „Ablehnung … in
 * Textform mitteilen“.
 */
const KREDIT_KURZ: Record<string, string> = {
  flatex: "Kredit ab Start dabei. Lehne ihn in Textform ab.",
};

export const kreditKurz = (
  kategorie: string | undefined,
  angebot: { haus?: string; werte: Record<string, unknown>; quellen?: Record<string, { url?: string } | undefined> },
): string | undefined =>
  kreditAchtung(kategorie, angebot) && angebot.haus ? KREDIT_KURZ[angebot.haus] : undefined;

/** Nur die Sache, ohne Grund für den Platz: für Texte, die der Rangfolge folgen und keinen Platz nennen (Depot-Ratgeber). */
export const kreditSache = (
  angebot: { haus?: string; werte: Record<string, unknown>; quellen?: Record<string, { url?: string } | undefined> },
): string | undefined => (kreditAchtung("depot", angebot) && angebot.haus ? KREDIT_SACHE[angebot.haus] : undefined);

/**
 * Girokonten, deren Landeseite beim Partner oben mit Zins wirbt (Elias PH3-02, 16.11.2026: „unser Flex, irgendwie
 * diese 200 €, diese ganzen Sachen weglassen. Dass die Leute nicht dieses Zinskonto eröffnen“, „bei mehr
 * Informationen das allererste“, „immer ganz klein irgendwo stehen“). Der lange Satz steht als erste Meldung in den
 * Produktdetails, der kurze klein an Karte, Tabelle und Nummer-1-Kasten.
 * Beleg norisbank (Abruf 15.11.2026, Vault raw/2026-11-15-anbieter-norisbank-landeseite-praemie-tagesgeld-beleg.md):
 * oben „200 € Prämie und 2,5% p.a. aufs Tagesgeld“; Bedingung der Prämie „Abschluss eines Top-Zinskontos (Tagesgeld)
 * bei gleichzeitigem Abschluss eines Top-Girokontos“; „Sie schließen das Tagesgeldkonto automatisch mit dem
 * Top-Girokonto ab“.
 */
const LANDESEITE: Record<string, { lang: string; kurz: string }> = {
  "norisbank-top-girokonto": {
    lang: "Auf der norisbank-Seite stehen oben 200 € Prämie und 2,5 % aufs Tagesgeld. Beides hängt am Tagesgeldkonto, das automatisch mit eröffnet wird: Zahl dort nichts ein.",
    kurz: "200 € Prämie und 2,5 % gelten fürs Tagesgeld. Zahl dort nichts ein.",
  },
};

/** Je Angebot, nicht je Haus: Das Girokonto plus führt auf eine andere Seite. */
export const landeseiteAchtung = (kategorie: string | undefined, angebot: { id: string }): string | undefined =>
  kategorie === "girokonto" ? LANDESEITE[angebot.id]?.lang : undefined;

export const landeseiteKurz = (kategorie: string | undefined, angebot: { id: string }): string | undefined =>
  kategorie === "girokonto" ? LANDESEITE[angebot.id]?.kurz : undefined;

/**
 * Verwahrentgelt auf hohe Guthaben im Geschäftskonto (VG2, 23.11.2026): ein Entgelt, kein Zins, aber für ein Geschäftskonto mit
 * großem Kontostand wichtig. Nur, wo es in der Preisliste steht.
 * N26: Preisliste (Version 4.5, 19.11.2026, https://docs.n26.com/legal/01+DE/01+Account/de/13account-pricelist-de.pdf): „Verwahrentgelt
 * für Kontoguthaben über 50.000€ 0,5% p.a.“ Lexware: Preis- und Leistungsverzeichnis der Partnerbank Solaris SE (Version 3.3, 08.08.2025):
 * 0,5 % p.a. ab einem Gesamtbetrag von mehr als 100.000 € bei Geschäftskunden; ob Lexware es erhebt, sagt Lexware nicht.
 */
const VERWAHRENTGELT: Record<string, string> = {
  n26: "In der N26-Preisliste steht ein Verwahrentgelt von 0,5 % im Jahr auf Guthaben über 50.000 €.",
  lexware: "In der Preisliste der Partnerbank Solaris steht ein Verwahrentgelt von 0,5 % im Jahr auf Guthaben über 100.000 €.",
};

export const verwahrAchtung = (kategorie: string | undefined, angebot: { haus?: string }): string | undefined =>
  kategorie === "geschaeftskonto" && angebot.haus ? VERWAHRENTGELT[angebot.haus] : undefined;

export const ALLE_ACHTUNG_SAETZE: string[] = [
  ...Object.values(VERWAHRENTGELT),
  ...Object.values(ACHTUNG_KREDIT),
  ...Object.values(KREDIT_SACHE),
  ...Object.values(KREDIT_KURZ),
  ...Object.values(LANDESEITE).flatMap((l) => [l.lang, l.kurz]),
];

const istHinweis = (e: Eintrag): e is Hinweis => "satz" in e;

/** Der Satz zum Angebot, oder nichts: ohne Beleg, in anderen Vergleichen und bei anderer Ampelfarbe. */
export const zinsHinweis = (
  kategorie: string | undefined,
  angebot: { id: string; haus?: string; werte: Record<string, unknown> },
): string | undefined => {
  if (kategorie !== "depot" && kategorie !== "girokonto" && kategorie !== "krypto" && kategorie !== "geschaeftskonto") return undefined;
  const eintrag = ANGEBOT[angebot.id] ?? (angebot.haus ? HAUS[angebot.haus] : undefined);
  if (!eintrag) return undefined;
  // Im Geschäftskonto gilt nur ein eigener Satz: Die Sätze der anderen Vergleiche (Tagesgeld in der App, Pocket) passen dort nicht.
  const hinweis = istHinweis(eintrag) ? (kategorie === "geschaeftskonto" ? undefined : eintrag) : eintrag[kategorie];
  return hinweis && hinweis.bei === angebot.werte.zinsfreiAbStart ? hinweis.satz : undefined;
};

const ALLE_HINWEISE: Hinweis[] = [...Object.values(HAUS), ...Object.values(ANGEBOT)].flatMap((e) => (istHinweis(e) ? [e] : Object.values(e)));

/** Alle Sätze zu grün und gelb, für den Test auf Wörter, die nur in die Recherche gehören, und auf die Länge. */
export const ALLE_ZINS_SAETZE: string[] = ALLE_HINWEISE.filter((h) => h.bei === "gut" || h.bei === "teils").map((h) => h.satz);

/**
 * Die Sätze zu „Offen“ (Anbieter schreibt nichts Ausdrückliches) und zu rot (Anbieter zahlt Zinsen) im Geschäftskonto (VG2-04). Sie sagen, was
 * der Anbieter bisher schreibt, und sind deshalb länger als die Sätze zu grün. Dieselben verbotenen Wörter gelten, die Längengrenze nicht.
 */
export const ALLE_OFFENEN_SAETZE: string[] = ALLE_HINWEISE.filter((h) => h.bei === "unbekannt" || h.bei === "schlecht").map((h) => h.satz);
