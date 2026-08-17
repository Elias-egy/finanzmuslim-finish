import { VergleichsSeite } from "@/components/vergleich/VergleichsSeite";
import { girokontoVergleich, GIRO_ZEILEN, GIRO_FILTER } from "@/data/girokontoVergleich";

const VergleichGirokonto = () => (
  <VergleichsSeite
    pfad="/vergleich/girokonto"
    brotkrumen="Girokonto-Vergleich"
    titel="Girokonto-Vergleich für Muslime"
    untertitel="Welches Konto passt, wenn du keine Zinsen willst"
    seoTitel="Girokonto-Vergleich für Muslime | finanzmuslim"
    seoText="Welches Girokonto passt, wenn du keine Zinsen willst. Wir prüfen Guthabenzins, Dispo, Karte ohne Kreditrahmen und Zinsprodukte im Konto."
    einheit="Banken"
    einleitung={
      <>
        <p>
          Ein Girokonto ist das Konto, über das dein Gehalt kommt und deine Miete geht. Fast jeder
          hat eins, kaum jemand prüft es.
        </p>
        <p>
          Für Muslime entscheiden Punkte, die in normalen Vergleichen fehlen: Zinsen auf dem
          Guthaben, der eingeräumte Dispo und ein Kreditrahmen an der Karte. Dazu die Frage, ob ein
          Zinsprodukt fest am Konto hängt.
        </p>
      </>
    }
    zeilen={GIRO_ZEILEN}
    anbieter={girokontoVergleich}
    filter={GIRO_FILTER}
    stand="17.08.2026"
    standHinweis="Anbieterliste angelegt, Merkmale noch nicht geprüft"
    empfehlungEtikett="Bestes Girokonto"
    empfehlungText="Hier steht eine Empfehlung, sobald die Halal-Merkmale bei den Banken geprüft sind. Vorher wäre jede Nummer eins geraten."
    kriterien={[
      {
        titel: "Zinsen auf dem Guthaben",
        text: "Zahlt die Bank Zinsen auf das Guthaben, und lässt sich das abschalten?",
      },
      {
        titel: "Dispokredit",
        text: "Wird ein Dispo automatisch eingeräumt, oder nur auf Antrag?",
      },
      {
        titel: "Karte ohne Kreditrahmen",
        text: "Ist die Karte eine echte Debitkarte, oder hängt ein Kreditrahmen daran?",
      },
      {
        titel: "Zinsprodukte im Konto",
        text: "Ist ein Tagesgeld oder Sparbereich mit Zins fest mit dem Konto verbunden?",
      },
    ]}
    faq={[
      {
        frage: "Was ist an einem normalen Girokonto problematisch?",
        antwort:
          "Zwei Dinge. Erstens zahlen manche Banken Zinsen auf das Guthaben, und Zinsen sind Riba. Zweitens räumen viele Banken beim Öffnen des Kontos automatisch einen Dispokredit ein, der ebenfalls verzinst ist. Beides lässt sich bei vielen Banken abschalten oder auf null setzen, es steht nur selten im Vergleich.",
      },
      {
        frage: "Reicht es, den Dispo nicht zu nutzen?",
        antwort:
          "Darüber sind Gelehrte unterschiedlicher Auffassung. Die vorsichtige Linie ist, den Dispo auf null setzen zu lassen, damit gar kein Zinsvertrag besteht. Wer dazu eine verbindliche Antwort braucht, fragt einen Gelehrten seines Vertrauens.",
      },
      {
        frage: "Was mache ich mit Zinsen, die trotzdem anfallen?",
        antwort:
          "Nach verbreiteter Auffassung werden Zinserträge nicht behalten, sondern gespendet, ohne dafür eine Belohnung zu erwarten. Wichtig ist, die Beträge sauber getrennt zu erfassen.",
      },
      {
        frage: "Warum steht bei allen Banken noch nichts?",
        antwort:
          "Weil wir nichts eintragen, was wir nicht selbst bei der Bank nachgelesen haben. Die Anbieterliste steht, jedes Merkmal wird einzeln geprüft und mit Datum eingetragen. Bis dahin steht dort wörtlich, dass es noch nicht geprüft ist.",
      },
    ]}
    schluss="Diese Seite ist keine Anlageberatung und keine Empfehlung für eine bestimmte Bank. Über die Zulässigkeit eines Vertrags entscheidest du selbst, im Zweifel mit einem Gelehrten."
  />
);

export default VergleichGirokonto;
