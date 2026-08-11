import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ReturnCalculator from "@/components/ReturnCalculator";
import Seo, { calculatorJsonLd, faqJsonLd } from "@/components/Seo";

/**
 * /renditerechner — eigene Seite fuer den bestehenden Rechner.
 * Die Rechnerfunktion (ReturnCalculator) ist unveraendert uebernommen.
 */

const rechnerFaq = [
  {
    q: "Ist der Renditerechner für halal Investments gedacht?",
    a: "Ja. Der Rechner arbeitet mit Anlageklassen, die in einem islamkonformen Depot vorkommen: Aktien und Aktien-ETFs nach Shariah-Screening, Sukuk, Gold und Silber. Zinsprodukte sind bewusst nicht enthalten.",
  },
  {
    q: "Rechnet der Rechner mit Zinsen?",
    a: "Nein. Es geht um Wertentwicklung von Beteiligungen und Sachwerten, nicht um verzinste Guthaben. Riba ist im islamischen Recht untersagt, deshalb bildet der Rechner bewusst keine Zinsprodukte ab.",
  },
  {
    q: "Sind die Ergebnisse eine Prognose?",
    a: "Nein. Der Rechner zeigt eine Modellrechnung auf Basis der Werte, die du selbst einträgst. Er ist keine Vorhersage und keine Anlageberatung. Kapitalanlagen bergen Risiken.",
  },
  {
    q: "Was ist ein Sukuk?",
    a: "Sukuk sind islamkonforme Wertpapiere. Anders als eine Anleihe verbriefen sie keinen verzinsten Kredit, sondern einen Anteil an einem realen Vermögenswert und dessen Erträgen.",
  },
];

const Renditerechner = () => (
  <div className="min-h-screen bg-background">
    <Seo
      title="Halal Renditerechner – Vermögensaufbau ohne Zinsen berechnen | finanzmuslim"
      description="Berechne kostenlos, wie dein Vermögen mit islamkonformen Anlagen wächst: Aktien, Sukuk, Gold und Silber. Ohne Zinsen, ohne Anmeldung."
      path="/renditerechner"
      jsonLd={[
        calculatorJsonLd({
          name: "Halal Renditerechner",
          description:
            "Kostenloser Rechner für islamkonformen Vermögensaufbau mit Aktien, Sukuk, Gold und Silber.",
          path: "/renditerechner",
        }),
        faqJsonLd(rechnerFaq),
      ]}
    />
    <main>
      <div className="container pt-2 md:pt-2 pb-0">
        <Link
          to="/tools"
          className="inline-flex items-center gap-2 text-[13px] font-semibold text-primary hover:text-primary/80 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden /> Alle Tools
        </Link>
      </div>
      <ReturnCalculator />

      {/* Erklaertext + FAQ: macht die Seite fuer Google ueberhaupt erst
          bewertbar (vorher stand hier ausser dem Rechner kein Text) und
          liefert die Grundlage fuer das FAQPage-Schema oben. */}
      <section className="container max-w-3xl pb-16 md:pb-24">
        <div className="mt-14 md:mt-20">
          <h2 className="headline text-2xl md:text-3xl">So nutzt du den Rechner</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Trage ein, was du heute schon hast, und was du monatlich zurücklegen
            kannst. Danach wählst du die Mischung: Aktien und Aktien-ETFs nach
            Shariah-Screening, Sukuk, Gold und Silber. Der Rechner zeigt dir,
            wie sich dein Kapital über die Jahre entwickelt, wenn die von dir
            gewählte Rendite eintritt.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Zinsprodukte fehlen bewusst. Tagesgeld, Festgeld und klassische
            Anleihen zahlen Riba, und Riba ist im islamischen Recht untersagt.
            Deshalb rechnet dieses Werkzeug ausschließlich mit Beteiligungen und
            Sachwerten. Das Ergebnis ist eine Modellrechnung, keine Prognose und
            keine Anlageberatung.
          </p>
        </div>

        <div className="mt-12 md:mt-16">
          <h2 className="headline text-2xl md:text-3xl">Häufige Fragen</h2>
          <div className="mt-6 divide-y divide-border/70 border-y border-border/70">
            {rechnerFaq.map((item) => (
              <div key={item.q} className="py-5">
                <h3 className="font-semibold text-foreground">{item.q}</h3>
                <p className="mt-2 text-muted-foreground leading-relaxed text-[15px]">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Interne Verlinkung: Finanzfluss verteilt Autoritaet ueber Hub-,
            Cluster- und Toolseiten. Bisher fuehrte von hier kein Weg weiter. */}
        <div className="mt-12 md:mt-16 rounded-2xl bg-surface border border-border/70 p-6 md:p-8">
          <h2 className="headline text-xl md:text-2xl">Wie geht es weiter?</h2>
          <ul className="mt-4 space-y-3 text-[15px]">
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
              <span className="text-muted-foreground">
                {" "}– die Anleitung, wie du ein Depot eröffnest, Schritt für Schritt.
              </span>
            </li>
            <li>
              <Link to="/tools" className="text-primary font-semibold hover:underline">
                Alle Tools
              </Link>
              <span className="text-muted-foreground"> – weitere Rechner und Werkzeuge.</span>
            </li>
          </ul>
        </div>
      </section>
    </main>
  </div>
);

export default Renditerechner;
