import InflationsRechner from "@/components/InflationsRechner";
import RechnerSeite from "@/components/RechnerSeite";
import Seo, { calculatorJsonLd, faqJsonLd } from "@/components/Seo";
import { Link } from "react-router-dom";

const inflationFaq = [
  {
    q: "Warum wird mein Geld weniger wert?",
    a: "Weil die Preise steigen. Für dieselbe Summe bekommst du jedes Jahr etwas weniger. Die Zahl auf dem Konto ändert sich nicht, ihre Kaufkraft schon. Bei 2 Prozent Inflation verliert Geld in zehn Jahren rund ein Fünftel seines Werts.",
  },
  {
    q: "Hilft ein Sparkonto gegen die Inflation?",
    a: "Ein verzinstes Sparkonto scheidet ohnehin aus, weil Zinsen Riba sind. Und selbst dort lag der Zins in vielen Jahren unter der Inflation. Das Geld wurde also trotzdem weniger wert, nur langsamer.",
  },
  {
    q: "Was hilft dann wirklich?",
    a: "Sachwerte. Anteile an Firmen, Gold, Sukuk. Sie schwanken, aber sie sind an etwas Reales gebunden, das mit den Preisen mitwächst. Ein Depot ist dafür die Voraussetzung.",
  },
  {
    q: "Mit welcher Inflationsrate soll ich rechnen?",
    a: "Die Europäische Zentralbank strebt 2 Prozent im Jahr an. In einzelnen Jahren lag die Rate deutlich darüber. Wer vorsichtig plant, rechnet mit 2,5 bis 3 Prozent.",
  },
  {
    q: "Ist das eine Vorhersage?",
    a: "Nein. Der Rechner setzt die Rate ein, die du selbst wählst, und rechnet sie über die Jahre fort. Wie hoch die Inflation tatsächlich ausfällt, weiß niemand im Voraus.",
  },
];

const Inflationsrechner = () => (
  <>
    <Seo
      title="Inflationsrechner: was dein Geld in X Jahren noch wert ist | finanzmuslim"
      description="Sieh, wie viel Kaufkraft dein Geld auf dem Konto verliert. Betrag, Zeitraum und Inflationsrate einstellen, Ergebnis sofort als Zahl und Grafik."
      path="/inflationsrechner"
      brotkrumen={[{ name: "Rechner", path: "/rechner" }, { name: "Inflationsrechner", path: "/inflationsrechner" }]}
      jsonLd={[
        calculatorJsonLd({
          name: "Inflationsrechner",
          description:
            "Kostenloser Rechner für den Kaufkraftverlust von Geld auf dem Konto über die Jahre.",
          path: "/inflationsrechner",
        }),
        faqJsonLd(inflationFaq),
      ]}
    />
    <RechnerSeite
      name="Inflationsrechner"
      title="Inflationsrechner"
      intro={
        <p>
          Sieh, was dein Geld auf dem Konto in ein paar Jahren noch wert ist. Die Summe bleibt
          gleich, das ist ja das Tückische daran.
        </p>
      }
      unterRechner={
        <div className="rounded-2xl bg-accent p-5 md:p-6">
          <h2 className="text-[19px] font-bold text-foreground">So wird gerechnet</h2>
          <p className="mt-3 rounded-xl bg-card px-4 py-3 text-[16px] font-semibold leading-[26px] text-foreground md:text-[18px]">
            Betrag ÷ (1 + Inflation)<sup>Jahre</sup>
          </p>
          <p className="mt-3 text-[15px] leading-[24px] text-muted-foreground">
            Bei 10.000 € und 2,5 Prozent über zehn Jahre: 10.000 ÷ 1,025<sup>10</sup> = rund 7.812 €.
            Die Kaufkraft sinkt jedes Jahr um denselben Prozentsatz, nicht um denselben Betrag.
            Deshalb wird die Kurve flacher, je weiter sie nach rechts läuft.
          </p>
        </div>
      }
      erklaerung={
        <>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Was Inflation im Alltag bedeutet</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Inflation heißt, dass die Preise im Durchschnitt steigen. Der Einkauf, die Miete, die
              Handwerkerstunde. Dein Kontostand bleibt davon unberührt, deine Kaufkraft nicht. Wer
              Geld über Jahre unangetastet liegen lässt, verliert also etwas, ohne je einen Cent
              ausgegeben zu haben. Das ist der Preis fürs Nichtstun, und er fällt jedes Jahr an.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground">Warum Zinsen hier keine Lösung sind</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Der übliche Rat lautet, das Geld auf ein Tagesgeld- oder Festgeldkonto zu legen. Für
              Muslime scheidet dieser Weg aus, weil Zinsen Riba sind. Das ist aber nur die eine
              Hälfte. Die andere: Selbst wer Zinsen nimmt, hat das Problem meist nicht gelöst. In
              vielen Jahren lag der Zins auf Spareinlagen unter der Inflationsrate, das Geld wurde
              also weiterhin weniger wert, nur etwas langsamer.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground">Was gegen Kaufkraftverlust hilft</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Gegen steigende Preise hilft, was selbst an Preisen hängt. Anteile an Firmen steigen
              mit, weil Firmen ihre Preise anpassen. Gold ist über lange Zeiträume ein Wertspeicher.
              Sukuk werfen Erträge aus realen Vermögenswerten ab. Alle drei schwanken, und keines
              davon ist eine Garantie. Aber sie sind an etwas Reales gebunden, und das ist der
              Unterschied zu einer Zahl auf dem Konto.
            </p>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Welche Anlagen dafür in Frage kommen, steht in der{" "}
              <Link to="/halal-anlagen" className="text-primary hover:underline">
                Halal-Datenbank
              </Link>
              , jeweils mit Kosten und der Stelle, die sie geprüft hat.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground">Wie viel gehört trotzdem aufs Konto</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Nicht alles gehört angelegt. Eine Rücklage für unerwartete Ausgaben muss jederzeit
              verfügbar sein, üblich sind drei bis sechs Monatsausgaben. Dieses Geld verliert
              zwangsläufig an Kaufkraft, und das ist der Preis für die Sicherheit. Der Rechner zeigt
              vor allem, was mit dem passiert, was darüber hinaus liegen bleibt.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground">Häufige Fragen zur Inflation</h2>
            <div className="mt-5 divide-y divide-border border-y border-border">
              {inflationFaq.map((item) => (
                <div key={item.q} className="py-5">
                  <h3 className="font-semibold text-foreground">{item.q}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      }
      weitereRechner={[
        {
          name: "Renditerechner",
          desc: "wie dein Vermögen mit geprüften Anlagen wachsen kann.",
          to: "/renditerechner",
        },
        { name: "Zakat-Rechner", desc: "wie viel Zakat auf dein Vermögen fällt.", to: "/zakat-rechner" },
        {
          name: "Depot-Vergleich",
          desc: "welcher Broker zu islamkonformem Investieren passt.",
          to: "/vergleich/depot",
        },
      ]}
    >
      <InflationsRechner />
    </RechnerSeite>
  </>
);

export default Inflationsrechner;
