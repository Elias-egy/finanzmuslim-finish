import Seo from "@/components/Seo";
import BeitragSeite, { type BeitragAbschnitt } from "@/components/BeitragSeite";
import { IlluPruefung, IlluVersicherung } from "@/components/illu";
import { Link } from "react-router-dom";

const Bild = ({ children, text }: { children: React.ReactNode; text: string }) => (
  <figure className="my-6">
    <div className="overflow-hidden rounded-2xl">{children}</div>
    <figcaption className="mt-2 text-[14px] text-muted-foreground">{text}</figcaption>
  </figure>
);

/** Eine der drei Prüffragen an einen Vertrag. */
const Pruefung = ({
  nummer,
  frage,
  text,
}: {
  nummer: number;
  frage: string;
  text: string;
}) => (
  <div className="card-surface p-5">
    <p className="text-[17px] font-bold text-foreground">
      {nummer}. {frage}
    </p>
    <p className="mt-2 text-[16px] text-muted-foreground">{text}</p>
  </div>
);

const abschnitte: BeitragAbschnitt[] = [
  {
    id: "was-ist-gharar",
    titel: "Gharar ist Unklarheit, nicht Risiko",
    inhalt: (
      <>
        <p>
          Neben Riba ist Gharar der zweite Begriff, an dem im islamischen Vertragsrecht fast alles
          hängt. Übersetzt heißt er ungefähr Täuschung oder Ungewissheit. Gemeint ist ein Vertrag,
          bei dem wesentliche Dinge offenbleiben.
        </p>
        <p className="rounded-xl bg-hero p-5 text-[19px] font-bold text-foreground">
          Verboten ist nicht das Risiko. Verboten ist, dass eine Seite nicht weiß, worauf sie sich
          einlässt.
        </p>
        <p>
          Das ist ein wichtiger Unterschied, und er wird oft verwechselt. Wer einen Laden aufmacht,
          trägt Risiko. Wer Aktien kauft, trägt Risiko. Beides ist ausdrücklich erlaubt, ohne
          Risiko gäbe es keinen erlaubten Gewinn. Gharar meint etwas anderes: Der Gegenstand, der
          Preis oder die Lieferung sind so unbestimmt, dass der Vertrag zum Glücksspiel wird.
        </p>
        <p>
          Deshalb greift der Begriff auch dort, wo niemand betrügen will. Es geht nicht um die
          Absicht, sondern darum, was im Vertrag steht.
        </p>
      </>
    ),
  },
  {
    id: "beispiele",
    titel: "Die klassischen Beispiele, kurz erklärt",
    inhalt: (
      <>
        <p>
          Die Überlieferung nennt Fälle, die auf den ersten Blick weit weg wirken. Ihr Muster ist
          bis heute dasselbe.
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Der Fisch im Wasser.</strong> Verkauft wird, was noch gefangen werden muss.
            Niemand weiß, ob und wie viel. Der Käufer zahlt für eine Möglichkeit.
          </li>
          <li>
            <strong>Das ungeborene Tier.</strong> Verkauft wird, was noch nicht da ist und
            vielleicht nie kommt.
          </li>
          <li>
            <strong>Der Steinwurf.</strong> Der Käufer wirft einen Stein über einen Warenhaufen und
            bekommt, worauf er landet. Der Gegenstand ist bis zum Schluss unbestimmt.
          </li>
        </ul>
        <p>
          Das Muster: Eine Seite zahlt sicher, die andere liefert unsicher. Der Gewinn hängt nicht
          an Arbeit oder Ware, sondern am Zufall. Genau das steckt auch in modernen Verträgen, nur
          besser formuliert.
        </p>
        <p>
          <strong>Kleines Gharar stört nicht.</strong> Wer eine Wassermelone kauft, weiß auch nicht,
          wie sie innen aussieht. Wer eine Wohnung mietet, weiß nicht, wie viel Wasser er verbraucht.
          Solche Reste sind unvermeidbar und werden hingenommen. Verboten ist Gharar erst, wenn er
          wesentlich ist.
        </p>
        <Bild text="Erlaubt ist Risiko, das aus einer Sache kommt. Verboten ist Unklarheit über die Sache selbst.">
          <IlluPruefung />
        </Bild>
      </>
    ),
  },
  {
    id: "im-alltag",
    titel: "Wo Gharar im deutschen Alltag auftaucht",
    inhalt: (
      <>
        <p>Drei Bereiche, in denen die Frage regelmäßig gestellt wird.</p>
        <p>
          <strong>Versicherungen.</strong> Der häufigste Fall. Du zahlst sicher, die Leistung kommt
          vielleicht nie. Wie das beurteilt wird und was Takaful daran ändert, steht in{" "}
          <Link to="/wissen/ist-versicherung-haram" className="text-primary hover:underline">
            Ist eine Versicherung haram?
          </Link>
        </p>
        <p>
          <strong>Optionen, Futures und CFDs.</strong> Hier wird über etwas gehandelt, das der
          Verkäufer nicht besitzt, zu einem Preis, der erst später feststeht. Nach verbreiteter
          Auffassung fällt das unter Gharar und häufig zusätzlich unter Maysir, also Glücksspiel.
          Deshalb ist es auch ein Kriterium bei der Wahl des Brokers.
        </p>
        <p>
          <strong>Unklare Vertragsklauseln.</strong> Ein Handyvertrag mit offenem Preis nach zwölf
          Monaten, eine Gebühr, die der Anbieter einseitig ändern darf, eine Kündigungsfrist, die
          niemand versteht. Das sind kleine Fälle, aber es ist dieselbe Frage.
        </p>
        <Bild text="Bei der Versicherung zahlst du sicher und bekommst vielleicht. Genau daran entzündet sich die Diskussion.">
          <IlluVersicherung />
        </Bild>
      </>
    ),
  },
  {
    id: "pruefen",
    titel: "Drei Fragen an jeden Vertrag",
    inhalt: (
      <>
        <p>
          Wer einen Vertrag auf Gharar prüfen will, braucht kein Fachwissen. Drei Fragen reichen für
          fast alles.
        </p>
        <div className="my-6 space-y-4">
          <Pruefung
            nummer={1}
            frage="Was genau bekomme ich?"
            text="Ist die Sache oder Leistung bestimmt, oder steht dort eine Möglichkeit? Ein Gegenstand, den niemand beschreiben kann, ist das erste Warnzeichen."
          />
          <Pruefung
            nummer={2}
            frage="Was genau zahle ich?"
            text="Steht der Gesamtpreis fest, oder kann er sich später ändern? Ein Preis, den eine Seite einseitig bestimmt, ist kein vereinbarter Preis."
          />
          <Pruefung
            nummer={3}
            frage="Wann und wie sicher wird geliefert?"
            text="Gibt es einen Termin, oder hängt alles an einem Ereignis, das eintreten kann oder nicht? Existiert die Sache überhaupt schon?"
          />
        </div>
        <p>
          Bleibt eine der drei Antworten offen, heißt das nicht sofort verboten. Es heißt: nachlesen,
          nachfragen, und im Zweifel jemanden fragen, der sich auskennt.
        </p>
        <p>
          Die{" "}
          <Link to="/vorlagen/vertrags-ampel" className="text-primary hover:underline">
            Vertrags-Ampel
          </Link>{" "}
          hat zwölf Alltagsverträge nach genau diesen Fragen eingeordnet.
        </p>
      </>
    ),
  },
];

const faq = [
  {
    frage: "Was bedeutet Gharar?",
    antwort:
      "Übermäßige Unsicherheit oder Unklarheit in einem Vertrag. Gemeint ist, dass Gegenstand, Preis oder Lieferung so unbestimmt sind, dass eine Seite nicht weiß, worauf sie sich einlässt. Verboten ist nicht das wirtschaftliche Risiko, sondern die Unklarheit über die Sache selbst.",
  },
  {
    frage: "Ist jedes Risiko Gharar?",
    antwort:
      "Nein. Wer ein Geschäft aufbaut oder Anteile an einer Firma kauft, trägt Risiko, und genau daraus entsteht der erlaubte Gewinn. Gharar liegt erst vor, wenn der Vertrag selbst wesentliche Punkte offenlässt.",
  },
  {
    frage: "Sind Optionen und CFDs wegen Gharar verboten?",
    antwort:
      "Nach verbreiteter Auffassung ja. Gehandelt wird über etwas, das der Verkäufer nicht besitzt, zu einem Preis, der erst später feststeht. Häufig kommt Maysir hinzu, also der Glücksspielcharakter. Deshalb ist das Angebot an Hebelprodukten auch ein Kriterium bei der Brokerwahl.",
  },
  {
    frage: "Ist eine Versicherung wegen Gharar haram?",
    antwort:
      "Das ist der meistdiskutierte Fall. Kritisiert werden Gharar, Maysir und die verzinste Anlage der Beiträge. Pflichtversicherungen werden meist milder beurteilt, weil sie unvermeidbar sind. Die Einzelheiten stehen im Beitrag zur Versicherung.",
  },
  {
    frage: "Was ist der Unterschied zwischen Gharar und Maysir?",
    antwort:
      "Gharar ist Unklarheit im Vertrag. Maysir ist Glücksspiel, also ein Geschäft, bei dem der Gewinn der einen Seite der Verlust der anderen ist und beides vom Zufall abhängt. Beides kommt oft zusammen vor, ist aber nicht dasselbe.",
  },
];

const Gharar = () => (
  <>
    <Seo
      title="Gharar: Unsicherheit im Vertrag | finanzmuslim"
      description="Gharar meint übermäßige Unklarheit in einem Vertrag, nicht wirtschaftliches Risiko. Die klassischen Beispiele, wo der Begriff im deutschen Alltag greift und drei Fragen, mit denen du jeden Vertrag prüfst."
      path="/wissen/gharar"
    />
    <BeitragSeite
      titel="Gharar: Unsicherheit im Vertrag"
      kurzGesagt={[
        "Gharar meint übermäßige Unklarheit im Vertrag, nicht Risiko.",
        "Wirtschaftliches Risiko ist erlaubt, ohne es gäbe es keinen Gewinn.",
        "Kleine Unklarheiten sind unvermeidbar und werden hingenommen.",
        "Im Alltag: Versicherungen, Optionen und CFDs, offene Vertragsklauseln.",
        "Drei Fragen prüfen jeden Vertrag: Was bekomme ich, was zahle ich, wann kommt es.",
      ]}
      abschnitte={abschnitte}
      faq={faq}
      geprueftAm="16. August 2026"
      rechtshinweis="Dieser Beitrag gibt bekannte Positionen wieder und dient ausschließlich zu Bildungszwecken. Er ist keine Fatwa und ersetzt weder die Auskunft eines Gelehrten noch eine Rechtsberatung. Zur Reichweite von Gharar und zur Beurteilung einzelner Vertragsarten, besonders bei Versicherungen und Termingeschäften, bestehen zwischen den Rechtsschulen unterschiedliche Auffassungen."
      boxOben={{
        kategorie: "Vorlage",
        ueberschrift: "Zwölf Verträge, grün, gelb oder rot einsortiert",
        linkZiel: "/vorlagen/vertrags-ampel",
      }}
      boxMitte={{
        kategorie: "Depot",
        ueberschrift: "Ein Depot ohne Hebelprodukte und ohne Zinsgeschäft",
        linkZiel: "/vergleich/depot",
      }}
    >
      <section className="card-surface p-6">
        <h2 className="text-[19px] font-bold text-foreground">Passt dazu</h2>
        <ul className="mt-3 space-y-2 text-[16px]">
          <li>
            <Link to="/wissen/zinsen-im-islam" className="text-primary hover:underline">
              Zinsen im Islam
            </Link>{" "}
            behandelt den zweiten Grundbegriff, ohne den nichts zu verstehen ist.
          </li>
          <li>
            <Link to="/wissen/ist-versicherung-haram" className="text-primary hover:underline">
              Ist eine Versicherung haram?
            </Link>{" "}
            geht den meistdiskutierten Gharar-Fall im Einzelnen durch.
          </li>
          <li>
            <Link to="/vorlagen/vertrags-ampel" className="text-primary hover:underline">
              Die Vertrags-Ampel
            </Link>{" "}
            ordnet zwölf Alltagsverträge ein.
          </li>
        </ul>
      </section>
    </BeitragSeite>
  </>
);

export default Gharar;
