import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Info } from "lucide-react";

/**
 * Bereinigungsrechner.
 *
 * Er rechnet eine Multiplikation aus, und das ist Absicht. Der Wert liegt
 * nicht in der Formel, sondern darin, dass der Leser den Satz danach versteht
 * und weiß, welche Zahl er einsetzen muss. Deshalb zwei Wege:
 *
 *   Weg A  Ausschüttung × Satz in Prozent    (ausschüttender Fonds, Anbietersatz)
 *   Weg B  Betrag je Anteil × Anzahl Anteile (Thesaurierer, Einzelaktie)
 *
 * Voreingestellt sind fünf Prozent, weil das die verbreitete Schätzung ist,
 * wenn der Anbieter nichts ausweist.
 */

const eur = (n: number) =>
  n.toLocaleString("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const inputClass =
  "w-full rounded-xl border border-border bg-white px-4 py-3 pr-10 text-[16px] font-medium text-foreground outline-none transition focus:border-primary/50";

/** Deutsche Eingabe in eine Zahl. Punkt ist Tausender, Komma ist Dezimal. */
const zahl = (text: string) => {
  const v = parseFloat(text.replace(/\./g, "").replace(",", "."));
  return Number.isFinite(v) && v >= 0 ? v : 0;
};

/** Steht außerhalb der Rechner-Komponente, sonst verliert das Feld bei jedem
 *  Tastendruck den Fokus. Derselbe Fehler wie im Zakat-Rechner. */
const Feld = ({
  id,
  label,
  hinweis,
  wert,
  setWert,
  einheit,
}: {
  id: string;
  label: string;
  hinweis: string;
  wert: string;
  setWert: (v: string) => void;
  einheit: string;
}) => (
  <div>
    <label className="block text-[15px] font-semibold text-foreground" htmlFor={id}>
      {label}
    </label>
    <p className="mb-2 mt-0.5 text-[13px] text-muted-foreground">{hinweis}</p>
    <div className="relative">
      <input
        id={id}
        inputMode="decimal"
        value={wert}
        onChange={(e) => setWert(e.target.value)}
        className={inputClass}
      />
      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
        {einheit}
      </span>
    </div>
  </div>
);

type Weg = "gesamt" | "jeAnteil";

const WEGE: { id: Weg; label: string }[] = [
  { id: "gesamt", label: "Betrag und Satz" },
  { id: "jeAnteil", label: "Je Anteil" },
];

const BereinigungsRechner = () => {
  const [weg, setWeg] = useState<Weg>("gesamt");
  const [ertragText, setErtragText] = useState("300");
  const [satzText, setSatzText] = useState("5");
  const [jeAnteilText, setJeAnteilText] = useState("0,04");
  const [anteileText, setAnteileText] = useState("150");

  const ertrag = useMemo(() => zahl(ertragText), [ertragText]);
  const satz = useMemo(() => zahl(satzText), [satzText]);
  const jeAnteil = useMemo(() => zahl(jeAnteilText), [jeAnteilText]);
  const anteile = useMemo(() => zahl(anteileText), [anteileText]);

  const betrag = weg === "gesamt" ? (ertrag * satz) / 100 : jeAnteil * anteile;
  const bleibt = Math.max(0, ertrag - betrag);

  const rechenweg =
    weg === "gesamt"
      ? `${ertrag.toLocaleString("de-DE")} € × ${satz.toLocaleString("de-DE")} % = ${eur(betrag)}`
      : `${jeAnteil.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 4 })} € × ${anteile.toLocaleString("de-DE")} Anteile = ${eur(betrag)}`;

  return (
    <section className="container max-w-5xl px-0 pb-0 pt-0 md:px-6 md:pb-4 md:pt-14">
      <div className="grid grid-cols-1 items-start gap-6 md:gap-8 lg:grid-cols-[1.15fr_1fr]">
        {/* ── Eingaben ─────────────────────────────────────────────── */}
        <div className="rounded-[1.5rem] border border-border/70 bg-card p-5 md:p-7">
          <h2 className="headline text-xl md:text-2xl">Was du im Jahr bekommen hast</h2>
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
            Wähl den Weg, für den du die Zahlen hast. Beide führen zum selben Ergebnis.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-2 rounded-xl bg-muted p-1">
            {WEGE.map((w) => (
              <button
                key={w.id}
                type="button"
                aria-pressed={weg === w.id}
                onClick={() => setWeg(w.id)}
                className={`rounded-lg px-3 py-2.5 text-[14px] font-semibold transition ${
                  weg === w.id
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {w.label}
              </button>
            ))}
          </div>

          <div className="mt-6 space-y-6">
            {weg === "gesamt" ? (
              <>
                <Feld
                  id="ertrag"
                  label="Ausschüttung im Jahr"
                  hinweis="Was dir dein Fonds oder deine Aktie im Jahr ausgezahlt hat."
                  wert={ertragText}
                  setWert={setErtragText}
                  einheit="€"
                />
                <Feld
                  id="satz"
                  label="Unreiner Anteil"
                  hinweis="Steht beim Anbieter oder in deiner App. Wenn du nichts findest, lass die 5 Prozent stehen."
                  wert={satzText}
                  setWert={setSatzText}
                  einheit="%"
                />
              </>
            ) : (
              <>
                <Feld
                  id="jeAnteil"
                  label="Betrag je Anteil"
                  hinweis="Bei Thesaurierern und Einzelaktien weist der Anbieter oder die App einen Betrag je Anteil aus."
                  wert={jeAnteilText}
                  setWert={setJeAnteilText}
                  einheit="€"
                />
                <Feld
                  id="anteile"
                  label="Deine Anteile"
                  hinweis="Wie viele Anteile oder Aktien du im Depot hast."
                  wert={anteileText}
                  setWert={setAnteileText}
                  einheit="St."
                />
              </>
            )}
          </div>

          <div className="mt-6 rounded-2xl bg-accent p-5">
            <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-primary">Rechenweg</p>
            <p className="mt-2 text-[16px] font-semibold tabular-nums text-foreground">{rechenweg}</p>
          </div>
        </div>

        {/* ── Ergebnis ─────────────────────────────────────────────── */}
        <div className="space-y-4 lg:sticky lg:top-24">
          <div className="rounded-[1.5rem] bg-primary p-6 text-white md:p-7">
            <span className="text-[11px] font-semibold tracking-wide text-white/70">Das gibst du weiter</span>
            <p className="headline mt-3 text-4xl text-white md:text-5xl">{eur(betrag)}</p>
            <p className="mt-3 text-[14px] leading-relaxed text-white/80">
              {weg === "gesamt" ? (
                <>
                  Von <strong className="text-white">{eur(ertrag)}</strong> gibst du{" "}
                  <strong className="text-white">{eur(betrag)}</strong> weiter.{" "}
                  <strong className="text-white">{eur(bleibt)}</strong> bleiben bei dir und gehören dir ganz.
                </>
              ) : (
                <>
                  Für {anteile.toLocaleString("de-DE")} Anteile kommen{" "}
                  <strong className="text-white">{eur(betrag)}</strong> zusammen. Der Rest deiner Erträge
                  gehört dir.
                </>
              )}
            </p>
          </div>

          <div className="rounded-2xl border border-border/70 bg-surface p-5">
            <div className="flex items-start gap-2.5">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
              <p className="text-[13px] leading-relaxed text-muted-foreground">
                Der Betrag geht an Bedürftige, nicht an eine Moschee und nicht für Korankopien. Er zählt weder
                als Zakat noch als Spende, für die du Lohn erwartest.
              </p>
            </div>
          </div>

          <Link
            to="/wissen/ertraege-reinigen"
            className="group flex items-center justify-between gap-3 rounded-2xl border border-primary/60 bg-white px-5 py-4 transition hover:-translate-y-[1px] hover:border-primary"
          >
            <span className="text-[14px] font-semibold text-foreground">
              Welchen Satz dein Fonds nennt und wer selbst reinigt
            </span>
            <ArrowRight
              className="h-4 w-4 shrink-0 text-primary transition group-hover:translate-x-0.5"
              aria-hidden
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BereinigungsRechner;
