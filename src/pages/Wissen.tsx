import { Link } from "react-router-dom";
import {
  AlertTriangle,
  Banknote,
  Bitcoin,
  Car,
  ChevronRight,
  Coins,
  CreditCard,
  FileWarning,
  Landmark,
  LineChart,
  Percent,
  Scale,
  Scroll,
  Search,
  ShieldQuestion,
  Sparkles,
  Umbrella,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Seo from "@/components/Seo";

type Artikel = { name: string; desc: string; icon: LucideIcon; to?: string };
type Block = { titel: string; artikel: Artikel[] };

const bloecke: Block[] = [
  {
    titel: "Grundlagen",
    artikel: [
      { name: "Was ist Riba", desc: "Zins im Islam: Bedeutung, Formen und Alternativen.", icon: Percent, to: "/wissen/was-ist-riba" },
      { name: "Was ist Gharar", desc: "Warum übermäßige Unsicherheit in Verträgen problematisch ist.", icon: ShieldQuestion },
      { name: "Halal investieren für Anfänger", desc: "Der Einstieg Schritt für Schritt erklärt.", icon: LineChart, to: "/halal-guide" },
      { name: "Die häufigsten Fehler", desc: "Stolperfallen, die viele am Anfang übersehen.", icon: AlertTriangle },
    ],
  },
  {
    titel: "Investieren",
    artikel: [
      { name: "Halal ETFs", desc: "Wie sharia-konforme ETFs aufgebaut sind.", icon: LineChart },
      { name: "Aktien richtig prüfen", desc: "Nach welchen Kriterien Einzelaktien geprüft werden.", icon: Search },
      { name: "Sukuk", desc: "Was hinter islamischen Anleihen steckt.", icon: Scroll },
      { name: "Gold kaufen", desc: "Worauf es beim Kauf von physischem Gold ankommt.", icon: Coins },
      { name: "Krypto", desc: "Die Diskussion um digitale Währungen im Islam.", icon: Bitcoin },
    ],
  },
  {
    titel: "Alltag",
    artikel: [
      { name: "Girokonto ohne Zinsfalle", desc: "Worauf du bei deinem Alltagskonto achtest.", icon: Banknote },
      { name: "Dispo und Kredit", desc: "Warum eingeräumte Kredite problematisch sind.", icon: CreditCard },
      { name: "Ratenkauf", desc: "Wann Ratenzahlung zur Zinsfalle wird.", icon: FileWarning },
      { name: "Leasing", desc: "Wie Leasingverträge aus islamischer Sicht bewertet werden.", icon: Car },
      { name: "Versicherung", desc: "Konventionelle Versicherung und Takaful im Vergleich.", icon: Umbrella },
    ],
  },
  {
    titel: "Pflichten",
    artikel: [
      { name: "Zakat berechnen", desc: "So ermittelst du deine Zakat.", icon: Scale, to: "/zakat-rechner" },
      { name: "Nisab verstehen", desc: "Ab welchem Vermögen Zakat fällig wird.", icon: Landmark },
      { name: "Erträge reinigen", desc: "Wie unreine Erträge ausgesondert werden.", icon: Sparkles },
      { name: "Erbe nach islamischem Recht", desc: "Grundzüge der Erbteilung.", icon: Users },
    ],
  },
];

const Kachel = ({ name, desc, icon: Icon, to }: Artikel) => {
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

const Wissen = () => (
  <main className="bg-background">
    <Seo
      title="Halal-Finanzwissen | finanzmuslim"
      description="Verständlich erklärt, ohne Fachchinesisch. Von Riba bis Zakat: Grundlagen, Investieren, Alltag und Pflichten."
      path="/wissen"
    />
    <div className="container py-10 md:py-14">
      <nav aria-label="Brotkrumen" className="flex flex-wrap items-center gap-1 text-[13px] text-muted-foreground">
        <Link to="/" className="hover:text-primary">
          Start
        </Link>
        <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        <span className="text-foreground">Wissen</span>
      </nav>

      <header className="mt-6 max-w-3xl">
        <h1 className="text-3xl font-bold leading-tight text-foreground md:text-4xl">Halal-Finanzwissen</h1>
        <p className="mt-3 text-[17px] text-muted-foreground">
          Verständlich erklärt, ohne Fachchinesisch. Von Riba bis Zakat.
        </p>
      </header>

      <div className="mt-12 space-y-12">
        {bloecke.map((block) => (
          <section key={block.titel}>
            <h2 className="text-[13px] font-semibold uppercase tracking-wide text-muted-foreground">
              {block.titel}
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {block.artikel.map((a) => (
                <Kachel key={a.name} {...a} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  </main>
);

export default Wissen;
