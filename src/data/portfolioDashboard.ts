/**
 * Das Dashboard hinter dem Onboarding: Anlegertyp, Risikobereitschaft, Richtung ohne Prozentzahlen, Investmentstile,
 * Zahlen aus der Datenbank (CV27P, 09.11.2026).
 *
 * Elias, 09.11.2026 (Vault raw/2026-11-09-elias-cv26p-ultra-freebie-dashboard-onboarding-luxus.md): „dann kriegen die
 * Anleger so einen Namen … du kannst auch die Verteilung ändern und dann bist du ein anderer Typ. Und dann kriegst du
 * andere Vorschläge … Nie komplette Prozentzahlen und so geben. Das ist uns verboten wegen Anlageberatung … immer
 * Investmentstil aus denen du wählen kannst. Und dann kommst du halt immer, wenn du die anklickst, auf meine Datenbank“.
 * Und (raw/2026-11-09-elias-cv27p-dashboard-plan-nacht-onboarding-fakten-pdf-jarvis.md): „Risikoaffinität, so und so
 * viel Prozent … suchst du ein paar geile Namen raus … die Fakten rausholen, die wichtig sind“.
 *
 * Darum: Die Aufteilung bleibt intern in Prozent (so rechnet alles weiter), nach außen gibt es nur ein Wort je
 * Baustein (Schwerpunkt, Beimischung, kleiner Teil, griffbereit) und ein Euro-Beispiel. Halal-Aussagen kommen nur aus
 * der Datenbank (halalAnlagen.ts), Kaufbarkeit nur mit Einzelbeleg (anlagenKaufbar.ts).
 *
 * Seit CV28P (09.11.2026) stehen Prozente je Baustein am Ring, nie an einer Anlage (Elias, Vault
 * raw/2026-11-09-elias-cv27p-prozente-nur-grundbereiche-usa-gold-favorit-steuer.md: „Prozente sind vielleicht okay, aber
 * nur für grundlegende Bereiche … niemals eine einzige Anlage“; memory prozente-nur-je-baustein-gold-ausnahme-royal-mint).
 * Je Baustein zeigt das Dashboard alle Anlagen des gewählten Stils, die beim Depot kaufbar sind („Du wolltest USA. Das
 * geht bei Traders Place“), Gold mit Royal Mint als Favorit.
 */
import { ANLAGEN_KAUFBAR } from "@/data/anlagenKaufbar";
import { halalAnlagen, type Anlage } from "@/data/halalAnlagen";
import { bausteinById, SPIELRAUM, type BausteinId } from "@/data/portfolioPlan";
import { ROYAL_MINT } from "@/data/royalMint";
import {
  hausVon,
  kaufbarBei,
  regionTitel,
  type Anteil,
  type Antworten,
  type BrokerWahl,
  type Produkt,
  type Region,
} from "@/data/portfolioQuiz";
import kurse from "@/data/kurse.json";

// --- Anlegertyp ----------------------------------------------------------------------------------------------------

export type TypId = "planer" | "fels" | "gelassene" | "baumeister" | "entdecker" | "pionier";

export type Typ = {
  id: TypId;
  name: string;
  /** Ein Satz, der aus der Seele spricht (Elias: „als würdest du denen aus der Seele sprechen“). */
  seele: string;
  /** Was sein Plan dadurch tut. */
  tut: string;
};

export const TYPEN: Record<TypId, Typ> = {
  planer: {
    id: "planer",
    name: "Der Planer",
    seele: "Dein Geld hat einen Termin. Du willst, dass es da ist, wenn du es brauchst, nicht irgendwann.",
    tut: "Die Hälfte bleibt griffbereit, der Rest schwankt so wenig wie möglich.",
  },
  fels: {
    id: "fels",
    name: "Der Fels",
    seele: "Du willst etwas, das bleibt, wenn alles andere wackelt. Substanz, die du anfassen könntest.",
    tut: "Gold trägt einen großen Teil, der Rest wächst breit und ruhig.",
  },
  gelassene: {
    id: "gelassene",
    name: "Der Gelassene",
    seele: "Du willst wachsen, ohne jeden Tag auf den Kurs zu schauen. Ruhe ist dir mehr wert als Tempo.",
    tut: "Sukuk dämpfen die Schwankung, der Islamic ETF bringt das Wachstum.",
  },
  baumeister: {
    id: "baumeister",
    name: "Der Baumeister",
    seele: "Du baust für später. Geduldig, breit, ohne Experimente. Ein Kauf im Monat, der Rest läuft.",
    tut: "Der Islamic ETF ist dein Fundament, Gold hält dagegen.",
  },
  entdecker: {
    id: "entdecker",
    name: "Der Entdecker",
    seele: "Du willst wissen, was dir gehört. Firmen, die du selbst aussuchst, mit eigener Handschrift.",
    tut: "Breite Basis im ETF, dazu ein Teil für Aktien, die du selbst prüfst.",
  },
  pionier: {
    id: "pionier",
    name: "Der Pionier",
    seele: "Du gehst voran, wo andere noch zögern. Ein kleiner Teil darf neu sein, der Rest steht fest.",
    tut: "Fundament im ETF, dazu ein kleiner Teil Krypto, freiwillig und mit Vorsicht.",
  },
};

const prozentVon = (anteile: Anteil[], b: BausteinId) => anteile.find((x) => x.baustein === b)?.prozent ?? 0;

/** Der Typ folgt der Aufteilung, nicht den Antworten: wer die Richtung ändert, wird ein anderer Typ. */
export const anlegertyp = (anteile: Anteil[]): Typ => {
  const p = (b: BausteinId) => prozentVon(anteile, b);
  if (p("konto") >= 30) return TYPEN.planer;
  if (p("krypto") >= 5) return TYPEN.pionier;
  if (p("aktien") >= 10) return TYPEN.entdecker;
  if (p("gold") >= 35) return TYPEN.fels;
  if (p("sukuk") >= 30) return TYPEN.gelassene;
  return TYPEN.baumeister;
};

// --- Risikobereitschaft -------------------------------------------------------------------------------------------

/** Wie stark ein Baustein schwankt, 0 bis 100; daraus der gewichtete Wert der Aufteilung. */
const SCHWANKUNG: Record<BausteinId, number> = { konto: 0, sukuk: 10, gold: 25, etf: 55, aktien: 80, krypto: 100 };

export const risiko = (anteile: Anteil[]): number => {
  const roh = anteile.reduce((s, x) => s + (x.prozent * SCHWANKUNG[x.baustein]) / 100, 0);
  return Math.max(5, Math.min(95, Math.round(roh)));
};

export const risikoWort = (n: number): "niedrig" | "mittel" | "hoch" => (n < 30 ? "niedrig" : n < 60 ? "mittel" : "hoch");

// --- Richtung statt Prozent ---------------------------------------------------------------------------------------

export type Gewicht = "Schwerpunkt" | "Beimischung" | "kleiner Teil" | "griffbereit";

export const gewichtWort = (baustein: BausteinId, prozent: number): Gewicht =>
  baustein === "konto" ? "griffbereit" : prozent >= 45 ? "Schwerpunkt" : prozent >= 20 ? "Beimischung" : "kleiner Teil";

/** Alle Bausteine in fester Reihenfolge, auch die mit 0, damit man sie dazunehmen kann. */
export const ALLE_BAUSTEINE: BausteinId[] = ["etf", "gold", "sukuk", "aktien", "krypto", "konto"];

const schritt = (b: BausteinId) => (SPIELRAUM.bausteine.includes(b) ? 5 : 10);

/**
 * Richtung ändern: mehr von einem Baustein nimmt den größten anderen etwas weg, weniger gibt es dem größten anderen.
 * Einzelaktien und Krypto zusammen höchstens 15 % (SPIELRAUM, Elias 28.10.2026), ein Baustein höchstens 80 %.
 */
export const richtungAendern = (anteile: Anteil[], baustein: BausteinId, mehr: boolean): Anteil[] => {
  const kopie: Anteil[] = ALLE_BAUSTEINE.map((b) => ({ baustein: b, prozent: prozentVon(anteile, b) }));
  const ziel = kopie.find((x) => x.baustein === baustein)!;
  const s = schritt(baustein);
  const andere = kopie.filter((x) => x.baustein !== baustein).sort((x, y) => y.prozent - x.prozent);
  if (mehr) {
    if (ziel.prozent + s > 80) return anteile;
    if (SPIELRAUM.bausteine.includes(baustein)) {
      const spiel = SPIELRAUM.bausteine.reduce((sum, b) => sum + prozentVon(kopie, b), 0);
      if (spiel + s > SPIELRAUM.hoechstens) return anteile;
    }
    // Nimm von den größten außerhalb des Spielraums, sonst vom größten überhaupt.
    const quelle = andere.find((x) => x.prozent >= s && !SPIELRAUM.bausteine.includes(x.baustein)) ?? andere.find((x) => x.prozent >= s);
    if (!quelle) return anteile;
    quelle.prozent -= s;
    ziel.prozent += s;
  } else {
    if (ziel.prozent < s) return anteile;
    const empfaenger = andere.find((x) => !SPIELRAUM.bausteine.includes(x.baustein) && x.prozent > 0) ?? kopie.find((x) => x.baustein === "etf")!;
    ziel.prozent -= s;
    empfaenger.prozent += s;
  }
  return kopie.filter((x) => x.prozent > 0).sort((x, y) => y.prozent - x.prozent);
};

export const kannMehr = (anteile: Anteil[], b: BausteinId) => richtungAendern(anteile, b, true) !== anteile;
export const kannWeniger = (anteile: Anteil[], b: BausteinId) => richtungAendern(anteile, b, false) !== anteile;

// --- Investmentstile -----------------------------------------------------------------------------------------------

export type Stil = { id: string; titel: string; isins?: string[]; slugs?: string[] };

/**
 * Je Baustein die Stile, aus denen man wählt; je Stil die Kandidaten in Reihenfolge (Regionen aus der XXL-Liste,
 * ~/rebrand/freebies/xxl-daten.json islamicAktien). Gold: Royal Mint zuerst (Elias 04.11.2026: Nummer 1, auslieferbar).
 */
export const STILE: Partial<Record<BausteinId, Stil[]>> = {
  etf: [
    { id: "welt", titel: "Welt", isins: ["IE00B27YCN58", "IE000X9FTI22", "IE000LFC57H7", "IE000UOXRAM8", "IE00BMYMHS24"] },
    { id: "usa", titel: "USA", isins: ["IE00B296QM64", "IE000I5NV504"] },
    { id: "europa", titel: "Europa", isins: ["IE000AGFZM58"] },
    { id: "schwellen", titel: "Schwellenländer", isins: ["IE00B27YCP72", "IE0009BC6K22"] },
    { id: "tech", titel: "Technologie", isins: ["LU2458330086"] },
  ],
  sukuk: [
    { id: "etf", titel: "Als ETF", isins: ["IE000929U2U9", "LU3123443510"] },
    { id: "fonds", titel: "Aktiv verwaltet", isins: ["LU1150255971"] },
  ],
  gold: [
    { id: "auslieferbar", titel: "Auslieferbar", isins: [ROYAL_MINT] },
    { id: "klassisch", titel: "Klassisch", isins: ["IE00B579F325", "JE00B1VS3770"] },
  ],
  krypto: [
    { id: "bitcoin", titel: "Bitcoin", slugs: ["bitcoin"] },
    { id: "ether", titel: "Ether", slugs: ["ether"] },
  ],
};

/** Kurse aus kurse.json (erzeugt von ~/rebrand/data/kurse_holen.py): r1j, r5j und `verlauf`, 60 Monatswerte 0 bis 100. */
type Kurs = { r1j?: number | null; r5j?: number | null; verlauf?: number[] | null; reihe?: [string, number][] | null };

/** „Dez. 2025“ aus „2025-12“: der erste Monat der Kursreihe, wenn eine Anlage noch keinen 1-Jahres-Wert hat (CV29P). */
export const seitText = (monat?: string): string | undefined => {
  if (!monat) return undefined;
  const [j, m] = monat.split("-").map(Number);
  if (!j || !m) return undefined;
  return `seit ${new Date(j, m - 1, 1).toLocaleDateString("de-DE", { month: "short", year: "numeric" })}`;
};
const KURSE = (kurse as unknown as { anlagen: Record<string, Kurs>; krypto?: Record<string, Kurs> }).anlagen;
const KURSE_KRYPTO = (kurse as unknown as { krypto?: Record<string, Kurs> }).krypto ?? {};

export const mitKurs = (anlage: Anlage): Produkt => {
  const k = anlage.isin ? KURSE[anlage.isin] : anlage.kursKey ? KURSE_KRYPTO[anlage.kursKey] : undefined;
  const verlauf = k?.verlauf && k.verlauf.length > 1 ? k.verlauf : undefined;
  const r1 = k?.r1j ?? undefined;
  const seit = r1 === undefined ? seitText(k?.reihe?.[0]?.[0]) : undefined;
  return { anlage, r1, r5: k?.r5j ?? undefined, verlauf, seit };
};

/**
 * Alle Anlagen eines Stils, die beim Depot mit Einzelbeleg kaufbar sind, in der Reihenfolge des Stils (CV28P: „alle
 * kaufbaren Anlagen des Stils, nicht nur die erste“). Dieselbe Prüfung wie produktFuerStil; Krypto läuft über eine
 * Börse, kein Depot-Test.
 */
export const produkteFuerStil = (stil: Stil, broker?: BrokerWahl): Produkt[] => {
  if (stil.slugs) {
    return stil.slugs
      .map((s) => halalAnlagen.find((x) => x.slug === s))
      .filter((a): a is Anlage => Boolean(a))
      .map(mitKurs);
  }
  const haus = hausVon(broker);
  return (stil.isins ?? [])
    .filter((i) => kaufbarBei(i, haus))
    .map((i) => halalAnlagen.find((x) => x.isin === i))
    .filter((a): a is Anlage => Boolean(a))
    .map(mitKurs);
};

/** Das erste Produkt eines Stils, das beim Depot mit Einzelbeleg kaufbar ist. */
export const produktFuerStil = (stil: Stil, broker?: BrokerWahl): Produkt | undefined => produkteFuerStil(stil, broker)[0];

export type StilMitProdukten = { stil: Stil; produkt: Produkt; produkte: Produkt[] };

/** Die Stile eines Bausteins, die beim Depot mindestens ein Produkt haben; `produkt` ist das erste davon. */
export const stileFuer = (baustein: BausteinId, broker?: BrokerWahl): StilMitProdukten[] =>
  (STILE[baustein] ?? [])
    .map((stil) => {
      const produkte = produkteFuerStil(stil, broker);
      return { stil, produkt: produkte[0], produkte };
    })
    .filter((x): x is StilMitProdukten => Boolean(x.produkt));

/**
 * Der vorgewählte Stil je Baustein: beim ETF die Richtung aus Frage 7, wenn es sie beim Depot gibt, sonst der erste
 * Stil, den es dort gibt. `wahl` ist, was der Leser im Dashboard angetippt hat; das geht vor.
 */
export const stilVorwahl = (
  baustein: BausteinId,
  a: Antworten,
  wahl?: string,
): StilMitProdukten | undefined => {
  const stile = stileFuer(baustein, a.broker);
  return (
    stile.find((s) => s.stil.id === wahl) ??
    (baustein === "etf" ? stile.find((s) => s.stil.id === a.region) : undefined) ??
    stile[0]
  );
};

/**
 * Gold: Royal Mint als Favorit mit drei Fakten (Elias 09.11.2026, Vault
 * raw/2026-11-09-elias-cv27p-prozente-nur-grundbereiche-usa-gold-favorit-steuer.md; memory
 * royal-mint-gold-etc-nummer-eins-edelmetalle). Steuer: BFH VIII R 7/17 vom 16.06.2020 (Laufzettel cv28p, Gefühlsblatt
 * Punkt 4: Lieferanspruch ist keine Kapitalforderung nach § 20 EStG, Verkauf fällt unter § 23 EStG). Nie „der einzige“:
 * die Datenbank nennt die Auslieferung nur bei Royal Mint und sagt über die anderen nichts.
 */
export const GOLD_FAVORIT_FAKTEN = [
  "Zertifiziert",
  "Du kannst dir das Gold liefern lassen, als Barren oder Münzen",
  "Nach zwölf Monaten steuerfrei. Gold ohne Lieferanspruch zahlt 26,375 %",
] as const;

export type BausteinAnlagen = {
  anteil: Anteil;
  /** Stile zum Umschalten (Chips); bei Gold leer, dort stehen Favorit und klassisches Gold zusammen. */
  stile: StilMitProdukten[];
  stil?: Stil;
  /** Alle kaufbaren Anlagen des gewählten Stils; bei Gold die klassischen ohne den Favoriten. */
  produkte: Produkt[];
  /** Nur Gold: Royal Mint, wenn beim Depot kaufbar. */
  favorit?: Produkt;
};

/** Je Baustein des Plans (ohne Girokonto) die Anlagen, die das Dashboard und die PDF zeigen. */
export const anlagenJeBaustein = (
  anteile: Anteil[],
  a: Antworten,
  wahl: Partial<Record<BausteinId, string>> = {},
): BausteinAnlagen[] =>
  anteile
    .filter((x) => x.baustein !== "konto")
    .map((anteil) => {
      if (anteil.baustein === "gold") {
        const stile = stileFuer("gold", a.broker);
        const favorit = stile.find((s) => s.stil.id === "auslieferbar")?.produkt;
        const klassisch = stile.find((s) => s.stil.id === "klassisch");
        return { anteil, stile: [], stil: klassisch?.stil, produkte: klassisch?.produkte ?? [], favorit };
      }
      const stile = stileFuer(anteil.baustein, a.broker);
      const g = stilVorwahl(anteil.baustein, a, wahl[anteil.baustein]);
      return { anteil, stile, stil: g?.stil, produkte: g?.produkte ?? [] };
    });

/**
 * Der Satz über den ETF-Anlagen: „Du wolltest USA. Das geht bei Traders Place:“. Gibt es die Richtung beim Depot nicht
 * (anlagenKaufbar.ts: Traders Place und Smartbroker+ führen den Europa-ETF nicht, Traders Place den Technologie-Fonds
 * nicht), sagt er „stattdessen“; hat der Leser selbst einen anderen Stil angetippt, nennt er den. `depot` fehlt bei
 * „Ein anderes Depot“: dann ohne Kaufbarkeits-Aussage.
 */
export const richtungsSatz = (a: Antworten, stil: Stil | undefined, depot?: string): string => {
  if (!stil) return "";
  const gehtDort = depot ? `Das geht bei ${depot}:` : "Dafür gibt es:";
  const region = regionTitel(a.region);
  if (!a.region || !region) return `${stil.titel}. ${gehtDort}`;
  if (stil.id === a.region) return `Du wolltest ${region}. ${gehtDort}`;
  const regionDa = stileFuer("etf", a.broker).some((s) => s.stil.id === a.region);
  if (!regionDa && depot) return `Du wolltest ${region}. Bei ${depot} geht stattdessen:`;
  return `${stil.titel}. ${gehtDort}`;
};

// --- Top-Performer ----------------------------------------------------------------------------------------------------

export const KATEGORIE_WORT: Record<Anlage["kategorie"], string> = {
  aktien: "Islamic ETF",
  sukuk: "Sukuk",
  gold: "Gold",
  silber: "Silber",
  rohstoffe: "Edelmetall",
  krypto: "Krypto",
};

/** Baustein-Farbe je Kategorie, damit die Mini-Kurven dieselben Farben tragen wie der Ring. */
export const kategorieFarbe = (k: Anlage["kategorie"]): string =>
  bausteinById(k === "aktien" ? "etf" : k === "sukuk" ? "sukuk" : k === "gold" ? "gold" : k === "krypto" ? "krypto" : "konto").farbe;

/**
 * Die Anlagen der Datenbank mit dem höchsten Plus im letzten Jahr (CV28P, Laufzettel cv28p Gefühlsblatt Punkt 4: nur
 * Anlagen mit Zertifikat in der Datenbank, keine Einzelaktien, weil dafür keine Kurse im Bestand liegen). Information,
 * nie Rangfolge für den Plan.
 */
export const topPerformer = (n = 5): Produkt[] =>
  halalAnlagen
    .filter((a) => a.isin && a.zertifikatArt)
    .map(mitKurs)
    .filter((p) => p.r1 !== undefined)
    .sort((x, y) => y.r1! - x.r1!)
    .slice(0, n);

// --- Zahlen aus der Datenbank ---------------------------------------------------------------------------------------

export type Fakten = {
  gesamt: number;
  etfs: number;
  sukuk: number;
  edelmetalle: number;
  krypto: number;
  /** Mit eigenem Shariah-Zertifikat des Anbieters, nicht nur Index. */
  zertifikat: number;
  /** Beim gewählten Depot mit Einzelbeleg kaufbar; undefined, wenn kein Depot gewählt ist. */
  kaufbar?: number;
};

export const datenbankFakten = (broker?: BrokerWahl): Fakten => {
  const haus = hausVon(broker);
  return {
    gesamt: halalAnlagen.length,
    etfs: halalAnlagen.filter((a) => a.kategorie === "aktien").length,
    sukuk: halalAnlagen.filter((a) => a.kategorie === "sukuk").length,
    edelmetalle: halalAnlagen.filter((a) => a.kategorie === "gold" || a.kategorie === "silber" || a.kategorie === "rohstoffe").length,
    krypto: halalAnlagen.filter((a) => a.kategorie === "krypto").length,
    zertifikat: halalAnlagen.filter((a) => a.zertifikatArt === "produkt").length,
    kaufbar: haus ? halalAnlagen.filter((a) => a.isin && ANLAGEN_KAUFBAR[a.isin]?.kaufbar.some((k) => k.haus === haus)).length : undefined,
  };
};

// --- Name aus der Mail -----------------------------------------------------------------------------------------------

/** Vorname aus ?n=…, wie ihn der Zoho-Antworter aus dem Absender liest; nur Buchstaben, höchstens 20 Zeichen. */
export const sauberName = (roh: string | null | undefined): string | undefined => {
  if (!roh) return undefined;
  const t = roh.trim().replace(/[^\p{L}\-']/gu, "").slice(0, 20);
  if (t.length < 2) return undefined;
  return t.charAt(0).toUpperCase() + t.slice(1);
};

export const planTitel = (name?: string) => (name ? `Der Halal-Investmentplan von ${name}` : "Dein Halal-Investmentplan");

export const heute = () =>
  new Date().toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" });

export { bausteinById };
export type { Anteil, Antworten };
