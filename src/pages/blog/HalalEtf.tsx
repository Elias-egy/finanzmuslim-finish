import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, Check, ChevronDown, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Seo from "@/components/Seo";
import eliasPortrait from "@/assets/elias-autor.webp";
import { kursFuerIsin, kursStand } from "@/lib/kurse";
import {
  RENDITE_STAND,
  anker,
  anlageVon,
  etfListe,
  etfsBei,
  gepruefteDepots,
  kaufbarBei,
  kaufbarStand,
  sparplanAnzahl,
  type EtfEintrag,
} from "@/data/halalEtfListe";

/**
 * „Beste Halal ETFs 2026“, Umbau SEO30 am 02.11.2026 nach dem Baublatt
 * fundament/research/quellen/SEO-GUIDE-Z2aCQ5YKaTU/UMBAU-HALAL-ETF-SEO29-BAUBLATT.md im Vault.
 * Vorbild ist nur frontal.so/blog/best-gtm-agencies; von Finanzfluss nur die drei Depots,
 * die Kapitelübersicht und der Google-Kasten (Elias SEO28). Überschriften in Newsreader, dünn;
 * kleine Etiketten in Großbuchstaben mit Abstand. Reihenfolge der Abschnitte steht im Baublatt.
 */

const SITE = "https://finanzmuslim.com";
const PFAD = "/blog/halal-etf";
const TITEL = "Beste Halal ETFs 2026: 8 im Vergleich";
const META =
  "Beste Halal ETFs 2026: 8 Islamic ETFs im Vergleich. Was sie in 1, 3 und 5 Jahren gebracht haben, was sie bei 10.000 € kosten und bei welchen Depots du sie kaufst.";
const TITELBILD = "/bilder/blog/halal-etf/beste-halal-etfs-2026.jpg";
const VEROEFFENTLICHT = { text: "16.08.2026", iso: "2026-08-16T09:00:00+02:00" };
const AKTUALISIERT = { text: "03.11.2026", iso: "2026-11-03T09:00:00+01:00" };
const INSTAGRAM = "https://www.instagram.com/finanz.muslim/";

/** Stand der Kursreihe ist der Abruftag; fällt er aufs Wochenende, gilt der Freitag davor. */
function letzterHandelstag(stand: string): string {
  const [t, m, j] = stand.split(".").map(Number);
  const d = new Date(Date.UTC(j, m - 1, t));
  while (d.getUTCDay() === 0 || d.getUTCDay() === 6) d.setUTCDate(d.getUTCDate() - 1);
  return `${String(d.getUTCDate()).padStart(2, "0")}.${String(d.getUTCMonth() + 1).padStart(2, "0")}.${d.getUTCFullYear()}`;
}
const YOUTUBE = "https://www.youtube.com/@finanz.muslim";
/** LinkedIn-Profil von Elias (SOP About Page Z. 93, 145) und Firmenseite (SEO37). */
const LINKEDIN = "https://www.linkedin.com/in/elias-el-gendy";
const LINKEDIN_FIRMA = "https://www.linkedin.com/company/finanzmuslim";
const PROFILE = [INSTAGRAM, "https://www.tiktok.com/@finanz.muslim", YOUTUBE, LINKEDIN];
const VIDEO_ID = "uO0ZnlaFolw";
/** Google „bevorzugte Quelle“: dorthin leitet auch Finanzfluss (link.finanzfluss.de, ?q=finanzfluss.de). */
const GOOGLE_QUELLE = "https://www.google.com/preferences/source?q=finanzmuslim.com";
const BIO =
  "Elias El-Gendy hat die Sachkundeprüfungen nach §\u00a034d und §\u00a034f GewO abgeschlossen. Bei TauRes in Hamburg hat er Kunden zu islamkonformen Investments beraten. Auf Instagram (@finanz.muslim) erklärt er über 15.000 Abonnenten, wie Halal Finance funktioniert.";
const RECHTSHINWEIS =
  "Dieser Beitrag dient zu Bildungszwecken, ist keine Fatwa und keine Anlageberatung. Die Reihenfolge folgt den genannten Kriterien und ersetzt keine Prüfung deiner eigenen Lage. Investitionen in Wertpapiere sind mit Risiken verbunden, bis hin zum Totalverlust. Vergangene Renditen sind kein Versprechen für die Zukunft.";
/** Lesedauer in Minuten: Wörter im Beitrag (innerText von main article bei 390) durch 200, aufgerundet. */
const LESEZEIT = 18;

/* ------------------------------------------------------------------ */
/* Inhalt                                                              */
/* ------------------------------------------------------------------ */

/**
 * `leiste`: steht im Inhaltsverzeichnis. Nur sechs, damit der Aufruf darunter im ersten Bildschirm steht (Elias SEO31).
 * `kurz`: Fassung für die Leiste, wo die H2 den Nebenbegriff trägt und dafür zu lang wäre (THEMENKARTE.md, SEO32-03).
 */
type Abschnitt = { id: string; titel: string; leiste?: boolean; kurz?: string };

// Reihenfolge seit SEO44 (03.11.2026) nach dem Vorbild halalwallet.us (Elias SEO42: Titel, Punkte, dann gleich die Tabelle):
// Liste mit Kosten in Euro und Rendite direkt nach dem Wichtigsten, der Erklärteil weiter hinten.
const ABSCHNITTE: Abschnitt[] = [
  { id: "das-wichtigste", titel: "Das Wichtigste", leiste: true },
  { id: "halal-etf-liste", titel: "Halal ETF Liste im Vergleich: Welche Halal ETFs gibt es in Deutschland?", leiste: true, kurz: "Halal ETF Liste im Vergleich" },
  { id: "rechner", titel: "Was aus deinem Geld geworden wäre", leiste: true },
  { id: "die-besten-halal-etfs", titel: "Die besten Halal ETFs 2026", leiste: true },
  { id: "welcher-passt", titel: "Welcher Halal ETF zu dir passt", leiste: true },
  { id: "was-ist-ein-halal-etf", titel: "Was ein Halal ETF ist (und was nicht)" },
  { id: "halal-etf-oder-fonds", titel: "Halal ETF oder Halal Fonds: wo der Unterschied Geld kostet" },
  { id: "wo-kaufen", titel: "Wo du die acht ETFs kaufen kannst" },
  { id: "haeufige-fragen", titel: "Häufige Fragen", leiste: true },
  { id: "naechster-schritt", titel: "Dein nächster Schritt: das passende Depot" },
];
const titelVon = (id: string) => ABSCHNITTE.find((a) => a.id === id)!.titel;
const LEISTE = ABSCHNITTE.filter((a) => a.leiste);

/**
 * Neu in SEO32 (Elias: „sehr generisch“, „viele wissen nicht mal, was Index ist“), gekürzt in SEO44 nach dem Skill
 * leser-finanzmuslim: kein Prüf-Jargon, keine Lücke als Tatsache, Zahlen in Euro (raw/2026-11-03-elias-seo42-nur-index-gremium-interessiert-niemanden.md).
 */
const WICHTIGSTES: { lead: string; text: ReactNode }[] = [
  {
    lead: "Acht Halal ETFs im Vergleich, alle in Deutschland zu kaufen.",
    text: "Der bekannteste ist der iShares MSCI World Islamic, seit 2007 am Markt und bei 27 Depots zu haben.",
  },
  {
    lead: "Banken und Versicherungen fliegen raus.",
    text: "Ein normaler ETF wie der MSCI World kauft sie mit. Ein Halal ETF lässt sie weg, ebenso Firmen mit zu vielen Schulden auf Zinsen.",
  },
  {
    lead: "Sie kosten 30 bis 75 € im Jahr bei 10.000 €.",
    text: "Platz 1 liegt mit 0,30 % am unteren Ende. Dazu kommen nur die Gebühren deines Depots, bei vielen 0\u00a0€.",
  },
  {
    lead: "Auch beim Depot zählen die Zinsen.",
    text: (
      <>
        Viele Depots zahlen Zinsen auf das Geld, das dort liegt. Traders Place und Scalable zahlen 0 %, Smartbroker+ zahlt
        Zinsen nur auf ein eigenes Zinskonto. Alle weiteren stehen im <TL to="/vergleich/depot">Depot-Vergleich</TL>.
      </>
    ),
  },
  {
    lead: "Ein kleiner Rest wird gespendet.",
    text: (
      <>
        Bei den vier iShares-ETFs macht das der Fonds für dich. So rechnest du es selbst:{" "}
        <TL to="/blog/ertraege-reinigen">Aktienbereinigung</TL>.
      </>
    ),
  },
];

const PASST: { wenn: string; achte: string; platz: number }[] = [
  { wenn: "Wenn du mit einem Sparplan anfängst", achte: "Sparplan bei deinem Depot", platz: 1 },
  { wenn: "Wenn Gewinne im Fonds bleiben sollen", achte: "thesaurierend, also ohne Ausschüttung", platz: 2 },
  { wenn: "Wenn du Schwellenländer dazu willst", achte: "nur als kleiner Teil neben Platz 1", platz: 4 },
  { wenn: "Wenn ein Teil nicht in Aktien liegen soll", achte: "der Kurs des Dollars wirkt mit", platz: 8 },
];

type Frage = { frage: string; antwort: string; link?: { to: string; text: string } };

const tradeRepublicZahl = etfListe.filter((e) => kaufbarBei(e.isin).includes("Trade Republic")).length;
const ohneTradeRepublic = etfListe.filter((e) => !kaufbarBei(e.isin).includes("Trade Republic")).map((e) => e.name);

const FRAGEN: Frage[] = [
  {
    frage: "Ist ein ETF halal oder haram?",
    antwort:
      "Entscheidend ist, was der ETF kauft. Ein normaler ETF kauft auch Banken und Versicherungen. Ein Islamic ETF kauft nur Aktien oder Sukuk, die eine Shariah-Prüfung bestehen.",
  },
  {
    frage: "Sind ETFs haram?",
    antwort:
      "Das hängt an dem, was ein ETF kauft. Der normale MSCI World enthält Banken und Versicherungen. Die acht ETFs hier kaufen nur, was eine Shariah-Prüfung besteht.",
  },
  {
    frage: "Welche Halal ETFs gibt es bei Trade Republic?",
    antwort: `Laut Wertpapiersuche von Trade Republic kannst du ${tradeRepublicZahl} der 8 ETFs dieser Liste kaufen, alle außer ${ohneTradeRepublic.join(
      ", ",
    )}.`,
    link: { to: "/vergleich/depot", text: "Zum Depot-Vergleich" },
  },
  {
    frage: "Ist der MSCI World halal?",
    antwort:
      "Der normale MSCI World filtert nicht nach islamischen Regeln und enthält Banken und Versicherungen. Die geprüfte Fassung ist der MSCI World Islamic, den du mit Platz 1 kaufst.",
    link: { to: "/halal-anlagen/ishares-msci-world-islamic", text: "iShares MSCI World Islamic ansehen" },
  },
  {
    frage: "Welche ETFs sind scharia-konform?",
    antwort:
      "So nennen sich ETFs mit Islamic oder Shariah im Namen. Alle acht in dieser Liste kaufen nur, was eine Shariah-Prüfung besteht.",
  },
  {
    frage: "Wie prüfe ich, ob ein ETF halal ist?",
    antwort:
      "Such die ISIN, nicht den Namen, in unserer Datenbank. Dort steht bei jeder Anlage, wer sie prüft.",
    link: { to: "/halal-anlagen", text: "Zur Datenbank der Halal-Anlagen" },
  },
  {
    frage: "Was kostet ein Halal ETF im Jahr?",
    antwort:
      "Auf dieser Liste 0,30 bis 0,75 % im Jahr, bei 10.000 € also 30 bis 75 €. Dazu kommen die Gebühren deines Depots, bei vielen ab 0 €.",
  },
  {
    frage: "Muss ich die Erträge eines Halal ETFs reinigen?",
    antwort:
      "Ja, den kleinen unreinen Anteil gibst du als Spende weiter, wenn der Fonds es nicht selbst tut. Bei den vier iShares-ETFs dieser Liste spendet ihn laut Verkaufsprospekt der Fonds. Bei den anderen sieh im Verkaufsprospekt nach, ob der Fonds spendet. Wenn nicht, gibst du den Anteil selbst weiter.",
    link: { to: "/blog/ertraege-reinigen", text: "So rechnest du die Reinigung" },
  },
];

// Traders Place: Wortmarke statt App-Zeichen, sonst ist die Marke nicht zu erkennen (Prüfer SEO31)
const DREIER: { anbieter: string; kaufbarName: string; logo: string; out: string }[] = [
  { anbieter: "Traders Place", kaufbarName: "Traders Place", logo: "traders-place-wortmarke.svg", out: "/out/traders-place" },
  { anbieter: "Smartbroker+", kaufbarName: "Smartbroker+", logo: "smartbroker", out: "/out/smartbroker" },
  { anbieter: "Scalable Capital", kaufbarName: "Scalable Capital", logo: "scalable", out: "/out/scalable" },
];

// Sparplan je Depot nur aus den Belegen der Liste (sparplanBei). Scalable ohne die PRIME+-Hälfte (Elias SEO42: „Nur Scalable Prime
// und sowas. Das macht alles gar keinen Sinn“, raw/2026-11-03-elias-seo42-leser-profil-skill-tabelle-langweilig.md); PRIME+ zählt als Scalable.
function sparplanZeile(anbieter: string): string {
  const zahl = (name: string) => etfListe.filter((e) => e.sparplanBei.includes(name)).length;
  if (anbieter === "Scalable Capital") return `Sparplan auf ${etfListe.filter((e) => e.sparplanBei.some((x) => x.startsWith("Scalable"))).length} von 8`;
  // Traders Place: Elias hat im eigenen Depot nachgesehen, „Sparplan ist drin“ (SEO31, 02.11.2026),
  // für Platz 5 und 6 nicht (SEO35, raw/2026-11-03-elias-seo35-antworten-linkedin-fragebogen.md)
  if (anbieter === "Traders Place") return "Sparplan auf 6 von 8";
  const n = zahl(anbieter);
  return n === 0 ? "Sparplan auf diese ETFs noch nicht nachgesehen" : `Sparplan auf ${n} von 8`;
}

const PASST_DAZU: { to: string; name: string; text: string }[] = [
  { to: "/blog/girokonto-ohne-zinsen", name: "Girokonto ohne Zinsen", text: "Dein Konto zinsfrei in sechs Handgriffen." },
  { to: "/blog/halal-gold-kaufen", name: "Halal Gold kaufen", text: "Wo du Gold kaufst und worauf du achtest." },
  { to: "/blog/sind-aktien-haram", name: "Sind Aktien halal?", text: "Welche Firmen ein Halal ETF weglässt." },
  { to: "/blog/ertraege-reinigen", name: "Aktienbereinigung", text: "Rechne aus, welchen Anteil du weitergibst." },
];

/* ------------------------------------------------------------------ */
/* Kleine Bausteine                                                    */
/* ------------------------------------------------------------------ */

function TL({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} className="font-medium text-primary underline underline-offset-2 hover:no-underline">
      {children}
    </Link>
  );
}

const H2 = ({ id }: { id: string }) => (
  <h2 id={id} className="font-titel scroll-mt-24 text-[25px] leading-[1.2] text-foreground md:text-[28px]">
    {titelVon(id)}
  </h2>
);

const Text = ({ children }: { children: ReactNode }) => (
  <div className="mt-4 max-w-[664px] space-y-4 text-[17px] leading-[1.65] text-foreground/75">{children}</div>
);

/** Kleines Etikett in Großbuchstaben mit Abstand, wie frontal „QUICK COMPARE“, „BEST FOR“. */
const Etikett = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <p className={`font-mono text-[12px] uppercase tracking-[0.14em] text-muted-foreground ${className}`}>{children}</p>
);

const Werbung = () => <Etikett>Werbung</Etikett>;

const gross = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Fondsgröße kurz wie halalwallet „$3.39B“: ab 1.000 Mio. in Mrd. mit einer Stelle (Elias SEO45: Tabellen wie halalwallet). */
const groesseKurz = (mio: number) =>
  mio >= 1000 ? `${(mio / 1000).toLocaleString("de-DE", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}\u00a0Mrd.\u00a0€` : `${mio.toLocaleString("de-DE")}\u00a0Mio.\u00a0€`;
/** Linktext nach Art der Quelle: ein Prospekt oder eine Methodik ist kein Zertifikat (Halal-Tor SEO45). */
const quelleWort = (url: string) =>
  url.includes("prospectus") ? "Verkaufsprospekt ansehen" : url.includes("msci.com") ? "Methodik ansehen" : url.includes("factsheet") ? "Factsheet ansehen" : "Zertifikat ansehen";
/** Was die Positionen sind: beim Sukuk-ETF Sukuk, sonst Aktien. */
const positionenWort = (e: EtfEintrag) => (anlageVon(e.isin).kategorie === "sukuk" ? "Sukuk" : "Aktien");
const logoPfad = (datei: string) => `/bilder/blog/halal-etf/logos/${datei.includes(".") ? datei : `${datei}.webp`}`;

/** YouTube erst nach dem Klick laden: vorher kein Kontakt zu Google. */
const Video = () => {
  const [an, setAn] = useState(false);
  return (
    <figure className="mt-5">
      <div className="relative aspect-video overflow-hidden rounded-lg bg-black">
        {an ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&rel=0`}
            title="Sind ETFs Halal oder Haram? Video von Finanz Muslim"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setAn(true)}
            className="group absolute inset-0 h-full w-full"
            aria-label="Video abspielen: Sind ETFs Halal oder Haram?"
          >
            <img
              src="/bilder/blog/halal-etf/video-etfs-halal-oder-haram.jpg"
              alt="Vorschaubild des Videos Sind ETFs Halal oder Haram"
              width={480}
              height={360}
              loading="lazy"
              className="h-full w-full object-cover opacity-90"
            />
            <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 shadow-lg transition-transform group-hover:scale-105">
              <Play className="ml-1 h-7 w-7 fill-primary text-primary" aria-hidden />
            </span>
          </button>
        )}
      </div>
      <figcaption className="mt-2 text-[13px] text-muted-foreground">
        Erst beim Abspielen lädt YouTube. Auf YouTube:{" "}
        <a href={`https://www.youtube.com/watch?v=${VIDEO_ID}`} className="underline" target="_blank" rel="noopener noreferrer">
          Sind ETFs Halal oder Haram?
        </a>
      </figcaption>
    </figure>
  );
};

/** Welcher Abschnitt gerade im Blick ist, für das Inhaltsverzeichnis links. */
const useAktiv = (ids: string[]) => {
  const [aktiv, setAktiv] = useState<string | null>(null);
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const b = new IntersectionObserver(
      (e) => {
        const s = e.filter((x) => x.isIntersecting).sort((a, c) => a.boundingClientRect.top - c.boundingClientRect.top);
        if (s[0]) setAktiv(s[0].target.id);
      },
      { rootMargin: "-100px 0px -60% 0px", threshold: 0 },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) b.observe(el);
    });
    return () => b.disconnect();
  }, [ids]);
  return aktiv;
};

/* ------------------------------------------------------------------ */
/* Schema als ein @graph (VORLAGEN.md 0.5 und 1.3, SCHEMA.md)          */
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
        image: `${SITE}${TITELBILD}`,
        mainEntityOfPage: url,
        url,
        author: { "@id": `${SITE}/ueber-mich#elias` },
        publisher: { "@id": `${SITE}/#organization` },
        isPartOf: { "@type": "Blog", "@id": `${SITE}/blog#blog`, name: "finanzmuslim Blog", url: `${SITE}/blog` },
        datePublished: VEROEFFENTLICHT.iso,
        dateModified: AKTUALISIERT.iso,
        inLanguage: "de-DE",
      },
      {
        "@type": "ItemList",
        "@id": `${url}#liste`,
        name: "Die besten Halal ETFs 2026",
        numberOfItems: etfListe.length,
        itemListOrder: "https://schema.org/ItemListOrderAscending",
        itemListElement: etfListe.map((e) => ({
          "@type": "ListItem",
          position: e.platz,
          name: e.name,
          url: `${url}#${anker(e)}`,
        })),
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#fragen`,
        mainEntity: FRAGEN.map((f) => ({
          "@type": "Question",
          name: f.frage,
          acceptedAnswer: { "@type": "Answer", text: f.antwort },
        })),
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
        email: "elias@finanzmuslim.com",
        worksFor: { "@id": `${SITE}/#organization` },
        knowsAbout: ["Halal Investieren", "Islamic Finance", "ETF", "Sukuk", "Riba"],
        sameAs: PROFILE,
      },
      {
        "@type": "Organization",
        "@id": `${SITE}/#organization`,
        name: "finanzmuslim",
        url: SITE,
        logo: `${SITE}/apple-touch-icon.png`,
        description:
          "Bildung für islamkonformes (halal) Investieren: Guides, Rechner und Kriterien-Checks für Muslime in Deutschland.",
        founder: { "@id": `${SITE}/ueber-mich#elias` },
        contactPoint: { "@type": "ContactPoint", email: "elias@finanzmuslim.com", contactType: "customer support" },
        sameAs: [INSTAGRAM, "https://www.tiktok.com/@finanz.muslim", YOUTUBE, LINKEDIN_FIRMA],
      },
    ],
  };
};

/* ------------------------------------------------------------------ */
/* Kurzer Vergleich: acht Karten wie frontal „Quick compare“           */
/* ------------------------------------------------------------------ */

const RASTER = {
  backgroundImage:
    "linear-gradient(hsl(var(--border) / 0.7) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border) / 0.7) 1px, transparent 1px)",
  backgroundSize: "14px 14px",
};

const Klappzeile = ({ titel, zahl, children }: { titel: string; zahl?: number; children: ReactNode }) => (
  <details className="group border-t border-border">
    <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between py-3 font-mono text-[12px] uppercase tracking-[0.14em] text-foreground [&::-webkit-details-marker]:hidden">
      {titel}
      <span className="flex items-center gap-2 text-muted-foreground">
        {zahl}
        <ChevronDown className="h-3.5 w-3.5 text-foreground transition-transform group-open:rotate-180" aria-hidden />
      </span>
    </summary>
    <div className="pb-3 text-[14px] leading-relaxed text-foreground/75">{children}</div>
  </details>
);

/** Depot-Logos neben „Kaufbar bei“ (Elias SEO31): diese zuerst, wenn der ETF dort kaufbar ist. */
const DEPOT_LOGOS: [string, string][] = [
  ["Traders Place", "tradersplace.de.png"],
  ["Smartbroker+", "smartbrokerplus.de.png"],
  ["Scalable Capital", "scalable.capital.png"],
  ["Trade Republic", "traderepublic.com.png"],
  ["XTB", "xtb.com.png"],
];
const depotLogos = (isin: string) => {
  const bei = kaufbarBei(isin);
  return DEPOT_LOGOS.filter(([name]) => bei.includes(name)).slice(0, 3);
};

const Karte = ({ e }: { e: EtfEintrag }) => {
  const a = anlageVon(e.isin);
  const logos = depotLogos(e.isin);
  const renditen: [string, string | null][] = [
    ["1 Jahr", e.rendite1J],
    ["3 Jahre", e.rendite3J],
    ["5 Jahre", e.rendite5J],
  ];
  const voll = e.kurz ?? e.name;
  const kurzname = voll.startsWith(`${e.anbieter} `) ? voll.slice(e.anbieter.length + 1) : voll;
  return (
    <li className="flex w-[220px] shrink-0 snap-start flex-col border border-border bg-card">
      <div
        className={`relative flex h-[104px] items-center justify-center gap-2.5 border-b border-border bg-background ${
          e.platz === 1 ? "shadow-[inset_0_2px_0_hsl(var(--primary))]" : ""
        }`}
        style={RASTER}
      >
        <span className="absolute left-3 top-3 border border-border bg-background px-1.5 py-0.5 font-mono text-[12px] tabular-nums text-foreground">
          {String(e.platz).padStart(2, "0")}
        </span>
        <img src={logoPfad(e.logo)} alt="" aria-hidden="true" width={40} height={40} className="h-10 w-10 object-contain" />
        <span className="text-[16px] font-semibold text-foreground">{e.anbieter}</span>
      </div>
      <div className="flex flex-1 flex-col px-4 pt-4">
        <p className="min-h-[2.75em] text-[14px] font-semibold leading-snug text-foreground">{kurzname}</p>
        <Etikett className="mt-4">Am besten für</Etikett>
        <p className="font-titel mt-1.5 text-[20px] leading-[1.2] text-foreground">{gross(e.amBestenFuer)}</p>
        <div className="mt-4 space-y-3">
          <div>
            <Etikett>Kaufbar bei</Etikett>
            <div className="mt-1 flex items-center gap-2.5">
              <p className="text-[15px] font-semibold tabular-nums text-foreground">{kaufbarBei(e.isin).length}&nbsp;Depots</p>
              <span className="flex items-center">
                {logos.map(([name, datei]) => (
                  <img
                    key={name}
                    src={`/guides/assets/logos/${datei}`}
                    alt={name}
                    title={name}
                    width={22}
                    height={22}
                    loading="lazy"
                    className="-ml-1 h-[22px] w-[22px] rounded-full border-2 border-card bg-background object-contain first:ml-0"
                  />
                ))}
                <span className="ml-1 text-[14px] text-muted-foreground" aria-hidden="true">…</span>
              </span>
            </div>
          </div>
          {/* Vier Kacheln wie die Fondskarten bei halalwallet (Fee, AUM, Holdings), Elias SEO45 */}
          <dl className="grid grid-cols-2 gap-x-3 gap-y-3">
            {[
              ["Kosten", a.kostenLabel, `${euro(a.kosten * 100)} im Jahr`],
              ["Größe", groesseKurz(e.groesseMio)],
              [positionenWort(e), e.positionen.toLocaleString("de-DE")],
              ["Seit", a.auflage?.slice(-4) ?? "–"],
            ].map(([k, w, unter]) => (
              <div key={k}>
                <dt>
                  <Etikett>{k}</Etikett>
                </dt>
                <dd className="mt-1 whitespace-nowrap text-[15px] font-semibold tabular-nums text-foreground">
                  {w}
                  {unter && <span className="block text-[13px] font-normal text-muted-foreground">{unter}</span>}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <a
          href={`#${anker(e)}`}
          className="mb-4 mt-5 flex min-h-[44px] items-center justify-center gap-1.5 border border-border bg-muted/60 py-2.5 font-mono text-[12px] uppercase tracking-[0.12em] text-foreground transition-colors hover:border-foreground sm:mt-auto"
        >
          Zum Eintrag
          <ArrowDown className="h-3.5 w-3.5" aria-hidden />
        </a>
        <div className="sm:mt-0">
          <Klappzeile titel="Rendite">
            <dl className="grid grid-cols-3 gap-2">
              {renditen.map(([zeit, wert]) => (
                <div key={zeit}>
                  <dt className="font-mono text-[12px] uppercase tracking-[0.12em] text-muted-foreground">{zeit}</dt>
                  <dd className={`mt-0.5 whitespace-nowrap font-semibold tabular-nums ${wert ? "text-gain" : "text-muted-foreground"}`}>
                    {wert ?? "–"}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-2 text-[12px] leading-snug text-muted-foreground">
              {e.seitAuflage ? `Seit Auflage ${e.seitAuflage}. ` : ""}justETF, Stand {RENDITE_STAND}. Zählt nicht für den Platz.
            </p>
          </Klappzeile>
          <Klappzeile titel="Dafür" zahl={e.dafuer.length}>
            <ul className="space-y-1">
              {e.dafuer.map((d) => (
                <li key={d}>+ {d}</li>
              ))}
            </ul>
          </Klappzeile>
          <Klappzeile titel="Dagegen" zahl={e.dagegen.length}>
            <ul className="space-y-1">
              {e.dagegen.map((d) => (
                <li key={d}>− {d}</li>
              ))}
            </ul>
          </Klappzeile>
          <Klappzeile titel="Geprüft von">
            {e.geprueftText}{" "}
            <a href={e.pruefLink ?? a.zertifikatLink} target="_blank" rel="noopener noreferrer" className="font-medium text-primary underline underline-offset-2">
              {quelleWort(e.pruefLink ?? a.zertifikatLink)}
            </a>
          </Klappzeile>
        </div>
      </div>
    </li>
  );
};

/** Am Handy wischen, am Laptop zwei Pfeile wie frontal; drei Karten ganz, die vierte lugt. */
const KurzerVergleich = () => {
  const reihe = useRef<HTMLUListElement>(null);
  const [rand, setRand] = useState({ links: true, rechts: false });
  const [karte, setKarte] = useState(0);
  useEffect(() => {
    const el = reihe.current;
    if (!el) return;
    const messen = () => {
      setRand({ links: el.scrollLeft <= 2, rechts: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2 });
      setKarte(Math.min(etfListe.length - 1, Math.round(el.scrollLeft / (220 + 12))));
    };
    messen();
    el.addEventListener("scroll", messen, { passive: true });
    window.addEventListener("resize", messen);
    return () => {
      el.removeEventListener("scroll", messen);
      window.removeEventListener("resize", messen);
    };
  }, []);
  const blaettern = (richtung: number) => {
    const el = reihe.current;
    if (el) el.scrollBy({ left: richtung * (220 + 12), behavior: "smooth" });
  };
  const pfeil =
    "flex h-11 w-11 items-center justify-center border border-border bg-background text-foreground transition-colors hover:border-foreground disabled:opacity-35 disabled:hover:border-border";
  return (
    <section aria-labelledby="kurzer-vergleich" data-vorlage="quick-compare" className="mt-7">
      <div className="flex items-end justify-between gap-4">
        <div>
          <Etikett>Kurzer Vergleich</Etikett>
          <p id="kurzer-vergleich" className="font-titel mt-2 text-[22px] leading-tight text-foreground md:text-[24px]">
            {etfListe.length} Halal ETFs auf einen Blick
          </p>
        </div>
        <div className="hidden gap-2 sm:flex">
          <button type="button" onClick={() => blaettern(-1)} disabled={rand.links} aria-label="Vorherige Karten" className={pfeil}>
            <ChevronLeft className="h-4 w-4" aria-hidden />
          </button>
          <button type="button" onClick={() => blaettern(1)} disabled={rand.rechts} aria-label="Nächste Karten" className={pfeil}>
            <ChevronRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>
      <ul
        ref={reihe}
        className="-mx-4 mt-5 flex snap-x snap-mandatory scroll-px-4 items-stretch gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:scroll-px-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {etfListe.map((e) => (
          <Karte key={e.isin} e={e} />
        ))}
      </ul>
      {/* Am Handy sieht man sonst nur eine von acht Karten (Seiten-Prüfer SEO46) */}
      <div className="mt-3 flex items-center gap-3 sm:hidden" aria-hidden="true">
        <span className="flex gap-1.5">
          {etfListe.map((e, i) => (
            <span key={e.isin} className={`h-1.5 w-1.5 rounded-full ${i === karte ? "bg-foreground" : "bg-border"}`} />
          ))}
        </span>
        <span className="text-[13px] text-muted-foreground">
          {karte + 1} von {etfListe.length}, wischen
        </span>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Google-Kasten, Rechner, Depots                                       */
/* ------------------------------------------------------------------ */

const GoogleG = ({ className = "h-7 w-7" }: { className?: string }) => (
  <svg viewBox="0 0 48 48" className={`${className} shrink-0`} aria-hidden>
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
  </svg>
);

/** Google-Kasten (Elias SEO32-02: „größer, damit der auch wirklich auffällt“): hellblau wie ein Aufruf, großes G, Knopf. */
const GoogleKasten = () => (
  <a
    href={GOOGLE_QUELLE}
    target="_blank"
    rel="noopener noreferrer"
    data-vorlage="google-quelle"
    className="group mt-8 flex flex-wrap items-center gap-x-5 gap-y-4 border border-primary/25 bg-accent px-5 py-5 transition-colors hover:border-primary/60 md:flex-nowrap md:px-6 md:py-6"
  >
    <span className="flex h-14 w-14 shrink-0 items-center justify-center border border-border bg-background">
      <GoogleG className="h-8 w-8" />
    </span>
    <span className="min-w-0 flex-1 basis-[200px]">
      <span className="block text-[18px] font-semibold leading-snug text-foreground md:text-[19px]">
        finanzmuslim als bevorzugte Quelle bei Google hinzufügen
      </span>
      <span className="mt-1 block text-[15px] leading-snug text-muted-foreground">Dann zeigt dir Google unsere Vergleiche öfter.</span>
    </span>
    <span className="inline-flex w-full items-center justify-center gap-1.5 bg-primary px-5 py-3 text-[15px] font-semibold text-primary-foreground transition-colors group-hover:bg-primary-hover md:w-auto">
      Hinzufügen
      <ChevronRight className="h-4 w-4" aria-hidden />
    </span>
  </a>
);

const euro = (n: number) => `${Math.round(n).toLocaleString("de-DE")}\u00a0€`;
const prozent = (r: string) => Number(r.replace(/[^\d,-]/g, "").replace(",", ".")) / 100;

const ZEITRAEUME = [
  { jahre: 1, feld: "rendite1J" },
  { jahre: 3, feld: "rendite3J" },
  { jahre: 5, feld: "rendite5J" },
] as const;

type Punkt = { x: string; t: number; eingezahlt: number; wert: number };
type Ergebnis = { eingezahlt: number; wert: number; kurve: Punkt[] } | null;
type Feld = (typeof ZEITRAEUME)[number]["feld"];

const MONATE = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
const monatKurz = (ym: string) => {
  const [j, m] = ym.split("-").map(Number);
  return `${MONATE[m - 1]} ${String(j).slice(2)}`;
};
const vorJahren = (j: number) => (j === 0 ? "heute" : `vor ${j} J.`);

/**
 * Rechner (Elias SEO31, Kurve zurück SEO32-01): Betrag monatlich oder einmalig, Ergebnis nach 1, 3 und 5 Jahren,
 * ETF über Logos. Eingezahlt ist je Zeitraum bei allen ETFs gleich. Die Kachel wählt den Zeitraum der Kurve,
 * der letzte Punkt der Kurve ist immer die Zahl der Kachel.
 * Einmalig: Rendite von justETF mit Ausschüttungen (dieselben Werte wie in den Karten und der Tabelle). Die Kurve
 * nimmt nur diese Werte: Wert vor k Jahren = Endwert geteilt durch das Wachstum der letzten k Jahre. Die Kursreihe
 * weicht von justETF ab (Börsenplatz, Ausschüttungen), darum nicht für Einmalig.
 * Monatlich: je Monatskurs eine Rate, die letzten 12, 36 oder 60 Einträge der Reihe; der letzte Eintrag ist der Kurs
 * vom Stand der Kursdatei. Ist die Reihe kürzer, gibt es den ETF noch nicht so lange: Strich.
 */
const rechnen = (e: EtfEintrag, betrag: number, art: "monat" | "einmal", jahre: number, feld: Feld): Ergebnis => {
  if (art === "einmal") {
    const r = e[feld];
    if (!r) return null;
    const ende = betrag * (1 + prozent(r));
    const stuetzen = ZEITRAEUME.filter((z) => z.jahre < jahre && e[z.feld]).map((z) => ({
      jahre: z.jahre,
      wert: ende / (1 + prozent(e[z.feld]!)),
    }));
    const kurve: Punkt[] = [
      { x: vorJahren(jahre), t: -jahre, eingezahlt: betrag, wert: betrag },
      ...stuetzen.sort((a, b) => b.jahre - a.jahre).map((p) => ({ x: vorJahren(p.jahre), t: -p.jahre, eingezahlt: betrag, wert: p.wert })),
      { x: vorJahren(0), t: 0, eingezahlt: betrag, wert: ende },
    ];
    return { eingezahlt: betrag, wert: ende, kurve };
  }
  const reihe = kursFuerIsin(e.isin)?.reihe ?? [];
  const n = jahre * 12;
  if (reihe.length < n) return null;
  let anteile = 0;
  const kurve = reihe.slice(-n).map(([monat, kurs], i) => {
    anteile += betrag / kurs;
    return { x: monat, t: i, eingezahlt: (i + 1) * betrag, wert: anteile * kurs };
  });
  const letzter = reihe[reihe.length - 1][1];
  return { eingezahlt: n * betrag, wert: anteile * letzter, kurve };
};

const achseEuro = (v: number) =>
  v >= 10_000 ? `${(v / 1000).toLocaleString("de-DE", { maximumFractionDigits: 0 })} Tsd.` : Math.round(v).toLocaleString("de-DE");

const Kurve = ({ erg, art }: { erg: NonNullable<Ergebnis>; art: "monat" | "einmal" }) => {
  const daten = erg.kurve.map((p) => ({ ...p, wert: Math.round(p.wert) }));
  const monatlich = art === "monat";
  // Monatlich: eine Kategorie je Monat. Einmalig: Zeitachse in Jahren, damit „vor 1 J.“ bis „heute“ halb so breit ist wie „vor 3 J.“ bis „vor 1 J.“.
  const ticks = monatlich
    ? daten.filter((d, i) => (daten.length <= 12 ? i % 3 === 0 : d.x.endsWith("-01"))).map((d) => d.x)
    : daten.map((d) => d.t);
  const farbe = erg.wert >= erg.eingezahlt ? "gain" : "loss";
  return (
    <div className="mt-5 border border-border bg-background px-2 pb-2 pt-3 sm:px-3">
      <div className="flex flex-wrap gap-x-5 gap-y-1 px-1 text-[13px] text-muted-foreground" aria-hidden>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/70" /> Eingezahlt
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className={`h-2.5 w-2.5 rounded-full ${farbe === "gain" ? "bg-gain" : "bg-loss"}`} /> Wert
        </span>
      </div>
      <div
        className="mt-2 h-[180px] sm:h-[220px]"
        role="img"
        aria-label={`Verlauf über ${daten.length > 1 ? "den gewählten Zeitraum" : "den Zeitraum"}: eingezahlt ${euro(erg.eingezahlt)}, heute wert ${euro(erg.wert)}`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={daten} margin={{ top: 6, right: monatlich ? 8 : 22, bottom: 0, left: 0 }}>
            <CartesianGrid stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey={monatlich ? "x" : "t"}
              type={monatlich ? "category" : "number"}
              domain={monatlich ? undefined : ["dataMin", "dataMax"]}
              ticks={ticks}
              interval={0}
              tickFormatter={(x: string | number) =>
                monatlich ? (daten.length <= 12 ? monatKurz(String(x)) : String(x).slice(0, 4)) : vorJahren(-Number(x))
              }
              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              width={50}
              tickFormatter={achseEuro}
              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
              domain={[0, "auto"]}
            />
            <Tooltip
              formatter={(v: number, n: string) => [euro(v), n === "wert" ? "Wert" : "Eingezahlt"]}
              labelFormatter={(x: string | number) => (monatlich ? monatKurz(String(x)) : vorJahren(-Number(x)))}
              contentStyle={{ fontSize: 13, borderRadius: 4 }}
            />
            <Area
              type={monatlich ? "monotone" : "linear"}
              dataKey="eingezahlt"
              stroke="hsl(var(--muted-foreground))"
              fill="hsl(var(--muted))"
              strokeWidth={1.5}
              isAnimationActive={false}
            />
            <Area
              type={monatlich ? "monotone" : "linear"}
              dataKey="wert"
              stroke={`hsl(var(--${farbe}))`}
              fill={`hsl(var(--${farbe}-soft))`}
              fillOpacity={0.7}
              strokeWidth={2}
              dot={monatlich ? false : { r: 3, fill: `hsl(var(--${farbe}))`, strokeWidth: 0 }}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const Rechner = () => {
  const [isin, setIsin] = useState(etfListe[0].isin);
  const [eingabe, setEingabe] = useState("100");
  const [art, setArt] = useState<"monat" | "einmal">("monat");
  const [gewaehlt, setGewaehlt] = useState(5);
  const e = etfListe.find((x) => x.isin === isin)!;
  const betrag = Math.min(Math.max(Number(eingabe.replace(/\D/g, "")) || 0, 0), 1_000_000);
  const ergebnisse = ZEITRAEUME.map(({ jahre, feld }) => ({ jahre, erg: rechnen(e, betrag, art, jahre, feld) }));
  // Gibt es den gewählten Zeitraum für diesen ETF nicht, zeigt die Kurve den längsten, den es gibt.
  const aktiv =
    ergebnisse.find((x) => x.jahre === gewaehlt && x.erg) ?? [...ergebnisse].reverse().find((x) => x.erg) ?? null;
  const schalter = (an: boolean) =>
    `flex-1 px-3 py-2.5 text-[15px] font-semibold transition-colors ${an ? "bg-foreground text-background" : "bg-background text-foreground hover:bg-muted"}`;
  return (
    <section className="mt-12">
      <H2 id="rechner" />
      <Text>
        <p>Gib einen Betrag ein und wähl einen ETF. Du siehst, was daraus geworden wäre, wenn du vor 1, 3 oder 5 Jahren angefangen hättest.</p>
      </Text>
      <div className="mt-5 border border-border bg-card p-4 md:p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="rechner-betrag" className="block">
              <Etikett>Betrag</Etikett>
            </label>
            <div className="mt-1.5 flex items-center border border-border bg-background focus-within:border-foreground">
              <input
                id="rechner-betrag"
                inputMode="numeric"
                value={eingabe}
                onChange={(x) => setEingabe(x.target.value.replace(/[^\d.]/g, ""))}
                className="w-full bg-transparent px-3 py-2.5 text-[16px] tabular-nums text-foreground outline-none"
              />
              <span className="pr-3 text-[16px] text-muted-foreground">€</span>
            </div>
          </div>
          <div>
            <Etikett>Wie oft</Etikett>
            <div className="mt-1.5 flex border border-border" role="group" aria-label="Wie oft du einzahlst">
              <button type="button" aria-pressed={art === "monat"} onClick={() => setArt("monat")} className={schalter(art === "monat")}>
                Jeden Monat
              </button>
              <button type="button" aria-pressed={art === "einmal"} onClick={() => setArt("einmal")} className={`border-l border-border ${schalter(art === "einmal")}`}>
                Einmalig
              </button>
            </div>
          </div>
        </div>

        <Etikett className="mt-5">ETF</Etikett>
        {/* Am Handy eine Reihe zum Wischen statt vier Zeilen Kacheln, bündig mit Betrag und Ergebnis (Elias SEO35), ab sm das Raster */}
        <div
          className="mt-1.5 flex snap-x gap-2 overflow-x-auto pb-1 [scrollbar-width:none] sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 md:grid-cols-4 [&::-webkit-scrollbar]:hidden"
          role="group"
          aria-label="ETF wählen"
        >
          {etfListe.map((x) => {
            const an = x.isin === isin;
            const voll = x.kurz ?? x.name;
            const kurz = voll.startsWith(`${x.anbieter} `) ? voll.slice(x.anbieter.length + 1) : voll;
            return (
              <button
                key={x.isin}
                type="button"
                aria-pressed={an}
                onClick={() => setIsin(x.isin)}
                className={`flex min-h-[52px] w-[140px] shrink-0 snap-start items-center gap-2 border px-2.5 py-2 text-left transition-colors sm:w-auto ${
                  an ? "border-foreground bg-background shadow-[inset_0_0_0_1px_hsl(var(--foreground))]" : "border-border bg-background hover:border-foreground/50"
                }`}
              >
                <img src={logoPfad(x.logo)} alt="" aria-hidden="true" width={24} height={24} className="h-6 w-6 shrink-0 object-contain" />
                <span className="min-w-0 text-[13px] leading-tight text-foreground">
                  <span className="font-mono text-[12px] text-muted-foreground">{String(x.platz).padStart(2, "0")}</span> {kurz}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 sm:mt-5" aria-live="polite">
          {ergebnisse.map(({ jahre, erg }) => {
            const an = aktiv?.jahre === jahre;
            return (
              <button
                key={jahre}
                type="button"
                disabled={!erg}
                aria-pressed={an}
                onClick={() => setGewaehlt(jahre)}
                className={`flex min-w-0 flex-col justify-start border px-2.5 py-2.5 text-left transition-colors disabled:cursor-default sm:block sm:px-4 sm:py-3.5 ${
                  an ? "border-foreground bg-background shadow-[inset_0_0_0_1px_hsl(var(--foreground))]" : "border-border bg-background enabled:hover:border-foreground/50"
                }`}
              >
                {/* Am Handy drei Kacheln in einer Reihe (Elias SEO35): Zeitraum, Wert, eingezahlt untereinander über `order`;
                    ab sm wie bisher Zeitraum, Eingezahlt, Wert */}
                <span className="contents sm:block sm:min-w-0">
                  <span className="order-1 block font-mono text-[12px] uppercase tracking-[0.04em] text-muted-foreground sm:tracking-[0.14em]">
                    Vor {jahre === 1 ? "1 Jahr" : `${jahre} Jahren`}
                    <span className="hidden sm:inline"> angefangen</span>
                  </span>
                  <span className="order-3 mt-0.5 block text-[12px] leading-snug text-muted-foreground sm:mt-2 sm:text-[14px]">
                    {erg ? (
                      <>
                        <span className="sm:hidden">von </span>
                        <span className="hidden sm:inline">Eingezahlt </span>
                        <span className="tabular-nums text-foreground">{euro(erg.eingezahlt)}</span>
                      </>
                    ) : (
                      "Den ETF gibt es noch nicht so lange."
                    )}
                  </span>
                </span>
                {erg ? (
                  <span className="order-2 mt-1 block sm:mt-0">
                    <span className={`block text-[17px] font-semibold tabular-nums [overflow-wrap:anywhere] sm:mt-0.5 sm:text-[24px] ${erg.wert >= erg.eingezahlt ? "text-gain" : "text-loss"}`}>
                      {euro(erg.wert)}
                    </span>
                    <span className="hidden text-[13px] text-muted-foreground sm:block">heute wert</span>
                  </span>
                ) : (
                  <span className="order-2 mt-1 block text-[17px] font-semibold text-muted-foreground sm:mt-0.5 sm:text-[24px]">–</span>
                )}
              </button>
            );
          })}
        </div>

        {aktiv?.erg && <Kurve erg={aktiv.erg} art={art} />}

        <p className="mt-4 text-[13px] leading-relaxed text-muted-foreground">
          {art === "einmal"
            ? `Renditen von justETF bis ${RENDITE_STAND}, mit Ausschüttungen, ohne Depotkosten.`
            : `Monatskurse bis ${letzterHandelstag(kursStand)} (Yahoo Finance), ohne Ausschüttungen und Depotkosten.`}{" "}
          Vergangene Rendite ist kein Versprechen.
        </p>
      </div>
    </section>
  );
};

/** „Depots für deinen Halal-Vermögensaufbau“ wie Finanzfluss: drei Karten untereinander, rechts Logo und Knopf. */
const DepotKasten = () => (
  <aside aria-label="Depots für deine Halal ETFs" className="mt-12">
    <div className="flex items-start justify-between gap-3">
      <p className="font-titel text-[23px] leading-tight text-foreground md:text-[25px]">Depots für deine Halal ETFs</p>
      <Werbung />
    </div>
    <div className="mt-4 space-y-3">
      {DREIER.map((d) => {
        const zeilen = [
          `Halal ETFs dieser Liste: ${etfsBei(d.kaufbarName)} von 8`,
          sparplanZeile(d.anbieter),
          "Depotgebühr: 0 €",
          d.anbieter === "Smartbroker+" ? "Zinsen nur auf eigenem Zinskonto" : "Zinsen aufs Guthaben: 0 %",
        ];
        return (
          <div key={d.anbieter} className="border border-border bg-card p-5 sm:grid sm:grid-cols-[minmax(0,1fr)_180px] sm:gap-6">
            <div>
              <p className="text-[19px] font-bold text-foreground">{d.anbieter}</p>
              <ul className="mt-3 space-y-2 text-[15px] text-foreground/80">
                {zeilen.map((z) => (
                  <li key={z} className="flex gap-2.5">
                    {z.includes("noch nicht nachgesehen") ? (
                      <span className="mx-[5px] mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" aria-hidden />
                    ) : (
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-gain" aria-hidden />
                    )}
                    <span>{z}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-4 flex items-center gap-4 sm:mt-0 sm:flex-col sm:items-stretch sm:gap-3">
              <div className="flex h-[64px] w-[104px] shrink-0 items-center justify-center border border-border bg-background sm:h-[76px] sm:w-full">
                <img src={logoPfad(d.logo)} alt={`Logo ${d.anbieter}`} width={128} height={128} loading="lazy" className="h-12 w-auto max-w-[80%] object-contain" />
              </div>
              <a
                href={d.out}
                rel="sponsored nofollow"
                className="inline-flex min-h-[48px] flex-1 items-center justify-center whitespace-nowrap bg-primary px-3 py-3 text-[16px] font-semibold text-primary-foreground hover:bg-primary/90 sm:flex-none"
              >
                Zum Angebot*
              </a>
            </div>
          </div>
        );
      })}
    </div>
  </aside>
);

/* ------------------------------------------------------------------ */
/* Einträge und Tabellen                                               */
/* ------------------------------------------------------------------ */

/** Handy-Bild bis unter Kosten und Fondsgröße (Elias SEO35 „kürzen passt“), gemessen je Bild: Ende der Kachelzeile plus 20 px. */
const HANDY_SCHNITT: Record<string, number> = {
  "ishares-msci-world-islamic": 513,
  "invesco-dow-jones-islamic-global-developed-markets": 576,
  "ishares-msci-usa-islamic": 513,
  "ishares-msci-emerging-markets-islamic": 585,
  "hsbc-msci-world-islamic-screened": 516,
  "invesco-msci-acwi-islamic-m-series": 516,
  "hanetf-saturna-al-kawthar-global-focused-equity": 576,
  "ishares-usd-sukuk-ucits-etf": 513,
};

const Eintrag = ({ e }: { e: EtfEintrag }) => {
  const a = anlageVon(e.isin);
  return (
    <article id={anker(e)} className="scroll-mt-24">
      {/* Muster der Anleitung „1. Name, am besten für …“ wie frontal; der Name trägt, der Rest ist leiser (Elias SEO35) */}
      <h3 className="text-[20px] font-semibold leading-snug text-foreground">
        {e.platz}. {e.kurz ?? e.name}
        <span className="font-normal text-foreground/70">, am besten für {e.amBestenFuer}</span>
      </h3>
      {/* Handy-Ausschnitt der Seite in unserer Datenbank, auch am Laptop: die Laptop-Aufnahme war dort unlesbar klein (Seiten-Prüfer SEO46) */}
      <Link to={`/halal-anlagen/${a.slug}`} className="mt-5 block max-w-[420px] overflow-hidden rounded-md border border-border">
        <picture>
          <img
          src={`/bilder/blog/halal-etf/${a.slug}.webp`}
          style={{ aspectRatio: `716 / ${HANDY_SCHNITT[a.slug] ?? 852}` }}
          alt={`${e.name} in der finanzmuslim Datenbank: ISIN ${e.isin}, Kosten ${a.kostenLabel} im Jahr und Fondsgröße`}
          width={716}
          height={852}
          loading="lazy"
          className="h-auto w-full object-cover object-top"
        />
        </picture>
      </Link>
      <Text>
        {e.absaetze.map((t) => (
          <p key={t}>{t}</p>
        ))}
        <p className="font-semibold text-foreground">Passt zu dir, wenn {e.passt}.</p>
      </Text>
      <p className="mt-3 text-[16px]">
        <Link to={`/halal-anlagen/${a.slug}`} className="font-medium text-primary hover:underline">
          Alle Daten zu {e.name} →
        </Link>
      </p>
    </article>
  );
};

/**
 * Kleine Tabelle wie frontal: am Laptop eine Tabelle, am Handy je Zeile ein Block.
 * Mit `zeile` (Raster der Handy-Zeile) bleibt sie am Handy eine echte Zeile mit Kopf (Elias SEO35: kurze Zahlen
 * in eine Reihe); Spalten in `breit` laufen dann klein unter der Zeile.
 */
const KleineTabelle = ({
  kopf,
  kopfZusatz = {},
  zeilen,
  breit = [],
  zeile,
  nameOben = false,
}: {
  kopf: string[];
  /** Zweite Zeile im Kopf, klein und nicht in Versalien (Kosten „im Jahr bei 10.000 €“, Seiten-Prüfer SEO46). */
  kopfZusatz?: Record<number, string>;
  zeilen: { schluessel: string; erste: ReactNode; zellen: ReactNode[] }[];
  breit?: number[];
  zeile?: string;
  /** Am Handy steht die erste Zelle als eigene Zeile über den Zahlen (lange Namen bei 360 px). */
  nameOben?: boolean;
}) => (
  <div className="mt-5 max-w-[720px] border border-border">
    <table className="block w-full border-collapse text-[15px] sm:table">
      <thead className={zeile ? "block sm:table-header-group" : "hidden sm:table-header-group"}>
        <tr className={`border-b border-border bg-muted/60 text-left ${zeile ? `grid ${zeile} gap-x-2 px-3 py-2 sm:table-row sm:p-0` : ""}`}>
          {kopf.map((k, i) => (
            <th
              key={k}
              className={`align-top font-mono text-[12px] font-normal uppercase tracking-[0.06em] text-muted-foreground sm:px-4 sm:py-3 sm:text-[12px] sm:tracking-[0.14em] ${
                (zeile && breit.includes(i - 1)) || (nameOben && i === 0) ? "hidden sm:table-cell" : ""
              } ${zeile && !nameOben && i > 0 && !breit.includes(i - 1) ? "text-right sm:text-left" : ""}`}
            >
              {k}
              {kopfZusatz[i] && <span className="block font-sans text-[12px] normal-case tracking-normal">{kopfZusatz[i]}</span>}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="block sm:table-row-group">
        {zeilen.map((z) => (
          <tr
            key={z.schluessel}
            className={`grid border-t border-border first:border-t-0 sm:table-row sm:p-0 ${
              zeile ? `${zeile} gap-x-2 gap-y-1 px-3 py-2.5 text-[14px]` : "grid-cols-2 gap-x-4 gap-y-2 px-4 py-3.5"
            }`}
          >
            <td className={`align-top font-semibold leading-snug text-foreground sm:table-cell sm:px-4 sm:py-3 ${zeile ? (nameOben ? "col-span-full" : "") : "col-span-2"}`}>
              {z.erste}
            </td>
            {z.zellen.map((c, i) => (
              <td
                key={kopf[i + 1]}
                data-label={kopf[i + 1]}
                className={`align-top text-foreground/80 sm:table-cell sm:px-4 sm:py-3 sm:text-left sm:text-[15px] sm:before:hidden ${
                  zeile
                    ? breit.includes(i)
                      ? "col-span-full text-[13px] text-muted-foreground before:mr-1.5 before:font-mono before:text-[12px] before:uppercase before:tracking-[0.06em] before:content-[attr(data-label)] sm:text-foreground/80"
                      : nameOben
                        ? ""
                        : "text-right"
                    : `before:block before:font-mono before:text-[12px] before:uppercase before:tracking-[0.14em] before:text-muted-foreground before:content-[attr(data-label)] ${
                        breit.includes(i) ? "col-span-2" : ""
                      }`
                }`}
              >
                {c}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/* ------------------------------------------------------------------ */
/* Seite                                                               */
/* ------------------------------------------------------------------ */

const HalalEtf = () => {
  const [offen, setOffen] = useState(false);
  const ids = useMemo(() => LEISTE.map((a) => a.id), []);
  const aktiv = useAktiv(ids);
  const depots = gepruefteDepots();
  const stand = kaufbarStand();
  const maxKaufbar = Math.max(...etfListe.map((e) => kaufbarBei(e.isin).length));
  const alleAnbieter = [...new Set(etfListe.flatMap((e) => kaufbarBei(e.isin)))];
  const alleAcht = alleAnbieter.filter((d) => etfsBei(d) === etfListe.length).sort((x, y) => x.localeCompare(y, "de"));
  const seltenster = [...etfListe].sort((x, y) => kaufbarBei(x.isin).length - kaufbarBei(y.isin).length)[0];

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

  const etfZelle = (e: EtfEintrag) => (
    <a href={`#${anker(e)}`} className="-my-3 block py-3 hover:text-primary sm:my-0 sm:inline sm:py-0">
      {e.platz}. {e.kurz ?? e.name}
    </a>
  );

  return (
    <main className="bg-background">
      <Seo title={`${TITEL} | finanzmuslim`} description={META} path={PFAD} image={`${SITE}${TITELBILD}`} jsonLd={graph()} />
      <div className="container py-8 md:py-12">
        <div className="mx-auto max-w-[720px] xl:grid xl:max-w-[1048px] xl:grid-cols-[280px_minmax(0,720px)] xl:gap-12">
          {/* Seitenleiste ab xl: Kapitel wie die Kapitelübersicht bei Finanzfluss, darunter der Kasten wie frontal */}
          <aside className="hidden xl:block" aria-label="Inhaltsverzeichnis">
            <div className="sticky top-24">
              <Etikett className="border-t border-border pt-4">Auf dieser Seite</Etikett>
              <div className="mt-3">{inhalt}</div>
              <div className="mt-6 border border-border bg-card p-5">
                <Etikett className="text-primary">Dein Vermögensaufbau</Etikett>
                <p className="font-titel mt-2.5 text-[21px] leading-[1.2] text-foreground">Langfristig investieren, ohne einen Cent Zinsen?</p>
                <p className="mt-2.5 text-[14px] leading-relaxed text-foreground/75">
                  In 2 Minuten siehst du, welches Depot deine Halal ETFs als Sparplan führt und dir keine Zinsen zahlt.
                </p>
                <Link to="/vergleich/depot" className="leuchtlinie mt-5 inline-block">
                  <span className="block bg-foreground px-5 py-3 font-mono text-[13px] uppercase tracking-[0.12em] text-background">
                    Zum Depot-Vergleich
                  </span>
                </Link>
              </div>
            </div>
          </aside>

          <div className="min-w-0">
            {/* 1 Kopf wie frontal */}
            <nav aria-label="Brotkrumen" className="flex flex-wrap items-center gap-2 font-mono text-[12px] uppercase tracking-[0.12em] text-muted-foreground">
              <Link to="/blog" className="text-primary hover:underline">
                Blog
              </Link>
              <span aria-hidden>/</span>
              <span>Beste Halal ETFs 2026</span>
            </nav>

            <article className="mt-8">
              <h1 className="font-titel mt-3 text-[32px] leading-[1.1] text-foreground md:text-[42px]">
                <span className="block">Beste Halal ETFs 2026:</span> <span className="block">8 im Vergleich</span>
              </h1>
              <div data-vorlage="autorzeile" className="mt-6 flex items-start justify-between gap-4 border-b border-border pb-6">
                <div className="flex gap-3">
                  <img src={eliasPortrait} alt="Elias El-Gendy" width={48} height={48} className="h-12 w-12 shrink-0 object-cover" />
                  <div className="leading-snug">
                    <a
                      href={LINKEDIN}
                      rel="author noopener noreferrer"
                      target="_blank"
                      className="text-[15px] font-semibold text-foreground underline underline-offset-[3px] hover:text-primary"
                    >
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

              {/* 2 Kurzer Vergleich */}
              <KurzerVergleich />

              {/* Kapitel am Handy und Tablet */}
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

              {/* 3 Einstieg */}
              <div className="mt-8">
                <Text>
                  <p>
                    Du willst als Muslim in einen ETF sparen und fragst dich wie fast jeder: Welchen nehme ich, wo kaufe
                    ich ihn, und was hat er bisher gebracht?
                  </p>
                  <p>
                    Ich habe 12 Halal ETFs verglichen und bei {depots} Depots nachgesehen, wo du sie kaufen kannst. Acht
                    sind geblieben. Die Reihenfolge folgt islamischen Kriterien und der Verfügbarkeit, nicht der Rendite.
                  </p>
                </Text>

                {/* 5 Das Wichtigste wie frontal „Key Takeaways“ */}
                <section className="mt-10 border-l-2 border-primary bg-muted px-5 py-6 md:px-8 md:py-7">
                  <H2 id="das-wichtigste" />
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
                  <p className="mt-5 text-[14px] text-muted-foreground">
                    Neu beim Thema? Im kostenlosen <TL to="/halal-guide">Halal Investment Guide</TL> erkläre ich die
                    Grundlagen Schritt für Schritt.
                  </p>
                </section>

                {/* 6 Tabellen wie frontal: wenige Spalten, kurze Wörter; seit SEO44 direkt nach dem Wichtigsten wie die Quick Comparison bei halalwallet */}
                <section className="mt-14">
                  <H2 id="halal-etf-liste" />
                  <Text>
                    <p>
                      Ich habe 12 Halal ETFs gefunden, die du in Deutschland kaufen kannst. Acht stehen in dieser Liste, die
                      übrigen vier unter der Renditetabelle. Kosten im Jahr in Prozent und in Euro bei 10.000 €, dazu wie groß
                      der Fonds ist und wie viele Aktien drin sind.
                    </p>
                  </Text>
                  <KleineTabelle
                    kopf={["ETF", "Kosten", "Größe", "Aktien", "Passt zu"]}
                    kopfZusatz={{ 1: "im Jahr bei 10.000 €" }}
                    breit={[3]}
                    zeile="grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)_minmax(0,0.6fr)]"
                    nameOben
                    zeilen={etfListe.map((e) => {
                      const a = anlageVon(e.isin);
                      return {
                        schluessel: e.isin,
                        erste: etfZelle(e),
                        zellen: [
                          <span className="block whitespace-nowrap tabular-nums">
                            {a.kostenLabel}
                            <span className="text-foreground/60"> · {euro(a.kosten * 100)}</span>
                          </span>,
                          <span className="whitespace-nowrap tabular-nums">{groesseKurz(e.groesseMio)}</span>,
                          <span className="whitespace-nowrap tabular-nums">
                            {e.positionen.toLocaleString("de-DE")}
                            {positionenWort(e) === "Sukuk" ? <span className="block text-foreground/60">Sukuk</span> : null}
                          </span>,
                          gross(e.amBestenFuer),
                        ],
                      };
                    })}
                  />
                  <p className="font-titel mt-7 max-w-[664px] border-l-2 border-primary pl-5 text-[20px] leading-[1.4] text-foreground">
                    Platz 1 kostet 30 € im Jahr bei 10.000 € und läuft bei 14 Depots als Sparplan, bei keinem anderen ETF hier
                    so oft.
                  </p>
                  <p className="font-titel mt-10 text-[21px] leading-tight text-foreground">Rendite im Vergleich</p>
                  <KleineTabelle
                    kopf={["ETF", "1 Jahr", "3 Jahre", "5 Jahre"]}
                    zeile="grid-cols-3"
                    nameOben
                    zeilen={etfListe.map((e) => ({
                      schluessel: e.isin,
                      erste: etfZelle(e),
                      zellen: [e.rendite1J, e.rendite3J, e.rendite5J].map((r, i) => (
                        <span key={i} className={`whitespace-nowrap tabular-nums ${r ? "" : "text-muted-foreground"}`}>
                          {r ?? "–"}
                        </span>
                      )),
                    }))}
                  />
                  <p className="mt-3 max-w-[664px] text-[13px] leading-relaxed text-muted-foreground">
                    Quelle: justETF, in Euro mit Ausschüttungen, {RENDITE_STAND}. Ein Strich heißt: So lange gibt es den Fonds
                    noch nicht. Platz 6 steht seit Februar 2026 bei +17,62 %.
                  </p>
                  <Text>
                    <p>
                      Außerdem in Deutschland zu haben:{" "}
                      <TL to="/halal-anlagen/hsbc-msci-usa-islamic-screened">HSBC MSCI USA Islamic Screened</TL>,{" "}
                      <TL to="/halal-anlagen/hsbc-msci-europe-islamic-screened">HSBC MSCI Europe Islamic Screened</TL> und{" "}
                      <TL to="/halal-anlagen/hsbc-msci-emerging-markets-islamic-screened-capped">
                        HSBC MSCI Emerging Markets Islamic Screened
                      </TL>
                      , je 0,30 bis 0,35 % im Jahr, und der{" "}
                      <TL to="/halal-anlagen/xtrackers-ii-salam-usd-global-aggregate-sukuk">Xtrackers Salam Sukuk</TL>.
                    </p>
                  </Text>
                  {/* 4 Google-Kasten, seit SEO47 unter der Liste (Seiten-Prüfer SEO46: schob die Liste auf Schirm 5) */}
                  <GoogleKasten />
                </section>

                {/* 7 Rechner */}
                <Rechner />

                {/* 8 Depots, erstes Mal */}
                <DepotKasten />

                {/* 9 Die acht Plätze, Video am Ende von Platz 1 */}
                <section className="mt-14">
                  <H2 id="die-besten-halal-etfs" />
                  <Text>
                    <p>
                      Die Reihenfolge folgt islamischen Kriterien und der Verfügbarkeit, nicht der Rendite. Wie ich prüfe, steht
                      in der <TL to="/vergleiche/methodik">Methodik</TL>. Ein Klick aufs Bild öffnet alle Daten zum ETF.
                    </p>
                  </Text>
                  <div className="mt-10 space-y-14">
                    {etfListe.map((e) => (
                      <div key={e.isin}>
                        <Eintrag e={e} />
                        {e.platz === 1 && (
                          <div className="mt-8">
                            <Text>
                              <p>
                                Lieber hören als lesen? Im Video erkläre ich, woran du erkennst, ob ein ETF halal ist.
                              </p>
                            </Text>
                            <Video />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>

                {/* 10 Welcher passt */}
                <section className="mt-12">
                  <H2 id="welcher-passt" />
                  <KleineTabelle
                    kopf={["Wenn du …", "Achte auf", "Passt"]}
                    breit={[0, 1]}
                    zeilen={PASST.map((p) => {
                      const e = etfListe.find((x) => x.platz === p.platz)!;
                      return {
                        schluessel: p.wenn,
                        erste: p.wenn,
                        zellen: [
                          p.achte,
                          <a href={`#${anker(e)}`} className="font-medium text-primary hover:underline">
                            Platz {e.platz}: {e.kurz ?? e.name}
                          </a>,
                        ],
                      };
                    })}
                  />
                </section>

                {/* 11 Begriff erklärt, seit SEO44 hinten und kurz (Leser-Skill: Index und Gremium höchstens als Halbsatz) */}
                <section className="mt-12">
                  <H2 id="was-ist-ein-halal-etf" />
                  <Text>
                    <p>
                      Ein Halal ETF ist ein Fonds, der nur Aktien oder Sukuk kauft, die eine Shariah-Prüfung bestehen. Andere Namen dafür
                      sind islamische ETFs, auf Englisch Islamic ETF.
                    </p>
                    <p>
                      Raus fliegt, womit eine Firma ihr Geld nicht verdienen darf: Banken, Versicherungen, Alkohol, Glücksspiel. Raus fliegt
                      auch, wer zu viele Schulden auf Zinsen hat. Welche Grenzen gelten, steht im Beitrag{" "}
                      <TL to="/blog/sind-aktien-haram">Sind Aktien halal?</TL>
                    </p>
                    <p>
                      Ein Halal ETF ist kein Nachhaltigkeitsfonds. Nachhaltige Fonds (ESG) lassen oft Waffen und Tabak weg, Banken
                      und Versicherungen haben sie aber häufig drin.
                    </p>
                    <p>
                      Und ein Halal ETF ist nicht sicher. Halal heißt erlaubt. Er schwankt wie jeder Aktienfonds, ein Verlust ist
                      jederzeit möglich.
                    </p>
                  </Text>
                </section>

                {/* 12 ETF oder Fonds */}
                <section className="mt-12">
                  <H2 id="halal-etf-oder-fonds" />
                  <Text>
                    <p>
                      Ein Halal ETF folgt meist einem Index, also einer festen Firmenliste, und wird an der Börse gehandelt. Du zahlst beim Kauf nur die Ordergebühr deines Depots.
                    </p>
                    <p>
                      Ein Halal Fonds wird meist aktiv gemanagt, ein Team wählt die Firmen aus. Ein aktiver Shariah-Fonds aus
                      unserer Datenbank kostet 1,81&nbsp;% im Jahr, bei 10.000&nbsp;€ also 181&nbsp;€. Platz 1 kostet 30&nbsp;€.
                    </p>
                    <p>
                      Kaufst du so einen Fonds direkt bei der Fondsgesellschaft, zahlst du beim Kauf einmal 5,54&nbsp;% dazu.
                      Platz 7 liegt dazwischen: aktiv ausgewählt, aber an der Börse gehandelt wie ein ETF.
                    </p>
                  </Text>
                </section>

                {/* 13 Wo du die acht kaufen kannst */}
                <section className="mt-12">
                  <H2 id="wo-kaufen" />
                  <Text>
                    <p>
                      Für die acht ETFs habe ich bei {depots} Depots nachgesehen, ob du sie kaufen kannst.
                    </p>
                    <p>
                      {alleAcht.length > 0
                        ? `Alle acht ETFs gibt es bei ${alleAcht.length} Depots: ${alleAcht.slice(0, -1).join(", ")} und ${alleAcht.at(-1)}.`
                        : "Kein Depot führt alle acht."}{" "}
                      Trade Republic führt {tradeRepublicZahl} von 8, es fehlt der {ohneTradeRepublic.join(", ")}. Am seltensten
                      zu haben ist der {seltenster.name} mit {kaufbarBei(seltenster.isin).length} Depots.
                    </p>
                  </Text>
                  <figure className="mt-5 max-w-[720px] border border-border p-5">
                    <figcaption className="text-[15px] font-semibold text-foreground">Bei wie vielen Depots du jeden ETF kaufen kannst</figcaption>
                    <ul className="mt-4 space-y-2.5" role="img" aria-label={etfListe.map((e) => `${e.name}: ${kaufbarBei(e.isin).length} Depots`).join(", ")}>
                      {etfListe.map((e) => {
                        const n = kaufbarBei(e.isin).length;
                        return (
                          <li key={e.isin} className="text-[14px]">
                            <div className="flex justify-between gap-3 text-foreground/80">
                              <span>
                                {e.platz}. {e.kurz ?? e.name}
                              </span>
                              <span className="font-semibold tabular-nums text-foreground">{n}</span>
                            </div>
                            <div className="mt-1 h-2 bg-muted">
                              <div className="h-2 bg-primary" style={{ width: `${(n / maxKaufbar) * 100}%` }} />
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                    <p className="mt-4 text-[13px] text-muted-foreground">
                      Quelle: eigene Prüfung finanzmuslim, Wertpapiersuche je Depot, Stand {stand}.
                    </p>
                  </figure>
                </section>

                {/* 14 Häufige Fragen, Fragen wortgleich (THEMENKARTE.md Z. 107-114) */}
                <section className="mt-12">
                  <H2 id="haeufige-fragen" />
                  <div className="mt-4 max-w-[664px] divide-y divide-border">
                    {FRAGEN.map((f) => (
                      <div key={f.frage} className="py-5 first:pt-1">
                        <h3 className="text-[18px] font-semibold leading-snug text-foreground">{f.frage}</h3>
                        <p className="mt-2 text-[17px] leading-[1.65] text-foreground/75">
                          {f.antwort}
                          {f.link && (
                            <>
                              {" "}
                              <TL to={f.link.to}>{f.link.text}</TL>
                            </>
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* 15 Nächster Schritt, Depots zweites Mal */}
                <section className="mt-12">
                  <H2 id="naechster-schritt" />
                  <Text>
                    <p>
                      Neben dem ETF zählt das Depot. Es sollte deinen ETF als Sparplan
                      führen. Schau auch, ob es dir Zinsen aufs Guthaben zahlt. Im{" "}
                      <TL to="/vergleich/depot">Depot-Vergleich</TL> siehst du je Depot, welche Halal ETFs es hat und wie es mit
                      Zinsen umgeht.
                    </p>
                  </Text>
                </section>

                <DepotKasten />

                {/* Autorbox wie frontal „About the author“ */}
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

                {/* Passt dazu */}
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

                {/* Fußnote und Rechtshinweis */}
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

export default HalalEtf;
