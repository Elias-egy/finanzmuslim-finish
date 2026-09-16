import { Link } from "react-router-dom";
import type { AnlageKaufbar } from "@/data/anlagenKaufbar";

/** Anbieter mit Depot-Partnerschaft: Name in anlagenKaufbar.ts -> /out/<kurzname>. */
const DEPOT_PARTNER: Record<string, string> = {
  "Scalable Capital": "scalable",
  "Traders Place": "traders-place",
  DKB: "dkb-depot",
  finvesto: "finvesto",
};

/**
 * Geprüfte Kaufbarkeit einer Anlage je Anbieter, aus der Wertpapiersuche oder
 * Produktliste des Anbieters (anlagenKaufbar.ts, erzeugt von bauen.py).
 * Wird im Abschnitt "Wo du sie kaufen kannst" und in der Broker-Auswahl benutzt.
 * Fehlt ein Anbieter, ist er noch nicht geprüft, nie "nicht kaufbar".
 */
const KaufbarListe = ({ kaufbar }: { kaufbar: AnlageKaufbar }) => (
  <div>
    {kaufbar.kaufbar.length > 0 && (
      <ul className="flex flex-wrap gap-2" aria-label="Kaufbar bei">
        {kaufbar.kaufbar.map((k) => {
          const partner = DEPOT_PARTNER[k.anbieter];
          return partner ? (
            <li key={k.anbieter}>
              <Link
                to={`/out/${partner}`}
                rel="sponsored nofollow"
                className="inline-flex rounded-full border border-primary bg-primary/5 px-3 py-1 text-[14px] font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                {k.anbieter}*
                {k.hinweis && <span className="font-normal">, {k.hinweis}</span>}
              </Link>
            </li>
          ) : (
            <li
              key={k.anbieter}
              className="rounded-full border border-border bg-background px-3 py-1 text-[14px] text-foreground"
            >
              {k.anbieter}
              {k.hinweis && <span className="text-muted-foreground">, {k.hinweis}</span>}
            </li>
          );
        })}
      </ul>
    )}
    {kaufbar.kaufbar.some((k) => DEPOT_PARTNER[k.anbieter]) && (
      <p className="mt-3 text-[13px] text-muted-foreground">
        * Werbung/Partnerlink: führt zur Einrichtungsseite des Anbieters, gleiche Konditionen, keine Mehrkosten.
      </p>
    )}
    {kaufbar.nichtImAngebot.length > 0 && (
      <p className="mt-4 text-[14px] text-muted-foreground">
        Nicht im Angebot: {kaufbar.nichtImAngebot.join(", ")}.
      </p>
    )}
    <p className="mt-4 text-[13px] text-muted-foreground">
      Stand {kaufbar.stand}. Andere Anbieter sind noch nicht geprüft.
    </p>
  </div>
);

export default KaufbarListe;
