import { VergleichsSeite } from "@/components/vergleich/VergleichsSeite";
import { GIRO_ZEILEN, GIRO_FINANZ_MAX } from "@/data/girokontoVergleich";
import { girokontoAnzeige } from "@/data/anzeige/girokonto";
import { juengsterStand } from "@/lib/juengsterStand";
import { GiroRatgeber } from "@/components/vergleich/GiroRatgeber";
import { giroFragen } from "@/data/giroRatgeber";

const AUSZEICHNUNGEN = { nummerEins: "Bestes Halal-Girokonto" };

/* Filter wie bei Finanzfluss („Eigenschaften“), nur mit Werten, die in den Daten belegt stehen (RN1, 12.11.2026). */
const FILTER = [
  { key: "keinDispoAbStart", label: "Kein Dispo ab Start" },
  { key: "kontofuehrung", label: "Kontoführung ohne Bedingung kostenlos", erlaubt: ["0 €", "0€"] },
  { key: "applePay", label: "Apple Pay oder Google Pay", erlaubt: ["true"] },
  { key: "filialen", label: "Mit Filialen", erlaubt: ["true"] },
];

const KRITERIEN = [
  {
    titel: "Ohne Zinsen nutzbar",
    text: "Kein Guthabenzins und kein verzinstes Unterkonto, oder lässt sich beides abschalten? Geht das nicht, gibt es keine Note.",
  },
  {
    titel: "Kein Dispo ab Start",
    text: "Wird dir nach der Eröffnung kein Dispokredit eingeräumt?",
  },
  {
    titel: "Karte ohne Kredit",
    text: "Ist die Standardkarte ohne Kreditrahmen und ohne Teilzahlung?",
  },
];

const FAQ = [
  ...giroFragen(),
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
    frage: "Wie entsteht die Reihenfolge?",
    antwort:
      "Halal-Merkmale und Kosten zählen je zur Hälfte zur Note. Jedes Halal-Merkmal belegen wir bei der Bank, eine Partnerschaft ändert keine Note, und was wir an einem Konto verdienen, zählt nie. Die Liste steht nach der Note, die du siehst. Bei gleicher Note steht zuerst meine Wahl, die Norisbank, danach, was du über unseren Link eröffnen kannst. Platz 1 bekommt nur ein Konto, das ohne Zinsen, ohne Dispo und ohne Kartenkredit startet und das du über unseren Link eröffnen kannst.",
  },
];

const VergleichGirokonto = () => (
  <VergleichsSeite
    pfad="/vergleich/girokonto"
    brotkrumen="Girokonto-Vergleich"
    titel="Girokonto-Vergleich 2026"
    untertitel="Die besten Girokonten für Muslime"
    seoTitel="Girokonto-Vergleich 2026: Die besten Halal-Girokonten"
    auszeichnungen={AUSZEICHNUNGEN}
    seoText={`Welches Girokonto ist halal? ${girokontoAnzeige.length} Konten im Vergleich: ohne Guthabenzins, ohne Dispo ab Start und mit Karte ohne Kreditrahmen.`}
    einheit="Konten"
    einleitung={
      <>
        <p>
          Ein Girokonto ist das Konto, über das dein Gehalt kommt und deine Miete geht. Fast jeder
          hat eins, kaum jemand prüft es.
        </p>
        <p>
          Für Muslime entscheiden Punkte, die in normalen Vergleichen fehlen: Liegt dein Geld ab
          Start ohne Zins, gibt es keinen Dispo, und kommt die Karte ohne Kreditrahmen?
        </p>
      </>
    }
    zeilen={GIRO_ZEILEN}
    anbieter={girokontoAnzeige}
    sortiertNach="Sortiert nach unserer Note: Halal-Merkmale und Kosten zählen je zur Hälfte. Bei gleicher Note zuerst meine Wahl, die Norisbank."
    kategorie="girokonto"
    finanzMax={GIRO_FINANZ_MAX}
    filter={FILTER}
    stand={juengsterStand(girokontoAnzeige, "14.09.2026")}
    standHinweis="Halal-Merkmale geprüft, Konditionen vom 14.09.2026"
    quellenHinweis="Kosten und Konditionen: Finanzfluss-Vergleich (Daten: Biallo), Stand 14.09.2026. Kontoführung beim Anbieter geprüft, Stand 27.09.2026. Halal-Merkmale: beim Anbieter geprüft."
    kriterien={KRITERIEN}
    faq={FAQ}
    ratgeber={<GiroRatgeber auszeichnung={AUSZEICHNUNGEN.nummerEins} kriterien={KRITERIEN} faq={FAQ} />}
    schluss="Diese Seite ist keine Anlageberatung und keine Empfehlung für eine bestimmte Bank. Über die Zulässigkeit eines Vertrags entscheidest du selbst, im Zweifel mit einem Gelehrten."
  />
);

export default VergleichGirokonto;
