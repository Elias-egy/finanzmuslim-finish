import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowRight, ChevronDown } from "lucide-react";

/**
 * Simplified Halal Portfolio Calculator
 * - Compact input row (one-time, monthly, years, return-with-dropdown)
 * - Large chart + compact results panel
 * - Advanced portfolio builder only via "Eigenes Portfolio erstellen"
 */

type AssetKey = "etf" | "sukuk" | "gold" | "silver";

type Asset = {
  key: AssetKey;
  label: string;
  ret: number;
  vol: number;
  color: string;
};

const ASSETS: Asset[] = [
  { key: "etf",    label: "Halal-Aktien & ETFs", ret: 0.08, vol: 0.15, color: "hsl(var(--primary))" },
  { key: "sukuk",  label: "Sukuk",               ret: 0.03, vol: 0.05, color: "hsl(var(--success))" },
  { key: "gold",   label: "Gold",                ret: 0.06, vol: 0.15, color: "hsl(var(--warning))" },
  { key: "silver", label: "Silber",              ret: 0.05, vol: 0.30, color: "hsl(var(--muted-foreground))" },
];

const CORRELATION: number[][] = [
  [1.0,  0.20, 0.05, 0.35],
  [0.20, 1.0,  0.10, 0.10],
  [0.05, 0.10, 1.0,  0.65],
  [0.35, 0.10, 0.65, 1.0 ],
];

type Alloc = Record<AssetKey, number>;

import kursDaten from "@/data/kurse.json";

type PresetKey = "ret3" | "ret5" | "ret8";

const PRESETS: Record<PresetKey, { label: string; short: string; ret: number }> = {
  ret3: { label: "Stabilität — 3 % p.a.",   short: "3 % p.a.",   ret: 0.03 },
  ret5: { label: "Ausgewogen — 5 % p.a.",   short: "5 % p.a.",   ret: 0.05 },
  ret8: { label: "Wachstum — 7,5 % p.a.",   short: "7,5 % p.a.", ret: 0.075 },
};

/** Gepruefte Anlagen mit Fuenfjahresrendite, umgerechnet auf Rendite pro Jahr.
 *
 *  Das ist der Punkt, den kein anderer Rechner hat: Statt einer geratenen
 *  Prozentzahl kann man mit dem rechnen, was eine gepruefte Anlage in den
 *  letzten fuenf Jahren tatsaechlich gemacht hat. Wichtig ist die Einordnung
 *  daneben: gewesen ist nicht kuenftig. */
type AnlageOption = { isin: string; name: string; proJahr: number };

const anlagenOptionen: AnlageOption[] = Object.entries(
  kursDaten.anlagen as Record<string, { name?: string; r5j?: number | null }>,
)
  .filter(([, a]) => typeof a.r5j === "number" && a.name)
  .map(([isin, a]) => ({
    isin,
    name: a.name as string,
    // Gesamtrendite ueber fuenf Jahre auf einen Jahreswert umrechnen.
    proJahr: Math.pow(1 + (a.r5j as number) / 100, 1 / 5) - 1,
  }))
  // Nach Namen sortiert, nicht nach Rendite. Eine nach Ertrag sortierte Liste
  // stellt oben die heissesten Jahre der letzten fuenf Jahre nach vorn, hier
  // waeren das ausschließlich Gold und Silber. Das liest sich wie eine
  // Empfehlung, und eine Empfehlung geben wir nicht ab.
  .sort((a, b) => a.name.localeCompare(b.name, "de"));

const kursStand = (kursDaten as { stand?: string }).stand ?? "";

const formatEuro = (n: number) =>
  new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);

const fmtPct = (n: number, digits = 1) =>
  new Intl.NumberFormat("de-DE", { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(n);

const computePortfolio = (alloc: Alloc) => {
  const w = ASSETS.map((a) => alloc[a.key] / 100);
  const ret = ASSETS.reduce((acc, a, i) => acc + w[i] * a.ret, 0);
  let variance = 0;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      variance += w[i] * w[j] * ASSETS[i].vol * ASSETS[j].vol * CORRELATION[i][j];
    }
  }
  return { ret, vol: Math.sqrt(Math.max(0, variance)) };
};

const rebalance = (prev: Alloc, key: AssetKey, next: number): Alloc => {
  next = Math.max(0, Math.min(100, Math.round(next)));
  if (next === 100) {
    const r: Alloc = { etf: 0, sukuk: 0, gold: 0, silver: 0 };
    r[key] = 100;
    return r;
  }
  const others = (Object.keys(prev) as AssetKey[]).filter((k) => k !== key);
  const remaining = 100 - next;
  const othersSum = others.reduce((s, k) => s + prev[k], 0);
  const out: Alloc = { ...prev, [key]: next };
  if (othersSum === 0) {
    const base = Math.floor(remaining / others.length);
    let rem = remaining - base * others.length;
    others.forEach((k) => {
      out[k] = base + (rem-- > 0 ? 1 : 0);
    });
  } else {
    let assigned = 0;
    others.forEach((k, i) => {
      if (i === others.length - 1) {
        out[k] = remaining - assigned;
      } else {
        const v = Math.round((prev[k] / othersSum) * remaining);
        out[k] = v;
        assigned += v;
      }
    });
  }
  const total = ASSETS.reduce((s, a) => s + out[a.key], 0);
  if (total !== 100) {
    const diff = 100 - total;
    const fix = others[0];
    out[fix] = Math.max(0, out[fix] + diff);
  }
  return out;
};

const niceCeil = (raw: number): number => {
  if (raw <= 0) return 1000;
  const exp = Math.floor(Math.log10(raw));
  const base = Math.pow(10, exp);
  const norm = raw / base;
  let nice: number;
  if (norm <= 1) nice = 1;
  else if (norm <= 2) nice = 2;
  else if (norm <= 2.5) nice = 2.5;
  else if (norm <= 5) nice = 5;
  else nice = 10;
  return nice * base;
};

type ReturnMode = "custom" | PresetKey | "own" | "anlage";

const ReturnCalculator = ({ showHeader = true }: { showHeader?: boolean } = {}) => {
  // Committed numeric state (drives calculations)
  const [startCapital, setStartCapital] = useState(1000);
  const [monthly, setMonthly] = useState(200);
  const [years, setYears] = useState(10);
  const [ownRate, setOwnRate] = useState(6.0);

  // Draft string state (what the input displays while editing)
  const [startCapitalStr, setStartCapitalStr] = useState("1000");
  const [monthlyStr, setMonthlyStr] = useState("200");
  const [yearsStr, setYearsStr] = useState("10");
  const [ownRateStr, setOwnRateStr] = useState("6,0");

  const [mode, setMode] = useState<ReturnMode>("own");
  const [customAlloc, setCustomAlloc] = useState<Alloc>({ etf: 50, sukuk: 25, gold: 20, silver: 5 });
  const [customApplied, setCustomApplied] = useState<Alloc | null>(null);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [builderOpen, setBuilderOpen] = useState(false);
  const [methodOpen, setMethodOpen] = useState(false);

  const anchorRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const inputCardRef = useRef<HTMLDivElement>(null);
  const chartCardRef = useRef<HTMLDivElement>(null);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);

  // Nach Commit: auf Desktop weiterhin die Eingabekarte unter den Header ziehen
  // (Chart + Ergebnisse + CTA passen in den Rest). Auf Mobil den Chart optimal
  // zeigen — CTA darf gerade eben unten hineinragen, aber NICHT in den Fokus
  // springen.
  const scrollToResults = () => {
    if (typeof window === "undefined") return;
    const doScroll = () => {
      const isMobile = window.innerWidth < 768;
      const headerOffset = isMobile ? 72 : 76;
      if (isMobile) {
        const chart = chartCardRef.current;
        if (!chart) return;
        const rect = chart.getBoundingClientRect();
        const chartTopAbs = rect.top + window.scrollY;
        const vh = window.innerHeight;
        // Ideal: Chart komplett im Blick, CTA lugt ~72px unten heraus.
        const peek = 72;
        const desiredTop = chartTopAbs + rect.height + peek - vh;
        // Nicht weiter hoch scrollen, als der Chart-Kartenkopf sichtbar bleibt.
        const maxTop = chartTopAbs - headerOffset;
        const top = Math.min(Math.max(0, desiredTop), Math.max(0, maxTop));
        window.scrollTo({ top, behavior: "smooth" });
        return;
      }
      const el = inputCardRef.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    };
    requestAnimationFrame(() => requestAnimationFrame(doScroll));
  };

  // Position + reposition portal
  useLayoutEffect(() => {
    if (!dropdownOpen) return;
    const update = () => {
      if (anchorRef.current) setAnchorRect(anchorRef.current.getBoundingClientRect());
    };
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [dropdownOpen]);

  // Outside click + Escape
  useEffect(() => {
    if (!dropdownOpen) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (
        anchorRef.current && !anchorRef.current.contains(t) &&
        popoverRef.current && !popoverRef.current.contains(t)
      ) {
        setDropdownOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDropdownOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [dropdownOpen]);

  // ---- Input change/blur handlers (draft string, commit on blur) ----
  const onChangeInt = (
    setStr: (v: string) => void,
    setNum: (n: number) => void,
    opts: { min: number; max?: number }
  ) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setStr(v);
    if (v === "" || v === "-") return; // keep last valid numeric
    const n = parseInt(v, 10);
    if (!Number.isFinite(n)) return;
    // Live-update only when within bounds; otherwise keep last valid for calc,
    // but do NOT clamp the visible draft while typing.
    if (n < opts.min) return;
    if (opts.max !== undefined && n > opts.max) return;
    setNum(n);
  };

  const onBlurInt = (
    str: string,
    setStr: (v: string) => void,
    setNum: (n: number) => void,
    opts: { min: number; max?: number; emptyFallback: number }
  ) => () => {
    let n: number;
    if (str.trim() === "") {
      n = opts.emptyFallback;
    } else {
      const parsed = parseInt(str, 10);
      n = Number.isFinite(parsed) ? parsed : opts.emptyFallback;
    }
    n = Math.max(opts.min, n);
    if (opts.max !== undefined) n = Math.min(opts.max, n);
    setNum(n);
    setStr(String(n));
    scrollToResults();
  };

  const onChangeRate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    // allow digits, one comma or dot
    if (!/^[\d]*[.,]?[\d]*$/.test(v)) return;
    setOwnRateStr(v);
    if (v === "" || v === "," || v === ".") return;
    const n = parseFloat(v.replace(",", "."));
    if (!Number.isFinite(n)) return;
    if (n < 0 || n > 30) return;
    setOwnRate(n);
  };
  const onBlurRate = () => {
    let n: number;
    if (ownRateStr.trim() === "" || ownRateStr === "," || ownRateStr === ".") {
      n = 0;
    } else {
      const parsed = parseFloat(ownRateStr.replace(",", "."));
      n = Number.isFinite(parsed) ? parsed : 0;
    }
    n = Math.max(0, Math.min(30, n));
    setOwnRate(n);
    setOwnRateStr(fmtPct(n));
    scrollToResults();
  };

  // Active portfolio (if any) — only the custom builder uses an allocation
  const activeAlloc: Alloc | null = useMemo(() => {
    if (mode === "custom") return customApplied;
    return null;
  }, [mode, customApplied]);

  const portfolio = useMemo(() => (activeAlloc ? computePortfolio(activeAlloc) : null), [activeAlloc]);

  /** ISIN der gewaehlten gepruefen Anlage, nur im Modus "anlage" benutzt. */
  const [anlageIsin, setAnlageIsin] = useState<string>(anlagenOptionen[0]?.isin ?? "");
  const gewaehlteAnlage = anlagenOptionen.find((a) => a.isin === anlageIsin);

  const annual = useMemo(() => {
    if (mode === "own") return ownRate / 100;
    if (mode === "custom") return portfolio?.ret ?? 0;
    if (mode === "anlage") return gewaehlteAnlage?.proJahr ?? 0;
    return PRESETS[mode].ret;
  }, [mode, ownRate, portfolio, gewaehlteAnlage]);

  const { data, totalContributed, finalValue, estimatedProfit, yMax } = useMemo(() => {
    const monthlyRate = annual === 0 ? 0 : Math.pow(1 + annual, 1 / 12) - 1;
    let value = startCapital;
    const points: { year: number; Portfoliowert: number; Eingezahlt: number }[] = [
      { year: 0, Portfoliowert: Math.round(startCapital), Eingezahlt: Math.round(startCapital) },
    ];
    for (let y = 1; y <= years; y++) {
      for (let m = 0; m < 12; m++) {
        value = monthlyRate === 0 ? value + monthly : value * (1 + monthlyRate) + monthly;
      }
      points.push({
        year: y,
        Portfoliowert: Math.round(value),
        Eingezahlt: Math.round(startCapital + monthly * 12 * y),
      });
    }
    const totalContributed = startCapital + monthly * 12 * years;
    const peak = Math.max(value, totalContributed, 1);
    const yMax = niceCeil(peak * 1.1);
    return {
      data: points,
      totalContributed,
      finalValue: value,
      estimatedProfit: value - totalContributed,
      yMax,
    };
  }, [startCapital, monthly, years, annual]);

  const selectAnlage = (isin: string) => {
    setAnlageIsin(isin);
    setMode("anlage");
    setDropdownOpen(false);
    setBuilderOpen(false);
    scrollToResults();
  };

  const selectPreset = (p: PresetKey) => {
    setMode(p);
    setDropdownOpen(false);
    setBuilderOpen(false);
    scrollToResults();
  };
  const selectOwn = () => {
    setMode("own");
    setDropdownOpen(false);
    setBuilderOpen(false);
    scrollToResults();
  };
  const openBuilder = () => {
    setDropdownOpen(false);
    if (activeAlloc) setCustomAlloc(activeAlloc);
    setBuilderOpen(true);
  };
  const applyCustom = () => {
    setCustomApplied({ ...customAlloc });
    setMode("custom");
    setBuilderOpen(false);
    scrollToResults();
  };
  const cancelCustom = () => {
    setBuilderOpen(false);
  };

  const returnDisplay =
    mode === "own"
      ? `${fmtPct(ownRate)}% p.a. – Eigene Rendite`
      : mode === "custom"
      ? `≈ ${fmtPct((portfolio?.ret ?? 0) * 100)}% p.a.`
      : mode === "anlage"
      ? `${fmtPct((gewaehlteAnlage?.proJahr ?? 0) * 100)}% p.a. – ${gewaehlteAnlage?.name ?? ""}`
      : PRESETS[mode].label;

  let summary: { title: string; desc?: string } | null = null;
  if (mode === "custom" && customApplied) {
    const parts = ASSETS.filter((a) => customApplied[a.key] > 0)
      .map((a) => `${customApplied[a.key]}% ${a.label.replace("Halal-Aktien & ETFs", "Aktien/ETFs")}`)
      .join(", ");
    summary = { title: `Eigenes Portfolio · ≈ ${fmtPct((portfolio?.ret ?? 0) * 100)}% p.a.`, desc: parts };
  } else if (mode === "anlage" && gewaehlteAnlage) {
    summary = {
      title: `${gewaehlteAnlage.name} · ${fmtPct(gewaehlteAnlage.proJahr * 100)}% p.a.`,
      desc: `Rendite der letzten fünf Jahre, Stand ${kursStand}. Das ist keine Vorhersage.`,
    };
  } else if (mode !== "own") {
    summary = { title: PRESETS[mode].label };
  }

  const inputCls =
    "w-full rounded-2xl border border-border/70 bg-white px-4 py-3 text-base font-semibold text-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all";

  const builderTotal = ASSETS.reduce((s, a) => s + customAlloc[a.key], 0);
  const builderPortfolio = useMemo(() => computePortfolio(customAlloc), [customAlloc]);

  return (
    <section
      id="rechner"
      className="bg-gradient-to-b from-surface via-surface to-background md:-mt-7 pt-10 md:pt-0 pb-2 md:pb-3"
    >
      <div className="container max-w-6xl">
        {showHeader && (
          <div className="reveal text-center mb-6 md:mb-3">
            <span className="inline-flex items-center gap-3 text-[12px] font-semibold tracking-wide text-primary">
              <span className="h-px w-6 bg-primary" aria-hidden /> Renditerechner
            </span>
            <h2 className="headline text-3xl md:text-4xl mt-3 md:mt-1 leading-[1.05]">
              Dein Vermögensaufbau auf einen Blick
            </h2>
            <p className="mt-2 md:mt-1 text-muted-foreground max-w-2xl mx-auto leading-relaxed text-[14px] md:text-[15px]">
              Simuliere dein Halal-Portfolio in wenigen Sekunden.
            </p>
          </div>
        )}

        {/* Compact input row */}
        <div ref={inputCardRef} className="reveal rounded-[1.5rem] bg-card border border-border/70 p-4 md:p-5 shadow-[0_20px_50px_-30px_rgba(80,60,20,0.25)] scroll-mt-20">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {/* Einmalige Einzahlung */}
            <div>
              <label className="block text-xs font-semibold text-foreground/70 mb-1.5">Einmalige Einzahlung</label>
              <div className="relative">
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  step={1}
                  value={startCapitalStr}
                  onChange={onChangeInt(setStartCapitalStr, setStartCapital, { min: 0 })}
                  onBlur={onBlurInt(startCapitalStr, setStartCapitalStr, setStartCapital, { min: 0, emptyFallback: 0 })}
                  onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
                  className={inputCls + " pr-9"}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium pointer-events-none">€</span>
              </div>
            </div>

            {/* Regelmäßige Einzahlung */}
            <div>
              <label className="block text-xs font-semibold text-foreground/70 mb-1.5">Regelmäßige Einzahlung / Monat</label>
              <div className="relative">
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  step={1}
                  value={monthlyStr}
                  onChange={onChangeInt(setMonthlyStr, setMonthly, { min: 0 })}
                  onBlur={onBlurInt(monthlyStr, setMonthlyStr, setMonthly, { min: 0, emptyFallback: 0 })}
                  onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
                  className={inputCls + " pr-9"}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium pointer-events-none">€</span>
              </div>
            </div>

            {/* Anlagezeitraum */}
            <div>
              <label className="block text-xs font-semibold text-foreground/70 mb-1.5">Anlagezeitraum</label>
              <div className="relative">
                <input
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={50}
                  step={1}
                  value={yearsStr}
                  onChange={onChangeInt(setYearsStr, setYears, { min: 1, max: 50 })}
                  onBlur={onBlurInt(yearsStr, setYearsStr, setYears, { min: 1, max: 50, emptyFallback: 1 })}
                  onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
                  className={inputCls + " pr-14"}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-medium pointer-events-none">Jahre</span>
              </div>
            </div>

            {/* Geschätzte Rendite */}
            <div ref={anchorRef} className="relative">
              <label className="block text-xs font-semibold text-foreground/70 mb-1.5">Geschätzte Rendite</label>
              <div className="relative">
                {mode === "own" ? (
                  <input
                    type="text"
                    inputMode="decimal"
                    value={ownRateStr}
                    onChange={onChangeRate}
                    onBlur={onBlurRate}
                    onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
                    className={inputCls + " pr-20"}
                  />
                ) : (
                  <div className={inputCls + " pr-20 cursor-default select-none flex items-center"}>{returnDisplay}</div>
                )}
                <span className="absolute right-11 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-medium pointer-events-none">
                  {mode === "own" ? "% p.a." : ""}
                </span>
                <button
                  type="button"
                  aria-label="Rendite-Optionen"
                  aria-expanded={dropdownOpen}
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full border border-border bg-white text-foreground hover:border-primary/40 hover:text-primary transition flex items-center justify-center"
                >
                  <ChevronDown className={`h-4 w-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} aria-hidden />
                </button>
              </div>
            </div>
          </div>

          {/* Highlighted CTA: eigenes Portfolio bauen (4 Asset-Farben + einmaliger Gold-Shine) */}
          {!builderOpen && (
            <button
              type="button"
              onClick={openBuilder}
              className="group relative mt-3 w-full overflow-hidden rounded-lg border border-primary/60 bg-white px-5 py-3 flex items-center gap-3 text-left transition-all hover:border-primary hover:-translate-y-[1px] hover:shadow-[0_10px_30px_-12px_hsl(var(--primary)/0.55)] focus-visible:border-primary"
              aria-label={mode === "custom" ? "Eigenes Portfolio bearbeiten" : "Eigenes Portfolio bauen"}
            >
              <span className="flex items-center gap-1.5 shrink-0" aria-hidden>
                {ASSETS.map((a) => (
                  <span
                    key={a.key}
                    className="h-2.5 w-2.5 rounded-full ring-1 ring-black/5"
                    style={{ backgroundColor: a.color }}
                  />
                ))}
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-sm font-bold text-foreground leading-tight">
                  {mode === "custom" ? "Eigenes Portfolio bearbeiten" : "Eigenes Portfolio bauen"}
                </span>
                <span className="block text-[11px] text-muted-foreground leading-tight mt-0.5">
                  ETFs, Sukuk, Gold und Silber. Anteile selbst festlegen
                </span>
              </span>
              <ArrowRight className="h-4 w-4 text-primary shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden />
              {mode !== "custom" && (
                <span className="card-shine card-shine-enter" aria-hidden />
              )}
            </button>
          )}

          {/* Summary line */}
          {summary && !builderOpen && (
            <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-[13px]">
              <span className="font-semibold text-foreground">{summary.title}</span>
              <span className="text-muted-foreground">· {summary.desc}</span>
              <button
                type="button"
                onClick={openBuilder}
                className="ml-auto text-[12px] font-semibold text-primary hover:text-primary/80 underline underline-offset-2"
              >
                {mode === "custom" ? "Bearbeiten" : "Details"}
              </button>
            </div>
          )}

          {/* Custom portfolio builder */}
          {builderOpen && (
            <div className="mt-4 rounded-2xl border border-border/70 bg-white p-4 md:p-5">
              <div className="flex items-baseline justify-between mb-3">
                <h4 className="text-sm font-bold text-foreground">Eigenes Portfolio</h4>
                <span className="text-[11px] text-muted-foreground">Summe: {builderTotal}%</span>
              </div>

              <div
                className="h-6 w-full rounded-full overflow-hidden flex border border-border/60"
                role="img"
                aria-label="Portfolio Aufteilung"
              >
                {ASSETS.map((a) => {
                  const pct = customAlloc[a.key];
                  if (pct === 0) return null;
                  return (
                    <div
                      key={a.key}
                      className="h-full flex items-center justify-center text-[10px] font-semibold text-white transition-[width] duration-300 ease-out"
                      style={{ width: `${pct}%`, backgroundColor: a.color }}
                      title={`${a.label}: ${pct}%`}
                    >
                      {pct >= 10 ? `${pct}%` : ""}
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 space-y-3">
                {ASSETS.map((a) => (
                  <div key={a.key}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="inline-block h-3 w-3 rounded-sm shrink-0" style={{ backgroundColor: a.color }} aria-hidden />
                        <span className="text-sm font-semibold text-foreground truncate">{a.label}</span>
                        <span className="text-[11px] text-muted-foreground whitespace-nowrap hidden sm:inline">
                          ≈ {Math.round(a.ret * 100)}% · Vol. ≈ {Math.round(a.vol * 100)}%
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          step={1}
                          aria-label={`${a.label} Anteil in Prozent`}
                          value={customAlloc[a.key]}
                          onChange={(e) => {
                            const raw = parseInt(e.target.value, 10);
                            const v = Number.isFinite(raw) ? Math.max(0, Math.min(100, raw)) : 0;
                            setCustomAlloc((prev) => ({ ...prev, [a.key]: v }));
                          }}
                          className="w-16 rounded-lg border border-border/70 bg-white px-2 py-1 text-[16px] font-semibold text-right focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                        <span className="text-xs text-muted-foreground">%</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={5}
                      aria-label={`${a.label} Slider`}
                      value={customAlloc[a.key]}
                      onChange={(e) => {
                        const v = Math.max(0, Math.min(100, Number(e.target.value) || 0));
                        setCustomAlloc((prev) => ({ ...prev, [a.key]: v }));
                      }}
                      className="w-full"
                      style={{ accentColor: a.color }}
                    />
                  </div>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3 text-[12px]">
                <div className="rounded-xl bg-surface border border-border/50 px-3 py-2">
                  <div className="text-muted-foreground">Portfoliorendite</div>
                  <div className="text-sm font-bold text-primary">≈ {fmtPct(builderPortfolio.ret * 100)}% p.a.</div>
                </div>
                <div className="rounded-xl bg-surface border border-border/50 px-3 py-2">
                  <div className="text-muted-foreground">Volatilität</div>
                  <div className="text-sm font-bold text-foreground">≈ {fmtPct(builderPortfolio.vol * 100)}% p.a.</div>
                </div>
                <div
                  className={`rounded-xl border px-3 py-2 ${
                    builderTotal === 100
                      ? "bg-primary/5 border-primary/30"
                      : "bg-surface border-border/50"
                  }`}
                  aria-live="polite"
                >
                  <div className="text-muted-foreground">Gesamt</div>
                  <div
                    className={`text-sm font-bold ${
                      builderTotal === 100
                        ? "text-primary"
                        : builderTotal > 100
                        ? "text-destructive"
                        : "text-foreground"
                    }`}
                  >
                    {builderTotal}%
                    {builderTotal < 100 && (
                      <span className="ml-1 font-medium text-muted-foreground">· Noch {100 - builderTotal} % verteilen</span>
                    )}
                    {builderTotal > 100 && (
                      <span className="ml-1 font-medium text-destructive">· {builderTotal - 100} % zu viel</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2 justify-end">
                <button
                  type="button"
                  onClick={cancelCustom}
                  className="rounded-lg border border-border bg-white px-4 py-2 text-xs font-semibold text-foreground hover:border-primary/40 hover:text-primary transition"
                >
                  Abbrechen
                </button>
                <button
                  type="button"
                  onClick={applyCustom}
                  disabled={builderTotal !== 100}
                  aria-disabled={builderTotal !== 100}
                  className="rounded-lg bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-glow transition shadow-[0_10px_25px_-12px_hsl(var(--primary)/0.6)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary"
                >
                  Übernehmen
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Chart + results */}
        <div className="mt-3 md:mt-4 grid grid-cols-1 lg:grid-cols-[minmax(0,3fr)_minmax(0,1fr)] gap-5">
          <div ref={chartCardRef} className="reveal rounded-[1.5rem] bg-card border border-border/70 p-4 md:p-6 shadow-[0_20px_50px_-30px_rgba(80,60,20,0.25)]">
            {/* Handy: Zeitraum unter die Ueberschrift, sonst stossen beide zusammen. */}
            <div className="mb-2 flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
              <h3 className="headline text-lg md:text-xl">Portfolioentwicklung</h3>
              <span className="text-xs text-muted-foreground">
                über {years} {years === 1 ? "Jahr" : "Jahre"} · {mode === "own" ? `${fmtPct(ownRate)}% p.a.` : `≈ ${fmtPct(annual * 100)}% p.a.`}
              </span>
            </div>

            <div className="h-[320px] md:h-[400px] -ml-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="goldFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.22} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis
                    dataKey="year"
                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, yMax]}
                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) =>
                      v >= 1_000_000 ? `${(v / 1_000_000).toLocaleString("de-DE", { maximumFractionDigits: 1 })}M`
                      : v >= 1000 ? `${Math.round(v / 1000)}K`
                      : `${v}`
                    }
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 14,
                      border: "1px solid hsl(var(--border))",
                      boxShadow: "0 20px 40px -20px rgba(0,0,0,0.15)",
                      fontSize: 13,
                    }}
                    formatter={(v: number, name) => [formatEuro(v), name as string]}
                    labelFormatter={(l) => `Jahr ${l}`}
                  />
                  <Legend verticalAlign="top" height={28} iconType="plainline" wrapperStyle={{ fontSize: 12 }} />
                  <Area
                    type="monotone"
                    dataKey="Eingezahlt"
                    stroke="hsl(var(--muted-foreground))"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    fill="transparent"
                    dot={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="Portfoliowert"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    fill="url(#goldFill)"
                    dot={false}
                    activeDot={{ r: 5, fill: "hsl(var(--primary))", stroke: "white", strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="reveal rounded-[1.5rem] bg-card border border-border/70 p-5 md:p-6 shadow-[0_20px_50px_-30px_rgba(80,60,20,0.25)] flex flex-col">
            <div>
              <div className="text-[11px] font-semibold tracking-wide text-muted-foreground">
                Geschätzter Portfoliowert
              </div>
              <div className="mt-1 text-3xl md:text-[32px] font-extrabold text-foreground leading-tight">
                {formatEuro(finalValue)}
              </div>
            </div>

            <div className="mt-5 space-y-3 text-sm">
              <div className="flex items-center justify-between border-t border-border/50 pt-3">
                <span className="text-muted-foreground">Gesamt eingezahlt</span>
                <span className="font-bold text-foreground">{formatEuro(totalContributed)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-border/50 pt-3">
                <span className="text-muted-foreground">Geschätzter Gewinn</span>
                <span className="font-bold text-primary">+{formatEuro(estimatedProfit)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-border/50 pt-3">
                <span className="text-muted-foreground">Verwendete Rendite</span>
                <span className="font-bold text-foreground">
                  {mode === "own" ? `${fmtPct(ownRate)}% p.a.` : `≈ ${fmtPct(annual * 100)}% p.a.`}
                </span>
              </div>
              <div className="flex items-start justify-between gap-3 border-t border-border/50 pt-3">
                <span className="text-muted-foreground">Geschätzte Volatilität</span>
                <span className="font-bold text-foreground text-right">
                  {!portfolio
                    ? <span className="text-[12px] text-muted-foreground font-medium">Nicht berechenbar bei fester Renditeannahme</span>
                    : `≈ ${fmtPct((portfolio.vol ?? 0) * 100)}% p.a.`}
                </span>
              </div>
            </div>

            <div className="mt-5">
              <button
                type="button"
                onClick={() => setMethodOpen((v) => !v)}
                aria-expanded={methodOpen}
                className="text-[12px] font-semibold text-primary hover:text-primary/80 underline underline-offset-2"
              >
                {methodOpen ? "Methodik & Annahmen ausblenden" : "Methodik & Annahmen"}
              </button>
              {methodOpen && (
                <div className="mt-2 text-[12px] text-muted-foreground leading-relaxed space-y-2">
                  <p>Renditewerte je Anlageklasse: Halal-Aktien & ETFs ≈ 8%, Sukuk ≈ 3%, Gold ≈ 6%, Silber ≈ 5%.</p>
                  <p>Volatilitäten: Aktien/ETFs ≈ 15%, Sukuk ≈ 5%, Gold ≈ 15%, Silber ≈ 30%.</p>
                  <p>Portfoliorendite = gewichteter Durchschnitt der Allokationen. Volatilität kovarianzbasiert mit vereinfachter Korrelationsmatrix.</p>
                  <p>Alle Werte sind langfristige Annahmen, keine Prognosen.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CTA below results — brand green next-step card */}
        <div className="reveal mt-4 md:mt-5 rounded-2xl bg-primary p-4 md:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="text-base md:text-lg font-bold text-white leading-snug">
                Du willst aus deiner Rechnung Realität machen?
              </h3>
              <p className="mt-1 text-[13px] md:text-sm text-white/80 leading-relaxed">
                Vergleiche die Depots, bei denen kein Zinsgeschäft mitläuft.
              </p>
            </div>
            <Link
              to="/vergleich/depot"
              className="inline-flex items-center justify-center rounded-lg bg-white text-foreground hover:bg-white/90 px-5 py-2 font-semibold text-[13px] transition whitespace-nowrap self-start sm:self-auto"
            >
              Zum Depot-Vergleich →
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-[12px] md:text-[13px] text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Die dargestellten Renditen und Volatilitäten sind vereinfachte, unverbindliche Langfristannahmen und keine Prognosen.
          Tatsächliche Ergebnisse können deutlich abweichen und Verluste sind möglich. Gebühren, Steuern, Inflation, Produktkosten
          und Währungseffekte sind nicht berücksichtigt. Die Berechnung dient ausschließlich Bildungszwecken und stellt keine Anlageberatung dar.
        </p>
      </div>

      {/* Portaled dropdown — floats above chart & results */}
      {dropdownOpen && anchorRect && typeof document !== "undefined" && createPortal(
        <div
          ref={popoverRef}
          style={{
            position: "fixed",
            top: Math.round(anchorRect.bottom + 8),
            left: Math.round(anchorRect.left),
            width: Math.max(280, Math.round(anchorRect.width)),
            maxWidth: "calc(100vw - 16px)",
            zIndex: 1000,
          }}
          className="max-h-[min(70vh,560px)] overflow-y-auto rounded-2xl border border-border/70 bg-white shadow-[0_20px_50px_-15px_rgba(0,0,0,0.25)]"
          role="listbox"
        >
          <button
            type="button"
            onClick={selectOwn}
            className={`w-full text-left px-4 py-3 text-sm hover:bg-primary/5 transition ${mode === "own" ? "bg-primary/5" : ""}`}
          >
            <div className="font-semibold text-foreground">Eigene Rendite</div>
            <div className="text-[11px] text-muted-foreground">Eigene jährliche Renditeannahme eintragen</div>
          </button>
          {(Object.keys(PRESETS) as PresetKey[]).map((k) => {
            const p = PRESETS[k];
            return (
              <button
                key={k}
                type="button"
                onClick={() => selectPreset(k)}
                className={`w-full text-left px-4 py-3 text-sm border-t border-border/50 hover:bg-primary/5 transition ${mode === k ? "bg-primary/5" : ""}`}
              >
                <div className="font-semibold text-foreground">{p.label}</div>
                <div className="text-[11px] text-muted-foreground">Langfristige Renditeannahme</div>
              </button>
            );
          })}
          {anlagenOptionen.length > 0 && (
            <>
              <div className="border-t border-border/50 bg-surface px-4 py-2">
                <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                  Geprüfte Anlagen
                </p>
                <p className="text-[11px] leading-snug text-muted-foreground">
                  Rendite der letzten fünf Jahre, Stand {kursStand}. Keine Vorhersage.
                </p>
              </div>
              {anlagenOptionen.map((a) => (
                <button
                  key={a.isin}
                  type="button"
                  onClick={() => selectAnlage(a.isin)}
                  className={`w-full border-t border-border/50 px-4 py-3 text-left text-sm transition hover:bg-primary/5 ${
                    mode === "anlage" && anlageIsin === a.isin ? "bg-primary/5" : ""
                  }`}
                >
                  <div className="font-semibold text-foreground">{a.name}</div>
                  <div className="text-[11px] text-muted-foreground">
                    {fmtPct(a.proJahr * 100)} % pro Jahr in den letzten fünf Jahren
                  </div>
                </button>
              ))}
            </>
          )}
          <button
            type="button"
            onClick={openBuilder}
            className={`w-full text-left px-4 py-3 text-sm border-t border-primary/40 bg-primary/10/40 hover:bg-primary/10/70 transition ${mode === "custom" ? "bg-primary/10/70" : ""}`}
          >
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1" aria-hidden>
                {ASSETS.map((a) => (
                  <span
                    key={a.key}
                    className="h-2 w-2 rounded-full ring-1 ring-black/5"
                    style={{ backgroundColor: a.color }}
                  />
                ))}
              </span>
              <span className="font-semibold text-foreground">Eigenes Portfolio erstellen</span>
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5">Anteile individuell festlegen</div>
          </button>
        </div>,
        document.body
      )}
    </section>
  );
};

export default ReturnCalculator;
