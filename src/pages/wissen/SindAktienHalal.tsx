import { useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, Check, ChevronDown } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Seo from "@/components/Seo";
import { AnbieterLogo } from "@/components/AnbieterLogo";
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
  H3,
  INSTAGRAM,
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
  Werbung,
  YOUTUBE,
} from "@/components/blog/bausteine";

/**
 * „Sind Aktien haram?“, neu gebaut in SEO61 im Stil von /blog/ist-leasing-haram, umgebaut in SEO62 (05.11.2026) nach Elias'
 * Rückmeldung (Vault raw/2026-11-05-elias-seo61-aktien-rueckmeldung-guide-logos-eisdiele-zoya.md, Lesart 1 bis 8): ein Titel
 * „Der komplette Guide 2026“, grauer Satz „Aktien sind halal“, Kollege mit Nvidia, Apple, Tesla, Logos in Karten und Bildern,
 * Bild Anteil gegen Wette, Filter mit Logos, Ausschlussbranchen als Ausschnitt aus einem Fondsprospekt (Comgest Growth Europe S,
 * Verkaufsprospekt DE 31.03.2026 S. 105, mit Klonen), Zinsregeln als Bild mit Logo und Eisdielen-Beispiel, Prüf-Apps mit Zoya
 * (/out/zoya) und Musaffa, Rechner nennt die Rendite (Elias SEO62: echte Kurse, Prozent dazu).
 * Jede Halal-Aussage aus ~/hourani/positionen/aktien.md und forex-trading.md (ilmCast Ep. 18 und 17), auf der Seite ohne
 * Gelehrtennamen; AAOIFI und Zoya stehen nur hier, auf Elias' Wort für diesen Beitrag. Begleitdatei
 * docs/blog/pruefer-seo62/sind-aktien-haram-seo62.txt.belege.md. Firmenlogos sind Beispiele, kein Urteil über die Firma.
 */

const PFAD = "/blog/sind-aktien-haram";
const TITEL = "Sind Aktien haram? Der komplette Guide 2026";
/** Title-Tag mit „| finanzmuslim“ 58 Zeichen; H1 ist derselbe Titel. */
const SEO_TITEL = TITEL;
const META =
  "Sind Aktien haram? Nein, Aktien sind halal, wenn Geschäft und Zinsen der Firma passen. Welche Branchen wegfallen, die Zinsregeln, Trading und ein Rechner.";
const VEROEFFENTLICHT = { text: "15.08.2026", iso: "2026-08-15T09:00:00+02:00" };
const AKTUALISIERT = { text: "05.11.2026", iso: "2026-11-05T09:00:00+01:00" };
const LESEZEIT = 9;
const RECHTSHINWEIS =
  "Dieser Beitrag ist keine Fatwa und keine Anlageberatung. Zu den Grenzen bei Zinsen gibt es abweichende Auffassungen. Firmenlogos sind Beispiele, kein Urteil über diese Firmen. Vergangene Kursentwicklung ist kein Versprechen für die Zukunft.";

/** Der Knopf aller Aufrufe, gleich im Kopf (SiteHeader.tsx, KOPF_ZIEL), in der Seitenleiste und im Aufruf mit Foto. */
const KNOPF = "Halal anlegen";

type Abschnitt = { id: string; titel: string; leiste?: boolean; kurz?: string };
const ABSCHNITTE: Abschnitt[] = [
  { id: "das-wichtigste", titel: "Das Wichtigste", leiste: true },
  /** Überschrift der Karten-Reihe (bausteine KartenReihe, id kurzer-vergleich), darum nur im Inhaltsverzeichnis. */
  { id: "kurzer-vergleich", titel: "5 Wege an der Börse auf einen Blick", leiste: true, kurz: "5 Wege an der Börse" },
  { id: "aktien-halal", titel: "Sind Aktien generell halal?", leiste: true, kurz: "Sind Aktien halal?" },
  { id: "welche-aktien", titel: "Welche Aktien sind halal und welche haram?", leiste: true, kurz: "Welche Aktien haram sind" },
  { id: "zinsen", titel: "Wie viel Zinsen darf eine Firma haben?", leiste: true, kurz: "Die Regeln für Zinsen" },
  { id: "rechner", titel: "Konto oder Halal ETF: Was wäre aus deinem Geld geworden?", leiste: true, kurz: "Rechner mit echten Kursen" },
  { id: "nicht-selbst-pruefen", titel: "Musst du das alles selbst prüfen?", leiste: true, kurz: "Halal ETF oder Prüf-App" },
  { id: "trading", titel: "Ist Trading haram?", leiste: true, kurz: "Ist Trading haram?" },
  { id: "haeufige-fragen", titel: "Häufige Fragen", leiste: true },
  { id: "naechster-schritt", titel: "Dein nächster Schritt: das passende Depot" },
];
const titelVon = (id: string) => ABSCHNITTE.find((a) => a.id === id)!.titel;
const LEISTE = ABSCHNITTE.filter((a) => a.leiste);
const Ueber = ({ id }: { id: string }) => <H2 id={id}>{titelVon(id)}</H2>;

/* ------------------------------------------------------------------ */
/* Daten                                                               */
/* ------------------------------------------------------------------ */

/** Bekannte Firmen als Beispiel (Elias SEO61: „dein Kollege empfiehlt dir … Nvidia, Apple und Tesla“), kein Halal-Urteil. */
const FIRMEN = [
  { name: "Nvidia", domain: "nvidia.com" },
  { name: "Apple", domain: "apple.com" },
  { name: "Tesla", domain: "tesla.com" },
];
const ETF_LOGOS = [
  { name: "iShares", logo: "/bilder/blog/halal-etf/logos/ishares.webp" },
  { name: "HSBC", logo: "/bilder/blog/halal-etf/logos/hsbc.webp" },
  { name: "Invesco", logo: "/bilder/blog/halal-etf/logos/invesco.webp" },
];

const FirmenLogos = ({ klein = false }: { klein?: boolean }) => (
  <span className="flex items-center gap-1.5">
    {FIRMEN.map((f) => (
      <AnbieterLogo key={f.name} name={f.name} domain={f.domain} klein={klein} rand />
    ))}
  </span>
);
const EtfLogos = () => (
  <span className="flex items-center gap-2">
    {ETF_LOGOS.map((l) => (
      <img key={l.name} src={l.logo} alt={`Logo ${l.name}`} width={32} height={32} loading="lazy" className="h-8 w-8 rounded-full object-contain ring-1 ring-black/10" />
    ))}
  </span>
);

type Ton = "gruen" | "gelb" | "rot";

/** Fünf Wege an der Börse, Etiketten nach STATION-BEITRAG.md (SEO48-04). Einordnung wie in den Abschnitten unten. */
const WEGE: { weg: string; marke: string; ton: Ton; logos?: ReactNode; hinweis?: string; besonders: string; kaufst: string; haken: string; passt: string; ziel: string }[] = [
  {
    weg: "Halal ETF",
    marke: "zertifiziert",
    ton: "gruen",
    logos: <EtfLogos />,
    besonders: "Viele Firmen auf einmal",
    kaufst: "einen Anteil an einem Fonds mit vielen Firmen",
    haken: "Du suchst die Firmen nicht selbst aus",
    passt: "Wer mit 100 € im Monat anfangen will",
    ziel: "nicht-selbst-pruefen",
  },
  {
    weg: "Einzelne Aktie",
    marke: "geht mit Prüfung",
    ton: "gruen",
    logos: <FirmenLogos />,
    hinweis: "Beispiele, kein Urteil",
    besonders: "Du wählst die Firma selbst",
    kaufst: "ein Stück einer Firma",
    haken: "Jede Aktie musst du prüfen, am besten mit einer App",
    passt: "Wer eine Lieblingsfirma hat",
    ziel: "welche-aktien",
  },
  {
    weg: "Bank, Brauerei, Casino",
    marke: "fällt weg",
    ton: "rot",
    besonders: "Das Geschäft selbst ist haram",
    kaufst: "ein Stück an einem verbotenen Geschäft",
    haken: "Darüber sind sich alle Gelehrten einig",
    passt: "Keinen, der halal bleiben will",
    ziel: "welche-aktien",
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

/** Regeln des Standards für Aktien (Belege 00:42:39, 00:43:09, 00:44:50; Verkaufsprospekt Comgest S. 106 für 5 %). */
const REGELN: { zahl: string; was: string; wovon: string }[] = [
  { zahl: "30 %", was: "Schulden mit Zinsen", wovon: "vom Börsenwert der Firma" },
  { zahl: "30 %", was: "Geld auf Zinskonten", wovon: "vom Börsenwert der Firma" },
  { zahl: "5 %", was: "Verbotene Einnahmen", wovon: "von allen Einnahmen" },
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
    d.name === "Smartbroker+" ? "Zinsen nur auf eigenem Zinskonto" : "Zinsen aufs Guthaben: 0 %",
  ],
}));

const WICHTIGSTES: { lead: string; text: ReactNode }[] = [
  { lead: "Aktien sind halal.", text: "Mit einer Aktie gehört dir ein Stück einer echten Firma, mit Gewinn und Verlust." },
  { lead: "Haram ist die Wette auf den Kurs.", text: "Bei CFDs und Optionen besitzt du nichts. Beim Hebel leiht dir der Broker Geld gegen Zins. Darum fällt beides weg." },
  { lead: "Das Geschäft muss halal sein.", text: "Alkohol, Banken, Glücksspiel und Waffen fallen weg." },
  { lead: "Für Zinsen gibt es feste Grenzen.", text: "Die AAOIFI erlaubt höchstens 30 % Schulden mit Zinsen und 5 % verbotene Einnahmen. Die meisten Gelehrten sind strenger." },
  { lead: "Selbst prüfen musst du nicht.", text: "Ein zertifizierter Halal ETF macht das für dich, bei einzelnen Aktien hilft eine App." },
];

const FRAGEN: { frage: string; antwort: string }[] = [
  {
    frage: "Sind Aktien haram?",
    antwort:
      "Nein, Aktien sind halal. Eine Aktie ist ein Anteil an einer Firma. Haram wird sie, wenn die Firma mit Verbotenem Geld verdient oder zu viel mit Zinsen macht.",
  },
  {
    frage: "Ist es haram, in Aktien zu investieren?",
    antwort:
      "Nein, wenn das Geschäft der Firma halal ist und sie nach den Grenzen der AAOIFI wenig mit Zinsen macht. Die meisten Gelehrten sind bei Zinsen strenger. Am einfachsten geht das mit einem zertifizierten Halal ETF.",
  },
  {
    frage: "Ist Trading haram?",
    antwort:
      "Hebel, CFDs, Optionen, Futures, Leerverkäufe und Forex sind haram. Kaufst du echte Aktien, gelten dieselben Regeln wie bei jeder Aktie.",
  },
  {
    frage: "Wie finde ich heraus, ob eine Aktie halal ist?",
    antwort:
      "Mit einer Prüf-App wie Zoya oder Musaffa. Du gibst den Namen der Aktie ein und siehst, ob sie die Regeln erfüllt. Ein Halal ETF nimmt dir das ganz ab.",
  },
  {
    frage: "Sind Dividenden halal?",
    antwort:
      "Die Dividende ist dein Anteil am Gewinn. Hatte die Firma kleine verbotene Einnahmen, gibst du diesen Teil weiter, wenn dein Fonds das nicht schon für dich tut. Den Betrag rechnet dir der Bereinigungsrechner aus.",
  },
  {
    frage: "Sind normale ETFs halal?",
    antwort:
      "Meist nicht. Ein normaler ETF kauft alle großen Firmen, also auch Banken und Versicherungen. Ein Halal ETF lässt sie weg.",
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
  { to: "/vorlagen/aktien-check", name: "Aktien-Check als PDF", text: "Die Regeln für Aktien auf einer Seite zum Ausdrucken." },
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
/* Erklärbilder, frei und gestrichelt (Elias SEO57), mit Logos (SEO61) */
/* ------------------------------------------------------------------ */

const Kasten = ({ rot, children }: { rot?: boolean; children: ReactNode }) => (
  <div className={`border border-dashed px-4 py-3.5 ${rot ? "border-loss/60" : "border-foreground/50"}`}>{children}</div>
);
const Runter = () => (
  <div className="flex justify-center py-1.5 text-foreground/60" aria-hidden>
    <ArrowDown className="h-4 w-4" />
  </div>
);

/** Kollege im Einstieg: drei bekannte Logos (Elias SEO61: „das ist nahbar“). */
const KollegeBild = () => (
  <figure className="mt-6 max-w-[460px] border border-border bg-card px-4 py-4">
    <Etikett>Dein Kollege sagt</Etikett>
    <p className="font-titel mt-2 text-[21px] leading-[1.25] text-foreground">„Kauf Nvidia, Apple und Tesla, die laufen.“</p>
    <div className="mt-3 flex flex-wrap items-center gap-3">
      {FIRMEN.map((f) => (
        <span key={f.name} className="inline-flex items-center gap-2 text-[15px] font-semibold text-foreground">
          <AnbieterLogo name={f.name} domain={f.domain} rand />
          {f.name}
        </span>
      ))}
    </div>
    <p className="mt-3 text-[14px] leading-snug text-foreground/70">Die Logos sind Beispiele, kein Urteil über diese Firmen.</p>
  </figure>
);

/** Anteil gegen Wette (Elias SEO61: „Du kaufst, gewinnt das Unternehmen, gewinnst du … haram ist es, wenn du nichts besitzt“). */
const AnteilBild = () => (
  <figure
    className="mt-7 grid max-w-[600px] grid-cols-2 gap-3"
    role="img"
    aria-label="Links die Aktie: Du besitzt ein Stück der Firma, gewinnt sie, gewinnst du, verliert sie, verlierst du, das ist halal. Rechts CFD und Optionen: Du besitzt nichts und wettest nur auf den Kurs, das ist haram."
  >
    <div className="flex flex-col border border-dashed border-foreground/50 p-3.5 sm:p-4">
      <p className="text-[16px] font-semibold text-foreground">Aktie</p>
      <div className="mt-3 flex items-center gap-2">
        <span className="flex h-12 flex-1 overflow-hidden border border-foreground/60">
          <span className="w-1/4 bg-gain/25" />
          <span className="flex-1" />
        </span>
      </div>
      <p className="mt-1.5 text-[14px] leading-snug text-foreground">Dir gehört ein Stück der Firma</p>
      <p className="mt-3 text-[14px] leading-snug text-gain">Firma gewinnt: du gewinnst</p>
      <p className="mt-1 text-[14px] leading-snug text-loss">Firma verliert: du verlierst</p>
      <p className="mt-auto pt-3 text-[16px] font-semibold text-gain">halal</p>
    </div>
    <div className="flex flex-col border border-dashed border-loss/60 p-3.5 sm:p-4">
      <p className="text-[16px] font-semibold text-foreground">CFD, Optionen</p>
      <div className="mt-3 flex h-12 items-center justify-center border border-dashed border-loss/60 text-[13px] text-loss">nichts</div>
      <p className="mt-1.5 text-[14px] leading-snug text-foreground">Dir gehört nichts</p>
      <p className="mt-3 text-[14px] leading-snug text-foreground">Du wettest nur auf den Kurs</p>
      <p className="mt-1 text-[14px] leading-snug text-foreground">Dein Gewinn ist der Verlust eines anderen</p>
      <p className="mt-auto pt-3 text-[16px] font-semibold text-loss">haram</p>
    </div>
  </figure>
);

/** Filter mit Logos (Elias SEO61: „Alkohol, Waffen fällt weg, zu viele Zinsen fällt weg, die Aktie geht … Logos, Nvidia, Apple“). */
const FilterBild = () => (
  <figure
    className="mt-7 max-w-[520px]"
    role="img"
    aria-label="So wird gefiltert: Jede Aktie, zum Beispiel Nvidia, Apple oder Tesla, geht durch zwei Filter. Erst das Geschäft: Alkohol, Banken, Glücksspiel und Waffen fallen weg. Dann die Zinsen: zu viele Schulden mit Zinsen fallen weg. Was durchkommt, ist halal."
  >
    <Kasten>
      <div className="flex items-center justify-between gap-3">
        <span className="text-[15px] font-semibold text-foreground">Jede Aktie, zum Beispiel</span>
        <FirmenLogos />
      </div>
    </Kasten>
    <Runter />
    <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] gap-2.5">
      <Kasten>
        <p className="text-[15px] font-semibold text-foreground">1. Das Geschäft</p>
        <p className="mt-0.5 text-[14px] leading-snug text-foreground/80">Womit verdient die Firma?</p>
      </Kasten>
      <Kasten rot>
        <p className="text-[14px] leading-snug text-loss">Alkohol, Banken, Glücksspiel, Waffen</p>
        <p className="mt-0.5 text-[14px] font-semibold text-loss">fällt weg</p>
      </Kasten>
    </div>
    <Runter />
    <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] gap-2.5">
      <Kasten>
        <p className="text-[15px] font-semibold text-foreground">2. Die Zinsen</p>
        <p className="mt-0.5 text-[14px] leading-snug text-foreground/80">Schulden und Zinskonten</p>
      </Kasten>
      <Kasten rot>
        <p className="text-[14px] leading-snug text-loss">Zu viele Zinsen</p>
        <p className="mt-0.5 text-[14px] font-semibold text-loss">fällt weg</p>
      </Kasten>
    </div>
    <Runter />
    <div className="border border-gain/60 px-4 py-3 text-center text-[16px] font-semibold text-gain">Was durchkommt, ist halal</div>
    <figcaption className="mt-2.5 text-[14px] text-foreground/70">Die Logos sind Beispiele, kein Urteil über diese Firmen.</figcaption>
  </figure>
);

/** Ausschnitt aus einem Fondsprospekt (Elias SEO61: „Screenshot … welche Branchen nicht drin sind … auch sowas wie Klon“). */
const ProspektBild = () => (
  <figure className="mt-6 max-w-[420px]">
    <div className="border border-border bg-white">
      <img
        src="/bilder/blog/sind-aktien-haram/comgest-ausschluesse.webp"
        alt="Ausschnitt aus dem Verkaufsprospekt, ausgeschlossene Branchen: Alkohol, Klonen, Finanzwesen, Glücksspiel, Schweinefleisch, Pornografie, Tabakwaren."
        width={600}
        height={280}
        loading="lazy"
        className="h-auto w-full"
      />
    </div>
    <figcaption className="mt-2.5 text-[14px] leading-snug text-foreground/70">
      Ausschnitt der ausgeschlossenen Branchen im Verkaufsprospekt des Scharia-Fonds Comgest Growth Europe S, Fassung vom 31.03.2026, Seite 105.
    </figcaption>
  </figure>
);

/** Zinsregeln als Bild mit Logo (Elias SEO61: „die IOFI-Regeln … dann ein Logo“). */
const RegelnBild = () => (
  <figure className="mt-6 max-w-[600px] border border-border bg-card px-4 py-5 sm:px-5">
    <div className="flex items-center gap-3">
      <AnbieterLogo name="AAOIFI" domain="aaoifi.com" gross rand />
      <div>
        <p className="text-[17px] font-semibold leading-tight text-foreground">AAOIFI</p>
        <p className="text-[14px] leading-snug text-foreground/75">Regeln für Aktien, höchstens</p>
      </div>
    </div>
    <dl className="mt-4 grid grid-cols-3 gap-2">
      {REGELN.map((r) => (
        <div key={r.was} className="border border-dashed border-foreground/40 px-2.5 py-3">
          <dt className="sr-only">{r.was}</dt>
          <dd className="font-titel text-[30px] leading-none tabular-nums text-foreground sm:text-[36px]">{r.zahl}</dd>
          <dd className="mt-2 text-[14px] font-semibold leading-snug text-foreground">{r.was}</dd>
          <dd className="mt-0.5 text-[13px] leading-snug text-foreground/70">{r.wovon}</dd>
        </div>
      ))}
    </dl>
  </figure>
);

/** Eisdiele mit 2 % aus Tiramisu (Elias SEO61, sein Beispiel). */
const EisdieleBild = () => (
  <figure
    className="mt-6 max-w-[600px] border border-dashed border-foreground/50 px-4 py-5 sm:px-5"
    role="img"
    aria-label="Eisdiele: 98 Prozent der Einnahmen aus Eis, 2 Prozent aus Tiramisu mit Alkohol. Das ist unter 5 Prozent, nach diesen Grenzen darfst du dich beteiligen. Von 100 Euro Dividende behältst du 98 Euro und gibst 2 Euro weiter."
  >
    <p className="text-[16px] font-semibold text-foreground">Einnahmen der Eisdiele</p>
    <div className="mt-3 flex h-10 overflow-hidden border border-foreground/60 text-[13px] font-semibold">
      <span className="flex w-[98%] items-center bg-gain/15 pl-3 text-foreground">98 % Eis</span>
      <span className="w-[2%] bg-loss" />
    </div>
    <p className="mt-1.5 text-right text-[14px] text-loss">2 % Tiramisu mit Alkohol</p>
    <div className="mt-4 grid grid-cols-2 gap-2.5">
      <div className="border border-border px-3 py-3">
        <Etikett>Unter 5 %?</Etikett>
        <p className="mt-1 text-[16px] font-semibold text-gain">Ja, du darfst dich beteiligen</p>
      </div>
      <div className="border border-border px-3 py-3">
        <Etikett>Von 100 € Dividende</Etikett>
        <p className="mt-1 text-[16px] font-semibold text-foreground">98 € behalten, 2 € weitergeben</p>
      </div>
    </div>
  </figure>
);

/* ------------------------------------------------------------------ */
/* Rechner „Konto oder Halal ETF“ (Karte Station 8)                    */
/* ------------------------------------------------------------------ */

const LAUFZEITEN = [12, 36, 60];

/** Rendite im Jahr, die ein Sparplan mit gleicher Rate bräuchte, um auf denselben Wert zu kommen (Elias SEO62: „Prozent dazu“). */
const jahresRendite = (rate: number, monate: number, wert: number) => {
  if (rate <= 0 || monate <= 0) return null;
  const end = (r: number) => {
    const m = Math.pow(1 + r, 1 / 12) - 1;
    let v = 0;
    for (let k = 0; k < monate; k++) v = (v + rate) * (1 + m);
    return v;
  };
  let lo = -0.9;
  let hi = 2;
  for (let i = 0; i < 80; i++) {
    const r = (lo + hi) / 2;
    if (end(r) > wert) hi = r;
    else lo = r;
  }
  return lo;
};
const prozent = (r: number) => `${Math.round(r * 100).toLocaleString("de-DE")} %`;

/** Die Zahl im Einstieg: 100 € im Monat, fünf Jahre, auf Platz 1 der Halal-ETF-Liste. */
const BEISPIEL = { rate: 100, monate: 60 };
const beispiel = () => {
  const erg = polster(BEISPIEL.rate, BEISPIEL.monate, 0);
  if (!erg) return null;
  const r = jahresRendite(BEISPIEL.rate, BEISPIEL.monate, erg.wert);
  return { wert: euro(Math.round(erg.wert / 100) * 100), rendite: r === null ? null : prozent(r) };
};

const Rechner = () => {
  const [rateText, setRateText] = useState("100");
  const [monate, setMonate] = useState(60);
  const rate = zahlAus(rateText);
  const erg = polster(rate, monate, 0);
  const gezahlt = rate * monate;
  const rendite = erg ? jahresRendite(rate, monate, erg.wert) : null;
  const schalter = (an: boolean) =>
    `min-h-[44px] flex-1 px-3 py-2.5 text-[15px] font-semibold transition-colors ${an ? "bg-foreground text-background" : "bg-background text-foreground hover:bg-muted"}`;
  const farbe = erg && erg.wert < erg.eingezahlt ? "loss" : "gain";
  return (
    <section className="mt-14">
      <Ueber id="rechner" />
      <Text>
        <p>
          Gib ein, wie viel du im Monat übrig hast. Links steht, was auf dem Konto ohne Zinsen daraus wird. Rechts, was derselbe Betrag als Sparplan in{" "}
          {PLATZ1.name} gebracht hätte, mit den echten Kursen.
        </p>
        <p>Das ist ein zertifizierter Halal ETF, in unserer Liste auf Platz 1, geordnet nach Kosten und Sparplan, nicht nach Rendite.</p>
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
            <p className="mt-2 text-[14px] font-semibold text-foreground">0 % im Jahr</p>
          </div>
          <div className="min-w-0 border border-foreground bg-background px-3 py-3 shadow-[inset_0_0_0_1px_hsl(var(--foreground))] sm:px-4 sm:py-4">
            <Etikett>Im Halal ETF</Etikett>
            <p className="mt-1.5 text-[13px] text-muted-foreground sm:text-[14px]">Du zahlst ein</p>
            <p className="text-[18px] font-semibold tabular-nums text-foreground sm:text-[24px]">{euro(gezahlt)}</p>
            <p className="mt-2 text-[13px] text-muted-foreground sm:text-[14px]">Heute wert</p>
            <p className={`text-[18px] font-semibold tabular-nums sm:text-[24px] ${farbe === "loss" ? "text-loss" : "text-gain"}`}>{erg ? euro(erg.wert) : euro(0)}</p>
            <p className={`mt-2 text-[14px] font-semibold ${farbe === "loss" ? "text-loss" : "text-gain"}`}>
              {rendite === null ? "" : `rund ${prozent(rendite)} im Jahr`}
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

        <p className="mt-4 text-[14px] leading-relaxed text-muted-foreground">Echte Monatskurse bis {kursStand}, ohne Depotkosten.</p>
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
  const bsp = beispiel();

  const inhalt = (
    <ol>
      {LEISTE.map((a) => (
        <li key={a.id}>
          <a
            href={`#${a.id}`}
            aria-current={aktiv === a.id ? "location" : undefined}
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
            text="Ein Halal ETF kauft viele Firmen auf einmal und ist zertifiziert. Im Vergleich siehst du, welches Depot ihn als Sparplan hat und keine Zinsen aufs Guthaben zahlt."
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
              <h1 className="font-titel mt-3 text-[32px] leading-[1.1] text-foreground md:text-[42px]">{TITEL}</h1>
              <p className="mt-4 max-w-[600px] text-[18px] leading-[1.5] text-foreground/75">
                Nein, Aktien sind halal. Haram wird eine Aktie erst durch das, was die Firma macht, oder wenn du nur auf den Kurs wettest.
              </p>
              <ul data-vorlage="haken" className="mt-5 flex flex-wrap gap-2">
                {["Sind Aktien halal?", "Welche Aktien haram sind", "Die Regeln für Zinsen", "Rechner mit echten Kursen"].map((h) => (
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

              {/* Einstieg als kleine Szene mit dem Kollegen (Elias SEO61), die Antwort in den ersten 100 Wörtern, die Zahl aus dem Rechner */}
              <div className="mt-8">
                <Text>
                  <p>Dein Kollege schwärmt von seinen Aktien. Du hast jeden Monat 100 € übrig und fragst dich: Darf ich das als Muslim überhaupt?</p>
                </Text>
                <KollegeBild />
                <Text>
                  <p>
                    {bsp
                      ? `Ja, Aktien sind halal, wenn die Firma ein halal Geschäft hat. Bei Zinsen gelten feste Grenzen, mit denen Halal ETFs arbeiten. 100 € im Monat in einem Halal ETF wären nach fünf Jahren heute rund ${bsp.wert} wert, eingezahlt hast du 6.000 €${bsp.rendite ? `. Das waren rund ${bsp.rendite} im Jahr` : ""}.`
                      : "Ja, Aktien sind halal, wenn die Firma ein halal Geschäft hat. Bei Zinsen gelten feste Grenzen, mit denen Halal ETFs arbeiten. Der Rechner weiter unten zeigt, was 100 € im Monat in einem Halal ETF gebracht hätten."}
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

                {/* Kurzer Vergleich wie /blog/ist-leasing-haram; Rechner und erste Werbung erst nach den Kernfragen, bei etwa einem Drittel (Elias SEO55) */}
                <GoogleKasten />

                <div className="mt-7">
                  <KartenReihe etikett="Kurzer Vergleich" titel="5 Wege an der Börse auf einen Blick" anzahl={WEGE.length}>
                    {WEGE.map((w, i) => (
                      <Karte key={w.weg} nummer={i + 1} kopf={w.weg} erste={i === 0}>
                        <Marke ton={w.ton}>{w.marke}</Marke>
                        <div className="mt-3 flex h-10 items-center">{w.logos}</div>
                        {w.logos && <p className="mt-1 min-h-[1.375em] text-[14px] leading-snug text-foreground/70">{w.hinweis ?? ""}</p>}
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
                  <Ueber id="aktien-halal" />
                  <Text>
                    <p>
                      Ja. Eine Aktie ist ein Anteil an einer Firma, und das ist ein ganz normales Geschäft. Gewinnt die Firma, gewinnst du mit. Verliert sie,
                      verlierst du mit. Dir gehört ein Stück von allem, was sie hat, darum ist das halal.
                    </p>
                  </Text>
                  <AnteilBild />
                  <Text>
                    <p>
                      Haram wird es, wenn du nichts besitzt und nur auf den Preis wettest. Genau das passiert beim Trading mit CFDs und Optionen. Beim Hebel kommt ein Darlehen mit Zins dazu. Mehr dazu
                      steht weiter unten bei{" "}
                      <a href="#trading" className="font-medium text-primary underline underline-offset-2 hover:no-underline">
                        Trading
                      </a>
                      .
                    </p>
                  </Text>
                  <Kernsatz>Nicht die Aktie ist das Problem, sondern was die Firma macht.</Kernsatz>
                </section>

                <section className="mt-14">
                  <Ueber id="welche-aktien" />
                  <Text>
                    <p>Aktien sind also halal. Aber nicht jede. Jede Aktie geht durch zwei Filter: erst das Geschäft der Firma, dann ihre Zinsen.</p>
                  </Text>
                  <FilterBild />
                  <H3>Welche Branchen fallen weg?</H3>
                  <Text>
                    <p>
                      Haram ist jede Aktie einer Firma, deren Geschäft verboten ist, etwa Alkohol, Glücksspiel oder Zinsgeschäft. Darüber sind sich die Gelehrten einig. Zertifizierte Halal-Fonds
                      schreiben ihre Liste sogar in den Prospekt. So sieht das bei einem echten Fonds aus:
                    </p>
                  </Text>
                  <ProspektBild />
                  <Text>
                    <p>
                      Auffällig: Auch Klonen steht drauf. Unter „Finanzwesen“ fallen Banken und Versicherungen.
                    </p>
                    <p>
                      Viele Gelehrte zählen auch Waffen und Rüstung dazu, auch wenn diese Aktien in den letzten Jahren gut liefen. Auf der Liste dieses Fonds stehen sie nicht.
                    </p>
                  </Text>
                </section>

                <section className="mt-14">
                  <Ueber id="zinsen" />
                  <Text>
                    <p>
                      Viele große Firmen haben Kredite bei Banken oder Geld auf Zinskonten. Die meisten Gelehrten sind hier streng: Macht die Firma irgendetwas mit
                      Zinsen, fällt die Aktie weg.
                    </p>
                    <p>
                      Die AAOIFI, eine Organisation für Regeln im islamischen Finanzwesen, setzt dagegen feste Grenzen. Mit solchen Grenzen arbeiten
                      zertifizierte Halal ETFs:
                    </p>
                  </Text>
                  <RegelnBild />
                  <H3>Ein Beispiel: die Eisdiele</H3>
                  <Text>
                    <p>
                      Stell dir vor, du beteiligst dich an einer Eisdiele. Sie verkauft halal Eis, aber auch Tiramisu mit Alkohol. Das sind 2 % ihrer
                      Einnahmen.
                    </p>
                  </Text>
                  <EisdieleBild />
                  <Text>
                    <p>
                      2 % liegt unter der Grenze von 5 %, nach diesen Grenzen darfst du dich also beteiligen. Von deiner Dividende gibst du aber 2 % weiter.
                      Den Betrag rechnet dir der <TL to="/bereinigungsrechner">Bereinigungsrechner</TL> aus.
                    </p>
                  </Text>
                </section>

                <Rechner />

                <AnbieterKasten titel="Depots für deinen Halal ETF" anbieter={ANBIETER} />

                <section className="mt-14">
                  <Ueber id="nicht-selbst-pruefen" />
                  <Text>
                    <p>
                      Nein. Die Regeln sind klar, und meist prüft sie schon jemand für dich. Du musst nur wissen, wo.
                    </p>
                  </Text>
                  <div className="mt-6 grid max-w-[664px] gap-3 sm:grid-cols-2">
                    <div className="flex flex-col border border-border bg-card p-5">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-[18px] font-semibold text-foreground">Halal ETF</p>
                        <EtfLogos />
                      </div>
                      <p className="mt-2 text-[15px] leading-relaxed text-foreground/80">
                        Zertifiziert, viele Firmen auf einmal, schon ab 100 € im Monat. Du musst gar nichts selbst prüfen.
                      </p>
                      <Link
                        to="/blog/halal-etf"
                        className="mt-5 inline-flex min-h-[48px] items-center justify-center bg-primary px-4 text-[16px] font-semibold text-primary-foreground hover:bg-primary/90 sm:mt-auto"
                      >
                        Zu den Halal ETFs
                      </Link>
                    </div>
                    <div className="flex flex-col border border-border bg-card p-5">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-[18px] font-semibold text-foreground">Prüf-App</p>
                        <span className="flex items-center gap-1.5">
                          <AnbieterLogo name="Zoya" domain="zoya.finance" rand />
                          <AnbieterLogo name="Musaffa" domain="musaffa.com" rand />
                        </span>
                      </div>
                      <p className="mt-2 text-[15px] leading-relaxed text-foreground/80">
                        Für einzelne Aktien: Du gibst den Namen ein, zum Beispiel Apple, und Zoya oder Musaffa zeigt dir, ob sie die Regeln erfüllt.
                      </p>
                      <div className="mt-5 flex items-center justify-between gap-3">
                        <Werbung />
                      </div>
                      <a
                        href="/out/zoya"
                        rel="sponsored nofollow"
                        className="mt-2 inline-flex min-h-[48px] items-center justify-center border border-foreground px-4 text-[16px] font-semibold text-foreground hover:bg-muted"
                      >
                        Zoya ansehen*
                      </a>
                    </div>
                  </div>
                </section>

                <AutorAufruf
                  bild={eliasPortrait}
                  etikett="In die Praxis"
                  titel="Aktien halal, ohne selbst zu prüfen"
                  text="Ein Halal ETF kauft viele Firmen auf einmal und ist zertifiziert, schon ab einem kleinen Sparplan. Im Vergleich siehst du, welches Depot dafür passt und keine Zinsen aufs Guthaben zahlt."
                  ziel="/vergleich/depot"
                  knopf={KNOPF}
                />

                <section className="mt-14">
                  <Ueber id="trading" />
                  <Text>
                    <p>
                      Es kommt darauf an, was du handelst. Kaufst du echte Aktien, gelten dieselben Regeln wie oben. Beim Trading wird aber meist etwas anderes
                      gehandelt, und das fällt weg:
                    </p>
                  </Text>
                  <ul className="mt-4 max-w-[664px] space-y-3 text-[17px] leading-[1.6] text-foreground/75">
                    {[
                      ["Hebel und Margin.", "Der Broker leiht dir Geld, das ist ein Darlehen mit Zins."],
                      ["CFDs, Optionen und Futures.", "Du kaufst keine Firma, sondern wettest auf einen Kurs."],
                      ["Leerverkäufe.", "Du verkaufst Aktien, die du dir nur geliehen hast."],
                      ["Forex.", "Du tauschst Währungen hin und her, dein Gewinn ist der Verlust eines anderen."],
                    ].map(([lead, text]) => (
                      <li key={lead} className="border-l-2 border-loss/60 pl-3">
                        <strong className="font-semibold text-foreground">{lead}</strong> {text}
                      </li>
                    ))}
                  </ul>
                  <Text>
                    <p>Bei Derivaten und beim Hebel sind sich die Gelehrten einig: Das ist haram.</p>
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
                    * Werbung: Eröffnest du über meinen Link ein Depot oder holst du Zoya, bekomme ich eine Provision, ohne Mehrkosten für dich.
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
