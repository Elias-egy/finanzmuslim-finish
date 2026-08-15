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
import AdSlot from "@/components/AdSlot";
import NewsletterBox from "@/components/NewsletterBox";
import { vorlagen } from "@/data/vorlagen";

type Artikel = { name: string; desc: string; thema: string; icon: LucideIcon; to?: string };

/** Eine durchgehende Liste. Reihenfolge = Anzeigereihenfolge. */
const artikel: Artikel[] = [
  { name: "Was ist Riba", desc: "Zins im Islam: Bedeutung, Formen und Alternativen.", thema: "Grundlagen", icon: Percent, to: "/wissen/was-ist-riba" },
  { name: "Was ist Gharar", desc: "Warum übermäßige Unsicherheit in Verträgen problematisch ist.", thema: "Grundlagen", icon: ShieldQuestion },
  { name: "Halal investieren für Anfänger", desc: "Der Einstieg Schritt für Schritt erklärt.", thema: "Grundlagen", icon: LineChart, to: "/halal-guide" },
  { name: "Die häufigsten Fehler", desc: "Stolperfallen, die viele am Anfang übersehen.", thema: "Grundlagen", icon: AlertTriangle },
  { name: "Halal ETFs", desc: "Wie sharia-konforme ETFs aufgebaut sind.", thema: "Investieren", icon: LineChart },
  { name: "Aktien richtig prüfen", desc: "Nach welchen Kriterien Einzelaktien geprüft werden.", thema: "Investieren", icon: Search },
  { name: "Sukuk", desc: "Was hinter islamischen Anleihen steckt.", thema: "Investieren", icon: Scroll },
  { name: "Gold kaufen", desc: "Worauf es beim Kauf von physischem Gold ankommt.", thema: "Investieren", icon: Coins },
  { name: "Krypto", desc: "Die Diskussion um digitale Währungen im Islam.", thema: "Investieren", icon: Bitcoin },
  { name: "Girokonto ohne Zinsfalle", desc: "Worauf du bei deinem Alltagskonto achtest.", thema: "Alltag", icon: Banknote },
  { name: "Dispo und Kredit", desc: "Warum eingeräumte Kredite problematisch sind.", thema: "Alltag", icon: CreditCard },
  { name: "Ratenkauf", desc: "Wann Ratenzahlung zur Zinsfalle wird.", thema: "Alltag", icon: FileWarning },
  { name: "Leasing", desc: "Wie Leasingverträge aus islamischer Sicht bewertet werden.", thema: "Alltag", icon: Car },
  { name: "Versicherung", desc: "Konventionelle Versicherung und Takaful im Vergleich.", thema: "Alltag", icon: Umbrella, to: "/wissen/ist-versicherung-haram" },
  { name: "Zakat berechnen", desc: "So ermittelst du deine Zakat.", thema: "Pflichten", icon: Scale, to: "/zakat-rechner" },
  { name: "Nisab verstehen", desc: "Ab welchem Vermögen Zakat fällig wird.", thema: "Pflichten", icon: Landmark },
  { name: "Erträge reinigen", desc: "Wie unreine Erträge ausgesondert werden.", thema: "Pflichten", icon: Sparkles },
  { name: "Erbe nach islamischem Recht", desc: "Grundzüge der Erbteilung.", thema: "Pflichten", icon: Users },
];

/** Kategorien in fester Reihenfolge, je mit Ankerpunkt und Erklaersatz. */
const kategorien = [
  { thema: "Grundlagen", id: "grundlagen", satz: "Die Begriffe, ohne die alles andere schwer zu verstehen ist." },
  { thema: "Investieren", id: "investieren", satz: "Wie du dein Geld anlegst, ohne gegen deine Überzeugung zu handeln." },
  { thema: "Alltag", id: "alltag", satz: "Verträge, die dir im normalen Leben begegnen, vom Konto bis zum Leasing." },
  { thema: "Pflichten", id: "pflichten", satz: "Was der Islam an Abgaben und Regeln vorsieht, und wie du es ausrechnest." },
];

/** Fertige Beitraege zuerst, danach die mit "bald". */
const sortiert = (thema: string) => {
  const liste = artikel.filter((a) => a.thema === thema);
  return [...liste.filter((a) => a.to), ...liste.filter((a) => !a.to)];
};

const Zeile = ({ name, desc, icon: Icon, to }: Artikel) => {
  const inhalt = (
    <>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        <Icon className={`h-5 w-5 ${to ? "text-primary" : "text-muted-foreground"}`} aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[17px] font-bold text-foreground">{name}</span>
        <span className="mt-1 block text-[15px] text-muted-foreground">{desc}</span>
      </span>
    </>
  );

  if (to) {
    return (
      <Link
        to={to}
        className="flex w-full items-start gap-4 card-surface p-5 transition-colors hover:border-primary"
      >
        {inhalt}
      </Link>
    );
  }

  return (
    <div
      aria-disabled="true"
      className="relative flex w-full items-start gap-4 rounded-xl border border-border bg-muted p-5 opacity-70"
    >
      <span className="badge-soon absolute right-3 top-3">bald</span>
      {inhalt}
    </div>
  );
};

const Wissen = () => (
  <main className="bg-background">
    <Seo
      title="Halal-Finanzwissen | finanzmuslim"
      description="Halal-Finanzwissen nach Themen sortiert: Grundlagen, Investieren, Alltag und Pflichten. Verständlich erklärt, ohne Fachchinesisch."
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

      <section className="mt-8 max-w-3xl rounded-2xl bg-hero p-6 md:p-8">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-[17px] font-bold text-foreground">Kostenlose Vorlagen</h2>
          <Link to="/vorlagen" className="text-[14px] font-semibold text-primary hover:underline">
            Alle Vorlagen
          </Link>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {vorlagen.map((v) => (
            <Link
              key={v.slug}
              to={`/vorlagen/${v.slug}`}
              className="card-surface flex flex-col p-4 transition-colors hover:border-primary"
            >
              <span className="badge-new self-start">{v.kicker}</span>
              <span className="mt-2 block text-[15px] font-bold leading-snug text-foreground">{v.titel}</span>
              <span className="mt-1 block text-[13px] text-muted-foreground">{v.nutzenZeile}</span>
            </Link>
          ))}
        </div>
      </section>

      <nav aria-label="Themen" className="mt-8 flex max-w-3xl flex-wrap gap-2">
        {kategorien.map((k) => (
          <a
            key={k.id}
            href={`#${k.id}`}
            className="rounded-full border border-border bg-card px-4 py-2 text-[15px] font-semibold text-primary transition-colors hover:border-primary"
          >
            {k.thema} ({sortiert(k.thema).length})
          </a>
        ))}
      </nav>

      <div className="mt-10 max-w-3xl space-y-12">
        {kategorien.map((k) => (
          <div key={k.id}>
            <section id={k.id} className="scroll-mt-32">
              <h2 className="text-2xl font-bold text-foreground md:text-[28px]">{k.thema}</h2>
              <p className="mt-2 text-[16px] text-muted-foreground">{k.satz}</p>
              <div className="mt-5 space-y-4">
                {sortiert(k.thema).map((a) => (
                  <Zeile key={a.name} {...a} />
                ))}
              </div>
            </section>
            {(k.id === "grundlagen" || k.id === "alltag") && (
              <div className="mt-8">
                <AdSlot id={`wissen-${k.id}`} />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 max-w-3xl">
        <NewsletterBox />
      </div>
    </div>
  </main>
);

export default Wissen;
