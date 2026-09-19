import { Link } from "react-router-dom";
import {
  Baby,
  Banknote,
  Bitcoin,
  ChevronRight,
  Coins,
  FileText,
  LineChart,
  ScanSearch,
  ShieldCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Seo from "@/components/Seo";

type Vergleich = { name: string; desc: string; icon: LucideIcon; to?: string };
type Gruppe = { titel: string; eintraege: Vergleich[] };

const gruppen: Gruppe[] = [
  {
    titel: "Investieren",
    eintraege: [
      {
        name: "Depot-Vergleich",
        desc: "Finde das Depot, bei dem du zinsfrei in Halal-Anlagen investierst.",
        icon: LineChart,
        to: "/vergleich/depot",
      },
      {
        name: "Krypto-Vergleich",
        desc: "Finde die Börse, bei der du echte Coins zinsfrei kaufst.",
        icon: Bitcoin,
        to: "/vergleich/krypto",
      },
      {
        name: "Edelmetalle",
        desc: "Fünf Wege zu Gold und Silber, mit Nachweis und Auslieferung.",
        icon: Coins,
        to: "/vergleich/edelmetalle",
      },
      { name: "Kinderdepot", desc: "Vergleiche Depots für deine Kinder.", icon: Baby },
      {
        name: "Halal-Anlagen finden",
        desc: "31 Anlagen: ETFs, Sukuk, Gold, Silber, Platin und Krypto mit Prüfstelle.",
        icon: ShieldCheck,
        to: "/halal-anlagen",
      },
    ],
  },
  {
    titel: "Konto und Prüfung",
    eintraege: [
      {
        name: "Girokonto-Vergleich",
        desc: "Finde das Konto ohne Zins, ohne Dispo und mit Karte ohne Kredit.",
        icon: Banknote,
        to: "/vergleich/girokonto",
      },
      {
        name: "Aktien prüfen",
        desc: "Vergleiche vier Apps, die einzelne Aktien auf Halal prüfen.",
        icon: ScanSearch,
        to: "/vergleich/screening-apps",
      },
      {
        name: "Steuersoftware",
        desc: "Vergleiche 13 Programme für die Steuererklärung: Preis, Zahlung und Einkünfte.",
        icon: FileText,
        to: "/vergleich/steuersoftware",
      },
    ],
  },
];

const bewertung = [
  "Zuerst wird geprüft, dann wird über eine Partnerschaft gesprochen. Nie umgekehrt.",
  "Anbieter ohne Partnerschaft werden trotzdem gelistet.",
  "Wessen Zinsen sich nicht abschalten lassen, bekommt keine Note.",
  "Jede Angabe ist mit Stand geprüft.",
  "Mit Stern markierte Links sind Werbe- oder Affiliate-Links.",
];

const Kachel = ({ name, desc, icon: Icon, to }: Vergleich) => {
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
        className="flex min-h-[88px] items-start gap-3 card-surface p-4 transition-colors hover:border-primary"
      >
        {inhalt}
      </Link>
    );
  }

  return (
    <div
      aria-disabled="true"
      className="relative flex min-h-[88px] items-start gap-3 rounded-xl border border-border bg-muted p-4 opacity-70"
    >
      <span className="badge-soon absolute right-2 top-2">bald</span>
      {inhalt}
    </div>
  );
};

const Vergleiche = () => (
  <main className="bg-background">
    <Seo
      title="Halal Depot, Konto und Börse im Vergleich | finanzmuslim"
      description="Vergleiche Depots, Girokonten, Krypto-Börsen, Edelmetalle und Screening-Apps nach Halal-Merkmalen: ohne Zinsen nutzbar, geprüfte Anlagen und Kosten."
      path="/vergleiche"
      brotkrumen={[{ name: "Vergleiche", path: "/vergleiche" }]}
    />
    <div className="container py-10 md:py-14">
      <nav aria-label="Brotkrumen" className="flex flex-wrap items-center gap-1 text-[13px] text-muted-foreground">
        <Link to="/" className="hover:text-primary">
          Start
        </Link>
        <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        <span className="text-foreground">Vergleiche</span>
      </nav>

      <header className="mt-6 max-w-3xl">
        <h1 className="text-3xl font-bold leading-tight text-foreground md:text-4xl">Anbieter im Vergleich</h1>
        <p className="mt-3 text-[17px] text-muted-foreground">
          Wir prüfen Anbieter nach Kriterien, die in normalen Vergleichen fehlen. Was zählt, ist nicht
          nur der Preis, sondern ob das Produkt zu deinem Glauben passt.
        </p>
        <Link
          to="/vergleich/start"
          className="mt-5 inline-flex min-h-[52px] w-full items-center justify-center rounded-lg bg-primary px-8 text-[17px] font-semibold text-primary-foreground transition-colors hover:bg-primary-hover sm:w-auto"
        >
          Vergleich starten
        </Link>
        <p className="mt-2 text-[14px] text-muted-foreground">Drei Fragen, dann siehst du, wer zu dir passt.</p>
      </header>

      <div className="mt-12 space-y-12">
        {gruppen.map((gruppe) => (
          <section key={gruppe.titel}>
            <h2 className="text-[13px] font-semibold uppercase tracking-wide text-muted-foreground">
              {gruppe.titel}
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {gruppe.eintraege.filter((v) => v.to).map((v) => (
                <Kachel key={v.name} {...v} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className="card-surface mt-14 p-6 md:p-8">
        <h2 className="text-xl font-bold text-foreground">Wie wir bewerten</h2>
        <ul className="mt-4 space-y-3">
          {bewertung.map((punkt) => (
            <li key={punkt} className="flex gap-3 text-[15px] text-foreground">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
              <span>{punkt}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  </main>
);

export default Vergleiche;
