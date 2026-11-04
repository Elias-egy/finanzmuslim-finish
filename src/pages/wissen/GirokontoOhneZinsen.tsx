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
          Hast du Rücklagen, Gold oder Geld auf einem anderen Konto, bist du gehalten, das Minus damit
          auszugleichen. Jeder neue Gang ins Minus zählt für sich.
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
              text: "Im Online-Banking unter Dispositionskredit oder Überziehungsrahmen, auf null. Dann rutschst du nie mehr ins Minus.",
            },
            {
              titel: "Verzinste Konten auflösen",
              text: "Tagesgeld, Festgeld, Sparbuch kündigen, Verzinsung am Girokonto abwählen. Kommen trotzdem Zinsen, gib sie weg, ohne Belohnung zu erwarten.",
            },
            {
              titel: "Kreditkarte auf volle Abrechnung stellen",
              text: "Die Teilzahlung ausschalten, dann wird jeden Monat alles abgebucht, ohne Zinsen. Einfacher ist eine Debitkarte, die sofort vom Konto abbucht.",
            },
            {
              titel: "Keine Bonusaktionen mitnehmen",
              text: "Wenn eine Bank Geld dafür zahlt, dass du Geld einzahlst oder die Karte benutzt, lass es liegen. Warum, steht im nächsten Abschnitt.",
            },
            {
              titel: "Freistellungsauftrag prüfen",
              text: "Kostet nichts, ist nicht verboten: Auf Erträge bis zu einem Freibetrag geht dann keine Steuer ab. Wichtig, sobald du ein Depot hast.",
            },
            {
              titel: "Angehängte Verträge durchsehen",
              text: "Bausparvertrag, Lebensversicherung, Riester. Was davon läuft, gehört auf den Prüfstand. Der Halal Vertrags-Check ordnet sie ein.",
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
          Kommt darauf an, wofür. Zahlt die Bank dir Geld dafür, dass du <B>Geld einzahlst</B>, eine Summe
          liegen lässt oder die Karte oft benutzt, ist das ein Zuschlag auf dein Guthaben: Zins unter anderem Namen.
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
          Nach der Auffassung der Mehrheit ist dein Girokonto rechtlich <B>ein Darlehen an die Bank</B>: Sie
          arbeitet mit deinem Geld und schuldet dir denselben Betrag zurück. Daraus folgt eine Abstufung:
        </p>
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
        <p>Bei der Bankwahl zählt nicht das Wort islamisch im Namen, sondern:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Verlangt sie Kontoführungsgebühren?</li>
          <li>Vergibt sie selbst Kredite gegen Zinsen?</li>
          <li>Kann sie, was du brauchst, etwa Bargeld einzahlen für dein Gewerbe?</li>
        </ul>
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
          Nein. Beim Girokonto fallen Zinsen an, ohne dass du sie wolltest. Ein Tagesgeldkonto eröffnest du
          <B> dafür</B>, und die Zinsen wegzugeben heilt nicht den Vertrag, den du unterschrieben hast.
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
          Ja, eine: die <B>KT Bank AG</B> in Frankfurt, eine Tochter der türkischen Kuveyt Türk, seit 2015 mit
          deutscher Vollbanklizenz. Statt Geld zu verleihen, kauft sie Waren und verkauft sie mit Aufschlag
          weiter. Einlagen sind bis 100.000 Euro gesichert wie bei jeder deutschen Bank.
        </p>
        <p>
          <B>Vor dem Wechsel:</B> Die BaFin hat im Juli 2026 Auflagen gegen die Bank verhängt, wegen Mängeln in
          der Geldwäscheprävention, nicht wegen des islamischen Geschäftsmodells. Die Bank ist zudem klein und
          hat wenige Filialen.
        </p>
        <p>
          Wir empfehlen sie nicht, weil wir sie nicht selbst getestet haben.
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
      path="/blog/girokonto-ohne-zinsen"
      jsonLd={beitragJsonLd({
        titel: "Girokonto ohne Zinsen",
        beschreibung,
        path: "/blog/girokonto-ohne-zinsen",
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
      rechtshinweis="Dieser Beitrag dient zu Bildungszwecken, ist keine Fatwa und keine Rechts- oder Anlageberatung. Zu einzelnen Punkten, besonders zum Konto bei normalen Banken, gibt es unter Gelehrten abweichende Auffassungen."
      boxOben={{
        kategorie: "Girokonto",
        ueberschrift: "Welches Konto passt zu dir?",
        text: "Beantworte ein paar einfache Fragen. Du siehst, welche Konten ohne Zinsen und ohne Dispo auskommen.",
        knopf: "Jetzt herausfinden",
        linkZiel: "/vergleich/start",
      }}
      boxMitte={{
        kategorie: "Depot",
        ueberschrift: "Damit dein Geld nicht jedes Jahr weniger wert wird",
        linkZiel: "/vergleich/depot",
      }}
    >
      <PasstDazu
        punkte={[
          { to: "/blog/zinsen-im-islam", name: "Zinsen im Islam", text: "erklärt, was genau verboten ist und was ausdrücklich nicht." },
          { to: "/vorlagen/vertrags-ampel", name: "Der Halal Vertrags-Check", text: "ordnet Girokonto, Kreditkarte, Dispo und neun weitere Verträge ein." },
          { to: "/blog/halal-etf", name: "Beste Halal ETFs 2026", text: "zeigt, wohin dein Geld statt aufs Konto kann." },
          { to: "/inflationsrechner", name: "Der Inflationsrechner", text: "rechnet aus, was Liegenlassen dich über die Jahre kostet." },
        ]}
      />
    </BeitragSeite>
  </>
);

export default GirokontoOhneZinsen;
