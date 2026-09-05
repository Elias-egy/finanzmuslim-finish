import Seo, { beitragJsonLd } from "@/components/Seo";
import BeitragSeite, { type BeitragAbschnitt, type BeitragFrage } from "@/components/BeitragSeite";
import { IlluErbeStufen } from "@/components/illu";
import {
  B,
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
    id: "reihenfolge",
    titel: "Vier Stufen, bevor jemand etwas erbt",
    inhalt: (
      <>
        <p>
          Das islamische Erbrecht teilt nicht als Erstes auf. Vorher werden drei Dinge abgezogen, und zwar in
          dieser Reihenfolge.
        </p>
        <Bild text="Erst Beerdigung, dann Schulden, dann das Vermächtnis. Verteilt wird, was danach noch da ist.">
          <IlluErbeStufen />
        </Bild>
        <Schritte
          schritte={[
            {
              titel: "Beerdigung",
              text: "Die Kosten der Bestattung werden zuerst aus dem Nachlass gedeckt, angemessen und ohne Aufwand.",
            },
            {
              titel: "Schulden",
              text: "Alle offenen Verbindlichkeiten werden beglichen, gegenüber Menschen wie gegenüber Gott, etwa noch offene Zakat. Erst was danach übrig ist, wird verteilt.",
            },
            {
              titel: "Das Vermächtnis, höchstens ein Drittel",
              text: "Bis zu einem Drittel darf frei vermacht werden, etwa an eine Einrichtung oder an jemanden, der ohnehin nichts erben würde. Mehr als ein Drittel geht nicht, und an die gesetzlichen Erben darf auf diesem Weg nichts zusätzlich fließen.",
            },
            {
              titel: "Die festen Anteile",
              text: "Erst der Rest wird nach festen Anteilen verteilt. Diese Anteile stehen weitgehend fest und sind nicht Verhandlungssache.",
            },
          ]}
        />
        <Merksatz>
          Der Streit entsteht fast nie bei den Anteilen. Er entsteht daran, dass Stufe zwei und drei
          übersprungen werden.
        </Merksatz>
      </>
    ),
  },
  {
    id: "schulden",
    titel: "Schulden: der Punkt, den man zu Lebzeiten regelt",
    inhalt: (
      <>
        <Frage>Sind Schulden mit dem Tod nicht ohnehin erledigt?</Frage>
        <p>
          Weltlich vielleicht, aber nicht in der Sache. Nach islamischer Auffassung enden Schulden nur auf zwei
          Wegen: Sie werden bezahlt, oder derjenige, dem sie geschuldet werden, erlässt sie. Sonst bleiben sie.
          Eine deutsche Restschuldbefreiung nach einer Insolvenz nimmt dir die Verpflichtung vor dem Gericht,
          nicht die vor dem, dem du das Geld schuldest.
        </p>
        <p>
          Wie ernst das genommen wird, zeigt eine bekannte Überlieferung: Selbst dem, der auf dem Weg Gottes
          fällt, werde alles vergeben, mit Ausnahme seiner Schulden. Deshalb ist die wichtigste Vorbereitung
          nicht das Testament, sondern eine ehrliche Liste dessen, was noch offen ist.
        </p>
        <Hinweis titel="Auch die privaten">
          <p>
            Die 300 Euro vom Cousin, das geliehene Werkzeug, die Zusage an den Nachbarn. Was nirgends steht,
            findet niemand. Schreib es auf, mit Namen und Betrag, und leg die Liste zu deinen Unterlagen.
          </p>
        </Hinweis>
      </>
    ),
  },
  {
    id: "anteile",
    titel: "Die häufigsten Anteile, vereinfacht",
    inhalt: (
      <>
        <p>
          Die folgende Übersicht deckt den Normalfall ab: eine Familie mit Ehepartner, Kindern und
          gegebenenfalls lebenden Eltern. Sie ist bewusst vereinfacht und ersetzt keine Einzelfallprüfung.
        </p>
        <Tabelle
          kopf={["Wer", "In welchem Fall", "Anteil"]}
          zeilen={[
            ["Ehefrau", "mit Kindern", "1/8"],
            ["Ehefrau", "ohne Kinder", "1/4"],
            ["Ehemann", "mit Kindern", "1/4"],
            ["Ehemann", "ohne Kinder", "1/2"],
            ["Mutter", "mit Kindern oder mehreren Geschwistern", "1/6"],
            ["Mutter", "sonst", "1/3"],
            ["Vater", "mit Kindern", "1/6"],
            ["Vater", "ohne Kinder", "1/6 und der verbleibende Rest"],
            ["Eine Tochter, keine Söhne", "allein", "1/2"],
            ["Zwei oder mehr Töchter, keine Söhne", "zusammen", "2/3 zu gleichen Teilen"],
            ["Söhne und Töchter zusammen", "sie teilen den Rest", "Sohn doppelt so viel wie Tochter"],
          ]}
        />
        <Hinweis titel="Warum die Tabelle im Normalfall reicht">
          <p>
            Es gilt der Grundsatz, dass nähere Verwandte entferntere verdrängen. Solange Kinder da sind, erben
            Geschwister und Enkel in aller Regel nichts. Deshalb kommen die meisten Familien mit den Zeilen
            oben aus, und erst wenn eine der nahen Stellen leer bleibt, wird es kompliziert.
          </p>
        </Hinweis>
      </>
    ),
  },
  {
    id: "doppelt",
    titel: "Das Missverständnis mit dem doppelten Anteil",
    inhalt: (
      <>
        <Frage>Bekommt ein Mann im islamischen Erbrecht nicht immer doppelt so viel wie eine Frau?</Frage>
        <p>
          Nein, und das ist wahrscheinlich das verbreitetste Missverständnis zu diesem Thema. Die Regel, dass
          ein Sohn doppelt so viel bekommt wie eine Tochter, gilt <B>für Geschwister auf derselben Ebene</B>,
          also für Söhne und Töchter, die gemeinsam den Rest teilen. Sie ist nicht das Grundprinzip des ganzen
          Erbrechts. Ein Gelehrter in Ägypten hat neun verschiedene Konstellationen gezählt, in denen eine
          Frau mehr erbt als ein Mann im selben Erbfall.
        </p>
        <Beispiel
          titel="Eine Konstellation, in der die Tochter mehr bekommt als der Vater"
          rechnung={["Tochter: 1/2", "Mutter: 1/6", "Vater: 1/6 plus den verbleibenden Rest, also 1/3"]}
          ergebnis="Die Tochter bekommt die Hälfte, der Vater ein Drittel."
        >
          <p>
            Der Verstorbene war unverheiratet und hinterlässt eine Tochter, dazu leben beide Eltern. Solche
            Fälle sind nicht exotisch, sie kommen ständig vor.
          </p>
        </Beispiel>
        <p>
          <B>Und wo die 2:1-Regel gilt, hängt sie an einer Pflicht.</B> Nach klassischer Lehre trägt der Mann
          den Unterhalt für Frau und Familie, die Frau nicht. Was sie erbt, gehört ihr allein und muss für
          niemanden ausgegeben werden. Der Anteil ist also an eine Verpflichtung gekoppelt, nicht an den Wert
          der Person. Über die Einordnung dieser Regel wird heute diskutiert, an ihrem Bestand ändert das
          nichts.
        </p>
      </>
    ),
  },
  {
    id: "deutschland",
    titel: "Warum das in Deutschland nicht von selbst gilt",
    inhalt: (
      <>
        <Merksatz>Ohne Testament gilt deutsches Erbrecht. Es sieht völlig andere Anteile vor.</Merksatz>
        <p>
          Das ist der wichtigste Punkt des ganzen Beitrags. Wer nichts regelt, hinterlässt eine Aufteilung,
          die er selbst nicht gewollt hätte.
        </p>
        <p>
          Seit 2015 richtet sich das anwendbare Erbrecht in der EU grundsätzlich nach dem gewöhnlichen
          Aufenthalt. Wer in Deutschland lebt, fällt damit unter deutsches Recht. Wer eine andere
          Staatsangehörigkeit hat, kann in einem Testament ausdrücklich das Recht seines Heimatstaats wählen.
          Das ist die sogenannte Rechtswahl.
        </p>
        <p>
          <B>Der Pflichtteil bleibt.</B> Auch mit Testament haben Kinder, Ehepartner und unter Umständen
          Eltern nach deutschem Recht einen Anspruch auf den Pflichtteil, also die Hälfte des gesetzlichen
          Erbteils. Dieser Anspruch lässt sich nicht einfach ausschließen. Wer nach islamischen Anteilen
          verteilen will, muss das mitdenken, sonst wird die Aufteilung später angefochten.
        </p>
        <p>
          <B>Was das praktisch heißt:</B> Ein Testament ist keine Formalität, sondern die Voraussetzung dafür,
          dass überhaupt etwas nach islamischen Regeln laufen kann. Ein handschriftliches Testament muss
          vollständig eigenhändig geschrieben, mit Ort und Datum versehen und unterschrieben sein. Sicherer ist
          der Gang zum Notar, besonders bei Immobilien, Betriebsvermögen oder Kindern aus mehreren Ehen.
        </p>
        <p>
          Sinnvoll ist, beides zu holen: einen Gelehrten für die Anteile und einen Notar oder Fachanwalt für
          Erbrecht für die Form. Wer nur eines von beiden hat, bekommt entweder ein unwirksames Testament oder
          eine wirksame Aufteilung, die nicht stimmt.
        </p>
      </>
    ),
  },
  {
    id: "vorbereiten",
    titel: "Was du zu Lebzeiten regeln kannst",
    inhalt: (
      <>
        <p>
          Erben wird einfacher, wenn vorher aufgeräumt ist. Vier Dinge kosten wenig Zeit und ersparen den
          Hinterbliebenen viel.
        </p>
        <Checkliste
          punkte={[
            {
              art: "ja",
              text: (
                <>
                  <B>Eine Liste, was es überhaupt gibt.</B> Konten, Depot, Versicherungen, Immobilien, offene
                  Forderungen. Ein Depot, von dem niemand weiß, wird zum Problem.
                </>
              ),
            },
            {
              art: "ja",
              text: (
                <>
                  <B>Schulden aufschreiben.</B> Auch die privaten, die nirgends stehen. Sie gehören zu Stufe
                  zwei und werden vor jeder Verteilung beglichen.
                </>
              ),
            },
            {
              art: "ja",
              text: (
                <>
                  <B>Offene Zakat notieren.</B> Sie zählt zu den Verbindlichkeiten und wird aus dem Nachlass
                  beglichen, bevor verteilt wird. Wie viel es ist, rechnet der{" "}
                  <L to="/zakat-rechner">Zakat-Rechner</L> aus.
                </>
              ),
            },
            {
              art: "ja",
              text: (
                <>
                  <B>Das Testament an einen Ort, an dem es gefunden wird.</B> Beim Notar oder beim
                  Nachlassgericht hinterlegt, nicht in einer Schublade.
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
    frage: "Gilt islamisches Erbrecht in Deutschland automatisch?",
    antwort:
      "Nein. Ohne Testament gilt deutsches Erbrecht, wenn der gewöhnliche Aufenthalt in Deutschland liegt. Wer eine andere Staatsangehörigkeit hat, kann in einem Testament das Recht seines Heimatstaats wählen. Ohne diese Regelung greift das deutsche Recht mit ganz anderen Anteilen.",
  },
  {
    frage: "Wie viel darf ich frei vermachen?",
    antwort:
      "Höchstens ein Drittel des Nachlasses, und zwar an Personen oder Einrichtungen, die ohnehin nicht erben. An die gesetzlichen Erben darf über ein Vermächtnis nichts zusätzlich fließen. Die Reihenfolge ist: Beerdigung, Schulden, Vermächtnis, dann die festen Anteile.",
  },
  {
    frage: "Erbt ein Mann immer doppelt so viel wie eine Frau?",
    antwort:
      "Nein. Die 2:1-Regel gilt für Geschwister auf derselben Ebene, also für Söhne und Töchter, die gemeinsam den Rest teilen. Sie ist nicht das Grundprinzip des Erbrechts. Es gibt mehrere Konstellationen, in denen eine Frau im selben Erbfall mehr bekommt als ein Mann, etwa eine Tochter mit 1/2 neben einem Vater mit 1/3.",
  },
  {
    frage: "Warum erbt der Sohn dort, wo die Regel gilt, doppelt so viel?",
    antwort:
      "Nach klassischer Lehre ist der Mann unterhaltspflichtig für Frau und Familie, die Frau nicht. Was sie erbt, gehört ihr allein und muss für niemanden ausgegeben werden. Der Anteil hängt also an einer Pflicht. Über die Einordnung dieser Regel wird heute diskutiert.",
  },
  {
    frage: "Erben Geschwister oder Enkel mit?",
    antwort:
      "In aller Regel nicht, solange nähere Verwandte da sind. Es gilt der Grundsatz, dass nähere Erben entferntere verdrängen. Deshalb reicht die einfache Tabelle für die meisten Familien. Bleibt eine der nahen Stellen leer, wird der Fall komplizierter und gehört zu jemandem, der sich auskennt.",
  },
  {
    frage: "Was passiert mit offenen Schulden und offener Zakat?",
    antwort:
      "Beides wird aus dem Nachlass beglichen, bevor irgendetwas verteilt wird. Schulden enden nach islamischer Auffassung nur durch Begleichung oder Erlass. Eine deutsche Restschuldbefreiung befreit vor dem Gericht, nicht gegenüber dem Gläubiger. Deshalb ist eine Liste zu Lebzeiten so wichtig.",
  },
  {
    frage: "Kann ich den Pflichtteil ausschließen?",
    antwort:
      "In der Regel nicht. Kinder, Ehepartner und unter Umständen Eltern haben nach deutschem Recht einen Anspruch auf die Hälfte ihres gesetzlichen Erbteils. Ein Verzicht ist nur mit notarieller Vereinbarung zu Lebzeiten möglich. Wer nach islamischen Anteilen verteilen will, sollte das mit einem Fachanwalt besprechen.",
  },
  {
    frage: "Reicht ein handschriftliches Testament?",
    antwort:
      "Es kann wirksam sein, wenn es vollständig eigenhändig geschrieben, mit Ort und Datum versehen und unterschrieben ist. Bei Immobilien, Betriebsvermögen oder Kindern aus mehreren Ehen ist der Gang zum Notar sicherer.",
  },
];

const beschreibung =
  "Vier Stufen vor der Verteilung, die häufigsten Anteile im Überblick, das Missverständnis mit dem doppelten Anteil und der entscheidende Punkt: Ohne Testament gilt in Deutschland deutsches Erbrecht.";

const Erbe = () => (
  <>
    <Seo
      title="Erbe nach islamischem Recht: was in Deutschland zählt | finanzmuslim"
      description={beschreibung}
      path="/wissen/erbe"
      jsonLd={beitragJsonLd({
        titel: "Erbe nach islamischem Recht",
        beschreibung,
        path: "/wissen/erbe",
        datePublished: "16. August 2026",
        dateModified: "5. September 2026",
        faq,
      })}
    />
    <BeitragSeite
      slug="erbe"
      titel="Erbe nach islamischem Recht"
      untertitel="Vier Stufen, feste Anteile und ein Testament, ohne das nichts davon greift."
      kurzGesagt={[
        "Vier Stufen: Beerdigung, Schulden, Vermächtnis, dann die festen Anteile.",
        "Schulden enden nur durch Begleichung oder Erlass. Eine Liste zu Lebzeiten ist die wichtigste Vorbereitung.",
        "Frei vermachen darfst du höchstens ein Drittel, und nicht an die Erben.",
        "Die 2:1-Regel gilt für Geschwister untereinander, nicht als Grundprinzip. Es gibt Fälle, in denen die Frau mehr erbt.",
        "Ohne Testament gilt in Deutschland deutsches Erbrecht, nicht das islamische.",
        "Der Pflichtteil bleibt auch mit Testament bestehen.",
      ]}
      abschnitte={abschnitte}
      faq={faq}
      datePublished="16. August 2026"
      dateModified="5. September 2026"
      boxMitteNach={3}
      rechtshinweis="Dieser Beitrag ist eine stark vereinfachte Übersicht zu Bildungszwecken. Er ist weder Rechtsberatung noch Fatwa und ersetzt weder einen Fachanwalt für Erbrecht oder einen Notar noch einen Gelehrten. Die genannten Anteile gelten für einfache Standardfälle; bei Enkeln, Halbgeschwistern, vorverstorbenen Kindern, mehreren Ehen oder Auslandsvermögen gelten abweichende Regeln. Zwischen den Rechtsschulen bestehen Unterschiede. Angaben zum deutschen Recht und zur Rechtswahl beruhen auf dem Stand August 2026 und können sich ändern."
      boxOben={{
        kategorie: "Rechner",
        ueberschrift: "Offene Zakat vor dem Erbfall ausrechnen",
        linkZiel: "/zakat-rechner",
        text: "Zwei Felder, Ergebnis als ganzer Satz.",
        knopf: "Zum Zakat-Rechner",
      }}
      boxMitte={{
        kategorie: "Vorlage",
        ueberschrift: "Zwölf Verträge, grün, gelb oder rot einsortiert",
        linkZiel: "/vorlagen/vertrags-ampel",
        text: "Grün, gelb oder rot für zwölf Verträge aus dem Alltag.",
        knopf: "Zur Vertrags-Ampel",
      }}
    >
      <PasstDazu
        punkte={[
          { to: "/wissen/nisab", name: "Nisab", text: "sagt dir, ab wann Zakat überhaupt fällig wird." },
          { to: "/wissen/ertraege-reinigen", name: "Aktienbereinigung", text: "gehört zu den Dingen, die man zu Lebzeiten erledigt." },
          { to: "/wissen/ist-versicherung-haram", name: "Ist eine Versicherung haram?", text: "behandelt die Frage nach der Absicherung der Familie." },
        ]}
      />
    </BeitragSeite>
  </>
);

export default Erbe;
