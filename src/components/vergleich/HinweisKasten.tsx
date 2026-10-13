import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { istVorteil, type AngebotsHinweis } from "./vergleichTypen";

const Zeichen = ({ vorteil, klein }: { vorteil: boolean; klein: boolean }) => (
  <span
    className={`inline-flex shrink-0 items-center justify-center rounded-full font-bold leading-none text-white ${klein ? "h-[18px] w-[18px] text-[12px]" : "h-5 w-5 text-[13px]"} ${vorteil ? "bg-violet" : "bg-amber-500"}`}
    aria-hidden
  >
    {vorteil ? "?" : "!"}
  </span>
);

/** Der ausgeschriebene Hinweis: Warnung gelb mit „!“, Vorteil violett mit „?“ (Elias, 12.10.2026: Gelb bleibt für Warnungen). */
export const HinweisText = ({ hinweis, klein = false, id }: { hinweis: AngebotsHinweis; klein?: boolean; id?: string }) => {
  const vorteil = istVorteil(hinweis);
  return (
    <p
      id={id}
      role="note"
      className={`border-2 text-left text-foreground ${klein ? "rounded-lg px-3 py-2 text-[14px] leading-[21px]" : "rounded-xl px-4 py-3 text-[15px] leading-[23px]"} ${vorteil ? "border-violet bg-[#f1efff]" : "border-amber-500 bg-amber-50"}`}
    >
      <span className="mr-2 inline-flex align-text-bottom">
        <Zeichen vorteil={vorteil} klein={klein} />
      </span>
      <span className="font-semibold">{hinweis.titel}:</span> {hinweis.text}
    </p>
  );
};

/**
 * Eine Ausnahme am Angebot, außerhalb des Vergleichs: in den Karten des geführten Tests. Zu sehen ist nur der
 * Knopf mit dem Zeichen und dem Titel, der Text erscheint erst nach dem Druck darauf. Elias, 13.10.2026: „nicht
 * direkt ausgeschrieben“, „nur anzeigen, wenn man den Knopf drückt“, damit niemand damit „vollgehauen“ wird.
 */
export const HinweisKasten = ({ hinweis, klein = false }: { hinweis: AngebotsHinweis; klein?: boolean }) => {
  const [offen, setOffen] = useState(false);
  const id = useId();
  const vorteil = istVorteil(hinweis);
  return (
    <div className="text-left">
      <button
        type="button"
        onClick={() => setOffen((o) => !o)}
        aria-expanded={offen}
        aria-controls={id}
        className={`inline-flex min-h-[44px] max-w-full items-center gap-2 rounded-full border-2 bg-white px-3 text-[14px] font-semibold text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${vorteil ? "border-violet/50" : "border-amber-500/70"}`}
      >
        <Zeichen vorteil={vorteil} klein={klein} />
        <span className="min-w-0 truncate">{hinweis.titel}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 transition-transform motion-reduce:transition-none ${offen ? "rotate-180" : ""}`} aria-hidden />
      </button>
      {offen && (
        <div className="mt-2">
          <HinweisText hinweis={hinweis} klein={klein} id={id} />
        </div>
      )}
    </div>
  );
};
