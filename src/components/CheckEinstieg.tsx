import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ereignis } from "@/lib/messung";
import { FRAGEN, UEBERSCHRIFT, checkLink, type CheckQuelle } from "@/data/halalFinanzCheck";

/**
 * Einstieg in den Halal-Finanz-Check in einem Freebie oder auf der Startseite (RN5, 15.11.2026). Die erste Frage steht
 * gleich hier, ohne „Jetzt starten“ (Perspective-Tipp 13: der erste Tipp ist der schwerste); jede Antwort öffnet
 * /check bei Frage 2. Jede Stelle hat ihr eigenes ?quelle= (Tipp 43), damit Starts, Ergebnisse und Klicks je Freebie
 * zu sehen sind. Nie „Finde, was zu dir passt“ (Regelbuch woerter-und-ton, Nie).
 */
const CheckEinstieg = ({ quelle, className = "" }: { quelle: CheckQuelle; className?: string }) => {
  const frage = FRAGEN.ziel;
  return (
    <aside data-check-einstieg={quelle} aria-labelledby={`check-${quelle}`} className={`rounded-2xl border-2 border-primary bg-card p-4 md:p-7 ${className}`}>
      <p className="text-[14px] font-bold uppercase tracking-wide text-violet">Halal-Finanz-Check</p>
      <h2 id={`check-${quelle}`} className="mt-1 text-[24px] font-extrabold leading-[1.15] text-foreground [text-wrap:balance] md:text-[30px]">
        {UEBERSCHRIFT[quelle]}
      </h2>
      <p className="mt-2 text-[15px] font-semibold text-muted-foreground">Frage 1 von 3 · 60 Sekunden</p>
      <p className="mt-4 text-[19px] font-bold leading-tight text-foreground">{frage.titel}</p>
      <ul className="mt-3 space-y-2.5">
        {frage.optionen.map((o) => (
          <li key={o.wert}>
            <Link
              to={`${checkLink(quelle)}&ziel=${o.wert}`}
              onClick={() => ereignis("quiz_frage", { check: true, quelle, frage: "ziel", antwort: o.wert, nummer: 1, im: "freebie" })}
              className={`flex min-h-[60px] w-full items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-colors ${
                o.etikett ? "border-gain bg-gain-soft" : "border-border bg-background hover:border-primary"
              }`}
            >
              <span className="min-w-0 flex-1">
                {o.etikett && (
                  <span className="mb-1 inline-block rounded-full bg-gain px-2.5 py-0.5 text-[12px] font-bold text-white">{o.etikett}</span>
                )}
                <span className="block text-[17px] font-bold leading-tight text-foreground">{o.titel}</span>
                {o.unter && <span className="mt-0.5 block text-[15px] leading-snug text-muted-foreground">{o.unter}</span>}
              </span>
              <ArrowRight className="h-5 w-5 shrink-0 text-primary" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-[14px] font-medium text-muted-foreground">Kostenlos · ohne Anmeldung · keine Beträge nötig</p>
    </aside>
  );
};

export default CheckEinstieg;
