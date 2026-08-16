import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
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
  /** Erklaerabschnitte als Fliesstext mit Zwischenueberschriften. */
  erklaerung: ReactNode;
  weitereRechner: WeitererRechner[];
  /** Ein Satz im Reiter "Anlegen", der an den Rechner anknuepft. */
  anlegenSatz?: string;
  /** Kurze Abschnitte direkt unter dem Rechner, im Reiter "Rechnen".
   *  Gedacht fuer Formel, Beispiel und Sprungmarken. Nicht fuer Fliesstext,
   *  der gehoert nach "Verstehen". */
  unterRechner?: ReactNode;
};

const REITER = [
  { id: "rechnen", nummer: 1, label: "Rechnen" },
  { id: "anlegen", nummer: 2, label: "Anlegen" },
  { id: "verstehen", nummer: 3, label: "Verstehen" },
] as const;

type ReiterId = (typeof REITER)[number]["id"];

/** Die drei Schritte vom Rechnen zum Handeln. */
const SCHRITTE = [
  {
    titel: "Depot eröffnen",
    text: "Ein Depot ist das Regal, in dem deine Anteile liegen. Die Eröffnung dauert meist unter zwanzig Minuten.",
  },
  {
    titel: "Anlage auswählen",
    text: "Such dir aus, was zu dir passt. In unserer Datenbank steht bei jeder Anlage, wer sie geprüft hat.",
  },
  {
    titel: "Betrag festlegen",
    text: "Leg fest, wie viel jeden Monat automatisch angelegt wird. Anfangen kannst du mit kleinen Beträgen.",
  },
];

/**
 * Einheitlicher Rahmen fuer jede Rechnerseite.
 *
 * Drei Reiter nach dem Vorbild des iShares-Sparplanrechners: Rechnen, Anlegen,
 * Verstehen. Der Grund ist nicht Zierde, sondern Platz. Vorher standen Rechner,
 * Erklaertexte und Fragen untereinander auf einer Seite, und der Rechner ging
 * darin unter. Jetzt ist Reiter eins frei von Textwaenden, und der Weg vom
 * Rechnen zum Handeln hat einen eigenen Ort.
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
  const [reiter, setReiter] = useState<ReiterId>("rechnen");

  // Nur Anbieter mit hinterlegtem Partnerlink. Alles andere waere ein Knopf,
  // der ins Leere fuehrt.
  const anbieter = brokerVergleich.filter((b) => b.link).slice(0, 3);

  return (
    <main className="bg-background">
      <div className="container py-10 md:py-14">
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

        <header className="mt-6 max-w-3xl">
          <h1 className="text-3xl font-bold leading-tight text-foreground md:text-4xl">{title}</h1>
          <div className="mt-4 space-y-3 text-[16px] leading-relaxed text-foreground/90">{intro}</div>
        </header>

        {/* Reiterleiste. Auf dem Handy scrollbar, damit nichts umbricht. */}
        <div
          role="tablist"
          aria-label="Bereiche"
          className="mt-8 flex gap-6 overflow-x-auto border-b border-border"
        >
          {REITER.map((r) => (
            <button
              key={r.id}
              type="button"
              role="tab"
              aria-selected={reiter === r.id}
              onClick={() => setReiter(r.id)}
              className={`-mb-px shrink-0 border-b-2 px-1 pb-3 text-[15px] font-semibold transition-colors md:text-[17px] ${
                reiter === r.id
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="text-muted-foreground">{r.nummer}.</span> {r.label}
            </button>
          ))}
        </div>

        {reiter === "rechnen" && (
          <>
            <AdSlot id="rechner-top" />
            <section className="card-surface mt-6 overflow-hidden">{children}</section>
            {unterRechner && <div className="mt-6 space-y-4">{unterRechner}</div>}
          </>
        )}

        {reiter === "anlegen" && (
          <section className="mt-6">
            <h2 className="text-2xl font-bold text-foreground md:text-[28px]">So fängst du an</h2>
            {anlegenSatz && (
              <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-muted-foreground">
                {anlegenSatz}
              </p>
            )}

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {SCHRITTE.map((s, i) => (
                <div key={s.titel} className="card-surface p-5">
                  <span className="text-[13px] font-bold text-primary">Schritt {i + 1}</span>
                  <p className="mt-1 text-[17px] font-bold text-foreground">{s.titel}</p>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{s.text}</p>
                </div>
              ))}
            </div>

            <h3 className="mt-10 text-xl font-bold text-foreground">Depots ohne Zinsgeschäft</h3>
            <div className="mt-4 space-y-4">
              {anbieter.map((b) => (
                <div key={b.id} className="card-surface p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-[17px] font-bold text-foreground">{b.name}</p>
                    {b.halal.keinGuthabenzins.status === "gut" && (
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
        )}

        {reiter === "verstehen" && (
          <section className="prose-none mt-6 max-w-3xl space-y-10">{erklaerung}</section>
        )}

        <section className="card-surface mt-12 p-6 md:p-10">
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
          Dieser Rechner dient der Orientierung und ist keine Anlageberatung. Vergangene Kurse sagen
          nichts über die Zukunft.
        </p>
      </div>
    </main>
  );
};

export default RechnerSeite;
