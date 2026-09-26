import Seo, { beitragJsonLd } from "@/components/Seo";
import BeitragSeite, { type BeitragAbschnitt, type BeitragFrage } from "@/components/BeitragSeite";
import { IlluMurabaha, IlluMusharaka, IlluZins } from "@/components/illu";
import {
  B,
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
    id: "kurze-antwort",
    titel: "Die kurze Antwort",
    inhalt: (
      <>
        <p>
          Ein normaler Baukredit ist für die meisten Gelehrten nicht zulässig. Du zahlst mehr zurück, als du
          bekommen hast, und der Aufschlag entsteht allein dadurch, dass Zeit vergeht. Genau das ist gemeint,
          wenn vom Zinsverbot die Rede ist.
        </p>
        <p>
          Es gibt Alternativen, und sie funktionieren anders, als die meisten denken. Bei allen kauft jemand
          anderes das Haus zuerst und verkauft oder vermietet es dann an dich. Du zahlst trotzdem mehr als den
          Kaufpreis. Der Unterschied liegt darin, wofür du zahlst.
        </p>
        <Merksatz>
          Es reicht nicht, einen Kredit anders zu nennen. Es muss jemand echtes Eigentum übernehmen und echtes
          Risiko tragen.
        </Merksatz>
        <p>
          Und es gibt eine bekannte Fatwa, auf die sich viele berufen. Was sie wirklich sagt, steht weiter
          unten, und die meisten kennen nur die halbe Geschichte.
        </p>
      </>
    ),
  },
  {
    id: "warum-problem",
    titel: "Warum ein normaler Kredit ein Problem ist",
    inhalt: (
      <>
        <p>
          Bei einem Baukredit leiht dir die Bank Geld. Nach zwanzig Jahren hast du deutlich mehr zurückgezahlt.
          Die Bank hat dafür nichts getan, außer zu warten. Sie trägt kein Risiko am Haus, sie besitzt es nie,
          und wenn du nicht zahlen kannst, holt sie sich ihr Geld trotzdem.
        </p>
        <p>
          Der Kern des Zinsverbots ist genau das: Gewinn ohne Risiko und ohne Gegenleistung. Wer etwas
          verdienen will, soll dafür ein Risiko tragen oder eine Leistung erbringen.
        </p>
        <Bild text="Beim Zinskredit wächst die Summe, weil Zeit vergeht. Niemand trägt dafür ein Risiko.">
          <IlluZins />
        </Bild>
      </>
    ),
  },
  {
    id: "murabaha",
    titel: "Murabaha: die Bank kauft und verkauft dir weiter",
    inhalt: (
      <>
        <p>
          Das ist das häufigste Modell. Die Bank kauft das Haus selbst. Sie wird für einen Moment wirklich
          Eigentümerin, mit allem, was dazugehört. Danach verkauft sie es dir weiter, zu einem höheren Preis,
          den ihr vorher festlegt. Diesen Preis zahlst du in Raten ab.
        </p>
        <Bild text="Die Bank kauft das Haus wirklich und verkauft es dir mit Aufschlag weiter. Der Preis steht von Anfang an fest.">
          <IlluMurabaha />
        </Bild>
        <p>
          Der Unterschied zum Kredit klingt klein, ist es aber nicht. Der Aufschlag ist ein Handelsgewinn, kein
          Zins. Er steht am Anfang fest und ändert sich nicht mehr, egal wie lange du brauchst. Es gibt keine
          Verzugszinsen, die die Summe wachsen lassen.
        </p>
        <Hinweis titel="Was bei einer echten Murabaha dazugehört">
          <p>
            Du musst den <B>Einkaufspreis</B> der Bank kennen, nicht nur den Endpreis. Genau das unterscheidet
            diesen Vertrag von einem normalen Verkauf: Der Verkäufer legt offen, was er selbst gezahlt hat, und
            nennt seinen Aufschlag. Und du darfst nach dem Ankauf nicht gezwungen werden, ihr das Haus
            abzukaufen. Dein Versprechen im Vorfeld bindet dich religiös, aber es ist kein Vertrag.
          </p>
        </Hinweis>
        <p>
          Der Haken in Deutschland: Wenn die Bank das Haus kauft und dann an dich weiterverkauft, sind es zwei
          Kaufvorgänge. Dabei kann zweimal Grunderwerbsteuer anfallen. Das macht die Sache teurer und ist einer
          der Gründe, warum es so wenige Anbieter gibt.
        </p>
      </>
    ),
  },
  {
    id: "ijara",
    titel: "Miete mit Kauf am Ende: hier liegt eine Falle",
    inhalt: (
      <>
        <p>
          Hier kauft die Bank das Haus ebenfalls, verkauft es dir aber nicht sofort. Sie vermietet es dir, und
          am Ende der Laufzeit sollst du es bekommen. Miete gegen Wohnrecht ist unstrittig zulässig, deshalb
          wirkt dieses Modell auf den ersten Blick am saubersten.
        </p>
        <Frage>Warum ist dann nicht jeder Mietkauf in Ordnung?</Frage>
        <p>
          Weil es zwei Bauarten gibt, die man leicht verwechselt, und nur eine davon trägt.
        </p>
        <Gegenueber
          links={{
            titel: "Ein Vertrag: Miete und Kauf zusammen",
            ton: "rot",
            punkte: [
              "Miete und Kaufverpflichtung stehen in derselben Urkunde.",
              "Du zahlst Miete, aber der Verkauf ist schon beschlossen, nur unter Vorbehalt.",
              "Einen Eigentumsvorbehalt, wie ihn das deutsche Recht kennt, gibt es im islamischen Recht nicht: Eigentum geht ganz über oder gar nicht.",
              "Deshalb wird der klassische Mietkauf von Gelehrten kritisch gesehen bis abgelehnt.",
            ],
          }}
          rechts={{
            titel: "Zwei Verträge: erst mieten, dann kaufen",
            ton: "gruen",
            punkte: [
              "Der Mietvertrag steht für sich. Solange er läuft, bist du Mieter, sonst nichts.",
              "Am Ende folgt ein eigener, neuer Kaufvertrag oder eine Schenkung.",
              "Der Vermieter bleibt bis dahin Eigentümer mit allen Lasten.",
              "Das ist die Form, die Gelehrte akzeptieren.",
            ],
          }}
        />
        <p>
          Achte außerdem darauf, wer die Lasten trägt: Solange die Bank Eigentümerin ist, gehören größere
          Reparaturen und die Gebäudeversicherung zu ihr. Manche Verträge schieben dir das trotzdem zu. Dann
          hast du die Pflichten eines Eigentümers, aber nicht seine Rechte, und genau das kritisieren Gelehrte,
          wie beim <L to="/wissen/ist-leasing-haram">Leasing</L> auch.
        </p>
      </>
    ),
  },
  {
    id: "musharaka",
    titel: "Gemeinsam kaufen: das Modell mit dem echten Risiko",
    inhalt: (
      <>
        <p>
          Das ist das Modell, das dem Gedanken am nächsten kommt. Du und die Bank kauft das Haus gemeinsam.
          Sagen wir, du bringst zwanzig Prozent ein, die Bank achtzig.
        </p>
        <Bild text="Beide sind Eigentümer. Du kaufst der Bank Stück für Stück ihren Anteil ab, und die Miete sinkt mit.">
          <IlluMusharaka />
        </Bild>
        <p>
          Du wohnst darin und zahlst der Bank Miete für ihren Anteil. Gleichzeitig kaufst du ihr Monat für
          Monat kleine Stücke ihres Anteils ab. Mit der Zeit gehört dir mehr, der Bank weniger, und die Miete
          sinkt entsprechend. Am Ende gehört das Haus dir allein.
        </p>
        <p>
          Der Grund, warum viele Gelehrte dieses Modell bevorzugen: Die Bank ist die ganze Zeit wirklich
          Miteigentümerin. Sinkt der Wert des Hauses, trifft es sie mit. Sie trägt echtes Risiko, und deshalb
          darf sie auch verdienen.
        </p>
        <Checkliste
          punkte={[
            { art: "ja", text: "Die Miete bezieht sich nur auf den Anteil, der noch der Bank gehört, und sinkt mit ihm." },
            { art: "nein", text: "Kein Aufschlag auf den Anteil, den du bereits selbst bezahlt hast. Für dein eigenes Eigentum zahlst du keine Miete." },
            { art: "nein", text: "Kein Zwang, die Anteile zu kaufen. Ein Kaufzwang macht aus der Partnerschaft wieder eine Finanzierung." },
            { art: "ja", text: "Echte Partnerschaft, also Gewinn und Verlust. Fällt der Wert, trägt die Bank ihren Anteil daran mit." },
          ]}
        />
        <p>
          Im Ausland gibt es dafür geprüfte Anbieter, in Großbritannien etwa eine Genossenschaft, die genau nach
          diesem Modell arbeitet und ihre Verträge von einem Gelehrtengremium prüfen lässt. Auch die deutsche
          Baugenossenschaft ist ein verwandter Gedanke, wenn auch ohne islamische Prüfung: Du wirst Mitglied,
          erwirbst Anteile und wohnst zu einem Nutzungsentgelt.
        </p>
      </>
    ),
  },
  {
    id: "fatwa",
    titel: "Die Fatwa von 1999, auf die sich alle berufen",
    inhalt: (
      <>
        <Frage>Ich habe gehört, für Muslime im Westen sei der Hauskredit erlaubt. Stimmt das?</Frage>
        <p>
          Es gibt tatsächlich eine solche Entscheidung. Der Europäische Rat für Fatwa und Forschung hat 1999
          unter Vorsitz von Yusuf al-Qaradawi beschlossen, dass Muslime in westlichen Ländern unter bestimmten
          Umständen eine konventionelle Hypothek aufnehmen dürfen, um eine Wohnung für ihre Familie zu
          erwerben. Sie ist der meistzitierte Text zu diesem Thema und der am häufigsten missverstandene.
        </p>
        <p>Was man dazu wissen sollte, bevor man sich darauf beruft:</p>
        <Schritte
          schritte={[
            {
              titel: "Sie bestätigt selbst, dass Zins verboten ist",
              text: "Die Entscheidung hebt das Verbot nicht auf. Sie stützt sich darauf, dass eine Härte vorliegt, und Härte macht etwas Verbotenes ausnahmsweise zulässig, sie macht es nicht erlaubt.",
            },
            {
              titel: "Sie war eine Mehrheitsentscheidung",
              text: "Sie war im Rat selbst umstritten und ist bis heute nicht Konsens. Andere Gremien sind ihr ausdrücklich nicht gefolgt.",
            },
            {
              titel: "Sie ist über fünfundzwanzig Jahre alt",
              text: "Sie erging in einer Lage, in der es im Westen praktisch keine Alternativen gab. Seitdem hat sich der Markt bewegt, wenn auch langsam. Wo es eine geprüfte Alternative gibt, fällt die Begründung weg.",
            },
            {
              titel: "Sie ist keine Erlaubnis für dich persönlich",
              text: "Eine allgemeine Fatwa spricht zu einer Lage, nicht zu einem Menschen. Ob deine Lage die beschriebene Härte erfüllt, klärt ein Gelehrter mit Rückfragen zu deiner Miete, deiner Familie, deinen Alternativen und deinem Einkommen.",
            },
          ]}
        />
        <Hinweis titel="Ein überliefertes Beispiel aus der Praxis">
          <p>
            In einem bekannt gewordenen Fall in Frankfurt wurde einer Familie die Wohnung wegen Eigenbedarfs
            gekündigt, nachdem das fünfte Kind gekommen war, und sie fand nichts Vergleichbares. Der Gelehrte,
            der den Fall prüfte, hielt die Härte für gegeben, machte aber die Auflage, so schnell wie möglich zu
            tilgen. Das ist der Unterschied zwischen einer geprüften Ausnahme und einem Freibrief.
          </p>
        </Hinweis>
        <Merksatz>
          Wer sich ungeprüft auf die Fatwa beruft, hat keine Ausnahme in der Hand, sondern nur einen Zinsvertrag.
        </Merksatz>
      </>
    ),
  },
  {
    id: "deutschland",
    titel: "Was es davon in Deutschland wirklich gibt",
    inhalt: (
      <>
        <p>Hier wird es unangenehm ehrlich. Die Auswahl ist klein.</p>
        <p>
          Die <B>KT Bank</B> ist die erste Bank in Deutschland, die Finanzprodukte nach den Grundsätzen des
          Islamic Banking anbietet, und hat eine Immobilienfinanzierung im Programm. Daneben gibt es Vermittler
          wie <B>INAIA</B>. Das war es im Wesentlichen. Gelehrte, die den deutschen Markt beobachten, sagen
          offen, dass sie Stand Ende 2025 kein Angebot kennen, das sie geprüft und für unbedenklich befunden
          haben.
        </p>
        <p>
          Was das praktisch heißt: Du kannst nicht zehn Angebote vergleichen wie bei einem normalen Baukredit.
          Und weil der Wettbewerb fehlt, sind die Gesamtkosten oft höher als bei einer konventionellen
          Finanzierung. Wer islamkonform finanziert, zahlt in vielen Fällen drauf. Das ist der Preis, und man
          sollte ihn kennen, bevor man anfängt.
        </p>
        <p>
          Wir haben zu diesen Anbietern <B>noch keine geprüften Konditionen</B>. Sobald wir sie haben, findest
          du sie hier im Vergleich.
        </p>
        <Hinweis titel="Der Weg, den niemand auf dem Schirm hat">
          <p>
            Ein Ratenkauf direkt vom privaten Eigentümer. Wer ein Haus verkauft und nicht sofort das ganze Geld
            braucht, kann dir den Kaufpreis in Raten über fünf oder zehn Jahre stunden. Es ist ein Kaufvertrag
            zwischen zwei Privatleuten, keine Bank ist beteiligt, und damit ist es unstrittig zulässig. Solche
            Verkäufer zu finden ist schwer, aber es kommt vor, besonders bei Verkäufen innerhalb der Familie
            oder in der Nachbarschaft.
          </p>
        </Hinweis>
      </>
    ),
  },
  {
    id: "worauf-achten",
    titel: "Worauf du im Vertrag achten musst",
    inhalt: (
      <>
        <p>Vier Punkte entscheiden darüber, ob ein Angebot hält, was der Name verspricht.</p>
        <Checkliste
          punkte={[
            {
              art: "neutral",
              text: (
                <>
                  <B>Kauft der Anbieter das Haus wirklich?</B> Wenn er nur Geld überweist und ein Formular
                  anders beschriftet, ist es ein Kredit mit anderem Namen. Frag nach dem Grundbucheintrag.
                </>
              ),
            },
            {
              art: "neutral",
              text: (
                <>
                  <B>Was passiert bei Zahlungsverzug?</B> Ein zulässiger Vertrag kennt keine Verzugszinsen. Der
                  Preis steht fest und darf nicht wachsen, weil du später zahlst.
                </>
              ),
            },
            {
              art: "neutral",
              text: (
                <>
                  <B>Wer trägt die Lasten am Gebäude?</B> Solange der Anbieter Eigentümer oder Miteigentümer
                  ist, gehören größere Reparaturen und die Versicherung anteilig zu ihm.
                </>
              ),
            },
            {
              art: "neutral",
              text: (
                <>
                  <B>Gibt es ein Gutachten, und darfst du es lesen?</B> Seriöse Anbieter lassen ihre Verträge
                  von einem Gelehrtengremium prüfen und zeigen das Dokument. Wer nur behauptet, konform zu sein,
                  ohne einen Nachweis zu nennen, sollte das erklären können.
                </>
              ),
            },
          ]}
        />
      </>
    ),
  },
  {
    id: "alternative",
    titel: "Die Alternative, über die kaum jemand spricht",
    inhalt: (
      <>
        <p>
          Es gibt einen Weg, der immer funktioniert und keinen Vertrag braucht: länger mieten und konsequent
          ansparen, bis ein größerer Teil oder alles bar bezahlt werden kann.
        </p>
        <Beispiel
          titel="Zwei Wege über zwanzig Jahre"
          rechnung={[
            "Weg 1: 20 Jahre Finanzierung, am Ende gehört dir das Haus, du hast deutlich mehr gezahlt als den Preis",
            "Weg 2: 12 Jahre mieten und die Differenz anlegen, dann mit hohem Eigenanteil kaufen",
          ]}
          ergebnis="Weg 2 dauert länger und lässt dich beweglich. Weg 1 bindet dich zwanzig Jahre an eine Rate."
        >
          <p>
            Welcher besser ist, hängt an deiner Miete, deinem Ort und deinem Einkommen. Rechne es einmal ehrlich
            durch, statt es zu glauben.
          </p>
        </Beispiel>
        <p>
          Und noch ein Gedanke, der in vielen Familien fehlt: Wer zur Miete wohnt, ist nicht schlechter
          gestellt. Das deutsche Mietrecht schützt Mieter stark, ein Vermieter kommt nicht ohne Weiteres aus dem
          Vertrag heraus, und rein wirtschaftlich ist Eigentum oft die schlechtere Rechnung als der Ruf
          vermuten lässt. Der Druck, unbedingt zu kaufen, kommt selten aus der Rechnung und meist aus dem
          Umfeld.
        </p>
      </>
    ),
  },
];

const faq: BeitragFrage[] = [
  {
    frage: "Gilt die Fatwa von 1999 auch für mich?",
    antwort:
      "Nicht automatisch. Der Europäische Rat für Fatwa und Forschung hat 1999 mit Mehrheit entschieden, dass eine konventionelle Hypothek unter bestimmten Umständen zulässig sein kann. Die Entscheidung bestätigt, dass Zins verboten ist, und stützt sich auf eine Härte im Einzelfall. Ob diese Härte bei dir vorliegt, prüft ein Gelehrter mit Rückfragen zu deiner Lage. Wer sich ungeprüft darauf beruft, hat nur einen Zinsvertrag.",
  },
  {
    frage: "Ist Mietkauf islamisch in Ordnung?",
    antwort:
      "Es kommt auf die Bauart an. Stehen Miete und Kaufverpflichtung in einem Vertrag, sehen Gelehrte das kritisch, weil das islamische Recht keinen Eigentumsvorbehalt kennt: Eigentum geht ganz über oder gar nicht. Läuft erst ein reiner Mietvertrag und folgt am Ende ein eigener, neuer Kaufvertrag, ist es zulässig.",
  },
  {
    frage: "Ist ein Bausparvertrag eine Lösung?",
    antwort:
      "Nein. Beim Bausparen ist beides verzinst, das Guthaben in der Ansparphase und das Darlehen danach. Der Vertrag ist auf Zins gebaut und lässt sich nicht anders einstellen.",
  },
  {
    frage: "Was ist mit der KfW-Förderung?",
    antwort:
      "Die KfW vergibt zinsverbilligte Kredite, und ein Kredit bleibt ein Kredit. Reine Zuschüsse, die nicht zurückgezahlt werden müssen, sind etwas anderes und werden in der Regel als unproblematisch gesehen. Kläre den konkreten Fall mit einem Gelehrten.",
  },
  {
    frage: "Kann ich ein Haus direkt vom Eigentümer in Raten kaufen?",
    antwort:
      "Ja, und das ist der unstrittigste Weg überhaupt. Ein Kaufvertrag zwischen zwei Privatleuten mit festem Preis und Ratenzahlung ist Handel, keine Finanzierung. Solche Verkäufer sind selten, kommen aber vor, besonders im Familien- und Bekanntenkreis.",
  },
  {
    frage: "Ich habe schon einen Zinskredit laufen. Was jetzt?",
    antwort:
      "Die verbreitete Empfehlung ist, nicht in Panik zu verfallen, sondern so schnell wie möglich herauszukommen. Also Sondertilgungen nutzen, wo sie erlaubt sind, und prüfen, ob eine Umschuldung auf ein zulässiges Modell möglich ist. Bevor du eine bestehende Finanzierung kündigst, sprich mit jemandem, der dein konkretes Risiko einschätzen kann.",
  },
  {
    frage: "Warum ist die islamkonforme Finanzierung teurer?",
    antwort:
      "Zwei Gründe. Es gibt kaum Anbieter, also fehlt der Wettbewerb. Und bei manchen Modellen fällt die Grunderwerbsteuer zweimal an, weil das Haus zweimal den Eigentümer wechselt.",
  },
  {
    frage: "Gilt Miete als rausgeworfenes Geld?",
    antwort:
      "Nein. Du bezahlst dafür, irgendwo zu wohnen, und bekommst dafür eine Gegenleistung. Miete ist ein normaler Tausch von Geld gegen Nutzung und im Islam unstrittig zulässig. Das deutsche Mietrecht schützt Mieter zudem stark.",
  },
];

const beschreibung =
  "Die Wege, ein Haus ohne Zinsen zu finanzieren, was es davon in Deutschland gibt, worauf du im Vertrag achten musst und was die viel zitierte Fatwa von 1999 wirklich sagt.";

const HausKaufenOhneZinsen = () => (
  <>
    <Seo
      title="Islamische Baufinanzierung ohne Zinsen | finanzmuslim"
      description={beschreibung}
      path="/wissen/haus-kaufen-ohne-zinsen"
      jsonLd={beitragJsonLd({
        titel: "Islamische Baufinanzierung ohne Zinsen",
        beschreibung,
        path: "/wissen/haus-kaufen-ohne-zinsen",
        datePublished: "15. August 2026",
        dateModified: "5. September 2026",
        faq,
      })}
    />
    <BeitragSeite
      slug="haus-kaufen-ohne-zinsen"
      titel="Islamische Baufinanzierung ohne Zinsen"
      untertitel="Drei Modelle für den Hauskauf, eine viel zitierte Fatwa und ein Weg, an den kaum jemand denkt."
      kurzGesagt={[
        "Ein normaler Baukredit gilt bei den meisten Gelehrten als nicht zulässig, weil der Aufschlag allein durch Zeit entsteht.",
        "Es gibt drei anerkannte Alternativen. Bei allen kauft der Anbieter das Haus zuerst selbst.",
        "Bei Miete mit Kauf am Ende entscheidet, ob es ein Vertrag ist oder zwei getrennte.",
        "Die Fatwa von 1999 hebt das Zinsverbot nicht auf. Sie ist eine Härtefallregel, die geprüft werden muss.",
        "In Deutschland ist die Auswahl klein und die Finanzierung meist teurer als eine konventionelle.",
        "Ein Ratenkauf direkt vom privaten Eigentümer ist der unstrittigste Weg von allen.",
      ]}
      abschnitte={abschnitte}
      faq={faq}
      datePublished="15. August 2026"
      dateModified="5. September 2026"
      boxMitteNach={5}
      rechtshinweis="Dieser Beitrag gibt bekannte Positionen wieder und dient ausschließlich zu Bildungszwecken. Er ist keine Fatwa und ersetzt weder die Auskunft eines Gelehrten noch eine Rechts-, Steuer- oder Finanzierungsberatung. Die Darstellung der Entscheidung des Europäischen Rats für Fatwa und Forschung von 1999 ist eine Zusammenfassung ihres Inhalts und ihrer Voraussetzungen, keine Anwendung auf einen Einzelfall. Genannte Anbieter sind Beispiele für den deutschen Markt, keine Empfehlung. Innerhalb der Rechtsschulen gibt es zu einzelnen Modellen abweichende Auffassungen. Die Zahlen in den Beispielen sind erfunden."
      boxOben={{
        kategorie: "Rechner",
        ueberschrift: "Eigenkapital ansparen",
        text: "Rechne aus, wie viel du im Monat zurücklegst, bis das Eigenkapital steht.",
        knopf: "Zum Sparzielrechner",
        linkZiel: "/sparzielrechner",
      }}
      boxMitte={{
        kategorie: "Depot",
        ueberschrift: "Erst ansparen, dann kaufen",
        linkZiel: "/vergleich/depot",
      }}
    >
      <PasstDazu
        punkte={[
          { to: "/wissen/halal-kredit-ohne-zinsen", name: "Kredit ohne Zinsen", text: "erklärt die vier Vertragsformen, die einen Kredit ersetzen." },
          { to: "/wissen/ratenzahlung-haram", name: "Ist Ratenzahlung haram?", text: "warum ein Ratenkauf vom Eigentümer Handel ist und kein Kredit." },
          { to: "/vorlagen/vertrags-ampel", name: "Die Vertrags-Ampel", text: "ordnet zwölf Alltagsverträge ein, darunter Kredit, Bausparen und Leasing." },
          { to: "/wissen/ist-versicherung-haram", name: "Ist eine Versicherung haram?", text: "die Gebäudeversicherung ist beim Hauskauf die nächste Frage." },
        ]}
      />
    </BeitragSeite>
  </>
);

export default HausKaufenOhneZinsen;
