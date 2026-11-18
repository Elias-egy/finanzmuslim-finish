import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ereignis } from "@/lib/messung";
import { ArrowRight } from "lucide-react";
import type { LeiterWort } from "@/data/leiter";
import { DEPOTS_GETESTET, KONTEN_GETESTET, type CheckQuelle } from "@/data/halalFinanzCheck";
import { stimmenUnten } from "@/data/checkStimmen";
import { StimmeKarte } from "@/components/CheckStimme";
import "@/styles/checkEinstieg.css";

/** Quelle des Checks je Freebie (wie beim Kasten oben); der ETF-Plan hat keine eigene, sein Knopf öffnet /check ohne Quelle. */
const QUELLE_JE_WORT: Record<LeiterWort, CheckQuelle | undefined> = {
  liste: "halal-anlagen",
  aktie: "aktienliste",
  vertrag: "vertrags-ampel",
  amin: "rizq",
  boykott: "boykottliste",
  plan: "portfolio-plan",
  etf: "etf-plan",
  gold: "gold-plan",
  sukuk: "sukuk-plan",
};

type Props = {
  /** Wort des Freebies; fehlt es (Auto-Abo, Baraka-Blocker, Broker-Vergleich), zählt die Quelle. */
  wort?: LeiterWort;
  /** RN16-42: direkte Quelle für Seiten ohne LeiterWort; sie geht dem Wort vor. */
  quelle?: CheckQuelle;
  className?: string;
};

/**
 * RN16-41: größer, mit zwei weiteren Stimmen (nicht die zwei vom Kasten oben).
 * RN16-13 (Elias 17.11.2026: „unten bei Blueprint also den Blueprint austauschen und nochmal eine kleinere Werbung für das Match machen“):
 * statt des Guides steht am Ende jedes Freebies eine kleine Werbung für den Check mit einem Knopf „Match finden“. Die Messung
 * freebie_ende bleibt. Früher:
 * Der Kasten „Dein nächster Schritt“ ganz am Ende jedes Freebies, gebaut wie der Abschluss des alten
 * Einsteiger-Guides (`src/guides/einsteiger.html` Seite 10): Der Profi-Guide liegt bereit, kommt aber erst
 * nach einem kleinen Schritt und der Antwort FERTIG. Verlinkt ist nur der Schritt, nie die Belohnung
 * (Elias 28.10.2026: kein Verweis, der vom Freebie wegführt). Wortlaut in `src/data/leiter.ts`.
 */
// RN16-42 (Elias: „nur noch diesen einen Call to Action … immer gleich“): `quelle` ersetzt die Pflicht zum Wort.
const NaechsterTeil = ({ wort, quelle: quelleDirekt, className = "" }: Props) => {
  const quelle = quelleDirekt ?? (wort ? QUELLE_JE_WORT[wort] : undefined);
  // Messung (CV4): Kommt der Kasten ins Bild, hat der Besucher das Freebie bis zum Ende gelesen. Einmal je Aufruf.
  const kasten = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = kasten.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const beobachter = new IntersectionObserver((eintraege) => {
      if (!eintraege.some((e) => e.isIntersecting)) return;
      ereignis("freebie_ende", { wort: wort ?? quelle, seite: window.location.pathname });
      beobachter.disconnect();
    }, { threshold: 0.3 });
    beobachter.observe(el);
    return () => beobachter.disconnect();
  }, [wort, quelle]);
  const stimmen = stimmenUnten(quelle, import.meta.env.DEV);
  return (
    <aside
      ref={kasten}
      aria-labelledby="naechster-teil"
      data-naechster-teil={wort ?? quelle}
      data-match-ende
      className={`ce ${className}`}
    >
      <h2 id="naechster-teil" className="ce-titel scroll-mt-32">
        Dein Match in unter 60 Sekunden
      </h2>
      <p className="ce-satz">
        Aus {KONTEN_GETESTET} Bankkonten und {DEPOTS_GETESTET} Depots, die ich alle selbst getestet habe.
      </p>
      {/* RN16-41 („nicht so winzig … mindestens noch zwei Testimonials rein. Unten. Zwei unwichtigere zu dem Thema“) */}
      {stimmen.length > 0 && (
        <div className="ce-stimmen" data-stimmen={stimmen.length}>
          <div className="ce-stimmen-band">
            {stimmen.map((s) => (
              <StimmeKarte key={s.id} s={s} />
            ))}
          </div>
        </div>
      )}
      <Link
        to={quelle ? `/check?quelle=${quelle}` : "/check"}
        onClick={() => ereignis("freebie_check_klick", { check: true, quelle: quelle ?? "keine", im: "freebie", stelle: "ende", wort: wort ?? quelle })}
        className="ce-knopf"
      >
        Match finden
        <ArrowRight aria-hidden />
      </Link>
    </aside>
  );
};

export default NaechsterTeil;
