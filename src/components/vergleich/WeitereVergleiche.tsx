import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { hatLandVersion, landFreigegeben } from "@/data/land";
import { landPfad, type Land } from "@/lib/land";

/**
 * Unten auf jeder Vergleichsseite (VG3, Elias VG2-05 23.11.2026: „Und dann kannst du auch unten irgendwie zu allen
 * Vergleichen nehmen, ne? Weil hier sehe ich nicht gerade zu allen Vergleichen.“). Vorbild Finanzfluss: am Ende der Seite
 * „Weitere Girokonto-Vergleiche“ als Linkreihe. Die Reihe nennt die Vergleiche, die auf /vergleiche vorn stehen, ohne die
 * eigene Seite, dazu der Weg zu allen Vergleichen. Auf Länderseiten nur, was es im Land fertig gibt.
 */
export const VORNE: { to: string; name: string }[] = [
  { to: "/vergleich/geschaeftskonto", name: "Geschäftskonto" },
  { to: "/vergleich/depot", name: "Depot" },
  { to: "/vergleich/etf-sparplan", name: "ETF-Sparplan" },
  { to: "/vergleich/edelmetalle", name: "Edelmetalle" },
  { to: "/vergleich/girokonto", name: "Girokonto" },
  { to: "/vergleich/krypto", name: "Krypto" },
];

export const weitereFuer = (pfad: string, land: Land) =>
  VORNE.filter((v) => v.to !== pfad)
    .filter((v) => land === "de" || (hatLandVersion(v.to) && landFreigegeben(land, v.to)))
    .map((v) => ({ ...v, to: landPfad(v.to, land) }));

export const WeitereVergleiche = ({ pfad, land, className = "" }: { pfad: string; land: Land; className?: string }) => {
  const weitere = weitereFuer(pfad, land);
  return (
    <nav aria-labelledby="weitere-vergleiche" className={`mt-12 ${className}`}>
      <h2 id="weitere-vergleiche" className="text-2xl font-bold text-foreground">
        Weitere Vergleiche
      </h2>
      {weitere.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2.5">
          {weitere.map((v) => (
            <li key={v.to}>
              <Link
                to={v.to}
                className="inline-flex min-h-[44px] items-center rounded-lg border border-border px-4 text-[15px] text-primary transition-colors hover:border-primary"
              >
                {v.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
      <Link
        to={landPfad("/vergleiche", land)}
        className="mt-5 inline-flex min-h-[48px] items-center gap-2 rounded-full border border-border bg-background px-6 text-[16px] font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
      >
        Alle Vergleiche
        <ArrowRight className="h-5 w-5" aria-hidden />
      </Link>
    </nav>
  );
};
