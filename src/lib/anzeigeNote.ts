/**
 * Die Note, wie die Seite sie zeigt: eine Stelle nach dem Komma, abgerundet, nie aufgerundet
 * (Elias, 08.11.2026, A11: „die Sterne dürfen ja nicht in der falschen Reihenfolge sein“). Zahl, Wort,
 * Sterne und Reihenfolge lesen alle diesen Wert, so steht nie eine höhere Zahl hinter einer niedrigeren.
 * Eigene Datei ohne Datenimporte, damit jede Seite sie laden kann.
 */
export const anzeigeNote = (note: number): number => Math.floor(Math.round(note * 100) / 10) / 10;
