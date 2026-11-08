import { DEPOT_FINANZ_MAX, DEPOT_ZEILEN } from "@/data/brokerVergleich";
import { depotAnzeige } from "@/data/vergleichAnzeige";
import { kostenKurz } from "@/data/kostenKurz";
import { meisteHalalVon, type RohAnbieter } from "@/data/vergleichHelfer";
import { kreditKurz, kreditSache, zinsHinweis } from "@/data/zinsHinweise";
import { etfListe, sparplanAuf } from "@/data/halalEtfListe";
import { rangfolge } from "@/lib/rangfolge";
import { siegerDerSeite } from "@/lib/vergleichAssistent";

/**
 * Der Blogteil unter dem Depot-Vergleich (Elias SEO75: „komplett neu designt als Blogbeitrag“ wie Finanzfluss, Vault
 * raw/2026-11-08-elias-seo75-alles-gleichzeitig-live-depot-als-blogbeitrag.md). Jeder Satz entsteht aus denselben Daten
 * wie die Tabelle und nennt nie einen Platz: Ändert Elias die Rangfolge, ziehen Reihenfolge, Überschriften und Texte mit.
 */

const rang = rangfolge(depotAnzeige, "depot", { finanzMax: DEPOT_FINANZ_MAX });
const sieger = siegerDerSeite(depotAnzeige, "depot", DEPOT_FINANZ_MAX);

/** Reihenfolge wie in der Tabelle: die Nummer 1 zuerst, dann nach Platz. */
export const depotReihe: RohAnbieter[] = [
  ...(sieger ? [sieger] : []),
  ...rang.gerankt.map((b) => b.anbieter).filter((a) => a.id !== sieger?.id),
];
export const depotVorn = depotReihe.slice(0, 5);
export const depotSiegerId = sieger?.id ?? null;
export const depotMeisteHalalId = meisteHalalVon(
  depotAnzeige,
  DEPOT_ZEILEN,
  new Set(rang.gerankt.map((b) => b.anbieter.id)),
  sieger?.id,
);
export const depotNote = new Map(rang.gerankt.map((b) => [b.anbieter.id, b.note]));
export const depotAbgeraten = rang.abgeraten;
export const depotAnzahl = depotAnzeige.length;
export const depotOhneZinsen = rang.gerankt.length;
export const tradeRepublic = depotAnzeige.find((a) => a.id === "trade-republic-depot");

const ZAEHL: Record<string, [string, string]> = {
  halalEtfsFonds: ["Halal-ETFs und Fonds", "Halal-ETFs und Fonds"],
  halalSukuk: ["Sukuk", "Sukuk"],
  halalEdelmetalle: ["Gold- und Silber-ETCs", "Gold- und Silber-ETCs"],
};

/** „9 von 12“ wird „9 der 12 Halal-ETFs und Fonds“, „7 von 7“ wird „alle 7 …“. Ohne Zählung nichts. */
export const anzahl = (a: RohAnbieter, key: keyof typeof ZAEHL): { x: number; y: number; text: string } | null => {
  const m = /^(\d+) von (\d+)$/.exec(String(a.werte[key] ?? ""));
  if (!m) return null;
  const x = Number(m[1]);
  const y = Number(m[2]);
  const was = ZAEHL[key][0];
  return { x, y, text: x === y ? `alle ${y} ${was}` : `${x} der ${y} ${was}` };
};

const gross = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const klein = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

/** „1€ bis 7.500€“ wird „1€“. */
const sparrateAb = (a: RohAnbieter) => /^([\d.,]+\s?€)/.exec(String(a.werte.sparrate ?? ""))?.[1] ?? null;

const orderKurz = (a: RohAnbieter) => kostenKurz(a.id, "orderkosten") ?? String(a.werte.orderkosten ?? "");

/** Was eine Order mindestens kostet, als Zahl: „ab 9,95€“ wird 9.95. Sonst null. */
const orderAb = (a: RohAnbieter) => {
  const m = /^ab ([\d,]+)€/.exec(orderKurz(a));
  return m ? Number(m[1].replace(",", ".")) : null;
};

export type Punkt = { text: string };

/**
 * Höchstens ein Nachteil, in fester Folge (Plan SEO75): Kredit ab Start, dann Order ab 5 €, dann nur deutsche
 * Handelsplätze, dann weniger als 9 der 12 Halal-ETFs und Fonds. Ohne Treffer kein Kreuz.
 */
export const nachteil = (a: RohAnbieter): { art: "kredit" | "order" | "handelsplatz" | "etfs"; text: string } | null => {
  const kredit = kreditKurz("depot", a);
  if (kredit) return { art: "kredit", text: kredit };
  const ab = orderAb(a);
  if (ab !== null && ab >= 5) return { art: "order", text: `Order ab ${orderKurz(a).replace(/^ab /, "")}` };
  if (a.werte.handelsplaetze === "DE") return { art: "handelsplatz", text: "Nur deutsche Handelsplätze" };
  const etf = anzahl(a, "halalEtfsFonds");
  if (etf && etf.x < 9) return { art: "etfs", text: `${etf.y - etf.x} der ${etf.y} Halal-ETFs und Fonds fehlen` };
  return null;
};

export const vorteile = (a: RohAnbieter): Punkt[] => {
  const kreuz = nachteil(a);
  const p: Punkt[] = [];
  if (a.werte.zinsfreiAbStart === "gut") p.push({ text: "Ohne Zinsen nutzbar" });
  for (const key of ["halalEtfsFonds", "halalSukuk", "halalEdelmetalle"] as const) {
    if (key === "halalEtfsFonds" && kreuz?.art === "etfs") continue;
    const n = anzahl(a, key);
    if (n) p.push({ text: gross(n.text) });
  }
  if (a.werte.depotgebuehr === "0€") p.push({ text: "Kostenlose Depotführung" });
  if (kreuz?.art !== "order" && orderKurz(a)) p.push({ text: `Order: ${orderKurz(a)}` });
  const ab = sparrateAb(a);
  if (ab) p.push({ text: `ETF-Sparplan ab ${ab}${a.werte.etfSparplanKosten === "0€" ? ", kostenlos" : ""}` });
  return p;
};

/** „aus unserem Vergleich der Halal-Anlagen“ nur beim ersten Broker, sonst liest sich jeder Absatz wie aus einer Schablone (Prüfer SEO77). */
const halalSatz = (a: RohAnbieter, wer: string, herkunft = false) => {
  const teile = (["halalEtfsFonds", "halalSukuk", "halalEdelmetalle"] as const)
    .map((k) => anzahl(a, k)?.text)
    .filter((t): t is string => !!t);
  if (teile.length === 0) return "";
  const liste = teile.length > 1 ? `${teile.slice(0, -1).join(", ")} und ${teile[teile.length - 1]}` : teile[0];
  return `${wer} kaufst du ${liste}${herkunft ? " aus unserem Vergleich der Halal-Anlagen" : ""}.`;
};

/** Der Text je Broker: was du dort kaufst, was du für null Zinsen tust, was es kostet. */
export const brokerText = (a: RohAnbieter): string[] => {
  const kosten =
    a.werte.depotgebuehr === "0€"
      ? `Die Depotführung ist kostenlos, eine Order kostet ${orderKurz(a)}.`
      : `Das Depot kostet ${a.werte.depotgebuehr} im Jahr, eine Order ${orderKurz(a)}.`;
  return [halalSatz(a, `Bei ${a.name}`, a.id === depotVorn[0]?.id), zinsHinweis("depot", a), kosten, kreditSache(a)].filter(
    (s): s is string => !!s,
  );
};

/** Trade Republic Alternative: was es dort gibt, und wer von den ersten fünf mehr Halal-ETFs und Fonds führt. */
export const tradeRepublicText = () => {
  if (!tradeRepublic) return null;
  const tr = anzahl(tradeRepublic, "halalEtfsFonds");
  const mehr = tr
    ? depotVorn
        .map((a) => ({ a, n: anzahl(a, "halalEtfsFonds") }))
        .filter((x): x is { a: RohAnbieter; n: NonNullable<typeof x.n> } => !!x.n && x.n.x > tr.x)
        .sort((p, q) => q.n.x - p.n.x)
        .slice(0, 3)
    : [];
  return {
    saetze: [halalSatz(tradeRepublic, "Dort"), zinsHinweis("depot", tradeRepublic)].filter((s): s is string => !!s),
    mehr: mehr.map(({ a, n }) => ({ anbieter: a, zahl: `${n.x} von ${n.y}` })),
  };
};

/** Halal-Sparplan: auf wie viele der Halal ETFs aus /blog/halal-etf die ersten fünf einen Sparplan haben. */
export const sparplanZeilen = () =>
  depotVorn
    .map((a) => ({ anbieter: a, auf: sparplanAuf(a.name), ab: sparrateAb(a) }))
    .filter((z) => z.auf !== null);
export const sparplanVon = etfListe.length;

/** Zusätzliche Fragen aus der Secondary-Box der Karte vergleich-depot.seo.json, Antworten nur aus diesen Daten. */
export const depotFragen = (): Array<{ frage: string; antwort: string }> => {
  const f: Array<{ frage: string; antwort: string }> = [];
  const eins = depotVorn[0];
  if (eins) {
    const etf = anzahl(eins, "halalEtfsFonds");
    const zins = zinsHinweis("depot", eins)?.split(". ")[0];
    f.push({
      frage: "Welcher ist der beste Broker für Muslime?",
      antwort: `In unserem Vergleich liegt ${eins.name} vorn${etf ? `: Du kaufst dort ${etf.text}` : ""}${zins ? `, und ${klein(zins)}` : ""}. Welcher Broker zu dir passt, hängt davon ab, was du kaufen willst. Die Tabelle oben zeigt alle ${depotAnzahl} Depots.`,
    });
  }
  f.push({
    frage: "Was ist ein Halal-Broker?",
    antwort: `Ein Broker ist nicht von sich aus halal. Es zählt, ob du das Depot ohne Zinsen nutzen kannst und ob du dort Halal-Anlagen kaufst. Von den ${depotAnzahl} Depots in unserem Vergleich kannst du ${depotOhneZinsen} ohne Zinsen nutzen.`,
  });
  for (const [id, name] of [
    ["trade-republic-depot", "Trade Republic"],
    ["scalable-capital-free-broker", "Scalable Capital"],
  ] as const) {
    const a = depotAnzeige.find((x) => x.id === id);
    if (!a) continue;
    f.push({
      frage: `Ist ${name} halal?`,
      antwort: [
        "Ob dein Depot halal ist, hängt davon ab, was du kaufst und ob dein Guthaben Zinsen bringt.",
        halalSatz(a, `Bei ${name}`),
        zinsHinweis("depot", a),
      ]
        .filter(Boolean)
        .join(" "),
    });
  }
  f.push({
    frage: "Welche Trading-App ist halal?",
    antwort:
      "Eine App ist nicht von sich aus halal. Es zählt, ob dein Guthaben ohne Zinsen liegt und ob du Halal-Anlagen kaufst.",
  });
  const drei = depotVorn.slice(0, 3).map((a) => a.name);
  if (drei.length === 3) {
    f.push({
      frage: "Mit welcher App kann ich halal investieren?",
      antwort: `Mit jeder App aus unserem Vergleich, die du ohne Zinsen nutzen kannst. Vorn liegen ${drei[0]}, ${drei[1]} und ${drei[2]}: Dort kaufst du Halal ETFs, Sukuk und Gold in der App.`,
    });
  }
  f.push({
    frage: "Gibt es beim Broker ein islamisches Konto?",
    antwort:
      "Ein „islamisches Konto“ oder „swapfreies Konto“ bieten manche Broker für CFDs und Forex an. Darin fällt die Swap-Gebühr weg. Für ein Depot mit Halal ETFs brauchst du es nicht: Dort zählt, ob dein Guthaben ohne Zinsen liegt.",
  });
  f.push({
    frage: "Wie eröffne ich ein Depot?",
    antwort:
      "Du eröffnest das Depot online beim Anbieter, bestätigst deinen Ausweis, zahlst Geld ein und wählst deine erste Anlage. Was du tun musst, damit keine Zinsen anfallen, steht oben bei jedem Broker.",
  });
  return f;
};
