import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import AdSlot from "@/components/AdSlot";
import NewsletterBox from "@/components/NewsletterBox";

export type WeitererRechner = { name: string; desc: string; to: string };

type Props = {
  /** Name des Rechners, erscheint in den Brotkrumen. */
  name: string;
  title: string;
  intro: ReactNode;
  /** Der eigentliche Rechner. */
  children: ReactNode;
  /** Erklaerabschnitte als Fliesstext mit Zwischenueberschriften. */
  erklaerung: ReactNode;
  weitereRechner: WeitererRechner[];
};

/**
 * Einheitlicher Rahmen fuer jede Rechnerseite. Feste Reihenfolge:
 * Brotkrumen, Titel, Einleitung, Anzeigenplatz, Rechner, Newsletter,
 * Erklaerung, weitere Rechner, Hinweis.
 */
const RechnerSeite = ({ name, title, intro, children, erklaerung, weitereRechner }: Props) => (
  <main className="bg-background">
    <div className="container py-10 md:py-14">
      <nav aria-label="Brotkrumen" className="flex flex-wrap items-center gap-1 text-[13px] text-muted-foreground">
        <Link to="/" className="hover:text-primary">
          Start
        </Link>
        <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        <Link to="/rechner" className="hover:text-primary">
          Rechner
        </Link>
        <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        <span className="text-foreground">{name}</span>
      </nav>

      <header className="mt-6 max-w-3xl">
        <h1 className="text-3xl font-bold leading-tight text-foreground md:text-4xl">{title}</h1>
        <div className="mt-4 space-y-3 text-[16px] leading-relaxed text-foreground/90">{intro}</div>
      </header>

      {/* Spaeter: gekennzeichneter Werbeplatz. Aktuell unsichtbar. */}
      <AdSlot id="rechner-top" />

      <section className="card-surface mt-8 overflow-hidden">
        {children}
      </section>

      <section className="card-surface mt-12 p-6 md:p-10">
        <NewsletterBox />
      </section>

      <section className="prose-none mt-14 max-w-3xl space-y-10">{erklaerung}</section>

      <section className="card-surface mt-14 p-6 md:p-8">
        <h2 className="text-xl font-bold text-foreground">Weitere Rechner</h2>
        <ul className="mt-4 space-y-3 text-[15px]">
          {weitereRechner.map((r) => (
            <li key={r.name}>
              <Link to={r.to} className="font-semibold text-primary hover:underline">
                {r.name}
              </Link>
              <span className="text-muted-foreground"> – {r.desc}</span>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-10 text-[13px] text-muted-foreground">
        Dieser Rechner dient der Orientierung und ersetzt keine Beratung.
      </p>
    </div>
  </main>
);

export default RechnerSeite;
