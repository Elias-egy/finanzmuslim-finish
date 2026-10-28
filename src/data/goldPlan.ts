/**
 * Der Gold-Plan, das neue Freebie zum Wort „Gold“ (Gesamtplan MC, Abschnitt 4, Sitzung MC4b).
 *
 * Gebaut im Stil von Fassung 5 des Portfolio-Plans (Elias, 28.10.2026: „in dem stil alle anderen
 * auch“): oben die Geld-Frage, ein roter Schmerz, kurze Karten mit Beispiel-Kasten, zuletzt die
 * bekannten Anbieter mit belegter Tatsache und der Aufruf zum Vergleich.
 *
 * Liegt versteckt unter /dein-gold/<schluessel>: nicht in Navigation oder Sitemap, noindex. Wer den
 * Schlüssel ändert, macht alle verschickten Links ungültig. Jede Halal- und Zinsaussage hat ihren
 * Beleg in `docs/freebies/gold-plan.belege.md`; die Wege und ihre Ampel stammen aus
 * `edelmetallVergleich.ts` (EDELMETALL_WEGE) und dem Gold-Check (`goldCheck.ts`).
 */
import nisab from "@/data/nisab.json";

export const GOLD_SCHLUESSEL = "gold-4hq7";
export const GOLD_PFAD = `/dein-gold/${GOLD_SCHLUESSEL}`;

/** Jeder Link trägt seine Stelle, damit MC6 die Klicks je Stelle zählen kann. */
export const goldLink = (ziel: string, stelle: string) => `${ziel}?src=ggold-${stelle}`;

/** Oben gewählt: Der Klick markiert nur und springt nicht (Elias, 28.10.2026, MC3c). */
export const GOLD_BETRAEGE = [100, 300, 500] as const;
export const GOLD_MONATLICH = 100;

/** Gramm reines Gold für einen Betrag, ohne Aufschlag, zum Preis aus nisab.json. */
export const gramm = (betrag: number) => betrag / nisab.goldPreisJeGramm;
export const PREIS_STAND = nisab.stand;
export const grammText = (g: number) =>
  g < 10 ? g.toLocaleString("de-DE", { maximumFractionDigits: 1, minimumFractionDigits: 1 }) : String(Math.round(g));

export const SCHMERZ = {
  gold: "Ein Gold-CFD ist nur eine Wette auf den Preis. Ein Gramm Gold bekommst du nie.",
  muslim: "Als Muslim kaufst du echtes Gold, das dir gehört.",
};

/** Bekannte Anbieter mit Gold-CFD, klein unter dem Schmerz-Satz (Belege in der Begleitdatei). */
export const CFD_ANBIETER = [
  { name: "XTB", domain: "xtb.com" },
  { name: "Plus500", domain: "plus500.com" },
  { name: "Capital.com", domain: "capital.com" },
] as const;

export type GoldWegId = "barren" | "sparplan" | "etc";

export type GoldWeg = {
  id: GoldWegId;
  name: string;
  /** Wo das Gold liegt, als kleines Etikett. */
  ort: string;
  /** Höchstens zwei, drei Zeilen am Handy (Elias, 28.10.2026). */
  satz: string;
  /** Beispiel mit Logo, nicht anklickbar (Elias, 28.10.2026). */
  beispiel: { slug?: string; domain?: string; titel: string };
};

/** Reihenfolge nach Sicherheit des Urteils: unstrittig, mit Zertifikat, umstritten (EDELMETALL_WEGE). */
export const wege: GoldWeg[] = [
  {
    id: "barren",
    name: "Barren und Münzen",
    ort: "Bei dir",
    satz: "Du zahlst und nimmst den Barren sofort mit.",
    beispiel: { domain: "proaurum.de", titel: "pro aurum, ein Goldhändler" },
  },
  {
    id: "sparplan",
    name: "Sparplan mit Tresor",
    ort: "Im Tresor",
    satz: "Du kaufst jeden Monat, das Gold wird dir zugeteilt und liegt im Tresor.",
    beispiel: { domain: "inaia.finance", titel: "INAIA, mit Shariah-Zertifikat" },
  },
  {
    id: "etc",
    name: "Gold-ETC im Depot",
    ort: "Im Depot",
    satz: "Hinter jedem Anteil liegen Barren im Tresor. Ein Teil der Gelehrten lässt das gelten, ein anderer nicht.",
    beispiel: { slug: "invesco-physical-gold-etc", titel: "Invesco Physical Gold" },
  },
];

/**
 * Bekannte Apps, je mit einer belegten Tatsache, nie mit einem Urteil (Elias, 28.10.2026: „die
 * bekanntesten Broker sind nicht die besten“). Bison: 0 der 4 Gold-ETCs aus dem Edelmetall-Vergleich,
 * belegt als nicht im Angebot in `anlagenKaufbar.ts` (der Test zählt nach); XTB: Anbieter-Beleg
 * https://www.xtb.com/de/zinsen.
 */
export const BEKANNTE_GOLD = [
  { name: "Bison", domain: "bisonapp.com", gross: "0 von 4", klein: "Gold-ETCs mit Zertifikat", ton: "gelb" },
  { name: "XTB", domain: "xtb.com", gross: "Zinsen", klein: "automatisch eingeschaltet", ton: "rot" },
] as const;

/** Bekannte Depots für den Aufruf, alle empfehlbar und mit allen 4 Gold-ETCs (der Test prüft beides). */
export const GOLD_DEPOT_LOGOS = [
  { id: "scalable-capital-free-broker", name: "Scalable Capital", domain: "scalable.capital" },
  { id: "trading-212-depot", name: "Trading 212", domain: "trading212.com" },
  { id: "traders-place-depot", name: "Traders Place", domain: "tradersplace.de" },
  { id: "comdirect-depot", name: "comdirect", domain: "comdirect.de" },
  { id: "consorsbank-depot", name: "Consorsbank", domain: "consorsbank.de" },
  { id: "flatex-depot", name: "flatex", domain: "flatex.de" },
] as const;

export const goldQuellen: { titel: string; url: string }[] = [
  { titel: "Invesco Physical Gold ETC, Shariah-Zertifikat 2025", url: "https://www.invesco.com/content/dam/invesco/emea/en/product-documents/etf/fund/ssb-certificate/invesco-physical-gold-and-silver-etc_ssb-certficate_en_2025.pdf" },
  { titel: "INAIA, Gold-Sparplan mit Shariah-Prüfung", url: "https://www.inaia.finance/en/gold-dinar/" },
  { titel: "Halal Gold kaufen, die Regel zur sofortigen Übergabe", url: "https://finanzmuslim.com/wissen/halal-gold-kaufen" },
];
