/**
 * Was zu jeder Anlage belegt vorliegt, in einer kurzen Zeile (Halal-Prüfer r1 und r2, 31.10.2026: die
 * Überschrift darf nicht alle 22 gleich hinstellen, und keine Zeile behauptet ein Fehlen, das sich nicht
 * zeigen lässt). Drei Stufen nach dem jüngsten gelesenen Dokument, nie ein eigenes Urteil:
 * „aktuell“ = Zertifikat oder Prüfbericht für genau dieses Produkt aus 2025 oder 2026; „prospekt“ = Fatwa,
 * Gremium oder Berater laut Prospekt, oder der Index ist geprüft; „aelter“ = jüngster gefundener Nachweis
 * gilt für 2023 oder früher (Halal-Prüfer r3: „letzter“ behauptet ein Fehlen). Beleg je Zeile in `halalAnlagen.ts` (zertifikatHinweis, zertifikatLink) und in
 * `pruefung/halal-anlagen-liste-r2.md` im Vault; der Test prüft, dass jede Karte eine Zeile hat.
 * Eigene Datei seit MC7d13d, weil auch die Anlage-Seite diese Zeile zeigt (Halal-Prüfer r2, Fund 9: dort stand
 * „liegt vor“ auch bei Prospekt und Bericht von 2020).
 */
export type Stufe = "aktuell" | "prospekt" | "aelter";
export const NACHWEIS: Record<string, { stufe: Stufe; text: string }> = {
  "ishares-msci-world-islamic": { stufe: "prospekt", text: "Fatwa laut Prospekt, iShares-Panel" },
  "ishares-msci-emerging-markets-islamic": { stufe: "prospekt", text: "Fatwa laut Prospekt, iShares-Panel" },
  "ishares-msci-usa-islamic": { stufe: "prospekt", text: "Fatwa laut Prospekt, iShares-Panel" },
  "hanetf-saturna-al-kawthar-global-focused-equity": { stufe: "aktuell", text: "Jahreszertifikat 2025, Amanie" },
  "franklin-shariah-technology-fund-a-acc-usd": { stufe: "aktuell", text: "Jahresbericht 2025, Amanie" },
  "invesco-msci-acwi-islamic-m-series": { stufe: "prospekt", text: "Index geprüft, MSCI" },
  "hsbc-msci-world-islamic-screened": { stufe: "prospekt", text: "Index geprüft, MSCI" },
  "hsbc-msci-usa-islamic-screened": { stufe: "prospekt", text: "Index geprüft, MSCI" },
  "hsbc-msci-europe-islamic-screened": { stufe: "prospekt", text: "Index geprüft, MSCI" },
  "hsbc-msci-emerging-markets-islamic-screened-capped": { stufe: "prospekt", text: "Index geprüft, MSCI" },
  "invesco-dow-jones-islamic-global-developed-markets": { stufe: "aelter", text: "Zertifikat für 2023, Amanie" },
  "comgest-growth-europe-s-eur-acc": { stufe: "prospekt", text: "Gremium laut Prospekt, Amanie" },
  "ishares-usd-sukuk-ucits-etf": { stufe: "prospekt", text: "Fatwa laut Prospekt, Amanie" },
  "xtrackers-ii-salam-usd-global-aggregate-sukuk": { stufe: "prospekt", text: "Berater laut Prospekt, ASB" },
  "bnp-paribas-islamic-fund-hilal-income-classic-c": { stufe: "aelter", text: "Komitee im Bericht von 2020" },
  "invesco-physical-gold-etc": { stufe: "aktuell", text: "Jahreszertifikat 2025, Amanie" },
  "wisdomtree-physical-gold": { stufe: "aktuell", text: "Prüfbericht 2026, Al-Qalam" },
  "wisdomtree-core-physical-gold": { stufe: "aktuell", text: "Prüfbericht 2026, Al-Qalam" },
  "wisdomtree-physical-swiss-gold": { stufe: "aktuell", text: "Prüfbericht 2026, Al-Qalam" },
  "invesco-physical-silver": { stufe: "aktuell", text: "Jahreszertifikat 2025, Amanie" },
  "wisdomtree-physical-silver": { stufe: "aktuell", text: "Prüfbericht 2026, Al-Qalam" },
  "wisdomtree-core-physical-silver": { stufe: "aktuell", text: "Prüfbericht 2026, Al-Qalam" },
  "royal-mint-responsibly-sourced-physical-gold": { stufe: "aktuell", text: "Jahreszertifikat 2025, Amanie" },
};
