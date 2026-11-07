import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ChevronDown } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Seo from "@/components/Seo";
import eliasPortrait from "@/assets/elias-autor.webp";
import { kursStand } from "@/lib/kurse";
import { PLATZ1, polster, zahlAus } from "@/lib/polster";
import { etfListe, etfsBei } from "@/data/halalEtfListe";
import { BBBANK_PRAEMIE, BONUS_KONTEN } from "@/data/girokontoBonus";
import { girokontoAnzeige } from "@/data/vergleichAnzeige";
import { konsumzins } from "@/data/rechnerQuellen";
import {
  AnbieterKasten,
  BIO,
  Etikett,
  euro,
  GoogleKasten,
  H2,
  INSTAGRAM,
  Karte,
  KartenReihe,
  Kernsatz,
  LINKEDIN,
  LINKEDIN_FIRMA,
  Marke,
  Person,
  Pfeil,
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

/**
 * „Halal Kredit ohne Zinsen“, neu gebaut in SEO70 (07.11.2026) im Aufbau von /blog/sind-versicherungen-haram über den Skill
 * seo-beitrag (Karte im Vault fundament/research/quellen/SEO-GUIDE-Z2aCQ5YKaTU/beitraege/halal-kredit.seo.json). Jede Halal-Aussage aus
 * ~/hourani/positionen/ (riba, autofinanzierung, immobilienfinanzierung, kreditkarte-debitkarte), auf der Seite ohne Namen; Fundstellen in
 * beitraege/halal-kredit-hourani-belege.md, Begleitdatei docs/blog/pruefer-seo70/halal-kredit.txt.belege.md.
 * Title, H1 und Adresse tragen die meistgesuchte Schreibweise „halal kredit“ (Ahrefs 07.11.2026, J7); /blog/halal-kredit-ohne-zinsen leitet hierher.
 * Elias' Leserregel „Wir brauchen doch gar keine Kredite“: der Beitrag führt vom Kredit zum Sparen und zum Girokonto ohne Zinsen.
 */

const PFAD = "/blog/halal-kredit";
const TITEL = "Halal Kredit: Der komplette Guide 2026";
const SEO_TITEL = TITEL;
const META =
  "Halal Kredit ohne Zinsen: Ein Bankkredit ist haram, auch mit 0 %. Was erlaubt ist, was es in Deutschland gibt und was Sparen statt Kredit bringt, mit Rechner.";
const VEROEFFENTLICHT = { text: "16.08.2026", iso: "2026-08-16T09:00:00+02:00" };
const AKTUALISIERT = { text: "07.11.2026", iso: "2026-11-07T09:00:00+01:00" };
const LESEZEIT = 9;
const RECHTSHINWEIS =
  "Dieser Beitrag ist keine Fatwa und keine Kredit- oder Anlageberatung. Ob bei dir eine Notlage vorliegt, klärst du mit einem Gelehrten. Vergangene Kursentwicklung ist kein Versprechen für die Zukunft.";

type Abschnitt = { id: string; titel: string; leiste?: boolean; kurz?: string };
const ABSCHNITTE: Abschnitt[] = [
  { id: "kurzer-vergleich", titel: "Halal Kredit ohne Zinsen: 7 Wege", leiste: true, kurz: "7 Wege" },
  { id: "das-wichtigste", titel: "Das Wichtigste", leiste: true },
  { id: "uebersicht", titel: "Kredit, 0 % oder Raten: Die Übersicht", leiste: true, kurz: "Die Übersicht" },
  { id: "warum", titel: "Warum ist Kredit haram?", leiste: true, kurz: "Warum haram" },
  { id: "null-prozent", titel: "Ist eine 0-Prozent-Finanzierung halal?", leiste: true, kurz: "0-Prozent-Finanzierung" },
  { id: "kredit-ohne-zinsen", titel: "Ist ein Kredit ohne Zinsen halal?", leiste: true, kurz: "Kredit ohne Zinsen" },
  { id: "ratenkauf", titel: "Ratenkauf: Der erlaubte Weg", leiste: true, kurz: "Ratenkauf" },
  { id: "rechner", titel: "Kredit oder Sparplan: Was kostet dich das?", leiste: true, kurz: "Rechner: Kredit oder Sparplan" },
  { id: "sparen", titel: "Erst sparen, dann kaufen", leiste: true, kurz: "Erst sparen" },
  { id: "murabaha", titel: "Was ist Murabaha?", leiste: true, kurz: "Murabaha" },
  { id: "islamische-bank", titel: "Islamische Bank: Kredit oder Kauf?", leiste: true, kurz: "Islamische Bank" },
  { id: "deutschland", titel: "Halal Kredit Deutschland: Was gibt es hier?", leiste: true, kurz: "Was es in Deutschland gibt" },
  { id: "notlage", titel: "Darf ich in einer Notlage einen Kredit nehmen?", leiste: true, kurz: "Ausnahme Notlage" },
  { id: "schon-kredit", titel: "Ich habe schon einen Kredit. Was jetzt?", leiste: true, kurz: "Schon einen Kredit" },
  { id: "haeufige-fragen", titel: "Häufige Fragen", leiste: true },
  { id: "naechster-schritt", titel: "Dein nächster Schritt: ein Konto ohne Zinsen" },
];
const titelVon = (id: string) => ABSCHNITTE.find((a) => a.id === id)!.titel;
const LEISTE = ABSCHNITTE.filter((a) => a.leiste);
const Ueber = ({ id }: { id: string }) => <H2 id={id}>{titelVon(id)}</H2>;

/* ------------------------------------------------------------------ */
/* Daten                                                               */
/* ------------------------------------------------------------------ */

type Ton = "gruen" | "gelb" | "rot";

/** Sieben Wege zu Auto, Möbeln oder Wohnung; `unter` ist die zweite Zeile der Tabelle unter Das Wichtigste. */
const WEGE: { weg: string; unter: string; marke: string; ton: Ton; besonders: string; warum: string; tun: string; ziel: string }[] = [
  {
    weg: "Kredit von der Bank",
    unter: "über die Bank",
    marke: "haram",
    ton: "rot",
    besonders: "Geld heute, mehr Geld später",
    warum: "Die Bank bekommt mehr zurück, als sie dir gegeben hat",
    tun: "Nicht unterschreiben, erst sparen",
    ziel: "warum",
  },
  {
    weg: "0-Prozent-Finanzierung",
    unter: "über die Bank",
    marke: "haram",
    ton: "rot",
    besonders: "Beim Autohaus, mit Bank im Hintergrund",
    warum: "Sobald eine Bank dazwischen ist, bleibt es Zins",
    tun: "Nach dem Ratenpreis ohne Bank fragen",
    ziel: "null-prozent",
  },
  {
    weg: "Kreditkarte in Raten",
    unter: "über die Bank",
    marke: "haram",
    ton: "rot",
    besonders: "Teilzahlung statt voller Abrechnung",
    warum: "Fürs Aufschieben verlangt die Bank Zinsen",
    tun: "Mit Debitkarte zahlen, sie bucht sofort ab",
    ziel: "kreditkarte",
  },
  {
    weg: "Ratenkauf beim Händler",
    unter: "ohne Bank",
    marke: "erlaubt",
    ton: "gruen",
    besonders: "Fester Preis vor der Unterschrift",
    warum: "Ein Kauf zwischen zwei Personen, kein Darlehen",
    tun: "Preis vorher festmachen",
    ziel: "ratenkauf",
  },
  {
    weg: "Kauf über die Bank (Murabaha)",
    unter: "Bank als Verkäuferin",
    marke: "je nach Vertrag",
    ton: "gelb",
    besonders: "Bank kauft und verkauft dir weiter",
    warum: "Nur erlaubt, wenn die Bank wirklich Eigentümerin ist",
    tun: "Nach dem Zertifikat fragen",
    ziel: "murabaha",
  },
  {
    weg: "Geld von Familie oder Freunden",
    unter: "ohne Bank",
    marke: "ohne Aufschlag kein Zins",
    ton: "gruen",
    besonders: "Zurück kommt genau der Betrag",
    warum: "So wie gegeben, so bekommen",
    tun: "Kein Geschenk, bis alles zurück ist",
    ziel: "kredit-ohne-zinsen",
  },
  {
    weg: "Erst sparen, dann kaufen",
    unter: "ohne Vertrag",
    marke: "ohne Zins",
    ton: "gruen",
    besonders: "Dauert länger, kostet keine Zinsen",
    warum: "Kein Zins, und alles gehört dir",
    tun: "Sparplan und Girokonto ohne Zinsen",
    ziel: "rechner",
  },
];

const DREIER = [
  { name: "Traders Place", logo: "/bilder/blog/halal-etf/logos/traders-place-wortmarke.svg", out: "/out/traders-place" },
  { name: "Smartbroker+", logo: "/bilder/blog/halal-etf/logos/smartbroker.webp", out: "/out/smartbroker" },
  { name: "Scalable Capital", logo: "/bilder/blog/halal-etf/logos/scalable.webp", out: "/out/scalable" },
];
// Sparplan auf Platz 1 wie im Versicherungs-Beitrag: Smartbroker+ und Scalable aus sparplanBei der Liste, Traders Place nach Elias' eigenem Depot.
const sparplanPlatz1 = (name: string) => name === "Traders Place" || PLATZ1.sparplanBei.some((s) => s.startsWith(name.split(" ")[0]));
const ANBIETER = DREIER.map((d) => ({
  ...d,
  zeilen: [
    sparplanPlatz1(d.name) ? `Sparplan auf ${PLATZ1.name}` : `Sparplan auf ${PLATZ1.name} noch nicht nachgesehen`,
    `Halal ETFs aus unserer Liste: ${etfsBei(d.name)} von ${etfListe.length}`,
    d.name === "Smartbroker+" ? "Zinsen nur auf eigenem Zinskonto" : "Zinsen aufs Guthaben: 0 %",
  ],
}));

/** Girokonten wie im Versicherungs-Beitrag (Elias SEO63): BBBank mit Startprämie, norisbank, Halal-Zeilen aus dem Girokonto-Vergleich. */
const GIROS = BONUS_KONTEN.filter((k) => k.id !== "consorsbank-girokonto").map((k) => {
  const w = (girokontoAnzeige.find((a) => a.id === k.id)?.werte ?? {}) as Record<string, unknown>;
  return {
    name: k.name,
    domain: k.domain,
    out: `/out/${k.out}`,
    hinweis: k.id === "bbbank-bettersmart" ? `${BBBANK_PRAEMIE.betrag} € Startprämie` : undefined,
    zeilen: [
      ...(w.zinsfreiAbStart === "gut" ? ["Guthaben ohne Zinsen"] : []),
      ...(w.keinDispoAbStart === "gut" ? ["Kein Dispo ab Start"] : []),
      ...(w.karteOhneKredit === "gut" ? ["Karte ohne Kredit"] : []),
      `Kontoführung 0 € mit Geldeingang oder unter ${k.gratisUnter} Jahren`,
      "Tagesgeld dabei: leer lassen",
      "Nie ins Minus: das kostet Zinsen",
    ],
  };
});

const WICHTIGSTES: { lead: string; text: ReactNode }[] = [
  {
    lead: "Zinsen sind haram, darüber sind sich die Gelehrten einig.",
    text: "Jeder Kredit, der dem Geldgeber mehr zurückbringt, ist Zins, auch wenn es nur ein Cent ist.",
  },
  { lead: "0 % ändert nichts.", text: "Sobald eine Bank dazwischen ist, bleibt es haram, egal was auf dem Schild steht." },
  { lead: "Erlaubt ist der Ratenkauf ohne Bank.", text: "Du kaufst direkt beim Verkäufer, und der Preis steht vor der Unterschrift fest." },
  {
    lead: "2025 kannten Gelehrte in Deutschland kein geprüftes Angebot.",
    text: "Weder für das Auto noch für das Haus. Frag bei jedem Anbieter nach dem Zertifikat einer anerkannten Stelle.",
  },
  { lead: "Sparen kostet keinen Zins.", text: "Was du sonst an Zinsen zahlst, bleibt bei dir. Der Rechner weiter unten zeigt, was daraus werden kann." },
];

const FRAGEN: { frage: string; antwort: string; id?: string }[] = [
  {
    frage: "Gibt es einen halal Kredit?",
    antwort:
      "Nicht von einer Bank, die mit Zinsen arbeitet. Erlaubt sind der Ratenkauf beim Verkäufer und ein Kauf über die Bank, wenn sie wirklich Eigentümerin wird und der Vertrag sonst stimmt. Am einfachsten: erst sparen, dann bar kaufen.",
  },
  {
    frage: "Wann steckt kein Zins im Kredit?",
    antwort:
      "Wenn du genau den Betrag zurückzahlst, den du bekommen hast. Bekommt der Geldgeber mehr zurück, ist es Zins. So etwas findest du unter Menschen, nicht bei einer Bank.",
  },
  {
    frage: "Ist ein Kredit halal, wenn er von einer islamischen Bank kommt?",
    antwort:
      "Nicht, wenn sie dir Geld gegen mehr Geld leiht. Auch eine Bank, die sich islamisch nennt, darf das nicht. Möglich ist ein Kauf mit offenem Aufschlag wie bei Murabaha, wenn die Bank wirklich Eigentümerin wird und für Mängel haftet.",
  },
  {
    frage: "Welche Bank gibt Kredit ohne Zinsen?",
    antwort:
      "2025 kannten Gelehrte in Deutschland keine Bank, die ein Auto oder ein Haus halal finanziert. Eine 0-Prozent-Finanzierung über eine Bank bleibt haram.",
  },
  {
    frage: "Halal Kredit Auto: Wie kaufe ich ein Auto ohne Zinsen?",
    antwort:
      "Spar die Rate vorher an und kauf bar, oder kauf direkt beim Händler in Raten zu einem festen Preis. Ein Autokredit über die Bank des Herstellers oder eine andere Bank ist haram.",
  },
  {
    frage: "Halal Kredit Haus: Gibt es eine halal Baufinanzierung?",
    antwort:
      "Bei Banken in Deutschland gab es im September 2025 keine. Möglich sind ein Ratenkauf vom Eigentümer oder ein gemeinsamer Kauf mit einem Partner, bei dem du Anteil für Anteil übernimmst.",
  },
  {
    frage: "Ist Ratenzahlung haram?",
    antwort:
      "Nicht, wenn du direkt beim Verkäufer kaufst und der Preis vor der Unterschrift feststeht. Steckt eine Bank dahinter, ist es ein Kredit und haram.",
  },
  {
    frage: "Ist die Kreditkarte haram?",
    id: "kreditkarte",
    antwort:
      "Zahlst du mit der Kreditkarte in Raten, verlangt die Bank Zinsen, und das ist haram. Gelehrte sehen die Karte selbst unterschiedlich: Nach der strengeren Meinung ist sie haram, die andere lässt sie nur bei echter Dringlichkeit zu. Die Debitkarte bucht sofort von deinem Konto ab und reicht fast immer.",
  },
  {
    frage: "Darf ich Geld von meiner Familie leihen?",
    antwort:
      "Wenn du genau den Betrag zurückgibst, steckt kein Zins drin. Bis alles zurückgezahlt ist, nimmt der Geldgeber kein Geschenk von dir an. Wer sicher sein will, fragt einen Gelehrten.",
  },
  {
    frage: "Was ist Murabaha?",
    antwort:
      "Die Bank kauft die Sache selbst und verkauft sie dir mit einem offenen Aufschlag in Raten weiter. Erlaubt ist das nur, wenn sie wirklich Eigentümerin wird und für Mängel haftet.",
  },
];

const PASST_DAZU: { to: string; name: string; text: string }[] = [
  { to: "/blog/haus-kaufen-ohne-zinsen", name: "Haus kaufen ohne Zinsen", text: "Der größte Kauf im Leben, ohne Zinskredit." },
  { to: "/blog/ratenzahlung-haram", name: "Ist Ratenzahlung haram?", text: "Der Ratenkauf beim Händler im Einzelnen." },
  { to: "/blog/auto-kaufen-ohne-zinsen", name: "Auto kaufen ohne Zinsen", text: "Vom Ansparen bis zum Kaufvertrag." },
  { to: "/blog/zinsen-im-islam", name: "Zinsen im Islam", text: "Warum Geld gegen mehr Geld verboten ist." },
  { to: "/blog/kreditkarte-halal", name: "Kreditkarte oder Debitkarte", text: "Was gilt islamisch, und was reicht im Alltag." },
];

const VIDEO = { id: "rtiipeOk5zw", titel: "Der Schnellste Weg als Muslim raus aus Schulden zu Kommen", hochgeladen: "2026-05-11" };
const VIDEO_BILD = "/bilder/blog/halal-kredit/video-schulden-vorschau.jpg";

/* ------------------------------------------------------------------ */
/* Rechnung                                                            */
/* ------------------------------------------------------------------ */

/** Monatsrate eines Kredits zum Effektivzins: Monatszins aus (1 + Jahreszins)^(1/12), Annuität wie im Kreditkostenrechner. */
const kreditRate = (betrag: number, zinsProzent: number, monate: number) => {
  const i = Math.pow(1 + zinsProzent / 100, 1 / 12) - 1;
  return i === 0 ? betrag / monate : (betrag * i) / (1 - Math.pow(1 + i, -monate));
};

/** Beispiel im Bild: 10.000 € über 5 Jahre zum Durchschnittszins der Bundesbank, dieselbe Rechnung wie im Rechner. */
const BEISPIEL = { betrag: 10_000, monate: 60 };
const BEISPIEL_ZURUECK = kreditRate(BEISPIEL.betrag, konsumzins.prozent, BEISPIEL.monate) * BEISPIEL.monate;

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
        image: `${SITE}/og/blog--halal-kredit.jpg`,
        video: { "@id": `${url}#video` },
      },
      {
        "@type": "VideoObject",
        "@id": `${url}#video`,
        name: VIDEO.titel,
        description: "Elias zeigt, wie du als Muslim aus Schulden herauskommst.",
        thumbnailUrl: `${SITE}${VIDEO_BILD}`,
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
/* Grafik im Stil des Versicherungs-Beitrags (Elias SEO57: schwarz-weiß, gestrichelt, frei stehend) */
/* ------------------------------------------------------------------ */

const ROT = "hsl(var(--loss))";

/** Die Bank gibt 10.000 €, zurück gehen mehr: das Mehr ist der Zins, rot markiert. */
const Geldbild = () => (
  <figure className="mt-7 max-w-[460px]">
    <svg
      viewBox="0 0 360 114"
      className="h-auto w-full text-foreground"
      role="img"
      aria-label={`Kredit: Die Bank gibt dir heute ${euro(BEISPIEL.betrag)}. Zurück zahlst du in fünf Jahren ${euro(BEISPIEL_ZURUECK)}. Das Mehr ist der Zins.`}
    >
      <Person x={44} />
      <Person x={316} />
      <text x={44} y={98} textAnchor="middle" className="fill-foreground text-[14px] font-semibold">Bank</text>
      <text x={316} y={98} textAnchor="middle" className="fill-foreground text-[14px] font-semibold">Du</text>
      <text x={180} y={21} textAnchor="middle" className="fill-muted-foreground text-[14px]">{euro(BEISPIEL.betrag)} heute</text>
      <Pfeil von={72} bis={288} y={30} />
      <g stroke={ROT} strokeWidth={1.4} fill="none">
        <line x1={288} y1={60} x2={72} y2={60} strokeDasharray="4 3" />
        <path d="M79 55.5 L72 60 L79 64.5" />
      </g>
      <text x={180} y={80} textAnchor="middle" className="text-[14px]" fill={ROT}>{euro(BEISPIEL_ZURUECK)} in 5 Jahren</text>
    </svg>
    <figcaption className="mt-2 text-[14px] leading-snug">
      <span className="block font-semibold text-loss">{euro(BEISPIEL_ZURUECK - BEISPIEL.betrag)} mehr: das ist der Zins</span>
      <span className="block text-muted-foreground">bei {konsumzins.prozent.toLocaleString("de-DE")} % im Jahr, dem Durchschnitt der Bundesbank für Privatkredite</span>
    </figcaption>
  </figure>
);

/* ------------------------------------------------------------------ */
/* Rechner „Kredit oder Sparplan“ (Karte, Kopfkarte eigenes_stueck)    */
/* ------------------------------------------------------------------ */

const LAUFZEITEN = [12, 36, 60];
/** Eingabe ohne Kappung, damit eine gekappte Zahl beim Verlassen des Feldes sichtbar zurückgeschrieben wird. */
const roh = (t: string) => Number(t.replace(/\./g, "").replace(",", ".")) || 0;

const Rechner = () => {
  const [betragText, setBetragText] = useState("10000");
  const [zinsText, setZinsText] = useState(konsumzins.prozent.toLocaleString("de-DE"));
  const [monate, setMonate] = useState(60);
  const betrag = zahlAus(betragText);
  const zins = Math.min(zahlAus(zinsText), 30);
  const rate = betrag ? kreditRate(betrag, zins, monate) : 0;
  const zurueck = rate * monate;
  const erg = polster(rate, monate);
  const schalter = (an: boolean) =>
    `min-h-[44px] flex-1 px-3 py-2.5 text-[15px] font-semibold transition-colors ${an ? "bg-foreground text-background" : "bg-background text-foreground hover:bg-muted"}`;
  const farbe = erg && erg.wert < erg.eingezahlt ? "loss" : "gain";
  const feld = "mt-1.5 flex items-center border border-border bg-background focus-within:border-foreground";
  const eingabe = "w-full bg-transparent px-3 py-2.5 text-[16px] tabular-nums text-foreground outline-none";
  return (
    <section className="mt-12">
      <Ueber id="rechner" />
      <Text>
        <p>
          Gib den Preis ein. Links steht, was ein Kredit zum Durchschnittszins kostet. Rechts, was dieselbe Rate als Sparplan in {PLATZ1.name} gebracht
          hätte.
        </p>
        <p>Das ist ein zertifizierter Halal ETF, also ein Fonds, der viele Firmen auf einmal kauft.</p>
      </Text>
      <div className="mt-5 border border-border bg-card p-4 md:p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="kredit-betrag" className="block">
              <Etikett>Preis</Etikett>
            </label>
            <div className={feld}>
              <input
                id="kredit-betrag"
                inputMode="decimal"
                placeholder="10.000"
                value={betragText}
                onChange={(x) => setBetragText(x.target.value.replace(/[^\d.,]/g, ""))}
                onBlur={() => roh(betragText) > 100_000 && setBetragText("100000")}
                className={eingabe}
              />
              <span className="pr-3 text-[16px] text-muted-foreground">€</span>
            </div>
          </div>
          <div>
            <label htmlFor="kredit-zins" className="block">
              <Etikett>Zins im Jahr</Etikett>
            </label>
            <div className={feld}>
              <input
                id="kredit-zins"
                inputMode="decimal"
                value={zinsText}
                onChange={(x) => setZinsText(x.target.value.replace(/[^\d.,]/g, ""))}
                onBlur={() => roh(zinsText) > 30 && setZinsText("30")}
                className={eingabe}
              />
              <span className="pr-3 text-[16px] text-muted-foreground">%</span>
            </div>
          </div>
        </div>
        <Etikett className="mt-4">Laufzeit</Etikett>
        <div className="mt-1.5 flex border border-border" role="group" aria-label="Laufzeit in Jahren">
          {LAUFZEITEN.map((m, i) => (
            <button
              key={m}
              type="button"
              aria-pressed={monate === m}
              onClick={() => setMonate(m)}
              className={`${i ? "border-l border-border " : ""}${schalter(monate === m)}`}
            >
              {m / 12} {m === 12 ? "Jahr" : "Jahre"}
            </button>
          ))}
        </div>

        <p className="mt-5 text-[15px] text-foreground">
          Rate im Monat: <span className="font-semibold tabular-nums">{euro(rate)}</span>
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2" aria-live="polite">
          <div className="min-w-0 border border-border bg-background px-3 py-3 sm:px-4 sm:py-4">
            <Etikett>Kredit</Etikett>
            <p className="mt-1.5 text-[13px] text-muted-foreground sm:text-[14px]">Du zahlst zurück</p>
            <p className="text-[18px] font-semibold tabular-nums text-foreground sm:text-[24px]">{euro(zurueck)}</p>
            <p className="mt-2 text-[13px] text-muted-foreground sm:text-[14px]">Davon Zinsen</p>
            <p className="text-[18px] font-semibold tabular-nums text-loss sm:text-[24px]">{euro(zurueck - betrag)}</p>
            {zins === 0 ? (
              <a href="#null-prozent" className="mt-2 block text-[13px] leading-snug text-foreground underline underline-offset-[3px] hover:text-primary">
                Mit Bank dazwischen bleibt auch 0 % haram.
              </a>
            ) : (
              <p className="mt-2 text-[13px] leading-snug text-muted-foreground">Die Zinsen gehören der Bank.</p>
            )}
          </div>
          <div className="min-w-0 border border-foreground bg-background px-3 py-3 shadow-[inset_0_0_0_1px_hsl(var(--foreground))] sm:px-4 sm:py-4">
            <Etikett>Sparplan</Etikett>
            <p className="mt-1.5 text-[13px] text-muted-foreground sm:text-[14px]">Du zahlst ein</p>
            <p className="text-[18px] font-semibold tabular-nums text-foreground sm:text-[24px]">{euro(zurueck)}</p>
            <p className="mt-2 text-[13px] text-muted-foreground sm:text-[14px]">Wäre heute wert</p>
            <p className={`text-[18px] font-semibold tabular-nums sm:text-[24px] ${farbe === "loss" ? "text-loss" : "text-gain"}`}>{euro(erg ? erg.wert : 0)}</p>
            <p className="mt-2 text-[13px] leading-snug text-muted-foreground">Gehört dir, danach kaufst du bar.</p>
          </div>
        </div>

        {erg && (
          <p className="mt-4 text-[15px] leading-relaxed text-foreground">
            {erg.renditeJahr >= 0
              ? `Der Fonds legte in diesem Zeitraum rund ${(erg.renditeJahr * 100).toLocaleString("de-DE", { maximumFractionDigits: 1 })} % im Jahr zu. Ein ETF schwankt, es kann auch weniger werden.`
              : `Der Fonds verlor in diesem Zeitraum rund ${(-erg.renditeJahr * 100).toLocaleString("de-DE", { maximumFractionDigits: 1 })} % im Jahr. Ein ETF schwankt.`}
          </p>
        )}

        {erg && (
          <div className="mt-5 border border-border bg-background px-2 pb-2 pt-3 sm:px-3">
            <div className="flex flex-wrap gap-x-5 gap-y-1 px-1 text-[13px] text-muted-foreground" aria-hidden>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/70" /> Eingezahlt
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className={`h-2.5 w-2.5 rounded-full ${farbe === "gain" ? "bg-gain" : "bg-loss"}`} /> Wert im Depot
              </span>
            </div>
            <div className="mt-2 h-[180px] sm:h-[220px]" role="img" aria-label={`Eingezahlt ${euro(erg.eingezahlt)}, heute wert ${euro(erg.wert)}`}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={erg.kurve.map((p) => ({ ...p, wert: Math.round(p.wert) }))} margin={{ top: 6, right: 8, bottom: 0, left: 0 }}>
                  <CartesianGrid stroke="hsl(var(--border))" vertical={false} />
                  <XAxis
                    dataKey="x"
                    ticks={erg.kurve.filter((d) => d.x.endsWith("-01")).map((d) => d.x)}
                    interval={0}
                    tickFormatter={(x: string) => x.slice(0, 4)}
                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    width={56}
                    tickFormatter={(v: number) => Math.round(v).toLocaleString("de-DE")}
                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={false}
                    tickLine={false}
                    domain={[0, "auto"]}
                  />
                  <Tooltip formatter={(v: number, n: string) => [euro(v), n === "wert" ? "Wert im Depot" : "Eingezahlt"]} contentStyle={{ fontSize: 13, borderRadius: 4 }} />
                  <Area type="monotone" dataKey="eingezahlt" stroke="hsl(var(--muted-foreground))" fill="hsl(var(--muted))" strokeWidth={1.5} isAnimationActive={false} />
                  <Area type="monotone" dataKey="wert" stroke={`hsl(var(--${farbe}))`} fill={`hsl(var(--${farbe}-soft))`} fillOpacity={0.7} strokeWidth={2} isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        <p className="mt-4 text-[14px] leading-relaxed text-muted-foreground">
          Zins vorab: Durchschnitt der Bundesbank für Privatkredite, {konsumzins.monat}. Monatskurse bis {kursStand}, ohne Depotkosten.
        </p>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Seite                                                               */
/* ------------------------------------------------------------------ */

const Fett = ({ children }: { children: ReactNode }) => <strong className="font-semibold text-foreground">{children}</strong>;

/** Ein Sprung auf eine Frage klappt sie auf, sonst landet der Leser bei einer geschlossenen Antwort (Seiten-Prüfer SEO70, S5). */
const oeffne = (id: string) => {
  const d = document.getElementById(id);
  if (d instanceof HTMLDetailsElement) d.open = true;
};

const HalalKreditOhneZinsen = () => {
  const [offen, setOffen] = useState(false);
  const ids = useMemo(() => LEISTE.map((a) => a.id), []);
  const aktiv = useAktiv(ids);
  useEffect(() => {
    if (window.location.hash) oeffne(window.location.hash.slice(1));
  }, []);

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
      <Seo title={SEO_TITEL} description={META} path={PFAD} jsonLd={graph()} />
      <div className="container py-8 md:py-12">
        <div className="mx-auto max-w-[720px] xl:grid xl:max-w-[1048px] xl:grid-cols-[280px_minmax(0,720px)] xl:gap-12">
          <Seitenleiste
            inhalt={inhalt}
            etikett="Sparen statt Kredit"
            titel="Ein Konto ohne Dispo und Zinsen?"
            text="Ein Girokonto ohne Zinsen ist der erste Schritt zum Sparen. Im Vergleich siehst du, welches passt."
            ziel="/vergleich/girokonto"
            knopf="Girokonto finden"
          />

          <div className="min-w-0">
            <nav aria-label="Brotkrumen" className="flex flex-wrap items-center gap-2 font-mono text-[12px] uppercase tracking-[0.12em] text-muted-foreground">
              <Link to="/blog" className="text-primary hover:underline">
                Blog
              </Link>
              <span aria-hidden>/</span>
              <span>Halal Kredit</span>
            </nav>

            <article className="mt-8">
              {/* Kopf wie frontal.so/blog/best-gtm-agencies (Elias SEO63), gleich gebaut wie /blog/sind-versicherungen-haram */}
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
                <KartenReihe etikett="Kurzer Vergleich" titel={titelVon("kurzer-vergleich")} anzahl={WEGE.length}>
                  {WEGE.map((a, i) => (
                    <Karte key={a.weg} nummer={i + 1} kopf={a.weg} erste={i === 0}>
                      <Marke ton={a.ton}>{a.marke}</Marke>
                      <Etikett className="mt-4">Besonders</Etikett>
                      <p className="font-titel mt-1.5 min-h-[2.4em] text-[19px] leading-[1.2] text-foreground">{a.besonders}</p>
                      <Etikett className="mt-4">Warum</Etikett>
                      <p className="mt-1 text-[15px] leading-snug text-foreground">{a.warum}</p>
                      <Etikett className="mt-3">Was tun</Etikett>
                      <p className="mt-1 text-[15px] font-semibold leading-snug text-foreground">{a.tun}</p>
                      <a
                        href={`#${a.ziel}`}
                        onClick={() => oeffne(a.ziel)}
                        className="mb-4 mt-5 flex min-h-[44px] items-center justify-center gap-1.5 border border-border bg-muted/60 py-2.5 font-mono text-[12px] uppercase tracking-[0.12em] text-foreground transition-colors hover:border-foreground sm:mt-auto"
                      >
                        Zum Abschnitt
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
                    Das Auto ist kaputt, die Hochzeit steht an, oder die Familie braucht eine größere Wohnung. Die Bank bietet dir einen Kredit an, das
                    Autohaus sogar 0 %. Du suchst einen halal Kredit ohne Zinsen, den du als Muslim unterschreiben darfst.
                  </p>
                  <p>
                    Kurz gesagt: Einen Kredit von der Bank gibt es nicht halal, auch nicht mit 0 %. Erlaubt ist der Kauf in Raten direkt beim Verkäufer.
                    Und am meisten bleibt dir, wenn du erst sparst und dann kaufst.
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
                  <Ueber id="uebersicht" />
                  <Text>
                    <p>Entscheidend ist eine Frage: Bekommt jemand mehr Geld zurück, als er dir gegeben hat? Dann ist es Zins.</p>
                  </Text>
                  <Tabelle
                    kopf={[{ titel: "Weg" }, { titel: "Einordnung", eng: true }]}
                    zeilen={WEGE.map((a) => ({
                      schluessel: a.weg,
                      name: <a href={`#${a.ziel}`} onClick={() => oeffne(a.ziel)} className="underline decoration-border underline-offset-[3px] hover:text-primary">{a.weg}</a>,
                      unter: a.unter,
                      zellen: [<Marke key="m" ton={a.ton}>{a.marke}</Marke>],
                    }))}
                  />
                </section>

                {/* Google-Kasten nach der Übersicht, die erste Werbung folgt nach dem nächsten Abschnitt (Elias SEO55, SEO67) */}
                <GoogleKasten />

                <section className="mt-14">
                  <Ueber id="warum" />
                  <Text>
                    <p>Bei einem Kredit gibt dir die Bank Geld und bekommt mehr Geld zurück. Dieses Mehr ist Zins. Ein Zinskredit ist ein Riba-Vertrag.</p>
                  </Text>
                  <Geldbild />
                  <Text>
                    <p>
                      Eine Grenze nach unten gibt es nicht, auch ein Cent ist haram. Und Zinsen sind die einzige Sünde, für die Allah im Koran einen Krieg
                      erklärt.
                    </p>
                  </Text>
                  <Kernsatz>Ein Kredit ist Geld gegen mehr Geld. Daran ändert kein Name etwas.</Kernsatz>
                  <Text>
                    <p>
                      Auch ein Dispo ist ein Kredit: Rutscht dein Konto ins Minus, zahlst du der Bank Zinsen. Darum fängt Sparen bei einem Konto ohne
                      Dispo an.
                    </p>
                  </Text>
                </section>

                {/* Erster Anbieter-Kasten nach dem zweiten Inhaltsblock, zwischen einem Viertel und einem Drittel wie bei Frontal (Elias SEO67); Money Page Girokonto */}
                <AnbieterKasten titel={`Starte mit ${BBBANK_PRAEMIE.betrag} € bei der BBBank`} anbieter={GIROS} />

                <section className="mt-14">
                  <Ueber id="null-prozent" />
                  <Text>
                    <p>
                      Nein. Das Autohaus schreibt 0 % drauf, bezahlt wird aber über eine Bank: Sie überweist dem Händler den Preis, und du zahlst ihr in
                      Raten zurück. Sobald eine Bank dazwischen ist, bleibt es haram.
                    </p>
                    <p>
                      Der Händler kann dafür von der Bank eine Provision bekommen. Ob die Bank ihren Aufschlag als Prozent oder als festen Betrag nimmt,
                      ändert nichts.
                    </p>
                    <p>
                      Auch „Halal Finanzierung“ auf dem Schild sagt allein nichts. Das Wort halal ist in Deutschland nicht geschützt, und ein Händler
                      kann es draufschreiben, obwohl es Zins bleibt.
                    </p>
                  </Text>
                </section>

                <section className="mt-14">
                  <Ueber id="kredit-ohne-zinsen" />
                  <Text>
                    <p>
                      Von einer Bank nicht. Unter Menschen steckt kein Zins drin, wenn genau der Betrag zurückkommt, den du geliehen hast. So wie
                      gegeben, so bekommen.
                    </p>
                    <p>
                      Leihst du dir Geld bei Familie oder Freunden, nimmt der Geldgeber bis zur Rückzahlung kein Geschenk von dir an. Sonst wird aus der
                      Hilfe ein Vorteil für ihn.
                    </p>
                    <p>
                      Ein islamischer Kredit von einer Bank kann darum kein Darlehen sein. Möglich ist ein Kauf. Wie das geht, steht weiter unten bei
                      Murabaha.
                    </p>
                  </Text>
                </section>

                <section className="mt-14">
                  <Ueber id="ratenkauf" />
                  <Text>
                    <p>
                      Kaufst du direkt beim Verkäufer in Raten, ist das ein Kauf zwischen zwei Personen. Er darf dafür einen höheren Preis verlangen als
                      bei Barzahlung.
                    </p>
                    <p>
                      <Fett>Ein Beispiel.</Fett> Das Auto kostet bar 10.000 €, in Raten 12.000 €. Du wählst vor der Unterschrift, danach steht der
                      Preis fest.
                    </p>
                    <p>
                      <Fett>Kein Aufschlag bei Verspätung.</Fett> Zahlst du später, kommt nichts dazu. Eine Gebühr fürs Zuspätkommen wäre Zins.
                    </p>
                    <p>Viele Händler machen das nicht, weil ihnen dann das Geld fehlt. Fragen lohnt sich trotzdem.</p>
                  </Text>
                  <Kernsatz>Ohne Bank ist es Handel. Mit Bank dazwischen wird es haram.</Kernsatz>
                </section>

                <Rechner />

                <section className="mt-14">
                  <Ueber id="sparen" />
                  <Text>
                    <p>
                      Dieser Weg macht am wenigsten Spaß und bringt am meisten. Du brauchst keinen Vertrag, den jemand prüfen muss, und die Zinsen bleiben
                      bei dir.
                    </p>
                    <p>
                      Gibt es keine halale Möglichkeit, verzichten wir lieber, als Zinsen zu nehmen. Das fällt schwer, wenn alle um dich herum finanzieren.
                    </p>
                    <p>
                      Leg jeden Monat die Rate, die du sonst der Bank zahlen würdest, auf ein Girokonto ohne Zinsen oder in einen Sparplan. So bezahlst
                      du später Auto, Hochzeit oder Möbel bar.
                    </p>
                  </Text>
                </section>

                <AnbieterKasten titel="Depots für deine Ersparnisse" anbieter={ANBIETER} />

                <section className="mt-14">
                  <Ueber id="murabaha" />
                  <Text>
                    <p>
                      Bei Murabaha leiht dir die Bank kein Geld, sie kauft die Sache selbst. Danach verkauft sie dir das Auto mit einem Aufschlag, den du
                      kennst, und du zahlst in Raten.
                    </p>
                    <p>
                      <Fett>Die Bank wird Eigentümerin.</Fett> Sie kauft das Auto ganz, bevor sie es dir verkauft.
                    </p>
                    <p>
                      <Fett>Die Bank haftet für Mängel.</Fett> Ist etwas mit dem Auto, gehst du zur Bank und nicht zum Händler.
                    </p>
                    <p>
                      <Fett>Die Schuld wächst nicht.</Fett> Zahlst du zu spät, kommt nichts dazu.
                    </p>
                  </Text>
                  <Kernsatz>Der einfachste Test: Wer haftet für einen Mangel? Ist es nicht die Bank, war sie nur Geldgeber.</Kernsatz>
                </section>

                <section className="mt-14">
                  <Ueber id="islamische-bank" />
                  <Text>
                    <p>
                      Auch eine Bank, die sich islamisch nennt, darf dir kein Geld gegen mehr Geld leihen. Möglich ist ein Kauf mit offenem Aufschlag wie
                      bei Murabaha.
                    </p>
                    <p>In Deutschland gibt es eine. Ihre Baufinanzierung war für Gelehrte im September 2025 trotzdem keine halale Lösung.</p>
                  </Text>
                </section>

                <section className="mt-14">
                  <Ueber id="deutschland" />
                  <Text>
                    <p>
                      <Fett>Auto.</Fett> Ende 2025 kannten Gelehrte kein Unternehmen, das Autos halal finanziert. Einen geprüften Halal-Bank-Kredit
                      kannte man also nicht.
                    </p>
                    <p>
                      Manche Anbieter behaupten es. Frag nach dem Zertifikat einer anerkannten Stelle, hinter der vertrauenswürdige Gelehrte stehen, und
                      fehlt es, lass die Finger davon.
                    </p>
                    <p>
                      <Fett>Haus.</Fett> Eine halale Baufinanzierung bei einer Bank gab es im September 2025 nicht. Ein Weg, den Gelehrte beschreiben, ist
                      ein echter gemeinsamer Kauf mit einem Partner, bei dem du Anteil für Anteil übernimmst. Mehr dazu in <TL to="/blog/haus-kaufen-ohne-zinsen">Haus kaufen ohne Zinsen</TL>.
                    </p>
                    <p>
                      <Fett>Miete ist keine Schande.</Fett> Wohnst du dein Leben lang zur Miete, bist du als Muslim deshalb nicht arm dran.
                    </p>
                  </Text>
                </section>

                <section className="mt-14">
                  <Ueber id="notlage" />
                  <Text>
                    <p>
                      Der Kredit bleibt haram. Beim Haus kennen Gelehrte eine Ausnahme für echte Not, etwa für eine Familie, der die Wohnung gekündigt
                      wurde und die keine neue findet. Ob du in einer bist, entscheidet ein Gelehrter. Darüber sind Gelehrte nicht einig.
                    </p>
                    <p>Du gehst zu einem Gelehrten, der sich damit auskennt, und schilderst ihm alles.</p>
                    <p>Ein Wunsch reicht nicht: „Ich hätte gern ein Haus“ ist keine Notlage. Im bekannten Fall war die Auflage: so schnell wie möglich abzahlen.</p>
                  </Text>
                  <Kernsatz>Die Ausnahme macht den Zins nicht halal. Sie ist ein Notausgang für den Einzelfall.</Kernsatz>
                </section>

                <section className="mt-14">
                  <Ueber id="schon-kredit" />
                  <Text>
                    <p>
                      Nimm keinen neuen dazu, und sprich mit einem Gelehrten über deinen Weg raus. Jeder Euro, den du früher zurückzahlst, spart dir
                      Zinsen. Was dich dein Kredit kostet, rechnet der <TL to="/kreditkostenrechner">Kreditkostenrechner</TL> aus.
                    </p>
                    <p>Wie du aus Schulden rauskommst, zeige ich dir im Video.</p>
                  </Text>
                  <Video id={VIDEO.id} titel={VIDEO.titel} bild={VIDEO_BILD} />
                </section>

                <section className="mt-12">
                  <Ueber id="haeufige-fragen" />
                  <div className="mt-4 max-w-[664px] border-b border-border">
                    {FRAGEN.map((f, i) => (
                      <details key={f.frage} id={f.id} open={i === 0} className="group scroll-mt-24 border-t border-border">
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
                      Leg die Rate, die du sonst der Bank zahlen würdest, auf ein Girokonto ohne Dispo und ohne Zinsen. So kommt das Geld für Auto oder
                      Hochzeit zusammen, und du schuldest niemandem etwas. Welches Konto zu dir passt, siehst du im{" "}
                      <TL to="/vergleich/girokonto">Girokonto-Vergleich</TL>.
                    </p>
                  </Text>
                </section>

                <AnbieterKasten titel="Girokonten ohne Zinsen" anbieter={GIROS} />

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
                    * Werbung: Eröffnest du über meinen Link ein Depot oder Konto, bekomme ich eine Provision, ohne Mehrkosten für dich.
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

export default HalalKreditOhneZinsen;
