import { useLocation } from "react-router-dom";
import { landAusPfad, type Land } from "@/lib/land";

/** Das Land der aktuellen Seite, aus der Adresse: `/at/…` Österreich, `/ch/…` Schweiz, sonst Deutschland. */
export const useLand = (): Land => landAusPfad(useLocation().pathname);
