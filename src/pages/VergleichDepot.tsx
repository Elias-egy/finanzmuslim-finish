import { VergleichsSeite } from "@/components/vergleich/VergleichsSeite";
import { brokerVergleich, DEPOT_ZEILEN, DEPOT_FILTER } from "@/data/brokerVergleich";

const VergleichDepot = () => (
  <VergleichsSeite
    pfad="/vergleich/depot"
    brotkrumen="Depot-Vergleich"
    titel="Depot-Vergleich für Muslime"
    untertitel="Welcher Broker passt, wenn du islamkonform investieren willst"
    seoTitel="Depot-Vergleich für Muslime | finanzmuslim"
    seoText="Welcher Broker passt, wenn du islamkonform investieren willst. Wir prüfen Verrechnungskonto, Kredit, Hebelprodukte und sharia-konforme ETFs."
    einheit="Anbieter"
    einleitung={
      <>
        <p>
          Ein Depot verwahrt deine Aktien und ETFs. Ohne Depot geht beim Vermögensaufbau nichts.
        </p>
        <p>
          Für Muslime entscheiden Punkte, die in normalen Vergleichen fehlen: Zinsen auf dem
          Verrechnungskonto, eingeräumte Kredite und Hebelprodukte. Dazu die Frage, wie viele der
          geprüften Anlagen dort überhaupt handelbar und besparbar sind.
        </p>
      </>
    }
    zeilen={DEPOT_ZEILEN}
    anbieter={brokerVergleich}
    filter={DEPOT_FILTER}
    stand="17.08.2026"
    standHinweis="Anbieterliste steht, Merkmale laufend in Prüfung"
    empfehlungEtikett="Bestes Depot"
    empfehlungText="Hier steht eine Empfehlung, sobald die Halal-Merkmale bei den Anbietern geprüft sind. Vorher wäre jede Nummer eins geraten."
    kriterien={[
      {
        titel: "Geprüfte Anlagen handelbar",
        text: "Wie viele der 27 Anlagen aus unserer Liste lassen sich dort kaufen, und wie viele davon als Sparplan?",
      },
      {
        titel: "Zinsen auf dem Verrechnungskonto",
        text: "Zahlt das Verrechnungskonto Zinsen, und lässt sich das abschalten?",
      },
      {
        titel: "Wertpapierkredit und Dispo",
        text: "Wird ein Wertpapierkredit oder Dispo automatisch eingeräumt?",
      },
      {
        titel: "Hebelprodukte und CFDs",
        text: "Bietet der Broker Hebelprodukte und CFDs an, und wie sichtbar sind sie?",
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
          "Entscheidend ist, ob auf dem Verrechnungskonto Zinsen anfallen und ob sich das abschalten lässt, ob automatisch ein Wertpapierkredit oder Dispo eingeräumt wird, ob der Broker dich zu Hebelprodukten und CFDs drängt und ob du sharia-konforme ETFs kaufen und besparen kannst.",
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
