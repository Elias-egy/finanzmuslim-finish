import type { Kategorie } from "@/data/halalAnlagen";
import type { KaufbarAnzeige } from "@/components/anlage/KaufbarListe";

/**
 * Der offene Ausschnitt der Vorlage „Halal-Anlagen“. Bewusst ohne Laufzeit-Import aus
 * `anlagenKaufbar.ts` und `halalAnlagenKauf.ts`: Die offene Seite zeigt die Anzahl je Gruppe und
 * drei Anlagen mit ihren Häusern, die ganze Kauf-Tabelle lädt erst die volle Fassung. Ein Test
 * rechnet jede Zahl hier aus den Daten nach.
 */

export { ANZAHL_KAUFBAR } from "@/data/halalAnlagenZahl";

export const gruppen: { kategorie: Kategorie; titel: string; anzahl: number }[] = [
  { kategorie: "aktien", titel: "Aktien-ETFs und Fonds", anzahl: 12 },
  { kategorie: "sukuk", titel: "Sukuk, die islamische Alternative zu Anleihen", anzahl: 3 },
  { kategorie: "gold", titel: "Gold, physisch hinterlegt", anzahl: 4 },
  { kategorie: "silber", titel: "Silber, physisch hinterlegt", anzahl: 3 },
];

/** Oben offen: drei Aktien-ETFs mit allen belegten Häusern. */
export const offen: { slug: string; kaufbar: KaufbarAnzeige }[] = [
  {
    slug: "ishares-msci-world-islamic",
    kaufbar: {
      kaufbar: [{ anbieter: "1822direkt" }, { anbieter: "Bux" }, { anbieter: "comdirect" }, { anbieter: "Consorsbank" }, { anbieter: "DEGIRO" }, { anbieter: "Fidelity" }, { anbieter: "finanzen.net zero" }, { anbieter: "finvesto" }, { anbieter: "flatex" }, { anbieter: "ING" }, { anbieter: "justTRADE" }, { anbieter: "maxblue Wertpapier-Sparplan" }, { anbieter: "Scalable Capital" }, { anbieter: "Smartbroker+" }, { anbieter: "Trade Republic" }, { anbieter: "Trading 212" }, { anbieter: "XTB" }],
      nichtImAngebot: ["Bitpanda"],
      stand: "25.09.2026",
    },
  },
  {
    slug: "ishares-msci-emerging-markets-islamic",
    kaufbar: {
      kaufbar: [{ anbieter: "1822direkt" }, { anbieter: "comdirect" }, { anbieter: "Consorsbank" }, { anbieter: "Fidelity" }, { anbieter: "finanzen.net zero" }, { anbieter: "finvesto" }, { anbieter: "flatex" }, { anbieter: "ING" }, { anbieter: "justTRADE" }, { anbieter: "Scalable Capital" }, { anbieter: "Smartbroker+" }, { anbieter: "Trade Republic" }, { anbieter: "Trading 212" }, { anbieter: "XTB" }],
      nichtImAngebot: ["Bitpanda", "Bux Basic", "Bux Plus", "Bux Prime"],
      stand: "25.09.2026",
    },
  },
  {
    slug: "ishares-msci-usa-islamic",
    kaufbar: {
      kaufbar: [{ anbieter: "1822direkt" }, { anbieter: "comdirect" }, { anbieter: "Consorsbank" }, { anbieter: "DEGIRO" }, { anbieter: "Fidelity" }, { anbieter: "finanzen.net zero" }, { anbieter: "finvesto" }, { anbieter: "flatex" }, { anbieter: "ING" }, { anbieter: "justTRADE" }, { anbieter: "Scalable Capital" }, { anbieter: "Smartbroker+" }, { anbieter: "Trade Republic" }, { anbieter: "Trading 212" }, { anbieter: "XTB" }],
      nichtImAngebot: ["Bitpanda", "Bux Basic", "Bux Plus", "Bux Prime"],
      stand: "25.09.2026",
    },
  },
];

/** An der Schnittkante: Gruppe und Anzahl ja, Anlagen und Häuser nein. */
export const kante = gruppen
  .filter((g) => g.kategorie !== "aktien")
  .map((g) => ({ name: g.titel, anzahl: g.anzahl }))
  .concat([{ name: "Weitere Aktien-ETFs und Fonds", anzahl: gruppen[0].anzahl - offen.length }]);
