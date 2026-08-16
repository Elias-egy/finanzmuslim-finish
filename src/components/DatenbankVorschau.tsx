import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { halalAnlagen, type Anlage } from "@/data/halalAnlagen";

/** Reihenfolge = Sortierreihenfolge der Liste und der Legende. */
const arten = [
  { key: "etf", label: "Aktien-ETF", legende: "Aktien-ETF", tone: "bg-primary" },
  { key: "fonds", label: "Fonds", legende: "Fonds", tone: "bg-success" },
  { key: "sukuk", label: "Sukuk", legende: "Sukuk", tone: "bg-asset-sukuk" },
  { key: "gold", label: "Gold", legende: "Gold", tone: "bg-asset-gold" },
  { key: "silber", label: "Silber", legende: "Silber", tone: "bg-asset-silber" },
] as const;

const artKeyVon = (a: Anlage) => {
  if (a.kategorie === "aktien") return a.bauart === "aktiv" ? "fonds" : "etf";
  if (a.kategorie === "sukuk") return "sukuk";
  return a.kategorie === "gold" ? "gold" : "silber";
};

const artVon = (a: Anlage) => arten.find((g) => g.key === artKeyVon(a))!;

const sortiert = [...halalAnlagen].sort((a, b) => {
  const ga = arten.findIndex((g) => g.key === artKeyVon(a));
  const gb = arten.findIndex((g) => g.key === artKeyVon(b));
  if (ga !== gb) return ga - gb;
  return a.name.localeCompare(b.name, "de");
});

const DatenbankVorschau = () => {
  const [suche, setSuche] = useState("");

  const treffer = useMemo(() => {
    const q = suche.trim().toLowerCase();
    if (!q) return sortiert;
    return sortiert.filter((a) =>
      [a.name, a.anbieter, a.isin].some((f) => f.toLowerCase().includes(q)),
    );
  }, [suche]);

  return (
    <div className="w-full min-w-0 rounded-2xl border border-border bg-card p-4 lg:w-[500px] lg:p-6">
      <div className="flex h-12 items-center gap-3 rounded-md border border-border px-4 focus-within:border-primary">
        <Search className="h-4 w-4 text-muted-foreground" aria-hidden />
        <input
          type="search"
          value={suche}
          onChange={(e) => setSuche(e.target.value)}
          placeholder="ETF, Fonds oder ISIN suchen"
          aria-label="Halal-Anlagen durchsuchen"
          className="h-full w-full bg-transparent text-[16px] text-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>

      {/* Genau vier Zeilen sichtbar, die fuenfte wird angeschnitten. */}
      <ul className="mt-2 max-h-[224px] divide-y divide-border overflow-y-auto pr-1">
        {treffer.map((a) => {
          const art = artVon(a);
          return (
            <li key={a.slug}>
              <Link
                to={`/halal-anlagen/${a.slug}`}
                className="group flex h-[52px] items-center justify-between gap-3 rounded-md transition-colors hover:bg-hero"
              >
                <span className="min-w-0 flex-1 truncate text-[16px] text-foreground group-hover:text-primary">
                  {a.name}
                </span>
                {/* Handy: nur der Punkt, die Legende darunter erklaert ihn.
                    Der Name braucht dort jeden Millimeter. */}
                <span className="flex shrink-0 items-center gap-2 text-[13px] text-muted-foreground">
                  <span className="hidden sm:inline">{art.label}</span>
                  <span className={`h-2.5 w-2.5 rounded-full ${art.tone}`} aria-hidden />
                </span>
              </Link>
            </li>
          );
        })}
        {treffer.length === 0 && (
          <li className="py-4 text-[15px] text-muted-foreground">Keine Anlage gefunden.</li>
        )}
      </ul>

      <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
        {arten.map((g) => (
          <li key={g.key} className="flex items-center gap-2 text-[13px] text-muted-foreground">
            <span className={`h-2 w-2 rounded-full ${g.tone}`} aria-hidden />
            {g.legende}
          </li>
        ))}
      </ul>


      <Link to="/halal-anlagen" className="mt-4 block text-[15px] font-semibold text-primary hover:underline">
        Alle {halalAnlagen.length} Anlagen ansehen
      </Link>
    </div>
  );
};

export default DatenbankVorschau;
