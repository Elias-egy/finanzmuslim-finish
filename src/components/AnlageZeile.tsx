import { Link } from "react-router-dom";
import { RenditeWert } from "@/components/Rendite";
import { anbieterByName, type Anlage } from "@/data/halalAnlagen";
import { kursFuerAnlage, kursText, type Zeitraum } from "@/lib/kurse";

/**
 * Runde Kachel links in jeder Zeile. Sobald ein Logo hinterlegt ist, wird es
 * gezeigt. Solange keins vorliegt, steht dort das Zeichen der Münze oder das
 * Kürzel des Anbieters. Ein Rückfall bleibt dauerhaft nötig, weil nicht jeder
 * Anbieter ein brauchbares Logo herausgibt.
 */
export const AnlageLogo = ({ a, gross = false }: { a: Anlage; gross?: boolean }) => {
  const anb = anbieterByName(a.anbieter);
  const mass = gross ? "h-12 w-12" : "h-10 w-10";
  return (
    <span
      className={`flex ${mass} shrink-0 items-center justify-center overflow-hidden rounded-full bg-hero`}
      title={a.anbieter}
    >
      {anb?.logo ? (
        <img src={anb.logo} alt={a.anbieter} className="h-full w-full object-contain" />
      ) : a.zeichen ? (
        <span className={`font-bold leading-none text-foreground ${gross ? "text-[26px]" : "text-[22px]"}`}>
          {a.zeichen}
        </span>
      ) : (
        <span className={`font-bold text-foreground ${gross ? "text-[15px]" : "text-[13px]"}`}>
          {anb?.kuerzel ?? a.anbieter.slice(0, 2)}
        </span>
      )}
    </span>
  );
};

/**
 * Eine Zeile der Anlagenliste: Logo, Name mit Kürzel darunter, rechts Kurs und
 * Veränderung. Grün und Rot stehen hier für eine Messung, nicht als Schmuck.
 * Bewusst ohne Art-Etikett, ohne Farbpunkt und ohne Flagge: In einer Liste mit
 * 26 Zeilen ist das dreimal dieselbe Aussage und kostet nur Breite.
 */
const AnlageZeile = ({
  a,
  zeitraum = "r1m",
}: {
  a: Anlage;
  zeitraum?: Zeitraum;
}) => {
  const kurs = kursFuerAnlage(a);
  const preis = kursText(kurs);

  return (
    <Link
      to={`/halal-anlagen/${a.slug}`}
      className="group flex items-center gap-3 rounded-lg px-1 py-2.5 transition-colors hover:bg-hero"
    >
      <AnlageLogo a={a} />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[15px] font-semibold text-foreground group-hover:text-primary">
          {a.name}
        </span>
        <span className="mt-0.5 block truncate text-[13px] text-muted-foreground">
          {a.kuerzel ?? a.isin}
        </span>
      </span>
      <span className="flex shrink-0 flex-col items-end">
        <span className="whitespace-nowrap text-[15px] font-semibold text-foreground">
          {preis ?? "—"}
        </span>
        {/* Dieselbe Darstellung wie in der Liste: Pfeil, Vorzeichen, Farbe. */}
        <RenditeWert wert={kurs?.[zeitraum]} mittel />
      </span>
    </Link>
  );
};

export default AnlageZeile;
