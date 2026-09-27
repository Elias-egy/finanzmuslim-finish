/**
 * Der offene Ausschnitt der 100 Halal-Aktien. Bewusst eine eigene Datei ohne Import aus
 * `top100Aktien.ts`: Die offene Seite lädt nur diese Namen, die ganze Liste samt Prüfergebnis
 * lädt erst die volle Fassung. Ein Test prüft, dass jeder Name hier auch dort steht.
 *
 * `kante` sind die Namen direkt an der Schranke, ohne Urteil. Gemischt aus der Liste und aus
 * bekannten Namen, die Musaffa als fraglich führt, damit der Name allein nichts verrät
 * (Elias, 27.09.2026: „dass man nicht das Urteil sieht, aber vielleicht schon manche Namen“).
 */
export type AusschnittAktie = { name: string; ticker: string; bekanntFuer: string };

/** Oben offen, mit Ergebnis. Alle stehen als Halal in der Liste. */
export const offen: AusschnittAktie[] = [
  { name: "Apple", ticker: "AAPL", bekanntFuer: "iPhone & Mac" },
  { name: "ASML", ticker: "ASML", bekanntFuer: "Chipmaschinen" },
  { name: "SAP", ticker: "SAP", bekanntFuer: "Unternehmenssoftware" },
  { name: "Adidas", ticker: "ADS", bekanntFuer: "Sportmode" },
  { name: "Beiersdorf", ticker: "BEI", bekanntFuer: "Nivea" },
  { name: "Novo Nordisk", ticker: "NOVO B", bekanntFuer: "Diabetes & Adipositas" },
];

/** An der Schnittkante: Name ja, Urteil nein. */
export const kante: Omit<AusschnittAktie, "ticker">[] = [
  { name: "Tesla", bekanntFuer: "Elektroautos" },
  { name: "Mondelez", bekanntFuer: "Oreo & Milka" },
  { name: "NVIDIA", bekanntFuer: "KI-Chips" },
  { name: "Ryanair", bekanntFuer: "Fluggesellschaft" },
  { name: "Nike", bekanntFuer: "Sportmode" },
  { name: "Lindt & Sprüngli", bekanntFuer: "Schokolade" },
];
