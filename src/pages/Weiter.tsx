import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Seo from "@/components/Seo";
import { findStartPartner } from "@/data/investmentStart";

/**
 * /weiter/:kurzname: Ziel der Knöpfe, deren Partnerlink ein Werbeblocker verstecken würde (`blockerFest` in
 * src/lib/direktLink.ts). Ein normaler Klick geht direkt zum Anbieter; hier landen nur Mittelklick, neuer Tab und
 * Aufrufe ohne JavaScript im Knopf. Die Seite leitet sofort auf den Partnerlink weiter.
 */
const Weiter = () => {
  const { kurzname } = useParams();
  const partner = findStartPartner(kurzname);

  useEffect(() => {
    if (partner) window.location.replace(partner.link.replace("{SUBID}", "startw"));
  }, [partner]);

  if (partner) return <div className="min-h-[50vh] bg-background" aria-hidden />;

  return (
    <main className="bg-background">
      <Seo title="Link nicht verfügbar | finanzmuslim" description="Dieser Link ist derzeit nicht verfügbar." path="/weiter" noindex />
      <div className="container flex min-h-[50vh] flex-col items-center justify-center py-16 text-center">
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">Dieser Link ist nicht verfügbar</h1>
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

export default Weiter;
