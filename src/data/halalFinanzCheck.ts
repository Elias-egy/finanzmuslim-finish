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
import { bankPreis, bankRoh, bankWerte, produktRoh, produktWerte, type BankAmpel, type BankWahl, type BankWerte } from "@/data/bankSuche";
import type { Kontopreis } from "@/data/kontopreise";
import { brokerVergleich } from "@/data/brokerVergleich";
import { depotWerte, type DepotWahl, type DepotWerte } from "@/data/depotSuche";
import { ANLAGEN_KAUFBAR } from "@/data/anlagenKaufbar";
import { ROYAL_MINT } from "@/data/royalMint";

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
  | "portfolio-plan"
  | "broker-vergleich";

const QUELLEN: readonly CheckQuelle[] = [
  "aktienliste",
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
  "portfolio-plan",
  "broker-vergleich",
];

export const quelleAus = (wert: string | null | undefined): CheckQuelle => QUELLEN.find((q) => q === wert) ?? "homepage";

/** Eine kurze Zeile je Einstieg, nur im Freebie-Kasten (CheckEinstieg.tsx). Im Check selbst sehen alle Quellen dieselben Fragen (Elias RN7-03). Knüpft an das an, was die Person gerade gelesen hat (Perspective-Tipp 4 bis 8). Elias RN7: nicht länger als eine Zeile. */
export const UEBERSCHRIFT: Record<CheckQuelle, string> = {
  aktienliste: "Wo kaufst du die Aktien aus der Liste?",
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
  "halal-anlagen": "depot",
  "gold-plan": "depot",
  "sukuk-plan": "depot",
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

const NORIS = konto("norisbank-top-girokonto");
const BB = konto("bbbank-bettersmart");
const FLATEX = depot("flatex-depot");
const SB = depot("smartbroker-plus-depot");
const TP = depot("traders-place-depot");

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

export type Option = { wert: string; titel: string; unter?: string; etikett?: string };

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
  "halal-anlagen": ETIKETT_LISTE,
  "gold-plan": ETIKETT_PLAN,
  "sukuk-plan": ETIKETT_PLAN,
  "portfolio-plan": ETIKETT_PLAN,
  "broker-vergleich": ETIKETT_VERGLEICH,
};
export const hinweisJeQuelle = (quelle: CheckQuelle): { ziel: Ziel; etikett: string } => {
  const depotWort = DEPOT_HINWEIS[quelle];
  return depotWort ? { ziel: "invest", etikett: depotWort } : { ziel: "konto", etikett: ETIKETT };
};

/** Die erste Frage „Was suchst du gerade?“ für einen Einstieg: überall dieselben Antworten, nur das eine grüne Etikett wandert. */
export const zielFrage = (quelle: CheckQuelle): Frage => {
  const h = hinweisJeQuelle(quelle);
  return { ...FRAGEN.ziel, optionen: FRAGEN.ziel.optionen.map(({ etikett: _alt, ...o }) => (o.wert === h.ziel ? { ...o, etikett: h.etikett } : o)) };
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

export type Anbieter = { kurz: "fl" | "sb" | "tp" | "no" | "bb"; out: string; name: string; domain: string; produkt: string };

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
  /** Werte der heutigen Bank aus dem Girokonto-Vergleich (bankWerte), nur mit heutiger Bank. */
  heuteHalal?: BankWerte;
  /** „Passt zu X % zu dir“ (Elias RN12-01), gerechnet in kontoPassung, höchstens 98. */
  passung: number;
  /** RN14: belegter Preis (kontopreise.ts) für die Mini-Punkte; die heutige Bank für die Alltag-Zeilen (bankRoh, erst beim Zeichnen). */
  heutePreis?: Kontopreis;
  heuteBank?: BankWahl;
  /** Antwort „Wie bezahlst du meistens?“, für Filialen und Einzahlen im Vergleich. */
  zahlung?: Zahlung;
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
  /** „Passt auch gut“ wie im Original (Elias RN11-03): das andere der beiden Depots mit eigener Passung und eigenem Knopf. */
  auchGut?: AuchGut;
};

/** Das zweite Depot unter dem Match: eigene Passung aus passungProzent, Knopf über /out mit Kennung Zusatz z. */
export type AuchGut = {
  anbieter: Anbieter;
  passung: number;
  titel: string;
  vorteile: string[];
  preis: string;
  pflicht?: string;
  link: string;
};

export type Ergebnis = KontoErgebnis | DepotErgebnis;

const A_NORIS: Anbieter = { kurz: "no", out: NORIS.out, name: NORIS.name, domain: NORIS.domain, produkt: NORIS.produkt };
const A_BB: Anbieter = { kurz: "bb", out: BB.out, name: BB.name, domain: BB.domain, produkt: BB.produkt };
const A_FLATEX: Anbieter = { kurz: "fl", out: FLATEX.out, name: FLATEX.name, domain: FLATEX.domain, produkt: "Depot" };
const A_SB: Anbieter = { kurz: "sb", out: SB.out, name: SB.name, domain: SB.domain, produkt: "Depot" };
const A_TP: Anbieter = { kurz: "tp", out: TP.out, name: TP.name, domain: TP.domain, produkt: "Depot" };

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

// ---------------------------------------------------------------------------
// Konto-Passung in Prozent (Elias RN12-01: „Der Anfang ist irgendwie passt so zu so und so viel Prozent zu dir“), nie fest, wie beim
// Depot (Regelbuch RN9-04: „das Endergebnis mit den Prozenten auch irgendwie glaubwürdiger“).

/**
 * Jedes Merkmal bekommt einen Anteil von 0 bis 1 aus dem Girokonto-Vergleich (girokontoVergleich.ts, Werte des Match-Kontos) und aus
 * girokontoBonus.ts, jedes Merkmal ein Gewicht:
 *  - Ohne Zinsen 25, Kein Dispo ab Start 20, Karte ohne Kredit 10 (gut 1, teils 0,5, schlecht 0).
 *  - Kosten 20: 0 € Kontoführung ist voll, eine Bedingung kostet je 2.500 € Geldeingang die Hälfte (norisbank 500 € gleich 0,8,
 *    BBBank 1.000 € gleich 0,6).
 *  - Karte 15: Apple Pay oder Google Pay und Debitkarte 0 €.
 *  - Bargeld (RN14, Elias RN13-01 „Norris Bank würde ich dann 89% oder so machen, weil es ja keine Bank hat“): Gewicht je Antwort
 *    „Wie bezahlst du meistens?“, nur Karte 0, Karte und ab und zu bar 20, viel bar 30; Anteil aus Filialen, Abhebungen und Einzahlen.
 *    Abhebungen „Unbegrenzt“ voll, sonst Zahl durch 5. Einzahlen kostenlos ist voll, nur an bestimmten Automaten oder Schaltern 0,8,
 *    „nicht möglich“ null, sonst die Hälfte. Filiale ja 1, nein 0. So kommt die norisbank bei Karte und bar auf 89 bis 90.
 *  - Kontowechsel-Service 10, nur wenn es eine Bank von heute gibt.
 * Passung = Summe der Gewicht mal Anteil, geteilt durch die Summe der Gewichte, gerundet, höchstens 98.
 */
const ampelAnteil = (v: unknown) => (v === "gut" ? 1 : v === "teils" ? 0.5 : 0);
const abhebenAnteil = (v: unknown) => {
  if (typeof v !== "string") return 0;
  if (/unbegrenzt/i.test(v)) return 1;
  const n = Number(v.match(/\d+/)?.[0] ?? 0);
  return clamp01(n / 5);
};
const einzahlenAnteil = (v: unknown) => {
  if (typeof v !== "string") return 0;
  if (/nicht möglich/i.test(v)) return 0;
  if (/kostenlos/i.test(v)) return /nur |automaten|schalter/i.test(v) ? 0.8 : 1;
  return 0.5;
};
const nullEuro = (v: unknown) => (typeof v === "string" && /^\D*0\s?€/.test(v) ? 1 : 0);
const BARGELD_GEWICHT: Record<Zahlung, number> = { karte: 0, "karte-bar": 20, bar: 30 };

export const kontoPassung = (k: BonusKonto, a: Antworten): number => {
  const w = produktRoh(k.id);
  const kosten = 1 - Math.min(0.5, k.gratisAb / 2500);
  const z = a.zahlung ?? "karte-bar";
  const karte = ((w.applePay === true ? 1 : 0) + nullEuro(w.debitkarte)) / 2;
  const bargeld = ((w.filialen === true ? 1 : 0) + abhebenAnteil(w.abhebungen) + einzahlenAnteil(w.bargeldEinzahlen)) / 3;
  const teile: [number, number][] = [
    [25, ampelAnteil(w.zinsfreiAbStart)],
    [20, ampelAnteil(w.keinDispoAbStart)],
    [10, ampelAnteil(w.karteOhneKredit)],
    [20, kosten],
    [15, karte],
  ];
  if (BARGELD_GEWICHT[z] > 0) teile.push([BARGELD_GEWICHT[z], bargeld]);
  if (a.bank && a.bank.kind !== "keine") teile.push([10, w.kontowechsel === true ? 1 : 0]);
  const summe = teile.reduce((x, [g]) => x + g, 0);
  const punkte = teile.reduce((x, [g, t]) => x + g * t, 0);
  return Math.min(PASSUNG_MAX, Math.round((100 * punkte) / summe));
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
    passung: kontoPassung(k, a),
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
    heuteHalal: links && bank ? bankWerte(bank) : undefined,
    heutePreis: links && bank ? bankPreis(bank)?.preis : undefined,
    heuteBank: links && bank ? bank : undefined,
    zahlung: a.zahlung,
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

/**
 * Royal Mint Gold-ETC (HANetf, ISIN royalMint.ts) ist bei diesem Haus kaufbar: nur mit dem Einzelbeleg des Anbieters aus
 * anlagenKaufbar.ts (haus „flatex“ bzw. „smartbroker“, Stand mit Beleg-Link dort). „Zertifiziert“ und „auslieferbar“ stehen mit Belegen
 * in edelmetallVergleich.ts (jährliches Amanie-Zertifikat, Einlösung in Barren und Münzen laut hanetf.com).
 */
const ROYAL_HAUS: Record<DepotKurz, string> = { fl: "flatex", sb: "smartbroker", tp: "traders-place" };
export const royalMintKaufbar = (kurz: DepotKurz): boolean =>
  Boolean(ANLAGEN_KAUFBAR[ROYAL_MINT]?.kaufbar.some((k) => k.haus === ROYAL_HAUS[kurz] || (k.haeuser ?? []).includes(ROYAL_HAUS[kurz])));

type VorteilsKey = "etfs" | "gold-sukuk" | "gold" | "royal" | "sparplan" | "gebuehr" | "order";

/** Genaue Vorteile, nur Werte aus brokerFreebie.ts (Depot-Vergleich) und anlagenKaufbar.ts. Das gewählte Thema (Worin willst du investieren?) steht zuerst. */
const depotVorteile = (d: BrokerKarte, kurz: DepotKurz, anlage: Anlage | undefined): string[] => {
  const zeilen: Partial<Record<VorteilsKey, string>> = {
    etfs: `${d.etfs} Halal-ETFs und Fonds aus meinem Vergleich`,
    "gold-sukuk": `Gold und Silber ${d.gold}, Sukuk ${d.sukuk}`,
    gold: `Gold und Silber ${d.gold}`,
    sparplan: `Sparplan ab ${d.sparplanAb}`,
    gebuehr: `${d.depotgebuehr} Depotgebühr`,
    order: `Order ${d.order}`,
  };
  if (royalMintKaufbar(kurz)) zeilen.royal = "Royal Mint Gold-ETC hier kaufbar, zertifiziert und auslieferbar";
  const basis: VorteilsKey[] =
    kurz === "fl"
      ? ["etfs", "gold-sukuk", "sparplan", "gebuehr"]
      : kurz === "tp"
        ? ["etfs", "gebuehr", "order", "sparplan", "gold-sukuk"]
        : ["gebuehr", "order", "sparplan", "etfs", "gold-sukuk"];
  const vorn: VorteilsKey[] = anlage === "gold" ? ["royal", "gold"] : anlage === "etf" ? ["etfs"] : anlage === "aktien" ? ["order"] : [];
  const reihe = [...vorn, ...basis.filter((k) => !(anlage === "gold" && k === "gold-sukuk"))];
  const gesehen = new Set<string>();
  return reihe
    .filter((k) => zeilen[k] && !gesehen.has(k) && gesehen.add(k))
    .map((k) => zeilen[k] as string)
    .slice(0, 4);
};

/** Die drei Depots des Checks. */
export type DepotKurz = "fl" | "sb" | "tp";
const DEPOT_KARTE: Record<DepotKurz, { anbieter: Anbieter; karte: BrokerKarte; pflicht?: string; titel: string; ueberschrift: string }> = {
  fl: { anbieter: A_FLATEX, karte: FLATEX, pflicht: FLATEX_PFLICHT, titel: "Depot mit der größten Halal-Auswahl", ueberschrift: "Dein Match: ein Halal-Depot bei flatex" },
  sb: { anbieter: A_SB, karte: SB, titel: "Depot ohne Depotgebühr", ueberschrift: "Dein Match: ein günstiges Halal-Depot bei Smartbroker+" },
  tp: { anbieter: A_TP, karte: TP, titel: "Viele Halal-Anlagen ohne Depotgebühr", ueberschrift: "Dein Match: ein Halal-Depot bei Traders Place" },
};

/**
 * Welches Depot oben steht und welches darunter (Elias RN7, RN11-03, RN16-06): Halal-Auswahl gleich flatex über Smartbroker+, Kosten
 * gleich Smartbroker+ über flatex, Mix gleich Smartbroker+ über Traders Place. Beim Mix entscheidet die gerechnete Passung, wenn
 * Traders Place echt vorn liegt, damit oben nie die kleinere Zahl steht.
 */
export const depotPaar = (a: Antworten): [DepotKurz, DepotKurz] => {
  if (a.praef === "kosten") return ["sb", "fl"];
  if (a.praef === "mix") return passungProzent(TP, a) > passungProzent(SB, a) ? ["tp", "sb"] : ["sb", "tp"];
  return ["fl", "sb"];
};

const depotTeil = (kurz: DepotKurz, a: Antworten) => {
  const und = a.anlage && ANLAGE_SATZ[a.anlage] ? ` und ${ANLAGE_SATZ[a.anlage]}` : "";
  const k = DEPOT_KARTE[kurz];
  const satz =
    a.praef === "mix"
      ? `Du willst viele Halal-Anlagen bei niedrigen Kosten${und}. ${k.anbieter.name} verbindet beides.`
      : kurz === "sb"
        ? `Du willst möglichst niedrige Kosten${und}. Dafür passt Smartbroker+.`
        : `Du willst möglichst viele Halal-Anlagen${und}. flatex hat in meinem Vergleich die größte Halal-Auswahl.`;
  return { ...k, kurz, satz };
};

// ---------------------------------------------------------------------------
// Passung in Prozent (Elias RN8-03: „zu so und so viel Prozent passt es zu dir“, Learning 33: nie eine feste Zahl)

/**
 * Wie die Passung gerechnet wird. Jedes Depot bekommt je Merkmal einen Anteil von 0 bis 1 aus den Vergleichsdaten
 * (brokerFreebie.ts, Depot-Vergleich), jedes Merkmal hat ein Gewicht, das aus den Antworten folgt:
 *  - Halal-Anlagen: Anteil Halal-ETFs und Fonds, Edelmetalle und Sukuk (je x von y). Aufteilung 60/20/20; bei „ETFs“ 80/10/10
 *    (der ETF-Anteil zählt), bei „Gold und Silber“ 20/70/10 (der Edelmetall-Anteil zählt).
 *  - Kosten: Depotgebühr (0 € ist voll) und Ordergebühr im Verhältnis zur Monatsrate (10 % und mehr ist null). Aufteilung 40/60;
 *    bei „Einzelne Aktien“ 20/80 (die Order zählt).
 *    Die Monatsrate ist die Mitte der Antwort (unter 50 € gleich 25 €, 50 bis 200 € gleich 125 €, über 200 € gleich 300 €),
 *    ohne Antwort (Fassung a) 100 €.
 *  - Sparplan: ab 1 € ist voll, jeder Euro mehr kostet 1/24; kein Sparplan ist null.
 *  - Ohne Zinsen: voll, wenn der Vergleich beim Depot kein Guthabenzins zeigt (gut), halb bei abschaltbar (teils).
 * Gewichte: „Was ist dir wichtiger?“ Halal 45 und Kosten 20 (umgekehrt bei Kosten). Sparplan 15 bei „Nein, noch nicht“, bei
 * „Ja“ (schon ein Depot) 5. Ohne Zinsen 10. „Worin willst du investieren?“ legt 10 dazu: bei ETFs und Gold auf Halal, bei
 * Einzelnen Aktien auf Kosten.
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
  const an = a.anlage;
  const [pEtf, pGold, pSukuk] = an === "etf" ? [0.8, 0.1, 0.1] : an === "gold" ? [0.2, 0.7, 0.1] : [0.6, 0.2, 0.2];
  const halal = pEtf * anteilVon(w.etfs) + pGold * anteilVon(w.gold) + pSukuk * anteilVon(w.sukuk);
  const rate = a.betrag ? MONATSRATE[a.betrag] : 100;
  // Prozentuale Depotgebühr („0,2%“) zählt wie eine hohe Gebühr.
  const gebuehrProzent = /%/.test(w.depotgebuehr ?? "") && !/^0\s?€/.test(w.depotgebuehr ?? "");
  const order = 1 - clamp01(ersterEuro(w.order) / rate / 0.1);
  const gebuehr = gebuehrProzent ? 0 : 1 - clamp01(ersterEuro(w.depotgebuehr) / 5);
  const [pGeb, pOrder] = an === "aktien" ? [0.2, 0.8] : [0.4, 0.6];
  const kosten = pGeb * gebuehr + pOrder * order;
  const sparplan = w.sparplanAb === "kein Sparplan" ? 0 : clamp01(1 - (ersterEuro(w.sparplanAb) - 1) / 24);
  const zinsfrei = w.zinsfrei === "gut" ? 1 : w.zinsfrei === "teils" ? 0.5 : 0;

  // Mix aus beiden (RN16-06): Halal und Kosten gleich schwer.
  let wHalal = a.praef === "halal" ? 45 : a.praef === "kosten" ? 20 : a.praef === "mix" ? 30 : 40;
  let wKosten = a.praef === "kosten" ? 45 : a.praef === "mix" ? 30 : 20;
  let wSparplan = a.hatDepot === "ja" ? 5 : 15;
  let wZinsfrei = 10;
  if (an === "etf" || an === "gold") wHalal += 10;
  if (an === "aktien") wKosten += 10;
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

/** Das zweite Depot aus depotPaar, gerechnet mit denselben Antworten. Fehlt, wenn es schon das heutige ist. */
const auchGutVon = (kurz: DepotKurz, a: Antworten, quelle: CheckQuelle, fassung: Fassung): AuchGut | undefined => {
  const o = depotTeil(kurz, a);
  const heute = a.depotHeute;
  if (heute?.kind === "depot" && heute.id === o.karte.id) return undefined;
  return {
    anbieter: o.anbieter,
    passung: passungProzent(o.karte, a),
    titel: o.titel,
    // Die Depotgebühr steht schon als Preis unten in der Karte, nicht noch einmal als Haken.
    vorteile: depotVorteile(o.karte, o.kurz, a.anlage)
      .filter((v) => v !== `${o.karte.depotgebuehr} Depotgebühr`)
      .slice(0, 3),
    preis: `${o.karte.depotgebuehr} Depotgebühr`,
    pflicht: o.pflicht,
    link: outLink(quelle, o.anbieter, fassung, "z"),
  };
};

const depotErgebnis = (a: Antworten, quelle: CheckQuelle, fassung: Fassung): DepotErgebnis => {
  const [oben, unten] = depotPaar(a);
  const d = depotTeil(oben, a);
  const passung = passungProzent(d.karte, a);
  const heute = a.depotHeute;
  const schonDa = heute?.kind === "depot" && heute.id === d.karte.id;
  const basis = {
    art: "depot" as const,
    anbieter: d.anbieter,
    ueberschrift: d.ueberschrift,
    satz: d.satz,
    kartenTitel: d.titel,
    preis: `${d.karte.depotgebuehr} Depotgebühr`,
    vorteile: depotVorteile(d.karte, d.kurz, a.anlage),
    pflicht: d.pflicht,
    knopf: "Depot eröffnen",
    link: outLink(quelle, d.anbieter, fassung),
    passung,
    schonDa,
    auchGut: schonDa ? undefined : auchGutVon(unten, a, quelle, fassung),
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
  "vertrags-ampel": "va",
  "auto-abo": "aa",
  "baraka-blocker": "bb",
  rizq: "rq",
  "gold-plan": "gp",
  "sukuk-plan": "sp",
  "portfolio-plan": "pp",
  "broker-vergleich": "bv",
};
export const CHECK_SRC = /^fc(ak|ha|bo|hp|ko|me|qz|va|aa|bb|rq|gp|sp|pp|bv)(fl|sb|no|bb)[zx]?[ab]?$/;
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
  if (a.hatDepot) z.push(a.hatDepot === "ja" ? "Schon ein Depot" : "Noch kein Depot");
  if (a.depotHeute) z.push(`Depot bei ${a.depotHeute.name}`);
  if (a.praef) z.push({ halal: "Viele Halal-Anlagen", kosten: "Niedrige Kosten", mix: "Halal-Anlagen und Kosten" }[a.praef]);
  if (a.anlage) z.push(ANLAGE_TEXT[a.anlage]);
  if (a.betrag) z.push({ unter50: "Unter 50 € im Monat", "50bis200": "50 bis 200 € im Monat", ueber200: "Über 200 € im Monat" }[a.betrag]);
  return z;
};

export const WERBEHINWEIS =
  "*Werbelink: Wenn du über diesen Link eröffnest, bekomme ich eine Provision. Für dich ändert sich nichts. Keine Anlageberatung.";

/** Link zum Check aus einer Stelle ohne eigene Art (Startseite, Menü): /check?quelle=… */
export const checkLink = (quelle: CheckQuelle) => `/check?quelle=${quelle}`;

/**
 * Freebie-Kasten (RN10-07): überall dieselbe erste Frage „Was suchst du gerade?“, die Antwort steckt in der Adresse, der Chat geht bei
 * Frage 2 weiter: /check?quelle=…&start=2&a1=konto|invest|unsicher. Der erste Parameter `art` bleibt für alte Aufrufer und wird nicht
 * mehr in die Adresse geschrieben.
 */
export const checkEinstiegLink = (quelle: CheckQuelle, wert: string): string => `/check?quelle=${quelle}&start=2&a1=${wert}`;

const ZIEL_WERTE = ["konto", "invest", "unsicher", "beides"] as const;
const ZAHLUNG_WERTE = ["karte", "karte-bar", "bar"] as const;

/**
 * Gültige erste Antwort aus der Adresse (?a1=), sonst nichts. Neu: ein Wert von „Was suchst du gerade?“ (konto, invest, unsicher).
 * Alte Adressen laufen weiter: bei ?art=konto eine Zahlungsart (karte, karte-bar, bar) wie früher, bei ?art=depot oder ohne art die
 * alte Erfahrung (keine, erste gleich „Nein, noch nicht“, depot gleich „Ja“) als Depot zum Investieren mit der Antwort auf „Hast du schon ein Depot?“.
 */
export const ersteAntwortAus = (art: Art | undefined, wert: string | null): Antworten => {
  if (!wert) return {};
  if ((ZIEL_WERTE as readonly string[]).includes(wert)) return { ziel: wert as Ziel };
  if (art !== "depot" && (ZAHLUNG_WERTE as readonly string[]).includes(wert)) return { art: "konto", zahlung: wert as Zahlung };
  if (art !== "konto" && (wert === "keine" || wert === "erste" || wert === "depot")) return { ziel: "invest", hatDepot: wert === "depot" ? "ja" : "nein" };
  return {};
};

/** Messgruppe der Bank von heute fürs Ereignis: nie der freie Text. */
export const bankGruppeFuerMessung = (a: Antworten): string => a.bank?.gruppe ?? "";

// ---------------------------------------------------------------------------
// RN11: Ladescreen-Texte je Weg und das Problem des alten Kontos oder Depots (Wischkarte 2 der Fassung B)

/** Texte des Ladescreens (CheckLaden.tsx). Genau vier Zeilen, die dritte zählt {n} von {max}. */
export type LadenTexte = { oben: string; titel: string; schritte: [string, string, string, string]; zaehlerMax: number };

const LADEN_ANLAGE: Record<Anlage, string> = {
  etf: "Halal-ETFs und Fonds je Depot zählen",
  aktien: "Ordergebühren für einzelne Aktien prüfen",
  gold: "Gold und Silber je Depot prüfen",
  offen: "ETFs, Gold und Sukuk je Depot zählen",
};

/**
 * Elias RN9-01: „passender Ersatz für Sparkasse wird gesucht“; RN9-02: personalisiert, Trommelwirbel, kostet sichtbar Zeit.
 * Die Zeilen nennen nur, worauf die Empfehlung wirklich beruht (Zahlungsart, Halal oder Kosten, gewählte Anlage), der Zähler läuft
 * bis zur Zahl der getesteten Konten (54) oder Depots (35).
 */
export const ladenTexte = (a: Antworten): LadenTexte => {
  if (artVon(a) === "konto") {
    const b = a.bank;
    const titel = b && b.kind !== "keine" && b.name ? `Passender Ersatz für ${b.name} wird gesucht` : "Dein passendes Girokonto wird gesucht";
    return {
      oben: "Danke für deine Antworten!",
      titel,
      schritte: [
        "Konten ohne Zinsen auf dein Guthaben filtern",
        a.zahlung === "bar" ? "Banken mit Filiale prüfen" : "Kartenzahlung und Kosten prüfen",
        "{n} von {max} Girokonten verglichen",
        "Dein Match festlegen",
      ],
      zaehlerMax: KONTEN_GETESTET,
    };
  }
  const h = a.depotHeute;
  return {
    oben: "Danke für deine Antworten!",
    titel: h && h.name ? `Passender Ersatz für ${h.name} wird gesucht` : "Dein passendes Halal-Depot wird gesucht",
    schritte: [
      a.praef === "kosten"
        ? "Halal-Depots nach Kosten sortieren"
        : a.praef === "mix"
          ? "Halal-Depots nach Halal-Anlagen und Kosten sortieren"
          : "Halal-Depots nach Halal-Anlagen sortieren",
      a.anlage ? LADEN_ANLAGE[a.anlage] : "Sparpläne und Gebühren prüfen",
      "{n} von {max} Depots verglichen",
      "Dein Match festlegen",
    ],
    zaehlerMax: DEPOTS_GETESTET,
  };
};

/** Wischkarte „Dein altes Konto hatte dieses Problem“: nur belegte Werte; ohne Wert eine ehrliche Zeile, ohne Problem keine Karte. */
export type Problem = { titel: string; zeilen: string[]; satz?: string };

const istNullEuro = (w: string) => /^(ab\s)?0(,00)?\s?€$/.test(w.replace(/ /g, " ").trim());

export const problemVon = (e: Ergebnis, a: Antworten): Problem | null => {
  if (e.schonDa || !e.links) return null;
  if (e.art === "konto") {
    const b = a.bank;
    const bei = b?.kind === "bank" && b.dativ ? b.dativ : b?.kind === "frei" && b.name ? b.name : "deiner Bank";
    const preis = e.links.zeilen[0];
    if (!preis) return null;
    if (preis.wert === KEIN_PREIS) {
      return {
        titel: `Was kostet dich dein Konto bei ${bei}?`,
        zeilen: [],
        satz: `Die Kontoführung bei ${bei} steht in deinem Kontoauszug. Bei ${e.anbieter.name} sind es 0 € im Monat.`,
      };
    }
    if (istNullEuro(preis.wert)) return null;
    return {
      titel: `Dein Konto bei ${bei} hatte dieses Problem`,
      zeilen: [`Kontoführung ${preis.wert} im Monat`, ...(preis.zusatz ?? [])],
    };
  }
  // Depot: Zeilen in der Reihenfolge von depotZeilen; nur was beim alten Depot belegt schlechter ist als beim Match.
  const alt = e.links.zeilen;
  const neu = e.rechts?.zeilen ?? [];
  const wert = (z: Zeile[], label: string) => z.find((x) => x.label === label)?.wert ?? KEIN_WERT;
  const zeilen: string[] = [];
  for (const label of ["Halal-ETFs und Fonds", "Gold und Silber", "Sukuk"]) {
    const x = wert(alt, label);
    const y = wert(neu, label);
    if (x !== KEIN_WERT && y !== KEIN_WERT && anteilVon(x) < anteilVon(y)) zeilen.push(`${label}: nur ${x} (bei ${e.anbieter.name} ${y})`);
  }
  const zins = wert(alt, "Guthaben");
  if (zins === ZINS_TEXT.schlecht) zeilen.push("Zinsen auf dein Guthaben nicht abschaltbar");
  if (zins === ZINS_TEXT.teils) zeilen.push("Zinsen auf dein Guthaben musst du selbst abschalten");
  const geb = wert(alt, "Depotgebühr");
  if (geb !== KEIN_WERT && ersterEuro(geb) > ersterEuro(wert(neu, "Depotgebühr"))) zeilen.push(`Depotgebühr ${geb}`);
  const ord = wert(alt, "Order");
  if (ord !== KEIN_WERT && ersterEuro(ord) > ersterEuro(wert(neu, "Order"))) zeilen.push(`Order ${ord}`);
  if (zeilen.length === 0) return null;
  return { titel: `Dein Depot bei ${e.links.name} hatte dieses Problem`, zeilen: zeilen.slice(0, 4) };
};

// ---------------------------------------------------------------------------
// Fassung B (Elias RN11-02): kürzere Vorteile für die Match-Karte und die Zeilen der Karte „Vergleich“

/** „unter 30 oder ab 500 € Geldeingang“: die Bedingung ohne „im Monat, sonst …“, Werte aus girokontoBonus.ts. */
const kontoBedingungKurz = (k: BonusKonto) => `unter ${k.gratisUnter} oder ab ${euro(k.gratisAb)} Geldeingang`;

const kontoZuAnbieter = (e: KontoErgebnis): BonusKonto => (e.anbieter.kurz === "bb" ? BB : NORIS);

/** Höchstens drei kurze Vorteile für die Match-Karte (Konto: gekürzte belegte Felder, Depot: die ersten drei vorhandenen). */
export const kurzVorteile = (e: Ergebnis): string[] => {
  if (e.art === "depot") return e.vorteile.slice(0, 3);
  const k = kontoZuAnbieter(e);
  return [`0 € Kontoführung ${kontoBedingungKurz(k)}`, k.karte, `Bargeld ${k.bargeld.charAt(0).toLowerCase()}${k.bargeld.slice(1)}`];
};

// ---------------------------------------------------------------------------
// Ein, zwei Sätze unter „Dein Match: …“ (RN15, Elias RN15-01: „Du suchst ein Konto, welches flexibel und günstig ist. Du schreibst das, womit
// sie wirklich sich identifizieren können … ein, zwei Sachen, die aber auch wirklich zu deren beantworteten Fragen passen“). Nur das, was der
// Leser selbst angegeben hat (Bezahlweise, Bank von heute, beim Depot Anlage und Wichtigstes); „günstig“ deckt sich mit 0 € im Monat.

const KONTO_ZAHLUNG: Record<Zahlung, { sie: string; wunsch: string }> = {
  karte: { sie: "zahlst fast nur mit Karte", wunsch: "Du suchst ein Konto, das günstig und flexibel ist." },
  "karte-bar": { sie: "zahlst mit Karte und ab und zu bar", wunsch: "Du suchst ein Konto, bei dem beides günstig bleibt." },
  bar: { sie: "zahlst viel bar", wunsch: "Du suchst ein günstiges Konto mit Filiale." },
};
const PRAEF_WICHTIG: Record<Praef, string> = { halal: "viele Halal-Anlagen", kosten: "niedrige Kosten", mix: "viele Halal-Anlagen bei niedrigen Kosten" };

/** Höchstens zwei kurze Sätze, in denen sich der Leser wiedererkennt; leer, wenn das Match schon sein Konto oder Depot ist. */
export const matchSatz = (e: Ergebnis, a: Antworten): string => {
  if (e.schonDa) return "";
  if (e.art === "konto") {
    const z = a.zahlung ? KONTO_ZAHLUNG[a.zahlung] : undefined;
    const bank = a.bank;
    const heute = bank?.kind === "keine" ? "Du hast noch kein Konto" : bank ? `Du hast dein Konto bei ${bank.dativ || bank.name}` : "";
    const erster = heute ? (z ? `${heute} und ${z.sie}.` : `${heute}.`) : z ? `Du ${z.sie}.` : "";
    return [erster, z?.wunsch ?? "Du suchst ein Konto, das günstig und flexibel ist."].filter(Boolean).join(" ");
  }
  const depot = a.depotHeute ? `Du hast dein Depot bei ${a.depotHeute.dativ || a.depotHeute.name || "einer anderen Bank"}.` : a.hatDepot === "nein" ? "Du hast noch kein Depot." : "";
  const wichtig = a.praef ? `legst Wert auf ${PRAEF_WICHTIG[a.praef]}` : "";
  const anlage = a.anlage && ANLAGE_SATZ[a.anlage] ? `willst ${ANLAGE_SATZ[a.anlage]}` : "";
  const wunsch = [anlage, wichtig].filter(Boolean).join(" und ");
  return [depot, wunsch ? `Du ${wunsch}.` : ""].filter(Boolean).join(" ");
};

/** Eine Seite einer Vergleichszeile: `ja` setzt ein Häkchen, `nein` ein rotes Kreuz, KEIN_WERT und KEIN_PREIS stehen leise. */
export type VergleichZelle = { text: string; ja?: boolean; nein?: boolean; klein?: string };
export type VergleichZeile = { label: string; links: VergleichZelle; rechts: VergleichZelle };

// ---------------------------------------------------------------------------
// Kontoführung als ein Wert je Seite mit Haken (RN14, Elias RN14-01: „Dass man es aber irgendwie nicht alles grün macht, sondern halt nur
// die Haken.“ „dieses ab 1000 Euro und so, das kann ein bisschen cleaner gemacht werden, einfach nur, dass es die Haken sind.“ Ersetzt die
// farbigen Mini-Punkte aus RN13-02). Wer besser ist, wird aus kontopreise.ts gerechnet (Einzelheiten bei kontofuehrungZeile).

type KostenTeile = { ab?: number; unter?: number; sonst: number; immer?: boolean };
const AB_RE = /ab ([\d.]+)\s?€ (?:Geld|Gehalts)eingang/;
const UNTER_RE = /unter (\d+)/;

const kostenTeile = (p: Kontopreis): KostenTeile | null => {
  if (p.aktiv > 0) return null;
  if (p.grundpreis === 0) return { sonst: 0, immer: true };
  if (!p.bedingung) return null;
  const ab = p.bedingung.match(AB_RE);
  const unter = p.bedingung.match(UNTER_RE);
  const rest = p.bedingung.replace(AB_RE, "").replace(UNTER_RE, "").replace(/\boder\b/g, "").replace(/[\s,]/g, "");
  if (rest !== "" || (!ab && !unter)) return null;
  return { ab: ab ? Number(ab[1].replace(/\./g, "")) : undefined, unter: unter ? Number(unter[1]) : undefined, sonst: p.grundpreis };
};

/** Kleiner ist besser; Rückgabe -1 links besser, 1 rechts besser, 0 gleich. */
const vergleiche = (l: number, r: number) => (l < r ? -1 : l > r ? 1 : 0);

/**
 * Eine Zeile, ein kurzer Wert je Seite, damit am Handy nichts umbricht (gemessen RN14 bei 390 px: „0 € ab 1.000 €“ brach in zwei Zeilen).
 *  - Heute kostenlos ab Geldeingang (oder immer kostenlos): Zeile „Kostenlos ab Geldeingang“, „1.000 €“ gegen „500 €“, Haken beim kleineren
 *    Betrag, bei gleichem Betrag beide; „immer“ schlägt jeden Betrag. Hat die heutige Bank einen zweiten Weg (comdirect „oder 3 Zahlungen mit
 *    Apple Pay“), kein Haken und kein Kreuz.
 *  - Heute kostet es auch bei 1.000 € Geldeingang (Regel „aktiv“ in kontopreise.ts): Zeile „Kontoführung“, „4,90 €“ mit Kreuz gegen „0 €“.
 *  - Kein belegter Preis heute: „steht in deinem Kontoauszug“ gegen „0 €“, ohne Haken und Kreuz.
 */
const kontofuehrungZeile = (e: KontoErgebnis, k: BonusKonto, fuehrung: Zeile | undefined): VergleichZeile => {
  const linksText = fuehrung?.wert ?? KEIN_PREIS;
  const p = e.heutePreis;
  const zeile = (label: string, links: string, rechts: string, sieger: number | null): VergleichZeile => ({
    label,
    links: { text: links, ...(sieger === null ? {} : sieger <= 0 ? { ja: true } : { nein: true }) },
    rechts: { text: rechts, ...(sieger === null ? {} : sieger >= 0 ? { ja: true } : { nein: true }) },
  });
  const AB_LABEL = "Kostenlos ab Geldeingang";
  if (!p || linksText === KEIN_PREIS) return zeile("Kontoführung", linksText, euro(0), null);
  if (p.aktiv > 0) return zeile("Kontoführung", linksText, euro(0), 1);
  const l = kostenTeile(p);
  if (l?.immer) return zeile(AB_LABEL, "immer", euro(k.gratisAb), -1);
  if (l?.ab !== undefined) return zeile(AB_LABEL, euro(l.ab), euro(k.gratisAb), vergleiche(l.ab, k.gratisAb));
  const ab = p.bedingung?.match(AB_RE);
  if (ab) return zeile(AB_LABEL, euro(Number(ab[1].replace(/\./g, ""))), euro(k.gratisAb), null);
  return zeile("Kontoführung", linksText.replace(/^ab /, ""), euro(0), null);
};

// ---------------------------------------------------------------------------
// Alltag-Unterschiede (RN14, Elias RN13-01 „machst du eher den Vergleich davon“): nur Werte aus dem Girokonto-Vergleich, in beide
// Richtungen ehrlich, auch rot bei der norisbank. Gleiche oder nicht lesbare Werte fallen weg.

const euroAus = (v: unknown): number | null => {
  if (typeof v !== "string") return null;
  const m = v.match(/(\d+(?:,\d+)?)\s?€/);
  return m ? Number(m[1].replace(",", ".")) : null;
};
const euroText = (n: number) => euro(n).replace(/\u00a0/g, " ");
const abhebenText = (v: unknown) => (typeof v === "string" && /unbegrenzt/i.test(v) ? "unbegrenzt" : `${String(v)} im Monat`);
const einzahlenText = (v: unknown) => {
  const t = einzahlenAnteil(v);
  return t === 0 ? "nicht möglich" : t >= 0.8 ? "kostenlos" : "mit Gebühr";
};

/** „keine Girocard“ und „keine Debitkarte“ stehen so im Girokonto-Vergleich (Trade Republic, N26 …): Wer die Karte gar nicht hat, liegt hinter jedem Preis (Elias RN15-01: „es hat eine Karte, die Trade Republic nicht hat, die Girokarte“). */
const keineKarte = (v: unknown) => typeof v === "string" && /^keine/i.test(v);
const kartePreisAnteil = (v: unknown): number | null => {
  if (keineKarte(v)) return -1000;
  const n = euroAus(v);
  return n === null ? null : -n;
};
const karteText = (v: unknown) => (keineKarte(v) ? "keine" : euroText(euroAus(v) ?? 0));

type AlltagPunkt = { label: string; key: string; nurMitBar?: boolean; anteil: (v: unknown) => number | null; text: (v: unknown) => string };
const ALLTAG_PUNKTE: AlltagPunkt[] = [
  { label: "Girocard im Monat", key: "girocard", anteil: kartePreisAnteil, text: karteText },
  { label: "Debitkarte im Monat", key: "debitkarte", anteil: kartePreisAnteil, text: karteText },
  { label: "Kostenlos abheben", key: "abhebungen", anteil: (v) => (typeof v === "string" ? abhebenAnteil(v) : null), text: abhebenText },
  { label: "Bargeld einzahlen", key: "bargeldEinzahlen", nurMitBar: true, anteil: (v) => (typeof v === "string" ? einzahlenAnteil(v) : null), text: einzahlenText },
  { label: "Filialen", key: "filialen", nurMitBar: true, anteil: (v) => (v === true ? 1 : v === false ? 0 : null), text: (v) => (v ? "ja" : "keine") },
];

/**
 * Alltag-Zeilen in beide Richtungen. Bargeld einzahlen und Filialen zählen für alle, die bar zahlen. Wer fast nur mit Karte zahlt, bekommt sie
 * nur, wenn die Empfehlung dort vorn liegt, und nachrangig (RN15, Elias RN15-01: die norisbank soll immer besser dastehen, ohne Zeile „ja, ja“).
 */
const alltagZeilen = (e: KontoErgebnis, k: BonusKonto): { zeile: VergleichZeile; nachrangig: boolean }[] => {
  const heute = e.heuteBank ? bankRoh(e.heuteBank) : {};
  const match = produktRoh(k.id);
  const mitBar = e.zahlung !== "karte";
  const zeilen: { zeile: VergleichZeile; nachrangig: boolean }[] = [];
  for (const p of ALLTAG_PUNKTE) {
    const lv = heute[p.key];
    const rv = match[p.key];
    const la = p.anteil(lv);
    const ra = p.anteil(rv);
    if (la === null || ra === null || la === ra) continue;
    const lBesser = la > ra;
    const nachrangig = Boolean(p.nurMitBar) && !mitBar;
    if (nachrangig && lBesser) continue;
    zeilen.push({
      zeile: {
        label: p.label,
        links: { text: p.text(lv), ja: lBesser, nein: !lBesser },
        rechts: { text: p.text(rv), ja: !lBesser, nein: lBesser },
      },
      nachrangig,
    });
  }
  return zeilen;
};

/** Gibt es für eine Seite keinen belegten Wert, steht dort „–“, nie eine geratene Zahl oder ein Kreuz. */
export const vergleichZeilen = (e: Ergebnis): VergleichZeile[] => {
  const { links, rechts } = e;
  if (!links || !rechts) return [];
  const finde = (s: Spalte, label: string) => s.zeilen.find((z) => z.label === label);
  const text = (z: Zeile | undefined): VergleichZelle => ({ text: z?.wert ?? KEIN_WERT });

  if (e.art === "depot") {
    // Nur Unterschiede (Elias RN11-04 „immer die, wo die sich unterscheiden“, gilt für jeden Vergleich): gleiche Werte fallen weg.
    return ["Passt zu deinen Antworten", "Halal-ETFs und Fonds", "Depotgebühr", "Order"]
      .map((label) => ({ label, links: text(finde(links, label)), rechts: text(finde(rechts, label)) }))
      .filter((z) => z.label === "Passt zu deinen Antworten" || z.links.text !== z.rechts.text);
  }

  // Konto: immer drei Punkte (Elias RN12-01 „Also immer 3 Punkte.“). Kontoführung steht immer, ein Wert je Seite mit Haken (RN14-01).
  // Dann, worin die heutige Bank bei Dispo und Zinsen belegt schlechter ist (RN11-04), dann Alltag-Unterschiede in beide Richtungen
  // (RN13-01, RN14-01 „es ist nicht schlimm, wenn auch mal ING einen besseren Punkt hat“), dann was beide sonst gemeinsam haben, dann
  // Offenes („–“). Was beide halal gemeinsam haben (kein Dispo, keine Zinsen), steht nicht als Zeile (RN13-01) und seit RN14-01 auch nicht
  // mehr als Satz darunter.
  const k = kontoZuAnbieter(e);
  const zeilen: VergleichZeile[] = [kontofuehrungZeile(e, k, finde(links, "Kontoführung im Monat"))];
  const h = e.heuteHalal;
  const m = produktWerte(k.id);
  const unterschied: VergleichZeile[] = [];
  const gemeinsam: VergleichZeile[] = [];
  const offen: VergleichZeile[] = [];
  for (const p of KONTO_PUNKTE) {
    const mw = m[p.key];
    if (!istGut(mw)) continue;
    const hw = h ? h[p.key] : null;
    if (hw === null || hw === undefined) offen.push({ label: p.label, links: { text: KEIN_WERT }, rechts: { text: p.gut, ja: true } });
    else if (istGut(hw)) {
      if (!p.halal) gemeinsam.push({ label: p.label, links: { text: p.gut, ja: true }, rechts: { text: p.gut, ja: true } });
    } else unterschied.push({ label: p.label, links: { text: p.schlecht(hw), nein: true }, rechts: { text: p.gut, ja: true } });
  }
  // RN15 (Elias RN15-01: „Norris Bank muss immer besser dastehen natürlich“, „ja, ja … das ist ja voll schlecht“): erst die Zeilen, in denen
  // die Empfehlung klar vorn liegt, dann offene (heute „–“), dann gleiche als Füller, Zeilen mit Vorteil für die heutige Bank ganz zuletzt
  // (nur wenn sonst keine drei Zeilen zusammenkommen). Gleicher Rang behält die Reihenfolge von oben (Kontoführung zuerst).
  // RN16 (Elias RN15-03: „immer wenn es einen Zinspunkt gibt, wird er direkt rot angestrichen … Erstmal C24, sagen wir mal Zinsen. Das ist
  // das allererste … Wenn dann Dispo ist sozusagen zweite Priorität“): Zinsen der heutigen Bank zuerst, dann Dispo, beide nur aus dem
  // Girokonto-Vergleich (jeder Wert dort mit Quelle beim Anbieter, Test „Zinsen und Dispo im Check nur mit Anbieter-Beleg“). Danach die
  // übrigen Zeilen wie in RN15 sortiert, zusammen immer drei.
  const zins = unterschied.filter((z) => z.label === LABEL_ZINSEN);
  const dispo = unterschied.filter((z) => z.label === LABEL_DISPO);
  const rest = unterschied.filter((z) => z.label !== LABEL_ZINSEN && z.label !== LABEL_DISPO);
  const alltag = alltagZeilen(e, k);
  const nachrangig = new Set(alltag.filter((a) => a.nachrangig).map((a) => a.zeile));
  const sortiert = [...zeilen, ...rest, ...alltag.map((a) => a.zeile), ...gemeinsam, ...offen]
    .map((z, n) => ({ z, n, r: vergleichRang(z) + (nachrangig.has(z) ? 0.5 : 0) }))
    .sort((x, y) => x.r - y.r || x.n - y.n)
    .map((x) => x.z);
  return [...zins, ...dispo, ...sortiert].slice(0, 3);
};

/**
 * RN16 (Elias RN15-03: „Und wenn beide halt gut sind da, dann muss man es irgendwie sagen, ey, N26 und Ding, beide halal nutzbar. Ne? Und
 * dann die drei Punkte“): steht über den drei Zeilen, nur wenn die heutige Bank und die Empfehlung im Girokonto-Vergleich beide belegt
 * ohne Zinsen und ohne Dispo sind. Ersetzt RN14-01 („kein Satz Beide“). Freie Eingaben und offene Werte: kein Satz.
 */
export const vergleichBeideHalal = (e: Ergebnis): string | null => {
  if (e.art !== "konto" || !e.links || !e.heuteHalal || !e.heuteBank || e.heuteBank.kind !== "bank") return null;
  const m = produktWerte(kontoZuAnbieter(e).id);
  const h = e.heuteHalal;
  if (h.zinsfrei !== "gut" || h.keinDispo !== "gut" || m.zinsfrei !== "gut" || m.keinDispo !== "gut") return null;
  return `${e.heuteBank.name} und ${e.anbieter.name}: beide halal nutzbar`;
};

/** 0 Empfehlung klar vorn (Häkchen gegen Kreuz; +0,5 für Bargeld-Zeilen bei Kartenzahlern), 1 offen (links ohne Wert oder ohne Wertung), 2 gleich (beide Häkchen), 3 heutige Bank vorn. */
const vergleichRang = (z: VergleichZeile): number => {
  if (z.rechts.nein || (z.links.ja && !z.rechts.ja)) return 3;
  if (z.links.ja && z.rechts.ja) return 2;
  if (z.rechts.ja && z.links.nein) return 0;
  return 1;
};

/** Die Punkte nach der Kontoführung, in dieser Reihenfolge (Spalten des Girokonto-Vergleichs). `halal`: gemeinsam nie als Zeile. */
type KontoPunkt = {
  key: "keinDispo" | "zinsfrei" | "karteOhneKredit" | "applePay" | "kontowechsel";
  label: string;
  gut: string;
  schlecht: (v: BankAmpel | boolean) => string;
  halal?: boolean;
};
const istGut = (v: BankAmpel | boolean | null | undefined) => v === "gut" || v === true;
// RN13-02: „Dispo an, mehr musst du gar nicht wissen. Kein Dispo.“ Kein grauer Zusatz mehr.
const LABEL_DISPO = "Dispo";
const LABEL_ZINSEN = "Zinsen auf Guthaben";
const KONTO_PUNKTE: KontoPunkt[] = [
  { key: "keinDispo", label: LABEL_DISPO, gut: "kein Dispo", schlecht: () => "Dispo an", halal: true },
  { key: "zinsfrei", label: LABEL_ZINSEN, gut: "keine Zinsen", schlecht: (v) => (v === "teils" ? "Zinsen, abschaltbar" : "Zinsen"), halal: true },
  { key: "karteOhneKredit", label: "Karte ohne Kredit", gut: "ja", schlecht: (v) => (v === "teils" ? "nicht immer" : "nein") },
  { key: "applePay", label: "Apple Pay oder Google Pay", gut: "ja", schlecht: () => "nein" },
  { key: "kontowechsel", label: "Kontowechsel-Service", gut: "ja", schlecht: () => "nein" },
];

/** Unter dem Konto-Vergleich (Elias RN11-04: „Also ich schreibe einfach in 10 Minuten.“). */
export const WECHSEL_ZEIT = "Wechsel in 10 Minuten";

/**
 * Karte „Alles wird für dich rübergezogen“ (Elias RN11-04), nur norisbank mit heutiger Bank. Beleg: norisbank Kontowechselhilfe,
 * https://www.norisbank.de/dam/norisbank/de/shared/pdf/nb_Kontowechselhilfe.pdf (gelesen 16.11.2026): „Bitte füllen Sie einfach die
 * beigefügte Ermächtigung aus“, die Bank veranlasst „die Übertragung von Daueraufträgen, Lastschrifteinzügen und regelmäßig
 * wiederkehrenden Überweisungseingängen auf Ihr neues Konto“, „kostenlose norisbank Kontowechselhilfe“. Bild: Seite 1 der Ermächtigung,
 * public/bilder/check/norisbank-kontowechsel.webp.
 */
export const UEBERZUG = {
  titel: "Alles wird für dich rübergezogen",
  satz: "Du füllst ein Formular aus. Die norisbank holt Daueraufträge, Lastschriften und dein Gehalt von deiner alten Bank, kostenlos.",
  bild: "/bilder/check/norisbank-kontowechsel.webp",
  alt: "Formular Kontowechselhilfe der norisbank",
};


/**
 * Karte „Einrichtung super easy“ (Elias RN12-03: „man könnte noch einen dritten Einrichtung super easy oder so und dann also immer
 * 3 Slides Minimum“), nur ohne heutiges Konto oder Depot (sonst stehen dort der Vergleich und beim Konto das Rüberziehen). Nur belegte Werte: App und Ident-App aus
 * brokerStart.ts (Store-Seiten geprüft 08.11.2026; hier abgeschrieben, damit der Check die schwere Datei nicht lädt, ein Test prüft
 * die Gleichheit), Steuer aus dem Depot-Vergleich (brokerVergleich.ts, Feld kapest).
 */
export const EINRICHTUNG_APP: Record<DepotKurz, { app: string; ident: string }> = {
  fl: { app: "flatex next", ident: "POSTIDENT" },
  sb: { app: "Smartbroker+", ident: "POSTIDENT" },
  // Traders Place: Ausweisen per eID in der eigenen App (brokerStart.ts, app.zweck „auch zum Ausweisen“, Elias' Aufnahme bei 3:12).
  tp: { app: "Traders Place", ident: "Traders Place" },
};
const VERGLEICH_ID: Record<DepotKurz, string> = { fl: "flatex-depot", sb: "smartbroker-plus-depot", tp: "traders-place-depot" };

export type Einrichtung = { titel: string; zeilen: string[] };
export const EINRICHTUNG_TITEL = "Einrichtung super easy";

export const einrichtungVon = (e: Ergebnis): Einrichtung | null => {
  if (e.schonDa || e.links) return null;
  if (e.art === "konto") {
    // Konto ohne Bank von heute: Eröffnung aus girokontoBonus.ts, Apple Pay und Dispo aus dem Girokonto-Vergleich.
    const k = kontoZuAnbieter(e);
    const w = produktWerte(k.id);
    return {
      titel: EINRICHTUNG_TITEL,
      zeilen: [
        `Eröffnung per ${k.ident}`,
        ...(w.applePay ? ["Bezahlen mit Apple Pay oder Google Pay"] : []),
        ...(w.keinDispo === "gut" ? ["Kein Dispo ab Eröffnung"] : []),
      ],
    };
  }
  const kurz: DepotKurz = e.anbieter.kurz === "sb" || e.anbieter.kurz === "tp" ? e.anbieter.kurz : "fl";
  const { app, ident } = EINRICHTUNG_APP[kurz];
  const kapest = (brokerVergleich.find((b) => b.id === VERGLEICH_ID[kurz])?.werte as Record<string, unknown> | undefined)?.kapest === true;
  return {
    titel: EINRICHTUNG_TITEL,
    zeilen: [
      `Ausweisen mit der ${ident}-App am Handy`,
      `Alles in der App ${app}, für iPhone und Android`,
      ...(kapest ? ["Steuern führt die Bank für dich ab"] : []),
    ],
  };
};
