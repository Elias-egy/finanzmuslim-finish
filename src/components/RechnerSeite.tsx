import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import AbschnittsNavigation, { type Abschnitt } from "@/components/anlage/AbschnittsNavigation";
import AdSlot from "@/components/AdSlot";
import NewsletterBox from "@/components/NewsletterBox";
import FindeDeinAngebot from "@/components/FindeDeinAngebot";

export type WeitererRechner = { name: string; desc: string; to: string };

type Props = {
  /** Name des Rechners, erscheint in den Brotkrumen. */
  name: string;
  title: string;
  intro: ReactNode;
  /** Der eigentliche Rechner. */
  children: ReactNode;
  /** Erklaerabschnitte als Fließtext mit Zwischenueberschriften. */
  erklaerung: ReactNode;
  weitereRechner: WeitererRechner[];
  /** Ein Satz im Abschnitt "Anlegen", der an den Rechner anknuepft. */
  /** Der Rechner zeigt den Aufruf schon selbst und trägt die Sprungmarke „anlegen“. */
  aufrufImRechner?: boolean;
  /** Kurze Abschnitte direkt unter dem Rechner. Gedacht fuer Formel und
   *  Beispiel. Nicht fuer Fließtext, der gehoert nach "Verstehen". */
  unterRechner?: ReactNode;
};

/* Nur zwei Sprungmarken. Der Erklaerteil steht weiter unten auf derselben
   Seite und braucht keine eigene Marke, er ist das Ende des Wegs und nicht
   eine dritte Station. */
const ABSCHNITTE: Abschnitt[] = [
  { id: "rechnen", label: "1. Rechnen" },
  { id: "anlegen", label: "2. Anlegen" },
];

/* Hier standen drei Kacheln "Schritt 1 Depot eröffnen, Schritt 2 Anlage
   auswählen, Schritt 3 Betrag festlegen". Sie sind raus. Sie sagten nichts,
   was der Leser nicht schon weiß, und kosteten eine Bildschirmhöhe vor dem
   einzigen Teil, der ihm wirklich weiterhilft, der Anbieterliste. Finanzfluss
   hat auf seinen Rechnerseiten auch keinen solchen Block, dort folgt auf den
   Rechner direkt der Erklaerteil. */

/**
 * Einheitlicher Rahmen fuer jede Rechnerseite.
 *
 * Aufbau nach dem Vorbild des iShares-Sparplanrechners: alles steht
 * untereinander auf einer Seite, oben klebt eine Leiste, die dorthin springt.
 * Vorher waren es Reiter, die den Inhalt ausgetauscht haben. Das hat zwei
 * Nachteile: Der Leser sieht nicht, was es sonst noch gibt, und Google
 * bewertet nur, was ohne Klick im Quelltext steht.
 *
 * Die Spalte ist auf 1100 Pixel begrenzt und mittig. Vorher lief die Seite
 * bis 1600 Pixel, der Text stand darin als schmaler Block links und rechts
 * blieb ein leeres Drittel.
 */
const RechnerSeite = ({
  name,
  title,
  intro,
  children,
  erklaerung,
  weitereRechner,
  aufrufImRechner = false,
  unterRechner,
}: Props) => {
  return (
    <main className="bg-background">
      <div className="container pt-5 md:pt-10">
        <div className="mx-auto w-full max-w-[1100px]">
          <nav
            aria-label="Brotkrumen"
            className="flex flex-wrap items-center gap-1 text-[13px] text-muted-foreground"
          >
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

          {/* Kopf laeuft ueber die ganze Spalte, wie beim iShares-Rechner.
              Ein 800 Pixel breiter Textblock in einer 1100 Pixel breiten
              Spalte sieht aus, als waere rechts etwas verrutscht. */}
          <header className="mt-3 md:mt-5">
            <h1 className="text-[28px] font-bold leading-tight text-foreground md:text-4xl">{title}</h1>
            <div className="mt-2 space-y-3 text-[16px] leading-relaxed text-foreground/90 md:mt-4 md:text-[17px]">
              {intro}
            </div>
          </header>
        </div>
      </div>

      <AbschnittsNavigation abschnitte={ABSCHNITTE} />

      <div className="container py-4 md:py-10">
        <div className="mx-auto w-full max-w-[1100px]">
          <section id="rechnen" className="scroll-mt-32">
            <AdSlot id="rechner-top" />
            {/* Handy: kein Rahmen um den Rechner. Seine Teile haben eigene Rahmen, und der
                doppelte Rand hat die Eingabefelder auf 250 von 390 Pixeln gedrückt. */}
            <div className="overflow-hidden md:mt-4 md:rounded-2xl md:border md:border-border md:bg-card">{children}</div>
            {unterRechner && <div className="mt-6 space-y-4">{unterRechner}</div>}
          </section>

          {/* Ein Aufruf statt drei einzelner Anbieter (Elias, 21.09.2026): Wir wissen nicht, was
              der Leser braucht, der gefuehrte Vergleich findet es heraus. Der Renditerechner
              traegt den Aufruf selbst, direkt unter dem Ergebnis. */}
          {!aufrufImRechner && (
            <section id="anlegen" className="mt-10 scroll-mt-32 md:mt-14">
              <FindeDeinAngebot titel="Finde heraus, welcher Anbieter zu dir passt" />
            </section>
          )}

          {/* Erklaerteil. Ohne eigene Sprungmarke, aber im Quelltext. */}
          <section id="verstehen" className="prose-none mt-14 max-w-[820px] space-y-10 scroll-mt-32">
            {erklaerung}
          </section>

          <section className="card-surface mt-14 p-6 md:p-10">
            <NewsletterBox />
          </section>

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

          <p className="mt-10 text-[13px] leading-relaxed text-muted-foreground">
            Dieser Rechner dient der Orientierung und ist keine Anlageberatung. Vergangene Kurse
            sagen nichts über die Zukunft.
          </p>
        </div>
      </div>
    </main>
  );
};

export default RechnerSeite;
