import AuswanderungsRechner from "@/components/AuswanderungsRechner";
import RechnerSeite from "@/components/RechnerSeite";
import Seo, { calculatorJsonLd, faqJsonLd } from "@/components/Seo";
import { Link } from "react-router-dom";
import { alleQuellen } from "@/data/auswandern";

/**
 * /auswanderungsrechner
 *
 * Drei Länder, vier Angaben, ein Bild. Der Rechner selbst steht in
 * components/AuswanderungsRechner, die Daten mit Quellen in data/auswandern.
 */

const faq = [
  {
    q: "Wie rechnet der Auswanderungsrechner die Kaufkraft?",
    a: "Er teilt dein Netto durch das Preisniveau des Ziellands im Verhältnis zu Deutschland. Das Preisniveau kommt aus zwei Weltbank-Reihen von 2024: dem Kaufkraftparitäts-Faktor für den privaten Konsum und dem Wechselkurs. Ein Land mit Preisniveau 50 Prozent macht aus 3.000 Euro ein Lebensgefühl von 6.000 Euro.",
  },
  {
    q: "Warum ist Dubai teurer, als der Rechner sagt?",
    a: "Weil das Preisniveau ein Landesdurchschnitt ist. Dubai und Istanbul liegen über dem Schnitt ihres Landes, vor allem bei Mieten. Wer in die Großstadt zieht, rechnet mit weniger Ersparnis. Wir nennen bewusst keine Stadtzahlen, weil es dafür keine amtliche Quelle gibt.",
  },
  {
    q: "Was ist die Wegzugsbesteuerung?",
    a: "Wer mindestens 1 Prozent an einer Kapitalgesellschaft hält und Deutschland verlässt, wird so besteuert, als hätte er die Anteile verkauft, ohne dass Geld fließt. Seit der Neuregelung gilt das auch für Fonds- und ETF-Anteile ab 500.000 Euro Anschaffungskosten. Die Steuer kann in sieben zinslosen Jahresraten gezahlt werden und entfällt bei Rückkehr innerhalb von sieben Jahren.",
  },
  {
    q: "Was bedeutet die zehnjährige Nachwirkung?",
    a: "Deutsche Staatsangehörige, die in ein Gebiet mit niedriger Besteuerung ziehen und wesentliche wirtschaftliche Interessen in Deutschland behalten, bleiben nach § 2 AStG zehn Jahre lang erweitert beschränkt steuerpflichtig. Die VAE und Saudi-Arabien erheben auf Gehälter keine Einkommensteuer und fallen darunter, die Türkei mit ihrem progressiven Tarif nicht.",
  },
  {
    q: "Kann ich mein Depot mitnehmen?",
    a: "Bei den großen deutschen Neobrokern nicht. Scalable Capital beendet die Geschäftsbeziehung bei Umzug außerhalb der EU, Trade Republic setzt einen Wohnsitz in den Ländern voraus, in denen es tätig ist. Vor dem Umzug wird das Depot übertragen oder verkauft, und ein Verkauf ist ein steuerpflichtiger Vorgang.",
  },
  {
    q: "Bekomme ich meine deutsche Rente im Ausland?",
    a: "Grundsätzlich ja, die Rentenversicherung zahlt auch ins Ausland. Bestimmte Versicherungszeiten werden aber nur in EU-Staaten gezahlt, und eine Erwerbsminderungsrente wegen des verschlossenen Arbeitsmarkts kann entfallen. Mit der Türkei besteht ein Sozialversicherungsabkommen, mit den VAE und Saudi-Arabien nicht. Der Umzug soll zwei Monate vorher gemeldet werden.",
  },
  {
    q: "Ist das eine Steuerberatung?",
    a: "Nein. Der Rechner ordnet ein und nennt die Paragraphen, damit du weißt, wonach du fragst. Wer wirklich geht, spricht vorher mit einem Steuerberater, der beide Länder kennt. Jede Zahl auf der Seite hat eine Quelle mit Stand, die Liste steht unter dem Rechner.",
  },
];

const Auswanderungsrechner = () => (
  <>
    <Seo
      title="Auswanderungsrechner: Türkei, Dubai, Saudi-Arabien | finanzmuslim"
      description="Sieh, wie weit dein Netto in der Türkei, in Dubai oder in Saudi-Arabien reicht. Mit Wegzugssteuer, Abkommen und den Fakten je Land, jede Zahl mit Quelle."
      path="/auswanderungsrechner"
      brotkrumen={[{ name: "Rechner", path: "/rechner" }, { name: "Auswanderungsrechner", path: "/auswanderungsrechner" }]}
      jsonLd={[
        calculatorJsonLd({
          name: "Auswanderungsrechner",
          description:
            "Kostenloser Rechner für die Kaufkraft deines Nettos in der Türkei, den VAE und Saudi-Arabien, mit Wegzugsbesteuerung und Länderfakten.",
          path: "/auswanderungsrechner",
        }),
        faqJsonLd(faq),
      ]}
    />
    <RechnerSeite
      name="Auswanderungsrechner"
      title="Auswanderungsrechner"
      intro={
        <p>
          Sieh, wie weit dein Geld in der Türkei, in Dubai oder in Saudi-Arabien reicht, und was
          Deutschland beim Wegzug noch von dir will.
        </p>
      }
      unterRechner={
        <>
          <div className="rounded-2xl bg-accent p-5 md:p-6">
            <h2 className="text-[19px] font-bold text-foreground">So wird gerechnet</h2>
            <p className="mt-3 rounded-xl bg-card px-4 py-3 text-[16px] font-semibold leading-[26px] text-foreground md:text-[18px]">
              Netto ÷ (Preisniveau Zielland ÷ Preisniveau Deutschland)
            </p>
            <p className="mt-3 text-[15px] leading-[24px] text-muted-foreground">
              Das Preisniveau eines Landes ist sein Kaufkraftparitäts-Faktor für den privaten Konsum
              geteilt durch den Wechselkurs, beides Weltbank, Datenjahr 2024. Für die Türkei ergibt das
              rund 50 Prozent von Deutschland: 3.000 Euro dort fühlen sich an wie rund 5.950 Euro hier.
              Es ist ein Landesdurchschnitt, keine Stadtzahl.
            </p>
          </div>
          <div className="rounded-2xl border border-border/70 bg-card p-5 md:p-6">
            <h2 className="text-[19px] font-bold text-foreground">Quellen</h2>
            <p className="mt-1 text-[13px] text-muted-foreground">
              Jede Zahl auf dieser Seite kommt aus einer dieser Quellen. Steuerregeln aus dem
              Gesetzestext, Länderfakten von Behörden, Preise von der Weltbank.
            </p>
            <ul className="mt-3 space-y-1.5 text-[13px] leading-relaxed">
              {alleQuellen.map((q) => (
                <li key={q.url}>
                  <a
                    href={q.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline decoration-primary/30 underline-offset-[3px] hover:decoration-primary"
                  >
                    {q.name}
                  </a>
                  <span className="text-muted-foreground"> · {q.stand}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      }
      erklaerung={
        <>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Was der Rechner zeigt und was nicht</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Der Rechner beantwortet eine Frage sauber: Wie viel ist dein heutiges Netto im Zielland
              wert, gemessen an den Preisen dort. Dafür nimmt er die Kaufkraftparität der Weltbank,
              die einzige Quelle, die alle Länder gleich misst und ein Datum trägt. Was er nicht
              kann: die Miete in einem bestimmten Stadtteil, das Schulgeld einer bestimmten Schule,
              den Lohn in einem bestimmten Beruf. Diese Zahlen gibt es nur aus Foren und
              Nutzerdatenbanken, und die veröffentlichen wir nicht.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground">Der Teil, den fast niemand kennt</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Über Preise und Visa reden alle. Über das, was Deutschland beim Wegzug noch will, redet
              kaum jemand, und das ist der teurere Teil. Die Wegzugsbesteuerung galt lange als Thema
              für Firmeninhaber. Seit sie auch Fonds- und ETF-Anteile ab 500.000 Euro
              Anschaffungskosten erfasst, trifft sie Leute, die einfach lange und viel gespart haben.
              Dazu die zehnjährige Nachwirkung für deutsche Staatsangehörige in Niedrigsteuerländern
              und die Tatsache, dass die großen Neobroker das Depot nicht mitziehen lassen. Wer das
              vorher weiß, plant anders.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground">Warum drei Länder</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Die Türkei, die VAE und Saudi-Arabien sind die drei Ziele, nach denen unsere Leser am
              häufigsten fragen. Sie könnten verschiedener kaum sein: Die Türkei hat ein Abkommen mit
              Deutschland, einen progressiven Steuertarif und eine Währung, die Erspartes frisst. Die
              VAE haben keine Steuer auf Gehälter, aber auch kein Abkommen mehr und einen Aufenthalt,
              der am Arbeitgeber hängt. Saudi-Arabien hat eigene Aufenthaltstitel für Investoren und
              Fachkräfte, keine Lohnsteuer und nur ein Abkommen für Fluggesellschaften. Weitere Länder
              kommen dazu, sobald die Quellen dafür stehen.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground">Was das mit halal zu tun hat</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Wer auswandert, löst oft sein Depot auf und baut es neu auf. Das ist der Moment, in dem
              man es richtig aufsetzt: geprüfte Anlagen, ein Konto ohne Zinsen, ein Stichtag für die
              Zakat. Welche Anlagen dafür in Frage kommen, steht in der{" "}
              <Link to="/halal-anlagen" className="text-primary hover:underline">
                Halal-Datenbank
              </Link>
              , und wie die Zakat auf ein Depot gerechnet wird, in{" "}
              <Link to="/wissen/zakat-auf-aktien-etf-krypto" className="text-primary hover:underline">
                Zakat auf Aktien, ETFs und Krypto
              </Link>
              .
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground">Häufige Fragen zum Auswandern</h2>
            <div className="mt-5 divide-y divide-border border-y border-border">
              {faq.map((item) => (
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
        { name: "Inflationsrechner", desc: "was dein Geld auf dem Konto in ein paar Jahren noch wert ist.", to: "/inflationsrechner" },
        { name: "Zakat-Rechner", desc: "wie viel Zakat auf dein Vermögen fällt, egal wo du wohnst.", to: "/zakat-rechner" },
        { name: "Renditerechner", desc: "wie dein Vermögen mit geprüften Anlagen wachsen kann.", to: "/renditerechner" },
      ]}
    >
      <AuswanderungsRechner />
    </RechnerSeite>
  </>
);

export default Auswanderungsrechner;
