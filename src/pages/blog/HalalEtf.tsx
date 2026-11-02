import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, Check, ChevronDown, ChevronLeft, ChevronRight, Play } from "lucide-react";
import Seo from "@/components/Seo";
import { AnbieterLogo } from "@/components/AnbieterLogo";
import eliasPortrait from "@/assets/elias-autor.webp";
import studioBild from "@/assets/investmentstart-elias-studio.webp";
import vortragBild from "@/assets/guide-elias-vortrag.webp";
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
  sparplanDepots,
  type EtfEintrag,
} from "@/data/halalEtfListe";

/**
 * „Beste Halal ETFs 2026“ nach Vorlage 1 „das Beste“ (VORLAGEN.md 1.1 im Vault, SEO21/SEO22,
 * gebaut SEO24 am 01.11.2026). Eigene Seite statt BeitragSeite: Vorlage 1 verlangt die Form eines
 * richtigen Blogs ohne blaue Flächen und Nummern-Kreise (Elias SEO22). Kästen nur für Aufrufe.
 * Reihenfolge der Abschnitte ist fest, die Nummern im Kommentar sind die der Vorlage.
 */

const SITE = "https://finanzmuslim.com";
const PFAD = "/blog/halal-etf";
const TITEL = "Beste Halal ETFs 2026: 8 im Vergleich";
const META =
  "Beste Halal ETFs 2026: 8 Islamic ETFs im Vergleich nach Halal-Prüfung, Kosten und Sparplan. Mit Renditen, Gremium und den Depots, bei denen du sie kaufst.";
const TITELBILD = "/bilder/blog/halal-etf/beste-halal-etfs-2026.jpg";
const VEROEFFENTLICHT = { text: "16.08.2026", iso: "2026-08-16T09:00:00+02:00" };
const AKTUALISIERT = { text: "01.11.2026", iso: "2026-11-01T09:00:00+01:00" };
const INSTAGRAM = "https://www.instagram.com/finanz.muslim/";
const YOUTUBE = "https://www.youtube.com/@finanz.muslim";
/** LinkedIn-Profil von Elias. Leer, bis es steht: dann erscheinen Link und sameAs (SOP About Page Z. 93, 145). */
const LINKEDIN = "https://www.linkedin.com/in/elias-el-gendy-370616363/";
const PROFILE = [INSTAGRAM, "https://www.tiktok.com/@finanz.muslim", YOUTUBE, ...(LINKEDIN ? [LINKEDIN] : [])];
const VIDEO_ID = "uO0ZnlaFolw";
const BIO =
  "Elias El-Gendy hat die Sachkundeprüfungen nach § 34d und § 34f GewO abgeschlossen. Er berät Muslime zum islamkonformen Investieren und klärt auf Instagram (@finanz.muslim) über 15.000 Abonnenten über Halal Finance auf.";
const RECHTSHINWEIS =
  "Dieser Beitrag dient ausschließlich zu Bildungszwecken, ist keine Fatwa und keine Anlageberatung. Die Rangfolge folgt den genannten Kriterien und ersetzt keine Prüfung deiner eigenen Lage. Zu Wertpapierleihe, synthetischer Nachbildung und zur Reinigung von Erträgen bestehen zwischen den Rechtsschulen und einzelnen Gremien unterschiedliche Auffassungen. Investitionen in Wertpapiere sind mit Risiken verbunden, bis hin zum Totalverlust. Vergangene Renditen sind kein Versprechen für die Zukunft.";
/** Höhe der Bildschirmfotos je Eintrag in Pixeln (Breite 716, aufgenommen bei 390 mit Faktor 2). */
const BILD_HOEHE: Record<string, number> = {
  "ishares-msci-world-islamic": 852,
  "invesco-dow-jones-islamic-global-developed-markets": 912,
  "ishares-msci-usa-islamic": 852,
  "ishares-msci-emerging-markets-islamic": 924,
  "hsbc-msci-world-islamic-screened": 852,
  "invesco-msci-acwi-islamic-m-series": 808,
  "hanetf-saturna-al-kawthar-global-focused-equity": 868,
  "ishares-usd-sukuk-ucits-etf": 852,
};
/** Lesedauer in Minuten: Wörter im Beitrag (innerText von main article bei 390) durch 200, aufgerundet. */
const LESEZEIT = 20;

/* ------------------------------------------------------------------ */
/* Inhalt                                                              */
/* ------------------------------------------------------------------ */

type Abschnitt = { id: string; titel: string };

const ABSCHNITTE: Abschnitt[] = [
  { id: "das-wichtigste", titel: "Das Wichtigste" },
  { id: "was-ist-ein-halal-etf", titel: "Was ist ein Halal ETF, und was nicht?" },
  { id: "so-haben-wir-geprueft", titel: "So haben wir geprüft" },
  { id: "die-besten-halal-etfs", titel: "Die besten Halal ETFs 2026" },
  { id: "halal-etf-liste", titel: "Halal ETF Liste im Vergleich: welche Halal ETFs gibt es in Deutschland?" },
  { id: "welcher-passt", titel: "Welcher Halal ETF passt zu dir?" },
  { id: "halal-etf-oder-fonds", titel: "Halal ETF oder Halal Fonds: was ist der Unterschied?" },
  { id: "pruefung-in-zahlen", titel: "Unsere Prüfung in Zahlen" },
  { id: "haeufige-fragen", titel: "Häufige Fragen" },
  { id: "naechster-schritt", titel: "Nächster Schritt: Finde dein Depot für Halal ETFs" },
];

const WICHTIGSTES: { lead: string; text: ReactNode }[] = [
  {
    lead: "Geprüft wird auf zwei Ebenen.",
    text: "Zuerst wirft der Index Firmen raus, die Grenzwerte reißen, nach dem AAOIFI-Standard etwa über 5 % Umsatz aus Verbotenem. Danach zählt, was der Fonds selbst tut.",
  },
  {
    lead: "Ein Gremium am Produkt zählt mehr als eines am Index.",
    text: "Sechs der acht ETFs haben ein eigenes Gremium mit Zertifikat. Bei zweien betrifft der Beleg nur den Index.",
  },
  {
    lead: "Die Kosten liegen bei 0,30 bis 0,75 % im Jahr.",
    text: "Bei 10.000 € sind das 30 bis 75 € im Jahr.",
  },
  {
    lead: "Die Reinigung ist je Fonds anders.",
    text: (
      <>
        Platz 1 (seit 2026) und Platz 5 geben den kleinen unreinen Anteil selbst weiter, beim Sukuk entfällt er. Bei den
        anderen rechnest du ihn aus und gibst ihn weiter, siehe <TL to="/wissen/ertraege-reinigen">Aktienbereinigung</TL>.
      </>
    ),
  },
  {
    lead: "Das Depot zählt mit.",
    text: (
      <>
        Zahlt dein Depot Zinsen aufs Guthaben, hilft der sauberste ETF wenig. Scalable, Smartbroker+ und
        Traders Place zahlen 0 % aufs Verrechnungskonto, alle weiteren stehen im{" "}
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
    text: "Die laufenden Kosten im Jahr. Bei 10.000 € macht jedes Zehntelprozent 10 € im Jahr aus.",
  },
  {
    name: "Sparplan",
    text: "Bei wie vielen Depots der ETF als Sparplan läuft, nur mit Beleg vom Anbieter. Ohne Beleg steht „nicht belegt“, nicht „nein“.",
  },
  {
    name: "Größe und Alter",
    text: "Fondsvermögen in Mio. € und Jahr der Auflage. Ein alter Fonds hat echte Zahlen statt einer Rückrechnung des Index.",
  },
  {
    name: "Rendite",
    text: `Ein Jahr sowie 2024 und 2025, in Euro mit Ausschüttungen, von justETF, Stand ${RENDITE_STAND}. Ein Kriterium unter fünf, nie das einzige.`,
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
      "Das hängt am Inhalt, nicht an der Hülle. Ein normaler ETF kauft auch Banken und Versicherungen. Ein Islamic ETF kauft nur Aktien oder Sukuk, die eine Shariah-Prüfung bestehen. Bei sechs der acht ETFs hier hat ein Gremium auch den Fonds geprüft.",
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
      "Auf dieser Liste 0,30 bis 0,75 % im Jahr, bei 10.000 € also 30 bis 75 €. Dazu kommen die Gebühren deines Depots, bei vielen ab 0 €.",
  },
  {
    frage: "Muss ich die Erträge eines Halal ETFs reinigen?",
    antwort:
      "Nach verbreiteter Auffassung ja, wenn der Fonds es nicht selbst tut. Der iShares MSCI World Islamic (seit 2026) und der HSBC MSCI World Islamic Screened reinigen im Fonds, beim iShares USD Sukuk entfällt es. Bei den anderen gibst du den unreinen Anteil deiner Erträge weiter.",
    link: { to: "/wissen/ertraege-reinigen", text: "So rechnest du die Reinigung" },
  },
];

const DREIER: { anbieter: string; kaufbarName: string; domain: string; out: string }[] = [
  { anbieter: "Traders Place", kaufbarName: "Traders Place", domain: "tradersplace.de", out: "/out/traders-place" },
  { anbieter: "Smartbroker+", kaufbarName: "Smartbroker+", domain: "smartbrokerplus.de", out: "/out/smartbroker" },
  { anbieter: "Scalable Capital", kaufbarName: "Scalable Capital", domain: "scalable.capital", out: "/out/scalable" },
];

// Sparplan je Depot nur aus den Belegen der Liste (sparplanBei), Scalable mit und ohne PRIME+.
function sparplanZeile(anbieter: string): string {
  const zahl = (name: string) => etfListe.filter((e) => e.sparplanBei.includes(name)).length;
  if (anbieter === "Scalable Capital") return `Sparplan auf ${zahl("Scalable")} von 8 belegt, mit PRIME+ (4,99\u00a0€ im Monat) auf ${zahl("Scalable PRIME+")}`;
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

const H2 = ({ id, children }: { id: string; children: ReactNode }) => (
  <h2 id={id} className="scroll-mt-[136px] text-[26px] font-bold leading-[1.2] text-foreground md:text-[32px]">
    {children}
  </h2>
);

const Text = ({ children }: { children: ReactNode }) => (
  <div className="mt-4 space-y-4 text-[17px] leading-[1.6] text-foreground/85 md:text-[18px]">{children}</div>
);

const Werbung = () => (
  <span className="text-[12px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Werbung</span>
);

/** Bild mit Knopf zum Depot-Vergleich (Aufruf bei rund 15 % und ganz unten). */
const BildAufruf = ({ bild, alt, titel, satz, knopf, hoch = false }: {
  bild: string;
  alt: string;
  titel: string;
  satz: string;
  knopf: string;
  hoch?: boolean;
}) => (
  <aside className="overflow-hidden rounded-2xl border border-border bg-card sm:grid sm:grid-cols-[2fr_3fr]">
    <img
      src={bild}
      alt={alt}
      width={hoch ? 948 : 1760}
      height={hoch ? 1659 : 982}
      loading="lazy"
      className={`h-44 w-full object-cover sm:h-full ${hoch ? "object-[50%_25%]" : "object-[80%_30%]"}`}
    />
    <div className="p-5 md:p-6">
      <p className="text-[19px] font-bold leading-snug text-foreground">{titel}</p>
      <p className="mt-2 text-[16px] leading-relaxed text-muted-foreground">{satz}</p>
      <Link
        to="/vergleich/depot"
        className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-3 text-[16px] font-semibold text-primary-foreground hover:bg-primary/90"
      >
        {knopf}
        <ChevronRight className="h-4 w-4" aria-hidden />
      </Link>
    </div>
  </aside>
);

/** YouTube erst nach dem Klick laden: vorher kein Kontakt zu Google. */
const Video = () => {
  const [an, setAn] = useState(false);
  return (
    <figure className="mt-6">
      <div className="relative aspect-video overflow-hidden rounded-2xl bg-black">
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

/**
 * Schwebend B (VORLAGEN.md 0.2): erscheint, sobald „Auf einen Blick“ aus dem Bild ist. Unter 1280 px als schmale
 * Leiste unter dem Kopf, damit der Knopf keinen Text verdeckt (neben dem Logo ist am Handy kein Platz); ab 1280 px
 * als Knopf im freien rechten Rand.
 */
const SchwebendB = () => {
  const [zeigen, setZeigen] = useState(false);
  useEffect(() => {
    const pruefen = () => setZeigen(window.scrollY > 900);
    pruefen();
    window.addEventListener("scroll", pruefen, { passive: true });
    return () => window.removeEventListener("scroll", pruefen);
  }, []);
  const sichtbar = zeigen ? "opacity-100" : "pointer-events-none opacity-0";
  return (
    <>
      <div
        aria-hidden={!zeigen}
        className={`fixed inset-x-0 top-[60px] z-30 border-b border-border bg-background/95 backdrop-blur transition-opacity md:top-[68px] min-[1536px]:hidden ${sichtbar}`}
      >
        <div className="container flex h-12 items-center justify-between gap-3">
          <p className="truncate text-[14px] font-medium text-foreground/80">Beste Halal ETFs 2026</p>
          <Link
            to="/vergleich/depot"
            tabIndex={zeigen ? 0 : -1}
            className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-primary px-3.5 py-2 text-[14px] font-semibold text-primary-foreground"
          >
            Depot-Vergleich
            <ChevronRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
      <Link
        to="/vergleich/depot"
        aria-hidden={!zeigen}
        tabIndex={zeigen ? 0 : -1}
        className={`fixed right-6 top-[88px] z-30 hidden items-center gap-1 rounded-lg bg-primary px-4 py-2.5 text-[15px] font-semibold text-primary-foreground shadow-lg transition-opacity min-[1536px]:inline-flex ${sichtbar}`}
      >
        Depot-Vergleich
        <ChevronRight className="h-4 w-4" aria-hidden />
      </Link>
    </>
  );
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
/* Seite                                                               */
/* ------------------------------------------------------------------ */

const Etikett = ({ children }: { children: ReactNode }) => (
  <p className="mt-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{children}</p>
);

/** Karte in „Auf einen Blick“ nach der Handy-Skizze (VORLAGEN.md 1.4) und frontal „Quick compare“. */
const Karte = ({ e }: { e: EtfEintrag }) => {
  const a = anlageVon(e.isin);
  return (
    <li className="flex w-[82%] shrink-0 snap-start flex-col rounded-xl border border-border bg-card p-[18px] sm:w-[calc((100%-24px)/3)]">
      <p className="self-start rounded border border-border px-1.5 py-0.5 font-mono text-[12px] tabular-nums text-foreground">
        {String(e.platz).padStart(2, "0")}
      </p>
      <p className="mt-2 text-[19px] font-bold leading-snug text-foreground">{e.name}</p>
      <Etikett>Am besten für</Etikett>
      <p className="mt-0.5 text-[16px] font-semibold leading-snug text-foreground">{e.amBestenFuer}</p>
      <Etikett>Kosten im Jahr</Etikett>
      <p className="mt-0.5 text-[16px] font-semibold tabular-nums text-foreground">{a.kostenLabel}</p>
      <Etikett>Geprüft von</Etikett>
      <p className="mt-0.5 text-[16px] font-semibold leading-snug text-foreground">
        <a href={a.zertifikatLink} target="_blank" rel="noopener noreferrer" className="underline decoration-border underline-offset-2 hover:decoration-foreground">
          {e.geprueftKurz}
        </a>
      </p>
      <p className="mt-2 text-[14px] leading-snug text-muted-foreground">{e.satz}</p>
      <details className="mt-2 text-[14px]">
        <summary className="cursor-pointer text-foreground/80">Dafür und dagegen</summary>
        <ul className="mt-2 space-y-1 text-muted-foreground">
          {e.dafuer.map((d) => (
            <li key={d}>+ {d}</li>
          ))}
          {e.dagegen.map((d) => (
            <li key={d}>− {d}</li>
          ))}
        </ul>
      </details>
      <a href={`#${anker(e)}`} className="mt-3 inline-flex items-center gap-1 text-[15px] font-semibold text-foreground hover:text-primary sm:mt-auto sm:pt-3">
        Zum Eintrag
        <ArrowDown className="h-4 w-4" aria-hidden />
      </a>
    </li>
  );
};

/** „Auf einen Blick“: am Handy wischen, am Laptop zwei Pfeile wie frontal. */
const AufEinenBlick = () => {
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
    const karte = el?.querySelector("li");
    if (el && karte) el.scrollBy({ left: richtung * (karte.getBoundingClientRect().width + 12), behavior: "smooth" });
  };
  const pfeil = "flex h-9 w-9 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:border-foreground disabled:opacity-35 disabled:hover:border-border";
  return (
    <section aria-labelledby="auf-einen-blick" data-vorlage="quick-compare" className="mt-5 border-t border-border pt-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Auf einen Blick</p>
          <p id="auf-einen-blick" className="mt-1 text-[20px] font-bold leading-tight text-foreground md:text-[22px]">
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
        className="-mx-4 mt-3 flex snap-x snap-mandatory scroll-px-4 items-start gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:scroll-px-0 sm:items-stretch sm:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {etfListe.map((e) => (
          <Karte key={e.isin} e={e} />
        ))}
      </ul>
    </section>
  );
};

/** „Sparplan belegt bei …“ mit höchstens drei Namen. */
const sparplanSatz = (e: EtfEintrag, sp: number) => {
  const d = sparplanDepots(e);
  if (sp === 0) return "Einen Sparplan hat uns kein Anbieter belegt.";
  if (sp === 1) return `Sparplan belegt bei ${d[0]}.`;
  if (sp <= 3) return `Sparplan belegt bei ${d.slice(0, -1).join(", ")} und ${d[sp - 1]}.`;
  return `Sparplan belegt bei ${sp} Depots, etwa ${d.slice(0, 2).join(", ")} und ${d[2]}.`;
};

const Eintrag = ({ e }: { e: EtfEintrag }) => {
  const a = anlageVon(e.isin);
  const sp = sparplanAnzahl(e);
  return (
    <article id={anker(e)} className="scroll-mt-[136px] border-t border-border pt-10 first:border-t-0 first:pt-0">
      <h3 className="text-[22px] font-bold leading-snug text-foreground md:text-[26px]">
        {e.platz}. {e.name}, am besten für {e.amBestenFuer}
      </h3>
      {/* Bildschirmfoto je Eintrag (Vorlage 1.1 Nr. 12): Kopf der Seite in unserer Datenbank, bei 390 aufgenommen */}
      <figure className="mt-5 sm:rounded-2xl sm:bg-muted sm:px-6 sm:py-6">
        <Link to={`/halal-anlagen/${a.slug}`} className="mx-auto block max-w-[358px]">
          <img
            src={`/bilder/blog/halal-etf/${a.slug}.webp`}
            alt={`${e.name} in der finanzmuslim Datenbank: ISIN ${e.isin}, Kosten ${a.kostenLabel} im Jahr, Fondsgröße und Auflage`}
            width={716}
            height={BILD_HOEHE[a.slug] ?? 760}
            loading="lazy"
            className="h-auto w-full rounded-xl border border-border shadow-sm"
          />
        </Link>
      </figure>
      <dl className="mt-5 space-y-1.5 text-[16px]">
        <div>
          <dt className="inline font-semibold text-foreground">Am besten für: </dt>
          <dd className="inline text-foreground/85">{e.amBestenFuer}</dd>
        </div>
        <div>
          <dt className="inline font-semibold text-foreground">Kosten: </dt>
          <dd className="inline text-foreground/85">{a.kostenLabel} im Jahr</dd>
        </div>
        <div>
          <dt className="inline font-semibold text-foreground">Warum er auf der Liste ist: </dt>
          <dd className="inline text-foreground/85">{e.satz}</dd>
        </div>
      </dl>
      <Text>
        {e.text.map((t) => (
          <p key={t}>{t}</p>
        ))}
      </Text>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <p className="text-[16px] font-semibold text-foreground">Das spricht dafür</p>
          <ul className="mt-2 space-y-1.5 text-[16px] leading-relaxed text-foreground/85">
            {e.dafuer.map((d) => (
              <li key={d} className="flex gap-2">
                <Check className="mt-1 h-4 w-4 shrink-0 text-gain" aria-hidden />
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[16px] font-semibold text-foreground">Das spricht dagegen</p>
          <ul className="mt-2 space-y-1.5 text-[16px] leading-relaxed text-foreground/85">
            {e.dagegen.map((d) => (
              <li key={d} className="flex gap-2">
                <span className="w-4 shrink-0 text-center font-bold text-loss" aria-hidden>
                  −
                </span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Text>
        <p>{e.schluss}</p>
      </Text>
      <h4 className="mt-6 text-[18px] font-bold text-foreground">{e.name} Kosten</h4>
      <Text>
        <p>
          Bei 10.000 € sind das {Math.round(a.kosten * 100)} € im Jahr plus Depotgebühren. {sparplanSatz(e, sp)}
        </p>
      </Text>
      <h4 className="mt-6 text-[18px] font-bold text-foreground">Wer hat {e.name} geprüft?</h4>
      <Text>
        <p>
          {e.geprueftText}{" "}
          <a href={a.zertifikatLink} target="_blank" rel="noopener noreferrer" className="font-medium text-primary underline underline-offset-2">
            Beleg ansehen
          </a>
        </p>
        <p>
          <TL to={`/halal-anlagen/${a.slug}`}>Alle Daten zu {e.name}</TL>
        </p>
      </Text>
    </article>
  );
};

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
  const lesezeit = LESEZEIT;

  const inhalt = (
    <ol className="border-l border-border">
      {ABSCHNITTE.map((a) => (
        <li key={a.id}>
          <a
            href={`#${a.id}`}
            className={`-ml-px block border-l-2 py-1.5 pl-3 text-[15px] leading-snug transition-colors hover:text-primary ${
              aktiv === a.id ? "border-primary font-medium text-primary" : "border-transparent text-foreground/75"
            }`}
          >
            {a.titel}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <main className="bg-background">
      <Seo title={`${TITEL} | finanzmuslim`} description={META} path={PFAD} image={`${SITE}${TITELBILD}`} jsonLd={graph()} />
      <SchwebendB />
      <div className="container py-8 md:py-12">
        <div className="mx-auto max-w-[760px] xl:grid xl:max-w-[1088px] xl:grid-cols-[280px_minmax(0,760px)] xl:gap-12">
          {/* 5 Inhaltsverzeichnis links ab den Brotkrumen wie frontal, darunter C */}
          <aside className="hidden xl:block" aria-label="Inhaltsverzeichnis">
            <div className="sticky top-24 xl:top-[132px] min-[1536px]:top-24">
              <p className="border-t border-border pt-4 text-[12px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Auf dieser Seite
              </p>
              <div className="mt-4">{inhalt}</div>
              <div className="mt-8 rounded-xl border border-border bg-card p-5">
                <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-primary">Depot-Vergleich</p>
                <p className="mt-2 text-[19px] font-bold leading-snug text-foreground">Welches Depot hat deine Halal ETFs ohne Zinsen?</p>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                  Sieh je Depot die Halal ETFs, den Sparplan und den Umgang mit Zinsen.
                </p>
                <Link
                  to="/vergleich/depot"
                  className="mt-4 inline-flex items-center gap-1 rounded-lg bg-primary px-4 py-2.5 text-[15px] font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  Zum Depot-Vergleich
                  <ChevronRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            </div>
          </aside>

          <div className="min-w-0">
          {/* 1 Brotkrumen */}
          <nav aria-label="Brotkrumen" className="flex flex-wrap items-center gap-1 text-[13px] text-muted-foreground">
            <Link to="/" className="hover:text-primary">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            <Link to="/wissen" className="hover:text-primary">
              Blog
            </Link>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            <span className="text-foreground">{TITEL}</span>
          </nav>

          <article className="mt-5">
            {/* 2 Titel, 3 Autorzeile wie die Skizze: Name · Veröffentlicht · Aktualisiert · Lesedauer */}
            <h1 className="text-[32px] font-bold leading-[1.12] text-foreground md:text-[44px]">{TITEL}</h1>
            <div className="mt-4 flex items-center gap-3 text-[14px] text-muted-foreground">
              <img src={eliasPortrait} alt="Elias El-Gendy" width={40} height={40} className="h-10 w-10 shrink-0 rounded-full object-cover" />
              <p className="leading-snug">
                <a href={LINKEDIN || INSTAGRAM} rel="author noopener noreferrer" target="_blank" className="font-semibold text-foreground hover:text-primary hover:underline">
                  Elias El-Gendy
                </a>
                {" · "}Veröffentlicht am <time dateTime={VEROEFFENTLICHT.iso}>{VEROEFFENTLICHT.text}</time>
                {" · "}Aktualisiert am <time dateTime={AKTUALISIERT.iso}>{AKTUALISIERT.text}</time>
                {" · "}
                {lesezeit} Min.
              </p>
            </div>
            <p className="mt-2 text-[13px] text-muted-foreground">Neu am {AKTUALISIERT.text}: acht ETFs, Renditen per {RENDITE_STAND}.</p>

            {/* 4 Auf einen Blick */}
            <AufEinenBlick />

            {/* 4b Titelbild */}
            {/* Am Handy nur Titel und Unterzeile, die Liste im Bild wäre dort zu klein zum Lesen */}
            <picture>
              <source media="(max-width: 639px)" srcSet="/bilder/blog/halal-etf/beste-halal-etfs-2026-handy.jpg" width={720} height={420} />
              <img
                src={TITELBILD}
                alt="Beste Halal ETFs 2026: acht Islamic ETFs im Vergleich nach Halal-Prüfung, Kosten und Sparplan"
                width={1600}
                height={900}
                className="mt-5 h-auto w-full rounded-2xl border border-border"
              />
            </picture>

            {/* 5 Inhaltsverzeichnis (Handy und Tablet) */}
            <nav aria-label="Auf dieser Seite" className="mt-5 xl:hidden">
              <button
                type="button"
                onClick={() => setOffen((v) => !v)}
                aria-expanded={offen}
                className="flex items-center gap-1.5 text-[13px] font-semibold uppercase tracking-[0.12em] text-muted-foreground"
              >
                <ChevronRight className={`h-3.5 w-3.5 transition-transform ${offen ? "rotate-90" : ""}`} aria-hidden />
                Auf dieser Seite
              </button>
              {offen && <div className="mt-3">{inhalt}</div>}
            </nav>

            <div className="mt-6">
              {/* 6 Einstieg */}
              <Text>
                <p>
                  Der beste Halal ETF ist 2026 für die meisten der <strong>iShares MSCI World Islamic</strong>: größter
                  Fonds der Liste, seit 2007 am Markt, mit eigenem Gelehrtengremium. Ich habe 12 Halal ETFs
                  nach fünf Kriterien verglichen und bei {depots} Depots nachgesehen, wo du sie kaufst. Hier sind die acht,
                  die du als Muslim in Deutschland kennen solltest.
                </p>
              </Text>

              {/* 7 Das Wichtigste, 8 Guide-Link */}
              <section className="mt-10">
                <H2 id="das-wichtigste">Das Wichtigste</H2>
                <ul className="mt-4 space-y-3 text-[17px] leading-[1.6] text-foreground/85 md:text-[18px]">
                  {WICHTIGSTES.map((w) => (
                    <li key={w.lead} className="flex gap-3">
                      <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/60" aria-hidden />
                      <span>
                        <strong className="text-foreground">{w.lead}</strong> {w.text}
                      </span>
                    </li>
                  ))}
                </ul>
                <Text>
                  <p>
                    Neu beim Thema? Im kostenlosen <TL to="/halal-guide">Halal Investment Guide</TL> erkläre ich die
                    Grundlagen in deiner Stufe.
                  </p>
                </Text>
              </section>

              {/* Bild-Aufruf bei rund 15 % */}
              <div className="mt-8">
                <BildAufruf
                  bild={studioBild}
                  alt="Elias El-Gendy, Gründer von finanzmuslim"
                  titel="Wo du diese ETFs ohne Zinsen kaufst"
                  satz="Je Depot siehst du Halal ETFs, Sparplan und Zinsen."
                  knopf="Zum Depot-Vergleich"
                />
              </div>

              {/* 9 Begriff erklärt */}
              <section className="mt-12">
                <H2 id="was-ist-ein-halal-etf">Was ist ein Halal ETF, und was nicht?</H2>
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

              {/* 10 So haben wir geprüft */}
              <section className="mt-12">
                <H2 id="so-haben-wir-geprueft">So haben wir geprüft</H2>
                <ul className="mt-4 space-y-3 text-[17px] leading-[1.6] text-foreground/85 md:text-[18px]">
                  {KRITERIEN.map((k) => (
                    <li key={k.name} className="flex gap-3">
                      <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/60" aria-hidden />
                      <span>
                        <strong className="text-foreground">{k.name}.</strong> {k.text}
                      </span>
                    </li>
                  ))}
                </ul>
                <Text>
                  <p>
                    Wie ich Depots und Anbieter grundsätzlich prüfe, steht in der <TL to="/vergleiche/methodik">Methodik</TL>.
                  </p>
                </Text>
              </section>

              {/* 11 Dreier-Kombi */}
              <section aria-label="Drei Depots für Halal ETFs" className="mt-10 rounded-2xl border border-border p-5 md:p-6">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-[19px] font-bold text-foreground">Drei Depots für diese Halal ETFs</p>
                  <Werbung />
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  {DREIER.map((d) => (
                    <div key={d.anbieter} className="flex flex-col rounded-xl border border-border p-4">
                      <div className="flex items-center gap-3">
                        <AnbieterLogo name={d.anbieter} domain={d.domain} />
                        <p className="text-[17px] font-bold text-foreground">{d.anbieter}</p>
                      </div>
                      <ul className="mb-4 mt-3 space-y-1.5 text-[15px] text-foreground/85">
                        {[
                          `${etfsBei(d.kaufbarName)} von 8 ETFs dieser Liste`,
                          sparplanZeile(d.anbieter),
                          d.anbieter === "Scalable Capital" ? "Ohne PRIME+ keine Depotgebühr" : "Keine Depotgebühr",
                          "Ohne Zinsen ab dem ersten Tag",
                        ].map((z) => (
                          <li key={z} className="flex gap-2">
                            {z.includes("noch nicht geprüft") ? (
                              <span className="mx-[5px] mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" aria-hidden />
                            ) : (
                              <Check className="mt-0.5 h-4 w-4 shrink-0 text-gain" aria-hidden />
                            )}
                            <span>{z}</span>
                          </li>
                        ))}
                      </ul>
                      <a
                        href={d.out}
                        rel="sponsored nofollow"
                        className="mt-auto inline-flex items-center justify-center gap-1 rounded-xl bg-primary px-4 py-3 text-[16px] font-semibold text-primary-foreground hover:bg-primary/90"
                      >
                        Zum Angebot*
                      </a>
                    </div>
                  ))}
                </div>
              </section>

              {/* 12 Die Liste, 13 Video nach Platz 1 */}
              <section className="mt-12">
                <H2 id="die-besten-halal-etfs">Die besten Halal ETFs 2026</H2>
                <Text>
                  <p>
                    Die Reihenfolge folgt den fünf Kriterien oben. Platz 1 passt für die meisten als einziger ETF. Die Plätze
                    2 bis 7 sind Alternativen für einen bestimmten Wunsch. Platz 8 kauft keine Aktien, sondern Sukuk.
                  </p>
                </Text>
                <ol className="mt-4 space-y-1 text-[16px]">
                  {etfListe.map((e) => (
                    <li key={e.isin}>
                      <a href={`#${anker(e)}`} className="text-primary hover:underline">
                        {e.platz}. {e.name}
                      </a>
                    </li>
                  ))}
                </ol>
                <div className="mt-10 space-y-12">
                  {etfListe.map((e) => (
                    <div key={e.isin}>
                      <Eintrag e={e} />
                      {e.platz === 1 && (
                        <div className="mt-8">
                          <Text>
                            <p>In diesem Video erkläre ich, worauf du achten musst, damit ein ETF halal ist.</p>
                          </Text>
                          <Video />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* 14 Vergleichstabelle */}
              <section className="mt-14">
                <H2 id="halal-etf-liste">Halal ETF Liste im Vergleich: welche Halal ETFs gibt es in Deutschland?</H2>
                <Text>
                  <p>
                    Alle acht ETFs nach den fünf Kriterien. Renditen in Euro mit Ausschüttungen und Größe: justETF, Stand{" "}
                    {RENDITE_STAND}; Größe von Platz 7 und 8 aus unserer Datenbank, Stand 14.08.2026.
                  </p>
                </Text>
                <div className="mt-5 overflow-hidden rounded-2xl border border-border">
                  <table className="block w-full border-collapse text-[15px] lg:table lg:text-[14px]">
                    <thead className="hidden lg:table-header-group">
                      <tr className="bg-muted text-left">
                        {["ETF", "Kosten", "Größe", "1 Jahr", "2025", "2024", "Halal-Beleg", "Sparplan"].map((k) => (
                          <th key={k} className={`px-2.5 py-3 align-bottom font-semibold text-foreground ${k === "ETF" ? "w-[34%]" : ""}`}>
                            {k}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="block lg:table-row-group">
                      {etfListe.map((e) => {
                        const a = anlageVon(e.isin);
                        const zellen: [string, ReactNode, boolean][] = [
                          ["Kosten", a.kostenLabel, true],
                          [
                            "Größe",
                            <>
                              {`${e.groesseMio.toLocaleString("de-DE")} Mio. €`}
                              {a.auflage && (
                                <span className="block text-[12px] text-muted-foreground">seit {a.auflage.slice(-4)}</span>
                              )}
                            </>,
                            true,
                          ],
                          [
                            "1 Jahr",
                            e.rendite1J ?? (
                              <>
                                <span className="whitespace-nowrap">{e.seitAuflage}</span>
                                <span className="block text-[12px] text-muted-foreground">seit Auflage</span>
                              </>
                            ),
                            true,
                          ],
                          ["2025", e.rendite2025 ?? "–", true],
                          ["2024", e.rendite2024 ?? "–", true],
                          ["Halal-Beleg", a.zertifikatArt === "produkt" ? "Gremium am\u00a0Fonds" : "nur Index", false],
                          ["Sparplan", sparplanAnzahl(e) === 0 ? "nicht belegt" : `bei ${sparplanAnzahl(e)} ${sparplanAnzahl(e) === 1 ? "Depot" : "Depots"}`, false],
                        ];
                        return (
                          <tr key={e.isin} className="grid grid-cols-2 gap-x-4 gap-y-2 border-t border-border bg-card px-4 py-3.5 first:border-t-0 lg:table-row lg:p-0 lg:first:border-t">
                            <td className="col-span-2 align-top lg:table-cell lg:px-2.5 lg:py-3">
                              <a href={`#${anker(e)}`} className="text-[16px] font-semibold leading-snug text-foreground hover:text-primary lg:text-[14px]">
                                {e.platz}. {e.name}
                              </a>
                              <span className="mt-0.5 block text-[14px] leading-snug text-muted-foreground lg:text-[13px]">
                                Am besten für: {e.amBestenFuer}
                              </span>
                            </td>
                            {zellen.map(([k, v, zahl]) => (
                              <td
                                key={k}
                                data-label={k}
                                className={`align-top text-[15px] text-foreground before:block before:text-[11px] before:font-semibold before:uppercase before:tracking-[0.1em] before:text-muted-foreground before:content-[attr(data-label)] lg:table-cell lg:px-2.5 lg:py-3 lg:text-[14px] lg:text-muted-foreground lg:before:hidden ${
                                  zahl ? "lg:whitespace-nowrap" : ""
                                }`}
                              >
                                {v}
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <Text>
                  <p>
                    Außerdem in Deutschland zu haben, ohne belegten Sparplan:{" "}
                    <TL to="/halal-anlagen/hsbc-msci-usa-islamic-screened">HSBC MSCI USA Islamic Screened</TL>,{" "}
                    <TL to="/halal-anlagen/hsbc-msci-europe-islamic-screened">HSBC MSCI Europe Islamic Screened</TL> und{" "}
                    <TL to="/halal-anlagen/hsbc-msci-emerging-markets-islamic-screened-capped">
                      HSBC MSCI Emerging Markets Islamic Screened
                    </TL>
                    , je 0,30 bis 0,35 % im Jahr. Dazu der{" "}
                    <TL to="/halal-anlagen/xtrackers-ii-salam-usd-global-aggregate-sukuk">Xtrackers Salam Sukuk</TL>: Sparplan belegt, aber ein veröffentlichtes Shariah-Zertifikat haben wir nicht gefunden.
                  </p>
                </Text>
              </section>

              {/* 15 Was passt zu wem */}
              <section className="mt-12">
                <H2 id="welcher-passt">Welcher Halal ETF passt zu dir?</H2>
                <Text>
                  <p>Für die meisten reicht Platz 1. Hier siehst du, welcher Platz zu welchem Wunsch passt.</p>
                </Text>
                <div className="mt-5 overflow-hidden rounded-2xl border border-border">
                  <table className="block w-full border-collapse text-[15px] sm:table">
                    <thead className="hidden sm:table-header-group">
                      <tr className="bg-muted text-left">
                        {["Wenn du …", "Achte auf", "Passt"].map((k) => (
                          <th key={k} className="px-4 py-3 font-semibold text-foreground">
                            {k}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="block sm:table-row-group">
                      {PASST.map((p) => {
                        const e = etfListe.find((x) => x.platz === p.platz)!;
                        return (
                          <tr key={p.wenn} className="block border-t border-border bg-card py-2 first:border-t-0 sm:table-row sm:py-0 sm:first:border-t">
                            <td className="block px-4 py-1.5 text-[16px] font-semibold text-foreground sm:table-cell sm:py-3 sm:text-[15px]">
                              {p.wenn}
                            </td>
                            <td className="block px-4 py-1 text-muted-foreground sm:table-cell sm:py-3">{p.achte}</td>
                            <td className="block px-4 py-1 sm:table-cell sm:py-3">
                              <a href={`#${anker(e)}`} className="font-medium text-primary hover:underline">
                                Platz {e.platz}: {e.name}
                              </a>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* 16 Unterschied */}
              <section className="mt-12">
                <H2 id="halal-etf-oder-fonds">Halal ETF oder Halal Fonds: was ist der Unterschied?</H2>
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

              {/* 17 Unsere Prüfung in Zahlen */}
              <section className="mt-12">
                <H2 id="pruefung-in-zahlen">Unsere Prüfung in Zahlen</H2>
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
                <figure className="mt-5 rounded-2xl border border-border p-5">
                  <figcaption className="text-[16px] font-bold text-foreground">Bei wie vielen Depots du jeden ETF kaufen kannst</figcaption>
                  <ul className="mt-4 space-y-2.5" role="img" aria-label={etfListe.map((e) => `${e.name}: ${kaufbarBei(e.isin).length} Depots`).join(", ")}>
                    {etfListe.map((e) => {
                      const n = kaufbarBei(e.isin).length;
                      return (
                        <li key={e.isin} className="text-[14px]">
                          <div className="flex justify-between gap-3 text-foreground/85">
                            <span>
                              {e.platz}. {e.name}
                            </span>
                            <span className="font-semibold tabular-nums text-foreground">{n}</span>
                          </div>
                          <div className="mt-1 h-2 rounded-full bg-muted">
                            <div className="h-2 rounded-full bg-primary" style={{ width: `${(n / maxKaufbar) * 100}%` }} />
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
                    Wie ich prüfe, steht in der{" "}
                    <TL to="/vergleiche/methodik">Methodik</TL>.
                  </p>
                </Text>
              </section>

              {/* 18 Häufige Fragen */}
              <section className="mt-12">
                <H2 id="haeufige-fragen">Häufige Fragen</H2>
                <div className="mt-4 divide-y divide-border">
                  {FRAGEN.map((f) => (
                    <div key={f.frage} className="py-5 first:pt-0">
                      <h3 className="text-[19px] font-bold leading-snug text-foreground">{f.frage}</h3>
                      <p className="mt-2 text-[17px] leading-[1.6] text-foreground/85">
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

              {/* 19 Nächster Schritt */}
              <section className="mt-12">
                <H2 id="naechster-schritt">Nächster Schritt: Finde dein Depot für Halal ETFs</H2>
                <Text>
                  <p>
                    Der ETF ist die halbe Entscheidung. Die andere Hälfte ist das Depot. Es sollte deinen ETF als Sparplan
                    führen und dir keine Zinsen aufs Guthaben zahlen. Ein Depot eröffnest du online in rund 10 Minuten mit
                    Foto-Ident. Danach legst du den Sparplan auf deinen ETF an. Im{" "}
                    <TL to="/vergleich/depot">Depot-Vergleich</TL> siehst du je Depot, welche Halal ETFs es hat und wie es mit
                    Zinsen umgeht.
                  </p>
                </Text>
              </section>

              {/* 20 Autorbox mit „Über den Autor“ wie frontal „About the author“ */}
              <aside className="mt-12 rounded-2xl border border-border p-5 md:p-6" aria-labelledby="ueber-den-autor">
                <p id="ueber-den-autor" className="text-[12px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Über den Autor
                </p>
                <div className="mt-3 flex gap-4">
                  <img src={eliasPortrait} alt="Elias El-Gendy" width={72} height={72} loading="lazy" className="h-[72px] w-[72px] shrink-0 rounded-full object-cover" />
                  <div>
                    <p className="text-[17px] font-bold text-foreground">
                      <Link to="/ueber-mich" className="hover:text-primary">
                        Elias El-Gendy
                      </Link>
                    </p>
                    <p className="mt-1 text-[15px] leading-relaxed text-foreground/80">{BIO}</p>
                    <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[14px]">
                      {LINKEDIN && (
                        <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">
                          LinkedIn
                        </a>
                      )}
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

              {/* 21 Passt dazu */}
              <aside className="mt-10" aria-labelledby="passt-dazu">
                <p id="passt-dazu" className="text-[19px] font-bold text-foreground">
                  Passt dazu
                </p>
                <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                  {PASST_DAZU.map((p) => (
                    <li key={p.to}>
                      <Link to={p.to} className="block h-full rounded-2xl border border-border p-4 transition-colors hover:border-primary">
                        <span className="block text-[16px] font-bold text-foreground">{p.name}</span>
                        <span className="mt-1 block text-[14px] text-muted-foreground">{p.text}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </aside>

              {/* 22 Bild-Aufruf unten */}
              <div className="mt-10">
                <BildAufruf
                  bild={vortragBild}
                  alt="Elias El-Gendy bei einem Vortrag über halal Investieren"
                  titel="Dein Depot für Halal ETFs"
                  satz="Vergleiche die Depots nach Halal ETFs, Sparplan und Zinsen."
                  knopf="Depots vergleichen"
                  hoch
                />
              </div>

              {/* 23 Fußnote und Rechtshinweis */}
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
