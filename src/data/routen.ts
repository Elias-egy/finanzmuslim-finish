import { halalAnlagen } from "@/data/halalAnlagen";
import { guides } from "@/data/guides";
import { partnerLinks } from "@/data/partnerLinks";
import { startPartner } from "./investmentStart";

/**
 * Die eine Liste aller öffentlichen, indexierbaren Adressen.
 *
 * Warum es diese Datei gibt: Vorher wurde die Sitemap von Hand gepflegt. Beim
 * letzten Abgleich fehlten acht echte Seiten, darunter der Depot-Vergleich.
 * Eine Liste, die jemand nachtragen muss, ist irgendwann falsch. Jetzt lesen
 * Sitemap-Erzeugung und Prerendering aus dieser Datei, und die Anlagenseiten
 * entstehen direkt aus `halalAnlagen`. Eine neue Anlage steht damit automatisch
 * in der Sitemap und wird automatisch vorgerendert.
 *
 * Was hier NICHT hineingehört:
 *
 * - Zweitschreibweisen derselben Seite. `/zakatrechner` und `/zakat-rechner`
 *   zeigen dasselbe, in die Sitemap gehört nur die kanonische Adresse, die
 *   auch im Canonical steht.
 * - Weiterleitungen wie `/blog` oder `/wissen/was-ist-riba`. Sie haben keinen
 *   eigenen Inhalt.
 * - `/out/name`. Das sind Partner-Weiterleitungen, sie dürfen nicht in den
 *   Index und stehen deshalb auch nicht in der Sitemap.
 * - `/dein-investmentstart`. Die Seite setzt noindex.
 * - Die Fehlerseite.
 *
 * `quelle` nennt die Dateien, aus denen der sichtbare Inhalt stammt. Daraus
 * entsteht das lastmod: das Datum der letzten echten Änderung an diesen
 * Dateien, nicht das Datum des Builds.
 */

export type Route = {
  /** Kanonischer Pfad mit führendem Slash, ohne Schrägstrich am Ende. */
  pfad: string;
  /** Dateien, deren Inhalt die Seite zeigt. Basis für lastmod. */
  quelle: string[];
  changefreq: "daily" | "weekly" | "monthly" | "yearly";
  prioritaet: string;
};

const wissenBeitrag = (slug: string, datei: string): Route => ({
  pfad: `/wissen/${slug}`,
  quelle: [`src/pages/wissen/${datei}`, "src/components/BeitragSeite.tsx"],
  changefreq: "monthly",
  prioritaet: "0.7",
});

const vorlage = (slug: string, datei: string): Route => ({
  pfad: `/vorlagen/${slug}`,
  quelle: [`src/pages/vorlagen/${datei}`, "src/components/VorlagenSeite.tsx"],
  changefreq: "monthly",
  prioritaet: "0.7",
});

const rechner = (pfad: string, datei: string): Route => ({
  pfad,
  quelle: [`src/pages/${datei}`, "src/components/RechnerSeite.tsx"],
  changefreq: "monthly",
  prioritaet: "0.8",
});

/** Alles außer den Anlagen-Detailseiten. Reihenfolge = Reihenfolge im XML. */
export const festeRouten: Route[] = [
  { pfad: "/", quelle: ["src/pages/Index.tsx"], changefreq: "weekly", prioritaet: "1.0" },
  { pfad: "/halal-guide", quelle: ["src/pages/HalalGuide.tsx"], changefreq: "weekly", prioritaet: "0.9" },

  { pfad: "/halal-anlagen", quelle: ["src/pages/HalalAnlagen.tsx", "src/data/halalAnlagen.ts"], changefreq: "weekly", prioritaet: "0.9" },
  { pfad: "/vergleiche", quelle: ["src/pages/Vergleiche.tsx"], changefreq: "monthly", prioritaet: "0.8" },
  { pfad: "/vergleich/start", quelle: ["src/pages/VergleichAssistent.tsx", "src/data/vergleichAssistent.ts"], changefreq: "monthly", prioritaet: "0.9" },
  { pfad: "/vergleich/depot", quelle: ["src/pages/VergleichDepot.tsx", "src/data/brokerVergleich.ts"], changefreq: "monthly", prioritaet: "0.9" },
  { pfad: "/vergleich/girokonto", quelle: ["src/pages/VergleichGirokonto.tsx", "src/data/girokontoVergleich.ts"], changefreq: "monthly", prioritaet: "0.9" },
  { pfad: "/vergleich/krypto", quelle: ["src/pages/VergleichKrypto.tsx", "src/data/kryptoVergleich.ts"], changefreq: "monthly", prioritaet: "0.9" },
  { pfad: "/vergleich/screening-apps", quelle: ["src/pages/VergleichScreener.tsx", "src/data/screenerVergleich.ts"], changefreq: "monthly", prioritaet: "0.9" },
  { pfad: "/vergleich/edelmetalle", quelle: ["src/pages/VergleichEdelmetalle.tsx", "src/data/edelmetallVergleich.ts"], changefreq: "monthly", prioritaet: "0.9" },
  { pfad: "/vergleiche/methodik", quelle: ["src/pages/VergleichMethodik.tsx", "src/lib/bewertung.ts"], changefreq: "monthly", prioritaet: "0.6" },

  { pfad: "/rechner", quelle: ["src/pages/Rechner.tsx"], changefreq: "monthly", prioritaet: "0.7" },
  rechner("/zakat-rechner", "Zakatrechner.tsx"),
  rechner("/renditerechner", "Renditerechner.tsx"),
  rechner("/inflationsrechner", "Inflationsrechner.tsx"),
  rechner("/bereinigungsrechner", "Bereinigungsrechner.tsx"),
  rechner("/auswanderungsrechner", "Auswanderungsrechner.tsx"),
  rechner("/kreditkostenrechner", "Kreditkostenrechner.tsx"),
  rechner("/budgetrechner", "Budgetrechner.tsx"),
  rechner("/sparzielrechner", "Sparzielrechner.tsx"),

  { pfad: "/wissen", quelle: ["src/pages/Wissen.tsx"], changefreq: "weekly", prioritaet: "0.8" },
  wissenBeitrag("zinsen-im-islam", "ZinsenImIslam.tsx"),
  wissenBeitrag("sind-aktien-halal", "SindAktienHalal.tsx"),
  wissenBeitrag("halal-etfs", "HalalEtfs.tsx"),
  wissenBeitrag("halal-gold-kaufen", "HalalGoldKaufen.tsx"),
  wissenBeitrag("sukuk", "Sukuk.tsx"),
  wissenBeitrag("ist-bitcoin-halal", "IstBitcoinHalal.tsx"),
  wissenBeitrag("nisab", "Nisab.tsx"),
  wissenBeitrag("ertraege-reinigen", "ErtraegeReinigen.tsx"),
  wissenBeitrag("gharar", "Gharar.tsx"),
  wissenBeitrag("maysir", "Maysir.tsx"),
  wissenBeitrag("haeufige-fehler", "HaeufigeFehler.tsx"),
  wissenBeitrag("erbe", "Erbe.tsx"),
  wissenBeitrag("halal-kredit-ohne-zinsen", "HalalKreditOhneZinsen.tsx"),
  wissenBeitrag("haus-kaufen-ohne-zinsen", "HausKaufenOhneZinsen.tsx"),
  wissenBeitrag("girokonto-ohne-zinsen", "GirokontoOhneZinsen.tsx"),
  wissenBeitrag("ist-versicherung-haram", "IstVersicherungHaram.tsx"),
  wissenBeitrag("ist-leasing-haram", "IstLeasingHaram.tsx"),
  wissenBeitrag("ratenzahlung-haram", "RatenzahlungHaram.tsx"),
  wissenBeitrag("auto-kaufen-ohne-zinsen", "AutoKaufenOhneZinsen.tsx"),
  wissenBeitrag("kreditkarte-halal", "KreditkarteHalal.tsx"),
  wissenBeitrag("dispo-und-schulden", "DispoUndSchulden.tsx"),
  wissenBeitrag("trading-forex-cfd", "TradingForexCfd.tsx"),
  wissenBeitrag("zakat-auf-aktien-etf-krypto", "ZakatAufAktienEtfKrypto.tsx"),

  { pfad: "/vorlagen", quelle: ["src/pages/Vorlagen.tsx", "src/data/vorlagen.ts"], changefreq: "monthly", prioritaet: "0.8" },
  vorlage("halal-anlagen", "HalalAnlagen.tsx"),
  vorlage("vertrags-ampel", "VertragsAmpel.tsx"),
  vorlage("aktien-check", "AktienCheck.tsx"),
  vorlage("rizq", "Rizq.tsx"),
  vorlage("baraka-blocker", "BarakaBlocker.tsx"),
  vorlage("top-100-halal-aktien", "Top100HalalAktien.tsx"),

  { pfad: "/newsletter", quelle: ["src/pages/Newsletter.tsx"], changefreq: "monthly", prioritaet: "0.6" },
  { pfad: "/deals", quelle: ["src/pages/Deals.tsx", "src/data/deals.ts"], changefreq: "weekly", prioritaet: "0.6" },
  { pfad: "/ueber-mich", quelle: ["src/pages/UeberMich.tsx"], changefreq: "yearly", prioritaet: "0.6" },
  { pfad: "/kooperationen", quelle: ["src/pages/Kooperationen.tsx"], changefreq: "monthly", prioritaet: "0.4" },
  { pfad: "/wie-ich-geld-verdiene", quelle: ["src/pages/WieIchGeldVerdiene.tsx"], changefreq: "yearly", prioritaet: "0.5" },
  { pfad: "/impressum", quelle: ["src/pages/Impressum.tsx"], changefreq: "yearly", prioritaet: "0.3" },
  { pfad: "/datenschutz", quelle: ["src/pages/Datenschutz.tsx"], changefreq: "yearly", prioritaet: "0.3" },
];

/**
 * Eine Seite je Anlage, direkt aus den Anlagedaten. Kein zweites Verzeichnis,
 * das gepflegt werden müsste.
 *
 * Die Kursdatei steht bewusst NICHT in `quelle`. Sie wird alle paar Wochen neu
 * geholt, und dann wäre jede der 27 Seiten „geändert", ohne dass sich am
 * Inhalt etwas geändert hat. Ein lastmod, das bei jedem Datenlauf springt,
 * verliert seine Aussage.
 */
export const anlagenRouten = (): Route[] =>
  halalAnlagen.map((a) => ({
    pfad: `/halal-anlagen/${a.slug}`,
    quelle: [
      "src/data/halalAnlagen.ts",
      "src/pages/halal-anlagen/AnlageDetail.tsx",
      "src/data/zusammensetzung.ts",
    ],
    changefreq: "monthly" as const,
    prioritaet: "0.7",
  }));

/** Alle indexierbaren Adressen, feste und erzeugte. */
export const alleRouten = (): Route[] => [...festeRouten, ...anlagenRouten()];

/**
 * Adressen, die es gibt, die aber bewusst draußen bleiben. Steht hier, damit
 * die Prüfung beim Build erkennt, ob eine Route im Router auftaucht, die weder
 * aufgenommen noch ausdrücklich ausgeschlossen wurde.
 */
/**
 * Adressen, die ausgeliefert werden müssen, aber nicht in den Index gehören.
 *
 * Der Unterschied zu `bewusstDraussen` ist wichtig: dort steht, was nicht in
 * die Sitemap gehört. Hier steht, was trotzdem als Datei existieren muss.
 *
 * Warum das nötig ist: Ohne SPA-Umleitung liefert ein statischer Hoster nur
 * aus, was als Datei da liegt. Alles andere wird zu einer echten 404, und
 * genau das wollen wir für Tippfehler. Eine Seite, die es nur im Router gibt,
 * fällt damit aber ebenfalls aus. Beim ersten Auslieferungstest traf das die
 * Guide-Adressen und die Partnerweiterleitung, also ausgerechnet die beiden
 * Wege, über die Geld und Leser hereinkommen.
 *
 * Diese Seiten werden vorgerendert wie jede andere, setzen aber noindex und
 * stehen nicht in der Sitemap.
 */
export const nichtIndexiert: string[] = [
  "/dein-investmentstart",
  ...startPartner.filter((p) => p.kurzname !== "scalable").map((p) => p.pfad),
  ...guides.map((g) => `/dein-guide/${g.schluessel}`),
];

/**
 * Adressen, die nur weiterleiten. Auf einem statischen Hoster gibt es kein
 * 301, deshalb bekommt jede eine winzige eigene Datei, die sofort weiterschickt
 * und per Canonical auf das Ziel zeigt.
 *
 * `/blog/*` lässt sich nicht aufzählen. Alte Unteradressen des Blogs landen
 * damit im 404 statt in der Weiterleitung. Welche das waren, weiß niemand mehr;
 * sobald die Search Console welche meldet, gehören sie hier hinein.
 */
export const weiterleitungen: { von: string; nach: string }[] = [
  { von: "/zakatrechner", nach: "/zakat-rechner" },
  { von: "/tools", nach: "/rechner" },
  { von: "/dein-investment-start", nach: "/dein-investmentstart" },
  { von: "/blog", nach: "/wissen" },
  { von: "/wissen/was-ist-riba", nach: "/wissen/zinsen-im-islam" },
  { von: "/reinigungsrechner", nach: "/bereinigungsrechner" },
  ...partnerLinks.map((p) => ({ von: `/out/${p.kurzname}`, nach: p.ziel })),
];

export const bewusstDraussen: { pfad: string; grund: string }[] = [
  { pfad: "/zakatrechner", grund: "Zweitschreibweise von /zakat-rechner" },
  { pfad: "/tools", grund: "Zweitschreibweise von /rechner" },
  { pfad: "/dein-investmentstart", grund: "setzt noindex" },
  { pfad: "/dein-investmentstart/:partner", grund: "Startseite je Partner, setzt noindex" },
  { pfad: "/dein-guide/:schluessel", grund: "Guide nur ueber den verschickten Link, setzt noindex" },
  { pfad: "/dein-investment-start", grund: "Zweitschreibweise, setzt noindex" },
  { pfad: "/blog", grund: "Weiterleitung auf /wissen" },
  { pfad: "/blog/*", grund: "Weiterleitung auf /wissen" },
  { pfad: "/wissen/was-ist-riba", grund: "Weiterleitung auf /wissen/zinsen-im-islam" },
  { pfad: "/reinigungsrechner", grund: "Weiterleitung auf /bereinigungsrechner, seit 05.09.2026 umbenannt" },
  { pfad: "/out/:kurzname", grund: "Partner-Weiterleitung, gehört nicht in den Index" },
  { pfad: "*", grund: "Fehlerseite" },
];
