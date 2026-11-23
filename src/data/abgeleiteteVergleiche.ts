/**
 * Neue Vergleiche aus vorhandenen Daten, mit anderer Auswahl wie beim Edelmetall-Vergleich (Elias, 23.11.2026, VG1:
 * „wie beim Edelmetall-Vergleich, einfach die Rangfolge ändern und das dann als neuen Vergleich verkaufen. Aber der muss
 * schon anständig sein.“, raw/2026-11-23-elias-vg1-01-rankings-acht-vergleiche-naeher-am-sale.md im Vault). Vorbild sind
 * die Unterseiten von Finanzfluss (finanzfluss.de/vergleich/girokonto/studenten/, /vergleich/etf-sparplan/, gesehen am
 * 23.11.2026). Jede Auswahl liest nur Werte, die schon im Depot- oder Girokonto-Vergleich mit Quelle stehen; die Note
 * rechnet dieselbe Rangfolge wie dort (`rangfolge` mit "depot" oder "girokonto"), damit kein Platz anders begründet ist.
 */
import type { RohAnbieter, RohWert } from "./vergleichHelfer";
import { girokontoAnzeige } from "./anzeige/girokonto";
import { depotAnzeige } from "./anzeige/depot";

const text = (w: RohWert | undefined) => (typeof w === "string" ? w.trim() : "");

/** Genau 0 € oder 0 %, ohne Bedingung dahinter. */
const nullGebuehr = (w: RohWert | undefined) => /^0\s?(€|%)$/.test(text(w));

/**
 * Konto ohne Gebühr im Ausland: Abhebung im Euro-Ausland, Abhebung in Fremdwährung und Zahlung in Fremdwährung je 0 €
 * oder 0 % (Werte und Beleg: `girokontoAuslandDaten.ts`, Finanzfluss-Vergleich, Stand 19.09.2026). Für die Umrah zählt
 * die Fremdwährung (Saudi-Riyal), für den Urlaub in Europa die Abhebung im Euro-Ausland.
 */
export const ohneAuslandsgebuehr = (a: RohAnbieter): boolean =>
  nullGebuehr(a.werte.auslandAbheben) && nullGebuehr(a.werte.auslandFremdAbheben) && nullGebuehr(a.werte.auslandFremdZahlen);

/** Höchstalter aus „… unter 30 …“ in der Kontoführung, sonst null. */
export const altersgrenze = (a: RohAnbieter): number | null => {
  const m = text(a.werte.kontofuehrung).match(/unter (\d{2})/);
  return m ? Number(m[1]) : null;
};

/**
 * Kostenlos für Studenten und alle unter 30: Kontoführung ohne jede Bedingung 0 €, oder die Bank nennt eine Altersgrenze
 * von mindestens 27 Jahren, unter der das Konto ohne Geldeingang kostenlos ist (Wortlaut der Kontoführung im
 * Girokonto-Vergleich, beim Anbieter geprüft am 27.09.2026).
 */
export const kostenlosUnter30 = (a: RohAnbieter): boolean => {
  const kf = text(a.werte.kontofuehrung);
  if (/^0\s?€$/.test(kf)) return true;
  const grenze = altersgrenze(a);
  return kf.startsWith("0 €") && grenze !== null && grenze >= 27;
};

/** ETF-Sparplan ohne Ausführungskosten, ganz oder bei den großen Fondsgesellschaften (Finanzfluss, Stand 14.09.2026). */
export const etfSparplanKostenlos = (a: RohAnbieter): boolean => /^0\s?€/.test(text(a.werte.etfSparplanKosten));

/** Mindestens ein Halal-ETF oder Fonds ist dort belegt kaufbar (`x von 12` mit x größer 0). */
export const mitHalalEtf = (a: RohAnbieter): boolean => {
  const m = text(a.werte.halalEtfsFonds).match(/(\d+) von \d+/);
  return m !== null && Number(m[1]) > 0;
};

export const umrahKonten: RohAnbieter[] = girokontoAnzeige.filter(ohneAuslandsgebuehr);
export const studentenKonten: RohAnbieter[] = girokontoAnzeige.filter(kostenlosUnter30);
export const etfSparplanDepots: RohAnbieter[] = depotAnzeige.filter((a) => etfSparplanKostenlos(a) && mitHalalEtf(a));
