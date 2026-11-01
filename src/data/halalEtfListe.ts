import { halalAnlagen } from "@/data/halalAnlagen";
import { ANLAGEN_KAUFBAR } from "@/data/anlagenKaufbar";

/**
 * Die Liste „Beste Halal ETFs 2026“ (/blog/halal-etf, SEO24, 01.11.2026).
 *
 * Rangfolge, Renditen, Größe und Sparplan stammen aus
 * fundament/research/quellen/SEO-GUIDE-Z2aCQ5YKaTU/BESTE-HALAL-ETFS-INHALT.md im Vault:
 * Größe und Renditen von justETF je ISIN (EUR, mit Ausschüttungen) per 30.10.2026,
 * Sparplan nur mit Eigenbeleg des Anbieters (~/rebrand/data/vergleiche/recherche/anlagen.json).
 * Kosten, Auflage, Gremium und Beleg-Link kommen aus `halalAnlagen`, damit eine
 * Änderung dort auch hier ankommt. Kaufbar-Zahlen rechnet die Seite aus `ANLAGEN_KAUFBAR`.
 *
 * Halal-Aussagen nur mit Beleg des Anbieters, nie ein eigenes Urteil (~/.claude/CLAUDE.md §5).
 * „3 Jahre“ wird nicht gezeigt: bei jungen Fonds rechnet justETF mit Indexwerten vor der Auflage.
 */

export const RENDITE_STAND = "30.10.2026";

export type EtfEintrag = {
  platz: number;
  isin: string;
  /** Anzeigename, gleich in Quick Compare, Liste und Tabelle. */
  name: string;
  /** Höchstens sechs Wörter, wortgleich in Karte, H3 und Tabelle. */
  amBestenFuer: string;
  /** Ein Satz für die Karte oben. */
  satz: string;
  /** Kurzform für „Geprüft von“. */
  geprueftKurz: string;
  groesseMio: number;
  rendite1J: string | null;
  rendite2025: string | null;
  rendite2024: string | null;
  /** Nur junge Fonds: Rendite seit Auflage statt 1 Jahr. */
  seitAuflage?: string;
  sparplanBei: string[];
  text: string[];
  dafuer: string[];
  dagegen: string[];
  schluss: string;
  geprueftText: string;
};

const PANEL_ISHARES =
  "Laut Verkaufsprospekt von iShares II plc hat dieser Fonds ein eigenes Gremium, das Shari'ah Equity Funds Panel mit Dr. Mohamed Elgari, Scheich Nizam Yaquby und Dr. Mohd Daud Bakar. Es hat eine Fatwa erteilt und stellt jedes Jahr ein Zertifikat aus. Welche Firmen in den Index dürfen, entscheidet getrennt davon das Shariah Board von MSCI.";

const NUR_INDEX_MSCI =
  "Für den Fonds selbst gibt es kein eigenes Zertifikat. Der Beleg ist die Methodik des MSCI World Islamic: MSCI schreibt darin, dass ein Ausschuss aus islamischen Gelehrten die Methodik freigegeben hat und die Indexwerte regelmäßig bescheinigt werden.";

export const etfListe: EtfEintrag[] = [
  {
    platz: 1,
    isin: "IE00B27YCN58",
    name: "iShares MSCI World Islamic",
    amBestenFuer: "den Einstieg mit einem ETF",
    satz: "Größter Islamic ETF für die Welt, seit 2007.",
    geprueftKurz: "Gremium bei iShares",
    groesseMio: 1577,
    rendite1J: "+24,50 %",
    rendite2025: "+5,69 %",
    rendite2024: "+11,95 %",
    sparplanBei: ["Smartbroker+", "Scalable PRIME+", "flatex", "comdirect", "Consorsbank", "ING", "finanzen.net zero", "1822direkt", "und 6 weitere"],
    text: [
      "Wenn du nur einen Halal ETF kaufen willst, dann diesen. Er bildet den MSCI World Islamic nach. Das ist der bekannte MSCI World, aus dem jede Firma fliegt, die bei der Shariah-Prüfung durchfällt. Banken und Versicherungen sind damit raus, ebenso Firmen mit zu vielen verzinsten Schulden.",
      "Es gibt ihn seit Dezember 2007. Mit 1.577 Mio. € ist er der größte Fonds dieser Liste. Einen Sparplan darauf belegen 14 Anbieter, mehr als bei jedem anderen ETF hier. Im letzten Jahr lag er bei plus 24,50 Prozent, 2025 bei plus 5,69 Prozent.",
      "Die Erträge schüttet er zweimal im Jahr aus. Das hilft bei der Reinigung: Du siehst die Ausschüttung auf dem Konto und rechnest den unreinen Anteil direkt davon aus.",
    ],
    dafuer: [
      "Eigenes Gremium für das Produkt, mit Fatwa und Zertifikat jedes Jahr.",
      "Sparplan bei 14 Anbietern belegt.",
      "Größter Fonds der Liste, seit 2007 am Markt.",
    ],
    dagegen: [
      "Er schüttet aus. Wer alles im Fonds lassen will, muss selbst wieder anlegen.",
      "Mit 0,30 % im Jahr nicht günstiger als der HSBC auf denselben Index.",
    ],
    schluss:
      "Am besten geeignet für dich, wenn du mit einem einzigen ETF anfangen willst. Der Nachteil: Die Ausschüttungen legst du selbst wieder an.",
    geprueftText: PANEL_ISHARES,
  },
  {
    platz: 2,
    isin: "IE000UOXRAM8",
    name: "Invesco Dow Jones Islamic Global Developed Markets",
    amBestenFuer: "Welt, Erträge bleiben im Fonds",
    satz: "Gewinne bleiben im Fonds, ohne dein Zutun.",
    geprueftKurz: "Amanie Advisors, für 2023",
    groesseMio: 1046,
    rendite1J: "+17,32 %",
    rendite2025: "+5,07 %",
    rendite2024: "+25,68 %",
    sparplanBei: ["Smartbroker+", "flatex", "Consorsbank", "tradegate.direct", "Scalable PRIME+"],
    text: [
      "Dieser ETF folgt nicht MSCI, sondern dem Islamic-Index von Dow Jones für die Industrieländer. Die Prüfregeln sind ähnlich, die Grenzwerte im Detail anders. Darum stecken teils andere Firmen drin als bei Platz 1.",
      "Er schüttet nichts aus. Gewinne bleiben im Fonds und arbeiten weiter, du musst nichts selbst wieder anlegen. Mit 1.046 Mio. € ist er der zweitgrößte Fonds der Liste, aufgelegt im Januar 2022. 2024 lag er bei plus 25,68 Prozent, 2025 bei plus 5,07 Prozent.",
      "Einen Sparplan belegen fünf Anbieter, darunter Smartbroker+ und Scalable PRIME+.",
    ],
    dafuer: [
      "Thesaurierend, du legst nichts selbst wieder an.",
      "Eigenes Shariah-Zertifikat für genau diesen ETF.",
      "Über 1 Mrd. € im Fonds.",
    ],
    dagegen: [
      "Mit 0,40 % im Jahr der teuerste passive Welt-ETF der Liste.",
      "Das jüngste Zertifikat, das wir gefunden haben, gilt für 2023.",
    ],
    schluss:
      "Am besten geeignet für dich, wenn Gewinne im Fonds bleiben sollen und du sparen willst. Der Nachteil: Ein Zertifikat für 2024 oder 2025 haben wir nicht gefunden.",
    geprueftText:
      "Amanie Advisors hat ein Shariah-Zertifikat für genau diesen ETF ausgestellt. Es gilt für das Geschäftsjahr 2023 und ist vom 15. Oktober 2024. Ein Zertifikat für 2024 oder 2025 haben wir nicht gefunden.",
  },
  {
    platz: 3,
    isin: "IE00B296QM64",
    name: "iShares MSCI USA Islamic",
    amBestenFuer: "nur die USA",
    satz: "Nur US-Firmen, Gremium wie Platz 1.",
    geprueftKurz: "Gremium bei iShares",
    groesseMio: 609,
    rendite1J: "+28,90 %",
    rendite2025: "+2,89 %",
    rendite2024: "+15,82 %",
    sparplanBei: ["Smartbroker+", "flatex", "1822direkt", "finanzen.net zero", "finvesto", "tradegate.direct", "Scalable PRIME+", "GLS Bank"],
    text: [
      "Er kauft nur Firmen aus den USA, geprüft nach denselben Regeln wie Platz 1. Gremium und Zertifikat sind dieselben.",
      "Im letzten Jahr lag er bei plus 28,90 Prozent, 2024 bei plus 15,82 und 2025 bei plus 2,89 Prozent. Mit 609 Mio. € ist er kleiner als Platz 1, aber ebenfalls seit 2007 am Markt. Einen Sparplan belegen acht Anbieter.",
      "Ein Land ist ein Klumpen. Läuft es in den USA schlecht, trifft es den ganzen Fonds. Darum passt er eher als Teil neben einem Welt-ETF als ganz allein.",
    ],
    dafuer: ["Gleiches Gremium mit Fatwa wie Platz 1.", "Sparplan bei 8 Anbietern belegt.", "0,30 % im Jahr."],
    dagegen: ["Ein Land, kein Ausgleich über andere Märkte.", "Er schüttet aus."],
    schluss: "Am besten geeignet für dich, wenn du gezielt auf die USA setzen willst. Der Nachteil: Alles hängt an einem Land.",
    geprueftText: PANEL_ISHARES,
  },
  {
    platz: 4,
    isin: "IE00B27YCP72",
    name: "iShares MSCI Emerging Markets Islamic",
    amBestenFuer: "Schwellenländer als Beimischung",
    satz: "China und Indien als kleiner Teil dazu.",
    geprueftKurz: "Gremium bei iShares",
    groesseMio: 700,
    rendite1J: "+39,23 %",
    rendite2025: "+32,08 %",
    rendite2024: "−2,06 %",
    sparplanBei: ["Smartbroker+", "flatex", "1822direkt", "Consorsbank", "finanzen.net zero", "finvesto", "tradegate.direct", "Scalable PRIME+", "GLS Bank"],
    text: [
      "Er kauft Firmen aus Schwellenländern, etwa China und Indien. Platz 1 hat diese Länder nicht drin. Wer sie dabeihaben will, nimmt diesen ETF als kleinen Teil dazu.",
      "Die Schwankung ist groß: 2024 lag er bei minus 2,06 Prozent, 2025 bei plus 32,08 Prozent. Im letzten Jahr waren es plus 39,23 Prozent, der höchste Wert der Liste.",
      "Er ist seit 2007 am Markt und hat 700 Mio. €. Einen Sparplan belegen neun Anbieter, nach Platz 1 die meisten.",
    ],
    dafuer: ["Gleiches Gremium mit Fatwa wie Platz 1.", "Sparplan bei 9 Anbietern belegt."],
    dagegen: ["Starke Schwankung, 2024 im Minus.", "0,35 % im Jahr, etwas teurer als Platz 1."],
    schluss:
      "Am besten geeignet für dich, wenn du neben Platz 1 Schwellenländer beimischen willst. Der Nachteil: Er schwankt deutlich stärker.",
    geprueftText: PANEL_ISHARES,
  },
  {
    platz: 5,
    isin: "IE000X9FTI22",
    name: "HSBC MSCI World Islamic Screened",
    amBestenFuer: "World günstig, ohne Ausschüttung",
    satz: "Index wie Platz 1, Gewinne bleiben drin.",
    geprueftKurz: "MSCI, nur der Index",
    groesseMio: 182,
    rendite1J: "+24,51 %",
    rendite2025: "+7,01 %",
    rendite2024: "+12,66 %",
    sparplanBei: [],
    text: [
      "Er bildet denselben Index nach wie Platz 1, den MSCI World Islamic. Der Unterschied: Er schüttet nicht aus. Die Kosten sind gleich, 0,30 % im Jahr.",
      "Mit 182 Mio. € ist er deutlich kleiner, aufgelegt im November 2022. Im letzten Jahr lag er bei plus 24,51 Prozent, praktisch gleichauf mit Platz 1.",
      "Zwei Haken. Einen Sparplan darauf hat uns kein Anbieter belegt. Und es gibt kein eigenes Gremium für den Fonds, der Beleg betrifft nur den Index. Kaufen kannst du ihn bei 9 Anbietern, darunter Traders Place und Consorsbank.",
    ],
    dafuer: ["Thesaurierend zu 0,30 % im Jahr.", "Gleicher Index wie Platz 1."],
    dagegen: ["Kein Sparplan belegt.", "Halal-Beleg nur für den Index, nicht für den Fonds."],
    schluss:
      "Am besten geeignet für dich, wenn du einmal anlegst und nichts ausgeschüttet haben willst. Der Nachteil: Ein Sparplan ist nicht belegt.",
    geprueftText: NUR_INDEX_MSCI,
  },
  {
    platz: 6,
    isin: "IE000LFC57H7",
    name: "Invesco MSCI ACWI Islamic",
    amBestenFuer: "Welt und Schwellenländer in einem",
    satz: "Alle Länder in einem ETF, seit 2026.",
    geprueftKurz: "MSCI, nur der Index",
    groesseMio: 129,
    rendite1J: null,
    rendite2025: null,
    rendite2024: null,
    seitAuflage: "+17,62 %",
    sparplanBei: ["Scalable PRIME+"],
    text: [
      "ACWI heißt All Country World. Der ETF nimmt Industrieländer und Schwellenländer zusammen, du brauchst also keinen zweiten ETF dafür.",
      "Der Fonds ist jung: aufgelegt im Februar 2026, 129 Mio. €. Seit Auflage steht er bei plus 17,62 Prozent. Für ein ganzes Jahr gibt es noch keine Zahl.",
      "Einen Sparplan belegt bisher nur Scalable PRIME+. Kaufen kannst du ihn bei 11 Anbietern, darunter Traders Place und Smartbroker+.",
    ],
    dafuer: ["Ein ETF für die ganze Welt samt Schwellenländern.", "Thesaurierend."],
    dagegen: ["Sehr jung, kaum Zahlen.", "Halal-Beleg nur für den Index.", "Sparplan nur bei einem Anbieter belegt."],
    schluss:
      "Am besten geeignet für dich, wenn du alles in einem ETF willst und einmal anlegst. Der Nachteil: Er ist erst seit Februar 2026 am Markt.",
    geprueftText: NUR_INDEX_MSCI,
  },
  {
    platz: 7,
    isin: "IE00BMYMHS24",
    name: "HANetf Saturna Al-Kawthar Global Focused Equity",
    amBestenFuer: "aktive Auswahl statt Index",
    satz: "Ein Fondsmanagement wählt aus, kein Index.",
    geprueftKurz: "Amanie Advisors, für 2025",
    groesseMio: 19,
    rendite1J: "+8,65 %",
    rendite2025: "+4,55 %",
    rendite2024: "+19,73 %",
    sparplanBei: ["flatex", "1822direkt", "comdirect", "finanzen.net zero", "tradegate.direct", "Scalable PRIME+", "comdirect Pure", "Targobank"],
    text: [
      "Dieser ETF ist aktiv. Ein Fondsmanagement wählt die Firmen selbst aus, statt einem Index zu folgen. Das kostet mehr: 0,75 % im Jahr, mehr als doppelt so viel wie Platz 1.",
      "Mit 19 Mio. € ist er der kleinste Fonds der Liste. Im letzten Jahr lag er bei plus 8,65 Prozent, 2024 bei plus 19,73 und 2025 bei plus 4,55 Prozent.",
      "Einen Sparplan belegen acht Anbieter, darunter comdirect und finanzen.net zero.",
    ],
    dafuer: ["Frisches Zertifikat für 2025, unterschrieben im Mai 2026.", "Sparplan bei 8 Anbietern belegt."],
    dagegen: ["0,75 % im Jahr.", "Kleinster Fonds der Liste mit 19 Mio. €."],
    schluss:
      "Am besten geeignet für dich, wenn du einem Fondsmanagement mehr vertraust als einem Index. Der Nachteil: Er kostet mehr als doppelt so viel.",
    geprueftText:
      "Das Shariah Supervisory Board von Amanie Advisors prüft den Fonds jedes Jahr. Das unterschriebene Zertifikat für das Geschäftsjahr 2025 ist vom 22.05.2026.",
  },
  {
    platz: 8,
    isin: "IE000929U2U9",
    name: "iShares USD Sukuk",
    amBestenFuer: "den ruhigen Teil, statt Anleihen",
    satz: "Sukuk statt Anleihen, für ruhigeres Geld.",
    geprueftKurz: "Sukuk-Gremium bei iShares",
    groesseMio: 160,
    rendite1J: "+2,52 %",
    rendite2025: "−5,04 %",
    rendite2024: null,
    sparplanBei: ["Scalable", "finanzen.net zero", "tradegate.direct", "Scalable PRIME+"],
    text: [
      "Sukuk sind das islamische Gegenstück zu Anleihen. Statt Zinsen bekommst du einen Anteil an Erträgen aus echten Werten.",
      "Der ETF kauft Sukuk in US-Dollar. Für dich als Anleger in Euro zählt darum auch der Kurs des Dollars. 2025 lag er bei minus 5,04 Prozent, im letzten Jahr bei plus 2,52 Prozent.",
      "Aufgelegt im Januar 2024, 160 Mio. €, Ausschüttung jedes Quartal. Einen Sparplan belegen vier Anbieter, darunter Scalable.",
    ],
    dafuer: ["Eigenes Sukuk-Gremium mit Fatwa und jährlichem Zertifikat.", "Ausschüttung jedes Quartal."],
    dagegen: ["Der Dollar-Kurs schwankt mit.", "0,40 % im Jahr."],
    schluss:
      "Am besten geeignet für dich, wenn ein Teil deines Geldes ruhiger liegen soll als in Aktien. Der Nachteil: Der Dollar-Kurs schwankt mit.",
    geprueftText:
      "Laut Verkaufsprospekt von iShares II plc hat dieser Fonds ein eigenes Sukuk Fund Panel, besetzt mit dem Shariah-Board von Amanie Advisors. Es hat eine Fatwa erteilt und stellt jedes Jahr ein Zertifikat aus.",
  },
];

/** Daten aus der Datenbank je Eintrag: Kosten, Auflage, Beleg, Adresse der Anlage-Seite. */
export const anlageVon = (isin: string) => {
  const a = halalAnlagen.find((x) => x.isin === isin);
  if (!a) throw new Error(`Anlage ${isin} fehlt in halalAnlagen`);
  return a;
};

/** Sparplan-Zahl: Liste plus „und n weitere“. */
export const sparplanAnzahl = (e: EtfEintrag) =>
  e.sparplanBei.reduce((n, s) => {
    const weitere = /^und (\d+) weitere$/.exec(s);
    return n + (weitere ? Number(weitere[1]) : 1);
  }, 0);

/** Bei wie vielen Depots die Anlage laut Eigenbeleg kaufbar ist. */
export const kaufbarBei = (isin: string) => ANLAGEN_KAUFBAR[isin]?.kaufbar.map((k) => k.anbieter) ?? [];

/** Wie viele ETFs der Liste ein Anbieter führt (Name wie in ANLAGEN_KAUFBAR). */
export const etfsBei = (anbieter: string) => etfListe.filter((e) => kaufbarBei(e.isin).includes(anbieter)).length;

/** Alle Depots, bei denen für mindestens einen ETF der Liste nachgesehen wurde. */
export const gepruefteDepots = () => {
  const alle = new Set<string>();
  for (const e of etfListe) {
    const k = ANLAGEN_KAUFBAR[e.isin];
    k?.kaufbar.forEach((x) => alle.add(x.anbieter));
    k?.nichtImAngebot.forEach((x) => alle.add(x));
  }
  return alle.size;
};

export const kaufbarStand = () => ANLAGEN_KAUFBAR[etfListe[0].isin]?.stand ?? "";

export const anker = (e: EtfEintrag) => anlageVon(e.isin).slug;
