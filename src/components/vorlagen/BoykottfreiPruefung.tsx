import { BF_STAND } from "@/data/boykottfreieAktien";

/**
 * Der knappe Abschnitt „So haben wir geprüft“ am Ende der Liste der boykottfreien Halal-Aktien (RN20). Normale Schrift, kein graues
 * Kleingedrucktes (Regelbuch look-und-design Nie: „graue Schrift unten mit kleinen Erklärungen“). Wortlaut vorsichtig: „auf keiner der
 * geprüften Boykott-Listen“, kein eigenes Urteil. Quellen und Stände aus dem Videoskript FB8 (19.11.2026).
 */
const BoykottfreiPruefung = ({ className = "" }: { className?: string }) => (
  <section aria-labelledby="titel-pruefung" data-pruefung className={className}>
    <h2 id="titel-pruefung" className="text-[24px] font-extrabold leading-tight text-foreground">
      So haben wir geprüft
    </h2>
    <div className="mt-3 space-y-3 text-[16px] leading-relaxed text-foreground">
      <p>
        <b>Halal:</b> Jede Aktie haben wir einzeln bei Musaffa nachgesehen, zuletzt am {BF_STAND.halal}.
      </p>
      <p>
        <b>Boykott:</b> Keine dieser Aktien steht auf einer dieser Listen.
      </p>
      <ul className="list-disc space-y-1.5 pl-5">
        <li>Offizielle BDS-Liste, Stand {BF_STAND.bds}</li>
        <li>Who Profits, die ganze Firmendatenbank</li>
        <li>UN-Datenbank zu Siedlungen, Bericht A/HRC/63/20, Stand {BF_STAND.un}</li>
        <li>AFSC Investigate, Firmenseiten</li>
      </ul>
      <p>
        Am {BF_STAND.nach} haben wir jede Firma noch einmal einzeln gesucht: Standorte, Töchter und Übernahmen in Israel, Verträge
        mit Militär oder Ministerien. Schon eine eigene Firma in Israel zählt als leichter Befund und kommt nicht auf diese Liste.
      </p>
      <p>
        Die Seite brands2boycott führt Garmin, Shiseido und Crocs auf der untersten Stufe, weil sie dort nur im Land
        verkauft werden. Einen Befund nach den Quellen oben gibt es nicht.
      </p>
      <p>
        Das ist der Stand von November 2026, kein Urteil und keine religiöse oder rechtliche Bewertung. Die Aktien sind Beispiele,
        keine Empfehlung zum Kauf und keine Anlageberatung. Zu Musaffa besteht keine Partnerschaft.
      </p>
    </div>
  </section>
);

export default BoykottfreiPruefung;
