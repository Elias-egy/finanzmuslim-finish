import { useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Check, ChevronRight, Download } from "lucide-react";
import NewsletterBox from "@/components/NewsletterBox";
import { motive, type MotivName } from "@/components/motive";
import { quelleAusPfad, spracheAus } from "@/lib/anmeldung";

export type VorlagenCta = { titel: string; text: string; buttonLabel: string; to: string };

type Props = {
  kicker: string;
  titel: string;
  einleitung: string;
  pdfPfad: string;
  /** Schlüssel der Vorlage, geht als `vorlage` an den Webhook und bestimmt die MailerLite-Gruppe. */
  slug: string;
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
 * Die Vorlage gibt es gegen die E-Mail-Adresse. Der Webhook ist ein Make-Szenario,
 * das die Adresse in die MailerLite-Gruppe der jeweiligen Vorlage legt (eine Gruppe
 * je Vorlage, Name "Vorlage: …"). Die PDF öffnet direkt nach dem Absenden, die
 * Bestätigungsmail (Double Opt-in) gilt nur für die E-Mails. `firma` ist ein
 * Honeypot: Menschen sehen das Feld nicht, Bots füllen es aus, Make wirft solche
 * Anfragen weg. `quelle`, `sprache` und `interesse` gehen mit, damit Make sie in
 * MailerLite ablegen kann (Szenario 7427792).
 */
const VORLAGEN_WEBHOOK = "https://hook.eu1.make.com/cbapidkac5iw67brippeucodz6lubnic";

const emailGueltig = (wert: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(wert.trim());

const VorlagenFormular = ({ slug, pdfPfad }: { slug: string; pdfPfad: string }) => {
  const { pathname } = useLocation();
  const [email, setEmail] = useState("");
  const [firma, setFirma] = useState("");
  const [zustand, setZustand] = useState<"offen" | "sendet" | "fertig" | "fehler">("offen");
  const [hinweis, setHinweis] = useState<string | null>(null);

  const absenden = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailGueltig(email)) {
      setHinweis("Bitte gib eine gültige E-Mail-Adresse ein.");
      return;
    }
    setHinweis(null);
    setZustand("sendet");
    try {
      const res = await fetch(VORLAGEN_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          vorname: "",
          vorlage: slug,
          firma,
          quelle: quelleAusPfad(pathname),
          sprache: spracheAus(document.documentElement.lang),
          interesse: `vorlage-${slug}`,
        }),
      });
      if (!res.ok) throw new Error(`Webhook ${res.status}`);
      setZustand("fertig");
    } catch {
      setZustand("fehler");
    }
  };

  if (zustand === "fertig" || zustand === "fehler") {
    return (
      <div className="mt-6 rounded-lg border border-border bg-card p-5">
        <p className="flex items-center gap-2 text-[16px] font-semibold text-foreground">
          <Check className="h-5 w-5 text-primary" aria-hidden />
          {zustand === "fertig" ? "Danke, hier ist deine Vorlage." : "Die Anmeldung hat gerade nicht geklappt."}
        </p>
        <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
          {zustand === "fertig"
            ? "Du kannst sie jetzt öffnen und speichern. Für den Freitagsbrief bestätige noch kurz die E-Mail, die gleich kommt."
            : "Die Vorlage bekommst du trotzdem. Schreib uns gern an elias@finanzmuslim.com, dann tragen wir dich von Hand ein."}
        </p>
        <a href={pdfPfad} download className="btn-primary mt-4 gap-2">
          <Download className="h-5 w-5" aria-hidden />
          PDF öffnen
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={absenden} noValidate className="mt-6 max-w-xl">
      <label htmlFor={`vorlage-email-${slug}`} className="block text-[15px] font-semibold text-foreground">
        Wohin sollen wir die Vorlage schicken?
      </label>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <input
          id={`vorlage-email-${slug}`}
          type="email"
          name="email"
          autoComplete="email"
          placeholder="deine@email.de"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-12 rounded-lg border border-border bg-background px-4 text-[16px] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none sm:flex-1"
        />
        <input
          type="text"
          name="firma"
          value={firma}
          onChange={(e) => setFirma(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />
        <button type="submit" disabled={zustand === "sendet"} className="btn-primary gap-2 disabled:opacity-60">
          <Download className="h-5 w-5" aria-hidden />
          {zustand === "sendet" ? "Wird gesendet …" : "PDF laden"}
        </button>
      </div>
      {hinweis && (
        <p role="alert" className="mt-2 text-[14px] text-destructive">
          {hinweis}
        </p>
      )}
      <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
        Du bekommst die Vorlage und jeden Freitag meinen Freitagsbrief mit Tipps und Empfehlungen. Abmelden geht
        mit einem Klick. Hinweise zur Erfolgsmessung und zum Widerruf:{" "}
        <Link to="/datenschutz" className="text-primary underline underline-offset-2">
          Datenschutz
        </Link>
      </p>
    </form>
  );
};

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
        <VorlagenFormular slug={slug} pdfPfad={pdfPfad} />
        <Link
          to="/vorlagen"
          className="mt-4 inline-flex items-center text-[15px] font-semibold text-primary hover:underline"
        >
          Alle Vorlagen ansehen
        </Link>
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
