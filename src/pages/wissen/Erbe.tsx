import Seo, { beitragJsonLd } from "@/components/Seo";
import BeitragSeite, { type BeitragAbschnitt } from "@/components/BeitragSeite";
import { IlluPruefung } from "@/components/illu";
import { Link } from "react-router-dom";

const Bild = ({ children, text }: { children: React.ReactNode; text: string }) => (
  <figure className="my-6">
    <div className="overflow-hidden rounded-2xl">{children}</div>
    <figcaption className="mt-2 text-[14px] text-muted-foreground">{text}</figcaption>
  </figure>
);

const Stufe = ({
  nummer,
  titel,
  text,
}: {
  nummer: number;
  titel: string;
  text: string;
}) => (
  <div className="card-surface p-5">
    <p className="text-[17px] font-bold text-foreground">
      {nummer}. {titel}
    </p>
    <p className="mt-2 text-[16px] text-muted-foreground">{text}</p>
  </div>
);

/** Ein fester Anteil, mit der Bedingung daneben. */
const Anteil = ({
  wer,
  faelle,
}: {
  wer: string;
  faelle: { bedingung: string; anteil: string }[];
}) => (
  <div className="border-t border-border py-4">
    <p className="text-[16px] font-semibold text-foreground">{wer}</p>
    <ul className="mt-2 space-y-1">
      {faelle.map((f) => (
        <li key={f.bedingung} className="flex flex-wrap justify-between gap-2 text-[15px]">
          <span className="text-muted-foreground">{f.bedingung}</span>
          <span className="font-semibold text-foreground">{f.anteil}</span>
        </li>
      ))}
    </ul>
  </div>
);

const abschnitte: BeitragAbschnitt[] = [
  {
    id: "reihenfolge",
    titel: "Vier Stufen, bevor jemand etwas erbt",
    inhalt: (
      <>
        <p>
          Das islamische Erbrecht teilt nicht als Erstes auf. Vorher werden drei Dinge abgezogen,
          und zwar in dieser Reihenfolge.
        </p>
        <div className="my-6 space-y-4">
          <Stufe
            nummer={1}
            titel="Beerdigung"
            text="Die Kosten der Bestattung werden zuerst aus dem Nachlass gedeckt, angemessen und ohne Aufwand."
          />
          <Stufe
            nummer={2}
            titel="Schulden"
            text="Alle offenen Verbindlichkeiten werden beglichen, gegenüber Menschen wie gegenüber Gott, etwa noch offene Zakat. Erst was danach übrig ist, wird verteilt."
          />
          <Stufe
            nummer={3}
            titel="Das Vermächtnis, höchstens ein Drittel"
            text="Bis zu einem Drittel darf frei vermacht werden, etwa an eine Einrichtung oder an jemanden, der ohnehin nichts erben würde. Mehr als ein Drittel geht nicht, und an die gesetzlichen Erben darf auf diesem Weg nichts zusätzlich fließen."
          />
          <Stufe
            nummer={4}
            titel="Die festen Anteile"
            text="Erst der Rest wird nach festen Anteilen verteilt. Diese Anteile stehen weitgehend fest und sind nicht Verhandlungssache."
          />
        </div>
        <p>
          Wer diese Reihenfolge kennt, versteht schon den grössten Teil. Der Streit entsteht fast
          nie bei den Anteilen, sondern daran, dass Stufe zwei und drei übersprungen werden.
        </p>
      </>
    ),
  },
  {
    id: "anteile",
    titel: "Die häufigsten Anteile, vereinfacht",
    inhalt: (
      <>
        <p>
          Die folgende Übersicht deckt den Normalfall ab: eine Familie mit Ehepartner, Kindern und
          gegebenenfalls lebenden Eltern. Sie ist bewusst vereinfacht und ersetzt keine
          Einzelfallprüfung.
        </p>
        <div className="my-6">
          <Anteil
            wer="Ehefrau"
            faelle={[
              { bedingung: "mit Kindern", anteil: "1/8" },
              { bedingung: "ohne Kinder", anteil: "1/4" },
            ]}
          />
          <Anteil
            wer="Ehemann"
            faelle={[
              { bedingung: "mit Kindern", anteil: "1/4" },
              { bedingung: "ohne Kinder", anteil: "1/2" },
            ]}
          />
          <Anteil
            wer="Mutter"
            faelle={[
              { bedingung: "mit Kindern oder mehreren Geschwistern", anteil: "1/6" },
              { bedingung: "sonst", anteil: "1/3" },
            ]}
          />
          <Anteil
            wer="Vater"
            faelle={[
              { bedingung: "mit Kindern", anteil: "1/6" },
              { bedingung: "ohne Kinder", anteil: "1/6 und der verbleibende Rest" },
            ]}
          />
          <Anteil
            wer="Töchter, wenn es keine Söhne gibt"
            faelle={[
              { bedingung: "eine Tochter", anteil: "1/2" },
              { bedingung: "zwei oder mehr", anteil: "2/3 zu gleichen Teilen" },
            ]}
          />
          <Anteil
            wer="Söhne und Töchter zusammen"
            faelle={[
              { bedingung: "sie teilen den Rest", anteil: "Sohn doppelt so viel wie Tochter" },
            ]}
          />
        </div>
        <p>
          <strong>Warum der Sohn doppelt bekommt:</strong> Nach klassischer Lehre trägt der Mann die
          Unterhaltspflicht für Frau und Familie, die Frau nicht. Was sie erbt, gehört ihr allein und
          muss für niemanden ausgegeben werden. Der Anteil ist also an eine Pflicht gekoppelt, nicht
          an den Wert der Person. Über die Einordnung dieser Regel wird heute diskutiert, an ihrem
          Bestand ändert das nichts.
        </p>
        <p>
          Sobald der Fall nicht dem Normalfall entspricht, etwa bei Enkeln, Halbgeschwistern oder
          wenn ein Kind vor dem Erblasser verstorben ist, wird es schnell kompliziert. Dann führt
          kein Weg an jemandem vorbei, der sich damit auskennt.
        </p>
        <Bild text="Vier Stufen, dann feste Anteile. Der Streit entsteht fast immer an Stufe zwei und drei.">
          <IlluPruefung />
        </Bild>
      </>
    ),
  },
  {
    id: "deutschland",
    titel: "Warum das in Deutschland nicht von selbst gilt",
    inhalt: (
      <>
        <p>
          Der wichtigste Punkt des ganzen Beitrags: <strong>Ohne Testament gilt deutsches
          Erbrecht.</strong> Es sieht völlig andere Anteile vor als das islamische. Wer nichts
          regelt, hinterlässt eine Aufteilung, die er selbst nicht gewollt hätte.
        </p>
        <p>
          Seit 2015 richtet sich das anwendbare Erbrecht in der EU grundsätzlich nach dem
          gewöhnlichen Aufenthalt. Wer in Deutschland lebt, fällt damit unter deutsches Recht. Wer
          eine andere Staatsangehörigkeit hat, kann in einem Testament ausdrücklich das Recht seines
          Heimatstaats wählen. Das ist die sogenannte Rechtswahl.
        </p>
        <p>
          <strong>Der Pflichtteil bleibt.</strong> Auch mit Testament haben Kinder, Ehepartner und
          unter Umständen Eltern nach deutschem Recht einen Anspruch auf den Pflichtteil, also die
          Hälfte des gesetzlichen Erbteils. Dieser Anspruch lässt sich nicht einfach ausschliessen.
          Wer nach islamischen Anteilen verteilen will, muss das mitdenken, sonst wird die Aufteilung
          später angefochten.
        </p>
        <p>
          <strong>Was das praktisch heisst:</strong> Ein Testament ist keine Formalität, sondern die
          Voraussetzung dafür, dass überhaupt etwas nach islamischen Regeln laufen kann. Ein
          handschriftliches Testament muss vollständig eigenhändig geschrieben, mit Ort und Datum
          versehen und unterschrieben sein. Sicherer ist der Gang zum Notar, besonders bei
          Immobilien, Betriebsvermögen oder Kindern aus mehreren Ehen.
        </p>
        <p>
          Sinnvoll ist, beides zu holen: einen Gelehrten für die Anteile und einen Notar oder
          Fachanwalt für Erbrecht für die Form. Wer nur eines von beiden hat, bekommt entweder ein
          unwirksames Testament oder eine wirksame Aufteilung, die nicht stimmt.
        </p>
      </>
    ),
  },
  {
    id: "vorbereiten",
    titel: "Was du zu Lebzeiten regeln kannst",
    inhalt: (
      <>
        <p>
          Erben wird einfacher, wenn vorher aufgeräumt ist. Vier Dinge kosten wenig Zeit und ersparen
          den Hinterbliebenen viel.
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Eine Liste, was es überhaupt gibt.</strong> Konten, Depot, Versicherungen,
            Immobilien, offene Forderungen. Ein Depot, von dem niemand weiss, wird zum Problem.
          </li>
          <li>
            <strong>Schulden aufschreiben.</strong> Auch die privaten, die nirgends stehen. Sie
            gehören zu Stufe zwei und werden vor jeder Verteilung beglichen.
          </li>
          <li>
            <strong>Offene Zakat notieren.</strong> Sie zählt zu den Verbindlichkeiten und wird aus
            dem Nachlass beglichen, bevor verteilt wird.
          </li>
          <li>
            <strong>Das Testament an einen Ort, an dem es gefunden wird.</strong> Beim Notar oder
            beim Nachlassgericht hinterlegt, nicht in einer Schublade.
          </li>
        </ul>
        <p>
          Wie viel Zakat offen ist, rechnet der{" "}
          <Link to="/zakat-rechner" className="text-primary hover:underline">
            Zakat-Rechner
          </Link>{" "}
          aus.
        </p>
      </>
    ),
  },
];

const faq = [
  {
    frage: "Gilt islamisches Erbrecht in Deutschland automatisch?",
    antwort:
      "Nein. Ohne Testament gilt deutsches Erbrecht, wenn der gewöhnliche Aufenthalt in Deutschland liegt. Wer eine andere Staatsangehörigkeit hat, kann in einem Testament das Recht seines Heimatstaats wählen. Ohne diese Regelung greift das deutsche Recht mit ganz anderen Anteilen.",
  },
  {
    frage: "Wie viel darf ich frei vermachen?",
    antwort:
      "Höchstens ein Drittel des Nachlasses, und zwar an Personen oder Einrichtungen, die ohnehin nicht erben. An die gesetzlichen Erben darf über ein Vermächtnis nichts zusätzlich fließen. Die Reihenfolge ist: Beerdigung, Schulden, Vermächtnis, dann die festen Anteile.",
  },
  {
    frage: "Warum erbt der Sohn doppelt so viel wie die Tochter?",
    antwort:
      "Nach klassischer Lehre ist der Mann unterhaltspflichtig für Frau und Familie, die Frau nicht. Was sie erbt, gehört ihr allein und muss für niemanden ausgegeben werden. Der Anteil hängt also an einer Pflicht. Über die Einordnung dieser Regel wird heute diskutiert.",
  },
  {
    frage: "Kann ich den Pflichtteil ausschließen?",
    antwort:
      "In der Regel nicht. Kinder, Ehepartner und unter Umständen Eltern haben nach deutschem Recht einen Anspruch auf die Hälfte ihres gesetzlichen Erbteils. Ein Verzicht ist nur mit notarieller Vereinbarung zu Lebzeiten möglich. Wer nach islamischen Anteilen verteilen will, sollte das mit einem Fachanwalt besprechen.",
  },
  {
    frage: "Was passiert mit offenen Schulden und offener Zakat?",
    antwort:
      "Beides wird aus dem Nachlass beglichen, bevor irgendetwas verteilt wird. Offene Zakat zählt zu den Verbindlichkeiten. Deshalb ist es hilfreich, sie zu Lebzeiten zu notieren.",
  },
  {
    frage: "Reicht ein handschriftliches Testament?",
    antwort:
      "Es kann wirksam sein, wenn es vollständig eigenhändig geschrieben, mit Ort und Datum versehen und unterschrieben ist. Bei Immobilien, Betriebsvermögen oder Kindern aus mehreren Ehen ist der Gang zum Notar sicherer.",
  },
];

const Erbe = () => (
  <>
    <Seo
      title="Erbe nach islamischem Recht: was in Deutschland zählt | finanzmuslim"
      description="Vier Stufen vor der Verteilung, die häufigsten Anteile im Überblick und der entscheidende Punkt: Ohne Testament gilt in Deutschland deutsches Erbrecht mit ganz anderen Anteilen."
      path="/wissen/erbe"
      jsonLd={beitragJsonLd({
        titel: "Beerdigung",
        beschreibung: "Vier Stufen vor der Verteilung, die häufigsten Anteile im Überblick und der entscheidende Punkt: Ohne Testament gilt in Deutschland deutsches Erbrecht mit ganz anderen Anteilen.",
        path: "/wissen/erbe",
        datePublished: "16. August 2026",
        faq,
      })}
    />
    <BeitragSeite
      titel="Erbe nach islamischem Recht"
      kurzGesagt={[
        "Vier Stufen: Beerdigung, Schulden, Vermächtnis, dann die festen Anteile.",
        "Frei vermachen darfst du höchstens ein Drittel, und nicht an die Erben.",
        "Ohne Testament gilt in Deutschland deutsches Erbrecht, nicht das islamische.",
        "Der Pflichtteil bleibt auch mit Testament bestehen.",
        "Sinnvoll ist beides: ein Gelehrter für die Anteile, ein Notar für die Form.",
      ]}
      abschnitte={abschnitte}
      faq={faq}
      datePublished="16. August 2026"
      rechtshinweis="Dieser Beitrag ist eine stark vereinfachte Übersicht zu Bildungszwecken. Er ist weder Rechtsberatung noch Fatwa und ersetzt weder einen Fachanwalt für Erbrecht oder einen Notar noch einen Gelehrten. Die genannten Anteile gelten für einfache Standardfälle; bei Enkeln, Halbgeschwistern, vorverstorbenen Kindern, mehreren Ehen oder Auslandsvermögen gelten abweichende Regeln. Zwischen den Rechtsschulen bestehen Unterschiede. Angaben zum deutschen Recht und zur Rechtswahl beruhen auf dem Stand August 2026 und können sich ändern."
      boxOben={{
        kategorie: "Rechner",
        ueberschrift: "Offene Zakat vor dem Erbfall ausrechnen",
        linkZiel: "/zakat-rechner",
        text: "Zwei Felder, Ergebnis als ganzer Satz.",
        knopf: "Zum Zakat-Rechner",
      }}
      boxMitte={{
        kategorie: "Vorlage",
        ueberschrift: "Zwölf Verträge, grün, gelb oder rot einsortiert",
        linkZiel: "/vorlagen/vertrags-ampel",
        text: "Grün, gelb oder rot für zwölf Verträge aus dem Alltag.",
        knopf: "Zur Vertrags-Ampel",
      }}
    >
      <section className="card-surface p-6">
        <h2 className="text-[19px] font-bold text-foreground">Passt dazu</h2>
        <ul className="mt-3 space-y-2 text-[16px]">
          <li>
            <Link to="/wissen/nisab" className="text-primary hover:underline">
              Nisab
            </Link>{" "}
            sagt dir, ab wann Zakat überhaupt fällig wird.
          </li>
          <li>
            <Link to="/wissen/ertraege-reinigen" className="text-primary hover:underline">
              Erträge reinigen
            </Link>{" "}
            gehört zu den Dingen, die man zu Lebzeiten erledigt.
          </li>
          <li>
            <Link to="/wissen/ist-versicherung-haram" className="text-primary hover:underline">
              Ist eine Versicherung haram?
            </Link>{" "}
            behandelt die Frage nach der Absicherung der Familie.
          </li>
        </ul>
      </section>
    </BeitragSeite>
  </>
);

export default Erbe;
