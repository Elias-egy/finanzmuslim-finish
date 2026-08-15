/** Flächenchart aus dem Verlauf-Array. Reines SVG, keine Bibliothek. */
const KursChart = ({ werte, id }: { werte: number[]; id: string }) => {
  if (werte.length < 2) {
    return (
      <div className="rounded-2xl bg-hero p-6 text-[15px] leading-relaxed text-muted-foreground">
        Für diese Anlage liegen noch keine Kursdaten vor. Sie ist erst seit kurzem am Markt.
      </div>
    );
  }
  const w = 1000;
  const h = 260;
  const min = Math.min(...werte);
  const max = Math.max(...werte);
  const spanne = max - min || 1;
  const punkte = werte.map((v, i) => {
    const x = (i / (werte.length - 1)) * w;
    const y = h - ((v - min) / spanne) * (h - 24) - 12;
    return [x, y] as const;
  });
  const linie = punkte.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const flaeche = `0,${h} ${linie} ${w},${h}`;

  return (
    <div>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        preserveAspectRatio="none"
        role="img"
        aria-label="Kursverlauf im gewählten Zeitraum"
        className="h-[260px] w-full"
      >
        <defs>
          <linearGradient id={`verlauf-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.18" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={flaeche} fill={`url(#verlauf-${id})`} />
        <polyline
          points={linie}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="mt-2 flex justify-between text-[13px] text-muted-foreground">
        <span>Start {werte[0].toFixed(0)}</span>
        <span>Ende {werte[werte.length - 1].toFixed(0)}</span>
      </div>
    </div>
  );
};

export default KursChart;
