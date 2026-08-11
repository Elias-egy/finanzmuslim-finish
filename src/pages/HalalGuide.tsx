import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Seo from "@/components/Seo";
import { ArrowLeft, ArrowRight, Check, HelpCircle, Plus } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import logoMark from "@/assets/logo-mark.png";
import guideTrio from "@/assets/guide-trio.webp";
import eliasPortrait from "@/assets/story-elias-paneele.jpg";

/**
 * /halal-guide — fokussierte Lead-Magnet-Seite in der Editorial-DNA der
 * Homepage. Ein Ziel: Anmeldung zum kostenlosen Halal Investment Guide.
 * Flow: Level-Auswahl (ohne personenbezogene Daten) → Vorname + E-Mail →
 * Webhook wird abgewartet → Erfolgszustand mit optionalem Investmentstart.
 */

type Level = "einsteiger" | "fortgeschritten" | "profi";
type Step = "level" | "contact" | "success";

const levelOptions: { value: Level; title: string; description: string }[] = [
  {
    value: "einsteiger",
    title: "Einstieg",
    description: "Ich starte neu und brauche klare Grundlagen.",
  },
  {
    value: "fortgeschritten",
    title: "Fortgeschritten",
    description: "Ich kenne die Grundlagen und möchte Anlagen besser einordnen.",
  },
  {
    value: "profi",
    title: "Profi",
    description: "Ich investiere bereits und möchte Kriterien und Prüfprozesse vertiefen.",
  },
];

const contents = [
  "Die Prinzipien: Was ein Investment halal macht, und was nicht",
  "Geeignete Anlageklassen im Überblick: Aktien, ETFs, Sukuk, Sachwerte",
  "Woran du unpassende Produkte erkennst: Riba, Gharar, verbotene Branchen",
  "Die häufigsten Fehler beim Einstieg, und wie du sie vermeidest",
];

/** Echte, bestätigte Zahlen — keine erfundenen Werte ergänzen. */
const stats = [
  { value: "10.000+", label: "Community" },
  { value: "3", label: "Stufen" },
  { value: "100%", label: "Quellenbasiert" },
];

const audienceFit = [
  "Du möchtest verstehen, wie islamkonformes Investieren grundsätzlich funktioniert.",
  "Du willst vorhandene Anlagen und Produkte nach klaren Kriterien einordnen.",
  "Du investierst bereits und möchtest deine Prüfprozesse vertiefen.",
];

const audienceNot = [
  "Keine individuelle Anlageberatung und keine Produktempfehlung für deine Situation.",
  "Keine Rendite- oder Erfolgsversprechen.",
  "Kein Ersatz für die eigene Prüfung und Entscheidung.",
];

const faqs = [
  {
    q: "Was kostet der Guide?",
    a: "Nichts. Der Guide ist kostenlos. Du bekommst ihn per E-Mail und kannst dich jederzeit wieder abmelden.",
  },
  {
    q: "Brauche ich Vorwissen?",
    a: "Nein. Du wählst vor der Anmeldung aus, wo du gerade stehst. So bekommst du die Fassung, die zu deinem Stand passt.",
  },
  {
    q: "Wie bekomme ich den Guide?",
    a: "Nach der Anmeldung senden wir den Guide an die angegebene E-Mail-Adresse. Prüfe auch deinen Spam-Ordner, falls er nicht gleich ankommt.",
  },
  {
    q: "Was passiert mit meinen Daten?",
    a: "Wir nutzen deine Angaben, um dir den Guide zuzustellen und dir E-Mails rund um islamkonformes Investieren zu senden. Du kannst dich jederzeit abmelden; deine Daten werden nicht verkauft. Details in der Datenschutzerklärung.",
  },
  {
    q: "Ist das eine Anlageberatung?",
    a: "Nein. Der Guide ist ein Bildungsinhalt. Er ersetzt keine individuelle Beratung und gibt keine Empfehlung für deine persönliche Situation.",
  },
];

const HalalGuide = () => {
  const [step, setStep] = useState<Step>("level");
  const [level, setLevel] = useState<Level | null>(null);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    // F4: DM-/ManyChat-Traffic mit bekannter Stufe (?stufe=einsteiger|
    // fortgeschritten|profi) überspringt die Level-Frage und landet direkt bei
    // Vorname + E-Mail. Ein Klick weniger im heißesten Moment des Funnels.
    const stufe = new URLSearchParams(window.location.search).get("stufe")?.toLowerCase();
    if (stufe && levelOptions.some((o) => o.value === stufe)) {
      setLevel(stufe as Level);
      setStep("contact");
    }
  }, []);

  const chooseLevel = (value: Level) => {
    setLevel(value);
    setError(null);
    setStep("contact");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || !level) return;
    setSubmitting(true);
    setError(null);
    try {
      // nachname bleibt im Payload (leer), damit der bestehende
      // Make-Workflow kompatibel bleibt; Pflichtfeld ist er nicht mehr.
      const res = await fetch("https://hook.eu1.make.com/u8nxrirwoycdcw61qd23eu312y79grlk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          vorname: firstName.trim(),
          nachname: "",
          level,
        }),
      });
      if (!res.ok) throw new Error(`Webhook ${res.status}`);
      setStep("success");
    } catch {
      setError(
        "Das hat leider nicht geklappt. Bitte prüfe deine Internetverbindung und versuche es noch einmal.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const selectedLevel = levelOptions.find((o) => o.value === level);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Seo
        title="Halal Investment Guide – Kostenlos für Muslime | finanzmuslim"
        description="Sichere dir den kostenlosen Halal Investment Guide: Prinzipien, Anlageklassen, Riba- und Gharar-Prüfung, in unter 30 Sekunden."
        path="/halal-guide"
      />

      {/* Reduzierter Header: Logo + dezenter Rückweg, keine volle Navigation */}
      <header className="sticky top-0 z-50 bg-nav/95 backdrop-blur-md border-b border-border/60">
        <div className="container flex items-center justify-between h-[64px] md:h-[68px]">
          <a href="/" className="flex items-center gap-2" aria-label="finanzmuslim – zur Startseite">
            <img
              src={logoMark}
              alt="finanzmuslim"
              className="h-7 md:h-8 w-auto object-contain select-none"
              draggable={false}
            />
          </a>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-[14px] font-medium text-foreground/80 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Zur Startseite
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Above the fold — gestraffte Sequenz: Titel → Cover → Fragen → E-Mail → Microcopy.
            Visuelles Design unveraendert, nur Reihenfolge/Aufbau kompakter. */}
        <section className="bg-background">
          <div className="container max-w-2xl min-h-[calc(100svh-64px)] md:min-h-0 flex flex-col justify-center py-5 md:py-6">
            {/* Titel — Nutzen + Tempo, Hormozi-Proportionen: Headline dominiert */}
            <div className="text-center">
              <h1 className="headline text-[27px] sm:text-[38px] md:text-[42px] leading-[1.12] md:leading-[1.08] tracking-[-0.01em]">
                Bekomme deinen personalisierten Guide...<br />
                &nbsp;In unter 30 Sekunden.
              </h1>
            </div>

            {/* Guide-Trio: freigestellte Cover (Anfänger/Fortgeschritten/Profi)
                direkt auf der Cream-Flaeche — kein Panel, keine Zusatzzeile */}
            <img
              src={guideTrio}
              alt="Halal Investment Guide, drei Fassungen: Anfänger, Fortgeschritten und Profi"
              width={1200}
              height={737}
              className="mx-auto mt-3 md:mt-4 w-auto max-h-[182px] md:max-h-[172px] drop-shadow-[0_18px_30px_rgba(30,25,10,0.28)] select-none"
              draggable={false}
            />

            {/* Formularfluss: Fragen → E-Mail → Microcopy */}
            <div ref={formRef} id="anmelden" className="mt-4 md:mt-5 scroll-mt-24">
                {step === "level" && (
                  <fieldset className="max-w-xl mx-auto">
                    <legend className="headline text-lg md:text-xl text-foreground">
                      Wo stehst du gerade beim halal Investieren?
                    </legend>
                    <div className="mt-2.5 md:mt-4 grid grid-cols-1 gap-2 md:gap-3 max-w-xl">
                      {levelOptions.map((opt) => (
                        <button
                          type="button"
                          key={opt.value}
                          onClick={() => chooseLevel(opt.value)}
                          className="group text-left rounded-2xl border border-border bg-surface hover:border-primary/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 px-4 py-3 md:px-5 md:py-4 transition"
                        >
                          <span className="flex items-center justify-between gap-4">
                            <span>
                              <span className="block font-semibold text-foreground text-[16px]">
                                {opt.title}
                              </span>
                              <span className="mt-1 block text-sm text-muted-foreground leading-relaxed">
                                {opt.description}
                              </span>
                            </span>
                            <ArrowRight
                              className="h-4 w-4 shrink-0 transition-transform motion-safe:group-hover:translate-x-1 text-foreground/40"
                              aria-hidden
                            />
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Hinweis für Unentschlossene */}
                    <div className="mt-3 flex justify-center">
                      <Popover>
                        <PopoverTrigger asChild>
                          <button
                            type="button"
                            className="inline-flex items-center gap-1.5 text-[12.5px] text-muted-foreground hover:text-foreground/80 transition-colors underline underline-offset-4 decoration-muted-foreground/40"
                          >
                            <HelpCircle className="h-3.5 w-3.5" aria-hidden />
                            Du kannst dich nicht entscheiden?
                          </button>
                        </PopoverTrigger>
                        <PopoverContent
                          side="top"
                          align="center"
                          className="w-[280px] rounded-xl border border-border/70 bg-surface p-4 text-[13px] leading-relaxed text-muted-foreground shadow-[0_20px_45px_-20px_rgba(30,25,10,0.35)]"
                        >
                          Kein Problem. Starte beim Einstieg-Guide.{"\n"}
                          Die anderen Fassungen kannst du auch im Anschluss noch bekommen
                        </PopoverContent>
                      </Popover>
                    </div>
                  </fieldset>
                )}

                {step === "contact" && (
                  <form onSubmit={handleSubmit} className="max-w-xl mx-auto" noValidate={false}>
                    <p className="text-[15px] text-foreground/80">
                      <Check className="inline h-4 w-4 text-foreground mr-1.5 -translate-y-px" aria-hidden />
                      {selectedLevel?.title}. Gut, dann schicken wir dir die passende Fassung.
                    </p>
                    <h2 className="headline mt-3 text-xl md:text-2xl text-foreground">
                      Wohin dürfen wir den Guide senden?
                    </h2>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-[0.8fr_1.2fr] gap-3">
                      <input
                        className="w-full rounded-xl border border-border bg-surface px-4 py-3.5 text-[15px] text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10 transition"
                        type="text"
                        name="given-name"
                        autoComplete="given-name"
                        required
                        placeholder="Vorname"
                        aria-label="Vorname"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                      <input
                        className="w-full rounded-xl border border-border bg-surface px-4 py-3.5 text-[15px] text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10 transition"
                        type="email"
                        name="email"
                        autoComplete="email"
                        required
                        placeholder="E-Mail-Adresse"
                        aria-label="E-Mail-Adresse"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    {/* Sekundär: Hinweis für bereits registrierte Community-Mitglieder */}
                    <div className="mt-3">
                      <Popover>
                        <PopoverTrigger asChild>
                          <button
                            type="button"
                            className="inline-flex items-center gap-1.5 text-[12.5px] text-muted-foreground hover:text-foreground/80 transition-colors underline underline-offset-4 decoration-muted-foreground/40"
                          >
                            <HelpCircle className="h-3.5 w-3.5" aria-hidden />
                            Schon Gründer?
                          </button>
                        </PopoverTrigger>
                        <PopoverContent
                          side="top"
                          align="start"
                          className="w-[280px] rounded-xl border border-border/70 bg-surface p-4 text-[13px] leading-relaxed text-muted-foreground shadow-[0_20px_45px_-20px_rgba(30,25,10,0.35)]"
                        >
                          Falls du deine E-Mail-Adresse bereits über Instagram angegeben hast und schon Teil der Community bist, kannst du hier einfach dieselbe E-Mail-Adresse eingeben. Du erhältst nichts doppelt.
                        </PopoverContent>
                      </Popover>
                    </div>


                    {error && (
                      <p role="alert" className="mt-3 text-[14px] leading-relaxed text-destructive">
                        {error}
                      </p>
                    )}

                    <div className="mt-5 flex flex-wrap items-center gap-5">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex items-center justify-center rounded-full bg-primary text-white px-8 py-3.5 text-[15px] font-semibold hover:bg-primary-hover transition-colors disabled:opacity-60 disabled:cursor-wait"
                      >
                        {submitting ? "Wird gesendet …" : "Guide kostenlos erhalten"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setStep("level");
                          setError(null);
                        }}
                        className="inline-flex items-center gap-1.5 text-sm text-foreground/70 hover:text-foreground transition-colors"
                      >
                        <ArrowLeft className="h-3.5 w-3.5" aria-hidden /> Zurück zur Auswahl
                      </button>
                    </div>

                    {/* Consent — bewusst lesbar, nicht als Winzschrift versteckt */}
                    <p className="mt-5 text-[13px] leading-relaxed text-muted-foreground max-w-lg">
                      Mit dem Absenden erklärst du dich einverstanden, dass finanzmuslim dir den
                      Guide und E-Mails rund um islamkonformes Investieren an diese Adresse
                      sendet. Du kannst dich jederzeit abmelden. Deine Daten werden
                      vertraulich behandelt und nicht verkauft{" "}(
                      <Link to="/datenschutz" className="underline underline-offset-2 hover:text-foreground">
                        Datenschutzerklärung
                      </Link>
                      ).
                    </p>
                  </form>
                )}

                {step === "success" && (
                  <div className="max-w-xl mx-auto">
                    <span className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-foreground">
                      <Check className="h-6 w-6" aria-hidden />
                    </span>
                    <h2 className="headline mt-5 text-2xl md:text-3xl text-foreground">
                      Dein Guide ist unterwegs.
                    </h2>
                    <p className="mt-3 text-muted-foreground leading-relaxed">
                      Wir senden die {selectedLevel ? `„${selectedLevel.title}“-Fassung` : "passende Fassung"} des
                      Halal Investment Guides an <span className="text-foreground font-medium">{email}</span>.
                      Prüfe gleich dein Postfach, und zur Sicherheit auch den Spam-Ordner.
                    </p>
                    <div className="mt-7 border-t border-border/70 pt-6">
                      <p className="text-[15px] text-muted-foreground">
                        Du möchtest direkt praktisch starten?
                      </p>
                      <Link
                        to="/dein-investmentstart"
                        className="mt-2 inline-flex items-center gap-2 text-[15px] font-semibold text-foreground hover:text-primary transition-colors"
                      >
                        Zum Investmentstart <ArrowRight className="h-4 w-4" aria-hidden />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
          </div>
        </section>

        {/* Trust-Band: echte Belege */}
        <section className="border-y border-border/60 bg-surface">
          <div className="container py-8 md:py-10">
            <dl className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-10">
              {stats.map((s) => (
                <div key={s.label} className="flex items-baseline gap-3">
                  <dd className="headline text-2xl md:text-[28px]">{s.value}</dd>
                  <dt className="text-[12px] font-semibold uppercase tracking-[0.16em] text-foreground/60">
                    {s.label}
                  </dt>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Inhalte des Guides */}
        <section className="bg-background py-16 md:py-20">
          <div className="container max-w-3xl">
            <span className="inline-flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.25em] text-primary">
              <span className="h-px w-6 bg-primary" aria-hidden /> Das lernst du
            </span>
            <h2 className="headline text-3xl md:text-4xl mt-4">Was im Guide steht</h2>
            <ul className="mt-8 border-t border-border/80">
              {contents.map((c, i) => (
                <li key={c} className="flex items-start gap-5 border-b border-border/80 py-5">
                  <span className="headline text-sm text-primary pt-0.5 tabular-nums">
                    0{i + 1}
                  </span>
                  <span className="text-[15.5px] md:text-[16px] leading-relaxed text-foreground/90">
                    {c}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Für wen / Was der Guide nicht ist */}
        <section className="bg-surface border-y border-border/50 py-16 md:py-20">
          <div className="container grid md:grid-cols-2 gap-10 md:gap-14 max-w-5xl">
            <div>
              <h2 className="headline text-2xl md:text-3xl">Für wen der Guide ist</h2>
              <ul className="mt-6 space-y-4">
                {audienceFit.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-[15px] leading-relaxed text-foreground/85">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-foreground" aria-hidden />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="headline text-2xl md:text-3xl">Was der Guide nicht ist</h2>
              <ul className="mt-6 space-y-4">
                {audienceNot.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-[15px] leading-relaxed text-muted-foreground">
                    <span className="mt-3 h-px w-4 shrink-0 bg-foreground/40" aria-hidden />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Elias — kurzer Vertrauensabschnitt */}
        <section className="bg-background py-16 md:py-20">
          <div className="container grid md:grid-cols-[0.65fr_1.35fr] gap-8 md:gap-14 items-center max-w-5xl">
            <img
              src={eliasPortrait}
              alt="Elias, Gründer von finanzmuslim"
              className="w-full max-w-[280px] mx-auto md:max-w-none rounded-[1.25rem] object-cover aspect-[4/5] shadow-[0_25px_50px_-30px_rgba(30,25,10,0.4)]"
              loading="lazy"
            />
            <div>
              <span className="inline-flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.25em] text-primary">
                <span className="h-px w-6 bg-primary" aria-hidden /> Wer dahinter steht
              </span>
              <h2 className="headline text-3xl md:text-4xl mt-4">Von Elias, Gründer von finanzmuslim</h2>
              <p className="mt-5 text-muted-foreground leading-[1.75] text-[15px] md:text-[16px] max-w-prose">
                Elias hat nach Vorträgen an deutschen Universitäten und aus
                eigener Erfahrung heraus den Guide geschrieben: Fast jedes Standard-Finanzprodukt enthält
                Zinsen, und viele Muslime spüren genau deshalb ein schlechtes
                Gewissen bei ihren Finanzen. Der Guide bündelt das Wissen aus
                seiner Arbeit im Islamic Finance, damit du diese Unsicherheit
                Schritt für Schritt ablegen kannst.
              </p>
              {/* Qualifikations-Hinweis (Elias 16.7.): nur bestandene Sachkunde-
                  prüfungen — KEINE Aussage über Erlaubnis/Registrierung.
                  ⚠️ Wortlaut vor Livegang juristisch prüfen lassen. */}
              <p className="mt-4 text-[13px] leading-relaxed text-muted-foreground/90">
                IHK-Sachkundeprüfungen für Finanzanlagenvermittlung (§ 34f GewO) und
                Versicherungsvermittlung (§ 34d GewO) erfolgreich abgelegt.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-background pb-16 md:pb-20">
          <div className="container max-w-3xl">
            <span className="inline-flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.25em] text-primary">
              <span className="h-px w-6 bg-primary" aria-hidden /> FAQ
            </span>
            <h2 className="headline text-3xl md:text-4xl mt-4">Häufige Fragen</h2>
            <div className="mt-8 border-t border-border/80">
              {faqs.map((f, i) => {
                const isOpen = openFaq === i;
                return (
                  <div key={i} className="border-b border-border/80">
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="w-full flex items-center justify-between gap-6 py-5 text-left"
                    >
                      <span className="headline text-base md:text-lg text-foreground">{f.q}</span>
                      <Plus
                        className={`h-5 w-5 shrink-0 text-foreground/60 transition-transform ${isOpen ? "rotate-45" : ""}`}
                        strokeWidth={1.5}
                        aria-hidden
                      />
                    </button>
                    {isOpen && (
                      <p className="pb-6 pr-10 text-muted-foreground leading-relaxed text-[15px]">
                        {f.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Abschluss-CTA — führt zum selben Formular */}
        {step !== "success" && (
          <section className="bg-primary text-white py-16 md:py-20">
            <div className="container text-center max-w-2xl">
              <h2 className="headline text-white text-3xl md:text-4xl leading-[1.08]">
                Hol dir den Guide, kostenlos.
              </h2>
              <p className="mt-4 text-white/75 leading-relaxed text-[15px] md:text-base">
                Wähle aus, wo du stehst, und wir senden dir die passende Fassung
                per E-Mail.
              </p>
              <button
                onClick={scrollToForm}
                className="mt-7 inline-flex items-center justify-center rounded-full bg-white text-foreground px-8 py-3.5 text-[15px] font-semibold hover:bg-white transition-colors shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)]"
              >
                Guide kostenlos erhalten
              </button>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-foreground text-white/80 py-12">
        <div className="container flex flex-col items-center gap-4 text-center">
          <img src={logoMark} alt="finanzmuslim" className="h-9 w-auto brightness-0 invert opacity-90" />
          <div className="h-px w-16 bg-primary/60" />
          <p className="text-xs text-white/50 tracking-wide">
            © {new Date().getFullYear()} finanzmuslim. Alle Rechte vorbehalten.
          </p>
          <div className="flex gap-6 text-xs text-white/50">
            <Link to="/impressum" className="hover:text-white/80 transition-colors">
              Impressum
            </Link>
            <Link to="/datenschutz" className="hover:text-white/80 transition-colors">
              Datenschutz
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HalalGuide;
