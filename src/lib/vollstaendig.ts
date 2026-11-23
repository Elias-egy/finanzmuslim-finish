import type { VergleichsZeile } from "@/components/vergleich/vergleichTypen";
import type { RohAnbieter } from "@/data/vergleichHelfer";
import { STUFEN_ALLE_REIN, unbelegteWerte, type RangKategorie, type RangOptionen } from "@/lib/rangfolge";

/**
 * Schalter für alle sechs Vergleiche (Elias, 08.10.2026: „alles rausnehmen, was wir nicht perfekt
 * bewerten können“). An: Ein Angebot steht nur im Vergleich, wenn jede Zeile der Tabelle einen
 * Wert trägt und jeder Wert der Note belegt ist. Aus: Alle Angebote stehen da, leere Zellen
 * zeigen einen Strich.
 *
 * Depot und Girokonto stehen seit VG2-04 (Elias, 23.11.2026: „Ich will jeden einzelnen Anbieter ranken“) nicht mehr unter diesem Schalter:
 * Dort steht jeder Anbieter, fehlende Werte zeigen „Offen“ und zählen 0 Punkte (`STUFEN_ALLE_REIN`, Regel 10 in `rangfolge.ts`).
 *
 * Nichts wird gelöscht. Die Datendateien bleiben vollständig, gefiltert wird erst in
 * `src/data/vergleichAnzeige.ts`. Wer später belegt ist, erscheint beim nächsten Bau von selbst
 * wieder, auch Partner.
 */
export const NUR_VOLLSTAENDIG = true;

const leer = (a: RohAnbieter, z: VergleichsZeile, kategorie: RangKategorie): boolean => {
  const w = a.werte[z.key];
  // Geschäftskonto (VG2-04): „unbekannt“ ist dort ein gesetzter Wert, die Zelle zeigt „Offen“. In den anderen Vergleichen bleibt es leer.
  if (z.art === "ampel") return !(w === "gut" || w === "teils" || w === "schlecht" || (kategorie === "geschaeftskonto" && w === "unbekannt"));
  if (z.art === "janein") return typeof w !== "boolean";
  // Ein Wert, der nur aus einem Strich besteht, ist für den Leser eine leere Zelle.
  return !(typeof w === "string" && w.replace(/[\s–—-]/g, "") !== "");
};

/**
 * Was einem Angebot zur vollständigen Anzeige fehlt: leere Zeilen der Tabelle und unbelegte Werte
 * der Note. Ein abgeratenes Angebot bekommt keine Note, dort zählen nur die Zeilen.
 */
export const luecken = (
  a: RohAnbieter,
  kategorie: RangKategorie,
  zeilen: VergleichsZeile[],
  opt: RangOptionen = {},
): string[] => {
  const zeilenLeer = zeilen.filter((z) => !z.key.startsWith("__") && leer(a, z, kategorie)).map((z) => z.key);
  const rot = a.abgeraten || a.werte.zinsfreiAbStart === "schlecht";
  const note = rot ? [] : unbelegteWerte(a, kategorie, opt);
  return [...new Set([...zeilenLeer, ...note])];
};

/** Die Angebote, die der Vergleich zeigt. */
export const zeigbar = (
  liste: readonly RohAnbieter[],
  kategorie: RangKategorie,
  zeilen: VergleichsZeile[],
  opt: RangOptionen = {},
): RohAnbieter[] => (NUR_VOLLSTAENDIG && !STUFEN_ALLE_REIN.has(kategorie) ? liste.filter((a) => luecken(a, kategorie, zeilen, opt).length === 0) : [...liste]);
