import Seo, { beitragJsonLd } from "@/components/Seo";
import BeitragSeite, { type BeitragAbschnitt } from "@/components/BeitragSeite";
import { IlluPruefung, IlluZins } from "@/components/illu";
import { Link } from "react-router-dom";

const Bild = ({ children, text }: { children: React.ReactNode; text: string }) => (
  <figure className="my-6">
    <div className="overflow-hidden rounded-2xl">{children}</div>
    <figcaption className="mt-2 text-[14px] text-muted-foreground">{text}</figcaption>
  </figure>
);

const Schritt = ({
  nummer,
  titel,
  text,
}: {
  nummer: number;
  titel: string;
  text: React.ReactNode;
}) => (
  <div className="card-surface p-5">
    <p className="text-[17px] font-bold text-foreground">
      {nummer}. {titel}
    </p>
    <p className="mt-2 text-[16px] text-muted-foreground">{text}</p>
  </div>
);

const abschnitte: BeitragAbschnitt[] = [
  {
    id: "warum",
    titel: "Warum auch geprüfte Anlagen etwas übrig lassen",
    inhalt: (
      <>
        <p>
          Ein Shariah-Screening wirft alles raus, was hauptsächlich mit Verbotenem Geld verdient.
          Vollständig sauber wird eine Firma dadurch nicht.
        </p>
        <p>
          Ein Beispiel. Ein Maschinenbauer stellt Maschinen her, das ist unstrittig. Er hat aber
          Geld auf einem verzinsten Firmenkonto liegen und bekommt dafür Zinsen. Das sind vielleicht
          ein halbes Prozent seines Gewinns. Für das Screening ist die Firma damit weiterhin in
          Ordnung, denn die Grenzwerte lassen einen kleinen Anteil zu.
        </p>
        <p className="rounded-xl bg-hero p-5 text-[19px] font-bold text-foreground">
          Der kleine erlaubte Rest bleibt trotzdem unrein. Er wird ausgerechnet und weitergegeben.
        </p>
        <p>
          Genau das ist Reinigung, auf Arabisch Tathir. Sie ersetzt die Zakat nicht und sie ist auch
          keine Spende im üblichen Sinn. Sie ist das Aussortieren eines Anteils, der dir nie
          zustand.
        </p>
        <Bild text="Das Screening lässt einen kleinen Anteil zu. Die Reinigung holt ihn wieder heraus.">
          <IlluPruefung />
        </Bild>
      </>
    ),
  },
  {
    id: "wie-viel",
    titel: "Wie viel es ist",
    inhalt: (
      <>
        <p>
          Die Zahl kommt nicht von dir, sie kommt vom Anbieter. Viele Islamic-Fonds veröffentlichen
          einmal im Jahr einen Reinigungssatz, meist als Betrag je Anteil oder als Prozentsatz der
          Ausschüttung. Er steht im Jahresbericht oder auf der Produktseite, oft unter
          Purification oder Dividend Cleansing.
        </p>
        <p>
          <strong>Wenn nichts veröffentlicht wird:</strong> Dann bleibt nur eine vorsichtige
          Schätzung. Verbreitet ist, den maximal zulässigen Anteil aus dem Screening anzusetzen,
          also fünf Prozent der Erträge. Das liegt fast immer über dem tatsächlichen Wert, und zu
          viel abzugeben ist der kleinere Fehler.
        </p>
        <p>
          Bei Gold, Silber und Sukuk stellt sich die Frage in der Regel nicht. Dort gibt es keine
          Firmengewinne, aus denen ein unreiner Anteil stammen könnte.
        </p>
      </>
    ),
  },
  {
    id: "rechnen",
    titel: "So rechnest du es aus",
    inhalt: (
      <>
        <p>Drei Schritte, einmal im Jahr, mit dem Jahresbericht vor dir.</p>
        <div className="my-6 space-y-4">
          <Schritt
            nummer={1}
            titel="Den Satz heraussuchen"
            text="Im Jahresbericht des Fonds oder auf der Produktseite. Steht dort nichts, setz fünf Prozent an."
          />
          <Schritt
            nummer={2}
            titel="Auf deine Erträge anwenden"
            text={
              <>
                Bei einem ausschüttenden Fonds auf die Ausschüttung, die du bekommen hast. Bei einem
                thesaurierenden Fonds gibt es keine Auszahlung, der Ertrag steckt im Kurs. Dort wird
                üblicherweise der Betrag je Anteil genommen, den der Anbieter ausweist, mal der
                Anzahl deiner Anteile.
              </>
            }
          />
          <Schritt
            nummer={3}
            titel="Weitergeben und notieren"
            text="Den Betrag abgeben, ohne dafür eine Belohnung zu erwarten, und aufschreiben. Die Notiz hilft im nächsten Jahr und bei der Zakat."
          />
        </div>
        <div className="rounded-2xl bg-accent p-5 md:p-6">
          <p className="text-[17px] font-bold text-foreground">Ein Beispiel</p>
          <p className="mt-2 text-[15px] leading-[24px] text-muted-foreground">
            Angenommen, du hast 300 Euro Ausschüttung bekommen und der Anbieter weist 1,2 Prozent
            als unreinen Anteil aus.
          </p>
          <p className="mt-3 text-[15px] font-semibold text-foreground">
            300 € × 1,2 % = 3,60 €
          </p>
          <p className="mt-2 text-[15px] leading-[24px] text-muted-foreground">
            Diese 3,60 Euro gibst du weiter. Der Rest gehört dir. Die Zahlen sind erfunden, das
            Vorgehen nicht.
          </p>
        </div>
      </>
    ),
  },
  {
    id: "wohin",
    titel: "Wohin der Betrag geht",
    inhalt: (
      <>
        <p>
          Der Grundsatz ist einfach: Der Betrag soll jemandem nützen, und du sollst nichts davon
          haben, weder Geld noch Lohn.
        </p>
        <p>
          <strong>Üblich ist</strong> die Weitergabe an Bedürftige oder an eine Einrichtung, die
          Bedürftigen hilft. Wichtig ist die Absicht: Es ist keine Sadaqa, für die du eine Belohnung
          erwartest, sondern die Rückgabe von etwas, das dir nicht zusteht.
        </p>
        <p>
          <strong>Nicht angerechnet wird sie auf die Zakat.</strong> Beides sind verschiedene Dinge
          und werden getrennt gerechnet. Was du reinigst, zählt nicht als Zakat, und umgekehrt.
        </p>
        <p>
          <strong>Umstritten ist</strong>, wofür genau der Betrag verwendet werden darf. Manche
          Gelehrte schließen den Bau von Moscheen und den Druck von Korankopien aus, weil unreines
          Geld dafür nicht verwendet werden solle. Andere sehen das weiter. Wer es genau wissen
          will, fragt jemanden, dem er vertraut.
        </p>
        <p>
          Ein Punkt, über den Einigkeit besteht: Der Betrag wird nicht von der Steuer abgesetzt und
          nicht mit einer Spendenquittung verrechnet, wenn man dadurch einen Vorteil hätte.
        </p>
      </>
    ),
  },
  {
    id: "wann",
    titel: "Wann du es machst",
    inhalt: (
      <>
        <p>
          Einmal im Jahr reicht. Der praktischste Termin ist der Tag, an dem du ohnehin deine Zakat
          ausrechnest. Dann liegen die Zahlen schon auf dem Tisch, und du vergisst es nicht.
        </p>
        <p>
          Wie viel Zakat dazukommt, rechnet der{" "}
          <Link to="/zakat-rechner" className="text-primary hover:underline">
            Zakat-Rechner
          </Link>{" "}
          aus. Ab welchem Vermögen sie überhaupt fällig wird, steht im Beitrag zum{" "}
          <Link to="/wissen/nisab" className="text-primary hover:underline">
            Nisab
          </Link>
          .
        </p>
        <p>
          Und wenn du in den vergangenen Jahren nicht gereinigt hast: nachholen, so gut es geht.
          Eine grobe Schätzung ist besser als gar nichts, und niemand verlangt Buchhaltung über
          zehn Jahre.
        </p>
        <Bild text="Einmal im Jahr, am selben Tag wie die Zakat. Dann liegen die Zahlen ohnehin vor.">
          <IlluZins />
        </Bild>
      </>
    ),
  },
];

const faq = [
  {
    frage: "Was bedeutet Erträge reinigen?",
    antwort:
      "Auch geprüfte Firmen haben kleine Erträge aus Zinsen oder aus Nebengeschäften, die nicht erlaubt sind. Der darauf entfallende Anteil deiner Erträge wird ausgerechnet und weitergegeben, ohne dafür eine Belohnung zu erwarten. Auf Arabisch heißt das Tathir.",
  },
  {
    frage: "Wie viel Prozent muss ich reinigen?",
    antwort:
      "Das hängt vom Fonds ab. Viele Anbieter veröffentlichen einmal jährlich einen Reinigungssatz, oft im niedrigen einstelligen Prozentbereich. Fehlt die Angabe, wird verbreitet der maximal zulässige Anteil aus dem Screening angesetzt, also fünf Prozent der Erträge.",
  },
  {
    frage: "Muss ich bei einem thesaurierenden Fonds auch reinigen?",
    antwort:
      "Nach verbreiteter Auffassung ja. Es gibt zwar keine Auszahlung, der Ertrag steckt aber im Kurs. Üblich ist, den vom Anbieter ausgewiesenen Betrag je Anteil mit der Zahl deiner Anteile zu multiplizieren.",
  },
  {
    frage: "Zählt die Reinigung als Zakat oder als Sadaqa?",
    antwort:
      "Weder noch. Zakat ist eine eigene Pflicht und wird getrennt gerechnet. Sadaqa ist eine freiwillige Gabe, für die du Lohn erwartest. Bei der Reinigung gibst du etwas zurück, das dir nie zustand, und erwartest dafür nichts.",
  },
  {
    frage: "Muss ich bei Gold oder Sukuk reinigen?",
    antwort:
      "In der Regel nicht. Bei physisch hinterlegtem Gold und Silber gibt es keine Firmengewinne, aus denen ein unreiner Anteil stammen könnte. Bei Sukuk kommt der Ertrag aus der Nutzung eines realen Vermögenswerts.",
  },
  {
    frage: "Was ist, wenn ich jahrelang nicht gereinigt habe?",
    antwort:
      "Nachholen, so gut es geht. Eine grobe Schätzung über die vergangenen Jahre ist besser als gar nichts. Niemand verlangt eine lückenlose Buchhaltung rückwirkend.",
  },
];

const ErtraegeReinigen = () => (
  <>
    <Seo
      title="Erträge reinigen: wie viel und wohin | finanzmuslim"
      description="Auch geprüfte Fonds lassen einen kleinen unreinen Anteil übrig. Wo du den Reinigungssatz findest, wie du ihn ausrechnest, wohin der Betrag geht und warum er nicht als Zakat zählt."
      path="/wissen/ertraege-reinigen"
      jsonLd={beitragJsonLd({
        titel: "Den Satz heraussuchen",
        beschreibung: "Auch geprüfte Fonds lassen einen kleinen unreinen Anteil übrig. Wo du den Reinigungssatz findest, wie du ihn ausrechnest, wohin der Betrag geht und warum er nicht als Zakat zählt.",
        path: "/wissen/ertraege-reinigen",
        geprueftAm: "16. August 2026",
        faq,
      })}
    />
    <BeitragSeite
      titel="Erträge reinigen"
      kurzGesagt={[
        "Auch geprüfte Firmen haben einen kleinen unreinen Ertragsanteil.",
        "Den Satz veröffentlicht der Anbieter, sonst rechnet man mit fünf Prozent.",
        "Der Betrag geht an Bedürftige, ohne dafür einen Lohn zu erwarten.",
        "Er zählt weder als Zakat noch als gewöhnliche Sadaqa.",
        "Einmal im Jahr, am besten am selben Tag wie die Zakat.",
      ]}
      abschnitte={abschnitte}
      faq={faq}
      geprueftAm="16. August 2026"
      rechtshinweis="Dieser Beitrag gibt bekannte Positionen wieder und dient ausschließlich zu Bildungszwecken. Er ist keine Fatwa und keine Steuer- oder Anlageberatung. Zur Höhe des Reinigungssatzes, zur Behandlung thesaurierender Fonds und zur zulässigen Verwendung des Betrags bestehen zwischen Gelehrten unterschiedliche Auffassungen. Die Zahlen im Beispiel sind erfunden und dienen nur der Veranschaulichung."
      boxOben={{
        kategorie: "Rechner",
        ueberschrift: "Zakat in zwei Minuten ausrechnen",
        linkZiel: "/zakat-rechner",
        text: "Zwei Felder, Ergebnis als ganzer Satz.",
        knopf: "Zum Zakat-Rechner",
      }}
      boxMitte={{
        kategorie: "Anlagen",
        ueberschrift: "Geprüfte Anlagen mit Kosten und Prüfstelle",
        linkZiel: "/halal-anlagen",
        text: "27 Anlagen mit Kosten, Größe und Prüfstelle.",
        knopf: "Zu den Anlagen",
      }}
    >
      <section className="card-surface p-6">
        <h2 className="text-[19px] font-bold text-foreground">Passt dazu</h2>
        <ul className="mt-3 space-y-2 text-[16px]">
          <li>
            <Link to="/wissen/halal-etfs" className="text-primary hover:underline">
              Halal ETFs
            </Link>{" "}
            erklärt, welche Anbieter den Reinigungssatz überhaupt ausweisen.
          </li>
          <li>
            <Link to="/wissen/sind-aktien-halal" className="text-primary hover:underline">
              Sind Aktien halal?
            </Link>{" "}
            zeigt die Grenzwerte, aus denen der unreine Rest entsteht.
          </li>
          <li>
            <Link to="/wissen/nisab" className="text-primary hover:underline">
              Nisab
            </Link>{" "}
            sagt dir, ab wann Zakat fällig wird.
          </li>
        </ul>
      </section>
    </BeitragSeite>
  </>
);

export default ErtraegeReinigen;
