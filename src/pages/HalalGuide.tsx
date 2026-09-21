import { useState } from "react";
import { Link } from "react-router-dom";
import Seo from "@/components/Seo";
import { BookOpen, Check, ChevronDown, Shield, Sparkles, TrendingUp, Users } from "lucide-react";
import guideTrio from "@/assets/guide-trio-v3.webp";
import eliasPortrait from "@/assets/elias-autor.webp";

/**
 * /halal-guide — Lead-Magnet-Seite fuer den Halal Investment Guide.
 * Ein Ziel: E-Mail-Adresse einsammeln. Kein Verkaufsdruck, keine erfundene
 * Dringlichkeit. Das Formular ist vorerst funktionslos und wird spaeter an
 * MailerLite angebunden.
 */

const contents = [
  {
    icon: BookOpen,
    title: "Grundlagen verstehen",
    text: "Was halal und haram beim Investieren bedeutet und worauf du achten solltest.",
  },
  {
    icon: TrendingUp,
    title: "Produkte prüfen",
    text: "Wie du Aktien, ETFs und andere Anlageklassen anhand klarer Kriterien einordnest.",
  },
  {
    icon: Shield,
    title: "Fallen erkennen",
    text: "Typische Produkte und Strukturen, die Riba oder Gharar enthalten, und wie du sie vermeidest.",
  },
  {
    icon: Sparkles,
    title: "Erträge reinigen",
    text: "Was du mit nicht ganz sauberen Erträgen machen kannst, bis du sie komplett vermeidest.",
  },
  {
    icon: Check,
    title: "Der erste Schritt",
    text: "Wie du ein passendes Depot eröffnest und deine erste islamkonforme Anlage umsetzt.",
  },
];

const audience = [
  "Du möchtest verstehen, wie islamkonformes Investieren grundsätzlich funktioniert.",
  "Du willst vorhandene Produkte und Depots nach klaren Kriterien prüfen.",
  "Du suchst einen sachlichen Einstieg ohne Hektik und ohne Verkaufsdruck.",
];

const faqs = [
  {
    q: "Ist der Guide wirklich kostenlos?",
    a: "Ja. Du bekommst ihn per E-Mail zugeschickt und kannst dich jederzeit wieder abmelden.",
  },
  {
    q: "Wie bekomme ich den Guide?",
    a: "Nach der Anmeldung senden wir dir den Guide an die angegebene E-Mail-Adresse. Prüfe gegebenenfalls auch deinen Spam-Ordner.",
  },
  {
    q: "Was passiert mit meiner E-Mail-Adresse?",
    a: "Wir nutzen sie, um dir den Guide zuzusenden und dir weitere E-Mails rund um islamkonformes Finanzwissen zu senden. Deine Daten werden nicht verkauft. Details findest du in der Datenschutzerklärung.",
  },
  {
    q: "Ist das eine Anlageberatung?",
    a: "Nein. Der Guide ist Bildungsinhalt. Er ersetzt keine individuelle Beratung und enthält keine Empfehlung für deine persönliche Situation.",
  },
];

const levels = [
  { key: "einstieg", title: "Einstieg", text: "Ich starte neu und brauche klare Grundlagen." },
  {
    key: "fortgeschritten",
    title: "Fortgeschritten",
    text: "Ich kenne die Grundlagen und möchte Anlagen besser einordnen.",
  },
  { key: "profi", title: "Profi", text: "Ich investiere bereits und möchte Kriterien und Prüfprozesse vertiefen." },
];

const inputClass =
  "h-12 w-full rounded-lg border border-border bg-card px-4 text-[16px] text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10 transition";

/**
 * Der Webhook ist derselbe wie auf der alten Seite: Make nimmt E-Mail, Vorname
 * und Stufe entgegen und legt die Adresse in der passenden MailerLite-Gruppe
 * ab (Einsteiger, Fortgeschritten, Profi). Der Guide kommt per E-Mail.
 */
const GUIDE_WEBHOOK = "https://hook.eu1.make.com/u8nxrirwoycdcw61qd23eu312y79grlk";

const GuideForm = ({ id }: { id?: string }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [vorname, setVorname] = useState("");
  const [email, setEmail] = useState("");
  const [level, setLevel] = useState<string | null>(null);
  const [sendet, setSendet] = useState(false);
  const [fehler, setFehler] = useState<string | null>(null);

  const absenden = async () => {
    if (!level || sendet) return;
    setSendet(true);
    setFehler(null);
    try {
      const res = await fetch(GUIDE_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), vorname: vorname.trim(), nachname: "", level }),
      });
      if (!res.ok) throw new Error(`Webhook ${res.status}`);
      setStep(3);
    } catch {
      setFehler("Das hat gerade nicht geklappt. Bitte versuch es gleich noch einmal oder schreib an elias@finanzmuslim.com.");
    } finally {
      setSendet(false);
    }
  };

  if (step === 3) {
    return (
      <div id={id} className="rounded-lg border border-border bg-card p-6 text-left">
        <p className="text-[17px] font-semibold text-foreground">Dein Guide ist unterwegs.</p>
        <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
          Wir haben deinen Guide an {email || "deine E-Mail-Adresse"} geschickt. Falls er nicht ankommt, schau bitte
          auch in deinen Spam-Ordner.
        </p>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div id={id} className="flex flex-col gap-4 text-left">
        <p className="flex items-center gap-2 text-[15px] text-foreground/80">
          <Check className="h-4 w-4 text-primary" aria-hidden />
          Danke{vorname ? `, ${vorname}` : ""}!
        </p>
        <p className="text-[17px] font-bold text-foreground">Wo stehst du gerade beim halal Investieren?</p>

        <div className="flex flex-col gap-3">
          {levels.map((l) => {
            const active = level === l.key;
            return (
              <button
                key={l.key}
                type="button"
                aria-pressed={active}
                onClick={() => setLevel(l.key)}
                className={`rounded-lg border p-4 text-left transition-colors ${
                  active ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "border-border bg-card hover:border-primary/50"
                }`}
              >
                <span className="block text-[15px] font-semibold text-foreground">{l.title}</span>
                <span className="mt-1 block text-[14px] leading-relaxed text-muted-foreground">{l.text}</span>
              </button>
            );
          })}
        </div>

        {fehler && (
          <p role="alert" className="text-[14px] leading-relaxed text-destructive">
            {fehler}
          </p>
        )}

        <button
          type="button"
          disabled={!level || sendet}
          onClick={absenden}
          className="h-12 w-full inline-flex items-center justify-center rounded-lg bg-primary px-6 text-[15px] font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-40"
        >
          {sendet ? "Wird gesendet …" : "Guide anfordern"}
        </button>

        <button
          type="button"
          onClick={() => setStep(1)}
          className="self-start text-[13px] text-muted-foreground underline underline-offset-2 hover:text-foreground"
        >
          Zurück
        </button>
      </div>
    );
  }

  return (
    <form
      id={id}
      onSubmit={(e) => {
        e.preventDefault();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
          setFehler("Bitte gib eine gültige E-Mail-Adresse ein.");
          return;
        }
        setFehler(null);
        setStep(2);
      }}
      className="flex flex-col gap-3 text-left"
      noValidate
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          type="text"
          name="vorname"
          autoComplete="given-name"
          placeholder="Vorname"
          aria-label="Vorname"
          value={vorname}
          onChange={(e) => setVorname(e.target.value)}
          className={inputClass}
        />
        <input
          type="email"
          name="email"
          autoComplete="email"
          placeholder="E-Mail-Adresse"
          aria-label="E-Mail-Adresse"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />
      </div>
      {fehler && (
        <p role="alert" className="text-[14px] leading-relaxed text-destructive">
          {fehler}
        </p>
      )}
      <button
        type="submit"
        className="h-12 w-full inline-flex items-center justify-center rounded-lg bg-primary px-6 text-[15px] font-semibold text-primary-foreground hover:bg-primary-hover transition-colors"
      >
        Lass uns starten
      </button>
      <p className="text-[12px] leading-relaxed text-muted-foreground">
        Mit dem Absenden erklärst du dich einverstanden, dass finanzmuslim dir den Guide und E-Mails rund um islamkonformes Investieren sendet. Du kannst dich jederzeit abmelden.{" "}
        <Link to="/datenschutz" className="underline underline-offset-2 hover:text-foreground">
          Datenschutzerklärung
        </Link>
      </p>
    </form>
  );
};

const HalalGuide = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Halal Investment Guide – Kostenlos anmelden | finanzmuslim"
        description="Der kostenlose Halal Investment Guide: Grundlagen, Kriterien und praktische Schritte für islamkonformes Investieren. Ohne Verkaufsdruck."
        path="/halal-guide"
        brotkrumen={[{ name: "Halal Investment Guide", path: "/halal-guide" }]}
      />

      <main>
        {/* 1. Hero */}
        <section className="bg-hero">
          <div className="container py-12 md:py-20 lg:py-24">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
              <div className="max-w-xl lg:pl-12 xl:pl-20">
                <span className="badge-note">Kostenlos</span>
                <h1 className="headline mt-5 text-[32px] leading-[1.1] sm:text-[40px] md:text-[48px] text-foreground">
                  Bekomme deinen personalisierten Guide
                  <br />
                  in unter 30 Sekunden.
                </h1>
                <div className="mt-8">
                  <GuideForm />
                </div>
              </div>

              {/* Auf dem Handy laeuft das Bild bewusst ueber die Innenkante
                  hinaus, sonst wirken die drei Buecher wie Briefmarken. */}
              <div className="-mx-6 flex justify-center sm:mx-0 lg:justify-end">
                <img
                  src={guideTrio}
                  alt="Der Halal Investment Guide in drei Stufen: Einsteiger, Fortgeschritten, Profi"
                  className="h-auto w-full max-w-none select-none"
                  draggable={false}
                />
              </div>
            </div>
          </div>
        </section>

        {/* 2. Was drin steht */}
        <section className="py-12 md:py-20">
          <div className="container max-w-5xl">
            <div className="card-surface p-8 md:p-12">
              <h2 className="headline text-2xl md:text-3xl text-foreground">Was drin steht</h2>
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {contents.map((item) => (
                  <div key={item.title} className="flex items-start gap-4">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <item.icon className="h-5 w-5" aria-hidden />
                    </span>
                    <div>
                      <h3 className="font-semibold text-foreground">{item.title}</h3>
                      <p className="mt-1 text-[14px] leading-relaxed text-muted-foreground">
                        {item.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 3. Für wen der Guide ist */}
        <section className="py-12 md:py-20 bg-surface">
          <div className="container max-w-3xl">
            <h2 className="headline text-2xl md:text-3xl text-center text-foreground">Für wen der Guide ist</h2>
            <ul className="mt-8 space-y-4">
              {audience.map((text) => (
                <li
                  key={text}
                  className="flex items-start gap-4 text-[15px] leading-relaxed text-foreground/85"
                >
                  <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Check className="h-3 w-3" aria-hidden />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 4. Über den Autor */}
        <section className="py-12 md:py-20">
          <div className="container max-w-4xl">
            <div className="card-surface p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                <span className="h-32 w-32 shrink-0 overflow-hidden rounded-full bg-[#EFE7DC] md:h-40 md:w-40">
                  <img
                    src={eliasPortrait}
                    alt="Elias El-Gendy, Gründer von finanzmuslim"
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </span>
                <div>
                  <h2 className="headline text-2xl md:text-3xl text-foreground">Von Elias El-Gendy</h2>
                  <p className="mt-4 text-[15px] leading-relaxed text-foreground/80">
                    Elias beschäftigt sich seit Jahren mit islamkonformem Finanzwissen. Er hat den Guide geschrieben, weil viele Muslime wissen möchten, wie sie ihre Finanzen mit ihrem Glauben in Einklang bringen können – ohne Hektik und ohne Verkaufsdruck.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. FAQ */}
        <section className="py-12 md:py-20 bg-surface">
          <div className="container max-w-3xl">
            <h2 className="headline text-2xl md:text-3xl text-foreground">Häufige Fragen</h2>
            <div className="mt-8 card-surface divide-y divide-border">
              {faqs.map((f, i) => {
                const isOpen = openFaq === i;
                return (
                  <div key={i}>
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="w-full flex min-h-[44px] items-center justify-between gap-4 py-4 px-5 text-left"
                    >
                      <span className="font-semibold text-foreground">{f.q}</span>
                      <ChevronDown
                        className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
                        aria-hidden
                      />
                    </button>
                    {isOpen && (
                      <p className="px-5 pb-5 text-[15px] leading-relaxed text-muted-foreground">
                        {f.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 6. Abschluss-Formular */}
        <section className="py-12 md:py-20">
          <div className="container max-w-[700px]">
            <div className="card-surface p-8 md:p-12 text-center">
              <h2 className="headline text-2xl md:text-3xl text-foreground">Halal Investment Guide kostenlos sichern</h2>
              <p className="mt-3 text-muted-foreground">
                Trage deine E-Mail-Adresse ein. Du bekommst den Guide zugeschickt.
              </p>
              <div className="mt-6 text-left">
                <GuideForm />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HalalGuide;
