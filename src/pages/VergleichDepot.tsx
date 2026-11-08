import { Link } from "react-router-dom";
import { VergleichsSeite } from "@/components/vergleich/VergleichsSeite";
import { DEPOT_ZEILEN, DEPOT_FILTER, DEPOT_FINANZ_MAX } from "@/data/brokerVergleich";
import { depotAnzeige } from "@/data/vergleichAnzeige";
import { juengsterStand } from "@/lib/juengsterStand";
import { DepotRatgeber } from "@/components/vergleich/DepotRatgeber";
import { depotFragen } from "@/data/depotRatgeber";

const AUSZEICHNUNGEN = { nummerEins: "Bestes Halal-Depot", meisteHalal: "Meiste Halal-Anlagen" };

const KRITERIEN = [
  {
    titel: "Ohne Zinsen nutzbar",
    text: "Liegt dein Guthaben ohne Zins, oder lassen sich die Zinsen abschalten? Geht beides nicht, gibt es keine Note.",
  },
  {
    titel: "Halal-Anlagen",
    text: "Wie viele Halal-ETFs und Fonds, Sukuk und Edelmetalle aus unserem Halal-Anlagen-Vergleich kannst du dort kaufen?",
  },
];

const FAQ = [
  ...depotFragen(),
  {
    frage: "Was ist ein Depot?",
    antwort:
      "Ein Depot ist ein Konto für Wertpapiere. Aktien, ETFs oder Anleihen, die du kaufst, werden dort für dich verwahrt. Zum Depot gehört meist ein Verrechnungskonto, über das Käufe und Verkäufe abgewickelt werden.",
  },
  {
    frage: "Woran erkenne ich, ob ein Broker für Muslime geeignet ist?",
    antwort:
      "Entscheidend ist, ob du das Depot ohne Zinsen nutzen kannst, also ohne Zins auf dem Guthaben. Dazu zählt, wie viele Halal-Anlagen du dort kaufen kannst. Dass ein Broker auch Hebelprodukte anbietet, ist kein Minuspunkt, solange du sie nicht nutzen musst.",
  },
  {
    frage: "Was mache ich mit Zinsen, die trotzdem anfallen?",
    antwort:
      "Nach verbreiteter Auffassung werden Zinserträge nicht behalten, sondern gespendet, ohne dafür eine Belohnung zu erwarten. Wichtig ist, die Beträge sauber getrennt zu erfassen. Die konkrete Handhabung besprichst du am besten mit einem Gelehrten deines Vertrauens.",
  },
  {
    frage: "Wie entsteht die Reihenfolge?",
    antwort:
      "Halal-Merkmale und Kosten zählen je zur Hälfte zur Note. Jedes Halal-Merkmal belegen wir beim Anbieter, eine Partnerschaft ändert keine Note. Platz 1 bekommt nur ein Depot, das von Anfang an ohne Kredit läuft. Die ersten vier Depots haben alle Top-Noten, darum ordnen wir sie danach, wo unsere Leser ihr Depot am häufigsten wirklich eröffnen. Bei den übrigen steht bei gleich vielen Sternen zuerst, was du über unseren Link eröffnen kannst. Danach entscheidet die Note.",
  },
  {
    frage: "Kann ich mehrere Depots haben?",
    antwort:
      "Ja. Du kannst bei mehreren Anbietern gleichzeitig ein Depot führen, etwa um Sparpläne und Einzelkäufe zu trennen. Ein Depotwechsel oder Übertrag ist ebenfalls möglich, die Wertpapiere bleiben dabei deine.",
  },
];

const VergleichDepot = () => (
  <VergleichsSeite
    pfad="/vergleich/depot"
    brotkrumen="Depot-Vergleich"
    titel="Depot-Vergleich 2026"
    untertitel="Die besten Depots für Muslime"
    seoTitel="Depot-Vergleich 2026: Die besten Halal-Depots"
    auszeichnungen={AUSZEICHNUNGEN}
    seoText={`Welches Depot ist halal? ${depotAnzeige.length} Depots im Vergleich: ohne Zinsen nutzbar, ohne Kredit ab Start, und welche Halal-ETFs, Sukuk und Edelmetalle dort kaufbar sind.`}
    einheit="Depots"
    einleitung={
      <>
        <p>
          Ein Depot verwahrt deine Aktien und ETFs. Ohne Depot geht beim Vermögensaufbau nichts.
        </p>
        <p>
          Für Muslime entscheiden zwei Punkte, die in normalen Vergleichen fehlen: Liegt dein Geld
          dort ohne Zinsen, und welche Halal-ETFs, Sukuk und Edelmetalle kannst du dort kaufen?
        </p>
        <p>
          Welche Halal ETFs es gibt und was sie gebracht haben, siehst du im Beitrag{" "}
          <Link to="/blog/halal-etf" className="font-semibold text-primary hover:underline">
            Beste Halal ETFs 2026
          </Link>
          .
        </p>
      </>
    }
    zeilen={DEPOT_ZEILEN}
    anbieter={depotAnzeige}
    sortiertNach="Die ersten vier danach, wo unsere Leser am häufigsten eröffnen, dann nach unserer Note: Halal-Merkmale und Kosten zählen je zur Hälfte."
    kategorie="depot"
    finanzMax={DEPOT_FINANZ_MAX}
    filter={DEPOT_FILTER}
    stand={juengsterStand(depotAnzeige, "14.09.2026")}
    standHinweis="Halal-Merkmale geprüft, Konditionen vom 14.09.2026"
    quellenHinweis="Kosten und Konditionen: Finanzfluss-Vergleich (Daten: Biallo), Stand 14.09.2026. Halal-Merkmale: beim Anbieter geprüft."
    kriterien={KRITERIEN}
    faq={FAQ}
    ratgeber={<DepotRatgeber auszeichnungen={AUSZEICHNUNGEN} kriterien={KRITERIEN} faq={FAQ} />}
    schluss="Diese Seite ist keine Anlageberatung und keine Anlageempfehlung. Investitionen in Wertpapiere sind mit Risiken verbunden, bis hin zum Totalverlust."
  />
);

export default VergleichDepot;
