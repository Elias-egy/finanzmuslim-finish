import ZakatCalculator from "@/components/ZakatCalculator";
import RechnerSeite from "@/components/RechnerSeite";
import Seo, { calculatorJsonLd, faqJsonLd } from "@/components/Seo";

/**
 * /zakat-rechner — nutzt jetzt das einheitliche Rechner-Muster (RechnerSeite).
 * Die Rechenlogik in ZakatCalculator ist unveraendert.
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
  <>
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
    <RechnerSeite
      name="Zakat-Rechner"
      title="Zakat-Rechner"
      intro={
        <>
          <p>
            Zakat auf Bargeld ist einfach. Sobald ein Depot dazukommt, wird es unübersichtlich.
            Dieser Rechner nimmt Aktien, ETFs, Sukuk, Gold und Krypto mit auf und zeigt dir,
            worauf du wirklich zahlst.
          </p>
        </>
      }
      erklaerung={
        <>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Was Zakat ist</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Zakat ist eine der Säulen des Islam und ein fester Anteil, den du einmal im Jahr von
              deinem Vermögen abgibst. Sie ist kein freiwilliges Almosen, sondern eine Pflicht, und
              sie geht an klar bestimmte Empfängergruppen. Anders als eine Spende richtet sie sich
              nicht nach deinem Einkommen, sondern nach dem Vermögen, das über ein volles Mondjahr
              bei dir liegt.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground">Wer sie zahlen muss</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Zakatpflichtig ist, wer volljährig und zurechnungsfähig ist und dessen Vermögen den
              Nisab überschreitet und ein volles Mondjahr über dieser Schwelle geblieben ist. Wer
              darunter liegt, zahlt keine Zakat. Verbindlichkeiten, die kurzfristig fällig werden,
              werden nach verbreiteter Auffassung vorher abgezogen.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground">Was zum zakatpflichtigen Vermögen zählt</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Dazu gehören Bargeld und Guthaben, Gold und Silber, Handelsware sowie Wertpapiere wie
              Aktien, ETF-Anteile und Sukuk. Nicht dazu zählen üblicherweise Dinge, die du selbst
              nutzt: die eigene Wohnung, das eigene Auto, Möbel oder Arbeitsgeräte. Bei langfristig
              gehaltenen Wertpapieren bestehen unterschiedliche Auffassungen zur Bemessungsgrundlage,
              deshalb bietet der Rechner zwei Methoden an.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground">Was der Nisab ist</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Der Nisab ist die Mindestschwelle, ab der Zakat fällig wird. Er wird über eine feste
              Menge Gold oder Silber bestimmt. Der Betrag in Euro ist deshalb keine feste Größe: er
              richtet sich nach dem aktuellen Gold- oder Silberpreis und muss tagesaktuell geprüft
              werden. Welcher der beiden Maßstäbe herangezogen wird, wird unterschiedlich gehandhabt;
              der Silber-Maßstab liegt niedriger und erfasst dadurch mehr Menschen.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground">Häufige Fragen zur Zakat</h2>
            <div className="mt-5 divide-y divide-border border-y border-border">
              {zakatFaq.map((item) => (
                <div key={item.q} className="py-5">
                  <h3 className="font-semibold text-foreground">{item.q}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      }
      anlegenSatz="Wer jedes Jahr Zakat zahlt, sollte wissen, wo sein Geld liegt. Diese Depots rechnen ohne Zinsgeschäft."
      weitereRechner={[
        {
          name: "Renditerechner",
          desc: "wie dein Vermögen mit islamkonformen Anlagen wachsen kann.",
          to: "/renditerechner",
        },
        { name: "Alle Rechner", desc: "Übersicht aller Werkzeuge.", to: "/rechner" },
        {
          name: "Depot-Vergleich",
          desc: "welcher Broker zu islamkonformem Investieren passt.",
          to: "/vergleich/depot",
        },
      ]}
    >
      <ZakatCalculator />
    </RechnerSeite>
  </>
);

export default Zakatrechner;
