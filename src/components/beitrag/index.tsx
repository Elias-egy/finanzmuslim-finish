import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Minus, X } from "lucide-react";

/**
 * Bausteine für Wissensbeiträge. Ein Satz Bauteile für alle Beiträge, damit
 * Abstände, Schriftgrößen und Farben überall gleich sind.
 *
 * Regeln (seit SEO47, 04.11.2026, Stil von /blog/halal-etf; Elias: „Halte alles wie Halal ETF“,
 * „zu viele blaue Elemente, die so klein sind“):
 *   - Weißer Grund, eckige Kanten, dünne graue Linien. Keine blauen Flächen, keine Kreise.
 *   - Überschriften und hervorgehobene Sätze in der Serifenschrift (font-titel).
 *   - Grün, Gelb, Rot nur als Bewertung (Ampel, Fall, ProContra). Nie als Deko.
 *   - Jeder Baustein funktioniert bei 320 Pixel Breite.
 */

/* ------------------------------------------------------------------ */
/* Merksatz: der eine Satz, den man aus dem Abschnitt mitnimmt.        */
/* ------------------------------------------------------------------ */
export const Merksatz = ({ children }: { children: ReactNode; label?: string }) => (
  <aside className="my-7 border-l-2 border-primary pl-5">
    <p className="font-titel text-[20px] leading-[1.4] text-foreground md:text-[22px]">{children}</p>
  </aside>
);

/* ------------------------------------------------------------------ */
/* Frage: der Haken, der einen Abschnitt öffnet.                       */
/* ------------------------------------------------------------------ */
export const Frage = ({ children }: { children: ReactNode }) => (
  <p className="font-titel my-5 text-[20px] leading-snug text-foreground md:text-[21px]">{children}</p>
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
  <aside className="my-6 border border-border bg-muted/40 px-5 py-4">
    <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-muted-foreground">Begriff</p>
    <p className="mt-1.5 text-[17px] font-semibold text-foreground">
      {wort}
      {arabisch && <span className="ml-2 font-normal text-muted-foreground">({arabisch})</span>}
    </p>
    <p className="mt-1.5 text-[16px] leading-relaxed text-foreground/75">{children}</p>
  </aside>
);

/* ------------------------------------------------------------------ */
/* Hinweis: "Gut zu wissen", am Rand des Themas.                       */
/* ------------------------------------------------------------------ */
export const Hinweis = ({ titel = "Gut zu wissen", children }: { titel?: string; children: ReactNode }) => (
  <aside className="my-6 border border-border bg-muted/40 px-5 py-4">
    <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-muted-foreground">{titel}</p>
    <div className="mt-2 space-y-2 text-[16px] leading-relaxed text-foreground/75">{children}</div>
  </aside>
);

/* ------------------------------------------------------------------ */
/* Schritte: nummeriert, mit Verbindungslinie.                          */
/* ------------------------------------------------------------------ */
export type Schritt = { titel: string; text: ReactNode };

export const Schritte = ({ schritte, start = 1 }: { schritte: Schritt[]; start?: number }) => (
  <ol className="my-6 border-t border-border">
    {schritte.map((s, i) => (
      <li key={s.titel} className="flex gap-4 border-b border-border py-4">
        <span className="w-7 shrink-0 pt-[3px] font-mono text-[13px] tabular-nums text-muted-foreground">
          {String(start + i).padStart(2, "0")}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[17px] font-semibold leading-snug text-foreground">{s.titel}</p>
          <div className="mt-1.5 space-y-2 text-[16px] leading-relaxed text-foreground/75">{s.text}</div>
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
    <span className={`h-2.5 w-2.5 shrink-0 ${tonKlasse[ton]}`} aria-hidden />
    {wort}
  </span>
);

export type FallProps = { titel: string; ton: Ton; wort: string; text: ReactNode };

export const Fall = ({ titel, ton, wort, text }: FallProps) => (
  <div className="border border-border bg-background p-5">
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
    <div className="border border-border bg-background p-5">
      <p className="flex items-center gap-2 text-[16px] font-bold text-foreground">
        {ton && <span className={`h-2.5 w-2.5 shrink-0 ${tonKlasse[ton]}`} aria-hidden />}
        {titel}
      </p>
      <ul className="mt-3 space-y-2">
        {punkte.map((p, i) => (
          <li key={i} className="flex gap-2.5 text-[16px] leading-relaxed text-muted-foreground">
            <span className="mt-[11px] h-1.5 w-1.5 shrink-0 bg-primary" aria-hidden />
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
    <div className="border border-border bg-background p-5">
      <p className="text-[16px] font-bold text-foreground">Was dafür spricht</p>
      <ul className="mt-3 space-y-2.5">
        {pro.map((p, i) => (
          <li key={i} className="flex gap-2.5 text-[16px] leading-relaxed text-foreground/75">
            <Check className="mt-[5px] h-4 w-4 shrink-0 text-success" aria-hidden />
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </div>
    <div className="border border-border bg-background p-5">
      <p className="text-[16px] font-bold text-foreground">Was dagegen spricht</p>
      <ul className="mt-3 space-y-2.5">
        {contra.map((p, i) => (
          <li key={i} className="flex gap-2.5 text-[16px] leading-relaxed text-foreground/75">
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
      <li key={i} className="flex gap-3 text-[17px] leading-[1.6] text-foreground/80">
        <span
          className={`mt-[5px] shrink-0 ${p.art === "ja" ? "text-success" : p.art === "nein" ? "text-destructive" : "text-muted-foreground"}`}
          aria-hidden
        >
          {p.art === "ja" ? <Check className="h-4 w-4" /> : p.art === "nein" ? <X className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
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
  <div className="my-6 border border-border bg-muted/40 p-5 md:p-6">
    <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-muted-foreground">{titel}</p>
    {children && <div className="mt-2 space-y-2 text-[16px] leading-relaxed text-foreground/80">{children}</div>}
    {rechnung && (
      <div className="mt-4 space-y-1.5 border-l-2 border-primary pl-4 text-[16px] tabular-nums text-foreground">
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
  <div className="my-6 grid border-l border-t border-border sm:grid-cols-2">
    {zahlen.map((z) => (
      <div key={z.label} className="border-b border-r border-border p-5">
        <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-muted-foreground">{z.label}</p>
        <p className="font-titel mt-1.5 text-[30px] leading-tight tabular-nums text-foreground">{z.wert}</p>
        {z.unter && <p className="mt-1 text-[14px] text-muted-foreground">{z.unter}</p>}
      </div>
    ))}
  </div>
);

/* ------------------------------------------------------------------ */
/* Tabelle wie halalwallet (Elias SEO47): auch am Handy eine echte       */
/* Tabelle, erste Spalte steht fest, breite Tabellen wischt man seitlich.*/
/* ------------------------------------------------------------------ */
export const Tabelle = ({ kopf, zeilen }: { kopf: string[]; zeilen: ReactNode[][] }) => (
  <div className="my-6">
    <div className="overflow-x-auto border border-border">
      <table className="w-max min-w-full border-collapse text-[15px]">
        <thead>
          <tr className="bg-muted text-left">
            {kopf.map((k, j) => (
              <th
                key={k}
                scope="col"
                className={`px-4 py-3 align-bottom font-mono text-[12px] font-normal uppercase tracking-[0.08em] text-muted-foreground ${
                  j === 0 ? "sticky left-0 z-10 bg-muted shadow-[inset_-1px_0_0_hsl(var(--border))]" : ""
                }`}
              >
                {k}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {zeilen.map((z, i) => (
            <tr key={i} className="border-t border-border">
              {z.map((c, j) =>
                j === 0 ? (
                  <th
                    key={j}
                    scope="row"
                    className="sticky left-0 z-10 min-w-[120px] max-w-[170px] bg-background px-4 py-3 text-left align-top font-semibold leading-snug text-foreground shadow-[inset_-1px_0_0_hsl(var(--border))] sm:max-w-[240px]"
                  >
                    {c}
                  </th>
                ) : (
                  <td key={j} className="min-w-[160px] max-w-[280px] px-4 py-3 align-top leading-snug text-foreground/80">
                    {c}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    {kopf.length > 2 && <p className="mt-2 text-[13px] text-muted-foreground sm:hidden">Seitlich wischen für alle Spalten</p>}
  </div>
);

/* ------------------------------------------------------------------ */
/* Bild: Erklärbild mit Unterschrift. Auf dem Handy höchstens 200px    */
/* hoch, auf dem Laptop 480px breit und mittig.                         */
/* ------------------------------------------------------------------ */
export const Bild = ({ children, text }: { children: ReactNode; text: string }) => (
  <figure className="my-7">
    <div className="mx-auto w-full max-w-[480px] overflow-hidden border border-border">{children}</div>
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
    className="my-5 flex min-h-[52px] items-center justify-between gap-3 border border-border bg-background px-5 py-3 text-[16px] font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
  >
    <span>{children}</span>
    <ArrowRight className="h-5 w-5 shrink-0 text-primary" aria-hidden />
  </Link>
);

/* ------------------------------------------------------------------ */
/* Passt dazu: die Liste am Ende.                                       */
/* ------------------------------------------------------------------ */
export const PasstDazu = ({ punkte }: { punkte: { to: string; name: string; text: string }[] }) => (
  <section className="border-t border-border pt-8">
    <h2 className="font-titel text-[25px] leading-[1.2] text-foreground md:text-[28px]">Passt dazu</h2>
    <ul className="mt-4 space-y-3 text-[16px] leading-relaxed">
      {punkte.map((p) => (
        <li key={p.to}>
          <Link to={p.to} className="font-medium text-primary underline underline-offset-2 hover:no-underline">
            {p.name}
          </Link>{" "}
          <span className="text-foreground/70">{p.text}</span>
        </li>
      ))}
    </ul>
  </section>
);

/** Inline-Link im Fließtext. */
export const L = ({ to, children }: { to: string; children: ReactNode }) => (
  <Link to={to} className="font-medium text-primary underline underline-offset-2 hover:no-underline">
    {children}
  </Link>
);

/** Fett im Fließtext, in Textfarbe statt grau. */
export const B = ({ children }: { children: ReactNode }) => (
  <strong className="font-semibold text-foreground">{children}</strong>
);
