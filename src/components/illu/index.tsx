/**
 * Flache SVG-Illustrationen. Nur drei Werte:
 * kraeftiges Blau #0057FA, helles Blau #EBF2FF, Weiss. Konturen #0B1220.
 * Keine Schatten, keine Verlaeufe, keine Perspektive. Verhaeltnis 16:9.
 */
const BLAU = "#0057FA";
const HELL = "#EBF2FF";
const WEISS = "#FFFFFF";
const KONTUR = "#0B1220";

type Props = { className?: string };

const Rahmen = ({ children, className, titel }: Props & { children: React.ReactNode; titel: string }) => (
  <svg
    viewBox="0 0 320 180"
    role="img"
    aria-label={titel}
    className={`h-full w-full ${className ?? ""}`}
    fill="none"
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="320" height="180" fill={HELL} />
    {children}
  </svg>
);

/** Pfeil nach rechts, waagerecht. */
const Pfeil = ({ x, y, laenge = 44 }: { x: number; y: number; laenge?: number }) => (
  <g stroke={BLAU}>
    <line x1={x} y1={y} x2={x + laenge} y2={y} />
    <polyline points={`${x + laenge - 12},${y - 9} ${x + laenge},${y} ${x + laenge - 12},${y + 9}`} />
  </g>
);

/** Geldschein als schlichtes Rechteck mit Kreis. */
const Schein = ({ x, y, w = 68, h = 44 }: { x: number; y: number; w?: number; h?: number }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx="6" fill={WEISS} stroke={KONTUR} />
    <circle cx={x + w / 2} cy={y + h / 2} r={9} fill={BLAU} />
  </g>
);

export const IlluZins = ({ className }: Props) => (
  <Rahmen className={className} titel="Aus einem Geldschein werden mit der Zeit zwei">
    <Schein x={30} y={68} />
    <circle cx={160} cy={62} r={14} fill={WEISS} stroke={KONTUR} />
    <polyline points="160,54 160,62 166,66" stroke={KONTUR} />
    <Pfeil x={136} y={90} />
    <Schein x={200} y={56} />
    <Schein x={218} y={82} />
  </Rahmen>
);

export const IlluHandel = ({ className }: Props) => (
  <Rahmen className={className} titel="Ware gegen Geld, ein echter Tausch">
    <g>
      <rect x={34} y={62} width={72} height={58} rx="6" fill={WEISS} stroke={KONTUR} />
      <line x1={34} y1={82} x2={106} y2={82} stroke={KONTUR} />
      <rect x={62} y={62} width={16} height={20} fill={BLAU} />
    </g>
    <g stroke={BLAU}>
      <line x1={130} y1={91} x2={190} y2={91} />
      <polyline points="142,82 130,91 142,100" />
      <polyline points="178,82 190,91 178,100" />
    </g>
    <Schein x={214} y={69} />
  </Rahmen>
);

export const IlluGold = ({ className }: Props) => (
  <Rahmen className={className} titel="Ein Goldbarren liegt sicher im Tresor">
    <polygon points="34,116 54,76 116,76 136,116" fill={BLAU} stroke={KONTUR} />
    <line x1={54} y1={76} x2={116} y2={76} stroke={KONTUR} />
    <g>
      <rect x={176} y={52} width={110} height={92} rx="8" fill={WEISS} stroke={KONTUR} />
      <circle cx={231} cy={98} r={26} fill={HELL} stroke={KONTUR} />
      <polyline points="219,98 228,107 244,89" stroke={BLAU} />
    </g>
  </Rahmen>
);

const Person = ({ x, y }: { x: number; y: number }) => (
  <g fill={WEISS} stroke={KONTUR}>
    <circle cx={x} cy={y} r={9} />
    <path d={`M${x - 13} ${y + 26} a13 13 0 0 1 26 0`} />
  </g>
);

export const IlluVersicherung = ({ className }: Props) => (
  <Rahmen className={className} titel="Viele zahlen in einen Topf, einer bekommt Hilfe">
    <Person x={26} y={38} />
    <Person x={26} y={112} />
    <Person x={72} y={38} />
    <Person x={72} y={112} />
    <g stroke={BLAU}>
      <line x1={96} y1={52} x2={122} y2={74} />
      <line x1={96} y1={126} x2={122} y2={104} />
    </g>
    <path d="M128 74 h56 l-8 40 h-40 z" fill={WEISS} stroke={KONTUR} />
    <line x1={128} y1={74} x2={184} y2={74} stroke={KONTUR} />
    <Pfeil x={196} y={92} laenge={40} />
    <Person x={276} y={78} />
  </Rahmen>
);

export const IlluPruefung = ({ className }: Props) => (
  <Rahmen className={className} titel="Drei Messlatten unter einer Grenzlinie">
    <line x1={40} y1={64} x2={280} y2={64} stroke={BLAU} strokeDasharray="10 8" />
    <g fill={WEISS} stroke={KONTUR}>
      <rect x={68} y={44} width={44} height={96} rx="6" />
      <rect x={138} y={44} width={44} height={96} rx="6" />
      <rect x={208} y={44} width={44} height={96} rx="6" />
    </g>
    <g fill={BLAU}>
      <rect x={68} y={92} width={44} height={48} />
      <rect x={138} y={110} width={44} height={30} />
      <rect x={208} y={76} width={44} height={64} />
    </g>
    <g fill="none" stroke={KONTUR}>
      <rect x={68} y={44} width={44} height={96} rx="6" />
      <rect x={138} y={44} width={44} height={96} rx="6" />
      <rect x={208} y={44} width={44} height={96} rx="6" />
    </g>
  </Rahmen>
);

export const IlluDepot = ({ className }: Props) => (
  <Rahmen className={className} titel="Geprüfte Auswahl im Regal">
    <g fill={WEISS} stroke={KONTUR}>
      <rect x={34} y={40} width={150} height={106} rx="8" />
    </g>
    <line x1={34} y1={94} x2={184} y2={94} stroke={KONTUR} />
    <g fill={BLAU}>
      <rect x={52} y={60} width={26} height={34} />
      <rect x={94} y={72} width={26} height={22} />
      <rect x={136} y={54} width={26} height={40} />
      <rect x={52} y={112} width={110} height={20} rx="4" />
    </g>
    <circle cx={248} cy={92} r={32} fill={WEISS} stroke={KONTUR} />
    <polyline points="234,92 245,103 264,80" stroke={BLAU} />
  </Rahmen>
);

export type IlluName = "zins" | "handel" | "gold" | "versicherung" | "pruefung" | "depot";

export const illus: Record<IlluName, (p: Props) => JSX.Element> = {
  zins: IlluZins,
  handel: IlluHandel,
  gold: IlluGold,
  versicherung: IlluVersicherung,
  pruefung: IlluPruefung,
  depot: IlluDepot,
};
