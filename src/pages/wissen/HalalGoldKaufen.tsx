import Seo, { beitragJsonLd } from "@/components/Seo";
import BeitragSeite, { type BeitragAbschnitt } from "@/components/BeitragSeite";
import { IlluGold, IlluHandel } from "@/components/illu";
import { Link } from "react-router-dom";

const Bild = ({ children, text }: { children: React.ReactNode; text: string }) => (
  <figure className="my-6">
    <div className="overflow-hidden rounded-2xl">{children}</div>
    <figcaption className="mt-2 text-[14px] text-muted-foreground">{text}</figcaption>
  </figure>
);

/** Eine Kaufart mit Urteil. Gruen, gelb und rot sind hier Bewertungen, deshalb erlaubt. */
const Art = ({
  titel,
  was,
  urteil,
  ton,
}: {
  titel: string;
  was: string;
  urteil: string;
  ton: "ok" | "strittig" | "kritisch";
}) => (
  <div className="card-surface p-5">
    <p className="text-[17px] font-bold text-foreground">{titel}</p>
    <p className="mt-2 text-[16px] text-muted-foreground">{was}</p>
    <p
      className={`mt-3 text-[16px] font-semibold ${
        ton === "ok"
          ? "text-[hsl(var(--success))]"
          : ton === "strittig"
            ? "text-[hsl(var(--warning))]"
            : "text-[hsl(var(--destructive))]"
      }`}
    >
      {urteil}
    </p>
  </div>
);

const abschnitte: BeitragAbschnitt[] = [
  {
    id: "die-regel",
    titel: "Bei Gold gilt eine Regel, die es sonst nirgends gibt",
    inhalt: (
      <>
        <p>
          Gold darfst du kaufen. Daran zweifelt niemand. Es gibt aber eine Bedingung, die es beim
          Sofa oder beim Auto nicht gibt, und an ihr scheitern die meisten Angebote.
        </p>
        <p className="rounded-xl bg-hero p-5 text-[19px] font-bold text-foreground">
          Geld und Gold müssen im selben Moment den Besitzer wechseln.
        </p>
        <p>
          Du zahlst, du bekommst das Gold. Nicht in vier Wochen, nicht auf Raten, nicht als
          Versprechen auf später. Der Grund liegt in einem bekannten Hadith, in dem Gold, Silber und
          einige Grundnahrungsmittel eigens genannt werden. Für diese Waren gilt: Tausch nur sofort
          und in gleicher Menge.
        </p>
        <p>
          Daraus folgt fast alles Weitere. Gold auf Raten fällt weg. Gold, das dir jemand erst in
          drei Monaten liefert, fällt weg. Und Papier, hinter dem gar kein Gold liegt, fällt
          sowieso weg.
        </p>
        <Bild text="Hinter dem Anteil, den du kaufst, muss echtes Metall liegen. Sonst kaufst du eine Wette auf den Goldpreis, kein Gold.">
          <IlluGold />
        </Bild>
      </>
    ),
  },
  {
    id: "die-wege",
    titel: "Die fünf Wege, Gold zu kaufen",
    inhalt: (
      <>
        <p>
          Es gibt in Deutschland im Wesentlichen fünf Möglichkeiten. Sie unterscheiden sich stark,
          und zwar genau an der Frage von eben.
        </p>
        <div className="my-6 grid gap-4 md:grid-cols-2">
          <Art
            titel="Barren oder Münzen beim Händler"
            was="Du bezahlst und nimmst das Gold mit."
            urteil="Der klarste Weg, unstrittig"
            ton="ok"
          />
          <Art
            titel="Gold-ETC mit echtem Metall"
            was="Ein Wertpapier, hinter dem nummerierte Barren im Tresor liegen."
            urteil="Verbreitet akzeptiert, wenn zertifiziert"
            ton="strittig"
          />
          <Art
            titel="Goldsparplan mit späterer Lieferung"
            was="Du zahlst monatlich, das Gold kommt irgendwann."
            urteil="Problematisch, weil Zahlung und Ware auseinanderfallen"
            ton="kritisch"
          />
          <Art
            titel="Gold-Zertifikate und CFDs"
            was="Eine Wette auf den Preis, ohne Metall dahinter."
            urteil="Fällt weg"
            ton="kritisch"
          />
        </div>
        <p>
          Der fünfte Weg ist der Goldschmuck. Er ist erlaubt, aber als Geldanlage der teuerste, weil
          du die Verarbeitung mitbezahlst und beim Verkauf meist nur den Materialwert bekommst.
        </p>
      </>
    ),
  },
  {
    id: "etc",
    titel: "Der Streitpunkt: Gold als Wertpapier",
    inhalt: (
      <>
        <p>
          Ein Gold-ETC ist ein Wertpapier, das du im Depot kaufst wie eine Aktie. Hinter den guten
          liegt echtes Metall, eingelagert in einem Tresor, jeder Barren mit Nummer und in Listen
          erfasst. Das nennt man <strong>physisch besichert</strong>, es heißt schlicht: Das Gold
          liegt wirklich da.
        </p>
        <p>
          <strong>Was dafür spricht.</strong> Du bekommst tatsächlich Gold zugeordnet, es ist
          getrennt vom Vermögen des Anbieters, und viele dieser Produkte haben ein
          Sharia-Zertifikat. Der{" "}
          <Link to="/halal-anlagen" className="text-primary hover:underline">
            Invesco Physical Gold ETC
          </Link>{" "}
          zum Beispiel hat ein Zertifikat von Amanie Advisors, die WisdomTree-Produkte eines vom
          Al-Qalam-Gremium.
        </p>
        <p>
          <strong>Was dagegen spricht.</strong> Du hältst das Gold nicht in der Hand. Zwischen dir
          und dem Barren stehen ein Anbieter, eine Verwahrstelle und ein Depot. Ein Teil der
          Gelehrten sagt deshalb: Das erfüllt die Bedingung der sofortigen Übergabe nicht wirklich.
        </p>
        <p>
          <strong>Woran du dich halten kannst.</strong> Wenn du dich für ein Wertpapier entscheidest,
          achte auf drei Dinge: Es muss echtes Metall dahinterliegen und nicht nur ein Versprechen.
          Das Gold muss dir zugeordnet sein und nicht nur der Menge nach vorhanden. Und es sollte
          ein Sharia-Zertifikat geben, das du selbst lesen kannst.
        </p>
        <p>
          In unserer{" "}
          <Link to="/halal-anlagen" className="text-primary hover:underline">
            Anlagen-Datenbank
          </Link>{" "}
          steht bei jedem Produkt, ob ein Nachweis vorliegt und von wem. Wo keiner vorliegt, steht
          das ausdrücklich dabei.
        </p>
      </>
    ),
  },
  {
    id: "was-nicht-geht",
    titel: "Was klar wegfällt",
    inhalt: (
      <>
        <p>
          Bei diesen Punkten gibt es kaum Streit, sie fallen für die allermeisten Gelehrten weg:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Gold auf Raten oder auf Kredit.</strong> Verstößt gegen die Bedingung der
            sofortigen Übergabe, und beim Kredit kommt der Zins dazu.
          </li>
          <li>
            <strong>Gold-CFDs, Hebelprodukte, Futures.</strong> Hier wird auf den Preis gewettet,
            gekauft wird nichts.
          </li>
          <li>
            <strong>Gold verleihen gegen Ertrag.</strong> Ein festes Entgelt dafür, dass jemand dein
            Gold nutzt, ist derselbe Fall wie Zins.
          </li>
          <li>
            <strong>Unbesichertes Papiergold.</strong> Wenn im Verkaufsprospekt steht, dass der
            Anbieter den Preis nur nachbildet, liegt kein Metall dahinter.
          </li>
        </ul>
        <Bild text="Beim Kauf wechseln Ware und Geld die Seite. Beim Wetten auf den Preis wechselt gar nichts, außer der Zahl auf dem Bildschirm.">
          <IlluHandel />
        </Bild>
      </>
    ),
  },
  {
    id: "praktisch",
    titel: "Wenn du echtes Gold kaufst, praktisch",
    inhalt: (
      <>
        <p>
          <strong>Barren oder Münze?</strong> Barren sind pro Gramm günstiger, Münzen leichter in
          kleinen Mengen zu verkaufen. Für den Anfang sind 10 bis 50 Gramm eine übliche Größe. Sehr
          kleine Einheiten kosten anteilig deutlich mehr Aufschlag.
        </p>
        <p>
          <strong>Achte auf den Aufschlag.</strong> Kein Händler verkauft zum reinen Goldpreis. Der
          Unterschied zwischen Ankaufs- und Verkaufspreis ist dein tatsächlicher Verlust am ersten
          Tag. Frag immer beides ab, bevor du kaufst.
        </p>
        <p>
          <strong>Nimm es gleich mit oder lass es dir liefern.</strong> Was du nicht bekommst, hast
          du nicht gekauft. Ein Lagerschein bei einem Händler, der dir das Gold nur zusagt, ist
          etwas anderes als Gold.
        </p>
        <p>
          <strong>Steuer, damit es vollständig ist.</strong> Anlagegold ist beim Kauf von der
          Umsatzsteuer befreit. Verkaufst du es nach mehr als einem Jahr wieder, ist der Gewinn
          nach derzeitiger Rechtslage steuerfrei. Das ist keine Steuerberatung, es steht hier, weil
          es beim Vergleich mit anderen Anlagen eine Rolle spielt.
        </p>
      </>
    ),
  },
  {
    id: "zakat",
    titel: "Zakat auf Gold, das wird am häufigsten gefragt",
    inhalt: (
      <>
        <p>
          Gold zählt zum Vermögen, auf das Zakat fällig wird, sobald du über dem Nisab liegst und
          es ein Mondjahr in deinem Besitz war. Der Nisab ist die Grenze, ab der überhaupt Zakat
          anfällt.
        </p>
        <p>
          Die verbreiteten Werte sind <strong>85 Gramm Gold</strong> oder{" "}
          <strong>595 Gramm Silber</strong>. Welche der beiden Grenzen man anlegt, wird
          unterschiedlich gehandhabt. Die Silbergrenze liegt in Euro niedriger, dadurch werden mehr
          Menschen zakatpflichtig, und viele Gelehrte empfehlen sie aus genau diesem Grund.
        </p>
        <p>
          Der Satz beträgt <strong>2,5 Prozent</strong> auf den Wert, nicht auf den Gewinn.
        </p>
        <p>
          Umstritten ist der Schmuck, den eine Frau regelmäßig trägt. Ein Teil der Gelehrten nimmt
          ihn aus, ein anderer nicht. Wer sichergehen will, rechnet ihn mit.
        </p>
      </>
    ),
  },
];

const faq = [
  {
    frage: "Ist Gold kaufen halal?",
    antwort:
      "Ja, mit einer Bedingung: Zahlung und Übergabe müssen zusammenfallen. Du bezahlst und bekommst das Gold. Gold auf Raten, Gold mit späterer Lieferung und Wetten auf den Goldpreis erfüllen das nicht.",
  },
  {
    frage: "Ist ein Gold-ETF oder Gold-ETC halal?",
    antwort:
      "Darüber gehen die Meinungen auseinander. Produkte, hinter denen nummerierte Barren im Tresor liegen und die ein Sharia-Zertifikat haben, werden verbreitet akzeptiert. Ein Teil der Gelehrten sagt, ohne Gold in der Hand sei die Bedingung der sofortigen Übergabe nicht erfüllt. Unstrittig ausgeschlossen sind Produkte ohne echtes Metall dahinter.",
  },
  {
    frage: "Darf ich Gold auf Raten kaufen?",
    antwort:
      "Nein. Bei Gold müssen Zahlung und Übergabe zusammenfallen. Das ist einer der wenigen Punkte, bei denen es kaum abweichende Auffassungen gibt.",
  },
  {
    frage: "Ist ein Goldsparplan erlaubt?",
    antwort:
      "Es kommt darauf an, was genau passiert. Wird für deine Einzahlung sofort Gold gekauft und dir zugeordnet, ist die Bedingung erfüllt. Sammelt der Anbieter erst an und kauft später, fallen Zahlung und Ware auseinander. Das steht in den Bedingungen und muss vorher geklärt werden.",
  },
  {
    frage: "Wie viel Gold sollte man haben?",
    antwort:
      "Dazu geben wir keine Empfehlung ab, das wäre Anlageberatung. Was sich sagen lässt: Gold wirft nichts ab, es zahlt keine Miete und keinen Gewinn. Es ist ein Wertspeicher, kein Einkommen.",
  },
];

const HalalGoldKaufen = () => (
  <>
    <Seo
      title="Halal Gold kaufen: Die eine Bedingung, die zählt | finanzmuslim"
      description="Gold kaufen ist erlaubt, wenn Zahlung und Übergabe zusammenfallen. Was das für Barren, Münzen, Gold-ETC und Goldsparpläne bedeutet, und wie Zakat auf Gold berechnet wird."
      path="/wissen/halal-gold-kaufen"
      jsonLd={beitragJsonLd({
        titel: "Barren oder Münzen beim Händler",
        beschreibung: "Gold kaufen ist erlaubt, wenn Zahlung und Übergabe zusammenfallen. Was das für Barren, Münzen, Gold-ETC und Goldsparpläne bedeutet, und wie Zakat auf Gold berechnet wird.",
        path: "/wissen/halal-gold-kaufen",
        geprueftAm: "16. August 2026",
        faq,
      })}
    />
    <BeitragSeite
      titel="Halal Gold kaufen"
      kurzGesagt={[
        "Gold kaufen ist erlaubt. Die Bedingung: Zahlung und Übergabe fallen zusammen.",
        "Barren oder Münzen bar kaufen und mitnehmen ist der klarste Weg.",
        "Gold auf Raten oder mit späterer Lieferung erfüllt die Bedingung nicht.",
        "Bei Gold-ETC gehen die Meinungen auseinander. Es muss echtes Metall dahinterliegen.",
        "Zakat auf Gold: 2,5 Prozent, sobald du über dem Nisab liegst.",
      ]}
      abschnitte={abschnitte}
      faq={faq}
      geprueftAm="16. August 2026"
      rechtshinweis="Dieser Beitrag gibt bekannte Positionen wieder und dient ausschließlich zu Bildungszwecken. Er ist keine Fatwa und ersetzt weder die Auskunft eines Gelehrten noch eine Steuer- oder Anlageberatung. Genannte Produkte sind Beispiele und keine Empfehlung. Innerhalb der Rechtsschulen gibt es zu einzelnen Punkten abweichende Auffassungen, besonders bei Gold als Wertpapier und beim getragenen Schmuck."
      boxOben={{
        kategorie: "Anlagen",
        ueberschrift: "Welche Gold-Produkte einen Nachweis haben",
        linkZiel: "/halal-anlagen",
        text: "26 Anlagen mit Kosten, Größe und Prüfstelle.",
        knopf: "Zu den Anlagen",
      }}
      boxMitte={{
        kategorie: "Depot",
        ueberschrift: "Wo du Gold-ETC ohne Zinsgeschäft kaufst",
        linkZiel: "/vergleich/depot",
      }}
    >
      <section className="card-surface p-6">
        <h2 className="text-[19px] font-bold text-foreground">Passt dazu</h2>
        <ul className="mt-3 space-y-2 text-[16px]">
          <li>
            <Link to="/zakat-rechner" className="text-primary hover:underline">
              Der Zakat-Rechner
            </Link>{" "}
            rechnet Gold, Silber und Ersparnisse zusammen und zeigt dir den Nisab.
          </li>
          <li>
            <Link to="/wissen/zinsen-im-islam" className="text-primary hover:underline">
              Zinsen im Islam
            </Link>{" "}
            erklärt, warum die Zeit der entscheidende Punkt ist.
          </li>
          <li>
            <Link to="/vorlagen/vertrags-ampel" className="text-primary hover:underline">
              Die Vertrags-Ampel
            </Link>{" "}
            ordnet zwölf Verträge ein, die fast jeder hat.
          </li>
        </ul>
      </section>
    </BeitragSeite>
  </>
);

export default HalalGoldKaufen;
