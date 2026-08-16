import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import NewsletterBox from "@/components/NewsletterBox";

export type ArtikelAbschnitt = {
  /** Zwischenueberschrift, erzeugt zugleich den Eintrag im Inhaltsverzeichnis. */
  titel: string;
  /** Anker-Id, wird im Inhaltsverzeichnis verlinkt. */
  id: string;
  inhalt: ReactNode;
};

export type PassendDazu = { name: string; desc: string; to: string };

type Props = {
  title: string;
  /** Bleibt vorerst leer, bis ein echtes Datum gesetzt wird. */
  aktualisiert?: string;
  kuerze: string[];
  abschnitte: ArtikelAbschnitt[];
  passendDazu: PassendDazu[];
  /** Kleiner grauer Hinweis am Ende. */
  hinweis?: string;
};

/**
 * Einheitliche Vorlage fuer Artikelseiten im Wissensbereich. Feste Reihenfolge:
 * Brotkrumen, Titel, Autorzeile, "Das Wichtigste in Kuerze", Inhaltsverzeichnis,
 * Fließtext, Newsletter, "Passend dazu", Hinweis.
 */
const ArtikelSeite = ({ title, aktualisiert, kuerze, abschnitte, passendDazu, hinweis }: Props) => (
  <main className="bg-background">
    <div className="container py-10 md:py-14">
      <nav aria-label="Brotkrumen" className="flex flex-wrap items-center gap-1 text-[13px] text-muted-foreground">
        <Link to="/" className="hover:text-primary">
          Start
        </Link>
        <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        <Link to="/wissen" className="hover:text-primary">
          Wissen
        </Link>
        <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        <span className="text-foreground">{title}</span>
      </nav>

      <article className="mt-6 max-w-3xl">
        <h1 className="text-3xl font-bold leading-tight text-foreground md:text-4xl">{title}</h1>

        <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[14px] text-muted-foreground">
          <span>Von Elias El-Gendy</span>
          {aktualisiert ? (
            <>
              <span aria-hidden>·</span>
              <span>Aktualisiert: {aktualisiert}</span>
            </>
          ) : null}
        </p>

        <section className="card-surface mt-8 p-6">
          <h2 className="text-[17px] font-bold text-foreground">Das Wichtigste in Kürze</h2>
          <ul className="mt-3 space-y-2">
            {kuerze.map((punkt) => (
              <li key={punkt} className="flex gap-3 text-[15px] leading-relaxed text-foreground">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                <span>{punkt}</span>
              </li>
            ))}
          </ul>
        </section>

        <nav aria-label="Inhaltsverzeichnis" className="card-surface mt-8 p-5">
          <h2 className="text-[13px] font-semibold uppercase tracking-wide text-muted-foreground">Inhalt</h2>
          <ol className="mt-3 space-y-2">
            {abschnitte.map((a, i) => (
              <li key={a.id} className="text-[15px]">
                <a href={`#${a.id}`} className="text-primary hover:underline">
                  {i + 1}. {a.titel}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-10 space-y-10">
          {abschnitte.map((a) => (
            <section key={a.id} id={a.id} className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-foreground">{a.titel}</h2>
              <div className="mt-3 space-y-4 text-[16px] leading-relaxed text-foreground/90">{a.inhalt}</div>
            </section>
          ))}
        </div>

        <section className="mt-14">
          <NewsletterBox />
        </section>

        <section className="card-surface mt-12 p-6 md:p-8">
          <h2 className="text-xl font-bold text-foreground">Passend dazu</h2>
          <ul className="mt-4 space-y-3 text-[15px]">
            {passendDazu.map((p) => (
              <li key={p.name}>
                <Link to={p.to} className="font-semibold text-primary hover:underline">
                  {p.name}
                </Link>
                <span className="text-muted-foreground"> – {p.desc}</span>
              </li>
            ))}
          </ul>
        </section>

        {hinweis ? <p className="mt-10 text-[13px] text-muted-foreground">{hinweis}</p> : null}
      </article>
    </div>
  </main>
);

export default ArtikelSeite;
