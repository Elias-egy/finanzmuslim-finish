/**
 * Depotsuche im Depot-Check, Frage „Wo hast du dein Depot?“ (RN10, 16.11.2026).
 *
 * Auftrag Elias (Vault raw/2026-11-16-elias-rn9-03-depot-wo-hast-du-dein-depot-ergebnis-wie-original-informieren-sich.md):
 * „Ich habe bereits ein Depot. Dann sollte das nächste sein, wo hast du dein Depot, und dann auch so eine Auswahl, wie wir da
 * haben.“ Muster ist die Banksuche (bankSuche.ts): Schnellwahl mit Logo, Tippen filtert, „nicht gefunden“ gibt es nie.
 *
 * Die Liste kommt aus dem Depot-Vergleich (brokerVergleich.ts, ein Eintrag je Haus, das erste Produkt des Hauses), dieselbe
 * Quelle wie die Brokerliste im OS (entwurf/app/broker-liste.js). Dazu drei Gruppen ohne Werte (Sparkasse, Volksbank,
 * Deutsche Bank), bei denen viele ihr Depot haben, deren Depot aber nicht im Vergleich steht: dort steht nie eine Zahl.
 * flatex und Smartbroker+ nehmen die Werte aus brokerFreebie.ts (flatex-Sparplan ab 1 € mit eigenem Beleg).
 */
import { brokerVergleich } from "@/data/brokerVergleich";
import { BROKER_KARTEN } from "@/data/brokerFreebie";
import { kostenKurz } from "@/data/kostenKurz";
import { abstand, suchNorm } from "@/data/bankSuche";

/** Gruppe für die Messung: nie der freie Text. */
export type DepotGruppe = "neobroker" | "direktbank" | "filialbank" | "andere";

/** Werte eines Depots aus dem Vergleich. `null`: steht nicht im Vergleich, dann nie eine Zahl. */
export type DepotWerte = {
  etfs: string | null;
  gold: string | null;
  sukuk: string | null;
  depotgebuehr: string | null;
  order: string | null;
  sparplanAb: string | null;
  /** Kosten je ETF-Sparplan-Rate aus dem Vergleich (etfSparplanKosten), etwa „0 €“, „1,50 €“ oder „1,5%“; null: nicht im Vergleich. */
  sparplanKosten: string | null;
  /** zinsfreiAbStart aus dem Vergleich: gut (ohne Zinsen ab Eröffnung), schlecht (Zinsen nicht abschaltbar), null (nicht im Vergleich). */
  zinsfrei: "gut" | "teils" | "schlecht" | null;
};

export type DepotEintrag = {
  id: string;
  /** Produkt-id im Depot-Vergleich, fehlt bei Gruppen. */
  vergleichId?: string;
  name: string;
  /** „Von Trade Republic zu flatex“: Dativ mit Artikel, wo einer üblich ist. */
  dativ: string;
  gruppe: DepotGruppe;
  domain?: string;
  aliase: string[];
  rang: number;
  werte: DepotWerte | null;
};

export type DepotWahl = {
  id: string;
  name: string;
  dativ: string;
  gruppe: DepotGruppe;
  kind: "depot" | "frei";
  domain?: string;
};

const eur = (s: string) => s.replace(/(\d)\s?€/g, "$1 €");

/** Haus-Angaben, die der Vergleich nicht hat: Gruppe, Artikel, Suchwörter, Platz. */
const HAUS: Record<string, { gruppe: DepotGruppe; artikel?: string; aliase?: string[]; rang?: number }> = {
  "trade-republic-depot": { gruppe: "neobroker", aliase: ["tr", "trade rep", "traderepublic"], rang: 1 },
  "scalable-capital-free-broker": { gruppe: "neobroker", aliase: ["scalable", "scalable capital"], rang: 2 },
  "ing-direkt-depot": { gruppe: "direktbank", artikel: "der", aliase: ["ing diba", "diba"], rang: 3 },
  "comdirect-depot": { gruppe: "direktbank", artikel: "der", rang: 4 },
  "consorsbank-depot": { gruppe: "direktbank", artikel: "der", aliase: ["consors"], rang: 6 },
  "dkb-depot": { gruppe: "direktbank", artikel: "der", rang: 7 },
  "trading-212-depot": { gruppe: "neobroker", aliase: ["trading212", "t212"], rang: 9 },
  "finanzen-net-zero-depot": { gruppe: "neobroker", aliase: ["finanzen net", "finanzen zero", "zero"], rang: 10 },
  "n26-standard-depot": { gruppe: "neobroker", rang: 11 },
  "commerzbank-direktdepot": { gruppe: "filialbank", artikel: "der", rang: 12 },
  "smartbroker-plus-depot": { gruppe: "neobroker", aliase: ["smartbroker", "smart broker", "smartbroker plus"], rang: 13 },
  "flatex-depot": { gruppe: "direktbank", aliase: ["flatex degiro"], rang: 14 },
  "traders-place-depot": { gruppe: "neobroker", aliase: ["tradersplace", "traders"], rang: 15 },
  "bitpanda-depot": { gruppe: "neobroker", rang: 16 },
  "s-broker-direkt-depot": { gruppe: "direktbank", artikel: "dem", aliase: ["sbroker"], rang: 20 },
  "maxblue-depot": { gruppe: "filialbank", aliase: ["max blue"], rang: 20 },
  "hypovereinsbank-hvb-depot": { gruppe: "filialbank", artikel: "der", aliase: ["hvb", "unicredit"], rang: 20 },
  "targobank-direkt-depot": { gruppe: "filialbank", artikel: "der", rang: 20 },
  "santander-wertpapierdepot": { gruppe: "filialbank", artikel: "der", rang: 20 },
  "bbbank-depot": { gruppe: "filialbank", artikel: "der", rang: 20 },
  "1822direkt-aktiv-depot": { gruppe: "direktbank", artikel: "der", rang: 20 },
  "degiro-depot": { gruppe: "neobroker", rang: 20 },
  "xtb-depot": { gruppe: "neobroker", rang: 20 },
  "revolut-standard": { gruppe: "neobroker", rang: 20 },
  "bux-basic": { gruppe: "neobroker", rang: 20 },
};

const GRUPPEN: DepotEintrag[] = [
  {
    id: "grp-sparkasse",
    name: "Sparkasse",
    dativ: "der Sparkasse",
    gruppe: "filialbank",
    domain: "sparkasse.de",
    aliase: ["sparkasse", "spk", "ksk", "kreissparkasse", "stadtsparkasse", "haspa", "deka", "deka depot", "sparkassen"],
    rang: 5,
    werte: null,
  },
  {
    id: "grp-volksbank",
    name: "Volksbank",
    dativ: "der Volksbank",
    gruppe: "filialbank",
    domain: "vr.de",
    aliase: ["volksbank", "raiffeisenbank", "raiffeisen", "vr bank", "vr", "vb", "union investment", "union depot"],
    rang: 8,
    werte: null,
  },
  {
    id: "grp-deutsche-bank",
    name: "Deutsche Bank",
    dativ: "der Deutschen Bank",
    gruppe: "filialbank",
    domain: "deutsche-bank.de",
    aliase: ["deutsche bank", "db"],
    rang: 12,
    werte: null,
  },
];

type Roh = { id: string; name: string; domain?: string; werte?: Record<string, unknown> };

const textOderNull = (w: Record<string, unknown>, k: string): string | null => {
  const v = w[k];
  return typeof v === "string" && v.trim() ? v : null;
};

/** Sparplan ab: die erste Zahl der Sparrate („1€ bis 5.000€“ → „1 €“); kein Sparplan → „kein Sparplan“. */
const sparplanAus = (sparrate: string | null): string | null => {
  if (!sparrate) return null;
  if (/kein sparplan/i.test(sparrate)) return "kein Sparplan";
  const m = sparrate.match(/([\d.,]+)\s?€/);
  return m ? eur(`${m[1]}€`) : null;
};

const werteAus = (a: Roh): DepotWerte => {
  const karte = BROKER_KARTEN.find((k) => k.id === a.id);
  if (karte) {
    return {
      etfs: karte.etfs,
      gold: karte.gold,
      sukuk: karte.sukuk,
      depotgebuehr: karte.depotgebuehr,
      order: karte.order,
      sparplanAb: karte.sparplanAb,
      sparplanKosten: karte.sparplanKosten,
      zinsfrei: karte.zinsfrei ? "gut" : "schlecht",
    };
  }
  const w = a.werte ?? {};
  const order = kostenKurz(a.id, "orderkosten") ?? textOderNull(w, "orderkosten");
  const z = w.zinsfreiAbStart;
  return {
    etfs: textOderNull(w, "halalEtfsFonds"),
    gold: textOderNull(w, "halalEdelmetalle"),
    sukuk: textOderNull(w, "halalSukuk"),
    depotgebuehr: textOderNull(w, "depotgebuehr") ? eur(textOderNull(w, "depotgebuehr") as string) : null,
    order: order ? eur(order) : null,
    sparplanAb: sparplanAus(textOderNull(w, "sparrate")),
    sparplanKosten: textOderNull(w, "etfSparplanKosten") ? eur(textOderNull(w, "etfSparplanKosten") as string) : null,
    zinsfrei: z === "gut" || z === "teils" || z === "schlecht" ? z : null,
  };
};

const baueListe = (): DepotEintrag[] => {
  const gesehen = new Set<string>();
  const liste: DepotEintrag[] = [];
  for (const a of brokerVergleich as unknown as Roh[]) {
    if (gesehen.has(a.name)) continue;
    gesehen.add(a.name);
    const h = HAUS[a.id] ?? { gruppe: "andere" as DepotGruppe };
    liste.push({
      id: a.id,
      vergleichId: a.id,
      name: a.name,
      dativ: h.artikel ? `${h.artikel} ${a.name}` : a.name,
      gruppe: h.gruppe,
      domain: a.domain,
      aliase: h.aliase ?? [],
      rang: h.rang ?? 50,
      werte: werteAus(a),
    });
  }
  return [...GRUPPEN, ...liste];
};

export const DEPOTS: DepotEintrag[] = baueListe();

export const depotNachId = (id: string): DepotEintrag | undefined => DEPOTS.find((d) => d.id === id);

/** Schnellwahl mit Logo, in dieser Reihenfolge (die häufigsten Depots zuerst); der Bereich scrollt, die fünfte Reihe schaut hervor. */
export const DEPOT_SCHNELLWAHL_IDS = [
  "trade-republic-depot",
  "scalable-capital-free-broker",
  "ing-direkt-depot",
  "comdirect-depot",
  "grp-sparkasse",
  "consorsbank-depot",
  "dkb-depot",
  "grp-volksbank",
  "trading-212-depot",
  "finanzen-net-zero-depot",
  "commerzbank-direktdepot",
  "grp-deutsche-bank",
  "n26-standard-depot",
  "smartbroker-plus-depot",
  "flatex-depot",
  "traders-place-depot",
] as const;

export const depotSchnellwahl = (): DepotEintrag[] =>
  DEPOT_SCHNELLWAHL_IDS.map((id) => depotNachId(id)).filter((d): d is DepotEintrag => Boolean(d));

export const depotWahlVon = (d: DepotEintrag): DepotWahl => ({
  id: d.id,
  name: d.name,
  dativ: d.dativ,
  gruppe: d.gruppe,
  kind: "depot",
  domain: d.domain,
});

export const freieDepotWahl = (eingabe: string): DepotWahl => {
  const name = eingabe.replace(/\s+/g, " ").trim().slice(0, 40);
  return { id: "frei", name, dativ: "", gruppe: "andere", kind: "frei" };
};

export type DepotVorschlag = { wahl: DepotWahl; eintrag?: DepotEintrag; punkte: number };

const istSparkasseWort = (w: string) => w.includes("spark") || w.startsWith("ksk") || w.startsWith("haspa") || w === "spk" || w === "deka";
const istVolksbankWort = (w: string) => w.startsWith("volks") || w.startsWith("raiff") || w === "vr" || w === "vb" || w === "union";

const punkteFuer = (d: DepotEintrag, eingabe: string, tokens: string[]): number => {
  const alle = [d.name, ...d.aliase].map((t) => suchNorm(t));
  if (alle.some((t) => t === eingabe)) return 100;
  const woerterAlle = alle.map((t) => (t ? t.split(" ") : []));
  let gruppe = 0;
  if (d.id === "grp-sparkasse" && tokens.some(istSparkasseWort)) gruppe = 85;
  if (d.id === "grp-volksbank" && tokens.some(istVolksbankWort)) gruppe = 85;
  let praefix = 0;
  for (const ws of woerterAlle) {
    if (tokens.every((t) => ws.some((w) => w.startsWith(t)))) praefix = Math.max(praefix, ws.join(" ").startsWith(tokens.join(" ")) ? 80 : 65);
  }
  let fuzzy = 0;
  for (const ws of woerterAlle) {
    if (tokens.every((t) => ws.some((w) => w.startsWith(t) || (t.length >= 4 && (abstand(t, w) <= 1 || abstand(t, w.slice(0, t.length)) <= 1))))) fuzzy = 45;
  }
  return Math.max(gruppe, praefix, fuzzy);
};

/** Vorschläge zur Eingabe wie in der Banksuche: höchstens `max` Depots, dahinter „„<Eingabe>“ übernehmen“, nie „nicht gefunden“. */
export const depotSuche = (eingabe: string, max = 6): DepotVorschlag[] => {
  const roh = eingabe.replace(/\s+/g, " ").trim();
  if (!roh) return [];
  const norm = suchNorm(roh);
  const tokens = norm ? norm.split(" ") : [];
  const treffer: DepotVorschlag[] = tokens.length
    ? DEPOTS.map((d) => ({ d, p: punkteFuer(d, norm, tokens) }))
        .filter((x) => x.p > 0)
        .sort((x, y) => y.p - x.p || x.d.rang - y.d.rang || x.d.name.localeCompare(y.d.name, "de"))
        .slice(0, max)
        .map((x) => ({ wahl: depotWahlVon(x.d), eintrag: x.d, punkte: x.p }))
    : [];
  if (!(treffer[0] && treffer[0].punkte >= 100)) treffer.push({ wahl: freieDepotWahl(roh), punkte: 0 });
  return treffer;
};

/** Werte des heutigen Depots, nur aus dem Vergleich; Gruppen und freie Eingaben: null. */
export const depotWerte = (w: DepotWahl): DepotWerte | null => (w.kind === "depot" ? depotNachId(w.id)?.werte ?? null : null);
