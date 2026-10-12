import type { AngebotsHinweis } from "./vergleichTypen";

/**
 * Der Kasten zu einer Ausnahme am Angebot, außerhalb des Vergleichs: auf der Startseite mit dem Video und
 * in den Karten des geführten Tests. Warnung gelb mit „!“, Vorteil violett mit „?“ (Elias, 12.10.2026:
 * Gelb wirkt abschreckend und bleibt für Warnungen).
 */
export const HinweisKasten = ({ hinweis, klein = false }: { hinweis: AngebotsHinweis; klein?: boolean }) => {
  const vorteil = hinweis.art === "tarif";
  return (
    <p
      role="note"
      className={`border-2 text-left text-foreground ${klein ? "rounded-lg px-3 py-2 text-[14px] leading-[21px]" : "rounded-xl px-4 py-3 text-[15px] leading-[23px]"} ${vorteil ? "border-violet bg-[#f1efff]" : "border-amber-500 bg-amber-50"}`}
    >
      <span
        className={`mr-2 inline-flex items-center justify-center rounded-full align-text-bottom font-bold leading-none text-white ${klein ? "h-[18px] w-[18px] text-[12px]" : "h-5 w-5 text-[13px]"} ${vorteil ? "bg-violet" : "bg-amber-500"}`}
        aria-hidden
      >
        {vorteil ? "?" : "!"}
      </span>
      <span className="font-semibold">{hinweis.titel}:</span> {hinweis.text}
    </p>
  );
};
