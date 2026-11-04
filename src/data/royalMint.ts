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
