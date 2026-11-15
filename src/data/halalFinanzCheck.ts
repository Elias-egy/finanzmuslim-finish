/**
 * Halal-Finanz-Check (/check?quelle=…), RN5 15.11.2026.
 *
 * Auftrag Elias RN3-07 (Vault raw/2026-11-15-elias-rn3-07-uebergabe-phase1-quiz-flatex-nr1-zwei-localhosts.md): „dieses
 * Girokonto als ersten Step zu verkaufen“, „Girokonto kann man immer Norris Bank eigentlich empfehlen … BB Bank als
 * zweites, falls die Leute eine eigene Filiale brauchen“, „beim Broker dann vielleicht ein bisschen mehr
 * Personalisierung“, „3 Fragen“, „1, 2 gute Sachen nennen und dann nehmen … direkt auf den Partnerlink. Ohne eine
 * Zwischenbrücke“; flatex einzige Nummer 1, Smartbroker+ Nummer 2. Wortlaut der Fragen und Ergebnisse aus Elias'
 * Perspective-Fassung V7 (Vault hermes/renovierungskampagne/perspective/ki-chat-verlauf/neueste-fassung-vorher.html),
 * Plan im Vault-Laufzettel data/laufzettel/rn4-phase1-quiz-zwei-localhosts.md „Plan Schritt 3“.
 *
 * Bewusst nicht: Sterne, Prozent-Übereinstimmung, Zitate oder Nutzerzahlen (alles nur mit echten Stimmen von Elias),
 * „Beliebtester Start“ (ohne Zahl erfunden), Timer, Mail-Pflicht, ?email= in der Adresse,
 * „Der einfachste Boykott“ beim Boykott-Einstieg (zur Bank selbst gibt es keinen Boykott-Beleg).
 *
 * RN7 (15.11.2026): Look und Fragen 1:1 wie Elias' Perspective-Funnel (Vault hermes/renovierungskampagne/perspective/
 * eins-zu-eins/index.html). Etikett „beliebt“ (Elias RN6), Startfrage mit „Erst ein zinsfreies Konto, dann investieren“,
 * „Aktien aus der Liste kaufen“ entfällt. 50:50-Test mit einer Frage mehr auf dem Depot-Weg („Was ist dir wichtiger?“,
 * flatex gegen Smartbroker+), Elias' Wortlaut: Vault raw/2026-11-15-elias-rn7-02-quiz-bauen-frage-flatex-oder-smartbroker-test.md.
 * Fassung a = wie bisher (drei Fragen, Smartbroker+ nur beim kleinen Sparplan), Fassung b = mit der Frage mehr. Die
 * Fassung steht am Ende der Kennung am Partnerlink (a oder b), damit Abschlüsse je Fassung zählbar sind.
 *
 * Jede Zahl unten kommt aus den Vergleichsdaten: Girokonten aus girokontoBonus.ts (Belege mit Abrufdatum), Depots aus
 * brokerFreebie.ts (Depot-Vergleich plus flatex-Sparplan-Beleg).
 */
import { BBBANK_PRAEMIE, BONUS_KONTEN, euro, type BonusKonto } from "@/data/girokontoBonus";
import { BROKER_KARTEN, type BrokerKarte } from "@/data/brokerFreebie";
import type { Fassung } from "@/lib/abTest";

export type { Fassung };

/** Name des 50:50-Tests im Speicher des Besuchers (src/lib/abTest.ts, Schlüssel fm_ab_check-depotfrage). */
export const AB_TEST = "check-depotfrage";

/** Einstiege mit eigener Überschrift. Unbekannte Werte laufen als „homepage“. */
/** „quiz“ seit RN6 (15.11.2026): alle Wege, die früher ins alte Quiz /vergleich/start führten (Elias: „Check ersetzt Quiz“). */
export type CheckQuelle = "aktienliste" | "halal-anlagen" | "boykottliste" | "homepage" | "kopf" | "menue" | "quiz";

export const quelleAus = (wert: string | null | undefined): CheckQuelle =>
  wert === "aktienliste" || wert === "halal-anlagen" || wert === "boykottliste" || wert === "kopf" || wert === "menue" || wert === "quiz"
    ? wert
    : "homepage";

/** Nur diese Einstiege haben eine eigene Zeile unter der ersten Frage; die anderen zeigen UNTERZEILE. */
export const EIGENE_UEBERSCHRIFT: readonly CheckQuelle[] = ["aktienliste", "halal-anlagen", "boykottliste"];

/** Eine kurze Zeile je Einstieg: knüpft an das an, was die Person gerade gelesen hat (Perspective-Tipp 4 bis 8). Elias RN7: nicht länger als eine Zeile. */
export const UEBERSCHRIFT: Record<CheckQuelle, string> = {
  aktienliste: "Wo kaufst du die Aktien aus der Liste?",
  "halal-anlagen": "Wo kaufst du ETFs und Gold aus deiner Liste?",
  boykottliste: "Du achtest beim Einkaufen drauf. Und bei deinem Geld?",
  homepage: "Konto, Depot oder beides?",
  kopf: "Konto, Depot oder beides?",
  menue: "Konto, Depot oder beides?",
  quiz: "Konto, Depot oder beides?",
};

export const UNTERZEILE = "3 kurze Fragen. Danach weißt du, womit du halal startest.";

const konto = (id: string): BonusKonto => {
  const k = BONUS_KONTEN.find((x) => x.id === id);
  if (!k) throw new Error(`Girokonto fehlt: ${id}`);
  return k;
};
const depot = (id: string): BrokerKarte => {
  const d = BROKER_KARTEN.find((x) => x.id === id);
  if (!d) throw new Error(`Depot fehlt: ${id}`);
  return d;
};

const NORIS = konto("norisbank-top-girokonto");
const BB = konto("bbbank-bettersmart");
const FLATEX = depot("flatex-depot");
const SB = depot("smartbroker-plus-depot");

export type Ziel = "konto" | "invest" | "beides";
export type Depot = "nein" | "nicht-halal" | "halal";
export type Start = "konto" | "sparplan" | "etf-gold" | "einmal";
export type Filiale = "nein" | "ja";
/** „Was ist dir wichtiger?“ (nur Fassung b): viele Halal-Anlagen gleich flatex, niedrige Kosten gleich Smartbroker+. */
export type Praef = "halal" | "kosten";

export type Antworten = { ziel?: Ziel; depot?: Depot; start?: Start; filiale?: Filiale; praef?: Praef };

export type FrageId = "ziel" | "depot" | "start" | "filiale" | "praef";

export type Option = { wert: string; titel: string; unter?: string; etikett?: string };

export type Frage = { id: FrageId; titel: string; optionen: Option[] };

export const ETIKETT = "beliebt";

export const FRAGEN: Record<FrageId, Frage> = {
  ziel: {
    id: "ziel",
    titel: "Was willst du als Erstes halal machen?",
    optionen: [
      { wert: "konto", titel: "Mein Konto zinsfrei machen", unter: "Kostenlos, in 10 Minuten eröffnet", etikett: ETIKETT },
      { wert: "invest", titel: "Halal investieren", unter: "Aktien, ETFs oder Gold" },
      { wert: "beides", titel: "Beides", unter: "Konto und Depot" },
    ],
  },
  depot: {
    id: "depot",
    titel: "Hast du schon ein Depot?",
    optionen: [
      { wert: "nein", titel: "Nein, noch keins" },
      { wert: "nicht-halal", titel: "Ja, aber nicht halal" },
      { wert: "halal", titel: "Ja, schon halal" },
    ],
  },
  start: {
    id: "start",
    titel: "Wie willst du starten?",
    optionen: [
      { wert: "konto", titel: "Erst ein zinsfreies Konto, dann investieren", etikett: ETIKETT },
      { wert: "sparplan", titel: "Sparplan mit kleinem Betrag", unter: "Monatlich, schon ab 1 €" },
      { wert: "etf-gold", titel: "ETFs und Gold breit streuen" },
      { wert: "einmal", titel: "Einmal einen Betrag anlegen" },
    ],
  },
  filiale: {
    id: "filiale",
    titel: "Brauchst du eine Filiale vor Ort?",
    optionen: [
      { wert: "nein", titel: "Nein, alles per App reicht mir" },
      { wert: "ja", titel: "Ja, ich will in eine Filiale gehen können" },
    ],
  },
  praef: {
    id: "praef",
    titel: "Was ist dir wichtiger?",
    optionen: [
      { wert: "halal", titel: "Möglichst viele Halal-Anlagen", unter: `${FLATEX.etfs} Halal-ETFs und Fonds, ${FLATEX.gold} Edelmetalle` },
      { wert: "kosten", titel: "Möglichst niedrige Kosten", unter: `${SB.depotgebuehr} Depotgebühr, Sparplan ab ${SB.sparplanAb}` },
    ],
  },
};

/** Beim Einstieg aus der Aktien-Liste darf die Unterzeile einer Antwort auf die Liste Bezug nehmen (Elias RN7). */
export const unterFuer = (quelle: CheckQuelle, frage: FrageId, o: Option): string | undefined =>
  quelle === "aktienliste" && frage === "start" && o.wert === "einmal" ? "Zum Beispiel für die Aktien aus der Liste" : o.unter;

/** Die Frage „Was ist dir wichtiger?“ kommt nur in Fassung b, nach „Wie willst du starten?“. */
const mitPraef = (fassung: Fassung) => fassung === "b";

/** Welche Frage als Nächstes kommt; null, wenn das Ergebnis feststeht. Fassung a: höchstens drei Fragen, Fassung b auf dem Depot-Weg vier. */
export const naechsteFrage = (a: Antworten, fassung: Fassung = "a"): FrageId | null => {
  const startUndPraef = (): FrageId | null => {
    if (!a.start) return "start";
    return mitPraef(fassung) && !a.praef ? "praef" : null;
  };
  if (!a.ziel) return "ziel";
  if (a.ziel === "konto") return a.filiale ? null : "filiale";
  if (a.ziel === "invest") {
    if (!a.depot) return "depot";
    // Depot schon halal: der nächste Schritt ist das Konto (V7 „Dein Depot ist halal. Dein Konto auch?“).
    if (a.depot === "halal") return a.filiale ? null : "filiale";
    return startUndPraef();
  }
  // Beides: erst das Konto (Filiale), dann wie der Depot-Start aussieht.
  if (!a.filiale) return "filiale";
  return startUndPraef();
};

/** Zahl der Fragen auf dem Weg, den die Antworten bisher nehmen (für „Frage 2 von 3“). */
export const fragenGesamt = (a: Antworten, fassung: Fassung = "a"): number =>
  a.ziel === "konto" || (a.ziel === "invest" && a.depot === "halal") ? (a.ziel === "konto" ? 2 : 3) : mitPraef(fassung) ? 4 : 3;

export type ErgebnisArt = "konto" | "depot-halal-konto" | "depot" | "zweitdepot" | "beides";

export type Anbieter = { kurz: "fl" | "sb" | "no" | "bb"; out: string; name: string; domain: string; produkt: string };

export type Ergebnis = {
  art: ErgebnisArt;
  anbieter: Anbieter;
  /** Ein Satz, warum es passt (V7). */
  warum: string;
  /** Ein bis zwei Vorteile, nur aus den Vergleichsdaten. */
  vorteile: string[];
  /** Was der Leser selbst tun muss, damit es halal bleibt, ein Satz beim Produkt. */
  pflicht?: string;
  knopf: string;
  /** Kleiner zweiter Schritt darunter (Konto nach Depot oder Depot nach Konto). Ist es das Konto, steht es grün mit „beliebt“. */
  danach?: { satz: string; link: string; anbieter: Anbieter; konto: boolean };
  /** „Lieber die Alternative?“ beim Depot: die jeweils andere Bank. */
  alternative?: { link: string; anbieter: Anbieter };
};

const A_NORIS: Anbieter = { kurz: "no", out: NORIS.out, name: NORIS.name, domain: NORIS.domain, produkt: NORIS.produkt };
const A_BB: Anbieter = { kurz: "bb", out: BB.out, name: BB.name, domain: BB.domain, produkt: BB.produkt };
const A_FLATEX: Anbieter = { kurz: "fl", out: FLATEX.out, name: FLATEX.name, domain: FLATEX.domain, produkt: "Depot" };
const A_SB: Anbieter = { kurz: "sb", out: SB.out, name: SB.name, domain: SB.domain, produkt: "Depot" };

const kontofuehrung = (k: BonusKonto) =>
  `0 € Kontoführung unter ${k.gratisUnter} oder ab ${euro(k.gratisAb)} Geldeingang im Monat, sonst ${euro(k.sonst)}`;

const KONTO_PFLICHT = "Keine Zinsen auf dein Guthaben. Kommt ein Tagesgeldkonto dazu, lässt du es einfach leer.";

const kontoTeil = (filiale: Filiale | undefined) =>
  filiale === "ja"
    ? {
        anbieter: A_BB,
        vorteile: [kontofuehrung(BB), `${euro(BBBANK_PRAEMIE.betrag)} Startprämie für Neukunden`],
        warum: "Du willst in eine Filiale gehen können. Die BBBank hat Filialen und ein Konto ohne Guthabenzins.",
      }
    : {
        anbieter: A_NORIS,
        vorteile: [kontofuehrung(NORIS), NORIS.karte],
        warum: "Dein Geld liegt zinsfrei, und du musst noch nichts investieren. Alles läuft per App.",
      };

const FLATEX_VORTEILE = [
  `${FLATEX.etfs} Halal-ETFs und Fonds und ${FLATEX.gold} Edelmetalle aus meinem Vergleich`,
  `Sparplan ab ${FLATEX.sparplanAb}, ${FLATEX.depotgebuehr} Depotgebühr`,
];
const FLATEX_PFLICHT = "Bei flatex lehnst du bei der Eröffnung den Kreditrahmen ab.";
const SB_VORTEILE = [`Sparplan ab ${SB.sparplanAb}, ${SB.depotgebuehr} Depotgebühr`, `Order ${SB.order}`];

const FLATEX_TEIL = { anbieter: A_FLATEX, vorteile: FLATEX_VORTEILE, pflicht: FLATEX_PFLICHT as string | undefined };
const SB_TEIL = { anbieter: A_SB, vorteile: SB_VORTEILE, pflicht: undefined as string | undefined };

/**
 * Welches Depot und warum. Fassung a (wie bisher): Smartbroker+ nur beim kleinen Sparplan, sonst flatex.
 * Fassung b: „Was ist dir wichtiger?“ entscheidet, Halal-Auswahl gleich flatex, Kosten gleich Smartbroker+.
 */
const depotTeil = (start: Start | undefined, praef: Praef | undefined, fassung: Fassung) => {
  if (mitPraef(fassung) && praef) {
    return praef === "kosten"
      ? { ...SB_TEIL, warum: "Du willst möglichst niedrige Kosten. Dafür passt Smartbroker+." }
      : { ...FLATEX_TEIL, warum: "Du willst möglichst viele Halal-Anlagen. flatex hat in meinem Vergleich die größte Halal-Auswahl." };
  }
  if (start === "sparplan")
    return { ...SB_TEIL, warum: "Du willst klein anfangen und dranbleiben. Dafür brauchst du ein günstiges Depot mit Sparplan." };
  if (start === "etf-gold")
    return { ...FLATEX_TEIL, warum: "Du willst breit streuen. Bei flatex kaufst du Halal-ETFs und Gold an einem Ort." };
  if (start === "einmal")
    return { ...FLATEX_TEIL, warum: "Du willst einmal einen Betrag anlegen. flatex hat die meisten Halal-Anlagen aus meinem Vergleich." };
  return { ...FLATEX_TEIL, warum: "flatex hat die meisten Halal-Anlagen aus meinem Vergleich." };
};

/** Kennung am Knopf, nur Kleinbuchstaben und Ziffern (attribution.ts): fc, Quelle, Anbieter, „z“ für den kleinen zweiten Schritt, „x“ für die Alternative, am Ende die Fassung a oder b. */
const QUELLE_KURZ: Record<CheckQuelle, string> = {
  aktienliste: "ak",
  "halal-anlagen": "ha",
  boykottliste: "bo",
  homepage: "hp",
  kopf: "ko",
  menue: "me",
  quiz: "qz",
};
export const CHECK_SRC = /^fc(ak|ha|bo|hp|ko|me|qz)(fl|sb|no|bb)[zx]?[ab]?$/;
export const checkSrc = (quelle: CheckQuelle, anbieter: Anbieter, fassung: Fassung = "a", zusatz?: "z" | "x"): string =>
  `fc${QUELLE_KURZ[quelle]}${anbieter.kurz}${zusatz ?? ""}${fassung}`;
export const outLink = (quelle: CheckQuelle, anbieter: Anbieter, fassung: Fassung = "a", zusatz?: "z" | "x"): string =>
  `/out/${anbieter.out}?src=${checkSrc(quelle, anbieter, fassung, zusatz)}`;

/** Die zwei Depots gegeneinander: die jeweils andere Bank als kleine Alternative. */
const alternativeZu = (a: Anbieter, quelle: CheckQuelle, fassung: Fassung): Ergebnis["alternative"] => {
  const andere = a.kurz === "fl" ? A_SB : A_FLATEX;
  return { anbieter: andere, link: outLink(quelle, andere, fassung, "x") };
};

export const ergebnisAus = (a: Antworten, quelle: CheckQuelle, fassung: Fassung = "a"): Ergebnis | null => {
  if (naechsteFrage(a, fassung) !== null) return null;
  if (a.ziel === "konto") {
    const k = kontoTeil(a.filiale);
    return { art: "konto", ...k, pflicht: KONTO_PFLICHT, knopf: "Konto eröffnen" };
  }
  if (a.ziel === "invest" && a.depot === "halal") {
    const k = kontoTeil(a.filiale);
    return { art: "depot-halal-konto", ...k, warum: `Dein Depot ist halal. ${k.warum}`, pflicht: KONTO_PFLICHT, knopf: "Konto eröffnen" };
  }
  const kontoZuerst = a.ziel === "beides" || a.start === "konto";
  if (kontoZuerst) {
    // Beides oder „erst ein zinsfreies Konto, dann investieren“: Konto zuerst mit großem Knopf, darunter klein der Depot-Schritt.
    const k = kontoTeil(a.filiale);
    const d = depotTeil(a.start, a.praef, fassung);
    const zweit = a.ziel === "invest" && a.depot === "nicht-halal";
    return {
      art: "beides",
      ...k,
      pflicht: KONTO_PFLICHT,
      knopf: "Konto eröffnen",
      danach: {
        satz: `Schritt 2: dein ${zweit ? "Zweitdepot" : "Depot"} bei ${d.anbieter.name}`,
        link: outLink(quelle, d.anbieter, fassung, "z"),
        anbieter: d.anbieter,
        konto: false,
      },
    };
  }
  const d = depotTeil(a.start, a.praef, fassung);
  const zweit = a.depot === "nicht-halal";
  return {
    art: zweit ? "zweitdepot" : "depot",
    anbieter: d.anbieter,
    warum: zweit
      ? `Du hast schon ein Depot. Ein zweites nur für Halal-Anlagen kostet dich ${d.anbieter.kurz === "fl" ? FLATEX.depotgebuehr : SB.depotgebuehr} Depotgebühr und hält alles sauber getrennt.`
      : d.warum,
    vorteile: d.vorteile,
    pflicht: d.pflicht,
    knopf: zweit ? "Zweitdepot eröffnen" : "Depot eröffnen",
    danach: { satz: "Zinsfreies Girokonto bei der norisbank", link: outLink(quelle, A_NORIS, fassung, "z"), anbieter: A_NORIS, konto: true },
    alternative: alternativeZu(d.anbieter, quelle, fassung),
  };
};

/** „Deine Antworten“ im Ergebnis: je gegebene Antwort ein kurzes Häkchen. */
export const antwortZeilen = (a: Antworten): string[] => {
  const z: string[] = [];
  if (a.ziel) z.push({ konto: "Konto zinsfrei machen", invest: "Halal investieren", beides: "Konto und Depot" }[a.ziel]);
  if (a.depot) z.push({ nein: "Noch kein Depot", "nicht-halal": "Depot nicht halal", halal: "Depot schon halal" }[a.depot]);
  if (a.filiale) z.push(a.filiale === "ja" ? "Mit Filiale" : "Alles per App");
  if (a.start)
    z.push({ konto: "Erst ein Konto", sparplan: "Sparplan", "etf-gold": "ETFs und Gold", einmal: "Einmal anlegen" }[a.start]);
  if (a.praef) z.push(a.praef === "halal" ? "Viele Halal-Anlagen" : "Niedrige Kosten");
  return z;
};

export const WERBEHINWEIS =
  "*Werbelink: Wenn du über diesen Link eröffnest, bekomme ich eine Provision. Für dich ändert sich nichts. Keine Anlageberatung.";

/** Link zum Check aus einem Freebie oder der Startseite. */
export const checkLink = (quelle: CheckQuelle) => `/check?quelle=${quelle}`;
