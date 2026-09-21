import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowRight, Car, Home, Info, Sofa } from "lucide-react";
import { kreditKosten, kreditVerlauf, sparMonate } from "@/lib/rechner";
import { bauzins } from "@/data/rechnerQuellen";
import { EuroFeld, Ergebnis, QuelleZeile, Regler, Wahl, dauerText, eur, parseEuro } from "@/components/rechner/Bausteine";

/**
 * Kreditkostenrechner.
 *
 * Drei Angaben, ein Bild: was du leihst, was du zurückzahlst, und wie groß
 * der Zinsanteil ist. Der Zins wird rot gezeichnet, weil er eine Bewertung
 * ist, keine Dekoration: es ist der Teil, der Riba ist.
 *
 * Darunter der Vergleich, den kein Bankrechner zeigt: dieselbe Rate gespart
 * statt gezahlt.
 */

type Vorlage = "haus" | "auto" | "moebel";

const VORLAGEN: Record<Vorlage, { summe: string; jahre: number }> = {
  haus: { summe: "300.000", jahre: 30 },
  auto: { summe: "25.000", jahre: 6 },
  moebel: { summe: "5.000", jahre: 3 },
};

const KreditkostenRechner = () => {
  const [vorlage, setVorlage] = useState<Vorlage>("haus");
  const [summeText, setSummeText] = useState(VORLAGEN.haus.summe);
  const [zins, setZins] = useState(bauzins.prozent);
  const [jahre, setJahre] = useState(VORLAGEN.haus.jahre);
  const [rendite, setRendite] = useState(0);

  const summe = useMemo(() => parseEuro(summeText), [summeText]);
  const kosten = useMemo(() => kreditKosten(summe, zins, jahre), [summe, zins, jahre]);
  const verlauf = useMemo(() => kreditVerlauf(summe, zins, jahre), [summe, zins, jahre]);

  const sparen = useMemo(() => sparMonate(summe, 0, kosten.rate, rendite), [summe, kosten.rate, rendite]);
  const sparenOhne = useMemo(() => sparMonate(summe, 0, kosten.rate, 0), [summe, kosten.rate]);

  const waehle = (v: Vorlage) => {
    setVorlage(v);
    setSummeText(VORLAGEN[v].summe);
    setJahre(VORLAGEN[v].jahre);
  };

  const zinsAnteil = kosten.gesamt > 0 ? Math.round((kosten.zinsen / kosten.gesamt) * 100) : 0;
  const faktorText = kosten.faktor.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const ding = vorlage === "haus" ? "Das Haus" : vorlage === "auto" ? "Das Auto" : "Die Möbel";
  const kostet = vorlage === "moebel" ? "kosten" : "kostet";

  return (
    <section className="container max-w-5xl px-0 pb-0 pt-0 md:px-6 md:pb-4 md:pt-14">
      <div className="grid grid-cols-1 items-start gap-6 md:gap-8 lg:grid-cols-[1.15fr_1fr]">
        {/* ── Eingaben ─────────────────────────────────────────────── */}
        <div className="rounded-[1.5rem] border border-border/70 bg-card p-5 md:p-7">
          <h2 className="headline text-xl md:text-2xl">Was willst du kaufen?</h2>
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
            Drei Angaben. Die Beispiele kannst du überschreiben.
          </p>

          <div className="mt-5">
            <Wahl<Vorlage>
              wert={vorlage}
              setWert={waehle}
              optionen={[
                { wert: "haus", titel: "Haus", unter: "300.000 €, 30 Jahre", symbol: <Home className="h-5 w-5" /> },
                { wert: "auto", titel: "Auto", unter: "25.000 €, 6 Jahre", symbol: <Car className="h-5 w-5" /> },
                { wert: "moebel", titel: "Möbel", unter: "5.000 €, 3 Jahre", symbol: <Sofa className="h-5 w-5" /> },
              ]}
            />
          </div>

          <div className="mt-6 space-y-6">
            <EuroFeld
              id="kredit-summe"
              label="Kreditsumme"
              hinweis="Was die Bank dir leiht."
              wert={summeText}
              setWert={setSummeText}
            />

            <Regler
              id="kredit-zins"
              label="Zins pro Jahr"
              wert={zins}
              min={0}
              max={15}
              schritt={0.05}
              einheit="%"
              setWert={setZins}
              hinweis={
                <>
                  Voreingestellt ist der Durchschnitt für Wohnungsbaukredite im {bauzins.monat},{" "}
                  {bauzins.prozent.toLocaleString("de-DE")} Prozent. Auto- und Ratenkredite liegen
                  meist höher. Trag den Zins aus deinem Angebot ein.
                </>
              }
            />

            <Regler
              id="kredit-jahre"
              label="Laufzeit"
              wert={jahre}
              min={1}
              max={40}
              schritt={1}
              einheit={jahre === 1 ? "Jahr" : "Jahre"}
              setWert={setJahre}
            />
          </div>

          {/* Zinsen gegen Tilgung über die Jahre */}
          <div className="mt-8">
            <p className="text-[13px] font-semibold text-foreground">Was du bis dahin gezahlt hast</p>
            <p className="mt-0.5 text-[12px] text-muted-foreground">
              Rot ist der Zins, blau das, was den Kredit wirklich kleiner macht.
            </p>
            <div className="mt-3 h-[200px] w-full md:h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={verlauf} margin={{ top: 8, right: 4, bottom: 0, left: 4 }}>
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
                    width={64}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(w: number) => w.toLocaleString("de-DE")}
                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  />
                  <Tooltip
                    cursor={false}
                    formatter={(v: number, name: string) => [eur(v), name === "zinsen" ? "Zinsen" : "Getilgt"]}
                    labelFormatter={(j) => `Nach ${j} ${Number(j) === 1 ? "Jahr" : "Jahren"}`}
                    contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", fontSize: 13 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="tilgung"
                    stackId="a"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.25}
                    strokeWidth={2}
                    isAnimationActive={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="zinsen"
                    stackId="a"
                    stroke="hsl(var(--destructive))"
                    fill="hsl(var(--destructive))"
                    fillOpacity={0.25}
                    strokeWidth={2}
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-[13px] text-muted-foreground">
              In den ersten Jahren geht der größte Teil jeder Rate an den Zins. Deshalb bleibt die
              Schuld anfangs fast gleich groß.
            </p>
          </div>
        </div>

        {/* ── Ergebnis ─────────────────────────────────────────────── */}
        <div className="space-y-4 lg:sticky lg:top-36">
          <Ergebnis
            ton="verlust"
            ueber={`Für ${eur(summe)} zahlst du zurück`}
            zahl={eur(kosten.gesamt)}
            satz={
              <>
                Davon sind <strong>{eur(kosten.zinsen)}</strong> Zinsen, also{" "}
                {zinsAnteil} Prozent von allem, was du überweist. {ding} {kostet} dich{" "}
                <strong>{faktorText}-mal</strong>.
              </>
            }
          >
            <div className="mt-5 h-[96px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={[
                    { name: "Geliehen", wert: Math.round(summe) },
                    { name: "Zinsen", wert: Math.round(kosten.zinsen) },
                  ]}
                  margin={{ top: 0, right: 84, bottom: 0, left: 0 }}
                  barCategoryGap={8}
                >
                  <XAxis type="number" hide domain={[0, Math.max(summe, kosten.zinsen, 1) * 1.05]} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={72}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  />
                  <Tooltip
                    cursor={false}
                    formatter={(v: number) => [eur(v), ""]}
                    contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", fontSize: 13 }}
                  />
                  <Bar dataKey="wert" radius={[0, 4, 4, 0]} isAnimationActive={false}>
                    <Cell fill="hsl(var(--primary) / 0.28)" />
                    <Cell fill="hsl(var(--loss))" />
                    <LabelList
                      dataKey="wert"
                      position="right"
                      formatter={(v: number) => eur(v)}
                      style={{ fill: "hsl(var(--foreground))", fontSize: 13, fontWeight: 700 }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Ergebnis>

          <div className="rounded-2xl border border-border/70 bg-white p-5">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-[13px] font-semibold text-foreground">Rate im Monat</p>
              <p className="text-[22px] font-bold text-foreground">{eur(kosten.rate)}</p>
            </div>
            <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
              {Math.round(jahre * 12)} Mal, jeden Monat, {jahre} {jahre === 1 ? "Jahr" : "Jahre"} lang.
            </p>
          </div>

          {/* Sparen statt leihen */}
          <div className="rounded-2xl border border-[hsl(var(--success))]/40 bg-[hsl(var(--success)/0.06)] p-5">
            <p className="text-[13px] font-semibold text-foreground">Dieselbe Rate gespart statt gezahlt</p>
            {sparenOhne !== null ? (
              <>
                <p className="mt-2 text-[14px] leading-relaxed text-foreground/85">
                  Legst du {eur(kosten.rate)} jeden Monat zur Seite, hast du {eur(summe)} in{" "}
                  <strong>{dauerText(sparenOhne)}</strong> zusammen
                  {rendite > 0 && sparen !== null && sparen < sparenOhne ? (
                    <>
                      , mit {rendite.toLocaleString("de-DE")} Prozent Rendite in <strong>{dauerText(sparen)}</strong>
                    </>
                  ) : null}
                  . Die {eur(kosten.zinsen)} Zinsen bleiben bei dir.
                </p>
                <div className="mt-3 space-y-2">
                  {[
                    { label: "Kredit", monate: Math.round(jahre * 12), farbe: "bg-[hsl(var(--destructive))]" },
                    { label: "Sparen", monate: sparen ?? sparenOhne, farbe: "bg-[hsl(var(--success))]" },
                  ].map((z) => {
                    const max = Math.max(jahre * 12, sparenOhne, 1);
                    return (
                      <div key={z.label} className="grid grid-cols-[64px_1fr] items-center gap-3">
                        <span className="text-[12px] font-semibold text-foreground">{z.label}</span>
                        <div className="relative h-7 rounded-full bg-white">
                          <div
                            className={`absolute left-0 top-0 h-7 rounded-full ${z.farbe}`}
                            style={{ width: `${Math.max(8, (z.monate / max) * 100)}%` }}
                          />
                          <span className="absolute top-1/2 -translate-y-1/2 pl-3 text-[12px] font-bold text-white">
                            {dauerText(z.monate, false)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4">
                  <Regler
                    id="kredit-rendite"
                    label="Rendite beim Sparen"
                    wert={rendite}
                    min={0}
                    max={8}
                    schritt={0.5}
                    einheit="%"
                    setWert={setRendite}
                    hinweis="0 Prozent ist das Konto ohne Zins. Was ein Depot mit geprüften Anlagen bringen kann, zeigt der Renditerechner."
                  />
                </div>
              </>
            ) : (
              <p className="mt-2 text-[14px] text-muted-foreground">Trag eine Kreditsumme ein.</p>
            )}
          </div>

          <div className="flex items-start gap-2.5 rounded-2xl border border-border/70 bg-surface p-4">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
            <p className="text-[13px] leading-relaxed text-muted-foreground">
              Ein Haus kann nicht jeder erst ansparen. Welche Wege es ohne Zins gibt, steht in{" "}
              <Link to="/wissen/haus-kaufen-ohne-zinsen" className="font-semibold text-primary hover:underline">
                Haus kaufen ohne Zinsen
              </Link>
              .
            </p>
          </div>

          <Link
            to="/renditerechner"
            className="group flex items-center justify-between gap-3 rounded-2xl border border-primary/60 bg-white px-5 py-4 transition hover:-translate-y-[1px] hover:border-primary"
          >
            <span className="text-[14px] font-semibold text-foreground">
              Was aus {eur(kosten.rate)} im Monat in einem Depot wird
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 text-primary transition group-hover:translate-x-0.5" aria-hidden />
          </Link>

          <p className="px-1 text-[12px] text-muted-foreground">
            <QuelleZeile {...bauzins.quelle} />
          </p>
        </div>
      </div>
    </section>
  );
};

export default KreditkostenRechner;
