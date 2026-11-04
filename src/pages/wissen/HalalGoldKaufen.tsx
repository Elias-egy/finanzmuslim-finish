import { useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, Check, ChevronDown } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Seo from "@/components/Seo";
import eliasPortrait from "@/assets/elias-autor.webp";
import { kursFuerIsin, kursStand } from "@/lib/kurse";
import { halalAnlagen } from "@/data/halalAnlagen";
import { kaufbarBei } from "@/data/halalEtfListe";
import { ANLAGEN_KAUFBAR } from "@/data/anlagenKaufbar";
import { ROYAL_MINT, ROYAL_MINT_SPARPLAN } from "@/data/royalMint";
import nisab from "@/data/nisab.json";
import {
  AnbieterKasten,
  AutorAufruf,
  BIO,
  Etikett,
  GoogleKasten,
  H2,
  H3,
  INSTAGRAM,
  Kacheln,
  Karte,
  KartenReihe,
  KartenTabelle,
  Kernsatz,
  Klappzeile,
  LINKEDIN,
  LINKEDIN_FIRMA,
  Marke,
  PROFILE,
  SITE,
  TL,
  Tabelle,
  Text,
  YOUTUBE,
  euro,
  useAktiv,
} from "@/components/blog/bausteine";

/**
 * „Halal Gold kaufen“, neu gebaut in SEO48 (04.11.2026) im Aufbau von /blog/halal-etf (Elias: „beste Halal ETFs kannst du
 * alles so machen“, Vault raw/2026-11-04-elias-seo48-alle-beitraege-auf-halal-etf-niveau.md) und mit Erklär-Teilen wie
 * frontal.so/blog/sales-workflow-automation (raw/2026-11-04-elias-seo48-frontal-guide-erklaerungen-ansprechend.md).
 * Inhalt aus der Fassung vom 16.09.2026 (Halal-Prüfung bestanden), nur die Form ist neu. Karte der Station:
 * fundament/research/quellen/SEO-GUIDE-Z2aCQ5YKaTU/beitraege/halal-gold-kaufen.md im Vault.
 */

const PFAD = "/blog/halal-gold-kaufen";
const TITEL = "Halal Gold kaufen: 5 Wege im Vergleich";
const META =
  "Halal Gold kaufen: 5 Wege im Vergleich, von Barren bis Gold-ETC. Welche Gold-ETCs ein Shariah-Zertifikat haben, was sie kosten und bei welchen Depots du sie kaufst.";
const VEROEFFENTLICHT = { text: "16.08.2026", iso: "2026-08-16T09:00:00+02:00" };
const AKTUALISIERT = { text: "04.11.2026", iso: "2026-11-04T09:00:00+01:00" };
const LESEZEIT = 11;
const RECHTSHINWEIS =
  "Dieser Beitrag gibt bekannte Positionen wieder und dient ausschließlich zu Bildungszwecken. Er ist keine Fatwa und ersetzt weder die Auskunft eines Gelehrten noch eine Steuer- oder Anlageberatung. Genannte Produkte sind Beispiele und keine Empfehlung. Innerhalb der Rechtsschulen gibt es zu einzelnen Punkten abweichende Auffassungen, besonders bei Gold als Wertpapier, bei Sparplänen und beim getragenen Schmuck. Vergangene Kursentwicklung ist kein Versprechen für die Zukunft.";

type Abschnitt = { id: string; titel: string; leiste?: boolean; kurz?: string };
const ABSCHNITTE: Abschnitt[] = [
  { id: "das-wichtigste", titel: "Das Wichtigste", leiste: true },
  { id: "gold-wege", titel: "Die 5 Wege, Gold zu kaufen, im Vergleich", leiste: true, kurz: "Die 5 Wege im Vergleich" },
  { id: "gold-etc-liste", titel: "Gold-ETCs mit Shariah-Zertifikat", leiste: true },
  { id: "rechner", titel: "Was aus deinem Geld in Gold geworden wäre", leiste: true, kurz: "Gold-Rechner" },
  { id: "die-regel", titel: "Die eine Regel bei Gold" },
  { id: "online-kaufen", titel: "Gold online kaufen: 3 Punkte, die stimmen müssen", leiste: true, kurz: "Gold online kaufen" },
  { id: "gold-etc", titel: "Gold-ETC: was dafür spricht und was dagegen" },
  { id: "sparplan", titel: "Goldsparplan: 3 Fallen im Vertrag" },
  { id: "altgold", titel: "Altgold beim Juwelier: falsch und richtig" },
  { id: "was-wegfaellt", titel: "Was klar wegfällt" },
  { id: "steuer-zakat", titel: "Steuer und Zakat auf Gold" },
  { id: "haeufige-fragen", titel: "Häufige Fragen", leiste: true },
  { id: "naechster-schritt", titel: "Dein nächster Schritt: das passende Depot" },
];
const titelVon = (id: string) => ABSCHNITTE.find((a) => a.id === id)!.titel;
const LEISTE = ABSCHNITTE.filter((a) => a.leiste);
const Ueber = ({ id }: { id: string }) => <H2 id={id}>{titelVon(id)}</H2>;

/* ------------------------------------------------------------------ */
/* Daten                                                               */
/* ------------------------------------------------------------------ */

/**
 * Die Gold-ETCs mit Shariah-Zertifikat aus der Datenbank (halalAnlagen.ts), Reihenfolge nach Fondsgröße. „Besonders“ ist
 * je eine Tatsache aus den Daten, kein Urteil. Royal Mint: Auslieferung laut Zertifikatshinweis in halalAnlagen.ts.
 */
const LOGO: Record<string, string> = {
  Invesco: "/guides/assets/logos/invesco.com.png",
  WisdomTree: "/guides/assets/logos/wisdomtree.eu.png",
  HANetf: "/guides/assets/logos/hanetf.com.png",
};
const BESONDERS: Record<string, string> = {
  IE00B579F325: "Größter Gold-ETC hier",
  JE00BN2CJ301: "Günstig bei WisdomTree",
  JE00B1VS3770: "Am Markt seit 2007",
  JE00B588CD74: "Schweizer Barren im Namen",
  [ROYAL_MINT]: "Unsere Nummer 1: Barren und Münzen lieferbar",
};
const GOLD = halalAnlagen
  .filter((a) => a.kategorie === "gold" && a.zertifikatLink && ANLAGEN_KAUFBAR[a.isin]?.kaufbar.length)
  .sort((x, y) => Number(y.isin === ROYAL_MINT) - Number(x.isin === ROYAL_MINT) || (y.groesseSortierwert ?? 0) - (x.groesseSortierwert ?? 0));
const GROESSTER = [...GOLD].sort((x, y) => (y.groesseSortierwert ?? 0) - (x.groesseSortierwert ?? 0))[0]?.isin;
const kurzName = (name: string, anbieter: string) => name.replace(new RegExp(`^${anbieter} `), "").replace(/^The Royal Mint Responsibly Sourced /, "Royal Mint ");
const groesseKurz = (a: (typeof GOLD)[number]) => {
  const mio = a.groesseSortierwert ?? 0;
  const w = a.groesse?.includes("$") ? "$" : "€";
  return mio >= 1000 ? `${(mio / 1000).toLocaleString("de-DE", { maximumFractionDigits: 1 })} Mrd. ${w}` : `${mio.toLocaleString("de-DE")} Mio. ${w}`;
};
const depots = (isin: string) => (ANLAGEN_KAUFBAR[isin]?.kaufbar.length ? kaufbarBei(isin).length : null);
const pruefer = (z: string | undefined) => (z ?? "").split(",")[0];
const prozentText = (r: number | undefined) =>
  r == null ? "–" : `${r > 0 ? "+" : ""}${r.toLocaleString("de-DE", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %`;
const GEPRUEFT = Math.max(...GOLD.map((a) => depots(a.isin) ?? 0));

const WICHTIGSTES: { lead: string; text: ReactNode }[] = [
  { lead: "Gold kaufen ist erlaubt.", text: "Die Bedingung: Zahlung und Übergabe fallen zusammen. Du zahlst, du bekommst das Gold." },
  {
    lead: "Online geht, wenn drei Dinge stimmen.",
    text: "Der Händler hat den Barren schon, der Barren ist bestimmbar, deine Zahlung ist nicht widerrufbar. Lange Lieferzeit ist das Warnsignal.",
  },
  {
    lead: "Unsere Nummer 1 ist der Gold-ETC der Royal Mint.",
    text: "Du lässt dir Barren und Münzen ausliefern, er ist zertifiziert, und der Gewinn ist nach einem Jahr steuerfrei. Kaufbar bei Traders Place, Scalable und Smartbroker+.",
  },
  { lead: "Gold auf Raten fällt weg.", text: "Ebenso Gold-CFDs, Hebelprodukte und Altgold plus Zuzahlung gegen neues Gold." },
  {
    lead: "Zakat auf Gold: 2,5 Prozent.",
    text: (
      <>
        Sobald du über dem Nisab von 85 Gramm liegst und es ein Mondjahr besitzt. Rechnen kannst du im{" "}
        <TL to="/zakat-rechner">Zakat-Rechner</TL>.
      </>
    ),
  },
];

const WEGE: { weg: string; marke: string; ton: "gruen" | "gelb" | "rot"; wann: string; steuer: string }[] = [
  { weg: "Barren oder Münzen beim Händler", marke: "klar erlaubt", ton: "gruen", wann: "sofort, in deiner Hand", steuer: "steuerfrei nach 1 Jahr" },
  { weg: "Online beim Händler mit eigenem Bestand", marke: "geht mit Prüfung", ton: "gruen", wann: "bei Zahlung zugeordnet", steuer: "steuerfrei nach 1 Jahr" },
  { weg: "Gold-ETC mit echtem Metall", marke: "zertifiziert", ton: "gruen", wann: "Barren im Tresor, bei Royal Mint auch lieferbar", steuer: "Royal Mint steuerfrei nach 1 Jahr, sonst meist Abgeltungsteuer" },
  { weg: "Goldsparplan", marke: "je nach Vertrag", ton: "gelb", wann: "hängt am Vertrag", steuer: "hängt am Vertrag" },
  { weg: "Gold-Zertifikat, CFD, Hebel", marke: "fällt weg", ton: "rot", wann: "nie, kein Metall dahinter", steuer: "Abgeltungsteuer" },
];

const DREIER = [
  { name: "Traders Place", logo: "/bilder/blog/halal-etf/logos/traders-place-wortmarke.svg", out: "/out/traders-place" },
  { name: "Smartbroker+", logo: "/bilder/blog/halal-etf/logos/smartbroker.webp", out: "/out/smartbroker" },
  { name: "Scalable Capital", logo: "/bilder/blog/halal-etf/logos/scalable.webp", out: "/out/scalable" },
];
const MIT_DEPOT = GOLD.filter((a) => depots(a.isin) !== null);
const goldBei = (name: string) => MIT_DEPOT.filter((a) => kaufbarBei(a.isin).includes(name)).length;
const ANBIETER = DREIER.map((d) => ({
  ...d,
  zeilen: [
    `Royal Mint Gold-ETC: ${kaufbarBei(ROYAL_MINT).includes(d.name) ? (ROYAL_MINT_SPARPLAN.includes(d.name) ? "kaufbar, auch als Sparplan" : "kaufbar") : "noch nicht geprüft"}`,
    `Gold-ETCs mit Zertifikat: ${goldBei(d.name)} von ${MIT_DEPOT.length}`,
    d.name === "Smartbroker+" ? "Zinsen nur auf eigenem Zinskonto" : "Zinsen aufs Guthaben: 0 %",
  ],
}));

const FRAGEN: { frage: string; antwort: string; link?: { to: string; text: string } }[] = [
  {
    frage: "Ist Gold kaufen halal?",
    antwort:
      "Ja, mit einer Bedingung: Zahlung und Übergabe müssen zusammenfallen. Du bezahlst und bekommst das Gold. Gold auf Raten, Gold mit später Lieferung und Wetten auf den Goldpreis erfüllen das nicht.",
  },
  {
    frage: "Darf ich Gold online kaufen?",
    antwort:
      "Ja, wenn drei Dinge stimmen: Der Händler besitzt den Barren schon, der Barren ist bestimmbar (Nummer, Gewicht), und deine Zahlung ist nicht mehr widerrufbar. Ein guter Praxistest ist die Lieferzeit. Zwei bis drei Tage sind Logistik, zwei bis drei Wochen heißen meist, dass der Barren erst nach deiner Zahlung eingekauft wird.",
  },
  {
    frage: "Welcher Gold-ETC ist der beste für Muslime?",
    antwort:
      "Unsere Nummer 1 ist der Gold-ETC der Royal Mint von HANetf (ISIN XS2115336336). Du kannst dir das Gold als Barren oder Münzen ausliefern lassen, ein Gelehrtengremium zertifiziert ihn jedes Jahr, und der Gewinn ist nach einem Jahr steuerfrei. Kaufen kannst du ihn unter anderem bei Traders Place, Scalable Capital und Smartbroker+.",
  },
  {
    frage: "Ist ein Gold-ETF oder Gold-ETC halal?",
    antwort:
      "Die fünf Gold-ETCs in diesem Beitrag haben ein Shariah-Zertifikat: Hinter ihnen liegt echtes Gold im Tresor. Ein Teil der Gelehrten verlangt das Gold in der Hand. Beim Royal-Mint-ETC geht auch das: Du lässt es dir ausliefern. Klar ausgeschlossen sind Produkte ohne echtes Metall dahinter.",
  },
  {
    frage: "Ist Gold im Depot steuerfrei?",
    antwort:
      "Ja, wenn das Wertpapier dir einen Anspruch auf Lieferung von Gold gibt und voll mit Gold gedeckt ist. Dann ist der Gewinn nach einem Jahr steuerfrei wie bei einem Barren (Bundesfinanzhof, Urteil VIII R 7/17 vom 16.06.2020). Der Royal-Mint-ETC gibt diesen Anspruch. Bei den meisten anderen Gold-ETCs greift die Abgeltungsteuer. Das ist keine Steuerberatung.",
  },
  {
    frage: "Darf ich Gold auf Raten kaufen?",
    antwort: "Nein. Bei Gold müssen Zahlung und Übergabe zusammenfallen. Das ist einer der wenigen Punkte, bei denen es kaum abweichende Auffassungen gibt.",
  },
  {
    frage: "Ist ein Goldsparplan erlaubt?",
    antwort:
      "Der Aufbau kann sauber sein, wenn für deine Einzahlung sofort Gold gekauft und dir zugeordnet wird. Die typischen Probleme sind eine Abschlussgebühr ohne Gegenleistung, Goldgranulat statt eines bestimmbaren Barrens und die Zakat, die jedes Jahr auf den Bestand anfällt. Entscheidend ist der Vertrag, nicht das Wort Sparplan.",
  },
  {
    frage: "Darf ich Altgold beim Juwelier in Zahlung geben?",
    antwort:
      "Nicht als ein Geschäft. Altgold plus Zuzahlung gegen einen neuen Barren ist Gold gegen mehr Gold und damit ausgeschlossen. Der saubere Weg sind zwei getrennte Geschäfte: erst das Altgold verkaufen und den Betrag bekommen, dann neu kaufen.",
  },
  {
    frage: "Gilt das auch für Weißgold, Roségold, Platin?",
    antwort:
      "Weißgold und Roségold sind Gold, für sie gilt dieselbe Regel. Platin und Palladium gehören nicht zu den Waren, für die diese Sonderregel gilt, und werden wie normale Waren behandelt.",
  },
  {
    frage: "Gibt es einen Goldsparplan mit Shariah-Zertifikat?",
    antwort:
      "Ja, einen haben wir gefunden. INAIA aus Deutschland lässt seinen Gold- und Silbersparplan von Minhaj Shari'ah Financial Advisory in Dubai nach den AAOIFI-Kriterien prüfen. Das Metall lagert in Deutschland und der Schweiz und wird auf Wunsch geliefert. Für Auvesta und SOLIT, die bekanntesten deutschen Anbieter, haben wir keinen Nachweis gefunden.",
  },
  {
    frage: "Wie viel Gold sollte man haben?",
    antwort:
      "Dazu geben wir keine Empfehlung ab, das wäre Anlageberatung. Was sich sagen lässt: Gold wirft nichts ab, es zahlt keine Miete und keinen Gewinn. Es ist ein Wertspeicher, kein Einkommen.",
  },
];

const PASST_DAZU: { to: string; name: string; text: string }[] = [
  { to: "/vergleich/edelmetalle", name: "Der Edelmetall-Vergleich", text: "Depots für Gold und Silber nach Rang." },
  { to: "/zakat-rechner", name: "Der Zakat-Rechner", text: "Rechnet Gold, Silber und Ersparnisse zusammen." },
  { to: "/blog/nisab", name: "Nisab verstehen", text: "Welche der beiden Grenzen für dich gilt." },
  { to: "/blog/halal-etf", name: "Beste Halal ETFs", text: "Acht Halal ETFs im Vergleich." },
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
      },
      {
        "@type": "ItemList",
        "@id": `${url}#liste`,
        name: "Gold-ETCs mit Shariah-Zertifikat",
        numberOfItems: GOLD.length,
        itemListElement: GOLD.map((a, i) => ({ "@type": "ListItem", position: i + 1, name: a.name, url: `${SITE}/halal-anlagen/${a.slug}` })),
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
/* Gold-Rechner                                                        */
/* ------------------------------------------------------------------ */

type Punkt = { x: string; eingezahlt: number; wert: number };
const rechnen = (isin: string, betrag: number, art: "monat" | "einmal", jahre: number) => {
  const reihe = kursFuerIsin(isin)?.reihe ?? [];
  const n = jahre * 12;
  if (reihe.length < n || !betrag) return null;
  const teil = reihe.slice(-n);
  let anteile = art === "einmal" ? betrag / teil[0][1] : 0;
  const kurve: Punkt[] = teil.map(([monat, kurs], i) => {
    if (art === "monat") anteile += betrag / kurs;
    return { x: monat, eingezahlt: art === "monat" ? (i + 1) * betrag : betrag, wert: anteile * kurs };
  });
  const ende = kurve[kurve.length - 1];
  return { eingezahlt: ende.eingezahlt, wert: ende.wert, kurve };
};

const GoldRechner = () => {
  const [isin, setIsin] = useState(MIT_DEPOT[0].isin);
  const [eingabe, setEingabe] = useState("100");
  const [art, setArt] = useState<"monat" | "einmal">("monat");
  const [jahre, setJahre] = useState(5);
  const betrag = Math.min(Math.max(Number(eingabe.replace(/\D/g, "")) || 0, 0), 1_000_000);
  const ergebnisse = [1, 3, 5].map((j) => ({ jahre: j, erg: rechnen(isin, betrag, art, j) }));
  const aktiv = ergebnisse.find((x) => x.jahre === jahre)?.erg ?? null;
  const gramm = betrag / nisab.goldPreisJeGramm;
  const schalter = (an: boolean) =>
    `flex-1 px-3 py-2.5 text-[15px] font-semibold transition-colors ${an ? "bg-foreground text-background" : "bg-background text-foreground hover:bg-muted"}`;
  const farbe = aktiv && aktiv.wert < aktiv.eingezahlt ? "loss" : "gain";
  return (
    <section className="mt-12">
      <Ueber id="rechner" />
      <Text>
        <p>Gib einen Betrag ein. Du siehst, wie viel Gramm Gold du heute dafür bekommst und was daraus geworden wäre, wenn du vor 1, 3 oder 5 Jahren angefangen hättest.</p>
      </Text>
      <div className="mt-5 border border-border bg-card p-4 md:p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="gold-betrag" className="block">
              <Etikett>Betrag</Etikett>
            </label>
            <div className="mt-1.5 flex items-center border border-border bg-background focus-within:border-foreground">
              <input
                id="gold-betrag"
                inputMode="numeric"
                value={eingabe}
                onChange={(x) => setEingabe(x.target.value.replace(/[^\d.]/g, ""))}
                className="w-full bg-transparent px-3 py-2.5 text-[16px] tabular-nums text-foreground outline-none"
              />
              <span className="pr-3 text-[16px] text-muted-foreground">€</span>
            </div>
          </div>
          <div>
            <Etikett>Wie oft</Etikett>
            <div className="mt-1.5 flex border border-border" role="group" aria-label="Wie oft du einzahlst">
              <button type="button" aria-pressed={art === "monat"} onClick={() => setArt("monat")} className={schalter(art === "monat")}>
                Jeden Monat
              </button>
              <button type="button" aria-pressed={art === "einmal"} onClick={() => setArt("einmal")} className={`border-l border-border ${schalter(art === "einmal")}`}>
                Einmalig
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-baseline justify-between gap-3 border border-primary/25 bg-accent px-4 py-3">
          <span className="text-[15px] text-foreground/80">Dafür bekommst du heute rund</span>
          <span className="whitespace-nowrap text-[22px] font-semibold tabular-nums text-primary">
            {gramm.toLocaleString("de-DE", { maximumFractionDigits: gramm < 10 ? 2 : 1 })} g Gold
          </span>
        </div>

        <Etikett className="mt-5">Gold-ETC</Etikett>
        <div className="mt-1.5 flex snap-x gap-2 overflow-x-auto pb-1 [scrollbar-width:none] sm:grid sm:grid-cols-2 sm:overflow-visible md:grid-cols-4 [&::-webkit-scrollbar]:hidden" role="group" aria-label="Gold-ETC wählen">
          {MIT_DEPOT.map((a) => {
            const an = a.isin === isin;
            return (
              <button
                key={a.isin}
                type="button"
                aria-pressed={an}
                onClick={() => setIsin(a.isin)}
                className={`flex min-h-[52px] w-[150px] shrink-0 snap-start items-center gap-2 border px-2.5 py-2 text-left transition-colors sm:w-auto ${
                  an ? "border-foreground bg-background shadow-[inset_0_0_0_1px_hsl(var(--foreground))]" : "border-border bg-background hover:border-foreground/50"
                }`}
              >
                <img src={LOGO[a.anbieter]} alt="" aria-hidden="true" width={24} height={24} className="h-6 w-6 shrink-0 object-contain" />
                <span className="min-w-0 text-[13px] leading-tight text-foreground">{kurzName(a.name, a.anbieter)}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2" aria-live="polite">
          {ergebnisse.map(({ jahre: j, erg }) => {
            const an = j === jahre;
            return (
              <button
                key={j}
                type="button"
                disabled={!erg}
                aria-pressed={an}
                onClick={() => setJahre(j)}
                className={`min-w-0 border px-2.5 py-2.5 text-left transition-colors disabled:cursor-default sm:px-4 sm:py-3.5 ${
                  an ? "border-foreground bg-background shadow-[inset_0_0_0_1px_hsl(var(--foreground))]" : "border-border bg-background enabled:hover:border-foreground/50"
                }`}
              >
                <span className="block font-mono text-[12px] uppercase tracking-[0.04em] text-muted-foreground sm:tracking-[0.14em]">
                  Vor {j === 1 ? "1 Jahr" : `${j} Jahren`}
                </span>
                <span className={`mt-1 block text-[17px] font-semibold tabular-nums [overflow-wrap:anywhere] sm:text-[24px] ${erg && erg.wert < erg.eingezahlt ? "text-loss" : "text-gain"}`}>
                  {erg ? euro(erg.wert) : "–"}
                </span>
                <span className="mt-0.5 block text-[12px] text-muted-foreground sm:text-[14px]">
                  {erg ? (
                    <>
                      von <span className="tabular-nums text-foreground">{euro(erg.eingezahlt)}</span>
                    </>
                  ) : (
                    "noch zu kurz"
                  )}
                </span>
              </button>
            );
          })}
        </div>

        {aktiv && (
          <div className="mt-5 border border-border bg-background px-2 pb-2 pt-3 sm:px-3">
            <div className="h-[180px] sm:h-[220px]" role="img" aria-label={`Eingezahlt ${euro(aktiv.eingezahlt)}, heute wert ${euro(aktiv.wert)}`}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={aktiv.kurve.map((p) => ({ ...p, wert: Math.round(p.wert) }))} margin={{ top: 6, right: 8, bottom: 0, left: 0 }}>
                  <CartesianGrid stroke="hsl(var(--border))" vertical={false} />
                  <XAxis
                    dataKey="x"
                    ticks={aktiv.kurve.filter((d, i) => (aktiv.kurve.length <= 12 ? i % 3 === 0 : d.x.endsWith("-01"))).map((d) => d.x)}
                    interval={0}
                    tickFormatter={(x: string) => (aktiv.kurve.length <= 12 ? x.slice(5) + "/" + x.slice(2, 4) : x.slice(0, 4))}
                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis width={50} tickFormatter={(v: number) => Math.round(v).toLocaleString("de-DE")} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} domain={[0, "auto"]} />
                  <Tooltip formatter={(v: number, n: string) => [euro(v), n === "wert" ? "Wert" : "Eingezahlt"]} contentStyle={{ fontSize: 13, borderRadius: 4 }} />
                  <Area type="monotone" dataKey="eingezahlt" stroke="hsl(var(--muted-foreground))" fill="hsl(var(--muted))" strokeWidth={1.5} isAnimationActive={false} />
                  <Area type="monotone" dataKey="wert" stroke={`hsl(var(--${farbe}))`} fill={`hsl(var(--${farbe}-soft))`} fillOpacity={0.7} strokeWidth={2} isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        <p className="mt-4 text-[13px] leading-relaxed text-muted-foreground">
          Gramm zum Goldpreis von {nisab.goldPreisJeGramm.toLocaleString("de-DE")} € je Gramm ({nisab.stand}, ohne Aufschlag des Händlers). Verlauf aus Monatskursen bis {kursStand} (Yahoo Finance), ohne Depotkosten. Vergangene Kursentwicklung ist kein Versprechen.
        </p>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Seite                                                               */
/* ------------------------------------------------------------------ */

const HalalGoldKaufen = () => {
  const [offen, setOffen] = useState(false);
  const ids = useMemo(() => LEISTE.map((a) => a.id), []);
  const aktiv = useAktiv(ids);

  const inhalt = (
    <ol>
      {LEISTE.map((a) => (
        <li key={a.id}>
          <a
            href={`#${a.id}`}
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
          <aside className="hidden xl:block" aria-label="Inhaltsverzeichnis">
            <div className="sticky top-24">
              <Etikett className="border-t border-border pt-4">Auf dieser Seite</Etikett>
              <div className="mt-3">{inhalt}</div>
              <div className="mt-6 border border-border bg-card p-5">
                <Etikett className="text-primary">Gold im Depot</Etikett>
                <p className="font-titel mt-2.5 text-[21px] leading-[1.2] text-foreground">Gold kaufen, ohne einen Cent Zinsen?</p>
                <p className="mt-2.5 text-[14px] leading-relaxed text-foreground/75">
                  Im Gold-Vergleich siehst du, welches Depot alle Gold-ETCs mit Zertifikat führt und dir keine Zinsen zahlt.
                </p>
                <Link to="/vergleich/edelmetalle" className="leuchtlinie mt-5 inline-block">
                  <span className="block bg-foreground px-5 py-3 font-mono text-[13px] uppercase tracking-[0.12em] text-background">Zum Gold-Vergleich</span>
                </Link>
              </div>
            </div>
          </aside>

          <div className="min-w-0">
            <nav aria-label="Brotkrumen" className="flex flex-wrap items-center gap-2 font-mono text-[12px] uppercase tracking-[0.12em] text-muted-foreground">
              <Link to="/blog" className="text-primary hover:underline">
                Blog
              </Link>
              <span aria-hidden>/</span>
              <span>Halal Gold kaufen</span>
            </nav>

            <article className="mt-8">
              <h1 className="font-titel mt-3 text-[32px] leading-[1.1] text-foreground md:text-[42px]">
                <span className="block">Halal Gold kaufen:</span> <span className="block">5 Wege im Vergleich</span>
              </h1>
              <p className="mt-4 max-w-[600px] text-[18px] leading-[1.5] text-foreground/75">
                Welcher Weg halal ist, welche Gold-ETCs ein Zertifikat haben und wo du sie kaufst.
              </p>
              <ul data-vorlage="haken" className="mt-5 flex flex-wrap gap-2">
                {["5 Wege im Vergleich", `${GOLD.length} Gold-ETCs mit Zertifikat`, `Bei ${GEPRUEFT}+ Depots nachgesehen`, "Stand November 2026"].map((h) => (
                  <li key={h} className="inline-flex min-h-[34px] items-center gap-1.5 border border-border bg-muted/50 px-3 text-[14px] text-foreground/85">
                    <Check className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                    {h}
                  </li>
                ))}
              </ul>
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
                  <p className="uppercase tracking-[0.12em]">Aktualisiert</p>
                  <time dateTime={AKTUALISIERT.iso}>{AKTUALISIERT.text}</time>
                </div>
              </div>

              {/* Kurzer Vergleich wie /blog/halal-etf: die Gold-ETCs mit Zertifikat als Karten */}
              <KartenReihe etikett="Kurzer Vergleich" titel={`${GOLD.length} Gold-ETCs mit Zertifikat auf einen Blick`} anzahl={GOLD.length}>
                {GOLD.map((a, i) => {
                  const k = kursFuerIsin(a.isin);
                  const n = depots(a.isin);
                  return (
                    <Karte key={a.isin} nummer={i + 1} logo={LOGO[a.anbieter]} kopf={a.anbieter} erste={i === 0}>
                      <p className="min-h-[2.75em] text-[14px] font-semibold leading-snug text-foreground">{kurzName(a.name, a.anbieter)}</p>
                      <Etikett className="mt-4">Besonders</Etikett>
                      <p className="font-titel mt-1.5 text-[20px] leading-[1.2] text-foreground">{BESONDERS[a.isin]}</p>
                      <Kacheln
                        werte={[
                          ["Kosten", a.kostenLabel, `${euro(a.kosten * 100)} bei 10.000 €`],
                          ["Größe", groesseKurz(a)],
                          ["Depots", n ?? "–", n ? undefined : "noch nicht nachgesehen"],
                          ["Seit", a.auflage?.slice(-4) ?? "–"],
                        ]}
                      />
                      <a
                        href={`#${a.slug}`}
                        className="mb-4 mt-5 flex min-h-[44px] items-center justify-center gap-1.5 border border-border bg-muted/60 py-2.5 font-mono text-[12px] uppercase tracking-[0.12em] text-foreground transition-colors hover:border-foreground sm:mt-auto"
                      >
                        Zum Eintrag
                        <ArrowDown className="h-3.5 w-3.5" aria-hidden />
                      </a>
                      <Klappzeile titel="Kurs">
                        1 Jahr {prozentText(k?.r1j)}, 5 Jahre {prozentText(k?.r5j)}. Yahoo Finance, Stand {kursStand}.
                      </Klappzeile>
                      <Klappzeile titel="Geprüft von">
                        {pruefer(a.zertifizierer)}.{" "}
                        <a href={a.zertifikatLink} target="_blank" rel="noopener noreferrer" className="font-medium text-primary underline underline-offset-2">
                          Zertifikat ansehen
                        </a>
                      </Klappzeile>
                    </Karte>
                  );
                })}
              </KartenReihe>

              <nav aria-label="Auf dieser Seite" className="mt-7 border-y border-border xl:hidden">
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

              {/* Einstieg als kleine Szene wie frontal („Imagine …“) */}
              <div className="mt-8">
                <Text>
                  <p>
                    Du willst als Muslim etwas Gold zur Seite legen. Beim Juwelier, online oder im Depot? Und welcher dieser Wege
                    ist überhaupt halal?
                  </p>
                  <p>
                    Bei Gold entscheidet eine einzige Regel. Ich zeige dir, welche Wege sie erfüllen, welche {GOLD.length} Gold-ETCs ein
                    Shariah-Zertifikat haben und bei welchem Depot du sie bekommst.
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
                  <Ueber id="gold-wege" />
                  <Text>
                    <p>Es gibt in Deutschland im Wesentlichen fünf Wege. Sie unterscheiden sich genau an einer Frage: Ab wann gehört das Gold dir?</p>
                  </Text>
                  <Tabelle
                    kopf={[{ titel: "Weg" }, { titel: "Einordnung" }, { titel: "Wann es dir gehört", text: true }, { titel: "Gewinn beim Verkauf", text: true }]}
                    zeilen={WEGE.map((w) => ({
                      schluessel: w.weg,
                      name: <span className="block max-w-[150px] whitespace-normal sm:max-w-[230px]">{w.weg}</span>,
                      zellen: [<Marke ton={w.ton}>{w.marke}</Marke>, w.wann, w.steuer],
                    }))}
                    quelle="Steuer nach derzeitiger Rechtslage, keine Steuerberatung. Einordnung nach den Positionen weiter unten im Beitrag."
                  />
                  <Kernsatz>Geld und Gold müssen im selben Moment den Besitzer wechseln. Daran hängt jeder dieser Wege.</Kernsatz>
                </section>

                <section className="mt-14">
                  <Ueber id="gold-etc-liste" />
                  <Text>
                    <p>
                      Diese {GOLD.length} Gold-ETCs haben ein Shariah-Zertifikat, das du selbst nachlesen kannst. Hinter jedem liegen echte Barren im
                      Tresor. Kosten im Jahr in Prozent und in Euro bei 10.000 €.
                    </p>
                  </Text>
                  <Tabelle
                    kopf={[
                      { titel: "Gold-ETC" },
                      { titel: "Kosten", zusatz: "im Jahr", rechts: true },
                      { titel: "Bei 10.000 €", zusatz: "im Jahr", rechts: true },
                      { titel: "Größe", rechts: true },
                      { titel: "Depots", rechts: true },
                      { titel: "Geprüft von", text: true },
                    ]}
                    zeilen={GOLD.map((a) => ({
                      schluessel: a.isin,
                      name: (
                        <a href={`#${a.slug}`} className="hover:text-primary">
                          {kurzName(a.name, a.anbieter)}
                        </a>
                      ),
                      unter: (
                        <>
                          {a.anbieter}
                          {a.isin === ROYAL_MINT && (
                            <>
                              {" "}
                              <Marke>Nummer 1</Marke>
                            </>
                          )}
                          {a.isin === GROESSTER && (
                            <>
                              {" "}
                              <Marke>Größter</Marke>
                            </>
                          )}
                        </>
                      ),
                      zellen: [a.kostenLabel, euro(a.kosten * 100), groesseKurz(a), depots(a.isin) ?? "–", pruefer(a.zertifizierer)],
                    }))}
                    quelle={`Kosten und Größe vom Anbieter, Depots: eigene Prüfung finanzmuslim je Depot, Stand ${ANLAGEN_KAUFBAR[GOLD[0].isin]?.stand}. Strich: noch nicht nachgesehen.`}
                  />
                  <H3>Kurs im Vergleich</H3>
                  <Tabelle
                    kopf={[{ titel: "Gold-ETC" }, { titel: "6 Monate", rechts: true }, { titel: "1 Jahr", rechts: true }, { titel: "5 Jahre", rechts: true }]}
                    zeilen={GOLD.map((a) => {
                      const k = kursFuerIsin(a.isin);
                      return {
                        schluessel: a.isin,
                        name: kurzName(a.name, a.anbieter),
                        unter: a.anbieter,
                        zellen: [k?.r6m, k?.r1j, k?.r5j].map((r, i) => (
                          <span key={i} className={r == null ? "text-muted-foreground" : r < 0 ? "text-loss" : "text-gain"}>
                            {prozentText(r)}
                          </span>
                        )),
                      };
                    })}
                    quelle={`Yahoo Finance, Kurse in Euro, Stand ${kursStand}. Alle folgen dem Goldpreis, die Unterschiede kommen aus Kosten und Währung.`}
                  />
                  <GoogleKasten />
                </section>

                <GoldRechner />

                <AnbieterKasten titel="Depots für deine Gold-ETCs" anbieter={ANBIETER} />

                <section className="mt-14">
                  <Ueber id="die-regel" />
                  <Text>
                    <p>
                      Gold gilt im Islam nicht als gewöhnliche Ware, sondern als Geld. Kaufen darfst du es, daran zweifelt niemand. Es gibt aber
                      eine Bedingung, die es beim Sofa oder beim Auto nicht gibt.
                    </p>
                    <p>
                      Du zahlst, du bekommst das Gold. Nicht in vier Wochen, nicht auf Raten, nicht als Versprechen auf später. Der Grund liegt in
                      einem bekannten Bericht, in dem Gold, Silber und einige Grundnahrungsmittel eigens genannt werden. Für diese Waren gilt:
                      Tausch nur sofort und, wenn Gleiches gegen Gleiches getauscht wird, in gleicher Menge.
                    </p>
                    <p>
                      Gelehrte nennen den Moment der Übergabe <strong className="font-semibold text-foreground">Qabd</strong>. Bei Gold muss er mit der
                      Zahlung zusammenfallen. Alles, was das auseinanderzieht, ist das Problem.
                    </p>
                  </Text>
                </section>

                <section className="mt-14">
                  <Ueber id="online-kaufen" />
                  <Text>
                    <p>
                      Gelehrte unterscheiden zwischen der Übergabe von Hand zu Hand und der rechtlichen Übergabe. Rechtlich übergeben ist das Gold,
                      wenn es dir zugeordnet ist und der Händler nicht mehr frei darüber verfügen kann. Damit ein Online-Kauf sauber ist, müssen drei
                      Dinge zusammenkommen.
                    </p>
                  </Text>
                  <H3>1. Der Händler besitzt den Barren schon</H3>
                  <Text>
                    <p>
                      Er verkauft dir etwas, das in seinem Tresor liegt, und kauft es nicht erst ein, nachdem dein Geld da ist. Wer erst nach deiner
                      Bestellung selbst einkauft, verkauft etwas, das ihm noch nicht gehört.
                    </p>
                  </Text>
                  <H3>2. Der Barren ist bestimmbar</H3>
                  <Text>
                    <p>Er hat eine Nummer, ein Gewicht, eine Prägung. Nicht irgendein Gold aus irgendeinem Bestand, sondern dieses Stück.</p>
                  </Text>
                  <H3>3. Beide Seiten geben im selben Moment ab</H3>
                  <Text>
                    <p>
                      Dein Geld geht raus und ist nicht rückholbar, sein Gold ist dir zugeordnet. Kartenzahlung ist in Ordnung, solange die Zahlung
                      nicht widerrufbar ist. Dass die Buchung bei der Bank etwas dauert, schadet nicht: Die Internationale Fiqh-Akademie lässt die
                      dort übliche Dauer zu.
                    </p>
                  </Text>
                  <KartenTabelle
                    kopf={["Lieferzeit", "Was sie heißt"]}
                    zeilen={[
                      { schluessel: "tage", werte: ["2 bis 3 Tage", "Logistik. Der Barren liegt beim Händler."] },
                      {
                        schluessel: "wochen",
                        werte: ["2 bis 3 Wochen", "Der Händler kauft den Barren erst ein, nachdem er dein Geld hat. Genau den Fall soll die Regel verhindern."],
                      },
                    ]}
                  />
                </section>

                <section className="mt-14">
                  <Ueber id="gold-etc" />
                  <Text>
                    <p>
                      Ein Gold-ETC ist ein Wertpapier, das du im Depot kaufst wie eine Aktie. Hinter den guten liegt echtes Metall im Tresor, jeder
                      Barren mit Nummer und in Listen erfasst.
                    </p>
                  </Text>
                  <KartenTabelle
                    kopf={["Frage", "Antwort"]}
                    zeilen={[
                      { schluessel: "dafuer", werte: ["Was spricht dafür?", "Dir ist echtes Gold zugeordnet, getrennt vom Vermögen des Anbieters, und es gibt ein Zertifikat, das du selbst lesen kannst."] },
                      {
                        schluessel: "dagegen",
                        werte: ["Was spricht dagegen?", "Du hältst das Gold nicht in der Hand. Ein Teil der Gelehrten sagt deshalb: Das erfüllt die Bedingung der Übergabe nicht wirklich."],
                      },
                      {
                        schluessel: "halten",
                        werte: ["Woran hältst du dich?", "Echtes Metall dahinter, dir zugeordnet, ein Zertifikat zum Nachlesen. Die meisten Goldwertpapiere am Markt sind nicht voll physisch hinterlegt."],
                      },
                    ]}
                  />
                  <figure className="mt-8 max-w-[560px]">
                    <a
                      href={GOLD.find((a) => a.anbieter === "WisdomTree")?.zertifikatLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block overflow-hidden border border-border bg-white"
                    >
                      <img
                        src="/bilder/blog/halal-gold-kaufen/wisdomtree-pruefbericht-al-qalam.webp"
                        alt="Kopf des Shariah-Prüfberichts von Al Qalam an WisdomTree Metal Securities, 22. Juni 2026"
                        width={820}
                        height={280}
                        loading="lazy"
                        className="h-auto w-full"
                      />
                    </a>
                    <figcaption className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                      Der Prüfbericht für die WisdomTree-Gold-ETCs, 22. Juni 2026. Quelle: WisdomTree, zum Lesen anklicken.
                    </figcaption>
                  </figure>
                  <Text>
                    <p>
                      Bemerkenswert ehrlich ist dieser Bericht. Er hält fest, dass der AAOIFI-Standard für Gold eine Abwicklung noch am selben Tag
                      verlangt, die Papiere aber erst nach zwei Tagen abgerechnet werden. Das Gremium hält sie dennoch für vertretbar, weil ein anderer
                      Standard eine Verzögerung zulässt, die im Geschäftsverkehr unvermeidbar ist. Man muss dem nicht folgen. Aber es zeigt: Diese
                      Zertifikate sind eine Abwägung, die man nachlesen kann.
                    </p>
                  </Text>

                  <div className="mt-10 space-y-12">
                    {GOLD.map((a, i) => (
                      <article key={a.isin} id={a.slug} className="scroll-mt-24">
                        <h3 className="text-[20px] font-semibold leading-snug text-foreground">
                          {i + 1}. {kurzName(a.name, a.anbieter)}
                          <span className="font-normal text-foreground/70">: {BESONDERS[a.isin]}</span>
                        </h3>
                        <Link to={`/halal-anlagen/${a.slug}`} className="mt-5 block max-w-[420px] overflow-hidden rounded-md border border-border">
                          <img
                            src={`/bilder/blog/halal-gold-kaufen/${a.slug}.webp`}
                            alt={`${a.name} in der finanzmuslim Datenbank: ISIN ${a.isin}, Kosten ${a.kostenLabel} im Jahr und Fondsgröße`}
                            width={716}
                            height={852}
                            loading="lazy"
                            className="h-auto w-full"
                          />
                        </Link>
                        <Text>
                          <p>
                            {a.kostenLabel} im Jahr, also {euro(a.kosten * 100)} bei 10.000 €. {depots(a.isin) ? `Bei ${depots(a.isin)} Depots zu haben.` : ""}{" "}
                            {a.isin === ROYAL_MINT
                              ? "Das Gold liegt im Tresor der Royal Mint in Wales und nicht bei einer Bank, Privatanleger können sich Barren und Münzen ausliefern lassen. Darum ist der Gewinn nach einem Jahr steuerfrei, und wer das Gold in der Hand will, bekommt es."
                              : `Geprüft von ${pruefer(a.zertifizierer)}.`}
                          </p>
                        </Text>
                        <p className="mt-3 text-[16px]">
                          <Link to={`/halal-anlagen/${a.slug}`} className="font-medium text-primary hover:underline">
                            Alle Daten zu {a.name} →
                          </Link>
                        </p>
                      </article>
                    ))}
                  </div>
                </section>

                <AutorAufruf
                  bild={eliasPortrait}
                  etikett="In die Praxis"
                  titel="Welches Depot passt zu dir?"
                  text="Nicht jedes Depot führt alle Gold-ETCs mit Zertifikat, und viele zahlen Zinsen aufs Guthaben. Im Gold-Vergleich siehst du beides auf einen Blick."
                  ziel="/vergleich/edelmetalle"
                  knopf="Zum Gold-Vergleich"
                />

                <section className="mt-14">
                  <Ueber id="sparplan" />
                  <Text>
                    <p>
                      Monatlich 50 Euro in Gold, ist das erlaubt? Der Aufbau kann sauber sein: Du bevollmächtigst den Anbieter, für dein Geld Gold zu
                      kaufen, und dir wird ein bestimmter Anteil gutgeschrieben. Die Probleme liegen an drei Stellen.
                    </p>
                  </Text>
                  <KartenTabelle
                    kopf={["Falle", "Woran du sie erkennst"]}
                    zeilen={[
                      { schluessel: "gebuehr", werte: ["Abschlussgebühr", "Du zahlst 100 Euro, gekauft wird für 92. Der Abzug entspricht keiner Gegenleistung, daran scheitern die meisten Verträge."] },
                      { schluessel: "granulat", werte: ["Granulat statt Barren", "Dir wird Goldgranulat gutgeschrieben, das sich nicht als bestimmter Barren ausliefern lässt. Dann ist unklar, was genau dir gehört."] },
                      { schluessel: "zakat", werte: ["Zakat läuft mit", "Auf den Bestand fallen jedes Jahr 2,5 Prozent an. Über zehn Jahre ist das ein spürbarer Teil, viele rechnen ihn nicht ein."] },
                    ]}
                  />
                  <Text>
                    <p>
                      Einen Sparplan mit Prüfung haben wir gefunden: INAIA aus Deutschland lässt seinen Gold- und Silbersparplan von einer Prüfstelle
                      in Dubai nach den AAOIFI-Kriterien zertifizieren. Für Auvesta und SOLIT haben wir keinen solchen Nachweis gefunden. Das heißt
                      nicht, dass ihre Verträge unzulässig wären, es heißt, dass du sie selbst prüfen musst.
                    </p>
                  </Text>
                </section>

                <section className="mt-14">
                  <Ueber id="altgold" />
                  <Text>
                    <p>
                      Du bringst altes Gold zum Händler, gibst etwas Geld dazu und bekommst einen neuen Barren. Klingt harmlos, ist aber genau der
                      Tausch, den die Regel verbietet: Gold gegen Gold in ungleicher Menge.
                    </p>
                  </Text>
                  <KartenTabelle
                    kopf={["Weg", "So läuft es"]}
                    zeilen={[
                      { schluessel: "falsch", werte: [<Marke ton="rot">Falsch</Marke>, "40 g Altgold + 900 € → 60 g neuer Barren"] },
                      { schluessel: "richtig", werte: [<Marke ton="gruen">Richtig</Marke>, "40 g Altgold → 2.600 €, dann 2.600 € + 900 € → 60 g neuer Barren"] },
                    ]}
                  />
                  <Text>
                    <p>
                      Lass dir das Altgold ankaufen und den Betrag wirklich auszahlen oder überweisen, danach kaufst du. Viele Händler machen das ohne
                      Rückfrage, es kostet nur einen Beleg mehr. Die Zahlen im Beispiel sind erfunden.
                    </p>
                  </Text>
                </section>

                <section className="mt-14">
                  <Ueber id="was-wegfaellt" />
                  <KartenTabelle
                    kopf={["Was", "Warum"]}
                    zeilen={[
                      { schluessel: "raten", werte: ["Gold auf Raten oder auf Kredit", "Verstößt gegen die sofortige Übergabe, beim Kredit kommt der Zins dazu."] },
                      { schluessel: "cfd", werte: ["Gold-CFDs, Hebelprodukte, Futures", "Hier wird auf den Preis gewettet, gekauft wird nichts."] },
                      { schluessel: "verleihen", werte: ["Gold verleihen gegen Ertrag", "Ein festes Entgelt dafür, dass jemand dein Gold nutzt, ist derselbe Fall wie Zins."] },
                      { schluessel: "papier", werte: ["Unbesichertes Papiergold", "Bildet der Anbieter den Preis nur nach, liegt kein Metall dahinter."] },
                      { schluessel: "altgold", werte: ["Altgold plus Zuzahlung gegen neues Gold", "Daraus zwei getrennte Geschäfte machen, wie oben."] },
                    ]}
                  />
                  <Text>
                    <p>
                      Weißgold und Roségold sind Gold, für sie gilt dieselbe Regel. Platin und Palladium gehören nicht zu den Waren, für die diese
                      Sonderregel gilt. Goldschmuck ist erlaubt, als Geldanlage aber der teuerste Weg: Du zahlst die Verarbeitung mit und bekommst
                      beim Verkauf meist nur den Materialwert.
                    </p>
                  </Text>
                </section>

                <section className="mt-14">
                  <Ueber id="steuer-zakat" />
                  <Text>
                    <p>
                      Anlagegold ist beim Kauf von der Umsatzsteuer befreit. Verkaufst du physisches Gold nach mehr als einem Jahr, ist der Gewinn
                      nach derzeitiger Rechtslage steuerfrei. Bei Wertpapieren gilt das, wenn sie dir einen Anspruch auf Lieferung von Gold geben
                      und voll mit Gold gedeckt sind (Bundesfinanzhof, Urteil VIII R 7/17 vom 16.06.2020). Der Royal-Mint-ETC gibt diesen
                      Anspruch. Bei den meisten anderen Gold-ETCs geht das nicht, dort greift die Abgeltungsteuer. Das ist keine Steuerberatung.
                    </p>
                    <p>
                      Zakat wird fällig, sobald du über dem Nisab liegst und das Gold ein Mondjahr besitzt. Der Nisab liegt bei 85 Gramm Gold oder
                      595 Gramm Silber, heute rund {euro(nisab.nisabGoldEuro)} oder {euro(nisab.nisabSilberEuro)}. Drei der vier großen
                      Rechtsschulen nehmen Gold, eine nimmt Silber; mehr dazu in <TL to="/blog/nisab">Nisab</TL>. Der Satz beträgt 2,5 Prozent auf
                      den Wert, nicht auf den Gewinn. Umstritten ist der Schmuck, den eine Frau regelmäßig trägt. Wer sichergehen will, rechnet ihn
                      mit.
                    </p>
                  </Text>
                  <Kernsatz>Gold ist Sparen, kein Investieren. Es zahlt keine Miete und keinen Gewinn. Es hält Kaufkraft.</Kernsatz>
                </section>

                <section className="mt-12">
                  <Ueber id="haeufige-fragen" />
                  <div className="mt-4 max-w-[664px] divide-y divide-border">
                    {FRAGEN.map((f) => (
                      <div key={f.frage} className="py-5 first:pt-1">
                        <h3 className="text-[18px] font-semibold leading-snug text-foreground">{f.frage}</h3>
                        <p className="mt-2 text-[17px] leading-[1.65] text-foreground/75">{f.antwort}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="mt-12">
                  <Ueber id="naechster-schritt" />
                  <Text>
                    <p>
                      Willst du Gold im Depot kaufen, zählt das Depot. Es sollte alle Gold-ETCs mit Zertifikat führen und dir keine Zinsen aufs
                      Guthaben zahlen. Beides siehst du je Depot im <TL to="/vergleich/edelmetalle">Gold-Vergleich</TL>.
                    </p>
                  </Text>
                </section>

                <AnbieterKasten titel="Depots für deine Gold-ETCs" anbieter={ANBIETER} />

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

export default HalalGoldKaufen;
