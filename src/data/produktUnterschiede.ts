/**
 * Was ein Produkt von den anderen Produkten desselben Hauses unterscheidet. Elias, 12.10.2026: „wenn wir
 * zweimal den gleichen Anbieter haben, dann muss es doch so Sachen geben. Wie jetzt bei Scalable.“
 *
 * Je Produkt ein Satz, was man gegenüber dem anderen Produkt bekommt oder zahlt, nur aus dem Beleg des
 * Anbieters. Zinsen und Kredit sind nie ein Vorteil, ein Urteil zu halal oder haram steht hier nicht.
 * Ohne Beleg kein Eintrag: Das Produkt bleibt ohne Satz. Fundstellen mit Zitat je Satz:
 * Vault `data/vervollstaendigung/fundstellen/M-unterschiede-*.md`.
 */
export type ProduktUnterschied = {
  /** Die Frage, die der Kasten beantwortet, z. B. „Depot oder Pure Depot“. */
  titel: string;
  satz: string;
  /** Beleg des Anbieters: Datei unter `~/rebrand/data/vergleiche/belege/` oder Adresse, mit Stand. */
  beleg: string;
};

export const PRODUKT_UNTERSCHIEDE: Record<string, ProduktUnterschied> = {
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
};
