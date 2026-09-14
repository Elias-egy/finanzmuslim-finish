import { VergleichsSeite } from "@/components/vergleich/VergleichsSeite";
import { brokerVergleich, DEPOT_ZEILEN, DEPOT_FILTER } from "@/data/brokerVergleich";

const VergleichDepot = () => (
  <VergleichsSeite
    pfad="/vergleich/depot"
    brotkrumen="Depot-Vergleich"
    titel="Depot-Vergleich für Muslime"
    untertitel="Welcher Broker passt, wenn du islamkonform investieren willst"
    seoTitel="Depot-Vergleich für Muslime | finanzmuslim"
    seoText="Welcher Broker passt, wenn du islamkonform investieren willst. Wir prüfen Zinsen ab Start, Kredit und wie viele Halal-Anlagen du dort kaufen kannst."
    einheit="Anbieter"
    einleitung={
      <>
        <p>
          Ein Depot verwahrt deine Aktien und ETFs. Ohne Depot geht beim Vermögensaufbau nichts.
        </p>
        <p>
          Für Muslime entscheiden Punkte, die in normalen Vergleichen fehlen: Liegt dein Geld ab
          Start ohne Zins, wird kein Kredit eingeräumt, und wie viele unserer Halal-Anlagen kannst
          du dort kaufen? Was ein Broker sonst noch anbietet, zählt nicht gegen ihn.
        </p>
      </>
    }
    zeilen={DEPOT_ZEILEN}
    anbieter={brokerVergleich}
    filter={DEPOT_FILTER}
    stand="14.09.2026"
    standHinweis="Anbieterliste steht, Merkmale laufend in Prüfung"
    empfehlungEtikett="Bestes Depot"
    empfehlungText="Hier steht eine Empfehlung, sobald die Halal-Merkmale bei den Anbietern geprüft sind. Vorher wäre jede Nummer eins geraten."
    kriterien={[
      {
        titel: "Zinsfrei ab Start",
        text: "Liegt dein Guthaben nach der Eröffnung ohne Zins, ohne dass du etwas abwählen musst?",
      },
      {
        titel: "Halal-Anlagen",
        text: "Wie viele Anlagen aus unserem Halal-Anlagen-Vergleich kannst du dort kaufen?",
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
          "Entscheidend ist, ob du das Depot ab Start halal nutzen kannst, ohne etwas abwählen zu müssen: kein Zins auf dem Guthaben und kein eingeräumter Kredit. Dazu zählt, wie viele Halal-Anlagen du dort kaufen kannst. Dass ein Broker auch Hebelprodukte anbietet, ist kein Minuspunkt, solange du sie nicht nutzen musst.",
      },
      {
        frage: "Was mache ich mit Zinsen, die trotzdem anfallen?",
        antwort:
          "Nach verbreiteter Auffassung werden Zinserträge nicht behalten, sondern gespendet, ohne dafür eine Belohnung zu erwarten. Wichtig ist, die Beträge sauber getrennt zu erfassen. Die konkrete Handhabung besprichst du am besten mit einem Gelehrten deines Vertrauens.",
      },
      {
        frage: "Warum steht bei fast allen Anbietern noch nichts?",
        antwort:
          "Weil wir nichts eintragen, was wir nicht selbst beim Anbieter nachgelesen haben. Die Anbieterliste steht, jedes Merkmal wird einzeln geprüft und mit Datum eingetragen. Bis dahin steht dort wörtlich, dass es noch nicht geprüft ist.",
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
