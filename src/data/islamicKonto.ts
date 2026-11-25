/**
 * Etikett „Islamic-Konto“ (VG8-04, 25.11.2026, Elias: „Das kannst du an sich beim Geschäftskonto von KT-Bank und dem normalen
 * Girokonto hinten irgendwie auch irgendeine Farbe geben und dann heißt das auch so mit Islamic-Konto … Und du kannst in den
 * Filter auch Islamic-Konto machen … Es bleibt trotzdem hinten.“).
 *
 * Das ist nur die Bezeichnung der Kontoart: Die KT Bank nennt ihre Konten selbst so. Es ist kein Halal-Urteil und kein Beleg
 * für ein Merkmal. Rangfolge, Note und Platz ändern sich nicht (`src/lib/rangfolge.ts` liest den Wert nicht).
 */
export const ISLAMIC_KONTO_TEXT = "Islamic-Konto";

/** Die Tarife, die als Islamic-Konto gekennzeichnet sind (KT Bank, Girokonto und Geschäftskonto). */
export const ISLAMIC_KONTO_IDS: readonly string[] = ["kt-bank-girokonto", "kt-bank-geschaeftskonto"];

export const istIslamicKonto = (id: string): boolean => ISLAMIC_KONTO_IDS.includes(id);

/** Der Filter „Islamic-Konto“ in beiden Vergleichen: lässt nur Tarife mit gesetztem Wert `islamicKonto` durch. */
export const ISLAMIC_KONTO_FILTER = { key: "islamicKonto", label: ISLAMIC_KONTO_TEXT, erlaubt: ["true"] };

/** Setzt `werte.islamicKonto` bei den gekennzeichneten Tarifen, sonst nichts. Alle anderen Felder bleiben, wie sie sind. */
export const mitIslamicKonto = <T extends { id: string; werte: Record<string, unknown> }>(liste: readonly T[]): T[] =>
  liste.map((a) => (istIslamicKonto(a.id) ? { ...a, werte: { ...a.werte, islamicKonto: true } } : a));
