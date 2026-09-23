/**
 * Stand der Stufen-Prüfung je Haus. HANDGEPFLEGT, wird nur vom Prüfstand gelesen (scripts/pruefstand.ts).
 *
 * Regel (Elias, 23.09.2026): Jede Tarifstufe eines Anbieters ist ein eigenes Produkt. Ein Beleg gilt für eine
 * Stufe nur, wenn er sie nennt oder ausdrücklich für alle Stufen gilt. Sobald ein Haus stufenweise nachgeprüft
 * ist, kommt hier ein Eintrag mit Datum, sonst zeigt der Prüfstand „pauschaler Beleg“.
 *
 * Schlüssel ist das Haus (`haus` in den Vergleichsdateien).
 */
export type StufenStand = {
  /** Datum und kurzer Befund der stufenweisen Prüfung. Leer heißt: noch nicht geprüft. */
  geprueft?: string;
  notiz?: string;
};

export const STUFEN_STAND: Record<string, StufenStand> = {
  revolut: {
    geprueft: "23.09.2026, im echten Chrome auf revolut.com",
    notiz: "Zins Girokonto: AGB Privatkunden Abschn. 2 gilt für alle fünf Stufen, Zins nur im Opt-in-Tagesgeld. Der Tagesgeld-Satz hängt vom Abo ab (Standard bis Ultra), kein Einfluss auf die Ampel. Dispo: Hilfeseite „kein Überziehungsdienst in DE“ gilt landesweit. Offen: Zuordnung der Tagesgeld-Prozentwerte je Stufe (sechs Werte für fünf Spalten), für die Bewertung nicht nötig.",
  },  bunq: {
    geprueft: "23.09.2026, Privatkonto-AGB (nennt alle vier Stufen)",
    notiz: "MassInterest nur im selbst eröffneten Sparkonto (AGB Nr. 17), Dispo grundsätzlich nicht (AGB Nr. 25, „normalerweise“). Kein Unterschied zwischen Free, Core, Pro und Elite. Der alte Hilfeartikel zum Dispo ist 404 und ersetzt. Optional: bunq einmal schriftlich zum Dispo bestätigen lassen.",
  },
  vivid: {
    geprueft: "23.09.2026, Vivid-Hilfeartikel nennt Standard, Plus und Prime",
    notiz: "Zins nur im selbst geöffneten Interest Rate Pocket (Standard 0,1 %, Plus 1,0 %, Prime 2,0 %). Dispo: Hilfeartikel von 2023 ohne Stufe, dazu Vivid Now nur auf Antrag, aktuelle Quelle fehlt. Offen: Vivid einmal schriftlich zum Dispo fragen.",
  },
};
