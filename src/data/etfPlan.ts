/**
 * Der ETF-Plan, das Freebie zum Wort „ETF“ (Gesamtplan MC, Abschnitt 4, Sitzung MC4e).
 *
 * Gebaut im Stil der Gold-Seite und von Fassung 5 des Portfolio-Plans (Elias, 28.10.2026: „in dem stil
 * alle anderen auch“). Kern nach dem Satz, den Elias in MC4e ohne Einwand bestätigt hat: was ein Islamic
 * ETF ist, welche 12 in meiner Liste stehen, nicht jeder Broker hat sie, Aufruf zum Depot-Vergleich.
 *
 * Liegt versteckt unter /dein-etf/<schluessel>: nicht in Navigation oder Sitemap, noindex. Wer den
 * Schlüssel ändert, macht alle verschickten Links ungültig. Jede Halal- und Zinsaussage hat ihren
 * Beleg in `docs/freebies/etf-plan.txt.belege.md`.
 */
import { brokerVergleich } from "@/data/brokerVergleich";
import { ANLAGE_ZEILE } from "@/data/anlagenKaufbar";

export const ETF_SCHLUESSEL = "etf-8wn3";
export const ETF_PFAD = `/dein-etf/${ETF_SCHLUESSEL}`;

/** Jeder Link trägt seine Stelle, damit MC6 die Klicks je Stelle zählen kann. */
export const etfLink = (ziel: string, stelle: string) => `${ziel}?src=getf-${stelle}`;

/** Oben gewählt: Der Klick markiert nur und springt nicht (Elias, 28.10.2026, MC3c). */
export const ETF_BETRAEGE = [100, 300, 500] as const;
export const ETF_MONATLICH = 100;

/**
 * MSCI-Factsheets vom 30.09.2026: MSCI World 1.249 Firmen, davon Financials 15,74 %; MSCI World
 * Islamic 385 Firmen. Neue Zahlen nur mit neuem Factsheet und neuer Zeile in der Begleitdatei.
 */
export const WORLD_FIRMEN = 1249;
export const ISLAMIC_FIRMEN = 385;
export const WORLD_FINANZ_ANTEIL = 0.1574;
export const MSCI_STAND = "30.09.2026";

export const zahl = (n: number) => n.toLocaleString("de-DE");
export const anFinanz = (betrag: number) => Math.round(betrag * WORLD_FINANZ_ANTEIL);

/** Der eine rote Schmerz (Bauplan Punkt 9), mit dem gewählten Betrag. */
export const schmerzSatz = (betrag: number) =>
  `Von ${betrag} € im MSCI World stecken rund ${anFinanz(betrag)} € in Banken, Versicherern und anderen Finanzfirmen.`;
export const MUSLIM_SATZ = "Als Muslim musst du Zinsen meiden.";

/** Den normalen MSCI World gibt es zum Beispiel von diesen Anbietern (Produktseiten in der Begleitdatei). */
export const WORLD_ZEILE = "Den MSCI World gibt es zum Beispiel von";
export const WORLD_ANBIETER = [
  { name: "iShares", domain: "ishares.com" },
  { name: "Xtrackers", domain: "xtrackers.com" },
] as const;

/** Was der MSCI World Islamic aussortiert (Methodik der MSCI Islamic Index Series, 2.1 und 2.2). */
export const REGELN = [
  { wort: "Kein Haram-Geschäft", satz: "Alkohol, Schwein, Glücksspiel und normale Finanzfirmen wie Banken fliegen raus." },
  { wort: "Wenig Schulden", satz: "Firmen mit zu vielen Schulden fliegen auch raus." },
] as const;
export const REST_SATZ = "Firmen mit bis zu 5 % Einnahmen aus Zinsen oder solchen Geschäften bleiben drin. Diesen Anteil der Ausschüttung spendest du.";
export const GREMIUM_SATZ = "Gelehrte haben diese Regeln geprüft und freigegeben.";

/** Beispiele mit eigener Shariah-Prüfung, als Kasten mit Logo, nicht anklickbar (Bauplan Punkt 10). */
export const ETF_BEISPIELE = [
  { slug: "ishares-msci-world-islamic", titel: "iShares MSCI World Islamic", pruefung: "Fatwa des Shari'ah-Gremiums bei iShares" },
  { slug: "hanetf-saturna-al-kawthar-global-focused-equity", titel: "Saturna Al-Kawthar Global Focused Equity", pruefung: "Shariah-Zertifikat von Amanie für 2025" },
] as const;

/** Die 12 Islamic ETFs und Fonds des Depot-Vergleichs (auftraege/halal-isins.json). */
export const ETF_ISINS = Object.keys(ANLAGE_ZEILE).filter((i) => ANLAGE_ZEILE[i] === "halalEtfsFonds");
export const ETF_ZAHL = ETF_ISINS.length;

/**
 * „Nicht jeder Broker hat sie“: gezählt aus dem Depot-Vergleich, nur Depots ohne Abraten, ohne Zins ab
 * Start („zinsfreiAbStart“ nicht „schlecht“) und mit ganz geprüfter Zahl (kein „mind.“, nicht leer).
 * Am 28.10.2026: 18 Depots, davon 1 mit allen 12 (flatex).
 */
const voll = new RegExp(`^(\\d+) von ${ETF_ZAHL}$`);
export const DEPOTS_GEPRUEFT = brokerVergleich.filter(
  (a) => !a.abgeraten && a.werte.zinsfreiAbStart !== "schlecht" && voll.test(String(a.werte.halalEtfsFonds ?? "")),
);
export const DEPOTS_MIT_ALLEN = DEPOTS_GEPRUEFT.filter((a) => a.werte.halalEtfsFonds === `${ETF_ZAHL} von ${ETF_ZAHL}`);
export const BROKER_SATZ = `In meiner Liste stehen ${ETF_ZAHL} Islamic ETFs und Fonds. Nicht jedes Depot hat sie alle: Von ${DEPOTS_GEPRUEFT.length} zinsfreien Depots, die ich ganz geprüft habe, ${
  DEPOTS_MIT_ALLEN.length === 1 ? "hat nur eins" : `haben nur ${DEPOTS_MIT_ALLEN.length}`
} alle ${ETF_ZAHL}.`;

/**
 * Bekannte Apps, je mit einer belegten Tatsache, nie mit einem Urteil (Elias, 28.10.2026: „die
 * bekanntesten Broker sind nicht die besten“). Trade Republic: 6 von 12 aus `anlagenKaufbar.ts` (der
 * Test zählt nach); XTB: Anbieter-Beleg https://www.xtb.com/de/zinsen. Wie im Portfolio-Plan (MC3c).
 */
export const BEKANNTE_ETF = [
  { name: "Trade Republic", domain: "traderepublic.com", vor: "nur", gross: "6 von 12", klein: "Islamic ETFs und Fonds", ton: "gelb" },
  { name: "XTB", domain: "xtb.com", gross: "Zinsen", klein: "automatisch eingeschaltet", ton: "rot" },
] as const;

/** Bekannte Depots für den Aufruf, alle empfehlbar und mit vielen der 12 (der Test prüft beides). */
export const ETF_DEPOT_LOGOS = [
  { id: "flatex-depot", name: "flatex", domain: "flatex.de" },
  { id: "consorsbank-depot", name: "Consorsbank", domain: "consorsbank.de" },
  { id: "trading-212-depot", name: "Trading 212", domain: "trading212.com" },
  { id: "traders-place-depot", name: "Traders Place", domain: "tradersplace.de" },
  { id: "scalable-capital-free-broker", name: "Scalable Capital", domain: "scalable.capital" },
  { id: "comdirect-depot", name: "comdirect", domain: "comdirect.de" },
] as const;

export const etfQuellen: { titel: string; url: string }[] = [
  { titel: "MSCI World Index, Factsheet 30.09.2026", url: "https://www.msci.com/documents/10199/178e6643-6ae6-47b9-82be-e1fc565ededb" },
  { titel: "MSCI World Islamic Index, Factsheet 30.09.2026", url: "https://www.msci.com/documents/10199/c0b90e16-5746-4cdc-b033-1ec7da64386e" },
  { titel: "Methodik der MSCI Islamic Index Series", url: "https://www.msci.com/index/methodology/latest/Islamic" },
  { titel: "iShares II plc, Verkaufsprospekt (Shari'ah Equity Funds Panel)", url: "https://www.blackrock.com/ch/individual/en/literature/prospectus/ishares-ii-plc-prospectus-en.pdf" },
  { titel: "Saturna Al Kawthar Global Focused Equity UCITS ETF, Shariah Compliance Certificate FYE 2025 (Amanie)", url: "https://hanetf.com/wp-content/assets/Saturna%20Al%20Kawthar%20-%20Shariah%20Compliance%20Cert%20FYE%20-%202025%20(Final%20&%20Executed).pdf" },
];
