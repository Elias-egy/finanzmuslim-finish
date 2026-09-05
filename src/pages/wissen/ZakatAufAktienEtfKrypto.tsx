import Seo, { beitragJsonLd } from "@/components/Seo";
import BeitragSeite, { type BeitragAbschnitt, type BeitragFrage } from "@/components/BeitragSeite";
import { IlluDepot, IlluNisab } from "@/components/illu";
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
  Schritte,
  Tabelle,
} from "@/components/beitrag";

const abschnitte: BeitragAbschnitt[] = [
  {
    id: "was-zaehlt",
    titel: "Was überhaupt mitzählt",
    inhalt: (
      <>
        <Frage>
          Konto, Depot, Gold in der Schublade, ein paar Coins. Was davon geht in die Rechnung?
        </Frage>
        <p>
          Alles davon. Zakatpflichtig ist, was Geld ist oder wie Geld wirkt: Bargeld, Guthaben, Fremdwährung,
          Gold und Silber, Handelsware, dazu Aktien, ETFs, Sukuk und Krypto. Nicht mitgezählt wird, was du
          benutzt und nicht zum Verkauf hältst: die eigene Wohnung, das Auto, Möbel, Werkzeug.
        </p>
        <p>
          Die Regel dahinter heißt vollständiges Eigentum, und sie hat zwei Bedingungen: Dir muss die Sache
          gehören, <B>und</B> du musst über sie verfügen können. Beides zusammen.
        </p>
        <Begriff wort="Vollständiges Eigentum" arabisch="al-Milkiyya at-tāmma">
          Eigentum und Verfügungsgewalt in einer Hand. Was dir gehört, worüber du aber nicht verfügen kannst,
          zählt nicht mit. Umgekehrt zählt mit, worüber du jederzeit verfügen kannst.
        </Begriff>
        <Hinweis titel="Warum das Girokonto mitzählt">
          <p>
            Streng genommen liegt dein Geld nicht bei dir, sondern bei der Bank. Du kannst aber jederzeit
            überweisen, abheben und bezahlen. Diese Verfügung genügt, deshalb zählt das Konto vollständig
            mit. Dasselbe gilt für dein Depot.
          </p>
        </Hinweis>
        <Bild text="Ob das Geld auf dem Konto liegt oder als Anteile im Depot: zakatpflichtig ist beides.">
          <IlluDepot />
        </Bild>
        <Tabelle
          kopf={["Zählt mit", "Zählt nicht mit"]}
          zeilen={[
            ["Bargeld, Girokonto, Fremdwährung", "Selbst bewohnte Wohnung oder Haus"],
            ["Gold und Silber, auch als physisch hinterlegtes Wertpapier", "Auto, Möbel, Kleidung, Werkzeug"],
            ["Aktien, ETFs, Sukuk", "Betriebsmittel, die du nutzt statt verkaufst"],
            ["Krypto", "Eine Rente, auf die du noch nicht zugreifen kannst"],
            ["Handelsware, also alles zum Weiterverkauf", "Geliehenes Geld, das du zurückgeben musst"],
          ]}
        />
      </>
    ),
  },
  {
    id: "nisab-hawl",
    titel: "Die zwei Bedingungen: Nisab und Mondjahr",
    inhalt: (
      <>
        <p>
          Zakat wird erst fällig, wenn zwei Dinge zusammenkommen. Dein Vermögen liegt über einer Grenze, und
          es liegt dort ein volles Mondjahr lang.
        </p>
        <Bild text="Erst über die Grenze, dann ein volles Mondjahr darüber bleiben. Dann wird gerechnet.">
          <IlluNisab />
        </Bild>
        <Schritte
          schritte={[
            {
              titel: "Der Nisab wird erreicht",
              text: (
                <>
                  Die Grenze ist in Gewicht festgelegt, nicht in Euro. Der Tag, an dem du sie überschreitest,
                  ist dein Stichtag. Welche Grenze gilt und warum es zwei gibt, steht in{" "}
                  <L to="/wissen/nisab">Nisab verstehen</L>.
                </>
              ),
            },
            {
              titel: "Ein volles Mondjahr vergeht",
              text: "Das islamische Jahr ist rund elf Tage kürzer als das gregorianische. Der Stichtag wandert deshalb jedes Jahr im Kalender nach vorne. Notiere ihn im islamischen Kalender, nicht als „immer im März“.",
            },
            {
              titel: "Am Stichtag wird gerechnet",
              text: "Alles zusammenzählen, was mitzählt, kurzfristig fällige Schulden abziehen, davon 2,5 Prozent. Es zählt der Stand an diesem Tag, nicht der Durchschnitt des Jahres.",
            },
          ]}
        />
        <Begriff wort="Mondjahr" arabisch="Ḥawl">
          Ein volles islamisches Jahr über dem Nisab. Fällst du zwischendurch darunter, beginnt die Zählung
          neu. Steigt dagegen nur der Nisab selbst, weil der Goldpreis steigt, gilt das nach verbreiteter
          Auffassung nicht als Unterschreiten aus eigenem Zutun.
        </Begriff>
        <Merksatz>
          2,5 Prozent sind ein Vierzigstel. Von vierzig Teilen gibst du einen ab, und neununddreißig bleiben.
        </Merksatz>
      </>
    ),
  },
  {
    id: "ein-hawl",
    titel: "Ein Stichtag für alles, auch für den Lohn vom letzten Monat",
    inhalt: (
      <>
        <Frage>
          Mein Gehalt kam vor drei Wochen. Braucht das nicht sein eigenes Jahr, bevor Zakat darauf fällig
          wird?
        </Frage>
        <p>
          Klassisch ja. Früher hatte jedes neu hinzugekommene Vermögen seinen eigenen Zeitraum: eine
          Schenkung, ein Erbe, der Lohn. Nur Gewinne aus vorhandenem Kapital blieben am ursprünglichen
          Stichtag hängen.
        </p>
        <p>
          In der Praxis funktioniert das heute nicht mehr. Alles läuft über dasselbe Konto, und niemand kann
          nachvollziehen, ob die Miete aus dem Gehalt von März oder aus dem Ersparten von vorletztem Jahr
          bezahlt wurde. Deshalb nehmen Gelehrte heute einen einzigen Stichtag für das gesamte Vermögen.
        </p>
        <Merksatz>
          Ein Stichtag, ein Betrag, alles zusammen. Auch das Geld, das erst vor einem Monat gekommen ist.
        </Merksatz>
        <Hinweis titel="Deshalb zahlst du eher zu früh als zu spät">
          <p>
            Bei dieser Sammelrechnung zahlst du für einen Teil deines Vermögens, bevor dessen eigenes Jahr um
            wäre. Das ist unproblematisch: Gelehrte tadeln niemanden dafür, Zakat zu früh zu zahlen. Zu spät
            zu zahlen tadeln sie alle.
          </p>
        </Hinweis>
      </>
    ),
  },
  {
    id: "aktien",
    titel: "Aktien und ETFs: zwei Bemessungen, eine Entscheidung",
    inhalt: (
      <>
        <p>
          Dass Aktien und Fondsanteile zakatpflichtig sind, ist unstrittig. Strittig ist nur, worauf du die
          2,5 Prozent rechnest. Und das hängt daran, warum du sie hältst.
        </p>
        <Gegenueber
          links={{
            titel: "Zum Weiterverkauf gehalten",
            punkte: [
              "Du kaufst, um bei Gelegenheit wieder zu verkaufen.",
              "Die Anteile sind für dich Handelsware wie jede andere.",
              "Bemessung: der volle Kurswert am Stichtag.",
              "2,5 Prozent auf den ganzen Depotwert.",
            ],
          }}
          rechts={{
            titel: "Langfristig liegen gelassen",
            punkte: [
              "Du bist Miteigentümer und willst es bleiben.",
              "Zakat fällt auf den Teil der Firma an, der selbst Geldcharakter hat.",
              "Bemessung: nur der zakatpflichtige Anteil des Unternehmens.",
              "In der Praxis wird verbreitet mit rund 30 Prozent des Depotwerts gerechnet.",
            ],
          }}
        />
        <p>
          Der Gedanke hinter der zweiten Bemessung: Eine Firma besteht nicht nur aus Geld. Sie hat Maschinen,
          Gebäude und Fahrzeuge, die sie benutzt und nicht verkauft. Auf Benutztes fällt keine Zakat an. Zakat
          fällt auf den Teil an, der Geld ist oder wie Geld wirkt: Kasse, Forderungen, Lagerbestand.
        </p>
        <Beispiel
          titel="Beide Wege an einem Depot"
          rechnung={["Depotwert: 8.000 €", "Langfristig: 8.000 € × 30 % = 2.400 € → 60 € Zakat", "Zum Handel: 8.000 € × 100 % = 8.000 € → 200 € Zakat"]}
          ergebnis="Derselbe Depotwert, zwei Bemessungen. Die Absicht entscheidet, nicht die Höhe."
        >
          <p>
            Die 30 Prozent sind eine gebräuchliche Näherung, kein feststehender Wert. Wer es genauer will,
            liest die Bilanz der Firma und rechnet den Anteil selbst aus. Bei einem breiten ETF mit hunderten
            Positionen ist das nicht machbar, deshalb ist die Näherung dort der übliche Weg.
          </p>
        </Beispiel>
        <Hinweis titel="Was zählt, wenn du unsicher bist">
          <p>
            Im Zweifel die höhere Bemessung. Zu viel gegeben zu haben ist der kleinere Fehler. Und wer
            wechselt, sollte es nicht jedes Jahr neu tun: eine Absicht, ein Weg, dabei bleiben.
          </p>
        </Hinweis>
      </>
    ),
  },
  {
    id: "krypto-sukuk",
    titel: "Krypto, Sukuk und Gold",
    inhalt: (
      <>
        <Faelle
          faelle={[
            {
              titel: "Kryptowährungen",
              ton: "gruen",
              wort: "2,5 % vom Wert",
              text: (
                <>
                  Unter Gelehrten wird diskutiert, ob Krypto eine Währung oder eine Handelsware ist. Für die
                  Zakat spielt das keine Rolle: Beides ist zakatpflichtig, beides mit 2,5 Prozent vom Wert am
                  Stichtag. Ob du eine bestimmte Münze überhaupt halten solltest, ist eine andere Frage, sie
                  steht in <L to="/wissen/ist-bitcoin-halal">Krypto</L>.
                </>
              ),
            },
            {
              titel: "Sukuk",
              ton: "gruen",
              wort: "zählt mit",
              text: (
                <>
                  Sukuk verbriefen einen Anteil an einem realen Vermögenswert. Sie zählen mit ihrem Wert am
                  Stichtag zum zakatpflichtigen Vermögen. Was ein Sukuk genau ist, steht in{" "}
                  <L to="/wissen/sukuk">Sukuk</L>.
                </>
              ),
            },
            {
              titel: "Gold und Silber",
              ton: "gruen",
              wort: "Marktwert",
              text: "Barren, Münzen und physisch hinterlegte Wertpapiere zählen mit ihrem Marktwert am Stichtag, nicht mit dem Kaufpreis. Bei getragenem Schmuck gehen die Auffassungen auseinander: Die hanafitische Schule zählt ihn mit, andere Schulen nehmen ihn aus.",
            },
            {
              titel: "Eine Immobilie",
              ton: "gelb",
              wort: "kommt darauf an",
              text: "Die selbst bewohnte Wohnung zählt nicht. Eine Wohnung, die du vermietest, zählt selbst auch nicht, wohl aber die Mieteinnahmen, die am Stichtag noch da sind. Eine Immobilie, die du zum Weiterverkauf gekauft hast, ist Handelsware und zählt mit dem vollen Wert.",
            },
            {
              titel: "Betriebliche Altersvorsorge und gesperrte Guthaben",
              ton: "gelb",
              wort: "meist nicht",
              text: "Solange du nicht darüber verfügen kannst, fehlt die zweite Bedingung des vollständigen Eigentums. Sobald das Geld verfügbar wird, zählt es ab dann mit.",
            },
          ]}
        />
      </>
    ),
  },
  {
    id: "schulden",
    titel: "Was du abziehen darfst",
    inhalt: (
      <>
        <p>
          Schulden mindern die Bemessung, aber nicht in voller Höhe. Abgezogen wird nach verbreiteter
          Auffassung das, was kurzfristig fällig ist. Bei einem langlaufenden Vertrag ist das der Teil, der im
          kommenden Jahr zu zahlen ist, nicht die ganze Restsumme.
        </p>
        <Checkliste
          punkte={[
            { art: "ja", text: "Offene Rechnungen, ausstehende Miete, die Nachzahlung, die diesen Monat kommt." },
            { art: "ja", text: "Von einem laufenden Ratenvertrag der Teil, der im nächsten Jahr fällig wird." },
            { art: "nein", text: "Nicht die gesamte Restschuld eines langjährigen Vertrags. Sonst hätte fast niemand mehr eine Bemessung." },
            { art: "nein", text: "Kein Abzug für Ausgaben, die erst geplant sind. Ein Urlaub im Sommer ist keine Schuld." },
          ]}
        />
        <Hinweis titel="Wer im Minus lebt, hat eine andere Baustelle">
          <p>
            Ein dauerhafter Dispo ist eine Zinsschuld, und die gehört vor die Zakat-Rechnung, nicht in sie.
            Wie du herauskommst, steht in <L to="/wissen/dispo-und-schulden">Dispo und Schulden</L>.
          </p>
        </Hinweis>
      </>
    ),
  },
  {
    id: "wohin",
    titel: "Wohin die Zakat geht",
    inhalt: (
      <>
        <p>
          Der Koran nennt in Sure at-Tauba acht Gruppen von Empfängern. Historisch hat ein Staat die Zakat
          eingesammelt und auf diese Gruppen verteilt, und die meisten klassischen Regeln setzen genau das
          voraus.
        </p>
        <p>
          Ohne diese Struktur gilt der praktische Rat: Halte dich an die ersten beiden Gruppen, die Armen und
          die Bedürftigen. Sie sind unstrittig, und über sie entscheidet niemand für dich. Eine einzelne
          Person kann ohnehin nicht beurteilen, ob etwa Schuldner oder Reisende in Not im richtigen Verhältnis
          bedacht sind.
        </p>
        <Merksatz>
          Falsch gegebene Zakat gilt als nicht gezahlt. Sie muss dann noch einmal gegeben werden.
        </Merksatz>
        <Checkliste
          punkte={[
            { art: "ja", text: "An Arme und Bedürftige, direkt oder über eine anerkannte Organisation mit Zakat-Verwendung." },
            { art: "ja", text: "Innerhalb der eigenen Verwandtschaft, sofern du für die Person nicht ohnehin unterhaltspflichtig bist." },
            { art: "nein", text: "Nicht für den Bau einer Moschee, Korankopien oder allgemeine Vereinsarbeit. Das sind Sadaqa-Zwecke, keine Zakat-Empfänger." },
            { art: "nein", text: "Nicht an Eltern, Kinder oder den Ehepartner, für die du ohnehin sorgen musst." },
            { art: "nein", text: "Nicht mit der Bereinigung deiner Aktienerträge verrechnen. Das sind zwei verschiedene Dinge." },
          ]}
        />
        <p>
          Der Unterschied zur Bereinigung ist wichtig genug, um ihn einmal auszuschreiben: Zakat ist eine
          Pflicht auf dein Vermögen, für die du Lohn erwartest. Die Bereinigung gibt einen Anteil zurück, der
          dir nie zustand. Beides wird getrennt gerechnet, siehe{" "}
          <L to="/wissen/ertraege-reinigen">Aktienbereinigung</L>.
        </p>
      </>
    ),
  },
  {
    id: "so-gehts",
    titel: "So gehst du am Stichtag vor",
    inhalt: (
      <>
        <Schritte
          schritte={[
            { titel: "Depotauszug und Kontostand ziehen", text: "Alles zum selben Tag. Wer das Datum jedes Jahr gleich hält, hat die Arbeit einmal und danach nie wieder." },
            { titel: "Zusammenzählen", text: "Konto, Bargeld, Fremdwährung, Gold und Silber zum Marktwert, Depot nach der gewählten Bemessung, Krypto zum Kurs." },
            { titel: "Kurzfristige Schulden abziehen", text: "Was im kommenden Jahr fällig ist, nicht mehr." },
            { titel: "Mit dem Nisab vergleichen", text: "Liegt der Betrag darüber und lag er ein volles Mondjahr darüber, ist Zakat fällig." },
            { titel: "2,5 Prozent rechnen und zahlen", text: "Am selben Tag, an dem du rechnest. Was aufgeschoben wird, wird vergessen." },
            { titel: "Direkt danach bereinigen", text: "Die Zahlen liegen ohnehin auf dem Tisch. Das ist der günstigste Moment für den zweiten Termin im Jahr." },
          ]}
        />
        <p>
          Wer nicht selbst rechnen will, trägt die Beträge in den{" "}
          <L to="/zakat-rechner">Zakat-Rechner</L> ein. Dort wählst du unter den Angaben aus, ob du dein Depot
          langfristig hältst oder handelst, und der Rechner nimmt die passende Bemessung.
        </p>
        <Frage>Und wenn du in den letzten Jahren nie Zakat gezahlt hast?</Frage>
        <p>
          Nachholen, so gut es geht. Zakat verjährt nicht, sie bleibt als Schuld bestehen. Schätze die
          vergangenen Jahre anhand alter Kontoauszüge und Jahressteuerbescheinigungen, rechne eher großzügig
          und zahle in Schritten, wenn es auf einmal nicht geht. Danach fängst du mit einem festen Stichtag
          sauber an.
        </p>
      </>
    ),
  },
];

const faq: BeitragFrage[] = [
  {
    frage: "Muss man Zakat auf Aktien und ETFs zahlen?",
    antwort:
      "Ja, Aktien und Fondsanteile gehören zum zakatpflichtigen Vermögen. Strittig ist nur die Bemessung. Wer die Anteile zum Weiterverkauf hält, zahlt nach verbreiteter Auffassung 2,5 Prozent auf den vollen Kurswert. Wer langfristig investiert bleibt, setzt nur den Anteil an, der auf zakatpflichtige Vermögenswerte des Unternehmens entfällt; in der Praxis wird dafür oft mit rund 30 Prozent des Depotwerts gerechnet.",
  },
  {
    frage: "Wie viel Zakat zahlt man auf Krypto?",
    antwort:
      "2,5 Prozent vom Wert am Stichtag. Unter Gelehrten wird diskutiert, ob Krypto eine Währung oder eine Handelsware ist. Für die Zakat macht das keinen Unterschied, weil beide Einordnungen zakatpflichtig sind.",
  },
  {
    frage: "Zählt mein Girokonto mit?",
    antwort:
      "Ja. Für die Zakat braucht es vollständiges Eigentum, also Eigentum und Verfügungsgewalt. Das Guthaben liegt zwar bei der Bank, du kannst aber jederzeit überweisen, abheben und bezahlen. Diese Verfügung genügt, deshalb zählt das Konto vollständig mit.",
  },
  {
    frage: "Braucht jedes neue Geld ein eigenes Zakat-Jahr?",
    antwort:
      "Klassisch hatte neu hinzugekommenes Vermögen einen eigenen Zeitraum. Heute lässt sich nicht mehr nachvollziehen, aus welchem Geld welche Ausgabe bezahlt wurde, weil alles über dasselbe Konto läuft. Deshalb nehmen Gelehrte einen einzigen Stichtag für das gesamte Vermögen, auch für den Lohn vom Vormonat.",
  },
  {
    frage: "Darf ich die Zakat früher zahlen?",
    antwort:
      "Ja. Zu früh zu zahlen ist unproblematisch, und bei der Sammelrechnung über einen einzigen Stichtag passiert das ohnehin für Teile des Vermögens. Zu spät zu zahlen ist dagegen ein Fehler, den Gelehrte einhellig rügen.",
  },
  {
    frage: "Welche Schulden darf ich abziehen?",
    antwort:
      "Nach verbreiteter Auffassung die kurzfristig fälligen Verbindlichkeiten. Bei einem langlaufenden Vertrag wird üblicherweise nur der Teil abgezogen, der im kommenden Jahr fällig wird, nicht die gesamte Restschuld.",
  },
  {
    frage: "Kann ich die Zakat an eine Moschee geben?",
    antwort:
      "Für den Bau oder den Unterhalt einer Moschee nicht. Der Koran nennt in Sure at-Tauba acht Empfängergruppen, und Bauprojekte gehören nicht dazu. In Deutschland ist der sichere Weg, sich an die ersten beiden Gruppen zu halten, also an Arme und Bedürftige. Falsch gegebene Zakat gilt als nicht gezahlt und muss erneut gegeben werden.",
  },
  {
    frage: "Ist die Bereinigung meiner Aktienerträge Teil der Zakat?",
    antwort:
      "Nein, das sind zwei verschiedene Dinge. Zakat ist eine Pflicht auf dein Vermögen, für die du Lohn erwartest. Die Bereinigung gibt einen Ertragsanteil zurück, der dir nie zustand, und wird nicht angerechnet. Beides fällt praktischerweise auf denselben Termin, weil du die Zahlen ohnehin vor dir hast.",
  },
];

const beschreibung =
  "Was von Konto, Depot, Gold und Krypto in die Zakat-Rechnung geht, warum es nur einen Stichtag für alles gibt, welche zwei Bemessungen es für Aktien gibt und wohin der Betrag geht.";

const ZakatAufAktienEtfKrypto = () => (
  <>
    <Seo
      title="Zakat auf Aktien, ETFs und Krypto berechnen | finanzmuslim"
      description={beschreibung}
      path="/wissen/zakat-auf-aktien-etf-krypto"
      jsonLd={beitragJsonLd({
        titel: "Zakat auf Aktien, ETFs und Krypto",
        beschreibung,
        path: "/wissen/zakat-auf-aktien-etf-krypto",
        datePublished: "5. September 2026",
        dateModified: "5. September 2026",
        faq,
      })}
    />
    <BeitragSeite
      slug="zakat-auf-aktien-etf-krypto"
      titel="Zakat auf Aktien, ETFs und Krypto"
      untertitel="Ein Stichtag, ein Betrag, zwei Bemessungen für das Depot."
      kurzGesagt={[
        "Zakatpflichtig ist, was Geld ist oder wie Geld wirkt. Was du benutzt statt verkaufst, zählt nicht.",
        "Zwei Bedingungen: über dem Nisab, und das ein volles Mondjahr lang.",
        "Heute gilt ein einziger Stichtag für das gesamte Vermögen, auch für den Lohn vom Vormonat.",
        "Depot langfristig gehalten: nur der zakatpflichtige Anteil, in der Praxis rund 30 Prozent. Zum Handel: der volle Wert.",
        "Krypto ist mit 2,5 Prozent zakatpflichtig, unabhängig davon, ob man es als Währung oder Ware einordnet.",
      ]}
      abschnitte={abschnitte}
      faq={faq}
      datePublished="5. September 2026"
      dateModified="5. September 2026"
      boxMitteNach={3}
      rechtshinweis="Dieser Beitrag gibt bekannte Positionen wieder und dient ausschließlich zu Bildungszwecken. Er ist keine Fatwa und keine Steuer- oder Anlageberatung. Zur Wahl des Nisab-Maßstabs, zur Bemessung von Wertpapieren, zur Behandlung von Schmuck und zur Verteilung an die Empfänger bestehen unter Gelehrten unterschiedliche Auffassungen. Der Näherungswert von rund 30 Prozent für langfristig gehaltene Anteile ist eine gebräuchliche Praxis, kein feststehender Wert. Die Zahlen in den Beispielen sind erfunden."
      boxOben={{
        kategorie: "Rechner",
        ueberschrift: "Zakat in fünf Minuten ausrechnen",
        linkZiel: "/zakat-rechner",
        text: "Konto, Depot, Gold und Krypto eintragen, beide Bemessungen wählbar.",
        knopf: "Zum Zakat-Rechner",
      }}
      boxMitte={{
        kategorie: "Weiterlesen",
        ueberschrift: "Ab welchem Vermögen es losgeht",
        linkZiel: "/wissen/nisab",
        text: "Gold oder Silber, und warum die Grenzen so weit auseinanderliegen.",
        knopf: "Zum Nisab",
      }}
    >
      <PasstDazu
        punkte={[
          { to: "/wissen/nisab", name: "Nisab verstehen", text: "sagt dir, ab welchem Vermögen überhaupt Zakat fällig wird." },
          { to: "/wissen/ertraege-reinigen", name: "Aktienbereinigung", text: "erklärt den zweiten Termin im Jahr, der nicht dasselbe ist." },
          { to: "/wissen/sind-aktien-halal", name: "Aktien richtig prüfen", text: "zeigt, ob die Anteile überhaupt in Ordnung sind." },
          { to: "/wissen/ist-bitcoin-halal", name: "Krypto", text: "ordnet ein, welche Coins in Frage kommen." },
        ]}
      />
    </BeitragSeite>
  </>
);

export default ZakatAufAktienEtfKrypto;
