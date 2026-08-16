import { Link } from "react-router-dom";
import {
  ArrowRight,
  Baby,
  Calculator,
  CreditCard,
  Coins,
  FileText,
  Globe,
  LineChart,
  PiggyBank,
  Receipt,
  ChevronRight,
  Search,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { InstagramLogo, TikTokLogo, YouTubeLogo } from "@/components/site/SocialLogos";
import Seo from "@/components/Seo";
import WissenSlider, { type WissenKarte } from "@/components/WissenSlider";
import DatenbankVorschau from "@/components/DatenbankVorschau";

import eliasCutout from "@/assets/elias-freigestellt.png";
import guideCover from "@/assets/guide-cover-v3.png.asset.json";
import newsletterPhone from "@/assets/newsletter-handy-v3.png.asset.json";
import rechnerRender from "@/assets/rechner.png.asset.json";

const categories = [
  { label: "Depot", icon: LineChart, to: "/vergleich/depot" },
  { label: "Girokonto", icon: Wallet },
  { label: "Halal-Screening", icon: ShieldCheck },
  { label: "Gold", icon: Coins },
  { label: "Geld ins Ausland", icon: Globe },
  { label: "Karte ohne Kredit", icon: CreditCard },
  { label: "Steuersoftware", icon: FileText },
  { label: "Kinderdepot", icon: Baby },
];

/** Genau sechs Rechner. Nur die ersten zwei existieren. */
const calculators = [
  { title: "Zakat-Rechner", to: "/zakat-rechner", icon: Calculator },
  { title: "Renditerechner", to: "/renditerechner", icon: TrendingUp },
  { title: "Auswanderungsrechner", icon: Globe },
  { title: "Budgetrechner", icon: PiggyBank },
  { title: "Brutto-Netto-Rechner", icon: Receipt },
  { title: "Inflationsrechner", icon: TrendingDown },
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
  { thema: "Grundlagen", titel: "Zins (Riba)", to: "/wissen/was-ist-riba", motiv: "zins" },
  { thema: "Investieren", titel: "Gold richtig kaufen", motiv: "gold" },
  { thema: "Alltag", titel: "Finanzierung", motiv: "kredit" },
  { thema: "Alltag", titel: "Leasing und Autoabo", motiv: "auto" },
  { thema: "Grundlagen", titel: "Unsicherheit im Vertrag (Gharar)", motiv: "gharar" },
  { thema: "Grundlagen", titel: "Glücksspiel (Maysir)", motiv: "maysir" },
  { titel: "Alle Beiträge ansehen", to: "/wissen", schlicht: true },
];

const Index = () => (
  <>
    <Seo
      title="finanzmuslim – Islamkonform investieren, verständlich erklärt"
      description="Wissen, Rechner und Vergleiche für islamkonforme Finanzen: Riba erkennen, halal investieren und die richtigen Anbieter finden."
      path="/"
    />

    {/* Ein durchgehendes Raster: 24px zwischen allen Abschnitten, Ruhe entsteht innen. */}
    <div className="container space-y-6 py-6">
      {/* 1 — Hero-Platte mit ueberlappenden Kategorie-Kacheln */}
      {/* Die erste Bildschirmseite endet genau an der Unterkante dieses Abschnitts:
          Kopfzeile + Hinweisstreifen (ca. 128px) + Aussenabstaende (48px). */}
      <section className="flex flex-col md:min-h-[calc(100svh-152px)]">
        <div className="relative overflow-hidden rounded-2xl bg-hero px-5 pb-8 pt-8 md:h-[480px] md:px-12 md:pb-0">
          <div className="mx-auto flex h-full max-w-[1200px] items-center">
            <div className="max-w-[600px] py-4">
              <h1 className="text-[36px] font-bold leading-[1.12] tracking-tight text-foreground md:text-[56px] md:leading-[64px]">
                Investiere, ohne deinen
                <br className="hidden sm:block" /> Glauben zu riskieren
              </h1>
              <p className="mt-6 max-w-[580px] text-[18px] leading-relaxed text-muted-foreground md:text-[22px] md:leading-[32px]">
                Lerne, wie du dein Geld islamkonform anlegst, Zinsen erkennst und die richtigen Anbieter
                findest. Verständlich erklärt, ohne Fachchinesisch.
              </p>

              {/* Handy: Namenskarte sichtbar, weil das Foto dort nicht gezeigt wird. */}
              <div className="mt-6 inline-block rounded-xl border border-border bg-card px-4 py-3 lg:hidden">
                <p className="text-[15px] font-bold text-foreground">Elias El-Gendy</p>
                <p className="text-[13px] text-muted-foreground">Gründer von finanzmuslim</p>
              </div>
            </div>
          </div>

          {/* Freigestelltes Foto: steht buendig auf der Unterkante der Platte,
              ueberlappt die Kacheln nicht und bleibt innerhalb der Platte. */}
          <div className="pointer-events-none absolute bottom-0 right-12 hidden h-[445px] w-[420px] max-w-[45%] lg:block xl:right-[calc((100%-1200px)/2)] xl:w-[560px]">
            <div className="h-full w-full overflow-hidden">
            <img
              src={eliasCutout}
              alt="Elias El-Gendy, Gründer von finanzmuslim"
              className="h-[680px] w-full object-cover object-top"
              loading="eager"
            />
            </div>
            {/* Namenskarte ueberlappt das Foto unten rechts, bleibt in der Platte. */}
            <div className="absolute bottom-[76px] right-0 rounded-xl border border-border bg-card px-4 py-3">
              <p className="text-[15px] font-bold text-foreground">Elias El-Gendy</p>
              <p className="text-[13px] text-muted-foreground">Gründer von finanzmuslim</p>
            </div>
          </div>
        </div>

        {/* Kacheln ueberlappen die Unterkante der Platte um 60px */}
        <div className="relative z-10 mx-auto mt-4 grid w-full max-w-[1200px] grid-cols-1 gap-3 md:-mt-[60px] md:grid-cols-2 lg:grid-cols-4">
          {categories.map(({ label, icon: Icon, to }) => (
            <Link
              key={label}
              to={to ?? "/tools"}
              className="group relative flex min-h-[72px] items-center gap-3 card-surface px-4 py-3 transition-colors hover:border-primary md:min-h-[76px] md:pt-7 lg:pt-3"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 md:rounded-full">
                <Icon className="h-5 w-5 text-primary" aria-hidden />
              </span>
              <span className="min-w-0 flex-1 text-[16px] font-bold text-foreground md:text-[18px]">
                {label}
              </span>
              <ChevronRight
                className="h-5 w-5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary md:hidden"
                aria-hidden
              />
              <ArrowRight
                className="hidden h-5 w-5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary md:block"
                aria-hidden
              />
              {!to && (
                <span className="badge-soon absolute right-11 top-1/2 -translate-y-1/2 md:right-2 md:top-2 md:translate-y-0">
                  bald
                </span>
              )}
            </Link>
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <Link to="/vergleiche" className="btn-primary h-14 w-full px-8 text-[19px] sm:w-auto">
            Zu allen Vergleichen
          </Link>
        </div>
      </section>

      {/* 2 — Guide: Bild links, Text rechts */}
      <section className="section-card">
        <div className="section-inner grid items-center gap-10 lg:grid-cols-[380px_1fr] lg:gap-16">
          <img
            src={guideCover.url}
            alt="Der Halal Investment Guide als Buch"
            className="mx-auto w-full max-w-[380px] lg:w-[380px]"
            loading="lazy"
          />
          <div>
            <p className="eyebrow">Guide</p>
            <h2 className="mt-3 text-[30px] font-semibold leading-tight text-foreground md:text-[40px] md:leading-[48px]">
              Der Halal Investment Guide
            </h2>
            <p className="mt-5 max-w-[640px] text-[17px] leading-relaxed text-muted-foreground md:text-[20px] md:leading-[28px]">
              Der Guide erklärt dir die Grundprinzipien islamkonformer Geldanlage und welche
              Anlageklassen infrage kommen. Dazu bekommst du eine Prüfreihenfolge, mit der du Schritt
              für Schritt startest.
            </p>
            <Link to="/halal-guide" className="btn-primary mt-8 w-full sm:w-auto">
              Guide kostenlos sichern
            </Link>
          </div>
        </div>
      </section>

      {/* 3 — Newsletter: Text links, Platzhalter rechts */}
      <section className="section-card lg:min-h-[500px]">
        <div className="section-inner grid items-center gap-10 lg:grid-cols-[1fr_420px] lg:gap-16">
          <div>
            <p className="eyebrow">Newsletter</p>
            <h2 className="mt-3 text-[30px] font-semibold leading-tight text-foreground md:text-[40px] md:leading-[48px]">
              Jede Woche ein Schritt näher an halal Vermögen
            </h2>
            <p className="mt-5 max-w-[640px] text-[17px] leading-relaxed text-muted-foreground md:text-[20px] md:leading-[28px]">
              Ein kurzer Newsletter mit einem konkreten Schritt für deine Finanzen. Verständlich
              erklärt, jederzeit abbestellbar.
            </p>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-8 flex max-w-[560px] flex-col gap-3 sm:flex-row"
            >
              <label htmlFor="home-newsletter-email" className="sr-only">
                E-Mail-Adresse
              </label>
              <input
                id="home-newsletter-email"
                type="email"
                placeholder="deine@email.de"
                className="h-12 flex-1 rounded-md border border-border bg-background px-4 text-[16px] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
              <button type="submit" className="btn-primary w-full sm:w-auto">
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

          <img
            src={newsletterPhone.url}
            alt="Newsletter-Ausgabe auf dem Smartphone"
            className="mx-auto w-full max-w-[420px] lg:w-[420px]"
            loading="lazy"
          />
        </div>
      </section>

      {/* 4 — Finde halal Anlagen: Vorschau links, Text rechts */}
      <section className="section-card">
        <div className="section-inner grid items-center gap-10 lg:grid-cols-[500px_1fr] lg:gap-16">
          <DatenbankVorschau />

          <div>
            <p className="eyebrow">Halal-Datenbank</p>
            <h2 className="mt-3 text-[30px] font-semibold leading-tight text-foreground md:text-[40px] md:leading-[48px]">
              Finde halal Anlagen
            </h2>
            <p className="mt-5 max-w-[640px] text-[17px] leading-relaxed text-muted-foreground md:text-[20px] md:leading-[28px]">
              23 geprüfte Anlagen an einem Ort: Aktien-ETFs, Fonds, Sukuk, Gold und Silber. Mit Kosten,
              Fondsgröße und der Stelle, die sie geprüft hat. Such nach Name, Anbieter oder ISIN, filter nach
              Kategorie und sortier nach dem, was dir wichtig ist.
            </p>
            <Link to="/halal-anlagen" className="btn-primary mt-6 w-full sm:w-auto">
              Zur Halal-Datenbank
            </Link>
          </div>
        </div>
      </section>

      {/* 5 — Rechner */}
      <section className="section-card">
        <div className="section-inner">
          <div className="grid gap-10 lg:grid-cols-[1fr_420px] lg:items-start lg:gap-16">
            <div>
              <p className="eyebrow">Rechner</p>
              <h2 className="mt-3 text-[30px] font-semibold leading-tight text-foreground md:text-[40px] md:leading-[48px]">
                Rechnen, prüfen, planen
              </h2>
              <p className="mt-5 max-w-[640px] text-[17px] leading-relaxed text-muted-foreground md:text-[20px] md:leading-[28px]">
                Werkzeuge, die dir Klarheit über deine Zahlen geben, bevor du eine Entscheidung
                triffst.
              </p>
              <Link to="/rechner" className="btn-primary mt-8 w-full sm:w-auto">
                Zu allen Rechnern
              </Link>
            </div>
            <img
              src={rechnerRender.url}
              alt="Taschenrechner mit Geldscheinen und Münzen"
              className="mx-auto w-full max-w-[420px] lg:w-[420px]"
              loading="lazy"
            />
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {calculators.map(({ title, to, icon: Icon }) =>
              to ? (
                <Link
                  key={title}
                  to={to}
                  className="group flex items-center gap-3 card-surface p-5 transition-colors hover:border-primary"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-[22px] w-[22px] text-primary" aria-hidden />
                  </span>
                  <span className="flex flex-wrap items-center gap-2 text-[18px] font-bold text-foreground group-hover:text-primary">
                    {title}
                    {title === "Zakat-Rechner" && <span className="badge-new">Neu</span>}
                  </span>
                </Link>
              ) : (
                <div
                  key={title}
                  aria-disabled="true"
                  className="relative flex items-center gap-3 rounded-2xl border border-border bg-muted p-5 pr-14 opacity-60"
                >
                  <span className="badge-soon absolute right-3 top-1/2 -translate-y-1/2">bald</span>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-background">
                    <Icon className="h-5 w-5 text-muted-foreground" aria-hidden />
                  </span>
                  <span className="min-w-0 break-words text-[18px] font-bold text-muted-foreground">{title}</span>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* 6 — Wissen */}
      <section className="section-card">
        <div className="section-inner">
          <p className="eyebrow">Wissen</p>
          <h2 className="mt-3 text-[30px] font-semibold leading-tight text-foreground md:text-[40px] md:leading-[48px]">
            Finanzwissen, das dich weiterbringt
          </h2>

          <div className="mt-10">
            <WissenSlider karten={wissenKarten} />
          </div>

          <div className="mt-8 flex justify-center">
            <Link to="/wissen" className="btn-primary w-full sm:w-auto">
              Alle Beiträge
            </Link>
          </div>
        </div>
      </section>

      {/* 7 — Kanäle */}
      <section className="section-card">
        <div className="section-inner">
          <h2 className="text-center text-[30px] font-semibold leading-tight text-foreground md:text-[40px] md:leading-[48px]">
            Folge mir
          </h2>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <a
              href="https://instagram.com/finanz.muslim"
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[200px] flex-col items-center justify-center gap-4 card-surface p-6 transition-colors hover:border-primary"
            >
              <InstagramLogo className="h-14 w-14" />
              <span className="text-[18px] font-semibold text-foreground">Instagram</span>
            </a>
            <a
              href="https://tiktok.com/@finanz.muslim"
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[200px] flex-col items-center justify-center gap-4 card-surface p-6 transition-colors hover:border-primary"
            >
              <TikTokLogo className="h-14 w-14" />
              <span className="text-[18px] font-semibold text-foreground">TikTok</span>
            </a>
            <a
              href="https://youtube.com/@finanz.muslim"
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[200px] flex-col items-center justify-center gap-4 card-surface p-6 transition-colors hover:border-primary"
            >
              <YouTubeLogo className="h-14 w-14" />
              <span className="text-[18px] font-semibold text-foreground">YouTube</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  </>
);

export default Index;
