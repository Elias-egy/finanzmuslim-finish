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
import { DEPOTS_GETESTET } from "@/data/halalFinanzCheckKern";
import { kostenKurz } from "@/data/kostenKurz";
import { kreditKurz, zinsHinweis } from "@/data/zinsHinweise";
import { DEPOT_APP_BILDER, type AppBild } from "@/data/depotAppBilder";
import type { RohAnbieter } from "@/data/vergleichHelfer";
import {
  anzahl,
  brokerText,
  DEPOT_HALAL_SATZ,
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
 *
 * SEO84 (25.11.2026, Elias SEO83-02 und SEO83-03, Vault raw/2026-11-25-elias-seo83-0{2,3}-*.md): Release-Stand der Rangfolge
 * (S Broker, Smartbroker+, flatex vorn, src/lib/rangfolge.ts DEPOT_SPITZE). Video raus („lieber kein Video“), App-Store-Werbebilder raus,
 * jeder Anbieter mit Logo aus den Vergleichen, Hauptaufruf „Finde dein Match“ zum Check, in der Mitte die drei besten, zweimal
 * Elias' Satz „Ich habe … Depots verglichen“ mit den Kriterien der Rangfolge. „Depot-Vergleich“ ist nur Ankertext zur Money Page.
 */

const PFAD = "/blog/trade-republic-alternative";
const TITEL = "Beste Trade Republic Alternative 2026 für Muslime";
const META =
  "Trade Republic geht ohne Zinsen, aber dort fehlt die Hälfte der Halal-ETFs. Die 5 besten Trade Republic Alternativen 2026 mit Halal-ETFs, Sukuk und Kosten.";
const VEROEFFENTLICHT = { text: "25.11.2026", iso: "2026-11-25T09:00:00+01:00" };
const AKTUALISIERT = { text: "25.11.2026", iso: "2026-11-25T09:00:00+01:00" };
/** Lesedauer in Minuten: Wörter im Beitrag (innerText von main article bei 390) durch 200, aufgerundet (2.181 Wörter nach den Prüfer-Funden SEO84). */
const LESEZEIT = 11;
const RECHTSHINWEIS =
  "Dieser Beitrag ist keine Fatwa und keine Anlageberatung. Die Reihenfolge ist die unseres Depot-Vergleichs. Investitionen in Wertpapiere sind mit Risiken verbunden, bis hin zum Totalverlust.";

/*
 * Kein Video (Elias SEO83-03, 25.11.2026: „das Video macht keinen Sinn, wenn Scalable unsere Nummer 5 oder 6 oder so ist, dann erstmal
 * lieber kein Video einblenden und dann warten“). Das Video vom 31.10. zeigte Scalable; ein neues kommt mit YouTube.
 */

/**
 * Hauptaufruf „Finde dein Match“ (Elias SEO83-03: „ich würde immer das Match nehmen als Call to Action … nur natürlich nicht so mit blau
 * und leuchtend“). Ziel wie der Kopfknopf (SiteHeader KOPF_STANDARD, /check) mit der Depot-Art, damit der Check gleich beim Depot startet.
 * SEO85 (Elias SEO84-03: „Dieser schwarze Balken ist richtig schlecht. Ich würde den wirklich als blauen machen“; „so wie du es sonst
 * machst mit dem blauen Knopf“): blau und rund wie der Aufruf der Freebies; die einzige Bewegung ist der Pfeil beim Zeigen.
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
/** Prüfer-MUSS 3: Ordergebühr als Zahl für den Kostensatz unter „Was ist besser“ (erste Zahl in order(), „0€“ wird 0). */
const orderZahl = (a: RohAnbieter) => Number((order(a).match(/\d+(?:,\d+)?/)?.[0] ?? "NaN").replace(",", "."));
const nachOrder = depotVorn.filter((a) => Number.isFinite(orderZahl(a))).sort((a, b) => orderZahl(a) - orderZahl(b));
const kostenSatz = (() => {
  const billig = nachOrder[0];
  const teuer = nachOrder[nachOrder.length - 1];
  const order3 = billig && teuer && billig.id !== teuer.id ? `, bei ${billig.name} ${order(billig)} und bei ${teuer.name} ${order(teuer)}` : "";
  return `${alleKostenlos ? "Bei der Trade Republic Konkurrenz kostet das Depot überall 0 €. " : ""}Eine Order kostet bei Trade Republic ${order(tr)}${order3}.`;
})();
const alleOhneZinsen = depotVorn.every((a) => a.werte.zinsfreiAbStart === "gut");
const alleMehrSukuk = depotVorn.every((a) => (anzahl(a, "halalSukuk")?.x ?? 0) > (anzahl(tr, "halalSukuk")?.x ?? 0));
const reihe = (teile: string[]) => (teile.length > 1 ? `${teile.slice(0, -1).join(", ")} und ${teile[teile.length - 1]}` : teile[0] ?? "");

/** Ein Satz je Depot gegen Trade Republic: Halal-ETFs und Fonds, Sukuk, Order (SEO85, statt des Absatzes aus dem Depot-Ratgeber). */
const gegenTr = (a: RohAnbieter) => {
  const teile: string[] = [];
  const e = anzahl(a, "halalEtfsFonds");
  if (e && trEtf) teile.push(`Bei ${a.name} kaufst du ${e.x} von ${e.y} Halal-ETFs und Fonds aus unserem Vergleich, bei Trade Republic ${trEtf.x}.`);
  const sa = anzahl(a, "halalSukuk");
  const st = anzahl(tr, "halalSukuk");
  if (sa && st) teile.push(`Sukuk: ${sa.x} von ${sa.y}, bei Trade Republic ${st.x}.`);
  teile.push(`Eine Order kostet ${order(a)}, bei Trade Republic ${order(tr)}.`);
  return teile.join(" ");
};

/** „Passt zu dir, wenn …“ je Depot. Fakten aus den Werten des Vergleichs; ohne Eintrag ein Satz aus der Zahl der Halal-ETFs. */
const PASST: Record<string, (a: RohAnbieter) => string> = {
  /* SEO84: S Broker steht im Release vorn; Fakten aus seinen Werten (11 von 12, Order 0,95 €). */
  "s-broker-direkt-depot": (a) => `du ${anzahl(a, "halalEtfsFonds")?.text ?? "viele Halal-ETFs"} willst und für eine Order ${order(a)} zahlst.`,
  "flatex-depot": (a) => `du alle ${anzahl(a, "halalEtfsFonds")?.y ?? ""} Halal-ETFs und Fonds aus unserem Vergleich an einem Ort willst und dafür eine höhere Ordergebühr in Kauf nimmst.`,
  "smartbroker-plus-depot": () => "du Halal ETFs, Sukuk und Gold in einer App willst und das Zinskonto einfach nicht eröffnest.",
  "scalable-capital-free-broker": () => "du ETFs von großen Anbietern wie iShares ab einer größeren Summe ohne Ordergebühr kaufen willst.",
  "traders-place-depot": () => "du das Depot willst, das ich selbst nutze, mit einem Sparplan jede Woche, jeden Monat oder jedes Quartal.",
  "trading-212-depot": () => "du oft kaufst und für eine Order gar nichts zahlen willst.",
};
const passt = (a: RohAnbieter) => PASST[a.id]?.(a) ?? `du ${anzahl(a, "halalEtfsFonds")?.text ?? "Halal-ETFs"} kaufen willst.`;

/**
 * „Am besten für“ je Depot (Seiten-Prüfer SEO82 MUSS 1; BP:123, D5, D58): höchstens sechs Wörter aus denselben Fakten wie PASST,
 * wortgleich in Karte, H3 und Tabelle. Trade Republic ehrlich und ohne Schlechtreden (memory/eigene-produkte-nie-schlechtreden.md).
 */
const BEST_FUER: Record<string, (a: RohAnbieter) => string> = {
  "trade-republic-depot": () => "alle, die es schon haben",
  "s-broker-direkt-depot": () => "viele Halal-ETFs, kleine Order",
  "flatex-depot": (a) => (anzahl(a, "halalEtfsFonds")?.x === anzahl(a, "halalEtfsFonds")?.y ? "die volle Auswahl" : "viele Halal-ETFs"),
  "smartbroker-plus-depot": () => "ETFs, Sukuk und Gold zusammen",
  "scalable-capital-free-broker": () => "große ETF-Käufe",
  "traders-place-depot": () => "Sparpläne jede Woche",
  "trading-212-depot": () => "viele kleine Orders",
};
const bestFuer = (a: RohAnbieter) => BEST_FUER[a.id]?.(a) ?? `${anzahl(a, "halalEtfsFonds")?.text ?? "Halal-ETFs"}`;

/** Tabelle „Was passt zu wem“ (MUSS 4, VORLAGEN 1 Nr. 15): „Wenn du …“ aus PASST, „Achte auf“ ist der Kredit oder der Zins-Satz des Depots. */
const WENN: Record<string, (a: RohAnbieter) => string> = {
  "trade-republic-depot": () => "Trade Republic schon hast und dort bleiben willst",
  "s-broker-direkt-depot": (a) => `${anzahl(a, "halalEtfsFonds")?.text ?? "viele Halal-ETFs"} mit kleiner Ordergebühr willst`,
  "flatex-depot": (a) => `alle ${anzahl(a, "halalEtfsFonds")?.y ?? ""} Halal-ETFs und Fonds an einem Ort willst`,
  "smartbroker-plus-depot": () => "ETFs, Sukuk und Gold in einer App willst",
  "scalable-capital-free-broker": () => "ETFs großer Anbieter in größeren Summen kaufst",
  "traders-place-depot": () => "jede Woche sparen willst",
  "trading-212-depot": () => "oft kaufst und für die Order nichts zahlen willst",
};
const achte = (a: RohAnbieter) => kreditKurz("depot", a) ?? zinsHinweis("depot", a) ?? "";
/** Wohin „Nimm“ und der Knopf unter dem Eintrag führen: Partnerlink, sonst der Eintrag auf dieser Seite. */
const Nimm = ({ a }: { a: RohAnbieter }) =>
  a.link ? (
    <a href={a.link} rel="sponsored nofollow" className="font-semibold text-primary underline underline-offset-[3px] hover:text-primary/80">
      {a.name}*
    </a>
  ) : (
    <a href={a.id === tr.id ? "#ist-trade-republic-halal" : `#${anker(a)}`} className="font-semibold text-primary underline underline-offset-[3px] hover:text-primary/80">
      {a.name}
    </a>
  );

/**
 * Logos (SEO84, Elias SEO83-03: „Trade Republic … da hast du gar keine Logos reingefüllt“): dieselben Schriftzüge wie in den Vergleichen,
 * über die Domain aus den Vergleichsdaten (src/data/anbieterLogos.ts, Herkunft docs/LOGOS.md). Ohne Schriftzug (Trading 212, docs/LOGOS.md
 * „Offen“) zeigt AnbieterLogo das runde Symbol wie im Depot-Vergleich.
 */
const Logo = ({ a }: { a: RohAnbieter }) => <AnbieterLogo name={a.name} domain={a.domain} gross />;

/** Dreier-Kombi: die ersten drei des Depot-Vergleichs mit Partnerlink (VORLAGEN 0.2, Reihenfolge nie umsortieren). */
const DREIER = depotVorn
  .filter((a) => a.link)
  .slice(0, 3)
  .map((a) => ({
    name: a.name,
    domain: a.domain,
    out: a.link!,
    zeilen: [`Halal-ETFs und Fonds: ${zahl(a, "halalEtfsFonds")}`, `Sukuk: ${zahl(a, "halalSukuk")}`, `Order: ${order(a)}`],
  }));

/**
 * Elias' Satz wie in den Freebies (SEO83-03: „ich habe so und so viele verglichen, ich habe auf diese Kriterien geachtet und habe einen
 * Test gemacht“). Kriterien nur die der Rangfolge (src/lib/rangfolge.ts: ohne Zinsen nutzbar als Voraussetzung, Kredit ab Start kostet
 * 10 %, Halal-Anlagen kaufbar, Kosten; /vergleiche/methodik). Der Test ist der Check (/check).
 * SEO84 Prüfer-MUSS 1: Zahl und Wort wie das Klickziel /check und Elias' Freebie-Wortlaut („54 Bankkonten, 35 Depots. Ich habe sie alle
 * getestet.“, Vault raw/2026-11-17-elias-rn16-12-*.md), also DEPOTS_GETESTET und „getestet“. Die {depotAnzahl} bleibt nur für den Umfang
 * des Vergleichs. Seit SEO85 steht der Satz nur noch einmal, im Kasten weiter unten (Elias SEO84-03).
 */
/** Fett zum Überfliegen wie in den Freebies (RN16-20). */
const FETT_TEST = /(ohne Zinsen nutzen|einen Kredit|Halal-ETFs, Sukuk und Gold-ETCs|einen Test gebaut)/;
const ICH_KRITERIEN =
  "Geachtet habe ich darauf, ob du das Depot ohne Zinsen nutzen kannst, ob dir der Broker ab Start einen Kredit gibt, wie viele Halal-ETFs, Sukuk und Gold-ETCs du dort kaufst und was es kostet.";
const ICH_TEST = "Daraus habe ich einen Test gebaut. Nach ein paar Fragen zeigt er dir das Depot, das zu dir passt.";

/**
 * Bildschirmfotos (SEO84, Elias SEO83-02: „das Screenshot und so, das ist ja alles Katastrophe“): nur Bilder, die klar die echte App zeigen.
 * Raus auf dieser Seite: die App-Store-Werbebilder von Smartbroker+, flatex und Trading 212 (Slogans, Musterdepot) und Traders Place Bild 1
 * (leeres Portfolio unter einem Werbebanner). Es bleibt Elias' eigene Suche nach „MSCI World Islamic“ in der Traders-Place-App.
 * Der Depot-Vergleich behält seine Bilder (src/data/depotAppBilder.ts unverändert).
 */
const APP_BILD: Record<string, AppBild | undefined> = {
  "traders-place": DEPOT_APP_BILDER["traders-place"]?.find((b) => b.src.endsWith("traders-place-2.webp")),
};

const WICHTIGSTES: { lead: string; text: ReactNode }[] = [
  { lead: "Trade Republic geht ohne Zinsen.", text: zinsHinweis("depot", tr) ?? "" },
  { lead: "Der Haken ist die Auswahl.", text: trEtf ? `Dort kaufst du ${trEtf.text} aus unserem Vergleich.` : "" },
  { lead: "Mehr Halal-ETFs gibt es woanders.", text: mehrText.length ? `${reihe(mehrText)}.` : "" },
  {
    lead: alleKostenlos ? "Das Depot kostet überall 0 €." : "Die Kosten sind klein.",
    text: alleKostenlos ? `Bei Trade Republic und allen ${depotVorn.length} Alternativen zahlst du keine Depotgebühr, nur die Order kostet unterschiedlich.` : "Die Order kostet je Depot unterschiedlich.",
  },
  /* Beleg: BGH, Urteil vom 30.11.2004, XI ZR 200/03 (lexetius.com/2004,3267): Klauseln von Kreditinstituten, „in denen ein Entgelt für die
     Übertragung von Wertpapieren in ein anderes Depot gefordert wird“, sind unwirksam; nur fremde Spesen (test.de, 15.02.2005).
     Trade Republic Bank GmbH ist eine Bank in Deutschland (brokerVergleich.ts, Feld bank). */
  { lead: "Wechseln geht ohne Verkauf.", text: "Trade Republic darf für den Übertrag deiner Wertpapiere in ein anderes Depot kein Entgelt verlangen, nur fremde Spesen." },
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
    antwort: `Das hängt davon ab, was du kaufen willst. Ohne Zinsen nutzen kannst du ${depotOhneZinsen} der ${depotAnzahl} Depots aus unserem Vergleich. Mehr Halal-ETFs und Fonds als Trade Republic führen ${reihe(mehrText)}.`,
  },
  { frage: "Ist Trade Republic kostenlos?", antwort: trKostenlos },
  {
    frage: "Sind Trade Republic Zinsen haram?",
    antwort: `Zinsen sind Riba, und Riba ist im Islam verboten. ${zinsHinweis("depot", tr) ?? ""}`.trim(),
  },
  {
    frage: "Zahlt eine Trade Republic Alternative Zinsen?",
    antwort: `Bei ${reihe(mitNull)} hat dein Guthaben 0 % Zinsen. Bei ${reihe(ohneNull)} lässt du die Zinsen aus. Was du dafür tust, steht oben bei jedem Depot.`,
  },
  {
    frage: "Wo ist der Haken bei Trade Republic?",
    antwort: trEtf ? `Für dich ist es die Auswahl: Dort kaufst du ${trEtf.text} aus unserem Vergleich. Willst du die anderen, brauchst du ein zweites Depot.` : "Für dich ist es die Auswahl der Halal-ETFs.",
  },
  {
    frage: "Kann ich Trade Republic behalten und ein zweites Depot eröffnen?",
    antwort: "Ja. Du eröffnest das zweite Depot und behältst bei Trade Republic, was du schon hast. Willst du alles an einem Ort, beantragst du beim neuen Broker einen Depotübertrag. Trade Republic darf dafür kein Entgelt verlangen.",
  },
];

const PASST_DAZU: { to: string; name: string; text: string }[] = [
  /* SEO87: Rückverlinkung auf die Paarseite (Seiten-Prüfer SEO86, Kannibalisierung: ein Link je Richtung, eigener Anker). */
  { to: "/blog/scalable-capital-vs-trade-republic", name: ANKER_BEITRAG["/blog/scalable-capital-vs-trade-republic"], text: "Welches der beiden Depots für Muslime vorn liegt." },
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
  // SEO84: nur Bilder, die klar die echte App zeigen (APP_BILD oben).
  const bild = a.haus ? APP_BILD[a.haus] : undefined;
  return (
    <section className="mt-10" aria-labelledby={anker(a)}>
      <Logo a={a} />
      <h3 className="font-titel mt-3 text-[21px] leading-tight text-foreground">
        <span id={anker(a)} className="scroll-mt-24">
          {platz}. {a.name}, am besten für {bestFuer(a)}
        </span>
      </h3>
      <Text>
        {/* Seiten-Prüfer SEO82 R2 SOLLTE 5: Kreditsatz als eigener Absatz, damit kein Absatz am Handy über sieben Zeilen läuft. */}
        {/* SEO85 Kannibalisierung (Prüfer Ratgeber Depot/Giro): kein wortgleicher Absatz aus dem Depot-Ratgeber, sondern der direkte
            Vergleich mit Trade Republic aus denselben Daten. */}
        <p>{gegenTr(a)}</p>
        {brokerText(a).some((t) => /Kredit/.test(t)) && <p>{brokerText(a).map(sauber).filter((t) => /Kredit/.test(t)).join(" ")}</p>}
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
      {bild && (
        <figure className="mt-6 max-w-[280px]">
          <img src={bild.src} alt={bild.alt} width={600} height={1200} loading="lazy" className="w-full border border-border" />
          <figcaption className="mt-2 text-[15px] text-foreground/80">Mein Bild aus der App von {a.name}: {bild.text}</figcaption>
        </figure>
      )}
      <Text>
        <p>
          <strong className="font-semibold text-foreground">Passt zu dir, wenn</strong> {passt(a)}
        </p>
      </Text>
      {/* Elias 25.11.: Jeder Block endet so, dass der nächste Schritt ist, das Depot selbst auszuprobieren. Kein aside (S-AUFRUFE). */}
      {a.link ? (
        <a
          href={a.link}
          rel="sponsored nofollow"
          className="mt-5 inline-flex min-h-[48px] items-center justify-center bg-primary px-5 py-3 text-[16px] font-semibold text-primary-foreground hover:bg-primary/90"
        >
          {a.name} eröffnen*
        </a>
      ) : (
        <Link
          to="/vergleich/depot"
          className="mt-5 inline-flex min-h-[48px] items-center justify-center border border-foreground px-5 py-3 text-[16px] font-semibold text-foreground hover:border-primary hover:text-primary"
        >
          {a.name} im Vergleich
        </Link>
      )}
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

  return (
    <main className="bg-background">
      <Seo title={TITEL} description={META} path={PFAD} jsonLd={graph()} />
      <div className="container py-8 md:py-12">
        <div className="mx-auto max-w-[720px] xl:grid xl:max-w-[1048px] xl:grid-cols-[280px_minmax(0,720px)] xl:gap-12">
          {/* SEO84: Hauptaufruf ist der Check („Finde dein Match“), nicht der Depot-Vergleich als eigenes Wort (Kannibalisierung). */}
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
                    <Karte key={a.id} nummer={i + 1} kopf={a.name} erste={i === 0} marke={<Logo a={a} />}>
                      <Etikett className="mt-1">Am besten für</Etikett>
                      <p className="mt-1 text-[15px] font-semibold leading-snug text-foreground">{bestFuer(a)}</p>
                      <Etikett className="mt-3">Halal-ETFs und Fonds</Etikett>
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
                    Kurz gesagt: Trade Republic kannst du ohne Zinsen nutzen, wenn die Zinsfunktion in der App aus ist. Der Haken ist
                    die Auswahl. Die erste Trade Republic Alternative in unserem Vergleich ist {depotVorn[0]?.name}
                    {anzahl(depotVorn[0], "halalEtfsFonds") ? `: Dort kaufst du ${anzahl(depotVorn[0], "halalEtfsFonds")!.text}.` : "."}
                  </p>
                </Text>
                {/* SEO85 (Elias SEO84-03: „Lass erstmal das Wichtigste, kein Call to Action. Erstmal runter. Und dann kommt die Tabelle“):
                    nach dem Einstieg kein Knopf; der Kopf hat schon „Match finden“, das Karussell die Anbieter. */}

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
                      Trade Republic steht oben, darunter die fünf Depots vorn in unserem Vergleich. Gezählt sind die Halal-ETFs und Fonds und die Sukuk,
                      die du dort kaufst. Sukuk sind islamische Anleihen.
                    </p>
                  </Text>
                  <Tabelle
                    kopf={[{ titel: "Depot" }, { titel: "Passt zu", text: true }, { titel: "Halal-ETFs", zusatz: "und Fonds", rechts: true }, { titel: "Sukuk", rechts: true }, { titel: "Order", eng: true }]}
                    zeilen={ALLE.map((a) => ({
                      schluessel: a.id,
                      name: (
                        <span className="flex flex-col items-start gap-1.5">
                          <Logo a={a} />
                          <a href={a.id === tr.id ? "#ist-trade-republic-halal" : `#${anker(a)}`} className="underline decoration-border underline-offset-[3px] hover:text-primary">
                            {a.name}
                          </a>
                        </span>
                      ),
                      zellen: [bestFuer(a), zahl(a, "halalEtfsFonds"), zahl(a, "halalSukuk"), order(a)],
                    }))}
                    umbrechen
                  />
                </section>

                <GoogleKasten />

                <section className="mt-14">
                  <Ueber id="ist-trade-republic-halal" />
                  <Text>
                    <p>{DEPOT_HALAL_SATZ}</p>
                    {/* „Dort“ bekommt seinen Bezug (Seiten-Prüfer SOLLTE 8), ETCs einmal im Alltagswort (SOLLTE 7). */}
                    {trText && <p>{trText.saetze.join(" ").replace(/^Dort /, "Bei Trade Republic ")} ETCs sind Wertpapiere auf Gold oder Silber, die du wie ETFs kaufst.</p>}
                    {/* Reiner Sachsatz ohne Halal-Aussage (Halal-Prüfer SEO82 Fund 4); Beleg Instrument_Universe_DE_de.pdf, Abschnitt „HANDELSUNIVERSUM Aktien“. */}
                    <p>Einzelne Aktien kaufst du bei Trade Republic auch: Im Handelsangebot stehen Aktien aus Deutschland, Europa und den USA.</p>
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

                {/* Erster Anbieter-Kasten nach dem zweiten Inhaltsblock, zwischen einem Viertel und einem Drittel (Elias SEO67).
                    SEO84 (Elias SEO83-03: „einmal in die Mitte so die 3 besten“): die drei besten aus der Rangfolge, darunter der Check.
                    Er steht vor den fünf Einträgen, so spät, wie die Drittel-Regel (Tor M-DRITTEL, 20 bis 40 %) es zulässt. */}
                <AnbieterKasten titel={`Die ${DREIER.length} besten Trade Republic Alternativen`} anbieter={DREIER} />

                <section className="mt-14">
                  <Ueber id="alternativen" />
                  <Text>
                    <p>
                      Diese {depotVorn.length} Alternativen zu Trade Republic stehen in unserem Vergleich vorn.
                      {alleOhneZinsen && " Bei allen kannst du dein Guthaben ohne Zinsen lassen."}
                      {alleMehrSukuk && " Und bei allen kaufst du mehr Sukuk als bei Trade Republic."}
                    </p>
                  </Text>
                  {depotVorn.map((a, i) => (
                    <Eintrag key={a.id} a={a} platz={i + 1} />
                  ))}
                </section>

                <section className="mt-14">
                  <Ueber id="besser" />
                  <Text>
                    <p>
                      Besser ist das Depot, in dem du kaufen kannst, was du suchst. {kostenSatz} Wer viele Halal-ETFs will, nimmt {trText?.mehr[0]?.anbieter.name ?? "ein Depot vorn im Vergleich"}.
                    </p>
                  </Text>
                  <Tabelle
                    kopf={[{ titel: "Wenn du …" }, { titel: "Nimm", text: true }, { titel: "Achte auf", text: true }]}
                    zeilen={ALLE.map((a) => ({
                      schluessel: `wenn-${a.id}`,
                      name: WENN[a.id]?.(a) ?? passt(a),
                      zellen: [
                        <span key="nimm" className="flex flex-col items-start gap-1.5">
                          <Logo a={a} />
                          <Nimm a={a} />
                        </span>,
                        achte(a),
                      ],
                    }))}
                    wischen
                    umbrechen
                  />
                  <H3>Apps wie Trade Republic</H3>
                  <Text>
                    <p>
                      Trading 212 und Traders Place sind Apps wie Trade Republic: ein Depot am Handy, Sparplan schon mit 1 €. S Broker, flatex und
                      Smartbroker+ haben auch eine App, dazu die Seite am Laptop.
                    </p>
                  </Text>
                  <H3>So wechselst du von Trade Republic</H3>
                  <Text>
                    <p>
                      Du musst nichts verkaufen. Eröffne das neue Depot und beantrage dort den Depotübertrag. Trade Republic darf für den Übertrag
                      kein Entgelt verlangen, nur fremde Spesen. Oder du behältst Trade Republic und kaufst die fehlenden Halal-ETFs im zweiten Depot.
                    </p>
                  </Text>
                </section>

                {/* SEO85 (Elias SEO84-03: „Ich habe sie alle getestet … weiter unten … ein bisschen auffälliger … so machen, wie ich es auch in
                    den Freebies mache“): derselbe Kasten wie CheckEinstieg (src/styles/checkEinstieg.css): Zahl blau, Titel fett, Satz mit
                    fetten Stellen, Quiz-Vorschau, blauer runder Knopf. Zahl und „getestet“ wie /check (Prüfer-MUSS 1 SEO84). Steht nur einmal. */}
                <aside aria-labelledby="mein-test" data-check-einstieg="blog" className="ce mt-12">
                  <h2 id="mein-test" className="ce-titel">
                    <span className="ce-titel-zahlen">{DEPOTS_GETESTET} Depots.</span> Ich habe sie alle getestet.
                  </h2>
                  <p className="ce-satz">
                    {`${ICH_KRITERIEN} ${ICH_TEST}`.split(FETT_TEST).map((t, i) => (i % 2 ? <strong key={i}>{t}</strong> : t))}
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

                <section className="mt-12">
                  <Ueber id="naechster-schritt" />
                  <Text>
                    <p>
                      Du weißt jetzt, was Trade Republic kann und wo es fehlt. Fehlt dir dort ein Halal-ETF, brauchst du ein zweites Depot. Bei{" "}
                      {depotVorn[0]?.name} kaufst du {anzahl(depotVorn[0], "halalEtfsFonds")?.text}. Welches Depot zu dir passt, zeigt dir mein Test.
                    </p>
                    <p>
                      Was du bei jedem Depot auf dieser Seite für 0 % Zinsen tust, steht in seinem Eintrag. Ohne Zinsen nutzen kannst du {depotOhneZinsen} der {depotAnzahl} Depots aus unserem Vergleich. Alle {depotAnzahl} mit
                      Kosten und der Angabe, ob sie ohne Zinsen gehen, findest du unter <TL to="/vergleich/depot">{ANKER_VERGLEICH["/vergleich/depot"]}</TL>.
                    </p>
                  </Text>
                  <MatchKnopf stelle="schluss" className="mt-5" />
                </section>

                <AnbieterKasten titel="Trade Republic Alternativen mit mehr Halal-ETFs" anbieter={DREIER} />

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
                  {/* SEO84: keine graue Kleinschrift (Elias SEO63), gleiche Größe wie der Text in den Kästen. */}
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

export default TradeRepublicAlternative;
