export type NavEntry = { label: string; to?: string };
export type NavColumn = { title: string; items: NavEntry[] };
export type NavGroup = { label: string; columns: NavColumn[] };

/** Nur real existierende Routen bekommen `to`. Alles andere: grau + "bald". */
export const navGroups: NavGroup[] = [
  {
    label: "Wissen",
    columns: [
      {
        title: "Grundlagen",
        items: [
          { label: "Alle Themen", to: "/wissen" },
          { label: "Vorlagen", to: "/vorlagen" },
          { label: "Newsletter", to: "/newsletter" },
          { label: "Zinsen im Islam", to: "/wissen/zinsen-im-islam" },
          { label: "Was ist Gharar", to: "/wissen/gharar" },
          { label: "Glücksspiel (Maysir)", to: "/wissen/maysir" },
          { label: "Trading, Forex und CFDs", to: "/wissen/trading-forex-cfd" },
          { label: "Halal investieren für Anfänger", to: "/halal-guide" },
          { label: "Häufige Fehler", to: "/wissen/haeufige-fehler" },
        ],
      },
      {
        title: "Investieren",
        items: [
          { label: "Halal-Anlagen", to: "/halal-anlagen" },
          { label: "Halal ETFs", to: "/wissen/halal-etfs" },
          { label: "Aktien prüfen", to: "/wissen/sind-aktien-halal" },
          { label: "Sukuk", to: "/wissen/sukuk" },
          { label: "Gold kaufen", to: "/wissen/halal-gold-kaufen" },
          { label: "Krypto", to: "/wissen/ist-bitcoin-halal" },
        ],
      },
      {
        title: "Alltag",
        items: [
          { label: "Girokonto ohne Zinsen", to: "/wissen/girokonto-ohne-zinsen" },
          { label: "Kreditkarte", to: "/wissen/kreditkarte-halal" },
          { label: "Dispo und Schulden", to: "/wissen/dispo-und-schulden" },
          { label: "Kredit ohne Zinsen", to: "/wissen/halal-kredit-ohne-zinsen" },
          { label: "Ratenkauf", to: "/wissen/ratenzahlung-haram" },
          { label: "Haus kaufen ohne Zinsen", to: "/wissen/haus-kaufen-ohne-zinsen" },
          { label: "Auto kaufen ohne Zinsen", to: "/wissen/auto-kaufen-ohne-zinsen" },
          { label: "Leasing", to: "/wissen/ist-leasing-haram" },
          { label: "Versicherung", to: "/wissen/ist-versicherung-haram" },
        ],
      },
      {
        title: "Pflichten",
        items: [
          { label: "Zakat berechnen", to: "/zakat-rechner" },
          { label: "Nisab", to: "/wissen/nisab" },
          { label: "Zakat auf Aktien und ETFs", to: "/wissen/zakat-auf-aktien-etf-krypto" },
          { label: "Erträge reinigen", to: "/wissen/ertraege-reinigen" },
          { label: "Erbe nach islamischem Recht", to: "/wissen/erbe" },
        ],
      },
    ],
  },
  {
    label: "Halal-Check",
    columns: [
      {
        title: "Selbst prüfen",
        items: [
          { label: "Ist diese Aktie halal?", to: "/vorlagen/aktien-check" },
          { label: "Vertrags-Ampel", to: "/vorlagen/vertrags-ampel" },
          { label: "Geprüfte Anlagen", to: "/halal-anlagen" },
          { label: "Alle Vorlagen", to: "/vorlagen" },
        ],
      },
      {
        title: "Nachschlagen",
        items: [
          { label: "Die drei Grenzwerte", to: "/wissen/sind-aktien-halal" },
          { label: "Erträge reinigen", to: "/wissen/ertraege-reinigen" },
          { label: "Häufige Fehler", to: "/wissen/haeufige-fehler" },
          { label: "Zinsen im Islam", to: "/wissen/zinsen-im-islam" },
        ],
      },
    ],
  },
  {
    label: "Rechner",
    columns: [
      {
        title: "Rechner",
        items: [
          { label: "Alle Rechner", to: "/rechner" },
          { label: "Zakat-Rechner", to: "/zakat-rechner" },
          { label: "Renditerechner", to: "/renditerechner" },
          { label: "Auswanderungsrechner", to: "/auswanderungsrechner" },
          { label: "Budgetrechner", to: "/budgetrechner" },
          { label: "Sparzielrechner", to: "/sparzielrechner" },
          { label: "Brutto-Netto-Rechner" },
          { label: "Inflationsrechner", to: "/inflationsrechner" },
          { label: "Bereinigungsrechner", to: "/bereinigungsrechner" },
        ],
      },
    ],
  },
  {
    label: "Vergleiche",
    columns: [
      {
        title: "Investieren",
        items: [
          { label: "Alle Vergleiche", to: "/vergleiche" },
          { label: "Depot-Vergleich", to: "/vergleich/depot" },
          { label: "Krypto-Vergleich", to: "/vergleich/krypto" },
          { label: "Edelmetalle", to: "/vergleich/edelmetalle" },
          { label: "Kinderdepot" },
          { label: "Halal-Anlagen finden", to: "/halal-anlagen" },
        ],
      },
      {
        title: "Konto und Prüfung",
        items: [
          { label: "Girokonto-Vergleich", to: "/vergleich/girokonto" },
          { label: "Aktien prüfen", to: "/vergleich/screening-apps" },
          { label: "Steuersoftware", to: "/vergleich/steuersoftware" },
        ],
      },
      {
        title: "Sonstiges",
        items: [
          { label: "So bewerten wir", to: "/vergleiche/methodik" },
          { label: "Aktuelle Deals", to: "/deals" },
        ],
      },
    ],
  },
];
