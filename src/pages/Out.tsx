import { useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Seo from "@/components/Seo";
import { findPartnerLink } from "@/data/partnerLinks";
import { ereignis, vorigeSeite } from "@/lib/messung";
import { outZiel } from "@/lib/partnerSprung";

/** Zentrale Weiterleitung fuer Partnerlinks: /out/:kurzname */
const Out = () => {
  const { kurzname } = useParams();
  const { search } = useLocation();
  const navigate = useNavigate();
  const eintrag = findPartnerLink(kurzname);
  const aktiv = Boolean(eintrag?.aktiv);

  useEffect(() => {
    if (!eintrag || !eintrag.aktiv) return;
    // Klick zum Partner: welcher Anbieter, von welcher Seite (die Seite davor, über den Router). Hierher kommt nur,
    // wer im neuen Tab öffnet oder tippt, bevor die Tabelle für den Sofort-Sprung geladen ist (src/lib/partnerKlick.ts).
    // PH4: Ziel aus src/lib/partnerSprung.ts, ohne die 98 KB von investmentStart.ts.
    const ergebnis = outZiel(kurzname, search);
    if (ergebnis) {
      ereignis("partner_klick", { anbieter: kurzname ?? "", weg: "out", ...(ergebnis.direkt ? { direkt: true } : {}), von: vorigeSeite() });
      window.location.replace(ergebnis.ziel);
      return;
    }
    // Ziel ist eine Seite bei uns (Startseite, „Depot da, noch leer“): Abfrageparameter unverändert mitnehmen.
    ereignis("partner_klick", { anbieter: kurzname ?? "", weg: "out", von: vorigeSeite() });
    const params = search.startsWith("?") ? search.slice(1) : search;
    const trenner = eintrag.ziel.includes("?") ? "&" : "?";
    navigate(params ? `${eintrag.ziel}${trenner}${params}` : eintrag.ziel, { replace: true });
  }, [eintrag, kurzname, search, navigate]);

  if (aktiv) {
    // PH4: kurzer Text statt leerer Seite, falls der Sprung einen Augenblick braucht.
    return (
      <main className="flex min-h-[50vh] items-center justify-center bg-background px-4">
        <p className="text-[16px] text-foreground">Weiter zu {eintrag?.anbieter} …</p>
      </main>
    );
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
