import { dealsFinanzfluss } from "./dealsFinanzfluss";

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
  /** "Bis 200 €": der volle Betrag hängt an Bedingungen. */
  bisZu?: boolean;
  /** Eigener Text fürs Schild, wenn der Bonus kein Euro-Guthaben ist, z. B. "20 € in BTC". */
  schild?: string;
  /** `id` der Anbieter aus den Vergleichsdateien, für die der Deal gilt, z. B. "dkb-girokonto". */
  anbieterIds?: string[];
  /** Wo der Betrag steht, mit Abrufdatum TT.MM.JJJJ. Pflicht, sobald `betrag` gesetzt ist. */
  quelle?: { url: string; stand: string };
}

/**
 * Nur Boni, die beim Anbieter selbst nachgeprüft sind (Quelle ist dessen Seite).
 * Elias, 20.09.2026: "Laut Finanzfluss ist keine Quelle." `dealsFinanzfluss.ts` ist
 * deshalb nur noch die Prüfliste: welche Aktionen es laut Finanzfluss gibt. Ein Bonus
 * wandert erst hierher, wenn er beim Anbieter bestätigt ist.
 */
export const deals: Deal[] = [];

/** Prüfliste, wird nicht angezeigt. */
export const dealsZuPruefen = dealsFinanzfluss;

/** Ein Abruf gilt 21 Tage. Danach verschwindet der Bonus, bis neu abgerufen wurde. */
export const FRISCH_TAGE = 21;

const tageSeit = (stand: string, heute: string) => {
  const [t, m, j] = stand.split(".").map(Number);
  return (Date.parse(heute) - Date.UTC(j, m - 1, t)) / 86_400_000;
};

const laeuft = (d: Deal, tag: string) =>
  !!d.betrag && !!d.quelle && (!d.gueltigBis || d.gueltigBis >= tag) && tageSeit(d.quelle.stand, tag) <= FRISCH_TAGE;

/** Text fürs Schild: "bis zu 200 € Bonus", "20 € in BTC", "120 € Bonus". */
export const schildText = (d: Deal) =>
  d.schild ?? `${d.bisZu ? "bis zu " : ""}${d.betrag!.toLocaleString("de-DE")} € Bonus`;

/** Höchster belegter Bonus unter den genannten Anbietern. Abgelaufene Deals zählen nicht. */
export const hoechsterBonus = (anbieterIds: Set<string>, heute: string, liste: Deal[] = deals): number =>
  liste
    .filter((d) => laeuft(d, heute))
    .filter((d) => d.anbieterIds?.some((id) => anbieterIds.has(id)))
    .reduce((max, d) => Math.max(max, d.betrag!), 0);

const heute = () => new Date().toISOString().slice(0, 10);

/** Der laufende, belegte Deal eines Anbieters, sonst null. Gibt es mehrere, gewinnt der höchste Betrag. */
export const dealFuer = (anbieterId: string, liste: Deal[] = deals, tag: string = heute()): Deal | null =>
  liste
    .filter((d) => laeuft(d, tag) && d.anbieterIds?.includes(anbieterId))
    .sort((a, b) => b.betrag! - a.betrag!)[0] ?? null;
