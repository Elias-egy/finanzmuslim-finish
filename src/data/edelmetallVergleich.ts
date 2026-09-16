// Von Hand gepflegt. Hier steht keine Finanzfluss-Tabelle dahinter, es gibt
// auch keine für Edelmetalle. Jeder Wert hat eine Quelle mit Prüfdatum.
import type { VergleichsZeile } from "@/components/vergleich/vergleichTypen";
import type { RohAnbieter } from "./vergleichHelfer";

/**
 * Wege zu Gold und Silber im Vergleich.
 *
 * Warum Wege und nicht Händler: Bei Gold entscheidet nicht der Anbieter über
 * halal oder nicht, sondern die Bauart des Geschäfts. Ob du bei philoro oder
 * bei Degussa einen Barren kaufst, ändert an der Sharia-Frage nichts. Ob du
 * einen Barren kaufst oder eine Schuldverschreibung auf Gold, ändert alles.
 *
 * Die entscheidende Regel steht in /wissen/halal-gold-kaufen: Bei Gold und
 * Silber müssen Zahlung und Übergabe zusammenfallen. Alles, was das
 * auseinanderzieht oder die Übergabe durch ein Versprechen ersetzt, fällt.
 * Diese Tabelle übersetzt die Regel in die fünf Wege, die es hier gibt.
 */
export const EDELMETALL_ZEILEN: VergleichsZeile[] = [
  { key: "__angebot", label: "Angebot", art: "text", gruppe: "angebot" },
  {
    key: "uebergabe",
    label: "Übergabe fällt mit der Zahlung zusammen",
    art: "ampel",
    gruppe: "halal",
    imRaster: true,
    hinweis:
      "Die Kernregel bei Gold und Silber. Grün: Du zahlst, und im selben Moment gehört dir bestimmtes Metall. Gelb: Es kommt auf den Vertrag an. Rot: Zwischen Zahlung und Metall liegt ein Versprechen.",
  },
  {
    key: "echtesMetall",
    label: "Echtes Metall dahinter",
    art: "ampel",
    gruppe: "halal",
    imRaster: true,
    hinweis:
      "Liegt hinter dem, was du kaufst, wirklich Metall, und ist es dir zugeordnet? Grün: ja, mit Nummer und Liste. Gelb: Metall liegt da, gehört dir aber nur als Anspruch. Rot: kein Metall, nur ein Kurs.",
  },
  {
    key: "nachweis",
    label: "Shariah-Nachweis vorhanden",
    art: "ampel",
    gruppe: "halal",
    imRaster: true,
    hinweis:
      "Gibt es ein Gutachten oder Zertifikat eines Gelehrtengremiums, das du selbst lesen kannst? Grün: ja, mindestens ein Anbieter auf diesem Weg hat eines. Rot: nein, keiner.",
  },
  {
    key: "ausliefern",
    label: "Ausliefern möglich",
    art: "ampel",
    gruppe: "halal",
    hinweis:
      "Kommst du an das Metall heran, wenn du es willst? Das ist die Probe darauf, ob hinter dem Papier wirklich Barren liegen.",
  },
  { key: "anbieter", label: "Wer das anbietet", art: "text", gruppe: "angebot" },
  { key: "kosten", label: "Was es kostet", art: "text", gruppe: "kosten", imRaster: true },
  { key: "einstieg", label: "Kleinster Einstieg", art: "text", gruppe: "kosten" },
  { key: "aufbewahrung", label: "Aufbewahrung", art: "text", gruppe: "kosten" },
  { key: "sparplan", label: "Monatlich möglich", art: "janein", gruppe: "kosten" },
  { key: "steuer", label: "Steuer nach einem Jahr", art: "text", gruppe: "kosten" },
];

const stand = "16.09.2026";
const artikel = { url: "/wissen/halal-gold-kaufen", stand, hinweis: "Hergeleitet aus der Regel zur sofortigen Übergabe, siehe unser Beitrag Halal Gold kaufen." };

export const edelmetallVergleich: RohAnbieter[] = [
  {
    id: "barren-beim-haendler",
    name: "Barren und Münzen",
    produkt: "beim Händler",
    werte: {
      uebergabe: "gut",
      echtesMetall: "gut",
      nachweis: "gut",
      ausliefern: "gut",
      anbieter: "philoro, Degussa, pro aurum, Ophirum, dazu jeder Juwelier",
      kosten: "Aufschlag auf den Metallpreis, bei kleinen Einheiten deutlich höher",
      einstieg: "ab 1 Gramm, sinnvoll ab 10 Gramm",
      aufbewahrung: "selbst, oder Schließfach gegen Gebühr",
      sparplan: false,
      steuer: "steuerfrei",
    },
    quellen: {
      uebergabe: {
        stand,
        hinweis:
          "Der unstrittige Fall: Du zahlst und nimmst das Metall mit. Beim Versand gilt dasselbe, solange der Händler den Barren schon hat und die Lieferzeit kurz ist.",
      },
      echtesMetall: { stand, hinweis: "Du hältst den Barren in der Hand, mit Prägung, Gewicht und meist Nummer." },
      nachweis: {
        stand,
        hinweis:
          "Für den Kauf eines Barrens gegen sofortige Zahlung braucht es kein Produktzertifikat. Die Zulässigkeit folgt unmittelbar aus der Regel, darüber streitet niemand.",
      },
      ausliefern: { stand, hinweis: "Du hast es bereits." },
      anbieter: {
        url: "https://www.proaurum.de/shop/",
        stand,
        hinweis:
          "Große Häuser mit Filialen und Versand in Deutschland: philoro, Degussa, pro aurum und Ophirum. pro aurum und Ophirum betreiben mit pro aurum Tresorgold ein gemeinsames Lagerangebot.",
      },
      kosten: { stand, hinweis: "Kein Händler verkauft zum reinen Metallpreis. Der Abstand zwischen Ankaufs- und Verkaufspreis ist der tatsächliche Verlust am ersten Tag." },
      einstieg: { stand, hinweis: "Sehr kleine Einheiten kosten anteilig deutlich mehr Aufschlag." },
      steuer: {
        stand,
        hinweis:
          "Anlagegold ist beim Kauf von der Umsatzsteuer befreit, der Gewinn nach mehr als einem Jahr ist nach derzeitiger Rechtslage steuerfrei. Keine Steuerberatung.",
      },
    },
  },
  {
    id: "goldsparplan-mit-zuteilung",
    name: "Sparplan mit Zuteilung",
    produkt: "monatlich kaufen",
    werte: {
      uebergabe: "teils",
      echtesMetall: "gut",
      nachweis: "gut",
      ausliefern: "gut",
      anbieter: "INAIA mit Shariah-Zertifikat, daneben Auvesta und SOLIT ohne",
      kosten: "Aufschlag je Kauf, dazu Lagergebühr, bei INAIA 1 Euro im Monat",
      einstieg: "monatlich kleine Beträge",
      aufbewahrung: "Tresor des Anbieters, bei INAIA in Deutschland und der Schweiz",
      sparplan: true,
      steuer: "steuerfrei bei physischem Bestand",
    },
    quellen: {
      uebergabe: {
        stand,
        hinweis:
          "Kommt auf den Vertrag an. Sauber ist er, wenn für deine Einzahlung sofort gekauft und dir ein bestimmter Bestand zugeordnet wird. Die typischen Fallen sind eine Abschlussgebühr ohne Gegenleistung und Granulat statt eines bestimmbaren Barrens.",
      },
      echtesMetall: { stand, hinweis: "Das Metall liegt im Tresor und wird dem Kunden zugeordnet." },
      nachweis: {
        url: "https://www.inaia.finance/en/gold-dinar/",
        stand,
        hinweis:
          "INAIA, nach eigener Angabe Deutschlands erstes islamisches Fintech, lässt den Sparplan prüfen: „Verified and certified by Minhaj Shari'ah Financial Advisory in Dubai (UAE) according to the Islamic Finance criteria of AAOIFI.“ Für Auvesta und SOLIT haben wir keinen Shariah-Nachweis gefunden, das heißt nicht, dass ihre Verträge unzulässig sind, sondern dass du sie selbst prüfen musst.",
      },
      ausliefern: {
        url: "https://www.inaia.finance/en/gold-dinar/",
        stand,
        hinweis: "„Because your gold is physically present, we can also deliver it to your home upon request.“",
      },
      anbieter: {
        url: "https://www.inaia.finance/en/savings-plan/",
        stand,
        hinweis: "INAIA bietet Gold und Silber als Sparplan an. Auvesta und SOLIT sind die bekanntesten deutschen Anbieter ohne Shariah-Prüfung.",
      },
      kosten: { url: "https://www.inaia.finance/en/gold-dinar/", stand, hinweis: "INAIA: „a fixed price of only €1 per month per account, regardless of the quantity stored“. Der Aufschlag je Kauf steht dort nicht." },
      aufbewahrung: { url: "https://www.inaia.finance/en/gold-dinar/", stand, hinweis: "Hochsichere Tresore in Deutschland und in der Schweiz." },
      steuer: { stand, hinweis: "Physisch zugeordnetes Metall wird steuerlich wie ein Barren behandelt. Keine Steuerberatung." },
    },
  },
  {
    id: "zertifizierter-etc",
    name: "Zertifizierter ETC",
    produkt: "im Depot",
    werte: {
      uebergabe: "teils",
      echtesMetall: "gut",
      nachweis: "gut",
      ausliefern: "teils",
      anbieter: "Royal Mint, Invesco, WisdomTree, alle mit jährlichem Zertifikat",
      kosten: "0,12 bis 0,49 Prozent im Jahr, dazu die Ordergebühr",
      einstieg: "ein Anteil, oft unter 100 Euro",
      aufbewahrung: "Tresor der Verwahrstelle, bei RMAU die Royal Mint in Cardiff",
      sparplan: true,
      steuer: "meist Abgeltungsteuer",
    },
    quellen: {
      uebergabe: {
        stand,
        hinweis:
          "Der Streitpunkt. Dir wird Metall zugeordnet und es ist vom Vermögen des Anbieters getrennt, aber du hältst es nicht. Ein Teil der Gelehrten lässt das gelten, ein anderer nicht. Das Al-Qalam-Gremium schreibt in seinem WisdomTree-Bericht offen, dass die Abrechnung erst nach zwei Tagen erfolgt, und begründet, warum es das dennoch für vertretbar hält.",
      },
      echtesMetall: { stand, hinweis: "Physisch besichert mit nummerierten Barren, die Barrenlisten sind veröffentlicht." },
      nachweis: {
        url: "https://hanetf.com/wp-content/assets/The%20Royal%20Mint%20ETC%20-%20Shariah%20Compliance%20Cert%20-%202025.pdf",
        stand,
        hinweis:
          "Jährliche Zertifikate liegen vor: Amanie Advisors für den Royal-Mint-ETC und für die Invesco-ETCs, das Al-Qalam-Panel für die WisdomTree-Produkte. Alle sind in unserer Anlagen-Datenbank verlinkt.",
      },
      ausliefern: {
        url: "https://hanetf.com/de/fund/rmau-the-royal-mint-responsibly-sourced-physical-gold-etc/",
        stand,
        hinweis:
          "Nur bei wenigen Produkten. Der Royal-Mint-ETC ist die Ausnahme: Das Gold liegt im Tresor der Royal Mint in Cardiff statt bei einer Bank, und Privatanleger können sich Barren und Münzen ausliefern lassen. Bei den meisten anderen geht das nicht.",
      },
      anbieter: { url: "/halal-anlagen", stand, hinweis: "Sieben Gold- und Silberprodukte mit Zertifikat stehen in unserer Anlagen-Datenbank, dazu Platin, Palladium und ein Korb." },
      kosten: { url: "/halal-anlagen", stand, hinweis: "Laufende Kosten zwischen 0,12 und 0,49 Prozent im Jahr, je Produkt in der Datenbank ausgewiesen." },
      aufbewahrung: { url: "https://hanetf.com/de/fund/rmau-the-royal-mint-responsibly-sourced-physical-gold-etc/", stand, hinweis: "Beim Royal-Mint-ETC im Tresor der Royal Mint in Cardiff, außerhalb des Londoner Bankensystems." },
      steuer: {
        stand,
        hinweis:
          "Steuerfrei nach einem Jahr ist der Gewinn nur, wenn du dir das Metall ausliefern lassen kannst. Bei den meisten ETCs geht das nicht, dann greift die Abgeltungsteuer. Keine Steuerberatung.",
      },
    },
  },
  {
    id: "schuldverschreibung",
    name: "Gold-Schuldverschreibung",
    produkt: "Xetra-Gold, EUWAX Gold II",
    werte: {
      uebergabe: "schlecht",
      echtesMetall: "teils",
      nachweis: "schlecht",
      ausliefern: "gut",
      anbieter: "Deutsche Börse Commodities, Boerse Stuttgart",
      kosten: "Xetra-Gold mit jährlicher Verwahrgebühr, EUWAX Gold II ohne",
      einstieg: "ab einem Gramm",
      aufbewahrung: "Tresor in Deutschland",
      sparplan: true,
      steuer: "steuerfrei, weil Auslieferung möglich ist",
    },
    quellen: {
      uebergabe: {
        url: "https://www.xetra-gold.com/",
        stand,
        hinweis:
          "Der Anbieter sagt selbst, was du kaufst: eine Schuldverschreibung, die „den Anspruch auf jederzeitige Auslieferung von Goldbarren“ verbrieft. Ein Anspruch ist ein Versprechen, kein Metall. Genau diese Bauart trennt die Zahlung von der Übergabe.",
      },
      echtesMetall: {
        url: "https://www.euwax-gold.de/ewg2ld/faq/",
        stand,
        hinweis:
          "Metall liegt da: „EUWAX Gold II ist zu 100% mit physischem Gold hinterlegt, das entsprechend in einem Tresor lagert“. Es gehört dir aber nicht, du hast eine Forderung gegen den Herausgeber.",
      },
      nachweis: { stand, hinweis: "Weder für Xetra-Gold noch für EUWAX Gold II haben wir ein Gutachten eines Gelehrtengremiums gefunden." },
      ausliefern: { url: "https://www.euwax-gold.de/ewg2ld/faq/", stand, hinweis: "„Die physische Auslieferung des Goldes ist prinzipiell ab einem Gramm möglich“." },
      anbieter: { url: "https://www.xetra-gold.com/", stand, hinweis: "Xetra-Gold von Deutsche Börse Commodities, EUWAX Gold II von der Boerse Stuttgart." },
      kosten: { url: "https://www.euwax-gold.de/ewg2ld/faq/", stand, hinweis: "EUWAX Gold II: „Für die Verwahrung fallen von Seiten der Emittentin keine jährlichen Gebühren an“. Xetra-Gold erhebt eine jährliche Verwahrgebühr." },
      einstieg: { url: "https://www.euwax-gold.de/ewg2ld/faq/", stand, hinweis: "Auslieferung ab einem Gramm." },
      steuer: { stand, hinweis: "Weil die Auslieferung möglich ist, wird der Gewinn nach einem Jahr wie bei physischem Gold behandelt. Keine Steuerberatung." },
    },
  },
  {
    id: "zertifikate-und-cfds",
    name: "Zertifikate und CFDs",
    produkt: "Wetten auf den Preis",
    werte: {
      uebergabe: "schlecht",
      echtesMetall: "schlecht",
      nachweis: "schlecht",
      ausliefern: "schlecht",
      anbieter: "Banken und Broker mit Hebelprodukten",
      kosten: "Spread, Finanzierungskosten, bei Hebel laufende Zinsen",
      einstieg: "wenige Euro",
      aufbewahrung: "kein Metall vorhanden",
      sparplan: false,
      steuer: "Abgeltungsteuer",
    },
    quellen: {
      uebergabe: { ...artikel, hinweis: "Es wird nichts übergeben, weil nichts gekauft wird. Du wettest auf einen Preis." },
      echtesMetall: { ...artikel, hinweis: "Hinter diesen Papieren liegt kein Metall. Der Herausgeber bildet den Preis nach." },
      nachweis: { stand, hinweis: "Kein Gremium zertifiziert eine Wette auf den Goldpreis." },
      ausliefern: { ...artikel, hinweis: "Es gibt nichts auszuliefern." },
      kosten: { ...artikel, hinweis: "Bei Hebelprodukten kommt ein verzinstes Darlehen dazu. Das ist neben der Wette der zweite Einwand." },
    },
  },
];

export const EDELMETALL_FILTER = [
  { key: "uebergabe", label: "Übergabe fällt mit der Zahlung zusammen" },
  { key: "nachweis", label: "Shariah-Nachweis vorhanden" },
];
