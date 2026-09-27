import { ANLAGEN_KAUFBAR } from "./anlagenKaufbar";

/**
 * Kaufstatus einer Halal-Anlage für eine Vergleichszeile.
 *
 * Ein Eintrag unter dem Tarifnamen („comdirect Pure Depot“) geht vor dem Hauseintrag
 * („comdirect“), gleiche Regel wie `anlagen_matrix.py`. Ohne diese Reihenfolge erbte das
 * Pure Depot Fonds und Metall-ETCs des comdirect Depots, die comdirect am 27.09.2026 für
 * das Pure Depot schriftlich ausgeschlossen hat („nur comdirect Depot“).
 */
export function kaufstatus(isin: string, a: { name: string; produkt?: string | null }): "kaufbar" | "nicht" | null {
  const e = ANLAGEN_KAUFBAR[isin];
  if (!e) return null;
  for (const name of [a.produkt ? `${a.name} ${a.produkt}` : null, a.name]) {
    if (!name) continue;
    if (e.kaufbar.some((k) => k.anbieter === name)) return "kaufbar";
    if (e.nichtImAngebot.includes(name)) return "nicht";
  }
  return null;
}
