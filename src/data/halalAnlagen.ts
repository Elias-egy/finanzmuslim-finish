export type Kategorie = "aktien" | "sukuk" | "gold" | "silber" | "rohstoffe" | "krypto";

export type Anlage = {
  /** Fester Slug für /halal-anlagen/[slug]. Nicht zur Laufzeit berechnen. */
  slug: string;
  name: string;
  /** Fehlt bei Krypto, eine Münze hat keine Wertpapierkennnummer. */
  isin?: string;
  /** Schlüssel in kurse.json, Feld krypto. Nur bei Krypto gesetzt. */
  kursKey?: string;
  /** Börsenkürzel, steht in der Zeile unter dem Namen. */
  kuerzel?: string;
  anbieter: string;
  kategorie: Kategorie;
  /** Laufende Kosten pro Jahr in Prozent. */
  kosten: number;
  kostenLabel: string;
  groesse?: string;
  /** Sortierwert in Mio. EUR. */
  groesseSortierwert?: number;
  ertrag?: "ausschuettend" | "thesaurierend";
  ertragDetail?: string;
  bauart?: "passiv" | "aktiv";
  replikation?: string;
  domizil?: string;
  auflage?: string;
  zertifizierer: string;
  /** Einmalige Gebühr beim Kauf, nur wo der Anbieter eine erhebt. */
  ausgabeaufschlag?: string;
  /** Ersetzt den Standardsatz unter dem Ausgabeaufschlag. Nötig, wo die Gebühr
   *  nur auf einem Kaufweg anfällt und über die Börse entfällt. */
  ausgabeaufschlagHinweis?: string;
  /** Stand der Fondsgröße, wo die Zahl aus einem älteren Factsheet stammt. */
  groesseStand?: string;
  /** Direktlink auf den Shariah-Nachweis, falls geprüft. */
  zertifikatLink?: string;
  zertifikatHinweis?: string;
  /** "produkt" = eigenes Zertifikat des Anbieters, "index" = Nachweis nur zum Index. */
  zertifikatArt?: "produkt" | "index";
  /** Zweiter Nachweis, wo Produkt und Index getrennt geprüft werden. */
  zweiterBeleg?: { titel: string; url: string };
  /** Zeichen der Münze, steht in der Kachel bis ein Logo vorliegt. */
  zeichen?: string;
  /**
   * Kurzer Vorbehalt zur Anlage. Steht bisher nur bei Chainlink und wird
   * nirgends angezeigt, der Inhalt steckt auch im zertifikatHinweis. Das Feld
   * fehlte im Typ, was niemandem auffiel, weil die Typprüfung nie lief.
   */
  hinweis?: string;
};

export type Anbieter = { kuerzel: string; name: string; logo?: string; domain?: string };

/** Anbieter-Kachel liest hieraus. logo bleibt leer, bis echte Logos vorliegen. */
export const anbieter: Anbieter[] = [
  { kuerzel: "iS", name: "iShares", domain: "ishares.com" },
  { kuerzel: "IV", name: "Invesco", domain: "invesco.com" },
  { kuerzel: "HS", name: "HSBC", domain: "hsbc.com" },
  { kuerzel: "WT", name: "WisdomTree", domain: "wisdomtree.eu" },
  { kuerzel: "XT", name: "Xtrackers", domain: "xtrackers.com" },
  { kuerzel: "HA", name: "HANetf", domain: "hanetf.com" },
  { kuerzel: "CG", name: "Comgest", domain: "comgest.com" },
  { kuerzel: "FT", name: "Franklin Templeton", domain: "franklintempleton.com" },
  { kuerzel: "BP", name: "BNP Paribas", domain: "bnpparibas.com" },
];

export const anbieterByName = (name: string) => anbieter.find((a) => a.name === name);

export const halalAnlagen: Anlage[] = [
  {
    slug: "ishares-msci-world-islamic",
    name: "iShares MSCI World Islamic",
    isin: "IE00B27YCN58",
    zertifikatArt: "produkt",
    zertifikatLink:
      "https://www.blackrock.com/ch/individual/en/literature/prospectus/ishares-ii-plc-prospectus-en.pdf",
    zertifikatHinweis:
      "Der Verkaufsprospekt von iShares II plc nennt ein eigenes Gremium für die Islamic-Aktienfonds, das Shari'ah Equity Funds Panel. Ihm gehören Dr. Mohamed Elgari, Scheich Nizam Yaquby und Dr. Mohd Daud Bakar an. Das Panel hat eine Fatwa für diese Fonds erteilt und stellt jedes Jahr ein Shariah-Zertifikat aus. Welche Aktien überhaupt in Frage kommen, entscheidet davon getrennt der MSCI Shari'ah Board.",
    zweiterBeleg: {
      titel: "Methodik der MSCI Islamic Index Series",
      url: "https://www.msci.com/index/methodology/latest/Islamic",
    },
    anbieter: "iShares",
    kategorie: "aktien",
    kosten: 0.3,
    kostenLabel: "0,30 %",
    groesse: "1.378 Mio. €",
    groesseSortierwert: 1378,
    ertrag: "ausschuettend",
    ertragDetail: "ausschüttend, halbjährlich",
    bauart: "passiv",
    replikation: "physisch, vollständig",
    domizil: "Irland",
    auflage: "07.12.2007",
    zertifizierer: "Shari'ah Equity Funds Panel bei iShares, Index vom MSCI Shariah Board",
  },
  {
    slug: "ishares-msci-emerging-markets-islamic",
    name: "iShares MSCI Emerging Markets Islamic",
    isin: "IE00B27YCP72",
    zertifikatArt: "produkt",
    zertifikatLink:
      "https://www.blackrock.com/ch/individual/en/literature/prospectus/ishares-ii-plc-prospectus-en.pdf",
    zertifikatHinweis:
      "Der Verkaufsprospekt von iShares II plc nennt ein eigenes Gremium für die Islamic-Aktienfonds, das Shari'ah Equity Funds Panel. Ihm gehören Dr. Mohamed Elgari, Scheich Nizam Yaquby und Dr. Mohd Daud Bakar an. Das Panel hat eine Fatwa für diese Fonds erteilt und stellt jedes Jahr ein Shariah-Zertifikat aus. Welche Aktien überhaupt in Frage kommen, entscheidet davon getrennt der MSCI Shari'ah Board.",
    zweiterBeleg: {
      titel: "Methodik der MSCI Islamic Index Series",
      url: "https://www.msci.com/index/methodology/latest/Islamic",
    },
    anbieter: "iShares",
    kategorie: "aktien",
    kosten: 0.35,
    kostenLabel: "0,35 %",
    groesse: "688 Mio. €",
    groesseSortierwert: 688,
    ertrag: "ausschuettend",
    ertragDetail: "ausschüttend, halbjährlich",
    bauart: "passiv",
    replikation: "physisch, vollständig",
    domizil: "Irland",
    auflage: "07.12.2007",
    zertifizierer: "Shari'ah Equity Funds Panel bei iShares, Index vom MSCI Shariah Board",
  },
  {
    slug: "ishares-msci-usa-islamic",
    name: "iShares MSCI USA Islamic",
    isin: "IE00B296QM64",
    zertifikatArt: "produkt",
    zertifikatLink:
      "https://www.blackrock.com/ch/individual/en/literature/prospectus/ishares-ii-plc-prospectus-en.pdf",
    zertifikatHinweis:
      "Der Verkaufsprospekt von iShares II plc nennt ein eigenes Gremium für die Islamic-Aktienfonds, das Shari'ah Equity Funds Panel. Ihm gehören Dr. Mohamed Elgari, Scheich Nizam Yaquby und Dr. Mohd Daud Bakar an. Das Panel hat eine Fatwa für diese Fonds erteilt und stellt jedes Jahr ein Shariah-Zertifikat aus. Welche Aktien überhaupt in Frage kommen, entscheidet davon getrennt der MSCI Shari'ah Board.",
    zweiterBeleg: {
      titel: "Methodik der MSCI Islamic Index Series",
      url: "https://www.msci.com/index/methodology/latest/Islamic",
    },
    anbieter: "iShares",
    kategorie: "aktien",
    kosten: 0.3,
    kostenLabel: "0,30 %",
    groesse: "475 Mio. €",
    groesseSortierwert: 475,
    ertrag: "ausschuettend",
    ertragDetail: "ausschüttend, halbjährlich",
    bauart: "passiv",
    replikation: "physisch, Sampling",
    domizil: "Irland",
    auflage: "07.12.2007",
    zertifizierer: "Shari'ah Equity Funds Panel bei iShares, Index vom MSCI Shariah Board",
  },
  {
    slug: "invesco-dow-jones-islamic-global-developed-markets",
    zertifikatArt: "produkt",
    zertifikatLink:
      "https://etf.invesco.com/de/private/de/product/invesco-dow-jones-islamic-global-developed-markets-ucits-etf-acc/documents",
    zertifikatHinweis:
      "Invesco veröffentlicht für genau diesen ETF jährliche Shariah-Zertifikate, zuletzt für das Jahr 2024. Sie stehen auf der Dokumentenseite unter dem Namen Annual Shariah Compliance Certificate. Dort liegt auch eine Tabelle, mit der du den zu spendenden Anteil deiner Dividende ausrechnest.",
    zweiterBeleg: {
      titel: "Methodik der Dow Jones Islamic Market Indizes",
      url: "https://www.spglobal.com/spdji/en/documents/methodologies/methodology-dj-islamic-market-indices.pdf",
    },
    name: "Invesco Dow Jones Islamic Global Developed Markets",
    isin: "IE000UOXRAM8",
    anbieter: "Invesco",
    kategorie: "aktien",
    kosten: 0.4,
    kostenLabel: "0,40 %",
    groesse: "975 Mio. €",
    groesseSortierwert: 975,
    ertrag: "thesaurierend",
    ertragDetail: "thesaurierend",
    bauart: "passiv",
    replikation: "physisch, vollständig",
    domizil: "Irland",
    auflage: "07.01.2022",
    zertifizierer: "S&P Dow Jones Shariah Supervisory Board",
  },
  {
    slug: "invesco-msci-acwi-islamic-m-series",
    name: "Invesco MSCI ACWI Islamic M-Series",
    isin: "IE000LFC57H7",
    zertifikatArt: "index",
    zertifikatLink: "https://www.msci.com/index/methodology/latest/Islamic",
    zertifikatHinweis:
      "Methodik der MSCI Islamic Index Series. Darin bestätigt MSCI, dass die Methodik vom Shariah-Ausschuss aus islamischen Gelehrten als konform freigegeben wurde und dass die Prüfer regelmäßig eine Zertifizierung für den jeweiligen Prüfzeitraum ausstellen. Es ist ein Methodik-Dokument, kein produktbezogenes Einzelzertifikat.",
    anbieter: "Invesco",
    kategorie: "aktien",
    kosten: 0.35,
    kostenLabel: "0,35 %",
    groesse: "102 Mio. €",
    groesseSortierwert: 102,
    ertrag: "thesaurierend",
    ertragDetail: "thesaurierend",
    bauart: "passiv",
    replikation: "physisch, Sampling",
    domizil: "Irland",
    auflage: "10.02.2026",
    zertifizierer: "MSCI Shariah Advisory Board, Fatwa seit 2007",
  },
  {
    slug: "hsbc-msci-world-islamic-screened",
    name: "HSBC MSCI World Islamic Screened",
    isin: "IE000X9FTI22",
    zertifikatArt: "index",
    zertifikatLink: "https://www.msci.com/index/methodology/latest/Islamic",
    zertifikatHinweis:
      "Methodik der MSCI Islamic Index Series. Darin bestätigt MSCI, dass die Methodik vom Shariah-Ausschuss aus islamischen Gelehrten als konform freigegeben wurde und dass die Prüfer regelmäßig eine Zertifizierung für den jeweiligen Prüfzeitraum ausstellen. Es ist ein Methodik-Dokument, kein produktbezogenes Einzelzertifikat.",
    anbieter: "HSBC",
    kategorie: "aktien",
    kosten: 0.3,
    kostenLabel: "0,30 %",
    groesse: "126 Mio. €",
    groesseSortierwert: 126,
    ertrag: "thesaurierend",
    ertragDetail: "thesaurierend",
    bauart: "passiv",
    replikation: "physisch, vollständig",
    domizil: "Irland",
    auflage: "30.11.2022",
    zertifizierer: "MSCI Shariah Advisory Board, Fatwa seit 2007",
  },
  {
    slug: "hsbc-msci-usa-islamic-screened",
    name: "HSBC MSCI USA Islamic Screened",
    isin: "IE000I5NV504",
    zertifikatArt: "index",
    zertifikatLink: "https://www.msci.com/index/methodology/latest/Islamic",
    zertifikatHinweis:
      "Methodik der MSCI Islamic Index Series. Darin bestätigt MSCI, dass die Methodik vom Shariah-Ausschuss aus islamischen Gelehrten als konform freigegeben wurde und dass die Prüfer regelmäßig eine Zertifizierung für den jeweiligen Prüfzeitraum ausstellen. Es ist ein Methodik-Dokument, kein produktbezogenes Einzelzertifikat.",
    anbieter: "HSBC",
    kategorie: "aktien",
    kosten: 0.3,
    kostenLabel: "0,30 %",
    groesse: "77 Mio. €",
    groesseSortierwert: 77,
    ertrag: "thesaurierend",
    ertragDetail: "thesaurierend",
    bauart: "passiv",
    replikation: "physisch, vollständig",
    domizil: "Irland",
    auflage: "17.11.2022",
    zertifizierer: "MSCI Shariah Advisory Board, Fatwa seit 2007",
  },
  {
    slug: "hsbc-msci-europe-islamic-screened",
    name: "HSBC MSCI Europe Islamic Screened",
    isin: "IE000AGFZM58",
    zertifikatArt: "index",
    zertifikatLink: "https://www.msci.com/index/methodology/latest/Islamic",
    zertifikatHinweis:
      "Methodik der MSCI Islamic Index Series. Darin bestätigt MSCI, dass die Methodik vom Shariah-Ausschuss aus islamischen Gelehrten als konform freigegeben wurde und dass die Prüfer regelmäßig eine Zertifizierung für den jeweiligen Prüfzeitraum ausstellen. Es ist ein Methodik-Dokument, kein produktbezogenes Einzelzertifikat.",
    anbieter: "HSBC",
    kategorie: "aktien",
    kosten: 0.3,
    kostenLabel: "0,30 %",
    groesse: "150 Mio. €",
    groesseSortierwert: 150,
    ertrag: "thesaurierend",
    ertragDetail: "thesaurierend",
    bauart: "passiv",
    replikation: "physisch, vollständig",
    domizil: "Irland",
    auflage: "05.12.2022",
    zertifizierer: "MSCI Shariah Advisory Board, Fatwa seit 2007",
  },
  {
    slug: "hsbc-msci-emerging-markets-islamic-screened-capped",
    name: "HSBC MSCI Emerging Markets Islamic Screened Capped",
    isin: "IE0009BC6K22",
    zertifikatArt: "index",
    zertifikatLink: "https://www.msci.com/index/methodology/latest/Islamic",
    zertifikatHinweis:
      "Methodik der MSCI Islamic Index Series. Darin bestätigt MSCI, dass die Methodik vom Shariah-Ausschuss aus islamischen Gelehrten als konform freigegeben wurde und dass die Prüfer regelmäßig eine Zertifizierung für den jeweiligen Prüfzeitraum ausstellen. Es ist ein Methodik-Dokument, kein produktbezogenes Einzelzertifikat.",
    anbieter: "HSBC",
    kategorie: "aktien",
    kosten: 0.35,
    kostenLabel: "0,35 %",
    groesse: "150 Mio. €",
    groesseSortierwert: 150,
    ertrag: "thesaurierend",
    ertragDetail: "thesaurierend",
    bauart: "passiv",
    replikation: "physisch, vollständig",
    domizil: "Irland",
    auflage: "12.01.2023",
    zertifizierer: "MSCI Shariah Advisory Board, Fatwa seit 2007",
  },
  {
    slug: "hanetf-saturna-al-kawthar-global-focused-equity",
    name: "HANetf Saturna Al-Kawthar Global Focused Equity",
    isin: "IE00BMYMHS24",
    anbieter: "HANetf",
    kategorie: "aktien",
    kosten: 0.75,
    kostenLabel: "0,75 %",
    groesse: "19 Mio. €",
    groesseSortierwert: 19,
    ertrag: "thesaurierend",
    ertragDetail: "thesaurierend",
    bauart: "aktiv",
    replikation: "physisch, Sampling",
    domizil: "Irland",
    auflage: "28.09.2020",
    zertifizierer: "Amanie Advisors, SSB mit jährlichem Audit",
    zertifikatArt: "produkt",
    zertifikatLink:
      "https://hanetf.com/wp-content/assets/Saturna%20Al%20Kawthar%20-%20Shariah%20Compliance%20Cert%20FYE%20-%202025%20(Final%20&%20Executed).pdf",
    zertifikatHinweis:
      "Unterschriebenes Shariah-Zertifikat des Shariah Supervisory Board von Amanie Advisors für das Geschäftsjahr 2025, ausgestellt am 22.05.2026 von Dr. Osama Al Dereai. Amanie prüft den Fonds jedes Jahr und bescheinigt für 2025 ausdrücklich die Einhaltung der Shariah-Vorgaben.",
  },
  {
    slug: "ishares-usd-sukuk-ucits-etf",
    name: "iShares USD Sukuk UCITS ETF",
    isin: "IE000929U2U9",
    anbieter: "iShares",
    kategorie: "sukuk",
    kosten: 0.4,
    kostenLabel: "0,40 %",
    groesse: "160 Mio. €",
    groesseSortierwert: 160,
    ertrag: "ausschuettend",
    ertragDetail: "ausschüttend, quartalsweise",
    bauart: "passiv",
    replikation: "physisch, Sampling",
    domizil: "Irland",
    auflage: "17.01.2024",
    zertifizierer: "Sukuk Fund Panel bei iShares, besetzt mit dem Shariah-Board von Amanie Advisors",
    zertifikatArt: "produkt",
    zertifikatLink:
      "https://www.blackrock.com/ch/individual/en/literature/prospectus/ishares-ii-plc-prospectus-en.pdf",
    zertifikatHinweis:
      "Der Verkaufsprospekt von iShares II plc führt für diesen Fonds ein eigenes Sukuk Fund Panel. Es ist mit dem Shariah Supervisory Board von Amanie Advisors besetzt: Dr. Mohamed Ali Elgari als Vorsitzender, Dr. Mohd Daud Bakar, Dr. Muhammad Amin Ali Qattan und Dr. Osama Al Dereai. Das Panel hat eine Fatwa für den Fonds erteilt und stellt jedes Jahr ein Shariah-Zertifikat aus.",
  },
  {
    slug: "xtrackers-ii-salam-usd-global-aggregate-sukuk",
    name: "Xtrackers II Salam USD Global Aggregate Sukuk",
    isin: "LU3123443510",
    anbieter: "Xtrackers",
    kategorie: "sukuk",
    kosten: 0.4,
    kostenLabel: "0,40 %",
    groesse: "37 Mio. €",
    groesseSortierwert: 37,
    ertrag: "ausschuettend",
    ertragDetail: "ausschüttend",
    bauart: "passiv",
    replikation: "physisch, vollständig",
    domizil: "Luxemburg",
    auflage: "07.10.2025",
    zertifizierer:
      "ASB Capital, Shari'a-Berater",
    zertifikatArt: "produkt",
    zertifikatLink:
      "https://etf.dws.com/download/asset/338a9b54-af7b-4d09-ad33-9bcaacb30ac5",
    zertifikatHinweis:
      "Xtrackers-II-Verkaufsprospekt, Anhang zum Salam-Sukuk-ETF (Klasse 1D, ISIN LU3123443510): „The Management Company has appointed ASB Capital Limited (the „Shari’a Consultant“) to provide Shari’a consultation services“. Ein veröffentlichtes Zertifikat oder eine Fatwa haben wir nicht gefunden.",
  },
  {
    slug: "bnp-paribas-islamic-fund-hilal-income-classic-c",
    name: "BNP Paribas Islamic Fund Hilal Income Classic C",
    isin: "LU1150255971",
    anbieter: "BNP Paribas",
    kategorie: "sukuk",
    kosten: 1.31,
    kostenLabel: "1,31 %",
    groesse: "ca. 10 Mio. USD, Stand 03/2024",
    groesseSortierwert: 10,
    ertrag: "thesaurierend",
    ertragDetail: "thesaurierend",
    bauart: "aktiv",
    replikation: "aktiver Fonds, kein ETF",
    domizil: "Luxemburg",
    auflage: "04.09.2015",
    zertifizierer: "eigenes Sharia-Komitee, vierteljährliche Prüfung",
    zertifikatArt: "produkt",
    zertifikatLink: "https://solutions.vwdservices.com/products/documents/D8C02C3D-0895-43B6-800D-BCCF5B0C0C25",
    zertifikatHinweis:
      "Der Verkaufsprospekt des BNP Paribas Islamic Fund nennt das Komitee namentlich: Scheich Nizam Yaquby, Dr. Abdulsattar Abu Ghuddah und Dr. Mohamed Daud Bakar. Es prüft den Fonds vierteljährlich und stellt danach jedes Mal ein Zertifikat aus, häufiger als bei jeder anderen Anlage dieser Liste. Der verlinkte Prospekt trägt den Stand Mai 2017, die Besetzung kann sich seitdem geändert haben.",
    groesseStand: "Factsheet vom 27.03.2024",
  },
  {
    slug: "royal-mint-responsibly-sourced-physical-gold",
    zertifikatArt: "produkt",
    zertifikatLink:
      "https://hanetf.com/wp-content/assets/The%20Royal%20Mint%20ETC%20-%20Shariah%20Compliance%20Cert%20-%202025.pdf",
    zertifikatHinweis:
      "Jährliches Shariah-Zertifikat des Shariah-Gremiums von Amanie Advisors, ausgestellt am 17. Juni 2026 für das Geschäftsjahr 2025, unterschrieben von Dr. Osama Al Dereai. Besonderheit dieses ETCs: Das Gold liegt im Tresor der Royal Mint in Cardiff und nicht bei einer Bank, und Privatanleger können sich Barren und Münzen ausliefern lassen.",
    zweiterBeleg: {
      titel: "Fatwa zum Produkt",
      url: "https://etp.hanetf.com/Fatwa___The_Royal_Mint_Gold_ETC.pdf",
    },
    name: "The Royal Mint Responsibly Sourced Physical Gold",
    isin: "XS2115336336",
    kuerzel: "RM8U",
    anbieter: "HANetf",
    kategorie: "gold",
    kosten: 0.25,
    kostenLabel: "0,25 %",
    groesse: "1.601 Mio. $",
    groesseSortierwert: 1601,
    groesseStand: "14.09.2026",
    ertrag: "thesaurierend",
    ertragDetail: "thesaurierend",
    bauart: "passiv",
    replikation: "physisch, zugeordnete Barren",
    domizil: "Irland",
    auflage: "14.02.2020",
    zertifizierer: "Amanie Advisors, jährliches Shariah-Zertifikat",
  },
  {
    slug: "invesco-physical-gold-etc",
    zertifikatArt: "produkt",
    zertifikatLink:
      "https://www.invesco.com/content/dam/invesco/emea/en/product-documents/etf/fund/ssb-certificate/invesco-physical-gold-and-silver-etc_ssb-certficate_en_2025.pdf",
    zertifikatHinweis:
      "Jährliches Shariah-Zertifikat des Amanie-Shariah-Boards für die Invesco Physical Gold and Silver ETCs, Geschäftsjahr 2025, ausgestellt am 1. Juni 2026. Es nennt dieses ETC ausdrücklich.",
    name: "Invesco Physical Gold ETC",
    isin: "IE00B579F325",
    anbieter: "Invesco",
    kategorie: "gold",
    kosten: 0.12,
    kostenLabel: "0,12 %",
    groesse: "25.496 Mio. €",
    groesseSortierwert: 25496,
    ertrag: "thesaurierend",
    ertragDetail: "thesaurierend",
    bauart: "passiv",
    replikation: "physisch besichert",
    domizil: "Irland",
    auflage: "25.06.2009",
    zertifizierer: "Amanie Advisors, jährliches Shariah-Zertifikat",
  },
  {
    slug: "wisdomtree-physical-gold",
    zertifikatArt: "produkt",
    zertifikatLink:
      "https://www.wisdomtree.eu/-/media/eu-media-files/other-documents/regulatory/sharia-compliant-certificate.pdf",
    zertifikatHinweis:
      "Unabhängiger Shariah-Prüfbericht des Al-Qalam-Panels an den Vorstand von WisdomTree Metal Securities, datiert 22. Juni 2026, Prüfzeitraum bis 31. Dezember 2025.",
    name: "WisdomTree Physical Gold",
    isin: "JE00B1VS3770",
    anbieter: "WisdomTree",
    kategorie: "gold",
    kosten: 0.39,
    kostenLabel: "0,39 %",
    groesse: "6.434 Mio. €",
    groesseSortierwert: 6434,
    ertrag: "thesaurierend",
    ertragDetail: "thesaurierend",
    bauart: "passiv",
    replikation: "physisch besichert",
    domizil: "Jersey",
    auflage: "24.04.2007",
    zertifizierer: "Al-Qalam Shariah Panel, jährlich, AAOIFI Standard No. 1",
  },
  {
    slug: "wisdomtree-core-physical-gold",
    zertifikatArt: "produkt",
    zertifikatLink:
      "https://www.wisdomtree.eu/-/media/eu-media-files/other-documents/regulatory/sharia-compliant-certificate.pdf",
    zertifikatHinweis:
      "Unabhängiger Shariah-Prüfbericht des Al-Qalam-Panels an den Vorstand von WisdomTree Metal Securities, datiert 22. Juni 2026, Prüfzeitraum bis 31. Dezember 2025.",
    name: "WisdomTree Core Physical Gold",
    isin: "JE00BN2CJ301",
    anbieter: "WisdomTree",
    kategorie: "gold",
    kosten: 0.12,
    kostenLabel: "0,12 %",
    groesse: "1.832 Mio. €",
    groesseSortierwert: 1832,
    ertrag: "thesaurierend",
    ertragDetail: "thesaurierend",
    bauart: "passiv",
    replikation: "physisch besichert",
    domizil: "Jersey",
    auflage: "30.11.2020",
    zertifizierer: "Al-Qalam Shariah Panel, jährlich, AAOIFI Standard No. 1",
  },
  {
    slug: "wisdomtree-physical-swiss-gold",
    zertifikatArt: "produkt",
    zertifikatLink:
      "https://www.wisdomtree.eu/-/media/eu-media-files/other-documents/regulatory/sharia-compliant-certificate.pdf",
    zertifikatHinweis:
      "Unabhängiger Shariah-Prüfbericht des Al-Qalam-Panels an den Vorstand von WisdomTree Metal Securities, datiert 22. Juni 2026, Prüfzeitraum bis 31. Dezember 2025.",
    name: "WisdomTree Physical Swiss Gold",
    isin: "JE00B588CD74",
    anbieter: "WisdomTree",
    kategorie: "gold",
    kosten: 0.15,
    kostenLabel: "0,15 %",
    groesse: "4.713 Mio. €",
    groesseSortierwert: 4713,
    ertrag: "thesaurierend",
    ertragDetail: "thesaurierend",
    bauart: "passiv",
    replikation: "physisch besichert",
    domizil: "Jersey",
    auflage: "16.12.2009",
    zertifizierer: "Al-Qalam Shariah Panel, jährlich, AAOIFI Standard No. 1",
  },
  {
    slug: "invesco-physical-silver",
    zertifikatArt: "produkt",
    zertifikatLink:
      "https://www.invesco.com/content/dam/invesco/emea/en/product-documents/etf/fund/ssb-certificate/invesco-physical-gold-and-silver-etc_ssb-certficate_en_2025.pdf",
    zertifikatHinweis:
      "Jährliches Shariah-Zertifikat des Amanie-Shariah-Boards für die Invesco Physical Gold and Silver ETCs, Geschäftsjahr 2025, ausgestellt am 1. Juni 2026. Es nennt dieses ETC ausdrücklich.",
    name: "Invesco Physical Silver",
    isin: "IE00B43VDT70",
    anbieter: "Invesco",
    kategorie: "silber",
    kosten: 0.19,
    kostenLabel: "0,19 %",
    groesse: "906 Mio. €",
    groesseSortierwert: 906,
    ertrag: "thesaurierend",
    ertragDetail: "thesaurierend",
    bauart: "passiv",
    replikation: "physisch besichert",
    domizil: "Irland",
    auflage: "13.04.2011",
    zertifizierer: "Amanie Advisors, jährliches Shariah-Zertifikat",
  },
  {
    slug: "wisdomtree-physical-silver",
    zertifikatArt: "produkt",
    zertifikatLink:
      "https://www.wisdomtree.eu/-/media/eu-media-files/other-documents/regulatory/sharia-compliant-certificate.pdf",
    zertifikatHinweis:
      "Unabhängiger Shariah-Prüfbericht des Al-Qalam-Panels an den Vorstand von WisdomTree Metal Securities, datiert 22. Juni 2026, Prüfzeitraum bis 31. Dezember 2025.",
    name: "WisdomTree Physical Silver",
    isin: "JE00B1VS3333",
    anbieter: "WisdomTree",
    kategorie: "silber",
    kosten: 0.49,
    kostenLabel: "0,49 %",
    groesse: "2.578 Mio. €",
    groesseSortierwert: 2578,
    ertrag: "thesaurierend",
    ertragDetail: "thesaurierend",
    bauart: "passiv",
    replikation: "physisch besichert",
    domizil: "Jersey",
    auflage: "24.04.2007",
    zertifizierer: "Al-Qalam Shariah Panel, jährlich, AAOIFI Standard No. 1",
  },
  {
    slug: "wisdomtree-core-physical-silver",
    zertifikatArt: "produkt",
    zertifikatLink:
      "https://www.wisdomtree.eu/-/media/eu-media-files/other-documents/regulatory/sharia-compliant-certificate.pdf",
    zertifikatHinweis:
      "Unabhängiger Shariah-Prüfbericht des Al-Qalam-Panels an den Vorstand von WisdomTree Metal Securities, datiert 22. Juni 2026, Prüfzeitraum bis 31. Dezember 2025.",
    name: "WisdomTree Core Physical Silver",
    isin: "JE00BQRFDY49",
    anbieter: "WisdomTree",
    kategorie: "silber",
    kosten: 0.19,
    kostenLabel: "0,19 %",
    groesse: "873 Mio. €",
    groesseSortierwert: 873,
    ertrag: "thesaurierend",
    ertragDetail: "thesaurierend",
    bauart: "passiv",
    replikation: "physisch besichert",
    domizil: "Jersey",
    auflage: "13.08.2024",
    zertifizierer: "Al-Qalam Shariah Panel, jährlich, AAOIFI Standard No. 1",
  },
  {
    slug: "wisdomtree-physical-platinum",
    zertifikatArt: "produkt",
    zertifikatLink:
      "https://www.wisdomtree.com/eu/-/media/eu-media-files/other-documents/regulatory/sharia-compliant-certificate.pdf",
    zertifikatHinweis:
      "Unabhängiger Shariah-Prüfbericht des Al-Qalam-Panels an den Vorstand von WisdomTree Metal Securities, datiert 22. Juni 2026, Prüfzeitraum bis 31. Dezember 2025. Er nennt WisdomTree Physical Platinum ausdrücklich. Für Platin gilt die Sonderregel für Gold und Silber nicht, es wird wie eine gewöhnliche Ware behandelt.",
    name: "WisdomTree Physical Platinum",
    isin: "JE00B1VS2W53",
    anbieter: "WisdomTree",
    kategorie: "rohstoffe",
    kosten: 0.49,
    kostenLabel: "0,49 %",
    groesse: "452 Mio. €",
    groesseSortierwert: 452,
    ertrag: "thesaurierend",
    ertragDetail: "thesaurierend",
    bauart: "passiv",
    replikation: "physisch besichert",
    domizil: "Jersey",
    auflage: "24.04.2007",
    zertifizierer: "Al-Qalam Shariah Panel, jährlich",
  },
  {
    slug: "wisdomtree-physical-palladium",
    zertifikatArt: "produkt",
    zertifikatLink:
      "https://www.wisdomtree.com/eu/-/media/eu-media-files/other-documents/regulatory/sharia-compliant-certificate.pdf",
    zertifikatHinweis:
      "Unabhängiger Shariah-Prüfbericht des Al-Qalam-Panels an den Vorstand von WisdomTree Metal Securities, datiert 22. Juni 2026, Prüfzeitraum bis 31. Dezember 2025. Er nennt WisdomTree Physical Palladium ausdrücklich. Auch für Palladium gilt die Sonderregel für Gold und Silber nicht.",
    name: "WisdomTree Physical Palladium",
    isin: "JE00B1VS3002",
    anbieter: "WisdomTree",
    kategorie: "rohstoffe",
    kosten: 0.49,
    kostenLabel: "0,49 %",
    groesse: "149 Mio. €",
    groesseSortierwert: 149,
    ertrag: "thesaurierend",
    ertragDetail: "thesaurierend",
    bauart: "passiv",
    replikation: "physisch besichert",
    domizil: "Jersey",
    auflage: "24.04.2007",
    zertifizierer: "Al-Qalam Shariah Panel, jährlich",
  },
  {
    slug: "wisdomtree-physical-precious-metals",
    zertifikatArt: "produkt",
    zertifikatLink:
      "https://www.wisdomtree.com/eu/-/media/eu-media-files/other-documents/regulatory/sharia-compliant-certificate.pdf",
    zertifikatHinweis:
      "Unabhängiger Shariah-Prüfbericht des Al-Qalam-Panels an den Vorstand von WisdomTree Metal Securities, datiert 22. Juni 2026, Prüfzeitraum bis 31. Dezember 2025. Er nennt den Korb als WisdomTree Physical Precious Metals Basket ausdrücklich. Im Korb stecken Gold, Silber, Platin und Palladium, für die beiden ersten gilt die Sonderregel der sofortigen Übergabe.",
    name: "WisdomTree Physical Precious Metals",
    isin: "JE00B1VS3W29",
    anbieter: "WisdomTree",
    kategorie: "rohstoffe",
    kosten: 0.44,
    kostenLabel: "0,44 %",
    groesse: "387 Mio. €",
    groesseSortierwert: 387,
    ertrag: "thesaurierend",
    ertragDetail: "thesaurierend",
    bauart: "passiv",
    replikation: "physisch besichert",
    domizil: "Jersey",
    auflage: "24.04.2007",
    zertifizierer: "Al-Qalam Shariah Panel, jährlich",
  },
  {
    slug: "comgest-growth-europe-s-eur-acc",
    zertifikatArt:
      "produkt",
    zertifikatLink:
      "https://www.comgest.com/-/media/feature/data/fund-documentation/2026/05/05/13/02/fd88b7eb-ea4e-41b8-b02f-31393bf06ccf.pdf",
    zertifikatHinweis:
      "Verkaufsprospekt von Comgest Growth plc vom 21. Mai 2025: „Currently there is only one Shariah Fund, Comgest Growth Europe S.“ Das Shariah Supervisory Board stellt Amanie Advisors. Die ISIN IE00B4ZJ4634 steht dort als EUR-Acc-Klasse dieses Fonds. Ein eigenes jährliches Zertifikat veröffentlicht Comgest nicht.",
    name: "Comgest Growth Europe S EUR Acc",
    isin: "IE00B4ZJ4634",
    anbieter: "Comgest",
    kategorie: "aktien",
    kosten: 2.16,
    kostenLabel: "2,16 %",
    groesse: "52 Mio. €",
    groesseSortierwert: 52,
    ertrag: "thesaurierend",
    ertragDetail: "thesaurierend",
    bauart: "aktiv",
    replikation: "aktiver Fonds, kein ETF",
    domizil: "Irland",
    auflage: "Auflage noch nicht geprüft",
    zertifizierer:
      "Amanie Advisors, Shariah Supervisory Board",
  },
  {
    slug: "franklin-shariah-technology-fund-a-acc-usd",
    name: "Franklin Shariah Technology Fund A (acc) USD",
    isin: "LU2458330086",
    anbieter: "Franklin Templeton",
    kategorie: "aktien",
    kosten: 1.81,
    kostenLabel: "1,81 %",
    groesse: "145,87 Mio. USD, Stand 31.07.2026",
    groesseSortierwert: 146,
    ertrag: "thesaurierend",
    ertragDetail: "thesaurierend",
    bauart: "aktiv",
    replikation: "aktiver Fonds, kein ETF",
    domizil: "Luxemburg",
    auflage: "24.02.2022",
    zertifizierer:
      "Amanie Advisors, Shariah Supervisory Board",
    zertifikatArt: "produkt",
    zertifikatLink:
      "https://www.franklintempleton.ch/download/en-ch/ANNUAL-REPORT/b5b23ffc-daa4-49c1-9b03-8a28a3c4c53e/FTSF-annual-report-en-ch.pdf",
    zertifikatHinweis:
      "Jahresbericht der Franklin Templeton Shariah Funds mit dem „Annual Shariah Compliance Report“ von Amanie für 1. November 2024 bis 31. Oktober 2025: Die Anlagen des Franklin Shariah Technology Fund „are in compliance with the Islamic investment guidelines as interpreted and issued by Amanie Shariah Supervisory Board Members.“",
    ausgabeaufschlag: "5,54 %, Stand 31.07.2026",
    ausgabeaufschlagHinweis:
      "fällt nur an, wenn du direkt bei der Fondsgesellschaft zeichnest, dort gilt auch die Mindestanlage von 1.000 USD. Kaufst du über die Börse, etwa bei Scalable Capital, entfällt er",
  },

  /* Krypto steht in derselben Liste wie alles andere, nicht in einem eigenen
     Kasten. Eine Münze hat keine ISIN, keine Fondsgröße und keine Bauart,
     deshalb zeigt die Krypto-Gruppe diese Spalten gar nicht. Der Satz zur
     Schwankung steht einmal im Abschnitt "Krypto in dieser Liste". */
  {
    slug: "bitcoin",
    name: "Bitcoin",
    kuerzel: "BTC",
    zeichen: "₿",
    kursKey: "Bitcoin",
    anbieter: "Bitcoin",
    kategorie: "krypto",
    kosten: 0,
    kostenLabel: "keine",
    zertifizierer: "Shariyah Review Bureau, Bahrain",
    zertifikatArt: "produkt",
    zertifikatLink: "https://shariyah.net/cryptocurrencies/bitcoin/",
    zertifikatHinweis:
      "Sharia-Analyse des Shariyah Review Bureau, lizenziert von der Central Bank of Bahrain. Wörtlich heißt es dort, den Prüfern sei nichts aufgefallen, was Bitcoin im Widerspruch zu den Sharia-Grundsätzen erscheinen ließe. Das ist eine Unbedenklichkeitserklärung zur Münze selbst, kein Zertifikat für ein Produkt und kein Freibrief für jeden Handel damit.",
  },
  {
    slug: "ether",
    name: "Ether",
    kuerzel: "ETH",
    zeichen: "Ξ",
    kursKey: "Ether",
    anbieter: "Ethereum",
    kategorie: "krypto",
    kosten: 0,
    kostenLabel: "keine",
    zertifizierer: "Shariyah Review Bureau, Bahrain",
    zertifikatArt: "produkt",
    zertifikatLink: "https://shariyah.net/cryptocurrencies/ethereum/",
    zertifikatHinweis:
      "Sharia-Analyse des Shariyah Review Bureau, lizenziert von der Central Bank of Bahrain. Ether ist damit die einzige Münze dieser Liste, die zweimal unabhängig geprüft wurde: Amanie Advisors und die Ethereum Foundation haben 2019 zusätzlich ein eigenes Shariah White Paper vorgelegt, verantwortlich Dr. Mohd Daud Bakar. Beide Gutachten behandeln die Münze selbst, nicht das, was Nutzer damit tun.",
  },
  {
    slug: "xrp",
    name: "XRP",
    kuerzel: "XRP",
    zeichen: "✕",
    kursKey: "XRP",
    anbieter: "XRP",
    kategorie: "krypto",
    kosten: 0,
    kostenLabel: "keine",
    zertifizierer: "Shariyah Review Bureau, Bahrain",
    zertifikatArt: "produkt",
    zertifikatLink:
      "https://shariyah.net/cryptocurrencies/ripple/",
    zertifikatHinweis:
      "Sharia-Analyse des Shariyah Review Bureau (Bahrain) zu Ripple, Neubewertung August 2021 ohne Änderung: „nothing has come to our attention that causes us to believe that XRP token is in breach of Sharia principles“. Das Büro nennt es ausdrücklich eine vorläufige Recherche, keine Fatwa.",
  },
  {
    slug: "chainlink",
    name: "Chainlink",
    kuerzel: "LINK",
    zeichen: "⬡",
    kursKey: "Chainlink",
    anbieter: "Chainlink",
    kategorie: "krypto",
    kosten: 0,
    kostenLabel: "keine",
    zertifizierer: "Shariyah Review Bureau, Bahrain",
    zertifikatArt: "produkt",
    zertifikatLink: "https://shariyah.net/cryptocurrencies/chainlink/",
    zertifikatHinweis:
      "Sharia-Analyse des Shariyah Review Bureau. Der LINK-Token könne als konform gelten, er zahlt für einen echten Dienst: Chainlink liefert Blockchains Daten von außen, etwa Kurse. Die Prüfer knüpfen das an eine Bedingung, nämlich dass der Inhaber selbst darauf achtet, wofür er den Token einsetzt und wie er bei Abstimmungen entscheidet.",
    hinweis: "Urteil gilt unter der Bedingung, dass du den Token selbst zulässig einsetzt",
  },
];

export const anlageBySlug = (slug: string) => halalAnlagen.find((a) => a.slug === slug);

/** Eindeutiger Schlüssel je Anlage. Krypto hat keine ISIN, deshalb der Slug. */
export const anlageSchluessel = (a: Anlage) => a.isin ?? a.slug;
