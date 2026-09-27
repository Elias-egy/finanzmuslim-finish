import { Navigate, useParams } from "react-router-dom";
import { Check } from "lucide-react";
import Seo from "@/components/Seo";
import OptinKarte from "@/components/optin/OptinKarte";
import { optinFreebie } from "@/data/optin";

/**
 * /gratis/<freebie>: die Opt-in-Seite, auf die die Instagram-DM zeigt
 * (`?src=dm<stichwort>`, z. B. `dmaktie`). Ohne Menü, eine Karte, ein Ziel. noindex, weil sie keinen
 * eigenen Suchbegriff hat; wer über Google kommt, landet auf der offenen Seite.
 */
const punkte = ["Kostenlos", "Abmelden mit einem Klick", "Bestätigung per Mail"];

const Gratis = () => {
  const { freebie: id } = useParams();
  const freebie = optinFreebie(id);
  if (!freebie) return <Navigate to="/vorlagen" replace />;

  return (
    <div className="container py-6 md:py-12">
      <Seo
        title={`${freebie.name} gratis holen | finanzmuslim`}
        description={freebie.nutzen}
        path={`/gratis/${freebie.id}`}
        noindex
      />
      <div className="mx-auto max-w-[520px]">
        <OptinKarte freebie={freebie} variante="seite" />
        <ul className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[13px] text-muted-foreground">
          {punkte.map((p) => (
            <li key={p} className="inline-flex items-center gap-1.5">
              <Check className="h-4 w-4 text-primary" aria-hidden />
              {p}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Gratis;
