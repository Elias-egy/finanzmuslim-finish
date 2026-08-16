import Seo, { beitragJsonLd } from "@/components/Seo";
import BeitragSeite, { type BeitragAbschnitt } from "@/components/BeitragSeite";
import { IlluPruefung } from "@/components/illu";
import { Link } from "react-router-dom";

const Bild = ({ children, text }: { children: React.ReactNode; text: string }) => (
  <figure className="my-6">
    <div className="overflow-hidden rounded-2xl">{children}</div>
    <figcaption className="mt-2 text-[14px] text-muted-foreground">{text}</figcaption>
  </figure>
);

/** Ein Fall mit Einordnung. Grün, Gelb und Rot sind hier eine Bewertung,
 *  deshalb ist die Farbe erlaubt. */
const Fall = ({
  titel,
  farbe,
  text,
}: {
  titel: string;
  farbe: "gruen" | "gelb" | "rot";
  text: React.ReactNode;
}) => {
  const punkt = { gruen: "bg-success", gelb: "bg-warning", rot: "bg-destructive" }[farbe];
  const wort = { gruen: "Kein Maysir", gelb: "Kommt darauf an", rot: "Maysir" }[farbe];
  return (
    <div className="card-surface p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[17px] font-bold text-foreground">{titel}</p>
        <span className="flex items-center gap-2 text-[13px] font-semibold text-muted-foreground">
          <span className={`h-2.5 w-2.5 rounded-full ${punkt}`} aria-hidden />
          {wort}
        </span>
      </div>
      <p className="mt-2 text-[16px] text-muted-foreground">{text}</p>
    </div>
  );
};

const abschnitte: BeitragAbschnitt[] = [
  {
    id: "was-ist-maysir",
    titel: "Maysir ist das Nullsummenspiel",
    inhalt: (
      <>
        <p>
          Maysir heißt Glücksspiel. Gemeint ist ein Geschäft, bei dem beide Seiten etwas einsetzen,
          der Ausgang vom Zufall abhängt und der Gewinn der einen Seite genau der Verlust der
          anderen ist.
        </p>
        <p className="rounded-xl bg-hero p-5 text-[19px] font-bold text-foreground">
          Es entsteht nichts. Geld wechselt nur die Seite, und der Zufall entscheidet, welche.
        </p>
        <p>
          Das ist der Unterschied zu jedem erlaubten Geschäft. Wer eine Werkstatt betreibt, schafft
          etwas: eine reparierte Maschine, für die jemand zahlt. Wer Anteile an einer Firma hält,
          ist an dem beteiligt, was diese Firma herstellt. Beide Seiten können gewinnen. Beim
          Glücksspiel kann nur eine.
        </p>
        <p>
          Maysir und{" "}
          <Link to="/wissen/gharar" className="text-primary hover:underline">
            Gharar
          </Link>{" "}
          treten oft zusammen auf, sind aber nicht dasselbe. Gharar ist Unklarheit im Vertrag,
          Maysir ist der Wettcharakter. Ein Vertrag kann klar formuliert und trotzdem eine Wette
          sein.
        </p>
      </>
    ),
  },
  {
    id: "faelle",
    titel: "Sechs Fälle, eingeordnet",
    inhalt: (
      <>
        <p>Die Frage kommt selten bei Lotto. Sie kommt bei Dingen, die harmlos aussehen.</p>
        <div className="my-6 space-y-4">
          <Fall
            titel="Lotto, Sportwetten, Casino"
            farbe="rot"
            text="Der eindeutige Fall. Einsatz, Zufall, Gewinn auf Kosten der anderen. Darüber besteht Einigkeit."
          />
          <Fall
            titel="Lootboxen und Gewinnkisten in Spielen"
            farbe="rot"
            text="Echtes Geld für einen zufälligen Inhalt. Dieselbe Bauweise wie ein Spielautomat, nur mit Grafik. Dass es sich um ein Spiel handelt, ändert nichts am Vertrag."
          />
          <Fall
            titel="Optionen, Futures und CFDs"
            farbe="rot"
            text="Gewettet wird auf eine Kursbewegung, ohne dass jemand etwas besitzt oder herstellt. Nach verbreiteter Auffassung Maysir, dazu Gharar. Deshalb ist das Angebot an Hebelprodukten ein Kriterium bei der Brokerwahl."
          />
          <Fall
            titel="Aktien kaufen"
            farbe="gruen"
            text="Du wirst Miteigentümer an einer Firma und trägst deren Risiko mit. Der Gewinn kommt aus dem Geschäft, nicht aus dem Verlust eines anderen. Vorausgesetzt, die Firma besteht die Prüfung."
          />
          <Fall
            titel="Gewinnspiele ohne Einsatz"
            farbe="gruen"
            text="Wer nichts einsetzt, kann nichts verlieren. Ein Gewinnspiel, bei dem Teilnahme und Kauf getrennt sind, gilt verbreitet als unproblematisch. Sobald ein Kauf Bedingung ist, sieht es anders aus."
          />
          <Fall
            titel="Versicherungen"
            farbe="gelb"
            text={
              <>
                Der meistdiskutierte Fall. Du zahlst sicher, die Leistung kommt vielleicht nie, und
                der Ausgang hängt an einem Ereignis. Pflichtversicherungen werden meist milder
                beurteilt. Die Einzelheiten stehen in{" "}
                <Link to="/wissen/ist-versicherung-haram" className="text-primary hover:underline">
                  Ist eine Versicherung haram?
                </Link>
              </>
            }
          />
        </div>
        <Bild text="Die Frage ist immer dieselbe: Entsteht etwas, oder wechselt Geld nur die Seite?">
          <IlluPruefung />
        </Bild>
      </>
    ),
  },
  {
    id: "spekulation",
    titel: "Wo Investieren zur Wette wird",
    inhalt: (
      <>
        <p>
          Der schwierige Bereich liegt nicht bei Lotto, sondern beim eigenen Verhalten. Dieselbe
          Aktie kann eine Beteiligung sein oder eine Wette. Der Unterschied steckt nicht im Papier,
          sondern in der Absicht und in der Haltedauer.
        </p>
        <p>
          Wer Anteile kauft, weil er an das Geschäft glaubt, und sie über Jahre hält, ist
          Miteigentümer. Wer dieselben Anteile morgens kauft und abends verkauft, weil er auf eine
          Bewegung setzt, tut wirtschaftlich etwas anderes, auch wenn der Vertrag gleich aussieht.
        </p>
        <p>
          Eine feste Grenze gibt es nicht, und niemand kann sie dir vorrechnen. Drei Fragen helfen
          bei der eigenen Einschätzung: Weißt du, was die Firma macht? Würdest du die Anteile auch
          halten, wenn der Kurs ein Jahr lang stillsteht? Hättest du ein Problem damit, wenn morgen
          keine Kurse veröffentlicht würden?
        </p>
        <p>
          Wer dreimal Nein sagt, hat wahrscheinlich keine Beteiligung gekauft, sondern eine Wette
          platziert.
        </p>
      </>
    ),
  },
];

const faq = [
  {
    frage: "Was bedeutet Maysir?",
    antwort:
      "Glücksspiel. Gemeint ist ein Geschäft, bei dem beide Seiten etwas einsetzen, der Ausgang vom Zufall abhängt und der Gewinn der einen Seite der Verlust der anderen ist. Es entsteht dabei nichts, Geld wechselt nur die Seite.",
  },
  {
    frage: "Ist Aktienhandel Glücksspiel?",
    antwort:
      "Der Kauf von Anteilen an einer geprüften Firma ist kein Glücksspiel, weil du Miteigentümer wirst und am Geschäft beteiligt bist. Kurzfristige Spekulation auf Kursbewegungen nähert sich dem Glücksspiel an, auch wenn der Vertrag derselbe ist.",
  },
  {
    frage: "Sind Optionen und CFDs Maysir?",
    antwort:
      "Nach verbreiteter Auffassung ja. Gewettet wird auf eine Kursbewegung, ohne dass jemand die Sache besitzt. Meist kommt Gharar dazu, also die Unklarheit im Vertrag.",
  },
  {
    frage: "Sind Lootboxen in Spielen haram?",
    antwort:
      "Nach verbreiteter Auffassung fallen sie unter Maysir. Es wird echtes Geld für einen zufälligen Inhalt eingesetzt, das ist die Bauweise eines Glücksspiels. Dass es in einem Spiel stattfindet, ändert am Vertrag nichts.",
  },
  {
    frage: "Was ist der Unterschied zwischen Maysir und Gharar?",
    antwort:
      "Maysir ist der Wettcharakter, also Gewinn durch Zufall auf Kosten eines anderen. Gharar ist Unklarheit über Gegenstand, Preis oder Lieferung. Beides kommt oft zusammen vor, aber ein Vertrag kann klar formuliert und trotzdem eine Wette sein.",
  },
];

const Maysir = () => (
  <>
    <Seo
      title="Maysir: was als Glücksspiel gilt | finanzmuslim"
      description="Maysir meint ein Geschäft, bei dem der Zufall entscheidet und der Gewinn des einen der Verlust des anderen ist. Sechs Fälle eingeordnet, dazu die Grenze zwischen Investieren und Wetten."
      path="/wissen/maysir"
      jsonLd={beitragJsonLd({
        titel: "Lotto, Sportwetten, Casino",
        beschreibung: "Maysir meint ein Geschäft, bei dem der Zufall entscheidet und der Gewinn des einen der Verlust des anderen ist. Sechs Fälle eingeordnet, dazu die Grenze zwischen Investieren und Wetten.",
        path: "/wissen/maysir",
        geprueftAm: "16. August 2026",
        faq,
      })}
    />
    <BeitragSeite
      titel="Maysir: was als Glücksspiel gilt"
      kurzGesagt={[
        "Maysir ist ein Geschäft, bei dem der Zufall entscheidet und nichts entsteht.",
        "Der Gewinn der einen Seite ist genau der Verlust der anderen.",
        "Aktien sind kein Maysir, Optionen und CFDs nach verbreiteter Auffassung schon.",
        "Lootboxen haben dieselbe Bauweise wie ein Spielautomat.",
        "Die Grenze zur Wette liegt nicht im Papier, sondern im eigenen Verhalten.",
      ]}
      abschnitte={abschnitte}
      faq={faq}
      geprueftAm="16. August 2026"
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
      <section className="card-surface p-6">
        <h2 className="text-[19px] font-bold text-foreground">Passt dazu</h2>
        <ul className="mt-3 space-y-2 text-[16px]">
          <li>
            <Link to="/wissen/gharar" className="text-primary hover:underline">
              Gharar
            </Link>{" "}
            behandelt den Begriff, der fast immer zusammen mit Maysir fällt.
          </li>
          <li>
            <Link to="/wissen/ist-bitcoin-halal" className="text-primary hover:underline">
              Ist Bitcoin halal?
            </Link>{" "}
            geht der Spekulationsfrage bei Krypto nach.
          </li>
          <li>
            <Link to="/wissen/sind-aktien-halal" className="text-primary hover:underline">
              Sind Aktien halal?
            </Link>{" "}
            erklärt, warum eine Beteiligung etwas anderes ist als eine Wette.
          </li>
        </ul>
      </section>
    </BeitragSeite>
  </>
);

export default Maysir;
