import { lazy } from "react";
import { Navigate, useParams } from "react-router-dom";
import { optinFreebie } from "@/data/optin";

/**
 * /vorlagen/<slug>/<schluessel>: die volle Fassung einer gesperrten Vorlage, nur über den
 * Link aus der Mail nach der Bestätigung. Stimmt der Schlüssel nicht, geht es zurück auf die
 * offene Seite mit dem Ausschnitt.
 */
const voll: Record<string, React.LazyExoticComponent<() => JSX.Element>> = {
  "top-100-halal-aktien": lazy(() => import("./vorlagen/Top100Voll.tsx")),
  "halal-anlagen": lazy(() => import("./vorlagen/HalalAnlagenVoll.tsx")),
  "vertrags-ampel": lazy(() => import("./vorlagen/VertragsAmpelVoll.tsx")),
  rizq: lazy(() => import("./vorlagen/RizqVoll.tsx")),
};

const VorlageVoll = () => {
  const { slug, schluessel } = useParams();
  const freebie = optinFreebie(slug);
  const Seite = slug ? voll[slug] : undefined;
  if (!freebie || !Seite) return <Navigate to="/vorlagen" replace />;
  if (freebie.schluessel !== schluessel) return <Navigate to={freebie.seite} replace />;
  return <Seite />;
};

export default VorlageVoll;
