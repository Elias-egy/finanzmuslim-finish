/**
 * Banksuche im Bankkonto-Check, Frage „Bei welcher Bank bist du heute?“ (RN8, 15.11.2026).
 *
 * Auftrag Elias (Vault raw/2026-11-15-elias-rn8-02-bank-suchen-nebeneinander-nur-ein-ergebnis.md): „eine sehr angenehme
 * Suchleiste … auf gar keinen Fall, dass eine Person was eingibt und es wird nicht gefunden … Berliner Volksbank, wenn er V
 * eingibt, soll direkt Volksbank kommen“. Vorbild ist die Bankauswahl im OS (ob_bankHTML, ob_suchNorm), mit einem
 * Unterschied: „Keine Bank gefunden“ gibt es hier nie. Was nichts trifft, steht als „„<Eingabe>“ übernehmen“ in der Liste.
 *
 * Die Bankliste kommt aus dem Girokonto-Vergleich (nach Bank, nicht nach Produkt) und den belegten Kontopreisen
 * (kontopreise.ts), dazu die Gruppen (Sparkasse, Volksbank, Sparda, PSD). Ein Preis steht nur bei Banken, deren Konto im
 * Vergleich einen belegten Preis hat. Für Gruppen und freie Eingaben gibt es nie eine Zahl.
 */
import { girokontoVergleich } from "@/data/girokontoVergleich";
import { KONTOPREISE, type Kontopreis } from "@/data/kontopreise";

/** Gruppe für die Messung: nie der freie Text, nur diese Wörter. */
export type BankGruppe = "sparkasse" | "volksbank" | "grossbank" | "direktbank" | "andere" | "keine";

export type BankEintrag = {
  id: string;
  /** Name wie im Chat und in der Überschrift. */
  name: string;
  /** „Von der Sparkasse zur norisbank“: Dativ mit Artikel; Fintechs ohne Artikel („Von N26 …“). */
  dativ: string;
  gruppe: BankGruppe;
  domain?: string;
  /** Gruppe wie „Sparkasse“ oder „Volksbank“: kein einzelner Preis, nie eine geratene Zahl. */
  istGruppe: boolean;
  aliase: string[];
  /** Platz in der Reihenfolge bei gleichem Treffer (kleiner ist weiter vorn). */
  rang: number;
  /** Konten dieser Bank mit belegtem Preis (Schlüssel in kontopreise.ts). */
  produkte: { id: string; produkt: string; preis: Kontopreis; ident?: string }[];
};

/** Eine Auswahl im Chat. `frei` ist eine Eingabe, die nichts getroffen hat und als Bankname gilt. */
export type BankWahl = {
  id: string;
  name: string;
  dativ: string;
  gruppe: BankGruppe;
  kind: "bank" | "frei" | "keine";
  domain?: string;
};

export const KEINE_BANK: BankWahl = { id: "keine", name: "Noch kein Konto", dativ: "", gruppe: "keine", kind: "keine" };

// ---------------------------------------------------------------------------
// Eingabe normalisieren und vergleichen

/** Klein, Umlaute und ß aufgelöst, Satzzeichen wie Leerzeichen, Leerzeichen zusammengefasst. */
export const suchNorm = (s: string): string =>
  s
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

/** „nuernberg“ und „nurnberg“ sind für die Suche dasselbe Wort. */
const falte = (w: string) => w.replace(/ae/g, "a").replace(/oe/g, "o").replace(/ue/g, "u");

const woerter = (norm: string): string[] => (norm ? norm.split(" ").map(falte) : []);

/** Abstand für Tippfehler: Einfügen, Löschen, Ersetzen und Vertauschen zweier Buchstaben zählen je 1. */
export const abstand = (a: string, b: string): number => {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > 2) return 3;
  const d: number[][] = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 0; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const kosten = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + kosten);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
    }
  }
  return d[a.length][b.length];
};

// ---------------------------------------------------------------------------
// Bankliste

type Gruppenangabe = { gruppe: BankGruppe; dativ?: string; ohneArtikel?: boolean; aliase?: string[]; rang?: number; name?: string };

/** Je Haus im Vergleich: Gruppe für die Messung, Anzeigename, Aliase. Haus ohne Eintrag läuft als „andere“. */
const HAUS: Record<string, Gruppenangabe> = {
  haspa: { gruppe: "sparkasse", aliase: ["haspa", "hamburger sparkasse"] },
  "berliner-volksbank": { gruppe: "volksbank", aliase: ["berliner vb", "volksbank berlin"] },
  bbbank: { gruppe: "volksbank", aliase: ["bb bank", "bbbank", "badische beamtenbank"], rang: 20 },
  "psd-nuernberg": { gruppe: "volksbank", aliase: ["psd nuernberg", "psd bank nuernberg"] },
  "meine-bank": { gruppe: "volksbank", dativ: "meiner Bank", aliase: ["meinebank"] },
  "pax-bank": { gruppe: "volksbank" },
  "deutsche-bank": { gruppe: "grossbank", dativ: "der Deutschen Bank", aliase: ["db", "deutsche", "deutsche bank ag"], rang: 3 },
  commerzbank: { gruppe: "grossbank", aliase: ["commerz", "cb"], rang: 4 },
  hvb: { gruppe: "grossbank", aliase: ["hypo", "hypovereinsbank", "vereinsbank", "hvb", "unicredit"] },
  postbank: { gruppe: "grossbank", aliase: ["post", "deutsche postbank"], rang: 5 },
  targobank: { gruppe: "grossbank", aliase: ["targo"] },
  ing: { gruppe: "direktbank", aliase: ["ing diba", "diba", "ing-diba", "ing deutschland"], rang: 6 },
  dkb: { gruppe: "direktbank", aliase: ["deutsche kreditbank"], rang: 7 },
  comdirect: { gruppe: "direktbank" },
  consorsbank: { gruppe: "direktbank", aliase: ["consors"] },
  "1822direkt": { gruppe: "direktbank", aliase: ["1822", "frankfurter sparkasse direkt"] },
  norisbank: { gruppe: "direktbank", name: "norisbank", aliase: ["noris", "noris bank", "norris bank"] },
  n26: { gruppe: "direktbank", ohneArtikel: true, aliase: ["number26"], rang: 8 },
  "trade-republic": { gruppe: "direktbank", ohneArtikel: true, aliase: ["tr", "traderepublic"] },
  revolut: { gruppe: "direktbank", ohneArtikel: true },
  bunq: { gruppe: "direktbank", ohneArtikel: true },
  c24: { gruppe: "direktbank", ohneArtikel: true, aliase: ["check24 konto", "c 24"] },
  santander: { gruppe: "direktbank", name: "Santander", aliase: ["openbank", "santander bestgiro"] },
  bforbank: { gruppe: "direktbank", name: "BforBank", aliase: ["bfor bank"] },
  bbva: { gruppe: "direktbank" },
  klarna: { gruppe: "direktbank", ohneArtikel: true },
  monese: { gruppe: "direktbank", ohneArtikel: true },
  sumup: { gruppe: "direktbank", ohneArtikel: true },
  tomorrow: { gruppe: "direktbank", ohneArtikel: true, aliase: ["tomorrow bank"] },
  vivid: { gruppe: "direktbank", ohneArtikel: true, aliase: ["vivid money"] },
  wise: { gruppe: "direktbank", ohneArtikel: true, aliase: ["transferwise"] },
  gls: { gruppe: "andere", aliase: ["gls bank"] },
  ethikbank: { gruppe: "andere", aliase: ["ethik bank"] },
  umweltbank: { gruppe: "andere", aliase: ["umwelt bank"] },
  "kt-bank": { gruppe: "andere", aliase: ["kt", "kuveyt tuerk", "kuveyt"] },
};

const GRUPPEN: BankEintrag[] = [
  {
    id: "grp-sparkasse",
    name: "Sparkasse",
    dativ: "der Sparkasse",
    gruppe: "sparkasse",
    domain: "sparkasse.de",
    istGruppe: true,
    // Auch „Kreissparkasse Köln“, „Stadtsparkasse“, „Haspa“, „KSK“ und jede Eingabe mit „spark“ gehört hierher (siehe istSparkasse).
    aliase: ["sparkasse", "spk", "ksk", "kreissparkasse", "stadtsparkasse", "haspa", "sparkassen", "s-bank", "sskm"],
    rang: 1,
    produkte: [],
  },
  {
    id: "grp-volksbank",
    name: "Volksbank",
    dativ: "der Volksbank",
    gruppe: "volksbank",
    domain: "vr.de",
    istGruppe: true,
    aliase: ["volksbank", "raiffeisenbank", "raiffeisen", "vr bank", "vr", "vb", "genossenschaftsbank", "genossenschaft", "volksbank raiffeisenbank"],
    rang: 2,
    produkte: [],
  },
  {
    id: "grp-sparda",
    name: "Sparda-Bank",
    dativ: "der Sparda-Bank",
    gruppe: "volksbank",
    istGruppe: true,
    aliase: ["sparda", "sparda bank"],
    rang: 9,
    produkte: [],
  },
  {
    id: "grp-psd",
    name: "PSD Bank",
    dativ: "der PSD Bank",
    gruppe: "volksbank",
    istGruppe: true,
    aliase: ["psd", "psd bank"],
    rang: 10,
    produkte: [],
  },
];

const anzeigeName = (haus: string, name: string) => HAUS[haus]?.name ?? name;

const baueListe = (): BankEintrag[] => {
  const nachHaus = new Map<string, BankEintrag>();
  for (const a of girokontoVergleich as unknown as {
    id: string;
    name: string;
    produkt: string;
    domain?: string;
    haus: string;
    werte?: Record<string, unknown>;
  }[]) {
    const preis = KONTOPREISE[a.id];
    let b = nachHaus.get(a.haus);
    if (!b) {
      const h = HAUS[a.haus] ?? { gruppe: "andere" as BankGruppe };
      const name = anzeigeName(a.haus, a.name);
      b = {
        id: a.haus,
        name,
        dativ: h.dativ ?? (h.ohneArtikel ? name : `der ${name}`),
        gruppe: h.gruppe,
        domain: a.domain,
        istGruppe: false,
        aliase: h.aliase ?? [],
        rang: h.rang ?? 50,
        produkte: [],
      };
      nachHaus.set(a.haus, b);
    }
    if (preis) {
      const ident = typeof a.werte?.ident === "string" ? (a.werte.ident as string) : undefined;
      b.produkte.push({ id: a.id, produkt: a.produkt, preis, ident });
    }
  }
  return [...GRUPPEN, ...nachHaus.values()];
};

export const BANKEN: BankEintrag[] = baueListe();

export const bankNachId = (id: string): BankEintrag | undefined => BANKEN.find((b) => b.id === id);

/**
 * Schnellwahl-Knöpfe mit Logo, in dieser Reihenfolge. Die ersten acht wie in RN8; seit RN10 (Elias RN9-01: „man sollte
 * vielleicht leicht ein fünftes Konto, also eine fünfte Reihe unten hervorgehen sehen. Und die kann man, dann kann man da
 * runter scrollen“) acht weitere, der Bereich scrollt und zeigt die fünfte Reihe angeschnitten.
 */
export const SCHNELLWAHL_IDS = [
  "grp-sparkasse",
  "grp-volksbank",
  "deutsche-bank",
  "commerzbank",
  "postbank",
  "ing",
  "dkb",
  "n26",
  "comdirect",
  "c24",
  "trade-republic",
  "consorsbank",
  "hvb",
  "targobank",
  "revolut",
  "santander",
] as const;

export const schnellwahl = (): BankEintrag[] =>
  SCHNELLWAHL_IDS.map((id) => bankNachId(id)).filter((b): b is BankEintrag => Boolean(b));

export const wahlVon = (b: BankEintrag): BankWahl => ({
  id: b.id,
  name: b.name,
  dativ: b.dativ,
  gruppe: b.gruppe,
  kind: "bank",
  domain: b.domain,
});

/** Freie Eingabe als Bankname: höchstens 40 Zeichen, nie ein Preis, Gruppe „andere“. */
export const freieWahl = (eingabe: string): BankWahl => {
  const name = eingabe.replace(/\s+/g, " ").trim().slice(0, 40);
  return { id: "frei", name, dativ: "", gruppe: "andere", kind: "frei" };
};

// ---------------------------------------------------------------------------
// Suche

/** Eingaben, die immer die Gruppe Sparkasse meinen: „spark…“ irgendwo im Wort, „ksk…“, „haspa“. */
const istSparkasseWort = (w: string) => w.includes("spark") || w.startsWith("ksk") || w.startsWith("haspa") || w === "spk" || w.startsWith("sskm");
/** … und die Gruppe Volksbank: „volks…“, „raiff…“, „vr“, „vb“, „genossen…“ am Wortanfang. */
const istVolksbankWort = (w: string) =>
  w.startsWith("volks") || w.startsWith("raiff") || w === "vr" || w === "vb" || w.startsWith("genossen");

export type Vorschlag = { wahl: BankWahl; eintrag?: BankEintrag; punkte: number };

const punkteFuer = (b: BankEintrag, eingabe: string, tokens: string[]): number => {
  const alle = [b.name, ...b.aliase].map((t) => suchNorm(t));
  // Genau ein Name oder Alias.
  if (alle.some((t) => falte(t) === falte(eingabe))) return 100;
  const woerterAlle = alle.map((t) => woerter(t));

  // Gruppen: ein Treffer irgendwo in der Eingabe genügt („Kreissparkasse Köln“, „Volksbank Mittelhessen“).
  let gruppeTreffer = 0;
  if (b.id === "grp-sparkasse" && tokens.some(istSparkasseWort)) gruppeTreffer = 85;
  if (b.id === "grp-volksbank" && tokens.some(istVolksbankWort)) gruppeTreffer = 85;

  // Jedes Wort der Eingabe beginnt ein Wort des Namens oder Alias.
  let praefix = 0;
  for (const ws of woerterAlle) {
    if (tokens.every((t) => ws.some((w) => w.startsWith(t)))) {
      const ganz = ws.join(" ").startsWith(tokens.join(" "));
      praefix = Math.max(praefix, ganz ? 80 : 65);
    }
  }

  // Tippfehler bis Abstand 1, erst ab 4 Buchstaben je Wort.
  let fuzzy = 0;
  for (const ws of woerterAlle) {
    const ok = tokens.every((t) =>
      ws.some((w) => w.startsWith(t) || (t.length >= 4 && (abstand(t, w) <= 1 || abstand(t, w.slice(0, t.length)) <= 1))),
    );
    if (ok) fuzzy = 45;
  }
  // Tippfehler in der Gruppe: „Sparkase“, „Volksbnak“.
  if (!gruppeTreffer && b.id === "grp-sparkasse" && tokens.some((t) => t.length >= 4 && abstand(t, "sparkasse") <= 1)) gruppeTreffer = 70;
  if (!gruppeTreffer && b.id === "grp-volksbank" && tokens.some((t) => t.length >= 4 && abstand(t, "volksbank") <= 1)) gruppeTreffer = 70;

  const basis = Math.max(gruppeTreffer, praefix, fuzzy);
  if (!basis) return 0;
  // Gruppen zuerst, wenn sonst gleich gut.
  return basis + (b.istGruppe ? 12 : 0);
};

/**
 * Vorschläge zur Eingabe, beste zuerst. Höchstens `max` Banken, dahinter immer „„<Eingabe>“ übernehmen“, solange die
 * Eingabe nicht schon genau einen Namen trifft. Bei leerer Eingabe: nichts (die Schnellwahl zeigt die Oberfläche).
 * Es gibt kein „nicht gefunden“: Wird nichts erkannt, ist „übernehmen“ der einzige und damit erste Vorschlag.
 */
export const suche = (eingabe: string, max = 6): Vorschlag[] => {
  const roh = eingabe.replace(/\s+/g, " ").trim();
  if (!roh) return [];
  const norm = suchNorm(roh);
  const tokens = woerter(norm);
  const treffer: Vorschlag[] = tokens.length
    ? BANKEN.map((b) => ({ b, p: punkteFuer(b, norm, tokens) }))
        .filter((x) => x.p > 0)
        .sort((x, y) => y.p - x.p || x.b.rang - y.b.rang || x.b.name.localeCompare(y.b.name, "de"))
        .slice(0, max)
        .map((x) => ({ wahl: wahlVon(x.b), eintrag: x.b, punkte: x.p }))
    : [];
  const exakt = treffer[0] && treffer[0].punkte >= 100;
  if (!exakt) treffer.push({ wahl: freieWahl(roh), punkte: 0 });
  return treffer;
};

// ---------------------------------------------------------------------------
// Preis der heutigen Bank, nur belegt

export type BankPreis = {
  /** „0 €“ oder „ab 0 €“ bei mehreren Konten. */
  wert: string;
  /** Produktname und Bedingung, je eine Zeile. */
  zusatz: string[];
  /** Wie das Konto eröffnet wird laut Vergleich (nur wenn belegt), sonst nicht gesetzt. */
  eroeffnung?: string;
  produkt: string;
};

const betrag = (n: number) =>
  `${n.toLocaleString("de-DE", { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 })}\u00a0€`;

/**
 * Belegter Monatspreis (aktiv, bei 1.000 € Geldeingang und normaler Nutzung, siehe kontopreise.ts) der heutigen Bank.
 * Hat die Bank mehrere Konten im Vergleich, „ab“ plus der günstigste Preis mit seinem Produktnamen. Gruppen, freie
 * Eingaben und Banken ohne belegten Preis: nichts (der Aufrufer schreibt dann „steht in deinem Kontoauszug“).
 */
export const bankPreis = (w: BankWahl): BankPreis | null => {
  if (w.kind !== "bank") return null;
  const b = bankNachId(w.id);
  if (!b || b.istGruppe || b.produkte.length === 0) return null;
  const guenstigste = [...b.produkte].sort((x, y) => x.preis.aktiv - y.preis.aktiv || x.preis.grundpreis - y.preis.grundpreis)[0];
  const p = guenstigste.preis;
  const mehrere = b.produkte.length > 1;
  const zusatz = [guenstigste.produkt];
  if (p.bedingung) zusatz.push(`${p.bedingung}, sonst ${betrag(p.grundpreis)}`);
  return {
    wert: `${mehrere ? "ab " : ""}${betrag(p.aktiv)}`,
    zusatz,
    eroeffnung: guenstigste.ident,
    produkt: guenstigste.produkt,
  };
};

/** Ampelwert aus dem Girokonto-Vergleich: gut, teils, schlecht; null heißt noch nicht geprüft. */
export type BankAmpel = "gut" | "teils" | "schlecht";
export type BankHalal = { zinsfrei: BankAmpel | null; keinDispo: BankAmpel | null };

/**
 * Zinsen und Dispo der heutigen Bank, nur aus dem Girokonto-Vergleich (girokontoVergleich.ts samt Korrekturen, jeder Wert mit
 * Beleg dort), für die Vergleichskarte im Check (Elias RN11-04: „immer die, wo die sich unterscheiden“). Hat die Bank mehrere
 * Konten mit verschiedenen Werten, gilt der Wert als offen. Die Gruppe Sparkasse nimmt die Hamburger Sparkasse aus dem Vergleich
 * (schriftlich von der Haspa: Überziehungspuffer, Sperre muss man selbst verlangen); Elias RN11-05: „Bei Sparkasse schon. Und du
 * musst ihn schriftlich oder sowas musst du es ausschalten, aber du hast ihn drin.“ Andere Gruppen und freie Eingaben: offen.
 */
const GRUPPE_HAUS: Record<string, string> = { "grp-sparkasse": "haspa" };
export const bankHalal = (w: BankWahl): BankHalal => {
  const haus = w.kind === "bank" ? (GRUPPE_HAUS[w.id] ?? w.id) : undefined;
  const konten = haus
    ? (girokontoVergleich as unknown as { haus: string; werte?: Record<string, unknown> }[]).filter((a) => a.haus === haus)
    : [];
  const einig = (key: string): BankAmpel | null => {
    const werte = new Set(konten.map((a) => a.werte?.[key] ?? null));
    const [v] = [...werte];
    return werte.size === 1 && (v === "gut" || v === "teils" || v === "schlecht") ? v : null;
  };
  return { zinsfrei: einig("zinsfreiAbStart"), keinDispo: einig("keinDispoAbStart") };
};
