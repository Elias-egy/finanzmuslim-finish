/**
 * Was ein Produkt von den anderen Produkten desselben Hauses unterscheidet. Elias, 12.10.2026: „wenn wir
 * zweimal den gleichen Anbieter haben, dann muss es doch so Sachen geben. Wie jetzt bei Scalable.“
 *
 * Je Produkt ein Satz, was man gegenüber dem anderen Produkt bekommt oder zahlt, nur aus dem Beleg des
 * Anbieters. Zinsen und Kredit sind nie ein Vorteil, ein Urteil zu halal oder haram steht hier nicht.
 * Auch Versicherungen sind nie ein Vorteil (Elias' Auftrag V3, 13.10.2026).
 * Ohne Beleg kein Eintrag: Das Produkt bleibt ohne Satz. Fundstellen mit Zitat je Satz:
 * Vault `data/vervollstaendigung/fundstellen/M-unterschiede-*.md`.
 */
/** Je Vergleich eine eigene Liste: Dieselbe Kennung gibt es als Depot und als Girokonto (`revolut-standard`, `vivid-standard`). */
export type UnterschiedKategorie = "depot" | "girokonto" | "krypto";

export type ProduktUnterschied = {
  /** Die Frage, die der Kasten beantwortet, z. B. „Depot oder Pure Depot“. */
  titel: string;
  satz: string;
  /** Beleg des Anbieters: Datei unter `~/rebrand/data/vergleiche/belege/` oder Adresse, mit Stand. */
  beleg: string;
};

/**
 * Produkte eines Hauses mit mehreren Produkten, die bewusst ohne Satz bleiben, mit dem Grund: Der Beleg fehlt
 * oder widerspricht der Zelle. Der Test verlangt für Girokonto und Krypto je Produkt einen Satz oder einen Eintrag hier.
 */
export const OHNE_UNTERSCHIED: Record<UnterschiedKategorie, Record<string, string>> = {
  depot: {},
  girokonto: {
    "vivid-prime":
      "Die Zelle nennt 7,90 € im Monat, die Gebührentabelle 9,90 € (7,90 € nur im Paket für 12 Monate): vivid/98-kontopreis-2026-09-27-gebuehren.txt Z. 11, 21-23, vivid/97-kontopreis-2026-09-27-prime.txt Z. 35",
  },
  krypto: {},
};

export const PRODUKT_UNTERSCHIEDE: Record<UnterschiedKategorie, Record<string, ProduktUnterschied>> = {
  depot: {
    "comdirect-depot": {
      titel: "Depot oder Pure Depot",
      satz: "Eine Order kostet regulär 4,90 € plus 0,25 %, ein Sparplan 1,50 % der Rate. Dafür handelst du an vielen Börsen und außerbörslich, mit dem vollen Angebot an Wertpapieren.",
      beleg: "comdirect/99-i2-plv-2026-10-06.txt Z. 570-581 (Preisverzeichnis ab 15.07.2026), comdirect/99-i2-pure-depot-vergleich-chrome-2026-10-06.txt Z. 6-8",
    },
    "comdirect-pure-depot": {
      titel: "Depot oder Pure Depot",
      satz: "Eine Order kostet 1 €, Sparpläne laufen ohne Orderentgelt. Dafür handelst du nur über gettex und ohne das volle Angebot an Wertpapieren.",
      beleg: "comdirect/99-i2-plv-2026-10-06.txt Z. 785-789, comdirect/99-i2-pure-depot-vergleich-chrome-2026-10-06.txt Z. 6-8",
    },
    "finvesto-depot": {
      titel: "Depot oder Depot Basis",
      satz: "Kostet 11,50 € im Quartal und fasst bis zu 99 Positionen. Das Depot Basis kostet 6 € im Quartal und fasst eine.",
      beleg: "finvesto/99-i3-plv-depot-2026-10-07.txt Z. 22-38 (Abruf 07.10.2026)",
    },
    "finvesto-depot-basis": {
      titel: "Depot oder Depot Basis",
      satz: "Kostet 6 € im Quartal und fasst genau eine Position, also einen Fonds oder ETF. Mit der zweiten wechselst du automatisch ins Depot für 11,50 € im Quartal, zurück geht es nicht.",
      beleg: "finvesto/99-i3-plv-depot-2026-10-07.txt Z. 27-47, finvesto/99-i3-depot-2026-10-07.txt Z. 152-155",
    },
    "scalable-capital-free-broker": {
      titel: "Free Broker oder Prime+ Broker",
      satz: "Du zahlst je Order statt im Monat: ab 0,99 €, Sparpläne sind gebührenfrei. Preisalarme und Portfolioanalyse sind begrenzt, die Vollversion hat Prime+.",
      beleg: "scalable/99-i2-trading-2026-10-06.txt Z. 105-106, 133-138, 323-329 (Seite de.scalable.capital/trading, 06.10.2026)",
    },
  },
  girokonto: {
    // Girokonto (Fundstellen: M-unterschiede-girokonto-a.md, -b.md, -c.md; jedes Zitat am 13.10.2026 an der Zeile nachgelesen)
    "bbbank-bettersmart": {
      titel: "BetterSmart oder Girokonto",
      satz: "Kostet 4,95 € im Monat, ab 1.000 € Geldeingang und mit e-Postfach 0 €. Die Visa DirectCard kostet 0 € im Jahr, beim Girokonto 19,95 €.",
      beleg: "bbbank/95-kontopreis-2026-09-27.txt Z. 579-584, 683-684, 120-121 (Entgeltinformation, Stand Juli 2026)",
    },
    "bbbank-girokonto": {
      titel: "BetterSmart oder Girokonto",
      satz: "Kostet 2,95 € im Monat. Die Visa DirectCard kostet 19,95 € im Jahr, beim BetterSmart 0 €.",
      beleg: "bbbank/95-kontopreis-2026-09-27.txt Z. 24-25, 120-121, 683-684 (Entgeltinformation, Stand Juli 2026)",
    },
    "bunq-free": {
      titel: "Die vier Konten von bunq",
      satz: "Kostet 0 € im Monat und hat 3 Konten. Eine Mastercard gibt es nicht, jede Abhebung kostet 2,99 €.",
      beleg: "bunq/96-kontopreis-2026-09-27-preise.txt Z. 9-12, 200-206 (Preisübersicht 22.09.2026), bunq/95-kontopreis-2026-09-27.txt Z. 92-94, 123-124",
    },
    "bunq-core": {
      titel: "Die vier Konten von bunq",
      satz: "Kostet 3,99 € im Monat, mit 5 Konten und einer Mastercard. Die ersten 5 Abhebungen im Monat kosten je 0,99 €, danach 2,99 €.",
      beleg: "bunq/96-kontopreis-2026-09-27-preise.txt Z. 9-12 (Preisübersicht 22.09.2026), bunq/95-kontopreis-2026-09-27.txt Z. 96-98, 120-121",
    },
    "bunq-pro": {
      titel: "Die vier Konten von bunq",
      satz: "Kostet 9,99 € im Monat, mit 25 Konten und bis zu 3 Karten. Die ersten 6 Abhebungen im Monat sind kostenlos.",
      beleg: "bunq/96-kontopreis-2026-09-27-preise.txt Z. 9-12, 200-206, 332-339 (Preisübersicht 22.09.2026), bunq/95-kontopreis-2026-09-27.txt Z. 116-118",
    },
    "bunq-elite": {
      titel: "Die vier Konten von bunq",
      satz: "Kostet 18,99 € im Monat, 9 € mehr als Pro. Konten, Karten und kostenlose Abhebungen sind laut Preisliste dieselben wie bei Pro.",
      beleg: "bunq/96-kontopreis-2026-09-27-preise.txt Z. 9-12, 200-206, 332-339 (Preisübersicht 22.09.2026), bunq/95-kontopreis-2026-09-27.txt Z. 116-118",
    },
    "commerzbank-girokonto": {
      titel: "GiroKonto oder KlassikKonto",
      satz: "Kostet 4,90 € im Monat, ab 50.000 € Vermögen 0 €. Bargeld am Schalter einzahlen kostet 3,90 €, am Automaten nichts.",
      beleg: "commerzbank/95-kontopreis-2026-09-27.txt Z. 25-29, 66-69 (Entgeltinformation 1.12.2025)",
    },
    "commerzbank-klassikkonto": {
      titel: "GiroKonto oder KlassikKonto",
      satz: "Kostet 9,90 € im Monat. Bargeld einzahlen kostet nichts, dazu kommt Service in der Filiale und am Telefon.",
      beleg: "commerzbank/98-kontopreis-2026-09-27-klassik.txt Z. 23, 61 (Entgeltinformation 1.12.2025), commerzbank/06-girokonto-eroeffnen.txt Z. 65-66, 89",
    },
    "hypovereinsbank-aktivkonto": {
      titel: "AktivKonto oder PlusKonto",
      satz: "Die UniCredit Card kostet 15 € im Jahr. Beim PlusKonto kostet sie 0 €.",
      beleg: "hvb/95-kontopreis-2026-09-27-aktivkonto.txt Z. 84, hvb/96-kontopreis-2026-09-27-pluskonto.txt Z. 83 (Entgeltinformationen 31.07.2026)",
    },
    "hypovereinsbank-pluskonto": {
      titel: "AktivKonto oder PlusKonto",
      satz: "Kostet 9,90 € im Monat, für Neukunden mit 1.000 € Geldeingang und HVB valyou 0 €. Die UniCredit Card kostet 0 € im Jahr, beim AktivKonto 15 €.",
      beleg: "hvb/96-kontopreis-2026-09-27-pluskonto.txt Z. 26-33, 83, 210-211, hvb/95-kontopreis-2026-09-27-aktivkonto.txt Z. 84 (Entgeltinformationen 31.07.2026)",
    },
    "ing-girokonto": {
      titel: "Girokonto oder Girokonto Future",
      satz: "Kostet 0 € ab 1.000 € Geldeingang im Monat oder unter 28 Jahren, sonst 4,90 €. Die Erweiterung Future kostet 1 € im Monat dazu.",
      beleg: "ing/95-kontopreis-2026-09-27.txt Z. 15-21, 166 (Entgeltinformation 23.10.2025)",
    },
    "ing-girokonto-future": {
      titel: "Girokonto oder Girokonto Future",
      satz: "Kostet 1 € im Monat mehr als das Girokonto. Dafür kannst du dein digitales Wechselgeld für soziale und ökologische Projekte des Partners share nutzen.",
      beleg: "ing/96-kontopreis-2026-09-27-plv.txt Z. 3273-3275, ing/95-kontopreis-2026-09-27.txt Z. 166, ing/90-faq-girokonto-abruf.txt Z. 4150",
    },
    "n26-standard": {
      titel: "Die fünf Konten von N26",
      satz: "Kostet 0 € im Monat. Für die physische Karte zahlst du einmalig 10 € Versand.",
      beleg: "n26/95-kontopreis-2026-09-27.txt Z. 28, 170-172 (Entgeltinformation 03.08.2026)",
    },
    "n26-smart": {
      titel: "Die fünf Konten von N26",
      satz: "Kostet 4,90 € im Monat. In Deutschland sind 5 Abhebungen im Monat kostenlos.",
      beleg: "n26/95-kontopreis-2026-09-27.txt Z. 228, 90-94 (Entgeltinformation 03.08.2026)",
    },
    "n26-go": {
      titel: "Die fünf Konten von N26",
      satz: "Kostet 9,90 € im Monat. Abhebungen in fremder Währung sind im Paket, bei Standard und Smart kosten sie 1,7 % vom Umsatz.",
      beleg: "n26/95-kontopreis-2026-09-27.txt Z. 233, 106-109, 190-194 (Entgeltinformation 03.08.2026)",
    },
    "n26-metal": {
      titel: "Die fünf Konten von N26",
      satz: "Kostet 16,90 € im Monat. In Deutschland sind 8 Abhebungen im Monat kostenlos, bei Smart und Go 5.",
      beleg: "n26/95-kontopreis-2026-09-27.txt Z. 238, 97-103, 90-94 (Entgeltinformation 03.08.2026)",
    },
    "n26-flex": {
      titel: "Die fünf Konten von N26",
      satz: "Kostet 8,90 € im Monat, jede Abhebung 2 €. Du kannst es nicht selbst wählen: N26 bietet es an, wenn die SCHUFA-Bonität für das Standard-Konto nicht reicht.",
      beleg: "n26/96-kontopreis-2026-09-27-flex.txt Z. 23, 109-110 (Entgeltinformation 03.08.2026), n26/92-flex-konto-faq-2026-09-26.txt Z. 3",
    },
    "norisbank-top-girokonto": {
      titel: "Top-Girokonto oder Girokonto Plus",
      satz: "Kostet 0 € ab 500 € Geldeingang im Monat oder unter 30 Jahren, sonst 3,90 €. Die Mastercard direkt gibt es nur mit Bonitätsvoraussetzung.",
      beleg: "norisbank/95-kontopreis-2026-09-27-top-girokonto.txt Z. 21-25, 32-34 (Entgeltinformation 15.07.2026)",
    },
    "norisbank-girokonto-plus": {
      titel: "Top-Girokonto oder Girokonto Plus",
      satz: "Kostet 7,90 € im Monat. Die Mastercard direkt gibt es hier ohne Bonitätsvoraussetzung.",
      beleg: "norisbank/96-kontopreis-2026-09-27-girokonto-plus.txt Z. 21-22, 30-31 (Entgeltinformation 15.07.2026)",
    },
    "revolut-standard": {
      titel: "Die fünf Konten von Revolut",
      satz: "Kostet 0 € im Monat. Am Automaten sind bis zu 5 Abhebungen oder die ersten 200 € im Monat kostenlos.",
      beleg: "revolut/95-kontopreis-2026-09-27.txt Z. 35, 107-109 (Entgeltinformation ab 5.11.2025)",
    },
    "revolut-plus": {
      titel: "Die fünf Konten von Revolut",
      satz: "Kostet 2,99 € im Monat. Dafür ist eine zweite Karte kostenlos, Abhebungen bleiben bis 200 € im Monat gebührenfrei.",
      beleg: "revolut/98-kontopreis-2026-09-27-plus.txt Z. 76, 120, 191 (Gebührenseite Plus, 27.09.2026)",
    },
    "revolut-premium": {
      titel: "Die fünf Konten von Revolut",
      satz: "Kostet 8,99 € im Monat. Abhebungen sind bis 400 € im Monat gebührenfrei, bei Plus bis 200 €.",
      beleg: "revolut/96-kontopreis-2026-09-27-premium.txt Z. 83, 190 (Preis bei Anmeldung ab 07.05.2026), revolut/98-kontopreis-2026-09-27-plus.txt Z. 191",
    },
    "revolut-metal": {
      titel: "Die fünf Konten von Revolut",
      satz: "Kostet 15,99 € im Monat. Abhebungen sind bis 800 € im Monat gebührenfrei, bei Premium bis 400 €.",
      beleg: "revolut/99-kontopreis-2026-09-27-metal-chrome.txt Z. 29 (Preis bei Anmeldung ab 07.05.2026), revolut/95-kontopreis-2026-09-27.txt Z. 123-124, revolut/96-kontopreis-2026-09-27-premium.txt Z. 190",
    },
    "revolut-ultra": {
      titel: "Die fünf Konten von Revolut",
      satz: "Kostet 65 € im Monat. Abhebungen sind bis 2.000 € im Monat gebührenfrei, bei Metal bis 800 €.",
      beleg: "revolut/97-kontopreis-2026-09-27-ultra.txt Z. 87, 222 (Preis bei Anmeldung ab 07.05.2026), revolut/95-kontopreis-2026-09-27.txt Z. 123-124",
    },
    "tomorrow-now": {
      titel: "Die drei Konten von Tomorrow",
      satz: "Kostet 4,90 € im Monat, mit 2 Unterkonten. Eine Abhebung im Monat ist kostenlos, jede weitere kostet 3 €.",
      beleg: "tomorrow/96-kontopreis-2026-09-27-now.txt Z. 35, 51, 94-97 (Entgeltinformation 02.06.2026)",
    },
    "tomorrow-change": {
      titel: "Die drei Konten von Tomorrow",
      satz: "Kostet 8,90 € im Monat, mit 6 Unterkonten und 5 kostenlosen Abhebungen. Zahlen mit der Karte in fremder Währung kostet nichts, bei Now 2 %.",
      beleg: "tomorrow/97-kontopreis-2026-09-27-change.txt Z. 35, 51, 93-94, 111, tomorrow/96-kontopreis-2026-09-27-now.txt Z. 112 (Entgeltinformationen 02.06.2026)",
    },
    "tomorrow-plus": {
      titel: "Die drei Konten von Tomorrow",
      satz: "Kostet 17,90 € im Monat. Abhebungen am Automaten kosten nichts, und die Zahl der Unterkonten ist unbegrenzt.",
      beleg: "tomorrow/98-kontopreis-2026-09-27-plus.txt Z. 35, 51, 94-95 (Entgeltinformation 02.06.2026)",
    },
    "c24-smart": {
      titel: "Die drei Konten von C24",
      satz: "Kostet 0 € im Monat. 4 Abhebungen im Monat sind kostenlos, jede weitere kostet 2 €.",
      beleg: "c24/95-kontopreis-2026-09-27.txt Z. 24, 128-134 (Entgeltinformation 05.05.2026)",
    },
    "c24-plus": {
      titel: "Die drei Konten von C24",
      satz: "Kostet 5,90 € im Monat. Dafür sind 20 Abhebungen und eine Bargeldeinzahlung im Monat kostenlos.",
      beleg: "c24/96-kontopreis-2026-09-27-plus.txt Z. 24, 89-90, 130-131 (Entgeltinformation 01.07.2026)",
    },
    "c24-max": {
      titel: "Die drei Konten von C24",
      satz: "Kostet 9,90 € im Monat. Abhebungen und Einzahlung sind wie beim Pluskonto, dazu kommt ein priorisierter Kundenservice.",
      beleg: "c24/97-kontopreis-2026-09-27-max.txt Z. 24, 42, 89-90, 125-126, c24/96-kontopreis-2026-09-27-plus.txt Z. 89-90, 130-131 (Entgeltinformationen 01.07.2026)",
    },
    // Vivid: Fundstellen in M-unterschiede-girokonto-d.md, am 13.10.2026 an der Zeile nachgelesen
    "vivid-standard": {
      titel: "Die drei Konten von Vivid",
      satz: "Kostet 4,90 € im Monat, mit 3.000 € Guthaben bei Vivid oder 1.000 € Kartenumsatz im Vormonat 0 €. 200 € im Monat hebst du kostenlos ab, du hast 3 Pockets.",
      beleg: "vivid/98-kontopreis-2026-09-27-gebuehren.txt Z. 11, 107-112, 141-148 (Gebührentabelle ab 18.08.2026), vivid/95-kontopreis-2026-09-27.txt Z. 56",
    },
    "vivid-plus": {
      titel: "Die drei Konten von Vivid",
      satz: "Kostet 6,90 € im Monat. 500 € im Monat hebst du kostenlos ab, du hast 6 Pockets.",
      beleg: "vivid/96-kontopreis-2026-09-27-plus.txt Z. 35, 40, 58-64, vivid/98-kontopreis-2026-09-27-gebuehren.txt Z. 11, 107-112",
    },
  },
  // Krypto: Gebührenseiten der Anbieter, am 13.10.2026 gelesen. Wortlaut je Zeile im Vault, Datei siehe Beleg.
  krypto: {
    "binance-standard": {
      titel: "Binance Standard oder Pro",
      satz: "Du kaufst direkt mit Karte, Apple Pay oder Google Pay und zahlst dafür 2 % Gebühr.",
      beleg: "Vault raw/2026-10-13-krypto-gebuehrenseiten-anbieter.md Zeile B5 (binance.com/en/fee/buyandsell, 13.10.2026)",
    },
    "binance-pro": {
      titel: "Binance Standard oder Pro",
      satz: "Du handelst an der Börse von Binance und zahlst als normaler Nutzer 0,1 % je Order. Beim direkten Kauf mit Karte sind es 2 %.",
      beleg: "Vault raw/2026-10-13-krypto-gebuehrenseiten-anbieter.md Zeilen B1, B5 (binance.com/en/fee/trading und /fee/buyandsell, 13.10.2026)",
    },
    "bitpanda-standard": {
      titel: "Bitpanda Standard oder Fusion",
      satz: "Du kaufst direkt, im Preis steckt ein Aufschlag ab 0,99 %, je nach Kryptowährung. Einen Sparplan startest du ab 10 €.",
      beleg: "bitpanda/99-i3-sparplan-2026-10-06.txt Z. 240-246, 361-363 (bitpanda.com, 06.10.2026)",
    },
    "bitpanda-fusion": {
      titel: "Bitpanda Standard oder Fusion",
      satz: "Du handelst mit gestaffelter Gebühr: 0,25 % je Trade bis 100.000 € Handelsvolumen in 30 Tagen. Bitpanda erhebt dort keine Gebühren für Ein- und Auszahlungen.",
      beleg: "Vault raw/2026-10-13-krypto-gebuehrenseiten-anbieter.md Zeilen F2-F6 (bitpanda.com/de/fusion, 13.10.2026)",
    },
    "coinbase-standard": {
      titel: "Coinbase Standard oder Advanced",
      satz: "Du kaufst mit einer einfachen Order, im Preis steckt ein Aufschlag (Spread). Die Gebühr siehst du in der Vorschau, bevor du kaufst.",
      beleg: "Vault raw/2026-10-13-krypto-gebuehrenseiten-anbieter.md Zeilen C2, C3 (help.coinbase.com, Preise und Gebühren, 13.10.2026)",
    },
    "coinbase-advanced": {
      titel: "Coinbase Standard oder Advanced",
      satz: "Du handelst direkt an der Börse von Coinbase, ohne Aufschlag im Preis. Die Gebühr hängt von deiner Stufe ab, die Sätze zeigt Coinbase erst nach Anmeldung.",
      beleg: "Vault raw/2026-10-13-krypto-gebuehrenseiten-anbieter.md Zeilen C4-C6 (help.coinbase.com, Gebühren für Coinbase Advanced Trading, 13.10.2026)",
    },
    "kraken-standard": {
      titel: "Kraken Standard oder Pro",
      satz: "Sofortkauf und wiederkehrende Käufe kosten 1 % Gebühr. Im angezeigten Preis steckt zusätzlich ein Aufschlag (Spread).",
      beleg: "Vault raw/2026-10-13-krypto-gebuehrenseiten-anbieter.md Zeilen K1, K2, K4 (kraken.com/de-de/features/fee-schedule, 13.10.2026)",
    },
    "kraken-pro": {
      titel: "Kraken Standard oder Pro",
      satz: "Du handelst an der Börse von Kraken und zahlst in der ersten Stufe höchstens 0,80 % je Order. Mit mehr Handelsvolumen sinkt der Satz.",
      beleg: "Vault raw/2026-10-13-krypto-gebuehrenseiten-anbieter.md Zeilen K5-K7 (kraken.com/de-de/features/fee-schedule, 13.10.2026)",
    },
  },
};

/** Der Satz zum Angebot im genannten Vergleich, sonst nichts. */
export const unterschiedFuer = (kategorie: string | undefined, id: string): ProduktUnterschied | null =>
  (kategorie && (PRODUKT_UNTERSCHIEDE as Record<string, Record<string, ProduktUnterschied>>)[kategorie]?.[id]) || null;
