import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import AnbieterLogo from "@/components/AnbieterLogo";
import { brokerVergleich } from "@/data/brokerVergleich";

type LogoAnbieter = { name: string; domain?: string };

type Props = {
  titel?: string;
  text?: string;
  knopf?: string;
  ziel?: string;
  /** Andere Logos als die Depots, etwa Girokonten bei Konto-Themen. */
  logos?: LogoAnbieter[];
  /** Wie viele Anbieter der Vergleich insgesamt prüft, für das „+ n“ hinter den Logos. */
  gesamt?: number;
  className?: string;
};

/**
 * Logos nur von Anbietern, die ab Start ohne Zinsen laufen und nicht abgeraten sind.
 * Partner stehen vorn, weil der Klick dort Geld verdient.
 */
const depotLogos = (): LogoAnbieter[] => {
  const gruen = brokerVergleich.filter(
    (b) => b.werte.zinsfreiAbStart === "gut" && !b.abgeraten && b.domain,
  );
  const sortiert = [...gruen.filter((b) => b.link), ...gruen.filter((b) => !b.link)];
  const gesehen = new Set<string>();
  return sortiert.filter((b) => {
    if (gesehen.has(b.domain!)) return false;
    gesehen.add(b.domain!);
    return true;
  });
};

/**
 * Der Haupt-Aufruf unter Rechnern und in Beiträgen (Elias, 21.09.2026):
 * „Finde, was zu dir passt“ statt eines einzelnen Anbieters. Farbe kommt von den
 * echten Logos und vom goldenen Knopf, die Fläche bleibt hell.
 */
export const FindeDeinAngebot = ({
  titel = "Finde, was zu dir passt",
  text = "Beantworte ein paar einfache Fragen. Du siehst, welches Depot ohne Zinsen zu dir passt.",
  knopf = "Jetzt herausfinden",
  ziel = "/vergleich/start",
  logos,
  gesamt,
  className = "",
}: Props) => {
  const alle = logos ?? depotLogos();
  const sichtbar = alle.slice(0, 6);
  const rest = (gesamt ?? (logos ? alle.length : brokerVergleich.length)) - sichtbar.length;

  return (
    <aside
      className={`relative overflow-hidden rounded-3xl border border-primary/15 bg-[linear-gradient(120deg,#EBF2FF_0%,#F4EFFF_55%,#FFF4D8_100%)] p-5 md:p-7 ${className}`}
    >
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between md:gap-8">
        <div className="min-w-0">
          <div className="flex items-center">
            <div className="flex -space-x-2.5">
              {sichtbar.map((a) => (
                <span key={a.name} className="rounded-full bg-white p-[3px] shadow-sm ring-1 ring-black/5">
                  <AnbieterLogo name={a.name} domain={a.domain} />
                </span>
              ))}
            </div>
            {rest > 0 && (
              <span className="ml-3 rounded-full bg-white/80 px-2.5 py-1 text-[13px] font-bold text-foreground ring-1 ring-black/5">
                + {rest}
              </span>
            )}
          </div>
          <h3 className="mt-4 text-[22px] font-extrabold leading-tight text-foreground md:text-[26px]">{titel}</h3>
          <p className="mt-1.5 max-w-[520px] text-[15px] leading-relaxed text-foreground/75 md:text-[16px]">{text}</p>
        </div>
        <Link to={ziel} className="btn-spark shrink-0 md:h-14 md:px-8 md:text-[18px]">
          {knopf}
          <ArrowRight className="h-5 w-5" aria-hidden />
        </Link>
      </div>
    </aside>
  );
};

export default FindeDeinAngebot;
