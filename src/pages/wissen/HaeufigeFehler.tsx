import type { ReactNode } from "react";
import Seo, { beitragJsonLd } from "@/components/Seo";
import BeitragSeite, { type BeitragAbschnitt, type BeitragFrage } from "@/components/BeitragSeite";
import { IlluDepot, IlluZins } from "@/components/illu";
import { B, Bild, Frage, Hinweis, L, Merksatz, PasstDazu, Schritte } from "@/components/beitrag";

/** Ein Fehler: was passiert, und was stattdessen. Die Nummer kommt aus der
 *  fortlaufenden Zählung über alle Abschnitte hinweg. */
const fehler = (problem: ReactNode, loesung: ReactNode): ReactNode => (
  <>
    <p>{problem}</p>
    <p className="mt-2 text-foreground">
      <B>Besser: </B>
      {loesung}
    </p>
  </>
);

const abschnitte: BeitragAbschnitt[] = [
  {
    id: "vorbereitung",
    titel: "Drei Fehler, bevor überhaupt etwas passiert",
    inhalt: (
      <>
        <p>Die teuersten Fehler stehen ganz am Anfang. Sie kosten kein Geld, sie kosten Jahre.</p>
        <Schritte
          start={1}
          schritte={[
            {
              titel: "Warten, bis alles geklärt ist",
              text: fehler(
                "Erst noch dieses Video, dann diese Frage, dann noch eine Meinung einholen. Nach zwei Jahren liegt das Geld immer noch auf dem Konto und hat still an Kaufkraft verloren.",
                <>
                  Mit einem kleinen Betrag anfangen, den du zur Not entbehren kannst, und mit einer Anlage,
                  deren Nachweis du gelesen hast. Wie viel das Warten kostet, zeigt der{" "}
                  <L to="/inflationsrechner">Inflationsrechner</L>.
                </>,
              ),
            },
            {
              titel: "Investieren, bevor die Schulden weg sind",
              text: fehler(
                "Wer einen Dispo oder einen Ratenkredit laufen hat und gleichzeitig anlegt, zahlt auf der einen Seite sicher Zinsen und hofft auf der anderen auf Rendite. Die Rechnung geht selten auf, und das Zinsgeschäft läuft weiter.",
                "Zuerst den Dispo auf null, dann teure Raten ablösen, danach anlegen. Das ist keine Anlagestrategie, das ist Aufräumen. Und es ist mehr als eine Empfehlung: Wer Rücklagen oder Gold hat, ist gehalten, damit zu tilgen, statt das Minus laufen zu lassen.",
              ),
            },
            {
              titel: "Keine Rücklage haben",
              text: fehler(
                "Wer alles anlegt, muss bei der ersten kaputten Waschmaschine wieder verkaufen. Oft genau dann, wenn die Kurse gerade unten sind.",
                "Drei bis sechs Monatsausgaben bleiben erreichbar auf dem Konto. Erst was darüber liegt, wird angelegt.",
              ),
            },
          ]}
        />
        <Bild text="Erst aufräumen, dann anlegen. Ein laufender Zins frisst die Rendite, bevor sie da ist.">
          <IlluZins />
        </Bild>
      </>
    ),
  },
  {
    id: "auswahl",
    titel: "Vier Fehler bei der Auswahl",
    inhalt: (
      <Schritte
        start={4}
        schritte={[
          {
            titel: "Dem Etikett vertrauen statt dem Nachweis",
            text: fehler(
              "Im Namen steht Islamic, also passt es. Manchmal stimmt das, manchmal bezieht sich der Nachweis nur auf den Index und nicht auf das Produkt, und manchmal ist er zwei Jahre alt.",
              <>
                Nachsehen, wer geprüft hat und wann. Bei jeder Anlage in der{" "}
                <L to="/halal-anlagen">Datenbank</L> steht das mit dabei, samt Link auf das Zertifikat, wo es
                eines gibt.
              </>,
            ),
          },
          {
            titel: "Die Screening-App als Freibrief nehmen",
            text: fehler(
              "Die App sagt grün, also ist die Sache erledigt. Diese Werkzeuge wenden Filter auf Bilanzzahlen an, sie sehen sich nicht jede Firma einzeln an. Es ist mehrfach vorgekommen, dass Cannabis-Firmen unter der Branche Pharma durchgerutscht sind oder ein Rüstungskonzern als bestanden angezeigt wurde.",
              "Die Zahlen aus der App nehmen, den Blick aufs Geschäft der Firma selbst behalten. Bei einem Namen, den du nicht kennst, kurz nachlesen, womit die Firma ihr Geld verdient.",
            ),
          },
          {
            titel: "Alles auf eine Aktie setzen",
            text: fehler(
              "Eine Firma besteht den Halal-Test, also fließt alles dorthin. Halal sagt aber nichts über die Qualität des Geschäfts und nichts über den Preis. Eine einzelne Firma kann jederzeit die Hälfte verlieren.",
              "Breit streuen. Ein Fonds hält hunderte geprüfte Firmen gleichzeitig, und das für einen Bruchteil der Arbeit.",
            ),
          },
          {
            titel: "Nur auf die Rendite der letzten Jahre schauen",
            text: fehler(
              "Was zuletzt am stärksten gestiegen ist, wirkt am überzeugendsten. Genau das ist der häufigste Grund, teuer einzusteigen.",
              "Auf Kosten, Fondsgröße und Nachweis schauen. Die vergangene Rendite ist die Zahl mit der geringsten Aussagekraft für morgen.",
            ),
          },
        ]}
      />
    ),
  },
  {
    id: "danach",
    titel: "Drei Fehler nach dem Kauf",
    inhalt: (
      <>
        <Schritte
          start={8}
          schritte={[
            {
              titel: "Das Verrechnungskonto vergessen",
              text: fehler(
                "Der ETF ist geprüft, das Geld daneben liegt auf einem verzinsten Verrechnungskonto. Damit läuft genau das Zinsgeschäft mit, das vermieden werden sollte.",
                <>
                  Beim Broker die Verzinsung abschalten, wo es geht. Welcher Anbieter das erlaubt, steht im{" "}
                  <L to="/vergleich/depot">Depot-Vergleich</L>.
                </>,
              ),
            },
            {
              titel: "Die Erträge nicht reinigen",
              text: fehler(
                "Auch geprüfte Firmen haben kleine Zinserträge. Der Anteil ist gering, aber er verschwindet nicht dadurch, dass ein Gremium den Fonds freigegeben hat.",
                <>
                  Einmal im Jahr den ausgewiesenen Satz auf deine Erträge rechnen und weitergeben, ohne dafür
                  eine Belohnung zu erwarten. Der <L to="/bereinigungsrechner">Bereinigungsrechner</L> macht das in
                  dreißig Sekunden. Zusammen mit der Zakat erledigt, vergisst man es nicht.
                </>,
              ),
            },
            {
              titel: "Beim ersten Rückgang verkaufen",
              text: fehler(
                "Der Kurs fällt um zwanzig Prozent, das Bauchgefühl sagt raus. Wer unten verkauft, macht aus einem Buchverlust einen echten. Das ist der teuerste Fehler überhaupt, und fast jeder macht ihn einmal.",
                "Vorher festlegen, wie lange das Geld liegen bleiben soll, und den Betrag so wählen, dass ein Rückgang auszuhalten ist. Wer nicht hinsehen muss, hält leichter durch.",
              ),
            },
          ]}
        />
        <Bild text="Der geprüfte Fonds ist die eine Hälfte. Das Konto daneben ist die andere.">
          <IlluDepot />
        </Bild>
      </>
    ),
  },
  {
    id: "alltag",
    titel: "Zwei Fehler, die neben dem Depot passieren",
    inhalt: (
      <>
        <Schritte
          start={11}
          schritte={[
            {
              titel: "Den Neukundenbonus mitnehmen",
              text: fehler(
                "100 Euro dafür, dass du ein Konto eröffnest und eine Summe einzahlst. Das fühlt sich an wie ein Geschenk, ist aber ein Zuschlag auf dein Guthaben, und damit dasselbe wie Zins. Dasselbe gilt für Prämien, die daran hängen, wie oft du die Karte benutzt.",
                <>
                  Solche Aktionen liegen lassen. Eine Weiterempfehlungsprämie ist etwas anderes, dort wird eine
                  Leistung vergütet. Mehr dazu in{" "}
                  <L to="/wissen/girokonto-ohne-zinsen">Girokonto ohne Zinsen</L>.
                </>,
              ),
            },
            {
              titel: "Die Zakat erst am Stichtag ausrechnen",
              text: fehler(
                "Wer anlegt, erhöht sein Vermögen, und damit steigt auch die Zakat. Viele merken das erst, wenn der Stichtag da ist und das Geld im Depot steckt.",
                <>
                  Einen festen Stichtag wählen, im islamischen Kalender notiert, und den Betrag vorher
                  ausrechnen, damit er bereitliegt. Wie viel es wird, zeigt der{" "}
                  <L to="/zakat-rechner">Zakat-Rechner</L>, die Grenze erklärt{" "}
                  <L to="/wissen/nisab">Nisab</L>.
                </>,
              ),
            },
          ]}
        />
        <Merksatz>
          Zwölf Fehler, und elf davon kosten nichts, wenn man sie vorher kennt. Der zwölfte kostet nur
          Aufmerksamkeit einmal im Jahr.
        </Merksatz>
      </>
    ),
  },
  {
    id: "reihenfolge",
    titel: "Die Reihenfolge, wenn du nur eine Sache mitnimmst",
    inhalt: (
      <>
        <Frage>Wo fange ich an, wenn ich mehrere dieser Fehler gleichzeitig mache?</Frage>
        <p>
          Von oben nach unten. Die Reihenfolge ist nicht beliebig: Was weiter oben steht, macht alles
          darunter wirkungslos, wenn du es überspringst.
        </p>
        <Hinweis titel="Die kurze Fassung">
          <p>
            Dispo auf null. Rücklage aufbauen. Verzinste Konten auflösen. Erst dann anlegen, mit einem kleinen
            Betrag und einem geprüften Fonds. Verrechnungskonto einstellen. Einmal im Jahr Zakat und
            Bereinigung. Fertig.
          </p>
        </Hinweis>
      </>
    ),
  },
];

const faq: BeitragFrage[] = [
  {
    frage: "Was ist der häufigste Fehler beim halal investieren?",
    antwort:
      "Zu lange warten. Wer zwei Jahre recherchiert, statt mit einem kleinen Betrag anzufangen, verliert in dieser Zeit still Kaufkraft. Der zweite häufige Fehler ist, das Verrechnungskonto beim Broker zu vergessen, während der Fonds selbst geprüft ist.",
  },
  {
    frage: "Soll ich erst Schulden tilgen oder investieren?",
    antwort:
      "Erst tilgen, wenn es sich um verzinste Schulden handelt. Ein Dispo kostet sicher, eine Anlage bringt nur vielleicht. Wer Rücklagen oder Gold hat, ist zudem gehalten, damit zu tilgen, statt das Minus laufen zu lassen.",
  },
  {
    frage: "Wie viel Geld sollte ich als Rücklage behalten?",
    antwort:
      "Üblich sind drei bis sechs Monatsausgaben, jederzeit erreichbar. Dieses Geld verliert zwangsläufig an Kaufkraft, und das ist der Preis dafür, bei einer unerwarteten Ausgabe nicht verkaufen zu müssen.",
  },
  {
    frage: "Reicht es, wenn Islamic im Namen des Fonds steht?",
    antwort:
      "Nein. Entscheidend ist, wer geprüft hat, wann zuletzt und ob sich der Nachweis auf das Produkt oder nur auf den Index bezieht. Dazu kommen Fragen an den Fonds selbst, etwa zur Wertpapierleihe.",
  },
  {
    frage: "Kann ich mich auf eine Screening-App verlassen?",
    antwort:
      "Als Rechenhilfe ja, als Freibrief nicht. Die Apps wenden Filter auf Bilanzzahlen an und liegen manchmal falsch, etwa wenn eine Firma in der falschen Branche geführt wird. Der Blick auf das Geschäft der Firma bleibt bei dir.",
  },
  {
    frage: "Darf ich einen Neukundenbonus der Bank mitnehmen?",
    antwort:
      "Wenn die Prämie daran hängt, dass du Geld einzahlst oder eine Summe liegen lässt, ist sie ein Zuschlag auf dein Guthaben und damit dasselbe wie Zins. Eine Weiterempfehlungsprämie ist etwas anderes, dort wird eine Leistung vergütet.",
  },
  {
    frage: "Was mache ich, wenn mein Depot im Minus ist?",
    antwort:
      "Nichts überstürzen. Ein Buchverlust wird erst durch den Verkauf zu einem echten Verlust. Wichtiger ist die Frage vorher: Ist der Betrag so gewählt, dass du einen Rückgang aushalten kannst, ohne das Geld zu brauchen?",
  },
];

const beschreibung =
  "Zwölf Fehler, die Einsteiger machen: zu lange warten, Schulden ignorieren, dem Etikett vertrauen, die App als Freibrief nehmen, das Verrechnungskonto vergessen, den Neukundenbonus mitnehmen. Jeweils mit dem, was stattdessen hilft.";

const HaeufigeFehler = () => (
  <>
    <Seo
      title="Die häufigsten Fehler beim halal investieren | finanzmuslim"
      description={beschreibung}
      path="/wissen/haeufige-fehler"
      jsonLd={beitragJsonLd({
        titel: "Die häufigsten Fehler",
        beschreibung,
        path: "/wissen/haeufige-fehler",
        datePublished: "16. August 2026",
        dateModified: "5. September 2026",
        faq,
      })}
    />
    <BeitragSeite
      slug="haeufige-fehler"
      titel="Die häufigsten Fehler"
      untertitel="Zwölf Stolperfallen und die Reihenfolge, in der du sie abräumst."
      kurzGesagt={[
        "Der teuerste Fehler ist Warten. Er kostet kein Geld, sondern Jahre.",
        "Erst Dispo und teure Raten weg, dann anlegen. Wer Rücklagen hat, tilgt damit.",
        "Das Etikett Islamic ersetzt keinen Nachweis mit Datum, und die App ist kein Freibrief.",
        "Der geprüfte Fonds nützt wenig, wenn das Konto daneben Zinsen zahlt.",
        "Der Neukundenbonus fürs Einzahlen ist ein Zuschlag auf dein Guthaben.",
        "Wer unten verkauft, macht aus einem Buchverlust einen echten.",
      ]}
      abschnitte={abschnitte}
      faq={faq}
      datePublished="16. August 2026"
      dateModified="5. September 2026"
      boxMitteNach={2}
      rechtshinweis="Dieser Beitrag dient ausschließlich zu Bildungszwecken und ist weder Anlageberatung noch Fatwa. Er beschreibt allgemeine Muster, keine auf deine Lage zugeschnittene Empfehlung. Investitionen in Wertpapiere sind mit Risiken verbunden, bis hin zum Totalverlust."
      boxOben={{
        kategorie: "Guide",
        ueberschrift: "Der Einstieg Schritt für Schritt",
        linkZiel: "/halal-guide",
        text: "Die Grundlagen und eine Prüfreihenfolge zum Mitmachen.",
        knopf: "Guide kostenlos sichern",
      }}
      boxMitte={{
        kategorie: "Depot",
        ueberschrift: "Ein Depot, das ohne Zinsgeschäft arbeitet",
        linkZiel: "/vergleich/depot",
      }}
    >
      <PasstDazu
        punkte={[
          { to: "/wissen/halal-etfs", name: "Halal ETFs", text: "zeigt die vier Fragen, mit denen du einen Fonds prüfst." },
          { to: "/wissen/girokonto-ohne-zinsen", name: "Girokonto ohne Zinsen", text: "erklärt die Handgriffe, die du am Konto erledigst." },
          { to: "/wissen/ertraege-reinigen", name: "Aktienbereinigung", text: "der Schritt einmal im Jahr, den fast jeder vergisst." },
          { to: "/wissen/nisab", name: "Nisab", text: "sagt dir, ab wann Zakat auf dein Vermögen fällig wird." },
        ]}
      />
    </BeitragSeite>
  </>
);

export default HaeufigeFehler;
