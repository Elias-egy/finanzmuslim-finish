import { halalAnlagen } from "@/data/halalAnlagen";
import { ANLAGEN_KAUFBAR } from "@/data/anlagenKaufbar";

/**
 * Die Liste „Beste Halal ETFs 2026“ (/blog/halal-etf, SEO24, 01.11.2026).
 *
 * Rangfolge, Renditen, Größe und Sparplan stammen aus
 * fundament/research/quellen/SEO-GUIDE-Z2aCQ5YKaTU/BESTE-HALAL-ETFS-INHALT.md im Vault:
 * Größe und Renditen von justETF je ISIN (EUR, mit Ausschüttungen) per 30.10.2026 (Größe von Platz 7 und 8 aus halalAnlagen.ts, Stand 14.08.2026),
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
  "Laut Verkaufsprospekt von iShares II plc hat dieser Fonds ein eigenes Gremium, das Shari'ah Equity Funds Panel mit Dr. Mohamed Elgari, Scheich Nizam Yaquby und Dr. Mohd Daud Bakar. Es hat eine Fatwa erteilt und stellt jedes Jahr ein Zertifikat aus.";

const PANEL_WIE_PLATZ_1 =
  "Laut Verkaufsprospekt von iShares II plc prüft ihn dasselbe Gremium wie Platz 1, das Shari'ah Equity Funds Panel. Es hat eine Fatwa erteilt und stellt jedes Jahr ein Zertifikat aus.";

const NUR_INDEX_MSCI =
  "Für den Fonds selbst gibt es kein eigenes Zertifikat. Der Beleg betrifft nur den Index: MSCI lässt die Methodik seiner Islamic-Indizes von einem Ausschuss islamischer Gelehrter freigeben.";

export const etfListe: EtfEintrag[] = [
  {
    platz: 1,
    isin: "IE00B27YCN58",
    name: "iShares MSCI World Islamic",
    amBestenFuer: "den Einstieg mit einem ETF",
    satz: "Größter Fonds der Liste, seit 2007.",
    geprueftKurz: "Gremium bei iShares",
    groesseMio: 1577,
    rendite1J: "+24,50 %",
    rendite2025: "+5,69 %",
    rendite2024: "+11,95 %",
    sparplanBei: ["Smartbroker+", "Scalable PRIME+", "flatex", "comdirect", "Consorsbank", "ING", "finanzen.net zero", "1822direkt", "und 6 weitere"],
    text: [
      "Wenn du nur einen Halal ETF kaufen willst, dann diesen. Er bildet den MSCI World Islamic nach, also den bekannten MSCI World ohne Banken, Versicherungen und alle Firmen, die bei der Shariah-Prüfung durchfallen. Im letzten Jahr lag er bei plus 24,50 Prozent. Er schüttet zweimal im Jahr aus und reinigt die Ausschüttungen seit 2026 selbst im Fonds.",
    ],
    dafuer: ["Eigenes Gremium mit Fatwa und Zertifikat jedes Jahr.", "Sparplan bei 14 Depots, so oft wie bei keinem hier.", "Reinigt seit 2026 selbst im Fonds."],
    dagegen: ["Ausschüttungen legst du selbst wieder an.", "Nicht günstiger als der HSBC World auf Platz 5."],
    schluss:
      "Am besten geeignet für dich, wenn du mit einem einzigen ETF anfangen willst. Der Nachteil: Ausschüttungen legst du selbst wieder an.",
    geprueftText: PANEL_ISHARES,
  },
  {
    platz: 2,
    isin: "IE000UOXRAM8",
    name: "Invesco Dow Jones Islamic Global Developed Markets",
    amBestenFuer: "Gewinne, die im Fonds bleiben",
    satz: "Index von Dow Jones statt MSCI, seit 2022.",
    geprueftKurz: "Amanie Advisors, für 2023",
    groesseMio: 1046,
    rendite1J: "+17,32 %",
    rendite2025: "+5,07 %",
    rendite2024: "+25,68 %",
    sparplanBei: ["Smartbroker+", "flatex", "Consorsbank", "tradegate.direct", "Scalable PRIME+"],
    text: [
      "Er folgt dem Islamic-Index von Dow Jones statt MSCI, darum stecken teils andere Firmen drin als bei Platz 1. Mit 1.046 Mio. € ist er der zweitgrößte Fonds der Liste.",
    ],
    dafuer: ["Keine Ausschüttung, die du selbst anlegen musst.", "Eigenes Zertifikat für genau diesen ETF."],
    dagegen: ["Teuerster passiver Welt-ETF der Liste.", "Jüngstes gefundenes Zertifikat gilt für 2023."],
    schluss:
      "Am besten geeignet für dich, wenn Gewinne im Fonds bleiben sollen. Der Nachteil: Ein Zertifikat nach 2023 fehlt uns.",
    geprueftText:
      "Amanie Advisors hat ein Shariah-Zertifikat für genau diesen ETF ausgestellt, am 15. Oktober 2024 für das Geschäftsjahr 2023. Ein neueres haben wir nicht gefunden.",
  },
  {
    platz: 3,
    isin: "IE00B296QM64",
    name: "iShares MSCI USA Islamic",
    amBestenFuer: "einen Fokus auf die USA",
    satz: "Nur US-Firmen, Gremium wie Platz 1.",
    geprueftKurz: "Gremium bei iShares",
    groesseMio: 609,
    rendite1J: "+28,90 %",
    rendite2025: "+2,89 %",
    rendite2024: "+15,82 %",
    sparplanBei: ["Smartbroker+", "flatex", "1822direkt", "finanzen.net zero", "finvesto", "tradegate.direct", "Scalable PRIME+", "GLS Bank"],
    text: [
      "Er kauft nur Firmen aus den USA, geprüft nach denselben Regeln wie Platz 1. Im letzten Jahr lag er bei plus 28,90 Prozent. Ein Land ist aber ein Klumpen. Läuft es in den USA schlecht, trifft es den ganzen Fonds.",
    ],
    dafuer: ["Gremium mit Fatwa wie Platz 1.", "Sparplan bei 8 Depots belegt."],
    dagegen: ["Nur ein Land.", "Er schüttet aus."],
    schluss:
      "Am besten geeignet für dich, wenn du gezielt auf die USA setzt. Der Nachteil: Alles hängt an einem Land.",
    geprueftText: PANEL_WIE_PLATZ_1,
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
      "Er kauft Firmen aus Schwellenländern wie China und Indien, die Platz 1 nicht drin hat. Die Schwankung ist groß, 2024 lag er bei minus 2,06 Prozent, 2025 bei plus 32,08 Prozent. Darum nimmst du ihn nur als kleinen Teil dazu.",
    ],
    dafuer: ["Gremium mit Fatwa wie Platz 1.", "Sparplan bei 9 Depots belegt."],
    dagegen: ["Starke Schwankung, 2024 im Minus.", "Etwas teurer als Platz 1."],
    schluss:
      "Am besten geeignet für dich, wenn du neben Platz 1 Schwellenländer willst. Der Nachteil: Er schwankt stark.",
    geprueftText: PANEL_WIE_PLATZ_1,
  },
  {
    platz: 5,
    isin: "IE000X9FTI22",
    name: "HSBC MSCI World Islamic Screened",
    amBestenFuer: "eine Einmalanlage ohne Ausschüttung",
    satz: "Kosten wie Platz 1, Gewinne bleiben drin.",
    geprueftKurz: "MSCI, nur der Index",
    groesseMio: 182,
    rendite1J: "+24,51 %",
    rendite2025: "+7,01 %",
    rendite2024: "+12,66 %",
    sparplanBei: [],
    text: [
      "Er kostet so viel wie Platz 1, schüttet aber nicht aus und gibt den unreinen Anteil selbst als Spende weiter. Im letzten Jahr lag er bei plus 24,51 Prozent, praktisch gleichauf. Zwei Haken hat er. Einen Sparplan hat uns kein Anbieter belegt, und der Halal-Beleg betrifft nur den Index.",
    ],
    dafuer: ["Gewinne bleiben im Fonds.", "Reinigt den unreinen Anteil selbst."],
    dagegen: ["Kein Sparplan belegt.", "Halal-Beleg nur für den Index."],
    schluss:
      "Am besten geeignet für dich, wenn du einmal anlegst und nichts ausgeschüttet haben willst. Der Nachteil: Ein Sparplan ist nicht belegt.",
    geprueftText: NUR_INDEX_MSCI,
  },
  {
    platz: 6,
    isin: "IE000LFC57H7",
    name: "Invesco MSCI ACWI Islamic",
    amBestenFuer: "Welt und Schwellenländer in einem ETF",
    satz: "Ein ETF statt zwei, seit Februar 2026.",
    geprueftKurz: "MSCI, nur der Index",
    groesseMio: 129,
    rendite1J: null,
    rendite2025: null,
    rendite2024: null,
    seitAuflage: "+17,62 %",
    sparplanBei: ["Scalable PRIME+"],
    text: [
      "ACWI heißt All Country World. Der ETF nimmt Industrie- und Schwellenländer zusammen, du brauchst also keinen zweiten ETF. Er wurde erst im Februar 2026 aufgelegt und steht seit Auflage bei plus 17,62 Prozent.",
    ],
    dafuer: ["Industrie- und Schwellenländer in einem ETF.", "Gewinne bleiben im Fonds."],
    dagegen: ["Sehr jung, kaum Zahlen.", "Halal-Beleg nur für den Index."],
    schluss:
      "Am besten geeignet für dich, wenn du alles in einem ETF willst. Der Nachteil: Er ist erst seit Februar 2026 am Markt.",
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
      "Dieser ETF ist aktiv. Ein Fondsmanagement wählt die Firmen selbst aus, statt einem Index zu folgen. Das kostet mehr als doppelt so viel wie Platz 1, und mit 19 Mio. € ist er der kleinste Fonds der Liste.",
    ],
    dafuer: ["Frisches Zertifikat für 2025.", "Sparplan bei 8 Depots belegt."],
    dagegen: ["Höchste Kosten der Liste.", "Kleinster Fonds der Liste."],
    schluss:
      "Am besten geeignet für dich, wenn du einem Fondsmanagement mehr traust als einem Index. Der Nachteil: die Kosten.",
    geprueftText:
      "Das Shariah Supervisory Board von Amanie Advisors prüft den Fonds jedes Jahr. Das unterschriebene Zertifikat für das Geschäftsjahr 2025 ist vom 22.05.2026.",
  },
  {
    platz: 8,
    isin: "IE000929U2U9",
    name: "iShares USD Sukuk",
    amBestenFuer: "einen Teil ohne Aktien",
    satz: "Sukuk statt Anleihen, ganz ohne Aktien.",
    geprueftKurz: "Sukuk-Gremium bei iShares",
    groesseMio: 160,
    rendite1J: "+2,52 %",
    rendite2025: "−5,04 %",
    rendite2024: null,
    sparplanBei: ["Scalable", "finanzen.net zero", "tradegate.direct", "Scalable PRIME+"],
    text: [
      "Sukuk sind das islamische Gegenstück zu Anleihen. Statt Zinsen bekommst du einen Anteil an Erträgen aus echten Werten. Der ETF kauft in US-Dollar, darum schwankt sein Wert in Euro mit dem Dollar-Kurs. 2025 lag er bei minus 5,04 Prozent.",
    ],
    dafuer: ["Eigenes Sukuk-Gremium mit Fatwa.", "Ausschüttung jedes Quartal."],
    dagegen: ["Der Dollar-Kurs schwankt mit.", "Teurer als Platz 1."],
    schluss:
      "Am besten geeignet für dich, wenn ein Teil deines Geldes nicht in Aktien liegen soll. Der Nachteil: Der Dollar schwankt mit.",
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

/** Sparplan-Depots ohne Doppelzählung: Scalable PRIME+ ist ein Tarif von Scalable und zählt nur, wenn Scalable selbst fehlt. */
export const sparplanDepots = (e: EtfEintrag) =>
  e.sparplanBei.includes("Scalable") ? e.sparplanBei.filter((s) => s !== "Scalable PRIME+") : e.sparplanBei;

/** Sparplan-Zahl: Liste plus „und n weitere“. */
export const sparplanAnzahl = (e: EtfEintrag) =>
  sparplanDepots(e).reduce((n, s) => {
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
