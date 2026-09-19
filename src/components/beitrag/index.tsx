import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Lightbulb, Minus, X } from "lucide-react";

/**
 * Bausteine für Wissensbeiträge. Ein Satz Bauteile für alle Beiträge, damit
 * Abstände, Schriftgrößen und Farben überall gleich sind.
 *
 * Regeln:
 *   - Grün, Gelb, Rot nur als Bewertung (Ampel, Fall, ProContra). Nie als Deko.
 *   - Helle Fläche #EBF2FF (bg-hero) für alles, was der Leser sich merken soll.
 *   - Weiße Karte mit Rahmen (card-surface) für Listen und Schritte.
 *   - Jeder Baustein funktioniert bei 320 Pixel Breite.
 */

/* ------------------------------------------------------------------ */
/* Merksatz: der eine Satz, den man aus dem Abschnitt mitnimmt.        */
/* ------------------------------------------------------------------ */
export const Merksatz = ({ children, label = "Merksatz" }: { children: ReactNode; label?: string }) => (
  <aside className="my-6 rounded-2xl border-l-4 border-primary bg-hero py-5 pl-5 pr-6 md:pl-6">
    <p className="eyebrow">{label}</p>
    <p className="mt-1.5 text-[19px] font-bold leading-snug text-foreground md:text-[21px]">{children}</p>
  </aside>
);

/* ------------------------------------------------------------------ */
/* Frage: der Haken, der einen Abschnitt öffnet.                       */
/* ------------------------------------------------------------------ */
export const Frage = ({ children }: { children: ReactNode }) => (
  <p className="my-5 flex items-start gap-3 text-[19px] font-semibold leading-snug text-foreground md:text-[20px]">
    <span
      aria-hidden
      className="mt-[3px] flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-[15px] font-bold text-primary"
    >
      ?
    </span>
    <span>{children}</span>
  </p>
);

/* ------------------------------------------------------------------ */
/* Begriff: ein Fachwort, einmal sauber erklärt. Arabisch in Klammern. */
/* ------------------------------------------------------------------ */
export const Begriff = ({
  wort,
  arabisch,
  children,
}: {
  wort: string;
  arabisch?: string;
  children: ReactNode;
}) => (
  <aside className="my-5 rounded-xl border border-border bg-card px-5 py-4">
    <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Begriff</p>
    <p className="mt-1 text-[17px] font-bold text-foreground">
      {wort}
      {arabisch && <span className="ml-2 font-medium text-muted-foreground">({arabisch})</span>}
    </p>
    <p className="mt-1.5 text-[16px] leading-relaxed text-muted-foreground">{children}</p>
  </aside>
);

/* ------------------------------------------------------------------ */
/* Hinweis: "Gut zu wissen", am Rand des Themas.                       */
/* ------------------------------------------------------------------ */
export const Hinweis = ({ titel = "Gut zu wissen", children }: { titel?: string; children: ReactNode }) => (
  <aside className="my-6 flex gap-4 rounded-2xl border border-border bg-card p-5">
    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
      <Lightbulb className="h-[18px] w-[18px]" aria-hidden />
    </span>
    <div className="min-w-0">
      <p className="text-[16px] font-bold text-foreground">{titel}</p>
      <div className="mt-1 space-y-2 text-[16px] leading-relaxed text-muted-foreground">{children}</div>
    </div>
  </aside>
);

/* ------------------------------------------------------------------ */
/* Schritte: nummeriert, mit Verbindungslinie.                          */
/* ------------------------------------------------------------------ */
export type Schritt = { titel: string; text: ReactNode };

export const Schritte = ({ schritte, start = 1 }: { schritte: Schritt[]; start?: number }) => (
  <ol className="my-6 space-y-0">
    {schritte.map((s, i) => (
      <li key={s.titel} className="relative flex gap-4 pb-6 last:pb-0">
        {i < schritte.length - 1 && (
          <span aria-hidden className="absolute left-[19px] top-10 h-[calc(100%-2.5rem)] w-px bg-border" />
        )}
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-[16px] font-bold text-primary-foreground">
          {start + i}
        </span>
        <div className="min-w-0 flex-1 pt-1.5">
          <p className="text-[17px] font-bold leading-snug text-foreground">{s.titel}</p>
          <div className="mt-1.5 space-y-2 text-[16px] leading-relaxed text-muted-foreground">{s.text}</div>
        </div>
      </li>
    ))}
  </ol>
);

/* ------------------------------------------------------------------ */
/* Ampel: Bewertung eines Falls. Farbe ist hier eine Bewertung.         */
/* ------------------------------------------------------------------ */
export type Ton = "gruen" | "gelb" | "rot";

const tonKlasse: Record<Ton, string> = {
  gruen: "bg-success",
  gelb: "bg-warning",
  rot: "bg-destructive",
};

export const AmpelPunkt = ({ ton, wort }: { ton: Ton; wort: string }) => (
  <span className="inline-flex items-center gap-2 text-[13px] font-semibold text-muted-foreground">
    <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${tonKlasse[ton]}`} aria-hidden />
    {wort}
  </span>
);

export type FallProps = { titel: string; ton: Ton; wort: string; text: ReactNode };

export const Fall = ({ titel, ton, wort, text }: FallProps) => (
  <div className="card-surface p-5">
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
      <p className="text-[17px] font-bold text-foreground">{titel}</p>
      <AmpelPunkt ton={ton} wort={wort} />
    </div>
    <div className="mt-2 text-[16px] leading-relaxed text-muted-foreground">{text}</div>
  </div>
);

export const Faelle = ({ faelle }: { faelle: FallProps[] }) => (
  <div className="my-6 space-y-3">
    {faelle.map((f) => (
      <Fall key={f.titel} {...f} />
    ))}
  </div>
);

/* ------------------------------------------------------------------ */
/* Gegenüber: zwei Spalten, links gegen rechts.                         */
/* ------------------------------------------------------------------ */
export const Gegenueber = ({
  links,
  rechts,
}: {
  links: { titel: string; ton?: Ton; punkte: ReactNode[] };
  rechts: { titel: string; ton?: Ton; punkte: ReactNode[] };
}) => {
  const Spalte = ({ titel, ton, punkte }: { titel: string; ton?: Ton; punkte: ReactNode[] }) => (
    <div className="card-surface p-5">
      <p className="flex items-center gap-2 text-[16px] font-bold text-foreground">
        {ton && <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${tonKlasse[ton]}`} aria-hidden />}
        {titel}
      </p>
      <ul className="mt-3 space-y-2">
        {punkte.map((p, i) => (
          <li key={i} className="flex gap-2.5 text-[16px] leading-relaxed text-muted-foreground">
            <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/30" aria-hidden />
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
  return (
    <div className="my-6 grid gap-4 md:grid-cols-2">
      <Spalte {...links} />
      <Spalte {...rechts} />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* ProContra: was dafür spricht, was dagegen.                          */
/* ------------------------------------------------------------------ */
export const ProContra = ({ pro, contra }: { pro: ReactNode[]; contra: ReactNode[] }) => (
  <div className="my-6 grid gap-4 md:grid-cols-2">
    <div className="card-surface p-5">
      <p className="text-[16px] font-bold text-foreground">Was dafür spricht</p>
      <ul className="mt-3 space-y-2.5">
        {pro.map((p, i) => (
          <li key={i} className="flex gap-2.5 text-[16px] leading-relaxed text-muted-foreground">
            <Check className="mt-[5px] h-4 w-4 shrink-0 text-success" aria-hidden />
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </div>
    <div className="card-surface p-5">
      <p className="text-[16px] font-bold text-foreground">Was dagegen spricht</p>
      <ul className="mt-3 space-y-2.5">
        {contra.map((p, i) => (
          <li key={i} className="flex gap-2.5 text-[16px] leading-relaxed text-muted-foreground">
            <X className="mt-[5px] h-4 w-4 shrink-0 text-destructive" aria-hidden />
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/* Checkliste: Haken für erlaubt, Kreuz für nicht erlaubt, Strich für  */
/* neutral.                                                             */
/* ------------------------------------------------------------------ */
export type CheckArt = "ja" | "nein" | "neutral";

export const Checkliste = ({ punkte }: { punkte: { art: CheckArt; text: ReactNode }[] }) => (
  <ul className="my-6 space-y-3">
    {punkte.map((p, i) => (
      <li key={i} className="flex gap-3 text-[16px] leading-relaxed text-foreground/90">
        <span
          className={`mt-[3px] flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
            p.art === "ja"
              ? "bg-[hsl(var(--success)/0.12)] text-success"
              : p.art === "nein"
                ? "bg-[hsl(var(--destructive)/0.12)] text-destructive"
                : "bg-muted text-muted-foreground"
          }`}
          aria-hidden
        >
          {p.art === "ja" ? <Check className="h-3.5 w-3.5" /> : p.art === "nein" ? <X className="h-3.5 w-3.5" /> : <Minus className="h-3.5 w-3.5" />}
        </span>
        <span>{p.text}</span>
      </li>
    ))}
  </ul>
);

/* ------------------------------------------------------------------ */
/* Beispiel: eine Rechnung, Schritt für Schritt, mit Ergebniszeile.    */
/* ------------------------------------------------------------------ */
export const Beispiel = ({
  titel = "Ein Beispiel",
  children,
  rechnung,
  ergebnis,
}: {
  titel?: string;
  children?: ReactNode;
  /** Zeilen wie "300 € × 1,2 %". */
  rechnung?: string[];
  ergebnis?: ReactNode;
}) => (
  <div className="my-6 rounded-2xl bg-accent p-5 md:p-6">
    <p className="text-[17px] font-bold text-foreground">{titel}</p>
    {children && <div className="mt-2 space-y-2 text-[16px] leading-relaxed text-foreground/85">{children}</div>}
    {rechnung && (
      <div className="mt-4 space-y-1.5 rounded-xl bg-card px-4 py-3 text-[16px] tabular-nums text-foreground">
        {rechnung.map((z) => (
          <p key={z} className="font-semibold">
            {z}
          </p>
        ))}
      </div>
    )}
    {ergebnis && <p className="mt-3 text-[16px] font-semibold text-foreground">{ergebnis}</p>}
  </div>
);

/* ------------------------------------------------------------------ */
/* Kennzahl: eine große Zahl mit Beschriftung. Für Nisab, Kosten.      */
/* ------------------------------------------------------------------ */
export const Kennzahlen = ({ zahlen }: { zahlen: { wert: string; label: string; unter?: string }[] }) => (
  <div className="my-6 grid gap-3 sm:grid-cols-2">
    {zahlen.map((z) => (
      <div key={z.label} className="card-surface p-5">
        <p className="text-[14px] text-muted-foreground">{z.label}</p>
        <p className="mt-1 text-[28px] font-bold leading-tight tabular-nums text-foreground">{z.wert}</p>
        {z.unter && <p className="mt-1 text-[14px] text-muted-foreground">{z.unter}</p>}
      </div>
    ))}
  </div>
);

/* ------------------------------------------------------------------ */
/* Tabelle. Ab 640px eine echte Tabelle. Darunter wird jede Zeile zu     */
/* einem Block: erste Zelle als Titel, die übrigen mit ihrer Spalten-   */
/* überschrift davor. Nichts scrollt seitlich, nichts wird abgeschnitten.*/
/* ------------------------------------------------------------------ */
export const Tabelle = ({ kopf, zeilen }: { kopf: string[]; zeilen: ReactNode[][] }) => (
  <div className="my-6 overflow-hidden rounded-2xl border border-border">
    <table className="block w-full border-collapse text-[15px] sm:table">
      <thead className="hidden sm:table-header-group">
        <tr className="bg-muted text-left">
          {kopf.map((k) => (
            <th key={k} className="px-4 py-3 font-semibold text-foreground">
              {k}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="block sm:table-row-group">
        {zeilen.map((z, i) => (
          <tr key={i} className="block border-t border-border bg-card py-2 first:border-t-0 sm:table-row sm:py-0 sm:first:border-t">
            {z.map((c, j) => (
              <td
                key={j}
                data-label={j === 0 ? undefined : kopf[j]}
                className={`block px-4 py-1.5 align-top leading-relaxed sm:table-cell sm:py-3 ${
                  j === 0
                    ? "text-[16px] font-semibold text-foreground sm:text-[15px]"
                    : "text-muted-foreground before:block before:text-[12px] before:font-semibold before:uppercase before:tracking-[0.06em] before:text-foreground/70 before:content-[attr(data-label)] sm:before:hidden"
                }`}
              >
                {c}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/* ------------------------------------------------------------------ */
/* Bild: Erklärbild mit Unterschrift. Auf dem Handy höchstens 200px    */
/* hoch, auf dem Laptop 480px breit und mittig.                         */
/* ------------------------------------------------------------------ */
export const Bild = ({ children, text }: { children: ReactNode; text: string }) => (
  <figure className="my-7">
    <div className="mx-auto w-full max-w-[480px] overflow-hidden rounded-2xl">{children}</div>
    <figcaption className="mx-auto mt-2.5 max-w-[480px] text-center text-[14px] leading-relaxed text-muted-foreground">
      {text}
    </figcaption>
  </figure>
);

/* ------------------------------------------------------------------ */
/* Weiter: Verweis auf einen anderen Beitrag, mitten im Text.           */
/* ------------------------------------------------------------------ */
export const Weiter = ({ to, children }: { to: string; children: ReactNode }) => (
  <Link
    to={to}
    className="my-5 flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-5 py-4 text-[16px] font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
  >
    <span>{children}</span>
    <ArrowRight className="h-5 w-5 shrink-0 text-primary" aria-hidden />
  </Link>
);

/* ------------------------------------------------------------------ */
/* Passt dazu: die Liste am Ende.                                       */
/* ------------------------------------------------------------------ */
export const PasstDazu = ({ punkte }: { punkte: { to: string; name: string; text: string }[] }) => (
  <section className="card-surface p-6">
    <h2 className="text-[19px] font-bold text-foreground">Passt dazu</h2>
    <ul className="mt-3 space-y-2.5 text-[16px] leading-relaxed">
      {punkte.map((p) => (
        <li key={p.to}>
          <Link to={p.to} className="font-semibold text-primary hover:underline">
            {p.name}
          </Link>{" "}
          <span className="text-muted-foreground">{p.text}</span>
        </li>
      ))}
    </ul>
  </section>
);

/** Inline-Link im Fließtext. */
export const L = ({ to, children }: { to: string; children: ReactNode }) => (
  <Link to={to} className="font-medium text-primary underline decoration-primary/30 underline-offset-[3px] hover:decoration-primary">
    {children}
  </Link>
);

/** Fett im Fließtext, in Textfarbe statt grau. */
export const B = ({ children }: { children: ReactNode }) => (
  <strong className="font-semibold text-foreground">{children}</strong>
);
