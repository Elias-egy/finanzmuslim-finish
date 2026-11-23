import { geschaeftskontoAnzeige } from "./anzeige/geschaeftskonto";
import { reihenfolgeAntwortGeschaeft } from "./reihenfolgeText";
import { zahlwort } from "./anzahlen";

/** Fragen und Antworten des Geschäftskonto-Vergleichs (VG2, 23.11.2026). Eigene Datei, damit ein Test sie lesen kann. */
const KOSTENLOS = geschaeftskontoAnzeige.filter((a) => a.werte.kontofuehrung === "0 €").length;
const HOECHSTPREIS = Math.max(
  ...geschaeftskontoAnzeige.map((a) => Number(String(a.werte.kontofuehrung).match(/^[\d.,]+/)?.[0].replace(",", ".") ?? 0)),
);

export const GESCHAEFT_FAQ = [
  {
    frage: "Brauche ich als Selbstständiger ein Geschäftskonto?",
    antwort:
      "Für Freiberufler und Einzelunternehmer ist es keine Pflicht. Ein eigenes Konto trennt aber Privates und Geschäftliches und erspart dir Arbeit bei der Steuer. Eine GmbH oder UG braucht ein Konto auf den Namen der Gesellschaft.",
  },
  {
    frage: "Welche Rechtsform passt zu welchem Konto?",
    antwort:
      "Nicht jedes Konto nimmt jede Rechtsform. Die Zeile „Für wen“ zeigt es je Konto. N26 Business gibt es zum Beispiel nur für selbstständige natürliche Personen, also Freiberufler und Einzelunternehmer. Nutze den Filter, wenn du eine GmbH oder UG führst.",
  },
  {
    frage: "Sind Zinskonten und Geldmarktfonds bei Geschäftskonten erlaubt?",
    antwort:
      "Das sind Zinsprodukte. Wir empfehlen sie nicht und zeigen sie nirgends als Vorteil. Ob sie für dich in Ordnung sind, entscheidest du selbst, im Zweifel mit einem Gelehrten.",
  },
  {
    frage: "Warum zählt der Dispo?",
    antwort:
      "Ein Dispo ist ein Kredit auf dem Konto mit Sollzinsen. Bei den Konten mit Beleg wird dir nach der Eröffnung keiner eingeräumt. Gibt es einen Kredit, dann nur auf deinen Antrag. Wo der Anbieter das nicht belegt, steht „Offen“.",
  },
  {
    frage: "Was heißt „Offen“ bei den Zinsen?",
    antwort:
      "Bei diesen Konten schreibt der Anbieter zu Zinsen auf dem Hauptkonto bisher nichts Ausdrückliches. Das ist kein Urteil. Wir fragen beim Anbieter nach und tragen die Antwort ein. Bis dahin stehen sie hinter den Konten mit Beleg. Zahlt ein Anbieter Zinsen auf das Guthaben, steht sein Konto ganz hinten.",
  },
  {
    frage: "Was kostet ein Geschäftskonto?",
    antwort: `Das reicht von 0 € bis ${HOECHSTPREIS.toLocaleString("de-DE", { maximumFractionDigits: 0 })} € im Monat. ${zahlwort(KOSTENLOS, true)} Konten in dieser Liste haben keine Kontoführung. Dazu kommen je nach Konto Kosten für Buchungen, Bargeld und weitere Karten.`,
  },
  { frage: "Wie entsteht die Reihenfolge?", antwort: reihenfolgeAntwortGeschaeft() },
];

