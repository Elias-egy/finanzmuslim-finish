/**
 * Zahlen, die in Kacheltexten auf Übersichtsseiten stehen. Sie stehen hier fest, damit die
 * Startseite nicht die ganzen Datendateien lädt. Ein Test in vergleiche.test.ts prüft, dass
 * sie zu den Daten passen.
 *
 * Die Zahlen der Vergleiche zählen, was der Vergleich zeigt (`src/data/vergleichAnzeige.ts`),
 * nicht was in den Datendateien steht. Kommt ein Angebot dazu, meldet der Test die neue Zahl.
 */
export const ANZAHL_HALAL_ANLAGEN = 30;
export const ANZAHL_DEPOTS = 22;
export const ANZAHL_KONTEN = 52;
export const ANZAHL_KRYPTO = 27;
export const ANZAHL_APPS = 4;
export const ANZAHL_STEUERPROGRAMME = 10;

const WOERTER = ["null", "ein", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun", "zehn", "elf", "zwölf"];

/** Zahl als Wort bis zwölf, darüber als Ziffern. Mit `gross` für den Satzanfang. */
export const zahlwort = (n: number, gross = false): string => {
  const wort = WOERTER[n] ?? String(n);
  return gross ? wort.charAt(0).toUpperCase() + wort.slice(1) : wort;
};
