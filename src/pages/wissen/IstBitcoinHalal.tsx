import Seo from "@/components/Seo";
import BeitragSeite, { type BeitragAbschnitt } from "@/components/BeitragSeite";
import { IlluHandel } from "@/components/illu";
import { Link } from "react-router-dom";

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
          Es gibt keine einheitliche Antwort. Gelehrte sind sich bei Bitcoin uneins, und das ist
          keine Ausrede, sondern der ehrliche Stand.
        </p>
        <p>
          Es gibt Gutachten, die Bitcoin als zulässig einordnen. Das Shariyah Review Bureau aus
          Bahrain hat 2022 ein solches Gutachten vorgelegt, und für Ether gibt es ein Shariah White
          Paper von Amanie Advisors zusammen mit der Ethereum Foundation aus dem Jahr 2019. Es gibt
          aber ebenso Gremien, die ablehnen, unter anderem Behörden in einigen muslimischen Ländern.
        </p>
        <p>
          Worüber sich fast alle einig sind: Wenn Krypto, dann nur ein kleiner Teil des Vermögens,
          nur mit echtem Besitz, und ohne Hebel.
        </p>
      </>
    ),
  },
  {
    id: "streitpunkt",
    titel: "Worüber genau gestritten wird",
    inhalt: (
      <>
        <p>
          Die Frage ist nicht, ob die Technik erlaubt ist. Die Frage ist, ob Bitcoin überhaupt
          Eigentum im islamischen Sinne ist, also etwas, das man besitzen und tauschen kann.
        </p>
        <p>
          <strong>Wer dafür ist</strong>, sagt: Es ist knapp, es ist übertragbar, Menschen messen ihm
          Wert bei und akzeptieren es als Gegenleistung. Damit erfüllt es die Merkmale eines
          Vermögenswerts. Dass man es nicht anfassen kann, spielt keine Rolle, denn Rechte und
          Lizenzen kann man auch nicht anfassen.
        </p>
        <p>
          <strong>Wer dagegen ist</strong>, sagt: Dahinter steht kein realer Gegenwert, keine
          Firma, kein Metall, kein Staat. Der Preis entsteht nur aus der Erwartung anderer. Und
          diese Schwankungen kommen dem nahe, was mit Gharar gemeint ist, also übermäßiger
          Unsicherheit.
        </p>
        <Bild text="Beim Kauf tauschst du Geld gegen etwas, das du danach besitzt. Ob eine Kryptowährung dieses Etwas ist, darüber gehen die Meinungen auseinander.">
          <IlluHandel />
        </Bild>
      </>
    ),
  },
  {
    id: "unstrittig-verboten",
    titel: "Was unstrittig nicht geht",
    inhalt: (
      <>
        <p>
          Unabhängig davon, welcher Auffassung du folgst, sind sich die Gelehrten bei diesen vier
          Punkten einig.
        </p>
        <p>
          <strong>Hebel und Futures.</strong> Wer mit geliehenem Geld auf Kursrichtungen wettet,
          verlässt jede Diskussion über Bitcoin. Das ist Spekulation mit fremdem Geld und fällt unter
          Gharar und Maysir zugleich.
        </p>
        <p>
          <strong>Lending und feste Zinsen.</strong> Wenn dir eine Plattform garantiert, dass aus
          hundert Coins in einem Jahr hundertfünf werden, ist das ein Zinsversprechen. Der Name
          ändert daran nichts.
        </p>
        <p>
          <strong>Staking mit garantiertem Ertrag.</strong> Hier gehen die Meinungen weiter
          auseinander, aber sobald ein fester Ertrag zugesagt wird, gilt derselbe Einwand wie beim
          Lending.
        </p>
        <p>
          <strong>Coins mit verbotenem Zweck.</strong> Ein Token, der an ein Glücksspielprojekt oder
          eine Zinsplattform gebunden ist, ist unabhängig von der Technik ausgeschlossen.
        </p>
      </>
    ),
  },
  {
    id: "wenn-dann",
    titel: "Wenn du dich dafür entscheidest",
    inhalt: (
      <>
        <p>Dann gelten drei Regeln, die aus den Gutachten immer wieder hervorgehen.</p>
        <p>
          <strong>Echter Besitz.</strong> Du musst die Coins wirklich haben, nicht nur einen
          Anspruch darauf. Produkte, die den Kurs nur nachbilden, ohne dass irgendwo Coins liegen,
          erfüllen das nicht.
        </p>
        <p>
          <strong>Kleiner Anteil.</strong> Krypto schwankt stärker als alles andere. In unserer
          Anlagen-Übersicht stehen Bitcoin und Ether auf ein Jahr deutlich im Minus, während Gold und
          Aktien zugelegt haben. Genau deshalb steht Krypto dort in einem eigenen Block und nicht in
          der Haupttabelle.
        </p>
        <p>
          <strong>Zakat nicht vergessen.</strong> Wenn du Krypto als Vermögen hältst, zählt der Wert
          zum zakatpflichtigen Vermögen, genau wie Bargeld oder Aktien.
        </p>
      </>
    ),
  },
  {
    id: "ehrlich",
    titel: "Der ehrliche Schluss",
    inhalt: (
      <>
        <p>
          Niemand kann dir hier abnehmen, welcher Auffassung du folgst. Was du tun kannst: die
          Gutachten selbst lesen, statt dich auf ein Video zu verlassen, und im Zweifel jemanden
          fragen, dem du vertraust.
        </p>
        <p>
          Und eine Beobachtung aus der Praxis: Die meisten, die nach Krypto fragen, haben noch kein
          Depot und keine Rücklage. Wer beim Aufbau ganz vorne steht, fährt fast immer besser damit,
          zuerst das Fundament zu legen, statt mit dem schwankendsten Baustein anzufangen.
        </p>
      </>
    ),
  },
];

const faq = [
  {
    frage: "Ist Bitcoin jetzt halal oder haram?",
    antwort:
      "Beides wird vertreten. Es gibt Gutachten, die Bitcoin als zulässiges Vermögen einordnen, unter anderem vom Shariyah Review Bureau aus dem Jahr 2022. Es gibt ebenso Gremien, die ablehnen. Wer eine verbindliche Antwort für sich sucht, sollte einen Gelehrten fragen, dem er folgt.",
  },
  {
    frage: "Was ist mit Ether?",
    antwort:
      "Für Ether gibt es ein Shariah White Paper von Amanie Advisors zusammen mit der Ethereum Foundation aus dem Jahr 2019. Die Einordnung fällt ähnlich aus wie bei Bitcoin, mit demselben Vorbehalt: kein Staking mit garantiertem Ertrag.",
  },
  {
    frage: "Sind Krypto-ETPs eine Lösung?",
    antwort:
      "Nur wenn die Coins wirklich hinterlegt sind und dir zustehen. Produkte, die den Kurs lediglich nachbilden, erfüllen die Anforderung an echten Besitz nicht.",
  },
  {
    frage: "Muss ich auf Krypto Zakat zahlen?",
    antwort:
      "Wenn du es als Vermögen hältst, ja. Der heutige Wert zählt zum zakatpflichtigen Vermögen. In unserem Zakat-Rechner gibt es dafür ein eigenes Feld.",
  },
];

const IstBitcoinHalal = () => (
  <>
    <Seo
      title="Ist Bitcoin halal oder haram? Der ehrliche Stand | finanzmuslim"
      description="Zu Bitcoin gibt es Gutachten in beide Richtungen. Worüber genau gestritten wird, was unstrittig nicht geht und welche drei Regeln gelten, wenn du dich dafür entscheidest."
      path="/wissen/ist-bitcoin-halal"
    />
    <BeitragSeite
      titel="Ist Bitcoin halal oder haram?"
      kurzGesagt={[
        "Es gibt keine einheitliche Antwort. Gelehrte sind sich uneins, und das ist der ehrliche Stand.",
        "Für Bitcoin liegt ein Gutachten des Shariyah Review Bureau von 2022 vor, für Ether eines von Amanie Advisors von 2019.",
        "Unstrittig ausgeschlossen sind Hebel, Futures, Lending mit festem Ertrag und Coins mit verbotenem Zweck.",
        "Wenn Krypto, dann mit echtem Besitz und nur als kleiner Teil des Vermögens.",
        "Der Wert zählt zum zakatpflichtigen Vermögen.",
      ]}
      abschnitte={abschnitte}
      faq={faq}
      geprueftAm="16. August 2026"
      rechtshinweis="Dieser Beitrag gibt bekannte Positionen wieder und dient ausschließlich zu Bildungszwecken. Er ist keine Fatwa und stellt keine Anlageberatung dar. Genannte Gutachten sind Belege für die jeweilige Position, keine Empfehlung zum Kauf. Kryptowährungen schwanken stark, ein Totalverlust ist möglich. Innerhalb der Rechtsschulen und zwischen den Gremien gibt es deutlich abweichende Auffassungen."
      boxOben={{
        kategorie: "Depot",
        ueberschrift: "Erst das Fundament, dann die Beimischung",
        linkZiel: "/vergleich/depot",
      }}
      boxMitte={{
        kategorie: "Halal-Screening-Apps",
        ueberschrift: "Werkzeuge, die für dich prüfen",
        linkZiel: "/vergleiche",
      }}
    >
      <section className="card-surface p-6">
        <h2 className="text-[19px] font-bold text-foreground">Passt dazu</h2>
        <ul className="mt-3 space-y-2 text-[16px]">
          <li>
            <Link to="/halal-anlagen" className="text-primary hover:underline">
              Die Anlagen-Datenbank
            </Link>{" "}
            zeigt Bitcoin und Ether mit Kursverlauf, getrennt von der Haupttabelle.
          </li>
          <li>
            <Link to="/zakat-rechner" className="text-primary hover:underline">
              Der Zakat-Rechner
            </Link>{" "}
            hat ein eigenes Feld für Krypto.
          </li>
        </ul>
      </section>
    </BeitragSeite>
  </>
);

export default IstBitcoinHalal;
