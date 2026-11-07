export type NavEntry = { label: string; to?: string };
export type NavColumn = { title: string; items: NavEntry[] };
export type NavGroup = { label: string; columns: NavColumn[] };

/** Nur real existierende Routen bekommen `to`. Alles andere: grau + "bald". */
export const navGroups: NavGroup[] = [
  {
    label: "Blog",
    columns: [
      {
        title: "Grundlagen",
        items: [
          { label: "Alle Beiträge", to: "/blog" },
          { label: "Newsletter", to: "/newsletter" },
          { label: "Zinsen im Islam", to: "/blog/zinsen-im-islam" },
          { label: "Was ist Gharar", to: "/blog/gharar" },
          { label: "Glücksspiel (Maysir)", to: "/blog/maysir" },
          { label: "Trading, Forex und CFDs", to: "/blog/trading-forex-cfd" },
          { label: "Halal investieren für Anfänger", to: "/halal-guide" },
          { label: "12 Fehler beim halal Investieren", to: "/blog/haeufige-fehler" },
        ],
      },
      {
        title: "Investieren",
        items: [
          { label: "Halal-Anlagen", to: "/halal-anlagen" },
          { label: "Beste Halal ETFs", to: "/blog/halal-etf" },
          { label: "Sind Aktien halal?", to: "/blog/sind-aktien-haram" },
          { label: "Sukuk", to: "/blog/sukuk" },
          { label: "Halal Gold kaufen", to: "/blog/halal-gold-kaufen" },
          { label: "Ist Bitcoin halal?", to: "/blog/ist-bitcoin-halal" },
        ],
      },
      {
        title: "Alltag",
        items: [
          { label: "Girokonto ohne Zinsen", to: "/blog/girokonto-ohne-zinsen" },
          { label: "Ist die Kreditkarte haram?", to: "/blog/kreditkarte-halal" },
          { label: "Dispo und Schulden", to: "/blog/dispo-und-schulden" },
          { label: "Halal Kredit", to: "/blog/halal-kredit" },
          { label: "Ist Ratenzahlung haram?", to: "/blog/ratenzahlung-haram" },
          { label: "Haus kaufen ohne Zinsen", to: "/blog/haus-kaufen-ohne-zinsen" },
          { label: "Auto kaufen ohne Zinsen", to: "/blog/auto-kaufen-ohne-zinsen" },
          { label: "Ist Leasing haram?", to: "/blog/ist-leasing-haram" },
          { label: "Sind Versicherungen haram?", to: "/blog/sind-versicherungen-haram" },
        ],
      },
      {
        title: "Pflichten",
        items: [
          { label: "Zakat berechnen", to: "/zakat-rechner" },
          { label: "Nisab", to: "/blog/nisab" },
          { label: "Zakat auf Aktien und ETFs", to: "/blog/zakat-auf-aktien-etf-krypto" },
          { label: "Dividenden reinigen", to: "/blog/ertraege-reinigen" },
          { label: "Erbe nach islamischem Recht", to: "/blog/erbe" },
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
        ],
      },
      {
        title: "Nachschlagen",
        items: [
          { label: "Wann ist eine Aktie halal?", to: "/blog/sind-aktien-haram" },
          { label: "Dividenden reinigen", to: "/blog/ertraege-reinigen" },
          { label: "12 Fehler beim halal Investieren", to: "/blog/haeufige-fehler" },
          { label: "Zinsen im Islam", to: "/blog/zinsen-im-islam" },
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
