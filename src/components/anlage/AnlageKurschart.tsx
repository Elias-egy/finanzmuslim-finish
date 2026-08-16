import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
  chartZeitraeume,
  spanneVeraenderung,
  wochenAusschnitt,
  type ChartZeitraum,
  type Kurs,
} from "@/lib/kurse";

/**
 * Kursverlauf einer Anlage.
 *
 * Grafikbibliothek ist recharts. Die Master-Spezifikation schlägt ECharts vor,
 * im Projekt gilt aber die feste Regel: keine zweite Grafikbibliothek. recharts
 * kann Fläche, Fadenkreuz, Tooltip und Achsen, das reicht hier vollständig.
 *
 * Bewusst kein Nullpunkt auf der Y-Achse: bei einem Kurs, der zwischen 55 und
 * 61 Euro läuft, wäre die Linie sonst ein waagerechter Strich.
 */

type Props = {
  kurs: Kurs | undefined;
  id: string;
  /** Zeigt zusätzlich einen Hinweis, dass es Wochenschlusskurse sind. */
  quelle: string;
  stand: string;
};

const monatsNamen = [
  "Jan.", "Feb.", "März", "April", "Mai", "Juni",
  "Juli", "Aug.", "Sept.", "Okt.", "Nov.", "Dez.",
];

/** "2026-08-10" oder "2026-08" lesbar machen. */
const datumLang = (s: string) => {
  const [j, m, t] = s.split("-");
  const monat = monatsNamen[Number(m) - 1] ?? m;
  return t ? `${Number(t)}. ${monat} ${j}` : `${monat} ${j}`;
};

const datumKurz = (s: string) => {
  const [j, m] = s.split("-");
  return `${m}/${j.slice(2)}`;
};

const betrag = (wert: number, waehrung = "EUR") =>
  new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: waehrung,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(wert);

/** Runde Achsenschritte: 1, 2, 2.5, 5, 10 mal Zehnerpotenz. */
const achsenSkala = (unten: number, oben: number, ziel = 5) => {
  const spanne = oben - unten || 1;
  const roh = spanne / (ziel - 1);
  const potenz = 10 ** Math.floor(Math.log10(roh));
  const schritt = [1, 2, 2.5, 5, 10].map((f) => f * potenz).find((s) => s >= roh) ?? 10 * potenz;
  const start = Math.floor(unten / schritt) * schritt;
  const ende = Math.ceil(oben / schritt) * schritt;
  const ticks: number[] = [];
  for (let w = start; w <= ende + schritt / 1000; w += schritt) {
    ticks.push(Math.round(w * 1000) / 1000);
  }
  return { start, ende, ticks };
};

const prozent = (w: number) =>
  `${w > 0 ? "+" : w < 0 ? "−" : ""}${Math.abs(w).toFixed(1).replace(".", ",")} %`;

const AnlageKurschart = ({ kurs, id, quelle, stand }: Props) => {
  const [zeitraum, setZeitraum] = useState<ChartZeitraum>("1j");
  const [aktiv, setAktiv] = useState<number | null>(null);

  const reihe = useMemo(() => wochenAusschnitt(kurs, zeitraum), [kurs, zeitraum]);
  const veraenderung = spanneVeraenderung(reihe);
  const waehrung = kurs?.waehrung ?? "EUR";
  const wochentakt = (kurs?.reihe_w?.length ?? 0) >= 3;

  if (!kurs || kurs.status || reihe.length < 2) {
    return (
      <div className="rounded-xl bg-accent px-4 py-6 text-[15px] leading-[24px] text-muted-foreground">
        Für diese Anlage liegen noch keine Kursdaten vor. Meist ist sie erst seit kurzem am Markt.
      </div>
    );
  }

  const daten = reihe.map(([datum, wert]) => ({ datum, wert }));
  const index = aktiv !== null && aktiv >= 0 && aktiv < daten.length ? aktiv : daten.length - 1;
  const punkt = daten[index];

  const werte = daten.map((d) => d.wert);
  const min = Math.min(...werte);
  const max = Math.max(...werte);
  const puffer = (max - min || max * 0.05 || 1) * 0.12;
  /* Achsenwerte auf runde Schritte legen. Ohne das schreibt recharts die
     Randwerte der Skala hin, und dann steht dort 44, 49, 54, 62. */
  const skala = achsenSkala(min - puffer, max + puffer);

  const merken = (state: { activeTooltipIndex?: number }) => {
    if (typeof state?.activeTooltipIndex === "number") setAktiv(state.activeTooltipIndex);
  };
  const touch = { onTouchMove: merken, onTouchEnd: () => setAktiv(null) } as Record<string, unknown>;

  const spanneLang = chartZeitraeume.find((z) => z.key === zeitraum)?.lang ?? "einem Jahr";

  return (
    <div style={{ touchAction: "pan-y" }}>
      {/* Kopfzeile: Kurs, Veränderung, Zeitraum */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[28px] font-bold leading-tight text-foreground md:text-[34px]">
            {betrag(punkt.wert, waehrung)}
          </p>
          <p className="mt-1 flex flex-wrap items-center gap-2 text-[14px] text-muted-foreground">
            <span>{datumLang(punkt.datum)}</span>
            {veraenderung !== null && (
              <span className="font-semibold text-foreground">
                {prozent(veraenderung)} in {spanneLang}
              </span>
            )}
          </p>
        </div>

        {/* Zeitraumfilter. Echte Knöpfe, auf dem Handy waagerecht scrollbar. */}
        <div
          role="tablist"
          aria-label="Zeitraum"
          className="-mx-1 flex gap-1 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:px-0"
        >
          {chartZeitraeume.map((z) => (
            <button
              key={z.key}
              type="button"
              role="tab"
              aria-selected={zeitraum === z.key}
              onClick={() => {
                setZeitraum(z.key);
                setAktiv(null);
              }}
              className={`min-h-[40px] shrink-0 rounded-lg px-4 text-[14px] font-semibold transition-colors ${
                zeitraum === z.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground hover:bg-accent"
              }`}
            >
              {z.kurz}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 h-[280px] w-full md:h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={daten}
            margin={{ top: 8, right: 4, bottom: 0, left: 4 }}
            onMouseMove={merken}
            onMouseLeave={() => setAktiv(null)}
            {...touch}
          >
            <defs>
              <linearGradient id={`kurs-${id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.6} />
            <XAxis
              dataKey="datum"
              tickFormatter={datumKurz}
              minTickGap={40}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              domain={[skala.start, skala.ende]}
              ticks={skala.ticks}
              width={52}
              tickLine={false}
              axisLine={false}
              tickFormatter={(w: number) =>
                w.toLocaleString("de-DE", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: w < 20 ? 2 : 0,
                })
              }
              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip
              content={() => null}
              cursor={{ stroke: "hsl(var(--primary))", strokeWidth: 1, strokeDasharray: "4 4" }}
            />
            <Area
              type="monotone"
              dataKey="wert"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fill={`url(#kurs-${id})`}
              isAnimationActive={false}
              activeDot={{
                r: 4,
                fill: "hsl(var(--primary))",
                stroke: "hsl(var(--background))",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Zusammenfassung für Vorleseprogramme, die die Grafik nicht sehen. */}
      <p className="sr-only">
        Kursverlauf über {spanneLang}. Von {betrag(daten[0].wert, waehrung)} am{" "}
        {datumLang(daten[0].datum)} auf {betrag(daten[daten.length - 1].wert, waehrung)} am{" "}
        {datumLang(daten[daten.length - 1].datum)}
        {veraenderung !== null ? `, eine Veränderung von ${prozent(veraenderung)}` : ""}.
      </p>

      <p className="mt-4 text-[13px] leading-[20px] text-muted-foreground">
        Quelle: {quelle} · {wochentakt ? "Wochenschlusskurse" : "Monatsschlusskurse"} · Währung:{" "}
        {waehrung} · Stand: {stand}
      </p>
    </div>
  );
};

export default AnlageKurschart;
