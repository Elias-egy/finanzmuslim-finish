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
          { label: "Kostenlose Listen", to: "/vorlagen" },
          { label: "Newsletter", to: "/newsletter" },
          { label: "Zinsen im Islam", to: "/wissen/zinsen-im-islam" },
          { label: "Was ist Gharar", to: "/wissen/gharar" },
          { label: "Glücksspiel (Maysir)", to: "/wissen/maysir" },
          { label: "Trading, Forex und CFDs", to: "/wissen/trading-forex-cfd" },
          { label: "Halal investieren für Anfänger", to: "/halal-guide" },
          { label: "12 Fehler beim halal Investieren", to: "/wissen/haeufige-fehler" },
        ],
      },
      {
        title: "Investieren",
        items: [
          { label: "Halal-Anlagen", to: "/halal-anlagen" },
          { label: "Halal ETFs", to: "/wissen/halal-etfs" },
          { label: "Sind Aktien halal?", to: "/wissen/sind-aktien-halal" },
          { label: "Sukuk", to: "/wissen/sukuk" },
          { label: "Halal Gold kaufen", to: "/wissen/halal-gold-kaufen" },
          { label: "Ist Bitcoin halal?", to: "/wissen/ist-bitcoin-halal" },
        ],
      },
      {
        title: "Alltag",
        items: [
          { label: "Girokonto ohne Zinsen", to: "/wissen/girokonto-ohne-zinsen" },
          { label: "Ist die Kreditkarte haram?", to: "/wissen/kreditkarte-halal" },
          { label: "Dispo und Schulden", to: "/wissen/dispo-und-schulden" },
          { label: "Kredit ohne Zinsen", to: "/wissen/halal-kredit-ohne-zinsen" },
          { label: "Ist Ratenzahlung haram?", to: "/wissen/ratenzahlung-haram" },
          { label: "Haus kaufen ohne Zinsen", to: "/wissen/haus-kaufen-ohne-zinsen" },
          { label: "Auto kaufen ohne Zinsen", to: "/wissen/auto-kaufen-ohne-zinsen" },
          { label: "Ist Leasing haram?", to: "/wissen/ist-leasing-haram" },
          { label: "Ist Versicherung haram?", to: "/wissen/ist-versicherung-haram" },
        ],
      },
      {
        title: "Pflichten",
        items: [
          { label: "Zakat berechnen", to: "/zakat-rechner" },
          { label: "Nisab", to: "/wissen/nisab" },
          { label: "Zakat auf Aktien und ETFs", to: "/wissen/zakat-auf-aktien-etf-krypto" },
          { label: "Dividenden reinigen", to: "/wissen/ertraege-reinigen" },
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
          { label: "Haram oder halal: 12 Verträge", to: "/vorlagen/vertrags-ampel" },
          { label: "Geprüfte Anlagen", to: "/halal-anlagen" },
          { label: "Alle kostenlosen Listen", to: "/vorlagen" },
        ],
      },
      {
        title: "Nachschlagen",
        items: [
          { label: "Wann ist eine Aktie halal?", to: "/wissen/sind-aktien-halal" },
          { label: "Dividenden reinigen", to: "/wissen/ertraege-reinigen" },
          { label: "12 Fehler beim halal Investieren", to: "/wissen/haeufige-fehler" },
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
          { label: "Zinskosten-Rechner", to: "/kreditkostenrechner" },
          { label: "Sparzielrechner", to: "/sparzielrechner" },
          { label: "Inflationsrechner", to: "/inflationsrechner" },
          { label: "Dividenden reinigen", to: "/bereinigungsrechner" },
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
          { label: "Halal-Anlagen finden", to: "/halal-anlagen" },
        ],
      },
      {
        title: "Konto und Prüfung",
        items: [
          { label: "Girokonto-Vergleich", to: "/vergleich/girokonto" },
          { label: "Halal-Aktien-Apps", to: "/vergleich/screening-apps" },
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
