import { Link } from "react-router-dom";

/**
 * Newsletter-Anmeldung. Gleiche Gestaltung auf Startseite und Rechnerseiten.
 * Das Formular hat bewusst noch keine Funktion (kein Versanddienst angebunden).
 */
const NewsletterBox = ({ className = "" }: { className?: string }) => (
  <div className={`mx-auto max-w-[700px] text-center ${className}`}>
    <h2 className="text-[28px] font-bold leading-tight text-foreground md:text-[36px]">
      Mache mehr aus deinem Geld, in 5 Minuten pro Woche
    </h2>
    <p className="mt-4 text-[17px] leading-relaxed text-muted-foreground">
      Jeden Freitag das Wichtigste für dein Geld: geprüfte Anlagen, Fristen und Antworten auf
      halal oder nicht. Kostenlos und jederzeit abbestellbar.
    </p>

    <form onSubmit={(e) => e.preventDefault()} className="mt-8 flex flex-col gap-3 sm:flex-row">
      <label htmlFor="newsletter-email" className="sr-only">
        E-Mail-Adresse
      </label>
      <input
        id="newsletter-email"
        type="email"
        placeholder="deine@email.de"
        className="h-14 rounded-lg border border-border bg-background px-4 text-[16px] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none sm:h-11 sm:flex-1 sm:text-[15px]"
      />
      <button
        type="submit"
        className="inline-flex h-14 items-center justify-center rounded-lg bg-primary px-6 text-[16px] font-semibold text-primary-foreground transition-colors hover:bg-primary-hover sm:h-11 sm:text-[15px]"
      >
        Kostenlos anmelden
      </button>
    </form>

    <label className="mt-4 flex items-start justify-center gap-2 text-left text-[13px] text-muted-foreground">
      <input type="checkbox" className="mt-0.5 h-4 w-4 shrink-0 rounded border-border accent-primary" />
      <span>
        Ich habe die{" "}
        <Link to="/datenschutz" className="text-primary underline underline-offset-2">
          Datenschutzerklärung
        </Link>{" "}
        gelesen und stimme ihr zu.
      </span>
    </label>
  </div>
);

export default NewsletterBox;
