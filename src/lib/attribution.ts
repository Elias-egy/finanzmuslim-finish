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
