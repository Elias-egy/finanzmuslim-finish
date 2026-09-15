// ERZEUGT von ~/rebrand/data/vergleiche/bauen.py aus recherche/anlagen.json. Nicht von Hand ändern.
// Je ISIN: bei welchen Anbietern die Anlage laut Wertpapiersuche oder Produktliste kaufbar ist.
// Fehlt ein Anbieter, ist er noch nicht geprüft.

export type AnlageKaufbar = {
  kaufbar: { anbieter: string; hinweis?: string }[];
  nichtImAngebot: string[];
  stand: string;
};

export const ANLAGEN_KAUFBAR: Record<string, AnlageKaufbar> = {
  "IE000929U2U9": {
    "kaufbar": [
      {
        "anbieter": "comdirect"
      },
      {
        "anbieter": "Consorsbank"
      },
      {
        "anbieter": "DEGIRO"
      },
      {
        "anbieter": "finanzen.net zero"
      },
      {
        "anbieter": "ING"
      },
      {
        "anbieter": "Trade Republic"
      },
      {
        "anbieter": "tradegate.direct"
      },
      {
        "anbieter": "Traders Place"
      },
      {
        "anbieter": "Trading 212"
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
        "anbieter": "Consorsbank"
      },
      {
        "anbieter": "tradegate.direct"
      },
      {
        "anbieter": "Traders Place"
      },
      {
        "anbieter": "Trading 212"
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
        "anbieter": "Consorsbank"
      },
      {
        "anbieter": "tradegate.direct"
      },
      {
        "anbieter": "Traders Place"
      },
      {
        "anbieter": "Trading 212"
      },
      {
        "anbieter": "XTB"
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
        "anbieter": "Consorsbank"
      },
      {
        "anbieter": "tradegate.direct"
      },
      {
        "anbieter": "Traders Place"
      },
      {
        "anbieter": "Trading 212"
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
        "anbieter": "comdirect"
      },
      {
        "anbieter": "Consorsbank"
      },
      {
        "anbieter": "Trade Republic"
      },
      {
        "anbieter": "Traders Place"
      },
      {
        "anbieter": "Trading 212"
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
        "anbieter": "comdirect"
      },
      {
        "anbieter": "Consorsbank"
      },
      {
        "anbieter": "DEGIRO"
      },
      {
        "anbieter": "flatex"
      },
      {
        "anbieter": "ING"
      },
      {
        "anbieter": "Trade Republic"
      },
      {
        "anbieter": "tradegate.direct"
      },
      {
        "anbieter": "Traders Place"
      },
      {
        "anbieter": "Trading 212"
      },
      {
        "anbieter": "XTB"
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
        "anbieter": "Consorsbank"
      },
      {
        "anbieter": "tradegate.direct"
      },
      {
        "anbieter": "Traders Place"
      },
      {
        "anbieter": "Trading 212"
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
        "anbieter": "1822direkt"
      },
      {
        "anbieter": "comdirect"
      },
      {
        "anbieter": "Consorsbank"
      },
      {
        "anbieter": "DEGIRO"
      },
      {
        "anbieter": "DKB"
      },
      {
        "anbieter": "finanzen.net zero"
      },
      {
        "anbieter": "finvesto"
      },
      {
        "anbieter": "flatex"
      },
      {
        "anbieter": "ING"
      },
      {
        "anbieter": "maxblue Wertpapier-Sparplan"
      },
      {
        "anbieter": "S Broker"
      },
      {
        "anbieter": "Scalable Capital"
      },
      {
        "anbieter": "Smartbroker+"
      },
      {
        "anbieter": "Trade Republic"
      },
      {
        "anbieter": "tradegate.direct"
      },
      {
        "anbieter": "Traders Place"
      },
      {
        "anbieter": "Trading 212"
      },
      {
        "anbieter": "XTB"
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
        "anbieter": "1822direkt"
      },
      {
        "anbieter": "comdirect"
      },
      {
        "anbieter": "Consorsbank"
      },
      {
        "anbieter": "finanzen.net zero"
      },
      {
        "anbieter": "finvesto"
      },
      {
        "anbieter": "flatex"
      },
      {
        "anbieter": "ING"
      },
      {
        "anbieter": "S Broker"
      },
      {
        "anbieter": "Smartbroker+"
      },
      {
        "anbieter": "Trade Republic"
      },
      {
        "anbieter": "tradegate.direct"
      },
      {
        "anbieter": "Traders Place"
      },
      {
        "anbieter": "Trading 212"
      },
      {
        "anbieter": "XTB"
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
        "anbieter": "1822direkt"
      },
      {
        "anbieter": "comdirect"
      },
      {
        "anbieter": "Consorsbank"
      },
      {
        "anbieter": "DEGIRO"
      },
      {
        "anbieter": "finanzen.net zero"
      },
      {
        "anbieter": "finvesto"
      },
      {
        "anbieter": "flatex"
      },
      {
        "anbieter": "ING"
      },
      {
        "anbieter": "Trade Republic"
      },
      {
        "anbieter": "tradegate.direct"
      },
      {
        "anbieter": "Traders Place"
      },
      {
        "anbieter": "Trading 212"
      },
      {
        "anbieter": "XTB"
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
        "anbieter": "comdirect"
      },
      {
        "anbieter": "Consorsbank"
      },
      {
        "anbieter": "DEGIRO"
      },
      {
        "anbieter": "ING"
      },
      {
        "anbieter": "Trade Republic"
      },
      {
        "anbieter": "tradegate.direct"
      },
      {
        "anbieter": "Traders Place"
      },
      {
        "anbieter": "Trading 212"
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
        "hinweis": "Ausgabeaufschlag mit Rabatt"
      },
      {
        "anbieter": "Consorsbank"
      },
      {
        "anbieter": "finanzen.net zero"
      },
      {
        "anbieter": "finvesto"
      },
      {
        "anbieter": "flatex",
        "hinweis": "Ausgabeaufschlag mit Rabatt"
      },
      {
        "anbieter": "ING",
        "hinweis": "Ausgabeaufschlag mit Rabatt"
      },
      {
        "anbieter": "Traders Place"
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
        "anbieter": "comdirect"
      },
      {
        "anbieter": "Consorsbank"
      },
      {
        "anbieter": "DEGIRO"
      },
      {
        "anbieter": "ING"
      },
      {
        "anbieter": "Trade Republic"
      },
      {
        "anbieter": "tradegate.direct"
      },
      {
        "anbieter": "Traders Place"
      },
      {
        "anbieter": "Trading 212"
      },
      {
        "anbieter": "XTB"
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
        "anbieter": "1822direkt"
      },
      {
        "anbieter": "Bitpanda"
      },
      {
        "anbieter": "comdirect"
      },
      {
        "anbieter": "Consorsbank"
      },
      {
        "anbieter": "finanzen.net zero"
      },
      {
        "anbieter": "flatex"
      },
      {
        "anbieter": "ING"
      },
      {
        "anbieter": "Trade Republic"
      },
      {
        "anbieter": "tradegate.direct"
      },
      {
        "anbieter": "Traders Place"
      },
      {
        "anbieter": "Trading 212"
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
        "anbieter": "comdirect"
      },
      {
        "anbieter": "Consorsbank"
      },
      {
        "anbieter": "DEGIRO"
      },
      {
        "anbieter": "finanzen.net zero"
      },
      {
        "anbieter": "ING"
      },
      {
        "anbieter": "justTRADE"
      },
      {
        "anbieter": "Smartbroker+"
      },
      {
        "anbieter": "Trade Republic"
      },
      {
        "anbieter": "tradegate.direct"
      },
      {
        "anbieter": "Traders Place"
      },
      {
        "anbieter": "Trading 212"
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
        "anbieter": "comdirect"
      },
      {
        "anbieter": "Consorsbank"
      },
      {
        "anbieter": "DEGIRO"
      },
      {
        "anbieter": "finanzen.net zero"
      },
      {
        "anbieter": "ING"
      },
      {
        "anbieter": "Trade Republic"
      },
      {
        "anbieter": "tradegate.direct"
      },
      {
        "anbieter": "Traders Place"
      },
      {
        "anbieter": "Trading 212"
      },
      {
        "anbieter": "XTB"
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
        "anbieter": "comdirect"
      },
      {
        "anbieter": "Consorsbank"
      },
      {
        "anbieter": "DEGIRO"
      },
      {
        "anbieter": "finanzen.net zero"
      },
      {
        "anbieter": "ING"
      },
      {
        "anbieter": "Smartbroker+"
      },
      {
        "anbieter": "Trade Republic"
      },
      {
        "anbieter": "tradegate.direct"
      },
      {
        "anbieter": "Traders Place"
      },
      {
        "anbieter": "Trading 212"
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
        "anbieter": "comdirect"
      },
      {
        "anbieter": "Consorsbank"
      },
      {
        "anbieter": "DEGIRO"
      },
      {
        "anbieter": "finanzen.net zero"
      },
      {
        "anbieter": "flatex"
      },
      {
        "anbieter": "ING"
      },
      {
        "anbieter": "justTRADE"
      },
      {
        "anbieter": "Trade Republic"
      },
      {
        "anbieter": "tradegate.direct"
      },
      {
        "anbieter": "Traders Place"
      },
      {
        "anbieter": "Trading 212"
      },
      {
        "anbieter": "XTB"
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
        "anbieter": "Bison"
      },
      {
        "anbieter": "comdirect"
      },
      {
        "anbieter": "Consorsbank"
      },
      {
        "anbieter": "finanzen.net zero"
      },
      {
        "anbieter": "flatex"
      },
      {
        "anbieter": "ING"
      },
      {
        "anbieter": "justTRADE"
      },
      {
        "anbieter": "Trade Republic"
      },
      {
        "anbieter": "tradegate.direct"
      },
      {
        "anbieter": "Traders Place"
      },
      {
        "anbieter": "Trading 212"
      },
      {
        "anbieter": "XTB"
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
        "hinweis": "ohne Ausgabeaufschlag"
      },
      {
        "anbieter": "Consorsbank"
      },
      {
        "anbieter": "finvesto"
      },
      {
        "anbieter": "flatex",
        "hinweis": "Ausgabeaufschlag mit Rabatt"
      },
      {
        "anbieter": "ING"
      },
      {
        "anbieter": "Traders Place"
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
        "hinweis": "Ausgabeaufschlag mit Rabatt"
      },
      {
        "anbieter": "flatex",
        "hinweis": "Ausgabeaufschlag mit Rabatt"
      },
      {
        "anbieter": "ING"
      },
      {
        "anbieter": "Traders Place"
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
        "anbieter": "1822direkt"
      },
      {
        "anbieter": "comdirect"
      },
      {
        "anbieter": "Consorsbank"
      },
      {
        "anbieter": "finanzen.net zero"
      },
      {
        "anbieter": "tradegate.direct"
      },
      {
        "anbieter": "Traders Place"
      },
      {
        "anbieter": "Trading 212"
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
        "anbieter": "comdirect"
      },
      {
        "anbieter": "Consorsbank"
      },
      {
        "anbieter": "Trade Republic"
      },
      {
        "anbieter": "tradegate.direct"
      },
      {
        "anbieter": "Traders Place"
      },
      {
        "anbieter": "Trading 212"
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
