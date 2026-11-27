import { VergleichsSeite } from "@/components/vergleich/VergleichsSeite";
import { GIRO_ZEILEN, GIRO_FINANZ_MAX } from "@/data/girokontoVergleich";
import { girokontoAnzeige } from "@/data/anzeige/girokonto";
import { BESONDERS_JE_PRODUKT } from "@/data/girokontoBesondersDaten";
import { GiroRatgeber } from "@/components/vergleich/GiroRatgeber";
import { giroFragen } from "@/data/giroRatgeber";
import { Link } from "react-router-dom";
import { ISLAMIC_KONTO_FILTER } from "@/data/islamicKonto";
import { reihenfolgeAntwort, sortiertSatz } from "@/data/reihenfolgeText";

const AUSZEICHNUNGEN = { nummerEins: "Bestes Halal-Girokonto" };

/**
 * Datum der Seite („Aktualisiert am“) und Monat der Unterzeile, eine Stelle. PH2-01, 15.11.2026: „Das beste Girokonto für
 * Muslime 11/2026“ wie bei Finanzfluss. Wer die Seite neu prüft, setzt hier das Datum.
 */
const AKTUALISIERT = "15.11.2026";
const MONAT_JAHR = AKTUALISIERT.slice(3).replace(".", "/");

/** „Besonders“ je Konto: nur, was Finanzfluss unter „Besondere Eigenschaften“ nennt (`girokontoBesondersDaten.ts`). */
const BESONDERS: Record<string, string[]> = Object.fromEntries(
  girokontoAnzeige.flatMap((a) => {
    const b = a.finanzfluss ? BESONDERS_JE_PRODUKT[a.finanzfluss.produkt] : undefined;
    return b ? [[a.id, b]] : [];
  }),
);

const ReihenfolgeSatz = () => (
  <>
    {sortiertSatz("Girokonto")}{" "}
    <Link to="/vergleiche/methodik" className="font-semibold text-primary hover:underline">
      So bewerten wir
    </Link>
  </>
);

/* Filter wie bei Finanzfluss („Eigenschaften“), nur mit Werten, die in den Daten belegt stehen (RN1, 12.11.2026). */
const FILTER = [
  { key: "keinDispoAbStart", label: "Kein Dispo ab Start" },
  { key: "kontofuehrung", label: "Kontoführung ohne Bedingung kostenlos", erlaubt: ["0 €", "0€"] },
  { key: "applePay", label: "Apple Pay oder Google Pay", erlaubt: ["true"] },
  { key: "filialen", label: "Mit Filialen", erlaubt: ["true"] },
  ISLAMIC_KONTO_FILTER,
];

const KRITERIEN = [
  {
    titel: "Ohne Zinsen nutzbar",
    text: "Kein Guthabenzins und kein verzinstes Unterkonto, oder lässt sich beides abschalten? Schreibt der Anbieter dazu nichts Ausdrückliches, steht „Offen“, das ist kein Urteil. Geht das nicht, steht das Konto ganz hinten.",
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
  // SEO86 (A14, höchstens 10 Fragen): „Was ist an einem normalen Girokonto problematisch?“ fiel weg (doppelt zu „Was ist ein halal Girokonto?“ und zu den
  // Abschnitten „Zinsen und Dispo“); „Reicht es, den Dispo nicht zu nutzen?“ steht jetzt in „Ist ein Dispokredit haram?“ (giroRatgeber.ts, mit Quelle).
  // SEO86 Beleg-Kommentar (MUSS 8): OFFEN, Halal-Prüfer entscheidet. Gefunden ist nur das Verwandte: Für Dividenden von Firmen mit kleinem Zinsanteil nennt MSCI
  // „given to charity“ (MSCI Islamic Index Series Methodology, Dezember 2025, Abschnitt 2.3, im Repo docs/blog/halal-etf-seo45-entwurf.txt.belege.md Z. 126).
  // Für Zinsen auf einem Girokonto liegt keine eigene Fundstelle vor. Hourani, ~/hourani/positionen/bankkonten.md, ilmCast Ep. 13, 00:11:33 („dass du das Geld
  // weggibst, erlaubt dir nicht, das Konto zu haben“) sagt: Weggeben macht ein verzinstes Konto nicht erlaubt.
  // SEO87 Halal-Prüfer (~/.claude/handoffs/seo87-pruefberichte/halal-spenden-hebel.md): Hourani riba.md Ep. 13, 00:11:02 „Man nimmt das und man gibt das weiter.“,
  // 00:11:05/00:11:11 (nicht Moschee oder Masahif, sondern Essen und Trinken an Arme), 00:11:27 „es gilt nicht als Sadaka“; bankkonten.md Ep. 13, 00:11:33;
  // letzter Satz: Elias 24.11. raw/2026-11-24-elias-vg4-03 Z. 8 „Zinsen ist sowieso Ausschlusskriterium.“
  {
    frage: "Was mache ich mit Zinsen, die trotzdem anfallen?",
    antwort:
      "Du behältst sie nicht, sondern gibst sie weg. Das zählt nicht als Sadaqa, und das Geld gehört nicht in den Bau einer Moschee oder in Koranausgaben, sondern zum Beispiel in Essen und Trinken für Arme. Wichtig: Das Weggeben macht ein verzinstes Konto nicht erlaubt. Deshalb zählt in unserem Vergleich, ob das Konto von Anfang an ohne Zinsen läuft.",
  },
  {
    frage: "Wie entsteht die Reihenfolge?",
    antwort: reihenfolgeAntwort("Konto"),
  },
];

const VergleichGirokonto = () => (
  <VergleichsSeite
    pfad="/vergleich/girokonto"
    brotkrumen="Girokonto-Vergleich"
    titel="Girokonto-Vergleich 2026"
    untertitel={`Das beste Girokonto für Muslime ${MONAT_JAHR}`}
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
    sortiertNach={<ReihenfolgeSatz />}
    weiterlesen={[
      { to: "/blog/girokonto-ohne-zinsen", name: "Girokonto ohne Zinsen", text: "Dein Konto in zehn Minuten umstellen." },
      { to: "/blog/kreditkarte-halal", name: "Kreditkarte oder Debitkarte", text: "Was gilt islamisch, und was reicht im Alltag." },
      { to: "/blog/dispo-und-schulden", name: "Dispo und Schulden", text: "Zwei Wege aus dem Minus." },
      { to: "/blog/zinsen-im-islam", name: "Zinsen im Islam", text: "Warum Geld gegen mehr Geld verboten ist." },
    ]}
    giro={{ besonders: BESONDERS }}
    kategorie="girokonto"
    finanzMax={GIRO_FINANZ_MAX}
    filter={FILTER}
    stand={AKTUALISIERT}
    standHinweis="Halal-Merkmale geprüft, Konditionen vom 14.09.2026, Gebühren im Ausland vom 19.09.2026"
    quellenHinweis="Kosten und Konditionen: Finanzfluss-Vergleich (Daten: Biallo), Stand 14.09.2026, Gebühren im Ausland und „Besonders“ Stand 19.09.2026. Kontoführung beim Anbieter geprüft, Stand 27.09.2026. Halal-Merkmale: beim Anbieter geprüft. Wo noch kein Beleg steht, steht „Offen“, das ist kein Urteil, und wir fragen nach."
    kriterien={KRITERIEN}
    faq={FAQ}
    ratgeber={<GiroRatgeber auszeichnung={AUSZEICHNUNGEN.nummerEins} kriterien={KRITERIEN} faq={FAQ} />}
    schluss="Diese Seite ist keine Anlageberatung und keine Empfehlung für eine bestimmte Bank. Über die Zulässigkeit eines Vertrags entscheidest du selbst, im Zweifel mit einem Gelehrten."
  />
);

export default VergleichGirokonto;
