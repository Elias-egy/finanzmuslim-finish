import { useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, Check, ChevronDown } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Seo from "@/components/Seo";
import eliasPortrait from "@/assets/elias-autor.webp";
import { kursFuerIsin, kursStand } from "@/lib/kurse";
import { etfListe, etfsBei } from "@/data/halalEtfListe";
import { ANZAHL_ANBIETER } from "@/data/autoAboCheckAusschnitt";
import {
  AnbieterKasten,
  AutorAufruf,
  BIO,
  Etikett,
  GoogleKasten,
  H2,
  INSTAGRAM,
  Karte,
  KartenReihe,
  KartenTabelle,
  Kernsatz,
  LINKEDIN,
  LINKEDIN_FIRMA,
  Marke,
  PROFILE,
  SITE,
  TL,
  Tabelle,
  Text,
  Video,
  YOUTUBE,
  euro,
  useAktiv,
} from "@/components/blog/bausteine";

/**
 * „Ist Leasing haram?“, neu gebaut in SEO54 (04.11.2026) im Aufbau von /blog/halal-gold-kaufen (Elias SEO53: „Leasing muss ja
 * erstmal als Hauptbeitrag stehen. Der perfekt angepasst ist. Irgendwie auch ein Rechner“, Vault
 * raw/2026-11-04-elias-seo53-leasing-hauptbeitrag-rechner-linkedin-nur-etf.md). Jede Halal-Aussage aus der Karte der Station
 * fundament/research/quellen/SEO-GUIDE-Z2aCQ5YKaTU/beitraege/ist-leasing-haram.md im Vault; Begleitdatei
 * docs/blog/pruefer-seo54/ist-leasing-haram-seo54.txt.belege.md. Titel nach Elias SEO54: „Du kannst den Titel ändern, wie du willst“.
 */

const PFAD = "/blog/ist-leasing-haram";
const TITEL = "Ist Leasing haram? Wann Leasing halal ist: 5 Punkte";
const META =
  "Ist Leasing haram? Fast immer ja, wegen einer Klausel im Vertrag. Die 5 Punkte zum Prüfen, das Auto-Abo als halal Weg und ein Rechner: Rate oder Polster.";
const VEROEFFENTLICHT = { text: "16.08.2026", iso: "2026-08-16T09:00:00+02:00" };
const AKTUALISIERT = { text: "04.11.2026", iso: "2026-11-04T09:00:00+01:00" };
const LESEZEIT = 10;
const RECHTSHINWEIS =
  "Dieser Beitrag gibt bekannte Positionen wieder und dient ausschließlich zu Bildungszwecken. Er ist keine Fatwa und ersetzt weder die Auskunft eines Gelehrten noch eine Rechts- oder Anlageberatung. Leasingverträge unterscheiden sich stark, maßgeblich ist immer dein eigener Vertrag. Innerhalb der Rechtsschulen gibt es zu einzelnen Punkten abweichende Auffassungen, besonders bei Pflichtversicherungen und bei beruflicher Notwendigkeit. Vergangene Kursentwicklung ist kein Versprechen für die Zukunft.";

/** Der Knopf aller Aufrufe, gleich im Kopf (SiteHeader.tsx, KOPF_ZIEL), in der Seitenleiste und im Aufruf mit Foto. */
const KNOPF = "Rate halal anlegen";

type Abschnitt = { id: string; titel: string; leiste?: boolean; kurz?: string };
const ABSCHNITTE: Abschnitt[] = [
  { id: "das-wichtigste", titel: "Das Wichtigste", leiste: true },
  { id: "fuenf-punkte", titel: "Woran erkennst du, ob ein Leasingvertrag halal ist?", leiste: true, kurz: "Die 5 Punkte im Vertrag" },
  { id: "warum", titel: "Warum ist Leasing in Deutschland fast immer haram?", leiste: true, kurz: "Warum fast immer haram" },
  { id: "rechner", titel: "Rate oder Polster: Was wäre aus deiner Leasingrate geworden?", leiste: true, kurz: "Rechner: Rate oder Polster" },
  { id: "auto-abo", titel: "Ist ein Auto-Abo halal?", leiste: true, kurz: "Auto-Abo" },
  { id: "restwert", titel: "Was ist mit Restwert, Kauf am Ende und Ballonfinanzierung?", leiste: true, kurz: "Restwert und Ballonrate" },
  { id: "ohne-leasing", titel: "Wie kommst du ohne Leasing an ein Auto?", leiste: true, kurz: "Ohne Leasing zum Auto" },
  { id: "schon-geleast", titel: "Ich lease schon. Was jetzt?", leiste: true },
  { id: "haeufige-fragen", titel: "Häufige Fragen", leiste: true },
  { id: "naechster-schritt", titel: "Dein nächster Schritt: das passende Depot" },
];
const titelVon = (id: string) => ABSCHNITTE.find((a) => a.id === id)!.titel;
const LEISTE = ABSCHNITTE.filter((a) => a.leiste);
const Ueber = ({ id }: { id: string }) => <H2 id={id}>{titelVon(id)}</H2>;

/* ------------------------------------------------------------------ */
/* Daten                                                               */
/* ------------------------------------------------------------------ */

type Ton = "gruen" | "gelb" | "rot";

/** Fünf Wege zum Auto, Etiketten nach STATION-BEITRAG.md (SEO48-04). Einordnung wie in den Abschnitten unten. */
const WEGE: { weg: string; marke: string; ton: Ton; besonders: string; zahlst: string; ende: string; ziel: string }[] = [
  {
    weg: "Auto-Abo",
    marke: "geht mit Prüfung",
    ton: "gruen",
    besonders: "Die halal Form des Leasings",
    zahlst: "eine Rate, Versicherung, Steuer und Wartung sind drin",
    ende: "Das Auto geht zurück",
    ziel: "auto-abo",
  },
  {
    weg: "Gebraucht bar kaufen",
    marke: "klar erlaubt",
    ton: "gruen",
    besonders: "Keine Rate, kein Vertrag mit Haken",
    zahlst: "einmal den Kaufpreis",
    ende: "Das Auto gehört dir",
    ziel: "ohne-leasing",
  },
  {
    weg: "Ratenkauf beim Händler",
    marke: "geht mit Prüfung",
    ton: "gruen",
    besonders: "Fester Preis, keine Bank dazwischen",
    zahlst: "feste Raten, der Preis steht vorher fest",
    ende: "Das Auto gehört dir",
    ziel: "ohne-leasing",
  },
  {
    weg: "Leasing vom Autohaus",
    marke: "fällt weg",
    ton: "rot",
    besonders: "Du haftest für ein fremdes Auto",
    zahlst: "Rate, dazu Versicherung, Steuer und Wartung",
    ende: "Das Auto geht zurück",
    ziel: "warum",
  },
  {
    weg: "Autokredit oder Ballonrate",
    marke: "fällt weg",
    ton: "rot",
    besonders: "Ein Kredit einer Bank",
    zahlst: "Raten mit Zins, oft eine große Schlussrate",
    ende: "Das Auto gehört dir",
    ziel: "restwert",
  },
];

/** Die fünf Punkte im Vertrag. Belege in der Begleitdatei, Reihenfolge nach Gewicht (Haftung ist der Hauptpunkt). */
const PUNKTE: { punkt: string; gut: string; schlecht: string }[] = [
  {
    punkt: "1. Totalschaden oder Diebstahl",
    gut: "Ist das Auto weg, endet deine Rate. Den Schaden trägt der Eigentümer.",
    schlecht: "Du zahlst weiter, obwohl es das Auto nicht mehr gibt.",
  },
  {
    punkt: "2. Versicherung, Steuer, Wartung",
    gut: "Zahlt der Anbieter. Er darf die Kosten in die Rate einrechnen.",
    schlecht: "Du musst sie selbst abschließen und zahlen, oft mit Pflicht zur Vollkasko.",
  },
  {
    punkt: "3. Zu spät gezahlt",
    gut: "Keine Klausel, die den Betrag wegen Verzug erhöht.",
    schlecht: "Verzugszinsen oder ein Aufschlag, der mit der Zeit wächst.",
  },
  {
    punkt: "4. Kauf am Ende",
    gut: "Du gibst das Auto zurück.",
    schlecht: "Das Auto wird über eine Bank finanziert, du zahlst Raten und eine Schlussrate.",
  },
  {
    punkt: "5. Nach der Rückgabe",
    gut: "Keine Nachzahlung für Wertverlust oder Restwert.",
    schlecht: "Ist das Auto weniger wert als geplant, sollst du die Differenz zahlen.",
  },
];

/**
 * Ein Jahr mit demselben Auto, Hyundai IONIQ 5 (63 kWh), aus dem Auto-Abo-Check (src/data/autoAboCheck.ts, `rechnung`, abgerufen
 * 27.09.2026). Hier nur die Summen, damit die Klauseln des Checks nicht im JavaScript dieser offenen Seite stehen
 * (autoAboCheckAusschnitt.ts). Ändert sich `rechnung`, hier nachziehen; Test in src/test/istLeasingHaram.test.ts.
 */
export const IONIQ_JAHR = {
  abo: 12 * 602,
  leasing: 12 * 329 + 4000 / 4 + 12 * 199 + 12 * 54,
  bar: 12 * 560 + 12 * 199 + 12 * 54,
};

const PLATZ1 = etfListe[0];
const DREIER = [
  { name: "Traders Place", logo: "/bilder/blog/halal-etf/logos/traders-place-wortmarke.svg", out: "/out/traders-place" },
  { name: "Smartbroker+", logo: "/bilder/blog/halal-etf/logos/smartbroker.webp", out: "/out/smartbroker" },
  { name: "Scalable Capital", logo: "/bilder/blog/halal-etf/logos/scalable.webp", out: "/out/scalable" },
];
// Sparplan auf Platz 1: Smartbroker+ und Scalable aus sparplanBei der Liste (Scalable PRIME+ zählt als Scalable, Elias SEO42);
// Traders Place nach Elias' eigenem Depot (SEO31 „Sparplan ist drin“, außer Platz 5 und 6, SEO35).
const sparplanPlatz1 = (name: string) => name === "Traders Place" || PLATZ1.sparplanBei.some((s) => s.startsWith(name.split(" ")[0]));
const ANBIETER = DREIER.map((d) => ({
  ...d,
  zeilen: [
    sparplanPlatz1(d.name) ? `Sparplan auf ${PLATZ1.name}` : `Sparplan auf ${PLATZ1.name} noch nicht nachgesehen`,
    `Halal ETFs aus unserer Liste: ${etfsBei(d.name)} von ${etfListe.length}`,
    d.name === "Smartbroker+" ? "Zinsen nur auf eigenem Zinskonto" : "Zinsen aufs Guthaben: 0 %",
  ],
}));

const WICHTIGSTES: { lead: string; text: ReactNode }[] = [
  { lead: "Leasing ist Miete.", text: "Und Miete ist im Islam erlaubt. Es kommt darauf an, was im Vertrag steht." },
  {
    lead: "Die übliche Form fällt fast immer weg.",
    text: "In deutschen Leasingverträgen haftest du für ein Auto, das dir nicht gehört. Damit ist es keine gültige Miete mehr.",
  },
  {
    lead: "Der Zins der Leasingfirma ist beim reinen Leasing nicht dein Problem.",
    text: "Kein Zins heißt aber noch nicht halal. Es zählt, wer haftet und wer die Kosten trägt.",
  },
  {
    lead: "Das Auto-Abo ist die halal Form.",
    text: "Der Anbieter zahlt Versicherung, Steuer und Wartung, du zahlst Rate und Sprit. Rechne mit 50 bis 100 € mehr Rate im Monat.",
  },
  {
    lead: "Keine Rate ist das stärkste Polster.",
    text: "Was du nicht fürs Leasing zahlst, kannst du halal im Depot sparen. Der Rechner zeigt, was daraus geworden wäre.",
  },
];

const FRAGEN: { frage: string; antwort: string }[] = [
  {
    frage: "Ist Auto-Leasing haram?",
    antwort:
      "In der Form, wie Autohäuser in Deutschland es anbieten, fast immer ja. Leasing ist Miete, und Miete ist erlaubt. Die Verträge übertragen aber die Haftung für das Auto auf dich. Wer die Haftung abgibt, hat kein Recht mehr auf die Rate, und der Vertrag wird ungültig.",
  },
  {
    frage: "Ist Leasing ohne Zinsen halal?",
    antwort:
      "Nicht automatisch. Beim reinen Leasing ist der Zins gar nicht das große Problem. Entscheidend ist, wer für das Auto haftet und wer Versicherung, Steuer und Wartung zahlt. Liegt das bei dir, hilft auch null Prozent Zins nicht.",
  },
  {
    frage: "Ist ein Auto-Abo halal?",
    antwort:
      "Das Grundmodell ist die halal Form des Leasings: Der Anbieter zahlt Versicherung, Steuer und Wartung, das Auto läuft auf ihn, du zahlst die Rate und den Sprit. Nicht jedes Auto-Abo ist automatisch halal. Lies im Vertrag nach, wer bei einem Schaden zahlt und was bei Verzug passiert.",
  },
  {
    frage: "Wie viel teurer ist ein Auto-Abo als Leasing?",
    antwort:
      "Die Rate ist höher, dafür zahlst du keine Versicherung, Steuer und Wartung dazu. Rechnet man das gegen, bleiben oft 50 bis 100 € im Monat. In unserem Beispiel mit dem Hyundai IONIQ 5 war das Abo über ein Jahr sogar günstiger als Leasing.",
  },
  {
    frage: "Ist Leasing für Selbstständige und Firmen erlaubt?",
    antwort:
      "Es kann je nach Lage eine Möglichkeit geben, gerade für Gewerbetreibende. Das klärst du aber nur mit einem qualifizierten Gelehrten, der deine Situation und deinen Vertrag kennt.",
  },
  {
    frage: "Darf der Leasinggeber am Ende eine Nachzahlung verlangen?",
    antwort:
      "Nein. Nach dem Ende des Vertrags darf er keine Summe mehr für Wertverlust oder Restwert verlangen. Das Auto ist sein Eigentum, also trägt er auch den Wertverlust.",
  },
  {
    frage: "Die Leasingfirma hat das Auto auf Kredit gekauft. Ist das mein Problem?",
    antwort:
      "Beim reinen Leasing nicht. Wie der Leasinggeber sein Auto finanziert, ist sein Vertrag, nicht deiner. Das gilt für reines Leasing, nicht für Leasing mit Kauf am Ende.",
  },
  {
    frage: "Ich habe schon einen Leasingvertrag. Was jetzt?",
    antwort:
      "Geh die fünf Punkte in deinem Vertrag durch. Frag beim Anbieter, ob eine vorzeitige Rückgabe oder eine Übernahme durch jemand anderen geht und was das kostet. Was das für dich heißt, klärst du mit einem Gelehrten, dem du vertraust, mit dem Vertrag auf dem Tisch.",
  },
];

const PASST_DAZU: { to: string; name: string; text: string }[] = [
  { to: "/blog/ratenzahlung-haram", name: "Ist Ratenzahlung haram?", text: "Wann ein Ratenkauf beim Händler geht." },
  { to: "/blog/auto-kaufen-ohne-zinsen", name: "Auto kaufen ohne Zinsen", text: "Alle Wege zum eigenen Auto." },
  { to: "/blog/ist-versicherung-haram", name: "Ist Versicherung haram?", text: "Warum die Vollkasko kritisch gesehen wird." },
  { to: "/blog/halal-etf", name: "Beste Halal ETFs", text: "Acht Halal ETFs im Vergleich." },
];

const VIDEO = { id: "ukcCjjf7FIY", titel: "So geht Leasing als Muslim (in unter 10 Minuten)", hochgeladen: "2026-04-19" };

/* ------------------------------------------------------------------ */
/* Schema                                                              */
/* ------------------------------------------------------------------ */

const graph = () => {
  const url = `${SITE}${PFAD}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#beitrag`,
        headline: TITEL,
        description: META,
        mainEntityOfPage: url,
        url,
        author: { "@id": `${SITE}/ueber-mich#elias` },
        publisher: { "@id": `${SITE}/#organization` },
        isPartOf: { "@type": "Blog", "@id": `${SITE}/blog#blog`, name: "finanzmuslim Blog", url: `${SITE}/blog` },
        datePublished: VEROEFFENTLICHT.iso,
        dateModified: AKTUALISIERT.iso,
        inLanguage: "de-DE",
        video: { "@id": `${url}#video` },
      },
      {
        "@type": "VideoObject",
        "@id": `${url}#video`,
        name: VIDEO.titel,
        description: "Elias erklärt in unter zehn Minuten, wann Leasing als Muslim geht und warum das Auto-Abo die Alternative ist.",
        thumbnailUrl: `${SITE}/bilder/blog/ist-leasing-haram/video-leasing.webp`,
        uploadDate: VIDEO.hochgeladen,
        embedUrl: `https://www.youtube-nocookie.com/embed/${VIDEO.id}`,
        contentUrl: `https://www.youtube.com/watch?v=${VIDEO.id}`,
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#fragen`,
        mainEntity: FRAGEN.map((f) => ({ "@type": "Question", name: f.frage, acceptedAnswer: { "@type": "Answer", text: f.antwort } })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE}/blog` },
          { "@type": "ListItem", position: 3, name: TITEL, item: url },
        ],
      },
      {
        "@type": "Person",
        "@id": `${SITE}/ueber-mich#elias`,
        name: "Elias El-Gendy",
        jobTitle: "Gründer von finanzmuslim",
        description: BIO,
        url: `${SITE}/ueber-mich`,
        image: `${SITE}/elias-el-gendy.webp`,
        worksFor: { "@id": `${SITE}/#organization` },
        sameAs: PROFILE,
      },
      {
        "@type": "Organization",
        "@id": `${SITE}/#organization`,
        name: "finanzmuslim",
        url: SITE,
        logo: `${SITE}/apple-touch-icon.png`,
        sameAs: [INSTAGRAM, "https://www.tiktok.com/@finanz.muslim", YOUTUBE, LINKEDIN_FIRMA],
      },
    ],
  };
};

/* ------------------------------------------------------------------ */
/* Rechner „Rate oder Polster“ (Karte Station 8a)                      */
/* ------------------------------------------------------------------ */

const LAUFZEITEN = [24, 36, 48];
type Punkt = { x: string; eingezahlt: number; wert: number };

/**
 * Dieselbe Rate jeden Monat als Sparplan auf Platz 1 der Halal-ETF-Liste, die Sonderzahlung einmal am Anfang. Monatskurse wie im
 * Rechner von /blog/halal-etf (letzter Eintrag ist der Kurs vom Stand der Kursdatei), ohne Depotkosten.
 */
export const polster = (rate: number, monate: number, sonder: number) => {
  const reihe = kursFuerIsin(PLATZ1.isin)?.reihe ?? [];
  if (reihe.length < monate || (!rate && !sonder)) return null;
  const teil = reihe.slice(-monate);
  let anteile = sonder / teil[0][1];
  const kurve: Punkt[] = teil.map(([monat, kurs], i) => {
    anteile += rate / kurs;
    return { x: monat, eingezahlt: sonder + (i + 1) * rate, wert: anteile * kurs };
  });
  const ende = kurve[kurve.length - 1];
  return { eingezahlt: ende.eingezahlt, wert: ende.wert, kurve };
};

const zahlAus = (s: string) => Math.min(Math.max(Number(s.replace(/\D/g, "")) || 0, 0), 100_000);

const Feld = ({ id, titel, wert, setzen }: { id: string; titel: string; wert: string; setzen: (s: string) => void }) => (
  <div>
    <label htmlFor={id} className="block">
      <Etikett>{titel}</Etikett>
    </label>
    <div className="mt-1.5 flex items-center border border-border bg-background focus-within:border-foreground">
      <input
        id={id}
        inputMode="numeric"
        value={wert}
        onChange={(x) => setzen(x.target.value.replace(/[^\d.]/g, ""))}
        className="w-full bg-transparent px-3 py-2.5 text-[16px] tabular-nums text-foreground outline-none"
      />
      <span className="pr-3 text-[16px] text-muted-foreground">€</span>
    </div>
  </div>
);

const Rechner = () => {
  const [rateText, setRateText] = useState("300");
  const [sonderText, setSonderText] = useState("0");
  const [monate, setMonate] = useState(36);
  const rate = zahlAus(rateText);
  const sonder = zahlAus(sonderText);
  const erg = polster(rate, monate, sonder);
  const gezahlt = sonder + rate * monate;
  const schalter = (an: boolean) =>
    `flex-1 px-3 py-2.5 text-[15px] font-semibold transition-colors ${an ? "bg-foreground text-background" : "bg-background text-foreground hover:bg-muted"}`;
  const farbe = erg && erg.wert < erg.eingezahlt ? "loss" : "gain";
  return (
    <section className="mt-12">
      <Ueber id="rechner" />
      <Text>
        <p>
          Gib deine Leasingrate ein. Links siehst du, was du beim Leasing zahlst und was dir am Ende gehört. Rechts, was aus derselben Rate geworden
          wäre, wenn du sie jeden Monat in einen Halal ETF gespart hättest, hier in {PLATZ1.name}, Platz 1 unserer{" "}
          <TL to="/blog/halal-etf">Liste der besten Halal ETFs</TL>.
        </p>
      </Text>
      <div className="mt-5 border border-border bg-card p-4 md:p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Feld id="leasing-rate" titel="Rate im Monat" wert={rateText} setzen={setRateText} />
          <Feld id="leasing-sonder" titel="Anzahlung" wert={sonderText} setzen={setSonderText} />
        </div>
        <Etikett className="mt-4">Laufzeit</Etikett>
        <div className="mt-1.5 flex border border-border" role="group" aria-label="Laufzeit in Monaten">
          {LAUFZEITEN.map((m, i) => (
            <button
              key={m}
              type="button"
              aria-pressed={monate === m}
              onClick={() => setMonate(m)}
              className={`${i ? "border-l border-border " : ""}${schalter(monate === m)}`}
            >
              {m} Monate
            </button>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2" aria-live="polite">
          <div className="min-w-0 border border-border bg-background px-3 py-3 sm:px-4 sm:py-4">
            <Etikett>Leasing</Etikett>
            <p className="mt-1.5 text-[13px] text-muted-foreground sm:text-[14px]">Du zahlst</p>
            <p className="text-[18px] font-semibold tabular-nums text-foreground sm:text-[24px]">{euro(gezahlt)}</p>
            <p className="mt-2 text-[13px] text-muted-foreground sm:text-[14px]">Am Ende gehört dir</p>
            <p className="text-[18px] font-semibold tabular-nums text-loss sm:text-[24px]">0 €</p>
            <p className="mt-2 text-[13px] leading-snug text-muted-foreground">Das Auto geht zurück. Versicherung, Steuer und Wartung kommen oben drauf.</p>
          </div>
          <div className="min-w-0 border border-foreground bg-background px-3 py-3 shadow-[inset_0_0_0_1px_hsl(var(--foreground))] sm:px-4 sm:py-4">
            <Etikett>Im Depot gespart</Etikett>
            <p className="mt-1.5 text-[13px] text-muted-foreground sm:text-[14px]">Du zahlst ein</p>
            <p className="text-[18px] font-semibold tabular-nums text-foreground sm:text-[24px]">{euro(gezahlt)}</p>
            <p className="mt-2 text-[13px] text-muted-foreground sm:text-[14px]">Heute wert</p>
            <p className={`text-[18px] font-semibold tabular-nums sm:text-[24px] ${farbe === "loss" ? "text-loss" : "text-gain"}`}>{erg ? euro(erg.wert) : "–"}</p>
            <p className="mt-2 text-[13px] leading-snug text-muted-foreground">
              Gestartet vor {monate / 12} Jahren, das Geld gehört dir.
            </p>
          </div>
        </div>

        {erg && (
          <div className="mt-5 border border-border bg-background px-2 pb-2 pt-3 sm:px-3">
            <div className="flex flex-wrap gap-x-5 gap-y-1 px-1 text-[13px] text-muted-foreground" aria-hidden>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/70" /> Eingezahlt
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className={`h-2.5 w-2.5 rounded-full ${farbe === "gain" ? "bg-gain" : "bg-loss"}`} /> Wert im Depot
              </span>
            </div>
            <div className="mt-2 h-[180px] sm:h-[220px]" role="img" aria-label={`Eingezahlt ${euro(erg.eingezahlt)}, heute wert ${euro(erg.wert)}`}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={erg.kurve.map((p) => ({ ...p, wert: Math.round(p.wert) }))} margin={{ top: 6, right: 8, bottom: 0, left: 0 }}>
                  <CartesianGrid stroke="hsl(var(--border))" vertical={false} />
                  <XAxis
                    dataKey="x"
                    ticks={erg.kurve.filter((d) => d.x.endsWith("-01")).map((d) => d.x)}
                    interval={0}
                    tickFormatter={(x: string) => x.slice(0, 4)}
                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    width={50}
                    tickFormatter={(v: number) => (v >= 10_000 ? `${Math.round(v / 1000)} Tsd.` : Math.round(v).toLocaleString("de-DE"))}
                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={false}
                    tickLine={false}
                    domain={[0, "auto"]}
                  />
                  <Tooltip formatter={(v: number, n: string) => [euro(v), n === "wert" ? "Wert im Depot" : "Eingezahlt"]} contentStyle={{ fontSize: 13, borderRadius: 4 }} />
                  <Area type="monotone" dataKey="eingezahlt" stroke="hsl(var(--muted-foreground))" fill="hsl(var(--muted))" strokeWidth={1.5} isAnimationActive={false} />
                  <Area type="monotone" dataKey="wert" stroke={`hsl(var(--${farbe}))`} fill={`hsl(var(--${farbe}-soft))`} fillOpacity={0.7} strokeWidth={2} isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        <p className="mt-4 text-[13px] leading-relaxed text-muted-foreground">
          Monatskurse von {PLATZ1.name} bis {kursStand} (Yahoo Finance), ohne Depotkosten. Ein Beispiel, keine Empfehlung: Das Auto brauchst du
          trotzdem. Der Rechner zeigt, was eine Rate wert ist, die du nicht fürs Leasing ausgibst, etwa weil du einen bezahlten Gebrauchten fährst.
          Vergangene Kursentwicklung ist kein Versprechen.
        </p>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Seite                                                               */
/* ------------------------------------------------------------------ */

const IstLeasingHaram = () => {
  const [offen, setOffen] = useState(false);
  const ids = useMemo(() => LEISTE.map((a) => a.id), []);
  const aktiv = useAktiv(ids);

  const inhalt = (
    <ol>
      {LEISTE.map((a) => (
        <li key={a.id}>
          <a
            href={`#${a.id}`}
            className={`block border-l py-[7px] pl-3 text-[15px] leading-snug transition-colors hover:text-primary ${
              aktiv === a.id ? "border-primary text-primary" : "border-transparent text-foreground/70"
            }`}
          >
            {a.kurz ?? a.titel}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <main className="bg-background">
      <Seo title={`${TITEL} | finanzmuslim`} description={META} path={PFAD} jsonLd={graph()} />
      <div className="container py-8 md:py-12">
        <div className="mx-auto max-w-[720px] xl:grid xl:max-w-[1048px] xl:grid-cols-[280px_minmax(0,720px)] xl:gap-12">
          <aside className="hidden xl:block" aria-label="Inhaltsverzeichnis">
            <div className="sticky top-24">
              <Etikett className="border-t border-border pt-4">Auf dieser Seite</Etikett>
              <div className="mt-3">{inhalt}</div>
              <div className="mt-6 border border-border bg-card p-5">
                <Etikett className="text-primary">Polster statt Rate</Etikett>
                <p className="font-titel mt-2.5 text-[21px] leading-[1.2] text-foreground">Deine Rate halal anlegen?</p>
                <p className="mt-2.5 text-[14px] leading-relaxed text-foreground/75">
                  Ein Sparplan auf einen Halal ETF ist eine Rate, die dir am Ende gehört. Im Vergleich siehst du, welches Depot dafür passt und keine Zinsen
                  aufs Guthaben zahlt.
                </p>
                <Link to="/vergleich/depot" className="leuchtlinie mt-5 inline-block">
                  <span className="block bg-foreground px-5 py-3 font-mono text-[13px] uppercase tracking-[0.12em] text-background">{KNOPF}</span>
                </Link>
              </div>
            </div>
          </aside>

          <div className="min-w-0">
            <nav aria-label="Brotkrumen" className="flex flex-wrap items-center gap-2 font-mono text-[12px] uppercase tracking-[0.12em] text-muted-foreground">
              <Link to="/blog" className="text-primary hover:underline">
                Blog
              </Link>
              <span aria-hidden>/</span>
              <span>Ist Leasing haram?</span>
            </nav>

            <article className="mt-8">
              <h1 className="font-titel mt-3 text-[32px] leading-[1.1] text-foreground md:text-[42px]">
                <span className="block">Ist Leasing haram?</span> <span className="block">Wann Leasing halal ist: 5 Punkte</span>
              </h1>
              <p className="mt-4 max-w-[600px] text-[18px] leading-[1.5] text-foreground/75">
                Woran du es im Vertrag erkennst, was stattdessen geht und was deine Rate im Depot gebracht hätte.
              </p>
              <ul data-vorlage="haken" className="mt-5 flex flex-wrap gap-2">
                {["5 Punkte im Vertrag", "5 Wege zum Auto im Vergleich", "Rechner: Rate oder Polster", "Stand November 2026"].map((h) => (
                  <li key={h} className="inline-flex min-h-[34px] items-center gap-1.5 border border-border bg-muted/50 px-3 text-[14px] text-foreground/85">
                    <Check className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                    {h}
                  </li>
                ))}
              </ul>
              <div data-vorlage="autorzeile" className="mt-6 flex items-start justify-between gap-4 border-b border-border pb-6">
                <div className="flex gap-3">
                  <img src={eliasPortrait} alt="Elias El-Gendy" width={48} height={48} className="h-12 w-12 shrink-0 object-cover" />
                  <div className="leading-snug">
                    <a href={LINKEDIN} rel="author noopener noreferrer" target="_blank" className="text-[15px] font-semibold text-foreground underline underline-offset-[3px] hover:text-primary">
                      Elias El-Gendy
                    </a>
                    <p className="mt-0.5 font-mono text-[12px] text-muted-foreground">{LESEZEIT} Min. Lesezeit</p>
                    <p className="mt-2 text-[14px] text-foreground/75">Gründer von finanzmuslim</p>
                  </div>
                </div>
                <div className="text-right font-mono text-[12px] leading-relaxed text-muted-foreground">
                  <p className="uppercase tracking-[0.12em]">Aktualisiert</p>
                  <time dateTime={AKTUALISIERT.iso}>{AKTUALISIERT.text}</time>
                </div>
              </div>

              {/* Kurzer Vergleich wie /blog/halal-gold-kaufen: die fünf Wege zum Auto als Karten */}
              <KartenReihe etikett="Kurzer Vergleich" titel="5 Wege zum Auto auf einen Blick" anzahl={WEGE.length}>
                {WEGE.map((w, i) => (
                  <Karte key={w.weg} nummer={i + 1} kopf={w.weg} erste={i === 0}>
                    <Marke ton={w.ton}>{w.marke}</Marke>
                    <Etikett className="mt-4">Besonders</Etikett>
                    <p className="font-titel mt-1.5 min-h-[2.4em] text-[19px] leading-[1.2] text-foreground">{w.besonders}</p>
                    <Etikett className="mt-4">Du zahlst</Etikett>
                    <p className="mt-1 text-[15px] leading-snug text-foreground">{w.zahlst}</p>
                    <Etikett className="mt-3">Am Ende</Etikett>
                    <p className="mt-1 text-[15px] font-semibold leading-snug text-foreground">{w.ende}</p>
                    <a
                      href={`#${w.ziel}`}
                      className="mb-4 mt-5 flex min-h-[44px] items-center justify-center gap-1.5 border border-border bg-muted/60 py-2.5 font-mono text-[12px] uppercase tracking-[0.12em] text-foreground transition-colors hover:border-foreground sm:mt-auto"
                    >
                      Zum Abschnitt
                      <ArrowDown className="h-3.5 w-3.5" aria-hidden />
                    </a>
                  </Karte>
                ))}
              </KartenReihe>

              <nav aria-label="Auf dieser Seite" className="mt-7 border-y border-border xl:hidden">
                <button
                  type="button"
                  onClick={() => setOffen((v) => !v)}
                  aria-expanded={offen}
                  className="flex min-h-[48px] w-full items-center justify-between font-mono text-[12px] uppercase tracking-[0.14em] text-foreground"
                >
                  Auf dieser Seite
                  <ChevronDown className={`h-4 w-4 transition-transform ${offen ? "rotate-180" : ""}`} aria-hidden />
                </button>
                {offen && <div className="pb-3">{inhalt}</div>}
              </nav>

              {/* Einstieg als kleine Szene wie frontal („Imagine …“), die Antwort in den ersten 100 Wörtern */}
              <div className="mt-8">
                <Text>
                  <p>
                    Das Autohaus legt dir ein Angebot hin: neues Auto, 299 € im Monat, keine Anzahlung. Klingt fair. Aber darfst du das als Muslim
                    unterschreiben?
                  </p>
                  <p>
                    Kurz gesagt: Leasing ist Miete, und Miete ist erlaubt. Die Verträge deutscher Autohäuser fallen aber fast immer durch, weil du darin
                    für ein Auto haftest, das dir nicht gehört. Der halal Weg ist meist ein Auto-Abo oder ein bezahlter Gebrauchter. Dieser Beitrag ist für
                    dich, wenn du gerade ein Auto suchst oder schon least.
                  </p>
                </Text>

                <section className="mt-10 border-l-2 border-primary bg-muted px-5 py-6 md:px-8 md:py-7">
                  <Ueber id="das-wichtigste" />
                  <ul className="mt-5 space-y-3.5 text-[16px] leading-[1.6] text-foreground/75">
                    {WICHTIGSTES.map((w) => (
                      <li key={w.lead} className="flex gap-3">
                        <span className="mt-[10px] h-1.5 w-1.5 shrink-0 bg-primary" aria-hidden />
                        <span>
                          <strong className="font-semibold text-foreground">{w.lead}</strong> {w.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="mt-14">
                  <Ueber id="fuenf-punkte" />
                  <Text>
                    <p>Nimm deinen Vertrag und geh diese fünf Punkte durch. Steht bei einem Punkt die rechte Spalte drin, fällt der Vertrag durch.</p>
                  </Text>
                  <Tabelle
                    kopf={[{ titel: "Punkt" }, { titel: "In Ordnung", text: true }, { titel: "Problem", text: true }]}
                    zeilen={PUNKTE.map((p) => ({
                      schluessel: p.punkt,
                      name: <span className="block max-w-[130px] whitespace-normal sm:max-w-[200px]">{p.punkt}</span>,
                      zellen: [p.gut, p.schlecht],
                    }))}
                    quelle="Einordnung nach den Positionen weiter unten im Beitrag. Maßgeblich ist der Wortlaut deines Vertrags."
                  />
                  <Kernsatz>Wem das Auto gehört, der trägt sein Risiko. Schiebt der Vertrag es dir zu, ist es keine Miete mehr.</Kernsatz>
                  <GoogleKasten />
                </section>

                <section className="mt-14">
                  <Ueber id="warum" />
                  <Text>
                    <p>
                      Leasing ist das englische Wort für Miete. Im Deutschen steht es für die Miete eines Autos: Jemandem gehört das Auto, du zahlst dafür,
                      es zu nutzen.
                    </p>
                    <p>
                      Bei einer Miete im Islam kaufst du die Nutzung, das Auto bleibt Eigentum des Vermieters. Darum haftet er dafür. Die Haftung darf er
                      nicht auf dich übertragen. Nur wenn du einen Schaden mit Absicht oder grob fahrlässig verursachst, zahlst du selbst.
                    </p>
                    <p>
                      Genau hier fallen die deutschen Verträge durch. Ein Gelehrter, der Leasingverträge von Mercedes, BMW, Audi, VW und Sixt gelesen hat,
                      fand keinen einzigen ohne die Klausel, dass du für das Auto haftest. Wer die Haftung abgibt, verliert sein Recht auf die Rate. Der
                      Vertrag wird ungültig.
                    </p>
                    <p>
                      Dazu kommt ein zweiter Punkt: Du bekommst das Auto nicht fahrbereit. Du meldest es an, zahlst Steuer und Versicherung, musst eine
                      Vollkasko abschließen und die Wartung bezahlen. Das alles wäre Sache des Vermieters.
                    </p>
                  </Text>
                  <KartenTabelle
                    kopf={["Frage", "Antwort"]}
                    zeilen={[
                      {
                        schluessel: "zins",
                        werte: ["Und der Zins der Leasingfirma?", "Beim reinen Leasing nicht dein Problem. Hat die Firma das Auto auf Kredit gekauft, ist das ihr Vertrag, nicht deiner."],
                      },
                      {
                        schluessel: "ohne-zins",
                        werte: ["Also ist Leasing ohne Zins halal?", "Nein. Kein Zins heißt nicht halal. Es zählen Haftung und Kosten."],
                      },
                      {
                        schluessel: "hersteller",
                        werte: ["Sind Hersteller besser als Leasingfirmen?", "Die Verträge der Hersteller sind oft fairer. Die Klausel zur Haftung steht trotzdem drin."],
                      },
                    ]}
                  />
                  <Video id={VIDEO.id} titel={VIDEO.titel} bild="/bilder/blog/ist-leasing-haram/video-leasing.webp" />
                </section>

                <Rechner />

                <AnbieterKasten titel="Depots für dein Polster" anbieter={ANBIETER} />

                <section className="mt-14">
                  <Ueber id="auto-abo" />
                  <Text>
                    <p>
                      Ja, vom Aufbau her ist das Auto-Abo die halal Form des Leasings. Das Auto ist auf den Anbieter angemeldet. Er zahlt Versicherung, Steuer,
                      Wartung und Reparaturen. Du zahlst die Rate und den Sprit oder Strom.
                    </p>
                  </Text>
                  <KartenTabelle
                    kopf={["Kosten", "Wer zahlt im Auto-Abo"]}
                    zeilen={[
                      { schluessel: "fix", werte: ["Versicherung, Steuer, Wartung, Reparaturen", "Der Anbieter, eingerechnet in deine Rate"] },
                      { schluessel: "sprit", werte: ["Sprit oder Strom", "Du, das ist deine Nutzung"] },
                      { schluessel: "schaden", werte: ["Schaden mit Absicht oder grob fahrlässig", "Du, weil du ihn verursacht hast"] },
                    ]}
                  />
                  <Text>
                    <p>
                      Nicht jedes Auto-Abo ist automatisch halal. Lies vor der Unterschrift Punkt 1 und Punkt 3 aus der Tabelle oben nach: Wer zahlt bei
                      einem Schaden, den du nicht verursacht hast, und was kostet es, wenn du zu spät zahlst?
                    </p>
                  </Text>
                  <p className="font-titel mt-10 text-[21px] leading-tight text-foreground">Ein echtes Beispiel: ein Jahr mit demselben Auto</p>
                  <Text>
                    <p>
                      Die Abo-Rate ist höher als die Leasingrate. Rechnet man Versicherung, Steuer und Werkstatt dazu, dreht sich das Bild. Wir haben es für
                      den Hyundai IONIQ 5 nachgerechnet.
                    </p>
                  </Text>
                  <Tabelle
                    kopf={[{ titel: "Weg" }, { titel: "Ein Jahr", rechts: true }, { titel: "Drin", text: true }]}
                    zeilen={[
                      { schluessel: "abo", name: "Auto-Abo", unter: <Marke ton="gruen">geht mit Prüfung</Marke>, zellen: [euro(IONIQ_JAHR.abo), "12 Raten zu 602 €, alles drin außer Strom"] },
                      {
                        schluessel: "leasing",
                        name: "Leasing",
                        unter: <Marke ton="rot">fällt weg</Marke>,
                        zellen: [euro(IONIQ_JAHR.leasing), "12 Raten zu 329 €, ein Viertel der Sonderzahlung, Versicherung, Steuer, Werkstatt"],
                      },
                      { schluessel: "bar", name: "Bar kaufen", unter: <Marke ton="gruen">klar erlaubt</Marke>, zellen: [euro(IONIQ_JAHR.bar), "Wertverlust, Versicherung, Steuer, Werkstatt"] },
                    ]}
                    quelle="Abo: MOCEAN, 12 Monate, 1.000 km im Monat. Leasing: Beispiel der Hyundai Finance, 48 Monate. Laufende Kosten und Wertverlust: ADAC Autokosten, 10.000 km im Jahr. Abgerufen am 27.09.2026. Strom ist bei allen drei gleich und fehlt."
                  />
                  <Text>
                    <p>
                      In diesem Beispiel ist das Abo im Jahr {euro(IONIQ_JAHR.leasing - IONIQ_JAHR.abo)} günstiger als Leasing. Wer ein Auto viele Jahre
                      fährt, kann mit dem Barkauf vorne liegen. Was {ANZAHL_ANBIETER} Abo-Anbieter in ihren Bedingungen zu Haftung und Verzug schreiben,
                      haben wir im <TL to="/vorlagen/auto-abo-check">Auto-Abo-Check</TL> gesammelt.
                    </p>
                  </Text>
                </section>

                <AutorAufruf
                  bild={eliasPortrait}
                  etikett="In die Praxis"
                  titel="Eine Rate, die dir gehört"
                  text="Beim Leasing ist die Rate am Ende weg. Ein Sparplan auf einen Halal ETF ist auch eine Rate, nur dass das Geld dir bleibt. Im Vergleich siehst du, welches Depot dafür passt und keine Zinsen aufs Guthaben zahlt."
                  ziel="/vergleich/depot"
                  knopf={KNOPF}
                />

                <section className="mt-14">
                  <Ueber id="restwert" />
                  <KartenTabelle
                    kopf={["Was", "Wie es aussieht"]}
                    zeilen={[
                      {
                        schluessel: "restwert",
                        werte: [
                          <>
                            <Marke ton="rot">fällt weg</Marke>
                            <span className="mt-1.5 block">Nachzahlung für den Restwert</span>
                          </>,
                          "Ist das Auto am Ende weniger wert als geplant, sollst du die Differenz zahlen. Nach dem Ende des Vertrags darf der Leasinggeber aber keine Summe mehr verlangen: Das Auto ist sein Eigentum, den Wertverlust trägt er.",
                        ],
                      },
                      {
                        schluessel: "ballon",
                        werte: [
                          <>
                            <Marke ton="rot">fällt weg</Marke>
                            <span className="mt-1.5 block">Ballonfinanzierung</span>
                          </>,
                          "Anzahlung, kleine Raten, am Ende eine große Ablösesumme. Das ist kein Leasing, sondern ein Kredit. Ein Auto über eine Bank zu finanzieren, ob über deine Bank oder die Bank des Herstellers, ist haram.",
                        ],
                      },
                      {
                        schluessel: "kauf",
                        werte: [
                          <>
                            <Marke ton="gelb">je nach Vertrag</Marke>
                            <span className="mt-1.5 block">Leasing mit Kauf am Ende</span>
                          </>,
                          "Hier wirst du am Ende Eigentümer. Läuft der Kauf über eine Bank, ist es eine Finanzierung mit Zins. Verkauft dir der Händler selbst auf Raten zu einem festen Preis, gilt der Ratenkauf unten.",
                        ],
                      },
                    ]}
                  />
                </section>

                <section className="mt-14">
                  <Ueber id="ohne-leasing" />
                  <Text>
                    <p>
                      <strong className="font-semibold text-foreground">Gebraucht bar kaufen.</strong> Kaufen ist Handel, und Handel ist erlaubt. Ein
                      bezahltes Auto gehört dir, es gibt keine Rate und keine Klausel, die dich an eine fremde Haftung bindet.
                    </p>
                    <p>
                      <strong className="font-semibold text-foreground">Ratenkauf direkt beim Händler.</strong> Der Händler darf für Raten einen höheren
                      Preis verlangen als bar, wenn dieser Preis vor der Unterschrift feststeht. Zum Beispiel 10.000 € bar oder 12.000 € in Raten. Danach
                      ändert sich nichts mehr. Mehr dazu in <TL to="/blog/ratenzahlung-haram">Ist Ratenzahlung haram?</TL>
                    </p>
                    <p>
                      <strong className="font-semibold text-foreground">Erst sparen, dann kaufen.</strong> Wer die Rate ein paar Jahre zur Seite legt, hat
                      den Preis eines guten Gebrauchten zusammen. Was das im Depot bringt, zeigt der <a href="#rechner" className="font-medium text-primary underline underline-offset-2 hover:no-underline">Rechner oben</a>.
                    </p>
                  </Text>
                </section>

                <section className="mt-14">
                  <Ueber id="schon-geleast" />
                  <Text>
                    <p>
                      Geh die fünf Punkte in deinem Vertrag durch. Frag beim Anbieter, ob eine vorzeitige Rückgabe oder eine Übernahme durch jemand anderen
                      geht und was das kostet.
                    </p>
                    <p>
                      Was das für dich heißt, klärst du mit einem Gelehrten, dem du vertraust, mit dem Vertrag auf dem Tisch. Das gilt auch, wenn du
                      selbstständig bist: Für Gewerbetreibende kann es je nach Lage eine Möglichkeit geben, aber nur nach Rücksprache mit einem
                      qualifizierten Gelehrten.
                    </p>
                  </Text>
                </section>

                <section className="mt-12">
                  <Ueber id="haeufige-fragen" />
                  <div className="mt-4 max-w-[664px] divide-y divide-border">
                    {FRAGEN.map((f) => (
                      <div key={f.frage} className="py-5 first:pt-1">
                        <h3 className="text-[18px] font-semibold leading-snug text-foreground">{f.frage}</h3>
                        <p className="mt-2 text-[17px] leading-[1.65] text-foreground/75">{f.antwort}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="mt-12">
                  <Ueber id="naechster-schritt" />
                  <Text>
                    <p>
                      Brauchst du nicht sofort ein neues Auto, ist die Rate dein Polster. Leg sie als Sparplan auf einen Halal ETF an. Welches Depot das kann
                      und keine Zinsen aufs Guthaben zahlt, siehst du im <TL to="/vergleich/depot">Depot-Vergleich</TL>.
                    </p>
                  </Text>
                </section>

                <AnbieterKasten titel="Depots für dein Polster" anbieter={ANBIETER} />

                <aside className="mt-12 border border-border p-5 md:p-6" aria-labelledby="ueber-den-autor">
                  <Etikett>
                    <span id="ueber-den-autor">Über den Autor</span>
                  </Etikett>
                  <div className="mt-3 flex flex-col gap-4 sm:flex-row">
                    <img src={eliasPortrait} alt="Elias El-Gendy" width={72} height={72} loading="lazy" className="h-[72px] w-[72px] shrink-0 object-cover" />
                    <div>
                      <p className="text-[17px] font-semibold text-foreground">
                        <Link to="/ueber-mich" className="hover:text-primary">
                          Elias El-Gendy
                        </Link>
                      </p>
                      <p className="mt-1 text-[15px] leading-relaxed text-foreground/75">{BIO}</p>
                      <p className="mt-1 flex flex-wrap gap-x-5 text-[15px] [&>a]:inline-flex [&>a]:min-h-[44px] [&>a]:items-center">
                        <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">
                          LinkedIn
                        </a>
                        <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">
                          Instagram
                        </a>
                        <a href={YOUTUBE} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">
                          YouTube
                        </a>
                      </p>
                    </div>
                  </div>
                </aside>

                <aside className="mt-10" aria-labelledby="passt-dazu">
                  <p id="passt-dazu" className="font-titel text-[22px] text-foreground">
                    Passt dazu
                  </p>
                  <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                    {PASST_DAZU.map((p) => (
                      <li key={p.to}>
                        <Link to={p.to} className="block h-full border border-border p-4 transition-colors hover:border-primary">
                          <span className="block text-[16px] font-semibold text-foreground">{p.name}</span>
                          <span className="mt-1 block text-[14px] text-muted-foreground">{p.text}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </aside>

                <footer className="mt-8">
                  <p className="text-[13px] leading-relaxed text-muted-foreground">
                    * Werbung: Eröffnest du über meinen Link ein Depot, bekomme ich eine Provision, ohne Mehrkosten für dich.
                  </p>
                  <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">{RECHTSHINWEIS}</p>
                </footer>
              </div>
            </article>
          </div>
        </div>
      </div>
    </main>
  );
};

export default IstLeasingHaram;
