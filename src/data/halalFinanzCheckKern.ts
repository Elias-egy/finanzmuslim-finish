/**
 * KERN des Halal-Finanz-Checks: Typen, Fragen, Texte und die Reihenfolge der Fragen, ohne Anbieterdaten.
 * Nacht-Tempo (RN25L, 20.11.2026): halalFinanzCheck.ts zieht alle Vergleichsdaten (Girokonto, Depot, Kaufbarkeit, Korrekturen,
 * rund 150 KB gzip) in jedes Paket, das nur einen Link oder eine Zahl aus dem Check braucht. Wer nur Fragen, Quellen, Zahlen
 * oder Links braucht, importiert von hier; halalFinanzCheck.ts exportiert alles weiter (Ergebnis, Vergleich, Passung).
 * Ab hier der alte Kopf der Datei.
 *
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
import { BONUS_KONTEN, type BonusKonto } from "@/data/girokontoBonus";
import { BROKER_KARTEN, type BrokerKarte } from "@/data/brokerFreebie";
import type { Fassung } from "@/lib/abTest";
import type { BankWahl } from "@/data/bankSuche";
import type { DepotWahl } from "@/data/depotSuche";

export type { Fassung };

/** Name des 50:50-Tests im Speicher des Besuchers (src/lib/abTest.ts, Schlüssel fm_ab_check-depotfrage). */
export const AB_TEST = "check-depotfrage";

/**
 * Einstiege mit eigener Überschrift. Unbekannte Werte laufen als „homepage“.
 * „quiz“ seit RN6 (15.11.2026): alle Wege, die früher ins alte Quiz /vergleich/start führten (Elias: „Check ersetzt Quiz“).
 * RN10-07 (16.11.2026): je Freebie-Seite mit Kasten eine eigene Quelle, damit die Abschlüsse je Stelle zählbar sind (Perspective-Tipp 43).
 */
export type CheckQuelle =
  | "aktienliste"
  | "boykottfreie-aktien"
  | "halal-anlagen"
  | "boykottliste"
  | "homepage"
  | "kopf"
  | "menue"
  | "quiz"
  | "vertrags-ampel"
  | "auto-abo"
  | "baraka-blocker"
  | "rizq"
  | "gold-plan"
  | "sukuk-plan"
  | "etf-plan"
  | "portfolio-plan"
  | "broker-vergleich";

const QUELLEN: readonly CheckQuelle[] = [
  "aktienliste",
  "boykottfreie-aktien",
  "halal-anlagen",
  "boykottliste",
  "kopf",
  "menue",
  "quiz",
  "vertrags-ampel",
  "auto-abo",
  "baraka-blocker",
  "rizq",
  "gold-plan",
  "sukuk-plan",
  "etf-plan",
  "portfolio-plan",
  "broker-vergleich",
];

export const quelleAus = (wert: string | null | undefined): CheckQuelle => QUELLEN.find((q) => q === wert) ?? "homepage";

/** Eine kurze Zeile je Einstieg, nur im Freebie-Kasten (CheckEinstieg.tsx). Im Check selbst sehen alle Quellen dieselben Fragen (Elias RN7-03). Knüpft an das an, was die Person gerade gelesen hat (Perspective-Tipp 4 bis 8). Elias RN7: nicht länger als eine Zeile. */
export const UEBERSCHRIFT: Record<CheckQuelle, string> = {
  aktienliste: "Wo kaufst du die Aktien aus der Liste?",
  "boykottfreie-aktien": "Wo kaufst du die Aktien aus der Liste?",
  "halal-anlagen": "Wo kaufst du ETFs und Gold aus deiner Liste?",
  boykottliste: "Du achtest beim Einkaufen drauf. Und bei deiner Bank?",
  homepage: "Konto, Depot oder beides?",
  kopf: "Konto, Depot oder beides?",
  menue: "Konto, Depot oder beides?",
  quiz: "Konto, Depot oder beides?",
  "vertrags-ampel": "Konto, Depot oder beides?",
  "auto-abo": "Konto, Depot oder beides?",
  "baraka-blocker": "Konto, Depot oder beides?",
  rizq: "Konto, Depot oder beides?",
  "gold-plan": "Wo kaufst du dein Gold?",
  "sukuk-plan": "Wo kaufst du deine Sukuk?",
  "etf-plan": "Wo kaufst du deine Halal-ETFs?",
  "portfolio-plan": "Wo setzt du deinen Plan um?",
  "broker-vergleich": "Welcher Broker passt zu dir?",
};

/** Welche Art ein Freebie-Einstieg betont (RN8): Boykott-Liste und die Freebies rund um Konto und Alltag Bankkonto, die Anlagen-Freebies Depot. Seit RN10-07 nur noch die Lage des grünen Etiketts, die Fragen sind überall gleich. */
export const ART_JE_QUELLE: Partial<Record<CheckQuelle, Art>> = {
  boykottliste: "konto",
  "vertrags-ampel": "konto",
  "auto-abo": "konto",
  "baraka-blocker": "konto",
  rizq: "konto",
  aktienliste: "depot",
  "boykottfreie-aktien": "depot",
  "halal-anlagen": "depot",
  "gold-plan": "depot",
  "sukuk-plan": "depot",
  "etf-plan": "depot",
  "portfolio-plan": "depot",
  "broker-vergleich": "depot",
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

export const NORIS = konto("norisbank-top-girokonto");
export const BB = konto("bbbank-bettersmart");
export const FLATEX = depot("flatex-depot");
export const SB = depot("smartbroker-plus-depot");
export const TP = depot("traders-place-depot");


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
/** „Hast du schon ein Depot?“ (RN10-07): „ja“ fragt danach „Wo hast du dein Depot?“, „nein“ führt gleich zu „Was ist dir wichtiger?“. */
export type HatDepot = "ja" | "nein";
/**
 * „Was ist dir wichtiger?“: viele Halal-Anlagen gleich flatex, niedrige Kosten gleich Smartbroker+. „Ein Mix aus beiden“ (Elias RN16-06:
 * „ein Mix aus beiden oder so. Und dann wird auch Smart Broker eher angezeigt. Smart Broker und darunter Traders Place“) gleich
 * Smartbroker+ mit Traders Place darunter; liegt Traders Place in der Passung vorn (bei ETFs, 9 statt 8 von 12), steht es oben.
 */
export type Praef = "halal" | "kosten" | "mix";
/** Nur Fassung b: „Wie viel möchtest du im Monat anlegen?“. Ändert nicht das Depot, aber die Passung in Prozent. */
export type Betrag = "unter50" | "50bis200" | "ueber200";
/**
 * „Worin willst du investieren?“ (Elias RN10-07: „Aktienmarkt und dann irgendwie Einzelaktien, ETFs oder so, oder Edelmetalle“).
 * Die Antwort verschiebt die Gewichte in passungAusWerten und stellt das Thema in den Vorteilen nach vorn, nie das Depot selbst.
 * „Weiß noch nicht“ (Elias RN12-03: „und dann Weiß noch nicht“) rechnet mit der Standard-Aufteilung und stellt nichts nach vorn.
 */
export type Anlage = "etf" | "aktien" | "gold" | "offen";

export type Antworten = {
  art?: Art;
  ziel?: Ziel;
  zahlung?: Zahlung;
  /** Die Bank von heute, nur im Bankkonto-Check. Bleibt im Zustand der Seite, nie in der Adresse. */
  bank?: BankWahl;
  hatDepot?: HatDepot;
  praef?: Praef;
  /** Das Depot von heute, nur nach „Ich habe schon ein Depot“. Bleibt im Zustand der Seite, nie in der Adresse. */
  depotHeute?: DepotWahl;
  anlage?: Anlage;
  betrag?: Betrag;
};

export type FrageId = "ziel" | "zahlung" | "bank" | "hatDepot" | "depotHeute" | "praef" | "anlage" | "betrag";

/** `etikett` grün (am beliebtesten), `hinweis` orange (passt zum Freebie, aus dem der Leser kommt; Elias RN16-08). */
export type Option = { wert: string; titel: string; unter?: string; etikett?: string; hinweis?: string };

/** `warum` ist die erste Sprechblase (ein Satz, warum Elias fragt), `titel` die zweite (die Frage selbst). */
export type Frage = { id: FrageId; warum: string; titel: string; optionen: Option[] };

/** Grünes Etikett an „Neues Bankkonto“ (Elias RN8-06: „in grün am beliebtesten“). */
export const ETIKETT = "am beliebtesten";
/** Grünes Etikett an „Depot zum Investieren“, wenn jemand über die Aktien-Liste oder die Halal-Anlagen-Liste kommt (Elias RN10-07: „bei Depot passt zur Liste“). */
export const ETIKETT_LISTE = "passt zu deiner Liste";

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
  hatDepot: {
    id: "hatDepot",
    warum: "Dann weiß ich, ob ich dein Depot neben ein anderes stellen kann.",
    titel: "Hast du schon ein Depot?",
    optionen: [
      { wert: "ja", titel: "Ja" },
      { wert: "nein", titel: "Nein, noch nicht" },
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
    warum: "Jedes Depot hat andere Stärken. Deshalb frage ich, was für dich zählt.",
    titel: "Was ist dir wichtiger?",
    optionen: [
      { wert: "halal", titel: "Möglichst viele Halal-Anlagen", unter: `${FLATEX.etfs} Halal-ETFs und Fonds, ${FLATEX.gold} Edelmetalle` },
      { wert: "kosten", titel: "Möglichst niedrige Kosten", unter: `${SB.depotgebuehr} Depotgebühr, Sparplan ab ${SB.sparplanAb}` },
      { wert: "mix", titel: "Ein Mix aus beiden", unter: "Viele Halal-Anlagen und niedrige Kosten" },
    ],
  },
  anlage: {
    id: "anlage",
    warum: "Noch eine Frage, dann rechne ich aus, wie gut es zu dir passt.",
    titel: "Worin willst du investieren?",
    optionen: [
      { wert: "etf", titel: "ETFs", unter: "Ein Papier, viele Firmen" },
      { wert: "aktien", titel: "Einzelne Aktien", unter: "Du suchst die Firmen selbst aus" },
      { wert: "gold", titel: "Gold und Silber", unter: "Zum Beispiel zertifiziertes, auslieferbares Gold" },
      { wert: "offen", titel: "Weiß noch nicht", unter: "Dann zählt alles ein bisschen" },
    ],
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

/** Die Antworten der Anlage-Frage als Satzteil („Du willst … investieren“) und als Häkchen bei „Deine Antworten“. */
export const ANLAGE_SATZ: Record<Anlage, string> = { etf: "in ETFs investieren", aktien: "einzelne Aktien kaufen", gold: "in Gold und Silber investieren", offen: "" };
export const ANLAGE_TEXT: Record<Anlage, string> = { etf: "ETFs", aktien: "Einzelne Aktien", gold: "Gold und Silber", offen: "Anlage noch offen" };

/**
 * Das grüne Etikett der ersten Frage je Einstieg (Elias RN10-07: „das Quiz ist überall gleich, nur dieser eine Farbtouch sagt, was passt“).
 * Standard: „Neues Bankkonto“ mit „am beliebtesten“. Wer über die Aktien-Liste oder die Halal-Anlagen-Liste kommt, sieht das Etikett
 * „passt zu deiner Liste“ an „Depot zum Investieren“, und „Neues Bankkonto“ hat dann keins (so diktiert). Für die weiteren Anlagen-Freebies
 * (Gold-Plan, Sukuk-Plan, Portfolio-Plan: „passt zu deinem Plan“; Broker-Vergleich: „passt zu deinem Vergleich“) sitzt dasselbe Etikett
 * an „Depot zum Investieren“, nur mit dem Wort, das zum Freebie passt (Wahl der Umsetzung, nicht Elias' Wortlaut). Alle anderen Einstiege passen
 * ohnehin zum Standard.
 */
export const ETIKETT_PLAN = "passt zu deinem Plan";
export const ETIKETT_VERGLEICH = "passt zu deinem Vergleich";
const DEPOT_HINWEIS: Partial<Record<CheckQuelle, string>> = {
  aktienliste: ETIKETT_LISTE,
  "boykottfreie-aktien": ETIKETT_LISTE,
  "halal-anlagen": ETIKETT_LISTE,
  "gold-plan": ETIKETT_PLAN,
  "sukuk-plan": ETIKETT_PLAN,
  "etf-plan": ETIKETT_PLAN,
  "portfolio-plan": ETIKETT_PLAN,
  "broker-vergleich": ETIKETT_VERGLEICH,
};
/** Das orange Etikett je Einstieg: nur bei den Anlagen-Freebies, an „Depot zum Investieren“; sonst keins. */
export const hinweisJeQuelle = (quelle: CheckQuelle): { ziel: Ziel; etikett: string } | undefined => {
  const depotWort = DEPOT_HINWEIS[quelle];
  return depotWort ? { ziel: "invest", etikett: depotWort } : undefined;
};

/**
 * Die erste Frage „Was suchst du gerade?“ für einen Einstieg: überall dieselben Antworten. „Neues Bankkonto“ trägt immer das grüne
 * „am beliebtesten“ (Elias RN16-08: „dass natürlich immer noch in grün bleibt, hey, das beliebteste ist das Bankkonto“); wer aus einem
 * Anlagen-Freebie kommt, sieht dazu an „Depot zum Investieren“ das orange Etikett („in eine andere orange gefleckt … er versteht, dass ich
 * mich für Aktien interessiere“). Ersetzt RN10-07, wo das grüne Etikett zum Depot wanderte.
 */
export const zielFrage = (quelle: CheckQuelle): Frage => {
  const h = hinweisJeQuelle(quelle);
  return { ...FRAGEN.ziel, optionen: FRAGEN.ziel.optionen.map((o) => (h && o.wert === h.ziel ? { ...o, hinweis: h.etikett } : o)) };
};

/** Die Frage mit den Antworten, die zum Einstieg passen (nur die erste Frage trägt je Einstieg ein anderes Etikett). */
export const frageFuer = (id: FrageId, _a: Antworten, quelle: CheckQuelle = "homepage"): Frage => (id === "ziel" ? zielFrage(quelle) : FRAGEN[id]);

/** Fassung b fragt auf dem Depot-Weg zusätzlich nach dem Monatsbetrag (50:50-Test, Elias RN7-03: sinkt oder steigt der Abschluss mit einer Frage mehr?). */
const mitBetrag = (fassung: Fassung) => fassung === "b";

/** Die Art, die die Antworten bisher haben: aus der Adresse (?art=) oder aus der ersten Frage. */
export const artVon = (a: Antworten): Art | undefined => a.art ?? (a.ziel ? ZIEL_ART[a.ziel] : undefined);

/** Die erste Frage jedes Einstiegs ist „Was suchst du gerade?“ (RN10-07: überall dieselben Fragen); der Parameter bleibt für alte Aufrufer. */
export const ersteFrage = (_art?: Art): FrageId => "ziel";

/**
 * Welche Frage als Nächstes kommt; null, wenn das Ergebnis feststeht.
 * Bankkonto: Wie bezahlst du, Bank von heute. Depot (RN10-07): „Hast du schon ein Depot?“, bei Ja „Wo hast du dein Depot?“, dann
 * „Was ist dir wichtiger?“ und „Worin willst du investieren?“, in Fassung b zuletzt der Monatsbetrag. Ohne art zuerst
 * „Was suchst du gerade?“.
 */
export const naechsteFrage = (a: Antworten, fassung: Fassung = "a"): FrageId | null => {
  const art = artVon(a);
  if (!art) return "ziel";
  if (art === "konto") {
    if (!a.zahlung) return "zahlung";
    return a.bank ? null : "bank";
  }
  if (!a.hatDepot) return "hatDepot";
  if (a.hatDepot === "ja" && !a.depotHeute) return "depotHeute";
  if (!a.praef) return "praef";
  if (!a.anlage) return "anlage";
  return mitBetrag(fassung) && !a.betrag ? "betrag" : null;
};

/** Zahl der Fragen auf dem Weg, den die Antworten bisher nehmen (für den Fortschritt). */
export const fragenGesamt = (a: Antworten, fassung: Fassung = "a"): number => {
  const art = artVon(a);
  const vorn = a.ziel || !a.art ? 1 : 0;
  if (!art) return 3;
  if (art === "konto") return vorn + 2;
  // Hast du schon ein Depot, Was ist dir wichtiger, Worin willst du investieren; bei „Ja“ dazu „Wo hast du dein Depot?“.
  const haupt = a.hatDepot === "ja" ? 4 : 3;
  return vorn + haupt + (mitBetrag(fassung) ? 1 : 0);
};
