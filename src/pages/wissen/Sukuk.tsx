import Seo, { beitragJsonLd } from "@/components/Seo";
import BeitragSeite, { type BeitragAbschnitt } from "@/components/BeitragSeite";
import { IlluHandel, IlluPruefung } from "@/components/illu";
import { Link } from "react-router-dom";

const Bild = ({ children, text }: { children: React.ReactNode; text: string }) => (
  <figure className="my-6">
    <div className="overflow-hidden rounded-2xl">{children}</div>
    <figcaption className="mt-2 text-[14px] text-muted-foreground">{text}</figcaption>
  </figure>
);

/** Gegenüberstellung Anleihe und Sukuk. Handy einspaltig, sonst zwei Spalten. */
const Gegenueber = ({
  frage,
  anleihe,
  sukuk,
}: {
  frage: string;
  anleihe: string;
  sukuk: string;
}) => (
  <div className="border-t border-border py-4">
    <p className="text-[15px] font-semibold text-foreground">{frage}</p>
    <div className="mt-2 grid gap-2 sm:grid-cols-2">
      <div className="rounded-lg bg-muted px-4 py-3">
        <p className="text-[12px] uppercase tracking-wide text-muted-foreground">Anleihe</p>
        <p className="mt-0.5 text-[15px] text-foreground">{anleihe}</p>
      </div>
      <div className="rounded-lg bg-accent px-4 py-3">
        <p className="text-[12px] uppercase tracking-wide text-primary">Sukuk</p>
        <p className="mt-0.5 text-[15px] text-foreground">{sukuk}</p>
      </div>
    </div>
  </div>
);

const Bauform = ({ name, text }: { name: string; text: string }) => (
  <div className="card-surface p-5">
    <p className="text-[17px] font-bold text-foreground">{name}</p>
    <p className="mt-2 text-[16px] text-muted-foreground">{text}</p>
  </div>
);

const abschnitte: BeitragAbschnitt[] = [
  {
    id: "was-ist-sukuk",
    titel: "Ein Sukuk ist kein Kredit",
    inhalt: (
      <>
        <p>
          Bei einer Anleihe leihst du einem Staat oder einer Firma Geld und bekommst dafür Zinsen.
          Genau das geht im Islam nicht. Sukuk lösen dasselbe Bedürfnis anders.
        </p>
        <p className="rounded-xl bg-hero p-5 text-[19px] font-bold text-foreground">
          Ein Sukuk ist ein Anteil an einer Sache, nicht ein Anspruch auf Geld.
        </p>
        <p>
          Ein Beispiel. Ein Staat braucht Geld für einen Flughafen. Statt eine Anleihe auszugeben,
          verkauft er Anteile an einem Gebäude, das ihm gehört, mietet es zurück und zahlt Miete.
          Wer ein Sukuk hält, bekommt einen Teil dieser Miete. Am Ende der Laufzeit kauft der Staat
          die Anteile zurück.
        </p>
        <p>
          Der Ertrag kommt also nicht daher, dass Geld Zeit kostet, sondern daher, dass eine reale
          Sache genutzt wird. Das ist der ganze Unterschied, und er hängt daran, ob die Sache
          wirklich existiert.
        </p>
        <p>
          Das Wort kommt vom arabischen „sakk", Urkunde. Die Mehrzahl ist Sukuk, die Einzahl also
          eigentlich Sakk. Im Deutschen sagt man meist einfach „ein Sukuk".
        </p>
        <Bild text="Bei der Anleihe fließt Geld gegen Zins. Beim Sukuk wechselt ein Anteil an einer Sache den Besitzer, und der Ertrag ist die Miete dafür.">
          <IlluHandel />
        </Bild>
      </>
    ),
  },
  {
    id: "unterschied",
    titel: "Sukuk und Anleihe nebeneinander",
    inhalt: (
      <>
        <p>Vier Fragen zeigen, wo die Wege auseinandergehen.</p>
        <div className="my-6">
          <Gegenueber
            frage="Was besitzt du?"
            anleihe="Eine Forderung. Du hast Geld verliehen."
            sukuk="Einen Anteil an einer Sache oder einem Projekt."
          />
          <Gegenueber
            frage="Woher kommt der Ertrag?"
            anleihe="Zins. Der Preis dafür, dass das Geld Zeit braucht."
            sukuk="Miete oder Gewinn aus der Nutzung der Sache."
          />
          <Gegenueber
            frage="Wer trägt das Risiko?"
            anleihe="Der Schuldner zahlt, solange er zahlungsfähig ist."
            sukuk="Grundsätzlich trägst du das Risiko der Sache mit."
          />
          <Gegenueber
            frage="Wofür darf das Geld verwendet werden?"
            anleihe="Für alles, auch für Geschäfte, die du meiden willst."
            sukuk="Nur für erlaubte Zwecke, geprüft von einem Gremium."
          />
        </div>
        <p>
          Das ist die Theorie. Wie weit die Praxis mitzieht, ist der interessantere Teil, und der
          steht weiter unten.
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
          Sukuk sind kein einheitliches Produkt. Der Name sagt nur, dass es Anteile sind. Was
          dahintersteckt, entscheidet die Bauform.
        </p>
        <div className="my-6 space-y-4">
          <Bauform
            name="Idschara-Sukuk"
            text="Der häufigste Fall. Hinter den Anteilen steht ein Gebäude, eine Anlage oder ein Flugzeug, das vermietet wird. Die Miete geht an die Anleger. Am nächsten an dem, was Anleger von einer Anleihe erwarten, und deshalb am weitesten verbreitet."
          />
          <Bauform
            name="Murabaha-Sukuk"
            text="Dahinter steht ein Warenkauf mit festem Aufschlag. Der Ertrag ist dieser Aufschlag. Weil daraus eine reine Geldforderung wird, gilt diese Form als die strittigste und ist an manchen Märkten nicht handelbar."
          />
          <Bauform
            name="Muscharaka und Mudaraba"
            text="Beteiligung an einem Geschäft. Gewinn wird nach einem vorher festgelegten Schlüssel geteilt, Verlust trägt in der Regel das Kapital. Die sauberste Form im Sinne der Risikoteilung, und die seltenste."
          />
          <Bauform
            name="Wakala-Sukuk"
            text="Ein Verwalter legt das Geld in einen Korb erlaubter Anlagen an und stellt einen erwarteten Ertrag in Aussicht. Flexibel, dafür schwerer zu durchschauen."
          />
        </div>
        <p>
          Wer ein einzelnes Sukuk prüft, sollte wissen, welche Bauform vorliegt. Bei einem Fonds
          nimmt dir das Gremium des Anbieters diese Arbeit ab, und genau dessen Namen sollte man
          kennen.
        </p>
      </>
    ),
  },
  {
    id: "kritik",
    titel: "Die Kritik, die man kennen sollte",
    inhalt: (
      <>
        <p>
          Sukuk sind kein unumstrittenes Produkt, und es wäre unehrlich, das zu verschweigen. Die
          Kritik kommt nicht von aussen, sondern aus der islamischen Finanzwelt selbst.
        </p>
        <p>
          <strong>Der Kernvorwurf:</strong> Viele Sukuk enthalten eine Zusage des Herausgebers, die
          Anteile am Ende zum ursprünglichen Preis zurückzukaufen, unabhängig davon, was die Sache
          dann wert ist. Damit trägt der Anleger das Risiko der Sache gerade nicht mehr. Wirtschaftlich
          bleibt eine feste Rückzahlung plus laufende Zahlung übrig, also das, was eine Anleihe auch
          tut.
        </p>
        <p>
          Muhammad Taqi Usmani, langjähriger Vorsitzender des Gremiums der Standardsetzerin AAOIFI,
          hat 2008 öffentlich festgestellt, dass ein großer Teil der damals gehandelten Sukuk die
          Anforderungen nicht erfüllte. Danach wurden die Standards nachgeschärft. Die Frage ist bis
          heute nicht abschließend geklärt.
        </p>
        <p>
          <strong>Der zweite Punkt</strong> ist der Unterschied zwischen Sukuk, bei denen die Sache
          wirklich den Anlegern gehört, und solchen, bei denen sie nur als Rechenbezug dient. Im
          Insolvenzfall entscheidet genau das darüber, ob du Eigentümer bist oder Gläubiger unter
          vielen.
        </p>
        <p>
          Was das für dich heißt: Wer Sukuk hält, sollte wissen, wer sie geprüft hat und nach
          welchem Standard. Bei den Fonds in unserer Datenbank steht das jeweils dabei.
        </p>
        <Bild text="Entscheidend ist nicht das Etikett, sondern wer geprüft hat und nach welchem Standard.">
          <IlluPruefung />
        </Bild>
      </>
    ),
  },
  {
    id: "wie-investieren",
    titel: "Wie man in Sukuk investiert",
    inhalt: (
      <>
        <p>
          Einzelne Sukuk werden in großen Stückelungen gehandelt und sind für Privatanleger in
          Deutschland praktisch nicht erreichbar. Der Zugang läuft über Fonds, die viele Sukuk
          bündeln.
        </p>
        <p>
          In unserer Datenbank stehen die Sukuk-Fonds mit Kosten, Fondsgröße und der Stelle, die
          sie geprüft hat, dazu der Kursverlauf.
        </p>
        <p>
          <Link to="/halal-anlagen" className="text-primary hover:underline">
            Zu den geprüften Anlagen
          </Link>
        </p>
        <p>
          <strong>Was du realistisch erwarten solltest:</strong> Sukuk-Fonds schwanken weniger als
          Aktienfonds, dafür ist auch der Ertrag deutlich kleiner. Sie werden meist beigemischt, um
          Schwankungen zu dämpfen, nicht um Vermögen aufzubauen. Die meisten notieren in
          US-Dollar, damit läuft der Wechselkurs mit.
        </p>
        <p>
          Welche Verteilung für dich passt, entscheidest du selbst oder mit jemandem, der dich und
          deine Lage kennt. Diese Seite gibt keine Empfehlung ab.
        </p>
      </>
    ),
  },
];

const faq = [
  {
    frage: "Was ist ein Sukuk?",
    antwort:
      "Ein Anteilsschein an einer realen Sache oder einem Projekt. Der Ertrag kommt aus der Nutzung dieser Sache, etwa aus Miete, nicht aus Zins. Deshalb gilt er als islamkonforme Alternative zur Anleihe.",
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
    frage: "Kann ich als Privatanleger einzelne Sukuk kaufen?",
    antwort:
      "In der Regel nicht. Einzelne Sukuk werden in großen Stückelungen gehandelt und sind über deutsche Broker kaum verfügbar. Der übliche Weg für Privatanleger sind Fonds, die viele Sukuk bündeln.",
  },
  {
    frage: "Wie viel Ertrag bringen Sukuk?",
    antwort:
      "Deutlich weniger als Aktien, dafür schwanken sie weniger. Der Ertrag hängt an der Bauform, der Laufzeit und der Bonität des Herausgebers. Vergangene Werte sagen nichts über die Zukunft.",
  },
  {
    frage: "Gab es schon ein Sukuk in Deutschland?",
    antwort:
      "Ja. Das Land Sachsen-Anhalt gab 2004 ein Sukuk über rund 100 Millionen Euro aus, das erste seiner Art in Europa. Zugrunde lagen Landesimmobilien, die vermietet und am Ende der Laufzeit zurückgekauft wurden.",
  },
];

const Sukuk = () => (
  <>
    <Seo
      title="Sukuk statt Anleihe: Anteil an einer Sache | finanzmuslim"
      description="Ein Sukuk ist ein Anteil an einer Sache, keine Geldforderung. Die vier Bauformen, der Unterschied zur Anleihe, die Kritik aus der islamischen Finanzwelt und wie Privatanleger Zugang bekommen."
      path="/wissen/sukuk"
      jsonLd={beitragJsonLd({
        titel: "Sukuk statt Anleihe",
        beschreibung: "Ein Sukuk ist ein Anteil an einer Sache, keine Geldforderung. Die vier Bauformen, der Unterschied zur Anleihe, die Kritik aus der islamischen Finanzwelt und wie Privatanleger Zugang bekommen.",
        path: "/wissen/sukuk",
        geprueftAm: "16. August 2026",
        faq,
      })}
    />
    <BeitragSeite
      titel="Sukuk statt Anleihe"
      kurzGesagt={[
        "Ein Sukuk ist ein Anteil an einer Sache, keine Geldforderung.",
        "Der Ertrag kommt aus Miete oder Gewinn, nicht aus Zins.",
        "Vier Bauformen: Idschara, Murabaha, Muscharaka und Wakala.",
        "Die Kritik lautet: Manche Sukuk sind wirtschaftlich doch eine Anleihe.",
        "Für Privatanleger führt der Weg über Fonds, nicht über einzelne Papiere.",
      ]}
      abschnitte={abschnitte}
      faq={faq}
      geprueftAm="16. August 2026"
      rechtshinweis="Dieser Beitrag gibt bekannte Positionen wieder und dient ausschließlich zu Bildungszwecken. Er ist keine Fatwa, keine Anlageberatung und keine Empfehlung. Zur Zulässigkeit einzelner Sukuk-Bauformen bestehen unterschiedliche Auffassungen, insbesondere zu Murabaha-Sukuk und zu Rückkaufzusagen. Investitionen in Wertpapiere sind mit Risiken verbunden, bis hin zum Totalverlust."
      boxOben={{
        kategorie: "Anlagen",
        ueberschrift: "Geprüfte Sukuk-Fonds mit Kosten und Prüfstelle",
        linkZiel: "/halal-anlagen",
        text: "26 Anlagen mit Kosten, Größe und Prüfstelle.",
        knopf: "Zu den Anlagen",
      }}
      boxMitte={{
        kategorie: "Depot",
        ueberschrift: "Ein Depot, das ohne Zinsgeschäft arbeitet",
        linkZiel: "/vergleich/depot",
      }}
    >
      <section className="card-surface p-6">
        <h2 className="text-[19px] font-bold text-foreground">Passt dazu</h2>
        <ul className="mt-3 space-y-2 text-[16px]">
          <li>
            <Link to="/halal-anlagen" className="text-primary hover:underline">
              Die Halal-Datenbank
            </Link>{" "}
            zeigt jede geprüfte Anlage mit Kosten, Größe und Prüfstelle.
          </li>
          <li>
            <Link to="/wissen/sind-aktien-halal" className="text-primary hover:underline">
              Sind Aktien halal?
            </Link>{" "}
            erklärt die Prüfung, die hinter Aktienfonds steckt.
          </li>
          <li>
            <Link to="/wissen/zinsen-im-islam" className="text-primary hover:underline">
              Zinsen im Islam
            </Link>{" "}
            klärt, warum die Anleihe überhaupt ein Problem ist.
          </li>
        </ul>
      </section>
    </BeitragSeite>
  </>
);

export default Sukuk;
