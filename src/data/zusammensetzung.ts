/**
 * Zusammensetzung der Anlagen: größte Positionen, Länder, Branchen.
 *
 * WICHTIG: Hier stehen ausschließlich Werte, die aus dem Factsheet oder dem
 * Monatsbericht des Anbieters abgeschrieben wurden, mit Datum und Quelle.
 * Nichts schätzen, nichts aus einer allgemeinen Marktdaten-Schnittstelle
 * übernehmen. Eine Anlage ohne Eintrag zeigt auf der Seite einen sachlichen
 * Hinweis, keine Nullbalken.
 *
 * Pflege: etwa vierteljährlich, wenn die Anbieter neue Factsheets
 * veröffentlichen. Der Aufbau ist bewusst so einfach, dass eine spätere
 * CSV-Einspielung nur diese Datei erzeugen muss.
 */

export type Posten = { label: string; anteil: number };

export type Zusammensetzung = {
  /** Datum des Factsheets, nicht das Datum des Eintragens. */
  stand: string;
  quelle: string;
  positionen?: Posten[];
  laender?: Posten[];
  branchen?: Posten[];
};

/** Schlüssel ist die ISIN. Noch leer, siehe Kopfkommentar. */
export const zusammensetzungen: Record<string, Zusammensetzung> = {};

export const zusammensetzungFuer = (isin: string): Zusammensetzung | undefined =>
  zusammensetzungen[isin];

/**
 * Warum bei dieser Anlage keine Positionsliste steht. Der Grund hängt am
 * Produkttyp, nicht am Zufall: Ein Goldbarren im Tresor hat keine Positionen.
 */
export const grundOhneZusammensetzung = (
  kategorie: string,
  replikation: string,
): string => {
  if (kategorie === "gold" || kategorie === "silber") {
    return "Dieses Produkt hält ein einziges Metall, physisch hinterlegt. Eine Aufteilung nach Positionen, Ländern oder Branchen gibt es hier nicht.";
  }
  if (replikation.toLowerCase().includes("synthetisch")) {
    return "Der Fonds bildet den Index über ein Tauschgeschäft nach und hält die Wertpapiere nicht selbst. Eine Positionsliste ist deshalb wenig aussagekräftig.";
  }
  if (kategorie === "sukuk") {
    return "Die Liste der einzelnen Sukuk tragen wir gerade aus dem Monatsbericht des Anbieters zusammen.";
  }
  return "Die größten Positionen tragen wir gerade aus dem Factsheet des Anbieters zusammen. Erst wenn Datum und Quelle feststehen, steht es hier.";
};
