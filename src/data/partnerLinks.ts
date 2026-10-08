// Hier werden alle Partnerlinks gepflegt.
// Neue Partner nur hier eintragen, niemals direkt auf einer Inhaltsseite verlinken.
//
// Jeder Partner hat eine eigene Startseite unter /dein-investmentstart/<kurzname>
// (Scalable: /dein-investmentstart). /out/<kurzname> leitet dorthin weiter, der
// eigentliche Affiliate-Link steht nur auf der Startseite ("Mitnahme statt
// Direktlink"). Inhalte der Startseiten: src/data/investmentStart.ts.
//
// Netzwerk FinanceQuality (neqty), Partner-ID 8507, Projekt finanz.muslim 51087.
// Links am 15.09.2026 aus dem Portal (Werbemittel, Textlink) geholt und per
// Weiterleitung gegen die Zielseite geprüft.
//
// Netzwerk financeAds, Partner 64685, Werbeflaeche 87591 (finanzmuslim.com).
// Teilnahmebedingungen: keine Sub-IDs zur Verknuepfung von Besucherdaten, keine
// Links in Direktnachrichten. Links hier deshalb ohne {SUBID}.
//
// Netzwerk Awin, Publisher-ID 3099915 (finanzmuslim). Standard-Link
// https://www.awin1.com/cread.php?awinmid=<Programm>&awinaffid=3099915.

export type PartnerLink = {
  kurzname: string;
  anbieter: string;
  ziel: string;
  aktiv: boolean;
  notiz: string;
};

export const partnerLinks: PartnerLink[] = [
  {
    kurzname: "kraken",
    anbieter: "Kraken",
    ziel: "/dein-investmentstart/kraken",
    aktiv: true,
    notiz: "MCANISM, Angebot 2906, Textlink Default. Werbeflaeche finanzmuslim.com (AdSpace 2016).",
  },
  {
    kurzname: "scalable",
    anbieter: "Scalable Capital",
    ziel: "/dein-investmentstart",
    aktiv: true,
    notiz: "Fuehrt bewusst auf die interne Seite. Der Affiliate-Deeplink liegt in investmentStart.ts.",
  },
  {
    kurzname: "traders-place",
    anbieter: "Traders Place",
    ziel: "/dein-investmentstart/traders-place",
    aktiv: true,
    notiz: "FinanceQuality, Kampagne 1981, Werbemittel 23712 (Textlink Home).",
  },
  {
    kurzname: "scalable-krypto",
    anbieter: "Scalable Capital",
    ziel: "/dein-investmentstart/scalable-krypto",
    aktiv: true,
    notiz: "Gleicher Partnerlink wie scalable (Broker). Krypto laeuft bei Scalable als ETPs im Scalable Broker (de.scalable.capital/kryptowaehrung, 27.09.2026).",
  },
  {
    kurzname: "traders-place-krypto",
    anbieter: "Traders Place",
    ziel: "/dein-investmentstart/traders-place-krypto",
    aktiv: true,
    notiz: "Gleicher Partnerlink wie traders-place (FinanceQuality 23712). Krypto-Wallet ist Teil des Depots (tradersplace.de/angebot/uebersicht/kryptowerte, 27.09.2026).",
  },
  {
    kurzname: "dkb-depot",
    anbieter: "DKB",
    ziel: "/dein-investmentstart/dkb-depot",
    aktiv: true,
    notiz: "FinanceQuality, Kampagne 494 DKB-Broker, Werbemittel 3886.",
  },
  {
    kurzname: "finvesto",
    anbieter: "finvesto",
    ziel: "/dein-investmentstart/finvesto",
    aktiv: true,
    notiz: "FinanceQuality, Kampagne 1806 finvesto Depot, Werbemittel 23138.",
  },
  {
    kurzname: "dkb-girokonto",
    anbieter: "DKB",
    ziel: "/dein-investmentstart/dkb-girokonto",
    aktiv: true,
    notiz: "FinanceQuality, Kampagne 14 DKB Girokonto, Werbemittel 23241 (Standard-Landingpage).",
  },
  {
    kurzname: "n26",
    anbieter: "N26",
    ziel: "/dein-investmentstart/n26",
    aktiv: true,
    notiz: "FinanceQuality, Kampagne 1782, Werbemittel 24756 (N26 Standard DE).",
  },
  {
    kurzname: "bbbank",
    anbieter: "BBBank",
    ziel: "/dein-investmentstart/bbbank",
    aktiv: true,
    notiz: "FinanceQuality, Kampagne 1945 BBBank Girokonto, Werbemittel 23181 (Mehrwertkonto).",
  },
  {
    kurzname: "bunq",
    anbieter: "bunq",
    ziel: "/dein-investmentstart/bunq",
    aktiv: true,
    notiz: "financeAds, Programm 3156, Textlink 123231 (Sign up in 5 minutes, Tarif waehlt der Nutzer). Angenommen 24.09.2026.",
  },
  {
    kurzname: "joe-broker",
    anbieter: "JOE Broker",
    ziel: "/dein-investmentstart/joe-broker",
    aktiv: true,
    notiz: "financeAds, Programm 5496, Textlink 129308 (Depot). Angenommen 24.09.2026.",
  },
  {
    kurzname: "wise",
    anbieter: "Wise",
    ziel: "/dein-investmentstart/wise",
    aktiv: true,
    notiz: "Partnerize, Kampagne Wise EUR (camref 1011l5RuSL), Deeplink auf wise.com/de. Angenommen 25.09.2026, Link geholt und Weiterleitung geprueft 26.09.2026 (partnerID 1011l440232).",
  },
  {
    kurzname: "comdirect-depot",
    anbieter: "comdirect",
    ziel: "/dein-investmentstart/comdirect-depot",
    aktiv: true,
    notiz: "financeAds, Programm 870, Textlink 24090 (comdirect Depot, leitet am 26.09.2026 auf depot_affiliate_lang.html). Angenommen, im Portal gesehen 26.09.2026.",
  },
  {
    kurzname: "comdirect-pure-depot",
    anbieter: "comdirect",
    ziel: "/dein-investmentstart/comdirect-pure-depot",
    aktiv: true,
    notiz: "financeAds, Programm 870, Werbemittelkategorie Pure Depot, Textlink 133258 (leitet am 26.09.2026 auf pure-depot_affiliate.html).",
  },
  {
    kurzname: "comdirect-girokonto",
    anbieter: "comdirect",
    ziel: "/dein-investmentstart/comdirect-girokonto",
    aktiv: true,
    notiz: "financeAds, Programm 870, Textlink 24068 (comdirect Girokonto \"Aktiv\", leitet am 26.09.2026 auf giro_praemie_media_wm250-aff.html).",
  },
  {
    kurzname: "finanzen-net-zero",
    anbieter: "finanzen.net ZERO",
    ziel: "/dein-investmentstart/finanzen-net-zero",
    aktiv: true,
    notiz: "financeAds, Programm 3722, Textlink 73516 (Kostenloses Depot eroeffnen, leitet am 26.09.2026 auf /zero/start-aff/). Angenommen, im Portal gesehen 26.09.2026.",
  },
  {
    kurzname: "finanzen-net-zero-krypto",
    anbieter: "finanzen.net ZERO",
    ziel: "/dein-investmentstart/finanzen-net-zero-krypto",
    aktiv: true,
    notiz: "financeAds, Programm 3722, Textlink 95574 (leitet am 26.09.2026 auf /zero/krypto/, utm_campaign financeads_krypto).",
  },
  {
    kurzname: "s-broker",
    anbieter: "S Broker",
    ziel: "/dein-investmentstart/s-broker",
    aktiv: true,
    notiz: "financeAds, Programm 191, Textlink 19676 (Standard-Depot Landingpage, leitet am 26.09.2026 auf sbroker.mein-onlineantrag.de). Angenommen, im Portal gesehen 26.09.2026.",
  },
  {
    kurzname: "bbbank-bettersmart",
    anbieter: "BBBank",
    ziel: "/dein-investmentstart/bbbank-bettersmart",
    aktiv: true,
    notiz: "FinanceQuality, Kampagne 1945 BBBank Girokonto, Werbemittel 391350 (BetterSmart Konto). Leitet am 26.09.2026 auf bbbank.de/privatkunden/girokonto.html, dort steht BetterSmart als erstes Konto.",
  },
  {
    kurzname: "tangem",
    anbieter: "Tangem",
    ziel: "/dein-investmentstart/tangem",
    aktiv: false,
    notiz: "MCANISM, Angebot 6859, Textlink Default https://api.skynet.mcanism.com/c/09dGii (Werbeflaeche finanzmuslim.com, leitet am 25.09.2026 auf Tangems Tracker). Angenommen 24.09.2026. Inaktiv, bis es eine Startseite und eine Hardware-Wallet-Sektion gibt.",
  },
  {
    kurzname: "trezor",
    anbieter: "Trezor",
    ziel: "/dein-investmentstart/trezor",
    aktiv: false,
    notiz: "financeAds, Programm 5431, Textlink 127829 https://www.financeads.net/tc.php?t=87591C5431127829T (einziges Werbemittel, englische Trezor-Seite, leitet am 25.09.2026 auf trezor.io). Angenommen 24.09.2026. Inaktiv, bis es eine Startseite und eine Hardware-Wallet-Sektion gibt.",
  },
  {
    kurzname: "finanzguru",
    anbieter: "Finanzguru",
    ziel: "/dein-investmentstart/finanzguru",
    aktiv: false,
    notiz: "financeAds, Programm 3772, Textlink 72598 https://www.financeads.net/tc.php?t=87591C377272598T (Hier Finanzguru eröffnen, leitet am 25.09.2026 auf finanzguru.mein-onlineantrag.de). Angenommen 24.09.2026. Inaktiv, bis die Seite einen Platz fuer Finanz-Apps hat.",
  },
  {
    kurzname: "postbank",
    anbieter: "Postbank",
    ziel: "/dein-investmentstart/postbank",
    aktiv: true,
    notiz: "financeAds, Programm 426. Werbemittelkategorie Giro pur, Textlink 125749 (Postbank kostenloses Giro - Giro pur), leitet am 26.09.2026 auf postbank.de/.../giro-pur.html. Die Textlinks 14532 und 14723 fuehren auf Giro plus und werden nicht genutzt.",
  },
  {
    kurzname: "smartsteuer",
    anbieter: "smartsteuer",
    ziel: "/dein-investmentstart/smartsteuer",
    aktiv: true,
    notiz: "Awin, Programm 15043 (smartsteuer DE), Standard-Link https://www.awin1.com/cread.php?awinmid=15043&awinaffid=3099915 (leitet am 29.09.2026 auf smartsteuer.de/online/). Zugelassen 28.09.2026, Willkommensmail 29.09.2026: Neukunde 20 €, Bestandskunde 1,50 €. Aktiv seit 06.10.2026, Startseite mit Steuer-Aufbau (art steuer), Link mit clickref.",
  },

  {
    kurzname: "wiso-steuer",
    anbieter: "WISO Steuer",
    ziel: "/dein-investmentstart/wiso-steuer",
    aktiv: true,
    notiz: "Awin, Programm 17387 (WISO Steuer-Software von Buhl Data), Standard-Link https://www.awin1.com/cread.php?awinmid=17387&awinaffid=3099915 (leitet am 06.10.2026 auf buhl.de/steuer/). Zugelassen 29.09.2026, im Portal gesehen 06.10.2026. Provision laut Programmtext: Abo 15 €, Einzelkauf 5 €, SignUp 2,50 €, nur WISO Steuer-App im Buhl-Shop. Link mit clickref.",
  },
  {
    kurzname: "consorsbank-depot",
    anbieter: "Consorsbank",
    ziel: "/dein-investmentstart/consorsbank-depot",
    aktiv: true,
    notiz: "financeAds, Programm 152, Textlink 40776 (Consorsbank Depot, leitet am 04.10.2026 auf aktionen.consorsbank.de/wertpapierdepot). Angenommen, im Portal gesehen 04.10.2026. Zusatzbedingungen: Consorsbank und Produkt nennen, keine Mail-Kampagnen ohne Genehmigung.",
  },
  {
    kurzname: "consorsbank-girokonto",
    anbieter: "Consorsbank",
    ziel: "/dein-investmentstart/consorsbank-girokonto",
    aktiv: true,
    notiz: "financeAds, Programm 152, Werbemittelkategorie Consorsbank! Girokonto, Textlink 73616 (Girokonto + Visa Card Debit, leitet am 04.10.2026 auf aktionen.consorsbank.de/girokonto).",
  },
  {
    kurzname: "deutsche-bank-aktivkonto",
    anbieter: "Deutsche Bank",
    ziel: "/dein-investmentstart/deutsche-bank-aktivkonto",
    aktiv: true,
    notiz: "financeAds, Programm 472, Textlink 101924 (AktivKonto, leitet am 04.10.2026 auf deutsche-bank.de/pk/konto-und-karte/konten-im-ueberblick/konten-im-vergleich/konten-im-vergleich-sea.html, die Kontenuebersicht mit dem AktivKonto). Angenommen, im Portal gesehen 04.10.2026.",
  },
  {
    kurzname: "maxblue-depot",
    anbieter: "maxblue",
    ziel: "/dein-investmentstart/maxblue-depot",
    aktiv: true,
    notiz: "financeAds, Programm 472 (Deutsche Bank), Werbemittelkategorie maxblue Depot, Textlink 85472 (leitet am 04.10.2026 auf maxblue.de/landingpage/lp-ap-maxblue-depot.html).",
  },
  {
    kurzname: "justtrade",
    anbieter: "justTRADE",
    ziel: "/dein-investmentstart/justtrade",
    aktiv: true,
    notiz: "financeAds, Programm 3262, Textlink 61718 (Kurzantrag, leitet am 04.10.2026 auf justtrade.mein-onlineantrag.de). Angenommen, im Portal gesehen 04.10.2026. Teilnahmebedingungen: Pflichthinweise 'Investitionen in Wertpapiere bergen Verlustrisiken.' und bei Orderkosten 'zzgl. marktueblicher Spreads', beide in Textgroesse.",
  },
  {
    kurzname: "justtrade-krypto",
    anbieter: "justTRADE",
    ziel: "/dein-investmentstart/justtrade-krypto",
    aktiv: true,
    notiz: "Gleicher Partnerlink wie justtrade (Programm 3262, Textlink 61718). Krypto laeuft bei justTRADE ueber dasselbe Konto, das Programm fuehrt keinen eigenen Krypto-Textlink (04.10.2026).",
  },
  {
    kurzname: "norisbank",
    anbieter: "norisbank",
    ziel: "/dein-investmentstart/norisbank",
    aktiv: true,
    notiz: "financeAds, Programm 127, Textlink 132812 (Top-Giro, leitet am 04.10.2026 auf norisbank.de/girokonto/kampagne/dein-neues-girokonto.html). Angenommen, im Portal gesehen 04.10.2026. Teilnahmebedingungen: kein Newsletter ohne Freigabe, kein Direktlink aus Social Media, Konditionen aktuell halten, Vertragsstrafe 5.000 Euro je Verstoss.",
  },
  {
    kurzname: "smartbroker",
    anbieter: "Smartbroker+",
    ziel: "/dein-investmentstart/smartbroker",
    aktiv: true,
    notiz: "financeAds, Programm 2968, Textlink 55636 (Depot von Smartbroker DE, leitet am 04.10.2026 auf get.smartbrokerplus.de/testsieger/). Angenommen, im Portal gesehen 04.10.2026. Teilnahmebedingungen: keine direkte Weiterleitung auf smartbrokerplus.de, kein Newsletter im Namen von Smartbroker.",
  },
  {
    kurzname: "smartbroker-krypto",
    anbieter: "Smartbroker+",
    ziel: "/dein-investmentstart/smartbroker-krypto",
    aktiv: true,
    notiz: "financeAds, Programm 2968, Textlink 124479 (Krypto Landingpage, leitet am 04.10.2026 auf get.smartbrokerplus.de/krypto/).",
  },
  {
    kurzname: "umweltbank",
    anbieter: "UmweltBank",
    ziel: "/dein-investmentstart/umweltbank",
    aktiv: true,
    notiz: "financeAds, Programm 4946, Werbemittelkategorie Girokonto, Textlink 128612 (Girokonto mit Haltung, leitet am 04.10.2026 auf umweltbank.de/lp/fa-girokonto/). Angenommen, im Portal gesehen 04.10.2026. Teilnahmebedingungen: nur Girokonto und Sparprodukte bewerben, keine Wertpapiere der UmweltBank; Aenderung von Domain oder Ausrichtung einen Monat vorher melden.",
  },
  {
    kurzname: "finst",
    anbieter: "Finst",
    ziel: "/dein-investmentstart/finst",
    aktiv: true,
    notiz: "financeAds, Programm 5710, Textlink 135756 (leitet am 04.10.2026 auf finst.com/de/). Angenommen, im Portal gesehen 04.10.2026. Teilnahmebedingungen: deutlich sichtbarer Risikohinweis (AFM), keine direkte Weiterleitung auf finst.com.",
  },
];

/** Namen aller Anbieter mit aktivem Partnerlink, jeder einmal, nach Alphabet.
 *  Daraus entsteht die Liste auf /wie-ich-geld-verdiene. */
export const partnerNamen = (): string[] =>
  [...new Set(partnerLinks.filter((p) => p.aktiv).map((p) => p.anbieter))].sort((a, b) =>
    a.localeCompare(b, "de", { sensitivity: "base" }),
  );

export const findPartnerLink = (kurzname?: string): PartnerLink | undefined =>
  partnerLinks.find((p) => p.kurzname === kurzname);
