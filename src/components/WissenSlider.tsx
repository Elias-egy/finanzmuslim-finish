import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import MotivBild from "@/components/MotivBild";
import { type MotivName } from "@/components/motive";

export type WissenKarte = {
  thema?: string;
  titel: string;
  to?: string;
  /** Motivbild oben in der Karte. */
  motiv?: MotivName;
  /** Eine der vier beliebtesten Karten: kraeftiger Rahmen und Etikett. */
  beliebt?: boolean;
  /** Schlichte Abschlusskarte ohne Motivbild. */
  schlicht?: boolean;
};

/**
 * Waagerechter Schieber fuer die Wissenskarten.
 * Handy: wischen, die naechste Karte ragt angeschnitten ins Bild.
 * Desktop: zusaetzlich Pfeile links/rechts.
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
          const basis =
            "relative w-[260px] shrink-0 snap-start overflow-hidden card-surface sm:w-[300px]";

          if (k.schlicht) {
            return (
              <Link
                key={k.titel}
                to={k.to ?? "/wissen"}
                className={`group ${basis} flex items-center justify-center gap-2 p-6 text-[18px] font-bold text-foreground transition-colors hover:border-primary hover:text-primary`}
              >
                {k.titel}
                <ArrowRight className="h-5 w-5" aria-hidden />
              </Link>
            );
          }

          const inhalt = (
            <>
              <div className="relative w-full bg-hero">
                {k.motiv ? <MotivBild name={k.motiv} /> : <div className="aspect-[16/9] w-full" />}
                {k.beliebt && <span className="badge-new absolute left-3 top-3 z-10">Beliebt</span>}
              </div>
              <div className="p-5">
                {k.thema && (
                  <p className="text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {k.thema}
                  </p>
                )}
                <h3
                  className={`mt-2 text-[18px] font-bold leading-snug ${
                    k.to ? "text-foreground group-hover:text-primary" : "text-muted-foreground"
                  }`}
                >
                  {k.titel}
                </h3>
              </div>
            </>
          );

          return k.to ? (
            <Link
              key={k.titel}
              to={k.to}
              className={`group ${basis} transition-colors hover:border-primary ${
                k.beliebt ? "border-2 border-primary" : ""
              }`}
            >
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
