import { VergleichsSeite } from "@/components/vergleich/VergleichsSeite";
import { brokerVergleich, DEPOT_ZEILEN, DEPOT_FILTER } from "@/data/brokerVergleich";

const VergleichDepot = () => (
  <VergleichsSeite
    pfad="/vergleich/depot"
    brotkrumen="Depot-Vergleich"
    titel="Depot-Vergleich für Muslime"
    untertitel="Welcher Broker passt, wenn du islamkonform investieren willst"
    seoTitel="Depot-Vergleich für Muslime | finanzmuslim"
    seoText="Welcher Broker passt, wenn du islamkonform investieren willst. Wir prüfen, ob du ohne Zinsen auskommst, ob ein Kredit mitläuft und welche Halal-ETFs, Sukuk und Edelmetalle es gibt."
    einheit="Anbieter"
    einleitung={
      <>
        <p>
          Ein Depot verwahrt deine Aktien und ETFs. Ohne Depot geht beim Vermögensaufbau nichts.
        </p>
        <p>
          Für Muslime entscheiden Punkte, die in normalen Vergleichen fehlen: Kommst du ohne Zinsen
          aus, läuft kein Kredit mit, und welche Halal-ETFs, Sukuk und Edelmetalle kannst du dort
          kaufen? Was ein Broker sonst noch anbietet, zählt nicht gegen ihn.
        </p>
      </>
    }
    zeilen={DEPOT_ZEILEN}
    anbieter={brokerVergleich}
    filter={DEPOT_FILTER}
    stand="14.09.2026"
    standHinweis="Konditionen eingetragen, Halal-Merkmale in Prüfung"
    quellenHinweis="Kosten und Konditionen: Finanzfluss-Vergleich (Daten: Biallo), Stand 14.09.2026. Halal-Merkmale: beim Anbieter nachgelesen, Beleg am Wert."
    kriterien={[
      {
        titel: "Ohne Zinsen nutzbar",
        text: "Liegt dein Guthaben ohne Zins, oder lassen sich die Zinsen abschalten? Geht beides nicht, gibt es keine Note.",
      },
      {
        titel: "Halal-Anlagen",
        text: "Wie viele Halal-ETFs und Fonds, Sukuk und Edelmetalle aus unserem Halal-Anlagen-Vergleich kannst du dort kaufen?",
      },
      {
        titel: "Kein Kredit ab Start",
        text: "Wird dir nach der Eröffnung kein Wertpapierkredit eingeräumt?",
      },
    ]}
    faq={[
      {
        frage: "Was ist ein Depot?",
        antwort:
          "Ein Depot ist ein Konto für Wertpapiere. Aktien, ETFs oder Anleihen, die du kaufst, werden dort für dich verwahrt. Zum Depot gehört meist ein Verrechnungskonto, über das Käufe und Verkäufe abgewickelt werden.",
      },
      {
        frage: "Woran erkenne ich, ob ein Broker für Muslime geeignet ist?",
        antwort:
          "Entscheidend ist, ob du das Depot ohne Zinsen nutzen kannst, also ohne Zins auf dem Guthaben oder mit abschaltbarem Zins, und ob kein Kredit eingeräumt wird. Dazu zählt, wie viele Halal-Anlagen du dort kaufen kannst. Dass ein Broker auch Hebelprodukte anbietet, ist kein Minuspunkt, solange du sie nicht nutzen musst.",
      },
      {
        frage: "Was mache ich mit Zinsen, die trotzdem anfallen?",
        antwort:
          "Nach verbreiteter Auffassung werden Zinserträge nicht behalten, sondern gespendet, ohne dafür eine Belohnung zu erwarten. Wichtig ist, die Beträge sauber getrennt zu erfassen. Die konkrete Handhabung besprichst du am besten mit einem Gelehrten deines Vertrauens.",
      },
      {
        frage: "Warum sind manche Merkmale noch nicht geprüft?",
        antwort:
          "Kosten und Konditionen stammen aus dem Finanzfluss-Vergleich und stehen mit Datum an jedem Wert. Die Halal-Merkmale lesen wir einzeln beim Anbieter nach. Bis ein Beleg vorliegt, steht dort wörtlich, dass es noch nicht geprüft ist.",
      },
      {
        frage: "Kann ich mehrere Depots haben?",
        antwort:
          "Ja. Du kannst bei mehreren Anbietern gleichzeitig ein Depot führen, etwa um Sparpläne und Einzelkäufe zu trennen. Ein Depotwechsel oder Übertrag ist ebenfalls möglich, die Wertpapiere bleiben dabei deine.",
      },
    ]}
    schluss="Diese Seite ist keine Anlageberatung und keine Anlageempfehlung. Investitionen in Wertpapiere sind mit Risiken verbunden, bis hin zum Totalverlust."
  />
);

export default VergleichDepot;
