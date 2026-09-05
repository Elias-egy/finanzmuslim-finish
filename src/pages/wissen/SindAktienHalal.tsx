import Seo, { beitragJsonLd } from "@/components/Seo";
import BeitragSeite, { type BeitragAbschnitt, type BeitragFrage } from "@/components/BeitragSeite";
import { IlluHandel, IlluZweiEbenen } from "@/components/illu";
import {
  B,
  Beispiel,
  Bild,
  Checkliste,
  Frage,
  Hinweis,
  Kennzahlen,
  L,
  Merksatz,
  PasstDazu,
  Tabelle,
} from "@/components/beitrag";

const abschnitte: BeitragAbschnitt[] = [
  {
    id: "warum-erlaubt",
    titel: "Warum Aktien überhaupt erlaubt sind",
    inhalt: (
      <>
        <Frage>Wenn Zinsen verboten sind, warum ist dann ausgerechnet die Börse erlaubt?</Frage>
        <p>
          Weil eine Aktie kein Darlehen ist. Wer eine Aktie kauft, leiht der Firma kein Geld gegen Zins,
          sondern wird <B>Miteigentümer an einer echten Firma</B> mit Maschinen, Mitarbeitern und Produkten.
          Läuft es gut, bekommst du einen Anteil am Gewinn. Läuft es schlecht, verlierst du mit.
        </p>
        <p>
          Genau das ist der Unterschied zum Zinsgeschäft, bei dem einer im Voraus sicher gewinnt, egal wie es
          dem anderen ergeht. Deshalb ist der Aktienkauf im Grundsatz zulässig. Die Frage ist nie, ob Aktien
          erlaubt sind, sondern welche.
        </p>
        <Merksatz>Nicht die Aktie ist das Problem, sondern die Firma dahinter.</Merksatz>
        <Bild text="Bei einer Aktie tauschst du Geld gegen einen echten Anteil an einer Firma. Beide Seiten tragen das Risiko.">
          <IlluHandel />
        </Bild>
      </>
    ),
  },
  {
    id: "zwei-ebenen",
    titel: "Zwei Ebenen, auf denen geprüft wird",
    inhalt: (
      <>
        <p>
          Fast jede Verwirrung bei diesem Thema kommt daher, dass zwei ganz verschiedene Fragen
          durcheinandergehen. Sortier sie einmal sauber, dann wird der Rest einfach.
        </p>
        <Bild text="Erst das Geschäft, dann der Umgang mit Geld. Nur auf der zweiten Ebene sind sich Gelehrte uneinig.">
          <IlluZweiEbenen />
        </Bild>
        <Tabelle
          kopf={["Ebene", "Die Frage", "Wie einig sich Gelehrte sind"]}
          zeilen={[
            [
              "1. Das Geschäft",
              "Womit verdient die Firma ihr Geld?",
              "Einig. Wer hauptsächlich mit Verbotenem verdient, fällt durch. Darüber streitet niemand.",
            ],
            [
              "2. Der Umgang mit Geld",
              "Wie viele Zinsschulden und Zinserträge hat sie?",
              "Uneinig. Hier liegen die Grenzwerte, und hier gehen die Meinungen auseinander.",
            ],
          ]}
        />
        <p>
          Die erste Ebene sortiert die meisten Fälle in Sekunden: Eine Brauerei, ein Wettanbieter oder eine
          Zinsbank fallen durch, ohne dass jemand eine Bilanz aufschlagen muss. Schwieriger sind
          <B> Mischfälle</B>, etwa ein Supermarkt, der auch Alkohol verkauft, oder ein Hotelkonzern mit Bar.
          Für die gilt eine kleine Toleranz.
        </p>
        <p>
          Die zweite Ebene ist die eigentliche Streitfrage. Auch eine völlig unverdächtige Firma nimmt
          Zinskredite auf und legt ihr Geld verzinst an. Ab wann macht dich das zum Mitverdiener?
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
          So prüft der AAOIFI-Standard, an dem sich fast alle Werkzeuge und alle Islamic-Fonds orientieren.
          Reißt eine Firma nur eine dieser drei Grenzen, fällt sie durch.
        </p>
        <Kennzahlen
          zahlen={[
            {
              label: "Umsatz aus verbotenen Bereichen",
              wert: "höchstens 5 %",
              unter: "Alkohol, Tabak, Glücksspiel, Zinsgeschäft, Waffen, Pornografie.",
            },
            {
              label: "Verzinsliche Schulden",
              wert: "höchstens 30 %",
              unter: "Eine Firma, die überwiegend auf Zinskrediten läuft, wird über deinen Anteil zum Zinsgeschäft.",
            },
            {
              label: "Zinstragende Geldanlagen",
              wert: "höchstens 30 %",
              unter: "Zinspapiere und verzinste Guthaben in der Bilanz. Auch eine saubere Firma kann hier durchfallen.",
            },
          ]}
        />
        <Frage>Warum ausgerechnet fünf und dreißig Prozent? Steht das im Koran?</Frage>
        <p>
          Nein, und das sagen die Gremien auch offen. Die Zahlen sind Ableitungen. Bei den dreißig Prozent
          berufen sich Gelehrte auf einen bekannten Bericht: Ein Gefährte des Propheten wollte fast sein
          ganzes Vermögen spenden, ihm wurde ein Drittel zugestanden mit dem Satz, ein Drittel sei schon viel.
          Daraus wurde die Vorstellung, dass ein Drittel die Obergrenze für einen Anteil ist, den man gerade
          noch hinnehmen kann.
        </p>
        <p>
          Die fünf Prozent kommen aus einem anderen Grundsatz: Kleinigkeiten, die sich praktisch nicht
          vermeiden lassen, werden übersehen. Wollte man null Prozent, bliebe an der Börse fast nichts übrig,
          weil selbst der sauberste Mittelständler ein Firmenkonto mit Zinsen hat.
        </p>
        <Hinweis titel="Die Toleranz erlaubt den Kauf, nicht das Behalten">
          <p>
            Derselbe Standard, der die fünf Prozent zulässt, verlangt, dass du den unreinen Anteil deiner
            Erträge später wieder weggibst. Wie das geht, steht in{" "}
            <L to="/wissen/ertraege-reinigen">Aktienbereinigung</L>.
          </p>
        </Hinweis>
      </>
    ),
  },
  {
    id: "strengere-sicht",
    titel: "Die strengere Sicht, die es auch gibt",
    inhalt: (
      <>
        <p>
          Ehrlich gesagt: Die drei Grenzwerte sind nicht die einzige Meinung, sie sind die praktikable. Eine
          ganze Reihe klassischer Gelehrter und Gremien lässt <B>gar keine</B> Toleranz zu, wenn es um Zinsen
          geht. Ihr Argument ist einfach: Zins ist im Koran eindeutig verboten, und ein Verbot kennt keine
          Fünf-Prozent-Schwelle. Wer dieser Sicht folgt, kauft die allermeisten Aktien nicht und findet auch
          keinen Islamic-ETF, denn alle bauen auf der Toleranz auf.
        </p>
        <p>
          Die Gegenposition, auf der diese Seite und die geprüften Fonds stehen, sagt: Ohne eine kleine
          Toleranz gäbe es für Muslime in einem Zinssystem überhaupt keine Möglichkeit zu investieren, und die
          Alternative wäre, das Geld auf einem Konto liegen zu lassen, das selbst Teil des Zinssystems ist.
          Deshalb wird ein kleiner, unvermeidbarer Rest hingenommen und anschließend wieder herausgerechnet.
        </p>
        <Merksatz>
          Beide Seiten sind begründet. Du solltest nur wissen, welcher du folgst, statt es nie gehört zu
          haben.
        </Merksatz>
      </>
    ),
  },
  {
    id: "widerspruch",
    titel: "Warum zwei Apps zur selben Aktie Verschiedenes sagen",
    inhalt: (
      <>
        <Frage>Musaffa sagt halal, die andere App sagt haram. Wer hat sich verrechnet?</Frage>
        <p>
          Wahrscheinlich keiner. Die Prozentgrenze ist das eine, der <B>Nenner</B> das andere. Manche
          Standards rechnen die Schulden gegen den Börsenwert der Firma, andere gegen die Bilanzsumme. Das
          sind zwei völlig verschiedene Zahlen.
        </p>
        <Beispiel
          titel="Dieselbe Firma, zwei Ergebnisse"
          rechnung={["25 Mrd. Schulden ÷ 100 Mrd. Börsenwert = 25 %", "25 Mrd. Schulden ÷ 70 Mrd. Bilanzsumme = 36 %"]}
          ergebnis="Ein Werkzeug sagt bestanden, das andere durchgefallen. Beide rechnen richtig."
        >
          <p>Die Zahlen sind erfunden, der Effekt nicht.</p>
        </Beispiel>
        <p>
          Daraus folgt etwas Unbequemes: Der Börsenwert schwankt täglich, die Schulden nicht. Eine Aktie kann
          heute bestehen und in drei Monaten durchfallen, ohne dass die Firma irgendetwas geändert hätte.
          Besonders trifft das die, die kaufen und dann jahrelang liegen lassen. Deshalb ist einmal geprüft
          nicht für immer geprüft.
        </p>
      </>
    ),
  },
  {
    id: "werkzeuge",
    titel: "Wer das für dich ausrechnet",
    inhalt: (
      <>
        <Tabelle
          kopf={["Werkzeug", "Was es kann", "Kosten"]}
          zeilen={[
            [
              "Musaffa",
              "Screener für Einzelaktien mit Angabe, an welchem Kriterium eine Aktie scheitert. Bereinigungsrechner nur im Bezahl-Abo.",
              "Prüfung kostenlos, musaffa.com",
            ],
            [
              "Zoya",
              "Screener nach demselben Standard, unter Aufsicht eines Gelehrtengremiums. Depot-Durchleuchtung im Bezahl-Abo.",
              "Basisversion kostenlos, zoya.finance",
            ],
            ["Islamicly, Finispia", "Weitere Anbieter am Markt.", "von mir nicht geprüft"],
          ]}
        />
        <Hinweis titel="Eine App ist kein Freibrief">
          <p>
            Diese Werkzeuge wenden Filter auf Bilanzzahlen an. Sie sehen sich nicht jede Firma einzeln an, und
            sie liegen manchmal falsch. Es ist mehrfach vorgekommen, dass Cannabis-Firmen unter der Branche
            Pharma durchgerutscht sind oder ein Rüstungskonzern als bestanden angezeigt wurde. Die Zahlen
            kommen aus der App, der letzte Blick auf das Geschäft der Firma bleibt bei dir.
          </p>
        </Hinweis>
      </>
    ),
  },
  {
    id: "verboten",
    titel: "Was auch mit geprüften Aktien nicht geht",
    inhalt: (
      <>
        <p>
          Eine bestandene Aktie sagt nur, dass du sie <B>kaufen und halten</B> darfst. Über die Art, wie du
          handelst, sagt sie nichts. Hier sind sich die Gelehrten sogar ausnahmsweise einig, und derselbe
          Standard, auf den sich die Islamic-Fonds berufen, sagt es genauso.
        </p>
        <Checkliste
          punkte={[
            { art: "ja", text: "Aktien kaufen, halten, wieder verkaufen. Auch nach kurzer Zeit." },
            { art: "ja", text: "Dividenden nehmen, nach Abzug des unreinen Anteils." },
            { art: "nein", text: "Auf Kredit kaufen (Margin). Das ist ein verzinstes Darlehen deines Brokers." },
            { art: "nein", text: "Leerverkauf, also auf fallende Kurse setzen mit geliehenen Aktien." },
            { art: "nein", text: "Optionen, Futures, CFDs und andere Derivate. Du kaufst dort keine Firma, du wettest auf einen Kurs." },
          ]}
        />
        <p>
          Wer sich bei Aktien auf den AAOIFI-Standard beruft, muss diesen Teil mitübernehmen. Man kann nicht
          die Toleranz nehmen und das Verbot weglassen. Mehr dazu in{" "}
          <L to="/wissen/maysir">Glücksspiel (Maysir)</L>.
        </p>
      </>
    ),
  },
  {
    id: "reinigen",
    titel: "Der Schritt, den fast alle vergessen",
    inhalt: (
      <>
        <p>
          Selbst eine bestandene Aktie hat oft einen kleinen unerlaubten Ertragsanteil, meist Zinsen aus der
          Firmenkasse. Diesen Anteil rechnest du aus deinen Erträgen heraus und gibst ihn weiter, ohne dafür
          eine Belohnung zu erwarten. Das ist keine Zakat und keine Spende, sondern das Aussortieren eines
          Anteils, der dir nie zustand.
        </p>
        <p>
          Der übliche Weg: Der Fondsanbieter oder die App nennt dir einen Satz, du rechnest ihn auf deine
          Ausschüttung. Fehlt die Angabe, wird vorsichtig mit fünf Prozent gerechnet. Der{" "}
          <L to="/reinigungsrechner">Reinigungsrechner</L> macht das in dreißig Sekunden, die ausführliche
          Anleitung steht in <L to="/wissen/ertraege-reinigen">Aktienbereinigung</L>.
        </p>
      </>
    ),
  },
  {
    id: "einfacher-weg",
    titel: "Der einfachere Weg",
    inhalt: (
      <>
        <Frage>Muss ich das wirklich für jede einzelne Aktie machen?</Frage>
        <p>
          Nein. Wer sich das sparen will, nimmt einen <B>geprüften Fonds</B>. Dort übernimmt ein
          Gelehrtengremium die Prüfung dauerhaft, und was durchfällt, fliegt automatisch raus. Das kostet ein
          paar Zehntel Prozent im Jahr und nimmt dir die Arbeit für hunderte Firmen gleichzeitig ab.
        </p>
        <p>
          Worauf du beim Fonds selbst achtest, steht in <L to="/wissen/halal-etfs">Halal ETFs</L>. Welche es
          konkret gibt, mit Kosten und Prüfstelle, steht in der{" "}
          <L to="/halal-anlagen">Anlagen-Datenbank</L>.
        </p>
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
      "Schulden und zinstragende Mittel ändern sich mit jedem Quartalsbericht, und weil viele Standards gegen den Börsenwert rechnen, verschiebt sich das Ergebnis auch mit dem Kurs. Einmal im Jahr ist das Minimum, bei Einzelaktien lieber häufiger.",
  },
  {
    frage: "Sind Dividenden halal?",
    antwort:
      "Die Dividende selbst ist dein Anteil am Gewinn und damit unproblematisch. Nur der kleine unerlaubte Ertragsanteil muss herausgerechnet und weitergegeben werden.",
  },
  {
    frage: "Warum sagen zwei Apps zur selben Aktie etwas Verschiedenes?",
    antwort:
      "Fast immer wegen des Nenners. Manche Standards rechnen die Schulden gegen den Börsenwert, andere gegen die Bilanzsumme. Beide rechnen richtig, sie messen nur gegen verschiedene Größen.",
  },
  {
    frage: "Darf ich Aktien auf Kredit kaufen?",
    antwort:
      "Nein. Ein Margin-Konto ist ein verzinstes Darlehen deines Brokers. Auch Leerverkäufe, Optionen, Futures und CFDs sind ausgeschlossen, darüber sind sich die Gelehrten einig.",
  },
  {
    frage: "Was ist mit Aktien, die ich schon habe?",
    antwort:
      "Prüfe sie mit einem der Werkzeuge. Fällt eine durch, ist die verbreitete Empfehlung, sie zu verkaufen und den Gewinnanteil, der auf das unerlaubte Geschäft entfällt, weiterzugeben. Bei größeren Beträgen lohnt die Rückfrage bei einem Gelehrten.",
  },
];

const beschreibung =
  "Aktien sind im Islam grundsätzlich erlaubt. Entscheidend sind zwei Ebenen und drei Zahlen. Welche das sind, warum zwei Apps sich widersprechen und welche Werkzeuge dir die Arbeit abnehmen.";

const SindAktienHalal = () => (
  <>
    <Seo
      title="Sind Aktien halal oder haram? Die drei Grenzwerte | finanzmuslim"
      description={beschreibung}
      path="/wissen/sind-aktien-halal"
      jsonLd={beitragJsonLd({
        titel: "Sind Aktien halal oder haram?",
        beschreibung,
        path: "/wissen/sind-aktien-halal",
        datePublished: "15. August 2026",
        dateModified: "5. September 2026",
        faq,
      })}
    />
    <BeitragSeite
      slug="sind-aktien-halal"
      titel="Sind Aktien halal oder haram?"
      untertitel="Die Frage ist nicht ob, sondern welche. Zwei Ebenen und drei Zahlen entscheiden."
      kurzGesagt={[
        "Aktien sind grundsätzlich erlaubt, denn du wirst Miteigentümer an einer echten Firma und trägst das Risiko mit.",
        "Geprüft wird auf zwei Ebenen: womit die Firma verdient, und wie sie mit Zinsen umgeht.",
        "Drei Grenzwerte entscheiden: 5 Prozent verbotener Umsatz, 30 Prozent Schulden, 30 Prozent Zinsanlagen.",
        "Es gibt eine strengere Sicht ohne jede Toleranz. Sie ist begründet, findet aber keinen einzigen ETF.",
        "Kaufen und halten ist erlaubt. Margin, Leerverkauf und Derivate sind es nicht.",
      ]}
      abschnitte={abschnitte}
      faq={faq}
      datePublished="15. August 2026"
      dateModified="5. September 2026"
      boxMitteNach={3}
      rechtshinweis="Dieser Beitrag dient ausschließlich zu Bildungszwecken, ist keine Fatwa und stellt keine Anlageberatung dar. Genannte Unternehmen und Anbieter sind Beispiele, keine Empfehlung zum Kauf, Halten oder Verkauf. Zwischen den Rechtsschulen und einzelnen Gremien gibt es abweichende Auffassungen zu den Grenzwerten, zum Nenner und dazu, ob überhaupt eine Toleranz zulässig ist. Die Zahlen in den Beispielen sind erfunden."
      boxOben={{ kategorie: "Depot", variante: "vergleich", linkZiel: "/vergleich/depot" }}
      boxMitte={{ kategorie: "Halal-Screening-Apps", variante: "vergleich", linkZiel: "/vergleiche" }}
    >
      <PasstDazu
        punkte={[
          { to: "/vorlagen/aktien-check", name: "Aktien-Check als PDF", text: "die drei Grenzwerte auf einer Seite zum Ausdrucken." },
          { to: "/wissen/halal-etfs", name: "Halal ETFs", text: "der Weg, bei dem ein Gremium die Prüfung dauerhaft übernimmt." },
          { to: "/wissen/ertraege-reinigen", name: "Aktienbereinigung", text: "was mit dem kleinen unreinen Rest passiert, den die Toleranz zulässt." },
          { to: "/halal-anlagen", name: "Halal-Datenbank", text: "geprüfte Fonds und ETFs mit Kosten, Größe und Prüfstelle." },
        ]}
      />
    </BeitragSeite>
  </>
);

export default SindAktienHalal;
