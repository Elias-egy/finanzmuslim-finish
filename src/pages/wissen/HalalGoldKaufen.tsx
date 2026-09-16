import Seo, { beitragJsonLd } from "@/components/Seo";
import BeitragSeite, { type BeitragAbschnitt, type BeitragFrage } from "@/components/BeitragSeite";
import { IlluGold, IlluQabd } from "@/components/illu";
import {
  B,
  Begriff,
  Beispiel,
  Bild,
  Checkliste,
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
    id: "die-regel",
    titel: "Bei Gold gilt eine Regel, die es sonst nirgends gibt",
    inhalt: (
      <>
        <Frage>Gold ist doch einfach eine Ware. Warum gibt es hier eigene Regeln?</Frage>
        <p>
          Weil Gold im Islam nicht als gewöhnliche Ware gilt, sondern als Geld. Kaufen darfst du es, daran
          zweifelt niemand. Es gibt aber eine Bedingung, die es beim Sofa oder beim Auto nicht gibt, und an
          ihr scheitern die meisten Angebote.
        </p>
        <Merksatz>Geld und Gold müssen im selben Moment den Besitzer wechseln.</Merksatz>
        <p>
          Du zahlst, du bekommst das Gold. Nicht in vier Wochen, nicht auf Raten, nicht als Versprechen auf
          später. Der Grund liegt in einem bekannten Bericht, in dem Gold, Silber und einige
          Grundnahrungsmittel eigens genannt werden. Für diese Waren gilt: Tausch nur sofort und, wenn Gleiches
          gegen Gleiches getauscht wird, in gleicher Menge.
        </p>
        <Begriff wort="Übergabe" arabisch="Qabd">
          Der Moment, in dem die Ware wirklich in deine Verfügung übergeht. Bei Gold muss er mit der Zahlung
          zusammenfallen. Alles, was das auseinanderzieht, ist das Problem.
        </Begriff>
        <p>
          Daraus folgt fast alles Weitere. Gold auf Raten fällt weg. Gold, das dir jemand erst in drei Monaten
          liefert, fällt weg. Und Papier, hinter dem gar kein Gold liegt, fällt sowieso weg.
        </p>
        <Bild text="Hinter dem Anteil, den du kaufst, muss echtes Metall liegen. Sonst kaufst du eine Wette auf den Goldpreis, kein Gold.">
          <IlluGold />
        </Bild>
      </>
    ),
  },
  {
    id: "online",
    titel: "Heißt das, online kaufen geht nicht?",
    inhalt: (
      <>
        <p>
          Doch, und das ist der Punkt, an dem die meisten Erklärungen aufhören. Gelehrte unterscheiden
          zwischen der Übergabe von Hand zu Hand und der <B>rechtlichen Übergabe</B>. Rechtlich übergeben ist
          das Gold, wenn es dir zugeordnet ist, für dich beiseitegelegt wurde und der Händler nicht mehr frei
          darüber verfügen kann. Ob du es in derselben Sekunde in der Hand hältst, ist dann nicht mehr
          entscheidend.
        </p>
        <Bild text="Entscheidend ist nicht die Hand, sondern der Moment: Ab wann gehört der Barren dir und niemandem sonst?">
          <IlluQabd />
        </Bild>
        <p>Damit ein Online-Kauf sauber ist, müssen drei Dinge zusammenkommen:</p>
        <Schritte
          schritte={[
            {
              titel: "Der Händler besitzt den Barren schon",
              text: "Er verkauft dir etwas, das in seinem Tresor liegt, und kauft es nicht erst ein, nachdem dein Geld da ist. Wer erst nach deiner Bestellung selbst einkauft, verkauft etwas, das ihm noch nicht gehört.",
            },
            {
              titel: "Der Barren ist bestimmbar",
              text: "Er hat eine Nummer, ein Gewicht, eine Prägung. Nicht irgendein Gold aus irgendeinem Bestand, sondern dieses Stück.",
            },
            {
              titel: "Beide Seiten geben im selben Moment ab",
              text: "Dein Geld geht raus und ist nicht rückholbar, sein Gold ist dir zugeordnet. Kartenzahlung ist in Ordnung, solange die Zahlung nicht widerrufbar ist. Für die reine Verbuchung räumt der Goldstandard, an dem sich die Prüfstellen orientieren, ein paar Bankwerktage ein.",
            },
          ]}
        />
        <Hinweis titel="Der einfachste Praxistest: die Lieferzeit">
          <p>
            Zwei oder drei Tage sind Logistik. Wenn ein Händler dir zwei oder drei <B>Wochen</B> nennt, dann
            liegt der Barren nicht in seinem Tresor. Er kauft ihn ein, nachdem er dein Geld hat. Das ist ein
            anderes Geschäft als das, für das du bezahlt hast, und genau der Fall, den die Regel verhindern
            soll.
          </p>
        </Hinweis>
      </>
    ),
  },
  {
    id: "die-wege",
    titel: "Die Wege, Gold zu kaufen",
    inhalt: (
      <>
        <p>
          Es gibt in Deutschland im Wesentlichen fünf Möglichkeiten. Sie unterscheiden sich stark, und zwar
          genau an der Frage von eben.
        </p>
        <Faelle
          faelle={[
            {
              titel: "Barren oder Münzen beim Händler",
              ton: "gruen",
              wort: "unstrittig",
              text: "Du bezahlst und nimmst das Gold mit. Der klarste Weg, über den niemand streitet.",
            },
            {
              titel: "Online beim Händler mit eigenem Bestand",
              ton: "gruen",
              wort: "geht, mit Prüfung",
              text: "Sauber, wenn die drei Punkte von oben erfüllt sind. Kurze Lieferzeit, benannter Barren, Zahlung nicht widerrufbar.",
            },
            {
              titel: "Gold-ETC mit echtem Metall",
              ton: "gelb",
              wort: "umstritten",
              text: "Ein Wertpapier, hinter dem nummerierte Barren im Tresor liegen. Verbreitet akzeptiert, wenn zertifiziert, aber nicht von allen.",
            },
            {
              titel: "Goldsparplan",
              ton: "gelb",
              wort: "kommt auf den Vertrag an",
              text: "Kann sauber sein, hat aber typische Fallen. Was du prüfen musst, steht im nächsten Abschnitt.",
            },
            {
              titel: "Gold-Zertifikate, CFDs, Hebelprodukte",
              ton: "rot",
              wort: "fällt weg",
              text: "Eine Wette auf den Preis, ohne Metall dahinter. Gekauft wird gar nichts.",
            },
          ]}
        />
        <p>
          Der Goldschmuck ist ein Sonderfall. Er ist erlaubt, aber als Geldanlage der teuerste Weg, weil du
          die Verarbeitung mitbezahlst und beim Verkauf meist nur den Materialwert bekommst. Und noch etwas:
          Weißgold und Roségold sind Gold, für sie gilt dieselbe Regel. Platin und Palladium dagegen gehören
          nicht zu den Waren, für die diese Sonderregel gilt.
        </p>
      </>
    ),
  },
  {
    id: "sparplan",
    titel: "Goldsparplan: was du wirklich prüfen musst",
    inhalt: (
      <>
        <Frage>Monatlich 50 Euro in Gold sparen, ist das erlaubt?</Frage>
        <p>
          Der Aufbau kann sauber sein, und das ist wichtig zu wissen, weil er oft pauschal abgelehnt wird. Das
          übliche Konstrukt sieht so aus: Du bevollmächtigst den Anbieter, für dein Geld Gold zu kaufen. Er
          kauft, und dir wird ein bestimmter Anteil gutgeschrieben. Wenn das wirklich so abläuft, fallen
          Zahlung und Ware nicht auseinander.
        </p>
        <p>Die Probleme liegen woanders, und zwar an drei Stellen:</p>
        <Checkliste
          punkte={[
            {
              art: "nein",
              text: (
                <>
                  <B>Die Abschlussgebühr.</B> Viele Sparpläne ziehen vorab einen Betrag ab, der keiner
                  Gegenleistung entspricht. Du zahlst 100 Euro, gekauft wird für 92. Das ist der Punkt, an dem
                  die meisten Verträge scheitern.
                </>
              ),
            },
            {
              art: "nein",
              text: (
                <>
                  <B>Granulat statt Barren.</B> Manche Anbieter buchen dir Goldgranulat gut, das sich nicht als
                  bestimmter Barren ausliefern lässt. Dann ist unklar, was genau dir gehört.
                </>
              ),
            },
            {
              art: "neutral",
              text: (
                <>
                  <B>Die Zakat läuft mit.</B> Auf den angesparten Bestand fallen jedes Jahr 2,5 Prozent an.
                  Über zehn Jahre ist das ein spürbarer Teil der Ersparnis, und viele rechnen ihn nicht ein.
                </>
              ),
            },
          ]}
        />
        <p>
          Ein Goldkonto, auf dem dir nach jeder Einzahlung sofort physisches Gold gutgeschrieben wird, das du
          jederzeit ausliefern lassen kannst, ist dagegen der saubere Fall. Es kommt also nicht auf das Wort
          Sparplan an, sondern auf den Vertrag darunter.
        </p>
        <p>
          <B>Gibt es einen mit Prüfung?</B> Einen haben wir gefunden. INAIA aus Deutschland lässt seinen Gold- und
          Silbersparplan von einer Prüfstelle in Dubai nach den AAOIFI-Kriterien zertifizieren, das Metall lagert in
          Deutschland und der Schweiz und wird auf Wunsch geliefert. Für die bekannteren deutschen Anbieter Auvesta und
          SOLIT haben wir keinen solchen Nachweis gefunden. Das heißt nicht, dass ihre Verträge unzulässig wären, es
          heißt, dass du sie selbst prüfen musst. Alle Wege nebeneinander stehen im{" "}
          <L to="/vergleich/edelmetalle">Edelmetall-Vergleich</L>.
        </p>
      </>
    ),
  },
  {
    id: "altgold",
    titel: "Altgold in Zahlung geben: die Falle beim Juwelier",
    inhalt: (
      <>
        <p>
          Ein Fall, der in fast jeder Familie vorkommt und den kaum jemand auf dem Schirm hat. Du bringst
          altes Gold zum Händler, gibst etwas Geld dazu und bekommst dafür einen neuen Barren oder neuen
          Schmuck. Klingt harmlos, ist aber genau der Tausch, den die Regel verbietet: Gold gegen Gold in
          ungleicher Menge.
        </p>
        <Beispiel
          titel="Der falsche und der richtige Weg"
          rechnung={[
            "Falsch: 40 g Altgold + 900 € → 60 g neuer Barren",
            "Richtig: 40 g Altgold → 2.600 € · dann 2.600 € + 900 € → 60 g neuer Barren",
          ]}
          ergebnis="Zwei getrennte Geschäfte. Erst verkaufen, Geld nehmen, dann kaufen."
        >
          <p>
            Der Unterschied wirkt formal, ist aber genau der Punkt: Beim ersten Weg tauschst du Gold gegen
            mehr Gold. Beim zweiten verkaufst du Gold gegen Geld und kaufst danach Gold für Geld.
          </p>
        </Beispiel>
        <Hinweis titel="Praktisch beim Juwelier">
          <p>
            Lass dir das Altgold ankaufen und den Betrag wirklich auszahlen oder überweisen. Danach kaufst du.
            Viele Händler machen das ohne Rückfrage, es kostet nur einen Beleg mehr.
          </p>
        </Hinweis>
      </>
    ),
  },
  {
    id: "etc",
    titel: "Der Streitpunkt: Gold als Wertpapier",
    inhalt: (
      <>
        <p>
          Ein Gold-ETC ist ein Wertpapier, das du im Depot kaufst wie eine Aktie. Hinter den guten liegt
          echtes Metall, eingelagert in einem Tresor, jeder Barren mit Nummer und in Listen erfasst. Das nennt
          man <B>physisch besichert</B>, es heißt schlicht: Das Gold liegt wirklich da.
        </p>
        <p>
          <B>Was dafür spricht.</B> Du bekommst tatsächlich Gold zugeordnet, es ist getrennt vom Vermögen des
          Anbieters, und viele dieser Produkte haben ein Zertifikat eines Gelehrtengremiums, das du selbst
          nachlesen kannst.
        </p>
        <p>
          <B>Was dagegen spricht.</B> Du hältst das Gold nicht in der Hand. Zwischen dir und dem Barren stehen
          ein Anbieter, eine Verwahrstelle und ein Depot. Ein Teil der Gelehrten sagt deshalb: Das erfüllt die
          Bedingung der Übergabe nicht wirklich. Und die meisten Goldwertpapiere am Markt sind ohnehin nicht
          voll physisch hinterlegt, weshalb der Nachweis der springende Punkt ist.
        </p>
        <p>
          <B>Woran du dich halten kannst.</B> Es muss echtes Metall dahinterliegen und nicht nur ein
          Versprechen. Das Gold muss dir zugeordnet sein und nicht nur der Menge nach vorhanden sein. Und es
          sollte ein Zertifikat geben, das du selbst lesen kannst. In unserer{" "}
          <L to="/halal-anlagen">Anlagen-Datenbank</L> steht bei jedem Produkt, ob ein Nachweis vorliegt und
          von wem. Wo keiner vorliegt, steht das ausdrücklich dabei.
        </p>
        <Hinweis titel="Ein Produkt fällt aus der Reihe">
          <p>
            Bei fast allen Gold-Wertpapieren kommst du an das Metall nicht heran. Der ETC der britischen Royal Mint
            ist die Ausnahme: Das Gold liegt in ihrem eigenen Tresor in Cardiff und nicht bei einer Bank, und
            Privatanleger können sich Barren und Münzen ausliefern lassen. Das Zertifikat kommt von Amanie Advisors
            und wird jedes Jahr neu ausgestellt. Wer dem Einwand zur Übergabe Gewicht gibt, findet hier den kürzesten
            Weg vom Papier zum Barren.
          </p>
        </Hinweis>
        <p>
          <B>Was die Prüfer selbst schreiben.</B> Bemerkenswert ehrlich ist der Bericht des Gremiums, das die
          WisdomTree-Produkte prüft. Es hält fest, dass der AAOIFI-Standard für Gold eine Abwicklung noch am selben
          Tag verlangt, die Papiere aber erst nach zwei Tagen abgerechnet werden. Es hält sie dennoch für vertretbar,
          weil ein anderer Standard eine Verzögerung zulässt, die im Geschäftsverkehr unvermeidbar ist. Man muss dem
          nicht folgen. Aber es zeigt, dass diese Zertifikate keine Gefälligkeit sind, sondern eine Abwägung, die man
          nachlesen kann.
        </p>
      </>
    ),
  },
  {
    id: "was-nicht-geht",
    titel: "Was klar wegfällt",
    inhalt: (
      <>
        <p>Bei diesen Punkten gibt es kaum Streit, sie fallen für die allermeisten Gelehrten weg:</p>
        <Checkliste
          punkte={[
            {
              art: "nein",
              text: (
                <>
                  <B>Gold auf Raten oder auf Kredit.</B> Verstößt gegen die Bedingung der sofortigen Übergabe,
                  und beim Kredit kommt der Zins dazu.
                </>
              ),
            },
            {
              art: "nein",
              text: (
                <>
                  <B>Gold-CFDs, Hebelprodukte, Futures.</B> Hier wird auf den Preis gewettet, gekauft wird
                  nichts.
                </>
              ),
            },
            {
              art: "nein",
              text: (
                <>
                  <B>Gold verleihen gegen Ertrag.</B> Ein festes Entgelt dafür, dass jemand dein Gold nutzt,
                  ist derselbe Fall wie Zins.
                </>
              ),
            },
            {
              art: "nein",
              text: (
                <>
                  <B>Unbesichertes Papiergold.</B> Wenn im Verkaufsprospekt steht, dass der Anbieter den Preis
                  nur nachbildet, liegt kein Metall dahinter.
                </>
              ),
            },
            {
              art: "nein",
              text: (
                <>
                  <B>Altgold plus Zuzahlung gegen neues Gold.</B> Zwei getrennte Geschäfte daraus machen, wie
                  oben beschrieben.
                </>
              ),
            },
          ]}
        />
      </>
    ),
  },
  {
    id: "praktisch",
    titel: "Wenn du echtes Gold kaufst, praktisch",
    inhalt: (
      <>
        <p>
          <B>Barren oder Münze?</B> Barren sind pro Gramm günstiger, Münzen leichter in kleinen Mengen zu
          verkaufen. Für den Anfang sind 10 bis 50 Gramm eine übliche Größe. Sehr kleine Einheiten kosten
          anteilig deutlich mehr Aufschlag.
        </p>
        <p>
          <B>Achte auf den Aufschlag.</B> Kein Händler verkauft zum reinen Goldpreis. Der Unterschied zwischen
          Ankaufs- und Verkaufspreis ist dein tatsächlicher Verlust am ersten Tag. Frag immer beides ab, bevor
          du kaufst.
        </p>
        <p>
          <B>Nimm es gleich mit oder lass es dir liefern.</B> Was du nicht bekommst, hast du nicht gekauft.
          Ein Lagerschein bei einem Händler, der dir das Gold nur zusagt, ist etwas anderes als Gold.
        </p>
        <Hinweis titel="Steuer, damit es vollständig ist">
          <p>
            Anlagegold ist beim Kauf von der Umsatzsteuer befreit. Verkaufst du <B>physisches</B> Gold nach
            mehr als einem Jahr wieder, ist der Gewinn nach derzeitiger Rechtslage steuerfrei. Bei
            Wertpapieren gilt das nur, wenn du dir das Gold ausliefern lassen kannst. Bei den meisten
            Gold-ETCs am deutschen Markt geht das nicht, dort greift die Abgeltungsteuer. Das ist keine
            Steuerberatung, es steht hier, weil es beim Vergleich mit anderen Anlagen eine Rolle spielt.
          </p>
        </Hinweis>
        <Merksatz>
          Gold ist Sparen, kein Investieren. Es arbeitet nicht, es zahlt keine Miete und keinen Gewinn. Es
          hält Kaufkraft.
        </Merksatz>
      </>
    ),
  },
  {
    id: "zakat",
    titel: "Zakat auf Gold, das wird am häufigsten gefragt",
    inhalt: (
      <>
        <p>
          Gold zählt zum Vermögen, auf das Zakat fällig wird, sobald du über der Grenze liegst und es ein
          Mondjahr in deinem Besitz war. Diese Grenze heißt Nisab, und sie liegt bei 85 Gramm Gold oder 595
          Gramm Silber.
        </p>
        <p>
          Welche der beiden Grenzen man anlegt, wird unterschiedlich gehandhabt: Drei der vier großen
          Rechtsschulen nehmen Gold, eine nimmt Silber, und viele Hilfsorganisationen rechnen mit Silber, weil
          die Grenze niedriger liegt. Beides ist vertretbar, mehr dazu in <L to="/wissen/nisab">Nisab</L>.
        </p>
        <p>
          Der Satz beträgt <B>2,5 Prozent</B> auf den Wert, nicht auf den Gewinn. Umstritten ist der Schmuck,
          den eine Frau regelmäßig trägt: Ein Teil der Gelehrten nimmt ihn aus, ein anderer nicht. Wer
          sichergehen will, rechnet ihn mit.
        </p>
      </>
    ),
  },
];

const faq: BeitragFrage[] = [
  {
    frage: "Ist Gold kaufen halal?",
    antwort:
      "Ja, mit einer Bedingung: Zahlung und Übergabe müssen zusammenfallen. Du bezahlst und bekommst das Gold. Gold auf Raten, Gold mit später Lieferung und Wetten auf den Goldpreis erfüllen das nicht.",
  },
  {
    frage: "Darf ich Gold online kaufen?",
    antwort:
      "Ja, wenn drei Dinge stimmen: Der Händler besitzt den Barren schon, der Barren ist bestimmbar (Nummer, Gewicht), und deine Zahlung ist nicht mehr widerrufbar. Ein guter Praxistest ist die Lieferzeit. Zwei bis drei Tage sind Logistik, zwei bis drei Wochen heißen meist, dass der Barren erst nach deiner Zahlung eingekauft wird.",
  },
  {
    frage: "Ist ein Gold-ETF oder Gold-ETC halal?",
    antwort:
      "Darüber gehen die Meinungen auseinander. Produkte, hinter denen nummerierte Barren im Tresor liegen und die ein Zertifikat eines Gelehrtengremiums haben, werden verbreitet akzeptiert. Ein Teil der Gelehrten sagt, ohne Gold in der Hand sei die Bedingung der Übergabe nicht erfüllt. Unstrittig ausgeschlossen sind Produkte ohne echtes Metall dahinter.",
  },
  {
    frage: "Darf ich Gold auf Raten kaufen?",
    antwort:
      "Nein. Bei Gold müssen Zahlung und Übergabe zusammenfallen. Das ist einer der wenigen Punkte, bei denen es kaum abweichende Auffassungen gibt.",
  },
  {
    frage: "Ist ein Goldsparplan erlaubt?",
    antwort:
      "Der Aufbau kann sauber sein, wenn für deine Einzahlung sofort Gold gekauft und dir zugeordnet wird. Die typischen Probleme sind eine Abschlussgebühr ohne Gegenleistung, Goldgranulat statt eines bestimmbaren Barrens und die Zakat, die jedes Jahr auf den Bestand anfällt. Entscheidend ist der Vertrag, nicht das Wort Sparplan.",
  },
  {
    frage: "Darf ich Altgold beim Juwelier in Zahlung geben?",
    antwort:
      "Nicht als ein Geschäft. Altgold plus Zuzahlung gegen einen neuen Barren ist Gold gegen mehr Gold und damit ausgeschlossen. Der saubere Weg sind zwei getrennte Geschäfte: erst das Altgold verkaufen und den Betrag bekommen, dann neu kaufen.",
  },
  {
    frage: "Gilt das auch für Weißgold, Roségold, Platin?",
    antwort:
      "Weißgold und Roségold sind Gold, für sie gilt dieselbe Regel. Platin und Palladium gehören nicht zu den Waren, für die diese Sonderregel gilt, und werden wie normale Waren behandelt.",
  },
  {
    frage: "Gibt es einen Goldsparplan mit Shariah-Zertifikat?",
    antwort:
      "Ja, einen haben wir gefunden. INAIA aus Deutschland lässt seinen Gold- und Silbersparplan von Minhaj Shari'ah Financial Advisory in Dubai nach den AAOIFI-Kriterien prüfen. Das Metall lagert in Deutschland und der Schweiz und wird auf Wunsch geliefert. Für Auvesta und SOLIT, die bekanntesten deutschen Anbieter, haben wir keinen Nachweis gefunden.",
  },
  {
    frage: "Wie viel Gold sollte man haben?",
    antwort:
      "Dazu geben wir keine Empfehlung ab, das wäre Anlageberatung. Was sich sagen lässt: Gold wirft nichts ab, es zahlt keine Miete und keinen Gewinn. Es ist ein Wertspeicher, kein Einkommen.",
  },
];

const beschreibung =
  "Gold kaufen ist erlaubt, wenn Zahlung und Übergabe zusammenfallen. Was das für Barren, Münzen, den Online-Kauf, Gold-ETC, Goldsparpläne und Altgold beim Juwelier bedeutet, und wie Zakat auf Gold berechnet wird.";

const HalalGoldKaufen = () => (
  <>
    <Seo
      title="Halal Gold kaufen: Die eine Bedingung, die zählt | finanzmuslim"
      description={beschreibung}
      path="/wissen/halal-gold-kaufen"
      jsonLd={beitragJsonLd({
        titel: "Halal Gold kaufen",
        beschreibung,
        path: "/wissen/halal-gold-kaufen",
        datePublished: "16. August 2026",
        dateModified: "16. September 2026",
        faq,
      })}
    />
    <BeitragSeite
      slug="halal-gold-kaufen"
      titel="Halal Gold kaufen"
      untertitel="Eine Regel entscheidet über alles: Wann genau gehört der Barren dir?"
      kurzGesagt={[
        "Gold kaufen ist erlaubt. Die Bedingung: Zahlung und Übergabe fallen zusammen.",
        "Online geht, wenn der Händler den Barren schon hat, er bestimmbar ist und die Zahlung nicht widerrufbar. Lange Lieferzeit ist das Warnsignal.",
        "Gold auf Raten oder auf Kredit erfüllt die Bedingung nicht.",
        "Ein Goldsparplan kann sauber sein. Prüf Abschlussgebühr, Granulat und die jährliche Zakat.",
        "Altgold plus Zuzahlung gegen neues Gold ist die häufigste Falle beim Juwelier.",
        "Zakat auf Gold: 2,5 Prozent, sobald du über dem Nisab liegst.",
      ]}
      abschnitte={abschnitte}
      faq={faq}
      datePublished="16. August 2026"
      dateModified="16. September 2026"
      boxMitteNach={4}
      rechtshinweis="Dieser Beitrag gibt bekannte Positionen wieder und dient ausschließlich zu Bildungszwecken. Er ist keine Fatwa und ersetzt weder die Auskunft eines Gelehrten noch eine Steuer- oder Anlageberatung. Genannte Produkte sind Beispiele und keine Empfehlung. Innerhalb der Rechtsschulen gibt es zu einzelnen Punkten abweichende Auffassungen, besonders bei Gold als Wertpapier, bei Sparplänen und beim getragenen Schmuck. Die Zahlen in den Beispielen sind erfunden."
      boxOben={{
        kategorie: "Anlagen",
        ueberschrift: "Welche Gold-Produkte einen Nachweis haben",
        linkZiel: "/halal-anlagen",
        text: "31 Anlagen mit Kosten, Größe und Prüfstelle.",
        knopf: "Zu den Anlagen",
      }}
      boxMitte={{
        kategorie: "Depot",
        ueberschrift: "Wo du Gold-ETC ohne Zinsgeschäft kaufst",
        linkZiel: "/vergleich/depot",
      }}
    >
      <PasstDazu
        punkte={[
          { to: "/vergleich/edelmetalle", name: "Der Edelmetall-Vergleich", text: "stellt die fünf Wege zu Gold und Silber nebeneinander, mit Anbietern und Nachweisen." },
          { to: "/zakat-rechner", name: "Der Zakat-Rechner", text: "rechnet Gold, Silber und Ersparnisse zusammen und zeigt dir den Nisab." },
          { to: "/wissen/nisab", name: "Nisab verstehen", text: "erklärt, welche der beiden Grenzen für dich gilt." },
          { to: "/wissen/zinsen-im-islam", name: "Zinsen im Islam", text: "erklärt, warum die Zeit der entscheidende Punkt ist." },
          { to: "/vorlagen/vertrags-ampel", name: "Die Vertrags-Ampel", text: "ordnet zwölf Verträge ein, die fast jeder hat." },
        ]}
      />
    </BeitragSeite>
  </>
);

export default HalalGoldKaufen;
