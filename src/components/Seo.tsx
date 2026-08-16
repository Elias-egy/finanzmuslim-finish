import { useEffect } from "react";

/**
 * Zentrale SEO-Komponente. Jede oeffentliche Route setzt damit einen EIGENEN
 * Title, eine eigene Description, ein eigenes Canonical und eigene og-Tags.
 *
 * Befund 08.08.2026 (zwei getrennte Probleme):
 *
 * 1. index.html lieferte fuer JEDE URL denselben Title und global das og:title
 *    "Gruenderzugang - nur 50 Plaetze". Jeder geteilte Link zeigte diesen Teaser.
 *
 * 2. react-helmet-async hat auf KEINER Seite funktioniert. Im DOM stand kein
 *    einziges [data-rh]-Element, auch nicht auf /halal-guide, /impressum oder
 *    /dein-investmentstart. Damit war auch das noindex auf /dein-investmentstart
 *    wirkungslos. Deshalb hier bewusst KEINE Bibliothek, sondern direkte
 *    DOM-Manipulation: deterministisch, ohne Abhaengigkeit, React-18-sicher.
 *
 * Googlebot rendert JavaScript und sieht diese Tags. Der belastbarere Weg waere
 * echtes Prerendering beim Build; das ist ein groesserer Eingriff in die
 * Build-Pipeline und steht separat an.
 */

const SITE = "https://finanzmuslim.com";
const DEFAULT_OG = `${SITE}/og-default.jpg`;

/** Erzeugt oder aktualisiert ein <meta>-Tag im <head>. */
const setMeta = (attr: "name" | "property", key: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

export type SeoProps = {
  title: string;
  description: string;
  /** Pfad mit fuehrendem Slash, z. B. "/tools". */
  path: string;
  /** Absolute URL. Ohne Angabe das Standard-Teaserbild. */
  image?: string;
  noindex?: boolean;
  /** Structured Data (JSON-LD). Ein Objekt oder mehrere. */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
};

const Seo = ({ title, description, path, image, noindex, jsonLd }: SeoProps) => {
  const url = `${SITE}${path}`;
  const og = image ?? DEFAULT_OG;
  const ld = jsonLd ? JSON.stringify(Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : "";

  useEffect(() => {
    document.title = title;

    setMeta("name", "description", description);
    setMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow");

    setMeta("property", "og:type", "website");
    setMeta("property", "og:site_name", "finanzmuslim");
    setMeta("property", "og:locale", "de_DE");
    setMeta("property", "og:url", url);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:image", og);

    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", og);

    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = url;
  }, [title, description, url, og, noindex]);

  // JSON-LD getrennt: muss beim Routenwechsel wieder verschwinden, sonst
  // sammeln sich die Schemata der zuvor besuchten Seiten im <head> an.
  useEffect(() => {
    if (!ld) return;
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.dataset.seo = "route";
    script.textContent = ld;
    document.head.appendChild(script);
    return () => {
      script.remove();
    };
  }, [ld]);

  return null;
};

const MONATE = [
  "Januar", "Februar", "März", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Dezember",
];

/** "16. August 2026" nach "2026-08-16". Schema.org will ISO 8601, ein
 *  deutsches Datum wird dort stillschweigend verworfen. */
const isoDatum = (deutsch: string) => {
  const m = /^(\d{1,2})\.\s*([A-Za-zÄÖÜäöü]+)\s+(\d{4})$/.exec(deutsch.trim());
  if (!m) return deutsch;
  const monat = MONATE.indexOf(m[2]) + 1;
  if (!monat) return deutsch;
  return `${m[3]}-${String(monat).padStart(2, "0")}-${m[1].padStart(2, "0")}`;
};

/**
 * Structured Data eines Wissensbeitrags: Artikel, Fragenliste, Brotkrumen.
 *
 * Die Fragenliste ist der Grund für diese Funktion. Google zeigt zu solchen
 * Fragen ausklappbare Antworten direkt im Ergebnis, und jeder Beitrag hat die
 * Fragen ohnehin schon als Datenfeld. Ohne Auszeichnung liest sie niemand.
 */
export const beitragJsonLd = (opts: {
  titel: string;
  beschreibung: string;
  path: string;
  geprueftAm: string;
  faq: { frage: string; antwort: string }[];
}) => [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.titel,
    description: opts.beschreibung,
    inLanguage: "de-DE",
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE}${opts.path}` },
    author: { "@type": "Person", name: "Elias El-Gendy" },
    publisher: { "@type": "Organization", name: "finanzmuslim", url: SITE },
    dateModified: isoDatum(opts.geprueftAm),
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: opts.faq.map((f) => ({
      "@type": "Question",
      name: f.frage,
      acceptedAnswer: { "@type": "Answer", text: f.antwort },
    })),
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Start", item: SITE },
      { "@type": "ListItem", position: 2, name: "Wissen", item: `${SITE}/wissen` },
      { "@type": "ListItem", position: 3, name: opts.titel, item: `${SITE}${opts.path}` },
    ],
  },
];

/** Organisation + Autor: E-E-A-T-Signal, auf der Startseite eingebunden. */
export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "finanzmuslim",
  url: SITE,
  logo: `${SITE}/apple-touch-icon.png`,
  description:
    "Bildung fuer islamkonformes (halal) Investieren: Guides, Rechner und Kriterien-Checks fuer Muslime in Deutschland.",
  founder: {
    "@type": "Person",
    name: "Elias El-Gendy",
    jobTitle: "Gruender",
    knowsAbout: ["Halal Investieren", "Islamic Finance", "ETF", "Sukuk", "Riba"],
  },
  sameAs: [
    "https://www.instagram.com/finanz.muslim/",
    "https://www.tiktok.com/@finanz.muslim",
    "https://www.youtube.com/@finanz.muslim",
  ],
};

/** Baut ein FAQPage-Schema aus Frage/Antwort-Paaren. */
export const faqJsonLd = (items: { q: string; a: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((it) => ({
    "@type": "Question",
    name: it.q,
    acceptedAnswer: { "@type": "Answer", text: it.a },
  })),
});

/** Rechner werden als WebApplication ausgezeichnet (Rich-Result-faehig). */
export const calculatorJsonLd = (opts: { name: string; description: string; path: string }) => ({
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: opts.name,
  description: opts.description,
  url: `${SITE}${opts.path}`,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  inLanguage: "de-DE",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
  publisher: { "@type": "Organization", name: "finanzmuslim", url: SITE },
});

export default Seo;
