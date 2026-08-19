import { Link } from "react-router-dom";
import Seo, { beitragJsonLd } from "@/components/Seo";
import BeitragIllu from "@/components/BeitragIllu";
import { IlluVersicherung, IlluZins } from "@/components/illu";
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
        <BeitragIllu unterschrift="Riba heißt: aus Geld wird mehr Geld, allein weil Zeit vergeht.">
          <IlluZins />
        </BeitragIllu>
      </>
    ),
  },
  {
    id: "vorsorge-versicherung",
    titel: "Der Unterschied zwischen Vorsorge und Versicherung",
    inhalt: (
      <>
        <p>
          Vorsorge ist im Islam ausdrücklich erwünscht. Der Prophet hat gesagt, man solle sein Kamel anbinden
          und dann auf Gott vertrauen. Rücklagen bilden, sich absichern, an morgen denken, all das ist
          erwünscht.
        </p>
        <p>
          Das Problem ist nicht die Absicht, sondern die <span className="font-semibold text-foreground">Bauweise
          des Vertrags</span>. Wer Geld für den Notfall zurücklegt, tut genau dasselbe wie ein Versicherter, nur
          ohne den Vertrag, an dem die Bedenken hängen. Deshalb ist eine Rücklage für viele Gelehrte der saubere
          Weg, wo immer sie ausreicht.
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
    id: "schon-versichert",
    titel: "Was passiert, wenn ich schon eine Versicherung habe?",
    inhalt: (
      <>
        <p>
          Wer einen Vertrag bereits laufen hat, muss <span className="font-semibold text-foreground">nicht in
          Panik verfallen</span>. Die verbreitete Empfehlung lautet, den Vertrag zu prüfen, bei freiwilligen
          Verträgen das Ende zu planen und bei Pflichtverträgen nichts zu überstürzen.
        </p>
        <p>
          Zu einem ausgezahlten Betrag aus einer Versicherung gibt es unterschiedliche Auffassungen. Manche
          Gelehrte sagen, man darf nur die eingezahlten Beiträge behalten und muss den Überschuss spenden. Das
          ist genau der Fall, in dem du jemanden fragen solltest, statt selbst zu entscheiden.
        </p>
      </>
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
        <BeitragIllu unterschrift="Beim Takaful zahlen viele in einen gemeinsamen Topf. Wer einen Schaden hat, bekommt daraus ersetzt.">
          <IlluVersicherung />
        </BeitragIllu>
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
      description="Erfahre, wann eine Versicherung im Islam problematisch ist und wann sie erlaubt sein kann. Mit den Ausnahmen, die anerkannt sind."
      path="/wissen/ist-versicherung-haram"
      jsonLd={beitragJsonLd({
        titel: "Ist eine Versicherung haram?",
        beschreibung: "Erfahre, wann eine Versicherung im Islam problematisch ist und wann sie erlaubt sein kann. Mit den Ausnahmen, die anerkannt sind.",
        path: "/wissen/ist-versicherung-haram",
        datePublished: "15. August 2026",
        faq,
      })}
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
      datePublished="15. August 2026"
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
        <p className="mt-6 text-[15px] leading-relaxed text-muted-foreground">
          Passend dazu:{" "}
          <Link to="/vorlagen/vertrags-ampel" className="text-primary hover:underline">
            die Vertrags-Ampel
          </Link>
          ,{" "}
          <Link to="/vergleich/depot" className="text-primary hover:underline">
            der Depot-Vergleich
          </Link>{" "}
          und{" "}
          <Link to="/wissen/sind-aktien-halal" className="text-primary hover:underline">
            sind Aktien halal?
          </Link>
        </p>
        <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
          Beim Hauskauf stellt sich dieselbe Frage in größerem Maßstab.{" "}
          <Link to="/wissen/haus-kaufen-ohne-zinsen" className="text-primary hover:underline">
            Haus kaufen ohne Zinsen
          </Link>
        </p>
      </section>
    </BeitragSeite>
  </>
);

export default IstVersicherungHaram;
