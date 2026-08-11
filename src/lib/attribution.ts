// Zentrale Traffic-Quellen-Attribution (SubID).
// Vorher las NUR InvestmentStart den ?src-Parameter. Wer über
// /halal-guide?src=bio einstieg und über den Erfolgsscreen zum Investmentstart
// weiterklickte, verlor die Quelle -> SubID fiel auf "start" (F3 im Systemaudit).
// Diese Helfer capturen ?src global auf JEDER Route in sessionStorage; die
// bestehende useSubId-Logik in InvestmentStart liest den gespeicherten Wert
// weiterhin als Fallback.
//
// Hinweis: VALID_SRC spiegelt bewusst die Whitelist in InvestmentStart.tsx.
// Bei Änderungen beide Stellen synchron halten.
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
] as const;

export const SRC_STORAGE_KEY = "amanah_src";

/** Liest ?src aus der aktuellen URL und speichert es (nur Whitelist-Werte). */
export const captureSrc = (): void => {
  try {
    const param = new URLSearchParams(window.location.search).get("src");
    if (param && (VALID_SRC as readonly string[]).includes(param)) {
      sessionStorage.setItem(SRC_STORAGE_KEY, param);
    }
  } catch {
    /* sessionStorage kann in strengen Browsern blockiert sein — dann greift der Fallback "start". */
  }
};
