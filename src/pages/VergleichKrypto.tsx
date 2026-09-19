import { Link } from "react-router-dom";
import { VergleichsSeite } from "@/components/vergleich/VergleichsSeite";
import { kryptoVergleich, KRYPTO_ZEILEN, KRYPTO_FILTER, KRYPTO_FINANZ_MAX } from "@/data/kryptoVergleich";

/**
 * Krypto-Vergleich.
 *
 * Bis zum 16.09.2026 stand hier eine Zeile "Halal-Coins: 4 von 4". Sie ist raus,
 * und zwar aus einem inhaltlichen Grund (Elias): Fast jede Börse führt Bitcoin,
 * Ether, XRP und Chainlink, die Zahl trennt also nichts. Und sie erweckt den
 * Eindruck, es gäbe genau vier zulässige Münzen, was nicht stimmt. Die richtige
 * Frage ist nicht, wie viele Münzen einer Liste ein Anbieter führt, sondern ob
 * du dort echte Coins bekommst, ob du sie herausbekommst und ob du das Konto
 * ohne Zins nutzen kannst. Welche Arten von Krypto ausfallen, ist eine Frage an
 * die Münze, nicht an die Börse; sie steht unter der Tabelle und ausführlich im
 * Beitrag "Ist Bitcoin halal?".
 */

const ArtenBlock = () => (
  <section className="mt-14 max-w-3xl">
    <h2 className="text-2xl font-bold text-foreground">Welche Arten von Krypto ausfallen</h2>
    <p className="mt-3 text-[17px] leading-[26px] text-foreground/90">
      Die Frage ist nicht, wie viele Münzen einer Liste eine Börse führt. Fast alle führen dieselben
      großen Münzen. Die Frage ist, was du dort kaufst. Ausgeschlossen ist nicht eine bestimmte
      Anzahl, sondern eine Art.
    </p>
    <ul className="mt-6 space-y-5">
      {[
        {
          titel: "Token, die einen verbotenen Zweck finanzieren",
          text: "Gehört der Token zu einer Zins-, Wett- oder Glücksspielplattform, ändert die Technik daran nichts. Du finanzierst das Geschäft, das dahintersteht.",
        },
        {
          titel: "Token, deren Ertrag ein Zinsversprechen ist",
          text: "Wenn dir jemand zusagt, aus hundert Einheiten würden in einem Jahr hundertfünf, ist das ein Zins. Lending, feste Erträge und garantiertes Staking fallen darunter, egal wie sie heißen.",
        },
        {
          titel: "Münzen ohne Zweck",
          text: "Ein Token ohne Projekt und ohne Nutzen. Der Preis hängt allein daran, ob nach dir noch jemand kauft. Darüber sind sich Gelehrte weitgehend einig.",
        },
        {
          titel: "Hebel, Futures und CFDs auf Krypto",
          text: "Wer mit geliehenem Geld auf eine Kursrichtung wettet, hat die Diskussion über die Münze längst verlassen. Das ist ein verzinstes Darlehen und eine Wette in einem.",
        },
        {
          titel: "Zertifikate auf den Kurs statt echter Coins",
          text: "ETP, ETN und Zertifikate bilden den Preis nach. Der Coin gehört dir nie, du hast eine Forderung gegen den Herausgeber. In der Tabelle steht das in der Zeile „Echte Coins statt Zertifikat“.",
        },
      ].map((punkt) => (
        <li key={punkt.titel}>
          <p className="text-[16px] font-semibold text-foreground">{punkt.titel}</p>
          <p className="mt-1 text-[15px] leading-[24px] text-muted-foreground">{punkt.text}</p>
        </li>
      ))}
    </ul>
    <p className="mt-6 text-[15px] leading-[24px] text-muted-foreground">
      Umgekehrt heißt das: Eine Münze mit einem echten Nutzen, ohne festen Ertrag und ohne
      verbotenes Geschäft dahinter ist nicht deshalb ausgeschlossen, weil sie bei uns noch nicht
      steht. Wir führen in der{" "}
      <Link to="/halal-anlagen" className="font-semibold text-primary hover:underline">
        Anlagen-Datenbank
      </Link>{" "}
      nur Münzen, zu denen ein Gutachten einer Prüfstelle vorliegt, das wir selbst gelesen haben.
      Das ist eine Aussage über unseren Prüfstand, keine Liste aller zulässigen Münzen. Die
      Begründungen im Einzelnen stehen in{" "}
      <Link to="/wissen/ist-bitcoin-halal" className="font-semibold text-primary hover:underline">
        Ist Bitcoin halal?
      </Link>
      .
    </p>
  </section>
);

const VergleichKrypto = () => (
  <VergleichsSeite
    pfad="/vergleich/krypto"
    brotkrumen="Krypto-Vergleich"
    titel="Krypto-Börsen für Muslime"
    untertitel="Finde die Börse, bei der du echte Coins zinsfrei kaufst"
    seoTitel="Halal Krypto kaufen: Krypto-Börsen im Vergleich | finanzmuslim"
    seoText="Welche Krypto-Börse lässt sich ohne Zinsen nutzen? 27 Anbieter im Vergleich: echte Coins statt Zertifikat, Auszahlung auf die eigene Wallet, Kosten und Bezahlmodell."
    einheit="Börsen"
    einleitung={
      <>
        <p>
          Eine Krypto-Börse ist der Ort, an dem du Bitcoin und andere Coins kaufst. Viele bieten
          daneben Hebel, Futures und Zinsprodukte an.
        </p>
        <p>
          Das zählt hier nicht gegen eine Börse. Wir prüfen, ob du ab dem ersten Tag zinsfrei
          kaufst, ob du echte Coins bekommst statt eines Zertifikats auf den Kurs und ob du sie auf
          deine eigene Wallet holen kannst. Dazu kommt seit September eine vierte Frage: Hängt das
          kostenpflichtige Modell des Anbieters am Zins?
        </p>
      </>
    }
    zeilen={KRYPTO_ZEILEN}
    anbieter={kryptoVergleich}
    kategorie="krypto"
    finanzMax={KRYPTO_FINANZ_MAX}
    filter={KRYPTO_FILTER}
    stand="16.09.2026"
    standHinweis="Halal-Merkmale geprüft, Konditionen vom 14.09.2026"
    quellenHinweis="Kosten und Konditionen: Finanzfluss-Vergleich (Daten: Biallo), Stand 14.09.2026. Halal-Merkmale: beim Anbieter geprüft, Stand 16.09.2026."
    kriterien={[
      {
        titel: "Ohne Zinsen nutzbar",
        text: "Bleiben Guthaben und Coins ohne Zins, Earn oder Lending, oder lässt sich das abschalten? Geht das nicht, gibt es keine Note.",
      },
      {
        titel: "Echte Coins statt Zertifikat",
        text: "Kaufst du die Münze selbst, oder nur ein Wertpapier auf ihren Kurs? Bei einem ETP oder Zertifikat gehört dir nie ein Coin, sondern eine Forderung gegen den Herausgeber.",
      },
      {
        titel: "Auszahlung auf eigene Wallet",
        text: "Kannst du deine Coins auf eine Wallet übertragen, die nur dir gehört?",
      },
      {
        titel: "Bezahlmodell ohne Zinsbindung",
        text: "Verlangt die kostenpflichtige Stufe gebundene Token, oder rechnet sie sich über Zinsen auf dein Guthaben? Solche Modelle empfehlen wir nicht, auch dann nicht, wenn das Grundkonto sauber ist.",
      },
    ]}
    zusatz={<ArtenBlock />}
    faq={[
      {
        frage: "Ist Krypto halal?",
        antwort:
          "Darüber sind Gelehrte unterschiedlicher Auffassung. Viele halten Münzen mit echtem Nutzen für zulässig, solange keine Zinsen, kein Hebel und kein Glücksspiel im Spiel sind. Ausgeschlossen sind Token mit verbotenem Zweck, Token mit festem Ertragsversprechen und Münzen ohne jeden Nutzen. Eine verbindliche Antwort gibt dir ein Gelehrter deines Vertrauens.",
      },
      {
        frage: "Warum steht hier nicht mehr, wie viele Halal-Coins eine Börse hat?",
        antwort:
          "Weil die Zahl nichts getrennt hat. Fast jede Börse führt Bitcoin, Ether, XRP und Chainlink, und es gibt weit mehr Münzen, die nach denselben Maßstäben zulässig wären. Eine Zahl wie vier von vier hätte den Eindruck erweckt, es gäbe genau vier erlaubte Münzen. Wir prüfen stattdessen, ob du dort echte Coins bekommst.",
      },
      {
        frage: "Warum ist ein Hebelangebot kein Minuspunkt?",
        antwort:
          "Fast jede Börse bietet Hebel, Futures oder Staking an. Entscheidend ist, ob du sie nutzen musst. Wir prüfen deshalb nur, ob du ab Start ohne Zins echte Coins kaufen kannst.",
      },
      {
        frage: "Was heißt Auszahlung auf die eigene Wallet?",
        antwort:
          "Du überträgst deine Coins von der Börse auf eine Wallet, deren Schlüssel nur du hast. Damit gehört dir der Coin tatsächlich, und nicht nur ein Anspruch gegenüber der Börse. Fünf Anbieter im Vergleich lassen das nicht zu, sie halten die Coins für dich in Verwahrung.",
      },
      {
        frage: "Warum stehen manche Anbieter ganz unten und rot?",
        antwort:
          "Weil ihr kostenpflichtiges Modell am Zins hängt: Es verlangt gebundene Token oder es rechnet sich über die Verzinsung deines Guthabens. Solche Anbieter bekommen von uns keinen Link, auch wenn wir daran verdienen könnten. Kaufen kannst du dort trotzdem zinsfrei, deshalb stehen sie überhaupt noch in der Liste.",
      },
      {
        frage: "Was ist mit Krypto-ETPs, etwa bei Scalable Capital?",
        antwort:
          "Ein ETP bildet den Kurs ab, du kaufst ein Wertpapier und keinen Coin. Wer den Coin selbst besitzen will, findet dort nicht, was er sucht. Das steht in der Zeile „Echte Coins statt Zertifikat“ und ist unabhängig davon, wie gut der Anbieter sonst ist.",
      },
    ]}
    schluss="Diese Seite ist keine Anlageberatung und keine Empfehlung für eine bestimmte Börse. Kryptowährungen schwanken stark, ein Totalverlust ist möglich."
  />
);

export default VergleichKrypto;
