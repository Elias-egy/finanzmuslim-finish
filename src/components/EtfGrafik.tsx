/**
 * Die Handy-Grafik des ETF-Plans: der normale MSCI World mit vielen Firmen, darunter Finanzfirmen, geht
 * durch den Filter, übrig bleibt der MSCI World Islamic. Eigenes SVG im Stil von GoldGrafiken.tsx.
 *
 * Die Punkte sind ein Bild für das Verhältnis (36 zu 11, wie 1.249 zu 385), keine Zählung. Die Bewegung
 * läuft einmal, wenn der Abschnitt mit `.reveal` sichtbar wird; ohne sie steht die fertige Grafik.
 */
import { ISLAMIC_FIRMEN, WORLD_FIRMEN, zahl } from "@/data/etfPlan";

const TINTE = "#0F172A";
const GRAU = "#CBD5E1";

const BEWEGUNG = `
@media (prefers-reduced-motion: no-preference) {
  .reveal.visible .eg-weg { animation: eg-weg 0.7s 0.5s ease-in both; }
  .reveal.visible .eg-rein { animation: eg-rein 0.5s ease-out both; }
  .reveal.visible .eg-zeile { animation: eg-rein 0.6s 1.4s ease-out both; }
}
@keyframes eg-weg { from { opacity: 1; } to { opacity: 0.35; } }
@keyframes eg-rein { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: none; } }
`;

/** Welche der 36 Punkte links Finanzfirmen sind (6 von 36, rund 16 %) und welche sonst rausfallen. */
const FINANZ = new Set([2, 9, 13, 20, 27, 31]);
const BLEIBT = new Set([0, 4, 7, 11, 15, 18, 22, 25, 29, 33, 35]);

const Raster = ({ x, farbe }: { x: number; farbe: (i: number) => string | null }) => (
  <>
    {Array.from({ length: 36 }, (_, i) => {
      const f = farbe(i);
      if (!f) return null;
      return <circle key={i} cx={x + (i % 6) * 15} cy={44 + Math.floor(i / 6) * 15} r={5} fill={f} />;
    })}
  </>
);

export const GrafikFilter = ({ zeile, unter }: { zeile: string; unter: string }) => (
  <figure className="card-surface p-4">
    <style>{BEWEGUNG}</style>
    <svg
      viewBox="0 0 320 222"
      className="h-auto w-full"
      role="img"
      aria-label={`Der MSCI World hat ${zahl(WORLD_FIRMEN)} Firmen, darunter Banken. Nach dem Filter bleiben im MSCI World Islamic ${zahl(ISLAMIC_FIRMEN)}. ${zeile} ${unter}`}
    >
      <text x={70} y={22} textAnchor="middle" fontSize={14} fontWeight={700} fill={TINTE}>
        MSCI World
      </text>
      <Raster x={32} farbe={(i) => (BLEIBT.has(i) ? "#0057FA" : null)} />
      <g className="eg-weg">
        <Raster x={32} farbe={(i) => (FINANZ.has(i) ? "#E5484D" : BLEIBT.has(i) ? null : GRAU)} />
      </g>
      <text x={70} y={148} textAnchor="middle" fontSize={13} fill="#475569">
        {zahl(WORLD_FIRMEN)} Firmen
      </text>

      <path d="M141 62 h38 l-14 17 v15 l-10 5 v-20 z" fill="#94A3B8" />
      <path d="M151 110 h18 m-6 -6 l6 6 l-6 6" fill="none" stroke="#94A3B8" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      <text x={160} y={134} textAnchor="middle" fontSize={11} fill="#64748B">
        Filter
      </text>

      <text x={250} y={22} textAnchor="middle" fontSize={14} fontWeight={700} fill={TINTE}>
        Islamic
      </text>
      <g className="eg-rein">
        <Raster x={212} farbe={(i) => (BLEIBT.has(i) ? "#0057FA" : null)} />
      </g>
      <text x={250} y={148} textAnchor="middle" fontSize={13} fill="#475569">
        {zahl(ISLAMIC_FIRMEN)} Firmen
      </text>

      <g className="eg-zeile">
        <rect x={20} y={162} width={280} height={54} rx={12} fill="#EBF2FF" stroke="#C7DAFF" strokeWidth={1.5} />
        <text x={160} y={184} textAnchor="middle" fontSize={15} fontWeight={800} fill={TINTE}>
          {zeile}
        </text>
        <text x={160} y={204} textAnchor="middle" fontSize={13} fill="#334155">
          {unter}
        </text>
      </g>
    </svg>
    <figcaption className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 px-1 text-[12px] text-muted-foreground">
      <span className="flex items-center gap-1">
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#E5484D]" aria-hidden /> Finanzfirmen
      </span>
      <span className="flex items-center gap-1">
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#CBD5E1]" aria-hidden /> andere raus
      </span>
      <span className="flex items-center gap-1">
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-primary" aria-hidden /> bleibt drin
      </span>
    </figcaption>
  </figure>
);
