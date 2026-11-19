import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Seo from "@/components/Seo";
import { startLink } from "@/data/startLinks";

/**
 * /weiter/:kurzname: Ziel der Knöpfe, deren Partnerlink ein Werbeblocker verstecken würde (`blockerFest` in
 * src/lib/direktLink.ts). Ein normaler Klick geht direkt zum Anbieter; hier landen nur Mittelklick, neuer Tab und
 * Aufrufe ohne JavaScript im Knopf. Die Seite leitet sofort auf den Partnerlink weiter.
 */
const Weiter = () => {
  const { kurzname } = useParams();
  // PH4: Link aus der kleinen Tabelle, ohne die 98 KB von investmentStart.ts.
  const link = startLink(kurzname);

  useEffect(() => {
    if (link) window.location.replace(link.replace("{SUBID}", "startw"));
  }, [link]);

  if (link)
    return (
      <main className="flex min-h-[50vh] items-center justify-center bg-background px-4">
        <p className="text-[16px] text-foreground">Weiter zum Anbieter …</p>
      </main>
    );

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
