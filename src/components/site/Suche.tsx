import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { navGroups } from "@/components/site/navData";
import { halalAnlagen } from "@/data/halalAnlagen";

type Treffer = {
  titel: string;
  bereich: string;
  to: string;
  /** Zweite Zeile, etwa die ISIN einer Anlage. */
  zusatz?: string;
};

/**
 * Suchverzeichnis. Es entsteht einmal aus der Navigation und der Anlagen-
 * datenbank, damit nichts doppelt gepflegt werden muss. Nur Eintraege mit
 * echtem Ziel kommen hinein, "bald" bleibt draussen.
 */
const verzeichnis = (): Treffer[] => {
  const liste: Treffer[] = [];
  const gesehen = new Set<string>();

  const dazu = (t: Treffer) => {
    const schluessel = `${t.to}|${t.titel}`;
    if (gesehen.has(schluessel)) return;
    gesehen.add(schluessel);
    liste.push(t);
  };

  navGroups.forEach((gruppe) =>
    gruppe.columns.forEach((spalte) =>
      spalte.items.forEach((eintrag) => {
        if (!eintrag.to) return;
        dazu({ titel: eintrag.label, bereich: gruppe.label, to: eintrag.to });
      }),
    ),
  );

  halalAnlagen.forEach((a) =>
    dazu({
      titel: a.name,
      bereich: "Anlage",
      to: `/halal-anlagen/${a.slug}`,
      zusatz: `${a.anbieter} · ${a.isin}`,
    }),
  );

  return liste;
};

/** Umlaute und Grossschreibung sollen die Suche nicht stoeren. */
const flach = (s: string) =>
  s
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss");

const Suche = ({ offen, schliessen }: { offen: boolean; schliessen: () => void }) => {
  const [frage, setFrage] = useState("");
  const feld = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const alle = useMemo(verzeichnis, []);

  useEffect(() => {
    if (!offen) return;
    setFrage("");
    const t = setTimeout(() => feld.current?.focus(), 40);
    document.body.style.overflow = "hidden";
    const taste = (e: KeyboardEvent) => e.key === "Escape" && schliessen();
    window.addEventListener("keydown", taste);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
      window.removeEventListener("keydown", taste);
    };
  }, [offen, schliessen]);

  const treffer = useMemo(() => {
    const q = flach(frage.trim());
    if (q.length < 2) return [];
    return alle
      .filter((t) => flach(`${t.titel} ${t.zusatz ?? ""} ${t.bereich}`).includes(q))
      .slice(0, 12);
  }, [frage, alle]);

  if (!offen) return null;

  const gehe = (to: string) => {
    schliessen();
    navigate(to);
  };

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-foreground/40" onClick={schliessen} />

      <div className="absolute inset-x-0 top-0 bg-card shadow-[0_16px_40px_-24px_rgba(0,0,0,0.4)]">
        <div className="container py-4">
          <div className="mx-auto flex w-full max-w-[720px] items-center gap-2">
            <div className="flex h-12 flex-1 items-center gap-2 rounded-lg border border-border px-3 focus-within:border-primary">
              <Search className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
              <input
                ref={feld}
                value={frage}
                onChange={(e) => setFrage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && treffer[0]) gehe(treffer[0].to);
                }}
                type="search"
                placeholder="Thema, Rechner oder ISIN"
                aria-label="Suche"
                className="h-full w-full bg-transparent text-[16px] text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>
            <button
              type="button"
              onClick={schliessen}
              aria-label="Suche schließen"
              className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-foreground hover:bg-muted"
            >
              <X className="h-6 w-6" aria-hidden />
            </button>
          </div>

          <div className="mx-auto mt-3 max-h-[60vh] w-full max-w-[720px] overflow-y-auto">
            {frage.trim().length < 2 && (
              <p className="px-1 py-2 text-[15px] text-muted-foreground">
                Tipp: such nach Zakat, Depot, Gold oder einer ISIN.
              </p>
            )}

            {frage.trim().length >= 2 && treffer.length === 0 && (
              <p className="px-1 py-2 text-[15px] text-muted-foreground">
                Nichts gefunden. Versuch ein einzelnes Wort.
              </p>
            )}

            <ul>
              {treffer.map((t) => (
                <li key={`${t.to}-${t.titel}`}>
                  <button
                    type="button"
                    onClick={() => gehe(t.to)}
                    className="flex w-full min-h-[52px] items-center gap-3 rounded-lg px-3 text-left transition-colors hover:bg-muted"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[16px] font-semibold text-foreground">
                        {t.titel}
                      </span>
                      {t.zusatz && (
                        <span className="block truncate text-[13px] text-muted-foreground">
                          {t.zusatz}
                        </span>
                      )}
                    </span>
                    <span className="shrink-0 text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">
                      {t.bereich}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Suche;
