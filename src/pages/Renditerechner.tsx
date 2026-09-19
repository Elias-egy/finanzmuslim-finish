import ReturnCalculator from "@/components/ReturnCalculator";
import RechnerSeite from "@/components/RechnerSeite";
import Seo, { calculatorJsonLd, faqJsonLd } from "@/components/Seo";

/**
 * /renditerechner — nutzt jetzt das einheitliche Rechner-Muster (RechnerSeite).
 * Die Rechenlogik in ReturnCalculator ist unveraendert.
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
  <>
    <Seo
      title="Halal Renditerechner – Vermögensaufbau ohne Zinsen berechnen | finanzmuslim"
      description="Berechne kostenlos, wie dein Vermögen mit Aktien, Sukuk, Gold und Silber über die Jahre wachsen kann. Ohne Zinsprodukte."
      path="/renditerechner"
      brotkrumen={[{ name: "Rechner", path: "/rechner" }, { name: "Renditerechner", path: "/renditerechner" }]}
      jsonLd={[
        calculatorJsonLd({
          name: "Renditerechner",
          description:
            "Kostenloser Rechner für islamkonformen Vermögensaufbau mit Aktien, Sukuk, Gold und Silber.",
          path: "/renditerechner",
        }),
        faqJsonLd(rechnerFaq),
      ]}
    />
    <RechnerSeite
      name="Renditerechner"
      title="Renditerechner"
      intro={
        <p>
          Trag ein, was du heute hast und was du monatlich zurücklegst. Sieh, wie dein Kapital über
          die Jahre wachsen kann, ohne Zinsprodukte.
        </p>
      }
      erklaerung={
        <>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Wie Vermögensaufbau über die Zeit funktioniert</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Vermögensaufbau lebt von zwei Dingen: von dem, was du regelmäßig zurücklegst, und von
              der Zeit, die dein Kapital arbeiten kann. Erträge, die du nicht entnimmst, bleiben
              investiert und erwirtschaften selbst wieder Erträge. Deshalb wirken kleine Beträge über
              lange Zeiträume deutlich stärker als große Beträge über kurze Zeiträume. Der Rechner
              macht diesen Effekt sichtbar.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground">Warum wir von Rendite sprechen, nicht von Zins</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Zins ist eine feste Vergütung dafür, dass Geld verliehen wird — unabhängig davon, ob
              damit etwas erwirtschaftet wird. Genau das ist Riba und im islamischen Recht untersagt.
              Rendite dagegen entsteht aus Beteiligung: du trägst unternehmerisches Risiko mit und
              nimmst am Ergebnis teil, im Guten wie im Schlechten. Dieser Rechner arbeitet deshalb
              ausschließlich mit Beteiligungen und Sachwerten, nicht mit verzinsten Guthaben.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground">Das Ergebnis ist eine Annahme, keine Zusage</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Der Rechner rechnet mit den Werten, die du selbst einträgst. Er ist damit eine
              Modellrechnung und keine Vorhersage. Kursverläufe schwanken, Rückgänge gehören dazu, und
              niemand kann eine bestimmte Entwicklung zusagen. Nutze das Ergebnis, um Größenordnungen
              einzuschätzen, nicht als Versprechen.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground">Häufige Fragen</h2>
            <div className="mt-5 divide-y divide-border border-y border-border">
              {rechnerFaq.map((item) => (
                <div key={item.q} className="py-5">
                  <h3 className="font-semibold text-foreground">{item.q}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      }
      anlegenSatz="Aus der Rechnung wird erst etwas, wenn das Geld angelegt ist. Diese Depots arbeiten ohne Zinsgeschäft."
      weitereRechner={[
        { name: "Zakat-Rechner", desc: "deine Zakat auf Vermögen und Depot berechnen.", to: "/zakat-rechner" },
        { name: "Alle Rechner", desc: "Übersicht aller Werkzeuge.", to: "/rechner" },
        {
          name: "Depot-Vergleich",
          desc: "welcher Broker zu islamkonformem Investieren passt.",
          to: "/vergleich/depot",
        },
      ]}
    >
      <ReturnCalculator />
    </RechnerSeite>
  </>
);

export default Renditerechner;
