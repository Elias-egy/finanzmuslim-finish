import FreitagsbriefFormular from "@/components/FreitagsbriefFormular";

/**
 * Newsletter-Anmeldung. Gleiche Gestaltung auf Rechner-, Wissens- und Vorlagenseiten.
 * Das Formular selbst ist `FreitagsbriefFormular`, es schickt an Make und MailerLite.
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

    <FreitagsbriefFormular id="newsletter-email" variante="kasten" />
  </div>
);

export default NewsletterBox;
