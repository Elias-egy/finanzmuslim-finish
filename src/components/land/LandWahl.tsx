import { Link, useLocation } from "react-router-dom";
import { Flagge } from "@/components/land/Flagge";
import { LAENDER, LAND_LISTE, landPfad, merkeLand, type Land } from "@/lib/land";
import { useLand } from "@/lib/useLand";

/**
 * Länderwahl oben auf den Vergleichsseiten (DACH1, Elias 23.11.2026: „eine Österreich-Flagge oder Deutschland-Flagge
 * oben“). Drei Einträge mit Flagge und Kürzel, der aktuelle ist hervorgehoben. Jeder Eintrag ist ein echter Link auf die
 * Adresse der Länderversion (Crawler folgen ihm), der Klick merkt die Wahl im Cookie `fm_land`.
 *
 * Aussehen wie die übrige Seite: weißer Grund, feine Kante, Blau nur für die Wahl.
 */
export const LandWahl = ({ className = "" }: { className?: string }) => {
  const aktuell = useLand();
  const { pathname, search } = useLocation();

  return (
    <nav aria-label="Land wählen" className={className}>
      <ul className="-my-2 inline-flex items-center gap-0.5 rounded-lg border border-border bg-card p-0.5 md:my-0 md:gap-1 md:p-1">
        {LAND_LISTE.map((land: Land) => {
          const aktiv = land === aktuell;
          return (
            <li key={land}>
              <Link
                to={`${landPfad(pathname, land)}${search}`}
                onClick={() => merkeLand(land)}
                aria-current={aktiv ? "true" : undefined}
                aria-label={LAENDER[land].name}
                title={LAENDER[land].name}
                className={`inline-flex min-h-[36px] items-center gap-2 rounded-md px-2.5 text-[14px] font-semibold transition-colors md:min-h-[34px] md:px-3 ${
                  aktiv ? "bg-accent text-primary" : "text-foreground hover:bg-muted"
                }`}
              >
                <Flagge land={land} />
                <span className="hidden sm:inline">{LAENDER[land].kurz}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
