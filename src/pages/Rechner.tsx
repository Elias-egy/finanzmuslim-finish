import { Link } from "react-router-dom";
import { Calculator, ChevronRight, Globe, Percent, PiggyBank, Receipt, Sparkles, Target, TrendingDown, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Seo from "@/components/Seo";
import rechnerRender from "@/assets/rechner.png";

type Rechner = { name: string; icon: LucideIcon; to?: string; neu?: boolean };

/** Neun Rechner, flache Reihe. Ohne "to" ist der Rechner noch nicht gebaut. */
export const rechnerListe: Rechner[] = [
  { name: "Zakat-Rechner", icon: Calculator, to: "/zakat-rechner", neu: true },
  { name: "Bereinigungsrechner", icon: Sparkles, to: "/bereinigungsrechner", neu: true },
  { name: "Renditerechner", icon: TrendingUp, to: "/renditerechner" },
  { name: "Auswanderungsrechner", icon: Globe, to: "/auswanderungsrechner", neu: true },
  { name: "Budgetrechner", icon: PiggyBank, to: "/budgetrechner", neu: true },
  { name: "Kreditkostenrechner", icon: Percent, to: "/kreditkostenrechner", neu: true },
  { name: "Sparzielrechner", icon: Target, to: "/sparzielrechner", neu: true },
  { name: "Brutto-Netto-Rechner", icon: Receipt },
  { name: "Inflationsrechner", icon: TrendingDown, to: "/inflationsrechner", neu: true },
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
      brotkrumen={[{ name: "Rechner", path: "/rechner" }]}
    />
    <div className="container py-4 md:py-5">
      <nav aria-label="Brotkrumen" className="flex flex-wrap items-center gap-1 text-[13px] text-muted-foreground">
        <Link to="/" className="hover:text-primary">
          Start
        </Link>
        <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        <span className="text-foreground">Rechner</span>
      </nav>

      <div className="mt-2 flex flex-col items-center gap-4 md:flex-row md:justify-between">
        <header className="max-w-3xl">
          <h1 className="text-2xl font-bold leading-tight text-foreground md:text-3xl">
            Rechner für deine Finanzen
          </h1>
          <p className="mt-1 text-[15px] text-muted-foreground">
            Werkzeuge, die dir konkrete Antworten geben. Kostenlos und ohne Anmeldung.
          </p>
        </header>
        <img
          src={rechnerRender}
          alt="Taschenrechner mit Geldscheinen und Münzen"
          className="h-auto w-full max-w-[240px] shrink-0 select-none md:max-w-[280px]"
          draggable={false}
        />
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {rechnerListe.map((r) => (
          <Kachel key={r.name} {...r} />
        ))}
      </div>
    </div>
  </main>
);

export default Rechner;
