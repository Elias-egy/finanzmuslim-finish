import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ereignis } from "@/lib/messung";
import { DECKBLATT_GROSS, GUIDE_NAME, KASTEN, NAECHSTE_FRAGE, seitenBild, type LeiterWort } from "@/data/leiter";

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
  const frage = NAECHSTE_FRAGE[wort];
  // Messung (CV4): Kommt der Kasten ins Bild, hat der Besucher das Freebie bis zum Ende gelesen. Einmal je Aufruf.
  const kasten = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = kasten.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const beobachter = new IntersectionObserver((eintraege) => {
      if (!eintraege.some((e) => e.isIntersecting)) return;
      ereignis("freebie_ende", { wort, seite: window.location.pathname });
      beobachter.disconnect();
    }, { threshold: 0.3 });
    beobachter.observe(el);
    return () => beobachter.disconnect();
  }, [wort]);
  return (
    <aside
      ref={kasten}
      aria-labelledby="naechster-teil"
      data-naechster-teil={wort}
      className={`guide-glanz rounded-3xl bg-accent p-5 md:p-7 ${className}`}
    >
      <p className="text-[14px] font-bold text-violet">Dein nächster Schritt</p>
      <h2
        id="naechster-teil"
        className="mt-1 scroll-mt-32 text-[22px] font-extrabold leading-tight text-foreground md:text-[26px]"
      >
        {KASTEN.titel}
      </h2>
      {/* MC7d17 (Elias 02.11.2026): ein richtiges Bild vom Guide, erst die Frage fett, dann die Seiten übersichtlich,
          kein grauer Satz davor. Das Bild zeigt Deckblatt und zwei der genannten Seiten aus dem PDF. */}
      <div className="mt-4 rounded-2xl bg-background p-4 md:p-5">
        <div data-kasten-bild className="relative mx-auto h-[178px] w-[260px]" aria-hidden="true">
          <img
            src={seitenBild(frage.seiten[1].nr)}
            alt=""
            width={360}
            height={510}
            className="absolute left-0 top-4 w-[108px] -rotate-[9deg] rounded-md border border-primary/15 shadow-md"
          />
          <img
            src={seitenBild(frage.seiten[2].nr)}
            alt=""
            width={360}
            height={510}
            className="absolute right-0 top-4 w-[108px] rotate-[9deg] rounded-md border border-primary/15 shadow-md"
          />
          {/* Eigene Hülle, weil .glanz-bild position: relative setzt und absolute sonst überschreibt. */}
          <div className="absolute left-1/2 top-0 w-[122px] -translate-x-1/2">
            <span className="glanz-bild block rounded-md">
              <img
                src={DECKBLATT_GROSS}
                alt=""
                width={360}
                height={510}
                className="block h-auto w-full rounded-md border border-primary/20 shadow-xl"
              />
            </span>
          </div>
        </div>
        <p className="sr-only">{`Deckblatt und zwei Seiten aus dem ${GUIDE_NAME}`}</p>
        <p className="mt-4 text-[18px] font-extrabold leading-snug text-foreground">{frage.frage}</p>
        <ul className="mt-3 grid gap-2">
          {frage.seiten.map((s) => (
            <li key={s.nr} className="flex items-center gap-3 rounded-xl bg-accent/70 p-2 pr-3">
              <img
                src={seitenBild(s.nr)}
                alt=""
                width={360}
                height={510}
                className="w-9 shrink-0 rounded-[3px] border border-primary/15 bg-white"
              />
              <span className="shrink-0 whitespace-nowrap rounded-full bg-violet/10 px-2 py-0.5 text-[13px] font-bold tabular-nums text-violet">
                S. {s.nr}
              </span>
              <span className="text-[16px] font-semibold leading-snug text-foreground">{s.titel}</span>
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-5 text-[17px] font-bold leading-snug text-foreground">{KASTEN.grund}</p>
      <ol className="mt-3 space-y-3 text-[16px] leading-snug text-foreground">
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
      <p className="mt-2 text-[16px] leading-snug text-foreground">
        <a
          href={KASTEN.mail.ziel}
          className="inline-flex min-h-[44px] items-center font-semibold text-primary underline underline-offset-2"
        >
          {KASTEN.mail.text}
        </a>
      </p>
      <p className="mt-4 text-[16px] font-bold leading-snug text-foreground">
        Du wirst ihn mit anderen Augen lesen. Versprochen.
      </p>
    </aside>
  );
};

export default NaechsterTeil;
