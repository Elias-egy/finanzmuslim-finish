import Seo, { beitragJsonLd } from "@/components/Seo";
import BeitragSeite, { type BeitragAbschnitt, type BeitragFrage } from "@/components/BeitragSeite";
import { IlluHebel, IlluNullsumme } from "@/components/illu";
import {
  B,
  Begriff,
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
    id: "was-es-ist",
    titel: "Was beim Trading wirklich passiert",
    inhalt: (
      <>
        <Frage>
          Geldwechsel ist erlaubt. Forex heißt Währungstausch. Warum soll das eine gehen und das andere
          nicht?
        </Frage>
        <p>
          Weil es zwei verschiedene Dinge sind, die nur denselben Namen tragen. Genau mit dieser
          Verwechslung wird geworben. Wer im Urlaub Euro gegen Lira tauscht, macht ein Geschäft von Hand
          zu Hand: Beide Seiten geben, beide Seiten bekommen, sofort. Das heißt Sarf und ist erlaubt.
        </p>
        <p>
          Beim Forex-Trading passiert das nicht. Du bekommst keine Währung, du besitzt keine Währung, und
          du kannst mit nichts anderem herauskommen als mit dem Geld, mit dem du hineingegangen bist. Was
          gehandelt wird, sind <B>Währungspaare</B>, also Kursverhältnisse. Nicht Geld.
        </p>
        <Begriff wort="Geldwechsel" arabisch="Ṣarf">
          Der Tausch von Währung gegen Währung, bei dem beide Seiten sofort und vollständig übergeben.
          Erlaubt, weil beides den Besitzer wechselt. Wird eine Seite in die Zukunft verschoben, ist es
          kein Sarf mehr.
        </Begriff>
        <Schritte
          schritte={[
            {
              titel: "Du kommst nicht selbst in den Markt",
              text: "Der Devisenmarkt ist der größte digitale Markt der Welt, und darin handeln Banken und Staaten. Privatleute brauchen einen Broker als Türöffner.",
            },
            {
              titel: "Du kaufst keine Währung",
              text: "Du setzt auf das Verhältnis zweier Währungen zueinander, etwa Euro zu Dollar. Die Währungen liegen nie bei dir.",
            },
            {
              titel: "Die Schwankungen sind winzig",
              text: "Ein Kurs bewegt sich am Tag um Bruchteile eines Prozents. Mit eigenem Geld ist damit fast nichts zu verdienen.",
            },
            {
              titel: "Deshalb kommt der Hebel",
              text: "Damit sich das lohnt, leiht dir der Broker Geld und du handelst mit einem Vielfachen deines Einsatzes. Genau hier fängt das eigentliche Problem an.",
            },
          ]}
        />
      </>
    ),
  },
  {
    id: "hebel",
    titel: "Der Hebel ist ein Darlehen, kein Werkzeug",
    inhalt: (
      <>
        <p>
          Ein Hebel klingt nach einer technischen Einstellung. Er ist ein Kredit. Der Broker leiht dir
          Geld, damit du eine größere Position eröffnen kannst, als dein Guthaben hergibt. Verlierst du,
          verlierst du zuerst dein eigenes Geld.
        </p>
        <Bild text="Mit 100 Euro Einsatz und Hebel 30 bewegst du 3.000 Euro. Ein Prozent Kursbewegung ist dann ein Drittel deines Geldes.">
          <IlluHebel />
        </Bild>
        <p>
          Gelehrte beschreiben den Hebel als einstimmig unzulässig. Der Grund ist nicht die Größe der
          Position, sondern die Struktur: Der Broker gibt Geld und bekommt mehr zurück, in Form von
          Gebühren und Finanzierungskosten. Und ohne diesen Kredit wäre das ganze Geschäft für dich gar
          nicht rentabel.
        </p>
        <Merksatz>
          Ein Geschäft, das sich nur mit einem Kredit lohnt, ist kein Handel. Es ist ein Kredit mit
          Kursrisiko.
        </Merksatz>
        <Hinweis titel="Wie hoch der Hebel in der EU sein darf">
          <p>
            Für Privatanleger in der EU ist der Hebel begrenzt, bei den großen Währungspaaren auf 30 zu 1,
            bei volatileren Basiswerten deutlich niedriger. Broker außerhalb der EU werben mit weit
            höheren Werten. Die Begrenzung ändert die islamische Bewertung nicht, sie begrenzt nur, wie
            schnell das Konto leer ist.
          </p>
        </Hinweis>
      </>
    ),
  },
  {
    id: "bausteine",
    titel: "Die vier Bausteine und was an ihnen das Problem ist",
    inhalt: (
      <>
        <p>
          Trading ist kein einzelnes Geschäft, sondern ein Baukasten. Jedes Stück darin hat sein eigenes
          Problem, und keines davon lässt sich einfach weglassen.
        </p>
        <Tabelle
          kopf={["Baustein", "Was es ist", "Woran es scheitert"]}
          zeilen={[
            ["Hebel", "Ein Darlehen des Brokers, mit dem du ein Vielfaches bewegst", "Geld gegen mehr Geld, also Riba"],
            ["Short Selling", "Du verkaufst etwas, das du dir geliehen hast, und hoffst auf fallende Kurse", "Verkauf einer Sache, die dir nicht gehört, dazu eine Gebühr für die Leihe"],
            ["Futures und Forwards", "Ein Vertrag, in Zukunft zu einem festen Kurs zu kaufen", "Bei Geld gegen Geld muss beides sofort übergeben werden"],
            ["CFDs", "Eine Wette auf die Kursdifferenz, ohne dass irgendetwas gekauft wird", "Reine Spekulation, es wechselt nie etwas den Besitzer"],
          ]}
        />
        <Begriff wort="CFD" arabisch="">
          Contract for Difference, auf Deutsch Differenzkontrakt. Du und der Broker vereinbaren, dass
          derjenige dem anderen die Kursdifferenz zahlt, der falsch lag. Es wird nichts gekauft, nichts
          geliefert und nichts besessen.
        </Begriff>
        <p>
          Bei Geld gilt eine zusätzliche Regel, die viele nicht kennen: Geld gehört zu den Waren, bei
          denen ein Tausch nur Zug um Zug erlaubt ist. Ein Vertrag, der einen Währungskauf in die Zukunft
          verschiebt, ist deshalb auch dann problematisch, wenn niemand einen Zins nennt.
        </p>
      </>
    ),
  },
  {
    id: "nullsumme",
    titel: "Warum es kein Handel ist, sondern eine Wette",
    inhalt: (
      <>
        <p>
          Der Punkt, an dem sich alles entscheidet, ist einfacher als jede Vertragsklausel:{" "}
          <B>Beim Trading entsteht kein neues Geld.</B> Was du gewinnst, hat jemand anderes verloren.
        </p>
        <Bild text="Beim Investieren wächst etwas. Bei der Wette wird nur umverteilt: dein Gewinn ist der Verlust eines anderen.">
          <IlluNullsumme />
        </Bild>
        <Gegenueber
          links={{
            titel: "Eine Aktie kaufen",
            ton: "gruen",
            punkte: [
              "Du wirst Miteigentümer an einer Firma.",
              "Die Firma stellt her, verkauft, beschäftigt Menschen.",
              "Wenn sie wächst, wird der Kuchen größer.",
              "Dein Gewinn setzt nicht den Verlust eines anderen voraus.",
            ],
          }}
          rechts={{
            titel: "Auf einen Kurs wetten",
            ton: "rot",
            punkte: [
              "Du besitzt nichts, du hast eine Position.",
              "Es wird nichts produziert und nichts geliefert.",
              "Der Kuchen bleibt gleich groß, er wird nur neu verteilt.",
              "Dein Gewinn ist genau der Verlust der Gegenseite.",
            ],
          }}
        />
        <p>
          Genau diese Struktur beschreiben Gelehrte als Glücksspiel: Einsatz, ein ungewisser Ausgang, und
          am Ende steht einer als Gewinner und einer geht leer aus. Dass die Gesellschaft davon nichts hat,
          ist dabei kein Nebenaspekt, sondern der eigentliche Einwand.
        </p>
        <Frage>Aber ich handle doch nach einer Strategie, mit Chartanalyse und Regeln.</Frage>
        <p>
          Das ändert die Einordnung nicht. Poker spielt man auch strategisch, mit Regeln, Statistik und
          jahrelanger Übung, und es bleibt Glücksspiel. Eine Strategie macht aus einer Wette keinen Handel.
          Sie verbessert nur die Chancen innerhalb der Wette.
        </p>
        <Merksatz>
          Ein Glücksspiel wird nicht dadurch zum Investment, dass man es gut betreibt.
        </Merksatz>
        <p>
          Mehr zu den zwei Bestandteilen, an denen Gelehrte Glücksspiel festmachen, steht in{" "}
          <L to="/wissen/maysir">Glücksspiel (Maysir)</L>. Der Test, ob ein Vertrag zu viel Ungewissheit
          enthält, steht in <L to="/wissen/gharar">Was ist Gharar</L>.
        </p>
      </>
    ),
  },
  {
    id: "islamisches-konto",
    titel: "Das „islamische Konto“ der Broker",
    inhalt: (
      <>
        <p>
          Wer eine Position über Nacht hält, zahlt oder bekommt eine <B>Swap-Gebühr</B>. Dahinter steckt
          der Zinsunterschied zwischen den beiden Währungen. Es ist Zins, und er heißt bei manchen Brokern
          sogar so.
        </p>
        <p>
          Genau an diesem Wort sind muslimische Kunden hängengeblieben, und die Broker haben reagiert: Sie
          bieten ein „islamisches Konto“ oder „swapfreies Konto“ an. Darin fällt die Swap-Gebühr weg.
          Sonst ändert sich nichts.
        </p>
        <Merksatz>
          Ein Bruchteil eines Geschäfts zu ändern macht das Geschäft nicht islamisch. Alles andere bleibt,
          wie es war.
        </Merksatz>
        <p>
          Der Hebel bleibt, die Shorts bleiben, die CFDs bleiben, und die Wettstruktur bleibt. Meist wird
          die Swap-Gebühr außerdem durch eine andere Gebühr ersetzt, eine Haltegebühr oder einen
          erweiterten Spread. Wer nachrechnet, findet sie.
        </p>
        <Hinweis titel="Was Absicherungsmechanismen ändern">
          <p>
            Nichts. Verlustbegrenzungen, garantierte Stopps und Sperren, die verhindern, dass du mehr
            verlierst als dein Guthaben, sind sinnvolle Verbraucherschutzregeln. Sie machen aus einer
            Wette keinen Handel.
          </p>
        </Hinweis>
      </>
    ),
  },
  {
    id: "zahlen",
    titel: "Was die Zahlen der Anbieter selbst sagen",
    inhalt: (
      <>
        <p>
          Es gibt bei diesem Thema eine Besonderheit: Die Anbieter müssen selbst veröffentlichen, wie es
          ihren Kunden ergeht. Wer in der EU CFDs anbietet, muss auf der eigenen Website angeben, welcher
          Anteil der Privatkonten mit Verlust handelt. Die Werte liegen meist zwischen 70 und 80 Prozent.
        </p>
        <p>
          Diese Zahl steht in der Fußzeile derselben Seiten, auf denen mit Freiheit und finanzieller
          Unabhängigkeit geworben wird. Es lohnt, sie einmal bewusst zu suchen, bevor man einer Anzeige
          glaubt.
        </p>
        <Hinweis titel="Wer damit wirklich verdient">
          <p>
            Nicht die Trader. Verdient wird an Spreads, Gebühren und Kursen, und an Kursen, Coachings und
            Signalgruppen, die Trading verkaufen. Das System lebt davon, dass laufend neue, meist junge
            Leute Geld hineintragen, das sie sich nicht leisten können zu verlieren.
          </p>
        </Hinweis>
      </>
    ),
  },
  {
    id: "abgrenzung",
    titel: "Was davon betroffen ist und was nicht",
    inhalt: (
      <>
        <Faelle
          faelle={[
            {
              titel: "Geld wechseln im Urlaub oder bei der Bank",
              ton: "gruen",
              wort: "erlaubt",
              text: "Ein Tausch von Hand zu Hand, beide Seiten sofort. Das ist Sarf und hat mit Trading nichts zu tun, auch wenn die Werbung es so darstellt.",
            },
            {
              titel: "Aktien oder ETFs kaufen und halten",
              ton: "gruen",
              wort: "eigene Frage",
              text: (
                <>
                  Ein Aktienkauf bekommt nicht das Urteil des Glücksspiels. Du wirst Miteigentümer an
                  einem echten Geschäft. Ob die einzelne Firma in Ordnung ist, ist eine andere Prüfung,
                  sie steht in <L to="/wissen/sind-aktien-halal">Aktien richtig prüfen</L>.
                </>
              ),
            },
            {
              titel: "Kurzfristiges Kaufen und Verkaufen von Aktien",
              ton: "gelb",
              wort: "fragwürdig",
              text: "Ohne Hebel und ohne Leerverkauf kaufst du echte Anteile, das bleibt ein Kauf. Wer aber im Minutentakt handelt, tut es nicht mehr wegen der Firma, sondern wegen der Bewegung. Gelehrte bewerten das Verhalten kritisch, auch wenn das Geschäft selbst nicht das Urteil des Glücksspiels bekommt.",
            },
            {
              titel: "Hebelprodukte auf Aktien, Gold oder Krypto",
              ton: "rot",
              wort: "nein",
              text: "Knock-outs, Optionsscheine, gehebelte ETPs und Perpetual Futures haben denselben Baukasten wie Forex. Der Basiswert ändert daran nichts.",
            },
            {
              titel: "Wetten auf fallende Kurse",
              ton: "rot",
              wort: "nein",
              text: "Beim Leerverkauf verkaufst du etwas, das dir nicht gehört, und verdienst daran, dass es anderen schlechter geht. Gelehrte beurteilen das als besonders schwere Form der Wette.",
            },
            {
              titel: "Krypto kaufen und halten",
              ton: "gelb",
              wort: "eigene Frage",
              text: (
                <>
                  Das ist eine andere Debatte als das Trading damit. Sie steht in{" "}
                  <L to="/wissen/ist-bitcoin-halal">Krypto</L>. Gehandelt mit Hebel gilt hier dasselbe wie
                  bei Forex.
                </>
              ),
            },
          ]}
        />
      </>
    ),
  },
  {
    id: "stattdessen",
    titel: "Was du stattdessen tun kannst",
    inhalt: (
      <>
        <p>
          Der Wunsch hinter dem Trading ist meistens berechtigt: aus wenig Geld mehr machen, unabhängig
          werden, nicht ewig auf dieselbe Lohnabrechnung schauen. Der Weg dorthin ist nur ein anderer, und
          er ist langweiliger.
        </p>
        <Checkliste
          punkte={[
            { art: "ja", text: "Anteile an echten Firmen kaufen und halten. Der Kuchen wächst, weil die Firmen arbeiten, nicht weil jemand anderes verliert." },
            { art: "ja", text: "Regelmäßig einzahlen statt den richtigen Moment zu suchen. Wer nicht handelt, kann auch nicht falsch handeln." },
            { art: "ja", text: "In das eigene Können investieren. Ein Handwerk, eine Qualifikation oder ein eigenes kleines Geschäft schlägt jede Renditeversprechung." },
            { art: "neutral", text: "Wenn dich Märkte wirklich interessieren: Lies Bilanzen statt Charts. Das ist dieselbe Neugier, nur auf der Seite, auf der etwas entsteht." },
            { art: "nein", text: "Kein Demokonto „nur zum Üben“. Es ist der Einstieg, den die Anbieter genau dafür anbieten." },
            { art: "nein", text: "Keine Signalgruppen, keine Coachings, keine Kurse, die Trading beibringen. Dort wird an dir verdient, nicht mit dir." },
          ]}
        />
        <p>
          Und wenn schon Geld verloren ist: Das Verlorene ist verloren, das ändert kein weiterer Versuch.
          Der zweite Einsatz, mit dem man „es zurückholen“ will, ist genau das Muster, an dem Gelehrte den
          Suchtcharakter des Glücksspiels festmachen. Aufhören ist an der Stelle keine Niederlage, es ist
          der einzige Zug, der noch etwas rettet.
        </p>
      </>
    ),
  },
];

const faq: BeitragFrage[] = [
  {
    frage: "Ist Forex-Trading halal?",
    antwort:
      "Nach verbreiteter Auffassung nicht. Es werden keine Währungen übergeben, sondern Kursverhältnisse gehandelt, und rentabel wird das erst durch den Hebel, also ein Darlehen des Brokers. Dazu kommen Leerverkäufe, Termingeschäfte und CFDs, die jeweils eigene Probleme haben. Gelehrte, die sich damit befasst haben, beschreiben das gesamte Konstrukt als Wette, nicht als Handel.",
  },
  {
    frage: "Ist Geldwechseln auch verboten?",
    antwort:
      "Nein. Der echte Währungstausch von Hand zu Hand, bei dem beide Seiten sofort übergeben, heißt Sarf und ist erlaubt. Genau mit dieser Ähnlichkeit wird für Forex geworben, obwohl beim Trading nie eine Währung den Besitzer wechselt.",
  },
  {
    frage: "Warum ist der Hebel ein Problem?",
    antwort:
      "Weil er ein Kredit ist. Der Broker leiht dir Geld, damit du ein Vielfaches deines Einsatzes bewegen kannst, und verdient daran über Gebühren und Finanzierungskosten. Gelehrte beschreiben die Nutzung des Hebels als einstimmig unzulässig. Zudem wäre das Geschäft ohne ihn für Privatleute gar nicht rentabel.",
  },
  {
    frage: "Sind CFDs haram?",
    antwort:
      "Nach verbreiteter Auffassung ja. Bei einem CFD wird nichts gekauft und nichts geliefert, du vereinbarst mit dem Broker lediglich, dass die Kursdifferenz ausgeglichen wird. Das ist eine Wette in Vertragsform, und Gelehrte ordnen sie entsprechend ein.",
  },
  {
    frage: "Was ist ein islamisches Trading-Konto?",
    antwort:
      "Ein Konto, bei dem der Broker die Swap-Gebühr streicht, also den Zinsausgleich für über Nacht gehaltene Positionen. Alles andere bleibt: Hebel, Leerverkäufe, CFDs und die Wettstruktur. Einen kleinen Teil zu ändern macht das Geschäft nicht islamisch, und meist wird die Gebühr durch eine andere ersetzt.",
  },
  {
    frage: "Macht eine gute Strategie das Trading erlaubt?",
    antwort:
      "Nein. Auch Poker lässt sich strategisch spielen und bleibt Glücksspiel. Eine Strategie verbessert nur die Chancen innerhalb der Wette, sie ändert nicht die Struktur: Es entsteht kein neues Geld, dein Gewinn ist der Verlust eines anderen.",
  },
  {
    frage: "Ist Aktienhandel dasselbe wie Trading?",
    antwort:
      "Nein. Wer Aktien kauft, wird Miteigentümer an einem echten Geschäft; dieser Kauf bekommt nicht das Urteil des Glücksspiels. Gehebelte Produkte auf Aktien, Leerverkäufe und Derivate haben dagegen denselben Baukasten wie Forex. Ob eine einzelne Aktie in Ordnung ist, wird gesondert geprüft.",
  },
  {
    frage: "Wie viele Trader verlieren tatsächlich Geld?",
    antwort:
      "Anbieter von CFDs müssen in der EU auf ihrer Website veröffentlichen, welcher Anteil ihrer Privatkundenkonten mit Verlust handelt. Die angegebenen Werte liegen meist zwischen 70 und 80 Prozent. Diese Angabe steht auf denselben Seiten, auf denen mit finanzieller Freiheit geworben wird.",
  },
];

const beschreibung =
  "Warum Forex nicht Geldwechsel ist, was der Hebel wirklich ist, weshalb Short, Futures und CFDs jeweils eigene Probleme haben und was ein islamisches Trading-Konto tatsächlich ändert.";

const TradingForexCfd = () => (
  <>
    <Seo
      title="Trading, Forex und CFDs: warum es kein Handel ist | finanzmuslim"
      description={beschreibung}
      path="/wissen/trading-forex-cfd"
      jsonLd={beitragJsonLd({
        titel: "Trading, Forex und CFDs",
        beschreibung,
        path: "/wissen/trading-forex-cfd",
        datePublished: "5. September 2026",
        dateModified: "5. September 2026",
        faq,
      })}
    />
    <BeitragSeite
      slug="trading-forex-cfd"
      titel="Trading, Forex und CFDs"
      untertitel="Es sieht aus wie Handel, funktioniert aber wie eine Wette. Der Unterschied steckt in vier Bausteinen."
      kurzGesagt={[
        "Geldwechsel von Hand zu Hand ist erlaubt. Beim Trading wechselt nie eine Währung den Besitzer.",
        "Der Hebel ist ein Darlehen des Brokers. Ohne ihn wäre das Geschäft für Privatleute nicht rentabel.",
        "Short, Futures und CFDs haben jeweils ein eigenes Problem: fremdes Verkaufen, verschobene Übergabe, reine Wette.",
        "Es entsteht kein neues Geld. Dein Gewinn ist der Verlust eines anderen, und daran ändert keine Strategie etwas.",
        "Ein islamisches Konto streicht nur die Swap-Gebühr. Alles andere bleibt, wie es war.",
      ]}
      abschnitte={abschnitte}
      faq={faq}
      datePublished="5. September 2026"
      dateModified="5. September 2026"
      boxMitteNach={4}
      rechtshinweis="Dieser Beitrag gibt bekannte Positionen wieder und dient ausschließlich zu Bildungszwecken. Er ist keine Fatwa und keine Anlageberatung. Angaben zu Hebelgrenzen und Veröffentlichungspflichten beziehen sich auf die Regulierung für Privatanleger in der EU und können sich ändern; außerhalb der EU gelten andere Regeln. Zur Bewertung einzelner Produkte und zum kurzfristigen Aktienhandel bestehen unter Gelehrten unterschiedliche Auffassungen."
      boxOben={{
        kategorie: "Weiterlesen",
        ueberschrift: "Woran Gelehrte Glücksspiel festmachen",
        linkZiel: "/wissen/maysir",
        text: "Zwei Bestandteile, neun Fälle aus dem Alltag.",
        knopf: "Zu Maysir",
      }}
      boxMitte={{
        kategorie: "Vorlage",
        ueberschrift: "Eine Aktie richtig prüfen",
        linkZiel: "/vorlagen/aktien-check",
        text: "Der Weg, auf dem tatsächlich etwas entsteht.",
        knopf: "Zum Aktien-Check",
      }}
    >
      <PasstDazu
        punkte={[
          { to: "/wissen/maysir", name: "Glücksspiel (Maysir)", text: "erklärt die zwei Bestandteile, an denen eine Wette erkennbar wird." },
          { to: "/wissen/gharar", name: "Was ist Gharar", text: "gibt dir vier Fragen, mit denen du jeden Vertrag prüfst." },
          { to: "/wissen/sind-aktien-halal", name: "Aktien richtig prüfen", text: "zeigt den Weg, bei dem du Miteigentümer wirst statt Wettpartner." },
          { to: "/wissen/ist-bitcoin-halal", name: "Krypto", text: "trennt das Halten von Coins vom Handel mit ihnen." },
        ]}
      />
    </BeitragSeite>
  </>
);

export default TradingForexCfd;
