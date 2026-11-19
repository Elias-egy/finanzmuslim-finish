/**
 * Links für den Wechsel in den Produktdetails des Depot-Vergleichs (PH1-04, Elias 15.11.2026: „mindestens dieses
 * Antrag, Übernahmeantrag und schriftliche Verzicht … in die Produktdetails packst. Das kannst du auch bei Smart Broker
 * mit den Übergabeantrag … Dass du da ein, zwei Links drin hast“; Vault
 * raw/2026-11-15-elias-ph1-04-produktdetails-uebertragsantrag-verzicht-links.md). Grund: Die Video-Zwischenseite
 * /dein-investmentstart/<partner>, die diese Links bisher trug, fällt mit dem Direktlink weg.
 *
 * Jede Adresse steht so auf der Seite des Anbieters (gelesen 15.11.2026), nichts ist erfunden.
 */

/**
 * Text für den Verzicht auf den flex-Kredit. flatex: „Für Neukunden mit Kontoeröffnung automatisch; eine Antragstellung
 * ist nicht notwendig“ und „Wenn Sie auf die Vorteile des … Dispositionsrahmens verzichten möchten, teilen Sie uns dies
 * bitte in Textform mit“ (flatex.de/produkte-handel/produkte/wertpapierkredite, gelesen 07.11. und 15.11.2026). Kunden
 * schreiben über „Kontaktanfrage in Ihrer Anwendung im Benutzermenü unter dem Menüpunkt Support“ (flatex.de/service/kontakt).
 */
export const FLATEX_VERZICHT = {
  betreff: "Verzicht auf den flex-Kredit",
  text: [
    "Guten Tag,",
    "",
    "ich verzichte auf den Dispositionsrahmen (flex-Kredit) für mein Konto. Bitte richten Sie für mein Konto keine Kreditlinie ein und bestätigen Sie mir das kurz.",
    "",
    "Name:",
    "Kontonummer:",
    "",
    "Vielen Dank",
  ].join("\n"),
  weg: "In der flatex-App: Benutzermenü, Support, Kontaktanfrage",
};

export type WechselLink = { titel: string; text: string; url: string };

export type WechselUnterlagen = {
  /** Kurzname für die Messung (wie auf der Video-Seite). */
  kurzname: string;
  links: WechselLink[];
  /** Nur flatex: fertiger Verzichtstext zum Kopieren. */
  kreditVerzicht?: boolean;
};

/** Schlüssel ist die id im Depot-Vergleich (`src/data/brokerVergleich.ts`). */
export const WECHSEL_UNTERLAGEN: Record<string, WechselUnterlagen> = {
  "flatex-depot": {
    kurzname: "flatex",
    links: [
      {
        // flatex.de/service/formulare, „Formulare allgemein“, Nr. 1: „Konto-/Depotübertrag an die flatexDEGIRO Bank SE“.
        // Ausfüllen, unterschreiben, an die alte Bank. flatex kennt kein Online-Verfahren für den Übertrag zu flatex.
        titel: "Depotübertrag",
        text: "Antrag von flatex (PDF)",
        url: "https://konto.flatex.de/formularcenter/public/1300002.pdf",
      },
    ],
    kreditVerzicht: true,
  },
  "smartbroker-plus-depot": {
    kurzname: "smartbroker",
    links: [
      {
        // smartbrokerplus.de/de-de/depotuebertrag: „Komplett digital in deiner App“, Knopf „Jetzt Depot übertragen“ führt
        // in den eingeloggten Bereich (app.smartbrokerplus.de/profile/depot-transfer). Ein PDF gibt es nur für den
        // Übertrag aus dem Ausland. Darum die Seite des Anbieters, sie funktioniert auch ohne Konto.
        titel: "Depotübertrag",
        text: "Antrag in der App, so geht's",
        url: "https://www.smartbrokerplus.de/de-de/depotuebertrag/",
      },
    ],
  },
};
