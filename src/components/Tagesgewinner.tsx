import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import AnlageZeile from "@/components/AnlageZeile";
import { halalAnlagen, type Anlage } from "@/data/halalAnlagen";
import { kursFuerAnlage, kursStand, tagesVeraenderung } from "@/lib/kurse";

/** Veränderung seit dem vorherigen Schlusskurs, einmal je Anlage berechnet.
 *  Anlagen ohne Tagesreihe (etwa ein Fonds, dessen Kurs erst mit ein paar
 *  Tagen Verzug veröffentlicht wird) liefern hier "keine Daten" und fallen
 *  aus der Rangliste, statt mit einer erfundenen Zahl aufzutauchen. */
const mitTagesveraenderung = halalAnlagen
  .map((a) => ({ a, veraenderung: tagesVeraenderung(kursFuerAnlage(a)) }))
  .filter((x): x is { a: Anlage; veraenderung: number } => x.veraenderung !== null);

const tagesgewinner = [...mitTagesveraenderung]
  .sort((x, y) => y.veraenderung - x.veraenderung)
  .slice(0, 4);

const Tagesgewinner = () => {
  const [suche, setSuche] = useState("");

  const treffer = useMemo(() => {
    const q = suche.trim().toLowerCase();
    if (!q) return tagesgewinner.map((x) => x.a);
    return halalAnlagen.filter((a) =>
      [a.name, a.anbieter, a.isin ?? "", a.kuerzel ?? ""].some((f) => f.toLowerCase().includes(q)),
    );
  }, [suche]);

  return (
    <div className="w-full min-w-0 rounded-2xl border border-border bg-card p-4 lg:w-[500px] lg:p-6">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-[15px] font-bold text-foreground">Tagesgewinner</h3>
      </div>

      <div className="mt-3 flex h-12 items-center gap-3 rounded-md border border-border px-4 focus-within:border-primary">
        <Search className="h-4 w-4 text-muted-foreground" aria-hidden />
        <input
          type="search"
          value={suche}
          onChange={(e) => setSuche(e.target.value)}
          placeholder="Anlage, Kürzel oder ISIN suchen"
          aria-label="Halal-Anlagen durchsuchen"
          className="h-full w-full bg-transparent text-[16px] text-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>

      {/* Genau vier Zeilen sichtbar, die fuenfte wird angeschnitten. */}
      <ul className="mt-2 max-h-[252px] divide-y divide-border overflow-y-auto pr-1">
        {treffer.map((a) => (
          <li key={a.slug}>
            <AnlageZeile a={a} veraenderung={tagesVeraenderung(kursFuerAnlage(a))} />
          </li>
        ))}
        {treffer.length === 0 && (
          <li className="py-4 text-[15px] text-muted-foreground">Keine Anlage gefunden.</li>
        )}
      </ul>

      <p className="mt-3 text-[13px] text-muted-foreground">
        Seit dem vorherigen Schlusskurs · keine Echtzeitkurse · Stand {kursStand}
      </p>

      <Link to="/halal-anlagen" className="mt-3 block text-[15px] font-semibold text-primary hover:underline">
        Alle {halalAnlagen.length} Anlagen ansehen
      </Link>
    </div>
  );
};

export default Tagesgewinner;
