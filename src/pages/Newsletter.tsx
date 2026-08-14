import Seo from "@/components/Seo";
import NewsletterBox from "@/components/NewsletterBox";

const punkte = [
  "Neue und aktualisierte Vergleiche",
  "Neue kostenlose Vorlagen zuerst",
  "Wenn sich eine Zertifizierung ändert, erfährst du es",
];

const Newsletter = () => (
  <main className="bg-background">
    <Seo
      title="Der Newsletter | finanzmuslim"
      description="Einmal im Monat: neue Vergleiche, neue Vorlagen, und was sich bei den Anbietern verändert hat. Kein Verkaufsdruck, jederzeit abbestellbar."
      path="/newsletter"
    />
    <div className="container py-12 md:py-16">
      <header className="mx-auto max-w-[700px] text-center">
        <h1 className="text-3xl font-bold leading-tight text-foreground md:text-4xl">Der Newsletter</h1>
        <p className="mt-4 text-[17px] leading-relaxed text-muted-foreground">
          Einmal im Monat: neue Vergleiche, neue Vorlagen, und was sich bei den Anbietern verändert hat. Kein
          Verkaufsdruck, jederzeit abbestellbar.
        </p>
      </header>

      <section className="mt-12">
        <NewsletterBox />
        <p className="mx-auto mt-4 max-w-[700px] text-center text-[13px] text-muted-foreground">
          Die Anmeldung wird gerade eingerichtet.
        </p>
      </section>

      <ul className="mx-auto mt-12 max-w-[700px] space-y-3">
        {punkte.map((p) => (
          <li key={p} className="card-surface flex gap-3 p-5 text-[16px] leading-relaxed text-foreground">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </div>
  </main>
);

export default Newsletter;
