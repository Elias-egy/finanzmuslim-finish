import SparzielRechner from "@/components/SparzielRechner";
import RechnerSeite from "@/components/RechnerSeite";
import Seo, { calculatorJsonLd, faqJsonLd } from "@/components/Seo";
import { Link } from "react-router-dom";

/**
 * /sparzielrechner
 *
 * Ein Ziel, ein Betrag im Monat, ein Datum. Hajj, Umrah, Hochzeit, Auto ohne
 * Kredit, Eigenkapital, Notgroschen. Die Beispielbeträge sind Platzhalter.
 */

const faq = [
  {
    q: "Wie rechnet der Sparzielrechner?",
    a: "Er zählt Monat für Monat, was du zur Seite legst, zu dem, was schon da ist, und hört auf, wenn das Ziel erreicht ist. Bei 0 Prozent Rendite ist das reine Addition. Mit Rendite wächst der Stand jeden Monat um den Zwölftel-Anteil des Jahreswerts, das Ergebnis ist ein Monat und ein Datum.",
  },
  {
    q: "Woher kommen die Beträge bei Hajj, Hochzeit und Auto?",
    a: "Das sind Beispielwerte zum Überschreiben, keine Preisangaben. Was die Hajj kostet, hängt von Reiseanbieter, Jahr und Unterkunft ab, und das gilt für jedes andere Ziel genauso. Trag ein, was dein Ziel nach deiner Recherche wirklich kostet.",
  },
  {
    q: "Wie groß sollte der Notgroschen sein?",
    a: "Eine verbreitete Faustregel sind drei bis sechs Monatsausgaben, damit ein Jobverlust oder eine kaputte Waschmaschine nicht sofort zum Dispo führt. Wer den Budgetrechner benutzt hat, kennt seine Monatsausgaben und kann die Zahl direkt einsetzen.",
  },
  {
    q: "Soll ich mit 0 Prozent oder mit Rendite rechnen?",
    a: "Für alles, was in unter drei Jahren fällig ist, mit 0 Prozent. Das Geld liegt dann auf einem Konto ohne Zins und schwankt nicht. Für Ziele, die weiter weg sind, kann ein Depot mit geprüften Anlagen mehr bringen, mit dem Risiko, dass es im falschen Moment im Minus steht. Der Regler zeigt beides.",
  },
  {
    q: "Fällt auf das Ersparte Zakat an?",
    a: "Ja, wenn es ein Mondjahr lang über der Nisab-Grenze liegt, unabhängig davon, wofür du sparst. Auch das Geld für die Hajj ist zakatpflichtig, solange du es besitzt. Wie viel das ist, rechnet der Zakat-Rechner.",
  },
  {
    q: "Was, wenn ich das Ziel schneller erreichen will?",
    a: "Der Kasten Wenn es schneller gehen soll zeigt, was du monatlich bräuchtest, um in einem, zwei oder drei Jahren dort zu sein. Meistens ist der Unterschied kleiner, als man denkt, weil ein paar Monate mehr Laufzeit viel Rate sparen.",
  },
  {
    q: "Ist das eine Beratung?",
    a: "Nein. Der Rechner rechnet mit deinen Zahlen und einer festen Rendite, die du selbst einstellst. Wie sich ein Depot wirklich entwickelt, weiß niemand vorher. Für die Frage, welche Anlagen halal sind, gibt es die Halal-Datenbank und die Gelehrten.",
  },
];

const Sparzielrechner = () => (
  <>
    <Seo
      title="Sparzielrechner: wann du am Ziel bist | finanzmuslim"
      description="Rechne aus, wann du die Hajj, das Auto ohne Kredit oder das Eigenkapital zusammen hast. Ziel, Betrag im Monat und Rendite eingeben, Ergebnis als Datum und Kurve."
      path="/sparzielrechner"
      brotkrumen={[{ name: "Rechner", path: "/rechner" }, { name: "Sparzielrechner", path: "/sparzielrechner" }]}
      jsonLd={[
        calculatorJsonLd({
          name: "Sparzielrechner",
          description: "Kostenloser Rechner für den Weg zu einem Sparziel: Hajj, Umrah, Hochzeit, Auto ohne Kredit, Eigenkapital, Notgroschen.",
          path: "/sparzielrechner",
        }),
        faqJsonLd(faq),
      ]}
    />
    <RechnerSeite
      name="Sparzielrechner"
      title="Sparzielrechner"
      intro={
        <p>
          Rechne aus, wann du dein Ziel zusammen hast: die Hajj, das Auto ohne Kredit, das
          Eigenkapital. Ein Betrag im Monat, ein Datum.
        </p>
      }
      unterRechner={
        <div className="rounded-2xl bg-accent p-5 md:p-6">
          <h2 className="text-[19px] font-bold text-foreground">So wird gerechnet</h2>
          <p className="mt-3 rounded-xl bg-card px-4 py-3 text-[16px] font-semibold leading-[26px] text-foreground md:text-[18px]">
            Monate = (Ziel − schon gespart) ÷ Betrag im Monat
          </p>
          <p className="mt-3 text-[15px] leading-[24px] text-muted-foreground">
            Bei 8.000 € Ziel und 250 € im Monat: 32 Monate, also 2 Jahre und 8 Monate. Mit Rendite
            wird der Stand jeden Monat zusätzlich um den Zwölftel-Anteil des Jahreswerts größer, dann
            geht es etwas schneller. Der Rechner zählt Monat für Monat, bis das Ziel erreicht ist.
          </p>
        </div>
      }
      erklaerung={
        <>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Ein Ziel mit Datum wird erreicht</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              „Irgendwann Hajj" ist ein Wunsch. „Hajj im Frühjahr 2029, 250 Euro am Ersten jedes
              Monats" ist ein Plan. Der Unterschied ist nicht die Summe, sondern das Datum. Sobald
              es eines gibt, weißt du jeden Monat, ob du auf Kurs bist, und der Betrag geht raus,
              bevor er im Alltag verschwindet.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground">Konto oder Depot</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Für alles unter drei Jahren gehört das Geld auf ein Konto ohne Zins, wo es nicht
              schwankt. Für Ziele in fünf oder zehn Jahren kann ein Depot mit geprüften Anlagen
              mehr bringen, und der Regler zeigt, wie viel das ausmacht. Der Preis dafür ist, dass
              es im falschen Jahr auch weniger sein kann. Welche Anlagen dafür in Frage kommen,
              steht in der{" "}
              <Link to="/halal-anlagen" className="text-primary hover:underline">
                Halal-Datenbank
              </Link>
              , wie ein Konto ohne Zinsen geht, in{" "}
              <Link to="/wissen/girokonto-ohne-zinsen" className="text-primary hover:underline">
                Girokonto ohne Zinsen
              </Link>
              .
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground">Der Notgroschen kommt zuerst</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Bevor das erste Ziel dran ist, braucht es drei Monatsausgaben auf der Seite. Nicht,
              weil das Spaß macht, sondern weil sonst die kaputte Waschmaschine zum Dispo führt und
              der Dispo zu Zinsen. Wer den{" "}
              <Link to="/budgetrechner" className="text-primary hover:underline">
                Budgetrechner
              </Link>{" "}
              benutzt hat, kennt seine Monatsausgaben und kann den Notgroschen direkt als erstes
              Ziel eintragen.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground">Häufige Fragen zum Sparziel</h2>
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
        { name: "Budgetrechner", desc: "wie viel im Monat wirklich frei ist.", to: "/budgetrechner" },
        { name: "Inflationsrechner", desc: "was das Ersparte ohne Anlage an Wert verliert.", to: "/inflationsrechner" },
        { name: "Zakat-Rechner", desc: "was einmal im Jahr auf das Ersparte fällt.", to: "/zakat-rechner" },
      ]}
    >
      <SparzielRechner />
    </RechnerSeite>
  </>
);

export default Sparzielrechner;
