import { useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type Props = { reihe: [string, number][]; waehrung?: string; id: string };

const monatsNamen = [
  "Januar", "Februar", "März", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Dezember",
];

const monatLang = (m: string) => {
  const [j, mm] = m.split("-");
  return `${monatsNamen[Number(mm) - 1] ?? m} ${j}`;
};

const monatKurz = (m: string) => {
  const [j, mm] = m.split("-");
  return `${mm}/${j.slice(2)}`;
};

const betrag = (wert: number, waehrung = "EUR") =>
  new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: waehrung,
    minimumFractionDigits: Math.abs(wert) >= 1000 ? 0 : 2,
    maximumFractionDigits: Math.abs(wert) >= 1000 ? 0 : 2,
  }).format(wert);

/** Kursverlauf mit echten Werten. Wert und Monat stehen über der Grafik. */
const KursChart = ({ reihe, waehrung = "EUR", id }: Props) => {
  const [aktiv, setAktiv] = useState<number | null>(null);

  if (!reihe || reihe.length < 2) {
    return (
      <div className="rounded-2xl bg-hero p-6 text-[15px] leading-relaxed text-muted-foreground">
        Für diese Anlage liegen noch keine Kursdaten vor. Sie ist erst seit kurzem am Markt.
      </div>
    );
  }

  const daten = reihe.map(([monat, wert]) => ({ monat, wert }));
  const index = aktiv !== null && aktiv >= 0 && aktiv < daten.length ? aktiv : daten.length - 1;
  const punkt = daten[index];

  const werte = daten.map((d) => d.wert);
  const min = Math.min(...werte);
  const max = Math.max(...werte);
  const puffer = (max - min || max * 0.05 || 1) * 0.12;

  const merken = (state: { activeTooltipIndex?: number }) => {
    if (typeof state?.activeTooltipIndex === "number") setAktiv(state.activeTooltipIndex);
  };

  return (
    <div style={{ touchAction: "pan-y" }}>
      <div>
        <div className="text-2xl font-bold leading-tight text-foreground md:text-3xl">
          {betrag(punkt.wert, waehrung)}
        </div>
        <div className="mt-1 text-[13px] text-muted-foreground">{monatLang(punkt.monat)}</div>
      </div>

      <div className="mt-4 h-[200px] w-full md:h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={daten}
            margin={{ top: 8, right: 4, bottom: 0, left: 4 }}
            onMouseMove={merken}
            onTouchMove={merken}
            onMouseLeave={() => setAktiv(null)}
            onTouchEnd={() => setAktiv(null)}
          >
            <defs>
              <linearGradient id={`verlauf-${id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.18" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.6} />
            <XAxis
              dataKey="monat"
              tickFormatter={monatKurz}
              minTickGap={28}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis domain={[min - puffer, max + puffer]} hide />
            <Tooltip
              content={() => null}
              cursor={{ stroke: "hsl(var(--primary))", strokeWidth: 1, strokeDasharray: "4 4" }}
            />
            <Area
              type="monotone"
              dataKey="wert"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fill={`url(#verlauf-${id})`}
              isAnimationActive={false}
              activeDot={{ r: 4, fill: "hsl(var(--primary))", stroke: "hsl(var(--background))", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default KursChart;
