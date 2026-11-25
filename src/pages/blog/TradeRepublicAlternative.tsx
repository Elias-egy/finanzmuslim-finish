import { useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, Check, ChevronDown, X } from "lucide-react";
import Seo from "@/components/Seo";
import eliasPortrait from "@/assets/elias-autor.webp";
import {
  AnbieterKasten,
  AutorAufruf,
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
  Video,
  YOUTUBE,
} from "@/components/blog/bausteine";
import { ANKER_VERGLEICH } from "@/data/ankertexte";
import { kostenKurz } from "@/data/kostenKurz";
import { zinsHinweis } from "@/data/zinsHinweise";
import { DEPOT_APP_BILDER, EIGENE_APP_BILDER } from "@/data/depotAppBilder";
import type { RohAnbieter } from "@/data/vergleichHelfer";
import {
  anzahl,
  brokerText,
  depotAnzahl,
  depotOhneZinsen,
  depotVorn,
  nachteil,
  tradeRepublic,
  tradeRepublicText,
  vorteile,
} from "@/data/depotRatgeber";

/**
 * Kaufseite „trade republic alternative“ (SEO82, 25.11.2026) nach VORLAGEN.md Abschnitt 3 „Alternativen“ (Aufbau wie Vorlage 1),
 * Vorarbeit im Vault data/seo/blog/trade-republic-alternative.md, Karte
 * fundament/research/quellen/SEO-GUIDE-Z2aCQ5YKaTU/beitraege/trade-republic-alternative.seo.json.
 * Jede Zahl kommt aus denselben Daten wie der Depot-Vergleich (src/data/depotRatgeber.ts), nichts ist abgetippt: Ändert sich
 * die Rangfolge oder eine Zahl im Vergleich, zieht diese Seite mit. Trade Republic wird nicht schlechtgeredet
 * (memory/eigene-produkte-nie-schlechtreden.md): Es geht ohne Zinsen, der Haken ist die Auswahl.
 */

const PFAD = "/blog/trade-republic-alternative";
const TITEL = "Beste Trade Republic Alternative 2026 für Muslime";
const META =
  "Trade Republic geht ohne Zinsen, aber dort fehlt die Hälfte der Halal-ETFs. Die 5 besten Trade Republic Alternativen 2026 mit Halal-ETFs, Sukuk und Kosten.";
const VEROEFFENTLICHT = { text: "25.11.2026", iso: "2026-11-25T09:00:00+01:00" };
const AKTUALISIERT = { text: "25.11.2026", iso: "2026-11-25T09:00:00+01:00" };
/** Lesedauer in Minuten: Wörter im Beitrag (innerText von main article bei 390) durch 200, aufgerundet (1.805 Wörter am 25.11.2026). */
const LESEZEIT = 10;
const RECHTSHINWEIS =
  "Dieser Beitrag ist keine Fatwa und keine Anlageberatung. Die Reihenfolge ist die unseres Depot-Vergleichs. Investitionen in Wertpapiere sind mit Risiken verbunden, bis hin zum Totalverlust.";

/* Elias' Video vom 31.10.2026 (youtube.com/watch?v=DlFd-z4uGHc), eigenes Vorschaubild statt i.ytimg.com (Tor S-VIDEO-BILD). */
const VIDEO = {
  id: "DlFd-z4uGHc",
  titel: "Halal investieren 2026: Depot eröffnen Schritt für Schritt",
  hochgeladen: "2026-10-31T14:47:31-07:00",
  bild: "/bilder/blog/trade-republic-alternative/video-depot-eroeffnen.webp",
};

type Abschnitt = { id: string; titel: string; leiste?: boolean; kurz?: string };
const ABSCHNITTE: Abschnitt[] = [
  { id: "kurzer-vergleich", titel: "Trade Republic und 5 Alternativen auf einen Blick", leiste: true, kurz: "Auf einen Blick" },
  { id: "das-wichtigste", titel: "Das Wichtigste", leiste: true },
  { id: "vergleich", titel: "Wie viele Halal-ETFs gibt es bei Trade Republic und den Alternativen?", leiste: true, kurz: "Halal-ETFs im Vergleich" },
  { id: "ist-trade-republic-halal", titel: "Ist Trade Republic halal?", leiste: true },
  { id: "alternativen", titel: "Die besten Trade Republic Alternativen 2026", leiste: true, kurz: "Die 5 Alternativen" },
  { id: "besser", titel: "Was ist besser als Trade Republic?", leiste: true },
  { id: "haeufige-fragen", titel: "Häufige Fragen", leiste: true },
  { id: "naechster-schritt", titel: "Dein nächster Schritt: das Depot mit deinen Halal-ETFs" },
];
const titelVon = (id: string) => ABSCHNITTE.find((a) => a.id === id)!.titel;
const LEISTE = ABSCHNITTE.filter((a) => a.leiste);
const Ueber = ({ id }: { id: string }) => <H2 id={id}>{titelVon(id)}</H2>;

/* ------------------------------------------------------------------ */
/* Daten, alle aus dem Depot-Vergleich                                 */
/* ------------------------------------------------------------------ */

const tr = tradeRepublic as RohAnbieter;
const trText = tradeRepublicText();
const trEtf = anzahl(tr, "halalEtfsFonds");

/**
 * Kosten ohne Kleingedrucktes (Tor S-KLEINGEDRUCKT, Elias SEO63): „1€, ab 500€: 0€“ wird „1€, von 500 € an kostenlos“.
 * Der Betrag bleibt, nur die Form ändert sich.
 */
const sauber = (s: string) =>
  s
    .replace(/\bab ([\d.]+) ?€: ?0 ?€/g, "von $1 € an kostenlos")
    .replace(/\bab ([\d.]+) ?€/g, "von $1 € an");
const order = (a: RohAnbieter) => sauber(kostenKurz(a.id, "orderkosten") ?? String(a.werte.orderkosten ?? "–"));
const zahl = (a: RohAnbieter, k: "halalEtfsFonds" | "halalSukuk") => {
  const n = anzahl(a, k);
  return n ? `${n.x} von ${n.y}` : "–";
};
const anker = (a: RohAnbieter) => `broker-${a.id}`;
const ALLE = [tr, ...depotVorn];
const alleKostenlos = ALLE.every((a) => a.werte.depotgebuehr === "0€");
const mehrText = (trText?.mehr ?? []).map((m) => `${m.anbieter.name} ${m.zahl}`);
const alleOhneZinsen = depotVorn.every((a) => a.werte.zinsfreiAbStart === "gut");
const alleMehrSukuk = depotVorn.every((a) => (anzahl(a, "halalSukuk")?.x ?? 0) > (anzahl(tr, "halalSukuk")?.x ?? 0));
const reihe = (teile: string[]) => (teile.length > 1 ? `${teile.slice(0, -1).join(", ")} und ${teile[teile.length - 1]}` : teile[0] ?? "");

/** „Passt zu dir, wenn …“ je Depot. Fakten aus den Werten des Vergleichs; ohne Eintrag ein Satz aus der Zahl der Halal-ETFs. */
const PASST: Record<string, (a: RohAnbieter) => string> = {
  "flatex-depot": (a) => `du alle ${anzahl(a, "halalEtfsFonds")?.y ?? ""} Halal-ETFs und Fonds aus unserem Vergleich an einem Ort willst und dafür eine höhere Ordergebühr in Kauf nimmst.`,
  "smartbroker-plus-depot": () => "du Halal ETFs, Sukuk und Gold in einer App willst und das Zinskonto einfach nicht eröffnest.",
  "scalable-capital-free-broker": () => "du ETFs von großen Anbietern wie iShares ab einer größeren Summe ohne Ordergebühr kaufen willst.",
  "traders-place-depot": () => "du das Depot willst, das ich selbst nutze, mit einem Sparplan jede Woche, jeden Monat oder jedes Quartal.",
  "trading-212-depot": () => "du oft kaufst und für eine Order gar nichts zahlen willst.",
};
const passt = (a: RohAnbieter) => PASST[a.id]?.(a) ?? `du ${anzahl(a, "halalEtfsFonds")?.text ?? "Halal-ETFs"} kaufen willst.`;

/** Logos wie in /blog/halal-etf; ohne eigenes Logo lädt AnbieterKasten das runde Logo über die Domain. */
const LOGO: Record<string, string> = {
  "traders-place": "/bilder/blog/halal-etf/logos/traders-place-wortmarke.svg",
  smartbroker: "/bilder/blog/halal-etf/logos/smartbroker.webp",
  scalable: "/bilder/blog/halal-etf/logos/scalable.webp",
};
const DOMAIN: Record<string, string> = { flatex: "flatex.de", "trading-212": "trading212.com" };

/** Dreier-Kombi: die ersten drei des Depot-Vergleichs mit Partnerlink (VORLAGEN 0.2, Reihenfolge nie umsortieren). */
const DREIER = depotVorn
  .filter((a) => a.link)
  .slice(0, 3)
  .map((a) => ({
    name: a.name,
    logo: LOGO[a.haus ?? ""],
    domain: LOGO[a.haus ?? ""] ? undefined : DOMAIN[a.haus ?? ""],
    out: a.link!,
    zeilen: [`Halal-ETFs und Fonds: ${zahl(a, "halalEtfsFonds")}`, `Sukuk: ${zahl(a, "halalSukuk")}`, `Order: ${order(a)}`],
  }));

const WICHTIGSTES: { lead: string; text: ReactNode }[] = [
  { lead: "Trade Republic geht ohne Zinsen.", text: zinsHinweis("depot", tr) ?? "" },
  { lead: "Der Haken ist die Auswahl.", text: trEtf ? `Dort kaufst du ${trEtf.text} aus unserem Vergleich.` : "" },
  { lead: "Mehr Halal-ETFs gibt es woanders.", text: mehrText.length ? `${reihe(mehrText)}.` : "" },
  {
    lead: alleKostenlos ? "Das Depot kostet überall 0 €." : "Die Kosten sind klein.",
    text: alleKostenlos ? `Bei Trade Republic und allen ${depotVorn.length} Alternativen zahlst du keine Depotgebühr, nur die Order kostet unterschiedlich.` : "Die Order kostet je Depot unterschiedlich.",
  },
  { lead: "Wechseln kostet nichts.", text: "Innerhalb Deutschlands ziehen deine Anlagen kostenlos ins neue Depot um, du musst nichts verkaufen." },
];

const trKostenlos =
  tr.werte.depotgebuehr === "0€" && tr.werte.etfSparplanKosten === "0€"
    ? `Fast. Das Depot und der ETF-Sparplan kosten 0 €, eine einzelne Order ${order(tr)}.`
    : `Das Depot kostet ${tr.werte.depotgebuehr}, eine Order ${order(tr)}.`;

const mitNull = depotVorn.filter((a) => /0 % Zinsen/.test(zinsHinweis("depot", a) ?? "")).map((a) => a.name);
const ohneNull = depotVorn.filter((a) => !/0 % Zinsen/.test(zinsHinweis("depot", a) ?? "")).map((a) => a.name);

const FRAGEN: { frage: string; antwort: string }[] = [
  {
    frage: "Welche Alternative zu Trade Republic passt für Muslime?",
    antwort: `Jede App aus unserem Vergleich, die du ohne Zinsen nutzen kannst. Mehr Halal-ETFs und Fonds als Trade Republic führen ${reihe(mehrText)}.`,
  },
  { frage: "Ist Trade Republic kostenlos?", antwort: trKostenlos },
  {
    frage: "Sind Trade Republic Zinsen haram?",
    antwort: `Zinsen sind Riba, und Riba ist im Islam verboten. ${zinsHinweis("depot", tr) ?? ""}`.trim(),
  },
  {
    frage: "Zahlt eine Trade Republic Alternative Zinsen?",
    antwort: `Bei ${reihe(mitNull)} hat dein Guthaben 0 % Zinsen. Bei ${reihe(ohneNull)} lässt du die Zinsen aus, was du dafür tust, steht oben bei jedem Depot.`,
  },
  {
    frage: "Wo ist der Haken bei Trade Republic?",
    antwort: trEtf ? `Für dich ist es die Auswahl: Dort kaufst du ${trEtf.text} aus unserem Vergleich. Willst du die anderen, brauchst du ein zweites Depot.` : "Für dich ist es die Auswahl der Halal-ETFs.",
  },
  {
    frage: "Kann ich Trade Republic behalten und ein zweites Depot eröffnen?",
    antwort: "Ja. Du eröffnest das zweite Depot online und behältst bei Trade Republic, was du schon hast. Willst du alles an einem Ort, beantragst du beim neuen Broker einen Depotübertrag.",
  },
];

const PASST_DAZU: { to: string; name: string; text: string }[] = [
  { to: "/blog/halal-etf", name: "Beste Halal ETFs 2026", text: "Welche Halal ETFs es gibt und was sie kosten." },
  { to: "/blog/sind-aktien-haram", name: "Sind Aktien haram?", text: "Woran du eine Halal-Aktie erkennst." },
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
        image: `${SITE}/og/blog--trade-republic-alternative.jpg`,
        video: { "@id": `${url}#video` },
      },
      {
        "@type": "ItemList",
        "@id": `${url}#liste`,
        name: titelVon("alternativen"),
        numberOfItems: depotVorn.length,
        itemListOrder: "https://schema.org/ItemListOrderAscending",
        itemListElement: depotVorn.map((a, i) => ({ "@type": "ListItem", position: i + 1, name: a.name, url: `${url}#${anker(a)}` })),
      },
      {
        "@type": "VideoObject",
        "@id": `${url}#video`,
        name: VIDEO.titel,
        description: "Elias zeigt Schritt für Schritt, wie du als Muslim ein Depot eröffnest und deinen ersten Halal ETF kaufst.",
        thumbnailUrl: `${SITE}${VIDEO.bild}`,
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

const Eintrag = ({ a, platz }: { a: RohAnbieter; platz: number }) => {
  const kreuz = nachteil(a);
  const eigen = !!a.haus && EIGENE_APP_BILDER.has(a.haus);
  const bilder = eigen && a.haus ? DEPOT_APP_BILDER[a.haus] ?? [] : [];
  return (
    <section className="mt-10" aria-labelledby={anker(a)}>
      <H3>
        <span id={anker(a)} className="scroll-mt-24">
          {platz}. {a.name}
        </span>
      </H3>
      <Text>
        <p>{brokerText(a).map(sauber).join(" ")}</p>
      </Text>
      <ul className="mt-4 max-w-[664px] space-y-2 text-[16px] leading-snug text-foreground">
        {vorteile(a)
          .slice(0, 5)
          .map((p) => (
            <li key={p.text} className="flex gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-gain" aria-hidden />
              {sauber(p.text)}
            </li>
          ))}
        {kreuz && (
          <li className="flex gap-2">
            <X className="mt-0.5 h-4 w-4 shrink-0 text-loss" aria-hidden />
            {sauber(kreuz.text)}
          </li>
        )}
      </ul>
      {bilder.length > 0 && (
        <figure className="mt-6 max-w-[664px]">
          <div className="grid grid-cols-2 gap-3">
            {bilder.map((b) => (
              <img key={b.src} src={b.src} alt={b.alt} width={600} height={1200} loading="lazy" className="w-full border border-border" />
            ))}
          </div>
          <figcaption className="mt-2 text-[14px] text-foreground/75">Bilder aus meiner eigenen App von {a.name}.</figcaption>
        </figure>
      )}
      <Text>
        <p>
          <strong className="font-semibold text-foreground">Passt zu dir, wenn</strong> {passt(a)}
        </p>
      </Text>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Seite                                                               */
/* ------------------------------------------------------------------ */

const TradeRepublicAlternative = () => {
  const [offen, setOffen] = useState(false);
  const ids = useMemo(() => LEISTE.map((a) => a.id), []);
  const aktiv = useAktiv(ids);

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
      <Seo title={TITEL} description={META} path={PFAD} jsonLd={graph()} />
      <div className="container py-8 md:py-12">
        <div className="mx-auto max-w-[720px] xl:grid xl:max-w-[1048px] xl:grid-cols-[280px_minmax(0,720px)] xl:gap-12">
          <Seitenleiste
            inhalt={inhalt}
            etikett="Depot-Vergleich"
            titel="Mehr Halal-ETFs als bei Trade Republic?"
            text={`Im Vergleich siehst du alle ${depotAnzahl} Depots und wo du deine Halal-ETFs, Sukuk und Gold kaufst.`}
            ziel="/vergleich/depot"
            knopf="Zum Depot-Vergleich"
          />

          <div className="min-w-0">
            <nav aria-label="Brotkrumen" className="flex flex-wrap items-center gap-2 font-mono text-[12px] uppercase tracking-[0.12em] text-muted-foreground">
              <Link to="/blog" className="text-primary hover:underline">
                Blog
              </Link>
              <span aria-hidden>/</span>
              <span>Trade Republic Alternative</span>
            </nav>

            <article className="mt-8">
              {/* Kopf wie frontal.so/blog/best-gtm-agencies (Elias SEO63), gleich gebaut wie /blog/halal-kredit */}
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
                <KartenReihe etikett="Kurzer Vergleich" titel={titelVon("kurzer-vergleich")} anzahl={ALLE.length}>
                  {ALLE.map((a, i) => (
                    <Karte key={a.id} nummer={i + 1} kopf={a.name} erste={i === 0}>
                      <Etikett className="mt-1">Halal-ETFs und Fonds</Etikett>
                      <p className="font-titel mt-1.5 text-[26px] leading-none text-foreground">{zahl(a, "halalEtfsFonds")}</p>
                      <Etikett className="mt-4">Sukuk</Etikett>
                      <p className="mt-1 text-[15px] leading-snug text-foreground">{zahl(a, "halalSukuk")}</p>
                      <Etikett className="mt-3">Order</Etikett>
                      <p className="mt-1 text-[15px] leading-snug text-foreground">{order(a)}</p>
                      <Etikett className="mt-3">Was du tust</Etikett>
                      <p className="mt-1 text-[15px] font-semibold leading-snug text-foreground">{zinsHinweis("depot", a)}</p>
                      <a
                        href={i === 0 ? "#ist-trade-republic-halal" : `#${anker(a)}`}
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

              {/* Einstieg als kleine Szene wie frontal, die Antwort in den ersten 100 Wörtern */}
              <div className="mt-8">
                <Text>
                  <p>
                    Du hast Trade Republic auf dem Handy und willst einen Sparplan auf einen Halal ETF. Du suchst den HSBC MSCI World Islamic und
                    findest ihn nicht. Also googelst du: alternative Trade Republic.
                  </p>
                  <p>
                    Kurz gesagt: Trade Republic darfst du behalten, du lässt nur die Zinsen aus. Der Haken ist die Auswahl. Mehr Halal-ETFs und Fonds
                    gibt es bei {reihe((trText?.mehr ?? []).map((m) => m.anbieter.name))}.
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

                <section className="mt-14">
                  <Ueber id="vergleich" />
                  <Text>
                    <p>Trade Republic steht oben, darunter die fünf Depots vorn in unserem Vergleich. Gezählt sind die Halal-ETFs und Fonds und die Sukuk, die du dort kaufst.</p>
                  </Text>
                  <Tabelle
                    kopf={[{ titel: "Halal-ETFs", zusatz: "und Fonds", rechts: true }, { titel: "Sukuk", rechts: true }, { titel: "Order", text: true }]}
                    zeilen={ALLE.map((a) => ({
                      schluessel: a.id,
                      name: (
                        <a href={a.id === tr.id ? "#ist-trade-republic-halal" : `#${anker(a)}`} className="underline decoration-border underline-offset-[3px] hover:text-primary">
                          {a.name}
                        </a>
                      ),
                      zellen: [zahl(a, "halalEtfsFonds"), zahl(a, "halalSukuk"), order(a)],
                    }))}
                  />
                </section>

                <GoogleKasten />

                <section className="mt-14">
                  <Ueber id="ist-trade-republic-halal" />
                  <Text>
                    <p>Ob dein Depot halal ist, hängt davon ab, was du kaufst und ob dein Guthaben Zinsen bringt.</p>
                    {trText && <p>{trText.saetze.join(" ")}</p>}
                    <p>
                      Auch wer bei Trade Republic halal Aktien kaufen will, braucht dafür kein zweites Depot: Im Handelsangebot stehen Aktien aus Deutschland,
                      Europa und den USA.
                    </p>
                  </Text>
                  <H3>Trade Republic Zinsen deaktivieren: so geht es</H3>
                  <Text>
                    <p>
                      Öffne in der App den Tab „Cash“, tippe auf die Kachel „Zinsen“, dann auf „Verwalten“ und „Deaktivieren“. Wie viel Zinsen bei Trade
                      Republic gerade gezahlt werden, ist für dich egal: Du lässt sie aus.
                    </p>
                    <p>
                      Wie du dein erstes Depot Schritt für Schritt aufsetzt, steht auch in meinem <TL to="/guide">kostenlosen Halal Starter Guide</TL>.
                    </p>
                  </Text>
                </section>

                {/* Erster Anbieter-Kasten nach dem zweiten Inhaltsblock, zwischen einem Viertel und einem Drittel (Elias SEO67) */}
                <AnbieterKasten titel="Depots für Muslime mit mehr Halal-ETFs" anbieter={DREIER} />

                <section className="mt-14">
                  <Ueber id="alternativen" />
                  <Text>
                    <p>
                      Diese {depotVorn.length} Alternativen zu Trade Republic stehen in unserem Depot-Vergleich vorn.
                      {alleOhneZinsen && " Bei allen kannst du dein Guthaben ohne Zinsen lassen."}
                      {alleMehrSukuk && " Und bei allen kaufst du mehr Sukuk als bei Trade Republic."}
                    </p>
                    <p>Im Video zeige ich dir, wie du so ein Depot eröffnest und deinen ersten Halal ETF kaufst.</p>
                  </Text>
                  <Video id={VIDEO.id} titel={VIDEO.titel} bild={VIDEO.bild} />
                  {depotVorn.map((a, i) => (
                    <Eintrag key={a.id} a={a} platz={i + 1} />
                  ))}
                </section>

                <section className="mt-14">
                  <Ueber id="besser" />
                  <Text>
                    <p>
                      Besser ist das Depot, in dem du kaufen kannst, was du suchst. Die Trade Republic Konkurrenz ist bei den Kosten fast gleich, der
                      Unterschied liegt in der Auswahl. Wer viele Halal-ETFs will, nimmt {trText?.mehr[0]?.anbieter.name ?? "ein Depot vorn im Vergleich"}.
                    </p>
                    <p>
                      Jede Trade Republic Alternative Deutschlands aus unserem Vergleich eröffnest du online, mit Ausweis und ohne Termin.
                    </p>
                  </Text>
                  <H3>Apps wie Trade Republic</H3>
                  <Text>
                    <p>
                      Trading 212 und Scalable Capital sind Apps wie Trade Republic: ein Depot am Handy, Sparplan schon mit 1 €. Traders Place, flatex und
                      Smartbroker+ haben auch eine App, dazu die Seite am Laptop.
                    </p>
                  </Text>
                  <H3>So wechselst du von Trade Republic</H3>
                  <Text>
                    <p>
                      Du musst nichts verkaufen. Eröffne das neue Depot und beantrage dort den Depotübertrag. Innerhalb Deutschlands ziehen deine Anlagen
                      kostenlos um. Oder du behältst Trade Republic und kaufst die fehlenden Halal-ETFs im zweiten Depot.
                    </p>
                  </Text>
                </section>

                <AutorAufruf
                  bild={eliasPortrait}
                  etikett="Mein Tipp"
                  titel="Das Depot, das zu deinen Halal-ETFs passt"
                  text={`Im Vergleich siehst du für alle ${depotAnzahl} Depots, welche Halal-ETFs, Sukuk und Gold-ETCs du dort kaufst und was du für 0 % Zinsen tust. ${depotOhneZinsen} davon kannst du ohne Zinsen nutzen.`}
                  ziel="/vergleich/depot"
                  knopf="Zum Depot-Vergleich"
                />

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
                      Du weißt jetzt, was Trade Republic kann und wo es fehlt. Willst du mehr Halal-ETFs, Sukuk und Gold in einem Depot, schau dir die
                      Depots an, die das haben. Alle {depotAnzahl} mit Kosten und dem, was du für 0 % Zinsen tust, findest du unter{" "}
                      <TL to="/vergleich/depot">{ANKER_VERGLEICH["/vergleich/depot"]}</TL>.
                    </p>
                  </Text>
                </section>

                <AnbieterKasten titel="Depots für Muslime mit mehr Halal-ETFs" anbieter={DREIER} />

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

export default TradeRepublicAlternative;
