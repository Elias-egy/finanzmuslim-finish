import Seo, { beitragJsonLd } from "@/components/Seo";
import BeitragSeite, { type BeitragAbschnitt, type BeitragFrage } from "@/components/BeitragSeite";
import { IlluZins } from "@/components/illu";
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
  Tabelle,
} from "@/components/beitrag";

const abschnitte: BeitragAbschnitt[] = [
  {
    id: "zwei-karten",
    titel: "Es sind zwei verschiedene Karten, nicht eine",
    inhalt: (
      <>
        <Frage>Im Portemonnaie liegt eine Karte mit Visa-Logo. Ist das eine Kreditkarte?</Frage>
        <p>
          Vermutlich nicht. Was im Alltag alles „Kreditkarte“ genannt wird, sind zwei völlig verschiedene
          Produkte, und der Unterschied entscheidet über das islamische Urteil.
        </p>
        <Tabelle
          kopf={["", "Debitkarte", "Kreditkarte"]}
          zeilen={[
            ["Wessen Geld gibst du aus", "deines", "das der Bank"],
            ["Wann wird abgebucht", "sofort", "gesammelt, meist zum Mitte des Folgemonats"],
            ["Was begrenzt dich", "dein Kontostand", "ein Kreditrahmen, den die Bank festlegt"],
            ["Kannst du in Zinsen geraten", "nein", "ja, sobald du die Abrechnung aufschiebst"],
          ]}
        />
        <Merksatz>
          Visa und Mastercard sind keine Kartenart. Es sind Dienstleister für die Zahlungsabwicklung. Die
          Karte darunter ist entweder eine Debitkarte oder eine Kreditkarte.
        </Merksatz>
        <p>
          Deshalb hilft das Logo nicht weiter. Auf beiden Karten steht Visa oder Mastercard. Was du in der
          Hand hast, steht meist klein auf der Karte selbst oder im Konto-Vertrag: <B>Debit</B> oder{" "}
          <B>Credit</B>.
        </p>
      </>
    ),
  },
  {
    id: "debitkarte",
    titel: "Die Debitkarte: unproblematisch, weil kein fremdes Geld fließt",
    inhalt: (
      <>
        <p>
          Bei einer Debitkarte gibst du dein eigenes Geld aus. Der Rahmen der Karte ist dein Kontostand.
          Wenn du bezahlst, beauftragst du deine Bank, den Händler aus deinem Guthaben zu bezahlen. Es
          entsteht kein Darlehen und damit auch keine Zinsfrage.
        </p>
        <Merksatz>
          Die Debitkarte teilt das Urteil des Kontos, an dem sie hängt. Ist das Konto in Ordnung, ist die
          Karte es auch.
        </Merksatz>
        <p>
          Auch die Gebühren dafür sind nach Auffassung der Gelehrten unproblematisch, sowohl eine einmalige
          Ausstellungsgebühr als auch eine Jahresgebühr. Bezahlt wird damit eine Dienstleistung, nicht die
          Überlassung von Geld auf Zeit.
        </p>
        <Hinweis titel="Was am Konto hängt, hängt an der Karte">
          <p>
            Wenn dein Girokonto Habenzinsen zahlt oder einen Dispo hat, ist das eine Frage an das Konto,
            nicht an die Karte. Wie du dein Konto sauber aufstellst, steht in{" "}
            <L to="/wissen/girokonto-ohne-zinsen">Girokonto ohne Zinsen</L>. Nicht jedes Girokonto bietet
            überhaupt eine Debitkarte an, manche haben nur die reine Girocard.
          </p>
        </Hinweis>
      </>
    ),
  },
  {
    id: "kreditkarte",
    titel: "Die Kreditkarte: du gibst fremdes Geld aus",
    inhalt: (
      <>
        <p>
          Bei einer Kreditkarte wird von deinem Konto zunächst nichts abgebucht. Die Bank streckt vor, was
          du ausgibst, und stellt dir die Summe später in Rechnung. Bis zu diesem Tag läufst du bei der
          Bank in der Kreide, jeden Tag ein Stück mehr.
        </p>
        <Bild text="Geld gegen mehr Geld. Genau das steckt in der Kreditkarte, sobald eine Abrechnung nicht vollständig beglichen wird.">
          <IlluZins />
        </Bild>
        <p>
          Solange du die Rechnung am Stichtag vollständig begleichst, verlangt die Bank meist nichts
          zusätzlich. Zinsen entstehen erst, wenn du die Abrechnung aufschiebst oder nur einen Teil
          zahlst. Genau diese Möglichkeit ist der Kern des Vertrags: Du unterschreibst, dass die Bank
          Zinsen nehmen darf, falls dieser Fall eintritt.
        </p>
        <Begriff wort="Revolving" arabisch="">
          Die Abrechnung nicht vollständig zahlen, sondern nur einen Teil, und den Rest verzinst
          weiterlaufen lassen. In Deutschland heißt das oft Teilzahlungsfunktion. Es ist die teuerste
          Kreditform im Alltag.
        </Begriff>
      </>
    ),
  },
  {
    id: "zwei-meinungen",
    titel: "Zwei Meinungen unter Gelehrten",
    inhalt: (
      <>
        <Frage>Wenn ich immer pünktlich alles zahle, ist die Karte dann in Ordnung?</Frage>
        <p>
          Genau an dieser Frage teilen sich zeitgenössische Gelehrte in zwei Lager. Beide gehen von
          derselben Tatsache aus, dass nämlich Zinsen anfallen können, aber nicht müssen.
        </p>
        <Gegenueber
          links={{
            titel: "Erste Meinung: haram",
            ton: "rot",
            punkte: [
              "Mit der Unterschrift stimmst du zu, dass die Bank unter bestimmten Umständen Zinsen von dir nehmen darf.",
              "Ein Vertrag, der Zinsen erlaubt, ist für einen Muslim nicht gültig, unabhängig davon, ob der Fall eintritt.",
              "Ob du es schaffst, immer pünktlich zu zahlen, ändert nichts an dem, was du unterschrieben hast.",
              "Das ist die Grundsatzmeinung, und Gelehrte empfehlen verbreitet, ihr zu folgen.",
            ],
          }}
          rechts={{
            titel: "Zweite Meinung: bei echter Dringlichkeit",
            ton: "gelb",
            punkte: [
              "Erlaubt nur, wenn ohne die Karte eine echte Erschwernis entsteht, nicht bei Bequemlichkeit.",
              "Bedingung: Du musst nahezu sicher sein, jeden Cent bei Rechnungsstellung begleichen zu können.",
              "Strengere Vertreter setzen noch eine Grenze: nur für das, was anders wirklich nicht geht.",
              "Auch die Vertreter dieser Meinung formulieren sehr vorsichtig.",
            ],
          }}
        />
        <p>
          Der Fachbegriff für die Dringlichkeit ist <B>Hajah</B>. Er meint eine spürbare Erschwernis, nicht
          eine Unannehmlichkeit. „Ich hätte gerne“ reicht ausdrücklich nicht, und der Wunsch nach Meilen,
          Punkten oder einer Reiseversicherung erst recht nicht.
        </p>
        <Begriff wort="Dringlichkeit" arabisch="Ḥāja">
          Eine Lage, in der das Verbotene zu meiden zu einer echten Erschwernis führt. Sie steht eine Stufe
          unter der Notwendigkeit (Ḍarūra), bei der Leib, Leben oder Existenz auf dem Spiel stehen. Die
          Einordnung eines konkreten Falls nimmt ein Gelehrter vor, nicht der Betroffene selbst.
        </Begriff>
        <Merksatz>
          Wer sich in einer Dringlichkeitslage sieht, fragt einen Gelehrten, dem er vertraut. Niemand gibt
          sich seine eigene Fatwa.
        </Merksatz>
      </>
    ),
  },
  {
    id: "grenzen",
    titel: "Wo die Debitkarte wirklich an ihre Grenzen kommt",
    inhalt: (
      <>
        <p>
          In den allermeisten Fällen ersetzt eine Debitkarte die Kreditkarte vollständig. Sie nimmt am
          Visa- oder Mastercard-System teil, funktioniert im Ausland, am Geldautomaten und bei den meisten
          Online-Buchungen. Es gibt aber echte Lücken, und die soll man kennen, statt sie zu bestreiten.
        </p>
        <Faelle
          faelle={[
            {
              titel: "Kaution beim Mietwagen",
              ton: "rot",
              wort: "geht meist nicht",
              text: "Eine Kaution wird auf der Karte blockiert, nicht abgebucht. Bei einer Debitkarte kann der Vermieter nicht sicher sein, dass das Geld später noch da ist. Manche Banken können einen Betrag auf dem Konto sperren, aber nicht alle, und nicht jeder Vermieter akzeptiert das.",
            },
            {
              titel: "Hotels im Ausland",
              ton: "gelb",
              wort: "unterschiedlich",
              text: "Viele Hotels akzeptieren Debitkarten, manche nicht, und einige verlangen zusätzlich eine Kreditkarte für die Kaution. Vorher schriftlich anfragen kostet fünf Minuten und erspart die Diskussion an der Rezeption.",
            },
            {
              titel: "Einzelne Zahlterminals",
              ton: "gelb",
              wort: "selten",
              text: "Nicht jedes Terminal nimmt jede Debitkarte an, vor allem außerhalb Europas. Wer viel reist, sollte eine zweite Karte einer anderen Bank dabeihaben statt einer Kreditkarte.",
            },
            {
              titel: "Zusatzleistungen und Punkte",
              ton: "gruen",
              wort: "kein Grund",
              text: "Reiserücktritts- und Rechtsschutzversicherung, Meilen und Punkteprogramme gibt es bei Debitkarten meist nicht. Das ist ein Komfortverlust, keine Erschwernis. Eine Reiseversicherung lässt sich einzeln abschließen, und ein Punkteprogramm ist kein Grund für einen Zinsvertrag.",
            },
          ]}
        />
      </>
    ),
  },
  {
    id: "schuldenfalle",
    titel: "Der Grund, aus dem viele Leute damit Geld verlieren",
    inhalt: (
      <>
        <p>
          Es gibt neben der islamischen Frage einen zweiten Grund, vorsichtig zu sein, und der trifft alle
          gleichermaßen. Ein Kreditrahmen fühlt sich an wie Guthaben. Er ist keins.
        </p>
        <Beispiel
          titel="Warum der Rahmen täuscht"
          rechnung={["Kontostand: 800 €", "Kreditrahmen der Karte: 5.000 €", "Was dir gehört: 800 €"]}
          ergebnis="Wer den Rahmen als Plus liest, gibt Geld aus, das er nicht hat."
        >
          <p>
            Der Rahmen ist eine Zusage der Bank, dir Geld zu leihen. Am Abrechnungstag steht die volle
            Summe auf einmal auf dem Konto zur Abbuchung. Wer dann nicht zahlen kann, landet in der
            Teilzahlung, und dort beginnen die Zinsen.
          </p>
        </Beispiel>
        <p>
          Wer sich für die zweite Meinung entscheidet und eine Karte führt, sollte deshalb so mit ihr
          umgehen, als leihe er sich bei jedem Einkauf Geld bei der Bank. Denn genau das tut er. Wie du
          aus dem Minus wieder herauskommst, steht in{" "}
          <L to="/wissen/dispo-und-schulden">Dispo und Schulden</L>.
        </p>
      </>
    ),
  },
  {
    id: "praktisch",
    titel: "Was du praktisch machst",
    inhalt: (
      <>
        <Checkliste
          punkte={[
            { art: "ja", text: "Nachsehen, was du hast. Auf der Karte oder im Vertrag steht Debit oder Credit. Das Visa-Logo sagt nichts." },
            { art: "ja", text: "Eine Debitkarte zu einem Konto ohne Zinsen nehmen. Damit ist der Alltag vollständig abgedeckt." },
            { art: "ja", text: "Für Reisen eine zweite Debitkarte einer anderen Bank mitnehmen, statt für den Ausnahmefall eine Kreditkarte zu beantragen." },
            { art: "ja", text: "Bei Mietwagen vorher fragen, ob eine Kaution per Debitkarte oder in bar möglich ist. Manche Anbieter machen das, es steht nur nie auf der Startseite." },
            { art: "nein", text: "Keine Teilzahlungsfunktion aktivieren, unter keinen Umständen. Das ist der Punkt, an dem aus einer Karte ein teurer Kredit wird." },
            { art: "nein", text: "Keine Karte wegen Meilen, Punkten oder Versicherungen. Das ist Bequemlichkeit, keine Dringlichkeit." },
            { art: "neutral", text: "Wenn du wirklich in einer Lage bist, in der es ohne Kreditkarte nicht geht: einen Gelehrten fragen, dem du vertraust, statt selbst zu entscheiden." },
          ]}
        />
        <p>
          Wenn du schon eine Kreditkarte hast und sie kündigen willst: Erst die offene Abrechnung
          vollständig ausgleichen, dann schriftlich kündigen, dann prüfen, ob am Konto noch ein Dispo
          hängt. Der wird beim Kündigen der Karte oft übersehen.
        </p>
      </>
    ),
  },
];

const faq: BeitragFrage[] = [
  {
    frage: "Ist eine Kreditkarte haram?",
    antwort:
      "Dazu gibt es zwei Meinungen. Die erste sagt haram, weil du mit der Unterschrift zustimmst, dass die Bank in bestimmten Fällen Zinsen nehmen darf; Gelehrte empfehlen verbreitet, dieser Meinung zu folgen. Die zweite erlaubt die Karte bei einer echten Dringlichkeit und unter der Bedingung, dass du nahezu sicher jede Abrechnung vollständig begleichen kannst.",
  },
  {
    frage: "Ist eine Debitkarte halal?",
    antwort:
      "Nach verbreiteter Auffassung ja. Bei einer Debitkarte gibst du dein eigenes Guthaben aus, es entsteht kein Darlehen und keine Zinsmöglichkeit. Die Karte teilt das Urteil des Kontos, an dem sie hängt. Auch Ausstellungs- und Jahresgebühren gelten als unproblematisch, weil damit eine Dienstleistung bezahlt wird.",
  },
  {
    frage: "Woran erkenne ich, ob ich eine Debit- oder eine Kreditkarte habe?",
    antwort:
      "Nicht am Visa- oder Mastercard-Logo, denn beide Anbieter geben beide Kartenarten heraus. Auf der Karte selbst steht meist klein Debit oder Credit. Der zweite Test: Wird der Betrag sofort vom Konto abgebucht, ist es eine Debitkarte. Kommt eine gesammelte Abrechnung im Folgemonat, ist es eine Kreditkarte.",
  },
  {
    frage: "Sind Zinsen auch dann ein Problem, wenn ich nie welche zahle?",
    antwort:
      "Für die erste Meinung ja, weil der Vertrag die Zinsen erlaubt und damit als ungültig gilt. Für die zweite Meinung ist genau die vollständige und pünktliche Zahlung die Bedingung, unter der die Karte in einer Dringlichkeitslage in Frage kommt. Wer diese Bedingung nicht sicher erfüllen kann, für den bleibt sie auch nach der zweiten Meinung nicht erlaubt.",
  },
  {
    frage: "Kann eine Debitkarte eine Kreditkarte ersetzen?",
    antwort:
      "In den allermeisten Fällen ja, weil sie am Visa- oder Mastercard-System teilnimmt und im Ausland, am Automaten und online funktioniert. Echte Lücken gibt es bei Kautionen, etwa beim Mietwagen, bei einzelnen Hotels und bei manchen Zahlterminals außerhalb Europas.",
  },
  {
    frage: "Was ist mit den Punkten und Versicherungen einer Kreditkarte?",
    antwort:
      "Sie sind kein Argument. Reiseversicherungen lassen sich einzeln abschließen, und Punkte oder Meilen sind Komfort, keine Erschwernis. Die zweite Gelehrtenmeinung stellt ausdrücklich darauf ab, dass ohne die Karte eine echte Schwierigkeit entstehen muss.",
  },
  {
    frage: "Was ist die Teilzahlungsfunktion?",
    antwort:
      "Die Möglichkeit, die Abrechnung nicht vollständig, sondern nur in Teilen zu zahlen. Der Rest läuft verzinst weiter, oft zu sehr hohen Sätzen. Das ist genau der Fall, in dem aus einer Kreditkarte ein Zinskredit wird, und deshalb sollte diese Funktion nicht aktiviert sein.",
  },
  {
    frage: "Wie werde ich eine Kreditkarte wieder los?",
    antwort:
      "Zuerst die offene Abrechnung vollständig ausgleichen, dann die Karte schriftlich kündigen und eine Bestätigung verlangen. Danach prüfen, ob am Girokonto noch ein eingeräumter Dispo besteht, der wird dabei häufig übersehen und bleibt sonst bestehen.",
  },
];

const beschreibung =
  "Debitkarte oder Kreditkarte, das ist die eigentliche Frage. Warum die Debitkarte das Urteil des Kontos teilt, welche zwei Meinungen es zur Kreditkarte gibt, wo die Debitkarte wirklich an Grenzen kommt und warum ein Kreditrahmen kein Guthaben ist.";

const KreditkarteHalal = () => (
  <>
    <Seo
      title="Kreditkarte oder Debitkarte: was gilt islamisch? | finanzmuslim"
      description={beschreibung}
      path="/wissen/kreditkarte-halal"
      jsonLd={beitragJsonLd({
        titel: "Kreditkarte und Debitkarte",
        beschreibung,
        path: "/wissen/kreditkarte-halal",
        datePublished: "5. September 2026",
        dateModified: "5. September 2026",
        faq,
      })}
    />
    <BeitragSeite
      slug="kreditkarte-halal"
      titel="Kreditkarte und Debitkarte"
      untertitel="Zwei Karten mit demselben Logo, zwei völlig verschiedene Urteile."
      kurzGesagt={[
        "Visa und Mastercard sind keine Kartenart. Darunter liegt entweder eine Debitkarte oder eine Kreditkarte.",
        "Die Debitkarte gibt dein eigenes Geld aus und teilt das Urteil deines Kontos. Gebühren dafür sind unproblematisch.",
        "Bei der Kreditkarte gibt es zwei Meinungen: haram wegen des Zinsvertrags, oder erlaubt bei echter Dringlichkeit.",
        "Die zweite Meinung verlangt, dass du jede Abrechnung nahezu sicher vollständig begleichen kannst.",
        "Ein Kreditrahmen ist kein Guthaben. Genau dieses Missverständnis macht die Karte zur Schuldenfalle.",
      ]}
      abschnitte={abschnitte}
      faq={faq}
      datePublished="5. September 2026"
      dateModified="5. September 2026"
      boxMitteNach={3}
      rechtshinweis="Dieser Beitrag gibt bekannte Positionen wieder und dient ausschließlich zu Bildungszwecken. Er ist keine Fatwa und keine Rechts- oder Finanzberatung. Zum Urteil über die Kreditkarte bestehen unter zeitgenössischen Gelehrten unterschiedliche Auffassungen; die Einordnung eines konkreten Falls als Dringlichkeit nimmt ein Gelehrter vor. Beschreibungen von Kartenprodukten, Abrechnungsterminen und Zusatzleistungen beziehen sich auf den Marktstand 2026 und können sich je nach Bank unterscheiden."
      boxOben={{
        kategorie: "Girokonto",
        ueberschrift: "Welches Konto passt zu dir?",
        text: "Beantworte ein paar einfache Fragen. Du siehst, welche Konten ohne Zinsen und ohne Dispo auskommen.",
        knopf: "Jetzt herausfinden",
        linkZiel: "/vergleich/start",
      }}
      boxMitte={{
        kategorie: "Vorlage",
        ueberschrift: "Vertragsklauseln, an denen es kippt",
        linkZiel: "/vorlagen/vertrags-ampel",
        text: "Woran du im Kleingedruckten eine Zinsklausel erkennst.",
        knopf: "Zur Vertrags-Ampel",
      }}
    >
      <PasstDazu
        punkte={[
          { to: "/wissen/girokonto-ohne-zinsen", name: "Girokonto ohne Zinsen", text: "stellt das Konto um, an dem deine Karte hängt." },
          { to: "/wissen/dispo-und-schulden", name: "Dispo und Schulden", text: "zeigt den Weg heraus, wenn schon etwas offen ist." },
          { to: "/wissen/zinsen-im-islam", name: "Zinsen im Islam", text: "erklärt, warum ein Zinsvertrag auch ohne gezahlte Zinsen ein Problem ist." },
          { to: "/wissen/ratenzahlung-haram", name: "Ratenkauf", text: "beantwortet dieselbe Frage für Käufe an der Kasse." },
        ]}
      />
    </BeitragSeite>
  </>
);

export default KreditkarteHalal;
