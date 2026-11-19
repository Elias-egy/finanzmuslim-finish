/**
 * Was zu jeder Anlage belegt vorliegt, in einer kurzen Zeile (Halal-Prüfer r1 und r2, 31.10.2026: die
 * Überschrift darf nicht alle 22 gleich hinstellen, und keine Zeile behauptet ein Fehlen, das sich nicht
 * zeigen lässt). Drei Stufen nach dem jüngsten gelesenen Dokument, nie ein eigenes Urteil:
 * „aktuell“ = Zertifikat oder Prüfbericht für genau dieses Produkt aus 2025 oder 2026; „prospekt“ = Fatwa,
 * Gremium oder Berater laut Prospekt, oder der Index ist geprüft; „aelter“ = jüngster gefundener Nachweis
 * gilt für 2023 oder früher (Halal-Prüfer r3: „letzter“ behauptet ein Fehlen). Beleg je Zeile in `halalAnlagen.ts` (zertifikatHinweis, zertifikatLink) und in
 * `pruefung/halal-anlagen-liste-r2.md` im Vault; der Test prüft, dass jede Karte eine Zeile hat.
 * RN19 (Halal-Prüfer, 19.11.2026): Was der Nachweis nicht trägt, steht jetzt auch in Antwortsatz, Meta und FAQ-Schema
 * (Feld `grenze`), nicht nur im Abschnitt „Halal-Nachweis im Detail“. Wo es keine Prüfstelle gibt (nur ein Berater im
 * Prospekt), sagt das Feld `ohnePruefstelle`, und `rolle` und `faqFrage` nennen die Stelle bei ihrem echten Namen.
 * Eigene Datei seit MC7d13d, weil auch die Anlage-Seite diese Zeile zeigt (Halal-Prüfer r2, Fund 9: dort stand
 * „liegt vor“ auch bei Prospekt und Bericht von 2020).
 */
export type Stufe = "aktuell" | "prospekt" | "aelter";

export type NachweisZeile = {
  stufe: Stufe;
  /** Der Nachweis in einer Zeile, für Liste, Karte und Abschnitt Halal. Sagt nichts über ein Fehlen (Test in anlagenListe.test.ts). */
  text: string;
  /** Was der Nachweis nicht trägt, wörtlich im Antwortsatz, in der Meta und im FAQ-Schema. Beginnt klein, endet ohne Punkt. */
  grenze?: string;
  /** Name der Stelle statt „Prüfstelle“: Überschrift im Abschnitt Halal, Eigenschaft im Schema, Frage im FAQ. */
  rolle?: string;
  /** true, wo die Daten nur einen Berater oder ein Gremium im Prospekt nennen, aber keine Stelle, die eingestuft hat. */
  ohnePruefstelle?: boolean;
  /** Eigene FAQ-Frage statt „Wer hat {name} geprüft?“, `{name}` wird ersetzt. Mit `faqAntwort` zusammen. */
  faqFrage?: string;
  faqAntwort?: string;
};

const MSCI_INDEX: NachweisZeile = {
  stufe: "prospekt",
  text: "Index folgt der MSCI-Islamic-Methodik",
  grenze: "für den Fonds selbst haben wir kein Zertifikat gefunden",
  rolle: "Index geprüft von",
  faqFrage: "Wer hat den Index von {name} geprüft?",
  faqAntwort:
    "Die Methodik des Index hat MSCIs eigener Sharia-Gelehrtenausschuss freigegeben, die Indexwerte werden vierteljährlich bescheinigt. MSCI ist zugleich der Indexanbieter. Für den Fonds selbst haben wir kein Zertifikat gefunden.",
};

const ISHARES_PANEL: NachweisZeile = {
  stufe: "prospekt",
  text: "Fatwa laut Prospekt, iShares-Panel",
  grenze: "ein ausgestelltes Zertifikat haben wir nicht gefunden",
};

const WISDOMTREE: NachweisZeile = { stufe: "aktuell", text: "Prüfbericht 2026, Al-Qalam" };

export const NACHWEIS: Record<string, NachweisZeile> = {
  "ishares-msci-world-islamic": ISHARES_PANEL,
  "ishares-msci-emerging-markets-islamic": ISHARES_PANEL,
  "ishares-msci-usa-islamic": ISHARES_PANEL,
  "hanetf-saturna-al-kawthar-global-focused-equity": { stufe: "aktuell", text: "Jahreszertifikat 2025, Amanie" },
  "franklin-shariah-technology-fund-a-acc-usd": { stufe: "aktuell", text: "Jahresbericht 2025, Amanie" },
  "invesco-msci-acwi-islamic-m-series": MSCI_INDEX,
  "hsbc-msci-world-islamic-screened": MSCI_INDEX,
  "hsbc-msci-usa-islamic-screened": MSCI_INDEX,
  "hsbc-msci-europe-islamic-screened": MSCI_INDEX,
  "hsbc-msci-emerging-markets-islamic-screened-capped": MSCI_INDEX,
  "invesco-dow-jones-islamic-global-developed-markets": {
    stufe: "aelter",
    text: "Zertifikat für 2023, Amanie",
    grenze: "ein neueres haben wir nicht gefunden",
  },
  "comgest-growth-europe-s-eur-acc": {
    stufe: "prospekt",
    text: "Prospekt nennt Amanie als Shariah-Board",
    grenze: "ein eigenes Zertifikat haben wir nicht gefunden",
    rolle: "Shariah-Board laut Prospekt",
    faqFrage: "Wer ist das Shariah-Board von {name}?",
    faqAntwort: "Laut Verkaufsprospekt Amanie Advisors (Shariah Supervisory Board). Ein eigenes Zertifikat haben wir nicht gefunden.",
  },
  "ishares-usd-sukuk-ucits-etf": {
    stufe: "prospekt",
    text: "Fatwa laut Prospekt, iShares-Sukuk-Panel mit Amanie-Mitgliedern",
    grenze: "ein Zertifikat haben wir nicht gefunden",
  },
  "xtrackers-ii-salam-usd-global-aggregate-sukuk": {
    stufe: "prospekt",
    text: "Prospekt nennt ASB Capital als Shari'a-Berater",
    grenze: "weder Zertifikat noch Fatwa gefunden",
    ohnePruefstelle: true,
    rolle: "Shari'a-Berater laut Prospekt",
    faqFrage: "Wer berät zur Shari'a bei {name}?",
    faqAntwort: "Laut Verkaufsprospekt ASB Capital als Shari'a-Berater. Ein Zertifikat oder eine Fatwa haben wir nicht gefunden.",
  },
  "bnp-paribas-islamic-fund-hilal-income-classic-c": {
    stufe: "aelter",
    text: "Sharia-Komitee im Halbjahresbericht 2020",
    grenze: "eine neuere Bestätigung haben wir nicht gefunden",
  },
  "invesco-physical-gold-etc": { stufe: "aktuell", text: "Jahreszertifikat 2025, Amanie" },
  "wisdomtree-physical-gold": WISDOMTREE,
  "wisdomtree-core-physical-gold": WISDOMTREE,
  "wisdomtree-physical-swiss-gold": WISDOMTREE,
  "invesco-physical-silver": { stufe: "aktuell", text: "Jahreszertifikat 2025, Amanie" },
  "wisdomtree-physical-silver": WISDOMTREE,
  "wisdomtree-core-physical-silver": WISDOMTREE,
  "royal-mint-responsibly-sourced-physical-gold": { stufe: "aktuell", text: "Jahreszertifikat 2025, Amanie" },
};
