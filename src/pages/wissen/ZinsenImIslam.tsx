import Seo, { beitragJsonLd } from "@/components/Seo";
import BeitragSeite, { type BeitragAbschnitt } from "@/components/BeitragSeite";
import { IlluZins, IlluHandel } from "@/components/illu";
import { Link } from "react-router-dom";

const Bild = ({ children, text }: { children: React.ReactNode; text: string }) => (
  <figure className="my-6">
    <div className="overflow-hidden rounded-2xl">{children}</div>
    <figcaption className="mt-2 text-[14px] text-muted-foreground">{text}</figcaption>
  </figure>
);

/** Zwei Spalten: betroffen und nicht betroffen. */
const Spalte = ({
  titel,
  punkte,
  ton,
}: {
  titel: string;
  punkte: string[];
  ton: "ok" | "kritisch";
}) => (
  <div className="card-surface p-5">
    <p
      className={`text-[17px] font-bold ${
        ton === "ok" ? "text-[hsl(var(--success))]" : "text-[hsl(var(--destructive))]"
      }`}
    >
      {titel}
    </p>
    <ul className="mt-3 space-y-2 text-[16px] text-muted-foreground">
      {punkte.map((p) => (
        <li key={p}>{p}</li>
      ))}
    </ul>
  </div>
);

const abschnitte: BeitragAbschnitt[] = [
  {
    id: "worum-es-geht",
    titel: "Worum es eigentlich geht",
    inhalt: (
      <>
        <p>
          Das Zinsverbot heißt auf Arabisch <strong>Riba</strong>. Übersetzt bedeutet das Wort
          Zuwachs oder Vermehrung. Gemeint ist eine ganz bestimmte Art von Zuwachs:
        </p>
        <p className="rounded-xl bg-hero p-5 text-[19px] font-bold text-foreground">
          Geld, das mehr wird, nur weil Zeit vergeht.
        </p>
        <p>
          Du leihst jemandem 100 Euro und willst 110 zurück. Für die zusätzlichen 10 Euro hat
          niemand gearbeitet, niemand etwas hergestellt und niemand ein Risiko getragen. Sie
          entstehen allein daraus, dass ein Jahr vergangen ist.
        </p>
        <p>
          Genau das ist der Kern. Nicht Gewinn ist verboten, nicht Handel, nicht Reichtum. Verboten
          ist der Zuwachs ohne Gegenleistung und ohne Risiko.
        </p>
        <Bild text="Links und rechts steht dasselbe Geld. Der einzige Unterschied ist die Zeit dazwischen. Genau das meint das Zinsverbot.">
          <IlluZins />
        </Bild>
      </>
    ),
  },
  {
    id: "quellen",
    titel: "Wo das herkommt",
    inhalt: (
      <>
        <p>
          Das Verbot steht mehrfach im Quran. Die bekannteste Stelle ist{" "}
          <strong>Sure 2, Vers 275</strong>. Dort wird der Handel ausdrücklich erlaubt und der Zins
          ausdrücklich davon abgegrenzt. Das ist der wichtigste Satz für das Verständnis: Es geht
          nicht darum, Geld zu vermehren, sondern darum, wie.
        </p>
        <p>
          In den <strong>Versen 278 und 279</strong> derselben Sure wird es deutlicher. Wer nicht
          davon ablässt, dem wird Krieg von Gott und seinem Gesandten angekündigt. Diese Schärfe
          findet sich im Quran bei kaum einem anderen Thema im Bereich des Geldes. Zugleich steht
          dort, dass man sein eingesetztes Kapital behalten darf. Man soll niemanden ausbeuten und
          selbst nicht ausgebeutet werden.
        </p>
        <p>
          In der Überlieferung des Propheten wird das ausgeweitet. Ein bekannter Hadith nennt nicht
          nur den, der Zinsen nimmt, sondern auch den, der sie zahlt, den, der den Vertrag
          aufschreibt, und die Zeugen. Daraus leiten viele Gelehrte ab, dass auch das Mitwirken
          zählt, nicht nur das Verdienen.
        </p>
        <p>
          Das ist bewusst kurz gehalten und ohne wörtliche Übersetzung. Wer die Stellen genau lesen
          will, sollte sie in einer Ausgabe mit Kommentar nachschlagen oder mit jemandem
          durchgehen, der sich damit auskennt.
        </p>
      </>
    ),
  },
  {
    id: "zwei-arten",
    titel: "Es gibt zwei Arten, und beide begegnen dir im Alltag",
    inhalt: (
      <>
        <p>
          Gelehrte unterscheiden zwei Formen. Die Namen musst du dir nicht merken, die Unterschiede
          schon.
        </p>
        <p>
          <strong>Die erste ist der Zins auf Zeit.</strong> Das ist der Fall, den jeder kennt.
          Kredit, Dispo, Tagesgeld, Festgeld, Bausparvertrag. Geld wird verliehen und kommt größer
          zurück. Auf Arabisch heißt das Riba an-Nasi'a, wörtlich der Zins des Aufschubs.
        </p>
        <p>
          <strong>Die zweite ist der ungleiche Tausch.</strong> Sie betrifft bestimmte Waren, vor
          allem Gold, Silber und einige Grundnahrungsmittel. Bei ihnen gilt: Tauscht man Gleiches
          gegen Gleiches, muss die Menge gleich sein und die Übergabe sofort erfolgen. Auf Arabisch
          Riba al-Fadl. Deshalb gelten beim{" "}
          <Link to="/wissen/halal-gold-kaufen" className="text-primary hover:underline">
            Goldkauf
          </Link>{" "}
          besondere Regeln.
        </p>
        <p>
          Für den Alltag in Deutschland ist die erste Form die wichtigere. Sie steckt in fast jedem
          Bankprodukt.
        </p>
      </>
    ),
  },
  {
    id: "betroffen",
    titel: "Was betroffen ist und was nicht",
    inhalt: (
      <>
        <p>
          Viele meinen, im Islam sei fast alles rund ums Geld verboten. Das Gegenteil stimmt. Der
          allergrößte Teil des Wirtschaftslebens ist ausdrücklich erlaubt.
        </p>
        <div className="my-6 grid gap-4 md:grid-cols-2">
          <Spalte
            titel="Zins, also betroffen"
            ton="kritisch"
            punkte={[
              "Ratenkredit und Autokredit",
              "Dispo auf dem Girokonto",
              "Tagesgeld und Festgeld",
              "Bausparvertrag",
              "Klassische Lebens- und Rentenversicherung",
              "Anleihen mit festem Kupon",
              "Kreditkarte mit Teilzahlung",
            ]}
          />
          <Spalte
            titel="Kein Zins, also erlaubt"
            ton="ok"
            punkte={[
              "Handel, kaufen und verkaufen",
              "Miete und Vermietung",
              "Gewinn aus einem Unternehmen",
              "Aktien, wenn die Firma geprüft ist",
              "Lohn für Arbeit",
              "Gewinnbeteiligung mit geteiltem Risiko",
              "Ein zinsloses Darlehen unter Freunden",
            ]}
          />
        </div>
        <p>
          Der Unterschied ist immer derselbe. Wo jemand ein Risiko trägt oder eine Leistung
          erbringt, ist der Ertrag verdient. Wo jemand nur wartet, ist er es nicht.
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
        <p>
          Die Frage kommt oft, gerade von jüngeren Leuten, und sie ist berechtigt. Es gibt mehrere
          Begründungen, die Gelehrte anführen.
        </p>
        <p>
          <strong>Das Risiko wird einseitig verteilt.</strong> Wer Zinsen bekommt, verdient
          unabhängig davon, ob das Geschäft des anderen läuft. Geht es schief, trägt es der eine
          allein. Bei einer Gewinnbeteiligung tragen beide.
        </p>
        <p>
          <strong>Geld arbeitet nicht.</strong> Geld ist ein Tauschmittel, kein Produktionsmittel.
          Wer aus Geld allein mehr Geld macht, hat nichts geschaffen, was vorher nicht da war. Was
          er bekommt, kommt von jemand anderem.
        </p>
        <p>
          <strong>Es trifft die Falschen.</strong> Zinsen zahlt, wer Geld braucht. Zinsen bekommt,
          wer welches übrig hat. Über die Zeit fließt Vermögen zuverlässig von unten nach oben.
        </p>
        <p>
          <strong>Schulden wachsen von selbst.</strong> Wer einmal in Verzug gerät, kommt schwer
          wieder heraus, weil die Summe weiterläuft, auch wenn er nichts tut.
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
          Fast jeder, der in Deutschland ein Konto hat, hatte schon Zinsen. Das ist kein Grund für
          Panik und schon gar nicht für Verzweiflung.
        </p>
        <p>
          <strong>Der erste Schritt ist immer das Aufhören.</strong> Dispo auf null setzen,
          Zinsgutschriften abbestellen, laufende Kredite so schnell wie möglich ablösen. Was künftig
          nicht mehr anfällt, muss auch nicht bereinigt werden.
        </p>
        <p>
          <strong>Für das, was schon da ist, gilt die Reinigung.</strong> Der Zinsanteil wird
          ausgerechnet und weggegeben, ohne dass man dafür eine Belohnung erwartet. Er zählt nicht
          als Zakat und nicht als Sadaqa im üblichen Sinn, sondern gilt als Entledigung. Verbreitet
          ist die Weitergabe an gemeinnützige Zwecke.
        </p>
        <p>
          <strong>Beim Kredit wird es schwieriger.</strong> Wer in einem laufenden Vertrag steckt,
          sollte prüfen, ob eine vorzeitige Ablösung möglich ist und was sie kostet. Wo das nicht
          geht, zahlt man wie vereinbart weiter. Einen Vertrag zu brechen und in noch größere Not zu
          geraten, ist keine Lösung. Das Ziel ist der Ausstieg, nicht der Zusammenbruch.
        </p>
        <p>
          Bei größeren Beträgen und bei einer laufenden Baufinanzierung gehört das besprochen, mit
          einem Gelehrten und mit jemandem, der die Zahlen versteht.
        </p>
      </>
    ),
  },
  {
    id: "missverstaendnisse",
    titel: "Drei Missverständnisse",
    inhalt: (
      <>
        <p>
          <strong>„Ohne Zinsen verliere ich durch die Inflation."</strong> Das ist ein echtes
          Problem, aber kein Argument für Zinsen. Es ist ein Argument dagegen, Geld auf dem Konto
          liegen zu lassen. Wer sein Geld in Sachwerte legt, also in Anteile an Firmen, in Gold oder
          in Immobilien, entgeht der Inflation ohne einen einzigen Zins.
        </p>
        <p>
          <strong>„Es gibt in Deutschland keine Alternative."</strong> Für den Kredit stimmt das
          weitgehend, das Angebot ist dünn. Beim Anlegen stimmt es nicht. Geprüfte Fonds, Aktien und
          Gold sind über jedes normale Depot erreichbar. Was fehlt, ist die Information, nicht das
          Produkt.
        </p>
        <p>
          <strong>„Ein bisschen Zins ist doch nicht so schlimm."</strong> Diese Abwägung steht
          niemandem außer dir selbst zu, und sie ist auch nicht nötig. Bei den meisten Verträgen
          liegt die zinsfreie Alternative direkt daneben und kostet nichts extra.
        </p>
      </>
    ),
  },
];

const faq = [
  {
    frage: "Sind Zinsen im Islam haram?",
    antwort:
      "Ja. Das Verbot steht im Quran, unter anderem in Sure 2, Vers 275 sowie 278 und 279. Gemeint ist Geld, das allein durch Zeitablauf mehr wird. Handel, Miete, Lohn und Gewinnbeteiligung sind davon ausdrücklich nicht betroffen.",
  },
  {
    frage: "Sind auch Zinsen haram, die ich bekomme, ohne sie zu wollen?",
    antwort:
      "Gutschriften, die ohne dein Zutun anfallen, etwa auf einem Girokonto, gelten nicht als selbst verursacht. Die verbreitete Empfehlung ist trotzdem, sie nicht zu verbrauchen, sondern auszurechnen und wegzugeben, und die Zinsgutschrift wenn möglich abzustellen.",
  },
  {
    frage: "Was ist mit Zinsen, die ich in Deutschland zahlen muss, etwa Verzugszinsen vom Amt?",
    antwort:
      "Was der Staat oder ein Gläubiger einseitig auferlegt, hast du nicht vereinbart. Viele Gelehrte behandeln das anders als einen freiwillig geschlossenen Zinsvertrag. Sicher ist: vermeiden, wo es geht.",
  },
  {
    frage: "Warum findet man zu 'riba' so wenig auf Deutsch?",
    antwort:
      "Weil kaum jemand danach sucht. Die Zielgruppe in Deutschland sucht nach 'Zinsen Islam' oder 'Zinsen haram'. Der arabische Begriff ist unter Gelehrten üblich, im Alltag hier aber selten.",
  },
  {
    frage: "Ist die Inflation nicht auch eine Art Zins?",
    antwort:
      "Nein. Inflation ist ein Kaufkraftverlust, kein vereinbarter Zuwachs zwischen zwei Vertragsparteien. Sie ist ein Grund, sein Geld anzulegen, aber keine Rechtfertigung für Zinsen.",
  },
];

const ZinsenImIslam = () => (
  <>
    <Seo
      title="Zinsen im Islam: Was verboten ist und was nicht | finanzmuslim"
      description="Warum Zinsen im Islam verboten sind, was der Quran dazu sagt, welche Produkte betroffen sind und welche nicht, und was du tun kannst, wenn du schon Zinsen hast."
      path="/wissen/zinsen-im-islam"
      jsonLd={beitragJsonLd({
        titel: "Zins, also betroffen",
        beschreibung: "Warum Zinsen im Islam verboten sind, was der Quran dazu sagt, welche Produkte betroffen sind und welche nicht, und was du tun kannst, wenn du schon Zinsen hast.",
        path: "/wissen/zinsen-im-islam",
        geprueftAm: "16. August 2026",
        faq,
      })}
    />
    <BeitragSeite
      titel="Zinsen im Islam"
      kurzGesagt={[
        "Verboten ist Geld, das mehr wird, nur weil Zeit vergeht.",
        "Handel, Miete, Lohn und Gewinnbeteiligung sind ausdrücklich erlaubt.",
        "Betroffen sind Kredit, Dispo, Tagesgeld, Festgeld und Bausparvertrag.",
        "Wer schon Zinsen hat: erst abstellen, dann den Zinsanteil weggeben.",
        "Die Inflation ist kein Argument für Zinsen, sondern eines fürs Anlegen.",
      ]}
      abschnitte={abschnitte}
      faq={faq}
      geprueftAm="16. August 2026"
      rechtshinweis="Dieser Beitrag gibt bekannte Positionen wieder und dient ausschließlich zu Bildungszwecken. Er ist keine Fatwa und ersetzt weder die Auskunft eines Gelehrten noch eine Rechts- oder Anlageberatung. Quranstellen sind sinngemäß wiedergegeben und nicht wörtlich übersetzt. Innerhalb der Rechtsschulen gibt es zu einzelnen Punkten abweichende Auffassungen, besonders beim Umgang mit bereits bestehenden Verträgen."
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
      <section className="card-surface p-6">
        <h2 className="text-[19px] font-bold text-foreground">Passt dazu</h2>
        <ul className="mt-3 space-y-2 text-[16px]">
          <li>
            <Link to="/wissen/haus-kaufen-ohne-zinsen" className="text-primary hover:underline">
              Haus kaufen ohne Zinsen
            </Link>{" "}
            zeigt, wie das bei der größten Anschaffung des Lebens aussieht.
          </li>
          <li>
            <Link to="/wissen/girokonto-ohne-zinsen" className="text-primary hover:underline">
              Girokonto ohne Zinsen
            </Link>{" "}
            erklärt, was du an deinem Konto in zehn Minuten umstellen kannst.
          </li>
          <li>
            <Link to="/wissen/ratenzahlung-haram" className="text-primary hover:underline">
              Ist Ratenzahlung haram?
            </Link>{" "}
            behandelt den Fall, der im Alltag am häufigsten vorkommt.
          </li>
        </ul>
      </section>
    </BeitragSeite>
  </>
);

export default ZinsenImIslam;
