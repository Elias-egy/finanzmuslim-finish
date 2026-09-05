import Seo, { beitragJsonLd } from "@/components/Seo";
import BeitragSeite, { type BeitragAbschnitt, type BeitragFrage } from "@/components/BeitragSeite";
import { IlluMurabaha, IlluZins } from "@/components/illu";
import {
  B,
  Begriff,
  Beispiel,
  Bild,
  Checkliste,
  Frage,
  Hinweis,
  L,
  Merksatz,
  PasstDazu,
  Schritte,
} from "@/components/beitrag";

const abschnitte: BeitragAbschnitt[] = [
  {
    id: "die-antwort",
    titel: "Einen halal Kredit gibt es nicht",
    inhalt: (
      <>
        <p>
          Ein Kredit ist Geld gegen Geld. Du bekommst 10.000 Euro und gibst 11.000 Euro zurück. Der Aufschlag
          ist der Preis für Zeit, und genau der ist das Verbotene. Daran ändert kein Name etwas.
        </p>
        <Merksatz>Es gibt keinen zinsfreien Kredit. Es gibt einen anderen Vertrag, der dasselbe Problem löst.</Merksatz>
        <p>
          Der Unterschied ist nicht kosmetisch. Beim Kredit verleiht die Bank Geld und trägt kein Risiko: Ob
          dein Auto fährt oder dein Laden läuft, ist ihr gleich, die Rate kommt so oder so. Beim erlaubten Weg
          kauft, besitzt oder beteiligt sie sich. Sie hat etwas in der Hand, das kaputtgehen kann, und darf
          deshalb daran verdienen.
        </p>
        <p>
          Wer nach „halal Kredit" oder „faizsiz kredi" sucht, sucht in Wahrheit nach diesem zweiten Weg. Vier
          Verträge decken fast alle Fälle ab.
        </p>
        <Bild text="Beim Handelsvertrag wechselt eine Sache den Besitzer, und der Aufschlag ist der Preis dafür. Beim Kredit fließt nur Geld.">
          <IlluMurabaha />
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
          Die Namen sind arabisch, die Sache ist einfach. Wer sie einmal kennt, erkennt sofort, was ihm ein
          Anbieter da vorlegt.
        </p>
        <Begriff wort="Kaufen und mit Aufschlag weiterverkaufen" arabisch="Murabaha">
          Die Bank kauft die Sache selbst, wird kurz Eigentümerin und verkauft sie dir zu einem festen
          Gesamtpreis. Du zahlst in Raten. Der Aufschlag steht von Anfang an fest und wächst nicht, wenn du dir
          Zeit lässt. Der häufigste Weg bei Auto und Ware.
        </Begriff>
        <Begriff wort="Mieten, am Ende übernehmen" arabisch="Idschara">
          Die Bank kauft die Sache und vermietet sie dir. Du zahlst Miete, nicht Zins. Am Ende folgt ein
          eigener Kaufvertrag. Der Unterschied zum normalen Leasing steckt im Kleingedruckten, vor allem bei
          Verzugsgebühren, Versicherung und der Frage, wer den Untergang der Sache trägt.
        </Begriff>
        <Begriff wort="Gemeinsam kaufen, Anteil für Anteil übernehmen" arabisch="Muscharaka mutanaqisa">
          Ihr kauft zusammen, etwa eine Wohnung. Du wohnst darin und zahlst für den Teil, der noch nicht dir
          gehört, Miete. Parallel kaufst du Anteile nach, bis alles dir gehört. Der übliche Weg bei
          Immobilien.
        </Begriff>
        <Begriff wort="Das zinsfreie Darlehen unter Menschen" arabisch="Qard hasan">
          Geliehen wird genau der Betrag, zurück kommt genau der Betrag. Kein Aufschlag, keine Gebühr, die
          verdeckt einer wäre. Banken bieten das nicht an, es rechnet sich für sie nicht. In Familien und
          Gemeinden ist es der Normalfall.
        </Begriff>
        <Merksatz>
          Der Prüfstein für alle vier: Wächst die Schuld, wenn du später zahlst? Dann ist es Zins mit anderem
          Namen.
        </Merksatz>
      </>
    ),
  },
  {
    id: "murabaha-genau",
    titel: "Woran du eine echte Murabaha erkennst",
    inhalt: (
      <>
        <p>
          Weil dieser Vertrag der häufigste ist, wird er auch am häufigsten nachgeahmt. Vier Punkte
          unterscheiden das Original von der Kopie.
        </p>
        <Schritte
          schritte={[
            {
              titel: "Es sind zwei getrennte Kaufverträge",
              text: "Erst kauft die Bank vom Händler, dann verkaufst du ihr das nicht wieder ab, sondern sie verkauft es dir. Zwei Verträge, zwei Zeitpunkte. Wird nur einmal unterschrieben, ist es keine Murabaha.",
            },
            {
              titel: "Du kennst den Einkaufspreis",
              text: "Nicht nur den Endpreis. Der Verkäufer legt offen, was er selbst gezahlt hat, und nennt seinen Aufschlag getrennt. Genau das macht diesen Vertrag aus. Wer dir nur eine Gesamtsumme nennt, verkauft dir etwas anderes.",
            },
            {
              titel: "Die Bank besitzt die Sache wirklich, wenn auch nur kurz",
              text: "Sie muss zwischenzeitlich Eigentümerin sein, mit allem, was daran hängt. Fragt sich: Wer haftet, wenn die Ware auf dem Transport kaputtgeht? Wenn du das bist, obwohl du sie noch nicht gekauft hast, stimmt etwas nicht.",
            },
            {
              titel: "Du wirst nicht zum Kauf gezwungen",
              text: "Du kannst der Bank vorher versprechen, ihr die Sache abzukaufen. Dieses Versprechen bindet dich religiös, es ist aber kein Vertrag, den sie vor Gericht durchsetzen darf. Steht eine Kaufverpflichtung im Papier, war es von Anfang an eine Finanzierung.",
            },
          ]}
        />
        <Hinweis titel="Die Gewährleistung ist der beste Test">
          <p>
            Frag: Wenn das Auto einen versteckten Mangel hat, an wen wende ich mich? Bei einer echten Murabaha
            ist die Bank deine Verkäuferin und schuldet dir die Gewährleistung. Verweist sie dich stattdessen
            an den Händler, war sie nie Eigentümerin. Dann hat sie nur bezahlt, und das ist ein Kredit.
          </p>
        </Hinweis>
      </>
    ),
  },
  {
    id: "null-prozent",
    titel: "Null Prozent ist kein Ausweg",
    inhalt: (
      <>
        <Frage>Wenn ich nichts obendrauf zahle, kann doch nichts falsch sein?</Frage>
        <p>
          Doch, und dieser Punkt kostet viele Leute die ganze Mühe. Sobald eine Bank dir Geld gibt und du es
          zurückzahlst, hast du ein Darlehen aufgenommen. Ob der Zinssatz bei null steht, ändert die Art des
          Vertrags nicht. Der Betrag ist dabei ohnehin nicht verschwunden, er ist im Preis eingerechnet, den
          der Händler kalkuliert hat.
        </p>
        <p>
          Genauso wenig hilft es, wenn im Vertrag statt „Zins" das Wort „Gewinn" oder „Profitrate" steht, sich
          aber sonst nichts ändert. Es kommt darauf an, was passiert, nicht wie es heißt: Wer gibt was, wem
          gehört die Sache wann, und wächst die Schuld bei Verzug?
        </p>
        <Merksatz>Frag nach dem Zertifikat. Wer keines hat, hat auch keine Prüfung.</Merksatz>
        <p>
          Ein seriöser Anbieter lässt seine Verträge von einem Gelehrtengremium prüfen und zeigt dir das
          Dokument. Wer nur damit wirbt, islamisch zu arbeiten, ohne einen Nachweis zu nennen, sollte das
          erklären können. Der saubere Weg ohne Bank ist der Ratenkauf direkt beim Händler, mehr dazu in{" "}
          <L to="/wissen/ratenzahlung-haram">Ist Ratenzahlung haram?</L>
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
          Hier wird es dünn. Der Markt ist klein, und es hilft niemandem, ihn größer zu reden, als er ist.
          Gelehrte, die den deutschen Markt beobachten, sagen offen, dass sie Stand Ende 2025 weder eine
          geprüfte Autofinanzierung noch eine geprüfte Immobilienfinanzierung in Deutschland kennen.
        </p>
        <Checkliste
          punkte={[
            {
              art: "neutral",
              text: (
                <>
                  <B>Eine Bank mit Vollbanklizenz.</B> Die KT Bank AG in Frankfurt arbeitet seit 2015 nach
                  islamischen Grundsätzen und bietet Finanzierungen nach dem Handelsmodell an. Wir haben sie
                  nicht selbst geprüft und empfehlen sie nicht. Was du vor einem Wechsel wissen solltest, steht
                  im Beitrag zum <L to="/wissen/girokonto-ohne-zinsen">Girokonto ohne Zinsen</L>.
                </>
              ),
            },
            {
              art: "ja",
              text: (
                <>
                  <B>Der eigene Kreis.</B> Familie, Freunde, die Gemeinde. Für kleinere Beträge der schnellste
                  und sauberste Weg. Schreib den Betrag und die Rückzahlung trotzdem auf. Das ist kein
                  Misstrauen, es ist ausdrücklich empfohlen und erspart später jeden Streit.
                </>
              ),
            },
            {
              art: "ja",
              text: (
                <>
                  <B>Der Arbeitgeber.</B> Viele Betriebe geben einen Gehaltsvorschuss oder ein zinsloses
                  Arbeitgeberdarlehen. Beides ist ein zinsfreies Darlehen, auch wenn es niemand so nennt. Es
                  steht selten im Intranet, es lohnt sich zu fragen.
                </>
              ),
            },
            {
              art: "ja",
              text: (
                <>
                  <B>Ratenkauf direkt beim Händler.</B> Ohne Bank dazwischen ist es Handel, kein Kredit. Der
                  Preis muss vor der Unterschrift feststehen.
                </>
              ),
            },
          ]}
        />
        <p>
          Was es <B>nicht</B> gibt: einen breiten Markt islamischer Baufinanzierer, eine islamische Autobank
          mit Filialnetz, oder eine App, die dir in fünf Minuten einen konformen Kredit gibt. Wer damit wirbt,
          sollte den Vertrag zeigen, nicht das Etikett.
        </p>
      </>
    ),
  },
  {
    id: "schulden",
    titel: "Auch ohne Zins sind Schulden nichts Leichtes",
    inhalt: (
      <>
        <p>
          Ein Punkt, der in der ganzen Diskussion untergeht. Selbst ein völlig sauberes, zinsfreies Darlehen
          ist nichts, was man ohne Grund aufnimmt. Schulden gelten als etwas, das man meidet, solange es geht.
          Nicht verboten, aber ungern gesehen.
        </p>
        <p>
          Überliefert ist der Gedanke, dass es auf die Absicht ankommt: Wer sich etwas leiht und fest vorhat,
          es zurückzugeben, dem wird dabei geholfen. Wer es sich leiht, ohne wirklich vorzuhaben zurückzuzahlen,
          dem geht es am Ende schlechter, nicht besser. Und Schulden sind eine der wenigen Sachen, die auch
          nach dem Tod bestehen bleiben, bis sie beglichen oder erlassen werden.
        </p>
        <Merksatz>Erst die Frage, ob du es leihen darfst. Dann die Frage, ob du es leihen solltest.</Merksatz>
      </>
    ),
  },
  {
    id: "notlage",
    titel: "Die Notlage und wo sie endet",
    inhalt: (
      <>
        <p>
          Es gibt die Regel, dass eine echte Notlage Verbotenes im nötigen Maß erlaubt. Sie ist keine
          Hintertür, sie ist ein Notausgang, und die beiden werden oft verwechselt.
        </p>
        <Checkliste
          punkte={[
            { art: "ja", text: "Es geht um Leben, Gesundheit, ein Dach über dem Kopf. Eine Operation, die sonst nicht stattfindet. Eine Miete, ohne die die Familie auf der Straße steht." },
            { art: "nein", text: "Ein größeres Auto, eine schönere Küche, eine Hochzeit, die dem Vergleich standhalten soll, ein Geschäft, das man auch später aufmachen kann." },
            { art: "neutral", text: "Und selbst wo die Regel greift, greift sie nur so weit wie nötig und nur so lange wie nötig. Das ist der Teil, der gern überlesen wird." },
          ]}
        />
        <p>
          Wunsch und Not sind nicht dasselbe, auch wenn sich beides gleich dringend anfühlt. Wer wirklich in
          dieser Lage ist, sollte nicht im Internet nach einer Erlaubnis suchen, sondern seinen Fall einem
          Gelehrten schildern, dem er vertraut.
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
          Die unbeliebteste Antwort ist meistens die richtige: erst sparen, dann kaufen. Sie ist langsam, sie
          kostet nichts, und sie führt zu keinem Vertrag, den irgendjemand prüfen muss.
        </p>
        <Beispiel
          titel="Ein Auto für 12.000 Euro"
          rechnung={["Finanzierung: 6 % auf 4 Jahre → rund 1.500 € obendrauf", "Sparen: 24 × 500 € → dasselbe Auto, 1.500 € bleiben bei dir"]}
          ergebnis="Der Unterschied ist Wartezeit, nicht Geld."
        />
        <p>
          Was in dieser Wartezeit mit dem Ersparten passiert, ist die zweite Frage. Auf dem Konto verliert es
          jedes Jahr an Kaufkraft. Deshalb gehört zu einem Sparziel ein Ort, an dem das Geld nicht schrumpft,
          ohne dass irgendwo ein Zins mitläuft.
        </p>
        <Bild text="Ohne Kredit gibt es keinen Zins, den man prüfen müsste. Der Preis dafür ist Wartezeit.">
          <IlluZins />
        </Bild>
      </>
    ),
  },
];

const faq: BeitragFrage[] = [
  {
    frage: "Gibt es einen halal Kredit?",
    antwort:
      "Nein, nicht im Wortsinn. Ein Kredit ist Geld gegen mehr Geld, und der Aufschlag ist das Verbotene. Was es gibt, sind andere Verträge, die dasselbe Ziel erreichen: Die Bank kauft die Sache und verkauft oder vermietet sie dir mit einem festen Aufschlag, oder ihr kauft gemeinsam und du übernimmst Anteil für Anteil.",
  },
  {
    frage: "Ist eine Null-Prozent-Finanzierung erlaubt?",
    antwort:
      "Läuft sie über eine Bank, nach verbreiteter Auffassung nicht. Du unterschreibst einen Darlehensvertrag, auch wenn der Zins bei null steht, und der Betrag ist ohnehin im Preis eingerechnet. Ein Ratenkauf direkt beim Händler ohne Bank ist der saubere Weg.",
  },
  {
    frage: "Was ist Murabaha?",
    antwort:
      "Ein Kaufvertrag mit offengelegtem Aufschlag. Die Bank kauft die Ware selbst, wird Eigentümerin und verkauft sie dir zu einem festen Gesamtpreis in Raten weiter. Du musst dabei den Einkaufspreis und den Aufschlag getrennt kennen. Der Preis steht von Anfang an fest und steigt nicht, wenn die Rückzahlung länger dauert.",
  },
  {
    frage: "Woran erkenne ich, ob die Bank die Sache wirklich gekauft hat?",
    antwort:
      "Frag nach der Gewährleistung. Wenn das Auto einen versteckten Mangel hat, muss die Bank als deine Verkäuferin dafür einstehen. Verweist sie dich an den Händler, war sie nie Eigentümerin, und dann hat sie nur bezahlt. Das ist ein Kredit.",
  },
  {
    frage: "Gibt es eine islamische Bank für Kredite in Deutschland?",
    antwort:
      "Die KT Bank AG in Frankfurt hat seit 2015 eine deutsche Vollbanklizenz und arbeitet nach dem Handelsmodell. Wir haben sie nicht geprüft und empfehlen sie nicht. Gelehrte, die den deutschen Markt beobachten, kennen Stand Ende 2025 kein geprüftes Angebot für Auto- oder Immobilienfinanzierung.",
  },
  {
    frage: "Ist ein zinsloses Darlehen von der Familie erlaubt?",
    antwort:
      "Ja, das ist der klassische Fall und gilt als verdienstvoll. Zurückgegeben wird genau der geliehene Betrag, ohne Aufschlag und ohne Gebühr. Halte Betrag und Rückzahlung schriftlich fest, das ist ausdrücklich empfohlen.",
  },
  {
    frage: "Darf ich einen Kredit aufnehmen, wenn ich in Not bin?",
    antwort:
      "Die Regel zur Notlage erlaubt Verbotenes im nötigen Maß, wenn Leben, Gesundheit oder Obdach auf dem Spiel stehen. Sie gilt nur so weit und so lange wie nötig. Ein größeres Auto oder eine teurere Hochzeit fallen nicht darunter. Schilder deinen konkreten Fall einem Gelehrten deines Vertrauens.",
  },
  {
    frage: "Woran erkenne ich einen umetikettierten Kredit?",
    antwort:
      "Daran, dass die Schuld wächst, wenn du später zahlst. Bei einem echten Handels- oder Mietvertrag steht der Gesamtpreis fest. Eine Verzugsgebühr, die den Betrag erhöht und beim Anbieter bleibt, ist Zins unter anderem Namen. Ein Vertrag, in dem nur das Wort Zins durch Gewinn ersetzt wurde, ändert nichts.",
  },
];

const beschreibung =
  "Einen zinsfreien Kredit gibt es nicht. Es gibt vier andere Verträge: Murabaha, Idschara, Muscharaka und Qard hasan. Was davon in Deutschland verfügbar ist, warum null Prozent kein Ausweg ist und woran du einen umetikettierten Kredit erkennst.";

const HalalKreditOhneZinsen = () => (
  <>
    <Seo
      title="Halal Kredit ohne Zinsen: Welche Verträge es wirklich gibt | finanzmuslim"
      description={beschreibung}
      path="/wissen/halal-kredit-ohne-zinsen"
      jsonLd={beitragJsonLd({
        titel: "Halal Kredit ohne Zinsen",
        beschreibung,
        path: "/wissen/halal-kredit-ohne-zinsen",
        datePublished: "16. August 2026",
        dateModified: "5. September 2026",
        faq,
      })}
    />
    <BeitragSeite
      slug="halal-kredit-ohne-zinsen"
      titel="Halal Kredit ohne Zinsen"
      untertitel="Vier Verträge statt einem Kredit, und der eine Test, der alle vier prüft."
      kurzGesagt={[
        "Einen zinsfreien Kredit gibt es nicht. Es gibt einen anderen Vertrag.",
        "Vier Formen decken fast alles ab: Murabaha, Idschara, Muscharaka, Qard hasan.",
        "Der Prüfstein: Wächst die Schuld, wenn du später zahlst, ist es Zins.",
        "Null Prozent über eine Bank bleibt ein Darlehen. Das Wort Gewinn statt Zins ändert nichts.",
        "In Deutschland ist der Markt klein. Eine Bank, der eigene Kreis, der Arbeitgeber, der Händler.",
        "Auch ohne Zins sind Schulden nichts, was man ohne Grund aufnimmt.",
      ]}
      abschnitte={abschnitte}
      faq={faq}
      datePublished="16. August 2026"
      dateModified="5. September 2026"
      boxMitteNach={4}
      rechtshinweis="Dieser Beitrag gibt bekannte Positionen wieder und dient ausschließlich zu Bildungszwecken. Er ist keine Fatwa und ersetzt weder die Auskunft eines Gelehrten noch eine Rechts-, Steuer- oder Anlageberatung. Zur Ausgestaltung einzelner Vertragsformen und zur Reichweite der Notlagenregel bestehen innerhalb der Rechtsschulen unterschiedliche Auffassungen. Angaben zur KT Bank AG beruhen auf öffentlich zugänglichen Quellen, Stand August 2026, und sind keine Empfehlung. Die Zahlen in den Beispielen sind erfunden."
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
      <PasstDazu
        punkte={[
          { to: "/wissen/haus-kaufen-ohne-zinsen", name: "Haus kaufen ohne Zinsen", text: "geht denselben Weg für den größten Posten im Leben durch." },
          { to: "/wissen/ratenzahlung-haram", name: "Ist Ratenzahlung haram?", text: "der Ratenkauf beim Händler, ohne Bank dazwischen." },
          { to: "/wissen/zinsen-im-islam", name: "Zinsen im Islam", text: "erklärt, was genau verboten ist und was ausdrücklich nicht." },
          { to: "/wissen/ist-leasing-haram", name: "Ist Leasing haram?", text: "prüft den Vertrag, der Idschara am nächsten kommt." },
        ]}
      />
    </BeitragSeite>
  </>
);

export default HalalKreditOhneZinsen;
