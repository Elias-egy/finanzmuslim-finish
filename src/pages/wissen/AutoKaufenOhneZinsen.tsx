import Seo, { beitragJsonLd } from "@/components/Seo";
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

const abschnitte: BeitragAbschnitt[] = [
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
          Das ist die häufigste Falle bei diesem Thema. Bei einer Null-Prozent-Aktion rechnet der Händler
          aus, was die Bank an Zinsen verdient hätte, und schlägt diesen Betrag auf den Kaufpreis. Danach
          steht im Vertrag null Prozent, und der Aufschlag steckt im Preis.
        </p>
        <Beispiel
          titel="Was hinter einer Null-Prozent-Aktion steckt"
          rechnung={["Auto 10.000 €", "Zinsen, die die Bank bekommen hätte: 2.000 €", "Kaufpreis in der Aktion: 12.000 €, Zinssatz 0 %"]}
          ergebnis="Der Aufschlag ist derselbe. Nur der Name auf dem Formular hat sich geändert."
        >
          <p>
            Die Zahlen sind ein einfaches Rechenbeispiel, kein reales Angebot. Entscheidend ist die
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
          nächsten Abschnitt und ausführlich in{" "}
          <L to="/wissen/ratenzahlung-haram">Ratenkauf</L>.
        </p>
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
    titel: "Was es in Deutschland tatsächlich gibt",
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
                  in <L to="/wissen/ist-leasing-haram">Leasing</L>.
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
    frage: "Gibt es in Deutschland eine halale Autofinanzierung?",
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

const beschreibung =
  "Bankfinanzierung, Null-Prozent-Aktion, Ratenkauf beim Händler und Murabaha im Vergleich. Welcher Weg ohne Zinsen auskommt, woran du eine echte Halal-Finanzierung erkennst und was es in Deutschland wirklich gibt.";

const AutoKaufenOhneZinsen = () => (
  <>
    <Seo
      title="Auto kaufen ohne Zinsen: die Wege im Vergleich | finanzmuslim"
      description={beschreibung}
      path="/wissen/auto-kaufen-ohne-zinsen"
      jsonLd={beitragJsonLd({
        titel: "Auto kaufen ohne Zinsen",
        beschreibung,
        path: "/wissen/auto-kaufen-ohne-zinsen",
        datePublished: "5. September 2026",
        dateModified: "5. September 2026",
        faq,
      })}
    />
    <BeitragSeite
      slug="auto-kaufen-ohne-zinsen"
      titel="Auto kaufen ohne Zinsen"
      untertitel="Die erste Frage ist nicht, wie hoch der Zins ist, sondern wer dir das Geld gibt."
      kurzGesagt={[
        "Bankfinanzierung ist ein Darlehen: Geld gegen mehr Geld. Das gilt für die eigene Bank wie für die Autobank des Herstellers.",
        "Null Prozent ist kein Ausweg. Der Zinsbetrag wandert dann in den Kaufpreis.",
        "Ein höherer Preis bei Ratenzahlung ist erlaubt, wenn der Händler selbst verkauft und der Preis vorher feststeht.",
        "Murabaha funktioniert nur, wenn der Anbieter das Auto wirklich kauft. Test: Wer trägt die Gewährleistung?",
        "Ende 2025 gab es in Deutschland keinen geprüften Anbieter. Ohne Zertifikat einer anerkannten Stelle: Finger weg.",
      ]}
      abschnitte={abschnitte}
      faq={faq}
      datePublished="5. September 2026"
      dateModified="5. September 2026"
      boxMitteNach={4}
      rechtshinweis="Dieser Beitrag gibt bekannte Positionen wieder und dient ausschließlich zu Bildungszwecken. Er ist keine Fatwa und keine Rechts- oder Finanzberatung. Zur Beurteilung konzerneigener Autobanken, zur Zulässigkeit einzelner Vertragsklauseln und zu Notlagen bestehen unter Gelehrten unterschiedliche Auffassungen. Angaben zum Anbietermarkt beziehen sich auf den Stand Ende 2025. Die Zahlen in den Beispielen sind erfunden."
      boxOben={{
        kategorie: "Vorlage",
        ueberschrift: "Vertrag prüfen, bevor du unterschreibst",
        linkZiel: "/vorlagen/vertrags-ampel",
        text: "Die Klauseln, an denen ein Vertrag kippt, in einer Liste.",
        knopf: "Zur Vertrags-Ampel",
      }}
      boxMitte={{
        kategorie: "Rechner",
        ueberschrift: "Auto ohne Kredit ansparen",
        text: "Rechne aus, wie viel du im Monat zurücklegst und wann du das Auto bar bezahlst.",
        knopf: "Zum Sparzielrechner",
        linkZiel: "/sparzielrechner",
      }}
    >
      <PasstDazu
        punkte={[
          { to: "/wissen/ratenzahlung-haram", name: "Ratenkauf", text: "erklärt, warum ein höherer Preis in Raten erlaubt ist und wann er kippt." },
          { to: "/wissen/ist-leasing-haram", name: "Leasing", text: "prüft die Alternative zum Kauf an fünf Punkten im Vertrag." },
          { to: "/wissen/halal-kredit-ohne-zinsen", name: "Kredit ohne Zinsen", text: "zeigt, welche Verträge einen Kredit ersetzen können." },
          { to: "/wissen/zinsen-im-islam", name: "Zinsen im Islam", text: "sagt, was genau verboten ist und was ausdrücklich nicht." },
        ]}
      />
    </BeitragSeite>
  </>
);

export default AutoKaufenOhneZinsen;
