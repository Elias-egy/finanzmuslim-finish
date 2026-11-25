import { Link } from "react-router-dom";
import { VergleichsSeite } from "@/components/vergleich/VergleichsSeite";
import { DEPOT_ZEILEN, DEPOT_FINANZ_MAX } from "@/data/brokerVergleich";
import { reihenfolgeAntwort, sortiertSatz } from "@/data/reihenfolgeText";
import { ReihenfolgeGeaendert } from "@/components/vergleich/VergleichsBausteine";
import { juengsterStand } from "@/lib/juengsterStand";
import { etfSparplanDepots } from "@/data/abgeleiteteVergleiche";
import type { VergleichsZeile } from "@/components/vergleich/vergleichTypen";

/**
 * Der ETF-Sparplan-Vergleich aus den Daten des Depot-Vergleichs (Elias, 23.11.2026, VG1, Auswahl in
 * `src/data/abgeleiteteVergleiche.ts`). Das Studenten- und das Umrah-Konto sind seit VG8-02 (25.11.2026) raus (Elias VG8-01:
 * „Ja, beide sollen raus, Studenten.“), ihre Adressen leiten auf /vergleich/girokonto.
 */

const AKTUALISIERT = "23.11.2026";
const MONAT_JAHR = AKTUALISIERT.slice(3).replace(".", "/");

const ReihenfolgeSatz = ({ was }: { was?: "Depot" | "Girokonto" }) => (
  <>
    {sortiertSatz(was)}{" "}
    <Link to="/vergleiche/methodik" className="font-semibold text-primary hover:underline">
      So bewerten wir
    </Link>
  </>
);

const mitVorn = (zeilen: VergleichsZeile[], vorn: string[]): VergleichsZeile[] => {
  const kopf = zeilen.filter((z) => z.key === "__angebot");
  const nach = vorn.map((k) => zeilen.find((z) => z.key === k)).filter((z): z is VergleichsZeile => Boolean(z)).map((z) => ({ ...z, imRaster: true }));
  const rest = zeilen.filter((z) => z.key !== "__angebot" && !vorn.includes(z.key));
  return [...kopf, ...nach, ...rest];
};

/* ------------------------------------------------------------ ETF-Sparplan */

const SPARPLAN_FAQ = [
  {
    frage: "Was ist ein ETF-Sparplan?",
    antwort:
      "Du legst fest, wie viel jeden Monat automatisch in einen ETF fließt, zum Beispiel 50 €. Das Depot kauft dann von selbst. So baust du Vermögen auf, ohne jeden Monat daran zu denken.",
  },
  {
    frage: "Kann ich jeden Halal-ETF als Sparplan besparen?",
    antwort:
      "Nicht überall. Die Spalte Halal-ETFs und Fonds zählt, welche du dort kaufen kannst. Ob ein bestimmter ETF auch als Sparplan geht, zeigt dir der Anbieter beim Anlegen des Sparplans.",
  },
  {
    frage: "Was kostet ein ETF-Sparplan?",
    antwort:
      "In dieser Liste nichts für die Ausführung, ganz oder bei den großen Fondsgesellschaften. Dazu kommen die laufenden Kosten des ETFs selbst. Die stehen bei jeder Anlage in unserem Halal-Anlagen-Vergleich.",
  },
  { frage: "Wie entsteht die Reihenfolge?", antwort: reihenfolgeAntwort("Depot") },
];

export const VergleichEtfSparplan = () => (
  <VergleichsSeite
    pfad="/vergleich/etf-sparplan"
    brotkrumen="ETF-Sparplan-Vergleich"
    titel="ETF-Sparplan-Vergleich 2026"
    untertitel={`Die besten Sparplan-Depots für Muslime ${MONAT_JAHR}`}
    seoTitel="ETF-Sparplan-Vergleich 2026: Halal-ETFs kostenlos besparen"
    auszeichnungen={{ nummerEins: "Bestes Sparplan-Depot" }}
    seoText={`${etfSparplanDepots.length} Depots mit kostenlosem ETF-Sparplan, in denen du Halal-ETFs kaufen kannst: ohne Zinsen nutzbar, ab 1 € im Monat.`}
    einheit="Depots"
    einleitung={
      <>
        <p>Jeden Monat ein fester Betrag, automatisch angelegt: So bauen die meisten ihr Vermögen auf.</p>
        <p>Hier stehen nur Depots, in denen der ETF-Sparplan nichts kostet und du Halal-ETFs kaufen kannst. Ohne Zinsen nutzbar.</p>
      </>
    }
    depot
    vorneweg={<ReihenfolgeGeaendert />}
    zeilen={mitVorn(DEPOT_ZEILEN, ["halalEtfsFonds", "etfSparplanKosten", "sparrate"])}
    anbieter={etfSparplanDepots}
    sortiertNach={<ReihenfolgeSatz was="Depot" />}
    kategorie="depot"
    finanzMax={DEPOT_FINANZ_MAX}
    filter={[]}
    stand={juengsterStand(etfSparplanDepots, "14.09.2026")}
    standHinweis="Halal-Merkmale geprüft, Konditionen vom 14.09.2026"
    quellenHinweis="Kosten und Konditionen: Finanzfluss-Vergleich (Daten: Biallo), Stand 14.09.2026. Halal-Merkmale: beim Anbieter geprüft."
    kriterien={[
      { titel: "Sparplan kostenlos", text: "Die Ausführung des ETF-Sparplans kostet 0 €, ganz oder bei den großen Fondsgesellschaften. Nur solche Depots stehen hier." },
      { titel: "Ohne Zinsen nutzbar", text: "Liegt dein Guthaben ohne Zins, oder lassen sich die Zinsen abschalten? Geht beides nicht, gibt es keine Note." },
      { titel: "Halal-Anlagen", text: "Wie viele Halal-ETFs und Fonds, Sukuk und Edelmetalle aus unserem Halal-Anlagen-Vergleich kannst du dort kaufen? Ein Halal-ETF zählt doppelt, Royal Mint Gold wie ein ETF." },
      { titel: "Kein Kredit ab Start", text: "Räumt dir das Depot ab der Eröffnung einen Kredit ein, zählen die Halal-Merkmale 10 % weniger." },
    ]}
    faq={SPARPLAN_FAQ}
    weiterlesen={[
      { to: "/vergleich/depot", name: "Depot-Vergleich", text: "Alle Depots im Vergleich." },
      { to: "/blog/halal-etf", name: "Beste Halal ETFs 2026", text: "Acht Halal ETFs mit Kosten und Rendite." },
      { to: "/halal-anlagen", name: "Halal-Anlagen-Datenbank", text: "Jede Anlage mit ISIN, Kosten und dem Nachweis der Prüfstelle." },
    ]}
    schluss="Diese Seite ist keine Anlageberatung und keine Anlageempfehlung. Investitionen in Wertpapiere sind mit Risiken verbunden, bis hin zum Totalverlust."
  />
);
