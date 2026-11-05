import { useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, Check, ChevronDown, X } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Seo from "@/components/Seo";
import eliasPortrait from "@/assets/elias-autor.webp";
import { kursStand } from "@/lib/kurse";
import { PLATZ1, polster, zahlAus } from "@/lib/polster";
import { etfListe, etfsBei } from "@/data/halalEtfListe";
import { ANZAHL_ANBIETER } from "@/data/autoAboCheckAusschnitt";
import {
  AnbieterKasten,
  AutorAufruf,
  BIO,
  Etikett,
  euro,
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
  Seitenleiste,
  SITE,
  Tauschbild,
  Text,
  TL,
  useAktiv,
  Video,
  YOUTUBE,
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
/** Title-Tag unter 65 Zeichen mit „| finanzmuslim“, damit Google ihn nicht abschneidet; H1 bleibt TITEL. */
const SEO_TITEL = "Ist Leasing haram? Wann es halal ist: 5 Punkte";
const META =
  "Ist Leasing haram? Fast immer ja, wegen einer Klausel im Vertrag. Die 5 Punkte zum Prüfen, das Auto-Abo als halal Weg und ein Rechner: Leasingrate oder Depot.";
const VEROEFFENTLICHT = { text: "16.08.2026", iso: "2026-08-16T09:00:00+02:00" };
const AKTUALISIERT = { text: "05.11.2026", iso: "2026-11-05T09:00:00+01:00" };
const LESEZEIT = 8;
const RECHTSHINWEIS =
  "Dieser Beitrag ist keine Fatwa und keine Anlageberatung. Zu einzelnen Punkten gibt es abweichende Auffassungen, maßgeblich ist dein eigener Vertrag. Vergangene Kursentwicklung ist kein Versprechen für die Zukunft.";

/** Der Knopf aller Aufrufe, gleich im Kopf (SiteHeader.tsx, KOPF_ZIEL), in der Seitenleiste und im Aufruf mit Foto. */
const KNOPF = "Rate halal anlegen";

type Abschnitt = { id: string; titel: string; leiste?: boolean; kurz?: string };
const ABSCHNITTE: Abschnitt[] = [
  { id: "das-wichtigste", titel: "Das Wichtigste", leiste: true },
  /** Überschrift der Karten-Reihe (bausteine KartenReihe, id kurzer-vergleich), darum nur im Inhaltsverzeichnis. */
  { id: "kurzer-vergleich", titel: "5 Wege zum Auto auf einen Blick", leiste: true, kurz: "5 Wege zum Auto" },
  { id: "fuenf-punkte", titel: "Woran erkennst du, ob ein Leasingvertrag halal ist?", leiste: true, kurz: "Die 5 Punkte im Vertrag" },
  { id: "rechner", titel: "Leasingrate oder Depot: Was wäre aus deiner Rate geworden?", leiste: true, kurz: "Rechner: Rate oder Depot" },
  { id: "warum", titel: "Warum ist Leasing in Deutschland fast immer haram?", leiste: true, kurz: "Warum fast immer haram" },
  { id: "auto-abo", titel: "Ist ein Auto-Abo halal?", leiste: true, kurz: "Auto-Abo" },
  { id: "kosten", titel: "Was kostet ein Auto-Abo im Vergleich zu Leasing?", leiste: true, kurz: "Kosten: Abo oder Leasing" },
  { id: "restwert", titel: "Was ist mit Restwert, Kauf am Ende und Ballonfinanzierung?", leiste: true, kurz: "Restwert und Ballonrate" },
  { id: "ohne-leasing", titel: "Wie kommst du ohne Leasing an ein Auto?", leiste: true, kurz: "Ohne Leasing zum Auto" },
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
const WEGE: { weg: string; marke: string; ton: Ton; besonders: string; zahlst: string; haken: string; passt: string; ende: string; ziel: string }[] = [
  {
    weg: "Auto-Abo",
    marke: "geht mit Prüfung",
    ton: "gruen",
    besonders: "Die halal Form des Leasings",
    zahlst: "eine Rate, Versicherung, Steuer und Wartung sind drin",
    haken: "Die Rate ist höher als beim Leasing",
    passt: "Wer neu fahren und nichts selbst regeln will",
    ende: "Das Auto geht zurück",
    ziel: "auto-abo",
  },
  {
    weg: "Gebraucht bar kaufen",
    marke: "klar erlaubt",
    ton: "gruen",
    besonders: "Keine Rate, kein Vertrag mit Haken",
    zahlst: "einmal den Kaufpreis",
    haken: "Du brauchst den ganzen Preis auf einmal",
    passt: "Wer gespart hat und lange fährt",
    ende: "Das Auto gehört dir",
    ziel: "ohne-leasing",
  },
  {
    weg: "Ratenkauf beim Händler",
    marke: "geht mit Prüfung",
    ton: "gruen",
    besonders: "Fester Preis, keine Bank dazwischen",
    zahlst: "feste Raten, der Preis steht vorher fest",
    haken: "Der Preis ist höher als bar",
    passt: "Wer nicht alles auf einmal zahlen kann",
    ende: "Das Auto gehört dir",
    ziel: "ohne-leasing",
  },
  {
    weg: "Leasing vom Autohaus",
    marke: "fällt weg",
    ton: "rot",
    besonders: "Kleine Rate, neues Auto",
    zahlst: "Rate, dazu Versicherung, Steuer und Wartung",
    haken: "Du haftest für ein fremdes Auto",
    passt: "Nur im Einzelfall, mit einem Gelehrten klären",
    ende: "Das Auto geht zurück",
    ziel: "warum",
  },
  {
    weg: "Autokredit oder Ballonrate",
    marke: "fällt weg",
    ton: "rot",
    besonders: "Kleine Raten, das Auto wird deins",
    zahlst: "Raten an die Bank, oft eine große Schlussrate",
    haken: "Ein Kredit mit Zins bei einer Bank",
    passt: "Keinen, der halal bleiben will",
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

/** Raten des Hyundai IONIQ 5 (63 kWh) wie im Auto-Abo-Check (src/data/autoAboCheck.ts), abgerufen 05.11.2026. */
export const IONIQ = { abo: 602, leasing: 399, anzahlung: 4000 };

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
  { lead: "Leasing ist Miete.", text: "Miete ist im Islam erlaubt, es kommt auf den Vertrag an." },
  { lead: "Die übliche Form fällt fast immer weg.", text: "In deutschen Verträgen haftest du für ein Auto, das dir nicht gehört." },
  { lead: "Kein Zins heißt noch nicht halal.", text: "Es zählt, wer haftet und wer Versicherung, Steuer und Wartung zahlt." },
  { lead: "Das Auto-Abo ist vom Aufbau her die halal Form.", text: "Der Anbieter zahlt die Nebenkosten. Dafür zahlst du unterm Strich etwa 50 bis 100 € mehr im Monat." },
  { lead: "Jede Rate, die du nicht zahlst, kann wachsen.", text: "Der Rechner weiter unten zeigt, wie viel im Depot daraus geworden wäre." },
];

const FRAGEN: { frage: string; antwort: string }[] = [
  {
    frage: "Ist Auto-Leasing haram?",
    antwort:
      "Fast immer ja, so wie Autohäuser in Deutschland es anbieten. Leasing ist Miete und damit erlaubt, aber die Verträge schieben die Haftung auf dich. Damit wird der Vertrag ungültig.",
  },
  {
    frage: "Ist Leasing ohne Zinsen halal?",
    antwort:
      "Nicht automatisch. Beim reinen Leasing ist der Zins gar nicht das große Problem. Es zählt, wer für das Auto haftet und wer Versicherung, Steuer und Wartung zahlt.",
  },
  {
    frage: "Ist ein Auto-Abo halal?",
    antwort:
      "Vom Aufbau her ja: Der Anbieter zahlt Versicherung, Steuer und Wartung, du die Rate und den Sprit. Nicht jedes Auto-Abo ist automatisch halal, lies nach, wer bei einem Schaden zahlt.",
  },
  {
    frage: "Wie viel teurer ist ein Auto-Abo als Leasing?",
    antwort:
      "Die Rate ist deutlich höher, weil Versicherung, Steuer und Wartung schon drin sind. Rechnest du diese Kosten beim Leasing dazu, zahlst du für das Abo etwa 50 bis 100 € mehr im Monat.",
  },
  {
    frage: "Ist Leasing für Selbstständige und Firmen erlaubt?",
    antwort:
      "Für Gewerbetreibende kann es je nach Lage eine Möglichkeit geben. Das klärst du aber nur mit einem qualifizierten Gelehrten, der deine Situation und deinen Vertrag kennt.",
  },
  {
    frage: "Darf der Leasinggeber am Ende eine Nachzahlung verlangen?",
    antwort:
      "Nein. Nach dem Ende des Vertrags darf er keine Summe mehr für Wertverlust oder Restwert verlangen, denn das Auto ist sein Eigentum.",
  },
  {
    frage: "Die Leasingfirma hat das Auto auf Kredit gekauft. Ist das mein Problem?",
    antwort:
      "Beim reinen Leasing nicht. Wie der Leasinggeber sein Auto finanziert, ist sein Vertrag, nicht deiner. Das gilt nicht für Leasing mit Kauf am Ende.",
  },
  {
    frage: "Ich habe schon einen Leasingvertrag. Was jetzt?",
    antwort:
      "Geh die fünf Punkte in deinem Vertrag durch und frag nach einer vorzeitigen Rückgabe. Was das für dich heißt, klärst du mit einem Gelehrten, dem du vertraust.",
  },
];

const PASST_DAZU: { to: string; name: string; text: string }[] = [
  { to: "/vorlagen/auto-abo-check", name: "Auto-Abo-Check", text: `Was ${ANZAHL_ANBIETER} Abo-Anbieter zu Haftung und Verzug schreiben.` },
  { to: "/blog/ratenzahlung-haram", name: "Ist Ratenzahlung haram?", text: "Wann ein Ratenkauf beim Händler geht." },
  { to: "/blog/auto-kaufen-ohne-zinsen", name: "Auto kaufen ohne Zinsen", text: "Alle Wege zum eigenen Auto." },
  { to: "/blog/ist-versicherung-haram", name: "Sind Versicherungen haram?", text: "Warum die Vollkasko nie ein Notfall ist." },
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
        image: `${SITE}/og/blog--ist-leasing-haram.jpg`,
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
/* Rechner „Leasingrate oder Depot“ (Karte Station 8a)                      */
/* ------------------------------------------------------------------ */

const LAUFZEITEN = [24, 36, 48];
export { polster };

/** Die Zahl im Einstieg: 300 € Rate, 36 Monate, keine Anzahlung (Elias SEO54: „oben … zum Depotvergleich“). */
const BEISPIEL = { rate: 300, monate: 36 };
const beispielWert = () => {
  const erg = polster(BEISPIEL.rate, BEISPIEL.monate, 0);
  return erg ? euro(Math.round(erg.wert / 100) * 100) : null;
};


const Feld = ({ id, titel, wert, setzen }: { id: string; titel: string; wert: string; setzen: (s: string) => void }) => (
  <div>
    <label htmlFor={id} className="block">
      <Etikett>{titel}</Etikett>
    </label>
    <div className="mt-1.5 flex items-center border border-border bg-background focus-within:border-foreground">
      <input
        id={id}
        inputMode="decimal"
        value={wert}
        onChange={(x) => setzen(x.target.value.replace(/[^\d.,]/g, ""))}
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
    `min-h-[44px] flex-1 px-3 py-2.5 text-[15px] font-semibold transition-colors ${an ? "bg-foreground text-background" : "bg-background text-foreground hover:bg-muted"}`;
  const farbe = erg && erg.wert < erg.eingezahlt ? "loss" : "gain";
  return (
    <section className="mt-12">
      <Ueber id="rechner" />
      <Text>
        <p>
          Gib deine Leasingrate ein. Links steht, was dir beim Leasing am Ende gehört. Rechts, was dieselbe Rate als Sparplan in {PLATZ1.name} gebracht
          hätte.
        </p>
        <p>
          Das ist ein Halal ETF, also ein Fonds, der viele geprüfte Firmen auf einmal kauft. In unserer Liste steht er auf Platz 1, geordnet nach
          Zertifikat, Kosten und Sparplan.
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

        <p className="mt-4 text-[14px] leading-relaxed text-muted-foreground">
          Monatskurse bis {kursStand}, ohne Depotkosten.
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
      <Seo title={`${SEO_TITEL} | finanzmuslim`} description={META} path={PFAD} jsonLd={graph()} />
      <div className="container py-8 md:py-12">
        <div className="mx-auto max-w-[720px] xl:grid xl:max-w-[1048px] xl:grid-cols-[280px_minmax(0,720px)] xl:gap-12">
          <Seitenleiste
            inhalt={inhalt}
            etikett="Rate statt Leasing"
            titel="Deine Rate halal anlegen?"
            text="Ein Sparplan auf einen Halal ETF ist eine Rate, die dir am Ende gehört. Im Vergleich siehst du, welches Depot dafür passt und keine Zinsen aufs Guthaben zahlt."
            ziel="/vergleich/depot"
            knopf={KNOPF}
          />

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
                <span className="block">Ist Leasing haram?</span> <span className="block">Wann Leasing halal ist: 5 Punkte</span>
              </h1>
              <p className="mt-4 max-w-[600px] text-[18px] leading-[1.5] text-foreground/75">
                {beispielWert()
                  ? `300 € Leasingrate, drei Jahre lang: Am Ende gehört dir nichts. Als Sparplan im Depot wären es heute rund ${beispielWert()}. Das übliche Leasing fällt fast immer durch.`
                  : "Woran du es im Vertrag erkennst, was stattdessen geht und was deine Rate im Depot gebracht hätte."}
              </p>
              <ul data-vorlage="haken" className="mt-5 flex flex-wrap gap-2">
                {["Rechner: Leasingrate oder Depot", "5 Punkte im Vertrag", "5 Wege zum Auto im Vergleich"].map((h) => (
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
                  <p className="uppercase tracking-[0.12em]">Veröffentlicht</p>
                  <time dateTime={VEROEFFENTLICHT.iso}>{VEROEFFENTLICHT.text}</time>
                  <p className="mt-1.5 uppercase tracking-[0.12em]">Aktualisiert</p>
                  <time dateTime={AKTUALISIERT.iso}>{AKTUALISIERT.text}</time>
                </div>
              </div>


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
                    Das Autohaus legt dir ein Angebot hin: neues Auto, 300 € im Monat, keine Anzahlung. Klingt fair. Aber darfst du das als Muslim
                    unterschreiben?
                  </p>
                  <p>
                    Der halal Weg ist meist ein Auto-Abo oder ein bezahlter Gebrauchter. Und wer ohne Rate auskommt, lässt das Geld im Depot wachsen.
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

                {/* Kurzer Vergleich wie /blog/halal-gold-kaufen; Rechner und erste Werbung erst nach den 5 Punkten, bei etwa einem Drittel (Elias SEO55) */}
                <GoogleKasten />

                <div className="mt-7">
                <KartenReihe etikett="Kurzer Vergleich" titel="5 Wege zum Auto auf einen Blick" anzahl={WEGE.length}>
                  {WEGE.map((w, i) => (
                    <Karte key={w.weg} nummer={i + 1} kopf={w.weg} erste={i === 0}>
                      <Marke ton={w.ton}>{w.marke}</Marke>
                      <Etikett className="mt-4">Besonders</Etikett>
                      <p className="font-titel mt-1.5 min-h-[2.4em] text-[19px] leading-[1.2] text-foreground">{w.besonders}</p>
                      <Etikett className="mt-4">Du zahlst</Etikett>
                      <p className="mt-1 text-[15px] leading-snug text-foreground">{w.zahlst}</p>
                      <Etikett className="mt-3">Haken</Etikett>
                      <p className="mt-1 text-[15px] leading-snug text-foreground">{w.haken}</p>
                      <Etikett className="mt-3">Passt für</Etikett>
                      <p className="mt-1 text-[15px] leading-snug text-foreground">{w.passt}</p>
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
                </div>

                <section className="mt-14">
                  <Ueber id="fuenf-punkte" />
                  <Text>
                    <p>Nimm deinen Vertrag und geh diese fünf Punkte durch. Steht bei einem Punkt das Problem in deinem Vertrag, fällt der Vertrag durch.</p>
                  </Text>
                  <KartenTabelle
                    kopf={["Punkt", "In Ordnung", "Problem"]}
                    zeilen={PUNKTE.map((p) => ({
                      schluessel: p.punkt,
                      werte: [
                        p.punkt,
                        <span className="flex gap-2">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-gain" aria-hidden />
                          {p.gut}
                        </span>,
                        <span className="flex gap-2">
                          <X className="mt-0.5 h-4 w-4 shrink-0 text-loss" aria-hidden />
                          {p.schlecht}
                        </span>,
                      ],
                    }))}
                  />
                  <Kernsatz>Wem das Auto gehört, der trägt sein Risiko. Schiebt der Vertrag es dir zu, ist es keine Miete mehr.</Kernsatz>
                </section>

                <Rechner />

                <AnbieterKasten titel="Depots für deine Rate" anbieter={ANBIETER} />

                <section className="mt-14">
                  <Ueber id="warum" />
                  <Text>
                    <p>
                      Leasing heißt Miete: Jemandem gehört das Auto, du zahlst dafür, es zu nutzen. Weil das Auto ihm gehört, haftet der Vermieter dafür
                      und darf die Haftung nicht auf dich schieben.
                    </p>
                  </Text>
                  <Tauschbild
                    anbieter="Leasingfirma"
                    beiDir
                    pflichten={["Haftung bei Schaden", "Versicherung, Vollkasko", "Steuer und Wartung"]}
                    notiz="Daran scheitert der Vertrag"
                  />
                  <Text>
                    <p>
                      Genau hier fallen die deutschen Verträge durch. Ein Gelehrter hat Verträge von Mercedes, BMW, Audi, VW und Sixt gelesen und
                      keinen ohne die Klausel gefunden, dass du für das Auto haftest. Wer die Haftung abgibt, verliert sein Recht auf die Rate.
                    </p>
                    <p>
                      Der Zins ist dabei nicht der Kern. Hat die Leasingfirma das Auto auf Kredit gekauft, ist das ihr Vertrag, nicht deiner. Darum
                      macht auch ein Leasing ohne Zins den Vertrag nicht halal, es zählen Haftung und Kosten. Die Verträge der Hersteller sind oft fairer
                      als die der Leasingfirmen, die Klausel zur Haftung steht trotzdem drin.
                    </p>
                  </Text>
                  <Video id={VIDEO.id} titel={VIDEO.titel} bild="/bilder/blog/ist-leasing-haram/video-leasing.webp" />
                </section>

                <section className="mt-14">
                  <Ueber id="auto-abo" />
                  <Text>
                    <p>
                      Ja, vom Aufbau her ist das Auto-Abo die halal Form des Leasings. Du zahlst die Rate und bekommst das Auto. Versicherung, Steuer,
                      Wartung und Reparaturen bleiben beim Anbieter, er rechnet sie in deine Rate ein.
                    </p>
                  </Text>
                  <Tauschbild
                    anbieter="Abo-Anbieter"
                    beiDir={false}
                    pflichten={["Haftung bei Schaden", "Versicherung", "Steuer und Wartung"]}
                    notiz="In deiner Rate schon drin"
                  />
                  <Text>
                    <p>
                      Du zahlst nur, was du selbst verbrauchst oder verursachst: Sprit oder Strom und einen Schaden, den du mit Absicht oder grob
                      fahrlässig baust.
                    </p>
                    <p>
                      Nicht jedes Auto-Abo ist automatisch halal. Geh vor der Unterschrift die fünf Punkte von oben durch, vor allem: Wer zahlt bei einem
                      Schaden, den du nicht verursacht hast, und was kostet es, wenn du zu spät zahlst?
                    </p>
                  </Text>
                </section>

                <section className="mt-14">
                  <Ueber id="kosten" />
                  <Text>
                    <p>
                      Das Auto-Abo kostet dich mehr. Beim Hyundai IONIQ 5 sind es {euro(IONIQ.abo)} im Monat im Abo gegen {euro(IONIQ.leasing)} Leasingrate.
                      Beim Leasing kommen aber noch {euro(IONIQ.anzahlung)} Anzahlung, Versicherung, Steuer und Werkstatt dazu, im Abo ist das schon drin.
                    </p>
                    <p>
                      Unterm Strich zahlst du für das Abo etwa 50 bis 100&nbsp;€ mehr im Monat. Dafür trägst du kein Risiko für ein Auto, das dir nicht gehört.
                    </p>
                  </Text>
                  <p className="mt-3 max-w-[664px] text-[13px] leading-relaxed text-muted-foreground">
                    Abo: MOCEAN, 12 Monate, 1.000 km im Monat. Leasing: Beispiel der Hyundai Finance, 48 Monate. Beide abgerufen am 05.11.2026.
                  </p>
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
                  <Text>
                    <p>
                      <strong className="font-semibold text-foreground">Nachzahlung für den Restwert.</strong> Steht so eine Klausel drin, fällt der Vertrag
                      durch, siehe Punkt 5 oben.
                    </p>
                    <p>
                      <strong className="font-semibold text-foreground">Ballonfinanzierung.</strong> Anzahlung, kleine Raten, am Ende eine große
                      Ablösesumme. Das ist kein Leasing, sondern ein Kredit. Ein Auto über eine Bank zu finanzieren, ob über deine Bank oder die Bank des
                      Herstellers, ist haram.
                    </p>
                    <p>
                      <strong className="font-semibold text-foreground">Leasing mit Kauf am Ende.</strong> Hier wirst du am Ende Eigentümer. Läuft der Kauf
                      über eine Bank, ist es eine Finanzierung mit Zins.
                    </p>
                  </Text>
                </section>

                <section className="mt-14">
                  <Ueber id="ohne-leasing" />
                  <Text>
                    <p>
                      <strong className="font-semibold text-foreground">Gebraucht bar kaufen.</strong> Kaufen ist Handel, und Handel ist erlaubt. Ein
                      bezahltes Auto gehört dir, es gibt keine Rate und keine Klausel, die dich an eine fremde Haftung bindet.
                    </p>
                    <p>
                      <strong className="font-semibold text-foreground">Ratenkauf direkt beim Händler.</strong> Für Raten darf der Händler mehr verlangen als bar,
                      wenn der Preis vor der Unterschrift feststeht. Zum Beispiel 10.000&nbsp;€ bar oder 12.000&nbsp;€ in Raten, und dabei bleibt es.
                    </p>
                    <p>
                      <strong className="font-semibold text-foreground">Erst sparen, dann kaufen.</strong> Wer die Rate ein paar Jahre zur Seite legt, hat
                      den Preis eines guten Gebrauchten zusammen. Was das im Depot bringt, zeigt der <a href="#rechner" className="font-medium text-primary underline underline-offset-2 hover:no-underline">Rechner oben</a>.
                    </p>
                  </Text>
                </section>

                <section className="mt-12">
                  <Ueber id="haeufige-fragen" />
                  <div className="mt-4 max-w-[664px] border-b border-border">
                    {FRAGEN.map((f, i) => (
                      <details key={f.frage} open={i === 0} className="group border-t border-border">
                        <summary className="flex min-h-[48px] cursor-pointer list-none items-start justify-between gap-4 py-4 [&::-webkit-details-marker]:hidden">
                          <h3 className="text-[18px] font-semibold leading-snug text-foreground">{f.frage}</h3>
                          <ChevronDown className="mt-1 h-4 w-4 shrink-0 text-foreground transition-transform group-open:rotate-180" aria-hidden />
                        </summary>
                        <p className="pb-5 text-[17px] leading-[1.65] text-foreground/75">{f.antwort}</p>
                      </details>
                    ))}
                  </div>
                </section>

                <section className="mt-12">
                  <Ueber id="naechster-schritt" />
                  <Text>
                    <p>
                      Brauchst du nicht sofort ein neues Auto, leg die Rate als Sparplan auf einen Halal ETF an. Welches Depot das kann und keine Zinsen aufs
                      Guthaben zahlt, siehst du im <TL to="/vergleich/depot">Depot-Vergleich</TL>.
                    </p>
                  </Text>
                </section>

                <AnbieterKasten titel="Depots für deine Rate" anbieter={ANBIETER} />

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
