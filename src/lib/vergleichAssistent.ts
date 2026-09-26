import type { RohAnbieter } from "@/data/vergleichHelfer";
import { ANTEIL_N, BASIS, rangfolge, type RangKategorie } from "@/lib/rangfolge";
import { finanzNote } from "@/lib/vergleichLeser";

export { ANTEIL_N, BASIS, finanzNote };

/**
 * Rechenkern des geführten Vergleichs. Er sitzt auf der Rangfolge (`rangfolge.ts`, P3-Spec
 * Abschnitt 6 und 10): dieselbe Note, dieselbe Reihenfolge, dieselbe Nummer 1 wie auf der
 * Vergleichsseite.
 *
 * Regeln, die hier gelten und getestet sind:
 *
 * 1. Das Fundament wird nicht abgefragt, es gilt immer (Elias, 19.09.2026: "Kein
 *    Mensch will Zinsen"). Vorgeschlagen wird nur, wer ohne Einschränkung ist: ab
 *    Start zinsfrei und ohne voreingestellten Kredit, Dispo oder zinsgebundenes
 *    Bezahlmodell (`BASIS`). Die übrigen stehen im Vergleich, aber nie hier.
 * 2. Ein unbekannter Wert erfüllt nie einen Wunsch. Der Anbieter steht dann
 *    unter "noch nicht geprüft", nicht unter "passt". Dort steht auch, wem die
 *    Rangfolge noch keine Note gibt.
 * 3. Partnerlink, Provision, Startseite und Finanzfluss-Rang fließen nirgends ein.
 * 4. Antworten ändern Filter und die Gewichte des Kosten-Teils, nie Halal-Teil,
 *    Note oder Gruppe. Die angezeigte Note ist immer die der Rangfolge.
 * 5. Gleiche Antworten liefern immer dieselbe Reihenfolge.
 */

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
  /** Faktor je Finanzkriterium. Nicht genannte Kriterien zählen einfach. Wirkt nur auf den Kosten-Teil. */
  gewichte: Record<string, number>;
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
};

export type Treffer = {
  anbieter: RohAnbieter;
  erfuellt: Wunsch[];
  ungeprueft: Wunsch[];
  /** Sätze aus den Daten, warum der Anbieter zu den Antworten passt. */
  gruende: string[];
  /** Note der Rangfolge. null, solange der Anbieter nicht fertig bewertet ist. */
  note: { gesamt: number; halal: number; finanz: number | null } | null;
  /** Wonach sortiert wird: die Note, mit gewählter Priorität der neu gewichtete Kosten-Teil. */
  sortWert: number;
};

export type Ergebnis = {
  passt: Treffer[];
  ungeprueft: Treffer[];
  /** Zahl der Anbieter, die wegen Zinsen, einer Einschränkung oder eines nicht erfüllten Wunsches fehlen. */
  raus: number;
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

const istZinsKategorie = (k: RangKategorie): k is keyof typeof BASIS => k in BASIS;

/** Zwei Antworten können dasselbe belegen. Ein Satz, der ganz in einem anderen steckt, fällt weg. */
const ohneDoppeltes = (saetze: string[]) => {
  const einmal = [...new Set(saetze)];
  return einmal.filter((s) => !einmal.some((t) => t !== s && t.includes(s)));
};

export const werteAus = (
  liste: readonly RohAnbieter[],
  kategorie: RangKategorie,
  finanzMax: Record<string, number>,
  auswahl: Auswahl,
  /** Häuser mit laufender Anfrage, für den Grund in "noch nicht geprüft". */
  offeneAnfragen?: ReadonlySet<string>,
): Ergebnis => {
  const r = rangfolge(liste, kategorie, { finanzMax, offeneAnfragen });
  const gewichte = [...auswahl.gewichte, ...(auswahl.prioritaet ? [auswahl.prioritaet.gewichte] : [])];
  const gewichtet = istZinsKategorie(kategorie) && gewichte.length > 0;

  const eingeschraenkt = (a: RohAnbieter) =>
    istZinsKategorie(kategorie) && (a.werte.zinsfreiAbStart === "teils" || BASIS[kategorie].some((k) => a.werte[k] === "schlecht"));

  const passt: Treffer[] = [];
  const ungeprueft: Treffer[] = [];
  let raus = r.abgeraten.length;
  /** Position in der Rangfolge: Gerankte vor nicht Bewerteten, darin wie dort sortiert. */
  const position = new Map<string, number>();

  const kandidaten = [
    ...r.gerankt.map((b) => ({ anbieter: b.anbieter, bewertet: b, frei: b.uneingeschraenkt })),
    ...r.nichtBewertet.map((n) => ({ anbieter: n.anbieter, bewertet: null, frei: !eingeschraenkt(n.anbieter) })),
  ];
  kandidaten.forEach((k, i) => position.set(k.anbieter.id, i));

  for (const { anbieter: a, bewertet, frei } of kandidaten) {
    if (!frei) {
      raus += 1;
      continue;
    }
    const stand = auswahl.wuensche.map((w) => ({ w, r: w.pruefe(a) }));
    if (stand.some((s) => s.r === false)) {
      raus += 1;
      continue;
    }
    const offen = stand.filter((s) => s.r === null).map((s) => s.w);
    const note = bewertet ? { gesamt: bewertet.note, halal: bewertet.halal, finanz: bewertet.kosten } : null;
    const kosten = gewichtet ? finanzNote(a, finanzMax, gewichte) : null;
    const treffer: Treffer = {
      anbieter: a,
      erfuellt: stand.filter((s) => s.r === true).map((s) => s.w),
      ungeprueft: offen,
      gruende: ohneDoppeltes((auswahl.gruende ?? []).map((g) => g(a)).filter((g): g is string => !!g)),
      note,
      sortWert: note ? (kosten !== null ? runde(0.5 * note.halal + 0.5 * kosten) : note.gesamt) : 0,
    };
    if (offen.length > 0 || !bewertet) ungeprueft.push(treffer);
    else passt.push(treffer);
  }

  const ordnung = (p: Treffer, q: Treffer) => q.sortWert - p.sortWert || position.get(p.anbieter.id)! - position.get(q.anbieter.id)!;
  passt.sort(ordnung);
  ungeprueft.sort((p, q) => p.ungeprueft.length - q.ungeprueft.length || position.get(p.anbieter.id)! - position.get(q.anbieter.id)!);

  return { passt, ungeprueft, raus };
};
