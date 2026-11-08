/**
 * Der persönliche Halal-Portfolioplan für schon Investierte: die Belohnung auf FERTIG (CV26P, 08.11.2026).
 *
 * Wer bei einem Depot eröffnet und FERTIG mit Screenshot schickt, bekommt den Link hierher statt des XXL-Guides
 * (Elias, CV25V: „dieses XXL-Guide … musst du auch alles wegmachen … der Portfolioplan wird ein ganz anderer“;
 * Vault raw/2026-11-08-elias-cv25v-tp-urteil-captions-link-sync-punkte.md). Sechs Fragen wie ein Onboarding, daneben
 * füllt sich der Plan (Elias, CV26P: raw/2026-11-08-elias-cv26p-quiz-wie-onboarding-plan-fuellt-sich.md), danach der
 * Plan in Euro mit Anlagen, die bei seinem Broker mit Einzelbeleg kaufbar sind, eine PDF und zuletzt das Girokonto
 * (Elias, CV23S: raw/2026-11-08-elias-cv23s-blueprint-cross-selling-girokonto.md).
 *
 * Die Aufteilung ist ein Beispiel, keine Empfehlung: Grundlage sind die drei Lagen des Portfolio-Plans
 * (src/data/portfolioPlan.ts, dort die Herkunft der Prozente), angepasst nur nach dem, was der Leser wählt.
 * Halal-Aussagen kommen nur aus der Datenbank (halalAnlagen.ts, je Anlage Zertifikat mit Link).
 */
import { ANLAGEN_KAUFBAR } from "@/data/anlagenKaufbar";
import { brokerVergleich } from "@/data/brokerVergleich";
import { halalAnlagen, type Anlage } from "@/data/halalAnlagen";
import { lagen, type BausteinId, type LageId } from "@/data/portfolioPlan";
import { ROYAL_MINT } from "@/data/royalMint";
import kurse from "@/data/kurse.json";

export { QUIZ_PFAD, QUIZ_SCHLUESSEL } from "@/data/portfolioQuizPfad";

export type BrokerWahl = "traders-place" | "smartbroker" | "flatex" | "anderer";
export type Gekauft = "etf" | "anderes" | "nichts";
export type Weise = "monatlich" | "einmal";
export type Wert = "gold" | "ruhig" | "aktien" | "krypto";

export type Antworten = {
  broker?: BrokerWahl;
  gekauft?: Gekauft;
  weise?: Weise;
  betrag?: number;
  lage?: LageId;
  werte?: Wert[];
};

export type FrageId = keyof Antworten;

export type Wahl<T> = { id: T; titel: string; unter?: string; logo?: string };

export const BROKER: Wahl<BrokerWahl>[] = [
  { id: "traders-place", titel: "Traders Place", logo: "/bilder/logos/traders-place-wortmarke.svg" },
  { id: "smartbroker", titel: "Smartbroker+", logo: "/bilder/logos/smartbroker-plus-wortmarke.svg" },
  { id: "flatex", titel: "flatex", logo: "/bilder/logos/flatex-wortmarke.svg" },
  { id: "anderer", titel: "Ein anderes Depot" },
];

/** Vergleichs-Id je Broker, daraus das Haus für die Kaufbarkeit (dieselbe Prüfung wie auf den Depot-Unterseiten). */
export const BROKER_VERGLEICH: Record<Exclude<BrokerWahl, "anderer">, string> = {
  "traders-place": "traders-place-depot",
  smartbroker: "smartbroker-plus-depot",
  flatex: "flatex-depot",
};

export const GEKAUFT: Wahl<Gekauft>[] = [
  { id: "etf", titel: "Einen Islamic ETF", unter: "zum Beispiel MSCI World Islamic" },
  { id: "anderes", titel: "Etwas anderes", unter: "Gold, Sukuk oder Aktien" },
  { id: "nichts", titel: "Noch nichts", unter: "das Depot ist frisch" },
];

export const WEISE: Wahl<Weise>[] = [
  { id: "monatlich", titel: "Jeden Monat", unter: "mit einem Sparplan" },
  { id: "einmal", titel: "Einmal", unter: "einen Betrag, der schon da ist" },
];

export const BETRAEGE: Record<Weise, number[]> = {
  monatlich: [25, 50, 100, 250, 500],
  einmal: [500, 1000, 5000, 10000],
};

export const LAGEN: Wahl<LageId>[] = lagen.map((l) => ({
  id: l.id,
  titel: l.wann,
  unter: { bald: "Auto, Hochzeit, Umzug", mittel: "Ich weiß es noch nicht", lang: "Vermögen für später" }[l.id],
}));

export const WERTE: Wahl<Wert>[] = [
  { id: "gold", titel: "Gold zum Anfassen", unter: "Barren, die du dir liefern lassen kannst" },
  { id: "ruhig", titel: "Wenig Schwankung", unter: "lieber ruhig als schnell" },
  { id: "aktien", titel: "Einzelaktien", unter: "Firmen, die ich selbst aussuche" },
  { id: "krypto", titel: "Krypto", unter: "ein kleiner Teil, freiwillig" },
];

export type Frage = { id: FrageId; titel: string; kurz: string; mehrere?: boolean };

/** Die sechs Fragen (Elias, CV26P: „die Quizfragen kannst du 6 machen … Die Fragen passen“). */
export const FRAGEN: Frage[] = [
  { id: "broker", titel: "Wo hast du dein Depot?", kurz: "Depot" },
  { id: "gekauft", titel: "Was hast du schon gekauft?", kurz: "Gekauft" },
  { id: "weise", titel: "Wie willst du anlegen?", kurz: "Art" },
  { id: "betrag", titel: "Mit wie viel?", kurz: "Betrag" },
  { id: "lage", titel: "Wann brauchst du das Geld?", kurz: "Zeit" },
  { id: "werte", titel: "Worauf legst du Wert?", kurz: "Wichtig", mehrere: true },
];

export const beantwortet = (a: Antworten, id: FrageId): boolean =>
  id === "werte" ? a.werte !== undefined : a[id] !== undefined;

export const fortschritt = (a: Antworten): number =>
  Math.round((FRAGEN.filter((f) => beantwortet(a, f.id)).length / FRAGEN.length) * 100);

export const euroText = (n: number) => `${n.toLocaleString("de-DE")} €`;

export const antwortText = (a: Antworten, id: FrageId): string => {
  switch (id) {
    case "broker":
      return BROKER.find((b) => b.id === a.broker)?.titel ?? "";
    case "gekauft":
      return GEKAUFT.find((g) => g.id === a.gekauft)?.titel ?? "";
    case "weise":
      return WEISE.find((w) => w.id === a.weise)?.titel ?? "";
    case "betrag":
      return a.betrag ? `${euroText(a.betrag)}${a.weise === "monatlich" ? " im Monat" : ""}` : "";
    case "lage":
      return LAGEN.find((l) => l.id === a.lage)?.titel ?? "";
    case "werte":
      return a.werte?.length ? WERTE.filter((w) => a.werte!.includes(w.id)).map((w) => w.titel).join(", ") : "Nichts davon";
  }
};

// --- Der Plan -------------------------------------------------------------------------------------------------

export type Anteil = { baustein: BausteinId; prozent: number };

const verschiebe = (anteile: Anteil[], von: BausteinId, nach: BausteinId, prozent: number) => {
  const quelle = anteile.find((x) => x.baustein === von);
  if (!quelle || quelle.prozent <= 0) return;
  const p = Math.min(prozent, quelle.prozent);
  quelle.prozent -= p;
  const ziel = anteile.find((x) => x.baustein === nach);
  if (ziel) ziel.prozent += p;
  else anteile.push({ baustein: nach, prozent: p });
};

/** Größter Wachstumsbaustein, aus dem eine Wahl ihren Teil nimmt: ETF, sonst Sukuk, sonst das Girokonto. */
const groesster = (anteile: Anteil[]): BausteinId =>
  (["etf", "sukuk", "konto"] as BausteinId[]).find((b) => anteile.some((x) => x.baustein === b && x.prozent >= 10)) ??
  "etf";

/**
 * Aufteilung als Beispiel: die Lage aus dem Portfolio-Plan, dann je Wahl eine kleine Verschiebung. Einzelaktien und
 * Krypto nur, wenn er sie wählt, zusammen höchstens 15 % (SPIELRAUM im Portfolio-Plan), und nie bei Geld für in einem
 * Jahr; wer sie nicht will, bekommt ihren Teil im ETF („Willst du das Risiko nicht? Dann ergänz einfach mit Gold oder
 * ETF“, Portfolio-Plan).
 */
export const aufteilung = (a: Antworten): Anteil[] => {
  const lage = lagen.find((l) => l.id === (a.lage ?? "mittel"))!;
  const anteile: Anteil[] = lage.anteile.map((x) => ({ ...x }));
  const werte = a.werte ?? [];
  for (const b of ["aktien", "krypto"] as const) {
    if (!werte.includes(b)) verschiebe(anteile, b, "etf", 100);
  }
  if (lage.id !== "bald") {
    if (werte.includes("aktien") && !anteile.some((x) => x.baustein === "aktien" && x.prozent > 0))
      verschiebe(anteile, "etf", "aktien", 10);
    if (werte.includes("krypto") && !anteile.some((x) => x.baustein === "krypto" && x.prozent > 0))
      verschiebe(anteile, "etf", "krypto", 5);
  }
  if (werte.includes("gold")) verschiebe(anteile, groesster(anteile), "gold", 10);
  if (werte.includes("ruhig") && lage.id !== "bald") verschiebe(anteile, "etf", "sukuk", 10);
  return anteile.filter((x) => x.prozent > 0).sort((x, y) => y.prozent - x.prozent);
};

/** Euro je Baustein, gerundet; der Rest der Rundung geht an den größten, damit die Summe stimmt. */
export const inEuro = (anteile: Anteil[], betrag: number): number[] => {
  const roh = anteile.map((x) => Math.round((betrag * x.prozent) / 100));
  const rest = betrag - roh.reduce((s, n) => s + n, 0);
  if (roh.length) roh[0] += rest;
  return roh;
};

/**
 * Kandidaten je Baustein, in dieser Reihenfolge: der erste, der beim Broker mit Einzelbeleg kaufbar ist, kommt in den
 * Plan. Gold: Royal Mint zuerst, wenn er Gold zum Anfassen will (auslieferbar, Elias 04.11.: Royal Mint ist Nummer 1
 * bei Edelmetallen, memory royal-mint-gold-etc-nummer-eins-edelmetalle), sonst ebenfalls zuerst Royal Mint, dann Invesco.
 */
const KANDIDATEN: Partial<Record<BausteinId, string[]>> = {
  etf: ["IE00B27YCN58", "IE000X9FTI22", "IE000LFC57H7", "IE000UOXRAM8"],
  sukuk: ["IE000929U2U9", "LU3123443510"],
  gold: [ROYAL_MINT, "IE00B579F325"],
};

export const hausVon = (broker?: BrokerWahl): string | undefined =>
  broker && broker !== "anderer" ? brokerVergleich.find((b) => b.id === BROKER_VERGLEICH[broker])?.haus : undefined;

export const kaufbarBei = (isin: string, haus?: string): boolean =>
  !haus || Boolean(ANLAGEN_KAUFBAR[isin]?.kaufbar.some((k) => k.haus === haus));

export type Produkt = { anlage: Anlage; r1?: number; r5?: number };

type Kurs = { r1j?: number | null; r5j?: number | null };
const KURSE = (kurse as unknown as { anlagen: Record<string, Kurs> }).anlagen;

export const produktFuer = (baustein: BausteinId, broker?: BrokerWahl): Produkt | undefined => {
  const haus = hausVon(broker);
  const isin = KANDIDATEN[baustein]?.find((i) => halalAnlagen.some((x) => x.isin === i) && kaufbarBei(i, haus));
  const anlage = isin ? halalAnlagen.find((x) => x.isin === isin) : undefined;
  if (!anlage) return undefined;
  const k = KURSE[anlage.isin!];
  // Fehlt eine Reihe (Fonds jünger als fünf Jahre), steht null in kurse.json: dann keine Zahl.
  return { anlage, r1: k?.r1j ?? undefined, r5: k?.r5j ?? undefined };
};

/** Beispiele ohne eigenes Produkt im Plan, wie im Portfolio-Plan (dort die Herkunft). */
export const BEISPIEL: Partial<Record<BausteinId, string>> = {
  aktien: "zum Beispiel Adobe, Novo Nordisk",
  krypto: "zum Beispiel Bitcoin, über eine Krypto-Börse",
  konto: "bleibt griffbereit, ohne Zinsen",
};

export const prozentText = (n: number) => `${n > 0 ? "+" : ""}${n.toLocaleString("de-DE", { maximumFractionDigits: 1 })} %`;
