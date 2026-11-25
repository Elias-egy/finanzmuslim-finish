/**
 * Neue Vergleiche aus vorhandenen Daten, mit anderer Auswahl wie beim Edelmetall-Vergleich (Elias, 23.11.2026, VG1:
 * „wie beim Edelmetall-Vergleich, einfach die Rangfolge ändern und das dann als neuen Vergleich verkaufen. Aber der muss
 * schon anständig sein.“, raw/2026-11-23-elias-vg1-01-rankings-acht-vergleiche-naeher-am-sale.md im Vault). Vorbild ist
 * die Unterseite von Finanzfluss (finanzfluss.de/vergleich/etf-sparplan/, gesehen am 23.11.2026). Studenten- und Umrah-Konto
 * sind seit VG8-02 (25.11.2026) raus. Jede Auswahl liest nur Werte, die schon im Depot- oder Girokonto-Vergleich mit Quelle stehen; die Note
 * rechnet dieselbe Rangfolge wie dort (`rangfolge` mit "depot" oder "girokonto"), damit kein Platz anders begründet ist.
 */
import type { RohAnbieter, RohWert } from "./vergleichHelfer";
import { depotAnzeige } from "./anzeige/depot";

const text = (w: RohWert | undefined) => (typeof w === "string" ? w.trim() : "");

/** ETF-Sparplan ohne Ausführungskosten, ganz oder bei den großen Fondsgesellschaften (Finanzfluss, Stand 14.09.2026). */
export const etfSparplanKostenlos = (a: RohAnbieter): boolean => /^0\s?€/.test(text(a.werte.etfSparplanKosten));

/** Mindestens ein Halal-ETF oder Fonds ist dort belegt kaufbar (`x von 12` mit x größer 0). */
export const mitHalalEtf = (a: RohAnbieter): boolean => {
  const m = text(a.werte.halalEtfsFonds).match(/(\d+) von \d+/);
  return m !== null && Number(m[1]) > 0;
};

export const etfSparplanDepots: RohAnbieter[] = depotAnzeige.filter((a) => etfSparplanKostenlos(a) && mitHalalEtf(a));
