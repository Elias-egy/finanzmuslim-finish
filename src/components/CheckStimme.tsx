import { Star } from "lucide-react";
import { stimmenAn, type StimmeAnStelle, type StimmenStelle } from "@/data/checkStimmen";
import "@/styles/checkEinstieg.css";

/**
 * Eine Stimmenkarte, überall gleich (Elias RN16-33: „mach alles so gleich … 1:1 so, wie du es davor hattest“): Aufbau wie RN16-25,
 * rundes Foto links, Name fett, Zeile darunter, Zitat unter der Kopfzeile. Ohne Foto ein grauer Platzhalterkreis, außer bei Reuf
 * („außer bei Rolf, weil da kriegen wir auch kein Bild mehr“).
 */
export const StimmeKarte = ({ s }: { s: StimmeAnStelle }) => (
  <figure className="ce-stimme" data-stimme={s.id} data-stimme-platzhalter={s.beispiel ? "" : undefined}>
    {s.sterne && (
      <div className="ce-sterne" role="img" aria-label={`${s.sterne} von 5`}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Star key={n} className={n <= s.sterne! ? "ce-stern" : "ce-stern ce-stern--leer"} aria-hidden />
        ))}
      </div>
    )}
    <figcaption className="ce-stimme-kopf">
      {s.foto ? (
        <img className="ce-stimme-foto" src={s.foto} alt="" width={52} height={52} loading="lazy" />
      ) : (
        s.id !== "reuf" && <span className="ce-stimme-foto ce-stimme-foto--platz" aria-hidden />
      )}
      <span className="ce-stimme-wer">
        <b>{s.name}</b>
        {s.zeile && <span>{s.zeile}</span>}
      </span>
    </figcaption>
    {s.screenshot ? (
      <img className="ce-stimme-screenshot" src={s.screenshot} alt={s.zitat} width={720} height={627} loading="lazy" />
    ) : (
      <blockquote>„{s.zitat}“</blockquote>
    )}
  </figure>
);

/** Die Stimmen einer Stelle (Testseite drei, Ergebnis zwei je Art), Reihenfolge aus STIMMEN_JE_STELLE (Elias RN16-32). */
const CheckStimmen = ({ stelle }: { stelle: StimmenStelle }) => (
  <>
    {stimmenAn(stelle, import.meta.env.DEV).map((s) => (
      <StimmeKarte key={s.id} s={s} />
    ))}
  </>
);

export default CheckStimmen;
