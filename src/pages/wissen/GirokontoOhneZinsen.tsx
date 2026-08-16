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

/** Ein Handgriff, den man heute erledigen kann. */
const Schritt = ({
  nummer,
  titel,
  text,
}: {
  nummer: number;
  titel: string;
  text: string;
}) => (
  <div className="card-surface p-5">
    <p className="text-[17px] font-bold text-foreground">
      {nummer}. {titel}
    </p>
    <p className="mt-2 text-[16px] text-muted-foreground">{text}</p>
  </div>
);

const abschnitte: BeitragAbschnitt[] = [
  {
    id: "die-antwort",
    titel: "Ein Girokonto ist erlaubt. Vier Dinge daran sind es nicht",
    inhalt: (
      <>
        <p>
          Ein Girokonto ist eine Verwahrung. Du gibst dein Geld ab, die Bank hält es bereit, du
          holst es dir wieder. Daran ist nichts verboten, und ohne Konto ist ein Leben in
          Deutschland nicht möglich. Miete, Lohn, Versicherung, alles läuft darüber.
        </p>
        <p className="rounded-xl bg-hero p-5 text-[19px] font-bold text-foreground">
          Das Konto ist nicht das Problem. Vier Funktionen daran sind es.
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Der Dispo.</strong> Sobald du ins Minus rutschst, laufen Zinsen. Das ist der
            teuerste Kredit, den es gibt, oft im zweistelligen Bereich.
          </li>
          <li>
            <strong>Zinsen, die du bekommst.</strong> Manche Konten verzinsen Guthaben oder haben
            ein Tagesgeldkonto angehängt.
          </li>
          <li>
            <strong>Die Kreditkarte mit Teilzahlung.</strong> Oft standardmäßig aktiv. Wer nicht den
            vollen Betrag ausgleicht, zahlt Zinsen.
          </li>
          <li>
            <strong>Angehängte Produkte.</strong> Bausparvertrag, Ratenkredit, Lebensversicherung,
            die einem beim Beratungsgespräch mitverkauft werden.
          </li>
        </ul>
        <p>
          Die gute Nachricht: Alle vier lassen sich abstellen. Meistens in weniger als zehn Minuten,
          im Online-Banking, ohne mit jemandem zu sprechen.
        </p>
        <Bild text="Solange dein Konto im Plus steht und der Dispo bei null liegt, läuft kein Zins mit.">
          <IlluZins />
        </Bild>
      </>
    ),
  },
  {
    id: "was-tun",
    titel: "Was du heute umstellen kannst",
    inhalt: (
      <>
        <p>Der Reihe nach, das dauert zusammen keine Viertelstunde.</p>
        <div className="my-6 space-y-4">
          <Schritt
            nummer={1}
            titel="Dispo auf null setzen"
            text="Im Online-Banking unter den Kontoeinstellungen, oft heißt es Dispositionskredit oder Überziehungsrahmen. Auf null. Damit kannst du gar nicht mehr ins Minus rutschen, und die Frage stellt sich nie wieder."
          />
          <Schritt
            nummer={2}
            titel="Zinsgutschriften abstellen"
            text="Wo es geht, das Tagesgeldkonto kündigen oder die Verzinsung abwählen. Bekommst du trotzdem Zinsen gutgeschrieben, rechne sie zusammen und gib sie weg, ohne dafür eine Belohnung zu erwarten."
          />
          <Schritt
            nummer={3}
            titel="Kreditkarte auf volle Abrechnung stellen"
            text="Die Teilzahlung, oft Revolving genannt, ausschalten. Dann wird jeden Monat der gesamte Betrag abgebucht und es fallen keine Zinsen an. Eine Debitkarte, die sofort vom Konto abbucht, ist die einfachere Lösung."
          />
          <Schritt
            nummer={4}
            titel="Freistellungsauftrag prüfen"
            text="Er kostet nichts und ist nicht verboten. Er sorgt nur dafür, dass auf Erträge bis zum Freibetrag keine Steuer abgeht. Wichtig wird er, sobald du ein Depot hast."
          />
          <Schritt
            nummer={5}
            titel="Angehängte Verträge durchsehen"
            text="Bausparvertrag, Lebensversicherung, Riester. Was davon läuft, gehört auf den Prüfstand. Die Vertrags-Ampel ordnet sie ein."
          />
        </div>
      </>
    ),
  },
  {
    id: "die-grosse-frage",
    titel: "Darf ich überhaupt bei einer normalen Bank sein?",
    inhalt: (
      <>
        <p>
          Diese Frage steht hinter allen anderen. Eine deutsche Bank vergibt Kredite gegen Zinsen,
          das ist ihr Geschäft. Wer dort ein Konto hat, ist Teil dieses Systems, wenn auch am Rand.
        </p>
        <p>
          <strong>Die verbreitete Auffassung</strong> ist, dass ein Girokonto zur Abwicklung des
          Alltags zulässig ist, solange du selbst keinen Zinsvertrag abschließt und keine Zinsen
          vereinnahmst. Begründet wird das mit der Notwendigkeit: Ohne Konto gibt es keinen Lohn,
          keine Wohnung, keine Versicherung. Was unvermeidbar ist, wird milder beurteilt.
        </p>
        <p>
          <strong>Eine strengere Auffassung</strong> sagt, man solle auch das meiden, wo immer eine
          Alternative besteht. Nach dieser Sicht ist es eine Frage der Anstrengung, nicht der
          Erlaubnis.
        </p>
        <p>
          Beide Seiten sind sich in einem Punkt einig: Was du selbst unterschreibst, verantwortest
          du. Der Dispo, der Kredit, das Festgeld. Da hört die Notwendigkeit auf.
        </p>
      </>
    ),
  },
  {
    id: "islamische-bank",
    titel: "Gibt es eine islamische Bank in Deutschland?",
    inhalt: (
      <>
        <p>
          Ja, eine. Die <strong>KT Bank AG</strong> mit Sitz in Frankfurt, eine Tochter der
          türkischen Kuveyt Türk, hat 2015 die deutsche Vollbanklizenz erhalten und war damit die
          erste Bank dieser Art im Euroraum. Sie arbeitet nach dem Handelsmodell: Statt Geld zu
          verleihen, kauft sie Waren und verkauft sie mit einem Aufschlag weiter.
        </p>
        <p>
          Einlagen sind dort bis 100.000 Euro über die deutsche Einlagensicherung gedeckt, wie bei
          jeder anderen deutschen Bank auch.
        </p>
        <p>
          <strong>Was du wissen solltest, bevor du wechselst:</strong> Die BaFin hat im Juli 2026
          Auflagen und Maßnahmen gegen die Bank verhängt, wegen Mängeln in der Geldwäscheprävention.
          Das steht in mehreren Presseberichten und betrifft nicht das islamische Geschäftsmodell,
          sondern die internen Kontrollen. Es ist trotzdem eine Information, die man haben sollte,
          bevor man sein Gehaltskonto umzieht.
        </p>
        <p>
          Die Bank ist außerdem sehr klein, gemessen an der Bilanzsumme unter den kleinsten in
          Deutschland. Das Filialnetz ist dünn, und beim Bedienkomfort liegt sie hinter den großen
          Anbietern.
        </p>
        <p>
          <strong>Unser Stand:</strong> Wir haben die KT Bank nicht selbst geprüft und empfehlen
          sie deshalb nicht. Wenn du dich dafür interessierst, sieh dir die Bedingungen und den
          aktuellen Stand selbst an.
        </p>
      </>
    ),
  },
  {
    id: "was-ein-konto-nicht-kann",
    titel: "Was ein Girokonto nicht kann",
    inhalt: (
      <>
        <p>
          Ein zinsfreies Girokonto löst das Zinsproblem. Es löst nicht das eigentliche Problem, und
          das ist ein anderes: <strong>Geld auf dem Konto wird jedes Jahr weniger wert.</strong>
        </p>
        <p>
          Bei 2 Prozent Inflation sind aus 10.000 Euro nach zehn Jahren noch etwa 8.200 Euro
          Kaufkraft geworden, ohne dass du einen Cent ausgegeben hast. Das ist der Preis fürs
          Nichtstun, und er ist höher, als die meisten denken.
        </p>
        <p>
          Der Ausweg führt nicht über Zinsen, sondern über Sachwerte. Anteile an Firmen, Gold,
          Immobilien. Alles davon ist zugänglich, ohne dass irgendwo ein Zins mitläuft. Dafür
          brauchst du ein Depot, und das ist etwas anderes als ein Konto.
        </p>
        <Bild text="Auf dem Konto liegt Geld. Im Depot liegen Anteile. Der Unterschied entscheidet, ob dein Geld weniger wert wird oder nicht.">
          <IlluDepot />
        </Bild>
      </>
    ),
  },
];

const faq = [
  {
    frage: "Ist ein Girokonto bei einer normalen Bank haram?",
    antwort:
      "Nach der verbreiteten Auffassung nicht, solange du selbst keine Zinsen zahlst und keine vereinnahmst. Ein Konto ist in Deutschland für Lohn, Miete und Versicherungen unvermeidbar. Was du selbst unterschreibst, etwa einen Dispo oder ein Festgeld, verantwortest du hingegen selbst.",
  },
  {
    frage: "Was mache ich mit Zinsen, die mir gutgeschrieben wurden?",
    antwort:
      "Die verbreitete Empfehlung ist, sie nicht zu verbrauchen, sondern auszurechnen und wegzugeben, ohne dafür eine Belohnung zu erwarten. Sie zählen nicht als Zakat und nicht als Sadaqa im üblichen Sinn. Parallel die Verzinsung abstellen, damit nichts mehr dazukommt.",
  },
  {
    frage: "Gibt es ein islamisches Girokonto in Deutschland?",
    antwort:
      "Die KT Bank AG in Frankfurt arbeitet nach islamischen Grundsätzen und hat seit 2015 eine deutsche Vollbanklizenz. Wir haben sie nicht geprüft und empfehlen sie nicht. Zu beachten ist, dass die BaFin im Juli 2026 Auflagen wegen Mängeln in der Geldwäscheprävention verhängt hat.",
  },
  {
    frage: "Ist eine Kreditkarte erlaubt?",
    antwort:
      "Eine Kreditkarte, bei der der volle Betrag jeden Monat abgebucht wird und keine Zinsen anfallen, wird von vielen als unproblematisch angesehen. Die Teilzahlungsfunktion arbeitet mit Zinsen und gehört zu den klaren Fällen. Am einfachsten ist eine Debitkarte, die sofort vom Konto abbucht.",
  },
  {
    frage: "Sollte ich mein Geld dann lieber bar zu Hause haben?",
    antwort:
      "Nein. Bargeld zu Hause verliert genauso an Wert und ist zusätzlich Diebstahl und Feuer ausgesetzt. Außerdem ist es nicht versichert. Das Konto ist der sicherere Ort, es ist nur nicht der richtige Ort für Geld, das du längere Zeit nicht brauchst.",
  },
];

const GirokontoOhneZinsen = () => (
  <>
    <Seo
      title="Girokonto ohne Zinsen: Was du in zehn Minuten umstellst | finanzmuslim"
      description="Ein Girokonto ist erlaubt. Problematisch sind Dispo, Guthabenzinsen, Kreditkarten-Teilzahlung und angehängte Verträge. Fünf Handgriffe, dazu der Stand zur KT Bank in Deutschland."
      path="/wissen/girokonto-ohne-zinsen"
      jsonLd={beitragJsonLd({
        titel: "Dispo auf null setzen",
        beschreibung: "Ein Girokonto ist erlaubt. Problematisch sind Dispo, Guthabenzinsen, Kreditkarten-Teilzahlung und angehängte Verträge. Fünf Handgriffe, dazu der Stand zur KT Bank in Deutschland.",
        path: "/wissen/girokonto-ohne-zinsen",
        geprueftAm: "16. August 2026",
        faq,
      })}
    />
    <BeitragSeite
      titel="Girokonto ohne Zinsen"
      kurzGesagt={[
        "Ein Girokonto ist erlaubt. Vier Funktionen daran sind das Problem.",
        "Dispo auf null setzen ist der wichtigste einzelne Handgriff.",
        "Kreditkarte auf volle Abrechnung stellen, Teilzahlung ausschalten.",
        "Zinsgutschriften abstellen, was schon da ist, ausrechnen und weggeben.",
        "Ein zinsfreies Konto schützt nicht vor Inflation. Dafür brauchst du ein Depot.",
      ]}
      abschnitte={abschnitte}
      faq={faq}
      geprueftAm="16. August 2026"
      rechtshinweis="Dieser Beitrag gibt bekannte Positionen wieder und dient ausschließlich zu Bildungszwecken. Er ist keine Fatwa und ersetzt weder die Auskunft eines Gelehrten noch eine Rechts- oder Anlageberatung. Angaben zur KT Bank AG beruhen auf öffentlich zugänglichen Quellen, Stand August 2026, und sind keine Empfehlung. Innerhalb der Rechtsschulen gibt es zu einzelnen Punkten abweichende Auffassungen, besonders zur Frage der Kontoführung bei konventionellen Banken."
      boxOben={{
        kategorie: "Girokonto",
        ueberschrift: "Konten ohne Dispo-Zwang im Vergleich",
        linkZiel: "/vergleiche",
      }}
      boxMitte={{
        kategorie: "Depot",
        ueberschrift: "Damit dein Geld nicht jedes Jahr weniger wert wird",
        linkZiel: "/vergleich/depot",
      }}
    >
      <section className="card-surface p-6">
        <h2 className="text-[19px] font-bold text-foreground">Passt dazu</h2>
        <ul className="mt-3 space-y-2 text-[16px]">
          <li>
            <Link to="/wissen/zinsen-im-islam" className="text-primary hover:underline">
              Zinsen im Islam
            </Link>{" "}
            erklärt, was genau verboten ist und was ausdrücklich nicht.
          </li>
          <li>
            <Link to="/vorlagen/vertrags-ampel" className="text-primary hover:underline">
              Die Vertrags-Ampel
            </Link>{" "}
            ordnet Girokonto, Kreditkarte, Dispo und neun weitere Verträge ein.
          </li>
          <li>
            <Link to="/wissen/ratenzahlung-haram" className="text-primary hover:underline">
              Ist Ratenzahlung haram?
            </Link>{" "}
            zeigt, worauf du an der Kasse achten musst.
          </li>
        </ul>
      </section>
    </BeitragSeite>
  </>
);

export default GirokontoOhneZinsen;
