import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowDown, ArrowRight, Check, ChevronDown, ChevronLeft, Download, Minus, Moon, Plus, Sun } from "lucide-react";
import Seo from "@/components/Seo";
import GiroAufruf from "@/components/vorlagen/GiroAufruf";
import { Wordmark } from "@/components/Wordmark";
import { Geruest } from "@/components/portfolioplan/Geruest";
import { PlanAnlageZeile } from "@/components/portfolioplan/AnlageZeile";
import { useZaehler, wenigBewegung } from "@/components/portfolioplan/Zaehler";
import { BASICS } from "@/data/portfolioBasics";
import {
  ALLE_BAUSTEINE,
  anlagenJeBaustein,
  anlegertyp,
  datenbankFakten,
  GOLD_FAVORIT_FAKTEN,
  heute,
  KATEGORIE_WORT,
  kategorieFarbe,
  kannMehr,
  kannWeniger,
  planTitel,
  richtungAendern,
  richtungsSatz,
  risiko,
  risikoWort,
  sauberName,
  topPerformer,
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
  QUIZ_PFAD,
  QUIZ_SCHLUESSEL,
  REGIONEN,
  regionTitel,
  WEISE,
  WERTE,
  type Anteil,
  type Antworten,
  type FrageId,
  type Wahl,
  type Wert,
} from "@/data/portfolioQuiz";
import { ereignis } from "@/lib/messung";
import kurse from "@/data/kurse.json";
import "@/styles/portfolioplan.css";

/**
 * /dein-portfolioplan/<schluessel>: das Ultra-Freebie „Dein Halal-Investmentplan“, die Belohnung auf FERTIG
 * (CV26P, 08.11.2026; Umbau CV27P, 09.11.2026; Founder-OS- und Skilltree-Nachbau CV28P, 09.11.2026).
 *
 * Elias, 09.11.2026 (Vault raw/2026-11-09-elias-cv26p-ultra-freebie-dashboard-onboarding-luxus.md): „ein Onboarding
 * … das sich so richtig edel anfühlt. So eher weiß, schwarz, sehr so beruhigende Töne, bisschen Blauakzente vielleicht,
 * oben Finanzmuslim und dann gibst du diese Fragen ein und dann öffnet sich dieses Dashboard so von links nach rechts
 * mit diesen ganzen Grafiken“. Und (raw/2026-11-09-elias-cv27p-dashboard-plan-nacht-onboarding-fakten-pdf-jarvis.md):
 * „Hallo @finanzmuslim … dieses Dashboard sich einfach so so langsam einblenden … dann kommen so die Graphen hoch“.
 *
 * CV28P nach Vault data/laufzettel/cv28p-portfolioplan-founder-os-nachbau.md, Gefühlsblatt „Übersetzung auf den
 * Portfolioplan“ Punkt 1 bis 6: Fragen in einer Karte wie bei Skilltree mit „Dein Plan bisher“ darunter und dem
 * unscharfen Dashboard-Gerüst dahinter, Frage 7 zur Richtung, Dashboard in nummerierten Abschnitten 01 bis 06 mit
 * Inhaltsverzeichnis, Flächen-Kurven aus kurse.json, Zahlen, die hochzählen, Hell und Dunkel. Prozente stehen nur je
 * Baustein am Ring, nie an einer Anlage (memory prozente-nur-je-baustein-gold-ausnahme-royal-mint).
 */

const SPEICHER = "fm-portfolioplan-antworten";
const SPEICHER_RICHTUNG = "fm-portfolioplan-richtung";
const SPEICHER_NAME = "fm-portfolioplan-name";
/** Hell oder Dunkel, nur für diese Seite (Gefühlsblatt Punkt 5). */
const SPEICHER_THEMA = "fm-portfolioplan-theme";

type Thema = "hell" | "dunkel";

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

const liesThema = (): Thema => {
  try {
    return window.localStorage.getItem(SPEICHER_THEMA) === "dunkel" ? "dunkel" : "hell";
  } catch {
    return "hell";
  }
};

/**
 * Die Fragen, die dieser Leser sieht: Frage 7 „Wohin soll dein ETF-Geld?“ nur, wenn sein Plan einen ETF hat (bei Geld
 * für in einem Jahr gibt es keinen; CV29P, Fund beim Durchklicken 09.11.2026).
 */
const fragenFuer = (a: Antworten) => FRAGEN.filter((f) => f.id !== "region" || aufteilung(a).some((x) => x.baustein === "etf"));

const scrolleZu = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: wenigBewegung() ? "auto" : "smooth", block: "start" });

type Phase = "start" | "fragen" | "rechnet" | "dashboard";

// --- Bausteine der Gestaltung ---------------------------------------------------------------------------------------

/**
 * Ring aus den Bausteinen des Plans; zeichnet sich bis `gezeigt` (0 bis 1). Ein Tipp auf ein Stück hebt die Zeile der
 * Legende hervor (`aktiv`), die anderen Stücke treten zurück.
 */
export const PlanRing = ({
  anteile,
  gezeigt,
  groesse,
  dicke,
  aktiv,
  onWahl,
  children,
}: {
  anteile: Anteil[];
  gezeigt: number;
  groesse: number;
  dicke: number;
  aktiv?: BausteinId;
  onWahl?: (b: BausteinId) => void;
  children?: React.ReactNode;
}) => {
  const r = (groesse - dicke) / 2;
  const umfang = 2 * Math.PI * r;
  const summe = anteile.reduce((s, x) => s + x.prozent, 0) || 1;
  const luecke = anteile.length > 1 ? Math.min(5, umfang * 0.012) : 0;
  let start = 0;
  return (
    <div className="relative shrink-0" style={{ width: groesse, height: groesse }}>
      <svg width={groesse} height={groesse} viewBox={`0 0 ${groesse} ${groesse}`} className="pp-ring-svg -rotate-90" aria-hidden>
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
              opacity={aktiv && aktiv !== x.baustein ? 0.3 : 1}
              style={{ cursor: onWahl ? "pointer" : undefined }}
              onClick={onWahl ? () => onWahl(x.baustein) : undefined}
            />
          );
          start += voll;
          return el;
        })}
      </svg>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">{children}</div>
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

/** Ein Abschnitt des Dashboards: Karte mit Etikett „01 DEIN TYP“ (Founder-OS „› THE PIPELINE“, Skilltree „YOUR MAP“). */
const Abschnitt = ({
  nr,
  id,
  label,
  verzoegerung,
  className = "",
  children,
}: {
  nr: number;
  id: string;
  label: string;
  verzoegerung: number;
  className?: string;
  children: React.ReactNode;
}) => (
  <section
    id={id}
    aria-labelledby={`${id}-titel`}
    className={`pp-karte pp-slide scroll-mt-6 p-5 md:p-7 ${className}`}
    style={{ animationDelay: `${verzoegerung * 90}ms` }}
  >
    <h2 id={`${id}-titel`} className="pp-etikett">
      <span className="tabular-nums">{String(nr).padStart(2, "0")}</span>
      <span className="ml-2.5">{label}</span>
    </h2>
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
          className={`flex min-h-[64px] w-full items-center gap-3 rounded-2xl border bg-card px-4 py-3 text-left transition-[border-color,box-shadow,transform] duration-200 active:scale-[0.99] ${
            an ? "border-foreground shadow-[0_0_0_1px_hsl(var(--foreground))]" : "border-border hover:border-foreground/40"
          }`}
        >
          <span className="min-w-0 flex-1">
            {w.logo ? (
              <img src={w.logo} alt={w.titel} className="pp-logo h-[22px] w-auto max-w-[180px] object-contain object-left" />
            ) : (
              <span className="block text-[17px] font-semibold leading-tight text-foreground">{w.titel}</span>
            )}
            {w.unter && <span className="mt-0.5 block text-[15px] leading-snug text-foreground/60">{w.unter}</span>}
          </span>
          <span
            className={`flex h-6 w-6 shrink-0 items-center justify-center border transition-colors ${
              mehrere ? "rounded-md" : "rounded-full"
            } ${an ? "border-foreground bg-foreground text-background" : "border-foreground/25 bg-card"}`}
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
    className={`flex min-h-[58px] w-full items-center justify-center gap-2 rounded-2xl px-6 text-[17px] font-bold transition-[transform,opacity] active:scale-[0.99] disabled:opacity-40 ${
      leise ? "border border-border bg-card text-foreground" : "bg-foreground text-background"
    }`}
  >
    {children}
  </button>
);

/** „Dein Plan bisher“ unter der Frage-Karte: Depot und Bausteine als Chips, die mit jeder Antwort dazukommen (Skilltree). */
const PlanBisher = ({ a }: { a: Antworten }) => {
  const chips: { id: string; text: string; farbe?: string }[] = [];
  if (a.broker) {
    chips.push({ id: "depot", text: BROKER.find((b) => b.id === a.broker)?.titel ?? "Dein Depot" });
    for (const x of aufteilung(a)) {
      const b = bausteinById(x.baustein);
      const region = x.baustein === "etf" ? regionTitel(a.region) : undefined;
      chips.push({ id: x.baustein, text: region ? `${b.name} · ${region}` : b.name, farbe: b.farbe });
    }
  }
  const n = chips.filter((c) => c.farbe).length;
  return (
    <div className="pp-karte mx-auto mt-4 w-full max-w-[560px] px-5 py-4">
      <p className="pp-etikett !text-[12px]">
        Dein Plan bisher{n > 0 && ` · ${n} ${n === 1 ? "Baustein" : "Bausteine"}`}
      </p>
      {chips.length ? (
        <ul className="mt-3 flex flex-wrap gap-2">
          {chips.map((c) => (
            <li
              key={c.id}
              className="pp-rise inline-flex min-h-[32px] items-center gap-2 rounded-full border border-border px-3 text-[14px] font-semibold text-foreground"
            >
              {c.farbe && <span className="h-2.5 w-2.5 rounded-full" style={{ background: c.farbe }} aria-hidden />}
              {c.text}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-[15px] text-foreground/60">Füllt sich mit jeder Antwort.</p>
      )}
    </div>
  );
};

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
  const [thema, setThema] = useState<Thema>(() => (typeof window === "undefined" ? "hell" : liesThema()));

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
      const naechste = fragenFuer(alt).findIndex((f) => !beantwortet(alt, f.id));
      if (naechste < 0) setPhase("dashboard");
      else setSchritt(naechste);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Das Dashboard zeichnet Ring, Tacho und Zahlen erst, wenn es steht: so sieht man, wie es sich aufbaut.
  useEffect(() => {
    if (phase !== "dashboard") return setBereit(false);
    const t = window.setTimeout(() => setBereit(true), wenigBewegung() ? 0 : 250);
    return () => window.clearTimeout(t);
  }, [phase]);

  const anteile = useMemo(() => eigene ?? aufteilung(a), [a, eigene]);
  const typ = useMemo(() => anlegertyp(anteile), [anteile]);
  const risk = useMemo(() => risiko(anteile), [anteile]);

  if (schluessel !== QUIZ_SCHLUESSEL) return <Navigate to="/halal-guide" replace />;

  const fragen = fragenFuer(a);
  const frage = fragen[schritt];
  const depotTitel = a.broker && a.broker !== "anderer" ? BROKER.find((b) => b.id === a.broker)?.titel : undefined;

  const wechsleThema = () => {
    const neu: Thema = thema === "dunkel" ? "hell" : "dunkel";
    setThema(neu);
    try {
      window.localStorage.setItem(SPEICHER_THEMA, neu);
    } catch {
      /* privates Fenster: gilt nur bis zum Neuladen */
    }
  };

  const setze = (neu: Antworten, id: FrageId) => {
    if (id === "weise" && neu.weise !== a.weise) delete neu.betrag;
    setA(neu);
    schreibe(SPEICHER, neu);
    // Eine neue Antwort setzt eine eigene Richtung zurück: sonst passt der Plan nicht mehr zu den Antworten.
    setEigene(undefined);
    schreibe(SPEICHER_RICHTUNG, undefined);
    ereignis("quiz_frage", { quiz: "portfolioplan", frage: id });
    const naechste = fragenFuer(neu).findIndex((f) => !beantwortet(neu, f.id));
    window.setTimeout(() => {
      if (naechste >= 0) setSchritt(naechste);
      else rechne();
    }, wenigBewegung() ? 0 : 240);
  };

  /** Frage 7 merkt sich die Wahl nur; erst der Knopf „Meinen Plan erstellen“ rechnet (wie bei Skilltree). */
  const merkeRegion = (region: Antworten["region"]) => {
    const neu = { ...a, region };
    setA(neu);
    schreibe(SPEICHER, neu);
    ereignis("quiz_frage", { quiz: "portfolioplan", frage: "region" });
  };

  const rechne = () => {
    setPhase("rechnet");
    setZeilen(0);
    ereignis("quiz_ergebnis", { quiz: "portfolioplan" });
    const takt = wenigBewegung() ? 0 : 480;
    [1, 2, 3, 4, 5].forEach((n) => window.setTimeout(() => setZeilen(n), takt * n));
    window.setTimeout(() => {
      setPhase("dashboard");
      window.scrollTo({ top: 0, behavior: "auto" });
    }, takt * 6 + 200);
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

  const ladePdf = async (stile: Partial<Record<BausteinId, string>>) => {
    setPdfLaeuft(true);
    setPdfZeile(0);
    const takt = wenigBewegung() ? 0 : 650;
    [1, 2, 3].forEach((n) => window.setTimeout(() => setPdfZeile(n), takt * n));
    try {
      const [{ planPdf }] = await Promise.all([
        import("@/lib/planPdf"),
        new Promise((r) => window.setTimeout(r, takt * 3 + 400)),
      ]);
      await planPdf(a, { anteile, name, region: a.region, stile });
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
                className={`min-h-[64px] rounded-2xl border bg-card px-2 text-[19px] font-bold tabular-nums text-foreground transition-[border-color,box-shadow] ${
                  a.betrag === b ? "border-foreground shadow-[0_0_0_1px_hsl(var(--foreground))]" : "border-border hover:border-foreground/40"
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
                Weiter <ArrowRight className="h-5 w-5" aria-hidden />
              </Knopf>
            </div>
          </>
        );
      case "region":
        return (
          <>
            <Auswahl wahl={REGIONEN} gewaehlt={(x) => a.region === x} onWahl={merkeRegion} />
            <div className="mt-5">
              <Knopf onClick={rechne} disabled={!a.region}>
                Meinen Plan erstellen <ArrowRight className="h-5 w-5" aria-hidden />
              </Knopf>
            </div>
          </>
        );
    }
  };

  const dunkel = thema === "dunkel";

  const kopf = (
    <header className="container relative z-10 flex h-16 max-w-5xl items-center justify-between">
      <Link to="/" aria-label="finanzmuslim Startseite">
        <Wordmark className="text-[20px]" />
      </Link>
      <div className="flex items-center gap-3">
        {phase === "dashboard" && <span className="hidden text-[14px] text-foreground/60 sm:inline">{heute()}</span>}
        <button
          type="button"
          onClick={wechsleThema}
          aria-label={dunkel ? "Helles Design" : "Dunkles Design"}
          aria-pressed={dunkel}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-foreground/40"
        >
          {dunkel ? <Sun className="h-[18px] w-[18px]" aria-hidden /> : <Moon className="h-[18px] w-[18px]" aria-hidden />}
        </button>
      </div>
    </header>
  );

  const geruestStufe = phase === "rechnet" ? zeilen + 1 : 6;
  // Während der Fragen zählen die Werte schon, bevor „Weiter“ gedrückt ist: so wächst der Plan sichtbar mit.
  const bisher: Antworten = frage?.id === "werte" ? { ...a, werte } : a;

  return (
    <div
      className="pp-seite relative min-h-[calc(100svh-80px)] overflow-x-hidden"
      data-theme={thema}
      data-freebie="mein-portfolioplan"
    >
      <Seo
        title="Dein Halal-Investmentplan | finanzmuslim"
        description="Sieben Fragen, dann steht dein Halal-Investmentplan: Anlegertyp, Richtung, Anlagen bei deinem Depot, als Dashboard und PDF."
        path={QUIZ_PFAD}
        noindex
      />
      {phase !== "dashboard" && <Geruest stufe={geruestStufe} />}
      {kopf}

      {phase === "start" && (
        <section className="container relative z-10 flex min-h-[calc(100svh-160px)] max-w-xl flex-col justify-center py-10">
          <h1 className="pp-rise font-titel text-[44px] leading-[1.05] text-foreground md:text-[60px]">
            {name ? `Hallo ${name}.` : "Hallo."}
          </h1>
          <p className="pp-rise mt-5 text-[19px] leading-snug text-foreground/75 md:text-[22px]" style={{ animationDelay: "120ms" }}>
            Sieben Fragen. Dann steht dein Halal-Investmentplan: dein Anlegertyp, deine Richtung und die Anlagen, die es
            bei deinem Depot gibt.
          </p>
          <div className="pp-rise mt-9" style={{ animationDelay: "240ms" }}>
            <Knopf onClick={() => setPhase("fragen")}>
              {Object.keys(a).length ? "Weitermachen" : "Los geht's"} <ArrowRight className="h-5 w-5" aria-hidden />
            </Knopf>
            <p className="mt-3 text-center text-[14px] text-foreground/60">Zwei Minuten. Keine Anmeldung.</p>
          </div>
        </section>
      )}

      {phase === "fragen" && frage && (
        <div className="container relative z-10 max-w-5xl py-6 md:py-12">
          <section className="pp-karte pp-rise mx-auto w-full max-w-[560px] p-5 md:p-7" aria-labelledby="pp-frage-titel">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-[14px] tabular-nums text-foreground/60">
                Frage <b className="text-foreground">{schritt + 1}</b> von {fragen.length}
              </p>
              <p className="pp-etikett !text-[12px]">{frage.kurz}</p>
            </div>
            <div className="mt-3 h-[3px] w-full overflow-hidden rounded-full bg-muted" aria-hidden>
              <div className="pp-balken h-full rounded-full bg-primary" style={{ width: `${((schritt + 1) / fragen.length) * 100}%` }} />
            </div>
            <div key={frage.id} className="pp-frage">
              {schritt > 0 ? (
                <button
                  type="button"
                  onClick={() => setSchritt(schritt - 1)}
                  className="-ml-2 mt-2 inline-flex min-h-[44px] items-center gap-1 pr-3 text-[15px] font-semibold text-foreground/60"
                >
                  <ChevronLeft className="h-5 w-5" aria-hidden /> Zurück
                </button>
              ) : (
                <div className="mt-2 h-[44px]" />
              )}
              <h1 id="pp-frage-titel" className="font-titel mt-1 text-[32px] leading-[1.1] text-foreground md:text-[40px]">
                {frage.titel}
              </h1>
              <p className="mt-2 text-[16px] leading-snug text-foreground/65">{frage.satz}</p>
              <div className="mt-6">{frageInhalt(frage.id)}</div>
              {beantwortet(a, frage.id) && frage.id !== "werte" && frage.id !== "region" && (
                <p className="mt-4 text-[14px] text-foreground/60">Bisher: {antwortText(a, frage.id)}</p>
              )}
            </div>
          </section>
          <PlanBisher a={bisher} />
        </div>
      )}

      {phase === "rechnet" && (
        <div className="container relative z-10 flex min-h-[calc(100svh-160px)] max-w-5xl flex-col justify-center py-10">
          <section className="pp-karte pp-rise mx-auto w-full max-w-[560px] p-5 md:p-7" aria-live="polite">
            <p className="pp-etikett !text-[12px]">Fast fertig</p>
            <h1 className="font-titel mt-2 text-[34px] leading-[1.1] text-foreground md:text-[42px]">Dein Plan entsteht.</h1>
            <div className="mt-5 h-[3px] w-full overflow-hidden rounded-full bg-muted" aria-hidden>
              <div className="pp-balken h-full rounded-full bg-primary" style={{ width: `${(zeilen / 5) * 100}%` }} />
            </div>
            <ul className="mt-6 space-y-3.5">
              {[
                "Deine Antworten gelesen",
                `${datenbankFakten().gesamt} Halal-Anlagen durchsucht`,
                `Geprüft, was es bei ${depotTitel ?? "deinem Depot"} gibt`,
                "Deine Richtung gerechnet",
                "Dein Dashboard gebaut",
              ].map((t, i) => (
                <li key={t} className={`flex items-center gap-3 text-[17px] ${zeilen > i ? "pp-zeile text-foreground" : "invisible"}`}>
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
                    <Check className="h-4 w-4" strokeWidth={3} aria-hidden />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </section>
        </div>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 px-6 backdrop-blur-sm" role="status" aria-live="polite">
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
  onPdf: (stile: Partial<Record<BausteinId, string>>) => void;
  pdfLaeuft: boolean;
  onNeu: () => void;
  onAntwortAendern: (id: FrageId) => void;
};

/** „A, B und C“ */
const aufzaehlen = (teile: string[]) =>
  teile.length < 2 ? (teile[0] ?? "") : `${teile.slice(0, -1).join(", ")} und ${teile[teile.length - 1]}`;

const Nummer = ({ n }: { n: number }) => (
  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-foreground text-[13px] font-bold text-background">{n}</span>
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
  const depot = a.broker && a.broker !== "anderer" ? BROKER.find((b) => b.id === a.broker)?.titel : undefined;
  const depotBei = depot ?? "deinem Depot";
  const fakten = datenbankFakten(a.broker);
  const [stil, setStil] = useState<Partial<Record<BausteinId, string>>>({});
  const [offen, setOffen] = useState<string | undefined>();
  const [richtungOffen, setRichtungOffen] = useState(false);
  const [aktiv, setAktiv] = useState<BausteinId | undefined>();
  const top = useMemo(() => topPerformer(5), []);

  const bloecke = anlagenJeBaustein(anteile, a, stil);
  const anzahl = bloecke.reduce((s, b) => s + b.produkte.length + (b.favorit ? 1 : 0), 0);
  const konto = anteile.find((x) => x.baustein === "konto");
  const mitEtf = anteile.some((x) => x.baustein === "etf");
  const region = mitEtf ? regionTitel(a.region) : undefined;

  const riskZahl = useZaehler(risk, bereit);
  const zGesamt = useZaehler(fakten.gesamt, bereit);
  const zMitte = useZaehler(fakten.kaufbar ?? fakten.etfs, bereit);
  const zZertifikat = useZaehler(fakten.zertifikat, bereit);

  const waehle = (b: BausteinId) => setAktiv((x) => (x === b ? undefined : b));

  const inhalt: { etikett: string; wert: string; ziel: string }[] = [
    { etikett: "Dein Typ", wert: typName, ziel: "pp-typ" },
    { etikett: "Risiko", wert: `${riskZahl} %`, ziel: "pp-risiko" },
    { etikett: "Anlagen", wert: `${anzahl} bei ${depotBei}`, ziel: "pp-anlagen" },
  ];

  const kauf = anteile
    .map((x, i) => ({ x, e: euro[i] }))
    .filter(({ x }) => x.baustein !== "konto")
    .map(({ x, e }) => `${euroText(e)} ${bausteinById(x.baustein).name}`);

  return (
    <div className="container relative z-10 max-w-5xl pb-16 pt-4 md:pt-8">
      {/* Kopf: Abzeichen, Titel, ein Satz, drei Kacheln als Inhaltsverzeichnis (Skilltree-Ergebnis). */}
      <div className="pp-rise">
        <p className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-[12px] font-bold uppercase tracking-[0.08em] text-foreground">
          <Check className="h-3.5 w-3.5 text-primary" strokeWidth={3} aria-hidden /> Dein Plan steht
        </p>
        <h1 className="font-titel mt-4 text-[36px] leading-[1.05] text-foreground md:text-[52px]">{planTitel(name)}</h1>
        <p className="mt-3 flex flex-wrap gap-x-2 text-[16px] leading-snug text-foreground/65">
          <span>{depot ?? "Dein Depot"}</span>
          <span aria-hidden>·</span>
          <span>
            {euroText(betrag)} {monatlich ? "im Monat" : "einmal"}
          </span>
          {region && (
            <>
              <span aria-hidden>·</span>
              <span>{region}-Schwerpunkt</span>
            </>
          )}
          <span aria-hidden>·</span>
          <span>
            {anzahl} {anzahl === 1 ? "Anlage" : "Anlagen"}
          </span>
          <button type="button" onClick={() => onAntwortAendern("broker")} className="ml-1 font-semibold text-primary">
            Antworten ändern
          </button>
        </p>
      </div>

      <nav aria-label="Inhalt" className="pp-slide mt-6 grid grid-cols-3 gap-2 md:gap-3" style={{ animationDelay: "90ms" }}>
        {inhalt.map((k) => (
          <button
            key={k.etikett}
            type="button"
            onClick={() => scrolleZu(k.ziel)}
            className="pp-karte flex min-h-[92px] flex-col justify-between p-3 text-left transition-colors hover:border-foreground/40 md:p-5"
          >
            <span className="pp-etikett !text-[11px] md:!text-[12px]">{k.etikett}</span>
            <span className="mt-2 flex items-end justify-between gap-1">
              <span className="text-[15px] font-extrabold leading-tight tabular-nums text-foreground md:text-[22px]">{k.wert}</span>
              <ArrowDown className="mb-0.5 h-4 w-4 shrink-0 text-foreground/50" aria-hidden />
            </span>
          </button>
        ))}
      </nav>

      <div className="mt-4 space-y-4">
        {/* 01 Dein Typ */}
        <Abschnitt nr={1} id="pp-typ" label="Dein Typ" verzoegerung={2}>
          <div className="mt-3 grid gap-6 md:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] md:items-center">
            <div>
              <p className="font-titel text-[40px] leading-none text-foreground md:text-[52px]">{typName}</p>
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
            </div>
            <div id="pp-risiko" className="scroll-mt-6 flex flex-col items-center">
              <p className="pp-etikett !text-[12px]">Risiko</p>
              <div className="relative mt-2 flex w-full flex-col items-center">
                <Tacho wert={risk} gezeigt={bereit} />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center">
                  <span className="text-[40px] font-extrabold leading-none tabular-nums text-foreground">
                    {riskZahl}
                    <span className="text-[22px]">&nbsp;%</span>
                  </span>
                  <span className="mt-1 text-[15px] font-semibold capitalize text-foreground/65">{risikoWort(risk)}</span>
                </div>
              </div>
              <p className="mt-4 max-w-[300px] text-center text-[15px] leading-snug text-foreground/65">
                Je mehr Aktien und Krypto, desto höher. Je mehr Sukuk und Konto, desto ruhiger.
              </p>
            </div>
          </div>
        </Abschnitt>

        {/* 02 Deine Richtung: Prozent nur je Baustein (Elias 09.11.2026). */}
        <Abschnitt nr={2} id="pp-richtung" label="Deine Richtung" verzoegerung={3}>
          <div className="mt-4 flex flex-col items-center gap-6 md:flex-row md:items-center md:gap-10">
            <PlanRing anteile={anteile} gezeigt={bereit ? 1 : 0} groesse={176} dicke={22} aktiv={aktiv} onWahl={waehle}>
              <span className="text-[26px] font-extrabold leading-none tabular-nums text-foreground">{euroText(betrag)}</span>
              <span className="mt-1 text-[13px] text-foreground/60">{monatlich ? "im Monat" : "einmal"}</span>
            </PlanRing>
            <ul className="w-full min-w-0 flex-1 space-y-1">
              {anteile.map((x, i) => {
                const b = bausteinById(x.baustein);
                const an = aktiv === x.baustein;
                return (
                  <li key={x.baustein}>
                    <button
                      type="button"
                      aria-pressed={an}
                      onClick={() => waehle(x.baustein)}
                      className={`flex min-h-[48px] w-full items-center gap-3 rounded-xl px-3 text-left transition-[background-color,opacity] ${
                        an ? "bg-muted" : aktiv ? "opacity-50" : ""
                      }`}
                    >
                      <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: b.farbe }} aria-hidden />
                      <span className="min-w-0 flex-1 text-[16px] font-bold leading-tight text-foreground md:truncate">{b.name}</span>
                      <span className="text-[17px] font-extrabold tabular-nums text-foreground">{x.prozent}&nbsp;%</span>
                      <span className="w-[64px] text-right text-[14px] tabular-nums text-foreground/65 md:w-[96px]">
                        <span className="hidden md:inline">z.&nbsp;B. </span>
                        {euroText(euro[i])}
                      </span>
                    </button>
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
                        <span className={`block text-[15px] font-semibold ${p ? "text-foreground" : "text-foreground/50"}`}>{b.name}</span>
                        <span className="block text-[13px] tabular-nums text-foreground/60">{p ? `${p} %` : "nicht dabei"}</span>
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
              <p className="mt-3 text-[14px] leading-snug text-foreground/65">
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
        </Abschnitt>

        {/* 03 Deine Anlagen: alle kaufbaren Anlagen des gewählten Stils, Gold mit Royal Mint als Favorit. */}
        <Abschnitt nr={3} id="pp-anlagen" label={`Deine Anlagen bei ${depotBei}`} verzoegerung={4}>
          <div className="mt-4 space-y-3">
            {bloecke.map((blk) => {
              const x = blk.anteil;
              const b = bausteinById(x.baustein);
              const schonDa = x.baustein === "etf" && a.gekauft === "etf";
              const satz = x.baustein === "etf" ? richtungsSatz(a, blk.stil, depot) : "";
              const leer = blk.produkte.length === 0 && !blk.favorit;
              return (
                <div key={x.baustein} className="rounded-2xl border border-border p-3 md:p-4">
                  <div className="flex items-center gap-2.5 px-1">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: b.farbe }} aria-hidden />
                    <span className="text-[16px] font-bold text-foreground">{b.name}</span>
                    {schonDa && <span className="rounded-full bg-gain-soft px-2 py-0.5 text-[12px] font-bold text-gain">hast du</span>}
                    <span className="ml-auto text-[14px] tabular-nums text-foreground/65">
                      z.&nbsp;B. {euroText(euro[anteile.indexOf(x)])}
                    </span>
                  </div>
                  {blk.stile.length > 1 && (
                    <div className="mt-3 flex flex-wrap gap-1.5 px-1" role="radiogroup" aria-label={`Stil für ${b.name}`}>
                      {blk.stile.map((s) => {
                        const an = s.stil.id === blk.stil?.id;
                        return (
                          <button
                            key={s.stil.id}
                            type="button"
                            role="radio"
                            aria-checked={an}
                            onClick={() => setStil((v) => ({ ...v, [x.baustein]: s.stil.id }))}
                            className={`min-h-[36px] rounded-full border px-3 text-[14px] font-semibold transition-colors ${
                              an ? "border-foreground bg-foreground text-background" : "border-border text-foreground hover:border-foreground/40"
                            }`}
                          >
                            {s.stil.titel}
                          </button>
                        );
                      })}
                    </div>
                  )}
                  {satz && <p className="mt-3 px-1 text-[16px] font-semibold leading-snug text-foreground">{satz}</p>}

                  {blk.favorit && (
                    <div className="mt-2">
                      <PlanAnlageZeile
                        produkt={blk.favorit}
                        farbe={b.farbe}
                        marke={
                          <span className="mt-1 inline-flex w-fit items-center rounded-full border border-border px-2 py-0.5 align-middle text-[12px] font-bold text-foreground md:ml-1 md:mt-0 md:translate-y-[-1px]">
                            Unser Favorit
                          </span>
                        }
                      />
                      <ul className="mb-1 ml-[60px] mt-1 space-y-1.5 pr-2">
                        {GOLD_FAVORIT_FAKTEN.map((f) => (
                          <li key={f} className="flex items-start gap-2 text-[15px] leading-snug text-foreground">
                            <Check className="mt-[3px] h-4 w-4 shrink-0 text-gain" strokeWidth={3} aria-hidden />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {blk.produkte.length > 0 && (
                    <div className={`mt-2 ${blk.favorit ? "border-t border-border pt-2" : ""}`}>
                      {blk.produkte.map((p) => (
                        <PlanAnlageZeile key={p.anlage.slug} produkt={p} farbe={b.farbe} />
                      ))}
                    </div>
                  )}

                  {leer && <p className="mt-2 px-1 text-[15px] text-foreground/65">{BEISPIEL[x.baustein] ?? ""}</p>}
                </div>
              );
            })}
          </div>
        </Abschnitt>

        {/* 04 Aus der Datenbank: Zahlen zählen hoch, daneben die Top-Performer des letzten Jahres. */}
        <Abschnitt nr={4} id="pp-datenbank" label="Aus der Datenbank" verzoegerung={5}>
          <div className="mt-4 grid gap-8 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div>
              <dl className="grid grid-cols-3 gap-3">
                <div>
                  <dd className="text-[34px] font-extrabold leading-none tabular-nums text-foreground md:text-[44px]">{zGesamt}</dd>
                  <dt className="mt-1.5 text-[14px] leading-tight text-foreground/65">Halal-Anlagen geprüft</dt>
                </div>
                <div>
                  <dd className="text-[34px] font-extrabold leading-none tabular-nums text-foreground md:text-[44px]">{zMitte}</dd>
                  <dt className="mt-1.5 text-[14px] leading-tight text-foreground/65">
                    {fakten.kaufbar !== undefined ? `davon bei ${depotBei}` : "Islamic ETFs und Fonds"}
                  </dt>
                </div>
                <div>
                  <dd className="text-[34px] font-extrabold leading-none tabular-nums text-foreground md:text-[44px]">{zZertifikat}</dd>
                  <dt className="mt-1.5 text-[14px] leading-tight text-foreground/65">mit eigenem Zertifikat</dt>
                </div>
              </dl>
              <Link to="/halal-anlagen" className="mt-6 inline-flex min-h-[44px] items-center gap-1.5 text-[15px] font-bold text-primary">
                Alle Anlagen ansehen <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
            <div>
              <h3 className="pp-etikett !text-[12px]">Top-Performer im letzten Jahr</h3>
              <div className="mt-2">
                {top.map((p) => (
                  <PlanAnlageZeile
                    key={p.anlage.slug}
                    produkt={p}
                    farbe={kategorieFarbe(p.anlage.kategorie)}
                    unter={KATEGORIE_WORT[p.anlage.kategorie]}
                    mitLogo={false}
                    nurEinJahr
                  />
                ))}
              </div>
              <p className="mt-2 px-2 text-[15px] leading-snug text-foreground/65">Was es gebracht hat, nicht was du kaufen sollst.</p>
            </div>
          </div>
        </Abschnitt>

        {/* 05 So machst du es */}
        <Abschnitt nr={5} id="pp-so" label="So machst du es" verzoegerung={6}>
          <ol className="mt-4 space-y-3 text-[16px] leading-snug text-foreground">
            <li className="flex gap-3">
              <Nummer n={1} />
              <span>Öffne die App von {depotBei} und such die Anlage beim Namen.</span>
            </li>
            <li className="flex gap-3">
              <Nummer n={2} />
              <span>
                {monatlich ? "Kauf jeden Monat zum Beispiel " : "Kauf einmal zum Beispiel "}
                {aufzaehlen(kauf)}. Welche Anlage dazu passt, steht oben.
                {monatlich && " Gibt es dafür einen Sparplan, läuft es von selbst."}
              </span>
            </li>
            {konto && (
              <li className="flex gap-3">
                <Nummer n={3} />
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
        </Abschnitt>

        {/* 06 Die Basics, vier Karten wie in CV27P */}
        <Abschnitt nr={6} id="pp-basics" label="Die Basics" verzoegerung={7}>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {BASICS.map((b) => {
              const auf = offen === b.id;
              return (
                <div key={b.id} className="rounded-2xl border border-border p-4 md:p-5">
                  <h3 className="text-[20px] font-extrabold leading-tight text-foreground">{b.titel}</h3>
                  <p className="mt-1 text-[15px] text-foreground/65">{b.kurz}</p>
                  <dl className="mt-4 grid grid-cols-3 gap-2">
                    {b.zahlen.map((z) => (
                      <div key={z.label}>
                        <dd className="whitespace-nowrap text-[18px] font-extrabold leading-none tabular-nums text-foreground md:text-[22px]">{z.wert}</dd>
                        <dt className="mt-1 text-[13px] leading-tight text-foreground/65">{z.label}</dt>
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
                          <span className="mt-[3px] flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-foreground text-[12px] font-bold text-background">
                            {j + 1}
                          </span>
                          <span>{s}</span>
                        </li>
                      ))}
                      {b.hinweis && <li className="pl-[30px] text-[14px] text-foreground/65">{b.hinweis}</li>}
                    </ol>
                  )}
                </div>
              );
            })}
          </div>
        </Abschnitt>
      </div>

      {/* PDF */}
      <div className="mt-10">
        <Knopf onClick={() => onPdf(stil)} disabled={pdfLaeuft}>
          <Download className="h-5 w-5" aria-hidden /> Meinen Plan als PDF sichern
        </Knopf>
        <p className="mt-2.5 text-center text-[15px] text-foreground/65">Dashboard, Anlagen und Basics auf drei Seiten.</p>
      </div>

      {/* Erst der Mehrwert, dann das Girokonto (Elias, CV23S: Cross-Selling nach dem Plan). */}
      <section className="pp-karte mt-12 p-5 md:p-7">
        <p className="pp-etikett">Fehlt noch</p>
        <h3 className="mt-2 text-[24px] font-extrabold leading-tight text-foreground">Dein Girokonto ohne Zinsen</h3>
        <div className="mt-4">
          <GiroAufruf gross={SCHMERZ.girokonto} zwischen={SCHMERZ.muslim} link={(ziel, stelle) => `${ziel}?src=pp${stelle}`} />
        </div>
      </section>

      <footer className="mt-10 border-t border-border pt-5 text-[13px] leading-relaxed text-foreground/65">
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
