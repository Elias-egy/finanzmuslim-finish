import { aktien, type Aktie } from "@/data/top100Aktien";

/**
 * Freebie „Halal und boykottfrei“ (RN20, 19.11.2026), das Freebie zum Video „26 boykottfreie Halal-Aktien“ (Vault
 * `data/videoweg/format-bibliothek/skripte/2026-11-19-fb8-05-rf-boykottfreie-aktien.md`). Elias: „eine Liste noch mit boykottfreien
 * Aktien … Halal und boykottfreien Aktien … Und dann auch ein Call to Action für den Freebie da. Für den Funnel mit dem Quiz.“
 *
 * Halal: Aktien aus `top100Aktien.ts` und seit BK6 die Liste NEU; alle 40 am 21.11.2026 je Seite bei Musaffa gelesen (halal).
 * BK6 (21.11.2026): Boykott nach der Nachprüfung BK5 mit strenger Regel, siehe NACHGEPRUEFT, WEITERE und NEU unten.
 * Boykott: Einzelprüfung vom 11.11.2026 (Vault `fundament/research/sources/W-15_screens/2026-11-11-codex-boykott/boykott.json`),
 * aufgenommen ist nur, wer in jedem seiner Einträge (auch Doppeleinträge wie VWS und VWS.CO) „keine“ hat. Die 26 aus dem Video
 * wurden am 19.11.2026 zusätzlich je Name gegen die offizielle BDS-Liste, Who Profits, die UN-Datenbank und AFSC Investigate gelesen.
 */
export { BF_SCHLUESSEL, BF_SLUG, BF_TEASER_PFAD, BF_VOLL_PFAD } from "@/data/boykottfreiPfad";

/** Quelle des Check-Kastens und der Stimmen (`CheckQuelle` in halalFinanzCheck.ts). */
export const BF_QUELLE = "boykottfreie-aktien" as const;

/** Stände, wie sie die Seite nennt. */
export const BF_STAND = {
  halal: "21.11.2026",
  video: "19.11.2026",
  einzel: "11.11.2026",
  nach: "21.11.2026",
  bds: "06.12.2024",
  un: "25.09.2026",
} as const;

export type BfZeile = { name: string; ticker: string; text: string };

/** Die 26 aus dem Video in der Reihenfolge des Videos, dazu die kurze Beschreibung aus dem Skript. */
const VIDEO: readonly [string, string][] = [
  ["ZAL", "Mode online"],
  ["ASML", "Chipmaschinen"],
  ["LLY", "Abnehmspritze"],
  ["LOW", "Baumärkte"],
  ["ADBE", "Photoshop"],
  ["4911", "Kosmetik"],
  ["VWS", "Windräder"],
  ["RBLX", "Gaming"],
  ["HLN", "Sensodyne und Voltaren"],
  ["MU", "Speicherchips"],
  ["6586", "Akkuwerkzeug"],
  ["SYK", "Medizintechnik"],
  ["GRMN", "Sportuhren"],
  ["LIN", "Industriegase"],
  ["ESSITY B", "Tempo und Zewa"],
  ["VRTX", "Mukoviszidose"],
  ["BBY", "Elektronikmarkt"],
  ["LRCX", "Chipfertigung"],
  ["CROX", "Clogs"],
  ["BHP", "Rohstoffe"],
  ["GILD", "HIV-Medikamente"],
  ["CMI", "LKW-Motoren"],
  ["ALC", "Kontaktlinsen"],
  ["ALV", "Airbags"],
  ["TEAM", "Jira und Trello"],
  ["RMD", "Schlaftherapie"],
];

/**
 * BK6 (21.11.2026, Elias BK5-03: „die Freebie-Listen free und Boycott deutlich aktualisieren“): Nachprüfung BK5 mit der strengen
 * Regel (Vault `fundament/research/sources/W-15_screens/2026-11-21-bk5-boykott/BRIEF.md`: eine eigene israelische Tochter mit
 * Beschäftigten ist „leicht“, nicht „keine“). Diese neun aus dem Video haben jetzt einen leichten Befund und stehen nur noch im
 * Abschnitt „Aus dem Video nachgeprüft“. Belege je Firma in tech-neu.json, bekannte-neu.json und korrekturen-bk6.json (Gilead).
 */
export const NACHGEPRUEFT: Readonly<Record<string, string>> = {
  ASML: "eigene Tochter in Israel, 68 Leute",
  LLY: "eigene Tochter in Israel",
  HLN: "eigene Tochter in Israel",
  MU: "Team in Tel Aviv und Haifa",
  SYK: "kaufte 2019 eine Firma in Israel",
  LIN: "eigene Tochter in Israel",
  LRCX: "eigenes Büro in Kiryat Gat",
  ALC: "kaufte 2024 eine Firma in Israel",
  GILD: "eigene Tochter in Israel",
};

/**
 * Die übrigen Aktien der 100 ohne Befund, in der Reihenfolge der Halal-Liste. BK6 raus: Amphenol und Arista (BK5 leicht),
 * Merck & Co. und Waters (eigene Tochter in Israel, nach der strengen Regel leicht, korrekturen-bk6.json).
 * Bewusst nicht dabei: Emerson Electric (israelische Übernahme Spectronix) und Parker-Hannifin (Parker Hannifin Israel Ltd.).
 */
const WEITERE: readonly string[] = ["CHD", "ITW", "AI", "XEL", "WSM", "MCK", "BIIB", "IDXX"];

/**
 * BK6 neu: halal (Musaffa am 21.11.2026 je Seite gelesen, Vault scratchpad-Kopie in korrekturen-bk6.json) und ohne Befund in der
 * Nachprüfung BK5 (tech-neu.json, energie-neu.json, bekannte-neu.json, jede Firma einzeln gesucht). Nicht in den 100 Halal-Aktien,
 * darum mit eigenem Namen und Text. Ferrari fehlt mit Absicht: Musaffa führt Ferrari seit November 2026 als „doubtful“.
 */
const NEU: readonly BfZeile[] = [
  { ticker: "TSM", name: "TSMC", text: "baut die Chips für Apple und Nvidia" },
  { ticker: "VRT", name: "Vertiv", text: "Kühlung für KI-Rechenzentren" },
  { ticker: "CLS", name: "Celestica", text: "baut Server und Netzwerktechnik" },
  { ticker: "SWKS", name: "Skyworks", text: "Funkchips im Handy" },
  { ticker: "MPWR", name: "Monolithic Power", text: "Chips für die Stromversorgung" },
  { ticker: "4063.T", name: "Shin-Etsu", text: "Silizium-Scheiben für Chips" },
  { ticker: "6981.T", name: "Murata", text: "Bauteile in fast jedem Handy" },
  { ticker: "TYL", name: "Tyler Technologies", text: "Software für Behörden" },
  { ticker: "GDDY", name: "GoDaddy", text: "Domains und Webseiten" },
  { ticker: "ENPH", name: "Enphase", text: "Solartechnik fürs Hausdach" },
  { ticker: "BE", name: "Bloom Energy", text: "Brennstoffzellen für Rechenzentren" },
  { ticker: "PRY.MI", name: "Prysmian", text: "Seekabel für Windparks" },
  { ticker: "NESTE.HE", name: "Neste", text: "Biodiesel aus Abfällen" },
  { ticker: "FORTUM.HE", name: "Fortum", text: "Strom aus Wasserkraft" },
  { ticker: "STMN.SW", name: "Straumann", text: "Zahnimplantate" },
];

/**
 * Nie in der Liste (Videoskript, FB8 19.11.2026): Ecolab, AMD, Lululemon, Colgate (Zweifel oder Befund), Tesla (löst Boykott-Streit
 * aus, Regelbuch freebies Nie), Nike und L’Oréal (stehen auf vielen Boykott-Listen im Netz), Monster (Coca-Cola hält rund 16,7 Prozent).
 * BK6 dazu: Amphenol, Arista, Merck & Co., Waters (leicht) und Ferrari (Musaffa „doubtful“).
 */
export const AUSGENOMMEN: readonly string[] = ["ECL", "AMD", "LULU", "CL", "TSLA", "NKE", "OR", "MNST", "EMR", "PH", "APH", "ANET", "MRK", "WAT", "RACE"];

const nachTicker = new Map<string, Aktie>(aktien.map((a) => [a.ticker, a]));
const aktie = (ticker: string): Aktie => {
  const a = nachTicker.get(ticker);
  if (!a) throw new Error(`Aktie ${ticker} fehlt in top100Aktien.ts`);
  return a;
};

export const videoListe: BfZeile[] = VIDEO.filter(([t]) => !(t in NACHGEPRUEFT)).map(([t, text]) => ({ name: aktie(t).name, ticker: t, text }));
export const videoNachgeprueft: BfZeile[] = VIDEO.filter(([t]) => t in NACHGEPRUEFT).map(([t]) => ({
  name: aktie(t).name,
  ticker: t,
  text: NACHGEPRUEFT[t],
}));
export const neuListe: BfZeile[] = [...NEU];
export const weitereListe: BfZeile[] = WEITERE.map((t) => ({ name: aktie(t).name, ticker: t, text: aktie(t).bekanntFuer }));
export const alleBoykottfrei: BfZeile[] = [...videoListe, ...neuListe, ...weitereListe];

/** Wie viele Zeilen die Seite oben zeigt, bevor der Check-Kasten kommt (etwa das erste Drittel der Seite). */
export const VOR_KASTEN = 10;
