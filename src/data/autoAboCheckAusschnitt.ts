import type { AboAnbieter } from "@/data/autoAboCheck";

/**
 * Der offene Ausschnitt des Auto-Abo-Checks: nur die Namen der geprüften Anbieter, ohne Urteil (Plan
 * Opt-in-Strecke P3). Bewusst ohne Laufzeit-Import aus `autoAboCheck.ts`, sonst stünden Urteile und
 * Klauseln im JavaScript der offenen Seite. Ein Test hält Namen und Reihenfolge gleich.
 */
export const kante: Pick<AboAnbieter, "id" | "name" | "unter">[] = [
  { id: "finn", name: "FINN", unter: "Unabhängiger Anbieter, privat und für Firmen" },
  { id: "sixt", name: "SIXT+ Auto Abo", unter: "Autovermietung, privat und für Firmen" },
  { id: "vwfs", name: "VW FS Private Langzeitmiete", unter: "Nachfolger des VW-Abos, 3 oder 6 Monate" },
  { id: "mocean", name: "MOCEAN Auto Abo", unter: "Abo von Hyundai und Genesis" },
  { id: "kinto", name: "KINTO Auto Abo", unter: "Abo von Toyota, Vertrag über das Autohaus" },
  { id: "mercedes", name: "Mercedes-Benz Rent Langzeitmiete", unter: "Nachfolger des Mercedes-Abos, bis 24 Monate" },
  { id: "faaren", name: "FAAREN", unter: "Marktplatz, Vertrag mit einem Autohaus" },
];

/** Zahl für Titel und Knopf, aus dem Ausschnitt gezählt (ein Test rechnet gegen die volle Datei nach). */
export const ANZAHL_ANBIETER = kante.length;
