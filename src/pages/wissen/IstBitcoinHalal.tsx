import Seo, { beitragJsonLd } from "@/components/Seo";
import BeitragSeite, { type BeitragAbschnitt, type BeitragFrage } from "@/components/BeitragSeite";
import { IlluHandel, IlluKryptoDrei } from "@/components/illu";
import {
  B,
  Bild,
  Checkliste,
  Faelle,
  Frage,
  Gegenueber,
  Hinweis,
  L,
  Merksatz,
  PasstDazu,
} from "@/components/beitrag";

const abschnitte: BeitragAbschnitt[] = [
  {
    id: "kurze-antwort",
    titel: "Die kurze Antwort",
    inhalt: (
      <>
        <p>
          Es gibt keine einheitliche Antwort. Gelehrte sind sich bei Bitcoin uneins, und das ist keine Ausrede,
          sondern der ehrliche Stand.
        </p>
        <p>
          Es gibt Gutachten, die Bitcoin als zulässig einordnen. Das Shariyah Review Bureau aus Bahrain hat
          2022 ein solches Gutachten vorgelegt, und für Ether gibt es ein Shariah White Paper von Amanie
          Advisors zusammen mit der Ethereum Foundation aus dem Jahr 2019. Es gibt aber ebenso Gremien, die
          ablehnen, unter anderem Behörden in einigen muslimischen Ländern.
        </p>
        <Merksatz>
          Worüber sich fast alle einig sind: Wenn Krypto, dann nur ein kleiner Teil des Vermögens, nur mit
          echtem Besitz, und ohne Hebel.
        </Merksatz>
      </>
    ),
  },
  {
    id: "drei-arten",
    titel: "Krypto ist nicht gleich Krypto: drei Kategorien",
    inhalt: (
      <>
        <p>
          Der häufigste Fehler in dieser Diskussion ist, alles in einen Topf zu werfen. Unter dem Wort Krypto
          stecken drei sehr verschiedene Dinge, und sie werden auch sehr verschieden beurteilt.
        </p>
        <Bild text="Drei Kategorien, drei Urteile. Wer sie vermischt, kommt zwangsläufig zu einer falschen Antwort.">
          <IlluKryptoDrei />
        </Bild>
        <Faelle
          faelle={[
            {
              titel: "Digitales Zentralbankgeld",
              ton: "gruen",
              wort: "unproblematisch",
              text: "Ein Euro oder Dirham in digitaler Form, herausgegeben von einer Zentralbank. Das ist schlicht Geld in einer anderen Verpackung. Es gelten dieselben Regeln wie für Bargeld, also auch die Regeln für den Tausch von Währungen.",
            },
            {
              titel: "Bitcoin, Ether und die großen Netzwerke",
              ton: "gelb",
              wort: "umstritten",
              text: "Hier liegt der eigentliche Streit. Es gibt Gutachten in beide Richtungen, und beide sind ernstzunehmend begründet.",
            },
            {
              titel: "Meme-Coins",
              ton: "rot",
              wort: "ausgeschlossen",
              text: "Ein Token ohne Zweck, ohne Projekt, ohne Nutzen. Der Preis hängt allein daran, ob nach dir noch jemand kauft. Das ist eine Wette auf die Nachfrage, und darüber sind sich Gelehrte weitgehend einig.",
            },
          ]}
        />
      </>
    ),
  },
  {
    id: "streitpunkt",
    titel: "Worüber genau gestritten wird",
    inhalt: (
      <>
        <Frage>Ist Bitcoin eine Währung oder eine Ware?</Frage>
        <p>
          Das ist die eigentliche Frage, und an ihr hängt fast alles. Ist es eine Währung, gelten die strengen
          Tauschregeln für Geld: sofortige Übergabe, kein Aufschlag für Zeit. Ist es eine Ware, ist es einfach
          etwas, das man kaufen und verkaufen kann.
        </p>
        <Gegenueber
          links={{
            titel: "Wer es für zulässig hält",
            punkte: [
              "Es ist knapp, übertragbar, und Menschen messen ihm Wert bei.",
              "Es wird als Gegenleistung akzeptiert, also erfüllt es die Merkmale eines Vermögenswerts.",
              "Dass man es nicht anfassen kann, spielt keine Rolle. Rechte und Lizenzen kann man auch nicht anfassen.",
            ],
          }}
          rechts={{
            titel: "Wer es ablehnt",
            punkte: [
              "Dahinter steht kein realer Gegenwert, keine Firma, kein Metall, kein Staat.",
              "Es ist von keiner Stelle als Geld anerkannt, für die man haftbar machen könnte.",
              "Der schwerste Einwand betrifft die Folgen, nicht das Ding selbst. Dazu gleich mehr.",
            ],
          }}
        />
        <Hinweis titel="Zwei Argumente, die man oft hört und die nicht tragen">
          <p>
            <B>Die Schwankung.</B> Bitcoin schwankt stark, das stimmt. Aber Schwankung allein macht nichts
            verboten, sonst wäre jede Aktie und jeder Rohstoff betroffen. Die Unsicherheit, um die es im
            islamischen Recht geht, betrifft den <B>Vertrag</B>, also ob klar ist, was du bekommst, nicht wie
            sich der Preis danach entwickelt.
          </p>
          <p>
            <B>Die Dezentralität.</B> Dass keine Regierung dahintersteht, ist ein politisches Argument, kein
            islamisches. Auch Gold ist von keiner Regierung ausgegeben.
          </p>
        </Hinweis>
        <p>
          Der Einwand, der wirklich Gewicht hat, ist ein anderer: Gelehrte betrachten nicht nur die Sache
          selbst, sondern auch, <B>wohin eine Freigabe führt</B>. Bei Krypto führt sie erfahrungsgemäß direkt
          zu Hebel, Lending und Meme-Coins, also zu genau den Dingen, die unstrittig ausgeschlossen sind. Wer
          diesem Gedanken folgt, hält den Einstieg deshalb für riskant, auch wenn Bitcoin selbst vielleicht
          nicht das Problem wäre.
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
          Unabhängig davon, welcher Auffassung du folgst, sind sich die Gelehrten bei diesen Punkten einig.
        </p>
        <Checkliste
          punkte={[
            {
              art: "nein",
              text: (
                <>
                  <B>Hebel und Futures.</B> Wer mit geliehenem Geld auf Kursrichtungen wettet, verlässt jede
                  Diskussion über Bitcoin. Das ist ein verzinstes Darlehen plus Wette in einem. Mehr dazu in{" "}
                  <L to="/wissen/maysir">Glücksspiel (Maysir)</L>.
                </>
              ),
            },
            {
              art: "nein",
              text: (
                <>
                  <B>Lending und feste Zinsen.</B> Wenn dir eine Plattform garantiert, dass aus hundert Coins in
                  einem Jahr hundertfünf werden, ist das ein Zinsversprechen. Der Name ändert daran nichts.
                </>
              ),
            },
            {
              art: "nein",
              text: (
                <>
                  <B>Staking mit garantiertem Ertrag.</B> Hier gehen die Meinungen weiter auseinander, aber
                  sobald ein fester Ertrag zugesagt wird, gilt derselbe Einwand wie beim Lending.
                </>
              ),
            },
            {
              art: "nein",
              text: (
                <>
                  <B>Coins mit verbotenem Zweck.</B> Ein Token, der an ein Glücksspielprojekt oder eine
                  Zinsplattform gebunden ist, ist unabhängig von der Technik ausgeschlossen.
                </>
              ),
            },
            {
              art: "nein",
              text: (
                <>
                  <B>Meme-Coins.</B> Kein Projekt, kein Nutzen, nur die Hoffnung, dass nach dir jemand mehr
                  zahlt.
                </>
              ),
            },
          ]}
        />
      </>
    ),
  },
  {
    id: "wenn-dann",
    titel: "Wenn du dich dafür entscheidest",
    inhalt: (
      <>
        <p>Dann gelten drei Regeln, die aus den Gutachten immer wieder hervorgehen.</p>
        <Checkliste
          punkte={[
            {
              art: "ja",
              text: (
                <>
                  <B>Echter Besitz.</B> Du musst die Coins wirklich haben, nicht nur einen Anspruch darauf.
                  Produkte, die den Kurs nur nachbilden, ohne dass irgendwo Coins liegen, erfüllen das nicht.
                </>
              ),
            },
            {
              art: "ja",
              text: (
                <>
                  <B>Kleiner Anteil.</B> Krypto schwankt stärker als alles andere. In unserer{" "}
                  <L to="/halal-anlagen">Anlagen-Übersicht</L> stehen Bitcoin und Ether deshalb in einem
                  eigenen Block und nicht in der Haupttabelle.
                </>
              ),
            },
            {
              art: "ja",
              text: (
                <>
                  <B>Zakat nicht vergessen.</B> Wenn du Krypto als Vermögen hältst, zählen 2,5 Prozent des
                  Werts zur Zakat, genau wie bei Bargeld. Ob man es als Währung oder als Ware einordnet, ändert
                  daran nichts.
                </>
              ),
            },
          ]}
        />
      </>
    ),
  },
  {
    id: "ehrlich",
    titel: "Der ehrliche Schluss",
    inhalt: (
      <>
        <p>
          Niemand kann dir hier abnehmen, welcher Auffassung du folgst. Was du tun kannst: die Gutachten selbst
          lesen, statt dich auf ein Video zu verlassen, und im Zweifel jemanden fragen, dem du vertraust. Es
          gibt auch Gelehrte, die die Frage offenlassen und persönlich davon abraten, ohne ein Verbot
          auszusprechen. Auch das ist eine ehrliche Position.
        </p>
        <p>
          Und eine Beobachtung aus der Praxis: Die meisten, die nach Krypto fragen, haben noch kein Depot und
          keine Rücklage. Wer beim Aufbau ganz vorne steht, fährt fast immer besser damit, zuerst das Fundament
          zu legen, statt mit dem schwankendsten Baustein anzufangen.
        </p>
        <Merksatz>Erst das Fundament, dann die Beimischung. Nie umgekehrt.</Merksatz>
      </>
    ),
  },
];

const faq: BeitragFrage[] = [
  {
    frage: "Ist Bitcoin jetzt halal oder haram?",
    antwort:
      "Beides wird vertreten. Es gibt Gutachten, die Bitcoin als zulässiges Vermögen einordnen, unter anderem vom Shariyah Review Bureau aus dem Jahr 2022. Es gibt ebenso Gremien, die ablehnen. Wer eine verbindliche Antwort für sich sucht, sollte einen Gelehrten fragen, dem er folgt.",
  },
  {
    frage: "Ist Bitcoin verboten, weil es so stark schwankt?",
    antwort:
      "Nein, das ist kein tragendes Argument. Schwankung allein macht nichts verboten, sonst wäre jede Aktie betroffen. Die Unsicherheit, um die es im islamischen Recht geht, betrifft den Vertrag, also ob klar ist, was du bekommst, nicht die spätere Kursentwicklung.",
  },
  {
    frage: "Sind Meme-Coins halal?",
    antwort:
      "Nach verbreiteter Auffassung nicht. Hinter ihnen steht kein Projekt und kein Nutzen, der Preis hängt allein daran, ob nach dir noch jemand kauft. Das ist eine Wette auf die Nachfrage anderer und wird wie Glücksspiel eingeordnet.",
  },
  {
    frage: "Was ist mit digitalem Zentralbankgeld?",
    antwort:
      "Das ist schlicht Geld in digitaler Form und damit unproblematisch. Es gelten dieselben Regeln wie für Bargeld, einschließlich der Regeln für den Tausch von Währungen.",
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
      "Wenn du es als Vermögen hältst, ja. 2,5 Prozent des heutigen Werts zählen zur Zakat, unabhängig davon, ob man Krypto als Währung oder als Ware einordnet. In unserem Zakat-Rechner gibt es dafür ein eigenes Feld.",
  },
];

const beschreibung =
  "Zu Krypto gibt es Gutachten in beide Richtungen. Die drei Kategorien, die man auseinanderhalten muss, worüber wirklich gestritten wird, welche Argumente nicht tragen und was unstrittig ausgeschlossen ist.";

const IstBitcoinHalal = () => (
  <>
    <Seo
      title="Ist Bitcoin halal oder haram? Der ehrliche Stand | finanzmuslim"
      description={beschreibung}
      path="/wissen/ist-bitcoin-halal"
      jsonLd={beitragJsonLd({
        titel: "Ist Bitcoin halal oder haram?",
        beschreibung,
        path: "/wissen/ist-bitcoin-halal",
        datePublished: "15. August 2026",
        dateModified: "5. September 2026",
        faq,
      })}
    />
    <BeitragSeite
      slug="ist-bitcoin-halal"
      titel="Ist Bitcoin halal oder haram?"
      untertitel="Drei Kategorien, ein echter Streitpunkt und zwei Argumente, die man streichen kann."
      kurzGesagt={[
        "Es gibt keine einheitliche Antwort. Gelehrte sind sich uneins, und das ist der ehrliche Stand.",
        "Krypto ist nicht gleich Krypto: Zentralbankgeld, große Netzwerke und Meme-Coins werden verschieden beurteilt.",
        "Die Streitfrage ist, ob Bitcoin Währung oder Ware ist. Die Schwankung ist kein tragendes Argument.",
        "Der schwerste Einwand betrifft die Folgen: Eine Freigabe führt in der Praxis zu Hebel, Lending und Meme-Coins.",
        "Unstrittig ausgeschlossen sind Hebel, Futures, Lending mit festem Ertrag und Meme-Coins.",
        "Wenn Krypto, dann mit echtem Besitz, als kleiner Teil, und mit 2,5 Prozent Zakat auf den Wert.",
      ]}
      abschnitte={abschnitte}
      faq={faq}
      datePublished="15. August 2026"
      dateModified="5. September 2026"
      boxMitteNach={2}
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
      <PasstDazu
        punkte={[
          { to: "/halal-anlagen", name: "Die Anlagen-Datenbank", text: "zeigt Bitcoin und Ether mit Kursverlauf, getrennt von der Haupttabelle." },
          { to: "/wissen/maysir", name: "Glücksspiel (Maysir)", text: "erklärt, warum Hebel und Wetten eine eigene Kategorie sind." },
          { to: "/wissen/halal-gold-kaufen", name: "Gold kaufen", text: "der Vergleich, der in dieser Diskussion ständig gezogen wird." },
          { to: "/zakat-rechner", name: "Der Zakat-Rechner", text: "hat ein eigenes Feld für Krypto." },
        ]}
      />
    </BeitragSeite>
  </>
);

export default IstBitcoinHalal;
