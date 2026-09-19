import type { MotivName } from "@/components/motive";
import type { VergleichsZeile } from "@/components/vergleich/vergleichTypen";
import type { Kategorie } from "@/lib/bewertung";
import {
  ampelGut,
  anzahlVon,
  euro,
  jaNein,
  kostetNichts,
  mindestensEins,
  sparplanAb,
  type Auswahl,
  type Grund,
  type Prioritaet,
  type Wunsch,
} from "@/lib/vergleichAssistent";
import type { RohAnbieter } from "./vergleichHelfer";
import { ANLAGEN_KAUFBAR } from "./anlagenKaufbar";
import { regionFuer } from "./anlageRegion";
import { halalAnlagen } from "./halalAnlagen";
import { brokerVergleich, DEPOT_FINANZ_MAX, DEPOT_ZEILEN } from "./brokerVergleich";
import { girokontoVergleich, GIRO_FINANZ_MAX, GIRO_ZEILEN } from "./girokontoVergleich";
import { kryptoVergleich, KRYPTO_FINANZ_MAX, KRYPTO_ZEILEN } from "./kryptoVergleich";
import { screenerVergleich, SCREENER_ZEILEN } from "./screenerVergleich";
import { steuersoftwareVergleich, STEUER_ZEILEN } from "./steuersoftwareVergleich";

/**
 * Der geführte Vergleich: ein Fragebogen für alles, am Ende ein Paket.
 *
 * Grundsätze (Elias, 19.09.2026):
 *
 * - Die Leute an die Hand nehmen. Gefragt wird, was jeder beantworten kann: wie
 *   viel, wie lange, wofür. Kein Fachwort ohne einen Halbsatz dahinter.
 * - Nicht jeder bekommt dieselben Fragen. `zeigeWenn` hängt eine Frage an
 *   frühere Antworten.
 * - Das Ergebnis ist eine Kombination aus Bausteinen: Depot, dazu bei einzelnen
 *   Aktien eine App zum Prüfen, dazu Konto, Krypto-Börse, Steuerprogramm.
 * - Jede Antwort zeigt auf Felder, die es in den Datendateien gibt. Eine Frage
 *   ohne Datenfeld gehört nicht hierher. Deshalb fragen wir nicht nach dem
 *   Einkommen: Kein Feld hängt daran.
 * - Empfohlen werden Anbieter und Werkzeuge, nie ein einzelnes Wertpapier. Wer
 *   nach persönlichen Angaben ein bestimmtes Wertpapier nennt, berät zur Anlage.
 *
 * Eine Antwort wirkt auf den Baustein ihrer Frage, über `auch` zusätzlich auf
 * andere. So gilt "niedrige Kosten" für Depot, Konto und Krypto zugleich.
 */

export type BausteinId = "depot" | "screener" | "krypto" | "girokonto" | "steuer";

export type Wirkung = {
  wuensche?: Wunsch[];
  gewichte?: Record<string, number>;
  prioritaet?: Prioritaet;
  /** Satz unter dem Anbieter: warum er zu dieser Antwort passt. */
  grund?: Grund;
  /** Zweitrangige Sortierung, 0 bis 1. */
  nebenSort?: (a: RohAnbieter) => number | null;
};

export type Antwort = Wirkung & {
  id: string;
  titel: string;
  /** Bild auf der Antwortkarte. Pflicht: Eine Karte ohne Bild fällt aus der Reihe. */
  bild: MotivName;
  /** Nur wo ein Wort erklärt werden muss (ETF, Sukuk, Girocard). Keine Füllsätze. */
  unter?: string;
  auch?: Partial<Record<BausteinId, Wirkung>>;
};

/** Antwort-IDs je Frage, so wie sie im Zustand und im sessionStorage liegen. */
export type Antworten = Record<string, string[]>;

export type Frage = {
  id: string;
  fuer: BausteinId | "start";
  titel: string;
  hinweis?: string;
  mehrfach?: boolean;
  /** Text des Weiter-Knopfs, solange bei einer Mehrfachfrage nichts gewählt ist. */
  ohneWahl?: string;
  zeigeWenn?: (a: Antworten) => boolean;
  antworten: Antwort[];
};

export type Baustein = {
  id: BausteinId;
  titel: string;
  /** Ein Satz, wozu der Baustein im Paket ist. */
  wozu: string;
  /** null: keine Halal-Regel und keine Note, es wird nur gefiltert. */
  kategorie: Kategorie | null;
  vergleich: string;
  vergleichText: string;
  anbieter: RohAnbieter[];
  finanzMax: Record<string, number>;
  zeilen: VergleichsZeile[];
  /** Zeilen, die immer unter dem Anbieter stehen, wenn keine Priorität eigene mitbringt. */
  fakten: string[];
  /** Gründe, die unabhängig von den Antworten dastehen, wenn sie belegt sind. */
  immer?: Grund[];
  /** Grundordnung von 0 bis 1 für Bausteine ohne Notenlogik, nur aus Belegtem. */
  grundSort?: (a: RohAnbieter) => number | null;
  aktiv: (a: Antworten) => boolean;
};

const hat = (a: Antworten, frage: string, id: string) => a[frage]?.includes(id) ?? false;

/* ------------------------------------------------------------ Prüfhelfer */

const halalAnlagenZahl = (a: RohAnbieter) => {
  const z = ["halalEtfsFonds", "halalSukuk", "halalEdelmetalle"].map((k) => anzahlVon(a.werte[k]));
  return z.every((x) => x === null) ? null : z.reduce<number>((s, x) => s + (x ?? 0), 0);
};

const sparplanBis = (grenze: number): Wunsch => ({
  id: `sparplan${grenze}`,
  label: grenze < 25 ? "Sparplan unter 25 € möglich" : "Sparplan möglich",
  still: true,
  pruefe: (a) => {
    const ab = sparplanAb(a.werte.sparrate);
    return ab === null ? null : ab <= grenze;
  },
});

const grundSparplan: Grund = (a) => {
  const ab = sparplanAb(a.werte.sparrate);
  return ab === null || ab === Infinity ? null : `Sparplan schon ab ${ab.toLocaleString("de-DE")} €`;
};

const grundWert =
  (key: string, text: (wert: string) => string): Grund =>
  (a) => {
    const w = a.werte[key];
    return typeof w === "string" && w.trim() ? text(w) : null;
  };

const grundAnzahl =
  (key: string, text: (n: number, von: string) => string): Grund =>
  (a) => {
    const w = a.werte[key];
    const n = anzahlVon(w);
    if (n === null || n === 0 || typeof w !== "string") return null;
    return text(n, w.match(/von\s+(\d+)/)?.[1] ?? "");
  };

/** Screening-Apps: Reicht die kostenlose Fassung, um Aktien zu prüfen? Liest das belegte Feld `kostenlos`. */
export const kostenlosReicht = (a: RohAnbieter) => {
  const w = a.werte.kostenlos;
  return typeof w === "string" && w.trim() !== "" && !/danach Abo|nur eine|eine Prüfung/i.test(w);
};

const wennGut =
  (key: string, satz: string): Grund =>
  (a) =>
    a.werte[key] === "gut" ? satz : null;

const wennJa =
  (key: string, satz: string): Grund =>
  (a) =>
    a.werte[key] === true ? satz : null;

const mehrere =
  (...gruende: Grund[]): Grund =>
  (a) => {
    const teile = gruende.map((g) => g(a)).filter(Boolean);
    return teile.length > 0 ? teile.join(", ") : null;
  };

/** Halal-Aktienfonds einer Region und wo sie kaufbar sind. Quelle: `anlagenKaufbar.ts`. */
const fondsDerRegion = (region: string) =>
  halalAnlagen.filter((x) => x.kategorie === "aktien" && x.isin && regionFuer(x.isin)?.label === region);

const kaufbareFonds = (a: RohAnbieter, region: string) =>
  fondsDerRegion(region).filter((f) => ANLAGEN_KAUFBAR[f.isin!]?.kaufbar.some((k) => k.anbieter === a.name));

const regionWunsch = (region: string, label: string): Wunsch => ({
  id: `region-${region}`,
  label,
  still: true,
  pruefe: (a) => {
    if (kaufbareFonds(a, region).length > 0) return true;
    const fonds = fondsDerRegion(region);
    const ueberallGeprueft = fonds.every((f) => ANLAGEN_KAUFBAR[f.isin!]?.nichtImAngebot.includes(a.name));
    return fonds.length > 0 && ueberallGeprueft ? false : null;
  },
});

const grundRegion =
  (region: string, wort: string): Grund =>
  (a) => {
    const n = kaufbareFonds(a, region).length;
    if (n === 0) return null;
    return n === 1 ? `1 Halal-Fonds für ${wort} kaufbar` : `${n} Halal-Fonds für ${wort} kaufbar`;
  };

/* ---------------------------------------------------------- Prioritäten */

const DEPOT_KOSTEN: Prioritaet = {
  id: "kosten",
  label: "niedrige Kosten",
  gewichte: { depotgebuehr: 2, etfSparplanProzent: 2, etfSparplanPauschal: 2, orderProzent: 2, orderPauschal: 2 },
  fakten: ["depotgebuehr", "orderkosten", "etfSparplanKosten"],
};
const DEPOT_AUSWAHL: Prioritaet = {
  id: "auswahl",
  label: "große Halal-Auswahl",
  gewichte: {},
  halalAnteil: 0.65,
  fakten: ["halalEtfsFonds", "halalSukuk", "halalEdelmetalle"],
};
const DEPOT_APP: Prioritaet = {
  id: "app",
  label: "App und Service",
  gewichte: { app: 3, kundenservice: 3 },
  fakten: ["appIos", "appAndroid", "kundenservice"],
};
const GIRO_KOSTEN: Prioritaet = { id: "kosten", label: "niedrige Kosten", gewichte: { kontofuehrung: 2, bankkarte: 2, girocard: 2, debitkarte: 2 }, fakten: ["kontofuehrung", "debitkarte", "girocard"] };
const GIRO_APP: Prioritaet = { id: "app", label: "gute App", gewichte: { app: 4, mobilesBezahlen: 2, ident: 2 }, fakten: ["appIos", "appAndroid", "applePay"] };
const KRYPTO_KOSTEN: Prioritaet = { id: "kosten", label: "niedrige Kosten", gewichte: { gebuehren: 2, transferkosten: 2 }, fakten: ["gesamtkosten", "auszahlungBitcoin"] };
const KRYPTO_EINFACH: Prioritaet = { id: "einfach", label: "einfachen Einstieg", gewichte: { verifizierung: 2, bezahlmethoden: 2, mindestbetrag: 2 }, fakten: ["ident", "einzahlung", "mindestbetrag"] };

const SPARPLAN_GEWICHTE = { etfSparplanProzent: 2, etfSparplanPauschal: 2, mindestsparrate: 2, intervalle: 2, orderProzent: 0.5, orderPauschal: 0.5 };
const KRYPTO_SPARPLAN: Wirkung = {
  wuensche: [{ id: "kryptoSparplan", label: "Sparplan möglich", pruefe: jaNein("sparplan") }],
  gewichte: { sparplan: 3, mindestbetrag: 2 },
};

/** Wer das Geld bald braucht: Depots mit Sukuk und Gold rücken nach vorn, und der Grund steht dabei. */
const KURZ: Wirkung = {
  grund: (a) => {
    const teile = [
      grundAnzahl("halalSukuk", (n, von) => `${n} von ${von} Sukuk`)(a),
      grundAnzahl("halalEdelmetalle", (n, von) => `${n} von ${von} Gold- und Silberpapieren`)(a),
    ].filter(Boolean);
    return teile.length > 0 ? `${teile.join(" und ")} kaufbar` : null;
  },
  nebenSort: (a) => {
    const s = anzahlVon(a.werte.halalSukuk);
    const m = anzahlVon(a.werte.halalEdelmetalle);
    return s === null && m === null ? null : ((s ?? 0) + (m ?? 0)) / 11;
  },
};

/* ---------------------------------------------------------------- Fragen */

const will: Record<"anlegen" | "depot" | "krypto" | "aktien" | "konto" | "steuer", (a: Antworten) => boolean> = {
  anlegen: (a) => hat(a, "vorhaben", "anlegen"),
  depot: (a) => {
    if (!will.anlegen(a)) return false;
    const b = a.bestimmtes ?? [];
    return b.length === 0 || b.some((x) => x !== "krypto");
  },
  krypto: (a) => will.anlegen(a) && hat(a, "bestimmtes", "krypto"),
  aktien: (a) => will.anlegen(a) && hat(a, "bestimmtes", "aktien"),
  konto: (a) => hat(a, "vorhaben", "konto"),
  steuer: (a) => hat(a, "vorhaben", "steuer"),
};

export const fragen: Frage[] = [
  {
    id: "vorhaben",
    fuer: "start",
    titel: "Wobei kann ich dir helfen?",
    hinweis: "Mehrere möglich.",
    mehrfach: true,
    antworten: [
      { id: "anlegen", bild: "wachsen", titel: "Sparen und anlegen" },
      { id: "konto", bild: "karte", titel: "Konto für den Alltag" },
      { id: "steuer", bild: "steuer", titel: "Steuererklärung" },
    ],
  },

  /* --- Geld anlegen --- */
  {
    id: "betrag",
    fuer: "depot",
    titel: "Wie viel willst du anlegen?",
    hinweis: "Grob reicht. Wir sind nicht das Finanzamt.",
    zeigeWenn: will.anlegen,
    antworten: [
      {
        id: "klein", bild: "betragKlein",
        titel: "Unter 25 € im Monat",
        wuensche: [sparplanBis(24)],
        gewichte: SPARPLAN_GEWICHTE,
        grund: grundSparplan,
        auch: { krypto: KRYPTO_SPARPLAN },
      },
      {
        id: "mittel", bild: "betragMittel",
        titel: "25 bis 100 € im Monat",
        wuensche: [sparplanBis(25)],
        gewichte: SPARPLAN_GEWICHTE,
        grund: mehrere(grundSparplan, grundWert("etfSparplanKosten", (w) => `ETF-Sparplan kostet ${w}`)),
        auch: { krypto: KRYPTO_SPARPLAN },
      },
      {
        id: "gross", bild: "betragGross",
        titel: "Mehr als 100 € im Monat",
        wuensche: [sparplanBis(25)],
        gewichte: SPARPLAN_GEWICHTE,
        grund: grundWert("etfSparplanKosten", (w) => `ETF-Sparplan kostet ${w}`),
        auch: { krypto: KRYPTO_SPARPLAN },
      },
      {
        id: "einmal", bild: "geldsack",
        titel: "Einmal einen größeren Betrag",
        gewichte: { orderProzent: 2, orderPauschal: 2, handelsplaetze: 2, etfSparplanProzent: 0.5, etfSparplanPauschal: 0.5 },
        grund: grundWert("orderkosten", (w) => `Ein Kauf kostet ${w}`),
      },
    ],
  },
  {
    id: "dauer",
    fuer: "depot",
    titel: "Wie lange kann das Geld liegen bleiben?",
    hinweis: "Daran hängt, welche Auswahl dein Depot haben sollte.",
    zeigeWenn: will.depot,
    antworten: [
      {
        id: "kurz", bild: "sanduhr",
        titel: "Weniger als 3 Jahre",
        ...KURZ,
      },
      {
        id: "mittel", bild: "kalender",
        titel: "3 bis 10 Jahre",
        grund: grundAnzahl("halalEtfsFonds", (n, von) => `${n} von ${von} Halal-ETFs und Fonds kaufbar`),
        nebenSort: (a) => {
          const n = halalAnlagenZahl(a);
          return n === null ? null : n / 23;
        },
      },
      {
        id: "lang", bild: "baum",
        titel: "Länger als 10 Jahre",
        grund: grundAnzahl("halalEtfsFonds", (n, von) => `${n} von ${von} Halal-ETFs und Fonds kaufbar`),
        nebenSort: (a) => {
          const n = anzahlVon(a.werte.halalEtfsFonds);
          return n === null ? null : n / 12;
        },
      },
      { id: "offen", bild: "frage", titel: "Weiß ich noch nicht" },
    ],
  },
  {
    id: "bestimmtes",
    fuer: "depot",
    titel: "Weißt du schon, was du kaufen willst?",
    hinweis: "Mehrere möglich. Du musst nichts wählen.",
    mehrfach: true,
    ohneWahl: "Nein, zeig mir, was passt",
    zeigeWenn: will.anlegen,
    antworten: [
      { id: "etfs", bild: "etf", titel: "ETFs und Fonds", unter: "Ein Korb aus vielen geprüften Firmen", wuensche: [{ id: "etfs", label: "Halal-ETFs kaufbar", still: true, pruefe: mindestensEins("halalEtfsFonds") }], grund: grundAnzahl("halalEtfsFonds", (n, von) => `${n} von ${von} Halal-ETFs und Fonds kaufbar`) },
      { id: "aktien", bild: "aktienPruefen", titel: "Einzelne Aktien" },
      { id: "metalle", bild: "gold", titel: "Gold und Silber", unter: "Als Wertpapier, im Tresor hinterlegt", wuensche: [{ id: "metalle", label: "Gold und Silber kaufbar", still: true, pruefe: mindestensEins("halalEdelmetalle") }], grund: grundAnzahl("halalEdelmetalle", (n, von) => `${n} von ${von} Gold- und Silberpapieren kaufbar`) },
      { id: "sukuk", bild: "sukuk", titel: "Sukuk", unter: "Islamische Anleihen ohne Zins", wuensche: [{ id: "sukuk", label: "Sukuk kaufbar", still: true, pruefe: mindestensEins("halalSukuk") }], grund: grundAnzahl("halalSukuk", (n, von) => `${n} von ${von} Sukuk kaufbar`) },
      { id: "krypto", bild: "krypto", titel: "Krypto" },
    ],
  },
  {
    id: "region",
    fuer: "depot",
    titel: "Hast du eine Region im Blick?",
    hinweis: "Manche Fonds gibt es nur bei wenigen Anbietern. Deshalb fragen wir.",
    zeigeWenn: (a) => will.depot(a) && ((a.bestimmtes ?? []).length === 0 || hat(a, "bestimmtes", "etfs")),
    antworten: [
      { id: "egal", bild: "nein", titel: "Nein, egal" },
      { id: "welt", bild: "globus", titel: "Die ganze Welt", wuensche: [regionWunsch("Welt", "Welt-Fonds kaufbar")], grund: grundRegion("Welt", "die ganze Welt") },
      { id: "usa", bild: "usa", titel: "USA", wuensche: [regionWunsch("USA", "USA-Fonds kaufbar")], grund: grundRegion("USA", "die USA") },
      { id: "europa", bild: "europa", titel: "Europa", wuensche: [regionWunsch("Europa", "Europa-Fonds kaufbar")], grund: grundRegion("Europa", "Europa") },
      { id: "schwellen", bild: "schwellen", titel: "Schwellenländer", unter: "Zum Beispiel Indien, Malaysia, Saudi-Arabien", wuensche: [regionWunsch("Schwellenländer", "Schwellenländer-Fonds kaufbar")], grund: grundRegion("Schwellenländer", "Schwellenländer") },
    ],
  },
  {
    id: "wallet",
    fuer: "krypto",
    titel: "Willst du deine Coins selbst verwahren?",
    hinweis: "Auf einer eigenen Wallet gehören die Coins nur dir. Beim Anbieter ist es bequemer.",
    zeigeWenn: will.krypto,
    antworten: [
      {
        id: "ja", bild: "schluessel",
        titel: "Ja, auf meiner eigenen Wallet",
        wuensche: [
          { id: "echt", label: "Echte Coins statt Zertifikat", still: true, pruefe: ampelGut("echteCoins") },
          { id: "wallet", label: "Auszahlung auf eigene Wallet", pruefe: ampelGut("eigeneWallet") },
        ],
        grund: grundWert("auszahlungBitcoin", (w) => `Bitcoin auszahlen kostet ${w}`),
      },
      { id: "nein", bild: "tresor", titel: "Nein, sie bleiben beim Anbieter" },
      { id: "offen", bild: "frage", titel: "Weiß ich noch nicht" },
    ],
  },
  {
    id: "wichtig",
    fuer: "depot",
    titel: "Was ist dir am wichtigsten?",
    zeigeWenn: will.anlegen,
    antworten: [
      { id: "kosten", bild: "sparschwein", titel: "Niedrige Kosten", prioritaet: DEPOT_KOSTEN, auch: { girokonto: { prioritaet: GIRO_KOSTEN }, krypto: { prioritaet: KRYPTO_KOSTEN } } },
      { id: "auswahl", bild: "datenbank", titel: "Viel Auswahl an Halal-Anlagen", prioritaet: DEPOT_AUSWAHL },
      { id: "app", bild: "handy", titel: "Eine gute App", prioritaet: DEPOT_APP, auch: { girokonto: { prioritaet: GIRO_APP }, krypto: { prioritaet: KRYPTO_EINFACH } } },
    ],
  },

  /* --- Konto --- */
  {
    id: "kontoPreis",
    fuer: "girokonto",
    titel: "Darf das Konto etwas kosten?",
    zeigeWenn: will.konto,
    antworten: [
      { id: "kostenlos", bild: "sparschwein", titel: "Nein, keinen Cent", wuensche: [{ id: "kostenlos", label: "Kontoführung 0 €", pruefe: kostetNichts("kontofuehrung") }] },
      { id: "egal", bild: "karte", titel: "Ja, wenn die Leistung stimmt", grund: grundWert("kontofuehrung", (w) => `Kontoführung ${w} im Monat`) },
    ],
  },
  {
    id: "alltag",
    fuer: "girokonto",
    titel: "Was brauchst du im Alltag?",
    hinweis: "Mehrere möglich.",
    mehrfach: true,
    ohneWahl: "Nichts davon, weiter",
    zeigeWenn: will.konto,
    antworten: [
      { id: "bargeld", bild: "scheine", titel: "Oft Bargeld", gewichte: { abheben: 3, einzahlen: 3 }, grund: grundWert("abhebungen", (w) => `Kostenlose Abhebungen im Monat: ${w}`) },
      {
        id: "girocard", bild: "karte",
        titel: "Eine Girocard",
        unter: "Früher EC-Karte",
        wuensche: [
          {
            id: "girocard",
            label: "Girocard erhältlich",
            pruefe: (a) => {
              const w = a.werte.girocard;
              return typeof w === "string" ? !/keine/i.test(w) : null;
            },
          },
        ],
      },
      { id: "handy", bild: "handy", titel: "Mit dem Handy bezahlen", wuensche: [{ id: "handy", label: "Apple Pay oder Google Pay", pruefe: jaNein("applePay") }] },
      { id: "filiale", bild: "haus", titel: "Eine Filiale", wuensche: [{ id: "filiale", label: "Filialen vorhanden", pruefe: jaNein("filialen") }] },
    ],
  },

  {
    id: "kontoWichtig",
    fuer: "girokonto",
    titel: "Was ist dir beim Konto am wichtigsten?",
    /* Wer auch anlegt, hat die Frage schon einmal beantwortet. */
    zeigeWenn: (a) => will.konto(a) && !will.anlegen(a),
    antworten: [
      { id: "kosten", bild: "sparschwein", titel: "Niedrige Kosten", prioritaet: GIRO_KOSTEN },
      { id: "app", bild: "handy", titel: "Eine gute App", prioritaet: GIRO_APP },
      { id: "service", bild: "service", titel: "Guter Service", prioritaet: { id: "service", label: "guten Service", gewichte: { support: 4, kontowechsel: 2 }, fakten: ["kundenservice", "filialen", "kontowechsel"] } },
    ],
  },

  /* --- Steuererklärung --- */
  {
    id: "steuerLage",
    fuer: "steuer",
    titel: "Was trifft auf dich zu?",
    hinweis: "Mehrere möglich. Das Finanzamt fragt ja auch alles.",
    mehrfach: true,
    ohneWahl: "Nichts davon, weiter",
    zeigeWenn: will.steuer,
    antworten: [
      {
        id: "kapital", bild: "etf",
        titel: "Ich habe ein Depot",
        unter: "Dividenden und Kursgewinne gehören dann in die Erklärung",
        wuensche: [
          {
            id: "kapital",
            label: "Kapitalerträge möglich",
            pruefe: (a) => {
              const w = a.werte.kapital;
              return typeof w === "string" ? /^ja/i.test(w) : null;
            },
          },
        ],
      },
      {
        id: "selbst", bild: "tasche",
        titel: "Ich bin selbstständig",
        wuensche: [
          {
            id: "selbst",
            label: "Für Selbstständige geeignet",
            pruefe: (a) => {
              const w = a.werte.selbststaendige;
              return typeof w === "string" ? !/^nein/i.test(w) : null;
            },
          },
        ],
        grund: (a) => {
          const w = a.werte.selbststaendige;
          return typeof w === "string" && !/^(ja|nein)$/i.test(w.trim()) ? `Selbstständige: ${w}` : null;
        },
      },
      {
        id: "gratis", bild: "sparschwein",
        titel: "Es soll nichts kosten",
        wuensche: [
          {
            id: "gratis",
            label: "Kostenlos",
            pruefe: (a) => {
              const e = euro(a.werte.preis);
              return e === null ? null : e === 0;
            },
          },
        ],
      },
    ],
  },
];

/* ------------------------------------------------------------- Bausteine */

export const bausteine: Baustein[] = [
  {
    id: "depot",
    titel: "Dein Depot",
    wozu: "Hier liegen deine ETFs, Aktien, Sukuk und dein Gold.",
    kategorie: "depot",
    vergleich: "/vergleich/depot",
    vergleichText: "Alle Depots vergleichen",
    anbieter: brokerVergleich,
    finanzMax: DEPOT_FINANZ_MAX,
    zeilen: DEPOT_ZEILEN,
    fakten: ["depotgebuehr", "orderkosten"],
    immer: [wennGut("keinKreditAbStart", "Kein Kredit voreingestellt"), wennJa("kapest", "Führt die Steuer für dich ab")],
    aktiv: will.depot,
  },
  {
    id: "screener",
    titel: "Deine App zum Prüfen",
    wozu: "Einzelne Aktien musst du selbst prüfen. Diese Apps sagen dir, ob eine Firma halal ist.",
    kategorie: null,
    vergleich: "/vergleich/screening-apps",
    vergleichText: "Alle Apps vergleichen",
    anbieter: screenerVergleich,
    finanzMax: {},
    zeilen: SCREENER_ZEILEN,
    fakten: ["preis", "deutscheAktien", "sprache"],
    immer: [
      wennGut("gremium", "Gelehrte stehen mit Namen dahinter"),
      wennGut("begruendung", "Zeigt, woran eine Aktie scheitert"),
      wennGut("reinigung", "Rechnet den Reinigungsbetrag aus"),
      (a) => (kostenlosReicht(a) ? "Kostenlose Fassung reicht zum Prüfen" : null),
    ],
    /* Drei Halal-Merkmale plus die Frage, ob die kostenlose Fassung zum Prüfen reicht. Alles aus belegten Feldern. */
    grundSort: (a) => {
      const keys = SCREENER_ZEILEN.filter((z) => z.gruppe === "halal" && z.art === "ampel").map((z) => z.key);
      const gut = keys.filter((k) => a.werte[k] === "gut").length + (kostenlosReicht(a) ? 1 : 0);
      return gut / (keys.length + 1);
    },
    aktiv: will.aktien,
  },
  {
    id: "krypto",
    titel: "Deine Krypto-Börse",
    wozu: "Coins kaufst du nicht im Depot, sondern bei einer Börse.",
    kategorie: "krypto",
    vergleich: "/vergleich/krypto",
    vergleichText: "Alle Börsen vergleichen",
    anbieter: kryptoVergleich,
    finanzMax: KRYPTO_FINANZ_MAX,
    zeilen: KRYPTO_ZEILEN,
    fakten: ["gesamtkosten", "anzahlCoins"],
    immer: [wennGut("echteCoins", "Echte Coins statt Zertifikat"), wennGut("zinsfreiesModell", "Bezahlmodell ohne Zinsbindung")],
    aktiv: will.krypto,
  },
  {
    id: "girokonto",
    titel: "Dein Konto",
    wozu: "Ohne Zinsen, für Gehalt und Alltag.",
    kategorie: "girokonto",
    vergleich: "/vergleich/girokonto",
    vergleichText: "Alle Konten vergleichen",
    anbieter: girokontoVergleich,
    finanzMax: GIRO_FINANZ_MAX,
    zeilen: GIRO_ZEILEN,
    fakten: ["kontofuehrung", "debitkarte"],
    immer: [wennGut("keinDispoAbStart", "Kein Dispo voreingestellt"), wennGut("karteOhneKredit", "Karte ohne Kreditrahmen")],
    aktiv: will.konto,
  },
  {
    id: "steuer",
    titel: "Dein Steuerprogramm",
    wozu: "Sortiert nach Preis. Die kostenlosen stehen oben.",
    kategorie: null,
    vergleich: "/vergleich/steuersoftware",
    vergleichText: "Alle Programme vergleichen",
    anbieter: steuersoftwareVergleich,
    finanzMax: {},
    zeilen: STEUER_ZEILEN,
    fakten: ["preis", "plattform"],
    aktiv: will.steuer,
  },
];

/* --------------------------------------------------------------- Ablauf */

/** Die Fragen, die zu den bisherigen Antworten gehören, in fester Reihenfolge. */
export const aktiveFragen = (antworten: Antworten) => fragen.filter((f) => f.zeigeWenn?.(antworten) ?? true);

/**
 * Übersetzt die Antworten in das, was der Rechenkern für einen Baustein braucht.
 * Antworten auf Fragen, die nicht mehr zum Ablauf gehören, zählen nicht: Wer
 * zurückgeht und "Geld anlegen" abwählt, nimmt seine Depot-Wünsche nicht mit.
 */
export const auswahlAus = (baustein: BausteinId, antworten: Antworten): Auswahl => {
  const wirkungen: Wirkung[] = [];
  for (const f of aktiveFragen(antworten)) {
    for (const a of f.antworten) {
      if (!antworten[f.id]?.includes(a.id)) continue;
      if (f.fuer === baustein) wirkungen.push(a);
      const auch = a.auch?.[baustein];
      if (auch) wirkungen.push(auch);
    }
  }
  const b = bausteine.find((x) => x.id === baustein);
  const grundSort = b?.grundSort;
  return {
    wuensche: wirkungen.flatMap((w) => w.wuensche ?? []),
    gewichte: wirkungen.flatMap((w) => (w.gewichte ? [w.gewichte] : [])),
    prioritaet: wirkungen.find((w) => w.prioritaet)?.prioritaet,
    gruende: [...wirkungen.flatMap((w) => (w.grund ? [w.grund] : [])), ...(b?.immer ?? [])],
    nebenSort: [...wirkungen.flatMap((w) => (w.nebenSort ? [w.nebenSort] : [])), ...(grundSort ? [grundSort] : [])],
  };
};
