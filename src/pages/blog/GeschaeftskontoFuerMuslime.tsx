import { useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, Check, ChevronDown } from "lucide-react";
import Seo from "@/components/Seo";
import { AnbieterLogo } from "@/components/AnbieterLogo";
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
  YOUTUBE,
} from "@/components/blog/bausteine";
import { geschaeftskontoAnzeige } from "@/data/anzeige/geschaeftskonto";
import { GESCHAEFT_FINANZ_MAX } from "@/data/finanzMax";
import { zinsHinweis } from "@/data/zinsHinweise";
import type { RohAnbieter } from "@/data/vergleichHelfer";
import { rangfolge } from "@/lib/rangfolge";

/**
 * Kaufseite „geschäftskonto für muslime“ (SEO84, 25.11.2026, Elias SEO83-03: „Du kannst vielleicht für das Geschäftskonto noch einen
 * Blog machen. Geschäftskonto für Muslime oder so.“). Aufbau wie /blog/trade-republic-alternative (VORLAGEN.md Vorlage 1 „Beste“),
 * Karte im Vault fundament/research/quellen/SEO-GUIDE-Z2aCQ5YKaTU/beitraege/geschaeftskonto-fuer-muslime.seo.json, Notizen
 * data/seo/blog/geschaeftskonto-fuer-muslime.md.
 *
 * Jede Zahl kommt aus denselben Daten wie der Geschäftskonto-Vergleich (src/data/geschaeftskontoVergleich.ts über
 * src/data/anzeige/geschaeftskonto.ts und src/lib/rangfolge.ts), nichts ist abgetippt. Ändert sich die Rangfolge, zieht diese Seite mit.
 * Kein Doppel mit dem Vergleich: Der Vergleich trägt „geschäftskonto vergleich“, diese Seite die Frage für Muslime und führt dorthin.
 * Noch nicht live (Elias SEO83-02: nur vorbereiten).
 */

const PFAD = "/blog/geschaeftskonto-fuer-muslime";
const VERGLEICH = "/vergleich/geschaeftskonto";
const TITEL = "Bestes Geschäftskonto für Muslime 2026";
const META =
  "Welches Geschäftskonto geht ohne Zinsen und ohne Dispo? Die 5 besten Geschäftskonten für Muslime 2026 aus 72 Konten, dazu die KT Bank als Islamic-Konto.";
const VEROEFFENTLICHT = { text: "25.11.2026", iso: "2026-11-25T09:00:00+01:00" };
const AKTUALISIERT = { text: "25.11.2026", iso: "2026-11-25T09:00:00+01:00" };
/** Lesedauer in Minuten: Wörter im Beitrag durch 200, aufgerundet. */
const LESEZEIT = 8;
const RECHTSHINWEIS =
  "Dieser Beitrag ist keine Fatwa und keine Anlageberatung. Die Reihenfolge ist die unseres Geschäftskonto-Vergleichs. Über die Zulässigkeit eines Vertrags entscheidest du selbst, im Zweifel mit einem Gelehrten.";

type Abschnitt = { id: string; titel: string; leiste?: boolean; kurz?: string };
const ABSCHNITTE: Abschnitt[] = [
  { id: "kurzer-vergleich", titel: "Die 5 besten Geschäftskonten für Muslime auf einen Blick", leiste: true, kurz: "Auf einen Blick" },
  { id: "das-wichtigste", titel: "Das Wichtigste", leiste: true },
  { id: "vergleich", titel: "Die Top 5 nach Kosten und Rechtsform", leiste: true, kurz: "Kosten und Rechtsform" },
  { id: "worauf-achten", titel: "Worauf achtest du als Muslim beim Geschäftskonto?", leiste: true, kurz: "Worauf du achtest" },
  { id: "konten", titel: "Die besten Geschäftskonten für Muslime 2026", leiste: true, kurz: "Die 5 Konten" },
  { id: "kt-bank", titel: "Das KT Bank Geschäftskonto als Islamic-Konto", leiste: true, kurz: "KT Bank" },
  { id: "was-passt", titel: "Welches Geschäftskonto ohne Zinsen passt zu dir?", leiste: true, kurz: "Was passt zu dir" },
  { id: "haeufige-fragen", titel: "Häufige Fragen", leiste: true },
  { id: "naechster-schritt", titel: "Dein nächster Schritt" },
];
const titelVon = (id: string) => ABSCHNITTE.find((a) => a.id === id)!.titel;
const LEISTE = ABSCHNITTE.filter((a) => a.leiste);
const Ueber = ({ id }: { id: string }) => <H2 id={id}>{titelVon(id)}</H2>;

/* ------------------------------------------------------------------ */
/* Daten, alle aus dem Geschäftskonto-Vergleich                        */
/* ------------------------------------------------------------------ */

const ANZAHL = geschaeftskontoAnzeige.length;
const ANBIETER = new Set(geschaeftskontoAnzeige.map((a) => a.haus ?? a.id)).size;
const RANG = rangfolge(geschaeftskontoAnzeige, "geschaeftskonto", { finanzMax: GESCHAEFT_FINANZ_MAX }).gerankt;
const platzVon = (id: string) => RANG.find((b) => b.anbieter.id === id)?.platz;
const OHNE_ZINSEN = geschaeftskontoAnzeige.filter((a) => a.werte.zinsfreiAbStart === "gut").length;

/**
 * Je Anbieter das erste Konto der Rangfolge (eigener Vorschlag SEO84: zwei N26-Tarife nebeneinander helfen dem Leser nicht,
 * die Reihenfolge der Häuser bleibt die des Vergleichs). Nur Konten ohne Guthabenzins, ohne Dispo ab Start und mit Karte ohne Kredit.
 */
const JE_HAUS: RohAnbieter[] = (() => {
  const gesehen = new Set<string>();
  const aus: RohAnbieter[] = [];
  for (const b of RANG) {
    const a = b.anbieter;
    const haus = a.haus ?? a.id;
    if (gesehen.has(haus)) continue;
    gesehen.add(haus);
    if (a.werte.zinsfreiAbStart === "gut" && a.werte.keinDispoAbStart === "gut" && a.werte.karteOhneKredit === "gut") aus.push(a);
  }
  return aus;
})();
const TOP = JE_HAUS.slice(0, 5);
const KT = geschaeftskontoAnzeige.find((a) => a.haus === "kt-bank");

const name = (a: RohAnbieter) => `${a.name} ${a.produkt ?? ""}`.trim();
const anker = (a: RohAnbieter) => `konto-${a.haus ?? a.id}`;
const w = (a: RohAnbieter, k: string) => String(a.werte[k] ?? "");
const reihe = (teile: string[]) => (teile.length > 1 ? `${teile.slice(0, -1).join(", ")} und ${teile[teile.length - 1]}` : teile[0] ?? "");

/** „Für wen“ in Alltagswörtern: Freiberufler und Gewerbe, sonst die Rechtsformen aus den Daten. */
const fuerWen = (a: RohAnbieter) => w(a, "fuerWen").replace(/, /g, ", ");
const kontofuehrung = (a: RohAnbieter) => (w(a, "kontofuehrung") === "0 €" ? "0 € im Monat" : `${w(a, "kontofuehrung")} im Monat`);
const unterkonten = (a: RohAnbieter) => {
  const u = w(a, "unterkonten");
  return u === "Unbegrenzt" ? "beliebig viele" : u === "Keine" ? "keine" : u;
};

/** „Am besten für“ je Haus (höchstens sechs Wörter), aus Rechtsform und Kosten der Daten. */
const BEST_FUER: Record<string, (a: RohAnbieter) => string> = {
  n26: () => "Freiberufler mit Unterkonten",
  vivid: () => "GmbH und UG ohne Grundgebühr",
  accountable: () => "Freiberufler, Gewerbe und GbR",
  bunq: () => "Bargeld einzahlen ohne Gebühr",
  ing: () => "OHG und KG mit Bargeld",
};
const bestFuer = (a: RohAnbieter) => BEST_FUER[a.haus ?? ""]?.(a) ?? fuerWen(a);

/** Punkte je Konto, nur Werte aus der Tabelle des Vergleichs. */
const punkte = (a: RohAnbieter): string[] => [
  `Kontoführung: ${kontofuehrung(a)}`,
  `Buchungen: ${w(a, "buchungen")}`,
  `Debitkarte: ${w(a, "debitkarte")}`,
  `Unterkonten: ${unterkonten(a)}`,
  `Für: ${fuerWen(a)}`,
];

const DREIER = TOP.filter((a) => a.link)
  .slice(0, 3)
  .map((a) => ({
    name: name(a),
    domain: a.domain,
    out: a.link!,
    zeilen: [`Kontoführung: ${kontofuehrung(a)}`, `Für: ${fuerWen(a)}`, "Keine Zinsen, kein Dispo ab Start"],
  }));

const ERSTES = TOP[0];

const WICHTIGSTES: { lead: string; text: ReactNode }[] = [
  {
    lead: "Zinsen sind Riba.",
    text: "Darum zählt beim Geschäftskonto zuerst, ob dein Guthaben verzinst wird. Bei vielen Konten kommt der Zins über ein Tagesgeld oder ein Zinskonto daneben.",
  },
  {
    lead: `${OHNE_ZINSEN} von ${ANZAHL} Konten gehen ohne Zinsen.`,
    text: "Bei diesen Konten schreibt der Anbieter selbst, dass das Hauptkonto keinen Guthabenzins zahlt.",
  },
  { lead: "Kein Dispo ab Start.", text: "Ein Dispo ist ein Kredit mit Zinsen. Bei den Konten vorn wird dir keiner eingeräumt." },
  {
    lead: `Platz 1 ist ${ERSTES ? name(ERSTES) : "im Vergleich"}.`,
    text: ERSTES ? `${kontofuehrung(ERSTES)}, ${unterkonten(ERSTES)} Unterkonten, für ${fuerWen(ERSTES)}.` : "",
  },
  {
    lead: "Die KT Bank hat ein Geschäftskonto ohne Zinsen.",
    text: "Es läuft laut Antrag unverzinslich und ohne Dispo, die Eröffnung geht nur in der Filiale.",
  },
];

/**
 * Tabelle „Was passt zu wem“ (Seiten-Prüfer SEO84 MUSS 4): je Bedarf das Konto mit dem besten Platz, das laut Daten dazu passt
 * (Rechtsform aus fuerWen, Kosten aus kontofuehrung, Bargeld aus einzahlen). Fehlt ein Konto in den Daten, fällt die Zeile weg.
 */
const konto = (id: string) => geschaeftskontoAnzeige.find((a) => a.id === id);
const WAS_PASST: { wenn: string; a: RohAnbieter | undefined }[] = [
  { wenn: "Freiberufler oder Gewerbe bist und Unterkonten für die Steuer willst", a: konto("n26-business-smart") },
  { wenn: "Freiberufler oder Gewerbe bist und im Monat nichts zahlen willst", a: konto("n26-business-standard") },
  { wenn: "eine GbR, UG oder GmbH führst", a: konto("vivid-business-free-start") },
  { wenn: "Bargeld einzahlen willst, ohne dafür zu zahlen", a: konto("bunq-core-business") },
];

const FRAGEN: { frage: string; antwort: string }[] = [
  {
    frage: "Gibt es ein islamisches Geschäftskonto in Deutschland?",
    antwort:
      "Die KT Bank schreibt über sich, sie sei die „erste und einzige Bank in Deutschland und in der Eurozone mit islamkonformem Geschäftsmodell“. Ihr Geschäftskonto wird laut Antrag unverzinslich und ohne Dispo geführt, eröffnen kannst du es in einer Filiale. Daneben gibt es Konten anderer Banken, die laut Anbieter ohne Zinsen und ohne Dispo laufen.",
  },
  {
    frage: "Ist ein Geschäftskonto mit Zinsen haram?",
    antwort:
      "Zinsen sind Riba, und Riba ist im Islam verboten. Darum stehen in unserem Vergleich zuerst Konten, deren Guthaben nicht verzinst wird. Zahlt ein Anbieter Zinsen auf das Guthaben, steht sein Konto ganz hinten.",
  },
  {
    frage: "Gibt es ein Geschäftskonto mit Dispo ohne Zinsen?",
    antwort:
      "Ein Dispo ist ein Kredit mit Sollzinsen. Bei den Konten vorn in unserem Vergleich wird dir nach der Eröffnung keiner eingeräumt. Die KT Bank schreibt im Antrag: „Ein Dispositionskredit wird nicht eingeräumt.“",
  },
  {
    frage: "Wie kann ich ein KT Bank Geschäftskonto eröffnen?",
    antwort:
      "Nur persönlich in einer Filiale der KT Bank. Die Bank schreibt, dass ihre Geschäftskundenberater dort die Eröffnung mit dir machen. Eine Online-Eröffnung für das Geschäftskonto nennt sie nicht.",
  },
  {
    frage: "Was mache ich mit Tagesgeld und Unterkonten mit Zins?",
    antwort:
      "Eröffne sie nicht. Bei vielen Geschäftskonten läuft der Zins nur über so ein eigenes Konto. Bei den fünf Konten vorn auf dieser Seite entsteht es nur, wenn du es selbst eröffnest.",
  },
  {
    frage: "Kann ich als Freiberufler mein Privatkonto nutzen?",
    antwort:
      "Für Freiberufler und Einzelunternehmer ist ein eigenes Geschäftskonto keine Pflicht. Es trennt aber Privates und Geschäftliches. Eine GmbH oder UG braucht ein Konto auf den Namen der Gesellschaft.",
  },
  {
    frage: "Welches ist das beste Geschäftskonto für Muslime?",
    antwort: `In unserem Vergleich steht ${ERSTES ? name(ERSTES) : "ein Konto ohne Zinsen"} vorn. Es ist für ${ERSTES ? fuerWen(ERSTES) : "Selbstständige"}. Für eine GbR, UG oder GmbH steht ${konto("vivid-business-free-start") ? "Vivid Business Free Start" : "ein anderes Konto"} am weitesten vorn.`,
  },
];

const PASST_DAZU: { to: string; name: string; text: string }[] = [
  { to: "/blog/girokonto-ohne-zinsen", name: "Girokonto ohne Zinsen", text: "Stell auch dein Privatkonto um." },
  { to: "/blog/zinsen-im-islam", name: "Zinsen im Islam", text: "Was Riba ist und wo sie im Alltag steckt." },
  { to: "/blog/kreditkarte-halal", name: "Ist eine Kreditkarte halal?", text: "Kreditkarte, Debitkarte und was der Unterschied ist." },
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
        image: `${SITE}/og/blog--geschaeftskonto-fuer-muslime.jpg`,
      },
      {
        "@type": "ItemList",
        "@id": `${url}#liste`,
        name: titelVon("konten"),
        numberOfItems: TOP.length,
        itemListOrder: "https://schema.org/ItemListOrderAscending",
        itemListElement: TOP.map((a, i) => ({ "@type": "ListItem", position: i + 1, name: name(a), url: `${url}#${anker(a)}` })),
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

const Logo = ({ a }: { a: RohAnbieter }) => (
  <span className="inline-flex shrink-0 items-center">
    <AnbieterLogo name={a.name} domain={a.domain} gross />
  </span>
);

const Eintrag = ({ a, nummer }: { a: RohAnbieter; nummer: number }) => {
  const tun = zinsHinweis("geschaeftskonto", a);
  const platz = platzVon(a.id);
  return (
    <section className="mt-10" aria-labelledby={anker(a)}>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <Logo a={a} />
        {platz && <Etikett>Platz {platz} von {ANZAHL} im Vergleich</Etikett>}
      </div>
      <H3>
        <span id={anker(a)} className="scroll-mt-24">
          {nummer}. {name(a)}, am besten für {bestFuer(a)}
        </span>
      </H3>
      <ul className="mt-4 max-w-[664px] space-y-2 text-[16px] leading-snug text-foreground">
        {punkte(a).map((p) => (
          <li key={p} className="flex gap-2">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-gain" aria-hidden />
            {p}
          </li>
        ))}
      </ul>
      {tun && (
        <Text>
          <p>
            <strong className="font-semibold text-foreground">Was du für 0 % Zinsen tust:</strong> {tun}
          </p>
        </Text>
      )}
      {a.link ? (
        <a
          href={a.link}
          rel="sponsored nofollow"
          className="mt-5 inline-flex min-h-[48px] items-center justify-center bg-primary px-5 py-3 text-[16px] font-semibold text-primary-foreground hover:bg-primary/90"
        >
          {a.name} Geschäftskonto eröffnen*
        </a>
      ) : (
        <Link
          to={VERGLEICH}
          className="mt-5 inline-flex min-h-[48px] items-center justify-center border border-foreground px-5 py-3 text-[16px] font-semibold text-foreground hover:border-primary hover:text-primary"
        >
          {a.name} im Geschäftskonto-Vergleich
        </Link>
      )}
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Seite                                                               */
/* ------------------------------------------------------------------ */

const GeschaeftskontoFuerMuslime = () => {
  const [offen, setOffen] = useState(false);
  const ids = useMemo(() => LEISTE.map((a) => a.id), []);
  const aktiv = useAktiv(ids);
  const n26 = TOP.find((a) => a.haus === "n26");
  const vivid = TOP.find((a) => a.haus === "vivid");

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
      <Seo title={`${TITEL} | finanzmuslim`} description={META} path={PFAD} jsonLd={graph()} />
      <div className="container py-8 md:py-12">
        <div className="mx-auto max-w-[720px] xl:grid xl:max-w-[1048px] xl:grid-cols-[280px_minmax(0,720px)] xl:gap-12">
          <Seitenleiste
            inhalt={inhalt}
            etikett="Geschäftskonto-Vergleich"
            titel="Welches Konto passt zu deinem Geschäft?"
            text={`Filter nach Rechtsform und sieh alle ${ANZAHL} Konten, vorn die ohne Zinsen und ohne Dispo.`}
            ziel={VERGLEICH}
            knopf="Finde dein Match"
          />

          <div className="min-w-0">
            <nav aria-label="Brotkrumen" className="flex flex-wrap items-center gap-2 font-mono text-[12px] uppercase tracking-[0.12em] text-muted-foreground">
              <Link to="/blog" className="text-primary hover:underline">
                Blog
              </Link>
              <span aria-hidden>/</span>
              <span>Geschäftskonto für Muslime</span>
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
                <KartenReihe etikett="Kurzer Vergleich" titel={titelVon("kurzer-vergleich")} anzahl={TOP.length}>
                  {TOP.map((a, i) => (
                    <Karte key={a.id} nummer={i + 1} kopf={a.produkt ?? a.name} erste={i === 0}>
                      <div className="flex justify-center">
                        <Logo a={a} />
                      </div>
                      <Etikett className="mt-3">Am besten für</Etikett>
                      <p className="mt-1 text-[15px] font-semibold leading-snug text-foreground">{bestFuer(a)}</p>
                      <Etikett className="mt-3">Kontoführung</Etikett>
                      <p className="font-titel mt-1.5 text-[26px] leading-none text-foreground">{w(a, "kontofuehrung").replace(/ mit .*/, "")}</p>
                      <Etikett className="mt-4">Für</Etikett>
                      <p className="mt-1 text-[15px] leading-snug text-foreground">{fuerWen(a)}</p>
                      <Etikett className="mt-3">Zinsen und Dispo</Etikett>
                      <p className="mt-1 text-[15px] font-semibold leading-snug text-foreground">Keine Zinsen, kein Dispo ab Start</p>
                      <a
                        href={`#${anker(a)}`}
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

              <div className="mt-8">
                <Text>
                  <p>
                    Du hast dich selbstständig gemacht oder eine GmbH gegründet. Die Bank will dir ein Geschäftskonto mit Tagesgeld und Dispo geben.
                    Du fragst dich: Geht das auch ohne Zinsen?
                  </p>
                  <p>
                    Kurz gesagt: Ja. Das beste Geschäftskonto für Muslime in unserem Vergleich ist {ERSTES ? name(ERSTES) : "das erste im Vergleich"}.
                    Das Guthaben wird nicht verzinst, und ab Start gibt es keinen Dispo. Bei {OHNE_ZINSEN} von {ANZAHL} Konten schreibt der Anbieter
                    das selbst.
                  </p>
                </Text>

                <section className="mt-10 border-l-2 border-primary bg-muted px-5 py-6 md:px-8 md:py-7">
                  <Ueber id="das-wichtigste" />
                  <ul className="mt-5 space-y-3.5 text-[16px] leading-[1.6] text-foreground/75">
                    {WICHTIGSTES.map((x) => (
                      <li key={x.lead} className="flex gap-3">
                        <span className="mt-[10px] h-1.5 w-1.5 shrink-0 bg-primary" aria-hidden />
                        <span>
                          <strong className="font-semibold text-foreground">{x.lead}</strong> {x.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="mt-14">
                  <Ueber id="vergleich" />
                  <Text>
                    <p>Hier die fünf Anbieter vorn in unserem Vergleich, jeder mit seinem besten Konto. Bei allen gibt es laut Anbieter keine Zinsen auf dem Guthaben und keinen Dispo ab Start.</p>
                  </Text>
                  <Tabelle
                    kopf={[{ titel: "Konto" }, { titel: "Für", text: true }, { titel: "Kontoführung", rechts: true }, { titel: "Unterkonten", rechts: true }]}
                    zeilen={TOP.map((a) => ({
                      schluessel: a.id,
                      name: (
                        <a href={`#${anker(a)}`} className="underline decoration-border underline-offset-[3px] hover:text-primary">
                          {name(a)}
                        </a>
                      ),
                      zellen: [fuerWen(a), w(a, "kontofuehrung"), unterkonten(a)],
                    }))}
                  />
                </section>

                <GoogleKasten />

                <section className="mt-14">
                  <Ueber id="worauf-achten" />
                  <Text>
                    <p>
                      Ich habe {ANZAHL} Geschäftskonten von {ANBIETER} Anbietern verglichen. Bei jedem habe ich auf vier Dinge geachtet: Zinsen auf
                      dem Guthaben, Dispo ab Start, eine Karte ohne Kredit und die Kosten. Wo die Bank nichts Klares schreibt, haben wir nachgefragt.
                    </p>
                  </Text>
                  <H3>Zinsen auf dem Guthaben</H3>
                  <Text>
                    <p>
                      Zinsen sind Riba, und Riba ist im Islam verboten. Zahlt ein Geschäftskonto Zinsen auf dein Guthaben, steht es in unserem Vergleich
                      ganz hinten. Oft stecken die Zinsen auf Geschäftskonto-Guthaben aber in einem zweiten Konto: Tagesgeld, Zinskonto oder ein
                      Geldmarktfonds. Die eröffnest du nicht.
                    </p>
                  </Text>
                  <H3>Dispo und Kreditrahmen</H3>
                  <Text>
                    <p>
                      Ein Dispo ist ein Kredit mit Sollzinsen. Ob es beim Geschäftskonto Dispo ab der Eröffnung gibt, steht in den Bedingungen der Bank.
                      Bei den Konten vorn in unserem Vergleich gibt es keinen: Einen Kredit gibt es dort höchstens auf deinen Antrag.
                    </p>
                  </Text>
                  <H3>Kreditkarte oder Debitkarte</H3>
                  <Text>
                    <p>
                      Eine Kreditkarte ist ein Kredit, den du später zurückzahlst. Mit einer Debitkarte zahlst du nur von deinem Guthaben. Alle fünf
                      Konten vorn haben eine Debitkarte.
                    </p>
                  </Text>
                </section>

                {/* Erster Anbieter-Kasten nach den Kernfragen, zwischen einem Viertel und einem Drittel (Elias SEO55, SEO67) */}
                <AnbieterKasten titel="Geschäftskonten für Muslime ohne Zinsen" anbieter={DREIER} />

                <section className="mt-14">
                  <Ueber id="konten" />
                  <Text>
                    <p>
                      Diese {TOP.length} Anbieter stehen in unserem <TL to={VERGLEICH}>Geschäftskonto-Vergleich</TL> vorn. Je Anbieter zeige ich das
                      Konto mit dem besten Platz.
                      {n26 && vivid && ` Ganz vorn stehen das N26 Geschäftskonto und das Vivid Geschäftskonto.`}
                    </p>
                  </Text>
                  {TOP.map((a, i) => (
                    <Eintrag key={a.id} a={a} nummer={i + 1} />
                  ))}
                </section>

                {KT && (
                  <section className="mt-14">
                    <Ueber id="kt-bank" />
                    <div className="mt-4">
                      <Logo a={KT} />
                    </div>
                    <Text>
                      <p>
                        Die KT Bank schreibt über sich, sie sei die „erste und einzige Bank in Deutschland und in der Eurozone mit
                        islamkonformem Geschäftsmodell“. In unserem Vergleich ist ihr Geschäftskonto als Islamic-Konto markiert.{" "}
                        {zinsHinweis("geschaeftskonto", KT) ?? ""} Im
                        Antrag steht auch: „Ein Dispositionskredit wird nicht eingeräumt.“
                      </p>
                      <p>
                        Die Kontoführung kostet {w(KT, "kontofuehrung")}, beleglose Buchungen sind frei. Die Debitkarte: {w(KT, "debitkarte")}. Eröffnen kannst du das Konto nur in einer Filiale.
                      </p>
                    </Text>
                  </section>
                )}

                <AutorAufruf
                  bild={eliasPortrait}
                  etikett="Mein Tipp"
                  titel="Finde dein Match unter allen Geschäftskonten"
                  text={`Ich habe ${ANZAHL} Geschäftskonten verglichen und bei jedem auf Zinsen, Dispo, Karte und Kosten geachtet. Im Vergleich filterst du nach deiner Rechtsform und siehst, welches Konto zu dir passt.`}
                  ziel={VERGLEICH}
                  knopf="Finde dein Match"
                />

                <section className="mt-14">
                  <Ueber id="was-passt" />
                  <Text>
                    <p>Das passende Konto hängt vor allem an deiner Rechtsform und daran, ob du Bargeld einzahlst.</p>
                  </Text>
                  <Tabelle
                    kopf={[{ titel: "Wenn du …" }, { titel: "Nimm", text: true }, { titel: "Kontoführung", rechts: true }]}
                    zeilen={WAS_PASST.filter((z) => z.a).map(({ wenn, a }) => ({
                      schluessel: `wenn-${a!.id}`,
                      name: wenn,
                      zellen: [
                        a!.link ? (
                          <a key="nimm" href={a!.link} rel="sponsored nofollow" className="font-semibold text-primary underline underline-offset-[3px] hover:text-primary/80">
                            {name(a!)}*
                          </a>
                        ) : (
                          <Link key="nimm" to={VERGLEICH} className="font-semibold text-primary underline underline-offset-[3px] hover:text-primary/80">
                            {name(a!)}
                          </Link>
                        ),
                        w(a!, "kontofuehrung"),
                      ],
                    }))}
                    wischen
                  />
                  <Text>
                    <p>
                      Willst du ein Konto bei der KT Bank und hast eine Filiale in der Nähe, schau dir <a href="#kt-bank" className="font-medium text-primary underline underline-offset-2 hover:no-underline">ihr Geschäftskonto</a> an. Alle {ANZAHL} Konten mit Filter nach
                      Rechtsform findest du im <TL to={VERGLEICH}>Geschäftskonto-Vergleich</TL>.
                    </p>
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
                      Du weißt jetzt, worauf es ankommt: keine Zinsen auf dem Guthaben, kein Dispo ab Start, eine Debitkarte. Bei {OHNE_ZINSEN} von{" "}
                      {ANZAHL} Konten schreibt der Anbieter, dass das Konto ohne Zinsen läuft. Such dir das Konto für deine Rechtsform aus und eröffne
                      es online. Alle Konten mit Filter findest du im <TL to={VERGLEICH}>Geschäftskonto-Vergleich</TL>.
                    </p>
                  </Text>
                </section>

                <AnbieterKasten titel="Geschäftskonten für Muslime ohne Zinsen" anbieter={DREIER} />

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
                    * Werbung: Eröffnest du über meinen Link ein Konto, bekomme ich eine Provision, ohne Mehrkosten für dich.
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

export default GeschaeftskontoFuerMuslime;
