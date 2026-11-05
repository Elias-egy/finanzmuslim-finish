/**
 * Daten der Seite /vorlagen/girokonto-bonus (Girokonto-Freebie als Unterseite, Elias 05.11.2026, H15 5c, Vault
 * `raw/2026-11-05-elias-h15-nr5c-bbbank-seite-haus-mietkauf.md`): die drei Girokonten aus dem Vergleich, BBBank mit der
 * Startprämie vorn. Jede Angabe trägt ihren Beleg mit Abrufdatum. Was auch im Vergleich steht (Zinsen, Dispo, Karte,
 * Kontoführung), prüft `girokontoBonus.test.ts` gegen `girokontoVergleich.ts`; die Prämie gegen `deals.ts`.
 *
 * Bewusst keine Prämie bei der norisbank (200 € nur mit Tagesgeld, ein Zinsprodukt) und bei der Consorsbank (200 €
 * hängen an drei Geldeingängen von je 1.500 € und an der Werbe-Einwilligung): Elias zeigt hier BBBank als Bonus, die
 * anderen beiden bleiben Konten im Vergleich. Quelle der Prämien-Lage: Vault `raw/2026-11-05-cv14-boni-check-top5-anbieterbelege.md`.
 */

/** Tag, an dem jede Angabe unten gegen die Anbieterseite gelesen wurde. */
export const GIRO_BONUS_STAND = "05.11.2026";

export type Beleg = { url: string; stand: string; wortlaut: string };

export type BonusKonto = {
  /** `id` im Girokonto-Vergleich (`girokontoVergleich.ts`). */
  id: string;
  /** Partnerlink-Kurzname, geöffnet über `/out/<kurzname>` (`partnerLinks.ts`). */
  out: string;
  name: string;
  produkt: string;
  domain: string;
  /** Kontoführung kostenlos ab diesem Geldeingang im Monat, in Euro. */
  gratisAb: number;
  /** Kontoführung im Monat, wenn die Bedingung nicht erfüllt ist, in Euro. */
  sonst: number;
  /** Altersgrenze, unter der die Kontoführung immer kostenlos ist. */
  gratisUnter: number;
  /** Eine Zeile für die Karte, in den Worten des Anbieters oder wörtlich aus dem Vergleich. */
  karte: string;
  bargeld: string;
  ident: string;
  belege: {
    kontofuehrung: Beleg;
    zinsen: Beleg;
    dispo: Beleg;
    karte: Beleg;
  };
};

export const BONUS_KONTEN: BonusKonto[] = [
  {
    id: "bbbank-bettersmart",
    out: "bbbank-bettersmart",
    name: "BBBank",
    produkt: "BetterSmart Konto",
    domain: "bbbank.de",
    gratisAb: 1000,
    sonst: 4.95,
    gratisUnter: 30,
    karte: "Visa Debitkarte und digitale girocard, beide kostenfrei",
    bargeld: "In der Filiale",
    ident: "E-Ident oder Video-Ident",
    belege: {
      kontofuehrung: {
        url: "https://www.bbbank.de/privatkunden/girokonto.html",
        stand: GIRO_BONUS_STAND,
        wortlaut:
          "BetterSmart Konto: „Kostenfrei bei einem Geldeingang von 1.000 € monatlich oder für alle unter 30 Jahren. Sonst 4,95 € monatlich“.",
      },
      zinsen: {
        url: "https://www.bbbank.de/services/preise-und-konditionen.html",
        stand: "20.09.2026",
        wortlaut: "3.1.1 Privatkonten, Zeile „Ab 0,01 Euro Anlagebetrag“: BetterSmart Konto ./. (kein Guthabenzins). Gleiche Quelle wie im Girokonto-Vergleich.",
      },
      dispo: {
        url: "https://www.bbbank.de/privatkunden/girokonto/erste-schritte-girokonto.html",
        stand: "14.09.2026",
        wortlaut: "„Den Dispokredit können Sie bequem online oder direkt in Ihrer Filiale beantragen.“ Gleiche Quelle wie im Girokonto-Vergleich.",
      },
      karte: {
        url: "https://www.bbbank.de/privatkunden/girokonto.html",
        stand: GIRO_BONUS_STAND,
        wortlaut: "„Visa Debitkarte (DirectCard) und digitale girocard kostenfrei dabei“.",
      },
    },
  },
  {
    id: "norisbank-top-girokonto",
    out: "norisbank",
    name: "norisbank",
    produkt: "Top-Girokonto",
    domain: "norisbank.de",
    gratisAb: 500,
    sonst: 3.9,
    gratisUnter: 30,
    karte: "Mastercard Debitkarte, kostenlos",
    bargeld: "Am Automaten",
    ident: "Video-Ident oder Post-Ident",
    belege: {
      kontofuehrung: {
        url: "https://www.norisbank.de/produkte/girokonto.html",
        stand: GIRO_BONUS_STAND,
        wortlaut:
          "„Das Top-Girokonto ist kostenlos, wenn Sie unter 30 Jahre sind oder ab 500 Euro Geldeingang pro Monat. Wenn der Geldeingang in einem Monat weniger als 500 Euro beträgt, berechnen wir dann nur für diesen Monat zum Ende des Quartals ein Kontoführungsentgelt von 3,90 Euro.“",
      },
      zinsen: {
        url: "https://www.norisbank.de/dam/norisbank/de/shared/pdf/Preis_und_Leistungsverzeichnis.pdf",
        stand: GIRO_BONUS_STAND,
        wortlaut:
          "Preis- und Leistungsverzeichnis, „Zins auf Guthaben“: beim Top-Girokonto kein Eintrag. Produktseite: „Neukunden schließen mit dem Top-Girokonto in einem Schritt ebenfalls ein kostenloses Top-Zinskonto (Tagesgeldkonto) ab.“ Bleibt es leer, fallen keine Zinsen an (Elias, 05.11.2026: „Leeres Tagesgeld ist okay“).",
      },
      dispo: {
        url: "https://www.norisbank.de/dam/norisbank/de/shared/pdf/150_Informationen_und_Bedingungen.pdf",
        stand: "14.10.2026",
        wortlaut:
          "„Auf Antrag und nach Prüfung der Bonität räumt die Bank dem Kunden auf einem Girokonto einen Dispositionskredit … ein.“ Die Werbeseite nennt zusätzlich einen Sofort-Dispo bis 500 €, auch der nur nach Prüfung.",
      },
      karte: {
        url: "https://www.norisbank.de/dam/norisbank/de/shared/pdf/entgeltinformation-top-girokonto.pdf",
        stand: "27.09.2026",
        wortlaut: "Entgeltinformation Top-Girokonto, 15.07.2026: „Ausgabe einer Debitkarte [norisbank Card]“. Mastercard und 0 € laut Girokonto-Vergleich.",
      },
    },
  },
  {
    id: "consorsbank-girokonto",
    out: "consorsbank-girokonto",
    name: "Consorsbank",
    produkt: "Girokonto",
    domain: "consorsbank.de",
    gratisAb: 700,
    sonst: 4,
    gratisUnter: 31,
    karte: "Visa Debitkarte, kostenlos",
    bargeld: "Nicht möglich",
    ident: "Video-, Post- oder E-Ident",
    belege: {
      kontofuehrung: {
        url: "https://www.consorsbank.de/content/dam/de-cb/editorial/PDF/Service-Beratung/Preise-Zinsen/CB.99.300_406-OL_Entgeltinformation-Consorsbank-Girokonto.pdf",
        stand: GIRO_BONUS_STAND,
        wortlaut:
          "Entgeltinformation Consorsbank! Girokonto: „Kontoführung: Bei einem monatlichen Mindestgeldeingang von 700,00 Euro oder für Kontoinhaber unter 31 Jahren“ kostenlos; Produktseite: „kostenlose Kontoführung für alle unter 31 Jahren oder bei mehr als 700 Euro Geldeingang im Monat“. Die 4 € sonst stehen im Girokonto-Vergleich.",
      },
      zinsen: {
        url: "https://www.consorsbank.de/web/Service/Preise-Zinsen/Preise-Zinsen-Girokonto",
        stand: GIRO_BONUS_STAND,
        wortlaut: "„Guthabenzinsen: Guthaben auf dem Girokonto wird aktuell nicht verzinst.“ (Stand 16.09.2026 auf der Seite).",
      },
      dispo: {
        url: "https://www.consorsbank.de/web/Wissen/FAQ/kontokarten/Dispositionskredit-beantragen-aendern",
        stand: "14.09.2026",
        wortlaut: "„Sobald wir Ihren Antrag geprüft und genehmigt haben, sehen Sie in Ihren Kontodetails den eingeräumten Kreditrahmen.“ Gleiche Quelle wie im Girokonto-Vergleich.",
      },
      karte: {
        url: "https://www.consorsbank.de/content/dam/de-cb/editorial/PDF/Service-Beratung/Preise-Zinsen/CB.99.300_406-OL_Entgeltinformation-Consorsbank-Girokonto.pdf",
        stand: "27.09.2026",
        wortlaut: "Entgeltinformation Consorsbank! Girokonto, 09/2026: „Ausgabe einer Debitkarte“. VISA und 0 € laut Girokonto-Vergleich.",
      },
    },
  },
];

/** Die Startprämie der BBBank. Beleg am 05.11.2026 auf der Seite der BBBank gelesen. */
export const BBBANK_PRAEMIE = {
  betrag: 50,
  /** Was die BBBank als Voraussetzung nennt, wörtlich. */
  voraussetzung: "Neukunde, du hast in den letzten 24 Monaten kein Girokonto bei uns geführt.",
  auszahlung: "innerhalb von 8 Wochen auf dein BetterSmart Konto",
  /** Beginn laut Seite; ein Enddatum nennt sie nicht, Änderung jederzeit vorbehalten. */
  start: "01.07.2026",
  steuer:
    "Diese Prämien sind sonstige Einkünfte gem. § 22 Nr. 3 EStG … Freigrenze (nicht Freibetrag) von 256,– € je Kalenderjahr für alle derartigen Einkünfte.",
  beleg: {
    url: "https://www.bbbank.de/privatkunden/girokonto.html",
    stand: GIRO_BONUS_STAND,
    wortlaut:
      "„Das kostenfreie Konto 0 € Kontoführung + 50 € Startprämie*“; „Voraussetzungen Startprämie: Neukunde, du hast in den letzten 24 Monaten kein Girokonto bei uns geführt. Die Auszahlung erfolgt nach Erfüllung der Voraussetzungen innerhalb von 8 Wochen auf dein BetterSmart Konto. Hinweis: Wir behalten uns vor, die Aktion jederzeit zu ändern oder zu beenden. Aktionsstart: 01.07.2026.“",
  } satisfies Beleg,
} as const;

/**
 * Zählkennungen der Knöpfe (`src/lib/attribution.ts`): eine je Stelle, damit im Partnerportal zu sehen ist, ob der Kopf,
 * die Begründung oder die Karte verkauft hat. Höchstens zwölf Zeichen, klein, wie Scalable es für die SubID verlangt.
 */
export const GIRO_BONUS_SRC = {
  kopf: "gbkopf",
  warum: "gbwarum",
  norisbank: "gbnoris",
  consorsbank: "gbconsors",
  vergleich: "gballe",
} as const;

export const euro = (n: number) => `${n.toLocaleString("de-DE", { minimumFractionDigits: Number.isInteger(n) ? 0 : 2 })}\u00a0€`;
