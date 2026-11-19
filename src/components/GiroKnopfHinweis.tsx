import { Check } from "lucide-react";
import { giroKnopfHinweis } from "@/data/giroKnopfHinweis";

/**
 * RN21 (Elias, 19.11.2026): grüne Meldung direkt über dem Knopf zum Girokonto. Positiv, kein Grau, kein Rot, kein
 * Warnzeichen; der Leser scannt sie einmal und klickt dann. Texte und Belege: src/data/giroKnopfHinweis.ts.
 */
const GiroKnopfHinweis = ({ anbieter, className = "" }: { anbieter: string | undefined; className?: string }) => {
  const h = giroKnopfHinweis(anbieter);
  if (!h) return null;
  return (
    <div
      className={`flex items-start gap-2.5 rounded-xl border border-success/30 bg-success/10 px-3.5 py-3 text-left ${className}`}
      data-giro-knopf-hinweis={h.bank}
    >
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success text-success-foreground">
        <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />
      </span>
      <p className="m-0 text-[15px] leading-snug text-foreground">
        <strong className="font-bold text-success dark:text-emerald-400">{h.titel}</strong>
        <br />
        {h.satz}
      </p>
    </div>
  );
};

export default GiroKnopfHinweis;
