import kurseJson from "@/data/kurse.json";

export type Kurs = {
  name?: string;
  waehrung?: string;
  kurs?: number | null;
  /** Monatsschlusskurse, [Monat, Kurs]. Rückfall, wenn nichts Feineres da ist. */
  reihe?: [string, number][];
  /** Wochenschlusskurse, [Datum, Kurs]. Für 3J und 5J. */
  reihe_w?: [string, number][];
  /** Tagesschlusskurse der letzten zwölf Monate. Für 1T bis 1J. */
  reihe_t?: [string, number][];
  status?: string;
  /** Von außen vorberechnete Renditen. Nur noch für den Renditerechner in
   *  Gebrauch (siehe ReturnCalculator.tsx), der eine einzelne
   *  Fünfjahresrendite für die Hochrechnung braucht. Die Übersichts- und
   *  Detailseiten lesen stattdessen live aus reihe_t/reihe_w/reihe, siehe
   *  `zeitraumReihe` unten, damit beide Seiten immer denselben Wert zeigen. */
  r1m: number | null;
  r6m: number | null;
  r1j: number | null;
  r5j: number | null;
  verlauf: number[];
};

type KurseDatei = {
  stand: string;
  quelle: string;
  anlagen: Record<string, Kurs>;
  krypto?: Record<string, Kurs>;
};

const daten = kurseJson as unknown as KurseDatei;

/** "19.08.2026" — genau das Datum aus den Kursdaten, nie das Gerätedatum. */
export const kursStand = daten.stand;
export const kursQuelle = daten.quelle;

export const kursFuerIsin = (isin: string): Kurs | undefined => daten.anlagen[isin];
export const kursFuerKrypto = (key: string): Kurs | undefined => daten.krypto?.[key];

/** Eine Zugriffsstelle für beides. Krypto liegt unter dem Namen, Wertpapiere
 *  unter der ISIN. Die Oberfläche soll den Unterschied nicht kennen müssen. */
export const kursFuerAnlage = (a: { isin?: string; kursKey?: string }): Kurs | undefined =>
  a.kursKey ? kursFuerKrypto(a.kursKey) : a.isin ? kursFuerIsin(a.isin) : undefined;

/** Kurs mit Währung, für die Zeile rechts. */
export const kursText = (k: Kurs | undefined): string | null => {
  if (!k || k.kurs == null) return null;
  const zahl = k.kurs.toLocaleString("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const w = k.waehrung === "EUR" ? "€" : k.waehrung === "USD" ? "$" : k.waehrung === "GBP" ? "£" : "";
  return w ? `${zahl} ${w}` : zahl;
};

/* ---------------------------------------------------------------------------
   Ein Zeitraum-System für Übersicht und Detailseite. Vorher hatte die Tabelle
   vier eigene, von außen vorberechnete Zeiträume (r1m/r6m/r1j/r5j) und die
   Detailgrafik fünf eigene, live aus der Kursreihe berechnete (1m/3m/1j/3j/5j).
   Zwei Systeme, die bei 1M und 1J zufällig denselben Namen trugen, aber nicht
   zwingend denselben Wert lieferten. Jetzt gibt es nur noch dieses eine, beide
   Seiten lesen aus derselben Funktion.
--------------------------------------------------------------------------- */

export type ChartZeitraum = "1t" | "1m" | "3m" | "6m" | "1j" | "3j" | "5j";

/** Ein selbst gewählter Zeitraum, beide Enden als "YYYY-MM-DD". */
export type EigenerZeitraum = { von: string; bis: string };

export type ZeitraumWert = ChartZeitraum | EigenerZeitraum;

export const istEigenerZeitraum = (w: ZeitraumWert): w is EigenerZeitraum => typeof w === "object";

export const chartZeitraeume: { key: ChartZeitraum; kurz: string; lang: string; tage: number }[] = [
  { key: "1t", kurz: "1T", lang: "einem Tag", tage: 1 },
  { key: "1m", kurz: "1M", lang: "einem Monat", tage: 31 },
  { key: "3m", kurz: "3M", lang: "drei Monaten", tage: 93 },
  { key: "6m", kurz: "6M", lang: "sechs Monaten", tage: 186 },
  { key: "1j", kurz: "1J", lang: "einem Jahr", tage: 366 },
  { key: "3j", kurz: "3J", lang: "drei Jahren", tage: 1100 },
  { key: "5j", kurz: "5J", lang: "fünf Jahren", tage: 1830 },
];

/** "19.08.2026" -> "2026-08-19", zum Rechnen mit den ISO-Daten der Kursreihen. */
const kursStandIso = (() => {
  const m = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(kursStand);
  return m ? `${m[3]}-${m[2]}-${m[1]}` : kursStand;
})();

/** "2026-08" (Monatsreihe) auf den Monatsersten normieren, damit sich
 *  Monats-, Wochen- und Tagesdaten als Text vergleichen lassen. */
const normDatum = (d: string) => (d.length === 7 ? `${d}-01` : d);

const vorTagen = (tage: number): string => {
  const d = new Date(`${kursStandIso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - tage);
  return d.toISOString().slice(0, 10);
};

/** "2025-08-18" plus x Tage, für die Kulanzgrenze unten. */
const datumPlusTagen = (iso: string, tage: number): string => {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + tage);
  return d.toISOString().slice(0, 10);
};

export type Ausschnitt = {
  reihe: [string, number][];
  takt: "Tagesschlusskurse" | "Wochenschlusskurse" | "Monatsschlusskurse";
  /** Reicht die zugrundeliegende Reihe bis an den Anfang des Zeitraums heran? */
  vollstaendig: boolean;
};

const LEER: Ausschnitt = { reihe: [], takt: "Tagesschlusskurse", vollstaendig: true };

type Serie = { reihe: [string, number][] | undefined; takt: Ausschnitt["takt"] };

/** Kurz und lang: für 1M bis 1J wird die feinste verfügbare Reihe genommen,
 *  für 3J und 5J beginnt es gleich bei Wochenkursen. Fünf Jahre aus 254
 *  Tagespunkten wären ohnehin nur der letzte Bruchteil davon. */
const serienKurz = (k: Kurs): Serie[] => [
  { reihe: k.reihe_t, takt: "Tagesschlusskurse" },
  { reihe: k.reihe_w, takt: "Wochenschlusskurse" },
  { reihe: k.reihe, takt: "Monatsschlusskurse" },
];
const serienLang = (k: Kurs): Serie[] => [
  { reihe: k.reihe_w, takt: "Wochenschlusskurse" },
  { reihe: k.reihe, takt: "Monatsschlusskurse" },
];

/** Erste Serie, die im gewünschten Fenster mindestens zwei Punkte hat, egal
 *  ob sie bis an den Anfang des Fensters heranreicht. Für den selbst
 *  gewählten Zeitraum: dort ist auch ein unvollständiger Ausschnitt richtig,
 *  Hauptsache die feinste verfügbare Auflösung. */
const ausSerieBestmoeglich = (serien: Serie[], abDatum: string, bisDatum?: string): Ausschnitt => {
  for (const { reihe, takt } of serien) {
    if (!reihe || reihe.length < 3) continue;
    const ausschnitt = reihe.filter(([d]) => {
      const n = normDatum(d);
      return n >= abDatum && (!bisDatum || n <= bisDatum);
    });
    if (ausschnitt.length >= 2) {
      const erstesInSerie = normDatum(reihe[0][0]);
      return { reihe: ausschnitt, takt, vollstaendig: erstesInSerie <= abDatum };
    }
  }
  return LEER;
};

/** Drei Wochen Kulanz auf den Anfang einer Serie. Die Kursquelle liefert
 *  Monats- und Wochenreihen als fertige Eimer, keine taggenaue Reihe: eine
 *  "Fünfjahresreihe" beginnt mit dem ersten erfassten Monat, der je nach
 *  Abrufdatum ein paar Wochen nach dem taggenauen Fünfjahresdatum liegt. Ohne
 *  Toleranz würde "5J" bei praktisch jeder älteren Anlage als unvollständig
 *  gelten, obwohl real fünf Jahre Kursverlauf vorliegen. */
const KULANZ_TAGE = 21;

/** Für die festen Zeiträume: erste Serie, die bis an den Anfang des Fensters
 *  heranreicht (mit Kulanz). Die Tagesreihe deckt nur die letzten zwölf
 *  Monate ab: reicht sie für "1J" ein paar Tage nicht ganz, muss die
 *  Wochenreihe ran, statt fälschlich "keine Daten" bei einer Anlage zu
 *  zeigen, die es seit Jahren gibt. Eine Serie mit zu wenigen Punkten, aber
 *  vollständiger Abdeckung kommt nicht vor: alle drei Reihen haben deutlich
 *  mehr als zwei Punkte, sobald sie überhaupt bis dahin zurückreichen. */
const ausSerieVollstaendig = (serien: Serie[], abDatum: string): Ausschnitt => {
  const grenze = datumPlusTagen(abDatum, KULANZ_TAGE);
  for (const { reihe, takt } of serien) {
    if (!reihe || reihe.length < 3) continue;
    if (normDatum(reihe[0][0]) > grenze) continue;
    const ausschnitt = reihe.filter(([d]) => normDatum(d) >= abDatum);
    if (ausschnitt.length >= 2) return { reihe: ausschnitt, takt, vollstaendig: true };
  }
  return LEER;
};

/**
 * Kursreihe für einen Zeitraum, fest oder selbst gewählt.
 *
 * Bei den festen Zeiträumen (1M, 3M, 6M, 1J, 3J, 5J) zählt nur eine
 * vollständige Abdeckung: reicht die Kursreihe nicht bis an den Anfang des
 * Zeitraums heran, kommt "keine Daten" zurück statt einer Zahl, die nur einen
 * Teil des Zeitraums misst, aber unter dessen Namen liefe. "5J: +61 %" bei
 * einer Anlage, die erst seit drei Jahren notiert, wäre eine erfundene
 * Fünfjahresrendite.
 *
 * Beim selbst gewählten Zeitraum gilt das nicht: dort zeigt die Funktion, was
 * an echten Daten im gewählten Fenster liegt, auch wenn das weniger ist als
 * angefragt. Die Kachel oben in der Grafik weist dann selbst darauf hin.
 */
export const zeitraumReihe = (kurs: Kurs | undefined, wert: ZeitraumWert): Ausschnitt => {
  if (!kurs) return LEER;

  if (istEigenerZeitraum(wert)) {
    const { von, bis } = wert;
    if (!von || !bis || von > bis) return LEER;
    return ausSerieBestmoeglich(serienKurz(kurs), von, bis);
  }

  if (wert === "1t") {
    const t = kurs.reihe_t;
    if (!t || t.length < 2) return LEER;
    return { reihe: t.slice(-2), takt: "Tagesschlusskurse", vollstaendig: true };
  }

  const tage = chartZeitraeume.find((z) => z.key === wert)?.tage ?? 366;
  const abDatum = vorTagen(tage);
  const serien = wert === "3j" || wert === "5j" ? serienLang(kurs) : serienKurz(kurs);
  return ausSerieVollstaendig(serien, abDatum);
};

/** Veränderung zwischen erstem und letztem Punkt einer Reihe, in Prozent. */
export const spanneVeraenderung = (reihe: [string, number][]): number | null => {
  if (reihe.length < 2) return null;
  const start = reihe[0][1];
  const ende = reihe[reihe.length - 1][1];
  if (!start) return null;
  return Math.round(((ende - start) / start) * 1000) / 10;
};

/** Veränderung zwischen den letzten zwei verfügbaren Schlusskursen, für die
 *  "Seit dem vorherigen Schlusskurs"-Anzeigen (Tagesgewinner, 1T-Tab). */
export const tagesVeraenderung = (kurs: Kurs | undefined): number | null =>
  spanneVeraenderung(zeitraumReihe(kurs, "1t").reihe);

export const renditeText = (wert: number | null | undefined) =>
  wert === null || wert === undefined
    ? null
    : `${wert > 0 ? "+" : wert < 0 ? "−" : ""}${Math.abs(wert).toFixed(1).replace(".", ",")} %`;
