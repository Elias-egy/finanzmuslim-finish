import { depotAnzeige } from "@/data/vergleichAnzeige";
import { DEPOT_FINANZ_MAX } from "@/data/brokerVergleich";
import { siegerDerSeite } from "@/lib/vergleichAssistent";

/**
 * Wohin /depot-nummer-1 führt: auf den Partnerweg der Nummer 1 des Depot-Vergleichs, also dieselbe
 * Startseite mit Video, die der Kasten „Unsere Nummer 1“ verlinkt. Die PDFs der Guides können sich
 * nicht ändern, wenn die Rangfolge wechselt; darum steht dort diese Adresse und kein Anbieter
 * (Elias, 30.10.2026: „Guck dir das Video zu unserem Testsieger an“). Ohne Nummer 1 oder ohne
 * Partnerlink geht es auf den Vergleich selbst.
 */
export const depotNummerEinsZiel = (search = ""): string => {
  const sieger = siegerDerSeite(depotAnzeige, "depot", DEPOT_FINANZ_MAX);
  const ziel = sieger?.link ?? "/vergleich/depot";
  const params = search.startsWith("?") ? search.slice(1) : search;
  if (!params) return ziel;
  return `${ziel}${ziel.includes("?") ? "&" : "?"}${params}`;
};
