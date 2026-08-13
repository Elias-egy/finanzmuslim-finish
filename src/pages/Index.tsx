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
  Search,
  ShieldCheck,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { InstagramLogo, TikTokLogo, YouTubeLogo } from "@/components/site/SocialLogos";
import Seo from "@/components/Seo";
import WissenSlider, { type WissenKarte } from "@/components/WissenSlider";

import eliasCutout from "@/assets/elias-freigestellt.png";

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

/** Nur der Riba-Artikel existiert. Alles andere ist als "bald" markiert. */
const wissenKarten: WissenKarte[] = [
  { thema: "Alltag", titel: "Hauskauf oder Miete" },
  { thema: "Investieren", titel: "Gold richtig kaufen" },
  { thema: "Alltag", titel: "Finanzierung" },
  { thema: "Alltag", titel: "Leasing und Autoabo" },
  { thema: "Grundlagen", titel: "Unsicherheit im Vertrag (Gharar)" },
  { thema: "Grundlagen", titel: "Zins (Riba)", to: "/wissen/was-ist-riba" },
  { thema: "Grundlagen", titel: "Glücksspiel (Maysir)" },
];

const screeningPreview = [
  { name: "Beispiel AG", tone: "bg-success" },
  { name: "Muster Holding", tone: "bg-warning" },
  { name: "Demo Bank", tone: "bg-destructive" },
];

/** Platzhalter fuer noch fehlende Bilder. Haelt exakt den spaeteren Platz frei. */
const Placeholder = ({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) => (
  <div className={`image-placeholder ${className}`} aria-hidden>
    {label}
  </div>
);

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
        <div className="relative overflow-hidden rounded-2xl bg-hero px-6 pb-12 pt-8 md:h-[480px] md:px-12 md:pb-0">
          <div className="mx-auto flex h-full max-w-[1200px] items-center">
            <div className="max-w-[600px] py-4">
              <h1 className="text-[36px] font-bold leading-[1.12] tracking-tight text-foreground md:text-[56px] md:leading-[64px]">
                Investiere, ohne deinen
                <br className="hidden sm:block" /> Glauben zu riskieren
              </h1>
              <p className="mt-6 max-w-[580px] text-[18px] leading-relaxed text-muted-foreground md:text-[22px] md:leading-[32px]">
                Lerne, wie du dein Geld islamkonform anlegst, Riba erkennst und die richtigen Anbieter
                findest. Verständlich erklärt, ohne Fachchinesisch.
              </p>
            </div>
          </div>

          {/* Freigestelltes Foto: steht buendig auf der Unterkante der Platte,
              ueberlappt die Kacheln nicht und bleibt innerhalb der Platte. */}
          <div className="pointer-events-none absolute bottom-0 right-6 hidden h-[445px] w-[560px] overflow-hidden lg:block xl:right-[calc((100%-1200px)/2)]">
            <img
              src={eliasCutout}
              alt="Elias El-Gendy, Gründer von finanzmuslim"
              className="h-[680px] w-full object-cover object-top"
              loading="eager"
            />
          </div>
        </div>

        {/* Kacheln stehen unter der Platte, kompakt gesetzt */}
        <div className="relative z-10 mx-auto mt-4 grid w-full max-w-[1200px] grid-cols-2 gap-3 md:mt-5 lg:grid-cols-4">
          {categories.map(({ label, icon: Icon, to }) => (
            <Link
              key={label}
              to={to ?? "/tools"}
              className="group relative flex min-h-[72px] items-center gap-3 card-surface px-4 py-3 pt-7 transition-colors hover:border-primary sm:pt-3 md:min-h-[76px]"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Icon className="h-5 w-5 text-primary" aria-hidden />
              </span>
              <span className="min-w-0 flex-1 text-[16px] font-bold text-foreground md:text-[18px]">
                {label}
              </span>
              <ArrowRight
                className="hidden h-5 w-5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary sm:block"
                aria-hidden
              />
              {!to && <span className="badge-soon absolute left-4 top-2 sm:left-auto sm:right-2">bald</span>}
            </Link>
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <Link to="/vergleiche" className="btn-primary h-14 px-8 text-[19px]">
            Zu allen Vergleichen
          </Link>
        </div>
      </section>

      {/* 2 — Guide: Bild links, Text rechts */}
      <section className="section-card">
        <div className="section-inner grid items-center gap-10 lg:grid-cols-[380px_1fr] lg:gap-16">
          <Placeholder label="Guide-Cover folgt" className="h-[380px] w-full lg:h-[480px] lg:w-[380px]" />
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
            <Link to="/halal-guide" className="btn-primary mt-8">
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
              <button type="submit" className="btn-primary">
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

          <Placeholder
            label="Newsletter-Vorschau folgt"
            className="h-[320px] w-full lg:h-[500px] lg:w-[420px]"
          />
        </div>
      </section>

      {/* 4 — Finde halal Anlagen: Vorschau links, Text rechts */}
      <section className="section-card">
        <div className="section-inner grid items-center gap-10 lg:grid-cols-[500px_1fr] lg:gap-16">
          <div className="w-full rounded-2xl border border-border bg-card p-6 lg:w-[500px]" aria-hidden>
            <div className="flex h-12 items-center gap-3 rounded-md border border-border px-4">
              <Search className="h-4 w-4 text-muted-foreground" />
              <span className="text-[16px] text-muted-foreground">Aktie oder ETF suchen</span>
            </div>
            <ul className="mt-4 divide-y divide-border">
              {screeningPreview.map((row) => (
                <li key={row.name} className="flex min-h-[52px] items-center justify-between py-2">
                  <span className="text-[16px] text-foreground">{row.name}</span>
                  <span className={`h-2.5 w-2.5 rounded-full ${row.tone}`} />
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow">Halal-Check</p>
            <h2 className="mt-3 text-[30px] font-semibold leading-tight text-foreground md:text-[40px] md:leading-[48px]">
              Finde halal Anlagen
            </h2>
            <p className="mt-5 max-w-[640px] text-[17px] leading-relaxed text-muted-foreground md:text-[20px] md:leading-[28px]">
              Hier entsteht eine Datenbank, mit der du Aktien und ETFs auf ihre Islamkonformität prüfen
              kannst. Du gibst einen Namen ein und siehst, welche Kriterien erfüllt sind und welche
              nicht.
            </p>
            <span className="badge-note mt-6">In Arbeit</span>
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
              <Link to="/rechner" className="btn-primary mt-8">
                Zu allen Rechnern
              </Link>
            </div>
            <Placeholder
              label="Rechner-Vorschau folgt"
              className="h-[240px] w-full lg:h-[320px] lg:w-[420px]"
            />
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {calculators.map(({ title, desc, to, icon: Icon }) => (
              <Link
                key={title}
                to={to}
                className="group card-surface p-6 transition-colors hover:border-primary"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Icon className="h-[22px] w-[22px] text-primary" aria-hidden />
                </span>
                <h3 className="mt-4 flex flex-wrap items-center gap-2 text-[18px] font-bold text-foreground group-hover:text-primary">
                  {title}
                  {title === "Zakat-Rechner" && <span className="badge-new">Neu</span>}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{desc}</p>
              </Link>
            ))}
            {plannedCalculators.map(({ title, desc, icon: Icon }) => (
              <div key={title} className="relative card-surface p-6 opacity-60">
                <span className="badge-soon absolute right-3 top-3">bald</span>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <Icon className="h-5 w-5 text-muted-foreground" aria-hidden />
                </span>
                <h3 className="mt-4 text-[18px] font-semibold text-muted-foreground">{title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{desc}</p>
              </div>
            ))}
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
            <Link to="/wissen" className="btn-primary">
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
            <div
              aria-label="YouTube – noch nicht verfügbar"
              className="flex min-h-[200px] flex-col items-center justify-center gap-4 card-surface p-6 opacity-50"
            >
              <YouTubeLogo className="h-14 w-14" muted />
              <span className="text-[18px] font-semibold text-muted-foreground">YouTube</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  </>
);

export default Index;
