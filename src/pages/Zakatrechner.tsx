import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import ZakatCalculator from "@/components/ZakatCalculator";
import Seo, { calculatorJsonLd, faqJsonLd } from "@/components/Seo";

/**
 * /zakat-rechner — zweites Werkzeug neben dem Renditerechner.
 *
 * Strategisch: Finanzfluss zieht seinen Traffic nicht aus Social Media, sondern
 * aus dutzenden Rechnern, die dauerhaft in der Suche stehen. Genau dieser Teil
 * fehlte hier bisher. "Zakat auf Aktien" und "Zakat Depot berechnen" werden auf
 * Deutsch gesucht, ohne dass es ein brauchbares Werkzeug dazu gibt.
 *
 * Der Erklaertext unter dem Rechner ist kein Beiwerk: ohne Text kann Google die
 * Seite nicht bewerten. Beim Renditerechner war genau das der Fehler.
 */

const zakatFaq = [
  {
    q: "Muss man Zakat auf Aktien und ETFs zahlen?",
    a: "Ja, Aktien und ETF-Anteile gehören zum zakatpflichtigen Vermögen. Umstritten ist die Bemessungsgrundlage: Wer Anteile zum Weiterverkauf hält, zahlt nach verbreiteter Auffassung 2,5 % auf den vollen Marktwert. Wer langfristig investiert bleibt, setzt nach anderer Auffassung nur den Anteil an, der auf zakatpflichtige Vermögenswerte des Unternehmens entfällt.",
  },
  {
    q: "Wie hoch ist der Nisab?",
    a: "Der Nisab entspricht dem Gegenwert von 85 Gramm Gold oder 595 Gramm Silber. Weil Silber deutlich günstiger ist, liegt der Silber-Nisab niedriger und erfasst mehr Menschen. Viele Gelehrte empfehlen ihn deshalb, weil er den Empfängern der Zakat zugutekommt.",
  },
  {
    q: "Wie viel Prozent Zakat zahlt man?",
    a: "Auf Geldvermögen, Gold, Silber und Handelsware beträgt die Zakat 2,5 Prozent. Voraussetzung ist, dass das Vermögen ein volles Mondjahr (Hawl) über dem Nisab lag.",
  },
  {
    q: "Werden Schulden abgezogen?",
    a: "Kurzfristig fällige Verbindlichkeiten werden nach verbreiteter Auffassung vom zakatpflichtigen Vermögen abgezogen. Bei langlaufenden Verbindlichkeiten wird üblicherweise nur der Teil abgezogen, der innerhalb des kommenden Jahres fällig wird.",
  },
  {
    q: "Zählt Gold aus einem ETC mit?",
    a: "Physisch hinterlegtes Gold zählt zum zakatpflichtigen Vermögen, unabhängig davon, ob du es als Barren zu Hause hast oder über ein physisch hinterlegtes Wertpapier hältst. Maßgeblich ist der Marktwert am Stichtag.",
  },
  {
    q: "Wann ist der Stichtag?",
    a: "Der Stichtag ist der Tag, an dem dein Vermögen ein volles Mondjahr über dem Nisab lag. Viele wählen einen festen Tag im Ramadan, um ihn nicht zu vergessen. Wichtig ist, dass du den einmal gewählten Tag beibehältst.",
  },
];

const Zakatrechner = () => (
  <div className="min-h-screen bg-background">
    <Seo
      title="Zakat-Rechner 2026 – Zakat auf Depot, Aktien & Gold berechnen | finanzmuslim"
      description="Berechne deine Zakat kostenlos: Bargeld, Aktien, ETFs, Sukuk, Gold und Krypto. Mit Nisab nach Gold oder Silber und zwei Berechnungsmethoden für Aktien."
      path="/zakat-rechner"
      jsonLd={[
        calculatorJsonLd({
          name: "Zakat-Rechner",
          description:
            "Kostenloser Zakat-Rechner für Vermögen inklusive Wertpapierdepot, mit Nisab nach Gold oder Silber.",
          path: "/zakat-rechner",
        }),
        faqJsonLd(zakatFaq),
      ]}
    />
    <SiteHeader active="/tools" />
    <main>
      <div className="container pt-3 pb-0">
        <Link
          to="/tools"
          className="inline-flex items-center gap-2 text-[13px] font-semibold text-primary hover:text-primary/80 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden /> Alle Tools
        </Link>
      </div>

      <section className="container max-w-3xl pt-8 md:pt-10">
        <span className="inline-flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.25em] text-gold-deep">
          <span className="h-px w-6 bg-gold" aria-hidden /> Zakat-Rechner
        </span>
        <h1 className="headline text-4xl md:text-[52px] leading-[1.05] mt-4">
          Was schuldest du dieses Jahr?
        </h1>
        <p className="mt-4 text-muted-foreground leading-relaxed text-base md:text-[17px]">
          Zakat auf Bargeld ist einfach. Sobald ein Depot dazukommt, wird es unübersichtlich.
          Dieser Rechner nimmt Aktien, ETFs, Sukuk, Gold und Krypto mit auf und zeigt dir,
          worauf du wirklich zahlst.
        </p>
      </section>

      <ZakatCalculator />

      <section className="container max-w-3xl pb-16 md:pb-24">
        <div className="mt-12 md:mt-16">
          <h2 className="headline text-2xl md:text-3xl">Wie Zakat auf ein Depot berechnet wird</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Zakat ist die dritte Säule des Islam und beträgt 2,5 Prozent auf das
            zakatpflichtige Vermögen, sofern es ein volles Mondjahr über dem Nisab lag.
            Für Bargeld, Gold und Silber ist die Rechnung unstrittig. Sobald Wertpapiere
            dazukommen, wird es differenzierter.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Der entscheidende Unterschied liegt in deiner Absicht. Wer Anteile kauft, um
            sie weiterzuverkaufen, behandelt sie wie Handelsware: 2,5 Prozent auf den
            vollen Marktwert. Wer langfristig investiert bleibt und von den Erträgen des
            Unternehmens profitieren will, setzt nach anderer verbreiteter Auffassung nur
            den Teil an, der auf zakatpflichtige Vermögenswerte des Unternehmens entfällt,
            also im Wesentlichen Barmittel, Forderungen und Warenbestände. Genau deshalb
            hat dieser Rechner beide Wege.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Der hier verwendete Näherungswert von 30 Prozent ist eine Schätzung, keine
            exakte Größe. Wer es genauer will, sieht in die Bilanz der gehaltenen
            Unternehmen. Für ein breit gestreutes ETF-Portfolio ist das praktisch nicht
            leistbar, deshalb arbeiten die meisten mit einem pauschalen Anteil.
          </p>
        </div>

        <div className="mt-12 md:mt-16">
          <h2 className="headline text-2xl md:text-3xl">Häufige Fragen zur Zakat</h2>
          <div className="mt-6 divide-y divide-border/70 border-y border-border/70">
            {zakatFaq.map((item) => (
              <div key={item.q} className="py-5">
                <h3 className="font-semibold text-foreground">{item.q}</h3>
                <p className="mt-2 text-muted-foreground leading-relaxed text-[15px]">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 md:mt-16 rounded-2xl bg-surface border border-border/70 p-6 md:p-8">
          <h2 className="headline text-xl md:text-2xl">Wie geht es weiter?</h2>
          <ul className="mt-4 space-y-3 text-[15px]">
            <li>
              <Link to="/renditerechner" className="text-primary font-semibold hover:underline">
                Renditerechner
              </Link>
              <span className="text-muted-foreground">
                {" "}– wie dein Vermögen mit islamkonformen Anlagen wächst.
              </span>
            </li>
            <li>
              <Link to="/halal-guide" className="text-primary font-semibold hover:underline">
                Halal Investment Guide
              </Link>
              <span className="text-muted-foreground">
                {" "}– welche Anlagen islamkonform sind und woran du das erkennst.
              </span>
            </li>
            <li>
              <Link to="/dein-investmentstart" className="text-primary font-semibold hover:underline">
                Dein Investmentstart
              </Link>
              <span className="text-muted-foreground"> – Depot eröffnen, Schritt für Schritt.</span>
            </li>
          </ul>
        </div>

        <p className="mt-10 text-[13px] text-muted-foreground leading-relaxed">
          Dieser Rechner dient der Orientierung und ist keine Fatwa und keine
          Rechtsauskunft. Zur Behandlung langfristig gehaltener Wertpapiere bestehen
          unterschiedliche Gelehrtenmeinungen. Im Zweifel wende dich an eine Gelehrte
          oder einen Gelehrten deines Vertrauens.
        </p>
      </section>
    </main>
    <SiteFooter />
  </div>
);

export default Zakatrechner;
