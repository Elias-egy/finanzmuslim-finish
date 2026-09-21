import Seo, { beitragJsonLd } from "@/components/Seo";
import BeitragSeite, { type BeitragAbschnitt, type BeitragFrage } from "@/components/BeitragSeite";
import { IlluVersicherung, IlluVersicherungPflicht } from "@/components/illu";
import {
  B,
  Begriff,
  Bild,
  Faelle,
  Frage,
  Hinweis,
  L,
  Merksatz,
  PasstDazu,
  Schritte,
} from "@/components/beitrag";

const abschnitte: BeitragAbschnitt[] = [
  {
    id: "kurze-antwort",
    titel: "Die kurze Antwort zuerst",
    inhalt: (
      <>
        <p>
          Die Gelehrtenräte, die heutige Finanzfragen prüfen, stufen die klassische Versicherung nahezu
          einhellig als problematisch ein. Der erste, der das ausführlich begründet hat, war ein Gelehrter vor
          rund vierhundert Jahren, als die europäischen Versicherer nach Damaskus kamen. Seitdem ist die Frage
          nicht mehr wirklich strittig.
        </p>
        <p>
          Der Grund ist nicht die Vorsorge selbst. Vorsorge ist im Islam ausdrücklich erwünscht. Du darfst und
          sollst dich absichern. Das Problem liegt in der Bauweise des Vertrags.
        </p>
        <Merksatz>Nicht die Absicherung ist das Problem, sondern der Vertrag, mit dem sie verkauft wird.</Merksatz>
      </>
    ),
  },
  {
    id: "warum-problem",
    titel: "Zwei Begründungen, und der Unterschied ist wichtig",
    inhalt: (
      <>
        <p>
          Gelehrte kommen zum selben Ergebnis, aber auf zwei verschiedenen Wegen. Das klingt nach Haarspalterei,
          ist aber der Grund, warum manche Versicherungen anders beurteilt werden als andere.
        </p>
        <Begriff wort="Unsicherheit im Vertrag" arabisch="Gharar">
          Du zahlst sicher jeden Monat, bekommst aber vielleicht nie etwas zurück. Beim Abschluss weiß niemand,
          wer am Ende wie viel gibt und wer wie viel bekommt. Mehr dazu in <L to="/wissen/gharar">Gharar</L>.
        </Begriff>
        <Begriff wort="Zins" arabisch="Riba">
          Wer 300 Euro einzahlt und 5.000 ausgezahlt bekommt, tauscht Geld gegen mehr Geld über Zeit. Dazu
          legen Versicherer die Beiträge verzinst an. Mehr dazu in{" "}
          <L to="/wissen/zinsen-im-islam">Zinsen im Islam</L>.
        </Begriff>
        <p>
          Warum das praktisch wird: Für die beiden Begründungen gelten <B>verschiedene Ausnahmen</B>. Ein
          Vertrag, der wegen der Unsicherheit beanstandet wird, kann bei einer <B>Dringlichkeit</B> erlaubt
          werden. Ein Vertrag, der wegen des Zinses beanstandet wird, erst bei einer echten <B>Notwendigkeit</B>,
          also einer erheblich höheren Hürde.
        </p>
        <Hinweis titel="Der Unterschied in einem Satz">
          <p>
            Dringlichkeit heißt: Es wäre eine erhebliche Härte ohne. Notwendigkeit heißt: Es geht wirklich
            nicht anders. Deshalb wird die Versicherung insgesamt milder beurteilt als der Kredit.
          </p>
        </Hinweis>
      </>
    ),
  },
  {
    id: "vorsorge-versicherung",
    titel: "Der Unterschied zwischen Vorsorge und Versicherung",
    inhalt: (
      <>
        <Frage>Soll ich mich also gar nicht absichern und einfach auf Gott vertrauen?</Frage>
        <p>
          Nein, und das wäre auch ein Missverständnis davon, was Vertrauen heißt. Der Prophet hat einem Mann,
          der sein Kamel ungesichert stehen ließ, gesagt: Bind es an und vertrau dann auf Gott. Rücklagen
          bilden, sich absichern, an morgen denken, all das ist ausdrücklich erwünscht.
        </p>
        <p>
          Das Problem ist nicht die Absicht, sondern die <B>Bauweise des Vertrags</B>. Wer Geld für den
          Notfall zurücklegt, tut genau dasselbe wie ein Versicherter, nur ohne den Vertrag, an dem die
          Bedenken hängen. Deshalb ist eine Rücklage für viele Gelehrte der saubere Weg, wo immer sie
          ausreicht.
        </p>
        <Merksatz>Die erste Frage ist nicht, welche Versicherung. Sondern ob eine Rücklage reicht.</Merksatz>
      </>
    ),
  },
  {
    id: "ausnahmen",
    titel: "Wann eine Versicherung trotzdem erlaubt sein kann",
    inhalt: (
      <>
        <Schritte
          schritte={[
            {
              titel: "Gesetzliche Pflicht",
              text: "Kfz-Haftpflicht, Krankenversicherung, Pflegeversicherung, die Beiträge zur Sozialversicherung. Wo dir der Staat keine Wahl lässt, ist das Urteil aufgehoben. Wichtig: Der Zwang macht die Sache nicht gut, er nimmt dir nur die Verantwortung dafür.",
            },
            {
              titel: "Berufliche Pflicht",
              text: "Eine Berufshaftpflicht, ohne die du deinen Beruf gar nicht ausüben darfst. Derselbe Gedanke wie bei der gesetzlichen Pflicht.",
            },
            {
              titel: "Echte Dringlichkeit",
              text: "Ein Schaden, mit dem ernsthaft zu rechnen ist und den du selbst nicht tragen könntest. Beides muss zusammenkommen. Ob das in deinem Fall vorliegt, beurteilt kein Ratgeber im Internet, sondern ein Gelehrter, der deine Lage kennt.",
            },
          ]}
        />
        <Bild text="Wo dir der Staat keine Wahl lässt, ist das Urteil aufgehoben. Wo du wählen kannst, beginnt die Prüfung.">
          <IlluVersicherungPflicht />
        </Bild>
        <Hinweis titel="Auch bei Pflicht: vergleichen">
          <p>
            Dass eine Versicherung Pflicht ist, heißt nicht, dass jeder Tarif in Ordnung ist. Nimm den
            günstigsten, der die Pflicht erfüllt, und nicht das Paket mit allen Zusatzleistungen. Was über die
            Pflicht hinausgeht, ist wieder freiwillig.
          </p>
        </Hinweis>
      </>
    ),
  },
  {
    id: "einordnung",
    titel: "Welche Versicherung wie einzuordnen ist",
    inhalt: (
      <>
        <p>
          Die Einordnung ist keine Fatwa für deinen Fall, sondern zeigt, wo die Frage überhaupt entsteht. Grün
          heißt hier: Die Pflicht nimmt dir die Entscheidung ab.
        </p>
        <Faelle
          faelle={[
            {
              titel: "Kfz-Haftpflicht",
              ton: "gruen",
              wort: "Pflicht",
              text: "Ohne sie darfst du in Deutschland kein Auto fahren. Fällt unter die Ausnahme.",
            },
            {
              titel: "Kranken- und Pflegeversicherung",
              ton: "gruen",
              wort: "Pflicht",
              text: "In Deutschland besteht Versicherungspflicht. Dieselbe Ausnahme.",
            },
            {
              titel: "Berufshaftpflicht, wo vorgeschrieben",
              ton: "gruen",
              wort: "Pflicht",
              text: "Wo du den Beruf ohne sie nicht ausüben darfst, ist es kein freiwilliger Vertrag.",
            },
            {
              titel: "Private Haftpflicht",
              ton: "gelb",
              wort: "kommt auf den Fall an",
              text: "Freiwillig, aber ein Schaden kann existenzvernichtend sein. Wer selbst nicht dafür aufkommen könnte, hat ein starkes Argument. Das ist ein Fall für einen Gelehrten, nicht für eine Faustregel.",
            },
            {
              titel: "Teilkasko",
              ton: "gelb",
              wort: "kommt auf den Fall an",
              text: "Diebstahl, Hagel, Wildunfall. Wer beruflich auf das Auto angewiesen ist und es nicht ersetzen könnte, kann sich darauf berufen.",
            },
            {
              titel: "Vollkasko",
              ton: "rot",
              wort: "kein Dringlichkeitsfall",
              text: "Sie deckt selbst verschuldete Schäden am eigenen Auto ab. Das ist Bequemlichkeit, keine Härte, und wird von Gelehrten nicht als Dringlichkeit anerkannt. Beim Leasing wird sie oft verlangt, das ist dann ein Problem des Leasingvertrags.",
            },
            {
              titel: "Hausrat",
              ton: "rot",
              wort: "meist keine Not",
              text: "Möbel und Elektrogeräte lassen sich in aller Regel ersetzen oder ansparen.",
            },
            {
              titel: "Rechtsschutz, Zahnzusatz, Handyversicherung",
              ton: "rot",
              wort: "freiwillig",
              text: "Kein Fall, in dem dich der Schaden ruiniert. Hier trägt kein Argument.",
            },
            {
              titel: "Berufsunfähigkeit",
              ton: "rot",
              wort: "besonders kritisch",
              text: "Wird gern als unverzichtbar verkauft. Sie läuft nur bis zu einem bestimmten Alter, Streit um die Leistung ist bei ihr besonders häufig, und die Provision für den Vermittler ist hoch. Wer sein Einkommen absichern will, kommt mit einer eigenen Rücklage oft weiter.",
            },
            {
              titel: "Klassische Lebens- und Rentenversicherung",
              ton: "rot",
              wort: "der klarste Fall",
              text: "Der Zins steht direkt im Vertrag. Wer fürs Alter vorsorgen will, kann dieselbe Funktion über ein Depot mit Auszahlplan abbilden.",
            },
          ]}
        />
      </>
    ),
  },
  {
    id: "beigabe",
    titel: "Der Fall, den fast niemand kennt: die Beigabe",
    inhalt: (
      <>
        <Frage>Im Mitgliedsbeitrag meiner Gewerkschaft steckt eine Rechtsschutzversicherung. Muss ich austreten?</Frage>
        <p>
          Nein. Wenn du einer Organisation aus einem anderen Grund beitrittst und eine Versicherung als Zugabe
          dabei ist, hast du keinen Versicherungsvertrag geschlossen. Du hast eine Mitgliedschaft. Dasselbe
          gilt für den Mieterbund, für Vereine und für die Transportversicherung, die beim Paketversand
          automatisch mitläuft.
        </p>
        <Merksatz>
          Entscheidend ist, warum du beigetreten bist. Wegen der Sache: in Ordnung. Wegen der Versicherung:
          dann ist es doch wieder ein Versicherungsabschluss.
        </Merksatz>
      </>
    ),
  },
  {
    id: "schon-versichert",
    titel: "Was ist, wenn ich schon eine Versicherung habe?",
    inhalt: (
      <>
        <p>
          Wer einen Vertrag bereits laufen hat, muss <B>nicht in Panik verfallen</B>. Die verbreitete
          Empfehlung lautet, den Vertrag zu prüfen, bei freiwilligen Verträgen das Ende zu planen und bei
          Pflichtverträgen nichts zu überstürzen.
        </p>
        <p>
          Zu einem ausgezahlten Betrag gibt es unterschiedliche Auffassungen. Manche Gelehrte sagen, man dürfe
          nur die eingezahlten Beiträge behalten und müsse den Überschuss weitergeben. Das ist genau der Fall,
          in dem du jemanden fragen solltest, statt selbst zu entscheiden.
        </p>
      </>
    ),
  },
  {
    id: "takaful",
    titel: "Takaful, die islamische Alternative",
    inhalt: (
      <>
        <p>
          Takaful funktioniert wie eine Gemeinschaft. Alle zahlen in einen gemeinsamen Topf ein, und aus diesem
          Topf werden Schäden der Mitglieder bezahlt. Es gibt keinen Gewinn für das Unternehmen aus deinem
          Beitrag und kein Zinsgeschäft dahinter. Der Unterschied ist die Absicht: Beim Takaful spendest du in
          einen gemeinsamen Topf, du kaufst kein Versprechen.
        </p>
        <Bild text="Beim Takaful zahlen viele in einen gemeinsamen Topf. Wer einen Schaden hat, bekommt daraus ersetzt.">
          <IlluVersicherung />
        </Bild>
        <p>
          <B>Die ehrliche Einordnung:</B> In Deutschland gibt es Takaful praktisch nicht. Es gab einen Anlauf
          mit einer kapitalbildenden Lebensversicherung, der 2018 mangels Nachfrage wieder eingestellt wurde.
          Für dich ist es derzeit also keine echte Option.
        </p>
      </>
    ),
  },
  {
    id: "was-tun",
    titel: "Was du konkret tun kannst",
    inhalt: (
      <Schritte
        schritte={[
          {
            titel: "Sortiere nach Pflicht und freiwillig",
            text: "Alles, was der Staat oder dein Beruf vorschreibt, kommt auf einen Stapel und ist erledigt. Nimm dort den günstigsten Tarif, der die Pflicht erfüllt.",
          },
          {
            titel: "Frag bei jedem freiwilligen Vertrag: Was, wenn ich ihn nicht hätte?",
            text: "Könntest du den Schaden aus einer Rücklage tragen, brauchst du keine Versicherung, sondern eine Rücklage. Könntest du es nicht, ist das ein Argument, aber noch keine Entscheidung.",
          },
          {
            titel: "Bau die Rücklage auf, bevor du kündigst",
            text: "Erst der Ersatz, dann die Kündigung. Ohne Rücklage dazustehen ist keine Verbesserung.",
          },
          {
            titel: "Leg die schwierigen Fälle einem Gelehrten vor",
            text: "Mit dem konkreten Vertrag und deiner konkreten Lage. Private Haftpflicht, Teilkasko und Berufsunfähigkeit sind genau solche Fälle.",
          },
        ]}
      />
    ),
  },
];

const faq: BeitragFrage[] = [
  {
    frage: "Ist die Kfz-Versicherung haram?",
    antwort:
      "Die Kfz-Haftpflicht ist in Deutschland gesetzlich vorgeschrieben und fällt damit unter die anerkannte Ausnahme. Bei der Teilkasko kommt es auf deine Lage an, etwa ob du beruflich auf das Auto angewiesen bist und es nicht ersetzen könntest. Die Vollkasko deckt selbst verschuldete Schäden am eigenen Auto ab und wird von Gelehrten nicht als Dringlichkeitsfall anerkannt.",
  },
  {
    frage: "Ist eine private Haftpflichtversicherung erlaubt?",
    antwort:
      "Sie ist freiwillig, deshalb greift keine Pflichtausnahme. Wer einen existenzvernichtenden Schaden nicht selbst tragen könnte, hat ein ernstzunehmendes Argument. Ob es in deinem Fall trägt, beurteilt ein Gelehrter, der deine Lage kennt, und keine allgemeine Faustregel.",
  },
  {
    frage: "Ist eine Lebensversicherung haram?",
    antwort:
      "Die klassische Variante mit Garantiezins gilt als der klarste Fall, weil der Zins direkt im Vertrag steht. Wer für das Alter vorsorgen will, kann dieselbe Funktion über ein Depot mit Auszahlplan abbilden, ohne Zinsvertrag.",
  },
  {
    frage: "Was ist mit der Berufsunfähigkeitsversicherung?",
    antwort:
      "Sie wird gern als unverzichtbar verkauft, verdient aber einen genauen Blick: Sie läuft nur bis zu einem bestimmten Alter, Streit um die Leistung ist bei ihr besonders häufig, und die Provision für den Vermittler ist hoch. Eine eigene Rücklage bringt in vielen Fällen mehr.",
  },
  {
    frage: "Was ist mit der Krankenversicherung?",
    antwort:
      "In Deutschland besteht Versicherungspflicht. Damit greift dieselbe Ausnahme wie bei der Kfz-Haftpflicht. Das gilt auch für die Pflegeversicherung und die übrigen Beiträge zur Sozialversicherung.",
  },
  {
    frage: "In meinem Vereinsbeitrag ist eine Versicherung enthalten. Ist das ein Problem?",
    antwort:
      "Nein, solange du wegen der Sache beigetreten bist und nicht wegen der Versicherung. Eine Versicherung als Beigabe zu einer Mitgliedschaft ist kein Versicherungsvertrag, den du geschlossen hast. Dasselbe gilt für die Transportversicherung beim Paketversand.",
  },
  {
    frage: "Darf ich als Versicherungsvermittler arbeiten?",
    antwort:
      "Nach verbreiteter Auffassung nicht. Wer den Vertrag vermittelt, wirkt an ihm mit, und die Vergütung stammt genau daraus. Wer in diesem Beruf steckt, sollte das mit einem Gelehrten besprechen und einen Übergang planen, statt von heute auf morgen ohne Einkommen dazustehen.",
  },
];

const beschreibung =
  "Wann eine Versicherung im Islam problematisch ist und wann sie erlaubt sein kann. Mit den anerkannten Ausnahmen, einer Einordnung von zehn Versicherungen und dem Sonderfall der Versicherung als Beigabe.";

const IstVersicherungHaram = () => (
  <>
    <Seo
      title="Versicherung im Islam: halal oder haram? | finanzmuslim"
      description={beschreibung}
      path="/wissen/ist-versicherung-haram"
      jsonLd={beitragJsonLd({
        titel: "Ist eine Versicherung haram?",
        beschreibung,
        path: "/wissen/ist-versicherung-haram",
        datePublished: "15. August 2026",
        dateModified: "5. September 2026",
        faq,
      })}
    />
    <BeitragSeite
      slug="ist-versicherung-haram"
      titel="Ist eine Versicherung haram?"
      untertitel="Nicht die Absicherung ist das Problem, sondern der Vertrag. Und der wird nicht bei jeder Versicherung gleich beurteilt."
      kurzGesagt={[
        "Eine Versicherung, die du freiwillig abschließt, gilt bei den meisten Gelehrten als problematisch.",
        "Zwei Begründungen: die Unsicherheit im Vertrag und der Zins dahinter. Für beide gelten verschiedene Ausnahmen.",
        "Anerkannte Ausnahmen sind gesetzliche Pflicht, berufliche Pflicht und echte Dringlichkeit.",
        "Kfz-Haftpflicht, Kranken- und Pflegeversicherung sind Pflicht und fallen darunter.",
        "Vollkasko ist kein Dringlichkeitsfall, Teilkasko kann einer sein.",
        "Eine Versicherung als Beigabe zu einer Mitgliedschaft ist kein Vertrag, den du geschlossen hast.",
      ]}
      abschnitte={abschnitte}
      faq={faq}
      datePublished="15. August 2026"
      dateModified="5. September 2026"
      boxMitteNach={4}
      rechtshinweis="Dieser Beitrag gibt bekannte Positionen wieder und dient ausschließlich zu Bildungszwecken. Er ist keine Fatwa und ersetzt weder die Auskunft eines Gelehrten noch eine Rechts-, Steuer- oder Versicherungsberatung. Die Einordnung einzelner Versicherungen zeigt, wo die Frage entsteht, und ist keine Entscheidung für deinen Fall. Ob eine Dringlichkeit vorliegt, beurteilt ein Gelehrter, der deine Lage kennt. Innerhalb der Rechtsschulen gibt es zu einzelnen Punkten abweichende Auffassungen."
      boxOben={{ kategorie: "Depot", variante: "vergleich", linkZiel: "/vergleich/depot", ueberschrift: "Vorsorge ohne Zinsvertrag" }}
      boxMitte={{ kategorie: "Girokonto", variante: "vergleich", linkZiel: "/vergleiche" }}
    >
      <PasstDazu
        punkte={[
          { to: "/vorlagen/vertrags-ampel", name: "Die Vertrags-Ampel", text: "ordnet elf weitere Verträge aus dem Alltag ein." },
          { to: "/wissen/gharar", name: "Was ist Gharar", text: "erklärt die erste der beiden Begründungen im Detail." },
          { to: "/wissen/ist-leasing-haram", name: "Ist Leasing haram?", text: "warum beim Leasing plötzlich eine Vollkasko verlangt wird." },
          { to: "/wissen/haus-kaufen-ohne-zinsen", name: "Haus kaufen ohne Zinsen", text: "dieselbe Abwägung in größerem Maßstab." },
        ]}
      />
    </BeitragSeite>
  </>
);

export default IstVersicherungHaram;
