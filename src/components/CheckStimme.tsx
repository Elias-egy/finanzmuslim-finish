import { Star } from "lucide-react";
import { BEISPIEL_STIMMEN, stimmeAnzeige, stimmenFuer, type Stimme } from "@/data/checkStimmen";

/**
 * Stimmenkarte (Verkaufsseite: Stelle 0 mit art „alle“, Ergebnis: Stelle 0 und 1 mit der Art des Checks). Echte Stimmen kommen aus src/data/checkStimmen.ts. Solange eine
 * fehlt, zeigt nur der Entwicklungsmodus an der Stelle eine Beispiel-Stimme mit Sternen (Elias RN10-08), die Produktion nichts.
 */
const CheckStimme = ({ stelle, art, className = "" }: { stelle: number; art?: "konto" | "depot" | "alle"; className?: string }) => {
  const liste = stimmenFuer(art);
  const modus = stimmeAnzeige(stelle, import.meta.env.DEV, liste);
  if (modus === "keine") return null;
  const beispiel = stimmenFuer(art, BEISPIEL_STIMMEN);
  const s: Stimme | undefined = modus === "echt" ? liste[stelle] : beispiel[stelle % beispiel.length];
  if (!s) return null;
  return (
    <figure className={`hc-stimme ${className}`} data-stimme-platzhalter={modus === "platzhalter" ? "" : undefined}>
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
