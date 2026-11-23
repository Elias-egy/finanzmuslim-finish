/**
 * Ein Beispiel-Eintrag im genauen Format der Länderlisten (DACH1, 23.11.2026). Er ist ERFUNDEN, trägt einen Namen, den es
 * nicht gibt, und steht in keiner Liste. Er erscheint nur im Entwicklungsserver mit `?beispiel=1`, damit man eine
 * Länderseite mit Daten bei 390 und 1440 px ansehen kann. Live gibt es ihn nie (`import.meta.env.DEV`).
 *
 * Felder je Depot-Eintrag, alle wie in `src/data/brokerVergleich.ts`:
 * - id, name, produkt, domain: Name wie beim Anbieter, Domain für das Logo (`src/data/anbieterLogos.ts`).
 * - link: nur mit Partnerschaft, `/out/<kurzname>-at` (oder `-ch`), Eintrag in `partnerLinks.ts` mit `land`.
 * - werte: Schlüssel wie `DEPOT_ZEILEN`. Text, Ampel (`gut`, `teils`, `schlecht`), Haken (true, false) oder null.
 * - quellen: je Wert URL, Stand, Hinweis (Beleg vom Anbieter, vor allem für `zinsfreiAbStart`).
 * - finanzPunkte: Kosten-Punkte je Kriterium nach `DEPOT_FINANZ_MAX` (ohne sie bekommt das Depot 0 im Kosten-Teil).
 * - halalAnlagenPunkte: gewichtete kaufbare Halal-Anlagen je Zeile (Fonds ohne Aufschlag 1, mit Rabatt 0,75, voll 0,5, ETC 1).
 */
import type { RohAnbieter } from "../vergleichHelfer";

export const BEISPIEL_EINTRAG: RohAnbieter = {
  id: "beispielanbieter-depot-at",
  name: "Beispielanbieter",
  produkt: "Depot (Beispiel)",
  domain: "beispielanbieter.example",
  haus: "beispielanbieter",
  werte: {
    zinsfreiAbStart: "gut",
    halalEtfsFonds: "6 von 12",
    halalSukuk: "0 von 3",
    halalEdelmetalle: "2 von 7",
    depotgebuehr: "0 €",
    orderkosten: "ab 1 €",
    etfSparplanKosten: "0 €",
    sparrate: "ab 1 €",
    kapest: true,
    appIos: "4,5 / 5",
    appAndroid: "4,3 / 5",
  },
  quellen: {
    zinsfreiAbStart: { url: "https://beispielanbieter.example/preise", stand: "01.01.2026", hinweis: "Beispiel, nicht echt.", anzeige: "Beispiel, nicht echt" },
  },
  finanzPunkte: { depotgebuehr: 16, etfSparplanProzent: 6, orderPauschal: 6, mindestsparrate: 3, kapest: 2 },
  halalAnlagenPunkte: { halalEtfsFonds: 5, halalSukuk: 0, halalEdelmetalle: 2 },
};
