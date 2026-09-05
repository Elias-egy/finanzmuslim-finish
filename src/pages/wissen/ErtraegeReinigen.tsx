import Seo, { beitragJsonLd } from "@/components/Seo";
import BeitragSeite, { type BeitragAbschnitt, type BeitragFrage } from "@/components/BeitragSeite";
import { IlluReinigung, IlluZweiEbenen } from "@/components/illu";
import {
  B,
  Begriff,
  Beispiel,
  Bild,
  Checkliste,
  Frage,
  Hinweis,
  L,
  Merksatz,
  PasstDazu,
  Schritte,
  Tabelle,
} from "@/components/beitrag";

const abschnitte: BeitragAbschnitt[] = [
  {
    id: "warum",
    titel: "Warum bleibt bei einer geprüften Aktie überhaupt etwas übrig?",
    inhalt: (
      <>
        <Frage>Ein Fonds hat ein Shariah-Zertifikat, die Aktie besteht jede App. Was soll da noch unrein sein?</Frage>
        <p>
          Die Prüfung sortiert Firmen aus, die <B>hauptsächlich</B> mit Verbotenem Geld verdienen. Sie
          verlangt aber nicht, dass eine Firma zu hundert Prozent sauber ist. Das geht in der Praxis auch
          kaum: Fast jede Firma hat Geld auf einem verzinsten Konto liegen oder einen kleinen Nebenumsatz,
          der nicht in Ordnung ist.
        </p>
        <p>
          Nimm einen Maschinenbauer. Sein Geschäft ist unstrittig. Auf seinem Firmenkonto liegen aber ein
          paar Millionen, und die Bank zahlt dafür Zinsen. Das ist vielleicht ein halbes Prozent seines
          Gewinns. Für die Prüfung ist die Firma damit weiterhin in Ordnung, denn die Grenzwerte lassen
          einen kleinen Rest zu.
        </p>
        <Merksatz>Der kleine erlaubte Rest bleibt trotzdem unrein. Er wird ausgerechnet und weitergegeben.</Merksatz>
        <p>
          Genau das ist die Bereinigung. Sie ersetzt die Zakat nicht, und sie ist keine Spende, für die du
          eine Belohnung erwartest. Sie ist das Aussortieren eines Anteils, der dir nie zustand.
        </p>
        <Begriff wort="Bereinigung" arabisch="Tathir, auf Englisch Purification">
          Den Anteil der Erträge, der aus Zinsen oder anderen unerlaubten Quellen stammt, ausrechnen und
          weggeben. Kursgewinne selbst musst du nicht bereinigen, nur diesen Ertragsanteil.
        </Begriff>
        <Bild text="Von 300 Euro Ausschüttung bleiben 296,40 Euro bei dir. Die 3,60 Euro gehen weiter.">
          <IlluReinigung />
        </Bild>
      </>
    ),
  },
  {
    id: "fuenf-prozent",
    titel: "Die Fünf-Prozent-Regel",
    inhalt: (
      <>
        <p>
          Die Zahl fünf kommt aus dem AAOIFI-Standard, an dem sich fast alle Prüfstellen orientieren. Er
          sagt: Eine Firma darf höchstens <B>fünf Prozent ihrer gesamten Einnahmen</B> aus unerlaubten
          Quellen haben. Dazu kommen zwei Grenzen für Schulden und für zinsbringende Geldanlagen, beide
          bei dreißig Prozent. Die drei Zahlen stehen in{" "}
          <L to="/wissen/sind-aktien-halal">Sind Aktien halal?</L>
        </p>
        <Frage>Heißt das, fünf Prozent Zinsgeld sind erlaubt?</Frage>
        <p>
          Nein. Die fünf Prozent sind eine <B>Toleranz beim Kauf</B>, kein Freibrief beim Behalten. Der
          Standard sagt beides: Du darfst die Aktie kaufen, und du musst den unreinen Anteil trotzdem
          weggeben. Die Regel öffnet die Tür zur Aktie und schließt gleichzeitig die Tür zum unreinen Geld.
        </p>
        <p>
          Warum überhaupt eine Toleranz? Weil sonst fast keine Aktie übrig bliebe. Ein Grundsatz der
          Gelehrten ist, dass Kleinigkeiten übersehen werden, die man nicht vermeiden kann. Fünf Prozent
          gilt als so klein, dass es das Geschäft der Firma nicht prägt. Manche Gelehrte sind strenger und
          lassen bei Zinsen gar keine Toleranz zu. Wer ihnen folgt, kauft solche Aktien nicht. Dieser
          Beitrag folgt dem AAOIFI-Standard, weil die geprüften Fonds in unserer Datenbank darauf aufbauen.
        </p>
        <Bild text="Erst wird das Geschäft geprüft, dann der Umgang mit Geld. Aus der zweiten Ebene kommt der unreine Rest.">
          <IlluZweiEbenen />
        </Bild>
      </>
    ),
  },
  {
    id: "wie-viel",
    titel: "Wie viel es wirklich ist",
    inhalt: (
      <>
        <p>
          Die Zahl kommt nicht von dir. Sie kommt entweder vom Fondsanbieter oder von einer App, die die
          Bilanz der Firma ausgewertet hat. Drei Fälle:
        </p>
        <Schritte
          schritte={[
            {
              titel: "Der Anbieter nennt einen Satz",
              text: "Viele Islamic-Fonds veröffentlichen einmal im Jahr, wie viel von der Ausschüttung unrein war, als Prozentsatz oder als Betrag je Anteil. Bei iShares heißt die Tabelle auf der Produktseite Purification Data. Das ist der beste Fall: Du übernimmst die Zahl.",
            },
            {
              titel: "Eine App nennt einen Satz",
              text: "Musaffa und Zoya werten die Bilanzen aus und zeigen je Aktie, wie viel je Anteil zu bereinigen ist. Welche App das in welchem Abo kann, steht weiter unten.",
            },
            {
              titel: "Niemand nennt einen Satz",
              text: "Dann bleibt nur eine vorsichtige Schätzung. Verbreitet ist, den maximal zulässigen Anteil anzusetzen, also fünf Prozent der Erträge. Das liegt fast immer über dem echten Wert, und zu viel abzugeben ist der kleinere Fehler.",
            },
          ]}
        />
        <p>
          Die echten Werte sind meist klein. Bei breiten Islamic-ETFs liegt der unreine Anteil oft im
          niedrigen einstelligen Prozentbereich der Ausschüttung, manchmal unter einem Prozent. Auf
          hundert Euro Dividende sind das ein paar Euro. Es geht um Sauberkeit, nicht um große Summen.
        </p>
        <Hinweis titel="Was du nicht bereinigen musst">
          <p>
            Kursgewinne. Wenn du Anteile für 1.000 Euro gekauft und für 1.300 verkauft hast, sind die 300
            Euro dein Gewinn aus dem Verkauf. Bereinigt wird nur der Ertragsanteil, der aus Zinsen oder
            Nebengeschäften stammt. Bei Gold, Silber und Sukuk stellt sich die Frage in der Regel gar
            nicht, dort gibt es keine Firmengewinne.
          </p>
        </Hinweis>
      </>
    ),
  },
  {
    id: "rechnen",
    titel: "So rechnest du es aus",
    inhalt: (
      <>
        <Frage>Ausschüttender ETF, Thesaurierer, Einzelaktie. Rechnet man das dreimal verschieden?</Frage>
        <p>Die Idee ist immer dieselbe: unreiner Anteil mal deine Anteile. Nur die Zahl, die du einsetzt, kommt aus einer anderen Quelle.</p>
        <Beispiel
          titel="Ausschüttender ETF"
          rechnung={["300 € Ausschüttung × 1,2 % = 3,60 €"]}
          ergebnis="Die 3,60 Euro gibst du weiter. Der Rest gehört dir."
        >
          <p>Du hast im Jahr 300 Euro Ausschüttung bekommen. Der Anbieter weist 1,2 Prozent als unrein aus.</p>
        </Beispiel>
        <Beispiel
          titel="Thesaurierender ETF"
          rechnung={["0,04 € je Anteil × 150 Anteile = 6,00 €"]}
          ergebnis="Auch ohne Auszahlung wird bereinigt. Der Ertrag steckt im Kurs."
        >
          <p>
            Es gibt keine Auszahlung, der Ertrag bleibt im Fonds und steigert den Kurs. Der Anbieter
            weist deshalb einen Betrag je Anteil aus. Fehlt er, nimm die Ausschüttung eines vergleichbaren
            ausschüttenden Fonds als Näherung oder die Fünf-Prozent-Schätzung auf die jährliche Rendite.
          </p>
        </Beispiel>
        <Beispiel
          titel="Einzelaktie"
          rechnung={["2 Mio. € Zinserträge ÷ 50 Mio. Aktien = 0,04 € je Aktie", "0,04 € × 200 Aktien = 8,00 €"]}
          ergebnis="So kommt die App auf ihren Wert je Aktie."
        >
          <p>
            Eine Firma hatte im Jahr zwei Millionen Euro Zinserträge und hat fünfzig Millionen Aktien. Du
            hältst 200 Stück. Das ist der Rechenweg, den Gelehrte beschreiben: unreine Einnahmen der
            Firma, geteilt durch alle Aktien, mal deine Aktien.
          </p>
        </Beispiel>
        <p>
          Die Zahlen in den Beispielen sind erfunden, das Vorgehen nicht. Wer nicht selbst rechnen will,
          nimmt den <L to="/bereinigungsrechner">Bereinigungsrechner</L>: Betrag und Satz eintragen, fertig.
        </p>
      </>
    ),
  },
  {
    id: "wer-es-macht",
    titel: "Welche Fonds es für dich machen",
    inhalt: (
      <>
        <Frage>Muss ich das bei jedem ETF selbst tun, oder gibt es Fonds, die das übernehmen?</Frage>
        <p>
          Es gibt beides, und der Unterschied ist neu. Seit dem 1. Januar 2026 reinigt der iShares MSCI
          World Islamic die Dividenden im Fonds selbst: Der unreine Anteil wird vom Fonds an
          Hilfsorganisationen gegeben, die das Gelehrtengremium des Fonds freigegeben hat. Was bei dir
          ankommt, ist schon sauber. Das hat iShares im Oktober 2025 angekündigt.
        </p>
        <Tabelle
          kopf={["Fonds", "Reinigung", "Was du tun musst"]}
          zeilen={[
            ["iShares MSCI World Islamic", "im Fonds, seit 1. Januar 2026", "nichts mehr für Ausschüttungen ab 2026"],
            ["iShares MSCI USA Islamic, EM Islamic", "Tabelle Purification Data auf der Produktseite", "Satz ablesen und auf deine Ausschüttung rechnen"],
            ["iShares USD Sukuk", "entfällt", "nichts, Sukuk haben keinen Firmengewinn"],
            ["Invesco Dow Jones Islamic", "nicht im Fonds, thesaurierend", "selbst schätzen, der Prospekt verweist auf den AAOIFI-Standard"],
            ["HSBC Islamic Screened, alle vier", "noch nicht geprüft", "beim Anbieter nachsehen oder schätzen"],
            ["HANetf Saturna, Franklin, Comgest", "noch nicht geprüft", "beim Anbieter nachsehen oder schätzen"],
            ["Gold- und Silber-ETCs", "entfällt", "nichts"],
          ]}
        />
        <p>
          Die Tabelle gilt für die Fonds in unserer <L to="/halal-anlagen">Anlagen-Datenbank</L>, Stand
          September 2026. Anbieter ändern so etwas ohne große Ankündigung, deshalb steht bei jeder Anlage
          dort, wann wir zuletzt nachgesehen haben.
        </p>
      </>
    ),
  },
  {
    id: "apps",
    titel: "Welche App es für dich ausrechnet",
    inhalt: (
      <>
        <p>
          Zwei Apps rechnen den Satz je Aktie aus. Beide prüfen nach dem AAOIFI-Standard, beide brauchen
          für die Bereinigung das Bezahl-Abo.
        </p>
        <Tabelle
          kopf={["App", "Prüfen, ob halal", "Bereinigung ausrechnen", "Preis"]}
          zeilen={[
            ["Musaffa", "kostenlos, unbegrenzt", "nur im Premium-Abo, als Purification Calculator", "rund 200 US-Dollar im Jahr, oft mit Rabatt"],
            ["Zoya", "kostenlos, mit Limit je Monat", "im Portfolio als Purification Tracker, volle Depot-Funktionen im Pro-Abo", "rund 50 US-Dollar im Jahr"],
          ]}
        />
        <p>
          Preise Stand September 2026, in US-Dollar, weil beide Anbieter dort abrechnen. Für ein Depot mit
          ein oder zwei Islamic-ETFs brauchst du keine App: Der Anbieter nennt den Satz, der Rest ist eine
          Multiplikation. Die Apps lohnen sich bei Einzelaktien, weil dort niemand sonst die Bilanz für
          dich auswertet.
        </p>
      </>
    ),
  },
  {
    id: "wohin",
    titel: "Wohin der Betrag geht",
    inhalt: (
      <>
        <Frage>Kann ich das Geld einfach in die Moscheekasse werfen?</Frage>
        <p>
          Genau da sind sich viele Gelehrte einig, dass es nicht hingehört. Der Grundsatz: Der Betrag soll
          jemandem nützen, und du sollst nichts davon haben, weder Geld noch Lohn noch Ansehen.
        </p>
        <Checkliste
          punkte={[
            { art: "ja", text: "An Bedürftige, direkt oder über eine Hilfsorganisation. Das ist der übliche Weg." },
            { art: "ja", text: "Für Verbrauchsgüter, etwa Essen und Trinken für Arme oder Seife und Reinigungsmittel für ein Gemeindehaus." },
            { art: "nein", text: "Nicht für den Bau einer Moschee und nicht für Korankopien. Viele Gelehrte schließen ehrenhafte Zwecke aus, weil unreines Geld dafür nicht verwendet werden soll." },
            { art: "nein", text: "Nicht auf die Zakat anrechnen. Beides sind verschiedene Dinge." },
            { art: "nein", text: "Keine Spendenquittung nutzen, wenn du dadurch Steuern sparst. Dann hättest du wieder einen Vorteil davon." },
          ]}
        />
        <p>
          Und die Absicht: Es ist keine Spende, für die du Belohnung erwartest. Du gibst zurück, was dir
          nie gehört hat. Wer das so versteht, tut sich mit dem Betrag leichter.
        </p>
      </>
    ),
  },
  {
    id: "wann",
    titel: "Wann du es machst",
    inhalt: (
      <>
        <p>
          Einmal im Jahr reicht. Der praktischste Termin ist der Tag, an dem du ohnehin deine Zakat
          ausrechnest. Dann liegen die Zahlen schon auf dem Tisch, und du vergisst es nicht. Was der{" "}
          <L to="/zakat-rechner">Zakat-Rechner</L> braucht, brauchst du hier auch: den Depotauszug.
        </p>
        <Frage>Und wenn du in den letzten Jahren nie bereinigt hast?</Frage>
        <p>
          Nachholen, so gut es geht. Eine grobe Schätzung über die vergangenen Jahre ist besser als gar
          nichts, und niemand verlangt Buchhaltung über zehn Jahre. Nimm die Ausschüttungen aus den alten
          Jahressteuerbescheinigungen deines Brokers, rechne mit fünf Prozent und gib den Betrag weg.
          Danach fängst du sauber an.
        </p>
      </>
    ),
  },
];

const faq: BeitragFrage[] = [
  {
    frage: "Was bedeutet Aktienbereinigung?",
    antwort:
      "Auch geprüfte Firmen haben kleine Erträge aus Zinsen oder aus Nebengeschäften, die nicht erlaubt sind. Der darauf entfallende Anteil deiner Erträge wird ausgerechnet und weitergegeben, ohne dafür eine Belohnung zu erwarten. Auf Arabisch heißt das Tathir, auf Englisch Purification.",
  },
  {
    frage: "Wie viel Prozent muss ich bereinigen?",
    antwort:
      "Das hängt vom Fonds oder von der Aktie ab. Viele Anbieter veröffentlichen einmal im Jahr einen Satz, oft im niedrigen einstelligen Prozentbereich der Ausschüttung. Fehlt die Angabe, wird verbreitet der maximal zulässige Anteil aus dem Screening angesetzt, also fünf Prozent der Erträge.",
  },
  {
    frage: "Muss ich bei einem thesaurierenden ETF auch bereinigen?",
    antwort:
      "Nach verbreiteter Auffassung ja. Es gibt zwar keine Auszahlung, der Ertrag steckt aber im Kurs. Üblich ist, den vom Anbieter ausgewiesenen Betrag je Anteil mit der Zahl deiner Anteile zu multiplizieren. Fehlt die Angabe, hilft die Fünf-Prozent-Schätzung.",
  },
  {
    frage: "Muss ich Kursgewinne bereinigen?",
    antwort:
      "Nach dem AAOIFI-Standard nicht. Bereinigt wird der Anteil der Erträge, der aus unerlaubten Quellen stammt, etwa Zinsen. Der Gewinn aus dem Verkauf deiner Anteile ist davon nicht betroffen.",
  },
  {
    frage: "Welche ETFs bereinigen selbst?",
    antwort:
      "Der iShares MSCI World Islamic reinigt seit dem 1. Januar 2026 im Fonds, der unreine Anteil geht an Hilfsorganisationen, die das Gelehrtengremium freigegeben hat. Bei den anderen iShares-Islamic-ETFs steht eine Tabelle mit dem Satz auf der Produktseite. Bei thesaurierenden Fonds wie dem Invesco Dow Jones Islamic bleibt es bei dir.",
  },
  {
    frage: "Welche App rechnet die Bereinigung aus?",
    antwort:
      "Musaffa hat einen Purification Calculator, allerdings nur im Premium-Abo. Zoya zeigt im Portfolio einen Purification Tracker. Beide prüfen nach dem AAOIFI-Standard. Für ein Depot aus ein oder zwei Islamic-ETFs reicht der Satz des Anbieters und unser Bereinigungsrechner.",
  },
  {
    frage: "Zählt die Bereinigung als Zakat oder als Sadaqa?",
    antwort:
      "Weder noch. Zakat ist eine eigene Pflicht und wird getrennt gerechnet. Sadaqa ist eine freiwillige Gabe, für die du Lohn erwartest. Bei der Bereinigung gibst du etwas zurück, das dir nie zustand, und erwartest dafür nichts.",
  },
  {
    frage: "Was ist, wenn ich jahrelang nicht bereinigt habe?",
    antwort:
      "Nachholen, so gut es geht. Eine grobe Schätzung über die vergangenen Jahre mit fünf Prozent der Ausschüttungen ist besser als gar nichts. Niemand verlangt eine lückenlose Buchhaltung rückwirkend.",
  },
];

const beschreibung =
  "Auch geprüfte Aktien und ETFs lassen einen kleinen unreinen Anteil übrig. Die Fünf-Prozent-Regel, wie du den Betrag ausrechnest, welche Fonds es für dich übernehmen, welche App es kann und wohin das Geld geht.";

const ErtraegeReinigen = () => (
  <>
    <Seo
      title="Aktienbereinigung: Erträge reinigen, Schritt für Schritt | finanzmuslim"
      description={beschreibung}
      path="/wissen/ertraege-reinigen"
      jsonLd={beitragJsonLd({
        titel: "Aktienbereinigung: Erträge reinigen",
        beschreibung,
        path: "/wissen/ertraege-reinigen",
        datePublished: "16. August 2026",
        dateModified: "5. September 2026",
        faq,
      })}
    />
    <BeitragSeite
      slug="ertraege-reinigen"
      titel="Aktienbereinigung: Erträge reinigen"
      untertitel="Der Schritt, den fast jeder vergisst, und der weniger Arbeit macht, als du denkst."
      kurzGesagt={[
        "Auch geprüfte Firmen haben einen kleinen unreinen Ertragsanteil, meist Zinsen aus der Firmenkasse.",
        "Die Fünf-Prozent-Regel erlaubt den Kauf, nicht das Behalten. Der Rest wird weitergegeben.",
        "Den Satz nennt der Anbieter oder eine App. Sonst rechnest du vorsichtig mit fünf Prozent.",
        "Der iShares MSCI World Islamic bereinigt seit 2026 im Fonds. Bei den meisten anderen bleibt es bei dir.",
        "Der Betrag geht an Bedürftige, nicht in Moschee oder Koran, und zählt weder als Zakat noch als Sadaqa.",
      ]}
      abschnitte={abschnitte}
      faq={faq}
      datePublished="16. August 2026"
      dateModified="5. September 2026"
      boxMitteNach={3}
      rechtshinweis="Dieser Beitrag gibt bekannte Positionen wieder und dient ausschließlich zu Bildungszwecken. Er ist keine Fatwa und keine Steuer- oder Anlageberatung. Zur Höhe des Reinigungssatzes, zur Behandlung thesaurierender Fonds und zur zulässigen Verwendung des Betrags bestehen zwischen Gelehrten unterschiedliche Auffassungen. Angaben zu Anbietern und Apps beruhen auf öffentlich zugänglichen Quellen, Stand September 2026. Die Zahlen in den Beispielen sind erfunden."
      boxOben={{
        kategorie: "Rechner",
        ueberschrift: "Bereinigung in dreißig Sekunden ausrechnen",
        linkZiel: "/bereinigungsrechner",
        text: "Ausschüttung und Satz eintragen, der Betrag steht da.",
        knopf: "Zum Bereinigungsrechner",
      }}
      boxMitte={{
        kategorie: "Anlagen",
        ueberschrift: "Welche Fonds den Reinigungssatz nennen",
        linkZiel: "/halal-anlagen",
        text: "27 Anlagen mit Kosten, Größe und Prüfstelle.",
        knopf: "Zu den Anlagen",
      }}
    >
      <PasstDazu
        punkte={[
          { to: "/wissen/sind-aktien-halal", name: "Sind Aktien halal?", text: "zeigt die zwei Ebenen und die drei Grenzwerte, aus denen der unreine Rest entsteht." },
          { to: "/wissen/halal-etfs", name: "Halal ETFs", text: "erklärt, worauf du beim Fonds selbst achtest." },
          { to: "/wissen/nisab", name: "Nisab", text: "sagt dir, ab wann Zakat fällig wird, der zweite Termin im selben Jahr." },
        ]}
      />
    </BeitragSeite>
  </>
);

export default ErtraegeReinigen;
