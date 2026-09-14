import { Check, ExternalLink, Info, Minus, Star, X } from "lucide-react";
import { Link } from "react-router-dom";
import {
  UNGEPRUEFT,
  noteWort,
  noteZahl,
  type CheckStatus,
  type Quelle,
  type VergleichsSpalte,
  type Zellwert,
} from "./vergleichTypen";

/**
 * Die kleinen wiederkehrenden Teile beider Vergleiche. Sie liegen zusammen,
 * damit Tabelle und Karte garantiert dasselbe zeigen.
 */

/* ---------------------------------------------------------------- Sterne */

/**
 * Fuenf Sterne, halbe Schritte. Ohne Note bleiben alle leer, dazu steht
 * daneben, dass noch nicht bewertet wurde. Ein leerer Sternebalken ist
 * ehrlicher als gar keiner: er zeigt, dass die Bewertung vorgesehen ist.
 */
export const Sterne = ({ note }: { note: number | null }) => (
  <span className="inline-flex items-center gap-[2px]" aria-hidden>
    {[0, 1, 2, 3, 4].map((i) => {
      const anteil = note === null ? 0 : Math.min(1, Math.max(0, note - i));
      return (
        <span key={i} className="relative inline-block h-4 w-4">
          <Star className="absolute inset-0 h-4 w-4 text-muted-foreground/35" />
          {anteil > 0 && (
            <span
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${anteil * 100}%` }}
            >
              <Star className="h-4 w-4 fill-warning text-warning" />
            </span>
          )}
        </span>
      );
    })}
  </span>
);

/** Note als Wort, Zahl und Sterne. Der Block steht in Tabelle und Karte gleich. */
export const NotenBlock = ({
  note,
  stand,
  mittig = false,
}: {
  note: number | null;
  stand?: string;
  mittig?: boolean;
}) => (
  <div className={mittig ? "text-center" : ""}>
    <p className="text-[15px] font-bold text-foreground">
      {noteWort(note)}
      {note !== null && (
        <span className="font-medium text-muted-foreground"> ({noteZahl(note)})</span>
      )}
    </p>
    <div className={`mt-1 flex ${mittig ? "justify-center" : ""}`}>
      <Sterne note={note} />
    </div>
    <p className="mt-1 text-[12px] text-muted-foreground">
      {note === null ? "Halal-Kriterien noch offen" : stand}
    </p>
  </div>
);

/* --------------------------------------------------------------- Etikett */

const etikettTon: Record<string, string> = {
  empfehlung: "bg-primary/10 text-primary",
  bonus: "bg-success/10 text-success",
  hinweis: "bg-accent/10 text-accent",
};

/**
 * Der Streifen ueber einer Spalte oder Karte. Ohne Inhalt bleibt der Platz
 * sichtbar frei, damit erkennbar ist, wo spaeter Empfehlung oder Bonus steht.
 */
export const SpaltenEtikett = ({
  etikett,
  rang,
}: {
  etikett: VergleichsSpalte["etikett"];
  rang: number;
}) => (
  <div className="flex items-center gap-2 border-b border-border px-2 py-1.5">
    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-surface text-[11px] font-bold text-muted-foreground">
      {rang}
    </span>
    {etikett ? (
      <span
        className={`truncate rounded-full px-2 py-0.5 text-[11px] font-semibold ${etikettTon[etikett.ton]}`}
      >
        {etikett.text}
      </span>
    ) : (
      <span className="h-[19px]" aria-hidden />
    )}
  </div>
);

/* ----------------------------------------------------------- Angebotsknopf */

export const AngebotsKnopf = ({
  link,
  breit = false,
}: {
  link?: string;
  breit?: boolean;
}) => {
  /* Aktiv und deaktiviert haben dieselben Masse, damit die Zeile in beiden
     Zustaenden gleich hoch ist und der Text mittig steht. Kein z-index:
     der Knopf bleibt in seiner Zelle und laeuft beim Scrollen unter der
     klebenden Kopfzeile durch, statt sie zu uebermalen. */
  const basis =
    "flex min-h-[52px] w-full shrink-0 items-center justify-center rounded-lg px-3 text-center text-[14px] font-semibold leading-tight";
  if (!link) {
    return (
      <div className="w-full">
        <button
          type="button"
          disabled
          className={`${basis} cursor-not-allowed border border-border bg-muted text-muted-foreground`}
        >
          Zum Angebot
        </button>
        <p className="mt-1 text-center text-[11px] text-muted-foreground">
          noch keine Partnerschaft
        </p>
      </div>
    );
  }
  return (
    <Link
      to={link}
      className={`${basis} bg-primary text-primary-foreground transition-colors hover:bg-primary-hover`}
    >
      Zum Angebot*
    </Link>
  );
};

/* ------------------------------------------------------------------ Werte */

const ampelFarbe: Record<CheckStatus, string> = {
  unbekannt: "bg-muted-foreground/40",
  gut: "bg-success",
  teils: "bg-warning",
  schlecht: "bg-destructive",
};

const quellenText = (q?: Quelle) =>
  q ? ["Quelle: " + (q.hinweis ?? q.url ?? "unbekannt"), q.stand ? `Stand ${q.stand}` : null].filter(Boolean).join(", ") : undefined;

/**
 * Link zum Beleg. Nur bei Halal-Merkmalen sichtbar, weil dort jeder Wert beim
 * Anbieter nachgelesen wurde. Kosten stammen gesammelt aus einer Quelle, die
 * unter der Tabelle steht.
 */
const BelegLink = ({ quelle }: { quelle?: Quelle }) =>
  quelle?.url ? (
    <a
      href={quelle.url}
      target="_blank"
      rel="noopener noreferrer nofollow"
      title={quellenText(quelle)}
      className="inline-flex align-middle text-muted-foreground/70 hover:text-primary"
    >
      <ExternalLink className="ml-1 h-3.5 w-3.5" aria-label="Beleg öffnen" />
    </a>
  ) : null;

/** Eine Zelle. Kennt Freitext, Ampel und Haken. Die Quelle steht im Tooltip. */
export const ZellInhalt = ({ wert, art }: { wert?: Zellwert; art: string }) => {
  const titel = quellenText(wert?.quelle);

  if (art === "ampel") {
    const status = wert?.status ?? "unbekannt";
    return (
      <span className="inline-flex items-center gap-2" title={titel}>
        <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${ampelFarbe[status]}`} aria-hidden />
        <span className={status === "unbekannt" ? "text-muted-foreground" : "text-foreground"}>
          {status === "unbekannt" ? UNGEPRUEFT : status === "gut" ? "ja" : status === "schlecht" ? "nein" : (wert?.text ?? "")}
        </span>
        {status !== "unbekannt" && <BelegLink quelle={wert?.quelle} />}
      </span>
    );
  }

  if (art === "janein") {
    const j = wert?.jaNein;
    if (j === true) return <span title={titel}><Check className="mx-auto h-5 w-5 text-success" aria-label="ja" /></span>;
    if (j === false) return <span title={titel}><X className="mx-auto h-5 w-5 text-destructive" aria-label="nein" /></span>;
    return (
      <Minus className="mx-auto h-5 w-5 text-muted-foreground/50" aria-label={UNGEPRUEFT} />
    );
  }

  return wert?.text ? (
    <span className="text-foreground" title={titel}>{wert.text}</span>
  ) : (
    <span className="text-muted-foreground">{UNGEPRUEFT}</span>
  );
};

/** Kleines i mit Erklaerung. Reine Beschriftung, deshalb kein Markenblau. */
export const HinweisPunkt = ({ text }: { text?: string }) =>
  text ? (
    <span title={text} className="inline-flex align-middle">
      <Info className="ml-1 h-3.5 w-3.5 text-muted-foreground/70" aria-label={text} />
    </span>
  ) : null;
