import { Star } from "lucide-react";
import { stimmeAnzeige, stimmenFuer } from "@/data/checkStimmen";
import type { Art } from "@/data/halalFinanzCheck";

/**
 * Stimmenkarte der Verkaufsseite (Stelle 0 unter dem Hero-Foto, Stelle 1 unter dem Gründer-Satz). Echte Stimmen kommen aus
 * src/data/checkStimmen.ts, solange leer zeigt nur der Entwicklungsmodus einen Platzhalter, die Produktion nichts.
 */
const CheckStimme = ({ stelle, art, className = "" }: { stelle: 0 | 1; art?: Art; className?: string }) => {
  const liste = stimmenFuer(art);
  const modus = stimmeAnzeige(stelle, import.meta.env.DEV, liste);
  if (modus === "keine") return null;
  if (modus === "platzhalter") {
    return (
      <div className={`hc-stimme hc-stimme--platz ${className}`} data-stimme-platzhalter>
        Hier kommt deine echte Stimme {stelle + 1}
      </div>
    );
  }
  const s = liste[stelle];
  return (
    <figure className={`hc-stimme ${className}`}>
      {s.sterne && (
        <div className="hc-sterne" role="img" aria-label={`${s.sterne} von 5`}>
          {[1, 2, 3, 4, 5].map((n) => (
            <Star key={n} className={n <= s.sterne! ? "hc-stern" : "hc-stern hc-stern--leer"} aria-hidden />
          ))}
        </div>
      )}
      <blockquote>„{s.zitat}“</blockquote>
      <figcaption>
        {s.foto && <img src={s.foto} alt="" width={40} height={40} loading="lazy" />}
        <span className="hc-stimme-name">{s.name}</span>
        {s.zeile && <span className="hc-stimme-zeile">· {s.zeile}</span>}
      </figcaption>
    </figure>
  );
};

export default CheckStimme;
