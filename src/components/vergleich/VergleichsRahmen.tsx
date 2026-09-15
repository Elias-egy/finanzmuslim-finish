import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import eliasPortrait from "@/assets/founder-portrait.webp";

/**
 * Die Bauteile, die bei Finanzfluss auf jeder Vergleichsseite gleich sind:
 * Brotkrumen, Titel mit Untertitel, Vertrauensleiste mit Kennzahlen und
 * Prüfdatum, dazu der hervorgehobene Platz für die Empfehlung ganz oben.
 *
 * Sie liegen hier gemeinsam, damit Depot und Girokonto nicht auseinanderlaufen
 * und ein dritter Vergleich nur noch die Daten mitbringen muss.
 */

export const VergleichsBrotkrumen = ({ titel }: { titel: string }) => (
  <nav
    aria-label="Brotkrumen"
    className="flex flex-wrap items-center gap-1 text-[13px] text-muted-foreground"
  >
    <Link to="/" className="hover:text-primary">
      Start
    </Link>
    <ChevronRight className="h-3.5 w-3.5" aria-hidden />
    <Link to="/vergleiche" className="hover:text-primary">
      Vergleiche
    </Link>
    <ChevronRight className="h-3.5 w-3.5" aria-hidden />
    <span className="text-foreground">{titel}</span>
  </nav>
);

/**
 * Kennzahlen und Prüfdatum. Finanzfluss stellt genau das über die Liste, weil
 * es die einzige Stelle ist, an der ein Vergleich seine Arbeit belegt.
 * `stand` ist bewusst Pflicht: ein Vergleich ohne Datum ist wertlos.
 */
export const VergleichsLeiste = ({
  kennzahlen,
  stand,
  standHinweis,
}: {
  kennzahlen: Array<{ zahl: string | number; text: string }>;
  stand: string;
  standHinweis?: string;
}) => (
  <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
    {kennzahlen.map((k) => (
      <div key={k.text} className="rounded-lg border border-border p-4">
        <p className="text-[20px] font-bold text-foreground">{k.zahl}</p>
        <p className="text-[14px] text-muted-foreground">{k.text}</p>
      </div>
    ))}
    <div className="col-span-2 flex items-center gap-3 rounded-lg border border-border p-4">
      <img
        src={eliasPortrait}
        alt="Elias El-Gendy"
        className="h-11 w-11 shrink-0 rounded-full object-cover"
        loading="lazy"
      />
      <div className="min-w-0">
        <p className="truncate text-[15px] font-semibold text-foreground">Elias El-Gendy</p>
        <p className="text-[13px] text-muted-foreground">Stand: {stand}</p>
        {standHinweis && <p className="text-[13px] text-muted-foreground">{standHinweis}</p>}
      </div>
    </div>
  </div>
);

/**
 * Steht dort, wo bei Finanzfluss "Bestes Depot" steht. Solange nicht alle
 * Anbieter geprüft sind, gibt es keine Nummer eins und keine Reihenfolge nach
 * Punkten. Eine vorläufige Rangfolge würde Anbieter bewerten, bei denen wir
 * noch nicht nachgesehen haben.
 */
export const ReihenfolgeHinweis = ({ einheit }: { einheit: string }) => (
  <section className="mt-10 rounded-lg border border-primary/30 bg-hero px-4 py-5 md:px-6">
    <p className="text-[16px] font-bold text-foreground">Die Bewertung folgt, sobald alle {einheit} geprüft sind</p>
    <p className="mt-1 text-[15px] leading-[24px] text-muted-foreground">
      Bis dahin stehen alle {einheit} alphabetisch. Kosten und Konditionen sind eingetragen, die
      Halal-Merkmale prüfen wir einzeln beim Anbieter.
    </p>
  </section>
);
