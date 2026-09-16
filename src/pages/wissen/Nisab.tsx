import Seo, { beitragJsonLd } from "@/components/Seo";
import BeitragSeite, { type BeitragAbschnitt, type BeitragFrage } from "@/components/BeitragSeite";
import { IlluGold, IlluNisab } from "@/components/illu";
import nisabDaten from "@/data/nisab.json";
import {
  B,
  Begriff,
  Bild,
  Frage,
  Gegenueber,
  Hinweis,
  Kennzahlen,
  L,
  Merksatz,
  PasstDazu,
} from "@/components/beitrag";

/**
 * Die beiden Grenzen kommen live aus `src/data/nisab.json`. Diese Datei
 * schreibt `kurse_holen.py`. Deshalb steht hier keine einzige Zahl fest im
 * Text: eine Nisab-Grenze von letztem Jahr wäre schlechter als gar keine.
 */

const eur = (n: number) =>
  n.toLocaleString("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

const abschnitte: BeitragAbschnitt[] = [
  {
    id: "was-ist-nisab",
    titel: "Der Nisab ist eine Untergrenze",
    inhalt: (
      <>
        <Frage>Muss ich Zakat zahlen, wenn ich nur ein paar Tausend Euro gespart habe?</Frage>
        <p>
          Vielleicht nicht. Zakat zahlt nicht jeder. Sie wird erst fällig, wenn dein Vermögen einen bestimmten
          Betrag erreicht und ein volles Mondjahr darüber bleibt. Dieser Betrag ist die Untergrenze.
        </p>
        <Begriff wort="Nisab" arabisch="Nisab">
          Die Vermögensgrenze, ab der Zakat überhaupt fällig wird. Wer darunter liegt, zahlt nichts und kann
          selbst zu den Empfängern gehören.
        </Begriff>
        <p>
          Der Sinn dahinter ist einfach: Wer selbst wenig hat, soll nicht abgeben müssen. Die Grenze trennt
          die, die geben, von denen, die empfangen.
        </p>
        <Merksatz>
          Der Nisab ist kein fester Eurobetrag. Er hängt am Gold- oder Silberpreis und ändert sich jeden Tag.
        </Merksatz>
        <p>
          Festgelegt wurde er in Gewicht, nicht in Geld: 85 Gramm Gold oder 595 Gramm Silber. Weil Silber
          heute im Verhältnis viel billiger ist als zur Zeit der Festlegung, liegen die beiden Grenzen weit
          auseinander. Genau daraus entsteht die einzige echte Frage in diesem Thema.
        </p>
      </>
    ),
  },
  {
    id: "die-beiden-grenzen",
    titel: "Die beiden Grenzen heute",
    inhalt: (
      <>
        <p>
          Stand {nisabDaten.stand}, gerechnet mit {nisabDaten.goldPreisJeGramm.toLocaleString("de-DE")} Euro je
          Gramm Gold und {nisabDaten.silberPreisJeGramm.toLocaleString("de-DE")} Euro je Gramm Silber.
        </p>
        <Kennzahlen
          zahlen={[
            {
              label: "Nach Silber",
              wert: eur(nisabDaten.nisabSilberEuro),
              unter: `${nisabDaten.nisabSilberGramm} Gramm Silber. Die niedrigere Grenze, wer sie wählt, ist früher zakatpflichtig.`,
            },
            {
              label: "Nach Gold",
              wert: eur(nisabDaten.nisabGoldEuro),
              unter: `${nisabDaten.nisabGoldGramm} Gramm Gold. Die höhere Grenze, wer sie wählt, zahlt erst deutlich später.`,
            },
          ]}
        />
        <p>
          Der Unterschied ist keine Kleinigkeit. Zwischen den beiden Grenzen liegt der Bereich, in dem die
          Entscheidung darüber bestimmt, ob du in diesem Jahr überhaupt Zakat zahlst.
        </p>
        <Bild text="Der Nisab wird in Gramm bestimmt, nicht in Euro. Der Eurobetrag ist nur die Umrechnung von heute.">
          <IlluGold />
        </Bild>
        <Hinweis titel="Welches Gold ist gemeint">
          <p>
            Als Bezug gilt reines Gold, also 24 Karat. Wer mit 22 Karat rechnet, weil er den Preis dafür
            leichter findet, liegt vertretbar. Die Preise oben stammen aus Terminkursen und weichen meist ein
            bis zwei Prozent vom Spotpreis ab. Für eine taggenaue Berechnung nimm den Preis deines eigenen
            Stichtags.
          </p>
        </Hinweis>
      </>
    ),
  },
  {
    id: "welche-grenze",
    titel: "Welche der beiden Grenzen gilt",
    inhalt: (
      <>
        <Frage>Warum sagt die eine Seite Silber und die andere Gold?</Frage>
        <p>
          Weil beide auf die Überlieferung zurückgehen und beide bis heute vertreten werden. Die Begründungen
          laufen in unterschiedliche Richtungen, und es hilft, sie einmal nebeneinander zu sehen.
        </p>
        <Gegenueber
          links={{
            titel: "Für den Silber-Nisab",
            punkte: [
              "Die niedrigere Grenze erfasst mehr Menschen, es kommt also mehr bei den Empfängern an.",
              "Wer im Zweifel ist, entscheidet nach dieser Sicht zugunsten der Armen.",
              "Viele Hilfsorganisationen rechnen deshalb mit Silber.",
              "Innerhalb der Rechtsschulen ist das die Linie der Hanbaliten.",
            ],
          }}
          rechts={{
            titel: "Für den Gold-Nisab",
            punkte: [
              "Drei der vier großen Rechtsschulen nehmen Gold als Maßstab.",
              "Zur Zeit der Festlegung waren beide Grenzen etwa gleich viel wert, Silber hat seine Kaufkraft verloren.",
              "Der Silber-Nisab liegt heute bei einem Betrag, mit dem in Deutschland niemand als wohlhabend gilt.",
              "Zakat setzt Wohlstand voraus, und den soll die Grenze abbilden.",
            ],
          }}
        />
        <p>
          <B>Was das praktisch heißt:</B> Beides ist vertretbar, und keiner von beiden Wegen ist ein Fehler.
          Wer sicher gehen will, dass er nicht zu wenig gibt, nimmt Silber, denn zu viel gegeben zu haben hat
          noch niemand bereut. Wer den Gedanken hinter der Grenze in den Vordergrund stellt, nimmt Gold. Was
          in beiden Fällen zählt: den einmal gewählten Maßstab beibehalten und nicht jedes Jahr wechseln, je
          nachdem, was gerade günstiger ausfällt.
        </p>
        <p>
          Im <L to="/zakat-rechner">Zakat-Rechner</L> kannst du zwischen beiden umschalten und siehst sofort,
          was es ausmacht.
        </p>
      </>
    ),
  },
  {
    id: "mondjahr",
    titel: "Das Mondjahr, die zweite Bedingung",
    inhalt: (
      <>
        <p>
          Die Grenze allein reicht nicht. Dein Vermögen muss ein volles Mondjahr über ihr geblieben sein. Ein
          Mondjahr hat rund 354 Tage, also elf Tage weniger als das Kalenderjahr.
        </p>
        <Bild text="Zwei Bedingungen müssen zusammenkommen: über der Grenze, und das ein volles Mondjahr lang.">
          <IlluNisab />
        </Bild>
        <p>
          Der Stichtag ist der Tag, an dem dein Vermögen den Nisab zum ersten Mal überschritten hat. Notier
          ihn im islamischen Kalender, nicht im deutschen. Sonst wandert dein Termin jedes Jahr um elf Tage,
          und nach etwa dreißig Jahren hättest du ein ganzes Jahr übersprungen. Viele legen den Stichtag
          bewusst in den Ramadan, um ihn nicht zu vergessen.
        </p>
        <Frage>Was ist, wenn ich zwischendurch unter die Grenze rutsche?</Frage>
        <p>
          Die Grundregel ist streng: Fällt dein Vermögen unter den Nisab, beginnt die Zählung von vorn, sobald
          du ihn wieder überschreitest. Nach hanafitischer Auffassung genügt es dagegen, wenn Anfang und Ende
          des Mondjahres über der Grenze liegen, dazwischen darf es schwanken.
        </p>
        <Hinweis titel="Ein Unterschied, den viele übersehen">
          <p>
            Es macht einen Unterschied, <B>warum</B> du unter die Grenze rutschst. Sinkt der Goldpreis und
            damit rechnerisch dein Vermögen unter den Nisab, ohne dass du etwas ausgegeben hast, beginnt das
            Jahr nicht neu. Gibst du dagegen selbst Geld aus und fällst dadurch darunter, dann schon.
          </p>
        </Hinweis>
        <p>
          Gerechnet wird am Stichtag mit dem, was da ist. Nicht mit dem Durchschnitt des Jahres und nicht mit
          dem Einkommen.
        </p>
        <Hinweis titel="Ein Stichtag für alles">
          <p>
            Streng genommen hätte jeder Betrag sein eigenes Jahr. Heute lässt sich aber nicht mehr
            nachvollziehen, aus welchem Geld welche Ausgabe bezahlt wurde. Deshalb nimmt man einen Stichtag
            für das gesamte Vermögen, auch für den Lohn, der letzte Woche kam. Zu früh zu zahlen ist
            unproblematisch, zu spät nicht.
          </p>
        </Hinweis>
      </>
    ),
  },
  {
    id: "was-zaehlt",
    titel: "Was in die Rechnung kommt",
    inhalt: (
      <>
        <p>
          Verglichen wird der Nisab mit deinem zakatpflichtigen Vermögen, nicht mit deinem Konto allein. Dazu
          gehören Bargeld und Guthaben, Gold und Silber, Handelsware sowie Aktien, ETFs und Sukuk.
        </p>
        <p>
          Nicht dazu zählt, was du selbst nutzt: die eigene Wohnung, das Auto, Möbel, Werkzeug. Kurzfristig
          fällige Schulden werden nach verbreiteter Auffassung vorher abgezogen.
        </p>
        <p>
          Bei langfristig gehaltenen Aktien und ETFs wird nicht der volle Wert angesetzt, sondern nach
          verbreiteter Auffassung rund 30 Prozent davon. Der <L to="/zakat-rechner">Zakat-Rechner</L> nimmt
          dir diese Rechnung ab und zeigt dir gleich, ob du über der Grenze liegst.
        </p>
      </>
    ),
  },
  {
    id: "wohin",
    titel: "Wohin die Zakat geht",
    inhalt: (
      <>
        <p>
          Der Nisab entscheidet, ob du zahlst. Genauso wichtig ist, an wen. Zakat ist an bestimmte Empfänger
          gebunden, und falsch verteilte Zakat gilt als nicht bezahlt. Du müsstest sie dann noch einmal geben.
        </p>
        <p>
          Der sichere Weg sind <B>Arme und Bedürftige</B>. In einem Land ohne islamische Verwaltung, die das
          für dich regelt, ist das die Gruppe, bei der du nichts falsch machen kannst. Bei den anderen
          Empfängergruppen, etwa Schuldnern oder Projekten, musst du selbst beurteilen, ob die Voraussetzungen
          wirklich vorliegen, und genau das ist schwer. Wer sicher gehen will, lässt es.
        </p>
        <Hinweis titel="Nicht mit der Bereinigung verwechseln">
          <p>
            Wenn du Aktien oder ETFs hast, kommt neben der Zakat ein zweiter Betrag auf dich zu, der
            unerlaubte Ertragsanteil. Der zählt <B>nicht</B> als Zakat und wird getrennt gerechnet. Wie das
            geht, steht in <L to="/wissen/ertraege-reinigen">Aktienbereinigung</L>.
          </p>
        </Hinweis>
      </>
    ),
  },
];

const faq: BeitragFrage[] = [
  {
    frage: "Wie hoch ist der Nisab?",
    antwort:
      "Der Nisab entspricht 85 Gramm Gold oder 595 Gramm Silber. In Euro ist er keine feste Größe, weil er am Tagespreis hängt. Die aktuellen Werte für beide Maßstäbe stehen oben in diesem Beitrag und im Zakat-Rechner.",
  },
  {
    frage: "Silber oder Gold, welcher Nisab gilt?",
    antwort:
      "Beide werden vertreten. Drei der vier großen Rechtsschulen nehmen den Goldnisab, die Hanbaliten den Silbernisab. Viele Hilfsorganisationen rechnen mit Silber, weil die Grenze niedriger liegt und mehr bei den Empfängern ankommt. Beides ist vertretbar, wichtig ist, den einmal gewählten Maßstab beizubehalten.",
  },
  {
    frage: "Warum liegen die beiden Grenzen so weit auseinander?",
    antwort:
      "Zur Zeit der Festlegung waren 85 Gramm Gold und 595 Gramm Silber etwa gleich viel wert. Seitdem ist Silber im Verhältnis zu Gold stark gefallen. Die Gewichte sind gleich geblieben, das Wertverhältnis nicht.",
  },
  {
    frage: "Was ist, wenn ich unterjährig unter den Nisab falle?",
    antwort:
      "Nach der Grundregel beginnt das Jahr von vorn, sobald du die Grenze wieder überschreitest. Nach hanafitischer Auffassung genügt es, wenn Anfang und Ende des Mondjahres über der Grenze liegen. Rutschst du nur deshalb darunter, weil der Goldpreis gefallen ist und nicht weil du etwas ausgegeben hast, beginnt das Jahr nicht neu.",
  },
  {
    frage: "Welches Datum nehme ich als Stichtag?",
    antwort:
      "Den Tag, an dem dein Vermögen den Nisab zum ersten Mal überschritten hat, notiert im islamischen Kalender. Ein deutsches Datum wandert jedes Jahr um elf Tage, weil das Mondjahr kürzer ist. Viele legen den Stichtag in den Ramadan, damit sie ihn nicht vergessen.",
  },
  {
    frage: "Zählt mein Haus zum Nisab?",
    antwort:
      "Die selbst genutzte Wohnung zählt nicht, ebenso wenig das eigene Auto, Möbel oder Arbeitsgeräte. Eine Immobilie, die du gekauft hast, um sie weiterzuverkaufen, gilt dagegen als Handelsware und zählt mit ihrem Marktwert mit.",
  },
  {
    frage: "Wie viel Zakat zahle ich, wenn ich über dem Nisab liege?",
    antwort:
      "2,5 Prozent des zakatpflichtigen Vermögens am Stichtag, nicht des Betrags oberhalb der Grenze. Wer knapp über dem Nisab liegt, zahlt also auf die volle Summe, nicht nur auf die Differenz.",
  },
  {
    frage: "An wen darf ich die Zakat geben?",
    antwort:
      "Der sichere Weg sind Arme und Bedürftige. Falsch verteilte Zakat gilt als nicht bezahlt und müsste noch einmal gegeben werden. Bei anderen Empfängergruppen musst du selbst beurteilen, ob die Voraussetzungen vorliegen, und das ist ohne Kenntnis der Lage schwer.",
  },
];

const beschreibung =
  "Der Nisab entspricht 85 Gramm Gold oder 595 Gramm Silber. Beide Grenzen in Euro mit Datum, warum sie so weit auseinanderliegen, welche Rechtsschule welche nimmt und was das Mondjahr damit zu tun hat.";

const Nisab = () => (
  <>
    <Seo
      title="Nisab: ab welchem Vermögen Zakat fällig wird | finanzmuslim"
      description={beschreibung}
      path="/wissen/nisab"
      jsonLd={beitragJsonLd({
        titel: "Nisab: ab wann du Zakat zahlst",
        beschreibung,
        path: "/wissen/nisab",
        datePublished: "16. August 2026",
        dateModified: "5. September 2026",
        faq,
      })}
    />
    <BeitragSeite
      slug="nisab"
      titel="Nisab: ab wann du Zakat zahlst"
      untertitel="Zwei Bedingungen, eine Grenze und die Frage, ob du mit Gold oder mit Silber rechnest."
      kurzGesagt={[
        "Der Nisab ist die Untergrenze, ab der Zakat fällig wird.",
        "Er ist in Gewicht festgelegt: 85 Gramm Gold oder 595 Gramm Silber.",
        `Nach Silber sind das heute rund ${eur(nisabDaten.nisabSilberEuro)}, nach Gold rund ${eur(nisabDaten.nisabGoldEuro)}.`,
        "Drei Rechtsschulen nehmen Gold, eine nimmt Silber. Beides ist vertretbar, nur nicht jedes Jahr im Wechsel.",
        "Zweite Bedingung: das Vermögen muss ein volles Mondjahr über der Grenze bleiben.",
        "Stichtag im islamischen Kalender notieren, sonst wandert er jedes Jahr um elf Tage.",
      ]}
      abschnitte={abschnitte}
      faq={faq}
      datePublished="16. August 2026"
      dateModified="5. September 2026"
      boxMitteNach={2}
      rechtshinweis="Dieser Beitrag gibt bekannte Positionen wieder und dient ausschließlich zu Bildungszwecken. Er ist keine Fatwa und ersetzt nicht die Auskunft eines Gelehrten. Zur Wahl des Maßstabs, zur Behandlung unterjähriger Schwankungen, zur Bemessung von Wertpapieren und zur Verteilung an die Empfänger bestehen innerhalb der Rechtsschulen unterschiedliche Auffassungen. Die Eurobeträge beruhen auf Terminkursen für Gold und Silber und weichen meist ein bis zwei Prozent vom Spotpreis ab."
      boxOben={{
        kategorie: "Rechner",
        ueberschrift: "Zakat in zwei Minuten ausrechnen",
        linkZiel: "/zakat-rechner",
        text: "Zwei Felder, Ergebnis als ganzer Satz.",
        knopf: "Zum Zakat-Rechner",
      }}
      boxMitte={{
        kategorie: "Anlagen",
        ueberschrift: "Geprüfte Anlagen, die in die Zakat-Rechnung gehören",
        linkZiel: "/halal-anlagen",
        text: "31 Anlagen mit Kosten, Größe und Prüfstelle.",
        knopf: "Zu den Anlagen",
      }}
    >
      <PasstDazu
        punkte={[
          { to: "/zakat-rechner", name: "Der Zakat-Rechner", text: "rechnet mit beiden Grenzen und zeigt dir den Unterschied." },
          { to: "/wissen/halal-gold-kaufen", name: "Gold richtig kaufen", text: "erklärt, welches Gold in die Zakat-Rechnung gehört." },
          { to: "/wissen/ertraege-reinigen", name: "Aktienbereinigung", text: "der zweite Betrag im Jahr, der nichts mit der Zakat zu tun hat." },
          { to: "/wissen/zinsen-im-islam", name: "Zinsen im Islam", text: "klärt den Begriff, um den sich alles andere dreht." },
        ]}
      />
    </BeitragSeite>
  </>
);

export default Nisab;
