/**
 * Der Gold-Plan, das neue Freebie zum Wort „Gold“ (Gesamtplan MC, Abschnitt 4, Sitzung MC4b).
 *
 * Gebaut im Stil von Fassung 5 des Portfolio-Plans (Elias, 28.10.2026: „in dem stil alle anderen
 * auch“), seit MC4d nur um Gold beim Broker (Elias, 28.10.2026: „es dreht sich eigentlich alles nur um
 * Broker-Gold“): online kaufen, zwei Regeln, warum Broker-Gold meist nur eine Wette ist, die Ausnahme
 * Physical Gold ETC mit Zertifikat, nicht jeder Broker führt sie, Aufruf zum Vergleich.
 *
 * Liegt versteckt unter /dein-gold/<schluessel>: nicht in Navigation oder Sitemap, noindex. Wer den
 * Schlüssel ändert, macht alle verschickten Links ungültig. Jede Halal- und Zinsaussage hat ihren
 * Beleg in `docs/freebies/gold-plan.txt.belege.md`.
 */
import nisab from "@/data/nisab.json";
import { GOLD_ISINS, edelmetallVergleich } from "@/data/edelmetallVergleich";

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

/** Die zwei Regeln, ganz kurz (Elias, 28.10.2026, MC4c: „Ganz schnell die Regeln“). Belege in der Begleitdatei. */
export const REGELN = [
  { wort: "Sofort", satz: "Geld und Gold wechseln direkt, von Hand zu Hand." },
  { wort: "Deins", satz: "Das Gold muss wirklich dir gehören." },
] as const;

export const SCHMERZ = {
  broker: "Gold beim Broker ist sehr oft nur ein Papier auf den Preis. Gold liegt keins dahinter.",
};

/**
 * Bekannte Anbieter mit Gold-CFD, klein unter dem Schmerz-Satz als Tatsache mit Beschriftung, nicht im
 * roten Kasten (frischer Halal-Prüfer MC4b: Logos im Warnkasten wirken wie ein Urteil). Je eine
 * Anbieter-Seite in der Begleitdatei, geöffnet am 28.10.2026.
 */
export const CFD_ZEILE = "Gold-CFDs gibt es zum Beispiel bei";
export const CFD_ANBIETER = [
  { name: "XTB", domain: "xtb.com" },
  { name: "Plus500", domain: "plus500.com" },
  { name: "Capital.com", domain: "capital.com" },
] as const;

/**
 * Die Ausnahme: Physical Gold ETCs mit Zertifikat (Elias, 28.10.2026, MC4c). Ein Barren trägt nicht den
 * Namen des Käufers; WisdomTree: „Jeder physische Barren wird getrennt gelagert, ist einzeln
 * gekennzeichnet und zugewiesen“, Barrenliste auf der Produktseite.
 */
export const ETC_SATZ = "Bei einem Physical Gold ETC liegen echte Barren im Tresor. Jeder Barren ist gekennzeichnet, die Barrenliste ist öffentlich.";
export const GELEHRTE_SATZ = "Ob das als Übergabe reicht, sehen Gelehrte unterschiedlich. Frag im Zweifel einen Gelehrten.";
export const ETC_BEISPIELE = [
  { slug: "wisdomtree-physical-gold", titel: "WisdomTree Physical Gold", zertifikat: "Prüfbericht Al-Qalam" },
  { slug: "invesco-physical-gold-etc", titel: "Invesco Physical Gold", zertifikat: "Zertifikat Amanie" },
] as const;

/**
 * „Nicht jeder Broker führt sie“ (Elias, 28.10.2026): gezählt aus dem Edelmetall-Vergleich, in den nur
 * zinsfreie Depots kommen (Aufnahmeregel 26.09.2026). Am 28.10.2026: 14 von 22 mit allen 4 Gold-ETCs.
 */
export const GOLD_ETC_ZAHL = GOLD_ISINS.length;
export const DEPOTS_ZINSFREI = edelmetallVergleich.length;
export const DEPOTS_MIT_ALLEN = edelmetallVergleich.filter((a) => a.werte.gold === `${GOLD_ETC_ZAHL} von ${GOLD_ETC_ZAHL}`).length;
export const BROKER_SATZ = `Von ${DEPOTS_ZINSFREI} zinsfreien Depots haben nur ${DEPOTS_MIT_ALLEN} alle ${GOLD_ETC_ZAHL} Gold-ETCs mit Zertifikat.`;

/**
 * Bekannte Apps, je mit einer belegten Tatsache, nie mit einem Urteil (Elias, 28.10.2026: „die
 * bekanntesten Broker sind nicht die besten“). finanzen.net zero: 3 der 4 Gold-ETCs aus dem
 * Edelmetall-Vergleich, je mit Anbieter-Beleg in `anlagenKaufbar.ts` (der Test zählt nach); die Suche in
 * der Produktliste des Anbieters findet Invesco Physical Gold nicht (28.10.2026). XTB: Anbieter-Beleg
 * https://www.xtb.com/de/zinsen. Bison fiel heraus: Für „nicht im Angebot“ fand der Prüfer keine Fundstelle.
 */
export const BEKANNTE_GOLD = [
  // Farbe und „nur“ wie im Portfolio-Plan (Elias, 28.10.2026, MC3c): Lücke gelb, Zinsen leicht rot.
  { name: "finanzen.net zero", domain: "finanzen.net", vor: "nur", gross: "3 von 4", klein: "Gold-ETCs mit Zertifikat", ton: "gelb" },
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
  { titel: "WisdomTree Gold-ETCs, Shariah-Prüfbericht des Al-Qalam-Gremiums 2025", url: "https://www.wisdomtree.eu/-/media/eu-media-files/other-documents/regulatory/sharia-compliant-certificate.pdf" },
  { titel: "WisdomTree Physical Gold, Produktseite mit Barrenliste", url: "https://www.wisdomtree.com/de/products/commodities/wisdomtree-physical-gold" },
  { titel: "Halal Gold kaufen, die Regel zur sofortigen Übergabe", url: "https://finanzmuslim.com/wissen/halal-gold-kaufen" },
];
