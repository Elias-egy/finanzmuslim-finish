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
  /**
   * Bonus in Euro, den ein Neukunde bekommt. Nur eintragen, wenn der Betrag auf
   * der Seite des Anbieters steht. Der geführte Vergleich zeigt daraus oben
   * "Bonus für dich bis zu ...".
   */
  betrag?: number;
  /** `id` der Anbieter aus den Vergleichsdateien, für die der Deal gilt, z. B. "dkb-girokonto". */
  anbieterIds?: string[];
  /** Seite des Anbieters, auf der die Aktion steht, und Prüfdatum. Pflicht, sobald `betrag` gesetzt ist. */
  quelle?: { url: string; stand: string };
}

/** Aktuell sind keine Deals hinterlegt. Sobald welche vorhanden sind, erscheinen sie auf /deals. */
export const deals: Deal[] = [];

/** Höchster belegter Bonus unter den genannten Anbietern. Abgelaufene Deals zählen nicht. */
export const hoechsterBonus = (anbieterIds: Set<string>, heute: string, liste: Deal[] = deals): number =>
  liste
    .filter((d) => d.betrag && d.quelle && (!d.gueltigBis || d.gueltigBis >= heute))
    .filter((d) => d.anbieterIds?.some((id) => anbieterIds.has(id)))
    .reduce((max, d) => Math.max(max, d.betrag!), 0);
