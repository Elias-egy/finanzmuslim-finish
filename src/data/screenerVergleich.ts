// Von Hand gepflegt. Anders als Depot, Girokonto und Krypto steht hinter diesem
// Vergleich keine Finanzfluss-Tabelle: Screening-Apps kommen dort nicht vor.
// Jeder Wert hat eine Quelle mit Prüfdatum. Was null ist, ist noch nicht geprüft.
import type { VergleichsZeile } from "@/components/vergleich/vergleichTypen";
import type { RohAnbieter } from "./vergleichHelfer";

/**
 * Screening-Apps im Vergleich.
 *
 * Warum diese Merkmale: Eine Screening-App beantwortet eine einzige Frage, und
 * zwar dieselbe, die wir in der Anlagen-Datenbank beantworten. Der Unterschied
 * zwischen zwei Apps liegt deshalb nicht in der Oberfläche, sondern darin,
 * nach welchem Maßstab sie urteilt, wer diesen Maßstab verantwortet und ob du
 * das Urteil nachrechnen kannst. Alles andere ist Ausstattung.
 *
 * Für Leser in Deutschland kommt eine zweite Frage dazu, die in keiner
 * internationalen Übersicht steht: Findet die App überhaupt die Aktien, die an
 * deutschen Börsen gehandelt werden? Deshalb steht sie hier als eigene Zeile.
 */
export const SCREENER_ZEILEN: VergleichsZeile[] = [
  { key: "__angebot", label: "Angebot", art: "text", gruppe: "angebot" },
  {
    key: "standard",
    label: "Maßstab",
    art: "text",
    gruppe: "halal",
    imRaster: true,
    hinweis:
      "Nach welchem Regelwerk geprüft wird. AAOIFI ist der strengste verbreitete Maßstab, Dow Jones, MSCI, S&P und FTSE lassen bei den Finanzkennzahlen mehr zu. Dieselbe Aktie kann deshalb bei zwei Apps unterschiedlich ausfallen.",
  },
  {
    key: "gremium",
    label: "Prüfgremium namentlich",
    art: "ampel",
    gruppe: "halal",
    imRaster: true,
    hinweis:
      "Grün: Die Gelehrten, die hinter dem Urteil stehen, sind mit Namen genannt. Rot: Es steht nur, dass es Berater gibt. Ein Urteil ohne Absender lässt sich nicht nachprüfen.",
  },
  {
    key: "begruendung",
    label: "Zahlen hinter dem Urteil",
    art: "ampel",
    gruppe: "halal",
    hinweis:
      "Zeigt die App die Kennzahlen, aus denen das Urteil folgt, oder nur ein Ergebnis? Ohne Zahlen musst du glauben statt prüfen.",
  },
  {
    key: "reinigung",
    label: "Reinigungsbetrag",
    art: "ampel",
    gruppe: "halal",
    hinweis:
      "Rechnet die App aus, welchen Anteil deiner Erträge du spenden musst, weil er aus unerlaubten Quellen stammt?",
  },
  {
    key: "deutscheAktien",
    label: "Deutsche Aktien",
    art: "text",
    gruppe: "angebot",
    imRaster: true,
    hinweis:
      "Findet die App Aktien, die in Deutschland gehandelt werden? Die meisten Apps kommen aus den USA oder Indien und sind dort am stärksten.",
  },
  { key: "umfang", label: "Umfang", art: "text", gruppe: "angebot" },
  { key: "etfs", label: "ETFs und Fonds", art: "janein", gruppe: "angebot" },
  {
    key: "kostenlos",
    label: "Was die kostenlose Fassung kann",
    art: "text",
    gruppe: "kosten",
    imRaster: true,
  },
  { key: "preis", label: "Preis", art: "text", gruppe: "kosten" },
  { key: "depot", label: "Depot verbinden", art: "janein", gruppe: "kosten" },
  { key: "zakat", label: "Zakat-Rechner", art: "janein", gruppe: "kosten" },
  { key: "sprache", label: "Sprache", art: "text", gruppe: "kosten" },
];

const stand = "16.09.2026";

export const screenerVergleich: RohAnbieter[] = [
  {
    id: "finispia",
    name: "Finispia",
    produkt: "Screener",
    domain: "finispia.com",
    werte: {
      standard: "fünf zur Wahl: AAOIFI, Dow Jones, FTSE, MSCI, S&P",
      gremium: "schlecht",
      begruendung: "gut",
      reinigung: "schlecht",
      deutscheAktien: "ja, über 90 Börsen",
      umfang: "Aktien, ETFs, REITs, Fonds, Sukuk, Indizes und Börsengänge",
      etfs: true,
      kostenlos: "Halal-Wert je Aktie auf der Website, volle Berichte in der App für drei Aktien",
      preis: "kostenlos, Geld verdient das Haus mit Lizenzen an Firmen",
      depot: true,
      zakat: false,
      sprache: "Englisch",
    },
    quellen: {
      reinigung: {
        url: "https://app.finispia.com/help",
        stand: "26.09.2026",
        hinweis:
          "„Purification rate is the ratio of revenues derived from non-compliant activities divided by the total revenue. There is a tremendous work to be done to get this feature. Finispia is eagerly working to include it in future version of the solution.“ Die App rechnet den Reinigungsbetrag also noch nicht aus.",
      },
      depot: {
        url: "https://finispia.com/halal-stock-screener/",
        stand: "26.09.2026",
        hinweis:
          "„Start Trading Start trading halal right away. Connect with a third-party broker, and you can start trading with peace of mind.“",
      },
      standard: {
        url: "https://finispia.com/",
        stand,
        hinweis:
          "Finispia stellt fünf Methoden zur Wahl: Dow Jones, FTSE, S&P, MSCI und AAOIFI. Das ist der größte Unterschied zu allen anderen: Du siehst, wie sich das Urteil mit dem Maßstab ändert.",
      },
      gremium: { url: "https://finispia.com/", stand: "27.09.2026", hinweis: "„Screening methodologies inspired from Five Islamic investment methodologies: DJ, FTSE, S&P, MSCI and AAOIFI.“ Auf keiner Seite und nicht im App-Text stehen Gelehrte mit Namen (geprüft 27.09.2026)." },
      begruendung: { url: "https://finispia.com/halal-stock-screener/", stand: "27.09.2026", hinweis: "„Results based on five Islamic investment methodologies: DJ, FTSE, S&P, MSCI and AAOIFI.“ Ersetzt am 27.09.2026 eine Umschreibung ohne Zitat." },
      deutscheAktien: {
        url: "https://finispia.com/",
        stand,
        hinweis: "Laut Anbieter werden Aktien an über 90 Börsen geprüft, deutsche eingeschlossen.",
      },
      umfang: { url: "https://finispia.com/", stand, hinweis: "Geprüft werden Aktien, ETFs, REITs, Fonds, Sukuk, Indizes und Börsengänge." },
      etfs: { url: "https://finispia.com/", stand: "27.09.2026", hinweis: "„You can also screen Market, ETF, REITS, Fund, Sukuk, Index, IPO and Private Equity.“ Ersetzt am 27.09.2026 eine Umschreibung ohne Zitat." },
      kostenlos: { url: "https://finispia.com/", stand: "27.09.2026", hinweis: "„Screen stock in over 90 stock exchanges for Free.“ Die Website zeigt je Aktie den Wert von fünf Methoden; volle Berichte in der App gratis für drei Aktien, laut App Store: „our free plan includes the search of 3 stocks from all over the world.“" },
      preis: {
        url: "https://finispia.com/",
        stand,
        hinweis:
          "Für Leser kostenlos. Das Haus verkauft daneben Lizenzen an Firmen (White Label, API, Widget).",
      },
      zakat: { url: "https://finispia.com/", stand: "27.09.2026", hinweis: "Den Zakat-Rechner gibt es nur als Baustein für fremde Websites: „Integrate our advanced Zakat calculator tool on your website to help your customers and improve traffic on your website.“ Im Text der App kommt „Zakat“ nicht vor. Am 27.09.2026 korrigiert, vorher ja." },
      sprache: { url: "https://finispia.com/", stand, hinweis: "Die Seite und das Screening gibt es nur auf Englisch." },
    },
  },
  {
    id: "islamicly",
    name: "Islamicly",
    produkt: "App",
    domain: "islamicly.com",
    werte: {
      standard: "AAOIFI",
      gremium: "gut",
      begruendung: "gut",
      reinigung: "gut",
      deutscheAktien: "ja, Deutschland ist unter den gelisteten Ländern",
      umfang: "17.000 bis 25.000 Aktien, je nach Bereich",
      etfs: true,
      kostenlos: "eine kostenlose Report Card fürs Depot, danach Abo",
      preis: "999 Rupien im Monat, 9.999 im Jahr (rund 100 Euro)",
      depot: true,
      zakat: true,
      sprache: "Englisch",
    },
    quellen: {
      standard: {
        url: "https://islamicly.com/",
        stand,
        hinweis:
          "„Our screening process follows globally recognized Islamic finance standards set by AAOIFI“, dazu die Schwelle: Erlöse aus nicht zulässigen Tätigkeiten unter 5 Prozent.",
      },
      gremium: { url: "https://www.islamicly.com/home/stocks", stand: "27.09.2026", hinweis: "Namentlich genannt: „Dr. Mohamed A. Elgari“ (Vorsitz), „Dr. Nazih Hammad“, „Dr. Muhammad Amin Qattan“. Ersetzt am 27.09.2026 eine Umschreibung ohne Zitat." },
      begruendung: { url: "https://www.islamicly.com/home/stocks", stand: "27.09.2026", hinweis: "„Access scholar approved reports explaining why a stock is Shariah Compliant or Not.“ Ersetzt am 27.09.2026 eine Umschreibung ohne Zitat." },
      reinigung: { url: "https://islamicly.com/", stand, hinweis: "„Get dividend purification insights“, der zu spendende Anteil wird ausgewiesen." },
      deutscheAktien: { url: "https://islamicly.com/", stand, hinweis: "Deutschland steht in der Länderliste des Anbieters." },
      umfang: { url: "https://islamicly.com/", stand, hinweis: "Der Anbieter nennt 17.000+ und an anderer Stelle 25.000+ Aktien." },
      etfs: {
        url: "https://www.islamicly.com/home/strategy",
        stand: "26.09.2026",
        hinweis:
          "„Islamicly Moons“ prüft die Aktien innerhalb eines bestehenden Fonds oder ETFs auf Scharia-Konformität und baut daraus ein nachbildendes Portfolio: „An Islamicly Moon, screens Shariah compliant stocks within an existing Fund or ETF, re-weights the fund or ETF portfolio proportionately and gives a ready to invest basket of stocks.“ Eine Prüfung des ETFs selbst als Ganzes wie bei anderen Anbietern bietet die Seite nicht, geprüft werden die enthaltenen Aktien.",
      },
      zakat: {
        url: "https://islamicly.com/",
        stand: "26.09.2026",
        hinweis:
          "„Our app also provides valuable insights, alerts on compliance changes, zakat calculator, and everything you need to invest in a halal way — all in one place.“",
      },
      kostenlos: { url: "https://www.islamicly.com/", stand: "27.09.2026", hinweis: "„Get your FREE Shariah Compliance Report Card in 60 Seconds!“ Die Report Card gilt dem Depot, weitere Prüfungen laufen über die Abo-Stufen. Ersetzt am 27.09.2026 eine Umschreibung ohne Zitat." },
      preis: {
        url: "https://islamicly.com/",
        stand,
        hinweis:
          "Der Anbieter rechnet in indischen Rupien ab: 999 im Monat, 2.499 für drei Monate, 9.999 im Jahr. Die App ist auf den indischen Markt zugeschnitten, das erklärt auch die Anlageprodukte daneben.",
      },
      depot: { url: "https://www.islamicly.com/", stand: "27.09.2026", hinweis: "„Simply connect your current broker. Islamicly will auto import your holdings so you can get started right away“. Ersetzt am 27.09.2026 eine Umschreibung ohne Zitat." },
      sprache: {
        url: "https://apps.apple.com/de/app/islamicly-halal-stocks-gold/id1484332448",
        stand,
        hinweis: "Der App-Store-Eintrag nennt als einzige Sprache Englisch.",
      },
    },
  },
  {
    id: "musaffa",
    name: "Musaffa",
    produkt: "Premium",
    domain: "musaffa.com",
    werte: {
      standard: "AAOIFI",
      gremium: "gut",
      begruendung: "gut",
      reinigung: "gut",
      deutscheAktien: "ja, 997 deutsche Aktien geprüft, davon 231 halal",
      umfang: "120.000 Aktien und ETFs in 60 Märkten",
      etfs: true,
      kostenlos: "unbegrenzt Halal-Status für Aktien und ETFs, Berichte und Depot-Verknüpfung nur im Abo",
      preis: "80 US-Dollar im Jahr im Angebot, regulär 200",
      depot: true,
      zakat: true,
      sprache: "Englisch",
    },
    quellen: {
      standard: { url: "https://musaffa.com/", stand, hinweis: "Musaffa prüft nach AAOIFI-Standards, mit Geschäftstätigkeit und Finanzkennzahlen." },
      gremium: { url: "https://musaffa.com/shariah-compliance", stand: "27.09.2026", hinweis: "Liste „Shariah Advisors“: „Shaikh Dr. Aznan Hasan“, „Shariah Board member of Accounting and Auditing Organization for Islamic Financial Institutions“, und „Mufti Faraz Adam“. Ersetzt am 27.09.2026 eine Umschreibung ohne Zitat." },
      begruendung: { url: "https://musaffa.com/pricing", stand: "27.09.2026", hinweis: "„Read detailed reports that explain why a stock or ETF is classified as Halal, Doubtful, or Not Halal.“ Die Berichte gibt es laut Preistabelle nur im Abo. Ersetzt am 27.09.2026 eine Umschreibung ohne Zitat." },
      reinigung: { url: "https://musaffa.com/pricing", stand: "27.09.2026", hinweis: "Preistabelle, Zeile „Manual Purification Calculator“, auch in der Gratis-Fassung. Ersetzt am 27.09.2026 eine Umschreibung ohne Zitat." },
      deutscheAktien: {
        url: "https://musaffa.com/pricing/",
        stand,
        hinweis:
          "Der Anbieter weist die Abdeckung je Land aus: Deutschland 997 Aktien, davon 231 halal, dazu 121 ETFs mit einem halal. 28,41 Prozent der deutschen Marktkapitalisierung gelten als halal.",
      },
      umfang: { url: "https://musaffa.com/pricing/", stand, hinweis: "120.000+ Aktien und ETFs aus 60 Märkten zur Recherche, 11.000+ US-Aktien und 1.000+ ETFs durchleuchtet." },
      etfs: { url: "https://musaffa.com/shariah-compliance", stand: "27.09.2026", hinweis: "Halal ETF screener: „1,000+ ETFs, screened against halal filters“. Ersetzt am 27.09.2026 eine Umschreibung ohne Zitat." },
      kostenlos: { url: "https://musaffa.com/pricing", stand: "27.09.2026", hinweis: "Gratis-Spalte: „UNLIMITED Stocks & ETFs Halal Status“. Berichte und Depot-Verknüpfung tragen dort ein X, und „All paid users can submit daily halal stock coverage requests for review by our Shariah experts.“ Am 27.09.2026 korrigiert: vorher stand hier, Berichte und zehn Anfragen am Tag seien gratis." },
      preis: { url: "https://musaffa.com/pricing/", stand, hinweis: "Ein Modell: 80 US-Dollar im Jahr als Sonderangebot, regulär 200 US-Dollar, umgerechnet 6,67 im Monat." },
      depot: { url: "https://musaffa.com/pricing", stand: "27.09.2026", hinweis: "„Link real brokerage accounts to track for full Shariah compliance and trade your holdings in one place“, laut Preistabelle nur im Abo. Ersetzt am 27.09.2026 eine Umschreibung ohne Zitat." },
      zakat: { url: "https://musaffa.com/pricing", stand: "27.09.2026", hinweis: "„Work out your zakat obligations accurately, with the option to import live portfolio data“ (Zeile „Manual Zakat Calculator“). Ersetzt am 27.09.2026 eine Umschreibung ohne Zitat." },
      sprache: {
        url: "https://apps.apple.com/de/app/musaffa-halal-investing-app/id1614624968",
        stand,
        hinweis: "Der App-Store-Eintrag nennt als einzige Sprache Englisch.",
      },
    },
  },
  {
    id: "zoya",
    name: "Zoya",
    produkt: "App",
    domain: "zoya.finance",
    werte: {
      standard: "AAOIFI",
      gremium: "gut",
      begruendung: "gut",
      reinigung: "teils",
      deutscheAktien: "ja, Deutschland ist einer von neun Märkten",
      umfang: "über 40.000 Aktien, ETFs und Fonds",
      etfs: true,
      kostenlos: "Halal-Status für Aktien, bei Fonds die zehn größten Positionen, volle Berichte nur in Pro",
      preis: "nur in der App sichtbar, nicht auf der Website",
      depot: true,
      zakat: true,
      sprache: "Englisch",
    },
    quellen: {
      standard: {
        url: "https://zoya.finance/",
        stand,
        hinweis:
          "„Zoya applies the AAOIFI screening methodology under the guidance of our shariah advisors.“",
      },
      reinigung: {
        url: "https://blog.zoya.finance/stock-purification-guide/",
        stand: "26.09.2026",
        hinweis:
          "Die App weist den Anteil nicht konformer Einnahmen aus, den Betrag zum Spenden rechnet man selbst: „Use Zoya to determine the total percentage of non-compliant income“. Einen fertigen Reinigungsbetrag nennt der Anbieter nicht, deshalb teils.",
      },
      gremium: {
        url: "https://zoya.finance/about",
        stand: "27.09.2026",
        hinweis:
          "Namentlich genannt unter „Our Shariah Advisors“: Sheikh Joe Bradford, „Certified Shariah Adviser and Auditor (CSAA), accredited by the Accounting and Auditing Organization for Islamic Financial Institutions (AAOIFI)“, und Sheikh Umer Khan mit „iftā' (License to Give Islāmic Legal Verdicts) from Darulifta Birmingham“. Am 27.09.2026 korrigiert: Vorher stand hier rot, weil die Namen nicht auf der Startseite stehen.",
      },
      begruendung: { url: "https://help.zoya.finance/en/articles/4189798-how-does-zoya-screen-stocks-for-shariah-compliance", stand: "27.09.2026", hinweis: "„You can see the exact ratios, thresholds, and underlying data for any stock by tapping the “See Full Report” button.“ Volle Berichte nur in Pro. Ersetzt am 27.09.2026 eine Umschreibung ohne Zitat." },
      deutscheAktien: {
        url: "https://zoya.finance/",
        stand,
        hinweis:
          "Abgedeckt sind USA, Großbritannien, Kanada, Australien, Deutschland, Indien, Japan, Polen, Taiwan und der Freiverkehr. Am vollständigsten sind die USA.",
      },
      umfang: { url: "https://zoya.finance/", stand, hinweis: "Über 40.000 Aktien, ETFs und Fonds, Daten täglich aktualisiert, Compliance-Berichte im Takt der Geschäftsberichte." },
      etfs: { url: "https://help.zoya.finance/en/articles/4189861-does-zoya-screen-etfs-and-mutual-funds", stand: "27.09.2026", hinweis: "„For both ETFs and mutual funds, we screen the underlying holdings that make up the fund.“ Ersetzt am 27.09.2026 eine Umschreibung ohne Zitat." },
      kostenlos: { url: "https://help.zoya.finance/en/articles/8455907-what-is-included-in-a-zoya-pro-subscription", stand: "27.09.2026", hinweis: "Vergleich Free gegen Pro: Shariah Compliance „Status only“ gegen „Full reports“, Fund Screener „Top 10 holdings only“ gegen „All holdings“." },
      preis: {
        url: "https://apps.apple.com/de/app/zoya-halal-investing-app/id1447547610",
        stand,
        hinweis:
          "Der App-Store-Eintrag weist die App als kostenlos mit In-App-Käufen aus. Einen Preis nennt der Anbieter weder auf der Website noch im Hilfebereich, er steht erst in der App.",
      },
      depot: { url: "https://zoya.finance/", stand: "27.09.2026", hinweis: "„Connect and sync your existing brokerage accounts to track your portfolio and monitor your holdings.“ Gratis ein Konto, in Pro beliebig viele. Ersetzt am 27.09.2026 eine Umschreibung ohne Zitat." },
      zakat: { url: "https://zoya.finance/", stand: "27.09.2026", hinweis: "„Calculate zakat due on your investments with precision and donate to your favorite charities.“ Ersetzt am 27.09.2026 eine Umschreibung ohne Zitat." },
      sprache: {
        url: "https://apps.apple.com/de/app/zoya-halal-investing-app/id1447547610",
        stand,
        hinweis: "Der App-Store-Eintrag nennt als einzige Sprache Englisch.",
      },
    },
  },
];

export const SCREENER_FILTER = [
  { key: "gremium", label: "Prüfgremium namentlich" },
  { key: "reinigung", label: "Reinigungsbetrag" },
];
