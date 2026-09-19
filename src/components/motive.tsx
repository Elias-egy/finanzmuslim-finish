/**
 * finanzmuslim Motivbilder
 * ------------------------------------------------------------------
 * SORTE A aus BILDSPRACHE.md: ein erkennbarer Gegenstand je Thema,
 * gedacht fuer Karten und Seitenkoepfe. Muss bei 120 Pixel Breite
 * noch erkennbar sein.
 *
 * Palette, verbindlich:
 *   Markenblau #0057FA · Tiefblau #0B2B6B · Hellblau #EBF2FF
 *   Himmel #BBD3FF · Sand #F3E3C3 · Messing #E0A93B
 *   Ton #D98C6A · Nebel #C9D4E6 · Weiss #FFFFFF
 *
 * Kein Gruen, kein Rot, kein Gelb in Signalstaerke. Einzige Ausnahme:
 * das Ampel-Motiv, dort ist die Farbe die Aussage.
 */

const C = {
  blau: "#0057FA",
  tief: "#0B2B6B",
  hell: "#EBF2FF",
  himmel: "#BBD3FF",
  sand: "#F3E3C3",
  messing: "#E0A93B",
  ton: "#D98C6A",
  nebel: "#C9D4E6",
  weiss: "#FFFFFF",
} as const;

type Props = { className?: string };

/** Gemeinsamer Rahmen. Quadratisch, ruhige Flaeche, kraeftige Konturen. */
const M = ({
  children,
  className,
  titel,
  grund = C.hell,
}: Props & { children: React.ReactNode; titel: string; grund?: string }) => (
  <svg
    viewBox="0 0 120 120"
    role="img"
    aria-label={titel}
    className={`h-full w-full ${className ?? ""}`}
    fill="none"
    stroke={C.tief}
    strokeWidth={3}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="120" height="120" fill={grund} />
    {children}
  </svg>
);

/* ============================================================
   GRUNDLAGEN
   ============================================================ */

/** Zinsen: Muenzstapel waechst, Sanduhr daneben. */
export const MotivZins = ({ className }: Props) => (
  <M className={className} titel="Zinsen">
    <g fill={C.messing}>
      <rect x="20" y="78" width="34" height="9" rx="4.5" />
      <rect x="20" y="66" width="34" height="9" rx="4.5" />
      <rect x="20" y="54" width="34" height="9" rx="4.5" />
    </g>
    <g fill={C.blau}>
      <rect x="66" y="78" width="34" height="9" rx="4.5" />
      <rect x="66" y="66" width="34" height="9" rx="4.5" />
      <rect x="66" y="54" width="34" height="9" rx="4.5" />
      <rect x="66" y="42" width="34" height="9" rx="4.5" />
      <rect x="66" y="30" width="34" height="9" rx="4.5" />
    </g>
    <g stroke={C.tief}>
      <rect x="20" y="78" width="34" height="9" rx="4.5" />
      <rect x="20" y="66" width="34" height="9" rx="4.5" />
      <rect x="20" y="54" width="34" height="9" rx="4.5" />
      <rect x="66" y="78" width="34" height="9" rx="4.5" />
      <rect x="66" y="30" width="34" height="9" rx="4.5" />
      <line x1="60" y1="94" x2="60" y2="26" strokeDasharray="4 6" strokeWidth={2} />
    </g>
  </M>
);

/** Gharar: verschlossene Kiste mit Fragezeichen. */
export const MotivGharar = ({ className }: Props) => (
  <M className={className} titel="Unsicherheit">
    <rect x="24" y="46" width="72" height="50" rx="6" fill={C.weiss} />
    <path d="M24 62 h72" />
    <rect x="52" y="54" width="16" height="16" rx="3" fill={C.blau} stroke="none" />
    <path
      d="M48 32 a12 12 0 1 1 12 12 v5"
      stroke={C.blau}
      strokeWidth={5}
      fill="none"
    />
    <circle cx="60" cy="56" r="0.5" />
  </M>
);

/** Maysir: Roulette-Rad. */
export const MotivMaysir = ({ className }: Props) => (
  <M className={className} titel="Glücksspiel">
    <circle cx="60" cy="62" r="34" fill={C.weiss} />
    <circle cx="60" cy="62" r="34" />
    <circle cx="60" cy="62" r="13" fill={C.himmel} />
    <g stroke={C.tief} strokeWidth={2.5}>
      <line x1="60" y1="28" x2="60" y2="49" />
      <line x1="60" y1="75" x2="60" y2="96" />
      <line x1="26" y1="62" x2="47" y2="62" />
      <line x1="73" y1="62" x2="94" y2="62" />
      <line x1="36" y1="38" x2="51" y2="53" />
      <line x1="69" y1="71" x2="84" y2="86" />
      <line x1="84" y1="38" x2="69" y2="53" />
      <line x1="51" y1="71" x2="36" y2="86" />
    </g>
    <path d="M60 28 a34 34 0 0 1 24 10 l-11 11 a18 18 0 0 0 -13 -5 z" fill={C.blau} stroke="none" />
    <path d="M36 86 a34 34 0 0 1 -10 -24 l21 0 a13 13 0 0 0 4 9 z" fill={C.blau} stroke="none" />
    <circle cx="60" cy="62" r="34" />
    <circle cx="78" cy="44" r="5" fill={C.weiss} />
  </M>
);

/** Einstieg: Kompass. */
export const MotivKompass = ({ className }: Props) => (
  <M className={className} titel="Einstieg">
    <circle cx="60" cy="60" r="36" fill={C.weiss} />
    <circle cx="60" cy="60" r="28" fill={C.hell} strokeWidth={2} />
    <polygon points="60,34 70,60 60,54" fill={C.blau} stroke="none" />
    <polygon points="60,86 50,60 60,66" fill={C.nebel} stroke="none" />
    <polygon points="60,34 70,60 60,54" />
    <polygon points="60,86 50,60 60,66" />
    <circle cx="60" cy="60" r="4" fill={C.tief} stroke="none" />
  </M>
);

/** Fehler: Warndreieck. */
export const MotivFehler = ({ className }: Props) => (
  <M className={className} titel="Häufige Fehler">
    <path d="M60 26 L100 94 H20 Z" fill={C.sand} />
    <line x1="60" y1="50" x2="60" y2="70" stroke={C.tief} strokeWidth={6} />
    <circle cx="60" cy="80" r="3.5" fill={C.tief} stroke="none" />
  </M>
);

/* ============================================================
   INVESTIEREN
   ============================================================ */

/** ETF: gestapelte Karten mit Haken. */
export const MotivEtf = ({ className }: Props) => (
  <M className={className} titel="ETF">
    <rect x="26" y="70" width="68" height="24" rx="5" fill={C.himmel} />
    <rect x="30" y="56" width="60" height="24" rx="5" fill={C.weiss} />
    <rect x="34" y="34" width="52" height="34" rx="6" fill={C.blau} />
    <polyline points="46,50 56,60 76,42" stroke={C.weiss} strokeWidth={5} />
  </M>
);

/** Aktien prüfen: Lupe über Kursverlauf. */
export const MotivAktienPruefen = ({ className }: Props) => (
  <M className={className} titel="Aktien prüfen">
    <rect x="18" y="30" width="84" height="60" rx="6" fill={C.weiss} />
    <polyline points="28,76 44,58 56,66 74,40 92,48" stroke={C.blau} strokeWidth={4} />
    <circle cx="66" cy="66" r="22" fill={C.hell} fillOpacity="0.85" />
    <circle cx="66" cy="66" r="22" strokeWidth={4} />
    <line x1="82" y1="82" x2="98" y2="98" strokeWidth={6} />
  </M>
);

/** Sukuk: Urkunde mit Siegel. */
export const MotivSukuk = ({ className }: Props) => (
  <M className={className} titel="Sukuk">
    <rect x="26" y="22" width="68" height="80" rx="6" fill={C.weiss} />
    <g stroke={C.himmel} strokeWidth={4}>
      <line x1="38" y1="40" x2="82" y2="40" />
      <line x1="38" y1="52" x2="82" y2="52" />
      <line x1="38" y1="64" x2="66" y2="64" />
    </g>
    <circle cx="78" cy="84" r="13" fill={C.messing} />
    <circle cx="78" cy="84" r="13" />
    <path d="M78 78 l2 5 h5 l-4 4 1.5 5 -4.5 -3 -4.5 3 1.5 -5 -4 -4 h5 z" fill={C.weiss} stroke="none" />
  </M>
);

/** Gold: Barren. */
export const MotivGold = ({ className }: Props) => (
  <M className={className} titel="Gold">
    <polygon points="26,88 38,54 82,54 94,88" fill={C.messing} />
    <line x1="38" y1="54" x2="82" y2="54" />
    <polygon points="34,74 40,56 80,56 86,74" fill={C.sand} stroke="none" />
    <polygon points="26,88 38,54 82,54 94,88" />
    <line x1="44" y1="66" x2="76" y2="66" strokeWidth={2.5} stroke={C.tief} strokeOpacity="0.45" />
  </M>
);

/** Silber: gleiche Form, kühler Ton. */
export const MotivSilber = ({ className }: Props) => (
  <M className={className} titel="Silber">
    <polygon points="26,88 38,54 82,54 94,88" fill={C.nebel} />
    <line x1="38" y1="54" x2="82" y2="54" />
    <polygon points="34,74 40,56 80,56 86,74" fill={C.weiss} stroke="none" />
    <polygon points="26,88 38,54 82,54 94,88" />
    <line x1="44" y1="66" x2="76" y2="66" strokeWidth={2.5} stroke={C.tief} strokeOpacity="0.45" />
  </M>
);

/** Krypto: Sechseck mit Netzknoten. */
export const MotivKrypto = ({ className }: Props) => (
  <M className={className} titel="Krypto">
    <polygon points="60,22 93,41 93,79 60,98 27,79 27,41" fill={C.weiss} />
    <g stroke={C.blau} strokeWidth={3}>
      <line x1="46" y1="48" x2="74" y2="48" />
      <line x1="46" y1="48" x2="60" y2="72" />
      <line x1="74" y1="48" x2="60" y2="72" />
    </g>
    <g fill={C.blau} stroke="none">
      <circle cx="46" cy="48" r="6" />
      <circle cx="74" cy="48" r="6" />
      <circle cx="60" cy="72" r="6" />
    </g>
    <polygon points="60,22 93,41 93,79 60,98 27,79 27,41" />
  </M>
);

/** Datenbank: Karteikasten mit Registern. */
export const MotivDatenbank = ({ className }: Props) => (
  <M className={className} titel="Anlagen-Datenbank">
    <rect x="22" y="46" width="76" height="52" rx="6" fill={C.weiss} />
    <g stroke="none">
      <rect x="34" y="30" width="18" height="20" rx="3" fill={C.himmel} />
      <rect x="55" y="26" width="18" height="24" rx="3" fill={C.blau} />
      <rect x="76" y="32" width="14" height="18" rx="3" fill={C.nebel} />
    </g>
    <g>
      <rect x="34" y="30" width="18" height="20" rx="3" />
      <rect x="55" y="26" width="18" height="24" rx="3" />
      <rect x="76" y="32" width="14" height="18" rx="3" />
      <rect x="22" y="46" width="76" height="52" rx="6" fill={C.weiss} />
    </g>
    <g stroke={C.himmel} strokeWidth={4}>
      <line x1="34" y1="62" x2="86" y2="62" />
      <line x1="34" y1="74" x2="86" y2="74" />
      <line x1="34" y1="86" x2="66" y2="86" />
    </g>
  </M>
);

/* ============================================================
   ALLTAG
   ============================================================ */

/** Girokonto: Bankkarte mit Chip. */
export const MotivKarte = ({ className }: Props) => (
  <M className={className} titel="Girokonto">
    <rect x="16" y="38" width="88" height="56" rx="8" fill={C.blau} />
    <rect x="16" y="38" width="88" height="56" rx="8" />
    <rect x="16" y="52" width="88" height="10" fill={C.tief} stroke="none" />
    <rect x="28" y="70" width="18" height="14" rx="3" fill={C.messing} />
    <rect x="28" y="70" width="18" height="14" rx="3" strokeWidth={2.5} />
    <g stroke={C.himmel} strokeWidth={3}>
      <line x1="58" y1="82" x2="76" y2="82" />
      <line x1="82" y1="82" x2="92" y2="82" />
    </g>
  </M>
);

/** Dispo und Kredit: Geldschein an Kette. */
export const MotivKredit = ({ className }: Props) => (
  <M className={className} titel="Kredit">
    <rect x="20" y="54" width="62" height="40" rx="6" fill={C.weiss} />
    <circle cx="51" cy="74" r="10" fill={C.blau} stroke="none" />
    <circle cx="51" cy="74" r="10" strokeWidth={2.5} />
    <g stroke={C.nebel} strokeWidth={4}>
      <circle cx="84" cy="46" r="7" fill="none" />
      <circle cx="92" cy="32" r="7" fill="none" />
      <circle cx="97" cy="18" r="7" fill="none" />
    </g>
    <line x1="80" y1="54" x2="84" y2="52" strokeWidth={3} />
  </M>
);

/** Ratenkauf: Preisschild zerfällt in vier Teile. */
export const MotivRaten = ({ className }: Props) => (
  <M className={className} titel="Ratenkauf">
    <path d="M62 24 h30 v30 l-38 38 -30 -30 z" fill={C.weiss} />
    <circle cx="80" cy="38" r="5" fill={C.blau} stroke="none" />
    <path d="M62 24 h30 v30 l-38 38 -30 -30 z" />
    <g stroke={C.blau} strokeWidth={2.5} strokeDasharray="5 5">
      <line x1="46" y1="40" x2="76" y2="70" />
      <line x1="36" y1="52" x2="64" y2="80" />
      <line x1="56" y1="30" x2="88" y2="60" />
    </g>
  </M>
);

/** Leasing: Auto von der Seite. */
export const MotivAuto = ({ className }: Props) => (
  <M className={className} titel="Auto">
    <path d="M18 76 v-10 l10 -4 12 -16 h34 l12 16 12 4 v10 z" fill={C.blau} />
    <path d="M44 48 h26 l9 14 h-35 z" fill={C.himmel} stroke="none" />
    <path d="M18 76 v-10 l10 -4 12 -16 h34 l12 16 12 4 v10 z" />
    <line x1="60" y1="48" x2="60" y2="62" strokeWidth={2.5} />
    <g fill={C.weiss}>
      <circle cx="38" cy="78" r="10" />
      <circle cx="84" cy="78" r="10" />
    </g>
    <g fill={C.tief} stroke="none">
      <circle cx="38" cy="78" r="4" />
      <circle cx="84" cy="78" r="4" />
    </g>
    <circle cx="38" cy="78" r="10" />
    <circle cx="84" cy="78" r="10" />
  </M>
);

/** Versicherung: Schirm über Haus. */
export const MotivVersicherung = ({ className }: Props) => (
  <M className={className} titel="Versicherung">
    <path d="M38 96 v-24 h14 v24" fill={C.weiss} />
    <path d="M30 74 v22 h44 v-22" fill={C.weiss} />
    <path d="M26 74 l26 -18 26 18" fill={C.ton} />
    <path d="M26 74 l26 -18 26 18" />
    <path d="M30 74 v22 h44 v-22" />
    <rect x="44" y="80" width="14" height="16" rx="2" fill={C.blau} stroke="none" />
    <rect x="44" y="80" width="14" height="16" rx="2" strokeWidth={2.5} />
    <path d="M22 44 a30 22 0 0 1 60 0 z" fill={C.blau} />
    <path d="M22 44 a30 22 0 0 1 60 0 z" />
    <path d="M52 44 v14" strokeWidth={3} />
  </M>
);

/** Hauskauf: Haus mit Dach. */
export const MotivHaus = ({ className }: Props) => (
  <M className={className} titel="Hauskauf">
    <path d="M28 60 l32 -26 32 26" fill={C.ton} />
    <rect x="34" y="60" width="52" height="40" fill={C.weiss} />
    <path d="M28 60 l32 -26 32 26" />
    <rect x="34" y="60" width="52" height="40" />
    <rect x="52" y="76" width="16" height="24" rx="2" fill={C.blau} stroke="none" />
    <rect x="52" y="76" width="16" height="24" rx="2" strokeWidth={2.5} />
    <rect x="40" y="68" width="10" height="10" rx="2" fill={C.himmel} strokeWidth={2.5} />
    <rect x="70" y="68" width="10" height="10" rx="2" fill={C.himmel} strokeWidth={2.5} />
  </M>
);

/** Karte ohne Kredit: Karte mit Schloss. */
export const MotivKarteSicher = ({ className }: Props) => (
  <M className={className} titel="Karte ohne Kredit">
    <rect x="16" y="40" width="76" height="50" rx="8" fill={C.weiss} />
    <rect x="16" y="52" width="76" height="9" fill={C.himmel} stroke="none" />
    <rect x="16" y="40" width="76" height="50" rx="8" />
    <rect x="72" y="62" width="32" height="26" rx="5" fill={C.blau} />
    <path d="M78 62 v-7 a10 10 0 0 1 20 0 v7" strokeWidth={4} />
    <rect x="72" y="62" width="32" height="26" rx="5" />
    <circle cx="88" cy="74" r="3.5" fill={C.weiss} stroke="none" />
  </M>
);

/* ============================================================
   PFLICHTEN
   ============================================================ */

/** Zakat: offene Hand mit Münzen. */
export const MotivZakat = ({ className }: Props) => (
  <M className={className} titel="Zakat">
    <g fill={C.messing}>
      <circle cx="46" cy="34" r="9" />
      <circle cx="68" cy="28" r="9" />
      <circle cx="58" cy="48" r="9" />
    </g>
    <g>
      <circle cx="46" cy="34" r="9" />
      <circle cx="68" cy="28" r="9" />
      <circle cx="58" cy="48" r="9" />
    </g>
    <path
      d="M28 96 v-16 a6 6 0 0 1 12 0 v-8 a6 6 0 0 1 12 0 v-4 a6 6 0 0 1 12 0 v4 a6 6 0 0 1 12 2 v22 z"
      fill={C.weiss}
    />
  </M>
);

/** Nisab: Waage. */
export const MotivNisab = ({ className }: Props) => (
  <M className={className} titel="Nisab">
    <line x1="60" y1="26" x2="60" y2="94" strokeWidth={4} />
    <line x1="34" y1="94" x2="86" y2="94" strokeWidth={4} />
    <line x1="26" y1="40" x2="94" y2="40" strokeWidth={4} />
    <circle cx="60" cy="40" r="5" fill={C.blau} stroke="none" />
    <path d="M14 40 l12 22 h-24 z" fill={C.himmel} />
    <path d="M14 40 l12 22 h-24 z" transform="translate(92 0)" fill={C.messing} />
    <path d="M14 40 l12 22 h-24 z" />
    <path d="M106 40 l12 22 h-24 z" />
  </M>
);

/** Reinigen: Trichter. */
export const MotivReinigen = ({ className }: Props) => (
  <M className={className} titel="Erträge reinigen">
    <g fill={C.nebel} stroke="none">
      <circle cx="44" cy="26" r="5" />
      <circle cx="60" cy="20" r="5" />
      <circle cx="76" cy="26" r="5" />
    </g>
    <path d="M24 38 h72 l-26 30 v22 h-20 v-22 z" fill={C.weiss} />
    <path d="M24 38 h72 l-26 30 v22 h-20 v-22 z" />
    <g fill={C.blau} stroke="none">
      <circle cx="60" cy="102" r="5" />
      <circle cx="46" cy="106" r="4" />
      <circle cx="74" cy="106" r="4" />
    </g>
  </M>
);

/** Erbe: drei verbundene Kreise. */
export const MotivErbe = ({ className }: Props) => (
  <M className={className} titel="Erbe">
    <line x1="60" y1="46" x2="60" y2="62" strokeWidth={3} />
    <line x1="36" y1="62" x2="84" y2="62" strokeWidth={3} />
    <line x1="36" y1="62" x2="36" y2="70" strokeWidth={3} />
    <line x1="84" y1="62" x2="84" y2="70" strokeWidth={3} />
    <circle cx="60" cy="34" r="14" fill={C.blau} />
    <circle cx="60" cy="34" r="14" />
    <circle cx="36" cy="84" r="13" fill={C.weiss} />
    <circle cx="84" cy="84" r="13" fill={C.weiss} />
    <circle cx="36" cy="84" r="13" />
    <circle cx="84" cy="84" r="13" />
  </M>
);

/* ============================================================
   VORLAGEN UND WERKZEUGE
   ============================================================ */

/** Vertrags-Ampel. Hier ist die Ampelfarbe die Aussage, deshalb erlaubt. */
export const MotivAmpel = ({ className }: Props) => (
  <M className={className} titel="Vertrags-Ampel">
    <rect x="30" y="18" width="60" height="84" rx="7" fill={C.weiss} />
    <g stroke={C.himmel} strokeWidth={4}>
      <line x1="56" y1="34" x2="80" y2="34" />
      <line x1="56" y1="58" x2="80" y2="58" />
      <line x1="56" y1="82" x2="80" y2="82" />
    </g>
    <circle cx="44" cy="34" r="7" fill="#15803D" stroke="none" />
    <circle cx="44" cy="58" r="7" fill="#D97706" stroke="none" />
    <circle cx="44" cy="82" r="7" fill="#B91C1C" stroke="none" />
    <rect x="30" y="18" width="60" height="84" rx="7" />
  </M>
);

/** Liste: Klemmbrett mit Haken. */
export const MotivListe = ({ className }: Props) => (
  <M className={className} titel="Liste">
    <rect x="26" y="24" width="68" height="78" rx="7" fill={C.weiss} />
    <rect x="46" y="16" width="28" height="16" rx="5" fill={C.nebel} />
    <rect x="46" y="16" width="28" height="16" rx="5" />
    <g stroke={C.himmel} strokeWidth={4}>
      <line x1="52" y1="50" x2="84" y2="50" />
      <line x1="52" y1="66" x2="84" y2="66" />
      <line x1="52" y1="82" x2="84" y2="82" />
    </g>
    <g stroke={C.blau} strokeWidth={4}>
      <polyline points="34,50 38,54 45,45" />
      <polyline points="34,66 38,70 45,61" />
      <polyline points="34,82 38,86 45,77" />
    </g>
    <rect x="26" y="24" width="68" height="78" rx="7" />
  </M>
);

/** Spickzettel: Zettel mit drei Grenzwerten, Prozentzeichen macht es lesbar. */
export const MotivSpickzettel = ({ className }: Props) => (
  <M className={className} titel="Spickzettel">
    <g transform="rotate(-4 60 63)">
      <rect x="24" y="24" width="72" height="76" rx="6" fill={C.weiss} />
      <rect x="24" y="24" width="72" height="76" rx="6" />
      <g fill={C.blau} stroke="none">
        <circle cx="38" cy="44" r="4" />
        <circle cx="38" cy="64" r="4" />
        <circle cx="38" cy="84" r="4" />
      </g>
      <g fill={C.tief} stroke="none" fontFamily="system-ui, sans-serif" fontWeight="700">
        <text x="50" y="50" fontSize="17">5%</text>
        <text x="50" y="70" fontSize="17">30%</text>
        <text x="50" y="90" fontSize="17">30%</text>
      </g>
    </g>
  </M>
);

/** Rechner: Taschenrechner. */
export const MotivRechner = ({ className }: Props) => (
  <M className={className} titel="Rechner">
    <rect x="28" y="18" width="64" height="86" rx="8" fill={C.weiss} />
    <rect x="38" y="28" width="44" height="18" rx="4" fill={C.blau} stroke="none" />
    <g fill={C.himmel} stroke="none">
      <rect x="38" y="54" width="12" height="12" rx="3" />
      <rect x="54" y="54" width="12" height="12" rx="3" />
      <rect x="70" y="54" width="12" height="12" rx="3" />
      <rect x="38" y="72" width="12" height="12" rx="3" />
      <rect x="54" y="72" width="12" height="12" rx="3" />
    </g>
    <rect x="70" y="72" width="12" height="30" rx="3" fill={C.blau} stroke="none" />
    <rect x="38" y="90" width="28" height="12" rx="3" fill={C.himmel} stroke="none" />
    <rect x="28" y="18" width="64" height="86" rx="8" />
  </M>
);

/** Trading: Kerzenchart mit Würfel, der Zufall im Bild. */
export const MotivTrading = ({ className }: Props) => (
  <M className={className} titel="Trading">
    <rect x="18" y="22" width="84" height="76" rx="8" fill={C.weiss} />
    <g stroke={C.tief} strokeWidth={2.5}>
      <line x1="34" y1="34" x2="34" y2="82" />
      <line x1="52" y1="40" x2="52" y2="86" />
      <line x1="70" y1="30" x2="70" y2="78" />
      <line x1="88" y1="44" x2="88" y2="90" />
    </g>
    <rect x="28" y="46" width="12" height="22" rx="2" fill={C.blau} />
    <rect x="46" y="52" width="12" height="26" rx="2" fill={C.himmel} />
    <rect x="64" y="38" width="12" height="28" rx="2" fill={C.blau} />
    <rect x="82" y="58" width="12" height="24" rx="2" fill={C.himmel} />
    <g transform="translate(74 72) rotate(-12)">
      <rect x="0" y="0" width="30" height="30" rx="6" fill={C.sand} />
      <circle cx="8" cy="8" r="3" fill={C.tief} stroke="none" />
      <circle cx="15" cy="15" r="3" fill={C.tief} stroke="none" />
      <circle cx="22" cy="22" r="3" fill={C.tief} stroke="none" />
    </g>
  </M>
);

/** Dispo: Bankkarte, deren Kontostand ins Minus zeigt. */
export const MotivDispo = ({ className }: Props) => (
  <M className={className} titel="Dispo">
    <rect x="16" y="32" width="88" height="58" rx="8" fill={C.weiss} />
    <rect x="16" y="44" width="88" height="10" fill={C.tief} stroke="none" />
    <rect x="26" y="64" width="26" height="12" rx="3" fill={C.sand} />
    <g stroke={C.blau} strokeWidth={4}>
      <line x1="66" y1="70" x2="92" y2="70" />
    </g>
    <path d="M60 18 l-8 8 h16 z" fill={C.ton} stroke="none" />
    <line x1="60" y1="26" x2="60" y2="32" stroke={C.ton} strokeWidth={3} />
  </M>
);

/* ============================================================
   GEFÜHRTER VERGLEICH
   Bilder für die Antwortkarten unter /vergleich/start.
   ============================================================ */

/** Geld anlegen: Pflanze wächst aus Münzen. */
export const MotivWachsen = ({ className }: Props) => (
  <M className={className} titel="Geld anlegen">
    <ellipse cx="60" cy="92" rx="30" ry="8" fill={C.messing} />
    <ellipse cx="60" cy="84" rx="30" ry="8" fill={C.sand} />
    <path d="M60 84 V44" strokeWidth={4} />
    <path d="M60 60 C44 58 38 46 40 36 C54 36 60 46 60 60 Z" fill={C.blau} />
    <path d="M60 50 C76 48 84 36 82 24 C66 26 60 36 60 50 Z" fill={C.himmel} />
  </M>
);

/** Auf etwas sparen: Sparschwein mit Münze. */
export const MotivSparschwein = ({ className }: Props) => (
  <M className={className} titel="Sparen">
    <circle cx="62" cy="26" r="10" fill={C.messing} />
    <ellipse cx="58" cy="68" rx="34" ry="24" fill={C.himmel} />
    <path d="M88 60 l10 -4 v14 l-8 2" fill={C.himmel} />
    <line x1="50" y1="46" x2="70" y2="46" strokeWidth={4} />
    <line x1="40" y1="88" x2="40" y2="98" strokeWidth={5} />
    <line x1="74" y1="88" x2="74" y2="98" strokeWidth={5} />
    <circle cx="78" cy="62" r="2.5" fill={C.tief} stroke="none" />
    <path d="M26 58 q-8 -2 -8 -10" />
  </M>
);

/** Steuererklärung: Formular mit Prozentzeichen und Haken. */
export const MotivSteuer = ({ className }: Props) => (
  <M className={className} titel="Steuererklärung">
    <rect x="28" y="16" width="56" height="78" rx="6" fill={C.weiss} />
    <line x1="38" y1="32" x2="74" y2="32" stroke={C.nebel} />
    <line x1="38" y1="44" x2="66" y2="44" stroke={C.nebel} />
    <circle cx="44" cy="62" r="4" fill={C.blau} stroke="none" />
    <circle cx="64" cy="78" r="4" fill={C.blau} stroke="none" />
    <line x1="66" y1="58" x2="42" y2="82" stroke={C.blau} strokeWidth={4} />
    <circle cx="86" cy="86" r="16" fill={C.blau} />
    <polyline points="78,86 84,92 94,80" stroke={C.weiss} strokeWidth={4} />
  </M>
);

const Stapel = ({ x, n, farbe }: { x: number; n: number; farbe: string }) => (
  <>
    {Array.from({ length: n }, (_, i) => (
      <ellipse key={i} cx={x} cy={92 - i * 9} rx="16" ry="6" fill={i % 2 ? C.sand : farbe} />
    ))}
  </>
);

/** Kleiner Betrag: ein kurzer Münzstapel. */
export const MotivBetragKlein = ({ className }: Props) => (
  <M className={className} titel="Kleiner Betrag">
    <Stapel x={60} n={3} farbe={C.messing} />
  </M>
);

/** Mittlerer Betrag: zwei Stapel. */
export const MotivBetragMittel = ({ className }: Props) => (
  <M className={className} titel="Mittlerer Betrag">
    <Stapel x={42} n={4} farbe={C.messing} />
    <Stapel x={78} n={6} farbe={C.messing} />
  </M>
);

/** Großer Betrag im Monat: drei wachsende Stapel. */
export const MotivBetragGross = ({ className }: Props) => (
  <M className={className} titel="Großer Betrag">
    <Stapel x={28} n={4} farbe={C.messing} />
    <Stapel x={60} n={6} farbe={C.messing} />
    <Stapel x={92} n={8} farbe={C.messing} />
  </M>
);

/** Einmalbetrag: Geldsack. */
export const MotivGeldsack = ({ className }: Props) => (
  <M className={className} titel="Einmalbetrag">
    <path d="M46 34 L40 20 H80 L74 34" fill={C.sand} />
    <path d="M46 34 C20 56 22 100 60 100 C98 100 100 56 74 34 Z" fill={C.sand} />
    <line x1="44" y1="36" x2="76" y2="36" strokeWidth={5} stroke={C.ton} />
    <text x="60" y="80" textAnchor="middle" fontSize="30" fontWeight="700" fill={C.tief} stroke="none">€</text>
  </M>
);

/** Kurze Zeit: Sanduhr. */
export const MotivSanduhr = ({ className }: Props) => (
  <M className={className} titel="Kurze Zeit">
    <line x1="34" y1="20" x2="86" y2="20" strokeWidth={5} />
    <line x1="34" y1="100" x2="86" y2="100" strokeWidth={5} />
    <path d="M40 22 C40 46 56 52 60 60 C64 52 80 46 80 22 Z" fill={C.weiss} />
    <path d="M40 98 C40 74 56 68 60 60 C64 68 80 74 80 98 Z" fill={C.weiss} />
    <path d="M46 96 C48 84 56 80 60 76 C64 80 72 84 74 96 Z" fill={C.messing} stroke="none" />
    <path d="M50 30 H70 C68 40 62 46 60 50 C58 46 52 40 50 30 Z" fill={C.messing} stroke="none" />
  </M>
);

/** Mittlere Zeit: Kalender. */
export const MotivKalender = ({ className }: Props) => (
  <M className={className} titel="Einige Jahre">
    <rect x="24" y="28" width="72" height="68" rx="8" fill={C.weiss} />
    <path d="M24 46 H96 V36 a8 8 0 0 0 -8 -8 H32 a8 8 0 0 0 -8 8 Z" fill={C.blau} />
    <line x1="42" y1="20" x2="42" y2="36" strokeWidth={5} />
    <line x1="78" y1="20" x2="78" y2="36" strokeWidth={5} />
    <g fill={C.himmel} stroke="none">
      <rect x="34" y="56" width="12" height="10" rx="2" />
      <rect x="54" y="56" width="12" height="10" rx="2" />
      <rect x="74" y="56" width="12" height="10" rx="2" />
      <rect x="34" y="74" width="12" height="10" rx="2" />
    </g>
    <rect x="54" y="74" width="12" height="10" rx="2" fill={C.messing} stroke="none" />
  </M>
);

/** Lange Zeit: Baum. */
export const MotivBaum = ({ className }: Props) => (
  <M className={className} titel="Lange Zeit">
    <rect x="54" y="66" width="12" height="34" rx="3" fill={C.ton} />
    <circle cx="60" cy="46" r="28" fill={C.blau} />
    <circle cx="42" cy="58" r="16" fill={C.himmel} />
    <circle cx="80" cy="56" r="14" fill={C.himmel} />
    <line x1="30" y1="100" x2="90" y2="100" />
  </M>
);

/** Weiß ich noch nicht. */
export const MotivFrage = ({ className }: Props) => (
  <M className={className} titel="Weiß ich noch nicht">
    <circle cx="60" cy="60" r="38" fill={C.weiss} />
    <path d="M48 50 C48 34 72 34 72 50 C72 60 60 60 60 72" stroke={C.blau} strokeWidth={6} />
    <circle cx="60" cy="86" r="4" fill={C.blau} stroke="none" />
  </M>
);

/** Nein, egal, nichts davon. */
export const MotivNein = ({ className }: Props) => (
  <M className={className} titel="Nein">
    <line x1="38" y1="38" x2="82" y2="82" stroke={C.himmel} strokeWidth={16} />
    <line x1="82" y1="38" x2="38" y2="82" stroke={C.himmel} strokeWidth={16} />
  </M>
);

const Globus = ({ farbe = C.himmel }: { farbe?: string }) => (
  <>
    <circle cx="60" cy="60" r="36" fill={farbe} />
    <ellipse cx="60" cy="60" rx="16" ry="36" />
    <line x1="24" y1="60" x2="96" y2="60" />
    <path d="M30 42 Q60 52 90 42" />
    <path d="M30 78 Q60 68 90 78" />
  </>
);

/** Die ganze Welt. */
export const MotivGlobus = ({ className }: Props) => (
  <M className={className} titel="Welt">
    <Globus />
  </M>
);

/** USA: Streifen und Sternenfeld in Markenfarben. */
export const MotivUsa = ({ className }: Props) => (
  <M className={className} titel="USA">
    <rect x="18" y="30" width="84" height="60" rx="6" fill={C.weiss} />
    <g stroke="none" fill={C.ton}>
      <rect x="18" y="42" width="84" height="8" />
      <rect x="18" y="58" width="84" height="8" />
      <rect x="18" y="74" width="84" height="8" />
    </g>
    <rect x="18" y="30" width="38" height="28" fill={C.blau} stroke="none" />
    <g fill={C.weiss} stroke="none">
      <circle cx="28" cy="38" r="2.5" /><circle cx="38" cy="38" r="2.5" /><circle cx="48" cy="38" r="2.5" />
      <circle cx="28" cy="50" r="2.5" /><circle cx="38" cy="50" r="2.5" /><circle cx="48" cy="50" r="2.5" />
    </g>
    <rect x="18" y="30" width="84" height="60" rx="6" />
  </M>
);

/** Europa: Sternenkreis. */
export const MotivEuropa = ({ className }: Props) => (
  <M className={className} titel="Europa">
    <rect x="18" y="30" width="84" height="60" rx="6" fill={C.blau} />
    <g fill={C.messing} stroke="none">
      {Array.from({ length: 12 }, (_, i) => {
        const w = (i / 12) * Math.PI * 2;
        return <circle key={i} cx={60 + Math.sin(w) * 20} cy={60 - Math.cos(w) * 20} r="3" />;
      })}
    </g>
  </M>
);

/** Schwellenländer: Globus mit Pfeil nach oben. */
export const MotivSchwellen = ({ className }: Props) => (
  <M className={className} titel="Schwellenländer">
    <Globus farbe={C.sand} />
    <circle cx="88" cy="32" r="16" fill={C.blau} />
    <polyline points="80,34 88,24 96,34" stroke={C.weiss} strokeWidth={4} />
    <line x1="88" y1="26" x2="88" y2="42" stroke={C.weiss} strokeWidth={4} />
  </M>
);

/** Eigene Wallet: Schlüssel. */
export const MotivSchluessel = ({ className }: Props) => (
  <M className={className} titel="Eigene Wallet">
    <circle cx="42" cy="60" r="20" fill={C.messing} />
    <circle cx="42" cy="60" r="7" fill={C.hell} />
    <path d="M62 60 H100 V74 M88 60 V72" strokeWidth={6} />
  </M>
);

/** Beim Anbieter verwahrt: Tresor. */
export const MotivTresor = ({ className }: Props) => (
  <M className={className} titel="Beim Anbieter">
    <rect x="22" y="22" width="76" height="70" rx="8" fill={C.nebel} />
    <rect x="32" y="32" width="56" height="50" rx="4" fill={C.weiss} />
    <circle cx="60" cy="57" r="12" fill={C.blau} />
    <line x1="60" y1="57" x2="60" y2="48" stroke={C.weiss} />
    <line x1="32" y1="92" x2="32" y2="100" strokeWidth={5} />
    <line x1="88" y1="92" x2="88" y2="100" strokeWidth={5} />
  </M>
);

/** Gute App: Handy mit Haken. */
export const MotivHandy = ({ className }: Props) => (
  <M className={className} titel="App">
    <rect x="38" y="14" width="44" height="92" rx="9" fill={C.weiss} />
    <rect x="44" y="24" width="32" height="62" rx="3" fill={C.blau} stroke="none" />
    <polyline points="52,56 58,62 69,48" stroke={C.weiss} strokeWidth={4} />
    <circle cx="60" cy="96" r="3" fill={C.tief} stroke="none" />
  </M>
);

/** Bargeld: Scheine. */
export const MotivScheine = ({ className }: Props) => (
  <M className={className} titel="Bargeld">
    <rect x="26" y="34" width="72" height="40" rx="5" fill={C.himmel} transform="rotate(-8 62 54)" />
    <rect x="22" y="46" width="72" height="40" rx="5" fill={C.weiss} />
    <circle cx="58" cy="66" r="10" fill={C.messing} />
    <line x1="30" y1="54" x2="38" y2="54" />
    <line x1="78" y1="78" x2="86" y2="78" />
  </M>
);

/** Guter Service: Kopfhörer mit Mikro. */
export const MotivService = ({ className }: Props) => (
  <M className={className} titel="Service">
    <path d="M28 66 V56 a32 32 0 0 1 64 0 V66" strokeWidth={5} />
    <rect x="20" y="62" width="16" height="26" rx="6" fill={C.blau} />
    <rect x="84" y="62" width="16" height="26" rx="6" fill={C.blau} />
    <path d="M92 88 q0 12 -22 12" />
    <rect x="58" y="94" width="14" height="10" rx="5" fill={C.messing} />
  </M>
);

/** Selbstständig: Aktentasche. */
export const MotivTasche = ({ className }: Props) => (
  <M className={className} titel="Selbstständig">
    <path d="M46 40 V30 a6 6 0 0 1 6 -6 H68 a6 6 0 0 1 6 6 V40" />
    <rect x="20" y="40" width="80" height="52" rx="8" fill={C.ton} />
    <path d="M20 60 H100" />
    <rect x="52" y="54" width="16" height="12" rx="3" fill={C.messing} />
  </M>
);

/** Direkt zum Ergebnis: Pokal. */
export const MotivPokal = ({ className }: Props) => (
  <M className={className} titel="Ergebnis">
    <path d="M40 22 H80 V44 a20 20 0 0 1 -40 0 Z" fill={C.messing} />
    <path d="M40 28 H28 q0 18 14 20 M80 28 H92 q0 18 -14 20" />
    <line x1="60" y1="64" x2="60" y2="82" strokeWidth={5} />
    <rect x="42" y="82" width="36" height="12" rx="4" fill={C.blau} />
    <polyline points="52,38 58,44 69,31" stroke={C.weiss} strokeWidth={4} />
  </M>
);


export const motive = {
  zins: MotivZins,
  gharar: MotivGharar,
  maysir: MotivMaysir,
  kompass: MotivKompass,
  fehler: MotivFehler,
  etf: MotivEtf,
  aktienPruefen: MotivAktienPruefen,
  sukuk: MotivSukuk,
  gold: MotivGold,
  silber: MotivSilber,
  krypto: MotivKrypto,
  datenbank: MotivDatenbank,
  karte: MotivKarte,
  kredit: MotivKredit,
  raten: MotivRaten,
  auto: MotivAuto,
  versicherung: MotivVersicherung,
  haus: MotivHaus,
  karteSicher: MotivKarteSicher,
  zakat: MotivZakat,
  nisab: MotivNisab,
  reinigen: MotivReinigen,
  erbe: MotivErbe,
  ampel: MotivAmpel,
  liste: MotivListe,
  spickzettel: MotivSpickzettel,
  rechner: MotivRechner,
  trading: MotivTrading,
  dispo: MotivDispo,
  wachsen: MotivWachsen,
  sparschwein: MotivSparschwein,
  steuer: MotivSteuer,
  betragKlein: MotivBetragKlein,
  betragMittel: MotivBetragMittel,
  betragGross: MotivBetragGross,
  geldsack: MotivGeldsack,
  sanduhr: MotivSanduhr,
  kalender: MotivKalender,
  baum: MotivBaum,
  frage: MotivFrage,
  nein: MotivNein,
  globus: MotivGlobus,
  usa: MotivUsa,
  europa: MotivEuropa,
  schwellen: MotivSchwellen,
  schluessel: MotivSchluessel,
  tresor: MotivTresor,
  handy: MotivHandy,
  scheine: MotivScheine,
  service: MotivService,
  tasche: MotivTasche,
  pokal: MotivPokal,
} as const;

export type MotivName = keyof typeof motive;
