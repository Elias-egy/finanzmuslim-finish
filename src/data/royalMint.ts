/** Royal Mint Gold-ETC von HANetf (Elias, 04.11.2026: „mit großem Abstand die Nummer 1“). Klein, damit der Gold-Beitrag ihn ohne Vergleichsdaten lesen kann. */
export const ROYAL_MINT = "XS2115336336";

/**
 * Royal Mint als Sparplan, nur wo eine Quelle ihn nennt (Elias, 04.11.2026: finanzfluss, justETF oder finanzen.net
 * „erstmal als Quelle“). finanzfluss.de/informer/etf/xs2115336336 nennt Scalable Capital und Trade Republic unter
 * 13 Brokern, das justETF-Profil Scalable mit 0,00 €. Smartbroker+ nur Einmalkauf (API savingPlan false), Traders
 * Place nennt ETCs bei den Sparplänen nicht. Beleg im Vault: raw/2026-11-04-seo50-royal-mint-sparplan-je-depot.md.
 * Auf den Seiten nicht gezeigt (Elias, 04.11.2026, SEO51: „Sparplan, das ist erstmal egal, mach erstmal nur, dass sie da
 * angeboten werden“); die Liste bleibt für später.
 */
export const ROYAL_MINT_SPARPLAN: readonly string[] = ["Scalable Capital", "Trade Republic"];

/**
 * Häuser (und Finanzfluss-Produkte), bei denen der Royal Mint Gold-ETC belegt kaufbar ist, aus `ANLAGEN_KAUFBAR[ROYAL_MINT]`
 * (`kaufbar[].haus` und `haeuser`). Hier klein abgeschrieben, damit die Rangfolge ihn zählen kann, ohne die ganze Kaufbar-Liste
 * zu laden (UP6, 10.11.2026). `rangfolge.test.ts` prüft, dass beide Listen gleich sind. Stand der Belege: 25.11.2026 (justTRADE schriftlich, Mailrunde VG10).
 */
export const ROYAL_MINT_HAEUSER: readonly string[] = [
  "1822direkt", "bbbank", "comdirect", "consorsbank", "dkb", "Finvesto Wertpapierdepot", "flatex", "gls", "justtrade", "n26", "sbroker",
  "scalable", "scalable-prime", "smartbroker", "trade-republic", "tradegate-direct", "traders-place", "trading212",
];
