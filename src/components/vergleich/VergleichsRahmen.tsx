import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import eliasPortrait from "@/assets/founder-portrait.png";

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
 * Der hervorgehobene Platz ganz oben, bei Finanzfluss "Bestes Depot".
 * Solange keine Bewertung vorliegt, steht hier ausdrücklich, dass der Platz
 * leer ist. Eine erfundene Nummer eins waere der teuerste Fehler auf einer
 * Seite, die von Vertrauen lebt.
 */
export const EmpfehlungsPlatz = ({
  etikett,
  begruendung,
}: {
  etikett: string;
  begruendung: string;
}) => (
  <section
    className="mt-10 overflow-hidden rounded-lg border border-primary/30 bg-hero"
    aria-label={etikett}
  >
    <p className="bg-primary/10 px-4 py-2 text-center text-[13px] font-semibold text-primary">
      {etikett}
    </p>
    <div className="px-4 py-6 text-center md:py-8">
      <p className="text-[17px] font-bold text-foreground">Noch nicht vergeben</p>
      <p className="mx-auto mt-2 max-w-xl text-[15px] leading-[24px] text-muted-foreground">
        {begruendung}
      </p>
    </div>
  </section>
);
