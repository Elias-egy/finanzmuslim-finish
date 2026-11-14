import { useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Seo from "@/components/Seo";
import { findPartnerLink } from "@/data/partnerLinks";
import { ereignis, vorigeSeite } from "@/lib/messung";
import { findStartPartner, istLeerQuelle } from "@/data/investmentStart";
import { direktLink, ohneZwischenseite } from "@/lib/direktLink";

/** Zentrale Weiterleitung fuer Partnerlinks: /out/:kurzname */
const Out = () => {
  const { kurzname } = useParams();
  const { search } = useLocation();
  const navigate = useNavigate();
  const eintrag = findPartnerLink(kurzname);
  const aktiv = Boolean(eintrag?.aktiv);

  useEffect(() => {
    if (!eintrag || !eintrag.aktiv) return;
    // Klick zum Partner: welcher Anbieter, von welcher Seite (die Seite davor, über den Router).
    // RK1 (14.11.2026): direkt zum Anbieter, ohne Video-Seite dazwischen. Nur „Depot da, noch leer“ (dmleer…) braucht
    // weiter die Startseite mit den drei Schritten.
    const start = findStartPartner(kurzname);
    const src = new URLSearchParams(search).get("src");
    if (start && ohneZwischenseite(start) && !istLeerQuelle(src)) {
      ereignis("partner_klick", { anbieter: kurzname ?? "", weg: "out", direkt: true, von: vorigeSeite() });
      window.location.replace(direktLink(start, search));
      return;
    }
    ereignis("partner_klick", { anbieter: kurzname ?? "", weg: "out", von: vorigeSeite() });
    const extern = /^https?:\/\//i.test(eintrag.ziel);
    // Vorhandene Abfrageparameter unveraendert anhaengen (z. B. ?src=...)
    const params = search.startsWith("?") ? search.slice(1) : search;
    const trenner = eintrag.ziel.includes("?") ? "&" : "?";
    const ziel = params ? `${eintrag.ziel}${trenner}${params}` : eintrag.ziel;

    if (extern) {
      window.location.replace(ziel);
    } else {
      navigate(ziel, { replace: true });
    }
  }, [eintrag, kurzname, search, navigate]);

  if (aktiv) {
    return <div className="min-h-[50vh] bg-background" aria-hidden />;
  }

  return (
    <main className="bg-background">
      <Seo title="Link nicht verfügbar | finanzmuslim" description="Dieser Link ist derzeit nicht verfügbar." path="/out" />
      <div className="container flex min-h-[50vh] flex-col items-center justify-center py-16 text-center">
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">Dieser Link ist nicht verfügbar</h1>
        <p className="mt-3 max-w-md text-[15px] text-muted-foreground">
          Der Link existiert nicht oder ist derzeit nicht aktiv.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-lg bg-primary px-6 text-[15px] font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          Zurück zur Startseite
        </Link>
      </div>
    </main>
  );
};

export default Out;
