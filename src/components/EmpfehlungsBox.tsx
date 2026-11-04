import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import AnbieterLogo from "@/components/AnbieterLogo";
import { hatLogos, logosFuer } from "@/lib/anbieterLogos";

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
      <aside className="border border-border bg-background p-6 md:p-8">
        <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-primary">Unsere Nummer 1 im Vergleich</p>
        <p className="font-titel mt-2.5 text-[23px] leading-[1.2] text-foreground">{anbieter}</p>
        {vorteil && <p className="mt-2 text-[16px] leading-relaxed text-foreground/90">{vorteil}</p>}
        {angebot && (
          <p className="mt-3 border-l-2 border-primary pl-4 text-[16px] font-semibold text-foreground">{angebot}</p>
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

  /* Zeigt die Box auf einen Vergleich mit Anbietern, bringt sie deren Logos mit (Elias, 21.09.2026:
     mehr mit Logos arbeiten, der Aufruf soll schmackhaft sein). Sonst bleibt sie ruhig hellblau. */
  const logoDaten = hatLogos(kategorie) ? logosFuer(kategorie) : null;
  const sichtbar = logoDaten?.logos.slice(0, 5) ?? [];
  const rest = logoDaten ? logoDaten.gesamt - sichtbar.length : 0;

  return (
    <aside className="border border-border bg-background p-6 md:p-8">
      {sichtbar.length > 0 && (
        <div className="mb-4 flex items-center">
          <div className="flex -space-x-2.5">
            {sichtbar.map((a) => (
              <span key={a.name} className="rounded-full bg-white p-[3px] ring-1 ring-border">
                <AnbieterLogo name={a.name} domain={a.domain} />
              </span>
            ))}
          </div>
          {rest > 0 && (
            <span className="ml-3 font-mono text-[13px] text-muted-foreground">
              + {rest}
            </span>
          )}
        </div>
      )}
      <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-primary">{istVergleich ? "Unser Vergleich" : kategorie}</p>
      <p className="font-titel mt-2.5 text-[23px] leading-[1.2] text-foreground">
        {ueberschrift ?? `${kategorie} vergleichen`}
      </p>
      <p className="mt-2.5 text-[16px] leading-relaxed text-foreground/75">
        {text ??
          (vergleichsSeite
            ? `Im ${kategorie}-Vergleich siehst du, bei wem du ohne Zinsen startest und was es kostet.`
            : istVergleich
              ? "Depot, Girokonto, Krypto und Edelmetalle: alle Vergleiche mit denselben Halal-Kriterien."
              : "")}
      </p>
      {/* Knopf wie der Depot-Kasten auf /blog/halal-etf (SEO47) */}
      <Link to={linkZiel ?? vergleichsSeite ?? "/vergleiche"} className="leuchtlinie mt-6 inline-block">
        <span className="flex min-h-[48px] items-center gap-2 bg-foreground px-5 py-3 font-mono text-[13px] uppercase tracking-[0.12em] text-background">
          {knopf ?? (vergleichsSeite ? `Zum ${kategorie}-Vergleich` : istVergleich ? "Zu den Vergleichen" : "Ansehen")}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </span>
      </Link>
    </aside>
  );
};

export default EmpfehlungsBox;
