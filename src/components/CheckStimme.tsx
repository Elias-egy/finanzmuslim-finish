import { Star } from "lucide-react";
import { stimmenAn, type StimmenStelle } from "@/data/checkStimmen";

/**
 * Die Stimmen einer Stelle (Testseite: drei, Ergebnis: zwei je Art), Reihenfolge aus STIMMEN_JE_STELLE (Elias RN16-32). Live nur
 * bestätigte, im Entwicklungsmodus alle, unbestätigte mit data-stimme-platzhalter.
 */
const CheckStimmen = ({ stelle }: { stelle: StimmenStelle }) => (
  <>
    {stimmenAn(stelle, import.meta.env.DEV).map((s) => (
      <figure key={s.id} className="hc-stimme" data-stimme={s.id} data-stimme-platzhalter={s.beispiel ? "" : undefined}>
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
    ))}
  </>
);

export default CheckStimmen;
