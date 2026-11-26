import Seo, { beitragJsonLd } from "@/components/Seo";
import { Link } from "react-router-dom";
import { AnbieterKasten, Video, videoClips, WerkzeugKasten, SITE } from "@/components/blog/bausteine";
import { KAPITEL_LEASING, VIDEO_LEASING } from "@/data/blogVideos";
import { etfListe, etfsBei } from "@/data/halalEtfListe";
import { PLATZ1 } from "@/lib/polster";
import BeitragSeite, { type BeitragAbschnitt, type BeitragFrage } from "@/components/BeitragSeite";
import { IlluMurabaha, IlluRaten } from "@/components/illu";
import {
  B,
  Begriff,
  Beispiel,
  Bild,
  Checkliste,
  Faelle,
  Frage,
  Gegenueber,
  Hinweis,
  L,
  Merksatz,
  PasstDazu,
  Schritte,
  Tabelle,
} from "@/components/beitrag";

/** Kurze Antwort gleich am Anfang (SEO91): das Wort „auto finanzieren ohne zinsen“ als H2, Antwort aus den Abschnitten darunter (Gelehrte, Ep. 21 im Vault ~/hourani/positionen/autofinanzierung.md). */
const abschnitte: BeitragAbschnitt[] = [
  {
    id: "ohne-zinsen",
    titel: "Auto finanzieren ohne Zinsen: geht das?",
    inhalt: (
      <>
        <p>
          <B>Nicht über eine Bank.</B> Eine Autofinanzierung ist ein Darlehen: Die Bank gibt Geld und will mehr zurück. Das gilt für die eigene Bank
          genauso wie für die Autobank des Herstellers. Auch ein Prospekt mit „0 %“ ändert daran nichts, solange eine Bank dahintersteht, denn dann
          steckt der Zins im Preis.
        </p>
        <p>
          Ohne Zinsen kommst du auf drei Wegen an ein Auto: bar bezahlen, in Raten direkt beim Händler ohne Bank oder über Murabaha, wenn der Anbieter
          das Auto wirklich besitzt. Alle drei stehen unten Schritt für Schritt.
        </p>
      </>
    ),
  },
  {
    id: "vier-wege",
    titel: "Die vier Wege, ein Auto zu bezahlen",
    inhalt: (
      <>
        <Frage>Beim Händler liegen drei Angebote auf dem Tisch. Welches davon ist überhaupt eine Frage?</Frage>
        <p>
          Fast jedes Auto in Deutschland wird auf einem von vier Wegen bezahlt. Drei davon führen über
          eine Bank, einer nicht. Diese Unterscheidung ist wichtiger als jeder Zinssatz im Prospekt.
        </p>
        <Tabelle
          kopf={["Weg", "Wer gibt dir das Geld", "Worum es islamisch geht"]}
          zeilen={[
            ["Barkauf", "niemand, du zahlst selbst", "unstrittig erlaubt"],
            ["Deine eigene Bank", "eine fremde Bank per Kredit", "Zins, damit Riba"],
            ["Die Bank des Herstellers", "die Autobank des Konzerns", "gleiche Struktur, gleiches Ergebnis"],
            ["Ratenkauf beim Händler", "der Händler selbst", "erlaubt, wenn drei Bedingungen stimmen"],
          ]}
        />
        <Merksatz>
          Die erste Frage ist nie „wie hoch ist der Zins“, sondern „wer gibt mir hier eigentlich Geld“.
        </Merksatz>
        <p>
          Wenn dir jemand <B>Geld</B> gibt, damit du das Auto bezahlen kannst, und mehr Geld zurückhaben
          will, ist das ein verzinstes Darlehen. Wenn dir jemand das <B>Auto</B> gibt und dafür in Raten
          bezahlt werden will, ist das ein Kaufvertrag. Der Unterschied sieht auf dem Kontoauszug fast
          gleich aus und ist islamisch der ganze Unterschied.
        </p>
      </>
    ),
  },
  {
    id: "bank",
    titel: "Warum die Bankfinanzierung nicht geht",
    inhalt: (
      <>
        <p>
          Die klassische Autofinanzierung ist ein Darlehen. Die Bank überweist dem Händler den Kaufpreis,
          du zahlst der Bank über Jahre mehr zurück, als sie überwiesen hat. Genau diese Struktur meinen
          Gelehrte, wenn sie von Riba sprechen: Geld gegen mehr Geld, und die Zeit ist der Grund für den
          Aufschlag.
        </p>
        <Frage>Macht es einen Unterschied, ob es die eigene Bank ist oder die Bank des Herstellers?</Frage>
        <p>
          Für dich als Käufer nicht. Bei einer <B>fremden Bank</B> ist der Fall eindeutig: Sie gibt Geld
          und bekommt mehr zurück. Bei der <B>hauseigenen Autobank</B> eines Konzerns gibt es unter
          Gelehrten eine Debatte darüber, ob eine Tochtergesellschaft überhaupt eine eigenständige Person
          ist oder nur der Geldbeutel des Konzerns. Wäre sie nur der Geldbeutel, wäre es kein Geschäft
          zwischen zwei Personen und damit auch keine Riba im engeren Sinn.
        </p>
        <p>
          Beide Auffassungen kommen beim Endverbraucher trotzdem am selben Punkt heraus. Der Vertrag, den
          du unterschreibst, enthält in beiden Fällen einen Zinssatz, Verzugszinsen und einen
          Eigentumsvorbehalt. Er bleibt deshalb auch dann nicht in Ordnung, wenn die Riba-Frage im
          Konzerninneren offen bleibt.
        </p>
        <Hinweis titel="Warum diese Debatte hier trotzdem steht">
          <p>
            Weil sie dir im Autohaus begegnen wird. Manche Verkäufer erklären, die Hausbank sei „nur der
            Hersteller selbst" und deshalb unproblematisch. Das ist keine Erfindung, es ist eine verkürzte
            Wiedergabe einer echten Gelehrtendebatte. Nur ändert sie nichts an dem Papier, das du
            unterschreibst.
          </p>
        </Hinweis>
      </>
    ),
  },
  {
    id: "null-prozent",
    titel: "Null Prozent ist kein Ausweg",
    inhalt: (
      <>
        <Frage>
          Im Schaufenster steht „0 % Finanzierung“. Kein Zins, also kein Problem, oder?
        </Frage>
        <p>
          Das ist eine verbreitete Masche, über die auch Hourani spricht (ilmCast Ep. 21, 00:32:18). Bei einer Null-Prozent-Aktion rechnet der Händler
          aus, was die Bank an Zinsen verdient hätte, und schlägt diesen Betrag auf den Kaufpreis. Danach
          steht im Vertrag null Prozent, und der Aufschlag steckt im Preis.
        </p>
        <Beispiel
          titel="Was hinter einer Null-Prozent-Aktion steckt"
          rechnung={["Auto 10.000 €", "Zinsen, die die Bank bekommen hätte: 2.000 €", "Kaufpreis in der Aktion: 12.000 €, Zinssatz 0 %"]}
          ergebnis="Der Aufschlag ist derselbe. Nur der Name auf dem Formular hat sich geändert."
        >
          <p>
            Das Beispiel folgt einem Beispiel von Hourani. Entscheidend ist die
            Struktur: Es fließt weiterhin Geld von der Bank zum Händler, und du zahlst der Bank mehr
            zurück, als sie gegeben hat.
          </p>
        </Beispiel>
        <p>
          Gelehrte sagen dazu deutlich: Ob der Aufschlag als jährlicher Prozentsatz gerechnet wird oder
          als einmalige Summe im Preis versteckt, macht keinen Unterschied. Das Problem ist nicht die
          Rechenweise, sondern dass eine Bank Geld gibt und mehr Geld zurückbekommt.
        </p>
        <Merksatz>
          Null Prozent löst nichts, solange eine Bank zwischen dir und dem Auto steht.
        </Merksatz>
        <p>
          Der Preisaufschlag selbst ist übrigens nicht das Problem. Er ist es nur, weil eine Bank
          dahintersteht. Genau derselbe Aufschlag ist erlaubt, wenn der Händler ihn nimmt. Warum, steht im
          Abschnitt zum Ratenkauf und ausführlich in{" "}
          <L to="/blog/ratenzahlung-haram">Ratenkauf</L>.
        </p>
      </>
    ),
  },
  {
    id: "leasing-video",
    titel: "Leasing statt Kredit: das sagt Elias im Video",
    inhalt: (
      <>
        <p>
          Leasing ist kein Kredit, sondern Miete, und wird deshalb anders beurteilt. Der Knackpunkt ist, wer bei einem Schaden haftet. Der halal Weg ist
          meist ein Auto-Abo.
        </p>
        <Video
          id={VIDEO_LEASING.id}
          titel={VIDEO_LEASING.titel}
          bild={VIDEO_LEASING.bild}
          kapitel={KAPITEL_LEASING}
        />
        <p>
          Wie du einen Vertrag Punkt für Punkt prüfst und was das Auto-Abo kostet, steht unter{" "}
          <L to="/blog/ist-leasing-haram">Leasing ohne Zinsen: geht das halal?</L>
        </p>
        <WerkzeugKasten
          etikett="Rechner"
          titel="Leasingrate oder Depot: Was wäre aus deiner Rate geworden?"
          text="Gib deine Rate ein und sieh, was daraus als Sparplan auf einen Halal ETF geworden wäre."
          ziel="/blog/ist-leasing-haram#rechner"
          knopf="Zum Leasing-Rechner"
        />
      </>
    ),
  },
  {
    id: "ratenkauf",
    titel: "Der Weg, der ohne Bank auskommt: Ratenkauf beim Händler",
    inhalt: (
      <>
        <p>
          Es gibt einen Weg, der nach Auffassung der Gelehrten in Ordnung ist, und er ist der einfachste
          von allen: Du kaufst das Auto direkt beim Händler und zahlst ihm in Raten. Keine Bank, kein
          Darlehen, ein Kaufvertrag zwischen zwei Personen.
        </p>
        <p>
          Dass der Preis dabei höher liegt als bei sofortiger Zahlung, ist ausdrücklich erlaubt. Zeit darf
          in einem Kaufvertrag Geld kosten, weil der Händler länger auf sein Geld wartet und in der
          Zwischenzeit das Auto nicht mehr hat. Drei Bedingungen müssen aber stimmen:
        </p>
        <Schritte
          schritte={[
            {
              titel: "Der Preis steht vor der Unterschrift fest",
              text: "Der Händler nennt beide Preise, bevor irgendetwas unterschrieben wird: so viel bei sofortiger Zahlung, so viel in Raten. Ein Aufschlag, der erst später dazukommt, ist nicht erlaubt.",
            },
            {
              titel: "Du entscheidest dich einmal",
              text: "Du wählst eine der beiden Möglichkeiten, und dabei bleibt es. Ein Wechsel während der Laufzeit oder ein Preis, der sich mit der Zeit verändert, macht aus dem Kaufvertrag wieder ein Zinsgeschäft.",
            },
            {
              titel: "Später zahlen darf nichts kosten",
              text: "Wenn du in Verzug kommst, darf keine Gebühr und kein Aufschlag anfallen, der sich nach der Verzugsdauer richtet. Genau das ist der Punkt, an dem viele sonst ordentliche Verträge kippen.",
            },
          ]}
        />
        <Bild text="Ein Preis in bar, ein höherer Preis in Raten. Beide stehen vor der Unterschrift fest, du wählst einmal.">
          <IlluRaten />
        </Bild>
        <Frage>Warum bietet das dann kaum ein Händler an?</Frage>
        <p>
          Aus einem Grund, der nichts mit Religion zu tun hat: Liquidität. Ein Händler, der ein Auto in
          Raten verkauft, hat sein Geld erst in Jahren wieder und kann in der Zwischenzeit keine neuen
          Autos einkaufen. Dazu kommt das Zahlungsmanagement, also Erinnerungen und Mahnungen, wenn jemand
          nicht zahlt. Für Banken ist das Tagesgeschäft, für ein Autohaus ist es Aufwand ohne Ertrag.
        </p>
        <Hinweis titel="Eine faire Erwartung an muslimische Händler">
          <p>
            Dass ein Händler Muslim ist, verpflichtet ihn nicht, dir das Auto in Raten zu verkaufen. Er
            ist Autohändler, nicht Finanzierer. Fragen kostet nichts, und auf Bekanntschaftsebene lässt
            sich manchmal etwas machen, etwa eine Zahlung in drei Schritten. Ein Anspruch darauf besteht
            nicht.
          </p>
        </Hinweis>
      </>
    ),
  },
  {
    id: "murabaha",
    titel: "Murabaha: wenn jemand das Auto für dich kauft",
    inhalt: (
      <>
        <p>
          Das zweite Modell, das Gelehrte für Fahrzeuge als tragfähig beschreiben, funktioniert über einen
          Zwischenhändler. Es heißt Murabaha und ist in vielen Ländern die übliche Art, ein Auto zu
          finanzieren.
        </p>
        <Begriff wort="Murabaha" arabisch="Murābaḥa">
          Ein Verkauf mit offengelegtem Gewinnaufschlag. Der Zwischenhändler sagt dir, was er selbst
          bezahlt hat und was er draufschlägt. Bei einem Kauf auf deinen Wunsch heißt die Form
          al-Murābaḥa lil-āmir bi-sch-schirāʾ, also Murabaha für denjenigen, der den Kauf in Auftrag gibt.
        </Begriff>
        <Schritte
          schritte={[
            { titel: "Du suchst dir ein Auto aus", text: "Beim Händler deiner Wahl, wie sonst auch." },
            {
              titel: "Das Finanzierungsunternehmen kauft es",
              text: "Es zahlt den Kaufpreis und wird vollständiger Eigentümer. Nicht auf dem Papier, sondern wirklich: Es trägt ab jetzt das Risiko am Auto.",
            },
            {
              titel: "Es verkauft es dir weiter",
              text: "Mit einem offengelegten Aufschlag und in Raten. Du weißt, was das Auto gekostet hat und was der Aufschlag ist. Beides steht vor der Unterschrift fest.",
            },
          ]}
        />
        <Bild text="Der Zwischenhändler kauft erst selbst und verkauft dann weiter. Ohne diesen Zwischenschritt ist es ein Darlehen.">
          <IlluMurabaha />
        </Bild>
        <p>
          Bei Autos hat das einen praktischen Vorteil gegenüber Immobilien: Es entsteht keine zweite
          Steuer. Grunderwerbsteuer macht Murabaha beim Haus teuer, beim Auto zahlt erst der
          Endverbraucher bei der Anmeldung. Deshalb sagen Gelehrte, dass die Möglichkeiten bei Fahrzeugen
          deutlich einfacher gegeben sind als bei Immobilien.
        </p>
        <Frage>Und ein Beteiligungsmodell, wie man es vom Hauskauf kennt?</Frage>
        <p>
          Theoretisch möglich, praktisch kaum. Ein Auto verursacht laufende Kosten, die der Partner
          mittragen müsste, und es verliert schnell an Wert. Damit rechnet sich das Modell für keine
          Seite. Auch in Ländern mit islamischen Banken läuft die Fahrzeugfinanzierung fast immer über
          Murabaha, nicht über Beteiligung.
        </p>
      </>
    ),
  },
  {
    id: "eigentum-pruefen",
    titel: "Der Test, der jede angebliche Halal-Finanzierung entlarvt",
    inhalt: (
      <>
        <p>
          Murabaha steht und fällt mit einem Punkt: Der Zwischenhändler muss das Auto wirklich besitzen,
          bevor er es dir verkauft. Wenn er es nie besessen hat, hat er dir kein Auto verkauft, sondern
          Geld geliehen. Und dann ist der Aufschlag Zins, egal wie er im Vertrag heißt.
        </p>
        <Merksatz>
          Wer die Gewährleistung trägt, ist der Verkäufer. Alle anderen sind Geldgeber.
        </Merksatz>
        <p>
          Das ist ein Test, den du selbst machen kannst, ohne den Vertrag zu verstehen. Frag: <B>Wenn in
          drei Monaten das Getriebe kaputtgeht, zu wem gehe ich?</B> Kommt als Antwort der Name des
          Autohauses, war das Finanzierungsunternehmen nie Eigentümer. Kommt der Name des
          Finanzierungsunternehmens, hat es tatsächlich verkauft.
        </p>
        <Hinweis titel="Eine Garantieversicherung zählt nicht als Antwort">
          <p>
            Manche Anbieter erklären, sie verkauften Autos nur mit einer Garantieabsicherung über eine
            Versicherung. Das ändert nichts. Die gesetzliche Gewährleistung bleibt beim Händler, und eine
            zusätzliche Versicherung ist ein eigenes Produkt daneben, kein Eigentumsnachweis.
          </p>
        </Hinweis>
        <Gegenueber
          links={{
            titel: "Echter Verkauf",
            ton: "gruen",
            punkte: [
              "Der Anbieter kauft das Auto und wird eingetragen.",
              "Bei einem Mangel bist du sein Kunde, nicht der des Autohauses.",
              "Einkaufspreis und Aufschlag stehen beide im Vertrag.",
              "Der Preis ändert sich nicht mehr, egal wie lange du zahlst.",
            ],
          }}
          rechts={{
            titel: "Umbenanntes Darlehen",
            ton: "rot",
            punkte: [
              "Das Geld geht direkt vom Anbieter ans Autohaus.",
              "Bei einem Mangel schickt man dich zum Autohaus.",
              "Im Vertrag steht kein Einkaufspreis, nur eine Rate.",
              "Es gibt eine Klausel für den Fall, dass du zu spät zahlst.",
            ],
          }}
        />
      </>
    ),
  },
  {
    id: "anbieter",
    titel: "Halal Auto finanzieren: gibt es das in Deutschland?",
    inhalt: (
      <>
        <Frage>Gibt es einen Anbieter, bei dem ich einfach halal finanzieren kann?</Frage>
        <p>
          Ehrliche Antwort: Nach dem Kenntnisstand der Gelehrten, die sich damit befasst haben, gab es
          Ende 2025 in Deutschland kein Unternehmen, das eine geprüfte Halal-Autofinanzierung anbietet.
          Es gibt Unternehmen, die es behaupten. Anfragen an sie blieben oft unbeantwortet oder wurden auf
          eine FAQ-Seite verwiesen. Ein Anbieter, der von einem Gelehrten begleitet wurde, existiert nicht
          mehr.
        </p>
        <p>
          Es ist möglich, so ein Unternehmen aufzubauen, und es wäre nach deutschem Recht umsetzbar. Es
          hat nur bisher niemand mit der nötigen Sorgfalt getan.
        </p>
        <Hinweis titel="Der Satz, der dich schützt">
          <p>
            Behauptet ein Autohaus, ein Händler oder ein Unternehmen, eine Halal-Fahrzeugfinanzierung
            anzubieten: <B>frag nach dem Zertifikat</B>. Es muss von einer anerkannten Stelle stammen, mit
            Gelehrten, die man nachschlagen kann. Gibt es keins, Finger weg. Das Wort „halal“ ist in
            Deutschland nicht geschützt, jeder darf es auf jedes Produkt schreiben.
          </p>
        </Hinweis>
        <p>
          Die typische Konstruktion, die dabei auffällt, ist simpel: Im Vertrag steht überall dort, wo
          sonst „Zins“ stünde, jetzt „Profit“ oder „Gewinnanteil“. Sonst ändert sich nichts. Genau deshalb
          hilft der Gewährleistungs-Test aus dem vorigen Abschnitt mehr als jede Broschüre.
        </p>
      </>
    ),
  },
  {
    id: "sonderfaelle",
    titel: "Vier Fälle, die dir begegnen werden",
    inhalt: (
      <>
        <Faelle
          faelle={[
            {
              titel: "Leasing-Rückläufer, den die Bank selbst verkauft",
              ton: "gelb",
              wort: "kann gehen",
              text: (
                <>
                  Wenn ein Auto nach dem Leasing wirklich der Bank gehört und sie es dir in Raten
                  verkauft, ist das ein Verkauf zwischen zwei Personen und im Kern in Ordnung. Der Haken
                  liegt im Vertrag: Bankverträge enthalten meist Verzugszinsen und einen
                  Eigentumsvorbehalt. Prüfbar, aber selten sauber.
                </>
              ),
            },
            {
              titel: "Ballonrate und Schlussrate",
              ton: "rot",
              wort: "meist Darlehen",
              text: (
                <>
                  Kleine Raten, am Ende eine große Schlusszahlung. Das ändert nur die Verteilung der
                  Zahlungen, nicht die Struktur. Steht eine Bank dahinter, bleibt es ein verzinstes
                  Darlehen. Kommt der Vertrag vom Händler ohne Bank, gelten die drei Bedingungen aus dem
                  Ratenkauf.
                </>
              ),
            },
            {
              titel: "Leasing statt Kauf",
              ton: "gelb",
              wort: "eigenes Thema",
              text: (
                <>
                  Leasing ist kein Kredit, sondern Miete, und wird deshalb anders beurteilt. Der
                  Knackpunkt ist, wer bei einem Schaden haftet, den niemand verschuldet hat. Das steht
                  in <L to="/blog/ist-leasing-haram">Leasing ohne Zinsen: geht das halal?</L>
                </>
              ),
            },
            {
              titel: "Der Händler vermittelt dir nur die Bank",
              ton: "rot",
              wort: "nein",
              text: (
                <>
                  Auch wenn der Vertrag im Autohaus unterschrieben wird: Wenn das Geld von einer Bank
                  kommt und der Händler dafür eine Provision bekommt, ist es eine Bankfinanzierung mit
                  einem Verkäufer als Vermittler.
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
    titel: "Was du praktisch tun kannst",
    inhalt: (
      <>
        <p>
          Solange es keinen geprüften Anbieter gibt, bleibt der Weg unbequem, aber er ist gangbar. In der
          Reihenfolge, in der die meisten ihn gehen:
        </p>
        <Checkliste
          punkte={[
            { art: "ja", text: "Ein günstigeres Auto bar kaufen. Der schnellste Weg aus der Frage heraus, und der einzige ohne jedes Kleingedruckte." },
            { art: "ja", text: "Sparen und später bar kaufen. In der Zwischenzeit ein sehr günstiges Fahrzeug fahren oder auf öffentliche Verkehrsmittel ausweichen, wo es geht." },
            { art: "ja", text: "Den Händler nach einem Ratenkauf ohne Bank fragen. Beim kleinen Gebrauchtwagenhändler klappt das eher als beim Vertragshaus." },
            { art: "ja", text: "Ein zinsloses Darlehen im Umfeld. Bei Familie oder Freunden ist das die Form, die es tatsächlich gibt, ohne Aufschlag und ohne Vertragswerk." },
            { art: "neutral", text: "Ein Auto von privat kaufen und in Raten zahlen, wenn der Verkäufer mitmacht. Selten, aber islamisch unproblematisch." },
            { art: "nein", text: "Keine Bankfinanzierung, auch nicht mit null Prozent im Prospekt." },
            { art: "nein", text: "Keine Halal-Finanzierung ohne Zertifikat einer anerkannten Stelle." },
          ]}
        />
        <p>
          Bis du genug gespart hast, kannst du das Geld halal anlegen. Welche Depots dafür passen, siehst du im{" "}
          <Link to="/vergleich/depot" className="font-medium text-primary underline underline-offset-2 hover:no-underline">
            Depot-Vergleich
          </Link>
          .
        </p>
        <p>
          Und ein Gedanke, der zum Thema gehört: Ein Auto ist in vielen Gegenden eine echte
          Notwendigkeit, in vielen anderen ein Statussymbol. Die Frage nach der Finanzierung wird deutlich
          kleiner, wenn die Frage nach dem Preis vorher ehrlich beantwortet wurde. Wer im Umland wohnt und
          zur Arbeit muss, braucht ein Auto. Kaum jemand braucht das Auto, das er sich nur mit einer
          Finanzierung leisten kann.
        </p>
      </>
    ),
  },
];

const faq: BeitragFrage[] = [
  {
    frage: "Ist eine Autofinanzierung über die Bank haram?",
    antwort:
      "Nach verbreiteter Auffassung ja. Die Bank überweist dem Händler den Kaufpreis und bekommt von dir mehr Geld zurück. Geld gegen mehr Geld ist genau die Struktur, die Gelehrte als Riba beschreiben. Das gilt für die eigene Hausbank ebenso wie für die Autobank eines Herstellers.",
  },
  {
    frage: "Ist eine Null-Prozent-Finanzierung erlaubt?",
    antwort:
      "Nach verbreiteter Auffassung nicht. Bei diesen Aktionen wird der Zinsbetrag, den die Bank verdient hätte, auf den Kaufpreis aufgeschlagen. Ob der Aufschlag als Prozentsatz gerechnet oder als Summe in den Preis geschrieben wird, ändert nichts daran, dass eine Bank Geld gibt und mehr zurückbekommt.",
  },
  {
    frage: "Darf ein Auto in Raten teurer sein als bar?",
    antwort:
      "Ja, wenn der Händler selbst der Verkäufer ist. Der höhere Ratenpreis ist erlaubt, solange beide Preise vor Vertragsschluss feststehen, du dich einmal für einen entscheidest und später keine zusätzlichen Kosten für verspätete Zahlung anfallen.",
  },
  {
    frage: "Was ist Murabaha bei einer Autofinanzierung?",
    antwort:
      "Ein Unternehmen kauft das Auto, das du haben willst, wird vollständiger Eigentümer und verkauft es dir mit einem offengelegten Aufschlag in Raten weiter. Du erfährst dabei, was das Auto im Einkauf gekostet hat und wie hoch der Aufschlag ist. Ohne echten Eigentumsübergang ist es kein Murabaha, sondern ein Darlehen.",
  },
  {
    frage: "Woran erkenne ich, ob eine Halal-Autofinanzierung echt ist?",
    antwort:
      "An der Gewährleistung. Frage, an wen du dich bei einem Mangel am Auto wendest. Ist das der Anbieter der Finanzierung, war er wirklich Eigentümer und Verkäufer. Ist es das Autohaus, hat der Anbieter nur Geld gegeben. Zusätzlich gilt: nach dem Zertifikat einer anerkannten Prüfstelle fragen, denn das Wort halal ist in Deutschland nicht geschützt.",
  },
  {
    frage: "Kann ich ein Auto in Deutschland halal finanzieren?",
    antwort:
      "Nach dem Kenntnisstand der Gelehrten, die sich damit befasst haben, gab es Ende 2025 keinen Anbieter mit einer geprüften Halal-Fahrzeugfinanzierung. Einzelne Unternehmen behaupten es, konnten es auf Nachfrage aber nicht belegen. Möglich wäre ein solches Angebot, gebaut hat es bisher niemand mit der nötigen Sorgfalt.",
  },
  {
    frage: "Ist Leasing die bessere Lösung?",
    antwort:
      "Leasing ist Miete und wird deshalb anders beurteilt als ein Kredit. Es hat aber eigene Probleme, vor allem die Frage, wer bei einem unverschuldeten Schaden haftet. Ob ein konkreter Leasingvertrag geht, hängt an fünf Punkten im Vertrag und wird im Beitrag zum Leasing durchgegangen.",
  },
  {
    frage: "Was mache ich, wenn ich das Auto beruflich brauche?",
    antwort:
      "Zuerst den Preis senken statt die Finanzierung suchen. Ein günstigeres Fahrzeug bar zu kaufen löst die Frage vollständig. Danach kommen der Ratenkauf direkt beim Händler und ein zinsloses Darlehen im Umfeld. Eine Notlage kann in besonderen Fällen anders beurteilt werden, das ist aber eine Einzelfallfrage für einen Gelehrten, nicht für einen Ratgeber.",
  },
];

const PFAD = "/blog/auto-kaufen-ohne-zinsen-halal";
const TITEL = "Auto kaufen ohne Zinsen halal? Der komplette Guide 2026";
/** Title-Tag: Hauptwort vorn wie die Adresse (Ahrefs „auto kaufen ohne zinsen halal“), Jahr, mit „| finanzmuslim“ 59 Zeichen. */
const SEO_TITEL = "Auto kaufen ohne Zinsen halal? Die Wege 2026";
const beschreibung =
  "Auto kaufen ohne Zinsen halal? Bank und 0-Prozent-Aktion fallen weg. Bar, Ratenkauf beim Händler und Murabaha gehen. Mit Video und Rechner zum Leasing.";

const DREIER = [
  { name: "Traders Place", logo: "/bilder/blog/halal-etf/logos/traders-place-wortmarke.svg", out: "/out/traders-place" },
  { name: "Smartbroker+", logo: "/bilder/blog/halal-etf/logos/smartbroker.webp", out: "/out/smartbroker" },
  { name: "Scalable Capital", logo: "/bilder/blog/halal-etf/logos/scalable.webp", out: "/out/scalable" },
];
// Sparplan auf Platz 1 wie im Leasing-Beitrag: Smartbroker+ und Scalable aus sparplanBei der Liste, Traders Place nach Elias' eigenem Depot.
const sparplanPlatz1 = (name: string) => name === "Traders Place" || PLATZ1.sparplanBei.some((s) => s.startsWith(name.split(" ")[0]));
const ANBIETER = DREIER.map((d) => ({
  ...d,
  zeilen: [
    sparplanPlatz1(d.name) ? `Sparplan auf ${PLATZ1.name}` : `Sparplan auf ${PLATZ1.name} noch nicht nachgesehen`,
    `Halal ETFs aus unserer Liste: ${etfsBei(d.name)} von ${etfListe.length}`,
    d.name === "Smartbroker+" ? "Zinsen nur auf eigenem Zinskonto" : "Zinsen aufs Guthaben: 0 %",
  ],
}));

const videoSchema = {
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "@id": `${SITE}${PFAD}#video`,
  name: VIDEO_LEASING.titel,
  description: "Elias erklärt in unter zehn Minuten, wann Leasing als Muslim geht und warum das Auto-Abo die Alternative ist.",
  thumbnailUrl: `${SITE}${VIDEO_LEASING.bild}`,
  uploadDate: VIDEO_LEASING.hochgeladen,
  duration: "PT9M11S",
  embedUrl: `https://www.youtube-nocookie.com/embed/${VIDEO_LEASING.id}`,
  contentUrl: `https://www.youtube.com/watch?v=${VIDEO_LEASING.id}`,
  hasPart: videoClips(VIDEO_LEASING.id, KAPITEL_LEASING, VIDEO_LEASING.dauer),
};

const AUFGEFRISCHT = "26. November 2026";

const AutoKaufenOhneZinsen = () => (
  <>
    <Seo
      title={`${SEO_TITEL} | finanzmuslim`}
      description={beschreibung}
      path={PFAD}
      jsonLd={[
        ...beitragJsonLd({
          titel: TITEL,
          beschreibung,
          path: PFAD,
          datePublished: "5. September 2026",
          dateModified: AUFGEFRISCHT,
          faq,
        }),
        videoSchema,
      ]}
    />
    <BeitragSeite
      slug="auto-kaufen-ohne-zinsen"
      titel={TITEL}
      untertitel="Die erste Frage ist nicht, wie hoch der Zins ist, sondern wer dir das Geld gibt."
      kurzGesagt={[
        "Bankfinanzierung ist ein Darlehen: Geld gegen mehr Geld. Das gilt für die eigene Bank wie für die Autobank des Herstellers.",
        "Null Prozent ist kein Ausweg, solange eine Bank dahintersteht: Der Zinsbetrag wandert in den Kaufpreis.",
        "Ein höherer Preis bei Ratenzahlung ist erlaubt, wenn der Händler selbst verkauft und der Preis vorher feststeht.",
        "Murabaha funktioniert nur, wenn der Anbieter das Auto wirklich kauft. Test: Wer trägt die Gewährleistung?",
        "Ende 2025 gab es in Deutschland keinen geprüften Anbieter. Ohne Zertifikat einer anerkannten Stelle: Finger weg.",
      ]}
      abschnitte={abschnitte}
      faq={faq}
      datePublished="5. September 2026"
      dateModified="26. November 2026"
      boxMitteNach={2}
      werbungNach={3}
      werbungKasten={<AnbieterKasten titel="Depots für deine Ersparnisse" anbieter={ANBIETER} />}
      einleitung={
        <>
          <p>
            Das Autohaus wirbt mit 0 % Finanzierung. Aber geht Auto kaufen ohne Zinsen halal? Über eine Bank nicht, denn eine Finanzierung ist ein
            Darlehen mit Zins. Bar bezahlen, der Ratenkauf direkt beim Händler und Murabaha gehen, wenn der Anbieter das Auto wirklich besitzt. Einen
            geprüften Anbieter kannten Gelehrte in Deutschland Ende 2025 nicht.
          </p>
        </>
      }
      rechtshinweis="Werbung: Eröffnest du über meinen Link ein Depot, bekomme ich eine Provision, ohne Mehrkosten für dich. Dieser Beitrag gibt bekannte Positionen wieder und dient ausschließlich zu Bildungszwecken. Er ist keine Fatwa und keine Rechts- oder Finanzberatung. Zur Beurteilung konzerneigener Autobanken, zur Zulässigkeit einzelner Vertragsklauseln und zu Notlagen bestehen unter Gelehrten unterschiedliche Auffassungen. Angaben zum Anbietermarkt beziehen sich auf den Stand Ende 2025. Die Zahlen im Beispiel zu Leasingrate oder Depot sind erfunden. Das Beispiel zur Null-Prozent-Aktion folgt einem Beispiel von Hourani."
      boxOben={{
        kategorie: "Vorlage",
        ueberschrift: "Vertrag prüfen, bevor du unterschreibst",
        linkZiel: "/vorlagen/vertrags-ampel",
        text: "Die Klauseln, an denen ein Vertrag kippt, in einer Liste.",
        knopf: "Zum Halal Vertrags-Check",
      }}
      boxMitte={{
        kategorie: "Rechner",
        ueberschrift: "Was kostet der Autokredit?",
        text: "Rechne aus, wie viel Zinsen in der Rate stecken. Danach siehst du, wie schnell du stattdessen sparst.",
        knopf: "Zum Kreditkostenrechner",
        linkZiel: "/kreditkostenrechner",
      }}
    >
      {/* SEO86 reviewer (Checkliste A15, A16): closing call to action like /blog/ist-leasing-haram */}
      <section className="mt-12">
        <h2 id="naechster-schritt" className="font-titel text-[26px] leading-tight text-foreground md:text-[30px]">
          Dein nächster Schritt: das passende Depot
        </h2>
        <p className="mt-3 text-[16px] leading-[1.6] text-foreground/80">
          Bis zum Autokauf kannst du dein Erspartes halal anlegen. Hier sind drei Depots aus meinem Vergleich.
        </p>
        <AnbieterKasten titel="Depots für deine Ersparnisse" anbieter={ANBIETER} />
      </section>
      <PasstDazu
        punkte={[
          { to: "/blog/ratenzahlung-haram", name: "Ratenkauf", text: "erklärt, warum ein höherer Preis in Raten erlaubt ist und wann er kippt." },
          { to: "/blog/ist-leasing-haram", name: "Leasing ohne Zinsen", text: "prüft die Alternative zum Kauf an fünf Punkten im Vertrag." },
          { to: "/blog/halal-kredit", name: "Kredit ohne Zinsen", text: "zeigt, welche Verträge einen Kredit ersetzen können." },
          { to: "/blog/zinsen-im-islam", name: "Zinsen im Islam", text: "sagt, was genau verboten ist und was ausdrücklich nicht." },
        ]}
      />
    </BeitragSeite>
  </>
);

export default AutoKaufenOhneZinsen;
