import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowRight, Car, Heart, Info, Landmark, MapPin, Moon, ShieldCheck } from "lucide-react";
import { monatlichFuerZiel, sparMonate, sparVerlauf } from "@/lib/rechner";
import { EuroFeld, Ergebnis, Regler, Wahl, dauerText, eur, parseEuro } from "@/components/rechner/Bausteine";

/**
 * Sparzielrechner.
 *
 * Ein Ziel, ein Betrag im Monat, ein Datum. Der Kreis oben ist der Fortschritt,
 * die Kurve darunter der Weg dorthin. Die Beispielbeträge der Vorlagen sind
 * Platzhalter zum Überschreiben, keine Preisangaben.
 */

type Ziel = "hajj" | "umrah" | "hochzeit" | "auto" | "eigenkapital" | "notgroschen";

const ZIELE: Record<Ziel, { titel: string; summe: string; symbol: React.ReactNode; satz: string }> = {
  hajj: { titel: "Hajj", summe: "8.000", symbol: <MapPin className="h-5 w-5" />, satz: "für die Hajj" },
  umrah: { titel: "Umrah", summe: "2.500", symbol: <Moon className="h-5 w-5" />, satz: "für die Umrah" },
  hochzeit: { titel: "Hochzeit", summe: "15.000", symbol: <Heart className="h-5 w-5" />, satz: "für die Hochzeit" },
  auto: { titel: "Auto ohne Kredit", summe: "20.000", symbol: <Car className="h-5 w-5" />, satz: "fürs Auto" },
  eigenkapital: { titel: "Eigenkapital", summe: "60.000", symbol: <Landmark className="h-5 w-5" />, satz: "als Eigenkapital" },
  notgroschen: { titel: "Notgroschen", summe: "9.000", symbol: <ShieldCheck className="h-5 w-5" />, satz: "als Notgroschen" },
};

const MONATE = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];

const datumIn = (monate: number) => {
  const d = new Date();
  d.setMonth(d.getMonth() + monate);
  return `${MONATE[d.getMonth()]} ${d.getFullYear()}`;
};

const SparzielRechner = () => {
  const [ziel, setZiel] = useState<Ziel>("hajj");
  const [zielText, setZielText] = useState(ZIELE.hajj.summe);
  const [startText, setStartText] = useState("");
  const [monatlichText, setMonatlichText] = useState("250");
  const [rendite, setRendite] = useState(0);

  const zielBetrag = useMemo(() => parseEuro(zielText), [zielText]);
  const start = useMemo(() => parseEuro(startText), [startText]);
  const monatlich = useMemo(() => parseEuro(monatlichText), [monatlichText]);

  const monate = useMemo(() => sparMonate(zielBetrag, start, monatlich, rendite), [zielBetrag, start, monatlich, rendite]);
  const verlauf = useMemo(
    () => sparVerlauf(start, monatlich, rendite, Math.min(Math.max(monate ?? 0, 12), 480)),
    [start, monatlich, rendite, monate],
  );
  const fortschritt = zielBetrag > 0 ? Math.min(100, (start / zielBetrag) * 100) : 0;

  const schneller = useMemo(
    () =>
      [12, 24, 36]
        .filter((m) => monate === null || m < monate)
        .map((m) => ({ monate: m, betrag: monatlichFuerZiel(zielBetrag, start, m, rendite) })),
    [zielBetrag, start, monate, rendite],
  );

  const waehle = (z: Ziel) => {
    setZiel(z);
    setZielText(ZIELE[z].summe);
  };

  const jahreImChart = verlauf.filter((v) => v.monat % 12 === 0 || v.monat === verlauf.length - 1);

  return (
    <section className="container max-w-5xl px-0 pb-0 pt-0 md:px-6 md:pb-4 md:pt-14">
      <div className="grid grid-cols-1 items-start gap-6 md:gap-8 lg:grid-cols-[1.15fr_1fr]">
        {/* ── Eingaben ─────────────────────────────────────────────── */}
        <div className="rounded-[1.5rem] border border-border/70 bg-card p-5 md:p-7">
          <h2 className="headline text-xl md:text-2xl">Wofür sparst du?</h2>
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
            Wähl ein Ziel oder trag dein eigenes ein. Die Beträge sind Beispiele.
          </p>

          <div className="mt-5">
            <Wahl<Ziel>
              wert={ziel}
              setWert={waehle}
              optionen={(Object.keys(ZIELE) as Ziel[]).map((z) => ({ wert: z, titel: ZIELE[z].titel, symbol: ZIELE[z].symbol }))}
            />
          </div>

          <div className="mt-6 space-y-6">
            <EuroFeld
              id="ziel-betrag"
              label="Was es kostet"
              hinweis="Beispielwert. Trag ein, was dein Ziel wirklich kostet."
              wert={zielText}
              setWert={setZielText}
            />
            <EuroFeld
              id="ziel-start"
              label="Schon gespart"
              hinweis="Was heute schon dafür liegt."
              wert={startText}
              setWert={setStartText}
              placeholder="0"
            />
            <EuroFeld
              id="ziel-monat"
              label="Jeden Monat zur Seite"
              hinweis="Fest, am besten am Tag nach dem Gehalt."
              wert={monatlichText}
              setWert={setMonatlichText}
            />
            <Regler
              id="ziel-rendite"
              label="Rendite pro Jahr"
              wert={rendite}
              min={0}
              max={8}
              schritt={0.5}
              einheit="%"
              setWert={setRendite}
              hinweis="0 Prozent ist das Konto ohne Zins, der sichere Weg für alles unter drei Jahren. Für lange Ziele kann ein Depot mit geprüften Anlagen mehr bringen, mit Schwankungen."
            />
          </div>

          {/* Kurve */}
          <div className="mt-8">
            <p className="text-[13px] font-semibold text-foreground">Dein Weg zum Ziel</p>
            <div className="mt-3 h-[200px] w-full md:h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={jahreImChart} margin={{ top: 8, right: 4, bottom: 0, left: 4 }}>
                  <defs>
                    <linearGradient id="sparziel" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--success))" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="hsl(var(--success))" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.6} />
                  <XAxis
                    dataKey="monat"
                    tickFormatter={(m: number) => (m === 0 ? "heute" : m % 12 === 0 ? `${m / 12} J.` : `${m} M.`)}
                    minTickGap={24}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  />
                  <YAxis
                    width={64}
                    domain={[0, Math.max(zielBetrag, verlauf[verlauf.length - 1]?.stand ?? 0, 1) * 1.05]}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(w: number) => w.toLocaleString("de-DE")}
                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  />
                  <Tooltip
                    cursor={false}
                    formatter={(v: number, name: string) => [eur(v), name === "stand" ? "Gespart" : "Eingezahlt"]}
                    labelFormatter={(m) => (Number(m) === 0 ? "Heute" : `Nach ${dauerText(Number(m))}`)}
                    contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", fontSize: 13 }}
                  />
                  <ReferenceLine y={zielBetrag} stroke="hsl(var(--foreground))" strokeDasharray="4 4" label={{ value: "Ziel", position: "insideTopRight", fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <Area type="monotone" dataKey="stand" stroke="hsl(var(--success))" strokeWidth={2} fill="url(#sparziel)" isAnimationActive={false} />
                  {rendite > 0 && (
                    <Area type="monotone" dataKey="eingezahlt" stroke="hsl(var(--muted-foreground))" strokeWidth={1.5} strokeDasharray="3 3" fill="none" isAnimationActive={false} />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
            {rendite > 0 && (
              <p className="mt-2 text-[13px] text-muted-foreground">
                Die gestrichelte Linie ist das, was du selbst einzahlst. Der Abstand zur grünen ist die Rendite.
              </p>
            )}
          </div>
        </div>

        {/* ── Ergebnis ─────────────────────────────────────────────── */}
        <div className="space-y-4 lg:sticky lg:top-36">
          <Ergebnis
            ton={monate === null ? "verlust" : "gewinn"}
            ueber={monate === 0 ? "Du hast es schon" : monate === null ? "So kommst du nicht an" : `Am Ziel in`}
            zahl={monate === 0 ? eur(zielBetrag) : monate === null ? "nie" : dauerText(monate, false)}
            satz={
              monate === 0 ? (
                <>Dein Erspartes deckt {ZIELE[ziel].satz.replace("für ", "die ").replace("fürs ", "das ").replace("als ", "den ")} schon ab.</>
              ) : monate === null ? (
                <>Ohne monatlichen Betrag wächst nichts. Trag ein, was du zur Seite legen kannst.</>
              ) : (
                <>
                  Mit <strong>{eur(monatlich)}</strong> im Monat hast du{" "}
                  <strong>{eur(zielBetrag)}</strong> {ZIELE[ziel].satz} im{" "}
                  <strong>{datumIn(monate)}</strong> zusammen.
                </>
              )
            }
          >
            <div className="mt-5">
              <div className="flex items-baseline justify-between text-[12px] text-muted-foreground">
                <span>Heute {eur(start)}</span>
                <span>Ziel {eur(zielBetrag)}</span>
              </div>
              <div className="relative mt-1.5 h-3 rounded-full bg-white">
                <div className="absolute left-0 top-0 h-3 rounded-full bg-gain" style={{ width: `${fortschritt}%` }} />
              </div>
              <p className="mt-1.5 text-[12px] text-muted-foreground">{Math.round(fortschritt)} Prozent geschafft</p>
            </div>
          </Ergebnis>

          {schneller.length > 0 && monate !== 0 && zielBetrag > 0 && (
            <div className="rounded-2xl border border-border/70 bg-white p-5">
              <p className="text-[13px] font-semibold text-foreground">Wenn es schneller gehen soll</p>
              <div className="mt-3 divide-y divide-border/70">
                {schneller.map((s) => (
                  <div key={s.monate} className="flex items-baseline justify-between py-2 text-[14px]">
                    <span className="text-muted-foreground">in {dauerText(s.monate, false)}</span>
                    <span className="font-bold text-foreground">{eur(s.betrag)} im Monat</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-start gap-2.5 rounded-2xl border border-border/70 bg-surface p-4">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
            <p className="text-[13px] leading-relaxed text-muted-foreground">
              Liegt das Ersparte ein Mondjahr lang über der Nisab-Grenze, fällt darauf Zakat. Wie viel,
              rechnet der{" "}
              <Link to="/zakat-rechner" className="font-semibold text-primary hover:underline">
                Zakat-Rechner
              </Link>
              .
            </p>
          </div>

          <Link
            to="/budgetrechner"
            className="group flex items-center justify-between gap-3 rounded-2xl border border-primary/60 bg-white px-5 py-4 transition hover:-translate-y-[1px] hover:border-primary"
          >
            <span className="text-[14px] font-semibold text-foreground">Wie viel im Monat wirklich frei ist</span>
            <ArrowRight className="h-4 w-4 shrink-0 text-primary transition group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SparzielRechner;
