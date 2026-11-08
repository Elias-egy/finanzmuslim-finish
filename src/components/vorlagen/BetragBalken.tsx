import { useEffect, useRef, useState } from "react";

type Teil = { farbe: string; anteil: number };

type Props = {
  betrag: number;
  /** Der größte Betrag der Auswahl: bei ihm ist der Balken voll. */
  max: number;
  /** Die Farben im Balken, je mit ihrem Anteil. */
  teile: readonly Teil[];
  /** Links unter dem Balken, z. B. „In einem Jahr“. */
  links: string;
  /** Die Zahl rechts, sie zählt beim Wechsel hoch oder runter. */
  wert: number;
  /** Formatiert die Zahl, z. B. zu „3.600 €“. */
  format: (n: number) => string;
  className?: string;
};

const wenigBewegung = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/** Zählt von der alten zur neuen Zahl in rund 600 ms. */
const useZaehler = (ziel: number) => {
  const [wert, setWert] = useState(ziel);
  const von = useRef(ziel);
  useEffect(() => {
    if (wenigBewegung() || typeof requestAnimationFrame === "undefined") {
      setWert(ziel);
      von.current = ziel;
      return;
    }
    const start = performance.now();
    const anfang = von.current;
    let id = 0;
    const schritt = (t: number) => {
      const p = Math.min(1, (t - start) / 600);
      const weich = 1 - Math.pow(1 - p, 3);
      const jetzt = anfang + (ziel - anfang) * weich;
      setWert(jetzt);
      von.current = jetzt;
      if (p < 1) id = requestAnimationFrame(schritt);
    };
    id = requestAnimationFrame(schritt);
    return () => cancelAnimationFrame(id);
  }, [ziel]);
  return wert;
};

/**
 * Die kleine Grafik oben in Plan, ETF und Gold (Elias, 01.11.2026, MC7d15 Runde 2: „irgendein Graph … eine ganz kleine
 * Zeile, die sich auflädt oder mehrere Farben hat … dass die Leute sehen, dass sich da was Kleinigkeiten geändert haben“).
 * Sie ersetzt „Schon mal vorab: Ich habe gerankt …“. Der Balken lädt sich mit dem Betrag auf (100, 300, 500), die Zahl
 * darunter zählt mit. Vorbild ist der Ring in Plan Schritt 3.
 */
const BetragBalken = ({ betrag, max, teile, links, wert, format, className = "" }: Props) => {
  const zahl = useZaehler(wert);
  const voll = Math.max(8, Math.min(100, (betrag / max) * 100));
  return (
    <div className={className} data-betrag-balken>
      <div className="h-3 w-full overflow-hidden rounded bg-white ring-1 ring-black/5" aria-hidden>
        <div
          className="flex h-full gap-[2px] rounded transition-[width] duration-700 ease-out motion-reduce:transition-none"
          style={{ width: `${voll}%` }}
        >
          {teile.map((t, i) => (
            <span key={i} className="h-full first:rounded-l-full last:rounded-r-full" style={{ flex: t.anteil, background: t.farbe }} />
          ))}
        </div>
      </div>
      <p className="mt-2 flex items-baseline justify-between gap-3 text-[14px] text-foreground/75">
        <span>{links}</span>
        <span className="shrink-0 whitespace-nowrap text-[16px] font-extrabold tabular-nums text-foreground" aria-live="polite">
          {format(zahl)}
        </span>
      </p>
    </div>
  );
};

export default BetragBalken;
