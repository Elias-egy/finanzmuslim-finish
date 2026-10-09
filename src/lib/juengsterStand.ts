const DATUM = /^(\d{2})\.(\d{2})\.(\d{4})$/;

const alsZahl = (datum: string): number => {
  const m = DATUM.exec(datum);
  return m ? Number(`${m[3]}${m[2]}${m[1]}`) : 0;
};

const sammle = (wert: unknown, funde: string[]): void => {
  if (Array.isArray(wert)) {
    wert.forEach((w) => sammle(w, funde));
    return;
  }
  if (!wert || typeof wert !== "object") return;
  for (const [schluessel, inhalt] of Object.entries(wert)) {
    if (schluessel === "stand" && typeof inhalt === "string" && DATUM.test(inhalt)) funde.push(inhalt);
    else sammle(inhalt, funde);
  }
};

/**
 * Jüngstes Prüfdatum in den Daten eines Vergleichs: jeder Beleg trägt sein `stand` (TT.MM.JJJJ).
 * Die Zeile „Stand“ über der Tabelle folgt damit dem letzten Beleg statt einem festen Datum.
 * `mindestens` ist der Tag des Datenimports und gilt, solange kein Beleg jünger ist.
 */
export const juengsterStand = (anbieter: unknown, mindestens: string): string => {
  const funde: string[] = [];
  sammle(anbieter, funde);
  return funde.reduce((juengster, d) => (alsZahl(d) > alsZahl(juengster) ? d : juengster), mindestens);
};
