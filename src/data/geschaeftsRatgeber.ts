import { geschaeftskontoAnzeige } from "@/data/anzeige/geschaeftskonto";
import { GESCHAEFT_FINANZ_MAX } from "@/data/finanzMax";
import type { RohAnbieter } from "@/data/vergleichHelfer";
import { zinsHinweis } from "@/data/zinsHinweise";
import { rangfolge } from "@/lib/rangfolge";
import { siegerDerSeite } from "@/lib/vergleichAssistent";

/**
 * Der Blogteil unter dem Geschäftskonto-Vergleich, gebaut wie der Girokonto-Teil (`giroRatgeber.ts`). Der Inhalt stammt aus dem
 * Beitrag „Bestes Geschäftskonto für Muslime“ (SEO84, 25.11.2026), den Elias unter den Vergleich legen ließ (SEO84-03: „Das musst
 * du eher unter den neuen Geschäftskonto-Vergleich packen“). Jede Zahl und jede Reihenfolge kommt aus denselben Daten wie die
 * Tabelle, nichts ist abgetippt. Jede Halal-Aussage steht so, wie sie im Beitrag mit Beleg stand.
 */

const rang = rangfolge(geschaeftskontoAnzeige, "geschaeftskonto", { finanzMax: GESCHAEFT_FINANZ_MAX });
/** Die Nummer 1 der Seite, auch wenn sie keinen Partnerlink hat (der Kasten und die Auszeichnung hängen am Link, die Liste nicht). */
export const geschaeftsSieger = siegerDerSeite(geschaeftskontoAnzeige, "geschaeftskonto", GESCHAEFT_FINANZ_MAX);
export const geschaeftsSiegerId = geschaeftsSieger?.id ?? null;

/** Reihenfolge wie in der Tabelle: die Nummer 1 zuerst, dann nach Platz. */
export const geschaeftsReihe: RohAnbieter[] = [
  ...(geschaeftsSieger ? [geschaeftsSieger] : []),
  ...rang.gerankt.map((b) => b.anbieter).filter((a) => a.id !== geschaeftsSieger?.id),
];

export const geschaeftsAnzahl = geschaeftskontoAnzeige.length;
export const geschaeftsAnbieter = new Set(geschaeftskontoAnzeige.map((a) => a.haus ?? a.id)).size;
export const geschaeftsOhneZinsen = geschaeftskontoAnzeige.filter((a) => a.werte.zinsfreiAbStart === "gut").length;

/**
 * Je Haus das erste Konto der Rangfolge (zwei N26-Tarife nebeneinander helfen dem Leser nicht, SEO84), nur Konten ohne
 * Guthabenzins, ohne Dispo ab Start und mit Karte ohne Kredit. Die fünf vorn sind „Konten im Test“.
 */
export const geschaeftsTop: RohAnbieter[] = (() => {
  const gesehen = new Set<string>();
  const aus: RohAnbieter[] = [];
  for (const a of geschaeftsReihe) {
    const haus = a.haus ?? a.id;
    if (gesehen.has(haus)) continue;
    gesehen.add(haus);
    if (a.werte.zinsfreiAbStart === "gut" && a.werte.keinDispoAbStart === "gut" && a.werte.karteOhneKredit === "gut") aus.push(a);
  }
  return aus.slice(0, 5);
})();

export const geschaeftsKt = geschaeftskontoAnzeige.find((a) => a.haus === "kt-bank") ?? null;
export const geschaeftsKonto = (id: string) => geschaeftskontoAnzeige.find((a) => a.id === id);

const w = (a: RohAnbieter, k: string) => String(a.werte[k] ?? "").trim();

export const geschaeftsName = (a: RohAnbieter) => `${a.name} ${a.produkt ?? ""}`.trim();
export const fuerWen = (a: RohAnbieter) => w(a, "fuerWen");
export const kontofuehrung = (a: RohAnbieter) => (w(a, "kontofuehrung") === "0 €" ? "0 € im Monat" : `${w(a, "kontofuehrung")} im Monat`);
export const unterkonten = (a: RohAnbieter) => {
  const u = w(a, "unterkonten");
  return u === "Unbegrenzt" ? "beliebig viele" : u === "Keine" ? "keine" : u;
};

/** „Am besten für“ je Haus (höchstens sechs Wörter), aus Rechtsform und Kosten der Daten; ohne Eintrag die Zeile „Für wen“. */
const BEST_FUER: Record<string, string> = {
  n26: "Freiberufler mit Unterkonten",
  vivid: "GmbH und UG ohne Grundgebühr",
  accountable: "Freiberufler, Gewerbe und GbR",
  bunq: "Bargeld einzahlen ohne Gebühr",
  ing: "OHG und KG mit Bargeld",
};
export const bestFuer = (a: RohAnbieter) => BEST_FUER[a.haus ?? ""] ?? fuerWen(a);

/** Häkchen je Konto, nur Werte aus der Tabelle des Vergleichs. */
export const vorteile = (a: RohAnbieter): Array<{ text: string }> => {
  const p: string[] = [];
  if (a.werte.zinsfreiAbStart === "gut") p.push("Ohne Zinsen nutzbar");
  if (a.werte.keinDispoAbStart === "gut") p.push("Kein Dispo ab Start");
  if (a.werte.karteOhneKredit === "gut") p.push("Karte ohne Kredit");
  p.push(w(a, "kontofuehrung") === "0 €" ? "Kostenlose Kontoführung" : `Kontoführung: ${kontofuehrung(a)}`);
  if (w(a, "unterkonten") && w(a, "unterkonten") !== "Keine") p.push(`Unterkonten: ${unterkonten(a)}`);
  if (fuerWen(a)) p.push(`Für: ${fuerWen(a)}`);
  return p.map((text) => ({ text }));
};

/** Höchstens ein Kreuz: Bargeld einzahlen geht nicht. Ohne Treffer keins. */
export const nachteil = (a: RohAnbieter): { text: string } | null =>
  w(a, "einzahlen") === "Nicht möglich" ? { text: "Bargeld einzahlen nicht möglich" } : null;

/** Der Text je Konto: für wen, was du für null Zinsen tust, Dispo. */
export const kontoText = (a: RohAnbieter): string[] =>
  [
    `Am besten für ${bestFuer(a)}.`,
    zinsHinweis("geschaeftskonto", a) ?? "",
    a.werte.keinDispoAbStart === "gut" ? "Ein Dispo wird dir nach der Eröffnung nicht eingeräumt." : "",
  ].filter(Boolean);

/** Zeilen der Tabelle „Was passt zu wem“: je Bedarf das Konto mit dem besten Platz, das laut Daten dazu passt. Fehlt ein Konto, fällt die Zeile weg. */
export const geschaeftsWasPasst: { wenn: string; a: RohAnbieter }[] = (
  [
    { wenn: "Freiberufler oder Gewerbe bist und Unterkonten für die Steuer willst", a: geschaeftsKonto("n26-business-smart") },
    { wenn: "Freiberufler oder Gewerbe bist und im Monat nichts zahlen willst", a: geschaeftsKonto("n26-business-standard") },
    { wenn: "eine GbR, UG oder GmbH führst", a: geschaeftsKonto("vivid-business-free-start") },
    { wenn: "Bargeld einzahlen willst, ohne dafür zu zahlen", a: geschaeftsKonto("bunq-core-business") },
  ] as { wenn: string; a: RohAnbieter | undefined }[]
).filter((z): z is { wenn: string; a: RohAnbieter } => Boolean(z.a));

/** Merkmale des Siegers als „ohne Zinsen nutzbar, kein Dispo ab Start, die Karte ohne Kredit“. */
export const siegerMerkmale = (a: RohAnbieter): string[] =>
  [
    a.werte.zinsfreiAbStart === "gut" ? "ohne Zinsen nutzbar" : "",
    a.werte.keinDispoAbStart === "gut" ? "kein Dispo ab Start" : "",
    a.werte.karteOhneKredit === "gut" ? "die Karte ohne Kredit" : "",
  ].filter(Boolean);

/**
 * Fragen aus dem Beitrag, die `GESCHAEFT_FAQ` nicht schon beantwortet (nicht doppelt: Brauche ich ein Geschäftskonto, Dispo,
 * Zinskonten, Kosten, Reihenfolge stehen dort).
 */
export const geschaeftsFragen = (): Array<{ frage: string; antwort: string }> => {
  const eins = geschaeftsTop[0];
  const vivid = geschaeftsKonto("vivid-business-free-start");
  const f: Array<{ frage: string; antwort: string }> = [];
  f.push({
    frage: "Welches ist das beste Geschäftskonto für Muslime?",
    antwort: `In unserem Vergleich steht ${eins ? geschaeftsName(eins) : "ein Konto ohne Zinsen"} vorn. Es ist für ${eins ? fuerWen(eins) : "Selbstständige"}. Für eine GbR, UG oder GmbH steht ${vivid ? geschaeftsName(vivid) : "ein anderes Konto"} am weitesten vorn.`,
  });
  f.push({
    frage: "Gibt es ein islamisches Geschäftskonto in Deutschland?",
    antwort:
      "Die KT Bank schreibt über sich, sie sei die „erste und einzige Bank in Deutschland und in der Eurozone mit islamkonformem Geschäftsmodell“. Ihr Geschäftskonto wird laut Antrag unverzinslich und ohne Dispo geführt, eröffnen kannst du es in einer Filiale. Daneben gibt es Konten anderer Banken, die laut Anbieter ohne Zinsen und ohne Dispo laufen.",
  });
  f.push({
    frage: "Ist ein Geschäftskonto mit Zinsen haram?",
    antwort:
      "Zinsen sind Riba, und Riba ist im Islam verboten. Darum stehen in unserem Vergleich zuerst Konten, deren Guthaben nicht verzinst wird. Zahlt ein Anbieter Zinsen auf das Guthaben, steht sein Konto ganz hinten.",
  });
  f.push({
    frage: "Wie kann ich ein KT Bank Geschäftskonto eröffnen?",
    antwort:
      "Nur persönlich in einer Filiale der KT Bank. Die Bank schreibt, dass ihre Geschäftskundenberater dort die Eröffnung mit dir machen. Eine Online-Eröffnung für das Geschäftskonto nennt sie nicht.",
  });
  return f;
};
