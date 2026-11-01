// Zentrale Traffic-Quellen-Attribution (SubID).
// Vorher las NUR InvestmentStart den ?src-Parameter. Wer über
// /halal-guide?src=bio einstieg und über den Erfolgsscreen zum Investmentstart
// weiterklickte, verlor die Quelle -> SubID fiel auf "start" (F3 im Systemaudit).
// Diese Helfer capturen ?src global auf JEDER Route in sessionStorage; die
// bestehende useSubId-Logik in InvestmentStart liest den gespeicherten Wert
// weiterhin als Fallback.
//
// InvestmentStart.tsx importiert diese Liste, es gibt nur eine.
// Die Freebie-PDFs haengen eigene Kennungen an ihre Links (?src=lstc usw.).
// Fehlt eine hier, faellt der Klick still auf "start" zurueck und im
// Partnerportal ist nicht mehr zu sehen, welches PDF verkauft hat.
export const VALID_SRC = [
  "g1",
  "g2",
  "g3",
  "m1",
  "m2",
  "m3",
  "dm",
  "dmstart",
  "bio",
  "yt",
  "qr",
  "start",
  // Freebie-PDFs, v1 und v2 (~/rebrand/freebies, public/downloads)
  "pdf",
  "top100",
  "liste",
  "lstc",
  "ampel",
  "ampc",
  "check",
  "chkc",
  "baraka",
  "brkc",
  "rizq",
  "rzqc",
  "g1c",
  "g1n",
  "g2c",
  "g2n",
  "g3c",
  "g3n",
  // Grüner Aufruf „Lass Profis dein Geld verwalten“ in den Guides, zum Depot-Vergleich (30.10.2026).
  "g2p",
  "g3p",
  // Instagram-DM auf die Opt-in-Karte (/gratis/<freebie>?src=dm<stichwort>), seit 27.09.2026.
  // Ohne Bindestrich: Scalable nimmt als SubID nur Kleinbuchstaben und Ziffern.
  "dmguide",
  "dmliste",
  "dmaktie",
  "dmampel",
  "dmdua",
  "dmgold",
  // Wort Boykott in ManyChat (BK1, 28.10.2026)
  "dmboykott",
  "dmnachbk",
  "dmauto",
  // Wort invest und Gold-Test-Link in ManyChat (MC3d, 28.10.2026), Lieferungs-Mails der Vorlagen (Knopf ?src=v0).
  "dminvest",
  "dmnachinvest",
  "dmnachgold",
  // Wort etf in ManyChat (MC4e, 28.10.2026)
  "dmetf",
  "dmnachetf",
  "v0",
  // Leiter (MC7d3, 29.10.2026): Bedingungs-Mails M1 und Abbinder M2 (~/rebrand/mails/bauen.py v31), Kasten
  // „Dein nächster Schritt“ am Ende der Freebies (src/components/NaechsterTeil.tsx, k plus Wort).
  "m1plan",
  "m1etf",
  "m1gold",
  "m2gold",
  "kliste",
  "kaktie",
  "kvertrag",
  "kamin",
  "kboykott",
  "kplan",
  "ketf",
  "kgold",
  // XXL-Guide (MC7d7, 30.10.2026): leise Werbung je Thema, ~/rebrand/freebies/xxl.html (xxl plus Wort).
  "xxlgiro",
  "xxlgold",
  "xxlnr1",
  "xxlliste",
  "xxlscreen",
  "xxlprofis",
  "xxlkrypto",
  "xxlsteuer",
  "xxlzakat",
  "xxlende",
  // MC7d10: Top-3-Depots auf Seite 7 und Prüf-Apps auf Seite 11 (Klicks fielen bis dahin aus der Zählung).
  "xxltop3",
  "xxlapps",
  // MC7d13d: die Liste (Wort LISTE), Top 3, Nummer 1, alle Depots, Karte zur Anlage-Seite (src/data/anlagenListe.ts listeLink).
  "gltop3",
  "glnr1",
  "glalle",
  "glkarte",
  // MC7d13d: Depot-Aufruf im Portfolio-Plan (Wort PLAN), src/components/vorlagen/DepotAufruf.tsx.
  "pltop3",
  "plnr1",
  "plalle",
  // MC7d14: Depot-Aufruf in den 100 Halal-Aktien (Wort AKTIE), src/data/top100Aktien.ts aktieLink.
  "aktop3",
  "aknr1",
  "akalle",
  // MC7d15: Depot-Aufruf im Vertrags-Check (Wort VERTRAG), src/pages/vorlagen/VertragsAmpelVoll.tsx.
  "vttop3",
  "vtnr1",
  "vtalle",
  // MC7d15: Girokonto-Aufruf im Plan (Schritt 1) und im Vertrag, src/components/vorlagen/GiroAufruf.tsx.
  "plgtop2",
  "plgalle",
  "vtgtop2",
  "vtgalle",
  // MC7d15: Depot-Aufruf in der ETF-Liste (Wort ETF) und im Gold-Plan (Wort GOLD).
  "eftop3",
  "efnr1",
  "efalle",
  "efkarte",
  "gdtop3",
  "gdnr1",
  "gdalle",
  "gdkarte",
] as const;

export const istGueltigeQuelle = (src: string | null | undefined): src is string =>
  !!src && (VALID_SRC as readonly string[]).includes(src);

export const SRC_STORAGE_KEY = "amanah_src";

/** Liest ?src aus der aktuellen URL und speichert es (nur Whitelist-Werte). */
export const captureSrc = (): void => {
  try {
    const param = new URLSearchParams(window.location.search).get("src");
    if (istGueltigeQuelle(param)) {
      sessionStorage.setItem(SRC_STORAGE_KEY, param);
    }
  } catch {
    /* sessionStorage kann in strengen Browsern blockiert sein — dann greift der Fallback "start". */
  }
};

/** Die zuletzt gemerkte Quelle dieser Sitzung, oder null. */
export const gemerkteQuelle = (): string | null => {
  try {
    return sessionStorage.getItem(SRC_STORAGE_KEY);
  } catch {
    return null;
  }
};
