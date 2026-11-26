import { useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowRight, Check, ChevronDown, X } from "lucide-react";
import Seo from "@/components/Seo";
import { AnbieterLogo } from "@/components/AnbieterLogo";
import { MatchBuehne } from "@/components/CheckEinstieg";
import { ereignis } from "@/lib/messung";
import eliasPortrait from "@/assets/elias-autor.webp";
import {
  AnbieterKasten,
  BIO,
  Etikett,
  GoogleKasten,
  H2,
  H3,
  INSTAGRAM,
  Karte,
  KartenReihe,
  LINKEDIN,
  LINKEDIN_FIRMA,
  PROFILE,
  Seitenleiste,
  SITE,
  Tabelle,
  Text,
  TL,
  useAktiv,
  YOUTUBE,
} from "@/components/blog/bausteine";
import { ANKER_BEITRAG, ANKER_VERGLEICH } from "@/data/ankertexte";
import { depotAnzeige } from "@/data/anzeige/depot";
import { ANLAGE_ZEILE } from "@/data/anlagenKaufbar";
import { anlageVon, kaufbarBei } from "@/data/halalEtfListe";
import { DEPOT_APP_BILDER } from "@/data/depotAppBilder";
import { kostenKurz } from "@/data/kostenKurz";
import { zinsHinweis } from "@/data/zinsHinweise";
import type { RohAnbieter } from "@/data/vergleichHelfer";
import { anzahl, depotAnzahl, depotVorn, DEPOT_HALAL_SATZ, nachteil, tradeRepublic } from "@/data/depotRatgeber";

/**
 * Kaufseite „scalable capital vs trade republic“ (SEO86, 26.11.2026) nach VORLAGEN.md Abschnitt 2 „Paar“ (M2.2), nur Vorschau.
 * Karte: fundament/research/quellen/SEO-GUIDE-Z2aCQ5YKaTU/beitraege/scalable-capital-vs-trade-republic.seo.json.
 * Hauptwort und Adresse: Ahrefs 26.11.2026 zeigt „scalable capital vs trade republic“ mit 1.500 Suchen vor „scalable vs trade republic“ mit 600
 * (Skill seo-beitrag Schritt 4, Elias SEO69: Titel und Link tragen die meistgesuchte Schreibweise).
 * Alle Zahlen kommen aus denselben Daten wie der Depot-Vergleich (depotAnzeige, anlagenKaufbar); nichts ist abgetippt. Die Seite
 * sagt „Scalable Capital liegt vorn“ nur, solange die Daten es tragen: Der Test scalableVsTradeRepublic.test.ts hält das fest.
 * Kein Doppel (Kannibalisierung): Das Wort „trade republic alternative“ gehört /blog/trade-republic-alternative, „depot vergleich“
 * gehört /vergleich/depot; hier steht nur je ein Textlink dorthin, die H2 stehen in anderer Reihenfolge als auf der TR-Seite.
 * Kein Video (Elias SEO83-03), kein „ich habe getestet“ (kein belegtes Konto bei Trade Republic).
 */

const PFAD = "/blog/scalable-capital-vs-trade-republic";
const VEROEFFENTLICHT = { text: "26.11.2026", iso: "2026-11-26T09:00:00+01:00" };
const AKTUALISIERT = { text: "26.11.2026", iso: "2026-11-26T09:00:00+01:00" };
/** Lesedauer in Minuten: Wörter im Beitrag (innerText von main article bei 390) durch 200, aufgerundet. */
const LESEZEIT = 8;
const RECHTSHINWEIS =
  "Dieser Beitrag ist keine Fatwa und keine Anlageberatung. Zahlen und Reihenfolge stammen aus unserem Depot-Vergleich. Investitionen in Wertpapiere sind mit Risiken verbunden, bis hin zum Totalverlust.";

/* ------------------------------------------------------------------ */
/* Daten                                                               */
/* ------------------------------------------------------------------ */

const scalable = depotAnzeige.find((a) => a.id === "scalable-capital-free-broker") as RohAnbieter | undefined;
const trade = tradeRepublic as RohAnbieter | undefined;
if (!scalable || !trade) throw new Error("Scalable Capital oder Trade Republic fehlt im Depot-Vergleich");
const sc: RohAnbieter = scalable;
const tr: RohAnbieter = trade;

const must = <T,>(x: T | null | undefined, was: string): T => {
  if (x == null) throw new Error(`Zählung fehlt: ${was}`);
  return x;
};
const scE = must(anzahl(sc, "halalEtfsFonds"), "Scalable Halal-ETFs");
const trE = must(anzahl(tr, "halalEtfsFonds"), "Trade Republic Halal-ETFs");
const scS = must(anzahl(sc, "halalSukuk"), "Scalable Sukuk");
const trS = must(anzahl(tr, "halalSukuk"), "Trade Republic Sukuk");
const scG = must(anzahl(sc, "halalEdelmetalle"), "Scalable ETCs");
const trG = must(anzahl(tr, "halalEdelmetalle"), "Trade Republic ETCs");

/** Kurznamen der Anlagen im Text; ohne Eintrag gilt der Name aus der Halal-Datenbank. */
const KURZ: Record<string, string> = {
  IE00B27YCN58: "iShares MSCI World Islamic",
  IE00B27YCP72: "iShares MSCI Emerging Markets Islamic",
  IE00B296QM64: "iShares MSCI USA Islamic",
  IE000UOXRAM8: "Invesco Dow Jones Islamic Global Developed Markets",
  IE000LFC57H7: "Invesco MSCI ACWI Islamic",
  IE00BMYMHS24: "HANetf Saturna Al-Kawthar",
  IE00B4ZJ4634: "Comgest Growth Europe",
  LU2458330086: "Franklin Shariah Technology Fund",
  IE000929U2U9: "iShares USD Sukuk",
  LU3123443510: "Xtrackers II Salam USD Global Aggregate Sukuk",
  LU1150255971: "BNP Paribas Islamic Fund Hilal Income",
};
const kurzName = (isin: string) => KURZ[isin] ?? anlageVon(isin).name;
const bei = (isin: string, haus: "Scalable Capital" | "Trade Republic") => kaufbarBei(isin).includes(haus);
const isinsDerZeile = (z: "halalEtfsFonds" | "halalSukuk") => Object.entries(ANLAGE_ZEILE).filter(([, zeile]) => zeile === z).map(([isin]) => isin);
const nurScalable = (z: "halalEtfsFonds" | "halalSukuk") => isinsDerZeile(z).filter((i) => bei(i, "Scalable Capital") && !bei(i, "Trade Republic")).map(kurzName);
const beide = (z: "halalEtfsFonds" | "halalSukuk") => isinsDerZeile(z).filter((i) => bei(i, "Scalable Capital") && bei(i, "Trade Republic")).map(kurzName);
const keiner = (z: "halalEtfsFonds" | "halalSukuk") => isinsDerZeile(z).filter((i) => !bei(i, "Scalable Capital") && !bei(i, "Trade Republic")).map(kurzName);
const nurScalableEtf = nurScalable("halalEtfsFonds");
const nurScalableSukuk = nurScalable("halalSukuk");
const beideEtf = beide("halalEtfsFonds");
const keinerEtf = keiner("halalEtfsFonds");

const ZAHLWORT: Record<number, string> = { 2: "zwei", 3: "drei", 4: "vier", 5: "fünf" };
const reihe = (teile: string[]) => (teile.length > 1 ? `${teile.slice(0, -1).join(", ")} und ${teile[teile.length - 1]}` : (teile[0] ?? ""));

/** Kosten ohne Kleingedrucktes (Tor S-KLEINGEDRUCKT): „ab 250€: 0€“ wird „von 250 € an kostenlos“. */
const sauber = (s: string) =>
  s
    .replace(/\bab ([\d.]+) ?€: ?0 ?€/g, "von $1 € an kostenlos")
    .replace(/\bab ([\d.]+) ?€/g, "von $1 € an");
const order = (a: RohAnbieter) => sauber(kostenKurz(a.id, "orderkosten") ?? String(a.werte.orderkosten ?? "")).replace(/(\d)€/g, "$1 €");
/** Ordergebühr als „0,99 €“, die erste Zahl der Kostenangabe. */
const orderEuro = (a: RohAnbieter) => `${order(a).match(/\d+(?:,\d+)?/)?.[0] ?? ""} €`;
const zahl = (n: { x: number; y: number }) => `${n.x} von ${n.y}`;
const sparrateBis = (a: RohAnbieter) => /bis ([\d.]+)\s?€/.exec(String(a.werte.sparrate ?? ""))?.[1] ?? "";
const sparrateAb = (a: RohAnbieter) => /^([\d.,]+)\s?€/.exec(String(a.werte.sparrate ?? ""))?.[1] ?? "";

const RHYTHMUS: Record<string, string> = {
  Woche: "jede Woche",
  Zweiwöchentlich: "alle 2 Wochen",
  Monat: "jeden Monat",
  Zweimonatlich: "alle 2 Monate",
  Quartal: "jedes Quartal",
  Halbjahr: "jedes Halbjahr",
  Jahr: "jedes Jahr",
};
const rhythmus = (a: RohAnbieter) =>
  String(a.werte.intervalle ?? "")
    .split(", ")
    .map((w) => RHYTHMUS[w] ?? w)
    .join(", ");
const wochenSparplan = (a: RohAnbieter) => String(a.werte.intervalle ?? "").split(", ").includes("Woche");
const nurDeutscheBoersen = (a: RohAnbieter) => a.werte.handelsplaetze === "DE";

/** Der Gewinner steht im ersten Satz nur, wenn die Daten ihn tragen (Test scalableVsTradeRepublic.test.ts). */
export const scalableVorn = scE.x > trE.x && scS.x >= trS.x;

/** Das Depot mit den meisten Halal-ETFs und Fonds unter den fünf vorn im Vergleich: die dritte Wahl für alle, denen beide nicht reichen. */
const mehr = depotVorn
  .map((a) => ({ a, n: anzahl(a, "halalEtfsFonds") }))
  .filter((x): x is { a: RohAnbieter; n: NonNullable<typeof x.n> } => !!x.n && x.n.x > Math.max(scE.x, trE.x))
  .sort((p, q) => q.n.x - p.n.x)[0];

const BILD_SC = DEPOT_APP_BILDER.scalable.find((b) => b.src.endsWith("scalable-1.webp"))!;

const zinsSc = zinsHinweis("depot", sc) ?? "";
const zinsTr = zinsHinweis("depot", tr) ?? "";
/** Dieselben Sätze mit Namen davor, damit sie im Fließtext und in der FAQ allein verständlich sind. */
const zinsScName = zinsSc.replace(/^Dein Guthaben (.*) hat 0 % Zinsen/, "Bei Scalable Capital hat dein Guthaben $1 0 % Zinsen");
const zinsTrName = zinsTr.replace(/^Zinsen laufen/, "Bei Trade Republic laufen Zinsen");

/* Titel, Meta, Adresse: Hauptwort „scalable capital vs trade republic“ (Ahrefs 26.11.2026: 1.500 Suchen). */
export const TITEL = "Scalable Capital vs Trade Republic 2026 für Muslime";
export const META = `Scalable Capital oder Trade Republic? Für Muslime liegt Scalable vorn: ${scE.x} von ${scE.y} Halal-ETFs, alle ${scS.y} Sukuk. Zahlen, Kosten und Zinsen im Vergleich 2026.`;

type Abschnitt = { id: string; titel: string; leiste?: boolean; kurz?: string };
const ABSCHNITTE: Abschnitt[] = [
  { id: "kurzer-vergleich", titel: "Scalable Capital und Trade Republic auf einen Blick", leiste: true, kurz: "Auf einen Blick" },
  { id: "das-wichtigste", titel: "Das Wichtigste", leiste: true },
  { id: "vergleich", titel: "Scalable Capital vs Trade Republic im Vergleich", leiste: true, kurz: "Im Vergleich" },
  { id: "scalable", titel: "Scalable Capital: am besten für viele Halal-ETFs und Sukuk", leiste: true, kurz: "Scalable Capital" },
  { id: "trade-republic", titel: "Trade Republic: am besten für Sparpläne jede Woche", leiste: true, kurz: "Trade Republic" },
  { id: "oder", titel: "Scalable Capital oder Trade Republic: was passt zu dir?", leiste: true, kurz: "Was passt zu dir?" },
  { id: "muslim", titel: "Was ein Muslim bei beiden beachten muss", leiste: true },
  { id: "fazit", titel: "Fazit: Scalable Capital oder Trade Republic für Muslime?", leiste: true, kurz: "Fazit" },
  { id: "haeufige-fragen", titel: "Häufige Fragen", leiste: true },
];
const titelVon = (id: string) => ABSCHNITTE.find((a) => a.id === id)!.titel;
const LEISTE = ABSCHNITTE.filter((a) => a.leiste);
const Ueber = ({ id }: { id: string }) => <H2 id={id}>{titelVon(id)}</H2>;

/**
 * Hauptaufruf „Finde dein Match“ (Elias SEO83-03: „ich würde immer das Match nehmen als Call to Action“), blau und rund wie auf der
 * TR-Seite (Elias SEO84-03). Ziel ist der Check mit der Depot-Art.
 */
const MATCH_ZIEL = "/check?art=depot";
const MatchKnopf = ({ stelle, className = "" }: { stelle: string; className?: string }) => (
  <Link
    to={MATCH_ZIEL}
    onClick={() => ereignis("freebie_check_klick", { check: true, quelle: "blog", im: "blog", seite: PFAD, stelle })}
    className={`group inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-[16px] font-bold text-primary-foreground transition-colors hover:bg-primary-hover ${className}`}
  >
    Finde dein Match
    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none" aria-hidden />
  </Link>
);

const Logo = ({ a }: { a: RohAnbieter }) => <AnbieterLogo name={a.name} domain={a.domain} gross />;

/** Kasten in der Mitte: Scalable Capital zuerst (einziger der beiden mit Partnerlink), dazu die zwei ersten Depots vorn im Vergleich mit Partnerlink. */
const KASTEN = [sc, ...depotVorn.filter((a) => a.link && a.id !== sc.id).slice(0, 2)].map((a) => {
  const e = anzahl(a, "halalEtfsFonds");
  const s = anzahl(a, "halalSukuk");
  return {
    name: a.name,
    domain: a.domain,
    out: a.link!,
    zeilen: [`Halal-ETFs und Fonds: ${e ? zahl(e) : "–"}`, `Sukuk: ${s ? zahl(s) : "–"}`, `Order: ${orderEuro(a)}`],
  };
});

const WICHTIGSTES: { lead: string; text: ReactNode }[] = [
  {
    lead: "Scalable Capital führt bei den Halal-ETFs.",
    text: `Dort kaufst du ${scE.text}, bei Trade Republic ${trE.x}. Nur bei Scalable Capital gibt es ${reihe(nurScalableEtf)}.`,
  },
  { lead: "Bei Sukuk ist der Abstand größer.", text: `Bei Scalable Capital kaufst du ${scS.text}, bei Trade Republic ${trS.x}. Sukuk sind islamische Anleihen.` },
  {
    lead: "Gold und Silber sind gleich.",
    text: `Bei beiden kaufst du ${scG.text}. ETCs sind Wertpapiere auf Gold oder Silber, die du wie ETFs kaufst.`,
  },
  {
    lead: "Die Kosten sind fast gleich.",
    text: `Depot und ETF-Sparplan kosten bei beiden 0 €. Eine Order kostet bei Scalable Capital ${orderEuro(sc)}, bei Trade Republic ${orderEuro(tr)}.`,
  },
  {
    lead: "Zinsen lässt du bei beiden aus.",
    text: `${zinsScName} ${zinsTrName}`,
  },
];

const PASST_SC = `du die größere Auswahl an Halal-ETFs und alle ${scS.y} Sukuk willst und jeden Monat sparst.`;
const PASST_TR = "du jede Woche sparen willst oder neben ETFs einzelne Aktien aus Europa und den USA kaufst.";

const FRAGEN: { frage: string; antwort: string }[] = [
  {
    frage: "Scalable Capital oder Trade Republic: Was ist besser für Muslime?",
    antwort: `Scalable Capital liegt in unserem Vergleich vorn: Dort kaufst du ${scE.text} und ${scS.text}, bei Trade Republic ${trE.x} und ${trS.x}. Trade Republic passt, wenn du es schon hast oder jede Woche sparen willst. Zinsen lässt du bei beiden aus.`,
  },
  {
    frage: "Scalable vs Trade Republic: Wer ist günstiger?",
    antwort: `Fast gleich. Das Depot und der ETF-Sparplan kosten bei beiden 0 €, der Sparplan startet bei beiden mit ${sparrateAb(sc)} €. Eine einzelne Order kostet bei Scalable Capital ${orderEuro(sc)} und bei Trade Republic ${orderEuro(tr)}. ETFs von iShares, Amundi, Vanguard und Xtrackers kaufst du bei Scalable Capital von 250 € an ohne Ordergebühr.`,
  },
  {
    frage: "Scalable Capital vs Trade Republic Zinsen: Wer zahlt Zinsen auf mein Guthaben?",
    antwort: `Zinsen sind Riba, und Riba ist im Islam verboten. ${zinsScName} ${zinsTrName}`,
  },
  {
    frage: "Scalable Capital Tagesgeld Zinsen aktivieren?",
    antwort:
      "Nein. Zinsen sind Riba, und Riba ist im Islam verboten. Das Tagesgeld ist bei Scalable Capital ein eigenes Konto, das du selbst einrichtest und befüllst: Aktiviere es nicht. Dein Guthaben auf dem Verrechnungskonto hat 0 % Zinsen.",
  },
  {
    frage: "Scalable oder Trade Republic für Anfänger?",
    antwort: `Beide starten den ETF-Sparplan mit ${sparrateAb(sc)} €. Für den Einstieg zählt, was du kaufen willst: Willst du viele Halal-ETFs, nimm Scalable Capital. Willst du jede Woche automatisch sparen, nimm Trade Republic.`,
  },
  {
    frage: "Scalable Capital oder Trade Republic für ETF-Sparplan?",
    antwort: `Bei Scalable Capital sparst du ${rhythmus(sc)}, bei Trade Republic ${rhythmus(tr)}. Die Sparrate liegt bei Scalable Capital zwischen ${sparrateAb(sc)} € und ${sparrateBis(sc)} €, bei Trade Republic zwischen ${sparrateAb(tr)} € und ${sparrateBis(tr)} €. Beide führen den Sparplan ohne Gebühr.`,
  },
  {
    frage: "Kann ich von Trade Republic zu Scalable Capital wechseln?",
    antwort:
      "Ja. Du eröffnest das Depot bei Scalable Capital und beantragst dort den Depotübertrag. Trade Republic darf für den Übertrag kein Entgelt verlangen, nur fremde Spesen. Oder du behältst beide: Trade Republic für das, was du dort schon hast, Scalable Capital für die fehlenden Halal-ETFs.",
  },
];

const PASST_DAZU: { to: string; name: string; text: string }[] = [
  { to: "/blog/trade-republic-alternative", name: ANKER_BEITRAG["/blog/trade-republic-alternative"], text: "Fünf Depots mit mehr Halal-ETFs als Trade Republic." },
  { to: "/blog/halal-etf", name: "Beste Halal ETFs 2026", text: "Welche Halal ETFs es gibt und was sie kosten." },
  { to: "/blog/girokonto-ohne-zinsen", name: "Girokonto ohne Zinsen", text: "Stell dein Konto in zehn Minuten um." },
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
        image: `${SITE}/og/blog--scalable-capital-vs-trade-republic.jpg`,
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#fragen`,
        mainEntity: FRAGEN.map((f) => ({ "@type": "Question", name: f.frage, acceptedAnswer: { "@type": "Answer", text: f.antwort } })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Start", item: SITE },
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
/* Bausteine dieser Seite                                              */
/* ------------------------------------------------------------------ */

const Haken = ({ children }: { children: ReactNode }) => (
  <li className="flex gap-2">
    <Check className="mt-0.5 h-4 w-4 shrink-0 text-gain" aria-hidden />
    {children}
  </li>
);

const Kreuz = ({ children }: { children: ReactNode }) => (
  <li className="flex gap-2">
    <X className="mt-0.5 h-4 w-4 shrink-0 text-loss" aria-hidden />
    {children}
  </li>
);

const ScalableKnopf = () => (
  <a
    href={sc.link}
    rel="sponsored nofollow"
    className="mt-5 inline-flex min-h-[48px] items-center justify-center bg-primary px-5 py-3 text-[16px] font-semibold text-primary-foreground hover:bg-primary/90"
  >
    {sc.name} eröffnen*
  </a>
);

/* ------------------------------------------------------------------ */
/* Seite                                                               */
/* ------------------------------------------------------------------ */

const ScalableVsTradeRepublic = () => {
  const [offen, setOffen] = useState(false);
  const ids = useMemo(() => LEISTE.map((a) => a.id), []);
  const aktiv = useAktiv(ids);
  const kreuzSc = nachteil(sc);
  const kreuzTr = nachteil(tr);

  const inhalt = (
    <ol>
      {LEISTE.map((a) => (
        <li key={a.id}>
          <a
            href={`#${a.id}`}
            aria-current={aktiv === a.id ? "location" : undefined}
            className={`block border-l-2 py-[7px] pl-3 text-[15px] leading-snug transition-colors hover:text-primary ${
              aktiv === a.id ? "border-primary font-semibold text-primary" : "border-border text-foreground/70"
            }`}
          >
            {a.kurz ?? a.titel}
          </a>
        </li>
      ))}
    </ol>
  );

  const zeilenVergleich = [
    { schluessel: "etf", name: "Halal-ETFs und Fonds", zellen: [zahl(scE), zahl(trE)] },
    { schluessel: "sukuk", name: "Sukuk", zellen: [zahl(scS), zahl(trS)] },
    { schluessel: "etc", name: "Gold- und Silber-ETCs", zellen: [zahl(scG), zahl(trG)] },
    { schluessel: "order", name: "Order", zellen: [order(sc), order(tr)] },
    { schluessel: "sparplan", name: "ETF-Sparplan", zellen: [`von ${sparrateAb(sc)} € an, kostenlos`, `von ${sparrateAb(tr)} € an, kostenlos`] },
    { schluessel: "rhythmus", name: "Sparplan läuft", zellen: [rhythmus(sc), rhythmus(tr)] },
    {
      schluessel: "boersen",
      name: "Handelsplätze",
      zellen: [nurDeutscheBoersen(sc) ? "nur Deutschland" : "Deutschland und mehr", nurDeutscheBoersen(tr) ? "nur Deutschland" : "Deutschland, Europa, USA und weitere"],
    },
    {
      schluessel: "zinsen",
      name: "Zinsen aufs Guthaben",
      zellen: ["0 % auf dem Verrechnungskonto, das Tagesgeld ist ein eigenes Konto", "laufen nur, wenn du sie in der App aktivierst"],
    },
  ];

  return (
    <main className="bg-background">
      <Seo title={TITEL} description={META} path={PFAD} jsonLd={graph()} />
      <div className="container py-8 md:py-12">
        <div className="mx-auto max-w-[720px] xl:grid xl:max-w-[1048px] xl:grid-cols-[280px_minmax(0,720px)] xl:gap-12">
          <Seitenleiste
            inhalt={inhalt}
            etikett="Dein Match"
            titel="Welches Depot passt zu dir?"
            ziel={MATCH_ZIEL}
            knopf="Finde dein Match"
            knopfKnoten={<MatchKnopf stelle="leiste" className="mt-4 w-full" />}
          />

          <div className="min-w-0">
            <nav aria-label="Brotkrumen" className="flex flex-wrap items-center gap-2 font-mono text-[12px] uppercase tracking-[0.12em] text-muted-foreground">
              <Link to="/blog" className="text-primary hover:underline">
                Blog
              </Link>
              <span aria-hidden>/</span>
              <span>Scalable Capital vs Trade Republic</span>
            </nav>

            <article className="mt-8">
              <h1 className="font-titel mt-3 text-[32px] leading-[1.07] tracking-[-0.03em] text-foreground [text-wrap:balance] md:text-[42px]">{TITEL}</h1>
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

              <div className="mt-8">
                <KartenReihe etikett="Kurzer Vergleich" titel={titelVon("kurzer-vergleich")} anzahl={2}>
                  {[
                    { a: sc, fuer: "viele Halal-ETFs und Sukuk", e: scE, s: scS, zins: zinsSc },
                    { a: tr, fuer: "Sparpläne jede Woche", e: trE, s: trS, zins: zinsTr },
                  ].map((k, i) => (
                    <Karte key={k.a.id} nummer={i + 1} kopf={k.a.name} erste={i === 0} marke={<Logo a={k.a} />}>
                      <Etikett className="mt-1">Am besten für</Etikett>
                      <p className="mt-1 text-[15px] font-semibold leading-snug text-foreground">{k.fuer}</p>
                      <Etikett className="mt-3">Halal-ETFs und Fonds</Etikett>
                      <p className="font-titel mt-1.5 text-[26px] leading-none text-foreground">{zahl(k.e)}</p>
                      <Etikett className="mt-4">Sukuk</Etikett>
                      <p className="mt-1 text-[15px] leading-snug text-foreground">{zahl(k.s)}</p>
                      <Etikett className="mt-3">Order</Etikett>
                      <p className="mt-1 text-[15px] leading-snug text-foreground">{orderEuro(k.a)}</p>
                      <Etikett className="mt-3">Was du tust</Etikett>
                      <p className="mt-1 text-[15px] font-semibold leading-snug text-foreground">{k.zins}</p>
                      <a
                        href={`#${i === 0 ? "scalable" : "trade-republic"}`}
                        className="mb-4 mt-5 flex min-h-[44px] items-center justify-center gap-1.5 border border-border bg-muted/60 py-2.5 font-mono text-[12px] uppercase tracking-[0.12em] text-foreground transition-colors hover:border-foreground sm:mt-auto"
                      >
                        Zum Eintrag
                        <ArrowDown className="h-3.5 w-3.5" aria-hidden />
                      </a>
                    </Karte>
                  ))}
                </KartenReihe>
              </div>

              <nav aria-label="Auf dieser Seite" className="mt-10 border-y border-border xl:hidden">
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

              {/* Einstieg: der Gewinner im ersten Satz (Seiten-Prüfer SEO85), danach die Szene. */}
              <div className="mt-8">
                <Text>
                  <p>
                    Scalable Capital oder Trade Republic? Für Muslime liegt Scalable Capital vorn: Dort kaufst du {scE.text} und {scS.text} aus unserem
                    Vergleich. Bei Trade Republic sind es {trE.x} und {trS.x}.
                  </p>
                  <p>
                    Du hast beide Apps im Blick und willst deinen ersten Halal-ETF-Sparplan starten. Beide führen das Depot ohne Gebühr, beide starten den
                    Sparplan mit {sparrateAb(sc)} €. Den Unterschied macht die Auswahl.
                  </p>
                  <p>Trade Republic passt besser, wenn du jede Woche sparen willst. Zinsen auf dein Guthaben lässt du bei beiden aus.</p>
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
                  <Ueber id="vergleich" />
                  <Text>
                    <p>
                      Die Tabelle zeigt, was du bei Scalable Capital und Trade Republic kaufst und zahlst. Gezählt sind die Halal-ETFs und Fonds und die
                      Sukuk, die du dort kaufst.
                    </p>
                  </Text>
                  <Tabelle
                    kopf={[{ titel: "Kriterium" }, { titel: "Scalable Capital", text: true }, { titel: "Trade Republic", text: true }]}
                    zeilen={zeilenVergleich}
                    umbrechen
                  />
                  <H3>Trade Republic vs Scalable Capital: Kosten, Gebühren und Sparplan</H3>
                  <Text>
                    <p>
                      Das Depot kostet bei beiden nichts, und der ETF-Sparplan startet bei beiden mit {sparrateAb(sc)} €. Die Sparrate liegt bei Scalable Capital zwischen
                      1 € und {sparrateBis(sc)} €, bei Trade Republic zwischen 1 € und {sparrateBis(tr)} €.
                    </p>
                    <p>
                      {wochenSparplan(tr) && !wochenSparplan(sc)
                        ? "Trade Republic spart auch jede Woche, bei Scalable Capital ist der kürzeste Rhythmus jeden Monat."
                        : "Beide sparen im selben Rhythmus."}{" "}
                      Eine einzelne Order kostet bei Scalable Capital {orderEuro(sc)}, bei Trade Republic {orderEuro(tr)}. ETFs von iShares, Amundi, Vanguard
                      und Xtrackers kaufst du bei Scalable Capital von 250 € an ohne Ordergebühr.
                    </p>
                  </Text>
                </section>

                <GoogleKasten />

                {/* Erster Anbieter-Kasten nach der Tabelle, zwischen einem Viertel und einem Drittel (Elias SEO67). Scalable Capital zuerst,
                    weil nur Scalable von den beiden einen Partnerlink hat; die zwei anderen sind die ersten mit Link im Depot-Vergleich. */}
                <AnbieterKasten titel="Scalable Capital und zwei Depots mit mehr Halal-ETFs" anbieter={KASTEN} />

                <section className="mt-14">
                  <Ueber id="scalable" />
                  <Logo a={sc} />
                  <Text>
                    <p>
                      Bei Scalable Capital kaufst du {scE.text} und {scS.text} aus unserem Vergleich. Bei Trade Republic sind es {trE.x} und {trS.x}.
                    </p>
                  </Text>
                  <ul className="mt-4 max-w-[664px] space-y-2 text-[16px] leading-snug text-foreground">
                    <Haken>
                      {nurScalableEtf.length} Halal-ETFs und Fonds mehr als bei Trade Republic: {reihe(nurScalableEtf)}
                    </Haken>
                    <Haken>Alle {scS.y} Sukuk: {reihe([...nurScalableSukuk, ...beide("halalSukuk")])}</Haken>
                    <Haken>Depot und ETF-Sparplan kostenlos, Sparplan von {sparrateAb(sc)} € an</Haken>
                    <Haken>ETFs von iShares, Amundi, Vanguard und Xtrackers von 250 € an ohne Ordergebühr</Haken>
                    <Haken>Ohne Zinsen nutzbar: Das Tagesgeld aktivierst du nicht</Haken>
                    {kreuzSc && <Kreuz>{kreuzSc.text}</Kreuz>}
                  </ul>
                  {/* Elias' eigenes Bild aus der Scalable-App (SEO79, ~/Downloads/apps IMG_4201): zeigt, dass der iShares USD Sukuk dort mit Kaufen und Sparplan steht. */}
                  <figure className="mt-6 max-w-[280px]">
                    <img src={BILD_SC.src} alt={BILD_SC.alt} width={600} height={1200} loading="lazy" className="w-full border border-border" />
                    <figcaption className="mt-2 text-[15px] text-foreground/80">Mein Bild aus der App von Scalable Capital: {BILD_SC.text}</figcaption>
                  </figure>
                  <Text>
                    <p>
                      <strong className="font-semibold text-foreground">Passt zu dir, wenn</strong> {PASST_SC}
                    </p>
                  </Text>
                  <ScalableKnopf />
                </section>

                <section className="mt-14">
                  <Ueber id="trade-republic" />
                  <Logo a={tr} />
                  <Text>
                    <p>
                      Bei Trade Republic kaufst du {trE.text} und {trS.text}, dazu {trG.text}. Dafür sparst du jede Woche und kaufst auch einzelne Aktien: Im
                      Handelsangebot stehen Aktien aus Deutschland, Europa und den USA.
                    </p>
                  </Text>
                  <ul className="mt-4 max-w-[664px] space-y-2 text-[16px] leading-snug text-foreground">
                    <Haken>Sparplan jede Woche, alle 2 Wochen, jeden Monat oder jedes Quartal</Haken>
                    <Haken>Order {orderEuro(tr)}, Depot und ETF-Sparplan kostenlos</Haken>
                    <Haken>Handel in Deutschland, Europa, USA und an weiteren Plätzen</Haken>
                    <Haken>Ohne Zinsen nutzbar: Du lässt die Zinsen in der App aus</Haken>
                    {kreuzTr && <Kreuz>{kreuzTr.text}</Kreuz>}
                  </ul>
                  <Text>
                    <p>
                      <strong className="font-semibold text-foreground">Passt zu dir, wenn</strong> {PASST_TR}
                    </p>
                  </Text>
                  <Link
                    to="/vergleich/depot"
                    className="mt-5 inline-flex min-h-[48px] items-center justify-center border border-foreground px-5 py-3 text-[16px] font-semibold text-foreground hover:border-primary hover:text-primary"
                  >
                    {tr.name} im Vergleich
                  </Link>
                </section>

                <section className="mt-14">
                  <Ueber id="oder" />
                  <Tabelle
                    kopf={[{ titel: "Wenn du …" }, { titel: "Nimm", text: true }, { titel: "Achte auf", text: true }]}
                    zeilen={[
                      {
                        schluessel: "w1",
                        name: `viele Halal-ETFs und alle ${scS.y} Sukuk willst`,
                        zellen: [<Nimm key="n" a={sc} />, "Das Tagesgeld nicht aktivieren"],
                      },
                      {
                        schluessel: "w2",
                        name: "jede Woche sparen willst",
                        zellen: [<Nimm key="n" a={tr} />, "Die Zinsen in der App auslassen"],
                      },
                      {
                        schluessel: "w3",
                        name: "ETFs von iShares ohne Ordergebühr kaufen willst",
                        zellen: [<Nimm key="n" a={sc} />, "Das Tagesgeld nicht aktivieren"],
                      },
                      {
                        schluessel: "w4",
                        name: "neben ETFs einzelne Aktien aus Europa und den USA willst",
                        zellen: [<Nimm key="n" a={tr} />, "Die Zinsen in der App auslassen"],
                      },
                      {
                        schluessel: "w5",
                        name: "Trade Republic schon hast und mehr Halal-ETFs willst",
                        zellen: ["Scalable Capital als zweites Depot", "Das Tagesgeld nicht aktivieren"],
                      },
                    ]}
                    wischen
                    umbrechen
                  />
                  {mehr && (
                    <>
                      <H3>Und wenn dir beide nicht reichen?</H3>
                      <Text>
                        <p>
                          Fehlt dir bei beiden ein Halal-ETF, schau auf {mehr.a.name}: Dort kaufst du {mehr.n.text}. Fünf Depots mit mehr Halal-ETFs als Trade
                          Republic zeigt die Seite <TL to="/blog/trade-republic-alternative">{ANKER_BEITRAG["/blog/trade-republic-alternative"]}</TL>, alle{" "}
                          {depotAnzahl} Depots findest du unter <TL to="/vergleich/depot">{ANKER_VERGLEICH["/vergleich/depot"]}</TL>.
                        </p>
                      </Text>
                    </>
                  )}
                </section>

                <section className="mt-14">
                  <Ueber id="muslim" />
                  <Text>
                    <p>{DEPOT_HALAL_SATZ}</p>
                  </Text>
                  <H3>Scalable Capital vs Trade Republic Tagesgeld und Zinsen: das lässt du aus</H3>
                  <Text>
                    <p>Zinsen sind Riba, und Riba ist im Islam verboten. Darum zählt bei jedem Depot, was mit dem Geld passiert, das noch nicht angelegt ist.</p>
                    <p>
                      {zinsScName} Das Tagesgeld ist ein eigenes Konto, das du selbst
                      einrichtest und befüllst.
                    </p>
                    <p>
                      {zinsTrName} Sind sie bei dir an, öffnest du in der App den Tab „Cash“, tippst
                      auf die Kachel „Zinsen“, dann auf „Verwalten“ und „Deaktivieren“. Mehr dazu steht unter{" "}
                      <TL to="/blog/trade-republic-alternative">{ANKER_BEITRAG["/blog/trade-republic-alternative"]}</TL>.
                    </p>
                    <p>
                      Wie du dein erstes Depot Schritt für Schritt aufsetzt, steht auch in meinem <TL to="/guide">kostenlosen Halal Starter Guide</TL>.
                    </p>
                  </Text>
                  <H3>Scalable Capital Halal ETF und Trade Republic: welche gibt es?</H3>
                  <Text>
                    <p>
                      Beide führen {reihe(beideEtf)}. Nur bei Scalable Capital kommen {reihe(nurScalableEtf)} dazu.{" "}
                      {keinerEtf.length > 0 && keinerEtf.every((n) => n.startsWith("HSBC"))
                        ? `Die ${ZAHLWORT[keinerEtf.length] ?? keinerEtf.length} HSBC Islamic ETFs`
                        : reihe(keinerEtf)}{" "}
                      kaufst du bei keinem von beiden.
                    </p>
                  </Text>
                  <H3>Trade Republic Sukuk und Scalable Capital: wie viele gibt es?</H3>
                  <Text>
                    <p>
                      Bei den Sukuk führt Trade Republic nur {reihe(beide("halalSukuk"))}. Scalable Capital führt zusätzlich {reihe(nurScalableSukuk)}.
                    </p>
                  </Text>
                  <H3>Kosten: bei kleinen Beträgen fast nichts</H3>
                  <Text>
                    <p>
                      Wer jeden Monat per Sparplan spart, zahlt bei beiden 0 € Gebühr. Erst wenn du oft einzelne Orders machst, zählt der Unterschied von{" "}
                      {orderEuro(sc)} zu {orderEuro(tr)}.
                    </p>
                  </Text>
                </section>

                <section className="mt-14">
                  <Ueber id="fazit" />
                  <Text>
                    <p>
                      Für Muslime liegt Scalable Capital vorn, weil du dort mehr Halal-ETFs und alle {scS.y} Sukuk kaufst. Trade Republic passt, wenn du es
                      schon hast oder jede Woche sparen willst. Bei beiden lässt du die Zinsen auf dein Guthaben aus.
                    </p>
                  </Text>
                  <div className="mt-5 flex flex-wrap items-center gap-4">
                    <ScalableKnopfInline />
                    <MatchKnopf stelle="fazit" />
                  </div>
                </section>

                <aside aria-labelledby="mein-test" data-check-einstieg="blog" className="ce mt-12">
                  <h2 id="mein-test" className="ce-titel">
                    <span className="ce-titel-zahlen">{depotAnzahl} Depots.</span> Ich habe sie verglichen.
                  </h2>
                  <p className="ce-satz">
                    Geachtet habe ich darauf, ob du das Depot ohne Zinsen nutzen kannst, wie viele <strong>Halal-ETFs, Sukuk und Gold-ETCs</strong> du dort
                    kaufst und was es kostet. Daraus habe ich <strong>einen Test gebaut</strong>. Nach ein paar Fragen zeigt er dir das Depot, das zu dir passt.
                  </p>
                  <MatchBuehne art="depot" quelle="kopf" />
                  <Link
                    to={MATCH_ZIEL}
                    onClick={() => ereignis("freebie_check_klick", { check: true, quelle: "blog", im: "blog", seite: PFAD, stelle: "kasten" })}
                    className="ce-knopf"
                  >
                    Finde dein Match
                    <ArrowRight aria-hidden />
                  </Link>
                </aside>

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
                          <span className="mt-1 block text-[16px] leading-snug text-foreground">{p.text}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </aside>

                <footer className="mt-8">
                  <p className="text-[15px] leading-relaxed text-foreground/80">
                    * Werbung: Eröffnest du über meinen Link ein Depot, bekomme ich eine Provision, ohne Mehrkosten für dich.
                  </p>
                  <p className="mt-3 text-[15px] leading-relaxed text-foreground/80">{RECHTSHINWEIS}</p>
                </footer>
              </div>
            </article>
          </div>
        </div>
      </div>
    </main>
  );
};

/** Wohin „Nimm“ in der Tabelle führt: Partnerlink, sonst der Eintrag auf dieser Seite. */
function Nimm({ a }: { a: RohAnbieter }) {
  return a.link ? (
    <a href={a.link} rel="sponsored nofollow" className="font-semibold text-primary underline underline-offset-[3px] hover:text-primary/80">
      {a.name}*
    </a>
  ) : (
    <a href="#trade-republic" className="font-semibold text-primary underline underline-offset-[3px] hover:text-primary/80">
      {a.name}
    </a>
  );
}

/** Partnerknopf im Fazit ohne den oberen Abstand des Eintrags-Knopfes. */
function ScalableKnopfInline() {
  return (
    <a
      href={sc.link}
      rel="sponsored nofollow"
      className="inline-flex min-h-[48px] items-center justify-center bg-primary px-5 py-3 text-[16px] font-semibold text-primary-foreground hover:bg-primary/90"
    >
      {sc.name} eröffnen*
    </a>
  );
}

export default ScalableVsTradeRepublic;
