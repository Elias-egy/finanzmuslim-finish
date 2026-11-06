import { useMemo, useState, type ReactNode } from "react";
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
 * „Sind Versicherungen haram?“, neu gebaut in SEO57 (05.11.2026) im Aufbau von /blog/ist-leasing-haram (Station je Beitrag,
 * Vault fundament/research/quellen/SEO-GUIDE-Z2aCQ5YKaTU/beitraege/ist-versicherung-haram.md). Jede Halal-Aussage aus
 * ~/hourani/positionen/versicherungen.md, auf der Seite ohne Namen; Begleitdatei docs/blog/pruefer-seo57/ist-versicherung-haram-seo57.txt.belege.md.
 * Title und H1 beginnen mit der meistgesuchten Frage „sind versicherungen haram“ (Ahrefs 05.11.2026), die Adresse bleibt.
 */

const PFAD = "/blog/ist-versicherung-haram";
/** Elias SEO63: ein Titel mit Hauptbegriff, Jahr und Versprechen wie frontal „Best GTM Agency in 2026: The Buyer's Shortlist“, kein zählender Satz. */
const TITEL = "Sind Versicherungen haram? Der komplette Guide 2026";
/** Title-Tag ohne „| finanzmuslim“: mit Zusatz 66 Zeichen, so 51 und unter 60 (Prüfzeile S052-A07-04). */
const SEO_TITEL = TITEL;
const META =
  "Sind Versicherungen haram? Für die große Mehrheit der Gelehrten ja, Pflicht ist ausgenommen. Was bei Kfz, Leben und Berufsunfähigkeit gilt, mit Rechner.";
const VEROEFFENTLICHT = { text: "15.08.2026", iso: "2026-08-15T09:00:00+02:00" };
const AKTUALISIERT = { text: "06.11.2026", iso: "2026-11-06T09:00:00+01:00" };
const LESEZEIT = 9;
const RECHTSHINWEIS =
  "Dieser Beitrag ist keine Fatwa und keine Versicherungs- oder Anlageberatung. Zu einzelnen Punkten gibt es abweichende Auffassungen, ob bei dir eine Notlage vorliegt, klärst du mit einem Gelehrten. Vergangene Kursentwicklung ist kein Versprechen für die Zukunft.";

/** Elias SEO62: in der Laptop-Leiste kurz „Halal anlegen“, einzeilig wie die anderen Beiträge. */

type Abschnitt = { id: string; titel: string; leiste?: boolean; kurz?: string };
const ABSCHNITTE: Abschnitt[] = [
  /** Überschrift der Karten-Reihe (bausteine KartenReihe, id kurzer-vergleich), darum nur im Inhaltsverzeichnis. Elias SEO63: wie frontal „Quick Compare“ gleich unter dem Kopf. */
  { id: "kurzer-vergleich", titel: "10 Versicherungen auf einen Blick", leiste: true, kurz: "10 Versicherungen" },
  { id: "das-wichtigste", titel: "Das Wichtigste", leiste: true },
  { id: "uebersicht", titel: "Pflicht oder freiwillig? Die Übersicht", leiste: true, kurz: "Pflicht oder freiwillig" },
  { id: "warum", titel: "Warum sind Versicherungen haram?", leiste: true, kurz: "Warum haram" },
  { id: "pflicht", titel: "Welche Versicherungen sind Pflicht und damit ausgenommen?", leiste: true, kurz: "Pflichtversicherungen" },
  { id: "rechner", titel: "Beitrag oder Halal Investments: Was wäre aus deinem Geld geworden?", leiste: true, kurz: "Rechner: Beitrag oder Halal Investments" },
  { id: "notfall", titel: "Wann ist eine freiwillige Versicherung erlaubt?", leiste: true, kurz: "Ausnahme Notlage" },
  { id: "lebensversicherung", titel: "Ist eine Lebensversicherung haram?", leiste: true, kurz: "Lebensversicherung" },
  { id: "berufsunfaehigkeit", titel: "Ist die Berufsunfähigkeitsversicherung haram?", leiste: true, kurz: "Berufsunfähigkeit" },
  { id: "beigabe", titel: "Ist eine Versicherung im Mitgliedsbeitrag erlaubt?", leiste: true, kurz: "Versicherung als Beigabe" },
  { id: "takaful", titel: "Was ist Takaful, und gibt es das in Deutschland?", leiste: true, kurz: "Takaful" },
  { id: "schon-versichert", titel: "Ich habe schon Versicherungen. Was jetzt?", leiste: true, kurz: "Schon versichert" },
  { id: "haeufige-fragen", titel: "Häufige Fragen", leiste: true },
  { id: "naechster-schritt", titel: "Dein nächster Schritt: das passende Depot" },
];
const titelVon = (id: string) => ABSCHNITTE.find((a) => a.id === id)!.titel;
const LEISTE = ABSCHNITTE.filter((a) => a.leiste);
const Ueber = ({ id }: { id: string }) => <H2 id={id}>{titelVon(id)}</H2>;

/* ------------------------------------------------------------------ */
/* Daten                                                               */
/* ------------------------------------------------------------------ */

type Ton = "gruen" | "gelb" | "rot";

/** Zehn Versicherungen, Etiketten nach STATION-BEITRAG.md (SEO48-04). Einordnung wie in den Abschnitten unten. */
/** `pflicht` ist die Spalte der Tabelle unter Das Wichtigste (STATION-BEITRAG Station 8), Wortlaut aus dem Abschnitt „pflicht“. */
const ARTEN: { art: string; pflicht: string; marke: string; ton: Ton; besonders: string; warum: string; tun: string; ziel: string }[] = [
  {
    art: "Kranken- und Pflegeversicherung",
    pflicht: "Pflicht für jeden",
    marke: "Pflicht, ausgenommen",
    ton: "gruen",
    besonders: "Gesetzlich vorgeschrieben",
    warum: "Du hast keine Wahl, der Zwang hebt das Urteil auf",
    tun: "Tarif mit fairem Preis wählen, nicht das teuerste Paket",
    ziel: "pflicht",
  },
  {
    art: "Kfz-Haftpflicht",
    pflicht: "Pflicht mit Auto",
    marke: "Pflicht, ausgenommen",
    ton: "gruen",
    besonders: "Ohne sie fährst du nicht",
    warum: "Für jedes Auto vorgeschrieben",
    tun: "Nur die Pflicht abschließen, Extras weglassen",
    ziel: "pflicht",
  },
  {
    art: "Berufshaftpflicht",
    pflicht: "Pflicht je nach Beruf",
    marke: "Pflicht, ausgenommen",
    ton: "gruen",
    besonders: "Wo dein Beruf sie verlangt",
    warum: "Etwa für Ärzte oder Vermittler von Geldanlagen vorgeschrieben",
    tun: "Nur, was der Beruf verlangt",
    ziel: "pflicht",
  },
  {
    art: "Versicherung im Vereinsbeitrag",
    pflicht: "freiwillig",
    marke: "geht",
    ton: "gruen",
    besonders: "Mieterbund, Gewerkschaft, Paket",
    warum: "Du trittst wegen der Sache bei, nicht wegen der Versicherung",
    tun: "Nicht wegen der Versicherung beitreten",
    ziel: "beigabe",
  },
  {
    art: "Teilkasko",
    pflicht: "freiwillig",
    marke: "je nach Lage",
    ton: "gelb",
    besonders: "Diebstahl, Hagel, Vandalismus",
    warum: "Kann eine Notlage sein, wenn du den Schaden nicht tragen kannst",
    tun: "Mit einem Gelehrten klären",
    ziel: "notfall",
  },
  {
    art: "Vollkasko",
    pflicht: "freiwillig",
    marke: "fällt weg",
    ton: "rot",
    besonders: "Schäden am eigenen Auto",
    warum: "Nie durch eine Notlage gedeckt",
    tun: "Ersparnisse für Reparaturen anlegen",
    ziel: "notfall",
  },
  {
    art: "Private Haftpflicht",
    pflicht: "freiwillig",
    marke: "nur in Notlage",
    ton: "rot",
    besonders: "Freiwillig, der Schaden kann groß sein",
    warum: "Eine Notlage nur, wenn ein Schaden absehbar ist, den du nicht tragen könntest",
    tun: "Mit einem Gelehrten klären",
    ziel: "notfall",
  },
  {
    art: "Berufsunfähigkeit",
    pflicht: "freiwillig",
    marke: "nur in Notlage",
    ton: "rot",
    besonders: "Bringt Maklern die höchste Provision",
    warum: "Freiwillig, und um die Leistung wird oft gestritten",
    tun: "Eigene Ersparnisse aufbauen, Notlage mit einem Gelehrten klären",
    ziel: "berufsunfaehigkeit",
  },
  {
    art: "Lebensversicherung",
    pflicht: "freiwillig",
    marke: "nur in Notlage",
    ton: "rot",
    besonders: "Geld gegen mehr Geld",
    warum: "Beiträge werden verzinst angelegt, zurück kommt mehr Geld",
    tun: "Sparplan auf einen Halal ETF",
    ziel: "lebensversicherung",
  },
  {
    art: "Zahnzusatz, Handy, Rechtsschutz",
    pflicht: "freiwillig",
    marke: "nur in Notlage",
    ton: "rot",
    besonders: "Alles, was du freiwillig dazukaufst",
    warum: "Freiwillig, folgt demselben System, nur in einer Notlage über einen Gelehrten",
    tun: "Ersparnisse statt Police",
    ziel: "warum",
  },
];

const DREIER = [
  { name: "Traders Place", logo: "/bilder/blog/halal-etf/logos/traders-place-wortmarke.svg", out: "/out/traders-place" },
  { name: "Smartbroker+", logo: "/bilder/blog/halal-etf/logos/smartbroker.webp", out: "/out/smartbroker" },
  { name: "Scalable Capital", logo: "/bilder/blog/halal-etf/logos/scalable.webp", out: "/out/scalable" },
];
// Sparplan auf Platz 1 wie im Leasing-Beitrag: Smartbroker+ und Scalable aus sparplanBei der Liste, Traders Place nach Elias' eigenem Depot.
const sparplanPlatz1 = (name: string) => name === "Traders Place" || PLATZ1.sparplanBei.some((s) => s.startsWith(name.split(" ")[0]));
const ANBIETER = DREIER.map((d) => ({
  ...d,
  zeilen: [
    sparplanPlatz1(d.name) ? `Sparplan auf ${PLATZ1.name}` : `Sparplan auf ${PLATZ1.name} noch nicht nachgesehen`,
    `Halal ETFs aus unserer Liste: ${etfsBei(d.name)} von ${etfListe.length}`,
    d.name === "Smartbroker+" ? "Zinsen nur auf eigenem Zinskonto" : "Zinsen aufs Guthaben: 0 %",
  ],
}));

/**
 * Elias SEO63: die Girokonten an die Stelle des Aufrufs „Ein Schutz, der dir gehört“, mit „Starte mit 50 € bei der BBBank“,
 * klein grün die Startprämie, norisbank statt Consorsbank (Vault raw/2026-11-06-elias-seo63-versicherung-wie-frontal-girokonten-50-euro.md).
 * Konten und Prämie aus girokontoBonus.ts, die Halal-Zeilen aus dem Girokonto-Vergleich. Kein Kleingedrucktes (Elias SEO63).
 */
const GIROS = BONUS_KONTEN.filter((k) => k.id !== "consorsbank-girokonto").map((k) => {
  const w = (girokontoAnzeige.find((a) => a.id === k.id)?.werte ?? {}) as Record<string, unknown>;
  return {
    name: k.name,
    domain: k.domain,
    out: `/out/${k.out}`,
    hinweis: k.id === "bbbank-bettersmart" ? `${BBBANK_PRAEMIE.betrag}\u00a0€ Startprämie` : undefined,
    zeilen: [
      ...(w.zinsfreiAbStart === "gut" ? ["Guthaben ohne Zinsen"] : []),
      ...(w.keinDispoAbStart === "gut" ? ["Kein Dispo ab Start"] : []),
      ...(w.karteOhneKredit === "gut" ? ["Karte ohne Kredit"] : []),
      `Kontoführung 0\u00a0€ mit Geldeingang oder unter ${k.gratisUnter} Jahren`,
      // Halal-Prüfer SEO61 r6 MUSS 1: zu beiden Konten gehört ein Tagesgeldkonto (girokontoBonus.ts Beleg zinsen; Elias 05.11.: „Leeres Tagesgeld ist okay“).
      "Tagesgeld dabei: leer lassen",
      // Halal-Prüfer SEO61 r6 SOLLTE 1: Dispo und geduldetes Minus kosten Zinsen.
      "Nie ins Minus: das kostet Zinsen",
    ],
  };
});

const WICHTIGSTES: { lead: string; text: ReactNode }[] = [
  { lead: "Zusammenhalt unterstützt der Islam.", text: "Gegenseitige Hilfe bei Schäden kannten die Menschen schon zur Zeit des Propheten ﷺ." },
  {
    lead: "Die übliche Versicherung ist ein Kauf.",
    text: "Du zahlst Geld für ein Versprechen, das vielleicht nie eingelöst wird. Darum sieht die große Mehrheit der Gelehrten sie als haram.",
  },
  { lead: "Pflicht ist ausgenommen.", text: "Krankenkasse, Kfz-Haftpflicht und vorgeschriebene Berufsversicherungen schließt du ab, weil du keine Wahl hast." },
  { lead: "Freiwillig nur in einer Notlage.", text: "Die Vollkasko ist nie eine, bei der Teilkasko kann es eine sein. Das klärst du mit einem Gelehrten." },
  { lead: "Ersparnisse gehören dir.", text: "Was du sonst als Beitrag zahlst, legst du halal an. Der Rechner weiter unten zeigt, was daraus wird." },
];

const FRAGEN: { frage: string; antwort: string }[] = [
  {
    frage: "Sind alle Versicherungen haram?",
    antwort:
      "Nein. Pflicht ist vom Urteil ausgenommen, eine Versicherung auf Gegenseitigkeit mit richtigem Aufbau ist erlaubt. Freiwillige sieht die große Mehrheit der Gelehrten als haram, außer in einer Notlage.",
  },
  {
    frage: "Warum ist eine Versicherung haram?",
    antwort:
      "Du zahlst sicher und weißt nicht, ob, wann und wie viel zurückkommt. Für die einen Gelehrten ist das Geld gegen mehr Geld, für die anderen ein Vertrag voller Unbekannter, und beide sagen haram.",
  },
  {
    frage: "Ist die Krankenversicherung haram?",
    antwort:
      "Nein. Die Kranken- und Pflegeversicherung ist Pflicht und darum vom Urteil ausgenommen. Zusatztarife wie Zahnzusatz schließt du dagegen freiwillig ab.",
  },
  {
    frage: "Ist die Kfz-Versicherung haram?",
    antwort:
      "Die Kfz-Haftpflicht ist Pflicht und darum ausgenommen. Die Teilkasko kann in einer Notlage erlaubt sein, das klärst du mit einem Gelehrten.",
  },
  {
    frage: "Ist Vollkasko haram?",
    antwort:
      "Die Vollkasko ist freiwillig und nie durch eine Notlage gedeckt. Darum gilt für sie das Urteil über freiwillige Versicherungen ohne Ausnahme.",
  },
  {
    frage: "Ist eine private Haftpflichtversicherung haram?",
    antwort:
      "Sie ist freiwillig. Ist ein Schaden absehbar und könntest du ihn selbst nicht tragen, schildere das einem Gelehrten. Ob es bei dir eine Notlage ist, kann nur er einschätzen.",
  },
  {
    frage: "Ist eine Zahnzusatzversicherung haram?",
    antwort:
      "Sie ist freiwillig und folgt demselben System wie jede freiwillige Versicherung, genau wie Hausrat und Rechtsschutz. Schließt du sie ab, weil eine teure Behandlung schon ansteht, ist es noch problematischer: Du weißt dann, dass du wenig zahlst und viel mehr zurückbekommst.",
  },
  {
    frage: "Ist eine Lebensversicherung haram?",
    antwort:
      "Die kapitalbildende Lebensversicherung ja, denn sie ist Geld gegen mehr Geld. Für dich oder deine Familie vorsorgen kannst du stattdessen mit einem Sparplan auf einen Halal ETF.",
  },
  {
    frage: "Darf ich als Muslim Versicherungen verkaufen?",
    antwort:
      "Nein. Wer Versicherungen verkauft, hilft der Versicherung bei dem Vertrag, das gilt auch für Pflichtversicherungen. Steckst du in dem Beruf, sprich mit einem Gelehrten über deinen Weg raus.",
  },
  {
    frage: "Was ist Takaful?",
    antwort:
      "Eine Versicherung auf Gegenseitigkeit: Alle zahlen in einen gemeinsamen Topf, und wer einen Schaden hat, bekommt daraus etwas. Ein Takaful-Angebot gab es Anfang 2026 in Deutschland nicht.",
  },
  {
    frage: "In meinem Vereinsbeitrag steckt eine Versicherung. Ist das ein Problem?",
    antwort: "Nein, solange du wegen des Vereins beigetreten bist und nicht wegen der Versicherung.",
  },
];

const PASST_DAZU: { to: string; name: string; text: string }[] = [
  { to: "/vorlagen/vertrags-ampel", name: "Halal Vertrags-Check", text: "Weitere Verträge aus dem Alltag auf einen Blick." },
  { to: "/blog/ist-leasing-haram", name: "Ist Leasing haram?", text: "Warum beim Leasing eine Vollkasko verlangt wird." },
  { to: "/blog/gharar", name: "Was ist Gharar?", text: "Der unsichere Vertrag einfach erklärt." },
  { to: "/blog/zinsen-im-islam", name: "Zinsen im Islam", text: "Warum Geld gegen mehr Geld verboten ist." },
];

const VIDEO = { id: "6omtkXGP9tk", titel: "Sind Versicherungen als Muslim erlaubt? (Die einzige Erklärung, die du brauchst)", hochgeladen: "2026-04-13" };

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
        image: `${SITE}/og/blog--ist-versicherung-haram.jpg`,
        video: { "@id": `${url}#video` },
      },
      {
        "@type": "VideoObject",
        "@id": `${url}#video`,
        name: VIDEO.titel,
        description: "Elias erklärt, warum die übliche Versicherung als Kauf gilt, welche Ausnahmen es gibt und was Takaful ist.",
        thumbnailUrl: `${SITE}/bilder/blog/ist-versicherung-haram/video-versicherung-vorschau.webp`,
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
/* Grafiken im Stil der Tausch-Bilder aus dem Leasing-Beitrag (Elias SEO57: schwarz-weiß, gestrichelt, frei stehend) */
/* ------------------------------------------------------------------ */

const ROT = "hsl(var(--loss))";

/** Du zahlst sicher, zurück kommt vielleicht nichts, vielleicht viel: die Unsicherheit und das Mehr an Geld, rot markiert. */
const Wettbild = () => (
  <figure className="mt-7 max-w-[460px]">
    <svg
      viewBox="0 0 360 114"
      className="h-auto w-full text-foreground"
      role="img"
      aria-label="Versicherung: Du zahlst jeden Monat sicher. Zurück kommt vielleicht nichts, vielleicht viel mehr. Was zurückkommt, weiß beim Abschluss keiner."
    >
      <Person x={44} />
      <Person x={316} />
      <text x={44} y={98} textAnchor="middle" className="fill-foreground text-[14px] font-semibold">Du</text>
      <text x={312} y={98} textAnchor="middle" className="fill-foreground text-[14px] font-semibold">Versicherung</text>
      <text x={180} y={21} textAnchor="middle" className="fill-muted-foreground text-[14px]">40 € jeden Monat, sicher</text>
      <Pfeil von={72} bis={288} y={30} />
      <circle cx={180} cy={57} r={15} fill="none" stroke={ROT} strokeWidth={1.4} strokeDasharray="3 3" />
      <text x={180} y={63} textAnchor="middle" className="text-[17px] font-semibold" fill={ROT}>?</text>
      <g stroke={ROT} strokeWidth={1.4} fill="none">
        <line x1={272} y1={84} x2={72} y2={84} strokeDasharray="4 3" />
        <path d="M79 79.5 L72 84 L79 88.5" />
      </g>
      <text x={172} y={104} textAnchor="middle" className="text-[14px]" fill={ROT}>zurück: 0 € oder 5.000 €?</text>
    </svg>
    <figcaption className="mt-2 text-[14px] leading-snug">
      <span className="block font-semibold text-loss">Was zurückkommt, weiß beim Abschluss keiner</span>
      <span className="block text-muted-foreground">und oft ist es mehr Geld, als du gezahlt hast</span>
    </figcaption>
  </figure>
);

/** Takaful: viele zahlen in einen gemeinsamen Topf, wer einen Schaden hat, bekommt daraus. */
const Topfbild = () => {
  const oben = [40, 100, 160, 220];
  return (
    <figure className="mt-7 max-w-[460px]">
      <svg
        viewBox="0 0 360 168"
        className="h-auto w-full text-foreground"
        role="img"
        aria-label="Takaful: Alle zahlen in einen gemeinsamen Topf. Wer einen Schaden hat, bekommt daraus etwas. Der Topf dient allen, nicht dem Gewinn einer Firma."
      >
        {oben.map((x) => (
          <g key={x} fill="none" stroke="currentColor" strokeWidth={1.4}>
            <circle cx={x} cy={18} r={7} />
            <path d={`M${x - 12} 42 Q${x - 12} 29 ${x} 29 Q${x + 12} 29 ${x + 12} 42`} />
            <line x1={x} y1={50} x2={x} y2={78} strokeDasharray="3 3" />
            <path d={`M${x - 4} 72 L${x} 78 L${x + 4} 72`} />
          </g>
        ))}
        <rect x={16} y={86} width={228} height={52} rx={8} fill="none" stroke="currentColor" strokeWidth={1.4} strokeDasharray="5 4" />
        <text x={130} y={117} textAnchor="middle" className="fill-foreground text-[14px] font-semibold">Gemeinsamer Topf</text>
        <Pfeil von={252} bis={292} y={112} />
        <g fill="none" stroke="currentColor" strokeWidth={1.4}>
          <circle cx={320} cy={98} r={8} />
          <path d="M306 126 Q306 111 320 111 Q334 111 334 126" />
        </g>
        <text x={320} y={146} textAnchor="middle" className="fill-foreground text-[14px]">hat einen</text>
        <text x={320} y={161} textAnchor="middle" className="fill-foreground text-[14px]">Schaden</text>
      </svg>
      <figcaption className="mt-2 text-[14px] font-semibold leading-snug text-gain">Der Topf dient allen, nicht dem Gewinn einer Firma</figcaption>
    </figure>
  );
};

/* ------------------------------------------------------------------ */
/* Rechner „Beitrag oder Polster“ (Karte Station 8)                    */
/* ------------------------------------------------------------------ */

const LAUFZEITEN = [12, 36, 60];

const Rechner = () => {
  const [beitragText, setBeitragText] = useState("40");
  const [monate, setMonate] = useState(60);
  const beitrag = zahlAus(beitragText);
  const erg = polster(beitrag, monate);
  const gezahlt = beitrag * monate;
  const schalter = (an: boolean) =>
    `min-h-[44px] flex-1 px-3 py-2.5 text-[15px] font-semibold transition-colors ${an ? "bg-foreground text-background" : "bg-background text-foreground hover:bg-muted"}`;
  const farbe = erg && erg.wert < erg.eingezahlt ? "loss" : "gain";
  return (
    <section className="mt-12">
      <Ueber id="rechner" />
      <Text>
        <p>
          Gib ein, was du im Monat für freiwillige Versicherungen zahlst. Links steht, was davon übrig ist, wenn kein Schaden kommt. Rechts, was
          derselbe Betrag als Sparplan in {PLATZ1.name} gebracht hätte.
        </p>
        <p>
          Das ist ein zertifizierter Halal ETF, also ein Fonds, der viele Firmen auf einmal kauft. In unserer Liste steht er auf Platz 1.
        </p>
      </Text>
      <div className="mt-5 border border-border bg-card p-4 md:p-5">
        <div className="sm:max-w-[50%]">
          <label htmlFor="versicherung-beitrag" className="block">
            <Etikett>Beitrag im Monat</Etikett>
          </label>
          <div className="mt-1.5 flex items-center border border-border bg-background focus-within:border-foreground">
            <input
              id="versicherung-beitrag"
              inputMode="decimal"
              value={beitragText}
              onChange={(x) => setBeitragText(x.target.value.replace(/[^\d.,]/g, ""))}
              className="w-full bg-transparent px-3 py-2.5 text-[16px] tabular-nums text-foreground outline-none"
            />
            <span className="pr-3 text-[16px] text-muted-foreground">€</span>
          </div>
        </div>
        <Etikett className="mt-4">Zeitraum</Etikett>
        <div className="mt-1.5 flex border border-border" role="group" aria-label="Zeitraum in Jahren">
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

        <div className="mt-5 grid grid-cols-2 gap-2" aria-live="polite">
          <div className="min-w-0 border border-border bg-background px-3 py-3 sm:px-4 sm:py-4">
            <Etikett>Versicherung</Etikett>
            <p className="mt-1.5 text-[13px] text-muted-foreground sm:text-[14px]">Du zahlst</p>
            <p className="text-[18px] font-semibold tabular-nums text-foreground sm:text-[24px]">{euro(gezahlt)}</p>
            <p className="mt-2 text-[13px] text-muted-foreground sm:text-[14px]">Ohne Schaden zurück</p>
            <p className="text-[18px] font-semibold tabular-nums text-loss sm:text-[24px]">0 €</p>
            <p className="mt-2 text-[13px] leading-snug text-muted-foreground">Der Beitrag gehört der Versicherung.</p>
          </div>
          <div className="min-w-0 border border-foreground bg-background px-3 py-3 shadow-[inset_0_0_0_1px_hsl(var(--foreground))] sm:px-4 sm:py-4">
            <Etikett>Halal Investments</Etikett>
            <p className="mt-1.5 text-[13px] text-muted-foreground sm:text-[14px]">Du zahlst ein</p>
            <p className="text-[18px] font-semibold tabular-nums text-foreground sm:text-[24px]">{euro(gezahlt)}</p>
            <p className="mt-2 text-[13px] text-muted-foreground sm:text-[14px]">Heute wert</p>
            <p className={`text-[18px] font-semibold tabular-nums sm:text-[24px] ${farbe === "loss" ? "text-loss" : "text-gain"}`}>{erg ? euro(erg.wert) : "–"}</p>
            <p className="mt-2 text-[13px] leading-snug text-muted-foreground">Gehört dir, auch für den Schaden, der kommt.</p>
          </div>
        </div>

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
                    width={50}
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
          Ein ETF schwankt: Fällt der Kurs, wenn der Schaden kommt, ist weniger da. Monatskurse bis {kursStand}, ohne Depotkosten.
        </p>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Seite                                                               */
/* ------------------------------------------------------------------ */

const Fett = ({ children }: { children: ReactNode }) => <strong className="font-semibold text-foreground">{children}</strong>;

const IstVersicherungHaram = () => {
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
      <Seo title={SEO_TITEL} description={META} path={PFAD} jsonLd={graph()} />
      <div className="container py-8 md:py-12">
        <div className="mx-auto max-w-[720px] xl:grid xl:max-w-[1048px] xl:grid-cols-[280px_minmax(0,720px)] xl:gap-12">
          <Seitenleiste
            inhalt={inhalt}
            etikett="Ersparnisse statt Police"
            titel="Deine Ersparnisse halal anlegen?"
            text="Ein Sparplan auf einen Halal ETF gehört dir, auch ohne Schaden. Im Vergleich siehst du, welches Depot passt."
            ziel="/vergleich/depot"
            knopf="Halal anlegen"
          />

          <div className="min-w-0">
            <nav aria-label="Brotkrumen" className="flex flex-wrap items-center gap-2 font-mono text-[12px] uppercase tracking-[0.12em] text-muted-foreground">
              <Link to="/blog" className="text-primary hover:underline">
                Blog
              </Link>
              <span aria-hidden>/</span>
              <span>Sind Versicherungen haram?</span>
            </nav>

            <article className="mt-8">
              {/* Elias SEO63 „Halte dich immer wieder an dem Vergleich“: Kopf wie frontal.so/blog/best-gtm-agencies, gemessen 06.11.
                  bei 390 und 1440 (32,8 und 42 px, Zeilenhöhe 1,07, Laufweite −0,03 em): ein Titel, Autorzeile, gleich der Kurzvergleich. */}
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
                <KartenReihe etikett="Kurzer Vergleich" titel="10 Versicherungen auf einen Blick" anzahl={ARTEN.length}>
                  {ARTEN.map((a, i) => (
                    <Karte key={a.art} nummer={i + 1} kopf={a.art} erste={i === 0}>
                      <Marke ton={a.ton}>{a.marke}</Marke>
                      <Etikett className="mt-4">Besonders</Etikett>
                      <p className="font-titel mt-1.5 min-h-[2.4em] text-[19px] leading-[1.2] text-foreground">{a.besonders}</p>
                      <Etikett className="mt-4">Warum</Etikett>
                      <p className="mt-1 text-[15px] leading-snug text-foreground">{a.warum}</p>
                      <Etikett className="mt-3">Was tun</Etikett>
                      <p className="mt-1 text-[15px] font-semibold leading-snug text-foreground">{a.tun}</p>
                      <a
                        href={`#${a.ziel}`}
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
                    Der Versicherungsberater sitzt bei dir am Küchentisch: Haftpflicht, Zahnzusatz, Handy, Berufsunfähigkeit. Klingt vernünftig. Aber darfst
                    du das als Muslim unterschreiben?
                  </p>
                  <p>
                    Kurz gesagt: Eine Versicherung, die du freiwillig abschließt, sieht die große Mehrheit der Gelehrten als haram. Was dir der Staat oder dein
                    Beruf vorschreibt, ist ausgenommen.
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
                    <p>Pflicht sind nur die Kranken- und Pflegeversicherung, mit Auto die Kfz-Haftpflicht und in manchen Berufen die Berufshaftpflicht. Alles andere schließt du freiwillig ab.</p>
                  </Text>
                  <Tabelle
                    kopf={[{ titel: "Versicherung" }, { titel: "Einordnung", eng: true }]}
                    zeilen={ARTEN.map((a) => ({
                      schluessel: a.art,
                      name: <a href={`#${a.ziel}`} className="underline decoration-border underline-offset-[3px] hover:text-primary">{a.art}</a>,
                      unter: a.pflicht,
                      zellen: [<Marke key="m" ton={a.ton}>{a.marke}</Marke>],
                    }))}
                  />
                </section>

                {/* Google-Kasten nach der Übersicht, die erste Werbung folgt nach dem nächsten Abschnitt (Elias SEO55, SEO67) */}
                <GoogleKasten />

                <section className="mt-14">
                  <Ueber id="warum" />
                  <Text>
                    <p>
                      Eine Versicherung, wie du sie in Deutschland abschließt, ist ein Kauf. Du zahlst Geld und bekommst das Versprechen, dass sie bei
                      einem Schaden zahlt. Dein Beitrag gehört ab dann der Versicherung.
                    </p>
                  </Text>
                  <Wettbild />
                  <Text>
                    <p>
                      Die Gelehrten nennen dafür zwei Gründe. Für die einen ist es Geld gegen mehr Geld, also Zins: Du zahlst 40 € und hoffst, später
                      5.000 € zu bekommen.
                    </p>
                    <p>
                      Für die anderen ist es ein Vertrag voller Unbekannter, ähnlich wie eine Wette: Ob, wann und wie viel
                      zurückkommt, weiß keiner.
                    </p>
                    <p>
                      Beide kommen zum selben Ergebnis, haram. Gelehrte sagen das seit fast 400 Jahren, und auch Gelehrtenräte kamen darauf. Wichtig wird der Unterschied erst bei den
                      Ausnahmen weiter unten.
                    </p>
                  </Text>
                  <Video id={VIDEO.id} titel={VIDEO.titel} bild="/bilder/blog/ist-versicherung-haram/video-versicherung-vorschau.webp" />
                </section>

                {/* Erster Anbieter-Kasten nach dem zweiten Inhaltsblock, zwischen einem Viertel und einem Drittel wie bei Frontal (Elias SEO67) */}
                <AnbieterKasten titel="Depots für deine Ersparnisse" anbieter={ANBIETER} />

                <section className="mt-14">
                  <Ueber id="pflicht" />
                  <Text>
                    <p>
                      Zu manchen Versicherungen zwingt dich der Staat oder dein Beruf. Dann hast du keine Wahl, und der Zwang hebt das Urteil auf.
                    </p>
                    <p>
                      <Fett>Kranken- und Pflegeversicherung.</Fett> In Deutschland für jeden Pflicht, genau wie die übrige Sozialversicherung.
                    </p>
                    <p>
                      <Fett>Kfz-Haftpflicht.</Fett> Hast du ein Auto, musst du sie abschließen.
                    </p>
                    <p>
                      <Fett>Berufshaftpflicht, wo vorgeschrieben.</Fett> Ärzte oder Finanzanlagenvermittler, also Vermittler von Geldanlagen, brauchen sie für ihren Beruf.
                    </p>
                  </Text>
                  <Kernsatz>Der Zwang macht eine Versicherung nicht halal. Er nimmt dir nur die Entscheidung ab.</Kernsatz>
                  <Text>
                    <p>
                      Auch bei einer Pflicht wählst du klug: Nimm den Tarif mit dem besten Preis für das, was du brauchst, nicht das Paket mit der
                      höchsten Leistung.
                    </p>
                  </Text>
                </section>

                <Rechner />


                <section className="mt-14">
                  <Ueber id="notfall" />
                  <Kernsatz>Nur in einer Notlage, und ob eine vorliegt, sagt dir ein Gelehrter.</Kernsatz>
                  <Text>
                    <p>Fragen solltest du ihn, wenn ein Schaden absehbar ist, den du selbst nicht tragen könntest.</p>
                    <p>
                      <Fett>Vollkasko.</Fett> Nie durch eine Notlage gedeckt.
                    </p>
                    <p>
                      <Fett>Teilkasko.</Fett> Kann eine Notlage sein, weil sie Diebstahl, Vandalismus und Hagel abdeckt. Etwa wenn du ein gestohlenes
                      Auto nicht einfach ersetzen könntest und dann keins mehr hättest.
                    </p>
                    <p>
                      Gelehrte, die darin Geld gegen mehr Geld sehen, erlauben sie nur in echter Not. Wer sie als Vertrag voller Unbekannter sieht, lässt
                      schon eine Dringlichkeit gelten, also eine Lage wie bei der Teilkasko oben.
                    </p>
                  </Text>
                </section>

                <section className="mt-14">
                  <Ueber id="lebensversicherung" />
                  <Text>
                    <p>
                      <Fett>Geld gegen mehr Geld.</Fett> Bei der kapitalbildenden Lebensversicherung zahlst du über Jahre ein, die Versicherung legt das
                      Geld verzinst an, und am Ende bekommst du oder deine Familie mehr Geld zurück.
                    </p>
                    <p>
                      Für dich oder deine Familie vorsorgen kannst du stattdessen mit einem Sparplan auf einen Halal ETF. Das Geld bleibt deins, und du
                      siehst jederzeit, was es wert ist.
                    </p>
                  </Text>
                </section>

                <section className="mt-14">
                  <Ueber id="berufsunfaehigkeit" />
                  <Text>
                    <p>
                      Sie ist freiwillig und folgt demselben System wie jede andere Versicherung. Für Makler bringt sie die höchste
                      Provision.
                    </p>
                    <p>
                      Gerade in Berufen, die den Körper verschleißen, lehnt die Versicherung die Leistung oft ab, obwohl ein Grund da ist. Eigene
                      Ersparnisse gehören dir dagegen in jedem Fall.
                    </p>
                  </Text>
                </section>

                {/* Elias SEO63: an dieser Stelle die Girokonten statt „Ein Schutz, der dir gehört“ */}
                <AnbieterKasten titel={`Starte mit ${BBBANK_PRAEMIE.betrag}\u00a0€ bei der BBBank`} anbieter={GIROS} />

                <section className="mt-14">
                  <Ueber id="beigabe" />
                  <Text>
                    <p>
                      Ja, wenn du wegen der Sache beitrittst. Im Mieterbund steckt oft ein Rechtsschutz, in der Gewerkschaft auch. Beim Paket gilt dasselbe,
                      solange dein Ziel nicht die Versicherung ist.
                    </p>
                    <p>Trittst du bei, um an die Versicherung zu kommen, ist es dieselbe Sünde wie ein Abschluss.</p>
                  </Text>
                </section>

                <section className="mt-14">
                  <Ueber id="takaful" />
                  <Text>
                    <p>
                      Takaful ist die islamische Versicherung auf Gegenseitigkeit. Mit richtigem Aufbau ist sie eine islamkonforme Versicherung.
                    </p>
                    <p>
                      Alle zahlen in einen gemeinsamen Topf, und wer einen Schaden hat, bekommt daraus etwas. Es geht um Hilfe untereinander, nicht um Gewinn.
                    </p>
                  </Text>
                  <Topfbild />
                  <Text>
                    <p>
                      Anfang 2026 gab es in Deutschland keine Takaful-Versicherung zu kaufen. Ein Anbieter aus Luxemburg hat es mit einer Lebensversicherung versucht und um
                      2018 aufgehört, weil kaum jemand sie wollte.
                    </p>
                    <p>
                      Große Versicherer bieten Takaful nur im Ausland an. Eine Versicherung auf Gegenseitigkeit gibt es hier nur sehr vereinzelt, etwa als Sterbekasse in einem Verein. Ob der Aufbau stimmt,
                      klärst du mit einem Gelehrten.
                    </p>
                    <p>Auch eine erlaubte Versicherung ist kein Muss. Wer selbst Ersparnisse hat, braucht sie für vieles gar nicht.</p>
                  </Text>
                </section>

                <section className="mt-14">
                  <Ueber id="schon-versichert" />
                  <Text>
                    <p>
                      <Fett>Pflicht behalten.</Fett> Krankenkasse, Pflegeversicherung und Kfz-Haftpflicht bleiben, wie sie sind.
                    </p>
                    <p>
                      <Fett>Freiwillige durchgehen.</Fett> Frag dich bei jedem Vertrag: Ist ein Schaden absehbar, den du selbst nicht tragen könntest? Dann
                      frag einen Gelehrten. Wenn nicht, klär mit ihm, wie du am besten rauskommst.
                    </p>
                    <p>
                      <Fett>Ersparnisse aufbauen.</Fett> Was du sonst als Beitrag zahlst, legst du als Sparplan an. Was das bringt, zeigt der{" "}
                      <a href="#rechner" className="font-medium text-primary underline underline-offset-2 hover:no-underline">
                        Rechner oben
                      </a>
                      .
                    </p>
                    <p>
                      <Fett>Bei einer Auszahlung.</Fett> Bekommst du aus einer Pflichtversicherung mehr zurück, als du eingezahlt hast, sagen manche
                      Gelehrte: Behalte nur, was du eingezahlt hast, den Rest gibst du weiter. Frag einen Gelehrten, bevor du entscheidest.
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
                      Leg das Geld, das du sonst für freiwillige Versicherungen zahlst, als Sparplan auf einen Halal ETF an. Welches Depot das kann und
                      keine Zinsen aufs Guthaben zahlt, siehst du im <TL to="/vergleich/depot">Depot-Vergleich</TL>.
                    </p>
                  </Text>
                </section>

                <AnbieterKasten titel="Depots für deine Ersparnisse" anbieter={ANBIETER} />

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

export default IstVersicherungHaram;
