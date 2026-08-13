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

type Rechner = { name: string; desc: string; icon: LucideIcon; to?: string; neu?: boolean };
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
        neu: true,
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

const Kachel = ({ name, icon: Icon, to, neu }: Rechner) => {
  const inhalt = (
    <>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        <Icon className={`h-5 w-5 ${to ? "text-primary" : "text-muted-foreground"}`} aria-hidden />
      </span>
      <span className="flex min-w-0 flex-wrap items-center gap-2 text-[15px] font-bold text-foreground">
        {name}
        {neu && <span className="badge-new">Neu</span>}
      </span>
    </>
  );

  if (to) {
    return (
      <Link
        to={to}
        className="flex min-h-[52px] items-center gap-3 card-surface px-3 py-2 transition-colors hover:border-primary"
      >
        {inhalt}
      </Link>
    );
  }

  return (
    <div
      aria-disabled="true"
      className="relative flex min-h-[52px] items-center gap-3 rounded-xl border border-border bg-muted px-3 py-2 pr-14 opacity-70"
    >
      <span className="badge-soon absolute right-3 top-1/2 -translate-y-1/2">bald</span>
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
    <div className="container py-4 md:py-5">
      <nav aria-label="Brotkrumen" className="flex flex-wrap items-center gap-1 text-[13px] text-muted-foreground">
        <Link to="/" className="hover:text-primary">
          Start
        </Link>
        <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        <span className="text-foreground">Rechner</span>
      </nav>

      <header className="mt-2 max-w-3xl">
        <h1 className="text-2xl font-bold leading-tight text-foreground md:text-3xl">
          Rechner für deine Finanzen
        </h1>
        <p className="mt-1 text-[15px] text-muted-foreground">
          Werkzeuge, die dir konkrete Antworten geben. Kostenlos und ohne Anmeldung.
        </p>
      </header>

      <div className="mt-4 space-y-4">
        {gruppen.map((gruppe) => (
          <section key={gruppe.titel}>
            <h2 className="text-[13px] font-semibold uppercase tracking-wide text-muted-foreground">
              {gruppe.titel}
            </h2>
            <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
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
