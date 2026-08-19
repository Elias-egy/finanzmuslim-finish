import Seo, { beitragJsonLd } from "@/components/Seo";
import BeitragSeite, { type BeitragAbschnitt } from "@/components/BeitragSeite";
import { IlluHandel, IlluZins } from "@/components/illu";
import { Link } from "react-router-dom";

/** Bild mit Unterschrift, einheitlich fuer alle Beitraege. */
const Bild = ({ children, text }: { children: React.ReactNode; text: string }) => (
  <figure className="my-6">
    <div className="overflow-hidden rounded-2xl">{children}</div>
    <figcaption className="mt-2 text-[14px] text-muted-foreground">{text}</figcaption>
  </figure>
);

const abschnitte: BeitragAbschnitt[] = [
  {
    id: "kurze-antwort",
    titel: "Die kurze Antwort",
    inhalt: (
      <>
        <p>
          Ein normaler Baukredit ist für die meisten Gelehrten nicht zulässig. Du zahlst mehr zurück,
          als du bekommen hast, und der Aufschlag entsteht allein dadurch, dass Zeit vergeht. Genau
          das ist gemeint, wenn vom Zinsverbot die Rede ist.
        </p>
        <p>
          Es gibt Alternativen, und sie funktionieren anders, als die meisten denken. Bei allen kauft
          jemand anderes das Haus zuerst und verkauft oder vermietet es dann an dich. Du zahlst
          trotzdem mehr als den Kaufpreis. Der Unterschied liegt darin, wofür du zahlst.
        </p>
        <p>
          In Deutschland ist die Auswahl klein. Es gibt sie, aber du wirst nicht zwischen zwanzig
          Angeboten wählen können.
        </p>
      </>
    ),
  },
  {
    id: "warum-problem",
    titel: "Warum ein normaler Kredit ein Problem ist",
    inhalt: (
      <>
        <p>
          Bei einem Baukredit leiht dir die Bank Geld. Nach zwanzig Jahren hast du deutlich mehr
          zurückgezahlt. Die Bank hat dafür nichts getan, außer zu warten. Sie trägt kein Risiko am
          Haus, sie besitzt es nie, und wenn du nicht zahlen kannst, holt sie sich ihr Geld trotzdem.
        </p>
        <p>
          Der Kern des Zinsverbots ist genau das: Gewinn ohne Risiko und ohne Gegenleistung. Wer
          etwas verdienen will, soll dafür ein Risiko tragen oder eine Leistung erbringen.
        </p>
        <Bild text="Beim Zinskredit wächst die Summe, weil Zeit vergeht. Niemand trägt dafür ein Risiko.">
          <IlluZins />
        </Bild>
        <p>
          Deshalb reicht es auch nicht, einen Kredit einfach anders zu nennen. Entscheidend ist, ob
          jemand echtes Eigentum übernimmt und echtes Risiko trägt.
        </p>
      </>
    ),
  },
  {
    id: "murabaha",
    titel: "Murabaha, die Bank kauft und verkauft dir weiter",
    inhalt: (
      <>
        <p>
          Das ist das häufigste Modell. Die Bank kauft das Haus selbst. Sie wird für einen Moment
          wirklich Eigentümerin, mit allem, was dazugehört. Danach verkauft sie es dir weiter, zu
          einem höheren Preis, den ihr vorher festlegt. Diesen Preis zahlst du in Raten ab.
        </p>
        <Bild text="Die Bank kauft das Haus wirklich und verkauft es dir mit Aufschlag weiter. Der Preis steht von Anfang an fest.">
          <IlluHandel />
        </Bild>
        <p>
          Der Unterschied zum Kredit klingt klein, ist es aber nicht. Der Aufschlag ist ein
          Handelsgewinn, kein Zins. Er steht am Anfang fest und ändert sich nicht mehr, egal wie
          lange du brauchst. Es gibt keine Verzugszinsen, die die Summe wachsen lassen.
        </p>
        <p>
          Der Haken: Wenn die Bank das Haus kauft und dann an dich weiterverkauft, sind es zwei
          Kaufvorgänge. In Deutschland kann dabei zweimal Grunderwerbsteuer anfallen. Das macht die
          Sache teurer und ist einer der Gründe, warum es so wenige Anbieter gibt.
        </p>
      </>
    ),
  },
  {
    id: "ijara",
    titel: "Ijara, du mietest und kaufst nebenbei",
    inhalt: (
      <>
        <p>
          Hier kauft die Bank das Haus ebenfalls, verkauft es dir aber nicht sofort. Sie vermietet es
          dir. Du zahlst Miete, und am Ende der Laufzeit geht das Haus in dein Eigentum über.
        </p>
        <p>
          Miete gegen Wohnrecht ist unstrittig zulässig. Deshalb wirkt dieses Modell auf den ersten
          Blick am saubersten. Es gibt aber eine Stelle, auf die du achten musst: Solange die Bank
          Eigentümerin ist, trägt sie eigentlich auch die Lasten des Eigentums, also größere
          Reparaturen und die Gebäudeversicherung. Manche Verträge schieben dir das trotzdem zu. Dann
          hast du die Pflichten eines Eigentümers, aber nicht die Rechte, und genau das kritisieren
          Gelehrte.
        </p>
      </>
    ),
  },
  {
    id: "musharaka",
    titel: "Diminishing Musharaka, ihr kauft zusammen",
    inhalt: (
      <>
        <p>
          Das ist das Modell, das dem Gedanken am nächsten kommt. Du und die Bank kauft das Haus
          gemeinsam. Sagen wir, du bringst zwanzig Prozent ein, die Bank achtzig.
        </p>
        <p>
          Du wohnst darin und zahlst der Bank Miete für ihren Anteil. Gleichzeitig kaufst du ihr
          Monat für Monat kleine Stücke ihres Anteils ab. Mit der Zeit gehört dir mehr, der Bank
          weniger, und die Miete sinkt entsprechend. Am Ende gehört das Haus dir allein.
        </p>
        <p>
          Der Grund, warum viele Gelehrte dieses Modell bevorzugen: Die Bank ist die ganze Zeit
          wirklich Miteigentümerin. Sinkt der Wert des Hauses, trifft es sie mit. Sie trägt echtes
          Risiko, und deshalb darf sie auch verdienen.
        </p>
      </>
    ),
  },
  {
    id: "deutschland",
    titel: "Was es davon in Deutschland wirklich gibt",
    inhalt: (
      <>
        <p>
          Hier wird es unangenehm ehrlich. Die Auswahl ist klein.
        </p>
        <p>
          Die <strong>KT Bank</strong> ist die erste Bank in Deutschland, die Finanzprodukte nach den
          Grundsätzen des Islamic Banking anbietet, und hat eine Immobilienfinanzierung im Programm.
          Daneben gibt es Vermittler wie <strong>INAIA</strong>, die islamkonforme Finanzierungen
          anbieten. Das war es im Wesentlichen.
        </p>
        <p>
          Was das praktisch heißt: Du kannst nicht zehn Angebote vergleichen wie bei einem normalen
          Baukredit. Und weil der Wettbewerb fehlt, sind die Gesamtkosten oft höher als bei einer
          konventionellen Finanzierung. Wer islamkonform finanziert, zahlt in vielen Fällen drauf.
          Das ist der Preis, und man sollte ihn kennen, bevor man anfängt.
        </p>
        <p>
          Wir haben zu diesen Anbietern <strong>noch keine geprüften Konditionen</strong>. Sobald wir
          sie haben, findest du sie hier im Vergleich.
        </p>
      </>
    ),
  },
  {
    id: "worauf-achten",
    titel: "Worauf du im Vertrag achten musst",
    inhalt: (
      <>
        <p>Vier Punkte entscheiden darüber, ob ein Angebot hält, was der Name verspricht.</p>
        <p>
          <strong>Erstens, kauft der Anbieter das Haus wirklich?</strong> Wenn er nur Geld überweist
          und ein Formular anders beschriftet, ist es ein Kredit mit anderem Namen.
        </p>
        <p>
          <strong>Zweitens, was passiert bei Zahlungsverzug?</strong> Ein zulässiger Vertrag kennt
          keine Verzugszinsen. Der Preis steht fest und darf nicht wachsen, weil du später zahlst.
        </p>
        <p>
          <strong>Drittens, wer trägt die Lasten am Gebäude?</strong> Solange der Anbieter
          Eigentümer oder Miteigentümer ist, gehören größere Reparaturen und die Versicherung
          anteilig zu ihm.
        </p>
        <p>
          <strong>Viertens, gibt es ein Gutachten?</strong> Seriöse Anbieter lassen ihre Verträge von
          einem Shariah-Board prüfen und zeigen das Dokument. Wer nur behauptet, konform zu sein,
          ohne einen Nachweis zu nennen, sollte das erklären können.
        </p>
      </>
    ),
  },
  {
    id: "alternative",
    titel: "Die Alternative, über die kaum jemand spricht",
    inhalt: (
      <>
        <p>
          Es gibt einen Weg, der immer funktioniert und keinen Vertrag braucht: länger mieten und
          konsequent ansparen, bis ein größerer Teil oder alles bar bezahlt werden kann.
        </p>
        <p>
          Das klingt unbefriedigend, wenn man jetzt ein Haus will. Aber rechne es einmal durch. Wer
          zwanzig Jahre eine islamkonforme Finanzierung bedient, zahlt am Ende oft mehr, als wer
          fünfzehn Jahre mietet und parallel anlegt. Der Unterschied ist, dass du in der zweiten
          Variante flexibel bleibst und niemandem etwas schuldest.
        </p>
        <p>
          Für viele ist das der ehrlichere Weg, auch wenn er länger dauert. Und niemand verbietet
          dir, beides zu kombinieren: erst ansparen, dann den Rest über eines der Modelle oben.
        </p>
      </>
    ),
  },
];

const faq = [
  {
    frage: "Ist ein Bausparvertrag eine Lösung?",
    antwort:
      "Nein. Beim Bausparen ist beides verzinst, das Guthaben in der Ansparphase und das Darlehen danach. Der Vertrag ist auf Zins gebaut und lässt sich nicht anders einstellen.",
  },
  {
    frage: "Was ist mit der KfW-Förderung?",
    antwort:
      "Die KfW vergibt zinsverbilligte Kredite, und ein Kredit bleibt ein Kredit. Reine Zuschüsse, die nicht zurückgezahlt werden müssen, sind etwas anderes und werden in der Regel als unproblematisch gesehen. Kläre den konkreten Fall mit einem Gelehrten.",
  },
  {
    frage: "Ich habe schon einen Zinskredit laufen. Was jetzt?",
    antwort:
      "Die verbreitete Empfehlung ist, nicht in Panik zu verfallen, sondern so schnell wie möglich herauszukommen. Also Sondertilgungen nutzen, wo sie erlaubt sind, und prüfen, ob eine Umschuldung auf ein zulässiges Modell möglich ist. Bevor du eine bestehende Finanzierung kündigst, sprich mit jemandem, der dein konkretes Risiko einschätzen kann.",
  },
  {
    frage: "Warum ist die islamkonforme Finanzierung teurer?",
    antwort:
      "Zwei Gründe. Es gibt kaum Anbieter, also fehlt der Wettbewerb. Und bei manchen Modellen fällt die Grunderwerbsteuer zweimal an, weil das Haus zweimal den Eigentümer wechselt.",
  },
  {
    frage: "Gilt Miete als rausgeworfenes Geld?",
    antwort:
      "Nein. Du bezahlst dafür, irgendwo zu wohnen, und bekommst dafür eine Gegenleistung. Miete ist ein normaler Tausch von Geld gegen Nutzung und im Islam unstrittig zulässig.",
  },
];

const HausKaufenOhneZinsen = () => (
  <>
    <Seo
      title="Haus kaufen ohne Zinsen: die islamkonformen Modelle erklärt | finanzmuslim"
      description="Die drei Wege, ein Haus ohne Zinsen zu finanzieren. Was es davon in Deutschland gibt und worauf du im Vertrag achten musst."
      path="/wissen/haus-kaufen-ohne-zinsen"
      jsonLd={beitragJsonLd({
        titel: "Haus kaufen ohne Zinsen",
        beschreibung: "Die drei Wege, ein Haus ohne Zinsen zu finanzieren. Was es davon in Deutschland gibt und worauf du im Vertrag achten musst.",
        path: "/wissen/haus-kaufen-ohne-zinsen",
        datePublished: "15. August 2026",
        dateModified: "16. August 2026",
        faq,
      })}
    />
    <BeitragSeite
      titel="Haus kaufen ohne Zinsen"
      kurzGesagt={[
        "Ein normaler Baukredit gilt bei den meisten Gelehrten als nicht zulässig, weil der Aufschlag allein durch Zeit entsteht.",
        "Es gibt drei anerkannte Alternativen. Bei allen kauft der Anbieter das Haus zuerst selbst.",
        "Du zahlst trotzdem mehr als den reinen Kaufpreis. Der Unterschied ist, wofür du zahlst.",
        "In Deutschland ist die Auswahl klein und die Finanzierung meist teurer als eine konventionelle.",
        "Der Weg ohne jeden Vertrag bleibt: länger mieten, konsequent ansparen, später mehr bar zahlen.",
      ]}
      abschnitte={abschnitte}
      faq={faq}
      datePublished="15. August 2026"
      dateModified="16. August 2026"
      rechtshinweis="Dieser Beitrag gibt bekannte Positionen wieder und dient ausschließlich zu Bildungszwecken. Er ist keine Fatwa und ersetzt weder die Auskunft eines Gelehrten noch eine Rechts-, Steuer- oder Finanzierungsberatung. Genannte Anbieter sind Beispiele für den deutschen Markt, keine Empfehlung. Innerhalb der Rechtsschulen gibt es zu einzelnen Modellen abweichende Auffassungen."
      boxOben={{
        kategorie: "Baufinanzierung",
        ueberschrift: "Wer finanziert islamkonform?",
        linkZiel: "/vergleiche",
      }}
      boxMitte={{
        kategorie: "Depot",
        ueberschrift: "Erst ansparen, dann kaufen",
        linkZiel: "/vergleich/depot",
      }}
    >
      <section className="card-surface p-6">
        <h2 className="text-[19px] font-bold text-foreground">Passt dazu</h2>
        <ul className="mt-3 space-y-2 text-[16px]">
          <li>
            <Link to="/wissen/halal-kredit-ohne-zinsen" className="text-primary hover:underline">
              Halal Kredit ohne Zinsen
            </Link>{" "}
            erklärt die vier Vertragsformen, die einen Kredit ersetzen.
          </li>
          <li>
            <Link to="/vorlagen/vertrags-ampel" className="text-primary hover:underline">
              Die Vertrags-Ampel
            </Link>{" "}
            ordnet zwölf Alltagsverträge ein, darunter Kredit, Bausparen und Leasing.
          </li>
          <li>
            <Link to="/wissen/ist-versicherung-haram" className="text-primary hover:underline">
              Ist eine Versicherung haram?
            </Link>{" "}
            Die Gebäudeversicherung ist beim Hauskauf die nächste Frage.
          </li>
        </ul>
      </section>
    </BeitragSeite>
  </>
);

export default HausKaufenOhneZinsen;
