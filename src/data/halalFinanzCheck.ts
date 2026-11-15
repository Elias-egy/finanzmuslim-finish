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
 * „Beliebtester Start“ (ohne Zahl erfunden, darum „Leichtester Start“), Timer, Mail-Pflicht, ?email= in der Adresse,
 * „Der einfachste Boykott“ beim Boykott-Einstieg (zur Bank selbst gibt es keinen Boykott-Beleg).
 *
 * Jede Zahl unten kommt aus den Vergleichsdaten: Girokonten aus girokontoBonus.ts (Belege mit Abrufdatum), Depots aus
 * brokerFreebie.ts (Depot-Vergleich plus flatex-Sparplan-Beleg).
 */
import { BBBANK_PRAEMIE, BONUS_KONTEN, euro, type BonusKonto } from "@/data/girokontoBonus";
import { BROKER_KARTEN, type BrokerKarte } from "@/data/brokerFreebie";

/** Einstiege mit eigener Überschrift. Unbekannte Werte laufen als „homepage“. */
export type CheckQuelle = "aktienliste" | "halal-anlagen" | "boykottliste" | "homepage" | "kopf" | "menue";

export const quelleAus = (wert: string | null | undefined): CheckQuelle =>
  wert === "aktienliste" || wert === "halal-anlagen" || wert === "boykottliste" || wert === "kopf" || wert === "menue"
    ? wert
    : "homepage";

/** Überschrift über der ersten Frage: knüpft an das an, was die Person gerade gelesen hat (Perspective-Tipp 4 bis 8). */
export const UEBERSCHRIFT: Record<CheckQuelle, string> = {
  aktienliste: "Du hast die Aktien. Jetzt fehlt nur noch das passende Depot.",
  "halal-anlagen": "Wo kaufst du die ETFs und das Gold aus deiner Liste?",
  boykottliste: "Du achtest beim Einkaufen drauf. Und bei deinem Geld?",
  homepage: "Konto, Depot oder beides?",
  kopf: "Konto, Depot oder beides?",
  menue: "Konto, Depot oder beides?",
};

export const UNTERZEILE = "3 kurze Fragen. Danach weißt du, womit du halal startest.";

export type Ziel = "konto" | "invest" | "beides";
export type Depot = "nein" | "nicht-halal" | "halal";
export type Start = "sparplan" | "etf-gold" | "aktien" | "einmal";
export type Filiale = "nein" | "ja";

export type Antworten = { ziel?: Ziel; depot?: Depot; start?: Start; filiale?: Filiale };

export type FrageId = "ziel" | "depot" | "start" | "filiale";

export type Option = { wert: string; titel: string; unter?: string; etikett?: string };

export type Frage = { id: FrageId; titel: string; optionen: Option[] };

export const FRAGEN: Record<FrageId, Frage> = {
  ziel: {
    id: "ziel",
    titel: "Was willst du als Erstes halal machen?",
    optionen: [
      { wert: "konto", titel: "Mein Konto zinsfrei machen", unter: "Kostenlos, in 10 Minuten eröffnet", etikett: "Leichtester Start" },
      { wert: "invest", titel: "Halal investieren", unter: "Aktien, ETFs oder Gold" },
      { wert: "beides", titel: "Beides", unter: "Konto und Depot sauber aufstellen" },
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
      { wert: "sparplan", titel: "Sparplan mit kleinem Betrag", unter: "Monatlich, schon ab 1 €" },
      { wert: "etf-gold", titel: "ETFs und Gold breit streuen" },
      { wert: "aktien", titel: "Aktien aus der Liste kaufen" },
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
};

/** Welche Frage als Nächstes kommt; null, wenn das Ergebnis feststeht. Höchstens drei Fragen auf jedem Weg. */
export const naechsteFrage = (a: Antworten): FrageId | null => {
  if (!a.ziel) return "ziel";
  if (a.ziel === "konto") return a.filiale ? null : "filiale";
  if (a.ziel === "invest") {
    if (!a.depot) return "depot";
    // Depot schon halal: der nächste Schritt ist das Konto (V7 „Dein Depot ist halal. Dein Konto auch?“).
    if (a.depot === "halal") return a.filiale ? null : "filiale";
    return a.start ? null : "start";
  }
  // Beides: erst das Konto (Filiale), dann wie der Depot-Start aussieht.
  if (!a.filiale) return "filiale";
  return a.start ? null : "start";
};

/** Zahl der Fragen auf dem Weg, den die Antworten bisher nehmen (für „Frage 2 von 3“). */
export const fragenGesamt = (a: Antworten): number => (a.ziel === "konto" ? 2 : 3);

export type ErgebnisArt = "konto" | "depot-halal-konto" | "depot" | "zweitdepot" | "beides";

export type Anbieter = { kurz: "fl" | "sb" | "no" | "bb"; out: string; name: string; domain: string; produkt: string };

export type Ergebnis = {
  art: ErgebnisArt;
  /** Kleine Zeile über dem Namen. */
  vorspann: string;
  anbieter: Anbieter;
  /** Ein Satz, warum es passt (V7). */
  warum: string;
  /** Ein bis zwei Vorteile, nur aus den Vergleichsdaten. */
  vorteile: string[];
  /** Was der Leser selbst tun muss, damit es halal bleibt, ein Satz beim Produkt. */
  pflicht?: string;
  knopf: string;
  /** Kleiner zweiter Schritt darunter (Konto nach Depot oder Depot nach Konto). */
  danach?: { satz: string; link: string; anbieter: Anbieter };
};

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

const depotTeil = (start: Start | undefined) =>
  start === "sparplan"
    ? { anbieter: A_SB, vorteile: SB_VORTEILE, pflicht: undefined, warum: "Du willst klein anfangen und dranbleiben. Dafür brauchst du ein günstiges Depot mit Sparplan." }
    : start === "etf-gold"
      ? { anbieter: A_FLATEX, vorteile: FLATEX_VORTEILE, pflicht: FLATEX_PFLICHT, warum: "Du willst breit streuen. Bei flatex kaufst du Halal-ETFs und Gold an einem Ort." }
      : start === "aktien"
        ? { anbieter: A_FLATEX, vorteile: FLATEX_VORTEILE, pflicht: FLATEX_PFLICHT, warum: "Du willst Aktien aus der Liste kaufen. Bei flatex bekommst du dazu alle Halal-ETFs aus meinem Vergleich." }
        : { anbieter: A_FLATEX, vorteile: FLATEX_VORTEILE, pflicht: FLATEX_PFLICHT, warum: "Du willst einmal einen Betrag anlegen. flatex hat die meisten Halal-Anlagen aus meinem Vergleich." };

/** Kennung am Knopf, nur Kleinbuchstaben und Ziffern (attribution.ts): fc, Quelle, Anbieter, „z“ für den kleinen zweiten Schritt. */
const QUELLE_KURZ: Record<CheckQuelle, string> = {
  aktienliste: "ak",
  "halal-anlagen": "ha",
  boykottliste: "bo",
  homepage: "hp",
  kopf: "ko",
  menue: "me",
};
export const CHECK_SRC = /^fc(ak|ha|bo|hp|ko|me)(fl|sb|no|bb)z?$/;
export const checkSrc = (quelle: CheckQuelle, anbieter: Anbieter, zusatz = false): string =>
  `fc${QUELLE_KURZ[quelle]}${anbieter.kurz}${zusatz ? "z" : ""}`;
export const outLink = (quelle: CheckQuelle, anbieter: Anbieter, zusatz = false): string =>
  `/out/${anbieter.out}?src=${checkSrc(quelle, anbieter, zusatz)}`;

export const ergebnisAus = (a: Antworten, quelle: CheckQuelle): Ergebnis | null => {
  if (naechsteFrage(a) !== null) return null;
  if (a.ziel === "konto") {
    const k = kontoTeil(a.filiale);
    return { art: "konto", vorspann: "Dein Start: ein zinsfreies Girokonto bei", ...k, pflicht: KONTO_PFLICHT, knopf: "Konto eröffnen" };
  }
  if (a.ziel === "invest" && a.depot === "halal") {
    const k = kontoTeil(a.filiale);
    return {
      art: "depot-halal-konto",
      vorspann: "Dein Depot ist halal. Dein Konto auch? Dein nächster Schritt:",
      ...k,
      pflicht: KONTO_PFLICHT,
      knopf: "Konto eröffnen",
    };
  }
  if (a.ziel === "invest") {
    const d = depotTeil(a.start);
    const zweit = a.depot === "nicht-halal";
    return {
      art: zweit ? "zweitdepot" : "depot",
      vorspann: zweit ? "Dein Halal-Zweitdepot:" : a.start === "etf-gold" ? "Für ETFs und Gold:" : "Dein Start:",
      anbieter: d.anbieter,
      warum: zweit
        ? `Du hast schon ein Depot. Ein zweites nur für Halal-Anlagen kostet dich ${d.anbieter.kurz === "fl" ? FLATEX.depotgebuehr : SB.depotgebuehr} Depotgebühr und hält alles sauber getrennt.`
        : d.warum,
      vorteile: d.vorteile,
      pflicht: d.pflicht,
      knopf: zweit ? "Zweitdepot eröffnen" : "Depot eröffnen",
      danach: { satz: "Und dein Konto? Ein zinsfreies Girokonto bei der norisbank", link: outLink(quelle, A_NORIS, true), anbieter: A_NORIS },
    };
  }
  // Beides: Konto zuerst mit großem Knopf, darunter klein der Depot-Schritt.
  const k = kontoTeil(a.filiale);
  const d = depotTeil(a.start);
  return {
    art: "beides",
    vorspann: "Schritt 1: dein zinsfreies Girokonto bei",
    ...k,
    pflicht: KONTO_PFLICHT,
    knopf: "Konto eröffnen",
    danach: { satz: `Schritt 2: dein Depot bei ${d.anbieter.name}`, link: outLink(quelle, d.anbieter, true), anbieter: d.anbieter },
  };
};

export const WERBEHINWEIS =
  "*Werbelink: Wenn du über diesen Link eröffnest, bekomme ich eine Provision. Für dich ändert sich nichts. Keine Anlageberatung.";

/** Link zum Check aus einem Freebie oder der Startseite. */
export const checkLink = (quelle: CheckQuelle) => `/check?quelle=${quelle}`;
