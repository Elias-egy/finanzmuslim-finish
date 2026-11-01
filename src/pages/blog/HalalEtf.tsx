import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Check, ChevronDown, ChevronRight, Play } from "lucide-react";
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
const VEROEFFENTLICHT = { text: "16. August 2026", iso: "2026-08-16T09:00:00+02:00" };
const AKTUALISIERT = { text: "1. November 2026", iso: "2026-11-01T09:00:00+01:00" };
const INSTAGRAM = "https://www.instagram.com/finanz.muslim/";
const YOUTUBE = "https://www.youtube.com/@finanz.muslim";
const VIDEO_ID = "uO0ZnlaFolw";
const BIO =
  "Elias El-Gendy hat die Sachkundeprüfungen nach § 34d und § 34f GewO abgeschlossen. Er berät Muslime zum islamkonformen Investieren und klärt auf Instagram (@finanz.muslim) über 15.000 Abonnenten über Halal Finance auf.";
const RECHTSHINWEIS =
  "Dieser Beitrag dient ausschließlich zu Bildungszwecken, ist keine Fatwa und keine Anlageberatung. Die Rangfolge folgt den genannten Kriterien und ersetzt keine Prüfung deiner eigenen Lage. Zu Wertpapierleihe, synthetischer Nachbildung und zur Reinigung von Erträgen bestehen zwischen den Rechtsschulen und einzelnen Gremien unterschiedliche Auffassungen. Investitionen in Wertpapiere sind mit Risiken verbunden, bis hin zum Totalverlust. Vergangene Renditen sind kein Versprechen für die Zukunft.";
const RIBA_ZEILE = "Riba-frei bleiben: Zinsen aufs Guthaben abwählen, nie auf Kredit kaufen.";

/* ------------------------------------------------------------------ */
/* Inhalt                                                              */
/* ------------------------------------------------------------------ */

type Abschnitt = { id: string; titel: string };

const ABSCHNITTE: Abschnitt[] = [
  { id: "das-wichtigste", titel: "Das Wichtigste" },
  { id: "was-ist-ein-halal-etf", titel: "Was ist ein Halal ETF, und was nicht?" },
  { id: "so-haben-wir-geprueft", titel: "So haben wir geprüft" },
  { id: "die-besten-halal-etfs", titel: "Die besten Halal ETFs 2026" },
  { id: "halal-etf-liste", titel: "Halal ETF Liste: welche Halal ETFs gibt es in Deutschland?" },
  { id: "welcher-passt", titel: "Welcher Halal ETF passt zu dir?" },
  { id: "halal-etf-oder-fonds", titel: "Halal ETF oder Halal Fonds: was ist der Unterschied?" },
  { id: "pruefung-in-zahlen", titel: "Unsere Prüfung in Zahlen" },
  { id: "haeufige-fragen", titel: "Häufige Fragen" },
  { id: "naechster-schritt", titel: "Finde dein Depot für Halal ETFs" },
];

const WICHTIGSTES: { lead: string; text: ReactNode }[] = [
  {
    lead: "Geprüft wird auf zwei Ebenen.",
    text: "Der Index wirft Firmen raus, die bei der Shariah-Prüfung durchfallen. Danach zählt, was der Fonds selbst tut, etwa ob er Aktien verleiht.",
  },
  {
    lead: "Ein Gremium am Produkt zählt mehr als eins am Index.",
    text: "Sechs der acht ETFs haben ein eigenes Gremium mit Zertifikat. Bei zweien betrifft der Beleg nur den Index.",
  },
  {
    lead: "Die Kosten liegen bei 0,30 bis 0,75 % im Jahr.",
    text: "Bei 10.000 € sind das 30 bis 75 € im Jahr. Die passiven ETFs kosten höchstens 0,40 %.",
  },
  {
    lead: "Die Reinigung bleibt bei dir.",
    text: (
      <>
        Auch geprüfte Firmen haben kleine Zinserträge. Den unreinen Anteil deiner Erträge rechnest du aus und gibst
        ihn weiter, siehe <TL to="/wissen/ertraege-reinigen">Aktienbereinigung</TL>.
      </>
    ),
  },
  {
    lead: "Das Depot zählt mit.",
    text: (
      <>
        Der sauberste ETF hilft wenig, wenn dein Depot dir Zinsen aufs Guthaben zahlt. Welche Depots ohne Zinsen
        gehen, steht im <TL to="/vergleich/depot">Depot-Vergleich</TL>.
      </>
    ),
  },
];

const KRITERIEN: { name: string; text: string }[] = [
  {
    name: "Halal-Beleg",
    text: "Hat der Fonds ein eigenes Gremium mit Fatwa und jährlichem Zertifikat, zählt das mehr als ein Beleg nur zum Index. Ich urteile nie selbst, ich zeige den Beleg des Anbieters.",
  },
  {
    name: "Kosten",
    text: "Die laufenden Kosten im Jahr. Bei 10.000 € macht jedes Zehntelprozent 10 € im Jahr aus.",
  },
  {
    name: "Sparplan",
    text: "Bei wie vielen Depots der ETF als Sparplan läuft, nur mit Beleg vom Anbieter selbst. Ohne Beleg steht dort „nicht belegt“, nicht „nein“.",
  },
  {
    name: "Größe und Alter",
    text: "Fondsvermögen in Mio. € und Jahr der Auflage. Ein alter Fonds hat echte Zahlen statt einer Rückrechnung des Index.",
  },
  {
    name: "Rendite",
    text: `Ein Jahr und die Kalenderjahre 2024 und 2025, in Euro mit Ausschüttungen, von justETF, Stand ${RENDITE_STAND}. Ein Kriterium unter fünf, nie das einzige.`,
  },
];

const PASST: { wenn: string; achte: string; platz: number }[] = [
  { wenn: "Wenn du mit einem Sparplan anfängst", achte: "Sparplan bei deinem Depot belegt", platz: 1 },
  { wenn: "Wenn Gewinne im Fonds bleiben sollen", achte: "thesaurierend, also ohne Ausschüttung", platz: 2 },
  { wenn: "Wenn du Schwellenländer dazu willst", achte: "nur als kleiner Teil neben Platz 1", platz: 4 },
  { wenn: "Wenn ein Teil ruhiger liegen soll", achte: "der Kurs des Dollars wirkt mit", platz: 8 },
];

type Frage = { frage: string; antwort: string; link?: { to: string; text: string } };

const tradeRepublicZahl = etfListe.filter((e) => kaufbarBei(e.isin).includes("Trade Republic")).length;
const ohneTradeRepublic = etfListe.filter((e) => !kaufbarBei(e.isin).includes("Trade Republic")).map((e) => e.name);

const FRAGEN: Frage[] = [
  {
    frage: "Ist ein ETF halal oder haram?",
    antwort:
      "Das hängt am Inhalt, nicht an der Hülle. Ein normaler ETF kauft ohne Prüfung auch Banken und Versicherungen. Ein Islamic ETF folgt einem geprüften Index, und bei sechs der acht ETFs hier hat ein Gremium den Fonds selbst geprüft.",
  },
  {
    frage: "Sind ETFs haram?",
    antwort:
      "Nicht von sich aus. Die Gremien dieser Fonds haben für den ETF als Form eine Fatwa erteilt und prüfen, was drin ist und was der Fonds tut. Haram kann der Inhalt sein, etwa Banken mit Zinsgeschäft im normalen MSCI World.",
  },
  {
    frage: "Welche Halal ETFs gibt es bei Trade Republic?",
    antwort: `Laut Wertpapiersuche von Trade Republic kannst du ${tradeRepublicZahl} der 8 ETFs dieser Liste kaufen, alle außer ${ohneTradeRepublic.join(
      ", ",
    )}. Einen Sparplan darauf hat uns Trade Republic nicht belegt. Wie das Depot mit Zinsen aufs Guthaben umgeht, steht im Depot-Vergleich.`,
    link: { to: "/vergleich/depot", text: "Zum Depot-Vergleich" },
  },
  {
    frage: "Ist der MSCI World halal?",
    antwort:
      "Der normale MSCI World filtert nichts nach islamischen Regeln, Banken und Versicherungen sind darin. Kein Gremium hat ihn geprüft. Den geprüften Weg geht der MSCI World Islamic, den du mit Platz 1 dieser Liste kaufst.",
    link: { to: "/halal-anlagen/ishares-msci-world-islamic", text: "iShares MSCI World Islamic ansehen" },
  },
  {
    frage: "Welche ETFs sind scharia-konform?",
    antwort:
      "Scharia-konform nennen sich ETFs mit Islamic, Shariah oder Islamic Screened im Namen. Ob ein Gremium sie geprüft hat, zeigt erst der Beleg. Alle acht ETFs dieser Liste haben einen, die Tabelle oben zeigt, ob er für den Fonds oder nur den Index gilt.",
  },
  {
    frage: "Wie prüfe ich, ob ein ETF halal ist?",
    antwort:
      "Such die ISIN, nicht den Namen. Dann zwei Fragen: Gibt es ein Shariah-Zertifikat für das Produkt oder nur für den Index, und wann wurde es zuletzt erneuert? Beides steht bei jeder Anlage in unserer Datenbank mit Link zum Beleg.",
    link: { to: "/halal-anlagen", text: "Zur Datenbank der Halal-Anlagen" },
  },
  {
    frage: "Was kostet ein Halal ETF im Jahr?",
    antwort:
      "Auf dieser Liste 0,30 bis 0,75 % im Jahr. Bei 10.000 € sind das 30 bis 75 €. Dazu kommen die Gebühren deines Depots für Kauf oder Sparplan, bei vielen Depots ab 0 €.",
  },
  {
    frage: "Muss ich die Erträge eines Halal ETFs reinigen?",
    antwort:
      "Ja, den kleinen unreinen Anteil. Auch geprüfte Firmen haben etwas Zinserträge. Diesen Anteil deiner Ausschüttung oder deines Gewinns rechnest du aus und gibst ihn als Spende weiter.",
    link: { to: "/wissen/ertraege-reinigen", text: "So rechnest du die Reinigung" },
  },
];

const DREIER: { anbieter: string; kaufbarName: string; domain: string; out: string }[] = [
  { anbieter: "Traders Place", kaufbarName: "Traders Place", domain: "tradersplace.de", out: "/out/traders-place" },
  { anbieter: "Smartbroker+", kaufbarName: "Smartbroker+", domain: "smartbrokerplus.de", out: "/out/smartbroker" },
  { anbieter: "Scalable Capital", kaufbarName: "Scalable Capital", domain: "scalable.capital", out: "/out/scalable" },
];

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
  <h2 id={id} className="scroll-mt-28 text-[26px] font-bold leading-[1.2] text-foreground md:text-[32px]">
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

/** Schwebender Knopf B: erscheint, sobald „Auf einen Blick“ aus dem Bild ist. */
const SchwebendB = () => {
  const [zeigen, setZeigen] = useState(false);
  useEffect(() => {
    const pruefen = () => setZeigen(window.scrollY > 900);
    pruefen();
    window.addEventListener("scroll", pruefen, { passive: true });
    return () => window.removeEventListener("scroll", pruefen);
  }, []);
  return (
    <Link
      to="/vergleich/depot"
      aria-hidden={!zeigen}
      tabIndex={zeigen ? 0 : -1}
      className={`fixed right-4 top-[72px] z-30 inline-flex items-center gap-1 rounded-xl bg-primary px-4 py-2.5 text-[15px] font-semibold text-primary-foreground shadow-lg transition-opacity md:top-[84px] ${
        zeigen ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      Depot-Vergleich
      <ChevronRight className="h-4 w-4" aria-hidden />
    </Link>
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
        sameAs: [INSTAGRAM, "https://www.tiktok.com/@finanz.muslim", YOUTUBE],
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

const Karte = ({ e }: { e: EtfEintrag }) => {
  const a = anlageVon(e.isin);
  return (
    <li className="flex w-[82%] shrink-0 snap-start flex-col rounded-2xl border border-border bg-card p-5 sm:w-[300px]">
      <p className="text-[13px] font-semibold tabular-nums text-muted-foreground">{String(e.platz).padStart(2, "0")}</p>
      <p className="mt-1 text-[17px] font-bold leading-snug text-foreground">{e.name}</p>
      <p className="mt-2 text-[15px] text-foreground/85">Am besten für {e.amBestenFuer}</p>
      <p className="mt-3 text-[22px] font-bold tabular-nums text-foreground">
        {a.kostenLabel} <span className="text-[14px] font-medium text-muted-foreground">im Jahr</span>
      </p>
      <p className="mt-2 text-[14px] text-muted-foreground">
        Geprüft von{" "}
        <a href={a.zertifikatLink} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
          {e.geprueftKurz}
        </a>
      </p>
      <p className="mt-2 text-[15px] leading-snug text-foreground/85">{e.satz}</p>
      <details className="mt-3 text-[14px]">
        <summary className="cursor-pointer font-medium text-foreground">Dafür und dagegen</summary>
        <ul className="mt-2 space-y-1 text-muted-foreground">
          {e.dafuer.map((d) => (
            <li key={d}>+ {d}</li>
          ))}
          {e.dagegen.map((d) => (
            <li key={d}>− {d}</li>
          ))}
        </ul>
      </details>
      <a href={`#${anker(e)}`} className="mt-auto pt-4 text-[15px] font-semibold text-primary hover:underline">
        Zum Eintrag
      </a>
    </li>
  );
};

const Eintrag = ({ e }: { e: EtfEintrag }) => {
  const a = anlageVon(e.isin);
  const sp = sparplanAnzahl(e);
  return (
    <article id={anker(e)} className="scroll-mt-28 border-t border-border pt-10 first:border-t-0 first:pt-0">
      <h3 className="text-[22px] font-bold leading-snug text-foreground md:text-[26px]">
        {e.platz}. {e.name}, am besten für {e.amBestenFuer}
      </h3>
      {/* Bildschirmfoto je Eintrag (Vorlage 1.1 Nr. 12) folgt in SEO25: /bilder/blog/halal-etf/<anker>.webp */}
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
          {a.kostenLabel} im Jahr, bei 10.000 € also {Math.round(a.kosten * 100)} € im Jahr. Dazu kommen die Gebühren
          deines Depots für Kauf oder Sparplan. Sparplan belegt bei {sp === 0 ? "keinem Anbieter" : `${sp} Anbietern`}
          {sp > 0 ? `: ${e.sparplanBei.join(", ")}.` : "."}
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
          ISIN {e.isin}.{" "}
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
  const lesezeit = 14;

  const inhalt = (
    <ol className="space-y-2">
      {ABSCHNITTE.map((a) => (
        <li key={a.id}>
          <a
            href={`#${a.id}`}
            className={`block text-[15px] leading-snug transition-colors hover:text-primary ${
              aktiv === a.id ? "font-semibold text-primary" : "text-foreground/80"
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
        <div className="relative lg:mx-auto lg:max-w-[900px] xl:max-w-[1160px] xl:pl-[260px]">
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
            {/* 2 Titel, 3 Autorzeile */}
            <h1 className="text-[32px] font-bold leading-[1.12] text-foreground md:text-[44px]">{TITEL}</h1>
            <div className="mt-4 flex items-center gap-3 text-[14px] text-muted-foreground">
              <img src={eliasPortrait} alt="Elias El-Gendy" width={40} height={40} className="h-10 w-10 rounded-full object-cover" />
              <p className="leading-snug">
                <a href={INSTAGRAM} rel="author noopener noreferrer" target="_blank" className="font-medium text-foreground hover:text-primary hover:underline">
                  Elias El-Gendy
                </a>
                <span aria-hidden> · </span>
                <Link to="/ueber-mich" className="hover:text-primary hover:underline">
                  Über mich
                </Link>
                <br />
                Aktualisiert am {AKTUALISIERT.text} · Veröffentlicht am {VEROEFFENTLICHT.text} · {lesezeit} Min.
              </p>
            </div>
            <p className="mt-2 text-[13px] text-muted-foreground">
              Neu am {AKTUALISIERT.text}: Liste mit acht ETFs, Renditen per {RENDITE_STAND}.
            </p>

            {/* 4 Auf einen Blick */}
            <section aria-labelledby="auf-einen-blick" className="mt-6">
              <p id="auf-einen-blick" className="text-[13px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                Auf einen Blick
              </p>
              <p className="mt-1 text-[19px] font-bold text-foreground">8 Halal ETFs auf einen Blick</p>
              <ul className="-mx-4 mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-3 [scrollbar-width:thin]">
                {etfListe.map((e) => (
                  <Karte key={e.isin} e={e} />
                ))}
              </ul>
            </section>

            {/* 4b Titelbild */}
            <img
              src={TITELBILD}
              alt="Beste Halal ETFs 2026: acht Islamic ETFs mit Platz, Kosten im Jahr und Art der Halal-Prüfung"
              width={1600}
              height={900}
              className="mt-5 h-auto w-full rounded-2xl border border-border"
            />

            {/* 5 Inhaltsverzeichnis (Handy) */}
            <nav aria-label="Auf dieser Seite" className="mt-5 xl:hidden">
              <button
                type="button"
                onClick={() => setOffen((v) => !v)}
                aria-expanded={offen}
                className="flex items-center gap-1.5 text-[16px] font-semibold text-foreground"
              >
                Auf dieser Seite
                <ChevronDown className={`h-4 w-4 transition-transform ${offen ? "rotate-180" : ""}`} aria-hidden />
              </button>
              {offen && <div className="mt-3 border-l-2 border-border pl-4">{inhalt}</div>}
            </nav>

            <div className="relative mt-6">
              {/* 5 Inhaltsverzeichnis links, darunter C */}
              <aside className="absolute right-full top-0 hidden h-full w-[230px] pr-8 xl:block" aria-label="Inhaltsverzeichnis">
                <div className="sticky top-28">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Auf dieser Seite</p>
                  <div className="mt-3">{inhalt}</div>
                  <div className="mt-6 rounded-2xl border border-border p-4">
                    <p className="text-[15px] font-bold leading-snug text-foreground">Welches Depot hat deine Halal ETFs ohne Zinsen?</p>
                    <Link to="/vergleich/depot" className="mt-2 inline-flex items-center gap-1 text-[15px] font-semibold text-primary hover:underline">
                      Zum Depot-Vergleich
                      <ChevronRight className="h-4 w-4" aria-hidden />
                    </Link>
                  </div>
                </div>
              </aside>

              {/* 6 Einstieg */}
              <Text>
                <p>
                  Der beste Halal ETF ist 2026 für die meisten der <strong>iShares MSCI World Islamic</strong>: größter
                  Islamic ETF für die ganze Welt, seit 2007 am Markt, mit eigenem Gelehrtengremium. Ich habe 12 Halal ETFs
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
                  titel="Welches Depot hat deine Halal ETFs ohne Zinsen?"
                  satz="Im Depot-Vergleich siehst du je Depot die Halal ETFs, den Sparplan und den Umgang mit Zinsen."
                  knopf="Zum Depot-Vergleich"
                />
              </div>

              {/* 9 Begriff erklärt */}
              <section className="mt-12">
                <H2 id="was-ist-ein-halal-etf">Was ist ein Halal ETF, und was nicht?</H2>
                <Text>
                  <p>
                    Ein Halal ETF ist ein Fonds, der nur Firmen kauft, die eine Shariah-Prüfung bestehen. Man nennt sie auch
                    islamische ETFs, auf Englisch Islamic ETF. Der Fonds folgt einem Index, aus dem alles fliegt, was nicht
                    passt. Er entscheidet selbst nichts, er kauft die Liste ab.
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
                    sind, wenn der unreine Teil gereinigt wird. Es gibt Gelehrte, die strenger sind.
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
                    Wie ich Depots und Anbieter grundsätzlich prüfe, steht in der <TL to="/vergleich/methodik">Methodik</TL>.
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
                      <ul className="mt-3 space-y-1.5 text-[15px] text-foreground/85">
                        {[
                          `${etfsBei(d.kaufbarName)} von 8 ETFs dieser Liste`,
                          "Sparplan ab 1 €",
                          "Keine Depotgebühr",
                          "Ohne Zinsen ab dem ersten Tag",
                        ].map((z) => (
                          <li key={z} className="flex gap-2">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-gain" aria-hidden />
                            <span>{z}</span>
                          </li>
                        ))}
                      </ul>
                      <a
                        href={d.out}
                        rel="sponsored nofollow"
                        className="mt-4 inline-flex items-center justify-center gap-1 rounded-xl bg-primary px-4 py-3 text-[16px] font-semibold text-primary-foreground hover:bg-primary/90"
                      >
                        Zum Angebot*
                      </a>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-[14px] text-foreground/80">{RIBA_ZEILE}</p>
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
                <H2 id="halal-etf-liste">Halal ETF Liste: welche Halal ETFs gibt es in Deutschland?</H2>
                <Text>
                  <p>
                    Alle acht ETFs nach den fünf Kriterien. Renditen in Euro mit Ausschüttungen, justETF, Stand{" "}
                    {RENDITE_STAND}.
                  </p>
                </Text>
                <div className="mt-5 overflow-hidden rounded-2xl border border-border">
                  <table className="block w-full border-collapse text-[15px] lg:table">
                    <thead className="hidden lg:table-header-group">
                      <tr className="bg-muted text-left">
                        {["ETF", "Am besten für", "Kosten", "Größe", "1 Jahr", "2025", "2024", "Halal-Beleg", "Sparplan"].map((k) => (
                          <th key={k} className="px-3 py-3 font-semibold text-foreground">
                            {k}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="block lg:table-row-group">
                      {etfListe.map((e) => {
                        const a = anlageVon(e.isin);
                        const zellen: [string, string][] = [
                          ["Am besten für", e.amBestenFuer],
                          ["Kosten", a.kostenLabel],
                          ["Größe", `${e.groesseMio.toLocaleString("de-DE")} Mio. €`],
                          ["1 Jahr", e.rendite1J ?? `seit Auflage ${e.seitAuflage}`],
                          ["2025", e.rendite2025 ?? "–"],
                          ["2024", e.rendite2024 ?? "–"],
                          ["Halal-Beleg", a.zertifikatArt === "produkt" ? "Gremium am Fonds" : "nur Index"],
                          ["Sparplan", sparplanAnzahl(e) === 0 ? "nicht belegt" : `bei ${sparplanAnzahl(e)}`],
                        ];
                        return (
                          <tr key={e.isin} className="block border-t border-border bg-card py-2 first:border-t-0 lg:table-row lg:py-0 lg:first:border-t">
                            <td className="block px-4 py-1.5 text-[16px] font-semibold text-foreground lg:table-cell lg:px-3 lg:py-3 lg:text-[15px]">
                              <a href={`#${anker(e)}`} className="hover:text-primary">
                                {e.platz}. {e.name}
                              </a>
                            </td>
                            {zellen.map(([k, v]) => (
                              <td
                                key={k}
                                data-label={k}
                                className="flex justify-between gap-4 px-4 py-1 align-top text-muted-foreground before:font-medium before:text-foreground/70 before:content-[attr(data-label)] lg:table-cell lg:px-3 lg:py-3 lg:before:hidden"
                              >
                                <span className="text-right lg:text-left">{v}</span>
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
                    <TL to="/halal-anlagen/xtrackers-ii-salam-usd-global-aggregate-sukuk">Xtrackers Salam Sukuk</TL>.
                  </p>
                </Text>
              </section>

              {/* 15 Was passt zu wem */}
              <section className="mt-12">
                <H2 id="welcher-passt">Welcher Halal ETF passt zu dir?</H2>
                <Text>
                  <p>Für die meisten reicht Platz 1. Diese vier Fälle sind die Ausnahme.</p>
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
                    Ein Halal ETF folgt einem Index und wird an der Börse gehandelt. Auf dieser Liste kostet er 0,30 bis 0,75 %
                    im Jahr, einen Ausgabeaufschlag gibt es nicht.
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
                    Für jeden der acht ETFs habe ich bei {depots} Depots nachgesehen, ob du ihn kaufen kannst. Gezählt wird nur,
                    was der Anbieter selbst in seiner Wertpapiersuche oder Produktliste zeigt. Stand {stand}.
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
                            <span className="truncate">
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
                    Dazu hat jeder Eintrag oben ein Bildschirmfoto seiner Seite in unserer Datenbank, mit ISIN, Kosten und
                    Prüfstelle. Wie wir prüfen, steht in der <TL to="/vergleich/methodik">Methodik</TL>.
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
                <H2 id="naechster-schritt">Finde dein Depot für Halal ETFs</H2>
                <Text>
                  <p>
                    Der ETF ist die halbe Entscheidung. Die andere Hälfte ist das Depot. Es sollte deinen ETF als Sparplan
                    führen und dir keine Zinsen aufs Guthaben zahlen. Dazu sollte es wenig kosten. Im{" "}
                    <TL to="/vergleich/depot">Depot-Vergleich</TL> siehst du je Depot, welche Halal ETFs es hat und wie es mit
                    Zinsen umgeht.
                  </p>
                </Text>
              </section>

              {/* 20 Autorbox */}
              <section className="mt-12 flex gap-4 rounded-2xl border border-border p-5 md:p-6" aria-label="Über den Autor">
                <img src={eliasPortrait} alt="Elias El-Gendy" width={72} height={72} loading="lazy" className="h-[72px] w-[72px] shrink-0 rounded-full object-cover" />
                <div>
                  <p className="text-[17px] font-bold text-foreground">
                    <Link to="/ueber-mich" className="hover:text-primary">
                      Elias El-Gendy
                    </Link>
                  </p>
                  <p className="mt-1 text-[15px] leading-relaxed text-foreground/80">{BIO}</p>
                  <p className="mt-2 flex gap-4 text-[14px]">
                    <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">
                      Instagram
                    </a>
                    <a href={YOUTUBE} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">
                      YouTube
                    </a>
                  </p>
                </div>
              </section>

              {/* 21 Passt dazu */}
              <section className="mt-10" aria-labelledby="passt-dazu">
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
              </section>

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
              <p className="mt-8 text-[13px] leading-relaxed text-muted-foreground">
                * Werbung: Eröffnest du über meinen Link ein Depot, bekomme ich eine Provision, ohne Mehrkosten für dich.
              </p>
              <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">{RECHTSHINWEIS}</p>
            </div>
          </article>
        </div>
      </div>
    </main>
  );
};

export default HalalEtf;
