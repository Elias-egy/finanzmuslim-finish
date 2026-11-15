/**
 * Daten der Seite /vorlagen/broker-vergleich (Broker-Freebie zum Kommentar-Wort BROKER, Elias 13.11.2026, BT1; Vault
 * `raw/2026-11-13-elias-bt1-02-cuts-enger-trade-republic-c-tier-broker-freebie.md`): „ähnlich wie bei den Girokonten-Ding.
 * Jetzt will ich die Top 3 aus Smart Broker, Flatex und … Traders Place. Scalable dann auf Platz 4 oder sag Honorable
 * Mention Scalable.“ Muster ist `girokontoBonus.ts` und die Seite GirokontoBonus.
 *
 * Kein Wert steht hier von Hand. Jede Zahl kommt aus dem Depot-Vergleich (`anzeige/depot.ts`, Belege in
 * `brokerVergleich.ts`); der Test hält die Reihenfolge der Rangfolge und die Belege fest. Eine Ausnahme mit eigenem
 * Beleg unten: flatex-Sparplan ab 1 € (der Depot-Vergleich führt noch 25 €).
 *
 * Bewusst nicht genannt: der Traders-Place-Bonus von 60 € (gilt nur mit Zinsen, Elias 07.11.2026: „Traders Place Boni
 * angeben, macht bei uns ja keinen Sinn, weil der nur mit Zinsen ist“), jede andere Prämie, jede Zahl ohne Beleg.
 */
import { depotAnzeige } from "@/data/anzeige/depot";
import { kostenKurz } from "@/data/kostenKurz";

export type BrokerRolle = "start" | "profi" | "platz3" | "honorable";

export type BrokerKarte = {
  /** `id` im Depot-Vergleich. */
  id: string;
  /** Partnerlink-Kurzname, geöffnet über `/out/<kurzname>` (`partnerLinks.ts`). */
  out: string;
  name: string;
  domain: string;
  rolle: BrokerRolle;
  /** Kennung der Stelle (`src/lib/attribution.ts`). */
  src: string;
  etfs: string;
  sukuk: string;
  gold: string;
  depotgebuehr: string;
  order: string;
  sparplanAb: string;
  /** Guthabenzins 0 % laut Anbieter-Beleg im Depot-Vergleich (zinsfreiAbStart „gut“). */
  zinsfrei: boolean;
  /** flatex richtet den Wertpapierkredit bei Eröffnung automatisch ein; Verzicht in Textform. */
  kreditAutomatisch: boolean;
};

/** Kennungen der Stellen, höchstens zwölf Zeichen, klein (Scalable nimmt als SubID nichts anderes). */
export const BROKER_SRC = {
  smartbroker: "bvsb",
  flatex: "bvfx",
  tradersPlace: "bvtp",
  scalable: "bvsc",
  vergleich: "bvalle",
} as const;

/** Die Reihenfolge der Seite: zwei Nummer 1 (Start, Profis), Platz 3, dann Scalable als Honorable Mention. */
const AUFBAU: { id: string; out: string; rolle: BrokerRolle; src: string }[] = [
  { id: "smartbroker-plus-depot", out: "smartbroker", rolle: "start", src: BROKER_SRC.smartbroker },
  { id: "flatex-depot", out: "flatex", rolle: "profi", src: BROKER_SRC.flatex },
  { id: "traders-place-depot", out: "traders-place", rolle: "platz3", src: BROKER_SRC.tradersPlace },
  { id: "scalable-capital-free-broker", out: "scalable", rolle: "honorable", src: BROKER_SRC.scalable },
];

/**
 * Sparplan ab 1 € bei flatex: flatex.de/produkte-handel/produkte/sparplaene, gelesen 07.11.2026: „Ab sofort können Sie
 * Sparpläne bereits ab 1 € Sparrate anlegen – statt bisher 25 €.“ Der Depot-Vergleich führt noch „25€ bis unbegrenzt“
 * (Stand 07.10.2026), gleiche Angabe wie im Aktien-Freebie (`AktienAufruf.tsx`).
 */
export const FLATEX_SPARPLAN = {
  url: "https://www.flatex.de/produkte-handel/produkte/sparplaene/",
  stand: "07.11.2026",
  wortlaut: "„Ab sofort können Sie Sparpläne bereits ab 1 € Sparrate anlegen – statt bisher 25 €.“",
  wert: "1 €",
} as const;

const eur = (s: string) => s.replace(/(\d)\s?€/g, "$1 €");

const werteVon = (id: string) => {
  const a = depotAnzeige.find((x) => x.id === id);
  if (!a) throw new Error(`Depot fehlt im Vergleich: ${id}`);
  return { a, w: a.werte as Record<string, unknown> };
};

const sparplanAb = (id: string, sparrate: string) =>
  id === "flatex-depot" ? eur(FLATEX_SPARPLAN.wert) : eur(sparrate.match(/^([\d.,]+\s?€)/)?.[1] ?? "");

export const BROKER_KARTEN: BrokerKarte[] = AUFBAU.map(({ id, out, rolle, src }) => {
  const { a, w } = werteVon(id);
  const text = (k: string) => String(w[k] ?? "");
  return {
    id,
    out,
    name: a.name,
    domain: a.domain ?? "",
    rolle,
    src,
    etfs: text("halalEtfsFonds"),
    sukuk: text("halalSukuk"),
    gold: text("halalEdelmetalle"),
    depotgebuehr: eur(text("depotgebuehr")),
    order: eur(kostenKurz(id, "orderkosten") ?? text("orderkosten")),
    sparplanAb: sparplanAb(id, text("sparrate")),
    zinsfrei: w.zinsfreiAbStart === "gut",
    kreditAutomatisch: w.kreditAbStart === "teils",
  };
});

export const BROKER_TOP3 = BROKER_KARTEN.slice(0, 3);
export const BROKER_HONORABLE = BROKER_KARTEN[3];

/** Link wie im Aktien-Freebie: Partnerweg des Vergleichs plus Kennung der Stelle. */
export const brokerLink = (out: string, src: string) => `/out/${out}?src=${src}`;
