import { Navigate, useLocation } from "react-router-dom";
import { weiterleitungen } from "@/data/routen";

/**
 * Alte Adresse im Browser (Klick innerhalb der Seite, ohne neuen Seitenaufruf).
 * Ein echter Aufruf bekommt die vorgerenderte Weiterleitungsseite aus
 * scripts/prerender.mjs; hier gilt dieselbe Liste, damit beide Wege dasselbe Ziel haben.
 */
const AlteAdresse = () => {
  const { pathname, search, hash } = useLocation();
  const pfad = pathname.replace(/\/+$/, "") || "/";
  const ziel = weiterleitungen.find((w) => w.von === pfad)?.nach ?? "/blog";
  return <Navigate to={`${ziel}${search}${hash}`} replace />;
};

export default AlteAdresse;
