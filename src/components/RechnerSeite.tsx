import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import AbschnittsNavigation, { type Abschnitt } from "@/components/anlage/AbschnittsNavigation";
import AdSlot from "@/components/AdSlot";
import NewsletterBox from "@/components/NewsletterBox";
import { brokerVergleich } from "@/data/brokerVergleich";

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
  anlegenSatz?: string;
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
  anlegenSatz,
  unterRechner,
}: Props) => {
  // Nur Anbieter mit hinterlegtem Partnerlink. Alles andere waere ein Knopf,
  // der ins Leere fuehrt.
  const anbieter = brokerVergleich.filter((b) => b.link).slice(0, 3);

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

          <section id="anlegen" className="mt-14 scroll-mt-32">
            <h2 className="text-2xl font-bold text-foreground md:text-[28px]">So fängst du an</h2>
            {anlegenSatz && (
              <p className="mt-3 max-w-[820px] text-[16px] leading-relaxed text-muted-foreground">
                {anlegenSatz}
              </p>
            )}

            {/* Keine zweite Ueberschrift. Der Satz darueber sagt schon, was
                die Liste ist, und "Depots ohne Zinsgeschäft" stand direkt
                unter "So fängst du an" wie ein Echo. */}
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {anbieter.map((b) => (
                <div key={b.id} className="card-surface p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-[17px] font-bold text-foreground">{b.name}</p>
                    {b.werte.zinsfreiAbStart === "gut" && (
                      <span className="rounded-full bg-[hsl(var(--success))]/10 px-3 py-1 text-[13px] font-semibold text-[hsl(var(--success))]">
                        Verrechnungskonto ohne Zinsen
                      </span>
                    )}
                  </div>
                  <Link to={b.link!} className="btn-primary mt-4 h-12 w-full text-[16px]">
                    Zum Angebot*
                  </Link>
                </div>
              ))}
            </div>

            <p className="mt-4 text-[13px] leading-relaxed text-muted-foreground">
              * Wir bekommen eine Provision, wenn du über diesen Link eröffnest. Für dich ändert
              sich am Preis nichts.
            </p>

            <Link
              to="/vergleich/depot"
              className="mt-6 inline-flex items-center gap-1 text-[15px] font-semibold text-primary hover:underline"
            >
              Alle Depots im Vergleich
              <ChevronRight className="h-4 w-4" aria-hidden />
            </Link>
          </section>

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
