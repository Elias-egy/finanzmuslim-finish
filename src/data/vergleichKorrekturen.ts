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
    const vorgeschlagen = overrides[a.id];
    if (!vorgeschlagen) return a;
    const werte: Partial<Record<string, RohWert>> = {};
    const quellen = { ...a.quellen };
    for (const [key, wert] of Object.entries(vorgeschlagen)) {
      // Eine positive Zins- oder Bezahlmodell-Aussage braucht einen konkreten
      // Anbieterbeleg. Ein generischer Domain-Link ist dafür kein Beleg.
      if (
        (key === "zinsfreiAbStart" || key === "zinsfreiesModell") &&
        (wert === "gut" || wert === "teils") &&
        !quellenOverrides[a.id]?.[key]?.url
      ) continue;
      werte[key] = wert;
      if (quellenOverrides[a.id]?.[key]) {
        quellen[key] = quellenOverrides[a.id][key];
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
