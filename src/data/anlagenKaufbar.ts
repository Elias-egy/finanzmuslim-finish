// ERZEUGT von ~/rebrand/data/vergleiche/bauen.py aus recherche/anlagen.json. Nicht von Hand ändern.
// Je ISIN: bei welchen Anbietern die Anlage laut Wertpapiersuche oder Produktliste kaufbar ist.
// Fehlt ein Anbieter, ist er noch nicht geprüft.
// Vollprüfung ab 20.09.2026: "kaufbar" steht nur mit Einzelbeleg vom Anbieter selbst (beleg.url
// liegt auf beleg.domain). Ohne Beleg wird die Zeile weggelassen, nicht als kaufbar gezeigt.

import { KAUFBAR_UNKLAR } from "./vergleichKorrekturenDaten";

export type AnlageKaufbar = {
  kaufbar: {
    anbieter: string;
    hinweis?: string;
    beleg: { url: string; stand: string; quelle: string; domains: string[] };
  }[];
  nichtImAngebot: string[];
  stand: string;
};

const ANLAGEN_KAUFBAR_ROH: Record<string, AnlageKaufbar> = {
  "IE000929U2U9": {
    "kaufbar": [
      {
        "anbieter": "comdirect",
        "beleg": {
          "url": "https://www.comdirect.de/inf/search/all.html",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "comdirect.de"
          ]
        }
      },
      {
        "anbieter": "Consorsbank",
        "beleg": {
          "url": "https://www.consorsbank.de/",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "consorsbank.de"
          ]
        }
      },
      {
        "anbieter": "DEGIRO",
        "beleg": {
          "url": "https://www.degiro.de/preise/etf-core-selection",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "degiro.de"
          ]
        }
      },
      {
        "anbieter": "finanzen.net zero",
        "beleg": {
          "url": "https://mein.finanzen-zero.net/handelbare-produkte",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "finanzen.net",
            "finanzen-zero.net"
          ]
        }
      },
      {
        "anbieter": "ING",
        "beleg": {
          "url": "https://wertpapiere.ing.de/",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "ing.de"
          ]
        }
      },
      {
        "anbieter": "Trade Republic",
        "beleg": {
          "url": "https://assets.traderepublic.com/assets/files/DE/Instrument_Universe_DE_de.pdf",
          "stand": "15.09.2026",
          "quelle": "anbieter",
          "domains": [
            "traderepublic.com"
          ]
        }
      },
      {
        "anbieter": "Traders Place",
        "beleg": {
          "url": "https://www.tradersplace.de/wertpapiersuche",
          "stand": "15.09.2026",
          "quelle": "anbieter",
          "domains": [
            "tradersplace.de"
          ]
        }
      },
      {
        "anbieter": "Trading 212",
        "beleg": {
          "url": "https://www.trading212.com/de/trading-instruments/invest",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "trading212.com"
          ]
        }
      }
    ],
    "nichtImAngebot": [
      "Bitpanda",
      "finvesto",
      "XTB"
    ],
    "stand": "15.09.2026"
  },
  "IE0009BC6K22": {
    "kaufbar": [
      {
        "anbieter": "Consorsbank",
        "beleg": {
          "url": "https://www.consorsbank.de/",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "consorsbank.de"
          ]
        }
      },
      {
        "anbieter": "Scalable Capital",
        "beleg": {
          "url": "https://de.scalable.capital",
          "stand": "15.09.2026",
          "quelle": "elias",
          "domains": [
            "scalable.capital"
          ]
        }
      },
      {
        "anbieter": "Traders Place",
        "beleg": {
          "url": "https://www.tradersplace.de/wertpapiersuche",
          "stand": "15.09.2026",
          "quelle": "anbieter",
          "domains": [
            "tradersplace.de"
          ]
        }
      },
      {
        "anbieter": "Trading 212",
        "beleg": {
          "url": "https://www.trading212.com/de/trading-instruments/invest",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "trading212.com"
          ]
        }
      }
    ],
    "nichtImAngebot": [
      "Bitpanda",
      "finanzen.net zero",
      "finvesto",
      "ING",
      "Trade Republic",
      "XTB"
    ],
    "stand": "15.09.2026"
  },
  "IE000AGFZM58": {
    "kaufbar": [
      {
        "anbieter": "Consorsbank",
        "beleg": {
          "url": "https://www.consorsbank.de/",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "consorsbank.de"
          ]
        }
      },
      {
        "anbieter": "Scalable Capital",
        "beleg": {
          "url": "https://de.scalable.capital",
          "stand": "15.09.2026",
          "quelle": "elias",
          "domains": [
            "scalable.capital"
          ]
        }
      },
      {
        "anbieter": "Traders Place",
        "beleg": {
          "url": "https://www.tradersplace.de/wertpapiersuche",
          "stand": "15.09.2026",
          "quelle": "anbieter",
          "domains": [
            "tradersplace.de"
          ]
        }
      },
      {
        "anbieter": "Trading 212",
        "beleg": {
          "url": "https://www.trading212.com/de/trading-instruments/invest",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "trading212.com"
          ]
        }
      },
      {
        "anbieter": "XTB",
        "beleg": {
          "url": "https://xtb.com/de/Einzelaufstellung-der-Finanzinstrumente_OMI_aktuell.pdf",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "xtb.com"
          ]
        }
      }
    ],
    "nichtImAngebot": [
      "Bitpanda",
      "finanzen.net zero",
      "finvesto",
      "ING",
      "Trade Republic"
    ],
    "stand": "15.09.2026"
  },
  "IE000I5NV504": {
    "kaufbar": [
      {
        "anbieter": "Consorsbank",
        "beleg": {
          "url": "https://www.consorsbank.de/",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "consorsbank.de"
          ]
        }
      },
      {
        "anbieter": "Scalable Capital",
        "beleg": {
          "url": "https://de.scalable.capital",
          "stand": "15.09.2026",
          "quelle": "elias",
          "domains": [
            "scalable.capital"
          ]
        }
      },
      {
        "anbieter": "Traders Place",
        "beleg": {
          "url": "https://www.tradersplace.de/wertpapiersuche",
          "stand": "15.09.2026",
          "quelle": "anbieter",
          "domains": [
            "tradersplace.de"
          ]
        }
      },
      {
        "anbieter": "Trading 212",
        "beleg": {
          "url": "https://www.trading212.com/de/trading-instruments/invest",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "trading212.com"
          ]
        }
      }
    ],
    "nichtImAngebot": [
      "Bitpanda",
      "finanzen.net zero",
      "finvesto",
      "ING",
      "Trade Republic",
      "XTB"
    ],
    "stand": "15.09.2026"
  },
  "IE000LFC57H7": {
    "kaufbar": [
      {
        "anbieter": "comdirect",
        "beleg": {
          "url": "https://www.comdirect.de/inf/search/all.html",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "comdirect.de"
          ]
        }
      },
      {
        "anbieter": "Consorsbank",
        "beleg": {
          "url": "https://www.consorsbank.de/",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "consorsbank.de"
          ]
        }
      },
      {
        "anbieter": "Scalable Capital",
        "beleg": {
          "url": "https://de.scalable.capital",
          "stand": "15.09.2026",
          "quelle": "elias",
          "domains": [
            "scalable.capital"
          ]
        }
      },
      {
        "anbieter": "Trade Republic",
        "beleg": {
          "url": "https://assets.traderepublic.com/assets/files/DE/Instrument_Universe_DE_de.pdf",
          "stand": "15.09.2026",
          "quelle": "anbieter",
          "domains": [
            "traderepublic.com"
          ]
        }
      },
      {
        "anbieter": "Traders Place",
        "beleg": {
          "url": "https://www.tradersplace.de/wertpapiersuche",
          "stand": "15.09.2026",
          "quelle": "anbieter",
          "domains": [
            "tradersplace.de"
          ]
        }
      },
      {
        "anbieter": "Trading 212",
        "beleg": {
          "url": "https://www.trading212.com/de/trading-instruments/invest",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "trading212.com"
          ]
        }
      }
    ],
    "nichtImAngebot": [
      "Bitpanda",
      "finanzen.net zero",
      "finvesto",
      "ING",
      "tradegate.direct",
      "XTB"
    ],
    "stand": "15.09.2026"
  },
  "IE000UOXRAM8": {
    "kaufbar": [
      {
        "anbieter": "comdirect",
        "beleg": {
          "url": "https://www.comdirect.de/inf/search/all.html",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "comdirect.de"
          ]
        }
      },
      {
        "anbieter": "Consorsbank",
        "beleg": {
          "url": "https://www.consorsbank.de/",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "consorsbank.de"
          ]
        }
      },
      {
        "anbieter": "DEGIRO",
        "beleg": {
          "url": "https://www.degiro.de/preise/etf-core-selection",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "degiro.de"
          ]
        }
      },
      {
        "anbieter": "flatex",
        "beleg": {
          "url": "https://www.flatex.de/produkte-handel/produkte/etfs/ergebnisse/",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "flatex.de"
          ]
        }
      },
      {
        "anbieter": "ING",
        "beleg": {
          "url": "https://wertpapiere.ing.de/",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "ing.de"
          ]
        }
      },
      {
        "anbieter": "Scalable Capital",
        "beleg": {
          "url": "https://de.scalable.capital",
          "stand": "15.09.2026",
          "quelle": "elias",
          "domains": [
            "scalable.capital"
          ]
        }
      },
      {
        "anbieter": "Trade Republic",
        "beleg": {
          "url": "https://assets.traderepublic.com/assets/files/DE/Instrument_Universe_DE_de.pdf",
          "stand": "15.09.2026",
          "quelle": "anbieter",
          "domains": [
            "traderepublic.com"
          ]
        }
      },
      {
        "anbieter": "Traders Place",
        "beleg": {
          "url": "https://www.tradersplace.de/wertpapiersuche",
          "stand": "15.09.2026",
          "quelle": "anbieter",
          "domains": [
            "tradersplace.de"
          ]
        }
      },
      {
        "anbieter": "Trading 212",
        "beleg": {
          "url": "https://www.trading212.com/de/trading-instruments/invest",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "trading212.com"
          ]
        }
      },
      {
        "anbieter": "XTB",
        "beleg": {
          "url": "https://xtb.com/de/Einzelaufstellung-der-Finanzinstrumente_OMI_aktuell.pdf",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "xtb.com"
          ]
        }
      }
    ],
    "nichtImAngebot": [
      "Bitpanda",
      "finanzen.net zero",
      "finvesto"
    ],
    "stand": "15.09.2026"
  },
  "IE000X9FTI22": {
    "kaufbar": [
      {
        "anbieter": "Consorsbank",
        "beleg": {
          "url": "https://www.consorsbank.de/",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "consorsbank.de"
          ]
        }
      },
      {
        "anbieter": "Scalable Capital",
        "beleg": {
          "url": "https://de.scalable.capital",
          "stand": "15.09.2026",
          "quelle": "elias",
          "domains": [
            "scalable.capital"
          ]
        }
      },
      {
        "anbieter": "Traders Place",
        "beleg": {
          "url": "https://www.tradersplace.de/wertpapiersuche",
          "stand": "15.09.2026",
          "quelle": "anbieter",
          "domains": [
            "tradersplace.de"
          ]
        }
      },
      {
        "anbieter": "Trading 212",
        "beleg": {
          "url": "https://www.trading212.com/de/trading-instruments/invest",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "trading212.com"
          ]
        }
      }
    ],
    "nichtImAngebot": [
      "Bitpanda",
      "finanzen.net zero",
      "finvesto",
      "ING",
      "Trade Republic",
      "XTB"
    ],
    "stand": "15.09.2026"
  },
  "IE00B27YCN58": {
    "kaufbar": [
      {
        "anbieter": "1822direkt",
        "beleg": {
          "url": "https://www.1822direkt.de/fileadmin/Home/Dokumente/PDF/Wertpapiere/1822direkt-etf-sparplanliste-aktuell.pdf",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "1822direkt.de"
          ]
        }
      },
      {
        "anbieter": "comdirect",
        "beleg": {
          "url": "https://www.comdirect.de/inf/search/all.html",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "comdirect.de"
          ]
        }
      },
      {
        "anbieter": "Consorsbank",
        "beleg": {
          "url": "https://www.consorsbank.de/",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "consorsbank.de"
          ]
        }
      },
      {
        "anbieter": "DEGIRO",
        "beleg": {
          "url": "https://www.degiro.de/preise/etf-core-selection",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "degiro.de"
          ]
        }
      },
      {
        "anbieter": "finanzen.net zero",
        "beleg": {
          "url": "https://mein.finanzen-zero.net/handelbare-produkte",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "finanzen.net",
            "finanzen-zero.net"
          ]
        }
      },
      {
        "anbieter": "finvesto",
        "beleg": {
          "url": "https://portal.fnz.de/finvesto-md/p/Fonds/",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "finvesto.de",
            "fnz.de"
          ]
        }
      },
      {
        "anbieter": "flatex",
        "beleg": {
          "url": "https://www.flatex.de/produkte-handel/produkte/etfs/ergebnisse/",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "flatex.de"
          ]
        }
      },
      {
        "anbieter": "ING",
        "beleg": {
          "url": "https://wertpapiere.ing.de/",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "ing.de"
          ]
        }
      },
      {
        "anbieter": "maxblue Wertpapier-Sparplan",
        "beleg": {
          "url": "https://www.maxblue.de/dam/maxblue/de/files/pdf/Sparplanliste_ETFs.pdf",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "maxblue.de"
          ]
        }
      },
      {
        "anbieter": "Scalable Capital",
        "beleg": {
          "url": "https://de.scalable.capital",
          "stand": "15.09.2026",
          "quelle": "elias",
          "domains": [
            "scalable.capital"
          ]
        }
      },
      {
        "anbieter": "Trade Republic",
        "beleg": {
          "url": "https://assets.traderepublic.com/assets/files/DE/Instrument_Universe_DE_de.pdf",
          "stand": "15.09.2026",
          "quelle": "anbieter",
          "domains": [
            "traderepublic.com"
          ]
        }
      },
      {
        "anbieter": "Traders Place",
        "beleg": {
          "url": "https://www.tradersplace.de/wertpapiersuche",
          "stand": "15.09.2026",
          "quelle": "anbieter",
          "domains": [
            "tradersplace.de"
          ]
        }
      },
      {
        "anbieter": "Trading 212",
        "beleg": {
          "url": "https://www.trading212.com/de/trading-instruments/invest",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "trading212.com"
          ]
        }
      },
      {
        "anbieter": "XTB",
        "beleg": {
          "url": "https://xtb.com/de/Einzelaufstellung-der-Finanzinstrumente_OMI_aktuell.pdf",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "xtb.com"
          ]
        }
      }
    ],
    "nichtImAngebot": [
      "Bitpanda"
    ],
    "stand": "15.09.2026"
  },
  "IE00B27YCP72": {
    "kaufbar": [
      {
        "anbieter": "1822direkt",
        "beleg": {
          "url": "https://www.1822direkt.de/fileadmin/Home/Dokumente/PDF/Wertpapiere/1822direkt-etf-sparplanliste-aktuell.pdf",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "1822direkt.de"
          ]
        }
      },
      {
        "anbieter": "comdirect",
        "beleg": {
          "url": "https://www.comdirect.de/inf/search/all.html",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "comdirect.de"
          ]
        }
      },
      {
        "anbieter": "Consorsbank",
        "beleg": {
          "url": "https://www.consorsbank.de/",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "consorsbank.de"
          ]
        }
      },
      {
        "anbieter": "finanzen.net zero",
        "beleg": {
          "url": "https://mein.finanzen-zero.net/handelbare-produkte",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "finanzen.net",
            "finanzen-zero.net"
          ]
        }
      },
      {
        "anbieter": "finvesto",
        "beleg": {
          "url": "https://portal.fnz.de/finvesto-md/p/Fonds/",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "finvesto.de",
            "fnz.de"
          ]
        }
      },
      {
        "anbieter": "flatex",
        "beleg": {
          "url": "https://www.flatex.de/produkte-handel/produkte/etfs/ergebnisse/",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "flatex.de"
          ]
        }
      },
      {
        "anbieter": "ING",
        "beleg": {
          "url": "https://wertpapiere.ing.de/",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "ing.de"
          ]
        }
      },
      {
        "anbieter": "Scalable Capital",
        "beleg": {
          "url": "https://de.scalable.capital",
          "stand": "15.09.2026",
          "quelle": "elias",
          "domains": [
            "scalable.capital"
          ]
        }
      },
      {
        "anbieter": "Trade Republic",
        "beleg": {
          "url": "https://assets.traderepublic.com/assets/files/DE/Instrument_Universe_DE_de.pdf",
          "stand": "15.09.2026",
          "quelle": "anbieter",
          "domains": [
            "traderepublic.com"
          ]
        }
      },
      {
        "anbieter": "Traders Place",
        "beleg": {
          "url": "https://www.tradersplace.de/wertpapiersuche",
          "stand": "15.09.2026",
          "quelle": "anbieter",
          "domains": [
            "tradersplace.de"
          ]
        }
      },
      {
        "anbieter": "Trading 212",
        "beleg": {
          "url": "https://www.trading212.com/de/trading-instruments/invest",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "trading212.com"
          ]
        }
      },
      {
        "anbieter": "XTB",
        "beleg": {
          "url": "https://xtb.com/de/Einzelaufstellung-der-Finanzinstrumente_OMI_aktuell.pdf",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "xtb.com"
          ]
        }
      }
    ],
    "nichtImAngebot": [
      "Bitpanda"
    ],
    "stand": "15.09.2026"
  },
  "IE00B296QM64": {
    "kaufbar": [
      {
        "anbieter": "1822direkt",
        "beleg": {
          "url": "https://www.1822direkt.de/fileadmin/Home/Dokumente/PDF/Wertpapiere/1822direkt-etf-sparplanliste-aktuell.pdf",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "1822direkt.de"
          ]
        }
      },
      {
        "anbieter": "comdirect",
        "beleg": {
          "url": "https://www.comdirect.de/inf/search/all.html",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "comdirect.de"
          ]
        }
      },
      {
        "anbieter": "Consorsbank",
        "beleg": {
          "url": "https://www.consorsbank.de/",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "consorsbank.de"
          ]
        }
      },
      {
        "anbieter": "DEGIRO",
        "beleg": {
          "url": "https://www.degiro.de/preise/etf-core-selection",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "degiro.de"
          ]
        }
      },
      {
        "anbieter": "finanzen.net zero",
        "beleg": {
          "url": "https://mein.finanzen-zero.net/handelbare-produkte",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "finanzen.net",
            "finanzen-zero.net"
          ]
        }
      },
      {
        "anbieter": "finvesto",
        "beleg": {
          "url": "https://portal.fnz.de/finvesto-md/p/Fonds/",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "finvesto.de",
            "fnz.de"
          ]
        }
      },
      {
        "anbieter": "flatex",
        "beleg": {
          "url": "https://www.flatex.de/produkte-handel/produkte/etfs/ergebnisse/",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "flatex.de"
          ]
        }
      },
      {
        "anbieter": "ING",
        "beleg": {
          "url": "https://wertpapiere.ing.de/",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "ing.de"
          ]
        }
      },
      {
        "anbieter": "Scalable Capital",
        "beleg": {
          "url": "https://de.scalable.capital",
          "stand": "15.09.2026",
          "quelle": "elias",
          "domains": [
            "scalable.capital"
          ]
        }
      },
      {
        "anbieter": "Trade Republic",
        "beleg": {
          "url": "https://assets.traderepublic.com/assets/files/DE/Instrument_Universe_DE_de.pdf",
          "stand": "15.09.2026",
          "quelle": "anbieter",
          "domains": [
            "traderepublic.com"
          ]
        }
      },
      {
        "anbieter": "Traders Place",
        "beleg": {
          "url": "https://www.tradersplace.de/wertpapiersuche",
          "stand": "15.09.2026",
          "quelle": "anbieter",
          "domains": [
            "tradersplace.de"
          ]
        }
      },
      {
        "anbieter": "Trading 212",
        "beleg": {
          "url": "https://www.trading212.com/de/trading-instruments/invest",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "trading212.com"
          ]
        }
      },
      {
        "anbieter": "XTB",
        "beleg": {
          "url": "https://xtb.com/de/Einzelaufstellung-der-Finanzinstrumente_OMI_aktuell.pdf",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "xtb.com"
          ]
        }
      }
    ],
    "nichtImAngebot": [
      "Bitpanda"
    ],
    "stand": "15.09.2026"
  },
  "IE00B43VDT70": {
    "kaufbar": [
      {
        "anbieter": "comdirect",
        "beleg": {
          "url": "https://www.comdirect.de/inf/search/all.html",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "comdirect.de"
          ]
        }
      },
      {
        "anbieter": "Consorsbank",
        "beleg": {
          "url": "https://www.consorsbank.de/",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "consorsbank.de"
          ]
        }
      },
      {
        "anbieter": "DEGIRO",
        "beleg": {
          "url": "https://www.degiro.de/preise/etf-core-selection",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "degiro.de"
          ]
        }
      },
      {
        "anbieter": "ING",
        "beleg": {
          "url": "https://wertpapiere.ing.de/",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "ing.de"
          ]
        }
      },
      {
        "anbieter": "Trade Republic",
        "beleg": {
          "url": "https://assets.traderepublic.com/assets/files/DE/Instrument_Universe_DE_de.pdf",
          "stand": "15.09.2026",
          "quelle": "anbieter",
          "domains": [
            "traderepublic.com"
          ]
        }
      },
      {
        "anbieter": "Traders Place",
        "beleg": {
          "url": "https://www.tradersplace.de/wertpapiersuche",
          "stand": "15.09.2026",
          "quelle": "anbieter",
          "domains": [
            "tradersplace.de"
          ]
        }
      },
      {
        "anbieter": "Trading 212",
        "beleg": {
          "url": "https://www.trading212.com/de/trading-instruments/invest",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "trading212.com"
          ]
        }
      }
    ],
    "nichtImAngebot": [
      "Bitpanda",
      "finanzen.net zero",
      "XTB"
    ],
    "stand": "15.09.2026"
  },
  "IE00B4ZJ4634": {
    "kaufbar": [
      {
        "anbieter": "comdirect",
        "hinweis": "Ausgabeaufschlag mit Rabatt",
        "beleg": {
          "url": "https://www.comdirect.de/inf/search/all.html",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "comdirect.de"
          ]
        }
      },
      {
        "anbieter": "Consorsbank",
        "beleg": {
          "url": "https://www.consorsbank.de/",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "consorsbank.de"
          ]
        }
      },
      {
        "anbieter": "finanzen.net zero",
        "beleg": {
          "url": "https://mein.finanzen-zero.net/handelbare-produkte",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "finanzen.net",
            "finanzen-zero.net"
          ]
        }
      },
      {
        "anbieter": "finvesto",
        "beleg": {
          "url": "https://portal.fnz.de/finvesto-md/p/Fonds/",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "finvesto.de",
            "fnz.de"
          ]
        }
      },
      {
        "anbieter": "flatex",
        "hinweis": "Ausgabeaufschlag mit Rabatt",
        "beleg": {
          "url": "https://www.flatex.de/produkte-handel/produkte/etfs/ergebnisse/",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "flatex.de"
          ]
        }
      },
      {
        "anbieter": "ING",
        "hinweis": "Ausgabeaufschlag mit Rabatt",
        "beleg": {
          "url": "https://wertpapiere.ing.de/",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "ing.de"
          ]
        }
      },
      {
        "anbieter": "Scalable Capital",
        "beleg": {
          "url": "https://de.scalable.capital",
          "stand": "15.09.2026",
          "quelle": "elias",
          "domains": [
            "scalable.capital"
          ]
        }
      },
      {
        "anbieter": "Traders Place",
        "beleg": {
          "url": "https://www.tradersplace.de/wertpapiersuche",
          "stand": "15.09.2026",
          "quelle": "anbieter",
          "domains": [
            "tradersplace.de"
          ]
        }
      }
    ],
    "nichtImAngebot": [
      "Bitpanda",
      "Trade Republic",
      "tradegate.direct",
      "Trading 212",
      "XTB"
    ],
    "stand": "15.09.2026"
  },
  "IE00B579F325": {
    "kaufbar": [
      {
        "anbieter": "comdirect",
        "beleg": {
          "url": "https://www.comdirect.de/inf/search/all.html",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "comdirect.de"
          ]
        }
      },
      {
        "anbieter": "Consorsbank",
        "beleg": {
          "url": "https://www.consorsbank.de/",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "consorsbank.de"
          ]
        }
      },
      {
        "anbieter": "DEGIRO",
        "beleg": {
          "url": "https://www.degiro.de/preise/etf-core-selection",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "degiro.de"
          ]
        }
      },
      {
        "anbieter": "ING",
        "beleg": {
          "url": "https://wertpapiere.ing.de/",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "ing.de"
          ]
        }
      },
      {
        "anbieter": "Traders Place",
        "beleg": {
          "url": "https://www.tradersplace.de/wertpapiersuche",
          "stand": "15.09.2026",
          "quelle": "anbieter",
          "domains": [
            "tradersplace.de"
          ]
        }
      },
      {
        "anbieter": "Trading 212",
        "beleg": {
          "url": "https://www.trading212.com/de/trading-instruments/invest",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "trading212.com"
          ]
        }
      },
      {
        "anbieter": "XTB",
        "beleg": {
          "url": "https://xtb.com/de/Einzelaufstellung-der-Finanzinstrumente_OMI_aktuell.pdf",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "xtb.com"
          ]
        }
      }
    ],
    "nichtImAngebot": [
      "Bitpanda",
      "finanzen.net zero"
    ],
    "stand": "15.09.2026"
  },
  "IE00BMYMHS24": {
    "kaufbar": [
      {
        "anbieter": "1822direkt",
        "beleg": {
          "url": "https://www.1822direkt.de/fileadmin/Home/Dokumente/PDF/Wertpapiere/1822direkt-etf-sparplanliste-aktuell.pdf",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "1822direkt.de"
          ]
        }
      },
      {
        "anbieter": "Bitpanda",
        "beleg": {
          "url": "https://www.bitpanda.com/en/prices",
          "stand": "15.09.2026",
          "quelle": "anbieter",
          "domains": [
            "bitpanda.com"
          ]
        }
      },
      {
        "anbieter": "comdirect",
        "beleg": {
          "url": "https://www.comdirect.de/inf/search/all.html",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "comdirect.de"
          ]
        }
      },
      {
        "anbieter": "Consorsbank",
        "beleg": {
          "url": "https://www.consorsbank.de/",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "consorsbank.de"
          ]
        }
      },
      {
        "anbieter": "finanzen.net zero",
        "beleg": {
          "url": "https://mein.finanzen-zero.net/handelbare-produkte",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "finanzen.net",
            "finanzen-zero.net"
          ]
        }
      },
      {
        "anbieter": "flatex",
        "beleg": {
          "url": "https://www.flatex.de/produkte-handel/produkte/etfs/ergebnisse/",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "flatex.de"
          ]
        }
      },
      {
        "anbieter": "ING",
        "beleg": {
          "url": "https://wertpapiere.ing.de/",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "ing.de"
          ]
        }
      },
      {
        "anbieter": "Scalable Capital",
        "beleg": {
          "url": "https://de.scalable.capital",
          "stand": "15.09.2026",
          "quelle": "elias",
          "domains": [
            "scalable.capital"
          ]
        }
      },
      {
        "anbieter": "Trade Republic",
        "beleg": {
          "url": "https://assets.traderepublic.com/assets/files/DE/Instrument_Universe_DE_de.pdf",
          "stand": "15.09.2026",
          "quelle": "anbieter",
          "domains": [
            "traderepublic.com"
          ]
        }
      },
      {
        "anbieter": "Traders Place",
        "beleg": {
          "url": "https://www.tradersplace.de/wertpapiersuche",
          "stand": "15.09.2026",
          "quelle": "anbieter",
          "domains": [
            "tradersplace.de"
          ]
        }
      },
      {
        "anbieter": "Trading 212",
        "beleg": {
          "url": "https://www.trading212.com/de/trading-instruments/invest",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "trading212.com"
          ]
        }
      }
    ],
    "nichtImAngebot": [
      "finvesto",
      "XTB"
    ],
    "stand": "15.09.2026"
  },
  "JE00B1VS3333": {
    "kaufbar": [
      {
        "anbieter": "comdirect",
        "beleg": {
          "url": "https://www.comdirect.de/inf/search/all.html",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "comdirect.de"
          ]
        }
      },
      {
        "anbieter": "Consorsbank",
        "beleg": {
          "url": "https://www.consorsbank.de/",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "consorsbank.de"
          ]
        }
      },
      {
        "anbieter": "DEGIRO",
        "beleg": {
          "url": "https://www.degiro.de/preise/etf-core-selection",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "degiro.de"
          ]
        }
      },
      {
        "anbieter": "finanzen.net zero",
        "beleg": {
          "url": "https://mein.finanzen-zero.net/handelbare-produkte",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "finanzen.net",
            "finanzen-zero.net"
          ]
        }
      },
      {
        "anbieter": "ING",
        "beleg": {
          "url": "https://wertpapiere.ing.de/",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "ing.de"
          ]
        }
      },
      {
        "anbieter": "justTRADE",
        "beleg": {
          "url": "https://www.justtrade.com/alle-sparplaene",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "justtrade.com"
          ]
        }
      },
      {
        "anbieter": "Smartbroker+",
        "beleg": {
          "url": "https://www.smartbrokerplus.de/de-de/edelmetalle-kaufen/",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "smartbrokerplus.de"
          ]
        }
      },
      {
        "anbieter": "Trade Republic",
        "beleg": {
          "url": "https://assets.traderepublic.com/assets/files/DE/Instrument_Universe_DE_de.pdf",
          "stand": "15.09.2026",
          "quelle": "anbieter",
          "domains": [
            "traderepublic.com"
          ]
        }
      },
      {
        "anbieter": "Traders Place",
        "beleg": {
          "url": "https://www.tradersplace.de/wertpapiersuche",
          "stand": "15.09.2026",
          "quelle": "anbieter",
          "domains": [
            "tradersplace.de"
          ]
        }
      },
      {
        "anbieter": "Trading 212",
        "beleg": {
          "url": "https://www.trading212.com/de/trading-instruments/invest",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "trading212.com"
          ]
        }
      }
    ],
    "nichtImAngebot": [
      "Bitpanda",
      "XTB"
    ],
    "stand": "15.09.2026"
  },
  "JE00B1VS3770": {
    "kaufbar": [
      {
        "anbieter": "comdirect",
        "beleg": {
          "url": "https://www.comdirect.de/inf/search/all.html",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "comdirect.de"
          ]
        }
      },
      {
        "anbieter": "Consorsbank",
        "beleg": {
          "url": "https://www.consorsbank.de/",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "consorsbank.de"
          ]
        }
      },
      {
        "anbieter": "DEGIRO",
        "beleg": {
          "url": "https://www.degiro.de/preise/etf-core-selection",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "degiro.de"
          ]
        }
      },
      {
        "anbieter": "finanzen.net zero",
        "beleg": {
          "url": "https://mein.finanzen-zero.net/handelbare-produkte",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "finanzen.net",
            "finanzen-zero.net"
          ]
        }
      },
      {
        "anbieter": "ING",
        "beleg": {
          "url": "https://wertpapiere.ing.de/",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "ing.de"
          ]
        }
      },
      {
        "anbieter": "Trade Republic",
        "beleg": {
          "url": "https://assets.traderepublic.com/assets/files/DE/Instrument_Universe_DE_de.pdf",
          "stand": "15.09.2026",
          "quelle": "anbieter",
          "domains": [
            "traderepublic.com"
          ]
        }
      },
      {
        "anbieter": "Traders Place",
        "beleg": {
          "url": "https://www.tradersplace.de/wertpapiersuche",
          "stand": "15.09.2026",
          "quelle": "anbieter",
          "domains": [
            "tradersplace.de"
          ]
        }
      },
      {
        "anbieter": "Trading 212",
        "beleg": {
          "url": "https://www.trading212.com/de/trading-instruments/invest",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "trading212.com"
          ]
        }
      },
      {
        "anbieter": "XTB",
        "beleg": {
          "url": "https://xtb.com/de/Einzelaufstellung-der-Finanzinstrumente_OMI_aktuell.pdf",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "xtb.com"
          ]
        }
      }
    ],
    "nichtImAngebot": [
      "Bitpanda"
    ],
    "stand": "15.09.2026"
  },
  "JE00B588CD74": {
    "kaufbar": [
      {
        "anbieter": "comdirect",
        "beleg": {
          "url": "https://www.comdirect.de/inf/search/all.html",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "comdirect.de"
          ]
        }
      },
      {
        "anbieter": "Consorsbank",
        "beleg": {
          "url": "https://www.consorsbank.de/",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "consorsbank.de"
          ]
        }
      },
      {
        "anbieter": "DEGIRO",
        "beleg": {
          "url": "https://www.degiro.de/preise/etf-core-selection",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "degiro.de"
          ]
        }
      },
      {
        "anbieter": "finanzen.net zero",
        "beleg": {
          "url": "https://mein.finanzen-zero.net/handelbare-produkte",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "finanzen.net",
            "finanzen-zero.net"
          ]
        }
      },
      {
        "anbieter": "ING",
        "beleg": {
          "url": "https://wertpapiere.ing.de/",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "ing.de"
          ]
        }
      },
      {
        "anbieter": "Smartbroker+",
        "beleg": {
          "url": "https://www.smartbrokerplus.de/de-de/edelmetalle-kaufen/",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "smartbrokerplus.de"
          ]
        }
      },
      {
        "anbieter": "Trade Republic",
        "beleg": {
          "url": "https://assets.traderepublic.com/assets/files/DE/Instrument_Universe_DE_de.pdf",
          "stand": "15.09.2026",
          "quelle": "anbieter",
          "domains": [
            "traderepublic.com"
          ]
        }
      },
      {
        "anbieter": "Traders Place",
        "beleg": {
          "url": "https://www.tradersplace.de/wertpapiersuche",
          "stand": "15.09.2026",
          "quelle": "anbieter",
          "domains": [
            "tradersplace.de"
          ]
        }
      },
      {
        "anbieter": "Trading 212",
        "beleg": {
          "url": "https://www.trading212.com/de/trading-instruments/invest",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "trading212.com"
          ]
        }
      }
    ],
    "nichtImAngebot": [
      "Bitpanda",
      "XTB"
    ],
    "stand": "15.09.2026"
  },
  "JE00BN2CJ301": {
    "kaufbar": [
      {
        "anbieter": "comdirect",
        "beleg": {
          "url": "https://www.comdirect.de/inf/search/all.html",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "comdirect.de"
          ]
        }
      },
      {
        "anbieter": "Consorsbank",
        "beleg": {
          "url": "https://www.consorsbank.de/",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "consorsbank.de"
          ]
        }
      },
      {
        "anbieter": "DEGIRO",
        "beleg": {
          "url": "https://www.degiro.de/preise/etf-core-selection",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "degiro.de"
          ]
        }
      },
      {
        "anbieter": "finanzen.net zero",
        "beleg": {
          "url": "https://mein.finanzen-zero.net/handelbare-produkte",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "finanzen.net",
            "finanzen-zero.net"
          ]
        }
      },
      {
        "anbieter": "flatex",
        "beleg": {
          "url": "https://www.flatex.de/produkte-handel/produkte/etfs/ergebnisse/?cHash=a629a532ba7f92ac455e4868a4c76452&tx_ftfondssearch_search%5Bcategory%5D=1&tx_ftfondssearch_search%5Bisin%5D=&tx_ftfondssearch_search%5Bpublisher%5D=&tx_ftfondssearch_search%5Brisk%5D=&tx_ftfondssearch_search%5Bsavingplan%5D=&tx_ftfondssearch_search%5Btitle%5D=",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "flatex.de"
          ]
        }
      },
      {
        "anbieter": "ING",
        "beleg": {
          "url": "https://wertpapiere.ing.de/",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "ing.de"
          ]
        }
      },
      {
        "anbieter": "justTRADE",
        "beleg": {
          "url": "https://www.justtrade.com/alle-sparplaene",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "justtrade.com"
          ]
        }
      },
      {
        "anbieter": "Trade Republic",
        "beleg": {
          "url": "https://assets.traderepublic.com/assets/files/DE/Instrument_Universe_DE_de.pdf",
          "stand": "15.09.2026",
          "quelle": "anbieter",
          "domains": [
            "traderepublic.com"
          ]
        }
      },
      {
        "anbieter": "Traders Place",
        "beleg": {
          "url": "https://www.tradersplace.de/wertpapiersuche",
          "stand": "15.09.2026",
          "quelle": "anbieter",
          "domains": [
            "tradersplace.de"
          ]
        }
      },
      {
        "anbieter": "Trading 212",
        "beleg": {
          "url": "https://www.trading212.com/de/trading-instruments/invest",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "trading212.com"
          ]
        }
      },
      {
        "anbieter": "XTB",
        "beleg": {
          "url": "https://xtb.com/de/Einzelaufstellung-der-Finanzinstrumente_OMI_aktuell.pdf",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "xtb.com"
          ]
        }
      }
    ],
    "nichtImAngebot": [
      "Bitpanda"
    ],
    "stand": "15.09.2026"
  },
  "JE00BQRFDY49": {
    "kaufbar": [
      {
        "anbieter": "Bison",
        "beleg": {
          "url": "https://bisonapp.com/aktien-etfs/meistgehandelte-etfs-monat/",
          "stand": "15.09.2026",
          "quelle": "anbieter",
          "domains": [
            "bisonapp.com"
          ]
        }
      },
      {
        "anbieter": "comdirect",
        "beleg": {
          "url": "https://www.comdirect.de/inf/search/all.html",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "comdirect.de"
          ]
        }
      },
      {
        "anbieter": "Consorsbank",
        "beleg": {
          "url": "https://www.consorsbank.de/",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "consorsbank.de"
          ]
        }
      },
      {
        "anbieter": "finanzen.net zero",
        "beleg": {
          "url": "https://mein.finanzen-zero.net/handelbare-produkte",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "finanzen.net",
            "finanzen-zero.net"
          ]
        }
      },
      {
        "anbieter": "flatex",
        "beleg": {
          "url": "https://www.flatex.de/produkte-handel/produkte/etfs/ergebnisse/?cHash=a629a532ba7f92ac455e4868a4c76452&tx_ftfondssearch_search%5Bcategory%5D=1&tx_ftfondssearch_search%5Bisin%5D=&tx_ftfondssearch_search%5Bpublisher%5D=&tx_ftfondssearch_search%5Brisk%5D=&tx_ftfondssearch_search%5Bsavingplan%5D=&tx_ftfondssearch_search%5Btitle%5D=",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "flatex.de"
          ]
        }
      },
      {
        "anbieter": "ING",
        "beleg": {
          "url": "https://wertpapiere.ing.de/",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "ing.de"
          ]
        }
      },
      {
        "anbieter": "justTRADE",
        "beleg": {
          "url": "https://www.justtrade.com/alle-sparplaene",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "justtrade.com"
          ]
        }
      },
      {
        "anbieter": "Trade Republic",
        "beleg": {
          "url": "https://assets.traderepublic.com/assets/files/DE/Instrument_Universe_DE_de.pdf",
          "stand": "15.09.2026",
          "quelle": "anbieter",
          "domains": [
            "traderepublic.com"
          ]
        }
      },
      {
        "anbieter": "Traders Place",
        "beleg": {
          "url": "https://www.tradersplace.de/wertpapiersuche",
          "stand": "15.09.2026",
          "quelle": "anbieter",
          "domains": [
            "tradersplace.de"
          ]
        }
      },
      {
        "anbieter": "Trading 212",
        "beleg": {
          "url": "https://www.trading212.com/de/trading-instruments/invest",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "trading212.com"
          ]
        }
      },
      {
        "anbieter": "XTB",
        "beleg": {
          "url": "https://xtb.com/de/Einzelaufstellung-der-Finanzinstrumente_OMI_aktuell.pdf",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "xtb.com"
          ]
        }
      }
    ],
    "nichtImAngebot": [
      "Bitpanda"
    ],
    "stand": "15.09.2026"
  },
  "LU1150255971": {
    "kaufbar": [
      {
        "anbieter": "comdirect",
        "hinweis": "ohne Ausgabeaufschlag",
        "beleg": {
          "url": "https://www.comdirect.de/inf/search/all.html",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "comdirect.de"
          ]
        }
      },
      {
        "anbieter": "Consorsbank",
        "beleg": {
          "url": "https://www.consorsbank.de/",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "consorsbank.de"
          ]
        }
      },
      {
        "anbieter": "finvesto",
        "beleg": {
          "url": "https://portal.fnz.de/finvesto-md/p/Fonds/",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "finvesto.de",
            "fnz.de"
          ]
        }
      },
      {
        "anbieter": "flatex",
        "hinweis": "Ausgabeaufschlag mit Rabatt",
        "beleg": {
          "url": "https://www.flatex.de/produkte-handel/produkte/etfs/ergebnisse/",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "flatex.de"
          ]
        }
      },
      {
        "anbieter": "ING",
        "beleg": {
          "url": "https://wertpapiere.ing.de/",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "ing.de"
          ]
        }
      },
      {
        "anbieter": "Traders Place",
        "beleg": {
          "url": "https://www.tradersplace.de/wertpapiersuche",
          "stand": "15.09.2026",
          "quelle": "anbieter",
          "domains": [
            "tradersplace.de"
          ]
        }
      }
    ],
    "nichtImAngebot": [
      "Bitpanda",
      "finanzen.net zero",
      "Trade Republic",
      "tradegate.direct",
      "Trading 212",
      "XTB"
    ],
    "stand": "15.09.2026"
  },
  "LU2458330086": {
    "kaufbar": [
      {
        "anbieter": "comdirect",
        "hinweis": "Ausgabeaufschlag mit Rabatt",
        "beleg": {
          "url": "https://www.comdirect.de/inf/search/all.html",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "comdirect.de"
          ]
        }
      },
      {
        "anbieter": "flatex",
        "hinweis": "Ausgabeaufschlag mit Rabatt",
        "beleg": {
          "url": "https://www.flatex.de/produkte-handel/produkte/etfs/ergebnisse/",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "flatex.de"
          ]
        }
      },
      {
        "anbieter": "ING",
        "beleg": {
          "url": "https://wertpapiere.ing.de/",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "ing.de"
          ]
        }
      },
      {
        "anbieter": "Scalable Capital",
        "beleg": {
          "url": "https://de.scalable.capital",
          "stand": "15.09.2026",
          "quelle": "elias",
          "domains": [
            "scalable.capital"
          ]
        }
      },
      {
        "anbieter": "Traders Place",
        "beleg": {
          "url": "https://www.tradersplace.de/wertpapiersuche",
          "stand": "15.09.2026",
          "quelle": "anbieter",
          "domains": [
            "tradersplace.de"
          ]
        }
      }
    ],
    "nichtImAngebot": [
      "Bitpanda",
      "finanzen.net zero",
      "Trade Republic",
      "tradegate.direct",
      "Trading 212",
      "XTB"
    ],
    "stand": "15.09.2026"
  },
  "LU3123443510": {
    "kaufbar": [
      {
        "anbieter": "1822direkt",
        "beleg": {
          "url": "https://www.1822direkt.de/fileadmin/Home/Dokumente/PDF/Wertpapiere/1822direkt-etf-sparplanliste-aktuell.pdf",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "1822direkt.de"
          ]
        }
      },
      {
        "anbieter": "comdirect",
        "beleg": {
          "url": "https://www.comdirect.de/inf/search/all.html",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "comdirect.de"
          ]
        }
      },
      {
        "anbieter": "Consorsbank",
        "beleg": {
          "url": "https://www.consorsbank.de/",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "consorsbank.de"
          ]
        }
      },
      {
        "anbieter": "finanzen.net zero",
        "beleg": {
          "url": "https://mein.finanzen-zero.net/handelbare-produkte",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "finanzen.net",
            "finanzen-zero.net"
          ]
        }
      },
      {
        "anbieter": "Traders Place",
        "beleg": {
          "url": "https://www.tradersplace.de/wertpapiersuche",
          "stand": "15.09.2026",
          "quelle": "anbieter",
          "domains": [
            "tradersplace.de"
          ]
        }
      },
      {
        "anbieter": "Trading 212",
        "beleg": {
          "url": "https://www.trading212.com/de/trading-instruments/invest",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "trading212.com"
          ]
        }
      }
    ],
    "nichtImAngebot": [
      "Bitpanda",
      "finvesto",
      "ING",
      "Trade Republic",
      "XTB"
    ],
    "stand": "15.09.2026"
  },
  "XS3384723154": {
    "kaufbar": [
      {
        "anbieter": "comdirect",
        "beleg": {
          "url": "https://www.comdirect.de/inf/search/all.html",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "comdirect.de"
          ]
        }
      },
      {
        "anbieter": "Consorsbank",
        "beleg": {
          "url": "https://www.consorsbank.de/",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "consorsbank.de"
          ]
        }
      },
      {
        "anbieter": "Traders Place",
        "beleg": {
          "url": "https://www.tradersplace.de/wertpapiersuche",
          "stand": "15.09.2026",
          "quelle": "anbieter",
          "domains": [
            "tradersplace.de"
          ]
        }
      },
      {
        "anbieter": "Trading 212",
        "beleg": {
          "url": "https://www.trading212.com/de/trading-instruments/invest",
          "stand": "14.09.2026",
          "quelle": "anbieter",
          "domains": [
            "trading212.com"
          ]
        }
      }
    ],
    "nichtImAngebot": [
      "Bitpanda",
      "finanzen.net zero",
      "XTB"
    ],
    "stand": "15.09.2026"
  }
};

export const ANLAGEN_KAUFBAR: Record<string, AnlageKaufbar> = Object.fromEntries(
  Object.entries(ANLAGEN_KAUFBAR_ROH).map(([isin, eintrag]) => {
    const gesperrt = KAUFBAR_UNKLAR[isin] ?? [];
    return [isin, gesperrt.length ? { ...eintrag, kaufbar: eintrag.kaufbar.filter((x) => !gesperrt.includes(x.anbieter)) } : eintrag];
  }),
);
