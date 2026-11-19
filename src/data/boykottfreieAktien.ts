import { aktien, PRUEFSTAND, type Aktie } from "@/data/top100Aktien";

/**
 * Freebie „Halal und boykottfrei“ (RN20, 19.11.2026), das Freebie zum Video „26 boykottfreie Halal-Aktien“ (Vault
 * `data/videoweg/format-bibliothek/skripte/2026-11-19-fb8-05-rf-boykottfreie-aktien.md`). Elias: „eine Liste noch mit boykottfreien
 * Aktien … Halal und boykottfreien Aktien … Und dann auch ein Call to Action für den Freebie da. Für den Funnel mit dem Quiz.“
 *
 * Halal: nur Aktien aus `top100Aktien.ts` (jede einzeln bei Musaffa geprüft, Stand `PRUEFSTAND`).
 * Boykott: Einzelprüfung vom 11.11.2026 (Vault `fundament/research/sources/W-15_screens/2026-11-11-codex-boykott/boykott.json`),
 * aufgenommen ist nur, wer in jedem seiner Einträge (auch Doppeleinträge wie VWS und VWS.CO) „keine“ hat. Die 26 aus dem Video
 * wurden am 19.11.2026 zusätzlich je Name gegen die offizielle BDS-Liste, Who Profits, die UN-Datenbank und AFSC Investigate gelesen.
 */
export { BF_SCHLUESSEL, BF_SLUG, BF_TEASER_PFAD, BF_VOLL_PFAD } from "@/data/boykottfreiPfad";

/** Quelle des Check-Kastens und der Stimmen (`CheckQuelle` in halalFinanzCheck.ts). */
export const BF_QUELLE = "boykottfreie-aktien" as const;

/** Stände, wie sie die Seite nennt. */
export const BF_STAND = {
  halal: PRUEFSTAND,
  video: "19.11.2026",
  einzel: "11.11.2026",
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
 * Die übrigen Aktien der 100 ohne Befund in jedem Eintrag der Einzelprüfung, in der Reihenfolge der Halal-Liste.
 * Bewusst nicht dabei: Emerson Electric (israelische Übernahme Spectronix) und Parker-Hannifin (Aktivistenquellen, nicht belegt),
 * beide vergleichbar mit den Zweifelsfällen AMD und Ecolab, die Elias aus dem Video genommen hat.
 */
const WEITERE: readonly string[] = ["MRK", "CHD", "ITW", "AI", "APH", "WAT", "XEL", "WSM", "ANET", "MCK", "BIIB", "IDXX"];

/**
 * Nie in der Liste (Videoskript, FB8 19.11.2026): Ecolab, AMD, Lululemon, Colgate (Zweifel oder Befund), Tesla (löst Boykott-Streit
 * aus, Regelbuch freebies Nie), Nike und L’Oréal (stehen auf vielen Boykott-Listen im Netz), Monster (Coca-Cola hält rund 16,7 Prozent).
 */
export const AUSGENOMMEN: readonly string[] = ["ECL", "AMD", "LULU", "CL", "TSLA", "NKE", "OR", "MNST", "EMR", "PH"];

const nachTicker = new Map<string, Aktie>(aktien.map((a) => [a.ticker, a]));
const aktie = (ticker: string): Aktie => {
  const a = nachTicker.get(ticker);
  if (!a) throw new Error(`Aktie ${ticker} fehlt in top100Aktien.ts`);
  return a;
};

export const videoListe: BfZeile[] = VIDEO.map(([t, text]) => ({ name: aktie(t).name, ticker: t, text }));
export const weitereListe: BfZeile[] = WEITERE.map((t) => ({ name: aktie(t).name, ticker: t, text: aktie(t).bekanntFuer }));
export const alleBoykottfrei: BfZeile[] = [...videoListe, ...weitereListe];

/** Wie viele Zeilen die Seite oben zeigt, bevor der Check-Kasten kommt (etwa das erste Drittel der Seite). */
export const VOR_KASTEN = 10;
