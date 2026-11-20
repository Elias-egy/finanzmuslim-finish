import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ChevronRight, Download } from "lucide-react";
import Aufruf from "@/components/Aufruf";
import NewsletterBox from "@/components/NewsletterBox";
import NaechsterTeil from "@/components/NaechsterTeil";
import type { LeiterWort } from "@/data/leiter";
import { motive, type MotivName } from "@/components/motive";
import type { OptinFreebie } from "@/data/optin";

export type VorlagenCta = { titel: string; text: string; buttonLabel: string; to: string };

type Props = {
  kicker: string;
  titel: string;
  einleitung: string;
  pdfPfad: string;
  slug: string;
  children: ReactNode;
  /** Quellenblock, kleine graue Schrift. */
  quellen: string;
  /** Rechtshinweis, kleine graue Schrift. */
  rechtshinweis: string;
  ctas: VorlagenCta[];
  /** Motivbild klein neben der Ueberschrift. */
  motiv?: MotivName;
  /**
   * Gesperrte Vorlage, offene Seite: Der Kopf zeigt statt des PDFs einen Knopf zur
   * Opt-in-Karte an der Schnittkante (`#holen`). Die Seite muss die `Schnittkante` rendern.
   */
  gesperrt?: OptinFreebie;
  /** Volle Fassung eines Freebies der Leiter: der Kasten „Dein nächster Schritt“ unter den Aufrufen. */
  naechster?: LeiterWort;
  /**
   * RN17 (Übergabe RN16 Punkt 2, Elias RN16-44: „überall nur noch das Neue … Wie wir es eingebracht haben bei der Liste“): der kleine
   * Match-Kasten (NaechsterTeil) ganz am Ende nach den Quellen. Mit ihm fallen der PDF-Knopf im Kopf (Elias 02.11., MC7f: „diese
   * PDF-Option rauslassen. Bei den anderen Freebies“) und die Newsletter-Box weg, damit es nur den einen Aufruf gibt.
   */
  endeKasten?: ReactNode;
};

/**
 * Seit 27.09.2026 gibt es zwei Arten Vorlage. Offene (Aktien-Spickzettel, Baraka-Blocker)
 * zeigen alles und das PDF ohne Anmeldung. Gesperrte (`src/data/optin.ts`) zeigen auf ihrer
 * offenen Seite einen Ausschnitt, das Ganze öffnet die Danke-Seite nach der Anmeldung
 * (Adresse mit Schlüssel), und die erste Mail nach der Bestätigung bringt den Link noch einmal. Das alte Formular, das das PDF sofort und auch bei einem
 * Fehler herausgab, ist weg.
 */

/**
 * Einheitliche Vorlage fuer die Detailseiten unter /vorlagen. Feste Reihenfolge:
 * Brotkrumen, heller Kopfbereich mit E-Mail-Formular, Inhalt, Quellen,
 * CTA-Bloecke, Newsletter, Rechtshinweis.
 */
const VorlagenSeite = ({
  kicker,
  titel,
  einleitung,
  pdfPfad,
  slug,
  children,
  quellen,
  rechtshinweis,
  ctas,
  motiv,
  gesperrt,
  naechster,
  endeKasten,
}: Props) => {
  const Motiv = motiv ? motive[motiv] : null;
  return (
  <main className="bg-background" data-vorlage={slug}>
    <div className="container py-10 md:py-14">
      <nav aria-label="Brotkrumen" className="flex flex-wrap items-center gap-1 text-[13px] text-muted-foreground">
        <Link to="/" className="hover:text-primary">
          Start
        </Link>
        <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        <span className="text-foreground">{titel}</span>
      </nav>

      <header className="mt-6 rounded-lg border border-border bg-card p-6 md:p-10">
        {Motiv && (
          <span className="mb-4 block h-16 w-16 overflow-hidden rounded-lg md:float-right md:mb-0 md:ml-6">
            <Motiv />
          </span>
        )}
        <span className="etikett-rund">{kicker}</span>
        <h1 className="mt-3 max-w-3xl text-3xl font-bold leading-tight text-foreground md:text-4xl">{titel}</h1>
        <p className="mt-4 max-w-3xl text-[17px] leading-relaxed text-foreground/90">{einleitung}</p>
        <div className="mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          {gesperrt ? (
            <a href="#holen" className="btn-spark">
              {gesperrt.knopf}
              <ArrowDown className="h-5 w-5" aria-hidden />
            </a>
          ) : endeKasten ? null : (
            <a href={pdfPfad} download className="btn-primary gap-2">
              <Download className="h-5 w-5" aria-hidden />
              PDF laden
            </a>
          )}
          {/* Kein „Alle Listen ansehen“ mehr (Elias, 01.11.2026, MC7d15: „Die Leute sollen nicht sehen, dass sie über die
              Webseite alle anderen Sachen direkt auch sich angucken können“). */}
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
            <Aufruf to={c.to} className="mt-5">
              {c.buttonLabel}
            </Aufruf>
          </section>
        ))}
      </div>

      {naechster && <NaechsterTeil wort={naechster} className="mx-auto mt-12 max-w-4xl" />}

      {endeKasten ? (
        <div className="mx-auto mt-12 max-w-4xl">{endeKasten}</div>
      ) : (
        <section className="mt-14">
          <NewsletterBox />
        </section>
      )}

      {/* RN19: eine Erwähnung der Sammelseite am Ende der offenen Freebie-Seiten (Elias RN18-20: „alles Mögliche findest du
          bei Dokumente“), nicht auf den Seiten mit E-Mail-Schranke und nicht, wo der Check-Kasten (endeKasten) das Ende ist: dort zählt ein Knopf. */}
      {!gesperrt && !endeKasten && (
        <p className="mx-auto mt-12 max-w-4xl text-[17px] leading-relaxed text-foreground">
          Alle Formulare und Listen findest du bei{" "}
          <Link to="/dokumente" className="font-semibold text-primary hover:underline">
            Dokumente
          </Link>
          .
        </p>
      )}

      <p className="mt-12 max-w-4xl mx-auto text-[13px] leading-relaxed text-muted-foreground">{rechtshinweis}</p>
    </div>
  </main>
  );
};

export default VorlagenSeite;
