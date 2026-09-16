import { Link } from "react-router-dom";
import Seo from "@/components/Seo";
import { BookOpen, Mail, Scale, ShieldCheck } from "lucide-react";
import portrait from "@/assets/story-elias-paneele.jpg";

/**
 * /ueber-mich — wer hinter finanzmuslim steht.
 *
 * Wichtigste Vertrauensseite bei Geldthemen, fuer Leser, fuer Google und fuer
 * Partnernetzwerke, die eine Bewerbung pruefen. Nur belegbare Aussagen.
 * Reichweite steht auf /kooperationen und wird dort mit Datum gepflegt.
 */

const SITE = "https://finanzmuslim.com";

const person = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  url: `${SITE}/ueber-mich`,
  mainEntity: {
    "@type": "Person",
    name: "Elias El-Gendy",
    jobTitle: "Gründer von finanzmuslim",
    email: "elias@finanzmuslim.com",
    url: `${SITE}/ueber-mich`,
    sameAs: [
      "https://instagram.com/finanz.muslim",
      "https://tiktok.com/@finanz.muslim",
      "https://youtube.com/@finanz.muslim",
    ],
  },
};

const punkte = [
  {
    icon: BookOpen,
    titel: "Erklären statt verkaufen",
    text: "Jeder Beitrag beantwortet eine Frage, die mir Muslime wirklich stellen: Sind Aktien halal? Darf ich ein Girokonto mit Zinsen haben? Wie berechne ich Zakat auf ETFs? Jede Antwort nennt ihre Quelle.",
  },
  {
    icon: Scale,
    titel: "Prüfen nach festen Kriterien",
    text: "Depots, Konten, Krypto-Börsen und Edelmetalle vergleiche ich immer mit denselben Fragen. Kann ich das Konto ohne Zinsen nutzen? Welche Halal-Anlagen gibt es dort? Die Methodik ist offen.",
  },
  {
    icon: ShieldCheck,
    titel: "Offen, womit ich Geld verdiene",
    text: "Manche Links sind Partnerlinks und mit * markiert. Geprüft wird vorher, und wer die Kriterien nicht erfüllt, bekommt keinen Link, auch wenn er zahlen würde.",
  },
];

const UeberMich = () => (
  <main className="bg-background">
    <Seo
      title="Über mich: Elias El-Gendy, Gründer von finanzmuslim"
      description="Lerne, wer hinter finanzmuslim steht: wie ich Anbieter prüfe, womit ich Geld verdiene und wie du mich erreichst."
      path="/ueber-mich"
      brotkrumen={[{ name: "Über mich", path: "/ueber-mich" }]}
      jsonLd={person}
    />

    <section className="container max-w-4xl pt-14 md:pt-20">
      <div className="grid items-center gap-8 md:grid-cols-[260px_1fr] md:gap-12">
        <img
          src={portrait}
          alt="Elias El-Gendy, Gründer von finanzmuslim"
          className="mx-auto aspect-[4/5] w-full max-w-[240px] rounded-[2rem] object-cover md:max-w-none"
        />
        <div>
          <span className="badge-note">Über mich</span>
          <h1 className="headline mt-5 text-4xl leading-[1.05] md:text-[52px]">Salam, ich bin Elias</h1>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-[17px]">
            Ich habe finanzmuslim gegründet und betreibe es unabhängig. Hier erkläre ich, wie Muslime in
            Deutschland ihr Geld anlegen können, ohne Zinsen und ohne sich etwas schönzureden.
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-[17px]">
            Angefangen hat es auf Instagram und TikTok als{" "}
            <a
              href="https://instagram.com/finanz.muslim"
              className="font-semibold text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              @finanz.muslim
            </a>
            . Dazu kommen Vorträge an Universitäten. Die Fragen dort sind immer dieselben, und die Antworten
            stehen jetzt gesammelt auf dieser Seite.
          </p>
        </div>
      </div>
    </section>

    <section className="container max-w-4xl py-12 md:py-16">
      <h2 className="headline text-2xl md:text-3xl">Wie ich arbeite</h2>
      <ul className="mt-6 grid gap-4 md:grid-cols-3">
        {punkte.map(({ icon: Icon, titel, text }) => (
          <li key={titel} className="card-surface p-6">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <Icon className="h-5 w-5" aria-hidden />
            </span>
            <h3 className="mt-4 text-[18px] font-bold text-foreground">{titel}</h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">{text}</p>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[15px] font-semibold">
        <Link to="/vergleiche/methodik" className="text-primary hover:underline">
          So bewerte ich Anbieter
        </Link>
        <Link to="/wie-ich-geld-verdiene" className="text-primary hover:underline">
          So verdiene ich Geld
        </Link>
      </div>
    </section>

    <section className="container max-w-4xl pb-12 md:pb-16">
      <div className="card-surface border-l-4 border-l-primary p-6 md:p-8">
        <h2 className="headline text-xl md:text-2xl">Was ich nicht bin</h2>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          Ich bin kein Gelehrter und spreche keine Fatwa. Wo es um religiöse Urteile geht, nenne ich die
          Quelle, auf die ich mich stütze. Ich bin auch kein Anlageberater: Die Inhalte helfen dir, selbst
          eine gute Entscheidung zu treffen, sie ersetzen keine Beratung.
        </p>
      </div>
    </section>

    <section className="container max-w-4xl pb-16 md:pb-24">
      <div className="card-surface flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between md:p-8">
        <div className="flex items-start gap-4">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Mail className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <h2 className="headline text-xl">Schreib mir</h2>
            <p className="mt-1 text-muted-foreground">
              Fragen, Fehler auf der Seite oder ein Thema, das fehlt:{" "}
              <a href="mailto:elias@finanzmuslim.com" className="font-semibold text-primary hover:underline">
                elias@finanzmuslim.com
              </a>
            </p>
          </div>
        </div>
        <Link to="/kooperationen" className="btn-primary shrink-0">
          Für Partner
        </Link>
      </div>
    </section>
  </main>
);

export default UeberMich;
