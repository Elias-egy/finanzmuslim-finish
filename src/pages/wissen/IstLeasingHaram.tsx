import Seo, { beitragJsonLd } from "@/components/Seo";
import BeitragSeite, { type BeitragAbschnitt } from "@/components/BeitragSeite";
import { IlluHandel, IlluZins } from "@/components/illu";
import { Link } from "react-router-dom";

const Bild = ({ children, text }: { children: React.ReactNode; text: string }) => (
  <figure className="my-6">
    <div className="overflow-hidden rounded-2xl">{children}</div>
    <figcaption className="mt-2 text-[14px] text-muted-foreground">{text}</figcaption>
  </figure>
);

/** Ein Pruefpunkt aus dem Vertrag, mit Ampelbewertung. */
const Punkt = ({
  nummer,
  frage,
  gut,
  schlecht,
}: {
  nummer: number;
  frage: string;
  gut: string;
  schlecht: string;
}) => (
  <div className="card-surface p-5">
    <p className="text-[17px] font-bold text-foreground">
      {nummer}. {frage}
    </p>
    <p className="mt-3 text-[16px] text-[hsl(var(--success))]">
      <strong>In Ordnung:</strong> {gut}
    </p>
    <p className="mt-2 text-[16px] text-[hsl(var(--destructive))]">
      <strong>Problem:</strong> {schlecht}
    </p>
  </div>
);

const abschnitte: BeitragAbschnitt[] = [
  {
    id: "die-antwort",
    titel: "Leasing ist Miete, und Miete ist erlaubt",
    inhalt: (
      <>
        <p>
          Leasing ist nicht grundsätzlich verboten. Im Kern ist es ein Mietvertrag: Du zahlst dafür,
          ein Auto zu nutzen, das jemand anderem gehört. Mieten ist im Islam ausdrücklich erlaubt,
          es gibt dafür sogar einen eigenen Vertragstyp, die <strong>Ijara</strong>.
        </p>
        <p className="rounded-xl bg-hero p-5 text-[19px] font-bold text-foreground">
          Die Frage ist nicht, ob du least. Die Frage ist, was im Vertrag steht.
        </p>
        <p>
          Denn die meisten Leasingverträge, die dir ein Autohaus in Deutschland vorlegt, sind keine
          reinen Mietverträge. Sie enthalten Bestandteile, die aus einer Miete etwas anderes machen.
          Fünf Punkte entscheiden, und die kannst du selbst nachlesen.
        </p>
        <Bild text="Bei einer echten Miete tauschst du Geld gegen Nutzung. Solange nur das passiert, ist der Vertrag unproblematisch.">
          <IlluHandel />
        </Bild>
      </>
    ),
  },
  {
    id: "fuenf-punkte",
    titel: "Die fünf Punkte, auf die es ankommt",
    inhalt: (
      <>
        <p>
          Nimm deinen Vertrag und geh diese fünf Punkte durch. Jeder einzelne kann die Sache kippen.
        </p>
        <div className="my-6 space-y-4">
          <Punkt
            nummer={1}
            frage="Wer trägt den Schaden, wenn das Auto untergeht?"
            gut="Der Eigentümer, also die Leasinggesellschaft. Sie besitzt das Auto, also trägt sie sein Risiko."
            schlecht="Du musst weiterzahlen, obwohl es das Auto nicht mehr gibt. Dann zahlst du für nichts, und das ist keine Miete mehr."
          />
          <Punkt
            nummer={2}
            frage="Fallen bei verspäteter Zahlung Zinsen an?"
            gut="Eine feste Mahngebühr, die sich nicht mit der Zeit vergrößert."
            schlecht="Verzugszinsen. Für viele Gelehrte ist bereits die Vereinbarung das Problem, auch wenn du immer pünktlich zahlst."
          />
          <Punkt
            nummer={3}
            frage="Musst du das Auto am Ende kaufen?"
            gut="Du gibst es zurück. Oder du darfst kaufen, musst aber nicht."
            schlecht="Eine Kaufverpflichtung. Dann war es von Anfang an ein Ratenkauf im Mietmantel."
          />
          <Punkt
            nummer={4}
            frage="Steht im Vertrag ein Zinssatz oder ein Effektivzins?"
            gut="Es steht nur die Monatsrate und die Laufzeit da."
            schlecht="Ein Zinssatz. Dann ist es eine Finanzierung, auch wenn Leasing draufsteht."
          />
          <Punkt
            nummer={5}
            frage="Wer zahlt Wartung, Steuer und Versicherung?"
            gut="Größere Reparaturen und alles, was am Eigentum hängt, trägt der Eigentümer."
            schlecht="Alles wird auf dich abgewälzt, inklusive dem, was mit deiner Nutzung nichts zu tun hat."
          />
        </div>
      </>
    ),
  },
  {
    id: "das-haeufigste",
    titel: "Der Punkt, an dem die meisten Verträge scheitern",
    inhalt: (
      <>
        <p>
          Wenn du nur eine Sache prüfst, dann diese: <strong>Punkt 1, das Risiko.</strong>
        </p>
        <p>
          In vielen deutschen Leasingverträgen steht sinngemäß, dass deine Zahlungspflicht bestehen
          bleibt, auch wenn das Fahrzeug zerstört oder gestohlen wird. Meist zusammen mit der
          Pflicht, eine Vollkaskoversicherung abzuschließen, die diesen Fall abdeckt.
        </p>
        <p>
          Genau hier hört die Miete auf. Bei einer echten Miete gilt: Ist die Sache weg, endet die
          Pflicht zu zahlen. Wer den Untergang der Sache trägt, ohne ihr Eigentümer zu sein, zahlt
          für ein Risiko, das ihm nicht gehört.
        </p>
        <p>
          Deshalb steht Leasing in unserer{" "}
          <Link to="/vorlagen/vertrags-ampel" className="text-primary hover:underline">
            Vertrags-Ampel
          </Link>{" "}
          auf Gelb und nicht auf Grün. Es hängt an einer Bedingung, und die erfüllen die wenigsten
          Verträge von selbst.
        </p>
      </>
    ),
  },
  {
    id: "restwert",
    titel: "Restwert, Schlussrate und Ballonfinanzierung",
    inhalt: (
      <>
        <p>
          Hier werden die Begriffe gern vermischt, und der Unterschied ist wichtig.
        </p>
        <p>
          <strong>Beim Restwertleasing</strong> steht am Ende ein Wert, den das Auto haben soll. Ist
          es weniger wert, zahlst du die Differenz. Das ist keine Zinsfrage, aber ein Risiko, das
          eigentlich beim Eigentümer liegt. Es ist auch der häufigste Grund für Streit am Ende der
          Laufzeit, ganz unabhängig vom Islam.
        </p>
        <p>
          <strong>Beim Kilometerleasing</strong> zahlst du für eine vereinbarte Fahrleistung und
          gibst das Auto zurück. Das ist deutlich näher an einer echten Miete und der sauberere
          Weg von beiden.
        </p>
        <p>
          <strong>Die Ballonfinanzierung</strong> ist trotz ihres Namens meist gar kein Leasing,
          sondern ein Kredit mit kleinen Raten und einer großen Schlussrate. Dort steht ein
          Zinssatz im Vertrag. Damit ist die Frage beantwortet.
        </p>
        <Bild text="Steht im Vertrag ein Zinssatz, wächst deine Schuld mit der Zeit. Dann ist es eine Finanzierung, egal was auf dem Prospekt steht.">
          <IlluZins />
        </Bild>
      </>
    ),
  },
  {
    id: "autoabo",
    titel: "Und das Autoabo?",
    inhalt: (
      <>
        <p>
          Das Autoabo ist in dieser Frage oft der klarere Fall. Du zahlst einen Monatsbetrag, darin
          sind Versicherung, Steuer und Wartung enthalten, und du kannst meist kurzfristig kündigen.
          Kein Restwert, keine Schlussrate, keine Kaufverpflichtung.
        </p>
        <p>
          Damit erfüllt es die Bedingungen einer Miete deutlich eher als ein klassischer
          Leasingvertrag. Prüfe trotzdem Punkt 1 und Punkt 2: Was passiert bei Totalschaden, und
          was passiert bei verspäteter Zahlung.
        </p>
        <p>
          Der Preis ist dafür höher. Das Autoabo ist fast immer die teuerste Art, ein Auto zu
          fahren. Wer die Wahl hat, fährt mit einem gebrauchten, bar bezahlten Auto günstiger und
          hat die ganze Frage vom Tisch.
        </p>
      </>
    ),
  },
  {
    id: "alternativen",
    titel: "Was stattdessen geht",
    inhalt: (
      <>
        <p>
          <strong>Gebraucht kaufen, bar bezahlen.</strong> Der einfachste Weg und der, den fast
          niemand hören will. Ein Auto für 8.000 Euro, das bezahlt ist, kostet dich weniger als drei
          Jahre Leasing für dasselbe Geld, und es gehört dir.
        </p>
        <p>
          <strong>Erst ansparen, dann kaufen.</strong> Wer die Leasingrate stattdessen zwei Jahre
          lang zur Seite legt, hat den Kaufpreis eines soliden Gebrauchtwagens zusammen. Der{" "}
          <Link to="/vergleich/depot" className="text-primary hover:underline">
            Weg dorthin
          </Link>{" "}
          führt nicht über ein Sparbuch, sondern über ein Depot ohne Zinsgeschäft.
        </p>
        <p>
          <strong>Kilometerleasing statt Restwertleasing</strong>, wenn es unbedingt Leasing sein
          muss. Und den Vertrag vorher an den fünf Punkten prüfen.
        </p>
        <p>
          <strong>Wenn du beruflich darauf angewiesen bist</strong> und keinen anderen Weg siehst,
          ist das eine Frage der Notlage. Darüber entscheidet niemand aus der Ferne. Sprich mit
          einem Gelehrten, dem du vertraust, und schildere ihm deine Lage genau.
        </p>
      </>
    ),
  },
];

const faq = [
  {
    frage: "Ist Auto-Leasing haram?",
    antwort:
      "Nicht grundsätzlich. Leasing ist im Kern Miete, und Miete ist erlaubt. Problematisch wird es, wenn im Vertrag Verzugszinsen stehen, wenn du auch nach einem Totalschaden weiterzahlen musst oder wenn du am Ende zum Kauf verpflichtet bist.",
  },
  {
    frage: "Was ist der Unterschied zwischen Leasing und Ijara?",
    antwort:
      "Ijara ist der islamische Mietvertrag. Der wichtigste Unterschied zum üblichen Leasing ist die Verteilung des Risikos: Bei der Ijara trägt der Eigentümer den Untergang der Sache. Bei vielen deutschen Leasingverträgen wird genau das auf den Nutzer abgewälzt.",
  },
  {
    frage: "Ist ein Autoabo halal?",
    antwort:
      "Es kommt dem näher als klassisches Leasing, weil es keine Schlussrate, keinen Restwert und keine Kaufverpflichtung gibt. Zu prüfen bleibt, was bei Totalschaden und bei Zahlungsverzug im Vertrag steht.",
  },
  {
    frage: "Die Vollkasko ist beim Leasing Pflicht. Ist das ein Problem?",
    antwort:
      "Versicherungen stehen in unserer Vertrags-Ampel auf Gelb, weil die Meinungen auseinandergehen. Wo eine Versicherung gesetzlich oder vertraglich vorgeschrieben ist, beurteilen viele Gelehrte sie milder als eine freiwillige. Die Kfz-Haftpflicht ist in Deutschland ohnehin Pflicht.",
  },
  {
    frage: "Ich habe schon einen Leasingvertrag laufen. Was jetzt?",
    antwort:
      "Prüfe die fünf Punkte. Findest du etwas, klär mit dem Anbieter, ob eine vorzeitige Rückgabe oder eine Übernahme durch jemand anderen möglich ist, und was das kostet. Wo es keinen Ausweg gibt, erfüllst du den Vertrag und vermeidest solche Klauseln beim nächsten Mal.",
  },
];

const IstLeasingHaram = () => (
  <>
    <Seo
      title="Ist Leasing haram? Die fünf Punkte im Vertrag | finanzmuslim"
      description="Leasing ist im Kern Miete und damit erlaubt. Entscheidend sind fünf Punkte im Vertrag: Risiko bei Totalschaden, Verzugszinsen, Kaufpflicht, Zinssatz und Wartung. Dazu Autoabo und Alternativen."
      path="/wissen/ist-leasing-haram"
      jsonLd={beitragJsonLd({
        titel: "Ist Leasing haram?",
        beschreibung: "Leasing ist im Kern Miete und damit erlaubt. Entscheidend sind fünf Punkte im Vertrag: Risiko bei Totalschaden, Verzugszinsen, Kaufpflicht, Zinssatz und Wartung. Dazu Autoabo und Alternativen.",
        path: "/wissen/ist-leasing-haram",
        datePublished: "16. August 2026",
        faq,
      })}
    />
    <BeitragSeite
      titel="Ist Leasing haram?"
      kurzGesagt={[
        "Leasing ist Miete, und Miete ist erlaubt. Es kommt auf den Vertrag an.",
        "Der wichtigste Punkt: Musst du nach einem Totalschaden weiterzahlen?",
        "Verzugszinsen im Vertrag sind für viele Gelehrte schon das Problem.",
        "Eine Kaufverpflichtung am Ende macht aus der Miete einen Ratenkauf.",
        "Kilometerleasing ist sauberer als Restwertleasing. Bar gekauft ist am saubersten.",
      ]}
      abschnitte={abschnitte}
      faq={faq}
      datePublished="16. August 2026"
      rechtshinweis="Dieser Beitrag gibt bekannte Positionen wieder und dient ausschließlich zu Bildungszwecken. Er ist keine Fatwa und ersetzt weder die Auskunft eines Gelehrten noch eine Rechtsberatung. Leasingverträge unterscheiden sich stark, maßgeblich ist immer dein eigener Vertrag. Innerhalb der Rechtsschulen gibt es zu einzelnen Punkten abweichende Auffassungen, besonders bei Pflichtversicherungen."
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
      <section className="card-surface p-6">
        <h2 className="text-[19px] font-bold text-foreground">Passt dazu</h2>
        <ul className="mt-3 space-y-2 text-[16px]">
          <li>
            <Link to="/wissen/ratenzahlung-haram" className="text-primary hover:underline">
              Ist Ratenzahlung haram?
            </Link>{" "}
            behandelt dieselbe Frage bei kleineren Anschaffungen.
          </li>
          <li>
            <Link to="/wissen/zinsen-im-islam" className="text-primary hover:underline">
              Zinsen im Islam
            </Link>{" "}
            erklärt, warum die Zeit der entscheidende Punkt ist.
          </li>
        </ul>
      </section>
    </BeitragSeite>
  </>
);

export default IstLeasingHaram;
