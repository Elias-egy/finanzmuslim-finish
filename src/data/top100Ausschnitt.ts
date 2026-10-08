/**
 * Der offene Ausschnitt der 100 Halal-Aktien. Bewusst eine eigene Datei ohne Import aus
 * `top100Aktien.ts`: Die offene Seite lädt nur diese Namen, die ganze Liste samt Prüfergebnis
 * lädt erst die volle Fassung. Ein Test prüft, dass jeder Name hier auch dort steht.
 *
 * `kante` sind die Namen direkt an der Schranke, ohne Urteil. Gemischt aus der Liste und aus
 * bekannten Namen, die Musaffa als fraglich führt, damit der Name allein nichts verrät
 * (Elias, 27.09.2026: „dass man nicht das Urteil sieht, aber vielleicht schon manche Namen“).
 * Seit 27.09.2026 abends sind alle 100 halal; Mondelez beantwortet die volle Fassung im Abschnitt
 * „Sechs bekannte Namen, fraglich“. Die Frage an der Kante heißt deshalb „Ist deine Aktie dabei?“,
 * nicht „Ist sie halal?“. Seit 08.10.2026 stehen drei Titel offen und drei Namen an der Kante
 * (Elias: „die ersten drei Aktien siehst, der Rest ist verschwommen“).
 * Kein Name, der schon im offenen Text steht („von Apple bis Nike“), sonst verrät der Text das Urteil.
 */
export type AusschnittAktie = { name: string; ticker: string; bekanntFuer: string };

/** Oben offen, mit Ergebnis. Alle stehen als Halal in der Liste. */
export const offen: AusschnittAktie[] = [
  { name: "Apple", ticker: "AAPL", bekanntFuer: "iPhone & Mac" },
  { name: "ASML", ticker: "ASML", bekanntFuer: "Chipmaschinen" },
  { name: "SAP", ticker: "SAP", bekanntFuer: "Unternehmenssoftware" },
];

/** An der Schnittkante: Name ja, Urteil nein. */
export const kante: Omit<AusschnittAktie, "ticker">[] = [
  { name: "Tesla", bekanntFuer: "Elektroautos" },
  { name: "Mondelez", bekanntFuer: "Oreo & Milka" },
  { name: "NVIDIA", bekanntFuer: "KI-Chips" },
];
