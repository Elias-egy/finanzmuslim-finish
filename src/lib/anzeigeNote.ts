/**
 * Die Note, wie die Seite sie zeigt: eine Stelle nach dem Komma, abgerundet, nie aufgerundet
 * (Elias, 08.11.2026, A11: „die Sterne dürfen ja nicht in der falschen Reihenfolge sein“). Zahl, Wort,
 * Sterne und Reihenfolge lesen alle diesen Wert, so steht nie eine höhere Zahl hinter einer niedrigeren.
 * Eigene Datei ohne Datenimporte, damit jede Seite sie laden kann.
 */
export const anzeigeNote = (note: number): number => Math.floor(Math.round(note * 100) / 10) / 10;

/**
 * Sterne auf der Seite: die angezeigte Note auf halbe Sterne gerundet (4,3 und 4,4 zeigen 4,5 Sterne, 4,2 zeigt 4). Zahl, Sterne
 * und Reihenfolge lesen dieselbe angezeigte Note (Regel 7), darum zeigen zwei Angebote mit gleicher angezeigter Note immer gleich
 * viele Sterne und eine höhere Note nie weniger. Die Sterne-Zeichnung (`Sterne` in VergleichsBausteine) liest diese Funktion, nicht
 * die genaue Note und nicht einen Teilstern (VG3, 23.11.2026: Teilfüllung 10 bis 90 % je Zehntel ließ 4,3 wie einen halben Stern mehr als 4 wirken).
 */
export const sterne = (note: number): number => Math.round(anzeigeNote(note) * 2) / 2;
