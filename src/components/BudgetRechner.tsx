import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ArrowRight, ChevronDown } from "lucide-react";
import { budgetAufteilung } from "@/lib/rechner";
import { faustregel, sparquote } from "@/data/rechnerQuellen";
import { EuroFeld, Ergebnis, QuelleZeile, eur, parseEuro, prozent } from "@/components/rechner/Bausteine";

/**
 * Budgetrechner.
 *
 * Vier Zahlen rein, ein Kreis raus. Der Kreis zeigt, wohin das Netto geht und
 * was übrig bleibt. Grün ist der freie Teil, weil das die eine Zahl ist, die
 * der Leser wissen will. Rot gibt es nur, wenn mehr rausgeht als reinkommt.
 *
 * Darunter der Vergleich mit der 50/30/20-Faustregel und mit der deutschen
 * Sparquote. Beides belegt, beides nur Orientierung.
 */

type Teil = { id: string; name: string; wert: number; farbe: string };

const Zeile = ({ name, ist, soll, netto }: { name: string; ist: number; soll: number; netto: number }) => {
  const istP = netto > 0 ? (ist / netto) * 100 : 0;
  const sollP = netto > 0 ? (soll / netto) * 100 : 0;
  const max = Math.max(istP, sollP, 1);
  return (
    <div className="grid grid-cols-[96px_1fr] items-center gap-3 md:grid-cols-[140px_1fr]">
      <span className="text-[13px] font-semibold text-foreground">{name}</span>
      <div className="space-y-1">
        <div className="relative h-6 rounded-full bg-muted">
          <div className="absolute left-0 top-0 h-6 rounded-full bg-primary" style={{ width: `${Math.min(100, (istP / max) * 100)}%` }} />
          <span className="absolute top-1/2 -translate-y-1/2 pl-2.5 text-[11px] font-bold text-white">
            du: {prozent(istP)}
          </span>
        </div>
        <div className="relative h-6 rounded-full bg-muted">
          <div className="absolute left-0 top-0 h-6 rounded-full bg-primary/25" style={{ width: `${Math.min(100, (sollP / max) * 100)}%` }} />
          <span className="absolute top-1/2 -translate-y-1/2 pl-2.5 text-[11px] font-semibold text-foreground">
            Faustregel: {prozent(sollP)}
          </span>
        </div>
      </div>
    </div>
  );
};

const BudgetRechner = () => {
  const [nettoText, setNettoText] = useState("3.000");
  const [wohnenText, setWohnenText] = useState("1.000");
  const [fixText, setFixText] = useState("400");
  const [alltagText, setAlltagText] = useState("800");
  const [mehrOffen, setMehrOffen] = useState(false);
  const [gebenText, setGebenText] = useState("");

  const netto = useMemo(() => parseEuro(nettoText), [nettoText]);
  const wohnen = useMemo(() => parseEuro(wohnenText), [wohnenText]);
  const fix = useMemo(() => parseEuro(fixText), [fixText]);
  const alltag = useMemo(() => parseEuro(alltagText), [alltagText]);
  const geben = useMemo(() => parseEuro(gebenText), [gebenText]);

  const b = useMemo(() => budgetAufteilung(netto, wohnen, fix + geben, alltag), [netto, wohnen, fix, geben, alltag]);

  const teile: Teil[] = useMemo(
    () =>
      [
        // Farbe sitzt in den Daten, nicht in der Flaeche (Elias, 21.09.2026). Gruen bleibt dem
        // freien Teil vorbehalten, Rot kommt nicht vor: keine Ausgabe ist hier ein Urteil.
        { id: "wohnen", name: "Wohnen", wert: wohnen, farbe: "#0057FA" },
        { id: "fix", name: "Feste Kosten", wert: fix, farbe: "#7D6EF2" },
        { id: "alltag", name: "Alltag und Freizeit", wert: alltag, farbe: "#FFB020" },
        { id: "geben", name: "Geben", wert: geben, farbe: "#00A7A5" },
        { id: "frei", name: "Frei", wert: b.frei, farbe: "hsl(var(--gain))" },
      ].filter((t) => t.wert > 0),
    [wohnen, fix, alltag, geben, b.frei],
  );

  const sparQuoteIst = b.freiProzent;

  return (
    <section className="container max-w-5xl px-0 pb-0 pt-0 md:px-6 md:pb-4 md:pt-14">
      <div className="grid grid-cols-1 items-start gap-6 md:gap-8 lg:grid-cols-[1.15fr_1fr]">
        {/* ── Eingaben ─────────────────────────────────────────────── */}
        <div className="rounded-[1.5rem] border border-border/70 bg-card p-5 md:p-7">
          <h2 className="headline text-xl md:text-2xl">Was kommt rein, was geht raus?</h2>
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
            Vier Zahlen im Monat. Grob reicht, es geht ums Bild.
          </p>

          <div className="mt-6 space-y-6">
            <EuroFeld
              id="budget-netto"
              label="Netto im Monat"
              hinweis="Was nach Steuern und Abgaben auf dem Konto landet, mit Kindergeld."
              wert={nettoText}
              setWert={setNettoText}
            />
            <EuroFeld
              id="budget-wohnen"
              label="Wohnen"
              hinweis="Miete warm oder die Wohnkosten im eigenen Haus, mit Strom und Internet."
              wert={wohnenText}
              setWert={setWohnenText}
            />
            <EuroFeld
              id="budget-fix"
              label="Feste Kosten"
              hinweis="Versicherungen, Handy, Abos, Auto oder Fahrkarte, Kita."
              wert={fixText}
              setWert={setFixText}
            />
            <EuroFeld
              id="budget-alltag"
              label="Alltag und Freizeit"
              hinweis="Essen, Kleidung, Ausgehen, Geschenke. Alles, was schwankt."
              wert={alltagText}
              setWert={setAlltagText}
            />

            <div className="rounded-xl border border-border/70 bg-white/60">
              <button
                type="button"
                onClick={() => setMehrOffen((o) => !o)}
                aria-expanded={mehrOffen}
                className="flex w-full items-center justify-between px-4 py-3 text-[14px] font-semibold text-foreground"
              >
                Mehr Angaben
                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${mehrOffen ? "rotate-180" : ""}`} aria-hidden />
              </button>
              {mehrOffen && (
                <div className="border-t border-border/70 px-4 py-4">
                  <EuroFeld
                    id="budget-geben"
                    label="Geben im Monat"
                    hinweis="Sadaqa und Unterstützung für die Familie."
                    wert={gebenText}
                    setWert={setGebenText}
                    placeholder="0"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Ergebnis ─────────────────────────────────────────────── */}
        <div className="space-y-4 lg:sticky lg:top-36">
          <Ergebnis
            ton={b.minus > 0 ? "verlust" : "gewinn"}
            ueber={b.minus > 0 ? "Dir fehlen jeden Monat" : "Frei im Monat"}
            zahl={b.minus > 0 ? eur(b.minus) : eur(b.frei)}
            satz={
              b.minus > 0 ? (
                <>
                  Du gibst <strong>{eur(b.minus)}</strong> mehr aus, als reinkommt. Das
                  geht nur mit Dispo oder Erspartem, und beides wird jeden Monat weniger.
                </>
              ) : (
                <>
                  Von <strong>{eur(netto)}</strong> bleiben{" "}
                  <strong>{eur(b.frei)}</strong> übrig, also {prozent(b.freiProzent)}. Das
                  ist der Teil, mit dem du etwas aufbauen kannst.
                </>
              )
            }
          >
            <div className="mt-4 h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    formatter={(v: number, name: string) => [eur(v), name]}
                    contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", fontSize: 13 }}
                  />
                  <Pie
                    data={teile.length ? teile : [{ id: "leer", name: "Netto", wert: 1, farbe: "hsl(var(--primary) / 0.15)" }]}
                    dataKey="wert"
                    nameKey="name"
                    innerRadius={56}
                    outerRadius={92}
                    paddingAngle={2}
                    stroke="hsl(var(--accent))"
                    strokeWidth={2}
                    isAnimationActive={false}
                  >
                    {(teile.length ? teile : [{ id: "leer", farbe: "hsl(var(--primary) / 0.15)" }]).map((t) => (
                      <Cell key={t.id} fill={t.farbe} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-muted-foreground">
              {teile.map((t) => (
                <span key={t.id} className="inline-flex items-center gap-1.5">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: t.farbe }}
                  />
                  {t.name} {eur(t.wert)}
                </span>
              ))}
            </div>
          </Ergebnis>

          {/* Faustregel */}
          <div className="rounded-2xl border border-border/70 bg-white p-5">
            <p className="text-[13px] font-semibold text-foreground">Du gegen die 50/30/20-Faustregel</p>
            <div className="mt-4 space-y-3">
              <Zeile name="Nötig" ist={b.noetig} soll={b.ziel.noetig} netto={netto} />
              <Zeile name="Wünsche" ist={b.wuensche} soll={b.ziel.wuensche} netto={netto} />
              <Zeile name="Aufbauen" ist={b.frei} soll={b.ziel.sparen} netto={netto} />
            </div>
            <QuelleZeile {...faustregel.quelle} />
          </div>

          <div className="rounded-2xl border border-border/70 bg-white p-5">
            <p className="text-[13px] font-semibold text-foreground">Und im Vergleich zu Deutschland</p>
            <p className="mt-1 text-[14px] leading-relaxed text-foreground/85">
              Du legst {prozent(sparQuoteIst)} zur Seite. Die Haushalte in Deutschland sparten im{" "}
              {sparquote.zeitraum} im Schnitt {prozent(sparquote.prozent, 1)}.
            </p>
            <div className="mt-3 space-y-2">
              {[
                { label: "Du", wert: sparQuoteIst, farbe: sparQuoteIst >= sparquote.prozent ? "bg-[hsl(var(--success))]" : "bg-[hsl(var(--warning))]" },
                { label: "Schnitt", wert: sparquote.prozent, farbe: "bg-primary/30" },
              ].map((z) => {
                const max = Math.max(sparQuoteIst, sparquote.prozent, 1);
                return (
                  <div key={z.label} className="grid grid-cols-[64px_1fr] items-center gap-3">
                    <span className="text-[12px] font-semibold text-foreground">{z.label}</span>
                    <div className="relative h-6 rounded-full bg-muted">
                      <div className={`absolute left-0 top-0 h-6 rounded-full ${z.farbe}`} style={{ width: `${Math.max(6, (z.wert / max) * 100)}%` }} />
                      <span className={`absolute top-1/2 -translate-y-1/2 pl-2.5 text-[11px] font-bold ${z.label === "Du" ? "text-white" : "text-foreground"}`}>
                        {prozent(z.wert, 1)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <QuelleZeile {...sparquote.quelle} />
          </div>

          {b.frei > 0 && (
            <Link
              to="/sparzielrechner"
              className="group flex items-center justify-between gap-3 rounded-2xl border border-primary/60 bg-white px-5 py-4 transition hover:-translate-y-[1px] hover:border-primary"
            >
              <span className="text-[14px] font-semibold text-foreground">
                Wann du mit {eur(b.frei)} im Monat am Ziel bist
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-primary transition group-hover:translate-x-0.5" aria-hidden />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default BudgetRechner;
