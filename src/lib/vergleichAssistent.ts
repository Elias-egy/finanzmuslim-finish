import { bewerte, FAKTOR_ABSCHALTBAR, HALAL_REGELN, type Kategorie } from "@/lib/bewertung";
import type { RohAnbieter } from "@/data/vergleichHelfer";

/**
 * Rechenkern des geführten Vergleichs.
 *
 * Regeln, die hier gelten und getestet sind:
 *
 * 1. Wer sich nicht zinsfrei nutzen lässt, erscheint nie im Ergebnis.
 * 2. Ein unbekannter Wert erfüllt nie einen Wunsch. Der Anbieter steht dann
 *    unter "noch nicht geprüft", nicht unter "passt".
 * 3. Partnerlink, Provision und Startseite fließen nirgends ein. Diese Datei
 *    liest `link` nicht.
 * 4. Antworten ändern Gewichte und Filter, nie die Fakten.
 * 5. Gleiche Antworten liefern immer dieselbe Reihenfolge.
 *
 * Reihenfolge (Elias, 19.09.2026 abends: "Empfehlung für dein Depot"): Das
 * Ergebnis nennt je Baustein einen Anbieter, der am besten zu den Angaben passt.
 * Dafür braucht es immer eine faire Ordnung, auch wo noch nicht alles geprüft
 * ist. Sie entsteht nur aus Belegtem: Ein ungeprüftes Halal-Merkmal zählt null,
 * nie als erfüllt. Wer viel Ungeprüftes hat, steht deshalb hinten, nicht vorn.
 *
 * `RANGFOLGE_FREI` steuert nur noch, ob die Note als Zahl dasteht. Das setzt
 * voraus, dass der Anbieter fertig bewertet ist.
 */

/** Schaltet je Kategorie die persönliche Note und "Passt am besten" frei. Entscheidet Elias. */
export const RANGFOLGE_FREI: Record<Kategorie, boolean> = {
  depot: false,
  girokonto: false,
  krypto: false,
};

/** true erfüllt, false nicht erfüllt, null noch nicht geprüft. */
export type Pruefung = (a: RohAnbieter) => boolean | null;

export type Wunsch = {
  id: string;
  /** Steht im Ergebnis hinter dem Haken, z. B. "Sukuk kaufbar". */
  label: string;
  pruefe: Pruefung;
  /** Erfüllt nicht eigens auflisten, weil ein Grund dasselbe genauer sagt ("Sparplan schon ab 1 €"). */
  still?: boolean;
};

export type Prioritaet = {
  id: string;
  /** Steht über der Liste: "Sortiert nach: niedrige Kosten". */
  label: string;
  /** Faktor je Finanzkriterium. Nicht genannte Kriterien zählen einfach. */
  gewichte: Record<string, number>;
  /** Anteil des Halal-Teils an der persönlichen Note. Standard 0,5. */
  halalAnteil?: number;
  /** Zeilen, deren Werte im Ergebnis als Fakten unter dem Anbieter stehen. */
  fakten: string[];
};

/** Ein Satz, warum der Anbieter zur Antwort passt. Kommt nur aus den Daten, sonst null. */
export type Grund = (a: RohAnbieter) => string | null;

export type Auswahl = {
  wuensche: Wunsch[];
  /** Mehrere Gewichtungen multiplizieren sich, z. B. Sparplan und niedrige Kosten. */
  gewichte: Record<string, number>[];
  prioritaet?: Prioritaet;
  gruende?: Grund[];
  /**
   * Zweitrangige Sortierung von 0 bis 1, z. B. "wer kurz anlegt, sieht zuerst,
   * wo es Sukuk und Gold gibt". Zählt halb so stark wie die Priorität und nur,
   * solange die Rangfolge nicht freigeschaltet ist.
   */
  nebenSort?: Array<(a: RohAnbieter) => number | null>;
};

export type Treffer = {
  anbieter: RohAnbieter;
  erfuellt: Wunsch[];
  ungeprueft: Wunsch[];
  /** Sätze aus den Daten, warum der Anbieter zu den Antworten passt. */
  gruende: string[];
  /** Zinsen laufen ab Start und müssen selbst abgeschaltet werden. */
  zinsenAbschalten: boolean;
  /** Nur gesetzt, wenn die Kategorie freigeschaltet und der Anbieter fertig bewertet ist. */
  note: { gesamt: number; halal: number; finanz: number } | null;
  sortWert: number;
};

export type Ergebnis = {
  passt: Treffer[];
  ungeprueft: Treffer[];
  /** Zahl der Anbieter, die wegen Zinsen oder eines nicht erfüllten Wunsches fehlen. */
  raus: number;
  gerankt: boolean;
};

/* ------------------------------------------------------------- Prüfhelfer */

/** Ampelzeile: nur "gut" erfüllt. "unbekannt" und null bleiben offen. */
export const ampelGut =
  (key: string): Pruefung =>
  (a) => {
    const w = a.werte[key];
    if (w === "gut") return true;
    if (w === "schlecht" || w === "teils") return false;
    return null;
  };

export const jaNein =
  (key: string): Pruefung =>
  (a) => {
    const w = a.werte[key];
    return typeof w === "boolean" ? w : null;
  };

/** "mind. 4 von 12" -> 4, "0 von 3" -> 0, sonst null. */
export const anzahlVon = (wert: unknown): number | null => {
  if (typeof wert !== "string") return null;
  const m = wert.match(/(\d+)\s+von\s+\d+/);
  return m ? Number(m[1]) : null;
};

export const mindestensEins =
  (key: string): Pruefung =>
  (a) => {
    const n = anzahlVon(a.werte[key]);
    return n === null ? null : n >= 1;
  };

/** "0€", "0,00 €", "4,90€ ..." -> Betrag der ersten Zahl. Ohne Zahl null. */
export const euro = (wert: unknown): number | null => {
  if (typeof wert !== "string") return null;
  const m = wert.match(/(\d+(?:[.,]\d+)?)\s*€/);
  return m ? Number(m[1].replace(",", ".")) : null;
};

/** "1€ bis unbegrenzt" -> 1, "kein Sparplan" -> Infinity, sonst null. */
export const sparplanAb = (wert: unknown): number | null => {
  if (typeof wert !== "string") return null;
  if (/kein/i.test(wert)) return Infinity;
  return euro(wert);
};

export const kostetNichts =
  (key: string): Pruefung =>
  (a) => {
    const e = euro(a.werte[key]);
    return e === null ? null : e === 0;
  };

/* ---------------------------------------------------------------- Rechnen */

const runde = (x: number) => Math.round(x * 100) / 100;

/** Gewichtete Finanznote von 0 bis 5. Ohne Gewichte identisch mit `bewerte().finanz`. */
export const finanzNote = (
  a: RohAnbieter,
  finanzMax: Record<string, number>,
  gewichte: Record<string, number>[],
): number | null => {
  if (!a.finanzPunkte) return null;
  const faktor = (k: string) => gewichte.reduce((f, g) => f * (g[k] ?? 1), 1);
  let max = 0;
  let summe = 0;
  for (const [k, m] of Object.entries(finanzMax)) {
    max += m * faktor(k);
    summe += (a.finanzPunkte[k] ?? 0) * faktor(k);
  }
  // Abzüge gelten immer voll, egal was der Nutzer gewichtet.
  summe += Math.min(0, a.finanzPunkte.abzug ?? 0);
  if (max === 0) return null;
  return 5 * Math.min(1, Math.max(0, summe / max));
};

/** Wie viele Anlagen je Zeile im Halal-Anlagen-Vergleich stehen. Muss zu den Zeilentexten passen (Test). */
export const ANTEIL_N: Record<string, number> = { halalEtfsFonds: 12, halalSukuk: 3, halalEdelmetalle: 8 };

/**
 * Halal-Teil von 0 bis 1, nur aus dem, was belegt ist. Dieselben Gewichte wie in
 * `bewerte()`, aber ein ungeprüftes Merkmal zählt null statt die Note zu sperren.
 * "mind. 4 von 12" zählt als 4, ein unklarer Ausgabeaufschlag als halber Punkt.
 */
export const halalBelegt = (a: RohAnbieter, kategorie: Kategorie): number => {
  const regel = HALAL_REGELN[kategorie];
  const tuer = a.werte[regel.tuersteher];
  if (tuer !== "gut" && tuer !== "teils") return 0;
  let h = 0;
  for (const teil of regel.teile) {
    if (teil.art === "anteilSumme") {
      const x = teil.keys.reduce((s, k) => s + (a.halalAnlagenPunkte?.[k] ?? (anzahlVon(a.werte[k]) ?? 0) * 0.5), 0);
      const n = teil.keys.reduce((s, k) => s + (ANTEIL_N[k] ?? 0), 0);
      h += n > 0 ? teil.gewicht * Math.min(1, x / n) : 0;
    } else if (teil.art === "ampel") {
      h += a.werte[teil.key] === "gut" ? teil.gewicht : 0;
    } else {
      const w = a.werte[teil.key];
      const m = typeof w === "string" ? w.match(/^\s*(\d+)\s+von\s+(\d+)\s*$/) : null;
      h += m && Number(m[2]) > 0 ? teil.gewicht * (Number(m[1]) / Number(m[2])) : 0;
    }
  }
  return h * (tuer === "teils" ? FAKTOR_ABSCHALTBAR : 1);
};

/** Zwei Antworten können dasselbe belegen. Ein Satz, der ganz in einem anderen steckt, fällt weg. */
const ohneDoppeltes = (saetze: string[]) => {
  const einmal = [...new Set(saetze)];
  return einmal.filter((s) => !einmal.some((t) => t !== s && t.includes(s)));
};

const nebenWert = (a: RohAnbieter, neben?: Array<(a: RohAnbieter) => number | null>) => {
  if (!neben || neben.length === 0) return 0;
  const summe = neben.reduce((s, f) => s + Math.min(1, Math.max(0, f(a) ?? 0)), 0);
  return 0.5 * (summe / neben.length);
};

export const werteAus = (
  liste: RohAnbieter[],
  /** null: Vergleich ohne Halal-Regel und ohne Note, etwa Steuersoftware. Dann wird nur gefiltert. */
  kategorie: Kategorie | null,
  finanzMax: Record<string, number>,
  auswahl: Auswahl,
  /** Nur Tests übergeben das. Die Seite nimmt immer den Schalter oben. */
  frei: boolean = kategorie ? RANGFOLGE_FREI[kategorie] : false,
): Ergebnis => {
  const regel = kategorie ? HALAL_REGELN[kategorie] : null;
  const gewichte = [...auswahl.gewichte, ...(auswahl.prioritaet ? [auswahl.prioritaet.gewichte] : [])];
  const halalAnteil = auswahl.prioritaet?.halalAnteil ?? 0.5;

  const passt: Treffer[] = [];
  const ungeprueft: Treffer[] = [];
  let raus = 0;

  const platz = new Map(liste.map((a, i) => [a.id, i]));

  for (const a of liste) {
    const tuer = regel ? a.werte[regel.tuersteher] : "gut";
    if (tuer === "schlecht" || a.abgeraten) {
      raus += 1;
      continue;
    }
    const stand = auswahl.wuensche.map((w) => ({ w, r: w.pruefe(a) }));
    if (stand.some((s) => s.r === false)) {
      raus += 1;
      continue;
    }
    const offen = stand.filter((s) => s.r === null).map((s) => s.w);
    const tuerOffen = tuer !== "gut" && tuer !== "teils";

    const basis = kategorie ? bewerte(a, kategorie, finanzMax) : null;
    const fin = finanzNote(a, finanzMax, gewichte);
    const note =
      frei && basis?.status === "bewertet" && fin !== null
        ? {
            gesamt: runde(halalAnteil * basis.halal + (1 - halalAnteil) * fin),
            halal: basis.halal,
            finanz: runde(fin),
          }
        : null;

    const treffer: Treffer = {
      anbieter: a,
      erfuellt: stand.filter((s) => s.r === true).map((s) => s.w),
      ungeprueft: offen,
      gruende: ohneDoppeltes((auswahl.gruende ?? []).map((g) => g(a)).filter((g): g is string => !!g)),
      zinsenAbschalten: tuer === "teils",
      note,
      sortWert:
        note?.gesamt ??
        (kategorie ? halalAnteil * 5 * halalBelegt(a, kategorie) + (1 - halalAnteil) * (fin ?? 0) : 0) + nebenWert(a, auswahl.nebenSort),
    };

    // Mit Freischaltung zählt nur, wer fertig bewertet ist. Sonst stünde halbes Wissen auf Platz 1.
    if (offen.length > 0 || tuerOffen || (frei && !note)) ungeprueft.push(treffer);
    else passt.push(treffer);
  }

  const ordnung = (p: Treffer, q: Treffer) =>
    q.sortWert - p.sortWert ||
    (q.note?.halal ?? 0) - (p.note?.halal ?? 0) ||
    (kategorie ? 0 : platz.get(p.anbieter.id)! - platz.get(q.anbieter.id)!) ||
    `${p.anbieter.name} ${p.anbieter.produkt}`.localeCompare(`${q.anbieter.name} ${q.anbieter.produkt}`, "de");

  passt.sort(ordnung);
  ungeprueft.sort((p, q) => p.ungeprueft.length - q.ungeprueft.length || ordnung(p, q));

  return { passt, ungeprueft, raus, gerankt: frei };
};
