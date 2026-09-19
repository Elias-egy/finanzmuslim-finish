import { Banknote, Bitcoin, Coins, LineChart, ScanSearch } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { VergleichsZeile } from "@/components/vergleich/vergleichTypen";
import type { Kategorie } from "@/lib/bewertung";
import {
  ampelGut,
  anzahlVon,
  jaNein,
  kostetNichts,
  mindestensEins,
  type Prioritaet,
  type Wunsch,
} from "@/lib/vergleichAssistent";
import type { RohAnbieter } from "./vergleichHelfer";
import { brokerVergleich, DEPOT_FINANZ_MAX, DEPOT_ZEILEN } from "./brokerVergleich";
import { girokontoVergleich, GIRO_FINANZ_MAX, GIRO_ZEILEN } from "./girokontoVergleich";
import { kryptoVergleich, KRYPTO_FINANZ_MAX, KRYPTO_ZEILEN } from "./kryptoVergleich";

/**
 * Fragen des geführten Vergleichs. Jede Antwort zeigt auf Felder, die es in den
 * Datendateien wirklich gibt. Eine Frage ohne Datenfeld gehört nicht hierher.
 *
 * Eine Antwort kann dreierlei bewirken:
 *   wuensche    harte Filter. Nicht erfüllt fliegt raus, ungeprüft steht getrennt.
 *   gewichte    verschiebt, wie stark ein Finanzkriterium zählt.
 *   prioritaet  bestimmt die Sortierung und die Fakten unter dem Anbieter.
 */

export type Antwort = {
  id: string;
  titel: string;
  unter?: string;
  wuensche?: Wunsch[];
  gewichte?: Record<string, number>;
  prioritaet?: Prioritaet;
};

export type Frage = {
  id: string;
  titel: string;
  hinweis?: string;
  mehrfach?: boolean;
  /** Gehört zur Vertiefung nach den Kernfragen. */
  vertiefung?: boolean;
  antworten: Antwort[];
};

export type Ziel =
  | {
      id: Kategorie;
      art: "fragen";
      titel: string;
      unter: string;
      icon: LucideIcon;
      vergleich: string;
      anbieter: RohAnbieter[];
      finanzMax: Record<string, number>;
      zeilen: VergleichsZeile[];
      fragen: Frage[];
    }
  | { id: string; art: "weiter"; titel: string; unter: string; icon: LucideIcon; vergleich: string };

const halalAnlagenZahl = (a: RohAnbieter) => {
  const z = ["halalEtfsFonds", "halalSukuk", "halalEdelmetalle"].map((k) => anzahlVon(a.werte[k]));
  return z.every((x) => x === null) ? null : z.reduce<number>((s, x) => s + (x ?? 0), 0);
};

const depotFragen: Frage[] = [
  {
    id: "weg",
    titel: "Wie willst du investieren?",
    antworten: [
      {
        id: "sparplan",
        titel: "Jeden Monat per Sparplan",
        unter: "Ein fester Betrag, automatisch",
        gewichte: { etfSparplanProzent: 2, etfSparplanPauschal: 2, mindestsparrate: 2, intervalle: 2, orderProzent: 0.5, orderPauschal: 0.5 },
      },
      {
        id: "einzel",
        titel: "Einzelne Käufe",
        unter: "Wann und wie viel du willst",
        gewichte: { orderProzent: 2, orderPauschal: 2, handelsplaetze: 2, etfSparplanProzent: 0.5, etfSparplanPauschal: 0.5 },
      },
      { id: "beides", titel: "Beides" },
    ],
  },
  {
    id: "anlagen",
    titel: "Was willst du dort kaufen?",
    hinweis: "Mehrere möglich. Gezählt werden die Anlagen aus unserem Halal-Anlagen-Vergleich.",
    mehrfach: true,
    antworten: [
      { id: "etfs", titel: "Halal-ETFs und Fonds", wuensche: [{ id: "etfs", label: "Halal-ETFs kaufbar", pruefe: mindestensEins("halalEtfsFonds") }] },
      { id: "sukuk", titel: "Sukuk", unter: "Islamische Anleihen ohne Zins", wuensche: [{ id: "sukuk", label: "Sukuk kaufbar", pruefe: mindestensEins("halalSukuk") }] },
      { id: "metalle", titel: "Gold und Silber", unter: "Physisch hinterlegt", wuensche: [{ id: "metalle", label: "Gold und Silber kaufbar", pruefe: mindestensEins("halalEdelmetalle") }] },
    ],
  },
  {
    id: "prio",
    titel: "Was ist dir am wichtigsten?",
    antworten: [
      {
        id: "kosten",
        titel: "Niedrige Kosten",
        prioritaet: {
          id: "kosten",
          label: "niedrige Kosten",
          gewichte: { depotgebuehr: 2, etfSparplanProzent: 2, etfSparplanPauschal: 2, orderProzent: 2, orderPauschal: 2 },
          fakten: ["depotgebuehr", "orderkosten", "etfSparplanKosten"],
        },
      },
      {
        id: "auswahl",
        titel: "Große Halal-Auswahl",
        prioritaet: {
          id: "auswahl",
          label: "große Halal-Auswahl",
          gewichte: {},
          halalAnteil: 0.65,
          fakten: ["halalEtfsFonds", "halalSukuk", "halalEdelmetalle"],
          sortWert: halalAnlagenZahl,
        },
      },
      {
        id: "app",
        titel: "Gute App und Service",
        prioritaet: {
          id: "app",
          label: "App und Service",
          gewichte: { app: 3, kundenservice: 3 },
          fakten: ["appIos", "appAndroid", "kundenservice"],
        },
      },
    ],
  },
  {
    id: "muss",
    titel: "Was muss sicher erfüllt sein?",
    hinweis: "Mehrere möglich. Anbieter, bei denen das noch nicht geprüft ist, stehen getrennt.",
    mehrfach: true,
    vertiefung: true,
    antworten: [
      {
        id: "kredit",
        titel: "Kein Kredit ab Start",
        unter: "Dir wird kein Wertpapierkredit eingeräumt",
        wuensche: [{ id: "kredit", label: "Kein Kredit ab Start", pruefe: ampelGut("keinKreditAbStart") }],
      },
      {
        id: "steuer",
        titel: "Steuer wird automatisch abgeführt",
        unter: "Du musst nichts selbst nachmelden",
        wuensche: [{ id: "steuer", label: "Steuer wird abgeführt", pruefe: jaNein("kapest") }],
      },
    ],
  },
];

const giroFragen: Frage[] = [
  {
    id: "preis",
    titel: "Darf das Konto etwas kosten?",
    antworten: [
      {
        id: "kostenlos",
        titel: "Nein, es muss kostenlos sein",
        wuensche: [{ id: "kostenlos", label: "Kontoführung 0 €", pruefe: kostetNichts("kontofuehrung") }],
      },
      { id: "egal", titel: "Ja, wenn die Leistung stimmt" },
    ],
  },
  {
    id: "alltag",
    titel: "Was brauchst du im Alltag?",
    hinweis: "Mehrere möglich.",
    mehrfach: true,
    antworten: [
      { id: "bargeld", titel: "Oft Bargeld", unter: "Abheben und einzahlen", gewichte: { abheben: 3, einzahlen: 3 } },
      {
        id: "girocard",
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
      { id: "handy", titel: "Mit dem Handy bezahlen", unter: "Apple Pay oder Google Pay", wuensche: [{ id: "handy", label: "Apple Pay oder Google Pay", pruefe: jaNein("applePay") }] },
      { id: "filiale", titel: "Eine Filiale", unter: "Beratung vor Ort", wuensche: [{ id: "filiale", label: "Filialen vorhanden", pruefe: jaNein("filialen") }] },
    ],
  },
  {
    id: "prio",
    titel: "Was ist dir am wichtigsten?",
    antworten: [
      {
        id: "kosten",
        titel: "Niedrige Kosten",
        prioritaet: { id: "kosten", label: "niedrige Kosten", gewichte: { kontofuehrung: 2, bankkarte: 2, girocard: 2, debitkarte: 2 }, fakten: ["kontofuehrung", "debitkarte", "girocard"] },
      },
      {
        id: "app",
        titel: "Gute App",
        prioritaet: { id: "app", label: "gute App", gewichte: { app: 4, mobilesBezahlen: 2, ident: 2 }, fakten: ["appIos", "appAndroid", "applePay"] },
      },
      {
        id: "service",
        titel: "Guter Service",
        prioritaet: { id: "service", label: "guten Service", gewichte: { support: 4, kontowechsel: 2 }, fakten: ["kundenservice", "filialen", "kontowechsel"] },
      },
    ],
  },
  {
    id: "muss",
    titel: "Was muss sicher erfüllt sein?",
    hinweis: "Mehrere möglich. Anbieter, bei denen das noch nicht geprüft ist, stehen getrennt.",
    mehrfach: true,
    vertiefung: true,
    antworten: [
      { id: "dispo", titel: "Kein Dispo ab Start", unter: "Du kannst nicht aus Versehen ins Minus", wuensche: [{ id: "dispo", label: "Kein Dispo ab Start", pruefe: ampelGut("keinDispoAbStart") }] },
      { id: "karte", titel: "Karte ohne Kredit", unter: "Abbuchung sofort, kein Kreditrahmen", wuensche: [{ id: "karte", label: "Karte ohne Kredit", pruefe: ampelGut("karteOhneKredit") }] },
    ],
  },
];

const kryptoFragen: Frage[] = [
  {
    id: "wallet",
    titel: "Willst du deine Coins selbst verwahren?",
    hinweis: "Auf einer eigenen Wallet gehören die Coins nur dir.",
    antworten: [
      {
        id: "ja",
        titel: "Ja, auf meiner eigenen Wallet",
        wuensche: [
          { id: "echt", label: "Echte Coins statt Zertifikat", pruefe: ampelGut("echteCoins") },
          { id: "wallet", label: "Auszahlung auf eigene Wallet", pruefe: ampelGut("eigeneWallet") },
        ],
      },
      { id: "nein", titel: "Nein, sie bleiben beim Anbieter" },
      { id: "offen", titel: "Weiß ich noch nicht" },
    ],
  },
  {
    id: "weg",
    titel: "Wie willst du kaufen?",
    antworten: [
      { id: "sparplan", titel: "Jeden Monat per Sparplan", wuensche: [{ id: "sparplan", label: "Sparplan möglich", pruefe: jaNein("sparplan") }], gewichte: { sparplan: 3, mindestbetrag: 2 } },
      { id: "einzel", titel: "Einzelne Käufe" },
    ],
  },
  {
    id: "prio",
    titel: "Was ist dir am wichtigsten?",
    antworten: [
      { id: "kosten", titel: "Niedrige Kosten", prioritaet: { id: "kosten", label: "niedrige Kosten", gewichte: { gebuehren: 2, transferkosten: 2 }, fakten: ["gesamtkosten", "auszahlungBitcoin", "transparenteKosten"] } },
      { id: "einfach", titel: "Einfacher Einstieg", prioritaet: { id: "einfach", label: "einfachen Einstieg", gewichte: { verifizierung: 2, bezahlmethoden: 2, mindestbetrag: 2 }, fakten: ["ident", "einzahlung", "mindestbetrag"] } },
      { id: "sicherheit", titel: "Sicherheit", prioritaet: { id: "sicherheit", label: "Sicherheit", gewichte: { sicherheit: 3, mica: 3 }, fakten: ["regulierung", "sicherheit"] } },
    ],
  },
  {
    id: "muss",
    titel: "Was muss sicher erfüllt sein?",
    hinweis: "Anbieter, bei denen das noch nicht geprüft ist, stehen getrennt.",
    mehrfach: true,
    vertiefung: true,
    antworten: [
      {
        id: "modell",
        titel: "Bezahlmodell ohne Zinsbindung",
        unter: "Kein Abo, das an Zinsangebote gekoppelt ist",
        wuensche: [{ id: "modell", label: "Bezahlmodell ohne Zinsbindung", pruefe: ampelGut("zinsfreiesModell") }],
      },
    ],
  },
];

export const ziele: Ziel[] = [
  { id: "depot", art: "fragen", titel: "Depot zum Investieren", unter: "Für ETFs, Aktien und Sukuk", icon: LineChart, vergleich: "/vergleich/depot", anbieter: brokerVergleich, finanzMax: DEPOT_FINANZ_MAX, zeilen: DEPOT_ZEILEN, fragen: depotFragen },
  { id: "girokonto", art: "fragen", titel: "Girokonto", unter: "Ohne Zinsen und ohne Dispo", icon: Banknote, vergleich: "/vergleich/girokonto", anbieter: girokontoVergleich, finanzMax: GIRO_FINANZ_MAX, zeilen: GIRO_ZEILEN, fragen: giroFragen },
  { id: "krypto", art: "fragen", titel: "Krypto-Börse", unter: "Für Bitcoin und andere Coins", icon: Bitcoin, vergleich: "/vergleich/krypto", anbieter: kryptoVergleich, finanzMax: KRYPTO_FINANZ_MAX, zeilen: KRYPTO_ZEILEN, fragen: kryptoFragen },
  { id: "aktien", art: "weiter", titel: "Aktien prüfen", unter: "Apps, die Aktien auf Halal prüfen", icon: ScanSearch, vergleich: "/vergleich/screening-apps" },
  { id: "gold", art: "weiter", titel: "Gold und Silber", unter: "Fünf Wege zu Edelmetallen", icon: Coins, vergleich: "/vergleich/edelmetalle" },
];

/** Antwort-IDs je Frage, so wie sie im Zustand und im sessionStorage liegen. */
export type Antworten = Record<string, string[]>;

/** Übersetzt die Antworten in das, was der Rechenkern braucht. */
export const auswahlAus = (fragen: Frage[], antworten: Antworten) => {
  const gewaehlt = fragen.flatMap((f) => f.antworten.filter((a) => antworten[f.id]?.includes(a.id)));
  return {
    wuensche: gewaehlt.flatMap((a) => a.wuensche ?? []),
    gewichte: gewaehlt.flatMap((a) => (a.gewichte ? [a.gewichte] : [])),
    prioritaet: gewaehlt.find((a) => a.prioritaet)?.prioritaet,
  };
};
