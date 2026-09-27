import { Lock } from "lucide-react";
import OptinKarte from "@/components/optin/OptinKarte";
import type { OptinFreebie } from "@/data/optin";

type Props = {
  freebie: OptinFreebie;
  /** Wie viele Einträge noch hinter der Schranke liegen, für den Satz über der Karte. */
  weitere: string;
  /** Wie viele leere Platzhalterzeilen über der Karte ausblenden. */
  zeilen?: number;
};

/**
 * Das Ende des offenen Ausschnitts. Die Zeilen darüber sind Platzhalter ohne Text, nicht
 * der echte Inhalt mit Unschärfe: So steht der gesperrte Teil weder im vorgerenderten HTML
 * noch im JavaScript dieser Seite. Darunter die Opt-in-Karte, Anker `#holen`.
 */
const Schnittkante = ({ freebie, weitere, zeilen = 4 }: Props) => (
  <section id="holen" aria-labelledby="holen-titel" className="scroll-mt-24">
    <div aria-hidden className="relative">
      <div className="card-surface overflow-hidden p-0">
        {Array.from({ length: zeilen }, (_, i) => (
          <div key={i} className="grid grid-cols-[2.5rem_1fr_auto] items-center gap-3 border-b border-border px-2 py-3 last:border-b-0">
            <span className="h-3 w-5 rounded bg-muted" />
            <span className="space-y-2">
              <span className="block h-3.5 rounded bg-muted" style={{ width: `${55 - i * 7}%` }} />
              <span className="block h-3 w-1/3 rounded bg-muted/70" />
            </span>
            <span className="h-7 w-16 rounded-full bg-muted" />
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/10 via-background/70 to-background" />
    </div>

    <div className="relative -mt-10 mx-auto max-w-xl">
      <p id="holen-titel" className="flex items-center justify-center gap-2 text-center text-[15px] font-semibold text-foreground">
        <Lock className="h-4 w-4 text-primary" aria-hidden />
        {weitere}
      </p>
      <div className="mt-4">
        <OptinKarte freebie={freebie} />
      </div>
    </div>
  </section>
);

export default Schnittkante;
