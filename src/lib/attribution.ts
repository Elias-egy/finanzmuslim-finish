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
  // Knopf in Mails ohne eigene Kennung (~/rebrand/mails/bauen.py)
  "mail",
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
  // Top 3 im Anfänger-Guide (MC7g, 02.11.2026), gleicher Block wie im Blueprint (xxlnr1, xxltop3).
  "g1nr1",
  "g1top3",
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
  // Wort sukuk in ManyChat (MC7g, 02.11.2026), Ablauf baut MC8b; dmnachsukuk ist der Teste-dich-Link im Nachfass.
  // Kein dmguide plus Wort: ?src an einem PDF-Link zählt die Seite nicht, beim Öffnen eines PDFs läuft kein Code von ihr.
  "dmsukuk",
  "dmnachsukuk",
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
  "ksukuk",
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
  // MC7d17: zwei kleine Aufrufe in „Dua für jede Situation“ (Wort AMIN), src/pages/vorlagen/RizqVoll.tsx; ersetzen
  // amtop3, amnr1, amalle aus MC7d16 (nie live).
  "amgiro",
  "amdepot",
  // MC7f: Sukuk-Plan (Wort SUKUK), src/pages/SukukPlan.tsx; ersetzen gdsktop3 und gdskalle aus MC7d16 (nie live).
  "sktop3",
  "skalle",
  "skkarte",
  // H15 5c: Girokonto-Unterseite /vorlagen/girokonto-bonus, je Stelle (src/data/girokontoBonus.ts GIRO_BONUS_SRC).
  "gbkopf",
  "gbwarum",
  "gbnoris",
  "gbconsors",
  "gballe",
  // Mail D1 der Duas-Kette (Knopf Girokonto-Vergleich, ~/rebrand/mails/bauen.py), live seit 06.11.2026 (CV15F)
  "d1",
] as const;

/**
 * Familien, die ohne Eintrag oben gelten (CV4, 04.11.2026): dm plus Wort (Instagram-DM), fb plus Wort (Facebook),
 * ml plus Wort (je Mail), m, g, v plus Ziffer und Wort (Mails, Guides, Vorlagen). Vorher fielen v2, g0, fb0, m2
 * und g3fertig aus ~/rebrand/mails/bauen.py still auf „start“, und jedes neue ManyChat-Wort brauchte einen Eintrag.
 * Nur Kleinbuchstaben und Ziffern, höchstens 20 Zeichen: Scalable nimmt als SubID nichts anderes, und die
 * Endung h, f oder s für den Knopf kommt noch dazu.
 */
// nl plus Datum ohne Bindestriche: Halal-News (~/rebrand/mails/brief.py mit_src), seit 06.11.2026 (CV15F).
export const QUELLEN_FAMILIE = /^(?:dm|fb|ml|nl|[mgv][0-9])[a-z0-9]{0,18}$/;

export const istGueltigeQuelle = (src: string | null | undefined): src is string =>
  !!src && ((VALID_SRC as readonly string[]).includes(src) || QUELLEN_FAMILIE.test(src));

export const SRC_STORAGE_KEY = "amanah_src";
/** Die zuletzt geklickte Stelle auf unserer Seite (Freebie-Knopf, Bonus-Karte), getrennt von der Herkunft. */
export const STELLE_STORAGE_KEY = "fm_stelle";

/**
 * Herkunft = woher die Person kam (DM, Mail, Newsletter, Bio, PDF); Stelle = welcher Knopf auf unserer Seite.
 * Vorher schrieb jede Stelle ihre Kennung über die Herkunft: Wer aus der DM „liste“ kam und auf der Bonus-Seite
 * klickte, stand beim Partner als „gbconsors“, nie als „dmliste“ (Hermes, PRUEFUNG-2 Befund B, BERICHT R10).
 * Seit CV16F (07.11.2026) bleibt die Herkunft stehen, die Stelle wird angehängt: dmliste + gbkopf = dmlistegbkopf.
 */
const HERKUNFT = new Set<string>(["g1", "g2", "g3", "m1", "m2", "m3", "dm", "dmstart", "bio", "yt", "qr", "mail", "pdf", "d1"]);

export const istHerkunft = (src: string | null | undefined): src is string =>
  istGueltigeQuelle(src) && (HERKUNFT.has(src) || QUELLEN_FAMILIE.test(src));

/** SubID aus Herkunft plus Stelle, höchstens 19 Zeichen, damit die Endung h, f, s oder d noch unter 20 bleibt. */
export const subIdAus = (quelle: string | null | undefined, stelle: string | null | undefined): string => {
  const q = istHerkunft(quelle) ? quelle : null;
  const s = istGueltigeQuelle(stelle) && !istHerkunft(stelle) ? stelle : null;
  return (q && s ? q + s : (q ?? s ?? "start")).slice(0, 19);
};

/** Nimmt ein ?src auf: Herkunft ersetzt die Herkunft und löscht die alte Stelle, eine Stelle lässt die Herkunft stehen. */
export const herkunftAufnehmen = (src: string | null | undefined): void => {
  if (!istGueltigeQuelle(src) || src === "start") return;
  try {
    if (istHerkunft(src)) {
      sessionStorage.setItem(SRC_STORAGE_KEY, src);
      sessionStorage.removeItem(STELLE_STORAGE_KEY);
    } else {
      sessionStorage.setItem(STELLE_STORAGE_KEY, src);
    }
  } catch {
    /* ohne Storage gilt die Kennung nur für diesen Aufruf */
  }
};

/** Die gemerkte Stelle dieser Sitzung, oder null. */
export const gemerkteStelle = (): string | null => {
  try {
    return sessionStorage.getItem(STELLE_STORAGE_KEY);
  } catch {
    return null;
  }
};

/** SubID aus dem, was diese Sitzung gemerkt hat (ohne Endung). */
export const aktuelleSubId = (): string => subIdAus(gemerkteQuelle(), gemerkteStelle());
/** utm_campaign aus Mail-Links (MailerLite), als Eigenschaft „mail_kampagne“ in der Messung. */
export const KAMPAGNE_STORAGE_KEY = "fm_kampagne";

/** Liest ?src aus der aktuellen URL und speichert es (nur Whitelist-Werte). */
export const captureSrc = (): void => {
  try {
    herkunftAufnehmen(new URLSearchParams(window.location.search).get("src"));
    const kampagne = new URLSearchParams(window.location.search).get("utm_campaign");
    if (kampagne) sessionStorage.setItem(KAMPAGNE_STORAGE_KEY, kampagne.slice(0, 80));
  } catch {
    /* sessionStorage kann in strengen Browsern blockiert sein — dann greift der Fallback "start". */
  }
};

/** Die gemerkte Mail-Kampagne dieser Sitzung, oder null. */
export const gemerkteKampagne = (): string | null => {
  try {
    return sessionStorage.getItem(KAMPAGNE_STORAGE_KEY);
  } catch {
    return null;
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
