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

export const STUFEN_STAND: Record<string, StufenStand> = {};
