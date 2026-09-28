import type { AboAnbieter } from "@/data/autoAboCheck";

/**
 * Der offene Ausschnitt des Auto-Abo-Checks: nur die Namen der geprüften Anbieter, ohne Urteil (Plan
 * Opt-in-Strecke P3). Bewusst ohne Laufzeit-Import aus `autoAboCheck.ts`, sonst stünden Urteile und
 * Klauseln im JavaScript der offenen Seite. Ein Test hält Namen und Reihenfolge gleich.
 */
export const kante: Pick<AboAnbieter, "id" | "name" | "stufe" | "unter">[] = [
  { id: "finn-sorglos", name: "FINN", stufe: "mit Sorglos Schutz", unter: "Unabhängiger Anbieter, Schutzpaket gegen Aufpreis" },
  { id: "finn", name: "FINN", stufe: "im Basis Schutz", unter: "Unabhängiger Anbieter, privat und für Firmen" },
  { id: "sixt", name: "SIXT+ Auto Abo", unter: "Autovermietung, privat und für Firmen" },
  { id: "vwfs", name: "VW FS Private Langzeitmiete", unter: "Nachfolger des VW-Abos, 3 oder 6 Monate" },
  { id: "mocean", name: "MOCEAN Auto Abo", unter: "Abo von Hyundai und Genesis" },
  { id: "kinto", name: "KINTO Auto Abo", unter: "Abo von Toyota, Vertrag über das Autohaus" },
  { id: "mercedes", name: "Mercedes-Benz Rent Langzeitmiete", unter: "Nachfolger des Mercedes-Abos, bis 24 Monate" },
  { id: "faaren", name: "FAAREN", unter: "Marktplatz, Vertrag mit einem Autohaus" },
];

/** Name mit Schutzstufe, so wie er auf beiden Fassungen und im PDF steht. */
export const titelVon = (a: Pick<AboAnbieter, "name" | "stufe">) => (a.stufe ? `${a.name} ${a.stufe}` : a.name);

/** Zahl für Titel und Knopf, nach Anbietern gezählt, nicht nach Stufen (ein Test rechnet gegen die volle Datei nach). */
export const ANZAHL_ANBIETER = new Set(kante.map((a) => a.name)).size;
