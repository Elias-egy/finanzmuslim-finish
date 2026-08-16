import Seo from "@/components/Seo";
import BeitragSeite, { type BeitragAbschnitt } from "@/components/BeitragSeite";
import { IlluDepot, IlluPruefung } from "@/components/illu";
import { Link } from "react-router-dom";

const Bild = ({ children, text }: { children: React.ReactNode; text: string }) => (
  <figure className="my-6">
    <div className="overflow-hidden rounded-2xl">{children}</div>
    <figcaption className="mt-2 text-[14px] text-muted-foreground">{text}</figcaption>
  </figure>
);

/** Eine Prüffrage mit Antwort. Vier davon sind der ganze Beitrag. */
const Frage = ({
  nummer,
  frage,
  text,
}: {
  nummer: number;
  frage: string;
  text: string;
}) => (
  <div className="card-surface p-5">
    <p className="text-[17px] font-bold text-foreground">
      {nummer}. {frage}
    </p>
    <p className="mt-2 text-[16px] text-muted-foreground">{text}</p>
  </div>
);

const abschnitte: BeitragAbschnitt[] = [
  {
    id: "zwei-ebenen",
    titel: "Ein ETF wird auf zwei Ebenen geprüft",
    inhalt: (
      <>
        <p>
          Ein ETF ist ein Korb. Er kauft nach einer festen Liste ein und entscheidet selbst nichts.
          Wenn die Liste sauber ist, ist der Inhalt sauber. Damit hört die Prüfung aber nicht auf.
        </p>
        <p className="rounded-xl bg-hero p-5 text-[19px] font-bold text-foreground">
          Erste Ebene: Was ist drin. Zweite Ebene: Was macht der Fonds damit.
        </p>
        <p>
          Die erste Ebene ist der Index. Ein Anbieter wie MSCI oder Dow Jones prüft jede Firma nach
          festen Grenzwerten und wirft raus, was durchfällt. Welche drei Grenzwerte das sind, steht
          in{" "}
          <Link to="/wissen/sind-aktien-halal" className="text-primary hover:underline">
            Sind Aktien halal?
          </Link>
        </p>
        <p>
          Die zweite Ebene ist der Fonds selbst. Er kann einen sauberen Index nachbilden und
          trotzdem Dinge tun, die du nicht willst. Genau hier schauen die wenigsten hin, und genau
          hier liegen die Unterschiede zwischen den Anbietern.
        </p>
        <Bild text="Der Index entscheidet, was im Korb liegt. Der Fonds entscheidet, was er mit dem Korb macht.">
          <IlluDepot />
        </Bild>
      </>
    ),
  },
  {
    id: "vier-fragen",
    titel: "Vier Fragen an den Fonds",
    inhalt: (
      <>
        <p>
          Diese vier stehen im Factsheet oder im Verkaufsprospekt. Zusammen brauchen sie zehn
          Minuten.
        </p>
        <div className="my-6 space-y-4">
          <Frage
            nummer={1}
            frage="Verleiht der Fonds Wertpapiere?"
            text="Viele ETFs verleihen ihre Aktien gegen eine Gebühr an andere Marktteilnehmer. Das bringt ein paar Hundertstel Rendite und ist unter Gelehrten umstritten, weil die Papiere häufig für Leerverkäufe gebraucht werden. Im Factsheet steht das unter Wertpapierleihe oder Securities Lending. Manche Islamic-ETFs schließen es ausdrücklich aus."
          />
          <Frage
            nummer={2}
            frage="Kauft er die Aktien wirklich?"
            text="Physisch heißt, der Fonds besitzt die Papiere. Synthetisch heißt, er bildet den Index über ein Tauschgeschäft mit einer Bank nach und hält etwas ganz anderes. Für ein islamkonformes Depot ist physisch der klare Fall, synthetisch bringt einen Vertrag ins Spiel, den niemand geprüft hat."
          />
          <Frage
            nummer={3}
            frage="Was passiert mit dem unreinen Teil der Erträge?"
            text="Auch geprüfte Firmen haben kleine Zinserträge. Manche Anbieter rechnen den Anteil aus und weisen ihn aus, damit du ihn weitergeben kannst. Andere schweigen dazu. Steht nichts dazu im Bericht, musst du selbst schätzen, und das ist die schlechtere Lösung."
          />
          <Frage
            nummer={4}
            frage="Wer hat geprüft, und wie oft?"
            text="Ein Name allein reicht nicht. Wichtig ist, ob ein Zertifikat für das Produkt selbst vorliegt oder nur für den Index, und ob es jährlich erneuert wird. In unserer Datenbank steht bei jeder Anlage genau das."
          />
        </div>
        <p>
          <Link to="/halal-anlagen" className="text-primary hover:underline">
            Zu den geprüften Anlagen
          </Link>
        </p>
      </>
    ),
  },
  {
    id: "erkennen",
    titel: "Woran du einen erkennst",
    inhalt: (
      <>
        <p>
          Im Namen steht fast immer <strong>Islamic</strong>, <strong>Shariah</strong> oder{" "}
          <strong>Islamic Screened</strong>. Das ist der schnellste Filter in der Suche deines
          Brokers.
        </p>
        <p>
          Verlass dich aber nicht auf das Wort. Es gibt Fonds mit ähnlich klingenden Namen, die
          nichts damit zu tun haben, etwa Nachhaltigkeitsfonds mit ESG oder SRI im Titel. Die
          schließen zwar Waffen und Tabak aus, aber Banken und Versicherungen sind dort oft die
          größten Positionen.
        </p>
        <p>
          <strong>Der sichere Weg ist die ISIN.</strong> Sie ist eindeutig, es gibt sie nur einmal,
          und mit ihr findest du dieselbe Anlage bei jedem Broker. Bei jeder Anlage in unserer
          Datenbank steht sie zum Kopieren daneben.
        </p>
        <Bild text="Der Name kann täuschen, die ISIN nicht. Sie gibt es nur einmal.">
          <IlluPruefung />
        </Bild>
      </>
    ),
  },
  {
    id: "was-bleibt",
    titel: "Was auch ein geprüfter ETF nicht abnimmt",
    inhalt: (
      <>
        <p>
          Ein Islamic-ETF nimmt dir die Prüfung von hunderten Firmen ab. Drei Dinge bleiben trotzdem
          bei dir.
        </p>
        <p>
          <strong>Das Verrechnungskonto.</strong> Der sauberste ETF nützt wenig, wenn dein Broker
          auf das Guthaben daneben Zinsen zahlt. Was du dort einstellen musst, steht im{" "}
          <Link to="/vergleich/depot" className="text-primary hover:underline">
            Depot-Vergleich
          </Link>
          .
        </p>
        <p>
          <strong>Die Reinigung der Erträge.</strong> Der kleine unreine Anteil verschwindet nicht
          dadurch, dass ein Gremium den Fonds freigegeben hat. Er wird ausgerechnet und
          weitergegeben.
        </p>
        <p>
          <strong>Das Risiko.</strong> Halal heißt erlaubt, nicht sicher. Ein Islamic-ETF schwankt
          genauso wie jeder andere Aktienfonds, und ein Verlust ist jederzeit möglich. Die Prüfung
          betrifft die Zulässigkeit, nicht die Wertentwicklung.
        </p>
      </>
    ),
  },
];

const faq = [
  {
    frage: "Wie funktioniert ein Halal-ETF?",
    antwort:
      "Er bildet einen Index nach, aus dem alle Firmen entfernt wurden, die die Prüfkriterien nicht erfüllen. Geprüft wird, womit die Firma ihr Geld verdient, wie hoch ihre verzinslichen Schulden sind und wie viel zinsbringend in der Bilanz liegt. Der Fonds selbst entscheidet nichts, er kauft die Liste ab.",
  },
  {
    frage: "Welche ETFs sind halal?",
    antwort:
      "Solche, deren Index nach Shariah-Kriterien gefiltert ist und deren Fondsführung selbst nichts Unzulässiges tut, etwa Wertpapierleihe oder synthetische Nachbildung. In unserer Datenbank stehen die geprüften Anlagen mit Kosten, Fondsgröße und der Stelle, die sie geprüft hat.",
  },
  {
    frage: "Ist ein ESG-ETF dasselbe wie ein Halal-ETF?",
    antwort:
      "Nein. ESG- und Nachhaltigkeitsfonds schließen oft Waffen, Tabak und Kohle aus, aber Banken und Versicherungen sind dort häufig unter den größten Positionen. Die Zinsgrenzwerte prüfen sie gar nicht.",
  },
  {
    frage: "Ist Wertpapierleihe bei einem Halal-ETF erlaubt?",
    antwort:
      "Darüber gibt es unterschiedliche Auffassungen. Kritisiert wird, dass die verliehenen Papiere häufig für Leerverkäufe gebraucht werden. Manche Islamic-ETFs schließen die Leihe deshalb ausdrücklich aus. Im Factsheet steht es unter Wertpapierleihe oder Securities Lending.",
  },
  {
    frage: "Muss ich die Erträge eines Halal-ETFs reinigen?",
    antwort:
      "Nach verbreiteter Auffassung ja. Auch geprüfte Firmen haben kleine Zinserträge, und der darauf entfallende Anteil wird ausgerechnet und weitergegeben, ohne dafür eine Belohnung zu erwarten. Manche Anbieter weisen den Prozentsatz jährlich aus.",
  },
  {
    frage: "Sind Halal-ETFs teurer als normale ETFs?",
    antwort:
      "Meist etwas. Die laufenden Kosten liegen häufig über denen eines breiten Standard-ETFs, weil das Screening und die Zertifizierung Geld kosten und die Fonds kleiner sind. Die genauen Werte stehen bei jeder Anlage in unserer Datenbank.",
  },
];

const HalalEtfs = () => (
  <>
    <Seo
      title="Halal ETFs: worauf du beim Fonds achtest | finanzmuslim"
      description="Ein Halal-ETF wird auf zwei Ebenen geprüft: der Index und der Fonds selbst. Vier Fragen zu Wertpapierleihe, Nachbildung, Reinigung und Zertifikat, dazu woran du einen echten erkennst."
      path="/wissen/halal-etfs"
    />
    <BeitragSeite
      titel="Halal ETFs: worauf du achtest"
      kurzGesagt={[
        "Ein ETF wird auf zwei Ebenen geprüft: der Index und der Fonds selbst.",
        "Vier Fragen an den Fonds: Leihe, Nachbildung, Reinigung, Zertifikat.",
        "Im Namen steht Islamic oder Shariah. Verlass dich trotzdem auf die ISIN.",
        "ESG ist nicht halal. Dort sind Banken oft die größten Positionen.",
        "Halal heißt erlaubt, nicht sicher. Das Risiko bleibt dasselbe.",
      ]}
      abschnitte={abschnitte}
      faq={faq}
      geprueftAm="16. August 2026"
      rechtshinweis="Dieser Beitrag dient ausschließlich zu Bildungszwecken, ist keine Fatwa und keine Anlageberatung. Genannte Anbieter und Indexhäuser sind Beispiele, keine Empfehlung. Zu Wertpapierleihe, synthetischer Nachbildung und zur Reinigung von Erträgen bestehen zwischen den Rechtsschulen und einzelnen Gremien unterschiedliche Auffassungen. Investitionen in Wertpapiere sind mit Risiken verbunden, bis hin zum Totalverlust."
      boxOben={{
        kategorie: "Anlagen",
        ueberschrift: "Geprüfte ETFs mit Kosten und Prüfstelle",
        linkZiel: "/halal-anlagen",
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
            <Link to="/wissen/sind-aktien-halal" className="text-primary hover:underline">
              Sind Aktien halal?
            </Link>{" "}
            erklärt die drei Grenzwerte, nach denen der Index filtert.
          </li>
          <li>
            <Link to="/wissen/sukuk" className="text-primary hover:underline">
              Sukuk statt Anleihe
            </Link>{" "}
            zeigt die zweite große Anlageklasse in der Datenbank.
          </li>
          <li>
            <Link to="/halal-anlagen" className="text-primary hover:underline">
              Die Halal-Datenbank
            </Link>{" "}
            listet jede geprüfte Anlage mit Kursverlauf und ISIN.
          </li>
        </ul>
      </section>
    </BeitragSeite>
  </>
);

export default HalalEtfs;
