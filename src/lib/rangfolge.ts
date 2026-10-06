import type { RohAnbieter, RohWert } from "@/data/vergleichHelfer";
import { DEPOT_FINANZ_MAX } from "@/data/brokerVergleich";
import { EDELMETALL_FINANZ_MAX } from "@/data/edelmetallVergleich";
import { GIRO_FINANZ_MAX } from "@/data/girokontoVergleich";
import { KRYPTO_FINANZ_MAX } from "@/data/kryptoVergleich";
import { finanzNote, kostenlosReicht } from "@/lib/vergleichLeser";

/**
 * Rechenkern der Rangfolge für alle sechs Vergleiche (P3, 26.09.2026).
 * Spezifikation: `docs/rangfolge/P3-SPEC.md`, Abschnitt 10 hat Vorrang.
 *
 * Regeln, die hier gelten und getestet sind:
 *
 * 1. Nur Belegtes zählt. Fehlt ein Merkmal der Formel, gibt es keinen Platz und
 *    keine Note, sondern "noch nicht geprüft" mit der Liste, was fehlt.
 *    Ausnahme Depot (Elias, 06.10.2026: "Wir können mit diesem Depot-Ranking nicht an den
 *    Start gehen"): Jedes Depot, das nicht abgeraten ist, bekommt eine Note. In den
 *    Halal-Anteil zählen nur Anlagen mit Kaufbeleg, Unbelegtes zählt als nicht vorhanden
 *    (0 Punkte), nie als geschätzt. Dasselbe gilt für ein nicht belegtes Zins-Tor (Halal-Teil 0,
 *    nie Nummer 1) und fehlende Kosten-Punkte (Kosten 0). Edelmetall rechnet dieselben Depots
 *    nach derselben Regel, im Halal-Teil zählen aber nur die Gold- und Silber-ETCs und bei den
 *    Kosten nur, was ein Kauf kostet (`EDELMETALL_FINANZ_MAX`).
 *    Steuersoftware folgt seit 06.10.2026 derselben Regel: Unbelegte Leistungs- und Preiswerte
 *    zählen 0 Punkte und die Zelle zeigt einen Strich. Das Tor Anlage KAP bleibt: ohne Beleg
 *    dafür gibt es keinen Platz.
 * 2. Partner kaufen keine Plätze: Diese Datei liest weder `link` noch
 *    Finanzfluss-Rang, Etikett, alte Note, Partnerlinks oder Deals.
 * 3. Jede Eingabe landet in genau einer Gruppe. Vorrang: abgeraten vor nicht
 *    bewertet vor gerankt.
 * 4. Reihenfolge: Note, Kosten, Halal, jeweils auf zwei Stellen gerundet und
 *    absteigend, dann Name, Produkt, id. Gleiche Note, Kosten und Halal teilen
 *    den Platz (1, 1, 3).
 * 5. Die Nummer 1 für Kasten und geführten Vergleich kommt nur aus Einträgen
 *    ohne Einschränkung: Zins-Tor grün und keine rote Grundlage (`BASIS`).
 *    So gilt "gelb halbiert" (Elias, 14.09.2026) für die Liste und "kein Mensch
 *    will Zinsen" (19.09.2026) für die Empfehlung.
 */

export type RangKategorie = "depot" | "girokonto" | "krypto" | "steuer" | "screener" | "edelmetall";

export type Bewertet = {
  anbieter: RohAnbieter;
  platz: number;
  /** 0 bis 5, zwei Nachkommastellen. */
  note: number;
  /** Halal-Teil nach der Halbierung. Bei Steuer die Leistung, beim Screener die Transparenz. */
  halal: number;
  /** Kosten-Teil. Bei Steuer der Preis, beim Screener der Nutzen. */
  kosten: number | null;
  /** Zins-Tor grün und keine rote Grundlage. Nur solche Einträge können Nummer 1 werden. */
  uneingeschraenkt: boolean;
};
export type NichtBewertet = { anbieter: RohAnbieter; grund: "noch nicht geprüft" | "Anfrage läuft"; fehlt: string[] };
export type Abgeraten = { anbieter: RohAnbieter; grund: string };
export type Rangliste = { gerankt: Bewertet[]; nichtBewertet: NichtBewertet[]; abgeraten: Abgeraten[] };

export type RangOptionen = {
  /** Hausschlüssel (sonst id) mit laufender Anfrage, aus `src/data/anfragenOffen.ts`. */
  offeneAnfragen?: ReadonlySet<string>;
  /** Höchstpunkte der Finanzkriterien. Standard je Kategorie aus den Datendateien. */
  finanzMax?: Record<string, number>;
};

/** Faktor auf den Halal-Teil, wenn Zinsen ab Start laufen und erst abgeschaltet werden müssen. */
export const FAKTOR_ABSCHALTBAR = 0.5;

/** Halal-Grundlagen je Kategorie. Steht hier "schlecht", wird der Eintrag gerankt, aber nie Nummer 1. */
export const BASIS: Record<"depot" | "girokonto" | "krypto", string[]> = {
  depot: [],
  girokonto: ["keinDispoAbStart", "karteOhneKredit"],
  krypto: ["zinsfreiesModell"],
};

/** Wie viele Anlagen je Zeile im Halal-Anlagen-Vergleich stehen. Nenner ist die Summe, 22. */
export const ANTEIL_N: Record<string, number> = { halalEtfsFonds: 12, halalSukuk: 3, halalEdelmetalle: 7 };

const STANDARD_FINANZ_MAX: Partial<Record<RangKategorie, Record<string, number>>> = {
  depot: DEPOT_FINANZ_MAX,
  girokonto: GIRO_FINANZ_MAX,
  krypto: KRYPTO_FINANZ_MAX,
  edelmetall: EDELMETALL_FINANZ_MAX,
};

const TOR = "zinsfreiAbStart";

export const AMPEL_GEWICHTE: Record<"girokonto" | "krypto", Array<[string, number]>> = {
  girokonto: [
    ["keinDispoAbStart", 0.5],
    ["karteOhneKredit", 0.5],
  ],
  krypto: [
    ["echteCoins", 0.4],
    ["eigeneWallet", 0.3],
    ["zinsfreiesModell", 0.3],
  ],
};

/** Steuer: Preis, ab dem es keine Preispunkte mehr gibt. */
export const PREIS_MAX_STEUER = 60;

type Urteil =
  | { art: "abgeraten"; grund: string }
  | { art: "offen"; fehlt: string[] }
  | { art: "bewertet"; halal: number; kosten: number | null; note: number; uneingeschraenkt: boolean };

const runde = (x: number) => Math.round(x * 100) / 100;
const begrenze = (x: number) => Math.min(5, Math.max(0, x));

/** Ampel: gut 1, teils 0,5, schlecht 0. null, "unbekannt" und alles andere fehlt. */
const ampel = (w: RohWert | undefined): number | null =>
  w === "gut" ? 1 : w === "teils" ? 0.5 : w === "schlecht" ? 0 : null;

const jaNein = (w: RohWert | undefined): number | null => (typeof w === "boolean" ? (w ? 1 : 0) : null);

/** Steuer-Texte: beginnt mit "ja" 1, mit "nur in der Fassung" 0,5, "nein" 0. Alles andere fehlt. */
const fassung = (w: RohWert | undefined): number | null => {
  if (typeof w !== "string") return null;
  const t = w.trim().toLowerCase();
  if (/^ja\b/.test(t)) return 1;
  if (t.startsWith("nur in der fassung")) return 0.5;
  if (/^nein\b/.test(t)) return 0;
  return null;
};

/** Liest Werte, merkt sich fehlende Schlüssel und summiert gewichtet. */
const sammler = () => {
  const fehlt: string[] = [];
  const lies = (key: string, wert: number | null) => {
    if (wert === null) fehlt.push(key);
    return wert ?? 0;
  };
  return { fehlt, lies };
};

const halbe = (halal: number, kosten: number) => 0.5 * halal + 0.5 * kosten;

const kostenAus = (a: RohAnbieter, finanzMax: Record<string, number>): number | null =>
  a.finanzPunkte && Object.keys(a.finanzPunkte).length > 0 ? finanzNote(a, finanzMax, []) : null;

/** "x von N" und "mind. x von N": x ist die Zahl der belegten Treffer. Alles andere ist kein Beleg. */
const ANLAGEN_ZEILE = /^\s*(?:mind\.\s+)?(\d+)\s+von\s+(\d+)\s*$/;

/** Belegte, gewichtete Punkte einer Halal-Anlagen-Zeile. Fehlt der Beleg oder passt N nicht, zählt die Zeile 0. */
const anlagenPunkte = (a: RohAnbieter, key: string, n: number): number => {
  const w = a.werte[key];
  const m = typeof w === "string" ? w.match(ANLAGEN_ZEILE) : null;
  const punkte = a.halalAnlagenPunkte?.[key];
  const belegt = m !== null && Number(m[2]) === n && Number(m[1]) <= n && typeof punkte === "number" && punkte >= 0 && punkte <= n;
  return belegt ? punkte : 0;
};

/** Depot zählt alle 22 Halal-Anlagen, Edelmetall nur die Zeile der Gold- und Silber-ETCs. */
const depotUrteil = (a: RohAnbieter, finanzMax: Record<string, number>, zeilen: Record<string, number> = ANTEIL_N): Urteil => {
  const tuer = a.werte[TOR];
  if (tuer === "schlecht" || a.abgeraten) return { art: "abgeraten", grund: "Zinsen nicht abschaltbar" };

  const nenner = Object.values(zeilen).reduce((s, n) => s + n, 0);
  const anteil = Object.entries(zeilen).reduce((s, [key, n]) => s + anlagenPunkte(a, key, n) / nenner, 0);
  const kosten = kostenAus(a, finanzMax) ?? 0;

  const faktor = tuer === "gut" ? 1 : tuer === "teils" ? FAKTOR_ABSCHALTBAR : 0;
  const halal = 5 * anteil * faktor;
  return { art: "bewertet", halal, kosten, note: halbe(halal, kosten), uneingeschraenkt: tuer === "gut" };
};

const zinsUrteil = (a: RohAnbieter, kategorie: "girokonto" | "krypto", finanzMax: Record<string, number>): Urteil => {
  const tuer = a.werte[TOR];
  if (tuer === "schlecht" || a.abgeraten) return { art: "abgeraten", grund: "Zinsen nicht abschaltbar" };

  const { fehlt, lies } = sammler();
  if (tuer !== "gut" && tuer !== "teils") fehlt.push(TOR);

  let anteil = 0;
  for (const [key, gewicht] of AMPEL_GEWICHTE[kategorie]) anteil += gewicht * lies(key, ampel(a.werte[key]));
  const kosten = kostenAus(a, finanzMax);
  if (kosten === null) fehlt.push("finanzPunkte");
  if (fehlt.length > 0) return { art: "offen", fehlt };

  const halal = 5 * anteil * (tuer === "teils" ? FAKTOR_ABSCHALTBAR : 1);
  const basisRot = BASIS[kategorie].some((k) => a.werte[k] === "schlecht");
  return { art: "bewertet", halal, kosten: kosten!, note: halbe(halal, kosten!), uneingeschraenkt: tuer === "gut" && !basisRot };
};

const steuerUrteil = (a: RohAnbieter): Urteil => {
  if (fassung(a.werte.kapital) === 0) return { art: "abgeraten", grund: "kann keine Anlage KAP" };
  // Das Tor Anlage KAP bleibt: ohne Beleg dafür gibt es keinen Platz.
  if (fassung(a.werte.kapital) !== 1) return { art: "offen", fehlt: ["kapital"] };
  // Wie beim Depot: Was nicht belegt ist, zählt 0 Punkte und nie geschätzt. Jedes Programm mit
  // belegter Anlage KAP bekommt eine Note, die Zelle zeigt dann einen Strich.
  const belegt = (wert: number | null) => wert ?? 0;
  const plattform = a.werte.plattform;
  const leistung =
    5 *
    (0.35 * belegt(jaNein(a.werte.belegabruf)) +
      0.25 * belegt(fassung(a.werte.vermietung)) +
      0.25 * belegt(fassung(a.werte.selbststaendige)) +
      0.15 * belegt(typeof plattform === "string" && plattform.trim() ? (/nur Windows/i.test(plattform) ? 0 : 1) : null));
  const p = a.preisEinzel;
  const preis = belegt(typeof p === "number" && Number.isFinite(p) && p >= 0 ? begrenze(5 * (1 - p / PREIS_MAX_STEUER)) : null);
  return { art: "bewertet", halal: leistung, kosten: preis, note: halbe(leistung, preis), uneingeschraenkt: true };
};

const screenerUrteil = (a: RohAnbieter): Urteil => {
  const { fehlt, lies } = sammler();
  const transparenz = (5 * ["gremium", "begruendung", "reinigung"].reduce((s, k) => s + lies(k, ampel(a.werte[k])), 0)) / 3;
  const extras = ["etfs", "depot", "zakat"].reduce((s, k) => s + lies(k, jaNein(a.werte[k])), 0) / 3;
  const frei = a.werte.kostenlos;
  const reicht = lies("kostenlos", typeof frei === "string" && frei.trim() ? (kostenlosReicht(a) ? 1 : 0) : null);
  if (fehlt.length > 0) return { art: "offen", fehlt };
  const nutzen = 5 * (0.5 * reicht + 0.5 * extras);
  return { art: "bewertet", halal: transparenz, kosten: nutzen, note: halbe(transparenz, nutzen), uneingeschraenkt: true };
};

const urteil = (a: RohAnbieter, kategorie: RangKategorie, finanzMax: Record<string, number>): Urteil => {
  switch (kategorie) {
    case "steuer":
      return steuerUrteil(a);
    case "screener":
      return screenerUrteil(a);
    case "edelmetall":
      return depotUrteil(a, finanzMax, { halalEdelmetalle: ANTEIL_N.halalEdelmetalle });
    case "depot":
      return depotUrteil(a, finanzMax);
    default:
      return zinsUrteil(a, kategorie, finanzMax);
  }
};

const nachName = (p: RohAnbieter, q: RohAnbieter) =>
  p.name.localeCompare(q.name, "de") || p.produkt.localeCompare(q.produkt, "de") || p.id.localeCompare(q.id, "de");

export const rangfolge = (liste: readonly RohAnbieter[], kategorie: RangKategorie, opt: RangOptionen = {}): Rangliste => {
  const finanzMax = opt.finanzMax ?? STANDARD_FINANZ_MAX[kategorie] ?? {};
  const bewertet: Array<Omit<Bewertet, "platz">> = [];
  const nichtBewertet: NichtBewertet[] = [];
  const abgeraten: Abgeraten[] = [];

  for (const anbieter of liste) {
    const u = urteil(anbieter, kategorie, finanzMax);
    if (u.art === "abgeraten") abgeraten.push({ anbieter, grund: u.grund });
    else if (u.art === "offen") {
      const angefragt = opt.offeneAnfragen?.has(anbieter.haus ?? anbieter.id) ?? false;
      nichtBewertet.push({ anbieter, grund: angefragt ? "Anfrage läuft" : "noch nicht geprüft", fehlt: u.fehlt });
    } else {
      bewertet.push({
        anbieter,
        note: runde(u.note),
        halal: runde(u.halal),
        kosten: u.kosten === null ? null : runde(u.kosten),
        uneingeschraenkt: u.uneingeschraenkt,
      });
    }
  }

  const gleichauf = (p: Omit<Bewertet, "platz">, q: Omit<Bewertet, "platz">) =>
    q.note - p.note || (q.kosten ?? 0) - (p.kosten ?? 0) || q.halal - p.halal;
  bewertet.sort((p, q) => gleichauf(p, q) || nachName(p.anbieter, q.anbieter));

  const gerankt: Bewertet[] = [];
  bewertet.forEach((b, i) => {
    const vorher = gerankt[i - 1];
    const platz = vorher && gleichauf(vorher, b) === 0 ? vorher.platz : i + 1;
    gerankt.push({ ...b, platz });
  });

  nichtBewertet.sort((p, q) => nachName(p.anbieter, q.anbieter));
  abgeraten.sort((p, q) => nachName(p.anbieter, q.anbieter));
  return { gerankt, nichtBewertet, abgeraten };
};

/**
 * Wer im Kasten "Unsere Nummer 1" steht: die besten Einträge ohne Einschränkung.
 * Mehr als einer heißt gleichauf, keiner heißt kein Kasten.
 */
export const nummerEins = (r: Rangliste): Bewertet[] => {
  const kandidaten = r.gerankt.filter((b) => b.uneingeschraenkt);
  if (kandidaten.length === 0) return [];
  const erster = kandidaten[0];
  return kandidaten.filter((b) => b.note === erster.note && b.kosten === erster.kosten && b.halal === erster.halal);
};

/** Sterne auf der Seite: Note auf halbe Sterne gerundet. */
export const sterne = (note: number): number => Math.round(note * 2) / 2;
