import Seo, { beitragJsonLd } from "@/components/Seo";
import BeitragSeite, { type BeitragAbschnitt, type BeitragFrage } from "@/components/BeitragSeite";
import { IlluGharar, IlluVersicherung } from "@/components/illu";
import {
  B,
  Begriff,
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
    id: "was-ist-gharar",
    titel: "Gharar ist Unklarheit, nicht Risiko",
    inhalt: (
      <>
        <p>
          Neben dem Zinsverbot ist das der zweite Begriff, an dem im islamischen Vertragsrecht fast alles
          hängt. Er wird oft mit Risiko verwechselt, und dann kommt die halbe Rechnung nicht mehr auf.
        </p>
        <Begriff wort="Unklarheit im Vertrag" arabisch="Gharar">
          Ein Vertrag, bei dem wesentliche Dinge offenbleiben: was genau geliefert wird, was genau gezahlt
          wird, oder ob überhaupt geliefert wird.
        </Begriff>
        <Merksatz>
          Verboten ist nicht das Risiko. Verboten ist, dass eine Seite nicht weiß, worauf sie sich einlässt.
        </Merksatz>
        <p>
          Wer einen Laden aufmacht, trägt Risiko. Wer Aktien kauft, trägt Risiko. Beides ist ausdrücklich
          erlaubt, ohne Risiko gäbe es keinen erlaubten Gewinn. Gharar meint etwas anderes: Der Gegenstand,
          der Preis oder die Lieferung sind so unbestimmt, dass der Vertrag zum Glücksspiel wird.
        </p>
        <p>
          Deshalb greift der Begriff auch dort, wo niemand betrügen will. Es geht nicht um die Absicht,
          sondern darum, was im Vertrag steht.
        </p>
        <Bild text="Links steht fest, was du bekommst und was du zahlst. Rechts steht ein Fragezeichen. Genau das ist gemeint.">
          <IlluGharar />
        </Bild>
      </>
    ),
  },
  {
    id: "beispiele",
    titel: "Die klassischen Beispiele, kurz erklärt",
    inhalt: (
      <>
        <p>
          Die Überlieferung nennt Fälle, die auf den ersten Blick weit weg wirken. Ihr Muster ist bis heute
          dasselbe.
        </p>
        <Checkliste
          punkte={[
            {
              art: "nein",
              text: (
                <>
                  <B>Der Fisch im Wasser.</B> Verkauft wird, was noch gefangen werden muss. Niemand weiß, ob
                  und wie viel. Der Käufer zahlt für eine Möglichkeit.
                </>
              ),
            },
            {
              art: "nein",
              text: (
                <>
                  <B>Das ungeborene Tier.</B> Verkauft wird, was noch nicht da ist und vielleicht nie kommt.
                </>
              ),
            },
            {
              art: "nein",
              text: (
                <>
                  <B>Der Steinwurf.</B> Der Käufer wirft einen Stein über einen Warenhaufen und bekommt,
                  worauf er landet. Der Gegenstand ist bis zum Schluss unbestimmt.
                </>
              ),
            },
          ]}
        />
        <p>
          Das Muster: Eine Seite zahlt sicher, die andere liefert unsicher. Der Gewinn hängt nicht an Arbeit
          oder Ware, sondern am Zufall. Genau das steckt auch in modernen Verträgen, nur besser formuliert.
        </p>
        <Hinweis titel="Kleines Gharar stört nicht">
          <p>
            Wer eine Wassermelone kauft, weiß auch nicht, wie sie innen aussieht. Wer eine Wohnung mietet,
            weiß nicht, wie viel Wasser er verbrauchen wird. Solche Reste sind unvermeidbar und werden
            hingenommen. Zum Problem wird Gharar erst, wenn er wesentlich ist, also wenn er den Kern des
            Geschäfts betrifft.
          </p>
        </Hinweis>
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
          <B>Versicherungen.</B> Der häufigste Fall. Du zahlst sicher, die Leistung kommt vielleicht nie. Wie
          das beurteilt wird und was es an Alternativen gibt, steht in{" "}
          <L to="/wissen/ist-versicherung-haram">Ist eine Versicherung haram?</L>
        </p>
        <p>
          <B>Optionen, Futures und CFDs.</B> Hier wird über etwas gehandelt, das der Verkäufer nicht besitzt,
          zu einem Preis, der erst später feststeht. Nach verbreiteter Auffassung fällt das unter Gharar und
          häufig zusätzlich unter Glücksspiel. Deshalb ist es auch ein Kriterium bei der Wahl des Brokers.
        </p>
        <p>
          <B>Unklare Vertragsklauseln.</B> Ein Handyvertrag mit offenem Preis nach zwölf Monaten, eine Gebühr,
          die der Anbieter einseitig ändern darf, eine Kündigungsfrist, die niemand versteht. Das sind kleine
          Fälle, aber es ist dieselbe Frage.
        </p>
        <Bild text="Bei der Versicherung zahlst du sicher und bekommst vielleicht. Genau daran entzündet sich die Diskussion.">
          <IlluVersicherung />
        </Bild>
      </>
    ),
  },
  {
    id: "pruefen",
    titel: "Vier Fragen an jeden Vertrag",
    inhalt: (
      <>
        <p>
          Wer einen Vertrag auf Gharar prüfen will, braucht kein Fachwissen. Vier Fragen reichen für fast
          alles, und die vierte ist die schärfste.
        </p>
        <Schritte
          schritte={[
            {
              titel: "Was genau bekomme ich?",
              text: "Ist die Sache oder Leistung bestimmt, oder steht dort eine Möglichkeit? Ein Gegenstand, den niemand beschreiben kann, ist das erste Warnzeichen.",
            },
            {
              titel: "Was genau zahle ich?",
              text: "Steht der Gesamtpreis fest, oder kann er sich später ändern? Ein Preis, den eine Seite einseitig bestimmt, ist kein vereinbarter Preis.",
            },
            {
              titel: "Wann und wie sicher wird geliefert?",
              text: "Gibt es einen Termin, oder hängt alles an einem Ereignis, das eintreten kann oder nicht? Existiert die Sache überhaupt schon?",
            },
            {
              titel: "Würde eine Seite den Vertrag noch abschließen, wenn sie den Ausgang kennen würde?",
              text: "Das ist der schärfste Test. Wenn du beim Sofakauf vorher wüsstest, wie es aussieht, würdest du es trotzdem kaufen. Wenn du beim Lottoschein vorher wüsstest, dass die Zahlen nicht kommen, würdest du ihn nicht kaufen. Wo die Antwort Nein lautet, hängt das ganze Geschäft am Zufall.",
            },
          ]}
        />
        <p>
          Bleibt eine der vier Antworten offen, heißt das nicht sofort verboten. Es heißt: nachlesen,
          nachfragen, und im Zweifel jemanden fragen, der sich auskennt. Die{" "}
          <L to="/vorlagen/vertrags-ampel">Vertrags-Ampel</L> hat zwölf Alltagsverträge nach genau diesen
          Fragen eingeordnet.
        </p>
      </>
    ),
  },
  {
    id: "ausnahmen",
    titel: "Warum die Versicherung milder beurteilt wird als der Kredit",
    inhalt: (
      <>
        <Frage>Wenn beides verboten ist, warum reden Gelehrte bei der Versicherung dann von Ausnahmen und beim Kredit fast nie?</Frage>
        <p>
          Weil die Hürde für eine Ausnahme nicht überall gleich hoch ist. Das ist einer der nützlichsten
          Punkte in diesem ganzen Themenfeld, und er wird selten erklärt.
        </p>
        <Gegenueber
          links={{
            titel: "Bei Unklarheit im Vertrag",
            ton: "gelb",
            punkte: [
              "Es genügt eine Dringlichkeit.",
              "Also: Ohne wäre es eine erhebliche Härte, du kämst nur mit großer Mühe zurecht.",
              "Deshalb wird über Versicherungen im Einzelfall überhaupt diskutiert.",
            ],
          }}
          rechts={{
            titel: "Bei Zins",
            ton: "rot",
            punkte: [
              "Es braucht eine Notwendigkeit.",
              "Also: Es geht wirklich nicht anders, Leben, Gesundheit oder Obdach stehen auf dem Spiel.",
              "Deshalb ist beim Zinskredit fast nie Raum für eine Ausnahme.",
            ],
          }}
        />
        <p>
          Verwechsle das nicht mit einem Freibrief. Auch die Dringlichkeit muss vorliegen, und ob sie das tut,
          beurteilt ein Gelehrter, der deine Lage kennt, und nicht du selbst am Küchentisch.
        </p>
      </>
    ),
  },
];

const faq: BeitragFrage[] = [
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
    frage: "Wie prüfe ich schnell, ob ein Vertrag zu unklar ist?",
    antwort:
      "Vier Fragen: Was bekomme ich genau, was zahle ich genau, wann und wie sicher kommt es, und würde eine Seite den Vertrag noch abschließen, wenn sie den Ausgang vorher kennen würde? Lautet die letzte Antwort Nein, hängt das Geschäft am Zufall.",
  },
  {
    frage: "Sind Optionen und CFDs wegen Gharar verboten?",
    antwort:
      "Nach verbreiteter Auffassung ja. Gehandelt wird über etwas, das der Verkäufer nicht besitzt, zu einem Preis, der erst später feststeht. Häufig kommt der Glücksspielcharakter hinzu. Deshalb ist das Angebot an Hebelprodukten auch ein Kriterium bei der Brokerwahl.",
  },
  {
    frage: "Ist eine Versicherung wegen Gharar haram?",
    antwort:
      "Das ist der meistdiskutierte Fall. Kritisiert werden die Unklarheit, der Glücksspielcharakter und die verzinste Anlage der Beiträge. Pflichtversicherungen werden milder beurteilt, weil sie unvermeidbar sind. Die Einzelheiten stehen im Beitrag zur Versicherung.",
  },
  {
    frage: "Warum wird die Versicherung milder beurteilt als der Kredit?",
    antwort:
      "Weil die Hürde für eine Ausnahme unterschiedlich hoch ist. Ein Vertrag, der wegen Unklarheit beanstandet wird, kann bei einer Dringlichkeit zulässig werden. Ein Zinsvertrag erst bei einer echten Notwendigkeit, also wenn es wirklich nicht anders geht.",
  },
  {
    frage: "Was ist der Unterschied zwischen Gharar und Maysir?",
    antwort:
      "Gharar ist Unklarheit im Vertrag. Maysir ist Glücksspiel, also ein Geschäft, bei dem der Gewinn der einen Seite der Verlust der anderen ist und beides vom Zufall abhängt. Glücksspiel gilt als die schärfste Form der Unklarheit, deshalb kommt beides oft zusammen vor.",
  },
];

const beschreibung =
  "Gharar meint übermäßige Unklarheit in einem Vertrag, nicht wirtschaftliches Risiko. Die klassischen Beispiele, wo der Begriff im deutschen Alltag greift, vier Fragen zum Prüfen und warum die Versicherung milder beurteilt wird als der Kredit.";

const Gharar = () => (
  <>
    <Seo
      title="Gharar: Unsicherheit im Vertrag | finanzmuslim"
      description={beschreibung}
      path="/wissen/gharar"
      jsonLd={beitragJsonLd({
        titel: "Gharar: Unsicherheit im Vertrag",
        beschreibung,
        path: "/wissen/gharar",
        datePublished: "16. August 2026",
        dateModified: "5. September 2026",
        faq,
      })}
    />
    <BeitragSeite
      slug="gharar"
      titel="Gharar: Unsicherheit im Vertrag"
      untertitel="Der zweite Grundbegriff. Vier Fragen, mit denen du jeden Vertrag selbst prüfen kannst."
      kurzGesagt={[
        "Gharar meint übermäßige Unklarheit im Vertrag, nicht Risiko.",
        "Wirtschaftliches Risiko ist erlaubt, ohne es gäbe es keinen Gewinn.",
        "Kleine Unklarheiten sind unvermeidbar und werden hingenommen.",
        "Im Alltag: Versicherungen, Optionen und CFDs, offene Vertragsklauseln.",
        "Vier Fragen prüfen jeden Vertrag. Die schärfste: Würdest du ihn noch schließen, wenn du den Ausgang kenntest?",
        "Für eine Ausnahme reicht hier eine Dringlichkeit. Beim Zins braucht es eine echte Notwendigkeit.",
      ]}
      abschnitte={abschnitte}
      faq={faq}
      datePublished="16. August 2026"
      dateModified="5. September 2026"
      boxMitteNach={2}
      rechtshinweis="Dieser Beitrag gibt bekannte Positionen wieder und dient ausschließlich zu Bildungszwecken. Er ist keine Fatwa und ersetzt weder die Auskunft eines Gelehrten noch eine Rechtsberatung. Zur Reichweite von Gharar, zur Beurteilung einzelner Vertragsarten und dazu, wann eine Dringlichkeit vorliegt, bestehen zwischen den Rechtsschulen unterschiedliche Auffassungen."
      boxOben={{
        kategorie: "Vorlage",
        ueberschrift: "Zwölf Verträge, grün, gelb oder rot einsortiert",
        linkZiel: "/vorlagen/vertrags-ampel",
        text: "Grün, gelb oder rot für zwölf Verträge aus dem Alltag.",
        knopf: "Zur Vertrags-Ampel",
      }}
      boxMitte={{
        kategorie: "Depot",
        ueberschrift: "Ein Depot ohne Hebelprodukte und ohne Zinsgeschäft",
        linkZiel: "/vergleich/depot",
      }}
    >
      <PasstDazu
        punkte={[
          { to: "/wissen/zinsen-im-islam", name: "Zinsen im Islam", text: "behandelt den ersten Grundbegriff, ohne den nichts zu verstehen ist." },
          { to: "/wissen/maysir", name: "Glücksspiel (Maysir)", text: "die schärfste Form der Unklarheit, mit eigenen Regeln." },
          { to: "/wissen/ist-versicherung-haram", name: "Ist eine Versicherung haram?", text: "geht den meistdiskutierten Fall im Einzelnen durch." },
          { to: "/vorlagen/vertrags-ampel", name: "Die Vertrags-Ampel", text: "ordnet zwölf Alltagsverträge ein." },
        ]}
      />
    </BeitragSeite>
  </>
);

export default Gharar;
