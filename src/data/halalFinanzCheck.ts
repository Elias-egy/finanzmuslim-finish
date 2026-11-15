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
 * RN8 (15.11.2026, Elias raw/2026-11-15-elias-rn8-02-bank-suchen-nebeneinander-nur-ein-ergebnis.md und rn8-03-depot-nicht-fragen-wo-prozent-passung.md):
 * Zwei Arten auf einem Gerüst, ?art=konto (Bankkonto-Check) oder ?art=depot (Depot-Check), ohne art die erste Frage „Was willst du
 * als Erstes halal machen?“ (Konto und Beides führen in den Bankkonto-Weg, Investieren in den Depot-Weg). Bankkonto-Check: zwei Fragen
 * („Wie bezahlst du meistens?“, „Bei welcher Bank bist du heute?“ als Suchleiste), Ergebnis stellt die heutige Bank neben die norisbank.
 * Depot-Check: keine Frage nach dem heutigen Depot, das Ergebnis nennt, zu wie viel Prozent das Depot passt (berechnet, passungProzent).
 * In beiden Ergebnissen ein Knopf, kein zweiter Weg („Die Leute sollen nur auf den Abschluss konzentriert sein“).
 *
 * Bewusst nicht: Sterne, Prozent-Übereinstimmung, Zitate oder Nutzerzahlen (alles nur mit echten Stimmen von Elias),
 * „Beliebtester Start“ (ohne Zahl erfunden), Timer, Mail-Pflicht, ?email= in der Adresse,
 * „Der einfachste Boykott“ beim Boykott-Einstieg (zur Bank selbst gibt es keinen Boykott-Beleg).
 *
 * RN7 (15.11.2026): Look 1:1 wie Elias' Perspective-Funnel (Vault hermes/renovierungskampagne/perspective/eins-zu-eins/index.html).
 * Fragen nach Elias' Rückmeldung (Vault raw/2026-11-15-elias-rn7-03-allgemeiner-check-fragen-noch-nicht-gut.md): ein allgemeiner
 * Check, alle Quellen sehen dieselben Fragen, die Quelle steckt nur in der Kennung. Konto-Weg: Filiale. Depot-Weg: Erfahrung, dann
 * „Was ist dir wichtiger?“ (flatex gegen Smartbroker+), „Ich habe schon ein Depot“ führt zum Zweitdepot bei Smartbroker+.
 * 50:50-Test (Elias RN7-02/03): Fassung a drei Fragen, Fassung b auf dem Depot-Weg eine mehr („Wie viel möchtest du im Monat anlegen?“,
 * ändert das Ergebnis nicht). Die Fassung steht am Ende der Kennung am Partnerlink (a oder b), damit Abschlüsse je Fassung zählbar sind.
 */
import { BBBANK_PRAEMIE, BONUS_KONTEN, euro, type BonusKonto } from "@/data/girokontoBonus";
import { BROKER_KARTEN, type BrokerKarte } from "@/data/brokerFreebie";
import type { Fassung } from "@/lib/abTest";
import { bankPreis, type BankWahl } from "@/data/bankSuche";
import { depotWerte, type DepotWahl, type DepotWerte } from "@/data/depotSuche";

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

/** Eine kurze Zeile je Einstieg, nur im Freebie-Kasten (CheckEinstieg.tsx). Im Check selbst sehen alle Quellen dieselben Fragen (Elias RN7-03). Knüpft an das an, was die Person gerade gelesen hat (Perspective-Tipp 4 bis 8). Elias RN7: nicht länger als eine Zeile. */
export const UEBERSCHRIFT: Record<CheckQuelle, string> = {
  aktienliste: "Wo kaufst du die Aktien aus der Liste?",
  "halal-anlagen": "Wo kaufst du ETFs und Gold aus deiner Liste?",
  boykottliste: "Du achtest beim Einkaufen drauf. Und bei deiner Bank?",
  homepage: "Konto, Depot oder beides?",
  kopf: "Konto, Depot oder beides?",
  menue: "Konto, Depot oder beides?",
  quiz: "Konto, Depot oder beides?",
};

/** Welche Art ein Freebie-Einstieg öffnet (RN8): Boykott-Liste Bankkonto-Check, die zwei Anlagen-Listen Depot-Check. */
export const ART_JE_QUELLE: Partial<Record<CheckQuelle, Art>> = {
  boykottliste: "konto",
  aktienliste: "depot",
  "halal-anlagen": "depot",
};

export const UNTERZEILE = "Danach weißt du, womit du halal startest.";

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

/** Die zwei Arten (RN8): Bankkonto-Check und Depot-Check, in der Adresse als ?art=konto oder ?art=depot. */
export type Art = "konto" | "depot";
export const artAus = (wert: string | null | undefined): Art | undefined => (wert === "konto" || wert === "depot" ? wert : undefined);

/**
 * Erste Frage jedes direkten Einstiegs (Elias RN8-06): „Was suchst du gerade?“. Neues Bankkonto und Noch unsicher führen in den
 * Bankkonto-Weg (der leichteste Schritt, KONTO bringt 57 % der Leser-Einnahmen), Depot in den Depot-Weg. „beides“ bleibt nur für
 * alte Adressen (?ziel=beides) und wird nicht mehr angeboten.
 */
export type Ziel = "konto" | "invest" | "unsicher" | "beides";
const ZIEL_ART: Record<Ziel, Art> = { konto: "konto", invest: "depot", unsicher: "konto", beides: "konto" };
/** „Wie bezahlst du meistens?“: nur „bar“ führt zur BBBank (Filiale), alle anderen zur norisbank. */
export type Zahlung = "karte" | "karte-bar" | "bar";
/** „Wie viel Erfahrung hast du mit dem Investieren?“ „depot“ fragt danach „Wo hast du dein Depot?“ (RN10), die anderen zwei führen gleich zu „Was ist dir wichtiger?“. */
export type Erfahrung = "keine" | "erste" | "depot";
/** „Was ist dir wichtiger?“: viele Halal-Anlagen gleich flatex, niedrige Kosten gleich Smartbroker+. */
export type Praef = "halal" | "kosten";
/** Nur Fassung b: „Wie viel möchtest du im Monat anlegen?“. Ändert nicht das Depot, aber die Passung in Prozent. */
export type Betrag = "unter50" | "50bis200" | "ueber200";
/**
 * „Welche dieser drei Eigenschaften ist dir am wichtigsten?“ (Elias RN9-04), die Frage in der Mitte nach „Was ist dir wichtiger?“.
 * Drei Eigenschaften je Weg, jede steht belegt im Depot-Vergleich (brokerVergleich.ts) oder mit Beleg in brokerStart.ts (Übertrag ohne
 * Gebühren); „wechsel“ nur nach „Ich habe schon ein Depot“. Die Antwort verschiebt die Gewichte in passungProzent, nie das Depot selbst.
 */
export type Eigenschaft = "gold-sukuk" | "sparplan" | "gebuehr" | "order" | "wechsel";

export type Antworten = {
  art?: Art;
  ziel?: Ziel;
  zahlung?: Zahlung;
  /** Die Bank von heute, nur im Bankkonto-Check. Bleibt im Zustand der Seite, nie in der Adresse. */
  bank?: BankWahl;
  erfahrung?: Erfahrung;
  praef?: Praef;
  /** Das Depot von heute, nur nach „Ich habe schon ein Depot“. Bleibt im Zustand der Seite, nie in der Adresse. */
  depotHeute?: DepotWahl;
  eigenschaft?: Eigenschaft;
  betrag?: Betrag;
};

export type FrageId = "ziel" | "zahlung" | "bank" | "erfahrung" | "depotHeute" | "praef" | "eigenschaft" | "betrag";

export type Option = { wert: string; titel: string; unter?: string; etikett?: string };

/** `warum` ist die erste Sprechblase (ein Satz, warum Elias fragt), `titel` die zweite (die Frage selbst). */
export type Frage = { id: FrageId; warum: string; titel: string; optionen: Option[] };

/** Grünes Etikett an „Neues Bankkonto“ (Elias RN8-06: „in grün am beliebtesten“). */
export const ETIKETT = "am beliebtesten";

/** „89 Angebote selbst getestet“ auf der Verkaufsseite (Elias RN8: „getestet, nie eröffnet“). */
export const ANGEBOTE_GETESTET = 89;
/** Im Chat wie im Original aufgeteilt: 35 Depots und 54 Girokonten (Elias RN8-06 bestätigt, Wort „getestet“). */
export const DEPOTS_GETESTET = 35;
export const KONTEN_GETESTET = 54;

/** Zweite Frage nach „Noch unsicher“: statt des Grundes ein Satz, der den Bankkonto-Weg erklärt. */
export const UNSICHER_SATZ = "Kein Problem. Dann fang mit dem Konto an, das ist der leichteste Schritt.";

export const FRAGEN: Record<FrageId, Frage> = {
  ziel: {
    id: "ziel",
    warum: `Salam! Ich habe ${DEPOTS_GETESTET} Depots und ${KONTEN_GETESTET} Girokonten selbst getestet, um Muslimen zu helfen, und will dir nur das zeigen, was wirklich zu dir passt.`,
    titel: "Was suchst du gerade?",
    optionen: [
      { wert: "konto", titel: "Neues Bankkonto", etikett: ETIKETT },
      { wert: "invest", titel: "Depot zum Investieren" },
      { wert: "unsicher", titel: "Noch unsicher" },
    ],
  },
  zahlung: {
    id: "zahlung",
    warum: "Damit ich weiß, ob du eine Filiale brauchst.",
    titel: "Wie bezahlst du meistens?",
    optionen: [
      { wert: "karte", titel: "Fast nur mit Karte" },
      { wert: "karte-bar", titel: "Karte und ab und zu Bargeld" },
      { wert: "bar", titel: "Viel Bargeld, ich will in eine Filiale" },
    ],
  },
  bank: {
    id: "bank",
    warum: "Damit du siehst, was sich bei dir ändert.",
    titel: "Bei welcher Bank bist du heute?",
    optionen: [],
  },
  erfahrung: {
    id: "erfahrung",
    warum: "Dann weiß ich, wie viel ich dir erklären muss.",
    titel: "Wie viel Erfahrung hast du mit dem Investieren?",
    optionen: [
      { wert: "keine", titel: "Noch keine", unter: "Ich fange gerade an" },
      { wert: "erste", titel: "Erste Schritte", unter: "Sparplan oder ein paar Aktien" },
      { wert: "depot", titel: "Ich habe schon ein Depot", unter: "Ich kaufe selbst" },
    ],
  },
  depotHeute: {
    id: "depotHeute",
    warum: "Dann stelle ich dein Depot neben das, was besser zu dir passt.",
    titel: "Wo hast du dein Depot?",
    optionen: [],
  },
  praef: {
    id: "praef",
    warum: "Kein Depot ist bei allem vorn. Deshalb frage ich, was dir zählt.",
    titel: "Was ist dir wichtiger?",
    optionen: [
      { wert: "halal", titel: "Möglichst viele Halal-Anlagen", unter: `${FLATEX.etfs} Halal-ETFs und Fonds, ${FLATEX.gold} Edelmetalle` },
      { wert: "kosten", titel: "Möglichst niedrige Kosten", unter: `${SB.depotgebuehr} Depotgebühr, Sparplan ab ${SB.sparplanAb}` },
    ],
  },
  eigenschaft: {
    id: "eigenschaft",
    warum: "Noch eine Frage, dann rechne ich aus, wie gut es zu dir passt.",
    titel: "Welche dieser drei Eigenschaften ist dir am wichtigsten?",
    // Die Antworten hängen vom Weg ab (frageFuer, EIGENSCHAFTEN_JE_WEG).
    optionen: [],
  },
  betrag: {
    id: "betrag",
    warum: "Damit ich genauer sagen kann, wie gut es zu dir passt.",
    titel: "Wie viel möchtest du im Monat anlegen?",
    optionen: [
      { wert: "unter50", titel: "Unter 50 €" },
      { wert: "50bis200", titel: "50 bis 200 €" },
      { wert: "ueber200", titel: "Über 200 €" },
    ],
  },
};

/** Die Eigenschaften mit ihrem Text, alle belegt im Depot-Vergleich oder in brokerStart.ts (wechselUrl mit Beleg). */
export const EIGENSCHAFT_TEXT: Record<Eigenschaft, string> = {
  "gold-sukuk": "Gold und Sukuk im selben Depot",
  sparplan: "Sparplan schon ab 1 €",
  gebuehr: "Keine Depotgebühr",
  order: "Günstig einzelne Aktien kaufen",
  wechsel: "Einfacher Wechsel von meinem Depot",
};

/**
 * Drei Eigenschaften je Weg (Elias RN9-04: „Aber es muss halt auch passen“). Wer noch kein Depot hat, sieht nie „Wechsel“; wer schon
 * eins hat, sieht ihn zuerst statt des Sparplans ab 1 €.
 */
export const eigenschaftenFuer = (a: Antworten): Eigenschaft[] => {
  const wechsel = a.erfahrung === "depot";
  if (a.praef === "kosten") return wechsel ? ["wechsel", "gebuehr", "order"] : ["gebuehr", "order", "sparplan"];
  return wechsel ? ["wechsel", "gold-sukuk", "gebuehr"] : ["gold-sukuk", "sparplan", "gebuehr"];
};

/** Die Frage mit den Antworten, die zum Weg passen (nur „eigenschaft“ hängt vom Weg ab). */
export const frageFuer = (id: FrageId, a: Antworten): Frage =>
  id === "eigenschaft"
    ? { ...FRAGEN.eigenschaft, optionen: eigenschaftenFuer(a).map((e) => ({ wert: e, titel: EIGENSCHAFT_TEXT[e] })) }
    : FRAGEN[id];

/** Fassung b fragt auf dem Depot-Weg zusätzlich nach dem Monatsbetrag (50:50-Test, Elias RN7-03: sinkt oder steigt der Abschluss mit einer Frage mehr?). */
const mitBetrag = (fassung: Fassung) => fassung === "b";

/** Die Art, die die Antworten bisher haben: aus der Adresse (?art=) oder aus der ersten Frage. */
export const artVon = (a: Antworten): Art | undefined => a.art ?? (a.ziel ? ZIEL_ART[a.ziel] : undefined);

/** Die erste Frage der Art (die Freebie-Kästen stellen sie selbst, der Check geht bei Frage 2 weiter). */
export const ersteFrage = (art: Art): FrageId => (art === "konto" ? "zahlung" : "erfahrung");

/**
 * Welche Frage als Nächstes kommt; null, wenn das Ergebnis feststeht.
 * Bankkonto: Wie bezahlst du, Bank von heute. Depot (RN10): Erfahrung, bei „schon ein Depot“ „Wo hast du dein Depot?“, dann
 * „Was ist dir wichtiger?“ und „Welche dieser drei Eigenschaften …“, in Fassung b zuletzt der Monatsbetrag. Ohne art zuerst
 * „Was suchst du gerade?“.
 */
export const naechsteFrage = (a: Antworten, fassung: Fassung = "a"): FrageId | null => {
  const art = artVon(a);
  if (!art) return "ziel";
  if (art === "konto") {
    if (!a.zahlung) return "zahlung";
    return a.bank ? null : "bank";
  }
  if (!a.erfahrung) return "erfahrung";
  if (a.erfahrung === "depot" && !a.depotHeute) return "depotHeute";
  if (!a.praef) return "praef";
  if (!a.eigenschaft) return "eigenschaft";
  return mitBetrag(fassung) && !a.betrag ? "betrag" : null;
};

/** Zahl der Fragen auf dem Weg, den die Antworten bisher nehmen (für den Fortschritt). */
export const fragenGesamt = (a: Antworten, fassung: Fassung = "a"): number => {
  const art = artVon(a);
  const vorn = a.ziel || !a.art ? 1 : 0;
  if (!art) return 3;
  if (art === "konto") return vorn + 2;
  // Erfahrung, Was ist dir wichtiger, Eigenschaft; bei „schon ein Depot“ dazu „Wo hast du dein Depot?“.
  const haupt = a.erfahrung === "depot" ? 4 : 3;
  return vorn + haupt + (mitBetrag(fassung) ? 1 : 0);
};

export type Anbieter = { kurz: "fl" | "sb" | "no" | "bb"; out: string; name: string; domain: string; produkt: string };

export type Zeile = { label: string; wert: string; zusatz?: string[] };
export type Spalte = { name: string; domain?: string; produkt?: string; zeilen: Zeile[] };

/**
 * Ergebnis wie die Ergebnisseite des Originals (RN10, Elias RN9-01 und -03, Bilder Vault hermes/renovierungskampagne/perspective/
 * rn9-ergebnis/01 und 02): groß „Dein Match: …“, ein grauer Satz aus den eigenen Antworten, die Karte des Anbieters mit Logo,
 * genauen Vorteilen (nur belegte Werte) und einem Knopf, darunter die heutige Bank oder das heutige Depot gegen das Match als Liste
 * („nicht passt auch gut, sondern sozusagen eine Liste Sparkasse und Norris Bank im Vergleich“).
 */
export type KontoErgebnis = {
  art: "konto";
  anbieter: Anbieter;
  /** „Dein Match: ein kostenloses Girokonto bei norisbank“ (Elias RN9-01 wortgleich). */
  ueberschrift: string;
  /** Ein Satz aus den Antworten, grau unter der Überschrift wie im Original. */
  satz: string;
  /** Kartentitel und Preiszeile wie im Original („Girokonto ohne Kontoführungsgebühr“, „0 € im Monat“). */
  kartenTitel: string;
  preis: string;
  /** Genaue Vorteile, nur aus girokontoBonus.ts (belegt). */
  vorteile: string[];
  /** Die Bank von heute ist schon die empfohlene: freundlicher Satz, kein Knopf. */
  schonDa: boolean;
  /** Links die heutige Bank, fehlt bei „Noch kein Konto“. */
  links?: Spalte;
  rechts: Spalte;
  /** „Sparkasse und norisbank im Vergleich“, fehlt ohne heutige Bank. */
  vergleichTitel?: string;
  /** Ein Satz, wie bei jedem Konto aus Elias' Vergleich (KONTO_PFLICHT). */
  pflicht: string;
  knopf: string;
  link?: string;
  /** Nur BBBank: kleiner Zusatz zur Startprämie. */
  praemie?: string;
};

export type DepotErgebnis = {
  art: "depot";
  anbieter: Anbieter;
  ueberschrift: string;
  /** Ein Satz, warum es passt, aus den Antworten. */
  satz: string;
  kartenTitel: string;
  preis: string;
  /** Genaue Vorteile, nur aus den Vergleichsdaten und brokerStart.ts. */
  vorteile: string[];
  /** Was der Leser selbst tun muss, damit es halal bleibt, ein Satz beim Produkt. */
  pflicht?: string;
  knopf: string;
  link: string;
  /** „Übereinstimmung mit deinen Antworten“, berechnet in passungProzent, höchstens 98. */
  passung: number;
  /** Nur nach „Ich habe schon ein Depot“: das heutige Depot ist schon das Match. */
  schonDa: boolean;
  /** Nur nach „Ich habe schon ein Depot“: heutiges Depot links, Match rechts. */
  links?: Spalte;
  rechts?: Spalte;
  vergleichTitel?: string;
};

export type Ergebnis = KontoErgebnis | DepotErgebnis;

const A_NORIS: Anbieter = { kurz: "no", out: NORIS.out, name: NORIS.name, domain: NORIS.domain, produkt: NORIS.produkt };
const A_BB: Anbieter = { kurz: "bb", out: BB.out, name: BB.name, domain: BB.domain, produkt: BB.produkt };
const A_FLATEX: Anbieter = { kurz: "fl", out: FLATEX.out, name: FLATEX.name, domain: FLATEX.domain, produkt: "Depot" };
const A_SB: Anbieter = { kurz: "sb", out: SB.out, name: SB.name, domain: SB.domain, produkt: "Depot" };

export const KONTO_PFLICHT = "Keine Zinsen auf dein Guthaben. Kommt ein Tagesgeldkonto dazu, lässt du es einfach leer.";

/** Text beim Konto wie im Vergleich (girokontoBonus.ts): 0 € unter 30 oder ab 500 € Geldeingang, sonst 3,90 €. */
const kontoBedingung = (k: BonusKonto) => `unter ${k.gratisUnter} oder ab ${euro(k.gratisAb)} Geldeingang im Monat, sonst ${euro(k.sonst)}`;

export const KEIN_PREIS = "steht in deinem Kontoauszug";
/** Für ein Depot ohne Werte im Vergleich (Sparkasse, Volksbank, freie Eingabe): nie eine geratene Zahl. */
export const KEIN_WERT = "–";

/** Spalte einer Empfehlung (rechts): nur Werte aus girokontoBonus.ts und kontopreise.ts. */
const empfehlungSpalte = (k: BonusKonto, mitEroeffnung: boolean): Spalte => ({
  name: k.name,
  domain: k.domain,
  produkt: k.produkt,
  zeilen: [
    { label: "Kontoführung im Monat", wert: "0 €", zusatz: [kontoBedingung(k)] },
    ...(mitEroeffnung ? [{ label: "Eröffnung", wert: k.ident }] : []),
  ],
});

/** Spalte der heutigen Bank (links): nur belegte Werte, sonst „steht in deinem Kontoauszug“, nie eine geratene Zahl. */
const bankSpalte = (w: BankWahl): { spalte: Spalte; mitEroeffnung: boolean } => {
  const p = bankPreis(w);
  const spalte: Spalte = {
    name: w.name,
    domain: w.domain,
    produkt: p?.produkt,
    zeilen: [{ label: "Kontoführung im Monat", wert: p?.wert ?? KEIN_PREIS, zusatz: p ? p.zusatz.slice(1) : undefined }],
  };
  if (p?.eroeffnung) spalte.zeilen.push({ label: "Eröffnung", wert: p.eroeffnung });
  return { spalte, mitEroeffnung: Boolean(p?.eroeffnung) };
};

/** Genaue Vorteile eines Kontos, nur Felder aus girokontoBonus.ts (jedes mit Beleg dort). */
const kontoVorteile = (k: BonusKonto): string[] => [
  `0 € Kontoführung ${kontoBedingung(k)}`,
  k.karte,
  `Bargeld: ${k.bargeld.charAt(0).toLowerCase()}${k.bargeld.slice(1)}`,
  `Eröffnung per ${k.ident}`,
];

const ZAHLUNG_SATZ: Record<Zahlung, string> = {
  karte: "Du zahlst fast nur mit Karte.",
  "karte-bar": "Du zahlst mit Karte und ab und zu bar.",
  bar: "Du zahlst viel bar und willst eine Filiale.",
};

const kontoErgebnis = (a: Antworten, quelle: CheckQuelle, fassung: Fassung): KontoErgebnis => {
  const k = a.zahlung === "bar" ? BB : NORIS;
  const anbieter = k === BB ? A_BB : A_NORIS;
  const bank = a.bank;
  const haus = k === BB ? "bbbank" : "norisbank";
  const schonDa = bank?.kind === "bank" && bank.id === haus;
  const praemie = k === BB ? `${euro(BBBANK_PRAEMIE.betrag)} Startprämie für Neukunden` : undefined;
  const bei = k === BB ? "der BBBank" : "norisbank";
  const basis = {
    art: "konto" as const,
    anbieter,
    ueberschrift: `Dein Match: ein kostenloses Girokonto bei ${bei}`,
    satz: `${a.zahlung ? ZAHLUNG_SATZ[a.zahlung] + " " : ""}Dafür passt ${k === BB ? "die BBBank mit Filialen" : "die norisbank"}: Konto ohne Zinsen auf dein Guthaben, Karte inklusive.`,
    kartenTitel: "Girokonto ohne Zinsen auf dein Guthaben",
    preis: "0 € im Monat",
    vorteile: kontoVorteile(k),
  };

  if (schonDa) {
    return {
      ...basis,
      ueberschrift: "Du hast schon ein Konto ohne Zinsen auf dein Guthaben",
      satz: `Bei ${bei} bist du richtig.`,
      schonDa: true,
      rechts: empfehlungSpalte(k, true),
      pflicht: `Bei ${bei} bist du richtig. Kommt ein Tagesgeldkonto dazu, lässt du es einfach leer.`,
      knopf: "",
    };
  }

  let links: Spalte | undefined;
  let mitEroeffnung = true;
  let vergleichTitel: string | undefined;
  if (bank && bank.kind !== "keine") {
    const b = bankSpalte(bank);
    links = b.spalte;
    mitEroeffnung = b.mitEroeffnung;
    vergleichTitel = `${bank.kind === "frei" ? "Deine Bank" : bank.name} und ${anbieter.name} im Vergleich`;
  }
  return {
    ...basis,
    schonDa: false,
    links,
    rechts: empfehlungSpalte(k, mitEroeffnung),
    vergleichTitel,
    pflicht: KONTO_PFLICHT,
    knopf: "Konto eröffnen",
    link: outLink(quelle, anbieter, fassung),
    praemie,
  };
};

const FLATEX_PFLICHT = "Bei flatex lehnst du bei der Eröffnung den Kreditrahmen ab.";

/** „Übertrag ohne Gebühren“: flatex FAQ Depotübertrag „Unsererseits werden für die Übertragung keine Gebühren erhoben“, Smartbroker+ „Der Übertrag innerhalb Deutschlands ist komplett kostenfrei“ (brokerStart.ts, wechselUrl). */
const WECHSEL_VORTEIL: Record<"fl" | "sb", string> = {
  fl: "Übertrag deines Depots: flatex nimmt keine Gebühren",
  sb: "Übertrag deines Depots innerhalb Deutschlands kostenfrei",
};

/** Genaue Vorteile, nur Werte aus brokerFreebie.ts (Depot-Vergleich) und brokerStart.ts. Die gewählte Eigenschaft steht zuerst. */
const depotVorteile = (d: BrokerKarte, kurz: "fl" | "sb", e: Eigenschaft | undefined): string[] => {
  const zeilen: Partial<Record<Eigenschaft | "etfs", string>> = {
    etfs: `${d.etfs} Halal-ETFs und Fonds aus meinem Vergleich`,
    "gold-sukuk": `Gold und Silber ${d.gold}, Sukuk ${d.sukuk}`,
    sparplan: `Sparplan ab ${d.sparplanAb}`,
    gebuehr: `${d.depotgebuehr} Depotgebühr`,
    order: `Order ${d.order}`,
    wechsel: WECHSEL_VORTEIL[kurz],
  };
  const reihe: (Eigenschaft | "etfs")[] =
    kurz === "fl" ? ["etfs", "gold-sukuk", "sparplan", "gebuehr"] : ["gebuehr", "order", "sparplan", "etfs", "gold-sukuk"];
  if (e) reihe.unshift(e);
  const gesehen = new Set<string>();
  return reihe.filter((k) => !gesehen.has(k) && gesehen.add(k)).map((k) => zeilen[k] as string).slice(0, 4);
};

/** Welches Depot: „Was ist dir wichtiger?“ entscheidet, Halal-Auswahl gleich flatex, Kosten gleich Smartbroker+ (Elias RN7). */
const depotTeil = (praef: Praef | undefined) =>
  praef === "kosten"
    ? { anbieter: A_SB, karte: SB, kurz: "sb" as const, pflicht: undefined as string | undefined, satz: "Du willst möglichst niedrige Kosten. Dafür passt Smartbroker+." }
    : {
        anbieter: A_FLATEX,
        karte: FLATEX,
        kurz: "fl" as const,
        pflicht: FLATEX_PFLICHT as string | undefined,
        satz: "Du willst möglichst viele Halal-Anlagen. flatex hat in meinem Vergleich die größte Halal-Auswahl.",
      };

// ---------------------------------------------------------------------------
// Passung in Prozent (Elias RN8-03: „zu so und so viel Prozent passt es zu dir“, Learning 33: nie eine feste Zahl)

/**
 * Wie die Passung gerechnet wird. Jedes Depot bekommt je Merkmal einen Anteil von 0 bis 1 aus den Vergleichsdaten
 * (brokerFreebie.ts, Depot-Vergleich), jedes Merkmal hat ein Gewicht, das aus den Antworten folgt:
 *  - Halal-Anlagen: 60 % Halal-ETFs und Fonds (x von y), je 20 % Edelmetalle und Sukuk (x von y);
 *    bei der Eigenschaft „Gold und Sukuk“ 40/30/30.
 *  - Kosten: 40 % Depotgebühr (0 € ist voll), 60 % Ordergebühr im Verhältnis zur Monatsrate (10 % und mehr ist null);
 *    bei „Keine Depotgebühr“ 70/30, bei „Günstig einzelne Aktien kaufen“ 20/80.
 *    Die Monatsrate ist die Mitte der Antwort (unter 50 € gleich 25 €, 50 bis 200 € gleich 125 €, über 200 € gleich 300 €),
 *    ohne Antwort (Fassung a) 100 €.
 *  - Sparplan: ab 1 € ist voll, jeder Euro mehr kostet 1/24; kein Sparplan ist null.
 *  - Ohne Zinsen: voll, wenn der Vergleich beim Depot kein Guthabenzins zeigt (gut), halb bei abschaltbar (teils).
 * Gewichte: „Was ist dir wichtiger?“ Halal 45 und Kosten 20 (umgekehrt bei Kosten). Sparplan 15 bei „Noch keine“ und
 * „Erste Schritte“, sonst 5. Ohne Zinsen 10. Die Eigenschaft (RN9-04) legt auf ihr Merkmal 10 dazu (Sparplan 15, Wechsel:
 * Halal 10 und ohne Zinsen 5, damit alles, was du hast, mitziehen kann).
 * Passung = Summe der Gewicht mal Anteil, geteilt durch die Summe der Gewichte, gerundet, höchstens 98.
 */
export const PASSUNG_MAX = 98;

const anteilVon = (s: string | null): number => {
  const m = s?.match(/(\d+)\s+von\s+(\d+)/);
  return m ? Number(m[1]) / Number(m[2]) : 0;
};
const ersterEuro = (s: string | null): number => {
  const m = s?.match(/(\d+(?:[.,]\d+)?)\s?€/);
  return m ? Number(m[1].replace(",", ".")) : 0;
};
const MONATSRATE: Record<Betrag, number> = { unter50: 25, "50bis200": 125, ueber200: 300 };

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

/** Werte einer Brokerkarte in der Form der Depotsuche, damit beide Depots gleich gerechnet werden. */
const werteVonKarte = (k: BrokerKarte): DepotWerte => ({
  etfs: k.etfs,
  gold: k.gold,
  sukuk: k.sukuk,
  depotgebuehr: k.depotgebuehr,
  order: k.order,
  sparplanAb: k.sparplanAb,
  zinsfrei: k.zinsfrei ? "gut" : "schlecht",
});

/** Hat ein Depot alle Werte, die die Passung braucht? Sonst wird für es keine Zahl gezeigt. */
export const passungRechenbar = (w: DepotWerte | null): w is DepotWerte =>
  Boolean(w && w.etfs && w.gold && w.sukuk && w.depotgebuehr && w.order && w.sparplanAb && w.zinsfrei);

export const passungAusWerten = (w: DepotWerte, a: Antworten): number => {
  const e = a.eigenschaft;
  const [pEtf, pGold, pSukuk] = e === "gold-sukuk" ? [0.4, 0.3, 0.3] : [0.6, 0.2, 0.2];
  const halal = pEtf * anteilVon(w.etfs) + pGold * anteilVon(w.gold) + pSukuk * anteilVon(w.sukuk);
  const rate = a.betrag ? MONATSRATE[a.betrag] : 100;
  // Prozentuale Depotgebühr („0,2%“) zählt wie eine hohe Gebühr.
  const gebuehrProzent = /%/.test(w.depotgebuehr ?? "") && !/^0\s?€/.test(w.depotgebuehr ?? "");
  const order = 1 - clamp01(ersterEuro(w.order) / rate / 0.1);
  const gebuehr = gebuehrProzent ? 0 : 1 - clamp01(ersterEuro(w.depotgebuehr) / 5);
  const [pGeb, pOrder] = e === "gebuehr" ? [0.7, 0.3] : e === "order" ? [0.2, 0.8] : [0.4, 0.6];
  const kosten = pGeb * gebuehr + pOrder * order;
  const sparplan = w.sparplanAb === "kein Sparplan" ? 0 : clamp01(1 - (ersterEuro(w.sparplanAb) - 1) / 24);
  const zinsfrei = w.zinsfrei === "gut" ? 1 : w.zinsfrei === "teils" ? 0.5 : 0;

  let wHalal = a.praef === "halal" ? 45 : a.praef === "kosten" ? 20 : 40;
  let wKosten = a.praef === "kosten" ? 45 : 20;
  let wSparplan = a.erfahrung === "depot" ? 5 : 15;
  let wZinsfrei = 10;
  if (e === "gold-sukuk") wHalal += 10;
  if (e === "gebuehr" || e === "order") wKosten += 10;
  if (e === "sparplan") wSparplan += 15;
  if (e === "wechsel") {
    wHalal += 10;
    wZinsfrei += 5;
  }
  const summe = wHalal + wKosten + wSparplan + wZinsfrei;
  const punkte = wHalal * halal + wKosten * kosten + wSparplan * sparplan + wZinsfrei * zinsfrei;
  return Math.min(PASSUNG_MAX, Math.round((100 * punkte) / summe));
};

export const passungProzent = (karte: BrokerKarte, a: Antworten): number => passungAusWerten(werteVonKarte(karte), a);

/** Zeilen der Depot-Liste „<heute> und <Match> im Vergleich“, alle aus dem Depot-Vergleich. */
const ZINS_TEXT: Record<"gut" | "teils" | "schlecht", string> = {
  gut: "ohne Zinsen",
  teils: "Zinsen abschaltbar",
  schlecht: "Zinsen nicht abschaltbar",
};
const depotZeilen = (w: DepotWerte | null, passung: number | null): Zeile[] => {
  const v = (x: string | null | undefined) => x ?? KEIN_WERT;
  return [
    { label: "Passt zu deinen Antworten", wert: passung === null ? KEIN_WERT : `${passung} %` },
    { label: "Halal-ETFs und Fonds", wert: v(w?.etfs) },
    { label: "Gold und Silber", wert: v(w?.gold) },
    { label: "Sukuk", wert: v(w?.sukuk) },
    { label: "Depotgebühr", wert: v(w?.depotgebuehr) },
    { label: "Order", wert: v(w?.order) },
    { label: "Sparplan ab", wert: v(w?.sparplanAb) },
    { label: "Guthaben", wert: w?.zinsfrei ? ZINS_TEXT[w.zinsfrei] : KEIN_WERT },
  ];
};

const depotErgebnis = (a: Antworten, quelle: CheckQuelle, fassung: Fassung): DepotErgebnis => {
  const d = depotTeil(a.praef);
  const passung = passungProzent(d.karte, a);
  const heute = a.depotHeute;
  const schonDa = heute?.kind === "depot" && heute.id === d.karte.id;
  const basis = {
    art: "depot" as const,
    anbieter: d.anbieter,
    ueberschrift: d.kurz === "fl" ? "Dein Match: ein Halal-Depot bei flatex" : "Dein Match: ein günstiges Halal-Depot bei Smartbroker+",
    satz: d.satz,
    kartenTitel: d.kurz === "fl" ? "Depot mit der größten Halal-Auswahl" : "Depot ohne Depotgebühr",
    preis: `${d.karte.depotgebuehr} Depotgebühr`,
    vorteile: depotVorteile(d.karte, d.kurz, a.eigenschaft),
    pflicht: d.pflicht,
    knopf: "Depot eröffnen",
    link: outLink(quelle, d.anbieter, fassung),
    passung,
    schonDa,
  };
  if (!heute) return basis;
  if (schonDa) {
    return { ...basis, ueberschrift: `Dein Depot bei ${d.anbieter.name} passt schon`, satz: `Bei ${d.anbieter.name} bist du richtig.` };
  }
  const w = depotWerte(heute);
  const heutePassung = passungRechenbar(w) ? passungAusWerten(w, a) : null;
  return {
    ...basis,
    links: { name: heute.kind === "frei" ? heute.name || "Dein Depot" : heute.name, domain: heute.domain, zeilen: depotZeilen(w, heutePassung) },
    rechts: { name: d.anbieter.name, domain: d.anbieter.domain, zeilen: depotZeilen(werteVonKarte(d.karte), passung) },
    vergleichTitel: `${heute.kind === "frei" ? "Dein Depot" : heute.name} und ${d.anbieter.name} im Vergleich`,
  };
};
/** Kennung am Knopf, nur Kleinbuchstaben und Ziffern (attribution.ts): fc, Quelle, Anbieter, am Ende die Fassung a oder b. Die Quelle (?quelle=) steckt nur hier, die Bank von heute nie. */
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

export const ergebnisAus = (a: Antworten, quelle: CheckQuelle, fassung: Fassung = "a"): Ergebnis | null => {
  if (naechsteFrage(a, fassung) !== null) return null;
  return artVon(a) === "konto" ? kontoErgebnis(a, quelle, fassung) : depotErgebnis(a, quelle, fassung);
};
/** „Deine Antworten“ im Depot-Ergebnis: je gegebene Antwort ein kurzes Häkchen. */
export const antwortZeilen = (a: Antworten): string[] => {
  const z: string[] = [];
  if (a.ziel) z.push({ konto: "Neues Bankkonto", invest: "Depot zum Investieren", unsicher: "Noch unsicher", beides: "Konto und Depot" }[a.ziel]);
  if (a.zahlung) z.push({ karte: "Fast nur mit Karte", "karte-bar": "Karte und Bargeld", bar: "Viel Bargeld" }[a.zahlung]);
  if (a.erfahrung) z.push({ keine: "Noch keine Erfahrung", erste: "Erste Schritte", depot: "Schon ein Depot" }[a.erfahrung]);
  if (a.depotHeute) z.push(`Depot bei ${a.depotHeute.name}`);
  if (a.praef) z.push(a.praef === "halal" ? "Viele Halal-Anlagen" : "Niedrige Kosten");
  if (a.eigenschaft) z.push(EIGENSCHAFT_TEXT[a.eigenschaft]);
  if (a.betrag) z.push({ unter50: "Unter 50 € im Monat", "50bis200": "50 bis 200 € im Monat", ueber200: "Über 200 € im Monat" }[a.betrag]);
  return z;
};

export const WERBEHINWEIS =
  "*Werbelink: Wenn du über diesen Link eröffnest, bekomme ich eine Provision. Für dich ändert sich nichts. Keine Anlageberatung.";

/** Link zum Check aus einer Stelle ohne eigene Art (Startseite, Menü): /check?quelle=… */
export const checkLink = (quelle: CheckQuelle) => `/check?quelle=${quelle}`;

/** Freebie-Kasten: die erste Antwort steckt in der Adresse, der Chat geht bei Frage 2 weiter (RN8). */
export const checkEinstiegLink = (art: Art, quelle: CheckQuelle, wert: string) => `/check?art=${art}&quelle=${quelle}&start=2&a1=${wert}`;

/** Gültige erste Antwort aus der Adresse (?a1=) für die Art, sonst nichts. */
export const ersteAntwortAus = (art: Art, wert: string | null): Antworten => {
  const id = ersteFrage(art);
  if (!wert || !FRAGEN[id].optionen.some((o) => o.wert === wert)) return {};
  return { art, [id]: wert } as Antworten;
};

/** Messgruppe der Bank von heute fürs Ereignis: nie der freie Text. */
export const bankGruppeFuerMessung = (a: Antworten): string => a.bank?.gruppe ?? "";
