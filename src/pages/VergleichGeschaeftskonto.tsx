import { Link } from "react-router-dom";
import { VergleichsSeite } from "@/components/vergleich/VergleichsSeite";
import { GESCHAEFT_ZEILEN, GESCHAEFT_FILTER } from "@/data/geschaeftskontoVergleich";
import { geschaeftskontoAnzeige } from "@/data/anzeige/geschaeftskonto";
import { GESCHAEFT_FINANZ_MAX } from "@/data/finanzMax";
import { sortiertSatzGeschaeft } from "@/data/reihenfolgeText";
import { GESCHAEFT_FAQ } from "@/data/geschaeftskontoFaq";
import { siegerDerSeite } from "@/lib/vergleichAssistent";

/**
 * Geschäftskonto-Vergleich (VG2, 23.11.2026, Elias: „Geschäftskonto könnte aber noch ganz oben sein.“). Aufbau wie
 * Finanzfluss /vergleich/geschaeftskonto/: Titel mit Jahr, Unterzeile mit Monat, Filter, Karten am Handy, Tabelle am Laptop,
 * Kriterien, Fragen. Die Auswahl ist unsere: nur Konten, deren Hauptkonto laut Anbieter keinen Guthabenzins zahlt.
 *
 * Der Kasten „Nummer 1“ erscheint von selbst, sobald das Konto ganz vorn einen Partnerlink hat (Elias, 08.11.2026: „wir können
 * nicht etwas auf die 1 packen, wo wir keinen Link haben“). Die Liste ist immer gerankt und trägt Plätze.
 */
const AKTUALISIERT = "23.11.2026";
const MONAT_JAHR = AKTUALISIERT.slice(3).replace(".", "/");

const ANZAHL = geschaeftskontoAnzeige.length;
const ANBIETER = new Set(geschaeftskontoAnzeige.map((a) => a.haus ?? a.id)).size;
const KOSTENLOS = geschaeftskontoAnzeige.filter((a) => a.werte.kontofuehrung === "0 €").length;

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
    <p className="text-[14px] leading-snug text-muted-foreground lg:hidden">Sortiert nach Halal-Merkmalen und Kosten, je zur Hälfte.</p>
    <p className="hidden text-[16px] font-bold text-foreground lg:block">Sortiert nach Halal-Merkmalen und Kosten</p>
    <p className="mt-1 hidden text-[15px] leading-[24px] text-muted-foreground lg:block">
      Beides zählt je zur Hälfte. Zu den Halal-Merkmalen gehören Zinsen, Dispo und die Karte ohne Kredit, zu den Kosten Kontoführung,
      Buchungen, Bargeld, Karte, Unterkonten, Buchhaltung und Einlagensicherung.{" "}
      <Link to="/vergleiche/methodik" className="font-semibold text-primary hover:underline">
        So bewerten wir
      </Link>
    </p>
  </section>
);

const FILTER = [...GESCHAEFT_FILTER, { key: "kontofuehrung", label: "Kontoführung kostenlos", erlaubt: ["0 €"] }];

const KRITERIEN = [
  {
    titel: "Ohne Zinsen nutzbar",
    text: "Zahlt das Hauptkonto keinen Guthabenzins? Zinsen gibt es höchstens auf einem eigenen Konto, das du selbst eröffnen müsstest. Geht das nicht, gibt es keine Note.",
  },
  { titel: "Kein Dispo ab Start", text: "Wird dir nach der Eröffnung kein Dispokredit eingeräumt? Ein Kredit nur auf deinen Antrag zählt als erfüllt." },
  { titel: "Karte ohne Kredit", text: "Gibt es eine Debitkarte ohne Kreditrahmen? Gibt es nur eine Kreditkarte, ist das Merkmal nicht erfüllt." },
  {
    titel: "Kosten",
    text: "Kontoführung, Buchungen, Bargeld, Debitkarte, Unterkonten, Buchhaltung und Einlagensicherung, gewichtet wie bei Finanzfluss. Ein Tagesgeld zählt nie.",
  },
];

const VergleichGeschaeftskonto = () => (
  <VergleichsSeite
    pfad="/vergleich/geschaeftskonto"
    brotkrumen="Geschäftskonto-Vergleich"
    titel="Geschäftskonto-Vergleich 2026"
    untertitel={`Die besten Geschäftskonten für Muslime ${MONAT_JAHR}`}
    seoTitel="Geschäftskonto-Vergleich 2026: ohne Zinsen, ohne Dispo"
    seoText={`${ANZAHL} Geschäftskonten von ${ANBIETER} Anbietern für Selbstständige, Freiberufler und GmbH: ohne Guthabenzins, ohne Dispo ab Start, mit Debitkarte. Kosten und Konditionen im Vergleich.`}
    einheit="Konten"
    auszeichnungen={{ nummerEins: "Bestes Geschäftskonto" }}
    einleitung={
      <>
        <p>Selbstständige, Freiberufler und Gründer einer GmbH oder UG trennen mit einem Geschäftskonto Privates und Geschäftliches.</p>
        <p>Hier stehen nur Konten ohne Guthabenzins, ohne Dispo ab Start und mit Karte ohne Kredit. Dazu die Kosten, wie bei Finanzfluss gewichtet.</p>
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
    kennzahlen={[
      { zahl: ANZAHL, text: "Tarife im Vergleich" },
      { zahl: ANBIETER, text: "Anbieter" },
      { zahl: KOSTENLOS, text: "ohne Kontoführung" },
    ]}
    filter={FILTER}
    stand={AKTUALISIERT}
    standHinweis="Halal-Merkmale beim Anbieter belegt, Kosten laut Finanzfluss vom 11.11.2026"
    quellenHinweis={`Kosten und Konditionen: Finanzfluss-Vergleich Geschäftskonto, Stand 11.11.2026. Zinsen, Dispo und Karte: beim Anbieter belegt, Stand 23.11.2026. Aufgenommen sind nur Anbieter, deren Hauptkonto laut eigenen Unterlagen keinen Guthabenzins zahlt.${MIT_PARTNER ? " Bei einigen Anbietern erhalten wir eine Vergütung, wenn du über unseren Link ein Konto eröffnest (Werbung)." : ""}`}
    kriterienTitel="Worauf wir bei Geschäftskonten achten"
    kriterien={KRITERIEN}
    faq={GESCHAEFT_FAQ}
    weiterlesen={[
      { to: "/vergleich/girokonto", name: "Girokonto-Vergleich", text: "Das Konto für dein privates Geld." },
      { to: "/vergleich/depot", name: "Depot-Vergleich", text: "Dein Geld halal anlegen." },
      { to: "/vergleiche/methodik", name: "So bewerten wir", text: "Wie aus den Merkmalen eine Note wird." },
    ]}
    schluss="Diese Seite ist keine Anlageberatung und keine Empfehlung für eine bestimmte Bank. Über die Zulässigkeit eines Vertrags entscheidest du selbst, im Zweifel mit einem Gelehrten."
  />
);

export default VergleichGeschaeftskonto;
