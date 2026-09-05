import KreditkostenRechner from "@/components/KreditkostenRechner";
import RechnerSeite from "@/components/RechnerSeite";
import Seo, { calculatorJsonLd, faqJsonLd } from "@/components/Seo";
import { Link } from "react-router-dom";
import { bauzins } from "@/data/rechnerQuellen";

/**
 * /kreditkostenrechner
 *
 * Kein Kreditrechner, der die Rate ausrechnet, damit man unterschreibt. Einer,
 * der zeigt, was der Zins über die Laufzeit kostet, und was dieselbe Rate
 * gespart statt gezahlt bringt.
 */

const faq = [
  {
    q: "Wie rechnet der Kreditkostenrechner?",
    a: "Mit der Annuitätenformel, die jede Bank benutzt: Die Rate bleibt über die Laufzeit gleich, anfangs besteht sie fast nur aus Zins, am Ende fast nur aus Tilgung. Gesamtkosten sind Rate mal Anzahl der Monate, die Zinsen sind Gesamtkosten minus Kreditsumme.",
  },
  {
    q: "Woher kommt der voreingestellte Zins?",
    a: `Von der Deutschen Bundesbank. Sie veröffentlicht jeden Monat den durchschnittlichen Effektivzins für neue Wohnungsbaukredite an private Haushalte. Im ${bauzins.monat} lag er bei ${bauzins.prozent.toLocaleString("de-DE")} Prozent. Auto- und Ratenkredite kosten meist mehr, deshalb trägst du am besten den Zins aus deinem Angebot ein.`,
  },
  {
    q: "Warum ist der Zins rot?",
    a: "Weil er der Teil ist, der Riba ist. Die Kreditsumme bekommst du und gibst sie zurück, das ist ein Tausch. Der Zins ist der Aufschlag dafür, dass du Geld geliehen hast, und genau das ist im Islam verboten. Farbe ist hier eine Bewertung, keine Dekoration.",
  },
  {
    q: "Was bedeutet „das Haus kostet 1,66-mal“?",
    a: "Dass du am Ende 1,66-mal so viel überwiesen hast, wie das Haus gekostet hat. Bei 300.000 Euro und 30 Jahren Laufzeit sind das rund 500.000 Euro. Der Unterschied ist der Zins, und er fällt an, ohne dass das Haus dadurch mehr wert wird.",
  },
  {
    q: "Wie soll ich ein Haus ansparen, wenn die Miete weiterläuft?",
    a: "Für ein Haus geht das oft nicht, und der Rechner behauptet es auch nicht. Er zeigt, was der Zins kostet, damit du weißt, worüber du entscheidest. Für den Kauf ohne Zins gibt es Wege wie Murabaha, Musharaka und Ijara, die im Beitrag Haus kaufen ohne Zinsen stehen. Für ein Auto oder Möbel ist Ansparen dagegen meist realistisch.",
  },
  {
    q: "Ist ein Kredit mit 0 Prozent Zinsen erlaubt?",
    a: "Ein echtes zinsloses Darlehen ist erlaubt, das ist Qard Hasan. Bei Händler-Finanzierungen mit 0 Prozent steckt der Aufschlag oft im Preis, und im Vertrag können Verzugszinsen stehen. Gelehrte bewerten das unterschiedlich. Der Rechner zeigt bei 0 Prozent einfach null Zinsen, den Vertrag musst du selbst prüfen.",
  },
  {
    q: "Ist das eine Beratung?",
    a: "Nein. Der Rechner rechnet mit deinen Angaben und einer Standardformel. Sondertilgungen, Gebühren und Zinsbindungen bildet er nicht ab. Wer einen Kredit hat oder erwägt, spricht mit einem Berater und, wenn es um die Frage halal geht, mit einem Gelehrten.",
  },
];

const Kreditkostenrechner = () => (
  <>
    <Seo
      title="Kreditkostenrechner: was dich der Zins wirklich kostet | finanzmuslim"
      description="Sieh, wie viel Zinsen ein Kredit über die Laufzeit kostet und was dieselbe Rate gespart statt gezahlt bringt. Kreditsumme, Zins und Laufzeit eingeben, Ergebnis sofort als Bild."
      path="/kreditkostenrechner"
      brotkrumen={[{ name: "Rechner", path: "/rechner" }, { name: "Kreditkostenrechner", path: "/kreditkostenrechner" }]}
      jsonLd={[
        calculatorJsonLd({
          name: "Kreditkostenrechner",
          description: "Kostenloser Rechner für die Zinskosten eines Kredits über die gesamte Laufzeit, mit Vergleich zum Sparen.",
          path: "/kreditkostenrechner",
        }),
        faqJsonLd(faq),
      ]}
    />
    <RechnerSeite
      name="Kreditkostenrechner"
      title="Kreditkostenrechner"
      intro={
        <p>
          Sieh, was ein Kredit über die Jahre wirklich kostet. Die Bank zeigt dir die Rate, wir
          zeigen dir die Summe.
        </p>
      }
      unterRechner={
        <div className="rounded-2xl bg-accent p-5 md:p-6">
          <h2 className="text-[19px] font-bold text-foreground">So wird gerechnet</h2>
          <p className="mt-3 rounded-xl bg-card px-4 py-3 text-[16px] font-semibold leading-[26px] text-foreground md:text-[18px]">
            Rate = Kredit × Monatszins ÷ (1 − (1 + Monatszins)<sup>−Monate</sup>)
          </p>
          <p className="mt-3 text-[15px] leading-[24px] text-muted-foreground">
            Bei 300.000 € zu {bauzins.prozent.toLocaleString("de-DE")} Prozent über 30 Jahre: rund 1.422 € im
            Monat, 360 Mal. Zusammen rund 512.000 €, davon rund 212.000 € Zinsen. Jeden Monat wird
            der Zins auf die Restschuld berechnet, deshalb zahlst du anfangs fast nur Zins und tilgst
            kaum.
          </p>
        </div>
      }
      erklaerung={
        <>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Was ein Kredit wirklich kostet</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Eine Bank nennt dir die Monatsrate, weil die klein aussieht. Was sie nicht groß
              schreibt: wie oft du sie zahlst und was davon Zins ist. Bei einem Hauskredit über
              dreißig Jahre ist der Zins schnell so groß wie ein zweites, kleineres Haus. Beim Auto
              über sechs Jahre sind es ein paar tausend Euro, die niemand sieht, weil sie in 72
              Raten versteckt sind. Der Rechner holt die Summe nach vorn.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground">Warum der Zins rot ist</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Riba heißt, dass du für geliehenes Geld mehr zurückgibst, als du bekommen hast. Genau
              das ist der rote Balken. Die Kreditsumme selbst ist kein Problem, sie ist ein Tausch:
              Geld heute gegen Geld später. Der Zins ist der Aufschlag auf diesen Tausch, und er
              ist im Koran ausdrücklich verboten. Wie das im Alltag aussieht und was ausdrücklich
              nicht darunter fällt, steht in{" "}
              <Link to="/wissen/zinsen-im-islam" className="text-primary hover:underline">
                Zinsen im Islam
              </Link>
              .
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground">Sparen statt leihen</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Der grüne Kasten dreht die Rechnung um. Die Rate, die du der Bank überweisen würdest,
              legst du stattdessen für dich zurück. Beim Auto bist du damit oft in vier Jahren am
              Ziel statt in sechs, und die Zinsen bleiben bei dir. Beim Haus dauert es länger, als
              die meisten warten können, und dafür gibt es andere Wege:{" "}
              <Link to="/wissen/haus-kaufen-ohne-zinsen" className="text-primary hover:underline">
                Haus kaufen ohne Zinsen
              </Link>{" "}
              und{" "}
              <Link to="/wissen/halal-kredit-ohne-zinsen" className="text-primary hover:underline">
                Kredit ohne Zinsen
              </Link>
              . Für alles, was kein Haus ist, ist der Rechner die Antwort:{" "}
              <Link to="/wissen/auto-kaufen-ohne-zinsen" className="text-primary hover:underline">
                Auto kaufen ohne Zinsen
              </Link>
              .
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground">Häufige Fragen zu Kreditkosten</h2>
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
      anlegenSatz="Was du nicht an Zinsen zahlst, kann für dich arbeiten. Ein Depot ohne Zinsgeschäft ist der Ort dafür."
      weitereRechner={[
        { name: "Sparzielrechner", desc: "wann du dein Ziel ohne Kredit erreichst.", to: "/sparzielrechner" },
        { name: "Renditerechner", desc: "was aus der gesparten Rate in einem Depot wird.", to: "/renditerechner" },
        { name: "Budgetrechner", desc: "wie viel im Monat wirklich frei ist.", to: "/budgetrechner" },
      ]}
    >
      <KreditkostenRechner />
    </RechnerSeite>
  </>
);

export default Kreditkostenrechner;
