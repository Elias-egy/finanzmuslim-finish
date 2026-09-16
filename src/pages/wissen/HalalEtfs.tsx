import Seo, { beitragJsonLd } from "@/components/Seo";
import BeitragSeite, { type BeitragAbschnitt, type BeitragFrage } from "@/components/BeitragSeite";
import { IlluDepot, IlluIsin } from "@/components/illu";
import {
  B,
  Bild,
  Checkliste,
  Frage,
  Hinweis,
  L,
  Merksatz,
  PasstDazu,
  Schritte,
} from "@/components/beitrag";

const abschnitte: BeitragAbschnitt[] = [
  {
    id: "zwei-ebenen",
    titel: "Ein ETF wird auf zwei Ebenen geprüft",
    inhalt: (
      <>
        <Frage>Im Namen steht Islamic. Reicht das nicht als Prüfung?</Frage>
        <p>
          Nein, denn geprüft wird zweimal, an zwei völlig verschiedenen Stellen. Ein ETF ist ein Korb. Er
          kauft nach einer festen Liste ein und entscheidet selbst nichts. Wenn die Liste sauber ist, ist der
          Inhalt sauber. Damit hört die Prüfung aber nicht auf.
        </p>
        <Merksatz>Erste Ebene: Was ist drin. Zweite Ebene: Was macht der Fonds damit.</Merksatz>
        <p>
          Die erste Ebene ist der Index. Ein Anbieter wie MSCI oder Dow Jones prüft jede Firma nach festen
          Grenzwerten und wirft raus, was durchfällt. Welche drei Grenzwerte das sind, steht in{" "}
          <L to="/wissen/sind-aktien-halal">Sind Aktien halal?</L>
        </p>
        <p>
          Die zweite Ebene ist der Fonds selbst. Er kann einen sauberen Index nachbilden und trotzdem Dinge
          tun, die du nicht willst. Genau hier schauen die wenigsten hin, und genau hier liegen die
          Unterschiede zwischen den Anbietern.
        </p>
        <Bild text="Der Index entscheidet, was im Korb liegt. Der Fonds entscheidet, was er mit dem Korb macht.">
          <IlluDepot />
        </Bild>
      </>
    ),
  },
  {
    id: "vier-fragen",
    titel: "Vier Fragen an den Fonds",
    inhalt: (
      <>
        <p>
          Diese vier stehen im Factsheet oder im Verkaufsprospekt. Zusammen brauchen sie zehn Minuten, und
          danach weißt du mehr über deinen Fonds als die meisten, die ihn besparen.
        </p>
        <Schritte
          schritte={[
            {
              titel: "Verleiht der Fonds Wertpapiere?",
              text: "Viele ETFs verleihen ihre Aktien gegen eine Gebühr an andere Marktteilnehmer. Das bringt ein paar Hundertstel Rendite und ist unter Gelehrten umstritten, weil die Papiere häufig für Leerverkäufe gebraucht werden, also für Wetten auf fallende Kurse. Im Factsheet steht das unter Wertpapierleihe oder Securities Lending. Manche Islamic-ETFs schließen es ausdrücklich aus.",
            },
            {
              titel: "Kauft er die Aktien wirklich?",
              text: "Physisch heißt, der Fonds besitzt die Papiere. Synthetisch heißt, er bildet den Index über ein Tauschgeschäft mit einer Bank nach und hält in Wahrheit etwas ganz anderes. Für ein islamkonformes Depot ist physisch der klare Fall, synthetisch bringt einen Vertrag ins Spiel, den niemand für dich geprüft hat.",
            },
            {
              titel: "Was passiert mit dem unreinen Teil der Erträge?",
              text: "Auch geprüfte Firmen haben kleine Zinserträge. Manche Anbieter rechnen den Anteil aus und weisen ihn aus, einer reinigt seit 2026 sogar selbst im Fonds. Andere schweigen dazu, dann musst du schätzen. Welcher Fonds was macht, steht in der Aktienbereinigung.",
            },
            {
              titel: "Wer hat geprüft, und was genau?",
              text: "Ein Name allein reicht nicht. Wichtig ist, ob ein Zertifikat für das Produkt selbst vorliegt oder nur für den Index, und ob es jährlich erneuert wird. In unserer Datenbank steht bei jeder Anlage genau das.",
            },
          ]}
        />
        <Hinweis titel="Was ein Zertifikat wirklich sagt">
          <p>
            Das Gelehrtengremium eines großen Fonds hat in aller Regel <B>die Filter</B> freigegeben, nicht
            jede einzelne der hunderten Firmen im Korb. Und die Menschen, die den Fonds täglich führen, sind
            Fondsmanager, keine Gelehrten. Ein Zertifikat ist also die Bestätigung einer Methode, nicht die
            Prüfung jeder Position. Das macht es nicht wertlos, aber es erklärt, warum in einem geprüften
            Fonds trotzdem mal etwas landet, worüber man streiten kann.
          </p>
        </Hinweis>
      </>
    ),
  },
  {
    id: "welche-meinung",
    titel: "Auf welcher Meinung diese Fonds stehen",
    inhalt: (
      <>
        <p>
          Etwas, das kaum jemand ausspricht: <B>Alle</B> Islamic-ETFs am Markt bauen auf derselben Grundlage
          auf, nämlich auf der Auffassung, dass eine kleine, unvermeidbare Zinsberührung hinnehmbar ist,
          solange sie unter den Grenzwerten bleibt und der unreine Anteil später weitergegeben wird.
        </p>
        <p>
          Es gibt auch die strengere Auffassung: keine Toleranz bei Zinsen, nicht einmal ein Zehntelprozent.
          Wer ihr folgt, findet am Markt keinen einzigen Fonds, der zu ihm passt, und bleibt bei physischem
          Gold, Sukuk oder Einzelfällen, die er selbst prüft. Das ist eine legitime Entscheidung, sie sollte
          nur bewusst getroffen werden.
        </p>
        <Merksatz>
          Wer einen Islamic-ETF kauft, folgt einer bestimmten Gelehrtenmeinung. Gut zu wissen, welcher.
        </Merksatz>
      </>
    ),
  },
  {
    id: "erkennen",
    titel: "Woran du einen erkennst",
    inhalt: (
      <>
        <p>
          Im Namen steht fast immer <B>Islamic</B>, <B>Shariah</B> oder <B>Islamic Screened</B>. Das ist der
          schnellste Filter in der Suche deines Brokers.
        </p>
        <Frage>Reicht es, nach dem Wort zu suchen?</Frage>
        <p>
          Leider nicht. Es gibt Fonds mit ähnlich klingenden Namen, die nichts damit zu tun haben, etwa
          Nachhaltigkeitsfonds mit ESG oder SRI im Titel. Die schließen zwar Waffen und Tabak aus, aber Banken
          und Versicherungen sind dort oft die größten Positionen, und die Zinsgrenzwerte prüfen sie gar
          nicht.
        </p>
        <p>
          <B>Der sichere Weg ist die ISIN.</B> Das ist die zwölfstellige Nummer, die es zu jedem Wertpapier
          nur einmal gibt. Mit ihr findest du dieselbe Anlage bei jedem Broker, egal wie der Fonds dort im
          Suchfeld heißt. Bei jeder Anlage in unserer Datenbank steht sie zum Kopieren daneben.
        </p>
        <Bild text="Der Name kann täuschen, die Nummer nicht. Eine ISIN gibt es nur einmal.">
          <IlluIsin />
        </Bild>
      </>
    ),
  },
  {
    id: "was-bleibt",
    titel: "Was auch ein geprüfter ETF nicht abnimmt",
    inhalt: (
      <>
        <p>
          Ein Islamic-ETF nimmt dir die Prüfung von hunderten Firmen ab. Drei Dinge bleiben trotzdem bei dir.
        </p>
        <Checkliste
          punkte={[
            {
              art: "neutral",
              text: (
                <>
                  <B>Das Verrechnungskonto.</B> Der sauberste ETF nützt wenig, wenn dein Broker auf das
                  Guthaben daneben Zinsen zahlt. Was du dort einstellst, steht im{" "}
                  <L to="/vergleich/depot">Depot-Vergleich</L>.
                </>
              ),
            },
            {
              art: "neutral",
              text: (
                <>
                  <B>Die Reinigung der Erträge.</B> Der kleine unreine Anteil verschwindet nicht dadurch, dass
                  ein Gremium den Fonds freigegeben hat. Er wird ausgerechnet und weitergegeben, siehe{" "}
                  <L to="/wissen/ertraege-reinigen">Aktienbereinigung</L>.
                </>
              ),
            },
            {
              art: "neutral",
              text: (
                <>
                  <B>Das Risiko.</B> Halal heißt erlaubt, nicht sicher. Ein Islamic-ETF schwankt wie jeder
                  andere Aktienfonds, und ein Verlust ist jederzeit möglich. Die Prüfung betrifft die
                  Zulässigkeit, nicht die Wertentwicklung.
                </>
              ),
            },
          ]}
        />
      </>
    ),
  },
];

const faq: BeitragFrage[] = [
  {
    frage: "Wie funktioniert ein Halal-ETF?",
    antwort:
      "Er bildet einen Index nach, aus dem alle Firmen entfernt wurden, die die Prüfkriterien nicht erfüllen. Geprüft wird, womit die Firma ihr Geld verdient, wie hoch ihre verzinslichen Schulden sind und wie viel zinsbringend in der Bilanz liegt. Der Fonds selbst entscheidet nichts, er kauft die Liste ab.",
  },
  {
    frage: "Welche ETFs sind halal?",
    antwort:
      "Solche, deren Index nach Shariah-Kriterien gefiltert ist und deren Fondsführung selbst nichts Unzulässiges tut, etwa Wertpapierleihe oder synthetische Nachbildung. In unserer Datenbank stehen die geprüften Anlagen mit Kosten, Fondsgröße und der Stelle, die sie geprüft hat.",
  },
  {
    frage: "Was bestätigt ein Shariah-Zertifikat genau?",
    antwort:
      "In aller Regel die Filter, also die Methode, nach der aussortiert wird. Nicht jede einzelne Firma im Fonds wird von einem Gelehrten angesehen, und die Fondsführung selbst liegt bei Fondsmanagern. Deshalb lohnt der Blick, ob das Zertifikat für das Produkt oder nur für den Index gilt und wann es zuletzt erneuert wurde.",
  },
  {
    frage: "Ist ein ESG-ETF dasselbe wie ein Halal-ETF?",
    antwort:
      "Nein. ESG- und Nachhaltigkeitsfonds schließen oft Waffen, Tabak und Kohle aus, aber Banken und Versicherungen sind dort häufig unter den größten Positionen. Die Zinsgrenzwerte prüfen sie gar nicht.",
  },
  {
    frage: "Ist Wertpapierleihe bei einem Halal-ETF erlaubt?",
    antwort:
      "Darüber gibt es unterschiedliche Auffassungen. Kritisiert wird, dass die verliehenen Papiere häufig für Leerverkäufe gebraucht werden. Manche Islamic-ETFs schließen die Leihe deshalb ausdrücklich aus. Im Factsheet steht es unter Wertpapierleihe oder Securities Lending.",
  },
  {
    frage: "Muss ich die Erträge eines Halal-ETFs reinigen?",
    antwort:
      "Nach verbreiteter Auffassung ja. Auch geprüfte Firmen haben kleine Zinserträge, und der darauf entfallende Anteil wird ausgerechnet und weitergegeben, ohne dafür eine Belohnung zu erwarten. Manche Anbieter weisen den Prozentsatz jährlich aus, einer reinigt seit 2026 im Fonds selbst.",
  },
  {
    frage: "Sind Halal-ETFs teurer als normale ETFs?",
    antwort:
      "Meist etwas. Die laufenden Kosten liegen häufig über denen eines breiten Standard-ETFs, weil das Screening und die Zertifizierung Geld kosten und die Fonds kleiner sind. Die genauen Werte stehen bei jeder Anlage in unserer Datenbank.",
  },
];

const beschreibung =
  "Ein Halal-ETF wird auf zwei Ebenen geprüft: der Index und der Fonds selbst. Vier Fragen zu Wertpapierleihe, Nachbildung, Reinigung und Zertifikat, dazu woran du einen echten erkennst.";

const HalalEtfs = () => (
  <>
    <Seo
      title="Halal ETFs: worauf du beim Fonds achtest | finanzmuslim"
      description={beschreibung}
      path="/wissen/halal-etfs"
      jsonLd={beitragJsonLd({
        titel: "Halal ETFs: worauf du achtest",
        beschreibung,
        path: "/wissen/halal-etfs",
        datePublished: "16. August 2026",
        dateModified: "5. September 2026",
        faq,
      })}
    />
    <BeitragSeite
      slug="halal-etfs"
      titel="Halal ETFs: worauf du achtest"
      untertitel="Vier Fragen an den Fonds, die im Factsheet stehen und zehn Minuten kosten."
      kurzGesagt={[
        "Ein ETF wird auf zwei Ebenen geprüft: der Index und der Fonds selbst.",
        "Vier Fragen an den Fonds: Leihe, Nachbildung, Reinigung, Zertifikat.",
        "Ein Zertifikat bestätigt die Filter, nicht jede einzelne Firma im Korb.",
        "Im Namen steht Islamic oder Shariah. Verlass dich trotzdem auf die ISIN.",
        "ESG ist nicht halal. Dort sind Banken oft die größten Positionen.",
        "Halal heißt erlaubt, nicht sicher. Das Risiko bleibt dasselbe.",
      ]}
      abschnitte={abschnitte}
      faq={faq}
      datePublished="16. August 2026"
      dateModified="5. September 2026"
      boxMitteNach={1}
      rechtshinweis="Dieser Beitrag dient ausschließlich zu Bildungszwecken, ist keine Fatwa und keine Anlageberatung. Genannte Anbieter und Indexhäuser sind Beispiele, keine Empfehlung. Zu Wertpapierleihe, synthetischer Nachbildung und zur Reinigung von Erträgen bestehen zwischen den Rechtsschulen und einzelnen Gremien unterschiedliche Auffassungen. Investitionen in Wertpapiere sind mit Risiken verbunden, bis hin zum Totalverlust."
      boxOben={{
        kategorie: "Anlagen",
        ueberschrift: "Geprüfte ETFs mit Kosten und Prüfstelle",
        linkZiel: "/halal-anlagen",
        text: "31 Anlagen mit Kosten, Größe und Prüfstelle.",
        knopf: "Zu den Anlagen",
      }}
      boxMitte={{
        kategorie: "Depot",
        ueberschrift: "Ein Depot, das ohne Zinsgeschäft arbeitet",
        linkZiel: "/vergleich/depot",
      }}
    >
      <PasstDazu
        punkte={[
          { to: "/wissen/sind-aktien-halal", name: "Sind Aktien halal?", text: "erklärt die drei Grenzwerte, nach denen der Index filtert." },
          { to: "/wissen/ertraege-reinigen", name: "Aktienbereinigung", text: "zeigt, welcher Fonds selbst reinigt und was bei dir bleibt." },
          { to: "/wissen/sukuk", name: "Sukuk statt Anleihe", text: "die zweite große Anlageklasse in der Datenbank." },
          { to: "/halal-anlagen", name: "Die Halal-Datenbank", text: "listet jede geprüfte Anlage mit Kursverlauf und ISIN." },
        ]}
      />
    </BeitragSeite>
  </>
);

export default HalalEtfs;
