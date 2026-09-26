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
      kostenlos: "Screening ohne Konto",
      preis: "kostenlos, Geld verdient das Haus mit Lizenzen an Firmen",
      depot: true,
      zakat: true,
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
      gremium: {
        url: "https://finispia.com/",
        stand,
        hinweis:
          "Es wird kein eigenes Gremium genannt. Die App wendet die Regelwerke fremder Indexhäuser an, die Verantwortung liegt dort.",
      },
      begruendung: {
        url: "https://finispia.com/",
        stand,
        hinweis: "Das Ergebnis wird je Methode mit den Kennzahlen gezeigt, aus denen es folgt.",
      },
      deutscheAktien: {
        url: "https://finispia.com/",
        stand,
        hinweis: "Laut Anbieter werden Aktien an über 90 Börsen geprüft, deutsche eingeschlossen.",
      },
      umfang: { url: "https://finispia.com/", stand, hinweis: "Geprüft werden Aktien, ETFs, REITs, Fonds, Sukuk, Indizes und Börsengänge." },
      etfs: { url: "https://finispia.com/", stand, hinweis: "ETFs und Fonds stehen ausdrücklich in der Liste der geprüften Wertpapierarten." },
      kostenlos: { url: "https://finispia.com/", stand, hinweis: "Das Screening ist ohne Anmeldung nutzbar." },
      preis: {
        url: "https://finispia.com/",
        stand,
        hinweis:
          "Für Leser kostenlos. Das Haus verkauft daneben Lizenzen an Firmen (White Label, API, Widget).",
      },
      zakat: { url: "https://finispia.com/", stand, hinweis: "Ein Zakat-Rechner gehört zum Angebot." },
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
      kostenlos: "eine Prüfung als Bericht, danach Abo",
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
      gremium: {
        url: "https://islamicly.com/",
        stand,
        hinweis:
          "Drei Gelehrte stehen mit Namen dahinter: Dr. Mohamed A. Elgari (Vorsitz, Saudi-Arabien), Dr. Muhammad Amin Qattan (Kuwait) und Dr. Nazih Hammad (Kanada). Elgari sitzt im AAOIFI-Gremium.",
      },
      begruendung: { url: "https://islamicly.com/", stand, hinweis: "Die App gibt je Aktie eine Compliance Report Card mit den Kennzahlen aus." },
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
      kostenlos: { url: "https://islamicly.com/", stand, hinweis: "Beworben wird eine kostenlose Shariah Compliance Report Card, der laufende Zugang ist ein Abo." },
      preis: {
        url: "https://islamicly.com/",
        stand,
        hinweis:
          "Der Anbieter rechnet in indischen Rupien ab: 999 im Monat, 2.499 für drei Monate, 9.999 im Jahr. Die App ist auf den indischen Markt zugeschnitten, das erklärt auch die Anlageprodukte daneben.",
      },
      depot: { url: "https://islamicly.com/", stand, hinweis: "Über 30 angebundene Broker, Zugang zu Märkten in über 175 Ländern." },
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
      kostenlos: "unbegrenzte Halal-Prüfungen mit Bericht, 10 neue Abdeckungsanfragen am Tag",
      preis: "80 US-Dollar im Jahr im Angebot, regulär 200",
      depot: true,
      zakat: true,
      sprache: "Englisch",
    },
    quellen: {
      standard: { url: "https://musaffa.com/", stand, hinweis: "Musaffa prüft nach AAOIFI-Standards, mit Geschäftstätigkeit und Finanzkennzahlen." },
      gremium: {
        url: "https://musaffa.com/shariah-compliance",
        stand: "19.09.2026",
        hinweis:
          "Namentlich genannt: Shaikh Dr. Aznan Hasan, Mitglied im Shariah-Rat der AAOIFI, und Mufti Faraz Adam, Leiter von Amanah Advisors, die das Verfahren unabhängig zertifizieren. Am 19.09.2026 korrigiert: Die Namen stehen auf einer Unterseite, nicht auf der Startseite.",
      },
      begruendung: { url: "https://musaffa.com/", stand, hinweis: "Je Aktie gibt es einen ausführlichen Compliance-Bericht mit Rating und den zugrunde liegenden Zahlen." },
      reinigung: { url: "https://musaffa.com/pricing/", stand, hinweis: "Reinigungs- und Zakat-Rechner gehören zum Bezahlmodell." },
      deutscheAktien: {
        url: "https://musaffa.com/pricing/",
        stand,
        hinweis:
          "Der Anbieter weist die Abdeckung je Land aus: Deutschland 997 Aktien, davon 231 halal, dazu 121 ETFs mit einem halal. 28,41 Prozent der deutschen Marktkapitalisierung gelten als halal.",
      },
      umfang: { url: "https://musaffa.com/pricing/", stand, hinweis: "120.000+ Aktien und ETFs aus 60 Märkten zur Recherche, 11.000+ US-Aktien und 1.000+ ETFs durchleuchtet." },
      etfs: { url: "https://musaffa.com/", stand, hinweis: "Eigener ETF-Screener, über 1.000 Fonds gegen Halal-Filter geprüft." },
      kostenlos: { url: "https://musaffa.com/pricing/", stand, hinweis: "Kostenlos sind unbegrenzte Halal-Prüfungen, Rating, Bericht und Verlauf, begrenzt auf 10 Abdeckungsanfragen am Tag." },
      preis: { url: "https://musaffa.com/pricing/", stand, hinweis: "Ein Modell: 80 US-Dollar im Jahr als Sonderangebot, regulär 200 US-Dollar, umgerechnet 6,67 im Monat." },
      depot: { url: "https://musaffa.com/", stand, hinweis: "Depot verbinden über 1.500 Banken und Broker." },
      zakat: { url: "https://musaffa.com/", stand, hinweis: "Zakat-Rechner gehört zum Angebot." },
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
      gremium: "schlecht",
      begruendung: "gut",
      reinigung: "teils",
      deutscheAktien: "ja, Deutschland ist einer von neun Märkten",
      umfang: "über 40.000 Aktien, ETFs und Fonds",
      etfs: true,
      kostenlos: "Halal-Bewertung tausender Aktien",
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
        url: "https://zoya.finance/",
        stand,
        hinweis: "Der Anbieter spricht von Shariah-Beratern, nennt sie auf den öffentlichen Seiten aber nicht mit Namen.",
      },
      begruendung: { url: "https://zoya.finance/", stand, hinweis: "Zu jeder Aktie gibt es einen Compliance-Bericht mit den Einzelwerten." },
      deutscheAktien: {
        url: "https://zoya.finance/",
        stand,
        hinweis:
          "Abgedeckt sind USA, Großbritannien, Kanada, Australien, Deutschland, Indien, Japan, Polen, Taiwan und der Freiverkehr. Am vollständigsten sind die USA.",
      },
      umfang: { url: "https://zoya.finance/", stand, hinweis: "Über 40.000 Aktien, ETFs und Fonds, Daten täglich aktualisiert, Compliance-Berichte im Takt der Geschäftsberichte." },
      etfs: { url: "https://zoya.finance/", stand, hinweis: "ETFs und Investmentfonds lassen sich bis auf die einzelnen Positionen filtern." },
      kostenlos: {
        url: "https://apps.apple.com/de/app/zoya-halal-investing-app/id1447547610",
        stand,
        hinweis: "App-Store-Beschreibung: „Access shariah compliance ratings of thousands of stocks worldwide, for free!“",
      },
      preis: {
        url: "https://apps.apple.com/de/app/zoya-halal-investing-app/id1447547610",
        stand,
        hinweis:
          "Der App-Store-Eintrag weist die App als kostenlos mit In-App-Käufen aus. Einen Preis nennt der Anbieter weder auf der Website noch im Hilfebereich, er steht erst in der App.",
      },
      depot: { url: "https://zoya.finance/", stand, hinweis: "Depot verbinden und Bestände laufend auf Compliance prüfen." },
      zakat: { url: "https://zoya.finance/", stand, hinweis: "Zakat-Rechner mit Import der Bestände." },
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
