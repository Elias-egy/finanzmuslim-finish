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

/** Kategorien mit fertigem Vergleich und ihre Adresse. Steht eine Kategorie
 *  nicht hier, zeigt die Box neutral auf die Vergleichsuebersicht, nie
 *  "wird gerade erstellt": ein Leser und ein Netzwerk-Pruefer lesen das als
 *  unfertige Seite. */
const fertigeVergleiche: Record<string, string> = {
  Depot: "/vergleich/depot",
  Girokonto: "/vergleich/girokonto",
  Krypto: "/vergleich/krypto",
  Edelmetalle: "/vergleich/edelmetalle",
  "Halal-Screening-Apps": "/vergleich/screening-apps",
};

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
        <Link
          to={linkZiel ?? "/vergleiche"}
          rel={linkZiel?.startsWith("/out/") ? "sponsored nofollow" : undefined}
          className="btn-primary mt-2"
        >
          Zu {anbieter}
        </Link>
      </aside>
    );
  }

  const vergleichsSeite = fertigeVergleiche[kategorie];
  const istVergleich = Boolean(vergleichsSeite) || kategorie === "Baufinanzierung";

  return (
    <aside className="rounded-2xl bg-hero p-6 md:p-8">
      <span className="badge-new">{istVergleich ? "Unser Vergleich" : kategorie}</span>
      <p className="mt-3 text-[20px] font-bold text-foreground">
        {ueberschrift ?? `${kategorie} vergleichen`}
      </p>
      <p className="mt-2 text-[16px] leading-relaxed text-foreground/90">
        {text ??
          (vergleichsSeite
            ? `Im ${kategorie}-Vergleich siehst du, bei wem du ohne Zinsen startest und was es kostet.`
            : istVergleich
              ? "Depot, Girokonto, Krypto und Edelmetalle: alle Vergleiche mit denselben Halal-Kriterien."
              : "")}
      </p>
      <Link to={linkZiel ?? vergleichsSeite ?? "/vergleiche"} className="btn-primary mt-5">
        {knopf ?? (vergleichsSeite ? `Zum ${kategorie}-Vergleich` : istVergleich ? "Zu den Vergleichen" : "Ansehen")}
      </Link>
    </aside>
  );
};

export default EmpfehlungsBox;
