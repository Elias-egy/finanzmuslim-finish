import { Link, useLocation } from "react-router-dom";
import {
  ArrowRight,
  Calculator,
  ChevronRight,
  Bitcoin,
  Coins,
  FileText,
  Globe,
  LineChart,
  Percent,
  PiggyBank,
  ScanSearch,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { InstagramLogo, TikTokLogo, YouTubeLogo } from "@/components/site/SocialLogos";
import Seo, { startseiteJsonLd } from "@/components/Seo";
import WissenSlider, { type WissenKarte } from "@/components/WissenSlider";
import Tagesgewinner from "@/components/Tagesgewinner";
import MotivBild from "@/components/MotivBild";
import FreitagsbriefFormular from "@/components/FreitagsbriefFormular";
import { ausgabePfad, neuesteZuerst } from "@/data/newsletterAusgaben";
import { ANZAHL_KAUFBAR } from "@/data/halalAnlagenZahl";
import { ANZAHL_HALAL_ANLAGEN } from "@/data/anzahlen";

import eliasCutout from "@/assets/elias-freigestellt.webp";
import eliasKreis from "@/assets/elias-kreis.webp";
import guideCover from "@/assets/guide-cover-v4.webp";
import newsletterPhone from "@/assets/newsletter-handy-v3.webp";
import rechnerRender from "@/assets/rechner.webp";

/** Kacheln wie auf /vergleiche. Ohne Ziel wird eine Kachel nicht gezeigt,
 *  kein "bald" mehr (16.09.2026, Bewerbung bei Partnernetzwerken). */
const categories = [
  { label: "Depot", icon: LineChart, to: "/vergleich/depot" },
  { label: "Girokonto", icon: Wallet, to: "/vergleich/girokonto" },
  { label: "Krypto", icon: Bitcoin, to: "/vergleich/krypto" },
  { label: "Halal-Aktien-Apps", icon: ScanSearch, to: "/vergleich/screening-apps" },
  { label: "Edelmetalle", icon: Coins, to: "/vergleich/edelmetalle" },
  { label: "Steuer\u00ADsoftware", icon: FileText, to: "/vergleich/steuersoftware" },
];

/** Acht Rechner, jeder mit eigener Seite. */
const calculators = [
  { title: "Zakat-Rechner", to: "/zakat-rechner", icon: Calculator },
  { title: "Renditerechner", to: "/renditerechner", icon: TrendingUp },
  { title: "Auswanderungsrechner", to: "/auswanderungsrechner", icon: Globe },
  { title: "Dividenden reinigen", to: "/bereinigungsrechner", icon: Sparkles },
  { title: "Budgetrechner", to: "/budgetrechner", icon: PiggyBank },
  { title: "Zinskosten-Rechner", to: "/kreditkostenrechner", icon: Percent },
  { title: "Sparzielrechner", to: "/sparzielrechner", icon: Target },
  { title: "Inflationsrechner", to: "/inflationsrechner", icon: TrendingDown },
];

/** Erste vier sind die beliebtesten. Danach die uebrigen Themen. */
const wissenKarten: WissenKarte[] = [
  {
    thema: "Liste",
    titel: "Haram oder halal: 12 Verträge aus dem Alltag",
    to: "/vorlagen/vertrags-ampel",
    motiv: "ampel",
    beliebt: true,
  },
  {
    thema: "Liste",
    titel: `${ANZAHL_KAUFBAR} halal Anlagen, die du wirklich kaufen kannst`,
    to: "/vorlagen/halal-anlagen",
    motiv: "liste",
    beliebt: true,
  },
  {
    thema: "Datenbank",
    titel: "Halal-Anlagen finden",
    to: "/halal-anlagen",
    motiv: "datenbank",
    beliebt: true,
  },
  {
    thema: "Liste",
    titel: "Ist diese Aktie halal?",
    to: "/vorlagen/aktien-check",
    motiv: "spickzettel",
    beliebt: true,
  },
  {
    thema: "Investieren",
    titel: "Ist Bitcoin halal?",
    to: "/wissen/ist-bitcoin-halal",
    motiv: "krypto",
    neu: true,
  },
  {
    thema: "Alltag",
    titel: "Haus kaufen ohne Zinsen",
    to: "/wissen/haus-kaufen-ohne-zinsen",
    motiv: "haus",
    neu: true,
  },
  {
    thema: "Alltag",
    titel: "Ist Ratenzahlung haram?",
    to: "/wissen/ratenzahlung-haram",
    motiv: "raten",
  },
  {
    thema: "Alltag",
    titel: "Ist eine Versicherung haram?",
    to: "/wissen/ist-versicherung-haram",
    motiv: "versicherung",
  },
  {
    thema: "Alltag",
    titel: "Halal Kredit ohne Zinsen",
    to: "/wissen/halal-kredit-ohne-zinsen",
    motiv: "kredit",
    neu: true,
  },
  { thema: "Grundlagen", titel: "Zinsen im Islam", to: "/wissen/zinsen-im-islam", motiv: "zins" },
  { thema: "Investieren", titel: "Halal Gold kaufen", to: "/wissen/halal-gold-kaufen", motiv: "gold", neu: true },
  { thema: "Alltag", titel: "Girokonto ohne Zinsen", to: "/wissen/girokonto-ohne-zinsen", motiv: "karte", neu: true },
  { thema: "Alltag", titel: "Ist Leasing haram?", to: "/wissen/ist-leasing-haram", motiv: "auto", neu: true },
  { thema: "Grundlagen", titel: "Unsicherheit im Vertrag (Gharar)", to: "/wissen/gharar", motiv: "gharar", neu: true },
  { thema: "Grundlagen", titel: "Glücksspiel (Maysir)", to: "/wissen/maysir", motiv: "maysir", neu: true },
  { titel: "Alle Beiträge ansehen", to: "/wissen", schlicht: true },
];

const kanaele = [
  {
    name: "Instagram",
    href: "https://instagram.com/finanz.muslim",
    Logo: InstagramLogo,
    handle: "@finanz.muslim",
  },
  {
    name: "TikTok",
    href: "https://tiktok.com/@finanz.muslim",
    Logo: TikTokLogo,
    handle: "@finanz.muslim",
  },
  {
    name: "YouTube",
    href: "https://youtube.com/@finanz.muslim",
    Logo: YouTubeLogo,
    handle: "@finanz.muslim",
  },
];

/** Kleine Zeilenkachel unter einem Themenblock: Symbol, Text, Chevron. */
const Zeile = ({
  titel,
  to,
  icon: Icon,
  etikett,
  nurAbMd = false,
}: {
  titel: string;
  to?: string;
  icon: typeof Calculator;
  etikett?: React.ReactNode;
  /** Auf dem Handy ausblenden. Die Liste dort endet nach vier Zeilen. */
  nurAbMd?: boolean;
}) =>
  to ? (
    <Link to={to} className={`group row-tile ${nurAbMd ? "max-md:hidden" : ""}`}>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
        <Icon className="h-[22px] w-[22px] text-primary" aria-hidden />
      </span>
      <span className="flex min-w-0 flex-1 flex-wrap items-center gap-2 text-[17px] font-bold text-foreground group-hover:text-primary">
        {titel}
        {etikett}
      </span>
      <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" aria-hidden />
    </Link>
  ) : (
    <div aria-disabled="true" className="row-tile border-border bg-muted opacity-60">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-background">
        <Icon className="h-[22px] w-[22px] text-muted-foreground" aria-hidden />
      </span>
      <span className="min-w-0 flex-1 text-[17px] font-bold text-muted-foreground">{titel}</span>
      <span className="badge-soon shrink-0">bald</span>
    </div>
  );

/** Neueste verschickte Ausgabe. Ohne Ausgabe entfällt der Link, statt ins Leere zu führen. */
const aktuelleAusgabe = neuesteZuerst()[0];

const Index = () => {
  // FOTO1 Vorschau: ?handy=a (ohne Gesicht), b (Kreis unter der Unterzeile), c (Kreis neben dem Titel).
  const handy = new URLSearchParams(useLocation().search).get("handy") ?? "jetzt";
  const neu = handy !== "jetzt";
  return (
  <>
    <Seo
      title="Halal investieren in Deutschland | finanzmuslim"
      description="Halal investieren in Deutschland: geprüfte Anlagen, Rechner und Vergleiche. Finde heraus, welches Depot ohne Zinsgeschäft arbeitet."
      path="/"
      jsonLd={startseiteJsonLd}
    />

    {/* Ein durchgehendes Raster. Handy 16px zwischen den Abschnitten, Desktop 24px. */}
    <div className="container space-y-4 py-4 md:space-y-6 md:py-6">
      {/* 1 — Hero-Platte mit Kategorie-Kacheln darunter. Kein Knopf "Zu allen Vergleichen":
          bei sechs Vergleichen stehen alle als Kachel da (Elias, 14.10.2026).
          Ab Tablet fuellt der Abschnitt genau den ersten Bildschirm: Platte oben, die sechs Vergleiche
          unten, der Guide beginnt erst darunter (Elias, 14.10.2026: "die Hauptseite muss vollstaendig
          sein"); 154 ist Kopf plus Abstaende, am Laptop 190: die Kacheln stehen gut einen Zentimeter ueber
          der Fensterkante (Elias, 15.10.2026). Das Tablet fuellt die Flaeche mit grossen Kacheln, der
          Laptop mit dem Foto. Am Handy wie bei Finanzfluss: Ueberschrift, Unterzeile, Foto, darunter
          der Knopf mit Abstand zur Safari-Leiste; die Vergleiche beginnen erst im zweiten Bildschirm ("Finde, was zu
          dir passt unter mir", Elias, 14.10.2026, V13 Fassung B). Die Platte ist 76px kuerzer als das Fenster,
          hoechstens 720px; die Reihenfolge stellt flex-order her, die Huellen sind am Handy display:contents. */}
      <section className="flex flex-col md:min-h-[calc(100svh-154px)] lg:min-h-[calc(100svh-190px)]">
        <div className={`relative flex ${neu ? "" : "min-h-[min(calc(100svh-76px),720px)]"} flex-1 flex-col overflow-hidden rounded-2xl bg-hero px-4 pb-16 ${neu ? "pt-6" : "pt-8 kurz:pt-6"} md:min-h-0 md:justify-center md:px-10 md:pb-[96px] md:pt-10 lg:min-h-[480px] lg:px-12 lg:py-0`}>
          <div className="mx-auto w-full max-w-[1200px] max-md:contents">
            <div className="max-w-[680px] max-md:contents lg:pb-[76px] lg:pt-4">
              <h1 className={`max-md:order-1 ${handy === "c" ? "max-md:pr-[92px]" : ""} text-[30px] kurz:text-[28px] font-bold leading-[1.15] tracking-tight [text-wrap:balance] text-foreground md:text-[56px] md:leading-[64px] xl:text-[64px] xl:leading-[72px]`}>
                Investiere, ohne deinen
                <br className="hidden sm:block" /> Glauben zu riskieren
              </h1>
              <p className="max-md:order-2 mt-3 kurz:mt-2 max-w-[680px] text-[17px] [text-wrap:balance] leading-[26px] text-muted-foreground md:mt-6 md:text-[22px] md:leading-[32px]">
                Lerne, wie du dein Geld islamkonform anlegst und Zinsen erkennst.
                {/* Am Handy sagt der Knopf direkt darunter dasselbe. */}
                <span className="hidden md:inline"> Finde die passenden Produkte in wenigen Schritten.</span>
              </p>
              <div className="max-md:order-4 mt-4 md:mt-6 flex flex-col gap-3 sm:flex-row sm:items-center lg:mt-10 lg:flex-col lg:items-start xl:flex-row xl:items-center">
                <Link
                  to="/vergleich/start"
                  className="inline-flex min-h-[56px] items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-primary px-5 text-[18px] font-semibold text-primary-foreground transition-colors hover:bg-primary-hover sm:px-8 lg:min-h-[60px] lg:px-10 lg:text-[20px]"
                >
                  Finde, was zu dir passt
                  <ArrowRight className="h-5 w-5" aria-hidden />
                </Link>
              </div>
            </div>
          </div>

          {/* Handy: Foto zwischen Unterzeile und Knopf, wie bei Finanzfluss; es fuellt den Rest des ersten
              Bildschirms. Ohne Gesicht wirkte die Platte "gefuehlslos" und
              leer (Elias, 14.10.2026 abends); die Vergleiche stehen jetzt am Ende des ersten Bildschirms
              und darunter. Ueberschrift und Knopf bleiben oben (SRC-025: kein Bild davor). Tablet ohne Foto. */}
          {handy === "b" && (
            <div className="max-md:order-3 mt-4 flex items-center gap-3 md:hidden">
              <img src={eliasKreis} alt="" width={48} height={48} className="h-12 w-12 shrink-0 rounded-full" />
              <p className="leading-tight">
                <span className="block text-[15px] font-bold text-foreground">Elias El-Gendy</span>
                <span className="block text-[13px] text-muted-foreground">Gründer von finanzmuslim</span>
              </p>
            </div>
          )}
          {handy === "c" && (
            <img
              src={eliasKreis}
              alt=""
              width={76}
              height={76}
              className="absolute right-4 top-6 h-[76px] w-[76px] rounded-full md:hidden"
            />
          )}
          <div className={`relative max-md:order-3 mt-3 min-h-[190px] flex-1 overflow-hidden md:hidden ${neu ? "hidden" : ""}`}>
            <img
              src={eliasCutout}
              alt=""
              className="absolute left-1/2 top-0 h-[158%] w-auto max-w-none -translate-x-1/2"
              loading="eager"
            />
            <div className="absolute bottom-3 right-2 rounded-lg border border-border bg-card px-3 py-1.5">
              <p className="text-[14px] font-bold leading-5 text-foreground">Elias El-Gendy</p>
              <p className="text-[12px] leading-4 text-muted-foreground">Gründer von finanzmuslim</p>
            </div>
          </div>

          {/* Desktop: freigestelltes Foto rechts, buendig auf der Unterkante. Es waechst mit der
              Platte bis knapp unter ihre Oberkante, wie bei Finanzfluss; sonst bleibt ueber dem Kopf
              eine leere Flaeche ("ein bisschen zu leer", Elias, 14.10.2026). Der Ausschnitt bleibt
              gleich: sichtbar sind die oberen zwei Drittel des Bildes. Es laeuft bis zur Unterkante der
              Platte durch und liegt hinter der Kachelreihe ("soll bis zur blauen Linie gehen, auch wenn er
              nicht hundertprozentig sichtbar ist", Elias, 15.10.2026); das Schild steht ueber den Kacheln. Unter xl
              schmaler und weiter rechts, der Hinweis steht dort unter dem Knopf: sonst liegen Haare
              oder Jacke auf dem Text. */}
          <div className="pointer-events-none absolute bottom-0 right-6 hidden h-[calc(100%-32px)] max-h-[505px] w-[440px] max-w-[48%] lg:block xl:right-[calc((100%-1200px)/2)] xl:max-h-[660px] xl:w-[560px]">
            <div className="h-full w-full overflow-hidden">
              <img
                src={eliasCutout}
                alt=""
                className="h-[calc((100%-60px)*1.53)] w-full object-cover object-top"
                loading="eager"
              />
            </div>
            <div className="absolute bottom-[76px] right-0 rounded-xl border border-border bg-card px-4 py-3">
              <p className="text-[15px] font-bold text-foreground">Elias El-Gendy</p>
              <p className="text-[13px] text-muted-foreground">Gründer von finanzmuslim</p>
            </div>
          </div>
        </div>

        {/* Handy: eine Reihe je Thema untereinander, Symbol links, Name, Pfeil rechts ("eine Reihe je
            Thema", Elias, 15.10.2026); Tablet zwei Spalten, die Kacheln fuellen dort die Hoehe statt
            einer leeren Platte. Auf allen Breiten ragen
            die Kacheln eingerueckt in die Platte, statt abgetrennt darunter zu stehen ("wie auf Laptop",
            Elias, 14.10.2026); die Platte traegt dafuer unten den Ueberstand als Polster.
            Ab lg Zeilenkacheln; auf dem Desktop ueberlappen sie die Platte um 60px. */}
        <div className="relative z-10 mx-auto -mt-11 grid w-[calc(100%-32px)] max-w-[1200px] auto-rows-fr grid-cols-1 gap-2 md:-mt-14 md:w-[calc(100%-48px)] md:grid-cols-2 md:gap-3 lg:-mt-[60px] lg:grid-cols-3 xl:w-full">
          {categories.filter((c) => c.to).map(({ label, icon: Icon, to }) => (
            <Link
              key={label}
              to={to}
              className="group relative flex min-h-[60px] flex-row items-center justify-start gap-3 card-surface px-4 py-2.5 text-left transition-colors hover:border-primary md:min-h-[140px] md:flex-col md:justify-center md:gap-3 md:px-2 md:pb-2.5 md:pt-3 md:text-center lg:min-h-[76px] lg:flex-row lg:justify-start lg:gap-3 lg:px-4 lg:py-3 lg:text-left"
            >
              {/* Am Handy und ab lg das Zeichen im hellblauen Kreis wie in einer Liste, am Tablet frei. */}
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 md:h-9 md:w-9 md:rounded-none md:bg-transparent lg:h-11 lg:w-11 lg:rounded-full lg:bg-primary/10">
                <Icon className="h-5 w-5 text-primary md:h-8 md:w-8 lg:h-5 lg:w-5" aria-hidden />
              </span>
              <span className="min-w-0 flex-1 hyphens-manual text-[16px] font-bold leading-tight text-foreground md:w-full md:flex-none md:text-[18px] lg:w-auto lg:flex-1">
                {label}
              </span>
              <ArrowRight
                className="h-5 w-5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary md:hidden lg:block"
                aria-hidden
              />
            </Link>
          ))}
        </div>
      </section>

      {/* 2 — Guide */}
      <section className="section-card">
        <div className="section-inner grid items-center gap-2 lg:grid-cols-[380px_1fr] lg:gap-16">
          <img
            src={guideCover}
            alt="Der Halal Investment Guide als Buch"
            className="mx-auto max-h-[220px] w-auto object-contain lg:max-h-none lg:w-[380px]"
            loading="lazy"
          />
          <div>
            <p className="eyebrow">Guide</p>
            <h2 className="section-title mt-2">Der Halal Investment Guide</h2>
            <p className="section-text mt-3 max-w-[640px]">
              Der Guide erklärt dir die Grundprinzipien islamkonformer Geldanlage und welche
              Anlageklassen infrage kommen.
              <span className="hidden md:inline">
                {" "}
                Dazu bekommst du eine Prüfreihenfolge, mit der du Schritt für Schritt startest.
              </span>
            </p>
            <Link to="/halal-guide" className="btn-primary mt-6 lg:mt-8">
              Guide kostenlos sichern
            </Link>
          </div>
        </div>
      </section>

      {/* 3 — Newsletter */}
      <section className="section-card">
        <div className="section-inner grid items-center gap-2 lg:grid-cols-[1fr_420px] lg:gap-16">
          <img
            src={newsletterPhone}
            alt="Newsletter-Ausgabe auf dem Smartphone"
            className="mx-auto -mb-2 max-h-[340px] w-auto object-contain lg:order-2 lg:mb-0 lg:max-h-none lg:w-[420px]"
            loading="lazy"
          />

          <div className="lg:order-1">
            <p className="eyebrow">Newsletter</p>
            <h2 className="section-title mt-2">Jede Woche ein Schritt näher</h2>
            <p className="section-text mt-3 max-w-[640px]">
              Jeden Freitag das Wichtigste für dein Geld: geprüfte Anlagen, Fristen und Antworten.
              Jederzeit abbestellbar.
            </p>

            {/* Wie bei Finanzfluss: erst der Blick in die letzte Ausgabe,
                dann das Feld. Wer sieht, was drin steht, traegt sich eher ein. */}
            {aktuelleAusgabe && (
              <Link
                to={ausgabePfad(aktuelleAusgabe)}
                className="mt-5 inline-flex items-center gap-1 text-[17px] font-bold text-primary hover:underline"
              >
                Zur aktuellen Ausgabe
                <ArrowRight className="h-5 w-5" aria-hidden />
              </Link>
            )}

            <FreitagsbriefFormular id="home-newsletter-email" variante="startseite" />
          </div>
        </div>
      </section>

      {/* 4 — Anlagen */}
      <section className="section-card">
        <div className="section-inner grid items-center gap-4 lg:grid-cols-[500px_1fr] lg:gap-16">
          <Tagesgewinner />

          <div>
            <p className="eyebrow">HALAL INVESTMENTS</p>
            <h2 className="section-title mt-2">Welche Anlagen wirklich geprüft sind</h2>
            <p className="section-text mt-3 max-w-[640px]">
              {ANZAHL_HALAL_ANLAGEN} Anlagen an einem Ort: Aktien-ETFs, Fonds, Sukuk, Gold, Silber, Platin und Krypto.
              <span className="hidden md:inline">
                {" "}
                Such nach Name, Kürzel oder ISIN und sortier nach Kosten, Größe oder Rendite.
              </span>
            </p>
            <Link to="/halal-anlagen" className="btn-primary mt-6">
              Zu den Anlagen
            </Link>
          </div>
        </div>
      </section>

      {/* 5 — Rechner */}
      <section className="section-card">
        <div className="section-inner">
          <div className="grid gap-2 lg:grid-cols-[1fr_420px] lg:items-start lg:gap-16">
            <img
              src={rechnerRender}
              alt="Taschenrechner mit Geldscheinen und Münzen"
              className="mx-auto max-h-[200px] w-auto object-contain lg:order-2 lg:max-h-none lg:w-[420px]"
              loading="lazy"
            />
            <div className="lg:order-1">
              <p className="eyebrow">Rechner</p>
              <h2 className="section-title mt-2">Rechnen, prüfen, planen</h2>
              <p className="section-text mt-3 hidden max-w-[640px] md:block">
                Werkzeuge, die dir Klarheit über deine Zahlen geben, bevor du eine Entscheidung
                triffst.
              </p>
              <Link to="/rechner" className="btn-primary mt-6 lg:mt-8">
                Zu allen Rechnern
              </Link>
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3 md:gap-4 lg:mt-10">
            {calculators.filter((c) => c.to).map(({ title, to, icon: Icon }, i) => (
              <Zeile
                key={title}
                nurAbMd={i >= 4}
                titel={title}
                to={to}
                icon={Icon}
                etikett={title === "Zakat-Rechner" ? <span className="badge-new">Neu</span> : undefined}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 6 — Wissen */}
      <section className="section-card">
        <div className="section-inner">
          <p className="eyebrow">Wissen</p>
          <h2 className="section-title mt-2">Verstehen, bevor du anlegst</h2>
          <p className="section-text mt-3 max-w-[640px]">
            Von Zinsen über Ratenkauf bis Gold: die Themen, die im Alltag wirklich vorkommen.
          </p>

          <div className="mt-6 lg:mt-10">
            <WissenSlider karten={wissenKarten} />
          </div>

          <div className="mt-6 flex justify-center lg:mt-8">
            <Link to="/wissen" className="btn-primary">
              Zum Wissensbereich
            </Link>
          </div>
        </div>
      </section>

      {/* 7 — Kanäle */}
      <section className="section-card">
        <div className="section-inner">
          <p className="eyebrow">Kanäle</p>
          <h2 className="section-title mt-2">Folge mir</h2>

          <div className="mt-6 grid gap-3 md:grid-cols-3 md:gap-4">
            {kanaele.map(({ name, href, Logo, handle }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group row-tile"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center">
                  <Logo className="h-9 w-9" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[17px] font-bold text-foreground group-hover:text-primary">
                    {name}
                  </span>
                  <span className="block text-[14px] text-muted-foreground">{handle}</span>
                </span>
                <ChevronRight
                  className="h-5 w-5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary"
                  aria-hidden
                />
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  </>
  );
};

export default Index;
