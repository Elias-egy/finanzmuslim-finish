import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import ZeitraumSchalter from "@/components/ZeitraumSchalter";
import {
  chartZeitraeume,
  istEigenerZeitraum,
  spanneVeraenderung,
  zeitraumReihe,
  type Kurs,
  type ZeitraumWert,
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

/** Achsenbeschriftung. Bei kurzen Zeitraeumen Tag und Monat, sonst Monat und
 *  Jahr. Ein Monat mit zweimal "08/26" auf der Achse sagt nichts. */
const datumKurz = (s: string, tagesTakt: boolean) => {
  const [j, m, t] = s.split("-");
  if (tagesTakt && t) return `${t}.${m}.`;
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
  /* Nachkommastellen aus dem Achsenschritt, nicht aus dem Kurswert. Bei
     einem Fonds um 60 Euro, der sich an einem Tag nur um Cent bewegt, wäre
     die Achse sonst dreimal "60" — richtig ist, so viele Nachkommastellen zu
     zeigen, wie der Schritt selbst braucht. Ein glatter Schritt wie 5 oder 10
     bleibt ohne Komma, das ist der weit häufigere Fall. */
  const nachkommastellen = Number.isInteger(schritt) ? 0 : schritt < 1 ? 2 : 1;
  return { start, ende, ticks, nachkommastellen };
};

const prozent = (w: number) =>
  `${w > 0 ? "+" : w < 0 ? "−" : ""}${Math.abs(w).toFixed(1).replace(".", ",")} %`;

const AnlageKurschart = ({ kurs, id, quelle, stand }: Props) => {
  const [zeitraum, setZeitraum] = useState<ZeitraumWert>("1j");
  const [aktiv, setAktiv] = useState<number | null>(null);

  const ausschnitt = useMemo(() => zeitraumReihe(kurs, zeitraum), [kurs, zeitraum]);
  const reihe = ausschnitt.reihe;
  const veraenderungGesamt = spanneVeraenderung(reihe);
  const waehrung = kurs?.waehrung ?? "EUR";
  /* Tag-und-Monat auf der Achse, wenn genug Platz zwischen den Punkten ist:
     bei Tagesschlusskursen bis zu rund hundert Punkten, ob aus einem festen
     Tab oder einem kurzen selbst gewählten Zeitraum. Darüber, etwa bei "1J"
     mit rund 250 Punkten, stünde sonst zehnmal derselbe Monat auf der Achse. */
  const kurzerZeitraum = ausschnitt.takt === "Tagesschlusskurse" && reihe.length <= 100;

  if (!kurs || kurs.status) {
    return (
      <div className="rounded-xl bg-accent px-4 py-6 text-[15px] leading-[24px] text-muted-foreground">
        Für diese Anlage liegen noch keine Kursdaten vor. Meist ist sie erst seit kurzem am Markt.
      </div>
    );
  }

  const daten = reihe.map(([datum, wert]) => ({ datum, wert }));
  const letzterIndex = daten.length - 1;
  /* Beim Swipen/Hovern zeigt der Kopf den Wert am Finger- bzw. Mauszeiger,
     nicht den letzten Kurs. Ohne Interaktion (aktiv === null) bleibt es beim
     letzten Punkt, das ist der Ruhezustand. */
  const index = aktiv !== null && aktiv >= 0 && aktiv <= letzterIndex ? aktiv : letzterIndex;
  const punkt = index >= 0 ? daten[index] : undefined;
  const wirdGescrubbt = aktiv !== null && index !== letzterIndex;
  /* Rendite immer vom Anfang des gewählten Zeitraums bis zum gerade
     angezeigten Punkt, nicht bis zum Ende — sonst würde sich die Prozentzahl
     beim Swipen nicht mitbewegen, obwohl der Wert es tut. */
  const veraenderungBisPunkt = index >= 0 ? spanneVeraenderung(reihe.slice(0, index + 1)) : null;

  /* Kopf und Zeitraumfilter stehen immer, auch wenn der gewählte Zeitraum
     keine Daten hergibt. Sonst müsste man erst einen anderen Zeitraum raten,
     um zurück zu einem zu kommen, der etwas zeigt. */
  const kopf = (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        {reihe.length >= 2 && punkt ? (
          <>
            <p className="text-[28px] font-bold leading-tight text-foreground md:text-[34px]">
              {betrag(punkt.wert, waehrung)}
            </p>
            <p className="mt-1 flex flex-wrap items-center gap-2 text-[14px] text-muted-foreground">
              <span>{datumLang(punkt.datum)}</span>
              {veraenderungBisPunkt !== null && (
                <span className="font-semibold text-foreground">
                  {prozent(veraenderungBisPunkt)}{" "}
                  {wirdGescrubbt
                    ? `seit ${datumLang(reihe[0][0])}`
                    : istEigenerZeitraum(zeitraum)
                      ? `vom ${datumLang(reihe[0][0])}`
                      : `in ${chartZeitraeume.find((z) => z.key === zeitraum)?.lang ?? "einem Jahr"}`}
                </span>
              )}
            </p>
          </>
        ) : (
          <p className="text-[15px] text-muted-foreground">Für diesen Zeitraum liegen keine Kursdaten vor.</p>
        )}
      </div>

      <ZeitraumSchalter wert={zeitraum} onChange={setZeitraum} />
    </div>
  );

  if (reihe.length < 2) {
    return (
      <div>
        {kopf}
        <div className="mt-5 rounded-xl bg-accent px-4 py-6 text-[15px] leading-[24px] text-muted-foreground">
          {istEigenerZeitraum(zeitraum)
            ? "Im gewählten Von-bis-Zeitraum liegt kein Kurs vor. Versuch einen anderen Zeitraum."
            : "Für diesen Zeitraum reicht die Kurshistorie dieser Anlage noch nicht zurück. Wähl einen kürzeren Zeitraum oder einen eigenen Von-bis-Zeitraum."}
        </div>
      </div>
    );
  }

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

  const spanneLang = istEigenerZeitraum(zeitraum)
    ? `vom ${datumLang(reihe[0][0])} bis ${datumLang(reihe[reihe.length - 1][0])}`
    : `in ${chartZeitraeume.find((z) => z.key === zeitraum)?.lang ?? "einem Jahr"}`;

  return (
    <div style={{ touchAction: "pan-y" }}>
      {kopf}

      {!ausschnitt.vollstaendig && istEigenerZeitraum(zeitraum) && (
        <p className="mt-2 text-[13px] text-muted-foreground">
          Kursdaten liegen erst ab {datumLang(reihe[0][0])} vor, davor zeigt die Grafik nichts.
        </p>
      )}

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
              tickFormatter={(w: string) => datumKurz(w, kurzerZeitraum)}
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
                  minimumFractionDigits: skala.nachkommastellen,
                  maximumFractionDigits: skala.nachkommastellen,
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
        Kursverlauf {spanneLang}. Von {betrag(daten[0].wert, waehrung)} am{" "}
        {datumLang(daten[0].datum)} auf {betrag(daten[daten.length - 1].wert, waehrung)} am{" "}
        {datumLang(daten[daten.length - 1].datum)}
        {veraenderungGesamt !== null ? `, eine Veränderung von ${prozent(veraenderungGesamt)}` : ""}.
      </p>

      <p className="mt-4 text-[13px] leading-[20px] text-muted-foreground">
        Quelle: {quelle} · {ausschnitt.takt} · Währung:{" "}
        {waehrung} · Stand: {stand}
      </p>
    </div>
  );
};

export default AnlageKurschart;
