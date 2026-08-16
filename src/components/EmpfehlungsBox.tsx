import { Link } from "react-router-dom";

export type EmpfehlungsBoxProps = {
  /** Zum Beispiel "Depot" oder "Girokonto". */
  kategorie: string;
  /** Solange leer, zeigt die Box die Variante "vergleich". */
  anbieter?: string;
  /** Ein Satz, warum dieser Anbieter vorn liegt. */
  vorteil?: string;
  /** Das konkrete Angebot, wird hervorgehoben. */
  angebot?: string;
  /** Immer ein interner Pfad. Bei "empfehlung" immer ueber /out/name. */
  linkZiel?: string;
  variante?: "vergleich" | "empfehlung";
  /** Optionale eigene Ueberschrift fuer die Variante "vergleich". */
  ueberschrift?: string;
  /** Eigener Satz statt "Unser X-Vergleich wird gerade erstellt".
   *  Noetig, sobald die Box nicht auf einen Vergleich zeigt, sondern auf eine
   *  fertige Seite. "Unser Guide-Vergleich" ergibt sonst keinen Sinn. */
  text?: string;
  /** Eigene Knopfbeschriftung statt "Zu den Vergleichen". */
  knopf?: string;
};

/** Kategorien, zu denen es wirklich einen Vergleich gibt oder geben wird.
 *  Alles andere bekommt einen neutralen Satz. */
const echteVergleiche = [
  "Depot",
  "Girokonto",
  "Baufinanzierung",
  "Halal-Screening-Apps",
  "Kinderdepot",
  "Steuersoftware",
];

/**
 * Platzhalter fuer die spaetere Testsieger-Werbung.
 * Ohne Anbieter zeigt die Box nur den Hinweis auf den kommenden Vergleich.
 * Mit Anbieter wird daraus eine Empfehlung, immer mit Werbekennzeichnung.
 */
const EmpfehlungsBox = ({
  kategorie,
  anbieter,
  vorteil,
  angebot,
  linkZiel,
  variante,
  ueberschrift,
  text,
  knopf,
}: EmpfehlungsBoxProps) => {
  const modus = anbieter ? "empfehlung" : variante === "empfehlung" ? "vergleich" : variante ?? "vergleich";

  if (modus === "empfehlung" && anbieter) {
    return (
      <aside className="rounded-2xl bg-hero p-6 md:p-8">
        <span className="badge-new">Unsere Nummer 1 im Vergleich</span>
        <p className="mt-3 text-[20px] font-bold text-foreground">{anbieter}</p>
        {vorteil && <p className="mt-2 text-[16px] leading-relaxed text-foreground/90">{vorteil}</p>}
        {angebot && (
          <p className="mt-3 rounded-lg bg-card px-4 py-3 text-[16px] font-semibold text-foreground">{angebot}</p>
        )}
        <p className="mt-5 text-[13px] text-muted-foreground">
          Werbung. Für dich entstehen keine Mehrkosten.
        </p>
        <Link to={linkZiel ?? "/vergleiche"} className="btn-primary mt-2">
          Zu {anbieter}
        </Link>
      </aside>
    );
  }

  const istVergleich = echteVergleiche.includes(kategorie);

  return (
    <aside className="rounded-2xl bg-hero p-6 md:p-8">
      <span className="badge-new">{istVergleich ? "Unser Vergleich" : kategorie}</span>
      <p className="mt-3 text-[20px] font-bold text-foreground">
        {ueberschrift ?? `${kategorie} vergleichen`}
      </p>
      <p className="mt-2 text-[16px] leading-relaxed text-foreground/90">
        {text ?? (istVergleich ? `Unser ${kategorie}-Vergleich wird gerade erstellt.` : "")}
      </p>
      <Link to={linkZiel ?? "/vergleiche"} className="btn-primary mt-5">
        {knopf ?? (istVergleich ? "Zu den Vergleichen" : "Ansehen")}
      </Link>
    </aside>
  );
};

export default EmpfehlungsBox;
