import { useState } from "react";
import { CalendarRange } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { chartZeitraeume, istEigenerZeitraum, kursStand, type ZeitraumWert } from "@/lib/kurse";

type Props = {
  wert: ZeitraumWert;
  onChange: (w: ZeitraumWert) => void;
  className?: string;
};

/** "19.08.2026" -> Date, als obere Grenze für den Kalender. Neuere Kurse als
 *  den letzten Datenstand gibt es nicht auszuwählen. */
const kursStandDatum = (() => {
  const m = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(kursStand);
  return m ? new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1])) : new Date();
})();

const isoVon = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const datumKurz = (iso: string) => {
  const [j, m, t] = iso.split("-");
  return `${t}.${m}.${j.slice(2)}`;
};

/**
 * Gemeinsame Umschaltleiste für Übersicht und Detailseite: sieben feste
 * Zeiträume plus ein selbst gewählter Von-bis-Zeitraum über den Kalender.
 * Auf dem Handy waagerecht scrollbar, damit acht Knöpfe nicht umbrechen.
 */
const ZeitraumSchalter = ({ wert, onChange, className = "" }: Props) => {
  const [offen, setOffen] = useState(false);
  const [range, setRange] = useState<DateRange | undefined>(
    istEigenerZeitraum(wert)
      ? { from: new Date(`${wert.von}T00:00:00`), to: new Date(`${wert.bis}T00:00:00`) }
      : undefined,
  );

  const anwenden = () => {
    if (!range?.from || !range?.to) return;
    onChange({ von: isoVon(range.from), bis: isoVon(range.to) });
    setOffen(false);
  };

  return (
    <div
      role="tablist"
      aria-label="Zeitraum"
      className={`-mx-1 flex items-center gap-1 overflow-x-auto rounded-lg bg-muted p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className}`}
    >
      {chartZeitraeume.map((z) => (
        <button
          key={z.key}
          type="button"
          role="tab"
          aria-selected={!istEigenerZeitraum(wert) && wert === z.key}
          onClick={() => onChange(z.key)}
          className={`min-h-[36px] shrink-0 rounded-md px-3 text-[14px] font-semibold transition-colors ${
            !istEigenerZeitraum(wert) && wert === z.key
              ? "bg-primary text-primary-foreground"
              : "text-foreground hover:bg-background"
          }`}
        >
          {z.kurz}
          <span className="sr-only">, {z.lang}</span>
        </button>
      ))}

      <Popover open={offen} onOpenChange={setOffen}>
        <PopoverTrigger
          type="button"
          role="tab"
          aria-selected={istEigenerZeitraum(wert)}
          className={`inline-flex min-h-[36px] shrink-0 items-center gap-1.5 rounded-md px-3 text-[14px] font-semibold transition-colors ${
            istEigenerZeitraum(wert)
              ? "bg-primary text-primary-foreground"
              : "text-foreground hover:bg-background"
          }`}
        >
          <CalendarRange className="h-3.5 w-3.5 shrink-0" aria-hidden />
          {istEigenerZeitraum(wert) ? `${datumKurz(wert.von)}–${datumKurz(wert.bis)}` : "Von–bis"}
          <span className="sr-only">, eigener Zeitraum</span>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-auto p-3">
          <p className="px-1 pb-2 text-[13px] font-semibold text-foreground">Eigener Zeitraum</p>
          <Calendar
            mode="range"
            selected={range}
            onSelect={setRange}
            defaultMonth={range?.from ?? kursStandDatum}
            toDate={kursStandDatum}
            numberOfMonths={1}
          />
          <button
            type="button"
            onClick={anwenden}
            disabled={!range?.from || !range?.to}
            className="btn-primary mt-2 w-full justify-center disabled:pointer-events-none disabled:opacity-50"
          >
            Anwenden
          </button>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ZeitraumSchalter;
