import Seo, { beitragJsonLd } from "@/components/Seo";
import BeitragSeite, { type BeitragAbschnitt, type BeitragFrage } from "@/components/BeitragSeite";
import { IlluNullsumme } from "@/components/illu";
import {
  B,
  Bild,
  Faelle,
  Frage,
  Hinweis,
  L,
  Merksatz,
  PasstDazu,
  Schritte,
} from "@/components/beitrag";

const abschnitte: BeitragAbschnitt[] = [
  {
    id: "was-ist-maysir",
    titel: "Maysir ist das Nullsummenspiel",
    inhalt: (
      <>
        <p>
          Maysir heißt Glücksspiel. Gemeint ist ein Geschäft, bei dem beide Seiten etwas einsetzen, der Ausgang
          vom Zufall abhängt und der Gewinn der einen Seite genau der Verlust der anderen ist.
        </p>
        <Merksatz>Es entsteht nichts. Geld wechselt nur die Seite, und der Zufall entscheidet, welche.</Merksatz>
        <Bild text="Ein Topf, zwei Hände, und am Ende geht einer leer aus. Dabei ist nichts entstanden.">
          <IlluNullsumme />
        </Bild>
        <p>
          Das ist der Unterschied zu jedem erlaubten Geschäft. Wer eine Werkstatt betreibt, schafft etwas: eine
          reparierte Maschine, für die jemand zahlt. Wer Anteile an einer Firma hält, ist an dem beteiligt, was
          diese Firma herstellt. Beide Seiten können gewinnen. Beim Glücksspiel kann nur eine.
        </p>
        <Hinweis titel="Woran Gelehrte es festmachen">
          <p>
            Zwei Dinge müssen zusammenkommen: ein <B>Einsatz</B> und ein <B>Zufall</B>, der über den Ausgang
            entscheidet. Manche Rechtsschulen verlangen zusätzlich eine Wettkampfform. Was in allen
            Auffassungen den Ausschlag gibt, ist der dritte Punkt: Am Ende geht einer leer aus, und zwar genau
            um das, was der andere gewonnen hat.
          </p>
        </Hinweis>
        <p>
          Maysir und <L to="/wissen/gharar">Gharar</L> treten oft zusammen auf, sind aber nicht dasselbe.
          Gharar ist Unklarheit im Vertrag, Maysir ist der Wettcharakter. Glücksspiel gilt dabei als die
          schärfste Form der Unklarheit: Man weiß nicht einmal, ob man überhaupt etwas bekommt.
        </p>
      </>
    ),
  },
  {
    id: "faelle",
    titel: "Acht Fälle, eingeordnet",
    inhalt: (
      <>
        <p>Die Frage kommt selten bei Lotto. Sie kommt bei Dingen, die harmlos aussehen.</p>
        <Faelle
          faelle={[
            {
              titel: "Lotto, Sportwetten, Casino",
              ton: "rot",
              wort: "Maysir",
              text: "Der eindeutige Fall. Einsatz, Zufall, Gewinn auf Kosten der anderen. Darüber besteht Einigkeit.",
            },
            {
              titel: "Lootboxen und Gewinnkisten in Spielen",
              ton: "rot",
              wort: "Maysir",
              text: "Echtes Geld für einen zufälligen Inhalt. Dieselbe Bauweise wie ein Spielautomat, nur mit Grafik. Dass es sich um ein Spiel handelt, ändert nichts am Vertrag.",
            },
            {
              titel: "Forex und Daytrading",
              ton: "rot",
              wort: "Maysir",
              text: "Gehandelt wird auf Kursbewegungen, meist mit geliehenem Geld und über Nacht mit Zinsaufschlag. Wer dort einzahlt, betritt ein Casino mit Kurstafeln. Eine Strategie ändert daran nichts: Auch wer im Casino nach System spielt, spielt im Casino.",
            },
            {
              titel: "Optionen, Futures und CFDs",
              ton: "rot",
              wort: "Maysir",
              text: "Gewettet wird auf eine Kursbewegung, ohne dass jemand etwas besitzt oder herstellt. Nach verbreiteter Auffassung Maysir, dazu Gharar. Deshalb ist das Angebot an Hebelprodukten ein Kriterium bei der Brokerwahl.",
            },
            {
              titel: "Wetten auf fallende Kurse",
              ton: "rot",
              wort: "Maysir",
              text: "Dein Gewinn ist hier ausdrücklich der Schaden anderer: der Aktionäre, die die Papiere halten, und der Firma, deren Kurs gedrückt wird. Genau das Muster, das Maysir ausmacht.",
            },
            {
              titel: "Meme-Coins",
              ton: "rot",
              wort: "Maysir",
              text: "Ein Token ohne Projekt und ohne Nutzen. Der Preis hängt allein daran, ob nach dir noch jemand kauft. Das ist eine Wette auf die Nachfrage anderer.",
            },
            {
              titel: "Aktien kaufen",
              ton: "gruen",
              wort: "kein Maysir",
              text: "Du wirst Miteigentümer an einer Firma und trägst deren Risiko mit. Der Gewinn kommt aus dem Geschäft, nicht aus dem Verlust eines anderen. Vorausgesetzt, die Firma besteht die Prüfung.",
            },
            {
              titel: "Gewinnspiele ohne Einsatz",
              ton: "gruen",
              wort: "kein Maysir",
              text: "Wer nichts einsetzt, kann nichts verlieren. Ein Gewinnspiel, bei dem Teilnahme und Kauf getrennt sind, gilt verbreitet als unproblematisch. Sobald ein Kauf Bedingung ist, sieht es anders aus.",
            },
            {
              titel: "Versicherungen",
              ton: "gelb",
              wort: "kommt darauf an",
              text: "Du zahlst sicher, die Leistung kommt vielleicht nie, und der Ausgang hängt an einem Ereignis. Pflichtversicherungen werden milder beurteilt. Die Einzelheiten stehen im Beitrag zur Versicherung.",
            },
          ]}
        />
      </>
    ),
  },
  {
    id: "sucht",
    titel: "Der Punkt, der über den Vertrag hinausgeht",
    inhalt: (
      <>
        <p>
          Beim Glücksspiel wird nicht nur der Vertrag kritisiert, sondern auch das, was es mit Menschen macht.
          Das ist eine eigenständige Begründung und kein Nebensatz.
        </p>
        <p>
          Wer einmal gewonnen hat, will wieder spielen. Wer verloren hat, will es zurückholen. Genau daraus
          entsteht die Sucht, und sie zerstört zuverlässig das, was der Islam beim Geld schützen will: den
          Unterhalt der Familie, das Verhältnis zu Menschen, die Fähigkeit, für andere zu sorgen. Trading-Apps
          mit Kursalarm und Push-Nachricht sind darin näher an einem Spielautomaten als an einem Depot.
        </p>
        <Merksatz>
          Der Vertrag ist das eine. Dass es einen packt und nicht mehr loslässt, ist ein eigener Grund.
        </Merksatz>
      </>
    ),
  },
  {
    id: "spekulation",
    titel: "Wo Investieren zur Wette wird",
    inhalt: (
      <>
        <Frage>Ich kaufe nur ganz normale Aktien. Kann ich damit trotzdem in dieser Ecke landen?</Frage>
        <p>
          Ja, und deshalb ist das der schwierigste Teil. Dieselbe Aktie kann eine Beteiligung sein oder eine
          Wette. Der Unterschied steckt nicht im Papier, sondern in der Absicht und in der Haltedauer.
        </p>
        <p>
          Wer Anteile kauft, weil er an das Geschäft glaubt, und sie über Jahre hält, ist Miteigentümer. Wer
          dieselben Anteile morgens kauft und abends verkauft, weil er auf eine Bewegung setzt, tut
          wirtschaftlich etwas anderes, auch wenn der Vertrag gleich aussieht.
        </p>
        <p>
          Wichtig zur Einordnung: Der Aktienkauf bekommt dadurch nicht das Urteil des Glücksspiels. Es bleibt
          ein zulässiger Vertrag. Fragwürdig ist das Verhalten, nicht das Papier. Drei Fragen helfen bei der
          eigenen Einschätzung:
        </p>
        <Schritte
          schritte={[
            { titel: "Weißt du, was die Firma macht?", text: "Kannst du in einem Satz sagen, womit sie ihr Geld verdient? Wenn nicht, hast du kein Geschäft gekauft, sondern ein Kürzel." },
            { titel: "Würdest du die Anteile auch halten, wenn der Kurs ein Jahr stillsteht?", text: "Wer nur auf Bewegung wartet, verdient nicht am Geschäft, sondern an der Bewegung." },
            { titel: "Hättest du ein Problem damit, wenn morgen keine Kurse veröffentlicht würden?", text: "Ein Miteigentümer könnte damit leben. Ein Wettender nicht." },
          ]}
        />
        <p>Wer dreimal Nein sagt, hat wahrscheinlich keine Beteiligung gekauft, sondern eine Wette platziert.</p>
      </>
    ),
  },
];

const faq: BeitragFrage[] = [
  {
    frage: "Was bedeutet Maysir?",
    antwort:
      "Glücksspiel. Gemeint ist ein Geschäft, bei dem beide Seiten etwas einsetzen, der Ausgang vom Zufall abhängt und der Gewinn der einen Seite der Verlust der anderen ist. Es entsteht dabei nichts, Geld wechselt nur die Seite.",
  },
  {
    frage: "Ist Forex-Trading haram?",
    antwort:
      "Nach verbreiteter Auffassung ja. Gehandelt wird auf Kursbewegungen, meist mit geliehenem Geld, und für Positionen über Nacht fällt ein Zinsaufschlag an. Dass jemand nach einer Strategie vorgeht, ändert daran nichts: Auch wer im Casino nach System spielt, spielt im Casino.",
  },
  {
    frage: "Ist Aktienhandel Glücksspiel?",
    antwort:
      "Der Kauf von Anteilen an einer geprüften Firma ist kein Glücksspiel, weil du Miteigentümer wirst und am Geschäft beteiligt bist. Kurzfristige Spekulation nähert sich dem an, bekommt aber nicht dasselbe Urteil. Fragwürdig ist dann das Verhalten, nicht der Vertrag.",
  },
  {
    frage: "Sind Optionen und CFDs Maysir?",
    antwort:
      "Nach verbreiteter Auffassung ja. Gewettet wird auf eine Kursbewegung, ohne dass jemand die Sache besitzt. Meist kommt die Unklarheit im Vertrag dazu, und bei Hebelprodukten zusätzlich ein verzinstes Darlehen.",
  },
  {
    frage: "Warum ist eine Wette auf fallende Kurse besonders kritisch?",
    antwort:
      "Weil dein Gewinn dort ausdrücklich der Schaden anderer ist. Du verdienst daran, dass die Aktionäre, die die Papiere halten, verlieren. Das ist genau das Muster, das Glücksspiel ausmacht.",
  },
  {
    frage: "Sind Lootboxen in Spielen haram?",
    antwort:
      "Nach verbreiteter Auffassung fallen sie unter Maysir. Es wird echtes Geld für einen zufälligen Inhalt eingesetzt, das ist die Bauweise eines Glücksspiels. Dass es in einem Spiel stattfindet, ändert am Vertrag nichts.",
  },
  {
    frage: "Was ist der Unterschied zwischen Maysir und Gharar?",
    antwort:
      "Maysir ist der Wettcharakter, also Gewinn durch Zufall auf Kosten eines anderen. Gharar ist Unklarheit über Gegenstand, Preis oder Lieferung. Glücksspiel gilt als die schärfste Form der Unklarheit, deshalb kommt beides oft zusammen vor.",
  },
];

const beschreibung =
  "Maysir meint ein Geschäft, bei dem der Zufall entscheidet und der Gewinn des einen der Verlust des anderen ist. Neun Fälle eingeordnet, von Lotto über Forex bis Lootboxen, dazu die Grenze zwischen Investieren und Wetten.";

const Maysir = () => (
  <>
    <Seo
      title="Maysir: was als Glücksspiel gilt | finanzmuslim"
      description={beschreibung}
      path="/wissen/maysir"
      jsonLd={beitragJsonLd({
        titel: "Maysir: was als Glücksspiel gilt",
        beschreibung,
        path: "/wissen/maysir",
        datePublished: "16. August 2026",
        dateModified: "5. September 2026",
        faq,
      })}
    />
    <BeitragSeite
      slug="maysir"
      titel="Maysir: was als Glücksspiel gilt"
      untertitel="Die Frage ist immer dieselbe: Entsteht etwas, oder wechselt Geld nur die Seite?"
      kurzGesagt={[
        "Maysir ist ein Geschäft, bei dem der Zufall entscheidet und nichts entsteht.",
        "Der Gewinn der einen Seite ist genau der Verlust der anderen. Einer geht leer aus.",
        "Aktien sind kein Maysir. Forex, CFDs, Optionen und Meme-Coins nach verbreiteter Auffassung schon.",
        "Eine Strategie macht aus einem Casino kein Geschäft.",
        "Lootboxen haben dieselbe Bauweise wie ein Spielautomat.",
        "Neben dem Vertrag ist der Suchtcharakter ein eigener Kritikpunkt.",
      ]}
      abschnitte={abschnitte}
      faq={faq}
      datePublished="16. August 2026"
      dateModified="5. September 2026"
      boxMitteNach={1}
      rechtshinweis="Dieser Beitrag gibt bekannte Positionen wieder und dient ausschließlich zu Bildungszwecken. Er ist keine Fatwa und keine Anlageberatung. Zur Einordnung einzelner Fälle, besonders bei Versicherungen, Gewinnspielen und kurzfristigem Handel, bestehen zwischen den Rechtsschulen unterschiedliche Auffassungen."
      boxOben={{
        kategorie: "Vorlage",
        ueberschrift: "Zwölf Verträge, grün, gelb oder rot einsortiert",
        linkZiel: "/vorlagen/vertrags-ampel",
        text: "Grün, gelb oder rot für zwölf Verträge aus dem Alltag.",
        knopf: "Zur Vertrags-Ampel",
      }}
      boxMitte={{
        kategorie: "Depot",
        ueberschrift: "Ein Depot ohne Hebelprodukte und ohne Zinsgeschäft",
        linkZiel: "/vergleich/depot",
      }}
    >
      <PasstDazu
        punkte={[
          { to: "/wissen/gharar", name: "Gharar", text: "behandelt den Begriff, der fast immer zusammen mit Maysir fällt." },
          { to: "/wissen/ist-bitcoin-halal", name: "Ist Bitcoin halal?", text: "geht der Spekulationsfrage bei Krypto nach." },
          { to: "/wissen/sind-aktien-halal", name: "Sind Aktien halal?", text: "erklärt, warum eine Beteiligung etwas anderes ist als eine Wette." },
        ]}
      />
    </BeitragSeite>
  </>
);

export default Maysir;
