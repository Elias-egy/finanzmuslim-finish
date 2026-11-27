/**
 * Ankertexte der Textlinks in den Blogbeiträgen auf die Vergleiche (SEO81, nach data/seo/LINKS.md „Ankertexte ohne Suchwort“,
 * Google liest am Ankertext, wofür die Zielseite steht). Nur hier ändern: Aufruf-Kasten, Zeile unter der Überschrift
 * und die Textlinks in den Beiträgen holen den Text von hier.
 * Krypto und Screening-Apps stehen bewusst nicht hier, ihre Anker sind noch nicht umbenannt.
 */
export const ANKER_VERGLEICH = {
  "/vergleich/depot": "Die besten Halal-Depots im Vergleich",
  "/vergleich/girokonto": "Halal-Girokonten im Vergleich",
  "/vergleich/edelmetalle": "Halal Gold kaufen: Depots im Vergleich",
} as const;

/**
 * Ankertext eines Beitrags, den die Vergleiche verlinken (SEO85): Das Wort „trade republic alternative“ gehört der Kaufseite
 * /blog/trade-republic-alternative, der Depot-Vergleich verweist nur mit diesem Anker dorthin. Bewusst getrennt von
 * ANKER_VERGLEICH, das nur die Vergleichsseiten zählt.
 */
export const ANKER_BEITRAG = {
  "/blog/trade-republic-alternative": "Trade Republic Alternative",
  "/blog/scalable-capital-vs-trade-republic": "Scalable Capital vs Trade Republic",
} as const;
