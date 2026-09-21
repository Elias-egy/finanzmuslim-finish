import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { ArrowRight, Info } from "lucide-react";

/**
 * Inflationsrechner.
 *
 * Er rechnet nichts Kompliziertes: Betrag geteilt durch (1 + Inflation) hoch
 * Jahre. Der Wert liegt nicht in der Formel, sondern darin, dass die Zahl auf
 * dem Konto gleich bleibt und trotzdem weniger wert ist. Genau das sieht man
 * sonst nirgends.
 *
 * Die Grafik zeigt bewusst nur eine Linie, die Kaufkraft. Zwei Linien laden
 * dazu ein, die falsche abzulesen.
 */

const eur = (n: number) =>
  n.toLocaleString("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

const inputClass =
  "w-full rounded-xl border border-border bg-white px-4 py-3 pr-10 text-[16px] font-medium text-foreground outline-none transition focus:border-primary/50";

/** Steht ausserhalb der Rechner-Komponente, sonst verliert das Feld bei jedem
 *  Tastendruck den Fokus. Derselbe Fehler wie im Zakat-Rechner. */
const Regler = ({
  id,
  label,
  wert,
  min,
  max,
  schritt,
  einheit,
  setWert,
}: {
  id: string;
  label: string;
  wert: number;
  min: number;
  max: number;
  schritt: number;
  einheit: string;
  setWert: (v: number) => void;
}) => (
  <div>
    <div className="flex items-baseline justify-between gap-3">
      <label className="text-[15px] font-semibold text-foreground" htmlFor={id}>
        {label}
      </label>
      <span className="text-[15px] font-bold text-foreground">
        {wert.toLocaleString("de-DE")} {einheit}
      </span>
    </div>
    <input
      id={id}
      type="range"
      min={min}
      max={max}
      step={schritt}
      value={wert}
      onChange={(e) => setWert(Number(e.target.value))}
      className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-accent accent-primary"
    />
  </div>
);

const InflationsRechner = () => {
  const [betragText, setBetragText] = useState("10.000");
  const [jahre, setJahre] = useState(10);
  const [rate, setRate] = useState(2.5);

  const betrag = useMemo(() => {
    const v = parseFloat(betragText.replace(/\./g, "").replace(",", "."));
    return Number.isFinite(v) && v > 0 ? v : 0;
  }, [betragText]);

  const reihe = useMemo(
    () =>
      Array.from({ length: jahre + 1 }, (_, j) => ({
        jahr: j,
        kaufkraft: Math.round(betrag / (1 + rate / 100) ** j),
      })),
    [betrag, jahre, rate],
  );

  const rest = reihe[reihe.length - 1].kaufkraft;
  const verlust = Math.max(0, betrag - rest);
  const anteil = betrag > 0 ? Math.round((verlust / betrag) * 100) : 0;

  return (
    <section className="container max-w-5xl px-0 pb-0 pt-0 md:px-6 md:pb-4 md:pt-14">
      <div className="grid grid-cols-1 items-start gap-6 md:gap-8 lg:grid-cols-[1.15fr_1fr]">
        {/* ── Eingaben ─────────────────────────────────────────────── */}
        <div className="rounded-[1.5rem] border border-border/70 bg-card p-5 md:p-7">
          <h2 className="headline text-xl md:text-2xl">Dein Geld auf dem Konto</h2>
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
            Trag ein, was liegen bleibt, und über wie viele Jahre.
          </p>

          <div className="mt-6 space-y-6">
            <div>
              <label className="block text-[15px] font-semibold text-foreground" htmlFor="betrag">
                Betrag
              </label>
              <p className="mb-2 mt-0.5 text-[13px] text-muted-foreground">
                Was unangetastet auf dem Konto liegt.
              </p>
              <div className="relative">
                <input
                  id="betrag"
                  inputMode="decimal"
                  value={betragText}
                  onChange={(e) => setBetragText(e.target.value)}
                  className={inputClass}
                />
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  €
                </span>
              </div>
            </div>

            <Regler
              id="jahre"
              label="Zeitraum"
              wert={jahre}
              min={1}
              max={30}
              schritt={1}
              einheit={jahre === 1 ? "Jahr" : "Jahre"}
              setWert={setJahre}
            />

            <div>
              <Regler
                id="rate"
                label="Inflation pro Jahr"
                wert={rate}
                min={0}
                max={8}
                schritt={0.1}
                einheit="%"
                setWert={setRate}
              />
              <p className="mt-2 text-[13px] text-muted-foreground">
                Die Europäische Zentralbank strebt 2 Prozent an. In manchen Jahren lag sie deutlich
                darüber.
              </p>
            </div>
          </div>

          <div className="mt-6 h-[200px] w-full md:h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={reihe} margin={{ top: 8, right: 4, bottom: 0, left: 4 }}>
                <defs>
                  <linearGradient id="kaufkraft" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--loss))" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="hsl(var(--loss))" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.6} />
                <XAxis
                  dataKey="jahr"
                  tickFormatter={(j: number) => (j === 0 ? "heute" : `${j}`)}
                  minTickGap={24}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  domain={[0, betrag || 1]}
                  width={64}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(w: number) => w.toLocaleString("de-DE")}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                />
                <Area
                  type="monotone"
                  dataKey="kaufkraft"
                  stroke="hsl(var(--loss))"
                  strokeWidth={2.5}
                  fill="url(#kaufkraft)"
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-[13px] text-muted-foreground">
            Die Linie ist die Kaufkraft. Auf dem Konto stehen die ganze Zeit {eur(betrag)}.
          </p>
        </div>

        {/* ── Ergebnis ─────────────────────────────────────────────── */}
        <div className="space-y-4 lg:sticky lg:top-24">
          <div className="ergebnis-karte" data-ton="verlust">
            <span className="ergebnis-ueber">
              Wert in {jahre} {jahre === 1 ? "Jahr" : "Jahren"}
            </span>
            <p className="ergebnis-zahl">{eur(rest)}</p>
            <p className="ergebnis-satz">
              Aus <strong>{eur(betrag)}</strong> werden nach {jahre}{" "}
              {jahre === 1 ? "Jahr" : "Jahren"} real rund{" "}
              <strong>{eur(rest)}</strong>. Du verlierst{" "}
              <strong>{eur(verlust)}</strong> Kaufkraft, also {anteil}{" "}
              Prozent, ohne dass etwas vom Konto verschwindet.
            </p>
          </div>

          <div className="rounded-2xl border border-border/70 bg-surface p-5">
            <div className="flex items-start gap-2.5">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
              <p className="text-[13px] leading-relaxed text-muted-foreground">
                Die Zahl auf dem Konto bleibt gleich. Was sich ändert, ist, wie viel du dafür
                bekommst. Genau das nennt man Kaufkraftverlust.
              </p>
            </div>
          </div>

          <Link
            to="/renditerechner"
            className="group flex items-center justify-between gap-3 rounded-2xl border border-primary/60 bg-white px-5 py-4 transition hover:-translate-y-[1px] hover:border-primary"
          >
            <span className="text-[14px] font-semibold text-foreground">
              Sieh, wie dein Geld stattdessen wachsen kann
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

export default InflationsRechner;
