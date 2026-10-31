/**
 * Die Liste, das Freebie zum Wort „Liste“ (MC7d13, 31.10.2026): neu im Stil von Fassung 5 des
 * Portfolio-Plans (Elias, 28.10.2026: „in dem stil alle anderen auch“). Die Frage des Lesers ist „Was kann
 * ich überhaupt halal kaufen?“ (Plan MC7D11, Karte LISTE); die echten Fragen dazu stehen im Vault unter
 * `raw/2026-10-31-mc7d13-echte-fragen-liste.md` („quite hard to find halal investments“, „difficult to find
 * brokers“).
 *
 * Alles hier ist aus `halalAnlagen.ts` und `anlagenKaufbar.ts` gezählt, nichts von Hand. Jede Halal- und
 * Zinsaussage hat ihren Beleg in `docs/freebies/anlagen-liste.txt.belege.md`.
 */
import { kaufGruppen, kaufZeilen, krypto, ohneBeleg, type KaufZeile } from "@/data/halalAnlagenKauf";
import { DEPOTS_GEPRUEFT, DEPOTS_MIT_ALLEN, ETF_ZAHL } from "@/data/etfPlan";

/** Jeder Link trägt seine Stelle, damit MC6 die Klicks je Stelle zählen kann. */
export const listeLink = (ziel: string, stelle: string) => `${ziel}?src=gliste-${stelle}`;

/** Die Kacheln oben: was es gibt, je Art mit Zahl. Krypto zählt mit, kaufbar an Börsen. */
export const UEBERBLICK = [
  ...kaufGruppen.map((g) => ({ id: g.kategorie, zahl: g.zeilen.length, wort: g.titel.split(",")[0] })),
  { id: "krypto" as const, zahl: krypto.length, wort: "Krypto" },
];
export const ANZAHL_DEPOT = kaufZeilen.length;

/**
 * Die Coins hat nur eine Stelle geprüft; sie nennt jede Analyse „preliminary Sharia research and … by no means
 * a fatwa“ (shariyah.net, je Coin-Seite, 31.10.2026). Der Test hält fest, dass es eine Stelle bleibt.
 */
export const KRYPTO_PRUEFER = [...new Set(krypto.map((a) => a.zertifizierer.replace(", Bahrain", " in Bahrain")))].join(", ");

/**
 * Kleine Logos je Karte, nicht anklickbar (Elias, 28.10.2026, MC3b). Nur bekannte, empfehlbare Depots, die
 * ich ganz geprüft habe (der Test prüft beides); gezeigt werden die ersten drei, die die Anlage führen.
 */
export const KARTEN_DEPOTS = [
  { id: "scalable-capital-free-broker", name: "Scalable Capital", domain: "scalable.capital" },
  { id: "trade-republic-depot", name: "Trade Republic", domain: "traderepublic.com" },
  { id: "trading-212-depot", name: "Trading 212", domain: "trading212.com" },
  { id: "traders-place-depot", name: "Traders Place", domain: "tradersplace.de" },
  { id: "comdirect-depot", name: "comdirect", domain: "comdirect.de" },
  { id: "consorsbank-depot", name: "Consorsbank", domain: "consorsbank.de" },
  { id: "flatex-depot", name: "flatex", domain: "flatex.de" },
  { id: "finanzen-net-zero-depot", name: "finanzen.net zero", domain: "finanzen.net" },
] as const;

export const kartenLogos = (z: KaufZeile) =>
  KARTEN_DEPOTS.filter((d) => z.kaufbar.kaufbar.some((k) => k.anbieter === d.name)).slice(0, 3);

/**
 * Der eine rote Schmerz (Elias, 28.10.2026: „ein roter Schmerz reicht“), aus den echten Fragen: Nicht jedes
 * Depot führt sie. Gezählt wie im ETF-Plan, nur zinsfreie, ganz geprüfte Depots ohne Abraten.
 */
export const SCHMERZ_SATZ = `Nicht jedes Depot hat sie. Von ${DEPOTS_GEPRUEFT.length} zinsfreien Depots, die ich ganz geprüft habe, ${
  DEPOTS_MIT_ALLEN.length === 1 ? "hat nur eins" : `haben nur ${DEPOTS_MIT_ALLEN.length}`
} alle ${ETF_ZAHL} Aktien-ETFs und Fonds.`;

/**
 * Was die Prüfstelle wirklich bestätigt hat, je Anlage in einer kurzen Zeile (Halal-Prüfer r1, 31.10.2026:
 * die Überschrift darf nicht alle 22 gleich hinstellen). Drei Stufen, nie ein eigenes Urteil:
 * „fonds“ = Zertifikat, Fatwa oder Prüfbericht für genau dieses Produkt; „index“ = nur die Methodik des
 * Index freigegeben; „ohne“ = kein aktuelles Zertifikat gefunden. Beleg je Zeile im zertifikatHinweis und
 * zertifikatLink der Anlage in `halalAnlagen.ts`; der Test prüft, dass jede Karte eine Zeile hat.
 */
export type Stufe = "fonds" | "index" | "ohne";
export const NACHWEIS: Record<string, { stufe: Stufe; text: string }> = {
  "ishares-msci-world-islamic": { stufe: "fonds", text: "Fatwa und Zertifikat, iShares" },
  "ishares-msci-emerging-markets-islamic": { stufe: "fonds", text: "Fatwa und Zertifikat, iShares" },
  "ishares-msci-usa-islamic": { stufe: "fonds", text: "Fatwa und Zertifikat, iShares" },
  "hanetf-saturna-al-kawthar-global-focused-equity": { stufe: "fonds", text: "Jahreszertifikat 2025, Amanie" },
  "franklin-shariah-technology-fund-a-acc-usd": { stufe: "fonds", text: "Jahresbericht 2025, Amanie" },
  "invesco-msci-acwi-islamic-m-series": { stufe: "index", text: "Nur der Index geprüft, MSCI" },
  "hsbc-msci-world-islamic-screened": { stufe: "index", text: "Nur der Index geprüft, MSCI" },
  "hsbc-msci-usa-islamic-screened": { stufe: "index", text: "Nur der Index geprüft, MSCI" },
  "hsbc-msci-europe-islamic-screened": { stufe: "index", text: "Nur der Index geprüft, MSCI" },
  "hsbc-msci-emerging-markets-islamic-screened-capped": { stufe: "index", text: "Nur der Index geprüft, MSCI" },
  "invesco-dow-jones-islamic-global-developed-markets": { stufe: "ohne", text: "Kein Zertifikat 2025 gefunden" },
  "comgest-growth-europe-s-eur-acc": { stufe: "ohne", text: "Nur Gremium im Prospekt" },
  "ishares-usd-sukuk-ucits-etf": { stufe: "fonds", text: "Fatwa und Zertifikat, Amanie" },
  "xtrackers-ii-salam-usd-global-aggregate-sukuk": { stufe: "ohne", text: "Nur Berater, kein Zertifikat" },
  "bnp-paribas-islamic-fund-hilal-income-classic-c": { stufe: "ohne", text: "Eigenes Komitee, Bericht 2020" },
  "invesco-physical-gold-etc": { stufe: "fonds", text: "Jahreszertifikat 2025, Amanie" },
  "wisdomtree-physical-gold": { stufe: "fonds", text: "Prüfbericht 2026, Al-Qalam" },
  "wisdomtree-core-physical-gold": { stufe: "fonds", text: "Prüfbericht 2026, Al-Qalam" },
  "wisdomtree-physical-swiss-gold": { stufe: "fonds", text: "Prüfbericht 2026, Al-Qalam" },
  "invesco-physical-silver": { stufe: "fonds", text: "Jahreszertifikat 2025, Amanie" },
  "wisdomtree-physical-silver": { stufe: "fonds", text: "Prüfbericht 2026, Al-Qalam" },
  "wisdomtree-core-physical-silver": { stufe: "fonds", text: "Prüfbericht 2026, Al-Qalam" },
  "royal-mint-responsibly-sourced-physical-gold": { stufe: "fonds", text: "Jahreszertifikat 2025, Amanie" },
};
const RANG: Record<Stufe, number> = { fonds: 0, index: 1, ohne: 2 };
export const nachweis = (z: KaufZeile) => NACHWEIS[z.anlage.slug];

/** Die Gruppen der Liste, je Gruppe zuerst die Anlagen mit Zertifikat für das Produkt selbst. */
export const listenGruppen = kaufGruppen.map((g) => ({
  ...g,
  zeilen: [...g.zeilen].sort((a, b) => RANG[nachweis(a).stufe] - RANG[nachweis(b).stufe]),
}));

/** Wie viele der Karten auf welcher Stufe stehen, für die Zeile oben. */
export const STUFEN_ZAHL = (["fonds", "index", "ohne"] as Stufe[]).map((stufe) => ({
  stufe,
  zahl: kaufZeilen.filter((z) => nachweis(z)?.stufe === stufe).length,
}));

/**
 * Eine Zählweise für die ganze Seite (Seiten-Prüfer r1: „bei 28 Anbietern“ gegen „18 Depots“): je Karte, in
 * wie vielen der zinsfreien, ganz geprüften Depots des Schmerz-Satzes die Anlage belegt kaufbar ist. Sukuk
 * und Edelmetalle sind in diesen Depots ebenfalls ganz ausgezählt (der Test prüft das).
 */
export const depotZahl = (z: KaufZeile) =>
  DEPOTS_GEPRUEFT.filter((d) => z.kaufbar.kaufbar.some((k) => k.haus === d.haus || k.haeuser?.includes(d.haus))).length;

/**
 * Oben im roten Kasten die Frage fast aller Leser (Leser-Runde r1): „Führt mein Broker das?“ Die bekannten
 * Depots mit ihrer Zahl aus dem Depot-Vergleich (Zeile halalEtfsFonds), nie ein Urteil über den Anbieter.
 */
export const BEKANNTE_DEPOTS = (["trade-republic-depot", "scalable-capital-free-broker", "flatex-depot"] as const).map((id) => {
  const d = DEPOTS_GEPRUEFT.find((a) => a.id === id)!;
  return { id, name: d.name, domain: d.domain, zahl: Number(String(d.werte.halalEtfsFonds).split(" ")[0]) };
});

export { kaufGruppen, krypto, ohneBeleg };
