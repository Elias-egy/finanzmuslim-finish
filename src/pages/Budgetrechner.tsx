import BudgetRechner from "@/components/BudgetRechner";
import RechnerSeite from "@/components/RechnerSeite";
import Seo, { calculatorJsonLd, faqJsonLd } from "@/components/Seo";
import { Link } from "react-router-dom";
import { sparquote } from "@/data/rechnerQuellen";

/**
 * /budgetrechner
 *
 * Vier Zahlen, ein Kreis. Der Rechner beantwortet die Frage, wie viel im
 * Monat wirklich frei ist, und vergleicht das mit der 50/30/20-Faustregel
 * und der deutschen Sparquote.
 */

const faq = [
  {
    q: "Was rechnet der Budgetrechner?",
    a: "Er zieht von deinem Netto das ab, was du für Wohnen, feste Kosten und den Alltag ausgibst. Was übrig bleibt, ist der freie Teil. Der Kreis zeigt, wie groß jeder Teil ist, die Balken darunter vergleichen deine Aufteilung mit der 50/30/20-Faustregel.",
  },
  {
    q: "Was ist die 50/30/20-Regel?",
    a: "Eine Faustregel aus dem Buch All Your Worth von Elizabeth Warren und Amelia Warren Tyagi aus dem Jahr 2005: die Hälfte des Nettos für das Nötige wie Miete, Versicherungen und Fahrtkosten, dreißig Prozent für Wünsche wie Essen gehen und Freizeit, zwanzig Prozent zum Sparen. Sie ist eine Orientierung, kein Gesetz.",
  },
  {
    q: "Was gehört zu den festen Kosten?",
    a: "Alles, was jeden Monat gleich abgeht, ohne dass du es entscheidest: Versicherungen, Handy, Internet, Abos, Auto oder Fahrkarte, Kita, Vereinsbeiträge. Miete und Nebenkosten stehen im Feld Wohnen, damit du siehst, wie viel allein das Dach über dem Kopf kostet.",
  },
  {
    q: "Wo trage ich Zakat und Sadaqa ein?",
    a: "Sadaqa und regelmäßige Unterstützung für die Familie kommen unter Mehr Angaben in das Feld Geben. Zakat gehört nicht in den Monat: Sie wird einmal im Jahr auf das Vermögen fällig, das ein Mondjahr lang über der Nisab-Grenze lag. Dafür gibt es den Zakat-Rechner.",
  },
  {
    q: "Wie viel sparen die Deutschen im Schnitt?",
    a: `Laut Statistischem Bundesamt sparten die privaten Haushalte im ${sparquote.zeitraum} ${sparquote.prozent.toLocaleString("de-DE")} Prozent ihres verfügbaren Einkommens, im Jahr davor waren es ${sparquote.vorjahr.toLocaleString("de-DE")} Prozent. Das ist ein Durchschnitt über alle Haushalte, hohe Einkommen ziehen ihn nach oben.`,
  },
  {
    q: "Was mache ich, wenn nichts übrig bleibt?",
    a: "Dann zeigt der Rechner die Lücke in Rot. Der erste Schritt ist nicht sparen, sondern die festen Kosten durchgehen: Abos, Versicherungen, Handyvertrag. Das sind die Beträge, die sich mit einem Anruf ändern lassen. Erst danach lohnt sich der Blick auf den Alltag.",
  },
  {
    q: "Ist das eine Beratung?",
    a: "Nein. Der Rechner ordnet deine Zahlen und zeigt, wie sie im Verhältnis stehen. Was du daraus machst, entscheidest du. Wer Schulden hat, findet in Dispo und Schulden die Reihenfolge, in der man sie loswird.",
  },
];

const Budgetrechner = () => (
  <>
    <Seo
      title="Budgetrechner: wie viel im Monat wirklich frei ist | finanzmuslim"
      description="Sieh auf einen Blick, wohin dein Netto geht und was übrig bleibt. Vier Zahlen eingeben, Ergebnis als Kreis, Vergleich mit der 50/30/20-Regel."
      path="/budgetrechner"
      brotkrumen={[{ name: "Rechner", path: "/rechner" }, { name: "Budgetrechner", path: "/budgetrechner" }]}
      jsonLd={[
        calculatorJsonLd({
          name: "Budgetrechner",
          description: "Kostenloser Rechner für die Aufteilung des monatlichen Nettos in Wohnen, feste Kosten, Alltag und freien Teil.",
          path: "/budgetrechner",
        }),
        faqJsonLd(faq),
      ]}
    />
    <RechnerSeite
      name="Budgetrechner"
      title="Budgetrechner"
      intro={
        <p>
          Sieh, wohin dein Geld jeden Monat geht und was übrig bleibt. Vier Zahlen reichen.
        </p>
      }
      unterRechner={
        <div className="rounded-2xl bg-accent p-5 md:p-6">
          <h2 className="text-[19px] font-bold text-foreground">So wird gerechnet</h2>
          <p className="mt-3 rounded-xl bg-card px-4 py-3 text-[16px] font-semibold leading-[26px] text-foreground md:text-[18px]">
            Frei = Netto − Wohnen − feste Kosten − Alltag
          </p>
          <p className="mt-3 text-[15px] leading-[24px] text-muted-foreground">
            Bei 3.000 € netto, 1.000 € Wohnen, 400 € festen Kosten und 800 € Alltag bleiben 800 €,
            also 27 Prozent. Die Faustregel sagt 20 Prozent zum Aufbauen, das wäre hier erfüllt. Der
            Kreis zeigt die Anteile, die Balken den Vergleich.
          </p>
        </div>
      }
      erklaerung={
        <>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Warum ein Kreis und keine Tabelle</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Die meisten wissen ungefähr, was sie verdienen, und ungefähr, was die Miete kostet.
              Was fehlt, ist das Bild dazwischen. Ein Kreis zeigt auf einen Blick, ob das Wohnen die
              Hälfte frisst oder ein Drittel, und ob der grüne Teil ein Stück ist oder ein Splitter.
              Genau dieses Bild entscheidet, ob am Monatsende etwas übrig bleibt, nicht die Zahl
              hinter dem Komma.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground">Der freie Teil hat einen Namen</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Was übrig bleibt, verschwindet, wenn es keinen Platz hat. Deshalb bekommt der grüne
              Teil am Tag nach dem Gehalt ein eigenes Ziel: ein Notgroschen, die Hajj, das Auto ohne
              Kredit, ein Depot. Der{" "}
              <Link to="/sparzielrechner" className="text-primary hover:underline">
                Sparzielrechner
              </Link>{" "}
              rechnet aus, wann du damit am Ziel bist. Was du zur Seite legst, bevor du ausgibst,
              gibst du nicht mehr aus.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground">Was die Faustregel nicht weiß</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              50/30/20 stammt aus den USA und rechnet mit amerikanischen Mieten. In München oder
              Frankfurt liegt das Wohnen allein oft über 40 Prozent, dann ist die Hälfte fürs Nötige
              nicht zu halten. Das ist kein Grund, die Regel wegzuwerfen, sondern sie zu lesen wie
              gemeint: Der letzte Teil, das Aufbauen, ist der, der nie auf null fallen sollte. Wenn
              es nur zehn Prozent sind, sind es zehn Prozent, und die Deutschen liegen im Schnitt
              genau da.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground">Häufige Fragen zum Budget</h2>
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
        { name: "Sparzielrechner", desc: "wann du mit dem freien Teil am Ziel bist.", to: "/sparzielrechner" },
        { name: "Renditerechner", desc: "was aus dem freien Teil in einem Depot wird.", to: "/renditerechner" },
        { name: "Zakat-Rechner", desc: "was einmal im Jahr auf dein Erspartes fällt.", to: "/zakat-rechner" },
      ]}
    >
      <BudgetRechner />
    </RechnerSeite>
  </>
);

export default Budgetrechner;
