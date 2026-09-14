import { VergleichsSeite } from "@/components/vergleich/VergleichsSeite";
import { kryptoVergleich, KRYPTO_ZEILEN, KRYPTO_FILTER } from "@/data/kryptoVergleich";

const VergleichKrypto = () => (
  <VergleichsSeite
    pfad="/vergleich/krypto"
    brotkrumen="Krypto-Vergleich"
    titel="Krypto-Börsen für Muslime"
    untertitel="Finde die Börse, bei der du echte Coins zinsfrei kaufst"
    seoTitel="Krypto-Börsen-Vergleich für Muslime | finanzmuslim"
    seoText="Vergleiche Krypto-Börsen nach Halal-Merkmalen: ohne Zinsen nutzbar, echte Coins aus unserer Liste und Auszahlung auf die eigene Wallet."
    einheit="Börsen"
    einleitung={
      <>
        <p>
          Eine Krypto-Börse ist der Ort, an dem du Bitcoin und andere Coins kaufst. Viele bieten
          daneben Hebel, Futures und Zinsprodukte an.
        </p>
        <p>
          Das zählt hier nicht gegen eine Börse. Wir prüfen, ob du ab dem ersten Tag zinsfrei
          kaufst, ob es die Coins aus unserer Liste echt gibt und ob du sie auf deine eigene Wallet
          holen kannst.
        </p>
      </>
    }
    zeilen={KRYPTO_ZEILEN}
    anbieter={kryptoVergleich}
    filter={KRYPTO_FILTER}
    stand="14.09.2026"
    standHinweis="Konditionen eingetragen, Halal-Merkmale in Prüfung"
    quellenHinweis="Kosten und Konditionen: Finanzfluss-Vergleich (Daten: Biallo), Stand 14.09.2026. Halal-Merkmale: beim Anbieter nachgelesen, Beleg am Wert."
    kriterien={[
      {
        titel: "Ohne Zinsen nutzbar",
        text: "Bleiben Guthaben und Coins ohne Zins, Earn oder Lending, oder lässt sich das abschalten? Geht das nicht, gibt es keine Note.",
      },
      {
        titel: "Halal-Coins",
        text: "Wie viele Coins aus unserem Halal-Anlagen-Vergleich kannst du dort echt kaufen, nicht als ETN oder CFD?",
      },
      {
        titel: "Auszahlung auf eigene Wallet",
        text: "Kannst du deine Coins auf eine Wallet übertragen, die nur dir gehört?",
      },
    ]}
    faq={[
      {
        frage: "Ist Krypto halal?",
        antwort:
          "Darüber sind Gelehrte unterschiedlicher Auffassung. Viele halten Bitcoin und andere Coins mit echtem Nutzen für zulässig, solange keine Zinsen, kein Hebel und kein reines Glücksspiel im Spiel sind. Welche Coins wir als geprüft führen, steht im Halal-Anlagen-Vergleich. Eine verbindliche Antwort gibt dir ein Gelehrter deines Vertrauens.",
      },
      {
        frage: "Warum ist ein Hebelangebot kein Minuspunkt?",
        antwort:
          "Fast jede Börse bietet Hebel, Futures oder Staking an. Entscheidend ist, ob du sie nutzen musst. Wir prüfen deshalb nur, ob du ab Start ohne Zins echte Coins kaufen kannst.",
      },
      {
        frage: "Was heißt Auszahlung auf die eigene Wallet?",
        antwort:
          "Du überträgst deine Coins von der Börse auf eine Wallet, deren Schlüssel nur du hast. Damit gehört dir der Coin tatsächlich, und nicht nur ein Anspruch gegenüber der Börse.",
      },
      {
        frage: "Warum sind manche Merkmale noch nicht geprüft?",
        antwort:
          "Kosten und Konditionen stammen aus dem Finanzfluss-Vergleich und stehen mit Datum an jedem Wert. Die Halal-Merkmale lesen wir einzeln bei der Börse nach. Bis ein Beleg vorliegt, steht dort wörtlich, dass es noch nicht geprüft ist.",
      },
    ]}
    schluss="Diese Seite ist keine Anlageberatung und keine Empfehlung für eine bestimmte Börse. Kryptowährungen schwanken stark, ein Totalverlust ist möglich."
  />
);

export default VergleichKrypto;
