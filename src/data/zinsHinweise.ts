import type { CheckStatus } from "@/components/vergleich/vergleichTypen";

/**
 * Was der Besucher tun oder lassen muss, damit kein Zins anfällt. HANDGEPFLEGT.
 *
 * Steht in Depot, Girokonto und Krypto unter der Ampel „Ohne Zinsen nutzbar“. Jeder Satz folgt dem
 * Beleg des Angebots (`quellen.zinsfreiAbStart`) und gilt nur für die Ampelfarbe, für die er
 * geschrieben ist: Wechselt die Ampel nach einem neuen Datenlauf, verschwindet der Satz, statt
 * etwas Falsches zu sagen. Ein Angebot ohne Beleg bekommt keinen Satz.
 *
 * Ein Satz je Haus, bei Bedarf je Vergleich getrennt. Weicht ein einzelnes Angebot ab, steht es
 * unter `ANGEBOT` und geht dem Haus vor.
 */
export type ZinsKategorie = "depot" | "girokonto" | "krypto";

type Hinweis = { bei: CheckStatus; satz: string };
type Eintrag = Hinweis | Partial<Record<ZinsKategorie, Hinweis>>;

const gut = (satz: string): Hinweis => ({ bei: "gut", satz });
const abschaltbar = (satz: string): Hinweis => ({ bei: "teils", satz });

const NICHTS = "Du musst nichts einstellen.";
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
  gls: nullProzent(),
  plus500: gut(`Plus500 zahlt keine Zinsen auf dein Guthaben. ${NICHTS}`),
  libertex: gut(`Libertex zahlt keine Zinsen auf dein Guthaben. ${NICHTS}`),
  commerzbank: {
    depot: ohneZins("Girokonto oder Verrechnungskonto Plus"),
    girokonto: nullProzent("Girokonto"),
  },
  "pax-bank": {
    depot: ohneZins("Konto zum Depot"),
    girokonto: ohneZins("Girokonto"),
  },
  dkb: {
    depot: gut("Das Depot rechnet über dein DKB-Girokonto ab. Das Guthaben dort hat 0 % Zinsen."),
    girokonto: nullProzent("Girokonto"),
  },
  bbbank: {
    depot: gut("Das Depot rechnet über dein BBBank-Girokonto ab. Das Guthaben dort wird nicht verzinst."),
    girokonto: ohneZins("Girokonto"),
  },
  targobank: {
    depot: gut("Das Depot rechnet über dein Girokonto ab. Wähle das Online-Konto: Dort gibt es keine Guthabenzinsen."),
    girokonto: gut(`Das Online-Konto hat keine Guthabenzinsen. ${NICHTS}`),
  },
  "geno-broker": gut(
    "GENO Broker verzinst dein Guthaben nicht. Das Verrechnungskonto führt deine Volksbank oder Raiffeisenbank: Frag dort, ob sie Guthaben verzinst.",
  ),
  "meine-bank": ohneZins("Girokonto"),
  postbank: nullProzent("Girokonto"),
  bforbank: ohneZins("Girokonto"),
  "berliner-volksbank": gut(
    "Über 30 Jahre wird dein Guthaben nicht verzinst. Von 18 bis 30 Jahren gibt es Zinsen nur für Mitglieder der Bank: Werde kein Mitglied.",
  ),
  sumup: gut(`SumUp verzinst dein Guthaben nicht. ${NICHTS}`),
  "deutsche-bank": nullProzent("Girokonto"),
  hvb: { girokonto: gut(`Auf dem Girokonto gibt es keine Guthabenzinsen. ${NICHTS}`) },
  monese: gut(`Monese zahlt keine Zinsen auf dein Guthaben. ${NICHTS}`),
  "kt-bank": gut(`Bei der KT Bank gibt es keine Zinsen. ${NICHTS}`),
  "psd-nuernberg": ohneZins("Girokonto"),
  umweltbank: ohneZins("Girokonto"),
  haspa: ohneZins("Girokonto"),
  ethikbank: nullProzent("Girokonto"),
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
  n26: gut("Zinsen gibt es nur auf dem Tagesgeldkonto, das du in der App eigens eröffnen müsstest. Eröffne es nicht."),
  revolut: {
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
  vivid: gut("Zinsen gibt es nur im Interest Rate Pocket, das du selbst anlegen müsstest. Lege es nicht an."),
  freedom24: gut("Zinsen laufen nur auf einem eigenen D-Konto. Eröffne es nicht."),
  "1822direkt": {
    girokonto: gut(
      "Das Tagesgeldkonto wird automatisch mit eröffnet. Zahle dort nichts ein, dann fallen keine Zinsen an.",
    ),
  },
  ing: { girokonto: gut("Zinsen gibt es nur auf dem Extra-Konto, einem eigenen Konto. Zahle dort nichts ein.") },
  klarna: gut("Zinsen gibt es nur mit einem Sparkonto, also Flexkonto oder Festgeld. Eröffne keines."),
  norisbank: gut("Zinsen gibt es nur auf dem Top-Zinskonto, einem eigenen Konto. Zahle dort nichts ein."),
  bunq: gut("Zinsen gibt es nur auf Sparkonten, die du in der App selbst eröffnen müsstest. Eröffne keines."),
  tomorrow: gut(
    "Dein Guthaben auf dem Girokonto wird nicht verzinst. Zinsen gibt es nur auf dem Tagesgeldkonto: Eröffne es nicht.",
  ),

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
  wise: abschaltbar(
    "Wise zahlt ab dem Start jeden Monat Cashback auf dein Guthaben. Melde dich davon ab: Das geht jederzeit.",
  ),
};

/** Ausnahme je Angebot, geht dem Haus vor. */
const ANGEBOT: Record<string, Eintrag> = {
  "bux-basic": gut(
    "BUX Basic hat 0 % Zinsen auf dein Guthaben. Bleib bei Basic: In BUX Plus und BUX Prime laufen Zinsen ab dem Start.",
  ),
};

const istHinweis = (e: Eintrag): e is Hinweis => "satz" in e;

/** Der Satz zum Angebot, oder nichts: ohne Beleg, in anderen Vergleichen und bei anderer Ampelfarbe. */
export const zinsHinweis = (
  kategorie: string | undefined,
  angebot: { id: string; haus?: string; werte: Record<string, unknown> },
): string | undefined => {
  if (kategorie !== "depot" && kategorie !== "girokonto" && kategorie !== "krypto") return undefined;
  const eintrag = ANGEBOT[angebot.id] ?? (angebot.haus ? HAUS[angebot.haus] : undefined);
  if (!eintrag) return undefined;
  const hinweis = istHinweis(eintrag) ? eintrag : eintrag[kategorie];
  return hinweis && hinweis.bei === angebot.werte.zinsfreiAbStart ? hinweis.satz : undefined;
};

/** Alle Sätze, für den Test auf Wörter, die nur in die Recherche gehören. */
export const ALLE_ZINS_SAETZE: string[] = [...Object.values(HAUS), ...Object.values(ANGEBOT)].flatMap((e) =>
  istHinweis(e) ? [e.satz] : Object.values(e).map((h) => h.satz),
);
