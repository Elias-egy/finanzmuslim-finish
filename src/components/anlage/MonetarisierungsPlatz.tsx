import { useState } from "react";
import { Info } from "lucide-react";
import {
  monetarisierung,
  platzTexte,
  type Platzierung,
} from "@/config/monetarisierung";
import BrokerAuswahl from "@/components/anlage/BrokerAuswahl";

/**
 * Ein Werbeplatz auf der Anlageseite. Drei Zustände, sonst nichts.
 *
 * in_vorbereitung: ruhige Statusfläche, kein Link, kein toter Knopf. Ein
 *   ausgegrauter Knopf sieht aus wie ein Fehler, ein Statuskasten wie Absicht.
 * live: Knopf "Broker anzeigen", öffnet die Auswahl.
 * entwurf: nur lokal, zeigt an, wo der Platz sitzt.
 *
 * Nie ein Ersatzlink auf die Startseite oder einen anderen Vergleich. Wer den
 * Nutzer auf eine Seite schickt, die seine Frage nicht beantwortet, verliert
 * ihn zweimal.
 */
const MonetarisierungsPlatz = ({
  platz,
  anlageName,
  isin,
}: {
  platz: Platzierung;
  anlageName: string;
  /** Fehlt bei Krypto, eine Münze hat keine ISIN. */
  isin?: string;
}) => {
  const [offen, setOffen] = useState(false);
  const { titel, text } = platzTexte[platz];

  if (monetarisierung.status === "entwurf") {
    if (!monetarisierung.entwurfsflaechenZeigen) return null;
    return (
      <div
        data-werbeplatz={platz}
        className="rounded-xl border border-dashed border-border px-4 py-3 text-[13px] text-muted-foreground"
      >
        Platz: {platz}
      </div>
    );
  }

  if (monetarisierung.status === "live") {
    return (
      <div data-werbeplatz={platz}>
        <button type="button" onClick={() => setOffen(true)} className="btn-primary">
          Broker anzeigen
        </button>
        <BrokerAuswahl
          offen={offen}
          schliessen={() => setOffen(false)}
          anlageName={anlageName}
          isin={isin}
        />
      </div>
    );
  }

  return (
    <div
      data-werbeplatz={platz}
      className="flex items-start gap-3 rounded-xl bg-accent px-4 py-4"
    >
      <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
      <div className="min-w-0">
        <p className="text-[15px] font-bold text-foreground">{titel}</p>
        {text && <p className="mt-0.5 text-[14px] leading-[21px] text-muted-foreground">{text}</p>}
      </div>
    </div>
  );
};

export default MonetarisierungsPlatz;
