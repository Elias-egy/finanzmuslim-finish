import { DEPOT_FINANZ_MAX, DEPOT_ZEILEN } from "@/data/brokerVergleich";
import { depotAnzeige } from "@/data/anzeige/depot";
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
// Seit VG2-04 (Regel 10) stehen auch Angebote mit belegtem, nicht abschaltbarem Zins auf der Liste, ganz hinten. Offen heißt: kein Beleg, kein Urteil.
const zins = (a: RohAnbieter) => a.werte.zinsfreiAbStart;
export const depotAbgeraten = rang.gerankt
  .filter((b) => zins(b.anbieter) === "schlecht")
  .map((b) => ({ anbieter: b.anbieter, grund: "Zinsen nicht abschaltbar" }));
export const depotOffen = rang.gerankt.filter((b) => zins(b.anbieter) !== "gut" && zins(b.anbieter) !== "teils" && zins(b.anbieter) !== "schlecht").length;
export const depotAnzahl = depotAnzeige.length;
export const depotOhneZinsen = rang.gerankt.filter((b) => zins(b.anbieter) === "gut" || zins(b.anbieter) === "teils").length;
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

/**
 * Der Text je Broker: nur, was die Karte darunter nicht schon sagt (SEO86 reviewer, am Handy höchstens vier Zeilen je Absatz). Die
 * Halal-Zählung und die Kosten stehen in der Häkchenliste und fallen aus dem Absatz. Es bleiben `zinsHinweis` (was du für null Zinsen
 * tust) und `kreditSache`, jeder Satz ein eigener Absatz.
 */
export const brokerText = (a: RohAnbieter): string[] =>
  [zinsHinweis("depot", a), kreditSache(a)].filter((s): s is string => !!s);

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

/** Der Sieger-Satz für den Anfang des Ratgebers: Name und Grund aus den Daten, nie von Hand. Ohne Sieger kein Satz. */
export const depotSiegerSatz = (): string | null => {
  const a = depotVorn.find((x) => x.id === depotSiegerId);
  if (!a) return null;
  const etf = anzahl(a, "halalEtfsFonds");
  // Grund gegen die Depots mit mehr Halal-ETFs (SEO86 MUSS 2): die Order, aber nur als einfacher Betrag aus den Daten. „Ohne Kredit ab Start“
  // steht nicht da: Die Daten kennen nur den Kredit-Hinweis für flatex (`kreditAbStart` „teils“), ein fehlender Hinweis ist keine Aussage.
  const order = /^(ab )?[\d,]+€$/.test(orderKurz(a)) ? `Order ${orderKurz(a)}` : "";
  const gruende = [
    a.werte.zinsfreiAbStart === "gut" ? "ohne Zinsen nutzbar" : "",
    order,
    etf ? `dort kaufst du ${etf.text}` : "",
  ].filter(Boolean);
  return `In unserem Vergleich liegt ${a.name} vorn${gruende.length ? `: ${gruende.join(", ")}` : ""}.`;
};

/** Niedrigster Betrag in Euro aus „1€ bis 5.000€“ oder „ab 0,95€“, sonst null. */
const erstesEuro = (text: string) => {
  const m = /(\d+(?:,\d+)?)\s?€/.exec(text);
  return m ? Number(m[1].replace(",", ".")) : null;
};
const namenReihe = (namen: string[]) =>
  namen.length < 2 ? (namen[0] ?? "") : `${namen.slice(0, -1).join(", ")} und ${namen[namen.length - 1]}`;

/** Halal-Sparplan: auf wie viele der Halal ETFs aus /blog/halal-etf die ersten fünf einen Sparplan haben. */
export const sparplanZeilen = () =>
  depotVorn
    .map((a) => ({ anbieter: a, auf: sparplanAuf(a.name), ab: sparrateAb(a) }))
    .filter((z) => z.auf !== null);
export const sparplanVon = etfListe.length;

/**
 * Woran ein Depot hängt, als ein Satz für alle Seiten (SEO82, Halal-Prüfer Fund 2): nicht abschließend („unter anderem“), mit dem
 * Kredit des Brokers. Beleg: ~/hourani/positionen/aktien.md Ep. 18 00:19:20 (Halal-Geschäftszweck) und 01:18:56 bis 01:19:04 („Margin ist
 * haram, dass der Broker dir so eine Art Zinsdarlehen gibt“), bankkonten.md Ep. 13 00:12:36 („Das ist Riba und Haram.“).
 */
export const DEPOT_HALAL_SATZ =
  "Ob dein Depot halal ist, hängt unter anderem davon ab, was du kaufst, ob dein Guthaben Zinsen bringt und ob du einen Kredit des Brokers nutzt.";

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
    antwort: `Ein Broker ist nicht von sich aus halal. Es zählt unter anderem, ob du das Depot ohne Zinsen nutzen kannst, ob du dort Halal-Anlagen kaufst und ob du einen Kredit des Brokers nutzt. Von den ${depotAnzahl} Depots in unserem Vergleich kannst du ${depotOhneZinsen} ohne Zinsen nutzen.`,
  });
  // „Ist Trade Republic halal?“ steht seit SEO82 auf /blog/trade-republic-alternative (Kein Doppel, Karte vergleich-depot.seo.json).
  for (const [id, name] of [["scalable-capital-free-broker", "Scalable Capital"]] as const) {
    const a = depotAnzeige.find((x) => x.id === id);
    if (!a) continue;
    f.push({
      frage: `Ist ${name} halal?`,
      antwort: [
        DEPOT_HALAL_SATZ,
        halalSatz(a, `Bei ${name}`),
        zinsHinweis("depot", a),
      ]
        .filter(Boolean)
        .join(" "),
    });
  }
  if (eins) {
    const sparab = depotVorn.map((a) => ({ a, v: erstesEuro(String(a.werte.sparrate ?? "")) })).filter((x) => x.v !== null);
    const minV = sparab.length ? Math.min(...sparab.map((x) => x.v as number)) : null;
    const guenstigStart = minV === null ? [] : sparab.filter((x) => x.v === minV).map((x) => x.a.name);
    const gratisDepot = depotVorn.filter((a) => a.werte.depotgebuehr === "0€").map((a) => a.name);
    const orders = depotVorn.map((a) => ({ a, v: erstesEuro(orderKurz(a)) })).filter((x) => x.v !== null);
    const minO = orders.length ? Math.min(...orders.map((x) => x.v as number)) : null;
    const guenstigOrder = minO === null ? [] : orders.filter((x) => x.v === minO).map((x) => x.a.name);
    if (gratisDepot.length >= 2 || guenstigOrder.length > 0) {
      f.push({
        frage: "Welches Depot hat die geringsten Kosten?",
        antwort: `${gratisDepot.length >= 2 ? `${gratisDepot.length === depotVorn.length ? `Bei allen ${depotVorn.length}` : `Bei ${gratisDepot.length} der ${depotVorn.length}`} Depots vorn kostet die Depotführung nichts: ${namenReihe(gratisDepot)}. ` : ""}${guenstigOrder.length > 0 && guenstigOrder.length < depotVorn.length ? `Bei der Order ist ${namenReihe(guenstigOrder)} am günstigsten. ` : ""}Alle Kosten stehen in der Tabelle oben. Halal und Kosten zählen in unserer Note je zur Hälfte.`,
      });
    }
    if (guenstigStart.length > 0 && minV !== null) {
      f.push({
        frage: "Wie viel Geld brauche ich zum Start?",
        antwort: `Du brauchst keine große Summe. Bei ${namenReihe(guenstigStart)} startet der ETF-Sparplan schon ab ${String(minV).replace(".", ",")} € im Monat. Du kannst klein anfangen.`,
      });
    }
  }
  f.push({
    frage: "Gibt es beim Broker ein islamisches Konto?",
    antwort:
      "Ein „islamisches Konto“ oder „swapfreies Konto“ bieten manche Broker für CFDs und Forex an. Darin fällt die Swap-Gebühr weg. Für ein Depot mit Halal ETFs brauchst du es nicht: Dort zählt, ob dein Guthaben ohne Zinsen liegt.",
  });
  // SEO86 (A14, höchstens 10 Fragen): „Welche Trading-App ist halal?“, „Mit welcher App kann ich halal investieren?“, „Welches Depot ist das
  // beste für Anfänger?“ und „Wie eröffne ich ein Depot?“ fielen weg, weil „Welcher ist der beste Broker“, „Was ist ein Halal-Broker?“ und der
  // Abschnitt „So eröffnest du dein Depot“ dasselbe sagen.
  return f;
};
