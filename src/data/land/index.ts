/**
 * Zugang zu den Länderlisten (DACH1, 23.11.2026). Eine Stelle, die Seite, Routen, Sitemap und automatische Umstellung
 * fragen: Gibt es für dieses Land und diesen Vergleich eine fertige Liste?
 */
import { LAND_LISTE, ohneLandPraefix, type Land } from "@/lib/land";
import { LAND_VERGLEICHE, type LandDaten, type LandSchluessel, type LandVergleich } from "./typen";
import { OESTERREICH } from "./oesterreich";
import { SCHWEIZ } from "./schweiz";

export { LAND_VERGLEICHE } from "./typen";
export type { LandSchluessel, LandVergleich } from "./typen";

const DATEN: Record<"at" | "ch", LandDaten> = { at: OESTERREICH, ch: SCHWEIZ };

/** Schlüssel des Länderlisten-Vergleichs zu einer (auch länderspezifischen) Adresse, sonst null. */
export const landSchluessel = (pfad: string): LandSchluessel | null => LAND_VERGLEICHE[ohneLandPraefix(pfad)] ?? null;

/** Gibt es für diese Seite überhaupt Länderversionen? Davon hängt ab, ob die Länderwahl erscheint. */
export const hatLandVersion = (pfad: string): boolean => landSchluessel(pfad) !== null;

/** Die Liste eines Landes zu einem Vergleich. Deutschland hat keine (es liest seine Datendateien). */
export const landVergleich = (land: Land, pfad: string): LandVergleich | null => {
  if (land === "de") return null;
  const schluessel = landSchluessel(pfad);
  return schluessel ? DATEN[land][schluessel] : null;
};

/** Fertig und öffentlich: kein Entwurf, mindestens ein Anbieter. Nur dann gibt es Sitemap, hreflang und Umstellung. */
export const landFreigegeben = (land: Land, pfad: string): boolean => {
  if (land === "de") return true;
  const liste = landVergleich(land, pfad);
  return Boolean(liste && !liste.entwurf && liste.anbieter.length > 0);
};

/** Hat dieses Land mindestens einen fertigen Vergleich? Für die Übersichtsseite `/at/vergleiche`. */
export const landHatFreigegebenes = (land: Land): boolean =>
  land === "de" || Object.keys(LAND_VERGLEICHE).some((p) => landFreigegeben(land, p));

/** Alle Länder, in denen diese Seite fertig vorliegt, für `hreflang`. Deutschland immer. */
export const freigegebeneLaender = (pfad: string): Land[] => LAND_LISTE.filter((l) => landFreigegeben(l, pfad));
