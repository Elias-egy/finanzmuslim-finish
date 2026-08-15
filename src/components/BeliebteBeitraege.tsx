import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export type BeliebtKarte = {
  titel: string;
  /** Kleines Etikett, immer violett. */
  etikett?: string;
  text?: string;
  to: string;
  /** Schlichte Abschlusskarte ohne Etikett und Text. */
  schlicht?: boolean;
};

/**
 * Waagerecht durchwischbare Reihe. Die naechste Karte ragt angeschnitten
 * ins Bild, damit sichtbar ist, dass rechts mehr kommt.
 */
const BeliebteBeitraege = ({ karten }: { karten: BeliebtKarte[] }) => (
  <div className="-mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-6 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:-mx-10 md:px-10">
    {karten.map((k) =>
      k.schlicht ? (
        <Link
          key={k.titel}
          to={k.to}
          className="group flex w-[280px] shrink-0 snap-start items-center justify-center gap-2 card-surface p-6 text-[18px] font-bold text-foreground transition-colors hover:border-primary hover:text-primary sm:w-[320px]"
        >
          {k.titel}
          <ArrowRight className="h-5 w-5" aria-hidden />
        </Link>
      ) : (
        <Link
          key={k.titel}
          to={k.to}
          className="group flex w-[280px] shrink-0 snap-start flex-col card-surface p-6 transition-colors hover:border-primary sm:w-[320px]"
        >
          {k.etikett && <span className="badge-new self-start">{k.etikett}</span>}
          <h3 className="mt-3 text-[19px] font-bold leading-snug text-foreground group-hover:text-primary">
            {k.titel}
          </h3>
          {k.text && <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{k.text}</p>}
        </Link>
      ),
    )}
  </div>
);

export default BeliebteBeitraege;
