import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { ereignis } from "@/lib/messung";
import { AnbieterLogo } from "@/components/AnbieterLogo";
import { stimmenAn } from "@/data/checkStimmen";
import { StimmeKarte } from "@/components/CheckStimme";
import { KEINE_BANK } from "@/data/bankSuche";
import {
  ART_JE_QUELLE,
  DEPOTS_GETESTET,
  ETIKETT,
  FRAGEN,
  KONTEN_GETESTET,
  zielFrage,
  type Antworten,
  type CheckQuelle,
} from "@/data/halalFinanzCheckKern";
import { ergebnisAus } from "@/data/halalFinanzCheck";
import "@/styles/checkEinstieg.css";

/**
 * Werbung für den Check in jedem Freebie (RN5, RN8; neu RN16-09 am 17.11.2026).
 *
 * Elias RN16-09: „Der Test soll nicht direkt drin sein, sondern nur ein Link … ein reines Werbeding“, oben kein Foto, nur der Satz
 * „Bankkonten selbst getestet und die gesucht, die du als Muslim am besten nehmen kannst“, darunter „eine kleine Visualisierung des
 * Quizzes … lustig, geil … hilfreich“ wie sein Bild (Vault raw/2026-11-17-elias-rn16-09-bild-1-quiz-ausschnitt.png), darunter die Stimme
 * wie die weiße Karte (raw/…-bild-2-stimme.png), „nicht so in Orange“, und genau ein Knopf: „Ich will wirklich, dass ein Knopf gezeigt
 * wird. Und die Leute wollen nur auf diesen Knopf drücken.“ Der Knopf öffnet den Check ganz normal (/check?quelle=…, erst die
 * Verkaufsseite mit Elias), nie „Quiz starten“.
 *
 * Die Vorschau spielt einen echten Weg durch den Check: Konto „Neues Bankkonto“, „Viel Bargeld“, Ergebnis BBBank; Depot „Depot zum
 * Investieren“, „Möglichst viele Halal-Anlagen“, Ergebnis flatex. Match und Prozent rechnet ergebnisAus, nichts von Hand (RN15-03:
 * bewusst nicht die norisbank, damit das eigene Ergebnis nicht abgesprochen wirkt). Wer weniger Bewegung will, sieht gleich das Ende.
 *
 * Stimme: nur echte aus checkStimmen.ts; ohne echte zeigt nur der Entwicklungsmodus eine Beispiel-Stimme, die Produktion nichts.
 * Eigenschaften (rückwärts verträglich): `quelle` (Pflicht), `className` (optional).
 */

type Weg = { frage1: string; wahl1: string; frage2: string; wahl2: string; antworten: Antworten };

const WEG: Record<"konto" | "depot", Weg> = {
  konto: {
    frage1: FRAGEN.ziel.titel,
    wahl1: "konto",
    frage2: FRAGEN.zahlung.titel,
    wahl2: "Viel Bargeld",
    antworten: { ziel: "konto", zahlung: "bar", bank: KEINE_BANK },
  },
  depot: {
    frage1: FRAGEN.ziel.titel,
    wahl1: "invest",
    frage2: FRAGEN.praef.titel,
    wahl2: "Möglichst viele Halal-Anlagen",
    antworten: { ziel: "invest", hatDepot: "nein", praef: "halal", anlage: "etf" },
  },
};

/** Schritte der Vorschau: 0 leer, 1 Frage 1, 2 Antworten, 3 getippt, 4 Frage 2, 5 getippt, 6 Match, 7 Ring voll. */
const LETZTER = 7;
const TAKT = [600, 700, 900, 900, 800, 900, 700, 3200];

const useVorschau = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [schritt, setSchritt] = useState(LETZTER);
  useEffect(() => {
    const ruhig = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (ruhig || typeof IntersectionObserver === "undefined" || !ref.current) return;
    let sichtbar = false;
    let t: ReturnType<typeof setTimeout> | undefined;
    let s = 0;
    const weiter = () => {
      if (!sichtbar) return;
      s = s >= LETZTER ? 0 : s + 1;
      setSchritt(s);
      t = setTimeout(weiter, TAKT[s]);
    };
    const io = new IntersectionObserver(([e]) => {
      const vorher = sichtbar;
      sichtbar = e.isIntersecting;
      if (sichtbar && !vorher) {
        s = 0;
        setSchritt(0);
        t = setTimeout(weiter, TAKT[0]);
      } else if (!sichtbar && t) {
        clearTimeout(t);
        setSchritt(LETZTER);
      }
    }, { threshold: 0.35 });
    io.observe(ref.current);
    return () => {
      io.disconnect();
      if (t) clearTimeout(t);
    };
  }, []);
  return { ref, schritt };
};

/**
 * Stimmen (Elias RN16-10: „Testimonials vielleicht 2, 3 Stück“, RN16-11: „wenige Leute swipen bei Testimonials … untereinander“):
 * bis zu drei Karten untereinander. Nur echte aus checkStimmen.ts; ohne echte zeigt nur der Entwicklungsmodus Beispiel-Stimmen
 * (als Platzhalter markiert), die Produktion nichts. Eine einzelne Stimme steht in voller Breite.
 */
/** Elias RN16-13: „dann die 2 Testimonials“. */
export const STIMMEN_MAX = 2;

/** Titel und Satz (Elias RN16-12: „54 Bankkonten, 35 Depots. Ich habe sie alle getestet. Und dann unten … um Muslimen zu helfen, habe
 * ich einen riesen Vergleich aufgestellt“; „Nicht Girokonten, man kann hier erstmal Bankkonten schreiben“). Zahlen aus halalFinanzCheck.ts. */
export const TITEL_ZAHLEN = `${KONTEN_GETESTET} Bankkonten, ${DEPOTS_GETESTET} Depots.`;
export const TITEL = "Ich habe sie alle getestet.";
/** RN16-15 („Um Muslim zu helfen, das ist nicht so gut … die meisten Muslime wissen nicht, dass ihr Konto Zinsen zahlt … Mehr FOMO.
 * Deswegen habe ich den Test erstellt, der nach ein paar Fragen dir sagt, welcher Anbieter deinen Halal-Wünschen am besten entspricht“).
 * „ob“ statt „dass“: dass die meisten Konten Zinsen zahlen, ist nicht belegt. */
// RN16-19: Elias' Wortlaut („Viele Muslime wissen nicht, dass ihr Bankkonto ihnen Zinsen zahlt oder ein Dispo einräumt. Deshalb habe ich
// fast 90 Anbieter verglichen und einen Test gebaut. Und dann das danach.“); 54 Bankkonten und 35 Depots sind 89.
export const SATZ = "Viele Muslime wissen nicht, dass ihr Bankkonto ihnen Zinsen zahlt oder einen Dispo einräumt. Deshalb habe ich fast 90 Anbieter verglichen und einen Test gebaut: Nach ein paar Fragen weißt du, welcher Anbieter am besten zu deinen Halal-Wünschen passt.";

const StimmenReihe = ({ quelle }: { quelle: CheckQuelle }) => {
  // RN16-32: zwei passende Stimmen je Freebie (Konto-Freebies Matin und Bank nebeneinander, Aktien-Liste Skeptisch und Reuf …);
  // live nur bestätigte, im Entwicklungsmodus alle, unbestätigte als Platzhalter markiert.
  const liste = stimmenAn(quelle, import.meta.env.DEV).slice(0, STIMMEN_MAX);
  if (!liste.length) return null;
  return (
    <div className="ce-stimmen" data-stimmen={liste.length}>
      <div className="ce-stimmen-band">
        {liste.map((s) => (
          <StimmeKarte key={s.id} s={s} />
        ))}
      </div>
    </div>
  );
};

/** Elias RN16-13: „2 Call to Actions … Einer unter dem Satz … dann kommt das Video, dann die 2 Testimonials und dann nochmal Match finden“. */
const Knopf = ({ quelle, art, stelle }: { quelle: CheckQuelle; art: string; stelle: "oben" | "unten" }) => (
  <Link
    to={`/check?quelle=${quelle}`}
    onClick={() => ereignis("freebie_check_klick", { check: true, quelle, art, im: "freebie", stelle })}
    className={`ce-knopf ce-knopf--${stelle}`}
  >
    Match finden
    <ArrowRight aria-hidden />
  </Link>
);

const CheckEinstieg = ({ quelle, className = "" }: { quelle: CheckQuelle; className?: string }) => {
  const art = ART_JE_QUELLE[quelle] ?? "konto";
  const weg = WEG[art];
  const e = ergebnisAus(weg.antworten, quelle);
  const { ref, schritt } = useVorschau();
  const an = (n: number) => (schritt >= n ? " ce-an" : "");
  const prozent = e?.passung ?? 0;
  return (
    <aside data-check-einstieg={quelle} data-art={art} aria-labelledby={`check-${quelle}`} className={`ce ${className}`}>
      <h2 id={`check-${quelle}`} className="ce-titel">
        <span className="ce-titel-zahlen">{TITEL_ZAHLEN}</span> {TITEL}
      </h2>
      <p className="ce-satz">
        {/* RN16-20: drei Stellen leicht fett zum Überfliegen: Zinsen, Dispo, fast 90 Anbieter */}
        {SATZ.split(/(Zinsen|Dispo|fast 90 Anbieter)/).map((t, i) => (i % 2 ? <strong key={i}>{t}</strong> : t))}
      </p>
      <Knopf quelle={quelle} art={art} stelle="oben" />

      <div ref={ref} className="ce-buehne" aria-hidden data-schritt={schritt}>
        <div className={`ce-reihe${an(1)}`}>
          <img src="/elias-el-gendy.webp" alt="" width={28} height={28} loading="lazy" />
          <span className="ce-blase">{weg.frage1}</span>
        </div>
        <div className={`ce-wahlen${an(2)}`}>
          {zielFrage(quelle)
            .optionen.slice(0, 2)
            .map((o) => (
              <span key={o.wert} className={`ce-wahl${o.wert === weg.wahl1 && schritt >= 3 ? " ce-wahl--getippt" : ""}`}>
                <span className="ce-wahl-text">{o.titel}</span>
                {o.etikett === ETIKETT && <span className="ce-etikett">beliebt</span>}
                {o.hinweis && <span className="ce-etikett ce-etikett--hinweis">{o.hinweis}</span>}
              </span>
            ))}
        </div>
        <div className={`ce-reihe${an(4)}`}>
          <img src="/elias-el-gendy.webp" alt="" width={28} height={28} loading="lazy" />
          <span className="ce-blase">{weg.frage2}</span>
        </div>
        <div className={`ce-wahlen${an(4)}`}>
          <span className={`ce-wahl${schritt >= 5 ? " ce-wahl--getippt" : ""}`}>{weg.wahl2}</span>
        </div>
        {e && (
          <div className={`ce-match${an(6)}`}>
            <span className="ce-match-kopf">Dein Match</span>
            <span className="ce-match-zeile">
              {/* RN17-03 (Elias: „dein Match bei BB Bank in der Animation ist irgendwie noch nicht so richtig gut“): das Logo war oben
                  abgeschnitten und verzerrt (eigene Höhe 30 px gegen das Logomaß). Jetzt wie im Ergebnis auf weißer Platte in seinem
                  eigenen Maß, darunter der Kartentitel mit grünem Haken. */}
              <span className={`ce-match-logo${e.anbieter.kurz === "no" ? " hc-wb-platte--noris" : ""}`}>
                <AnbieterLogo name={e.anbieter.name} domain={e.anbieter.domain} gross />
              </span>
              <span className="ce-ring">
                <svg viewBox="0 0 100 100">
                  <circle className="ce-ring-spur" cx="50" cy="50" r="44" />
                  <circle
                    className="ce-ring-fuell"
                    cx="50"
                    cy="50"
                    r="44"
                    style={{ strokeDashoffset: schritt >= LETZTER ? (276.5 * (100 - prozent)) / 100 : 276.5 }}
                  />
                </svg>
                <span className="ce-ring-zahl">
                  {prozent}
                  <small>%</small>
                </span>
              </span>
            </span>
            <span className="ce-match-titel">
              <Check aria-hidden />
              {e.kartenTitel}
            </span>
          </div>
        )}
      </div>

      <StimmenReihe quelle={quelle} />

      <Knopf quelle={quelle} art={art} stelle="unten" />
      <p className="ce-klein">Kostenlos und ohne Anmeldung</p>
    </aside>
  );
};

export default CheckEinstieg;
