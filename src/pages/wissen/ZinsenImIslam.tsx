import Seo, { beitragJsonLd } from "@/components/Seo";
import BeitragSeite, { type BeitragAbschnitt, type BeitragFrage } from "@/components/BeitragSeite";
import { IlluHandel, IlluZins } from "@/components/illu";
import {
  B,
  Begriff,
  Beispiel,
  Bild,
  Checkliste,
  Frage,
  Gegenueber,
  Hinweis,
  L,
  Merksatz,
  PasstDazu,
  Schritte,
} from "@/components/beitrag";

const abschnitte: BeitragAbschnitt[] = [
  {
    id: "worum-es-geht",
    titel: "Worum es eigentlich geht",
    inhalt: (
      <>
        <p>
          Das Zinsverbot heißt auf Arabisch <B>Riba</B>. Übersetzt bedeutet das Wort Zuwachs oder Vermehrung.
          Gemeint ist eine ganz bestimmte Art von Zuwachs:
        </p>
        <Merksatz>Geld, das mehr wird, nur weil Zeit vergeht.</Merksatz>
        <p>
          Du leihst jemandem 100 Euro und willst 110 zurück. Für die zusätzlichen 10 Euro hat niemand
          gearbeitet, niemand etwas hergestellt und niemand ein Risiko getragen. Sie entstehen allein daraus,
          dass ein Jahr vergangen ist.
        </p>
        <p>
          Genau das ist der Kern. Nicht Gewinn ist verboten, nicht Handel, nicht Reichtum. Verboten ist der
          Zuwachs ohne Gegenleistung und ohne Risiko.
        </p>
        <Bild text="Links und rechts steht dasselbe Geld. Der einzige Unterschied ist die Zeit dazwischen. Genau das meint das Zinsverbot.">
          <IlluZins />
        </Bild>
      </>
    ),
  },
  {
    id: "missverstaendnis-zeit",
    titel: "Das große Missverständnis: Zeit darf Geld kosten",
    inhalt: (
      <>
        <Frage>Wenn Geld nicht durch Zeit wachsen darf, ist dann jeder Ratenkauf verboten?</Frage>
        <p>
          Nein, und dieses Missverständnis richtet mehr Schaden an als fast jedes andere. Es ist nicht die
          Zeit an sich, die das Problem ist. Das Problem ist <B>Zeit gegen Geld im Darlehen</B>. Wer Geld
          verleiht und mehr Geld zurückverlangt, macht Riba. Wer eine <B>Ware</B> verkauft und für die
          Ratenzahlung einen höheren Preis nimmt, macht Handel.
        </p>
        <Beispiel
          titel="Zweimal Zeit, zwei Urteile"
          rechnung={[
            "Erlaubt: Sofa bar 1.000 € oder in Raten 1.200 € — du wählst vor dem Vertrag",
            "Verboten: Bank leiht dir 1.000 €, du zahlst 1.200 € zurück",
          ]}
          ergebnis="Im ersten Fall wird eine Ware verkauft. Im zweiten wird Geld verliehen."
        >
          <p>
            Beim Ratenkauf muss der Preis vor Vertragsschluss feststehen und darf danach nicht mehr steigen.
            Ausführlich in <L to="/wissen/ratenzahlung-haram">Ist Ratenzahlung haram?</L>
          </p>
        </Beispiel>
        <Merksatz>Nicht die Zeit ist verboten, sondern der Aufschlag auf geliehenes Geld.</Merksatz>
      </>
    ),
  },
  {
    id: "quellen",
    titel: "Wo das herkommt",
    inhalt: (
      <>
        <p>
          Das Verbot steht mehrfach im Quran. Die bekannteste Stelle ist <B>Sure 2, Vers 275</B>. Dort wird
          der Handel ausdrücklich erlaubt und der Zins ausdrücklich davon abgegrenzt. Das ist der wichtigste
          Satz für das Verständnis: Es geht nicht darum, Geld zu vermehren, sondern darum, wie.
        </p>
        <p>
          In den <B>Versen 278 und 279</B> derselben Sure wird es deutlicher. Wer nicht davon ablässt, dem
          wird Krieg von Gott und seinem Gesandten angekündigt. Diese Schärfe findet sich im Quran bei kaum
          einem anderen Thema im Bereich des Geldes. Zugleich steht dort, dass man sein eingesetztes Kapital
          behalten darf. Man soll niemanden ausbeuten und selbst nicht ausgebeutet werden.
        </p>
        <p>
          In der Überlieferung des Propheten wird das ausgeweitet. Ein bekannter Bericht nennt nicht nur den,
          der Zinsen nimmt, sondern auch den, der sie zahlt, den, der den Vertrag aufschreibt, und die Zeugen.
        </p>
        <Hinweis titel="Warum das für dich praktisch wird: Bürgschaft">
          <p>
            Aus diesem Bericht leiten Gelehrte ab, dass auch das Mitwirken zählt. Der häufigste Fall in
            deutschen Familien: Eltern bürgen für den Zinskredit ihrer Kinder oder unterschreiben mit. Wer
            mitunterschreibt, steht mit im Vertrag, und das ist etwas anderes als danebenzustehen.
          </p>
        </Hinweis>
        <p>
          Das ist bewusst kurz gehalten und ohne wörtliche Übersetzung. Wer die Stellen genau lesen will,
          sollte sie in einer Ausgabe mit Kommentar nachschlagen oder mit jemandem durchgehen, der sich damit
          auskennt.
        </p>
      </>
    ),
  },
  {
    id: "zwei-arten",
    titel: "Es gibt zwei Arten, und beide begegnen dir im Alltag",
    inhalt: (
      <>
        <p>Gelehrte unterscheiden zwei Formen. Die Namen musst du dir nicht merken, die Unterschiede schon.</p>
        <Begriff wort="Zins auf Zeit" arabisch="Riba an-Nasi'a">
          Der Fall, den jeder kennt. Kredit, Dispo, Tagesgeld, Festgeld, Bausparvertrag. Geld wird verliehen
          und kommt größer zurück.
        </Begriff>
        <Begriff wort="Ungleicher Tausch" arabisch="Riba al-Fadl">
          Betrifft bestimmte Waren, vor allem Gold, Silber und einige Grundnahrungsmittel. Tauscht man
          Gleiches gegen Gleiches, muss die Menge gleich sein und die Übergabe sofort erfolgen. Deshalb gelten
          beim <L to="/wissen/halal-gold-kaufen">Goldkauf</L> besondere Regeln.
        </Begriff>
        <p>
          Für den Alltag in Deutschland ist die erste Form die wichtigere. Sie steckt in fast jedem
          Bankprodukt. Und sie hat zwei Gesichter, die man auseinanderhalten sollte:
        </p>
        <Schritte
          schritte={[
            {
              titel: "Der Aufschlag beim Abschluss",
              text: "Du leihst 10.000 Euro und schuldest 11.500. Der Aufschlag steht schon im Vertrag. Das ist der Fall, an den jeder denkt.",
            },
            {
              titel: "Der Aufschlag beim Verzug",
              text: "Du kannst eine Rate nicht zahlen, und die Schuld wird dafür erhöht. Genau das war die Form, die zur Zeit der Offenbarung üblich war: Kannst du nicht zahlen, zahlst du mehr. Sie ist bis heute in Verzugszinsen und Mahngebühren eingebaut, und sie ist der Grund, warum Schulden von selbst wachsen.",
            },
          ]}
        />
      </>
    ),
  },
  {
    id: "betroffen",
    titel: "Was betroffen ist und was nicht",
    inhalt: (
      <>
        <p>
          Viele meinen, im Islam sei fast alles rund ums Geld verboten. Das Gegenteil stimmt. Der allergrößte
          Teil des Wirtschaftslebens ist ausdrücklich erlaubt.
        </p>
        <Gegenueber
          links={{
            titel: "Zins, also betroffen",
            ton: "rot",
            punkte: [
              "Ratenkredit und Autokredit",
              "Dispo auf dem Girokonto",
              "Tagesgeld, Festgeld, Sparbuch",
              "Bausparvertrag",
              "Klassische Lebens- und Rentenversicherung",
              "Anleihen mit festem Kupon",
              "Kreditkarte mit Teilzahlung",
              "Verzugszinsen und Mahnaufschläge",
            ],
          }}
          rechts={{
            titel: "Kein Zins, also erlaubt",
            ton: "gruen",
            punkte: [
              "Handel, kaufen und verkaufen",
              "Ratenkauf beim Händler mit festem Preis",
              "Miete und Vermietung",
              "Gewinn aus einem Unternehmen",
              "Aktien, wenn die Firma geprüft ist",
              "Lohn für Arbeit",
              "Gewinnbeteiligung mit geteiltem Risiko",
              "Ein zinsloses Darlehen unter Freunden",
            ],
          }}
        />
        <p>
          Der Unterschied ist immer derselbe. Wo jemand ein Risiko trägt oder eine Leistung erbringt, ist der
          Ertrag verdient. Wo jemand nur wartet, ist er es nicht.
        </p>
        <Bild text="Beim Handel geben beide Seiten etwas her. Genau das unterscheidet ihn vom Zins, wo nur eine Seite wartet.">
          <IlluHandel />
        </Bild>
      </>
    ),
  },
  {
    id: "warum",
    titel: "Warum eigentlich? Die Begründung dahinter",
    inhalt: (
      <>
        <Frage>Was ist so schlimm daran, wenn beide freiwillig unterschreiben?</Frage>
        <p>
          Die Frage kommt oft, gerade von jüngeren Leuten, und sie ist berechtigt. Es gibt mehrere
          Begründungen, die Gelehrte anführen.
        </p>
        <p>
          <B>Das Risiko wird einseitig verteilt.</B> Wer Zinsen bekommt, verdient unabhängig davon, ob das
          Geschäft des anderen läuft. Geht es schief, trägt es der eine allein. Bei einer Gewinnbeteiligung
          tragen beide.
        </p>
        <p>
          <B>Geld arbeitet nicht.</B> Geld ist ein Tauschmittel, kein Produktionsmittel. Wer aus Geld allein
          mehr Geld macht, hat nichts geschaffen, was vorher nicht da war. Was er bekommt, kommt von jemand
          anderem.
        </p>
        <p>
          <B>Es trifft die Falschen.</B> Zinsen zahlt, wer Geld braucht. Zinsen bekommt, wer welches übrig
          hat. Über die Zeit fließt Vermögen zuverlässig von unten nach oben.
        </p>
        <p>
          <B>Schulden wachsen von selbst.</B> Wer einmal in Verzug gerät, kommt schwer wieder heraus, weil die
          Summe weiterläuft, auch wenn er nichts tut.
        </p>
      </>
    ),
  },
  {
    id: "was-tun",
    titel: "Was tun, wenn du schon Zinsen hast?",
    inhalt: (
      <>
        <p>
          Fast jeder, der in Deutschland ein Konto hat, hatte schon Zinsen. Das ist kein Grund für Panik und
          schon gar nicht für Verzweiflung.
        </p>
        <Schritte
          schritte={[
            {
              titel: "Aufhören, nicht ausrechnen",
              text: "Dispo auf null setzen, Zinsgutschriften abbestellen, verzinste Konten auflösen, laufende Kredite so schnell wie möglich ablösen. Was künftig nicht mehr anfällt, muss auch nicht bereinigt werden.",
            },
            {
              titel: "Den Betrag ausrechnen",
              text: "Was schon angefallen ist, findest du auf der Jahressteuerbescheinigung oder im Kontoauszug. Eine grobe Schätzung ist besser als gar nichts.",
            },
            {
              titel: "Weitergeben, ohne Lohn zu erwarten",
              text: "Der Betrag wird abgegeben. Das ist keine Spende und zählt nicht als Zakat. Du entledigst dich eines Betrags, der dir nicht zusteht.",
            },
          ]}
        />
        <Hinweis titel="Wohin das Geld darf und wohin nicht">
          <p>
            Hier machen viele denselben Fehler. Zinsgeld gehört <B>nicht</B> in den Moscheebau und nicht in
            Korankopien. Ehrenhafte Zwecke werden von Gelehrten ausdrücklich ausgeschlossen. Was geht: Essen
            und Trinken für Arme, Verbrauchsgüter, direkte Hilfe für Bedürftige. Und ein Punkt, den man leicht
            übersieht: Es reicht nicht, das Geld beiseitezulegen. Wer es liegen lässt, hält es weiterhin.
          </p>
        </Hinweis>
        <p>
          <B>Beim Kredit wird es schwieriger.</B> Wer in einem laufenden Vertrag steckt, sollte prüfen, ob
          eine vorzeitige Ablösung möglich ist und was sie kostet. Wo das nicht geht, zahlt man wie vereinbart
          weiter. Einen Vertrag zu brechen und in noch größere Not zu geraten, ist keine Lösung. Das Ziel ist
          der Ausstieg, nicht der Zusammenbruch. Bei größeren Beträgen und bei einer laufenden Baufinanzierung
          gehört das besprochen, mit einem Gelehrten und mit jemandem, der die Zahlen versteht.
        </p>
      </>
    ),
  },
  {
    id: "missverstaendnisse",
    titel: "Drei Missverständnisse",
    inhalt: (
      <>
        <Checkliste
          punkte={[
            {
              art: "nein",
              text: (
                <>
                  <B>„Ohne Zinsen verliere ich durch die Inflation."</B> Das ist ein echtes Problem, aber kein
                  Argument für Zinsen. Es ist ein Argument dagegen, Geld auf dem Konto liegen zu lassen. Wer
                  sein Geld in Sachwerte legt, also in Anteile an Firmen, in Gold oder in Immobilien, entgeht
                  der Inflation ohne einen einzigen Zins.
                </>
              ),
            },
            {
              art: "nein",
              text: (
                <>
                  <B>„Es gibt in Deutschland keine Alternative."</B> Für den Kredit stimmt das weitgehend, das
                  Angebot ist dünn. Beim Anlegen stimmt es nicht. Geprüfte Fonds, Aktien und Gold sind über
                  jedes normale Depot erreichbar. Was fehlt, ist die Information, nicht das Produkt.
                </>
              ),
            },
            {
              art: "nein",
              text: (
                <>
                  <B>„Ein bisschen Zins ist doch nicht so schlimm."</B> Diese Abwägung steht niemandem außer
                  dir selbst zu, und sie ist auch nicht nötig. Bei den meisten Verträgen liegt die zinsfreie
                  Alternative direkt daneben und kostet nichts extra.
                </>
              ),
            },
          ]}
        />
      </>
    ),
  },
];

const faq: BeitragFrage[] = [
  {
    frage: "Sind Zinsen im Islam haram?",
    antwort:
      "Ja. Das Verbot steht im Quran, unter anderem in Sure 2, Vers 275 sowie 278 und 279. Gemeint ist Geld, das allein durch Zeitablauf mehr wird. Handel, Miete, Lohn und Gewinnbeteiligung sind davon ausdrücklich nicht betroffen.",
  },
  {
    frage: "Ist jeder Aufschlag für spätere Zahlung Zins?",
    antwort:
      "Nein. Verboten ist der Aufschlag auf geliehenes Geld. Verkauft dir ein Händler eine Ware in Raten zu einem höheren Preis, ist das Handel, solange der Preis vor Vertragsschluss feststeht und danach nicht mehr steigt. Sobald eine Bank dazwischentritt und Geld verleiht, ist es wieder Zins.",
  },
  {
    frage: "Sind auch Zinsen haram, die ich bekomme, ohne sie zu wollen?",
    antwort:
      "Bei einem Girokonto fallen Gutschriften manchmal ohne dein Zutun an. Sie werden ausgerechnet und weggegeben, und die Verzinsung wird abgestellt. Anders liegt es bei Tagesgeld, Festgeld und Sparbuch: Dort ist nicht nur der Ertrag das Problem, sondern das Konto selbst, denn du hast es genau dafür eröffnet. Die Zinsen wegzugeben macht ein solches Konto nicht in Ordnung.",
  },
  {
    frage: "Darf ich Zinsgeld an die Moschee spenden?",
    antwort:
      "Nach verbreiteter Auffassung nicht. Ehrenhafte Zwecke wie Moscheebau oder Korankopien werden ausgeschlossen. Üblich ist die Weitergabe an Bedürftige und für Verbrauchsgüter, etwa Essen und Trinken. Wichtig ist auch: Das Geld muss wirklich weitergegeben werden, es beiseitezulegen genügt nicht.",
  },
  {
    frage: "Darf ich für einen Zinskredit bürgen?",
    antwort:
      "Wer mitunterschreibt, steht mit im Zinsvertrag. Aus dem bekannten Bericht, der neben dem Zinsnehmer auch den Zahler, den Schreiber und die Zeugen nennt, leiten Gelehrte ab, dass auch das Mitwirken zählt. Das trifft besonders Eltern, die für ihre Kinder unterschreiben sollen.",
  },
  {
    frage: "Was ist mit Zinsen, die ich in Deutschland zahlen muss, etwa Verzugszinsen vom Amt?",
    antwort:
      "Was der Staat oder ein Gläubiger einseitig auferlegt, hast du nicht vereinbart. Viele Gelehrte behandeln das anders als einen freiwillig geschlossenen Zinsvertrag. Sicher ist: vermeiden, wo es geht.",
  },
  {
    frage: "Ist die Inflation nicht auch eine Art Zins?",
    antwort:
      "Nein. Inflation ist ein Kaufkraftverlust, kein vereinbarter Zuwachs zwischen zwei Vertragsparteien. Sie ist ein Grund, sein Geld anzulegen, aber keine Rechtfertigung für Zinsen.",
  },
];

const beschreibung =
  "Warum Zinsen im Islam verboten sind, warum ein Ratenkauf trotzdem erlaubt sein kann, welche Produkte betroffen sind und was du tun kannst, wenn du schon Zinsen hast.";

const ZinsenImIslam = () => (
  <>
    <Seo
      title="Zinsen im Islam: Was verboten ist und was nicht | finanzmuslim"
      description={beschreibung}
      path="/wissen/zinsen-im-islam"
      jsonLd={beitragJsonLd({
        titel: "Zinsen im Islam",
        beschreibung,
        path: "/wissen/zinsen-im-islam",
        datePublished: "16. August 2026",
        dateModified: "5. September 2026",
        faq,
      })}
    />
    <BeitragSeite
      slug="zinsen-im-islam"
      titel="Zinsen im Islam"
      untertitel="Der Begriff, an dem alles andere hängt. Und das Missverständnis, das die meisten mitschleppen."
      kurzGesagt={[
        "Verboten ist Geld, das mehr wird, nur weil Zeit vergeht.",
        "Nicht die Zeit ist das Problem, sondern der Aufschlag auf geliehenes Geld. Ein Ratenkauf beim Händler ist Handel.",
        "Handel, Miete, Lohn und Gewinnbeteiligung sind ausdrücklich erlaubt.",
        "Betroffen sind Kredit, Dispo, Tagesgeld, Festgeld, Bausparvertrag und auch Verzugszinsen.",
        "Wer schon Zinsen hat: erst abstellen, dann den Betrag weitergeben, aber nicht an Moschee oder Koran.",
        "Wer mitbürgt, steht mit im Vertrag.",
      ]}
      abschnitte={abschnitte}
      faq={faq}
      datePublished="16. August 2026"
      dateModified="5. September 2026"
      boxMitteNach={4}
      rechtshinweis="Dieser Beitrag gibt bekannte Positionen wieder und dient ausschließlich zu Bildungszwecken. Er ist keine Fatwa und ersetzt weder die Auskunft eines Gelehrten noch eine Rechts- oder Anlageberatung. Quranstellen sind sinngemäß wiedergegeben und nicht wörtlich übersetzt. Innerhalb der Rechtsschulen gibt es zu einzelnen Punkten abweichende Auffassungen, besonders beim Umgang mit bereits bestehenden Verträgen und bei der Verwendung des Zinsbetrags. Die Zahlen in den Beispielen sind erfunden."
      boxOben={{
        kategorie: "Vorlage",
        ueberschrift: "Welche deiner Verträge betroffen sind",
        linkZiel: "/vorlagen/vertrags-ampel",
        text: "Grün, gelb oder rot für zwölf Verträge aus dem Alltag.",
        knopf: "Zur Vertrags-Ampel",
      }}
      boxMitte={{
        kategorie: "Depot",
        ueberschrift: "Anlegen, ohne dass Zinsen mitlaufen",
        linkZiel: "/vergleich/depot",
      }}
    >
      <PasstDazu
        punkte={[
          { to: "/wissen/ratenzahlung-haram", name: "Ist Ratenzahlung haram?", text: "der Fall, der im Alltag am häufigsten vorkommt." },
          { to: "/wissen/girokonto-ohne-zinsen", name: "Girokonto ohne Zinsen", text: "was du an deinem Konto in zehn Minuten umstellen kannst." },
          { to: "/wissen/haus-kaufen-ohne-zinsen", name: "Haus kaufen ohne Zinsen", text: "wie das bei der größten Anschaffung des Lebens aussieht." },
          { to: "/wissen/halal-kredit-ohne-zinsen", name: "Kredit ohne Zinsen", text: "welche Verträge einen Kredit ersetzen können." },
        ]}
      />
    </BeitragSeite>
  </>
);

export default ZinsenImIslam;
