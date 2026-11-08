import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowRight, Check, ChevronDown, ChevronLeft, Download, Minus, Plus } from "lucide-react";
import Seo from "@/components/Seo";
import GiroAufruf from "@/components/vorlagen/GiroAufruf";
import { AnlageLogo } from "@/components/AnlageZeile";
import { Wordmark } from "@/components/Wordmark";
import { BASICS } from "@/data/portfolioBasics";
import {
  ALLE_BAUSTEINE,
  anlegertyp,
  datenbankFakten,
  gewichtWort,
  heute,
  kannMehr,
  kannWeniger,
  planTitel,
  richtungAendern,
  risiko,
  risikoWort,
  sauberName,
  stileFuer,
} from "@/data/portfolioDashboard";
import { bausteinById, SCHMERZ, type BausteinId } from "@/data/portfolioPlan";
import {
  antwortText,
  aufteilung,
  beantwortet,
  BEISPIEL,
  BETRAEGE,
  BROKER,
  euroText,
  FRAGEN,
  GEKAUFT,
  inEuro,
  LAGEN,
  prozentText,
  QUIZ_PFAD,
  QUIZ_SCHLUESSEL,
  WEISE,
  WERTE,
  type Anteil,
  type Antworten,
  type FrageId,
  type Produkt,
  type Wahl,
  type Wert,
} from "@/data/portfolioQuiz";
import { ereignis } from "@/lib/messung";
import kurse from "@/data/kurse.json";
import "@/styles/portfolioplan.css";

/**
 * /dein-portfolioplan/<schluessel>: das Ultra-Freebie „Dein Halal-Investmentplan“, die Belohnung auf FERTIG
 * (CV26P, 08.11.2026; Umbau CV27P, 09.11.2026).
 *
 * Elias, 09.11.2026 (Vault raw/2026-11-09-elias-cv26p-ultra-freebie-dashboard-onboarding-luxus.md): „ein Onboarding
 * … das sich so richtig edel anfühlt. So eher weiß, schwarz, sehr so beruhigende Töne, bisschen Blauakzente vielleicht,
 * oben Finanzmuslim und dann gibst du diese Fragen ein und dann öffnet sich dieses Dashboard so von links nach rechts
 * mit diesen ganzen Grafiken“. Und (raw/2026-11-09-elias-cv27p-dashboard-plan-nacht-onboarding-fakten-pdf-jarvis.md):
 * „Hallo @finanzmuslim … dieses Dashboard sich einfach so so langsam einblenden … dann kommen so die Graphen hoch“.
 *
 * Drei Zustände auf einer Seite, ohne Anmeldung und ohne Live-Daten: 1 Onboarding, eine Frage je Schirm, Begrüßung
 * mit dem Vornamen aus der FERTIG-Mail (?n=…). 2 „Dein Plan entsteht“, vier Zeilen mit Haken. 3 Das Dashboard, das
 * sich von links nach rechts aufbaut, dann die PDF als Ausdruck davon, danach das Girokonto. Nach außen keine
 * Prozentzahlen (Anlageberatung), nur Richtung und Euro-Beispiele.
 */

const SPEICHER = "fm-portfolioplan-antworten";
const SPEICHER_RICHTUNG = "fm-portfolioplan-richtung";
const SPEICHER_NAME = "fm-portfolioplan-name";

const lies = <T,>(schluessel: string): T | undefined => {
  try {
    const roh = window.localStorage.getItem(schluessel);
    return roh ? (JSON.parse(roh) as T) : undefined;
  } catch {
    return undefined;
  }
};

const schreibe = (schluessel: string, wert: unknown) => {
  try {
    if (wert === undefined || wert === null) window.localStorage.removeItem(schluessel);
    else window.localStorage.setItem(schluessel, JSON.stringify(wert));
  } catch {
    /* privates Fenster: geht auch ohne */
  }
};

const wenigBewegung = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

type Phase = "start" | "fragen" | "rechnet" | "dashboard";

// --- Bausteine der Gestaltung ---------------------------------------------------------------------------------------

/** Ring aus den Bausteinen des Plans, ohne Zahlen am Rand; zeichnet sich bis `gezeigt` (0 bis 1). */
export const PlanRing = ({
  anteile,
  gezeigt,
  groesse,
  dicke,
  children,
}: {
  anteile: Anteil[];
  gezeigt: number;
  groesse: number;
  dicke: number;
  children?: React.ReactNode;
}) => {
  const r = (groesse - dicke) / 2;
  const umfang = 2 * Math.PI * r;
  const summe = anteile.reduce((s, x) => s + x.prozent, 0) || 1;
  const luecke = anteile.length > 1 ? Math.min(5, umfang * 0.012) : 0;
  let start = 0;
  return (
    <div className="relative shrink-0" style={{ width: groesse, height: groesse }}>
      <svg width={groesse} height={groesse} viewBox={`0 0 ${groesse} ${groesse}`} className="-rotate-90" aria-hidden>
        <circle cx={groesse / 2} cy={groesse / 2} r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth={dicke} />
        {anteile.map((x) => {
          const voll = (x.prozent / summe) * umfang;
          const sichtbar = Math.max(0, Math.min(voll, gezeigt * umfang - start) - luecke);
          const el = (
            <circle
              key={x.baustein}
              className="pp-seg"
              cx={groesse / 2}
              cy={groesse / 2}
              r={r}
              fill="none"
              stroke={bausteinById(x.baustein).farbe}
              strokeWidth={dicke}
              strokeLinecap="butt"
              strokeDasharray={`${sichtbar} ${umfang}`}
              strokeDashoffset={-start}
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

/** Halber Tacho für die Risikobereitschaft: Grau als Bahn, Blau bis zum Wert. */
const Tacho = ({ wert, gezeigt }: { wert: number; gezeigt: boolean }) => {
  const r = 86;
  const laenge = Math.PI * r;
  const voll = gezeigt ? (laenge * wert) / 100 : 0;
  return (
    <svg viewBox="0 0 200 108" className="w-full max-w-[260px]" aria-hidden>
      <path d={`M14 100 A${r} ${r} 0 0 1 186 100`} fill="none" stroke="hsl(var(--muted))" strokeWidth={14} strokeLinecap="round" />
      <path
        className="pp-tacho"
        d={`M14 100 A${r} ${r} 0 0 1 186 100`}
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth={14}
        strokeLinecap="round"
        strokeDasharray={`${voll} ${laenge + 10}`}
      />
    </svg>
  );
};

const Karte = ({
  nr,
  label,
  className = "",
  children,
}: {
  nr: number;
  label?: string;
  className?: string;
  children: React.ReactNode;
}) => (
  <section className={`pp-karte pp-slide p-5 md:p-6 ${className}`} style={{ animationDelay: `${nr * 120}ms` }}>
    {label && <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-foreground/50">{label}</p>}
    {children}
  </section>
);

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
  <div className="grid gap-2.5" role={mehrere ? "group" : "radiogroup"}>
    {wahl.map((w) => {
      const an = gewaehlt(w.id);
      return (
        <button
          key={String(w.id)}
          type="button"
          role={mehrere ? "checkbox" : "radio"}
          aria-checked={an}
          onClick={() => onWahl(w.id)}
          className={`flex min-h-[64px] w-full items-center gap-3 rounded-2xl border bg-white px-4 py-3 text-left transition-[border-color,box-shadow,transform] duration-200 active:scale-[0.99] ${
            an ? "border-foreground shadow-[0_0_0_1px_hsl(var(--foreground))]" : "border-border hover:border-foreground/40"
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
            } ${an ? "border-foreground bg-foreground text-white" : "border-foreground/25 bg-white"}`}
            aria-hidden
          >
            {an && <Check className="h-4 w-4" strokeWidth={3} />}
          </span>
        </button>
      );
    })}
  </div>
);

const Knopf = ({
  children,
  onClick,
  disabled,
  leise,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  leise?: boolean;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`flex min-h-[58px] w-full items-center justify-center gap-2 rounded-2xl px-6 text-[17px] font-bold transition-[transform,opacity] active:scale-[0.99] disabled:opacity-50 ${
      leise ? "border border-border bg-white text-foreground" : "bg-foreground text-white"
    }`}
  >
    {children}
  </button>
);

// --- Die Seite ----------------------------------------------------------------------------------------------------------

const MeinPortfolioPlan = () => {
  const { schluessel } = useParams();
  const [params] = useSearchParams();
  const [phase, setPhase] = useState<Phase>("start");
  const [a, setA] = useState<Antworten>({});
  const [schritt, setSchritt] = useState(0);
  const [werte, setWerte] = useState<Wert[]>([]);
  const [name, setName] = useState<string | undefined>();
  const [eigene, setEigene] = useState<Anteil[] | undefined>();
  const [zeilen, setZeilen] = useState(0);
  const [bereit, setBereit] = useState(false);
  const [pdfLaeuft, setPdfLaeuft] = useState(false);
  const [pdfZeile, setPdfZeile] = useState(0);

  useEffect(() => {
    const ausUrl = sauberName(params.get("n"));
    const gespeichert = lies<string>(SPEICHER_NAME);
    const n = ausUrl ?? gespeichert;
    if (ausUrl) schreibe(SPEICHER_NAME, ausUrl);
    setName(n);
    const alt = lies<Antworten>(SPEICHER) ?? {};
    const richtung = lies<Anteil[]>(SPEICHER_RICHTUNG);
    if (richtung?.length) setEigene(richtung);
    if (Object.keys(alt).length) {
      setA(alt);
      setWerte(alt.werte ?? []);
      const naechste = FRAGEN.findIndex((f) => !beantwortet(alt, f.id));
      if (naechste < 0) setPhase("dashboard");
      else setSchritt(naechste);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Das Dashboard zeichnet Ring und Tacho erst, wenn es steht: so sieht man, wie es sich aufbaut.
  useEffect(() => {
    if (phase !== "dashboard") return setBereit(false);
    const t = window.setTimeout(() => setBereit(true), wenigBewegung() ? 0 : 250);
    return () => window.clearTimeout(t);
  }, [phase]);

  const anteile = useMemo(() => eigene ?? aufteilung(a), [a, eigene]);
  const typ = useMemo(() => anlegertyp(anteile), [anteile]);
  const risk = useMemo(() => risiko(anteile), [anteile]);

  if (schluessel !== QUIZ_SCHLUESSEL) return <Navigate to="/halal-guide" replace />;

  const frage = FRAGEN[schritt];

  const setze = (neu: Antworten, id: FrageId) => {
    if (id === "weise" && neu.weise !== a.weise) delete neu.betrag;
    setA(neu);
    schreibe(SPEICHER, neu);
    // Eine neue Antwort setzt eine eigene Richtung zurück: sonst passt der Plan nicht mehr zu den Antworten.
    setEigene(undefined);
    schreibe(SPEICHER_RICHTUNG, undefined);
    ereignis("quiz_frage", { quiz: "portfolioplan", frage: id });
    const naechste = FRAGEN.findIndex((f) => !beantwortet(neu, f.id));
    window.setTimeout(() => {
      if (naechste >= 0) setSchritt(naechste);
      else rechne();
    }, wenigBewegung() ? 0 : 240);
  };

  const rechne = () => {
    setPhase("rechnet");
    setZeilen(0);
    ereignis("quiz_ergebnis", { quiz: "portfolioplan" });
    const takt = wenigBewegung() ? 0 : 520;
    [1, 2, 3, 4].forEach((n) => window.setTimeout(() => setZeilen(n), takt * n));
    window.setTimeout(() => {
      setPhase("dashboard");
      window.scrollTo({ top: 0, behavior: "auto" });
    }, takt * 5 + 200);
  };

  const aendere = (b: BausteinId, mehr: boolean) => {
    const neu = richtungAendern(anteile, b, mehr);
    if (neu === anteile) return;
    setEigene(neu);
    schreibe(SPEICHER_RICHTUNG, neu);
  };

  const zuruecksetzen = () => {
    setEigene(undefined);
    schreibe(SPEICHER_RICHTUNG, undefined);
  };

  const ladePdf = async () => {
    setPdfLaeuft(true);
    setPdfZeile(0);
    const takt = wenigBewegung() ? 0 : 650;
    [1, 2, 3].forEach((n) => window.setTimeout(() => setPdfZeile(n), takt * n));
    try {
      const [{ planPdf }] = await Promise.all([
        import("@/lib/planPdf"),
        new Promise((r) => window.setTimeout(r, takt * 3 + 400)),
      ]);
      await planPdf(a, { anteile, name });
      ereignis("quiz_neu", { quiz: "portfolioplan", pdf: true });
    } finally {
      setPdfLaeuft(false);
    }
  };

  const neuBeginnen = () => {
    schreibe(SPEICHER, undefined);
    schreibe(SPEICHER_RICHTUNG, undefined);
    setA({});
    setWerte([]);
    setEigene(undefined);
    setSchritt(0);
    setPhase("start");
    window.scrollTo({ top: 0, behavior: "auto" });
  };

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
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {liste.map((b) => (
              <button
                key={b}
                type="button"
                aria-pressed={a.betrag === b}
                onClick={() => setze({ ...a, betrag: b }, id)}
                className={`min-h-[64px] rounded-2xl border bg-white px-2 text-[19px] font-bold tabular-nums transition-[border-color,box-shadow] ${
                  a.betrag === b ? "border-foreground shadow-[0_0_0_1px_hsl(var(--foreground))]" : "border-border text-foreground hover:border-foreground/40"
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
            <Auswahl
              mehrere
              wahl={WERTE}
              gewaehlt={(x) => werte.includes(x)}
              onWahl={(x) => setWerte((w) => (w.includes(x) ? w.filter((y) => y !== x) : [...w, x]))}
            />
            <div className="mt-5">
              <Knopf onClick={() => setze({ ...a, werte }, id)}>
                Meinen Plan erstellen <ArrowRight className="h-5 w-5" aria-hidden />
              </Knopf>
              <p className="mt-2 text-center text-[14px] text-foreground/55">Auch mehreres oder nichts ist eine Antwort.</p>
            </div>
          </>
        );
    }
  };

  const kopf = (
    <header className="container flex h-16 max-w-5xl items-center justify-between">
      <Link to="/" aria-label="finanzmuslim Startseite">
        <Wordmark className="text-[20px]" />
      </Link>
      {phase === "fragen" && (
        <span className="text-[14px] tabular-nums text-foreground/55">
          {schritt + 1} von {FRAGEN.length}
        </span>
      )}
      {phase === "dashboard" && <span className="text-[14px] text-foreground/55">{heute()}</span>}
    </header>
  );

  return (
    <div className="min-h-[calc(100svh-80px)] bg-white" data-freebie="mein-portfolioplan">
      <Seo
        title="Dein Halal-Investmentplan | finanzmuslim"
        description="Sechs Fragen, dann steht dein Halal-Investmentplan: Anlegertyp, Richtung, Anlagen bei deinem Depot, als Dashboard und PDF."
        path={QUIZ_PFAD}
        noindex
      />
      {kopf}

      {/* Dünne Linie mit sechs Stücken, füllt sich blau. */}
      {phase === "fragen" && (
        <div className="container max-w-5xl">
          <div className="flex gap-1.5" aria-hidden>
            {FRAGEN.map((f, i) => (
              <span
                key={f.id}
                className={`h-[3px] flex-1 rounded-full transition-colors duration-500 ${i <= schritt ? "bg-primary" : "bg-muted"}`}
              />
            ))}
          </div>
        </div>
      )}

      {phase === "start" && (
        <section className="container flex min-h-[calc(100svh-160px)] max-w-xl flex-col justify-center py-10">
          <h1 className="pp-rise font-titel text-[44px] leading-[1.05] text-foreground md:text-[60px]">
            {name ? `Hallo ${name}.` : "Hallo."}
          </h1>
          <p className="pp-rise mt-5 text-[19px] leading-snug text-foreground/75 md:text-[22px]" style={{ animationDelay: "120ms" }}>
            Sechs Fragen. Dann steht dein Halal-Investmentplan: dein Anlegertyp, deine Richtung und die Anlagen, die es
            bei deinem Depot gibt.
          </p>
          <div className="pp-rise mt-9" style={{ animationDelay: "240ms" }}>
            <Knopf onClick={() => setPhase("fragen")}>
              {Object.keys(a).length ? "Weitermachen" : "Los geht's"} <ArrowRight className="h-5 w-5" aria-hidden />
            </Knopf>
            <p className="mt-3 text-center text-[14px] text-foreground/55">Zwei Minuten. Keine Anmeldung.</p>
          </div>
        </section>
      )}

      {phase === "fragen" && frage && (
        <section key={frage.id} className="pp-frage container max-w-xl py-8 md:py-14">
          {schritt > 0 ? (
            <button
              type="button"
              onClick={() => setSchritt(schritt - 1)}
              className="-ml-2 inline-flex min-h-[44px] items-center gap-1 pr-3 text-[15px] font-semibold text-foreground/60"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden /> Zurück
            </button>
          ) : (
            <div className="h-[44px]" />
          )}
          <h1 className="font-titel mt-2 text-[34px] leading-[1.1] text-foreground md:text-[44px]">{frage.titel}</h1>
          {frage.id === "werte" && (
            <p className="mt-2 text-[16px] text-foreground/60">Wähle, was zu dir passt.</p>
          )}
          <div className="mt-7">{frageInhalt(frage.id)}</div>
          {beantwortet(a, frage.id) && frage.id !== "werte" && (
            <p className="mt-4 text-[14px] text-foreground/50">Bisher: {antwortText(a, frage.id)}</p>
          )}
        </section>
      )}

      {phase === "rechnet" && (
        <section className="container flex min-h-[calc(100svh-160px)] max-w-xl flex-col justify-center py-10" aria-live="polite">
          <h1 className="font-titel text-[36px] leading-[1.1] text-foreground md:text-[48px]">Dein Plan entsteht.</h1>
          <ul className="mt-8 space-y-4">
            {[
              "Deine Antworten gelesen",
              `${datenbankFakten().gesamt} Halal-Anlagen durchsucht`,
              `Geprüft, was es bei ${a.broker === "anderer" || !a.broker ? "deinem Depot" : BROKER.find((b) => b.id === a.broker)?.titel} gibt`,
              "Dein Dashboard gebaut",
            ].map((t, i) => (
              <li key={t} className={`flex items-center gap-3 text-[18px] ${zeilen > i ? "pp-zeile text-foreground" : "invisible"}`}>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-foreground text-white">
                  <Check className="h-4 w-4" strokeWidth={3} aria-hidden />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </section>
      )}

      {phase === "dashboard" && (
        <Dashboard
          a={a}
          anteile={anteile}
          eigene={Boolean(eigene)}
          typName={typ.name}
          typSeele={typ.seele}
          typTut={typ.tut}
          risk={risk}
          bereit={bereit}
          name={name}
          onAendern={aendere}
          onZuruecksetzen={zuruecksetzen}
          onPdf={ladePdf}
          pdfLaeuft={pdfLaeuft}
          onNeu={neuBeginnen}
          onAntwortAendern={(id) => {
            setSchritt(FRAGEN.findIndex((f) => f.id === id));
            setPhase("fragen");
            window.scrollTo({ top: 0, behavior: "auto" });
          }}
        />
      )}

      {pdfLaeuft && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 px-6 backdrop-blur-sm" role="status" aria-live="polite">
          <div className="w-full max-w-md">
            <p className="font-titel text-[30px] leading-tight text-foreground md:text-[38px]">Dein Portfolioplan wird gerade festgehalten.</p>
            <div className="mt-6 h-[3px] w-full overflow-hidden rounded-full bg-muted">
              <div className="pp-balken h-full bg-primary" style={{ width: `${Math.min(100, pdfZeile * 33.4)}%` }} />
            </div>
            <ul className="mt-5 space-y-2.5">
              {["Dashboard gezeichnet", "Deine Anlagen eingetragen", "Die Basics angehängt"].map((t, i) => (
                <li key={t} className={`flex items-center gap-2.5 text-[16px] ${pdfZeile > i ? "pp-zeile text-foreground" : "text-foreground/30"}`}>
                  <Check className={`h-4 w-4 ${pdfZeile > i ? "text-primary" : "text-transparent"}`} strokeWidth={3} aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Das Dashboard ------------------------------------------------------------------------------------------------------

type DashboardProps = {
  a: Antworten;
  anteile: Anteil[];
  eigene: boolean;
  typName: string;
  typSeele: string;
  typTut: string;
  risk: number;
  bereit: boolean;
  name?: string;
  onAendern: (b: BausteinId, mehr: boolean) => void;
  onZuruecksetzen: () => void;
  onPdf: () => void;
  pdfLaeuft: boolean;
  onNeu: () => void;
  onAntwortAendern: (id: FrageId) => void;
};

const Rendite = ({ p }: { p: Produkt }) =>
  p.r1 === undefined && p.r5 === undefined ? null : (
    <span className="block text-[14px] tabular-nums text-foreground/70">
      {p.r1 !== undefined && (
        <>
          1 Jahr <b className={p.r1 >= 0 ? "text-gain" : "text-loss"}>{prozentText(p.r1)}</b>
        </>
      )}
      {p.r1 !== undefined && p.r5 !== undefined && "  ·  "}
      {p.r5 !== undefined && (
        <>
          5 Jahre <b className={p.r5 >= 0 ? "text-gain" : "text-loss"}>{prozentText(p.r5)}</b>
        </>
      )}
    </span>
  );

const Dashboard = ({
  a,
  anteile,
  eigene,
  typName,
  typSeele,
  typTut,
  risk,
  bereit,
  name,
  onAendern,
  onZuruecksetzen,
  onPdf,
  pdfLaeuft,
  onNeu,
  onAntwortAendern,
}: DashboardProps) => {
  const betrag = a.betrag ?? 50;
  const monatlich = a.weise !== "einmal";
  const euro = inEuro(anteile, betrag);
  const broker = BROKER.find((b) => b.id === a.broker);
  const brokerName = !a.broker || a.broker === "anderer" ? "deinem Depot" : broker!.titel;
  const fakten = datenbankFakten(a.broker);
  const [stil, setStil] = useState<Partial<Record<BausteinId, string>>>({});
  const [offen, setOffen] = useState<string | undefined>();
  const [richtungOffen, setRichtungOffen] = useState(false);

  const anlagen = anteile
    .filter((x) => x.baustein !== "konto")
    .map((x) => {
      const stile = stileFuer(x.baustein, a.broker);
      const gewaehlt = stile.find((s) => s.stil.id === stil[x.baustein]) ?? stile[0];
      return { x, stile, gewaehlt };
    });
  const konto = anteile.find((x) => x.baustein === "konto");
  const kauf = anlagen.filter((z) => z.gewaehlt).map((z) => `${euroText(euro[anteile.indexOf(z.x)])} ${z.gewaehlt!.produkt.anlage.name}`);

  let nr = 0;

  return (
    <div className="container max-w-5xl pb-16 pt-4 md:pt-8">
      <div className="pp-rise">
        <h1 className="font-titel text-[36px] leading-[1.05] text-foreground md:text-[52px]">{planTitel(name)}</h1>
        <p className="mt-3 flex flex-wrap gap-x-2 text-[16px] text-foreground/65">
          <span>{brokerName === "deinem Depot" ? "Dein Depot" : brokerName}</span>
          <span aria-hidden>·</span>
          <span>
            {euroText(betrag)} {monatlich ? "im Monat" : "einmal"}
          </span>
          <span aria-hidden>·</span>
          <span>Geld gebraucht {LAGEN.find((l) => l.id === a.lage)?.titel.replace(/^In /, "in ") ?? ""}</span>
          <button type="button" onClick={() => onAntwortAendern("broker")} className="ml-1 font-semibold text-primary">
            Antworten ändern
          </button>
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-12">
        {/* Anlegertyp */}
        <Karte nr={nr++} label="Dein Anlegertyp" className="md:col-span-7">
          <p className="font-titel mt-2 text-[40px] leading-none text-foreground md:text-[48px]">{typName}</p>
          <p className="mt-4 text-[18px] leading-snug text-foreground">{typSeele}</p>
          <p className="mt-2 text-[16px] leading-snug text-foreground/65">{typTut}</p>
          {a.werte && a.werte.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-2">
              {WERTE.filter((w) => a.werte!.includes(w.id)).map((w) => (
                <li key={w.id} className="rounded-full border border-border px-3 py-1 text-[14px] font-semibold text-foreground">
                  {w.titel}
                </li>
              ))}
            </ul>
          )}
        </Karte>

        {/* Risikobereitschaft */}
        <Karte nr={nr++} label="Risikobereitschaft" className="md:col-span-5">
          <div className="relative mt-3 flex flex-col items-center">
            <Tacho wert={risk} gezeigt={bereit} />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center">
              <span className="text-[40px] font-extrabold leading-none tabular-nums text-foreground">
                {bereit ? risk : 0}
                <span className="text-[22px]">&nbsp;%</span>
              </span>
              <span className="mt-1 text-[15px] font-semibold capitalize text-foreground/65">{risikoWort(risk)}</span>
            </div>
          </div>
          <p className="mt-4 text-[15px] leading-snug text-foreground/65">
            Aus deiner Zeit und deiner Richtung. Je mehr Aktien und Krypto, desto höher. Je mehr Sukuk und Konto, desto ruhiger.
          </p>
        </Karte>

        {/* Richtung */}
        <Karte nr={nr++} label="Deine Richtung" className="md:col-span-6">
          <div className="mt-3 flex items-center gap-5">
            <PlanRing anteile={anteile} gezeigt={bereit ? 1 : 0} groesse={150} dicke={20}>
              <span className="text-[24px] font-extrabold leading-none tabular-nums text-foreground">{euroText(betrag)}</span>
              <span className="mt-1 text-[13px] text-foreground/60">{monatlich ? "im Monat" : "einmal"}</span>
            </PlanRing>
            <ul className="min-w-0 flex-1 space-y-2.5">
              {anteile.map((x, i) => {
                const b = bausteinById(x.baustein);
                return (
                  <li key={x.baustein} className="flex items-center gap-2.5">
                    <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: b.farbe }} aria-hidden />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[15px] font-bold leading-tight text-foreground">{b.name}</span>
                      <span className="block text-[13px] leading-tight text-foreground/60">{gewichtWort(x.baustein, x.prozent)}</span>
                    </span>
                    <span className="text-[14px] tabular-nums text-foreground/70">z.&nbsp;B. {euroText(euro[i])}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          <button
            type="button"
            onClick={() => setRichtungOffen((o) => !o)}
            aria-expanded={richtungOffen}
            className="mt-5 flex min-h-[44px] w-full items-center justify-between rounded-xl border border-border px-4 text-[15px] font-semibold text-foreground"
          >
            Richtung ändern
            <ChevronDown className={`h-4 w-4 transition-transform ${richtungOffen ? "rotate-180" : ""}`} aria-hidden />
          </button>
          {richtungOffen && (
            <div className="mt-3">
              <ul className="divide-y divide-border">
                {ALLE_BAUSTEINE.map((bId) => {
                  const b = bausteinById(bId);
                  const p = anteile.find((x) => x.baustein === bId)?.prozent ?? 0;
                  return (
                    <li key={bId} className="flex items-center gap-3 py-2.5">
                      <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: b.farbe, opacity: p ? 1 : 0.35 }} aria-hidden />
                      <span className="min-w-0 flex-1">
                        <span className={`block text-[15px] font-semibold ${p ? "text-foreground" : "text-foreground/45"}`}>{b.name}</span>
                        <span className="block text-[13px] text-foreground/55">{p ? gewichtWort(bId, p) : "nicht dabei"}</span>
                      </span>
                      <button
                        type="button"
                        aria-label={`Weniger ${b.name}`}
                        disabled={!kannWeniger(anteile, bId)}
                        onClick={() => onAendern(bId, false)}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground disabled:opacity-25"
                      >
                        <Minus className="h-4 w-4" aria-hidden />
                      </button>
                      <button
                        type="button"
                        aria-label={`Mehr ${b.name}`}
                        disabled={!kannMehr(anteile, bId)}
                        onClick={() => onAendern(bId, true)}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground disabled:opacity-25"
                      >
                        <Plus className="h-4 w-4" aria-hidden />
                      </button>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-3 text-[13px] leading-snug text-foreground/55">
                Ein Schritt zieht die Richtung ein Stück. Einzelaktien und Krypto bleiben zusammen ein kleiner Teil.
                {eigene && (
                  <>
                    {" "}
                    <button type="button" onClick={onZuruecksetzen} className="font-semibold text-primary">
                      Zurück zu meinem Vorschlag
                    </button>
                  </>
                )}
              </p>
            </div>
          )}
        </Karte>

        {/* Anlagen */}
        <Karte nr={nr++} label={`Deine Anlagen bei ${brokerName === "deinem Depot" ? "deinem Depot" : brokerName}`} className="md:col-span-6">
          <ul className="mt-2 divide-y divide-border">
            {anlagen.map(({ x, stile, gewaehlt }) => {
              const b = bausteinById(x.baustein);
              const schonDa = x.baustein === "etf" && a.gekauft === "etf";
              return (
                <li key={x.baustein} className="py-4 first:pt-2 last:pb-0">
                  <div className="flex items-center gap-2.5">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: b.farbe }} aria-hidden />
                    <span className="text-[15px] font-bold text-foreground">{b.name}</span>
                    {schonDa && <span className="rounded-full bg-gain-soft px-2 py-0.5 text-[12px] font-bold text-gain">hast du</span>}
                  </div>
                  {stile.length > 1 && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5" role="radiogroup" aria-label={`Stil für ${b.name}`}>
                      {stile.map((s) => {
                        const an = s.stil.id === gewaehlt!.stil.id;
                        return (
                          <button
                            key={s.stil.id}
                            type="button"
                            role="radio"
                            aria-checked={an}
                            onClick={() => setStil((v) => ({ ...v, [x.baustein]: s.stil.id }))}
                            className={`min-h-[34px] rounded-full border px-3 text-[13px] font-semibold transition-colors ${
                              an ? "border-foreground bg-foreground text-white" : "border-border text-foreground"
                            }`}
                          >
                            {s.stil.titel}
                          </button>
                        );
                      })}
                    </div>
                  )}
                  {gewaehlt ? (
                    <Link
                      to={`/halal-anlagen/${gewaehlt.produkt.anlage.slug}`}
                      className="mt-3 flex items-center gap-3 rounded-2xl border border-border px-3 py-3 transition-colors hover:border-foreground/40"
                    >
                      <AnlageLogo a={gewaehlt.produkt.anlage} />
                      <span className="min-w-0 flex-1">
                        <span className="block text-[15px] font-semibold leading-tight text-foreground">{gewaehlt.produkt.anlage.name}</span>
                        <Rendite p={gewaehlt.produkt} />
                      </span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-foreground/50" aria-hidden />
                    </Link>
                  ) : (
                    <p className="mt-2 text-[15px] text-foreground/65">{BEISPIEL[x.baustein] ?? ""}</p>
                  )}
                </li>
              );
            })}
          </ul>
        </Karte>

        {/* Datenbank */}
        <Karte nr={nr++} label="Aus meiner Datenbank" className="md:col-span-5">
          <dl className="mt-3 grid grid-cols-3 gap-3">
            <div>
              <dd className="text-[34px] font-extrabold leading-none tabular-nums text-foreground">{fakten.gesamt}</dd>
              <dt className="mt-1.5 text-[13px] leading-tight text-foreground/60">Halal-Anlagen geprüft</dt>
            </div>
            <div>
              <dd className="text-[34px] font-extrabold leading-none tabular-nums text-foreground">{fakten.kaufbar ?? fakten.etfs}</dd>
              <dt className="mt-1.5 text-[13px] leading-tight text-foreground/60">
                {fakten.kaufbar !== undefined ? `davon bei ${brokerName}` : "Islamic ETFs und Fonds"}
              </dt>
            </div>
            <div>
              <dd className="text-[34px] font-extrabold leading-none tabular-nums text-foreground">{fakten.zertifikat}</dd>
              <dt className="mt-1.5 text-[13px] leading-tight text-foreground/60">mit eigenem Zertifikat</dt>
            </div>
          </dl>
          <p className="mt-4 text-[15px] leading-snug text-foreground/65">
            Jede Anlage mit Zertifikat, Kosten und wo du sie kaufst. Nichts davon ist ein Urteil, alles ein Beleg.
          </p>
          <Link to="/halal-anlagen" className="mt-4 inline-flex min-h-[44px] items-center gap-1.5 text-[15px] font-bold text-primary">
            Alle Anlagen ansehen <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </Karte>

        {/* So machst du es */}
        <Karte nr={nr++} label="So machst du es" className="md:col-span-7">
          <ol className="mt-3 space-y-3 text-[16px] leading-snug text-foreground">
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-foreground text-[13px] font-bold text-white">1</span>
              <span>Öffne die App von {brokerName} und such die Anlage beim Namen.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-foreground text-[13px] font-bold text-white">2</span>
              <span>
                {monatlich ? "Kauf jeden Monat zum Beispiel " : "Kauf einmal zum Beispiel "}
                {kauf.join(", ")}.{monatlich && " Gibt es dafür einen Sparplan, läuft es von selbst."}
              </span>
            </li>
            {konto && (
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-foreground text-[13px] font-bold text-white">3</span>
                <span>Etwa {euroText(euro[anteile.indexOf(konto)])} bleiben auf deinem Girokonto. Achte darauf, dass es dir keine Zinsen zahlt.</span>
              </li>
            )}
          </ol>
          {a.broker === "anderer" && (
            <p className="mt-4 text-[15px] leading-snug text-foreground/65">
              Nicht jedes Depot hat alle Halal-Anlagen. Findest du eine nicht, schau in den{" "}
              <Link to="/vergleich/depot" className="font-semibold text-primary">
                Depot-Vergleich
              </Link>
              .
            </p>
          )}
        </Karte>
      </div>

      {/* Basics im neuen Stil */}
      <h2 className="font-titel mt-14 text-[30px] leading-tight text-foreground md:text-[38px]">Die Basics dahinter</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {BASICS.map((b, i) => {
          const auf = offen === b.id;
          return (
            <section key={b.id} className="pp-karte pp-slide p-5 md:p-6" style={{ animationDelay: `${(nr + i) * 100}ms` }}>
              <h3 className="text-[20px] font-extrabold leading-tight text-foreground">{b.titel}</h3>
              <p className="mt-1 text-[15px] text-foreground/65">{b.kurz}</p>
              <dl className="mt-4 grid grid-cols-3 gap-2">
                {b.zahlen.map((z) => (
                  <div key={z.label}>
                    <dd className="text-[22px] font-extrabold leading-none tabular-nums text-foreground">{z.wert}</dd>
                    <dt className="mt-1 text-[12px] leading-tight text-foreground/60">{z.label}</dt>
                  </div>
                ))}
              </dl>
              <button
                type="button"
                onClick={() => setOffen(auf ? undefined : b.id)}
                aria-expanded={auf}
                className="mt-4 inline-flex min-h-[44px] items-center gap-1 text-[15px] font-bold text-primary"
              >
                {auf ? "Weniger" : "So geht es"} <ChevronDown className={`h-4 w-4 transition-transform ${auf ? "rotate-180" : ""}`} aria-hidden />
              </button>
              {auf && (
                <ol className="pp-rise mt-2 space-y-2.5 text-[15px] leading-snug text-foreground">
                  {b.schritte.map((s, j) => (
                    <li key={j} className="flex gap-2.5">
                      <span className="mt-[3px] flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-foreground text-[12px] font-bold text-white">
                        {j + 1}
                      </span>
                      <span>{s}</span>
                    </li>
                  ))}
                  {b.hinweis && <li className="pl-[30px] text-[14px] text-foreground/60">{b.hinweis}</li>}
                </ol>
              )}
            </section>
          );
        })}
      </div>

      {/* PDF */}
      <div className="mt-10">
        <Knopf onClick={onPdf} disabled={pdfLaeuft}>
          <Download className="h-5 w-5" aria-hidden /> Meinen Plan als PDF sichern
        </Knopf>
        <p className="mt-2.5 text-center text-[15px] text-foreground/60">Dashboard, Anlagen und Basics auf drei Seiten.</p>
      </div>

      {/* Erst der Mehrwert, dann das Girokonto (Elias, CV23S: Cross-Selling nach dem Plan). */}
      <section className="pp-karte mt-12 p-5 md:p-6">
        <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-foreground/50">Fehlt noch</p>
        <h3 className="mt-2 text-[24px] font-extrabold leading-tight text-foreground">Dein Girokonto ohne Zinsen</h3>
        <div className="mt-4">
          <GiroAufruf gross={SCHMERZ.girokonto} zwischen={SCHMERZ.muslim} link={(ziel, stelle) => `${ziel}?src=pp${stelle}`} />
        </div>
      </section>

      <footer className="mt-10 border-t border-border pt-5 text-[13px] leading-relaxed text-foreground/60">
        <p>Ein Beispiel aus deinen Antworten, keine Anlageberatung. Wie es früher lief, ist keine Garantie für später.</p>
        <p className="mt-1">Renditen in Euro, Stand {(kurse as { stand: string }).stand}. Alle Anlagen aus meiner Halal-Datenbank.</p>
        <button type="button" onClick={onNeu} className="mt-3 inline-flex min-h-[44px] items-center gap-1 font-semibold text-foreground/70">
          Neu beginnen
        </button>
      </footer>
    </div>
  );
};

export default MeinPortfolioPlan;
