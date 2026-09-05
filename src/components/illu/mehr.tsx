/**
 * Weitere Erklärbilder, gebaut nach denselben Regeln wie in index.tsx:
 * links Ausgangslage, Pfeil, rechts Ergebnis; höchstens drei Elemente;
 * Beschriftung im Bild; nur Blau, Hellblau, Weiß, Tiefblau.
 *
 * Jedes Bild trägt seine Aussage im Titel. Wer eines ändert, prüft es bei
 * 320 Pixel Breite.
 */

const C = {
  blau: "#0057FA",
  tief: "#0B2B6B",
  hell: "#EBF2FF",
  himmel: "#BBD3FF",
  weiss: "#FFFFFF",
} as const;

type Props = { className?: string };

const E = ({ children, className, titel }: Props & { children: React.ReactNode; titel: string }) => (
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

const T = ({
  x,
  y,
  size = 13,
  fill = C.tief,
  weight = 600,
  anchor = "middle",
  children,
}: {
  x: number;
  y: number;
  size?: number;
  fill?: string;
  weight?: number;
  anchor?: "middle" | "start" | "end";
  children: React.ReactNode;
}) => (
  <text x={x} y={y} textAnchor={anchor} fontSize={size} fontWeight={weight} fill={fill} stroke="none">
    {children}
  </text>
);

const Pfeil = ({ x1, x2, y }: { x1: number; x2: number; y: number }) => (
  <g stroke={C.blau} strokeWidth={3}>
    <line x1={x1} y1={y} x2={x2} y2={y} />
    <polyline points={`${x2 - 9},${y - 7} ${x2},${y} ${x2 - 9},${y + 7}`} />
  </g>
);

const PfeilRunter = ({ x, y1, y2 }: { x: number; y1: number; y2: number }) => (
  <g stroke={C.blau} strokeWidth={3}>
    <line x1={x} y1={y1} x2={x} y2={y2} />
    <polyline points={`${x - 7},${y2 - 9} ${x},${y2} ${x + 7},${y2 - 9}`} />
  </g>
);

const Haken = ({ x, y }: { x: number; y: number }) => (
  <polyline points={`${x},${y} ${x + 5},${y + 6} ${x + 14},${y - 5}`} stroke={C.blau} strokeWidth={3} />
);

/* ============================================================
   ZWEI EBENEN. Aussage: Erst wird gefragt, womit eine Firma
   Geld verdient, dann, was sie mit dem Geld macht.
   ============================================================ */
export const IlluZweiEbenen = ({ className }: Props) => (
  <E className={className} titel="Eine Aktie wird auf zwei Ebenen geprüft: erst das Geschäft, dann der Umgang mit Geld">
    <rect x="18" y="40" width="130" height="100" rx="10" fill={C.weiss} />
    <T x={83} y={62} size={12} fill={C.blau}>
      Ebene 1
    </T>
    <T x={83} y={82} size={14}>
      Womit verdient
    </T>
    <T x={83} y={100} size={14}>
      die Firma Geld?
    </T>
    <Haken x={72} y={118} />
    <Pfeil x1={152} x2={168} y={90} />
    <rect x="172" y="40" width="130" height="100" rx="10" fill={C.weiss} stroke={C.blau} />
    <T x={237} y={62} size={12} fill={C.blau}>
      Ebene 2
    </T>
    <T x={237} y={82} size={14}>
      Was macht sie
    </T>
    <T x={237} y={100} size={14}>
      mit dem Geld?
    </T>
    <T x={237} y={124} size={12} fill={C.blau}>
      drei Grenzwerte
    </T>
  </E>
);

/* ============================================================
   REINIGUNG. Aussage: Von der Dividende bleibt fast alles bei dir,
   ein kleiner Rest geht weiter.
   ============================================================ */
export const IlluReinigung = ({ className }: Props) => (
  <E className={className} titel="Von 300 Euro Ertrag bleiben 296,40 bei dir, 3,60 Euro gehen weiter">
    <rect x="22" y="58" width="96" height="60" rx="8" fill={C.weiss} />
    <T x={70} y={86} size={20} weight={700}>
      300 €
    </T>
    <T x={70} y={106} size={12} fill={C.blau}>
      Ausschüttung
    </T>
    <T x={70} y={156}>
      dein Ertrag
    </T>
    <Pfeil x1={126} x2={184} y={70} />
    <Pfeil x1={126} x2={184} y={112} />
    <T x={155} y={60} size={11} fill={C.blau}>
      98,8 %
    </T>
    <T x={155} y={130} size={11} fill={C.blau}>
      1,2 %
    </T>
    <rect x="194" y="46" width="104" height="48" rx="8" fill={C.weiss} stroke={C.blau} />
    <T x={246} y={76} size={18} weight={700}>
      296,40 €
    </T>
    <rect x="194" y="102" width="104" height="40" rx="8" fill={C.hell} />
    <T x={246} y={128} size={16} weight={700} fill={C.blau}>
      3,60 €
    </T>
    <T x={246} y={162}>
      bleibt · geht weiter
    </T>
  </E>
);

/* ============================================================
   GHARAR. Aussage: Erlaubt ist ein Vertrag, bei dem Ware und Preis
   feststehen. Problematisch, wenn eine Seite ein Fragezeichen ist.
   ============================================================ */
export const IlluGharar = ({ className }: Props) => (
  <E className={className} titel="Links stehen Ware und Preis fest, rechts ist offen, was man bekommt">
    <rect x="22" y="44" width="116" height="94" rx="10" fill={C.weiss} />
    <rect x="38" y="60" width="40" height="34" rx="6" fill={C.hell} />
    <T x={112} y={82} size={16} weight={700}>
      1.200 €
    </T>
    <Haken x={70} y={116} />
    <T x={80} y={162}>
      alles bekannt
    </T>
    <rect x="182" y="44" width="116" height="94" rx="10" fill={C.weiss} strokeDasharray="6 5" />
    <T x={240} y={100} size={40} weight={700} fill={C.blau}>
      ?
    </T>
    <T x={240} y={162}>
      offen, was kommt
    </T>
  </E>
);

/* ============================================================
   NULLSUMME. Aussage: Beim Glücksspiel entsteht nichts, Geld
   wechselt nur die Seite.
   ============================================================ */
export const IlluNullsumme = ({ className }: Props) => (
  <E className={className} titel="Beim Glücksspiel entsteht nichts, das Geld des einen wird zum Geld des anderen">
    <g fill={C.weiss}>
      <circle cx="56" cy="62" r="14" />
      <path d="M32 106 a24 24 0 0 1 48 0" />
    </g>
    <rect x="34" y="118" width="44" height="26" rx="6" fill={C.weiss} />
    <T x={56} y={136} size={13} weight={700}>
      100 €
    </T>
    <T x={56} y={166}>
      verliert
    </T>
    <Pfeil x1={96} x2={222} y={131} />
    <T x={160} y={120} size={12} fill={C.blau}>
      Zufall entscheidet
    </T>
    <g fill={C.weiss}>
      <circle cx="264" cy="62" r="14" />
      <path d="M240 106 a24 24 0 0 1 48 0" />
    </g>
    <rect x="236" y="118" width="56" height="26" rx="6" fill={C.weiss} stroke={C.blau} />
    <T x={264} y={136} size={13} weight={700}>
      +100 €
    </T>
    <T x={264} y={166}>
      gewinnt
    </T>
  </E>
);

/* ============================================================
   NISAB. Aussage: Dein Vermögen wird mit 85 Gramm Gold verglichen.
   Liegt es darüber, wird Zakat fällig.
   ============================================================ */
export const IlluNisab = ({ className }: Props) => (
  <E className={className} titel="Dein Vermögen wird mit dem Wert von 85 Gramm Gold verglichen">
    <line x1="160" y1="44" x2="160" y2="140" strokeWidth={3} />
    <line x1="70" y1="60" x2="250" y2="60" strokeWidth={3} />
    <line x1="120" y1="140" x2="200" y2="140" strokeWidth={3} />
    <line x1="70" y1="60" x2="70" y2="92" />
    <line x1="250" y1="60" x2="250" y2="92" />
    <path d="M36 92 L104 92 L96 116 L44 116 Z" fill={C.weiss} />
    <path d="M216 92 L284 92 L276 116 L224 116 Z" fill={C.weiss} />
    <T x={70} y={109} size={13} weight={700}>
      dein Geld
    </T>
    <g fill={C.blau} stroke={C.tief} strokeWidth={2}>
      <path d="M232 106 L238 96 L262 96 L268 106 Z" />
    </g>
    <T x={250} y={132} size={12} fill={C.blau}>
      85 g Gold
    </T>
    <T x={70} y={132} size={12} fill={C.blau}>
      Konto + Depot + Gold
    </T>
    <T x={160} y={166}>
      darüber: Zakat wird fällig
    </T>
  </E>
);

/* ============================================================
   VIER STUFEN. Aussage: Erst Beerdigung, Schulden, Vermächtnis,
   dann erst die festen Anteile.
   ============================================================ */
export const IlluErbeStufen = ({ className }: Props) => (
  <E className={className} titel="Vier Stufen, bevor jemand erbt: Beerdigung, Schulden, Vermächtnis, dann die Anteile">
    <rect x="22" y="112" width="64" height="40" rx="6" fill={C.weiss} />
    <rect x="90" y="88" width="64" height="64" rx="6" fill={C.weiss} />
    <rect x="158" y="64" width="64" height="88" rx="6" fill={C.weiss} />
    <rect x="226" y="40" width="72" height="112" rx="6" fill={C.weiss} stroke={C.blau} />
    <T x={54} y={128} size={12} fill={C.blau}>
      1
    </T>
    <T x={54} y={144} size={11}>
      Beerdigung
    </T>
    <T x={122} y={104} size={12} fill={C.blau}>
      2
    </T>
    <T x={122} y={120} size={11}>
      Schulden
    </T>
    <T x={190} y={80} size={12} fill={C.blau}>
      3
    </T>
    <T x={190} y={96} size={11}>
      Vermächtnis
    </T>
    <T x={190} y={110} size={10}>
      max. 1/3
    </T>
    <T x={262} y={56} size={12} fill={C.blau}>
      4
    </T>
    <T x={262} y={74} size={11}>
      feste Anteile
    </T>
    <T x={262} y={90} size={11}>
      für die Erben
    </T>
    <T x={160} y={170} size={12}>
      immer in dieser Reihenfolge
    </T>
  </E>
);

/* ============================================================
   MURABAHA. Aussage: Die Bank kauft die Sache wirklich und verkauft
   sie dir mit festem Aufschlag weiter.
   ============================================================ */
export const IlluMurabaha = ({ className }: Props) => (
  <E className={className} titel="Die Bank kauft das Auto für 10.000 und verkauft es dir für feste 12.000 in Raten">
    <rect x="18" y="56" width="80" height="60" rx="8" fill={C.weiss} />
    <T x={58} y={82} size={12}>
      Händler
    </T>
    <T x={58} y={102} size={13} weight={700}>
      10.000 €
    </T>
    <Pfeil x1={104} x2={128} y={86} />
    <rect x="132" y="48" width="70" height="76" rx="8" fill={C.weiss} stroke={C.blau} />
    <T x={167} y={72} size={12}>
      Bank
    </T>
    <T x={167} y={92} size={12} fill={C.blau}>
      kauft und
    </T>
    <T x={167} y={108} size={12} fill={C.blau}>
      besitzt
    </T>
    <Pfeil x1={208} x2={232} y={86} />
    <rect x="236" y="56" width="66" height="60" rx="8" fill={C.weiss} />
    <T x={269} y={82} size={12}>
      du
    </T>
    <T x={269} y={102} size={13} weight={700}>
      12.000 €
    </T>
    <T x={160} y={160} size={12}>
      Aufschlag steht fest, wächst nie
    </T>
  </E>
);

/* ============================================================
   MUSHARAKA. Aussage: Ihr kauft zusammen, du kaufst der Bank ihren
   Anteil nach und nach ab.
   ============================================================ */
export const IlluMusharaka = ({ className }: Props) => (
  <E className={className} titel="Am Anfang gehören dir 20 Prozent, du kaufst Anteile nach, am Ende alles">
    {[
      { x: 24, du: 20 },
      { x: 124, du: 60 },
      { x: 224, du: 100 },
    ].map((s, i) => (
      <g key={i}>
        <rect x={s.x} y="48" width="72" height="80" rx="8" fill={C.weiss} />
        <rect x={s.x} y={48 + 80 * (1 - s.du / 100)} width="72" height={80 * (s.du / 100)} rx="8" fill={C.blau} stroke="none" />
        <rect x={s.x} y="48" width="72" height="80" rx="8" />
        <T x={s.x + 36} y={148} size={12}>
          {s.du} % dir
        </T>
      </g>
    ))}
    <Pfeil x1={100} x2={120} y={88} />
    <Pfeil x1={200} x2={220} y={88} />
    <T x={160} y={30} size={12} fill={C.blau}>
      Miete nur für den Anteil der Bank
    </T>
    <T x={160} y={170} size={12}>
      hell: Bank · blau: du
    </T>
  </E>
);

/* ============================================================
   LEASING. Aussage: Wer das Auto besitzt, trägt den Schaden.
   Beim deutschen Leasing wird das umgedreht.
   ============================================================ */
export const IlluLeasingHaftung = ({ className }: Props) => (
  <E className={className} titel="Bei echter Miete trägt der Eigentümer den Schaden, beim üblichen Leasing der Fahrer">
    <g>
      <path d="M30 96 L44 74 L100 74 L116 96 L128 100 L128 116 L28 116 L28 100 Z" fill={C.weiss} />
      <circle cx="52" cy="118" r="9" fill={C.hell} />
      <circle cx="104" cy="118" r="9" fill={C.hell} />
    </g>
    <path d="M86 40 L74 62 L86 62 L78 82" stroke={C.blau} strokeWidth={3} />
    <T x={78} y={156} size={12}>
      Totalschaden
    </T>
    <Pfeil x1={140} x2={176} y={96} />
    <rect x="184" y="52" width="116" height="40" rx="8" fill={C.weiss} stroke={C.blau} />
    <T x={242} y={69} size={11} fill={C.blau}>
      echte Miete
    </T>
    <T x={242} y={85} size={12} weight={700}>
      Eigentümer zahlt
    </T>
    <rect x="184" y="100" width="116" height="40" rx="8" fill={C.weiss} strokeDasharray="6 5" />
    <T x={242} y={117} size={11} fill={C.blau}>
      übliches Leasing
    </T>
    <T x={242} y={133} size={12} weight={700}>
      du zahlst weiter
    </T>
  </E>
);

/* ============================================================
   RATEN. Aussage: Gleicher Preis in Raten ist ein Kauf. Mehr Preis
   nur wegen der Zeit ist das Problem.
   ============================================================ */
export const IlluRaten = ({ className }: Props) => (
  <E className={className} titel="Zwölf Raten zu 100 Euro ergeben den Barpreis, zwölf zu 110 Euro einen Aufschlag für Zeit">
    <rect x="22" y="40" width="130" height="100" rx="10" fill={C.weiss} stroke={C.blau} />
    <T x={87} y={64} size={12} fill={C.blau}>
      bar 1.200 €
    </T>
    <T x={87} y={92} size={18} weight={700}>
      12 × 100 €
    </T>
    <T x={87} y={116} size={13}>
      = 1.200 €
    </T>
    <Haken x={78} y={128} />
    <rect x="168" y="40" width="130" height="100" rx="10" fill={C.weiss} strokeDasharray="6 5" />
    <T x={233} y={64} size={12} fill={C.blau}>
      bar 1.200 €
    </T>
    <T x={233} y={92} size={18} weight={700}>
      12 × 110 €
    </T>
    <T x={233} y={116} size={13}>
      = 1.320 €
    </T>
    <T x={233} y={132} size={11} fill={C.blau}>
      +120 € nur für Zeit
    </T>
    <T x={160} y={166} size={12}>
      dieselbe Ware, zwei Verträge
    </T>
  </E>
);

/* ============================================================
   DISPO. Aussage: Unter null tickt jeden Tag ein Zins.
   ============================================================ */
export const IlluDispo = ({ className }: Props) => (
  <E className={className} titel="Sobald das Konto unter null steht, läuft jeden Tag ein Zins mit">
    <line x1="24" y1="90" x2="296" y2="90" strokeDasharray="5 5" />
    <T x={40} y={82} size={11} fill={C.blau} anchor="start">
      0 €
    </T>
    <rect x="60" y="48" width="70" height="36" rx="6" fill={C.weiss} />
    <T x={95} y={71} size={13} weight={700}>
      +300 €
    </T>
    <T x={95} y={116} size={12}>
      kein Zins
    </T>
    <Pfeil x1={140} x2={184} y={90} />
    <rect x="196" y="98" width="80" height="36" rx="6" fill={C.weiss} stroke={C.blau} />
    <T x={236} y={121} size={13} weight={700}>
      −500 €
    </T>
    <g>
      <circle cx="236" cy="62" r="17" fill={C.weiss} />
      <polyline points="236,51 236,62 243,67" />
    </g>
    <T x={236} y={158} size={12} fill={C.blau}>
      Zins läuft täglich
    </T>
  </E>
);

/* ============================================================
   QABD. Aussage: Online ist Gold erlaubt, wenn der Barren existiert,
   eine Nummer hat und die Zahlung sofort dein Konto verlässt.
   ============================================================ */
export const IlluQabd = ({ className }: Props) => (
  <E className={className} titel="Online-Kauf ist in Ordnung, wenn der Barren mit Nummer schon da ist und die Zahlung sofort weg ist">
    <rect x="22" y="56" width="110" height="64" rx="8" fill={C.weiss} />
    <T x={77} y={80} size={12}>
      Zahlung
    </T>
    <T x={77} y={100} size={12} fill={C.blau}>
      sofort weg
    </T>
    <T x={77} y={150} size={12}>
      dein Konto
    </T>
    <g stroke={C.blau} strokeWidth={3}>
      <line x1="140" y1="80" x2="180" y2="80" />
      <polyline points="171,73 180,80 171,87" />
      <line x1="180" y1="100" x2="140" y2="100" />
      <polyline points="149,93 140,100 149,107" />
    </g>
    <T x={160} y={128} size={11} fill={C.blau}>
      im selben Moment
    </T>
    <rect x="188" y="56" width="110" height="64" rx="8" fill={C.weiss} stroke={C.blau} />
    <g fill={C.blau} stroke={C.tief} strokeWidth={2}>
      <path d="M212 96 L219 80 L267 80 L274 96 Z" />
    </g>
    <T x={243} y={110} size={11}>
      Nr. 48213
    </T>
    <T x={243} y={150} size={12}>
      Barren existiert
    </T>
  </E>
);

/* ============================================================
   KRYPTO DREI. Aussage: Digitales Zentralbankgeld, Bitcoin und
   Ether, Meme-Coins sind drei verschiedene Fälle.
   ============================================================ */
export const IlluKryptoDrei = ({ className }: Props) => (
  <E className={className} titel="Drei Kategorien: staatliches Digitalgeld, Bitcoin und Ether, Meme-Coins">
    <rect x="18" y="40" width="88" height="100" rx="10" fill={C.weiss} stroke={C.blau} />
    <T x={62} y={66} size={12} fill={C.blau}>
      Kategorie 1
    </T>
    <T x={62} y={86} size={12}>
      digitales
    </T>
    <T x={62} y={102} size={12}>
      Staatsgeld
    </T>
    <Haken x={55} y={120} />
    <rect x="116" y="40" width="88" height="100" rx="10" fill={C.weiss} />
    <T x={160} y={66} size={12} fill={C.blau}>
      Kategorie 2
    </T>
    <T x={160} y={86} size={12}>
      Bitcoin
    </T>
    <T x={160} y={102} size={12}>
      und Ether
    </T>
    <T x={160} y={126} size={20} weight={700} fill={C.blau}>
      ?
    </T>
    <rect x="214" y="40" width="88" height="100" rx="10" fill={C.weiss} strokeDasharray="6 5" />
    <T x={258} y={66} size={12} fill={C.blau}>
      Kategorie 3
    </T>
    <T x={258} y={86} size={12}>
      Meme-
    </T>
    <T x={258} y={102} size={12}>
      Coins
    </T>
    <g stroke={C.tief} strokeWidth={3}>
      <line x1="251" y1="114" x2="265" y2="128" />
      <line x1="265" y1="114" x2="251" y2="128" />
    </g>
    <T x={160} y={166} size={12}>
      erlaubt · umstritten · nicht erlaubt
    </T>
  </E>
);

/* ============================================================
   SUKUK. Aussage: Der Ertrag kommt aus der Miete für ein echtes
   Gebäude, nicht aus Zins.
   ============================================================ */
export const IlluSukuk = ({ className }: Props) => (
  <E className={className} titel="Anleger besitzen Anteile an einem Gebäude und bekommen dafür Miete">
    <g>
      <rect x="30" y="52" width="86" height="82" rx="4" fill={C.weiss} />
      <g fill={C.hell} stroke={C.tief} strokeWidth={2}>
        <rect x="42" y="64" width="16" height="14" rx="2" />
        <rect x="65" y="64" width="16" height="14" rx="2" />
        <rect x="88" y="64" width="16" height="14" rx="2" />
        <rect x="42" y="86" width="16" height="14" rx="2" />
        <rect x="65" y="86" width="16" height="14" rx="2" />
        <rect x="88" y="86" width="16" height="14" rx="2" />
      </g>
      <rect x="63" y="110" width="20" height="24" rx="2" fill={C.blau} stroke="none" />
    </g>
    <T x={73} y={156} size={12}>
      echtes Gebäude
    </T>
    <Pfeil x1={126} x2={186} y={78} />
    <T x={156} y={68} size={11} fill={C.blau}>
      Miete
    </T>
    <g stroke={C.blau} strokeWidth={3}>
      <line x1="186" y1="110" x2="126" y2="110" />
      <polyline points="135,103 126,110 135,117" />
    </g>
    <T x={156} y={128} size={11} fill={C.blau}>
      Anteile
    </T>
    <g fill={C.weiss}>
      <circle cx="222" cy="72" r="10" />
      <path d="M206 104 a16 16 0 0 1 32 0" />
      <circle cx="256" cy="72" r="10" />
      <path d="M240 104 a16 16 0 0 1 32 0" />
      <circle cx="290" cy="72" r="10" />
      <path d="M274 104 a16 16 0 0 1 32 0" />
    </g>
    <T x={256} y={156} size={12}>
      die Anleger
    </T>
  </E>
);

/* ============================================================
   HEBEL. Aussage: Mit Hebel setzt du geliehenes Geld ein. Eine
   kleine Bewegung nimmt dir alles.
   ============================================================ */
export const IlluHebel = ({ className }: Props) => (
  <E className={className} titel="Aus 100 Euro werden mit Hebel 3.000 Euro Einsatz, davon 2.900 geliehen. Drei Prozent Bewegung, alles weg">
    <rect x="22" y="70" width="70" height="44" rx="8" fill={C.weiss} />
    <T x={57} y={97} size={15} weight={700}>
      100 €
    </T>
    <T x={57} y={140} size={12}>
      dein Geld
    </T>
    <Pfeil x1={100} x2={136} y={92} />
    <T x={118} y={80} size={11} fill={C.blau}>
      Hebel 30
    </T>
    <rect x="144" y="46" width="90" height="92" rx="8" fill={C.weiss} stroke={C.blau} />
    <T x={189} y={72} size={15} weight={700}>
      3.000 €
    </T>
    <T x={189} y={92} size={11} fill={C.blau}>
      davon 2.900
    </T>
    <T x={189} y={106} size={11} fill={C.blau}>
      geliehen
    </T>
    <T x={189} y={128} size={11}>
      Einsatz
    </T>
    <Pfeil x1={242} x2={264} y={92} />
    <rect x="268" y="70" width="34" height="44" rx="8" fill={C.hell} />
    <T x={285} y={97} size={15} weight={700} fill={C.blau}>
      0 €
    </T>
    <T x={285} y={140} size={11}>
      bei −3 %
    </T>
  </E>
);

/* ============================================================
   ISIN. Aussage: Der Name kann täuschen, die Nummer nicht.
   ============================================================ */
export const IlluIsin = ({ className }: Props) => (
  <E className={className} titel="Zwei Fonds mit ähnlichem Namen, nur die Nummer sagt, welcher gemeint ist">
    <rect x="22" y="44" width="130" height="92" rx="10" fill={C.weiss} strokeDasharray="6 5" />
    <T x={87} y={70} size={12}>
      „Global Islamic"
    </T>
    <T x={87} y={90} size={12}>
      „Islamic Global"
    </T>
    <T x={87} y={110} size={12}>
      „Shariah World"
    </T>
    <T x={87} y={160} size={12}>
      Namen ähneln sich
    </T>
    <Pfeil x1={158} x2={176} y={90} />
    <rect x="182" y="44" width="116" height="92" rx="10" fill={C.weiss} stroke={C.blau} />
    <T x={240} y={72} size={11} fill={C.blau}>
      ISIN
    </T>
    <T x={240} y={96} size={15} weight={700}>
      IE00B53L4X51
    </T>
    <Haken x={232} y={112} />
    <T x={240} y={160} size={12}>
      gibt es nur einmal
    </T>
  </E>
);

/* ============================================================
   VERGLEICH VERSICHERUNG. Aussage: Pflicht ist außen vor,
   freiwillig braucht einen Grund.
   ============================================================ */
export const IlluVersicherungPflicht = ({ className }: Props) => (
  <E className={className} titel="Pflichtversicherung ist außen vor, freiwillige brauchen einen echten Grund">
    <rect x="22" y="44" width="130" height="94" rx="10" fill={C.weiss} stroke={C.blau} />
    <T x={87} y={68} size={12} fill={C.blau}>
      Pflicht
    </T>
    <T x={87} y={88} size={12}>
      Kranken, Kfz-Haft,
    </T>
    <T x={87} y={104} size={12}>
      Pflege, Beruf
    </T>
    <Haken x={78} y={120} />
    <rect x="168" y="44" width="130" height="94" rx="10" fill={C.weiss} strokeDasharray="6 5" />
    <T x={233} y={68} size={12} fill={C.blau}>
      freiwillig
    </T>
    <T x={233} y={88} size={12}>
      Hausrat, Vollkasko,
    </T>
    <T x={233} y={104} size={12}>
      Leben, Zahn
    </T>
    <T x={233} y={126} size={20} weight={700} fill={C.blau}>
      ?
    </T>
    <T x={160} y={166} size={12}>
      rechts entscheidet der Grund
    </T>
  </E>
);
