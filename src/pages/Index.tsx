import { Link } from "react-router-dom";
import {
  ArrowRight,
  Baby,
  Calculator,
  ChevronRight,
  Bitcoin,
  Coins,
  FileText,
  Globe,
  LineChart,
  Percent,
  PiggyBank,
  Receipt,
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

import eliasCutout from "@/assets/elias-freigestellt.webp";
import guideCover from "@/assets/guide-cover-v4.webp";
import newsletterPhone from "@/assets/newsletter-handy-v3.png";
import rechnerRender from "@/assets/rechner.webp";

/** Kacheln wie auf /vergleiche. Ohne Ziel wird eine Kachel nicht gezeigt,
 *  kein "bald" mehr (16.09.2026, Bewerbung bei Partnernetzwerken). */
const categories = [
  { label: "Depot", icon: LineChart, to: "/vergleich/depot" },
  { label: "Girokonto", icon: Wallet, to: "/vergleich/girokonto" },
  { label: "Krypto", icon: Bitcoin, to: "/vergleich/krypto" },
  { label: "Aktien prüfen", icon: ScanSearch, to: "/vergleich/screening-apps" },
  { label: "Edelmetalle", icon: Coins, to: "/vergleich/edelmetalle" },
  { label: "Kinderdepot", icon: Baby },
  { label: "Steuersoftware", icon: FileText, to: "/vergleich/steuersoftware" },
];

/** Neun Rechner. Nur der Brutto-Netto-Rechner existiert noch nicht. */
const calculators = [
  { title: "Zakat-Rechner", to: "/zakat-rechner", icon: Calculator },
  { title: "Renditerechner", to: "/renditerechner", icon: TrendingUp },
  { title: "Auswanderungsrechner", to: "/auswanderungsrechner", icon: Globe },
  { title: "Bereinigungsrechner", to: "/bereinigungsrechner", icon: Sparkles },
  { title: "Budgetrechner", to: "/budgetrechner", icon: PiggyBank },
  { title: "Kreditkostenrechner", to: "/kreditkostenrechner", icon: Percent },
  { title: "Sparzielrechner", to: "/sparzielrechner", icon: Target },
  { title: "Brutto-Netto-Rechner", icon: Receipt },
  { title: "Inflationsrechner", to: "/inflationsrechner", icon: TrendingDown },
];

/** Erste vier sind die beliebtesten. Danach die uebrigen Themen. */
const wissenKarten: WissenKarte[] = [
  {
    thema: "Vorlage",
    titel: "Grün, gelb, rot: welchen Vertrag du unterschreibst",
    to: "/vorlagen/vertrags-ampel",
    motiv: "ampel",
    beliebt: true,
  },
  {
    thema: "Vorlage",
    titel: "21 halal Anlagen, die du wirklich kaufen kannst",
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
    thema: "Vorlage",
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
  { thema: "Investieren", titel: "Gold richtig kaufen", to: "/wissen/halal-gold-kaufen", motiv: "gold", neu: true },
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

const Index = () => (
  <>
    <Seo
      title="Halal investieren in Deutschland | finanzmuslim"
      description="Halal investieren in Deutschland: geprüfte Anlagen, Rechner und Vergleiche. Finde heraus, welches Depot ohne Zinsgeschäft arbeitet."
      path="/"
      jsonLd={startseiteJsonLd}
    />

    {/* Ein durchgehendes Raster. Handy 16px zwischen den Abschnitten, Desktop 24px. */}
    <div className="container space-y-4 py-4 md:space-y-6 md:py-6">
      {/* 1 — Hero-Platte mit Kategorie-Kacheln darunter */}
      <section className="flex flex-col lg:min-h-[calc(100svh-152px)]">
        <div className="relative overflow-hidden rounded-2xl bg-hero px-6 pt-7 lg:h-[480px] lg:px-12 lg:pt-0">
          <div className="mx-auto flex h-full max-w-[1200px] items-center">
            <div className="max-w-[600px] lg:pb-24 lg:pt-4">
              <h1 className="text-[30px] font-bold leading-[1.15] tracking-tight text-foreground md:text-[56px] md:leading-[64px]">
                Investiere, ohne deinen
                <br className="hidden sm:block" /> Glauben zu riskieren
              </h1>
              <p className="mt-4 max-w-[580px] text-[17px] leading-[26px] text-muted-foreground md:mt-6 md:text-[22px] md:leading-[32px]">
                Lerne, wie du dein Geld islamkonform anlegst, Zinsen erkennst und Verträge prüfst.
                Finde die für dich passenden Anbieter in nur wenigen Schritten.
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center md:mt-8">
                <Link
                  to="/vergleich/start"
                  className="inline-flex min-h-[56px] items-center justify-center gap-2 rounded-lg bg-primary px-8 text-[18px] font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
                >
                  Vergleich starten
                  <ArrowRight className="h-5 w-5" aria-hidden />
                </Link>
                <span className="text-center text-[14px] text-muted-foreground sm:text-left">Drei Fragen, keine Anmeldung</span>
              </div>
            </div>
          </div>

          {/* Handy: das Foto steht in der Platte auf der Unterkante, angeschnitten.
              Genau 230px hoch, damit Text und Bild zusammen auf einen Bildschirm passen. */}
          <div className="relative mt-5 h-[230px] overflow-hidden lg:hidden">
            <img
              src={eliasCutout}
              alt="Elias El-Gendy, Gründer von finanzmuslim"
              className="absolute left-1/2 top-0 h-[300px] max-w-none -translate-x-1/2 object-contain object-top"
              loading="eager"
            />
            <div className="absolute bottom-4 right-0 rounded-xl border border-border bg-card px-4 py-2.5">
              <p className="text-[15px] font-bold text-foreground">Elias El-Gendy</p>
              <p className="text-[13px] text-muted-foreground">Gründer von finanzmuslim</p>
            </div>
          </div>

          {/* Desktop: freigestelltes Foto rechts, buendig auf der Unterkante. */}
          <div className="pointer-events-none absolute bottom-0 right-12 hidden h-[445px] w-[420px] max-w-[45%] lg:block xl:right-[calc((100%-1200px)/2)] xl:w-[560px]">
            <div className="h-full w-full overflow-hidden">
              <img
                src={eliasCutout}
                alt=""
                className="h-[680px] w-full object-cover object-top"
                loading="eager"
              />
            </div>
            <div className="absolute bottom-[76px] right-0 rounded-xl border border-border bg-card px-4 py-3">
              <p className="text-[15px] font-bold text-foreground">Elias El-Gendy</p>
              <p className="text-[13px] text-muted-foreground">Gründer von finanzmuslim</p>
            </div>
          </div>
        </div>

        {/* Kacheln ueberlappen auf dem Desktop die Unterkante der Platte um 60px */}
        <div className="relative z-10 mx-auto mt-4 grid w-full max-w-[1200px] grid-cols-2 gap-2.5 md:gap-3 lg:-mt-[60px] lg:grid-cols-3">
          {categories.filter((c) => c.to).map(({ label, icon: Icon, to }) => (
            <Link
              key={label}
              /* Kacheln ohne eigene Seite fuehren auf die Vergleichsuebersicht.
                 Dort stehen sie mit dem Vermerk "bald" und daneben, wie
                 bewertet wird. Vorher ging Girokonto auf die Rechnerseite,
                 das beantwortet die Frage des Nutzers nicht. */
              to={to ?? "/vergleiche"}
              className="group relative flex min-h-[64px] items-center gap-2.5 card-surface px-3 py-2.5 transition-colors hover:border-primary md:min-h-[76px] md:gap-3 md:px-4 md:py-3 lg:pt-7 xl:pt-3"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 md:h-11 md:w-11 md:rounded-full">
                <Icon className="h-[18px] w-[18px] text-primary md:h-5 md:w-5" aria-hidden />
              </span>
              <span className="min-w-0 flex-1 hyphens-auto break-words text-[15px] font-bold leading-tight text-foreground md:text-[18px]">
                {label}
              </span>
              <ArrowRight
                className="hidden h-5 w-5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary md:block"
                aria-hidden
              />
              {!to && (
                <span className="badge-soon absolute right-11 top-1/2 -translate-y-1/2 lg:right-2 lg:top-2 lg:translate-y-0">
                  bald
                </span>
              )}
            </Link>
          ))}
        </div>

        <div className="mt-4 flex justify-center md:mt-6">
          <Link to="/vergleiche" className="btn-primary h-14 px-8 text-[19px]">
            Zu allen Vergleichen
          </Link>
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
            <Link
              to="/newsletter"
              className="mt-5 inline-flex items-center gap-1 text-[17px] font-bold text-primary hover:underline"
            >
              Zur aktuellen Ausgabe
              <ArrowRight className="h-5 w-5" aria-hidden />
            </Link>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-5 flex max-w-[560px] flex-col gap-3 sm:flex-row"
            >
              <label htmlFor="home-newsletter-email" className="sr-only">
                E-Mail-Adresse
              </label>
              <input
                id="home-newsletter-email"
                type="email"
                placeholder="deine@email.de"
                className="h-14 rounded-lg border border-border bg-background px-4 text-[17px] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none sm:h-12 sm:flex-1 sm:text-[16px]"
              />
              <button type="submit" className="btn-primary h-14 sm:h-12">
                Kostenlos anmelden
              </button>
            </form>

            <label className="mt-4 flex max-w-[560px] items-start gap-2 text-[13px] text-muted-foreground">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-border accent-primary"
              />
              <span>
                Ich habe die{" "}
                <Link to="/datenschutz" className="text-primary underline underline-offset-2">
                  Datenschutzerklärung
                </Link>{" "}
                gelesen und stimme ihr zu.
              </span>
            </label>
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
              31 Anlagen an einem Ort: Aktien-ETFs, Fonds, Sukuk, Gold, Silber, Platin und Krypto.
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

export default Index;
