import { Link } from "react-router-dom";
import { VergleichsSeite } from "@/components/vergleich/VergleichsSeite";
import { GESCHAEFT_ZEILEN, GESCHAEFT_FILTER } from "@/data/geschaeftskontoVergleich";
import { geschaeftskontoAnzeige } from "@/data/anzeige/geschaeftskonto";
import { GESCHAEFT_FINANZ_MAX } from "@/data/finanzMax";
import { ISLAMIC_KONTO_FILTER } from "@/data/islamicKonto";
import { sortiertSatzGeschaeft } from "@/data/reihenfolgeText";
import { GESCHAEFT_FAQ } from "@/data/geschaeftskontoFaq";
import { GeschaeftsRatgeber } from "@/components/vergleich/GeschaeftsRatgeber";
import { geschaeftsFragen } from "@/data/geschaeftsRatgeber";
import { siegerDerSeite } from "@/lib/vergleichAssistent";

/**
 * Geschäftskonto-Vergleich (VG2, 23.11.2026, Elias: „Geschäftskonto könnte aber noch ganz oben sein.“). Aufbau wie
 * Finanzfluss /vergleich/geschaeftskonto/: Titel mit Jahr, Unterzeile mit Monat, Filter, Karten am Handy, Tabelle am Laptop,
 * Kriterien, Fragen. Seit VG2-04 (Elias, 23.11.2026: „ich möchte, dass du erstmal alle Anbieter reinlegst … Ich will jeden einzelnen
 * Anbieter ranken“) stehen alle 71 Tarife der 23 Anbieter von Finanzfluss drin (seit VG3 KT Bank, 23.11.2026, zusätzlich das KT GeschäftsKonto), gerankt in drei Stufen (`src/lib/rangfolge.ts`, Regel 9):
 * belegt ohne Guthabenzins, offen (der Anbieter schreibt nichts Ausdrückliches), belegt mit Zins.
 *
 * Der Kasten „Nummer 1“ erscheint von selbst, sobald das Konto ganz vorn einen Partnerlink hat (Elias, 08.11.2026: „wir können
 * nicht etwas auf die 1 packen, wo wir keinen Link haben“). Platz 1 der Liste hängt seit VG2-04 nicht mehr am Link, nur der Kasten.
 */
const AKTUALISIERT = "23.11.2026";
const MONAT_JAHR = AKTUALISIERT.slice(3).replace(".", "/");

const ANZAHL = geschaeftskontoAnzeige.length;
const ANBIETER = new Set(geschaeftskontoAnzeige.map((a) => a.haus ?? a.id)).size;
const BELEGT = geschaeftskontoAnzeige.filter((a) => a.werte.zinsfreiAbStart === "gut").length;
const OFFEN = geschaeftskontoAnzeige.filter((a) => a.werte.zinsfreiAbStart === "unbekannt").length;

/** Die Nummer 1 gibt es als Kasten nur mit Partnerlink. Ohne Link bleibt die Liste gerankt, der Kasten fehlt. */
const SIEGER_HAT_LINK = Boolean(siegerDerSeite(geschaeftskontoAnzeige, "geschaeftskonto", GESCHAEFT_FINANZ_MAX)?.link);

/** Der Vergütungshinweis steht nur, wenn ein Konto einen Partnerlink hat. */
const MIT_PARTNER = geschaeftskontoAnzeige.some((a) => a.link);

const ReihenfolgeSatz = () => (
  <>
    {sortiertSatzGeschaeft()}{" "}
    <Link to="/vergleiche/methodik" className="font-semibold text-primary hover:underline">
      So bewerten wir
    </Link>
  </>
);

/** Nur sichtbar, solange kein Kasten „Nummer 1“ steht: sagt, wonach die Liste geordnet ist. */
const Reihenfolge = () => (
  <section className="mt-4 rounded-lg border border-border px-4 py-3 lg:mt-10 lg:px-6 lg:py-5">
    <p className="text-[14px] leading-snug text-muted-foreground lg:hidden">
      Zuerst Konten mit belegt zinsfreiem Hauptkonto, dann Konten mit offener Zins-Frage. Dazu zählen Halal-Merkmale und Kosten je zur Hälfte.
    </p>
    <p className="hidden text-[16px] font-bold text-foreground lg:block">Sortiert nach Zins-Beleg, dann nach Halal-Merkmalen und Kosten</p>
    <p className="mt-1 hidden text-[15px] leading-[24px] text-muted-foreground lg:block">
      Zuerst stehen Konten, bei denen der Anbieter belegt, dass das Hauptkonto keinen Guthabenzins zahlt. Danach folgen die Konten, bei denen
      das noch offen ist, ganz hinten, wer Zinsen zahlt. In jeder Gruppe zählen Halal-Merkmale (Zinsen, Dispo, Karte ohne Kredit) und Kosten
      (Kontoführung, Buchungen, Bargeld, Karte, Unterkonten, Buchhaltung, Einlagensicherung) je zur Hälfte.{" "}
      <Link to="/vergleiche/methodik" className="font-semibold text-primary hover:underline">
        So bewerten wir
      </Link>
    </p>
  </section>
);

/* „Islamic-Konto“ (VG8-04) ist kein Tabellenkriterium, deshalb hier und nicht in GESCHAEFT_FILTER (jeder Filter dort braucht eine Zeile). */
const FILTER = [...GESCHAEFT_FILTER, { key: "kontofuehrung", label: "Kontoführung kostenlos", erlaubt: ["0 €"] }, ISLAMIC_KONTO_FILTER];

const KRITERIEN = [
  {
    titel: "Ohne Zinsen nutzbar",
    text: "Zahlt das Hauptkonto keinen Guthabenzins? Zinsen gibt es höchstens auf einem eigenen Konto, das du selbst eröffnen müsstest. Schreibt der Anbieter dazu nichts Ausdrückliches, steht „Offen“, das ist kein Urteil. Zahlt er Zinsen auf das Guthaben, steht das Konto ganz hinten.",
  },
  { titel: "Kein Dispo ab Start", text: "Wird dir nach der Eröffnung kein Dispokredit eingeräumt? Ein Kredit nur auf deinen Antrag zählt als erfüllt." },
  { titel: "Karte ohne Kredit", text: "Gibt es eine Debitkarte ohne Kreditrahmen? Gibt es nur eine Kreditkarte, ist das Merkmal nicht erfüllt." },
  {
    titel: "Kosten",
    text: "Kontoführung, Buchungen, Bargeld, Debitkarte, Unterkonten, Buchhaltung und Einlagensicherung, gewichtet wie bei Finanzfluss. Ein Tagesgeld zählt nie.",
  },
];

const AUSZEICHNUNGEN = { nummerEins: "Bestes Geschäftskonto" };

/** Fragen des Vergleichs: die vier aus dem Beitrag „Geschäftskonto für Muslime“ zuerst, dann die des Vergleichs (ohne Doppel). */
const FAQ = [...geschaeftsFragen(), ...GESCHAEFT_FAQ];

const VergleichGeschaeftskonto = () => (
  <VergleichsSeite
    pfad="/vergleich/geschaeftskonto"
    brotkrumen="Geschäftskonto-Vergleich"
    titel="Geschäftskonto-Vergleich 2026"
    untertitel={`Die besten Geschäftskonten für Muslime ${MONAT_JAHR}`}
    seoTitel="Geschäftskonto-Vergleich 2026: ohne Zinsen, ohne Dispo"
    seoText={`${ANZAHL} Geschäftskonten von ${ANBIETER} Anbietern für Selbstständige, Freiberufler und GmbH: zuerst die ohne Guthabenzins, ohne Dispo ab Start und mit Debitkarte. Kosten und Konditionen im Vergleich.`}
    einheit="Konten"
    auszeichnungen={AUSZEICHNUNGEN}
    einleitung={
      <>
        <p>Selbstständige, Freiberufler und Gründer einer GmbH oder UG trennen mit einem Geschäftskonto Privates und Geschäftliches.</p>
        <p>
          Hier stehen alle Geschäftskonten von Finanzfluss und das GeschäftsKonto der KT Bank. Vorn die Konten, bei denen der Anbieter belegt, dass es keinen Guthabenzins gibt, dann die,
          bei denen das noch offen ist. Dazu Dispo, Karte und die Kosten, wie bei Finanzfluss gewichtet.
        </p>
      </>
    }
    zeilen={GESCHAEFT_ZEILEN}
    anbieter={geschaeftskontoAnzeige}
    kategorie="geschaeftskonto"
    finanzMax={GESCHAEFT_FINANZ_MAX}
    ohneNummerEins={!SIEGER_HAT_LINK}
    giro={{ besonders: {} }}
    sortiertNach={<ReihenfolgeSatz />}
    reihenfolge={<Reihenfolge />}
    kennzahlenMax={4}
    kennzahlen={[
      { zahl: ANZAHL, text: "Konten im Vergleich" },
      { zahl: ANBIETER, text: "Anbieter" },
      { zahl: BELEGT, text: "belegt ohne Zinsen nutzbar" },
      { zahl: OFFEN, text: "Zinsen noch offen" },
    ]}
    filter={FILTER}
    stand={AKTUALISIERT}
    standHinweis="Halal-Merkmale beim Anbieter belegt, wo ein Beleg steht, Kosten laut Finanzfluss vom 11.11.2026"
    quellenHinweis={`Kosten und Konditionen: Finanzfluss-Vergleich Geschäftskonto, Stand 11.11.2026. Zinsen, Dispo und Karte: beim Anbieter belegt, Stand 23.11.2026. Aufgenommen sind alle Tarife des Finanzfluss-Vergleichs. Zusätzlich ist die KT Bank drin (Angaben von kt-bank.de, Stand 23.11.2026). Wo der Anbieter zum Zins auf dem Hauptkonto nichts Ausdrückliches schreibt, steht „Offen“, und wir fragen nach.${MIT_PARTNER ? " Bei einigen Anbietern erhalten wir eine Vergütung, wenn du über unseren Link ein Konto eröffnest (Werbung)." : ""}`}
    kriterienTitel="Worauf wir bei Geschäftskonten achten"
    kriterien={KRITERIEN}
    faq={FAQ}
    ratgeber={<GeschaeftsRatgeber auszeichnung={AUSZEICHNUNGEN.nummerEins} kriterien={KRITERIEN} faq={FAQ} />}
    weiterlesen={[
      { to: "/vergleiche/methodik", name: "So bewerten wir", text: "Wie aus den Merkmalen eine Note wird." },
    ]}
    schluss="Diese Seite ist keine Anlageberatung und keine Empfehlung für eine bestimmte Bank. Über die Zulässigkeit eines Vertrags entscheidest du selbst, im Zweifel mit einem Gelehrten."
  />
);

export default VergleichGeschaeftskonto;
