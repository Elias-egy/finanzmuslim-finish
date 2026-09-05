import Seo, { beitragJsonLd } from "@/components/Seo";
import BeitragSeite, { type BeitragAbschnitt, type BeitragFrage } from "@/components/BeitragSeite";
import { IlluDispo } from "@/components/illu";
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
  Tabelle,
} from "@/components/beitrag";

const abschnitte: BeitragAbschnitt[] = [
  {
    id: "warum-dispo",
    titel: "Warum der Dispo anders ist als jede andere Schuld",
    inhalt: (
      <>
        <Frage>Ein paar hundert Euro im Minus, jeden Monat wieder ausgeglichen. Ist das schlimm?</Frage>
        <p>
          Der Dispo hat eine Eigenschaft, die ihn von jeder anderen Schuld unterscheidet: Er wird{" "}
          <B>tagesgenau</B> verzinst. Für jeden Tag, an dem dein Konto im Minus steht, entsteht ein neuer
          Zinsbetrag. Es gibt keinen Freibetrag, keine Karenzzeit und keine Untergrenze.
        </p>
        <p>
          Wer dauerhaft im Dispo lebt, hat deshalb nicht einmal eine Zinsschuld gemacht, sondern jeden
          einzelnen Tag eine neue. Und wer nach dem Ausgleichen wieder ins Minus geht, fängt von vorne an.
        </p>
        <Merksatz>
          Der Dispo ist keine Reserve. Er ist ein Kredit, der schon läuft, und der teuerste, den die Bank
          anbietet.
        </Merksatz>
        <Bild text="Was aussieht wie ein Puffer, ist eine Schuld, die täglich mitwächst.">
          <IlluDispo />
        </Bild>
        <p>
          Dazu kommt die Rechenfalle, an der die meisten Rückzahlungspläne scheitern: Auf den Betrag, den
          du im Minus bist, laufen weiter Zinsen auf, während du tilgst. Wer 100 Euro im Monat zurückzahlt
          und dabei 30 Euro Zinsen aufbaut, tilgt in Wahrheit 70. Genau diese Differenz zieht Leute über
          Jahre bis an das Limit, das die Bank ihnen eingeräumt hat.
        </p>
        <Hinweis titel="Kontokorrentkonto, nicht Girokonto">
          <p>
            Ein Konto mit eingeräumtem Dispo ist bankrechtlich ein Kontokorrentkonto. Ein Girokonto ohne
            Dispo ist etwas anderes. Diesen Unterschied brauchst du gleich, wenn du bei der Bank anrufst.
          </p>
        </Hinweis>
      </>
    ),
  },
  {
    id: "schulden-allgemein",
    titel: "Wie Schulden überhaupt beurteilt werden",
    inhalt: (
      <>
        <p>
          Bevor es um den Weg heraus geht, lohnt der Blick auf die Frage darunter. Schulden zu machen ist
          nicht pauschal verboten, aber es ist auch nicht einfach frei.
        </p>
        <p>
          Gelehrte sagen, dass das Urteil von Person zu Person abweicht und je nach Lage jedes der fünf
          Urteile annehmen kann. Es kann verpflichtend sein, sich Geld zu leihen, etwa um eine Familie zu
          ernähren. Es kann erlaubt sein. Und es kann verpönt sein.
        </p>
        <Tabelle
          kopf={["Lage", "Wie es meist eingeordnet wird"]}
          zeilen={[
            ["Grundbedarf, der anders nicht gedeckt werden kann", "kann sogar Pflicht sein"],
            ["Ein sachlicher Grund, mit klarer Rückzahlung", "erlaubt"],
            ["Ohne besonderen Grund, aus Gewohnheit", "verpönt (Makruh)"],
            ["Für einen Lebensstandard, den man sich vorspielt", "verpönt, und der häufigste Fall"],
            ["Mit Zins, egal wofür", "das eigentliche Verbot"],
          ]}
        />
        <p>
          Als Grundhaltung sagen Gelehrte: verpönt, weil Schulden gefährlich sind. Verboten sind sie
          nicht. Es sollte aber einen Grund geben, und man sollte sich dem Thema so weit wie möglich
          entziehen.
        </p>
        <Frage>Was macht Schulden so schwer, wenn sie doch erlaubt sind?</Frage>
        <p>
          Dass sie das Recht eines anderen Menschen sind. Und Rechte von Menschen werden anders behandelt
          als Rechte Allahs: Sie erlöschen nur auf zwei Wegen, durch Begleichen oder durch Erlass des
          Gläubigers. Eine dritte Möglichkeit gibt es nicht.
        </p>
        <Hinweis titel="Insolvenz beendet das Verfahren, nicht die Schuld">
          <p>
            Eine Restschuldbefreiung nach einem Insolvenzverfahren beendet die Forderung nach deutschem
            Recht. Nach Auffassung der Gelehrten befreit sie im Diesseits, nicht im Jenseits. Das ist kein
            Argument gegen ein Insolvenzverfahren, wenn es der einzige Weg ist. Es ist ein Argument dafür,
            später zu zahlen, wenn man wieder kann.
          </p>
        </Hinweis>
        <p>
          Überliefert ist bei al-Buchari von Abu Huraira, dass Allah demjenigen erleichtert, der Schulden
          mit der Absicht aufnimmt, sie zurückzuzahlen, und demjenigen nicht, der sie ohne diese Absicht
          aufnimmt. Die Absicht ist also nicht nebensächlich, sie ist der Kern.
        </p>
        <Begriff wort="Verpönt" arabisch="Makrūh">
          Eine Handlung, die nicht verboten ist, von der man aber besser lässt. Wer sie unterlässt, wird
          dafür belohnt; wer sie tut, wird nicht bestraft. Zwischen erlaubt und verboten liegt dieses
          Feld, und Schulden liegen als Grundhaltung darin.
        </Begriff>
      </>
    ),
  },
  {
    id: "weg-eins",
    titel: "Weg 1: einmal ablösen, dann kündigen",
    inhalt: (
      <>
        <p>
          Der bessere der beiden Wege ist der schnellere. Du löst den Dispo in einem Schritt ab, statt ihn
          über Jahre abzutragen, und beendest damit die tägliche Zinsuhr sofort.
        </p>
        <Schritte
          schritte={[
            {
              titel: "Eigenes Vermögen einsetzen",
              text: (
                <>
                  Rücklagen, Goldschmuck, altes Mahr-Gold, ein Sparbuch, alles, was da ist. Gelehrte sagen
                  deutlich: Wer Vermögen hat und im Dispo bleibt, ist verpflichtet, es einzusetzen. „Das
                  ist meine Rücklage" zählt hier nicht, denn eine Rücklage neben einer Zinsschuld ist
                  keine Rücklage, sondern ein Aufschub.
                </>
              ),
            },
            {
              titel: "Ein zinsloses Darlehen im Umfeld",
              text: "Wenn das eigene Vermögen nicht reicht: Familie, Freunde, Gemeinde. Die Rückzahlung wird dabei offen vereinbart, in Schritten oder in einem Jahr am Stück. Das ist der Weg, den Gelehrte an dieser Stelle als besser bezeichnen, weil er die Zinsuhr sofort anhält.",
            },
            {
              titel: "Konto auf Null bringen",
              text: "Erst wenn der Saldo tatsächlich bei null steht, geht der nächste Schritt. Nicht vorher.",
            },
            {
              titel: "Den Dispo aktiv kündigen",
              text: (
                <>
                  Bei der Bank anrufen und sagen: Ich möchte den eingeräumten Dispositionskredit kündigen
                  und vom Kontokorrentkonto auf ein Girokonto ohne Dispo wechseln. Nicht „auf null lassen
                  und mal schauen". <B>Kündigen.</B>
                </>
              ),
            },
          ]}
        />
        <Merksatz>
          Nur auf null zu kommen reicht nicht. Solange der Rahmen steht, ist die Tür offen, und irgendwann
          geht jemand hindurch.
        </Merksatz>
        <Frage>Warum redet mir der Bankberater das aus?</Frage>
        <p>
          Weil die Bank an diesen Zinsen verdient. Das ist kein böser Wille, es ist ihr Geschäft. Rechne
          damit, dass dir gesagt wird, der Dispo koste ja nichts, solange man ihn nicht nutzt, und es sei
          doch gut, ihn „für alle Fälle“ zu haben. Bleib dabei. Es ist dein Konto.
        </p>
      </>
    ),
  },
  {
    id: "weg-zwei",
    titel: "Weg 2: sich in Schritten selbst herausarbeiten",
    inhalt: (
      <>
        <p>
          Wenn es kein Vermögen gibt und niemanden, der aushelfen kann, bleibt der zweite Weg. Er dauert
          länger und funktioniert trotzdem, wenn man ihn nüchtern angeht.
        </p>
        <Hinweis titel="Der Realismus vorweg">
          <p>
            Du wirst nicht in einem Monat auf null kommen. Du hast Fixkosten, du hast laufende Ausgaben,
            und der Betrag im Minus wächst währenddessen weiter. Ein Plan, der das ignoriert, scheitert im
            zweiten Monat. Ein Plan, der es einrechnet, hält.
          </p>
        </Hinweis>
        <Schritte
          schritte={[
            {
              titel: "Ausgaben senken, bis ein Überschuss entsteht",
              text: "Nicht alles auf einmal, aber ernsthaft. Abos, Lieferdienste, Verträge, die niemand nutzt. Ziel ist ein fester Betrag, der jeden Monat übrig bleibt und ins Minus wandert.",
            },
            {
              titel: "Das Minus in festen Schritten abbauen",
              text: "Als grobe Orientierung nennen Gelehrte Schritte von etwa 200 bis 300 Euro im Monat für eine Familie mit Kindern und etwa 400 bis 500 für Alleinstehende oder Paare ohne Kinder. Das sind Erfahrungswerte, keine Vorgaben. Deine Zahl ergibt sich aus deinem Haushalt, nicht aus einer Tabelle.",
            },
            {
              titel: "Das Limit mitziehen lassen",
              text: (
                <>
                  Sobald du dauerhaft unter einer Schwelle bist, lässt du das Dispolimit von der Bank
                  senken. Damit kannst du nicht mehr zurückrutschen. Wichtig: Der Bank gegenüber darfst du
                  dabei nicht lügen. Wenn du mit einer Schuldnerberatung sprichst, kannst du das sagen,
                  weil es stimmt. Erfinden darfst du es nicht.
                </>
              ),
            },
            {
              titel: "Bei null: kündigen",
              text: "Derselbe letzte Schritt wie bei Weg 1. Ohne ihn ist die Arbeit von Monaten nach einer teuren Autoreparatur wieder weg.",
            },
          ]}
        />
        <Beispiel
          titel="Warum der Zinsanteil den Plan bestimmt"
          rechnung={["Minus: 2.000 €", "Rückzahlung im Monat: 200 €", "Zinsen im Monat: läuft weiter auf den Restbetrag"]}
          ergebnis="Jeder Monat tilgt weniger als 200 Euro. Wer mit 200 rechnet, plant zu kurz."
        >
          <p>
            Der Zinssatz steht in deinen Kontounterlagen und im Preis- und Leistungsverzeichnis deiner
            Bank. Nimm ihn heraus und rechne einmal ehrlich durch, wie lange es wirklich dauert. Diese
            eine Rechnung motiviert mehr als jeder Vorsatz.
          </p>
        </Beispiel>
      </>
    ),
  },
  {
    id: "andere-schulden",
    titel: "Andere Schulden, dieselbe Reihenfolge",
    inhalt: (
      <>
        <p>
          Wer mehrere Schulden hat, braucht eine Reihenfolge. Sie ergibt sich fast von selbst, wenn man
          zwei Fragen stellt: Wo läuft eine Zinsuhr, und wessen Recht ist das hier?
        </p>
        <Checkliste
          punkte={[
            { art: "ja", text: "Zuerst alles, was verzinst ist: Dispo, Kreditkarten-Teilzahlung, Ratenkredite. Hier kostet jeder Tag Geld und ist zugleich das eigentliche Problem." },
            { art: "ja", text: "Danach zinslose Schulden bei Menschen. Sie kosten nichts, sind aber das Recht einer Person und wiegen deshalb schwer." },
            { art: "ja", text: "Kaufverträge in Raten ohne Zins laufen weiter wie vereinbart. Sie sind kein Notfall, aber auch nichts, was man vergisst." },
            { art: "neutral", text: "Ein offener Mahr ist eine Schuld wie jede andere. Wer ihn versprochen hat, schuldet ihn, auch wenn nie darüber gesprochen wird." },
            { art: "nein", text: "Nicht neue Schulden aufnehmen, um alte zu bedienen, solange die neue verzinst ist. Damit verschiebt man nur, was ohnehin fällig wird." },
          ]}
        />
        <p>
          Und der praktische Teil, den viele vergessen: Schreib auf, was du wem schuldest, mit Betrag und
          Datum. Nicht für die Bank, sondern für deine Familie. Was niemand weiß, kann niemand begleichen.
        </p>
        <Frage>Und wenn ich sterbe, bevor ich alles zurückgezahlt habe?</Frage>
        <p>
          Aus dem Nachlass werden zuerst die Bestattungskosten gedeckt, danach die Schulden, und erst
          danach kommt ein Vermächtnis oder die Verteilung an die Erben. Das ist die Reihenfolge, die im
          islamischen Erbrecht steht, und sie ist ein Grund mehr, die eigenen Schulden aufzuschreiben.
          Mehr dazu in <L to="/wissen/erbe">Erbe nach islamischem Recht</L>.
        </p>
      </>
    ),
  },
  {
    id: "vorbeugen",
    titel: "Damit es nicht wieder passiert",
    inhalt: (
      <>
        <p>
          Der Dispo entsteht selten durch eine große Ausgabe. Er entsteht durch drei kleine in einem
          Monat, in dem etwas kaputtgeht. Wer diesen Monat vorher plant, braucht den Rahmen nicht.
        </p>
        <Checkliste
          punkte={[
            { art: "ja", text: "Eine Rücklage aufbauen, die etwa drei Monatsausgaben deckt. Auf einem eigenen Konto ohne Karte, damit sie nicht im Alltag verschwindet." },
            { art: "ja", text: "Ein Konto ohne Dispo führen. Wer kein Minus haben kann, macht keins." },
            { art: "ja", text: "Größere Ausgaben, die sicher kommen, monatlich zurücklegen: Versicherung, Reparaturen, Autosteuer, Reisen." },
            { art: "nein", text: "Keine Teilzahlung bei Kreditkarten aktivieren. Das ist derselbe Mechanismus mit einem anderen Namen." },
            { art: "nein", text: "Keine Rücklage neben einer laufenden Zinsschuld. Erst tilgen, dann sparen." },
          ]}
        />
        <p>
          Ein Konto ohne Dispo aufzusetzen ist der Schritt, der die meiste Wirkung hat und am wenigsten
          Arbeit macht. Welche Punkte dabei zählen, steht in{" "}
          <L to="/wissen/girokonto-ohne-zinsen">Girokonto ohne Zinsen</L>.
        </p>
        <Merksatz>
          Wer den Rahmen kündigt, muss nicht jeden Monat neu diszipliniert sein. Er hat die Entscheidung
          einmal getroffen.
        </Merksatz>
      </>
    ),
  },
];

const faq: BeitragFrage[] = [
  {
    frage: "Ist ein Dispokredit haram?",
    antwort:
      "Ihn zu nutzen schon, weil auf jeden Tag im Minus Zinsen anfallen. Damit entsteht nicht einmal eine Zinsschuld, sondern mit jedem erneuten Ins-Minus-Gehen eine neue. Der eingeräumte Rahmen allein kostet nichts, ist aber die offene Tür dorthin, weshalb Gelehrte empfehlen, ihn zu kündigen.",
  },
  {
    frage: "Sind Schulden im Islam verboten?",
    antwort:
      "Nein. Schulden zu machen ist nicht verboten, aber auch nicht frei. Als Grundhaltung gilt es als verpönt, weil Schulden gefährlich sind, und es sollte einen Grund geben. Je nach Lage kann es sogar verpflichtend sein, etwa um den Grundbedarf einer Familie zu decken. Verboten ist der Zins, nicht die Schuld.",
  },
  {
    frage: "Wie komme ich aus dem Dispo raus?",
    antwort:
      "Auf zwei Wegen. Der bessere ist, ihn in einem Schritt abzulösen, aus eigenem Vermögen oder mit einem zinslosen Darlehen im Umfeld, und den Dispo danach aktiv zu kündigen. Der zweite ist, sich in festen monatlichen Schritten herauszuarbeiten, dabei das Limit schrittweise senken zu lassen und am Ende ebenfalls zu kündigen.",
  },
  {
    frage: "Muss ich mein Gold verkaufen, um den Dispo zu tilgen?",
    antwort:
      "Nach verbreiteter Auffassung ja. Wer Vermögen hat, sei es Schmuck, altes Mahr-Gold oder eine Rücklage, ist verpflichtet, es einzusetzen, um aus der Zinsschuld herauszukommen. Das Argument, es sei eine Sparanlage, zählt dabei nicht, denn eine Rücklage neben einer laufenden Zinsschuld schiebt das Problem nur auf.",
  },
  {
    frage: "Reicht es, den Dispo auf null zu bringen?",
    antwort:
      "Nein. Solange der eingeräumte Rahmen besteht, kannst du jederzeit wieder hineinrutschen, und jedes erneute Ins-Minus-Gehen ist eine neue Zinsschuld. Der Rahmen muss aktiv gekündigt werden, üblicherweise mit dem Wechsel vom Kontokorrentkonto auf ein Girokonto ohne Dispo.",
  },
  {
    frage: "Befreit eine Privatinsolvenz von der Schuld?",
    antwort:
      "Nach deutschem Recht endet die Forderung mit der Restschuldbefreiung. Nach Auffassung der Gelehrten befreit das im Diesseits, nicht im Jenseits, weil eine Schuld das Recht eines Menschen ist und nur durch Zahlung oder durch Erlass des Gläubigers erlischt. Wer später wieder kann, sollte deshalb nachzahlen.",
  },
  {
    frage: "Wie viel sollte ich im Monat zurückzahlen?",
    antwort:
      "Als grobe Orientierung werden Schritte von etwa 200 bis 300 Euro monatlich für eine Familie mit Kindern und etwa 400 bis 500 Euro für Alleinstehende oder Paare ohne Kinder genannt. Das sind Erfahrungswerte, keine Vorgaben. Entscheidend ist, dass der Betrag über den monatlich auflaufenden Zinsen liegt, sonst sinkt das Minus nicht.",
  },
  {
    frage: "Was passiert mit meinen Schulden, wenn ich sterbe?",
    antwort:
      "Aus dem Nachlass werden zuerst die Bestattungskosten gedeckt, danach die Schulden beglichen, und erst der Rest wird vererbt. Deshalb gehört eine Liste der eigenen Schulden zu den Unterlagen, die die Familie findet. Was niemand kennt, kann niemand begleichen.",
  },
];

const beschreibung =
  "Der Dispo wird tagesgenau verzinst, deshalb ist er die teuerste Schuld im Alltag. Die zwei Wege heraus, warum das Kündigen wichtiger ist als das Ausgleichen und wie Schulden islamisch überhaupt beurteilt werden.";

const DispoUndSchulden = () => (
  <>
    <Seo
      title="Dispo und Schulden: die zwei Wege heraus | finanzmuslim"
      description={beschreibung}
      path="/wissen/dispo-und-schulden"
      jsonLd={beitragJsonLd({
        titel: "Dispo und Schulden",
        beschreibung,
        path: "/wissen/dispo-und-schulden",
        datePublished: "5. September 2026",
        dateModified: "5. September 2026",
        faq,
      })}
    />
    <BeitragSeite
      slug="dispo-und-schulden"
      titel="Dispo und Schulden"
      untertitel="Zwei Wege aus dem Minus, und warum der letzte Schritt das Kündigen ist."
      kurzGesagt={[
        "Der Dispo wird tagesgenau verzinst. Jedes erneute Ins-Minus-Gehen ist eine neue Zinsschuld.",
        "Weg 1: ablösen aus eigenem Vermögen oder mit einem zinslosen Darlehen, dann kündigen.",
        "Weg 2: in festen monatlichen Schritten heraus, Limit mitziehen lassen, am Ende kündigen.",
        "Nur auf null zu kommen reicht nicht. Solange der Rahmen steht, bleibt die Tür offen.",
        "Schulden sind nicht verboten, aber verpönt. Sie erlöschen nur durch Zahlung oder durch Erlass.",
      ]}
      abschnitte={abschnitte}
      faq={faq}
      datePublished="5. September 2026"
      dateModified="5. September 2026"
      boxMitteNach={3}
      rechtshinweis="Dieser Beitrag gibt bekannte Positionen wieder und dient ausschließlich zu Bildungszwecken. Er ist keine Fatwa und keine Rechts-, Steuer- oder Schuldnerberatung. Zur Einordnung einzelner Schuldsituationen und zur Pflicht, vorhandenes Vermögen einzusetzen, bestehen unter Gelehrten unterschiedliche Auffassungen. Die genannten monatlichen Beträge sind grobe Erfahrungswerte, keine Empfehlungen für einen konkreten Haushalt. Wer überschuldet ist, sollte zusätzlich eine anerkannte Schuldnerberatung aufsuchen."
      boxOben={{
        kategorie: "Weiterlesen",
        ueberschrift: "Ein Konto, in dem kein Minus möglich ist",
        linkZiel: "/wissen/girokonto-ohne-zinsen",
        text: "Der Schritt, der den Rückfall verhindert, in zehn Minuten.",
        knopf: "Zum Girokonto",
      }}
      boxMitte={{
        kategorie: "Weiterlesen",
        ueberschrift: "Die Karte, die denselben Mechanismus hat",
        linkZiel: "/wissen/kreditkarte-halal",
        text: "Warum ein Kreditrahmen kein Guthaben ist.",
        knopf: "Zur Kreditkarte",
      }}
    >
      <PasstDazu
        punkte={[
          { to: "/wissen/girokonto-ohne-zinsen", name: "Girokonto ohne Zinsen", text: "zeigt, wie du ein Konto ohne Dispo aufsetzt." },
          { to: "/wissen/kreditkarte-halal", name: "Kreditkarte", text: "erklärt die Teilzahlung, den zweiten Weg in dieselbe Falle." },
          { to: "/wissen/zinsen-im-islam", name: "Zinsen im Islam", text: "sagt, was am Zins genau das Problem ist." },
          { to: "/wissen/erbe", name: "Erbe nach islamischem Recht", text: "erklärt, warum Schulden vor dem Erbe kommen." },
        ]}
      />
    </BeitragSeite>
  </>
);

export default DispoUndSchulden;
