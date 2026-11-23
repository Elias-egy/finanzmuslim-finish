/**
 * Höchstpunktzahl je Finanzkriterium, nach der Punktetabelle von Finanzfluss, für die Rangfolge.
 *
 * Die Werte stehen auch in den erzeugten Datendateien (`brokerVergleich.ts`, `girokontoVergleich.ts`,
 * `kryptoVergleich.ts`, erzeugt von ~/rebrand/data/vergleiche/bauen.py). Hier stehen sie noch einmal
 * klein, damit die Rangfolge nicht alle Vergleiche auf jede Seite zieht (UP6, 10.11.2026: die
 * Depot-Seite lud sonst Edelmetall, Anlagen kaufbar, Girokonto, Krypto und Steuer-Apps mit).
 * `finanzMax.test.ts` prüft, dass beide gleich sind; ändert der Generator einen Wert, schlägt er an.
 */
export const DEPOT_FINANZ_MAX: Record<string, number> = {"depotgebuehr": 16, "etfSparplanProzent": 6, "etfSparplanPauschal": 4, "orderProzent": 3, "orderPauschal": 6, "mindestsparrate": 3, "maximalsparrate": 1, "intervalle": 2.5, "handelsplaetze": 2, "kapest": 9, "kundenservice": 5, "app": 5};

export const GIRO_FINANZ_MAX: Record<string, number> = {"kontofuehrung": 15, "bankkarte": 10, "girocard": 5, "debitkarte": 5, "abheben": 5, "einzahlen": 3, "mobilesBezahlen": 8, "sepa": 10, "support": 5, "kontowechsel": 2, "app": 2, "ident": 2, "ohneBedingung": 4, "ausland": 12};

/**
 * Geschäftskonto (VG2, 23.11.2026): Höchstpunkte der Kosten nach dem Schema von Finanzfluss, ohne Tagesgeld (Zinsprodukte zählen bei uns
 * nie). Von Hand gepflegt, steht in keiner erzeugten Datei. Die Rechnung dazu: `geschaeftskontoKosten.ts`.
 */
export const GESCHAEFT_FINANZ_MAX: Record<string, number> = {"kontofuehrung": 40, "kostenBuchung": 20, "freieBuchungen": 16, "abheben": 10, "einzahlen": 8, "debitkarte": 20, "unterkonten": 11, "buchhaltung": 7, "einlagensicherung": 18};

export const KRYPTO_FINANZ_MAX: Record<string, number> = {"gebuehren": 100, "transparenz": 100, "transferkosten": 70, "sicherheit": 50, "verifizierung": 60, "bezahlmethoden": 50, "mica": 30, "sparplan": 20, "mindestbetrag": 20};

/**
 * Kosten für den Kauf eines Papiers: die Kriterien des Depot-Vergleichs ohne die Sparplan-Zeilen.
 * Ob ein ETC sparplanfähig ist, steht in keinem Beleg, also zählt es hier nicht.
 */
export const EDELMETALL_FINANZ_MAX: Record<string, number> = Object.fromEntries(
  ["depotgebuehr", "orderProzent", "orderPauschal", "handelsplaetze", "kapest", "kundenservice", "app"].map((k) => [k, DEPOT_FINANZ_MAX[k]]),
);
