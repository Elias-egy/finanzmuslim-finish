import { Link } from "react-router-dom";
import {
  ArrowRight,
  Baby,
  Calculator,
  CreditCard,
  Coins,
  FileText,
  Globe,
  Instagram,
  LineChart,
  Music2,
  PiggyBank,
  Search,
  ShieldCheck,
  TrendingUp,
  Wallet,
  Youtube,
} from "lucide-react";
import Seo from "@/components/Seo";
import NewsletterBox from "@/components/NewsletterBox";
import eliasCutout from "@/assets/elias-freigestellt.png.asset.json";
import guideTrio from "@/assets/guide-trio.webp";
import blogPlate from "@/assets/blog-plate.webp";
import toolsPlate from "@/assets/tools-plate.webp";
import renditePlate from "@/assets/renditerechner-plate.jpg";

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

const calculators = [
  {
    title: "Zakat-Rechner",
    desc: "Berechne deine Zakat auf Depot, Gold und Ersparnisse.",
    to: "/zakat-rechner",
    icon: Calculator,
  },
  {
    title: "Renditerechner",
    desc: "Sieh, wie dein Vermögen über die Jahre wachsen kann.",
    to: "/renditerechner",
    icon: TrendingUp,
  },
  {
    title: "Weitere Rechner",
    desc: "Alle Werkzeuge für deine Finanzplanung an einem Ort.",
    to: "/rechner",
    icon: PiggyBank,
  },
];

/** Nur echte, existierende Inhalte aus dem Wissensbereich. */
const articles = [
  {
    topic: "Grundlagen",
    title: "Was ist Riba",
    teaser: "Was Riba bedeutet, welche Formen es gibt und wo sie dir im Alltag begegnet.",
    image: blogPlate,
    to: "/wissen/was-ist-riba",
  },
  {
    topic: "Grundlagen",
    title: "Halal investieren für Anfänger",
    teaser: "Der Einstieg Schritt für Schritt erklärt, im kostenlosen Guide.",
    image: renditePlate,
    to: "/halal-guide",
  },
  {
    topic: "Pflichten",
    title: "Zakat berechnen",
    teaser: "So ermittelst du deine Zakat auf Depot, Gold und Ersparnisse.",
    image: toolsPlate,
    to: "/zakat-rechner",
  },
];

const screeningPreview = [
  { name: "Beispiel AG", tone: "bg-success" },
  { name: "Muster Holding", tone: "bg-warning" },
  { name: "Demo Bank", tone: "bg-destructive" },
];

const Index = () => (
  <>
    <Seo
      title="finanzmuslim – Islamkonform investieren, verständlich erklärt"
      description="Wissen, Rechner und Vergleiche für islamkonforme Finanzen: Riba erkennen, halal investieren und die richtigen Anbieter finden."
      path="/"
    />

    {/* 1 — Hero-Platte mit ueberlappenden Kategorie-Kacheln */}
    <section>
      <div className="container pt-10 md:pt-12">
        {/* Eingelegte Platte: blasse Primaertoenung, grosszuegig gerundet */}
        <div className="relative rounded-[2rem] bg-hero px-6 pb-24 pt-8 md:px-12 md:pb-28 md:pt-10">
          <div className="grid items-end gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="pb-4 md:pb-8">
              <h1 className="text-[28px] font-bold leading-[1.1] tracking-tight text-foreground sm:text-[34px] lg:text-[42px]">
                Investiere, ohne deinen
                <br className="hidden sm:block" /> Glauben zu riskieren
              </h1>
              <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-muted-foreground">
                Lerne, wie du dein Geld islamkonform anlegst, Riba erkennst und die richtigen Anbieter
                findest. Verständlich erklärt, ohne Fachchinesisch.
              </p>
            </div>

            {/* Freigestelltes Foto: steht auf der Platte, ragt oben darueber hinaus */}
            <div className="relative -mt-16 hidden justify-end md:flex lg:-mt-24">
              <img
                src={eliasCutout.url}
                alt="Elias El-Gendy, Gründer von finanzmuslim"
                className="h-[300px] w-auto object-contain object-bottom lg:h-[360px]"
                loading="eager"
              />
              <div className="absolute bottom-6 right-0 rounded-lg border border-border bg-card px-4 py-3">
                <p className="text-[15px] font-semibold text-foreground">Elias El-Gendy</p>
                <p className="text-[13px] text-muted-foreground">Gründer von finanzmuslim</p>
              </div>
            </div>
          </div>
        </div>

        {/* Kacheln ueberlappen die Unterkante der Platte */}
        <div className="relative z-10 -mt-16 grid grid-cols-2 gap-3 md:-mt-20 lg:grid-cols-4">
          {categories.map(({ label, icon: Icon, to }) => (
            <Link
              key={label}
              to={to ?? "/tools"}
              className="group relative flex min-h-[72px] items-center gap-3 card-surface p-4 transition-colors hover:border-primary"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Icon className="h-4.5 w-4.5 text-primary" aria-hidden />
              </span>
              <span className="flex-1 pr-4 text-[15px] font-medium text-foreground">{label}</span>
              <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" aria-hidden />
              {!to && <span className="badge-soon absolute right-2 top-2">bald</span>}
            </Link>
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <Link
            to="/vergleiche"
            className="inline-flex min-h-[44px] items-center rounded-lg bg-primary px-6 text-[15px] font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            Zu allen Vergleichen
          </Link>
        </div>
      </div>
    </section>

    {/* 3 — Guide */}
    <section>
      <div className="container pb-10 md:pb-16 pt-10 md:pt-14">
        <div className="card-surface grid gap-10 p-6 md:gap-14 md:p-12 lg:p-16 lg:grid-cols-2 lg:items-center">
          <img
            src={guideTrio}
            alt="Halal Investment Guide in drei Fassungen"
            className="mx-auto w-full max-w-md"
            loading="lazy"
          />
          <div>
            <span className="badge-note">Kostenlos</span>
            <h2 className="mt-4 text-[28px] md:text-[36px] font-bold leading-tight text-foreground">
              Der Halal Investment Guide
            </h2>
            <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-muted-foreground">
              Der Guide erklärt dir die Grundprinzipien islamkonformer Geldanlage, welche Anlageklassen
              infrage kommen und wie du Riba und Gharar in Produkten erkennst.
              Dazu bekommst du eine Prüfreihenfolge, mit der du Schritt für Schritt startest.
            </p>
            <Link
              to="/halal-guide"
              className="mt-8 inline-flex min-h-[44px] items-center rounded-lg bg-primary px-6 text-[15px] font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
            >
              Guide kostenlos sichern
            </Link>
          </div>
        </div>
      </div>
    </section>

    {/* 4 — Newsletter */}
    <section>
      <div className="container pb-10 md:pb-16 pt-10 md:pt-14">
        <div className="card-surface p-6 md:p-12 lg:p-16">
          <NewsletterBox />
        </div>
      </div>
    </section>

    {/* 5 — Halal-Check */}
    <section>
      <div className="container pb-10 md:pb-16 pt-10 md:pt-14">
        <div className="card-surface grid gap-10 p-6 md:gap-14 md:p-12 lg:p-16 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="badge-note">In Arbeit</span>
            <h2 className="mt-4 text-[28px] md:text-[36px] font-bold leading-tight text-foreground">
              Finde halal Anlagen
            </h2>
            <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-muted-foreground">
              Hier entsteht eine Datenbank, mit der du Aktien und ETFs auf ihre Islamkonformität prüfen
              kannst. Du gibst einen Namen ein und siehst, welche Kriterien erfüllt sind und welche nicht.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-background p-5" aria-hidden>
            <div className="flex min-h-[44px] items-center gap-3 rounded-lg border border-border px-4">
              <Search className="h-4 w-4 text-muted-foreground" />
              <span className="text-[15px] text-muted-foreground">Aktie oder ETF suchen</span>
            </div>
            <ul className="mt-4 divide-y divide-border">
              {screeningPreview.map((row) => (
                <li key={row.name} className="flex min-h-[44px] items-center justify-between py-2">
                  <span className="text-[15px] text-foreground">{row.name}</span>
                  <span className={`h-2.5 w-2.5 rounded-full ${row.tone}`} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>

    {/* 6 — Rechner */}
    <section>
      <div className="container pb-10 md:pb-16 pt-10 md:pt-14">
        <h2 className="text-[28px] md:text-[36px] font-bold leading-tight text-foreground">
          Rechnen, prüfen, planen
        </h2>
        <p className="mt-3 max-w-2xl text-[17px] leading-relaxed text-muted-foreground">
          Werkzeuge, die dir Klarheit über deine Zahlen geben, bevor du eine Entscheidung triffst.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {calculators.map(({ title, desc, to, icon: Icon }) => (
            <Link
              key={title}
              to={to}
              className="group card-surface p-6 transition-colors hover:border-primary"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Icon className="h-5 w-5 text-primary" aria-hidden />
              </span>
              <h3 className="mt-4 text-[18px] font-semibold text-foreground group-hover:text-primary">
                {title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>

    {/* 7 — Wissen */}
    <section>
      <div className="container pb-10 md:pb-16 pt-10 md:pt-14">
        <h2 className="text-[28px] md:text-[36px] font-bold leading-tight text-foreground">
          Finanzwissen, das dich weiterbringt
        </h2>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {articles.map((a) => (
            <Link
              key={a.title}
              to={a.to}
              className="group card-surface overflow-hidden transition-colors hover:border-primary"
            >
              <img src={a.image} alt="" className="h-44 w-full object-cover" loading="lazy" />
              <div className="p-5">
                <p className="text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {a.topic}
                </p>
                <h3 className="mt-2 text-[18px] font-semibold leading-snug text-foreground group-hover:text-primary">
                  {a.title}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{a.teaser}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <Link
            to="/wissen"
            className="inline-flex min-h-[44px] items-center gap-1.5 text-[15px] font-semibold text-primary hover:underline underline-offset-4"
          >
            Alle Themen <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>

    {/* 8 — Kanäle */}
    <section>
      <div className="container pb-10 md:pb-16 pt-10 md:pt-14">
        <h2 className="text-center text-[28px] md:text-[36px] font-bold leading-tight text-foreground">
          Folge mir
        </h2>

        <div className="mx-auto mt-10 grid max-w-4xl gap-4 md:grid-cols-3">
          <a
            href="https://instagram.com/finanz.muslim"
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-[120px] flex-col items-center justify-center gap-3 card-surface p-6 transition-colors hover:border-primary"
          >
            <Instagram className="h-7 w-7 text-primary" aria-hidden />
            <span className="text-[16px] font-semibold text-foreground">Instagram</span>
          </a>
          <div className="flex min-h-[120px] flex-col items-center justify-center gap-3 card-surface p-6">
            <Music2 className="h-7 w-7 text-muted-foreground" aria-hidden />
            <span className="text-[16px] font-semibold text-muted-foreground">TikTok</span>
          </div>
          <div className="flex min-h-[120px] flex-col items-center justify-center gap-3 card-surface p-6">
            <Youtube className="h-7 w-7 text-muted-foreground" aria-hidden />
            <span className="text-[16px] font-semibold text-muted-foreground">YouTube</span>
          </div>
        </div>
      </div>
    </section>
  </>
);

export default Index;
