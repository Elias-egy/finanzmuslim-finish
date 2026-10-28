/**
 * Die zwei Handy-Grafiken des Gold-Plans (Elias, 28.10.2026, MC4c: „eine coole Grafik … die auf dem
 * Handy gut aussieht“). Eigene SVGs ohne Bildgenerator, damit nichts nach KI aussieht.
 *
 * Die Bewegung läuft einmal, wenn der Abschnitt mit `.reveal` sichtbar wird; ohne sie (Standbild,
 * „weniger Bewegung“, Fallback von `.reveal`) steht die fertige Grafik. index.css schaltet bei
 * `prefers-reduced-motion` alle Animationen ab, hier zusätzlich über die Medienabfrage.
 */
const GOLD_HELL = "#F4C752";
const GOLD_DUNKEL = "#C98A0B";
const TINTE = "#0F172A";

const BEWEGUNG = `
@media (prefers-reduced-motion: no-preference) {
  .reveal.visible .gg-kurs { stroke-dasharray: 260; animation: gg-zeichnen 1.6s 0.3s ease-out both; }
  .reveal.visible .gg-leer { animation: gg-auf 0.6s 1.6s ease-out both; }
  .reveal.visible .gg-barren { animation: gg-auf 0.5s ease-out both; }
  .reveal.visible .gg-anteil { animation: gg-auf 0.6s 0.8s ease-out both; }
}
@keyframes gg-zeichnen { from { stroke-dashoffset: 260; } to { stroke-dashoffset: 0; } }
@keyframes gg-auf { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: none; } }
`;

const Pfeil = ({ x }: { x: number }) => (
  <path d={`M${x} 78 h18 m-6 -6 l6 6 l-6 6`} fill="none" stroke="#94A3B8" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
);

/** Grafik 1: Geld rein, Kurs hoch und runter, leere Kiste ohne Gold. */
export const GrafikWette = () => (
  <figure className="card-surface p-4">
    <style>{BEWEGUNG}</style>
    <svg
      viewBox="0 24 320 134"
      className="h-auto w-full"
      role="img"
      aria-label="Dein Geld geht in eine Wette auf den Goldpreis. Der Kurs geht hoch und runter, aber dahinter liegt kein Gold."
    >
      <circle cx={46} cy={78} r={27} className="fill-primary" />
      <text x={46} y={87} textAnchor="middle" fontSize={26} fontWeight={800} fill="#fff">
        €
      </text>
      <text x={46} y={132} textAnchor="middle" fontSize={14} fontWeight={700} fill={TINTE}>
        Dein Geld
      </text>

      <Pfeil x={80} />

      <line x1={110} y1={112} x2={210} y2={112} stroke="#E2E8F0" strokeWidth={2} />
      <polyline
        className="gg-kurs"
        points="112,96 128,66 142,84 158,42 172,76 186,56 206,100"
        fill="none"
        stroke={TINTE}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M158 30 l6 8 h-12 z" className="fill-gain" />
      <path d="M206 112 l6 -8 h-12 z" className="fill-loss" />
      <text x={160} y={132} textAnchor="middle" fontSize={14} fontWeight={700} fill={TINTE}>
        Nur der Kurs
      </text>

      <Pfeil x={216} />

      <g className="gg-leer">
        <rect x={244} y={50} width={64} height={56} rx={10} fill="none" className="stroke-loss" strokeWidth={2.5} strokeDasharray="6 5" />
        <text x={276} y={88} textAnchor="middle" fontSize={26} fontWeight={800} className="fill-loss">
          ?
        </text>
        <text x={276} y={132} textAnchor="middle" fontSize={14} fontWeight={700} fill={TINTE}>
          Kein Gold
        </text>
        <text x={276} y={150} textAnchor="middle" fontSize={14} fontWeight={700} fill={TINTE}>
          dahinter
        </text>
      </g>
    </svg>
  </figure>
);

const NUMMERN = ["4718", "4719", "5032", "5033", "6120", "6121", "7304", "7305"];

const Barren = ({ x, y, nr, i }: { x: number; y: number; nr: string; i: number }) => (
  <g className="gg-barren" style={{ animationDelay: `${0.15 + i * 0.06}s` }}>
    <polygon points={`${x + 6},${y} ${x + 50},${y} ${x + 56},${y + 26} ${x},${y + 26}`} fill="url(#gg-gold)" />
    <text x={x + 28} y={y + 18} textAnchor="middle" fontSize={11} fontWeight={700} fill="#5B3A00">
      {nr}
    </text>
  </g>
);

/** Grafik 2: Tresor mit nummerierten Barren, darunter, wie viel Gold für den gewählten Betrag dahinter liegt. */
export const GrafikTresor = ({ zeile }: { zeile: string }) => (
  <figure className="card-surface p-4">
    <style>{BEWEGUNG}</style>
    <svg
      viewBox="0 0 320 184"
      className="h-auto w-full"
      role="img"
      aria-label={`Ein Tresor mit nummerierten Goldbarren. ${zeile}`}
    >
      <defs>
        <linearGradient id="gg-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={GOLD_HELL} />
          <stop offset="1" stopColor={GOLD_DUNKEL} />
        </linearGradient>
      </defs>
      <rect x={8} y={6} width={304} height={124} rx={18} fill="#1F2937" />
      <rect x={14} y={12} width={292} height={112} rx={14} fill="none" stroke="#374151" strokeWidth={2} />
      <text x={30} y={36} fontSize={13} fontWeight={700} fill="#E5E7EB">
        Tresor
      </text>
      {NUMMERN.map((nr, i) => (
        <Barren key={nr} nr={nr} i={i} x={30 + (i % 4) * 66} y={i < 4 ? 50 : 88} />
      ))}
      <g className="gg-anteil">
        <line x1={160} y1={130} x2={160} y2={142} className="stroke-primary" strokeWidth={2} strokeDasharray="3 3" />
        <rect x={34} y={142} width={252} height={38} rx={19} fill="#EBF2FF" className="stroke-primary" strokeWidth={1.5} />
        <text x={160} y={166} textAnchor="middle" fontSize={15} fontWeight={800} className="fill-primary">
          {zeile}
        </text>
      </g>
    </svg>
  </figure>
);
