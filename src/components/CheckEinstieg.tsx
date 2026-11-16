import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ereignis } from "@/lib/messung";
import { stimmeFuerEinstieg } from "@/data/checkStimmen";
import { ART_JE_QUELLE, UEBERSCHRIFT, checkEinstiegLink, zielFrage, type CheckQuelle } from "@/data/halalFinanzCheck";

/**
 * Einstieg in den Check in einem Freebie (RN5, RN8, RN10-07 16.11.2026). Wer aus einem Freebie kommt, sieht keine Verkaufsseite mehr:
 * Der Kasten zeigt eine Stimme (falls Elias echte geliefert hat, sonst nichts) und gleich die erste Frage des Checks, ohne „Jetzt starten“
 * (Perspective-Tipp 13: der erste Tipp ist der schwerste). Seit RN10-07 ist der Check überall derselbe (Elias: „das Quiz ist überall
 * gleich“): jedes Freebie fragt „Was suchst du gerade?“ mit denselben drei Antworten, nur ein grünes Etikett wandert an die passende
 * Antwort (zielFrage, hinweisJeQuelle): Standard „Neues Bankkonto: am beliebtesten“, bei Aktien-Liste und Halal-Anlagen-Liste
 * „Depot zum Investieren: passt zu deiner Liste“. Ein Tipp öffnet /check?quelle=…&start=2&a1=konto|invest|unsicher, der Chat geht bei
 * Frage 2 weiter. Jede Stelle hat ihr eigenes ?quelle= (Tipp 43). Nie „Finde, was zu dir passt“ (Regelbuch woerter-und-ton, Nie).
 *
 * Eigenschaften (rückwärts verträglich): `quelle` (Pflicht), `className` (optional). Mehr nicht.
 */
const CheckEinstieg = ({ quelle, className = "" }: { quelle: CheckQuelle; className?: string }) => {
  const art = ART_JE_QUELLE[quelle] ?? "konto";
  const frage = zielFrage(quelle);
  const stimme = stimmeFuerEinstieg(art);
  return (
    <aside data-check-einstieg={quelle} data-art={art} aria-labelledby={`check-${quelle}`} className={`rounded-2xl border-2 border-primary bg-card p-4 md:p-7 ${className}`}>
      <p className="text-[14px] font-bold uppercase tracking-wide text-violet">Halal-Finanz-Check</p>
      <h2 id={`check-${quelle}`} className="mt-1 text-[24px] font-extrabold leading-[1.15] text-foreground [text-wrap:balance] md:text-[30px]">
        {UEBERSCHRIFT[quelle]}
      </h2>
      <p className="mt-2 text-[15px] font-semibold text-muted-foreground">Wenige Fragen · unter 60 Sekunden</p>
      {stimme && (
        <figure className="mt-4 rounded-xl bg-muted/60 p-4">
          <blockquote className="text-[16px] leading-snug text-foreground">„{stimme.zitat}“</blockquote>
          <figcaption className="mt-2 flex items-center gap-2 text-[14px] text-muted-foreground">
            {stimme.foto && <img src={stimme.foto} alt="" width={32} height={32} loading="lazy" className="h-8 w-8 rounded-full object-cover" />}
            <span className="font-semibold text-foreground">{stimme.name}</span>
            {stimme.zeile && <span>· {stimme.zeile}</span>}
          </figcaption>
        </figure>
      )}
      <p className="mt-4 text-[19px] font-bold leading-tight text-foreground">{frage.titel}</p>
      <ul className="mt-3 space-y-2.5">
        {frage.optionen.map((o) => (
          <li key={o.wert}>
            <Link
              to={checkEinstiegLink(quelle, o.wert)}
              onClick={() => ereignis("quiz_frage", { check: true, quelle, art, frage: "ziel", antwort: o.wert, nummer: 1, im: "freebie" })}
              className="flex min-h-[60px] w-full items-center gap-3 rounded-xl border-2 border-border bg-background px-4 py-3 text-left transition-colors hover:border-primary"
            >
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[17px] font-bold leading-tight text-foreground">
                  {o.titel}
                  {o.etikett && (
                    <span data-etikett className="rounded-full bg-gain-soft px-2 py-0.5 text-[12px] font-semibold leading-snug text-gain">
                      {o.etikett}
                    </span>
                  )}
                </span>
                {o.unter && <span className="mt-0.5 block text-[15px] leading-snug text-muted-foreground">{o.unter}</span>}
              </span>
              <ArrowRight className="h-5 w-5 shrink-0 text-primary" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-[14px] font-medium text-muted-foreground">Kostenlos · ohne Anmeldung</p>
    </aside>
  );
};

export default CheckEinstieg;
