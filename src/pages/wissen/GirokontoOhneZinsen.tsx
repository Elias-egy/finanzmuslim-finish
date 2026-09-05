import Seo, { beitragJsonLd } from "@/components/Seo";
import BeitragSeite, { type BeitragAbschnitt, type BeitragFrage } from "@/components/BeitragSeite";
import { IlluDepot, IlluDispo } from "@/components/illu";
import {
  B,
  Beispiel,
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
    id: "die-antwort",
    titel: "Ein Girokonto ist erlaubt. Fünf Dinge daran sind es nicht",
    inhalt: (
      <>
        <p>
          Ein Girokonto wickelt deinen Alltag ab. Du gibst dein Geld ab, die Bank hält es bereit, du holst es
          dir wieder. Ohne Konto ist ein Leben in Deutschland nicht möglich. Miete, Lohn, Versicherung, alles
          läuft darüber.
        </p>
        <Merksatz>Das Konto ist nicht das Problem. Fünf Funktionen daran sind es.</Merksatz>
        <Checkliste
          punkte={[
            {
              art: "nein",
              text: (
                <>
                  <B>Der Dispo.</B> Sobald du ins Minus rutschst, laufen Zinsen. Der teuerste Kredit, den es
                  gibt, oft im zweistelligen Bereich.
                </>
              ),
            },
            {
              art: "nein",
              text: (
                <>
                  <B>Zinsen, die du bekommst.</B> Manche Konten verzinsen Guthaben oder haben ein
                  Tagesgeldkonto angehängt.
                </>
              ),
            },
            {
              art: "nein",
              text: (
                <>
                  <B>Die Kreditkarte mit Teilzahlung.</B> Oft standardmäßig aktiv. Wer nicht den vollen Betrag
                  ausgleicht, zahlt Zinsen.
                </>
              ),
            },
            {
              art: "nein",
              text: (
                <>
                  <B>Der Neukundenbonus.</B> Die 100 Euro dafür, dass du Geld einzahlst oder die Karte
                  benutzt. Dazu unten mehr, das übersehen fast alle.
                </>
              ),
            },
            {
              art: "nein",
              text: (
                <>
                  <B>Angehängte Produkte.</B> Bausparvertrag, Ratenkredit, Lebensversicherung, die einem beim
                  Beratungsgespräch mitverkauft werden.
                </>
              ),
            },
          ]}
        />
        <p>
          Die gute Nachricht: Alle fünf lassen sich abstellen. Meistens in weniger als zehn Minuten, im
          Online-Banking, ohne mit jemandem zu sprechen.
        </p>
      </>
    ),
  },
  {
    id: "dispo",
    titel: "Der Dispo ist der wichtigste Punkt",
    inhalt: (
      <>
        <Frage>Ich bin doch nur zwei Tage im Minus, bis der Lohn kommt. Zählt das schon?</Frage>
        <p>
          Ja. Dispozinsen werden <B>tagesgenau</B> berechnet. Es gibt keine Kulanzgrenze und keinen Freibetrag
          von ein paar Tagen. Der erste Tag im Minus ist schon Zins, auch wenn am Monatsende nur ein paar Cent
          abgebucht werden.
        </p>
        <Bild text="Im Minus läuft der Zins jeden Tag mit. Nicht erst ab einer bestimmten Summe und nicht erst ab einer bestimmten Dauer.">
          <IlluDispo />
        </Bild>
        <Beispiel
          titel="Was 500 Euro im Minus kosten"
          rechnung={["500 € × 12 % ÷ 365 × 40 Tage = 6,58 €"]}
          ergebnis="Klingt nach wenig. Wer jeden Monat so lebt, zahlt im Jahr rund 60 Euro dafür, dass er zu früh dran war."
        >
          <p>Zahlen als Beispiel, Dispozinssätze liegen je nach Bank zwischen etwa 9 und 14 Prozent.</p>
        </Beispiel>
        <p>
          Und noch etwas, das ungemütlich, aber wichtig ist: Wer Rücklagen hat, Gold im Schrank oder Geld auf
          einem anderen Konto, ist gehalten, damit das Minus auszugleichen, statt es laufen zu lassen. Und wer
          es einmal ausgeglichen hat und danach wieder hineinrutscht, obwohl er es hätte vermeiden können,
          fängt nicht bei null an. Jeder neue Gang ins Minus ist ein eigener Vorgang.
        </p>
        <Hinweis titel="Kündigen, nicht nur vermeiden">
          <p>
            Den Dispo einfach nicht zu nutzen reicht nicht, solange er eingeräumt ist. Setz den Rahmen aktiv
            auf null. Rechne damit, dass die Bank abrät, das ist ihr Geschäft. Es ist trotzdem dein Konto.
          </p>
        </Hinweis>
      </>
    ),
  },
  {
    id: "was-tun",
    titel: "Was du heute umstellen kannst",
    inhalt: (
      <>
        <p>Der Reihe nach, das dauert zusammen keine Viertelstunde.</p>
        <Schritte
          schritte={[
            {
              titel: "Dispo auf null setzen",
              text: "Im Online-Banking unter den Kontoeinstellungen, oft heißt es Dispositionskredit oder Überziehungsrahmen. Auf null. Damit kannst du gar nicht mehr ins Minus rutschen, und die Frage stellt sich nie wieder.",
            },
            {
              titel: "Verzinste Konten auflösen",
              text: "Tagesgeld, Festgeld, Sparbuch kündigen und die Verzinsung am Girokonto abwählen. Bekommst du trotzdem noch Zinsen gutgeschrieben, rechne sie zusammen und gib sie weg, ohne dafür eine Belohnung zu erwarten.",
            },
            {
              titel: "Kreditkarte auf volle Abrechnung stellen",
              text: "Die Teilzahlung, oft Revolving genannt, ausschalten. Dann wird jeden Monat der gesamte Betrag abgebucht und es fallen keine Zinsen an. Eine Debitkarte, die sofort vom Konto abbucht, ist die einfachere Lösung.",
            },
            {
              titel: "Keine Bonusaktionen mitnehmen",
              text: "Wenn eine Bank Geld dafür zahlt, dass du Geld einzahlst oder die Karte benutzt, lass es liegen. Warum, steht im nächsten Abschnitt.",
            },
            {
              titel: "Freistellungsauftrag prüfen",
              text: "Er kostet nichts und ist nicht verboten. Er sorgt nur dafür, dass auf Erträge bis zum Freibetrag keine Steuer abgeht. Wichtig wird er, sobald du ein Depot hast.",
            },
            {
              titel: "Angehängte Verträge durchsehen",
              text: "Bausparvertrag, Lebensversicherung, Riester. Was davon läuft, gehört auf den Prüfstand. Die Vertrags-Ampel ordnet sie ein.",
            },
          ]}
        />
      </>
    ),
  },
  {
    id: "bonus",
    titel: "Der Neukundenbonus, den fast alle mitnehmen",
    inhalt: (
      <>
        <Frage>100 Euro fürs Kontoeröffnen. Geschenkt ist doch geschenkt, oder?</Frage>
        <p>
          Kommt darauf an, wofür. Wenn die Bank dir Geld dafür zahlt, dass du <B>Geld einzahlst</B> oder eine
          bestimmte Summe liegen lässt, dann bekommst du einen Zuschlag auf dein eingezahltes Geld. Genau das
          ist die Sache, um die es beim Zins geht, nur unter einem anderen Namen. Dasselbe gilt für Prämien,
          die daran hängen, wie oft du die Karte benutzt.
        </p>
        <Hinweis titel="Was dagegen in Ordnung ist">
          <p>
            Eine <B>Weiterempfehlungsprämie</B>. Da bekommst du Geld dafür, dass du jemanden vermittelt hast,
            also für eine Leistung. Das ist eine ganz andere Sache als eine Prämie für dein Guthaben.
          </p>
        </Hinweis>
      </>
    ),
  },
  {
    id: "die-grosse-frage",
    titel: "Darf ich überhaupt bei einer normalen Bank sein?",
    inhalt: (
      <>
        <p>
          Diese Frage steht hinter allen anderen. Und die Antwort ist genauer, als man denkt. Nach der
          Auffassung der Mehrheit ist dein Girokonto rechtlich <B>ein Darlehen an die Bank</B>. Sie darf mit
          deinem Geld arbeiten und schuldet dir denselben Betrag zurück. Du bist also nicht bloß ein Kunde,
          der etwas verwahren lässt, du bist derjenige, der der Bank Geld gibt.
        </p>
        <p>Daraus folgt eine Abstufung, die vielen hilft:</p>
        <Checkliste
          punkte={[
            {
              art: "neutral",
              text: "Es gibt keine ernsthafte Alternative für das, was du brauchst. Dann ist das Konto nicht verboten, aber auch nichts, worauf man stolz ist. Es bleibt ein ungeliebter Zustand.",
            },
            {
              art: "nein",
              text: "Es gibt eine Alternative, die genauso professionell arbeitet und alles kann, was du brauchst. Dann fällt der Grund weg, bei der Zinsbank zu bleiben.",
            },
            {
              art: "neutral",
              text: "Kontoführungsgebühren sind kein Zins. Sie sind das Entgelt für eine Dienstleistung, und daran ist nichts auszusetzen.",
            },
          ]}
        />
        <p>
          Was für die Bankwahl folgt: Schau nicht auf das Wort islamisch im Namen, sondern auf drei Dinge.
          Verlangt sie Kontoführungsgebühren, vergibt sie selbst Kredite gegen Zinsen, und kann sie das, was du
          im Alltag wirklich brauchst? Wer ein Gewerbe hat, braucht vielleicht Bargeldeinzahlungen und eine
          Filiale. Für den ist eine reine Onlinebank keine Alternative, auch wenn sie sonst besser passen
          würde.
        </p>
        <Merksatz>
          Beide Seiten sind sich in einem Punkt einig: Was du selbst unterschreibst, verantwortest du. Da hört
          jede Notwendigkeit auf.
        </Merksatz>
      </>
    ),
  },
  {
    id: "sparkonten",
    titel: "Tagesgeld und Festgeld: hier hört es auf",
    inhalt: (
      <>
        <p>
          Beim Girokonto lässt sich mit der Unvermeidbarkeit argumentieren. Bei einem Tagesgeldkonto, einem
          Festgeldkonto oder einem Sparbuch nicht. Diese Konten haben genau einen Zweck, und der steht in
          ihrem Namen: Geld hinlegen, damit es mehr wird.
        </p>
        <Frage>Reicht es nicht, wenn ich die Zinsen einfach weggebe?</Frage>
        <p>
          Nein, und das ist der Punkt, an dem sich die Sache vom Girokonto unterscheidet. Beim Girokonto
          fallen Zinsen an, ohne dass du sie wolltest. Ein Tagesgeldkonto eröffnest du <B>dafür</B>. Die
          Zinsen wegzugeben heilt nicht den Vertrag, den du dafür unterschrieben hast. Ehrlich gefragt: Wenn
          du das Geld ohnehin weitergibst, warum hast du das Konto dann?
        </p>
      </>
    ),
  },
  {
    id: "islamische-bank",
    titel: "Gibt es eine islamische Bank in Deutschland?",
    inhalt: (
      <>
        <p>
          Ja, eine. Die <B>KT Bank AG</B> mit Sitz in Frankfurt, eine Tochter der türkischen Kuveyt Türk, hat
          2015 die deutsche Vollbanklizenz erhalten und war damit die erste Bank dieser Art im Euroraum. Sie
          arbeitet nach dem Handelsmodell: Statt Geld zu verleihen, kauft sie Waren und verkauft sie mit einem
          Aufschlag weiter. Einlagen sind dort bis 100.000 Euro über die deutsche Einlagensicherung gedeckt,
          wie bei jeder anderen deutschen Bank auch.
        </p>
        <p>
          <B>Was du wissen solltest, bevor du wechselst:</B> Die BaFin hat im Juli 2026 Auflagen und Maßnahmen
          gegen die Bank verhängt, wegen Mängeln in der Geldwäscheprävention. Das steht in mehreren
          Presseberichten und betrifft nicht das islamische Geschäftsmodell, sondern die internen Kontrollen.
          Die Bank ist außerdem sehr klein, das Filialnetz ist dünn, und beim Bedienkomfort liegt sie hinter
          den großen Anbietern.
        </p>
        <p>
          <B>Unser Stand:</B> Wir haben die KT Bank nicht selbst geprüft und empfehlen sie deshalb nicht. Wenn
          du dich dafür interessierst, sieh dir die Bedingungen und den aktuellen Stand selbst an.
        </p>
      </>
    ),
  },
  {
    id: "was-ein-konto-nicht-kann",
    titel: "Was ein Girokonto nicht kann",
    inhalt: (
      <>
        <p>
          Ein zinsfreies Girokonto löst das Zinsproblem. Es löst nicht das eigentliche Problem, und das ist ein
          anderes: <B>Geld auf dem Konto wird jedes Jahr weniger wert.</B>
        </p>
        <Beispiel
          titel="Der Preis fürs Liegenlassen"
          rechnung={["10.000 € · 2 % Inflation · 10 Jahre → rund 8.200 € Kaufkraft"]}
          ergebnis="Ohne dass du einen Cent ausgegeben hast."
        />
        <p>
          Der Ausweg führt nicht über Zinsen, sondern über Sachwerte. Anteile an Firmen, Gold, Immobilien.
          Alles davon ist zugänglich, ohne dass irgendwo ein Zins mitläuft. Dafür brauchst du ein Depot, und
          das ist etwas anderes als ein Konto.
        </p>
        <Bild text="Auf dem Konto liegt Geld. Im Depot liegen Anteile. Der Unterschied entscheidet, ob dein Geld weniger wert wird oder nicht.">
          <IlluDepot />
        </Bild>
      </>
    ),
  },
];

const faq: BeitragFrage[] = [
  {
    frage: "Ist ein Girokonto bei einer normalen Bank haram?",
    antwort:
      "Nach der Auffassung der Mehrheit ist dein Guthaben rechtlich ein Darlehen an die Bank. Solange es keine ernsthafte Alternative gibt, die das kann, was du brauchst, ist das Konto nicht verboten, aber auch kein guter Zustand. Gibt es eine gleichwertige Alternative, fällt der Grund weg. Was du selbst unterschreibst, etwa einen Dispo oder ein Festgeld, verantwortest du in jedem Fall selbst.",
  },
  {
    frage: "Ist der Dispo schon Zins, wenn ich nur zwei Tage im Minus bin?",
    antwort:
      "Ja. Dispozinsen werden tagesgenau berechnet, es gibt keine Kulanzfrist. Wer Rücklagen hat, ist gehalten, damit auszugleichen. Der sicherste Weg ist, den Dispo aktiv auf null zu setzen statt ihn nur nicht zu nutzen.",
  },
  {
    frage: "Darf ich einen Neukundenbonus mitnehmen?",
    antwort:
      "Wenn die Prämie daran hängt, dass du Geld einzahlst, eine Summe liegen lässt oder die Karte oft benutzt, ist sie ein Zuschlag auf dein Guthaben und damit dasselbe wie Zins. Eine Weiterempfehlungsprämie ist etwas anderes, dort wird eine Leistung vergütet.",
  },
  {
    frage: "Reicht es, wenn ich die Zinsen vom Tagesgeldkonto weggebe?",
    antwort:
      "Beim Girokonto fallen Zinsen an, ohne dass du sie wolltest. Ein Tagesgeld-, Festgeld- oder Sparkonto eröffnest du genau dafür. Die Zinsen wegzugeben ändert nichts an dem Vertrag, den du dafür geschlossen hast. Solche Konten werden aufgelöst.",
  },
  {
    frage: "Sind Kontoführungsgebühren erlaubt?",
    antwort:
      "Ja. Eine Gebühr ist das Entgelt für eine Dienstleistung, kein Zins. Sie ist ein Kostenpunkt beim Vergleich, kein religiöses Problem.",
  },
  {
    frage: "Gibt es ein islamisches Girokonto in Deutschland?",
    antwort:
      "Die KT Bank AG in Frankfurt arbeitet nach islamischen Grundsätzen und hat seit 2015 eine deutsche Vollbanklizenz. Wir haben sie nicht geprüft und empfehlen sie nicht. Zu beachten ist, dass die BaFin im Juli 2026 Auflagen wegen Mängeln in der Geldwäscheprävention verhängt hat.",
  },
  {
    frage: "Ist eine Kreditkarte erlaubt?",
    antwort:
      "Eine Karte, bei der der volle Betrag jeden Monat abgebucht wird und keine Zinsen anfallen, wird von vielen als unproblematisch angesehen. Andere halten schon die Unterschrift unter einen Vertrag mit Zinsklausel für das Problem. Die Teilzahlungsfunktion arbeitet in jedem Fall mit Zinsen. Am einfachsten ist eine Debitkarte, die sofort vom Konto abbucht.",
  },
  {
    frage: "Sollte ich mein Geld dann lieber bar zu Hause haben?",
    antwort:
      "Nein. Bargeld zu Hause verliert genauso an Wert und ist zusätzlich Diebstahl und Feuer ausgesetzt. Das Konto ist der sicherere Ort, es ist nur nicht der richtige Ort für Geld, das du längere Zeit nicht brauchst.",
  },
];

const beschreibung =
  "Ein Girokonto ist erlaubt. Problematisch sind Dispo, Guthabenzinsen, Kreditkarten-Teilzahlung, Neukundenboni und angehängte Verträge. Sechs Handgriffe, dazu der Stand zur KT Bank in Deutschland.";

const GirokontoOhneZinsen = () => (
  <>
    <Seo
      title="Girokonto ohne Zinsen: Was du in zehn Minuten umstellst | finanzmuslim"
      description={beschreibung}
      path="/wissen/girokonto-ohne-zinsen"
      jsonLd={beitragJsonLd({
        titel: "Girokonto ohne Zinsen",
        beschreibung,
        path: "/wissen/girokonto-ohne-zinsen",
        datePublished: "16. August 2026",
        dateModified: "5. September 2026",
        faq,
      })}
    />
    <BeitragSeite
      slug="girokonto-ohne-zinsen"
      titel="Girokonto ohne Zinsen"
      untertitel="Sechs Handgriffe im Online-Banking, für die du mit niemandem sprechen musst."
      kurzGesagt={[
        "Ein Girokonto ist erlaubt. Fünf Funktionen daran sind das Problem.",
        "Dispo auf null setzen ist der wichtigste einzelne Handgriff. Zinsen laufen tagesgenau, es gibt keine Kulanzfrist.",
        "Tagesgeld, Festgeld und Sparbuch werden aufgelöst. Dort hilft es nicht, nur die Zinsen wegzugeben.",
        "Neukundenboni für Einlagen oder Kartennutzung sind ein Zuschlag auf dein Guthaben. Empfehlungsprämien nicht.",
        "Kontoführungsgebühren sind kein Zins, sondern der Preis für eine Dienstleistung.",
        "Ein zinsfreies Konto schützt nicht vor Inflation. Dafür brauchst du ein Depot.",
      ]}
      abschnitte={abschnitte}
      faq={faq}
      datePublished="16. August 2026"
      dateModified="5. September 2026"
      boxMitteNach={4}
      rechtshinweis="Dieser Beitrag gibt bekannte Positionen wieder und dient ausschließlich zu Bildungszwecken. Er ist keine Fatwa und ersetzt weder die Auskunft eines Gelehrten noch eine Rechts- oder Anlageberatung. Angaben zur KT Bank AG beruhen auf öffentlich zugänglichen Quellen, Stand August 2026, und sind keine Empfehlung. Innerhalb der Rechtsschulen gibt es zu einzelnen Punkten abweichende Auffassungen, besonders zur Frage der Kontoführung bei konventionellen Banken. Die Zahlen in den Beispielen sind erfunden."
      boxOben={{
        kategorie: "Girokonto",
        ueberschrift: "Konten ohne Dispo-Zwang im Vergleich",
        linkZiel: "/vergleiche",
      }}
      boxMitte={{
        kategorie: "Depot",
        ueberschrift: "Damit dein Geld nicht jedes Jahr weniger wert wird",
        linkZiel: "/vergleich/depot",
      }}
    >
      <PasstDazu
        punkte={[
          { to: "/wissen/zinsen-im-islam", name: "Zinsen im Islam", text: "erklärt, was genau verboten ist und was ausdrücklich nicht." },
          { to: "/vorlagen/vertrags-ampel", name: "Die Vertrags-Ampel", text: "ordnet Girokonto, Kreditkarte, Dispo und neun weitere Verträge ein." },
          { to: "/wissen/ratenzahlung-haram", name: "Ist Ratenzahlung haram?", text: "zeigt, worauf du an der Kasse achten musst." },
          { to: "/inflationsrechner", name: "Der Inflationsrechner", text: "rechnet aus, was Liegenlassen dich über die Jahre kostet." },
        ]}
      />
    </BeitragSeite>
  </>
);

export default GirokontoOhneZinsen;
