/**
 * Daten für den Auswanderungsrechner.
 *
 * Jede Zahl hat eine Quelle mit Stand. Nichts hier ist geschätzt. Wer eine
 * Zahl ändert, ändert die Quelle mit. Preisniveau aus zwei Weltbank-Reihen,
 * Steuerregeln aus dem Gesetzestext, Länderfakten von Behördenseiten.
 *
 * Kein Live-Abruf. Die Werte werden von Hand nachgezogen, das Datum steht
 * daneben und wird auf der Seite gezeigt.
 */

export type LandId = "tr" | "ae" | "sa";
export type Haushalt = "allein" | "paar" | "familie";
export type Einkommen = "mitnehmen" | "neu";

export type Quelle = { name: string; url: string; stand: string };

export type Ton = "gruen" | "gelb" | "rot" | "grau";

export type Fakt = {
  id: string;
  titel: string;
  /** Eine Zeile, steht auf der Kachel. */
  kurz: string;
  /** Zwei bis vier Sätze, hinter dem Klick. */
  detail: string;
  quelle: Quelle;
  /** Bewertung für den Leser, nicht Deko. */
  ton?: Ton;
  /** Nur zeigen, wenn dieser Haushalt gewählt ist. */
  nurFuer?: Haushalt[];
};

export type Land = {
  id: LandId;
  name: string;
  /** Wie es im Satz steht: „in der Türkei“, „in den VAE“. */
  imLand: string;
  stadt: string;
  flagge: string;
  /** Kaufkraftparität Privatkonsum, Landeswährung je internationalem Dollar. */
  ppp: number;
  /** Marktwechselkurs, Landeswährung je US-Dollar. */
  kurs: number;
  waehrung: string;
  inflation: { jahr: number; wert: number }[];
  /** Zählt als Gebiet mit niedriger Besteuerung im Sinne von § 2 AStG? */
  niedrigsteuer: boolean;
  einkommensteuer: Fakt;
  dba: Fakt;
  fakten: Fakt[];
};

/* ------------------------------------------------------------------ */
/* Quellen                                                              */
/* ------------------------------------------------------------------ */

export const quellen = {
  wbPpp: {
    name: "Weltbank, PPP-Umrechnungsfaktor Privatkonsum (PA.NUS.PRVT.PP)",
    url: "https://data.worldbank.org/indicator/PA.NUS.PRVT.PP",
    stand: "Datenjahr 2024, abgerufen 05.09.2026",
  },
  wbKurs: {
    name: "Weltbank, offizieller Wechselkurs (PA.NUS.FCRF)",
    url: "https://data.worldbank.org/indicator/PA.NUS.FCRF",
    stand: "Datenjahr 2024, abgerufen 05.09.2026",
  },
  wbInflation: {
    name: "Weltbank, Verbraucherpreise, Veränderung zum Vorjahr (FP.CPI.TOTL.ZG)",
    url: "https://data.worldbank.org/indicator/FP.CPI.TOTL.ZG",
    stand: "Datenjahre 2022 bis 2025, abgerufen 05.09.2026",
  },
  astg6: {
    name: "§ 6 AStG, Besteuerung des Vermögenszuwachses",
    url: "https://www.gesetze-im-internet.de/astg/__6.html",
    stand: "abgerufen 05.09.2026",
  },
  estg17: {
    name: "§ 17 Abs. 1 EStG, Anteile ab 1 Prozent",
    url: "https://www.gesetze-im-internet.de/estg/__17.html",
    stand: "abgerufen 05.09.2026",
  },
  invstg19: {
    name: "§ 19 Abs. 3 InvStG, Wegzug mit Investmentanteilen",
    url: "https://www.gesetze-im-internet.de/invstg_2018/__19.html",
    stand: "abgerufen 05.09.2026",
  },
  astg2: {
    name: "§ 2 AStG, erweiterte beschränkte Steuerpflicht",
    url: "https://www.gesetze-im-internet.de/astg/__2.html",
    stand: "abgerufen 05.09.2026",
  },
  estg1: {
    name: "§ 1 EStG, unbeschränkte und beschränkte Steuerpflicht",
    url: "https://www.gesetze-im-internet.de/estg/__1.html",
    stand: "abgerufen 05.09.2026",
  },
  estg49: {
    name: "§ 49 EStG, inländische Einkünfte",
    url: "https://www.gesetze-im-internet.de/estg/__49.html",
    stand: "abgerufen 05.09.2026",
  },
  bmg17: {
    name: "§ 17 BMG, Abmeldung",
    url: "https://www.gesetze-im-internet.de/bmg/__17.html",
    stand: "abgerufen 05.09.2026",
  },
  drv: {
    name: "Deutsche Rentenversicherung, Rentenansprüche bei Umzug ins Ausland",
    url: "https://www.deutsche-rentenversicherung.de/DRV/DE/Rente/Allgemeine-Informationen/Wissenswertes-zur-Rente/FAQs/International/Umzug_Ausland.html",
    stand: "abgerufen 05.09.2026",
  },
  scalable: {
    name: "Scalable Capital, Hilfe: Umzug in ein anderes Land",
    url: "https://help.scalable.capital/kontoverwaltung-f3197dc7/kann-die-gesch%C3%A4ftsbeziehung-fortgesetzt-werden-wenn-ich-ec0066b0",
    stand: "abgerufen 05.09.2026",
  },
  tradeRepublic: {
    name: "Trade Republic, Kundenvereinbarung, Ziffer 2 und Abschnitt zur Steueransässigkeit",
    url: "https://assets.traderepublic.com/assets/files/CA_DE-de.pdf",
    stand: "abgerufen 05.09.2026",
  },
  dbaTur: {
    name: "Gesetz zum DBA Deutschland–Türkei vom 19.09.2011, BGBl. 2012 II S. 526",
    url: "https://www.gesetze-im-internet.de/dbabkg_tur/BJNR052620012.html",
    stand: "abgerufen 05.09.2026",
  },
  dbaAre: {
    name: "Germany Trade & Invest, VAE Steuerrecht",
    url: "https://www.gtai.de/de/trade/vereinigte-arabische-emirate/recht/vae-steuerrecht-542556",
    stand: "Stand 19.04.2024, abgerufen 05.09.2026",
  },
  dbaSau: {
    name: "Bundesfinanzministerium, Abkommen mit Saudi-Arabien für Luftfahrtunternehmen vom 08.11.2007",
    url: "https://www.bundesfinanzministerium.de/Content/DE/Standardartikel/Themen/Steuern/Internationales_Steuerrecht/Staatenbezogene_Informationen/Laender_A_Z/Saudi_arab/2008-08-07-Saudi-Arabien-Abkommen-Luftfahrt.html",
    stand: "abgerufen 05.09.2026",
  },
  gibTarif: {
    name: "Gelir İdaresi Başkanlığı, Gelir Vergisi Tarifesi 2026",
    url: "https://cdn.gib.gov.tr/api/gibportal-file/file/getFileResources?objectKey=arsiv%2Fyardim-kaynaklar%2Fyararli-bilgiler%2Fgelir-vergisi-tarifeleri%2Fgelir-vergisi-tarifesi-2026.pdf",
    stand: "Tarif 2026, abgerufen 05.09.2026",
  },
  aaTur: {
    name: "Auswärtiges Amt, Türkei: Reise- und Sicherheitshinweise",
    url: "https://www.auswaertiges-amt.de/de/service/laender/tuerkei-node/tuerkeisicherheit/201962",
    stand: "Stand 05.09.2026",
  },
  gocSss: {
    name: "Göç İdaresi Başkanlığı, häufige Fragen zur Aufenthaltserlaubnis",
    url: "https://www.goc.gov.tr/ikamet-sss",
    stand: "abgerufen 05.09.2026",
  },
  askerlik: {
    name: "Türkisches Generalkonsulat Nantes, Dövizle askerlik işlemleri",
    url: "https://nant-bk.mfa.gov.tr/Mission/ShowInfoNote/416403",
    stand: "Mitteilung vom 07.07.2026",
  },
  cabinet49: {
    name: "VAE, Cabinet Decision No. 49 of 2023, Artikel 2",
    url: "https://mof.gov.ae/wp-content/uploads/2023/05/Cabinet-Decision-No.-49-of-2023.pdf",
    stand: "in Kraft seit 01.06.2023",
  },
  uaeArbeit: {
    name: "u.ae, Residence visa for working in the UAE",
    url: "https://u.ae/en/information-and-services/visa-and-emirates-id/residence-visas/residence-visa-for-working-in-the-uae",
    stand: "abgerufen 05.09.2026",
  },
  uaeGolden: {
    name: "u.ae, Golden visa",
    url: "https://u.ae/en/information-and-services/visa-and-emirates-id/residence-visas/golden-visa",
    stand: "abgerufen 05.09.2026",
  },
  aaAre: {
    name: "Auswärtiges Amt, VAE: Reise- und Sicherheitshinweise",
    url: "https://www.auswaertiges-amt.de/de/reiseundsicherheit/vereinigtearabischeemiratesicherheit-202332",
    stand: "Stand 05.09.2026",
  },
  zatca: {
    name: "ZATCA, Income Tax, Geltungsbereich",
    url: "https://zatca.gov.sa/en/Pages/IncomeTax.aspx",
    stand: "abgerufen 05.09.2026",
  },
  misa: {
    name: "Invest Saudi, Tax Laws and Regulations Overview",
    url: "https://eservices.misa.gov.sa/en/resources/taxLawsRegulationOverview",
    stand: "abgerufen 05.09.2026",
  },
  mcit: {
    name: "Saudi Ministry of Communications, Premium Residency",
    url: "https://mcit.gov.sa/en/node/205189",
    stand: "abgerufen 05.09.2026",
  },
  visitSaudi: {
    name: "Visit Saudi, Hilfe: Zugang nach Mekka und Medina",
    url: "https://help.visitsaudi.com/hc/en-us/articles/360009422759-Can-non-Muslims-use-the-visit-visa-to-go-to-Makkah-and-Madinah-for-Tourism-",
    stand: "abgerufen 05.09.2026",
  },
  aaSau: {
    name: "Auswärtiges Amt, Saudi-Arabien: Reise- und Sicherheitshinweise",
    url: "https://www.auswaertiges-amt.de/de/reiseundsicherheit/saudiarabiensicherheit-202298",
    stand: "Stand 05.09.2026",
  },
} satisfies Record<string, Quelle>;

/* ------------------------------------------------------------------ */
/* Deutschland als Bezugsgröße                                          */
/* ------------------------------------------------------------------ */

export const deutschland = {
  ppp: 0.701547,
  kurs: 0.923889546117607,
  inflation: [
    { jahr: 2022, wert: 6.9 },
    { jahr: 2023, wert: 5.9 },
    { jahr: 2024, wert: 2.3 },
    { jahr: 2025, wert: 2.2 },
  ],
};

/** Preisniveau eines Landes relativ zu den USA: PPP-Faktor geteilt durch Wechselkurs. */
const preisniveau = (ppp: number, kurs: number) => ppp / kurs;

/** Preisniveau relativ zu Deutschland, Deutschland = 1. */
export const preisniveauRelativ = (land: Land) =>
  preisniveau(land.ppp, land.kurs) / preisniveau(deutschland.ppp, deutschland.kurs);

/* ------------------------------------------------------------------ */
/* Steuerregeln beim Wegzug, aus dem Gesetzestext                       */
/* ------------------------------------------------------------------ */

export const wegzug = {
  anteile: {
    schwelleProzent: 1,
    vorbesitzJahre: 7,
    vonJahren: 12,
    raten: 7,
    rueckkehrJahre: 7,
    quellen: [quellen.astg6, quellen.estg17],
  },
  fonds: {
    anschaffungskostenEuro: 500_000,
    schwelleProzent: 1,
    vorbesitzJahre: 5,
    quellen: [quellen.invstg19],
  },
  erweitert: {
    dauerJahre: 10,
    vorbesitzJahre: 5,
    vonJahren: 10,
    vergleichseinkommenEuro: 77_000,
    inlandsEinkuenfteEuro: 62_000,
    inlandsVermoegenEuro: 154_000,
    bagatellEuro: 16_500,
    quellen: [quellen.astg2],
  },
  beschraenkt: {
    quellen: [quellen.estg1, quellen.estg49],
  },
};

/* ------------------------------------------------------------------ */
/* Was in Deutschland zu regeln ist, für alle drei Länder gleich        */
/* ------------------------------------------------------------------ */

export const deutschlandFakten: Fakt[] = [
  {
    id: "abmeldung",
    titel: "Abmelden, zwei Wochen Zeit",
    kurz: "Nach dem Auszug binnen zwei Wochen beim Meldeamt abmelden.",
    detail:
      "Wer aus einer Wohnung auszieht und keine neue Wohnung im Inland bezieht, hat sich innerhalb von zwei Wochen nach dem Auszug bei der Meldebehörde abzumelden. Frühestens eine Woche vor dem Auszug ist das möglich. Die Abmeldebescheinigung brauchst du später für Bank, Rente und Steuer.",
    quelle: quellen.bmg17,
  },
  {
    id: "rente",
    titel: "Rente wird gezahlt, mit einer Lücke",
    kurz: "Grundsätzlich auch ins Ausland. Manche Zeiten nur in der EU.",
    detail:
      "Die Rentenversicherung zahlt Renten grundsätzlich auch ins Ausland. Bestimmte Versicherungszeiten werden aber nur bei gewöhnlichem Aufenthalt in einem Mitgliedstaat gezahlt, und eine Erwerbsminderungsrente wegen des verschlossenen Arbeitsmarkts kann bei dauerhaftem Wegzug entfallen. Der Umzug soll zwei Monate vorher gemeldet werden, mit neuer Adresse und Bankverbindung. Mit der Türkei besteht ein Sozialversicherungsabkommen, mit den VAE und Saudi-Arabien nicht.",
    quelle: quellen.drv,
  },
  {
    id: "depot",
    titel: "Das Depot zieht nicht mit",
    kurz: "Scalable beendet die Beziehung außerhalb der EU, Trade Republic setzt Wohnsitz in seinen Ländern voraus.",
    detail:
      "Scalable Capital: „Im Falle eines Umzugs in ein Land außerhalb des Gebiets der Europäischen Union kann die Geschäftsbeziehung aus geschäftspolitischen Gründen nicht fortgesetzt werden.“ Trade Republic bietet seine Dienste laut Kundenvereinbarung Kunden mit Wohnsitz in den Ländern an, in denen es tätig ist, und verlangt, dass Änderungen der Steueransässigkeit binnen 30 Tagen mitgeteilt werden. Wer auswandert, muss das Depot vorher übertragen oder verkaufen, und ein Verkauf ist ein steuerpflichtiger Vorgang.",
    quelle: quellen.scalable,
  },
];

/* ------------------------------------------------------------------ */
/* Die drei Länder                                                      */
/* ------------------------------------------------------------------ */

export const laender: Land[] = [
  {
    id: "tr",
    name: "Türkei",
    imLand: "in der Türkei",
    stadt: "Istanbul",
    flagge: "🇹🇷",
    ppp: 12.551671,
    kurs: 32.8058614432703,
    waehrung: "Lira",
    inflation: [
      { jahr: 2022, wert: 72.3 },
      { jahr: 2023, wert: 53.9 },
      { jahr: 2024, wert: 58.5 },
      { jahr: 2025, wert: 34.9 },
    ],
    niedrigsteuer: false,
    einkommensteuer: {
      id: "tr-steuer",
      titel: "Einkommensteuer 15 bis 40 Prozent",
      kurz: "Progressiv, ab 190.000 Lira im Jahr steigt der Satz.",
      detail:
        "Der Tarif 2026 beginnt bei 15 Prozent bis 190.000 Lira, dann 20 Prozent bis 400.000, 27 Prozent bis 1.000.000 (bei Arbeitslohn bis 1.500.000), 35 Prozent bis 5.300.000 und darüber 40 Prozent. Wer dort arbeitet, zahlt dort Steuer, und zwar nicht wenig. Als Niedrigsteuerland im Sinne von § 2 AStG gilt die Türkei deshalb nicht.",
      quelle: quellen.gibTarif,
      ton: "gelb",
    },
    dba: {
      id: "tr-dba",
      titel: "Abkommen mit Deutschland gilt",
      kurz: "DBA von 2011 in Kraft. Doppelte Besteuerung wird geregelt.",
      detail:
        "Das Abkommen vom 19. September 2011 zwischen Deutschland und der Türkei ist als Gesetz vom 24. Mai 2012 in Kraft (BGBl. 2012 II S. 526). Es verteilt das Besteuerungsrecht für Lohn, Rente, Mieten und Kapitalerträge zwischen beiden Ländern. Wer deutsche Einkünfte behält, hat damit eine klare Regel, wer was besteuert.",
      quelle: quellen.dbaTur,
      ton: "gruen",
    },
    fakten: [
      {
        id: "tr-lira",
        titel: "Die Lira frisst Erspartes",
        kurz: "Inflation 2025: 34,9 Prozent. 2022 waren es 72,3 Prozent.",
        detail:
          "Wer sein Geld in Lira hält, verliert es schnell. Die Verbraucherpreise stiegen 2022 um 72,3 Prozent, 2023 um 53,9, 2024 um 58,5 und 2025 um 34,9 Prozent. In Deutschland waren es 2025 2,2 Prozent. Rücklagen gehören deshalb nicht auf ein Lira-Konto, sondern in Sachwerte oder in eine stabile Währung.",
        quelle: quellen.wbInflation,
        ton: "rot",
      },
      {
        id: "tr-aufenthalt",
        titel: "Aufenthaltserlaubnis binnen 90 Tagen",
        kurz: "Vor Ort beantragen, Krankenversicherung muss den Zeitraum decken.",
        detail:
          "Wer länger bleibt, beantragt innerhalb von 90 Tagen nach Einreise vor Ort eine Aufenthaltserlaubnis. Die Migrationsbehörde verlangt dafür eine Krankenversicherung, die die beantragte Dauer abdeckt, privat oder über die staatliche Kasse SGK. Die Kurzzeit-Aufenthaltserlaubnis wird für höchstens zwei Jahre am Stück erteilt.",
        quelle: quellen.aaTur,
        ton: "gelb",
      },
      {
        id: "tr-familie",
        titel: "Familie: Versicherung für alle Pflicht",
        kurz: "Beim Familienaufenthalt muss der Sponsor alle Mitglieder versichern.",
        detail:
          "Für die Familien-Aufenthaltserlaubnis muss die tragende Person eine gültige Krankenversicherung nachweisen, die alle Familienmitglieder abdeckt, und ein Einkommen von mindestens einem Drittel des Mindestlohns je Familienmitglied, insgesamt nicht unter dem Mindestlohn.",
        quelle: quellen.gocSss,
        ton: "gelb",
        nurFuer: ["familie"],
      },
      {
        id: "tr-wehrpflicht",
        titel: "Wehrpflicht bei türkischem Pass",
        kurz: "Freikauf möglich nach 1.095 Arbeitstagen im Ausland, Stand Juli 2026: 472.653,60 Lira.",
        detail:
          "Türkische Staatsangehörige, auch mit zweitem Pass, unterliegen der Wehrpflicht. Wer mit Aufenthalts- und Arbeitserlaubnis mindestens 1.095 Tage im Ausland gearbeitet hat, kann sich gegen Zahlung freikaufen. Der Betrag lag laut Konsulat im Juli 2026 bei 472.653,60 Lira, zahlbar in Euro zum Tageskurs, nach einem verpflichtenden Fernkurs. Wer in die Türkei zieht, sammelt diese Auslandstage nicht mehr.",
        quelle: quellen.askerlik,
        ton: "gelb",
      },
    ],
  },
  {
    id: "ae",
    name: "VAE",
    imLand: "in den VAE",
    stadt: "Dubai",
    flagge: "🇦🇪",
    ppp: 2.5631099566799,
    kurs: 3.6725,
    waehrung: "Dirham",
    inflation: [
      { jahr: 2022, wert: 5.3 },
      { jahr: 2023, wert: 1.6 },
      { jahr: 2024, wert: 1.7 },
      { jahr: 2025, wert: 1.3 },
    ],
    niedrigsteuer: true,
    einkommensteuer: {
      id: "ae-steuer",
      titel: "Keine Steuer auf Gehalt",
      kurz: "Lohn, private Kapitalerträge und Mieten sind ausdrücklich ausgenommen.",
      detail:
        "Die Körperschaftsteuer von 9 Prozent gilt seit Juni 2023 für Geschäfte, nicht für Privatpersonen. Cabinet Decision 49 von 2023 nimmt drei Einkunftsarten natürlicher Personen ausdrücklich aus: Lohn, private Kapitalanlagen und private Immobilieneinkünfte, unabhängig von der Höhe. Erst ab einer Million Dirham Umsatz aus eigener Geschäftstätigkeit wird eine Privatperson steuerpflichtig. Genau deshalb gelten die VAE für § 2 AStG als Niedrigsteuergebiet.",
      quelle: quellen.cabinet49,
      ton: "gruen",
    },
    dba: {
      id: "ae-dba",
      titel: "Kein Abkommen mehr seit 2022",
      kurz: "Das DBA lief am 31. Dezember 2021 aus und wurde nicht verlängert.",
      detail:
        "Das Abkommen vom 1. Juli 2010 lief am 31. Dezember 2021 aus. Deutschland hat es nicht verlängert, und es gibt keine Bestrebungen für ein neues. Deutsche Einkünfte, etwa Mieten oder eine gesetzliche Rente, unterliegen damit ohne Abkommensschutz der beschränkten Steuerpflicht in Deutschland. Weil die VAE selbst nichts erheben, entsteht keine doppelte Steuer, aber auch keine Entlastung.",
      quelle: quellen.dbaAre,
      ton: "gelb",
    },
    fakten: [
      {
        id: "ae-visum",
        titel: "Aufenthalt hängt am Arbeitgeber",
        kurz: "Arbeitsvisum zwei Jahre, der Arbeitgeber beantragt es. Golden Visa fünf oder zehn Jahre ohne Sponsor.",
        detail:
          "Das Standard-Arbeitsvisum beantragt der Arbeitgeber, es gilt zwei Jahre und wird verlängert, solange das Arbeitsverhältnis besteht. Wer nicht an einen Arbeitgeber gebunden sein will, braucht ein Golden Visa: fünf oder zehn Jahre, ohne Sponsor, für Investoren ab zwei Millionen Dirham, Immobilieneigentümer und bestimmte Fachkräfte.",
        quelle: quellen.uaeArbeit,
        ton: "gelb",
      },
      {
        id: "ae-schulden",
        titel: "Schulden sind ein Haftgrund",
        kurz: "Offene Forderungen können zur Festnahme und zur Ausreisesperre führen.",
        detail:
          "Das Auswärtige Amt warnt: Offene oder strittige Forderungen aus früheren Geschäftsbeziehungen können zur vorläufigen Festnahme zwecks Begleichung von Altschulden führen. Ausreisesperren sind ausdrücklich genannt und können Monate dauern. Wer mit Kreditkarte und Dispo lebt, sollte das vor dem Umzug abstellen.",
        quelle: quellen.aaAre,
        ton: "rot",
      },
      {
        id: "ae-kranken",
        titel: "Krankenkosten trägst du selbst",
        kurz: "Ohne Versicherung zahlst du Behandlung und Rückflug aus eigener Tasche.",
        detail:
          "Ohne ausreichenden Versicherungsschutz sind notwendige Kosten vor Ort, etwa Behandlungs- und Krankenhauskosten oder ein Heimflug, grundsätzlich selbst zu tragen. Die deutsche Krankenkasse zahlt hier nichts. Eine Versicherung im Land ist der erste Vertrag nach dem Mietvertrag.",
        quelle: quellen.aaAre,
        ton: "gelb",
      },
      {
        id: "ae-preise",
        titel: "Dubai liegt über dem Landesschnitt",
        kurz: "Das Preisniveau ist ein Durchschnitt über alle Emirate. Dubai ist teurer.",
        detail:
          "Die Weltbank-Zahl bildet den privaten Konsum im ganzen Land ab. Wer nach Dubai oder Abu Dhabi zieht, zahlt für Miete und Schule mehr als dieser Schnitt. Die Ersparnis gegenüber Deutschland liegt in den VAE fast nur bei der Steuer, nicht bei den Preisen.",
        quelle: quellen.wbPpp,
        ton: "gelb",
      },
    ],
  },
  {
    id: "sa",
    name: "Saudi-Arabien",
    imLand: "in Saudi-Arabien",
    stadt: "Medina",
    flagge: "🇸🇦",
    ppp: 1.88236064348873,
    kurs: 3.75,
    waehrung: "Riyal",
    inflation: [
      { jahr: 2022, wert: 2.5 },
      { jahr: 2023, wert: 2.3 },
      { jahr: 2024, wert: 1.7 },
      { jahr: 2025, wert: 2.1 },
    ],
    niedrigsteuer: true,
    einkommensteuer: {
      id: "sa-steuer",
      titel: "Keine Steuer auf dein Gehalt",
      kurz: "Das Einkommensteuergesetz trifft Firmenanteile von Ausländern, nicht Löhne.",
      detail:
        "Die saudische Einkommensteuer gilt für die Anteile nicht-saudischer Gesellschafter an ansässigen Kapitalgesellschaften mit 20 Prozent und für Betriebsstätten. Saudis und Bürger der Golfstaaten zahlen stattdessen 2,5 Prozent Zakat. Bankkonten und der Handel mit an der saudischen Börse notierten Aktien durch ansässige Privatpersonen sind ausdrücklich nicht erfasst. Auf Waren und Dienstleistungen liegen 15 Prozent Mehrwertsteuer.",
      quelle: quellen.zatca,
      ton: "gruen",
    },
    dba: {
      id: "sa-dba",
      titel: "Nur ein Abkommen für Fluggesellschaften",
      kurz: "Ein allgemeines DBA mit Deutschland gibt es nicht.",
      detail:
        "Zwischen Deutschland und Saudi-Arabien besteht nur das Abkommen vom 8. November 2007 für Luftfahrtunternehmen und deren Beschäftigte. Für alle anderen gibt es kein Abkommen. Deutsche Einkünfte bleiben damit in Deutschland beschränkt steuerpflichtig, ohne Abkommensschutz, aber auch ohne saudische Gegenseite.",
      quelle: quellen.dbaSau,
      ton: "gelb",
    },
    fakten: [
      {
        id: "sa-residency",
        titel: "Premium Residency statt Sponsor",
        kurz: "Eigene Aufenthaltstitel für Investoren, Unternehmer, Immobilienbesitzer und Fachkräfte.",
        detail:
          "Saudi-Arabien vergibt eine Premium Residency in mehreren Kategorien: Special Talent, Gifted, Investor, Entrepreneur, Real Estate Owner sowie befristet und unbefristet. Sie erlaubt laut Regierung, Geschäfte zu betreiben, Immobilien zu besitzen, ohne Visum ein- und auszureisen und ist von den Gebühren für Ausländer und Angehörige befreit. Gebühren und Mindestbeträge stehen auf der offiziellen Antragsseite und ändern sich, deshalb nennen wir hier keine.",
        quelle: quellen.mcit,
        ton: "gruen",
      },
      {
        id: "sa-mekka",
        titel: "Mekka nur für Muslime",
        kurz: "Medina ist offen, außer der Prophetenmoschee. Mekka nicht.",
        detail:
          "Nur Muslime dürfen nach Mekka. Medina ist für Nichtmuslime mit Visum zugänglich, mit Ausnahme des Haram um die Prophetenmoschee. Das betrifft nichtmuslimische Familienangehörige und Besuch aus Deutschland. Rund um die Pilgerzeit rechnet das Auswärtige Amt zusätzlich mit Zugangsbeschränkungen für beide Städte.",
        quelle: quellen.visitSaudi,
        ton: "gelb",
      },
      {
        id: "sa-ausreise",
        titel: "Arbeitgeber können die Ausreise sperren",
        kurz: "Bei Streit mit dem Arbeitgeber wurden Deutsche an der Ausreise gehindert.",
        detail:
          "Das Auswärtige Amt berichtet, dass deutsche Arbeitnehmer wegen Streitigkeiten an der Ausreise gehindert wurden und Arbeitgeber Ausreisesperren verhängen lassen können. Wer dort arbeitet, sollte den Arbeitsvertrag vorher prüfen lassen und Iqama-Daten nie telefonisch herausgeben.",
        quelle: quellen.aaSau,
        ton: "rot",
      },
      {
        id: "sa-kranken",
        titel: "Krankenversicherung selbst abschließen",
        kurz: "Die deutsche Kasse zahlt nicht. Das Auswärtige Amt rät zu eigener Absicherung.",
        detail:
          "Das Auswärtige Amt empfiehlt für die Dauer des Aufenthalts eine Krankenversicherung, die Risiken abdeckt, die von den gesetzlichen Kassen nicht übernommen werden. Wer dort angestellt ist, ist meist über den Arbeitgeber versichert. Wer mit eigenem Aufenthaltstitel kommt, schließt selbst ab.",
        quelle: quellen.aaSau,
        ton: "gelb",
      },
    ],
  },
];

export const landById = (id: LandId) => laender.find((l) => l.id === id) ?? laender[0];

/** Alle Quellen der Seite in Anzeigereihenfolge, ohne Doppelte. */
export const alleQuellen: Quelle[] = Object.values(quellen);
