import Seo, { beitragJsonLd } from "@/components/Seo";
import BeitragSeite, { type BeitragAbschnitt } from "@/components/BeitragSeite";
import { IlluGold, IlluPruefung } from "@/components/illu";
import { Link } from "react-router-dom";
import nisabDaten from "@/data/nisab.json";

/**
 * Die beiden Grenzen kommen live aus `src/data/nisab.json`. Diese Datei
 * schreibt `kurse_holen.py`. Deshalb steht hier keine einzige Zahl fest im
 * Text: eine Nisab-Grenze von letztem Jahr wäre schlechter als gar keine.
 */

const eur = (n: number) =>
  n.toLocaleString("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

const Bild = ({ children, text }: { children: React.ReactNode; text: string }) => (
  <figure className="my-6">
    <div className="overflow-hidden rounded-2xl">{children}</div>
    <figcaption className="mt-2 text-[14px] text-muted-foreground">{text}</figcaption>
  </figure>
);

const Grenze = ({
  titel,
  menge,
  betrag,
  satz,
}: {
  titel: string;
  menge: string;
  betrag: number;
  satz: string;
}) => (
  <div className="card-surface p-5">
    <p className="text-[14px] text-muted-foreground">{titel}</p>
    <p className="mt-1 text-[28px] font-bold leading-tight text-foreground">{eur(betrag)}</p>
    <p className="mt-1 text-[14px] text-muted-foreground">{menge}</p>
    <p className="mt-3 text-[15px] text-muted-foreground">{satz}</p>
  </div>
);

const abschnitte: BeitragAbschnitt[] = [
  {
    id: "was-ist-nisab",
    titel: "Der Nisab ist eine Untergrenze",
    inhalt: (
      <>
        <p>
          Zakat zahlt nicht jeder. Sie wird erst fällig, wenn dein Vermögen einen bestimmten Betrag
          erreicht und ein volles Mondjahr darüber bleibt. Dieser Betrag heißt Nisab.
        </p>
        <p>
          Der Sinn dahinter ist einfach: Wer selbst wenig hat, soll nicht abgeben müssen. Die Grenze
          trennt die, die geben, von denen, die empfangen.
        </p>
        <p className="rounded-xl bg-hero p-5 text-[19px] font-bold text-foreground">
          Der Nisab ist kein fester Eurobetrag. Er hängt am Gold- oder Silberpreis und ändert sich
          jeden Tag.
        </p>
        <p>
          Festgelegt wurde er in Gewicht, nicht in Geld: 85 Gramm Gold oder 595 Gramm Silber. Weil
          Silber heute im Verhältnis viel billiger ist als zur Zeit der Festlegung, liegen die
          beiden Grenzen weit auseinander. Genau daraus entsteht die einzige echte Frage in diesem
          Thema.
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
        <div className="my-6 grid gap-4 sm:grid-cols-2">
          <Grenze
            titel="Nach Silber"
            menge={`${nisabDaten.nisabSilberGramm} Gramm Silber`}
            betrag={nisabDaten.nisabSilberEuro}
            satz="Die niedrigere Grenze. Wer sie wählt, ist früher zakatpflichtig."
          />
          <Grenze
            titel="Nach Gold"
            menge={`${nisabDaten.nisabGoldGramm} Gramm Gold`}
            betrag={nisabDaten.nisabGoldEuro}
            satz="Die höhere Grenze. Wer sie wählt, zahlt erst deutlich später."
          />
        </div>
        <p>
          Der Unterschied ist keine Kleinigkeit. Zwischen den beiden Grenzen liegt der Bereich, in
          dem die Entscheidung darüber bestimmt, ob du in diesem Jahr überhaupt Zakat zahlst.
        </p>
        <p className="text-[15px] text-muted-foreground">
          Die Preise stammen aus Terminkursen und weichen meist ein bis zwei Prozent vom Spotpreis
          ab. Für eine taggenaue Berechnung nimm den Preis deines eigenen Stichtags.
        </p>
        <Bild text="Der Nisab wird in Gramm bestimmt, nicht in Euro. Der Eurobetrag ist nur die Umrechnung von heute.">
          <IlluGold />
        </Bild>
      </>
    ),
  },
  {
    id: "welche-grenze",
    titel: "Welche der beiden Grenzen gilt",
    inhalt: (
      <>
        <p>
          Beide gehen auf die Überlieferung zurück, und beide werden bis heute vertreten. Die
          Begründungen laufen in unterschiedliche Richtungen.
        </p>
        <p>
          <strong>Für Silber</strong> spricht, dass die niedrigere Grenze mehr Menschen erfasst und
          damit mehr bei den Empfängern ankommt. Wer im Zweifel ist, wählt nach dieser Sicht
          zugunsten der Armen. Das ist die verbreitete Empfehlung.
        </p>
        <p>
          <strong>Für Gold</strong> spricht, dass Silber seine damalige Kaufkraft verloren hat. Zur
          Zeit der Festlegung waren beide Grenzen etwa gleich viel wert. Heute entspricht der
          Silber-Nisab einem Betrag, von dem in Deutschland niemand leben kann. Nach dieser Sicht
          bildet Gold den ursprünglichen Sinn besser ab.
        </p>
        <p>
          <strong>Praktisch:</strong> Wer sich nicht sicher ist, nimmt Silber. Der Betrag ist
          niedriger, der Anteil beträgt ohnehin nur 2,5 Prozent, und niemand hat je bereut, zu viel
          gegeben zu haben. Wichtig ist vor allem, den einmal gewählten Maßstab beizubehalten und
          nicht jedes Jahr zu wechseln.
        </p>
        <p>
          Im{" "}
          <Link to="/zakat-rechner" className="text-primary hover:underline">
            Zakat-Rechner
          </Link>{" "}
          kannst du zwischen beiden umschalten und siehst sofort, was es ausmacht.
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
          Die Grenze allein reicht nicht. Dein Vermögen muss ein volles Mondjahr über ihr geblieben
          sein. Ein Mondjahr hat rund 354 Tage, also elf Tage weniger als das Kalenderjahr.
        </p>
        <p>
          Der Stichtag ist der Tag, an dem dein Vermögen den Nisab zum ersten Mal überschritten hat.
          Viele legen ihn bewusst in den Ramadan, um ihn nicht zu vergessen. Wichtig ist nur, dass
          du ihn beibehältst.
        </p>
        <p>
          <strong>Was ist, wenn du zwischendurch darunter rutschst?</strong> Dazu gibt es zwei
          Auffassungen. Die verbreitete sieht auf Anfang und Ende des Jahres: Lag das Vermögen an
          beiden Tagen über der Grenze, zählt das Jahr, auch wenn es dazwischen einmal darunter lag.
          Eine strengere Auffassung lässt das Jahr neu beginnen, sobald die Grenze unterschritten
          wird.
        </p>
        <p>
          Gerechnet wird am Stichtag mit dem, was da ist. Nicht mit dem Durchschnitt des Jahres und
          nicht mit dem Einkommen.
        </p>
        <Bild text="Zwei Bedingungen müssen zusammenkommen: über der Grenze, und das ein volles Mondjahr lang.">
          <IlluPruefung />
        </Bild>
      </>
    ),
  },
  {
    id: "was-zaehlt",
    titel: "Was in die Rechnung kommt",
    inhalt: (
      <>
        <p>
          Verglichen wird der Nisab mit deinem zakatpflichtigen Vermögen, nicht mit deinem Konto
          allein. Dazu gehören Bargeld und Guthaben, Gold und Silber, Handelsware sowie Aktien, ETFs
          und Sukuk.
        </p>
        <p>
          Nicht dazu zählt, was du selbst nutzt: die eigene Wohnung, das Auto, Möbel, Werkzeug.
          Kurzfristig fällige Schulden werden nach verbreiteter Auffassung vorher abgezogen.
        </p>
        <p>
          Bei langfristig gehaltenen Aktien und ETFs wird nicht der volle Wert angesetzt, sondern
          nach verbreiteter Auffassung rund 30 Prozent davon. Der{" "}
          <Link to="/zakat-rechner" className="text-primary hover:underline">
            Zakat-Rechner
          </Link>{" "}
          nimmt dir diese Rechnung ab und zeigt dir gleich, ob du über der Grenze liegst.
        </p>
      </>
    ),
  },
];

const faq = [
  {
    frage: "Wie hoch ist der Nisab?",
    antwort:
      "Der Nisab entspricht 85 Gramm Gold oder 595 Gramm Silber. In Euro ist er keine feste Größe, weil er am Tagespreis hängt. Die aktuellen Werte für beide Maßstäbe stehen oben in diesem Beitrag und im Zakat-Rechner.",
  },
  {
    frage: "Silber oder Gold, welcher Nisab gilt?",
    antwort:
      "Beide werden vertreten. Silber liegt niedriger, erfasst mehr Menschen und ist die verbreitete Empfehlung. Für Gold spricht, dass Silber seine damalige Kaufkraft verloren hat. Wichtig ist, den einmal gewählten Maßstab beizubehalten.",
  },
  {
    frage: "Warum liegen die beiden Grenzen so weit auseinander?",
    antwort:
      "Zur Zeit der Festlegung waren 85 Gramm Gold und 595 Gramm Silber etwa gleich viel wert. Seitdem ist Silber im Verhältnis zu Gold stark gefallen. Die Gewichte sind gleich geblieben, das Wertverhältnis nicht.",
  },
  {
    frage: "Was ist, wenn ich unterjährig unter den Nisab falle?",
    antwort:
      "Nach der verbreiteten Auffassung zählt der Stand zu Beginn und am Ende des Mondjahres. Lag dein Vermögen an beiden Tagen über der Grenze, bleibt es beim Stichtag. Eine strengere Auffassung lässt das Jahr neu beginnen, sobald die Grenze unterschritten wird.",
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
];

const Nisab = () => (
  <>
    <Seo
      title="Nisab: ab welchem Vermögen Zakat fällig wird | finanzmuslim"
      description="Der Nisab entspricht 85 Gramm Gold oder 595 Gramm Silber. Beide Grenzen in Euro mit Datum, warum sie so weit auseinanderliegen und welche du nehmen solltest."
      path="/wissen/nisab"
      jsonLd={beitragJsonLd({
        titel: "Nach Silber",
        beschreibung: "Der Nisab entspricht 85 Gramm Gold oder 595 Gramm Silber. Beide Grenzen in Euro mit Datum, warum sie so weit auseinanderliegen und welche du nehmen solltest.",
        path: "/wissen/nisab",
        geprueftAm: "16. August 2026",
        faq,
      })}
    />
    <BeitragSeite
      titel="Nisab: ab wann du Zakat zahlst"
      kurzGesagt={[
        "Der Nisab ist die Untergrenze, ab der Zakat fällig wird.",
        "Er ist in Gewicht festgelegt: 85 Gramm Gold oder 595 Gramm Silber.",
        `Nach Silber sind das heute rund ${eur(nisabDaten.nisabSilberEuro)}, nach Gold rund ${eur(nisabDaten.nisabGoldEuro)}.`,
        "Silber ist die verbreitete Empfehlung, weil mehr bei den Empfängern ankommt.",
        "Zweite Bedingung: das Vermögen muss ein volles Mondjahr über der Grenze bleiben.",
      ]}
      abschnitte={abschnitte}
      faq={faq}
      geprueftAm="16. August 2026"
      rechtshinweis="Dieser Beitrag gibt bekannte Positionen wieder und dient ausschließlich zu Bildungszwecken. Er ist keine Fatwa und ersetzt nicht die Auskunft eines Gelehrten. Zur Wahl des Maßstabs, zur Behandlung unterjähriger Schwankungen und zur Bemessung von Wertpapieren bestehen innerhalb der Rechtsschulen unterschiedliche Auffassungen. Die Eurobeträge beruhen auf Terminkursen für Gold und Silber und weichen meist ein bis zwei Prozent vom Spotpreis ab."
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
        text: "27 Anlagen mit Kosten, Größe und Prüfstelle.",
        knopf: "Zu den Anlagen",
      }}
    >
      <section className="card-surface p-6">
        <h2 className="text-[19px] font-bold text-foreground">Passt dazu</h2>
        <ul className="mt-3 space-y-2 text-[16px]">
          <li>
            <Link to="/zakat-rechner" className="text-primary hover:underline">
              Der Zakat-Rechner
            </Link>{" "}
            rechnet mit beiden Grenzen und zeigt dir den Unterschied.
          </li>
          <li>
            <Link to="/wissen/halal-gold-kaufen" className="text-primary hover:underline">
              Gold richtig kaufen
            </Link>{" "}
            erklärt, welches Gold in die Zakat-Rechnung gehört.
          </li>
          <li>
            <Link to="/wissen/zinsen-im-islam" className="text-primary hover:underline">
              Zinsen im Islam
            </Link>{" "}
            klärt den Begriff, um den sich alles andere dreht.
          </li>
        </ul>
      </section>
    </BeitragSeite>
  </>
);

export default Nisab;
