import Seo from "@/components/Seo";
import ArtikelSeite, { type ArtikelAbschnitt } from "@/components/ArtikelSeite";

const abschnitte: ArtikelAbschnitt[] = [
  {
    titel: "Was Riba bedeutet",
    id: "bedeutung",
    inhalt: (
      <>
        <p>
          Riba heißt wörtlich Zuwachs oder Mehrung. Gemeint ist ein Mehrwert, den jemand bekommt,
          ohne dafür eine echte Gegenleistung zu erbringen und ohne ein echtes Risiko zu tragen.
        </p>
        <p>
          Am bekanntesten ist der Zins. Du leihst Geld und bekommst mehr zurück, als du gegeben hast.
          Der Aufschlag entsteht allein durch die Zeit, nicht durch Arbeit, Handel oder geteiltes Risiko.
        </p>
        <p>
          Wichtig: Gewinn ist im Islam nicht verboten. Handel ist erlaubt. Der Unterschied liegt darin,
          ob ein Ertrag aus echter Leistung und getragenem Risiko stammt oder allein aus einem Geldverleih.
        </p>
      </>
    ),
  },
  {
    titel: "Die zwei Grundformen",
    id: "formen",
    inhalt: (
      <>
        <p>
          In der klassischen Lehre werden zwei Grundformen unterschieden.
        </p>
        <p>
          <strong>Riba an-nasi'a</strong> ist der Aufschlag für Zeit. Ein Betrag wird verliehen oder
          gestundet, und für die Wartezeit kommt etwas obendrauf. Das ist der Zins, wie du ihn von
          Krediten, Dispo und Sparkonten kennst.
        </p>
        <p>
          <strong>Riba al-fadl</strong> ist der Aufschlag beim Tausch. Zwei gleichartige Güter werden
          in ungleicher Menge direkt gegeneinander getauscht, etwa Gold gegen Gold in unterschiedlichem
          Gewicht. Auch hier entsteht ein Vorteil ohne echte Gegenleistung.
        </p>
      </>
    ),
  },
  {
    titel: "Wo Riba im deutschen Alltag auftaucht",
    id: "alltag",
    inhalt: (
      <>
        <p>
          Riba begegnet dir häufiger, als du denkst. Typische Stellen sind:
        </p>
        <ul className="ml-5 list-disc space-y-2">
          <li>Zinsen auf dem Tagesgeld-, Spar- oder Verrechnungskonto.</li>
          <li>Der Dispo auf dem Girokonto, auch wenn du ihn nie nutzt.</li>
          <li>Ratenkäufe und Finanzierungen mit Aufschlag auf den Barpreis.</li>
          <li>Kreditkarten mit eingeräumtem Kreditrahmen.</li>
          <li>Wertpapierkredite und Hebelprodukte beim Broker.</li>
          <li>Anleihen und Fonds, die Zinserträge weitergeben.</li>
        </ul>
        <p>
          Deshalb lohnt es sich, bei Konto und Depot genau hinzusehen: Fallen Zinsen an, lassen sie
          sich abschalten, und wird dir automatisch ein Kredit eingeräumt?
        </p>
      </>
    ),
  },
  {
    titel: "Warum Riba im Islam verboten ist",
    id: "warum",
    inhalt: (
      <>
        <p>
          Das Verbot ist im Koran und in der Sunna verankert und wird von den klassischen Rechtsschulen
          geteilt. Die Begründungen, die in der Literatur genannt werden, lassen sich so zusammenfassen:
        </p>
        <ul className="ml-5 list-disc space-y-2">
          <li>Das Risiko wird einseitig verteilt. Der Geldgeber gewinnt in jedem Fall.</li>
          <li>Geld wird zur Ware, statt Handel und echte Leistung zu finanzieren.</li>
          <li>Schulden können anwachsen und Menschen dauerhaft in Not halten.</li>
        </ul>
        <p>
          Wie einzelne Fälle konkret zu bewerten sind, wird unter Gelehrten teils unterschiedlich
          beurteilt. Für deine persönliche Lage sprichst du das am besten mit einem Gelehrten deines
          Vertrauens durch.
        </p>
      </>
    ),
  },
  {
    titel: "Welche Alternativen es gibt",
    id: "alternativen",
    inhalt: (
      <>
        <p>
          Ohne Zinsen zu wirtschaften bedeutet nicht, auf Vermögensaufbau zu verzichten. Üblich sind
          diese Wege:
        </p>
        <ul className="ml-5 list-disc space-y-2">
          <li>Beteiligung statt Verleih: Aktien und sharia-konforme ETFs, bei denen du am Unternehmen beteiligt bist und das Risiko mitträgst.</li>
          <li>Handel mit klarem Kaufpreis statt Finanzierung mit Aufschlag für Zeit.</li>
          <li>Sachwerte wie physisches Gold, das direkt und vollständig bezahlt wird.</li>
          <li>Konten und Depots ohne Guthabenzins und ohne eingeräumten Kredit.</li>
          <li>Fallen dennoch Zinsen an, werden sie nach verbreiteter Auffassung nicht behalten, sondern gespendet, ohne Belohnung dafür zu erwarten.</li>
        </ul>
        <p>
          Der praktische Einstieg ist meist einfacher als gedacht: Konto und Depot prüfen, Zinsoptionen
          abschalten, Kreditrahmen kündigen und dann in beteiligungsbasierte Anlagen investieren.
        </p>
      </>
    ),
  },
];

const WasIstRiba = () => (
  <>
    <Seo
      title="Was ist Riba? Zins im Islam einfach erklärt | finanzmuslim"
      description="Riba einfach erklärt: Bedeutung, die zwei Grundformen, wo Zins im deutschen Alltag auftaucht, warum er verboten ist und welche Alternativen es gibt."
      path="/wissen/was-ist-riba"
    />
    <ArtikelSeite
      title="Was ist Riba"
      kuerze={[
        "Riba ist ein Zuwachs ohne echte Gegenleistung und ohne getragenes Risiko.",
        "Unterschieden werden Riba an-nasi'a (Aufschlag für Zeit) und Riba al-fadl (Aufschlag beim Tausch).",
        "Im Alltag steckt Riba in Zinskonten, Dispo, Ratenkauf, Kreditkarten und Wertpapierkrediten.",
        "Handel und Gewinn sind erlaubt, der Zins auf reinen Geldverleih ist es nicht.",
        "Alternativen sind Beteiligung, Handel und Sachwerte statt verzinstem Verleih.",
      ]}
      abschnitte={abschnitte}
      passendDazu={[
        { name: "Zakat-Rechner", desc: "Deine Zakat auf Bargeld, Depot und Gold berechnen.", to: "/zakat-rechner" },
        { name: "Renditerechner", desc: "Sehen, wie Vermögen ohne Zins über die Jahre wachsen kann.", to: "/renditerechner" },
        { name: "Depot-Vergleich", desc: "Broker nach Zinsen, Kredit und Hebelprodukten geprüft.", to: "/vergleich/depot" },
      ]}
      hinweis="Dieser Beitrag ist keine Rechts- oder Anlageberatung."
    />
  </>
);

export default WasIstRiba;
