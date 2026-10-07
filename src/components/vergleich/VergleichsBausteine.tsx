import { Check, Info, Minus, Star, X } from "lucide-react";
import { dealFuer, schildText } from "@/data/deals";
import { Link } from "react-router-dom";
import {
  KEINE_ANGABE,
  einzelheiten,
  noteWort,
  noteZahl,
  quellenText,
  type CheckStatus,
  type VergleichsSpalte,
  type VergleichsZeile,
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
      {note === null ? "" : stand}
    </p>
  </div>
);

/* --------------------------------------------------------------- Etikett */

const etikettTon: Record<string, string> = {
  empfehlung: "bg-primary/10 text-primary",
  bonus: "bg-success/10 text-success",
  hinweis: "bg-accent/10 text-accent",
  platz: "bg-muted text-foreground",
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

/* ------------------------------------------------------------- Bonusschild */

/**
 * Schild unter dem Knopf, wie bei Finanzfluss: "200 € Bonus". Steht nur da, wenn
 * in `deals.ts` ein Betrag mit Quelle beim Anbieter und laufender Frist steht.
 * Der Bonus ändert nie die Reihenfolge, auch Finanzfluss wertet ihn nicht.
 */
export const BonusSchild = ({ anbieterId, className = "" }: { anbieterId: string; className?: string }) => {
  const deal = dealFuer(anbieterId);
  if (!deal) return null;
  return (
    <p
      className={`mx-auto mt-1.5 w-fit rounded-md border border-success/50 bg-success/10 px-2 py-0.5 text-center text-[12px] font-semibold text-success ${className}`}
      title={`${deal.bedingungen}${deal.gueltigBis ? ` Gültig bis ${deal.gueltigBis.split("-").reverse().join(".")}.` : ""}`}
    >
      {schildText(deal)}
    </p>
  );
};

/* ----------------------------------------------------------- Angebotsknopf */

export const AngebotsKnopf = ({
  link,
  breit = false,
  abgeraten = false,
}: {
  link?: string;
  breit?: boolean;
  /** Anbieter, von dem wir abraten. Nie ein Partnerlink, und der Grund steht dabei. */
  abgeraten?: boolean;
}) => {
  /* Aktiv und deaktiviert haben dieselben Masse, damit die Zeile in beiden
     Zustaenden gleich hoch ist und der Text mittig steht. Kein z-index:
     der Knopf bleibt in seiner Zelle und laeuft beim Scrollen unter der
     klebenden Kopfzeile durch, statt sie zu uebermalen. */
  const basis =
    "flex min-h-[52px] w-full shrink-0 items-center justify-center rounded-lg px-3 text-center text-[14px] font-semibold leading-tight";
  /* Ohne Partnerlink wie bei Finanzfluss: derselbe Knopf, blass und nicht klickbar,
     mit dem Hinweis, dass man das Angebot beim Anbieter selbst abschließt. */
  if (!link && !abgeraten) {
    return (
      <button
        type="button"
        disabled
        className={`${basis} cursor-not-allowed bg-primary px-2 text-[12px] font-normal leading-[14px] text-primary-foreground opacity-40`}
      >
        Beim Anbieter direkt abschließbar
      </button>
    );
  }
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
        <p className="mt-1 text-center text-[11px] text-destructive">kein Link, wir empfehlen das nicht</p>
      </div>
    );
  }
  return (
    <Link
      to={link}
      rel="sponsored nofollow"
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

/**
 * Eine Zelle. Kennt Freitext, Ampel und Haken und zeigt nur den Wert: Leser sehen das Ergebnis,
 * die Recherche bleibt im Hintergrund (Elias, 14.09.2026). Der Satz zur Zins-Ampel und die Quellen
 * stehen erst beim aufgeklappten Angebot (`AngebotsEinzelheiten`, Elias, 07.10.2026). Nur die
 * Startseite je Partner zeigt mit `mitQuelle` Quelle und Stand unter dem Wert.
 */
export const ZellInhalt = ({
  wert,
  art,
  mitQuelle = false,
}: {
  wert?: Zellwert;
  art: string;
  mitQuelle?: boolean;
}) => {
  if (art === "ampel") {
    const status = wert?.status ?? "unbekannt";
    return (
      <span className="inline-flex items-center gap-2">
        <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${ampelFarbe[status]}`} aria-hidden />
        <span className={status === "unbekannt" ? "text-muted-foreground" : "text-foreground"}>
          {status === "unbekannt" ? KEINE_ANGABE : status === "gut" ? "ja" : status === "schlecht" ? "nein" : "abschaltbar"}
        </span>
      </span>
    );
  }

  if (art === "janein") {
    const j = wert?.jaNein;
    if (j === true) return <Check className="mx-auto h-5 w-5 text-success" aria-label="ja" />;
    if (j === false) return <X className="mx-auto h-5 w-5 text-destructive" aria-label="nein" />;
    return (
      <Minus className="mx-auto h-5 w-5 text-muted-foreground/50" aria-label="ohne Angabe" />
    );
  }

  if (mitQuelle && wert?.text && wert.quelle?.anzeige) {
    const beleg = `Quelle: ${quellenText(wert.quelle)}`;
    return (
      <span className="inline-flex flex-col gap-0.5">
        <span className="text-foreground">{wert.text}</span>
        {wert.quelle.url ? (
          <a
            href={wert.quelle.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-normal leading-[14px] text-muted-foreground underline underline-offset-2 hover:text-primary"
          >
            {beleg}
          </a>
        ) : (
          <span className="text-[11px] font-normal leading-[14px] text-muted-foreground">{beleg}</span>
        )}
      </span>
    );
  }

  return wert?.text ? (
    <span className="text-foreground">{wert.text}</span>
  ) : (
    <span className="text-muted-foreground" aria-label="ohne Angabe">{KEINE_ANGABE}</span>
  );
};

/* ------------------------------------------------- Aufgeklapptes Angebot */

/** Der Satz zur Zins-Ampel: was der Besucher tun oder lassen muss. Etwas größer als die Quellen. */
export const ZinsSatz = ({ spalte, zeilen }: { spalte: VergleichsSpalte; zeilen: VergleichsZeile[] }) => {
  const { zins } = einzelheiten(spalte, zeilen);
  if (!zins) return null;
  return (
    <p className="text-[14px] leading-[21px] text-foreground lg:text-[15px] lg:leading-[23px]">
      <span className="font-semibold">{zins.label}:</span> {zins.satz}
    </p>
  );
};

/** Quelle und Stand je Wert, klein und am Ende. */
export const QuellenListe = ({ spalte, zeilen }: { spalte: VergleichsSpalte; zeilen: VergleichsZeile[] }) => {
  const { quellen } = einzelheiten(spalte, zeilen);
  if (quellen.length === 0) return null;
  return (
    <div className="text-[12px] leading-[17px] text-muted-foreground">
      <p className="font-semibold">Quellen</p>
      <ul className="mt-0.5">
        {quellen.map((q) => (
          <li key={q.key}>
            {q.label}:{" "}
            {q.quelle.url ? (
              <a
                href={q.quelle.url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-primary"
              >
                {quellenText(q.quelle)}
              </a>
            ) : (
              quellenText(q.quelle)
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

/**
 * Was hinter „Produktdetails“ steht: der Satz zur Zins-Ampel, die übrigen Werte, am Ende die Quellen.
 * `ohne` nimmt Zeilen heraus, die schon darüber stehen.
 */
export const ProduktDetails = ({
  spalte,
  zeilen,
  ohne = [],
}: {
  spalte: VergleichsSpalte;
  zeilen: VergleichsZeile[];
  ohne?: string[];
}) => {
  const rest = zeilen.filter((z) => !z.imRaster && !z.key.startsWith("__") && !ohne.includes(z.key));
  return (
    <div className="border-t border-border pt-3 text-left">
      <ZinsSatz spalte={spalte} zeilen={zeilen} />
      <dl className="mt-1">
        {rest.map((z) => (
          <div
            key={z.key}
            className="flex flex-wrap items-center justify-between gap-2 border-b border-border py-2 text-[14px] last:border-b-0"
          >
            <dt className="text-muted-foreground">
              {z.label}
              <HinweisPunkt text={z.hinweis} />
            </dt>
            <dd className="text-right">
              <ZellInhalt wert={spalte.werte[z.key]} art={z.art} />
            </dd>
          </div>
        ))}
      </dl>
      <div className="mt-1 border-t border-border pt-3 empty:hidden">
        <QuellenListe spalte={spalte} zeilen={zeilen} />
      </div>
    </div>
  );
};

/** Kleines i mit Erklaerung. Reine Beschriftung, deshalb kein Markenblau. */
export const HinweisPunkt = ({ text }: { text?: string }) =>
  text ? (
    <span title={text} className="inline-flex align-middle">
      <Info className="ml-1 h-3.5 w-3.5 text-muted-foreground/70" aria-label={text} />
    </span>
  ) : null;
