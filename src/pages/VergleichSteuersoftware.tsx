import { Link } from "react-router-dom";
import { VergleichsSeite } from "@/components/vergleich/VergleichsSeite";
import { steuersoftwareVergleich, STEUER_ZEILEN, STEUER_FILTER } from "@/data/steuersoftwareVergleich";

/**
 * Vergleich der Programme für die Steuererklärung.
 *
 * Die Seite ist die erste ohne Halal-Frage. Ein Steuerprogramm rechnet nach dem
 * Gesetz, daran ist nichts auszulegen. Deshalb übernimmt sie vom gemeinsamen
 * Baustein zwar die Tabelle, setzt aber eigene Kennzahlen, eine eigene
 * Überschrift über den Kriterien und einen eigenen Hinweis zur Reihenfolge.
 *
 * Sortiert wird nach Preis, die kostenlosen zuerst. Das stellt ausgerechnet die
 * zwei Anbieter nach oben, die uns nichts einbringen. Genau so gehört es sich.
 */

const Reihenfolge = () => (
  <section className="mt-4 rounded-lg border border-border px-4 py-3 lg:mt-10 lg:border-primary/30 lg:bg-hero lg:px-6 lg:py-5">
    <p className="text-[14px] leading-snug text-muted-foreground lg:hidden">
      Nach Preis sortiert. Die beiden kostenlosen stehen oben und zahlen uns nichts.
    </p>
    <p className="hidden text-[16px] font-bold text-foreground lg:block">
      Nach Preis sortiert, das Günstigste zuerst
    </p>
    <p className="mt-1 hidden text-[15px] leading-[24px] text-muted-foreground lg:block">
      Eine Note vergeben wir hier nicht. Was ein Steuerprogramm taugt, hängt daran, welche
      Einkünfte du hast, und das ist bei jedem anders. Oben stehen die beiden kostenlosen
      Programme. Von denen bekommen wir nichts, und sie sind für viele trotzdem die richtige
      Wahl.
    </p>
  </section>
);

const WozuBlock = () => (
  <section className="mt-14 max-w-3xl">
    <h2 className="text-2xl font-bold text-foreground">Was das mit deiner Geldanlage zu tun hat</h2>
    <p className="mt-3 text-[17px] leading-[26px] text-foreground/90">
      Wer anlegt, bekommt Erträge, und Erträge gehören in die Steuererklärung. Bei einem
      deutschen Broker zieht die Bank die Steuer meist schon ab. Sobald du im Ausland anlegst
      oder Krypto hältst, machst du es selbst.
    </p>
    <ul className="mt-6 space-y-5">
      {[
        {
          titel: "Dein Depot liegt im Ausland",
          text: "Ausländische Broker führen keine deutsche Abgeltungsteuer ab. Zinsen, Dividenden und Verkaufsgewinne trägst du selbst ein, in die Anlage KAP. Ein Programm ohne diese Anlage hilft dir dann nicht.",
        },
        {
          titel: "Du hältst Krypto",
          text: "Gewinne aus Krypto sind keine Kapitalerträge, sondern private Veräusserungsgeschäfte. Nach einem Jahr Haltedauer sind sie steuerfrei, davor nicht. Prüfe vor dem Kauf, ob dein Programm diesen Fall annimmt.",
        },
        {
          titel: "Du hast gereinigt oder gespendet",
          text: "Was du wegen unerlaubter Erträge gespendet hast, kannst du unter Umständen als Spende absetzen, wenn der Empfänger gemeinnützig ist. Wie du den Anteil ausrechnest, zeigt unser Bereinigungsrechner.",
        },
      ].map((punkt) => (
        <li key={punkt.titel}>
          <p className="text-[16px] font-semibold text-foreground">{punkt.titel}</p>
          <p className="mt-1 text-[15px] leading-[24px] text-muted-foreground">{punkt.text}</p>
        </li>
      ))}
    </ul>
    <h2 className="mt-10 text-2xl font-bold text-foreground">Zwei Programme kosten nichts</h2>
    <p className="mt-3 text-[17px] leading-[26px] text-foreground/90">
      Mein ELSTER ist das Portal der Steuerverwaltung selbst. Es kostet nichts, kann jeden Fall
      und führt dich nicht an die Hand. Wer schon einmal eine Erklärung gemacht hat, kommt damit
      zurecht.
    </p>
    <p className="mt-3 text-[17px] leading-[26px] text-foreground/90">
      CHECK24 Steuer ist ebenfalls kostenlos und fragt dich wie die Bezahlprogramme Schritt für
      Schritt ab. Bezahlt wird das über das übrige Geschäft des Hauses. Wer dafür kein Konto bei
      einem Vergleichsportal anlegen will, hat mit ELSTER den Weg ohne Firma dazwischen.
    </p>
    <p className="mt-5 text-[15px] leading-[24px] text-muted-foreground">
      Wo deine Erträge überhaupt herkommen, klärt der{" "}
      <Link to="/vergleich/depot" className="font-semibold text-primary hover:underline">
        Depot-Vergleich
      </Link>
      , und was du wegen unerlaubter Erträge abgeben musst, rechnet der{" "}
      <Link to="/bereinigungsrechner" className="font-semibold text-primary hover:underline">
        Bereinigungsrechner
      </Link>
      .
    </p>
  </section>
);

const VergleichSteuersoftware = () => (
  <VergleichsSeite
    pfad="/vergleich/steuersoftware"
    brotkrumen="Steuersoftware"
    titel="Steuersoftware im Vergleich"
    untertitel="Dreizehn Programme für die Steuererklärung: was sie kosten, wann du zahlst und welche Einkünfte sie annehmen"
    seoTitel="Steuersoftware Vergleich 2026: Preise und Leistungen | finanzmuslim"
    seoText="Dreizehn Steuerprogramme im Vergleich: ELSTER, CHECK24, WISO, Taxfix, smartsteuer und mehr. Preis, Zahlung erst bei Abgabe, Kapitalerträge, Selbstständige und Vermietung, alles beim Anbieter geprüft."
    einheit="Programme"
    einleitung={
      <>
        <p>
          Ein Steuerprogramm rechnet nach demselben Gesetz wie jedes andere. Der Unterschied
          liegt woanders: welche Einkünfte es überhaupt annimmt, was es kostet und ob du erst
          zahlst, wenn du weisst, was zurückkommt.
        </p>
        <p>
          Für dich zählt vor allem eine Zeile. Wenn du anlegst, brauchst du ein Programm, das
          Kapitalerträge kann. Zwei der günstigen Programme können das nicht, und das merkst du
          erst, wenn du mitten in der Erklärung steckst.
        </p>
      </>
    }
    zeilen={STEUER_ZEILEN}
    anbieter={steuersoftwareVergleich}
    filter={STEUER_FILTER}
    kennzahlen={[
      { zahl: steuersoftwareVergleich.length, text: "Programme im Vergleich" },
      { zahl: 2, text: "davon kostenlos" },
      { zahl: 7, text: "zahlen erst bei Abgabe" },
    ]}
    reihenfolge={<Reihenfolge />}
    stand="19.09.2026"
    standHinweis="Alle Preise beim Anbieter geprüft"
    quellenHinweis="Alle Angaben stammen von den Seiten der Hersteller, geprüft am 19.09.2026, Steuerjahr 2025. Preise aus Vergleichsportalen haben wir bewusst nicht übernommen, sie widersprachen sich. Keines dieser Programme ist ein Partner von uns."
    kriterienTitel="Worauf wir hier achten"
    kriterien={[
      {
        titel: "Kapitalerträge",
        text: "Nimmt das Programm die Anlage KAP an? Das brauchst du, sobald Zinsen, Dividenden oder Verkaufsgewinne nicht schon von der Bank versteuert wurden. Für Anleger ist das die wichtigste Frage überhaupt.",
      },
      {
        titel: "Wann du zahlst",
        text: "Erst bei Abgabe heisst: Du siehst deine Erstattung, bevor du dich entscheidest. Wer vorher kauft, zahlt auch dann, wenn am Ende nichts zurückkommt.",
      },
      {
        titel: "Erklärungen je Kauf",
        text: "Manche Lizenzen decken bis zu fünf Erklärungen ab. Mit der Familie geteilt kostet dieselbe Software dann ein Fünftel.",
      },
      {
        titel: "Läuft auf",
        text: "Vier Programme laufen nur unter Windows. Wer einen Mac hat oder am Handy arbeitet, fällt damit raus, egal wie günstig sie sind.",
      },
    ]}
    zusatz={<WozuBlock />}
    faq={[
      {
        frage: "Welche Steuersoftware ist die beste?",
        antwort:
          "Das hängt an deinen Einkünften. Wer nur Lohn hat, kommt mit jedem Programm zurecht, auch mit den kostenlosen. Wer Kapitalerträge, Vermietung oder ein Gewerbe hat, braucht ein Programm, das diese Anlagen annimmt. Steuerbot und STEUEReasy scheiden dann aus.",
      },
      {
        frage: "Gibt es eine kostenlose Steuersoftware?",
        antwort:
          "Ja, zwei. Mein ELSTER ist das amtliche Portal und kostet nichts, führt dich aber nicht durch die Erklärung. CHECK24 Steuer ist ebenfalls kostenlos und fragt dich Schritt für Schritt ab. Beide decken auch Kapitalerträge, Vermietung und Selbstständigkeit ab.",
      },
      {
        frage: "Brauche ich als Anleger eine besondere Software?",
        antwort:
          "Du brauchst eine, die die Anlage KAP kann. Bei einem deutschen Broker führt die Bank die Abgeltungsteuer meist schon ab, dann steht die Erklärung nur zur Kontrolle an. Bei einem ausländischen Broker trägst du die Erträge selbst ein.",
      },
      {
        frage: "Wie versteuere ich Krypto?",
        antwort:
          "Gewinne aus Krypto zählen nicht als Kapitalerträge, sondern als private Veräusserungsgeschäfte. Wer länger als ein Jahr hält, zahlt darauf keine Steuer. Wer früher verkauft, gibt den Gewinn an, sobald er über der Freigrenze liegt. Ob dein Programm diesen Fall annimmt, haben wir noch nicht bei allen geprüft.",
      },
      {
        frage: "Was heisst erst bei Abgabe zahlen?",
        antwort:
          "Du füllst die Erklärung vollständig aus und siehst, wie viel du zurückbekommst. Erst wenn du sie ans Finanzamt schickst, wird die Gebühr fällig. Sieben der dreizehn Programme machen das so, die reinen Windows-Programme nicht: Die kaufst du vorher.",
      },
      {
        frage: "Lohnt sich die Steuererklärung überhaupt?",
        antwort:
          "Meistens ja. Wer sie nicht abgeben muss, aber abgibt, bekommt im Schnitt eine vierstellige Erstattung. Bei den Programmen, die erst bei der Abgabe kosten, siehst du das Ergebnis vorher und kannst immer noch abbrechen.",
      },
    ]}
    schluss="Diese Seite ist keine Steuerberatung. Wir vergleichen, was die Hersteller über ihre Programme angeben, und prüfen das auf ihren Seiten nach. Welche Anlagen du abgeben musst und wie du sie ausfüllst, klärt im Zweifel ein Steuerberater oder ein Lohnsteuerhilfeverein. Preise und Leistungen können sich ändern."
  />
);

export default VergleichSteuersoftware;
