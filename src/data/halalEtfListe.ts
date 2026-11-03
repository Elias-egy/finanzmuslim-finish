import { halalAnlagen } from "@/data/halalAnlagen";
import { ANLAGEN_KAUFBAR } from "@/data/anlagenKaufbar";

/**
 * Die Liste „Beste Halal ETFs 2026“ (/blog/halal-etf, SEO24 am 01.11.2026, Umbau SEO30 am 02.11.2026).
 *
 * Rangfolge und Sparplan stammen aus
 * fundament/research/quellen/SEO-GUIDE-Z2aCQ5YKaTU/BESTE-HALAL-ETFS-INHALT.md im Vault,
 * Sparplan nur mit Eigenbeleg des Anbieters (~/rebrand/data/vergleiche/recherche/anlagen.json).
 * Renditen 1, 3 und 5 Jahre: justETF je ISIN, EUR mit Ausschüttungen, per 30.10.2026
 * (raw/2026-11-02-seo29-justetf-rendite-1-3-5-jahre.md). Alle 3-Jahres-Werte liegen ganz nach der
 * Auflage des Fonds, sind also echte Fondszahlen; 5 Jahre nur bei Fonds, die vor Ende Oktober 2021 aufgelegt wurden.
 * Größe wie in `halalAnlagen` (die Laptop-Bilder der Einträge zeigen genau diese Zahl), nicht die neueren justETF-Werte.
 * Kosten, Auflage, Gremium und Beleg-Link kommen aus `halalAnlagen`, damit eine
 * Änderung dort auch hier ankommt. Kaufbar-Zahlen rechnet die Seite aus `ANLAGEN_KAUFBAR`.
 * Die Texte der Einträge stehen wortgleich im Baublatt UMBAU-HALAL-ETF-SEO29-BAUBLATT.md.
 *
 * Halal-Aussagen nur mit Beleg des Anbieters, nie ein eigenes Urteil (~/.claude/CLAUDE.md §5).
 */

export const RENDITE_STAND = "30.10.2026";
export const POSITIONEN_STAND = "03.11.2026";

export type EtfEintrag = {
  platz: number;
  isin: string;
  /** Anzeigename, gleich in Karte, Eintrag und Tabellen. */
  name: string;
  /** Kurzname nur für die H3 des Eintrags, wenn der Name zu lang ist (Elias SEO35: „oben die Abkürzung“); der volle Name steht im Bild und im Link darunter. */
  kurz?: string;
  /** Fondsanbieter und Logo-Datei in /bilder/blog/halal-etf/logos/. */
  anbieter: string;
  logo: string;
  /** Höchstens sechs Wörter, klein geschrieben; wortgleich in Karte, H3 und Tabelle. */
  amBestenFuer: string;
  groesseMio: number;
  /** Zahl der Positionen im Fonds (Aktien, beim Sukuk-ETF Sukuk), justETF am 03.11.2026 (raw/2026-11-03-seo45-justetf-positionen-acht-halal-etfs.md); halalwallet zeigt sie als „Holdings“ (Elias SEO45). */
  positionen: number;
  rendite1J: string | null;
  rendite3J: string | null;
  rendite5J: string | null;
  /** Nur junge Fonds: Rendite seit Auflage. */
  seitAuflage?: string;
  sparplanBei: string[];
  /** Absätze des Eintrags, danach der fette Satz „Passt zu dir, wenn …“. */
  absaetze: string[];
  passt: string;
  dafuer: string[];
  dagegen: string[];
  geprueftText: string;
  /** Quelle für „Geprüft von“, wenn sie nicht `zertifikatLink` in `halalAnlagen` ist (HSBC: Factsheet, SEO45). */
  pruefLink?: string;
};

const PANEL_ISHARES =
  "Laut Verkaufsprospekt von iShares II plc hat dieser Fonds ein eigenes Gremium, das Shari'ah Equity Funds Panel mit Dr. Mohamed Elgari, Scheich Nizam Yaquby und Dr. Mohd Daud Bakar. Es hat eine Fatwa erteilt und soll jedes Jahr ein Zertifikat ausstellen.";

const PANEL_WIE_PLATZ_1 =
  "Laut Verkaufsprospekt von iShares II plc prüft ihn dasselbe Gremium wie Platz 1, das Shari'ah Equity Funds Panel. Es hat eine Fatwa erteilt und soll jedes Jahr ein Zertifikat ausstellen.";

const AUSSCHUSS_HSBC =
  "Laut Factsheet von HSBC (30.09.2026) überwacht ein Shariah-Ausschuss den Fonds regelmäßig und stellt jedes Jahr ein Shariah-Zertifikat für den Fonds aus. Die Methodik des Index hat MSCI von einem Ausschuss islamischer Gelehrter freigeben lassen.";

const NUR_INDEX_MSCI =
  "Das Zertifikat gilt für den Index, dem der Fonds folgt: MSCI lässt die Methodik seiner Islamic-Indizes von einem Ausschuss islamischer Gelehrter freigeben.";

export const etfListe: EtfEintrag[] = [
  {
    platz: 1,
    isin: "IE00B27YCN58",
    name: "iShares MSCI World Islamic",
    anbieter: "iShares",
    logo: "ishares",
    amBestenFuer: "den Einstieg mit einem ETF",
    groesseMio: 1577,
    positionen: 386,
    rendite1J: "+24,42 %",
    rendite3J: "+62,30 %",
    rendite5J: "+75,47 %",
    sparplanBei: ["Smartbroker+", "Scalable PRIME+", "flatex", "comdirect", "Consorsbank", "ING", "finanzen.net zero", "1822direkt", "und 6 weitere"],
    absaetze: [
      "Der iShares MSCI World Islamic ist der bekannteste Halal ETF in Deutschland. Er bildet den MSCI World Islamic nach: die großen Firmen aus Industrieländern, ohne Banken, Versicherungen und alles, was bei der Shariah-Prüfung durchfällt.",
      "Er ist seit Dezember 2007 am Markt und mit 1.577 Mio. € der größte Fonds dieser Liste. Ein so alter Fonds hat echte Zahlen aus fast zwei Jahrzehnten, auch aus schlechten Jahren.",
      "Laut Verkaufsprospekt prüft ihn ein eigenes Gremium bei iShares, das eine Fatwa erteilt hat. Den kleinen unreinen Anteil der Erträge spendet der Fonds selbst.",
      "Er kostet 0,30 % im Jahr, bei 10.000 € also 30 €. Einen Sparplan darauf bieten 14 Depots, so viele wie bei keinem anderen ETF hier. Kaufen kannst du ihn bei 27 Depots.",
      "Er schüttet zweimal im Jahr aus, das Geld legst du selbst wieder an. Schwellenländer wie China oder Indien sind nicht drin.",
    ],
    passt: "du mit einem einzigen ETF anfangen willst",
    dafuer: ["Eigenes Gremium mit Fatwa.", "Sparplan bei 14 Depots, so oft wie bei keinem hier.", "Spendet den unreinen Anteil selbst."],
    dagegen: ["Ausschüttungen legst du selbst wieder an.", "Keine Schwellenländer drin."],
    geprueftText: PANEL_ISHARES,
  },
  {
    platz: 2,
    isin: "IE000UOXRAM8",
    name: "Invesco Dow Jones Islamic Global Developed Markets",
    kurz: "Invesco Dow Jones Islamic",
    anbieter: "Invesco",
    logo: "invesco",
    amBestenFuer: "Gewinne, die im Fonds bleiben",
    groesseMio: 1046,
    positionen: 1186,
    rendite1J: "+16,98 %",
    rendite3J: "+74,34 %",
    rendite5J: null,
    sparplanBei: ["Smartbroker+", "flatex", "Consorsbank", "tradegate.direct", "Scalable PRIME+"],
    absaetze: [
      "Er folgt dem Islamic-Index von Dow Jones statt MSCI. Darum stecken teils andere Firmen drin als bei Platz 1, die Idee ist dieselbe: Industrieländer, geprüft nach islamischen Regeln.",
      "Er schüttet nicht aus. Gewinne bleiben im Fonds und arbeiten weiter, du musst nichts selbst neu anlegen.",
      "Mit 1.046 Mio. € ist er der zweitgrößte Fonds der Liste, am Markt seit Januar 2022. Er kostet 0,40 % im Jahr, also 40 € bei 10.000 €, mehr als jeder andere passive Aktien-ETF hier.",
      "Sein Shariah-Zertifikat kommt von Amanie Advisors und gilt für genau diesen ETF, zuletzt für das Geschäftsjahr 2023.",
      "Einen Sparplan bieten 5 Depots, kaufen kannst du ihn bei 17.",
    ],
    passt: "Gewinne im Fonds bleiben sollen",
    dafuer: ["Keine Ausschüttung, die du selbst anlegen musst.", "Eigenes Zertifikat für genau diesen ETF."],
    dagegen: ["Teuerster passiver Aktien-ETF der Liste.", "Letztes Zertifikat gilt für 2023."],
    geprueftText:
      "Amanie Advisors hat ein Shariah-Zertifikat für genau diesen ETF ausgestellt, am 15. Oktober 2024 für das Geschäftsjahr 2023.",
  },
  {
    platz: 3,
    isin: "IE00B296QM64",
    name: "iShares MSCI USA Islamic",
    anbieter: "iShares",
    logo: "ishares",
    amBestenFuer: "einen Fokus auf die USA",
    groesseMio: 609,
    positionen: 140,
    rendite1J: "+28,67 %",
    rendite3J: "+69,45 %",
    rendite5J: "+89,56 %",
    sparplanBei: ["Smartbroker+", "flatex", "1822direkt", "finanzen.net zero", "finvesto", "tradegate.direct", "Scalable PRIME+", "GLS Bank"],
    absaetze: [
      "Er kauft nur Firmen aus den USA, geprüft nach denselben Regeln wie Platz 1. Dasselbe Gremium bei iShares hat laut Verkaufsprospekt eine Fatwa erteilt.",
      "Seit Dezember 2007 am Markt, 609 Mio. € groß, 0,30 % Kosten im Jahr.",
      "Einen Sparplan bieten 8 Depots, kaufen kannst du ihn bei 24. Er schüttet aus, das Geld legst du selbst wieder an.",
      "Alles steckt in einem Land. Läuft es in den USA schlecht, trifft es den ganzen Fonds, und kein anderes Land fängt das auf.",
    ],
    passt: "du gezielt auf die USA setzen willst",
    dafuer: ["Gremium mit Fatwa wie Platz 1.", "Sparplan bei 8 Depots."],
    dagegen: ["Nur ein Land.", "Er schüttet aus."],
    geprueftText: PANEL_WIE_PLATZ_1,
  },
  {
    platz: 4,
    isin: "IE00B27YCP72",
    name: "iShares MSCI Emerging Markets Islamic",
    anbieter: "iShares",
    logo: "ishares",
    amBestenFuer: "Schwellenländer als Beimischung",
    groesseMio: 700,
    positionen: 398,
    rendite1J: "+40,88 %",
    rendite3J: "+94,87 %",
    rendite5J: "+68,76 %",
    sparplanBei: ["Smartbroker+", "flatex", "1822direkt", "Consorsbank", "finanzen.net zero", "finvesto", "tradegate.direct", "Scalable PRIME+", "GLS Bank"],
    absaetze: [
      "Er kauft Firmen aus Schwellenländern wie China und Indien, die in Platz 1 fehlen. Geprüft wird er vom selben Gremium bei iShares wie Platz 1.",
      "Die Schwankung ist groß. 2024 lag er bei minus 2,06 %, 2025 bei plus 32,08 %. Darum steht er hier als Beimischung neben einem Welt-ETF, nicht als einziger ETF.",
      "Seit Dezember 2007 am Markt, 700 Mio. € groß, 0,35 % Kosten im Jahr. Einen Sparplan bieten 9 Depots, kaufen kannst du ihn bei 23.",
      "Er schüttet aus, und allein deckt er nur einen Teil der Welt ab.",
    ],
    passt: "du neben Platz 1 einen kleinen Teil Schwellenländer willst",
    dafuer: ["Gremium mit Fatwa wie Platz 1.", "Sparplan bei 9 Depots."],
    dagegen: ["Starke Schwankung, 2024 im Minus.", "Etwas teurer als Platz 1."],
    geprueftText: PANEL_WIE_PLATZ_1,
  },
  {
    platz: 5,
    isin: "IE000X9FTI22",
    name: "HSBC MSCI World Islamic Screened",
    anbieter: "HSBC",
    logo: "hsbc",
    amBestenFuer: "eine Einmalanlage ohne Ausschüttung",
    groesseMio: 182,
    positionen: 324,
    rendite1J: "+24,51 %",
    rendite3J: "+69,04 %",
    rendite5J: null,
    sparplanBei: [],
    absaetze: [
      "Er folgt dem MSCI World Islamic Screened, also ebenfalls Firmen aus Industrieländern nach islamischen Regeln, und kostet 0,30 % im Jahr, so viel wie Platz 1.",
      "Anders als Platz 1 schüttet er nicht aus, Gewinne bleiben im Fonds.",
      "Laut Factsheet von HSBC prüft ein Shariah-Ausschuss den Fonds regelmäßig und stellt jedes Jahr ein Zertifikat aus.",
      "Seit November 2022 am Markt, 182 Mio. € groß, kaufbar bei 9 Depots.",
    ],
    passt: "du einmal anlegst und nichts ausgeschüttet haben willst",
    dafuer: ["Gewinne bleiben im Fonds.", "Shariah-Ausschuss prüft den Fonds selbst."],
    dagegen: ["Nur als Einmalkauf, nicht als Sparplan."],
    geprueftText: AUSSCHUSS_HSBC,
    pruefLink: "https://www.assetmanagement.hsbc.co.uk/api/v1/download/document/ie000x9fti22/gb/en/factsheet",
  },
  {
    platz: 6,
    isin: "IE000LFC57H7",
    name: "Invesco MSCI ACWI Islamic",
    anbieter: "Invesco",
    logo: "invesco",
    amBestenFuer: "Welt und Schwellenländer in einem ETF",
    groesseMio: 129,
    positionen: 463,
    rendite1J: null,
    rendite3J: null,
    rendite5J: null,
    seitAuflage: "+17,62 %",
    sparplanBei: ["Scalable PRIME+"],
    absaetze: [
      "ACWI heißt All Country World. Der ETF nimmt Industrie- und Schwellenländer zusammen, du brauchst also keinen zweiten ETF dafür.",
      "Er ist der jüngste der Liste, aufgelegt im Februar 2026. Seitdem steht er bei plus 17,62 %, für 1, 3 oder 5 Jahre gibt es noch keine Zahlen.",
      "Er kostet 0,35 % im Jahr und schüttet nicht aus. Sein Zertifikat gilt für den Index, dem er folgt.",
      "Kaufen kannst du ihn bei 11 Depots.",
    ],
    passt: "du die ganze Welt in einem ETF willst und mit wenig Geschichte leben kannst",
    dafuer: ["Industrie- und Schwellenländer in einem ETF.", "Gewinne bleiben im Fonds."],
    dagegen: ["Sehr jung, kaum Zahlen."],
    geprueftText: NUR_INDEX_MSCI,
  },
  {
    platz: 7,
    isin: "IE00BMYMHS24",
    name: "HANetf Saturna Al-Kawthar Global Focused Equity",
    kurz: "Saturna Al-Kawthar",
    anbieter: "HANetf",
    logo: "hanetf",
    amBestenFuer: "aktive Auswahl statt Index",
    groesseMio: 19,
    positionen: 39,
    rendite1J: "+8,13 %",
    rendite3J: "+57,27 %",
    rendite5J: "+39,89 %",
    sparplanBei: ["flatex", "1822direkt", "comdirect", "finanzen.net zero", "tradegate.direct", "Scalable PRIME+", "comdirect Pure", "Targobank"],
    absaetze: [
      "Dieser ETF ist aktiv. Ein Fondsmanagement wählt die Firmen selbst aus, statt einem Index zu folgen.",
      "Das hat seinen Preis: 0,75 % im Jahr, mehr als doppelt so viel wie Platz 1. Mit 19 Mio. € ist er außerdem der kleinste Fonds der Liste.",
      "Sein Zertifikat ist frisch. Das Shariah Supervisory Board von Amanie Advisors hat ihn für 2025 geprüft, das Zertifikat ist vom 22.05.2026.",
      "Am Markt seit September 2020. Einen Sparplan bieten 8 Depots, kaufen kannst du ihn bei 18.",
    ],
    passt: "du einem Fondsmanagement mehr vertraust als einem Index",
    dafuer: ["Frisches Zertifikat für 2025.", "Sparplan bei 8 Depots."],
    dagegen: ["Höchste Kosten der Liste.", "Kleinster Fonds der Liste."],
    geprueftText:
      "Das Shariah Supervisory Board von Amanie Advisors hat den Fonds für das Geschäftsjahr 2025 geprüft. Das unterschriebene Zertifikat ist vom 22.05.2026.",
  },
  {
    platz: 8,
    isin: "IE000929U2U9",
    name: "iShares USD Sukuk",
    anbieter: "iShares",
    logo: "ishares",
    amBestenFuer: "einen Teil ohne Aktien",
    groesseMio: 160,
    positionen: 223,
    rendite1J: "+1,62 %",
    rendite3J: null,
    rendite5J: null,
    sparplanBei: ["Scalable", "finanzen.net zero", "tradegate.direct", "Scalable PRIME+"],
    absaetze: [
      "Sukuk sind das islamische Gegenstück zu Anleihen. Statt Zinsen bekommst du einen Anteil an Erträgen aus echten Werten.",
      "Der ETF kauft in US-Dollar. Darum schwankt sein Wert in Euro mit dem Dollarkurs, 2025 lag er bei minus 5,04 %.",
      "Laut Verkaufsprospekt hat er ein eigenes Sukuk-Gremium, besetzt mit dem Shariah-Board von Amanie Advisors, das eine Fatwa erteilt hat. Er schüttet jedes Quartal aus.",
      "Seit Januar 2024 am Markt, 160 Mio. € groß, 0,40 % Kosten im Jahr. Einen Sparplan bieten 3 Depots, kaufen kannst du ihn bei 19.",
    ],
    passt: "ein Teil deines Geldes nicht in Aktien liegen soll",
    dafuer: ["Eigenes Sukuk-Gremium mit Fatwa.", "Zahlt dir jedes Quartal Erträge aus."],
    dagegen: ["Der Dollarkurs schwankt mit.", "Teurer als Platz 1."],
    geprueftText:
      "Laut Verkaufsprospekt von iShares II plc hat dieser Fonds ein eigenes Sukuk Fund Panel, besetzt mit dem Shariah-Board von Amanie Advisors. Es hat eine Fatwa erteilt und soll jedes Jahr ein Zertifikat ausstellen.",
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
/** Tarife einer App zählen als ein Depot (Bux Basic, Plus, Prime gehören zu Bux; Beleg gilt für BUX insgesamt). */
const depotName = (anbieter: string) => (anbieter.startsWith("Bux") ? "Bux" : anbieter);

export const kaufbarBei = (isin: string) => [
  ...new Set((ANLAGEN_KAUFBAR[isin]?.kaufbar ?? []).map((k) => depotName(k.anbieter))),
];

/** Wie viele ETFs der Liste ein Anbieter führt (Name wie in ANLAGEN_KAUFBAR). */
export const etfsBei = (anbieter: string) => etfListe.filter((e) => kaufbarBei(e.isin).includes(anbieter)).length;

/** Alle Depots, bei denen für mindestens einen ETF der Liste nachgesehen wurde. */
export const gepruefteDepots = () => {
  const alle = new Set<string>();
  for (const e of etfListe) {
    const k = ANLAGEN_KAUFBAR[e.isin];
    k?.kaufbar.forEach((x) => alle.add(depotName(x.anbieter)));
    k?.nichtImAngebot.forEach((x) => alle.add(depotName(x)));
  }
  return alle.size;
};

export const kaufbarStand = () => ANLAGEN_KAUFBAR[etfListe[0].isin]?.stand ?? "";

export const anker = (e: EtfEintrag) => anlageVon(e.isin).slug;
