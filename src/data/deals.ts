/**
 * Hier werden alle aktiven Deals gepflegt.
 * Neue Angebote nur hier eintragen; die Seite rendert sie automatisch.
 */

export interface Deal {
  /** Kurzname des Anbieters, lesbar */
  anbieter: string;
  /** Titel der Aktion */
  titel: string;
  /** Kurze Beschreibung des Vorteils */
  vorteil: string;
  /** Gutscheincode, falls vorhanden */
  gutscheincode?: string;
  /** Bedingungen in Kurzform */
  bedingungen: string;
  /** Verweis auf src/data/partnerLinks.ts */
  partnerKurzname?: string;
  /** ISO-Datum, bis wann der Deal läuft */
  gueltigBis?: string;
}

/** Aktuell sind keine Deals hinterlegt. Sobald welche vorhanden sind, erscheinen sie auf /deals. */
export const deals: Deal[] = [];
