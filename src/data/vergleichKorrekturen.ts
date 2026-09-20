import type { Quelle } from "@/components/vergleich/vergleichTypen";
import type { RohAnbieter, RohWert } from "./vergleichHelfer";

/**
 * Kleine, datierte Nachträge zur Prüfung vom 20.09.2026.
 * Die Vergleichsdateien werden aus dem Recherchebestand erzeugt; diese Schicht
 * hält die redaktionell freigegebenen Korrekturen getrennt vom Rohimport.
 */
export const korrigiereAnbieter = (
  anbieter: RohAnbieter[],
  overrides: Record<string, Partial<Record<string, RohWert>>>,
  quellenOverrides: Record<string, Record<string, Quelle>> = {},
): RohAnbieter[] =>
  anbieter.map((a) => {
    const werte = overrides[a.id];
    if (!werte) return a;
    const quellen = { ...a.quellen };
    for (const key of Object.keys(werte)) {
      if (quellenOverrides[a.id]?.[key]) {
        quellen[key] = quellenOverrides[a.id][key];
      } else if (!quellen[key]) {
        quellen[key] = {
          url: a.domain ? `https://${a.domain}` : undefined,
          stand: "20.09.2026",
          hinweis: "Anbieterquelle, optionaler Ertrag erfordert eine eigene Aktivierung oder Einzahlung.",
        };
      }
    }
    const zins = werte.zinsfreiAbStart;
    return {
      ...a,
      werte: { ...a.werte, ...werte },
      quellen,
      ...(zins === "schlecht" || zins === "gut" || zins === "teils" ? { abgeraten: zins === "schlecht" } : {}),
    };
  }).sort((a, b) =>
    Number(a.abgeraten ?? false) - Number(b.abgeraten ?? false) ||
    `${a.name} ${a.produkt}`.localeCompare(`${b.name} ${b.produkt}`, "de"),
  );
