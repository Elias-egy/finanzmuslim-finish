/**
 * finanzmuslim Erklaerbilder
 * ------------------------------------------------------------------
 * SORTE B aus BILDSPRACHE.md: zeigt einen VORGANG, nicht einen Gegenstand.
 * Nur im Fliesstext, nie auf Karten. Dafuer gibt es die Motivbilder.
 *
 * Regeln, an die sich jedes Bild hier haelt:
 *   1. Links Ausgangslage, Pfeil, rechts Ergebnis. Immer waagerecht.
 *   2. Hoechstens drei Elemente. Mehr wird auf dem Handy zu Brei.
 *   3. Beschriftung im Bild ist erlaubt und meist die Loesung. Kurze
 *      Woerter oder Zahlen. Die Aussage muss ohne Bildunterschrift stehen.
 *   4. Nur Blau #0057FA, Hellblau #EBF2FF, Weiss, Konturen Tiefblau #0B2B6B.
 *      Keine Buntfarben. Das unterscheidet Erklaerbild von Motivbild.
 *   5. Test: bei 320 Pixel ansehen. Wer raten muss, sieht ein schlechtes Bild.
 *
 * Format 16 zu 9, volle Textbreite, hoechstens 200 Pixel hoch.
 */

const C = {
  blau: "#0057FA",
  tief: "#0B2B6B",
  hell: "#EBF2FF",
  weiss: "#FFFFFF",
} as const;

type Props = { className?: string };

/** Gemeinsamer Rahmen. 16 zu 9, ruhige helle Flaeche, kraeftige Konturen. */
const E = ({
  children,
  className,
  titel,
}: Props & { children: React.ReactNode; titel: string }) => (
  <svg
    viewBox="0 0 320 180"
    role="img"
    aria-label={titel}
    className={`h-auto w-full ${className ?? ""}`}
    fill="none"
    stroke={C.tief}
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    fontFamily="Figtree, system-ui, sans-serif"
  >
    <rect width="320" height="180" rx="14" fill={C.hell} />
    {children}
  </svg>
);

/** Beschriftung unter einer Zone. Sagt, was dort zu sehen ist. */
const Label = ({ x, y = 158, children }: { x: number; y?: number; children: React.ReactNode }) => (
  <text
    x={x}
    y={y}
    textAnchor="middle"
    fontSize="13"
    fontWeight="600"
    fill={C.tief}
    stroke="none"
  >
    {children}
  </text>
);

/** Waagerechter Pfeil von links nach rechts. Der Vorgang. */
const Pfeil = ({ x1, x2, y }: { x1: number; x2: number; y: number }) => (
  <g stroke={C.blau} strokeWidth={3}>
    <line x1={x1} y1={y} x2={x2} y2={y} />
    <polyline points={`${x2 - 9},${y - 7} ${x2},${y} ${x2 - 9},${y + 7}`} />
  </g>
);

/* ============================================================
   1. ZINSEN
   Aussage: Aus 100 werden 110, ohne dass etwas geleistet wurde.
   Der einzige Unterschied zwischen links und rechts ist die Zeit,
   deshalb steht die Uhr auf dem Pfeil und nicht daneben.
   ============================================================ */
export const IlluZins = ({ className }: Props) => (
  <E className={className} titel="Aus 100 Euro werden nach einem Jahr 110 Euro, allein weil Zeit vergangen ist">
    {/* links: der geliehene Schein */}
    <g>
      <rect x="18" y="62" width="94" height="56" rx="8" fill={C.weiss} />
      <text x="65" y="98" textAnchor="middle" fontSize="26" fontWeight="700" fill={C.tief} stroke="none">
        100 €
      </text>
    </g>
    <Label x={65}>geliehen</Label>

    {/* Mitte: die Zeit. Uhr sitzt auf dem Pfeil, damit sie als Ursache gelesen
        wird und nicht als drittes Ding daneben. */}
    <Pfeil x1={124} y={90} x2={196} />
    <g>
      <circle cx="160" cy="50" r="21" fill={C.weiss} stroke={C.tief} />
      <polyline points="160,37 160,50 169,56" stroke={C.tief} strokeWidth={2.5} />
    </g>
    <text x="160" y="118" textAnchor="middle" fontSize="13" fontWeight="600" fill={C.blau} stroke="none">
      1 Jahr
    </text>

    {/* rechts: derselbe Schein, mehr Geld. Der Aufschlag in Blau. */}
    <g>
      <rect x="208" y="62" width="94" height="56" rx="8" fill={C.weiss} stroke={C.blau} />
      <text x="255" y="98" textAnchor="middle" fontSize="26" fontWeight="700" fill={C.tief} stroke="none">
        1<tspan fill={C.blau}>1</tspan>0 €
      </text>
    </g>
    <Label x={255}>zurückgezahlt</Label>
  </E>
);

/* ============================================================
   2. HANDEL
   Aussage: Beide Seiten geben etwas Echtes her. Der Gegensatz zum
   Zinsbild ist der zweite Pfeil: hier bewegt sich Ware, dort nur Zeit.
   ============================================================ */
export const IlluHandel = ({ className }: Props) => (
  <E className={className} titel="Beim Handel wechseln Ware und Geld die Seite, beide geben etwas her">
    {/* links: Ware als Kiste */}
    <g>
      <rect x="22" y="56" width="84" height="62" rx="8" fill={C.weiss} />
      <line x1="22" y1="76" x2="106" y2="76" />
      <rect x="54" y="76" width="20" height="14" rx="3" fill={C.hell} />
    </g>
    <Label x={64}>Ware</Label>

    {/* Mitte: zwei Pfeile. Oben geht die Ware nach rechts, unten das Geld
        nach links. Der Tausch ist die Aussage. */}
    <Pfeil x1={122} y={74} x2={198} />
    <g stroke={C.blau} strokeWidth={3}>
      <line x1="198" y1="102" x2="122" y2="102" />
      <polyline points="131,95 122,102 131,109" />
    </g>
    <text x="160" y="150" textAnchor="middle" fontSize="13" fontWeight="600" fill={C.blau} stroke="none">
      Tausch
    </text>

    {/* rechts: Geld */}
    <g>
      <rect x="214" y="56" width="84" height="62" rx="8" fill={C.weiss} />
      <text x="256" y="97" textAnchor="middle" fontSize="26" fontWeight="700" fill={C.tief} stroke="none">
        €
      </text>
    </g>
    <Label x={256}>Geld</Label>
  </E>
);

/* ============================================================
   3. GOLD
   Aussage: Hinter dem Anteil, den du kaufst, liegt echtes Metall in
   einem Tresor. Genau das meint "physisch besichert", ohne das Wort.
   ============================================================ */
export const IlluGold = ({ className }: Props) => (
  <E className={className} titel="Hinter dem gekauften Anteil liegt ein echter Barren im Tresor">
    {/* links: das Papier, das man kauft */}
    <g>
      <rect x="26" y="50" width="76" height="74" rx="8" fill={C.weiss} />
      <line x1="42" y1="70" x2="86" y2="70" strokeWidth={2} />
      <line x1="42" y1="84" x2="86" y2="84" strokeWidth={2} />
      <text x="64" y="112" textAnchor="middle" fontSize="14" fontWeight="700" fill={C.blau} stroke="none">
        1 Anteil
      </text>
    </g>
    <Label x={64}>was du kaufst</Label>

    <Pfeil x1={116} y={87} x2={186} />

    {/* rechts: Tresor mit Barren, Tuer offen nach rechts. Bei geschlossener
        Tuer sieht man nicht, dass wirklich etwas drin liegt, und genau das ist
        die Aussage. Das Drehrad macht den Kasten zum Tresor. */}
    <g>
      <rect x="196" y="42" width="76" height="90" rx="6" fill={C.weiss} />
      <rect x="204" y="52" width="60" height="70" rx="3" fill={C.hell} />
      {/* die offene Tuer, nach rechts aufgeschwungen */}
      <path d="M272 52 L296 62 L296 122 L272 122 Z" fill={C.weiss} />
      <circle cx="285" cy="90" r="7" fill={C.hell} />
      <line x1="285" y1="81" x2="285" y2="99" strokeWidth={2} />
      <line x1="276" y1="90" x2="294" y2="90" strokeWidth={2} />
      {/* die Barren, das Ergebnis */}
      <g fill={C.blau} stroke={C.tief} strokeWidth={2}>
        <path d="M212 116 L219 102 L249 102 L256 116 Z" />
        <path d="M221 98 L226 88 L242 88 L247 98 Z" />
      </g>
    </g>
    <Label x={248}>was dahinter liegt</Label>
  </E>
);

/* ============================================================
   4. VERSICHERUNG
   Aussage: Viele zahlen in einen Topf, einer bekommt daraus. Das ist
   der Kern des Takaful-Gedankens, ohne das Wort zu benutzen.
   ============================================================ */
export const IlluVersicherung = ({ className }: Props) => (
  <E className={className} titel="Viele zahlen in einen gemeinsamen Topf, wer den Schaden hat, bekommt daraus">
    {/* links: drei, die einzahlen. Ein gemeinsamer Pfeil statt drei einzelnen,
        sonst wird die linke Haelfte zu einem Strichgewirr. */}
    <g fill={C.weiss}>
      <circle cx="34" cy="42" r="9" />
      <path d="M22 64 a12 12 0 0 1 24 0" />
      <circle cx="34" cy="78" r="9" />
      <path d="M22 100 a12 12 0 0 1 24 0" />
      <circle cx="34" cy="114" r="9" />
      <path d="M22 136 a12 12 0 0 1 24 0" />
    </g>
    <Pfeil x1={58} y={88} x2={100} />
    {/* mittig unter Gruppe und Pfeil, nicht unter den Personen allein, sonst
        laeuft die Beschriftung links aus dem Bild */}
    <Label x={62} y={166}>viele zahlen ein</Label>

    {/* Mitte: der gemeinsame Topf */}
    <g>
      <path d="M110 62 L170 62 L162 120 L118 120 Z" fill={C.weiss} />
      <line x1="106" y1="62" x2="174" y2="62" strokeWidth={3} />
      <text x="140" y="100" textAnchor="middle" fontSize="22" fontWeight="700" fill={C.blau} stroke="none">
        €
      </text>
    </g>

    {/* rechts: einer mit Schaden bekommt daraus */}
    <Pfeil x1={182} y={88} x2={224} />
    <g>
      <circle cx="262" cy="86" r="13" fill={C.weiss} />
      <path d="M240 132 a22 22 0 0 1 44 0" fill={C.weiss} />
      <path d="M272 34 L256 54 L268 54 L260 70" stroke={C.blau} strokeWidth={3} fill="none" />
    </g>
    <Label x={262} y={166}>einer bekommt</Label>
  </E>
);

/* ============================================================
   5. AKTIEN PRUEFEN
   Aussage: Eine Firma gilt als geprueft, wenn drei Zahlen stimmen.
   Die Zahlen stehen im Bild, sonst bleibt es ein abstraktes Diagramm.
   ============================================================ */
export const IlluPruefung = ({ className }: Props) => (
  <E className={className} titel="Eine Firma gilt als geprüft, wenn drei Grenzwerte eingehalten sind">
    {/* links: die Firma */}
    <g>
      <rect x="16" y="62" width="56" height="58" rx="6" fill={C.weiss} />
      <g fill={C.hell} stroke={C.tief} strokeWidth={2}>
        <rect x="26" y="74" width="14" height="12" rx="2" />
        <rect x="48" y="74" width="14" height="12" rx="2" />
        <rect x="26" y="94" width="14" height="12" rx="2" />
        <rect x="48" y="94" width="14" height="12" rx="2" />
      </g>
    </g>
    <Label x={44} y={144}>eine Firma</Label>

    <Pfeil x1={80} y={91} x2={112} />

    {/* rechts: die drei Bedingungen als Liste mit Haken. Eine Liste ist
        lesbar, drei Balken ohne Zahlen sind es nicht. Schriftgroesse 11,
        damit die laengste Zeile innerhalb der Karte bleibt. */}
    <g>
      <rect x="122" y="34" width="184" height="112" rx="10" fill={C.weiss} />
      <text x="214" y="55" textAnchor="middle" fontSize="12" fontWeight="700" fill={C.blau} stroke="none">
        alle drei müssen stimmen
      </text>
      <polyline points="138,74 143,80 152,69" stroke={C.blau} strokeWidth={3} />
      <text x="160" y="81" fontSize="11" fontWeight="600" fill={C.tief} stroke="none">
        Schulden unter 30 %
      </text>
      <polyline points="138,100 143,106 152,95" stroke={C.blau} strokeWidth={3} />
      <text x="160" y="107" fontSize="11" fontWeight="600" fill={C.tief} stroke="none">
        Zinsgeld unter 30 %
      </text>
      <polyline points="138,126 143,132 152,121" stroke={C.blau} strokeWidth={3} />
      <text x="160" y="133" fontSize="11" fontWeight="600" fill={C.tief} stroke="none">
        Haram-Umsatz unter 5 %
      </text>
    </g>
  </E>
);

/* ============================================================
   6. DEPOT
   Aussage: Ein Depot ist kein Konto, sondern das Regal, in dem die
   gekauften Anteile liegen. Genau das versteht die Zielgruppe nicht.
   ============================================================ */
export const IlluDepot = ({ className }: Props) => (
  <E className={className} titel="Vom Konto geht Geld ins Depot und liegt dort als Anteile">
    {/* links: das Konto als Bankkarte */}
    <g>
      <rect x="20" y="60" width="90" height="58" rx="8" fill={C.weiss} />
      <rect x="20" y="60" width="90" height="14" rx="8" fill={C.blau} stroke="none" />
      <rect x="20" y="66" width="90" height="8" fill={C.blau} stroke="none" />
      <text x="65" y="104" textAnchor="middle" fontSize="24" fontWeight="700" fill={C.tief} stroke="none">
        €
      </text>
    </g>
    <Label x={65}>dein Konto</Label>

    <Pfeil x1={122} y={89} x2={186} />
    <text x="154" y="74" textAnchor="middle" fontSize="12" fontWeight="600" fill={C.blau} stroke="none">
      du kaufst
    </text>

    {/* rechts: das Depot als Fach mit drei Anteilen. Die drei Karten sind
        bewusst gleich hoch. Unterschiedlich hohe Kaesten liest jeder als
        Balkendiagramm, und dann steht dort eine Statistik statt eines Depots.
        Die Linien auf den Karten machen sie zu Papieren. */}
    <g>
      <rect x="198" y="42" width="104" height="88" rx="8" fill={C.weiss} />
      <g fill={C.hell} stroke={C.tief} strokeWidth={2}>
        <rect x="210" y="58" width="26" height="56" rx="3" />
        <rect x="237" y="58" width="26" height="56" rx="3" />
        <rect x="264" y="58" width="26" height="56" rx="3" />
      </g>
      <g strokeWidth={2} stroke={C.blau}>
        <line x1="216" y1="72" x2="230" y2="72" />
        <line x1="216" y1="82" x2="226" y2="82" />
        <line x1="243" y1="72" x2="257" y2="72" />
        <line x1="243" y1="82" x2="253" y2="82" />
        <line x1="270" y1="72" x2="284" y2="72" />
        <line x1="270" y1="82" x2="280" y2="82" />
      </g>
      <line x1="204" y1="118" x2="296" y2="118" strokeWidth={3} />
    </g>
    <Label x={250}>dein Depot</Label>
  </E>
);

/* ============================================================
   REGISTER
   Bleibt aus der alten Fassung erhalten, damit nichts bricht,
   was die Bilder ueber ihren Namen aufruft.
   ============================================================ */

export type IlluName = "zins" | "handel" | "gold" | "versicherung" | "pruefung" | "depot";

export const illus: Record<IlluName, (p: Props) => JSX.Element> = {
  zins: IlluZins,
  handel: IlluHandel,
  gold: IlluGold,
  versicherung: IlluVersicherung,
  pruefung: IlluPruefung,
  depot: IlluDepot,
};
