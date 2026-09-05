import Seo, { beitragJsonLd } from "@/components/Seo";
import BeitragSeite, { type BeitragAbschnitt, type BeitragFrage } from "@/components/BeitragSeite";
import { IlluHandel, IlluLeasingHaftung } from "@/components/illu";
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
    id: "die-antwort",
    titel: "Leasing ist Miete, und Miete ist erlaubt",
    inhalt: (
      <>
        <p>
          Leasing ist nicht grundsätzlich verboten. Im Kern ist es ein Mietvertrag: Du zahlst dafür, ein Auto
          zu nutzen, das jemand anderem gehört. Mieten ist im Islam ausdrücklich erlaubt, es gibt dafür sogar
          einen eigenen Vertragstyp.
        </p>
        <Begriff wort="Miete" arabisch="Ijara">
          Du zahlst für die Nutzung einer Sache, das Eigentum bleibt beim anderen. Und weil es bei ihm bleibt,
          bleibt auch das Risiko der Sache bei ihm. Genau daran entscheidet sich fast jeder Leasingvertrag.
        </Begriff>
        <Merksatz>Die Frage ist nicht, ob du least. Die Frage ist, was im Vertrag steht.</Merksatz>
        <p>
          Und hier kommt die unbequeme Nachricht gleich vorweg: Die Verträge, die dir ein deutsches Autohaus
          vorlegt, sind fast nie reine Mietverträge. Sie enthalten regelmäßig eine Klausel, die aus der Miete
          etwas anderes macht.
        </p>
        <Bild text="Bei einer echten Miete tauschst du Geld gegen Nutzung. Solange nur das passiert, ist der Vertrag unproblematisch.">
          <IlluHandel />
        </Bild>
      </>
    ),
  },
  {
    id: "das-haeufigste",
    titel: "Der eine Punkt, an dem fast alle Verträge scheitern",
    inhalt: (
      <>
        <Frage>Wenn das Auto morgen gestohlen wird oder verbrennt, wer zahlt dann weiter?</Frage>
        <p>
          Das ist die Frage, an der alles hängt. In deutschen Leasingverträgen steht dazu sinngemäß, dass deine
          Zahlungspflicht <B>bestehen bleibt</B>, auch wenn das Fahrzeug zerstört oder gestohlen wird. Meist
          zusammen mit der Pflicht, eine Vollkaskoversicherung abzuschließen, die diesen Fall abdeckt.
        </p>
        <Bild text="Wem gehört das Auto, der trägt sein Risiko. Wird es auf den Mieter geschoben, ist es keine Miete mehr.">
          <IlluLeasingHaftung />
        </Bild>
        <p>
          Genau hier hört die Miete auf. Bei einer echten Miete gilt: Ist die Sache weg, endet die Pflicht zu
          zahlen. Wer den Untergang der Sache trägt, ohne ihr Eigentümer zu sein, zahlt für ein Risiko, das ihm
          nicht gehört. Der Vertrag ist dann keine gültige Miete mehr, und darüber sind sich Gelehrte einig.
        </p>
        <Hinweis titel="Das ist nicht die Ausnahme, das ist die Regel">
          <p>
            Gelehrte, die deutsche Leasingverträge durchgesehen haben, berichten, dass diese Klausel in
            praktisch <B>jedem</B> von ihnen steht, quer durch alle Anbieter, von den Herstellerbanken bis zu
            den freien Leasinggesellschaften. Die Herstellerangebote sind dabei im Schnitt etwas fairer als
            die von Drittanbietern, aber die Klausel selbst findet sich fast überall. Rechne also nicht damit,
            dass dein Vertrag die Ausnahme ist. Lies nach.
          </p>
        </Hinweis>
        <p>
          Deshalb steht Leasing in unserer <L to="/vorlagen/vertrags-ampel">Vertrags-Ampel</L> auf Gelb und
          nicht auf Grün. Es hängt an einer Bedingung, die die wenigsten Verträge von selbst erfüllen.
        </p>
      </>
    ),
  },
  {
    id: "fuenf-punkte",
    titel: "Die fünf Punkte, auf die es ankommt",
    inhalt: (
      <>
        <p>Nimm deinen Vertrag und geh diese fünf Punkte durch. Jeder einzelne kann die Sache kippen.</p>
        <Schritte
          schritte={[
            {
              titel: "Wer trägt den Schaden, wenn das Auto untergeht?",
              text: "In Ordnung: der Eigentümer, also die Leasinggesellschaft. Problem: Du musst weiterzahlen, obwohl es das Auto nicht mehr gibt. Das ist der wichtigste Punkt, siehe oben.",
            },
            {
              titel: "Fallen bei verspäteter Zahlung Zinsen an?",
              text: "In Ordnung: eine feste Mahngebühr, die sich mit der Zeit nicht vergrößert. Problem: Verzugszinsen. Für viele Gelehrte ist bereits die Vereinbarung das Problem, auch wenn du immer pünktlich zahlst.",
            },
            {
              titel: "Musst du das Auto am Ende kaufen?",
              text: "In Ordnung: Du gibst es zurück, oder du darfst kaufen und musst nicht. Problem: eine Kaufverpflichtung. Dann war es von Anfang an ein Ratenkauf im Mietmantel.",
            },
            {
              titel: "Steht bei einer Kaufoption ein Zinssatz?",
              text: "Bei reinem Leasing ist ein Zinssatz keine Frage für dich: Wie der Leasinggeber sein Auto finanziert hat, ist sein Vertrag, nicht deiner. Sobald der Vertrag aber eine Kaufoption oder eine Finanzierung enthält, wirst du selbst Teil des Zinsgeschäfts. Dann gilt, was im Vertrag steht, nicht was auf dem Prospekt stand.",
            },
            {
              titel: "Wer zahlt Wartung, Steuer und Versicherung?",
              text: "In Ordnung: Alles, was am Eigentum hängt, trägt der Eigentümer, und er darf diese Kosten in die Monatsrate einrechnen. Er darf dich sogar beauftragen, es für ihn zu erledigen. Problem: Es wird dir aufgebürdet, ohne dass es in der Rate steckt und ohne dass er es dir erstattet. Sprit und Strom zahlst du natürlich selbst, das gehört zur Nutzung.",
            },
          ]}
        />
      </>
    ),
  },
  {
    id: "restwert",
    titel: "Restwert, Schlussrate und Ballonfinanzierung",
    inhalt: (
      <>
        <p>Hier werden die Begriffe gern vermischt, und der Unterschied ist wichtig.</p>
        <Gegenueber
          links={{
            titel: "Restwertleasing",
            ton: "rot",
            punkte: [
              "Am Ende steht ein Wert, den das Auto haben soll.",
              "Ist es weniger wert, forderst du nicht nach, sondern der Leasinggeber von dir.",
              "Genau diese Nachforderung ist das Problem: Wertverlust trifft den Eigentümer, nicht den Mieter.",
              "Auch außerhalb dieser Frage der häufigste Streitpunkt am Vertragsende.",
            ],
          }}
          rechts={{
            titel: "Kilometerleasing",
            ton: "gelb",
            punkte: [
              "Du zahlst für eine vereinbarte Fahrleistung und gibst das Auto zurück.",
              "Deutlich näher an einer echten Miete.",
              "Mehrkilometer sind Nutzung, die du wirklich verbraucht hast, das ist etwas anderes als Wertverlust.",
              "Punkt 1 musst du trotzdem prüfen.",
            ],
          }}
        />
        <Merksatz>
          Nach der Rückgabe darf keine Nachzahlung kommen, die am Wert des Autos hängt. Wer Eigentümer ist,
          trägt den Wertverlust.
        </Merksatz>
        <p>
          <B>Die Ballonfinanzierung</B> ist trotz ihres Namens meist gar kein Leasing, sondern ein Kredit mit
          kleinen Raten und einer großen Schlussrate. Dort steht ein Zinssatz im Vertrag, und du bist die
          Vertragspartei. Damit ist die Frage beantwortet.
        </p>
      </>
    ),
  },
  {
    id: "autoabo",
    titel: "Und das Autoabo?",
    inhalt: (
      <>
        <p>
          Das Autoabo ist in dieser Frage oft der klarere Fall. Du zahlst einen Monatsbetrag, darin sind
          Versicherung, Steuer und Wartung enthalten, und du kannst meist kurzfristig kündigen. Kein Restwert,
          keine Schlussrate, keine Kaufverpflichtung. Damit erfüllt es die Bedingungen einer Miete deutlich
          eher als ein klassischer Leasingvertrag.
        </p>
        <Hinweis titel="Trotzdem nicht automatisch in Ordnung">
          <p>
            Auch ein Abo kann die Untergangs-Klausel enthalten. Prüf Punkt 1 und Punkt 2 genauso wie beim
            Leasing: Was passiert bei Totalschaden, und was passiert bei verspäteter Zahlung. Sprit und Strom
            zahlst du selbst, das ist in Ordnung, das ist deine Nutzung.
          </p>
        </Hinweis>
        <p>
          Der Preis ist dafür höher. Rechne mit etwa 50 bis 100 Euro im Monat Aufpreis gegenüber einem
          vergleichbaren Leasingvertrag. Das ist der Preis dafür, dass jemand anderes das Risiko trägt, und
          insofern ist er auch nicht willkürlich. Wer die Wahl hat, fährt mit einem gebrauchten, bar bezahlten
          Auto trotzdem deutlich günstiger und hat die ganze Frage vom Tisch.
        </p>
      </>
    ),
  },
  {
    id: "alternativen",
    titel: "Was stattdessen geht",
    inhalt: (
      <>
        <Checkliste
          punkte={[
            {
              art: "ja",
              text: (
                <>
                  <B>Gebraucht kaufen, bar bezahlen.</B> Der einfachste Weg und der, den fast niemand hören
                  will. Ein Auto für 8.000 Euro, das bezahlt ist, kostet dich weniger als drei Jahre Leasing
                  für dasselbe Geld, und es gehört dir.
                </>
              ),
            },
            {
              art: "ja",
              text: (
                <>
                  <B>Erst ansparen, dann kaufen.</B> Wer die Leasingrate stattdessen zwei Jahre lang zur Seite
                  legt, hat den Kaufpreis eines soliden Gebrauchtwagens zusammen. Der{" "}
                  <L to="/vergleich/depot">Weg dorthin</L> führt nicht über ein Sparbuch, sondern über ein
                  Depot ohne Zinsgeschäft.
                </>
              ),
            },
            {
              art: "ja",
              text: (
                <>
                  <B>Ratenkauf direkt beim Händler.</B> Wenn der Preis vorher feststeht und keine Bank
                  dazwischen ist, ist das Handel. Mehr dazu in{" "}
                  <L to="/wissen/ratenzahlung-haram">Ist Ratenzahlung haram?</L>
                </>
              ),
            },
            {
              art: "neutral",
              text: (
                <>
                  <B>Kilometerleasing statt Restwertleasing</B>, wenn es unbedingt Leasing sein muss. Und den
                  Vertrag vorher an den fünf Punkten prüfen.
                </>
              ),
            },
          ]}
        />
        <p>
          <B>Wenn du beruflich darauf angewiesen bist</B> und keinen anderen Weg siehst, ist das eine Frage
          der Notlage. Darüber entscheidet niemand aus der Ferne und schon gar nicht eine Website. Das gilt
          besonders für Gewerbetreibende, bei denen das Fahrzeug zur Arbeit gehört. Sprich mit einem
          Gelehrten, dem du vertraust, und schildere ihm deine Lage genau, mit dem Vertrag auf dem Tisch.
        </p>
      </>
    ),
  },
];

const faq: BeitragFrage[] = [
  {
    frage: "Ist Auto-Leasing haram?",
    antwort:
      "Nicht grundsätzlich. Leasing ist im Kern Miete, und Miete ist erlaubt. In der Praxis scheitern aber fast alle deutschen Leasingverträge an einem Punkt: Sie verlangen, dass du weiterzahlst, auch wenn das Auto zerstört oder gestohlen wird. Damit trägst du das Risiko einer Sache, die dir nicht gehört, und das ist keine Miete mehr.",
  },
  {
    frage: "Was ist der Unterschied zwischen Leasing und Ijara?",
    antwort:
      "Ijara ist der islamische Mietvertrag. Der wichtigste Unterschied zum üblichen Leasing ist die Verteilung des Risikos: Bei der Ijara trägt der Eigentümer den Untergang der Sache. Bei deutschen Leasingverträgen wird genau das regelmäßig auf den Nutzer abgewälzt.",
  },
  {
    frage: "Muss ich mir Sorgen machen, dass die Leasingbank den Wagen auf Kredit gekauft hat?",
    antwort:
      "Beim reinen Leasing nicht. Wie der Leasinggeber sein Fahrzeug finanziert hat, ist sein Vertrag, nicht deiner. Anders liegt es, sobald dein Vertrag eine Kaufoption oder eine Finanzierung enthält, denn dann wirst du selbst Vertragspartei eines Zinsgeschäfts.",
  },
  {
    frage: "Darf der Leasinggeber am Ende eine Nachzahlung für den Restwert verlangen?",
    antwort:
      "Nach verbreiteter Auffassung nicht. Der Wertverlust einer Sache trifft ihren Eigentümer. Eine Nachforderung, die daran hängt, dass das Auto weniger wert ist als geplant, schiebt dieses Risiko auf den Mieter. Mehrkilometer sind etwas anderes, das ist Nutzung, die du verbraucht hast.",
  },
  {
    frage: "Ist ein Autoabo halal?",
    antwort:
      "Es kommt dem näher als klassisches Leasing, weil es keine Schlussrate, keinen Restwert und keine Kaufverpflichtung gibt. Automatisch in Ordnung ist es damit nicht: Zu prüfen bleibt, was bei Totalschaden und bei Zahlungsverzug im Vertrag steht. Rechne mit rund 50 bis 100 Euro Aufpreis im Monat.",
  },
  {
    frage: "Die Vollkasko ist beim Leasing Pflicht. Ist das ein Problem?",
    antwort:
      "Sie ist eher ein Symptom: Die Vollkasko wird verlangt, weil das Untergangsrisiko auf dich abgewälzt wurde. Zur Versicherung selbst gehen die Meinungen auseinander, und gerade die Vollkasko wird von Gelehrten kritisch gesehen. Mehr dazu im Beitrag zur Versicherung.",
  },
  {
    frage: "Ich habe schon einen Leasingvertrag laufen. Was jetzt?",
    antwort:
      "Prüfe die fünf Punkte. Findest du etwas, klär mit dem Anbieter, ob eine vorzeitige Rückgabe oder eine Übernahme durch jemand anderen möglich ist, und was das kostet. Wo es keinen Ausweg gibt, erfüllst du den Vertrag und vermeidest solche Klauseln beim nächsten Mal. Bei beruflicher Abhängigkeit gehört der Fall zu einem Gelehrten, mit dem Vertrag auf dem Tisch.",
  },
];

const beschreibung =
  "Leasing ist im Kern Miete und damit erlaubt. In der Praxis scheitern deutsche Verträge fast immer an einem Punkt: Du zahlst weiter, auch wenn das Auto weg ist. Fünf Punkte zum Prüfen, dazu Restwert, Autoabo und Alternativen.";

const IstLeasingHaram = () => (
  <>
    <Seo
      title="Ist Leasing haram? Die fünf Punkte im Vertrag | finanzmuslim"
      description={beschreibung}
      path="/wissen/ist-leasing-haram"
      jsonLd={beitragJsonLd({
        titel: "Ist Leasing haram?",
        beschreibung,
        path: "/wissen/ist-leasing-haram",
        datePublished: "16. August 2026",
        dateModified: "5. September 2026",
        faq,
      })}
    />
    <BeitragSeite
      slug="ist-leasing-haram"
      titel="Ist Leasing haram?"
      untertitel="Eine Klausel entscheidet, und sie steht in fast jedem deutschen Vertrag."
      kurzGesagt={[
        "Leasing ist Miete, und Miete ist erlaubt. Es kommt auf den Vertrag an.",
        "Der entscheidende Punkt: Musst du nach einem Totalschaden weiterzahlen? In deutschen Verträgen fast immer ja.",
        "Wer nicht Eigentümer ist, trägt auch nicht das Risiko der Sache. Sonst ist es keine Miete mehr.",
        "Verzugszinsen im Vertrag sind für viele Gelehrte schon das Problem.",
        "Wie der Leasinggeber sein Auto finanziert hat, ist beim reinen Leasing nicht dein Vertrag.",
        "Eine Nachzahlung für den Restwert am Ende gehört nicht zur Miete.",
      ]}
      abschnitte={abschnitte}
      faq={faq}
      datePublished="16. August 2026"
      dateModified="5. September 2026"
      boxMitteNach={2}
      rechtshinweis="Dieser Beitrag gibt bekannte Positionen wieder und dient ausschließlich zu Bildungszwecken. Er ist keine Fatwa und ersetzt weder die Auskunft eines Gelehrten noch eine Rechtsberatung. Leasingverträge unterscheiden sich stark, maßgeblich ist immer dein eigener Vertrag. Innerhalb der Rechtsschulen gibt es zu einzelnen Punkten abweichende Auffassungen, besonders bei Pflichtversicherungen und bei beruflicher Notwendigkeit. Die Zahlen in den Beispielen sind Näherungswerte."
      boxOben={{
        kategorie: "Vorlage",
        ueberschrift: "Leasing und elf weitere Verträge auf einen Blick",
        linkZiel: "/vorlagen/vertrags-ampel",
        text: "Grün, gelb oder rot für zwölf Verträge aus dem Alltag.",
        knopf: "Zur Vertrags-Ampel",
      }}
      boxMitte={{
        kategorie: "Depot",
        ueberschrift: "Ansparen statt monatlich zahlen",
        linkZiel: "/vergleich/depot",
      }}
    >
      <PasstDazu
        punkte={[
          { to: "/wissen/ratenzahlung-haram", name: "Ist Ratenzahlung haram?", text: "der saubere Weg, ein Auto in Raten zu kaufen, ohne Bank dazwischen." },
          { to: "/wissen/ist-versicherung-haram", name: "Ist Versicherung haram?", text: "warum gerade die Vollkasko kritisch gesehen wird." },
          { to: "/wissen/zinsen-im-islam", name: "Zinsen im Islam", text: "erklärt, warum die Zeit der entscheidende Punkt ist." },
        ]}
      />
    </BeitragSeite>
  </>
);

export default IstLeasingHaram;
