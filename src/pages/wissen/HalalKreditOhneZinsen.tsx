import Seo, { beitragJsonLd } from "@/components/Seo";
import BeitragSeite, { type BeitragAbschnitt } from "@/components/BeitragSeite";
import { IlluHandel, IlluZins } from "@/components/illu";
import { Link } from "react-router-dom";

const Bild = ({ children, text }: { children: React.ReactNode; text: string }) => (
  <figure className="my-6">
    <div className="overflow-hidden rounded-2xl">{children}</div>
    <figcaption className="mt-2 text-[14px] text-muted-foreground">{text}</figcaption>
  </figure>
);

/** Ein Vertragstyp, kurz erklärt. Vier davon reichen, um alles einzuordnen. */
const Vertrag = ({
  name,
  untertitel,
  text,
}: {
  name: string;
  untertitel: string;
  text: string;
}) => (
  <div className="card-surface p-5">
    <p className="text-[17px] font-bold text-foreground">{name}</p>
    <p className="mt-0.5 text-[14px] text-muted-foreground">{untertitel}</p>
    <p className="mt-2 text-[16px] text-muted-foreground">{text}</p>
  </div>
);

const abschnitte: BeitragAbschnitt[] = [
  {
    id: "die-antwort",
    titel: "Einen halal Kredit gibt es nicht",
    inhalt: (
      <>
        <p>
          Ein Kredit ist Geld gegen Geld. Du bekommst 10.000 Euro und gibst 11.000 Euro zurück. Der
          Aufschlag ist der Preis für Zeit, und genau der ist Riba. Daran ändert kein Name etwas.
        </p>
        <p className="rounded-xl bg-hero p-5 text-[19px] font-bold text-foreground">
          Es gibt keinen zinsfreien Kredit. Es gibt einen anderen Vertrag, der dasselbe Problem
          löst.
        </p>
        <p>
          Der Unterschied ist nicht kosmetisch. Beim Kredit verleiht die Bank Geld und trägt kein
          Risiko: Ob dein Auto fährt oder dein Laden läuft, ist ihr gleich, die Rate kommt so oder
          so. Beim erlaubten Weg kauft, besitzt oder beteiligt sie sich. Sie hat etwas in der Hand,
          das kaputtgehen kann, und darf deshalb daran verdienen.
        </p>
        <p>
          Wer nach „halal Kredit“ oder „faizsiz kredi“ sucht, sucht in Wahrheit nach diesem zweiten
          Weg. Vier Verträge decken fast alle Fälle ab.
        </p>
        <Bild text="Beim Kredit fließt Geld gegen mehr Geld. Beim Handelsvertrag wechselt eine Sache den Besitzer, und der Aufschlag ist der Preis dafür.">
          <IlluHandel />
        </Bild>
      </>
    ),
  },
  {
    id: "die-vier-vertraege",
    titel: "Die vier Verträge, die einen Kredit ersetzen",
    inhalt: (
      <>
        <p>
          Die Namen sind arabisch, die Sache ist einfach. Wer sie einmal kennt, erkennt sofort, was
          ihm ein Anbieter da vorlegt.
        </p>
        <div className="my-6 space-y-4">
          <Vertrag
            name="Murabaha"
            untertitel="Kaufen und mit Aufschlag weiterverkaufen"
            text="Die Bank kauft die Sache selbst, wird kurz Eigentümerin und verkauft sie dir zu einem festen Gesamtpreis. Du zahlst in Raten. Der Aufschlag steht von Anfang an fest und wächst nicht, wenn du dir Zeit lässt. Das ist der häufigste Weg bei Auto und Ware."
          />
          <Vertrag
            name="Idschara"
            untertitel="Mieten, am Ende übernehmen"
            text="Die Bank kauft die Sache und vermietet sie dir. Du zahlst Miete, nicht Zins. Am Ende geht das Eigentum auf dich über. Der Unterschied zum normalen Leasing steckt im Kleingedruckten, vor allem bei Verzugsgebühren und Versicherung."
          />
          <Vertrag
            name="Muscharaka mutanaqisa"
            untertitel="Gemeinsam kaufen, Anteil für Anteil übernehmen"
            text="Ihr kauft zusammen, etwa eine Wohnung. Du wohnst darin und zahlst für den Teil, der noch nicht dir gehört, Miete. Parallel kaufst du Anteile nach, bis alles dir gehört. Das ist der übliche Weg bei Immobilien."
          />
          <Vertrag
            name="Qard hasan"
            untertitel="Das zinsfreie Darlehen unter Menschen"
            text="Geliehen wird genau der Betrag, zurück kommt genau der Betrag. Kein Aufschlag, keine Gebühr, die verdeckt einer wäre. Banken bieten das nicht an, es rechnet sich für sie nicht. In Familien und Gemeinden ist es der Normalfall."
          />
        </div>
        <p>
          <strong>Woran du einen umetikettierten Kredit erkennst:</strong> Die Schuld wächst, wenn
          du später zahlst. Genau das ist der Prüfstein. Bei Murabaha und Idschara steht der
          Gesamtpreis fest, egal wie lange du brauchst. Eine Verzugsgebühr, die den Betrag erhöht
          und beim Anbieter bleibt, ist Zins mit anderem Namen.
        </p>
      </>
    ),
  },
  {
    id: "in-deutschland",
    titel: "Was es in Deutschland wirklich gibt",
    inhalt: (
      <>
        <p>
          Hier wird es dünn. Der Markt ist klein, und es hilft niemandem, ihn größer zu reden, als
          er ist.
        </p>
        <p>
          <strong>Eine Bank mit Vollbanklizenz.</strong> Die KT Bank AG in Frankfurt, Tochter der
          türkischen Kuveyt Türk, arbeitet seit 2015 nach islamischen Grundsätzen und bietet
          Finanzierungen nach dem Handelsmodell an. Wir haben sie nicht selbst geprüft und
          empfehlen sie nicht. Was du vor einem Wechsel wissen solltest, steht im Beitrag zum{" "}
          <Link to="/wissen/girokonto-ohne-zinsen" className="text-primary hover:underline">
            Girokonto ohne Zinsen
          </Link>
          .
        </p>
        <p>
          <strong>Der eigene Kreis.</strong> Familie, Freunde, die Gemeinde. Für kleinere Beträge
          ist das der schnellste und sauberste Weg. Schreib den Betrag und die Rückzahlung
          trotzdem auf. Das ist kein Misstrauen, es ist ausdrücklich empfohlen und erspart später
          jeden Streit.
        </p>
        <p>
          <strong>Der Arbeitgeber.</strong> Viele Betriebe geben einen Gehaltsvorschuss oder ein
          zinsloses Arbeitgeberdarlehen. Beides ist ein Qard hasan, auch wenn es niemand so nennt.
          Es steht selten im Intranet, es lohnt sich zu fragen.
        </p>
        <p>
          <strong>Ratenkauf beim Händler.</strong> Eine Nullprozentfinanzierung ist ein Sonderfall,
          über den Gelehrte uneins sind. Worauf du achten musst, steht in{" "}
          <Link to="/wissen/ratenzahlung-haram" className="text-primary hover:underline">
            Ist Ratenzahlung haram?
          </Link>
        </p>
        <p>
          Was es <strong>nicht</strong> gibt: einen breiten Markt islamischer Baufinanzierer, eine
          islamische Autobank mit Filialnetz, oder eine App, die dir in fünf Minuten einen
          konformen Kredit gibt. Wer damit wirbt, sollte den Vertrag zeigen, nicht das Etikett.
        </p>
      </>
    ),
  },
  {
    id: "notlage",
    titel: "Die Notlage und wo sie endet",
    inhalt: (
      <>
        <p>
          Es gibt die Regel, dass eine echte Notlage Verbotenes im nötigen Maß erlaubt. Sie ist
          keine Hintertür, sie ist ein Notausgang, und die beiden werden oft verwechselt.
        </p>
        <p>
          <strong>Was eine Notlage ist:</strong> Es geht um Leben, Gesundheit, ein Dach über dem
          Kopf. Eine Operation, die sonst nicht stattfindet. Eine Miete, ohne die die Familie auf
          der Straße steht.
        </p>
        <p>
          <strong>Was keine ist:</strong> Ein größeres Auto, eine schönere Küche, eine Hochzeit,
          die dem Vergleich standhalten soll, ein Geschäft, das man auch später aufmachen kann.
          Wunsch und Not sind nicht dasselbe, auch wenn sich beides gleich dringend anfühlt.
        </p>
        <p>
          Und selbst dort, wo die Regel greift, greift sie nur so weit wie nötig und nur so lange
          wie nötig. Das ist der Teil, der gern überlesen wird.
        </p>
        <p>
          Wer wirklich in dieser Lage ist, sollte nicht im Internet nach einer Erlaubnis suchen,
          sondern seinen Fall einem Gelehrten schildern, dem er vertraut.
        </p>
      </>
    ),
  },
  {
    id: "ohne-vertrag",
    titel: "Der Weg, der ganz ohne Vertrag auskommt",
    inhalt: (
      <>
        <p>
          Die unbeliebteste Antwort ist meistens die richtige: erst sparen, dann kaufen. Sie ist
          langsam, sie kostet nichts, und sie führt zu keinem Vertrag, den irgendjemand prüfen muss.
        </p>
        <p>
          Ein Beispiel. Ein Auto für 12.000 Euro. Über eine Finanzierung mit 6 Prozent auf vier
          Jahre zahlst du rund 1.500 Euro Zinsen obendrauf. Legst du stattdessen 24 Monate lang 500
          Euro zur Seite, hast du dasselbe Auto und die 1.500 Euro noch. Der Unterschied ist die
          Wartezeit.
        </p>
        <p>
          Was in dieser Wartezeit mit dem Ersparten passiert, ist die zweite Frage. Auf dem Konto
          verliert es jedes Jahr an Kaufkraft. Deshalb gehört zu einem Sparziel ein Ort, an dem das
          Geld nicht schrumpft, ohne dass irgendwo ein Zins mitläuft.
        </p>
        <Bild text="Ohne Kredit gibt es keinen Zins, den man prüfen müsste. Der Preis dafür ist Wartezeit, nicht Geld.">
          <IlluZins />
        </Bild>
      </>
    ),
  },
];

const faq = [
  {
    frage: "Gibt es einen halal Kredit?",
    antwort:
      "Nein, nicht im Wortsinn. Ein Kredit ist Geld gegen mehr Geld, und der Aufschlag ist Riba. Was es gibt, sind andere Verträge, die dasselbe Ziel erreichen: Die Bank kauft die Sache und verkauft oder vermietet sie dir mit einem festen Aufschlag, oder ihr kauft gemeinsam und du übernimmst Anteil für Anteil.",
  },
  {
    frage: "Was ist Murabaha?",
    antwort:
      "Ein Kaufvertrag mit Aufschlag. Die Bank kauft die Ware selbst, wird kurz Eigentümerin und verkauft sie dir zu einem festen Gesamtpreis in Raten weiter. Der Preis steht von Anfang an fest und steigt nicht, wenn die Rückzahlung länger dauert. Genau das unterscheidet ihn vom Kredit.",
  },
  {
    frage: "Gibt es eine islamische Bank für Kredite in Deutschland?",
    antwort:
      "Die KT Bank AG in Frankfurt hat seit 2015 eine deutsche Vollbanklizenz und arbeitet nach dem Handelsmodell. Wir haben sie nicht geprüft und empfehlen sie nicht. Einen breiten Markt islamischer Finanzierer gibt es in Deutschland nicht.",
  },
  {
    frage: "Ist ein zinsloses Darlehen von der Familie erlaubt?",
    antwort:
      "Ja, das ist der klassische Fall des Qard hasan und gilt als verdienstvoll. Zurückgegeben wird genau der geliehene Betrag, ohne Aufschlag und ohne Gebühr. Halte Betrag und Rückzahlung schriftlich fest, das ist ausdrücklich empfohlen.",
  },
  {
    frage: "Darf ich einen Kredit aufnehmen, wenn ich in Not bin?",
    antwort:
      "Die Regel zur Notlage erlaubt Verbotenes im nötigen Maß, wenn Leben, Gesundheit oder Obdach auf dem Spiel stehen. Sie gilt nur so weit und so lange wie nötig. Ein größeres Auto oder eine teurere Hochzeit fallen nicht darunter. Schilder deinen konkreten Fall einem Gelehrten deines Vertrauens.",
  },
  {
    frage: "Woran erkenne ich einen umetikettierten Kredit?",
    antwort:
      "Daran, dass die Schuld wächst, wenn du später zahlst. Bei einem echten Handels- oder Mietvertrag steht der Gesamtpreis fest. Eine Verzugsgebühr, die den Betrag erhöht und beim Anbieter bleibt, ist Zins unter anderem Namen.",
  },
];

const HalalKreditOhneZinsen = () => (
  <>
    <Seo
      title="Halal Kredit ohne Zinsen: Welche Verträge es wirklich gibt | finanzmuslim"
      description="Einen zinsfreien Kredit gibt es nicht. Es gibt vier andere Verträge: Murabaha, Idschara, Muscharaka und Qard hasan. Was davon in Deutschland verfügbar ist und woran du einen umetikettierten Kredit erkennst."
      path="/wissen/halal-kredit-ohne-zinsen"
      jsonLd={beitragJsonLd({
        titel: "Kaufen und mit Aufschlag weiterverkaufen",
        beschreibung: "Einen zinsfreien Kredit gibt es nicht. Es gibt vier andere Verträge: Murabaha, Idschara, Muscharaka und Qard hasan. Was davon in Deutschland verfügbar ist und woran du einen umetikettierten Kredit erkennst.",
        path: "/wissen/halal-kredit-ohne-zinsen",
        datePublished: "16. August 2026",
        faq,
      })}
    />
    <BeitragSeite
      titel="Halal Kredit ohne Zinsen"
      kurzGesagt={[
        "Einen zinsfreien Kredit gibt es nicht. Es gibt einen anderen Vertrag.",
        "Vier Formen decken fast alles ab: Murabaha, Idschara, Muscharaka, Qard hasan.",
        "Der Prüfstein: Wächst die Schuld, wenn du später zahlst, ist es Zins.",
        "In Deutschland ist der Markt klein. Eine Bank, der eigene Kreis, der Arbeitgeber.",
        "Der Weg ohne jeden Vertrag heißt erst sparen, dann kaufen.",
      ]}
      abschnitte={abschnitte}
      faq={faq}
      datePublished="16. August 2026"
      rechtshinweis="Dieser Beitrag gibt bekannte Positionen wieder und dient ausschließlich zu Bildungszwecken. Er ist keine Fatwa und ersetzt weder die Auskunft eines Gelehrten noch eine Rechts-, Steuer- oder Anlageberatung. Zur Ausgestaltung einzelner Vertragsformen und zur Reichweite der Notlagenregel bestehen innerhalb der Rechtsschulen unterschiedliche Auffassungen. Angaben zur KT Bank AG beruhen auf öffentlich zugänglichen Quellen, Stand August 2026, und sind keine Empfehlung."
      boxOben={{
        kategorie: "Vorlage",
        ueberschrift: "Zwölf Verträge, grün, gelb oder rot einsortiert",
        linkZiel: "/vorlagen/vertrags-ampel",
        text: "Grün, gelb oder rot für zwölf Verträge aus dem Alltag.",
        knopf: "Zur Vertrags-Ampel",
      }}
      boxMitte={{
        kategorie: "Depot",
        ueberschrift: "Damit dein Erspartes nicht jedes Jahr weniger wert wird",
        linkZiel: "/vergleich/depot",
      }}
    >
      <section className="card-surface p-6">
        <h2 className="text-[19px] font-bold text-foreground">Passt dazu</h2>
        <ul className="mt-3 space-y-2 text-[16px]">
          <li>
            <Link to="/wissen/haus-kaufen-ohne-zinsen" className="text-primary hover:underline">
              Haus kaufen ohne Zinsen
            </Link>{" "}
            geht denselben Weg für den größten Posten im Leben durch.
          </li>
          <li>
            <Link to="/wissen/zinsen-im-islam" className="text-primary hover:underline">
              Zinsen im Islam
            </Link>{" "}
            erklärt, was genau verboten ist und was ausdrücklich nicht.
          </li>
          <li>
            <Link to="/wissen/ist-leasing-haram" className="text-primary hover:underline">
              Ist Leasing haram?
            </Link>{" "}
            prüft den Vertrag, der Idschara am nächsten kommt.
          </li>
        </ul>
      </section>
    </BeitragSeite>
  </>
);

export default HalalKreditOhneZinsen;
