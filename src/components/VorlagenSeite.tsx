import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Download } from "lucide-react";
import NewsletterBox from "@/components/NewsletterBox";
import { motive, type MotivName } from "@/components/motive";

export type VorlagenCta = { titel: string; text: string; buttonLabel: string; to: string };

type Props = {
  kicker: string;
  titel: string;
  einleitung: string;
  pdfPfad: string;
  children: ReactNode;
  /** Quellenblock, kleine graue Schrift. */
  quellen: string;
  /** Rechtshinweis, kleine graue Schrift. */
  rechtshinweis: string;
  ctas: VorlagenCta[];
  /** Motivbild klein neben der Ueberschrift. */
  motiv?: MotivName;
};

/**
 * Einheitliche Vorlage fuer die Detailseiten unter /vorlagen. Feste Reihenfolge:
 * Brotkrumen, heller Kopfbereich, Inhalt, Quellen, CTA-Bloecke, Newsletter,
 * Rechtshinweis.
 */
const VorlagenSeite = ({
  kicker,
  titel,
  einleitung,
  pdfPfad,
  children,
  quellen,
  rechtshinweis,
  ctas,
  motiv,
}: Props) => {
  const Motiv = motiv ? motive[motiv] : null;
  return (
  <main className="bg-background">
    <div className="container py-10 md:py-14">
      <nav aria-label="Brotkrumen" className="flex flex-wrap items-center gap-1 text-[13px] text-muted-foreground">
        <Link to="/" className="hover:text-primary">
          Start
        </Link>
        <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        <Link to="/vorlagen" className="hover:text-primary">
          Vorlagen
        </Link>
        <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        <span className="text-foreground">{titel}</span>
      </nav>

      <header className="mt-6 rounded-2xl bg-hero p-6 md:p-10">
        {Motiv && (
          <span className="mb-4 block h-16 w-16 overflow-hidden rounded-xl md:float-right md:mb-0 md:ml-6">
            <Motiv />
          </span>
        )}
        <span className="badge-new">{kicker}</span>
        <h1 className="mt-3 max-w-3xl text-3xl font-bold leading-tight text-foreground md:text-4xl">{titel}</h1>
        <p className="mt-4 max-w-3xl text-[17px] leading-relaxed text-foreground/90">{einleitung}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a href={pdfPfad} download className="btn-primary gap-2">
            <Download className="h-5 w-5" aria-hidden />
            PDF laden
          </a>
          <Link
            to="/vorlagen"
            className="inline-flex h-12 items-center justify-center rounded-md border border-border bg-card px-6 text-[18px] font-semibold text-foreground transition-colors hover:border-primary"
          >
            Alle Vorlagen
          </Link>
        </div>
      </header>

      <div className="mt-10 max-w-4xl mx-auto space-y-12">{children}</div>

      <section className="mt-12 max-w-4xl mx-auto">
        <h2 className="text-[13px] font-semibold uppercase tracking-wide text-muted-foreground">
          Grundlage und Quellen
        </h2>
        <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{quellen}</p>
      </section>

      <div className="mt-12 max-w-4xl mx-auto space-y-4">
        {ctas.map((c) => (
          <section key={c.titel} className="card-surface p-6 md:p-8">
            <h2 className="text-xl font-bold text-foreground">{c.titel}</h2>
            <p className="mt-2 text-[16px] leading-relaxed text-muted-foreground">{c.text}</p>
            <Link to={c.to} className="btn-primary mt-5">
              {c.buttonLabel}
            </Link>
          </section>
        ))}
      </div>

      <section className="mt-14">
        <NewsletterBox />
      </section>

      <p className="mt-12 max-w-4xl mx-auto text-[13px] leading-relaxed text-muted-foreground">{rechtshinweis}</p>
    </div>
  </main>
  );
};

export default VorlagenSeite;
