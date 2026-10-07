import type { RohAnbieter } from "@/data/vergleichHelfer";

/**
 * Leser für die Vergleichsdaten, die Rangfolge und geführter Vergleich gemeinsam brauchen.
 * Eigenes Modul, damit `rangfolge.ts` nicht `vergleichAssistent.ts` importiert und umgekehrt.
 */

/** Gewichtete Finanznote von 0 bis 5. Ohne Gewichte dieselbe Zahl wie der Kosten-Teil der Rangfolge. */
export const finanzNote = (
  a: RohAnbieter,
  finanzMax: Record<string, number>,
  gewichte: Record<string, number>[],
): number | null => {
  if (!a.finanzPunkte) return null;
  const faktor = (k: string) => gewichte.reduce((f, g) => f * (g[k] ?? 1), 1);
  let max = 0;
  let summe = 0;
  for (const [k, m] of Object.entries(finanzMax)) {
    max += m * faktor(k);
    summe += (a.finanzPunkte[k] ?? 0) * faktor(k);
  }
  // Abzüge gelten immer voll, egal was der Nutzer gewichtet.
  summe += Math.min(0, a.finanzPunkte.abzug ?? 0);
  if (max === 0) return null;
  return 5 * Math.min(1, Math.max(0, summe / max));
};

/** Screening-Apps: Reicht die kostenlose Fassung, um Aktien zu prüfen? Liest das belegte Feld `kostenlos`. */
export const kostenlosReicht = (a: RohAnbieter) => {
  const w = a.werte.kostenlos;
  return typeof w === "string" && w.trim() !== "" && !/danach Abo|nur eine|eine Prüfung/i.test(w);
};
