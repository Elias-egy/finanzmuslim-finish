import { useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, Check, ChevronDown, X } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Seo from "@/components/Seo";
import eliasPortrait from "@/assets/elias-autor.webp";
import { kursStand } from "@/lib/kurse";
import { PLATZ1, polster, zahlAus } from "@/lib/polster";
import { etfListe, etfsBei } from "@/data/halalEtfListe";
import {
  AnbieterKasten,
  AutorAufruf,
  BIO,
  Etikett,
  euro,
  GoogleKasten,
  H2,
  INSTAGRAM,
  Kacheln,
  Karte,
  KartenReihe,
  Kernsatz,
  LINKEDIN,
  LINKEDIN_FIRMA,
  Marke,
  PROFILE,
  Seitenleiste,
  SITE,
  Text,
  TL,
  useAktiv,
  YOUTUBE,
} from "@/components/blog/bausteine";

/**
 * „Sind Aktien haram?“, neu gebaut in SEO61 (05.11.2026) im Stil von /blog/ist-leasing-haram (Elias SEO57: „Wenn im dem Stil
 * jetzt alle anderen auch machst, extrem gut.“, Vault raw/2026-11-05-elias-seo57-leasing-gut-alle-in-dem-stil.md). Jede
 * Halal-Aussage aus ~/hourani/positionen/aktien.md und forex-trading.md (ilmCast Ep. 18 und 17), auf der Seite ohne Namen;
 * Begleitdatei docs/blog/pruefer-seo61/sind-aktien-haram-seo61.txt.belege.md. Karte im Vault:
 * fundament/research/quellen/SEO-GUIDE-Z2aCQ5YKaTU/beitraege/sind-aktien-haram.md. Zertifizierte Halal ETFs bleiben nach Elias'
 * Linie „zertifiziert“ (raw/2026-10-31-elias-mc7d9g5-review-xxl.md: „nach unserer Meinung ist das ja okay“), die strengere Sicht
 * steht als ein Satz im Abschnitt zu den Zinsen.
 */

const PFAD = "/blog/sind-aktien-haram";
const TITEL = "Sind Aktien haram? Wann eine Aktie halal ist: 2 Prüfungen";
/** Title-Tag unter 60 Zeichen mit „| finanzmuslim“; H1 bleibt TITEL. */
const SEO_TITEL = "Sind Aktien haram? Wann eine Aktie halal ist";
const META =
  "Sind Aktien haram? Nein, nicht an sich. Die 2 Prüfungen für jede Aktie, welche Branchen wegfallen, ob Trading geht und was 100 € im Monat gebracht hätten.";
const VEROEFFENTLICHT = { text: "15.08.2026", iso: "2026-08-15T09:00:00+02:00" };
const AKTUALISIERT = { text: "05.11.2026", iso: "2026-11-05T09:00:00+01:00" };
const LESEZEIT = 7;
const RECHTSHINWEIS =
  "Dieser Beitrag ist keine Fatwa und keine Anlageberatung. Zu den Grenzen bei Zinsen gibt es abweichende Auffassungen. Vergangene Kursentwicklung ist kein Versprechen für die Zukunft.";

/** Der Knopf aller Aufrufe, gleich im Kopf (SiteHeader.tsx, KOPF_ZIEL), in der Seitenleiste und im Aufruf mit Foto. */
const KNOPF = "Halal anlegen";

type Abschnitt = { id: string; titel: string; leiste?: boolean; kurz?: string };
const ABSCHNITTE: Abschnitt[] = [
  { id: "das-wichtigste", titel: "Das Wichtigste", leiste: true },
  /** Überschrift der Karten-Reihe (bausteine KartenReihe, id kurzer-vergleich), darum nur im Inhaltsverzeichnis. */
  { id: "kurzer-vergleich", titel: "5 Wege an der Börse auf einen Blick", leiste: true, kurz: "5 Wege an der Börse" },
  { id: "zwei-pruefungen", titel: "Wann ist eine Aktie halal? Die 2 Prüfungen", leiste: true, kurz: "Die 2 Prüfungen" },
  { id: "rechner", titel: "Konto oder Halal ETF: Was wäre aus deinem Geld geworden?", leiste: true, kurz: "Rechner: Konto oder Halal ETF" },
  { id: "branchen", titel: "Welche Aktien sind haram?", leiste: true, kurz: "Welche Aktien haram sind" },
  { id: "zinsen", titel: "Wie viel Zinsen darf eine Firma haben?", leiste: true, kurz: "Zinsen in der Firma" },
  { id: "trading", titel: "Ist Trading haram?", leiste: true, kurz: "Ist Trading haram?" },
  { id: "einfacher-weg", titel: "Der einfache Weg: ein Halal ETF" },
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

/** Fünf Wege an der Börse, Etiketten nach STATION-BEITRAG.md (SEO48-04). Einordnung wie in den Abschnitten unten. */
const WEGE: { weg: string; marke: string; ton: Ton; besonders: string; kaufst: string; haken: string; passt: string; ziel: string }[] = [
  {
    weg: "Halal ETF",
    marke: "zertifiziert",
    ton: "gruen",
    besonders: "Viele geprüfte Firmen auf einmal",
    kaufst: "einen Anteil an einem Fonds mit vielen Firmen",
    haken: "Du suchst die Firmen nicht selbst aus",
    passt: "Wer mit 100 € im Monat anfangen will",
    ziel: "einfacher-weg",
  },
  {
    weg: "Einzelne Aktie",
    marke: "geht mit Prüfung",
    ton: "gruen",
    besonders: "Du wählst die Firma selbst",
    kaufst: "ein Stück einer Firma",
    haken: "Du prüfst selbst, und das immer wieder",
    passt: "Wer Zahlen von Firmen lesen will",
    ziel: "zwei-pruefungen",
  },
  {
    weg: "Bank, Brauerei, Rüstung",
    marke: "fällt weg",
    ton: "rot",
    besonders: "Das Geschäft selbst ist haram",
    kaufst: "ein Stück an einem verbotenen Geschäft",
    haken: "Darüber sind sich alle Gelehrten einig",
    passt: "Keinen, der halal bleiben will",
    ziel: "branchen",
  },
  {
    weg: "Trading mit Hebel oder CFDs",
    marke: "fällt weg",
    ton: "rot",
    besonders: "Du wettest auf einen Kurs",
    kaufst: "keine Firma, nur eine Wette",
    haken: "Der Hebel ist ein Darlehen mit Zins",
    passt: "Keinen, der halal bleiben will",
    ziel: "trading",
  },
  {
    weg: "Anleihen",
    marke: "fällt weg",
    ton: "rot",
    besonders: "Du leihst Geld gegen Zins",
    kaufst: "einen Schuldschein, keine Firma",
    haken: "Fester Zins, also Riba",
    passt: "Halal gibt es dafür Sukuk",
    ziel: "haeufige-fragen",
  },
];

/** Verbotene Geschäfte, aufgezählt als Beispiele, nicht vollständig (Beleg 00:19:56). */
const BRANCHEN = ["Alkohol", "Banken", "Versicherungen", "Tabak", "Erotik", "Fleisch, das nicht halal ist", "Waffen und Rüstung"];

/** Grenzen des Standards, dem zertifizierte Halal ETFs folgen (Belege 00:42:39, 00:43:09, 00:44:50). */
const GRENZEN: [string, ReactNode, ReactNode?][] = [
  ["Zinsschulden", "höchstens rund ⅓", "gemessen am Börsenwert"],
  ["Geld auf Zinskonten", "höchstens rund ⅓", "gemessen am Börsenwert"],
  ["Verbotene Einnahmen", "höchstens 5 %", "von allen Einnahmen"],
];

const DREIER = [
  { name: "Traders Place", logo: "/bilder/blog/halal-etf/logos/traders-place-wortmarke.svg", out: "/out/traders-place" },
  { name: "Smartbroker+", logo: "/bilder/blog/halal-etf/logos/smartbroker.webp", out: "/out/smartbroker" },
  { name: "Scalable Capital", logo: "/bilder/blog/halal-etf/logos/scalable.webp", out: "/out/scalable" },
];
// Sparplan auf Platz 1 wie in /blog/ist-leasing-haram: Smartbroker+ und Scalable aus sparplanBei der Liste, Traders Place nach Elias' eigenem Depot (SEO31).
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
  { lead: "Aktien sind nicht haram an sich.", text: "Mit einer Aktie gehört dir ein kleines Stück der Firma, an allem, was sie hat." },
  { lead: "Prüfung 1 ist das Geschäft.", text: "Verdient die Firma mit Alkohol, Zinsen oder Waffen, fällt die Aktie weg." },
  { lead: "Prüfung 2 sind die Zinsen der Firma.", text: "Zertifizierte Halal ETFs folgen hier einem Standard mit festen Grenzen." },
  { lead: "Trading mit Hebel, CFDs und Optionen fällt weg.", text: "Da kaufst du keine Firma, sondern wettest auf einen Kurs." },
  { lead: "Der einfache Weg ist ein Halal ETF.", text: "Der Rechner weiter unten zeigt, was 100 € im Monat darin gebracht hätten." },
];

const FRAGEN: { frage: string; antwort: string }[] = [
  {
    frage: "Sind Aktien haram?",
    antwort:
      "Nein, nicht an sich. Eine Aktie ist ein Anteil an einer Firma. Haram wird sie, wenn die Firma mit Verbotenem Geld verdient oder bei den Zinsen durchfällt.",
  },
  {
    frage: "Ist es haram, in Aktien zu investieren?",
    antwort:
      "Nein, wenn beide Prüfungen passen: Das Geschäft der Firma ist halal, und ihr Umgang mit Zinsen auch. Am einfachsten geht das mit einem zertifizierten Halal ETF.",
  },
  {
    frage: "Ist Trading haram?",
    antwort:
      "Hebel, CFDs, Optionen, Futures, Leerverkäufe und Forex sind haram. Kaufst du echte Aktien, gelten die zwei Prüfungen wie bei jeder Aktie.",
  },
  {
    frage: "Sind Dividenden halal?",
    antwort:
      "Die Dividende ist dein Anteil am Gewinn. Hatte die Firma kleine verbotene Einnahmen, gibst du diesen Teil weiter, wenn die Firma es nicht selbst tut. Den Betrag rechnet dir der Bereinigungsrechner aus.",
  },
  {
    frage: "Sind normale ETFs halal?",
    antwort:
      "Meist nicht. Ein normaler ETF kauft alle Firmen eines Index, also auch Banken und Versicherungen. Ein Halal ETF lässt sie weg.",
  },
  {
    frage: "Sind Aktien von Rüstungsfirmen halal?",
    antwort:
      "Nein. Waffen und Rüstung gehören zu den Geschäften, die eine Aktie haram machen, auch wenn die Aktien gerade gut laufen.",
  },
  {
    frage: "Sind Anleihen halal?",
    antwort:
      "Nein. Eine Anleihe ist ein Darlehen, für das du Zinsen bekommst. Die halal Alternative heißt Sukuk: Du bekommst einen Anteil am Gewinn eines Projekts statt Zinsen.",
  },
];

const PASST_DAZU: { to: string; name: string; text: string }[] = [
  { to: "/blog/halal-etf", name: "Die besten Halal ETFs", text: "Welche es gibt, was sie kosten und wo du sie kaufst." },
  { to: "/vorlagen/aktien-check", name: "Aktien-Check als PDF", text: "Die zwei Prüfungen auf einer Seite zum Ausdrucken." },
  { to: "/blog/trading-forex-cfd", name: "Trading, Forex und CFDs", text: "Warum Hebel und Wetten auf Kurse wegfallen." },
  { to: "/bereinigungsrechner", name: "Bereinigungsrechner", text: "Wie viel von deiner Dividende du weitergibst." },
];

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
        image: `${SITE}/og/blog--sind-aktien-haram.jpg`,
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
/* Erklärbild: zwei Prüfungen, frei und gestrichelt (Elias SEO57)      */
/* ------------------------------------------------------------------ */

const Siebbild = () => {
  const rot = "hsl(var(--loss))";
  const Runter = ({ y1, y2 }: { y1: number; y2: number }) => (
    <g stroke="currentColor" strokeWidth={1.4} fill="none">
      <line x1={106} y1={y1} x2={106} y2={y2 - 2} strokeDasharray="4 3" />
      <path d={`M101.5 ${y2 - 7} L106 ${y2} L110.5 ${y2 - 7}`} />
    </g>
  );
  const Raus = ({ y }: { y: number }) => (
    <g stroke={rot} strokeWidth={1.4} fill="none">
      <line x1={206} y1={y} x2={232} y2={y} strokeDasharray="4 3" />
      <path d={`M227 ${y - 4.5} L234 ${y} L227 ${y + 4.5}`} />
    </g>
  );
  return (
    <figure className="mt-7 max-w-[460px]">
      <svg
        viewBox="0 0 360 250"
        className="h-auto w-full text-foreground"
        role="img"
        aria-label="Zwei Prüfungen für jede Aktie: Erst das Geschäft der Firma, Alkohol, Banken und Waffen fallen weg. Dann die Zinsen der Firma, zu viele Zinsen fallen weg. Was beide Prüfungen besteht, geht."
      >
        <text x={106} y={16} textAnchor="middle" className="fill-muted-foreground text-[14px]">Jede Aktie</text>
        <Runter y1={24} y2={46} />
        <rect x={6} y={48} width={200} height={58} rx={6} fill="none" stroke="currentColor" strokeWidth={1.4} strokeDasharray="5 4" />
        <text x={20} y={72} className="fill-foreground text-[14px] font-semibold">1. Das Geschäft</text>
        <text x={20} y={92} className="fill-foreground text-[14px]">Womit verdient die Firma?</text>
        <Raus y={77} />
        <text x={240} y={70} className="text-[14px]" fill={rot}>Alkohol, Banken,</text>
        <text x={240} y={88} className="text-[14px]" fill={rot}>Waffen</text>
        <text x={240} y={106} className="text-[14px] font-semibold" fill={rot}>fällt weg</text>

        <Runter y1={106} y2={130} />
        <rect x={6} y={132} width={200} height={58} rx={6} fill="none" stroke="currentColor" strokeWidth={1.4} strokeDasharray="5 4" />
        <text x={20} y={156} className="fill-foreground text-[14px] font-semibold">2. Die Zinsen</text>
        <text x={20} y={176} className="fill-foreground text-[14px]">Kredite, Zinskonten</text>
        <Raus y={161} />
        <text x={240} y={156} className="text-[14px]" fill={rot}>Zu viele Zinsen</text>
        <text x={240} y={174} className="text-[14px] font-semibold" fill={rot}>fällt weg</text>

        <Runter y1={190} y2={214} />
        <text x={106} y={238} textAnchor="middle" className="text-[15px] font-semibold" fill="hsl(var(--gain))">Die Aktie geht</text>
      </svg>
    </figure>
  );
};

/* ------------------------------------------------------------------ */
/* Rechner „Konto oder Halal ETF“ (Karte Station 8)                    */
/* ------------------------------------------------------------------ */

const LAUFZEITEN = [12, 36, 60];

/** Die Zahl im Einstieg: 100 € im Monat, fünf Jahre, auf Platz 1 der Halal-ETF-Liste. */
const BEISPIEL = { rate: 100, monate: 60 };
const beispielWert = () => {
  const erg = polster(BEISPIEL.rate, BEISPIEL.monate, 0);
  return erg ? euro(Math.round(erg.wert / 100) * 100) : null;
};

const Rechner = () => {
  const [rateText, setRateText] = useState("100");
  const [monate, setMonate] = useState(60);
  const rate = zahlAus(rateText);
  const erg = polster(rate, monate, 0);
  const gezahlt = rate * monate;
  const schalter = (an: boolean) =>
    `min-h-[44px] flex-1 px-3 py-2.5 text-[15px] font-semibold transition-colors ${an ? "bg-foreground text-background" : "bg-background text-foreground hover:bg-muted"}`;
  const farbe = erg && erg.wert < erg.eingezahlt ? "loss" : "gain";
  return (
    <section className="mt-12">
      <Ueber id="rechner" />
      <Text>
        <p>
          Gib ein, wie viel du im Monat übrig hast. Links steht, was auf dem Konto ohne Zinsen daraus wird. Rechts, was derselbe Betrag als Sparplan in{" "}
          {PLATZ1.name} gebracht hätte.
        </p>
        <p>Das ist ein Halal ETF, in unserer Liste auf Platz 1, geordnet nach Zertifikat, Kosten und Sparplan.</p>
      </Text>
      <div className="mt-5 border border-border bg-card p-4 md:p-5">
        <label htmlFor="aktien-rate" className="block">
          <Etikett>Betrag im Monat</Etikett>
        </label>
        <div className="mt-1.5 flex items-center border border-border bg-background focus-within:border-foreground">
          <input
            id="aktien-rate"
            inputMode="decimal"
            value={rateText}
            onChange={(x) => setRateText(x.target.value.replace(/[^\d.,]/g, ""))}
            className="w-full bg-transparent px-3 py-2.5 text-[16px] tabular-nums text-foreground outline-none"
          />
          <span className="pr-3 text-[16px] text-muted-foreground">€</span>
        </div>
        <Etikett className="mt-4">Seit</Etikett>
        <div className="mt-1.5 flex border border-border" role="group" aria-label="Laufzeit in Jahren">
          {LAUFZEITEN.map((m, i) => (
            <button
              key={m}
              type="button"
              aria-pressed={monate === m}
              onClick={() => setMonate(m)}
              className={`${i ? "border-l border-border " : ""}${schalter(monate === m)}`}
            >
              {m === 12 ? "1 Jahr" : `${m / 12} Jahren`}
            </button>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2" aria-live="polite">
          <div className="min-w-0 border border-border bg-background px-3 py-3 sm:px-4 sm:py-4">
            <Etikett>Auf dem Konto</Etikett>
            <p className="mt-1.5 text-[13px] text-muted-foreground sm:text-[14px]">Du zahlst ein</p>
            <p className="text-[18px] font-semibold tabular-nums text-foreground sm:text-[24px]">{euro(gezahlt)}</p>
            <p className="mt-2 text-[13px] text-muted-foreground sm:text-[14px]">Heute da</p>
            <p className="text-[18px] font-semibold tabular-nums text-foreground sm:text-[24px]">{euro(gezahlt)}</p>
            <p className="mt-2 text-[13px] leading-snug text-muted-foreground">Ohne Zinsen bleibt es bei dem, was du einzahlst.</p>
          </div>
          <div className="min-w-0 border border-foreground bg-background px-3 py-3 shadow-[inset_0_0_0_1px_hsl(var(--foreground))] sm:px-4 sm:py-4">
            <Etikett>Im Halal ETF</Etikett>
            <p className="mt-1.5 text-[13px] text-muted-foreground sm:text-[14px]">Du zahlst ein</p>
            <p className="text-[18px] font-semibold tabular-nums text-foreground sm:text-[24px]">{euro(gezahlt)}</p>
            <p className="mt-2 text-[13px] text-muted-foreground sm:text-[14px]">Heute wert</p>
            <p className={`text-[18px] font-semibold tabular-nums sm:text-[24px] ${farbe === "loss" ? "text-loss" : "text-gain"}`}>{erg ? euro(erg.wert) : "–"}</p>
            <p className="mt-2 text-[13px] leading-snug text-muted-foreground">Jeden Monat derselbe Betrag, das Geld gehört dir.</p>
          </div>
        </div>

        {erg && (
          <div className="mt-5 border border-border bg-background px-2 pb-2 pt-3 sm:px-3">
            <div className="flex flex-wrap gap-x-5 gap-y-1 px-1 text-[13px] text-muted-foreground" aria-hidden>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/70" /> Eingezahlt
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className={`h-2.5 w-2.5 rounded-full ${farbe === "gain" ? "bg-gain" : "bg-loss"}`} /> Wert im Halal ETF
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
                  <Tooltip formatter={(v: number, n: string) => [euro(v), n === "wert" ? "Wert im Halal ETF" : "Eingezahlt"]} contentStyle={{ fontSize: 13, borderRadius: 4 }} />
                  <Area type="monotone" dataKey="eingezahlt" stroke="hsl(var(--muted-foreground))" fill="hsl(var(--muted))" strokeWidth={1.5} isAnimationActive={false} />
                  <Area type="monotone" dataKey="wert" stroke={`hsl(var(--${farbe}))`} fill={`hsl(var(--${farbe}-soft))`} fillOpacity={0.7} strokeWidth={2} isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        <p className="mt-4 text-[14px] leading-relaxed text-muted-foreground">Monatskurse bis {kursStand}, ohne Depotkosten.</p>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Seite                                                               */
/* ------------------------------------------------------------------ */

const SindAktienHalal = () => {
  const [offen, setOffen] = useState(false);
  const ids = useMemo(() => LEISTE.map((a) => a.id), []);
  const aktiv = useAktiv(ids);
  const wert = beispielWert();

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
            etikett="Aktien halal kaufen"
            titel="Deine Ersparnisse halal anlegen?"
            text="Ein Halal ETF kauft viele zertifizierte Firmen auf einmal. Im Vergleich siehst du, welches Depot ihn als Sparplan hat und keine Zinsen aufs Guthaben zahlt."
            ziel="/vergleich/depot"
            knopf={KNOPF}
          />

          <div className="min-w-0">
            <nav aria-label="Brotkrumen" className="flex flex-wrap items-center gap-2 font-mono text-[12px] uppercase tracking-[0.12em] text-muted-foreground">
              <Link to="/blog" className="text-primary hover:underline">
                Blog
              </Link>
              <span aria-hidden>/</span>
              <span>Sind Aktien haram?</span>
            </nav>

            <article className="mt-8">
              <h1 className="font-titel mt-3 text-[32px] leading-[1.1] text-foreground md:text-[42px]">
                <span className="block">Sind Aktien haram?</span> <span className="block">Wann eine Aktie halal ist: 2 Prüfungen</span>
              </h1>
              <p className="mt-4 max-w-[600px] text-[18px] leading-[1.5] text-foreground/75">
                Nein, Aktien sind nicht haram. Eine Aktie ist erlaubt, wenn die Firma halal Geld verdient und bei den Zinsen nicht durchfällt.
              </p>
              <ul data-vorlage="haken" className="mt-5 flex flex-wrap gap-2">
                {["2 Prüfungen für jede Aktie", "Welche Aktien haram sind", "Ist Trading haram?", "Rechner: Konto oder Halal ETF"].map((h) => (
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

              {/* Einstieg als kleine Szene wie frontal („Imagine …“), die Antwort in den ersten 100 Wörtern, die Zahl aus dem Rechner */}
              <div className="mt-8">
                <Text>
                  <p>
                    Dein Kollege erzählt von seinen Aktien. Du hast jeden Monat 100 € übrig und fragst dich: Darf ich das als Muslim überhaupt?
                  </p>
                  <p>
                    {wert
                      ? `Ja, mit zwei Prüfungen. 100 € im Monat in einem Halal ETF wären nach fünf Jahren heute rund ${wert} wert, eingezahlt hast du 6.000 €.`
                      : "Ja, mit zwei Prüfungen. Der Rechner weiter unten zeigt, was 100 € im Monat in einem Halal ETF gebracht hätten."}
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

                {/* Kurzer Vergleich wie /blog/ist-leasing-haram; Rechner und erste Werbung erst nach den 2 Prüfungen, bei etwa einem Drittel (Elias SEO55) */}
                <GoogleKasten />

                <div className="mt-7">
                  <KartenReihe etikett="Kurzer Vergleich" titel="5 Wege an der Börse auf einen Blick" anzahl={WEGE.length}>
                    {WEGE.map((w, i) => (
                      <Karte key={w.weg} nummer={i + 1} kopf={w.weg} erste={i === 0}>
                        <Marke ton={w.ton}>{w.marke}</Marke>
                        <Etikett className="mt-4">Besonders</Etikett>
                        <p className="font-titel mt-1.5 min-h-[2.4em] text-[19px] leading-[1.2] text-foreground">{w.besonders}</p>
                        <Etikett className="mt-4">Du kaufst</Etikett>
                        <p className="mt-1 text-[15px] leading-snug text-foreground">{w.kaufst}</p>
                        <Etikett className="mt-3">Haken</Etikett>
                        <p className="mt-1 text-[15px] leading-snug text-foreground">{w.haken}</p>
                        <Etikett className="mt-3">Passt für</Etikett>
                        <p className="mt-1 text-[15px] font-semibold leading-snug text-foreground">{w.passt}</p>
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
                  <Ueber id="zwei-pruefungen" />
                  <Text>
                    <p>
                      Mit einer Aktie gehört dir ein kleines Stück der Firma, und zwar an allem: an ihrem Geschäft und an ihrem Geld. Darum schaust du dir
                      beides an.
                    </p>
                  </Text>
                  <Siebbild />
                  <Text>
                    <p>
                      <strong className="font-semibold text-foreground">Prüfung 1, das Geschäft.</strong> Verdient die Firma mit etwas Verbotenem, ist die
                      Aktie haram. Darüber sind sich die Gelehrten einig.
                    </p>
                    <p>
                      <strong className="font-semibold text-foreground">Prüfung 2, die Zinsen.</strong> Auch eine Firma mit halal Geschäft kann Kredite mit
                      Zins haben oder Geld auf Zinskonten parken. Wie viel davon geht, steht weiter unten bei den Zinsen.
                    </p>
                  </Text>
                  <Kernsatz>Nicht die Aktie ist das Problem, sondern was die Firma macht.</Kernsatz>
                </section>

                <Rechner />

                <AnbieterKasten titel="Depots für deinen Halal ETF" anbieter={ANBIETER} />

                <section className="mt-14">
                  <Ueber id="branchen" />
                  <Text>
                    <p>Haram ist jede Aktie einer Firma, die mit Verbotenem Geld verdient. Dazu gehören zum Beispiel:</p>
                  </Text>
                  <ul className="mt-4 flex max-w-[664px] flex-wrap gap-2">
                    {BRANCHEN.map((b) => (
                      <li key={b} className="inline-flex min-h-[34px] items-center gap-1.5 border border-loss/40 px-3 text-[15px] text-foreground">
                        <X className="h-4 w-4 shrink-0 text-loss" aria-hidden />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <Text>
                    <p>
                      Die Liste ist nicht vollständig, es zählt alles, was haram ist. Auch eine Firma, die mit Zinsen ihr Geld verdient, fällt weg.
                    </p>
                    <p>
                      Gerade Rüstungsaktien liefen in den letzten Jahren gut, und manche sind mitgesprungen. Für Muslime fallen sie weg, egal wie gut der Kurs
                      steht.
                    </p>
                  </Text>
                </section>

                <section className="mt-14">
                  <Ueber id="zinsen" />
                  <Text>
                    <p>
                      Fast jede große Firma hat Kredite bei Banken oder Geld auf Zinskonten. Wie viel davon gehen darf, sehen Gelehrte unterschiedlich.
                    </p>
                    <p>
                      Viele Gelehrte sind streng: Macht die Firma irgendetwas mit Zinsen, fällt die Aktie weg. Ein Standard für Aktien setzt dagegen feste
                      Grenzen, und diesem Standard folgen zertifizierte Halal ETFs:
                    </p>
                  </Text>
                  <div className="max-w-[460px]">
                    <Kacheln werte={GRENZEN} />
                  </div>
                  <Text>
                    <p>
                      Hatte die Firma kleine verbotene Einnahmen, gibst du diesen Teil deiner Dividende weiter, wenn die Firma es nicht selbst tut. Wie viel das
                      ist, rechnet der <TL to="/bereinigungsrechner">Bereinigungsrechner</TL> aus.
                    </p>
                  </Text>
                </section>

                <AutorAufruf
                  bild={eliasPortrait}
                  etikett="In die Praxis"
                  titel="Aktien halal, ohne selbst zu prüfen"
                  text="Ein Halal ETF kauft viele zertifizierte Firmen auf einmal, schon ab einem kleinen Sparplan. Im Vergleich siehst du, welches Depot dafür passt und keine Zinsen aufs Guthaben zahlt."
                  ziel="/vergleich/depot"
                  knopf={KNOPF}
                />

                <section className="mt-14">
                  <Ueber id="trading" />
                  <Text>
                    <p>
                      Es kommt darauf an, was du handelst. Kaufst du echte Aktien, gelten die zwei Prüfungen von oben. Beim Trading wird aber meist etwas
                      anderes gehandelt, und das fällt weg:
                    </p>
                  </Text>
                  <ul className="mt-4 max-w-[664px] space-y-3 text-[17px] leading-[1.6] text-foreground/75">
                    {[
                      ["Hebel und Margin.", "Der Broker leiht dir Geld, das ist ein Darlehen mit Zins."],
                      ["CFDs, Optionen und Futures.", "Du kaufst keine Firma, sondern wettest auf einen Kurs."],
                      ["Leerverkäufe.", "Du verkaufst Aktien, die du dir nur geliehen hast."],
                      ["Forex.", "Du tauschst Währungen hin und her, dein Gewinn ist der Verlust eines anderen."],
                    ].map(([lead, text]) => (
                      <li key={lead} className="flex gap-3">
                        <X className="mt-1.5 h-4 w-4 shrink-0 text-loss" aria-hidden />
                        <span>
                          <strong className="font-semibold text-foreground">{lead}</strong> {text}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Text>
                    <p>Bei Derivaten und beim Hebel sind sich die Gelehrten einig: Das ist haram.</p>
                  </Text>
                </section>

                <section className="mt-14">
                  <Ueber id="einfacher-weg" />
                  <Text>
                    <p>
                      Einzelne Aktien selbst zu prüfen, schafft als Privatanleger kaum jemand. Du müsstest die Zahlen jeder Firma lesen, und zwar immer wieder.
                    </p>
                    <p>
                      Ein zertifizierter Halal ETF nimmt dir das ab. Er kauft viele Firmen auf einmal, und schon 100 € im Monat reichen für einen Sparplan.
                      Welche es gibt und was sie kosten, steht bei den <TL to="/blog/halal-etf">besten Halal ETFs</TL>.
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
                      Fang mit einem Sparplan auf einen Halal ETF an. Welches Depot das kann und keine Zinsen aufs Guthaben zahlt, siehst du im{" "}
                      <TL to="/vergleich/depot">Depot-Vergleich</TL>.
                    </p>
                  </Text>
                </section>

                <AnbieterKasten titel="Depots für deinen Halal ETF" anbieter={ANBIETER} />

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

export default SindAktienHalal;
