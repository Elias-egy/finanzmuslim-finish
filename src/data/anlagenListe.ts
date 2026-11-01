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
import { DEPOTS_GEPRUEFT } from "@/data/etfPlan";
import { TOP3 } from "@/data/depotTop3";
import { NACHWEIS, type Stufe } from "@/data/anlagenNachweis";

/**
 * Jeder Link trägt seine Stelle, damit MC6 die Klicks je Stelle zählen kann: gl plus Stelle, eingetragen in
 * `src/lib/attribution.ts` (bis MC7d13d stand dort „gliste-…“, das die Zählung nicht annahm).
 */
export const listeLink = (ziel: string, stelle: "top3" | "nr1" | "alle" | "karte") => `${ziel}?src=gl${stelle}`;

/**
 * Die Kacheln oben: was es gibt, je Art mit Zahl, nur die Anlagen im Depot. Krypto steht nicht im Kopf unter dem
 * Titel „Die Halal-Investment-Liste“, weil die Coins nur eine vorläufige Einschätzung haben, keine Fatwa (Halal-Prüfer
 * r3b, 31.10.2026); sie stehen unten mit diesem Hinweis.
 */
export const UEBERBLICK = kaufGruppen.map((g) => ({ id: g.kategorie, zahl: g.zeilen.length, wort: g.titel.split(",")[0] }));
export const ANZAHL_DEPOT = kaufZeilen.length;

/**
 * Die Coins hat nur eine Stelle geprüft; sie nennt jede Analyse „preliminary Sharia research and … by no means
 * a fatwa“ (shariyah.net, je Coin-Seite, 31.10.2026). Der Test hält fest, dass es eine Stelle bleibt.
 */
export const KRYPTO_PRUEFER = [...new Set(krypto.map((a) => a.zertifizierer.replace(", Bahrain", " in Bahrain")))].join(", ");

/**
 * Kleine Logos je Karte, nicht anklickbar (Elias, 28.10.2026, MC3b). Nur bekannte, empfehlbare Depots, die
 * ich ganz geprüft habe (der Test prüft beides); gezeigt werden die ersten drei, die die Anlage führen. Die Top 3
 * stehen vorn, damit sich die Empfehlung von oben festsetzt (Elias, 31.10.2026: „Traders Place und so immer wieder zeigen“).
 */
const BEKANNT = [
  { id: "scalable-capital-free-broker", name: "Scalable Capital", domain: "scalable.capital" },
  { id: "trade-republic-depot", name: "Trade Republic", domain: "traderepublic.com" },
  { id: "trading-212-depot", name: "Trading 212", domain: "trading212.com" },
  { id: "traders-place-depot", name: "Traders Place", domain: "tradersplace.de" },
  { id: "comdirect-depot", name: "comdirect", domain: "comdirect.de" },
  { id: "consorsbank-depot", name: "Consorsbank", domain: "consorsbank.de" },
  { id: "flatex-depot", name: "flatex", domain: "flatex.de" },
  { id: "finanzen-net-zero-depot", name: "finanzen.net zero", domain: "finanzen.net" },
];
const topRang = (id: string) => {
  const i = TOP3.findIndex((t) => t.id === id);
  return i === -1 ? TOP3.length : i;
};
export const KARTEN_DEPOTS = [...BEKANNT].sort((a, b) => topRang(a.id) - topRang(b.id));

export const kartenLogos = (z: KaufZeile) =>
  KARTEN_DEPOTS.filter((d) => z.kaufbar.kaufbar.some((k) => k.anbieter === d.name)).slice(0, 3);

const RANG: Record<Stufe, number> = { aktuell: 0, prospekt: 1, aelter: 2 };
export const nachweis = (z: KaufZeile) => NACHWEIS[z.anlage.slug];

/** Die Gruppen der Liste, je Gruppe zuerst die Anlagen mit dem jüngsten Nachweis. */
/** Am Handy je Gruppe nur die ersten vier Karten, der Rest auf Tippen (Leser-Runde r2: ab Schirm 3 steigen alle aus). */
export const SICHTBAR = 4;

export const listenGruppen = kaufGruppen.map((g) => ({
  ...g,
  zeilen: [...g.zeilen].sort((a, b) => RANG[nachweis(a).stufe] - RANG[nachweis(b).stufe]),
}));

/** Wie viele der Karten auf welcher Stufe stehen, für die Zeile oben. */
export const STUFEN_ZAHL = (["aktuell", "prospekt", "aelter"] as Stufe[]).map((stufe) => ({
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

export { kaufGruppen, krypto, ohneBeleg, NACHWEIS, type Stufe };
