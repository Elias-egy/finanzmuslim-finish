/**
 * Was die sechs Vergleiche zeigen. Seiten, geführter Vergleich, Logos und Zählungen lesen nur
 * diese Listen, nie die Datendateien direkt. Der Schalter steht in `src/lib/vollstaendig.ts`.
 *
 * Zwei Zellen folgen aus einem belegten Wert derselben Zeile und stehen deshalb nicht leer:
 * - Krypto: Wo die Auszahlung auf die eigene Wallet belegt nicht geht, gibt es keine Kosten dafür.
 * - Steuer: Ein Programm, das nichts kostet, hat keinen Kauf, je Kauf entfällt wie die Zahlung.
 *
 * Jede Liste steht in einer eigenen Datei unter `src/data/anzeige/` (UP6, 10.11.2026). Eine Seite,
 * die nur einen Vergleich braucht, importiert von dort, sonst lädt sie alle sechs Datendateien mit.
 * Diese Datei leitet nur weiter, für Stellen, die mehrere Vergleiche brauchen.
 */
export { depotAnzeige } from "./anzeige/depot";
export { edelmetallAnzeige } from "./anzeige/edelmetall";
export { girokontoAnzeige } from "./anzeige/girokonto";
export { kryptoAnzeige } from "./anzeige/krypto";
export { screenerAnzeige } from "./anzeige/screener";
export { steuerAnzeige } from "./anzeige/steuer";
