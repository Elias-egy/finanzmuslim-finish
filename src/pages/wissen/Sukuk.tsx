import Seo, { beitragJsonLd } from "@/components/Seo";
import BeitragSeite, { type BeitragAbschnitt, type BeitragFrage } from "@/components/BeitragSeite";
import { IlluSukuk } from "@/components/illu";
import {
  B,
  Begriff,
  Bild,
  Frage,
  Hinweis,
  L,
  Merksatz,
  PasstDazu,
  Tabelle,
} from "@/components/beitrag";

const abschnitte: BeitragAbschnitt[] = [
  {
    id: "was-ist-sukuk",
    titel: "Ein Sukuk ist kein Kredit",
    inhalt: (
      <>
        <p>
          Bei einer Anleihe leihst du einem Staat oder einer Firma Geld und bekommst dafür Zinsen. Genau das
          geht im Islam nicht. Sukuk lösen dasselbe Bedürfnis anders.
        </p>
        <Merksatz>Ein Sukuk ist ein Anteil an einer Sache, nicht ein Anspruch auf Geld.</Merksatz>
        <Bild text="Hinter dem Anteil steht ein Gebäude, das vermietet wird. Der Ertrag ist die Miete, nicht ein Zins.">
          <IlluSukuk />
        </Bild>
        <p>
          Ein Beispiel. Ein Staat braucht Geld für einen Flughafen. Statt eine Anleihe auszugeben, verkauft er
          Anteile an einem Gebäude, das ihm gehört, mietet es zurück und zahlt Miete. Wer ein Sukuk hält,
          bekommt einen Teil dieser Miete. Am Ende der Laufzeit kauft der Staat die Anteile zurück, und zwar
          zum eingesetzten Betrag, ohne Aufschlag. Der Aufschlag wäre genau das, was verboten ist.
        </p>
        <p>
          Der Ertrag kommt also nicht daher, dass Geld Zeit kostet, sondern daher, dass eine reale Sache
          genutzt wird. Das ist der ganze Unterschied, und er hängt daran, ob die Sache wirklich existiert.
        </p>
        <Begriff wort="Sukuk" arabisch="Sukuk, Einzahl Sakk">
          Das Wort bedeutet Urkunde. Die Mehrzahl ist Sukuk, die Einzahl also eigentlich Sakk. Im Deutschen
          sagt man meist einfach „ein Sukuk“.
        </Begriff>
      </>
    ),
  },
  {
    id: "unterschied",
    titel: "Sukuk und Anleihe nebeneinander",
    inhalt: (
      <>
        <p>Fünf Fragen zeigen, wo die Wege auseinandergehen.</p>
        <Tabelle
          kopf={["Frage", "Anleihe", "Sukuk"]}
          zeilen={[
            ["Was besitzt du?", "Eine Forderung. Du hast Geld verliehen.", "Einen Anteil an einer Sache oder einem Projekt."],
            ["Woher kommt der Ertrag?", "Zins. Der Preis dafür, dass das Geld Zeit braucht.", "Miete oder Gewinn aus der Nutzung der Sache."],
            ["Was kommt am Ende zurück?", "Der Betrag plus die aufgelaufenen Zinsen.", "Der eingesetzte Betrag, eins zu eins, ohne Aufschlag."],
            ["Wer trägt das Risiko?", "Der Schuldner zahlt, solange er zahlungsfähig ist.", "Grundsätzlich trägst du das Risiko der Sache mit."],
            ["Wofür darf das Geld verwendet werden?", "Für alles, auch für Geschäfte, die du meiden willst.", "Nur für erlaubte Zwecke, geprüft von einem Gremium."],
          ]}
        />
        <Hinweis titel="Auch der Weiterverkauf ist ein Problem">
          <p>
            Bei einer Anleihe steckt das Verbotene nicht nur im Zins, sondern auch im Handel damit. Wer eine
            Schuldverschreibung weiterverkauft, verkauft eine Geldforderung, also Geld gegen Geld zu einem
            anderen Betrag. Genau deshalb reicht es nicht, den Kupon zu spenden und die Anleihe zu behalten.
          </p>
        </Hinweis>
        <p>
          Das ist die Theorie. Wie weit die Praxis mitzieht, ist der interessantere Teil, und der steht weiter
          unten.
        </p>
      </>
    ),
  },
  {
    id: "bauformen",
    titel: "Die häufigsten Bauformen",
    inhalt: (
      <>
        <p>
          Sukuk sind kein einheitliches Produkt. Der Name sagt nur, dass es Anteile sind. Was dahintersteckt,
          entscheidet die Bauform.
        </p>
        <Tabelle
          kopf={["Bauform", "Was dahintersteckt", "Einordnung"]}
          zeilen={[
            [
              "Idschara",
              "Ein Gebäude, eine Anlage oder ein Flugzeug wird vermietet. Die Miete geht an die Anleger.",
              "Der häufigste Fall. Am nächsten an dem, was Anleger von einer Anleihe erwarten.",
            ],
            [
              "Murabaha",
              "Ein Warenkauf mit festem Aufschlag. Der Ertrag ist dieser Aufschlag.",
              "Die strittigste Form, weil daraus eine reine Geldforderung wird. An manchen Märkten nicht handelbar.",
            ],
            [
              "Muscharaka, Mudaraba",
              "Beteiligung an einem Geschäft. Gewinn nach festem Schlüssel, Verlust trägt in der Regel das Kapital.",
              "Die sauberste Form im Sinne der Risikoteilung, und die seltenste.",
            ],
            [
              "Wakala",
              "Ein Verwalter legt das Geld in einen Korb erlaubter Anlagen an und stellt einen erwarteten Ertrag in Aussicht.",
              "Flexibel, dafür schwerer zu durchschauen.",
            ],
          ]}
        />
        <p>
          Wer ein einzelnes Sukuk prüft, sollte wissen, welche Bauform vorliegt. Bei einem Fonds nimmt dir das
          Gremium des Anbieters diese Arbeit ab, und genau dessen Namen sollte man kennen.
        </p>
      </>
    ),
  },
  {
    id: "kritik",
    titel: "Die Kritik, die man kennen sollte",
    inhalt: (
      <>
        <Frage>Wenn Sukuk so anders gebaut sind, warum verhalten sie sich dann wie Anleihen?</Frage>
        <p>
          Weil sie es in vielen Fällen wirtschaftlich auch sind. Sukuk sind kein unumstrittenes Produkt, und
          es wäre unehrlich, das zu verschweigen. Die Kritik kommt nicht von außen, sondern aus der islamischen
          Finanzwelt selbst.
        </p>
        <p>
          <B>Der Kernvorwurf:</B> Viele Sukuk enthalten eine Zusage des Herausgebers, die Anteile am Ende zum
          ursprünglichen Preis zurückzukaufen, unabhängig davon, was die Sache dann wert ist. Damit trägt der
          Anleger das Risiko der Sache gerade nicht mehr. Wirtschaftlich bleibt eine feste Rückzahlung plus
          laufende Zahlung übrig, also das, was eine Anleihe auch tut.
        </p>
        <p>
          Muhammad Taqi Usmani, langjähriger Vorsitzender des Gremiums der Standardsetzerin AAOIFI, hat 2008
          öffentlich festgestellt, dass ein großer Teil der damals gehandelten Sukuk die Anforderungen nicht
          erfüllte. Danach wurden die Standards nachgeschärft. Die Frage ist bis heute nicht abschließend
          geklärt.
        </p>
        <p>
          <B>Der zweite Punkt</B> ist der Unterschied zwischen Sukuk, bei denen die Sache wirklich den Anlegern
          gehört, und solchen, bei denen sie nur als Rechenbezug dient. Im Insolvenzfall entscheidet genau das
          darüber, ob du Eigentümer bist oder Gläubiger unter vielen.
        </p>
        <p>
          Was das für dich heißt: Wer Sukuk hält, sollte wissen, wer sie geprüft hat und nach welchem Standard.
          Bei den Fonds in unserer <L to="/halal-anlagen">Datenbank</L> steht das jeweils dabei.
        </p>
      </>
    ),
  },
  {
    id: "deutschland",
    titel: "Ein einziges Mal in Deutschland",
    inhalt: (
      <>
        <p>
          2004 gab das Land Sachsen-Anhalt ein Sukuk über rund 100 Millionen Euro aus, das erste seiner Art in
          Europa. Zugrunde lagen Landesimmobilien, die vermietet und am Ende der Laufzeit zurückgekauft wurden.
        </p>
        <p>
          Seitdem ist in Deutschland kein weiteres Sukuk-Projekt zustande gekommen. Wer heute Sukuk halten
          will, kauft ausländische Papiere, in aller Regel über einen Fonds.
        </p>
      </>
    ),
  },
  {
    id: "wie-investieren",
    titel: "Wie man in Sukuk investiert",
    inhalt: (
      <>
        <p>
          Einzelne Sukuk werden in großen Stückelungen gehandelt und sind für Privatanleger in Deutschland
          praktisch nicht erreichbar. Der Zugang läuft über Fonds, die viele Sukuk bündeln. In unserer{" "}
          <L to="/halal-anlagen">Datenbank</L> stehen sie mit Kosten, Fondsgröße und der Stelle, die sie
          geprüft hat, dazu der Kursverlauf.
        </p>
        <Hinweis titel="Was du realistisch erwarten solltest">
          <p>
            Sukuk-Fonds schwanken weniger als Aktienfonds, dafür ist auch der Ertrag deutlich kleiner. Sie
            werden meist beigemischt, um Schwankungen zu dämpfen, nicht um Vermögen aufzubauen. Die meisten
            notieren in US-Dollar, damit läuft der Wechselkurs mit.
          </p>
        </Hinweis>
        <p>
          Ein Nebeneffekt, der praktisch ist: Bei Sukuk stellt sich die Frage nach der{" "}
          <L to="/wissen/ertraege-reinigen">Bereinigung</L> in der Regel nicht, weil es keine Firmengewinne
          gibt, in denen ein unreiner Rest stecken könnte.
        </p>
        <p>
          Welche Verteilung für dich passt, entscheidest du selbst oder mit jemandem, der dich und deine Lage
          kennt. Diese Seite gibt keine Empfehlung ab.
        </p>
      </>
    ),
  },
];

const faq: BeitragFrage[] = [
  {
    frage: "Was ist ein Sukuk?",
    antwort:
      "Ein Anteilsschein an einer realen Sache oder einem Projekt. Der Ertrag kommt aus der Nutzung dieser Sache, etwa aus Miete, nicht aus Zins. Am Ende der Laufzeit wird der eingesetzte Betrag ohne Aufschlag zurückgezahlt. Deshalb gilt der Sukuk als islamkonforme Alternative zur Anleihe.",
  },
  {
    frage: "Sind Sukuk halal?",
    antwort:
      "Ein Sukuk ist so konform wie seine Bauform und die Sache dahinter. Entscheidend ist, ob wirklich ein Vermögenswert übertragen wird und ob eine Prüfstelle das nach einem anerkannten Standard bestätigt hat. Pauschal lässt sich die Frage nicht beantworten.",
  },
  {
    frage: "Was ist der Unterschied zwischen Sukuk und Anleihe?",
    antwort:
      "Bei der Anleihe hast du eine Geldforderung und bekommst Zins. Beim Sukuk hältst du einen Anteil an einer Sache und bekommst einen Teil ihres Ertrags, etwa Miete. In der Praxis nähern sich manche Sukuk der Anleihe an, wenn eine Rückkaufzusage zum ursprünglichen Preis enthalten ist.",
  },
  {
    frage: "Reicht es, wenn ich die Zinsen einer Anleihe weggebe?",
    antwort:
      "Nach verbreiteter Auffassung nicht. Bei einer Anleihe steckt das Problem nicht nur im Kupon: Wer eine Schuldverschreibung kauft oder weiterverkauft, handelt mit einer Geldforderung, also mit Geld gegen Geld zu einem anderen Betrag.",
  },
  {
    frage: "Kann ich als Privatanleger einzelne Sukuk kaufen?",
    antwort:
      "In der Regel nicht. Einzelne Sukuk werden in großen Stückelungen gehandelt und sind über deutsche Broker kaum verfügbar. Der übliche Weg für Privatanleger sind Fonds, die viele Sukuk bündeln.",
  },
  {
    frage: "Muss ich die Erträge eines Sukuk-Fonds reinigen?",
    antwort:
      "In der Regel nicht. Der Ertrag stammt aus Miete oder Projektgewinn und nicht aus Firmengewinnen, in denen ein unreiner Zinsanteil stecken könnte. Was der Anbieter dazu schreibt, steht im Jahresbericht.",
  },
  {
    frage: "Wie viel Ertrag bringen Sukuk?",
    antwort:
      "Deutlich weniger als Aktien, dafür schwanken sie weniger. Der Ertrag hängt an der Bauform, der Laufzeit und der Bonität des Herausgebers. Vergangene Werte sagen nichts über die Zukunft.",
  },
  {
    frage: "Gab es schon ein Sukuk in Deutschland?",
    antwort:
      "Ja, ein einziges. Das Land Sachsen-Anhalt gab 2004 ein Sukuk über rund 100 Millionen Euro aus, das erste seiner Art in Europa. Zugrunde lagen Landesimmobilien, die vermietet und am Ende der Laufzeit zurückgekauft wurden. Seitdem ist kein weiteres deutsches Projekt zustande gekommen.",
  },
];

const beschreibung =
  "Ein Sukuk ist ein Anteil an einer Sache, keine Geldforderung. Die vier Bauformen, der Unterschied zur Anleihe, die Kritik aus der islamischen Finanzwelt und wie Privatanleger Zugang bekommen.";

const Sukuk = () => (
  <>
    <Seo
      title="Sukuk statt Anleihe: Anteil an einer Sache | finanzmuslim"
      description={beschreibung}
      path="/wissen/sukuk"
      jsonLd={beitragJsonLd({
        titel: "Sukuk statt Anleihe",
        beschreibung,
        path: "/wissen/sukuk",
        datePublished: "16. August 2026",
        dateModified: "5. September 2026",
        faq,
      })}
    />
    <BeitragSeite
      slug="sukuk"
      titel="Sukuk statt Anleihe"
      untertitel="Die zweite große Anlageklasse, und warum ihre schärfsten Kritiker aus den eigenen Reihen kommen."
      kurzGesagt={[
        "Ein Sukuk ist ein Anteil an einer Sache, keine Geldforderung.",
        "Der Ertrag kommt aus Miete oder Gewinn, nicht aus Zins. Am Ende kommt der Betrag eins zu eins zurück.",
        "Bei einer Anleihe ist auch der Weiterverkauf ein Problem, nicht nur der Kupon.",
        "Vier Bauformen: Idschara, Murabaha, Muscharaka und Wakala.",
        "Die Kritik lautet: Manche Sukuk sind wirtschaftlich doch eine Anleihe.",
        "Für Privatanleger führt der Weg über Fonds, nicht über einzelne Papiere.",
      ]}
      abschnitte={abschnitte}
      faq={faq}
      datePublished="16. August 2026"
      dateModified="5. September 2026"
      boxMitteNach={2}
      rechtshinweis="Dieser Beitrag gibt bekannte Positionen wieder und dient ausschließlich zu Bildungszwecken. Er ist keine Fatwa, keine Anlageberatung und keine Empfehlung. Zur Zulässigkeit einzelner Sukuk-Bauformen bestehen unterschiedliche Auffassungen, insbesondere zu Murabaha-Sukuk und zu Rückkaufzusagen. Investitionen in Wertpapiere sind mit Risiken verbunden, bis hin zum Totalverlust."
      boxOben={{
        kategorie: "Anlagen",
        ueberschrift: "Geprüfte Sukuk-Fonds mit Kosten und Prüfstelle",
        linkZiel: "/halal-anlagen",
        text: "27 Anlagen mit Kosten, Größe und Prüfstelle.",
        knopf: "Zu den Anlagen",
      }}
      boxMitte={{
        kategorie: "Depot",
        ueberschrift: "Ein Depot, das ohne Zinsgeschäft arbeitet",
        linkZiel: "/vergleich/depot",
      }}
    >
      <PasstDazu
        punkte={[
          { to: "/halal-anlagen", name: "Die Halal-Datenbank", text: "zeigt jede geprüfte Anlage mit Kosten, Größe und Prüfstelle." },
          { to: "/wissen/sind-aktien-halal", name: "Sind Aktien halal?", text: "erklärt die Prüfung, die hinter Aktienfonds steckt." },
          { to: "/wissen/zinsen-im-islam", name: "Zinsen im Islam", text: "klärt, warum die Anleihe überhaupt ein Problem ist." },
        ]}
      />
    </BeitragSeite>
  </>
);

export default Sukuk;
