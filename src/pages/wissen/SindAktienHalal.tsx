import { Link } from "react-router-dom";
import Seo from "@/components/Seo";
import BeitragIllu from "@/components/BeitragIllu";
import { IlluDepot, IlluHandel, IlluPruefung } from "@/components/illu";
import BeitragSeite, { type BeitragAbschnitt, type BeitragFrage } from "@/components/BeitragSeite";

const grenzwerte = [
  {
    frage: "Womit verdient die Firma ihr Geld?",
    text: "Umsatz aus Alkohol, Tabak, Glücksspiel, Zinsgeschäft, Waffen oder Pornografie.",
    wert: "höchstens 5 %",
  },
  {
    frage: "Wie stark ist sie verschuldet?",
    text: "Gemeint sind ausdrücklich verzinsliche Schulden. Eine Firma, die überwiegend auf Zinskrediten läuft, wird über den Umweg deiner Beteiligung zu einem Zinsgeschäft.",
    wert: "höchstens 30 %",
  },
  {
    frage: "Wie viel liegt zinsbringend herum?",
    text: "Zinstragende Wertpapiere und verzinste Guthaben in der Bilanz. Auch eine saubere Firma kann durch ihre Geldanlage durchfallen.",
    wert: "höchstens 30 %",
  },
];

const abschnitte: BeitragAbschnitt[] = [
  {
    id: "warum-erlaubt",
    titel: "Warum Aktien überhaupt erlaubt sind",
    inhalt: (
      <>
        <p>
          Wer eine Aktie kauft, leiht kein Geld gegen Zins, sondern wird{" "}
          <span className="font-semibold text-foreground">Miteigentümer an einer echten Firma</span> mit echten
          Maschinen, Mitarbeitern und Produkten. Gewinn und Verlust trägt man mit.
        </p>
        <p>
          Genau das ist der Unterschied zum Zinsgeschäft, bei dem einer sicher gewinnt. Deshalb ist der
          Aktienkauf im Grundsatz zulässig. Die Frage ist nie, ob Aktien erlaubt sind, sondern welche.
        </p>
        <BeitragIllu unterschrift="Bei einer Aktie tauschst du Geld gegen einen echten Anteil an einer Firma. Beide Seiten tragen das Risiko.">
          <IlluHandel />
        </BeitragIllu>
      </>
    ),
  },
  {
    id: "geschaeft",
    titel: "Die erste Frage: Womit verdient die Firma ihr Geld?",
    inhalt: (
      <>
        <p>
          Das ist der einfachste Teil und sortiert die meisten Fälle sofort. Eine Brauerei, ein Wettanbieter
          oder eine Zinsbank fallen durch, ohne dass man eine Bilanz braucht.
        </p>
        <p>
          Schwieriger sind <span className="font-semibold text-foreground">Mischfälle</span>, etwa ein
          Supermarkt, der auch Alkohol verkauft, oder ein Hotelkonzern mit Bars. Für solche Fälle gilt eine
          Grenze: Der Umsatz aus unerlaubten Bereichen darf einen kleinen Rest nicht überschreiten,
          üblicherweise fünf Prozent.
        </p>
      </>
    ),
  },
  {
    id: "grenzwerte",
    titel: "Die drei Grenzwerte",
    inhalt: (
      <>
        <p>
          So prüft der AAOIFI-Standard, an dem sich fast alle Prüfwerkzeuge orientieren. Reißt eine Firma nur
          eine dieser Grenzen, fällt sie durch.
        </p>
        <div className="space-y-4">
          {grenzwerte.map((g, i) => (
            <div key={g.frage} className="card-surface flex flex-col gap-4 p-6 sm:flex-row sm:items-start">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-[15px] font-bold text-foreground">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="text-[17px] font-bold text-foreground">{g.frage}</h3>
                <p className="mt-2 text-[16px] leading-relaxed text-muted-foreground">{g.text}</p>
              </div>
              <span className="shrink-0 text-[20px] font-bold text-foreground sm:text-right">{g.wert}</span>
            </div>
          ))}
        </div>
        <BeitragIllu unterschrift="Alle drei Werte müssen unter der Grenze liegen. Einer reicht zum Durchfallen.">
          <IlluPruefung />
        </BeitragIllu>
      </>
    ),
  },
  {
    id: "widerspruch",
    titel: "Warum zwei Apps zur selben Aktie Verschiedenes sagen",
    inhalt: (
      <>
        <p>
          Die Prozentgrenze ist das eine, der <span className="font-semibold text-foreground">Nenner</span> das
          andere. Manche Standards rechnen gegen den Börsenwert der Firma, andere gegen die Bilanzsumme.
        </p>
        <p>
          Bei einer Aktie, deren Kurs schwankt, kann dieselbe Firma damit heute durchfallen und im nächsten
          Monat bestehen. Wenn zwei Werkzeuge sich widersprechen, liegt es fast immer daran und nicht an einem
          Fehler. Wer die Regel kennt, versteht den Widerspruch.
        </p>
      </>
    ),
  },
  {
    id: "werkzeuge",
    titel: "Wer das für dich ausrechnet",
    inhalt: (
      <>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="card-surface p-6">
            <h3 className="text-[17px] font-bold text-foreground">Musaffa</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
              Screener für Einzelaktien mit Angabe, an welchem Kriterium eine Aktie scheitert. Zeigt auch den
              Anteil, den du reinigen musst.
            </p>
            <p className="mt-4 text-[13px] text-muted-foreground">musaffa.com, Basisfunktionen kostenlos</p>
          </div>
          <div className="card-surface p-6">
            <h3 className="text-[17px] font-bold text-foreground">Zoya</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
              AAOIFI-basierter Screener unter Aufsicht von Shariah Advisors. Schnelle Einzelabfrage,
              Depot-Durchleuchtung in der Bezahlversion.
            </p>
            <p className="mt-4 text-[13px] text-muted-foreground">zoya.finance, Basisversion kostenlos</p>
          </div>
        </div>
        <p className="text-[15px] text-muted-foreground">
          Weitere Anbieter am Markt sind Islamicly und Finispia. Beide sind von mir noch nicht geprüft.
        </p>
      </>
    ),
  },
  {
    id: "reinigen",
    titel: "Der Schritt, den fast alle vergessen",
    inhalt: (
      <p>
        Selbst eine bestandene Aktie hat oft einen kleinen unerlaubten Ertragsanteil, etwa Zinserträge aus der
        Firmenkasse. Diesen Anteil rechnest du aus deiner Dividende heraus und{" "}
        <span className="font-semibold text-foreground">spendest ihn</span>, ohne dafür Belohnung zu erwarten.
        Musaffa und Zoya weisen den Prozentsatz aus. Der Rest deines Gewinns bleibt damit sauber.
      </p>
    ),
  },
  {
    id: "einfacher-weg",
    titel: "Der einfachere Weg",
    inhalt: (
      <>
        <p>
          Wer sich das alles sparen will, nimmt einen{" "}
          <span className="font-semibold text-foreground">geprüften Halal-ETF</span>. Dort übernimmt ein
          Shariah-Board die Prüfung dauerhaft und sortiert laufend aus, was durchfällt.
        </p>
        <p>
          Das kostet ein paar Zehntel Prozent im Jahr und nimmt dir die Arbeit für hunderte Firmen gleichzeitig
          ab.
        </p>
        <BeitragIllu unterschrift="Ein geprüfter ETF nimmt dir die Einzelprüfung dauerhaft ab.">
          <IlluDepot />
        </BeitragIllu>
      </>
    ),
  },
];

const faq: BeitragFrage[] = [
  {
    frage: "Sind Apple-Aktien halal?",
    antwort:
      "Der Name sagt nichts. Große Technologiekonzerne wirken unverdächtig, fallen aber regelmäßig über die Schuldenquote oder über hohe zinstragende Rücklagen. Prüfe die aktuelle Zahl in einem Werkzeug, statt dich auf den Ruf der Firma zu verlassen.",
  },
  {
    frage: "Wie oft muss ich eine Aktie neu prüfen?",
    antwort:
      "Schulden und zinstragende Mittel ändern sich mit jedem Quartalsbericht. Einmal im Jahr ist das Minimum, bei Einzelaktien lieber häufiger.",
  },
  {
    frage: "Sind Dividenden halal?",
    antwort:
      "Die Dividende selbst ist dein Anteil am Gewinn und damit unproblematisch. Nur der kleine unerlaubte Ertragsanteil muss herausgerechnet und gespendet werden.",
  },
  {
    frage: "Was ist mit Aktien, die ich schon habe?",
    antwort:
      "Prüfe sie mit einem der Werkzeuge. Fällt eine durch, ist die verbreitete Empfehlung, sie zu verkaufen und den Gewinnanteil, der auf das unerlaubte Geschäft entfällt, zu spenden. Bei größeren Beträgen lohnt die Rückfrage bei einem Gelehrten.",
  },
];

const SindAktienHalal = () => (
  <>
    <Seo
      title="Sind Aktien halal oder haram? Die drei Grenzwerte | finanzmuslim"
      description="Aktien sind im Islam grundsätzlich erlaubt. Entscheidend sind drei Zahlen. Welche das sind, wie du sie prüfst und welche Werkzeuge dir die Arbeit abnehmen."
      path="/wissen/sind-aktien-halal"
    />
    <BeitragSeite
      titel="Sind Aktien halal oder haram?"
      kurzGesagt={[
        "Aktien sind grundsätzlich erlaubt, denn du wirst Miteigentümer an einer echten Firma.",
        "Haram wird es durch das Geschäft der Firma und durch ihre Schulden.",
        "Drei Grenzwerte entscheiden, alle drei müssen eingehalten sein.",
        "Werkzeuge wie Musaffa oder Zoya rechnen das für dich aus.",
        "Einmal geprüft ist nicht für immer geprüft, Zahlen ändern sich jedes Quartal.",
      ]}
      abschnitte={abschnitte}
      faq={faq}
      geprueftAm="15. August 2026"
      rechtshinweis="Dieser Beitrag dient ausschließlich zu Bildungszwecken, ist keine Fatwa und stellt keine Anlageberatung dar. Genannte Unternehmen und Anbieter sind Beispiele, keine Empfehlung zum Kauf, Halten oder Verkauf. Zwischen den Rechtsschulen und einzelnen Gremien gibt es abweichende Auffassungen zu Grenzwerten und Nennern."
      boxOben={{ kategorie: "Depot", variante: "vergleich", linkZiel: "/vergleich/depot" }}
      boxMitte={{ kategorie: "Halal-Screening-Apps", variante: "vergleich", linkZiel: "/vergleiche" }}
    >
      <section className="card-surface p-6">
        <h2 className="text-xl font-bold text-foreground">Passend dazu</h2>
        <p className="mt-2 text-[16px] leading-relaxed text-muted-foreground">
          Die drei Grenzwerte gibt es auch als{" "}
          <Link to="/vorlagen/aktien-check" className="text-primary hover:underline">
            PDF zum Ausdrucken
          </Link>
          . Geprüfte Fonds und ETFs stehen in der{" "}
          <Link to="/halal-anlagen" className="text-primary hover:underline">
            Halal-Datenbank
          </Link>
          . Zur Versicherung gibt es einen eigenen Beitrag:{" "}
          <Link to="/wissen/ist-versicherung-haram" className="text-primary hover:underline">
            ist eine Versicherung haram?
          </Link>{" "}
          <Link to="/wissen/ist-bitcoin-halal" className="text-primary hover:underline">
            Bei Kryptowährungen stellt sich dieselbe Frage nach echtem Besitz.
          </Link>
        </p>
      </section>
    </BeitragSeite>
  </>
);

export default SindAktienHalal;