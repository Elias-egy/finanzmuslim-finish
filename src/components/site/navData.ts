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
          { label: "Zinsen im Islam", to: "/wissen/zinsen-im-islam" },
          { label: "Was ist Gharar" },
          { label: "Halal investieren für Anfänger", to: "/halal-guide" },
          { label: "Häufige Fehler" },
        ],
      },
      {
        title: "Investieren",
        items: [
          { label: "Halal-Anlagen", to: "/halal-anlagen" },
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
          { label: "Kredit ohne Zinsen", to: "/wissen/halal-kredit-ohne-zinsen" },
          { label: "Ratenkauf", to: "/wissen/ratenzahlung-haram" },
          { label: "Haus kaufen ohne Zinsen", to: "/wissen/haus-kaufen-ohne-zinsen" },
          { label: "Leasing", to: "/wissen/ist-leasing-haram" },
          { label: "Versicherung", to: "/wissen/ist-versicherung-haram" },
        ],
      },
      {
        title: "Pflichten",
        items: [
          { label: "Zakat berechnen", to: "/zakat-rechner" },
          { label: "Nisab", to: "/wissen/nisab" },
          { label: "Erträge reinigen" },
          { label: "Erbe nach islamischem Recht" },
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
          { label: "Auswanderungsrechner" },
          { label: "Budgetrechner" },
          { label: "Brutto-Netto-Rechner" },
          { label: "Inflationsrechner" },
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
          { label: "Kinderdepot" },
          { label: "Halal-Anlagen finden", to: "/halal-anlagen" },
        ],
      },
      {
        title: "Konto und Karte",
        items: [
          { label: "Girokonto ohne Zinsen" },
          { label: "Karte ohne Kreditrahmen" },
          { label: "Geschäftskonto" },
        ],
      },
      {
        title: "Sonstiges",
        items: [
          { label: "Physisches Gold" },
          { label: "Geld ins Ausland" },
          { label: "Steuersoftware" },
        ],
      },
    ],
  },
];
