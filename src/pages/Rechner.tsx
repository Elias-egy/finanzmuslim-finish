import { Link } from "react-router-dom";
import {
  Baby,
  Calculator,
  ChevronRight,
  Coins,
  Globe,
  Home,
  Landmark,
  Plane,
  Scale,
  Sparkles,
  TrendingUp,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Seo from "@/components/Seo";

type Rechner = { name: string; desc: string; icon: LucideIcon; to?: string };
type Gruppe = { titel: string; rechner: Rechner[] };

const gruppen: Gruppe[] = [
  {
    titel: "Zakat und Pflichten",
    rechner: [
      {
        name: "Zakat-Rechner",
        desc: "Zakat auf Bargeld, Depot, Gold und Krypto berechnen.",
        icon: Calculator,
        to: "/zakat-rechner",
      },
      { name: "Nisab-Rechner", desc: "Prüfen, ob dein Vermögen über dem Nisab liegt.", icon: Scale },
      { name: "Zakat auf Depot", desc: "Zakat allein für dein Wertpapierdepot ermitteln.", icon: Landmark },
      { name: "Reinigungs-Rechner", desc: "Unreine Erträge ermitteln und aussondern.", icon: Sparkles },
    ],
  },
  {
    titel: "Investieren",
    rechner: [
      {
        name: "Renditerechner",
        desc: "Sehen, wie dein Vermögen über die Jahre wachsen kann.",
        icon: TrendingUp,
        to: "/renditerechner",
      },
      { name: "Sparplan-Rechner", desc: "Monatliche Rate und Laufzeit gegeneinander abwägen.", icon: Wallet },
      { name: "Kinderdepot-Rechner", desc: "Vermögensaufbau für deine Kinder planen.", icon: Baby },
    ],
  },
  {
    titel: "Riba vermeiden",
    rechner: [
      { name: "Riba-Kosten-Rechner", desc: "Was dich Zinsen über die Laufzeit wirklich kosten.", icon: Coins },
      { name: "Auslandsüberweisung-Rechner", desc: "Kosten einer Überweisung ins Ausland vergleichen.", icon: Globe },
      { name: "Miete oder Kauf", desc: "Mieten und Kaufen ohne Zinsfalle gegenüberstellen.", icon: Home },
    ],
  },
  {
    titel: "Familie",
    rechner: [
      { name: "Erbteilungs-Rechner nach Fara'id", desc: "Erbanteile nach islamischem Recht aufteilen.", icon: Scale },
      { name: "Umrah-Sparplan", desc: "Planen, wie du auf die Reisekosten sparst.", icon: Plane },
    ],
  },
];

const Kachel = ({ name, desc, icon: Icon, to }: Rechner) => {
  const inhalt = (
    <>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        <Icon className={`h-5 w-5 ${to ? "text-primary" : "text-muted-foreground"}`} aria-hidden />
      </span>
      <span className="min-w-0">
        <span className="block text-[15px] font-semibold text-foreground">{name}</span>
        <span className="mt-1 block text-[14px] text-muted-foreground">{desc}</span>
      </span>
    </>
  );

  if (to) {
    return (
      <Link
        to={to}
        className="flex min-h-[88px] items-start gap-3 rounded-lg border border-border bg-background p-4 transition-colors hover:border-primary"
      >
        {inhalt}
      </Link>
    );
  }

  return (
    <div
      aria-disabled="true"
      className="relative flex min-h-[88px] items-start gap-3 rounded-lg border border-border bg-secondary p-4 opacity-70"
    >
      <span className="absolute right-2 top-2 rounded border border-border px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
        bald
      </span>
      {inhalt}
    </div>
  );
};

const Rechner = () => (
  <main className="bg-background">
    <Seo
      title="Rechner für deine Finanzen | finanzmuslim"
      description="Kostenlose Rechner für Zakat, Rendite und islamkonforme Finanzplanung. Ohne Anmeldung nutzbar."
      path="/rechner"
    />
    <div className="container py-10 md:py-14">
      <nav aria-label="Brotkrumen" className="flex flex-wrap items-center gap-1 text-[13px] text-muted-foreground">
        <Link to="/" className="hover:text-primary">
          Start
        </Link>
        <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        <span className="text-foreground">Rechner</span>
      </nav>

      <header className="mt-6 max-w-3xl">
        <h1 className="text-3xl font-bold leading-tight text-foreground md:text-4xl">
          Rechner für deine Finanzen
        </h1>
        <p className="mt-3 text-[17px] text-muted-foreground">
          Werkzeuge, die dir konkrete Antworten geben. Kostenlos und ohne Anmeldung.
        </p>
      </header>

      <div className="mt-12 space-y-12">
        {gruppen.map((gruppe) => (
          <section key={gruppe.titel}>
            <h2 className="text-[13px] font-semibold uppercase tracking-wide text-muted-foreground">
              {gruppe.titel}
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {gruppe.rechner.map((r) => (
                <Kachel key={r.name} {...r} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  </main>
);

export default Rechner;
