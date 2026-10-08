/**
 * Zusammensetzung der Anlagen: größte Positionen, Länder, Branchen.
 *
 * WICHTIG: Hier stehen ausschließlich Werte, die aus dem Factsheet oder dem
 * Monatsbericht des Anbieters abgeschrieben wurden, mit Datum und Quelle.
 * Nichts schätzen, nichts aus einer allgemeinen Marktdaten-Schnittstelle
 * übernehmen. Eine Anlage ohne Eintrag zeigt den Abschnitt auf der Seite nicht.
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
