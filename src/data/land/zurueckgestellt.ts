/**
 * Zurückgestellte Anbieter der Länderversionen (DACH1, Prüfung 2, 23.11.2026). Regelbuch anbieter-und-partner.md, Gilt:
 * „Fehlen Infos zu einem Anbieter, bleibt er erstmal draußen“ und „Erst die Belege holen, dann kann es rein.“ Die Daten
 * bleiben in `oesterreich.ts`, `partnerLinks.ts` und `investmentStart.ts` stehen. Ein Eintrag hier nimmt den Anbieter aus
 * jeder öffentlichen Liste, schaltet seinen Partnerlink ab und seine Startseite aus. Kommt der Beleg, löscht eine Zeile
 * hier den Eintrag, und der Anbieter steht wieder an seinem Platz in `reihenfolge`.
 *
 * Diese Datei importiert nichts, damit Partnerlinks, Startseiten und Länderlisten sie ohne Kreis lesen können.
 */
export type Zurueckgestellt = {
  /** IDs in den Länderlisten (`src/data/land/*.ts`). */
  ids: string[];
  /** Kurznamen in `partnerLinks.ts` und `investmentStart.ts`, die mit ihm ausgehen. */
  kurznamen: string[];
  /** Welcher Beleg fehlt. */
  grund: string;
  /** Was offen ist, damit er wieder reinkommt (Mail-Nummer in mails-entwuerfe.md im Arbeitsordner DACH1). */
  offen: string;
};

export const ZURUECKGESTELLT: Zurueckgestellt[] = [
  { ids: ["scalable-capital-depot-at"], kurznamen: ["scalable-at"], grund: "Zins auf dem Verrechnungskonto in Österreich ohne Anbieter-Beleg", offen: "Mail 4 an Scalable offen" },
  { ids: ["easybank-depot-at"], kurznamen: ["easybank-depot-at"], grund: "Halal-ETFs, Sukuk und Royal Mint ohne Kaufbeleg", offen: "Mail 6 an easybank offen" },
  { ids: ["easybank-easy-gratis-at"], kurznamen: ["easybank-girokonto-at"], grund: "Überziehungsrahmen ab Start ohne Beleg", offen: "Mail 6 an easybank offen" },
  { ids: ["dadat-depot-at"], kurznamen: [], grund: "Halal-ETFs, Sukuk und Royal Mint ohne Kaufbeleg", offen: "Mail 7 an DADAT offen" },
  { ids: ["bank99-smartkonto99-at"], kurznamen: [], grund: "Überziehungsrahmen ab Start ohne Beleg (Konditionenblatt nennt 9,99 % Sollzins)", offen: "Frage an bank99 (recherche-at.md Abschnitt 7) noch nicht geschickt" },
  { ids: ["bawag-kontobox-small-at"], kurznamen: [], grund: "Überziehungsrahmen ab Start und Debitkarte ohne Beleg", offen: "Mail 11 an BAWAG offen" },
  { ids: ["trade-republic-krypto-at"], kurznamen: [], grund: "Echte Coins, Auszahlung auf eigene Wallet und Bezahlmodell für Österreich ohne Beleg", offen: "Mail 2 an Trade Republic offen, die Krypto-Fragen dort ergänzen" },
];

const IDS = new Set(ZURUECKGESTELLT.flatMap((z) => z.ids));
const KURZNAMEN = new Set(ZURUECKGESTELLT.flatMap((z) => z.kurznamen));

/** Steht dieser Anbieter einer Länderliste gerade nicht auf der Seite? */
export const idZurueckgestellt = (id: string): boolean => IDS.has(id);

/** Sind Partnerlink und Startseite dieses Kurznamens gerade abgeschaltet? */
export const kurznameZurueckgestellt = (kurzname: string): boolean => KURZNAMEN.has(kurzname);
