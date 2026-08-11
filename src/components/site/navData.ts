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
          { label: "Was ist Riba" },
          { label: "Was ist Gharar" },
          { label: "Halal investieren für Anfänger", to: "/halal-guide" },
          { label: "Häufige Fehler" },
        ],
      },
      {
        title: "Investieren",
        items: [
          { label: "Halal ETFs", to: "/dein-investmentstart" },
          { label: "Aktien prüfen" },
          { label: "Sukuk" },
          { label: "Gold" },
          { label: "Krypto" },
        ],
      },
      {
        title: "Alltag",
        items: [
          { label: "Girokonto" },
          { label: "Dispo und Kredit" },
          { label: "Ratenkauf" },
          { label: "Leasing" },
          { label: "Versicherung" },
        ],
      },
      {
        title: "Pflichten",
        items: [
          { label: "Zakat berechnen", to: "/zakat-rechner" },
          { label: "Nisab" },
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
        title: "Zakat und Pflichten",
        items: [
          { label: "Zakat-Rechner", to: "/zakat-rechner" },
          { label: "Nisab-Rechner" },
          { label: "Zakat auf Depot" },
          { label: "Reinigungs-Rechner" },
        ],
      },
      {
        title: "Investieren",
        items: [
          { label: "Renditerechner", to: "/renditerechner" },
          { label: "Sparplan-Rechner" },
          { label: "Kinderdepot-Rechner" },
        ],
      },
      {
        title: "Riba vermeiden",
        items: [
          { label: "Riba-Kosten-Rechner" },
          { label: "Auslandsüberweisung" },
          { label: "Miete oder Kauf" },
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
          { label: "Depot-Vergleich", to: "/vergleich/depot" },
          { label: "Kinderdepot" },
          { label: "Halal-Screening-Apps" },
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
