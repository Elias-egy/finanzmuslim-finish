import { useState } from "react";
import { ChevronUp, ListFilter } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export type FilterEintrag = { key: string; label: string; erlaubt?: string[] };

/**
 * Filter wie bei Finanzfluss (VG3, 23.11.2026, Elias VG2-05: „die Filter und so, das sieht ja alles noch nicht so gut aus wie
 * das Original“). Gesehen am 23.11. auf finanzfluss.de/vergleich/girokonto, /depot, /geschaeftskonto bei 1440 und 390 px:
 * links ein Knopf „Filter“ mit Symbol, daneben fett „56 Ergebnisse“; aufgeklappt hängt am Knopf ein grauer Kasten mit
 * „Keine Filter ausgewählt“, Gruppen mit fetter Überschrift und eckigen Kästchen in drei Spalten. Am Handy ist der Knopf
 * ein grauer Balken über die ganze Breite, die Ergebnisse stehen darunter.
 *
 * Gruppen: Filter, deren Name mit „Geeignet für“ beginnt, stehen unter „Geeignet für“ (wie Finanzflusses Auswahl beim
 * Geschäftskonto), alle anderen unter „Eigenschaften“.
 */
const GEEIGNET = /^Geeignet für\s+/;

const gruppieren = (filter: FilterEintrag[]) => {
  const geeignet = filter.filter((f) => GEEIGNET.test(f.label));
  const rest = filter.filter((f) => !GEEIGNET.test(f.label));
  return [
    { titel: "Eigenschaften", eintraege: rest.map((f) => ({ ...f, text: f.label })) },
    { titel: "Geeignet für", eintraege: geeignet.map((f) => ({ ...f, text: f.label.replace(GEEIGNET, "") })) },
  ].filter((g) => g.eintraege.length > 0);
};

export const FilterLeiste = ({
  filter,
  aktiv,
  umschalten,
  zuruecksetzen,
  anzahl,
}: {
  filter: FilterEintrag[];
  aktiv: string[];
  umschalten: (key: string) => void;
  zuruecksetzen: () => void;
  anzahl: number;
}) => {
  const [offen, setOffen] = useState(false);
  const gruppen = gruppieren(filter);

  return (
    <section aria-label="Filter" className="mt-5 lg:mt-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:gap-4">
        <button
          type="button"
          onClick={() => setOffen((o) => !o)}
          aria-expanded={offen}
          aria-controls="vergleich-filter"
          className={`flex min-h-[50px] w-full items-center justify-between gap-3 rounded-lg border px-4 text-left text-[16px] font-semibold text-foreground transition-colors lg:w-[200px] ${
            offen
              ? "border-muted bg-muted lg:rounded-b-none"
              : "border-muted bg-muted lg:border-border lg:bg-background lg:hover:border-foreground/40"
          }`}
        >
          <span className="flex items-center gap-2">
            Filter
            {aktiv.length > 0 && (
              <span className="rounded-full bg-primary px-2 py-0.5 text-[12px] font-bold leading-none text-primary-foreground">
                {aktiv.length}
              </span>
            )}
          </span>
          {offen ? <ChevronUp className="h-5 w-5" aria-hidden /> : <ListFilter className="h-5 w-5" aria-hidden />}
        </button>
        <p className={`text-[16px] font-semibold text-foreground lg:pb-3.5 ${offen ? "hidden lg:block" : ""}`}>
          {anzahl} Ergebnisse
        </p>
      </div>

      {offen && (
        <div id="vergleich-filter" className="-mt-px rounded-lg bg-muted px-4 pb-5 pt-4 lg:rounded-tl-none lg:px-5">
          <div className="flex items-center justify-between gap-4 text-[14px]">
            <span className="text-muted-foreground">
              {aktiv.length === 0 ? "Keine Filter ausgewählt" : `${aktiv.length} ${aktiv.length === 1 ? "Filter" : "Filter"} ausgewählt`}
            </span>
            {aktiv.length > 0 && (
              <button type="button" onClick={zuruecksetzen} className="text-foreground underline underline-offset-2 hover:text-primary">
                Zurücksetzen
              </button>
            )}
          </div>
          <div className={`mt-4 grid gap-6 ${gruppen.length > 1 ? "md:grid-cols-2 lg:grid-cols-3" : ""}`}>
            {gruppen.map((g) => (
              <fieldset key={g.titel}>
                <legend className="text-[16px] font-semibold text-foreground">{g.titel}</legend>
                <div className={`mt-2 ${gruppen.length > 1 ? "space-y-1" : "grid gap-x-6 gap-y-1 sm:grid-cols-2 lg:grid-cols-3"}`}>
                  {g.eintraege.map((f) => (
                    <label key={f.key} className="flex min-h-[36px] cursor-pointer items-center gap-3 text-[15px] text-foreground">
                      <Checkbox
                        checked={aktiv.includes(f.key)}
                        onCheckedChange={() => umschalten(f.key)}
                        className="h-5 w-5 rounded-[4px] border-border bg-background data-[state=checked]:border-primary"
                      />
                      <span>{f.text}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
          </div>
          <p className="mt-4 text-[16px] font-semibold text-foreground lg:hidden">{anzahl} Ergebnisse</p>
        </div>
      )}
    </section>
  );
};
