import { Link } from "react-router-dom";
import { VergleichsSeite } from "@/components/vergleich/VergleichsSeite";
import { GIRO_ZEILEN, GIRO_FINANZ_MAX } from "@/data/girokontoVergleich";
import { DEPOT_ZEILEN, DEPOT_FINANZ_MAX } from "@/data/brokerVergleich";
import { BESONDERS_JE_PRODUKT } from "@/data/girokontoBesondersDaten";
import { reihenfolgeAntwort, sortiertSatz } from "@/data/reihenfolgeText";
import { ReihenfolgeGeaendert } from "@/components/vergleich/VergleichsBausteine";
import { juengsterStand } from "@/lib/juengsterStand";
import { umrahKonten, studentenKonten, etfSparplanDepots } from "@/data/abgeleiteteVergleiche";
import type { VergleichsZeile } from "@/components/vergleich/vergleichTypen";

/**
 * Drei Vergleiche aus den Daten des Girokonto- und Depot-Vergleichs (Elias, 23.11.2026, VG1, Auswahl in
 * `src/data/abgeleiteteVergleiche.ts`). Aufbau wie die Unterseiten bei Finanzfluss: Titel mit Jahr, Unterzeile mit Monat,
 * Nummer 1 oben, dieselbe Tabelle, nur die passenden Angebote. Die Note ist dieselbe wie im großen Vergleich.
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

const besondersFuer = (liste: typeof umrahKonten): Record<string, string[]> =>
  Object.fromEntries(
    liste.flatMap((a) => {
      const b = a.finanzfluss ? BESONDERS_JE_PRODUKT[a.finanzfluss.produkt] : undefined;
      return b ? [[a.id, b]] : [];
    }),
  );

/** Die Zeilen, um die es auf der Seite geht, rücken ins Raster nach vorn. */
const mitVorn = (zeilen: VergleichsZeile[], vorn: string[]): VergleichsZeile[] => {
  const kopf = zeilen.filter((z) => z.key === "__angebot");
  const nach = vorn.map((k) => zeilen.find((z) => z.key === k)).filter((z): z is VergleichsZeile => Boolean(z)).map((z) => ({ ...z, imRaster: true }));
  const rest = zeilen.filter((z) => z.key !== "__angebot" && !vorn.includes(z.key));
  return [...kopf, ...nach, ...rest];
};

const GIRO_KRITERIEN = [
  { titel: "Ohne Zinsen nutzbar", text: "Kein Guthabenzins und kein verzinstes Unterkonto, oder lässt sich beides abschalten? Geht das nicht, gibt es keine Note." },
  { titel: "Kein Dispo ab Start", text: "Wird dir nach der Eröffnung kein Dispokredit eingeräumt?" },
  { titel: "Karte ohne Kredit", text: "Ist die Standardkarte ohne Kreditrahmen und ohne Teilzahlung?" },
];

const GIRO_QUELLEN =
  "Kosten und Konditionen: Finanzfluss-Vergleich (Daten: Biallo), Stand 14.09.2026, Gebühren im Ausland und „Besonders“ Stand 19.09.2026. Kontoführung beim Anbieter geprüft, Stand 27.09.2026. Halal-Merkmale: beim Anbieter geprüft.";

const GIRO_SCHLUSS =
  "Diese Seite ist keine Anlageberatung und keine Empfehlung für eine bestimmte Bank. Über die Zulässigkeit eines Vertrags entscheidest du selbst, im Zweifel mit einem Gelehrten.";

/* ------------------------------------------------------------ Umrah, Urlaub, Heimatbesuch */

const UMRAH_FAQ = [
  {
    frage: "Welches Konto nehme ich mit zur Umrah?",
    antwort:
      "Eins, das beim Abheben und Bezahlen in Saudi-Riyal nichts extra kostet. Bei vielen Banken zahlst du sonst 1,5 bis 4 % auf jede Zahlung, dazu eine Gebühr am Automaten. In dieser Liste stehen nur Konten, bei denen alle drei Auslandsgebühren 0 sind.",
  },
  {
    frage: "Brauche ich für die Reise eine Kreditkarte?",
    antwort:
      "Nein. Eine Debitkarte ohne Kreditrahmen reicht für Hotel, Taxi und Geldautomat. Das Geld geht direkt von deinem Konto ab, es entsteht kein Kredit.",
  },
  {
    frage: "Welche Gebühren zählen hier?",
    antwort:
      "Drei: Geld abheben im Euro-Ausland, Geld abheben in fremder Währung und Bezahlen in fremder Währung. Nur wer bei allen drei 0 € oder 0 % verlangt, steht in dieser Liste.",
  },
  { frage: "Wie entsteht die Reihenfolge?", antwort: reihenfolgeAntwort("Konto") },
];

export const VergleichKontoUmrah = () => (
  <VergleichsSeite
    pfad="/vergleich/girokonto/umrah-und-urlaub"
    brotkrumen="Konto für Umrah und Urlaub"
    titel="Konto für Umrah und Urlaub 2026"
    untertitel={`Ohne Gebühren im Ausland ${MONAT_JAHR}`}
    seoTitel="Konto für Umrah und Urlaub 2026: ohne Zinsen, ohne Auslandsgebühr"
    auszeichnungen={{ nummerEins: "Bestes Konto für die Reise" }}
    seoText={`${umrahKonten.length} Girokonten ohne Gebühr im Ausland: kostenlos abheben und bezahlen bei Umrah, Urlaub und Heimatbesuch, ohne Zinsen und ohne Dispo.`}
    einheit="Konten"
    einleitung={
      <>
        <p>Umrah, Urlaub, Heimatbesuch: Bei vielen Banken kostet jede Zahlung im Ausland 1,5 bis 4 % extra.</p>
        <p>Hier stehen nur Konten, bei denen Abheben und Bezahlen im Ausland nichts kostet. Und die du ohne Zinsen nutzen kannst.</p>
      </>
    }
    zeilen={mitVorn(GIRO_ZEILEN, ["auslandFremdZahlen", "auslandFremdAbheben", "auslandAbheben"])}
    anbieter={umrahKonten}
    sortiertNach={<ReihenfolgeSatz was="Girokonto" />}
    giro={{ besonders: besondersFuer(umrahKonten) }}
    kategorie="girokonto"
    finanzMax={GIRO_FINANZ_MAX}
    filter={[{ key: "keinDispoAbStart", label: "Kein Dispo ab Start" }]}
    stand={AKTUALISIERT}
    standHinweis="Halal-Merkmale geprüft, Gebühren im Ausland vom 19.09.2026"
    quellenHinweis={GIRO_QUELLEN}
    kriterien={[
      { titel: "Ohne Gebühr im Ausland", text: "Abheben und Bezahlen im Ausland, auch in fremder Währung wie Saudi-Riyal, kostet 0 € oder 0 %. Nur solche Konten stehen hier." },
      ...GIRO_KRITERIEN,
    ]}
    faq={UMRAH_FAQ}
    weiterlesen={[
      { to: "/vergleich/girokonto", name: "Girokonto-Vergleich", text: "Alle Konten im Vergleich." },
      { to: "/blog/kreditkarte-halal", name: "Kreditkarte oder Debitkarte", text: "Was gilt islamisch, und was reicht auf Reisen." },
      { to: "/blog/girokonto-ohne-zinsen", name: "Girokonto ohne Zinsen", text: "Dein Konto in zehn Minuten umstellen." },
    ]}
    schluss={GIRO_SCHLUSS}
  />
);

/* ------------------------------------------------------------ Studenten und unter 30 */

const STUDENTEN_FAQ = [
  {
    frage: "Welches Girokonto ist für Studenten kostenlos?",
    antwort:
      "Alle in dieser Liste. Entweder kostet das Konto ohne jede Bedingung 0 €, oder es ist bis zu einem bestimmten Alter kostenlos, egal wie viel Geld eingeht. Die Altersgrenze steht in der Zeile Kontoführung.",
  },
  {
    frage: "Was passiert, wenn ich älter werde?",
    antwort:
      "Dann gilt die normale Bedingung der Bank, meist ein Geldeingang im Monat. Bei der norisbank sind es 500 €, sonst 3,90 € im Monat. Das Konto bleibt, du musst nichts umstellen.",
  },
  {
    frage: "Brauche ich als Student einen Dispo?",
    antwort:
      "Nein. Ein Dispo ist ein Kredit mit Zinsen. Achte darauf, dass dir beim Eröffnen keiner eingeräumt wird. Das zeigt die Spalte Kein Dispo ab Start.",
  },
  { frage: "Wie entsteht die Reihenfolge?", antwort: reihenfolgeAntwort("Konto") },
];

export const VergleichKontoStudenten = () => (
  <VergleichsSeite
    pfad="/vergleich/girokonto/studenten"
    brotkrumen="Girokonto für Studenten"
    titel="Girokonto für Studenten 2026"
    untertitel={`Kostenlos unter 30, ohne Zinsen ${MONAT_JAHR}`}
    seoTitel="Girokonto für Studenten 2026: kostenlos unter 30 und ohne Zinsen"
    auszeichnungen={{ nummerEins: "Bestes Konto unter 30" }}
    seoText={`${studentenKonten.length} Girokonten, die für Studenten, Azubis und alle unter 30 kostenlos sind: ohne Guthabenzins, ohne Dispo ab Start.`}
    einheit="Konten"
    einleitung={
      <>
        <p>Studium, Ausbildung, erster Job: Das erste eigene Konto soll nichts kosten.</p>
        <p>Hier stehen nur Konten, die unter 30 ohne Geldeingang kostenlos sind. Und die du ohne Zinsen nutzen kannst.</p>
      </>
    }
    zeilen={mitVorn(GIRO_ZEILEN, ["kontofuehrung"])}
    anbieter={studentenKonten}
    sortiertNach={<ReihenfolgeSatz was="Girokonto" />}
    giro={{ besonders: besondersFuer(studentenKonten) }}
    kategorie="girokonto"
    finanzMax={GIRO_FINANZ_MAX}
    filter={[
      { key: "keinDispoAbStart", label: "Kein Dispo ab Start" },
      { key: "applePay", label: "Apple Pay oder Google Pay", erlaubt: ["true"] },
    ]}
    stand={AKTUALISIERT}
    standHinweis="Halal-Merkmale geprüft, Kontoführung vom 27.09.2026"
    quellenHinweis={GIRO_QUELLEN}
    kriterien={[
      { titel: "Kostenlos unter 30", text: "Das Konto kostet ohne Bedingung 0 €, oder die Bank verlangt bis zu einem Alter von mindestens 27 Jahren keinen Geldeingang." },
      ...GIRO_KRITERIEN,
    ]}
    faq={STUDENTEN_FAQ}
    weiterlesen={[
      { to: "/vergleich/girokonto", name: "Girokonto-Vergleich", text: "Alle Konten im Vergleich." },
      { to: "/vergleich/etf-sparplan", name: "ETF-Sparplan für Muslime", text: "Ab 1 € im Monat halal anlegen." },
      { to: "/blog/girokonto-ohne-zinsen", name: "Girokonto ohne Zinsen", text: "Dein Konto in zehn Minuten umstellen." },
    ]}
    schluss={GIRO_SCHLUSS}
  />
);

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
