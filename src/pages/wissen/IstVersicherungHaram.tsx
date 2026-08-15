import { Link } from "react-router-dom";
import Seo from "@/components/Seo";
import BeitragSeite, { type BeitragAbschnitt, type BeitragFrage } from "@/components/BeitragSeite";

const abschnitte: BeitragAbschnitt[] = [
  {
    id: "kurze-antwort",
    titel: "Die kurze Antwort zuerst",
    inhalt: (
      <>
        <p>
          Die Mehrheit der zeitgenössischen Fiqh-Gremien, also der Gelehrtenräte, die heutige Finanzfragen
          prüfen, stuft die klassische Versicherung als problematisch ein.
        </p>
        <p>
          Der Grund ist nicht die Vorsorge selbst. Vorsorge ist im Islam ausdrücklich erwünscht. Du darfst
          und sollst dich absichern. Das Problem liegt in der Bauweise des Vertrags.
        </p>
      </>
    ),
  },
  {
    id: "warum-problem",
    titel: "Warum eine Versicherung überhaupt ein Problem ist",
    inhalt: (
      <>
        <p>
          Erstens Gharar, also übermäßige Unsicherheit in einem Vertrag. Du zahlst sicher jeden Monat, bekommst
          aber vielleicht nie etwas zurück. Beim Abschluss weiß niemand, wer am Ende wie viel gibt und wer wie
          viel bekommt. Genau diese offene Rechnung gilt als problematisch.
        </p>
        <p>
          Zweitens Riba, also Zinsen. Versicherer legen die Beiträge ihrer Kunden verzinst an. Der Zins steckt
          damit im Produkt, auch wenn du ihn im Vertrag nicht siehst.
        </p>
      </>
    ),
  },
  {
    id: "ausnahmen",
    titel: "Wann eine Versicherung trotzdem erlaubt sein kann",
    inhalt: (
      <>
        <p>
          Es gibt anerkannte Ausnahmen. Die erste ist die gesetzliche Pflicht. Ein Beispiel ist die
          Kfz-Haftpflicht. Ohne sie darfst du in Deutschland kein Auto fahren.
        </p>
        <p>
          Die zweite ist die berufliche Pflicht. Ein Beispiel ist eine Berufshaftpflicht, ohne die du deinen
          Beruf gar nicht ausüben darfst.
        </p>
        <p>
          Die dritte ist echte Not. Gemeint ist ein Schaden, der dich oder deine Familie finanziell ruinieren
          würde.
        </p>
        <p>
          Wichtig: Die Ausnahme ist an die Notwendigkeit gebunden, nicht an die Bequemlichkeit.
        </p>
      </>
    ),
  },
  {
    id: "einordnung",
    titel: "Welche Versicherungen wie einzuordnen sind",
    inhalt: (
      <ul className="space-y-3">
        <li>
          <span className="font-semibold text-foreground">Kfz-Haftpflicht:</span> gesetzliche Pflicht, fällt
          unter die Ausnahme.
        </li>
        <li>
          <span className="font-semibold text-foreground">Private Haftpflicht:</span> freiwillig, aber viele
          Gelehrte sehen bei existenzbedrohenden Schäden eine Not.
        </li>
        <li>
          <span className="font-semibold text-foreground">Hausrat:</span> freiwillig, meist keine Not.
        </li>
        <li>
          <span className="font-semibold text-foreground">Klassische Lebens- und Rentenversicherung mit
          Garantiezins:</span> der Zins steckt direkt im Vertrag, das ist der klarste Fall.
        </li>
        <li>
          <span className="font-semibold text-foreground">Krankenversicherung:</span> in Deutschland Pflicht.
        </li>
      </ul>
    ),
  },
  {
    id: "takaful",
    titel: "Takaful, die islamische Alternative",
    inhalt: (
      <>
        <p>
          Takaful funktioniert wie eine Gemeinschaft. Alle zahlen in einen gemeinsamen Topf ein, und aus diesem
          Topf werden Schäden der Mitglieder bezahlt. Dahinter steht kein Zinsgeschäft.
        </p>
        <p>
          Die ehrliche Einordnung: In Deutschland gibt es Takaful praktisch nicht. Für dich ist es derzeit also
          keine echte Option.
        </p>
      </>
    ),
  },
  {
    id: "was-tun",
    titel: "Was du konkret tun kannst",
    inhalt: (
      <ol className="space-y-3">
        <li>1. Prüfe, ob die Versicherung wirklich Pflicht ist oder nur bequem.</li>
        <li>
          2. Überlege bei freiwilligen Verträgen, ob eine eigene Rücklage denselben Zweck erfüllt.
        </li>
        <li>
          3. Frag bei allem, was unklar bleibt, einen Gelehrten und lege ihm deinen konkreten Vertrag vor.
        </li>
      </ol>
    ),
  },
];

const faq: BeitragFrage[] = [
  {
    frage: "Ist die Kfz-Versicherung haram?",
    antwort:
      "Die Kfz-Haftpflicht ist in Deutschland gesetzlich vorgeschrieben und fällt damit unter die anerkannte Ausnahme der Pflicht. Bei der freiwilligen Vollkasko sehen viele Gelehrte das anders, weil sie nicht vorgeschrieben ist.",
  },
  {
    frage: "Ist eine Lebensversicherung haram?",
    antwort:
      "Die klassische Variante mit Garantiezins gilt als der klarste Fall, weil der Zins direkt im Vertrag steht. Wer für das Alter vorsorgen will, kann dieselbe Funktion über ein Depot mit Auszahlplan abbilden, ohne Zinsvertrag.",
  },
  {
    frage: "Was ist mit der Krankenversicherung?",
    antwort:
      "In Deutschland besteht Versicherungspflicht. Damit greift dieselbe Ausnahme wie bei der Kfz-Haftpflicht.",
  },
];

const IstVersicherungHaram = () => (
  <>
    <Seo
      title="Ist eine Versicherung haram? Die Antwort für Muslime in Deutschland | finanzmuslim"
      description="Wann eine Versicherung im Islam problematisch ist, wann sie erlaubt sein kann und welche Ausnahmen anerkannt sind. Verständlich erklärt, ohne Fachchinesisch."
      path="/wissen/ist-versicherung-haram"
    />
    <BeitragSeite
      titel="Ist eine Versicherung haram?"
      kurzGesagt={[
        "Eine Versicherung, die du freiwillig abschließt, gilt bei den meisten Gelehrten als problematisch.",
        "Der Grund sind zwei Dinge: große Unsicherheit im Vertrag und die verzinste Geldanlage dahinter.",
        "Anerkannte Ausnahmen sind gesetzliche Pflicht und echte Not.",
        "Kfz-Haftpflicht ist in Deutschland Pflicht und fällt damit unter die Ausnahme.",
        "Das hier ist keine Fatwa. Bei deinem konkreten Vertrag frag einen Gelehrten.",
      ]}
      abschnitte={abschnitte}
      faq={faq}
      geprueftAm="15. August 2026"
      rechtshinweis="Dieser Beitrag gibt bekannte Positionen wieder und dient ausschließlich zu Bildungszwecken. Er ist keine Fatwa und ersetzt weder die Auskunft eines Gelehrten noch eine Rechts-, Steuer- oder Versicherungsberatung. Innerhalb der Rechtsschulen gibt es zu einzelnen Punkten abweichende Auffassungen."
      boxOben={{ kategorie: "Depot", variante: "vergleich", linkZiel: "/vergleich/depot", ueberschrift: "Vorsorge ohne Zinsvertrag" }}
      boxMitte={{ kategorie: "Girokonto", variante: "vergleich", linkZiel: "/vergleiche" }}
    >
      <section className="card-surface p-6">
        <h2 className="text-xl font-bold text-foreground">Grün, gelb, rot: die Vertrags-Ampel</h2>
        <p className="mt-2 text-[16px] leading-relaxed text-muted-foreground">
          In der Vertrags-Ampel sind elf weitere Verträge aus dem Alltag eingeordnet.
        </p>
        <Link to="/vorlagen/vertrags-ampel" className="btn-primary mt-5">
          Zur Vertrags-Ampel
        </Link>
      </section>
    </BeitragSeite>
  </>
);

export default IstVersicherungHaram;
