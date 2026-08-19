import Seo, { beitragJsonLd } from "@/components/Seo";
import BeitragSeite, { type BeitragAbschnitt } from "@/components/BeitragSeite";
import { IlluHandel } from "@/components/illu";
import { Link } from "react-router-dom";

const Bild = ({ children, text }: { children: React.ReactNode; text: string }) => (
  <figure className="my-6">
    <div className="overflow-hidden rounded-2xl">{children}</div>
    <figcaption className="mt-2 text-[14px] text-muted-foreground">{text}</figcaption>
  </figure>
);

/** Kleine Vergleichszeile fuer die zwei Faelle. */
const Fall = ({
  titel,
  preis,
  urteil,
  ton,
}: {
  titel: string;
  preis: string;
  urteil: string;
  ton: "ok" | "kritisch";
}) => (
  <div className="card-surface p-5">
    <p className="text-[17px] font-bold text-foreground">{titel}</p>
    <p className="mt-2 text-[16px] text-muted-foreground">{preis}</p>
    <p
      className={`mt-3 text-[16px] font-semibold ${
        ton === "ok" ? "text-[hsl(var(--success))]" : "text-[hsl(var(--destructive))]"
      }`}
    >
      {urteil}
    </p>
  </div>
);

const abschnitte: BeitragAbschnitt[] = [
  {
    id: "die-eine-frage",
    titel: "Es hängt an einer einzigen Frage",
    inhalt: (
      <>
        <p>
          Ratenzahlung ist nicht automatisch verboten. Ob sie in Ordnung ist, entscheidet eine
          einzige Frage, und die kannst du an jeder Kasse selbst beantworten:
        </p>
        <p className="rounded-xl bg-hero p-5 text-[19px] font-bold text-foreground">
          Zahle ich am Ende mehr, als wenn ich sofort bar bezahlt hätte?
        </p>
        <p>
          Ist die Summe aller Raten genau der Preis, der auch am Regal steht, dann ist es für viele
          Gelehrte in Ordnung. Kommt irgendetwas dazu, also Zinsen, Gebühren, ein Aufschlag oder ein
          teurerer Tarif, dann ist genau dieser Aufschlag das Problem.
        </p>
        <p>
          Der Grund ist einfach: Der Aufschlag entsteht nicht für eine Ware und nicht für eine
          Leistung. Er entsteht nur dafür, dass du später zahlst. Und Geld, das allein durch Zeit
          mehr wird, ist genau das, was das Zinsverbot meint.
        </p>
      </>
    ),
  },
  {
    id: "zwei-faelle",
    titel: "Die zwei Fälle im Vergleich",
    inhalt: (
      <>
        <p>Dasselbe Sofa, zwei Angebote. Der Unterschied ist der ganze Punkt.</p>
        <div className="my-6 grid gap-4 md:grid-cols-2">
          <Fall
            titel="Angebot A"
            preis="Sofa 1.200 €. In 12 Raten zu 100 €. Zusammen 1.200 €."
            urteil="Für viele Gelehrte in Ordnung"
            ton="ok"
          />
          <Fall
            titel="Angebot B"
            preis="Sofa 1.200 €. In 12 Raten zu 110 €. Zusammen 1.320 €."
            urteil="Die 120 € Aufschlag sind das Problem"
            ton="kritisch"
          />
        </div>
        <p>
          Bei Angebot A hat der Händler seinen Preis. Dass du in Teilen zahlst, ändert daran nichts.
          Bei Angebot B zahlst du 120 € allein dafür, dass du dir Zeit lässt.
        </p>
        <Bild text="Beim Kauf tauschst du Geld gegen Ware. Solange der Preis derselbe bleibt, ändert die Ratenzahlung daran nichts.">
          <IlluHandel />
        </Bild>
      </>
    ),
  },
  {
    id: "haendlerpreis",
    titel: "Der Fall, über den am meisten gestritten wird",
    inhalt: (
      <>
        <p>
          Jetzt wird es genauer. Manche Händler machen es so: Bar kostet das Sofa 1.200 €. Auf Raten
          kostet es 1.320 €, und dieser Preis steht von Anfang an fest, im Vertrag, ohne Zinssatz,
          ohne Verzugszinsen.
        </p>
        <p>
          Das ist nicht dasselbe wie ein Kredit. Hier verkauft dir jemand eine Ware zu einem höheren
          Preis, weil er länger auf sein Geld wartet. Ein Teil der Gelehrten hält das für zulässig,
          weil ein Verkäufer seinen Preis frei setzen darf und es ein Handelsgeschäft bleibt.
        </p>
        <p>
          Ein anderer Teil sagt: Der Aufschlag hängt an der Zeit, also ist er verkappter Zins.
        </p>
        <p>
          <strong>Woran du dich halten kannst:</strong> Solange der Preis von Anfang an feststeht,
          sich nie ändert und kein Verzugszins dazukommt, folgen die meisten der ersten Auffassung.
          Sobald aber ein Zinssatz genannt wird oder die Summe wachsen kann, weil du zu spät zahlst,
          sind sich fast alle einig, dass es nicht mehr geht.
        </p>
      </>
    ),
  },
  {
    id: "praxis",
    titel: "Was heißt das bei Klarna, PayPal und Co.?",
    inhalt: (
      <>
        <p>
          Diese Anbieter haben verschiedene Varianten, und sie ändern sie regelmäßig. Deshalb kann
          dir niemand pauschal sagen, ob der eine Dienst erlaubt ist und der andere nicht. Du musst
          im Bezahlvorgang selbst hinsehen. Zwei Zahlen genügen.
        </p>
        <p>
          <strong>Erstens der Gesamtbetrag.</strong> Fast alle Dienste zeigen dir irgendwo, was du
          insgesamt zahlst. Vergleiche ihn mit dem normalen Preis. Sind beide gleich, ist die Sache
          unproblematisch. Steht dort mehr, ist die Differenz der Aufschlag.
        </p>
        <p>
          <strong>Zweitens die Mahn- und Verzugsregelung.</strong> Steht in den Bedingungen, dass bei
          verspäteter Zahlung Zinsen anfallen, ist das ein Zinsvertrag, auch wenn du vorhast, immer
          pünktlich zu zahlen. Für viele Gelehrte ist bereits die Vereinbarung das Problem, nicht
          erst der Fall, dass sie greift.
        </p>
        <p>
          Am unproblematischsten ist meistens die Variante, bei der du den Betrag später in einer
          Summe zahlst, ohne dass sich der Preis ändert. Das ist ein reiner Zahlungsaufschub.
        </p>
      </>
    ),
  },
  {
    id: "null-prozent",
    titel: "Und die Null-Prozent-Finanzierung?",
    inhalt: (
      <>
        <p>
          Hier lohnt sich ein zweiter Blick, denn null Prozent heißt nicht immer null Aufschlag.
        </p>
        <p>
          Wenn du im Laden fragst, was das Gerät bei Barzahlung kostet, und dir jemand einen Rabatt
          nennt, den es bei der Finanzierung nicht gibt, dann ist der Zins nicht verschwunden. Er
          steckt im Preis. Du zahlst ihn, er heißt nur anders.
        </p>
        <p>
          Frag deshalb immer nach dem Barzahlungspreis. Ist er identisch mit der Summe der Raten,
          ist die Finanzierung tatsächlich kostenlos. Ist er niedriger, kennst du jetzt den echten
          Aufschlag.
        </p>
        <p>
          Achte außerdem darauf, ob die Finanzierung über eine Bank läuft und ob du dabei einen
          Kreditvertrag unterschreibst. Dann gilt, was im Vertrag steht, nicht was im Werbeprospekt
          stand.
        </p>
      </>
    ),
  },
  {
    id: "checkliste",
    titel: "Die Prüfung an der Kasse, in dreißig Sekunden",
    inhalt: (
      <>
        <ol className="space-y-3">
          <li>
            <strong>1. Was kostet es bar?</strong> Diese Zahl ist dein Maßstab.
          </li>
          <li>
            <strong>2. Was kosten alle Raten zusammen?</strong> Nicht die einzelne Rate ansehen,
            sondern die Summe.
          </li>
          <li>
            <strong>3. Sind beide gleich?</strong> Dann ist es unproblematisch.
          </li>
          <li>
            <strong>4. Steht irgendwo ein Zinssatz oder eine Gebühr?</strong> Dann ist es ein
            Zinsgeschäft.
          </li>
          <li>
            <strong>5. Was passiert, wenn du zu spät zahlst?</strong> Wächst die Summe, ist es ein
            Zinsvertrag.
          </li>
        </ol>
        <p className="mt-4">
          Und die ehrlichste Frage zum Schluss: Brauchst du es jetzt, oder könntest du zwei Monate
          sparen und es bar kaufen? In den allermeisten Fällen lautet die Antwort: Du könntest.
        </p>
      </>
    ),
  },
];

const faq = [
  {
    frage: "Ist Ratenzahlung bei Otto oder Amazon haram?",
    antwort:
      "Das lässt sich nicht pauschal beantworten, weil die Anbieter mehrere Varianten haben und sie regelmäßig ändern. Entscheidend ist nicht der Name des Händlers, sondern ob die Summe aller Raten dem Barpreis entspricht und ob bei Verzug Zinsen anfallen. Beides steht im Bezahlvorgang.",
  },
  {
    frage: "Was ist mit dem Handyvertrag, bei dem das Gerät dabei ist?",
    antwort:
      "Das ist derselbe Fall in anderer Verpackung. Vergleiche den Tarif mit Gerät und denselben Tarif ohne Gerät. Die Differenz mal Laufzeit ist das, was du für das Gerät zahlst. Liegt sie deutlich über dem normalen Kaufpreis, steckt darin ein Aufschlag für die Zeit.",
  },
  {
    frage: "Darf ich eine Kreditkarte für Ratenzahlung nutzen?",
    antwort:
      "Die Teilzahlungsfunktion einer Kreditkarte, oft Revolving genannt, arbeitet mit Zinsen und gehört zu den klarsten Fällen. Wer eine Kreditkarte nutzt, sollte den Betrag immer sofort vollständig ausgleichen.",
  },
  {
    frage: "Ich habe schon etwas auf Raten gekauft. Was mache ich jetzt?",
    antwort:
      "Die verbreitete Empfehlung ist, den Restbetrag so schnell wie möglich abzulösen, wenn Aufschläge anfallen. Wo das nicht geht, zahlt man wie vereinbart weiter und vermeidet solche Verträge künftig. Rückabwickeln muss man nichts.",
  },
];

const RatenzahlungHaram = () => (
  <>
    <Seo
      title="Ist Ratenzahlung haram? Die eine Frage, die entscheidet | finanzmuslim"
      description="Ratenzahlung ist nicht automatisch verboten. Entscheidend ist, ob du mehr zahlst als bei Barzahlung. Mit Prüfung für Klarna, PayPal, Null-Prozent-Finanzierung und Handyverträge."
      path="/wissen/ratenzahlung-haram"
      jsonLd={beitragJsonLd({
        titel: "Angebot A",
        beschreibung: "Ratenzahlung ist nicht automatisch verboten. Entscheidend ist, ob du mehr zahlst als bei Barzahlung. Mit Prüfung für Klarna, PayPal, Null-Prozent-Finanzierung und Handyverträge.",
        path: "/wissen/ratenzahlung-haram",
        datePublished: "15. August 2026",
        faq,
      })}
    />
    <BeitragSeite
      titel="Ist Ratenzahlung haram?"
      kurzGesagt={[
        "Ratenzahlung ist nicht automatisch verboten.",
        "Entscheidend ist eine Frage: Zahlst du zusammen mehr als bei Barzahlung?",
        "Gleiche Summe wie der Barpreis heißt für viele Gelehrte: in Ordnung.",
        "Jeder Aufschlag, jede Gebühr und jeder Verzugszins ist das Problem.",
        "Null Prozent Finanzierung ist nicht immer kostenlos. Frag nach dem Barzahlungspreis.",
      ]}
      abschnitte={abschnitte}
      faq={faq}
      datePublished="15. August 2026"
      rechtshinweis="Dieser Beitrag gibt bekannte Positionen wieder und dient ausschließlich zu Bildungszwecken. Er ist keine Fatwa und ersetzt weder die Auskunft eines Gelehrten noch eine Rechtsberatung. Genannte Zahlungsdienste sind Beispiele, ihre Bedingungen ändern sich und müssen im Einzelfall selbst geprüft werden. Innerhalb der Rechtsschulen gibt es zu einzelnen Punkten abweichende Auffassungen."
      boxOben={{
        kategorie: "Girokonto",
        ueberschrift: "Ein Konto, das dich nicht in den Dispo zieht",
        linkZiel: "/vergleiche",
      }}
      boxMitte={{
        kategorie: "Depot",
        ueberschrift: "Ansparen statt abstottern",
        linkZiel: "/vergleich/depot",
      }}
    >
      <section className="card-surface p-6">
        <h2 className="text-[19px] font-bold text-foreground">Passt dazu</h2>
        <ul className="mt-3 space-y-2 text-[16px]">
          <li>
            <Link to="/vorlagen/vertrags-ampel" className="text-primary hover:underline">
              Die Vertrags-Ampel
            </Link>{" "}
            ordnet Ratenzahlung, Leasing, Kreditkarte und neun weitere Verträge ein.
          </li>
          <li>
            <Link to="/wissen/haus-kaufen-ohne-zinsen" className="text-primary hover:underline">
              Haus kaufen ohne Zinsen
            </Link>{" "}
            zeigt dieselbe Frage bei der größten Anschaffung des Lebens.
          </li>
        </ul>
      </section>
    </BeitragSeite>
  </>
);

export default RatenzahlungHaram;
