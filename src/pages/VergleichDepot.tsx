import { Link } from "react-router-dom";
import { VergleichsSeite } from "@/components/vergleich/VergleichsSeite";
import { DEPOT_ZEILEN, DEPOT_FILTER, DEPOT_FINANZ_MAX, brokerVergleich } from "@/data/brokerVergleich";
import { depotAnzeige } from "@/data/anzeige/depot";
import { juengsterStand } from "@/lib/juengsterStand";
import { DepotRatgeber } from "@/components/vergleich/DepotRatgeber";
import { depotFragen } from "@/data/depotRatgeber";
import { reihenfolgeAntwort, sortiertSatz } from "@/data/reihenfolgeText";
import { ReihenfolgeGeaendert } from "@/components/vergleich/VergleichsBausteine";

/* Seit 15.11.2026 eine Nummer 1 (Elias, RN3-07: „Flatex als einzige Nummer 1 benutzen ist gut. Smartbroker als Nummer 2.“).
   Der Doppel-Kasten „Unsere zwei Nummer 1“ (A11) ist abgelöst; `meisteHalal` bleibt, greift aber nur, wenn ein anderer als
   Platz 1 die meisten Halal-Anlagen hat. */
const AUSZEICHNUNGEN = { nummerEins: "Bestes Halal-Depot", meisteHalal: "Meiste Halal-Anlagen" };

const ReihenfolgeSatz = () => (
  <>
    {sortiertSatz("Depot")}{" "}
    <Link to="/vergleiche/methodik" className="font-semibold text-primary hover:underline">
      So bewerten wir
    </Link>
  </>
);


const KRITERIEN = [
  {
    titel: "Ohne Zinsen nutzbar",
    text: "Liegt dein Guthaben ohne Zins, oder lassen sich die Zinsen abschalten? Schreibt der Anbieter dazu nichts Ausdrückliches, steht „Offen“, das ist kein Urteil. Geht beides nicht, steht das Depot ganz hinten.",
  },
  {
    titel: "Halal-Anlagen",
    text: "Wie viele Halal-ETFs und Fonds, Sukuk und Edelmetalle aus unserem Halal-Anlagen-Vergleich kannst du dort kaufen? Ein Halal-ETF zählt doppelt, Royal Mint Gold wie ein ETF.",
  },
  {
    titel: "Kein Kredit ab Start",
    text: "Räumt dir das Depot ab der Eröffnung einen Kredit ein, zählen die Halal-Merkmale 10 % weniger.",
  },
];

const FAQ = [
  ...depotFragen(),
  // „Was ist ein Depot?“ fiel mit SEO86 weg (höchstens 10 Fragen): Der Hinweiskasten „Depot und Broker meinen hier dasselbe“ erklärt es im Ratgeber.
  // SEO86 Beleg-Kommentare (MUSS 8): Der Satz zu den Hebelprodukten ist unser Rangfolge-Kriterium (Regelbuch vergleiche-und-rangfolge.md, „Haram-Angebote
  // sind kein Minuspunkt“, Elias 14.09.2026, Mitschrift, kein Wortlaut), nicht ein Gelehrten-Urteil. Dass Hebel zu benutzen haram ist, steht bei Hourani,
  // ~/hourani/positionen/forex-trading.md, ilmCast Ep. 17, 00:16:02. Ein Beleg für „solange du sie nicht nutzen musst“ als Halal-Aussage liegt nicht vor:
  // OFFEN, Halal-Prüfer entscheidet.
  {
    frage: "Woran erkenne ich, ob ein Broker für Muslime geeignet ist?",
    antwort:
      "Entscheidend ist, ob du das Depot ohne Zinsen nutzen kannst, also ohne Zins auf dem Guthaben. Dazu zählt, wie viele Halal-Anlagen du dort kaufen kannst. Dass ein Broker auch Hebelprodukte anbietet, ist kein Minuspunkt, solange du sie nicht nutzen musst.",
  },
  // SEO86 Beleg-Kommentar (MUSS 8): OFFEN, Halal-Prüfer entscheidet. Gefunden ist nur das Verwandte: Für Dividenden von Firmen mit kleinem Zinsanteil nennt MSCI
  // „given to charity“ (MSCI Islamic Index Series Methodology, Dezember 2025, Abschnitt 2.3, im Repo docs/blog/halal-etf-seo45-entwurf.txt.belege.md Z. 126).
  // Für Zinsen, die auf ein Konto beim Broker fallen, liegt keine eigene Fundstelle vor. Hourani, ~/hourani/positionen/bankkonten.md, ilmCast Ep. 13, 00:11:33
  // („dass du das Geld weggibst, erlaubt dir nicht, das Konto zu haben“) sagt: Weggeben macht ein verzinstes Konto nicht erlaubt.
  {
    frage: "Was mache ich mit Zinsen, die trotzdem anfallen?",
    antwort:
      "Nach verbreiteter Auffassung werden Zinserträge nicht behalten, sondern gespendet, ohne dafür eine Belohnung zu erwarten. Wichtig ist, die Beträge sauber getrennt zu erfassen. Die konkrete Handhabung besprichst du am besten mit einem Gelehrten deines Vertrauens.",
  },
  {
    frage: "Wie entsteht die Reihenfolge?",
    antwort: reihenfolgeAntwort("Depot"),
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
    titel="Bestes Depot für Muslime 2026"
    untertitel="Depot-Vergleich: Die besten Halal-Depots"
    seoTitel="Bestes Depot für Muslime 2026: Depot-Vergleich"
    schemaHeadline="Bestes Depot für Muslime 2026"
    auszeichnungen={AUSZEICHNUNGEN}
    seoText={`Bestes Depot für Muslime 2026: ${depotAnzeige.length} Depots im Vergleich. Ohne Zinsen nutzbar, ohne Kredit ab Start, dazu welche Halal-ETFs, Sukuk und Edelmetalle du kaufst.`}
    einheit="Depots"
    einleitung={
      <>
        <p>
          Ein Depot verwahrt deine Aktien und ETFs. Ohne Depot geht beim Vermögensaufbau nichts.
        </p>
        <p>
          Für Muslime entscheiden zwei Punkte, die in normalen Vergleichen fehlen: Liegt dein Geld
          dort ohne Zinsen, und welche Halal-ETFs,{" "}
          <Link to="/blog/sukuk" className="font-semibold text-primary hover:underline">
            Sukuk
          </Link>{" "}
          (islamische Anleihen) und Edelmetalle kannst du dort kaufen?
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
    depot
    vorneweg={<ReihenfolgeGeaendert />}
    zeilen={DEPOT_ZEILEN}
    anbieter={depotAnzeige}
    ansichtAlle={brokerVergleich}
    sortiertNach={<ReihenfolgeSatz />}
    kategorie="depot"
    finanzMax={DEPOT_FINANZ_MAX}
    filter={DEPOT_FILTER}
    stand={juengsterStand(depotAnzeige, "23.11.2026")}
    standHinweis="Halal-Merkmale beim Anbieter geprüft, wo ein Beleg steht, Konditionen vom 14.09.2026, 19 neue Tarife vom 23.11.2026"
    quellenHinweis="Kosten und Konditionen: Finanzfluss-Vergleich (Daten: Biallo), Stand 14.09.2026, die 19 neuen Tarife Stand 23.11.2026. Halal-Merkmale: beim Anbieter geprüft. Wo noch kein Beleg steht, steht „Offen“, das ist kein Urteil, und wir fragen nach."
    kriterien={KRITERIEN}
    faq={FAQ}
    weiterlesen={[
      { to: "/blog/halal-etf", name: "Beste Halal ETFs 2026", text: "Acht Halal ETFs mit Kosten und Rendite." },
      { to: "/blog/sind-aktien-haram", name: "Sind Aktien haram?", text: "Wann eine Aktie halal ist und wer das prüft." },
      { to: "/blog/sukuk", name: "Sukuk", text: "Was hinter islamischen Anleihen steckt." },
      { to: "/halal-anlagen", name: "Halal-Anlagen-Datenbank", text: "Jede Anlage mit ISIN, Kosten und dem Nachweis der Prüfstelle." },
    ]}
    ratgeber={<DepotRatgeber auszeichnungen={AUSZEICHNUNGEN} kriterien={KRITERIEN} faq={FAQ} />}
    schluss="Diese Seite ist keine Anlageberatung und keine Anlageempfehlung. Investitionen in Wertpapiere sind mit Risiken verbunden, bis hin zum Totalverlust."
  />
);

export default VergleichDepot;
