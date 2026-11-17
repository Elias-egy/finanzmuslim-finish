import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ereignis } from "@/lib/messung";
import { ArrowRight } from "lucide-react";
import type { LeiterWort } from "@/data/leiter";
import { DEPOTS_GETESTET, KONTEN_GETESTET, type CheckQuelle } from "@/data/halalFinanzCheck";
import "@/styles/checkEinstieg.css";

/** Quelle des Checks je Freebie (wie beim Kasten oben); der ETF-Plan hat keine eigene, sein Knopf öffnet /check ohne Quelle. */
const QUELLE_JE_WORT: Record<LeiterWort, CheckQuelle | undefined> = {
  liste: "halal-anlagen",
  aktie: "aktienliste",
  vertrag: "vertrags-ampel",
  amin: "rizq",
  boykott: "boykottliste",
  plan: "portfolio-plan",
  etf: undefined,
  gold: "gold-plan",
  sukuk: "sukuk-plan",
};

type Props = {
  wort: LeiterWort;
  className?: string;
};

/**
 * RN16-13 (Elias 17.11.2026: „unten bei Blueprint also den Blueprint austauschen und nochmal eine kleinere Werbung für das Match machen“):
 * statt des Guides steht am Ende jedes Freebies eine kleine Werbung für den Check mit einem Knopf „Match finden“. Die Messung
 * freebie_ende bleibt. Früher:
 * Der Kasten „Dein nächster Schritt“ ganz am Ende jedes Freebies, gebaut wie der Abschluss des alten
 * Einsteiger-Guides (`src/guides/einsteiger.html` Seite 10): Der Profi-Guide liegt bereit, kommt aber erst
 * nach einem kleinen Schritt und der Antwort FERTIG. Verlinkt ist nur der Schritt, nie die Belohnung
 * (Elias 28.10.2026: kein Verweis, der vom Freebie wegführt). Wortlaut in `src/data/leiter.ts`.
 */
const NaechsterTeil = ({ wort, className = "" }: Props) => {
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
  const quelle = QUELLE_JE_WORT[wort];
  return (
    <aside
      ref={kasten}
      aria-labelledby="naechster-teil"
      data-naechster-teil={wort}
      data-match-ende
      className={`ce ${className}`}
    >
      <h2 id="naechster-teil" className="ce-titel ce-titel--klein scroll-mt-32">
        Dein Match in unter 60 Sekunden
      </h2>
      <p className="ce-satz">
        Aus {KONTEN_GETESTET} Bankkonten und {DEPOTS_GETESTET} Depots, die ich alle selbst getestet habe.
      </p>
      <Link
        to={quelle ? `/check?quelle=${quelle}` : "/check"}
        onClick={() => ereignis("freebie_check_klick", { check: true, quelle: quelle ?? "keine", im: "freebie", stelle: "ende", wort })}
        className="ce-knopf"
      >
        Match finden
        <ArrowRight aria-hidden />
      </Link>
    </aside>
  );
};

export default NaechsterTeil;
