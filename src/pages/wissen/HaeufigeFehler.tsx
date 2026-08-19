import Seo, { beitragJsonLd } from "@/components/Seo";
import BeitragSeite, { type BeitragAbschnitt } from "@/components/BeitragSeite";
import { IlluDepot, IlluZins } from "@/components/illu";
import { Link } from "react-router-dom";

const Bild = ({ children, text }: { children: React.ReactNode; text: string }) => (
  <figure className="my-6">
    <div className="overflow-hidden rounded-2xl">{children}</div>
    <figcaption className="mt-2 text-[14px] text-muted-foreground">{text}</figcaption>
  </figure>
);

/** Ein Fehler: was passiert, und was stattdessen. */
const Fehler = ({
  nummer,
  titel,
  problem,
  loesung,
}: {
  nummer: number;
  titel: string;
  problem: string;
  loesung: React.ReactNode;
}) => (
  <div className="card-surface p-5">
    <p className="text-[17px] font-bold text-foreground">
      {nummer}. {titel}
    </p>
    <p className="mt-2 text-[16px] text-muted-foreground">{problem}</p>
    <p className="mt-3 text-[16px] text-foreground">
      <span className="font-semibold">Besser: </span>
      {loesung}
    </p>
  </div>
);

const abschnitte: BeitragAbschnitt[] = [
  {
    id: "vorbereitung",
    titel: "Drei Fehler, bevor überhaupt etwas passiert",
    inhalt: (
      <>
        <p>
          Die teuersten Fehler stehen ganz am Anfang. Sie kosten kein Geld, sie kosten Jahre.
        </p>
        <div className="my-6 space-y-4">
          <Fehler
            nummer={1}
            titel="Warten, bis alles geklärt ist"
            problem="Erst noch dieses Video, dann diese Frage, dann noch eine Meinung einholen. Nach zwei Jahren liegt das Geld immer noch auf dem Konto und hat still an Kaufkraft verloren."
            loesung={
              <>
                Mit einem kleinen Betrag anfangen, den du zur Not entbehren kannst, und mit einer
                Anlage, deren Nachweis du gelesen hast. Wie viel das Warten kostet, zeigt der{" "}
                <Link to="/inflationsrechner" className="text-primary hover:underline">
                  Inflationsrechner
                </Link>
                .
              </>
            }
          />
          <Fehler
            nummer={2}
            titel="Investieren, bevor die Schulden weg sind"
            problem="Wer einen Dispo oder einen Ratenkredit laufen hat und gleichzeitig anlegt, zahlt auf der einen Seite sicher Zinsen und hofft auf der anderen auf Rendite. Die Rechnung geht selten auf, und das Zinsgeschäft läuft weiter."
            loesung="Zuerst den Dispo auf null, dann teure Raten ablösen, danach anlegen. Das ist keine Anlagestrategie, das ist Aufräumen."
          />
          <Fehler
            nummer={3}
            titel="Keine Rücklage haben"
            problem="Wer alles anlegt, muss bei der ersten kaputten Waschmaschine wieder verkaufen. Oft genau dann, wenn die Kurse gerade unten sind."
            loesung="Drei bis sechs Monatsausgaben bleiben erreichbar auf dem Konto. Erst was darüber liegt, wird angelegt."
          />
        </div>
        <Bild text="Erst aufräumen, dann anlegen. Ein laufender Zins frisst die Rendite, bevor sie da ist.">
          <IlluZins />
        </Bild>
      </>
    ),
  },
  {
    id: "auswahl",
    titel: "Drei Fehler bei der Auswahl",
    inhalt: (
      <>
        <div className="my-6 space-y-4">
          <Fehler
            nummer={4}
            titel="Dem Etikett vertrauen statt dem Nachweis"
            problem="Im Namen steht Islamic, also passt es. Manchmal stimmt das, manchmal bezieht sich der Nachweis nur auf den Index und nicht auf das Produkt, und manchmal ist er zwei Jahre alt."
            loesung={
              <>
                Nachsehen, wer geprüft hat und wann. Bei jeder Anlage in der{" "}
                <Link to="/halal-anlagen" className="text-primary hover:underline">
                  Datenbank
                </Link>{" "}
                steht das mit dabei, samt Link auf das Zertifikat, wo es eines gibt.
              </>
            }
          />
          <Fehler
            nummer={5}
            titel="Alles auf eine Aktie setzen"
            problem="Eine Firma besteht den Halal-Test, also fließt alles dorthin. Halal sagt aber nichts über die Qualität des Geschäfts und nichts über den Preis. Eine einzelne Firma kann jederzeit die Hälfte verlieren."
            loesung="Breit streuen. Ein Fonds hält hunderte geprüfte Firmen gleichzeitig, und das für einen Bruchteil der Arbeit."
          />
          <Fehler
            nummer={6}
            titel="Nur auf die Rendite der letzten Jahre schauen"
            problem="Was zuletzt am stärksten gestiegen ist, wirkt am überzeugendsten. Genau das ist der häufigste Grund, teuer einzusteigen."
            loesung="Auf Kosten, Fondsgröße und Nachweis schauen. Die vergangene Rendite ist die Zahl mit der geringsten Aussagekraft für morgen."
          />
        </div>
      </>
    ),
  },
  {
    id: "danach",
    titel: "Drei Fehler nach dem Kauf",
    inhalt: (
      <>
        <div className="my-6 space-y-4">
          <Fehler
            nummer={7}
            titel="Das Verrechnungskonto vergessen"
            problem="Der ETF ist geprüft, das Geld daneben liegt auf einem verzinsten Verrechnungskonto. Damit läuft genau das Zinsgeschäft mit, das vermieden werden sollte."
            loesung={
              <>
                Beim Broker die Verzinsung abschalten, wo es geht. Welcher Anbieter das erlaubt,
                steht im{" "}
                <Link to="/vergleich/depot" className="text-primary hover:underline">
                  Depot-Vergleich
                </Link>
                .
              </>
            }
          />
          <Fehler
            nummer={8}
            titel="Die Erträge nicht reinigen"
            problem="Auch geprüfte Firmen haben kleine Zinserträge. Der Anteil ist gering, aber er verschwindet nicht dadurch, dass ein Gremium den Fonds freigegeben hat."
            loesung="Einmal im Jahr den ausgewiesenen Prozentsatz auf deine Erträge rechnen und weitergeben, ohne dafür eine Belohnung zu erwarten. Zusammen mit der Zakat erledigt, vergisst man es nicht."
          />
          <Fehler
            nummer={9}
            titel="Beim ersten Rückgang verkaufen"
            problem="Der Kurs fällt um zwanzig Prozent, das Bauchgefühl sagt raus. Wer unten verkauft, macht aus einem Buchverlust einen echten. Das ist der teuerste Fehler überhaupt, und fast jeder macht ihn einmal."
            loesung="Vorher festlegen, wie lange das Geld liegen bleiben soll, und den Betrag so wählen, dass ein Rückgang auszuhalten ist. Wer nicht hinsehen muss, hält leichter durch."
          />
        </div>
        <Bild text="Der geprüfte Fonds ist die eine Hälfte. Das Konto daneben ist die andere.">
          <IlluDepot />
        </Bild>
      </>
    ),
  },
  {
    id: "zakat",
    titel: "Der Fehler, der erst nach einem Jahr auffällt",
    inhalt: (
      <>
        <p>
          Wer anlegt, erhöht sein Vermögen, und damit steigt auch die Zakat. Viele merken das erst,
          wenn der Stichtag da ist und das Geld im Depot steckt.
        </p>
        <p>
          Zwei Dinge helfen: einen festen Stichtag wählen, viele nehmen einen Tag im Ramadan, und
          die Zakat vor dem Stichtag ausrechnen, damit der Betrag bereitliegt.
        </p>
        <p>
          Wie viel es wird und ab welcher Grenze überhaupt, zeigt der{" "}
          <Link to="/zakat-rechner" className="text-primary hover:underline">
            Zakat-Rechner
          </Link>
          . Die Grenze selbst erklärt der Beitrag zum{" "}
          <Link to="/wissen/nisab" className="text-primary hover:underline">
            Nisab
          </Link>
          .
        </p>
      </>
    ),
  },
];

const faq = [
  {
    frage: "Was ist der häufigste Fehler beim halal investieren?",
    antwort:
      "Zu lange warten. Wer zwei Jahre recherchiert, statt mit einem kleinen Betrag anzufangen, verliert in dieser Zeit still Kaufkraft. Der zweite häufige Fehler ist, das Verrechnungskonto beim Broker zu vergessen, während der Fonds selbst geprüft ist.",
  },
  {
    frage: "Soll ich erst Schulden tilgen oder investieren?",
    antwort:
      "Erst tilgen, wenn es sich um verzinste Schulden handelt. Ein Dispo kostet sicher, eine Anlage bringt nur vielleicht. Dazu läuft das Zinsgeschäft weiter, das man eigentlich vermeiden will.",
  },
  {
    frage: "Wie viel Geld sollte ich als Rücklage behalten?",
    antwort:
      "Üblich sind drei bis sechs Monatsausgaben, jederzeit erreichbar. Dieses Geld verliert zwangsläufig an Kaufkraft, und das ist der Preis dafür, bei einer unerwarteten Ausgabe nicht verkaufen zu müssen.",
  },
  {
    frage: "Reicht es, wenn Islamic im Namen des Fonds steht?",
    antwort:
      "Nein. Entscheidend ist, wer geprüft hat, wann zuletzt und ob sich der Nachweis auf das Produkt oder nur auf den Index bezieht. Dazu kommen Fragen an den Fonds selbst, etwa zur Wertpapierleihe.",
  },
  {
    frage: "Was mache ich, wenn mein Depot im Minus ist?",
    antwort:
      "Nichts überstürzen. Ein Buchverlust wird erst durch den Verkauf zu einem echten Verlust. Wichtiger ist die Frage vorher: Ist der Betrag so gewählt, dass du einen Rückgang aushalten kannst, ohne das Geld zu brauchen?",
  },
];

const HaeufigeFehler = () => (
  <>
    <Seo
      title="Die häufigsten Fehler beim halal investieren | finanzmuslim"
      description="Zehn Fehler, die Einsteiger machen: zu lange warten, Schulden ignorieren, dem Etikett vertrauen, das Verrechnungskonto vergessen, beim Rückgang verkaufen. Jeweils mit dem, was stattdessen hilft."
      path="/wissen/haeufige-fehler"
      jsonLd={beitragJsonLd({
        titel: "Warten, bis alles geklärt ist",
        beschreibung: "Zehn Fehler, die Einsteiger machen: zu lange warten, Schulden ignorieren, dem Etikett vertrauen, das Verrechnungskonto vergessen, beim Rückgang verkaufen. Jeweils mit dem, was stattdessen hilft.",
        path: "/wissen/haeufige-fehler",
        datePublished: "16. August 2026",
        faq,
      })}
    />
    <BeitragSeite
      titel="Die häufigsten Fehler"
      kurzGesagt={[
        "Der teuerste Fehler ist Warten. Er kostet kein Geld, sondern Jahre.",
        "Erst Dispo und teure Raten weg, dann anlegen.",
        "Das Etikett Islamic ersetzt keinen Nachweis mit Datum.",
        "Der geprüfte Fonds nützt wenig, wenn das Konto daneben Zinsen zahlt.",
        "Wer unten verkauft, macht aus einem Buchverlust einen echten.",
      ]}
      abschnitte={abschnitte}
      faq={faq}
      datePublished="16. August 2026"
      rechtshinweis="Dieser Beitrag dient ausschließlich zu Bildungszwecken und ist weder Anlageberatung noch Fatwa. Er beschreibt allgemeine Muster, keine auf deine Lage zugeschnittene Empfehlung. Investitionen in Wertpapiere sind mit Risiken verbunden, bis hin zum Totalverlust."
      boxOben={{
        kategorie: "Guide",
        ueberschrift: "Der Einstieg Schritt für Schritt",
        linkZiel: "/halal-guide",
        text: "Die Grundlagen und eine Prüfreihenfolge zum Mitmachen.",
        knopf: "Guide kostenlos sichern",
      }}
      boxMitte={{
        kategorie: "Depot",
        ueberschrift: "Ein Depot, das ohne Zinsgeschäft arbeitet",
        linkZiel: "/vergleich/depot",
      }}
    >
      <section className="card-surface p-6">
        <h2 className="text-[19px] font-bold text-foreground">Passt dazu</h2>
        <ul className="mt-3 space-y-2 text-[16px]">
          <li>
            <Link to="/wissen/halal-etfs" className="text-primary hover:underline">
              Halal ETFs
            </Link>{" "}
            zeigt die vier Fragen, mit denen du einen Fonds prüfst.
          </li>
          <li>
            <Link to="/wissen/girokonto-ohne-zinsen" className="text-primary hover:underline">
              Girokonto ohne Zinsen
            </Link>{" "}
            erklärt die Handgriffe, die du am Konto erledigst.
          </li>
          <li>
            <Link to="/wissen/nisab" className="text-primary hover:underline">
              Nisab
            </Link>{" "}
            sagt dir, ab wann Zakat auf dein Vermögen fällig wird.
          </li>
        </ul>
      </section>
    </BeitragSeite>
  </>
);

export default HaeufigeFehler;
