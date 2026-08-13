import { useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type WissenKarte = { thema: string; titel: string; to?: string };

/** Leere Bildflaeche: gleiches Seitenverhaeltnis wie spaetere Artikelbilder. */
const Bildflaeche = () => <div className="aspect-[16/10] w-full bg-hero" aria-hidden />;

/**
 * Waagerechter Schieber fuer die Wissenskarten.
 * Handy: wischen. Desktop: Pfeile links/rechts. Die naechste Karte wird
 * am rechten Rand angeschnitten, damit sichtbar ist, dass es weitergeht.
 */
const WissenSlider = ({ karten }: { karten: WissenKarte[] }) => {
  const spur = useRef<HTMLDivElement>(null);

  const scrollen = (richtung: -1 | 1) =>
    spur.current?.scrollBy({ left: richtung * 340, behavior: "smooth" });

  return (
    <div className="relative">
      <div className="absolute -top-14 right-0 hidden gap-2 md:flex">
        <button
          type="button"
          aria-label="Zurück"
          onClick={() => scrollen(-1)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-primary hover:text-primary"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden />
        </button>
        <button
          type="button"
          aria-label="Weiter"
          onClick={() => scrollen(1)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-primary hover:text-primary"
        >
          <ChevronRight className="h-5 w-5" aria-hidden />
        </button>
      </div>

      <div
        ref={spur}
        className="-mx-2 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-2 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {karten.map((k) => {
          const inhalt = (
            <>
              <Bildflaeche />
              <div className="p-5">
                <p className="text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {k.thema}
                </p>
                <h3
                  className={`mt-2 text-[19px] font-bold leading-snug ${
                    k.to ? "text-foreground group-hover:text-primary" : "text-muted-foreground"
                  }`}
                >
                  {k.titel}
                </h3>
              </div>
            </>
          );

          const basis =
            "relative w-[280px] shrink-0 snap-start overflow-hidden card-surface sm:w-[320px]";

          return k.to ? (
            <Link key={k.titel} to={k.to} className={`group ${basis} transition-colors hover:border-primary`}>
              {inhalt}
            </Link>
          ) : (
            <div key={k.titel} aria-disabled="true" className={`${basis} opacity-60`}>
              <span className="badge-soon absolute right-3 top-3 z-10">bald</span>
              {inhalt}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WissenSlider;
