import Seo from "@/components/Seo";
import NewsletterBox from "@/components/NewsletterBox";

/**
 * Anmeldeseite fuer den Freitagsbrief.
 *
 * Aufbau nach dem Newsletter-Block von Finanzfluss: Versprechen mit Zahl,
 * darunter die festen Rubriken, dann das Feld. Der Name greift den Freitag auf,
 * weil der Tag bei unseren Lesern ohnehin gesetzt ist.
 */

const rubriken = [
  {
    titel: "Diese Woche wichtig",
    text: "Zwei bis drei Meldungen, die dein Geld betreffen. Was passiert ist, was es für dich heißt.",
  },
  {
    titel: "Halal oder nicht",
    text: "Eine Frage aus den Nachrichten, klar beantwortet. Wo Gelehrte uneins sind, steht das dabei.",
  },
  {
    titel: "Geprüft",
    text: "Eine Anlage aus der Datenbank. Was sie kostet und wer sie zertifiziert hat.",
  },
  {
    titel: "Kurz gerechnet",
    text: "Eine einzige Zahl, die etwas sichtbar macht. Meist überraschender als erwartet.",
  },
  {
    titel: "Nicht vergessen",
    text: "Fristen, die Geld kosten, wenn du sie verpasst. Dazu die Termine rund um Ramadan und Zakat.",
  },
];

const Newsletter = () => (
  <main className="bg-background">
    <Seo
      title="Newsletter für halal Finanzen: der Freitagsbrief | finanzmuslim"
      description="Jeden Freitag das Wichtigste für dein Geld: geprüfte Anlagen, Fristen und Antworten auf halal oder nicht. Fünf Minuten, kostenlos, jederzeit abbestellbar."
      path="/newsletter"
      brotkrumen={[{ name: "Newsletter", path: "/newsletter" }]}
    />
    <div className="container py-12 md:py-16">
      <header className="mx-auto max-w-[700px] text-center">
        <p className="text-[13px] font-bold uppercase tracking-wide text-violet">Newsletter</p>
        <h1 className="mt-2 text-3xl font-bold leading-tight text-foreground md:text-4xl">
          Der Freitagsbrief
        </h1>
        <p className="mt-4 text-[17px] leading-relaxed text-muted-foreground">
          Lies jeden Freitag früh in fünf Minuten, was für dein Geld zählt. Kostenlos und jederzeit
          abbestellbar.
        </p>
      </header>

      <section className="mt-12">
        <NewsletterBox />
      </section>

      <section className="mx-auto mt-14 max-w-[700px]">
        <h2 className="text-xl font-bold text-foreground">Was jede Woche drinsteht</h2>
        <ul className="mt-5 space-y-3">
          {rubriken.map((r) => (
            <li key={r.titel} className="card-surface p-5">
              <p className="text-[17px] font-bold text-foreground">{r.titel}</p>
              <p className="mt-1 text-[15px] leading-relaxed text-muted-foreground">{r.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <p className="mx-auto mt-10 max-w-[700px] text-center text-[13px] leading-relaxed text-muted-foreground">
        Wir geben deine Adresse nicht weiter. Ein Klick am Ende jeder Mail meldet dich wieder ab.
      </p>
    </div>
  </main>
);

export default Newsletter;
