import { Link } from "react-router-dom";
import { KASTEN, type LeiterWort } from "@/data/leiter";

type Props = {
  wort: LeiterWort;
  className?: string;
};

/**
 * Der Kasten „Dein nächster Schritt“ ganz am Ende jedes Freebies, gebaut wie der Abschluss des alten
 * Einsteiger-Guides (`src/guides/einsteiger.html` Seite 10): Der Profi-Guide liegt bereit, kommt aber erst
 * nach einem kleinen Schritt und der Antwort FERTIG. Verlinkt ist nur der Schritt, nie die Belohnung
 * (Elias 28.10.2026: kein Verweis, der vom Freebie wegführt). Wortlaut in `src/data/leiter.ts`.
 */
const NaechsterTeil = ({ wort, className = "" }: Props) => {
  // Klickzählung: k plus Wort, eingetragen in src/lib/attribution.ts.
  const ziel = `${KASTEN.link.ziel}?src=k${wort}`;
  return (
    <aside
      aria-labelledby="naechster-teil"
      data-naechster-teil={wort}
      className={`rounded-3xl border border-primary/15 bg-accent p-5 md:p-7 ${className}`}
    >
      <p className="text-[14px] font-bold text-violet">Dein nächster Schritt</p>
      <h2 id="naechster-teil" className="mt-1 text-[22px] font-extrabold leading-tight text-foreground md:text-[26px]">
        {KASTEN.titel}
      </h2>
      <p className="mt-3 text-[16px] leading-snug text-foreground">{KASTEN.grund}</p>
      <ol className="mt-4 space-y-3 text-[16px] leading-snug text-foreground">
        <li className="flex gap-3">
          <span className="w-5 shrink-0 font-extrabold text-violet">1.</span>
          <span>
            {KASTEN.schritt}{" "}
            <Link to={ziel} className="font-semibold text-primary underline underline-offset-2">
              {KASTEN.link.text}
            </Link>
            {KASTEN.zaehlt}
          </span>
        </li>
        <li className="flex gap-3">
          <span className="w-5 shrink-0 font-extrabold text-violet">2.</span>
          <span>
            {KASTEN.fertig.split("FERTIG")[0]}
            <strong>FERTIG</strong>
            {KASTEN.fertig.split("FERTIG")[1]}
          </span>
        </li>
      </ol>
      <p className="mt-4 text-[16px] font-bold leading-snug text-foreground">Du wirst ihn mit anderen Augen lesen. Versprochen.</p>
    </aside>
  );
};

export default NaechsterTeil;
