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
  "Beste Halal ETFs 2026: 8 Islamic ETFs im Vergleich nach Halal-Prüfung, Kosten und Sparplan. Mit Renditen, Gremium und den Depots, bei denen du sie kaufst.";
const TITELBILD = "/bilder/blog/halal-etf/beste-halal-etfs-2026.jpg";
const VEROEFFENTLICHT = { text: "16.08.2026", iso: "2026-08-16T09:00:00+02:00" };
const AKTUALISIERT = { text: "02.11.2026", iso: "2026-11-02T09:00:00+01:00" };
const INSTAGRAM = "https://www.instagram.com/finanz.muslim/";
const YOUTUBE = "https://www.youtube.com/@finanz.muslim";
/** LinkedIn-Profil von Elias (SOP About Page Z. 93, 145). */
const LINKEDIN = "https://www.linkedin.com/in/elias-el-gendy-370616363/";
const PROFILE = [INSTAGRAM, "https://www.tiktok.com/@finanz.muslim", YOUTUBE, LINKEDIN];
const VIDEO_ID = "uO0ZnlaFolw";
/** Google „bevorzugte Quelle“: dorthin leitet auch Finanzfluss (link.finanzfluss.de, ?q=finanzfluss.de). */
const GOOGLE_QUELLE = "https://www.google.com/preferences/source?q=finanzmuslim.com";
const BIO =
  "Elias El-Gendy hat die Sachkundeprüfungen nach § 34d und § 34f GewO abgeschlossen. Er berät Muslime zum islamkonformen Investieren und klärt auf Instagram (@finanz.muslim) über 15.000 Abonnenten über Halal Finance auf.";
const RECHTSHINWEIS =
  "Dieser Beitrag dient ausschließlich zu Bildungszwecken, ist keine Fatwa und keine Anlageberatung. Die Rangfolge folgt den genannten Kriterien und ersetzt keine Prüfung deiner eigenen Lage. Zu Wertpapierleihe, synthetischer Nachbildung und zur Reinigung von Erträgen bestehen zwischen den Rechtsschulen und einzelnen Gremien unterschiedliche Auffassungen. Investitionen in Wertpapiere sind mit Risiken verbunden, bis hin zum Totalverlust. Vergangene Renditen sind kein Versprechen für die Zukunft.";
/** Lesedauer in Minuten: Wörter im Beitrag (innerText von main article bei 390) durch 200, aufgerundet. */
const LESEZEIT = 19;

/* ------------------------------------------------------------------ */
/* Inhalt                                                              */
/* ------------------------------------------------------------------ */

type Abschnitt = { id: string; titel: string };

const ABSCHNITTE: Abschnitt[] = [
  { id: "das-wichtigste", titel: "Das Wichtigste" },
  { id: "100-euro-im-monat", titel: "Was aus 100 € im Monat geworden wäre" },
  { id: "was-ist-ein-halal-etf", titel: "Was ein Halal ETF ist (und was nicht)" },
  { id: "so-haben-wir-verglichen", titel: "So haben wir verglichen" },
  { id: "die-besten-halal-etfs", titel: "Die besten Halal ETFs 2026" },
  { id: "halal-etf-liste", titel: "Halal ETF Liste: alle acht nebeneinander" },
  { id: "welcher-passt", titel: "Welcher Halal ETF zu dir passt" },
  { id: "halal-etf-oder-fonds", titel: "ETF oder Fonds: wo der Unterschied Geld kostet" },
  { id: "wo-kaufen", titel: "Wo du die acht ETFs kaufen kannst" },
  { id: "haeufige-fragen", titel: "Häufige Fragen" },
  { id: "naechster-schritt", titel: "Dein nächster Schritt: das passende Depot" },
];
const titelVon = (id: string) => ABSCHNITTE.find((a) => a.id === id)!.titel;

const WICHTIGSTES: { lead: string; text: ReactNode }[] = [
  {
    lead: "Der Index allein macht keinen ETF halal.",
    text: "Zuerst wirft der Index Firmen raus, die Grenzwerte reißen, nach dem AAOIFI-Standard etwa über 5 % Umsatz aus Verbotenem. Danach zählt, was der Fonds selbst tut.",
  },
  {
    lead: "Ein Gremium am Fonds schlägt eins am Index.",
    text: "Sechs der acht ETFs haben ein eigenes Gremium mit Zertifikat. Bei zweien betrifft der Beleg nur den Index.",
  },
  {
    lead: "Kosten fressen still mit.",
    text: "Die acht liegen bei 0,30 bis 0,75 % im Jahr, bei 10.000 € also 30 bis 75 € jedes Jahr.",
  },
  {
    lead: "Rein heißt auch reinigen.",
    text: (
      <>
        Platz 1 (seit 2026) und Platz 5 geben den kleinen unreinen Anteil selbst weiter, beim Sukuk entfällt er. Bei den
        anderen rechnest du ihn aus und gibst ihn weiter, siehe <TL to="/wissen/ertraege-reinigen">Aktienbereinigung</TL>.
      </>
    ),
  },
  {
    lead: "Das Depot entscheidet über Riba.",
    text: (
      <>
        Zahlt dein Depot Zinsen aufs Guthaben, hilft der sauberste ETF wenig. Scalable, Smartbroker+ und
        Traders Place zahlen 0 % aufs Verrechnungskonto, alle weiteren stehen im{" "}
        <TL to="/vergleich/depot">Depot-Vergleich</TL>.
      </>
    ),
  },
];

const KRITERIEN: { name: string; text: string }[] = [
  {
    name: "Halal-Beleg",
    text: "Ein eigenes Gremium am Fonds mit Fatwa und jährlichem Zertifikat zählt mehr als ein Beleg nur zum Index. Ich urteile nie selbst, ich zeige den Beleg des Anbieters.",
  },
  {
    name: "Kosten",
    text: "Die laufenden Kosten im Jahr. Bei 10.000 € macht jedes Zehntelprozent 10 € im Jahr aus.",
  },
  {
    name: "Sparplan",
    text: "Bei wie vielen Depots der ETF als Sparplan läuft, nur mit Beleg vom Anbieter. Ohne Beleg steht „nicht belegt“, nicht „nein“.",
  },
  {
    name: "Größe und Alter",
    text: "Fondsvermögen in Mio. € und Jahr der Auflage. Ein alter Fonds hat echte Zahlen statt einer Rückrechnung des Index.",
  },
  {
    name: "Rendite",
    text: `1, 3 und 5 Jahre in Euro mit Ausschüttungen, von justETF, Stand ${RENDITE_STAND}. Ein Kriterium unter fünf, nie das einzige.`,
  },
];

const PASST: { wenn: string; achte: string; platz: number }[] = [
  { wenn: "Wenn du mit einem Sparplan anfängst", achte: "Sparplan bei deinem Depot belegt", platz: 1 },
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
      "Entscheidend ist, was der ETF kauft. Ein normaler ETF kauft auch Banken und Versicherungen. Ein Islamic ETF kauft nur Aktien oder Sukuk, die eine Shariah-Prüfung bestehen. Bei sechs der acht ETFs hier hat ein Gremium auch den Fonds geprüft.",
  },
  {
    frage: "Sind ETFs haram?",
    antwort:
      "Das hängt an dem, was ein ETF kauft. Der normale MSCI World enthält Banken und Versicherungen. Für sechs der acht ETFs hier hat ein Gremium genau diesen Fonds geprüft, für vier davon mit einer Fatwa.",
  },
  {
    frage: "Welche Halal ETFs gibt es bei Trade Republic?",
    antwort: `Laut Wertpapiersuche von Trade Republic kannst du ${tradeRepublicZahl} der 8 ETFs dieser Liste kaufen, alle außer ${ohneTradeRepublic.join(
      ", ",
    )}. Einen Sparplan darauf hat uns Trade Republic nicht belegt.`,
    link: { to: "/vergleich/depot", text: "Zum Depot-Vergleich" },
  },
  {
    frage: "Ist der MSCI World halal?",
    antwort:
      "Der normale MSCI World filtert nicht nach islamischen Regeln, enthält Banken und Versicherungen und hat kein Gremium. Geprüft ist der MSCI World Islamic, den du mit Platz 1 kaufst.",
    link: { to: "/halal-anlagen/ishares-msci-world-islamic", text: "iShares MSCI World Islamic ansehen" },
  },
  {
    frage: "Welche ETFs sind scharia-konform?",
    antwort:
      "So nennen sich ETFs mit Islamic oder Shariah im Namen. Ob ein Gremium sie geprüft hat, zeigt erst der Beleg. Alle acht hier haben einen, für den Fonds oder nur für den Index.",
  },
  {
    frage: "Wie prüfe ich, ob ein ETF halal ist?",
    antwort:
      "Such die ISIN, nicht den Namen. Dann zwei Fragen: Gilt das Shariah-Zertifikat für das Produkt oder nur für den Index, und wann wurde es zuletzt erneuert? Beides steht bei jeder Anlage in unserer Datenbank.",
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
      "Nach verbreiteter Auffassung ja, wenn der Fonds es nicht selbst tut. Der iShares MSCI World Islamic (seit 2026) und der HSBC MSCI World Islamic Screened reinigen im Fonds, beim iShares USD Sukuk entfällt es. Bei den anderen gibst du den unreinen Anteil deiner Erträge weiter.",
    link: { to: "/wissen/ertraege-reinigen", text: "So rechnest du die Reinigung" },
  },
];

// Traders Place: Wortmarke statt App-Zeichen, sonst ist die Marke nicht zu erkennen (Prüfer SEO31)
const DREIER: { anbieter: string; kaufbarName: string; logo: string; out: string }[] = [
  { anbieter: "Traders Place", kaufbarName: "Traders Place", logo: "traders-place-wortmarke.svg", out: "/out/traders-place" },
  { anbieter: "Smartbroker+", kaufbarName: "Smartbroker+", logo: "smartbroker", out: "/out/smartbroker" },
  { anbieter: "Scalable Capital", kaufbarName: "Scalable Capital", logo: "scalable", out: "/out/scalable" },
];

// Sparplan je Depot nur aus den Belegen der Liste (sparplanBei), Scalable mit und ohne PRIME+.
function sparplanZeile(anbieter: string): string {
  const zahl = (name: string) => etfListe.filter((e) => e.sparplanBei.includes(name)).length;
  if (anbieter === "Scalable Capital") return `Sparplan auf ${zahl("Scalable")} von 8 belegt, mit PRIME+ (4,99 € im Monat) auf ${zahl("Scalable PRIME+")}`;
  const n = zahl(anbieter);
  return n === 0 ? "Sparplan auf diese ETFs noch nicht geprüft" : `Sparplan auf ${n} von 8 belegt`;
}

const PASST_DAZU: { to: string; name: string; text: string }[] = [
  {
    to: "/halal-anlagen/ishares-msci-world-islamic",
    name: "iShares MSCI World Islamic",
    text: "Alle Daten zu Platz 1, mit ISIN und Beleg.",
  },
  { to: "/wissen/sind-aktien-halal", name: "Sind Aktien halal?", text: "Die Grenzwerte, nach denen ein Index prüft." },
  { to: "/wissen/ertraege-reinigen", name: "Aktienbereinigung", text: "Rechne aus, welchen Anteil du weitergibst." },
  { to: "/wissen/sukuk", name: "Sukuk", text: "Versteh das Gegenstück zu Anleihen." },
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
  <p className={`font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground ${className}`}>{children}</p>
);

const Werbung = () => <Etikett>Werbung</Etikett>;

const gross = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
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
        isPartOf: { "@type": "Blog", "@id": `${SITE}/wissen#blog`, name: "finanzmuslim Blog", url: `${SITE}/wissen` },
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
          { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE}/wissen` },
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
        sameAs: [INSTAGRAM, "https://www.tiktok.com/@finanz.muslim", YOUTUBE],
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
    <summary className="flex cursor-pointer list-none items-center justify-between py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-foreground [&::-webkit-details-marker]:hidden">
      {titel}
      <span className="flex items-center gap-2 text-muted-foreground">
        {zahl}
        <ChevronDown className="h-3.5 w-3.5 text-foreground transition-transform group-open:rotate-180" aria-hidden />
      </span>
    </summary>
    <div className="pb-3 text-[14px] leading-relaxed text-foreground/75">{children}</div>
  </details>
);

const Karte = ({ e }: { e: EtfEintrag }) => {
  const a = anlageVon(e.isin);
  const kurzname = e.name.startsWith(`${e.anbieter} `) ? e.name.slice(e.anbieter.length + 1) : e.name;
  return (
    <li className="flex w-[220px] shrink-0 snap-start flex-col border border-border bg-card">
      <div
        className={`relative flex h-[104px] items-center justify-center gap-2.5 border-b border-border bg-background ${
          e.platz === 1 ? "shadow-[inset_0_2px_0_hsl(var(--primary))]" : ""
        }`}
        style={RASTER}
      >
        <span className="absolute left-3 top-3 border border-border bg-background px-1.5 py-0.5 font-mono text-[11px] tabular-nums text-foreground">
          {String(e.platz).padStart(2, "0")}
        </span>
        <img src={logoPfad(e.logo)} alt="" aria-hidden="true" width={40} height={40} className="h-10 w-10 object-contain" />
        <span className="text-[16px] font-semibold text-foreground">{e.anbieter}</span>
      </div>
      <div className="flex flex-1 flex-col px-4 pt-4">
        <p className="min-h-[2.75em] text-[14px] font-semibold leading-snug text-foreground">{kurzname}</p>
        <Etikett className="mt-4">Am besten für</Etikett>
        <p className="font-titel mt-1.5 text-[20px] leading-[1.2] text-foreground">{gross(e.amBestenFuer)}</p>
        <p className="mt-2 text-[14px] leading-snug text-foreground/70">{e.satz}</p>
        <div className="mt-4 space-y-3">
          <div>
            <Etikett>Kaufbar bei</Etikett>
            <p className="mt-1 text-[15px] font-semibold tabular-nums text-foreground">{kaufbarBei(e.isin).length} Depots</p>
          </div>
          <div>
            <Etikett>Kosten</Etikett>
            <p className="mt-1 text-[15px] font-semibold tabular-nums text-foreground">
              {a.kostenLabel} <span className="font-normal text-muted-foreground">im Jahr</span>
            </p>
          </div>
        </div>
        <a
          href={`#${anker(e)}`}
          className="mb-4 mt-5 flex items-center justify-center gap-1.5 border border-border bg-muted/60 py-2.5 font-mono text-[12px] uppercase tracking-[0.12em] text-foreground transition-colors hover:border-foreground sm:mt-auto"
        >
          Zum Eintrag
          <ArrowDown className="h-3.5 w-3.5" aria-hidden />
        </a>
        <div className="sm:mt-0">
          <Klappzeile titel="Halal-Beleg">
            {e.geprueftText}{" "}
            <a href={a.zertifikatLink} target="_blank" rel="noopener noreferrer" className="font-medium text-primary underline underline-offset-2">
              Beleg ansehen
            </a>
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
        </div>
      </div>
    </li>
  );
};

/** Am Handy wischen, am Laptop zwei Pfeile wie frontal; drei Karten ganz, die vierte lugt. */
const KurzerVergleich = () => {
  const reihe = useRef<HTMLUListElement>(null);
  const [rand, setRand] = useState({ links: true, rechts: false });
  useEffect(() => {
    const el = reihe.current;
    if (!el) return;
    const messen = () =>
      setRand({ links: el.scrollLeft <= 2, rechts: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2 });
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
    "flex h-9 w-9 items-center justify-center border border-border bg-background text-foreground transition-colors hover:border-foreground disabled:opacity-35 disabled:hover:border-border";
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
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Google-Kasten, Rechner, Depots                                       */
/* ------------------------------------------------------------------ */

const GoogleG = () => (
  <svg viewBox="0 0 48 48" className="h-7 w-7 shrink-0" aria-hidden>
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
  </svg>
);

const GoogleKasten = () => (
  <a
    href={GOOGLE_QUELLE}
    target="_blank"
    rel="noopener noreferrer"
    data-vorlage="google-quelle"
    className="mt-7 flex max-w-[664px] items-center gap-4 border border-border bg-card px-5 py-4 transition-colors hover:border-foreground/40"
  >
    <GoogleG />
    <span className="min-w-0 flex-1">
      <span className="block text-[16px] font-semibold leading-snug text-foreground">
        finanzmuslim als bevorzugte Quelle bei Google hinzufügen
      </span>
      <span className="mt-0.5 block text-[14px] text-muted-foreground">Unsere Vergleiche direkt in deiner Suche.</span>
    </span>
    <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
  </a>
);

const euro = (n: number) => `${Math.round(n).toLocaleString("de-DE")} €`;
const monatName = (ym: string) => {
  const [j, m] = ym.split("-").map(Number);
  return new Date(j, m - 1, 1).toLocaleDateString("de-DE", { month: "long", year: "numeric" });
};

/**
 * „Was aus 100 € im Monat geworden wäre“: je Monatskurs eine Rate von 100 €, Wert = Anteile mal Kurs.
 * Eintrag „2021-12“ ist der Kurs zum Monatsanfang, der letzte der Kurs vom Stand der Kursdatei (31.10.2026).
 */
const Rechner = () => {
  const [isin, setIsin] = useState(etfListe[0].isin);
  const e = etfListe.find((x) => x.isin === isin)!;
  const daten = useMemo(() => {
    let anteile = 0;
    return (kursFuerIsin(isin)?.reihe ?? []).map(([monat, kurs], i) => {
      anteile += 100 / kurs;
      return { monat, eingezahlt: (i + 1) * 100, wert: Math.round(anteile * kurs) };
    });
  }, [isin]);
  const letzte = daten[daten.length - 1];
  const kacheln: [string, string | null][] = [
    ["1 Jahr", e.rendite1J],
    ["3 Jahre", e.rendite3J],
    ["5 Jahre", e.rendite5J],
  ];
  return (
    <section className="mt-12">
      <H2 id="100-euro-im-monat" />
      <Text>
        <p>Wähl einen der acht ETFs und sieh, was aus einem Sparplan von 100 € im Monat geworden wäre.</p>
      </Text>
      <div className="mt-5 border border-border bg-card p-4 md:p-5">
        <label htmlFor="rechner-etf" className="block">
          <Etikett>ETF</Etikett>
        </label>
        <select
          id="rechner-etf"
          value={isin}
          onChange={(x) => setIsin(x.target.value)}
          className="mt-1.5 w-full border border-border bg-background px-3 py-2.5 text-[16px] text-foreground"
        >
          {etfListe.map((x) => (
            <option key={x.isin} value={x.isin}>
              {x.platz}. {x.name}
            </option>
          ))}
        </select>
        {letzte && (
          <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
            <div>
              <Etikett>Eingezahlt</Etikett>
              <p className="mt-1 text-[22px] font-semibold tabular-nums text-foreground">{euro(letzte.eingezahlt)}</p>
            </div>
            <div>
              <Etikett>Wert am {kursStand}</Etikett>
              <p className={`mt-1 text-[22px] font-semibold tabular-nums ${letzte.wert >= letzte.eingezahlt ? "text-gain" : "text-loss"}`}>
                {euro(letzte.wert)}
              </p>
            </div>
            <p className="self-end pb-1 text-[14px] text-muted-foreground">
              seit {monatName(daten[0].monat)}, {daten.length} Raten
            </p>
          </div>
        )}
        <div className="mt-4 md:grid md:grid-cols-[minmax(0,1fr)_150px] md:gap-5">
          <div className="h-[220px]" role="img" aria-label={`Verlauf: eingezahlt ${letzte ? euro(letzte.eingezahlt) : ""}, Wert ${letzte ? euro(letzte.wert) : ""}`}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={daten} margin={{ top: 6, right: 4, bottom: 0, left: 0 }}>
                <CartesianGrid stroke="hsl(var(--border))" vertical={false} />
                <XAxis
                  dataKey="monat"
                  ticks={daten.filter((d) => d.monat.endsWith("-01")).map((d) => d.monat)}
                  tickFormatter={(m: string) => m.slice(0, 4)}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  width={52}
                  tickFormatter={(v: number) => `${(v / 1000).toLocaleString("de-DE")} T€`}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(v: number, n: string) => [euro(v), n === "wert" ? "Wert" : "Eingezahlt"]}
                  labelFormatter={(m: string) => monatName(m)}
                  contentStyle={{ fontSize: 13, borderRadius: 4 }}
                />
                <Area type="monotone" dataKey="eingezahlt" stroke="hsl(var(--muted-foreground))" fill="hsl(var(--muted))" strokeWidth={1.5} />
                <Area type="monotone" dataKey="wert" stroke="hsl(var(--gain))" fill="hsl(var(--gain-soft))" fillOpacity={0.7} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 md:mt-0 md:grid-cols-1">
            {kacheln.map(([zeit, wert]) => (
              <div key={zeit} className="border border-border bg-background px-2.5 py-2.5 sm:px-3">
                <Etikett>{zeit}</Etikett>
                {wert ? (
                  <p className="mt-1 whitespace-nowrap text-[15px] font-semibold sm:text-[17px] tabular-nums text-gain">{wert}</p>
                ) : (
                  <p className="mt-1 text-[14px] text-muted-foreground">noch zu jung</p>
                )}
              </div>
            ))}
          </div>
        </div>
        <p className="mt-4 text-[13px] leading-relaxed text-muted-foreground">
          Verlauf aus Monatskursen ohne Ausschüttungen (Yahoo Finance, Stand {kursStand}). Bei Platz 1, 3, 4 und 8 liegt
          der echte Wert darum etwas höher. Renditen 1, 3 und 5 Jahre: justETF mit Ausschüttungen, Stand {RENDITE_STAND}.
          Vergangene Renditen sind kein Versprechen für die Zukunft.
        </p>
      </div>
    </section>
  );
};

/** „Depots für deinen Halal-Vermögensaufbau“ wie Finanzfluss: drei Karten untereinander, rechts Logo und Knopf. */
const DepotKasten = () => (
  <aside aria-label="Depots für deinen Halal-Vermögensaufbau" className="mt-12">
    <div className="flex items-start justify-between gap-3">
      <p className="font-titel text-[23px] leading-tight text-foreground md:text-[25px]">Depots für deinen Halal-Vermögensaufbau</p>
      <Werbung />
    </div>
    <div className="mt-4 space-y-3">
      {DREIER.map((d) => {
        const zeilen = [
          `Halal ETFs dieser Liste: ${etfsBei(d.kaufbarName)} von 8`,
          sparplanZeile(d.anbieter),
          d.anbieter === "Scalable Capital" ? "Depotgebühr: 0 € ohne PRIME+" : "Depotgebühr: 0 €",
          "Zinsen aufs Guthaben: 0 %",
        ];
        return (
          <div key={d.anbieter} className="border border-border bg-card p-5 sm:grid sm:grid-cols-[minmax(0,1fr)_180px] sm:gap-6">
            <div>
              <p className="text-[19px] font-bold text-foreground">{d.anbieter}</p>
              <ul className="mt-3 space-y-2 text-[15px] text-foreground/80">
                {zeilen.map((z) => (
                  <li key={z} className="flex gap-2.5">
                    {z.includes("noch nicht geprüft") ? (
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
              <div className="flex h-[64px] w-[120px] shrink-0 items-center justify-center border border-border bg-background sm:h-[76px] sm:w-full">
                <img src={logoPfad(d.logo)} alt={`Logo ${d.anbieter}`} width={128} height={128} loading="lazy" className="h-12 w-auto max-w-[80%] object-contain" />
              </div>
              <a
                href={d.out}
                rel="sponsored nofollow"
                className="inline-flex flex-1 items-center justify-center bg-primary px-4 py-3 text-[16px] font-semibold text-primary-foreground hover:bg-primary/90 sm:flex-none"
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

const Eintrag = ({ e }: { e: EtfEintrag }) => {
  const a = anlageVon(e.isin);
  return (
    <article id={anker(e)} className="scroll-mt-24">
      <h3 className="text-[20px] font-semibold leading-snug text-foreground">
        {e.platz}. {e.name}, am besten für {e.amBestenFuer}
      </h3>
      {/* Kopf der Seite in unserer Datenbank am Laptop (1280 × 720, Faktor 1,5), bis über „Verfügbar bei“ */}
      <Link to={`/halal-anlagen/${a.slug}`} className="mt-5 block overflow-hidden rounded-md border border-border">
        <picture>
          {/* Am Handy wäre die Laptop-Aufnahme unlesbar klein, darum dort der Handy-Ausschnitt derselben Seite */}
          <source media="(min-width: 768px)" srcSet={`/bilder/blog/halal-etf/laptop/${a.slug}.webp`} width={1440} height={510} />
          <img
          src={`/bilder/blog/halal-etf/${a.slug}.webp`}
          alt={`${e.name} in der finanzmuslim Datenbank: ISIN ${e.isin}, Kosten ${a.kostenLabel} im Jahr, Fondsgröße und Auflage`}
          width={716}
          height={852}
          loading="lazy"
          className="h-auto w-full"
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

/** Kleine Tabelle wie frontal: am Laptop eine Tabelle, am Handy je Zeile ein Block. */
const KleineTabelle = ({
  kopf,
  zeilen,
  breit = [],
}: {
  kopf: string[];
  zeilen: { schluessel: string; erste: ReactNode; zellen: ReactNode[] }[];
  breit?: number[];
}) => (
  <div className="mt-5 max-w-[720px] border border-border">
    <table className="block w-full border-collapse text-[15px] sm:table">
      <thead className="hidden sm:table-header-group">
        <tr className="border-b border-border bg-muted/60 text-left">
          {kopf.map((k) => (
            <th key={k} className="px-4 py-3 font-mono text-[11px] font-normal uppercase tracking-[0.14em] text-muted-foreground">
              {k}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="block sm:table-row-group">
        {zeilen.map((z) => (
          <tr
            key={z.schluessel}
            className="grid grid-cols-2 gap-x-4 gap-y-2 border-t border-border px-4 py-3.5 first:border-t-0 sm:table-row sm:p-0"
          >
            <td className="col-span-2 align-top font-semibold leading-snug text-foreground sm:table-cell sm:px-4 sm:py-3">{z.erste}</td>
            {z.zellen.map((c, i) => (
              <td
                key={kopf[i + 1]}
                data-label={kopf[i + 1]}
                className={`align-top text-foreground/80 before:block before:font-mono before:text-[10px] before:uppercase before:tracking-[0.14em] before:text-muted-foreground before:content-[attr(data-label)] sm:table-cell sm:px-4 sm:py-3 sm:before:hidden ${
                  breit.includes(i) ? "col-span-2" : ""
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
  const ids = useMemo(() => ABSCHNITTE.map((a) => a.id), []);
  const aktiv = useAktiv(ids);
  const depots = gepruefteDepots();
  const stand = kaufbarStand();
  const maxKaufbar = Math.max(...etfListe.map((e) => kaufbarBei(e.isin).length));
  const alleAnbieter = [...new Set(etfListe.flatMap((e) => kaufbarBei(e.isin)))];
  const alleAcht = alleAnbieter.filter((d) => etfsBei(d) === etfListe.length).sort((x, y) => x.localeCompare(y, "de"));
  const seltenster = [...etfListe].sort((x, y) => kaufbarBei(x.isin).length - kaufbarBei(y.isin).length)[0];

  const inhalt = (
    <ol>
      {ABSCHNITTE.map((a) => (
        <li key={a.id}>
          <a
            href={`#${a.id}`}
            className={`block border-l py-[7px] pl-3 text-[15px] leading-snug transition-colors hover:text-primary ${
              aktiv === a.id ? "border-primary text-primary" : "border-transparent text-foreground/70"
            }`}
          >
            {a.titel}
          </a>
        </li>
      ))}
    </ol>
  );

  const etfZelle = (e: EtfEintrag) => (
    <a href={`#${anker(e)}`} className="hover:text-primary">
      {e.platz}. {e.name}
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
              <div className="mt-8 border border-border bg-card p-6">
                <Etikett className="text-primary">Dein Vermögensaufbau</Etikett>
                <p className="font-titel mt-3 text-[25px] leading-[1.15] text-foreground">Langfristig investieren, ohne einen Cent Riba?</p>
                <p className="mt-3 text-[15px] leading-relaxed text-foreground/75">
                  In 2 Minuten siehst du, welches Depot deine Halal ETFs als Sparplan führt und dir keine Zinsen zahlt.
                </p>
                <Link to="/vergleich/depot" className="leuchtlinie mt-6 inline-block">
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
              <Link to="/wissen" className="text-primary hover:underline">
                Blog
              </Link>
              <span aria-hidden>/</span>
              <span>Beste Halal ETFs 2026</span>
            </nav>

            <article className="mt-8">
              <Etikett className="text-primary">Halal ETFs</Etikett>
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
              <nav aria-label="Auf dieser Seite" className="mt-7 border-y border-border py-3 xl:hidden">
                <button
                  type="button"
                  onClick={() => setOffen((v) => !v)}
                  aria-expanded={offen}
                  className="flex w-full items-center justify-between font-mono text-[12px] uppercase tracking-[0.14em] text-foreground"
                >
                  Auf dieser Seite
                  <ChevronDown className={`h-4 w-4 transition-transform ${offen ? "rotate-180" : ""}`} aria-hidden />
                </button>
                {offen && <div className="mt-3">{inhalt}</div>}
              </nav>

              {/* 3 Einstieg */}
              <div className="mt-8">
                <Text>
                  <p>
                    Du willst als Muslim in einen ETF sparen und stehst vor derselben Frage wie fast jeder: Welcher ist
                    wirklich halal, und welcher trägt das Wort nur im Namen?
                  </p>
                  <p>
                    Ich habe 12 Halal ETFs nach fünf Kriterien verglichen und bei {depots} Depots nachgesehen, wo du sie
                    kaufen kannst. Acht sind geblieben.
                  </p>
                  <p>
                    Der bekannteste ist der iShares MSCI World Islamic, der größte der Liste und seit 2007 am Markt. Er steht
                    auf Platz 1 nach unseren fünf Kriterien. Das ist ein Vergleich, keine Empfehlung für deine Lage.
                  </p>
                </Text>

                {/* 4 Google-Kasten */}
                <GoogleKasten />

                {/* 5 Das Wichtigste wie frontal „Key Takeaways“ */}
                <section className="mt-10 border-l-2 border-primary bg-muted/60 px-5 py-6 md:px-8 md:py-7">
                  <H2 id="das-wichtigste" />
                  <p className="mt-1.5 text-[15px] text-muted-foreground">Die kurze Fassung, bevor es ins Detail geht.</p>
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
                    Grundlagen in deiner Stufe.
                  </p>
                </section>

                {/* 6 Rechner */}
                <Rechner />

                {/* 7 Begriff erklärt */}
                <section className="mt-12">
                  <H2 id="was-ist-ein-halal-etf" />
                  <Text>
                    <p>
                      Ein Halal ETF ist ein Fonds, der nur Aktien oder Sukuk kauft, die eine Shariah-Prüfung bestehen. Andere Namen dafür
                      sind islamische ETFs, auf Englisch Islamic ETF. Meist folgt der Fonds einem Index, aus dem alles fliegt, was
                      nicht passt.
                    </p>
                    <p>
                      Geprüft wird zweimal. Zuerst der Index: Womit verdient die Firma ihr Geld? Wie hoch sind ihre verzinsten
                      Schulden? Wie viel liegt zinsbringend in der Bilanz? Wer über einem Grenzwert liegt, ist raus. Die
                      Grenzwerte stehen in <TL to="/wissen/sind-aktien-halal">Sind Aktien halal?</TL>
                    </p>
                    <p>
                      Danach der Fonds selbst. Er kann einen sauberen Index nachbilden und trotzdem Aktien verleihen. Oder er
                      bildet den Index nur über ein Tauschgeschäft mit einer Bank nach. Deshalb zählt, ob ein Gremium den Fonds
                      geprüft hat oder nur den Index.
                    </p>
                    <p>
                      Ein Halal ETF ist kein Nachhaltigkeitsfonds. ESG- und SRI-Fonds schließen oft Waffen und Tabak aus. Banken
                      und Versicherungen sind dort aber häufig unter den größten Positionen, Zinsgrenzen prüfen sie nicht.
                    </p>
                    <p>
                      Ein Halal ETF ist auch nicht sicher. Halal heißt erlaubt. Er schwankt wie jeder Aktienfonds, ein Verlust
                      ist jederzeit möglich.
                    </p>
                    <p>
                      Und ein Zertifikat bestätigt in aller Regel die Methode, nicht jede einzelne Firma. Wer einen Islamic ETF
                      kauft, folgt der Auffassung, dass kleine, unvermeidbare Zinsberührungen unter den Grenzwerten hinnehmbar
                      sind, wenn der unreine Teil gereinigt wird.
                    </p>
                  </Text>
                </section>

                {/* 8 So haben wir verglichen */}
                <section className="mt-12">
                  <H2 id="so-haben-wir-verglichen" />
                  <Text>
                    {KRITERIEN.map((k) => (
                      <p key={k.name}>
                        <strong className="font-semibold text-foreground">{k.name}.</strong> {k.text}
                      </p>
                    ))}
                    <p>
                      Wie ich Depots und Anbieter grundsätzlich prüfe, steht in der <TL to="/vergleiche/methodik">Methodik</TL>.
                    </p>
                  </Text>
                </section>

                {/* 9 Depots, erstes Mal */}
                <DepotKasten />

                {/* 10 Die acht Plätze, Video am Ende von Platz 1 */}
                <section className="mt-14">
                  <H2 id="die-besten-halal-etfs" />
                  <Text>
                    <p>
                      Die Reihenfolge folgt den fünf Kriterien oben. Platz 1 ist der bekannteste und hat den Sparplan bei
                      den meisten Depots. Die Plätze 2 bis 7 decken je einen bestimmten Wunsch ab, Platz 8 kauft keine
                      Aktien, sondern Sukuk.
                    </p>
                    <p>
                      Jedes Bild zeigt die Seite des ETFs in unserer Datenbank. Ein Klick darauf öffnet alle Daten mit ISIN
                      und Beleg.
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
                                Lieber hören als lesen? Im Video erkläre ich, worauf du achten musst, damit ein ETF halal ist.
                              </p>
                            </Text>
                            <Video />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>

                {/* 11 Tabellen wie frontal: wenige Spalten, kurze Wörter */}
                <section className="mt-14">
                  <H2 id="halal-etf-liste" />
                  <KleineTabelle
                    kopf={["ETF", "Kosten", "Halal-Beleg", "Passt zu"]}
                    breit={[2]}
                    zeilen={etfListe.map((e) => {
                      const a = anlageVon(e.isin);
                      return {
                        schluessel: e.isin,
                        erste: etfZelle(e),
                        zellen: [
                          <span className="whitespace-nowrap tabular-nums">{a.kostenLabel}</span>,
                          a.zertifikatArt === "produkt" ? "Gremium am Fonds" : "nur Index",
                          gross(e.amBestenFuer),
                        ],
                      };
                    })}
                  />
                  <p className="font-titel mt-7 max-w-[664px] border-l-2 border-primary pl-5 text-[20px] leading-[1.4] text-foreground">
                    Platz 1 verbindet ein Gremium am Fonds mit 0,30 % Kosten und dem Sparplan bei 14 Depots, mehr als bei
                    jedem anderen ETF hier.
                  </p>
                  <p className="font-titel mt-10 text-[21px] leading-tight text-foreground">Rendite im Vergleich</p>
                  <KleineTabelle
                    kopf={["ETF", "1 Jahr", "3 Jahre", "5 Jahre"]}
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
                    Quelle: justETF, in Euro mit Ausschüttungen, Stand {RENDITE_STAND}. Ein Strich heißt: Der Fonds ist für
                    diesen Zeitraum noch zu jung. Platz 6 steht seit Auflage im Februar 2026 bei +17,62 %. Vergangene
                    Renditen sind kein Versprechen für die Zukunft.
                  </p>
                  <Text>
                    <p>
                      Außerdem in Deutschland zu haben, ohne belegten Sparplan:{" "}
                      <TL to="/halal-anlagen/hsbc-msci-usa-islamic-screened">HSBC MSCI USA Islamic Screened</TL>,{" "}
                      <TL to="/halal-anlagen/hsbc-msci-europe-islamic-screened">HSBC MSCI Europe Islamic Screened</TL> und{" "}
                      <TL to="/halal-anlagen/hsbc-msci-emerging-markets-islamic-screened-capped">
                        HSBC MSCI Emerging Markets Islamic Screened
                      </TL>
                      , je 0,30 bis 0,35 % im Jahr. Dazu der{" "}
                      <TL to="/halal-anlagen/xtrackers-ii-salam-usd-global-aggregate-sukuk">Xtrackers Salam Sukuk</TL>: Sparplan belegt, aber ein veröffentlichtes Shariah-Zertifikat haben wir nicht gefunden.
                    </p>
                  </Text>
                </section>

                {/* 12 Welcher passt */}
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
                            Platz {e.platz}: {e.name}
                          </a>,
                        ],
                      };
                    })}
                  />
                </section>

                {/* 13 ETF oder Fonds */}
                <section className="mt-12">
                  <H2 id="halal-etf-oder-fonds" />
                  <Text>
                    <p>
                      Ein Halal ETF folgt meist einem Index und wird an der Börse gehandelt. Einen Ausgabeaufschlag zahlst du nicht, nur die Ordergebühr deines Depots.
                    </p>
                    <p>
                      Ein Halal Fonds wird meist aktiv gemanagt, ein Team wählt die Firmen aus. Viele dieser Fonds verlangen beim
                      Kauf einen Ausgabeaufschlag, etwa die Shariah-Fonds von Comgest, Franklin und BNP. Für einen Sparplan über
                      viele Jahre ist der ETF darum meist günstiger. Platz 7 liegt dazwischen: ein aktiver Fonds im ETF-Mantel.
                    </p>
                  </Text>
                </section>

                {/* 14 Wo du die acht kaufen kannst */}
                <section className="mt-12">
                  <H2 id="wo-kaufen" />
                  <Text>
                    <p>
                      Für die acht ETFs habe ich bei {depots} Depots nachgesehen, ob du sie kaufen kannst. Gezählt wird nur,
                      was der Anbieter selbst zeigt, Stand {stand}.
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
                                {e.platz}. {e.name}
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
                  <Text>
                    <p>
                      Wie ich prüfe, steht in der <TL to="/vergleiche/methodik">Methodik</TL>.
                    </p>
                  </Text>
                </section>

                {/* 15 Häufige Fragen, Fragen wortgleich (THEMENKARTE.md Z. 107-114) */}
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

                {/* 16 Nächster Schritt, Depots zweites Mal */}
                <section className="mt-12">
                  <H2 id="naechster-schritt" />
                  <Text>
                    <p>
                      Neben dem ETF zählt das Depot. Es sollte deinen ETF als Sparplan
                      führen und dir keine Zinsen aufs Guthaben zahlen. Ein Depot eröffnest du online in rund 10 Minuten mit
                      Foto-Ident. Danach legst du den Sparplan auf deinen ETF an. Im{" "}
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
                  <div className="mt-3 flex gap-4">
                    <img src={eliasPortrait} alt="Elias El-Gendy" width={72} height={72} loading="lazy" className="h-[72px] w-[72px] shrink-0 object-cover" />
                    <div>
                      <p className="text-[17px] font-semibold text-foreground">
                        <Link to="/ueber-mich" className="hover:text-primary">
                          Elias El-Gendy
                        </Link>
                      </p>
                      <p className="mt-1 text-[15px] leading-relaxed text-foreground/75">{BIO}</p>
                      <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[14px]">
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
