import { useEffect, useMemo, useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { Check, ChevronDown, Download, Loader2 } from "lucide-react";
import Seo from "@/components/Seo";
import GiroAufruf from "@/components/vorlagen/GiroAufruf";
import { AnlageLogo } from "@/components/AnlageZeile";
import { bausteinById, SCHMERZ, type BausteinId } from "@/data/portfolioPlan";
import { ereignis } from "@/lib/messung";
import kurse from "@/data/kurse.json";
import {
  antwortText,
  aufteilung,
  beantwortet,
  BEISPIEL,
  BETRAEGE,
  BROKER,
  euroText,
  FRAGEN,
  fortschritt,
  GEKAUFT,
  inEuro,
  LAGEN,
  produktFuer,
  prozentText,
  QUIZ_PFAD,
  QUIZ_SCHLUESSEL,
  WEISE,
  WERTE,
  type Anteil,
  type Antworten,
  type FrageId,
  type Wahl,
  type Wert,
} from "@/data/portfolioQuiz";

/**
 * /dein-portfolioplan/<schluessel>: der persönliche Halal-Portfolioplan, die Belohnung auf FERTIG (CV26P, 08.11.2026).
 *
 * Elias, CV26P: „ein bisschen edler, wie so ein Onboarding, wo sich die Fragen so vor dir aufklappen … ohne diese
 * typischen Emojis … Und links oder so siehst du gerade, wie sich irgendwas entwickelt anhand deiner Fragen … Dein
 * Portfolioplan ist zu so viel Prozent fertig oder irgendein Diagramm füllt sich … sehr handyfreundlich“
 * (Vault raw/2026-11-08-elias-cv26p-quiz-wie-onboarding-plan-fuellt-sich.md). Darum: am Handy oben ein Ring, der sich
 * mit jeder Antwort in den Farben des eigenen Plans füllt, am Laptop links daneben; die Fragen stehen untereinander, die
 * aktuelle klappt auf, beantwortete werden zu einer Zeile zum Ändern. Danach der Plan, die PDF, das Girokonto.
 * Versteckt wie der Portfolio-Plan: noindex, nicht in Menü und Sitemap (routen.ts, nichtIndexiert).
 */

const SPEICHER = "fm-portfolioplan-antworten";

const lies = (): Antworten => {
  try {
    const roh = window.localStorage.getItem(SPEICHER);
    return roh ? (JSON.parse(roh) as Antworten) : {};
  } catch {
    return {};
  }
};

const schreibe = (a: Antworten) => {
  try {
    window.localStorage.setItem(SPEICHER, JSON.stringify(a));
  } catch {
    /* privates Fenster: geht auch ohne */
  }
};

const wenigBewegung = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/** Ring aus den Bausteinen des Plans, gezeichnet bis zum Fortschritt: so füllt er sich mit jeder Antwort. */
export const PlanRing = ({
  anteile,
  anteilGezeigt,
  groesse,
  dicke,
  children,
}: {
  anteile: Anteil[];
  /** 0 bis 1: wie viel vom Kreis schon gefüllt ist. */
  anteilGezeigt: number;
  groesse: number;
  dicke: number;
  children?: React.ReactNode;
}) => {
  const r = (groesse - dicke) / 2;
  const umfang = 2 * Math.PI * r;
  const summe = anteile.reduce((s, x) => s + x.prozent, 0) || 1;
  const luecke = anteile.length > 1 ? Math.min(4, umfang * 0.01) : 0;
  let start = 0;
  return (
    <div className="relative shrink-0" style={{ width: groesse, height: groesse }}>
      <svg width={groesse} height={groesse} viewBox={`0 0 ${groesse} ${groesse}`} className="-rotate-90" aria-hidden>
        <circle cx={groesse / 2} cy={groesse / 2} r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth={dicke} />
        {anteile.map((x) => {
          const voll = (x.prozent / summe) * umfang;
          const sichtbar = Math.max(0, Math.min(voll, anteilGezeigt * umfang - start) - luecke);
          const el = (
            <circle
              key={x.baustein}
              cx={groesse / 2}
              cy={groesse / 2}
              r={r}
              fill="none"
              stroke={bausteinById(x.baustein).farbe}
              strokeWidth={dicke}
              strokeDasharray={`${sichtbar} ${umfang}`}
              strokeDashoffset={-start}
              style={{ transition: wenigBewegung() ? undefined : "stroke-dasharray 700ms cubic-bezier(.2,.8,.2,1), stroke-dashoffset 700ms cubic-bezier(.2,.8,.2,1)" }}
            />
          );
          start += voll;
          return el;
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">{children}</div>
    </div>
  );
};

const Auswahl = <T extends string | number>({
  wahl,
  gewaehlt,
  onWahl,
  mehrere,
}: {
  wahl: Wahl<T>[];
  gewaehlt: (id: T) => boolean;
  onWahl: (id: T) => void;
  mehrere?: boolean;
}) => (
  <div className="grid gap-2" role={mehrere ? "group" : "radiogroup"}>
    {wahl.map((w) => {
      const an = gewaehlt(w.id);
      return (
        <button
          key={String(w.id)}
          type="button"
          role={mehrere ? "checkbox" : "radio"}
          aria-checked={an}
          onClick={() => onWahl(w.id)}
          className={`flex min-h-[60px] w-full items-center gap-3 rounded-xl border bg-white px-4 py-3 text-left transition-[border-color,box-shadow] duration-200 ${
            an ? "border-primary shadow-[0_0_0_1px_hsl(var(--primary))]" : "border-border hover:border-foreground/30"
          }`}
        >
          <span className="min-w-0 flex-1">
            {w.logo ? (
              <img src={w.logo} alt={w.titel} className="h-[22px] w-auto max-w-[180px] object-contain object-left" />
            ) : (
              <span className="block text-[17px] font-semibold leading-tight text-foreground">{w.titel}</span>
            )}
            {w.unter && <span className="mt-0.5 block text-[15px] leading-snug text-foreground/60">{w.unter}</span>}
          </span>
          <span
            className={`flex h-6 w-6 shrink-0 items-center justify-center border transition-colors ${
              mehrere ? "rounded-md" : "rounded-full"
            } ${an ? "border-primary bg-primary text-white" : "border-foreground/25 bg-white"}`}
            aria-hidden
          >
            {an && <Check className="h-4 w-4" strokeWidth={3} />}
          </span>
        </button>
      );
    })}
  </div>
);

const Klappe = ({ offen, children }: { offen: boolean; children: React.ReactNode }) => (
  <div
    className="grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(.2,.8,.2,1)]"
    style={{ gridTemplateRows: offen ? "1fr" : "0fr", opacity: offen ? 1 : 0 }}
  >
    <div className="min-h-0 overflow-hidden">{children}</div>
  </div>
);

const MeinPortfolioPlan = () => {
  const { schluessel } = useParams();
  const [a, setA] = useState<Antworten>({});
  const [offen, setOffen] = useState<FrageId>("broker");
  const [werte, setWerte] = useState<Wert[]>([]);
  const [fertig, setFertig] = useState(false);
  const [rechnet, setRechnet] = useState(false);
  const [pdfLaeuft, setPdfLaeuft] = useState(false);
  const planRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const alt = lies();
    if (Object.keys(alt).length) {
      setA(alt);
      setWerte(alt.werte ?? []);
      const naechste = FRAGEN.find((f) => !beantwortet(alt, f.id));
      if (naechste) setOffen(naechste.id);
      else setFertig(true);
    }
  }, []);

  const anteile = useMemo(() => aufteilung(a), [a]);
  const prozentFertig = fortschritt(a);

  if (schluessel !== QUIZ_SCHLUESSEL) return <Navigate to="/halal-guide" replace />;

  const setze = (neu: Antworten, frage: FrageId) => {
    // Wer die Art wechselt, wählt den Betrag neu: monatlich und einmal haben andere Beträge.
    if (frage === "weise" && neu.weise !== a.weise) delete neu.betrag;
    setA(neu);
    schreibe(neu);
    ereignis("quiz_frage", { quiz: "portfolioplan", frage });
    const naechste = FRAGEN.find((f) => !beantwortet(neu, f.id));
    window.setTimeout(() => {
      if (naechste) setOffen(naechste.id);
      else zeigePlan();
    }, wenigBewegung() ? 0 : 260);
  };

  const zeigePlan = () => {
    setOffen("werte");
    setRechnet(true);
    ereignis("quiz_ergebnis", { quiz: "portfolioplan" });
    window.setTimeout(() => {
      setRechnet(false);
      setFertig(true);
      window.setTimeout(() => planRef.current?.scrollIntoView({ behavior: wenigBewegung() ? "auto" : "smooth", block: "start" }), 60);
    }, wenigBewegung() ? 0 : 900);
  };

  const ladePdf = async () => {
    setPdfLaeuft(true);
    try {
      const { planPdf } = await import("@/lib/planPdf");
      await planPdf(a);
      ereignis("quiz_neu", { quiz: "portfolioplan", pdf: true });
    } finally {
      setPdfLaeuft(false);
    }
  };

  const ring = (groesse: number, dicke: number, gross: boolean) => (
    <PlanRing anteile={anteile} anteilGezeigt={rechnet || fertig ? 1 : prozentFertig / 100} groesse={groesse} dicke={dicke}>
      {fertig && !gross ? (
        <Check className="h-5 w-5 text-foreground" strokeWidth={3} aria-label="fertig" />
      ) : (
        <span className={`font-extrabold tabular-nums text-foreground ${gross ? "text-[34px]" : "text-[15px]"}`}>
          {fertig ? "100" : prozentFertig}
          <span className={gross ? "text-[20px]" : "text-[11px]"}>&nbsp;%</span>
        </span>
      )}
      {gross && <span className="text-[14px] text-foreground/60">fertig</span>}
    </PlanRing>
  );

  const frageInhalt = (id: FrageId) => {
    switch (id) {
      case "broker":
        return <Auswahl wahl={BROKER} gewaehlt={(x) => a.broker === x} onWahl={(x) => setze({ ...a, broker: x }, id)} />;
      case "gekauft":
        return <Auswahl wahl={GEKAUFT} gewaehlt={(x) => a.gekauft === x} onWahl={(x) => setze({ ...a, gekauft: x }, id)} />;
      case "weise":
        return <Auswahl wahl={WEISE} gewaehlt={(x) => a.weise === x} onWahl={(x) => setze({ ...a, weise: x }, id)} />;
      case "betrag": {
        const liste = BETRAEGE[a.weise ?? "monatlich"];
        return (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {liste.map((b) => (
              <button
                key={b}
                type="button"
                aria-pressed={a.betrag === b}
                onClick={() => setze({ ...a, betrag: b }, id)}
                className={`min-h-[60px] rounded-xl border bg-white px-2 text-[18px] font-bold tabular-nums transition-[border-color,box-shadow] ${
                  a.betrag === b ? "border-primary text-primary shadow-[0_0_0_1px_hsl(var(--primary))]" : "border-border text-foreground"
                }`}
              >
                {euroText(b)}
                {a.weise !== "einmal" && <span className="block text-[13px] font-medium text-foreground/60">im Monat</span>}
              </button>
            ))}
          </div>
        );
      }
      case "lage":
        return <Auswahl wahl={LAGEN} gewaehlt={(x) => a.lage === x} onWahl={(x) => setze({ ...a, lage: x }, id)} />;
      case "werte":
        return (
          <>
            <p className="-mt-1 mb-3 text-[15px] text-foreground/60">Wähle, was du willst. Auch mehreres oder nichts.</p>
            <Auswahl
              mehrere
              wahl={WERTE}
              gewaehlt={(x) => werte.includes(x)}
              onWahl={(x) => setWerte((w) => (w.includes(x) ? w.filter((y) => y !== x) : [...w, x]))}
            />
            <button
              type="button"
              onClick={() => setze({ ...a, werte }, id)}
              className="mt-4 flex min-h-[56px] w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-[17px] font-bold text-white"
            >
              {rechnet ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : null}
              {rechnet ? "Dein Plan entsteht" : "Meinen Plan erstellen"}
            </button>
          </>
        );
    }
  };

  return (
    <main className="min-h-screen bg-white" data-freebie="mein-portfolioplan">
      <Seo
        title="Dein Halal-Portfolioplan | finanzmuslim"
        description="Beantworte sechs Fragen und sieh, wie dein Halal-Portfolio aussehen könnte: in Euro, mit Anlagen, die es bei deinem Depot gibt."
        path={QUIZ_PFAD}
        noindex
      />

      {/* Handy: der Ring oben, bleibt beim Scrollen direkt unter dem Seitenkopf (60 px, SiteHeader) stehen. */}
      <div className="sticky top-[60px] z-20 border-b border-border bg-white/95 backdrop-blur md:hidden">
        <div className="container flex max-w-xl items-center gap-3 py-2.5">
          {ring(46, 6, false)}
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-bold leading-tight text-foreground">Dein Portfolioplan</p>
            <p className="text-[14px] leading-tight text-foreground/60">
              {fertig ? "fertig" : `${FRAGEN.filter((f) => beantwortet(a, f.id)).length} von ${FRAGEN.length} Fragen`}
            </p>
          </div>
          <div className="flex -space-x-1" aria-hidden>
            {anteile.map((x) => (
              <span
                key={x.baustein}
                className="h-3 w-3 rounded-full ring-2 ring-white transition-opacity duration-500"
                style={{ background: bausteinById(x.baustein).farbe, opacity: prozentFertig >= 50 || fertig ? 1 : 0.25 }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="container max-w-5xl py-8 md:grid md:grid-cols-[300px_1fr] md:gap-14 md:py-14">
        {/* Laptop: links der Ring mit den Bausteinen, die schon feststehen. */}
        <aside className="hidden md:block">
          <div className="sticky top-24">
            {ring(220, 22, true)}
            <ul className="mt-8 space-y-2.5">
              {anteile.map((x) => (
                <li
                  key={x.baustein}
                  className="flex items-center gap-3 text-[16px] transition-opacity duration-500"
                  style={{ opacity: prozentFertig >= 50 || fertig ? 1 : 0.35 }}
                >
                  <span className="h-3 w-3 rounded-full" style={{ background: bausteinById(x.baustein).farbe }} />
                  <span className="flex-1 font-semibold text-foreground">{bausteinById(x.baustein).name}</span>
                  <span className="tabular-nums text-foreground/60">{x.prozent}&nbsp;%</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="max-w-xl">
          <h1 className="text-[30px] font-extrabold leading-[1.1] text-foreground md:text-[40px]">
            Dein Halal-Portfolioplan
          </h1>
          <p className="mt-3 text-[17px] leading-snug text-foreground/70">
            Sechs Fragen, dann siehst du, was du mit deinem Geld machst. In Euro, bei deinem Depot.
          </p>

          <ol className="mt-8 border-t border-border">
            {FRAGEN.map((f, i) => {
              const istOffen = offen === f.id && !fertig;
              const fertigHier = beantwortet(a, f.id);
              const erreichbar = fertigHier || FRAGEN.slice(0, i).every((v) => beantwortet(a, v.id));
              return (
                <li key={f.id} className="border-b border-border">
                  <button
                    type="button"
                    disabled={!erreichbar}
                    onClick={() => {
                      setFertig(false);
                      setOffen(f.id);
                    }}
                    aria-expanded={istOffen}
                    className="flex w-full items-center gap-3 py-4 text-left disabled:cursor-default"
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[14px] font-bold transition-colors ${
                        fertigHier && !istOffen
                          ? "bg-primary text-white"
                          : istOffen
                            ? "bg-foreground text-white"
                            : "bg-muted text-foreground/40"
                      }`}
                    >
                      {fertigHier && !istOffen ? <Check className="h-4 w-4" strokeWidth={3} /> : i + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={`block font-bold leading-tight transition-all ${
                          istOffen ? "text-[22px] text-foreground" : erreichbar ? "text-[17px] text-foreground" : "text-[17px] text-foreground/35"
                        }`}
                      >
                        {f.titel}
                      </span>
                      {fertigHier && !istOffen && (
                        <span className="mt-0.5 block truncate text-[15px] text-primary">{antwortText(a, f.id)}</span>
                      )}
                    </span>
                    {fertigHier && !istOffen && <span className="text-[14px] font-semibold text-foreground/50">Ändern</span>}
                  </button>
                  <Klappe offen={istOffen}>
                    <div className="pb-6 pl-10">{frageInhalt(f.id)}</div>
                  </Klappe>
                </li>
              );
            })}
          </ol>

          {fertig && <Ergebnis a={a} anteile={anteile} planRef={planRef} pdfLaeuft={pdfLaeuft} ladePdf={ladePdf} />}
        </div>
      </div>
    </main>
  );
};

const Ergebnis = ({
  a,
  anteile,
  planRef,
  pdfLaeuft,
  ladePdf,
}: {
  a: Antworten;
  anteile: Anteil[];
  planRef: React.RefObject<HTMLElement>;
  pdfLaeuft: boolean;
  ladePdf: () => void;
}) => {
  const betrag = a.betrag ?? 50;
  const euro = inEuro(anteile, betrag);
  const broker = BROKER.find((b) => b.id === a.broker);
  const brokerName = a.broker === "anderer" ? "deinem Depot" : broker?.titel;
  const monatlich = a.weise !== "einmal";
  const anlagen = anteile
    .map((x, i) => ({ x, euro: euro[i], produkt: produktFuer(x.baustein, a.broker) }))
    .filter((z) => z.x.baustein !== "konto");
  const konto = anteile.find((x) => x.baustein === "konto");

  return (
    <section ref={planRef} className="scroll-mt-[136px] pt-12 md:scroll-mt-24 animate-in fade-in slide-in-from-bottom-4 duration-700" aria-labelledby="dein-plan">
      <p className="text-[15px] font-bold text-violet">Dein Plan</p>
      <h2 id="dein-plan" className="mt-1 text-[28px] font-extrabold leading-tight text-foreground">
        {euroText(betrag)}
        {monatlich ? " im Monat" : " einmal"}, so könnte es aussehen
      </h2>

      <div className="mt-6 rounded-2xl border border-border p-5 md:p-6">
        <div className="flex justify-center">
          <PlanRing anteile={anteile} anteilGezeigt={1} groesse={200} dicke={24}>
            <span className="text-[30px] font-extrabold tabular-nums text-foreground">{euroText(betrag)}</span>
            <span className="text-[14px] text-foreground/60">{monatlich ? "im Monat" : "einmal"}</span>
          </PlanRing>
        </div>

        <ul className="mt-6 divide-y divide-border">
          {anteile.map((x, i) => {
            const b = bausteinById(x.baustein);
            const p = produktFuer(x.baustein, a.broker);
            const schonDa = x.baustein === "etf" && a.gekauft === "etf";
            return (
              <li key={x.baustein} className="py-4">
                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: b.farbe }} aria-hidden />
                  <span className="flex-1 text-[17px] font-bold text-foreground">{b.name}</span>
                  <span className="text-[14px] tabular-nums text-foreground/50">{x.prozent}&nbsp;%</span>
                  <span className="w-[76px] text-right text-[19px] font-extrabold tabular-nums text-foreground">{euroText(euro[i])}</span>
                </div>
                {p ? (
                  <Link
                    to={`/halal-anlagen/${p.anlage.slug}`}
                    className="mt-2.5 flex items-center gap-3 rounded-xl bg-accent/60 px-3 py-2.5"
                  >
                    <AnlageLogo a={p.anlage} />
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15px] font-semibold leading-tight text-foreground">{p.anlage.name}</span>
                      <span className="mt-0.5 block text-[14px] tabular-nums text-foreground/70">
                        {p.r1 !== undefined && (
                          <>
                            1 Jahr <b className={p.r1 >= 0 ? "text-gain" : "text-loss"}>{prozentText(p.r1)}</b>
                          </>
                        )}
                        {p.r5 !== undefined && (
                          <>
                            {"  ·  "}5 Jahre <b className={p.r5 >= 0 ? "text-gain" : "text-loss"}>{prozentText(p.r5)}</b>
                          </>
                        )}
                      </span>
                    </span>
                    {schonDa && (
                      <span className="rounded-full bg-gain-soft px-2 py-0.5 text-[13px] font-bold text-gain">hast du</span>
                    )}
                  </Link>
                ) : (
                  BEISPIEL[x.baustein as BausteinId] && (
                    <p className="mt-1.5 pl-6 text-[15px] text-foreground/60">{BEISPIEL[x.baustein as BausteinId]}</p>
                  )
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-8">
        <h3 className="text-[20px] font-extrabold text-foreground">So machst du es</h3>
        <ol className="mt-3 space-y-3 text-[16px] leading-snug text-foreground">
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-foreground text-[13px] font-bold text-white">1</span>
            <span>Öffne die App von {brokerName} und such die Anlage beim Namen.</span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-foreground text-[13px] font-bold text-white">2</span>
            <span>
              {monatlich ? "Kauf jeden Monat: " : "Kauf einmal: "}
              {anlagen
                .filter((z) => z.produkt)
                .map((z) => `${euroText(z.euro)} ${z.produkt!.anlage.name}`)
                .join(", ")}
              .{monatlich && " Gibt es dafür einen Sparplan, läuft es von selbst."}
            </span>
          </li>
          {konto && (
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-foreground text-[13px] font-bold text-white">3</span>
              <span>
                {euroText(euro[anteile.indexOf(konto)])} bleiben auf deinem Girokonto. Achte darauf, dass es dir keine Zinsen zahlt.
              </span>
            </li>
          )}
        </ol>
        {a.broker === "anderer" && (
          <p className="mt-4 text-[15px] leading-snug text-foreground/70">
            Nicht jedes Depot hat alle Halal-Anlagen. Findest du eine nicht, schau in den{" "}
            <Link to="/vergleich/depot" className="font-semibold text-primary underline-offset-4 hover:underline">
              Depot-Vergleich
            </Link>
            .
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={ladePdf}
        disabled={pdfLaeuft}
        className="mt-8 flex min-h-[60px] w-full items-center justify-center gap-2.5 rounded-xl bg-primary px-5 text-[18px] font-bold text-white disabled:opacity-70"
      >
        {pdfLaeuft ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : <Download className="h-5 w-5" aria-hidden />}
        Meinen Plan als PDF laden
      </button>
      <p className="mt-2 text-center text-[15px] text-foreground/60">Mit deinem festen Ablauf, Steuer und Zakat dahinter.</p>

      {/* Erst der Mehrwert, dann das Girokonto (Elias, CV23S: „wenn die so einen Mehrwert bekommen haben, dann … ganz
          krass das Girokonto … Cross-Selling“, Vault raw/2026-11-08-elias-cv23s-blueprint-cross-selling-girokonto.md). */}
      <div className="mt-14">
        <p className="text-[15px] font-bold text-violet">Fehlt noch</p>
        <h3 className="mt-1 text-[24px] font-extrabold leading-tight text-foreground">Dein Girokonto ohne Zinsen</h3>
        <div className="mt-4">
          <GiroAufruf
            gross={SCHMERZ.girokonto}
            zwischen={SCHMERZ.muslim}
            link={(ziel, stelle) => `${ziel}?src=pp${stelle}`}
          />
        </div>
      </div>

      <footer className="mt-12 border-t border-border pt-5 text-[13px] leading-relaxed text-foreground/60">
        <p>Ein Beispiel aus deinen Antworten, keine Anlageberatung. Wie es früher lief, ist keine Garantie für später.</p>
        <p className="mt-1">Renditen in Euro, Stand {(kurse as { stand: string }).stand}. Alle Anlagen aus meiner Halal-Datenbank.</p>
        <button
          type="button"
          onClick={() => {
            try {
              window.localStorage.removeItem(SPEICHER);
            } catch {
              /* egal */
            }
            window.location.reload();
          }}
          className="mt-3 inline-flex items-center gap-1 font-semibold text-foreground/70"
        >
          <ChevronDown className="h-4 w-4 rotate-180" aria-hidden /> Neu beginnen
        </button>
      </footer>
    </section>
  );
};

export default MeinPortfolioPlan;
