// ERZEUGT von ~/rebrand/data/vergleiche/bauen.py aus recherche/anlagen.json. Nicht von Hand ändern.
// Je ISIN: bei welchen Anbietern die Anlage laut Wertpapiersuche oder Produktliste kaufbar ist.
// Fehlt ein Anbieter, ist er noch nicht geprüft.
// Vollprüfung ab 20.09.2026: "kaufbar" steht nur mit Einzelbeleg vom Anbieter selbst (beleg.url
// liegt auf beleg.domain). Ohne Beleg wird die Zeile weggelassen, nicht als kaufbar gezeigt.

import { KAUFBAR_UNKLAR } from "./vergleichKorrekturenDaten";

export type AnlageKaufbar = {
  kaufbar: {
    anbieter: string;
    /** Schlüssel in recherche/anlagen.json, gleich `haus` bzw. Finanzfluss-Produkt der Vergleichszeile. */
    haus: string;
    /** Alle Haeuser mit diesem Anzeigenamen und Beleg (z. B. Scalable FREE und PRIME+), nur wenn mehr als eins. */
    haeuser?: string[];
    hinweis?: string;
    beleg: { url: string; stand: string; quelle: string; domains: string[]; herkunft?: string };
  }[];
  nichtImAngebot: string[];
  stand: string;
};

/** Die 22 Halal-Anlagen des Depot-Vergleichs und ihre Zeile (auftraege/halal-isins.json). */
export const ANLAGE_ZEILE: Record<string, "halalEtfsFonds" | "halalSukuk" | "halalEdelmetalle"> = {
  "IE00B27YCN58": "halalEtfsFonds",
  "IE00B27YCP72": "halalEtfsFonds",
  "IE00B296QM64": "halalEtfsFonds",
  "IE000UOXRAM8": "halalEtfsFonds",
  "IE000LFC57H7": "halalEtfsFonds",
  "IE000X9FTI22": "halalEtfsFonds",
  "IE000I5NV504": "halalEtfsFonds",
  "IE000AGFZM58": "halalEtfsFonds",
  "IE0009BC6K22": "halalEtfsFonds",
  "IE00BMYMHS24": "halalEtfsFonds",
  "IE000929U2U9": "halalSukuk",
  "LU3123443510": "halalSukuk",
  "LU1150255971": "halalSukuk",
  "IE00B579F325": "halalEdelmetalle",
  "JE00B1VS3770": "halalEdelmetalle",
  "JE00BN2CJ301": "halalEdelmetalle",
  "JE00B588CD74": "halalEdelmetalle",
  "IE00B43VDT70": "halalEdelmetalle",
  "JE00B1VS3333": "halalEdelmetalle",
  "JE00BQRFDY49": "halalEdelmetalle",
  "IE00B4ZJ4634": "halalEtfsFonds",
  "LU2458330086": "halalEtfsFonds"
};

const ANLAGEN_KAUFBAR_ROH: Record<string, AnlageKaufbar> = {
  "IE000929U2U9": {
    "kaufbar": [
      {
        "anbieter": "comdirect",
        "haus": "comdirect",
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
        "haus": "consorsbank",
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
        "haus": "degiro",
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
        "haus": "finanzen-net-zero",
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
        "haus": "ing",
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
        "haus": "scalable",
        "haeuser": [
          "scalable",
          "scalable-prime"
        ],
        "beleg": {
          "url": "https://www.justetf.com/de/search.html?search=ETFS&spc=96&ls=any",
          "stand": "25.09.2026",
          "quelle": "anbieter",
          "domains": [
            "scalable.capital"
          ],
          "herkunft": "https://de.scalable.capital/trading"
        }
      },
      {
        "anbieter": "Smartbroker+",
        "haus": "smartbroker",
        "beleg": {
          "url": "https://www.smartbrokerplus.de/api/data/tradeable-assets/?q=IE000929U2U9",
          "stand": "25.09.2026",
          "quelle": "anbieter",
          "domains": [
            "smartbrokerplus.de"
          ]
        }
      },
      {
        "anbieter": "Trade Republic",
        "haus": "trade-republic",
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
        "anbieter": "Trading 212",
        "haus": "trading212",
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
      "Bux Basic",
      "Bux Plus",
      "Bux Prime",
      "finvesto",
      "XTB"
    ],
    "stand": "25.09.2026"
  },
  "IE0009BC6K22": {
    "kaufbar": [
      {
        "anbieter": "Consorsbank",
        "haus": "consorsbank",
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
        "haus": "scalable",
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
        "anbieter": "Trading 212",
        "haus": "trading212",
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
      "Bux Basic",
      "Bux Plus",
      "Bux Prime",
      "finanzen.net zero",
      "finvesto",
      "ING",
      "Trade Republic",
      "XTB"
    ],
    "stand": "25.09.2026"
  },
  "IE000AGFZM58": {
    "kaufbar": [
      {
        "anbieter": "Consorsbank",
        "haus": "consorsbank",
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
        "haus": "scalable",
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
        "anbieter": "Trading 212",
        "haus": "trading212",
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
        "haus": "xtb",
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
      "Bux Basic",
      "Bux Plus",
      "Bux Prime",
      "finanzen.net zero",
      "finvesto",
      "ING",
      "Trade Republic"
    ],
    "stand": "25.09.2026"
  },
  "IE000I5NV504": {
    "kaufbar": [
      {
        "anbieter": "Consorsbank",
        "haus": "consorsbank",
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
        "haus": "scalable",
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
        "anbieter": "Trading 212",
        "haus": "trading212",
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
      "Bux Basic",
      "Bux Plus",
      "Bux Prime",
      "finanzen.net zero",
      "finvesto",
      "ING",
      "Trade Republic",
      "XTB"
    ],
    "stand": "25.09.2026"
  },
  "IE000LFC57H7": {
    "kaufbar": [
      {
        "anbieter": "comdirect",
        "haus": "comdirect",
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
        "haus": "consorsbank",
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
        "haus": "scalable",
        "haeuser": [
          "scalable",
          "scalable-prime"
        ],
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
        "anbieter": "Smartbroker+",
        "haus": "smartbroker",
        "beleg": {
          "url": "https://www.smartbrokerplus.de/api/data/tradeable-assets/?q=IE000LFC57H7",
          "stand": "25.09.2026",
          "quelle": "anbieter",
          "domains": [
            "smartbrokerplus.de"
          ]
        }
      },
      {
        "anbieter": "Trade Republic",
        "haus": "trade-republic",
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
        "anbieter": "Trading 212",
        "haus": "trading212",
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
      "Bux Basic",
      "Bux Plus",
      "Bux Prime",
      "finanzen.net zero",
      "finvesto",
      "ING",
      "XTB"
    ],
    "stand": "25.09.2026"
  },
  "IE000UOXRAM8": {
    "kaufbar": [
      {
        "anbieter": "comdirect",
        "haus": "comdirect",
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
        "haus": "consorsbank",
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
        "haus": "degiro",
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
        "anbieter": "Fidelity",
        "haus": "fidelity",
        "beleg": {
          "url": "https://www.fidelity.de/produkte-services/fonds-verschiedener-anbieter/fondsfinder/",
          "stand": "25.09.2026",
          "quelle": "anbieter",
          "domains": [
            "fidelity.de"
          ]
        }
      },
      {
        "anbieter": "flatex",
        "haus": "flatex",
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
        "haus": "ing",
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
        "haus": "scalable",
        "haeuser": [
          "scalable",
          "scalable-prime"
        ],
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
        "anbieter": "Smartbroker+",
        "haus": "smartbroker",
        "beleg": {
          "url": "https://www.smartbrokerplus.de/api/data/tradeable-assets/?q=IE000UOXRAM8",
          "stand": "25.09.2026",
          "quelle": "anbieter",
          "domains": [
            "smartbrokerplus.de"
          ]
        }
      },
      {
        "anbieter": "Trade Republic",
        "haus": "trade-republic",
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
        "anbieter": "Trading 212",
        "haus": "trading212",
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
        "haus": "xtb",
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
      "Bux Basic",
      "Bux Plus",
      "Bux Prime",
      "finanzen.net zero",
      "finvesto"
    ],
    "stand": "25.09.2026"
  },
  "IE000X9FTI22": {
    "kaufbar": [
      {
        "anbieter": "Consorsbank",
        "haus": "consorsbank",
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
        "haus": "scalable",
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
        "anbieter": "Trading 212",
        "haus": "trading212",
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
      "Bux Basic",
      "Bux Plus",
      "Bux Prime",
      "finanzen.net zero",
      "finvesto",
      "ING",
      "Trade Republic",
      "XTB"
    ],
    "stand": "25.09.2026"
  },
  "IE00B27YCN58": {
    "kaufbar": [
      {
        "anbieter": "1822direkt",
        "haus": "1822direkt",
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
        "anbieter": "Bux",
        "haus": "bux",
        "beleg": {
          "url": "https://bux.com/de/wissenszentrum/produktliste/",
          "stand": "25.09.2026",
          "quelle": "anbieter",
          "domains": [
            "getbux.com",
            "bux.com"
          ]
        }
      },
      {
        "anbieter": "comdirect",
        "haus": "comdirect",
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
        "haus": "consorsbank",
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
        "haus": "degiro",
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
        "anbieter": "Fidelity",
        "haus": "fidelity",
        "beleg": {
          "url": "https://www.fidelity.de/produkte-services/fonds-verschiedener-anbieter/fondsfinder/",
          "stand": "25.09.2026",
          "quelle": "anbieter",
          "domains": [
            "fidelity.de"
          ]
        }
      },
      {
        "anbieter": "finanzen.net zero",
        "haus": "finanzen-net-zero",
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
        "haus": "finvesto",
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
        "haus": "flatex",
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
        "haus": "ing",
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
        "haus": "justtrade",
        "beleg": {
          "url": "https://www.justtrade.com/fileadmin/Handelspartner/ETF-Listen/iShares-ETFs.pdf",
          "stand": "25.09.2026",
          "quelle": "anbieter",
          "domains": [
            "justtrade.com"
          ]
        }
      },
      {
        "anbieter": "maxblue Wertpapier-Sparplan",
        "haus": "maxblue Wertpapier Sparplan",
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
        "haus": "scalable",
        "haeuser": [
          "scalable",
          "scalable-prime"
        ],
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
        "anbieter": "Smartbroker+",
        "haus": "smartbroker",
        "beleg": {
          "url": "https://www.smartbrokerplus.de/api/data/tradeable-assets/?q=IE00B27YCN58",
          "stand": "25.09.2026",
          "quelle": "anbieter",
          "domains": [
            "smartbrokerplus.de"
          ]
        }
      },
      {
        "anbieter": "Trade Republic",
        "haus": "trade-republic",
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
        "anbieter": "Trading 212",
        "haus": "trading212",
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
        "haus": "xtb",
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
    "stand": "25.09.2026"
  },
  "IE00B27YCP72": {
    "kaufbar": [
      {
        "anbieter": "1822direkt",
        "haus": "1822direkt",
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
        "haus": "comdirect",
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
        "haus": "consorsbank",
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
        "anbieter": "Fidelity",
        "haus": "fidelity",
        "beleg": {
          "url": "https://www.fidelity.de/produkte-services/fonds-verschiedener-anbieter/fondsfinder/",
          "stand": "25.09.2026",
          "quelle": "anbieter",
          "domains": [
            "fidelity.de"
          ]
        }
      },
      {
        "anbieter": "finanzen.net zero",
        "haus": "finanzen-net-zero",
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
        "haus": "finvesto",
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
        "haus": "flatex",
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
        "haus": "ing",
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
        "haus": "justtrade",
        "beleg": {
          "url": "https://www.justtrade.com/fileadmin/Handelspartner/ETF-Listen/iShares-ETFs.pdf",
          "stand": "25.09.2026",
          "quelle": "anbieter",
          "domains": [
            "justtrade.com"
          ]
        }
      },
      {
        "anbieter": "Scalable Capital",
        "haus": "scalable",
        "haeuser": [
          "scalable",
          "scalable-prime"
        ],
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
        "anbieter": "Smartbroker+",
        "haus": "smartbroker",
        "beleg": {
          "url": "https://www.smartbrokerplus.de/api/data/tradeable-assets/?q=IE00B27YCP72",
          "stand": "25.09.2026",
          "quelle": "anbieter",
          "domains": [
            "smartbrokerplus.de"
          ]
        }
      },
      {
        "anbieter": "Trade Republic",
        "haus": "trade-republic",
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
        "anbieter": "Trading 212",
        "haus": "trading212",
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
        "haus": "xtb",
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
      "Bux Basic",
      "Bux Plus",
      "Bux Prime"
    ],
    "stand": "25.09.2026"
  },
  "IE00B296QM64": {
    "kaufbar": [
      {
        "anbieter": "1822direkt",
        "haus": "1822direkt",
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
        "haus": "comdirect",
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
        "haus": "consorsbank",
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
        "haus": "degiro",
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
        "anbieter": "Fidelity",
        "haus": "fidelity",
        "beleg": {
          "url": "https://www.fidelity.de/produkte-services/fonds-verschiedener-anbieter/fondsfinder/",
          "stand": "25.09.2026",
          "quelle": "anbieter",
          "domains": [
            "fidelity.de"
          ]
        }
      },
      {
        "anbieter": "finanzen.net zero",
        "haus": "finanzen-net-zero",
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
        "haus": "finvesto",
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
        "haus": "flatex",
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
        "haus": "ing",
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
        "haus": "justtrade",
        "beleg": {
          "url": "https://www.justtrade.com/fileadmin/Handelspartner/ETF-Listen/iShares-ETFs.pdf",
          "stand": "25.09.2026",
          "quelle": "anbieter",
          "domains": [
            "justtrade.com"
          ]
        }
      },
      {
        "anbieter": "Scalable Capital",
        "haus": "scalable",
        "haeuser": [
          "scalable",
          "scalable-prime"
        ],
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
        "anbieter": "Smartbroker+",
        "haus": "smartbroker",
        "beleg": {
          "url": "https://www.smartbrokerplus.de/api/data/tradeable-assets/?q=IE00B296QM64",
          "stand": "25.09.2026",
          "quelle": "anbieter",
          "domains": [
            "smartbrokerplus.de"
          ]
        }
      },
      {
        "anbieter": "Trade Republic",
        "haus": "trade-republic",
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
        "anbieter": "Trading 212",
        "haus": "trading212",
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
        "haus": "xtb",
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
      "Bux Basic",
      "Bux Plus",
      "Bux Prime"
    ],
    "stand": "25.09.2026"
  },
  "IE00B43VDT70": {
    "kaufbar": [
      {
        "anbieter": "Consorsbank",
        "haus": "consorsbank",
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
        "haus": "degiro",
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
        "haus": "flatex",
        "beleg": {
          "url": "https://www.flatex.de/produkte-handel/produkte/edelmetalle/",
          "stand": "25.09.2026",
          "quelle": "anbieter",
          "domains": [
            "flatex.de"
          ]
        }
      },
      {
        "anbieter": "ING",
        "haus": "ing",
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
        "haus": "scalable",
        "haeuser": [
          "scalable",
          "scalable-prime"
        ],
        "beleg": {
          "url": "https://www.justetf.com/de/search.html?search=ETFS&spc=96&ls=any",
          "stand": "25.09.2026",
          "quelle": "anbieter",
          "domains": [
            "scalable.capital"
          ],
          "herkunft": "https://de.scalable.capital/trading"
        }
      },
      {
        "anbieter": "Smartbroker+",
        "haus": "smartbroker",
        "beleg": {
          "url": "https://www.smartbrokerplus.de/api/data/tradeable-assets/?q=IE00B43VDT70",
          "stand": "25.09.2026",
          "quelle": "anbieter",
          "domains": [
            "smartbrokerplus.de"
          ]
        }
      },
      {
        "anbieter": "Trade Republic",
        "haus": "trade-republic",
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
        "anbieter": "Trading 212",
        "haus": "trading212",
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
    "stand": "25.09.2026"
  },
  "IE00B4ZJ4634": {
    "kaufbar": [
      {
        "anbieter": "comdirect",
        "haus": "comdirect",
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
        "haus": "consorsbank",
        "hinweis": "Ausgabeaufschlag mit Rabatt",
        "beleg": {
          "url": "https://www.consorsbank.de/web-financialinfo-service/api/marketdata/funds",
          "stand": "25.09.2026",
          "quelle": "anbieter",
          "domains": [
            "consorsbank.de"
          ]
        }
      },
      {
        "anbieter": "Fidelity",
        "haus": "fidelity",
        "beleg": {
          "url": "https://www.fidelity.de/produkte-services/fonds-verschiedener-anbieter/fondsfinder/",
          "stand": "25.09.2026",
          "quelle": "anbieter",
          "domains": [
            "fidelity.de"
          ]
        }
      },
      {
        "anbieter": "finanzen.net zero",
        "haus": "finanzen-net-zero",
        "beleg": {
          "url": "https://mein.finanzen-zero.net/handelbare-produkte",
          "stand": "25.09.2026",
          "quelle": "anbieter",
          "domains": [
            "finanzen.net",
            "finanzen-zero.net"
          ]
        }
      },
      {
        "anbieter": "finvesto",
        "haus": "finvesto",
        "hinweis": "voller Ausgabeaufschlag",
        "beleg": {
          "url": "https://portal.fnz.de/finvesto-md/p/Fonds/IE00B4ZJ4634",
          "stand": "25.09.2026",
          "quelle": "anbieter",
          "domains": [
            "finvesto.de",
            "fnz.de"
          ]
        }
      },
      {
        "anbieter": "flatex",
        "haus": "flatex",
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
        "haus": "ing",
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
        "haus": "scalable",
        "haeuser": [
          "scalable",
          "scalable-prime"
        ],
        "hinweis": "ohne Ausgabeaufschlag",
        "beleg": {
          "url": "https://www.gettex.de/fonds",
          "stand": "25.09.2026",
          "quelle": "anbieter",
          "domains": [
            "scalable.capital"
          ],
          "herkunft": "https://de.scalable.capital/trading"
        }
      },
      {
        "anbieter": "Smartbroker+",
        "haus": "smartbroker",
        "hinweis": "ohne Ausgabeaufschlag",
        "beleg": {
          "url": "https://www.smartbrokerplus.de/api/data/tradeable-assets/?q=IE00B4ZJ4634",
          "stand": "25.09.2026",
          "quelle": "anbieter",
          "domains": [
            "smartbrokerplus.de"
          ]
        }
      }
    ],
    "nichtImAngebot": [
      "Bitpanda",
      "Trade Republic",
      "Trading 212",
      "XTB"
    ],
    "stand": "25.09.2026"
  },
  "IE00B579F325": {
    "kaufbar": [
      {
        "anbieter": "Bux",
        "haus": "bux",
        "beleg": {
          "url": "https://bux.com/de/wissenszentrum/produktliste/",
          "stand": "25.09.2026",
          "quelle": "anbieter",
          "domains": [
            "getbux.com",
            "bux.com"
          ]
        }
      },
      {
        "anbieter": "Consorsbank",
        "haus": "consorsbank",
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
        "haus": "degiro",
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
        "haus": "flatex",
        "beleg": {
          "url": "https://www.flatex.de/produkte-handel/produkte/edelmetalle/",
          "stand": "25.09.2026",
          "quelle": "anbieter",
          "domains": [
            "flatex.de"
          ]
        }
      },
      {
        "anbieter": "ING",
        "haus": "ing",
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
        "haus": "scalable",
        "haeuser": [
          "scalable",
          "scalable-prime"
        ],
        "beleg": {
          "url": "https://www.justetf.com/de/search.html?search=ETFS&spc=96&ls=any",
          "stand": "25.09.2026",
          "quelle": "anbieter",
          "domains": [
            "scalable.capital"
          ],
          "herkunft": "https://de.scalable.capital/trading"
        }
      },
      {
        "anbieter": "Smartbroker+",
        "haus": "smartbroker",
        "beleg": {
          "url": "https://www.smartbrokerplus.de/api/data/tradeable-assets/?q=IE00B579F325",
          "stand": "25.09.2026",
          "quelle": "anbieter",
          "domains": [
            "smartbrokerplus.de"
          ]
        }
      },
      {
        "anbieter": "Trading 212",
        "haus": "trading212",
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
        "haus": "xtb",
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
    "stand": "25.09.2026"
  },
  "IE00BMYMHS24": {
    "kaufbar": [
      {
        "anbieter": "1822direkt",
        "haus": "1822direkt",
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
        "haus": "comdirect",
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
        "haus": "consorsbank",
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
        "anbieter": "Fidelity",
        "haus": "fidelity",
        "beleg": {
          "url": "https://www.fidelity.de/produkte-services/fonds-verschiedener-anbieter/fondsfinder/",
          "stand": "25.09.2026",
          "quelle": "anbieter",
          "domains": [
            "fidelity.de"
          ]
        }
      },
      {
        "anbieter": "finanzen.net zero",
        "haus": "finanzen-net-zero",
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
        "haus": "flatex",
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
        "haus": "ing",
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
        "haus": "justtrade",
        "beleg": {
          "url": "https://www.justtrade.com/fileadmin/Handelspartner/ETF-Listen/HANetf-ETFs.pdf",
          "stand": "25.09.2026",
          "quelle": "anbieter",
          "domains": [
            "justtrade.com"
          ]
        }
      },
      {
        "anbieter": "Scalable Capital",
        "haus": "scalable",
        "haeuser": [
          "scalable",
          "scalable-prime"
        ],
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
        "anbieter": "Smartbroker+",
        "haus": "smartbroker",
        "beleg": {
          "url": "https://www.smartbrokerplus.de/api/data/tradeable-assets/?q=IE00BMYMHS24",
          "stand": "25.09.2026",
          "quelle": "anbieter",
          "domains": [
            "smartbrokerplus.de"
          ]
        }
      },
      {
        "anbieter": "Trade Republic",
        "haus": "trade-republic",
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
        "anbieter": "Trading 212",
        "haus": "trading212",
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
      "Bux Basic",
      "Bux Plus",
      "Bux Prime",
      "finvesto",
      "XTB"
    ],
    "stand": "25.09.2026"
  },
  "JE00B1VS2W53": {
    "kaufbar": [],
    "nichtImAngebot": [],
    "stand": "21.09.2026"
  },
  "JE00B1VS3002": {
    "kaufbar": [],
    "nichtImAngebot": [],
    "stand": "21.09.2026"
  },
  "JE00B1VS3333": {
    "kaufbar": [
      {
        "anbieter": "Bux",
        "haus": "bux",
        "beleg": {
          "url": "https://bux.com/de/wissenszentrum/produktliste/",
          "stand": "25.09.2026",
          "quelle": "anbieter",
          "domains": [
            "getbux.com",
            "bux.com"
          ]
        }
      },
      {
        "anbieter": "Consorsbank",
        "haus": "consorsbank",
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
        "haus": "degiro",
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
        "haus": "finanzen-net-zero",
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
        "haus": "flatex",
        "beleg": {
          "url": "https://www.flatex.de/produkte-handel/produkte/edelmetalle/",
          "stand": "25.09.2026",
          "quelle": "anbieter",
          "domains": [
            "flatex.de"
          ]
        }
      },
      {
        "anbieter": "ING",
        "haus": "ing",
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
        "haus": "justtrade",
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
        "anbieter": "Scalable Capital",
        "haus": "scalable",
        "haeuser": [
          "scalable",
          "scalable-prime"
        ],
        "beleg": {
          "url": "https://www.justetf.com/de/search.html?search=ETFS&spc=96&ls=any",
          "stand": "25.09.2026",
          "quelle": "anbieter",
          "domains": [
            "scalable.capital"
          ],
          "herkunft": "https://de.scalable.capital/trading"
        }
      },
      {
        "anbieter": "Smartbroker+",
        "haus": "smartbroker",
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
        "haus": "trade-republic",
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
        "anbieter": "Trading 212",
        "haus": "trading212",
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
    "stand": "25.09.2026"
  },
  "JE00B1VS3770": {
    "kaufbar": [
      {
        "anbieter": "Consorsbank",
        "haus": "consorsbank",
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
        "haus": "degiro",
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
        "haus": "finanzen-net-zero",
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
        "haus": "flatex",
        "beleg": {
          "url": "https://www.flatex.de/produkte-handel/produkte/edelmetalle/",
          "stand": "25.09.2026",
          "quelle": "anbieter",
          "domains": [
            "flatex.de"
          ]
        }
      },
      {
        "anbieter": "ING",
        "haus": "ing",
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
        "haus": "justtrade",
        "beleg": {
          "url": "https://www.justtrade.com/fileadmin/Handelspartner/ETF-Listen/WisdomTree-ETFs.pdf",
          "stand": "25.09.2026",
          "quelle": "anbieter",
          "domains": [
            "justtrade.com"
          ]
        }
      },
      {
        "anbieter": "Scalable Capital",
        "haus": "scalable",
        "haeuser": [
          "scalable",
          "scalable-prime"
        ],
        "beleg": {
          "url": "https://www.justetf.com/de/search.html?search=ETFS&spc=96&ls=any",
          "stand": "25.09.2026",
          "quelle": "anbieter",
          "domains": [
            "scalable.capital"
          ],
          "herkunft": "https://de.scalable.capital/trading"
        }
      },
      {
        "anbieter": "Smartbroker+",
        "haus": "smartbroker",
        "beleg": {
          "url": "https://www.smartbrokerplus.de/api/data/tradeable-assets/?q=JE00B1VS3770",
          "stand": "25.09.2026",
          "quelle": "anbieter",
          "domains": [
            "smartbrokerplus.de"
          ]
        }
      },
      {
        "anbieter": "Trade Republic",
        "haus": "trade-republic",
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
        "anbieter": "Trading 212",
        "haus": "trading212",
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
        "haus": "xtb",
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
    "stand": "25.09.2026"
  },
  "JE00B1VS3W29": {
    "kaufbar": [],
    "nichtImAngebot": [],
    "stand": "21.09.2026"
  },
  "JE00B588CD74": {
    "kaufbar": [
      {
        "anbieter": "Consorsbank",
        "haus": "consorsbank",
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
        "haus": "degiro",
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
        "haus": "finanzen-net-zero",
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
        "haus": "flatex",
        "beleg": {
          "url": "https://www.flatex.de/produkte-handel/produkte/edelmetalle/",
          "stand": "25.09.2026",
          "quelle": "anbieter",
          "domains": [
            "flatex.de"
          ]
        }
      },
      {
        "anbieter": "ING",
        "haus": "ing",
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
        "haus": "justtrade",
        "beleg": {
          "url": "https://www.justtrade.com/fileadmin/Handelspartner/ETF-Listen/WisdomTree-ETFs.pdf",
          "stand": "25.09.2026",
          "quelle": "anbieter",
          "domains": [
            "justtrade.com"
          ]
        }
      },
      {
        "anbieter": "Scalable Capital",
        "haus": "scalable",
        "haeuser": [
          "scalable",
          "scalable-prime"
        ],
        "beleg": {
          "url": "https://www.justetf.com/de/search.html?search=ETFS&spc=96&ls=any",
          "stand": "25.09.2026",
          "quelle": "anbieter",
          "domains": [
            "scalable.capital"
          ],
          "herkunft": "https://de.scalable.capital/trading"
        }
      },
      {
        "anbieter": "Smartbroker+",
        "haus": "smartbroker",
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
        "haus": "trade-republic",
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
        "anbieter": "Trading 212",
        "haus": "trading212",
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
    "stand": "25.09.2026"
  },
  "JE00BN2CJ301": {
    "kaufbar": [
      {
        "anbieter": "Consorsbank",
        "haus": "consorsbank",
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
        "haus": "degiro",
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
        "haus": "finanzen-net-zero",
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
        "haus": "flatex",
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
        "haus": "ing",
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
        "haus": "justtrade",
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
        "anbieter": "Scalable Capital",
        "haus": "scalable",
        "haeuser": [
          "scalable",
          "scalable-prime"
        ],
        "beleg": {
          "url": "https://www.justetf.com/de/search.html?search=ETFS&spc=96&ls=any",
          "stand": "25.09.2026",
          "quelle": "anbieter",
          "domains": [
            "scalable.capital"
          ],
          "herkunft": "https://de.scalable.capital/trading"
        }
      },
      {
        "anbieter": "Smartbroker+",
        "haus": "smartbroker",
        "beleg": {
          "url": "https://www.smartbrokerplus.de/api/data/tradeable-assets/?q=JE00BN2CJ301",
          "stand": "25.09.2026",
          "quelle": "anbieter",
          "domains": [
            "smartbrokerplus.de"
          ]
        }
      },
      {
        "anbieter": "Trade Republic",
        "haus": "trade-republic",
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
        "anbieter": "Trading 212",
        "haus": "trading212",
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
        "haus": "xtb",
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
    "stand": "25.09.2026"
  },
  "JE00BQRFDY49": {
    "kaufbar": [
      {
        "anbieter": "Consorsbank",
        "haus": "consorsbank",
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
        "haus": "finanzen-net-zero",
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
        "haus": "flatex",
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
        "haus": "ing",
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
        "haus": "justtrade",
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
        "anbieter": "Scalable Capital",
        "haus": "scalable",
        "haeuser": [
          "scalable",
          "scalable-prime"
        ],
        "beleg": {
          "url": "https://www.justetf.com/de/search.html?search=ETFS&spc=96&ls=any",
          "stand": "25.09.2026",
          "quelle": "anbieter",
          "domains": [
            "scalable.capital"
          ],
          "herkunft": "https://de.scalable.capital/trading"
        }
      },
      {
        "anbieter": "Smartbroker+",
        "haus": "smartbroker",
        "beleg": {
          "url": "https://www.smartbrokerplus.de/api/data/tradeable-assets/?q=JE00BQRFDY49",
          "stand": "25.09.2026",
          "quelle": "anbieter",
          "domains": [
            "smartbrokerplus.de"
          ]
        }
      },
      {
        "anbieter": "Trade Republic",
        "haus": "trade-republic",
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
        "anbieter": "Trading 212",
        "haus": "trading212",
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
        "haus": "xtb",
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
    "stand": "25.09.2026"
  },
  "LU1150255971": {
    "kaufbar": [
      {
        "anbieter": "comdirect",
        "haus": "comdirect",
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
        "haus": "consorsbank",
        "hinweis": "Ausgabeaufschlag mit Rabatt",
        "beleg": {
          "url": "https://www.consorsbank.de/web-financialinfo-service/api/marketdata/funds",
          "stand": "25.09.2026",
          "quelle": "anbieter",
          "domains": [
            "consorsbank.de"
          ]
        }
      },
      {
        "anbieter": "Fidelity",
        "haus": "fidelity",
        "beleg": {
          "url": "https://www.fidelity.de/produkte-services/fonds-verschiedener-anbieter/fondsfinder/",
          "stand": "25.09.2026",
          "quelle": "anbieter",
          "domains": [
            "fidelity.de"
          ]
        }
      },
      {
        "anbieter": "finvesto",
        "haus": "finvesto",
        "hinweis": "voller Ausgabeaufschlag",
        "beleg": {
          "url": "https://portal.fnz.de/finvesto-md/p/Fonds/LU1150255971",
          "stand": "25.09.2026",
          "quelle": "anbieter",
          "domains": [
            "finvesto.de",
            "fnz.de"
          ]
        }
      },
      {
        "anbieter": "flatex",
        "haus": "flatex",
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
        "haus": "ing",
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
        "haus": "scalable",
        "haeuser": [
          "scalable",
          "scalable-prime"
        ],
        "hinweis": "ohne Ausgabeaufschlag",
        "beleg": {
          "url": "https://www.gettex.de/fonds",
          "stand": "25.09.2026",
          "quelle": "anbieter",
          "domains": [
            "scalable.capital"
          ],
          "herkunft": "https://de.scalable.capital/trading"
        }
      },
      {
        "anbieter": "Smartbroker+",
        "haus": "smartbroker",
        "hinweis": "ohne Ausgabeaufschlag",
        "beleg": {
          "url": "https://www.smartbrokerplus.de/api/data/tradeable-assets/?q=LU1150255971",
          "stand": "25.09.2026",
          "quelle": "anbieter",
          "domains": [
            "smartbrokerplus.de"
          ]
        }
      }
    ],
    "nichtImAngebot": [
      "Bitpanda",
      "finanzen.net zero",
      "Trade Republic",
      "Trading 212",
      "XTB"
    ],
    "stand": "25.09.2026"
  },
  "LU2458330086": {
    "kaufbar": [
      {
        "anbieter": "comdirect",
        "haus": "comdirect",
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
        "anbieter": "Fidelity",
        "haus": "fidelity",
        "beleg": {
          "url": "https://www.fidelity.de/produkte-services/fonds-verschiedener-anbieter/fondsfinder/",
          "stand": "25.09.2026",
          "quelle": "anbieter",
          "domains": [
            "fidelity.de"
          ]
        }
      },
      {
        "anbieter": "flatex",
        "haus": "flatex",
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
        "haus": "ing",
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
        "haus": "scalable",
        "haeuser": [
          "scalable",
          "scalable-prime"
        ],
        "hinweis": "ohne Ausgabeaufschlag",
        "beleg": {
          "url": "https://www.gettex.de/fonds",
          "stand": "25.09.2026",
          "quelle": "anbieter",
          "domains": [
            "scalable.capital"
          ],
          "herkunft": "https://de.scalable.capital/trading"
        }
      },
      {
        "anbieter": "Smartbroker+",
        "haus": "smartbroker",
        "hinweis": "ohne Ausgabeaufschlag",
        "beleg": {
          "url": "https://www.smartbrokerplus.de/api/data/tradeable-assets/?q=LU2458330086",
          "stand": "25.09.2026",
          "quelle": "anbieter",
          "domains": [
            "smartbrokerplus.de"
          ]
        }
      }
    ],
    "nichtImAngebot": [
      "Bitpanda",
      "Consorsbank",
      "finanzen.net zero",
      "Trade Republic",
      "Trading 212",
      "XTB"
    ],
    "stand": "25.09.2026"
  },
  "LU3123443510": {
    "kaufbar": [
      {
        "anbieter": "1822direkt",
        "haus": "1822direkt",
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
        "haus": "comdirect",
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
        "haus": "consorsbank",
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
        "haus": "finanzen-net-zero",
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
        "anbieter": "Scalable Capital",
        "haus": "scalable",
        "haeuser": [
          "scalable",
          "scalable-prime"
        ],
        "beleg": {
          "url": "https://www.justetf.com/de/search.html?search=ETFS&spc=96&ls=any",
          "stand": "25.09.2026",
          "quelle": "anbieter",
          "domains": [
            "scalable.capital"
          ],
          "herkunft": "https://de.scalable.capital/trading"
        }
      },
      {
        "anbieter": "Smartbroker+",
        "haus": "smartbroker",
        "beleg": {
          "url": "https://www.smartbrokerplus.de/api/data/tradeable-assets/?q=LU3123443510",
          "stand": "25.09.2026",
          "quelle": "anbieter",
          "domains": [
            "smartbrokerplus.de"
          ]
        }
      },
      {
        "anbieter": "Trading 212",
        "haus": "trading212",
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
      "Bux Basic",
      "Bux Plus",
      "Bux Prime",
      "finvesto",
      "ING",
      "Trade Republic",
      "XTB"
    ],
    "stand": "25.09.2026"
  },
  "XS2115336336": {
    "kaufbar": [],
    "nichtImAngebot": [],
    "stand": "21.09.2026"
  },
  "XS3384723154": {
    "kaufbar": [
      {
        "anbieter": "Consorsbank",
        "haus": "consorsbank",
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
        "anbieter": "Trading 212",
        "haus": "trading212",
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
