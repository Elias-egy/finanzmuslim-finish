import { Link } from "react-router-dom";
import { VergleichsSeite } from "@/components/vergleich/VergleichsSeite";
import { screenerVergleich, SCREENER_ZEILEN, SCREENER_FILTER } from "@/data/screenerVergleich";

/**
 * Vergleich der Apps, die einzelne Aktien auf Halal prüfen.
 *
 * Diese Seite hat eine Eigenheit, die keine andere Vergleichsseite hat: Sie
 * vergleicht Werkzeuge, die dieselbe Arbeit machen wie wir. Deshalb steht unter
 * der Tabelle offen, wofür man sie überhaupt braucht und wo unsere eigene Liste
 * aufhört. Wer nur die geprüften ETFs kaufen will, braucht keine App.
 */

const WozuBlock = () => (
  <section className="mt-14 max-w-3xl">
    <h2 className="text-2xl font-bold text-foreground">Brauchst du so eine App überhaupt?</h2>
    <p className="mt-3 text-[17px] leading-[26px] text-foreground/90">
      Nur, wenn du einzelne Aktien kaufst. Wer über einen geprüften ETF anlegt, hat die Prüfung
      schon bezahlt: Der Indexanbieter macht sie, und ein Gremium bestätigt sie jedes Jahr. Welche
      das sind, steht in unserer{" "}
      <Link to="/halal-anlagen" className="font-semibold text-primary hover:underline">
        Anlagen-Datenbank
      </Link>
      . Eine Screening-App brauchst du in drei Fällen.
    </p>
    <ul className="mt-6 space-y-5">
      {[
        {
          titel: "Du kaufst einzelne Aktien",
          text: "Dann musst du jede selbst prüfen, und zwar nicht einmal, sondern laufend. Ein Unternehmen kann durch eine Übernahme oder neue Schulden aus der Zulässigkeit fallen.",
        },
        {
          titel: "Du hast schon ein Depot und weißt nicht, was drin ist",
          text: "Die meisten Apps lesen dein Depot ein und sagen dir je Position, woran es liegt. Das ist der ehrlichste Einstieg, auch wenn das Ergebnis unangenehm ausfällt.",
        },
        {
          titel: "Du musst reinigen",
          text: "Wenn ein Teil der Erträge aus unerlaubten Quellen stammt, ist dieser Anteil zu spenden. Ausrechnen kannst du das mit unserem Bereinigungsrechner oder mit einer App, die es je Aktie ausweist.",
        },
      ].map((punkt) => (
        <li key={punkt.titel}>
          <p className="text-[16px] font-semibold text-foreground">{punkt.titel}</p>
          <p className="mt-1 text-[15px] leading-[24px] text-muted-foreground">{punkt.text}</p>
        </li>
      ))}
    </ul>
    <h2 className="mt-10 text-2xl font-bold text-foreground">Warum zwei Apps verschiedene Urteile fällen</h2>
    <p className="mt-3 text-[17px] leading-[26px] text-foreground/90">
      Das ist der häufigste Schreckmoment: Eine App sagt halal, die andere nicht. Meistens liegt es
      nicht an einem Fehler, sondern am Maßstab. Geprüft wird immer zweistufig, und beide Stufen
      sind auslegbar.
    </p>
    <ul className="mt-5 space-y-3 text-[15px] leading-[24px] text-muted-foreground">
      <li>
        <span className="font-semibold text-foreground">Das Geschäft.</span> Verdient das
        Unternehmen an Zinsen, Alkohol, Glücksspiel, Schweinefleisch, Waffen oder Erwachsenenfilmen?
        Darüber sind sich fast alle einig, nur nicht über die erlaubte Restschwelle.
      </li>
      <li>
        <span className="font-semibold text-foreground">Die Bilanz.</span> Wie hoch dürfen
        verzinste Schulden und Zinserträge sein, und woran werden sie gemessen? AAOIFI nimmt den
        Marktwert, andere Regelwerke den Gesamtwert der Bilanz. Dasselbe Unternehmen fällt damit
        mal über, mal unter die Grenze.
      </li>
      <li>
        <span className="font-semibold text-foreground">Der Zeitpunkt.</span> Die Zahlen stammen aus
        dem letzten Geschäftsbericht. Wer quartalsweise aktualisiert, urteilt früher anders als wer
        jährlich aktualisiert.
      </li>
    </ul>
    <p className="mt-5 text-[15px] leading-[24px] text-muted-foreground">
      Die drei Grenzwerte, um die es geht, stehen im{" "}
      <Link to="/vorlagen/aktien-check" className="font-semibold text-primary hover:underline">
        Aktien-Spickzettel
      </Link>
      , und wie man den zu spendenden Anteil ausrechnet, zeigt der{" "}
      <Link to="/bereinigungsrechner" className="font-semibold text-primary hover:underline">
        Bereinigungsrechner
      </Link>
      . Wer die Regel kennt, braucht keine App mehr für jede einzelne Aktie.
    </p>
  </section>
);

const VergleichScreener = () => (
  <VergleichsSeite
    pfad="/vergleich/screening-apps"
    brotkrumen="Screening-Apps"
    titel="Halal-Aktien prüfen: die Apps im Vergleich"
    untertitel="Vier Werkzeuge, die dir sagen, ob eine Aktie halal ist, und worin sie sich unterscheiden"
    seoTitel="Halal Aktien prüfen: Screening-Apps im Vergleich | finanzmuslim"
    seoText="Ist diese Aktie halal? Musaffa, Zoya, Islamicly und Finispia im Vergleich: Maßstab, Prüfgremium, deutsche Aktien, Reinigungsbetrag, Preis und was die kostenlose Fassung kann."
    einheit="Apps"
    einleitung={
      <>
        <p>
          Eine Screening-App beantwortet eine Frage: Ist diese Aktie halal? Sie prüft dafür das
          Geschäft des Unternehmens und seine Bilanz, und sie tut das nach einem Regelwerk, das sie
          sich nicht selbst ausgedacht hat.
        </p>
        <p>
          Genau darin liegt der Unterschied zwischen den Apps. Nicht in der Oberfläche, sondern in
          der Frage, nach welchem Maßstab geurteilt wird, wer diesen Maßstab verantwortet und ob du
          die Zahlen hinter dem Urteil siehst. Dazu kommt für uns eine Frage, die in keiner
          internationalen Übersicht steht: Findet die App überhaupt deutsche Aktien?
        </p>
      </>
    }
    zeilen={SCREENER_ZEILEN}
    anbieter={screenerVergleich}
    filter={SCREENER_FILTER}
    stand="16.09.2026"
    standHinweis="Alle Angaben beim Anbieter geprüft"
    quellenHinweis="Alle Angaben stammen von den Seiten der Anbieter, geprüft am 16.09.2026. Keine dieser Apps ist ein Partner von uns, und keine bezahlt für die Aufnahme."
    kriterien={[
      {
        titel: "Maßstab",
        text: "Nach welchem Regelwerk wird geprüft? AAOIFI ist der strengste verbreitete Maßstab. Dow Jones, MSCI, S&P und FTSE lassen bei Schulden und Zinserträgen mehr zu, deshalb kann dieselbe Aktie unterschiedlich ausfallen.",
      },
      {
        titel: "Prüfgremium namentlich",
        text: "Stehen die Gelehrten mit Namen hinter dem Urteil, oder heißt es nur, es gebe Berater? Ein Urteil ohne Absender lässt sich nicht nachprüfen.",
      },
      {
        titel: "Zahlen hinter dem Urteil",
        text: "Zeigt die App die Kennzahlen, aus denen das Ergebnis folgt? Sonst musst du glauben statt prüfen, und du merkst nicht, wenn eine Aktie knapp an einer Grenze liegt.",
      },
      {
        titel: "Reinigungsbetrag",
        text: "Rechnet die App aus, welchen Anteil deiner Erträge du spenden musst? Das ist der Teil, den die meisten vergessen, obwohl er zur Prüfung dazugehört.",
      },
    ]}
    zusatz={<WozuBlock />}
    faq={[
      {
        frage: "Welche Screening-App ist die beste?",
        antwort:
          "Das hängt davon ab, was du brauchst. Wer nur wissen will, ob eine bestimmte Aktie halal ist, kommt mit den kostenlosen Fassungen weit. Wer sein Depot laufend überwachen und reinigen will, braucht ein Bezahlmodell. Wer wissen will, wie stark das Urteil vom Maßstab abhängt, ist bei einer App richtig, die mehrere Regelwerke nebeneinander zeigt.",
      },
      {
        frage: "Warum sagt eine App halal und die andere nicht?",
        antwort:
          "Weil sie nach unterschiedlichen Regelwerken rechnen. Die Frage, ab wann verzinste Schulden zu viel sind und woran man sie misst, wird verschieden beantwortet. AAOIFI misst am Marktwert, andere am Gesamtwert der Bilanz. Bei Unternehmen nahe der Grenze kippt das Ergebnis.",
      },
      {
        frage: "Gibt es eine Screening-App auf Deutsch?",
        antwort:
          "Nach unserem Stand keine. Alle vier Apps im Vergleich sind auf Englisch. Zwei kommen aus den USA, eine aus Indien, eine aus Europa. Die Begriffe, die du dafür brauchst, erklären wir in unseren Beiträgen auf Deutsch.",
      },
      {
        frage: "Findet eine solche App auch deutsche Aktien?",
        antwort:
          "Ja, aber nicht überall gleich gut. Musaffa weist für Deutschland 997 geprüfte Aktien aus, davon 231 halal. Zoya führt Deutschland als einen von neun Märkten, am vollständigsten sind dort die USA. Wer deutsche Nebenwerte kauft, sollte vor dem Abo prüfen, ob sein Titel überhaupt drin ist.",
      },
      {
        frage: "Brauche ich eine App, wenn ich nur ETFs kaufe?",
        antwort:
          "Nein. Bei einem geprüften ETF hat der Indexanbieter die Arbeit schon gemacht, und ein Gremium bestätigt sie jährlich. Welche Produkte einen Nachweis haben und von wem, steht in unserer Anlagen-Datenbank.",
      },
      {
        frage: "Ersetzt eine App den Gelehrten?",
        antwort:
          "Nein. Eine App wendet ein Regelwerk auf Zahlen an. Sie entscheidet nicht, welches Regelwerk für dich gilt, und sie kennt deinen Fall nicht. Bei Zweifeln bleibt der Weg zum Gelehrten deines Vertrauens.",
      },
    ]}
    schluss="Diese Seite ist keine Anlageberatung und keine Empfehlung für eine bestimmte App. Die Urteile der Apps sind Ergebnisse eines Regelwerks, keine Fatwa. Angaben zu Preisen und Umfang stammen von den Anbietern und können sich ändern."
  />
);

export default VergleichScreener;
